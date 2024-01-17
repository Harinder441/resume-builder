const { Client } = require("@notionhq/client");
const Config = require("../config/config");
const { Sync:SyncDB,SyncMapping } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const notion = new Client({ auth: Config.notionAPI });
/**
 * Get data from a Notion database by databaseId
 * @param {string} databaseId - The ID of the Notion database
 * @returns {Promise<Array>} - An array of data from the Notion database
 */
async function getDataFromNotionDB(databaseId) {
  const response = await notion.databases.query({
    database_id: databaseId
  });
  const data = response.results;
  return data;
}

/**
 * Sync data from Notion databases to MongoDB based on SyncMapping configuration
 */
async function syncData() {
  try {
    const syncList = await SyncMapping.find();
    let totalSynced = 0;
    for (const row of syncList) {
      const { NotionDBId, columnMapObject, modelName, lastSyncedTime } = row;
      const dataToSync = await getDataToSync(NotionDBId, lastSyncedTime);
      totalSynced+=dataToSync.length;
      for (const page of dataToSync) {
        const { id, properties } = page;
        await upsertDataToServer(modelName, columnMapObject, id, properties);
      }
      row.lastSyncedTime = new Date();
      await row.save();
    }
    await SyncDB.create({totalRowSynced:totalSynced});
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Sync Failed due to internal server Error");
  }
}

/**
 * Get the column map from a Notion database by databaseId
 * @param {string} databaseId - The ID of the Notion database
 * @returns {Promise<Object|null>} - An object representing the column map or null if the database is not found
 */
async function getColumnMap(databaseId) {
  const response = await notion.databases.retrieve({
    database_id: databaseId
  });
  if (!response) {
    return null;
  }
  const { properties } = response;
  const output = {};
  Object.entries(properties).forEach(([key, value]) => {
    output[value.id] = key;
  });
  return output;
}

/**
 * Extract property value based on its type
 * @param {Object} property - The Notion property object
 * @returns {*} - Extracted property value
 */
function extractPropertyValue(property) {
  const type = property.type;
  switch (type) {
    case "title":
    case "rich_text":
      return property[type] && property[type].length > 0 ? property[type][0].text.content : null;
    case "status":
    case "select":
      return property[type] ? property[type].name : null;
    case "multi_select":
      return property[type] && property[type].length > 0 ? property[type].map((x) => x.name) : null;
    case "date":
      return property[type] ? property[type].start : null;
    case "formula":
      return extractPropertyValue(property[type]);
    case "boolean":
    case "number":
    case "checkbox":
    case "url":
    case "email":
    case "relation":
      return property[type];
    default:
      return null;
  }
}

/**
 * Get data from a Notion database to sync based on lastSyncedTime
 * @param {string} databaseId - The ID of the Notion database
 * @param {string} lastSyncedTime - The last synced time
 * @returns {Promise<Array>} - An array of data to sync from the Notion database
 */
async function getDataToSync(databaseId, lastSyncedTime) {
  const filterQuery = {
    timestamp: "last_edited_time",
    last_edited_time: {
      after: lastSyncedTime
    }
  };

  const response = await notion.databases.query({
    database_id: databaseId,
    ...(lastSyncedTime ? { filter: filterQuery } : {})
  });
  const data = response.results;
  const formattedData = formatDBDataForSync(data);
  return formattedData;
}

/**
 * Format Notion database data for sync
 * @param {Array} data - Notion database data
 * @returns {Array} - Formatted data for sync
 */
function formatDBDataForSync(data) {
  const formattedData = data.map((row) => {
    const formattedProperties = {};
    Object.entries(row.properties).forEach(([k, v]) => {
      formattedProperties[v.id] = extractPropertyValue(v);
    });
    row.properties = formattedProperties;
    return row;
  });
  return formattedData;
}

/**
 * Upsert data to MongoDB server based on modelName and columnMapObject
 * @param {string} modelName - The name of the MongoDB model
 * @param {Object} columnMapObject - The column map object
 * @param {string} pageId - The Notion page ID
 * @param {Object} properties - The properties to upsert
 */
async function upsertDataToServer(modelName, columnMapObject, pageId, properties) {
  const dataToUpsert = {};
  Object.keys(columnMapObject).forEach((key) => {
    const colId = columnMapObject[key];
    dataToUpsert[key] = colId in properties ? properties[colId] : null;
  });
  dataToUpsert.notionPageId = pageId;

  const Model = require("../models")[modelName];

  const isAlreadyExist = await Model.findOne({ notionPageId: pageId });

  if (isAlreadyExist) {
    await Model.updateOne({ notionPageId: pageId }, dataToUpsert);
  } else {
    await Model.create(dataToUpsert);
  }
}
module.exports = {
  getColumnMap,
  getDataFromNotionDB,
  syncData
};

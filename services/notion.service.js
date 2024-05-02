const { Client } = require("@notionhq/client");
const Config = require("../config/config");
const { Sync:SyncDB,SyncMapping } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const helperFunctions = require("../utils/helperFunctions");
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
      totalSynced += await getAndStoreNotionData(row);
    }
    await SyncDB.create({totalRowSynced:totalSynced});
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Sync Failed due to internal server Error"+error.message);
  }
}
/**
 * Asynchronously synchronizes data based on the provided model name.
 *
 * @param {String} modelName - The name of the model to sync data for.
 * @return {Promise} A promise that resolves when the data synchronization is complete.
 */
async function syncDataByModelName(modelName){
  try{
    const syncMap = await SyncMapping.findOne({modelName:modelName});
    if(!syncMap) return;
    const totalRowSynced = await  getAndStoreNotionData(syncMap);
    await SyncDB.create({totalRowSynced});
  }catch(error){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Sync Failed due to internal server Error"+error.message);
  }
  
}


/**
 * Asynchronously retrieves data from Notion and stores it based on the provided syncMap.
 *
 * @param {Object} syncMap - The map containing NotionDBId, columnMapObject, modelName, and lastSyncedTime.
 * @return {number} The total number of items synced.
 */
async function getAndStoreNotionData(syncMap){
  if(!syncMap) return;
  let totalSynced = 0;
  const { NotionDBId, columnMapObject, modelName, lastSyncedTime } = syncMap;
  const dataToSync = await getDataToSync(NotionDBId, lastSyncedTime);
  totalSynced+=dataToSync.length;
  for (const page of dataToSync) {
    const { id, properties } = page;
    await upsertDataToServer(modelName, columnMapObject, id, properties);
  }
  syncMap.lastSyncedTime = new Date();
  await syncMap.save();
  return totalSynced;
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


async function getDatabaseList() {
  const response = await notion.search({
    filter: {
      'value': 'database',
      'property': 'object'
    }
  });
  if (!response) {
    return null;
  }
  const {results} = response;
  const map = {};
  for (const result of results) {
    map[result.id] = result.title[0]?.plain_text;
  }
  return map ;
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
  for (const [key, colId] of Object.entries(columnMapObject)) {
    dataToUpsert[key] = properties[colId] ?? null;
  }
  dataToUpsert.notionPageId = pageId;
  const Models = require("../models/NotionModels");
  if(!modelName in Models) return;

  const Model = Models[modelName];

  const isAlreadyExist = await Model.findOne({ notionPageId: pageId });

  if (isAlreadyExist) {
    await Model.updateOne({ notionPageId: pageId }, dataToUpsert);
  } else {
    await Model.create(dataToUpsert);
  }
}

async function getOptionListForResume(modelName){
  const Models = require("../models/NotionModels");
  if(!modelName in Models) return;
  const Model = Models[modelName];
  let filters =getResumeFilters(modelName);
  let sort = getResumeSort(modelName);
  const data = await Model.find(filters,{title:1}).sort(sort);
  const map = {};
  if(data.length>0){
    data.map(
      (row)=>{
        map[row._id] = row.title
      }
    )
  }
  return map;
}
/**
 * Returns a map of all models and their respective columns.
 *
 * @return {Object} Map of models and their columns
 */
function getListOfAllModels(){
  const Models = require("../models/NotionModels");
  const listOfModels = Object.keys(Models);
  const Map={};
  listOfModels.forEach((model)=>{
    Map[model] = model;
  })
  return Map;
}
/**
 * Gets the list of columns of the specified model.
 *
 * @param {string} modelName - The name of the model
 * @return {array} The list of columns of the model
 */
function getListOfColumnsOfModel(modelName){
  const Models = require("../models/NotionModels");
  if(!modelName in Models) return;
  const Model = Models[modelName];
  const Map = Model.schema.paths;
  delete Map._id;
  delete Map.notionPageId;
  delete Map.__v;
  delete Map.title;
  const NewMap ={};
  Object.keys(Map).forEach((key)=>{
    NewMap[key] = helperFunctions.capitalizeFirstLetter(key);
  });
  return NewMap;
}


/**
 * Retrieves filters for the specified model.
 *
 * @param {string} modelName - The name of the model to retrieve filters for.
 * @return {object} The filters for the specified model.
 */
function getResumeFilters(modelName){
  switch (modelName) {
       case "ProjectsDB":
          return {
            status:"Done"
          }
       default:
          return {}
  }
}

/**
 * Returns a sort function based on the modelName provided.
 *
 * @param {string} modelName - The name of the model used to determine the sort function.
 * @return {function} The sort function based on the modelName.
 */
function getResumeSort(modelName) {
  switch (modelName) {
    case "ProjectsDB":
      return {
        days:-1
      };
    default:
      return {};
  }
}

/**
 * Add a page to a Notion database
 * @param {string} databaseId - The ID of the Notion database
 * @param {object} data - The data attributes for the new page
 * @returns {Promise<object>} - The newly created page object
 */
async function addPageToNotionDB(databaseId, data) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      ...data,
    });
    return response;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to add page to Notion database: " + error.message);
  }
}
async function updatePageNotionDB(pageId, data){
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      ...data,
    });
    return response;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update page in Notion database: " + error.message);
  }
}
// const database = async () => {
//   const data = await notion.databases.retrieve({ database_id: "f7a68e29af754c80a9008463940e15e7" });
//   console.log(data);
// };
// database();
const getParagraph = (text) => {
  return  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      // text: [
      //   {
      //     type: 'text',
      //     text: {
      //       content: text,
      //     },
      //   },
      // ],
      rich_text: [
        {
          text: {
            content: text
          }
        }
      ]
    },
  }
}
module.exports = {
  getColumnMap,
  getDataFromNotionDB,
  syncData,
  getOptionListForResume,
  getListOfAllModels,
  syncDataByModelName,
  getDatabaseList,
  getListOfColumnsOfModel,
  addPageToNotionDB,
  updatePageNotionDB,
  getParagraph
};

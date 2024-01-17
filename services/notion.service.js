const { Client } = require("@notionhq/client");
const Config = require("../config/config");
const notion = new Client({ auth: Config.notionAPI });
// console.log(Config.notionAPI);
// (async () => {
//   const databaseId = Config.notion.socialLinksDB;
//   const ans = await getDataFromNotionDB(databaseId);
//   console.log(ans);
// })();

async function getDataFromNotionDB(databaseId) {
  const response = await notion.databases.query({
    database_id: databaseId
    // filter: {
    //   property: 'Last ordered',
    //   date: {
    //     past_week: {},
    //   },
    // },
    // sorts: [
    //   {
    //     timestamp: 'created_time',
    //     direction: 'descending',
    //   },
    // ]
  });
  const data = response.results;
  const formattedData = data.map((row) => {
    const formattedProperties = {};
    Object.entries(row.properties).forEach(([k, v]) => {
      formattedProperties[k] = extractPropertyValue(v);
    });
    row.properties = formattedProperties;
    return row;
  });
  return formattedData;
}

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
module.exports = {
  getColumnMap
};

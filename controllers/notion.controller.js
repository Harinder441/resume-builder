const notionService = require("../services/notion.service");
const catchAsync = require("../utils/catchAsync");

const getDatabaseList = catchAsync(async (req, res) => {
  const list = await notionService.getDatabaseList();
  res.json(list);
})

const getDatabaseColumns = catchAsync(async (req, res) => {
  const db_id = req.params.id;
  const list = await notionService.getColumnMap(db_id);
  res.json(list);
});


const getDataFromDB = catchAsync(async (req, res) => {
  const db_id = req.params.id;
  const list = await notionService.getDataFromNotionDB(db_id);
  res.json(list);
});

const syncNotionDataWithServer = catchAsync(async (req, res) => {
  const model_name = req.params.modelName;
  if(model_name){
    await notionService.syncDataByModelName(model_name);
  }else{
    await notionService.syncData();
  }
  res.json("Successfully Synced");
});

const getNotionModelsList = catchAsync(async (req, res) => {
  const list = await notionService.getListOfAllModels();
  res.json(list);
})
const getNotionModelColumnsList = catchAsync(async (req, res) => {
  const model_name = req.params.modelName;
  const list = await notionService.getListOfColumnsOfModel(model_name);
  res.json(list);
})

const getOptionListForResume = catchAsync(async (req, res) => {
  const model_name = req.params.modelName;
  const list = await notionService.getOptionListForResume(model_name);
  res.json(list);
})
module.exports = {
  getDatabaseColumns,
  getDataFromDB,
  syncNotionDataWithServer,
  getNotionModelsList,
  getOptionListForResume,
  getDatabaseList,
  getNotionModelColumnsList
};

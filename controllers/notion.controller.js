const notionService = require('../services/notion.service');

const getDatabaseColumns = async (req, res) => {
    const db_id = req.params.id;
    const list = await notionService.getColumnMap(db_id);
    res.json(list);
};

const getDataFromDB = async (req, res) => {
    const db_id = req.params.id;
    const list = await notionService.getDataFromNotionDB(db_id);
    res.json(list);
};
const syncNotionDataWithServer = async (req, res) => {
  await notionService.syncData();
  res.json("Successfully Synced");
};



module.exports = {
  getDatabaseColumns,
  getDataFromDB,
  syncNotionDataWithServer
};
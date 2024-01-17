const { getColumnMap } = require('../services/notion.service');

const getDatabaseColumns = async (req, res, next) => {
  try {
    const db_id = req.params.id;
    const list = await getColumnMap(db_id);
    res.json(list);
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getDatabaseColumns,
};
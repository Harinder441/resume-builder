const { getSyncMapping, createSyncMapping } = require('../services/sync.service');

const getSyncMappingController = async (req, res, next) => {
  try {
    const syncMapping = await getSyncMapping();
    res.json(syncMapping);
  } catch (error) {
    next(error);
  }
};

const createSyncMappingController = async (req, res, next) => {
  const { modelName, columnMapObject, NotionDBId } = req.body;
  try {
    const newSyncMapping = await createSyncMapping(modelName, columnMapObject, NotionDBId);
    res.status(201).json(newSyncMapping);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSyncMappingController,
  createSyncMappingController,
};
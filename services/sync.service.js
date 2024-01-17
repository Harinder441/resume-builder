const SyncMapping = require('../models/SyncMapping.model');

const getSyncMapping = async () => {
  return SyncMapping.find();
};

const createSyncMapping = async (modelName, columnMapObject, NotionDBName) => {
  const syncMapping = new SyncMapping({
    modelName,
    columnMapObject,
    NotionDBName,
  });
  return syncMapping.save();
};

module.exports = {
  getSyncMapping,
  createSyncMapping,
};

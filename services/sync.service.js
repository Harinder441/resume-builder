const {SyncMapping} = require('../models');
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const getSyncMapping = async () => {
  return SyncMapping.find();
};

const createSyncMapping = async (mapBody) => {
  const isAlreadyExist = await SyncMapping.findOne({modelName:mapBody.modelName});
  if(isAlreadyExist){
    throw new ApiError(httpStatus.BAD_REQUEST,"Map already Exist");
  }
  const syncMapping = await SyncMapping.create(mapBody);
  return syncMapping.save();
};

module.exports = {
  getSyncMapping,
  createSyncMapping,
};

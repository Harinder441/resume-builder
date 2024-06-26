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
  const syncMapping = await SyncMapping.create(addCommonColumnMap(mapBody));
  return syncMapping.save();
};
const updateSyncMapping = async (id,mapBody) => {
  const syncMap = await SyncMapping.findById(id);
  if(!syncMap){
    throw new ApiError(httpStatus.BAD_REQUEST,"Map not found");
  }
  return syncMap.updateOne(addCommonColumnMap(mapBody));  
}
const addCommonColumnMap = (mapBody) => {
  if(!"title" in mapBody.columnMapObject){
    mapBody.columnMapObject.title = "title";
  }
  return mapBody;
}
module.exports = {
  getSyncMapping,
  createSyncMapping,
  updateSyncMapping
};

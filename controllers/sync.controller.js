const httpStatus = require("http-status");
const { getSyncMapping, createSyncMapping } = require('../services/sync.service');
const catchAsync = require("../utils/catchAsync");

const getSyncMappingController = async (req, res, next) => {
  try {
    const syncMapping = await getSyncMapping();
    res.json(syncMapping);
  } catch (error) {
    next(error);
  }
};

const createSyncMappingController =  catchAsync(async (req, res, next) => {
  const mapBody = req.body;
  const newSyncMapping = await createSyncMapping(mapBody);
  res.status(httpStatus.CREATED).send(newSyncMapping);
  
});

module.exports = {
  getSyncMappingController,
  createSyncMappingController,
};
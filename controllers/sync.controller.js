const httpStatus = require("http-status");
const syncService = require("../services/sync.service");
const catchAsync = require("../utils/catchAsync");

const getSyncMappingController = catchAsync(async (req, res, next) => {
  const syncMapping = await syncService.getSyncMapping();
  res.json(syncMapping);
});

const createSyncMappingController = catchAsync(async (req, res, next) => {
  const mapBody = req.body;
  const newSyncMapping = await syncService.createSyncMapping(mapBody);
  res.status(httpStatus.CREATED).send(newSyncMapping);
});

const updateSyncMappingController = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const mapBody = req.body;
  const newSyncMapping = await syncService.updateSyncMapping(id,mapBody);
  res.status(httpStatus.CREATED).send(newSyncMapping);
})
module.exports = {
  getSyncMappingController,
  createSyncMappingController,
  updateSyncMappingController
};

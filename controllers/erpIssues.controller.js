const httpStatus = require("http-status");
const service = require("../services/erpIssues.service");
const catchAsync = require("../utils/catchAsync");
const { cacheMiddleware, setCache } = require('../middlewares/cache');

const getIssues = catchAsync(async (req, res, next) => {
    const list = await service.getIssues(req.query);
    setCache(req.originalUrl || req.url, list);

    res.json(list);
});
const getRowByIndex = catchAsync(async (req, res, next) => {
    const {row_index} = req.params;
    // console.log(req,row_index);
    const list = await service.getRowByIndex(row_index);
    res.json(list);
});
const updateStatus = catchAsync(async (req, res, next) => {
    const {row_index,status} = req.body;
    await service.updateStatus( row_index,status);
    res.json("Successfully Updated");
    
});
const createNotionTask = catchAsync(async (req, res, next) => {
    await service.createNotionTask( req.body);
    res.json("Successfully Updated");
    
});


module.exports = {
    getIssues,
    updateStatus,
    getRowByIndex,
    createNotionTask
    
}
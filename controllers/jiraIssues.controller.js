const httpStatus = require("http-status");
const service = require("../services/jiraIssues.service");
const catchAsync = require("../utils/catchAsync");

const getIssues = catchAsync(async (req, res, next) => {
    const {page,size} = req.query;
    const startAt = (page-1)*size;
    const maxResults = size;
    const list = await service.getAllIssues(startAt,maxResults);
    const formattedList ={
        total: list.total,
        data: list.issues
    }
    res.json(formattedList);
});

module.exports = {
    getIssues

}
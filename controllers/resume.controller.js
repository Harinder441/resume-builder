const httpStatus = require("http-status");
const resumeService = require("../services/resume.service");
const catchAsync = require("../utils/catchAsync");

const getResume = catchAsync(async (req, res, next) => {
    const resume = await resumeService.getResumeById(req.params.id);
    res.json(resume);
});
const updateResume = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const resumeBody = req.body;
    const resume = await resumeService.updateResume(id,resumeBody);
    res.status(httpStatus.CREATED).send(resume);
})
const createResume = catchAsync(async (req, res, next) => {
    const resumeBody = req.body;
    const resume = await resumeService.createNewResume(resumeBody);
    res.status(httpStatus.CREATED).send(resume);
})
const getAllResume = catchAsync(async (req, res, next) => {
    const resumes = await resumeService.getAllResume();
    res.json(resumes);
})
module.exports = {
    getResume,
    updateResume,
    createResume,
    getAllResume
}
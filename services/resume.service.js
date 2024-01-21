const { Resume } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getResumeById = async (id) => {
    const resume = await Resume.findById(id);
    if(!resume){
        throw new ApiError(httpStatus.BAD_REQUEST,"Resume not found");
    }
    return resume;
}
const getAllResume = async () => {
    const resumes = await Resume.find();
    return resumes;
}
const createNewResume = async (resumeBody) => {
    const resume = await Resume.create(resumeBody);
    return resume;
}

/**
 * Updates a resume by its ID with the provided resume body.
 * Example req:
 * resumeBody = {
 * }
 * @param {string} id - The ID of the resume to be updated
 * @param {object} resumeBody - The updated resume body
 * @return {Promise} - A promise representing the update operation
 */
const updateResume = async (id,resumeBody) => {
    const resume = await getResumeById(id); 
    return resume.updateOne(resumeBody);
}

module.exports = {
    getResumeById,
    getAllResume,
    createNewResume,
    updateResume
}
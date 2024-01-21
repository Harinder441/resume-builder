const mongoose = require("mongoose");
const NotionSchemas  = require("./NotionSchemas");

module.exports = {
    EducationDB: mongoose.model("EducationDB", NotionSchemas.educationSchema),
    ProjectsDB: mongoose.model("ProjectsDB", NotionSchemas.projectsSchema),
    SkillsDB: mongoose.model("SkillsDB", NotionSchemas.skillsSchema),
    HonorsAwardDB: mongoose.model("HonorsAwardDB", NotionSchemas.honorsAwardSchema),
    PersonalInfoDB: mongoose.model("PersonalInfoDB", NotionSchemas.personalInfoSchema),
    SocialLinksDB: mongoose.model("SocialLinksDB", NotionSchemas.socialLinksSchema),
    ExperiencesDB: mongoose.model("ExperiencesDB", NotionSchemas.experiencesSchema)
};
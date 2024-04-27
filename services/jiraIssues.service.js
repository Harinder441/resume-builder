const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const axios = require('axios');
const host = "https://akalerpjira.atlassian.net";
const headers = {
    "Accept": "application/json",
    "Authorization": "Basic " + Buffer.from(process.env.JIRA_USERNAME + ":" + process.env.JIRA_PASSWORD).toString("base64")
}
const myAccountId= "712020:2597367b-0e2a-4878-be49-bdb8b917308a";
const getAllIssues = async (startAt = 0, maxResults = 50,jql = "") => {
    try {
        const response = await axios.get(`${host}/rest/api/2/search`, {
            params: {
                jql,
                startAt,
                maxResults,
                fields: "status,assignee,updated,priority,issuetype,statuscategorychangedate,created,components,description,summary,creator,reporter"
            },
            headers: headers
        });
        return response.data;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get issues: " + error.message);
    }
}

const jiraSyncNotionDB = async () => {
    try {
        const jiraIssues = await getAllIssues(0,100,`assignee=${myAccountId}`);
        const jiraIssuesList = jiraIssues.issues;
        const jiraIssueIndex = 0;
        const jiraIssue = jiraIssuesList[jiraIssueIndex];
        return jiraIssue;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get issues: " + error.message);
    }
}

module.exports = { getAllIssues };

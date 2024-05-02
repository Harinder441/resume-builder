const ApiError = require("../utils/ApiError");
const notionService = require("./notion.service");
const httpStatus = require("http-status");
const axios = require("axios");
const JiraSync = require("../models/JiraSync.model");
const host = "https://akalerpjira.atlassian.net";
const headers = {
  Accept: "application/json",
  Authorization: "Basic " + Buffer.from(process.env.JIRA_USERNAME + ":" + process.env.JIRA_PASSWORD).toString("base64")
};
const myAccountId = "712020:2597367b-0e2a-4878-be49-bdb8b917308a";
const getAllIssues = async (startAt = 0, maxResults = 50, jql = "") => {
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
};

const jiraSyncNotionDB = async () => {
  const taskDB = "5f1f9d35972143cb855d30ee1adb0680";
  try {
    const jiraIssues = await getAllIssues(0, 100, `assignee=${myAccountId}`);
    const jiraIssuesList = jiraIssues.issues;
    // const jiraIssueIndex = 0;
    // // const jiraIssue = jiraIssuesList[jiraIssueIndex];
    // {
    //     "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
    //     "id": "10123",
    //     "self": "https://akalerpjira.atlassian.net/rest/api/2/issue/10123",
    //     "key": "AK-98",
    //     "fields": {
    //         "summary": "Session change process for AU",
    //         "statuscategorychangedate": "2024-02-19T23:16:20.954+0530",
    //         "issuetype": {
    //             "self": "https://akalerpjira.atlassian.net/rest/api/2/issuetype/10005",
    //             "id": "10005",
    //             "description": "A small, distinct piece of work.",
    //             "iconUrl": "https://akalerpjira.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10318?size=medium",
    //             "name": "Task",
    //             "subtask": false,
    //             "avatarId": 10318,
    //             "hierarchyLevel": 0
    //         },
    //         "components": [
    //             {
    //                 "self": "https://akalerpjira.atlassian.net/rest/api/2/component/10000",
    //                 "id": "10000",
    //                 "name": "FeeadminPanel"
    //             }
    //         ],
    //         "creator": {
    //             "self": "https://akalerpjira.atlassian.net/rest/api/2/user?accountId=557058%3A95516790-e1cd-46f8-be7c-0ac0afcfeea3",
    //             "accountId": "557058:95516790-e1cd-46f8-be7c-0ac0afcfeea3",
    //             "avatarUrls": {
    //                 "48x48": "https://secure.gravatar.com/avatar/93cb375481b395db9b170c37da309cc6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHS-2.png",
    //                 "24x24": "https://secure.gravatar.com/avatar/93cb375481b395db9b170c37da309cc6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHS-2.png",
    //                 "16x16": "https://secure.gravatar.com/avatar/93cb375481b395db9b170c37da309cc6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHS-2.png",
    //                 "32x32": "https://secure.gravatar.com/avatar/93cb375481b395db9b170c37da309cc6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHS-2.png"
    //             },
    //             "displayName": "Harjit Singh",
    //             "active": true,
    //             "timeZone": "Asia/Calcutta",
    //             "accountType": "atlassian"
    //         },
    //         "created": "2024-02-13T13:24:56.471+0530",
    //         "description": "Session change process for AU",
    //         "reporter": {
    //             "self": "https://akalerpjira.atlassian.net/rest/api/2/user?accountId=557058%3A95516790-e1cd-46f8-be7c-0ac0afcfeea3",
    //             "accountId": "557058:95516790-e1cd-46f8-be7c-0ac0afcfeea3",
    //             "avatarUrls": {
    //                 "48x48": "https://secure.gravatar.com/avatar/93cb375481b395db9b170c37da309cc6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHS-2.png",
    //                 "24x24": "https://secure.gravatar.com/avatar/93cb375481b395db9b170c37da309cc6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHS-2.png",
    //                 "16x16": "https://secure.gravatar.com/avatar/93cb375481b395db9b170c37da309cc6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHS-2.png",
    //                 "32x32": "https://secure.gravatar.com/avatar/93cb375481b395db9b170c37da309cc6?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHS-2.png"
    //             },
    //             "displayName": "Harjit Singh",
    //             "active": true,
    //             "timeZone": "Asia/Calcutta",
    //             "accountType": "atlassian"
    //         },
    //         "priority": {
    //             "self": "https://akalerpjira.atlassian.net/rest/api/2/priority/3",
    //             "iconUrl": "https://akalerpjira.atlassian.net/images/icons/priorities/medium.svg",
    //             "name": "Medium",
    //             "id": "3"
    //         },
    //         "assignee": {
    //             "self": "https://akalerpjira.atlassian.net/rest/api/2/user?accountId=712020%3A2597367b-0e2a-4878-be49-bdb8b917308a",
    //             "accountId": "712020:2597367b-0e2a-4878-be49-bdb8b917308a",
    //             "emailAddress": "harindersingh2107@gmail.com",
    //             "avatarUrls": {
    //                 "48x48": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:2597367b-0e2a-4878-be49-bdb8b917308a/043381e0-7e11-4772-9a6b-b84ddfebf5d0/48",
    //                 "24x24": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:2597367b-0e2a-4878-be49-bdb8b917308a/043381e0-7e11-4772-9a6b-b84ddfebf5d0/24",
    //                 "16x16": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:2597367b-0e2a-4878-be49-bdb8b917308a/043381e0-7e11-4772-9a6b-b84ddfebf5d0/16",
    //                 "32x32": "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/712020:2597367b-0e2a-4878-be49-bdb8b917308a/043381e0-7e11-4772-9a6b-b84ddfebf5d0/32"
    //             },
    //             "displayName": "Harinder Singh",
    //             "active": true,
    //             "timeZone": "Asia/Calcutta",
    //             "accountType": "atlassian"
    //         },
    //         "updated": "2024-02-19T23:16:20.954+0530",
    //         "status": {
    //             "self": "https://akalerpjira.atlassian.net/rest/api/2/status/3",
    //             "description": "This issue is being actively worked on at the moment by the assignee.",
    //             "iconUrl": "https://akalerpjira.atlassian.net/images/icons/statuses/inprogress.png",
    //             "name": "In Progress",
    //             "id": "3",
    //             "statusCategory": {
    //                 "self": "https://akalerpjira.atlassian.net/rest/api/2/statuscategory/4",
    //                 "id": 4,
    //                 "key": "indeterminate",
    //                 "colorName": "yellow",
    //                 "name": "In Progress"
    //             }
    //         }
    //     }
    // },
    jiraIssuesList.forEach(async (jiraIssue) => {
      const is_exist = await JiraSync.findOne({ issueKey: jiraIssue.key });
      const statusMap = {
        "To Do": "Not started",
        "In Review": "Done",

      }
      const data = {
        name: jiraIssue.fields.summary,
        jiraKey: jiraIssue.key,
        status: jiraIssue.fields.status.name in statusMap?statusMap[jiraIssue.fields.status.name]:jiraIssue.fields.status.name,
        issueType: jiraIssue.fields.issuetype.name,
        description: jiraIssue.fields.description??"",
        created: new Date(jiraIssue.fields.created).toISOString(),
      };
      if (is_exist) {
        await notionService.updatePageNotionDB(is_exist.notionPageId, {
          properties: {
            Status: {
              status: {
                name: data.status
              }
            },
            "Jira Created":{
              date: {
                start: data.created
              }
            }
          }
        });
      } else {
        const response = await notionService.addPageToNotionDB(taskDB, {
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: data.name
                  }
                }
              ]
            },
            // "Due Date": {
            //     "date": {
            //         "start": data.dueDate
            //     }
            // },
            "Jira Key": {
              rich_text: [
                {
                  text: {
                    content: data.jiraKey
                  }
                }
              ]
            },
            Status: {
              status: {
                name: data.status
              }
            },
            "Dev Task Type": {
              select: {
                name: data.issueType
              }
            },
            "Which Role?": {
              relation: [
                {
                  id: "2235397bb07144e2b262f1358d1c228e"
                }
              ]
            }
            // "Problem URL": {
            //     "url": data.problemURL
            // },
          },
          icon: { type: "emoji", emoji: "☑" },
          // templates: [{
          //     pageId: 'efba3288479a477695d006525dba10f1',
          // }],
          content: [
            {
              paragraph: {
                rich_text: [
                  {
                    text: {
                      content: data.description
                    }
                  }
                ]
              }
            }
          ]
        });
        // console.log(response);
        await JiraSync.create({
          issueKey: jiraIssue.key,
          notionPageId: response.id
        });
      }
    });

    // return jiraIssue;
    // https://www.notion.so/efba3288479a477695d006525dba10f1
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get issues: " + error.message);
  }
};

// jiraSyncNotionDB();
module.exports = { getAllIssues, jiraSyncNotionDB };

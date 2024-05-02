const googleSheets = require("./googleSheets.service");

const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const axios = require("axios");
const notionService = require("./notion.service");

const spreadsheetId = "10qazN2veVcJRMVO-FWzS46V6cKvjko1P7Msm6GzYf9c";
const sheetName = "2024-25 issue sheet";
const columnsMap = {
  issueNo: "Issue No",
  module: "Module",
  issueDiscription: "Issue Discription",
  reportedByErp: "Reported By(ERP)",
  reportingDate: "Reporting Date",
  issueType: "Select Type",
  applicationUrl: "Application URL",
  resourcesLink: "Resources Link",
  priority: "Priority",
  status: "Status",
  timeRequired: "Time Required",
  needToCreateJiraIssue: "Need to create Jira Issue?",
  resolutionGiven: "Resolution GIven",
  devComments: "Dev Comments",
  row_index: "row_index"
};
const statusMap = {
  notStarted: "Select Status",
  inProgress: "In Progress",
  inReview: "In Review",
  done: "Done"
};
const getIssues = async (query) => {
  try {
    const rows = await googleSheets.getAllRows(spreadsheetId, sheetName);
    const formattedRows = rows.map((row) => {
      const formattedRow = {};
      for (const key in columnsMap) {
        formattedRow[key] = row[columnsMap[key]];
      }
      return formattedRow;
    });

    const filteredRows = formattedRows.filter((row) => {
      for (const key in columnsMap) {
        let value = "";
        if (query[key]) {
          if (key === "status") {
            value = statusMap[query[key]];
          } else {
            value = query[key];
          }
        }

        if (value && row[key] !== value) {
          return false;
        }
      }
      return true;
    });
    return filteredRows;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const createNotionTask = async (data) => {
  const taskDB = "5f1f9d35972143cb855d30ee1adb0680";
  //   {
  //     "issueNo": "1",
  //     "module": "HR",
  //     "issueDiscription": "Emp ID is 6104 view sheet not open",
  //     "reportedByErp": "Simar",
  //     "reportingDate": "26-04-2024",
  //     "issueType": "Bug",
  //     "applicationUrl": "https://kalgidhartrust.info/akal_erp/public/hr/info/6104",
  //     "resourcesLink": "",
  //     "priority": "Low",
  //     "status": "Select Status",
  //     "timeRequired": "10 days",
  //     "needToCreateJiraIssue": "No",
  //     "resolutionGiven": "",
  //     "devComments": "",
  //     "row_index": 1
  // }
  const statusMap = {
    "Select Status": "Not started",
    "In Progress": "In Progress",
    "In Review": "Done",
    Done: "Done"
  };
  try {
    const response = await notionService.addPageToNotionDB(taskDB, {
      properties: {
        Name: {
          title: [
            {
              text: {
                content: data.issueDiscription
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
                content: data.issueNo
              }
            }
          ]
        },
        Status: {
          status: {
            name: statusMap[data.status] ?? "Not started"
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
      children: [
        notionService.getParagraph(data.resourcesLink??""),
        notionService.getParagraph(data.devComments??""),
        notionService.getParagraph(data.resolutionGiven??""),
        notionService.getParagraph(data.reportedByErp??""),
        notionService.getParagraph(data.reportedDate??""),
        notionService.getParagraph(data.applicationUrl??""),
        notionService.getParagraph(data.timeRequired??""),
        notionService.getParagraph(data.needToCreateJiraIssue??""),
        notionService.getParagraph(data.priority??"")
      ]
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get issues: " + error.message);
  }
};
const getRowByIndex = async (row_index) => {
  try {
    const rows = await googleSheets.getRowByIndex(spreadsheetId, sheetName, row_index);
    const formattedRows = rows.map((row) => {
      const formattedRow = {};
      for (const key in columnsMap) {
        formattedRow[key] = row[columnsMap[key]];
      }
      return formattedRow;
    });
    return formattedRows;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const updateStatus = async (row_index, status) => {
  try {
    const dataToUpdate = {
      [columnsMap.status]: status
    };

    await googleSheets.updateRowByHeaderName(spreadsheetId, sheetName, dataToUpdate, row_index);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const createJiraIssue = async (row_index) => {};

module.exports = {
  getIssues,
  updateStatus,
  getRowByIndex,
  createNotionTask
};

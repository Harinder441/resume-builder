const googleSheets = require("./googleSheets.service");

const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const spreadsheetId="10qazN2veVcJRMVO-FWzS46V6cKvjko1P7Msm6GzYf9c";
const sheetName="2024-25 issue sheet";
const columnsMap ={
    issueNo:"Issue No",
    module:"Module",
    issueDiscription:"Issue Discription",
    reportedByErp:"Reported By(ERP)",
    reportingDate:"Reporting Date",
    issueType:"Select Type",
    applicationUrl:"Application URL",
    resourcesLink:"Resources Link",
    priority:"Priority",
    status:"Status",
    timeRequired:"Time Required",
    needToCreateJiraIssue:"Need to create Jira Issue?",
    resolutionGiven:"Resolution GIven",
    devComments:"Dev Comments",
    row_index:"row_index"
}

const getIssues= async () => {
    try {
        const rows = await googleSheets.getAllRows(spreadsheetId,sheetName);
        const formattedRows = rows.map((row) => {
            const formattedRow = {};
            for (const key in columnsMap) {
                formattedRow[key] = row[columnsMap[key]];
            }
            return formattedRow;
        })
        return formattedRows;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  const getRowByIndex= async (row_index) => {
    try {
        const rows = await googleSheets.getRowByIndex(spreadsheetId,sheetName,row_index);
        const formattedRows = rows.map((row) => {
            const formattedRow = {};
            for (const key in columnsMap) {
                formattedRow[key] = row[columnsMap[key]];
            }
            return formattedRow;
        })
        return formattedRows;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  const updateStatus = async (row_index, status) => {
    try {
    
        const dataToUpdate = {
            
            [columnsMap.status]:status
        }
      
      await googleSheets.updateRowByHeaderName(spreadsheetId,sheetName,dataToUpdate,row_index);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  module.exports = {
    getIssues,
    updateStatus,
    getRowByIndex
  }
const { google } = require("googleapis");
const auth = require("../utils/credentials-load");

async function getAllRows( spreadsheetId, sheetName) {
  const sheets = google.sheets({ version: "v4", auth });
  //get a range of values
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetName
  });
  //print results
  const result= sheetRowsToObjects(res.data.values);
  console.log(result);
  return result;
}
async function getRowByIndex( spreadsheetId, sheetName, rowIndex) {
    const header = await getHeader(spreadsheetId, sheetName);
    const sheets = google.sheets({ version: "v4", auth });
    //get a range of values
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range:`${sheetName}!A${rowIndex + 1}`
    });
    //print results
    const result= sheetRowsToObjects(res.data.values,header);
    // console.log(result);
    return result;
  }

function sheetRowsToObjects(rows,head=null) {

  const header = head || rows[0];
  const rowsWithoutHeader = !head?rows.slice(1):rows;
  return rowsWithoutHeader.map((row,index) => {
    const obj = {};
    for (let i = 0; i < header.length; i++) {
      obj[header[i]] = row[i]??"";
    }
    obj.row_index =  index+1;
    return obj;
  });
}

async function getHeader(spreadsheetId, sheetName) {
    const sheets = google.sheets({ version: "v4", auth });
  
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!1:1`, 
    });

    return headerResponse.data.values[0];
}
// run()
async function updateRowByHeaderName(spreadsheetId, sheetName,dataToUpdate,rowIndex) {
    const sheets = google.sheets({ version: "v4", auth });
  
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!1:1`, 
    });
    const headers = headerResponse.data.values[0]; 
    const headerMap = new Map(headers.map((header, index) => [header, index]));
  

    // const dataToUpdate = {
    //   "Issue No": 18,
    //   "Select Type":"Bug",
        
    // };
  
    
    
    const oldValuesRes = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range:`${sheetName}!A${rowIndex + 1}`, 
      });
    const oldValues = oldValuesRes.data.values[0]; 

    const values = headers.map(header => dataToUpdate[header] || oldValues[headerMap.get(header)]);
    // Update the row
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A${rowIndex + 1}`, 
      valueInputOption: "RAW",
      resource: {
        values: [values]
      }
    });
  
    console.log(JSON.stringify(res.data, null, 2));
  }

 

module.exports = {getAllRows,updateRowByHeaderName,getRowByIndex}
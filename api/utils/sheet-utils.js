const { GoogleSpreadsheet } = require('google-spreadsheet');
const { posMapper } = require('../mappers/termMapper');

const getRows = async () => {
  const SHEET_ID = process.env.SHEET_ID;
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth({
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  });
  await doc.loadInfo();
  
  const sheet = doc.sheetsByIndex[0];
  return sheet.getRows();
};

const postRow = async (term) => {
  const SHEET_ID = process.env.SHEET_ID;
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth({
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  });
  await doc.loadInfo();
  
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const newRow = await sheet.addRow(term);
  newRow._id = term.en.toLowerCase().replace(" ", "_") + posMapper(term.pos);
  newRow._active = true;

  const today = new Date();
  newRow._added = today;
  newRow._modified = today;
  await newRow.save();

  return newRow;
};

const getRowByTermId = async (termId) => {
  const SHEET_ID = process.env.SHEET_ID;
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth({
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  });
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return getRowByColumnValue(termId, "_id", rows);
}

const getRowByColumnValue = (value, columnName, rows) =>
  rows.filter((row) => row[columnName] == value)[0];

const updateRow = async (row, payload) => {
  Object.keys(payload).forEach(key => {
    row[key] = payload[key];
  })
  row._modified = new Date();
  await row.save();
  return row;
}

const disableRow = async (row) => {
  row._active = false;
  await row.save();
  return row;
}

module.exports = {
  getRows: getRows,
  postRows: postRow,
  getRowByTermId: getRowByTermId,
  updateRow: updateRow,
  disableRow: disableRow,
}
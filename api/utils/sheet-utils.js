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
  const newRow = await sheet.addRow(term);
  newRow._id = term.en.toLowerCase().replace(" ", "_") + posMapper(term.pos);
  newRow._active = true;

  const variants = []
  if (term.nb) variants.push({ term: term.nb, dialect: 'nb', votes: 1});
  if (term.nn) variants.push({ term: term.nn, dialect: 'nn', votes: 1});
  newRow.variants = JSON.stringify(variants);

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

const addVariant = async (row, payload) => {
  const variants = JSON.parse(row.variants);
  variants.push({ term: payload.term, dialect: payload.dialect, votes: 1 });
  row.variants = JSON.stringify(variants);
  
  await row.save();
  return row;
}

const promoteVariant = async (row, payload) => {
  const variants = JSON.parse(row.variants);
  const variantIdx = variants.findIndex(v => v.term === payload.term && v.dialect === payload.dialect);
  variants[variantIdx].votes++;
  row.variants = JSON.stringify(variants);
  
  const variant = variants[variantIdx];
  if (variant.votes > featuredVariantVotes(row, payload.dialect))
    row[payload.dialect] = variant.term;

  await row.save();
  return row;
}

const featuredVariantVotes = (row, dialect) => {
  const featuredTerm = row[dialect];
  const variants = JSON.parse(row.variants);
  return variants.find(v => v.term === featuredTerm && v.dialect === dialect).votes;
}

const disableRow = async (row) => {
  row._active = false;
  await row.save();
  return row;
}

module.exports = {
  getRows: getRows,
  postRow: postRow,
  getRowByTermId: getRowByTermId,
  updateRow: updateRow,
  addVariant: addVariant,
  promoteVariant: promoteVariant,
  disableRow: disableRow,
}
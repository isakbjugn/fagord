const { GoogleSpreadsheet } = require('google-spreadsheet');
const { posMapper } = require('../mappers/termMapper');

const getSheet = async() => {
  const SHEET_ID = process.env.SHEET_ID;
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth({
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  });
  await doc.loadInfo();
  
  return doc.sheetsByIndex[0];
};

const getRows = async () => {
  const sheet = await getSheet();
  return sheet.getRows();
};

const postRow = async (term) => {  
  const sheet = await getSheet();
  const newRow = await sheet.addRow({ "en": term.en, "pos": term.pos });

  if (term.nb) await addVariant(newRow, { term: term.nb, dialect: 'nb' });
  if (term.nn) await addVariant(newRow, { term: term.nn, dialect: 'nn' });

  if (term.field) newRow.field = term.field;
  if (term.field && term.subfield) newRow.subfield = term.subfield;
  if (term.reference) newRow.reference = term.reference;

  newRow._id = term.en.toLowerCase().replace(" ", "_") + posMapper(term.pos);
  newRow._active = true;

  const today = new Date();
  newRow._added = today;
  newRow._modified = today;
  await newRow.save();

  return newRow;
};

const getRowByTermId = async (termId) => {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  return getRowByColumnValue(termId, "_id", rows);
}

const getRowByColumnValue = (value, columnName, rows) => {
  const row = rows.filter((row) => row[columnName] == value)[0];
  if (row === undefined) {
    const err = new Error('Termen finnes ikke.')
    err.statusCode = 404;
    throw (err);
  }
  return row;
}

const updateRow = async (row, payload) => {
  if (payload.field) row.field = payload.field;
  if (payload.subfield) row.subfield = payload.subfield;
  if (payload.pos) row.pos = payload.pos;
  if (payload.definition) row.definition = payload.definition;

  row._modified = new Date();
  await row.save();
  return row;
}

const addVariant = async (row, payload) => {
  const variant = { term: payload.term, dialect: payload.dialect, votes: 1 };
  if (!row[variant.dialect]) row[variant.dialect] = variant.term;

  const variants = (row.variants) ? JSON.parse(row.variants) : [];
  variants.push(variant);
  row.variants = JSON.stringify(variants);
  
  await row.save();
  return variant;
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
  return variants[variantIdx];
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
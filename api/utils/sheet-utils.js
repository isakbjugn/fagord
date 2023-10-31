const { GoogleSpreadsheet } = require('google-spreadsheet');
const { posMapper } = require('../mappers/term-mapper');
const { JWT } = require('google-auth-library');

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: scopes
})

const getSheet = async () => {
  const SHEET_ID = process.env.SHEET_ID;
  const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
};

const getRows = async () => {
  const sheet = await getSheet();
  return sheet.getRows();
};

const postRow = async (term) => {
  const sheet = await getSheet();
  const newRow = await sheet.addRow({ en: term.en, pos: term.pos });

  if (term.nb) await addVariant(newRow, { term: term.nb, dialect: 'nb' });
  if (term.nn) await addVariant(newRow, { term: term.nn, dialect: 'nn' });

  if (term.field) newRow.set('field', term.field);
  if (term.field && term.subfield) newRow.set('subfield', term.subfield);
  if (term.reference) newRow.set('reference', term.reference);

  newRow.set('_id', term.en.toLowerCase().replace(' ', '_') + posMapper(term.pos));
  newRow.set('_active', true);

  const today = new Date();
  newRow.set('_added', today);
  newRow.set('_modified', today);
  await newRow.save();

  return newRow;
};

const getRowByTermId = async (termId) => {
  const rows = await getRows();
  return getRowByColumnValue(termId, '_id', rows);
};

const getRowByColumnValue = (value, columnName, rows) => {
  const row = rows.filter((row) => row.get(columnName) === value)[0];
  if (row === undefined) {
    const err = new Error('Termen finnes ikke.');
    err.statusCode = 404;
    throw err;
  }
  return row;
};

const updateRow = async (row, payload) => {
  if (payload.field) row.set('field', payload.field);
  if (payload.subfield) row.set('subfield', payload.subfield);
  if (payload.pos) row.set('pos', payload.pos);
  if (payload.definition) row.set('definition', payload.definition);

  row.set('_modified', new Date());
  await row.save();
  return row;
};

const addVariant = async (row, payload) => {
  const variant = { term: payload.term, dialect: payload.dialect, votes: 1 };
  if (!row[variant.dialect]) row.set(variant.dialect, variant.term);

  const variants = row.get('variants') ? JSON.parse(row.get('variants')) : [];
  variants.push(variant);
  row.set('variants', JSON.stringify(variants));

  row.set('_modified', new Date());
  await row.save();
  return variant;
};

const promoteVariant = async (row, payload) => {
  const variants = JSON.parse(row.get('variants'));
  const variantIdx = variants.findIndex(
    (v) => v.term === payload.term && v.dialect === payload.dialect
  );
  variants[variantIdx].votes++;
  row.set('variants', JSON.stringify(variants));

  const variant = variants[variantIdx];
  if (variant.votes > featuredVariantVotes(row, payload.dialect))
    row[payload.dialect] = variant.term;

  row.set('_modified', new Date());
  await row.save();
  return variants[variantIdx];
};

const featuredVariantVotes = (row, dialect) => {
  const featuredTerm = row[dialect];
  const variants = JSON.parse(row.get('variants'));
  return variants.find((v) => v.term === featuredTerm && v.dialect === dialect)
    .votes;
};

const disableRow = async (row) => {
  row.set('_active', false);
  row.set('_modified', new Date());
  await row.save();
  return row;
};

module.exports = {
  getRows,
  postRow,
  getRowByTermId,
  updateRow,
  addVariant,
  promoteVariant,
  disableRow,
};

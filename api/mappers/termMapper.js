const { GoogleSpreadsheetRow } = require("google-spreadsheet")

const termMapper = (row) => {
  return {
    _id: row._id,
    en: row.en,
    nb: row.nb,
    nn: row.nn,
    field: row.field,
    subfield: row.subfield,
    pos: row.pos,
    reference: row.reference,
    _added: row._added,
    _modified: row._modified,
    _active: row._active,
    definition: row.definition
  }
}

const termArrayMapper = (rows) =>
  rows.map(row => termMapper(row));

module.exports = {
  termMapper: termMapper,
  termArrayMapper: termArrayMapper
}
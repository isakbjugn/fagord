const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { termMapper, termArrayMapper } = require('../mappers/termMapper');

const termRouter = express.Router();

termRouter.use(bodyParser.json());

termRouter.route('/')
  .get((req, res, next) => {
    getRows()
    .then((rows) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(termArrayMapper(rows));
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post((req, res, next) => {
    if (Object.keys(req.body) === 0) throw new Error("Ingen term i spørringen.")
    postRow(req.body)
      .then((row) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(termMapper(row));
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT-operasjonen er ikke tillatt på /termer");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE-operasjonen er ikke tillatt på /termer");
  });

termRouter.route('/:term')
  .get((req, res, next) => {
    getRowByTerm(req.params.term)
    .then((row) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(termMapper(row));
    }, (err) => next(err))
    .catch((err) => next(err));
  })
	.post((req, res, next) => {
		res.statusCode = 403;
		res.end('POST-operasjon ikke tillatt på /termer/'+ req.params.term);
	})
	.put((req, res, next) => {
    getRowByTerm(req.params.term)
    .then((row) => {
        updateRow(row, req.body)
          .then(row => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(termMapper(row));
          }, (err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err));
	})
  .delete((req, res, next) => {
    getRowByTerm(req.params.term)
    .then((row) => {
        disableRow(row)
          .then(row => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(termMapper(row));
          }, (err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err));
	})

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
  newRow._id = getMaxId(rows) + 1;
  newRow._active = true;

  const today = new Date();
  newRow._added = today;
  newRow._modified = today;
  await newRow.save();

  return newRow;
};

const getMaxId = (rows) =>
  Math.max(...rows.map(row => row._id))

const getRowByTerm = async (term) => {
  const SHEET_ID = process.env.SHEET_ID;
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth({
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  });
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return getRowByColumnValue(term, "en", rows);
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

module.exports = termRouter;
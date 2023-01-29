const express = require('express');
const bodyParser = require('body-parser');
const { getRows } = require('../utils/sheet-utils');
const { fieldMapper } = require('../mappers/fieldMapper');

const fieldRouter = express.Router();

fieldRouter.use(bodyParser.json());

fieldRouter.route('/').get((req, res, next) => {
  getRows()
    .then(
      (rows) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fieldMapper(rows));
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = fieldRouter;

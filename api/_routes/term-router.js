const express = require('express');
const bodyParser = require('body-parser');
const { termMapper, termArrayMapper } = require('../_mappers/term-mapper');
const {
  getRows,
  postRow,
  getRowByTermId,
  updateRow,
  addVariant,
  promoteVariant,
  disableRow,
} = require('../_adapter/sheets-adapter');

const termRouter = express.Router();

termRouter.use(bodyParser.json());

termRouter
  .route('/')
  .get((req, res, next) => {
    getRows()
      .then(
        (rows) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(termArrayMapper(rows));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      const err = new Error('Ingen term i spørringen');
      err.statusCode = 400;
      return next(err);
    }
    if (!req.body.en || !req.body.pos) {
      const err = new Error('Ufullstendig term i spørringen');
      err.statusCode = 400;
      return next(err);
    }
    postRow(req.body)
      .then(
        (row) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(termMapper(row));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    res.end('PUT-operasjonen er ikke tillatt på /termer');
  })
  .delete((req, res, next) => {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    res.end('DELETE-operasjonen er ikke tillatt på /termer');
  });

termRouter
  .route('/:termId')
  .get((req, res, next) => {
    getRowByTermId(req.params.termId)
      .then(
        (row) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(termMapper(row));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.end('POST-operasjon ikke tillatt på /termer/' + req.params.term);
  })
  .put((req, res, next) => {
    getRowByTermId(req.params.termId)
      .then(
        (row) => {
          updateRow(row, req.body).then(
            (row) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(termMapper(row));
            },
            (err) => next(err)
          );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    getRowByTermId(req.params.termId)
      .then(
        (row) => {
          disableRow(row).then(
            (row) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(termMapper(row));
            },
            (err) => next(err)
          );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

termRouter
  .route('/:termId/varianter')
  .get((req, res, next) => {
    getRowByTermId(req.params.termId)
      .then(
        (row) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(row.get('variants'));
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      const err = new Error('Ingen variant i spørringen');
      err.statusCode = 400;
      return next(err);
    }
    getRowByTermId(req.params.termId)
      .then(
        (row) => {
          addVariant(row, req.body).then(
            (variant) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(variant);
            },
            (err) => next(err)
          );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    getRowByTermId(req.params.termId)
      .then(
        (row) => {
          promoteVariant(row, req.body).then(
            (variant) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(variant);
            },
            (err) => next(err)
          );
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST, PUT');
    res.end(
      'DELETE-operasjon ikke tillatt på /termer/' +
        req.params.term +
        '/varianter'
    );
  });

module.exports = termRouter;

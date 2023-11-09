const express = require('express');
const bodyParser = require('body-parser');
const { getAllDocuments } = require('../_adapter/docs-adapter');
const { exportFileAsHtml } = require('../_adapter/drive-adapter');
const articleRouter = express.Router();

articleRouter.use(bodyParser.json());

articleRouter.route('/').get((req, res, next) => {
  getAllDocuments()
    .then(
      (documents) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(documents);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

articleRouter.route('/:articleId').get((req, res, next) => {
  exportFileAsHtml(req.params.articleId)
    .then(
      (result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.send(result.data);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = articleRouter;

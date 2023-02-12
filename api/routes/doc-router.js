const express = require('express');
const bodyParser = require('body-parser');
const { getAllArticles } = require('../utils/doc-utils');
const { exportFileAsHtml } = require('../utils/drive-utils');
const docRouter = express.Router();

docRouter.use(bodyParser.json());

docRouter.route('/').get((req, res, next) => {
  getAllArticles()
    .then(
      (articles) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(articles);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

docRouter.route('/:articleId').get((req, res, next) => {
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

module.exports = docRouter;

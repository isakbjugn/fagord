const express = require('express');
const bodyParser = require('body-parser');
const { getAllArticles } = require('../utils/doc-utils');
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

module.exports = docRouter;

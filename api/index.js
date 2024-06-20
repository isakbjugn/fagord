require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-doc.json');
const { verifyNoFormula } = require('./_utils/sheets-middleware');

const termRouter = require('./_routes/term-router');
const fieldRouter = require('./_routes/field-router');
const docRouter = require('./_routes/article-router');

const app = express();
app.set('port', process.env.PORT || 8080);

app.use(express.json());
app.use(cors());

app.all('*', verifyNoFormula);

app.use('/api/termer', termRouter);
app.use('/api/fagfelt', fieldRouter);
app.use('/api/artikler', docRouter);
app.use('/api/dok', swaggerUi.serve, swaggerUi.setup(swaggerFile, { customCssUrl: process.env.SWAGGER_CSS_URL }));

app.get('/api', (req, res) => {
  res.send('Se /api/dok for API-dokumentasjon');
});

app.listen(app.get('port'), () => {
  console.log('Tjener kjører på port', app.get('port'));
  console.log(`API-dokumentasjon er tilgjengelig på ${process.env.BACKEND_URL}/api`)
});

module.exports = app;

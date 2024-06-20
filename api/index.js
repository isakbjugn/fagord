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
app.use('/api/dok', swaggerUi.serve, swaggerUi.setup(swaggerFile,
  {
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  }
));

app.listen(app.get('port'), () => {
  if (process.env.ENVIRONMENT === 'development') {
    console.log('Tjener kjører på port', app.get('port'));
    console.log(`API-dokumentasjon er tilgjengelig på http://${process.env.BACKEND_HOST}/api`)
  }
});

module.exports = app;

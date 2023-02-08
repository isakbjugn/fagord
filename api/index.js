require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { verifyNoFormula } = require('./utils/sheet-middleware');

const termRouter = require('./routes/term-router');
const fieldRouter = require('./routes/field-router');
const docRouter = require('./routes/doc-router');

const app = express();
app.set('port', process.env.PORT || 8080);

app.use(express.json());
app.use(cors());

app.all('*', verifyNoFormula);

app.use('/api/termer', termRouter);
app.use('/api/fagfelt', fieldRouter);
app.use('/api/artikler', docRouter);

app.get('/api', (req, res) => {
  res.send('Express på Vercel!');
});

app.listen(app.get('port'), () => {
  console.log('Tjener kjører på port', app.get('port'));
});

module.exports = app;

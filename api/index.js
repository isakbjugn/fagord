require('dotenv').config();

const express = require('express');
const cors = require('cors');

var termRouter = require('./routes/termRouter');
var fieldRouter = require('./routes/fieldRouter');

const app = express();
app.set('port', (process.env.PORT || 8080))

app.use(express.json());
app.use(cors())

app.use('/api/termer', termRouter);
app.use('/api/fagfelt', fieldRouter);

app.get("/api", (req, res) => {
  res.send("Express på Vercel!")
});

app.listen(app.get('port'), () => {
  console.log("Tjener kjører på port", app.get('port'));
});

module.exports = app;
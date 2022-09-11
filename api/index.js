require('dotenv').config();

const express = require('express');

var termRouter = require('./routes/termRouter');

const app = express();
app.set('port', (process.env.PORT || 8080))

app.use(express.json());

app.use('/api/termer', termRouter);

app.get("/api", (req, res) => {
  res.send("Express på Vercel!")
});

app.listen(app.get('port'), () => {
  console.log("Tjener kjører på port", app.get('port'));
});

module.exports = app;
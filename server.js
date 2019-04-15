const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

// database
const db = require('./models');

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve static assets
app.use(express.static(__dirname + '/public'));

// ROOT route
app.get('/', (req, res) => {
  res.sendFile('views/index.html', {root: __dirname});
});

// start server
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
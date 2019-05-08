const express = require('express');
let app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.post('/feed', function (req, res) {
  //TODO:
});

app.get('/feed', function (req, res) {
  //TODO:
});

let port = 8080;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});


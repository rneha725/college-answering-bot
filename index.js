var express = require('express');
var app = express();

//For post request
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const PORT = 2000;

app.listen(PORT, function() {
    console.log('listening at localhost:'+PORT);
});


app.get('/', function(req, res) {
    res.send('Navigate Furthur Please...');
});

app.get('/home', function(req, res) {
    res.sendfile('public/index.html');
});

app.post('/home', function(req, res) {
    var question = req.body.question;
    console.log(question);
    res.send("HI, what are you doing here...");
});

app.use(express.static('public'));
app.use(express.static('public/libs/'));
app.use(express.static('public/libs/bootstrap-3.3.7-dist/js/'));
app.use(express.static('public/libs/bootstrap-3.3.7-dist/css/'));
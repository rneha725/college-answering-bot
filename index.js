var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');

var app = express();

//stanford-corenlp
var NLP = require('stanford-corenlp');

var config = {
    "nlpPath":"./corenlp",
    "version":"3.6.0",
    'annotators': ['tokenize','ssplit','pos','parse','sentiment','depparse','quote'], //optional!
	'extra' : {
      'depparse.extradependencie': 'MAXIMAL'
    }
}

var coreNLP = new NLP.StanfordNLP(config);

var server = http.createServer(function (request, response) {
  var queryData = url.parse(request.url, true).query;
  response.writeHead(200, {"Content-Type": "text/plain"});

  if (queryData.q) {
    
    coreNLP.process(queryData.q, function(err, result) {
	    if(err)
	    	throw err;
	    else
	    	response.end(JSON.stringify(result));
	});
    

  } else {
    response.end("Hello!\n");
  }
});
server.listen(8990);

var request = require("request")

var link = "http://localhost:8990/?q=There%20are%20slow%20and%20repetitive%20parts,%20but%20it%20has%20just%20enough%20spice%20to%20keep%20it%20interesting."

request({
    url: link,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        console.log(body) // Print the json response
    }
})


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
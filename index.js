var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var NLP = require('stanford-corenlp');

var app = express();
const MAIN_PORT = 2000;
const NLP_PORT = 8990;

//For post request
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



app.get('/', function(req, res) {
    res.send('Navigate Furthur Please...');
});

app.get('/home', function(req, res) {
    res.sendfile('public/index.html');
});

app.post('/home', function(req, res) {
    var question = req.body.question;
    
    console.log('question of the user: ' + question);
    var request = require("request");
    question = question.replace(/ /g, "%20");
    var link = "http://localhost:8990/?q="+question;

    console.log('Link for CoreNLP: ' + link);
    var nlpRequestConfig = {
      url: link,
      json: true
    };   

    request(nlpRequestConfig, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log(body.document.sentences.sentence.tokens.token);
            tokenArray = body.document.sentences.sentence.tokens.token;

            var nounObject = new Object();

            for(var i = 0; i < tokenArray.length; i++) {
            	var wordToken = tokenArray[i];
							console.log(wordToken);

							if(wordToken.POS == "NN" || wordToken.POS == "NNS" || wordToken.POS == "NNP" || wordToken.POS == "NNPS" || wordToken.POS == "PRP" || wordToken.POS == "PRP$") {
								nounObject[wordToken.word] = wordToken.POS;
							}

						}

						console.log(nounObject);
        }
        else console.log("ERROR in NLP Request.");
    })
    res.send("HI, what are you doing here...");
});

//stanford-corenlp
var config = {
    "nlpPath":"./corenlp",
    "version":"3.6.0",
    // 'annotators': ['tokenize','ssplit','pos','parse','sentiment','depparse','quote'], //optional!
    'annotators': ['tokenize', 'ssplit', 'pos', 'parse','sentiment'],
    'extra' : {
      'depparse.extradependencie': 'MAXIMAL'
    }
}

var coreNLP = new NLP.StanfordNLP(config);

var nlpServer = http.createServer(function (request, response) {
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

nlpServer.listen(NLP_PORT, function () {
  console.log('NLP SERVER IS HERE-> localhost:'+NLP_PORT);
});

app.listen(MAIN_PORT, function() {
    console.log('MAIN WEBSITE IS HERE-> localhost:'+MAIN_PORT);
});

app.use(express.static('public'));
app.use(express.static('public/libs/'));
app.use(express.static('public/libs/bootstrap-3.3.7-dist/js/'));
app.use(express.static('public/libs/bootstrap-3.3.7-dist/css/'));
var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var NLP = require('stanford-corenlp');
var AIMLInterpreter = require('./node_modules/aimlinterpreter');

var app = express();
var aimlInterpreter = new AIMLInterpreter({name:'BOTInterpreter', age:'0'});
const MAIN_PORT = 2000;
const NLP_PORT = 8990;

aimlInterpreter.loadAIMLFilesIntoArray(['./aiml_files/test.aiml.xml']);//

var callback = function(answer, wildCardArray, input){
	console.log(answer + ' | ' + wildCardArray + ' | ' + input);

};

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
            var number = '';
            for(var i = 0; i < tokenArray.length; i++) {
            	var wordToken = tokenArray[i];
							console.log(wordToken);

							if(wordToken.POS == "NN" || wordToken.POS == "NNS" || wordToken.POS == "NNP" || wordToken.POS == "NNPS" || wordToken.POS == "PRP" || wordToken.POS == "PRP$") {
								nounObject[wordToken.word] = wordToken.POS;

								if(wordToken.word == "semester" || wordToken.word == "sem") {
									var j = i;
									if((tokenArray[j+1].word).match(/\d+/) || tokenArray[j+1].word.match(/\d(?=th)/)) {
										number = number + (tokenArray[j+1].word)[0];
										console.log("Inside:" + number);
									} 
								}
							}
						}
						console.log("Outside:" + number);

						console.log(nounObject);
						var code = "";
						var flag = 1;

						if(nounObject["syllabus"]!=null) {
							code = code + 's';
							flag = 0;
						}
						else if(nounObject["timetable"]!=null) {
							code = code + 't';
							flag = 0;
						}
						else if(nounObject["lesson"] && nounObject["plan"]) {
							code = code + 'l';
							flag = 0;
						}

						//for Degree after TLS
						if(!flag && nounObject["btech"]) {
							code = 'b' + code;
						}
						else if(!flag && nounObject["mtech"]) {
							code = 'm' + code;
						}

						//for semester after TLS
						if(!flag) {
							code = number + code;
						}

						//for branch after TLS
						if(!flag && nounObject["cse"]) {
							code = 'c' + code;
						}
						
						else if(!flag && nounObject["ece"]) {
							code = 'e' + code;
						}

						aimlInterpreter.findAnswerInLoadedAIMLFiles(code, callback);
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
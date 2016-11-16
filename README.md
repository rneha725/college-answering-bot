##Instructions:
* git clone https://github.com/rneha725/college-answering-bot folder
* cd folder
* npm test
* Open localhost:2000/home

###Installations:
####node:
* sudo apt-get install nodejs

####npm:
* sudo apt-get install npm

####git:
* sudo apt-get install git

####brackets:
* sudo add-apt-repository ppa:webupd8team/brackets
* sudo apt-get update
* sudo apt-get install brackets

####Stanford-corenlp
* Install Java-8 in your system
  sudo apt-get install openjdk-8-jdk
* npm install java
* Download Stanford-Corenlp from [here](http://nlp.stanford.edu/software/stanford-corenlp-full-2015-12-09.zip)
* Extract downloaded folder in *corenlp*
* npm intsall stanford-corenlp
* move *corenlp* folder in node_modules/stanford-corenlp/
* open node_modules/stanford-corenlp/examples/sentiment.js
  Update version to 3.6.0 and;
  comment out 'language'
* node node_modules/stanford-corenlp/sentiment.js
* open [link](http://localhost:8990/?q=There%20are%20slow%20and%20repetitive%20parts,%20but%20it%20has%20just%20enough%20spice%20to%20keep%20it%20interesting.)

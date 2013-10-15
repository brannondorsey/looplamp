var Server = require("./classes/Server");
var Lamp = require("./classes/Lamp");
var TwitterHandler = require("./classes/TwitterHandler");
var argv = require('optimist')
	   .usage('Usage: $ --search [string] --speed [milliseconds]')
	   .default({'search': "lightupchicago",
				 'speed': 750})
	   .alias({'search': 'q',
			   'speed': 's'})
	   .argv;

var server = new Server(8000);
var twitterHand = new TwitterHandler();
var lamp = new Lamp(51);

var behavior = {
	"mode": "twitter",
	"tracking": argv.search,
	"streamMode": "filter",
	"dormant": {
		"animation": false,
		"color":{
			"r": 50,
			"g": 50,
			"b": 50
		}
	},
	"active": {
		"animation": true,
		"time": argv.speed,
		"fluid": true,
		"begin":{
			"color":{
				"r": 50,
				"g": 50,
				"b": 50
			}
		},
		"end": {
			"color":{
				"r": 255,
				"g": 255,
				"b": 255
			}
		}
	}
}

lamp.start(behavior);

//--------------------------------------------------------------
//EVENT HANDLERS

twitterHand.onTweetReceived('filter', behavior.tracking, function(tweetData){
	respondToTweet(tweetData);
});

//not inline because it may be used more than once if the stream is restarted
function respondToTweet(tweetData){
	
	//only make the lamp active if it is dormant
	if(!lamp.isActive){
		//twitterHand.log(tweetData);

		newRandomAnimation();

		//logic for flashing lights goes here...
		lamp.setActive();
	}
}

function newRandomAnimation(){
	var color = {};
	var prominence = Math.floor(Math.random()*3);
	switch(prominence){

		case 0:
		color.r = pickColor(true);
		color.g = pickColor(false);
		color.b = pickColor(false);
		break;

		case 1:
		color.r = pickColor(false);
		color.g = pickColor(true);
		color.b = pickColor(false);
		break;

		case 2:
		color.r = pickColor(false);
		color.g = pickColor(false);
		color.b = pickColor(true);
		break;
	}

	//console.log(color);
	behavior.active.end.color = color;
	lamp.updateBehavior(behavior);
}

function pickColor(isProminent){
	var prominentMin = 200;
	var prominentMax = 255;
	var regularMin   = 0;
	var regularMax   = 100;

	var min = isProminent ? prominentMin : regularMin;
	var max = isProminent ? prominentMax : regularMax;

	//generates random int between min and max
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

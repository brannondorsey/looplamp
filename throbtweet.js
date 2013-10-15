var Server = require("./classes/Server");
var Lamp = require("./classes/Lamp");
var TwitterHandler = require("./classes/TwitterHandler");

var server = new Server(8000);
var twitterHand = new TwitterHandler();
var lamp = new Lamp(51);

var behavior = {
	"mode": "twitter",
	"tracking": "obama",
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
		"time": 1000,
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
		twitterHand.log(tweetData);

		//newRandomAnimation();

		//logic for flashing lights goes here...
		lamp.setActive();
	}
}
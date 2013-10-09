var Server = require("./classes/Server");
var DataHandler = require("./classes/DataHandler");
var Lamp = require("./classes/Lamp");
var TwitterHandler = require("./classes/TwitterHandler");

var dataHand = new DataHandler("behavior_data/");
var server = new Server(8000);
var twitterHand = new TwitterHandler();
var lamp = new Lamp();

var initialBehavior = dataHand.loadPreviousBehavior();

//starts sever and acts as event handler for valid post
server.start(function(post){

	//do validation here...
	var data = post;
	var behavior = false; //the behavior that will be sent to the lamp

	//if the behavior data is new
	if(typeof data.loadPreset === 'undefined'){
		var filename = (typeof data.savePreset === 'undefined') ? "behavior.json" : data.savepreset;
		var saveData = JSON.stringify(data.behavior);
		dataHand.save(filename, saveData, function(err){
			if(!err){
				behavior = saveData; //the behavior becomes the data that was just saved
				console.log("data saved successfully!");
			}
		});
	}else{ //if the behavior needs to be loaded from a preset
		dataHand.load(data.loadPreset, function(err, data){
			if(!err){
				behavior = JSON.parse(data); //the behavior becomes the preset loaded
				console.log("data loaded successfully from preset");
			}
		});
	}

	//if the behavior was set
	if(behavior) lamp.updateBehavior(behavior);
});

lamp.start(20);

//--------------------------------------------------------------
//EVENT HANDLERS

twitterHand.onTweetReceived('filter', initialBehavior.twitter.tracking, function(data){
	respondToTweet(data)
});

//not inline because it may be used more than once if the stream is restarted
function respondToTweet(data){
	
	//logic for flashing lights goes here...
	
	twitterHand.log(data);
}
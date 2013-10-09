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

	//if the behavior data is new
	if(typeof data.twitter.loadPreset === 'undefined'){
		var filename = (typeof data.twitter.savePreset === 'undefined') ? "behavior.json" : data.savepreset;
		var saveData = JSON.stringify(data);
		dataHand.save(filename, saveData, function(err){
			if(!err){
				updateBehavior(saveData);
				console.log("data saved successfully!");
			}
		});
	}else{ //if the behavior needs to be loaded from a preset
		dataHand.load(data.twitter.loadPreset, function(err, data){
			if(!err){
				behavior = JSON.parse(data); //the behavior becomes the preset loaded
				updateBehavior(behavior);
				console.log("data loaded successfully from preset");
			}
		});
	}

	//note this function is inside start becuase it is only used here
	function updateBehavior(behavior){
		lamp.updateBehavior(behavior);
		if(twitterHand.needsNewStream(data)){
			twitterHand.updateStream(data.twitter.streamMode, data.twitter.tracking, function(data){
				respondToTweet(data);
				console.log("The lamp is now tracking " + data.twitter.tracking);
			});
		}
	}
});

lamp.start(initialBehavior);

//--------------------------------------------------------------
//EVENT HANDLERS

twitterHand.onTweetReceived('filter', initialBehavior.twitter.tracking, function(data){
	respondToTweet(data)
});

//not inline because it may be used more than once if the stream is restarted
function respondToTweet(data){
	
	//only make the lamp active if it is dormant
	if(!lamp.isActive){
		twitterHand.log(data);

		//logic for flashing lights goes here...
		lamp.setActive();
	}
}
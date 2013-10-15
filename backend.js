var Server = require("./classes/Server");
var DataHandler = require("./classes/DataHandler");
var Lamp = require("./classes/Lamp");
var TwitterHandler = require("./classes/TwitterHandler");

var dataHand = new DataHandler("behavior_data/");
var server = new Server(8000);
var twitterHand = new TwitterHandler();
var lamp = new Lamp(51);

var initialBehavior = dataHand.loadPreviousBehavior();
console.log(initialBehavior);

//starts sever and acts as event handler for valid post
server.start(function(post){

	//do validation here...
	var data = post;

	//if the behavior mode is twitter
	if(data.mode == 'twitter'){
		console.log("got in here because the mode was twitter");
		//if the behavior data is new
		if(typeof data.loadPreset === 'undefined'){
			var filename = (typeof data.savePreset === 'undefined') ? "behavior.json" : data.savePreset;
			var saveData = JSON.stringify(data);
			dataHand.save(filename, saveData, function(err){
				if(!err){
					updateBehavior(saveData);
					console.log("data saved successfully!");
				}
			});
		}else{ //if the behavior needs to be loaded from a preset
			dataHand.load(data.loadPreset, function(err, data){
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
				twitterHand.updateStream(data.streamMode, data.tracking, function(tweetData){
					respondToTweet(tweetData);
					//dont even FUCKING think about putting anything else in here...
					//it will cause the most unnoticable bug that will ruin your life
					//because this registers a new event that overrides onTweetRecieved
				});
			}
		}
	}
});

lamp.start(initialBehavior);

//--------------------------------------------------------------
//EVENT HANDLERS

twitterHand.onTweetReceived('filter', initialBehavior.tracking, function(tweetData){
	respondToTweet(tweetData);
});

//not inline because it may be used more than once if the stream is restarted
function respondToTweet(tweetData){
	
	//only make the lamp active if it is dormant
	if(!lamp.isActive){
		//twitterHand.log(tweetData);

		//logic for flashing lights goes here...
		lamp.setActive();
	}
}
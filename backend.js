var Server = require("./classes/Server");
var DataHandler = require("./classes/DataHandler");
var Lamp = require("./classes/Lamp");
var TwitterHandler = require("./classes/TwitterHandler");

var dataHand = new DataHandler("behavior_data/");
var server = new Server(3000);
var twitterHand = new TwitterHandler();
var lamp = new Lamp(51);

var initialBehavior = dataHand.loadPreviousBehavior();

//starts sever and acts as event handler for valid post
server.start();
server.sockets.on('connection', function(socket){

	//someone submitted an upload to the lamp
	socket.on('behavior uploaded', function(behavior){

		if(behavior !== 'undefined'){
			var filename = (typeof behavior.savePreset === 'undefined') ? "behavior.json" : behavior.savePreset;
			var saveData = JSON.stringify(behavior);
				dataHand.save(filename, saveData, function(err){
				if(!err){
					updateBehavior(saveData);
					console.log("data saved successfully!");

					lamp.setPreviewing(false);
					lamp.setDormant();

					//send the data back to all other sockets so that they
					//can update their sliders
					//socket.broadcast.emit('behavior updated', data); //COME BACK AND UNCOMMENT
					server.sockets.emit('behavior updated', behavior);
				}
			});
		}
	});

	//someone is editing the lamp
	socket.on('editing behavior', function(data){

		//preview the color on the lamp
		lamp.preview(data.color);

		//send the
		//socket.broadcast.emit('editing', data); //COME BACK AND UNCOMMENT
		server.sockets.emit('editing', data.behavior);
	});

	socket.on('load preset', function(data){
		if(data !== 'undefined'){

			var forWhichState = data.state;
			var preset = dataHand.load(data.filename, function(err, data){
				if(!err){
					state = JSON.parse(data); //the behavior becomes the preset loaded
					
					console.log("data loaded successfully from preset");
					//send the data back to all other sockets so that they
					//can update their sliders
					//socket.broadcast.emit('behavior updated', data); //COME BACK AND UNCOMMENT
					server.sockets.emit('preset loaded', data);
				}
			});
		}
	});	

	// socket.on('save preset', function(data){	
	// 	var filename = (typeof data.savePreset === 'undefined') ? "behavior.json" : data.savePreset;
	// 		var saveData = JSON.stringify(data);
	// 		dataHand.save(filename, saveData, function(err){
	// 			if(!err){
	// 				updateBehavior(saveData);
	// 				console.log("data saved successfully!");
	// 			}
	// 		});
	// });

	// socket.on('load preset', function(data){
	// 	dataHand.load(data.filename, function(err, data){
	// 		if(!err){
	// 			behavior = JSON.parse(data); //the behavior becomes the preset loaded
	// 			updateBehavior(behavior);
	// 			console.log("data loaded successfully from preset");
	// 		}
	// 	});
	// });

	//note this function is inside start becuase it is only used here
		function updateBehavior(behavior){
			behavior = JSON.parse(behavior);
			lamp.updateBehavior(behavior);
			console.log(behavior);
			if(twitterHand.needsNewStream(behavior)){
				twitterHand.updateStream(behavior.streamMode, behavior.tracking, function(tweetData){
					respondToTweet(tweetData);
					//dont even FUCKING think about putting anything else in here...
					//it will cause the most unnoticable bug that will ruin your life
					//because this registers a new event that overrides onTweetRecieved
				});
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
		twitterHand.log(tweetData);

		if(!lamp.previewing){
			//logic for flashing lights goes here...
			lamp.setActive();
		}
	}
}
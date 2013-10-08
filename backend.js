var Server = require("./classes/Server");
var DataHandler = require("./classes/DataHandler");
var Lamp = require("./classes/Lamp");

var dataHand = new DataHandler("behavior_data/");
var server = new Server(8000);
var lamp = new Lamp();
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

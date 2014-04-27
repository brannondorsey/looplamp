var fs = require("fs"),
	express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	Lamp = require(__dirname + "/classes/Lamp"),
	TwitterHandler = require(__dirname + "/classes/TwitterHandler");

var twitterHand;
var lamp;

var settings;
var behavior;
var writingBehavior = false;
var updateDelay = 2000; // millis
var updateTimeout;

fs.readFile( __dirname + "/data/settings.json", "utf-8", function(err, data){

	if (err) throw err;
	settings = JSON.parse(data);

	fs.readFile( __dirname + "/data/behavior.json", "utf-8", function(err, data){
		
		if (err) throw err;
		behavior = JSON.parse(data);
		app.use(express.static(__dirname + '/public'));
		app.get("/data/behavior", function (req, res) {
		  res.sendfile(__dirname + "/data/behavior.json");
		}).get("/data/settings", function (req, res) {
		  res.sendfile(__dirname + "/data/settings.json");
		});

		io.set("log level", 1);
		server.listen(settings.port);

		twitterHand = new TwitterHandler(settings.twitter);
		lamp = new Lamp(settings.numberOfLights);
		lamp.start(behavior);
		console.log("The server was started on port " + settings.port);

		io.sockets.on("connection", function(socket){

			socket.on("update", function(update){
				
				if (update.isSlider) { // if update is color slider
					eval(update.javascript + " = " + update.value);
					var color = update.javascript.substring(0, update.javascript.lastIndexOf('.'));
					lamp.setPreviewing(true);
					lamp.preview(eval(color));
					clearTimeout(updateTimeout);
					updateTimeout = setTimeout(function(){
						saveBehavior();
						lamp.setPreviewing(false);
						lamp.updateBehavior(behavior);
					}, updateDelay);
				} else { // if update is tracking
					if (update.css == "#twitter-tracking") {
						eval(update.javascript + " = '" + update.value + "'");
						if(twitterHand.needsNewStream(behavior)){
							twitterHand.updateStream(behavior.streamMode, behavior.tracking, respondToTweet);
						}
					} else if (update.css == "#active-switch") {
						eval(update.javascript + " = " + update.value);
						console.log(update.javascript + " = " + update.value);
					}
					saveBehavior();
					lamp.updateBehavior(behavior);
				}
				
				socket.broadcast.emit("updated", update);
			});
		});

		twitterHand.onTweetReceived('filter', behavior.tracking, respondToTweet);
	});
});

//not inline because it may be used more than once if the stream is restarted
function respondToTweet(tweetData){
	
	//only make the lamp active if it is dormant
	if(!lamp.isActive &&
		behavior.active.enabled){
		twitterHand.log(tweetData);

		if(!lamp.previewing){
			//logic for flashing lights goes here...
			lamp.setActive();
		}
	}
}

function saveBehavior(){
	if (!writingBehavior) {
		writingBehavior = true;
		fs.writeFile(__dirname + "/data/behavior.json", JSON.stringify(behavior), function(err){
			if (err) throw err;
			// console.log("Behavior saved!");
			writingBehavior = false;
		});
	}
}

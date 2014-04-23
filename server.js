var fs = require("fs"),
	express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	Lamp = require(__dirname + "/classes/Lamp"),
	TwitterHandler = require(__dirname + "/classes/TwitterHandler");

var port = 3333;
var twitterHand = new TwitterHandler();
var lamp = new Lamp(51);

var updateDelay = 2000; // millis
var updateTimeout;

fs.readFile( __dirname + "/behavior_data/behavior.json", "utf-8", function(err, data){
	
	if (err) throw err;
	
	var behavior = JSON.parse(data);
	app.use(express.static(__dirname + '/public'));
	app.get("/behavior", function (req, res) {
	  res.sendfile(__dirname + "/behavior_data/behavior.json");
	});

	io.set("log level", 1);
	server.listen(port);
	lamp.start(behavior);
	console.log("The server was started on port " + port);

	io.sockets.on("connection", function(socket){

		socket.on("update", function(update){
			
			// lamp.updateBehavior(behavior);
			eval(update.javascript + " = '" + update.value + "'");
			if (update.isSlider) { // if update is color slider
				var color = update.javascript.substring(0, update.javascript.lastIndexOf('.'));
				lamp.preview(eval(color));
				clearTimeout(updateTimeout);
				updateTimeout = setTimeout(function(){
					lamp.setPreviewing(false);
					lamp.updateBehavior(behavior);
				}, updateDelay);
			} else { // if update is tracking
				if (update.css == "#twitter-tracking") {
					console.log("got here");
					if(twitterHand.needsNewStream(behavior)){
						twitterHand.updateStream(behavior.streamMode, behavior.tracking, function(tweetData){
							respondToTweet(tweetData);
							//dont even FUCKING think about putting anything else in here...
							//it will cause the most unnoticable bug that will ruin your life
							//because this registers a new event that overrides onTweetRecieved
						});
					}
				}
			}
			
			socket.broadcast.emit("updated", update);
		});
	});

	twitterHand.onTweetReceived('filter', behavior.tracking, function(tweetData){
		respondToTweet(tweetData);
	});
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

function updateBehavior() {

}
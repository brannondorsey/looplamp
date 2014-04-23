var fs = require("fs"),
	app = require("express")(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server);

var port = 3333;

fs.readFile( __dirname + "behavior_data/behavior.json", "utf-8", function(err, data){
	
	if (err) throw err;
	
	var behavior = JSON.parse(data);
	app.use(express.static(__dirname + '/public'));
	app.get("/behavior", function (req, res) {
	  res.sendfile(__dirname + "/behavior_data/behavior.json");
	});

	io.set("log level", 1);
	server.listen(port);
	console.log("The server was started on port " + port);

	io.sockets.on("connection", function(socket){

		socket.on("update", function(update){
			eval(update.javascript + " = " + update.value);
			socket.broadcast.emit("updated", update);
		});
	});
});

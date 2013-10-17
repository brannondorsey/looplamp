var express = require("express");
var http = require("http");
var io = require("socket.io");

function Server(port){
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = port;
}

Server.prototype.start = function(onNewBehavior){
    this.app.use(express.static('/home/pi/looplampbackend/public'));
    this.server.listen(this.port);
    console.log("The server was started on port " + this.port);

    this.io = io.listen(this.server);
    this.io.set('log level', 1);
    this.sockets = this.io.sockets;
}

module.exports = Server;

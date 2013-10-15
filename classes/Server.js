var express = require("express");

function Server(port){
    this.app = express();
    this.app.use(express.bodyParser());
    this.port = port;
}

Server.prototype.start = function(onPost){
    this.app.use(express.bodyParser());
    // this.app.use(function(req, res){
    //     res.header('Access-Control-Allow-Credentials', true);
    //     res.header('Access-Control-Allow-Origin', req.headers.origin);
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //     res.header('Access-Control-Allow-Headers',  'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');   
    // });
    this.app.post('/', function(req, res) {
        console.log("I received a POST request. \n It contained: ");
        console.log(req.body);
        res.setHeader('Content-Type', 'application/json');
        onPost(req.body);
        res.writeHead(200);
        res.end("Post received!");
    });
    this.app.listen(this.port);
}

Server.prototype.getPost = function(){
    return this.postVals;
}

module.exports = Server;
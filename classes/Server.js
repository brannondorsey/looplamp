var querystring = require('querystring');

function Server(port){
    this.http = require('http');
    this.port = port;
}

Server.prototype.start = function(){
    var thisObject = this;
    this.http.createServer(function(request, response) {
        thisObject._processPostData(request, response, function() {
            console.log("The response POST is " + typeof response.post);
            console.log(response.post);
            response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            response.end();
        });
    }).listen(this.port);
}

Server.prototype._processPostData = function(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function'){
        console.log("The third parameter of postRequest was not a function");
        return null;
    } 

    if(request.method == 'POST') {
        request.on('data', function(data) {
            console.log("data received");
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            response.post = querystring.parse(queryData);
            callback();
        });

    } else {
        console.log("The method was not post");
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.write("No post was received");
        response.end();
    }
}

module.exports = Server;
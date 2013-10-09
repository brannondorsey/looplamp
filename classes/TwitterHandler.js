var util = require('util'), twitter = require('twitter');

function TwitterHandler(){
	if(twitterCredentials = this._loadTwitterCredentials()){
		this.twitter = new twitter(twitterCredentials);
	}else console.log("Failed to load twitter credentials");
}

TwitterHandler.prototype.onTweetReceived = function(streamMode, tracking, onStream){
	//starts the stream
	this.streamMode = streamMode;
	this.tracking = tracking;
	var that = this;
	this.stream = this.twitter.stream(streamMode, { track: tracking }, function(stream) {
		//event
	    stream.on('data', function(data) {
	    	if(that._validTweet(data)) onStream(data);
		});
	});
}

//this will eventually send a stream to the front end
TwitterHandler.prototype.log = function(data){
	this._logFragment("Created at", data.created_at);
	this._logFragment("Created by", data.user.name);
	this._logFragment("Tweet:", data.text);
	console.log("");
}

//updates the stream. Alias of TwitterHandler::onTweetReceived
TwitterHandler.prototype.updateStream = function(streamMode, tracking, callback){
	this.onTweetReceived(track, mode, callback); //this should destroy the old stream?
}

//tests if the data stream needs to be updated because the mode or tracking is different
TwitterHandler.prototype.needsNewStream = function(data){
	return (data.tracking != this.tracking || 
			data.streamMode != this.streamMode) ? true : false;
}

//--------------------------------------------------------------
//PROTECTED

TwitterHandler.prototype._loadTwitterCredentials = function(){
	var fs = require("fs");
	if(file = fs.readFileSync("twitter_credentials.json")){
		//validate here...
		return JSON.parse(file);
	}else return false;
}

TwitterHandler.prototype._validTweet = function(data){
	return (typeof data !== 'undefined' &&
	   typeof data.user !== 'undefined') ? true : false;
}

TwitterHandler.prototype._logFragment = function(prefixMessage, value){
	if(typeof value !== 'undefined') console.log(prefixMessage+" "+value);
}

module.exports = TwitterHandler;

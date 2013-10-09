var util = require('util'), twitter = require('twitter');

function TwitterHandler(){
	if(twitterCredentials = this._loadTwitterCredentials()){
		this.twitter = new twitter(twitterCredentials);
	}else console.log("Failed to load twitter credentials");
}

TwitterHandler.prototype.onTweetReceived = function(mode, track, onStream){
	//starts the stream
	this.mode = mode;
	this.track = track;
	var that = this;
	this.stream = this.twitter.stream(mode, { track: track }, function(stream) {
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

// TwitterHandler.prototype.updateStreamOptions = function(track, mode, callback){
// 	this.onTweetReceived = function(track, mode, callback) //this should destroy the old stream?
// }

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

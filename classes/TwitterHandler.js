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
	    stream.on('data', function(tweetData) {
	    	if(that._validTweet(tweetData)) onStream(tweetData);
		});
	});
}

//this will eventually send a stream to the front end
TwitterHandler.prototype.log = function(tweetData){
	this._logFragment("Created at", tweetData.created_at);
	this._logFragment("Created by", tweetData.user.name);
	this._logFragment("Tweet:", tweetData.text);
	console.log("");
}

//updates the stream.
TwitterHandler.prototype.updateStream = function(streamMode, tracking, callback){
	this.onTweetReceived(streamMode, tracking, callback); //this should destroy the old stream?
}

//tests if the data stream needs to be updated because the mode or tracking is different
TwitterHandler.prototype.needsNewStream = function(data){
	console.log("New tracking: " + data.tracking);
	console.log("Old tracking: " + this.tracking);
	console.log("New streamMode: " + data.streamMode);
	console.log("Old streamMode: " + this.streamMode);
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

TwitterHandler.prototype._validTweet = function(tweetData){
	return (typeof tweetData !== 'undefined' &&
	   typeof tweetData.user !== 'undefined') ? true : false;
}

TwitterHandler.prototype._logFragment = function(prefixMessage, value){
	if(typeof value !== 'undefined') console.log(prefixMessage+" "+value);
}

module.exports = TwitterHandler;

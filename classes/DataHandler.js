function DataHandler(saveDirectory){
	this.saveDirectory = saveDirectory;
	this.fs = require("fs");
}

DataHandler.prototype.save = function(filename, data, onSave){
	this.fs.writeFile(this.saveDirectory + filename, data, function(err){
		onSave(err);
	});
}

DataHandler.prototype.load = function(filename, onLoad){
	this.fs.readFile(this.saveDirectory + filename, function(err, data){
		onLoad(err, data);
	});
}

module.exports = DataHandler;
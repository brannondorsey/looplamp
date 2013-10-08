function Lamp(behavior){
	this.behavior = behavior;
}

Lamp.prototype.updateBehavior = function(behavior){
	this.behavior = behavior;
}

Lamp.prototype.setActive = function(){
	this.isActive = true;
}

Lamp.prototype.start = function(millis){
	this.speed = millis;
	var that = this; //copy this object instance because "this" will lose its scope
	setInterval(function(){
		that._run();
	}, this.speed);
	console.log("the lamp was started");
}

//--------------------------------------------------------------
//PROTECTED

Lamp.prototype._run = function(){
	console.log("the lamp is running");
	if(this.isActive) this._activeState(); //run the active state
	else this._dormantState();
}

Lamp.prototype._activeState = function(){
	if(!this._activeComplete()){
		//continue the active state
	}else this.isActive = false; //reset the active switch
}

Lamp.prototype._dormantState = function(){
	console.log("I am the dormant state");
}

Lamp.prototype._activeComplete = function(){
	//return bool representing wether the active state is complete
}

module.exports = Lamp;
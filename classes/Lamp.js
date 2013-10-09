//var Pixel = require('adafruit_pixel').Pixel; **

function Lamp(){
	//this.lights = Pixel('/dev/spidev1.1', 25); **
}

Lamp.prototype.updateBehavior = function(behavior){
	this.behavior = behavior.twitter; 
}

Lamp.prototype.setActive = function(){
	this.isActive = true;
	this._activeState();
}

Lamp.prototype.start = function(behavior){
	this.behavior = behavior.twitter;
}

// Lamp.prototype.start = function(millis){
// 	this.speed = millis;
// 	var that = this; //copy this object instance because "this" will lose its scope
// 	setInterval(function(){
// 		that._run();
// 	}, this.speed);
// 	console.log("the lamp was started");
// }

//--------------------------------------------------------------
//PROTECTED

// Lamp.prototype._run = function(){
// 	//console.log("the lamp is running");
// 	if(this.isActive) this._activeState(); //run the active state
// 	else this._dormantState();
// }

Lamp.prototype._activeState = function(){
	if(!this._activeComplete()){
		//continue the active state
	}else{
		this.isActive = false; //reset the active switch
		this._dormantState();
	} 
}

// Lamp.prototype._dormantState = function(){ **
// 	var dormant = this.behavior.dormant;
// 	if(dormant.animation){ //animation
// 		var startColor = this._formatColorForSpi(dormant.begin.color);
// 		var endColor = this._formatColorForSpi(dormant.end.color);
// 		var time = dormant.time;
// 		this.animation = new Throb("COME BACK", 
// 									this.lights, 
// 									startColor,
// 									time);
// 		this.animation.start();
// 		//set a timer to turn the animation off when it stops
// 		var that = this;
// 		setTimeout(function(){
// 			//should have already stopped but if not stop it
// 			this.animation.stop();
// 			that.
// 		}, time);

// 	}else{ //static 
// 		var hexColor = this._formatColorForSpi(this.color);
// 		lights.set(hexColor[0], hexColor[1], hexColor[2]);
// 		lights.sync();
// 	}
// }

Lamp.prototype._activeComplete = function(){
	//return bool representing wether the active state is complete
}

//takes a color object and returns an array of [r,g,b] hex codes
Lamp.prototype._formatColorForSpi = function(color){
	return [ color.r.toString(16),
			 color.g.toString(16),
			 color.b.toString(16)];
}

//writes the behavior to the pi's lights
Lamp.prototype._writeBehavior = function(){

}

module.exports = Lamp;
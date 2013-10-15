var Pixel = require('adafruit_pixel').Pixel;

function Lamp(){
	this.lights = Pixel('/dev/spidev1.1', 25);
	//this.isActive = true; //hypothetically this should block any active 
	//states from happening until this.start
}

Lamp.prototype.updateBehavior = function(behavior){
	this.behavior = behavior; 
}

Lamp.prototype.setActive = function(){
	this.isActive = true;
	this._activeState();
}

Lamp.prototype.start = function(behavior){
	this.behavior = behavior;
	this.isActive = false;
	this._dormantState(); //start the dormant state
}

//--------------------------------------------------------------
//PROTECTED

Lamp.prototype._activeState = function(){
	this._writeBehavior(this.behavior.active, true);
}

Lamp.prototype._dormantState = function(){
	this._writeBehavior(this.behavior.dormant, false);
	// var dormant = this.behavior.dormant;
	// if(dormant.animation){ //animation
	// 	var startColor = this._formatColorForSpi(dormant.begin.color);
	// 	var endColor = this._formatColorForSpi(dormant.end.color);
	// 	var time = dormant.time;
	// 	this.animation = new Throb("COME BACK", 
	// 								this.lights, 
	// 								startColor,
	// 								time);
	// 	this.animation.start();
	// 	//set a timer to turn the animation off when it stops
	// 	var that = this;
	// 	setTimeout(function(){
	// 		//should have already stopped but if not stop it
	// 		this.animation.stop();
	// 		//recur this function because the behavior is animation and, after all, this is the dormant state
	// 		that._dormantState();
	// 	}, time);

	// }else{ //static 
	// 	var hexColor = this._formatColorForSpi(dormant.color);
	// 	lights.set(hexColor[0], hexColor[1], hexColor[2]);
	// 	lights.sync();
	// }
}

Lamp.prototype._activeComplete = function(){
	//return bool representing wether the active state is complete
}

//takes a color object and returns an array of [r,g,b] hex codes
Lamp.prototype._formatColorForSpi = function(color){
	return [ color.r.toString(16),
			 color.g.toString(16),
			 color.b.toString(16)];
}

//writes the behavior to the pi's lights. 
Lamp.prototype._writeBehavior = function(dormantOrActiveObj, isActive){
	
	var state = dormantOrActiveObj; //i.e. this.behavior.active
	if(state.animation){ //animation
		var startColor = this._formatColorForSpi(state.begin.color);
		var endColor = this._formatColorForSpi(state.end.color);
		this.animation = new Throb("COME BACK", 
									this.lights, 
									startColor,
									state.animationTime);
		this.animation.start();

		var that = this;
		setTimeout(function(){
			//should have already stopped but if not stop it
			this.animation.stop();
			if(isActive) that.isActive = false;
			//run the dormant state when any animation is over.
			//If this is the active state, it should now be the dormant one.
			//If this is the dormant state, it should recur itself because
			//the lamp is always dormant unless active
			that._dormantState(); 
		}, state.animationTime);
	}else{ //static
		var hexColor = this._formatColorForSpi(state.color);
		lights.set(hexColor[0], hexColor[1], hexColor[2]);
		lights.sync();
		//if this is active then run the dormant state once the active time is up
		if(isActive){
			var that = this;
			setTimeout(function(){
				that.isActive = false;
				that._dormantState();
			}, state.activeTime);
		}
	}
}

module.exports = Lamp;

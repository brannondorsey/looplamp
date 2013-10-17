var spi = require('spi'),
RPixel = require('raspberrypixels'),
Throb = require('./Throb');
var Pixel = RPixel.Pixel;

function Lamp(numPixels){
	this.device	= new spi.Spi('/dev/spidev0.0', function(){});
	this.pixels = new RPixel.PixelBuffer(this.device, numPixels);
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
	//console.log(this.behavior);
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
}

Lamp.prototype._activeComplete = function(){
	//return bool representing wether the active state is complete
}

//writes the behavior to the pi's lights. 
Lamp.prototype._writeBehavior = function(dormantOrActiveObj, isActive){

	var state = dormantOrActiveObj; //i.e. this.behavior.active
	if(state.animation === true||
	   state.animation === 'true'){ //animation
		this.throb = new Throb(state);

		//animate. Anonomous function called when animation is complete
		var that = this;
		this.throb.animate(this.pixels, function(){
			if(isActive) that.isActive = false;
			//run the dormant state when any animation is over.
			//If this is the active state, it should now be the dormant one.
			//If this is the dormant state, it should recur itself because
			//the lamp is always dormant unless active
			that._dormantState();
		});
	}else{ //static
		//note: the color object's properties being stored in r, g, b are
		//currently STRINGs. If this is a problem use a method like Throb._parseColorFromJSON
		var color = state.color;
		this.pixels.fillRGB(color.r, color.g, color.b);
		this.pixels.update();
		//if this is active then run the dormant state once the active time is up
		if(isActive){
			var that = this;
			setTimeout(function(){
				that.isActive = false;
				that._dormantState();
			}, state.time);
		}
	}
}

module.exports = Lamp;

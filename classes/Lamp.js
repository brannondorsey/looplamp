var spi = require('spi'),
RPixel = require('raspberrypixels'),
Throb = require('./Throb');
var Pixel = RPixel.Pixel;

function Lamp(numPixels){
	this.device	= new spi.Spi('/dev/spidev0.0', function(){});
	this.pixels = new RPixel.PixelBuffer(this.device, numPixels);
	this.previewing = false;
	this.throb = new Throb();
	//this.isActive = true; //hypothetically this should block any active 
	//states from happening until this.start
}

//for previewing the lamp
Lamp.prototype.preview = function(color){
	this.pixels.fillRGB(color.r, color.g, color.b);
	this.pixels.update();
}

Lamp.prototype.setPreviewing = function(bool){
	this.isActive = false;
	this.throb.setEnabled(!bool);
	this.previewing = Boolean(bool);
}

Lamp.prototype.updateBehavior = function(behavior){
	this.behavior = behavior;
	this._dormantState(); //run the dormant state to change the color if it needs it
}

Lamp.prototype.setActive = function(){
	this.isActive = true;
	this._activeState();
}

Lamp.prototype.setDormant = function(){
	this.isActive = false;
	this._dormantState();
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
Lamp.prototype._writeBehavior = function(state, isActive){

	if(state.animation === true ||
	   state.animation === 'true'){ //animation
		
		var self = this;
		//animate. Anonomous function called when animation is complete
		
		this.throb.animate(self.behavior.dormant.main.color, 
						   self.behavior.active.main.color,
						   this.behavior.active.time, 
						   true,
						   this.pixels, function(){
			if(isActive) self.isActive = false;
			//run the dormant state when any animation is over.
			//If this is the active state, it should now be the dormant one.
			//If this is the dormant state, it should recur itself because
			//the lamp is always dormant unless active
			self._dormantState();
		});
	}else{ //static
		//note: the color object's properties being stored in r, g, b are
		//currently STRINGs. If this is a problem use a method like Throb._parseColorFromJSON
		var color = state.main.color;
		this.pixels.fillRGB(color.r, color.g, color.b);
		this.pixels.update();
		//if this is active then run the dormant state once the active time is up
		if(isActive){
			var self = this;
			setTimeout(function(){
				self.isActive = false;
				self._dormantState();
			}, state.time);
		}
	}
}

module.exports = Lamp;

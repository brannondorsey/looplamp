//---------------------------------------------------------
//Classes

function Throb(animationObject){

	this.time = animationObject.time;
	this.beginColor = this._parseColorFromJSON(animationObject.main.color);
	this.endColor = this._parseColorFromJSON(animationObject.secondary.color);
	this.fluid = Boolean(animationObject.fluid);
	this.shouldRepeat = (this.fluid) ? true : false;

	this.frameRate = 10;
	this.threshold = 1;
	this.numbFrames = parseInt(this.time)/this.frameRate;
	this.isFinished = false;
}

Throb.prototype.animate = function(pixelBuffer, onFinished){
	
	this.currentFrame = 0;
	this.currentColor = this.beginColor;

	//the values each color should increment by so that they each arrive
	//at the target color at the same time
	this.rIncrementVal = Math.abs(Math.abs(this.beginColor.r - this.endColor.r) / this.numbFrames);
	this.gIncrementVal = Math.abs(Math.abs(this.beginColor.g - this.endColor.g) / this.numbFrames);
	this.bIncrementVal = Math.abs(Math.abs(this.beginColor.b - this.endColor.b) / this.numbFrames);

	var that = this;
	this.intervalID = setInterval(function(){
		if(that.currentFrame < that.numbFrames){
			that._tick(pixelBuffer);
			that.currentFrame++;
		}
		else{
			//stop the interval
			clearInterval(that.intervalID);
			if(that.fluid &&
			   that.shouldRepeat){
				
				//swap the begin and end colors
				var temp = that.beginColor;
				that.beginColor = that.endColor;
				that.endColor = temp;

				that.animate(pixelBuffer, onFinished);
				that.shouldRepeat = false;
				
			}else{
				that.isFinished = true;
				onFinished();
			}
		}	
	}, this.frameRate);
}

Throb.prototype.isFinished = function(){
	return this.isFinished ? true : false;
}

//return false if animation is over, true otherwise
Throb.prototype._tick = function(pixelBuffer){
	var pixels = pixelBuffer;
	var color = this._increment(this.currentColor);

	pixels.fillRGB(color.r, color.g, color.b);

	//currentColor becomes the new color
	this.currentColor = color; 

	//write to the lights
	pixels.update();
}

Throb.prototype._increment = function(color){
	var newColor = {};
	newColor.r = this._getIncrementedColor(this.rIncrementVal, color.r, this.endColor.r);
	newColor.g = this._getIncrementedColor(this.gIncrementVal, color.g, this.endColor.g);
	newColor.b = this._getIncrementedColor(this.bIncrementVal, color.b, this.endColor.b);
	return newColor;
}

Throb.prototype._getIncrementedColor = function(incrementVal, colorVal, targetColorVal){
	//color value is less than target color value
	if(colorVal < targetColorVal &&
	   !this._targetReached(this.threshold, colorVal, targetColorVal)){
		 colorVal += incrementVal; 
		// console.log("the color value of b is less than the targetColorVal");
		 
	} 
	//color value is greater than target color value
	else if(colorVal > targetColorVal &&
			!this._targetReached(this.threshold, colorVal, targetColorVal)){
		 // console.log("the color value of b is less than the targetColorVal");
	   	 colorVal -= incrementVal;
	}
	// console.log("It was neither");
	return colorVal;
}

Throb.prototype._targetReached = function(threshold, currentColor, targetColor){
	return (Math.abs(currentColor - targetColor) < threshold) ? true : false;
}

Throb.prototype._parseColorFromJSON = function(colorJSON){
	var colorToReturn = {};
	colorToReturn.r = parseInt(colorJSON.r);
	colorToReturn.g = parseInt(colorJSON.g);
	colorToReturn.b = parseInt(colorJSON.b);
	return colorToReturn;
}

module.exports = Throb;

//do the active animation and then go to dormant

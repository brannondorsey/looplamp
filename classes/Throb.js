//---------------------------------------------------------
//Classes

function Throb(){

	this.frameRate = 10;
	this.threshold = 1;
	this.setEnabled(true);
}

Throb.prototype.animate = function(beginColor,
								   endColor,
								   millis,
								   shouldRepeat,
								   pixelBuffer, 
								   callback){
	
	
	var currentFrame = 0;
	var numbFrames = millis/this.frameRate;
	this.currentColor = beginColor;
	this.isFinished = false;
	this.endColor = endColor;
	
	//the values each color should increment by so that they each arrive
	//at the target color at the same time
	this.rIncrementVal = Math.abs(Math.abs(beginColor.r - this.endColor.r) / numbFrames);
	this.gIncrementVal = Math.abs(Math.abs(beginColor.g - this.endColor.g) / numbFrames);
	this.bIncrementVal = Math.abs(Math.abs(beginColor.b - this.endColor.b) / numbFrames);

	var self = this;
	var intervalID = setInterval(function(){

		if (!self.enabled) {
			clearInterval(intervalID);
			return;
		} else if(currentFrame < numbFrames){
			self._tick(pixelBuffer);
			currentFrame++;
		}else{
			
			//stop the interval
			clearInterval(intervalID);
			if(shouldRepeat){
				
				//swap the begin and end colors
				var temp = beginColor;
				beginColor = endColor;
				endColor = temp;

				self.animate(beginColor,
						     endColor,
							 millis,
							 false, // shouldRepeat
							 pixelBuffer, 
							 callback);
				
			}else{
				self.isFinished = true;
				callback();
			}
		}	
	}, this.frameRate);
}

Throb.prototype.setEnabled = function(bool) {
	this.enabled = bool;
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
		 
	} 
	//color value is greater than target color value
	else if(colorVal > targetColorVal &&
			!this._targetReached(this.threshold, colorVal, targetColorVal)){
	   	 colorVal -= incrementVal;
	}
	return colorVal;
}

Throb.prototype._targetReached = function(threshold, currentColor, targetColor){
	return (Math.abs(currentColor - targetColor) < threshold) ? true : false;
}

module.exports = Throb;

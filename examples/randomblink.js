
var spi = require('spi'),
RPixel = require('raspberrypixels');
var Pixel = RPixel.Pixel;

var numPixels = 11;

var device	= new spi.Spi('/dev/spidev0.0', function(){});
var pixels 	= new RPixel.PixelBuffer(device, 11);

//---------------------------------------------------------
//Do stuff in here

var frameRate = 500;

setInterval(randomLights, frameRate);

function randomLights(){

	//pick a random color for each light
	for(var i = 0; i < pixels.length; i++){
		var r = Math.floor(Math.random()*255);
		var g = Math.floor(Math.random()*255);
		var b = Math.floor(Math.random()*255);
		pixels.setRGB(i, r, g, b);
	}

	//don't forget to send the pixels to the light
	pixels.update();
}





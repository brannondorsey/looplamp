var spi = require('spi'),
RPixel = require('raspberrypixels');
var Pixel = RPixel.Pixel;

var numPixels = 11;

var device	= new spi.Spi('/dev/spidev0.0', function(){});
var pixels 	= new RPixel.PixelBuffer(device, 11);

//---------------------------------------------------------
//Do stuff in here

var time = 100;
var color = {
	r: 255,
	b: 0, 
	g: 0
};

var index = 0;
var modifier = 1;

setInterval(function(){
	
	if(index > pixels.length-1 ||
	   index < 0){
	 	modifier = -modifier
	}
	index += modifier;
	animate(index);
	console.log(index);
}, time);

function animate(index){
	for(var i = 0; i < pixels.length; i++){
		pixels.blank();
		pixels.setRGB(index, color.r, color.g, color.b);
	}
	pixels.update();
}



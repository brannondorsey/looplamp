var Pixel = require('./classes/adafruit_pixel').Pixel;

var lights = Pixel('/dev/spidev0.1', 11);
console.log(lights);
lights.all(0xff, 0, 0);
lights.sync(); // Updates strand with current buffer
lights.set(1, 0xff, 0xff, 0);
lights.set(2, 0xff, 0xff, 0xff);
lights.sync();

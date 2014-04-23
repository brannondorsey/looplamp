// serve this from localhost:port/behavior
var behavior = {
    "mode": "twitter",
    "tracking": "#lightupchicago",
    "streamMode": "filter",
    "dormant": {
        "animation": false,
        "main": {
        	"color": {
	            "r": 0,
	            "g": 100,
	            "b": 100
	        }
        },
        "secondary": {
        	"color": {
	            "r": 0,
	            "g": 100,
	            "b": 0
	        }
        }
    },
    "active": {
        "animation": false,
        "time": 500,
        "fluid": true,
        "main": {
            "color": {
                "r": 240,
                "g": 0,
                "b": 0
            }
        },
        "secondary": {
            "fluid": true,
            "color": {
                "r": 0,
                "g": 0,
                "b": 255
            }
        }
    }
}

var port = 3333;
var socket;

// var test = {foo:{bar: 1}};
// test.foo.bar = 5;
// console.log(test.foo.bar);
// console.log(eval('test.foo.bar'));

$(document).ready(function(){

	$(".color-slider").slider({
		orientation: "horizontal",
		range: "min",
		max: 255
		// slide: refreshSwatch,
		// change: refreshSwatch
	});

	// make all sliders touch draggable
	$('.slider').draggable();

	loadBehavior();

	$("#twitter-tracking").on('keypress', function(evt){
		if (evt.keyCode == 13) {
			$(this).blur();
		}
	});

	$("#twitter-tracking").on('blur', function(evt){
		behavior.tracking = $("#twitter-tracking").attr("value");
		sendUpdate('behavior.tracking', 
				   '#twitter-tracking', 
				   behavior.tracking,
				   false);
	});

	// onUpdateRecieved('behavior.dormant.main.color.r',
	// 				 '.dormant .color-slider.red',
	// 				 200);
	// socket = io.connect('http://localhost:' + port);
	
	// socket.on('updated', function (update) {
	//    onUpdateRecieved(update);
	// });
});

// code to load the current behavior
function loadBehavior() {
	
	// set values based on behavior and register on slide events
	$(".dormant .color-slider.red")
		.slider("value", behavior.dormant.main.color.r)
		.on("slide", function(event, ui) {
			behavior.dormant.main.color.r = ui.value;
			sendUpdate('behavior.dormant.main.color.r',
						".dormant .color-slider.red",
						ui.value,
						true);
		});
	$(".dormant .color-slider.green")
		.slider("value", behavior.dormant.main.color.g)
		.on("slide", function(event, ui) {
			behavior.dormant.main.color.g = ui.value;
			sendUpdate('behavior.dormant.main.color.g',
						".dormant .color-slider.green",
						ui.value,
						true);
		});
	$(".dormant .color-slider.blue")
		.slider("value", behavior.dormant.main.color.b)
		.on("slide", function(event, ui) {
			behavior.dormant.main.color.b = ui.value;
			sendUpdate('behavior.dormant.main.color.b',
						".dormant .color-slider.blue",
						ui.value,
						true);
		});

	// same for active
	$(".active .color-slider.red")
		.slider("value", behavior.active.main.color.r)
		.on("slide", function(event, ui) {
			behavior.active.main.color.r = ui.value;
			sendUpdate('behavior.active.main.color.r',
						".active .color-slider.red",
						ui.value,
						true);
		});
	$(".active .color-slider.green")
		.slider("value", behavior.active.main.color.g)
		.on("slide", function(event, ui) {
			behavior.active.main.color.g = ui.value;
			sendUpdate('behavior.active.main.color.g',
						".active .color-slider.green",
						ui.value,
						true);
		});
	$(".active .color-slider.blue")
		.slider("value", behavior.active.main.color.b)
		.on("slide", function(event, ui) {
			behavior.active.main.color.b = ui.value;
			sendUpdate('behavior.active.main.color.b',
						".active .color-slider.blue",
						ui.value,
						true);
		});

	$("#twitter-tracking").attr("value", behavior.tracking);
}

function sendUpdate(javascript, css, value, isSlider) {
	// socket.emit("update", {
	// 	javascript: javascript,
	// 	css: css,
	// 	value: value,
	// 	isSlider: isSlider
	// });
}

/*
	{
		javascript: "",
		css: "",
		value: 1,
		isSlider: true
	}
 */
function onUpdateRecieved(update) {
	eval(update.javascript + " = " + update.value);
	if (update.isSlider) $(css).slider("value", value);
	else $(css).attr("value", value);
}


function hexFromRGB(r, g, b) {

	var hex = [
		r.toString( 16 ),
		g.toString( 16 ),
		b.toString( 16 )
	];
	$.each( hex, function( nr, val ) {
		if ( val.length === 1 ) {
			hex[ nr ] = "0" + val;
		}
	});
	return hex.join("").toUpperCase();
}


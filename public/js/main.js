// serve this from localhost:port/behavior

var settings;
var socket;
var behavior;
var activeSwitch;
var url = location.protocol + "//" + location.host;

$(document).ready(function(){

	$(".color-slider").slider({
		orientation: "horizontal",
		range: "min",
		max: 255,
		min: 0
	});

	// make all sliders touch draggable
	$('.slider').draggable();

	$.getJSON(url + "/data/settings", function(data){

		settings = data;
		loadBehavior(function(){

			socket = io.connect(url);
			socket.on('updated', function (update) {
			   onUpdateRecieved(update);
			});

			$("#twitter-tracking").on('keypress', function(evt){
				if (evt.keyCode == 13) {
					$(this).blur();
				}
			});

			$("#twitter-tracking").on('blur', function(evt){
				behavior.tracking = $("#twitter-tracking").val();
				sendUpdate('behavior.tracking', 
						   '#twitter-tracking', 
						   behavior.tracking,
						   false);
			});			 

			$("#active-switch").change(function(){
				behavior.active.enabled = !behavior.active.enabled;
				$("#active-block").toggleClass("disabled", !behavior.active.enabled);
				sendUpdate('behavior.active.enabled',
					       '#active-switch',
			               behavior.active.enabled,
			               false);
			});
		});
	});
});

// code to load the current behavior
function loadBehavior(callback) {
	
	$.getJSON(url + "/data/behavior", function(data){
		
		behavior = data;

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

		// checkbox
		$("#active-switch").prop('checked', behavior.active.enabled);
		activeSwitch = $("input[type='checkbox'].switch").switchButton({
			checked: behavior.active.enabled,
			labels_placement: "right"
		});

		if (!behavior.active.enabled) $("#active-block").toggleClass("disabled", true);
		callback();
	});
}

function sendUpdate(javascript, css, value, isSlider) {
	socket.emit("update", {
		javascript: javascript,
		css: css,
		value: value,
		isSlider: isSlider
	});
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
	eval(update.javascript + " = '" + update.value + "'");
	if (update.isSlider) $(update.css).slider("value", update.value);
	else if (update.css == "#twitter-tracking") $(update.css).attr("value", update.value);
	else if (update.css == "#active-switch") {
		$(update.css).prop('checked', update.value);
		activeSwitch.switchButton("redraw");
		$("#active-block").toggleClass("disabled", !update.value);
	}
}

function setActiveEnabled(bool) {

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


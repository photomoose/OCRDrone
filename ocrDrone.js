var arDrone = require('ar-drone');
var nodecr = require('nodecr');
var fs = require('fs');

var client = arDrone.createClient();

// Disable logging from nodecr module
nodecr.log = function() { }

var currentImage = null;
var lastCommand = null;
var command = null;

// Emergency Landing! Any input on stdin will send a 
// land command to the drone. Very useful!
var stdin = process.openStdin();
stdin.addListener("data", land);

// Continuously capture each image from the PNG stream and save them to disk,
// using the timestamp as the filename.
var pngStream = client.getPngStream();
pngStream.on('data', function(image) {

	// Only save an image when currentImage is null - this ensures we
	// handle only one image at a time and prevent the file from being
	// overwritten whilst it is being processed by nodecr.
	if (currentImage === null) {
		var filename = new Date().getTime() + ".png";

		fs.writeFile(filename, image, function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        processImage(filename);
		    }
		}); 
	}
});


function processImage(fileName) {
	nodecr.process(fileName, function(err, text) {
		var command;
	    
	    if(err) {
	        //console.error(err);
	    } else {

	    	validCommand = true;
	    	
	    	if (text.indexOf("TAKE OFF") != -1) {
	    		command = takeOff;
	    	} else if (text.indexOf("LAND PLEASE") != -1) {
	    		command = land;
	    	} else if (text.indexOf("SPIN AROUND") != -1) {
				command = spin;
			} else if (text.indexOf("FLIP LEFT") != -1) {
				command = flipLeft;
			} else if (text.indexOf("FLIP RIGHT") != -1) {
				command = flipRight;
			} else if (text.indexOf("FLASH LEDS") != -1) {
				command = flash;
			} else if (text.indexOf("GO MENTAL") != -1) {
				command = goMental;
			} else {
				validCommand = false;
			}

			// As we are continuously processing images, we end up processing the
			// same command multiple times. (If you show "SPIN AROUND" to the drone, it may
			// capture 10 photos of the text, resulting in the drone spinning 10 times). 
			// To prevent this, we keep track of the last command executed, so that we 
			// don't execute it multiple times at once. 
			if (validCommand && lastCommand != command) {
				
				console.log("OCR Result: " + text);

				command();

				lastCommand = command;

				// If the image was found to contain a valid command, move the image to
				// the valid folder. Otherwise move it to the invalid folder.
				// This allows you to identify which images caused the commands to be executed. 
				fs.rename(fileName, "valid/" + fileName);
			} else {
				fs.rename(fileName, "invalid/" + fileName)
			}
	    }

	    currentImage = null;
	});	
}


function takeOff() {
	console.log("Taking off...");

	client.takeoff(function() {
		console.log("Airborne");
	});
}

function land() {
	console.log("Landing...");

	client.land(function() {
		console.log("Landed");
	});
}

function spin() {
	console.log("Spinning...");

	client
	  .after(0, function() {
	    this.clockwise(1);
	  })
	  .after(3000, function() {
	    this.counterClockwise(1);
	  })
	  .after(3000, function() {
	  	this.stop();
	  });
}

function flipLeft() {
	console.log("Flipping left...");

	client.animate('flipLeft', 1500);
}

function flipRight() {
	console.log("Flipping right...");

	client.animate('flipRight', 1500);
}

function flash() {
	console.log("Flashing LEDs...");

	client.animateLeds('doubleMissile', 4, 20);
}

function goMental() {
	console.log("Going mental...");

	client.animateLeds('doubleMissile', 15, 30);

	client.after(0, function() {
		this.back(0.1);
	})
	.after(1000, function() {
		this.left(0.1);
	})
	.after(1000, function() {
		this.front(0.1);
	})
	.after(1000, function() {
		this.right(0.1);
	})
	.after(1000, function() {
		this.stop();
	});
}


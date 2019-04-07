// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
	requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// file for images.json
var file = "images.json"; /** File locaiton of images.json **/

// Holds the retrieved JSON information
var data;

// Array holding GalleryImage objects (see below).
var mImages = [];

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'insert_url_here_to_image_json';


function swapPhoto() {
	//if the index number is less than the number of images in mImages then proceed
	if (mCurrentIndex < mImages.length )  {
		$('#photo').attr('src', mImages[mCurrentIndex].imgPath);
		mCurrentIndex += 1; //Add a 1 to get the next image in the mImages array
	} else if (mCurrentIndex == mImages.length) {
		//if the index number has reached the amount of images in mImages array, then start over by setting to 0
		mCurrentIndex = 0;
	}


	console.log('swap photo');
}






mRequest.onreadystatechange = function() {
	/** Execute function when request is ready **/
	console.log('Called');
	if (mRequest.readyState == 4 && mRequest.status == 200) { /** Check if readyState = 4 and status = 200 **/
		try {
			data = JSON.parse(mRequest.responseText);
			/** Parse the JSON file from the mRequest and store in variable **/
			//console.log(data);

		} catch (err) {
			console.log(err.message);
		}

		organizeData(data); /** Call function that will do another task and pass the parsed data **/

	}

}
mRequest.open("GET", file,true);
mRequest.send();


// Function/Object that stores the gallery image variables from JSON file
//This object is used by organizeData() function
function GalleryImage(imgLocation, description, date, imgPath){
	this.imgLocation = imgLocation;
	this.description = description;
	this.date = date;
	this.imgPath = imgPath;
}


function organizeData(data) {
	//console.log(data); /** Log the array for testing purposes **/

	for(var i = 0; i < data.images.length; i++) {	/** Will iterate data json parsed array and push each value of the key into a GalleryImage object **/
		mImages.push( new GalleryImage(data.images[i].imgLocation, data.images[i].description, data.images[i].date, data.images[i].imgPath) );
		//console.log(data.images[i].imgLocation);
	}
	console.log(mImages);

}



//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();


});

window.addEventListener('load', function() {

	console.log('window loaded');

}, false);


// ==UserScript==
// @name        SpotThePlane
// @namespace   foo
// @description Add a cell in the plane info grid to help user spot the actual plane in the sky
// @include     http://www.flightradar24.com/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7139/SpotThePlane.user.js
// @updateURL https://update.greasyfork.org/scripts/7139/SpotThePlane.meta.js
// ==/UserScript==


/* User's coordinates. Will be set by setUserData using local storage or
   default values.
*/
var userLat;
var userLon;

/* Don't touch that, this is the Earth's radius. */
var R = 6371000;

var COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
		       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];


/* Notes:
	- Angles are immediatly converted to rad when getting the data
      and converted back to deg just before returning them to the user.
      => All the work is done in rad
	- The terminology used for the 3D coordinates system of the program is:
		- azimuth (angle from North. e.g. North = 0° ; Est = 90°)
		- elevation (angle from the horizon e.g. horizon = 0° ; zenith = 90°)
		- distanceFromObserver (distance between the observer and the plane)
*/

/* CONVERSIONS, PARSING */

function toRad(degrees){
	return degrees * Math.PI/180;
}

function toDeg(radians){
	return radians * (180/Math.PI);
}

/* Take a coordinate (an int) and render a string limited to 4 characters
	e.g. 3.14159265 -> '3.14...'
   It is used for displaying user's coordinate. See functions toSpan and
   createSpotThePlaneLine.
*/
function reduceCoord(coordinate){
	var my_string = coordinate.toString();
	if (my_string.length > 4){
		my_string = my_string.slice(0,4) + '...';
	}
	return my_string;
}

/* Parse a flightradar24 string representing altitude in feet and return the
   altitude in meters (a float).
	e.g. '10,000 ft' -> 3048,037064...
*/
function parseAlt(altitude){
	var useful = altitude.split(' ')[0];
	useful = useful.replace(',','');
	return parseInt(useful)/3.2808; // 1 foot = 1/3.2808 meters
}

/* Take the azimuth and return a user-friendly string representating it using
   the compass's strings given by compass (a tab).
*/
function interpretAzimuth(angle, compass){
	var len = compass.length;
	var closest = compass[0];
	var min = angle;
	for (var k=1 ; k <= len ; k++){
		var dist = Math.abs(angle - k*2*Math.PI/len);
		if (dist < min){   /* Getting closer to the optimum */
			min = dist;
			closest = compass[k%len];
			/* We let k reach len so that something like 358° will be detected
	           as close to 360°. In such a case, we actually want: North =
			   compass[0].
			*/
		}
		else{   /* Optimum already passed. No need to investigate further. */
			break;
		}
	}
	return closest;
}


/* MATH COMPUTATIONS */

/* Formulas used to compute bearing and distance were found at:
   http://www.movable-type.co.uk/scripts/latlong.html
*/

/* Azimuth of 2 where the reference is 1. */
function azimuthBetween(lat1, lon1, lat2, lon2){
	var y = Math.sin(lon2-lon1) * Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) -
			Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
	return (Math.atan2(y, x) + 2*Math.PI) % (2*Math.PI);
}

function distanceBetween(lat1, lon1, lat2, lon2){
	var dlat = lat2 - lat1;
	var dlon = lon2 - lon1;
	var slat = lat1 + lat2;
	var x = dlon * Math.cos(slat/2);
	var result = Math.sqrt(x*x + dlat*dlat) * R;
	return result;
}

/* Assuming the ground is flat between the observer and the projection of
   the plane on the ground, the distance between the observer and the plane
   is obtained with the Pythagorean theorem.
*/
function distanceFromObserver(groundDistance, altitude){
	return Math.sqrt(altitude*altitude + groundDistance*groundDistance);
}

/* With the same assumption as in the previous function, the angle between
   the horizon and the plane is obtained with the arctan function.
*/
function elevation(groundDistance, altitude){
	return Math.atan(altitude/groundDistance);
}

/* Contrails appear when temperature is below -39°C and humidity above
   68% and with some chance. Below ~30 000 feet (9144 m), air is too hot to
   allow contrails, so we can assure with reasonable certainty that a plane
   this low leaves 'No trails'.
*/
function trailsInfos(altitude){
	if (altitude < 9144){
		return 'No trails';
	}
	else{
		return '';
	}
}


/* FINAL INFO LINE */

/* Take all the data and return the SpotThePlane string.
   1 is observer. 2 is plane.
   Returns something like 'ENE 22° 25km, No trails'
*/
function getSTPLine(lat1, lon1, lat2, lon2, altitude){
	var groundDistance = distanceBetween(lat1, lon1, lat2, lon2);
	var angle = elevation(groundDistance, altitude);
	var trails = trailsInfos(altitude);
	if (angle < Math.PI/60){  // Twist: Earth isn't flat
		return 'Below the horizon';
	}
	else{
		var dObs = distanceFromObserver(groundDistance, altitude);
		var line = interpretAzimuth(azimuthBetween(lat1, lon1, lat2, lon2),
									COMPASS)
				+ ' ' + Math.round(toDeg(angle)).toString() + '°'
				+ ' ' + Math.round(dObs/1000) + 'km';
		if (trails){
			line += ', ' + trails;
		}
		return line;
	}
}


/* DATA GATHERING */

/* Here we capture the latitude, longitude and altitude of the selected
   plane.
*/
function getPlaneData(){
	var latitude = document.getElementById('latVal').innerHTML;
	var longitude = document.getElementById('lonVal').innerHTML;
	var altitude = document.getElementById('altitudeVal').innerHTML;
	return {'lat': toRad(parseFloat(latitude)),
			'lon': toRad(parseFloat(longitude)),
			'alt': parseAlt(altitude)};
}

/* Set the globals userLat and userLon by looking into the browser's local
   storage. By default, set the globals to the Greenwitch observatory's
   coordinates.
*/
function setUserData(){
	userLat = localStorage.getItem('userLat');
	userLon = localStorage.getItem('userLon');
	if (!userLat){
		userLat = '...';
	}
	if (!userLon){
		userLon = '...';
	}
}


/* DOM MODIFICATION */

/* Making of the new line in the plane info grid. */
function createSpotThePlaneLine(value){
	var newLine = document.createElement('tr');
	var firstCol = document.createElement('td');
	var secondCol = document.createElement('td');
	
	firstCol.setAttribute('class', 'iconContainer');
	secondCol.setAttribute('colspan', '2');
	
	secondCol.appendChild(document.createTextNode('SpotThePlane'));
	
	var userForm = document.createElement('form');
	userForm.setAttribute('style',
		'display:inline-block; float:right;');
	userForm.setAttribute('action', 'javascript:void(0);');
	
	var userLatSpan = document.createElement('span');
	userLatSpan.setAttribute('id', 'userLat');
	userLatSpan.innerHTML = reduceCoord(userLat);
	var userLonSpan = document.createElement('span');
	userLonSpan.setAttribute('id', 'userLon');
	userLonSpan.innerHTML = reduceCoord(userLon);
	
	userForm.appendChild(userLatSpan);
	userForm.appendChild(document.createTextNode(' | '));
	userForm.appendChild(userLonSpan);
	
	secondCol.appendChild(userForm);
	
	secondCol.appendChild(document.createElement('br'));
	
	var stpLine = document.createElement('span');
	stpLine.setAttribute('class', 'strong');
	stpLine.setAttribute('id', 'SpotThePlane');
	stpLine.appendChild(document.createTextNode(value));
	
	secondCol.appendChild(stpLine);
	
	newLine.appendChild(firstCol);
	newLine.appendChild(secondCol);
	
	return newLine;
}

/* Managing the user coordinates inputs */

// function latSpanToInput(latSpan) {
// 	var input = getInput(userLat);
// 	var parent = latSpan.parent;
// 	parent.insertBefore(input, latSpan);
// 	parent.removeChild(latSpan);
// 	input.addEventListener(
// 		'blur',
// 		function() {
// 			latInputToSpan();
// 			updateSTPLine();
// 		},
// 		false
// 	);
// 	input.addEventListener(
// 		'keypress',
// 		function() {
// 			latInputToSpan();
// 			updateSTPLine();
// 		},
// 		false
// 	);
// }

function toBox(elem){
	var parent = elem.parentNode;
	var id = elem.getAttribute('id');
	if (id == 'userLat'){
		content = userLat.toString();
	}
	if (id == 'userLon'){
		content = userLon.toString();
	}
	var box = document.createElement('input');
	box.setAttribute('id', id);
	box.setAttribute('value', content);
	box.setAttribute('style',
		'width:25px; border:1px solid #666; font-size:0.9em;');
	parent.insertBefore(box, elem);
	parent.removeChild(elem);
	box.addEventListener(
		'blur',
		function(){
			toSpan(box, false);
			updateSTPLine();
		},
		false
	);
	box.addEventListener(
		'keypress',
		function(e){
			if (e.keyCode == 13 || e.keyCode == 9){
				e.preventDefault(); // The tab key would trigger a Firefox built-in
				toSpan(box, true);
				updateSTPLine();
			}
		},
		false
	);
	box.select();
}

function toSpan(elem, goNext){
	var id = elem.getAttribute('id');
	if (document.getElementById(id).tagName == 'INPUT') {
	/* On Opera and Chrome, the keypress on enter also triggers the blur event,
	   which would cause toSpan to be executed twice. To avoid the second
	   execution, we make sure that the element we want to transform into a
	   span is currently an input */
		var parent = elem.parentNode;
		var content = elem.value;
		if (content == ''){
			content = '...'
		}
		else if (isNaN(content)) {
			content = NaN;
		}
		else {
			content = parseFloat(content);
		}
		if (id == 'userLat'){
			userLat = content;
		}
		if (id == 'userLon'){
			userLon = content;
		}
		content = reduceCoord(content);
		var span = document.createElement('span');
		span.setAttribute('id', id);
		span.innerHTML = content;
		parent.insertBefore(span, elem);
		parent.removeChild(elem);
		span.addEventListener(
			'click',
			function(){
				toBox(span);
			},
			false
		);
		if (goNext && id == 'userLat'){
			toBox(document.getElementById('userLon'));
		}
	}
}

function attachNewLine(newLine){
	var aircraftInfos = document.getElementsByClassName('aircraftInfoGrid')[0].children[0];
	aircraftInfos.appendChild(newLine);
}


/* FIELD UPDATING */

function updateSTPLine(){
	var stpValue = document.getElementById('SpotThePlane');
	var message;
	if (userLon === '...' || userLat === '...') {
		message = 'Awaiting coordinates';
	}
	else if (isNaN(userLon) || isNaN(userLat)) {
		message = 'Invalid coordinates';
	}
	else {
		var data = getPlaneData();
		message = getSTPLine(toRad(userLat), toRad(userLon), data.lat, 
									data.lon, data.alt);
	}
	stpValue.innerHTML = message;
}


function giveMeSomeSpace() {
	document.getElementById('leftColOverlayAdContainer').setAttribute('style', 'display:none;');
}


/* MAIN PROGRAM */

function run(){
	setUserData();
	giveMeSomeSpace();

	var spotThePlane = createSpotThePlaneLine('Initializing...');
	attachNewLine(spotThePlane);

	/* The event DOMSubtreeModified will detect any change in the altitude,
	   longitude or altitude of the plane and the SpotThePlane line will be
	   updated everytime there is such a change.
	*/
	document.getElementById('latVal').addEventListener("DOMSubtreeModified", updateSTPLine, false);
	document.getElementById('lonVal').addEventListener("DOMSubtreeModified", updateSTPLine, false);
	document.getElementById('altitudeVal').addEventListener("DOMSubtreeModified", updateSTPLine, false);
	
	var userLatSpan = document.getElementById('userLat');
	var userLonSpan = document.getElementById('userLon')
	
	userLatSpan.addEventListener('click', function(){ toBox(userLatSpan); }, false);
	userLonSpan.addEventListener('click', function(){ toBox(userLonSpan); }, false);
	
	window.onbeforeunload = function(){
		localStorage.setItem('userLat', userLat);
		localStorage.setItem('userLon', userLon);	
	};
}

run();
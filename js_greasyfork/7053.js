// ==UserScript==
// @name       HUP Javascript mikulás
// @namespace  https://greasyfork.org/en/scripts/7053
// @version    0.2.2
// @description  enter something useful
// @match      http://hup.hu/*
// @match      https://hup.hu/*
// @run-at document-end
// @copyright  2024+, Én
// @downloadURL https://update.greasyfork.org/scripts/7053/HUP%20Javascript%20mikul%C3%A1s.user.js
// @updateURL https://update.greasyfork.org/scripts/7053/HUP%20Javascript%20mikul%C3%A1s.meta.js
// ==/UserScript==

var FLAKE_COUNT = 60;
var UPDATE_INTERVAL = 33;
var SPEED = 1.0;
var WIND_SPEED = 0.0;

var WIDTH = 137;
var HEIGHT = 206;
var image = "/images/xmas/xmas" + ((new Date().getDate() % 10) + 1) + ".jpg";
var flakes = [];

var obj = null;
var images = document.getElementsByTagName("img");
for(var i = 0; i < images.length; i++){
    if(images[i].src.match(/https?:\/\/hup\.hu\/images\/xmas\/xmas2\.gif/) !== null){
        obj = images[i].parentElement;
        obj.removeChild(images[i]);
        break;
    }
}

if(obj !== null){
	var canvas = document.createElement("canvas");
	canvas.style.cssText = "background-image: url('" + image + "')";
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	obj.appendChild(canvas);

	var context = canvas.getContext("2d");
	context.fillStyle = "rgba(255, 255, 255, 1.0)";

	for(i = 0; i < FLAKE_COUNT; i++){
		var flake = {x: Math.random() * WIDTH,
					 y: Math.random() * HEIGHT,
					 //r: (Math.random() * 1.5) + 1,
					 r: ((i / (FLAKE_COUNT - 1.0)) * 1.5) + 1,
					 dir: 0};
		if(Math.random() > 0.5){
			flake.dir = 1;
		}else{
			flake.dir = -1;
		}
		flakes.push(flake);
	}

	var update = function(){
		for(var i = 0; i < FLAKE_COUNT; i++){
			flake = flakes[i];
			flake.y = (flake.y + (flake.r * SPEED)) % (HEIGHT + flake.r);
			flake.x = flake.x + (flake.r * 0.08 * SPEED * flake.dir) + (WIND_SPEED * flake.r);
			if(flake.x + flake.r < 0.0){
				flake.x = WIDTH + flake.r;
			}else if(flake.x - flake.r > WIDTH){
				flake.x = 0.0 - flake.r;
			}
		}

		context.clearRect(0, 0, WIDTH, HEIGHT);
		context.beginPath();
		for(i = 0; i < FLAKE_COUNT; i++){
			flake = flakes[i];
			context.moveTo(flake.x, flake.y);
			context.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2, true);
		}
		context.fill();
	};

	setInterval(update, UPDATE_INTERVAL);
}
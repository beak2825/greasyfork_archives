// ==UserScript==
// @name         mimicker
// @author       fooksie
// @description  alt+click to set point, ctrl+alt+click to cycle through points, click to stop
// @match        http://cursors.io/
// @version 0.0.1.20141024144148
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/5984/mimicker.user.js
// @updateURL https://update.greasyfork.org/scripts/5984/mimicker.meta.js
// ==/UserScript==
window.addEventListener("load", function() {
	var	mimic=[],
		index=0,
		lastdate=0,
		playing=true,
		canvas=document.getElementById("canvas");
	Date.prototype.valueOf=function() {
		return lastdate+=101;
		};
	function repeat() {
		if(playing) {
			var	prev=mimic[index++%mimic.length],
				event=document.createEvent("MouseEvents");
			event.initMouseEvent("mousedown", true, true, unsafeWindow, 0, 0, 0, prev[0], prev[1]);
			canvas.dispatchEvent(event);
			requestAnimationFrame(repeat);
			}
		};
	canvas.parentElement.addEventListener("click", function(event) {
		if(playing) {
			mimic=[];
			playing=false;
			}
		if(event.altKey) {
			var	prev=mimic[mimic.length-1];
			if(event.ctrlKey) {
				playing=true;
				requestAnimationFrame(repeat);
				}
			else {
				mimic.push([event.x, event.y]);
				}
			}
		});
	});
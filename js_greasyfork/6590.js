// ==UserScript==
// @name        CH SET Master Improvements
// @author      clickhappier
// @namespace   clickhappier
// @description Y/N with confirm and header for SET Master.
// @version     1.1c
// @match      	https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/6590/CH%20SET%20Master%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/6590/CH%20SET%20Master%20Improvements.meta.js
// ==/UserScript==


// based on https://greasyfork.org/en/scripts/6266-zing-receipt-compare-script

var radios = document.getElementsByTagName("input");
var button = document.getElementById("submitButton");
var submitBut = button;
document.onkeydown = showkeycode;


var taskType;
if ( document.querySelector("p#instructions").textContent.indexOf("Does this webpage contain") > -1 )
{
    taskType = document.querySelector("p#instructions").textContent.replace("Does this webpage contain", "a webpage containing").trim();
}
else if ( document.querySelector("p#instructions").textContent.indexOf("Does this web page contain") > -1 )
{
    taskType = document.querySelector("p#instructions").textContent.replace("Does this web page contain", "a webpage containing").trim();
}
else if ( document.querySelector("p#instructions").textContent.indexOf("Does this video collage contain") > -1 )  // Image Categorization
{
    taskType = document.querySelector("p#instructions").textContent.replace("Does this video collage contain", "a video collage containing").replace("Please read the FAQ", "").replace("if you have any questions.", "").trim();
}
else if ( document.querySelector("p#instructions").textContent.indexOf("Click on all the images where") > -1 )  // Clickable Image Tagging
{
    taskType = document.querySelector("p#instructions").textContent.replace("Click on all the ", "").replace('Please select the "No Matches" checkbox if there are no such images. The images will turn gray when you click them.', "").replace("Please read the FAQ", "").replace("if you have any questions.", "").trim();
}
else if ( document.querySelector("p#instructions").textContent.indexOf("Please read the FAQ if you have any questions.") > -1 )
{
    taskType = document.querySelector("p#instructions").textContent.replace("Please read the FAQ if you have any questions.", "");
}


// sticky heading
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
if ( document.body.querySelector("div#hithtml div#hitbody div#header").textContent.indexOf("SET") > -1 ){  // verifying this is a SET Master HIT
addGlobalStyle('div#description { width: 100%;  position: relative;  top: 0px;  background-color: #FFFFFF;  margin-left: 0px !important; }');
addGlobalStyle('p#instructions { width: 100%;  position: fixed;  z-index: 999;  top: 0px;  left: 0px;  background-color: #FFFFFF;  margin-left: 0px !important; }');
}


// press n for no, y for yes, o for no matches on clickable images hits
function showkeycode(evt){
    if ( document.body.querySelector("div#hithtml div#hitbody div#header").textContent.indexOf("SET") > -1 ){  // verifying this is a SET Master HIT
	var keycode = evt.keyCode;
	switch (keycode) {
		case 78: //n
		for (i = 0; i < radios.length; i++) {
			if (radios[i].type == "radio"){
				if (radios[i].value == "no") {
					radios[i].click();
					if (confirm("Are you sure this is NOT " + taskType)) submitBut.click();
				}
			}
		}
		break;
		case 89: //y
		for (i = 0; i < radios.length; i++) {
			if (radios[i].type == "radio"){
				if (radios[i].value == "yes") {
					radios[i].click();
					if (confirm("Are you sure this IS " + taskType)) submitBut.click();
				}
			}
		}
		break;
		case 79: //o
		for (i = 0; i < radios.length; i++) {
			if (radios[i].type == "checkbox"){
				if (radios[i].name == "no-matches") {
					radios[i].click();
					if (confirm("Are you sure there are NO " + taskType)) submitBut.click();
				}
			}
		}
		break;
		default: break;
	}
	}
}
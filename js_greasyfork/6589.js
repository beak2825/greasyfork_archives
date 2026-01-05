// ==UserScript==
// @name        CH Machine Learning Improvements
// @author      clickhappier
// @namespace   clickhappier
// @description Y/N with confirm and header for Machine Learning.
// @version     1.1c
// @match      	https://www.mturkcontent.com/dynamic/hit*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6589/CH%20Machine%20Learning%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/6589/CH%20Machine%20Learning%20Improvements.meta.js
// ==/UserScript==


// based on https://greasyfork.org/en/scripts/6266-zing-receipt-compare-script


var radiosML = document.getElementsByTagName("input");
var buttonML = document.getElementsByClassName("btn-primary");
var submitButML;
document.onkeydown = showkeycodeML;


for (i = 0; i < buttonML.length; i++) {
	if (buttonML[i].type == "submit") {
		submitButML = buttonML[i];
	}
}


var taskTypeML;
if ( document.querySelector(".panel-heading").textContent.indexOf("Login") > -1 )
{
    taskTypeML = "a properly-labeled LOGIN form";
}
else if ( document.querySelector(".panel-heading").textContent.indexOf("Sign") > -1 )
{
    taskTypeML = "a properly-labeled SIGN-UP form";
}


// sticky heading
function addGlobalStyleML(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
if ( document.querySelector("section[id='TranscriptionFromAnImage']") != "" ){  // verify this is a Machine Learning HIT
    addGlobalStyleML('h4 { width: 100%;  position: fixed;  top: 0px;  background-color: #FFFFFF; }');
}


// press n for no, y for yes
function showkeycodeML(evt){
	if ( document.querySelector("section[id='TranscriptionFromAnImage']") != "" ){  // verify this is a Machine Learning HIT
        var keycode = evt.keyCode;
    	switch (keycode) {
    		case 78: //n
    		for (i = 0; i < radiosML.length; i++) {
    			if (radiosML[i].type == "radio"){
    				if (radiosML[i].value == "false") {
    					radiosML[i].checked = true;
    					if (confirm("Are you sure this is NOT " + taskType + "?")) submitButML.click();
    				}
    			}
    		}
    		break;
    		case 89: //y
    		for (i = 0; i < radiosML.length; i++) {
    			if (radiosML[i].type == "radio"){
    				if (radiosML[i].value == "true") {
    					radiosML[i].checked = true;
    					if (confirm("Are you sure this IS " + taskType + "?")) submitButML.click();
    				}
    			}
    		}
    		break;
    		default: break;
    	}
	}
}
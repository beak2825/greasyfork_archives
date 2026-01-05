// ==UserScript==
// @name         Images and Sentences HIT Helper
// @namespace    http://ericfraze.com
// @version      0.2
// @description  "Relate a phrase to an image (10 questions)" and "Identify if two phrases are related (10 questions)". Press 1, 2, or 3 to select options and hit next.
// @author       Eric Fraze
// @match    https://web.engr.illinois.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5586/Images%20and%20Sentences%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5586/Images%20and%20Sentences%20HIT%20Helper.meta.js
// ==/UserScript==


$(document).ready(function() {
	$(document).keyup(function (event) {
      var key = toCharacter(event.keyCode);
        if ( $("#corefprompt:contains('Do the highlighted phrases in the caption(s) refer to the same things in the image?')").length ) {
            if (key=='1'){
                $("#corefTrue").click();
                $("#save").click();
            }
            
            if (key=='2'){
                $("#corefFalse").click();
                $("#save").click();
            }
        }else{
            if (key=='1'){
                $("#good").prop("checked", true);
                $("#draw").prop("checked", true);
                $("#corefTrue").click();
                nextQuestion();
            }
            
            if (key=='2'){
                $("#bad").prop("checked", true);
                $("#scene").prop("checked", true);
                $("#corefFalse").click();
                nextQuestion();
            }
            
            
            if (key=='3'){
                $("#nodraw").prop("checked", true);
                nextQuestion();
            }
        }
 	});
});

function toCharacter(keyCode) {

	// delta to convert num-pad key codes to QWERTY codes.
	var numPadToKeyPadDelta = 48;

	// if a numeric key on the num pad was pressed.
	if (keyCode >= 96 && keyCode <= 105) {
	    keyCode = keyCode - numPadToKeyPadDelta;
	    return String.fromCharCode(keyCode);
	}

	if (keyCode == 106)
	    return "*";

	if (keyCode == 107)
	    return "+";

	if (keyCode == 109)
	    return "-";

	if (keyCode == 110)
	    return ".";

	if (keyCode == 111)
	    return "/";

	// the 'Enter' key was pressed
	if (keyCode == 13)
	    return "=";  //TODO: you should change this to interpret the 'Enter' key as needed by your app.

	return String.fromCharCode(keyCode);
}
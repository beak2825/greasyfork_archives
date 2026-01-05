// ==UserScript==
// @name         (mTurk) Dave Cobb HIT Helper EDITED
// @namespace    http://ericfraze.com
// @version      0.6
// @description  (mTurk) Press "1" to select "Yes, we missed some faces/heads!" and advance. Press "2" to select "No, every single face/head has been found." and advance. "3" submits.
// @author       Eric Fraze
// @match        https://dbxtagger.appspot.com/*
// @match        https://s3.amazonaws.com/mturk_bulk/hits/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6405/%28mTurk%29%20Dave%20Cobb%20HIT%20Helper%20EDITED.user.js
// @updateURL https://update.greasyfork.org/scripts/6405/%28mTurk%29%20Dave%20Cobb%20HIT%20Helper%20EDITED.meta.js
// ==/UserScript==

var content = document.getElementsByClassName("imgdiv")[0];
content.tabIndex = "0";
content.focus();

$(document).ready(function() {
	if ( $("h1:contains('Did we miss any faces/heads?')").length ) {
	    $(".introtogglebtn").click();
	    
	    $(document).keyup(function (event) {
	        var key = toCharacter(event.keyCode);
	        
	        if (key=='1') {
	            $("#missed").click();
	            $("#nextbtn").click();
                $("#submitbtn:visible").click();
	            
	        }
	        
	        if (key=='2') {
	            $("#notmissed").click();
	            $("#nextbtn").click();
                $("#submitbtn:visible").click();
	        }
	        
	        if (key=='3') {
	            $("#submitbtn").click();
	        }
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
			    return "ENTER";  //TODO: you should change this to interpret the 'Enter' key as needed by your app.

			return String.fromCharCode(keyCode);
		}
	}
});
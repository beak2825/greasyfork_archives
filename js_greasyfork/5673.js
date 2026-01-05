// ==UserScript==
// @name         MyLikes, Zing and Ben Peterson Pebble Controls
// @namespace    http://ericfraze.com
// @version      0.2
// @description  This script is for personal use. It helps me do certain HITs with my Pebble.
// @author       Eric Fraze
// @match        https://backend.ibotta.com/duplicate_receipt_moderation/*
// @match        https://s3.amazonaws.com/mylikes_serve/*
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5673/MyLikes%2C%20Zing%20and%20Ben%20Peterson%20Pebble%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/5673/MyLikes%2C%20Zing%20and%20Ben%20Peterson%20Pebble%20Controls.meta.js
// ==/UserScript==

$(document).ready(function() {
    $(document).keyup(function (event) {
        var key = toCharacter(event.keyCode);
        var color = "rgba(255,0,0,0.8)";
        
        // Zing hit
        if ( $(".container h1:contains('Are these pictures of the same receipt?')").length ) {
            if (key=='1') {
                $("input[value='true']").prop("checked", true);
                $("button[type='submit']").click();
                color = "rgba(0,255,0,0.8)";
            }
            
            if (key=='2') {
                $("input[value='false']").prop("checked", true);
                $("button[type='submit']").click();
                color = "rgba(255,0,0,0.8)";
            }
        }
        
        // MyLikes HIT
        if ( $("h3:contains('Does this image contain...')").length ) {
            if (key=='1') {
                $("#submit_safe").click();
                color = "rgba(0,255,0,0.8)";
            }
            
            if (key=='2') {
                $("#submit_mature").click();
                color = "rgba(255,0,0,0.8)";
            }
        }
        
        if ( !$("#wage").length ) {
        	$("body").append("<div id='wage-wrapper'><div id='wage'></div></div>");
            $("#wage-wrapper").css('position','fixed');
            $("#wage-wrapper").css('width','100%');
            $("#wage-wrapper").css('height','100%');
            $("#wage-wrapper").css('top','0');
            $("#wage-wrapper").css('left','0');
            $("#wage-wrapper").css('background-color',color);
            
            $("#wage").css('position','absolute');
            $("#wage").css('top','50%');
            $("#wage").css('font-size','50px');
            $("#wage").css('color','white');
            $("#wage").css('width','100%');
            $("#wage").css('text-align','center');
        }
        
        $("#wage").append("Test");
        
        
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
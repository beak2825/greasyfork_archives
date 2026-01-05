// ==UserScript==
// @name       PI Search Hotkeys
// @Author Lowlife
// @version 0.2
// @namespace Space
// @description Hotkeys for PI Search (1, 2, 3, 4, 5, Enter) Disable any other PI Search script for best results.
// @include    https://s3.amazonaws.com/*
// @include    https://www.mturkcontent.com/*
// @copyright  
// @downloadURL https://update.greasyfork.org/scripts/7800/PI%20Search%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/7800/PI%20Search%20Hotkeys.meta.js
// ==/UserScript==


var page = document.getElementById("mturk_form");
var div = page.getElementsByClassName("panel-body")[0];
div.style.display = "none";

var a = 1;
var b = 2;

document.addEventListener( "keydown", kas, false);

buttons = document.getElementsByTagName('button');

function kas(i) {

if ( (i.keyCode == 49) || (i.keyCode == 97) ) { // Selects "1"
    document.getElementById("Q" + a + "_5").click();
    document.getElementById("Q" + b + "_5").focus();
	a++;
        b++;

	} 
if ( (i.keyCode == 50) || (i.keyCode == 98)) { // Selects "2"
    document.getElementById("Q" + a + "_4").click();
    document.getElementById("Q" + b + "_5").focus();
	a++;
        b++;
    
	}   
if ( (i.keyCode == 51) || (i.keyCode == 99)) { // Selects "3"
    document.getElementById("Q" + a + "_3").click();
    document.getElementById("Q" + b + "_5").focus();
	a++;
	b++;
    
	}   
if ( (i.keyCode == 52) || (i.keyCode == 100)) { // Selects "4"
    document.getElementById("Q" + a + "_2").click();
    document.getElementById("Q" + b + "_5").focus();
	a++;
 	b++;
    
	}   
if ( (i.keyCode == 53) || (i.keyCode == 101)) { // Selects "5"
    document.getElementById("Q" + a + "_1").click();
    document.getElementById("Q" + b + "_5").focus();
	a++;
	b++;
    
	}     
if ( i.keyCode == 13 ) { // Selects "Submit"
    document.getElementById("submitButton").click();
	}
}

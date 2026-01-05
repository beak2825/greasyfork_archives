// ==UserScript==
// @name       	  Jeff Binder
// @author         Rat Monkey
// @version        1.4
// @description  Adds Hot keys to Jeff Binder hits.
// @updateurl  
// @include        http://162.243.50.229*
// @namespace https://greasyfork.org/users/1973
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6943/Jeff%20Binder.user.js
// @updateURL https://update.greasyfork.org/scripts/6943/Jeff%20Binder.meta.js
// ==/UserScript==

document.addEventListener( "keydown", kas, false);
buttons = document.getElementsByTagName('button');

// Use the number keys on your numpad, 0 - 6. Whereas 0 selects the option zero and proceeds to the next meaning. A single key press moves to the next page.

function kas(i) {
if ( i.keyCode == 96 ) { // Selects "0"
    document.getElementById("rg0").click();
document.getElementsByTagName('button')[0].click();
	} 
if ( i.keyCode == 97 ) { // Selects "1"
    document.getElementById("rg1").click();
	document.getElementsByTagName('button')[0].click();
	}   
if ( i.keyCode == 98 ) { // Selects "2"
    document.getElementById("rg2").click();
	document.getElementsByTagName('button')[0].click();
	}   
if ( i.keyCode == 99 ) { // Selects "3"
    document.getElementById("rg3").click();
	document.getElementsByTagName('button')[0].click();
	}   
if ( i.keyCode == 100 ) { // Selects "4"
    document.getElementById("rg4").click();
	document.getElementsByTagName('button')[0].click();
	}   
if ( i.keyCode == 101 ) { // Selects "5"
    document.getElementById("rg5").click();
	document.getElementsByTagName('button')[0].click();
	}   
if ( i.keyCode == 102 ) { // Selects "6"
    document.getElementById("rg6").click();
	document.getElementsByTagName('button')[0].click();
	}
	if ( i.keyCode == 110 ) { // Selects "Not Applicable"
    document.getElementById("rg7").click();
	document.getElementsByTagName('button')[0].click();
	}   
}

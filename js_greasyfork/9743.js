// ==UserScript==
// @name        Neopets - Neocola Auto
// @namespace   Jarofgrease.captainmaxthecat.com
// @description Auto plays the neocola machine, selects all options at random
// @author 		Demeiz
// @email 		admin@captainmaxthecat.com
// @homepage	http://www.captainmaxthecat.com
// @version		1.0
// @language	en
// @include		*.neopets.com/moon/neocola*.phtml
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/9743/Neopets%20-%20Neocola%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/9743/Neopets%20-%20Neocola%20Auto.meta.js
// ==/UserScript==

(function(){

var loc = document.location.href;

// click button to start
if (loc.match('neopets.com/moon/neocola.phtml')){
	onward = document.evaluate("//input[@value='Onward!']", document, null,7, null);
	doclick = onward.snapshotItem(0);
	doclick.click();
return;
}

// auto complete the form values on the page with random
// then click to accept
if (loc.match('neopets.com/moon/neocola2.phtml')){
  var goin = document.getElementsByName('token_id')[0];
  if (goin){
    goin.options.selectedIndex = Math.floor((Math.random() * 1) + 1);
  }
    var goin1 = document.getElementsByName('neocola_flavor')[0];
  if (goin1){
    goin1.options.selectedIndex = Math.floor((Math.random() * 8) + 1);
  }
    var goin2 = document.getElementsByName('red_button')[0];
  if (goin2){
    goin2.options.selectedIndex = Math.floor((Math.random() * 6) + 1);
  }
  butval = document.evaluate("//input[@value='Continue to your doom...']", document, null,7, null);
doclick = butval.snapshotItem(0);
doclick.click();
  return;
}

// replay after complete
if (loc.match('neopets.com/moon/neocola3.phtml')){
	again = document.evaluate("//input[@value='Play Again!']", document, null,7, null);
	doclick = again.snapshotItem(0);
	doclick.click();
return;
}

})();
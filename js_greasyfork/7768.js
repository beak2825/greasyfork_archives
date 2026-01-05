// ==UserScript==
// @name        Psr Radio Button Fix
// @description Helps isolate radio buttons on Windows Problem Step Recorder
// @namespace   adrianmaz@live.com
// @version     1
// @include 	http://sasha.it.att.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7768/Psr%20Radio%20Button%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/7768/Psr%20Radio%20Button%20Fix.meta.js
// ==/UserScript==




function partA() {
	var a = document.getElementsByTagName("input");
	//var elem = document.getElementById('back_button');
        //elem.parentNode.removeChild(elem);
	for(var i = 0; i<a.length; i++){
		a[i].addEventListener("click", titleChange);
	}
}
function titleChange(){
	document.title = this.nextSibling.textContent;
}

setInterval (function() { checkRadioButton (); }, 750);
function checkRadioButton () {
   partA();
}


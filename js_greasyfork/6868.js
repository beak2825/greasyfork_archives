// ==UserScript==
// @name             Big Optimizer
// @namespace        http://*.younow.com
// @description      Optimize some Sites with some Features (This script even does the laundry! :-P) ©imBig
// @include          http://www.younow.com/*
// @include          http://*.younow.com/*
// @icon             http://www.dooffy.com/USoubory/clanky/2009/dooffy_slon_slune_elefant.jpg
// @version          1.0
// @author	     		imBig
// @copyright	     	imBig
// @grant            none
// @require				http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @run-at document-end
//
// @history        1.0 Initial Version, kills blurred Loginframe
//
// @downloadURL https://update.greasyfork.org/scripts/6868/Big%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/6868/Big%20Optimizer.meta.js
// ==/UserScript==


// YouNow
window.setTimeout(ifSiteloaded, 1000);
function ifSiteloaded() {
	document.getElementsByClassName('modal-backdrop')[0].style.display='none';
	document.getElementsByClassName('social-login-modal')[0].style.display='none';
}

// TDC
// soon...
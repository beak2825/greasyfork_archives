// ==UserScript==
// @name        	Instagram: middle-click to new tab 
// @description  	Allows you to open links in new tabs by middle clicking
// @include     	*://www.instagram.com/*
// @version     	1.01
// @grant       	none
// @namespace https://greasyfork.org/users/5802
// @downloadURL https://update.greasyfork.org/scripts/7795/Instagram%3A%20middle-click%20to%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/7795/Instagram%3A%20middle-click%20to%20new%20tab.meta.js
// ==/UserScript==

window.addEventListener('click', function(e){
	if(e.button == 1 || (e.button == 0 && e.ctrlKey)){
		e.stopPropagation();
	}
}, true);
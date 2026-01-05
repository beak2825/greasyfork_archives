// ==UserScript==
// @name        Voat Width Fix
// @namespace   Kaori
// @include     https://voat.co/v/*
// @grant       none
// @description Makes Voat use entire screen
// @version 0.0.1.20150212014746
// @downloadURL https://update.greasyfork.org/scripts/8020/Voat%20Width%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/8020/Voat%20Width%20Fix.meta.js
// ==/UserScript==

(function()
{

	var x = document.getElementById("container");
	
	if (x)
		x.style["max-width"] = "100%";

})();
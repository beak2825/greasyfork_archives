// ==UserScript==
// @name         always 10% zoom
// @description  there is none
// @match        http://voar.io/
// @version 0.0.1.20141031203959
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/6189/always%2010%25%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/6189/always%2010%25%20zoom.meta.js
// ==/UserScript==
void function() {
	var	context=document.getElementById("canvas").getContext("2d");
	context.scale=function(initial) {
		return function() {
			initial.call(this, 0.11, 0.11);
			};
		}(context.scale);
	}();
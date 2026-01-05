// ==UserScript==
// @name			emjack-h
// @version			1.0.0
// @description		hijack socket
// @match			epicmafia.com/*
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/5482/emjack-h.user.js
// @updateURL https://update.greasyfork.org/scripts/5482/emjack-h.meta.js
// ==/UserScript==
inject=document.createElement("script");
inject.textContent="void "+String(function() {
	var	sjs=SockJS.prototype;
	sjs.send=function(initial) {
		return function(packet) {
			window.sock=this;
			console.log("<", packet);
			initial.call(this, packet);
			};
		}(sjs.send);
	sjs._dispatchMessage=function(initial) {
		return function(packet) {
			window.sock=this;
			console.log(">", packet);
			initial.call(this, packet);
			};
		}(sjs._dispatchMessage);
	}+"()");
window.addEventListener("load", function(event) {
	document.body.appendChild(inject);
	});
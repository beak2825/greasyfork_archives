// ==UserScript==
// @name			em.hidden links
// @version			1.0
// @description		Reveal hidden links upon clicking them, prevent action
// @match			https://epicmafia.com/*
// @namespace https://greasyfork.org/users/4723
// @downloadURL https://update.greasyfork.org/scripts/7377/emhidden%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/7377/emhidden%20links.meta.js
// ==/UserScript==

window.addEventListener("click", function(event) {
	if(event.target.href) {
		if(/^javascript:/.test(event.target.href)) {
			prompt("hidden link", event.target.href);
			event.preventDefault();
			}
		}
	});
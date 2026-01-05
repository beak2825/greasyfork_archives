// ==UserScript==
// @name           Go To Review
// @namespace      https://github.com/AstroCB
// @author         Cameron Bernhardt (AstroCB)
// @version        1.1
// @description    Adds a "G+R" shortcut to go to review
// @include        *://*.stackexchange.com/*
// @include        *://*stackoverflow.com/*
// @include        *://*serverfault.com/*
// @include        *://*superuser.com/*
// @include        *://*askubuntu.com/*
// @include        *://*stackapps.com/*
// @include        *://*mathoverflow.net/*
// @downloadURL https://update.greasyfork.org/scripts/8660/Go%20To%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/8660/Go%20To%20Review.meta.js
// ==/UserScript==

function listenForKeys(e) {
	if (e.keyCode === 114 && lastKey === 103) {
		var review;
		var links = $(".topbar-menu-links")[0].children;
		for (var i = 0; i < links.length; i++) {
			if (links[i].href && (links[i].href.indexOf("review") + 6 === links[i].href.length)) {
				review = links[i];
			}
		}
		review.click();
	}
	lastKey = e.keyCode;
}

function stopListeningForKeys() {
	$("body").unbind("keypress", listenForKeys);
};

function attachListener() {
	var lastKey;
	$("body").keypress(listenForKeys);
}

var main = function () {
	attachListener();
	window.setInterval(function () { // Some text fields are created dynamically
		$("input").focus(stopListeningForKeys).keypress(stopListeningForKeys);
		$("input").blur(attachListener);

		$("textarea").focus(stopListeningForKeys).keypress(stopListeningForKeys);
		$("textarea").blur(attachListener);
	}, 1000);
};

var listen = document.createElement("script");
listen.type = "text/javascript";
listen.textContent = listenForKeys.toString();
document.body.appendChild(listen);

var stop = document.createElement("script");
stop.type = "text/javascript";
stop.textContent = stopListeningForKeys.toString();
document.body.appendChild(stop);

var attach = document.createElement("script");
attach.type = "text/javascript";
attach.textContent = attachListener.toString();
document.body.appendChild(attach);

var script = document.createElement("script");
script.type = "text/javascript";
script.textContent = "(" + main.toString() + ")();";
document.body.appendChild(script);
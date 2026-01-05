// ==UserScript==
// @name              Remove peyvandha.ir
// @namespace         Remove peyvandha.ir
// @description    Replaces the Islamic Republic of Iran censored content notice page with this message: "Content has been censored by the Islamic Republic of Iran!" and allows you to load the censored content from Google web cache.
// @include           *
// @version 0.0.1.20150519151043
// @downloadURL https://update.greasyfork.org/scripts/9964/Remove%20peyvandhair.user.js
// @updateURL https://update.greasyfork.org/scripts/9964/Remove%20peyvandhair.meta.js
// ==/UserScript==

var filters = ["http://10.10.34.34/"];
var iframe = document.getElementsByTagName("iframe")[0];
var loc = document.location;

for (var j = 0; j < filters.length; ++j) {
	if (iframe.src.indexOf(filters[j]) != -1) {
		var cache = "https://webcache.googleusercontent.com/search?q=cache:" + loc + "&hl=en";
		var text = document.createElement("p");
		text.innerHTML = "Content has been censored by the Islamic Republic of Iran! <a href = '" + cache + "'>Click here</a> to try loading it from Google web cache.";
		iframe.parentNode.replaceChild(text, iframe);
	}
}
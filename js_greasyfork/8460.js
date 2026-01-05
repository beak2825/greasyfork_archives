// ==UserScript==
// @name        docjar-helper
// @namespace   com.docjar-helper
// @description hide line numbers for docjar
// @include     http://www.docjar.com/html/*.java.html*
// @version     1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8460/docjar-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/8460/docjar-helper.meta.js
// ==/UserScript==

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) { 
			c_start = c_start + c_name.length + 1 ;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start, c_end));
		} 
	}
	return "";
}

function setCookie (c_name, value, expiresecs) {
	var exdate = new Date();
	exdate.setSeconds(exdate.getSeconds() + expiresecs);
	document.cookie = c_name + "=" + escape(value) + ((expiresecs == null) ? "" : ";expires=" + exdate.toGMTString());
}

var pre = document.getElementsByTagName("pre")[0];

var ognlHTML = pre.innerHTML;

function clipLineNumber(ognlHTML) {
	return ognlHTML.replace(new RegExp("[\\s0-9]{5}\\s&nbsp;\\s", "ig"), "");
}

var clippedHTML = clipLineNumber(ognlHTML);

var headDiv = document.getElementsByTagName("div")[0];

var sharp = document.createTextNode("# ");
var hideArchor = document.createElement("a");
var showArchor = document.createElement("a");
hideArchor.innerHTML = "hide line numbers";
showArchor.innerHTML = "show line numbers";

headDiv.appendChild(document.createTextNode("# ["));
headDiv.appendChild(hideArchor);
headDiv.appendChild(document.createTextNode(" | "));
headDiv.appendChild(showArchor);
headDiv.appendChild(document.createTextNode("]"));

function hideLineNum() {
	pre.innerHTML = clippedHTML;
	showArchor.onclick = showLineNum;
	hideArchor.onclick = null;
	showArchor.href = "#show-line-numbers";
	hideArchor.removeAttribute("href");
	location.hash = "hide-line-numbers";
	setCookie("line-number-display", "hidden");
}

function showLineNum() {
	pre.innerHTML = ognlHTML;
	hideArchor.onclick = hideLineNum;
	showArchor.onclick = null;
	hideArchor.href = "#hide-line-numbers";
	showArchor.removeAttribute("href");
	location.hash = "show-line-numbers";
	setCookie("line-number-display", "onshow");
}

if (location.hash == "#hide-line-numbers") {
	hideLineNum();
} else if (location.hash == "#show-line-numbers") {
	showLineNum();
} else if (getCookie("line-number-display") == "onshow") {
	showLineNum();
} else if (getCookie("line-number-display") == "hidden") {
	hideLineNum();
} else {
	showLineNum();
}
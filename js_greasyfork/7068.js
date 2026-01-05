// ==UserScript==
// @name			Bootstrap Site Navigation Userscript
// @namespace		https://github.com/anthonycl
// @version			0.1
// @description		Greasemonkey/Tampermonkey Userscript automatically fix the bootstrap site's navigation to the top as you scroll.
// @author			Anthony Fulginiti <anthony@cliklabs.com>
// @match			http://*.getbootstrap.com/*
// @include			http://*.getbootstrap.com/*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/7068/Bootstrap%20Site%20Navigation%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/7068/Bootstrap%20Site%20Navigation%20Userscript.meta.js
// ==/UserScript==

var d = document.getElementById("top");
d.className = d.className + " navbar-fixed-top";
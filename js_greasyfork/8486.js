// ==UserScript==
// @name WhatsApp Web Client - Disable leave/reload dialog
// @description Simply disables the window.onbeforeunload handler by setting it to null
// @namespace http://www.sveneppler.de/
// @include https://web.whatsapp.com/*
// @grant none
// @run-at document-end
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/8486/WhatsApp%20Web%20Client%20-%20Disable%20leavereload%20dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/8486/WhatsApp%20Web%20Client%20-%20Disable%20leavereload%20dialog.meta.js
// ==/UserScript==
// 
// Delay the execution by 5 seconds
window.setTimeout(function() {
	window.onbeforeunload = null;
	console.log("'WhatsApp Web Client - Disable leave/reload dialog' loaded...");
}, 5000);

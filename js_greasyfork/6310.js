// ==UserScript==
// @name			Rescue Console
// @description		Rescues the console at website refresh to prevent overwriting by the website.
// @namespace		RescueConsole
// @author			Tobbe
// @version			1.1
//
// @include			*
//
// @run-at			document-start
//
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/6310/Rescue%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/6310/Rescue%20Console.meta.js
// ==/UserScript==

// Store the console to window.debugConsole to prevent overwriting by the website.
try {
    window.wrappedJSObject.debugConsole = window.console;
} catch(e) {
    window.debugConsole = window.console;
}
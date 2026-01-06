// ==UserScript==
// @name         WebSocket wrapping example
// @namespace    http://tampermonkey.net/
// @version      2026-01-05
// @description  Less resource intensive way to intercept the games messages
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561542/WebSocket%20wrapping%20example.user.js
// @updateURL https://update.greasyfork.org/scripts/561542/WebSocket%20wrapping%20example.meta.js
// ==/UserScript==

(function() {
	/*
		Less resource intensive way to intercept the games messages.

		Instead of executing some code in each MessageEvent.prototype.data,
		subscribe to the ws once using .addEventListener.

		Use unsafeWindow to set window.WebSocket in the original page context.

		Use @run-at document-start to do that before the game calls the WebSocket constuctor.
	*/

	function listener (e) {
		const message = JSON.parse(e.data);
		console.log(message);
	}

	const OriginalWebSocket = unsafeWindow.WebSocket;
	class WrappedWebSocket extends OriginalWebSocket {
		constructor (...args) {
			super(...args);
			console.log("Subscribed to the game WebSocket");
			if (this.url.startsWith("wss://api.milkywayidle.com/ws") || this.url.startsWith("wss://api-test.milkywayidle.com/ws")) {
				this.addEventListener("message", listener);
			}
		}
	}

	/*
		.CONNECTING/.OPEN/.CLOSED are used in .performConnectionHealthCheck() and .sendHealthCheckPing() in the game
	*/
	WrappedWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
	WrappedWebSocket.OPEN = OriginalWebSocket.OPEN;
	WrappedWebSocket.CLOSED = OriginalWebSocket.CLOSED;

	unsafeWindow.WebSocket = WrappedWebSocket;

	console.log("Wrapped window.WebSocket");

})();

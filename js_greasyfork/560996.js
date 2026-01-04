// ==UserScript==
// @name         DGG Special Relay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Parallel chat for custom emotes in Destiny.gg
// @author       You
// @match        https://www.destiny.gg/embed/chat*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560996/DGG%20Special%20Relay.user.js
// @updateURL https://update.greasyfork.org/scripts/560996/DGG%20Special%20Relay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔴 ADMIN SETTING: The Public Relay Server
    // Replace this with your deploy URL from Cloudflare
    const SERVER_URL = "https://dgg-relay.bong8.workers.dev";

    // =========================================================
    // PART 1: THE COURIER (Network Layer)
    // =========================================================
    document.addEventListener('DGG_RELAY_OUTBOUND', function(e) {
        const data = e.detail;

        GM_xmlhttpRequest({
            method: "POST",
            url: SERVER_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                user: data.user,
                text: data.text
            }),
            onload: () => console.log("✅ DGG Relay: Sent to parallel server"),
            onerror: (err) => console.error("❌ DGG Relay: Upload Failed", err)
        });
    });

    // =========================================================
    // PART 2: THE HIJACKER (Page Layer)
    // =========================================================
    function pageScript() {
        const OriginalWebSocket = window.WebSocket;

        // Hook the WebSocket constructor
        window.WebSocket = function(url, protocols) {
            const ws = new OriginalWebSocket(url, protocols);

            // Identify the chat connection
            if (url.includes('destiny.gg') || url.includes('chat')) {
                console.log("⚓ DGG Relay: Chat Socket Captured");

                const originalSend = ws.send;
                ws.send = function(data) {
                    // Intercept outgoing text messages
                    if (typeof data === 'string' && data.startsWith('MSG')) {
                        try {
                            // DGG Protocol: MSG {"data":"text"}
                            const jsonStr = data.substring(4);
                            const parsed = JSON.parse(jsonStr);
                            const messageText = parsed.data;

                            // Get username from cookie
                            const userCookie = document.cookie.split('; ').find(row => row.startsWith('username='));
                            const username = userCookie ? userCookie.split('=')[1] : "Anon";

                            // Dispatch to Tampermonkey
                            const event = new CustomEvent('DGG_RELAY_OUTBOUND', {
                                detail: { user: username, text: messageText }
                            });
                            document.dispatchEvent(event);

                        } catch (e) {
                            // Ignore parse errors (ping/pong messages)
                        }
                    }
                    return originalSend.apply(this, arguments);
                };
            }
            return ws;
        };

        // Maintain prototype chain
        window.WebSocket.prototype = OriginalWebSocket.prototype;
        window.WebSocket.prototype.constructor = window.WebSocket;
    }

    // Inject the hijacker immediately
    const script = document.createElement('script');
    script.textContent = `(${pageScript.toString()})();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();

})();
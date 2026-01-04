// ==UserScript==
// @name         Powerline.io Ping Display
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows your ping in Powerline.io (top-left corner)
// @author       King's group
// @match        *://*.powerline.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551981/Powerlineio%20Ping%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/551981/Powerlineio%20Ping%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create ping display element
    const pingDisplay = document.createElement('div');
    pingDisplay.style.position = 'fixed';
    pingDisplay.style.top = '10px';
    pingDisplay.style.left = '10px';  // Changed to top-left
    pingDisplay.style.padding = '5px 10px';
    pingDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    pingDisplay.style.color = 'white';
    pingDisplay.style.fontSize = '16px';
    pingDisplay.style.fontFamily = 'Arial, sans-serif';
    pingDisplay.style.borderRadius = '5px';
    pingDisplay.style.zIndex = 9999;
    pingDisplay.innerText = 'Ping: -- ms';
    document.body.appendChild(pingDisplay);

    let lastPingTime = 0;

    // Intercept WebSocket to get ping
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

        ws.addEventListener('open', () => {
            lastPingTime = Date.now();
        });

        ws.addEventListener('message', (event) => {
            // Estimate ping based on message timing
            const now = Date.now();
            if (lastPingTime) {
                const ping = now - lastPingTime;
                pingDisplay.innerText = `Ping: ${ping} ms`;
            }
            lastPingTime = Date.now();
        });

        return ws;
    };

    window.WebSocket.prototype = OriginalWebSocket.prototype;
})();

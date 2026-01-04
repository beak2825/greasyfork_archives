// ==UserScript==
// @name         Bonk.io Ping Spoofer & Anti-AFK
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes your ping appear as 3000ms??? and prevents tabbed/AFK status
// @author       Greninja9257
// @match        https://bonk.io/*
// @license      Just don't copy ok?
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560004/Bonkio%20Ping%20Spoofer%20%20Anti-AFK.user.js
// @updateURL https://update.greasyfork.org/scripts/560004/Bonkio%20Ping%20Spoofer%20%20Anti-AFK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Bonk Ping Spoof & Anti-AFK] Script loaded');

    const SPOOFED_PING = 1; // Set ping to 3000ms XD
    const DEBUG_MODE = false; // Set to true to see what's being spoofed

    // Wait for the game iframe to load
    function waitForGameFrame() {
        const gameFrame = document.getElementById('maingameframe');
        if (!gameFrame) {
            setTimeout(waitForGameFrame, 100);
            return;
        }

        if (!gameFrame.contentWindow || !gameFrame.contentWindow.WebSocket) {
            setTimeout(waitForGameFrame, 100);
            return;
        }

        console.log('[Bonk Ping Spoof & Anti-AFK] Game frame detected, installing hooks...');
        hookWebSocket(gameFrame.contentWindow);
        preventTabDetection(gameFrame.contentWindow);
    }

    function hookWebSocket(contentWindow) {
        // Store original send if not already stored
        if (typeof(top.originalSend_PingSpoof) === 'undefined') {
            top.originalSend_PingSpoof = contentWindow.WebSocket.prototype.send;
        }

        let gameSocket = null;
        let lastPingId = -1;
        let pingInterval = null;
        let pingTimes = [];
        let averagePingInterval = 3000; // Default 3 seconds (bonk.io pings every 3000ms)
        let nextExpectedPingTime = null;
        let respondedPings = new Set();

        // Hook the send method to intercept outgoing packets
        contentWindow.WebSocket.prototype.send = function(data) {
            // Store socket reference
            if (!gameSocket && this.url && this.url.includes('.bonk.io/socket.io')) {
                gameSocket = this;
                hookIncomingMessages(this);
            }

            // Check if this is a bonk.io socket
            if (this.url && this.url.includes('.bonk.io/socket.io/?EIO=3&transport=websocket&sid=')) {
                if (typeof(data) === 'string') {
                    // Intercept and BLOCK original ping responses
                    if (data.startsWith('42[1,{"id":')) {
                        try {
                            const jsonData = data.substring(2);
                            const packet = JSON.parse(jsonData);

                            if (packet[0] === 1 && typeof packet[1] === 'object' && packet[1].id !== undefined) {
                                const pingId = packet[1].id;

                                if (DEBUG_MODE) {
                                    console.log('[Bonk Ping Spoof] 🚫 BLOCKED original ping response for ID:', pingId);
                                }

                                // Block - we already sent our instant response
                                return;
                            }
                        } catch (e) {
                            // If parsing fails, send original
                        }
                    }

                    // Block tabbed status packets (packet type 44 or 52)
                    if (data.startsWith('42[44,') || data.startsWith('42[52,')) {
                        if (DEBUG_MODE) {
                            console.log('[Bonk Anti-AFK] 🚫 Blocked tabbed status packet');
                        }
                        return;
                    }
                }
            }

            // Call the original send for all other packets
            if (typeof(top.originalSend2) !== 'undefined') {
                return top.originalSend2.call(this, data);
            } else {
                return top.originalSend_PingSpoof.call(this, data);
            }
        };

        function hookIncomingMessages(ws) {
            ws.addEventListener('message', function(event) {
                try {
                    const data = event.data;
                    if (typeof data === 'string' && data.startsWith('42[1,')) {
                        const jsonData = data.substring(2);
                        const packet = JSON.parse(jsonData);

                        // Incoming ping request from server
                        // Format: 42[1,{"30":180,"33":148,"34":190},pingId]
                        if (packet[0] === 1 && packet.length >= 3 && typeof packet[2] === 'number') {
                            const pingId = packet[2];
                            const receiveTime = Date.now();

                            // Track ping timing pattern
                            if (lastPingId !== -1) {
                                const expectedId = (lastPingId + 1) % 10;

                                if (pingId === expectedId && DEBUG_MODE) {
                                    console.log(`[Bonk Ping Spoof] 📊 Ping sequence: ${lastPingId} → ${pingId} (every 3000ms)`);
                                }
                            }

                            lastPingId = pingId;
                            nextExpectedPingTime = receiveTime + 3000;

                            if (DEBUG_MODE) {
                                console.log(`[Bonk Ping Spoof] 📥 Ping ID ${pingId} received`);
                            }

                            // Respond INSTANTLY to current ping
                            const response = `42[1,{"id":${pingId}}]`;
                            respondedPings.add(pingId);

                            if (DEBUG_MODE) {
                                console.log(`[Bonk Ping Spoof] ⚡ INSTANT response for ID ${pingId}`);
                            }

                            // Send immediately using original send
                            if (typeof(top.originalSend2) !== 'undefined') {
                                top.originalSend2.call(ws, response);
                            } else {
                                top.originalSend_PingSpoof.call(ws, response);
                            }

                            // PREDICT NEXT PING: Send response for next ID in advance!
                            const nextPingId = (pingId + 1) % 10;

                            // Wait just slightly (e.g., 10ms) then pre-send next response
                            setTimeout(() => {
                                const nextResponse = `42[1,{"id":${nextPingId}}]`;
                                respondedPings.add(nextPingId);

                                if (DEBUG_MODE) {
                                    console.log(`[Bonk Ping Spoof] 🚀 PRE-SENT response for next ID ${nextPingId} (before server even asks!)`);
                                }

                                // Send next response in advance
                                if (typeof(top.originalSend2) !== 'undefined') {
                                    top.originalSend2.call(ws, nextResponse);
                                } else {
                                    top.originalSend_PingSpoof.call(ws, nextResponse);
                                }
                            }, 10); // Small delay to not confuse the server

                            if (DEBUG_MODE) {
                                console.log(`[Bonk Ping Spoof] 🔮 Pre-sending response for ID ${nextPingId} in 10ms`);
                            }
                        }
                    }
                } catch (e) {
                    if (DEBUG_MODE) {
                        console.error('[Bonk Ping Spoof] Parse error:', e);
                    }
                }
            });
        }

        console.log('[Bonk Ping Spoof & Anti-AFK] ✅ WebSocket hooks installed - Using predictive ping response!');
    }

    function preventTabDetection(contentWindow) {
        // Override document visibility API to always appear focused
        try {
            Object.defineProperty(contentWindow.document, 'hidden', {
                get: function() { return false; },
                configurable: true
            });

            Object.defineProperty(contentWindow.document, 'visibilityState', {
                get: function() { return 'visible'; },
                configurable: true
            });

            // Prevent visibility change events
            const originalAddEventListener = contentWindow.document.addEventListener;
            contentWindow.document.addEventListener = function(type, listener, options) {
                if (type === 'visibilitychange') {
                    if (DEBUG_MODE) {
                        console.log('[Bonk Anti-AFK] Blocked visibilitychange listener');
                    }
                    return; // Don't add the listener
                }
                return originalAddEventListener.call(this, type, listener, options);
            };

            // Override window focus/blur to always appear focused
            Object.defineProperty(contentWindow.document, 'hasFocus', {
                value: function() { return true; },
                configurable: true
            });

            // Block blur events
            const originalWindowAddEventListener = contentWindow.addEventListener;
            contentWindow.addEventListener = function(type, listener, options) {
                if (type === 'blur' || type === 'focus') {
                    if (DEBUG_MODE) {
                        console.log('[Bonk Anti-AFK] Blocked ' + type + ' listener');
                    }
                    return; // Don't add the listener
                }
                return originalWindowAddEventListener.call(this, type, listener, options);
            };

            console.log('[Bonk Ping Spoof & Anti-AFK] ✅ Tab detection prevention installed');
        } catch (e) {
            console.error('[Bonk Ping Spoof & Anti-AFK] ❌ Error installing tab detection prevention:', e);
        }
    }

    // Start the script
    waitForGameFrame();
    console.log('[Bonk Ping Spoof & Anti-AFK] Script initialized - Ping will appear as ~1ms, AFK/Tab detection disabled');
})();
// ==UserScript==
// @name         Bonk.io Rainbow Name
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Makes your name rainbow in bonk.io by cycling through colors
// @author       Greninja9257
// @match        https://bonk.io/*
// @match        https://*.bonk.io/*
// @grant        none
// @run-at       document-end
// @license      don't copy lol
// @downloadURL https://update.greasyfork.org/scripts/563298/Bonkio%20Rainbow%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/563298/Bonkio%20Rainbow%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let rainbowInterval = null;
    let currentHue = 0;
    let isRainbowActive = false;

    // Convert HSL to RGB
    function hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // Function to send style update
    function updateRainbowStyle() {
        try {
            // Get current RGB color from HSL
            const rgb = hslToRgb(currentHue / 360, 1, 0.5);

            // Update local style directly without sending network message
            if (typeof window.allstyles !== 'undefined' && typeof window.username !== 'undefined') {
                window.allstyles[window.username] = rgb;
            }
            if (typeof window.mystyle !== 'undefined') {
                window.mystyle = [...rgb];
            }

            // Increment hue for next iteration
            currentHue = (currentHue + 2) % 360; // Faster transition - 2 degrees each update
        } catch (error) {
            console.error('Rainbow name error:', error);
        }
    }

    // Send style update to server (for other players to see)
    function sendStyleUpdate() {
        try {
            const rgb = hslToRgb(currentHue / 360, 1, 0.5);

            // Send to server for other players - THIS IS WHAT OTHER PLAYERS SEE
            if (typeof window.SEND !== 'undefined' && typeof window.username !== 'undefined') {
                window.SEND("42" + JSON.stringify([4, {
                    "type": "style",
                    "from": window.username,
                    "style": rgb
                }]));
            }
        } catch (error) {
            console.error('Rainbow name send error:', error);
        }
    }

    // Start rainbow effect
    function startRainbow() {
        if (isRainbowActive) return;

        isRainbowActive = true;
        console.log('Rainbow name started!');

        // Update local display every 16ms for smooth local animation
        rainbowInterval = setInterval(() => {
            updateRainbowStyle();
        }, 16);

        // Send updates to OTHER PLAYERS every 1ms
        setInterval(() => {
            if (isRainbowActive) {
                sendStyleUpdate();
            }
        }, 100);
    }

    // Stop rainbow effect
    function stopRainbow() {
        if (!isRainbowActive) return;

        isRainbowActive = false;
        if (rainbowInterval) {
            clearInterval(rainbowInterval);
            rainbowInterval = null;
        }

        // Reset to default style
        if (typeof window.SEND !== 'undefined' && typeof window.username !== 'undefined') {
            const defaultStyle = [0, 0, 0];

            window.SEND("42" + JSON.stringify([4, {
                "type": "style",
                "from": window.username,
                "style": defaultStyle
            }]));

            if (typeof window.allstyles !== 'undefined') {
                window.allstyles[window.username] = defaultStyle;
            }
            if (typeof window.mystyle !== 'undefined') {
                window.mystyle = defaultStyle;
            }
        }

        console.log('Rainbow name stopped!');
    }

    // Add chat commands
    function interceptChat() {
        const originalSend = window.SEND;

        window.SEND = function(...args) {
            try {
                if (args[0] && typeof args[0] === 'string') {
                    const data = args[0];

                    // Check if it's a chat message
                    if (data.startsWith('42[4,')) {
                        const parsed = JSON.parse(data.substring(2));
                        if (parsed[1] && parsed[1].message) {
                            const msg = parsed[1].message;

                            // Check for rainbow commands
                            if (msg === '/rainbow') {
                                startRainbow();
                                return; // Don't send the command as a chat message
                            } else if (msg === '/stoprainbow') {
                                stopRainbow();
                                return; // Don't send the command as a chat message
                            }
                        }
                    }
                }
            } catch (e) {
                // If parsing fails, just continue normally
            }

            return originalSend.apply(this, args);
        };
    }

    // Wait for the game to load
    function init() {
        const checkInterval = setInterval(() => {
            if (typeof window.SEND !== 'undefined' && typeof window.username !== 'undefined') {
                clearInterval(checkInterval);
                interceptChat();
                console.log('Bonk.io Rainbow Name loaded! Use /rainbow to start and /stoprainbow to stop. (cappp)');

                // Auto-start rainbow (comment this line if you want manual control)
                setTimeout(startRainbow, 2000);
            }
        }, 500);

        // Timeout after 30 seconds
        setTimeout(() => clearInterval(checkInterval), 30000);
    }

    // Start when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// ==UserScript==
// @name         Bonk.io Rainbow Username
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change your username to rainbow colors with /style command
// @author       You
// @match        https://bonk.io/*
// @match        https://*.bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562933/Bonkio%20Rainbow%20Username.user.js
// @updateURL https://update.greasyfork.org/scripts/562933/Bonkio%20Rainbow%20Username.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Rainbow color generation function
    function generateRainbowColors(text, hueStart, saturation, lightness) {
        const chars = text.split('');
        const hueStep = 360 / chars.length;
        let result = '';
        
        chars.forEach((char, index) => {
            const hue = (hueStart + (hueStep * index)) % 360;
            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            result += `<span style="color: ${color};">${char}</span>`;
        });
        
        return result;
    }

    // Store original username setter
    let originalUsername = '';
    let rainbowEnabled = false;
    let rainbowSettings = { hue: 0, saturation: 100, lightness: 50 };

    // Intercept chat messages
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        try {
            if (typeof data === 'string') {
                const parsed = JSON.parse(data);
                
                // Check for /style command in chat
                if (parsed.type === 'chat' && parsed.message) {
                    const message = parsed.message.trim();
                    const styleMatch = message.match(/^\/style\s+(\d+)\s+(\d+)\s+(\d+)$/);
                    
                    if (styleMatch) {
                        const [, hue, sat, light] = styleMatch.map(Number);
                        
                        // Validate ranges
                        if (hue >= 0 && hue <= 360 && sat >= 0 && sat <= 100 && light >= 0 && light <= 100) {
                            rainbowSettings = { hue, saturation: sat, lightness: light };
                            rainbowEnabled = true;
                            console.log(`Rainbow style activated: Hue=${hue}, Saturation=${sat}%, Lightness=${light}%`);
                            
                            // Don't send the command to chat
                            return;
                        }
                    }
                    
                    // /style off command
                    if (message === '/style off') {
                        rainbowEnabled = false;
                        console.log('Rainbow style disabled');
                        return;
                    }
                }
                
                // Apply rainbow to username changes
                if (parsed.type === 'setname' && parsed.name && rainbowEnabled) {
                    originalUsername = parsed.name;
                    parsed.name = generateRainbowColors(
                        originalUsername,
                        rainbowSettings.hue,
                        rainbowSettings.saturation,
                        rainbowSettings.lightness
                    );
                    data = JSON.stringify(parsed);
                }
            }
        } catch (e) {
            // If parsing fails, just send original data
        }
        
        return originalSend.call(this, data);
    };

    // Add help message on load
    console.log('Bonk.io Rainbow Username Script Loaded!');
    console.log('Commands:');
    console.log('  /style [hue] [saturation] [lightness] - Enable rainbow username');
    console.log('  Example: /style 0 100 50 (full rainbow)');
    console.log('  /style off - Disable rainbow effect');
    console.log('');
    console.log('Parameters:');
    console.log('  hue: 0-360 (starting color)');
    console.log('  saturation: 0-100 (color intensity)');
    console.log('  lightness: 0-100 (brightness)');

})();
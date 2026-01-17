// ==UserScript==
// @name         Bonk.io Rainbow Username (Visible to All)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make your username rainbow-colored - visible to everyone!
// @author       You
// @match        https://bonk.io/*
// @match        https://*.bonk.io/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562934/Bonkio%20Rainbow%20Username%20%28Visible%20to%20All%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562934/Bonkio%20Rainbow%20Username%20%28Visible%20to%20All%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getFrame = () => document.getElementById("maingameframe")?.contentWindow;
    
    // Function to generate rainbow HTML for username
    function makeRainbow(text) {
        if (!text) return text;
        
        const chars = text.split('');
        const hueStep = 360 / chars.length;
        let result = '';
        
        chars.forEach((char, index) => {
            const hue = (hueStep * index) % 360;
            // Using HSL for vibrant colors
            const color = `hsl(${hue}, 100%, 50%)`;
            result += `<span style="color: ${color};">${char}</span>`;
        });
        
        return result;
    }

    // Wait for the game to load
    function init() {
        const frame = getFrame();
        if (!frame) {
            setTimeout(init, 100);
            return;
        }

        let websocket = null;
        const originalSend = frame.WebSocket.prototype.send;

        frame.WebSocket.prototype.send = function(data) {
            try {
                // Check if this is the bonk.io websocket
                const validURL = this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=");
                
                if (validURL && (!websocket || websocket.readyState !== websocket.OPEN)) {
                    websocket = this;
                }

                // Parse the data to find username changes
                if (typeof data === 'string' && data.startsWith('42')) {
                    // Remove the "42" prefix that socket.io uses
                    const jsonStr = data.substring(2);
                    const parsed = JSON.parse(jsonStr);
                    
                    // Check if this is a setname command (changing username)
                    if (parsed[0] === 20 && parsed[1] && parsed[1].name) {
                        // Apply rainbow effect to the username
                        const originalName = parsed[1].name;
                        // Strip any existing HTML tags first
                        const plainName = originalName.replace(/<[^>]*>/g, '');
                        parsed[1].name = makeRainbow(plainName);
                        
                        // Rebuild the data string
                        data = '42' + JSON.stringify(parsed);
                        
                        console.log('Rainbow username applied:', plainName);
                    }
                }
            } catch (e) {
                // If parsing fails, send original data
                console.error('Error applying rainbow:', e);
            }
            
            return originalSend.call(this, data);
        };

        console.log('🌈 Bonk.io Rainbow Username Script Active!');
        console.log('Your username will appear rainbow to everyone in the game.');
        console.log('Just change your name normally and it will automatically be rainbow!');
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
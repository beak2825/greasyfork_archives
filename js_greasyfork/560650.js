// ==UserScript==
// @name         Torn CT - Smart Lock (Fixed Direction)
// @namespace    torn.ct.smartlock.fixed
// @version      1.4
// @description  Ensures old directions are fully cleared before new ones start.
// @author       User
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560650/Torn%20CT%20-%20Smart%20Lock%20%28Fixed%20Direction%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560650/Torn%20CT%20-%20Smart%20Lock%20%28Fixed%20Direction%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let walkInterval = null;
    const allKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    // 1. HARD RESET: Tells the browser every key is released
    function forceStopAll() {
        if (walkInterval) {
            clearInterval(walkInterval);
            walkInterval = null;
        }
        allKeys.forEach(key => {
            document.dispatchEvent(new KeyboardEvent('keyup', { 
                key: key, 
                keyCode: getKeyCode(key), 
                bubbles: true 
            }));
        });
        updateStatus("Stopped", "#ff4444");
    }

    function getKeyCode(key) {
        return { 'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39 }[key];
    }

    // 2. START WALKING: Clears old state first
    function startWalking(keysToPress) {
        forceStopAll(); // Clear previous directions entirely
        
        walkInterval = setInterval(() => {
            keysToPress.forEach(key => {
                document.dispatchEvent(new KeyboardEvent('keydown', { 
                    key: key, 
                    keyCode: getKeyCode(key), 
                    bubbles: true 
                }));
            });
        }, 50);
        updateStatus("Walking: " + keysToPress.join(' + '), "#00ff00");
    }

    // 3. MOUSE LISTENER
    document.addEventListener('mousedown', (e) => {
        const map = document.querySelector('#user-map');
        if (!map || !e.target.closest('#user-map')) return;

        // If currently walking, STOP and don't do anything else
        if (walkInterval) {
            forceStopAll();
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // Calculate Direction based on Click Position
        const rect = map.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        let newKeys = [];
        if (dy < -40) newKeys.push('ArrowUp');
        else if (dy > 40) newKeys.push('ArrowDown');
        if (dx < -40) newKeys.push('ArrowLeft');
        else if (dx > 40) newKeys.push('ArrowRight');

        if (newKeys.length > 0) {
            startWalking(newKeys);
            // Prevent the click from walking the character manually for 1 step
            e.preventDefault(); 
        }
    }, true);

    // 4. UI STATUS
    const status = document.createElement('div');
    status.style = "position:fixed; top:10px; left:50%; transform:translateX(-50%); z-index:999999; background:rgba(0,0,0,0.8); color:#ff4444; padding:8px 20px; border-radius:30px; font-family:sans-serif; font-weight:bold; pointer-events:none; border: 1px solid #444;";
    status.innerText = "Smart Lock: Ready";
    document.body.appendChild(status);

    function updateStatus(msg, color) {
        status.innerText = "Smart Lock: " + msg;
        status.style.color = color;
    }

})();

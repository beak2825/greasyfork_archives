// ==UserScript==
// @name        Torn Slots AutoClicker
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Adds a button to start an autoclicker on Torn slots page
// @author      MossaJehad
// @match       https://www.torn.com/page.php?sid=slots
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/550157/Torn%20Slots%20AutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/550157/Torn%20Slots%20AutoClicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sleep helper
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // The autoclick loop
    function autoBetLoop() {
        const tokens_num = document.querySelector('#tokens');

        function loop() {
            if (tokens_num && parseInt(tokens_num.innerText) > 0 && !window.stopAutoBet) {
                autoClickBet();
                console.log("New Click");
                sleep(2000).then(loop);
            } else {
                console.log("⛔ AutoBet stopped.");
            }
        }

        loop();
    }


    // Click simulation
    function autoClickBet() {
        const button = document.querySelector('li.betbtn.btn-10[data-bet="10"]');
        if (button) {
            const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            const up = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
            const click = new MouseEvent('click', { bubbles: true, cancelable: true });

            button.dispatchEvent(down);
            button.dispatchEvent(up);
            button.dispatchEvent(click);

            console.log("✅ Bet button triggered!");
        } else {
            console.log("❌ Button not found...");
        }
    }

    // Create UI button
    function addAutoClickerButton() {
        const btn = document.createElement("button");
        btn.innerText = "Auto Click";
        btn.style.position = "fixed";
        btn.style.top = "100px";
        btn.style.right = "20px";
        btn.style.zIndex = "9999";

        // Torn-style dimensions
        btn.style.padding = "6px 14px";
        btn.style.fontSize = "12px";
        btn.style.fontWeight = "700";
        btn.style.textTransform = "uppercase";
        btn.style.letterSpacing = "0.5px";
        btn.style.color = "#fff";
        btn.style.border = "1px solid #000";
        btn.style.borderRadius = "3px";

        // Dark gradient background
        btn.style.background = "linear-gradient(to bottom, #3a3a3a 0%, #1a1a1a 100%)";

        // Subtle shadows
        btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.6)";
        btn.style.cursor = "pointer";
        btn.style.fontFamily = "Verdana, Geneva, sans-serif";

        // Hover effect
        btn.onmouseover = () => {
            btn.style.background = "linear-gradient(to bottom, #4a4a4a 0%, #2a2a2a 100%)";
        };
        btn.onmouseout = () => {
            btn.style.background = "linear-gradient(to bottom, #3a3a3a 0%, #1a1a1a 100%)";
        };

        // Pressed effect
        btn.onmousedown = () => {
            btn.style.background = "linear-gradient(to bottom, #1a1a1a 0%, #3a3a3a 100%)";
            btn.style.boxShadow = "inset 0 2px 3px rgba(0,0,0,0.8)";
        };
        btn.onmouseup = () => {
            btn.style.background = "linear-gradient(to bottom, #4a4a4a 0%, #2a2a2a 100%)";
            btn.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.6)";
        };


        btn.onclick = () => {
            window.stopAutoBet = false; // reset stop flag
            autoBetLoop();
        };

        // Add a right-click stop feature
        btn.oncontextmenu = (e) => {
            e.preventDefault();
            window.stopAutoBet = true;
            console.log("🛑 AutoBet manually stopped.");
        };

        document.body.appendChild(btn);
    }

    // Wait for page load
    window.addEventListener('load', addAutoClickerButton);
})();

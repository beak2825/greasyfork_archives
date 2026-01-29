// ==UserScript==
// @name         Hasoth's tab chat alert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Browser tab info - Adds a red warning badge to the favicon and updates title while preserving page context.
// @author       Hasoth [4042954]
// @license MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564344/Hasoth%27s%20tab%20chat%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/564344/Hasoth%27s%20tab%20chat%20alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.torn_pda || navigator.userAgent.includes('Torn PDA')) return;

    const CHECK_INTERVAL = 2000;
    let originalFavicon = null;
    let lastCount = 0;

    // Canvas Setup
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Load Favicon
    img.crossOrigin = 'Anonymous';
    img.onload = () => { originalFavicon = img; startLoop(); };
    img.src = 'https://www.torn.com/favicon.ico';

    // --- TITLE MANAGEMENT ---
    // Helper to get the "Real" title without our prefix
    function getCleanTitle() {
        const title = document.title;
        // Regex removes "(1) " or "(9+) " from the start
        return title.replace(/^\(\d+\+?\)\s/, "");
    }

    function updateTitle(count) {
        const clean = getCleanTitle();
        if (count > 0) {
            // Only update if it's not already correct to avoid flickering
            const newTitle = `(${count}) ${clean}`;
            if (document.title !== newTitle) {
                document.title = newTitle;
            }
        } else {
            // Restore clean title if needed
            if (document.title !== clean) {
                document.title = clean;
            }
        }
    }

    // Observer to catch if Torn changes the title (e.g. navigation)
    // We re-apply our count if the title changes underneath us
    new MutationObserver(() => {
        if (lastCount > 0) {
             // If Torn changed title to "Gym", we immediately make it "(1) Gym"
             updateTitle(lastCount);
        }
    }).observe(document.querySelector('title'), { childList: true });


    function updateFavicon(count) {
        if (!originalFavicon) return;

        const head = document.getElementsByTagName('head')[0];
        const existingLink = document.querySelector("link[rel*='icon']");
        const link = existingLink || document.createElement('link');
        link.type = 'image/x-icon'; link.rel = 'shortcut icon';

        if (count > 0) {
            ctx.clearRect(0, 0, 32, 32);
            ctx.drawImage(originalFavicon, 0, 0, 32, 32);

            // Draw Badge
            ctx.beginPath();
            ctx.arc(22, 10, 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#ff0000';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            // Draw Number
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(count > 9 ? '9+' : count.toString(), 22, 10.5);

            link.href = canvas.toDataURL('image/png');
        } else {
            link.href = img.src;
        }

        // Apply Favicon
        if (existingLink) head.removeChild(existingLink);
        head.appendChild(link);

        // Apply Title
        updateTitle(count);
    }

    function checkChat() {
        const chatRoot = document.getElementById('chatRoot');
        if (!chatRoot) return;

        const badges = chatRoot.querySelectorAll('[class*="messageCount"]');
        let total = 0;

        badges.forEach(b => {
            const txt = b.innerText.trim();
            const val = parseInt(txt);
            // Check visibility (height > 0)
            if (b.getBoundingClientRect().height > 0 && !isNaN(val) && val > 0) {
                total += val;
            }
        });

        if (total !== lastCount) {
            updateFavicon(total);
            lastCount = total;
        }
    }

    function startLoop() {
        // Background Worker
        const workerBlob = new Blob([`self.onmessage=()=>{setInterval(()=>self.postMessage('t'),${CHECK_INTERVAL})}`],{type:"text/javascript"});
        const worker = new Worker(window.URL.createObjectURL(workerBlob));
        worker.postMessage('start');
        worker.onmessage = checkChat;

        checkChat();
    }

})();

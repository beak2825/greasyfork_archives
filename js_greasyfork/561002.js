// ==UserScript==
// @name         Torn Simple $1 Rainbow Glow by srsbsns
// @namespace    http://torn.com/
// @version      1.1
// @description  Spot $1 items instantly with a rainbow glow. If this lands you a big win, say hello to srsbsns :)
// @author       srsbsns
// @match        *://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561002/Torn%20Simple%20%241%20Rainbow%20Glow%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/561002/Torn%20Simple%20%241%20Rainbow%20Glow%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @keyframes rainbow-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        @keyframes star-sparkle {
            0% { opacity: 0.3; transform: scale(0.7) rotate(0deg); filter: drop-shadow(0 0 2px gold); }
            50% { opacity: 1; transform: scale(1.1) rotate(20deg); filter: drop-shadow(0 0 8px yellow); }
            100% { opacity: 0.3; transform: scale(0.7) rotate(0deg); filter: drop-shadow(0 0 2px gold); }
        }

        .ignite-rainbow {
            position: relative;
            overflow: hidden !important;
            border-radius: 4px;
            border: none !important;
            background: linear-gradient(90deg,
                rgba(255, 0, 0, 0.3),
                rgba(255, 165, 0, 0.3),
                rgba(255, 255, 0, 0.3),
                rgba(0, 255, 0, 0.3),
                rgba(0, 0, 255, 0.3),
                rgba(75, 0, 130, 0.3),
                rgba(238, 130, 238, 0.3),
                rgba(255, 0, 0, 0.3)) !important;
            background-size: 200% 100% !important;
            animation: rainbow-flow 6s linear infinite !important;
            box-shadow: inset 0 0 25px rgba(0,0,0,0.5) !important;
            z-index: 10 !important;
        }

        /* Fixed Star Position: pinned to top-right corner */
        .sparkle-star {
            position: absolute !important;
            right: 10px !important;
            top: 10px !important;
            font-size: 20px !important;
            animation: star-sparkle 1.5s infinite ease-in-out;
            pointer-events: none !important; /* Makes the star "ghostly" so you can click buttons under it */
            z-index: 15 !important;
        }

        .ignite-rainbow span, .ignite-rainbow p, .ignite-rainbow div {
            color: #fff !important;
            background: transparent !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5) !important;
            font-weight: bold !important;
        }
    `);

    function applyRainbowGlow() {
        const items = document.querySelectorAll('li, [class*="bazaar-card"], [class*="item_"], [class*="item___"]');

        items.forEach(item => {
            const textElements = item.querySelectorAll('span, p, div');
            const hasOneDollar = Array.from(textElements).some(el => el.textContent.trim() === '$1');
            const isLocked = item.querySelector('svg[class*="lock"], img[src*="lock"], [class*="locked"]');

            if (hasOneDollar && !isLocked) {
                if (!item.classList.contains('ignite-rainbow')) {
                    item.classList.add('ignite-rainbow');
                }

                if (!item.querySelector('.sparkle-star')) {
                    const star = document.createElement('span');
                    star.className = 'sparkle-star';
                    star.innerText = '⭐';
                    item.appendChild(star);
                }
            } else {
                item.classList.remove('ignite-rainbow');
                const star = item.querySelector('.sparkle-star');
                if (star) star.remove();
            }
        });
    }

    const observer = new MutationObserver(applyRainbowGlow);
    observer.observe(document.body, { childList: true, subtree: true });

    applyRainbowGlow();
})();
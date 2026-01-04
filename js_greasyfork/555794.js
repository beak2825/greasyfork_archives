// ==UserScript==
// @name         Defancied Discord
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes Discord's premium custom fonts, nameplates, multicolor gradients, and hover glow effects.
// @author       moozooh
// @match        https://discord.com/*
// @match        https://*.discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555794/Defancied%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/555794/Defancied%20Discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to override premium fonts and remove glow effects
    const style = document.createElement('style');
    style.textContent = `
        /* Force default Discord font everywhere */
        * {
            font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
        }

        /* Remove all gradients and glow effects */
        [class*="convenienceGlowGradient"],
        [class*="usernameGradient"],
        [class*="twoColorGradient"] {
            background: none !important;
            -webkit-text-fill-color: unset !important;
            filter: none !important;
            /* Use the text-decoration-color as the actual text color */
            color: var(--custom-gradient-color-1, currentColor) !important;
        }

        /* Remove premium nameplate backgrounds from member list */
        [class*="nameplated"] .container__4bbc6,
        [class*="nameplated"] [class*="container"][style*="background: linear-gradient"] {
            display: none !important;
        }
    `;

    // Insert the style as early as possible
    if (document.head) {
        document.head.appendChild(style);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.head) {
                document.head.appendChild(style);
                obs.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Additional check to reapply styles if needed
    window.addEventListener('load', () => {
        if (!document.head.contains(style)) {
            document.head.appendChild(style);
        }
    });
})();
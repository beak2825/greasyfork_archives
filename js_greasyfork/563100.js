// ==UserScript==
// @name         HAGS - Survev ESP & Aimbot
// @namespace    https://github.com/HAGS-ESP
// @version      4.3.1
// @description  ESP + Aimbot userscript for Survev.io
// @author       HAGS
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563100/HAGS%20-%20Survev%20ESP%20%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/563100/HAGS%20-%20Survev%20ESP%20%20Aimbot.meta.js
// ==/UserScript==

// @grant        none
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/HAGS-ESP/Survev-Cheat-HAGS/refs/heads/main/survev-cheat.js
// @updateURL    https://raw.githubusercontent.com/HAGS-ESP/Survev-Cheat-HAGS/refs/heads/main/survev-cheat.js
// ==/UserScript==

(function() {
    'use strict';
    const scriptURL = 'https://raw.githubusercontent.com/HAGS-ESP/Survev-Cheat-HAGS/refs/heads/main/survev-cheat.js';
    fetch(scriptURL)
        .then(response => response.text())
        .then(code => {
            const script = document.createElement('script');
            script.textContent = code;
            document.head.appendChild(script);
            console.log('[HAGS] Script loaded successfully!');
        })
        .catch(error => {
            console.error('[HAGS] Failed to load script:', error);
        });
})();

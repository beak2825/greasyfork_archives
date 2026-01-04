// ==UserScript==
// @name         Merlin Token Extractor
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Extract Bearer token from Merlin API requests
// @match        https://merlin.unison.org.uk/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553598/Merlin%20Token%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/553598/Merlin%20Token%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findTokenInStorage() {
        for (const key in localStorage) {
            const val = localStorage.getItem(key);
            if (val && val.includes("eyJ0eXA") && val.includes(".")) {
                return val.match(/eyJ[^'"\s]+/)[0];  // Rough match for token start
            }
        }
        return null;
    }

    function decodeJwtPayload(token) {
        try {
            const payload = token.split('.')[1];
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decoded);
        } catch (e) {
            return null;
        }
    }

    const token = findTokenInStorage();

    setTimeout(() => {
        const btn = document.createElement('button');
        btn.innerText = 'Show Merlin Token';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = 9999;
        btn.style.padding = '10px';
        btn.style.backgroundColor = '#28a745';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.onclick = () => {
            if (token) {
                GM_setClipboard(token);
                const decoded = decodeJwtPayload(token);
                alert("✅ Bearer token copied to clipboard!\n\n" + token + (decoded ? `\n\nExpires: ${new Date(decoded.exp * 1000).toLocaleString()}` : ""));
            } else {
                alert("❌ No token found in localStorage.");
            }
        };
        document.body.appendChild(btn);
    }, 2000);
})();
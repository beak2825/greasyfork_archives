// ==UserScript==
// @name         CyberChef Base64 Smart Redirect
// @namespace    https://github.com/
// @version      1.0.0
// @description  Instantly redirects from any CyberChef page if the URL input contains a Base64-encoded link.
// @author       
// @match        https://gchq.github.io/CyberChef/*
// @license      Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552299/CyberChef%20Base64%20Smart%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/552299/CyberChef%20Base64%20Smart%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isValidUrl(s) {
        try { new URL(s); return true; }
        catch (e) { return false; }
    }

    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const input = params.get('input');

    if (input) {
        try {
            let decoded = atob(input);

            while (true) {
                try {
                    let nextDecode = atob(decoded);
                    if (isValidUrl(nextDecode)) {
                        decoded = nextDecode;
                        break;
                    }
                    decoded = nextDecode;
                } catch (e) {
                    break;
                }
            }
            
            if (isValidUrl(decoded)) {
                window.location.href = decoded;
            }
        } catch (e) {
        }
    }
})();
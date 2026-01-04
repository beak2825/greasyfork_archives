// ==UserScript==
// @name         TipsGuru Safe Bypass (No Error)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Waits 6 seconds to set cookies, then redirects to avoid "Unauthorized Access".
// @author       Chat G
// @match        *://tipsguru.in/prolink.php*
// @match        *://*.tipsguru.in/prolink.php*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560792/TipsGuru%20Safe%20Bypass%20%28No%20Error%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560792/TipsGuru%20Safe%20Bypass%20%28No%20Error%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Screen par user ko dikhane ke liye message
    let overlay = document.createElement('div');
    overlay.innerHTML = '<h2 style="background:red;color:white;padding:10px;text-align:center;position:fixed;top:0;left:0;width:100%;z-index:9999;">Bypassing... Please Wait 6 Seconds (Fixing Unauthorized Error)</h2>';
    document.body.appendChild(overlay);

    // 6 Second ka wait taaki "Unauthorized" error na aaye
    setTimeout(function() {
        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');

        if (id) {
            try {
                let finalUrl = atob(decodeURIComponent(id));
                if(finalUrl && finalUrl.includes('http')) {
                    // Message update
                    overlay.innerHTML = '<h2 style="background:green;color:white;padding:10px;text-align:center;position:fixed;top:0;left:0;width:100%;z-index:9999;">Redirecting Now...</h2>';
                    // Safe Redirect
                    window.location.href = finalUrl;
                }
            } catch(e) {
                console.log("Error:", e);
            }
        }
    }, 6000); // 6000ms = 6 Seconds wait
})();


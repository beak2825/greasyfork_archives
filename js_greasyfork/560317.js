// ==UserScript==
// @name         Universal URL Logger (To Localhost)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sends visited URLs to a local Node.js server
// @author       You
// @match        *://*/*
// @grant        window.onurlchange
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      192.168.0.253
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560317/Universal%20URL%20Logger%20%28To%20Localhost%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560317/Universal%20URL%20Logger%20%28To%20Localhost%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_SERVER = "http://192.168.0.253:13371";

    function sendUrlToServer() {
        const currentUrl = window.location.href;
        
        // Use GM_xmlhttpRequest to bypass Mixed Content/CORS restrictions
        GM_xmlhttpRequest({
            method: "POST",
            url: TARGET_SERVER,
            data: currentUrl,
            headers: {
                "Content-Type": "text/plain"
            },
            onload: function(response) {
                // Optional: distinct console log to verify it worked
                // console.log("URL sent to server successfully.");
            },
            onerror: function(err) {
                console.error("Failed to connect to local log server:", err);
            }
        });
    }

    // 1. Send immediately on page load
    sendUrlToServer();

    // 2. Send on dynamic (SPA) URL changes
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', (info) => {
            sendUrlToServer();
        });
    }

})();
// ==UserScript==
// @name         Gartic.io Token Fetcher (Optimized) 2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fetch tokens from turnstile and send to server with auto-refresh
// @author       You
// @match        *://gartic.io/*
// @match        *://*.gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560251/Garticio%20Token%20Fetcher%20%28Optimized%29%202.user.js
// @updateURL https://update.greasyfork.org/scripts/560251/Garticio%20Token%20Fetcher%20%28Optimized%29%202.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOKEN_INTERVAL = 5000; // كل 4 ثواني تقريبًا
    const PAGE_REFRESH_INTERVAL = 2 * 60 * 1000;
    function createTurnstileFrame() {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.sandbox = "allow-scripts allow-same-origin";
        document.body.appendChild(iframe);

        const html = `
            <!DOCTYPE html>
            <html>
            <head><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script></head>
            <body>
                <div id="cf-turnstile"></div>
                <script>
                    window.onload = function() {
                        turnstile.render("#cf-turnstile", {
                            sitekey: "0x4AAAAAABBPKaIbNwnPEfSo",
                            callback: function(token) {
                                parent.postMessage(token, "*");
                            }
                        });
                    }
                </script>
            </body>
            </html>
        `;

        iframe.srcdoc = html;
    }

    window.addEventListener("message", function (event) {
        const token = event.data;
        if (typeof token === "string" && token.length > 20) {
            console.log("Token received:", token);

            fetch("https://mesho.alwaysdata.net/add-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: token })
            })
            .then(res => res.json())
            .then(data => console.log("Server Response:", data))
            .catch(err => console.error("Error sending token:", err));
        }

        // Remove all iframes after usage
        document.querySelectorAll("iframe").forEach(iframe => iframe.remove());
    });

    setInterval(createTurnstileFrame, TOKEN_INTERVAL);
    createTurnstileFrame();

      setTimeout(() => {
        console.log("Refreshing page to prevent freeze...");
        location.reload();
    }, PAGE_REFRESH_INTERVAL);

})();
// ==UserScript==
// @name        ( prievt CRYSTAL『X』 with S A I F ,)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fetch tokens from Turnstile and send to server with auto-retry and refresh
// @author       You
// @match        *://gartic.io/*
// @match        *://*.gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554007/%28%20prievt%20CRYSTAL%E3%80%8EX%E3%80%8F%20with%20S%20A%20I%20F%20%2C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554007/%28%20prievt%20CRYSTAL%E3%80%8EX%E3%80%8F%20with%20S%20A%20I%20F%20%2C%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOKEN_INTERVAL = 3500; // كل 1 ثانية
    const PAGE_REFRESH_INTERVAL = 3 * 60 * 1000; // كل 3 دقائق

    function createTurnstileFrame() {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.sandbox = "allow-scripts allow-same-origin";
        document.body.appendChild(iframe);

        const html = `<html>
            <head>
                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
            </head>
            <body>
                <div id="cf-turnstile"></div>
                <script>
                    window.onload = function() {
                        let tries = 0;
                        function render() {
                            try {
                                turnstile.render("#cf-turnstile", {
                                    sitekey: "0x4AAAAAABBPKaIbNwnPEfSo",
                                    callback: function(token) {
                                        parent.postMessage(token, "*");
                                    }
                                });
                            } catch (e) {
                                if (tries < 2) {
                                    tries++;
                                    setTimeout(render, 500);
                                }
                            }
                        }
                        render();
                    };
                </script>
            </body>
        </html>`;

        iframe.srcdoc = html;
    }

    window.addEventListener("message", function (event) {
        const token = event.data;
        if (typeof token === "string" && token.length > 20) {
            console.log("✅ Token received:", token);
            fetch("https://pocer.alwaysdata.net/add-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: token })
            })
            .then(res => res.json())
            .then(data => console.log("📦 Server Response:", data))
            .catch(err => console.error("❌ Error sending token:", err));
        }
        // إزالة الإطارات بعد كل محاولة
        document.querySelectorAll("iframe").forEach(i => i.remove());
    });

    // بدء التوليد الدوري
    setInterval(createTurnstileFrame, TOKEN_INTERVAL);
    createTurnstileFrame();

    // تحديث الصفحة كل فترة لمنع التعليق
    setTimeout(() => {
        console.log("🔄 Refreshing page...");
        location.reload();
    }, PAGE_REFRESH_INTERVAL);
})();
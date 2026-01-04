// ==UserScript==
// @name         User-Agent Switcher with Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chọn và lưu User-Agent cố định bằng nút bấm
// @author       Bạn
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548631/User-Agent%20Switcher%20with%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/548631/User-Agent%20Switcher%20with%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) Firefox/118.0",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/604.1",
        "Mozilla/5.0 (Android 13; Mobile; rv:117.0) Gecko/117.0 Firefox/117.0"
    ];

    // Load UA đã lưu (nếu có)
    let savedUA = localStorage.getItem("customUA");

    // Nếu chưa có thì random và lưu
    if (!savedUA) {
        savedUA = userAgents[Math.floor(Math.random() * userAgents.length)];
        localStorage.setItem("customUA", savedUA);
    }

    // Override UA
    Object.defineProperty(navigator, "userAgent", {
        get: () => savedUA,
        configurable: true
    });

    // Tạo nút Change UA
    window.addEventListener("load", () => {
        const btn = document.createElement("button");
        btn.textContent = "???? Change User-Agent";
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.zIndex = "9999";
        btn.style.padding = "10px 15px";
        btn.style.background = "#007bff";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "8px";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

        btn.onclick = () => {
            const newUA = userAgents[Math.floor(Math.random() * userAgents.length)];
            localStorage.setItem("customUA", newUA);
            alert("User-Agent mới đã được set!\n" + newUA + "\n\nReload trang để áp dụng.");
        };

        document.body.appendChild(btn);
    });
})();

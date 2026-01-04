// ==UserScript==
// @name         Titan Product Image Downloader
// @namespace    https://greasyfork.org/users/your-profile
// @version      1.1
// @description  Adds a compact button on Titan product pages to download all high-resolution product images, named by SKU (W0102PM01_1.jpg). Clean, fast, and accurate targeting.
// @author       YOU
// @license      MIT
// @match        https://www.titan.co.in/product/*
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560074/Titan%20Product%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560074/Titan%20Product%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------- SKU Extraction ----------------
    function getProductCode() {
        const path = location.pathname;
        const m = path.match(/-([A-Za-z0-9]+)\.html$/);
        return m && m[1] ? m[1].toUpperCase() : null;
    }

    // ---------------- Image Collector ----------------
    function collectProductImages() {
        const sku = getProductCode();
        const urls = new Set();

        document.querySelectorAll('img').forEach(img => {
            let url = img.src || img.getAttribute('data-src') || '';

            if (!url) return;

            // Handle srcset -> largest image
            if (url.includes(',')) {
                const parts = url.split(',');
                url = parts[parts.length - 1].trim().split(' ')[0];
            }

            if (!url.includes('/dw/image/')) return;

            const clean = url.split('#')[0];
            const base = clean.split('?')[0];
            const filename = base.split('/').pop().toUpperCase();

            if (sku && !filename.includes(sku)) return;

            urls.add(url);
        });

        return [...urls];
    }

    // ---------------- Download Logic ----------------
    function downloadAllImages() {
        const urls = collectProductImages();
        const sku = getProductCode() || 'SKU';

        if (!urls.length) {
            alert("No product images found.");
            return;
        }

        urls.forEach((url, index) => {
            const base = url.split('?')[0];
            const extMatch = base.match(/\.([a-zA-Z0-9]+)$/);
            const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';

            const filename = `${sku}_${index + 1}.${ext}`;

            GM_download({
                url: url,
                name: filename,
                saveAs: false
            });
        });
    }

    // ---------------- Button Injection ----------------
    function injectButton() {
        if (document.getElementById("titan-download-btn")) return;

        const btn = document.createElement("button");
        btn.id = "titan-download-btn";
        btn.textContent = "Download Product Images";

        // --- Compact black pill-style button ---
        btn.style.position = "fixed";
        btn.style.top = "90px";
        btn.style.right = "20px";
        btn.style.zIndex = "9999";

        btn.style.background = "#000";
        btn.style.color = "#fff";
        btn.style.fontSize = "12px";
        btn.style.fontWeight = "500";

        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.padding = "6px 12px";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)";

        btn.addEventListener("click", downloadAllImages);

        document.body.appendChild(btn);
    }

    // ---------------- Init ----------------
    const ready = setInterval(() => {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            injectButton();
            clearInterval(ready);
        }
    }, 400);

    new MutationObserver(injectButton)
        .observe(document.documentElement, { childList: true, subtree: true });

})();

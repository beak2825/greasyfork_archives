// ==UserScript==
// @name         Comikey Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Download images from comikey.com to a subfolder. Captures 0.webp, converts to PNG, and saves individually.
// @author       ozler365
// @license      MIT
// @match        https://comikey.com/read/*
// @icon         https://comikey.com/static/images/favicons/favicon.b6e9a28323d2.png
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/562935/Comikey%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562935/Comikey%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    const CAPTURE_REGEX = /\/0\.webp([?#]|$)/i;

    // State
    const capturedUrls = new Set();
    const orderedUrls = [];

    // --- UI Construction ---
    const ui = document.createElement('div');
    ui.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #222; color: #fff; padding: 15px; border-radius: 8px; z-index: 10000; font-family: sans-serif; border: 1px solid #444; box-shadow: 0 4px 6px rgba(0,0,0,0.3); min-width: 240px;';
    ui.innerHTML = `
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #4CAF50;">Comikey Downloader</h3>
        <div id="cmd-status" style="margin-bottom: 10px; font-size: 13px;">Waiting for images...<br><span style="color:#aaa; font-size:11px;">(Scroll down to capture)</span></div>
        <div id="cmd-count" style="margin-bottom: 10px; font-size: 12px; color: #fff;">Captured: 0</div>
        <button id="cmd-btn" disabled style="width: 100%; padding: 8px; background: #555; color: #999; border: none; border-radius: 4px; cursor: not-allowed; font-weight: bold;">Download All</button>
    `;
    document.body.appendChild(ui);

    const statusEl = document.getElementById('cmd-status');
    const countEl = document.getElementById('cmd-count');
    const btn = document.getElementById('cmd-btn');

    // --- Helper: Convert Blob to PNG Blob with Timeout ---
    function blobToPng(blob) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Conversion timeout")), 5000); // 5s timeout

            const img = new Image();
            const url = URL.createObjectURL(blob);
            img.onload = () => {
                clearTimeout(timeout);
                URL.revokeObjectURL(url);
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((pngBlob) => {
                        if (pngBlob) resolve(pngBlob);
                        else reject(new Error("Canvas export failed"));
                    }, 'image/png');
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = () => {
                clearTimeout(timeout);
                URL.revokeObjectURL(url);
                reject(new Error("Image load failed"));
            };
            img.src = url;
        });
    }

    // --- Monitor Network Activity ---
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (CAPTURE_REGEX.test(entry.name)) {
                if (!capturedUrls.has(entry.name)) {
                    capturedUrls.add(entry.name);
                    orderedUrls.push(entry.name);
                    updateUI();
                }
            }
        });
    });
    observer.observe({ entryTypes: ["resource"] });

    function updateUI() {
        const count = orderedUrls.length;
        countEl.innerText = `Captured: ${count}`;
        if (count > 0) {
            btn.disabled = false;
            btn.style.background = "#e91e63";
            btn.style.color = "#fff";
            btn.style.cursor = "pointer";
            statusEl.innerText = "Ready. Keep scrolling or download.";
        }
    }

    // --- Processing Logic ---
    async function processQueue(folderName) {
        btn.disabled = true;

        for (let i = 0; i < orderedUrls.length; i++) {
            const url = orderedUrls[i];
            const pageNum = String(i + 1).padStart(3, '0');
            statusEl.innerText = `Processing ${i + 1}/${orderedUrls.length}...`;

            try {
                // 1. Fetch original data
                const response = await fetch(url);
                const originalBlob = await response.blob();
                
                let finalBlob = originalBlob;
                let extension = "webp";

                // 2. Try converting to PNG
                try {
                    finalBlob = await blobToPng(originalBlob);
                    extension = "png";
                } catch (convErr) {
                    console.warn(`Conversion failed for page ${i+1}, falling back to WebP.`, convErr);
                    // Fallback: Use original WebP blob if conversion fails/times out
                    extension = "webp"; 
                }

                // 3. Construct File URL and Path
                const finalUrl = URL.createObjectURL(finalBlob);
                const fileName = `${folderName}/page_${pageNum}.${extension}`;

                // 4. Download via GM_download
                await new Promise((resolve, reject) => {
                    GM_download({
                        url: finalUrl,
                        name: fileName,
                        saveAs: false, // Don't ask user for location
                        onload: () => {
                            URL.revokeObjectURL(finalUrl);
                            resolve();
                        },
                        onerror: (err) => {
                            URL.revokeObjectURL(finalUrl);
                            console.error("GM_download error", err);
                            // Resolve anyway to continue to next image
                            resolve(); 
                        }
                    });
                });

                // Small delay to keep browser responsive
                await new Promise(r => setTimeout(r, 200));

            } catch (err) {
                console.error(`Failed to download page ${i+1}`, err);
            }
        }

        statusEl.innerText = "Done!";
        btn.innerText = "Download Complete";
        btn.disabled = false;
    }

    // --- Click Handler ---
    btn.onclick = () => {
        // Sanitize title for folder name
        const title = document.title.replace(/[<>:"/\\|?*]+/g, " ").trim() || "Comikey_Download";
        processQueue(title);
    };

})();

// ==UserScript==
// @name         Omoi/Azuki Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Download images from omoi.com/azuki.co. Intercepts v1 API, converts WebP to PNG, and flattens zip.
// @author       ozler365
// @license      MIT
// @match        https://www.omoi.com/series/*/read/*
// @match        https://www.azuki.co/series/*/read/*
// @icon         https://www.omoi.com/assets/images/favicon/apple-touch-icon.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562914/OmoiAzuki%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562914/OmoiAzuki%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let chapterData = {
        pages: [], // Stores the ordered list of UUIDs from v1
        baseUrl: null // Stores the base URL pattern derived from seeing a 1200.webp request
    };

    // --- UI Elements ---
    const ui = document.createElement('div');
    ui.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #222; color: #fff; padding: 15px; border-radius: 8px; z-index: 9999; font-family: sans-serif; border: 1px solid #444; box-shadow: 0 4px 6px rgba(0,0,0,0.3); min-width: 200px;';
    ui.innerHTML = `
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ff6b6b;">Chapter Downloader</h3>
        <div id="omoi-status" style="margin-bottom: 10px; font-size: 13px;">Waiting for v1 data...<br>(Please refresh if stuck)</div>
        <div id="omoi-progress" style="margin-bottom: 10px; font-size: 12px; color: #aaa;">Pages Scanned: 0 / ?</div>
        <button id="omoi-btn" disabled style="width: 100%; padding: 8px; background: #444; color: #888; border: none; border-radius: 4px; cursor: not-allowed; font-weight: bold;">Scroll to End</button>
    `;
    document.body.appendChild(ui);

    const statusEl = document.getElementById('omoi-status');
    const progressEl = document.getElementById('omoi-progress');
    const btn = document.getElementById('omoi-btn');

    // --- Helper: Convert WebP Blob to PNG Blob ---
    function blobToPng(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(blob);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((pngBlob) => {
                    if (pngBlob) resolve(pngBlob);
                    else reject(new Error("Canvas toBlob failed"));
                }, 'image/png');
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Image load failed"));
            };
            img.src = url;
        });
    }

    // --- 1. Intercept Fetch to get v1 Data (Order) ---
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const fetchUrl = args[0] instanceof Request ? args[0].url : args[0];
        const response = await originalFetch.apply(this, args);

        if (fetchUrl.includes('/v1') && !fetchUrl.includes('.js')) {
            const clone = response.clone();
            clone.json().then(json => {
                if (json && json.data && json.data.pages) {
                    console.log("[Downloader] Captured v1 Data:", json.data.pages);
                    chapterData.pages = json.data.pages;
                    updateUI();
                }
            }).catch(e => console.error("Error parsing v1 JSON", e));
        }
        return response;
    };

    // --- 2. Monitor Performance Entries to Find Base URL ---
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.name.includes('1200.webp')) {
                const match = entry.name.match(/(https?:\/\/[^/]+\/)([a-f0-9-]{36})\/1200\.webp/);
                if (match && !chapterData.baseUrl) {
                    chapterData.baseUrl = entry.name.replace(match[2], '{uuid}');
                    console.log("[Downloader] URL Template detected:", chapterData.baseUrl);
                    updateUI();
                }
            }
        });
    });
    observer.observe({ entryTypes: ["resource"] });

    // --- 3. UI Logic ---
    function updateUI() {
        const totalPages = chapterData.pages.length;
        const resources = performance.getEntriesByType("resource").map(e => e.name);
        let loadedCount = 0;

        if (chapterData.pages.length > 0) {
            loadedCount = chapterData.pages.filter(p => 
                resources.some(url => url.includes(p.uuid))
            ).length;
        }

        if (totalPages === 0) {
            statusEl.innerText = "Waiting for v1 data...";
            progressEl.innerText = "Pages Scanned: 0 / ?";
        } else {
            progressEl.innerText = `Pages Scanned: ${loadedCount} / ${totalPages}`;
            
            if (loadedCount < totalPages || !chapterData.baseUrl) {
                statusEl.innerText = "Please scroll to the end.";
                statusEl.style.color = "#ffeb3b"; 
                btn.innerText = "Scroll to End";
                btn.disabled = true;
                btn.style.background = "#444";
                btn.style.color = "#888";
                btn.style.cursor = "not-allowed";
            } else {
                statusEl.innerText = "Ready to download!";
                statusEl.style.color = "#4caf50"; 
                btn.innerText = "Download Chapter";
                btn.disabled = false;
                btn.style.background = "#e91e63"; 
                btn.style.color = "#fff";
                btn.style.cursor = "pointer";
            }
        }
    }
    setInterval(updateUI, 1000);

    // --- 4. Download Logic ---
    btn.onclick = async () => {
        if (!chapterData.pages.length || !chapterData.baseUrl) return;

        btn.innerText = "Processing...";
        btn.disabled = true;

        const zip = new JSZip();
        // Removed zip.folder("chapter") to flatten the structure
        
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < chapterData.pages.length; i++) {
            const page = chapterData.pages[i];
            const uuid = page.uuid;
            const url = chapterData.baseUrl.replace('{uuid}', uuid);
            // Changed extension to .png
            const filename = `${String(i + 1).padStart(3, '0')}.png`;

            statusEl.innerText = `Converting ${i + 1}/${chapterData.pages.length}...`;

            try {
                const resp = await fetch(url);
                if (!resp.ok) throw new Error("Network error");
                const webpBlob = await resp.blob();
                
                // Convert WebP to PNG
                const pngBlob = await blobToPng(webpBlob);
                
                // Add directly to root of zip
                zip.file(filename, pngBlob);
                successCount++;
            } catch (err) {
                console.error(`Failed to load page ${i+1}:`, err);
                zip.file(filename + ".error.txt", "Failed to download/convert");
                failCount++;
            }
        }

        statusEl.innerText = "Zipping...";
        const content = await zip.generateAsync({ type: "blob" });
        
        const safeTitle = document.title.replace(/[<>:"/\\|?*]+/g, " ").trim();
        saveAs(content, `${safeTitle}.zip`);

        statusEl.innerText = "Done!";
        btn.innerText = "Download Again";
        btn.disabled = false;
        
        if (failCount > 0) {
            alert(`Download complete with ${failCount} errors.`);
        }
    };

})();

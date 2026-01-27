// ==UserScript==
// @name         MangaMirai Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Captures rendered manga pages from canvas elements on mangamirai.com and saves them to a named folder.
// @author       ozler365
// @match        https://mangamirai.com/*
// @icon         https://pbs.twimg.com/profile_images/1896093828861612032/HYJOz-c3_400x400.png
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/563065/MangaMirai%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/563065/MangaMirai%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        selector: 'canvas',
        imageType: 'image/png',
        filenamePrefix: 'Mangamirai_Page_',
        autoDownload: false
    };

    // --- UI Styles ---
    GM_addStyle(`
        #mm-capture-panel {
            position: fixed; bottom: 20px; right: 20px; z-index: 99999;
            background: #222; color: #fff; padding: 12px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-family: sans-serif;
            border: 1px solid #444; width: 220px;
        }
        #mm-capture-panel h3 { margin: 0 0 10px 0; font-size: 14px; color: #00d2ff; }
        .mm-btn {
            display: block; width: 100%; padding: 8px; margin-bottom: 5px;
            background: #444; color: white; border: none; border-radius: 4px;
            cursor: pointer; text-align: center; font-size: 12px; transition: 0.2s;
        }
        .mm-btn:hover { background: #666; }
        .mm-btn.primary { background: #007bff; }
        .mm-btn.primary:hover { background: #0056b3; }
        .mm-count { font-size: 11px; color: #aaa; margin-top: 5px; text-align: center; }
        canvas.mm-captured { border: 2px solid #00d2ff !important; }
    `);

    // --- State ---
    let capturedCanvases = new Set();
    let pageCounter = 1;

    // --- UI Construction ---
    const panel = document.createElement('div');
    panel.id = 'mm-capture-panel';
    panel.innerHTML = `
        <h3>DOM Capture</h3>
        <button id="btn-download-visible" class="mm-btn primary">Download Visible</button>
        <button id="btn-reset" class="mm-btn">Reset Counter</button>
        <div class="mm-count">Detected: <span id="mm-detect-count">0</span></div>
    `;
    document.body.appendChild(panel);

    const countDisplay = document.getElementById('mm-detect-count');

    // --- Core Logic ---

    function getSafeFolderName() {
        // Get title, replace illegal chars (\ / : * ? " < > |) with underscores, and trim
        return document.title.replace(/[\\/:*?"<>|]/g, '_').trim();
    }

    function getFilename(canvasElement, index) {
        let name = CONFIG.filenamePrefix + String(index).padStart(3, '0') + '.png';

        const container = canvasElement.closest('div[id*="page"], div[class*="page"]');
        if (container) {
             const match = container.innerText.match(/(\d+)/);
             if (match) {
                 name = CONFIG.filenamePrefix + match[1].padStart(3, '0') + '.png';
             }
        }
        return name;
    }

    function processCanvas(canvas) {
        if (capturedCanvases.has(canvas) || canvas.width < 50 || canvas.height < 50) return;

        canvas.classList.add('mm-captured');
        capturedCanvases.add(canvas);
        updateCount();

        if (CONFIG.autoDownload) {
            downloadCanvas(canvas);
        }
    }

    function downloadCanvas(canvas) {
        const filename = getFilename(canvas, pageCounter++);
        const folderName = getSafeFolderName();
        const fullPath = folderName + '/' + filename;

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error("Canvas empty:", filename);
                return;
            }
            const url = URL.createObjectURL(blob);

            // Use GM_download to support subfolders
            GM_download({
                url: url,
                name: fullPath,
                saveAs: false,
                onload: () => {
                    URL.revokeObjectURL(url); // Cleanup memory after download
                },
                onerror: (err) => {
                    console.error("Download Error:", err);
                    URL.revokeObjectURL(url);
                }
            });

        }, CONFIG.imageType);
    }

    function scanDOM() {
        const canvases = document.querySelectorAll(CONFIG.selector);
        canvases.forEach(processCanvas);
    }

    function updateCount() {
        countDisplay.textContent = capturedCanvases.size;
    }

    // --- Interaction ---
    document.getElementById('btn-download-visible').addEventListener('click', () => {
        if (capturedCanvases.size === 0) {
            alert("No canvases detected yet. Scroll down to load images.");
            return;
        }
        if (confirm('Download ' + capturedCanvases.size + ' images to folder "' + getSafeFolderName() + '"?')) {
            let delay = 0;
            capturedCanvases.forEach((canvas) => {
                setTimeout(() => downloadCanvas(canvas), delay);
                delay += 250; // Increased slightly to ensure file system handles folder creation
            });
        }
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        capturedCanvases.clear();
        document.querySelectorAll('canvas.mm-captured').forEach(c => c.classList.remove('mm-captured'));
        pageCounter = 1;
        updateCount();
    });

    // --- Observer ---
    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) shouldScan = true;
        }
        if (shouldScan) scanDOM();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(scanDOM, 1000);
    setTimeout(scanDOM, 3000);

})();

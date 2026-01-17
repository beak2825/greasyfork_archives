// ==UserScript==
// @name         Lezhin Comics Downloader (English & Korean)
// @namespace    lezhin-comics-scraper
// @version      3.6.1
// @description  Universal support. Forces all downloads (US Canvas & KO WebP) to 100% Lossless PNG format.
// @author       ozler365
// @match        *://www.lezhinus.com/*
// @match        *://www.lezhin.com/*
// @match        *://lezhin.com/*
// @icon         https://ccdn.lezhin.com/files/assets/img/favicon.ico
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563063/Lezhin%20Comics%20Downloader%20%28English%20%20Korean%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563063/Lezhin%20Comics%20Downloader%20%28English%20%20Korean%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STATE ---
    const CAPTURED_PAGES = new Map();
    
    const STATE = {
        isCapturing: false,
        scanInterval: null
    };

    // --- 1. CANVAS INTERCEPTOR (US Site) ---
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

    CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
        originalDrawImage.apply(this, [image, ...args]);

        if (!STATE.isCapturing) return;

        try {
            if (this.canvas.width < 300 || this.canvas.height < 300) return;
            
            const src = image.src;
            if (!src || src.startsWith("data:") || src.length < 20) return;
            if (src.includes("thumbnail") || src.includes("avatar") || src.includes("banner") || src.includes("logo")) return;

            if (!CAPTURED_PAGES.has(src)) {
                CAPTURED_PAGES.set(src, {
                    type: 'canvas',
                    url: src,
                    width: this.canvas.width,
                    height: this.canvas.height,
                    instructions: [],
                    lastY: 0
                });
            }

            const entry = CAPTURED_PAGES.get(src);
            
            if (this.canvas.isConnected) {
                const rect = this.canvas.getBoundingClientRect();
                const absoluteY = rect.top + window.scrollY;
                if (absoluteY > 0) entry.lastY = absoluteY;
            }

            let p = {};
            if (args.length === 2) p = { sx: 0, sy: 0, sw: image.width, sh: image.height, dx: args[0], dy: args[1], dw: image.width, dh: image.height };
            else if (args.length === 4) p = { sx: 0, sy: 0, sw: image.width, sh: image.height, dx: args[0], dy: args[1], dw: args[2], dh: args[3] };
            else if (args.length === 8) p = { sx: args[0], sy: args[1], sw: args[2], sh: args[3], dx: args[4], dy: args[5], dw: args[6], dh: args[7] };
            
            entry.instructions.push(p);
            updateUI();

        } catch (e) {}
    };

    // --- 2. DOM SCANNER (KO Site) ---
    function scanForImages() {
        if (!STATE.isCapturing) return;
        const images = document.images;

        for (let img of images) {
            try {
                if (img.naturalWidth < 300 || img.naturalHeight < 300) continue;
                
                const src = img.src;
                if (!src || src.startsWith("data:")) continue;
                if (src.includes("thumbnail") || src.includes("avatar") || src.includes("banner") || src.includes("logo")) continue;

                if (!CAPTURED_PAGES.has(src)) {
                    const rect = img.getBoundingClientRect();
                    const absoluteY = rect.top + window.scrollY;

                    CAPTURED_PAGES.set(src, {
                        type: 'image',
                        url: src,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        lastY: absoluteY
                    });
                    
                    updateUI();
                } else {
                    const entry = CAPTURED_PAGES.get(src);
                    const rect = img.getBoundingClientRect();
                    const absoluteY = rect.top + window.scrollY;
                    if (absoluteY > 0) entry.lastY = absoluteY;
                }
            } catch (e) {}
        }
    }

    // --- 3. PROCESSING ---
    function fetchBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, responseType: "blob", headers: { "Referer": window.location.href },
                onload: (res) => (res.status === 200 ? resolve(res.response) : reject(new Error(res.status))),
                onerror: reject
            });
        });
    }

    function loadImage(blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => resolve({ img, url });
            img.onerror = () => reject(new Error("Img Load Fail"));
            img.src = url;
        });
    }

    async function processPage(pageEntry) {
        // Shared Logic: Fetch -> Draw to Canvas -> Export PNG
        // This ensures both Scrambled US images and WebP KO images end up as clean PNGs.
        
        const blob = await fetchBlob(pageEntry.url);
        const { img, url } = await loadImage(blob);

        const canvas = document.createElement("canvas");
        canvas.width = pageEntry.width;
        canvas.height = pageEntry.height;
        const ctx = canvas.getContext("2d");

        if (pageEntry.type === 'image') {
            // KO Site: Just draw the whole image (No unscrambling needed)
            ctx.drawImage(img, 0, 0);
        } 
        else if (pageEntry.type === 'canvas') {
            // US Site: Replay unscrambling instructions
            for (let op of pageEntry.instructions) {
                ctx.drawImage(img, op.sx, op.sy, op.sw, op.sh, op.dx, op.dy, op.dw, op.dh);
            }
        }

        // Force PNG conversion (Lossless)
        const resBlob = await new Promise(r => canvas.toBlob(r, "image/png"));
        
        URL.revokeObjectURL(url);
        canvas.width = 0;
        return resBlob;
    }

    // --- 4. DOWNLOADER ---
    async function startDownload() {
        const btn = document.getElementById("LezhinDLBtn");
        const status = document.getElementById("LezhinStatus");
        
        if (CAPTURED_PAGES.size === 0) {
            alert("No images captured.\nPlease click 'Start Capture' and scroll down.");
            return;
        }

        stopCapture();
        btn.disabled = true;
        
        const folderName = document.title.replace(/[\\/:*?"<>|]/g, "_").trim();
        const pages = Array.from(CAPTURED_PAGES.values()).sort((a, b) => a.lastY - b.lastY);
        
        let success = 0;
        
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const num = i + 1;
            const indexStr = num.toString().padStart(3, '0');
            
            status.innerHTML = `Saving ${num} / ${pages.length}...`;
            
            try {
                const blob = await processPage(page);
                const blobUrl = URL.createObjectURL(blob);
                
                // Always PNG now
                const filename = `${folderName}/${indexStr}.png`;
                
                GM_download({
                    url: blobUrl,
                    name: filename,
                    saveAs: false,
                    onload: () => { URL.revokeObjectURL(blobUrl); },
                    onerror: (err) => { console.error("Download Error", err); }
                });

                success++;
                await new Promise(r => setTimeout(r, 200));

            } catch (e) {
                console.error(`Failed page ${num}`, e);
            }
        }

        status.innerHTML = `✅ Sent ${success} files`;
        btn.disabled = false;
        alert(`Download Complete.\nImages saved as PNG in:\nDownloads/${folderName}`);
    }

    // --- UI ---
    function startCapture() {
        if (STATE.isCapturing) return;
        STATE.isCapturing = true;
        STATE.scanInterval = setInterval(scanForImages, 1000);
        document.getElementById("LezhinToggleBtn").innerHTML = "Stop Capture";
        document.getElementById("LezhinToggleBtn").style.background = "#f44336";
    }

    function stopCapture() {
        STATE.isCapturing = false;
        clearInterval(STATE.scanInterval);
        document.getElementById("LezhinToggleBtn").innerHTML = "Start Capture";
        document.getElementById("LezhinToggleBtn").style.background = "#4CAF50";
    }

    function toggleCapture() {
        if (STATE.isCapturing) stopCapture();
        else startCapture();
    }

    function updateUI() {
        const el = document.getElementById("LezhinStatus");
        if (el) el.innerHTML = `Captured: ${CAPTURED_PAGES.size}`;
    }

    function createUI() {
        if (document.getElementById("LezhinPanel")) return;
        
        const div = document.createElement("div");
        div.id = "LezhinPanel";
        Object.assign(div.style, {
            position: "fixed", top: "120px", left: "10px", zIndex: "9999999",
            backgroundColor: "#222", color: "white", padding: "10px",
            borderRadius: "8px", border: "1px solid #555", width: "160px",
            fontFamily: "Arial, sans-serif", fontSize: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
        });

        div.innerHTML = `
            <div style="font-weight:bold; color:#ddd; margin-bottom:5px; text-align:center;">Lezhin Pro v3.6</div>
            <div id="LezhinStatus" style="text-align:center; margin-bottom:10px; font-size:14px; font-weight:bold;">Ready</div>
            
            <button id="LezhinToggleBtn" style="
                width:100%; padding:8px; margin-bottom:5px; background:#4CAF50; 
                color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
                Start Capture
            </button>
            
            <button id="LezhinDLBtn" style="
                width:100%; padding:8px; background:#2196F3; 
                color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
                Download
            </button>
            
            <div style="margin-top:8px; color:#aaa; font-size:10px; text-align:center;">
                Supports US & KO<br>
                Format: PNG Only
            </div>
        `;

        document.body.appendChild(div);
        
        document.getElementById("LezhinToggleBtn").onclick = toggleCapture;
        document.getElementById("LezhinDLBtn").onclick = startDownload;
    }

    window.addEventListener('load', createUI);
    if (document.readyState === "complete") createUI();

})();

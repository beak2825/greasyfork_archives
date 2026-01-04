// ==UserScript==
// @name         GeoPixels - Ghost Template Overhaul
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Several Features Added to Ghost Template including template history, upload from URL, save all templates as zip file
// @author       ariapokoteng
// @match        *://geopixels.net/*
// @match        *://*.geopixels.net/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geopixels.net
// @downloadURL https://update.greasyfork.org/scripts/557015/GeoPixels%20-%20Ghost%20Template%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/557015/GeoPixels%20-%20Ghost%20Template%20Overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== CONFIGURATION ==========
    const DEBUG_MODE = true;
    const DB_NAME = 'GP_Ghost_History';
    const DB_VERSION = 2;
    const STORE_NAME = 'images';

    // Marker Colors for Encoding
    const MARKER_R = 71;
    const MARKER_G = 80;
    const MARKER_B = 88;
    const POSITION_OFFSET = 2147483648;

    let isInternalUpdate = false;

    // ========== UTILITIES ==========
    function gpLog(msg, data = null) {
        if (!DEBUG_MODE) return;
        console.log(`%c[GP Manager] ${msg}`, "color: #00ffff; background: #000; padding: 2px 4px;", data || '');
    }

    function notifyUser(title, message) {
        if (typeof window.showAlert === 'function') {
            window.showAlert(title, message);
        } else {
            console.log(`[${title}] ${message}`);
        }
    }

    // Computes a SHA-256 fingerprint of the file content
    async function computeFileHash(blob) {
        const buffer = await blob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ========== STYLES ==========
    const style = document.createElement('style');
    style.textContent = `
        .gp-modal-overlay {
            position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
            display: flex; align-items: center; justify-content: center; z-index: 10000;
        }
        .gp-modal-panel {
            background: white; border-radius: 1rem; padding: 1.5rem;
            width: 95%; max-width: 600px; max-height: 80vh;
            display: flex; flex-direction: column; gap: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .gp-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .gp-title { font-size: 1.25rem; font-weight: bold; color: #1f2937; }

        .gp-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 10px; overflow-y: auto; padding: 4px;
        }
        .gp-card {
            border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
            position: relative; transition: transform 0.1s, box-shadow 0.1s;
            cursor: pointer; background: #f9fafb;
        }
        .gp-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-color: #3b82f6; }
        .gp-card img { width: 100%; height: 100px; object-fit: cover; display: block; }
        .gp-card-footer {
            padding: 4px; font-size: 10px; text-align: center;
            background: #fff; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .gp-delete-btn {
            position: absolute; top: 2px; right: 2px;
            background: rgba(239, 68, 68, 0.9); color: white;
            border: none; border-radius: 4px; width: 20px; height: 20px;
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; cursor: pointer; z-index: 2;
        }
        .gp-delete-btn:hover { background: #dc2626; }

        .gp-btn {
            padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; border: none;
            display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .gp-btn-blue { background-color: #3b82f6; color: white; }
        .gp-btn-blue:hover { background-color: #2563eb; }
        .gp-btn-green { background-color: #10b981; color: white; }
        .gp-btn-green:hover { background-color: #059669; }
        .gp-btn-purple { background-color: #8b5cf6; color: white; }
        .gp-btn-purple:hover { background-color: #7c3aed; }
        .gp-btn-red { background-color: #ef4444; color: white; }
        .gp-btn-gray { background-color: #e5e7eb; color: #374151; }
        .gp-btn-orange { background-color: #f97316; color: white; }
        .gp-btn-orange:hover { background-color: #ea580c; }

        .hidden { display: none !important; }

        .flex { display: flex; }
        .gap-2 { gap: 0.5rem; }
        .text-xs { font-size: 0.75rem; }
    `;
    document.head.appendChild(style);

    // ========== INDEXED DB (CACHE) ==========

    const dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            const txn = e.target.transaction;

            let store;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            } else {
                store = txn.objectStore(STORE_NAME);
            }

            if (!store.indexNames.contains('hash')) {
                store.createIndex('hash', 'hash', { unique: false });
            }
        };

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject('DB Error');
    });

    const HistoryManager = {
        async add(blob, filename) {
            const db = await dbPromise;
            const hash = await computeFileHash(blob);

            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const hashIndex = store.index('hash');

                const req = hashIndex.get(hash);

                req.onsuccess = () => {
                    const existing = req.result;

                    if (existing) {
                        gpLog("Duplicate image detected. Removing old entry to update timestamp.");
                        store.delete(existing.id);
                    }

                    const item = {
                        blob: blob,
                        name: filename || `Image_${Date.now()}`,
                        date: Date.now(),
                        hash: hash
                    };
                    store.add(item);
                };

                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        },
        async getAll() {
            const db = await dbPromise;
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result.reverse());
            });
        },
        async delete(id) {
            const db = await dbPromise;
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).delete(id);
                tx.oncomplete = () => resolve();
            });
        },
        async clear() {
            const db = await dbPromise;
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).clear();
                tx.oncomplete = () => resolve();
            });
        }
    };

    // ========== IMPORT/EXPORT FUNCTIONS ==========

    async function exportToZip() {
        const images = await HistoryManager.getAll();
        if (images.length === 0) {
            notifyUser("Info", "No images to export.");
            return;
        }

        // JSZip is now available via @require
        const zip = new JSZip();
        const metadata = [];

        for (const imgData of images) {
            const filename = `${imgData.id}_${imgData.name}`;
            zip.file(filename, imgData.blob);
            metadata.push({
                id: imgData.id,
                name: imgData.name,
                date: imgData.date,
                hash: imgData.hash,
                filename: filename
            });
        }

        zip.file('metadata.json', JSON.stringify(metadata, null, 2));

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GeoPixels_History_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        notifyUser("Success", `Exported ${images.length} images to ZIP.`);
    }

    async function importFromZip(file) {
        try {
            // JSZip is now available via @require
            const zip = await JSZip.loadAsync(file);
            const metadataFile = zip.file('metadata.json');

            if (!metadataFile) {
                notifyUser("Error", "Invalid ZIP: metadata.json not found.");
                return;
            }

            const metadataText = await metadataFile.async('text');
            const metadata = JSON.parse(metadataText);

            let imported = 0;
            for (const item of metadata) {
                const imageFile = zip.file(item.filename);
                if (imageFile) {
                    const blob = await imageFile.async('blob');
                    await HistoryManager.add(blob, item.name);
                    imported++;
                }
            }

            notifyUser("Success", `Imported ${imported} images from ZIP.`);
            return true;
        } catch (e) {
            console.error(e);
            notifyUser("Error", "Failed to import ZIP file.");
            return false;
        }
    }

    // ========== ALGORITHM (ENCODE/DECODE) ==========

    function encodeRobustPosition(originalCanvas, gridX, gridY) {
        const width = originalCanvas.width;
        const height = originalCanvas.height;
        const newCanvas = document.createElement('canvas');
        newCanvas.width = width;
        newCanvas.height = height + 1;
        const ctx = newCanvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(originalCanvas, 0, 1);
        const headerImage = ctx.getImageData(0, 0, width, 1);
        const data = headerImage.data;
        const valX = (gridX + POSITION_OFFSET) >>> 0;
        const valY = (gridY + POSITION_OFFSET) >>> 0;
        const packetSize = 5;
        const maxPackets = Math.floor(width / packetSize);
        for (let i = 0; i < maxPackets; i++) {
            const base = (i * packetSize) * 4;
            data[base] = MARKER_R; data[base + 1] = MARKER_G; data[base + 2] = MARKER_B; data[base + 3] = 255;
            data[base + 4] = (valX >>> 24) & 0xFF; data[base + 5] = (valX >>> 16) & 0xFF; data[base + 6] = 0; data[base + 7] = 255;
            data[base + 8] = (valX >>> 8) & 0xFF; data[base + 9] = valX & 0xFF; data[base + 10] = 0; data[base + 11] = 255;
            data[base + 12] = (valY >>> 24) & 0xFF; data[base + 13] = (valY >>> 16) & 0xFF; data[base + 14] = 0; data[base + 15] = 255;
            data[base + 16] = (valY >>> 8) & 0xFF; data[base + 17] = valY & 0xFF; data[base + 18] = 0; data[base + 19] = 255;
        }
        ctx.putImageData(headerImage, 0, 0);
        return newCanvas;
    }

    function decodeRobustPosition(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const headerData = ctx.getImageData(0, 0, img.width, 1).data;
        const votesX = new Map();
        const votesY = new Map();
        let validPackets = 0;
        const packetSize = 5;
        const maxPackets = Math.floor(img.width / packetSize);
        for (let i = 0; i < maxPackets; i++) {
            const base = (i * packetSize) * 4;
            if (headerData[base] === MARKER_R && headerData[base + 1] === MARKER_G && headerData[base + 2] === MARKER_B && headerData[base + 3] === 255) {
                const xVal = ((headerData[base + 4] << 24) | (headerData[base + 5] << 16) | (headerData[base + 8] << 8) | headerData[base + 9]) >>> 0;
                const yVal = ((headerData[base + 12] << 24) | (headerData[base + 13] << 16) | (headerData[base + 16] << 8) | headerData[base + 17]) >>> 0;
                votesX.set(xVal, (votesX.get(xVal) || 0) + 1);
                votesY.set(yVal, (votesY.get(yVal) || 0) + 1);
                validPackets++;
            }
        }
        if (validPackets === 0) return null;
        const getWinner = (map) => [...map.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];
        const gridX = getWinner(votesX) - POSITION_OFFSET;
        const gridY = getWinner(votesY) - POSITION_OFFSET;
        const cleanCanvas = document.createElement('canvas');
        cleanCanvas.width = img.width;
        cleanCanvas.height = img.height - 1;
        const cleanCtx = cleanCanvas.getContext('2d');
        cleanCtx.drawImage(canvas, 0, 1, img.width, img.height - 1, 0, 0, img.width, img.height - 1);
        return { gridX, gridY, cleanCanvas };
    }

    /**
     * Replicates the logic of the 'Save Pos' button to cache the currently placed ghost image.
     * This function is made available globally so it can be called automatically.
     */
    async function cacheCurrentGhostPosition() {
        const savedCoordsStr = localStorage.getItem('ghostImageCoords');
        const savedImageData = localStorage.getItem('ghostImageData');
        if (!savedCoordsStr || !savedImageData) {
            gpLog("Auto-Cache: No ghost image on map or coordinates found.");
            return;
        }
        gpLog("Auto-Cache: Starting cache process.");

        const coords = JSON.parse(savedCoordsStr);
        const img = new Image();
        img.src = savedImageData;
        await new Promise(r => img.onload = r);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width; tempCanvas.height = img.height;
        tempCanvas.getContext('2d').drawImage(img, 0, 0);

        const encodedCanvas = encodeRobustPosition(tempCanvas, coords.gridX, coords.gridY);
        encodedCanvas.toBlob(async (blob) => {
            if(!blob) return;

            // Save to History (Cache)
            try {
                await HistoryManager.add(blob, `Backup_${coords.gridX}_${coords.gridY}`);
                gpLog("Auto-Cache: Cached image with position data.");
                notifyUser("Auto-Cache", `Ghost image position ${coords.gridX}, ${coords.gridY} auto-cached.`);
            } catch (e) {
                console.error("Auto-Cache failed", e);
                notifyUser("Auto-Cache Error", "Failed to auto-cache the image position.");
            }
        }, 'image/png');
    }
    // Expose for direct use if needed, but primarily used internally now
    window.cacheCurrentGhostPosition = cacheCurrentGhostPosition;


    // ========== GAME INTEGRATION ==========

    function applyCoordinatesToGame(coords) {
        gpLog("Applying coordinates...", coords);
        let attempts = 0;
        const interval = setInterval(() => {
            const placeBtn = document.getElementById('initiatePlaceGhostBtn');
            if (placeBtn && !placeBtn.disabled) {
                clearInterval(interval);
                localStorage.setItem('ghostImageCoords', JSON.stringify(coords));
                if (typeof window.initializeGhostFromStorage === 'function') {
                    window.initializeGhostFromStorage();
                    notifyUser("Auto-Place", `Position detected: ${coords.gridX}, ${coords.gridY}`);
                }
            }
            if (++attempts > 50) clearInterval(interval);
        }, 100);
    }

    async function loadImageToCanvas(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
        });
    }

    // ========== PROCESSING LOGIC ==========

    async function processAndLoadImage(file, saveToHistory = true) {
        gpLog("Processing image...");
        const placeBtn = document.getElementById('initiatePlaceGhostBtn');
        if (placeBtn) { placeBtn.innerText = "Analyzing..."; placeBtn.disabled = true; }

        try {
            const img = await loadImageToCanvas(file);
            const decoded = decodeRobustPosition(img);

            let finalFile = file;
            let coords = null;

            if (decoded) {
                gpLog("Found encoded position.");
                coords = { gridX: decoded.gridX, gridY: decoded.gridY };
                const cleanBlob = await new Promise(r => decoded.cleanCanvas.toBlob(r, 'image/png'));
                finalFile = new File([cleanBlob], file.name || "ghost.png", { type: "image/png" });
            }

            if (saveToHistory) {
                await HistoryManager.add(file, file.name);
            }

            const input = document.getElementById('ghostImageInput');
            const dt = new DataTransfer();
            dt.items.add(finalFile);
            input.files = dt.files;

            isInternalUpdate = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            isInternalUpdate = false;

            if (coords) applyCoordinatesToGame(coords);

        } catch (e) {
            console.error(e);
            notifyUser("Error", "Failed to process image.");
        } finally {
            if (placeBtn) placeBtn.innerText = "Place on Map";
        }
    }

    // ========== INTERCEPTOR ==========

    function setupNativeInterceptor() {
        const input = document.getElementById('ghostImageInput');
        if (!input) return;

        // 3. Add .zip to the file input's accepted types
        input.setAttribute('accept', 'image/png, image/jpeg, image/webp, image/gif, application/zip, .zip');

        input.addEventListener('change', async (e) => {
            if (isInternalUpdate) return;
            const file = e.target.files[0];
            if (!file) return;
            e.stopImmediatePropagation();
            e.preventDefault();

            // Check if it's a ZIP file
            if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.name.toLowerCase().endsWith('.zip')) {
                gpLog("Detected ZIP file upload");
                const success = await importFromZip(file);
                if (success) {
                    // Clear the input so same file can be uploaded again
                    input.value = '';
                }
                return;
            }

            // Otherwise process as image
            processAndLoadImage(file, true);
        }, true);
    }

    // ========== UI HANDLERS ==========

    async function handleUrlUpload() {
        const url = prompt("Enter Image or ZIP URL:");
        if (!url) return;
        try {
            const proxies = [
                u => u,
                u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
                u => `https://corsproxy.io/?${encodeURIComponent(u)}`
            ];
            let blob = null;
            let finalUrl = url;

            for (let p of proxies) {
                try {
                    finalUrl = p(url);
                    const res = await fetch(finalUrl);
                    if (res.ok) { blob = await res.blob(); break; }
                } catch(e){
                    gpLog(`Proxy attempt failed for ${finalUrl}: ${e.message}`);
                }
            }
            if (!blob) throw new Error("Could not fetch file after all proxy attempts.");

            // Check if it's a ZIP file
            if (blob.type === 'application/zip' || blob.type === 'application/x-zip-compressed' || url.toLowerCase().endsWith('.zip')) {
                gpLog("Detected ZIP file from URL");
                await importFromZip(blob);
                notifyUser("Success", "Imported cache from URL!");
                return;
            }

            // Otherwise treat as image
            if (!blob.type.startsWith('image/')) throw new Error("Invalid image");
            processAndLoadImage(new File([blob], "url_upload.png", { type: blob.type }), true);
        } catch (e) {
            console.error(e);
            notifyUser("Error", "Could not load file from URL.");
        }
    }

    async function downloadWithPos() {
        const savedCoordsStr = localStorage.getItem('ghostImageCoords');
        const savedImageData = localStorage.getItem('ghostImageData');
        if (!savedCoordsStr || !savedImageData) {
            notifyUser("Error", "No ghost image on map.");
            return;
        }
        const coords = JSON.parse(savedCoordsStr);
        const img = new Image();
        img.src = savedImageData;
        await new Promise(r => img.onload = r);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width; tempCanvas.height = img.height;
        tempCanvas.getContext('2d').drawImage(img, 0, 0);

        const encodedCanvas = encodeRobustPosition(tempCanvas, coords.gridX, coords.gridY);
        encodedCanvas.toBlob(async (blob) => {
            if(!blob) return;

            // 1. Save to History (Cache) - ALWAYS happens
            try {
                await HistoryManager.add(blob, `Backup_${coords.gridX}_${coords.gridY}`);
                gpLog("Cached image with position data");
            } catch (e) {
                console.error("Cache failed", e);
            }

            // 2. Ask if user wants to download
            const shouldDownload = confirm("Image cached! Download to your PC as well?");
            if (shouldDownload) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `GP_${coords.gridX}_${coords.gridY}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                notifyUser("Success", "Cached & Downloaded");
            } else {
                notifyUser("Success", "Cached to History");
            }
        }, 'image/png');
    }

    async function openHistoryModal() {
        const existing = document.getElementById('gp-history-modal');
        if (existing) existing.remove();

        const images = await HistoryManager.getAll();
        const modal = document.createElement('div');
        modal.id = 'gp-history-modal';
        modal.className = 'gp-modal-overlay';
        modal.innerHTML = `
            <div class="gp-modal-panel">
                <div class="gp-header">
                    <span class="gp-title">Image History (${images.length})</span>
                    <div class="flex gap-2">
                        <button id="gp-export-zip" class="gp-btn gp-btn-orange text-xs">💾 Export ZIP</button>
                        <button id="gp-import-zip" class="gp-btn gp-btn-green text-xs">📁 Import ZIP</button>
                        <button id="gp-clear-all" class="gp-btn gp-btn-red text-xs">Clear All</button>
                        <button id="gp-close-hist" class="gp-btn gp-btn-gray">Close</button>
                    </div>
                </div>
                <div class="gp-grid" id="gp-history-grid">
                    ${images.length === 0 ? '<p class="p-4 text-gray-500 col-span-full text-center">No images found.</p>' : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const grid = modal.querySelector('#gp-history-grid');
        images.forEach(imgData => {
            const card = document.createElement('div');
            card.className = 'gp-card';
            card.innerHTML = `
                <button class="gp-delete-btn" title="Delete">✖</button>
                <img src="${URL.createObjectURL(imgData.blob)}" />
                <div class="gp-card-footer">${new Date(imgData.date).toLocaleTimeString()} - ${imgData.name.substring(0,12)}</div>
            `;
            card.onclick = (e) => {
                if (e.target.closest('.gp-delete-btn')) return;
                processAndLoadImage(imgData.blob, false);
                modal.remove();
            };
            card.querySelector('.gp-delete-btn').onclick = async () => {
                await HistoryManager.delete(imgData.id);
                card.remove();
            };
            grid.appendChild(card);
        });

        modal.querySelector('#gp-export-zip').onclick = async () => {
            await exportToZip();
        };

        modal.querySelector('#gp-import-zip').onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.zip, application/zip'; // Ensure it only accepts zips
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await importFromZip(file);
                    modal.remove();
                    openHistoryModal(); // Refresh the modal
                }
            };
            input.click();
        };

        modal.querySelector('#gp-clear-all').onclick = async () => {
            if(confirm("Clear all cached images?")) {
                await HistoryManager.clear();
                modal.remove();
            }
        };
        modal.querySelector('#gp-close-hist').onclick = () => modal.remove();
    }

    // ========== INJECTION ==========

    /**
     * Watches the document for the coordinate-setting success message
     * and triggers the auto-cache function.
     * This addresses issue #2.
     */
    function setupAlertBodyObserver() {
        const targetNode = document.getElementById('alertBody');
        if (!targetNode) {
             gpLog("Could not find alertBody for position observer.");
             return;
        }

        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const textContent = targetNode.textContent;
                    if (textContent && textContent.includes("Ghost image position set")) {
                        gpLog("Detected 'Ghost image position set'. Triggering auto-cache.");
                        cacheCurrentGhostPosition();
                        // Disconnect after first success to avoid spamming the cache,
                        // as a new observer will be created when the modal is opened next.
                        observer.disconnect();
                        break;
                    }
                }
            }
        });

        // Start observing the target node for configured mutations
        const config = { childList: true, subtree: true, characterData: true };
        observer.observe(targetNode, config);
    }

    function injectControls() {
        const modal = document.getElementById('ghostImageModal');
        if (!modal) return;
        const container = modal.querySelector('.flex.flex-wrap.items-center.justify-center.gap-3');
        if (!container || container.dataset.gpInjected) return;
        container.dataset.gpInjected = "true";

        // 1. Remove the 'hidden' class from the hexDisplay span
        const hexDisplay = document.getElementById('hexDisplay');
        if (hexDisplay) {
            hexDisplay.classList.remove('hidden');
            gpLog("Removed 'hidden' class from hexDisplay.");
        }

        setupNativeInterceptor();

        const btnUrl = document.createElement('button');
        btnUrl.innerHTML = '🔗 URL'; btnUrl.className = 'gp-btn gp-btn-blue shadow';
        btnUrl.title = 'Load from URL (Image or ZIP)';
        btnUrl.onclick = handleUrlUpload;

        const btnLocal = document.createElement('button');
        btnLocal.innerHTML = '📂 File'; btnLocal.className = 'gp-btn gp-btn-green shadow';
        btnLocal.title = 'Upload Image or ZIP';
        // Note: The click handler for this just triggers the native input, which we intercept.
        btnLocal.onclick = () => document.getElementById('ghostImageInput').click();

        const btnHist = document.createElement('button');
        btnHist.innerHTML = '📜 History'; btnHist.className = 'gp-btn gp-btn-purple shadow';
        btnHist.onclick = openHistoryModal;

        const btnDL = document.createElement('button');
        btnDL.innerHTML = '💾 Save Pos'; btnDL.className = 'gp-btn gp-btn-gray shadow';
        btnDL.onclick = downloadWithPos;

        container.prepend(btnDL);
        container.prepend(btnHist);
        container.prepend(btnLocal);
        container.prepend(btnUrl);

        // Set up the observer for auto-caching after injection
        setupAlertBodyObserver();
    }

    const observer = new MutationObserver(() => injectControls());
    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelector('label[for="ghostImageInput"]')?.classList.add('hidden');

    gpLog("GeoPixels Ultimate Manager v3.4 Loaded (with fixes)");

})();
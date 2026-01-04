// ==UserScript==
// @name         U-Next Manga Downloader
// @version      1.1.0
// @namespace    https://github.com/manti-X/U-Next_Manga_Downloader
// @description  Decrypt and download .ubook (Manga) from U-Next
// @author       manti
// @license      MIT
// @match        https://video.unext.jp/*
// @supportURL   https://github.com/manti-X/U-Next_Manga_Downloader/issues
// @icon         https://video.unext.jp/apple-touch-icon.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559967/U-Next%20Manga%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/559967/U-Next%20Manga%20Downloader.meta.js
// ==/UserScript==

/*!
 * MIT License
 *
 * Copyright (c) 2025 manti
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    function getReactFiber(node) {
        if (!node) return null;
        const key = Object.keys(node).find(key => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"));
        return node ? node[key] : null;
    }

    function base64ToUint8Array(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }

    const log = (msg, type = 'info') => {
        const color = type === 'error' ? 'red' : (type === 'success' ? 'green' : 'cyan');
        console.log(`%c[UBook Decrypt] ${msg}`, `color:${color}; font-weight:bold;`);
    };

    function getManager() {
    const el = document.querySelector('.swiper');
    if (!el) throw new Error("Viewer element (.swiper) not found. Is the book open?");

    const fiber = getReactFiber(el);
    if (!fiber) throw new Error("Could not access React internals.");

    let curr = fiber;
    while (curr) {
        if (curr.memoizedProps && curr.memoizedProps.manager) {
            return curr.memoizedProps.manager;
        }
        curr = curr.return;
    }

    throw new Error("DRM Manager not found.");
}

    async function preloadKeys(manager) {
        const parser = manager.parser;
        const drmContext = parser.drmContext;
        
        if (!parser.drmParser || !parser.drmParser.drmHeader) {
            log("DRM Manager not found.", "error");
            return;
        }

        const fileList = parser.drmParser.drmHeader.encryptedFileList;
        const requiredKeyIds = new Set();
        const keyIdToFilePath = {};

        for (const [path, info] of Object.entries(fileList)) {
            if (info.keyId) {
                requiredKeyIds.add(info.keyId);
                if (!keyIdToFilePath[info.keyId]) {
                    keyIdToFilePath[info.keyId] = path;
                }
            }
        }

        const loadedKeys = Object.keys(drmContext.keys);
        const missingKeyIds = [...requiredKeyIds].filter(k => !loadedKeys.includes(k));

        if (missingKeyIds.length === 0) {
            log("All necessary keys are already loaded.", "success");
            return;
        }

        log(`Need to fetch ${missingKeyIds.length} missing keys...`);
        const btn = document.getElementById('ubook-dl-btn');
        if(btn) btn.innerText = `Fetching ${missingKeyIds.length} Keys...`;

        const promises = missingKeyIds.map(async (kid) => {
            const sampleFile = keyIdToFilePath[kid];
            try {
                await parser.getBinaryObject(sampleFile);
                log(`Fetched key for: ${sampleFile}`, "success");
            } catch (e) {
                console.warn(`Failed to preload key for ${sampleFile}`, e);
            }
        });

        await Promise.all(promises);
        log("Key preloading complete.");
    }

    async function processAndDownload() {
        const btn = document.getElementById('ubook-dl-btn');
        btn.disabled = true;

        try {
            const manager = getManager();
            const bookUrl = manager.parser.url;

            await preloadKeys(manager);

            const context = manager.parser.drmContext;
            const keys = context.keys;
            const keyIds = Object.keys(keys);
            
            if (keyIds.length === 0) throw new Error("No keys loaded. Preloading failed.");

            const keyMap = {};
            for (const kid of keyIds) {
                const cryptoKey = keys[kid];
                const rawKey = await window.crypto.subtle.exportKey("raw", cryptoKey);
                keyMap[kid] = await window.crypto.subtle.importKey("raw", rawKey, "AES-CBC", false, ["decrypt"]);
            }

            btn.innerText = "Downloading Book...";
            log(`Fetching: ${bookUrl}`);
            const response = await fetch(bookUrl);
            if (!response.ok) throw new Error("Failed to download .ubook file.");
            const blob = await response.blob();

            btn.innerText = "Reading ZIP...";
            const zip = await JSZip.loadAsync(blob);

            const drmFile = zip.file("drm.json");
            if (!drmFile) throw new Error("drm.json not found in the file.");

            const drmJson = JSON.parse(await drmFile.async("string"));
            const files = drmJson.encryptedFileList;
            const totalFiles = Object.keys(files).length;

            let processed = 0;

            for (const [filepath, info] of Object.entries(files)) {
                processed++;
                btn.innerText = `Decrypting ${processed}/${totalFiles}...`;

                const fileInZip = zip.file(filepath);
                if (!fileInZip) continue;

                const encryptedBytes = await fileInZip.async("uint8array");
                const iv = base64ToUint8Array(info.iv);
                const originalSize = info.originalFileSize;

                const aesKey = keyMap[info.keyId];
                if (!aesKey) {
                    console.error(`Key missing for ${filepath}`);
                    continue;
                }

                try {
                    const decryptedBuffer = await window.crypto.subtle.decrypt(
                        { name: "AES-CBC", iv: iv },
                        aesKey,
                        encryptedBytes
                    );

                    let cleanData = new Uint8Array(decryptedBuffer);
                    if (originalSize && cleanData.length > originalSize) {
                        cleanData = cleanData.slice(0, originalSize);
                    }

                    zip.file(filepath, cleanData);

                } catch (e) {
                    console.error(`Failed to decrypt ${filepath}`, e);
                }
            }

            zip.remove("drm.json");
            zip.remove("index.json");
            zip.remove("item/image/tn/");
            zip.remove("OEBPS/image/tn/");

            btn.innerText = "Zipping...";
            const content = await zip.generateAsync({type:"blob"});

            const filename = bookUrl.split('/').pop().replace('.ubook', '_decrypted.zip');

            saveAs(content, filename);

            log("Download started!", "success");
            btn.innerText = "Done! (Download again)";
            btn.disabled = false;

        } catch (e) {
            log(e.message, 'error');
            alert("Error: " + e.message);
            btn.innerText = "Download Decrypted ZIP";
            btn.disabled = false;
        }
    }

    function manageUI() {
        const viewerElement = document.querySelector('.swiper');
        const dlBtn = document.getElementById('ubook-dl-btn');
        const kofiBtn = document.getElementById('ubook-kofi-btn');

        if (viewerElement) {
            if (!dlBtn) {
                const btn = document.createElement('button');
                btn.id = 'ubook-dl-btn';
                btn.innerText = "Download Decrypted ZIP";
                Object.assign(btn.style, {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: '99999',
                    padding: '10px 15px',
                    backgroundColor: '#007aff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    fontWeight: 'bold',
                    fontSize: '14px'
                });

                btn.onclick = processAndDownload;

                document.body.appendChild(btn);
            }

            if (!kofiBtn) {
                const link = document.createElement('a');
                link.id = 'ubook-kofi-btn';
                link.href = 'https://ko-fi.com/bakaloli';
                link.textContent = '☕ Support me on Ko-fi';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                Object.assign(link.style, {
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    background: '#ff5f5f',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'sans-serif',
                    textDecoration: 'none',
                    zIndex: 99999,
                    opacity: '0.8',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                });

                link.addEventListener('mouseenter', () => link.style.opacity = '1');
                link.addEventListener('mouseleave', () => link.style.opacity = '0.8');

                document.body.appendChild(link);
            }
        } else {
            if (dlBtn) dlBtn.remove();
            if (kofiBtn) kofiBtn.remove();
        }
    }

    setInterval(manageUI, 1000);
})();

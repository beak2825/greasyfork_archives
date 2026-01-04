// ==UserScript==
// @name         VRH Deobfuscator Download
// @namespace    https://github.com/uwu/vrh-deobfuscator
// @version      4.0.1.1
// @description  External Project-01 (NOT FOR TERRITORIAL.IO) (DISCOUNTINUED)
// @author       Based on uwu/vrh-deobfuscator
// @match        https://hub.vroid.com/en/characters/*
// @match        https://hub.vroid.com/characters/*
// @icon         https://hub.vroid.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556810/VRH%20Deobfuscator%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/556810/VRH%20Deobfuscator%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        API_BASE: 'https://hub.vroid.com/api',
        DECOMPRESS_SERVER: 'http://localhost:3000', // Change this if running on different host/port
        ENDPOINTS: {
            optimized: (id) => `/character_models/${id}/optimized_preview`,
            preview: (id) => `/character_models/${id}/preview`,
        }
    };

    // Logger utility
    const Logger = {
        log(msg) { console.log(`[VRH] ${msg}`); },
        error(msg) { console.error(`[VRH] ${msg}`); },
        warn(msg) { console.warn(`[VRH] ${msg}`); }
    };

    // Extract model ID from current page
    function getModelId() {
        const match = window.location.pathname.match(/\/models\/([\d]+)/);
        return match ? match[1] : null;
    }

    // Create and inject button
    function createDeobfuscateButton(modelId) {
        const btn = document.createElement('button');
        btn.id = 'vrh-deobfuscate-main-btn';
        btn.innerHTML = '🔓 Download Model';
        btn.className = 'vrh-main-btn';
        
        const styles = `
            #vrh-deobfuscate-main-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 24px;
                margin: 8px 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            }
            
            #vrh-deobfuscate-main-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
            }
            
            #vrh-deobfuscate-main-btn:active:not(:disabled) {
                transform: translateY(0);
            }
            
            #vrh-deobfuscate-main-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `;

        if (!document.getElementById('vrh-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'vrh-styles';
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
        }

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleDownload(modelId, btn);
        });

        return btn;
    }

    // Main download handler
    async function handleDownload(modelId, button) {
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '⏳ Fetching...';

        try {
            const data = await fetchModel(modelId);
            button.innerHTML = '🔓 Decrypting...';
            
            const decrypted = await decryptModel(data);
            button.innerHTML = '💾 Saving...';
            
            downloadFile(decrypted, `vroid_model_${modelId}.vrm`);
            
            button.innerHTML = '✓ Downloaded!';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);

            GM_notification({
                title: '✓ Success',
                text: `Model downloaded! File size: ${(decrypted.byteLength / 1024 / 1024).toFixed(2)} MB`,
                timeout: 4000
            });

        } catch (error) {
            Logger.error(error.message);
            button.innerHTML = '✗ Error';
            button.disabled = false;

            GM_notification({
                title: '✗ Error',
                text: error.message,
                timeout: 5000
            });

            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }
    }

    // Fetch model from API
    function fetchModel(modelId) {
        return new Promise((resolve, reject) => {
            let attempted = 0;
            const endpoints = [
                CONFIG.ENDPOINTS.optimized(modelId),
                CONFIG.ENDPOINTS.preview(modelId)
            ];

            const tryFetch = (endpointIndex) => {
                if (endpointIndex >= endpoints.length) {
                    reject(new Error('Failed to fetch from all endpoints'));
                    return;
                }

                const endpoint = endpoints[endpointIndex];
                const url = CONFIG.API_BASE + endpoint;
                Logger.log(`Fetching (attempt ${endpointIndex + 1}): ${url}`);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer',
                    headers: {
                        'X-Api-Version': '11',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    onload: (response) => {
                        if (response.status === 200) {
                            Logger.log(`Downloaded ${(response.response.byteLength / 1024).toFixed(2)} KB`);
                            resolve(response.response);
                        } else {
                            Logger.warn(`Endpoint ${endpointIndex + 1} returned ${response.status}, trying next...`);
                            tryFetch(endpointIndex + 1);
                        }
                    },
                    onerror: (error) => {
                        Logger.warn(`Endpoint ${endpointIndex + 1} failed: ${error}`);
                        tryFetch(endpointIndex + 1);
                    }
                });
            };

            tryFetch(0);
        });
    }

    // Decrypt AES-CBC encrypted model
    async function decryptModel(buffer) {
        try {
            if (buffer.byteLength < 48) {
                throw new Error('Buffer too small for encrypted format');
            }

            const iv = buffer.slice(0, 16);
            const keyBytes = buffer.slice(16, 48);
            const ciphertext = buffer.slice(48);

            Logger.log(`Decrypting: IV=${iv.byteLength}B, Key=${keyBytes.byteLength}B, Cipher=${ciphertext.byteLength}B`);

            const key = await crypto.subtle.importKey(
                'raw',
                keyBytes,
                { name: 'AES-CBC', length: 256 },
                false,
                ['decrypt']
            );

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-CBC', iv: iv },
                key,
                ciphertext
            );

            Logger.log('AES-CBC decryption successful');
            
            // Now decompress with zstd
            Logger.log('Decompressing with zstd...');
            const decompressed = await decompressZstd(decrypted);
            Logger.log(`Decompression successful: ${(decompressed.byteLength / 1024 / 1024).toFixed(2)} MB`);
            
            return decompressed;

        } catch (error) {
            throw new Error(`Decryption/Decompression failed: ${error.message}`);
        }
    }

    // Decompress zstd data via local server
    async function decompressZstd(buffer) {
        try {
            // First check if it's valid glTF (already decompressed)
            if (isValidGltf(buffer)) {
                Logger.log('✓ File is already in glTF format');
                return buffer;
            }

            Logger.log('Connecting to decompression server...');
            
            // Send to local decompression server
            const decompressed = await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error(`Decompression server not running!\n\nMake sure to:\n1. Open PowerShell\n2. Run: cd C:\\vrh-server && npm start\n3. Keep it running while using userscript`));
                }, 30000);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: CONFIG.DECOMPRESS_SERVER + '/decompress',
                    data: buffer,
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    },
                    onload: (response) => {
                        clearTimeout(timeout);
                        if (response.status === 200) {
                            resolve(response.response);
                        } else {
                            reject(new Error(`Server error: ${response.status}\n\nDecompression server returned error. Check server terminal.`));
                        }
                    },
                    onerror: (error) => {
                        clearTimeout(timeout);
                        reject(new Error(`Cannot connect to http://localhost:3000\n\nMake sure decompression server is running:\n1. PowerShell: cd C:\\vrh-server && npm start\n2. Keep window open\n3. See QUICK_START_SERVER.md for setup`));
                    }
                });
            });

            const ratio = ((1 - decompressed.byteLength / buffer.byteLength) * 100).toFixed(1);
            Logger.log(`✓ Decompression successful: ${(buffer.byteLength / 1024 / 1024).toFixed(2)}MB → ${(decompressed.byteLength / 1024 / 1024).toFixed(2)}MB (${ratio}% reduction)`);
            return decompressed;
            
        } catch (error) {
            Logger.error(`Decompression failed: ${error.message}`);
            throw error;
        }
    }

    // Check if buffer is valid glTF/GLB format
    function isValidGltf(buffer) {
        if (buffer.byteLength < 20) return false;
        const view = new Uint8Array(buffer);
        // Check for glTF magic number: 0x46546C67 ("glTF")
        return view[0] === 0x67 && view[1] === 0x6C && view[2] === 0x54 && view[3] === 0x46;
    }

    // Trigger file download
    function downloadFile(data, filename) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Find and inject button into page
    function injectButton() {
        const modelId = getModelId();
        if (!modelId) {
            Logger.log('Not a model page');
            return;
        }

        if (document.getElementById('vrh-deobfuscate-main-btn')) {
            return; // Already injected
        }

        // Look for download button area
        let insertPoint = null;
        
        // Try multiple selectors
        const selectors = [
            'main',
            '[class*="download"]',
            '[class*="Download"]',
            '[class*="model"]',
            '[class*="Model"]',
            'header',
            '[role="main"]'
        ];

        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                insertPoint = el;
                break;
            }
        }

        // Fallback to body
        if (!insertPoint) {
            insertPoint = document.body;
        }

        const button = createDeobfuscateButton(modelId);
        insertPoint.insertBefore(button, insertPoint.firstChild);
        Logger.log(`Button injected for model ${modelId}`);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectButton);
    } else {
        setTimeout(injectButton, 100);
    }

    // Retry for dynamic content
    setTimeout(injectButton, 2000);

    Logger.log('Ready (v4.0.0 - Server-based zstd decompression)');
})();

// ==UserScript==
// @name         Grok Video Used too Enlengenthener and now doesnt
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Grok Video Generation but 15 seconds not 6 
// @author       Methamphetamine and Cum
// @match        https://grok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558712/Grok%20Video%20Used%20too%20Enlengenthener%20and%20now%20doesnt.user.js
// @updateURL https://update.greasyfork.org/scripts/558712/Grok%20Video%20Used%20too%20Enlengenthener%20and%20now%20doesnt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- UI Construction ---
    const createUI = () => {
        const container = document.createElement('div');
        container.id = 'grok-payload-exp-ui';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 300px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            z-index: 999999;
            color: #fff;
            font-family: sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        `;

        const title = document.createElement('h3');
        title.textContent = 'Payload Experiment';
        title.style.cssText = 'margin: 0 0 15px 0; font-size: 16px; color: #4ade80; display: flex; justify-content: space-between; align-items: center;';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Hide';
        toggleBtn.style.cssText = 'background: none; border: none; color: #888; cursor: pointer; font-size: 12px;';
        toggleBtn.onclick = () => {
            const content = container.querySelector('.exp-content');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggleBtn.textContent = 'Hide';
            } else {
                content.style.display = 'none';
                toggleBtn.textContent = 'Show';
            }
        };
        title.appendChild(toggleBtn);
        container.appendChild(title);

        const content = document.createElement('div');
        content.className = 'exp-content';

        // Helper to create inputs
        const createGroup = (label, element) => {
            const group = document.createElement('div');
            group.style.marginBottom = '12px';
            const labelEl = document.createElement('label');
            labelEl.textContent = label;
            labelEl.style.cssText = 'display: block; margin-bottom: 5px; font-size: 12px; color: #ccc;';
            group.appendChild(labelEl);
            group.appendChild(element);
            return group;
        };

        // 1. Enable Toggle
        const enableCheck = document.createElement('input');
        enableCheck.type = 'checkbox';
        enableCheck.id = 'exp-enable';
        enableCheck.checked = true;
        content.appendChild(createGroup('Enable Interception', enableCheck));

        // 2. Aspect Ratio
        const arSelect = document.createElement('select');
        arSelect.id = 'exp-ar';
        arSelect.style.cssText = 'width: 100%; padding: 5px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px;';
        ['Default (Unchanged)', '1:1', '16:9', '9:16', '4:3', '3:4', '2:1', '1:2'].forEach(ar => {
            const opt = document.createElement('option');
            opt.value = ar === 'Default (Unchanged)' ? '' : ar;
            opt.textContent = ar;
            arSelect.appendChild(opt);
        });
        content.appendChild(createGroup('Target Aspect Ratio', arSelect));

        // 3. Video Length
        const lenInput = document.createElement('input');
        lenInput.type = 'number';
        lenInput.id = 'exp-len';
        lenInput.min = 1;
        lenInput.max = 15;
        lenInput.placeholder = 'Default (6)';
        lenInput.style.cssText = 'width: 100%; padding: 5px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px;';
        content.appendChild(createGroup('Video Length (seconds)', lenInput));

        // 4. Image URL Swap
        const urlInput = document.createElement('textarea');
        urlInput.id = 'exp-url';
        urlInput.placeholder = 'Paste Image URL here to swap source...';
        urlInput.rows = 3;
        urlInput.style.cssText = 'width: 100%; padding: 5px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; resize: vertical; font-size: 11px;';
        content.appendChild(createGroup('Swap Source Image URL', urlInput));

        // Status Log
        const statusLog = document.createElement('div');
        statusLog.id = 'exp-status';
        statusLog.style.cssText = 'margin-top: 10px; padding: 8px; background: #000; border-radius: 4px; font-size: 10px; color: #aaa; max-height: 100px; overflow-y: auto; font-family: monospace;';
        statusLog.textContent = 'Ready...';
        content.appendChild(statusLog);

        container.appendChild(content);
        document.body.appendChild(container);
    };

    const log = (msg) => {
        const el = document.getElementById('exp-status');
        if (el) {
            const line = document.createElement('div');
            line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            line.style.borderBottom = '1px solid #222';
            el.prepend(line);
        }
        console.log('[GrokExp]', msg);
    };

    // --- Logic ---

    const extractUuid = (url) => {
        // Matches standard UUID pattern
        const match = url.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
        return match ? match[1] : null;
    };

    const modifyPayload = (originalBody) => {
        try {
            const body = JSON.parse(originalBody);

            // Only target video generation requests
            if (!body.toolOverrides || !body.toolOverrides.videoGen) {
                return originalBody;
            }

            const enable = document.getElementById('exp-enable')?.checked;
            if (!enable) return originalBody;

            log('Intercepted Video Gen Request!');

            let config = body.responseMetadata?.modelConfigOverride?.modelMap?.videoGenModelConfig;
            if (!config) {
                // Initialize structure if missing (unlikely for video gen but safe)
                if (!body.responseMetadata) body.responseMetadata = {};
                if (!body.responseMetadata.modelConfigOverride) body.responseMetadata.modelConfigOverride = {};
                if (!body.responseMetadata.modelConfigOverride.modelMap) body.responseMetadata.modelConfigOverride.modelMap = {};
                body.responseMetadata.modelConfigOverride.modelMap.videoGenModelConfig = {};
                config = body.responseMetadata.modelConfigOverride.modelMap.videoGenModelConfig;
            }

            // 1. Aspect Ratio
            const ar = document.getElementById('exp-ar')?.value;
            if (ar) {
                log(`Overriding AR: ${config.aspectRatio} -> ${ar}`);
                config.aspectRatio = ar;
            }

            // 2. Video Length
            const len = document.getElementById('exp-len')?.value;
            if (len) {
                const val = parseInt(len);
                if (!isNaN(val)) {
                    log(`Overriding Length: ${config.videoLength} -> ${val}`);
                    config.videoLength = val;
                }
            }

            // 3. Image Swap
            const swapUrl = document.getElementById('exp-url')?.value?.trim();
            if (swapUrl) {
                const newUuid = extractUuid(swapUrl);
                if (newUuid) {
                    log(`Swapping Image ID: ${config.parentPostId} -> ${newUuid}`);

                    // Update parentPostId
                    config.parentPostId = newUuid;

                    // Update Message URL
                    // We need to be careful to replace just the URL part
                    // Strategy: Find the existing UUID in the message and replace the whole URL containing it?
                    // Or just prepend the new URL if we are constructing a fresh message?
                    // Existing message examples:
                    // "https://.../OLD_UUID.png --mode=normal"
                    // "https://.../OLD_UUID/content \"prompt\" ..."

                    // Let's try to find the URL in the message
                    // Regex to find http...UUID...
                    // It might end with space, quote, or end of string
                    const urlRegex = /https?:\/\/[^\s"]+([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})[^\s"]*/i;

                    if (body.message && body.message.match(urlRegex)) {
                        body.message = body.message.replace(urlRegex, swapUrl);
                        log('Updated Message URL');
                    } else {
                        // Fallback if regex fails (maybe message format changed)
                        // Just prepend/replace? Let's warn.
                        log('Warning: Could not find URL in message to replace. Appending new URL.');
                        body.message = swapUrl + " " + body.message;
                    }

                    // Update fileAttachments if present (for user uploads)
                    if (body.fileAttachments && Array.isArray(body.fileAttachments)) {
                        // If we are swapping, we should probably replace the attachment ID
                        // Assuming single attachment for video gen
                        body.fileAttachments = [newUuid];
                        log('Updated fileAttachments');
                    }
                } else {
                    log('Error: Invalid UUID in swap URL');
                }
            }

            return JSON.stringify(body);

        } catch (e) {
            console.error('[GrokExp] Error modifying payload:', e);
            log('Error modifying payload: ' + e.message);
            return originalBody;
        }
    };

    // --- Interceptor ---
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        let url = input;
        if (input instanceof Request) {
            url = input.url;
        }

        if (url && url.includes('/rest/app-chat/conversations/new') && init && init.method === 'POST' && init.body) {
            const newBody = modifyPayload(init.body);
            init.body = newBody;
        }

        return originalFetch.apply(this, arguments);
    };

    // --- Init ---
    // Wait for body
    const waitInterval = setInterval(() => {
        if (document.body) {
            clearInterval(waitInterval);
            createUI();
            log('Interceptor Active');
        }
    }, 500);

})();

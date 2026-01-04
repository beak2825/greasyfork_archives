// ==UserScript==
// @name         Agar.io UID Extractor
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Replaces the bottom ad banner with a native-looking tool to extract and display your Agar.io User ID.
// @author       vo3pal
// @match        *://agar.io/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549691/Agario%20UID%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/549691/Agario%20UID%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Core Interception & Decryption Logic (Runs Immediately at document-start) ---

    const originalWebSocket = unsafeWindow.WebSocket;
    let interceptActive = true;
    let protocolKey = null, clientKey = null, clientVersion = null, keysFound = false;
    let statusEl, outputEl, resultArea, copyBtn; // UI element references

    function stopIntercepting() {
        if (!interceptActive) return;
        interceptActive = false;
        unsafeWindow.WebSocket = originalWebSocket;
    }

    function displaySuccess(uid) {
        if (statusEl && outputEl && resultArea) {
            const finalUID = uid.replace(/=/g, "%3D"); // convert = to %3D
            statusEl.textContent = 'SUCCESS! UID Found.';
            statusEl.className = 'success';
            outputEl.value = finalUID;
            resultArea.style.display = 'flex';
        }
    }


    function displayFailure(message) {
        if (statusEl) {
            statusEl.textContent = `FAILED: ${message}`;
            statusEl.className = 'error';
        }
    }

    // --- 1:1 REPLICATION of the game's key generation and decryption functions ---
    const generateClientKey = function(ip, serverKeyBytes) {
        if (!ip || !serverKeyBytes || !serverKeyBytes.byteLength) return null;
        let finalKey = null; const magicNumber = 1540483477; const url = new URL(ip); const domainAndPath = url.hostname + url.pathname.replace(/\/$/g, ''); const combinedLength = domainAndPath.length + serverKeyBytes.byteLength; const buffer = new Uint8Array(combinedLength);
        for (let i = 0; i < domainAndPath.length; i++) buffer[i] = domainAndPath.charCodeAt(i);
        buffer.set(serverKeyBytes, domainAndPath.length); const dataView = new DataView(buffer.buffer); let remaining = combinedLength - 1; const value = (remaining - 4 & -4) + 4 | 0; let checksum = remaining ^ 255; let offset = 0;
        while (remaining > 3) { finalKey = Math.imul(dataView.getInt32(offset, true), magicNumber) | 0; checksum = (Math.imul(finalKey >>> 24 ^ finalKey, magicNumber) | 0) ^ (Math.imul(checksum, magicNumber) | 0); remaining -= 4; offset += 4; }
        switch (remaining) { case 3: checksum = buffer[value + 2] << 16 ^ checksum; checksum = buffer[value + 1] << 8 ^ checksum; break; case 2: checksum = buffer[value + 1] << 8 ^ checksum; break; case 1: break; default: finalKey = checksum; break; }
        if (finalKey !== checksum) finalKey = Math.imul(buffer[value] ^ checksum, magicNumber) | 0;
        checksum = finalKey >>> 13; finalKey = checksum ^ finalKey; finalKey = Math.imul(finalKey, magicNumber) | 0; checksum = finalKey >>> 15; finalKey = checksum ^ finalKey; return finalKey;
    };

    const decryptMessage = function(view, key) {
        for (let i = 0; i < view.byteLength; i++) { view.setUint8(i, view.getUint8(i) ^ key >>> i % 4 * 8 & 255); } return view;
    };

    const messageInterceptor = function(event) {
        if (!interceptActive || !(event.data instanceof ArrayBuffer) || event.data.byteLength < 1) return;
        const rawView = new DataView(event.data); const opcode = rawView.getUint8(0);
        if (!keysFound) {
            if (opcode === 241 && rawView.byteLength > 4) {
                protocolKey = rawView.getUint32(1, true);
                const serverKey = new Uint8Array(event.data, 5);
                clientVersion = 31128;
                if (!clientVersion) { displayFailure("Could not find clientVersion."); stopIntercepting(); return; }
                clientKey = generateClientKey(this.url, serverKey);
                keysFound = true;
                if (statusEl) { statusEl.textContent = 'Keys Found! Listening for User Data...'; statusEl.className = 'listening'; }
            }
            return;
        }
        const mutableBuffer = event.data.slice(0); let decryptedView = new DataView(mutableBuffer); decryptedView = decryptMessage(decryptedView, protocolKey ^ clientVersion); const decryptedOpcode = decryptedView.getUint8(0);
        if (decryptedOpcode === 102) {
            try {
                const textDecoder = new TextDecoder('utf-8');
                const messageString = textDecoder.decode(decryptedView.buffer);
                const uidRegex = /([A-Z0-9]{50,}=)/; const match = messageString.match(uidRegex);
                if (match && match[1]) {
                    displaySuccess(match[1]);
                } else {
                    displayFailure("UID pattern not found in packet.");
                }
                stopIntercepting();
            } catch (e) {
                displayFailure("Error parsing data packet.");
                stopIntercepting();
            }
        }
    };

    // --- Monkey-patch the WebSocket constructor immediately ---
    unsafeWindow.WebSocket = function(...args) {
        const wsInstance = new originalWebSocket(...args);
        wsInstance.addEventListener('message', messageInterceptor);
        return wsInstance;
    };
    unsafeWindow.WebSocket.prototype = originalWebSocket.prototype;
    unsafeWindow.WebSocket.prototype.constructor = unsafeWindow.WebSocket;

    // --- UI Creation (waits for the DOM to be ready) ---
    function setupUI() {
        const adContainer = document.getElementById('agar-io_300x250');
        if (!adContainer) {
            setTimeout(setupUI, 200);
            return;
        }

        const panelHTML = `
            <div id="uid-panel-container">
                <h2>UID Extractor</h2>
                <p id="uid-status">Waiting for you to log in or play...</p>
                <div id="uid-result-area" style="display: none;">
                    <textarea id="uid-output" readonly></textarea>
                    <button id="uid-copy-button">COPY UID</button>
                </div>
            </div>
        `;

        adContainer.innerHTML = panelHTML;
        adContainer.style.height = 'auto';
        adContainer.style.paddingTop = '0';

        GM_addStyle(`
            /* --- Main Panel Style (Matches Agar.io Panels) --- */
            #uid-panel-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 288px;
                background-color: #FFFFFF;
                border-radius: 15px;
                box-sizing: border-box;
                font-family: 'Ubuntu', sans-serif;
                padding: 15px;
                text-align: center;
            }
            /* --- Header Style (Matches "Select Game Mode") --- */
            #uid-panel-container h2 {
                margin: 0 0 10px 0;
                font-size: 24px;
                font-weight: 700;
                color: #545454;
                text-transform: uppercase;
            }
            /* --- Status Text Style --- */
            #uid-status {
                font-size: 16px;
                color: #777777;
                min-height: 24px;
                transition: color 0.3s ease;
                margin: 5px 0 10px 0;
            }
            #uid-status.listening { color: #545454; font-style: italic; }
            #uid-status.success { color: #00B354; font-weight: bold; }
            #uid-status.error { color: #ff3333; font-weight: bold; }
            /* --- Result Area --- */
            #uid-result-area {
                width: 100%;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
            }
            /* --- UID Text Box Style --- */
            #uid-output {
                flex-grow: 1;
                width: 100%;
                background-color: #F0F0F0;
                color: #333333;
                border: 1px solid #D0D0D0;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                padding: 10px;
                resize: none;
                box-sizing: border-box;
                word-break: break-all;
            }
            /* --- Copy Button Style (Matches Agar.io Blue Button) --- */
            #uid-copy-button {
                position: relative;
                padding: 10px;
                margin-top: 10px;
                background-color: #009cff;
                color: white;
                border: none;
                border-bottom: 3px solid #007fcf;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 700;
                text-transform: uppercase;
                transition: all 0.1s ease-out;
            }
            #uid-copy-button:hover {
                background-color: #00d3ff;
            }
            #uid-copy-button:active {
                top: 2px;
                border-bottom-width: 1px;
            }
        `);

        // Assign UI elements to the globally accessible variables
        statusEl = document.getElementById('uid-status');
        resultArea = document.getElementById('uid-result-area');
        outputEl = document.getElementById('uid-output');
        copyBtn = document.getElementById('uid-copy-button');

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(outputEl.value).then(() => {
                copyBtn.textContent = 'COPIED!';
                setTimeout(() => { copyBtn.textContent = 'COPY UID'; }, 2000);
            });
        };
    }

    // Defer UI creation until the DOM is ready
    window.addEventListener('DOMContentLoaded', setupUI);

    // --- Timeout ---
    setTimeout(() => {
        if (interceptActive && !keysFound) {
            displayFailure("Timeout: Handshake packet not found.");
            stopIntercepting();
        }
    }, 20000);

})();
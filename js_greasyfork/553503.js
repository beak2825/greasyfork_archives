// ==UserScript==
// @name         BubbaBlox AdBlocker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Blocks image-based ads on bbblox.org | Made by feowi_ on discord, (@doi on Bubbablox)
// @author       feowi_
// @license      MIT
// @match        *://bbblox.org/*
// @match        *://www.bbblox.org/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553503/BubbaBlox%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/553503/BubbaBlox%20AdBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = '553503'; //
    const CURRENT_VERSION = '1.3';
    const META_URL = `https://greasyfork.org/scripts/${SCRIPT_ID}/meta.json`;

    const blockBase = "https://bbblox.org/images/";
    const allowPath = "https://bbblox.org/images/thumbnails/";

    // --- Block <img> elements ---
    const observer = new MutationObserver(() => {
        document.querySelectorAll('img').forEach(img => {
            if (img.src.startsWith(blockBase) && !img.src.startsWith(allowPath)) {
                console.log("Blocked image:", img.src);
                img.remove();
            }
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // --- Block XHR requests ---
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.startsWith(blockBase) && !url.startsWith(allowPath)) {
            console.log("Blocked XHR:", url);
            return;
        }
        return open.apply(this, arguments);
    };

    // --- Block fetch requests ---
    const origFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.startsWith(blockBase) && !url.startsWith(allowPath)) {
            console.log("Blocked fetch:", url);
            return new Promise(() => {});
        }
        return origFetch.apply(this, arguments);
    };

    // --- Version check ---
    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: META_URL,
            onload: function(response) {
                try {
                    const metadata = JSON.parse(response.responseText);
                    const latestVersion = metadata.version;
                    if (latestVersion !== CURRENT_VERSION) {
                        notifyUpdate(latestVersion);
                    }
                } catch (e) {
                    console.warn("Failed to check script version:", e);
                }
            }
        });
    }

    function notifyUpdate(latest) {
        const div = document.createElement("div");
        div.innerHTML = `
            <div id="bb-update-popup">
                🚨 <b>BubbaBlox AdBlocker</b> update available!<br>
                <span>Current: ${CURRENT_VERSION} → New: ${latest}</span><br>
                <a href="https://greasyfork.org/scripts/${SCRIPT_ID}" target="_blank">Click here to update</a>
            </div>
        `;
        document.body.appendChild(div);
    }

    // --- Styles for popup ---
    GM_addStyle(`
        #bb-update-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a1a1a;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 0 10px #00000080;
            font-size: 14px;
            z-index: 9999;
        }
        #bb-update-popup a {
            color: #00b7ff;
            text-decoration: underline;
        }
    `);

    // --- Run update check (once per load) ---
    checkForUpdates();
})();

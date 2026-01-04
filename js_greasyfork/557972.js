// ==UserScript==
// @name         X.com SearchTimeline Entry Counter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Count SearchTimeline GraphQL entries on X (Twitter)
// @author       ChatGPT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-start
// @license           MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/557972/Xcom%20SearchTimeline%20Entry%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/557972/Xcom%20SearchTimeline%20Entry%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create UI early
    let totalEntries = 0;
    const counterUI = document.createElement('div');
    counterUI.style.position = 'fixed';
    counterUI.style.top = '10px';
    counterUI.style.right = '10px';
    counterUI.style.backgroundColor = 'rgba(0,0,0,0.8)';
    counterUI.style.color = '#fff';
    counterUI.style.padding = '8px 12px';
    counterUI.style.borderRadius = '8px';
    counterUI.style.zIndex = '999999';
    counterUI.style.fontFamily = 'Arial, sans-serif';
    counterUI.style.fontSize = '14px';
    counterUI.innerText = `Entries: 0`;
    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(counterUI);
    });

    function countEntriesFromJson(json) {
        try {
            const instructions = json?.data?.search_by_raw_query?.search_timeline?.timeline?.instructions || [];
            let count = 0;
            for (const instruction of instructions) {
                if (instruction.type === 'TimelineAddEntries' && Array.isArray(instruction.entries)) {
                    count += instruction.entries.length;
                }
            }
            return count;
        } catch (e) {
            return 0;
        }
    }

    // --- Hook fetch ---
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        try {
            const url = args[0];
            if (typeof url === 'string' && url.includes('SearchTimeline')) {
                const cloned = response.clone();
                cloned.json().then(json => {
                    const count = countEntriesFromJson(json);
                    if (count > 0) {
                        totalEntries += count;
                        counterUI.innerText = `Entries: ${totalEntries}`;
                        console.log(`[SearchTimeline] +${count} entries (Total: ${totalEntries})`);
                    }
                });
            }
        } catch (err) {
            console.warn('Fetch hook error:', err);
        }

        return response;
    };

    // --- Hook XMLHttpRequest (fallback) ---
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._url = url;
        return originalOpen.call(this, method, url, ...rest);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', function () {
            if (this._url && this._url.includes('SearchTimeline')) {
                try {
                    const json = JSON.parse(this.responseText);
                    const count = countEntriesFromJson(json);
                    if (count > 0) {
                        totalEntries += count;
                        counterUI.innerText = `Entries: ${totalEntries}`;
                        console.log(`[XHR SearchTimeline] +${count} entries (Total: ${totalEntries})`);
                    }
                } catch (e) {}
            }
        });
        return originalSend.apply(this, args);
    };

})();

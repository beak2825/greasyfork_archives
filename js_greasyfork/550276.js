// ==UserScript==
// @name         Auto Slow Download Nexus Mods 2025-12-25
// @namespace    NukaExpress
// @version      v2025.12.25
// @description  Auto click "Slow download" button and close page
// @author       NukaExpress
// @match        *://*.nexusmods.com/*
// @match        *://nexusmods.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550276/Auto%20Slow%20Download%20Nexus%20Mods%202025-12-25.user.js
// @updateURL https://update.greasyfork.org/scripts/550276/Auto%20Slow%20Download%20Nexus%20Mods%202025-12-25.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function findInDocument(doc) {
        // Shadow DOMs
        const shadowHosts = doc.querySelectorAll('*');
        for (const el of shadowHosts) {
            if (el.shadowRoot) {
                const found = el.shadowRoot.querySelector('#download-section');
                if (found) return found;
            }
        }

        // normal DOM
        const normal = doc.querySelector('#download-section');
        if (normal) return normal;

        // iframes
        const iframes = doc.querySelectorAll('iframe');
        for (const frame of iframes) {
            try {
                const found = findInDocument(frame.contentDocument);
                if (found) return found;
            } catch(e) {
                continue;
            }
        }

        return null;
    }

    function findButton(div) {
        const buttons = div.querySelectorAll('button, a');
        for (const btn of buttons) {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === 'Slow download') {
                return btn;
            }
        }
        return null;
    }

    function waitForText(targetText, callback) {
        const checkInterval = setInterval(() => {
            const paragraphs = document.querySelectorAll('p');
            for (const p of paragraphs) {
                if (p.textContent.trim() === targetText) {
                    clearInterval(checkInterval);
                    callback(p);
                    return;
                }
            }
        }, 500);
    }

    const interval = setInterval(() => {
        const div = findInDocument(document);
        if (!div) {
            console.log('Searching Download-Section...');
            return;
        }

        const button = findButton(div);
        if (button) {
            console.log('Found Slow download Button:', button);
            clearInterval(interval);
            button.click();
            console.log('Clicked, waiting for Download to start...');

            waitForText('Your download has started', (p) => {
                console.log('Download started, closing Window/Tab :)');
                sleep(1000).then(() => {
                  window.close();
                });
            });
        }
    }, 1000);

})();
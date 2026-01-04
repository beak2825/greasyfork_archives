// ==UserScript==
// @name         AniList Shiru Launcher
// @namespace    https://anilist.co/
// @version      1.0
// @description  Adds a button to AniList anime pages that opens the corresponding anime in Shiru
// @author       darklinkpower
// @match        https://anilist.co/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554939/AniList%20Shiru%20Launcher.user.js
// @updateURL https://update.greasyfork.org/scripts/554939/AniList%20Shiru%20Launcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = true;
    const PREFIX = '[ShiruButton]';
    const log = (msg, ...args) => DEBUG && console.log(`${PREFIX} ${msg}`, ...args);

    log('Script loaded');

    let lastUrl = location.href;

    // Observe SPA navigation
    const navObserver = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            log(`URL changed: ${lastUrl} → ${currentUrl}`);
            lastUrl = currentUrl;
            onPageChange();
        }
    });
    navObserver.observe(document, { childList: true, subtree: true });

    onPageChange();

    function onPageChange() {
        const match = location.pathname.match(/^\/anime\/(\d+)/);
        if (!match) {
            log('Not an anime page, skipping.');
            return;
        }

        const animeId = match[1];
        const uri = `shiru://anime/${animeId}`;
        log(`Anime detected: ID=${animeId}, URI=${uri}`);

        waitForElement('h1[data-v-5776f768]', (h1) => {
            if (!h1) return log('Target <h1> not found.');

            const existing = h1.querySelector('.shiru-rel-link');
            if (existing) {
                const anchor = existing.querySelector('a.link');
                if (anchor) {
                    anchor.href = uri;
                    anchor.title = `Open in Shiru (${animeId})`;
                    log('Updated existing anchor href to:', anchor.href);
                }
                return;
            }

            addButton(h1, uri);
        });
    }

    function addButton(h1, uri) {
        log('Adding new button for URI:', uri);

        const container = document.createElement('div');
        container.className = 'shiru-rel-link';
        container.style.cssFloat = 'right';
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.marginLeft = '16px';
        container.style.width = '16px';
        container.style.height = '16px';

        const link = document.createElement('a');
        link.className = 'link';
        link.title = 'Open in Shiru';
        link.href = uri;
        link.style.display = 'inline-flex';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
        link.style.width = '100%';
        link.style.height = '100%';

        const img = document.createElement('img');
        img.src = 'https://raw.githubusercontent.com/RockinChaos/Shiru/refs/heads/master/common/public/tray_icon_filled.png';
        img.alt = 'Shiru';
        img.style.cursor = 'pointer';
        img.style.objectFit = 'contain';
        img.style.width = '16px';
        img.style.height = '16px';
        img.style.verticalAlign = 'middle';

        link.appendChild(img);
        container.appendChild(link);
        h1.appendChild(container);

        log('Button added successfully:', container);
    }

    function waitForElement(selector, callback, retries = 0) {
        const el = document.querySelector(selector);
        if (el) {
            log(`Element found: ${selector}`);
            callback(el);
            return;
        }
        if (retries > 50) {
            log(`Timeout waiting for element: ${selector}`);
            return;
        }

        setTimeout(() => waitForElement(selector, callback, retries + 1), 150);
    }
})();

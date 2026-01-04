// ==UserScript==
// @name         Factorio Free Mods Downloader
// @namespace    https://re146.dev/
// @version      1.0
// @description  Redirects unauthorized download buttons on mods.factorio.com to re146.dev.
// @author       Keriyo
// @match        https://mods.factorio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=re146.dev/factorio/mods
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555966/Factorio%20Free%20Mods%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/555966/Factorio%20Free%20Mods%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateButtons(root = document) {
        const buttons = root.querySelectorAll('.button-green');

        buttons.forEach(button => {
            if (button.dataset.modified) return;
            if (button.innerText.trim() !== 'Download') return;

            const href = button.getAttribute('href') || '';
            if (!href.startsWith('/login?next=')) return;

            let modName = null;
            let version = null;

            const modLinkMatch = href.match(/\/mod\/([^\/]+)/);
            if (modLinkMatch) {
                modName = modLinkMatch[1];
            } else {
                const parentLink = button.closest('a');
                if (parentLink) {
                    const match = parentLink.href.match(/\/mod\/([^\/]+)/);
                    if (match) modName = match[1];
                }
            }

            if (!modName) return;

            const td = button.closest('td');
            if (td && td.parentElement && td.parentElement.children.length > 0) {
                version = td.parentElement.children[0].innerText.trim();
            }

            button.innerText = 'Download from re146.dev';
            button.setAttribute('target', '_blank');

            let newHref = `https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/${modName}`;
            if (version) newHref += `#${version}`;
            button.setAttribute('href', newHref);

            button.dataset.modified = 'true';
        });
    }

    updateButtons();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    updateButtons(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

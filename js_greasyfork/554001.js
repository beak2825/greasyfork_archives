// ==UserScript==
// @name         FurAffinity - Tags on Hover
// @namespace    Tampermonkey
// @version      2025-11-25
// @description  Shows tags as tooltip when hovering over submissions
// @author       CameronsAccount
// @match        *://*.furaffinity.net/*
// @icon         https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554001/FurAffinity%20-%20Tags%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/554001/FurAffinity%20-%20Tags%20on%20Hover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let useNewlines = GM_getValue('useNewlines', false);
    let menuCommandId = null;

    function updateTags() {
        const images = document.querySelectorAll('img[data-tags]');
        images.forEach(img => {
            const tags = img.getAttribute('data-tags');
            if (tags) {
                const formattedTags = tags.replace(/\s+/g, useNewlines ? '\n' : ', ');
                const existingTitle = img.getAttribute('title');

                if (!img.hasAttribute('data-original-title')) {
                    img.setAttribute('data-original-title', existingTitle || '');
                }

                const originalTitle = img.getAttribute('data-original-title');

                if (originalTitle) {
                    img.setAttribute('title', originalTitle + '\n\n' + formattedTags);
                } else {
                    img.setAttribute('title', formattedTags);
                }
            }
        });
    }

    function registerMenu() {
        if (menuCommandId !== null) {
            GM_unregisterMenuCommand(menuCommandId);
        }
        menuCommandId = GM_registerMenuCommand(
            useNewlines ? 'Switch to comma-separated' : 'Switch to newline-separated',
            () => {
                useNewlines = !useNewlines;
                GM_setValue('useNewlines', useNewlines);
                updateTags();
                registerMenu();
            }
        );
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'useNewlines') {
            useNewlines = GM_getValue('useNewlines', false);
            updateTags();
            registerMenu();
        }
    });

    registerMenu();
    updateTags();
})();
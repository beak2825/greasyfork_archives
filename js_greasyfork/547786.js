// ==UserScript==
// @name         GameBanana More Width for Mods on Main Page
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Removes Spotlight and expands the mod grid on the main page
// @match        https://gamebanana.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547786/GameBanana%20More%20Width%20for%20Mods%20on%20Main%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/547786/GameBanana%20More%20Width%20for%20Mods%20on%20Main%20Page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
/* Supprimer Community Spotlight */
#CommunitySpotlight, #AuxiliaryColumn { display: none !important; }

/* Forcer le layout principal en pleine largeur */
#ContentGrid {
    display: block !important;
    grid-template-columns: none !important;
    width: 100% !important;
    max-width: none !important;
}

/* Grille responsive */
.RecordsGrid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
    gap: 16px !important;
    width: 100% !important;
    max-width: none !important;
}

/* Cartes sans largeur fixe */
.Record.Flow.ModRecord {
    width: auto !important;
    max-width: none !important;
    box-sizing: border-box !important;
}
`;

    function injectCSS() {
        if (!document.getElementById('gb-fullwidth-css')) {
            const style = document.createElement('style');
            style.id = 'gb-fullwidth-css';
            style.textContent = css;
            document.documentElement.appendChild(style);
        }
    }

    function cleanInlineStyles() {
        // Remove fixed width
        document.querySelectorAll('.RecordsGrid, .Record.Flow.ModRecord').forEach(el => {
            el.removeAttribute('style');
        });
    }

    function fullFix() {
        injectCSS();
        cleanInlineStyles();
    }

    // Apply immediately
    fullFix();

    // Observe any changes and reapply
    new MutationObserver(fullFix).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    // Security: every 500ms
    setInterval(fullFix, 500);
})();

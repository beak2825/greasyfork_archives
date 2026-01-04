// ==UserScript==
// @name         Onche - Ajustement stickers favoris
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ajuste column-gap / row-gap / max-height pour les stickers, même quand le contenu est chargé dynamiquement
// @match        https://onche.org/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550967/Onche%20-%20Ajustement%20stickers%20favoris.user.js
// @updateURL https://update.greasyfork.org/scripts/550967/Onche%20-%20Ajustement%20stickers%20favoris.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS large portée (pour couvrir variantes de classes)
    const css = `
        /* selectors larges pour attraper les différentes variantes */
        div.favoriteStickers,
        .favoriteStickers,
        div[class*="favoriteSticker"] {
            column-gap: 0.3rem !important;
            row-gap: 0.3rem !important;
            max-height: 10rem !important;
            overflow-y: auto !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Fonction qui applique inline styles (utile si le site réécrit le CSS)
    function applyInline(el) {
        if (!el || !(el instanceof HTMLElement)) return;
        el.style.columnGap = '0.3rem';
        el.style.rowGap = '0.3rem';
        el.style.maxHeight = '10rem';
        el.style.overflowY = 'auto';
    }

    // Appliquer tout de suite aux éléments déjà présents
    document.querySelectorAll('div.favoriteStickers, .favoriteStickers, div[class*="favoriteSticker"]').forEach(applyInline);

    // Observer pour attraper les éléments ajoutés dynamiquement (ex: navigation vers un topic)
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                // si le noeud ajouté est lui-même un block stickers
                if (node.matches && (node.matches('div.favoriteStickers') || node.matches('.favoriteStickers') || node.matches('div[class*="favoriteSticker"]'))) {
                    applyInline(node);
                }
                // sinon chercher descendants
                const found = node.querySelectorAll && node.querySelectorAll('div.favoriteStickers, .favoriteStickers, div[class*="favoriteSticker"]');
                if (found && found.length) found.forEach(applyInline);
            }
        }
    });

    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // Optionnel : arrêter l'observer après 30s pour économiser des ressources
    setTimeout(() => observer.disconnect(), 30000);
})();

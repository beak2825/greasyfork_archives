// ==UserScript==
// @name         NoMoreDroid - Limpiador de Memedroid
// @namespace    https://memedroid.com
// @version      1.0
// @description  Elimina banners de droids y publicidad en Memedroid
// @match        https://*.memedroid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549347/NoMoreDroid%20-%20Limpiador%20de%20Memedroid.user.js
// @updateURL https://update.greasyfork.org/scripts/549347/NoMoreDroid%20-%20Limpiador%20de%20Memedroid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = [
        '#topBannerAdContainer',
        '#topBannerAd',
        '.claim-droids',
        '.droids-awaits-banner',
        'img[src*="droid-card-1.svg"]',
        'img[src*="home-banner-bg.svg"]',
    ];

    const keywords = [
        'YOUR #DROIDS AWAITS',
        'CLAIM NOW',
        'Claim Droids',
        'Reclama tus Droids',
        'Tus Droids te esperan'
    ];

    function removeDroidGarbage() {
        let removed = false;

        // Eliminar por selectores
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
                removed = true;
            });
        });

        // Eliminar por texto clave
        document.querySelectorAll('div, section, span, h3, a, p').forEach(el => {
            const text = el.innerText || '';
            if (keywords.some(k => text.includes(k))) {
                let target = el;
                for (let i = 0; i < 3; i++) {
                    if (target.parentElement) target = target.parentElement;
                }
                target.remove();
                removed = true;
            }
        });

        if (removed) {
            console.log('🛑 NoMoreDroid: banner eliminado');
        }
    }

    // Ejecutar al cargar
    removeDroidGarbage();

    // Vigilar cambios dinámicos
    const observer = new MutationObserver(removeDroidGarbage);
    observer.observe(document.body, { childList: true, subtree: true });
})();

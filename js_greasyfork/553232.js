// ==UserScript==
// @name         APIC Météo-France
// @namespace    http://tampermonkey.net/
// @version      2025-10-21
// @license      MIT
// @description  APIC Météo-France - Ajout d'un symbôle en l'absence de "Pluies prévues"
// @author       matmar
// @match        https://apic.meteofrance.fr/*
// @icon         https://apic.meteofrance.fr/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553232/APIC%20M%C3%A9t%C3%A9o-France.user.js
// @updateURL https://update.greasyfork.org/scripts/553232/APIC%20M%C3%A9t%C3%A9o-France.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addEmptySymbol = (container) => {
        if (!container) return;

        const targets = container.querySelectorAll('.img_vp1, .img_vp2');

        targets.forEach((element, index) => {
            const img = element.querySelector('img');
            if (!img) return;

            const text = `${img.src} ${img.alt}`.toLowerCase();
            if (!text.includes('pas de pluie')) return;

            element.style.position = 'relative';
            const symbol = document.createElement('div');
            symbol.className = 'empty-symbol';
            Object.assign(symbol.style, {
                position: 'absolute',
                top: '3px',
                left: index === 0 ? '11px' : '36px',
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#0044ff',
                pointerEvents: 'none',
                userSelect: 'none'
            });
            symbol.textContent = 'Ø';
            element.appendChild(symbol);
        });
    };

    const waitForLeafletMap = (callback) => {
        const check = () => {
            if (window.map instanceof L.Map) {
                callback(window.map);
            } else {
                requestAnimationFrame(check);
            }
        };
        check();
    };

    waitForLeafletMap((map) => {
        map.on('popupopen', (e) => {
            const popupEl = e.popup.getElement();
            if (!popupEl) return;
            const observer = new MutationObserver((mutations, obs) => {
                if (popupEl.querySelector('.img_vp1') && popupEl.querySelector('.img_vp2')) {
                    addEmptySymbol(popupEl);
                    obs.disconnect();
                }
            });
            observer.observe(popupEl, { childList: true, subtree: true });
        });
    });
})();
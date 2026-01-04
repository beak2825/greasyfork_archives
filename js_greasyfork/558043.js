// ==UserScript==
// @name         MangaPark Broken Image Fix (s01 server)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace s02..s10.mp* par s01.mp* pour les images qui ne chargent pas sur MangaPark
// @author       Toi + GPT
// @match        *://mangapark.net/*
// @match        *://mangapark.org/*
// @match        *://mangapark.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558043/MangaPark%20Broken%20Image%20Fix%20%28s01%20server%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558043/MangaPark%20Broken%20Image%20Fix%20%28s01%20server%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const badServers = ['s02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'];

    function replaceServersInString(str) {
        if (!str) return str;
        let newStr = str;
        badServers.forEach(s => {
            // remplace juste le début https://s0X.mp par https://s01.mp
            newStr = newStr.replace(`https://${s}.mp`, 'https://s01.mp');
        });
        return newStr;
    }

    function fixImg(img) {
        if (!img) return;

        // src direct
        if (img.src) {
            const fixed = replaceServersInString(img.src);
            if (fixed !== img.src) img.src = fixed;
        }

        // attributs de lazy-load fréquents
        const lazyAttrs = ['data-src', 'data-original', 'data-lazy'];
        lazyAttrs.forEach(attr => {
            const val = img.getAttribute(attr);
            if (!val) return;
            const fixed = replaceServersInString(val);
            if (fixed !== val) img.setAttribute(attr, fixed);
        });

        // srcset (plusieurs URLs)
        const srcsetAttrs = ['srcset', 'data-srcset'];
        srcsetAttrs.forEach(attr => {
            const val = img.getAttribute(attr);
            if (!val) return;

            const fixed = val
                .split(',')
                .map(part => {
                    const trimmed = part.trim();
                    if (!trimmed) return trimmed;
                    const bits = trimmed.split(/\s+/); // "url 1x"
                    bits[0] = replaceServersInString(bits[0]);
                    return bits.join(' ');
                })
                .join(', ');

            if (fixed !== val) img.setAttribute(attr, fixed);
        });
    }

    function fixAllImages(root = document) {
        const imgs = root.querySelectorAll('img');
        imgs.forEach(fixImg);
    }

    // 1) Au chargement de la page
    fixAllImages();

    // 2) Quand de nouveaux éléments apparaissent (scroll, changement de chapitre, etc.)
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;

                if (node.tagName === 'IMG') {
                    fixImg(node);
                } else {
                    fixAllImages(node);
                }
            });
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Option debug : déscommente si tu veux vérifier que le script tourne
    // console.log('[MangaPark Fix] Script actif, images traitées:', document.images.length);
})();
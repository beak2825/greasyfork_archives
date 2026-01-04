// ==UserScript==
// @name         Auto click "Claim free cheese"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click the claim cheese button on cheddar.tv
// @match        *://cheddar.tv/*
// @grant        none
// @author       Dwarrel
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552674/Auto%20click%20%22Claim%20free%20cheese%22.user.js
// @updateURL https://update.greasyfork.org/scripts/552674/Auto%20click%20%22Claim%20free%20cheese%22.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const P_TEXT = 'claim free cheese';
    const BUTTON_TEXT = 'claim';

    const CLICKED_ATTR = 'data-auto-claimed';

    const CLICK_DELAY_MS = 150;

    function textMatches(node, target) {
        if (!node || !node.textContent) return false;
        return node.textContent.trim().toLowerCase().includes(target.toLowerCase());
    }

    function findClaimButtonNear(pEl) {
        // 1) direct sibling buttons
        let btns = Array.from(pEl.parentElement.querySelectorAll('button'));
        for (const b of btns) {
            if (textMatches(b, BUTTON_TEXT)) return b;
        }

        let ancestor = pEl.parentElement;
        for (let i = 0; i < 3 && ancestor; i++) { // tot 3 niveaus omhoog
            const candidate = Array.from(ancestor.querySelectorAll('button'));
            for (const b of candidate) {
                if (textMatches(b, BUTTON_TEXT)) return b;
            }
            ancestor = ancestor.parentElement;
        }

        const global = Array.from(document.querySelectorAll('button'));
        for (const b of global) {
            if (textMatches(b, BUTTON_TEXT)) return b;
        }

        return null;
    }

    function clickElementOnce(el) {
        if (!el) return false;
        if (el.getAttribute && el.getAttribute(CLICKED_ATTR) === '1') return false;
        setTimeout(() => {
            try {
                el.click();
                el.setAttribute(CLICKED_ATTR, '1');
                console.log('Auto-claimed element clicked:', el);
            } catch (e) {
                console.warn('Kon niet klikken op element:', e);
            }
        }, CLICK_DELAY_MS);
        return true;
    }

    function handlePotentialClaim(pEl) {
        if (!pEl) return;
        if (!textMatches(pEl, P_TEXT)) return;

        const btn = findClaimButtonNear(pEl);
        if (btn) {
            clickElementOnce(btn);
            return true;
        }
        return false;
    }

    function scanExisting() {
        const pList = Array.from(document.querySelectorAll('p'));
        for (const p of pList) {
            handlePotentialClaim(p);
        }
    }

    function startObserver() {
        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                // nieuwe nodes toegevoegd
                if (m.addedNodes && m.addedNodes.length) {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        // als het zelf een <p> is
                        if (node.tagName && node.tagName.toLowerCase() === 'p') {
                            handlePotentialClaim(node);
                        }

                        const insidePs = node.querySelectorAll ? node.querySelectorAll('p') : [];
                        insidePs.forEach(p => handlePotentialClaim(p));
                    });
                }
            }
        });

        mo.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start
    scanExisting();
    startObserver();

})();

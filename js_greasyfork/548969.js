// ==UserScript==
// @name         run!run!run!cw
// @namespace    http://tampermonkey.net/
// @version      2025-09-10
// @description  run baby run
// @author       shinexe
// @match        https://catwar.net/cw3/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548969/run%21run%21run%21cw.user.js
// @updateURL https://update.greasyfork.org/scripts/548969/run%21run%21run%21cw.meta.js
// ==/UserScript==



(function () {
    'use strict';

    const OVERLAY = 'https://i.ibb.co/pBX54VKX/wow.png';
    const SHOW_PERCENT = 15;   // включение
    const HIDE_PERCENT = 70;   // выключение
    const POLL_MS = 50;

    const overlayState = {};

function applyOverlay(el) {
    if (!el) return;

    if (el.dataset.hasWow) return; 

    el.dataset.hasWow = "true"; 

    if (!document.getElementById("wow-style")) {
        const style = document.createElement("style");
        style.id = "wow-style";
        style.textContent = `
            [data-has-wow="true"]::before {
                content: "";
                position: absolute;
                inset: 0;
                background-image: url("${OVERLAY}");
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                pointer-events: none;
                z-index: -1; /* Кладём позади кота */
            }
        `;
        document.head.appendChild(style);
    }

    if (getComputedStyle(el).position === "static") {
        el.style.position = "relative";
    }
}

function removeOverlay(el) {
    if (!el) return;
    if (!el.dataset.hasWow) return;

    delete el.dataset.hasWow;
}


    function processCat(cage) {
        const green = cage.querySelector('.arrow_green');
        const catBg = cage.querySelector('.cat .first');
        const catLink = cage.querySelector('.cat_tooltip a[href^="/cat"]');

        if (!green || !catBg || !catLink) return;

        const catId = catLink.getAttribute('href'); 
        const greenWidth = green.getBoundingClientRect().width;
        const totalWidth = green.parentElement.getBoundingClientRect().width;
        const percent = (greenWidth / totalWidth) * 100;

        const currentState = overlayState[catId] || false;

        if (percent < SHOW_PERCENT && !currentState) {
            overlayState[catId] = true;
        } else if (percent > HIDE_PERCENT && currentState) {
            overlayState[catId] = false;
        }
        
        if (overlayState[catId]) {
            applyOverlay(catBg);
        } else {
            removeOverlay(catBg);
        }
    }

    function updateCats() {
        document.querySelectorAll('.cage_items').forEach(processCat);
    }

    setInterval(updateCats, POLL_MS);

    const observer = new MutationObserver(() => updateCats());
    observer.observe(document.body, { childList: true, subtree: true });

    updateCats();
})();

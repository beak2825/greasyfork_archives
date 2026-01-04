// ==UserScript==
// @name         MaruMori OwO
// @namespace    http://marumori.io/
// @version      1.1.1
// @license      WTFPL
// @description  Replaces the typical 0/0 display with an OwO. Why not.
// @author       Eearslya Sleiarion
// @match        https://marumori.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554815/MaruMori%20OwO.user.js
// @updateURL https://update.greasyfork.org/scripts/554815/MaruMori%20OwO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const update = (home) => {
        if (home === null) { return; }

        const countCards = Array.from(home.querySelectorAll(".counts .lessons-reviews-card .item"));
        if (countCards.length < 2) { return; }
        for (const countCard of countCards) {
            const spans = countCard.querySelectorAll(".title span");
            const lessonCount = parseInt(spans[0].innerText);
            const reviewCount = parseInt(spans[2].innerText);
            if (lessonCount == 0 && reviewCount == 0) {
                spans[1].innerText = "ω";
                spans[1].style.textTransform = "none";
                spans[1].style.fontFamily = "sans-serif";
            }
        }
    };

    const setupCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType == 1 && node.classList.contains("home-wrapper")) {
                    update(node);
                }
            }
        }
    };

    const observer = new MutationObserver(setupCallback);
    observer.observe(document.getElementById("svelte"), { childList: true, subtree: true });
})();
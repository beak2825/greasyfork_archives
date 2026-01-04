// ==UserScript==
// @name         Roku Channel Enhancer
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Auto-skip intro/recap, remove ad dots, and auto-watch next
// @match        https://therokuchannel.roku.com/*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554684/Roku%20Channel%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/554684/Roku%20Channel%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoSkip = GM_getValue('autoSkip', true);
    let removeDots = GM_getValue('removeDots', true);
    let autoNext = GM_getValue('autoNext', true);

    GM_registerMenuCommand(`Auto Skip Intro/Recap: ${autoSkip ? 'ON' : 'OFF'}`, () => {
        autoSkip = !autoSkip;
        GM_setValue('autoSkip', autoSkip);
        location.reload();
    });

    GM_registerMenuCommand(`Auto Watch Next: ${autoNext ? 'ON' : 'OFF'}`, () => {
        autoNext = !autoNext;
        GM_setValue('autoNext', autoNext);
        location.reload();
    });

    GM_registerMenuCommand(`Remove Ad Dots: ${removeDots ? 'ON' : 'OFF'}`, () => {
        removeDots = !removeDots;
        GM_setValue('removeDots', removeDots);
        location.reload();
    });

    const skipKeywords = [
        "Skip Introduction",
        "Skip Intro",
        "Skip intro",
        "SKIP INTRO",
        "SKIP INTRODUCTION",
        "Skip Recap",
        "SKIP RECAP"
    ];

    function lookForSkipButton() {
        if (!autoSkip) return;
        const buttons = document.querySelectorAll("button, div, span");
        for (const b of buttons) {
            if (!b.innerText) continue;
            const t = b.innerText.trim();
            if (skipKeywords.includes(t)) {
                b.click();
            }
        }
    }

    function removeAdDots() {
        if (!removeDots) return;
        const markers = document.querySelectorAll('.vjs-marker');
        markers.forEach(marker => {
            if (marker.dataset.markerKey) {
                marker.remove();
            }
        });
    }

    function clickWatchNext() {
        if (!autoNext) return;
        const buttons = document.querySelectorAll("button");
        buttons.forEach(btn => {
            const div = btn.querySelector("div");
            if (div && div.innerText.trim() === "Watch next") {
                btn.click();
            }
        });
    }

    setInterval(lookForSkipButton, 500);
    setInterval(removeAdDots, 1000);
    setInterval(clickWatchNext, 1000);

    const observer = new MutationObserver(() => {
        removeAdDots();
        lookForSkipButton();
        clickWatchNext();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();

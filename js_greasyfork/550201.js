// ==UserScript==
// @name         Scratch Costume Editor Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes the stupid bug where you cant edit costumes correctly in Scratch.
// @match        https://scratch.mit.edu/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550201/Scratch%20Costume%20Editor%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/550201/Scratch%20Costume%20Editor%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickBtn(label) {
        const btn = document.querySelector(`[aria-label="${label}"]`);
        if (btn) btn.click();
    }

    function runFix() {
        console.log("[ScratchFix] Running sequence...");
        clickBtn("Copy");
        setTimeout(() => {
            clickBtn("Convert to Bitmap");
            setTimeout(() => {
                clickBtn("Delete");
                setTimeout(() => {
                    clickBtn("Convert to Vector");
                    setTimeout(() => {
                        clickBtn("Paste");
                    }, 400);
                }, 400);
            }, 400);
        }, 400);
    }

    // watch for switching/selecting costumes
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.target && m.target.closest && m.target.closest('.costumes-panel')) {
                runFix();
                break;
            }
        }
    });

    function startObserver() {
        const panel = document.querySelector('.costumes-panel');
        if (panel) {
            observer.observe(panel, { childList: true, subtree: true });
            console.log("[ScratchFix] Watching costume panel.");
        } else {
            setTimeout(startObserver, 1000);
        }
    }

    startObserver();
})();

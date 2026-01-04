// ==UserScript==
// @name         Grinch-Lite
// @namespace    rdrama.net
// @version      0.0.0.0.2
// @description  Start all HTML5 audio sources at 1%
// @match        https://rdrama.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557619/Grinch-Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/557619/Grinch-Lite.meta.js
// ==/UserScript==


(function() {
    const setVol = el => {
        if (el && el.volume !== 0.01) {
            el.volume = 0.01;
        }
    };

    document.querySelectorAll("audio").forEach(setVol);

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.tagName === "AUDIO") {
                    setVol(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll("audio").forEach(setVol);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
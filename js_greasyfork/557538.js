// ==UserScript==
// @name         Stop YouTube autoplay
// @author       ChatGPT
// @description  Temporary vibe-coded solution to YouTube's autoplay anti-feature because the extensions broke.
// @match        https://www.youtube.com/*
// @version      1.0
// @run-at       document-end
// @namespace https://greasyfork.org/users/1335395
// @downloadURL https://update.greasyfork.org/scripts/557538/Stop%20YouTube%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/557538/Stop%20YouTube%20autoplay.meta.js
// ==/UserScript==

//This code is in the public domain because it is the work of a computer algorithm, large language model or artificial intelligence
//and does not contain sufficient human authorship to support a copyright claim. In countries or regions that do not recognize
//the public domain, it is made available under the Creative Commons CC0 1.0 Universal Public Domain Dedication.


(function () {
    const label = "Cancel autoplay"; // set this to the aria-label text

    function isVisibleDeep(el) {
        let node = el;
        while (node && node !== document.body) {
            const style = window.getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            if (
                style.display === "none" ||
                style.visibility === "hidden" ||
                rect.width === 0 ||
                rect.height === 0
            ) {
                return false;
            }
            node = node.parentElement;
        }
        return true;
    }

    function tryClick() {
        const btn = document.querySelector(`[aria-label="${label}"]`);
        if (btn && isVisibleDeep(btn)) {
            btn.click();
            return true;
        }
        return false;
    }

    if (tryClick()) return;

    const observer = new MutationObserver(() => {
        if (tryClick()) observer.disconnect();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();

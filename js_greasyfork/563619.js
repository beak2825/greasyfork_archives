// ==UserScript==
// @name         Reduce Animations & CPU Usage
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Tắt animation, transition, hiệu ứng để giảm tải CPU trên mọi trang web
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563619/Reduce%20Animations%20%20CPU%20Usage.user.js
// @updateURL https://update.greasyfork.org/scripts/563619/Reduce%20Animations%20%20CPU%20Usage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function disableAnimations() {
        const style = document.createElement('style');
        style.innerHTML = `
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // chạy khi trang load
    disableAnimations();

    // chạy lại nếu web load động (SPA)
    const observer = new MutationObserver(() => {
        disableAnimations();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

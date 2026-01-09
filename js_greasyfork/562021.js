// ==UserScript==
// @name         Marumori – Blur Reading Story During Reviews
// @namespace    https://marumori.io/
// @version      1.0
// @description  Blur reading stories during reviews; click to unblur
// @match        https://marumori.io/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @run-at       document-idle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/562021/Marumori%20%E2%80%93%20Blur%20Reading%20Story%20During%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/562021/Marumori%20%E2%80%93%20Blur%20Reading%20Story%20During%20Reviews.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const REVIEW_PATH = '/study-lists/review';
    let lastUrl = location.href;
    let observer = null;

    /* ---------------- CSS ---------------- */

    const STYLE_ID = 'mm-blur-reading-style';

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            .mm-blur-reading {
                filter: blur(8px) !important;
                cursor: pointer;
            }

            .mm-blur-reading * {
                filter: blur(8px) !important;
            }

            .mm-blur-reading.mm-unblurred {
                filter: none !important;
            }

            .mm-blur-reading.mm-unblurred * {
                filter: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function removeStyle() {
        const style = document.getElementById(STYLE_ID);
        if (style) style.remove();
    }

    /* ---------------- BLUR LOGIC ---------------- */

    function applyBlur() {
        injectStyle();

        document
            .querySelectorAll('.story-wrapper .description-wrapper')
            .forEach(el => {
                el.classList.add('mm-blur-reading');
                el.classList.remove('mm-unblurred'); // reset on re-render
            });
    }

    function removeBlur() {
        document
            .querySelectorAll('.mm-blur-reading')
            .forEach(el => {
                el.classList.remove('mm-blur-reading', 'mm-unblurred');
            });

        removeStyle();
    }

    /* ---------------- CLICK TO TOGGLE ---------------- */

    function handleClick(e) {
        if (!location.href.includes(REVIEW_PATH)) return;

        const story = e.target.closest('.story-wrapper .description-wrapper');
        if (!story) return;

        if (!story.classList.contains('mm-blur-reading')) return;

        story.classList.toggle('mm-unblurred');
    }

    document.addEventListener('click', handleClick, true);

    /* ---------------- MUTATION OBSERVER ---------------- */

    function startObserver() {
        if (observer) return;

        observer = new MutationObserver(() => {
            if (location.href.includes(REVIEW_PATH)) {
                applyBlur();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function stopObserver() {
        if (!observer) return;
        observer.disconnect();
        observer = null;
    }

    /* ---------------- ROUTING ---------------- */

    function route(url) {
        if (url.includes(REVIEW_PATH)) {
            startObserver();
            applyBlur();
        } else {
            stopObserver();
            removeBlur();
        }
    }

    /* ---------------- SPA URL WATCHER ---------------- */

    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            route(lastUrl);
        }
    }, 300);

    // Initial run
    route(location.href);
})();

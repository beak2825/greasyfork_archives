// ==UserScript==
// @name         Auto Hide Header On Scroll for Facebook
// @namespace    https://github.com/livinginpurple
// @version      0.20251201.7
// @description  Scroll down to hide, scroll up to show. Fix clickable issue by removing Z-Index hacks.
// @license      WTFPL
// @author       livinginpurple
// @match        *://www.facebook.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559210/Auto%20Hide%20Header%20On%20Scroll%20for%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/559210/Auto%20Hide%20Header%20On%20Scroll%20for%20Facebook.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delta = 5;
    let lastScrollTop = 0;
    let navbarHeight = 0;
    let ticking = false;
    let header = null;

    function initialHidingHeader() {
        const target = document.querySelector('[role="banner"]');

        if (target) {
            header = target;
            init();
        } else {
            setTimeout(initialHidingHeader, 300);
        }
    }

    function init() {
        console.log(`${GM_info.script.name}: v${GM_info.script.version} (Touch Fix)`);

        header.style.transition = 'transform 0.3s ease-in-out';
        navbarHeight = header.offsetHeight;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                navbarHeight = entry.target.offsetHeight;
            }
        });
        resizeObserver.observe(header);

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    }

    function updateHeader() {
        const scrollTop = window.scrollY;
        
        if (scrollTop < 0) return;
        if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

        if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
            // [向下捲動 -> 隱藏]
            header.style.transform = 'translateY(-100%)';
        } else {
            // [向上捲動 -> 顯示]
            header.style.transform = '';
        }

        lastScrollTop = scrollTop;
    }

    initialHidingHeader();
})();
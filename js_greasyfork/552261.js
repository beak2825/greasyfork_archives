// ==UserScript==
// @name         ENTAME Next Hide Header Until Top
// @namespace    https://entamenext.com/
// @version      1.2
// @description  Hide fixed header when scrolling down, only show again at very top
// @match        https://entamenext.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552261/ENTAME%20Next%20Hide%20Header%20Until%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/552261/ENTAME%20Next%20Hide%20Header%20Until%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nav = document.querySelector('.ent_nav-fixed');
    const sns = document.querySelector('.ent_sns-fixed');
    if (!nav && !sns) return;

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll === 0) {
            // 在頂部，顯示
            if (nav) nav.style.transform = 'translateY(0)';
            if (sns) sns.style.transform = 'translateY(0)';
        } else {
            // 離開頂部，隱藏
            if (nav) nav.style.transform = 'translateY(-100%)';
            if (sns) sns.style.transform = 'translateY(-100%)';
        }
    });

    // 加上平滑過渡
    const style = document.createElement('style');
    style.textContent = `
        .ent_nav-fixed, .ent_sns-fixed {
            transition: transform 0.3s ease-in-out;
            will-change: transform;
        }
    `;
    document.head.appendChild(style);
})();

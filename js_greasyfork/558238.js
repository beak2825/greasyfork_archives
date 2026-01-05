// ==UserScript==
// @name         Bilibili首页快捷键 (R键刷新 + Alt数字键打开视频)
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  R键点击“换一换”；Alt+1~10点击首页对应的视频卡片。
// @author       User
// @match        https://www.bilibili.com/
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558238/Bilibili%E9%A6%96%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE%20%28R%E9%94%AE%E5%88%B7%E6%96%B0%20%2B%20Alt%E6%95%B0%E5%AD%97%E9%94%AE%E6%89%93%E5%BC%80%E8%A7%86%E9%A2%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558238/Bilibili%E9%A6%96%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE%20%28R%E9%94%AE%E5%88%B7%E6%96%B0%20%2B%20Alt%E6%95%B0%E5%AD%97%E9%94%AE%E6%89%93%E5%BC%80%E8%A7%86%E9%A2%91%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname !== 'www.bilibili.com' ||
        window.location.pathname !== '/' ||
        window.location.search !== '' ||
        window.location.hash !== '') {
        return;
    }

    document.addEventListener('keydown', function(e) {

        const active = document.activeElement;
        if (active && (
            active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.tagName === 'SELECT' ||
            active.isContentEditable
        )) {
            return;
        }

        if ((e.code === 'KeyR' || e.key === 'r' || e.key === 'R') &&
            !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {

            const btn = document.querySelector('.feed-roll-btn .primary-btn.roll-btn');
            if (btn) {
                btn.click();
            }
            return;
        }

        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            const key = parseInt(e.key);

            if (!isNaN(key) && key >= 1 && key <= 10) {
                e.preventDefault();
                const wrapArr = document.querySelectorAll('.bili-video-card__wrap');

                let cardContainer = wrapArr[key]; // 0是无效盒子
                

                // let row = key <= 3 ? 1 : 2;
                // let col = key <= 3 ? key : key - 3;

                // let selectorAttr = `${row}-${col}`; // 例如 "1-1" 或 "2-3"

                // const cardContainer = document.querySelector(`.bili-feed-card[data-feed-card-row-col="${selectorAttr}"]`);

                if (cardContainer) {
                    const targetLink = cardContainer.querySelector('a.bili-video-card__image--link') || cardContainer.querySelector('a');

                    if (targetLink) {
                        targetLink.click();
                    } else {
                        console.log(`未找到位置 ${selectorAttr} 的链接`);
                    }
                } else {
                    console.log(`未找到位置 ${selectorAttr} 的视频卡片`);
                }
            }
        }
    });
})();
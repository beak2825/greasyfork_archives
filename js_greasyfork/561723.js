// ==UserScript==
// @name         无聊图一键滚动置顶 + 最大化（回归老版点图逻辑！）
// @namespace    https://tampermonkey.net/
// @version      1.4.2
// @description  点击图片后一键滚动到窗口顶部 + 等比放大
// @match        https://jandan.net/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561723/%E6%97%A0%E8%81%8A%E5%9B%BE%E4%B8%80%E9%94%AE%E6%BB%9A%E5%8A%A8%E7%BD%AE%E9%A1%B6%20%2B%20%E6%9C%80%E5%A4%A7%E5%8C%96%EF%BC%88%E5%9B%9E%E5%BD%92%E8%80%81%E7%89%88%E7%82%B9%E5%9B%BE%E9%80%BB%E8%BE%91%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561723/%E6%97%A0%E8%81%8A%E5%9B%BE%E4%B8%80%E9%94%AE%E6%BB%9A%E5%8A%A8%E7%BD%AE%E9%A1%B6%20%2B%20%E6%9C%80%E5%A4%A7%E5%8C%96%EF%BC%88%E5%9B%9E%E5%BD%92%E8%80%81%E7%89%88%E7%82%B9%E5%9B%BE%E9%80%BB%E8%BE%91%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const IMG_ACTIVE = 'tm-img-active';
    const BOX_ACTIVE = 'tm-comment-active';

    function injectStyle() {
        if (document.getElementById('tm-img-style')) return;

        const style = document.createElement('style');
        style.id = 'tm-img-style';
        style.textContent = `
            .comment-content img.${IMG_ACTIVE} {
                display: block !important;
                width: auto !important;
                height: auto !important;
                max-width: 100% !important;
                max-height: none !important;
                object-fit: contain !important;
                margin: 0 auto;
                img.style.cursor = 'pointer';
                z-index: 999;
                position: relative;
            }

            .comment-content.${BOX_ACTIVE} {
                display: block !important;
                height: auto !important;
                max-height: none !important;
                overflow: visible !important;
                align-items: initial !important;
            }
        `;
        document.documentElement.appendChild(style);
    }

    injectStyle();

    document.addEventListener('click', function (e) {
        const img = e.target instanceof HTMLImageElement
            ? e.target
            : e.target.closest('img');

        if (!img) return;

        const box = img.closest('.comment-content');
        if (!box) return;

        e.stopPropagation();
        e.preventDefault();

        const active = img.classList.toggle(IMG_ACTIVE);

        const hasActiveImg = box.querySelector(`img.${IMG_ACTIVE}`);
        box.classList.toggle(BOX_ACTIVE, !!hasActiveImg);

        if (active) {
            const rect = img.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            window.scrollTo({
                top: rect.top + scrollTop,
                behavior: 'smooth'
            });
        }
    }, true);
})();

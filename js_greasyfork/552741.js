// ==UserScript==
// @name         腾讯乐享去水印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉随机类名的隐/明水印背景
// @author       LzSkyline
// @match        https://lexiangla.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552741/%E8%85%BE%E8%AE%AF%E4%B9%90%E4%BA%AB%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552741/%E8%85%BE%E8%AE%AF%E4%B9%90%E4%BA%AB%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targets = [
        'https://lexiangla.com/yapi/v1/staff/hidden-watermark',
        'https://lexiangla.com/yapi/v1/staff/watermark'
    ];

    GM_addStyle(`
          [style*="${targets[0]}"],
          [style*="${targets[1]}"] {
              background-image: none !important;
              opacity: 0 !important;
              pointer-events: none !important;
          }
      `);

    const clearWatermark = (node) => {
        if (!(node instanceof HTMLElement)) return;

        const wipe = (el) => {
            if (!(el instanceof HTMLElement)) return;
            const bg = el.style.backgroundImage || '';
            if (targets.some(url => bg.includes(url))) {
                el.style.setProperty('background-image', 'none', 'important');
                el.style.setProperty('opacity', '0', 'important');
                el.style.setProperty('pointer-events', 'none', 'important');
            }
        };

        wipe(node);
        node.querySelectorAll('[style]').forEach(wipe);
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[style]').forEach(clearWatermark);
    });

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
                clearWatermark(mutation.target);
            }
            mutation.addedNodes.forEach(clearWatermark);
        }
    });

    observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['style']
    });
})();
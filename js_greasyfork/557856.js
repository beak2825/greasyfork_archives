// ==UserScript==
// @name         XDA Ads Remover (AdsNinja Blocker)
// @namespace    https://xdaforums.com/
// @version      1.0
// @license      MIT
// @description  Remove AdsNinja and Google Ads on XDA Forums
// @author       Owen
// @match        https://xdaforums.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557856/XDA%20Ads%20Remover%20%28AdsNinja%20Blocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557856/XDA%20Ads%20Remover%20%28AdsNinja%20Blocker%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS 屏蔽（最快）
    const hideCSS = `
        .adsninja-ad-zone,
        [id*="adsninja"],
        .ad-zone-container,
        .ad-zone,
        .ad-zone-inline,
        .ad-current,
        [id^="google_ads"],
        [id*="google_ads"],
        [id*="googletag"],
        .ad-container,
        .ad--container,
        .advertisement {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            min-height: 0 !important;
        }
    `;

    const style = document.createElement("style");
    style.textContent = hideCSS;
    document.documentElement.appendChild(style);

    // 移除广告节点函数
    function removeAds(root = document) {
        const selectors = [
            '.adsninja-ad-zone',
            '[id*="adsninja"]',
            '.ad-zone-container',
            '.ad-zone',
            '.ad-zone-inline',
            '.ad-current',
            '[id^="google_ads"]',
            '[id*="google_ads"]',
            '[id*="googletag"]',
            '.advertisement'
        ];

        selectors.forEach(sel => {
            root.querySelectorAll(sel).forEach(el => {
                el.remove();
            });
        });
    }

    // 监听页面动态变化（XDA 动态加载广告）
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.addedNodes.length) removeAds(m.target);
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 初次运行
    removeAds();
})();

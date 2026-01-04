// ==UserScript==
// @name         Poki 零广告 + 强制奖励 (最终版 2025)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  poki.com 零广告 + 强制拿奖励（伪装adsBlocked false）
// @author       Grok
// @match        https://poki.com/*
// @match        https://poki.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559505/Poki%20%E9%9B%B6%E5%B9%BF%E5%91%8A%20%2B%20%E5%BC%BA%E5%88%B6%E5%A5%96%E5%8A%B1%20%28%E6%9C%80%E7%BB%88%E7%89%88%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559505/Poki%20%E9%9B%B6%E5%B9%BF%E5%91%8A%20%2B%20%E5%BC%BA%E5%88%B6%E5%A5%96%E5%8A%B1%20%28%E6%9C%80%E7%BB%88%E7%89%88%202025%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏广告元素
    const adStyle = document.createElement('style');
    adStyle.textContent = `
        iframe[src*="ads"], iframe[src*="ad"], 
        div[class*="ad"], div[id*="ad"], div[class*="Ad"], 
        .poki-ad, .commercial-break, .ad-container, 
        .advertisement, .poki-gpt-ad, [data-poki-ad],
        .ad-break, .rewarded-ad, #poki-ads,
        .interstitial, .overlay-ad, .banner-ad {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(adStyle);

    // 延迟hook，等PokiSDK加载后再伪装
    const hookSDK = () => {
        if (!window.PokiSDK) return setTimeout(hookSDK, 100);

        const originalSDK = window.PokiSDK;

        window.PokiSDK = new Proxy(originalSDK, {
            get: function(target, prop) {
                if (prop === 'rewardedBreak') {
                    return function(preCallback) {
                        if (typeof preCallback === 'function') preCallback();
                        console.log('强制奖励：直接成功！');
                        return Promise.resolve(true);
                    };
                }
                if (prop === 'commercialBreak') {
                    return function(preCallback) {
                        if (typeof preCallback === 'function') preCallback();
                        return Promise.resolve();
                    };
                }
                if (prop === 'adsBlocked') {
                    return () => false;  // 伪装没有屏蔽广告
                }
                return target[prop];
            }
        });

        console.log('PokiSDK 已成功hook + 伪装无广告屏蔽！');
    };

    hookSDK();
})();
// ==UserScript==
// @name         去TM的视频暂停广告
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  脚本功能是模拟鼠标点击关闭按钮，适配某艺，某酷，某讯，某果。如果脚本失效请反馈，如有需要适配其他视频站点请留言。此脚本仅限学习交流使用，不作其他用途。
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://v.youku.com/*
// @match        *://*.qq.com/*
// @match        *://v.qq.com/*
// @match        *://*.mgtv.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554706/%E5%8E%BBTM%E7%9A%84%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/554706/%E5%8E%BBTM%E7%9A%84%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        checkInterval: 500,
        throttleDelay: 300,
        maxCacheSize: 100
    };

    const SELECTORS = {
        iqiyi: ['.pause-max-close-btn'],
        youku: ['.ad-fullscreen-close', '.ad-close', '.historyrecord_adcolsebtn'],
        tencent: ['.txp_full_screen_pause-close'],
        mgtv: ['.mgtv-popup-close', '.mgtv-ad-close', '.pause-close-btn'],
        common: ['.ad-close', '.popup-close', '.modal-close', '.dialog-close']
    };

    const processed = new Set();
    let timer;

    // 工具函数
    const throttle = (fn, delay) => {
        let last = 0;
        return (...args) => {
            const now = Date.now();
            if (now - last >= delay) {
                fn(...args);
                last = now;
            }
        };
    };

    const isVisible = el => el?.offsetParent &&
                          el.getBoundingClientRect().width > 0 &&
                          getComputedStyle(el).visibility !== 'hidden';

    const safeClick = el => {
        if (!el || processed.has(el)) return false;

        el.click();
        processed.add(el);

        if (processed.size > CONFIG.maxCacheSize) {
            processed.delete(processed.keys().next().value);
        }

        return true;
    };

    const getPlatform = () => {
        const { hostname } = location;
        if (hostname.includes('iqiyi')) return 'iqiyi';
        if (hostname.includes('youku')) return 'youku';
        if (hostname.includes('v.qq')) return 'tencent';
        if (hostname.includes('mgtv')) return 'mgtv';
        return 'common';
    };

    // 核心功能
    const closeAds = throttle(() => {
        const platform = getPlatform();
        const selectors = [...SELECTORS.common, ...(SELECTORS[platform] || [])];

        [...new Set(selectors)].forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (isVisible(el)) safeClick(el);
            });
        });
    }, CONFIG.throttleDelay);

    // 生命周期管理
    const start = () => {
        stop();
        timer = setInterval(closeAds, CONFIG.checkInterval);
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const stop = () => {
        clearInterval(timer);
        observer.disconnect();
    };

    const cleanup = () => {
        stop();
        processed.clear();
    };

    // 观察器
    const observer = new MutationObserver(closeAds);

    // 初始化
    const init = () => {
        start();
        addEventListener('beforeunload', cleanup);
        addEventListener('visibilitychange', () => document.hidden ? stop() : start());
        setTimeout(closeAds, 1000);
    };

    // 启动
    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
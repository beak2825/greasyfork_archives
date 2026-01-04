// ==UserScript==
// @name         禁止B站自动唤起APP
// @description  防止手机端在搜索引擎点击B站文章时自动跳转手机APP
// @namespace    notLoadBilibiliAppAtArticleStartup
// @match        *://m.bilibili.com/*
// @match        *://www.bilibili.com/opus/*
// @run-at       document-start
// @grant        none
// @license      GNU GPLv3
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/560504/%E7%A6%81%E6%AD%A2B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%94%A4%E8%B5%B7APP.user.js
// @updateURL https://update.greasyfork.org/scripts/560504/%E7%A6%81%E6%AD%A2B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%94%A4%E8%B5%B7APP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(handler, delay, ...args) {
        if (typeof handler === 'function') {
            const code = handler.toString();
            if (code.includes('bilibili://') || code.includes('autoOpenApp') || code.includes('useH5awaken')) {
                console.log('✅ 已成功拦截 B 站自动唤起 App 的延迟任务');
                return -1;
            }
        }
        return originalSetTimeout.call(window, handler, delay, ...args);
    };
})();
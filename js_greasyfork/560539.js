// ==UserScript==
// @name         PoE 2 镜像站自动重定向 (易刷套用)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动将 Mobalytics(poe2) 和所有 poe.ninja 页面重定向到国内镜像站
// @author       Gemini帮我写的
// @license      MIT
// @match        *://mobalytics.gg/poe-2*
// @match        *://*.poe.ninja/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560539/PoE%202%20%E9%95%9C%E5%83%8F%E7%AB%99%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%20%28%E6%98%93%E5%88%B7%E5%A5%97%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560539/PoE%202%20%E9%95%9C%E5%83%8F%E7%AB%99%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%20%28%E6%98%93%E5%88%B7%E5%A5%97%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // 规则 1: Mobalytics 重定向 (仅限 poe-2 相关路径)
    if (currentUrl.includes('mobalytics.gg/poe-2')) {
        const newUrl = currentUrl.replace('mobalytics.gg/poe-2', 'mobagg.710421059.xyz/poe-2');
        window.location.replace(newUrl);
    }

    // 规则 2: PoE Ninja 重定向 (只要包含 poe.ninja 就跳转)
    // 逻辑：匹配任何子域名，并直接将域名部分替换为镜像地址
    else if (currentUrl.includes('poe.ninja')) {
        // 使用正则匹配域名部分，保留路径和参数
        const newUrl = currentUrl.replace(/^(https?:\/\/)?([\w.-]+\.)?poe\.ninja/, '$1ninja.710421059.xyz');
        window.location.replace(newUrl);
    }
})();
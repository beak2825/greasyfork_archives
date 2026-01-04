// ==UserScript==
// @name         图片参数清理跳转（dancf.com + chuimg 专用）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动清理 dancf.com 与 chuimg.com 图片链接参数（防循环跳转）
// @match        *://*.dancf.com/*
// @match        *://*.chuimg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548091/%E5%9B%BE%E7%89%87%E5%8F%82%E6%95%B0%E6%B8%85%E7%90%86%E8%B7%B3%E8%BD%AC%EF%BC%88dancfcom%20%2B%20chuimg%20%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548091/%E5%9B%BE%E7%89%87%E5%8F%82%E6%95%B0%E6%B8%85%E7%90%86%E8%B7%B3%E8%BD%AC%EF%BC%88dancfcom%20%2B%20chuimg%20%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    let cleanUrl = url;
    const host = location.hostname;

    // 针对 dancf.com 域名：清理图片参数
    if (host.endsWith("dancf.com")) {
        const regex = /\.(png|jpe?g|webp|gif)(\?.*)$/i;
        if (regex.test(url)) {
            cleanUrl = url.replace(regex, '.$1');
        } else if (url.includes('?')) {
            // 如果不是图片但有 ?，只去掉参数（避免 st-gdx 那种情况）
            cleanUrl = url.split('?')[0];
        }
    }

    // 针对 chuimg.com 域名：清理图片参数
    if (host.includes("chuimg.com")) {
        const regex = /\.(png|jpe?g|webp|gif)(\?.*)$/i;
        if (regex.test(url)) {
            cleanUrl = url.replace(regex, '.$1');
        }
    }

    // 避免循环跳转
    if (cleanUrl !== url) {
        window.location.replace(cleanUrl);
    }
})();

// ==UserScript==
// @name         B 站地址栏净化
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.1
// @description  自动清理B站URL中的跟踪参数，保持地址栏整洁
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @author       SI Xiaolong
// @match        https://www.bilibili.com/*
// @match        https://m.bilibili.com/*
// @match        https://b23.tv/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553634/B%20%E7%AB%99%E5%9C%B0%E5%9D%80%E6%A0%8F%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/553634/B%20%E7%AB%99%E5%9C%B0%E5%9D%80%E6%A0%8F%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要保留的必要参数
    const ALLOWED_PARAMS = ['p', 't'];

    // 清理URL参数
    function cleanUrl() {
        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;
        let hasChanges = false;

        // 遍历所有参数，删除非必要的
        for (const [key, value] of searchParams.entries()) {
            if (!ALLOWED_PARAMS.includes(key)) {
                searchParams.delete(key);
                hasChanges = true;
            }
        }

        // 如果有变化，更新URL（不刷新页面）
        if (hasChanges) {
            const newUrl = currentUrl.origin + currentUrl.pathname +
                          (searchParams.toString() ? '?' + searchParams.toString() : '');

            // 使用replaceState更新URL，不添加历史记录
            window.history.replaceState(null, '', newUrl);
        }
    }

    // 页面加载时执行清理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cleanUrl);
    } else {
        cleanUrl();
    }

    // 监听URL变化（处理SPA导航）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(cleanUrl, 100); // 延迟执行确保URL稳定
        }
    }).observe(document, {subtree: true, childList: true});

})();
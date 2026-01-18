// ==UserScript==
// @name         Wowhead链接汉化
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  将 Wowhead 链接转为简体中文版本
// @author       Gemini / DeepSeek
// @match        https://www.archon.gg/*
// @match        https://altertime.es/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wowhead.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563140/Wowhead%E9%93%BE%E6%8E%A5%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563140/Wowhead%E9%93%BE%E6%8E%A5%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改链接的核心函数
    function convertToCN(originalUrl) {
        // 1. 排除逻辑：如果是测试服链接，直接返回原链接
        const isTestingSite = /wowhead\.com\/(beta|ptr|ptr-2)\//.test(originalUrl);
        if (isTestingSite) {
            return originalUrl;
        }

        let newUrl = originalUrl;

        // 2. 处理子域名替换：es.wowhead.com -> cn.wowhead.com
        if (newUrl.includes('es.wowhead.com')) {
            newUrl = newUrl.replace('es.wowhead.com', 'cn.wowhead.com');
        }

        // 3. 处理特定的路径替换：wowhead.com/es/ -> wowhead.com/cn/
        if (newUrl.includes('wowhead.com/es/')) {
            newUrl = newUrl.replace('wowhead.com/es/', 'wowhead.com/cn/');
        }
        // 4. 处理无语言后缀的常规链接 (例如 www.wowhead.com/item=...)
        else if (newUrl.match(/^(https?:\/\/www\.wowhead\.com)(?!\/cn)/)) {
            newUrl = newUrl.replace(
                /^(https?:\/\/www\.wowhead\.com)/,
                '$1/cn'
            );
        }

        return newUrl;
    }

    // 处理页面中所有 Wowhead 链接
    function updateLinks() {
        // 选择所有包含 wowhead.com 的 a 标签
        const wowheadLinks = document.querySelectorAll('a[href*="wowhead.com"]');

        wowheadLinks.forEach(link => {
            const originalHref = link.href;
            const newHref = convertToCN(originalHref);

            if (originalHref !== newHref) {
                link.href = newHref;

                // 移除跳转中间页面参数（可选）
                if (link.search.includes('?') && !link.search.includes('cn')) {
                    link.search = link.search.replace('?', '?cn&');
                }
            }
        });
    }

    // 初始执行一次
    updateLinks();

    // 动态监听：处理异步加载的内容（AlterTime 等站点常用异步加载）
    const observer = new MutationObserver(() => {
        updateLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
// ==UserScript==
// @name         维基百科强制 zh-tw
// @namespace    https://bento.me/ranburiedbyacat
// @version      1.1
// @description  更改维基百科中文页面为 zh-tw
// @author       嵐 @ranburiedbyacat
// @license      CC-BY-NC-SA-4.0
// @match        *://zh.wikipedia.org/*
// @match        *://zh-cn.wikipedia.org/*
// @match        *://zh-tw.wikipedia.org/*
// @compatible   Safari
// @compatible   Firefox
// @compatible   Chrome
// @icon         https://en.wikipedia.org/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554544/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E5%BC%BA%E5%88%B6%20zh-tw.user.js
// @updateURL https://update.greasyfork.org/scripts/554544/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E5%BC%BA%E5%88%B6%20zh-tw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.pathname === '/') return; // 排除首页

    const zhAreas = ['zh-cn', 'zh-sg', 'zh-tw'];

    // 拦截点击链接
    document.addEventListener('click', e => {
        const a = e.target.closest('a');
        if (!a) return;

        const link = new URL(a.href);
        if (link.pathname === '/') return;

        // 分割路径
        const pathParts = link.pathname.split('/').filter(Boolean);

        if (pathParts.length > 0 && zhAreas.includes(pathParts[0])) {
            // 路径有区域码，替换为 zh-tw
            pathParts[0] = 'zh-tw';
        } else {
            // 路径无区域码，加 variant=zh-tw
            link.searchParams.set('variant', 'zh-tw');
        }

        link.pathname = '/' + pathParts.join('/');
        e.preventDefault();
        location.href = link.toString();
    }, { capture: true });

})();
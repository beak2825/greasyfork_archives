// ==UserScript==
// @name         移花宫(磁力搜索器)复制磁链时添加名称
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动为移花宫的[磁力链接]按钮添加 &dn=资源名称
// @author       wujinjun
// @license      MIT
// @match        *://yhg007.com/search-*.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562138/%E7%A7%BB%E8%8A%B1%E5%AE%AB%28%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2%E5%99%A8%29%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE%E6%97%B6%E6%B7%BB%E5%8A%A0%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/562138/%E7%A7%BB%E8%8A%B1%E5%AE%AB%28%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2%E5%99%A8%29%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE%E6%97%B6%E6%B7%BB%E5%8A%A0%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fixMagnets() {
        // 搜索结果容器
        const base = document.querySelector("body > div.wrapper > div.p-wrapper > div.searchbox > div:nth-child(4)");
        if (!base) return;

        // 遍历所有子结果 div:nth-child(1), div:nth-child(2), ...
        const items = base.children;
        for (const item of items) {

            // 1. 提取资源名称
            const titleA = item.querySelector("div.title > h3 > a");
            if (!titleA) continue;

            const name = titleA.textContent.trim(); // 去掉首尾空格

            // 2. 找到磁力链接按钮
            const magnetA = item.querySelector("div.sbar > span:nth-child(1) > a");
            if (!magnetA) continue;

            const href = magnetA.getAttribute("href");
            if (!href || !href.startsWith("magnet:?xt=urn:btih:")) continue;

            // 3. 提取 hash
            const hash = href.replace("magnet:?xt=urn:btih:", "");

            // 4. 生成新的 magnet 链接
            const newHref = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(name)}`;

            // 5. 写回
            magnetA.setAttribute("href", newHref);
        }
    }

    // 页面加载完成后执行
    window.addEventListener("load", fixMagnets);
})();

// ==UserScript==
// @name         纯文本复制助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  复制时自动去除样式，只保留纯文本（不破坏原复制）
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564072/%E7%BA%AF%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/564072/%E7%BA%AF%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('copy', function (e) {
        try {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            // 直接使用浏览器提供的纯文本（最稳定）
            const plainText = selection.toString();
            if (!plainText) return;

            // 只覆盖 text/plain，不阻止默认 html 复制
            e.clipboardData.setData('text/plain', plainText);

            // 可选：是否强制清空 html（不推荐，容易出问题）
            // e.clipboardData.setData('text/html', plainText);

            // 阻止默认行为（此时我们已经安全写入了纯文本）
            e.preventDefault();

        } catch (err) {
            // 出异常时，完全放行，避免复制失效
            console.warn('纯文本复制失败，已放行默认复制：', err);
        }
    });
})();

// ==UserScript==
// @name         修改网页复选框颜色
// @version      1.0.1
// @description  修改所有网页文字与复选框颜色，兼容 Trusted Types 安全策略
// @author       nosora
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/726822
// @downloadURL https://update.greasyfork.org/scripts/559261/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E5%A4%8D%E9%80%89%E6%A1%86%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/559261/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E5%A4%8D%E9%80%89%E6%A1%86%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) return;
        const style = document.createElement('style');
        style.type = 'text/css';
        // 使用 textContent 代替 innerHTML，避免 TrustedHTML 报错
        style.textContent = css;
        head.appendChild(style);
    }

    document.addEventListener('DOMContentLoaded', function() {
        // 修改选中框的背景色 & 选中文字的颜色
        const selectionColor = 'rgba(0, 0, 0, 0.05)';
        const fontColor = '#6FB7FF';

        // 添加全局样式
        addGlobalStyle(`
            ::selection {
                background-color: ${selectionColor} !important;
                color: ${fontColor} !important;
            }

            input[type="checkbox"],
            input[type="radio"] {
                accent-color: ${fontColor} !important;
            }
        `);

        // 强制覆盖已有的 checkbox / radio
        const elementsToOverride = document.querySelectorAll('body input[type="checkbox"], body input[type="radio"]');
        for (const el of elementsToOverride) {
            el.style.setProperty('background-color', selectionColor, 'important');
            el.style.setProperty('color', fontColor, 'important');
        }
    });
})();

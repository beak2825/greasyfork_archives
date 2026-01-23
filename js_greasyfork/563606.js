// ==UserScript==
// @name         Studbook复制以及转成半角字符
// @namespace    https://studbook.jp/
// @version      1.0.0
// @description  强制解除所有复制/右键限制，并在复制时将全角字符自动转换为半角
// @author       hinotoyk
// @license      CC BY-NC-SA 4.0
// @match        https://www.studbook.jp/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563606/Studbook%E5%A4%8D%E5%88%B6%E4%BB%A5%E5%8F%8A%E8%BD%AC%E6%88%90%E5%8D%8A%E8%A7%92%E5%AD%97%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/563606/Studbook%E5%A4%8D%E5%88%B6%E4%BB%A5%E5%8F%8A%E8%BD%AC%E6%88%90%E5%8D%8A%E8%A7%92%E5%AD%97%E7%AC%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ========= 全角 → 半角 ========= */
    function toHalfWidth(str) {
        return str
            .replace(/　/g, ' ')
            .replace(/[！-～]/g, ch =>
                String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
            );
    }

    /* ========= 阻断站点对非 copy 事件的拦截 ========= */
    const blockEvents = [
        'contextmenu',
        'selectstart',
        'mousedown',
        'mouseup',
        'keydown'
    ];

    blockEvents.forEach(type => {
        document.addEventListener(type, function (e) {
            e.stopImmediatePropagation();
        }, true); // capture
    });

    /* ========= 我们自己接管 copy ========= */
    document.addEventListener('copy', function (e) {
        const selection = window.getSelection().toString();
        if (!selection) return;

        e.preventDefault();
        e.stopImmediatePropagation(); // 在这里才阻断站点
        e.clipboardData.setData('text/plain', toHalfWidth(selection));
    }, true); // capture，优先级最高

    /* ========= 强制解除 CSS 禁选 ========= */
    const enableSelect = () => {
        const style = document.createElement('style');
        style.textContent = `
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
                pointer-events: auto !important;
            }
        `;
        document.documentElement.appendChild(style);
    };

    document.addEventListener('DOMContentLoaded', enableSelect);

    console.log('[Studbook Copy Helper] 已启用');
})();

// ==UserScript==
// @name        Pendle swap amount input  
// @namespace   Violentmonkey Scripts
// @match       https://app.pendle.finance/*
// @grant       none
// @version     1.1
// @author      catoncat
// @description @description  粘贴金额时自动去掉千分位逗号，避免变成 1.826
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/549931/Pendle%20swap%20amount%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/549931/Pendle%20swap%20amount%20input.meta.js
// ==/UserScript==


(function () {
    'use strict';

    document.addEventListener('paste', function (e) {
        let target = e.target;

        if (!(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

        // 限定条件：只针对金额输入框（inputmode=decimal 或 class/id 含有 token/amount/price/money）
        let inputMode = target.getAttribute('inputmode');
        let className = target.className || "";
        let id = target.id || "";
        if (
            inputMode !== 'decimal' &&
            !/amount|money|price|token/i.test(className + " " + id)
        ) {
            return;
        }

        // 获取粘贴数据
        let pasteData = (e.clipboardData || window.clipboardData).getData('text');

        // 只处理金额格式（数字 + , . 空格）
        if (!/^[\d,.\s]+$/.test(pasteData)) return;

        e.preventDefault();

        // 去掉逗号和空格
        let clean = pasteData.replace(/[,\s]/g, '');

        // 插入到光标位置
        let start = target.selectionStart;
        let end = target.selectionEnd;
        let value = target.value;

        target.value = value.slice(0, start) + clean + value.slice(end);
        target.setSelectionRange(start + clean.length, start + clean.length);

        // 触发 React 的 input 事件，让页面更新
        target.dispatchEvent(new Event('input', { bubbles: true }));
    });
})();
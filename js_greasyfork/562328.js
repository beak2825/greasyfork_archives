// ==UserScript==
// @name         资源工作台单据编码自动复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动从 modal-message 弹窗中复制单据编码
// @match        http://10.53.160.88:8188/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562328/%E8%B5%84%E6%BA%90%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%8D%95%E6%8D%AE%E7%BC%96%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/562328/%E8%B5%84%E6%BA%90%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%8D%95%E6%8D%AE%E7%BC%96%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastCopied = '';

    // 监听 DOM 变化（适配异步弹窗）
    const observer = new MutationObserver(() => {
        const modal = document.querySelector('.modal-message');
        if (!modal) return;

        const text = modal.innerText || modal.textContent;
        if (!text) return;

        // 匹配 “TW1000640-260112-10053”
        const match = text.match(/“([^”]+)”/);
        if (!match) return;

        const code = match[1];

        // 防止重复复制
        if (code === lastCopied) return;
        lastCopied = code;

        GM_setClipboard(code);
        console.log('[油猴] 已复制单据编码：', code);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

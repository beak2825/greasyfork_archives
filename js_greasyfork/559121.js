// ==UserScript==
// @name         Catbox.moe 替换短链 | Catbox.moe shortten link replace
// @namespace    https://cb.wss.moe
// @version      1.0
// @description  上传文件后将默认的 "files.catbox.moe" 替换为更适合分享的 "cb.wss.moe" 短链接 | Replace default "files.catbox.moe" to "cb.wss.moe" shortten link for better sharing after uploaded
// @author       wyf9
// @match        https://catbox.moe/*
// @grant        none
// @license      MIT
// @icon         https://catbox.moe/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/559121/Catboxmoe%20%E6%9B%BF%E6%8D%A2%E7%9F%AD%E9%93%BE%20%7C%20Catboxmoe%20shortten%20link%20replace.user.js
// @updateURL https://update.greasyfork.org/scripts/559121/Catboxmoe%20%E6%9B%BF%E6%8D%A2%E7%9F%AD%E9%93%BE%20%7C%20Catboxmoe%20shortten%20link%20replace.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SHORT_DOMAIN = 'cb.wss.moe'; // 也可改成你自己的短域名 | Can replace to your own shortten link

    function replaceToShort(span) {
        if (!span || span.dataset.shortReplaced) return;

        const longUrl = span.textContent.trim();
        if (!longUrl.includes('files.catbox.moe')) return;

        try {
            const path = new URL(longUrl).pathname + new URL(longUrl).search;
            const shortUrl = SHORT_DOMAIN + path;

            span.textContent = shortUrl;

            span.dataset.shortReplaced = '1'; // mark
        } catch (_) { }
    }

    // 观察所有可能的链接插入点
    new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!node.querySelectorAll) continue;

                // 1. 普通拖拽/粘贴上传
                node.querySelectorAll('.responseText .textHolder').forEach(replaceToShort);

                // 2. URL 上传返回的链接
                node.querySelectorAll('.urlUploadResponse .urlResponse').forEach(replaceToShort);

                // 3. 偶尔出现的其他 .responseText > span (?)
                node.querySelectorAll('.responseText span').forEach(span => {
                    if (span.textContent.includes('files.catbox.moe')) replaceToShort(span);
                });
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    // 页面加载后处理已存在的（刷新或已上传的）
    setTimeout(() => {
        document.querySelectorAll('.responseText .textHolder, .urlUploadResponse .urlResponse, .responseText span')
            .forEach(replaceToShort);
    }, 250); // interval: 250ms

})();
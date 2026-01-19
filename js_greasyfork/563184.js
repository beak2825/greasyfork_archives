// ==UserScript==
// @name         Discord 推特链接自动转换 (Twitter to FxTwitter)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 Discord 网页版中粘贴推特链接时，自动将其修改为 fxtwitter 或 fixupx 链接，完美兼容 React 富文本编辑器。
// @author       YourName
// @match        https://discord.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563184/Discord%20%E6%8E%A8%E7%89%B9%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%20%28Twitter%20to%20FxTwitter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563184/Discord%20%E6%8E%A8%E7%89%B9%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%20%28Twitter%20to%20FxTwitter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', function(e) {
        // 获取剪贴板中的纯文本内容
        let clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        let pastedText = clipboardData.getData('text/plain');
        if (!pastedText) return;

        // 正则表达式：严格匹配 twitter.com 和 x.com，避免匹配到 fxtwitter.com 和 fixupx.com 导致死循环
        const twitterRegex = /https?:\/\/(?:www\.)?(twitter\.com|x\.com)\/[^\s]+/g;

        if (twitterRegex.test(pastedText)) {
            // 1. 阻止 Discord 处理这次原始的粘贴
            e.preventDefault();
            e.stopPropagation();

            // 2. 替换文本
            let modifiedText = pastedText
                .replace(/https?:\/\/(?:www\.)?twitter\.com/g, 'https://fxtwitter.com')
                .replace(/https?:\/\/(?:www\.)?x\.com/g, 'https://fixupx.com');

            // 3. 构建一个新的剪贴板对象 (DataTransfer)
            const dt = new DataTransfer();
            dt.setData('text/plain', modifiedText);

            // 4. 伪造一个新的粘贴事件，把修改后的数据塞进去
            const newPasteEvent = new ClipboardEvent('paste', {
                clipboardData: dt,
                bubbles: true,
                cancelable: true
            });

            // 5. 将新事件分发给当前输入框，让 Discord 以为是你粘贴了修改后的文本
            e.target.dispatchEvent(newPasteEvent);
        }
    }, true); // 使用 true 确保我们在 Discord 反应之前拦截
})();

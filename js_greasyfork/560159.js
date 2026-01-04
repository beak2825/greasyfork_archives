// ==UserScript==
// @name         Webpage Info Extract
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Copy page info to clipboard
// @author       Grok + Human
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560159/Webpage%20Info%20Extract.user.js
// @updateURL https://update.greasyfork.org/scripts/560159/Webpage%20Info%20Extract.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单命令
    GM_registerMenuCommand('Copy Title and URL as Markdown', copyToClipboard);

    function copyToClipboard() {
        // 使用window.top获取顶级窗口
        const topWindow = window.top;
        // 获取顶级窗口的标题
        const title = topWindow.document.title;
        // 获取顶级窗口的URL
        const url = topWindow.location.href;
        // 创建Markdown格式的链接
        const markdownText = `[${title}](${url})`;

        // 创建临时textarea元素来实现复制
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = markdownText;
        tempTextarea.style.position = 'fixed';
        tempTextarea.style.opacity = '0';
        document.body.appendChild(tempTextarea);

        // 选择文本并复制
        tempTextarea.select();
        try {
            document.execCommand('copy');
            // alert('Markdown link copied to clipboard:\n' + markdownText);
        } catch (err) {
            alert('Failed to copy: ' + err);
        }

        // 清理
        document.body.removeChild(tempTextarea);
    }
})();
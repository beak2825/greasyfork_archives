// ==UserScript==
// @name         CSDN 免登复制代码并去水印
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  免登录复制 CSDN 代码
// @author       影法师
// @match        https://blog.csdn.net/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559961/CSDN%20%E5%85%8D%E7%99%BB%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E5%B9%B6%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559961/CSDN%20%E5%85%8D%E7%99%BB%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E5%B9%B6%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.cookie = "UserName=123; path=/; domain=blog.csdn.net; max-age=315360000";

    // Your code here...
    function addCss(code, id) {
        const style = document.createElement('style');
        const css = document.createTextNode(code);
        style.setAttribute('data-id', id || 'codebox-css');
        style.appendChild(css);
        document.head.appendChild(style);
    }

    function copyCodeCssFunc() {
        const css = `
    #content_views pre,
    #content_views pre code {
      -webkit-touch-callout: auto !important;
      -webkit-user-select: auto !important;
      -khtml-user-select: auto !important;
      -moz-user-select: auto !important;
      -ms-user-select: auto !important;
      user-select: auto !important;
    }`;
        addCss(css);
    }

    function copyCodeFunc() {
        copyCodeCssFunc();
        const originalSetData = DataTransfer.prototype.setData;

        DataTransfer.prototype.setData = function(format, data) {
            console.log('DataTransfer.setData 被调用:', {
                format,
                dataLength: data.length,
            });

            const isCopyEvent = this.__isClipboardEvent ||
                  (this.constructor.name === 'DataTransfer' &&
                   format === 'text/plain');

            if (isCopyEvent && format === 'text/plain') {
                const originalData = data;

                data = data.replace(/\r\n————————————————[^]*原文链接：[^\r\n]*/g, '');
                data = data.replace(/版权声明[^]*遵循[^]*版权协议[^]*原文链接：[^\r\n]*/g, '');
                data = data.replace(/\n-{10,}\n[\s\S]*?原文链接：[^\n]*/g, '');

                // 清理多余空行
                data = data.replace(/\n\s*\n\s*\n/g, '\n\n');
                data = data.trim();

                if (originalData !== data) {
                    console.log('已清理水印，原长度:', originalData.length, '新长度:', data.length);
                }
            }

            return originalSetData.call(this, format, data);
        };

        console.log('DataTransfer.setData Hook 已安装');
    }

    copyCodeFunc();
})();
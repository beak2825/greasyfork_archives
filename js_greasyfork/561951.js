// ==UserScript==
// @name         阿里云文档直开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击阿里云控制台文档链接时，直接在新标签页打开，绕过右下角弹窗
// @author       GeBron
// @match        https://*.console.aliyun.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561951/%E9%98%BF%E9%87%8C%E4%BA%91%E6%96%87%E6%A1%A3%E7%9B%B4%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/561951/%E9%98%BF%E9%87%8C%E4%BA%91%E6%96%87%E6%A1%A3%E7%9B%B4%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听全局点击事件，采用捕获模式以抢在原有逻辑前执行
    document.addEventListener('click', function(e) {
        // 查找点击目标或其父级是否包含特定的文档链接特征
        // 阿里云文档链接通常带有 help.aliyun.com 域名或特定的帮助中心类名
        const link = e.target.closest('a[href*="help.aliyun.com"]');

        if (link) {
            const url = link.href;

            // 如果链接有效且不是 javascript:void(0) 等
            if (url && url.startsWith('http')) {
                // 阻止原有弹窗逻辑
                e.preventDefault();
                e.stopImmediatePropagation();

                // 在新窗口打开
                window.open(url, '_blank');
            }
        }
    }, true);
})();
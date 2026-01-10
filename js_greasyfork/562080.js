// ==UserScript==
// @name         外链自动新标签页打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击不同域名的链接时，自动在新标签页打开
// @author       chengdu
// @match        *://*/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/562080/%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/562080/%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用事件委托，提升性能
    document.addEventListener('click', function(e) {
        // 寻找点击目标是否在 <a> 标签内
        const anchor = e.target.closest('a');

        // 如果没点到链接，或者链接没有 href 属性，就直接返回
        if (!anchor || !anchor.href) return;

        try {
            const currentHost = window.location.hostname;
            const targetUrl = new URL(anchor.href);

            // 关键判断：如果目标主机名存在且不等于当前主机名
            if (targetUrl.hostname && targetUrl.hostname !== currentHost) {
                // 设置在新窗口打开
                anchor.target = '_blank';
                // 安全增强：防止窗口劫持
                if (!anchor.rel.includes('noopener')) {
                    anchor.rel += ' noopener';
                }
            }
        } catch (error) {
            // 处理一些奇怪的协议，比如 mailto: 或 javascript:
            console.warn('URL 解析出错啦：', error);
        }
    }, true);
})();
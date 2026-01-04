// ==UserScript==
// @name         Google Docs 预览页跳转至编辑页
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  将 Google Docs 的预览页面（含 /htmlview?）自动跳转到编辑页面（/edit?）
// @author       zsjng
// @license      MIT
// @match        https://docs.google.com/*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555149/Google%20Docs%20%E9%A2%84%E8%A7%88%E9%A1%B5%E8%B7%B3%E8%BD%AC%E8%87%B3%E7%BC%96%E8%BE%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/555149/Google%20Docs%20%E9%A2%84%E8%A7%88%E9%A1%B5%E8%B7%B3%E8%BD%AC%E8%87%B3%E7%BC%96%E8%BE%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前完整网址
    const currentUrl = window.location.href;

    // 尝试将 /htmlview? 替换为 /edit?
    const newUrl = currentUrl.replace(/\/htmlview\?/, '/edit?');

    // 如果确实进行了替换（说明当前是预览页）
    if (newUrl !== currentUrl) {
        console.log('[Google Docs 跳转脚本] 检测到预览页面，正在跳转到编辑页面:', newUrl);

        // 自动跳转到编辑页面
        window.location.href = newUrl;
    } else {
        // 可选：在控制台输出日志，表示当前不是预览页
        // console.log('[Google Docs 跳转脚本] 当前不是 /htmlview? 页面，无需跳转。');
    }
})();
// ==UserScript==
// @name         石墨文档外链自动跳转 (Shimo Outlink Skipper)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拦截石墨文档的外链确认页面，直接跳转到目标 URL，不仅速度快，而且不留历史记录，优雅丝滑。
// @author       您的忠实员工
// @match        https://shimo.im/outlink/gray*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shimo.im
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561855/%E7%9F%B3%E5%A2%A8%E6%96%87%E6%A1%A3%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%28Shimo%20Outlink%20Skipper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561855/%E7%9F%B3%E5%A2%A8%E6%96%87%E6%A1%A3%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%28Shimo%20Outlink%20Skipper%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 获取当前页面的查询参数
    const params = new URLSearchParams(window.location.search);

    // 2. 提取 'url' 参数的值
    // URLSearchParams 会自动帮我们处理 decodeURIComponent，非常稳健
    const targetUrl = params.get('url');

    // 3. 只有当获取到有效的 url 时才执行跳转，防止意外报错
    if (targetUrl) {
        // 使用 replace 而不是 assign，这样用户点击浏览器“返回”按钮时，
        // 不会再次触发这个跳转脚本，而是直接回到文档页。
        window.location.replace(targetUrl);
    } else {
        console.log("老板，未检测到目标URL，保持当前页面。");
    }

})();

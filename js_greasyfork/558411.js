// ==UserScript==
// @name         飞书网页链接自动跳转
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将飞书 applink 链接自动跳转到 oa.feishu.cn 网页版
// @author       Xion.Ai
// @match        https://applink.feishu.cn/client/web_app/open*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558411/%E9%A3%9E%E4%B9%A6%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/558411/%E9%A3%9E%E4%B9%A6%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前 URL 参数
    const params = new URLSearchParams(window.location.search);
    // 获取 path 参数
    const path = params.get('path');

    if (path) {
        // 解码 path 参数
        const decodedPath = decodeURIComponent(path);
        // 构建新的跳转 URL
        const newUrl = `https://oa.feishu.cn${decodedPath}`;

        console.log(`检测到飞书 applink，正在跳转至: ${newUrl}`);
        // 执行跳转
        window.location.replace(newUrl);
    }
})();

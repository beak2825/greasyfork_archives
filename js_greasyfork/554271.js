// ==UserScript==
// @name         QQ 反诈链接自动跳转 (c.pc.qq.com)
// @namespace    https://c.pc.qq.com/
// @version      1.1
// @description  自动从 c.pc.qq.com 的跳转页提取 'url' 参数并直接访问
// @author       taffy
// @match        https://c.pc.qq.com/middlem.html*
// @match        https://c.pc.qq.com/ios.html*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554271/QQ%20%E5%8F%8D%E8%AF%88%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%28cpcqqcom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554271/QQ%20%E5%8F%8D%E8%AF%88%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%20%28cpcqqcom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = new URL(window.location.href);
    const targetUrl = currentUrl.searchParams.get('pfurl') || currentUrl.searchParams.get('url');
    if (targetUrl) {
        window.location.replace(targetUrl);
    }
})();
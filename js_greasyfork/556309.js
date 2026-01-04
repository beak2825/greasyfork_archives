// ==UserScript==
// @name               QQ拦截页面重定向
// @namespace          https://imbee.top
// @version            1.0
// @description        QQ点击跳转，网址被拦截问题。
// @author             mifeng
// @license            The Unlicense
// @match              *://c.pc.qq.com/ios.html*
// @match              *://c.pc.qq.com/middlem.html*
// @icon               https://www.qq.com/favicon.ico
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/556309/QQ%E6%8B%A6%E6%88%AA%E9%A1%B5%E9%9D%A2%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/556309/QQ%E6%8B%A6%E6%88%AA%E9%A1%B5%E9%9D%A2%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const urlParams = new URLSearchParams(window.location.search);
    const targetUrl = urlParams.get('url') || urlParams.get('pfurl');
    if (targetUrl) {
        let decodedUrl = decodeURIComponent(targetUrl);
        decodedUrl = decodedUrl.replace(/(%2F|\/)+$/i, '');
        const urlObj = new URL(decodedUrl);
        if (urlObj.pathname === '') {
            decodedUrl += '/';
        }
        window.location.replace(decodedUrl);
    }
})();
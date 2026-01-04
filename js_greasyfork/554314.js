// ==UserScript==
// @name         粤语/吴语维基百科自动跳转到中文维基百科
// @namespace    https://wikipedia.org/
// @version      1.0
// @description  自动将粤语 (zh-yue) 和吴语 (wuu) 维基百科页面重定向到对应的中文 (zh) 维基百科页面。
// @description:en Automatically redirects Cantonese (zh-yue) and Wu (wuu) Wikipedia pages to the corresponding Chinese (zh) Wikipedia page.
// @author       taffy
// @match        https://zh-yue.wikipedia.org/*
// @match        https://wuu.wikipedia.org/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554314/%E7%B2%A4%E8%AF%AD%E5%90%B4%E8%AF%AD%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/554314/%E7%B2%A4%E8%AF%AD%E5%90%B4%E8%AF%AD%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentHost = window.location.hostname;
    if (currentHost === 'zh-yue.wikipedia.org' || currentHost === 'wuu.wikipedia.org') {
        const newUrl = new URL(window.location.href);
        newUrl.hostname = 'zh.wikipedia.org';
        window.location.replace(newUrl.href);
    }

})();
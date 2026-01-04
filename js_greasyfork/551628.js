// ==UserScript==
// @name         自动跳转吴语维基百科到中文维基
// @namespace    https://wikipedia.org/
// @version      1.0
// @description  访问吴语维基百科（wuu.wikipedia.org）时自动跳转到中文维基百科（zh.wikipedia.org）相同词条。
// @match        *://wuu.wikipedia.org/wiki/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551628/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%90%B4%E8%AF%AD%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E5%88%B0%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/551628/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%90%B4%E8%AF%AD%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E5%88%B0%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newUrl = window.location.href.replace('wuu.wikipedia.org', 'zh.wikipedia.org');
    window.location.replace(newUrl);
})();

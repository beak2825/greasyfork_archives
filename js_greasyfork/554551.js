// ==UserScript==
// @name         自动复制种子链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  进入资源页面后，自动获取种子链接复制到剪切板。
// @author       paradox661
// @match        https://kisssub.org/*
// @icon         https://kisssub.org/images/favicon/kisssub.ico
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554551/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%A7%8D%E5%AD%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/554551/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%A7%8D%E5%AD%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const li = document.querySelector('li.gg_download a[href]');
    if (li) {
        const href = li.href;
        const decoded = decodeURIComponent(href);
        const idx = decoded.indexOf('magnet:');
        if (idx >= 0) {
            const magnet = decoded.slice(idx);
            GM_setClipboard(magnet);
            alert('链接已复制。');
        }
    }
})();
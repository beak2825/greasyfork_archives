// ==UserScript==
// @name         btmulu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  btmulu添加下载链接
// @author       You
// @match        https://btmulu.live/*
// @match        https://www.btmulu.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btmulu.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562390/btmulu.user.js
// @updateURL https://update.greasyfork.org/scripts/562390/btmulu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var items = document.querySelectorAll('.item');
    items.forEach(item => {
        let urlStr = item.outerHTML;
        let match = urlStr.match(/[0-9a-zA-Z]{40}/);
        if (match) {
            item.innerHTML += ' <a href="magnet:?xt=urn:btih:' + match[0] + '">下载</a>';
        }
    });

})();
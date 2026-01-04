// ==UserScript==
// @name         强制所有链接新标签打开
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  修改页面中的<a>标签，使其在新标签页打开
// @author       Xiaowu
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550640/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/550640/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改页面中所有<a>标签
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer'); // 安全性考虑
    });

})();

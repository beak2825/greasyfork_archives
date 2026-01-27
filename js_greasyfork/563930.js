// ==UserScript==
// @name         LinuxDo自用优化脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  LinuxDo自用优化脚本-一些自用优化
// @author       CandyMuj
// @match        *://linux.do/*
// @match        *://idcflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license      AGPL License
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/563930/LinuxDo%E8%87%AA%E7%94%A8%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563930/LinuxDo%E8%87%AA%E7%94%A8%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 开始执行
    removeATagClick();

})();



function removeATagClick() {
    // 选择未处理过的链接
    // let links = document.querySelectorAll('a[class$="-external-link-icon"]');
    let links = document.querySelectorAll('a[class$="-external-link-icon"]:not([data-click-removed])');
    // let links = document.querySelectorAll('a[class$="-external-link-icon"]:not(.click-removed)');

    links.forEach(function(link) {
        const newLink = link.cloneNode(true);
        // 给新节点添加标记
        newLink.setAttribute('data-click-removed', 'true');
        // newLink.classList.add('click-removed');
        link.parentNode.replaceChild(newLink, link);
    });

    // 定时执行，避免翻页获取到新的链接无法替换
    setTimeout(removeATagClick, 1500);
}

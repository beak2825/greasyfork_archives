// ==UserScript==
// @name         Gitee直接打开外链
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  自动处理Gitee外链，若在中间页则自动跳转
// @author       CandyMuj
// @match        *://gitee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitee.com
// @grant        none
// @license      AGPL License
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/563585/Gitee%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E5%A4%96%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/563585/Gitee%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E5%A4%96%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let urlPrefix = "https://gitee.com/link?target="
    function processLinks() {
        let links = document.querySelectorAll(`a[href*='${urlPrefix}']:not([data-click-removed])`);

        links.forEach(function(link) {
            let href = link.getAttribute("href");
            let targetPath = href.split("target=")[1];
            let decodedPath = decodeURIComponent(targetPath);

            link.setAttribute("href", decodedPath);
            link.setAttribute("target", "_blank");
            link.setAttribute('data-click-removed', 'true');
        });

        // 定时执行，避免滚动获取到新的链接无法替换
        setTimeout(processLinks, 1500);
    }

    // 开始执行
    let temp = window.location.href.split(urlPrefix)
    // 已经在中间页了，则自动跳转
    if (temp.length == 2){
        window.location.href = decodeURIComponent(temp[1])
    }
    // 未在中间页，则自动替换外链地址
    else {
        processLinks();
    }

})();
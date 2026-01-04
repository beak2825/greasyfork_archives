// ==UserScript==
// @name         屏蔽 Kemono 顶部菜单和烦人的横幅
// @namespace    t.me/TAhhhc
// @version      1.2
// @description  屏蔽kemono导致两行变一行登录后突出的顶部菜单，还有蓝色的告知（加上了coomer
// @author       TAhhhc
// @match        https://*.kemono.su/*
// @match        https://*.kemono.cr/*
// @match        https://coomer.st/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @-downloadURL https://update.greasyfork.org/scripts/558523/%E5%B1%8F%E8%94%BD%20Kemono%20%E9%A1%B6%E9%83%A8%E8%8F%9C%E5%8D%95.user.js
// @downloadURL https://update.greasyfork.org/scripts/558523/%E5%B1%8F%E8%94%BD%20Kemono%20%E9%A1%B6%E9%83%A8%E8%8F%9C%E5%8D%95%E5%92%8C%E7%83%A6%E4%BA%BA%E7%9A%84%E6%A8%AA%E5%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/558523/%E5%B1%8F%E8%94%BD%20Kemono%20%E9%A1%B6%E9%83%A8%E8%8F%9C%E5%8D%95%E5%92%8C%E7%83%A6%E4%BA%BA%E7%9A%84%E6%A8%AA%E5%B9%85.meta.js
// ==/UserScript==
(function() {
    document.documentElement.appendChild(document.createElement('style')).textContent = '.header-link,#announcement-banner{display:none!important}';
})();
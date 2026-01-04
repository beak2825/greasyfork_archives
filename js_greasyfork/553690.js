// ==UserScript==
// @name         禁止知乎滚动锚定
// @name:en      Zhihu Disable Scroll Anchoring
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  禁止知乎回答评论滚动锚定导致错位
// @description:en  Disable scroll anchoring on Zhihu by setting overflow-anchor: none on body
// @author       CentOS76
// @match        *://*.zhihu.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553690/%E7%A6%81%E6%AD%A2%E7%9F%A5%E4%B9%8E%E6%BB%9A%E5%8A%A8%E9%94%9A%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/553690/%E7%A6%81%E6%AD%A2%E7%9F%A5%E4%B9%8E%E6%BB%9A%E5%8A%A8%E9%94%9A%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function disableScrollAnchoring() {
        document.body.style.setProperty('overflow-anchor', 'none', 'important');
        console.log('Zhihu Scroll Anchoring Disabled');
    }
    if (document.body) {
        disableScrollAnchoring();
    } else {
        document.addEventListener('DOMContentLoaded', disableScrollAnchoring);
    }
})();

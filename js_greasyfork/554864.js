// ==UserScript==
// @name         解除学习通粘贴限制
// @namespace    http://tampermonkey.net/
// @version      2025-10-25
// @description  解除学习通粘贴限制~
// @author       You
// @match        https://mooc1.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554864/%E8%A7%A3%E9%99%A4%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/554864/%E8%A7%A3%E9%99%A4%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.editor1.removeListener('beforepaste', window.editorPaste);
    // Your code here...
})();
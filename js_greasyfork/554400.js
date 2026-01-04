// ==UserScript==
// @name         删除HiMCBBS的AI帖子总结
// @namespace    Mooshed88
// @version      1.0
// @description  删除HiMCBBS的AI帖子总结，方便阅读帖子
// @author       Mooshed88
// @match        https://www.himcbbs.com/threads/*
// @grant        none
// @run-at       document-end
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/554400/%E5%88%A0%E9%99%A4HiMCBBS%E7%9A%84AI%E5%B8%96%E5%AD%90%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/554400/%E5%88%A0%E9%99%A4HiMCBBS%E7%9A%84AI%E5%B8%96%E5%AD%90%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const articles = document.querySelectorAll('article.message-body.summary-body');
     articles.forEach(article => article.remove());
})();

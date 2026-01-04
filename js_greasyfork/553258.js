// ==UserScript==
// @name         Reddit 自动中文翻译
// @namespace    https://github.com/yourusername
// @version      1.2
// @description  自动在 Reddit URL 添加 ?tl=zh-hans 参数启用简体中文翻译，使用 Reddit 原生翻译功能
// @author       Dan
// @match        *://*.reddit.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553258/Reddit%20%E8%87%AA%E5%8A%A8%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/553258/Reddit%20%E8%87%AA%E5%8A%A8%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let currentUrl = window.location.href;
    
    if (currentUrl.includes('show=original')) {
        return;
    }
    
    const storageKey = 'reddit_translation_attempted_' + window.location.pathname;
    const hasAttempted = sessionStorage.getItem(storageKey);
    
    const hasTlParam = currentUrl.includes('?tl=') || currentUrl.includes('&tl=');
    
    if (hasTlParam) {
        sessionStorage.setItem(storageKey, 'true');
        return;
    }
    
    if (!hasAttempted) {
        sessionStorage.setItem(storageKey, 'true');
        
        let separator = currentUrl.includes('?') ? '&' : '?';
        let newUrl = currentUrl + separator + 'tl=zh-hans';
        
        window.location.replace(newUrl);
    }
})();
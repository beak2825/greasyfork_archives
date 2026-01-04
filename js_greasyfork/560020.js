// ==UserScript==
// @name         Google AMP链接重定向
// @version      1.1
// @description  自动将Google AMP链接重定向到原始网站
// @author       DeepSeek
// @match        https://www.google.com/amp/s/*
// @match        https://www.google.com.hk/amp/s/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/560020/Google%20AMP%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/560020/Google%20AMP%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL
    const currentUrl = window.location.href;
    
    // 检查是否是Google AMP链接
    if (currentUrl.includes('www.google.com/amp/s/')) {
        // 提取原始URL
        const originalUrl = currentUrl.replace('https://www.google.com/amp/s/', '');
        
        // 如果URL以"amp/"结尾，移除它
        let decodedUrl = decodeURIComponent(originalUrl);
        
        // 移除可能存在的尾部斜杠
        if (decodedUrl.endsWith('/')) {
            decodedUrl = decodedUrl.slice(0, -1);
        }
        
        // 确保URL有协议头
        if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
            decodedUrl = 'https://' + decodedUrl;
        }
        
        console.log('重定向从AMP链接到:', decodedUrl);
        
        // 立即重定向到原始URL
        window.location.replace(decodedUrl);
    }
})();
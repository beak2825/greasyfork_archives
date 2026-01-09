// ==UserScript==
// @name         博客园文章标题新标签页打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制博客园（cnblogs）博主主页的文章标题在新标签页打开
// @author       GeBron
// @match        *://www.cnblogs.com/*
// @exclude      *://www.cnblogs.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561807/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%98%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/561807/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%98%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const selectors = [
        '.postTitle a',         // 常用模板
        '.postTitle2',           // 常用模板2
        '.entrylistPosttitle a', // 随笔列表模板
        '#cb_post_title_url'    // 文章详情页标题（可选）
    ];

    function apply() {
        selectors.forEach(selector => {
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                if (link.tagName === 'A') {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });
        });
    }

    // 立即执行
    apply();
    
    // 博客园部分皮肤加载较慢，1秒后再次确认
    setTimeout(apply, 1000);
})();
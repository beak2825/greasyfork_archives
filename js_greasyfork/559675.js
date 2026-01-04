// ==UserScript==
// @name         知乎日报-思源剪藏适配器 (m4rlin版)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动修正知乎日报页面的标题（适配大图头条模式），并净化阅读界面。专为思源笔记剪藏插件优化设计，实现一键完美抓取。
// @author       m4rlin
// @license      MIT
// @match        http://daily.zhihu.com/story/*
// @match        https://daily.zhihu.com/story/*
// @icon         https://pic4.zhimg.com/v2-3beb14979e84dc2426317b6a953e346f_xl.jpg
// @grant        none
// @run-at       document-end
// @keywords     思源笔记, SiYuan, 剪藏, 知乎日报, 自动化
// @downloadURL https://update.greasyfork.org/scripts/559675/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5-%E6%80%9D%E6%BA%90%E5%89%AA%E8%97%8F%E9%80%82%E9%85%8D%E5%99%A8%20%28m4rlin%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559675/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5-%E6%80%9D%E6%BA%90%E5%89%AA%E8%97%8F%E9%80%82%E9%85%8D%E5%99%A8%20%28m4rlin%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("思源适配器(m4rlin版) v1.0：启动！");

    // === 核心功能：自动修正标题 ===
    var attempts = 0;
    var maxAttempts = 20; // 持续尝试约10秒

    var timer = setInterval(function() {
        attempts++;
        
        // 优先级：.DailyHeader-title (大图页) > .headline-title (普通页) > 其他
        var titleEl = document.querySelector('.DailyHeader-title') || 
                      document.querySelector('.headline-title') || 
                      document.querySelector('.question-title') || 
                      document.querySelector('h1');

        if (titleEl && titleEl.innerText.trim().length > 0) {
            var realTitle = titleEl.innerText.trim();
            
            // 修正浏览器标题
            if (document.title !== realTitle) {
                document.title = realTitle;
                // console.log 仅在调试时保留，发布版可以注释掉，也可以保留
                // console.log("✅ [m4rlin] 标题修正为：" + realTitle);
                clearInterval(timer);
            }
        } 

        if (attempts >= maxAttempts) {
            clearInterval(timer);
        }
    }, 500);

    // === 辅助功能：阅读界面净化 ===
    function cleanLayout() {
        var css = `
            .header, .bottom-wrap, .dudu-stories-container, .view-more, .qr { 
                display: none !important; 
            }
            .DailyRichText, .content-inner {
                max-width: 900px !important;
                margin: 0 auto !important;
                font-size: 18px !important;
                line-height: 1.8 !important;
                background: #fff;
            }
        `;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    
    setTimeout(cleanLayout, 1000);

})();
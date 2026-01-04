// ==UserScript==
// @name         微信公众号图片原图查看器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动将微信公众号图片链接转换为原图链接，方便右键保存，保存的图片为原图格式，而非web格式
// @author       kingson
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549908/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E7%89%87%E5%8E%9F%E5%9B%BE%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549908/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E7%89%87%E5%8E%9F%E5%9B%BE%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测并处理当前页面中的微信图片链接
    function processWechatImageLinks() {
        const links = document.querySelectorAll('a[href*="mmbiz.qpic.cn"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('mmbiz.qpic.cn')) {
                // 提取图片ID部分
                const match = href.match(/mmbiz\.qpic\.cn\/mmbiz_[^\/]+\/([^\/]+)\//);
                if (match && match[1]) {
                    const imageId = match[1];
                    // 构造原图链接
                    const originalUrl = href.replace(/\/\d+\?/, '/0?').replace(/&[^&]*$/, '');
                    link.setAttribute('href', originalUrl);
                    link.setAttribute('target', '_blank');

                    // 如果是图片元素本身，直接替换src
                    if (link.tagName === 'IMG') {
                        link.src = originalUrl;
                    }
                }
            }
        });
    }

    // 初始处理
    processWechatImageLinks();

    // 监听动态加载的内容
    const observer = new MutationObserver(processWechatImageLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

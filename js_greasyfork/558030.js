// ==UserScript==
// @name         抖音分享链接净化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击分享菜单内的复制链接时，自动去除跟踪参数，仅保留视频主链接。
// @license      MIT
// @author       Readedd
// @match        *://www.douyin.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558030/%E6%8A%96%E9%9F%B3%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558030/%E6%8A%96%E9%9F%B3%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 备份原生的 writeText 方法
    const originalWriteText = navigator.clipboard.writeText;

    // 重写 writeText 方法
    navigator.clipboard.writeText = function(text) {
        return new Promise((resolve, reject) => {
            if (typeof text === 'string') {
                // 正则匹配抖音视频的基础链接
                const cleanLinkMatch = text.match(/(https?:\/\/(?:www\.)?(?:iesdouyin|douyin)\.com\/(?:share\/)?video\/\d+)/);

                if (cleanLinkMatch) {
                    console.log('【链接净化】原链接:', text);
                    const cleanLink = cleanLinkMatch[1]; // 获取匹配到的第一组（纯净链接）
                    console.log('【链接净化】新链接:', cleanLink);
                    
                    // 写入净化后的链接
                    return originalWriteText.call(navigator.clipboard, cleanLink)
                        .then(resolve)
                        .catch(reject);
                }
            }
            
            // 如果不是目标链接，或者没匹配到，就原样写入
            return originalWriteText.call(navigator.clipboard, text)
                .then(resolve)
                .catch(reject);
        });
    };

    console.log('抖音链接净化脚本已加载');
})();
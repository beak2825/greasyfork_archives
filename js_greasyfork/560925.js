// ==UserScript==
// @name         网页暗色模式切换器
// @namespace    http://tampermonkey.net/1554493
// @version      1.0
// @description  在当前网页添加一个按钮，点击切换暗色模式（适用于任何网站）
// @author       飞翔的荷兰人269
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560925/%E7%BD%91%E9%A1%B5%E6%9A%97%E8%89%B2%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560925/%E7%BD%91%E9%A1%B5%E6%9A%97%E8%89%B2%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动按钮
    let button = document.createElement('button');
    button.innerText = '切换暗模式';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '999999';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#333';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    document.body.appendChild(button);

    // 切换函数
    button.addEventListener('click', function() {
        if (document.documentElement.style.filter) {
            // 恢复原状
            document.documentElement.style.filter = '';
            document.body.style.backgroundColor = '';
            // 移除图片/视频的反转
            let medias = document.querySelectorAll('img, video, iframe');
            medias.forEach(m => m.style.filter = '');
        } else {
            // 应用暗模式
            document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
            document.body.style.backgroundColor = 'white';  // 防止背景透明导致问题
            // 图片、视频、iframe 恢复正常（反转两次）
            let medias = document.querySelectorAll('img, video, iframe');
            medias.forEach(m => m.style.filter = 'invert(1) hue-rotate(180deg)');
        }
    });
})();
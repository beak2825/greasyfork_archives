// ==UserScript==
// @name         自动点击QQ头像登陆脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description 检测并自动点击QQ头像登陆，点击后有提示消息
// @author       lhr3572651322
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552813/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBQQ%E5%A4%B4%E5%83%8F%E7%99%BB%E9%99%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552813/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBQQ%E5%A4%B4%E5%83%8F%E7%99%BB%E9%99%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 显示自动消逝的弹框
function showTempMessage(message, duration = 2000) {
    // 创建弹框元素
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(popup);

    // 显示动画
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateX(0)';
    }, 10);

    // 自动消失
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }, duration);
}


    function autoClick() {
        const targetElement = document.querySelector('span[id^="img_out_"]');
        if (targetElement) {
            targetElement.click();
            console.log('自动点击了目标元素');
            showTempMessage('已识别到QQ登陆并自动点击')
            return true;
        }
        return false;
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations) => {
        if (autoClick()) {
            observer.disconnect();
        }
    });

    // 启动观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 立即尝试一次
    setTimeout(autoClick, 100);

    // 防止长时间运行，30秒后自动停止
    setTimeout(() => {
        observer.disconnect();
        console.log('自动点击监控已停止');
    }, 30000);
})();
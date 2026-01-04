// ==UserScript==
// @name         手机端消息发送按钮（油猴）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  手机上显示大按钮，点击发送固定消息提示
// @license      MIT
// @author       You
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555100/%E6%89%8B%E6%9C%BA%E7%AB%AF%E6%B6%88%E6%81%AF%E5%8F%91%E9%80%81%E6%8C%89%E9%92%AE%EF%BC%88%E6%B2%B9%E7%8C%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555100/%E6%89%8B%E6%9C%BA%E7%AB%AF%E6%B6%88%E6%81%AF%E5%8F%91%E9%80%81%E6%8C%89%E9%92%AE%EF%BC%88%E6%B2%B9%E7%8C%B4%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ########## 原 showMessage 函数（保持不变）##########
    function showMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.left = '50%';
        messageEl.style.transform = 'translateX(-50%)';
        messageEl.style.background = 'rgba(0, 0, 0, 0.8)';
        messageEl.style.color = 'white';
        messageEl.style.padding = '12px 24px'; // 手机端适当加大内边距
        messageEl.style.borderRadius = '8px'; // 圆角更明显
        messageEl.style.zIndex = '999999'; // 提高层级，避免被遮挡
        messageEl.style.fontSize = '16px'; // 字体放大，方便查看
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(messageEl);

        // 显示消息
        setTimeout(() => {
            messageEl.style.opacity = '1';
        }, 10);

        // 3秒后隐藏并移除消息
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                messageEl.parentNode?.removeChild(messageEl);
            }, 300);
        }, 3000);
    }

    // ########## 手机端按钮创建逻辑 ##########
    function createSendButton() {
        // 避免重复创建按钮（多次加载脚本时）
        if (document.getElementById('mobile-message-btn')) return;

        // 创建按钮元素
        const btn = document.createElement('button');
        btn.id = 'mobile-message-btn';
        btn.textContent = '发送消息'; // 按钮文字（可自定义）
        
        // 手机端适配样式：大尺寸、易点击、固定位置
        btn.style.cssText = `
            position: fixed;
            bottom: 40px; /* 底部距离，避免被导航栏遮挡 */
            right: 20px;  /* 右侧距离，不遮挡页面内容 */
            width: 120px; /* 按钮宽度，足够大 */
            height: 50px; /* 按钮高度，方便触摸 */
            background: #2f54eb; /* 醒目蓝色，易识别 */
            color: white;
            font-size: 18px; /* 字体放大 */
            font-weight: bold;
            border: none;
            border-radius: 25px; /* 圆形按钮，更美观 */
            box-shadow: 0 4px 12px rgba(47, 84, 235, 0.4); /* 阴影增强层次感 */
            z-index: 999998; /* 低于消息提示，避免遮挡 */
            touch-action: manipulation; /* 优化移动端触摸响应 */
            cursor: pointer;
            opacity: 0.9;
            transition: all 0.2s ease;
        `;

        // 触摸/点击事件（适配移动端触摸和鼠标点击）
        btn.addEventListener('click', () => {
            // 固定消息内容（可修改为你需要的文字）
            const fixedMessage = '🎉 这是一条固定消息提示！';
            showMessage(fixedMessage);
            
            // 按钮点击反馈（轻微缩放）
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });

        // 按钮hover效果（桌面端兼容）
        btn.addEventListener('mouseenter', () => {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.opacity = '0.9';
            btn.style.transform = 'scale(1)';
        });

        // 添加到页面
        document.body.appendChild(btn);
    }

    // 页面加载完成后创建按钮（确保DOM已渲染）
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createSendButton();
    } else {
        document.addEventListener('DOMContentLoaded', createSendButton);
    }
})();
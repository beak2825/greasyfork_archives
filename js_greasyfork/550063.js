// ==UserScript==
// @name         HF Space 跳转到独立 APP 页面 | HF Space Jump To App-Site
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 Hugging Face Space 页面添加跳转按钮，跳转到独立 App 页面
// @author       skydog221
// @match        https://huggingface.co/spaces/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550063/HF%20Space%20%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%8B%AC%E7%AB%8B%20APP%20%E9%A1%B5%E9%9D%A2%20%7C%20HF%20Space%20Jump%20To%20App-Site.user.js
// @updateURL https://update.greasyfork.org/scripts/550063/HF%20Space%20%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%8B%AC%E7%AB%8B%20APP%20%E9%A1%B5%E9%9D%A2%20%7C%20HF%20Space%20Jump%20To%20App-Site.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', () => {
        // 解析当前 URL
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split('/').filter(Boolean);

        if (pathSegments.length >= 2 && !pathSegments[3]) {
            const username = pathSegments[1];
            const repo = pathSegments[2];
            const targetUrl = `https://${username}-${repo}.hf.space`;

            // 创建容器，使用更轻量的定位
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 2147483647;
                pointer-events: none;
            `;

            // 创建按钮
            const button = document.createElement('button');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                </svg>
                <span style="margin-left: 6px;">Open App</span>
            `;
            
            // 设置轻量级样式
            button.style.cssText = `
                background: rgba(255, 255, 255, 0.95);
                color: #1a1a1a;
                border: 1px solid #e5e7eb;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                pointer-events: auto;
                backdrop-filter: blur(10px);
            `;

            // 添加微妙的交互效果
            button.addEventListener('mouseenter', () => {
                button.style.background = '#f9fafb';
                button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                button.style.transform = 'translateY(-1px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(255, 255, 255, 0.95)';
                button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                button.style.transform = 'translateY(0)';
            });

            // 点击事件
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(targetUrl, '_blank');
            });

            // 添加到容器
            container.appendChild(button);

            // 插入到页面，放在body的末尾以减少干扰
            document.body.appendChild(container);

            // 添加淡入动画
            setTimeout(() => {
                container.style.opacity = '0';
                container.style.transition = 'opacity 0.3s ease';
                container.style.opacity = '1';
            }, 100);
        }
    });
})();
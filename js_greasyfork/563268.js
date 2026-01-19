// ==UserScript==
// @name         Google AI Studio 快速导航助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 aistudio 添加“上一条”、“下一条”对话的导航悬浮按钮，支持拖动
// @author       ByronLeeeee
// @match        *://aistudio.google.com/*
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_2_32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563268/Google%20AI%20Studio%20%E5%BF%AB%E9%80%9F%E5%AF%BC%E8%88%AA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563268/Google%20AI%20Studio%20%E5%BF%AB%E9%80%9F%E5%AF%BC%E8%88%AA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认位置配置
    const DEFAULT_CONFIG = {
        right: '20px',
        bottom: '80px',
    };

    // 本地存储键名
    const STORAGE_KEY = 'aistudio_nav_pos';

    // 创建控制面板
    function createControls() {
        // 防止重复创建
        if (document.getElementById('chat-nav-helper')) return;

        const container = document.createElement('div');
        container.id = 'chat-nav-helper';

        // 读取保存的位置
        const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY));

        // 基础样式
        container.style.cssText = `
            position: fixed;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
            background: rgba(0, 0, 0, 0.2);
            padding: 8px;
            border-radius: 8px;
            backdrop-filter: blur(4px);
            transition: background 0.3s;
            cursor: move; /* 鼠标变成移动图标 */
            user-select: none; /* 禁止文字被选中 */
            -webkit-user-select: none;
        `;

        // 应用位置
        if (savedPos) {
            container.style.left = savedPos.left;
            container.style.top = savedPos.top;
        } else {
            container.style.right = DEFAULT_CONFIG.right;
            container.style.bottom = DEFAULT_CONFIG.bottom;
        }

        // 鼠标悬停效果
        container.onmouseenter = () => container.style.background = 'rgba(0, 0, 0, 0.6)';
        container.onmouseleave = () => container.style.background = 'rgba(0, 0, 0, 0.2)';

        // 拖拽逻辑
        let isDragging = false;
        let startX, startY;
        let initialLeft, initialTop;

        container.addEventListener('mousedown', (e) => {
            isDragging = true;

            // 获取当前元素相对于视口的坐标
            const rect = container.getBoundingClientRect();

            // 记录鼠标在元素内的相对偏移
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            container.style.right = 'auto';
            container.style.bottom = 'auto';
            container.style.width = `${rect.width}px`; 
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const newLeft = e.clientX - startX;
            const newTop = e.clientY - startY;

            // 限制在屏幕范围内
            const maxLeft = window.innerWidth - container.offsetWidth;
            const maxTop = window.innerHeight - container.offsetHeight;

            const finalLeft = Math.max(0, Math.min(newLeft, maxLeft));
            const finalTop = Math.max(0, Math.min(newTop, maxTop));

            container.style.left = `${finalLeft}px`;
            container.style.top = `${finalTop}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // 保存位置到 localStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    left: container.style.left,
                    top: container.style.top
                }));
            }
        });

        // 创建按钮
        const createBtn = (text, onClick) => {
            const btn = document.createElement('button');
            btn.innerText = text;
            btn.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                border: none;
                background: #191919;
                color: white;
                border-radius: 4px;
                font-size: 14px;
                font-weight: bold;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                user-select: none; /* 按钮文字不可选 */
                pointer-events: auto; /* 确保按钮响应点击 */
            `;

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            };

            return btn;
        };

        const btnPrev = createBtn('↑', () => scrollToTurn('prev'));
        const btnNext = createBtn('↓', () => scrollToTurn('next'));

        container.appendChild(btnPrev);
        container.appendChild(btnNext);

        document.body.appendChild(container);
    }

    // 滚动逻辑
    function scrollToTurn(direction) {
        const turns = Array.from(document.querySelectorAll('ms-chat-turn'));

        if (turns.length === 0) {
            console.log('未找到对话元素 (ms-chat-turn)');
            return;
        }

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const viewportHeaderOffset = 80;

        let targetElement = null;

        if (direction === 'next') {
            for (let i = 0; i < turns.length; i++) {
                const rect = turns[i].getBoundingClientRect();
                if (rect.top > viewportHeaderOffset + 10) {
                    targetElement = turns[i];
                    break;
                }
            }
        } else if (direction === 'prev') {
            for (let i = turns.length - 1; i >= 0; i--) {
                const rect = turns[i].getBoundingClientRect();
                if (rect.top < viewportHeaderOffset - 10) {
                    targetElement = turns[i];
                    break;
                }
            }
        }

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            if (direction === 'prev') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                 window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        }
    }

    // 初始化
    window.addEventListener('load', () => {
        setTimeout(createControls, 1500); 
    });
})();
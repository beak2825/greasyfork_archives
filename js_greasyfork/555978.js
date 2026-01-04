// ==UserScript==
// @name         B站评论区右移
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  滑块调节评论区左内边距，鼠标离开自动隐藏。保护大屏用户脖子。
// @author       Zaln_312, Qwen3 Plus
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/555978/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%8F%B3%E7%A7%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/555978/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%8F%B3%E7%A7%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MIN = 0; // 滑块左值
    const MAX = 700; // 滑块右值
    const STEP = 1; // 滑块步长
    const DEFAULT = GM_getValue('comment_padding', 0); // 初始偏移px
    const OPACITY = '0' // 鼠标离开透明度
    const HIDE = 300 // 延迟隐藏ms

    let current = DEFAULT;
    let hideTimer;

    // 更新样式
    function updateStyle(value) {
        let style = document.getElementById('bili-comment-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'bili-comment-style';
            document.head.appendChild(style);
        }
        style.textContent = `div#commentapp { padding-left: ${value}px !important; }`;
    }

    // 创建带自动隐藏的面板
    function createSliderPanel() {
        const container = document.createElement('div');
        container.id = 'bili-slider-panel';
        container.style = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 99999;
            opacity: 1;
            transition: opacity 0.3s ease;
            background: white;
            border: 1px solid #00a1d6;
            border-radius: 6px;
            padding: 8px 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            white-space: nowrap;
        `;

        container.innerHTML = `
            <span style="margin-right: 8px;">偏移:</span>
            <input type="range"
                   min="${MIN}"
                   max="${MAX}"
                   value="${current}"
                   step="${STEP}"
                   style="width: 100px; accent-color: #00a1d6;">
            <span id="comment-value"
                  style="margin: 0 6px; font-weight: bold; width: 30px; text-align: center;">
                ${current}
            </span>px
        `;

        // 添加鼠标事件
        container.addEventListener('mouseenter', () => {
            container.style.opacity = '1';
            if (hideTimer) clearTimeout(hideTimer);
        });

        container.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(() => {
                container.style.opacity = OPACITY;
            }, HIDE);
        });

        document.body.appendChild(container);

        // 绑定滑块事件
        const slider = container.querySelector('input');
        const valueDisplay = container.querySelector('#comment-value');

        slider.addEventListener('input', () => {
            current = parseInt(slider.value);
            valueDisplay.textContent = current;
            updateStyle(current);
        });

        // 初始状态设为半透明
        setTimeout(() => {
            if (!container.matches(':hover')) {
                container.style.opacity = OPACITY;
            }
        }, HIDE);
    }

    // 保存设置
    window.addEventListener('beforeunload', () => {
        GM_setValue('comment_padding', current);
    });

    // 初始化
    updateStyle(current);
    createSliderPanel();
})();
// ==UserScript==
// @name         哔哩哔哩文章阅读位置记忆
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  记录和恢复在哔哩哔哩文章页面的阅读位置
// @author       xjxx3721
// @match        https://www.bilibili.com/opus/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560099/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E4%BD%8D%E7%BD%AE%E8%AE%B0%E5%BF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/560099/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E4%BD%8D%E7%BD%AE%E8%AE%B0%E5%BF%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前文章的唯一标识（使用URL）
    const articleId = window.location.href;
    const scrollPositionKey = `scrollPosition_${articleId}`;

    // 保存滚动位置
    function saveScrollPosition() {
        const scrollY = window.scrollY;
        console.log(`保存滚动位置: ${scrollY}`);
        GM_setValue(scrollPositionKey, scrollY);
    }

    // 恢复滚动位置
    function restoreScrollPosition() {
        const savedPosition = GM_getValue(scrollPositionKey, 0);
        console.log(`恢复滚动位置: ${savedPosition}`);

        if (savedPosition > 0) {
            // 延迟执行以确保页面完全加载
            setTimeout(() => {
                window.scrollTo(0, savedPosition);
                console.log(`已滚动到位置: ${savedPosition}`);

                // 添加视觉提示
                showScrollIndicator(savedPosition);
            }, 1000); // 1秒延迟，确保页面内容加载完成

            // 添加额外的恢复尝试（防止内容延迟加载）
            setTimeout(() => {
                const currentScroll = window.scrollY;
                if (currentScroll < savedPosition - 100) {
                    window.scrollTo(0, savedPosition);
                    console.log(`二次滚动到位置: ${savedPosition}`);
                }
            }, 3000);
        }
    }

    // 显示滚动位置提示
    function showScrollIndicator(position) {
        // 移除可能存在的旧提示
        const existingIndicator = document.querySelector('.scroll-restore-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // 创建提示元素
        const indicator = document.createElement('div');
        indicator.className = 'scroll-restore-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 174, 236, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 999999;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: fadeInOut 3s ease-in-out;
                max-width: 300px;
            ">
                <span style="font-weight: bold;">📖 已恢复阅读位置</span><br>
                <span style="font-size: 12px; opacity: 0.9;">上次阅读位置: ${Math.round(position)}px</span>
            </div>
        `;

        document.body.appendChild(indicator);

        // 添加淡入淡出动画
        GM_addStyle(`
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                15% { opacity: 1; transform: translateY(0); }
                85% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `);

        // 3秒后自动移除提示
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 3000);
    }

    // 防抖函数，避免频繁保存
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 主函数
    function init() {
        console.log('B站文章阅读位置记忆脚本已启动');

        // 恢复上次的滚动位置
        restoreScrollPosition();

        // 监听滚动事件（防抖处理，每500ms保存一次）
        const saveScrollDebounced = debounce(saveScrollPosition, 500);
        window.addEventListener('scroll', saveScrollDebounced);

        // 页面卸载前保存一次
        window.addEventListener('beforeunload', saveScrollPosition);

        // 监听页面可见性变化（切换标签页时保存）
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                saveScrollPosition();
            }
        });

        // 添加手动重置按钮（可选功能）
        addResetButton();
    }

    // 添加手动重置按钮（可选）
    function addResetButton() {
        const resetBtn = document.createElement('button');
        resetBtn.innerHTML = '🗑️ 清除记忆';
        resetBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 85, 85, 0.9);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            z-index: 999998;
            opacity: 0.7;
            transition: opacity 0.3s;
        `;

        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.opacity = '1';
        });

        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.opacity = '0.7';
        });

        resetBtn.addEventListener('click', () => {
            GM_setValue(scrollPositionKey, 0);
            alert('已清除此页面的阅读位置记忆');
            resetBtn.remove();
        });

        document.body.appendChild(resetBtn);
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
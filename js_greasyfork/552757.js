// ==UserScript==
// @name         DeepSeek 输出内容区宽度调整 - Padding版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  通过调整padding来增加DeepSeek聊天页面输出内容区的宽度
// @author       lunzicao
// @match        https://chat.deepseek.com/*
// @match        https://static.deepseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552757/DeepSeek%20%E8%BE%93%E5%87%BA%E5%86%85%E5%AE%B9%E5%8C%BA%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4%20-%20Padding%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552757/DeepSeek%20%E8%BE%93%E5%87%BA%E5%86%85%E5%AE%B9%E5%8C%BA%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4%20-%20Padding%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数 - 可自定义调整
    const CONFIG = {
        targetPadding: '20px',      // 目标padding值，减小这个值可以增加内容宽度
        targetSelector: '.ds-scroll-area', // 目标类选择器
        applyToSecond: true,        // 是否只应用到第二个元素
        debug: false                // 调试模式
    };

    // 主函数：调整padding
    function adjustContentWidth() {
        try {
            const elements = document.querySelectorAll(CONFIG.targetSelector);

            if (elements.length === 0) {
                if (CONFIG.debug) console.log('未找到目标元素:', CONFIG.targetSelector);
                return;
            }

            if (CONFIG.debug) console.log(`找到 ${elements.length} 个目标元素`);

            elements.forEach((element, index) => {
                // 如果设置为只调整第二个，且当前不是第二个元素，则跳过
                if (CONFIG.applyToSecond && index !== 1) {
                    return;
                }

                // 保存原始样式以便恢复
                if (!element.dataset.originalPadding) {
                    const computedStyle = window.getComputedStyle(element);
                    element.dataset.originalPadding = computedStyle.padding;
                }

                // 应用新的padding
                element.style.padding = CONFIG.targetPadding;
                element.style.boxSizing = 'border-box'; // 确保padding不影响总宽度

                if (CONFIG.debug) {
                    console.log(`调整第 ${index + 1} 个元素 padding:`, {
                        element: element,
                        originalPadding: element.dataset.originalPadding,
                        newPadding: CONFIG.targetPadding,
                        classList: element.classList
                    });
                }
            });

        } catch (error) {
            console.error('调整宽度时出错:', error);
        }
    }

    // 添加自定义CSS样式（更彻底的方法）
    function addCustomCSS() {
        const style = document.createElement('style');
        style.id = 'deepseek-width-adjust';

        if (CONFIG.applyToSecond) {
            // 只针对第二个元素
            style.textContent = `
                ${CONFIG.targetSelector}:nth-of-type(2) {
                    padding: ${CONFIG.targetPadding} !important;
                    box-sizing: border-box !important;
                }

                /* 针对包含动态字符的类名模式 */
                [class*="ds-scroll-area"]:nth-of-type(2) {
                    padding: ${CONFIG.targetPadding} !important;
                    box-sizing: border-box !important;
                }

                /* 增加内容区域的实际可用宽度 */
                ${CONFIG.targetSelector}:nth-of-type(2) * {
                    max-width: 100% !important;
                }
            `;
        } else {
            // 应用到所有元素
            style.textContent = `
                ${CONFIG.targetSelector} {
                    padding: ${CONFIG.targetPadding} !important;
                    box-sizing: border-box !important;
                }

                [class*="ds-scroll-area"] {
                    padding: ${CONFIG.targetPadding} !important;
                    box-sizing: border-box !important;
                }
            `;
        }

        document.head.appendChild(style);
        if (CONFIG.debug) console.log('自定义CSS样式已添加');
    }

    // 监听DOM变化（应对动态加载的内容）
    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldAdjust = false;

            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.querySelectorAll?.(CONFIG.targetSelector).length > 0) {
                                shouldAdjust = true;
                            }
                            if (node.classList?.contains('ds-scroll-area') ||
                                Array.from(node.classList).some(cls => cls.includes('ds-scroll-area'))) {
                                shouldAdjust = true;
                            }
                        }
                    });
                }
            });

            if (shouldAdjust) {
                setTimeout(adjustContentWidth, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        if (CONFIG.debug) console.log('DOM变化监听器已启动');
    }

    // 恢复原始样式（用于调试）
    function restoreOriginalStyles() {
        const elements = document.querySelectorAll(CONFIG.targetSelector);
        elements.forEach(element => {
            if (element.dataset.originalPadding) {
                element.style.padding = element.dataset.originalPadding;
            }
        });

        const customStyle = document.getElementById('deepseek-width-adjust');
        if (customStyle) {
            customStyle.remove();
        }

        if (CONFIG.debug) console.log('原始样式已恢复');
    }

    // 初始化函数
    function init() {
        if (CONFIG.debug) console.log('DeepSeek 宽度调整脚本初始化...');

        // 立即执行一次
        adjustContentWidth();
        addCustomCSS();

        // 监听DOM变化
        observeDOMChanges();

        // 延迟执行以确保页面完全加载
        setTimeout(adjustContentWidth, 500);
        setTimeout(adjustContentWidth, 2000);

        // 监听页面可见性变化（应对标签页切换）
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                setTimeout(adjustContentWidth, 500);
            }
        });

        if (CONFIG.debug) console.log('DeepSeek 宽度调整脚本已完全加载');
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 提供全局函数以便手动调整
    window.deepseekWidthAdjust = {
        adjust: adjustContentWidth,
        restore: restoreOriginalStyles,
        setPadding: function(newPadding) {
            CONFIG.targetPadding = newPadding;
            adjustContentWidth();
            // 重新添加CSS
            const oldStyle = document.getElementById('deepseek-width-adjust');
            if (oldStyle) oldStyle.remove();
            addCustomCSS();
        },
        config: CONFIG
    };

})();
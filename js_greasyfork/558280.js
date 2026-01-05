// ==UserScript==
// @name         Gemini更宽的对话气泡，适配暗色模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  gemini生成，90%居中，修复检测失效问题：采用根节点穿透监听+防抖，无需轮询即可秒级响应。
// @author       You
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558280/Gemini%E6%9B%B4%E5%AE%BD%E7%9A%84%E5%AF%B9%E8%AF%9D%E6%B0%94%E6%B3%A1%EF%BC%8C%E9%80%82%E9%85%8D%E6%9A%97%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/558280/Gemini%E6%9B%B4%E5%AE%BD%E7%9A%84%E5%AF%B9%E8%AF%9D%E6%B0%94%E6%B3%A1%EF%BC%8C%E9%80%82%E9%85%8D%E6%9A%97%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================
    // 配置：颜色定义
    // =========================================
    const LIGHT_BG = 'rgb(249, 249, 249)';
    const DARK_BG  = 'rgb(47, 47, 47)';
    const LIGHT_TEXT = 'inherit';
    const DARK_TEXT  = '#e3e3e3';

    // =========================================
    // 1. CSS 样式注入 (保持不变)
    // =========================================
    const css = `
        /* 布局核心 */
        main, .infinite-scroll-component { width: 100% !important; }

        .infinite-scroll-component > div,
        [class*="conversation-container"] {
            max-width: 90% !important;
            width: 90% !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        /* 解锁限制 */
        user-query, user-query-content,
        [data-test-id="user-query-item"],
        [data-test-id="model-response-item"],
        main div[style*="max-width"] {
            max-width: 100% !important;
            width: 100% !important;
        }

        /* 修复图标显示 */
        [data-test-id="model-response-item"] {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
        }

        /* AI 气泡 (动态变色) */
        [data-test-id="model-response-content"],
        [class*="model-response"] {
            width: calc(100% - 50px) !important;
            margin-right: auto !important;

            /* 关键：使用 CSS 变量 */
            background-color: var(--gemini-bubble-bg, ${LIGHT_BG}) !important;
            color: var(--gemini-bubble-text, ${LIGHT_TEXT}) !important;

            padding: 30px !important;
            border-radius: 20px !important;
            box-sizing: border-box !important;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* 用户气泡 */
        [data-test-id="user-query-item"] {
            display: flex !important;
            justify-content: flex-end !important;
            padding-right: 0 !important;
        }

        .user-query-bubble-with-background,
        [class*="user-query-bubble"] {
            margin-left: auto !important;
            margin-right: 0 !important;
            max-width: 70% !important;
            border-radius: 20px 20px 4px 20px !important;
        }

        user-query .avatar-container { display: none !important; }

        /* 输入框 & 代码块 */
        footer > div, form, [class*="input-area-container"] {
            max-width: 900px !important;
            width: 900px !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }
        pre, code-block { max-width: 100% !important; border-radius: 12px !important; }
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // =========================================
    // 2. JS 智能检测核心 (升级版：防抖 + 根节点穿透监听)
    // =========================================

    let lastState = 'unknown';
    let checkTimeout = null; // 用于防抖

    // 获取实际背景色
    function getActualBackgroundColor() {
        const candidates = [document.body, document.querySelector('main'), document.documentElement];
        for (let el of candidates) {
            if (!el) continue;
            const style = window.getComputedStyle(el);
            const color = style.backgroundColor;
            if (color && !color.includes('rgba(0, 0, 0, 0)') && color !== 'transparent') {
                return color;
            }
        }
        return 'rgb(255, 255, 255)';
    }

    // 执行检测与设置
    function checkAndSetTheme() {
        const bgColor = getActualBackgroundColor();
        const rgb = bgColor.match(/\d+/g);

        if (rgb && rgb.length >= 3) {
            // 计算亮度
            const luma = 0.299 * parseInt(rgb[0]) + 0.587 * parseInt(rgb[1]) + 0.114 * parseInt(rgb[2]);
            const isDark = luma < 100;
            const currentState = isDark ? 'dark' : 'light';

            console.log(`检测主题: luma=${luma}, state=${currentState}`);

            if (currentState !== lastState) {
                if (isDark) {
                    document.documentElement.style.setProperty('--gemini-bubble-bg', DARK_BG);
                    document.documentElement.style.setProperty('--gemini-bubble-text', DARK_TEXT);
                } else {
                    document.documentElement.style.setProperty('--gemini-bubble-bg', LIGHT_BG);
                    document.documentElement.style.setProperty('--gemini-bubble-text', LIGHT_TEXT);
                }
                lastState = currentState;
            }
        }
    }

    // 防抖函数：防止 MutationObserver 过于频繁触发导致卡顿
    function debouncedCheck() {
        if (checkTimeout) clearTimeout(checkTimeout);
        checkTimeout = setTimeout(() => {
            checkAndSetTheme();
        }, 50); // 50ms 延迟
    }

    // --- 启动新版检测网 ---

    // 1. 立即执行一次 (初始化)
    checkAndSetTheme();

    // 2. 核心：监听 document.documentElement (HTML标签)
    // 技巧：开启 subtree: true，这样即使 body 的 class 变了，父级也能听到
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        for (const mutation of mutations) {
            // 过滤：我们只关心 HTML 或 BODY 的属性变化
            // 这可以屏蔽掉页面内部无数 div 的变化，提升性能
            if (mutation.target === document.documentElement || mutation.target === document.body) {
                shouldCheck = true;
                break; // 只要发现一个相关变化，就触发检查
            }
        }
        if (shouldCheck) {
            debouncedCheck();
        }
    });

    observer.observe(document.documentElement, {
        attributes: true,
        subtree: true,             // 必须：穿透监听子树
        attributeFilter: ['class', 'style', 'data-theme'] // 过滤：只看这些属性
    });

    // 3. 系统主题监听 (保留)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkAndSetTheme);
    }

})();
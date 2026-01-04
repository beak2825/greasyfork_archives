// ==UserScript==
// @name         B站深浅色主题跟随系统
// @namespace    https://cefathiamidine.github.io
// @version      2.0
// @description  根据系统深色模式自动切换B站主题
// @author       cefathiamidine
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552390/B%E7%AB%99%E6%B7%B1%E6%B5%85%E8%89%B2%E4%B8%BB%E9%A2%98%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/552390/B%E7%AB%99%E6%B7%B1%E6%B5%85%E8%89%B2%E4%B8%BB%E9%A2%98%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 假设 B 站深色模式会在 <html> 元素上添加 'dark' 类或类似标识
    // 实际是通过 Cookie 来控制，但我们可以通过 CSS 媒体查询再次确认当前页面的状态
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    /**
     * 根据系统偏好设置 B 站主题 Cookie
     * @param {boolean} isDark - 系统当前是否偏好深色模式
     */
    function setBiliTheme(isDark) {
        const theme = isDark ? "dark" : "light";
        // 设置 theme_style Cookie。
        document.cookie = `theme_style=${theme}; path=/; max-age=${365 * 24 * 60 * 60}`;
        // console.log(`[B站主题跟随核心] 已设置主题 Cookie: ${theme}`);
        return theme;
    }

    /**
     * 核心检查和切换逻辑：
     * 1. 检查系统主题和当前 Cookie 是否一致。
     * 2. 如果不一致，设置新 Cookie 并强制刷新。
     * @param {boolean} isDark - 系统当前是否偏好深色模式
     * @param {string} trigger - 触发源 ('initial' or 'change')
     */
    function checkAndApplyTheme(isDark, trigger) {
        const systemTheme = isDark ? "dark" : "light";
        
        // B站主题的 Cookie 键
        const cookieTheme = document.cookie.includes('theme_style=dark') ? "dark" : 
                            document.cookie.includes('theme_style=light') ? "light" : 
                            null;

        // 步骤 1: 检查是否需要切换
        if (cookieTheme === systemTheme) {
            if (trigger === 'initial') {
                // 页面加载时，主题匹配，无需操作。
                // console.log(`[B站主题跟随核心 - ${trigger}] 系统主题与 Cookie 匹配: ${systemTheme}`);
            }
            return;
        }

        // 步骤 2: 主题不匹配，需要操作
        
        // 设置新的主题 Cookie
        setBiliTheme(isDark);

        // 如果是系统主题切换触发的，立即刷新以应用新 Cookie
        if (trigger === 'change') {
            console.log(`[B站主题跟随核心 - ${trigger}] 检测到主题变化至 ${systemTheme}。立即设置 Cookie 并刷新页面...`);
            window.location.reload();
        } 
        
        // 如果是页面加载时触发的 (即刷新后的自我校正)，且页面已经加载完成
        // 注意：在 document-start 阶段，readyState 几乎总是 'loading'。
        // 为了确保在加载后能生效，我们在加载结束时再次检查。
        else if (trigger === 'initial' && document.readyState === 'complete') {
             console.warn(`[B站主题跟随核心 - ${trigger}] 🚨 自我校正：系统主题(${systemTheme})与Cookie(${cookieTheme})不符，页面主题可能错误。强制刷新！`);
             window.location.reload();
        }
    }
    
    // ========================
    // 核心逻辑执行
    // ========================

    // **A. 页面加载时 (document-start)**
    // 立即执行检查和设置，确保 B站的 JS 在读取 Cookie 时是正确的。
    checkAndApplyTheme(darkModeQuery.matches, 'initial');
    
    // **B. 实时监听主题变化**
    darkModeQuery.addEventListener('change', (event) => {
        // 当系统主题切换时，立即设置 Cookie 并触发刷新。
        checkAndApplyTheme(event.matches, 'change');
    });

    // **C. 页面完全加载后的自我校正 (您要求的新机制)**
    // 监听页面的 'load' 事件，确保页面所有资源加载完毕后，再进行一次最终检查。
    // 这解决了 B站自身的 JS 可能在加载后期覆盖 Cookie 的问题。
    window.addEventListener('load', () => {
         // 再次执行检查，如果 Cookie 仍未匹配系统主题 (这可能意味着 B站 JS 覆盖了它)，则强制再次刷新校正。
         checkAndApplyTheme(darkModeQuery.matches, 'initial');
    });

})();
// ==UserScript==
// @name         微博自动切换深浅主题
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.2
// @description  根据系统颜色模式自动切换网页微博的日间/夜间模式
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553064/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%B7%B1%E6%B5%85%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/553064/%E5%BE%AE%E5%8D%9A%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%B7%B1%E6%B5%85%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测系统颜色模式
    function getSystemColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // 查找并点击模式切换按钮
    function toggleColorMode() {
        const systemMode = getSystemColorScheme();
        const targetMode = systemMode === 'dark' ? '夜间模式' : '日间模式';

        // 查找所有可能的按钮
        const buttons = document.querySelectorAll('button[title="夜间模式"], button[title="日间模式"]');

        for (let button of buttons) {
            if (button.title === targetMode) {
                console.log(`检测到系统为${systemMode}模式，点击${targetMode}按钮`);
                button.click();
                break;
            }
        }
    }

    // 监听系统颜色模式变化
    function initColorSchemeListener() {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        colorSchemeQuery.addEventListener('change', (e) => {
            console.log('系统颜色模式发生变化，重新调整页面模式');
            // 延迟执行以确保页面完全加载
            setTimeout(toggleColorMode, 100);
        });
    }

    // 页面加载完成后执行
    function init() {
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(toggleColorMode, 500);
                initColorSchemeListener();
            });
        } else {
            setTimeout(toggleColorMode, 500);
            initColorSchemeListener();
        }
    }

    // 启动脚本
    init();

    // 添加一个手动触发函数到全局，方便调试
    window.manualToggleColorMode = toggleColorMode;
})();
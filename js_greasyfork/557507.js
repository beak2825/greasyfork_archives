// ==UserScript==
// @name         NewsNow强制亮色主题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  强制newsnow.busiyi.world网站使用亮色主题，移除dark类
// @author       异世邪君
// @match        https://newsnow.busiyi.world/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557507/NewsNow%E5%BC%BA%E5%88%B6%E4%BA%AE%E8%89%B2%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/557507/NewsNow%E5%BC%BA%E5%88%B6%E4%BA%AE%E8%89%B2%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 只对特定网站生效
    const targetDomain = 'newsnow.busiyi.world';
    if (window.location.hostname !== targetDomain) {
        return;
    }

    // 移除dark类并确保添加light类
    const forceLightTheme = () => {
        const htmlElement = document.documentElement;

        // 如果存在dark类，移除它
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            console.log('已移除dark类，强制使用亮色主题');
        }

        // 确保添加light类（如果网站支持）
        if (!htmlElement.classList.contains('light')) {
            htmlElement.classList.add('light');
        }

        // 同时检查body元素（如果网站也在body上设置主题类）
        const bodyElement = document.body;
        if (bodyElement && bodyElement.classList.contains('dark')) {
            bodyElement.classList.remove('dark');
            bodyElement.classList.add('light');
        }
    };

    // 立即执行一次
    forceLightTheme();

    // 监听DOM变化，防止后续脚本重新添加dark类
    const observer = new MutationObserver((mutations) => {
        let shouldForceLight = false;
        mutations.forEach((mutation) => {
            if (mutation.target === document.documentElement || mutation.target === document.body) {
                if (mutation.attributeName === 'class') {
                    shouldForceLight = true;
                }
            }
        });

        if (shouldForceLight) {
            forceLightTheme();
        }
    });

    // 观察html和body元素的class属性变化
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });

    if (document.body) {
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    } else {
        // 如果body还没加载，等DOMContentLoaded后再观察
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    // 监听页面加载完成，再检查一次
    window.addEventListener('load', forceLightTheme);

    // 添加样式覆盖，确保亮色主题生效
    const addOverrideStyles = () => {
        const styleId = 'force-light-theme-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 强制亮色主题样式覆盖 */
            html.dark, body.dark {
                background-color: #ffffff !important;
                color: #000000 !important;
            }

            /* 防止任何元素重新启用暗色主题 */
            * {
                color-scheme: light only !important;
            }
        `;
        document.head.appendChild(style);
    };

    // 在DOM加载后添加样式覆盖
    if (document.head) {
        addOverrideStyles();
    } else {
        document.addEventListener('DOMContentLoaded', addOverrideStyles);
    }

    // 额外安全措施：定期检查（防止动态内容更改主题）
    setInterval(forceLightTheme, 2000);
})();
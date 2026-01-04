// ==UserScript==
// @name         用 DarkReader时,京东的关闭按钮颜色问题 (JD Close Icon Smart Dark Mode)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license      MIT
// @description  智能适配Dark Reader，自动切换京东弹窗关闭图标颜色 (增强调试版) - 支持多类名
// @author       Hello
// @match        https://www.jd.com/*
// @match        https://*.jd.com/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/555593/%E7%94%A8%20DarkReader%E6%97%B6%2C%E4%BA%AC%E4%B8%9C%E7%9A%84%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE%E9%A2%9C%E8%89%B2%E9%97%AE%E9%A2%98%20%28JD%20Close%20Icon%20Smart%20Dark%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555593/%E7%94%A8%20DarkReader%E6%97%B6%2C%E4%BA%AC%E4%B8%9C%E7%9A%84%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE%E9%A2%9C%E8%89%B2%E9%97%AE%E9%A2%98%20%28JD%20Close%20Icon%20Smart%20Dark%20Mode%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义多个目标类名 [5](@ref)
    const targetClassNames = ['_closeIcon_1ygkr_39', '_closeIcon_1o39t_42'];
    const darkModeFilter = 'brightness(0) invert(1)';
    const lightModeFilter = '';

    // 策略1：检测Dark Reader设置的特定属性
    function isDarkReaderActiveByAttribute() {
        const rootElement = document.documentElement;
        const bodyElement = document.body;
        // 检查常见的Dark Reader属性
        const attributesToCheck = [
            'data-darkreader-mode',
            'data-darkreader-scheme',
            'data-darkreader-media',
            'data-dm'
        ];
        for (let attr of attributesToCheck) {
            if (rootElement.hasAttribute(attr) || bodyElement.hasAttribute(attr)) {
                return true;
            }
        }
        return false;
    }

    // 策略2：检测Dark Reader注入的特定CSS样式或类名
    function isDarkReaderActiveByStyle() {
        const styleSheets = document.styleSheets;
        for (let sheet of styleSheets) {
            try {
                if (sheet.href && sheet.href.includes('darkreader') || sheet.ownerNode && sheet.ownerNode.innerText.includes('darkreader')) {
                    return true;
                }
            } catch (e) {
                // 可能因CORS政策无法读取跨域样式表，忽略错误
            }
        }
        // 检查是否有Dark Reader添加的特定样式规则
        if (window.getComputedStyle(document.body).filter.includes('darkreader') ||
            document.documentElement.classList.contains('darkreader')) {
            return true;
        }
        return false;
    }

    // 策略3：检测页面整体亮度（辅助判断）
    function isPageLikelyDark() {
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        // 简单判断背景色是否为深色
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            return brightness < 128;
        }
        return false;
    }

    // 综合判断Dark Reader是否激活
    function checkDarkReaderStatus() {
        const attributeActive = isDarkReaderActiveByAttribute();
        const styleActive = isDarkReaderActiveByStyle();
        const pageDark = isPageLikelyDark();

        // 主要依据属性和样式检测，页面亮度作为辅助参考
        if (attributeActive || styleActive) {
            return true;
        } else {
            return false;
        }
    }

    function applyFilterBasedOnMode() {
        // 创建CSS选择器来匹配所有目标类名的元素 [5](@ref)
        const selector = targetClassNames.map(className => `.${className}`).join(', ');
        const closeIcons = document.querySelectorAll(selector);

        if (closeIcons.length === 0) return;

        const isDarkMode = checkDarkReaderStatus();
        const filterValue = isDarkMode ? darkModeFilter : lightModeFilter;

        closeIcons.forEach(icon => {
            // 在应用滤镜前检查元素是否存在 [5](@ref)
            if (icon && icon.style) {
                icon.style.filter = filterValue;
            }
        });
    }

    // 使用防抖优化性能
    let observerTimeout;
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            let shouldApply = false;
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldApply = true;
                    break;
                }
                if (mutation.type === 'attributes' &&
                    (mutation.target === document.documentElement || mutation.target === document.body) &&
                    (mutation.attributeName.includes('darkreader') || mutation.attributeName === 'style')) {
                    shouldApply = true;
                    break;
                }
            }
            if (shouldApply) {
                setTimeout(applyFilterBasedOnMode, 100);
            }
        }, 50);
    });

    // 开始观察
    observer.observe(document.body, { childList: true, subtree: true });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-darkreader-mode', 'data-darkreader-scheme', 'class', 'style'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-darkreader-mode', 'data-darkreader-scheme', 'class', 'style'] });

    // 初始执行
    setTimeout(applyFilterBasedOnMode, 1000);

    // 监听页面显示变化（切换标签页时重新检测）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(applyFilterBasedOnMode, 500);
        }
    });

})();
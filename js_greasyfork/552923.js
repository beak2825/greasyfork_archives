// ==UserScript==
// @name         移除微博首页广告
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.2
// @description  隐藏网页微博首页广告
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552923/%E7%A7%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/552923/%E7%A7%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏所有 class 以 TipsAd 开头的元素
    function hideTipsAdElements() {
        // 使用属性选择器查找所有 class 以 TipsAd 开头的元素
        const tipsAdElements = document.querySelectorAll('[class*="TipsAd"]');
        let hiddenCount = 0;

        tipsAdElements.forEach(element => {
            const classList = element.className || '';
            // 检查是否包含以 TipsAd 开头的 class
            if (classList.split(/\s+/).some(className => className.startsWith('TipsAd'))) {
                hideElement(element);
                hiddenCount++;
            }
        });

        if (hiddenCount > 0) {
            console.log(`[Tampermonkey] 已隐藏 ${hiddenCount} 个 TipsAd 开头的元素`);
        }
        
        return hiddenCount;
    }

    // 更精确的选择器版本
    function hideTipsAdElementsPrecise() {
        // 创建精确的选择器，匹配 class 以 TipsAd 开头的元素
        const selectors = [
            '[class^="TipsAd"]', // class 以 TipsAd 开头
            '[class*=" TipsAd"]' // class 包含空格后跟 TipsAd（多个 class 的情况）
        ];
        
        let allElements = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => allElements.push(element));
        });

        // 去重
        const uniqueElements = [...new Set(allElements)];
        
        uniqueElements.forEach(element => {
            hideElement(element);
        });

        if (uniqueElements.length > 0) {
            console.log(`[Tampermonkey] 精确选择器隐藏了 ${uniqueElements.length} 个 TipsAd 元素`);
        }
        
        return uniqueElements.length;
    }

    // 彻底隐藏元素的函数
    function hideElement(element) {
        if (!element || !element.style) return;
        
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.height = '0';
        element.style.width = '0';
        element.style.margin = '0';
        element.style.padding = '0';
        element.style.pointerEvents = 'none';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        element.style.overflow = 'hidden';
        
        // 设置重要属性
        element.setAttribute('data-tampermonkey-hidden', 'true');
    }

    // 注入 CSS 确保样式持久化
    const css = `
        [class^="TipsAd"],
        [class*=" TipsAd"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
            overflow: hidden !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 使用 MutationObserver 监控 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        let totalHidden = 0;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 检查新添加的节点
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查当前节点是否有 TipsAd class
                        const classList = node.className || '';
                        if (classList.split(/\s+/).some(className => className.startsWith('TipsAd'))) {
                            hideElement(node);
                            totalHidden++;
                        }
                        
                        // 检查子节点
                        if (node.querySelectorAll) {
                            const childElements = node.querySelectorAll('[class*="TipsAd"]');
                            childElements.forEach(element => {
                                const childClassList = element.className || '';
                                if (childClassList.split(/\s+/).some(className => className.startsWith('TipsAd'))) {
                                    if (!element.getAttribute('data-tampermonkey-hidden')) {
                                        hideElement(element);
                                        totalHidden++;
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
        
        // 额外全局检查
        const additionalHidden = hideTipsAdElements();
        totalHidden += additionalHidden;
        
        if (totalHidden > 0) {
            console.log(`[Tampermonkey] MutationObserver 隐藏了 ${totalHidden} 个 TipsAd 元素`);
        }
    });

    // 开始观察
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 定时检查兜底
    const checkInterval = setInterval(() => {
        const hiddenCount = hideTipsAdElements();
        if (hiddenCount > 0) {
            console.log(`[Tampermonkey] 定时检查：隐藏了 ${hiddenCount} 个 TipsAd 元素`);
        }
    }, 1500);

    // 页面加载完成后执行一次
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            hideTipsAdElements();
            hideTipsAdElementsPrecise();
        }, 100);
    });

    // 30秒后停止定时检查（避免长期占用资源）
    setTimeout(() => {
        clearInterval(checkInterval);
        console.log('[Tampermonkey] 停止定时检查');
    }, 30000);

    // 初始执行
    setTimeout(() => {
        hideTipsAdElements();
        hideTipsAdElementsPrecise();
    }, 0);

    console.log('[Tampermonkey] 移除微博首页广告 已加载');
})();
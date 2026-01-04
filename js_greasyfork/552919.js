// ==UserScript==
// @name         移除微博感兴趣的人
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.3
// @description  隐藏网页微博上你可能感兴趣的人
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552919/%E7%A7%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E6%84%9F%E5%85%B4%E8%B6%A3%E7%9A%84%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552919/%E7%A7%BB%E9%99%A4%E5%BE%AE%E5%8D%9A%E6%84%9F%E5%85%B4%E8%B6%A3%E7%9A%84%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在文档加载前就注入 CSS
    const css = `
        .wbpro-side-panel-parent {
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
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 查找 wbpro-side-panel 的父元素并隐藏
    function hideParentPanel() {
        const sidePanel = document.querySelector('.wbpro-side-panel');
        if (sidePanel && sidePanel.parentElement) {
            const parentElement = sidePanel.parentElement;
            
            // 给父元素添加特定类名，方便 CSS 选择
            parentElement.classList.add('wbpro-side-panel-parent');
            
            // 彻底隐藏父元素
            parentElement.style.display = 'none';
            parentElement.style.visibility = 'hidden';
            parentElement.style.opacity = '0';
            parentElement.style.height = '0';
            parentElement.style.width = '0';
            parentElement.style.margin = '0';
            parentElement.style.padding = '0';
            parentElement.style.pointerEvents = 'none';
            parentElement.style.position = 'absolute';
            parentElement.style.left = '-9999px';
            parentElement.style.top = '-9999px';
            
            // console.log('[Tampermonkey] 已隐藏 wbpro-side-panel 的父元素');
            return true;
        }
        return false;
    }

    // 使用 MutationObserver 监控 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        let found = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 检查新添加的节点
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查当前节点是否是 wbpro-side-panel
                        if (node.classList && node.classList.contains('wbpro-side-panel')) {
                            found = hideParentPanel() || found;
                        }
                        // 检查子节点中是否有 wbpro-side-panel
                        const sidePanels = node.querySelectorAll?.('.wbpro-side-panel') || [];
                        if (sidePanels.length > 0) {
                            found = hideParentPanel() || found;
                        }
                    }
                });
            }
        });
        
        // 如果没有在新添加的节点中找到，再全局检查一次
        if (!found) {
            hideParentPanel();
        }
    });

    // 开始观察
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 定时检查兜底
    setInterval(() => {
        hideParentPanel();
    }, 1000);

    // 页面加载完成后执行一次
    window.addEventListener('DOMContentLoaded', () => {
        hideParentPanel();
    });

    // 初始执行一次
    setTimeout(hideParentPanel, 100);

    console.log('[Tampermonkey] 移除微博感兴趣的人 已加载');
})();
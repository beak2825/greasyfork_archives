// ==UserScript==
// @name         爱壹帆网站优化器
// @name:en      IYF Website Optimizer
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0
// @description  优化爱壹帆网站体验：自动屏蔽弹窗广告、移除干扰元素、提升浏览体验
// @description:en Optimize IYF website experience: automatically block popup ads, remove distracting elements, and improve browsing experience
// @author       YourUsername
// @license      MIT
// @match        *://*.iyf.tv/*
// @match        *://iyf.tv/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iyf.tv
// @supportURL   https://github.com/your-username/iyf-ads-optimizer/issues
// @homepageURL  https://github.com/your-username/iyf-ads-optimizer
// @downloadURL https://update.greasyfork.org/scripts/554874/%E7%88%B1%E5%A3%B9%E5%B8%86%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554874/%E7%88%B1%E5%A3%B9%E5%B8%86%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止元素弹出的通用函数
    function preventElementPopup(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
            element.setAttribute('data-blocked', 'true');
        }
    }

    // 移除元素的通用函数
    function removeElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.remove();
        });
    }

    // 处理 vg-pause-f 标签元素
    function handleVgPauseF() {
        // 查找所有带有 vg-pause-f 类的元素
        const vgPauseElements = document.querySelectorAll('.vg-pause-f');
        vgPauseElements.forEach(element => {
            // 阻止点击事件
            element.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, true);

            // 阻止右键菜单
            element.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            }, true);

            // 设置样式使其不可见且不可交互
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.pointerEvents = 'none';
        });
    }

    // 处理 ps pggf 类的div
    function handlePsPggf() {
        removeElement('.ps.pggf');
    }

    // 处理 publicbox ng-star-inserted 元素
    function handlePublicBox() {
        preventElementPopup('.publicbox.ng-star-inserted');

        // 同时移除所有匹配的元素
        removeElement('.publicbox.ng-star-inserted');
    }

    // 主要处理函数
    function optimizeWebsite() {
        console.log('爱壹帆网站优化器运行中...');

        // 处理各种元素
        handleVgPauseF();
        handlePsPggf();
        handlePublicBox();
    }

    // 使用 MutationObserver 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 当有新元素添加时，重新运行优化
                optimizeWebsite();
            }
        });
    });

    // 配置观察选项
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    };

    // 开始观察整个文档
    observer.observe(document.body, observerConfig);

    // 页面加载完成后立即运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeWebsite);
    } else {
        optimizeWebsite();
    }

    // 定期检查（作为备用机制）
    setInterval(optimizeWebsite, 2000);

    // 添加CSS样式来全局屏蔽这些元素
    const style = document.createElement('style');
    style.textContent = `
        .vg-pause-f {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
        }

        .ps.pggf {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .publicbox.ng-star-inserted {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }

        /* 阻止所有可能的弹窗相关样式 */
        [class*="popup"], [class*="modal"], [class*="dialog"], [class*="overlay"] {
            display: none !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(style);

    console.log('爱壹帆网站优化器已启动');
})();
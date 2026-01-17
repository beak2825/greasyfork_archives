// ==UserScript==
// @name         高德地图界面优化
// @namespace    http://tampermonkey.net/
// @version      3.3.0
// @description  删除高德地图页面中的版权信息、APP下载提示和Logo
// @author       大生
// @match        https://gaode.com/*
// @grant        none
// @icon         https://www.gaode.com/favicon.ico
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/552763/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/552763/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 删除元素的函数
    function removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
            console.log(`已删除元素: ${selector}`);
        }
    }

    // 删除多个元素的函数

    // 调整工具栏位置的函数
    function adjustToolbarPosition() {
        const loginbox = document.querySelector('div#loginbox');
        const layerbox = document.querySelector('div#layerbox');

        if (loginbox && layerbox) {
            // 避免重复调整
            if (layerbox.dataset.adjusted === 'true') {
                return;
            }

            // 获取登录框的位置信息
            const loginboxRect = loginbox.getBoundingClientRect();
            const layerboxRect = layerbox.getBoundingClientRect();

            // 计算新位置：登录框左侧减去工具栏宽度再减去间距
            const newLeft = loginboxRect.left - layerboxRect.width - 30;

            // 确保不会移动到屏幕外
            const finalLeft = Math.max(10, newLeft);

            // 应用新位置，保持原有尺寸
            layerbox.style.position = 'fixed';
            layerbox.style.left = finalLeft + 'px';
            layerbox.style.top = loginboxRect.top + 'px';
            layerbox.style.zIndex = '1000';

            // 标记已调整，避免重复执行
            layerbox.dataset.adjusted = 'true';

            console.log(`工具栏位置已调整: left=${finalLeft}px, top=${loginboxRect.top}px`);
        }
    }

    // 等待页面加载完成后执行优化操作
    function cleanupElements() {
        // 1. 删除版权信息
        removeElement('div.amap-copyright');

        // 2. 删除APP下载提示
        removeElement('div#amapAppDownload.amap-app-download.usel');

        // 3. 删除Logo
        removeElement('a.amap-logo');

        // 4. 调整工具栏位置
        adjustToolbarPosition();

        console.log('高德地图界面优化完成');
    }

    // 页面加载完成后立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cleanupElements);
    } else {
        cleanupElements();
    }

    // 使用MutationObserver监听DOM变化，处理动态加载的元素
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 延迟执行，确保元素完全加载
                setTimeout(cleanupElements, 100);
            }
        });
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听窗口大小变化，重新调整工具栏位置
    window.addEventListener('resize', function () {
        setTimeout(adjustToolbarPosition, 100);
    });

    // 定期检查并执行优化（防止某些元素延迟加载）
    setInterval(cleanupElements, 2000);

})();
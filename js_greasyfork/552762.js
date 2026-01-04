// ==UserScript==
// @name         百度地图界面优化
// @namespace    http://tampermonkey.net/
// @version      3.2.1
// @description  删除百度地图页面中的版权信息、Logo、消息中心，并将比例尺移到左下角
// @author       大生
// @match        https://map.baidu.com/*
// @grant        none
// @icon         https://map.baidu.com/favicon.ico
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/552762/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/552762/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 删除元素的函数
    function removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
            console.log(`已删除元素: ${selector}`);
            return true;
        }
        return false;
    }

    // 移动比例尺到左下角的函数
    function moveScaleToBottomLeft() {
        // 使用更通用的选择器匹配比例尺元素
        const scaleElement = document.querySelector('div.BMap_scaleCtrl.anchorBR') ||
            document.querySelector('div[class*="BMap_scaleCtrl"]');

        if (scaleElement && !scaleElement.dataset.moved) {
            // 移动到左下角
            scaleElement.style.position = 'fixed';
            scaleElement.style.left = '10px';
            scaleElement.style.bottom = '10px';
            scaleElement.style.right = 'auto';
            scaleElement.style.top = 'auto';
            scaleElement.style.zIndex = '1000';

            // 标记已移动，避免重复执行
            scaleElement.dataset.moved = 'true';

            console.log(`比例尺已移动到左下角: ${scaleElement.className}`);
        }
    }

    // 删除所有包含"-banner"的元素
    function removeAllBannerElements() {
        let removed = false;

        // 查找所有包含"-banner"类名的元素
        const bannerElements = document.querySelectorAll('div[class*="-banner"]');

        bannerElements.forEach(element => {
            // 检查是否是下载横幅，如果是则删除其父元素
            if (element.classList.contains('download-banner') && element.parentElement) {
                element.parentElement.remove();
                console.log('已删除下载横幅及其父元素');
                removed = true;
            } else {
                element.remove();
                console.log(`已删除横幅元素: ${element.className}`);
                removed = true;
            }
        });

        if (removed) {
            console.log('所有横幅元素已删除');
        }
    }

    // 执行所有优化操作
    function optimizeBaiduMap() {
        // 1. 删除版权信息
        removeElement('div.BMap_cpyCtrl.BMap_noprint.anchorBL');

        // 2. 删除Logo
        removeElement('div#newuilogo');

        // 3. 删除消息中心
        removeElement('div#message-center.has-message') || removeElement('div#message-center');

        // 4. 删除所有包含"-banner"的横幅元素（动态出现）
        removeAllBannerElements();

        // 5. 移动比例尺到左下角
        moveScaleToBottomLeft();

        console.log('百度地图界面优化完成');
    }

    // 页面加载完成后立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeBaiduMap);
    } else {
        optimizeBaiduMap();
    }

    // 使用MutationObserver监听DOM变化，处理动态加载的元素
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查新增的节点中是否包含目标元素
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查是否是包含"-banner"的横幅元素
                        if (node.classList && node.className.includes('-banner')) {
                            setTimeout(() => removeAllBannerElements(), 50);
                        }

                        // 检查子元素中是否包含横幅元素
                        if (node.querySelector && node.querySelector('div[class*="-banner"]')) {
                            setTimeout(() => removeAllBannerElements(), 50);
                        }
                    }
                });

                // 延迟执行完整优化，确保元素完全加载
                setTimeout(optimizeBaiduMap, 100);
            }
        });
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听窗口大小变化，重新调整比例尺位置
    window.addEventListener('resize', function () {
        setTimeout(moveScaleToBottomLeft, 100);
    });

    // 定期检查并执行优化（防止某些元素延迟加载）
    setInterval(optimizeBaiduMap, 3000);

    // 更频繁地检查动态横幅元素
    setInterval(removeAllBannerElements, 1000);

})();

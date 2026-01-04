// ==UserScript==
// @name         industry Checker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add check links to shop names on GoodsFox website
// @author       sheire hu
// @match        https://ydcms.umlife.com/*
// @match        https://app.goodsfox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553115/industry%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/553115/industry%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止在iframe中运行
    if (window !== window.top) return;

    // 选择器配置
    const selectors = [
        'a.el-tooltip.gp-table-shop__info-name',
        'a.el-tooltip.gp-table-shop__name', // 明确指定是 <a> 元素
        '.ad-card-campaign-item__name',
        'p.gp-shop-base__title-text',
        'a[href*="/shop/"]',
        'div.shop-name',
        '.shop-title'
    ];

    // Function to add check links
    function addCheckLinks() {
        // 使用所有配置的选择器查找元素
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);

            elements.forEach(element => {
                // Check if check link already exists to avoid duplicates
                // 改进的重复检查逻辑
                if (element.nextSibling &&
                    element.nextSibling.nodeType === Node.ELEMENT_NODE &&
                    element.nextSibling.classList &&
                    element.nextSibling.classList.contains('goodsfox-check-link')) {
                    return;
                }

                // Extract the text content from the element
                const textContent = element.textContent.trim();

                // Skip if no text content
                if (!textContent) return;

                // Create new check link
                const checkLink = document.createElement('a');
                checkLink.href = `https://ydcms.umlife.com/#/os_website?page=1&keyword=${encodeURIComponent(textContent)}`;
                checkLink.textContent = '🏠Check';
                checkLink.className = 'goodsfox-check-link';
                checkLink.style.marginLeft = '10px';
                checkLink.style.cursor = 'pointer';
                checkLink.style.color = '#007bff'; // 符合用户偏好的蓝色
                checkLink.style.textDecoration = 'underline';
                checkLink.target = '_blank'; // 确保在新标签页打开

                // 添加点击事件处理程序，打开小窗口
                checkLink.addEventListener('click', function(e) {
                    e.preventDefault(); // 阻止默认跳转行为

                    // 计算窗口尺寸（浏览器窗口的60%）
                    const windowWidth = Math.floor(window.innerWidth * 0.6);
                    const windowHeight = Math.floor(window.innerHeight * 0.6);

                    // 计算窗口位置（右下角显示）
                    const left = Math.floor(window.screenX + window.outerWidth - windowWidth);
                    const top = Math.floor(window.screenY + window.outerHeight - windowHeight);

                    // 打开小窗口
                    const features = `width=${windowWidth},height=${windowHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`;
                    window.open(this.href, '_blank', features);
                });

                // Insert the check link after the element
                element.parentNode.insertBefore(checkLink, element.nextSibling);
            });
        });
    }

    // Run immediately
    setTimeout(addCheckLinks, 3000); // 延迟执行确保页面加载完成

    // Set up a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        let shouldAddLinks = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldAddLinks = true;
            }
        });

        if (shouldAddLinks) {
            setTimeout(addCheckLinks, 1000); // 延迟执行以确保DOM完全加载
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
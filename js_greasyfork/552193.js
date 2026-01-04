// ==UserScript==
// @license      MIT
// @name         Sora2 去水印-大洋芋去水印dyysy.com
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在Sora视频详情页的菜单中，于“Download”按钮旁增加一个“大洋芋-去水印下载”按钮。
// @author       CodeBuddy
// @match        https://sora.chatgpt.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552193/Sora2%20%E5%8E%BB%E6%B0%B4%E5%8D%B0-%E5%A4%A7%E6%B4%8B%E8%8A%8B%E5%8E%BB%E6%B0%B4%E5%8D%B0dyysycom.user.js
// @updateURL https://update.greasyfork.org/scripts/552193/Sora2%20%E5%8E%BB%E6%B0%B4%E5%8D%B0-%E5%A4%A7%E6%B4%8B%E8%8A%8B%E5%8E%BB%E6%B0%B4%E5%8D%B0dyysycom.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log('[Sor2 去水印 - 去水印] 脚本已启动。');

    /**
     * 防抖函数，防止函数因DOM频繁变动而被高频触发，提升性能。
     * @param {Function} func 要执行的函数
     * @param {number} wait 延迟时间（毫秒）
     * @returns {Function}
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * 查找 "Download" 按钮并添加去水印下载按钮。
     */
    function addNoWatermarkButton() {
        // 脚本只在视频详情页（URL中包含 /p/）生效
        if (!window.location.href.includes('/p/')) {
            return;
        }

        const downloadButtonText = 'Download';

        // 查找页面上所有的菜单项
        document.querySelectorAll('[role="menuitem"]').forEach(buttonElement => {
            // 检查文本内容是否为 "Download"
            if (buttonElement.textContent.trim() === downloadButtonText) {
                const parent = buttonElement.parentNode;

                // 确保父节点存在，并且我们的自定义按钮尚未添加
                if (parent && !parent.querySelector('.sora-helper-no-watermark-btn')) {
                    console.log('[Sora Helper - 去水印] 找到 "Download" 按钮，正在添加新按钮...');

                    // 创建一个新 div 元素作为我们的按钮
                    const newButton = document.createElement('div');

                    // 复制原按钮的 class 以保持样式一致，并添加一个唯一标识 class
                    newButton.className = buttonElement.className + ' sora-helper-no-watermark-btn';
                    newButton.setAttribute('role', 'menuitem');

                    // 使用原按钮的 innerHTML 结构，只替换文本内容
                    newButton.innerHTML = buttonElement.innerHTML.replace(downloadButtonText, '大洋芋-去水印下载');

                    // 添加点击事件
                    newButton.addEventListener('click', (e) => {
                        e.preventDefault();  // 阻止默认事件
                        e.stopPropagation(); // 阻止事件冒泡，防止关闭菜单

                        // 在新标签页中打开去水印解析网站
                        window.open(`https://dyysy.com/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                    });

                    // 将新按钮插入到原 "Download" 按钮之后
                    parent.insertBefore(newButton, buttonElement.nextSibling);
                    console.log('[Sora Helper - 去水印] “大洋芋-去水印下载”按钮已成功添加。');
                }
            }
        });
    }

    // 创建一个 MutationObserver 来监听DOM的变化。
    // 这对于像Sora这样的单页应用（SPA）至关重要，因为菜单是动态加载的。
    const observer = new MutationObserver(debounce(addNoWatermarkButton, 500));

    // 配置观察者：观察 body 元素下的所有后代节点的增删
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 在脚本加载后，立即尝试执行一次，以应对页面已加载完成的情况
    addNoWatermarkButton();

})();

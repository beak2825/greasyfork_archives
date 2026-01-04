// ==UserScript==
// @name         元宝参考文献复制
// @namespace    https://github.com/engrecho/yuanbao_ref_link
// @description  采集元宝分享页面的参考文献，并按照Markdown格式复制到剪贴板
// @icon         https://xj-psd-1258344703.cos.ap-guangzhou.myqcloud.com/image/hunyuan/brand2025/logo64@3x.png
// @author       Jaylon
// @match        https://yb.tencent.com/s/*
// @grant        GM_setClipboard
// @version      1.2
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551307/%E5%85%83%E5%AE%9D%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/551307/%E5%85%83%E5%AE%9D%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = '复制参考文献';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#0056b3';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#007bff';
        });

        button.addEventListener('click', copyReferences);

        return button;
    }

    // 复制参考文献到剪贴板
    function copyReferences() {
        try {
            // 查找目标div
            const targetDiv = document.querySelector('.hyc-card-box-search-ref');
            if (!targetDiv) {
                alert('未找到参考文献区域，请确保页面已完全加载');
                return;
            }

            // 查找所有li元素
            const liElements = targetDiv.querySelectorAll('ul li');
            if (liElements.length === 0) {
                alert('未找到参考文献列表');
                return;
            }

            // 提取data-title和data-url
            const references = [];
            liElements.forEach((li, index) => {
                const title = li.getAttribute('data-title');
                const url = li.getAttribute('data-url');

                if (title && url) {
                    references.push(`[${index + 1}. ${title}](${url})`);
                }
            });

            if (references.length === 0) {
                alert('未找到有效的参考文献数据');
                return;
            }

            // 格式化为Markdown
            const markdownContent = `# 参考文献\n\n${references.join('\n\n')}`;

            // 复制到剪贴板
            GM_setClipboard(markdownContent, 'text');

            // 显示成功提示
            showNotification('已按照Markdown格式复制参考文献');

        } catch (error) {
            console.error('复制参考文献时出错:', error);
            alert('复制失败，请检查控制台错误信息');
        }
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 3秒后自动移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 等待页面加载完成后添加按钮
    function init() {
        // 检查是否已经添加过按钮
        if (document.querySelector('#reference-copy-button')) {
            return;
        }

        const button = createCopyButton();
        button.id = 'reference-copy-button';
        document.body.appendChild(button);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面变化，确保在动态加载的内容中也能工作
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // 检查是否有新的参考文献内容加载
                const targetDiv = document.querySelector('.hyc-card-box-search-ref');
                if (targetDiv && !document.querySelector('#reference-copy-button')) {
                    init();
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
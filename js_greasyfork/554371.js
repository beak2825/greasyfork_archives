// ==UserScript==
// @name         磁力链接一键复制工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为页面中的磁力链接添加复制按钮，点击即可复制
// @author       豆包编程助手
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554371/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/554371/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建复制提示框样式
    const style = document.createElement('style');
    style.textContent = `
        .magnet-copy-btn {
            margin-left: 5px;
            padding: 2px 6px;
            border: none;
            border-radius: 3px;
            background: #4CAF50;
            color: white;
            font-size: 12px;
            cursor: pointer;
        }
        .magnet-copy-btn:hover {
            background: #45a049;
        }
        .copy-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            background: #333;
            color: white;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .copy-toast.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 创建复制提示框
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = '复制成功!';
    document.body.appendChild(toast);

    // 显示提示
    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(showToast).catch(err => {
            console.error('复制失败:', err);
        });
    }

    // 为所有磁力链接添加复制按钮
    function addCopyButtons() {
        // 查找所有磁力链接(a标签且href以magnet:开头)
        const magnetLinks = document.querySelectorAll('a[href^="magnet:"]');
        
        magnetLinks.forEach(link => {
            // 避免重复添加按钮
            if (!link.nextElementSibling || !link.nextElementSibling.classList.contains('magnet-copy-btn')) {
                const btn = document.createElement('button');
                btn.className = 'magnet-copy-btn';
                btn.textContent = '复制';
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    copyToClipboard(link.href);
                });
                
                // 在磁力链接后面添加复制按钮
                link.parentNode.insertBefore(btn, link.nextSibling);
            }
        });
    }

    // 初始加载时添加按钮
    addCopyButtons();

    // 监听页面变化，动态添加按钮(应对动态加载的内容)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                addCopyButtons();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
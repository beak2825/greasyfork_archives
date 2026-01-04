// ==UserScript==
// @name        番茄小说ID复制器
// @namespace  http://tampermonkey.net/
// @version      1.0
// @description  在番茄小说页面显示复制小说和章节ID按钮
// @author       尘۝醉
// @match       https://fanqienovel.com/page/*
// @match       https://fanqienovel.com/reader/*
// @match       https://changdunovel.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548410/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4ID%E5%A4%8D%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548410/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4ID%E5%A4%8D%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 添加样式 - 加大按钮尺寸
    GM_addStyle(`
        .copy-id-btn {
            position: fixed;
            right: 25px;
            color: white;
            border: none;
            padding: 18px 25px;
            border-radius: 30px;
            cursor: pointer;
            z-index: 9999;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-width: 160px;
            text-align: center;
        }
        .copy-novel-id-btn {
            bottom: 100px;
            background: linear-gradient(145deg, #ff6b35, #e55a2b);
            border: 2px solid #ff8c5a;
        }
        .copy-chapter-id-btn {
            bottom: 30px;
            background: linear-gradient(145deg, #3498db, #2980b9);
            border: 2px solid #5dade2;
        }
        .copy-id-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        .copy-novel-id-btn:hover {
            background: linear-gradient(145deg, #ff7c45, #ff6b35);
        }
        .copy-chapter-id-btn:hover {
            background: linear-gradient(145deg, #5dade2, #3498db);
        }
        .copy-id-btn:active {
            transform: translateY(0) scale(1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .copy-tooltip {
            position: fixed;
            top: 25px;
            right: 25px;
            padding: 16px 22px;
            border-radius: 15px;
            z-index: 10000;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: fadeInOut 3s forwards;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .novel-tooltip {
            background: linear-gradient(145deg, #ff6b35, #e55a2b);
            color: white;
            border: 2px solid #ff8c5a;
        }
        .chapter-tooltip {
            background: linear-gradient(145deg, #3498db, #2980b9);
            color: white;
            border: 2px solid #5dade2;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-25px) scale(0.9); }
            10% { opacity: 1; transform: translateY(0) scale(1); }
            90% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-25px) scale(0.9); }
        }        
        /* 添加一些发光效果 */
        .copy-id-btn {
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .copy-id-btn {
                right: 15px;
                padding: 16px 20px;
                font-size: 16px;
                min-width: 140px;
            }
            .copy-novel-id-btn {
                bottom: 90px;
            }
            .copy-chapter-id-btn {
                bottom: 25px;
            }
            .copy-tooltip {
                right: 15px;
                padding: 14px 18px;
                font-size: 16px;
            }
        }
        
        @media (max-width: 480px) {
            .copy-id-btn {
                right: 10px;
                padding: 14px 16px;
                font-size: 14px;
                min-width: 120px;
                border-radius: 25px;
            }
            .copy-tooltip {
                right: 10px;
                padding: 12px 16px;
                font-size: 14px;
            }
        }
    `);
    // 提取ID函数
    function extractIdFromUrl() {
        const url = window.location.href;
        let result = { type: null, id: null };
        // 番茄小说页面：/page/数字
        if (url.includes('fanqienovel.com/page/')) {
            const match = url.match(/fanqienovel\.com\/page\/(\d+)/);
            if (match && match[1]) {
                result = { type: 'novel', id: match[1] };
            }
        }
        // 番茄阅读器页面：/reader/数字
        else if (url.includes('fanqienovel.com/reader/')) {
            const match = url.match(/fanqienovel\.com\/reader\/(\d+)/);
            if (match && match[1]) {
                result = { type: 'chapter', id: match[1] };
            }
        }
        // 番茄小说分享页面：提取book_id参数
        else if (url.includes('changdunovel.com')) {
            const match = url.match(/book_id=(\d+)/);
            if (match && match[1]) {
                result = { type: 'novel', id: match[1] };
            }
        }
        console.log('提取到的ID:', result);
        return result;
    }
    // 复制到剪贴板
    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== "undefined") {
            GM_setClipboard(text);
        } else {
            const input = document.createElement("textarea");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
        }
    }
    // 显示提示
    function showTooltip(message, type) {
        // 移除现有提示
        const existingTooltips = document.querySelectorAll('.copy-tooltip');
        existingTooltips.forEach(tooltip => tooltip.remove());
        const tooltip = document.createElement('div');
        tooltip.className = `copy-tooltip ${type}-tooltip`;
        tooltip.textContent = message;
        document.body.appendChild(tooltip);
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 3000);
    }
    // 创建复制按钮
    function createCopyButton(idInfo) {
        // 移除现有按钮
        const existingButtons = document.querySelectorAll('.copy-id-btn');
        existingButtons.forEach(button => button.remove());
        if (!idInfo.id) return;
        const button = document.createElement('button');
        
        if (idInfo.type === 'novel') {
            button.className = 'copy-id-btn copy-novel-id-btn';
            button.innerHTML = '📚 复制小说ID';
            button.title = `点击复制小说ID: ${idInfo.id}`;
        } else {
            button.className = 'copy-id-btn copy-chapter-id-btn';
            button.innerHTML = '📖 复制章节ID';
            button.title = `点击复制章节ID: ${idInfo.id}`;
        }
        button.addEventListener('click', function() {
            copyToClipboard(idInfo.id);
            
            const message = idInfo.type === 'novel' 
                ? `✅ 已复制小说ID: ${idInfo.id}`
                : `✅ 已复制章节ID: ${idInfo.id}`;
                
            showTooltip(message, idInfo.type);
            // 按钮反馈动画
            const originalHTML = this.innerHTML;
            
            this.innerHTML = '✅ 已复制';
            this.style.background = 'linear-gradient(145deg, #28a745, #219e37)';
            this.style.borderColor = '#34d058';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                if (idInfo.type === 'novel') {
                    this.style.background = 'linear-gradient(145deg, #ff6b35, #e55a2b)';
                    this.style.borderColor = '#ff8c5a';
                } else {
                    this.style.background = 'linear-gradient(145deg, #3498db, #2980b9)';
                    this.style.borderColor = '#5dade2';
                }
            }, 1500);
        });
        document.body.appendChild(button);
    }
    // 主函数
    function init() {
        const idInfo = extractIdFromUrl();
        
        if (idInfo.id) {
            createCopyButton(idInfo);
            console.log('复制按钮已创建');
        } else {
            console.log('未找到可提取的ID');
        }
    }
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    // 监听SPA页面变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(init, 500);
        }
    }).observe(document, { subtree: true, childList: true });
})();
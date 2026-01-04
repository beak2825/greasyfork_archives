// ==UserScript==
// @name         Astro Contact One Click (ACOC)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键复制电话号码到剪切板
// @author       HeBali
// @match        *://astrocrm.lightning.force.com/*
// @grant        none
// @license      HeBali
// @downloadURL https://update.greasyfork.org/scripts/553352/Astro%20Contact%20One%20Click%20%28ACOC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553352/Astro%20Contact%20One%20Click%20%28ACOC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 电话号码正则表达式
    const phonePatterns = [
        /\(\d{3}\)\s\d{3}-\d{4}/g,  // (ABC) DEF-GHIJ
        /\+86\d{11}/g,              // +86ABCDEFGHIJK
        /86\d{11}/g                 // 86ABCDEFGHIJK
    ];

    // 使用Unicode图标替代SVG
    const copyIcon = '📞';

    // 格式化电话号码
    function formatPhoneNumber(phone) {
        // (ABC) DEF-GHIJ -> 1ABCDEFGHIJ
        if (/\(\d{3}\)\s\d{3}-\d{4}/.test(phone)) {
            return '1' + phone.replace(/[^\d]/g, '');
        }
        // +86ABCDEFGHIJK -> ABCDEFGHIJK
        if (/\+86\d{11}/.test(phone)) {
            return phone.replace('+86', '');
        }
        // 86ABCDEFGHIJK -> ABCDEFGHIJK
        if (/86\d{11}/.test(phone)) {
            return phone.replace(/^86/, '');
        }
        return phone;
    }

    // 复制到剪切板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已复制: ' + text);
        }).catch(() => {
            // 备用方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification('已复制: ' + text);
        });
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // 创建复制图标
    function createCopyIcon(phoneNumber) {
        const icon = document.createElement('span');
        icon.textContent = copyIcon;
        icon.style.cssText = `
            cursor: pointer;
            margin-left: 5px;
            display: inline-block;
            vertical-align: middle;
            font-size: 16px;
            opacity: 0.7;
            transition: opacity 0.2s;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 2px 4px;
            user-select: none;
        `;
        
        icon.addEventListener('mouseenter', () => {
            icon.style.opacity = '1';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.opacity = '0.7';
        });
        
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const formattedPhone = formatPhoneNumber(phoneNumber);
            copyToClipboard(formattedPhone);
        });
        
        return icon;
    }

    // 处理文本选择
    function handleTextSelection() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;
        
        const selectedText = selection.toString().trim();
        if (!selectedText) return;
        
        // 检查是否包含电话号码
        let matchedPhone = null;
        for (const pattern of phonePatterns) {
            const match = selectedText.match(pattern);
            if (match) {
                matchedPhone = match[0];
                break;
            }
        }
        
        if (matchedPhone) {
            // 移除之前的图标
            document.querySelectorAll('.acoc-copy-icon').forEach(icon => icon.remove());
            
            const range = selection.getRangeAt(0);
            const icon = createCopyIcon(matchedPhone);
            icon.className = 'acoc-copy-icon';
            
            // 在选中文本后插入图标
            const span = document.createElement('span');
            span.appendChild(icon);
            
            try {
                range.collapse(false);
                range.insertNode(span);
            } catch (e) {
                // 如果插入失败，在body末尾添加浮动图标
                icon.style.position = 'fixed';
                icon.style.zIndex = '10000';
                icon.style.background = 'white';
                icon.style.border = '1px solid #ccc';
                icon.style.borderRadius = '3px';
                icon.style.padding = '2px';
                
                const rect = range.getBoundingClientRect();
                icon.style.left = (rect.right + 5) + 'px';
                icon.style.top = rect.top + 'px';
                
                document.body.appendChild(icon);
                
                // 3秒后自动移除
                setTimeout(() => {
                    if (icon.parentNode) {
                        icon.remove();
                    }
                }, 3000);
            }
        }
    }

    // 监听鼠标选择事件
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);

    // 点击其他地方时移除图标
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.acoc-copy-icon')) {
            document.querySelectorAll('.acoc-copy-icon').forEach(icon => {
                if (icon.style.position === 'fixed') {
                    icon.remove();
                }
            });
        }
    });

    console.log('ACOC v1.0 已加载');
})();

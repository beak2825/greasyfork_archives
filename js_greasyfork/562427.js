// ==UserScript==
// @name         换行符合并工具
// @namespace    639a4376494fdf0779c5fee851ae336f761f5fe810994aa46da4ed05775c39ac
// @version      1.7
// @description  在复制时自动合并多余的换行符，解决网页复制换行符翻倍问题
// @license      GPL-3.0
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562427/%E6%8D%A2%E8%A1%8C%E7%AC%A6%E5%90%88%E5%B9%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/562427/%E6%8D%A2%E8%A1%8C%E7%AC%A6%E5%90%88%E5%B9%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    function addCSS(e,t=null){if("adoptedStyleSheets"in document){const n=new CSSStyleSheet;return n.replace(e),(t||document).adoptedStyleSheets.push(n),n}{let n=document.createElement("style");return n.innerHTML=e,(t||document.head||document.documentElement).append(n),n}}

    // 创建消息提示系统
    function createMessageSystem() {
        const container = document.createElement('div');
        const shadowRoot = container.attachShadow({ mode: 'closed' });
        
        addCSS(`
        :host {
            all: initial;
        }
        .message {
        ${(HTMLElement.prototype.showPopover) ? '' : 'position: fixed;z-index: 2147483647;'}top: 20px;right: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 300px;
            word-wrap: break-word;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            pointer-events: auto;
        }
        .message.show {
            opacity: 1;
            transform: translateX(0);
        }
        .message.success {
            background: #f6ffed;
            border: 1px solid #b7eb8f;
            color: #52c41a;
        }
        .message.error {
            background: #fff2f0;
            border: 1px solid #ffccc7;
            color: #ff4d4f;
        }
        .message.info {
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            color: #1890ff;
        }
        `, shadowRoot);
        
        (document.body || document.documentElement).appendChild(container);
        return shadowRoot;
    }

    // 显示消息
    function showMessage(shadowRoot, text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        shadowRoot.append(message);
        message.popover = 'auto';
        if (message.showPopover) message.showPopover()
        
        // 触发动画
        setTimeout(() => message.classList.add('show'), 10);
        
        // 自动移除
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode === shadowRoot) {
                    shadowRoot.removeChild(message);
                }
            }, 300);
        }, 3000);
    }

    // 判断是否在可编辑元素内
    function isInEditableElement(target) {
        const editableSelectors = [
            'textarea',
            'input',
            '[contenteditable="true"]',
            '.code-editor',
            '.monaco-editor',
            '.ace_editor',
        ];
        
        return editableSelectors.some(selector => {
            return target.closest(selector);
        });
    }

    // 判断文本是否疑似有换行符多余问题
    function hasExcessiveLineBreaks(text) {
        if (!text || text.length < 3) return false;
        
        // 匹配前面和后面都不是\n的单换行符
        const singleLineBreaks = (text.match(/(?<!\n)\n(?!\n)/g) || []).length;
        const doubleLineBreaks = (text.match(/\n\n/g) || []).length;
        
        // 如果双换行符数量明显多于单换行符，则认为有问题
        return doubleLineBreaks > 0 && doubleLineBreaks > singleLineBreaks;
    }

    // 合并多余的换行符
    function normalizeLineBreaks(text) {
        return text.replace(/\n\n/g, '\n');
    }

    // 复制事件处理
    function handleCopy(event) {
        // 如果在可编辑元素内，不处理
        if (isInEditableElement(event.target)) {
            return;
        }

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (!selectedText || !hasExcessiveLineBreaks(selectedText)) {
            return;
        }

        // 阻止默认复制行为
        event.preventDefault();
        event.stopPropagation();
        
        const normalizedText = normalizeLineBreaks(selectedText);
        
        // 写入剪贴板
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(normalizedText).then(() => {
                showMessage(messageShadowRoot, '已自动优化复制文本格式', 'success');
            }).catch(() => {
                // 降级方案：使用传统的execCommand
                if (fallbackCopyToClipboard(normalizedText)) {
                    showMessage(messageShadowRoot, '已自动优化复制文本格式', 'success');
                } else {
                    showMessage(messageShadowRoot, '复制失败，请重试', 'error');
                }
            });
        } else {
            // 降级方案
            if (fallbackCopyToClipboard(normalizedText)) {
                showMessage(messageShadowRoot, '已自动优化复制文本格式', 'success');
            } else {
                showMessage(messageShadowRoot, '复制失败，请重试', 'error');
            }
        }
    }

    // 传统的剪贴板复制方法（降级方案）
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 999999);
        
        try {
            return document.execCommand('copy');
        } catch {
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // 初始化消息系统
    let messageShadowRoot;
    function initMessageSystem() {
        messageShadowRoot = createMessageSystem();
    }

    // 以捕获方式监听copy事件
    document.addEventListener('copy', handleCopy, true);
    
    // 初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMessageSystem, { once: true });
    } else {
      initMessageSystem();
    }
})();
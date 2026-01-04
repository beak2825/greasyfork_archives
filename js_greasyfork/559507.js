// ==UserScript==
// @name         Ctrl+RightClick Element Copier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按住 Ctrl + 右键点击即可复制网页元素的 HTML 代码
// @author       ELDERJiangneverdies
// @license      GPL-3.0
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559507/Ctrl%2BRightClick%20Element%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/559507/Ctrl%2BRightClick%20Element%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .ext-copy-highlight {
            outline: 2px dashed #ff0000 !important;
            outline-offset: -2px !important;
            cursor: copy !important;
            box-shadow: inset 0 0 0 2px rgba(255, 0, 0, 0.1);
            transition: all 0.1s ease;
        }

        .ext-copy-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(33, 33, 33, 0.9);
            color: #fff;
            padding: 10px 20px;
            border-radius: 6px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 2147483647;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: extToastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        @keyframes extToastSlideIn {
            from { opacity: 0; transform: translate(-50%, -10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
    `;
    document.head.appendChild(style);

    // Add contextmenu event listener
    document.addEventListener('contextmenu', function(event) {
        if (!event.ctrlKey) return;

        event.preventDefault();
        event.stopPropagation();

        const target = event.target;
        const htmlContent = target.outerHTML;

        // Visual Highlight
        target.classList.add('ext-copy-highlight');
        setTimeout(function() {
            target.classList.remove('ext-copy-highlight');
        }, 500);

        // Copy to Clipboard with compatibility fallback
        copyToClipboard(htmlContent);
    }, true);

    function copyToClipboard(text) {
        try {
            // Try modern API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(function() {
                    showToast('元素已复制！');
                }).catch(function(err) {
                    console.error('Clipboard API failed:', err);
                    fallbackCopyTextToClipboard(text);
                });
            } else {
                // Fallback for older browsers
                fallbackCopyTextToClipboard(text);
            }
        } catch (err) {
            console.error('Copy failed:', err);
            showToast('复制失败，请重试', true);
        }
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('元素已复制！');
            } else {
                throw new Error('execCommand failed');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showToast('复制失败，请重试', true);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    function showToast(message, isError) {
        if (isError === undefined) {
            isError = false;
        }

        const existingToast = document.getElementById('ext-copy-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'ext-copy-toast';
        toast.textContent = message;
        toast.className = 'ext-copy-toast';
        
        if (isError) {
            toast.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
        }

        document.body.appendChild(toast);

        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -20px)';
            setTimeout(function() {
                if (toast.isConnected) {
                    toast.remove();
                }
            }, 300);
        }, 2000);
    }
})();
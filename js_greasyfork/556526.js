// ==UserScript==
// @name         Ctrl+Shift+C Copy 
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Override Ctrl+Shift+C to copy selected text instead of opening console
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556526/Ctrl%2BShift%2BC%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/556526/Ctrl%2BShift%2BC%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for DOM to be ready
    function initialize() {
        // Use capture phase with highest priority
        document.addEventListener('keydown', handleKeydown, {
            capture: true,
            passive: false
        });

        // Also add to window for extra coverage
        window.addEventListener('keydown', handleKeydown, {
            capture: true,
            passive: false
        });
    }

    function handleKeydown(e) {
        // Check if Ctrl+Shift+C is pressed (case-insensitive)
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.code === 'KeyC')) {
            // Prevent the default behavior immediately
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Get selected text
            const selectedText = window.getSelection().toString().trim();

            if (selectedText) {
                copyToClipboard(selectedText);
            } else {
                showCopyNotification('📋 No text selected');
            }

            return false;
        }

        // Show notification for regular Ctrl+C copy
        if (e.ctrlKey && !e.shiftKey && (e.key === 'c' || e.code === 'KeyC')) {
            setTimeout(() => {
                const selectedText = window.getSelection().toString().trim();
                if (selectedText) {
                    showCopyNotification('✓ Copied!');
                }
            }, 50);
        }
    }

    // Copy to clipboard with multiple fallback methods
    function copyToClipboard(text) {
        // Method 1: Try Tampermonkey's GM_setClipboard (most reliable)
        if (typeof GM_setClipboard !== 'undefined') {
            try {
                GM_setClipboard(text);
                showCopyNotification('✓ Copied!');
                return;
            } catch (err) {
                console.error('GM_setClipboard failed:', err);
            }
        }

        // Method 2: Try modern Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopyNotification('✓ Copied!');
            }).catch(err => {
                console.error('Clipboard API failed:', err);
                fallbackCopyText(text);
            });
        } else {
            // Method 3: Fallback for older browsers
            fallbackCopyText(text);
        }
    }

    // Fallback method for copying text
    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = `
            position: fixed;
            left: -9999px;
            top: -9999px;
            opacity: 0;
            pointer-events: none;
        `;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyNotification('✓ Copied!');
            } else {
                showCopyNotification('❌ Copy failed');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
            showCopyNotification('❌ Copy failed');
        }

        document.body.removeChild(textArea);
    }

    // Function to show a temporary notification
    function showCopyNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.getElementById('copy-notification-userscript');
        if (existingNotification) {
            existingNotification.style.transition = 'all 0.2s ease-out';
            existingNotification.style.transform = 'translateX(-50%) translateY(100px)';
            existingNotification.style.opacity = '0';
            setTimeout(() => {
                if (existingNotification.parentNode) {
                    existingNotification.parentNode.removeChild(existingNotification);
                }
            }, 200);
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.id = 'copy-notification-userscript';
        notification.textContent = message;

        // Initial styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #2D3748;
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 2147483647;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            min-width: 100px;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            opacity: 0;
            cursor: pointer;
            pointer-events: auto;
        `;

        // Ensure body exists
        if (!document.body) {
            setTimeout(() => showCopyNotification(message), 100);
            return;
        }

        document.body.appendChild(notification);

        // Trigger appear animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(-50%) translateY(0)';
                notification.style.opacity = '1';
            });
        });

        // Auto remove after 2 seconds
        const removeTimeout = setTimeout(() => {
            startDisappearAnimation(notification);
        }, 2000);

        // Click to dismiss
        notification.addEventListener('click', () => {
            clearTimeout(removeTimeout);
            startDisappearAnimation(notification);
        });

        function startDisappearAnimation(element) {
            element.style.transition = 'all 0.3s ease-out';
            element.style.transform = 'translateX(-50%) translateY(100px)';
            element.style.opacity = '0';

            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }

        // Hover effects
        notification.addEventListener('mouseenter', () => {
            notification.style.transform = 'translateX(-50%) translateY(0) scale(1.05)';
            notification.style.background = '#374151';
        });

        notification.addEventListener('mouseleave', () => {
            notification.style.transform = 'translateX(-50%) translateY(0) scale(1)';
            notification.style.background = '#2D3748';
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also initialize immediately for document-start
    initialize();
})();
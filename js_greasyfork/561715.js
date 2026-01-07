// ==UserScript==
// @name         Tencent Console Danger Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight specific dangerous buttons/links in Tencent Cloud Console with red background and white text 高亮腾讯云控制台中的危险按钮/链接，红色背景，白色文字
// @author       \7. with Gemini 3.0 Pro
// @match        *://console.cloud.tencent.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561715/Tencent%20Console%20Danger%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/561715/Tencent%20Console%20Danger%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Danger keywords (Case-insensitive, Partial match)
    // Add or remove keywords here as needed
    const KEYWORDS = [
        // 中文 - 核心高危词
        "删除", "释放", "退还", "销毁", "停止", "关机", "重启", "强行",
        "格式化", "重置", "清空", "终止", "移除", "卸载", "解绑",
        "停用", "下线", "回滚", "覆盖", "废弃",

        // English - Core danger words
        "Delete", "Release", "Return", "Destroy", "Stop", "Shutdown", "Restart", "Reboot", "Force",
        "Format", "Reset", "Clear", "Terminate", "Remove", "Uninstall", "Unbind",
        "Disable", "Offline", "Rollback", "Overwrite", "Abandon", "Drop", "Erase"
    ];

    // CSS Class for highlighting
    const HIGHLIGHT_CLASS = 'tm-danger-mode';
    const HIGHLIGHT_DISABLED_CLASS = 'tm-danger-mode-disabled';

    const STYLE_CSS = `
        /* Active/Clickable Danger Buttons */
        .${HIGHLIGHT_CLASS} {
            background-color: #d93025 !important; /* Red */
            color: #ffffff !important;
            border-color: #d93025 !important;
            font-weight: bold !important;
            opacity: 1 !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
            padding: 0 5px !important; /* Supplement visual space */
        }
        /* Disabled Danger Buttons - Lighter Red */
        .${HIGHLIGHT_DISABLED_CLASS} {
            background-color: #fce8e6 !important; /* Light Pinkish Red */
            color: #d93025 !important; /* Red Text */
            border-color: #fce8e6 !important;
            font-weight: bold !important;
            opacity: 0.8 !important;
            cursor: not-allowed !important;
            box-shadow: none !important;
            padding: 0 5px !important; /* Supplement visual space */
        }

        /* Ensure inner text inherits color properly */
        .${HIGHLIGHT_CLASS} * {
            color: #ffffff !important;
        }
        .${HIGHLIGHT_DISABLED_CLASS} * {
            color: #d93025 !important;
        }

        /* Add emoji before text */
        .${HIGHLIGHT_CLASS}::before {
            content: "⚠ ";
            margin-right: 2px;
            color: #ffffff !important;
        }
        .${HIGHLIGHT_DISABLED_CLASS}::before {
            content: "⚠ ";
            margin-right: 2px;
            color: #d93025 !important;
        }

        /* Ensure trailing space via CSS to avoid DOM text manipulation risks */
        .${HIGHLIGHT_CLASS}::after {
            content: " ";
            white-space: pre;
        }
        .${HIGHLIGHT_DISABLED_CLASS}::after {
            content: " ";
            white-space: pre;
        }
    `;

    // 1. Inject CSS
    function injectStyle() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = STYLE_CSS;
        document.head.appendChild(style);
        console.log('[Tencent Highlighter] Styles injected');
    }

    // 2. Check if text matches keywords (Partial Match & Case Insensitive)
    // Pre-compile regex for performance
    const KEYWORD_REGEX = new RegExp(KEYWORDS.join('|'), 'i');

    function isMatch(text) {
        if (!text) return false;
        // Check if any keyword matches
        return KEYWORD_REGEX.test(text);
    }

    // 3. Process a single element
    function processElement(element) {
        // Allow re-processing to handle dynamic text changes
        // if (element.dataset.tmProcessed) return;

        // Get visible text (innerText is standard for rendered text)
        const text = element.innerText;

        if (isMatch(text)) {
            // Check if already processed and state matches, to avoid spamming logs/DOM
            // However, we must re-check disabled state in case it changed

            // Check if element is disabled
            // Standard 'disabled' property or 'aria-disabled' or class containing 'disabled'
            const isDisabled = element.disabled ||
                               element.getAttribute('aria-disabled') === 'true' ||
                               element.classList.contains('disabled') ||
                               element.classList.contains('is-disabled'); // Common UI library class

            let appliedClass = isDisabled ? HIGHLIGHT_DISABLED_CLASS : HIGHLIGHT_CLASS;
            let removedClass = isDisabled ? HIGHLIGHT_CLASS : HIGHLIGHT_DISABLED_CLASS;

            // Apply correct class if not present
            if (!element.classList.contains(appliedClass)) {
                element.classList.add(appliedClass);
                element.classList.remove(removedClass); // Remove wrong class if present
                console.log(`[Tencent Highlighter] Highlighted (${isDisabled ? 'Disabled' : 'Active'}): ${text.trim()}`);
            }

            element.dataset.tmProcessed = "true";
        } else {
            // Cleanup: If text no longer matches, remove styles
            if (element.classList.contains(HIGHLIGHT_CLASS) || element.classList.contains(HIGHLIGHT_DISABLED_CLASS)) {
                element.classList.remove(HIGHLIGHT_CLASS);
                element.classList.remove(HIGHLIGHT_DISABLED_CLASS);
                delete element.dataset.tmProcessed;
                // console.log(`[Tencent Highlighter] Un-highlighted: ${text.trim()}`);
            }
        }
    }

    // 4. Scan a container for targets
    function scanAndHighlight(container) {
        if (!container || !container.querySelectorAll) return;

        // Selectors for interactive elements
        const selector = 'a, button, input[type="button"], input[type="submit"], div[role="button"], span[role="button"]';

        // Check the container itself
        if (container.matches && container.matches(selector)) {
            processElement(container);
        }

        // Check descendants
        const elements = container.querySelectorAll(selector);
        elements.forEach(processElement);
    }

    // 5. Initialize
    function init() {
        injectStyle();

        // Initial scan
        scanAndHighlight(document.body);

        // Observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 1. Handle new nodes (ChildList)
                if (mutation.type === 'childList') {
                    // Check added nodes
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            scanAndHighlight(node);
                        }
                    });

                    // Also check the target itself (parent of added nodes)
                    // If a button's inner content changes (e.g. span added), we need to re-scan the button
                    if (mutation.target.nodeType === 1) {
                         scanAndHighlight(mutation.target);
                    }
                }

                // 2. Handle text changes (CharacterData)
                // If text inside a button changes
                if (mutation.type === 'characterData') {
                    const target = mutation.target.parentElement;
                    if (target && target.nodeType === 1) {
                        scanAndHighlight(target);
                    }
                }

                // 3. Handle attribute changes (e.g. disabled state)
                if (mutation.type === 'attributes') {
                    if (mutation.target.nodeType === 1) {
                        scanAndHighlight(mutation.target);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true, // Watch text changes
            attributes: true, // Watch attribute changes (disabled status)
            attributeFilter: ['disabled', 'class', 'aria-disabled'] // Only watch relevant attributes
        });

        console.log('[Tencent Highlighter] Initialized');
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();


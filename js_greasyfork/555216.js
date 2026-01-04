// ==UserScript==
// @name         Claude Code Block Collapser v24
// @namespace    claude-code-block-manager
// @author       Yalums (Optimized by schweigen)
// @version      24
// @description  Collapse code blocks with symmetrical dual controls, download functionality, double-click toggle, and typing animation - Auto-copy disabled - Fixed event handler error
// @match        https://claude.ai/*
// @match        https://*.claude.ai/*
// @grant        none
// @run-at       document-end
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/555216/Claude%20Code%20Block%20Collapser%20v24.user.js
// @updateURL https://update.greasyfork.org/scripts/555216/Claude%20Code%20Block%20Collapser%20v24.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        minCodeLength: 20,
        typingCheckInterval: 300,
        hideLabelsInterval: 500,
        autoCollapseDelay: 500,
        buttonFeedbackDuration: 2000,
        maxInitAttempts: 20,
        initRetryDelay: 200,
        doubleClickDelay: 300, // Time window for double-click detection
        enableAutoCopy: false // DISABLED in v23+
    };

    // ===== STATE MANAGEMENT =====
    let isClaudeTyping = false;
    const processedBlocks = new WeakSet();
    const autocopiedBlocks = new Set(); // Kept for potential future use, but won't be used
    let observer = null;
    let initAttempts = 0;

    // ===== LOGGING UTILITY =====
    const log = (message, type = 'info') => {
        const prefix = '[Code Collapser v24]';
        const styles = {
            info: 'color: #4CAF50',
            warn: 'color: #ff9800',
            error: 'color: #f44336',
            success: 'color: #00bcd4'
        };
        console.log(`%c${prefix} ${message}`, styles[type] || styles.info);
    };

    // ===== STYLES INJECTION =====
    function injectStyles() {
        if (document.getElementById('code-collapser-styles-v24')) {
            log('Styles already injected', 'info');
            return;
        }

        const style = document.createElement('style');
        style.id = 'code-collapser-styles-v24';
        style.textContent = `
            /* ===== Code Block Wrapper ===== */
            .code-block-wrapper {
                position: relative;
                margin: 16px 0;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
                background: #ffffff;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }

            .dark .code-block-wrapper {
                background: #1f2937;
                border-color: #374151;
            }

            /* Hide Claude's default language labels */
            .code-block-wrapper + * .text-text-500,
            div:has(> .code-block-wrapper) > .text-text-500,
            .relative.group\\/copy > .text-text-500 {
                display: none !important;
            }

            /* ===== Header ===== */
            .code-block-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-bottom: 1px solid #fbbf24;
                transition: all 0.3s ease;
                cursor: pointer;
                user-select: none;
            }

            .dark .code-block-header {
                background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
                border-bottom-color: #b45309;
            }

            .code-block-wrapper.typing-done .code-block-header {
                background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                border-bottom-color: #e5e7eb;
            }

            .dark .code-block-wrapper.typing-done .code-block-header {
                background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
                border-bottom-color: #6b7280;
            }

            .code-block-wrapper.collapsed .code-block-header {
                justify-content: center;
            }

            /* ===== Info Section ===== */
            .code-block-info {
                display: flex;
                align-items: center;
                gap: 12px;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }

            .code-block-wrapper.collapsed .code-block-info {
                opacity: 0;
                pointer-events: none;
            }

            /* ===== TYPING ANIMATION ===== */
            @keyframes typing-pulse {
                0%, 100% {
                    background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
                    background-size: 200% 100%;
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }

            @keyframes typing-pulse-dark {
                0%, 100% {
                    background: linear-gradient(90deg, #818cf8, #a78bfa, #e879f9);
                    background-size: 200% 100%;
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }

            .code-script-title {
                font-size: 14px;
                font-weight: 600;
                color: #111827;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                padding: 4px 12px;
                border-radius: 6px;
                transition: all 0.3s ease;
            }

            .dark .code-script-title {
                color: #f9fafb;
            }

            /* Typing animation on title */
            .code-block-wrapper:not(.typing-done) .code-script-title {
                animation: typing-pulse 2s ease-in-out infinite;
                color: white;
                font-weight: 700;
                box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
                background-clip: text;
                -webkit-background-clip: text;
            }

            .dark .code-block-wrapper:not(.typing-done) .code-script-title {
                animation: typing-pulse-dark 2s ease-in-out infinite;
                color: white;
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
            }

            .code-language-label {
                font-size: 11px;
                color: #6b7280;
                font-weight: 500;
                padding: 3px 10px;
                background: rgba(99, 102, 241, 0.15);
                border-radius: 4px;
                border: 1px solid rgba(99, 102, 241, 0.3);
            }

            .dark .code-language-label {
                color: #9ca3af;
                background: rgba(99, 102, 241, 0.2);
                border-color: rgba(99, 102, 241, 0.4);
            }

            /* ===== Controls ===== */
            .code-controls,
            .code-controls-left {
                display: flex;
                gap: 8px;
                align-items: center;
                transition: all 0.3s ease;
                pointer-events: auto;
            }

            .code-block-wrapper.collapsed .code-controls {
                position: absolute;
                right: 16px;
            }

            .code-block-wrapper.collapsed .code-controls-left {
                position: absolute;
                left: 16px;
            }

            /* ===== Buttons ===== */
            .code-control-btn {
                padding: 6px 14px;
                background: #6366f1;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s ease;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }

            .code-control-btn:hover {
                background: #4f46e5;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            }

            .code-control-btn:active {
                transform: translateY(0);
            }

            .code-control-btn.download-btn {
                background: #10b981;
            }

            .code-control-btn.download-btn:hover {
                background: #059669;
            }

            .code-control-btn.expand-btn {
                background: #f59e0b;
            }

            .code-control-btn.expand-btn:hover {
                background: #d97706;
            }

            .code-control-btn.collapse-btn {
                background: #ef4444;
            }

            .code-control-btn.collapse-btn:hover {
                background: #dc2626;
            }

            /* Feedback states */
            .code-control-btn.success-feedback {
                background: #10b981 !important;
                animation: successPulse 0.3s ease;
            }

            .code-control-btn.error-feedback {
                background: #ef4444 !important;
                animation: errorShake 0.3s ease;
            }

            @keyframes successPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes errorShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-4px); }
                75% { transform: translateX(4px); }
            }

            /* ===== Content Area ===== */
            .code-block-content {
                max-height: 600px;
                overflow: auto;
                transition: max-height 0.3s ease, opacity 0.3s ease;
            }

            .code-block-wrapper.collapsed .code-block-content {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
            }

            .code-block-content pre {
                margin: 0;
                border-radius: 0;
            }

            /* ===== Visibility Rules ===== */
            .code-block-wrapper:not(.typing-done) .code-control-btn.expand-btn,
            .code-block-wrapper:not(.typing-done) .code-control-btn.collapse-btn {
                opacity: 0.5;
                pointer-events: none;
            }

            .code-block-wrapper.typing-done .code-control-btn.expand-btn,
            .code-block-wrapper.typing-done .code-control-btn.collapse-btn {
                opacity: 1;
                pointer-events: auto;
            }

            .code-block-wrapper.collapsed .expand-btn {
                display: inline-flex;
            }

            .code-block-wrapper.collapsed .collapse-btn {
                display: none;
            }

            .code-block-wrapper:not(.collapsed) .expand-btn {
                display: none;
            }

            .code-block-wrapper:not(.collapsed) .collapse-btn {
                display: inline-flex;
            }
        `;

        document.head.appendChild(style);
        log('✓ Styles injected', 'success');
    }

    // ===== BUTTON ICONS =====
    const ICONS = {
        copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>`,
        download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                   </svg>`,
        expand: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                 </svg>`,
        collapse: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="4 14 10 14 10 20"></polyline>
                    <polyline points="20 10 14 10 14 4"></polyline>
                    <line x1="14" y1="10" x2="21" y2="3"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                   </svg>`,
        check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <polyline points="20 6 9 17 4 12"></polyline>
                </svg>`
    };

    // ===== COPY TO CLIPBOARD =====
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            showFeedback(button, 'success', 'Copied!');
            log('✓ Code copied to clipboard', 'success');
        }).catch(() => {
            showFeedback(button, 'error', 'Failed');
            log('✗ Failed to copy code', 'error');
        });
    }

    // ===== DOWNLOAD CODE =====
    function downloadCode(code, button) {
        try {
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `code-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showFeedback(button, 'success', 'Downloaded!');
            log('✓ Code downloaded', 'success');
        } catch (err) {
            showFeedback(button, 'error', 'Failed');
            log('✗ Download failed', 'error');
        }
    }

    // ===== BUTTON FEEDBACK =====
    function showFeedback(button, type, text) {
        const originalHTML = button.innerHTML;
        const originalText = button.textContent;

        button.classList.add(`${type}-feedback`);
        button.innerHTML = type === 'success' ? ICONS.check : '✗';
        button.innerHTML += ` ${text}`;

        setTimeout(() => {
            button.classList.remove(`${type}-feedback`);
            button.innerHTML = originalHTML;
        }, CONFIG.buttonFeedbackDuration);
    }

    // ===== CREATE BUTTON =====
    function createButton(type, handler) {
        const button = document.createElement('button');
        button.className = `code-control-btn ${type}-btn`;
        button.innerHTML = ICONS[type];

        const labels = {
            copy: 'Copy',
            download: 'Download',
            expand: 'Expand',
            collapse: 'Collapse'
        };

        const textSpan = document.createElement('span');
        textSpan.textContent = labels[type];
        button.appendChild(textSpan);

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            handler();
        });

        return button;
    }

    // ===== TOGGLE COLLAPSE =====
    function toggleCollapse(wrapper) {
        wrapper.classList.toggle('collapsed');
        updateButtonVisibility(wrapper);
        log(`Code block ${wrapper.classList.contains('collapsed') ? 'collapsed' : 'expanded'}`, 'info');
    }

    // ===== UPDATE BUTTON VISIBILITY =====
    function updateButtonVisibility(wrapper) {
        const isCollapsed = wrapper.classList.contains('collapsed');
        const expandBtns = wrapper.querySelectorAll('.expand-btn');
        const collapseBtns = wrapper.querySelectorAll('.collapse-btn');

        expandBtns.forEach(btn => {
            btn.style.display = isCollapsed ? 'inline-flex' : 'none';
        });

        collapseBtns.forEach(btn => {
            btn.style.display = isCollapsed ? 'none' : 'inline-flex';
        });

        // Mark as typing-done if typing is complete
        if (!isClaudeTyping && !wrapper.classList.contains('typing-done')) {
            wrapper.classList.add('typing-done');
        }
    }

    // ===== DOUBLE-CLICK HANDLER =====
    function setupDoubleClickHandler(element, wrapper) {
        let clickCount = 0;
        let clickTimer = null;

        element.addEventListener('click', (e) => {
            // Ignore clicks on buttons
            if (e.target.closest('.code-control-btn')) {
                return;
            }

            clickCount++;

            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, CONFIG.doubleClickDelay);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                clickCount = 0;
                toggleCollapse(wrapper);
            }
        });
    }

    // ===== DETECT LANGUAGE & TITLE =====
    function detectLanguageAndTitle(pre) {
        const codeElement = pre.querySelector('code');
        if (!codeElement) return { language: 'code', scriptTitle: null };

        // Try to get language from class
        const classList = Array.from(codeElement.classList);
        const languageClass = classList.find(cls => cls.startsWith('language-'));
        let language = languageClass ? languageClass.replace('language-', '') : 'code';

        // Try to detect script title (first line comment)
        const codeText = codeElement.textContent.trim();
        const firstLine = codeText.split('\n')[0].trim();

        let scriptTitle = null;
        if (firstLine.startsWith('//') || firstLine.startsWith('#') || firstLine.startsWith('<!--')) {
            const titleMatch = firstLine.match(/^(?:\/\/|#|<!--)\s*(.+?)(?:-->)?$/);
            if (titleMatch) {
                scriptTitle = titleMatch[1].trim();
            }
        }

        return { language, scriptTitle };
    }

    // ===== WRAP CODE BLOCK =====
    function wrapCodeBlock(pre) {
        if (processedBlocks.has(pre)) return;

        const codeElement = pre.querySelector('code');
        if (!codeElement) return;

        const codeLength = codeElement.textContent.length;
        if (codeLength < CONFIG.minCodeLength) return;

        processedBlocks.add(pre);

        const { language, scriptTitle } = detectLanguageAndTitle(pre);
        log(`Wrapping ${language} block (${codeLength} chars)${scriptTitle ? ` - Title: "${scriptTitle}"` : ''}`, 'info');

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper collapsed';
        wrapper.dataset.wrapperId = `wrapper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create header
        const header = document.createElement('div');
        header.className = 'code-block-header';

        // Setup double-click on header
        setupDoubleClickHandler(header, wrapper);

        // Left controls
        const controlsLeft = document.createElement('div');
        controlsLeft.className = 'code-controls-left';

        // FIXED: Properly pass button as parameter to handlers
        const getCopyHandler = (btn) => {
            return () => {
                const currentCode = wrapper.querySelector('code') || wrapper.querySelector('pre');
                if (currentCode) {
                    copyToClipboard(currentCode.textContent, btn);
                }
            };
        };

        const getDownloadHandler = (btn) => {
            return () => {
                const currentCode = wrapper.querySelector('code') || wrapper.querySelector('pre');
                if (currentCode) {
                    downloadCode(currentCode.textContent, btn);
                }
            };
        };

        const getExpandHandler = () => {
            return () => toggleCollapse(wrapper);
        };

        const copyBtnLeft = createButton('copy', () => {});
        const downloadBtnLeft = createButton('download', () => {});
        const expandBtnLeft = createButton('expand', getExpandHandler());

        // Reassign handlers with proper button reference
        copyBtnLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            getCopyHandler(copyBtnLeft)();
        });

        downloadBtnLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            getDownloadHandler(downloadBtnLeft)();
        });

        controlsLeft.appendChild(copyBtnLeft);
        controlsLeft.appendChild(downloadBtnLeft);
        controlsLeft.appendChild(expandBtnLeft);

        // Info section
        const info = document.createElement('div');
        info.className = 'code-block-info';

        const titleElem = document.createElement('div');
        titleElem.className = 'code-script-title';
        titleElem.textContent = scriptTitle || language;
        info.appendChild(titleElem);

        const langLabel = document.createElement('span');
        langLabel.className = 'code-language-label';
        langLabel.textContent = language.toUpperCase();
        info.appendChild(langLabel);

        // Right controls
        const controlsRight = document.createElement('div');
        controlsRight.className = 'code-controls';

        const copyBtnRight = createButton('copy', () => {});
        const downloadBtnRight = createButton('download', () => {});
        const expandBtnRight = createButton('expand', getExpandHandler());

        // Reassign handlers with proper button reference
        copyBtnRight.addEventListener('click', (e) => {
            e.stopPropagation();
            getCopyHandler(copyBtnRight)();
        });

        downloadBtnRight.addEventListener('click', (e) => {
            e.stopPropagation();
            getDownloadHandler(downloadBtnRight)();
        });

        controlsRight.appendChild(copyBtnRight);
        controlsRight.appendChild(downloadBtnRight);
        controlsRight.appendChild(expandBtnRight);

        // Assemble header
        header.appendChild(controlsLeft);
        header.appendChild(info);
        header.appendChild(controlsRight);

        // Create content wrapper
        const content = document.createElement('div');
        content.className = 'code-block-content';

        // Setup double-click on content
        setupDoubleClickHandler(content, wrapper);

        // Insert wrapper and move pre inside
        pre.parentNode.insertBefore(wrapper, pre);
        content.appendChild(pre);
        wrapper.appendChild(header);
        wrapper.appendChild(content);

        // Update button visibility
        updateButtonVisibility(wrapper);

        log('✓ Code block wrapped successfully with double-click support and typing animation', 'success');
    }

    // ===== HIDE LANGUAGE LABELS =====
    function hideLanguageLabels() {
        const labels = document.querySelectorAll('.text-text-500.font-small');

        labels.forEach(label => {
            const next = label.nextElementSibling;
            const parent = label.parentElement;

            if ((next && (next.querySelector('pre') || next.classList.contains('code-block-wrapper'))) ||
                (parent && parent.querySelector('.code-block-wrapper'))) {
                label.style.display = 'none';
            }
        });
    }

    // ===== DETECT TYPING STATUS =====
    function checkTypingStatus() {
        const typingIndicators = [
            '[data-is-streaming="true"]',
            '.animate-pulse',
            '[data-testid="stop-button"]',
            'button[aria-label*="Stop" i]'
        ];

        const isTypingNow = typingIndicators.some(selector => document.querySelector(selector) !== null);

        if (isTypingNow !== isClaudeTyping) {
            isClaudeTyping = isTypingNow;
            log(`Typing status changed: ${isClaudeTyping}`, 'info');

            // Update all wrappers
            document.querySelectorAll('.code-block-wrapper').forEach(updateButtonVisibility);
        }
    }

    // ===== PROCESS ALL CODE BLOCKS =====
    function processCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre');
        let processed = 0;

        codeBlocks.forEach(pre => {
            if (!processedBlocks.has(pre) && !pre.closest('.code-block-wrapper')) {
                wrapCodeBlock(pre);
                processed++;
            }
        });

        if (processed > 0) {
            log(`✓ Processed ${processed} new code blocks`, 'success');
            hideLanguageLabels();
        }
    }

    // ===== START MUTATION OBSERVER =====
    function startObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                    break;
                }
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-is-streaming') {
                    checkTypingStatus();
                }
            }

            if (shouldProcess) {
                processCodeBlocks();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-is-streaming']
        });

        log('✓ MutationObserver started', 'success');
    }

    // ===== START PERIODIC CHECKS =====
    function startPeriodicChecks() {
        // Check typing status
        setInterval(checkTypingStatus, CONFIG.typingCheckInterval);

        // Hide labels periodically
        setInterval(hideLanguageLabels, CONFIG.hideLabelsInterval);

        log('✓ Periodic checks started', 'success');
    }

    // ===== INITIALIZATION =====
    function init() {
        initAttempts++;

        if (!document.body) {
            if (initAttempts < CONFIG.maxInitAttempts) {
                log(`Body not ready, retrying... (${initAttempts}/${CONFIG.maxInitAttempts})`, 'warn');
                setTimeout(init, CONFIG.initRetryDelay);
            } else {
                log('✗ Failed to initialize: body not found', 'error');
            }
            return;
        }

        log('🚀 Initializing Code Collapser v24 (Event handler fixed)...', 'info');

        try {
            // Inject styles
            injectStyles();

            // Process existing code blocks
            processCodeBlocks();

            // Start observer
            startObserver();

            // Start periodic checks
            startPeriodicChecks();

            log('✓✓✓ Initialization complete! Auto-copy is DISABLED. Event handlers fixed.', 'success');

        } catch (err) {
            log(`✗ Initialization error: ${err.message}`, 'error');
        }
    }

    // ===== START SCRIPT =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
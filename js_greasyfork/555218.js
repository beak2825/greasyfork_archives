// ==UserScript==
// @name         Claude Interface Enhancement v2
// @description  Adds colorful icons to Claude and Gemini buttons, colors bold/italic text, and adds smooth visual effects throughout both interfaces.
// @version      2
// @namespace    ClaudeEnhancement
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @match        https://claude.ai/*
// @match        https://claude.ai/chat/*
// @match        https://gemini.google.com/*
// @match        https://gemini.google.com/app/*
// @run-at       document-start
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/555218/Claude%20Interface%20Enhancement%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/555218/Claude%20Interface%20Enhancement%20v2.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        shortcuts: {
            newChat: {
                key: 'n',
                modifierRequired: true // Ctrl/Cmd required
            }
        },
        selectors: {
            newChat: [
                // Claude selectors
                'button[aria-label*="new chat" i]',
                'button[aria-label*="start" i]',
                'a[href="/"]',
                'button:has(svg path[d*="M12 4"])',
                // Gemini selectors
                'button[aria-label*="new chat" i]',
                'button[jsname*="r8qRAd"]',
                'a[href="/app"]'
            ]
        },
        animations: {
            enabled: true,
            duration: '0.3s',
            fadeInDuration: '0.6s'
        }
    };

    const COLORS = {
        ORANGE: 'darkorange',
        GREEN: 'springgreen',
        LIME: 'limegreen',
        DARK_GREEN: '#00ad00',
        RED: 'crimson',
        DESTRUCTIVE: '#e02e2a',
        YELLOW: 'gold',
        INDIGO: 'indigo',
        GRAY: 'gray',
        DIMGRAY: 'dimgray',
        SKYBLUE: 'deepskyblue',
        BLUE: '#4285f4',
        VIOLET: 'darkviolet',
        PURPLE: '#9c27b0',
        CYAN: '#00bcd4',
        PINK: '#e91e63',
        TEAL: '#009688'
    };

    const OPACITY = {
        HIGH: '0.9',
        MEDIUM: '0.8',
        LOW: '0.7',
        FULL: '1'
    };

    // ===== Styles =====
    const STYLES = `
        /**************************************
                Animations & Keyframes
        **************************************/

        @keyframes claude-fade-in {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes claude-pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
        }

        @keyframes claude-glow {
            0%, 100% {
                box-shadow: 0 0 5px currentColor;
            }
            50% {
                box-shadow: 0 0 20px currentColor;
            }
        }

        /**************************************
                Button Color Schemes + Effects
                (Works for both Claude & Gemini)
        **************************************/

        /* Copy button - Orange */
        button[aria-label*="Copy" i] svg,
        button[data-testid*="copy" i] svg,
        button:has(svg path[d*="M9 9V4.5"]) svg,
        button[aria-label*="복사" i] svg,
        button[data-tooltip*="Copy" i] svg {
            color: ${COLORS.ORANGE} !important;
            opacity: ${OPACITY.HIGH};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        button[aria-label*="Copy" i]:hover svg,
        button[data-testid*="copy" i]:hover svg,
        button:has(svg path[d*="M9 9V4.5"]):hover svg,
        button[aria-label*="복사" i]:hover svg,
        button[data-tooltip*="Copy" i]:hover svg {
            filter: drop-shadow(0 0 8px ${COLORS.ORANGE}) !important;
            opacity: ${OPACITY.FULL} !important;
        }

        /* Edit button - Yellow */
        button[aria-label*="Edit" i] svg,
        button:has(svg path[d*="M12.0303"]) svg,
        button[aria-label*="수정" i] svg {
            color: ${COLORS.YELLOW} !important;
            opacity: ${OPACITY.MEDIUM};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        button[aria-label*="Edit" i]:hover svg,
        button:has(svg path[d*="M12.0303"]):hover svg,
        button[aria-label*="수정" i]:hover svg {
            filter: drop-shadow(0 0 8px ${COLORS.YELLOW}) !important;
            opacity: ${OPACITY.FULL} !important;
        }

        /* Regenerate/Retry button - Sky Blue */
        button[aria-label*="Retry" i] svg,
        button[aria-label*="Regenerate" i] svg,
        button:has(svg path[d*="M21.168"]) svg,
        button[aria-label*="다시 생성" i] svg {
            color: ${COLORS.SKYBLUE} !important;
            opacity: ${OPACITY.HIGH};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        button[aria-label*="Retry" i]:hover svg,
        button[aria-label*="Regenerate" i]:hover svg,
        button:has(svg path[d*="M21.168"]):hover svg,
        button[aria-label*="다시 생성" i]:hover svg {
            filter: drop-shadow(0 0 8px ${COLORS.SKYBLUE}) !important;
            opacity: ${OPACITY.FULL} !important;
            transform: rotate(180deg) !important;
        }

        /* Good response (thumbs up) - Green */
        button[aria-label*="Good" i] svg,
        button[data-testid*="good" i] svg,
        button:has(svg path[d*="M7.493 18.5"]) svg,
        button[aria-label*="좋아요" i] svg {
            color: ${COLORS.DARK_GREEN} !important;
            opacity: ${OPACITY.HIGH};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        button[aria-label*="Good" i]:hover svg,
        button[data-testid*="good" i]:hover svg,
        button:has(svg path[d*="M7.493 18.5"]):hover svg,
        button[aria-label*="좋아요" i]:hover svg {
            filter: drop-shadow(0 0 8px ${COLORS.DARK_GREEN}) !important;
            opacity: ${OPACITY.FULL} !important;
        }

        button[aria-label*="Good" i]:hover,
        button[data-testid*="good" i]:hover,
        button[aria-label*="좋아요" i]:hover {
            background: rgba(0, 173, 0, 0.12) !important;
            box-shadow: 0 0 12px rgba(0, 173, 0, 0.2) !important;
        }

        /* Bad response (thumbs down) - Red */
        button[aria-label*="Bad" i] svg,
        button[data-testid*="bad" i] svg,
        button:has(svg path[d*="M16.5 7.493"]) svg,
        button[aria-label*="싫어요" i] svg {
            color: ${COLORS.RED} !important;
            opacity: ${OPACITY.HIGH};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        button[aria-label*="Bad" i]:hover svg,
        button[data-testid*="bad" i]:hover svg,
        button:has(svg path[d*="M16.5 7.493"]):hover svg,
        button[aria-label*="싫어요" i]:hover svg {
            filter: drop-shadow(0 0 8px ${COLORS.RED}) !important;
            opacity: ${OPACITY.FULL} !important;
        }

        button[aria-label*="Bad" i]:hover,
        button[data-testid*="bad" i]:hover,
        button[aria-label*="싫어요" i]:hover {
            background: rgba(220, 53, 69, 0.12) !important;
            box-shadow: 0 0 12px rgba(220, 53, 69, 0.2) !important;
        }

        /* Share button - Sky Blue */
        button[aria-label*="Share" i] svg,
        button[aria-label*="공유" i] svg {
            color: ${COLORS.SKYBLUE} !important;
            opacity: ${OPACITY.MEDIUM};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        button[aria-label*="Share" i]:hover svg,
        button[aria-label*="공유" i]:hover svg {
            filter: drop-shadow(0 0 8px ${COLORS.SKYBLUE}) !important;
            opacity: ${OPACITY.FULL} !important;
        }

        /* Delete button - Red */
        button[aria-label*="Delete" i] svg,
        button[aria-label*="삭제" i] svg {
            color: ${COLORS.DESTRUCTIVE} !important;
        }

        button[aria-label*="Delete" i]:hover,
        button[aria-label*="삭제" i]:hover {
            background: rgba(224, 46, 42, 0.15) !important;
            box-shadow: 0 0 15px rgba(224, 46, 42, 0.3) !important;
        }

        /* More actions button - Gray */
        button[aria-label*="More" i] svg,
        button[aria-label*="더보기" i] svg {
            color: ${COLORS.GRAY} !important;
            opacity: ${OPACITY.LOW};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        button[aria-label*="More" i]:hover svg,
        button[aria-label*="더보기" i]:hover svg {
            opacity: ${OPACITY.FULL} !important;
        }

        /**************************************
            Bold Text Coloring
            (Works for both Claude & Gemini)
        **************************************/

        /* Light mode - Purple */
        .font-user-message b,
        .font-user-message strong,
        .font-claude-message b,
        .font-claude-message strong,
        [class*="message"] b,
        [class*="message"] strong,
        [class*="prose"] b,
        [class*="prose"] strong,
        div[class*="whitespace-pre-wrap"] b,
        div[class*="whitespace-pre-wrap"] strong,
        .model-response-text b,
        .model-response-text strong,
        .user-query b,
        .user-query strong,
        message-content b,
        message-content strong,
        b, strong {
            color: ${COLORS.PURPLE} !important;
            font-weight: 600 !important;
            transition: color 0.2s ease !important;
        }

        /* Dark mode - Green */
        .dark .font-user-message b,
        .dark .font-user-message strong,
        .dark .font-claude-message b,
        .dark .font-claude-message strong,
        .dark [class*="message"] b,
        .dark [class*="message"] strong,
        .dark [class*="prose"] b,
        .dark [class*="prose"] strong,
        .dark div[class*="whitespace-pre-wrap"] b,
        .dark div[class*="whitespace-pre-wrap"] strong,
        .dark .model-response-text b,
        .dark .model-response-text strong,
        .dark .user-query b,
        .dark .user-query strong,
        .dark message-content b,
        .dark message-content strong,
        .dark b,
        .dark strong {
            color: ${COLORS.GREEN} !important;
            font-weight: 600 !important;
        }

        /**************************************
            Italic Text Coloring
            (Works for both Claude & Gemini)
        **************************************/

        /* Light mode - Cyan */
        .font-user-message i,
        .font-user-message em,
        .font-claude-message i,
        .font-claude-message em,
        [class*="message"] i,
        [class*="message"] em,
        [class*="prose"] i,
        [class*="prose"] em,
        .model-response-text i,
        .model-response-text em,
        .user-query i,
        .user-query em,
        message-content i,
        message-content em,
        i, em {
            color: ${COLORS.CYAN} !important;
            font-style: italic !important;
            opacity: 0.9;
        }

        /* Dark mode - Sky Blue */
        .dark .font-user-message i,
        .dark .font-user-message em,
        .dark .font-claude-message i,
        .dark .font-claude-message em,
        .dark [class*="message"] i,
        .dark [class*="message"] em,
        .dark [class*="prose"] i,
        .dark [class*="prose"] em,
        .dark .model-response-text i,
        .dark .model-response-text em,
        .dark .user-query i,
        .dark .user-query em,
        .dark message-content i,
        .dark message-content em,
        .dark i,
        .dark em {
            color: ${COLORS.SKYBLUE} !important;
        }

        /**************************************
            Links Enhancement
        **************************************/

        .font-claude-message a,
        [class*="message"] a,
        [class*="prose"] a,
        .model-response-text a,
        message-content a {
            color: ${COLORS.BLUE} !important;
            text-decoration: underline;
            text-decoration-color: ${COLORS.BLUE}50;
            transition: all 0.2s ease !important;
        }

        .font-claude-message a:hover,
        [class*="message"] a:hover,
        [class*="prose"] a:hover,
        .model-response-text a:hover,
        message-content a:hover {
            color: ${COLORS.SKYBLUE} !important;
            text-decoration-color: ${COLORS.SKYBLUE} !important;
            text-shadow: 0 0 8px ${COLORS.SKYBLUE}80 !important;
        }

        /**************************************
            Code Enhancement
        **************************************/

        /* Inline code */
        code:not(pre code) {
            color: ${COLORS.PINK} !important;
            background: ${COLORS.PINK}15 !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-weight: 500 !important;
        }

        .dark code:not(pre code) {
            color: ${COLORS.CYAN} !important;
            background: ${COLORS.CYAN}15 !important;
        }

        /* Code block headers */
        pre > div:first-child,
        [class*="code-block"] > div:first-child {
            background: linear-gradient(135deg, ${COLORS.PURPLE}30, ${COLORS.BLUE}30) !important;
            border-bottom: 2px solid ${COLORS.PURPLE}50 !important;
        }

        /**************************************
            Message Animations
        **************************************/

        /* Fade in new messages */
        .font-claude-message,
        .font-user-message,
        [class*="message-content"],
        .model-response-text,
        .user-query,
        message-content {
            animation: claude-fade-in ${CONFIG.animations.fadeInDuration} ease-out !important;
        }

        /**************************************
            Button Enhancements
        **************************************/

        button {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        button:hover {
            transform: scale(1.05) !important;
        }

        button:active {
            transform: scale(0.95) !important;
        }

        /* Icon smooth transitions */
        button svg {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Focus effects */
        button:focus-visible {
            outline: 2px solid ${COLORS.BLUE} !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 0 4px ${COLORS.BLUE}30 !important;
        }

        /**************************************
            List Enhancements
        **************************************/

        /* Colored list markers */
        .font-claude-message ul li::marker,
        [class*="message"] ul li::marker,
        [class*="prose"] ul li::marker,
        .model-response-text ul li::marker,
        message-content ul li::marker {
            color: ${COLORS.PURPLE} !important;
        }

        .font-claude-message ol li::marker,
        [class*="message"] ol li::marker,
        [class*="prose"] ol li::marker,
        .model-response-text ol li::marker,
        message-content ol li::marker {
            color: ${COLORS.BLUE} !important;
            font-weight: bold !important;
        }

        .dark .font-claude-message ul li::marker,
        .dark [class*="message"] ul li::marker,
        .dark [class*="prose"] ul li::marker,
        .dark .model-response-text ul li::marker,
        .dark message-content ul li::marker {
            color: ${COLORS.GREEN} !important;
        }

        /**************************************
            Scrollbar Styling
        **************************************/

        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: ${COLORS.GRAY}40;
            border-radius: 5px;
            transition: background 0.2s ease !important;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: ${COLORS.GRAY}60;
        }

        .dark ::-webkit-scrollbar-thumb {
            background: ${COLORS.GRAY}60;
        }

        .dark ::-webkit-scrollbar-thumb:hover {
            background: ${COLORS.GRAY}80;
        }

        /**************************************
            Blockquote Styling
        **************************************/

        blockquote {
            border-left: 4px solid ${COLORS.PURPLE} !important;
            padding-left: 16px !important;
            opacity: 0.9;
        }

        .dark blockquote {
            border-left-color: ${COLORS.GREEN} !important;
        }

        /**************************************
            Misc Enhancements
        **************************************/

        /* Code block border radius */
        pre {
            border-radius: 8px !important;
        }

        /* Smooth transitions */
        * {
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
    `;

    // ===== Utility Functions =====

    const log = (...args) => {
        console.log('[Claude Enhancement v2]', ...args);
    };

    const injectStyles = () => {
        const existing = document.getElementById('claude-enhancement-styles-v2');
        if (existing) {
            existing.remove();
        }

        const styleSheet = document.createElement('style');
        styleSheet.textContent = STYLES;
        styleSheet.setAttribute('id', 'claude-enhancement-styles-v2');

        const appendStyleSheet = (head) => {
            if (head) {
                head.appendChild(styleSheet);
                log('✓ Visual effects loaded');
            } else {
                document.documentElement.appendChild(styleSheet);
            }
        };

        if (document.head) {
            appendStyleSheet(document.head);
        } else {
            document.addEventListener('DOMContentLoaded', () => appendStyleSheet(document.head), { once: true });
        }
    };

    /**
     * Apply colors to bold text
     */
    const applyBoldColors = () => {
        const isDark = document.documentElement.classList.contains('dark') ||
                      document.body.classList.contains('dark');

        const boldColor = isDark ? COLORS.GREEN : COLORS.PURPLE;
        const italicColor = isDark ? COLORS.SKYBLUE : COLORS.CYAN;

        const boldElements = document.querySelectorAll('b:not([data-styled]), strong:not([data-styled])');
        const italicElements = document.querySelectorAll('i:not([data-styled]), em:not([data-styled])');

        boldElements.forEach(el => {
            el.setAttribute('data-styled', 'true');
            el.style.setProperty('color', boldColor, 'important');
            el.style.setProperty('font-weight', '600', 'important');
        });

        italicElements.forEach(el => {
            el.setAttribute('data-styled', 'true');
            el.style.setProperty('color', italicColor, 'important');
        });
    };

    const dispatchNewChatClick = () => {
        for (const selector of CONFIG.selectors.newChat) {
            const target = document.querySelector(selector);
            if (target) {
                target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                log('New chat triggered');
                return true;
            }
        }
        return false;
    };

    const isShortcutMatch = (event) => {
        const { key, modifierRequired } = CONFIG.shortcuts.newChat;
        if (event.key.toLowerCase() !== key) return false;
        if (event.altKey || event.shiftKey) return false;
        if (modifierRequired && !event.metaKey && !event.ctrlKey) return false;
        return true;
    };

    const handleKeyboardShortcut = (event) => {
        if (event.defaultPrevented || event.repeat) return;
        if (!isShortcutMatch(event)) return;
        if (event.target.matches('input, textarea, [contenteditable="true"]')) return;

        if (dispatchNewChatClick()) {
            event.preventDefault();
        }
    };

    /**
     * Observe DOM changes
     */
    const observeDOM = () => {
        let timeout;

        const observer = new MutationObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                applyBoldColors();
            }, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // ===== Initialization =====
    const init = () => {
        log('Initializing with visual effects...');

        injectStyles();

        const applyWhenReady = () => {
            if (document.body) {
                applyBoldColors();
                observeDOM();

                setTimeout(applyBoldColors, 1000);
                setTimeout(applyBoldColors, 3000);
            } else {
                setTimeout(applyWhenReady, 100);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyWhenReady);
        } else {
            applyWhenReady();
        }

        document.addEventListener('keydown', handleKeyboardShortcut, true);

        log('✓ Ready! Keyboard: Ctrl/Cmd + N for new chat');
    };

    init();

})();
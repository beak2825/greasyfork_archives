// ==UserScript==
// @name         Claude Interface Enhancement v3
// @namespace    ClaudeEnhancement
// @version      3
// @description  Colorful button icons, styled bold/italic text, smooth animations for Claude.ai and Gemini. Optimized & cleaner.
// @author       Solomon
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555218/Claude%20Interface%20Enhancement%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/555218/Claude%20Interface%20Enhancement%20v3.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 COLORS
    // ═══════════════════════════════════════════════════════════════════════════

    const C = {
        ORANGE: 'darkorange',
        GREEN: 'springgreen',
        DARK_GREEN: '#00ad00',
        RED: 'crimson',
        YELLOW: 'gold',
        GRAY: 'gray',
        SKYBLUE: 'deepskyblue',
        BLUE: '#4285f4',
        PURPLE: '#9c27b0',
        CYAN: '#00bcd4',
        PINK: '#e91e63'
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES
    // ═══════════════════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* ══════════════════════════════════════════════════════════════════════
           ANIMATIONS
           ══════════════════════════════════════════════════════════════════════ */

        @keyframes cie-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ══════════════════════════════════════════════════════════════════════
           BUTTON COLORS
           ══════════════════════════════════════════════════════════════════════ */

        /* Copy - Orange */
        button[aria-label*="Copy" i] svg,
        button[data-testid*="copy" i] svg,
        button[data-tooltip*="Copy" i] svg {
            color: ${C.ORANGE} !important;
            opacity: 0.9;
            transition: all 0.3s ease !important;
        }
        button[aria-label*="Copy" i]:hover svg,
        button[data-testid*="copy" i]:hover svg,
        button[data-tooltip*="Copy" i]:hover svg {
            filter: drop-shadow(0 0 8px ${C.ORANGE}) !important;
            opacity: 1 !important;
        }

        /* Edit - Yellow */
        button[aria-label*="Edit" i] svg {
            color: ${C.YELLOW} !important;
            opacity: 0.8;
            transition: all 0.3s ease !important;
        }
        button[aria-label*="Edit" i]:hover svg {
            filter: drop-shadow(0 0 8px ${C.YELLOW}) !important;
            opacity: 1 !important;
        }

        /* Retry/Regenerate - Sky Blue */
        button[aria-label*="Retry" i] svg,
        button[aria-label*="Regenerate" i] svg {
            color: ${C.SKYBLUE} !important;
            opacity: 0.9;
            transition: all 0.3s ease !important;
        }
        button[aria-label*="Retry" i]:hover svg,
        button[aria-label*="Regenerate" i]:hover svg {
            filter: drop-shadow(0 0 8px ${C.SKYBLUE}) !important;
            opacity: 1 !important;
            transform: rotate(180deg) !important;
        }

        /* Good (thumbs up) - Green */
        button[aria-label*="Good" i] svg,
        button[data-testid*="good" i] svg {
            color: ${C.DARK_GREEN} !important;
            opacity: 0.9;
            transition: all 0.3s ease !important;
        }
        button[aria-label*="Good" i]:hover svg,
        button[data-testid*="good" i]:hover svg {
            filter: drop-shadow(0 0 8px ${C.DARK_GREEN}) !important;
            opacity: 1 !important;
        }
        button[aria-label*="Good" i]:hover,
        button[data-testid*="good" i]:hover {
            background: rgba(0, 173, 0, 0.12) !important;
        }

        /* Bad (thumbs down) - Red */
        button[aria-label*="Bad" i] svg,
        button[data-testid*="bad" i] svg {
            color: ${C.RED} !important;
            opacity: 0.9;
            transition: all 0.3s ease !important;
        }
        button[aria-label*="Bad" i]:hover svg,
        button[data-testid*="bad" i]:hover svg {
            filter: drop-shadow(0 0 8px ${C.RED}) !important;
            opacity: 1 !important;
        }
        button[aria-label*="Bad" i]:hover,
        button[data-testid*="bad" i]:hover {
            background: rgba(220, 53, 69, 0.12) !important;
        }

        /* Share - Sky Blue */
        button[aria-label*="Share" i] svg {
            color: ${C.SKYBLUE} !important;
            opacity: 0.8;
            transition: all 0.3s ease !important;
        }
        button[aria-label*="Share" i]:hover svg {
            filter: drop-shadow(0 0 8px ${C.SKYBLUE}) !important;
            opacity: 1 !important;
        }

        /* Delete - Red */
        button[aria-label*="Delete" i] svg {
            color: ${C.RED} !important;
        }
        button[aria-label*="Delete" i]:hover {
            background: rgba(224, 46, 42, 0.15) !important;
        }

        /* More - Gray */
        button[aria-label*="More" i] svg {
            color: ${C.GRAY} !important;
            opacity: 0.7;
            transition: all 0.3s ease !important;
        }
        button[aria-label*="More" i]:hover svg {
            opacity: 1 !important;
        }

        /* ══════════════════════════════════════════════════════════════════════
           TEXT STYLING
           ══════════════════════════════════════════════════════════════════════ */

        /* Bold - Light: Purple, Dark: Green */
        b, strong {
            color: ${C.PURPLE} !important;
            font-weight: 600 !important;
            transition: color 0.2s ease !important;
        }
        .dark b, .dark strong {
            color: ${C.GREEN} !important;
        }

        /* Italic - Light: Cyan, Dark: Sky Blue */
        i, em {
            color: ${C.CYAN} !important;
            font-style: italic !important;
            opacity: 0.9;
        }
        .dark i, .dark em {
            color: ${C.SKYBLUE} !important;
        }

        /* Links */
        [class*="message"] a,
        [class*="prose"] a {
            color: ${C.BLUE} !important;
            text-decoration: underline;
            text-decoration-color: ${C.BLUE}50;
            transition: all 0.2s ease !important;
        }
        [class*="message"] a:hover,
        [class*="prose"] a:hover {
            color: ${C.SKYBLUE} !important;
            text-shadow: 0 0 8px ${C.SKYBLUE}80 !important;
        }

        /* Inline code */
        code:not(pre code) {
            color: ${C.PINK} !important;
            background: ${C.PINK}15 !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-weight: 500 !important;
        }
        .dark code:not(pre code) {
            color: ${C.CYAN} !important;
            background: ${C.CYAN}15 !important;
        }

        /* List markers */
        ul li::marker { color: ${C.PURPLE} !important; }
        ol li::marker { color: ${C.BLUE} !important; font-weight: bold !important; }
        .dark ul li::marker { color: ${C.GREEN} !important; }

        /* Blockquotes */
        blockquote {
            border-left: 4px solid ${C.PURPLE} !important;
            padding-left: 16px !important;
            opacity: 0.9;
        }
        .dark blockquote {
            border-left-color: ${C.GREEN} !important;
        }

        /* ══════════════════════════════════════════════════════════════════════
           ANIMATIONS & EFFECTS
           ══════════════════════════════════════════════════════════════════════ */

        /* Message fade-in */
        [class*="message-content"],
        .font-claude-message,
        .font-user-message {
            animation: cie-fade-in 0.5s ease-out !important;
        }

        /* Button hover effects */
        button {
            transition: all 0.25s ease !important;
        }
        button:hover {
            transform: scale(1.05) !important;
        }
        button:active {
            transform: scale(0.95) !important;
        }

        /* Focus ring */
        button:focus-visible {
            outline: 2px solid ${C.BLUE} !important;
            outline-offset: 2px !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
            background: ${C.GRAY}40;
            border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover { background: ${C.GRAY}60; }
        .dark ::-webkit-scrollbar-thumb { background: ${C.GRAY}60; }

        /* Code blocks */
        pre { border-radius: 8px !important; }
    `);

    // ═══════════════════════════════════════════════════════════════════════════
    // ⌨️ KEYBOARD SHORTCUT
    // ═══════════════════════════════════════════════════════════════════════════

    const NEW_CHAT_SELECTORS = [
        'button[aria-label*="new chat" i]',
        'a[href="/"]',
        'a[href="/app"]'
    ];

    function handleKeydown(e) {
        // Ctrl/Cmd + N for new chat
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
            if (e.target.matches('input, textarea, [contenteditable="true"]')) return;

            for (const sel of NEW_CHAT_SELECTORS) {
                const btn = document.querySelector(sel);
                if (btn) {
                    btn.click();
                    e.preventDefault();
                    return;
                }
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 DYNAMIC TEXT STYLING
    // ═══════════════════════════════════════════════════════════════════════════

    function applyTextColors() {
        const isDark = document.documentElement.classList.contains('dark') ||
                       document.body?.classList.contains('dark');

        const boldColor = isDark ? C.GREEN : C.PURPLE;
        const italicColor = isDark ? C.SKYBLUE : C.CYAN;

        document.querySelectorAll('b:not([data-cie]), strong:not([data-cie])').forEach(el => {
            el.setAttribute('data-cie', '1');
            el.style.setProperty('color', boldColor, 'important');
            el.style.setProperty('font-weight', '600', 'important');
        });

        document.querySelectorAll('i:not([data-cie]), em:not([data-cie])').forEach(el => {
            el.setAttribute('data-cie', '1');
            el.style.setProperty('color', italicColor, 'important');
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════

    function init() {
        console.log('[Interface Enhancement v3] 🎨 Ready!');

        // Keyboard shortcut
        document.addEventListener('keydown', handleKeydown, true);

        // Apply text colors and observe changes
        const runWhenReady = () => {
            if (!document.body) {
                setTimeout(runWhenReady, 100);
                return;
            }

            applyTextColors();

            // Observe for new content
            let timeout;
            const observer = new MutationObserver(() => {
                clearTimeout(timeout);
                timeout = setTimeout(applyTextColors, 100);
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Initial applications
            setTimeout(applyTextColors, 1000);
            setTimeout(applyTextColors, 3000);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runWhenReady);
        } else {
            runWhenReady();
        }
    }

    init();

})();
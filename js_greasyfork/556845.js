// ==UserScript==
// @name         Gemini Enhancement
// @namespace    https://loongphy.com
// @version      1.6.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @description  Adds new-tab button, squircle input, and ChatGPT-style text quoting
// @author       loongphy
// @match        https://gemini.google.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556845/Gemini%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/556845/Gemini%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keep a stable opener reference and the target URL we always want to open
    const nativeOpen = window.open.bind(window);
    const TARGET_URL = 'https://gemini.google.com/app';
    const WIDESCREEN_STORAGE_KEY = 'gemini-wide-enabled';
    const DEFAULT_WIDE_ENABLED = true;
    const THOUGHT_ITALIC_STORAGE_KEY = 'gemini-thought-italic-enabled';
    const DEFAULT_THOUGHT_ITALIC_ENABLED = true; // true = keep site default italic

    // ==================== Styles ====================
    const STYLES = `
        /* Squircle for input box */
        input-area-v2 { corner-shape: squircle; }

        .gemini-quote-tip {
            position: absolute;
            z-index: 2147483647;
            padding: 6px 12px;
            border-radius: 999px;
            corner-shape: squircle;
            border: none;
            background: #3f4147;
            color: #f7f8f8;
            font-size: 13px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 16px rgb(0 0 0 / 0.25);
            opacity: 0;
            pointer-events: none;
            transform: translateY(4px) scale(0.97);
            transition: opacity 0.18s ease, transform 0.18s ease;
            white-space: nowrap;
        }

        .gemini-quote-tip.visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0) scale(1);
        }

        .gemini-quote-tip .gemini-quote-tip-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
        }

        .gemini-quote-tip .gemini-quote-tip-icon svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
            display: block;
        }

        .gemini-quote-tip:focus-visible {
            outline: 2px solid #a0c4ff;
            outline-offset: 2px;
        }

        @media (prefers-color-scheme: light) {
            .gemini-quote-tip {
                background: #f5f6f8;
                color: #1f1f1f;
            }
        }

        /* New tab button - positioned next to Gemini logo */
        .gemini-new-tab-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: transparent;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;
            color: #444746;
            margin-left: 6px;
            flex-shrink: 0;
            vertical-align: middle;
            align-self: center;
        }
        .gemini-new-tab-btn:hover {
            background-color: rgba(68, 71, 70, 0.08);
        }
        .gemini-new-tab-btn:active {
            background-color: rgba(68, 71, 70, 0.12);
        }
        .gemini-new-tab-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }
        @media (prefers-color-scheme: dark) {
            .gemini-new-tab-btn {
                color: #E8EAED;
            }
            .gemini-new-tab-btn:hover {
                background-color: rgba(232, 234, 237, 0.18);
            }
            .gemini-new-tab-btn:active {
                background-color: rgba(232, 234, 237, 0.26);
            }
        }
    `;

    // Smallest width constraint for content is set on .conversation-container (760px);
    // we widen that only to avoid touching the input box layout.
    const WIDESCREEN_STYLES = `
        :root {
            --gemini-wide-message-max-width: 1120px;
        }

        body.gemini-wide main .conversation-container {
            max-width: var(--gemini-wide-message-max-width) !important;
            width: min(100%, var(--gemini-wide-message-max-width)) !important;
        }

        body.gemini-wide main user-query,
        body.gemini-wide main model-response {
            max-width: 100% !important;
            width: 100% !important;
        }
    `;

    const THOUGHT_ITALIC_RESET_STYLES = `
        model-thoughts message-content {
            font-style: normal !important;
        }
    `;

    function injectStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);
    }

    function setupWideScreenToggle() {
        const wideStyleEl = document.createElement('style');

        const readWidePref = () => {
            try {
                const saved = localStorage.getItem(WIDESCREEN_STORAGE_KEY);
                if (saved === null) return DEFAULT_WIDE_ENABLED;
                return saved === 'true';
            } catch {
                return DEFAULT_WIDE_ENABLED;
            }
        };

        const writeWidePref = (enabled) => {
            try {
                localStorage.setItem(WIDESCREEN_STORAGE_KEY, enabled ? 'true' : 'false');
            } catch {
                /* ignore persistence errors */
            }
        };

        const applyWideStyles = (enabled) => {
            document.body.classList.toggle('gemini-wide', enabled);
            wideStyleEl.textContent = enabled ? WIDESCREEN_STYLES : '';
        };

        document.head.appendChild(wideStyleEl);

        let wideEnabled = readWidePref();
        applyWideStyles(wideEnabled);

        const registerMenu = () => {
            if (typeof GM_registerMenuCommand !== 'function') return;
            if (typeof GM_unregisterMenuCommand === 'function' && registerMenu.menuId) {
                GM_unregisterMenuCommand(registerMenu.menuId);
            }
            registerMenu.menuId = GM_registerMenuCommand(`宽屏显示：${wideEnabled ? '开' : '关'}`, () => {
                wideEnabled = !wideEnabled;
                writeWidePref(wideEnabled);
                applyWideStyles(wideEnabled);
                registerMenu();
            });
        };

        registerMenu();
    }

    function setupThoughtItalicToggle() {
        const italicStyleEl = document.createElement('style');

        const readItalicPref = () => {
            try {
                const saved = localStorage.getItem(THOUGHT_ITALIC_STORAGE_KEY);
                if (saved === null) return DEFAULT_THOUGHT_ITALIC_ENABLED;
                return saved === 'true';
            } catch {
                return DEFAULT_THOUGHT_ITALIC_ENABLED;
            }
        };

        const writeItalicPref = (enabled) => {
            try {
                localStorage.setItem(THOUGHT_ITALIC_STORAGE_KEY, enabled ? 'true' : 'false');
            } catch {
                /* ignore persistence errors */
            }
        };

        const applyItalicStyles = (enabled) => {
            italicStyleEl.textContent = enabled ? '' : THOUGHT_ITALIC_RESET_STYLES;
        };

        document.head.appendChild(italicStyleEl);

        let italicEnabled = readItalicPref();
        applyItalicStyles(italicEnabled);

        const registerMenu = () => {
            if (typeof GM_registerMenuCommand !== 'function') return;
            if (typeof GM_unregisterMenuCommand === 'function' && registerMenu.menuId) {
                GM_unregisterMenuCommand(registerMenu.menuId);
            }
            registerMenu.menuId = GM_registerMenuCommand(`思维链斜体：${italicEnabled ? '开' : '关'}`, () => {
                italicEnabled = !italicEnabled;
                writeItalicPref(italicEnabled);
                applyItalicStyles(italicEnabled);
                registerMenu();
            });
        };

        registerMenu();
    }

    function setupQuoteSelectionFeature() {
        if (document.querySelector('.gemini-quote-tip')) return;

        const tip = document.createElement('button');
        tip.type = 'button';
        tip.className = 'gemini-quote-tip';
        const iconSpan = document.createElement('span');
        iconSpan.className = 'gemini-quote-tip-icon';
        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.setAttribute('viewBox', '0 0 16 16');
        svgEl.setAttribute('width', '16');
        svgEl.setAttribute('height', '16');
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('fill', 'currentColor');
        pathEl.setAttribute('d', 'M6.848 2.47a1 1 0 0 1-.318 1.378A7.3 7.3 0 0 0 3.75 7.01A3 3 0 1 1 1 10v-.027a4 4 0 0 1 .01-.232c.009-.15.027-.36.062-.618c.07-.513.207-1.22.484-2.014c.552-1.59 1.67-3.555 3.914-4.957a1 1 0 0 1 1.378.318m7 0a1 1 0 0 1-.318 1.378a7.3 7.3 0 0 0-2.78 3.162A3 3 0 1 1 8 10v-.027a4 4 0 0 1 .01-.232c.009-.15.027-.36.062-.618c.07-.513.207-1.22.484-2.014c.552-1.59 1.67-3.555 3.914-4.957a1 1 0 0 1 1.378.318');
        svgEl.appendChild(pathEl);
        iconSpan.appendChild(svgEl);
        const labelSpan = document.createElement('span');
        labelSpan.textContent = '引用';
        tip.appendChild(iconSpan);
        tip.appendChild(labelSpan);
        document.body.appendChild(tip);

        let pendingText = '';

        const hideTip = () => {
            pendingText = '';
            tip.classList.remove('visible');
        };

        const positionTip = (rect) => {
            const docTop = window.scrollY || document.documentElement.scrollTop || 0;
            const docLeft = window.scrollX || document.documentElement.scrollLeft || 0;
            let top = docTop + rect.top - tip.offsetHeight - 10;
            if (top < docTop + 8) {
                top = docTop + rect.bottom + 10;
            }
            let left = docLeft + rect.left + (rect.width / 2) - (tip.offsetWidth / 2);
            const maxLeft = docLeft + document.documentElement.clientWidth - tip.offsetWidth - 8;
            left = Math.max(docLeft + 8, Math.min(left, maxLeft));
            tip.style.top = `${top}px`;
            tip.style.left = `${left}px`;
        };

        const updateTipVisibility = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || !selection.rangeCount) {
                hideTip();
                return;
            }
            const text = selection.toString().trim();
            if (!text) {
                hideTip();
                return;
            }
            const host = findMessageContentHost(selection.anchorNode) || findMessageContentHost(selection.focusNode);
            if (!host) {
                hideTip();
                return;
            }
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (!rect || (rect.width === 0 && rect.height === 0)) {
                hideTip();
                return;
            }
            pendingText = text;
            positionTip(rect);
            tip.classList.add('visible');
        };

        tip.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!pendingText) return;
            insertQuoteIntoInput(pendingText);
            hideTip();
            window.getSelection()?.removeAllRanges();
        });

        const scheduleUpdate = () => {
            requestAnimationFrame(() => requestAnimationFrame(updateTipVisibility));
        };

        document.addEventListener('pointerup', scheduleUpdate);
        document.addEventListener('keyup', (evt) => { if (evt.key === 'Escape') hideTip(); });
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) hideTip();
        });
        window.addEventListener('scroll', hideTip, true);
        document.addEventListener('pointerdown', (evt) => {
            if (!evt.target.closest('.gemini-quote-tip')) hideTip();
        });
    }

    function findMessageContentHost(node) {
        let current = node;
        while (current) {
            if (current.nodeType === Node.ELEMENT_NODE && current.matches && current.matches('message-content')) {
                return current;
            }
            if (current.nodeType === Node.DOCUMENT_FRAGMENT_NODE && current.host) {
                current = current.host;
            } else {
                current = current.parentNode || current.parentElement;
            }
        }
        return null;
    }

    function insertQuoteIntoInput(rawText) {
        if (!rawText) return;
        const editor = document.querySelector('input-area-v2 .ql-editor');
        if (!editor) return;
        const normalizedLines = rawText
            .replace(/\r\n/g, '\n')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        if (!normalizedLines.length) return;
        const blockquote = normalizedLines.map(line => `> ${line}`).join('\n');

        const rawEditorText = (editor.innerText || '').replace(/\u200b/g, '');
        const editorHasContent = rawEditorText.trim().length > 0;
        if (!editorHasContent) {
            while (editor.firstChild) editor.removeChild(editor.firstChild);
        }
        const prefix = editorHasContent ? '\n' : '';
        const payload = `${prefix}${blockquote}\n\n`;

        const selection = window.getSelection();
        if (selection) selection.removeAllRanges();

        editor.focus();
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        const textNode = document.createTextNode(payload);
        range.deleteContents();
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        editor.dispatchEvent(new InputEvent('input', { bubbles: true, data: payload, inputType: 'insertText' }));
    }

    function createNewTabButton() {
        const button = document.createElement('button');
        button.className = 'gemini-new-tab-btn';
        button.title = 'Open Gemini in New Tab';
        button.type = 'button';
        
        // SVG icon (open in new tab) using DOM APIs
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z');
        svg.appendChild(path);
        button.appendChild(svg);

        // Always open the Gemini home/app entry, prevent parent handlers from hijacking
        const openTarget = (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const newTab = nativeOpen(TARGET_URL, '_blank', 'noopener,noreferrer');
            if (newTab) return;

            // Fallback if popups are blocked
            const anchorEl = document.createElement('a');
            anchorEl.href = TARGET_URL;
            anchorEl.target = '_blank';
            anchorEl.rel = 'noopener noreferrer';
            document.body.appendChild(anchorEl);
            anchorEl.click();
            anchorEl.remove();
        };

        // Capture + bubble to beat site handlers
        button.addEventListener('click', openTarget, true);
        button.addEventListener('click', openTarget);

        // Mount button after Gemini text
        function mountButton() {
            const geminiText = document.querySelector('.bard-text');
            if (geminiText && geminiText.parentNode) {
                // Prevent duplicate insertion or unnecessary moves
                if (geminiText.nextSibling === button) return;
                
                geminiText.parentNode.insertBefore(button, geminiText.nextSibling);
            }
        }

        // Observe DOM changes to handle SPA navigation and dynamic rendering
        const observer = new MutationObserver(() => {
            mountButton();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        mountButton();
    }

    // ==================== Initialize ====================
    function init() {
        injectStyles();
        setupWideScreenToggle();
        setupThoughtItalicToggle();
        createNewTabButton();
        setupQuoteSelectionFeature();
    }

    init();
})();

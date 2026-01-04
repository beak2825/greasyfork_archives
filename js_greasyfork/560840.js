// ==UserScript==
// @name         Gemini Nav Buttons
// @namespace    https://greasyfork.org/en/users/1509088-eithon
// @version      5.0
// @description  A horizontal navigation panel with chat width adjustment. Merges Gemini Nav Pro with Gemini Better UI features.
// @author       Te55eract, Eithon, JonathanLU, & Gemini AI
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560840/Gemini%20Nav%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/560840/Gemini%20Nav%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY_WIDTH = 'geminiNavProWidth';
    const DEFAULT_WIDTH = 90;
    const MIN_WIDTH = 50;
    const MAX_WIDTH = 100;
    const STEP_WIDTH = 10;

    // --- CSS Styles ---
    // Includes structural overrides to allow width changing and the new panel style
    GM_addStyle(`
        :root { --gemini-dynamic-width: ${localStorage.getItem(STORAGE_KEY_WIDTH) || DEFAULT_WIDTH}%; }

        /* --- Panel Styling (Horizontal) --- */
        #gemini-nav-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: rgba(255, 255, 255, 0.95);
            border: 1px solid #DDE2E7;
            border-radius: 24px; /* Pill shape */
            padding: 6px 12px;
            display: none; /* Hidden until loaded */
            flex-direction: row;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
            transition: opacity 0.3s ease;
        }

        .gemini-nav-btn {
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
            color: #444746;
            border-radius: 50%;
            font-size: 16px;
            border: 1px solid transparent;
            transition: all 0.2s ease;
            font-family: 'Google Sans', sans-serif;
            padding: 0;
        }

        .gemini-nav-btn:hover:not(:disabled) {
            background-color: #f0f4f9;
            color: #1f1f1f;
            border-color: #d3e3fd;
        }

        .gemini-nav-btn:disabled {
            opacity: 0.3;
            cursor: default;
        }

        .gemini-nav-divider {
            width: 1px;
            height: 20px;
            background-color: #DDE2E7;
            margin: 0 4px;
        }

        /* --- Width Adjustment Text --- */
        #gemini-width-display {
            font-size: 12px;
            font-family: monospace;
            color: #444746;
            min-width: 30px;
            text-align: center;
            user-select: none;
        }

        /* --- Dark Mode Support --- */
        body.dark-theme #gemini-nav-panel {
            background-color: rgba(30, 31, 34, 0.95);
            border-color: #444746;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        body.dark-theme .gemini-nav-btn { color: #e3e3e3; }
        body.dark-theme .gemini-nav-btn:hover:not(:disabled) { background-color: #383b3e; border-color: #5e6063; }
        body.dark-theme .gemini-nav-divider { background-color: #444746; }
        body.dark-theme #gemini-width-display { color: #e3e3e3; }

        /* --- Gemini Layout Overrides (To enable Width Adjustment) --- */
        /* These force the chat container to respect our custom variable */
        .chat-history-scroll-container,
        div#chat-history {
            width: 100% !important;
            max-width: 100% !important;
        }

        .conversation-container {
            width: var(--gemini-dynamic-width) !important;
            max-width: 100% !important;
            margin: 0 auto !important;
        }

        /* Force messages to expand to fill the new width */
        user-query, model-response,
        .user-query-container, .model-response-container {
            max-width: none !important;
            width: 100% !important;
        }

        /* Adjust internal message bubbles to look good at wide widths */
        .user-query-bubble-with-background,
        .markdown.markdown-main-panel {
            max-width: 100% !important;
            box-sizing: border-box !important;
        }

        /* Prevent text from getting too wide to read efficiently (optional cap, set to 1800px) */
        .markdown.markdown-main-panel {
             max-width: 1800px !important;
        }
    `);

    // --- State Variables ---
    let navPanel = null;
    let cachedScrollContainer = null;
    let currentConvWidth = parseInt(localStorage.getItem(STORAGE_KEY_WIDTH)) || DEFAULT_WIDTH;

    // --- Core Logic ---

    // 1. Width Management
    function setConversationWidth(newWidth) {
        // Clamp values
        if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
        if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;

        currentConvWidth = newWidth;
        localStorage.setItem(STORAGE_KEY_WIDTH, currentConvWidth);

        // Update CSS Variable
        document.documentElement.style.setProperty('--gemini-dynamic-width', currentConvWidth + '%');

        // Update Display Text
        const displayEl = document.getElementById('gemini-width-display');
        if (displayEl) displayEl.textContent = currentConvWidth + '%';
    }

    // 2. Navigation Utilities
    function findScrollContainer() {
        if (cachedScrollContainer && document.body.contains(cachedScrollContainer)) return cachedScrollContainer;
        // Locate the main scrollable area
        const possibleContainers = document.querySelectorAll('.chat-history-scroll-container, #chat-history');
        for (let el of possibleContainers) {
            if (el.scrollHeight > el.clientHeight) {
                cachedScrollContainer = el;
                return el;
            }
        }
        // Fallback: look for parent of last response
        const lastResponse = Array.from(document.querySelectorAll('model-response')).pop();
        if (lastResponse) {
            let parent = lastResponse.parentElement;
            while (parent && parent !== document.body) {
                if (parent.scrollHeight > parent.clientHeight || getComputedStyle(parent).overflowY === 'auto') {
                    cachedScrollContainer = parent;
                    return parent;
                }
                parent = parent.parentElement;
            }
        }
        return document.documentElement; // Final fallback
    }

    function smoothScrollToElement(element) {
        if (!element) return;
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 3. UI Construction
    function createIcon(char) {
        // Simple helper for text icons, can be replaced with SVGs if desired
        return char;
    }

    function buildPanel() {
        if (document.getElementById('gemini-nav-panel')) return;

        navPanel = document.createElement('div');
        navPanel.id = 'gemini-nav-panel';

        // --- Navigation Group ---
        const btnTop = createBtn('⏫', 'Scroll to Top', () => {
            const sc = findScrollContainer();
            if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const btnPrev = createBtn('▲', 'Previous Prompt', () => navigatePrompt(-1));
        const btnNext = createBtn('▼', 'Next Prompt', () => navigatePrompt(1));

        const btnBottom = createBtn('⏬', 'Scroll to Bottom', () => {
            const sc = findScrollContainer();
            if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
        });

        // --- Width Group ---
        const divider = document.createElement('div');
        divider.className = 'gemini-nav-divider';

        const btnWidthDec = createBtn('－', 'Decrease Width', () => setConversationWidth(currentConvWidth - STEP_WIDTH));

        const widthDisplay = document.createElement('span');
        widthDisplay.id = 'gemini-width-display';
        widthDisplay.textContent = currentConvWidth + '%';

        const btnWidthInc = createBtn('＋', 'Increase Width', () => setConversationWidth(currentConvWidth + STEP_WIDTH));

        // Append All
        navPanel.append(
            btnTop, btnPrev, btnNext, btnBottom,
            divider,
            btnWidthDec, widthDisplay, btnWidthInc
        );

        document.body.appendChild(navPanel);
        navPanel.style.display = 'flex'; // Make visible

        // Initialize CSS width immediately
        setConversationWidth(currentConvWidth);
    }

    function createBtn(text, tooltip, onClick) {
        const btn = document.createElement('button');
        btn.className = 'gemini-nav-btn';
        btn.textContent = text;
        btn.title = tooltip;
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        };
        return btn;
    }

    // 4. Prompt Navigation Logic
    function navigatePrompt(direction) {
        // direction: -1 (prev) or 1 (next)
        const userPrompts = Array.from(document.querySelectorAll('user-query'));
        if (userPrompts.length === 0) return;

        // Find which prompt is currently most visible
        const viewportMid = window.innerHeight / 2;
        let closestIndex = -1;
        let minDist = Infinity;

        userPrompts.forEach((p, index) => {
            const rect = p.getBoundingClientRect();
            const dist = Math.abs(rect.top - viewportMid);
            if (dist < minDist) {
                minDist = dist;
                closestIndex = index;
            }
        });

        // Determine target
        let targetIndex = closestIndex + direction;

        // If we are scrolling UP and the current prompt is way below the top,
        // we might actually want to scroll to the CURRENT closest index first (snap to it),
        // but simple index logic usually works best.

        // Bounds check
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= userPrompts.length) targetIndex = userPrompts.length - 1;

        smoothScrollToElement(userPrompts[targetIndex]);
    }

    // 5. Main Loop (Checks for chat existence to show panel)
    function mainLoop() {
        // If we are in a chat (user-query exists), show panel.
        const hasContent = document.querySelector('user-query') || document.querySelector('model-response');

        if (hasContent && !navPanel) {
            buildPanel();
        } else if (hasContent && navPanel) {
            navPanel.style.display = 'flex';
        } else if (!hasContent && navPanel) {
            navPanel.style.display = 'none';
        }
    }

    // Run loop
    setInterval(mainLoop, 1000);

    // Initial run
    setTimeout(mainLoop, 1000);

})();
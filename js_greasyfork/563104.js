// ==UserScript==
// @name         Gemini Deep Research - Zen Mode
// @namespace    https://github.com/YourUsername/gemini-zen-mode
// @version      1.0
// @description  A "Focus Mode" for Google Gemini's Deep Research. Hides the sidebar, centers the text for readability, adds a reading progress bar, and provides a floating exit button.
// @author       AmitaiSalmon
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL https://update.greasyfork.org/scripts/563104/Gemini%20Deep%20Research%20-%20Zen%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/563104/Gemini%20Deep%20Research%20-%20Zen%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    const CONFIG = {
        anchorText: ["Share & Export", "Create"],
        buttonId: "tm-focus-mode-btn",
        progressId: "tm-reading-progress",
        activeClass: "tm-focus-mode-active",
        maxWidth: "850px"
    };

    // ============================================================================
    // STYLES
    // ============================================================================
    GM_addStyle(`
        /* 1. Toggle Button (Header State) */
        #${CONFIG.buttonId} {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            padding: 0 16px;
            margin-right: 8px;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: transparent;
            color: var(--gm-on-surface, #e3e3e3);
            font-family: "Google Sans", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            z-index: 10002;
            transition: all 0.3s ease;
        }
        #${CONFIG.buttonId}:hover { background: rgba(255, 255, 255, 0.08); }

        /* 2. Floating Exit Button (Active State) */
        body.${CONFIG.activeClass} #${CONFIG.buttonId} {
            position: fixed;
            bottom: 30px;
            right: 30px;
            top: auto;
            left: auto;
            margin: 0;
            background: rgba(30, 31, 32, 0.8);
            color: #e3e3e3;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 20002; /* Above everything */
            opacity: 0.5;
        }
        body.${CONFIG.activeClass} #${CONFIG.buttonId}:hover {
            opacity: 1;
            background: #3c4043;
            transform: scale(1.05);
        }

        /* 3. READING PROGRESS BAR */
        #${CONFIG.progressId} {
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background: #a8c7fa; /* Google Blue */
            width: 0%;
            z-index: 20005; /* Highest priority */
            transition: width 0.1s ease-out;
            pointer-events: none;
            display: none; /* Hidden by default */
            box-shadow: 0 1px 4px rgba(168, 199, 250, 0.4);
        }
        body.${CONFIG.activeClass} #${CONFIG.progressId} {
            display: block;
        }

        /* 4. Fullscreen Overlay */
        body.${CONFIG.activeClass} .tm-identified-report-panel {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 10001 !important;
            background: var(--gm-surface, #131314) !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* 5. Hide Header */
        body.${CONFIG.activeClass} .tm-identified-header {
            display: none !important;
        }

        /* 6. Scrollable Content Area */
        body.${CONFIG.activeClass} .tm-identified-report-panel > div:not(.tm-identified-header) {
            flex-grow: 1 !important;
            width: 100% !important;
            height: 100% !important;
            overflow-y: auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding-top: 40px !important;
        }

        /* 7. Text Constraint (70%) */
        body.${CONFIG.activeClass} .tm-identified-report-panel > div:not(.tm-identified-header) > * {
            width: 70vw !important;
            max-width: ${CONFIG.maxWidth} !important;
            min-width: 600px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding-bottom: 200px !important;
            box-sizing: border-box !important;
        }
    `);

    // ============================================================================
    // LOGIC
    // ============================================================================

    // --- Panel Identification ---
    function identifyPanels(btn) {
        let current = btn.closest('div');
        let attempts = 0;
        let reportPanel = null;
        let headerRow = btn.closest('[role="toolbar"], .row') || btn.parentElement;

        // Find the "Report Container" (taller than half screen)
        while (current && current.parentElement && attempts < 10) {
            const rect = current.getBoundingClientRect();
            if (rect.height > (window.innerHeight * 0.5)) {
                 reportPanel = current;
                 break;
            }
            current = current.parentElement;
            attempts++;
        }
        if (!reportPanel) reportPanel = btn.closest('div').parentElement.parentElement.parentElement;
        if (!headerRow) headerRow = btn.parentElement;

        // Find the full Header container (to hide it)
        const likelyHeaderContainer = headerRow.closest('header') || headerRow.parentElement;

        return { report: reportPanel, header: likelyHeaderContainer };
    }

    // --- Progress Bar Logic ---
    function updateProgress(e) {
        const el = e.target;
        const progressBar = document.getElementById(CONFIG.progressId);
        if (!progressBar) return;

        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        const clientHeight = el.clientHeight;

        // Prevent divide by zero
        if (scrollHeight <= clientHeight) {
            progressBar.style.width = '100%';
            return;
        }

        const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        progressBar.style.width = percent + '%';
    }

    // --- Main Toggle Function ---
    function toggleFocusMode(btn) {
        const body = document.body;
        const isActivating = !body.classList.contains(CONFIG.activeClass);
        let progressBar = document.getElementById(CONFIG.progressId);

        if (isActivating) {
            const panels = identifyPanels(btn);
            if (panels.report) {
                // 1. Tag Panels
                document.querySelectorAll('.tm-identified-report-panel').forEach(el => el.classList.remove('tm-identified-report-panel'));
                panels.report.classList.add('tm-identified-report-panel');
                if (panels.header) panels.header.classList.add('tm-identified-header');

                // 2. Handle Button Move
                const placeholder = document.createElement('span');
                placeholder.id = 'tm-btn-placeholder';
                btn.parentNode.insertBefore(placeholder, btn);
                document.body.appendChild(btn);

                // 3. Inject Progress Bar (if needed)
                if (!progressBar) {
                    progressBar = document.createElement('div');
                    progressBar.id = CONFIG.progressId;
                    document.body.appendChild(progressBar);
                }

                // 4. Attach Scroll Listener
                // We need to find the scrollable child INSIDE the report panel
                // It's the one we applied 'overflow-y: auto' to in CSS
                const scrollContainer = panels.report.querySelector(':scope > div:not(.tm-identified-header)');
                if (scrollContainer) {
                    scrollContainer.addEventListener('scroll', updateProgress);
                    // Initial update
                    updateProgress({ target: scrollContainer });
                }

                // 5. Activate UI
                body.classList.add(CONFIG.activeClass);
                btn.classList.add('active');
                btn.textContent = "Exit Zen Mode";
            }
        } else {
            // 1. Deactivate UI
            body.classList.remove(CONFIG.activeClass);
            btn.classList.remove('active');
            btn.textContent = "Focus Mode";

            // 2. Cleanup Classes
            document.querySelectorAll('.tm-identified-report-panel').forEach(el => el.classList.remove('tm-identified-report-panel'));
            document.querySelectorAll('.tm-identified-header').forEach(el => el.classList.remove('tm-identified-header'));

            // 3. Detach Scroll Listener & Reset Bar
            // We have to find the container again (or store it, but this is safer for dynamic DOMs)
            // Since classes are removed, we just rely on garbage collection for the listener usually,
            // but explicitly setting width to 0 is good UX.
            if (progressBar) progressBar.style.width = '0%';

            // 4. Restore Button
            const placeholder = document.getElementById('tm-btn-placeholder');
            if (placeholder) {
                placeholder.parentNode.insertBefore(btn, placeholder);
                placeholder.remove();
            } else {
                injectButton();
                btn.remove();
            }
        }
    }

    // --- Initialization ---
    function injectButton() {
        if (document.getElementById(CONFIG.buttonId)) return;

        const allElements = document.querySelectorAll('button, span, div[role="button"]');
        let anchorElement = null;

        for (const el of allElements) {
            if (el.innerText && CONFIG.anchorText.some(text => el.innerText.includes(text))) {
                anchorElement = el;
                break;
            }
        }

        if (!anchorElement) return;

        const headerToolbar = anchorElement.closest('[role="toolbar"], .row, div') || anchorElement.parentElement;

        if (headerToolbar) {
            const btn = document.createElement('button');
            btn.id = CONFIG.buttonId;
            btn.textContent = "Focus Mode";
            btn.onclick = (e) => {
                e.stopPropagation();
                toggleFocusMode(btn);
            };
            headerToolbar.insertBefore(btn, headerToolbar.firstChild);
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (!document.getElementById(CONFIG.buttonId)) injectButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(injectButton, 1500);

})();
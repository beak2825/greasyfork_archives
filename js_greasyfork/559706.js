// ==UserScript==
// @name         Google AI Studio | Collapse/Expand All Code Blocks (Manual/Automatic)
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      2.9
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Collapse/expand all code blocks with dual toolbar buttons, auto-collapse mode, and lazy loading support.
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559706/Google%20AI%20Studio%20%7C%20CollapseExpand%20All%20Code%20Blocks%20%28ManualAutomatic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559706/Google%20AI%20Studio%20%7C%20CollapseExpand%20All%20Code%20Blocks%20%28ManualAutomatic%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window._codeBlockToggleLoaded) return;
    window._codeBlockToggleLoaded = true;
    if (window.self !== window.top) return;

    //================================================================================
    // STATE & STORAGE
    //================================================================================
    const STORAGE_KEY = 'codeblock_toggle_state';
    const DEFAULT_SETTINGS = { autoMode: 'off' }; // 'off' or 'collapse'

    let settings = { ...DEFAULT_SETTINGS };

    function deserializeSettings(raw) {
        if (!raw) return null;
        try {
            if (typeof raw === 'string') return JSON.parse(raw);
            if (typeof raw === 'object') return raw;
        } catch (e) {
            return null;
        }
        return null;
    }

    function loadSettings() {
        // Prefer GM storage; migrate from legacy localStorage if present.
        let parsed = null;
        let fromLegacyLocalStorage = false;

        try {
            parsed = deserializeSettings(GM_getValue(STORAGE_KEY, null));
        } catch (e) {
            console.warn('[Code Block Toggle] Failed to read GM settings:', e);
        }

        if (!parsed) {
            try {
                const legacyRaw = localStorage.getItem(STORAGE_KEY);
                parsed = deserializeSettings(legacyRaw);
                fromLegacyLocalStorage = !!parsed;
            } catch (e) {
                console.warn('[Code Block Toggle] Failed to read legacy localStorage settings:', e);
            }
        }

        if (!parsed) return;

        let needsSave = fromLegacyLocalStorage;

        // Migration from old format (v1.x)
        if ('isActive' in parsed || 'collapseMode' in parsed) {
            settings.autoMode = (parsed.isActive && parsed.collapseMode) ? 'collapse' : 'off';
            needsSave = true;
        } else {
            settings = { ...DEFAULT_SETTINGS, ...parsed };
        }

        if (needsSave) {
            const ok = saveSettings();
            // Best-effort cleanup of legacy storage only after successful GM save
            if (ok && fromLegacyLocalStorage) {
                try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
            }
        }
    }

    function saveSettings() {
        try {
            GM_setValue(STORAGE_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.warn('[Code Block Toggle] Failed to save GM settings:', e);
            return false;
        }
    }

    //================================================================================
    // STYLES
    //================================================================================
    GM_addStyle(`
        /* Dual toolbar button container - Material Design style */
        .cbc-dual-btn {
            display: inline-flex;
            align-items: center;
            gap: 2px;

            /* Back to AI Studio "normal" look: no grouped rectangle */
            border: none;
            background: transparent;
            border-radius: 0;
            overflow: visible;

            height: 32px;
            margin: 0 4px;
        }

        /* Distinct, best-practice colors (like the original v1.6 modes) */
        #cbc-toolbar-toggle .cbc-collapse-btn {
            color: #4285f4 !important;
        }
        #cbc-toolbar-toggle .cbc-expand-btn {
            color: #fbbc04 !important;
        }

        .cbc-dual-btn button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            min-width: 32px;
            min-height: 32px;
            border-radius: 50%; /* Circular "glow" shape */

            border: none;
            background: transparent;

            /* IMPORTANT: don't force white icons (AI Studio can be light theme) */
            color: inherit;

            cursor: pointer;
            transition: background 0.15s ease;
            padding: 0;
            margin: 0;
            outline: none;
        }

        /* Light Mode Hover */
        .cbc-dual-btn button:hover {
            background: rgba(0, 0, 0, 0.08);
        }
        .cbc-dual-btn button:active {
            background: rgba(0, 0, 0, 0.12);
        }

        /* Dark Mode Hover - The "White Glow" */
        @media (prefers-color-scheme: dark) {
            .cbc-dual-btn button:hover {
                background: rgba(255, 255, 255, 0.08);
            }
            .cbc-dual-btn button:active {
                background: rgba(255, 255, 255, 0.12);
            }
        }

        /* Ensure the Material Symbols chevrons render at expected size */
        .cbc-dual-btn button .material-symbols-outlined {
            font-size: 20px;
            line-height: 1;
        }

        /* Auto-collapse indicator without adding boxes/rectangles */
        #cbc-toolbar-toggle.auto-active .cbc-collapse-btn .material-symbols-outlined {
            font-variation-settings: 'FILL' 1;
        }

        /* Removed border-right that caused the "bright edge" */
        .cbc-dual-btn .cbc-collapse-btn {
            position: relative;
            overflow: hidden;
        }

        /* Fill animation for hold gesture */
        .cbc-collapse-btn::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            height: 0%;
            pointer-events: none;
            z-index: 0;
        }

        .cbc-collapse-btn.filling-up::before {
            bottom: 0;
            background: rgba(66, 133, 244, 0.35);
            animation: cbcFillUp 500ms linear forwards;
        }

        .cbc-collapse-btn.filling-down::before {
            top: 0;
            background: rgba(120, 120, 120, 0.35);
            animation: cbcFillDown 500ms linear forwards;
        }

        .cbc-dual-btn button .material-symbols-outlined {
            position: relative;
            z-index: 1;
        }

        @keyframes cbcFillUp {
            from { height: 0%; }
            to { height: 100%; }
        }

        @keyframes cbcFillDown {
            from { height: 0%; }
            to { height: 100%; }
        }

        /* Auto-collapse active state - Google Blue accent */
        .cbc-dual-btn.auto-active .cbc-collapse-btn {
            color: #4285f4 !important;
            background-color: rgba(66, 133, 244, 0.15);
            box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.3); /* Persistent circle border */
        }

        .cbc-dual-btn.auto-active .cbc-collapse-btn:hover {
            background-color: rgba(66, 133, 244, 0.25);
        }

        /* Custom tooltip - Material Design style */
        .cbc-hold-tooltip {
            position: fixed;
            background: #303134;
            border: 1px solid #5f6368;
            border-radius: 4px; /* Flatter Material style */
            padding: 6px 10px;
            font-family: 'Google Sans', Roboto, sans-serif;
            font-size: 11px;
            font-weight: 500;
            color: #e8eaed;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.1s ease, visibility 0.1s ease;

            /* Allow multi-line tooltips */
            white-space: pre-line;
            text-align: center;
            line-height: 1.4;
            max-width: 250px;
        }

        .cbc-hold-tooltip.visible {
            opacity: 1;
            visibility: visible;
        }

        /* Tooltip arrow: dynamically flips based on placement (top/bottom) */
        .cbc-hold-tooltip::before,
        .cbc-hold-tooltip::after {
            content: '';
            position: absolute;
            left: var(--cbc-arrow-left, 50%);
            transform: translateX(-50%);
            width: 0;
            height: 0;
        }

        /* Tooltip ABOVE button -> arrow points DOWN (at bottom of tooltip) */
        .cbc-hold-tooltip.pos-top::before {
            bottom: -6px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #5f6368;
        }
        .cbc-hold-tooltip.pos-top::after {
            bottom: -5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #303134;
        }

        /* Tooltip BELOW button -> arrow points UP (at top of tooltip) */
        .cbc-hold-tooltip.pos-bottom::before {
            top: -6px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #5f6368;
        }
        .cbc-hold-tooltip.pos-bottom::after {
            top: -5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid #303134;
        }

        .cbc-hold-tooltip.confirmed {
            background: rgba(66, 133, 244, 0.95);
            border-color: #4285f4;
            color: #fff;
            font-weight: 500;
        }

        .cbc-hold-tooltip.confirmed.pos-top::before {
            border-top-color: #4285f4;
        }
        .cbc-hold-tooltip.confirmed.pos-top::after {
            border-top-color: rgba(66, 133, 244, 0.95);
        }
        .cbc-hold-tooltip.confirmed.pos-bottom::before {
            border-bottom-color: #4285f4;
        }
        .cbc-hold-tooltip.confirmed.pos-bottom::after {
            border-bottom-color: rgba(66, 133, 244, 0.95);
        }

        .cbc-hold-tooltip.deactivated {
            background: rgba(95, 99, 104, 0.95);
            border-color: #5f6368;
            color: #fff;
            font-weight: 500;
        }

        .cbc-hold-tooltip.deactivated.pos-top::before {
            border-top-color: #5f6368;
        }
        .cbc-hold-tooltip.deactivated.pos-top::after {
            border-top-color: rgba(95, 99, 104, 0.95);
        }
        .cbc-hold-tooltip.deactivated.pos-bottom::before {
            border-bottom-color: #5f6368;
        }
        .cbc-hold-tooltip.deactivated.pos-bottom::after {
            border-bottom-color: rgba(95, 99, 104, 0.95);
        }
    `);

    //================================================================================
    // CORE LOGIC
    //================================================================================

    function setBlockState(header, expanded) {
        const now = Date.now();
        const lastClick = parseInt(header.dataset.toggleTs || '0', 10);
        if (now - lastClick < 300) return;

        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        if (isExpanded !== expanded) {
            header.dataset.toggleTs = String(now);
            header.click();
        }
    }

    function collapseBlock(header) {
        setBlockState(header, false);
    }

    function expandBlock(header) {
        setBlockState(header, true);
    }

    function getAllCodeBlocks() {
        return document.querySelectorAll('ms-code-block mat-expansion-panel-header');
    }

    function collapseAll() {
        getAllCodeBlocks().forEach(collapseBlock);
    }

    function expandAll() {
        getAllCodeBlocks().forEach(expandBlock);
    }

    function applyAutoModeToBlock(header) {
        if (settings.autoMode === 'collapse') {
            collapseBlock(header);
        }
    }

    function setAutoMode(mode) {
        settings.autoMode = mode;
        saveSettings();
        updateButtonState();
        if (mode === 'collapse') {
            collapseAll();
        }
    }

    //================================================================================
    // TOOLTIP
    //================================================================================

    let holdTooltip = null;
    let tooltipOwner = null;

    function getHoldTooltip() {
        if (holdTooltip && document.body.contains(holdTooltip)) {
            return holdTooltip;
        }

        holdTooltip = document.createElement('div');
        holdTooltip.className = 'cbc-hold-tooltip';
        document.body.appendChild(holdTooltip);

        return holdTooltip;
    }

    function showTooltip(btn, message, isConfirmation = false, isDeactivation = false) {
        // If another button is showing a tooltip, hide it instantly to prevent overlap
        if (tooltipOwner && tooltipOwner !== btn) {
            hideTooltip(tooltipOwner);
        }

        const tooltip = getHoldTooltip();
        tooltip.textContent = message;
        tooltipOwner = btn;

        tooltip.classList.remove('confirmed', 'deactivated', 'pos-top', 'pos-bottom');

        if (isConfirmation) {
            tooltip.classList.add('confirmed');
        } else if (isDeactivation) {
            tooltip.classList.add('deactivated');
        }

        const btnRect = btn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;

        // Reset display to measure dimensions
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden';
        tooltip.classList.remove('visible');

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        const MARGIN = 8;
        const GAP = 12;

        // 1. Calculate Horizontal Position
        // Center the tooltip relative to the button
        let left = btnCenterX - (tooltipWidth / 2);

        // Clamp to viewport edges
        left = Math.max(MARGIN, Math.min(window.innerWidth - tooltipWidth - MARGIN, left));

        // 2. Calculate Vertical Position
        // Prefer ABOVE the button
        const topCandidate = btnRect.top - tooltipHeight - GAP;
        // Fallback BELOW the button
        const bottomCandidate = btnRect.bottom + GAP;

        let top;
        let placement;

        // If fits above, go above
        if (topCandidate >= MARGIN) {
            top = topCandidate;
            placement = 'pos-top';
        } else {
            // Otherwise go below
            top = bottomCandidate;
            placement = 'pos-bottom';
        }

        tooltip.classList.add(placement);

        // 3. Arrow Positioning
        // The arrow must point to the button center, even if tooltip is shifted by clamping
        const arrowX = btnCenterX - left;
        // Clamp arrow within tooltip bounds (minus radius/padding)
        const arrowClamped = Math.max(10, Math.min(tooltipWidth - 10, arrowX));
        tooltip.style.setProperty('--cbc-arrow-left', `${arrowClamped}px`);

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        tooltip.style.visibility = '';
        tooltip.offsetHeight; // Force reflow
        tooltip.classList.add('visible');
    }

    function hideTooltip(owner = null) {
        if (owner && tooltipOwner && owner !== tooltipOwner) return;

        if (holdTooltip) {
            holdTooltip.classList.remove('visible');
        }
        tooltipOwner = null;
    }

    //================================================================================
    // UI - Dual Toolbar Button
    //================================================================================

    let toolbarContainer = null;
    let holdTimer = null;
    let tooltipTimer = null;
    let confirmTimer = null;

    function clearHoldTimers() {
        if (tooltipTimer) { clearTimeout(tooltipTimer); tooltipTimer = null; }
        if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
        if (confirmTimer) { clearTimeout(confirmTimer); confirmTimer = null; }
    }

    function updateButtonState() {
        if (!toolbarContainer) return;

        if (settings.autoMode === 'collapse') {
            toolbarContainer.classList.add('auto-active');
        } else {
            toolbarContainer.classList.remove('auto-active');
        }
    }

    function createToolbarButton(toolbar = document.querySelector('ms-toolbar .toolbar-right')) {
        if (document.getElementById('cbc-toolbar-toggle')) return false;
        if (!toolbar) return false;

        toolbarContainer = document.createElement('div');
        toolbarContainer.id = 'cbc-toolbar-toggle';
        toolbarContainer.className = 'cbc-dual-btn';

        // Create collapse button (match AI Studio's working Material button styling)
        const collapseBtn = document.createElement('button');
        collapseBtn.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon ng-star-inserted cbc-collapse-btn';
        collapseBtn.setAttribute('ms-button', '');
        collapseBtn.setAttribute('variant', 'icon-borderless');
        collapseBtn.setAttribute('type', 'button');
        collapseBtn.setAttribute('aria-label', 'Collapse all code blocks (hold to toggle auto-collapse)');
        collapseBtn.setAttribute('aria-disabled', 'false');
        collapseBtn.dataset.cbcAlign = 'left';

        const collapseIcon = document.createElement('span');
        collapseIcon.className = 'material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted';
        collapseIcon.setAttribute('aria-hidden', 'true');
        // Use the SAME chevrons as v1.6 (these are known-good in AI Studio)
        collapseIcon.textContent = 'expand_less';
        collapseBtn.appendChild(collapseIcon);

        // Create expand button (match AI Studio's working Material button styling)
        const expandBtn = document.createElement('button');
        expandBtn.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon ng-star-inserted cbc-expand-btn';
        expandBtn.setAttribute('ms-button', '');
        expandBtn.setAttribute('variant', 'icon-borderless');
        expandBtn.setAttribute('type', 'button');
        expandBtn.setAttribute('aria-label', 'Expand all code blocks');
        expandBtn.setAttribute('aria-disabled', 'false');
        expandBtn.dataset.cbcAlign = 'right';

        const expandIcon = document.createElement('span');
        expandIcon.className = 'material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted';
        expandIcon.setAttribute('aria-hidden', 'true');
        // Use the SAME chevrons as v1.6 (known-good)
        expandIcon.textContent = 'expand_more';
        expandBtn.appendChild(expandIcon);

        toolbarContainer.appendChild(collapseBtn);
        toolbarContainer.appendChild(expandBtn);

        // Hold gesture state
        let holdCompleted = false;

        // Collapse button: click = collapse all, hold 1s = toggle auto-mode
        collapseBtn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();

            holdCompleted = false;
            const isCurrentlyActive = settings.autoMode === 'collapse';

            // Show hint after 500ms and start fill animation
            tooltipTimer = setTimeout(() => {
                const hint = isCurrentlyActive
                    ? 'Keep holding to disable auto-collapse...'
                    : 'Keep holding to enable auto-collapse...';
                showTooltip(collapseBtn, hint);

                collapseBtn.classList.remove('filling-up', 'filling-down');
                collapseBtn.classList.add(isCurrentlyActive ? 'filling-down' : 'filling-up');
            }, 500);

            // Toggle after 1000ms total hold
            holdTimer = setTimeout(() => {
                holdCompleted = true;
                clearHoldTimers();

                const newMode = isCurrentlyActive ? 'off' : 'collapse';
                const confirmMsg = newMode === 'collapse'
                    ? '✓ Auto-collapse ON'
                    : '✓ Auto-collapse OFF';

                setAutoMode(newMode);
                showTooltip(collapseBtn, confirmMsg, newMode === 'collapse', newMode === 'off');

                confirmTimer = setTimeout(() => hideTooltip(collapseBtn), 1200);
            }, 1000);
        });

        collapseBtn.addEventListener('mouseup', (e) => {
            if (e.button !== 0) return;

            clearHoldTimers();
            hideTooltip();
            collapseBtn.classList.remove('filling-up', 'filling-down');

            // Only collapse if hold didn't complete
            if (!holdCompleted) {
                collapseAll();
            }
            holdCompleted = false;
        });

        collapseBtn.addEventListener('mouseleave', () => {
            clearHoldTimers();
            hideTooltip(collapseBtn);
            collapseBtn.classList.remove('filling-up', 'filling-down');
            holdCompleted = false;
        });

        collapseBtn.addEventListener('mouseenter', () => {
            if (holdTimer) return;

            const msg = settings.autoMode === 'collapse'
                ? 'Collapse all code blocks\nHold to disable auto-collapse'
                : 'Collapse all code blocks\nHold to enable auto-collapse';

            showTooltip(collapseBtn, msg);
        });

        collapseBtn.addEventListener('contextmenu', (e) => e.preventDefault());

        // Expand button: simple click
        expandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            expandAll();
        });

        expandBtn.addEventListener('mouseenter', () => {
            showTooltip(expandBtn, 'Expand all code blocks');
        });

        expandBtn.addEventListener('mouseleave', () => {
            hideTooltip(expandBtn);
        });

        expandBtn.addEventListener('contextmenu', (e) => e.preventDefault());

        // Insert into toolbar (before the overflow-menu-wrapper which contains more_vert)
        const overflowWrapper = toolbar.querySelector('.overflow-menu-wrapper');
        toolbar.insertBefore(toolbarContainer, overflowWrapper || null);

        updateButtonState();
        return true;
    }

    //================================================================================
    // DEBUG LOGGING
    //================================================================================
    const DEBUG = false;
    function log(msg, data = null) {
        if (!DEBUG) return;
        const prefix = '[Code Block Toggle]';
        if (data) {
            console.log(`${prefix} ${msg}`, data);
        } else {
            console.log(`${prefix} ${msg}`);
        }
    }

    //================================================================================
    // OBSERVER - Processes NEW blocks for lazy loading + auto-mode
    //================================================================================
    function handleNewBlocks(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;

                // Check if node itself is a code block
                if (node.matches?.('ms-code-block')) {
                    const header = node.querySelector('mat-expansion-panel-header');
                    if (header) applyAutoModeToBlock(header);
                }

                // Check descendants for code blocks
                if (node.querySelectorAll) {
                    node.querySelectorAll('ms-code-block mat-expansion-panel-header')
                        .forEach(applyAutoModeToBlock);
                }
            }
        }
    }

    const blockObserver = new MutationObserver(handleNewBlocks);

    //================================================================================
    // TOOLBAR OBSERVER - Persists button across SPA navigation
    //================================================================================
    const toolbarObserver = new MutationObserver(() => {
        if (document.getElementById('cbc-toolbar-toggle')) return;

        const toolbar = document.querySelector('ms-toolbar .toolbar-right');
        if (!toolbar) return;

        if (createToolbarButton(toolbar)) {
            updateButtonState();
            if (settings.autoMode === 'collapse') {
                setTimeout(collapseAll, 300);
            }
        }
    });

    //================================================================================
    // INIT
    //================================================================================
    function init() {
        log('Initializing...');
        loadSettings();
        log(`Loaded settings: autoMode=${settings.autoMode}`);

        const initialToolbar = document.querySelector('ms-toolbar .toolbar-right');
        log(`Initial toolbar exists: ${!!initialToolbar}`);

        if (createToolbarButton()) {
            log('Initial button creation successful');
            if (settings.autoMode === 'collapse') {
                setTimeout(collapseAll, 300);
            }
        } else {
            log('Initial button creation failed - will wait for observer');
        }

        // Keep observing for toolbar changes (never disconnect - SPA support)
        toolbarObserver.observe(document.body, { childList: true, subtree: true });
        log('Toolbar observer started');

        // Start observing for lazy-loaded code blocks
        blockObserver.observe(document.body, { childList: true, subtree: true });
        log('Block observer started');
    }

    // Log navigation events (for debugging SPA behavior)
    const origPush = history.pushState;
    history.pushState = function() {
        log('>>> history.pushState triggered', { url: arguments[2] });
        const r = origPush.apply(this, arguments);

        setTimeout(() => {
            log('Post-pushState check:');
            log(`  Button in DOM: ${!!document.getElementById('cbc-toolbar-toggle')}`);
            log(`  Toolbar exists: ${!!document.querySelector('ms-toolbar .toolbar-right')}`);
        }, 500);

        return r;
    };

    const origReplace = history.replaceState;
    history.replaceState = function() {
        log('>>> history.replaceState triggered', { url: arguments[2] });
        return origReplace.apply(this, arguments);
    };

    window.addEventListener('popstate', () => {
        log('>>> popstate event triggered');
    });

    init();

})();
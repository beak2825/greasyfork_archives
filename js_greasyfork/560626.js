// ==UserScript==
// @name         Arena.ai | Collapsible Code Blocks
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      4.9
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Adds collapsible code blocks with clickable headers, footer controls, and a global toolbar toggle
// @match        *://*arena.ai/*
// @icon         https://arena.ai/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560626/Arenaai%20%7C%20Collapsible%20Code%20Blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/560626/Arenaai%20%7C%20Collapsible%20Code%20Blocks.meta.js
// ==/UserScript==

/*
    What this script does
    ---------------------
    - Makes the code block header clickable to toggle (collapse/expand).
    - Adds an in-flow footer "Collapse" bar per code block (never covers code).
    - Uses a single global fixed footer above the input when the in-flow footer would be obscured.
      (The in-flow footer hides via visibility to prevent layout/scroll jitter.)
    - Adds a dual toolbar button next to the input controls:
      * Collapse all
      * Expand all
      * Hold collapse to toggle persistent auto-collapse

    Detection/updates model
    -----------------------
    - Initial scan: finds all current code blocks once on load.
    - Incremental scan: MutationObserver looks only at added DOM nodes and initializes new code blocks.
    - Safety net: periodic resync detects missed blocks and runs a full scan.
    - Fixed footer updates on scroll/resize (throttled via requestAnimationFrame).
*/

// ═══════════════════════════════════════════════════════════════════════
// CHANGELOG
// ═══════════════════════════════════════════════════════════════════════
//
// v1.3
// - Switched to incremental MutationObserver (only processes added nodes)
// - Added 5-second fallback resync to catch edge cases
// - Performance: avoids repeated full DOM rescans during streaming
//
// v1.4
// - Batched global collapse/expand across frames to avoid long UI stalls
//
// v1.5
// - Commenting pass / documentation improvements (no functional changes)
// - Corrected init log version string
//
// v1.8
// - Fixed UI flicker/stutter when toggling all code blocks
// - Removed requestAnimationFrame batching from collapseAll/expandAll
//   (spreading DOM changes across frames caused multiple layout recalcs,
//   each shifting content by 1-2px before settling; synchronous is smoother
//   since display:none doesn't trigger expensive reflows)
// - Removed auto-expand feature (collapse-only is cleaner UX)
// - Simplified context menu
//
// v1.9
// - Cleanup: removed unused batch state variables left over from pre-v1.8 batching
// - Cleanup: removed stale "auto-collapse/auto-expand" wording
//
// v2.0
// - Cleanup: removed unused animation config (no longer used after switching to display:none collapse)
// - Cleanup: removed unused destructured `animation` variable in injectStyles()
// - Optional cleanup: removed unused debug helpers (getState/getAutoMode) and ContextMenu.isOpen
//
// v2.1
// - Fixed: code blocks now preserve their original width when collapsed
// - Changed: global toggle button moved to bottom-right (left of submit button)
//
// v2.2
// - Added: scroll anchoring to preserve visual position when collapsing
//   (prevents jarring scroll jumps when collapsing large code blocks)
//
// v2.3
// - Fixed: scroll anchoring when viewing middle of a large code block
//   (now detects "inside block" state and scrolls to show header after collapse)
//
// v2.4
// - Redesigned: global toggle is now a dual button (collapse/expand side by side)
// - Added: hold collapse button for 1s to toggle persistent auto-collapse mode
// - Added: tooltip hint appears at 0.5s explaining hold-to-activate feature
// - Removed: right-click context menu (replaced by hold gesture)
//
// v2.5
// - Changed: expand button icon to unfold style (avoids dropdown menu confusion)
// - Added: fill animation on collapse button during hold gesture
// - Changed: tooltips now appear above buttons (not below/as title attributes)
// - Added: hover tooltips for both buttons explaining their function
//
// v2.6
// - Fixed: tooltips now properly appear on hover
// - Changed: collapse button icon to fold style (two chevrons pointing inward)
//
// v2.7
// - Fixed: hover tooltips were hidden by inline visibility/opacity styles (now cleared after measurement)
//
// v2.8
// - Tooltips now explicitly mention "code blocks" and toolbar buttons include aria-labels
//
// v2.9
// - Replaced floating collapse button with sticky footer bar
// - Footer bar is part of code block structure (like the header)
// - Footer sticks to viewport bottom while scrolling through tall blocks
// - Footer sits at natural position when code block bottom is visible (never covers code)
// - Removed all floating button positioning logic (simpler, more performant)
//
// v3.0
// - Fixed: footer now properly follows viewport when scrolling through tall code blocks
// - CSS sticky alone doesn't work for "show at viewport bottom when natural position is below"
// - Re-added JavaScript positioning: fixed position when block bottom is below viewport,
//   natural position when block bottom is visible (never covers code)
// - Re-added scroll/resize handlers with rAF throttling for footer positioning
//
// v3.1
// - Styled footer bar to match header (uses site's CSS variables for colors/borders)
// - Fixed: footer now positions above input area (not at viewport bottom)
// - Fixed: footer keeps rounded corners when in fixed mode
// - Removed hardcoded footer colors from CONFIG (now uses site theme)
//
// v3.2
// - Fixed: flickering during transition between natural and fixed footer positions
// - Added hysteresis: switch to fixed only when natural is FULLY hidden behind input
// - Added hysteresis: switch to natural only when natural would be FULLY visible
// - Natural footer now allowed to scroll partially behind input area (no early switch)
//
// v3.3
// - Changed transition logic: switch to fixed as soon as natural footer TOUCHES input area
// - Natural footer is never partially covered (cleaner visual)
// - Switch back to natural only when full room available (hysteresis prevents flicker)
//
// v3.4
// - Fixed: robust footer swap (in-flow footer hides, separate fixed footer shows) to eliminate flicker/partial overlap
// - Fixed footer never covers the block header: hides as soon as it would touch the header
// - In-flow footer is hidden via visibility (keeps layout stable; prevents scroll/height jitter)
//
// v3.5
// - Fixed: during smooth auto-scroll, fixed footer now disappears immediately on header collision
// - Prevents "jumping" the fixed footer to a different code block when the bottom-most one collides
// - More robust height math: uses in-flow footer height as fallback when fixed footer is hidden
//
// v3.6
// - Cleanup/docs: removed leftover floating-button wording and unused bits
//
// v3.7
// - Script name changed from "LMArena | Code Block Collapse" to "LMArena | Collapsible Code Blocks"
//
// v3.8
// - Fixed: conflict with other userscripts (Multi-Provider Chat Export, etc.)
// - Added 1000ms initialization delay to avoid React Hydration Error #418
//
// v3.9
// - Replaced hardcoded delay with dynamic Stabilization Observer
// - Detects React hydration completion by watching for the chat input bar
// - Uses requestIdleCallback for optimal performance/compatibility
//
// v4.0
// - Fixed: fixed footer now repositions when textarea grows during user input
// - Added ResizeObserver on input area to detect height changes
// - Footer no longer conflicts with/covers the textarea when it expands
//
// v4.1
// - Cleanup: removed overridden CSS declaration (border-radius: 0 0 0 0)
// - Cleanup: removed unused 'warn' log style
// - Cleanup: removed redundant typeof guard for activeFixedState
// - Cleanup: consolidated duplicate mouseleave handlers on collapse button
//
// v4.2
// - Changed: replaced localStorage with GM_setValue/GM_getValue for settings persistence
// - Settings now stored via userscript manager (more reliable, syncs across browsers if supported)
//
// v4.3
// - Changed: single-block expand no longer uses scroll anchoring
// - Expanding a block now keeps the header in place; code appears below (no viewport shift)
// - Lets user read expanded code from the beginning instead of being scrolled to the bottom
//
// v4.4
// - Fixed: single-block expand now actively scrolls header to top of viewport
// - Ensures user always sees expanded code from the beginning (overrides browser scroll anchoring)
//
// v4.5
// - Refined: single-block expand only scrolls if header is in bottom 1/3 of viewport or off-screen
// - If header is already visible in upper 2/3, no scroll adjustment occurs
//
// v4.6
// - Fixed: single-block collapse no longer "snaps" the header down to the old footer position in some scroll states
// - Changed: when collapsing a block while its header is visible, the header is used as the scroll anchor (keeps it stable)
// - Fixed: auto-collapse on newly added blocks no longer triggers single-block scroll behavior
//
// v4.6
// - Fixed: single-block expand now first stabilizes the header position (cancels browser/scroll-area anchoring)
// - Refined: only scrolls header to top if it ends up off-screen or in the bottom ~15% of the viewport
//
// v4.7
// - Cleanup: removed unused `data` parameter from internal log function
// - Cleanup: removed unused boolean return values from createToolbarButton()
// - Cleanup: consolidated duplicate CSS rules and keyframe definitions
//
// v4.8
// - Removed: width preservation on collapse (caused horizontal scrolling on narrow viewports)
// - Collapsed blocks now use natural width instead of forced minWidth
//
// v4.9
// - Renamed from LMArena to Arena.ai

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // DEBUG
    // ═══════════════════════════════════════════════════════════════════════
    // Toggle this to silence console output from this script.
    const DEBUG = true;

    // Simple structured logger (colored prefix + levels). When DEBUG=false, it’s a no-op.
    const log = (msg, type = 'info') => {
        if (!DEBUG) return;

        const prefix = '[CBC]';
        const styles = {
            info: 'color: #8ab4f8',
            success: 'color: #34a853',
            error: 'color: #ea4335'
        };

        console.log(`%c${prefix} ${msg}`, styles[type]);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════
    // Notes:
    // - `resyncInterval` is a safety net for missed mutations (rare edge cases).
    const CONFIG = {
        header: {
            hoverBg: 'rgba(255,255,255,0.04)',
            activeBg: 'rgba(255,255,255,0.08)',
            collapsedHoverBg: 'rgba(255,255,255,0.06)',
            collapsedActiveBg: 'rgba(255,255,255,0.10)'
        },
        storageKey: 'arena_codeblock_collapse_settings',
        resyncInterval: 5000 // Fallback resync every 5 seconds
    };

    // ═══════════════════════════════════════════════════════════════════════
    // STATE & STORAGE
    // ═══════════════════════════════════════════════════════════════════════

    // Tracks each initialized code block element -> per-block state object.
    // This is what prevents us from re-initializing blocks on every mutation.
    const blockState = new Map();

    // Persisted user preference: should new blocks auto-collapse?
    const DEFAULT_SETTINGS = {
        autoMode: 'off' // 'off' or 'collapse'
    };

    let settings = { ...DEFAULT_SETTINGS };

    // ResizeObserver for textarea height changes (typing causes growth)
    let inputResizeObserver = null;
    let resizeRafId = null;

    // Load settings from userscript manager storage.
    function loadSettings() {
        try {
            const saved = GM_getValue(CONFIG.storageKey, {});
            settings = { ...DEFAULT_SETTINGS, ...saved };
            log(`Settings loaded: autoMode=${settings.autoMode}`, 'success');
        } catch (e) {
            log('Failed to load settings: ' + e.message, 'error');
        }
    }

    // Save settings to userscript manager storage.
    function saveSettings() {
        try {
            GM_setValue(CONFIG.storageKey, settings);
            log(`Settings saved: autoMode=${settings.autoMode}`, 'success');
        } catch (e) {
            log('Failed to save settings: ' + e.message, 'error');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════════════

    // Inject our stylesheet once. We key off #cbc-styles to avoid duplicates
    // across SPA navigation/rerenders.
    function injectStyles() {
        if (document.getElementById('cbc-styles')) return;

        const { header } = CONFIG;

        const style = document.createElement('style');
        style.id = 'cbc-styles';
        style.textContent = `
            /* Code container - instant toggle, no animation */
            .cbc-container {
                overflow: hidden;
            }
            .cbc-container.cbc-collapsed {
                display: none !important;
            }

            /* Clickable header - always interactive */
            .cbc-header-interactive {
                transition: background-color 0.15s ease, border-radius 0.15s ease;
                position: relative;
                cursor: pointer;
                contain: layout style;
            }
            .cbc-header-interactive:hover {
                background-color: ${header.hoverBg};
            }
            .cbc-header-interactive:active {
                background-color: ${header.activeBg};
            }

            /* Collapsed state styling */
            .cbc-header-interactive.cbc-header-collapsed {
                border-bottom-color: transparent !important;
                border-radius: 6px !important;
            }
            .cbc-header-interactive.cbc-header-collapsed:hover {
                background-color: ${header.collapsedHoverBg};
            }
            .cbc-header-interactive.cbc-header-collapsed:active {
                background-color: ${header.collapsedActiveBg};
            }

            /* State hint indicator (appears on header hover) - centered */
            .cbc-state-hint {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                font-size: 11px;
                color: rgba(255,255,255,0.3);
                font-family: system-ui, -apple-system, sans-serif;
                background: rgba(30,30,30,0.95);
                border-radius: 4px;
                opacity: 0;
                pointer-events: none;
                z-index: 10;
                white-space: nowrap;
            }
            .cbc-header-interactive:hover .cbc-state-hint {
                opacity: 1;
                color: rgba(255,255,255,0.7);
            }
            .cbc-state-hint svg {
                opacity: 0.7;
            }

            /* Hint text changes based on state */
            .cbc-state-hint .hint-expand { display: none; }
            .cbc-state-hint .hint-collapse { display: flex; align-items: center; gap: 6px; }
            .cbc-header-collapsed .cbc-state-hint .hint-expand { display: flex; align-items: center; gap: 6px; }
            .cbc-header-collapsed .cbc-state-hint .hint-collapse { display: none; }

            /* Footer bar for collapse action - matches header style */
            .cbc-footer {
                position: relative;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 8px 16px;
                border-top: 1px solid var(--border, rgba(255,255,255,0.1));
                border-radius: 0 0 6px 6px;
                cursor: pointer;
                transition: background-color 0.15s ease;
                user-select: none;
                font-size: 13px;
                font-weight: 500;
                color: var(--text-secondary, rgba(255,255,255,0.5));
            }
            .cbc-footer:hover {
                background-color: ${header.hoverBg};
                color: var(--text-primary, rgba(255,255,255,0.9));
            }
            .cbc-footer:active {
                background-color: ${header.activeBg};
            }
            .cbc-footer svg {
                opacity: 0.7;
                transition: opacity 0.15s ease;
            }
            .cbc-footer:hover svg {
                opacity: 1;
            }
            .cbc-footer-hidden {
                display: none !important;
            }

            /* Hidden because a separate global fixed footer is active (keeps layout stable) */
            .cbc-footer-hidden-by-fixed {
                visibility: hidden !important;
                pointer-events: none !important;
            }

            /* Footer in fixed mode (global, appended to <body>) */
            .cbc-footer.cbc-footer-fixed {
                position: fixed;
                border-radius: 0 0 6px 6px;
                box-shadow: 0 -2px 8px rgba(0,0,0,0.25);
                background-color: var(--surface-primary, #1a1a1a);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            }

            /* Dual toolbar button container */
            .cbc-dual-btn {
                display: inline-flex;
                align-items: stretch;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.15);
                background: rgba(255,255,255,0.03);
                height: 32px;
            }
            .cbc-dual-btn button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 100%;
                border: none;
                background: transparent;
                color: rgba(255,255,255,0.6);
                cursor: pointer;
                transition: background 0.15s ease, color 0.15s ease;
                padding: 0;
                margin: 0;
                outline: none;
            }
            .cbc-dual-btn button:hover {
                background: rgba(255,255,255,0.08);
                color: rgba(255,255,255,0.9);
            }
            .cbc-dual-btn button:active {
                background: rgba(255,255,255,0.12);
            }
            .cbc-dual-btn .cbc-collapse-btn {
                border-right: 1px solid rgba(255,255,255,0.1);
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
                background: rgba(249, 115, 22, 0.35);
                animation: cbcFill 500ms linear forwards;
            }
            .cbc-collapse-btn.filling-down::before {
                top: 0;
                background: rgba(120, 120, 120, 0.35);
                animation: cbcFill 500ms linear forwards;
            }
            .cbc-collapse-btn svg {
                position: relative;
                z-index: 1;
            }
            @keyframes cbcFill {
                from { height: 0%; }
                to { height: 100%; }
            }

            /* Auto-collapse active state */
            .cbc-dual-btn.auto-active {
                border-color: rgba(249, 115, 22, 0.4);
            }
            .cbc-dual-btn.auto-active .cbc-collapse-btn {
                background: rgba(249, 115, 22, 0.15);
                color: #f97316;
            }
            .cbc-dual-btn.auto-active .cbc-collapse-btn:hover {
                background: rgba(249, 115, 22, 0.25);
                color: #fb923c;
            }
            .cbc-dual-btn.auto-active .cbc-collapse-btn:active {
                background: rgba(249, 115, 22, 0.35);
            }

            /* Custom tooltip (positioned above buttons) */
            .cbc-hold-tooltip {
                position: fixed;
                background: #1a1a1a;
                border: 1px solid #3a3a3a;
                border-radius: 6px;
                padding: 6px 10px;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 11px;
                color: #e0e0e0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                z-index: 10001;
                pointer-events: none;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.15s ease, visibility 0.15s ease;
                white-space: nowrap;
            }
            .cbc-hold-tooltip.visible {
                opacity: 1;
                visibility: visible;
            }
            /* Arrow pointing down (tooltip is above button) */
            .cbc-hold-tooltip::before {
                content: '';
                position: absolute;
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid #3a3a3a;
            }
            .cbc-hold-tooltip::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid #1a1a1a;
            }
            .cbc-hold-tooltip.confirmed {
                background: rgba(249, 115, 22, 0.9);
                border-color: #f97316;
                color: #fff;
                font-weight: 500;
            }
            .cbc-hold-tooltip.confirmed::before {
                border-top-color: #f97316;
            }
            .cbc-hold-tooltip.confirmed::after {
                border-top-color: rgba(249, 115, 22, 0.9);
            }
            .cbc-hold-tooltip.deactivated {
                background: rgba(100, 100, 100, 0.95);
                border-color: #666;
                color: #fff;
                font-weight: 500;
            }
            .cbc-hold-tooltip.deactivated::before {
                border-top-color: #666;
            }
            .cbc-hold-tooltip.deactivated::after {
                border-top-color: rgba(100, 100, 100, 0.95);
            }
        `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SCROLL ANCHORING
    // ═══════════════════════════════════════════════════════════════════════
    // When collapsing code blocks, content below shifts up. Without anchoring,
    // this causes jarring scroll jumps. We fix this by:
    // 1. Finding a visible "anchor" element before collapse
    // 2. Recording its viewport position
    // 3. After collapse, adjusting scroll to restore anchor's visual position

    // Get the scrollable container (Radix scroll area viewport).
    function getScrollContainer() {
        return document.querySelector('[data-radix-scroll-area-viewport]');
    }

    // Find the best anchor element currently visible in the viewport.
    // Returns { element, offsetTop } or null.
    // Prefers code block headers since they stay visible when collapsed.
    function findScrollAnchor() {
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) return null;

        const containerRect = scrollContainer.getBoundingClientRect();
        const viewportTop = containerRect.top;
        const viewportBottom = containerRect.bottom;
        const viewportCenter = viewportTop + containerRect.height / 2;

        // Priority: code block headers (stay visible), then message prose
        const candidates = [
            ...document.querySelectorAll('.cbc-header-interactive'),
            ...document.querySelectorAll('.prose > p'),
        ];

        let bestAnchor = null;
        let bestDistance = Infinity;

        for (const el of candidates) {
            const rect = el.getBoundingClientRect();
            // Must be at least partially visible in the scroll container
            if (rect.bottom < viewportTop || rect.top > viewportBottom) continue;

            // Prefer elements closer to center of viewport (more stable feel)
            const elCenter = rect.top + rect.height / 2;
            const distance = Math.abs(elCenter - viewportCenter);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestAnchor = el;
            }
        }

        if (!bestAnchor) return null;

        return {
            element: bestAnchor,
            offsetTop: bestAnchor.getBoundingClientRect().top
        };
    }

    // Restore scroll position to keep anchor element at its original viewport position.
    function restoreScrollAnchor(anchor) {
        if (!anchor || !anchor.element) return;

        const scrollContainer = getScrollContainer();
        if (!scrollContainer) return;

        // Element may have been removed from DOM (edge case)
        if (!document.body.contains(anchor.element)) return;

        const newRect = anchor.element.getBoundingClientRect();
        const delta = newRect.top - anchor.offsetTop;

        // Only adjust if there's meaningful shift (avoid sub-pixel noise)
        if (Math.abs(delta) > 1) {
            scrollContainer.scrollTop += delta;
        }
    }

    // Check if user is currently viewing "inside" a code block's content.
    // True when: header is above/at viewport top, but code content is visible.
    // This happens when scrolled partway through a tall code block.
    function isViewingBlockContent(state) {
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) return false;

        const header = state.header;
        const container = state.container;

        const scrollRect = scrollContainer.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Header is above or at the very top of the scroll viewport (with small buffer)
        const headerAboveViewport = headerRect.bottom <= scrollRect.top + 5;

        // But the code container extends into the visible viewport
        const contentVisible = containerRect.top < scrollRect.bottom &&
                               containerRect.bottom > scrollRect.top;

        return headerAboveViewport && contentVisible;
    }

    // Get the visible bounds of the scroll container (safe zone for fixed elements).
    // Also accounts for the input area at the bottom.
    function getScrollBounds() {
        const scrollContainer = getScrollContainer();
        let top = 0;
        let bottom = window.innerHeight;

        if (scrollContainer) {
            const rect = scrollContainer.getBoundingClientRect();
            top = rect.top;
            bottom = rect.bottom;
        }

        // Account for input area at bottom
        const inputArea = document.querySelector('.relative.flex.flex-col.items-center.pb-6') ||
                          document.querySelector('form')?.closest('div[class*="pb-"]');
        if (inputArea) {
            const inputRect = inputArea.getBoundingClientRect();
            bottom = Math.min(bottom, inputRect.top);
        }

        return { top, bottom };
    }

    // Scroll so the block's header is positioned at the top of the viewport.
    // Used after collapsing a block we were "inside" of.
    function scrollHeaderToTop(state) {
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) return;

        const header = state.header;
        const scrollRect = scrollContainer.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();

        // Calculate offset from header's current position to top of scroll container
        // Add a small margin (8px) so header isn't flush against the top
        const offset = headerRect.top - scrollRect.top - 8;

        if (Math.abs(offset) > 1) {
            scrollContainer.scrollTop += offset;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // COLLAPSE/EXPAND LOGIC
    // ═══════════════════════════════════════════════════════════════════════

    // Collapse a single code block (instant, no animation).
    // If anchor is provided, scroll anchoring is handled externally (bulk operations).
    // If anchor is null and not explicitly skipped, we find and restore our own anchor.
    function collapseBlock(state, externalAnchor = undefined) {
        log(`Collapsing block`, 'info');
        const { block, container, header, footer } = state;

        // For single-block collapse, determine scroll strategy BEFORE modifying DOM
        // Goals:
        // - If the header is visible: keep THAT header visually stable (use it as the anchor).
        //   This prevents rare "snap down to footer position" behavior caused by browser/scroll-area anchoring.
        // - If the header is NOT visible (often when collapsing from the footer): scroll to show the header.
        let scrollStrategy = null; // 'anchor' | 'scrollToHeader' | null
        let anchor = null;

        if (externalAnchor === undefined) {
            const scrollContainer = getScrollContainer();
            const inside = isViewingBlockContent(state);

            // If we can't detect the scroll container, default to "header is visible"
            // so we don't try to scroll-to-header using a container we can't control.
            let headerVisible = true;

            if (scrollContainer) {
                const scrollRect = scrollContainer.getBoundingClientRect();
                const headerRect = header.getBoundingClientRect();
                headerVisible = headerRect.bottom > scrollRect.top && headerRect.top < scrollRect.bottom;
            }

            // If user is inside the block OR the header isn't visible, collapsing should bring them to the header.
            if (inside || !headerVisible) {
                scrollStrategy = 'scrollToHeader';
                if (inside) {
                    log('Collapse: inside block, will scroll to header', 'info');
                }
            } else {
                // Anchor to THIS header (not an unrelated element near viewport center)
                anchor = { element: header, offsetTop: header.getBoundingClientRect().top };
                scrollStrategy = 'anchor';
            }
        } else {
            anchor = externalAnchor;
        }

        container.classList.add('cbc-collapsed');
        header.classList.add('cbc-header-collapsed');
        footer.classList.add('cbc-footer-hidden');
        footer.classList.remove('cbc-footer-hidden-by-fixed');

        // If this block currently owns the global fixed footer, hide it now.
        if (activeFixedState === state) {
            hideGlobalFixedFooter();
        }

        state.collapsed = true;

        // Handle scroll adjustment for single-block operations
        if (externalAnchor === undefined) {
            if (scrollStrategy === 'scrollToHeader') {
                scrollHeaderToTop(state);
            } else if (scrollStrategy === 'anchor' && anchor) {
                restoreScrollAnchor(anchor);
            }
        }
    }

    // Expand a single code block (instant, no animation).
    // For single-block expand:
    // 1) Stabilize the header position (cancels browser/scroll-area scroll anchoring)
    // 2) Only if the header ends up too low/off-screen, scroll it to the top for readability
    //
    // For bulk expand (externalAnchor !== undefined): caller handles scroll anchoring.
    function expandBlock(state, externalAnchor = undefined) {
        log(`Expanding block`, 'info');
        const { block, container, header, footer } = state;

        // For single-block expand: record header position BEFORE DOM changes
        const scrollContainer = externalAnchor === undefined ? getScrollContainer() : null;
        const preHeaderTop = scrollContainer ? header.getBoundingClientRect().top : null;

        container.classList.remove('cbc-collapsed');
        header.classList.remove('cbc-header-collapsed');
        footer.classList.remove('cbc-footer-hidden');

        state.collapsed = false;

        // Single-block: stabilize header position, then (optionally) move it to top only if it's too low
        if (externalAnchor === undefined && scrollContainer && preHeaderTop !== null) {
            requestAnimationFrame(() => {
                // Step 1: cancel scroll anchoring effects by restoring header's pre-expand viewport position
                const postHeaderTop = header.getBoundingClientRect().top;
                const delta = postHeaderTop - preHeaderTop;

                // Only adjust if there's meaningful shift (avoid sub-pixel noise)
                if (Math.abs(delta) > 1) {
                    scrollContainer.scrollTop += delta;
                }

                // Step 2: if header is still off-screen or very low, bring it to top
                const scrollRect = scrollContainer.getBoundingClientRect();
                const headerRect = header.getBoundingClientRect();

                // "Off-screen" here means fully outside the scroll viewport (not merely clipped by 1px)
                const headerFullyOffScreen =
                    headerRect.bottom <= scrollRect.top ||
                    headerRect.top >= scrollRect.bottom;

                // Only treat the bottom ~15% as "too low" (prevents unnecessary snapping from the middle)
                const bottomZoneStart = scrollRect.top + (scrollRect.height * 0.85);

                if (headerFullyOffScreen || headerRect.top > bottomZoneStart) {
                    scrollHeaderToTop(state);
                }

                updateFixedFooter();
            });
            return;
        }

        // Bulk expand: just update footer
        requestAnimationFrame(() => {
            updateFixedFooter();
        });
    }

    // Simple toggle helper for header click handling.
    function toggleBlock(state) {
        if (state.collapsed) {
            expandBlock(state);
        } else {
            collapseBlock(state);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════
    // Exposed on window for debugging/automation:
    //   window.CodeBlockCollapse.collapseAll()
    //   window.CodeBlockCollapse.expandAll()
    //   window.CodeBlockCollapse.toggleAll()
    //   window.CodeBlockCollapse.setAutoMode('collapse'|'off')
    const CodeBlockCollapse = {
        // Collapse all expanded blocks in a single synchronous pass.
        //
        // Why NOT batched across frames (requestAnimationFrame)?
        // -------------------------------------------------------
        // Previously we chunked DOM updates across multiple frames to avoid
        // "long task" warnings. However, this caused visible UI flicker:
        // each frame triggered a separate layout recalculation, shifting
        // content by 1-2 pixels before settling.
        //
        // Synchronous single-pass works better here because:
        // 1. We use display:none which is cheap (no reflow of hidden content)
        // 2. Browser batches all changes into one layout pass automatically
        // 3. No intermediate states = no flicker
        //
        // Scroll Anchoring:
        // We find a single anchor BEFORE collapsing, then restore AFTER all
        // collapses complete. This prevents jarring scroll jumps.
        //
        // Special case: if we're "inside" one of the blocks being collapsed
        // (header above viewport, content visible), we scroll to show that
        // block's header after all collapses complete.
        collapseAll() {
            const blocks = Array.from(blockState.values()).filter(s => !s.collapsed);
            if (blocks.length === 0) return;

            // BEFORE any DOM changes: determine scroll strategy
            // Priority: if inside a block being collapsed, scroll to its header
            const insideBlock = blocks.find(s => isViewingBlockContent(s));
            const anchor = insideBlock ? null : findScrollAnchor();

            if (insideBlock) {
                log('CollapseAll: detected inside block, will scroll to header', 'info');
            }

            log(`Collapsing ${blocks.length} blocks`, 'info');
            // Pass null to skip per-block anchoring; we handle it once at the end
            blocks.forEach(state => collapseBlock(state, null));

            // AFTER all collapses: adjust scroll position
            if (insideBlock) {
                scrollHeaderToTop(insideBlock);
            } else if (anchor) {
                restoreScrollAnchor(anchor);
            }

            log(`Collapsed ${blocks.length} blocks`, 'success');
        },

        // Expand all collapsed blocks in a single synchronous pass.
        // See collapseAll() for rationale on why we don't batch across frames.
        // Same scroll anchoring strategy as collapseAll().
        expandAll() {
            const blocks = Array.from(blockState.values()).filter(s => s.collapsed);
            if (blocks.length === 0) return;

            // Find anchor before any DOM changes
            const anchor = findScrollAnchor();

            log(`Expanding ${blocks.length} blocks`, 'info');
            // Pass null to skip per-block anchoring; we handle it once at the end
            blocks.forEach(state => expandBlock(state, null));

            // Restore scroll position once after all expands
            restoreScrollAnchor(anchor);

            log(`Expanded ${blocks.length} blocks`, 'success');
        },

        // Toggle all code blocks:
        // - If any are expanded → collapse all
        // - If all are collapsed → expand all
        toggleAll() {
            const anyExpanded = Array.from(blockState.values()).some(s => !s.collapsed);
            if (anyExpanded) {
                this.collapseAll();
            } else {
                this.expandAll();
            }
        },

        // Persisted auto-collapse mode:
        // - 'collapse': auto-collapse existing + new code blocks
        // - 'off': do nothing automatically
        setAutoMode(mode) {
            log(`Setting auto mode: ${mode}`, 'info');
            settings.autoMode = mode;
            saveSettings();
            this.applyAutoMode();
            updateToolbarButton();
        },

        // Apply the current auto-mode to all currently tracked blocks.
        applyAutoMode() {
            if (settings.autoMode === 'collapse') {
                this.collapseAll();
            }
        },

        // Apply auto-mode to a single newly added block at setup time.
        applyAutoModeToBlock(state) {
            if (settings.autoMode === 'collapse' && !state.collapsed) {
                // Avoid any single-block scroll behavior during auto-collapse of newly added blocks
                collapseBlock(state, null);
            }
        }
    };

    // Expose globally (useful for debugging/automation).
    window.CodeBlockCollapse = CodeBlockCollapse;

    // ═══════════════════════════════════════════════════════════════════════
    // FOOTER POSITIONING
    // ═══════════════════════════════════════════════════════════════════════
    // The footer bar needs special handling:
    // - When code block's bottom is visible in viewport → footer at natural position (end of block)
    // - When code block's bottom is BELOW viewport → footer fixed at viewport bottom
    // This ensures the collapse button is always accessible while never covering code.

    // Global fixed footer (single element) that is shown for the "active" code block.
    // This avoids flicker/partial overlap because:
    // - the in-flow footer can be hidden (visibility) without changing layout
    // - the fixed footer is a separate DOM node (not fighting with in-flow geometry)
    let globalFixedFooter = null;
    let activeFixedState = null;

    function getGlobalFixedFooter() {
        if (globalFixedFooter && document.body.contains(globalFixedFooter)) {
            return globalFixedFooter;
        }

        const el = document.createElement('div');
        el.className = 'cbc-footer cbc-footer-fixed cbc-footer-hidden';
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');

        el.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <span>Collapse</span>
        `;

        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (activeFixedState && !activeFixedState.collapsed) {
                collapseBlock(activeFixedState);
            }
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (activeFixedState && !activeFixedState.collapsed) {
                    collapseBlock(activeFixedState);
                }
            }
        });

        document.body.appendChild(el);
        globalFixedFooter = el;
        return el;
    }

    function showGlobalFixedFooterForState(state, blockRect, scrollBounds) {
        const fixed = getGlobalFixedFooter();

        // Restore previous state's in-flow footer visibility
        if (activeFixedState && activeFixedState !== state && activeFixedState.footer && !activeFixedState.collapsed) {
            activeFixedState.footer.classList.remove('cbc-footer-hidden-by-fixed');
        }

        activeFixedState = state;

        // Hide in-flow footer without changing layout/height
        if (state.footer) {
            state.footer.classList.add('cbc-footer-hidden-by-fixed');
        }

        fixed.classList.remove('cbc-footer-hidden');
        fixed.style.left = `${blockRect.left}px`;
        fixed.style.width = `${blockRect.width}px`;
        fixed.style.bottom = `${window.innerHeight - scrollBounds.bottom}px`;
    }

    function hideGlobalFixedFooter() {
        const fixed = getGlobalFixedFooter();

        fixed.classList.add('cbc-footer-hidden');
        fixed.style.left = '';
        fixed.style.width = '';
        fixed.style.bottom = '';

        if (activeFixedState && activeFixedState.footer && !activeFixedState.collapsed) {
            activeFixedState.footer.classList.remove('cbc-footer-hidden-by-fixed');
        }

        activeFixedState = null;
    }

    function updateFixedFooter() {
        // Early exit: don't create/manipulate fixed footer if no code blocks exist
        if (blockState.size === 0) {
            if (globalFixedFooter && document.body.contains(globalFixedFooter)) hideGlobalFixedFooter();
            return;
        }

        const fixed = getGlobalFixedFooter();
        const scrollBounds = getScrollBounds();

        // Height can be 0 if the fixed footer is hidden via display:none.
        // Fall back to any in-flow footer height (those are always measurable even if visibility:hidden).
        let footerHeight = fixed.offsetHeight || 0;
        if (!footerHeight) {
            for (const s of blockState.values()) {
                if (s && s.footer && document.body.contains(s.footer)) {
                    footerHeight = Math.max(footerHeight, s.footer.offsetHeight || 0);
                }
            }
        }
        footerHeight = footerHeight || 32;

        const collisionPadding = 1; // hide fixed slightly BEFORE it would touch the header
        const fixedTop = scrollBounds.bottom - footerHeight;

        let lowestTouchingState = null;
        let lowestTouchingRect = null;
        let bestScore = -Infinity;

        for (const state of blockState.values()) {
            if (!state || state.collapsed) continue;
            if (!state.block || !document.body.contains(state.block)) continue;

            const rect = state.block.getBoundingClientRect();

            // Not visible at all in the scroll viewport
            if (rect.bottom < scrollBounds.top || rect.top > scrollBounds.bottom) {
                if (state.footer && state !== activeFixedState) {
                    state.footer.classList.remove('cbc-footer-hidden-by-fixed');
                }
                continue;
            }

            // Only consider fixed-mode when the block bottom touches/enters the input area zone
            if (rect.bottom < scrollBounds.bottom) {
                if (state.footer && state !== activeFixedState) {
                    state.footer.classList.remove('cbc-footer-hidden-by-fixed');
                }
                continue;
            }

            // Candidate: pick the lowest-on-screen touching block (closest to input)
            const score = rect.top;
            if (score > bestScore) {
                bestScore = score;
                lowestTouchingState = state;
                lowestTouchingRect = rect;
            }
        }

        if (!lowestTouchingState) {
            hideGlobalFixedFooter();
            return;
        }

        // If the fixed footer would touch/cover THIS block's header, hide fixed entirely.
        // (Do not "jump" to another block's fixed footer; that feels wrong during auto-scroll.)
        const headerRect = lowestTouchingState.header.getBoundingClientRect();
        if (headerRect.bottom >= fixedTop - collisionPadding) {
            hideGlobalFixedFooter();
            return;
        }

        showGlobalFixedFooterForState(lowestTouchingState, lowestTouchingRect, scrollBounds);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TOOLBAR BUTTON (Dual Collapse/Expand with Hold-to-Activate)
    // ═══════════════════════════════════════════════════════════════════════

    let toolbarContainer = null;
    let holdTooltip = null;
    let holdTimer = null;
    let tooltipTimer = null;
    let confirmTimer = null;

    // Creates or returns the hold tooltip element.
    function getHoldTooltip() {
        if (holdTooltip && document.body.contains(holdTooltip)) {
            return holdTooltip;
        }

        holdTooltip = document.createElement('div');
        holdTooltip.className = 'cbc-hold-tooltip';
        document.body.appendChild(holdTooltip);

        return holdTooltip;
    }

    // Shows tooltip above the button with specified message.
    function showHoldTooltip(btn, message, isConfirmation = false, isDeactivation = false) {
        const tooltip = getHoldTooltip();
        tooltip.textContent = message;
        tooltip.classList.remove('confirmed', 'deactivated');

        if (isConfirmation) {
            tooltip.classList.add('confirmed');
        } else if (isDeactivation) {
            tooltip.classList.add('deactivated');
        }

        // Position above the button
        const rect = btn.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';

        // Need to measure tooltip height, so render it (in layout) but hidden.
        // IMPORTANT: clear inline styles after measuring, otherwise they override `.visible`.
        tooltip.classList.remove('visible');
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';

        const tooltipHeight = tooltip.offsetHeight;
        tooltip.style.top = `${rect.top - tooltipHeight - 8}px`;

        // Hand control back to CSS so `.visible` can actually show it
        tooltip.style.visibility = '';
        tooltip.style.opacity = '';
        tooltip.style.display = '';

        // Trigger transition
        tooltip.offsetHeight; // Force reflow
        tooltip.classList.add('visible');
    }

    // Hides the tooltip.
    function hideHoldTooltip() {
        if (holdTooltip) {
            holdTooltip.classList.remove('visible');
        }
    }

    // Clears all timers related to hold gesture.
    function clearHoldTimers() {
        if (tooltipTimer) {
            clearTimeout(tooltipTimer);
            tooltipTimer = null;
        }
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
        if (confirmTimer) {
            clearTimeout(confirmTimer);
            confirmTimer = null;
        }
    }

    // Updates toolbar button visuals based on current autoMode.
    function updateToolbarButton() {
        if (!toolbarContainer) return;

        if (settings.autoMode === 'collapse') {
            toolbarContainer.classList.add('auto-active');
        } else {
            toolbarContainer.classList.remove('auto-active');
        }
    }

    // Creates the dual toolbar button (collapse | expand).
    // Hold collapse button for 1s to toggle auto-collapse mode.
    function createToolbarButton() {
        if (document.getElementById('cbc-toolbar-toggle')) return;

        const form = document.querySelector('form');
        if (!form) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const targetContainer = submitBtn.closest('.flex.items-center.gap-2');
        if (!targetContainer) return;

        log('Creating dual toolbar button', 'info');

        toolbarContainer = document.createElement('div');
        toolbarContainer.id = 'cbc-toolbar-toggle';
        toolbarContainer.className = 'cbc-dual-btn';

        // No title attributes - we use custom tooltips instead
        // Collapse icon: fold style (two chevrons pointing inward)
        // Expand icon: unfold style (two chevrons pointing outward)
        toolbarContainer.innerHTML = `
            <button class="cbc-collapse-btn" type="button" aria-label="Collapse code blocks (hold to toggle auto-collapse)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 4 12 9 17 4"></polyline>
                    <polyline points="7 20 12 15 17 20"></polyline>
                </svg>
            </button>
            <button class="cbc-expand-btn" type="button" aria-label="Expand code blocks">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 8 12 3 17 8"></polyline>
                    <polyline points="7 16 12 21 17 16"></polyline>
                </svg>
            </button>
        `;

        const collapseBtn = toolbarContainer.querySelector('.cbc-collapse-btn');
        const expandBtn = toolbarContainer.querySelector('.cbc-expand-btn');

        // Track if hold gesture completed (to prevent click action)
        let holdCompleted = false;

        // Collapse button: click = collapse all, hold 1s = toggle auto-collapse
        collapseBtn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Left click only
            e.preventDefault();

            holdCompleted = false;
            const isCurrentlyActive = settings.autoMode === 'collapse';

            // Show hint tooltip and start fill animation after 500ms
            tooltipTimer = setTimeout(() => {
                const hintMessage = isCurrentlyActive
                    ? 'Keep holding to disable auto-collapse for code blocks...'
                    : 'Keep holding to enable auto-collapse for code blocks...';
                showHoldTooltip(collapseBtn, hintMessage);

                // Start fill animation (500ms duration, completes at 1000ms total)
                collapseBtn.classList.remove('filling-up', 'filling-down');
                collapseBtn.classList.add(isCurrentlyActive ? 'filling-down' : 'filling-up');
            }, 500);

            // Toggle auto-collapse after 1000ms
            holdTimer = setTimeout(() => {
                holdCompleted = true;
                clearHoldTimers();

                const newMode = isCurrentlyActive ? 'off' : 'collapse';
                const confirmMessage = newMode === 'collapse'
                    ? '✓ Auto-collapse code blocks ON'
                    : '✓ Auto-collapse code blocks OFF';

                log(`Hold completed: setting autoMode to ${newMode}`, 'success');
                CodeBlockCollapse.setAutoMode(newMode);

                // Show confirmation briefly
                showHoldTooltip(collapseBtn, confirmMessage, newMode === 'collapse', newMode === 'off');

                confirmTimer = setTimeout(() => {
                    hideHoldTooltip();
                }, 1200);
            }, 1000);
        });

        collapseBtn.addEventListener('mouseup', (e) => {
            if (e.button !== 0) return;

            clearHoldTimers();
            hideHoldTooltip();
            collapseBtn.classList.remove('filling-up', 'filling-down');

            // Only collapse if hold didn't complete
            if (!holdCompleted) {
                log('Collapse button clicked (no hold)', 'info');
                CodeBlockCollapse.collapseAll();
            }
            holdCompleted = false;
        });

        // Hover tooltips for collapse button
        let hoverTooltipTimer = null;

        const clearCollapseHover = () => {
            if (hoverTooltipTimer) {
                clearTimeout(hoverTooltipTimer);
                hoverTooltipTimer = null;
            }
        };

        collapseBtn.addEventListener('mouseleave', () => {
            clearHoldTimers();
            clearCollapseHover();
            hideHoldTooltip();
            collapseBtn.classList.remove('filling-up', 'filling-down');
            holdCompleted = false;
        });

        collapseBtn.addEventListener('mouseenter', () => {
            // Small delay to avoid flickering
            hoverTooltipTimer = setTimeout(() => {
                if (holdTimer) return; // Don't show hover tooltip during hold gesture
                const msg = settings.autoMode === 'collapse'
                    ? 'Collapse code blocks (hold to disable auto)'
                    : 'Collapse code blocks (hold to enable auto)';
                showHoldTooltip(collapseBtn, msg);
            }, 100);
        });

        // Hide tooltip when starting to hold
        collapseBtn.addEventListener('mousedown', () => {
            clearCollapseHover();
        });

        // Prevent context menu on collapse button
        collapseBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Expand button: simple click
        expandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            log('Expand button clicked', 'info');
            CodeBlockCollapse.expandAll();
        });

        // Hover tooltip for expand button
        let expandHoverTimer = null;

        expandBtn.addEventListener('mouseenter', () => {
            expandHoverTimer = setTimeout(() => {
                showHoldTooltip(expandBtn, 'Expand code blocks');
            }, 100);
        });
        expandBtn.addEventListener('mouseleave', () => {
            if (expandHoverTimer) {
                clearTimeout(expandHoverTimer);
                expandHoverTimer = null;
            }
            hideHoldTooltip();
        });

        // Prevent context menu on expand button
        expandBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Insert at the beginning of the container
        targetContainer.insertBefore(toolbarContainer, targetContainer.firstChild);
        updateToolbarButton();

        log('Dual toolbar button created', 'success');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CODE BLOCK SETUP
    // ═══════════════════════════════════════════════════════════════════════

    // Initializes a single code block if it hasn’t been processed.
    // Adds:
    // - header toggle behavior
    // - state hint element
    // - per-block footer bar (plus global fixed footer when needed)
    function setupCodeBlock(block) {
        if (blockState.has(block)) return;

        // arena.ai code blocks are wrapped with [data-code-block="true"].
        // We position relative to the code container and use the header bar for toggling.
        const container = block.querySelector('.code-block_container__lbMX4') ||
                          block.querySelector('pre:last-child');
        const header = block.querySelector('.border-b');

        if (!container || !header) return;

        log('Setting up code block', 'info');

        container.classList.add('cbc-container');
        header.classList.add('cbc-header-interactive');

        // Header hint (changes text depending on collapsed state via CSS).
        const hint = document.createElement('span');
        hint.className = 'cbc-state-hint';
        hint.innerHTML = `
            <span class="hint-collapse">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                <span>Click to collapse code</span>
            </span>
            <span class="hint-expand">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <span>Click to expand code</span>
            </span>
        `;
        header.appendChild(hint);

        // Create sticky footer bar for collapse action
        const footer = document.createElement('div');
        footer.className = 'cbc-footer';
        footer.setAttribute('role', 'button');
        footer.setAttribute('tabindex', '0');
        footer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <span>Collapse</span>
        `;
        block.appendChild(footer);

        // Per-block state record used by toggle logic.
        const state = {
            block,
            container,
            header,
            footer,
            collapsed: false
        };

        blockState.set(block, state);

        // Footer bar click: collapse the code block
        footer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            collapseBlock(state);
        });

        // Keyboard accessibility for footer: Enter/Space collapses.
        footer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                collapseBlock(state);
            }
        });

        // Header behavior: toggles both directions.
        // Important: ignore clicks on native buttons inside header (copy button, etc.).
        header.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;

            e.preventDefault();
            e.stopPropagation();
            toggleBlock(state);
        });

        // Keyboard accessibility: Enter/Space toggles.
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleBlock(state);
            }
        });

        // Make header focusable for keyboard use.
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');

        // Apply persistent mode to newly created blocks.
        CodeBlockCollapse.applyAutoModeToBlock(state);

        // Initial fixed-footer evaluation
        requestAnimationFrame(() => {
            updateFixedFooter();
        });
    }

    // Full scan:
    // - Used on initial load.
    // - Also used by the safety resync.
    function processAll() {
        document.querySelectorAll('[data-code-block="true"]').forEach(setupCodeBlock);
        createToolbarButton();
    }

    // Removes entries for blocks that disappeared from DOM and updates footer positions.
    function updateAll() {
        for (const [el, state] of blockState) {
            if (!document.body.contains(el)) {
                // Code block removed due to chat switch / rerender; clean up.
                if (state.footer && state.footer.parentNode) {
                    state.footer.remove();
                }
                blockState.delete(el);
            }
        }
        // Update global fixed footer state/position
        updateFixedFooter();
    }

    // Throttled footer update for ResizeObserver (separate from scroll rAF).
    function throttledUpdateFooter() {
        if (resizeRafId) return;
        resizeRafId = requestAnimationFrame(() => {
            updateFixedFooter();
            resizeRafId = null;
        });
    }

    // Sets up ResizeObserver on the textarea to detect height changes.
    // Called on init and when form is re-rendered by React.
    function setupInputResizeObserver() {
        if (!window.ResizeObserver) return;

        const textarea = document.querySelector('form textarea');
        if (!textarea) return;

        // Disconnect existing observer (handles React re-renders)
        if (inputResizeObserver) {
            inputResizeObserver.disconnect();
        }

        inputResizeObserver = new ResizeObserver(() => {
            throttledUpdateFooter();
        });

        // Observe textarea directly (grows as user types)
        inputResizeObserver.observe(textarea);

        // Also observe form container (catches overall input area resizes)
        const form = textarea.closest('form');
        if (form) {
            inputResizeObserver.observe(form);
        }

        log('Input ResizeObserver attached', 'info');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INCREMENTAL MUTATION OBSERVER (v1.3)
    // ═══════════════════════════════════════════════════════════════════════
    // Efficient approach:
    // - Do NOT scan the entire document on every mutation.
    // - Only inspect added nodes and their descendants for code blocks.
    const observer = new MutationObserver((mutations) => {
        let newBlocksFound = 0;
        let toolbarChecked = false;

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                // If the added node itself is a code block.
                if (node.matches?.('[data-code-block="true"]')) {
                    setupCodeBlock(node);
                    newBlocksFound++;
                }

                // Otherwise scan inside it for code blocks.
                if (node.querySelectorAll) {
                    const blocks = node.querySelectorAll('[data-code-block="true"]');
                    blocks.forEach(block => {
                        setupCodeBlock(block);
                        newBlocksFound++;
                    });

                    // The input area (and thus toolbar row) can be re-rendered; re-create if needed.
                    if (!toolbarChecked && (node.matches?.('form') || node.querySelector?.('form'))) {
                        createToolbarButton();
                        setupInputResizeObserver();
                        toolbarChecked = true;
                    }
                }
            }
        }

        if (newBlocksFound > 0) {
            log(`Mutation: processed ${newBlocksFound} new code block(s)`, 'success');
        }

        // Always update positions and cleanup (cheap relative to full rescan).
        updateAll();
    });

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION (Dynamic Stabilization Observer)
    // ═══════════════════════════════════════════════════════════════════════

    const start = () => {
        log('Initializing...', 'info');

        loadSettings();
        injectStyles();

        // Initial full scan.
        processAll();
        updateAll();

        // Apply persisted mode immediately on load.
        CodeBlockCollapse.applyAutoMode();

        // Start observers and listeners only after initial setup
        observer.observe(document.body, { childList: true, subtree: true });

        setInterval(() => {
            const currentCount = blockState.size;
            const totalOnPage = document.querySelectorAll('[data-code-block="true"]').length;
            if (totalOnPage !== currentCount) {
                processAll();
                updateAll();
            }
        }, CONFIG.resyncInterval);

        let rafId = null;
        const onScrollResize = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                updateAll();
                rafId = null;
            });
        };

        window.addEventListener('scroll', onScrollResize, { passive: true });
        window.addEventListener('resize', onScrollResize, { passive: true });
        document.addEventListener('scroll', onScrollResize, { passive: true, capture: true });

        // Watch textarea for resize (grows as user types multi-line input)
        setupInputResizeObserver();

        log(`Initialized. Auto-collapse: ${settings.autoMode === 'collapse' ? 'ON' : 'OFF'}`, 'success');
    };

    /**
     * React Stabilization Watcher:
     * Instead of a hardcoded delay, we wait for the main chat form to appear.
     * This signals that React hydration is complete and it is safe to touch the DOM.
     */
    const initWhenReady = () => {
        // Selector for the main chat input - presence implies hydration is finished
        const READY_SELECTOR = 'form textarea';

        if (document.querySelector(READY_SELECTOR)) {
            // Already ready, use idle callback for safety
            (window.requestIdleCallback || setTimeout)(start, { timeout: 1000 });
            return;
        }

        // Otherwise, observe until the form appears
        const readyObserver = new MutationObserver(() => {
            if (document.querySelector(READY_SELECTOR)) {
                readyObserver.disconnect();
                // Give React a small 200ms "settle" window after the element appears
                setTimeout(() => {
                    (window.requestIdleCallback || setTimeout)(start, { timeout: 1000 });
                }, 200);
            }
        });

        readyObserver.observe(document.body, { childList: true, subtree: true });
    };

    initWhenReady();
})();
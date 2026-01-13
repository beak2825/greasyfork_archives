// ==UserScript==
// @name         LMArena | Floating Copy Buttons
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      3.2
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Adds floating copy buttons for code blocks and chat messages
// @match        *://*lmarena.ai/*
// @icon         https://lmarena.ai/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559194/LMArena%20%7C%20Floating%20Copy%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/559194/LMArena%20%7C%20Floating%20Copy%20Buttons.meta.js
// ==/UserScript==

    /*
        What this script does
        ---------------------
        - Replaces the native code block copy button with a custom, drag-capable header button.
        - Adds a "Code Column" strip: A transparent, interactive overlay on the right edge of code blocks.
          * Hover to see options, Click to copy, Drag to move content.
          * The icon inside the strip vertically follows the viewport (sticky behavior).
        - Adds floating copy buttons for chat messages (User/AI).
        - robustly handles React hydration, SPA navigation, and dynamic resizing of the input area.

        Architecture
        -----------------------
        - Uses a "Settle" strategy for React Hydration (waits for form textarea).
        - Incremental MutationObserver handles new content during streaming/navigation.
        - ResizeObserver ensures the Code Column never overlaps the text input area.
    */

    // ═══════════════════════════════════════════════════════════════════════
    // CHANGELOG
    // ═══════════════════════════════════════════════════════════════════════
    // v1.4
    // - UX: Removed hold-delay for drag operations (drag starts instantly on movement).
    //
    // v1.5 - v1.7
    // - Feature: Replaced native code block header button with custom implementation.
    // - Style: Adjusted button to be a flush, non-scaling square (44px) for perfect alignment.
    //
    // v1.8
    // - Cleanup: Completely removed the legacy "Centered Floating Button" mechanism.
    //
    // v1.9 - v2.1 [Experimental / Reverted]
    // - Attempted a "Fixed Header" approach that followed the viewport.
    // - Reverted due to complexity and cleaner alternatives found in v2.2.
    //
    // v2.2
    // - Major Feature: Introduced the "Code Column" strip.
    //   (A click/drag strip overlaying the right side of code blocks).
    // - Logic: Implemented sticky icon positioning within the strip.
    //
    // v2.3 - v2.4
    // - Core: Implemented robust React Stabilization measures.
    // - Fix: Added logic to handle SPA chat switching (detects placeholder vs hydrated nodes).
    // - Fix: Solved "disappearing elements" by waiting for React to settle (150-200ms debounce).
    //
    // v2.5 - v2.7
    // - Physics: Added collision detection with the chat input area.
    // - Feature: Added ResizeObserver to text input; strip height adjusts in real-time as user types.
    //
    // v2.8 - v2.9
    // - Polish: Removed safety padding calculations.
    // - Result: Strip now extends seamlessly from the site header to the input bar with zero gaps.
    // - Fix: Restored missing drag handlers for header buttons.
    //
    // v3.0
    // - Cleanup: Removed orphaned function `getElementVisibleBounds` (never called).
    // - Cleanup: Removed all debug console logging instrumentation (~23 statements).
    // - Cleanup: Removed debug-only properties (`btn._dragLogged`, `isChatSwitch`).
    // - Cleanup: Removed buggy/dead `querySelectorAll?.[...]` branch in MutationObserver.
    // - Cleanup: Removed unused state fields (`state.block`, `state.icon`) from codeColumnMap.
    // - Performance: Removed unnecessary drag event listener used only for logging.
    //
    // v3.1
    // - Fix: Message buttons now appear for streaming messages during active conversations.
    //   (MutationObserver was only detecting messages inside newly added `ol` containers,
    //    not individual message elements added to an existing container.)
    //
    // v3.2
    // - Fix: AI message copy button no longer overlaps code block header buttons.
    //   * Messages that are predominantly code (>70% height) hide the message button entirely.
    //   * Mixed-content messages use collision detection to reposition the button safely.
    //
    // ═══════════════════════════════════════════════════════════════════════
    // DISCARDED BRANCH (Concept Only)
    // ═══════════════════════════════════════════════════════════════════════
    // v3.0 [Branch Abandoned - Pre-cleanup]
    // - Experiment: Attempted to replace Floating Message Buttons with "Message Strips".
    // - Concept: Attached solid-colored strips to the left/right of message containers.
    // - Reason for discard: Preference for the original floating button design for messages,
    //   while keeping the Strip design strictly for code blocks.

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════

    const CONFIG = {
        // Code block side column (inside code area, right edge)
        codeColumn: {
            width: 44,              // Match header button width
            iconSize: 20,           // Icon size
            idleOpacity: 0.12,      // Very transparent when not hovered
            hoverOpacity: 1.0,      // Solid when hovered
            idle: {
                background: 'rgba(255,255,255,0.02)',
                color: 'rgba(255,255,255,0.35)'
            },
            hover: {
                background: 'rgba(255,255,255,0.08)',
                color: '#ffffff'
            }
        },

        // Message buttons (beside message, fallback to overlay)
        message: {
            size: 40,
            padding: 8,
            borderRadius: 10,
            iconSize: 18,
            offset: 10, // Gap between button and message edge when beside
            overlayPadding: 8, // Padding when overlaying on message
            ai: {
                side: 'right',
                idle: {
                    background: 'rgba(139,92,246,0.08)',
                    border: 'rgba(139,92,246,0.25)',
                    color: 'rgba(139,92,246,0.5)'
                },
                hover: {
                    background: 'rgba(109,72,206,0.95)',
                    border: 'rgba(167,139,250,0.6)',
                    color: '#ffffff'
                }
            },
            user: {
                side: 'left',
                idle: {
                    background: 'rgba(59,130,246,0.08)',
                    border: 'rgba(59,130,246,0.25)',
                    color: 'rgba(59,130,246,0.5)'
                },
                hover: {
                    background: 'rgba(37,99,235,0.95)',
                    border: 'rgba(96,165,250,0.6)',
                    color: '#ffffff'
                }
            }
        },

        // Shared copied state
        copied: {
            background: 'rgba(34,197,94,0.95)',
            border: '#22c55e',
            color: '#ffffff'
        },

        // Safe zone padding from header/footer
        safeZonePadding: 8
    };

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const buttonMap = new Map();
    const codeColumnMap = new Map(); // block -> { column, icon, container, header, getContent }

    // ResizeObserver for textarea height changes (typing causes growth)
    let inputResizeObserver = null;
    let inputResizeRafId = null;
    let observedTextarea = null;
    let observedForm = null;
    let inputEventBound = false;

    // ═══════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════

    function copyText(text) {
        if (navigator.clipboard?.writeText) {
            return navigator.clipboard.writeText(text);
        }
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        return Promise.resolve();
    }

    // Find the native copy button within a message element (not code block buttons)
    function findNativeCopyButton(el) {
        // Find all copy icons in the element
        const copyIcons = el.querySelectorAll('svg.lucide-copy');

        for (const icon of copyIcons) {
            const button = icon.closest('button');
            if (!button) continue;

            // Skip if this button is inside a code block
            if (button.closest('[data-code-block="true"]')) continue;

            return button;
        }

        return null;
    }

    // Get the safe zone (area excluding header and input area)
    function getSafeZone() {
        const padding = CONFIG.safeZonePadding;

        // Prefer the actual scroll viewport used by the chat (prevents "under the input" overlap)
        const scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]');

        // Find header - the border-b element in chat area
        const header = document.querySelector('#chat-area > .flex-shrink-0.border-b') ||
                       document.querySelector('#chat-area > div:first-child');

        // Prefer the actual visible "input bar" top edge (the bordered wrapper), so we align seamlessly
        const form = document.querySelector('form');
        const inputCollisionEl =
            form?.closest('.border-border-faint') ||
            form ||
            document.querySelector('.relative.flex.flex-col.items-center.pb-6') ||
            document.querySelector('form')?.closest('div[class*="pb-"]');

        let safeTop = padding;
        let safeBottom = window.innerHeight - padding;

        // Clamp to scroll viewport if present.
        // NO padding on either edge - we want seamless alignment.
        if (scrollViewport) {
            const vpRect = scrollViewport.getBoundingClientRect();
            safeTop = Math.max(safeTop, vpRect.top);
            safeBottom = Math.min(safeBottom, vpRect.bottom);
        }

        // The site header is already accounted for by the scroll viewport's top edge,
        // but if for some reason we need a fallback:
        if (header) {
            const headerRect = header.getBoundingClientRect();
            safeTop = Math.max(safeTop, headerRect.bottom);
        }

        // Align exactly to the top edge of the input bar (no padding subtraction).
        if (inputCollisionEl) {
            const inputRect = inputCollisionEl.getBoundingClientRect();
            safeBottom = Math.min(safeBottom, inputRect.top);
        }

        return { safeTop, safeBottom };
    }

    function getVisibleBounds(el, safeZone) {
        const rect = el.getBoundingClientRect();
        const { safeTop, safeBottom } = safeZone;
        const vw = window.innerWidth;

        // Intersect element rect with safe zone
        const top = Math.max(rect.top, safeTop);
        const bottom = Math.min(rect.bottom, safeBottom);
        const left = Math.max(rect.left, 0);
        const right = Math.min(rect.right, vw);

        // No visible area
        if (top >= bottom || left >= right) return null;

        return {
            top, bottom, left, right,
            width: right - left,
            height: bottom - top,
            fullRect: rect
        };
    }

    function createButton(size, iconSize, className) {
        // Using div instead of button - buttons have browser-specific drag issues
        const btn = document.createElement('div');
        btn.className = `fcb-btn ${className}`;
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('draggable', 'true');
        btn.innerHTML = `
            <svg class="icon icon-copy" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            <svg class="icon icon-check" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"></path>
            </svg>
        `;
        document.body.appendChild(btn);
        return btn;
    }

    function showCopiedFeedback(btn) {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
    }

    function hideButton(btn) {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
    }

    function showButton(btn, x, y) {
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
    }

    function clampY(y, bounds, size, padding) {
        const minY = bounds.top + padding;
        const maxY = bounds.bottom - size - padding;

        // Not enough vertical space
        if (minY > maxY) return null;

        return Math.max(minY, Math.min(maxY, y));
    }

    // Check if two rectangles overlap
    function rectsOverlap(r1, r2) {
        return !(r1.right < r2.left ||
                 r1.left > r2.right ||
                 r1.bottom < r2.top ||
                 r1.top > r2.bottom);
    }

    // Check if a message is predominantly code (>70% of visible height)
    function isCodeDominantMessage(el) {
        const prose = el.querySelector('.no-scrollbar .prose');
        if (!prose) return false;

        const codeBlocks = el.querySelectorAll('[data-code-block="true"]');
        if (codeBlocks.length === 0) return false;

        const proseRect = prose.getBoundingClientRect();
        if (proseRect.height === 0) return false;

        let codeHeight = 0;
        codeBlocks.forEach(block => {
            codeHeight += block.getBoundingClientRect().height;
        });

        // If code takes up > 70% of the message height, consider it code-dominant
        return (codeHeight / proseRect.height) > 0.7;
    }

    // Get bounding rects of all code block headers within an element
    function getCodeBlockHeaderRects(el) {
        const rects = [];
        const codeBlocks = el.querySelectorAll('[data-code-block="true"]');

        codeBlocks.forEach(block => {
            // Check for our custom header button first, then native header
            const header = block.querySelector('.fcb-code-header') ||
                           block.querySelector('.flex.items-center.justify-between.border-b');
            if (header) {
                const rect = header.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    rects.push(rect);
                }
            }
        });

        return rects;
    }

    // Find a Y position that avoids collision with code block headers
    function avoidHeaderCollision(sourceEl, x, y, size, bounds, padding) {
        const headerRects = getCodeBlockHeaderRects(sourceEl);
        if (headerRects.length === 0) return y;

        const btnRect = { left: x, right: x + size, top: y, bottom: y + size };

        // Find any colliding header
        const collision = headerRects.find(hr => rectsOverlap(btnRect, hr));
        if (!collision) return y;

        // Try positioning below the colliding header
        const belowY = collision.bottom + padding;
        if (belowY + size <= bounds.bottom - padding) {
            const newBtnRect = { left: x, right: x + size, top: belowY, bottom: belowY + size };
            const newCollision = headerRects.find(hr => rectsOverlap(newBtnRect, hr));
            if (!newCollision) return belowY;
        }

        // Try positioning above all code blocks
        const codeBlocks = sourceEl.querySelectorAll('[data-code-block="true"]');
        if (codeBlocks.length > 0) {
            const topMost = Math.min(...Array.from(codeBlocks).map(b => b.getBoundingClientRect().top));
            const aboveY = topMost - size - padding;
            if (aboveY >= bounds.top + padding) {
                return aboveY;
            }
        }

        // No valid position found - signal to hide
        return null;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // POSITIONING STRATEGIES
    // ═══════════════════════════════════════════════════════════════════════

    function positionBeside(btn, targetEl, size, padding, side, offset, sourceEl) {
        const safeZone = getSafeZone();
        const minVisible = size + padding * 2;
        const bounds = getVisibleBounds(targetEl, safeZone);

        if (!bounds || bounds.height < minVisible) {
            return hideButton(btn);
        }

        const isUser = side === 'left';

        // For AI messages: hide button if message is code-dominant
        // (code blocks have their own copy mechanisms)
        if (!isUser && sourceEl && isCodeDominantMessage(sourceEl)) {
            return hideButton(btn);
        }

        // Calculate "beside" position
        const besideX = side === 'left'
            ? bounds.fullRect.left - size - offset
            : bounds.fullRect.right + offset;

        // Check if "beside" position fits within viewport
        const fitsBeside = besideX >= padding && besideX + size <= window.innerWidth - padding;

        let x;
        let inOverlayMode = false;

        if (fitsBeside) {
            // Position beside the message
            x = besideX;
        } else {
            // Fallback: overlay on the message
            inOverlayMode = true;
            const overlayPadding = CONFIG.message.overlayPadding;

            if (side === 'left') {
                // For user messages (left side), overlay on left edge
                x = bounds.left + overlayPadding;
            } else {
                // For AI messages (right side), overlay on right edge
                x = bounds.right - size - overlayPadding;
            }

            // Ensure x stays within viewport
            x = Math.max(padding, Math.min(window.innerWidth - size - padding, x));
        }

        // Calculate Y position (vertically centered within visible bounds)
        let y = bounds.top + (bounds.height / 2) - (size / 2);

        // For AI messages in overlay mode: check for collision with code block headers
        if (!isUser && inOverlayMode && sourceEl) {
            const adjustedY = avoidHeaderCollision(sourceEl, x, y, size, bounds, padding);
            if (adjustedY === null) {
                return hideButton(btn);
            }
            y = adjustedY;
        }

        const clampedY = clampY(y, bounds, size, padding);

        if (clampedY === null) {
            return hideButton(btn);
        }

        showButton(btn, x, clampedY);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════════════

    function injectStyles() {
        if (document.getElementById('fcb-styles')) return;

        const { message: msg, copied } = CONFIG;

        const style = document.createElement('style');
        style.id = 'fcb-styles';
        style.textContent = `
            .fcb-btn {
                position: fixed;
                z-index: 10000;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                opacity: 0;
                visibility: hidden;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                pointer-events: auto;
                -webkit-user-drag: element;
                -webkit-user-select: none;
                user-select: none;
                -moz-user-select: none;
                touch-action: none;
            }
            .fcb-btn * {
                pointer-events: none !important;
                -webkit-user-drag: none !important;
            }
            .fcb-btn .icon {
                position: absolute;
                transition: opacity 0.2s, transform 0.2s;
            }
            .fcb-btn.dragging {
                opacity: 0.6 !important;
                cursor: grabbing;
            }
            .fcb-btn .icon-copy { opacity: 1; transform: scale(1); }
            .fcb-btn .icon-check { opacity: 0; transform: scale(0.5); }
            .fcb-btn.copied .icon-copy { opacity: 0; transform: scale(0.5); }
            .fcb-btn.copied .icon-check { opacity: 1; transform: scale(1); }
            .fcb-btn.copied {
                background: ${copied.background} !important;
                color: ${copied.color} !important;
                border-color: ${copied.border} !important;
            }

            /* Code block side column (right edge of code area) */
            .fcb-code-column {
                position: absolute;
                right: 0;
                top: 0;
                /* IMPORTANT:
                   We do NOT use bottom:0, because we dynamically clamp (top/height) to the visible safe zone
                   so the strip never collides with / overlays the input area. */
                width: ${CONFIG.codeColumn.width}px;
                height: 100%;
                cursor: pointer;
                opacity: ${CONFIG.codeColumn.idleOpacity};
                transition: opacity 0.2s ease, background-color 0.2s ease;
                background: ${CONFIG.codeColumn.idle.background};
                z-index: 10;
                pointer-events: auto;
                border-radius: 0 0 6px 0;
                overflow: hidden;
                will-change: top, height;
            }
            /* When the bottom of the code area is clipped by the safe zone, don't show a "fake" rounded corner mid-block */
            .fcb-code-column.fcb-clip-bottom {
                border-bottom-right-radius: 0;
            }
            .fcb-code-column:hover {
                opacity: ${CONFIG.codeColumn.hoverOpacity};
                background: ${CONFIG.codeColumn.hover.background};
            }
            .fcb-code-column.copied {
                opacity: 1 !important;
                background: rgba(34,197,94,0.15) !important;
            }
            .fcb-code-column-icon {
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                align-items: center;
                justify-content: center;
                height: 40px;
                color: ${CONFIG.codeColumn.idle.color};
                transition: color 0.2s ease, transform 0.2s ease;
                -webkit-user-drag: element;
                -webkit-user-select: none;
                user-select: none;
            }
            .fcb-code-column:hover .fcb-code-column-icon {
                color: ${CONFIG.codeColumn.hover.color};
            }
            .fcb-code-column.copied .fcb-code-column-icon {
                color: #22c55e !important;
            }
            .fcb-code-column-icon * {
                pointer-events: none !important;
                -webkit-user-drag: none !important;
            }
            .fcb-code-column-icon .icon {
                position: absolute;
                transition: opacity 0.2s, transform 0.2s;
            }
            .fcb-code-column-icon .icon-copy { opacity: 1; transform: scale(1); }
            .fcb-code-column-icon .icon-check { opacity: 0; transform: scale(0.5); }
            .fcb-code-column.copied .fcb-code-column-icon .icon-copy { opacity: 0; transform: scale(0.5); }
            .fcb-code-column.copied .fcb-code-column-icon .icon-check { opacity: 1; transform: scale(1); }

            /* Code block header button (replaces native) */
            .fcb-code-header {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                width: 44px;
                height: 44px;
                /* Pull into header padding without changing header size (header is px-4 py-2) */
                margin: -8px -16px -8px 0;
                border-radius: 8px;
                border: 2px solid transparent;
                background: transparent;
                color: rgba(255,255,255,0.6);
                transition: all 0.2s ease;
                -webkit-user-drag: element;
                -webkit-user-select: none;
                user-select: none;
                -moz-user-select: none;
                touch-action: none;
            }
            .fcb-code-header * {
                pointer-events: none !important;
                -webkit-user-drag: none !important;
            }
            .fcb-code-header .icon {
                position: absolute;
                transition: opacity 0.2s, transform 0.2s;
            }
            .fcb-code-header .icon-copy { opacity: 1; transform: scale(1); }
            .fcb-code-header .icon-check { opacity: 0; transform: scale(0.5); }
            .fcb-code-header.copied .icon-copy { opacity: 0; transform: scale(0.5); }
            .fcb-code-header.copied .icon-check { opacity: 1; transform: scale(1); }
            .fcb-code-header.copied {
                background: rgba(34,197,94,0.2) !important;
                color: #22c55e !important;
                border-color: rgba(34,197,94,0.4) !important;
            }
            .fcb-code-header:hover {
                background: rgba(255,255,255,0.1);
                border-color: rgba(255,255,255,0.25);
                color: #ffffff;
                transform: none;
            }
            .fcb-code-header.dragging {
                opacity: 0.6;
                cursor: grabbing;
            }

            /* AI message */
            .fcb-ai {
                width: ${msg.size}px;
                height: ${msg.size}px;
                border-radius: ${msg.borderRadius}px;
                border: 2px solid ${msg.ai.idle.border};
                background: ${msg.ai.idle.background};
                color: ${msg.ai.idle.color};
            }
            .fcb-ai:hover {
                background: ${msg.ai.hover.background};
                color: ${msg.ai.hover.color};
                border-color: ${msg.ai.hover.border};
                transform: scale(1.1);
                box-shadow: 0 6px 24px rgba(0,0,0,0.4);
            }

            /* User message */
            .fcb-user {
                width: ${msg.size}px;
                height: ${msg.size}px;
                border-radius: ${msg.borderRadius}px;
                border: 2px solid ${msg.user.idle.border};
                background: ${msg.user.idle.background};
                color: ${msg.user.idle.color};
            }
            .fcb-user:hover {
                background: ${msg.user.hover.background};
                color: ${msg.user.hover.color};
                border-color: ${msg.user.hover.border};
                transform: scale(1.1);
                box-shadow: 0 6px 24px rgba(0,0,0,0.4);
            }
        `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ELEMENT DETECTION
    // ═══════════════════════════════════════════════════════════════════════

    function isAIMessage(el) {
        return el.tagName === 'DIV' &&
               el.classList.contains('bg-surface-primary') &&
               el.querySelector('.sticky .font-mono, .sticky.top-0');
    }

    function isUserMessage(el) {
        return el.tagName === 'DIV' &&
               el.classList.contains('self-end') &&
               el.querySelector('.bg-surface-secondary');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONTENT EXTRACTION
    // ═══════════════════════════════════════════════════════════════════════

    function getCodeContent(block) {
        const code = block.querySelector('code');
        return code?.textContent || '';
    }

    function throttledUpdateAll() {
        if (inputResizeRafId) return;
        inputResizeRafId = requestAnimationFrame(() => {
            updateAll();
            inputResizeRafId = null;
        });
    }

    // Watches textarea growth (line breaks) so the safe zone updates immediately (no overlap).
    function setupInputResizeObserver() {
        if (!window.ResizeObserver) return;

        const textarea = document.querySelector('form textarea');
        if (!textarea) return;

        const form = textarea.closest('form');

        // If we're already observing the current textarea/form, do nothing.
        if (inputResizeObserver && observedTextarea === textarea && observedForm === form) {
            return;
        }

        observedTextarea = textarea;
        observedForm = form;

        if (inputResizeObserver) {
            try { inputResizeObserver.disconnect(); } catch (e) {}
        }

        inputResizeObserver = new ResizeObserver(() => {
            throttledUpdateAll();
        });

        inputResizeObserver.observe(textarea);
        if (form) inputResizeObserver.observe(form);

        // Also observe the common input-area wrapper if present (covers layout changes beyond textarea height).
        const inputArea = document.querySelector('.relative.flex.flex-col.items-center.pb-6') ||
                          (form ? form.closest('div[class*="pb-"]') : null);
        if (inputArea) {
            inputResizeObserver.observe(inputArea);
        }

        // Ensure we re-clamp immediately after attaching
        throttledUpdateAll();
    }

    // Input-driven updates:
    // The site often resizes the textarea via JS/CSS without triggering scroll/resize events.
    // We must update strip geometry on every textarea input + focus transitions.
    function bindInputAreaListeners() {
        if (inputEventBound) return;
        inputEventBound = true;

        // Bubble-phase so the site's own textarea autosize handlers run first (target phase),
        // then we measure updated layout.
        document.addEventListener('input', (e) => {
            const t = e.target;
            if (!(t instanceof HTMLTextAreaElement)) return;
            if (!t.closest('form')) return;

            // Track React re-renders: if the textarea got replaced, reattach observers.
            setupInputResizeObserver();

            throttledUpdateAll();
        });

        // SPA chat switches can replace the textarea; focus is a reliable signal even before first keystroke.
        document.addEventListener('focusin', (e) => {
            const t = e.target;
            if (!(t instanceof HTMLTextAreaElement)) return;
            if (!t.closest('form')) return;

            setupInputResizeObserver();
            throttledUpdateAll();
        });
    }

    function getMessageContent(el, isUser) {
        const selector = isUser
            ? '.bg-surface-secondary .prose'
            : '.no-scrollbar .prose';
        const prose = el.querySelector(selector);
        return prose?.textContent?.trim() || '';
    }

    // Convert prose HTML to Markdown for drag operations
    function getMessageMarkdown(el, isUser) {
        const selector = isUser
            ? '.bg-surface-secondary .prose'
            : '.no-scrollbar .prose';
        const prose = el.querySelector(selector);
        if (!prose) return '';
        return htmlToMarkdown(prose);
    }

    // HTML to Markdown converter
    function htmlToMarkdown(element) {
        if (!element) return '';

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            }
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return '';
            }

            const tag = node.tagName.toLowerCase();
            const children = Array.from(node.childNodes).map(processNode).join('');

            switch (tag) {
                case 'h1': return `# ${children.trim()}\n\n`;
                case 'h2': return `## ${children.trim()}\n\n`;
                case 'h3': return `### ${children.trim()}\n\n`;
                case 'h4': return `#### ${children.trim()}\n\n`;
                case 'h5': return `##### ${children.trim()}\n\n`;
                case 'h6': return `###### ${children.trim()}\n\n`;
                case 'p': return `${children}\n\n`;
                case 'br': return '\n';
                case 'strong':
                case 'b': return `**${children}**`;
                case 'em':
                case 'i': return `*${children}*`;
                case 'code':
                    if (node.closest('pre')) return children;
                    return `\`${children}\``;
                case 'pre':
                    const codeEl = node.querySelector('code');
                    const langMatch = codeEl?.className?.match(/language-(\w+)/);
                    const lang = langMatch ? langMatch[1] : '';
                    const codeContent = codeEl?.textContent || children;
                    return `\`\`\`${lang}\n${codeContent}\n\`\`\`\n\n`;
                case 'a':
                    const href = node.getAttribute('href') || '';
                    return `[${children}](${href})`;
                case 'ul':
                case 'ol':
                    return children + '\n';
                case 'li':
                    const parent = node.parentElement;
                    const isOrdered = parent?.tagName.toLowerCase() === 'ol';
                    if (isOrdered) {
                        const idx = Array.from(parent.children).indexOf(node) + 1;
                        return `${idx}. ${children.trim()}\n`;
                    }
                    return `- ${children.trim()}\n`;
                case 'blockquote':
                    return children.trim().split('\n').map(l => `> ${l}`).join('\n') + '\n\n';
                case 'hr': return '\n---\n\n';
                case 'table':
                    return processTable(node);
                default:
                    return children;
            }
        }

        function processTable(table) {
            const rows = Array.from(table.querySelectorAll('tr'));
            if (rows.length === 0) return '';

            let md = '';
            rows.forEach((row, rowIdx) => {
                const cells = Array.from(row.querySelectorAll('th, td'));
                const cellTexts = cells.map(c => c.textContent.trim());
                md += '| ' + cellTexts.join(' | ') + ' |\n';
                if (rowIdx === 0) {
                    md += '| ' + cells.map(() => '---').join(' | ') + ' |\n';
                }
            });
            return md + '\n';
        }

        const result = processNode(element);
        return result.replace(/\n{3,}/g, '\n\n').trim();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SETUP FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    function setupCodeColumn(block) {
        // If we think this block is set up, but React removed our column, repair it.
        if (codeColumnMap.has(block)) {
            const existingState = codeColumnMap.get(block);
            const stillHasColumn = existingState?.column && document.body.contains(existingState.column) && existingState.container?.contains(existingState.column);

            if (stillHasColumn) return;

            // Cleanup stale state so we can rebuild cleanly
            try {
                existingState?.column?.remove?.();
            } catch (e) {}
            codeColumnMap.delete(block);
        }

        // Defensive: if a column already exists in DOM (maybe created by a previous run), adopt "do nothing"
        const existingColumn = block.querySelector('.fcb-code-column');
        if (existingColumn) {
            return;
        }

        // Find the code container (where the actual code is displayed)
        const container = block.querySelector('.code-block_container__lbMX4') ||
                          block.querySelector('pre');
        if (!container) return;

        // Ensure container has position relative for absolute positioning
        const containerStyle = getComputedStyle(container);
        if (containerStyle.position === 'static') {
            container.style.position = 'relative';
        }

        const { iconSize } = CONFIG.codeColumn;

        // Create the column
        const column = document.createElement('div');
        column.className = 'fcb-code-column';
        column.setAttribute('role', 'button');
        column.setAttribute('tabindex', '0');
        column.setAttribute('draggable', 'true');
        column.setAttribute('data-fcb-column', 'true'); // Mark as ours

        // Create the icon container (CSS-centered; no per-scroll pixel positioning needed)
        const icon = document.createElement('div');
        icon.className = 'fcb-code-column-icon';
        icon.innerHTML = `
            <svg class="icon icon-copy" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            <svg class="icon icon-check" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"></path>
            </svg>
        `;
        column.appendChild(icon);
        container.appendChild(column);

        const getContent = () => getCodeContent(block);

        const state = {
            container,
            header: block.querySelector('.border-b') || null,
            column,
            getContent
        };

        codeColumnMap.set(block, state);

        // Setup drag and click handlers on the column
        setupCodeColumnDragAndClick(column, state);

        // Initial clamp to safe zone (prevents immediate collision with input area)
        updateCodeColumnGeometry(state);
    }

    function setupCodeColumnDragAndClick(column, state) {
        let dragDidStart = false;

        column.addEventListener('dragstart', (e) => {
            const content = state.getContent();
            if (!content) {
                e.preventDefault();
                return;
            }

            e.dataTransfer.setData('text/plain', content);
            e.dataTransfer.effectAllowed = 'copyMove';

            // Create drag image
            const dragImage = document.createElement('div');
            dragImage.textContent = `📄 ${content.length > 50 ? content.substring(0, 47) + '...' : content}`;
            dragImage.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                padding: 8px 12px;
                background: rgba(30, 30, 30, 0.95);
                color: #fff;
                border-radius: 6px;
                font-size: 12px;
                font-family: system-ui, sans-serif;
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 99999;
            `;
            document.body.appendChild(dragImage);

            try {
                e.dataTransfer.setDragImage(dragImage, 10, 10);
            } catch (err) {}

            requestAnimationFrame(() => dragImage.remove());

            dragDidStart = true;
            column.style.opacity = '0.6';
        });

        column.addEventListener('dragend', () => {
            column.style.opacity = '';
            setTimeout(() => {
                dragDidStart = false;
            }, 50);
        });

        column.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (dragDidStart) return;

            const content = state.getContent();
            if (!content) return;

            try {
                await copyText(content);
                column.classList.add('copied');
                setTimeout(() => column.classList.remove('copied'), 2000);
            } catch (err) {
                console.error('Copy failed:', err);
            }
        });

        // Keyboard accessibility
        column.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const content = state.getContent();
                if (!content) return;

                try {
                    await copyText(content);
                    column.classList.add('copied');
                    setTimeout(() => column.classList.remove('copied'), 2000);
                } catch (err) {
                    console.error('Copy failed:', err);
                }
            }
        });
    }

    function updateCodeColumnGeometry(state) {
        const { container, column, header } = state;

        if (!container || !column) return;

        // Clamp the strip to the visible safe zone so it never runs under / into the input area.
        const safeZone = getSafeZone();
        const rect = container.getBoundingClientRect();

        const visibleTop = Math.max(rect.top, safeZone.safeTop);
        const visibleBottom = Math.min(rect.bottom, safeZone.safeBottom);

        // Not visible
        if (visibleTop >= visibleBottom) {
            column.style.visibility = 'hidden';
            column.style.pointerEvents = 'none';
            column.style.height = '0px';
            column.style.top = '0px';
            column.classList.remove('fcb-clip-bottom');
            return;
        }

        const relTop = visibleTop - rect.top;
        const height = visibleBottom - visibleTop;

        // If the visible strip would be too short, hide it entirely.
        // This prevents the icon from appearing in awkward places (e.g., "under" the header during edge cases).
        const headerHeight = Math.max(
            0,
            header?.offsetHeight || header?.getBoundingClientRect?.().height || 0
        );
        const minStripHeight = Math.max(44, headerHeight || 0);

        if (height < minStripHeight) {
            column.style.visibility = 'hidden';
            column.style.pointerEvents = 'none';
            column.style.height = '0px';
            column.style.top = '0px';
            column.classList.remove('fcb-clip-bottom');
            return;
        }

        // Apply geometry (seamless: strip ends exactly at the safe zone boundary)
        column.style.top = `${relTop}px`;
        column.style.height = `${height}px`;
        column.style.visibility = 'visible';
        column.style.pointerEvents = 'auto';

        // Visual polish: if we're clipping the bottom (e.g., input area is covering content), remove the rounded corner
        const clipBottom = visibleBottom < rect.bottom - 0.5;
        column.classList.toggle('fcb-clip-bottom', clipBottom);
    }

    function setupCodeBlockHeader(block) {
        // Find the header and native button
        const header = block.querySelector('.flex.items-center.justify-between.border-b');
        if (!header) return;

        const nativeBtn = header.querySelector('button');
        if (!nativeBtn) return;

        // Check if already processed (defensive against React re-renders)
        if (nativeBtn.dataset.fcbReplaced === 'true') {
            // Verify our button still exists
            const ourBtn = header.querySelector('.fcb-code-header');
            if (ourBtn) {
                return; // All good, already set up
            }
            // If our button disappeared but marker is there, React removed it - re-add
        }

        nativeBtn.dataset.fcbReplaced = 'true';

        // Hide native button
        nativeBtn.style.display = 'none';

        // Create our button
        const iconSize = 16;
        const btn = document.createElement('div');
        btn.className = 'fcb-code-header';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('draggable', 'true');
        btn.setAttribute('data-fcb-header-btn', 'true'); // Mark as ours
        btn.innerHTML = `
            <svg class="icon icon-copy" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            <svg class="icon icon-check" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"></path>
            </svg>
        `;
        header.appendChild(btn);

        // Reuse the same drag/click handler as floating buttons
        const data = {
            btn,
            type: 'code-header',
            getContent: () => getCodeContent(block),
            getDragContent: () => getCodeContent(block)
        };

        setupDragAndClick(btn, data);
    }

    function setupMessage(el, isUser) {
        if (buttonMap.has(el)) return;

        const { size, padding, iconSize, offset } = CONFIG.message;
        const msgConfig = isUser ? CONFIG.message.user : CONFIG.message.ai;
        const className = isUser ? 'fcb-user' : 'fcb-ai';

        const target = isUser
            ? el.querySelector('.bg-surface-secondary') || el
            : el.querySelector('.no-scrollbar') || el;

        const btn = createButton(size, iconSize, className);

        const data = {
            btn,
            type: isUser ? 'user' : 'ai',
            target,
            sourceEl: el,
            update: () => positionBeside(btn, target, size, padding, msgConfig.side, offset, el),
            getContent: () => getMessageContent(el, isUser),
            getDragContent: () => getMessageMarkdown(el, isUser),
            getNativeButton: () => findNativeCopyButton(el)
        };

        buttonMap.set(el, data);
        setupDragAndClick(btn, data);
        data.update();
    }

    function setupDragAndClick(btn, data) {
        let dragDidStart = false;

        btn.addEventListener('dragstart', (e) => {
            // Use getDragContent for markdown if available, otherwise plain content
            const content = data.getDragContent ? data.getDragContent() : data.getContent();

            if (!content) {
                e.preventDefault();
                return;
            }

            e.dataTransfer.setData('text/plain', content);
            e.dataTransfer.effectAllowed = 'copyMove';

            // Create drag image
            const dragImage = document.createElement('div');
            dragImage.textContent = `📄 ${content.length > 50 ? content.substring(0, 47) + '...' : content}`;
            dragImage.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                padding: 8px 12px;
                background: rgba(30, 30, 30, 0.95);
                color: #fff;
                border-radius: 6px;
                font-size: 12px;
                font-family: system-ui, sans-serif;
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 99999;
            `;
            document.body.appendChild(dragImage);

            try {
                e.dataTransfer.setDragImage(dragImage, 10, 10);
            } catch (err) {}

            requestAnimationFrame(() => dragImage.remove());

            dragDidStart = true;
            btn.classList.add('dragging');
        });

        btn.addEventListener('dragend', () => {
            btn.classList.remove('dragging');
            setTimeout(() => {
                dragDidStart = false;
            }, 50);
        });

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (dragDidStart) return;

            if (data.type === 'user' || data.type === 'ai') {
                const nativeBtn = data.getNativeButton?.();
                if (nativeBtn) {
                    nativeBtn.click();
                    showCopiedFeedback(btn);
                    return;
                }
            }

            const content = data.getContent();
            if (!content) return;

            try {
                await copyText(content);
                showCopiedFeedback(btn);
            } catch (err) {
                console.error('Copy failed:', err);
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PROCESSING
    // ═══════════════════════════════════════════════════════════════════════

    function processAll() {
        // Code blocks
        document.querySelectorAll('[data-code-block="true"]').forEach(block => {
            setupCodeBlockHeader(block);
            setupCodeColumn(block);
        });

        // Messages
        const ol = document.querySelector('ol.flex-col-reverse');
        if (ol) {
            Array.from(ol.children).forEach(child => {
                if (isAIMessage(child)) setupMessage(child, false);
                else if (isUserMessage(child)) setupMessage(child, true);
            });
        }
    }

    function updateAll() {
        // Update message buttons
        for (const [el, data] of buttonMap) {
            if (!document.body.contains(el)) {
                data.btn.remove();
                buttonMap.delete(el);
            } else {
                data.update();
            }
        }

        // Keep code columns robust across React SPA rerenders:
        // - If the block is gone: cleanup.
        // - If the block exists but React removed our column: rebuild it.
        for (const [block, state] of codeColumnMap) {
            const blockGone = !document.body.contains(block);
            const columnGone = !state?.column || !document.body.contains(state.column) || !state?.container || !state.container.contains(state.column);

            if (blockGone) {
                try { state?.column?.remove?.(); } catch (e) {}
                codeColumnMap.delete(block);
                continue;
            }

            if (columnGone) {
                // React removed our injected node; rebuild immediately.
                codeColumnMap.delete(block);
                setupCodeColumn(block);
                continue;
            }

            // Geometry update (this is what prevents the strip from colliding with the input area)
            updateCodeColumnGeometry(state);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════

    const start = () => {
        injectStyles();
        processAll();
        updateAll();

        // Track pending code blocks that need processing after React settles
        let pendingBlocks = new Set();
        let pendingMessages = new Set();
        let settleTimer = null;

        // Process pending elements after React has settled
        const processPending = () => {
            if (pendingBlocks.size > 0) {
                pendingBlocks.forEach(block => {
                    if (document.body.contains(block)) {
                        setupCodeBlockHeader(block);
                        setupCodeColumn(block);
                    }
                });
                pendingBlocks.clear();
            }

            if (pendingMessages.size > 0) {
                pendingMessages.forEach(({ el, isUser }) => {
                    if (document.body.contains(el)) {
                        setupMessage(el, isUser);
                    }
                });
                pendingMessages.clear();
            }

            updateAll();
        };

        // Debounced processing: wait for React to finish updates
        const scheduleProcessing = () => {
            if (settleTimer) {
                clearTimeout(settleTimer);
            }
            settleTimer = setTimeout(() => {
                (window.requestIdleCallback || setTimeout)(() => {
                    processPending();
                }, { timeout: 500 });
            }, 150); // Wait 150ms for React to settle
        };

        // Mutation observer: detect new content and handle SPA navigation
        const observer = new MutationObserver((mutations) => {
            let newBlockCount = 0;
            let removedBlockCount = 0;

            for (const mutation of mutations) {
                // Detect chat switches: many code blocks removed at once
                for (const node of mutation.removedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    if (node.matches?.('[data-code-block="true"]')) {
                        removedBlockCount++;
                    }
                }

                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    // Count code blocks
                    if (node.matches?.('[data-code-block="true"]')) {
                        newBlockCount++;
                        pendingBlocks.add(node);
                    }

                    // Check if the added node itself is a message (streaming case)
                    // This is the primary path for new messages during an active conversation.
                    if (isAIMessage(node)) {
                        pendingMessages.add({ el: node, isUser: false });
                    } else if (isUserMessage(node)) {
                        pendingMessages.add({ el: node, isUser: true });
                    }

                    // Look for code blocks inside the added node
                    if (node.querySelectorAll) {
                        const blocks = node.querySelectorAll('[data-code-block="true"]');
                        blocks.forEach(block => {
                            newBlockCount++;
                            pendingBlocks.add(block);
                        });

                        // Look for messages inside the added node (e.g., wrapper divs)
                        // This catches cases where a container is added with messages inside.
                        const messagesInside = node.querySelectorAll('.bg-surface-primary, .self-end');
                        messagesInside.forEach(child => {
                            if (isAIMessage(child) && !pendingMessages.has({ el: child, isUser: false })) {
                                pendingMessages.add({ el: child, isUser: false });
                            } else if (isUserMessage(child) && !pendingMessages.has({ el: child, isUser: true })) {
                                pendingMessages.add({ el: child, isUser: true });
                            }
                        });

                        // Look for message container
                        const ol = node.querySelector('ol.flex-col-reverse');
                        if (ol) {
                            Array.from(ol.children).forEach(child => {
                                if (isAIMessage(child)) {
                                    pendingMessages.add({ el: child, isUser: false });
                                } else if (isUserMessage(child)) {
                                    pendingMessages.add({ el: child, isUser: true });
                                }
                            });
                        }
                    }

                    // Detect message container directly
                    if (node.matches?.('ol.flex-col-reverse')) {
                        Array.from(node.children).forEach(child => {
                            if (isAIMessage(child)) {
                                pendingMessages.add({ el: child, isUser: false });
                            } else if (isUserMessage(child)) {
                                pendingMessages.add({ el: child, isUser: true });
                            }
                        });
                    }
                }
            }

            // Detect chat switch: multiple blocks removed and added (SPA navigation)
            if (removedBlockCount >= 2 || newBlockCount >= 3) {
                scheduleProcessing();
            } else if (newBlockCount > 0 || pendingMessages.size > 0) {
                // Single block or message (streaming) - still debounce slightly for safety
                scheduleProcessing();
            }

            // Always cleanup removed elements
            updateAll();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Throttled scroll/resize for icon repositioning
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

        // Watch textarea growth (line breaks) so we never overlap the input area
        bindInputAreaListeners();
        setupInputResizeObserver();
    };

    /**
     * React Stabilization Watcher:
     * Wait for React hydration to complete before initializing.
     * This prevents conflicts with React and other userscripts.
     */
    const initWhenReady = () => {
        const READY_SELECTOR = 'form textarea';

        if (document.querySelector(READY_SELECTOR)) {
            // Already ready, but give React a moment to settle
            setTimeout(() => {
                (window.requestIdleCallback || setTimeout)(() => {
                    start();
                }, { timeout: 1000 });
            }, 200);
            return;
        }

        // Otherwise, observe until the form appears
        const readyObserver = new MutationObserver(() => {
            if (document.querySelector(READY_SELECTOR)) {
                readyObserver.disconnect();
                // Give React 200ms to finish any pending updates
                setTimeout(() => {
                    (window.requestIdleCallback || setTimeout)(() => {
                        start();
                    }, { timeout: 1000 });
                }, 200);
            }
        });

        readyObserver.observe(document.body, { childList: true, subtree: true });
    };

    initWhenReady();
})();
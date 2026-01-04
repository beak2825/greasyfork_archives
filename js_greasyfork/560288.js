// ==UserScript==
// @name         Instagram | Auto-Close/Block "Sign up" / "Log in" Overlay Popup
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      4.16
// @author       Piknockyou
// @license      AGPL-3.0
// @description  Automatically blocks/closes Instagram login/signup overlays — includes mobile-friendly Reels fixes (end-of-video wall, poster/cover overlay, tap behavior, auto-redirect past "Continue on web").
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560288/Instagram%20%7C%20Auto-CloseBlock%20%22Sign%20up%22%20%20%22Log%20in%22%20Overlay%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/560288/Instagram%20%7C%20Auto-CloseBlock%20%22Sign%20up%22%20%20%22Log%20in%22%20Overlay%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== EARLY REDIRECT: Bypass "Continue on web" on mobile reels ==========
    // Instagram mobile reel links require ?l=1 to load the actual content
    try {
        const url = new URL(location.href);
        const isReel = /^\/reel\/[^\/]+\/?$/.test(url.pathname);
        if (isReel && url.searchParams.get('l') !== '1') {
            url.searchParams.set('l', '1');
            location.replace(url.href);
            // Stop script execution - page will reload with correct URL
            return;
        }
    } catch (_) {}

    // ========== SCRIPT INFO ==========
    const SCRIPT_NAME = GM_info.script.name;

    // ========== CONFIGURATION ==========
    const BANNER_MINIMIZED_KEY = 'igblock_banner_minimized';
    const TOOLTIP_SHOWN_KEY = 'igblock_tooltip_shown';
    const SCRIPT_PAUSED_KEY = 'igblock_script_paused';
    const AUTO_RELOAD_DELAY = 1500;
    const ENABLE_DEBUG_LOGGING = false; // Set to true for verbose console logging
    let errorDetected = false;
    let notificationShown = false;
    let bannerMinimized = GM_getValue(BANNER_MINIMIZED_KEY, false);
    let tooltipShown = GM_getValue(TOOLTIP_SHOWN_KEY, false);
    let scriptPaused = GM_getValue(SCRIPT_PAUSED_KEY, false);

// One-time migration: if the user previously minimized the banner (older versions),
// force-show it once after updating (e.g., 4.7 -> 4.10), then never again.
// New installs won't have the minimized key stored, so they keep standard behavior.
    const MIGRATION_RESHOW_BANNER_KEY = 'igblock_migration_reshow_banner_done';

    try {
        if (!GM_getValue(MIGRATION_RESHOW_BANNER_KEY, false)) {
            const MISSING = '__igblock_missing__';
            const storedMin = GM_getValue(BANNER_MINIMIZED_KEY, MISSING);

            // Only force-show for updaters who had actually minimized it before.
            if (storedMin === true) {
                GM_setValue(BANNER_MINIMIZED_KEY, false);
                bannerMinimized = false;
            }

            // Mark done regardless (so it won't re-trigger for new installs either).
            GM_setValue(MIGRATION_RESHOW_BANNER_KEY, true);
        }
    } catch (_) {}

    // Banner UI/text migration:
    // If users update from any version below the current version, show the banner once
    // even if they previously minimized it (so they see the latest info).
    const BANNER_UI_REV_KEY = 'igblock_banner_ui_rev_seen';
    const CURRENT_BANNER_UI_REV = '4.16';

    try {
        const prevRev = GM_getValue(BANNER_UI_REV_KEY, null);
        if (prevRev !== CURRENT_BANNER_UI_REV) {
            const MISSING = '__igblock_missing__';
            const storedMin = GM_getValue(BANNER_MINIMIZED_KEY, MISSING);

            if (storedMin === true) {
                GM_setValue(BANNER_MINIMIZED_KEY, false);
                bannerMinimized = false;
            }

            GM_setValue(BANNER_UI_REV_KEY, CURRENT_BANNER_UI_REV);
        }
    } catch (_) {}

    // Apply paused flag to <html> early so CSS respects paused state before banner loads
    try {
        if (scriptPaused && document.documentElement) {
            document.documentElement.setAttribute('data-igblock-paused', '1');
        }
    } catch (_) {}

    // ========== LAYER 1: CSS ==========
    GM_addStyle(`
        /* Target the dialog with its specific classes */
        html:not([data-igblock-paused="1"]) [role="dialog"].x1ja2u2z.x1afcbsf.x1a2a7pz,

        /* Generic: any dialog with close button containing auth text */
        html:not([data-igblock-paused="1"]) [role="dialog"]:has(svg[aria-label="Close"]):has([href*="/accounts/"]),

        /* The backdrop (role="presentation") */
        html:not([data-igblock-paused="1"]) [role="presentation"].x1ey2m1c.x9f619:empty,

        /* Grey overlay backdrop (logged-out modal backdrop) */
        html:not([data-igblock-paused="1"]) div.x1ey2m1c.xtijo5x.x1o0tod.xixxii4.x13vifvy.x1h0vfkc:empty {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* End-of-video "Sign up to keep watching" overlay */
        html:not([data-igblock-paused="1"]) div[style*="--x-backgroundColor"]:has(h3:is(:lang(en), :lang(de), :lang(fr), :lang(es), :lang(it), :lang(pt), :lang(nl), :lang(pl), :lang(ru), :lang(ja), :lang(ko), :lang(zh))),
        html:not([data-igblock-paused="1"]) div.xpqogu8:has(a[href*="/accounts/signup/"]) {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* Poster/cover image sometimes sits above the <video> (same size as the video).
           We toggle this attribute from JS to ensure the *video* is visible while playing/replaying. */
        html:not([data-igblock-paused="1"]) img[data-igblock-poster-hidden="1"] {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }



        /* Prevent scroll lock (targeted: avoid breaking video/UI interactions) */
        html:not([data-igblock-paused="1"]) html[style*="overflow: hidden"],
        html:not([data-igblock-paused="1"]) body[style*="overflow: hidden"] {
            overflow: auto !important;
        }

        /* Any element we hide via JS (avoid removing React-owned nodes) */
        [data-igblock-hidden="1"] {
            display: none !important;
        }

        /* Notification banner (FB-like) */
        #ig-block-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483647;
            background: #1a1a1a;
            border: 1px solid #333;
            border-left: 3px solid #e94560;
            border-radius: 8px;
            padding: 14px 18px;
            box-sizing: border-box;
            width: auto;
            max-width: calc(100vw - 32px);
            max-height: calc(100vh - 32px);
            max-height: calc(100dvh - 32px);
            overflow: auto;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            animation: igSlideIn 0.18s ease-out;
        }

        @media (max-width: 480px) {
            #ig-block-notification {
                width: calc(100vw - 40px);
                min-width: 80vw;
            }
        }

        @keyframes igSlideIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        #ig-block-notification.hiding {
            animation: igSlideOut 0.14s ease-in forwards;
        }

        @keyframes igSlideOut {
            to { opacity: 0; }
        }

        #ig-block-notification .ig-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
        }

        #ig-block-notification .ig-title-row {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            min-width: 0;
            flex: 1 1 auto;
        }

        #ig-block-notification .ig-icon {
            width: 20px;
            height: 20px;
            flex: 0 0 auto;
            margin-top: 1px;
        }

        #ig-block-notification .ig-title {
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            margin: 0;
            white-space: nowrap;
            line-height: 1.3;
            min-width: 0;
        }

        @media (max-width: 480px) {
            #ig-block-notification .ig-title {
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
            }
        }

        #ig-block-notification .ig-close-x {
            background: none;
            border: none;
            color: #666;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            flex: 0 0 auto;
        }

        #ig-block-notification .ig-close-x:hover {
            color: #fff;
        }

        #ig-block-notification .ig-body {
            color: #a0a0a0;
            font-size: 13px;
            line-height: 1.6;
        }

        #ig-block-notification .ig-body strong {
            color: #ccc;
        }

        #ig-block-notification .ig-status {
            margin-bottom: 10px;
            font-size: 13px;
        }

        #ig-block-notification .ig-status-active {
            color: #4ade80;
        }

        #ig-block-notification .ig-status-paused {
            color: #f87171;
        }

        #ig-block-notification .ig-body ul {
            margin: 8px 0 0 0;
            padding-left: 18px;
            list-style-type: disc;
        }

        #ig-block-notification .ig-body li {
            white-space: nowrap;
            margin-bottom: 4px;
        }

        @media (max-width: 480px) {
            #ig-block-notification .ig-body li {
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
            }
        }

        #ig-block-notification .ig-warning {
            background: rgba(255, 193, 7, 0.12);
            border-left: 3px solid #ffc107;
            padding: 8px 10px;
            margin-bottom: 10px;
            border-radius: 0 4px 4px 0;
            color: #e0c36a;
            font-size: 12px;
            line-height: 1.5;
            white-space: normal;
            overflow-wrap: anywhere;
            word-break: break-word;
            box-sizing: border-box;
            width: 100%;
        }

        /* Minimized button (always visible) */
        #ig-block-notification-min {
            position: fixed;
            left: 16px;
            bottom: 16px;
            z-index: 2147483647;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 999px;
            width: 44px;
            height: 44px;
            padding: 0;
            display: flex !important;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        }

        #ig-block-notification-min .ig-min-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #e94560;
            box-shadow: 0 0 0 4px rgba(233, 69, 96, 0.15);
            transition: background 0.2s, box-shadow 0.2s;
        }

        #ig-block-notification-min.paused .ig-min-dot {
            background: #666;
            box-shadow: 0 0 0 4px rgba(102, 102, 102, 0.15);
        }

        /* Tooltip (first minimize) */
        #ig-block-tooltip {
            position: fixed;
            left: 70px;
            bottom: 20px;
            z-index: 2147483647;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 12px 14px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            max-width: 280px;
            animation: igSlideIn 0.2s ease-out;
        }

        #ig-block-tooltip::before {
            content: '';
            position: absolute;
            left: -8px;
            bottom: 14px;
            border: 8px solid transparent;
            border-right-color: #333;
            border-left: none;
        }

        #ig-block-tooltip::after {
            content: '';
            position: absolute;
            left: -6px;
            bottom: 15px;
            border: 7px solid transparent;
            border-right-color: #1a1a1a;
            border-left: none;
        }

        #ig-block-tooltip .ig-tooltip-text {
            color: #a0a0a0;
            font-size: 12px;
            line-height: 1.5;
            margin-bottom: 10px;
        }

        #ig-block-tooltip .ig-tooltip-text strong {
            color: #ccc;
        }

        #ig-block-tooltip .ig-tooltip-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        #ig-block-tooltip .ig-tooltip-checkbox {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #888;
            font-size: 11px;
            cursor: pointer;
        }

        #ig-block-tooltip .ig-tooltip-checkbox input {
            margin: 0;
            cursor: pointer;
        }

        #ig-block-tooltip .ig-tooltip-ok {
            background: #e94560;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
        }

        #ig-block-tooltip .ig-tooltip-ok:hover {
            background: #d73752;
        }
    `);

    // ========== NOTIFICATION BANNER (FB-like) ==========
    function showNotification() {
        if (notificationShown) return;
        if (!document.body) return;
        notificationShown = true;

        const setPausedDomFlag = () => {
            if (!document.documentElement) return;
            if (scriptPaused) document.documentElement.setAttribute('data-igblock-paused', '1');
            else document.documentElement.removeAttribute('data-igblock-paused');
        };

        // Apply paused flag immediately (so CSS blocking can be disabled when paused)
        setPausedDomFlag();

        const notification = document.createElement('div');
        notification.id = 'ig-block-notification';
        notification.innerHTML = `
            <div class="ig-header">
                <div class="ig-title-row">
                    <svg class="ig-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" stroke="#e94560" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3 class="ig-title">${SCRIPT_NAME}</h3>
                </div>
                <button class="ig-close-x" id="ig-close-x" title="Minimize">&times;</button>
            </div>
            <div class="ig-body">
                <div class="ig-status" id="ig-status-text">
                    <strong class="ig-status-active">✓ Blocker active</strong>
                </div>
                <div class="ig-warning">
                    <strong>⚠️ Limited functionality</strong><br><br>
                    This script auto-closes the "Sign up / Log in" overlay when you open a <strong>direct link</strong> to a post or reel. It does <em>not</em> bypass Instagram's login redirects — browsing profiles, feeds, or clicking posts from profile pages will still require an account.<br><br>
                    <span style="color:#4ade80;font-weight:600;">✓ Works:</span> Direct links only<br>
                    <span style="font-size:11px;color:#888;margin-left:14px;display:inline-block;">instagram.com/<strong>p</strong>/... or instagram.com/<strong>reel</strong>/...</span><br><br>
                    <span style="color:#f87171;font-weight:600;">✗ Won't work:</span><br>
                    <span style="margin-left:14px;display:inline-block;">• Profile pages or search engine links to profiles</span><br>
                    <span style="margin-left:14px;display:inline-block;">• Feeds, Explore, Stories</span><br>
                    <span style="margin-left:14px;display:inline-block;">• Posts opened from a profile page</span><br>
                    <span style="margin-left:14px;display:inline-block;">• Likes, comments, follows, etc.</span>
                </div>
            </div>
        `;

        const minimized = document.createElement('div');
        minimized.id = 'ig-block-notification-min';
        minimized.setAttribute('role', 'button');
        minimized.setAttribute('tabindex', '0');
        minimized.setAttribute('aria-label', `${SCRIPT_NAME} — Expand`);
        minimized.innerHTML = `<span class="ig-min-dot" aria-hidden="true"></span>`;

        const updatePausedState = () => {
            const statusEl = document.getElementById('ig-status-text');
            if (scriptPaused) {
                minimized.classList.add('paused');
                minimized.title = `${SCRIPT_NAME} — PAUSED (tap to expand, hold to resume)`;
                if (statusEl) statusEl.innerHTML = '<strong class="ig-status-paused">✗ Blocker paused</strong>';
            } else {
                minimized.classList.remove('paused');
                minimized.title = `${SCRIPT_NAME} — Active (tap to expand, hold to pause)`;
                if (statusEl) statusEl.innerHTML = '<strong class="ig-status-active">✓ Blocker active</strong>';
            }
            setPausedDomFlag();
        };

        const syncNotificationWidthToHeader = () => {
            // Skip if banner is hidden (measurement would return 0)
            if (bannerMinimized) return;

            const bodyEl = notification.querySelector('.ig-body');
            if (!bodyEl) return;

            // Temporarily hide body to measure header-only width
            bodyEl.hidden = true;
            notification.style.width = 'max-content';
            notification.style.minWidth = '0';

            const measuredW = notification.getBoundingClientRect().width;
            const viewportW = window.innerWidth || document.documentElement?.clientWidth || 0;
            const maxW = viewportW > 32 ? viewportW - 32 : measuredW;

            notification.style.width = `${Math.min(Math.ceil(measuredW), maxW)}px`;
            bodyEl.hidden = false;
        };

        const applyBannerState = () => {
            notification.classList.remove('hiding');
            // Set display FIRST so measurement works correctly
            notification.style.display = bannerMinimized ? 'none' : '';
            // Button always visible (same as FB)
            minimized.style.display = '';
            updatePausedState();
            // Sync width AFTER display is set (use rAF to ensure layout is computed)
            if (!bannerMinimized) {
                requestAnimationFrame(() => syncNotificationWidthToHeader());
            }
        };

        const showPauseTooltip = () => {
            if (document.getElementById('ig-block-tooltip')) return;

            const tooltip = document.createElement('div');
            tooltip.id = 'ig-block-tooltip';
            tooltip.innerHTML = `
                <div class="ig-tooltip-text">
                    <strong>Tip:</strong> To <strong>pause</strong> or <strong>resume</strong> this script, <strong>hold</strong> the button for 1 second (long-press on mobile, or hold click on desktop).
                    <br><br>
                    🔴 Pink = Active &nbsp;&nbsp; ⚫ Gray = Paused
                </div>
                <div class="ig-tooltip-actions">
                    <label class="ig-tooltip-checkbox">
                        <input type="checkbox" id="ig-tooltip-dontshow">
                        Don't show again
                    </label>
                    <button class="ig-tooltip-ok" id="ig-tooltip-ok">Got it</button>
                </div>
            `;

            document.body.appendChild(tooltip);

            document.getElementById('ig-tooltip-ok').addEventListener('click', () => {
                const dontShow = document.getElementById('ig-tooltip-dontshow').checked;
                if (dontShow) {
                    tooltipShown = true;
                    GM_setValue(TOOLTIP_SHOWN_KEY, true);
                }
                tooltip.remove();
            });
        };

        const setMinimized = (v, showTooltipIfFirst = false) => {
            bannerMinimized = v;
            GM_setValue(BANNER_MINIMIZED_KEY, v);
            applyBannerState();

            if (v && showTooltipIfFirst && !tooltipShown) {
                showPauseTooltip();
            }
        };

        const minimize = () => {
            notification.classList.add('hiding');
            setTimeout(() => setMinimized(true, true), 200);
        };

        document.body.appendChild(notification);
        document.body.appendChild(minimized);

        // Recalculate width on resize/orientation changes
        window.addEventListener('resize', syncNotificationWidthToHeader);

        // Close button minimizes
        document.getElementById('ig-close-x').addEventListener('click', minimize);

        // Long-press on minimized button toggles pause/resume
        let pressTimer = null;
        let pressStarted = false;
        let lastTouchTime = 0;
        const LONG_PRESS_MS = 1000;
        const TOUCH_GHOST_DELAY = 500; // Ignore mouse events within this time after touch

        const handlePressStart = (e) => {
            // Ignore synthetic mouse events that follow touch (ghost click prevention)
            if (e.type === 'mousedown' && Date.now() - lastTouchTime < TOUCH_GHOST_DELAY) {
                return;
            }
            if (e.type === 'touchstart') {
                lastTouchTime = Date.now();
            }

            pressStarted = true;
            pressTimer = setTimeout(() => {
                if (!pressStarted) return;
                scriptPaused = !scriptPaused;
                GM_setValue(SCRIPT_PAUSED_KEY, scriptPaused);
                updatePausedState();
                pressStarted = false;
            }, LONG_PRESS_MS);
        };

        const handlePressEnd = (e) => {
            // Ignore synthetic mouse events that follow touch
            if (e.type === 'mouseup' && Date.now() - lastTouchTime < TOUCH_GHOST_DELAY) {
                return;
            }

            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }

            // Short press toggles banner visibility (open/close)
            if (pressStarted) {
                pressStarted = false;
                if (bannerMinimized) {
                    setMinimized(false);
                } else {
                    minimize(); // Use minimize() for proper fade-out animation
                }
            }
        };

        const handlePressCancel = () => {
            pressStarted = false;
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        };

        // Mouse events (desktop)
        minimized.addEventListener('mousedown', handlePressStart);
        minimized.addEventListener('mouseup', handlePressEnd);
        minimized.addEventListener('mouseleave', handlePressCancel);

        // Touch events (mobile)
        minimized.addEventListener('touchstart', handlePressStart, { passive: true });
        minimized.addEventListener('touchend', handlePressEnd);
        minimized.addEventListener('touchcancel', handlePressCancel);

        // Keyboard
        minimized.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMinimized(false);
            }
        });

        applyBannerState();
    }

    // ========== VIDEO TAP FIX (replay + mute + keep video visible) ==========
    const dbg = (...args) => ENABLE_DEBUG_LOGGING && console.log('%c[IG-Video]', 'color: #00ff00; font-weight: bold;', ...args);

    const rectOverlaps = (a, b) => !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);

    // Hide/show the big "poster" IMG that can cover the <video>
    const syncPosterForVideo = (video, forceHide = false) => {
        if (!(video instanceof HTMLVideoElement)) return;

        const vr = video.getBoundingClientRect();
        if (vr.width < 50 || vr.height < 50) return;

        // When playing/replaying we want the video visible (poster hidden).
        const shouldHide = forceHide || (!video.paused && !video.ended && video.readyState >= 2);

        // Search nearby (parent is usually enough on reels)
        const scope = video.parentElement || document;
        const imgs = scope.querySelectorAll('img.x15mokao');

        imgs.forEach(img => {
            const ir = img.getBoundingClientRect();
            if (ir.width < vr.width * 0.8 || ir.height < vr.height * 0.8) return;
            if (!rectOverlaps(ir, vr)) return;

            if (shouldHide) {
                img.setAttribute('data-igblock-poster-hidden', '1');
            } else {
                img.removeAttribute('data-igblock-poster-hidden');
            }
        });
    };

    // IG tends to re-apply the poster overlay; keep it suppressed while playing
    setInterval(() => {
        document.querySelectorAll('video').forEach(v => {
            const r = v.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) syncPosterForVideo(v, false);
        });
    }, 450);

    document.addEventListener('click', (ev) => {
        if (scriptPaused) return;

        dbg('=== CLICK ===', { x: ev.clientX, y: ev.clientY });
        dbg('Target:', ev.target?.tagName, ev.target?.className?.toString?.()?.slice(0, 60));

        try {
            if (ev.defaultPrevented) {
                dbg('❌ STOP: defaultPrevented');
                return;
            }
            if (ev.button !== 0) {
                dbg('❌ STOP: not left click');
                return;
            }
            if (ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey) {
                dbg('❌ STOP: modifier key');
                return;
            }

            const targetEl = ev.target instanceof Element ? ev.target : null;
            if (!targetEl) {
                dbg('❌ STOP: no targetEl');
                return;
            }

            // Check 1: closest() for interactive elements
            // NOTE: We deliberately SKIP [role="button"] here because Instagram wraps videos in <div role="button">.
            // Real buttons (volume, scrubber) are caught by the composedPath check below.
            const closestInteractive = targetEl.closest('a[href], button, input, textarea, select');
            dbg('closest() interactive:', closestInteractive?.tagName, closestInteractive?.getAttribute?.('role'));
            if (closestInteractive) {
                dbg('❌ STOP: closest() found interactive element (a/button/input)');
                return;
            }

            // Check 2: composedPath for buttons
            const path = ev.composedPath ? ev.composedPath() : [];
            dbg('composedPath length:', path.length);

            let blockingElement = null;
            let ignoredRoleButton = null;

            const hasButtonInPath = path.some(n => {
                if (!(n instanceof Element)) return false;
                const tag = n.tagName?.toUpperCase();
                const role = n.getAttribute?.('role');

                // Hard blockers: real clickable controls
                if (tag === 'BUTTON') {
                    blockingElement = { tag, role, class: n.className?.toString?.()?.slice(0, 40) };
                    return true;
                }

                // Only treat real links as blockers
                if (tag === 'A' && n.getAttribute?.('href')) {
                    blockingElement = { tag, role, class: n.className?.toString?.()?.slice(0, 40) };
                    return true;
                }

                // Instagram wraps the whole video area in <div role="button">.
                // DO NOT treat that as a blocker if it contains a <video>.
                if (role === 'button') {
                    const containsVideo = !!n.querySelector?.('video');
                    if (containsVideo) {
                        ignoredRoleButton = { tag, role, class: n.className?.toString?.()?.slice(0, 40) };
                        return false;
                    }
                    blockingElement = { tag, role, class: n.className?.toString?.()?.slice(0, 40) };
                    return true;
                }

                return false;
            });

            dbg('hasButtonInPath:', hasButtonInPath, blockingElement, { ignoredRoleButton });
            if (hasButtonInPath) {
                dbg('❌ STOP: button/link in composedPath (hard blocker)');
                return;
            }

            // Find video - Strategy 1: composedPath
            let video = null;
            let foundVia = null;

            video = path.find(n => n instanceof HTMLVideoElement);
            if (video) foundVia = 'composedPath';
            dbg('Strategy 1 (composedPath):', !!video);

            // Strategy 2: container search
            if (!video) {
                const container = targetEl.closest('article, [role="dialog"], [role="presentation"], div[style*="padding-bottom"]');
                dbg('Strategy 2 container:', container?.tagName, container?.getAttribute?.('role'));
                if (container) {
                    video = container.querySelector('video');
                    if (video) foundVia = 'container';
                }
                dbg('Strategy 2 (container):', !!video);
            }

            // Strategy 3: DOM walk
            if (!video) {
                let parent = targetEl.parentElement;
                for (let i = 0; i < 15 && parent && !video; i++) {
                    video = parent.querySelector('video');
                    if (video) foundVia = `DOM-walk-${i}`;
                    parent = parent.parentElement;
                }
                dbg('Strategy 3 (DOM walk):', !!video);
            }

            // Strategy 4: global coordinate search
            if (!video) {
                const allVideos = document.querySelectorAll('video');
                dbg('Strategy 4: total videos on page:', allVideos.length);
                for (const v of allVideos) {
                    const rect = v.getBoundingClientRect();
                    if (rect.width <= 0 || rect.height <= 0) continue;
                    const clickInVideo = (
                        ev.clientX >= rect.left &&
                        ev.clientX <= rect.right &&
                        ev.clientY >= rect.top &&
                        ev.clientY <= rect.bottom
                    );
                    if (clickInVideo) {
                        video = v;
                        foundVia = 'global-coords';
                        break;
                    }
                }
                dbg('Strategy 4 (global):', !!video);
            }

            if (!video) {
                dbg('❌ STOP: no video found');
                return;
            }

            dbg('✅ Video found via:', foundVia);
            dbg('Video paused:', video.paused, 'readyState:', video.readyState);

            // Bounds check
            const rect = video.getBoundingClientRect();
            dbg('Video rect:', { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom });
            const inBounds = (
                ev.clientX >= rect.left &&
                ev.clientX <= rect.right &&
                ev.clientY >= rect.top &&
                ev.clientY <= rect.bottom
            );
            dbg('Click in bounds:', inBounds);

            if (!inBounds) {
                dbg('❌ STOP: click outside video bounds');
                return;
            }

            // Keep poster images from visually covering the <video> while it is playing/replaying
            syncPosterForVideo(video, false);

            const nearEnd = Number.isFinite(video.duration) && video.duration > 0
                ? (video.currentTime >= (video.duration - 0.05))
                : false;

            // Desired tap behavior on mobile reels:
            // - ended/near-end: restart from 0 and play
            // - paused: play
            // - playing: toggle mute/unmute (do not rely on IG overlay handlers)
            if (video.ended || nearEnd) {
                dbg('🔄 Replay: resetting to 0 and playing...');
                syncPosterForVideo(video, true);

                try { video.currentTime = 0; } catch (_) {}

                video.play()
                    .then(() => dbg('▶️ play() OK (replay)'))
                    .catch(e => dbg('❌ play() error:', e.message));

                ev.preventDefault();
                ev.stopPropagation();
                if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
                dbg('✅ SUCCESS (replay)');
            } else if (video.paused) {
                dbg('▶️ Play (was paused)...');
                syncPosterForVideo(video, true);

                video.play()
                    .then(() => dbg('▶️ play() OK'))
                    .catch(e => dbg('❌ play() error:', e.message));

                ev.preventDefault();
                ev.stopPropagation();
                if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
                dbg('✅ SUCCESS (play)');
            } else {
                // Playing -> toggle mute
                const nextMuted = !video.muted;
                video.muted = nextMuted;

                // If we unmute but volume is 0, restore to 1
                if (!nextMuted && (!Number.isFinite(video.volume) || video.volume === 0)) {
                    video.volume = 1;
                }

                dbg(nextMuted ? '🔇 Muted' : '🔊 Unmuted');

                // Prevent other IG click behaviors (keeps it consistent on mobile)
                ev.preventDefault();
                ev.stopPropagation();
                if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
                dbg('✅ SUCCESS (mute toggle)');
            }

        } catch (err) {
            dbg('❌ EXCEPTION:', err.message);
        }
    }, true);

    // ========== ERROR DETECTION & AUTO-RELOAD ==========
    function checkForError() {
        const errorSvg = document.querySelector('svg[aria-label="Error"]');
        if (errorSvg) {
            const parentText = errorSvg.closest('div')?.textContent || '';
            if (parentText.includes('Something went wrong') || parentText.includes('could not be loaded')) {
                return true;
            }
        }

        const h3Elements = document.querySelectorAll('h3');
        for (const h3 of h3Elements) {
            if (h3.textContent.includes('Something went wrong')) {
                return true;
            }
        }

        return false;
    }

    function handleError() {
        if (errorDetected) return;
        errorDetected = true;

        console.log('[IG-Block] Error detected, reloading...');

        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9); color: white; padding: 16px 24px;
            border-radius: 8px; z-index: 999999; font-family: system-ui, sans-serif;
            font-size: 13px; text-align: center;
        `;
        msg.innerHTML = `🔄 Error detected — Reloading...`;
        document.body?.appendChild(msg);

        setTimeout(() => location.reload(), AUTO_RELOAD_DELAY);
    }

    // ========== LAYER 2: DOM Removal ==========
    const removeOverlay = () => {
        if (scriptPaused) return;

        const hideEl = (el) => {
            if (!el) return;
            if (el.getAttribute('data-igblock-hidden') === '1') return;
            el.setAttribute('data-igblock-hidden', '1');
        };

        // Prefer clicking "Close" (lets React clean up). If that fails, hide instead.
        document.querySelectorAll('[role="dialog"]').forEach(dialog => {
            const closeSvg = dialog.querySelector('svg[aria-label="Close"]');
            if (!closeSvg) return;

            const text = (dialog.textContent || '').toLowerCase();
            const isAuth = (
                text.includes('sign up') ||
                text.includes('log in') ||
                text.includes('stay in the loop') ||
                text.includes('never miss a post')
            );

            if (!isAuth) return;

            const closeBtn = closeSvg.closest('[role="button"], button');
            if (closeBtn) {
                closeBtn.click();
            } else {
                hideEl(dialog);
            }
        });

        // End-of-video "Sign up to keep watching" overlay
        document.querySelectorAll('div[style*="--x-backgroundColor"]').forEach(el => {
            if (el.getAttribute('data-igblock-hidden') === '1') return;

            const text = (el.textContent || '').toLowerCase();
            const hasSignUpText = text.includes('sign up to keep watching') ||
                                  text.includes('sign up for instagram') ||
                                  text.includes('anmelden, um weiterzuschauen') || // German
                                  text.includes('inscrivez-vous pour continuer') || // French
                                  text.includes('regístrate para seguir viendo'); // Spanish

            const hasSignUpLink = el.querySelector('a[href*="/accounts/signup/"]');

            if (hasSignUpText || hasSignUpLink) {
                hideEl(el);
            }
        });



        // Only hide known/likely backdrops (do NOT delete generic role="presentation" nodes).
        document.querySelectorAll('[role="presentation"].x1ey2m1c.x9f619').forEach(el => {
            if (el.children.length !== 0) return;
            if ((el.textContent || '').trim()) return;

            const cs = getComputedStyle(el);
            if (cs.position !== 'fixed') return;

            const bg = cs.backgroundColor || '';
            if (!bg.includes('rgba(12, 16, 20') && !bg.includes('rgb(12, 16, 20)')) return;

            hideEl(el);
        });

        // Grey overlay backdrop (hide, don't remove) to avoid breaking React/video click handlers
        document.querySelectorAll('.x1ey2m1c.xtijo5x.x1o0tod.xixxii4.x13vifvy.x1h0vfkc').forEach(el => {
            if (el.children.length !== 0) return;
            if ((el.textContent || '').trim()) return;

            const bg = getComputedStyle(el).backgroundColor || '';
            const looksLikeBackdrop =
                bg === 'rgba(12, 16, 20, 0.7)' ||
                bg === 'rgb(12, 16, 20)' ||
                bg.startsWith('rgba(12, 16, 20,');

            if (!looksLikeBackdrop) return;

            hideEl(el);
        });

        if (checkForError()) handleError();
    };

    // ========== LAYER 3: Observer ==========
    const observer = new MutationObserver(() => {
        if (scriptPaused) return;
        removeOverlay();
        if (checkForError()) handleError();
    });

    const startObserving = () => {
        observer.observe(document.documentElement, { childList: true, subtree: true });
    };

    if (document.documentElement) {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }

    // ========== INIT ==========
    removeOverlay();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(showNotification, 800));
    } else {
        setTimeout(showNotification, 800);
    }

    setInterval(() => {
        if (scriptPaused) return;
        if (checkForError()) handleError();
    }, 2000);

    console.log(`[IG-Block] ${SCRIPT_NAME} active`);
})();
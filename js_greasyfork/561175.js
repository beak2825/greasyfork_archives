// ==UserScript==
// @name         Facebook | Auto-Close/Block "Log in" / "Sign up" Overlay Popup
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.6.4
// @author       Piknockyou
// @license      AGPL-3.0
// @description  Auto-closes/blocks Facebook “Log in” / “Sign up” overlays and sticky footer bars (desktop + m.facebook.com), escapes forced /login/ redirects, and auto-reloads common error pages. Includes pause/resume button.interruptions.
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @match        https://web.facebook.com/*
// @match        https://m.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561175/Facebook%20%7C%20Auto-CloseBlock%20%22Log%20in%22%20%20%22Sign%20up%22%20Overlay%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/561175/Facebook%20%7C%20Auto-CloseBlock%20%22Log%20in%22%20%20%22Sign%20up%22%20Overlay%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== SCRIPT INFO ==========
    const SCRIPT_NAME = GM_info.script.name;

    // ========== CONFIGURATION ==========
    const BANNER_MINIMIZED_KEY = 'fbblock_banner_minimized';
    const TOOLTIP_SHOWN_KEY = 'fbblock_tooltip_shown';
    const SCRIPT_PAUSED_KEY = 'fbblock_script_paused';
    const ENABLE_DEBUG_LOGGING = false;
    let notificationShown = false;
    let bannerMinimized = GM_getValue(BANNER_MINIMIZED_KEY, false);
    let tooltipShown = GM_getValue(TOOLTIP_SHOWN_KEY, false);
    let scriptPaused = GM_getValue(SCRIPT_PAUSED_KEY, false);

    // Hard-gate detection: auth dialog with login form but NO close button
    // This triggers a forced redirect to /login/ in ~1-2 seconds
    // Solution: auto-reload INSTANTLY to escape
    const HARD_GATE_AUTO_RELOAD = true;
    const HARD_GATE_RELOAD_DELAY_MS = 0; // instant
    let hardGateHandled = false; // prevent multiple reloads

    // Continuously track the last "good" URL (not a login page)
    const LAST_GOOD_URL_KEY = 'fbblock_last_good_url';
    const LAST_GOOD_URL_TS_KEY = 'fbblock_last_good_url_ts';

    const isLoginPage = (url) => {
        try {
            const u = new URL(url || location.href, location.origin);
            return /^\/(login|checkpoint|recover)/i.test(u.pathname);
        } catch (_) {
            return /\/(login|checkpoint|recover)/i.test(String(url || ''));
        }
    };

    const storeLastGoodUrl = () => {
        if (isLoginPage(location.href)) return;
        try {
            sessionStorage.setItem(LAST_GOOD_URL_KEY, location.href);
            sessionStorage.setItem(LAST_GOOD_URL_TS_KEY, String(Date.now()));
        } catch (_) {}
    };

    const getLastGoodUrl = () => {
        try {
            return sessionStorage.getItem(LAST_GOOD_URL_KEY) || '';
        } catch (_) {
            return '';
        }
    };

    const getLastGoodUrlAge = () => {
        try {
            const ts = Number(sessionStorage.getItem(LAST_GOOD_URL_TS_KEY) || '0');
            return ts > 0 ? (Date.now() - ts) : Infinity;
        } catch (_) {
            return Infinity;
        }
    };

    // Store good URL on every mutation (keeps it fresh)
    // Also store immediately on script init
    storeLastGoodUrl();

    // ========== LOGGING ==========
    const dbg = (...args) => ENABLE_DEBUG_LOGGING && console.log('%c[FB-Block]', 'color: #1877f2; font-weight: bold;', ...args);

    // ========== LAYER 1: CSS ==========
    GM_addStyle(`
        /* Auth dialogs - hide via attribute we set */
        [data-fbblock-hidden="1"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* Notification banner */
        #fb-block-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483647;
            background: #1a1a1a;
            border: 1px solid #333;
            border-left: 3px solid #1877f2;
            border-radius: 8px;
            padding: 14px 18px;
            box-sizing: border-box;
            width: auto;
            max-width: calc(100vw - 32px);
            max-height: calc(100vh - 32px);
            max-height: calc(100dvh - 32px);
            overflow: auto;
            overscroll-behavior: contain;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            animation: fbSlideIn 0.18s ease-out;
        }

        @media (max-width: 480px) {
            #fb-block-notification {
                width: calc(100vw - 40px);
                min-width: 80vw;
            }
        }

        @keyframes fbSlideIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        #fb-block-notification.hiding {
            animation: fbSlideOut 0.14s ease-in forwards;
        }

        @keyframes fbSlideOut {
            to { opacity: 0; }
        }

        #fb-block-notification .fb-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
        }

        #fb-block-notification .fb-title-row {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            min-width: 0;
            flex: 1 1 auto;
        }

        #fb-block-notification .fb-icon {
            width: 20px;
            height: 20px;
            flex: 0 0 auto;
            margin-top: 1px;
        }

        #fb-block-notification .fb-title {
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            margin: 0;
            white-space: nowrap;
            line-height: 1.3;
            min-width: 0;
        }

        @media (max-width: 480px) {
            #fb-block-notification .fb-title {
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
            }
        }

        #fb-block-notification .fb-close-x {
            background: none;
            border: none;
            color: #666;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            flex: 0 0 auto;
        }

        #fb-block-notification .fb-close-x:hover {
            color: #fff;
        }

        #fb-block-notification .fb-body {
            color: #a0a0a0;
            font-size: 13px;
            line-height: 1.6;
        }

        #fb-block-notification .fb-body strong {
            color: #ccc;
        }

        #fb-block-notification .fb-status {
            margin-bottom: 10px;
            font-size: 13px;
        }

        #fb-block-notification .fb-status-active {
            color: #4ade80;
        }

        #fb-block-notification .fb-status-paused {
            color: #f87171;
        }

        #fb-block-notification .fb-warning {
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
            max-width: 400px;
        }

        @media (max-width: 480px) {
            #fb-block-notification .fb-warning {
                max-width: 100%;
            }
        }

        #fb-block-notification .fb-body ul {
            margin: 8px 0 0 0;
            padding-left: 18px;
            list-style-type: disc;
        }

        #fb-block-notification .fb-body li {
            white-space: nowrap;
            margin-bottom: 4px;
        }

        @media (max-width: 480px) {
            #fb-block-notification .fb-body li {
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
            }
        }

        /* Minimized banner - always visible */
        #fb-block-notification-min {
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

        #fb-block-notification-min .fb-min-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #1877f2;
            box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.15);
            transition: background 0.2s, box-shadow 0.2s;
        }

        #fb-block-notification-min.paused .fb-min-dot {
            background: #666;
            box-shadow: 0 0 0 4px rgba(102, 102, 102, 0.15);
        }

        /* Tooltip for first-time minimize */
        #fb-block-tooltip {
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
            animation: fbSlideIn 0.2s ease-out;
        }

        #fb-block-tooltip::before {
            content: '';
            position: absolute;
            left: -8px;
            bottom: 14px;
            border: 8px solid transparent;
            border-right-color: #333;
            border-left: none;
        }

        #fb-block-tooltip::after {
            content: '';
            position: absolute;
            left: -6px;
            bottom: 15px;
            border: 7px solid transparent;
            border-right-color: #1a1a1a;
            border-left: none;
        }

        #fb-block-tooltip .fb-tooltip-text {
            color: #a0a0a0;
            font-size: 12px;
            line-height: 1.5;
            margin-bottom: 10px;
        }

        #fb-block-tooltip .fb-tooltip-text strong {
            color: #ccc;
        }

        #fb-block-tooltip .fb-tooltip-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        #fb-block-tooltip .fb-tooltip-checkbox {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #888;
            font-size: 11px;
            cursor: pointer;
        }

        #fb-block-tooltip .fb-tooltip-checkbox input {
            margin: 0;
            cursor: pointer;
        }

        #fb-block-tooltip .fb-tooltip-ok {
            background: #1877f2;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
        }

        #fb-block-tooltip .fb-tooltip-ok:hover {
            background: #1565c0;
        }
    `);

    // ========== AUTH DETECTION ==========
    const AUTH_KEYWORDS = [
        'log in', 'login', 'sign up', 'signup',
        'create account', 'create new account',
        'join facebook', 'see more on facebook',
        'email or phone', 'password',
        'forgot password', 'forgotten password',
        "don't have an account",
    ];

    // Mobile-specific auth keywords (MContainer overlays on m.facebook.com)
    const MOBILE_AUTH_KEYWORDS = [
        'continue as',
        'log into another account',
        'log in to connect',
    ];

    const isAuthDialog = (el) => {
        if (!el) return false;
        const text = (el.textContent || '').toLowerCase();

        // Mobile-specific keywords: single match is sufficient (high confidence)
        for (const kw of MOBILE_AUTH_KEYWORDS) {
            if (text.includes(kw)) {
                dbg('isAuthDialog: mobile keyword match:', kw);
                return true;
            }
        }

        // General keywords: require 2+ matches to avoid false positives
        let matches = 0;
        for (const kw of AUTH_KEYWORDS) {
            if (text.includes(kw)) matches++;
            if (matches >= 2) return true;
        }

        // Also check for the specific login form
        if (el.querySelector('#login_popup_cta_form')) return true;
        return false;
    };

    // Find the auth overlay container starting from a close button (mobile)
    const findMobileAuthContainer = (closeBtn) => {
        let parent = closeBtn;
        for (let i = 0; i < 10 && parent; i++) {
            parent = parent.parentElement;
            if (!parent) break;

            const rect = parent.getBoundingClientRect();
            // Looking for overlay-sized elements (at least 200x200)
            if (rect.width >= 200 && rect.height >= 200) {
                if (isAuthDialog(parent)) {
                    return parent;
                }
            }
        }
        return null;
    };

    // ========== DIALOG HANDLING ==========
    const hideElement = (el) => {
        if (!el) return;
        if (el.getAttribute('data-fbblock-hidden') === '1') return;
        el.setAttribute('data-fbblock-hidden', '1');
        dbg('Hidden element:', el.tagName, el.className?.toString?.()?.slice(0, 60));
    };

    // Check if element is likely the main page container (not safe to hide)
    const isMainContainer = (el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const isFullViewport = rect.width >= window.innerWidth * 0.95 &&
                               rect.height >= window.innerHeight * 0.95;
        if (!isFullViewport) return false;

        const cs = getComputedStyle(el);
        // Main containers typically have position: relative and low/auto zIndex
        // Overlays have position: fixed/absolute and high zIndex
        if (cs.position === 'relative' && (cs.zIndex === 'auto' || cs.zIndex === '0')) {
            return true;
        }
        return false;
    };

    // Find the actual overlay element inside a dialog (for mobile)
    // Mobile FB puts auth content in fixed-position children, not the dialog itself
    const findAuthOverlayInside = (dialog) => {
        // Look for fixed-position containers with auth content
        const candidates = dialog.querySelectorAll('.fixed-container, [class*="fixed"], [data-mcomponent="MContainer"]');

        for (const el of candidates) {
            if (el.getAttribute('data-fbblock-hidden') === '1') continue;

            const cs = getComputedStyle(el);
            const isFixed = cs.position === 'fixed' || cs.position === 'absolute';
            const rect = el.getBoundingClientRect();
            const isSized = rect.width >= 100 && rect.height >= 100;

            if (!isSized) continue;

            const text = (el.textContent || '').toLowerCase();
            const hasAuth = MOBILE_AUTH_KEYWORDS.some(kw => text.includes(kw)) ||
                           AUTH_KEYWORDS.filter(kw => text.includes(kw)).length >= 2;

            if (hasAuth) {
                dbg('Found auth overlay inside dialog:', el.className?.toString?.()?.slice(0, 60));
                return el;
            }
        }

        // Also check direct children with class containing 'fixed' or 'bottom'
        for (const child of dialog.children) {
            const cls = child.className?.toString?.() || '';
            if (cls.includes('fixed') || cls.includes('bottom')) {
                const text = (child.textContent || '').toLowerCase();
                const hasAuth = MOBILE_AUTH_KEYWORDS.some(kw => text.includes(kw));
                if (hasAuth) {
                    dbg('Found auth overlay (fixed/bottom child):', cls.slice(0, 60));
                    return child;
                }
            }
        }

        return null;
    };

    // Restore scroll ability
    const restoreScroll = () => {
        for (const t of [document.body, document.documentElement]) {
            if (!t) continue;
            const s = t.style;
            if (s.overflow === 'hidden') s.overflow = '';
            if (s.position === 'fixed') {
                s.position = '';
                s.top = '';
                s.width = '';
            }
            s.touchAction = '';
        }
    };

    // ========== ERROR PAGE DETECTION ==========
    // "This page isn't available right now" error with "Reload Page" button
    // Happens when clicking on profiles without proper auth state
    let errorPageReloadTriggered = false;

    const detectErrorPage = () => {
        if (errorPageReloadTriggered) return;

        // Look for the specific error message
        const errorTexts = [
            "this page isn't available right now",
            "this may be because of a technical error",
        ];

        const pageText = (document.body?.textContent || '').toLowerCase();
        const hasError = errorTexts.every(t => pageText.includes(t));

        if (!hasError) return;

        // Confirm by looking for the "Reload Page" button
        const reloadBtn = document.querySelector('[aria-label="Reload Page"]');
        if (!reloadBtn) return;

        dbg('Error page detected, auto-reloading...');
        errorPageReloadTriggered = true;

        // Small delay to let page settle, then reload
        setTimeout(() => location.reload(), 300);
    };

    // ========== LOGIN/SIGNUP FOOTER BAR ==========
    // Fixed footer bar that appears for logged-out users
    // Contains "Log in or sign up for Facebook..." text with Log In / Create account buttons
    // We need to find the SMALLEST container that holds just this footer, not parent containers

    const detectAndHideFooterBar = () => {
        // Strategy: Find the specific footer by looking for its unique text content
        // The footer contains "Log in or sign up for Facebook to connect with friends..."
        // and has both /login/ and /reg/ links

        // First, find the login link
        const loginLinks = document.querySelectorAll('a[href*="/login/"][aria-label="Log In"]');

        for (const loginLink of loginLinks) {
            if (loginLink.closest('[data-fbblock-hidden="1"]')) continue;

            // Walk up to find the smallest container that:
            // 1. Contains both login and reg links
            // 2. Contains the "Log in or sign up" text
            // 3. Is positioned at the bottom of the viewport

            let candidate = loginLink.parentElement;
            let bestMatch = null;

            for (let i = 0; i < 8 && candidate; i++) {
                const hasReg = candidate.querySelector('a[href*="/reg/"]');
                const text = (candidate.textContent || '').toLowerCase();
                const hasAuthText = text.includes('log in or sign up');

                if (hasReg && hasAuthText) {
                    // This could be our footer - check position
                    const rect = candidate.getBoundingClientRect();
                    const isAtBottom = rect.bottom >= window.innerHeight * 0.8;
                    const isReasonableSize = rect.height < 200; // Footer shouldn't be huge

                    if (isAtBottom && isReasonableSize) {
                        bestMatch = candidate;
                        // Don't break - keep looking for smallest valid match
                    }
                }

                candidate = candidate.parentElement;
            }

            if (bestMatch && bestMatch.getAttribute('data-fbblock-hidden') !== '1') {
                dbg('Hiding login/signup footer bar');
                hideElement(bestMatch);
                return;
            }
        }

        // Fallback: Look for Create account link and work from there
        const regLinks = document.querySelectorAll('a[href*="/reg/"][aria-label="Create new account"]');

        for (const regLink of regLinks) {
            if (regLink.closest('[data-fbblock-hidden="1"]')) continue;

            let candidate = regLink.parentElement;

            for (let i = 0; i < 8 && candidate; i++) {
                const hasLogin = candidate.querySelector('a[href*="/login/"]');
                const text = (candidate.textContent || '').toLowerCase();
                const hasAuthText = text.includes('log in or sign up');

                if (hasLogin && hasAuthText) {
                    const rect = candidate.getBoundingClientRect();
                    const isAtBottom = rect.bottom >= window.innerHeight * 0.8;
                    const isReasonableSize = rect.height < 200;

                    if (isAtBottom && isReasonableSize) {
                        dbg('Hiding login/signup footer bar (via reg link)');
                        hideElement(candidate);
                        return;
                    }
                }

                candidate = candidate.parentElement;
            }
        }
    };

    const findCloseButton = (dialog) => {
        // Facebook close button patterns (desktop + mobile)
        const selectors = [
            // Standard close buttons
            '[aria-label="Close"][role="button"]',
            '[aria-label="Close"] [role="button"]',
            '[aria-label*="lose"][role="button"]',
            'div[role="button"] svg[aria-label="Close"]',
            '[role="dialog"] > div:first-child [role="button"]',
            // Mobile MContainer close buttons
            '[data-mcomponent="MContainer"] [aria-label="Close"]',
            'div[aria-label="Close"][tabindex="0"]',
        ];

        for (const sel of selectors) {
            const closeBtn = dialog.querySelector(sel);
            if (closeBtn) {
                // For mobile, the button itself has role="button", don't look for parent
                const btn = closeBtn.getAttribute('role') === 'button'
                    ? closeBtn
                    : (closeBtn.closest('[role="button"]') || closeBtn);
                dbg('findCloseButton: found via selector:', sel);
                return btn;
            }
        }
        return null;
    };

    const tryClickClose = (dialog) => {
        const btn = findCloseButton(dialog);
        if (btn) {
            dbg('Clicking close button:', btn.tagName, btn.className?.toString?.()?.slice(0, 40));

            // Try multiple click methods for mobile compatibility
            btn.click();

            // Also dispatch pointer events (mobile Safari sometimes needs this)
            try {
                btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
                btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
            } catch (_) {}

            // And touch events as fallback
            try {
                btn.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
                btn.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true }));
            } catch (_) {}

            return true;
        }
        return false;
    };

    // Detect "hard gate": auth dialog with login form but NO close button
    // This is the overlay that forces redirect to /login/
    const isHardGate = (dialog) => {
        if (!dialog) return false;
        // Must have the login form
        const hasLoginForm = !!dialog.querySelector('#login_popup_cta_form, form[action*="/login/"]');
        if (!hasLoginForm) return false;
        // Must NOT have a close button
        const hasClose = !!findCloseButton(dialog);
        return !hasClose;
    };

    const handleHardGate = () => {
        if (hardGateHandled) return;
        if (!HARD_GATE_AUTO_RELOAD) return;

        hardGateHandled = true;
        dbg('Hard gate detected (no close button) -> INSTANT reload to escape redirect');

        // INSTANT reload - no delay
        if (HARD_GATE_RELOAD_DELAY_MS <= 0) {
            location.reload();
        } else {
            setTimeout(() => location.reload(), HARD_GATE_RELOAD_DELAY_MS);
        }
    };

    // On page load, check if we landed on /login/ and should return
    const maybeReturnFromLogin = () => {
        if (!isLoginPage(location.href)) return;

        try {
            const lastGood = getLastGoodUrl();
            const age = getLastGoodUrlAge();

            // Only return if we have a recent good URL (within 2 minutes)
            if (!lastGood || age > 120000) {
                dbg('On login page but no recent good URL to return to');
                return;
            }

            // Don't return to another login page
            if (isLoginPage(lastGood)) {
                dbg('Last good URL is also a login page, not returning');
                return;
            }

            dbg('Landed on login page -> returning to:', lastGood);

            // Use replace to avoid back-button loop
            location.replace(lastGood);
        } catch (e) {
            dbg('Error in maybeReturnFromLogin:', e);
        }
    };

    // Run IMMEDIATELY on login pages (before DOM even loads)
    maybeReturnFromLogin();

    const processDialogs = () => {
        const dialogs = document.querySelectorAll('[role="dialog"], [aria-modal="true"]');

        for (const dialog of dialogs) {
            if (dialog.getAttribute('data-fbblock-hidden') === '1') continue;

            const isAuth = isAuthDialog(dialog);
            dbg('Checking dialog, isAuth:', isAuth, 'text:', dialog.textContent?.slice(0, 80));

            if (!isAuth) continue;

            dbg('Found auth dialog:', dialog.textContent?.slice(0, 100));

            // Check for hard gate FIRST (no close button + has login form)
            // This must trigger reload INSTANTLY before FB redirects us
            if (isHardGate(dialog)) {
                dbg('HARD GATE detected (login form, no close button) -> instant reload');
                hideElement(dialog);
                handleHardGate();
                return; // stop processing, we're reloading
            }

            // Check if this dialog is the main page container (mobile FB does this)
            if (isMainContainer(dialog)) {
                dbg('Dialog is main container, looking for overlay inside');

                // Find the actual auth overlay inside
                const authOverlay = findAuthOverlayInside(dialog);
                if (authOverlay) {
                    hideElement(authOverlay);
                    restoreScroll();
                }

                // Still try to click close
                tryClickClose(dialog);
                continue;
            }

            // Desktop-style: hide the dialog itself
            hideElement(dialog);
            restoreScroll();

            // ALSO try to click close (helps React state cleanup)
            tryClickClose(dialog);
        }

        // Also look for modal backdrop containers
        // Facebook uses a container with tabindex="-1" that covers the viewport
        const containers = document.querySelectorAll('div[tabindex="-1"]');
        for (const container of containers) {
            if (container.getAttribute('data-fbblock-hidden') === '1') continue;

            // Check if this is a fullscreen modal container
            const rect = container.getBoundingClientRect();
            const isFullscreen = rect.width >= window.innerWidth * 0.9 &&
                                 rect.height >= window.innerHeight * 0.9;

            if (!isFullscreen) continue;

            // Check if it contains an auth dialog
            const hasAuthDialog = container.querySelector('[role="dialog"]') &&
                                  isAuthDialog(container);

            if (hasAuthDialog) {
                // Hide container immediately, then try clicking close for cleanup
                hideElement(container);
                const dialog = container.querySelector('[role="dialog"]');
                if (dialog) {
                    tryClickClose(dialog);
                }
            }
        }
    };

    // ========== MOBILE OVERLAY HANDLING ==========
    // Mobile Facebook (m.facebook.com) uses different overlay structure
    // without role="dialog" - uses data-mcomponent="MContainer" instead
    const processMobileOverlays = () => {
        // Find all close buttons that might be in mobile overlays
        const closeButtons = document.querySelectorAll('[aria-label="Close"][role="button"]');

        for (const btn of closeButtons) {
            // Skip if inside a desktop-style dialog (already handled by processDialogs)
            if (btn.closest('[role="dialog"], [aria-modal="true"]')) continue;

            // Skip if already handled
            if (btn.closest('[data-fbblock-hidden="1"]')) continue;

            const container = findMobileAuthContainer(btn);
            if (!container) continue;

            if (container.getAttribute('data-fbblock-hidden') === '1') continue;

            dbg('Found mobile auth overlay, hiding + clicking close');

            // Hide IMMEDIATELY (no flash), then click for React cleanup
            hideElement(container);
            btn.click();

            // Also dispatch touch/pointer events for mobile
            try {
                btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
                btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
            } catch (_) {}
        }
    };

    // ========== COMBINED PROCESSING ==========
    const processAll = () => {
        if (scriptPaused) return;
        storeLastGoodUrl();
        processDialogs();
        processMobileOverlays();
        detectErrorPage();
        detectAndHideFooterBar();
    };

    // ========== NOTIFICATION BANNER ==========
    function showNotification() {
        if (notificationShown) return;
        if (!document.body) return;
        notificationShown = true;

        const notification = document.createElement('div');
        notification.id = 'fb-block-notification';
        notification.innerHTML = `
            <div class="fb-header">
                <div class="fb-title-row">
                    <svg class="fb-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" stroke="#1877f2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3 class="fb-title">${SCRIPT_NAME}</h3>
                </div>
                <button class="fb-close-x" id="fb-close-x" title="Minimize">&times;</button>
            </div>
            <div class="fb-body">
                <div class="fb-status" id="fb-status-text">
                    <strong class="fb-status-active">✓ Blocker active</strong>
                </div>
                <div class="fb-warning">
                    <strong>⚠️ Mobile limitation:</strong> Infinite scrolling is not possible. After a few videos, Facebook shows "There's more to see" or "Watch more videos" — this cannot be bypassed.
                </div>
                <ul>
                    <li>Login/signup popups and footer bars are blocked.</li>
                    <li>"This page isn't available" errors trigger auto-reload.</li>
                    <li>Overlays without close buttons trigger auto-reload.</li>
                </ul>
            </div>
        `;

        const minimized = document.createElement('div');
        minimized.id = 'fb-block-notification-min';
        minimized.setAttribute('role', 'button');
        minimized.setAttribute('tabindex', '0');
        minimized.setAttribute('aria-label', `${SCRIPT_NAME} — Expand`);
        minimized.title = `${SCRIPT_NAME} — Expand`;
        minimized.innerHTML = `<span class="fb-min-dot" aria-hidden="true"></span>`;

        const updatePausedState = () => {
            const statusEl = document.getElementById('fb-status-text');
            if (scriptPaused) {
                minimized.classList.add('paused');
                minimized.title = `${SCRIPT_NAME} — PAUSED (tap to expand, hold to resume)`;
                if (statusEl) {
                    statusEl.innerHTML = '<strong class="fb-status-paused">✗ Blocker paused</strong>';
                }
            } else {
                minimized.classList.remove('paused');
                minimized.title = `${SCRIPT_NAME} — Active (tap to expand, hold to pause)`;
                if (statusEl) {
                    statusEl.innerHTML = '<strong class="fb-status-active">✓ Blocker active</strong>';
                }
            }
        };

        const applyBannerState = () => {
            notification.classList.remove('hiding');
            notification.style.display = bannerMinimized ? 'none' : '';
            // Button always visible - don't hide it
            minimized.style.display = '';
            updatePausedState();
        };

        const setMinimized = (v, showTooltipIfFirst = false) => {
            bannerMinimized = v;
            GM_setValue(BANNER_MINIMIZED_KEY, v);
            applyBannerState();

            // Show tooltip on first minimize
            if (v && showTooltipIfFirst && !tooltipShown) {
                showPauseTooltip();
            }
        };

        const showPauseTooltip = () => {
            if (document.getElementById('fb-block-tooltip')) return;

            const tooltip = document.createElement('div');
            tooltip.id = 'fb-block-tooltip';
            tooltip.innerHTML = `
                <div class="fb-tooltip-text">
                    <strong>Tip:</strong> To <strong>pause</strong> or <strong>resume</strong> this script, <strong>hold</strong> the button for 1 second (long-press on mobile, or hold click on desktop).
                    <br><br>
                    🔵 Blue = Active &nbsp;&nbsp; ⚫ Gray = Paused
                </div>
                <div class="fb-tooltip-actions">
                    <label class="fb-tooltip-checkbox">
                        <input type="checkbox" id="fb-tooltip-dontshow">
                        Don't show again
                    </label>
                    <button class="fb-tooltip-ok" id="fb-tooltip-ok">Got it</button>
                </div>
            `;

            document.body.appendChild(tooltip);

            document.getElementById('fb-tooltip-ok').addEventListener('click', () => {
                const dontShow = document.getElementById('fb-tooltip-dontshow').checked;
                if (dontShow) {
                    tooltipShown = true;
                    GM_setValue(TOOLTIP_SHOWN_KEY, true);
                }
                tooltip.remove();
            });
        };

        const minimize = () => {
            notification.classList.add('hiding');
            setTimeout(() => setMinimized(true, true), 200);
        };

        document.body.appendChild(notification);
        document.body.appendChild(minimized);

        // Long-press detection for pause/resume
        let pressTimer = null;
        let pressStarted = false;
        const LONG_PRESS_MS = 1000;

        const handlePressStart = () => {
            pressStarted = true;
            pressTimer = setTimeout(() => {
                if (pressStarted) {
                    // Toggle pause state
                    scriptPaused = !scriptPaused;
                    GM_setValue(SCRIPT_PAUSED_KEY, scriptPaused);
                    updatePausedState();
                    dbg('Script', scriptPaused ? 'PAUSED' : 'RESUMED');
                    pressStarted = false;
                }
            }, LONG_PRESS_MS);
        };

        const handlePressEnd = () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }

            // If it was a short press (not long-press), expand the banner
            if (pressStarted) {
                pressStarted = false;
                setMinimized(false);
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

        // Close button
        document.getElementById('fb-close-x').addEventListener('click', minimize);

        applyBannerState();
    }

    // ========== MUTATION OBSERVER ==========
    const observer = new MutationObserver(() => {
        processAll();
    });

    const startObserving = () => {
        observer.observe(document.documentElement, { childList: true, subtree: true });
        processAll(); // Initial scan
    };

    // ========== INITIALIZATION ==========
    // Check for login redirect AGAIN after a tiny delay (in case we missed it)
    setTimeout(maybeReturnFromLogin, 0);
    setTimeout(maybeReturnFromLogin, 50);
    setTimeout(maybeReturnFromLogin, 200);

    if (document.documentElement) {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }

    // Show notification after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(showNotification, 800));
    } else {
        setTimeout(showNotification, 800);
    }

    // Periodic check (backup for edge cases)
    setInterval(processAll, 1500);

    console.log(`[FB-Block] ${SCRIPT_NAME} active`);
})();
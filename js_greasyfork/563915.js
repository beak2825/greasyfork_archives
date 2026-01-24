// ==UserScript==
// @name         Sentinel, Full customisations for kite zerodha
// @namespace    https://x.com/OptmistRational
// @version      1.2
// @description  A compact sidebar manager, notification interceptor, and full-width layout optimizer for Zerodha Kite. menu on bottom left
// @author       OptmistRational (https://x.com/OptmistRational)
// @license      MIT
// @match        https://kite.zerodha.com/*
// @icon         https://kite.zerodha.com/static/images/kite-logo.svg
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563915/Sentinel%2C%20Full%20customisations%20for%20kite%20zerodha.user.js
// @updateURL https://update.greasyfork.org/scripts/563915/Sentinel%2C%20Full%20customisations%20for%20kite%20zerodha.meta.js
// ==/UserScript==

/**
 * DISCLAIMER OF LIABILITY:
 * This script is provided "AS IS" without warranty of any kind. By using this script,
 * you acknowledge that you use it at your own risk. The author (OptmistRational)
 * shall not be held liable for any financial losses, missed trades, execution errors,
 * or platform malfunctions resulting from the use or misuse of this software.
 * Trading involves significant risk; please ensure this script does not interfere
 * with your critical trading activities before using it with real capital.
 */

(function () {
    'use strict';

    /**
     * GLOBAL CONFIGURATION
     */
    const CONFIG = {
        // [LAYER 1] Configuration Signature
        AUTHOR_SIG: 'OptmistRational',
        AUTHOR_URL: 'https://x.com/OptmistRational',

        // Timing
        TIMEOUT_MS: 10000,
        CHECK_INTERVAL_MS: 500,

        // Dimensions
        FAB_SIZE_MAIN: 34,
        FAB_SIZE_ACTION: 32,
        FAB_BOTTOM_OFFSET: '20px',
        FAB_LEFT_OFFSET: '15px',
        FAB_GAP: '8px',
        ICON_SIZE_MAIN: 14,
        ICON_SIZE_ACTION: 13,
        BADGE_SIZE: 32,
        RESIZER_WIDTH: '8px',

        // Visuals
        SVG_VIEWBOX: '0 0 24 24',
        SVG_STROKE_WIDTH: 2.5,
        Z_INDEX_MAX: 2147483647,
        Z_INDEX_LAYER: 900,

        // Colors
        COLOR_PRIMARY: '#3f51b5',
        COLOR_ACCENT: '#333333',
        COLOR_DANGER: '#d32f2f',
        COLOR_WHITE: '#ffffff',
        COLOR_GRAY_LIGHT: '#f5f5f5',
        COLOR_BORDER: '#dddddd',
        COLOR_TEXT_MAIN: '#444444',

        // Selectors
        SEL_WRAPPER: '.container.wrapper',
        SEL_LEFT: '.container-left',
        SEL_RESIZER: '.sidebar-resizer',
        SEL_NOTICES: '.notice, .alert, .toast',
    };

    // State Management
    const state = {
        capturedNotices: new Set(),
        attempts: 0,
        loaderId: null,
        resizingRaf: null
    };

    /**
     * ICON DEFINITIONS
     */
    const ICONS = {
        menu: `<svg viewBox="${CONFIG.SVG_VIEWBOX}" fill="none" stroke="currentColor" stroke-width="${CONFIG.SVG_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
        menuActive: `<svg viewBox="${CONFIG.SVG_VIEWBOX}" fill="none" stroke="currentColor" stroke-width="${CONFIG.SVG_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        sidebar: `<svg viewBox="${CONFIG.SVG_VIEWBOX}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>`,
        fullscreen: `<svg viewBox="${CONFIG.SVG_VIEWBOX}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
        trash: `<svg viewBox="${CONFIG.SVG_VIEWBOX}" fill="none" stroke="${CONFIG.COLOR_DANGER}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        bell: `<svg viewBox="${CONFIG.SVG_VIEWBOX}" fill="none" stroke="currentColor" stroke-width="${CONFIG.SVG_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
        close: `<svg viewBox="${CONFIG.SVG_VIEWBOX}" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    };

    /**
     * INITIALIZATION
     */
    state.loaderId = setInterval(() => {
        const wrapper = document.querySelector(CONFIG.SEL_WRAPPER);
        if (wrapper) {
            clearInterval(state.loaderId);
            initSentinel();
        }
        state.attempts += 1;
        if (state.attempts * CONFIG.CHECK_INTERVAL_MS > CONFIG.TIMEOUT_MS) {
            clearInterval(state.loaderId);
        }
    }, CONFIG.CHECK_INTERVAL_MS);

    function initSentinel() {
        // [LAYER 2] Console Watermark
        console.log(
            `%c Sentinel v1.2 %c by ${CONFIG.AUTHOR_SIG} `,
            `background: ${CONFIG.COLOR_PRIMARY}; color: ${CONFIG.COLOR_WHITE}; border-radius: 3px 0 0 3px; padding: 2px 5px; font-weight: bold;`,
            `background: ${CONFIG.COLOR_ACCENT}; color: ${CONFIG.COLOR_WHITE}; border-radius: 0 3px 3px 0; padding: 2px 5px;`
        );
        console.debug(`[Sentinel] Source: ${CONFIG.AUTHOR_URL}`);

        window._SentinelAuthor = CONFIG.AUTHOR_SIG; // [LAYER 3]

        injectStyles();
        createResizer();
        createFab();
        startNotificationInterceptor();
    }

    /**
     * STYLE INJECTION
     */
    function injectStyles() {
        const style = document.createElement('style');
        // [LAYER 4] CSS Signature
        style.textContent = `
            /*! Sentinel by ${CONFIG.AUTHOR_SIG} */

            /* --- FULL WIDTH INJECTION --- */
            .container.wrapper {
                margin-left: 10px !important;
                margin-right: 10px !important;
                min-width: 100% !important;
                max-width: 100% !important;
            }

            /* Hide Native Notices */
            ${CONFIG.SEL_NOTICES} { display: none !important; }

            /* Resizer */
            .sidebar-resizer {
                position: absolute; top: 0; bottom: 0; width: ${CONFIG.RESIZER_WIDTH};
                cursor: col-resize; z-index: ${CONFIG.Z_INDEX_LAYER}; background: transparent;
            }
            .sidebar-resizer:hover, .sidebar-resizer.resizing { background: ${CONFIG.COLOR_PRIMARY}; opacity: 0.8; }
            .sidebar-resizer.hidden { display: none !important; }

            /* FAB Container */
            .sentinel-fab {
                position: fixed; bottom: ${CONFIG.FAB_BOTTOM_OFFSET}; left: ${CONFIG.FAB_LEFT_OFFSET}; z-index: ${CONFIG.Z_INDEX_MAX};
                display: flex; flex-direction: column-reverse; align-items: center; gap: ${CONFIG.FAB_GAP};
            }

            /* Main Button */
            .sentinel-btn-main {
                width: ${CONFIG.FAB_SIZE_MAIN}px; height: ${CONFIG.FAB_SIZE_MAIN}px;
                background: ${CONFIG.COLOR_PRIMARY}; color: ${CONFIG.COLOR_WHITE};
                border-radius: 50%; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;
            }
            .sentinel-btn-main:hover { filter: brightness(1.1); transform: scale(1.05); }
            .sentinel-btn-main.active { background: ${CONFIG.COLOR_ACCENT} !important; }
            .sentinel-btn-main svg { width: ${CONFIG.ICON_SIZE_MAIN}px !important; height: ${CONFIG.ICON_SIZE_MAIN}px !important; stroke: ${CONFIG.COLOR_WHITE} !important; }

            /* Action Buttons */
            .sentinel-btn-action {
                width: ${CONFIG.FAB_SIZE_ACTION}px; height: ${CONFIG.FAB_SIZE_ACTION}px;
                background: ${CONFIG.COLOR_WHITE}; color: ${CONFIG.COLOR_TEXT_MAIN};
                border-radius: 50%; border: 1px solid ${CONFIG.COLOR_BORDER};
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                cursor: pointer; display: none; align-items: center; justify-content: center; padding: 0;
            }
            .sentinel-btn-action:hover { background: ${CONFIG.COLOR_GRAY_LIGHT} !important; border-color: ${CONFIG.COLOR_PRIMARY}; }
            .sentinel-fab.active .sentinel-btn-action { display: flex !important; }
            .sentinel-btn-action svg { width: ${CONFIG.ICON_SIZE_ACTION}px !important; height: ${CONFIG.ICON_SIZE_ACTION}px !important; stroke: currentColor; }
            .sentinel-btn-action svg[stroke="${CONFIG.COLOR_DANGER}"] { stroke: ${CONFIG.COLOR_DANGER} !important; }

            /* Tooltips */
            .sentinel-btn-action::after {
                content: attr(data-tooltip); position: absolute; left: 38px;
                background: ${CONFIG.COLOR_ACCENT}; color: ${CONFIG.COLOR_WHITE}; padding: 3px 6px;
                border-radius: 3px; font-size: 10px; white-space: nowrap;
                display: none; pointer-events: none;
            }
            .sentinel-btn-action:hover::after { display: block; }

            /* Notification Bell */
            #sentinel-badge {
                position: fixed; top: 60px; right: 25px; z-index: ${CONFIG.Z_INDEX_MAX};
                width: ${CONFIG.BADGE_SIZE}px; height: ${CONFIG.BADGE_SIZE}px;
                background: ${CONFIG.COLOR_WHITE}; border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: none; align-items: center; justify-content: center;
                cursor: pointer; border: 1px solid #eee;
            }
            #sentinel-badge svg { width: 18px !important; height: 18px !important; stroke: #555 !important; }
            #sentinel-badge:hover { background: #f9f9f9; }
            #sentinel-badge.active { display: flex !important; }

            /* Red Counter Badge */
            #sentinel-count {
                position: absolute; top: -2px; right: -2px;
                background: ${CONFIG.COLOR_DANGER}; color: ${CONFIG.COLOR_WHITE};
                font-size: 10px; font-weight: bold;
                height: 16px; min-width: 16px;
                border-radius: 8px; padding: 0 4px;
                display: flex; align-items: center; justify-content: center;
                border: 1px solid ${CONFIG.COLOR_WHITE};
            }

            /* Notification Tray */
            #sentinel-tray {
                position: fixed; top: 100px; right: 20px; width: 280px; max-height: 350px;
                background: #1e1e1e; color: #eee; border-radius: 6px; border: 1px solid #333;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: ${CONFIG.Z_INDEX_MAX};
                display: none; flex-direction: column;
            }
            #sentinel-tray.open { display: flex; }
            .tray-header { padding: 10px; background: #252525; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
            .tray-content { overflow-y: auto; padding-bottom: 5px; }
            .tray-item { padding: 10px; border-bottom: 1px solid #2a2a2a; font-size: 12px; line-height: 1.4; }
            .tray-item a { color: #64b5f6; }
            .tray-close-btn { background: none; border: none; cursor: pointer; padding: 4px; display:flex; }
        `;
        document.head.appendChild(style);
    }

    /**
     * COMPONENT FACTORY
     */
    function createButton(className, iconSvg, tooltip, onClickHandler) {
        const button = document.createElement('button');
        button.className = className;
        button.innerHTML = iconSvg;
        button.setAttribute('data-tooltip', tooltip);
        button.type = 'button';
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            onClickHandler(button);
        });
        return button;
    }

    /**
     * UI BUILDER: FAB
     */
    function createFab() {
        if (document.querySelector('.sentinel-fab')) return;

        const container = document.createElement('div');
        container.className = 'sentinel-fab';
        // [LAYER 5] DOM Attribute Signature
        container.setAttribute('data-author', CONFIG.AUTHOR_SIG);

        const mainBtn = createButton('sentinel-btn-main', ICONS.menu, 'Menu', (btn) => {
            container.classList.toggle('active');
            btn.classList.toggle('active');
            btn.innerHTML = container.classList.contains('active') ? ICONS.menuActive : ICONS.menu;
        });

        const sidebarBtn = createButton('sentinel-btn-action', ICONS.sidebar, 'Toggle Sidebar', toggleSidebar);
        const fullscreenBtn = createButton('sentinel-btn-action', ICONS.fullscreen, 'Fullscreen', toggleFullscreen);

        const trashBtn = createButton('sentinel-btn-action', ICONS.trash, 'Clear Notices', (btn) => {
            clearNotices();
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<span style="color:green; font-weight:bold; font-size:14px;">✓</span>';
            setTimeout(() => { btn.innerHTML = originalIcon; }, 1000);
        });

        container.appendChild(mainBtn);
        container.appendChild(sidebarBtn);
        container.appendChild(fullscreenBtn);
        container.appendChild(trashBtn);

        document.body.appendChild(container);
    }

    /**
     * FEATURE: SIDEBAR TOGGLE
     */
    function toggleSidebar() {
        const leftPanel = document.querySelector(CONFIG.SEL_LEFT);
        const resizer = document.querySelector(CONFIG.SEL_RESIZER);

        if (leftPanel) {
            const isHidden = getComputedStyle(leftPanel).display === 'none';
            if (isHidden) {
                leftPanel.style.setProperty('display', 'block', 'important');
                leftPanel.classList.remove('hidden');

                if (leftPanel.offsetWidth < 50) leftPanel.style.width = '420px';
                if (resizer) {
                    resizer.classList.remove('hidden');
                    resizer.style.left = `${leftPanel.offsetWidth}px`;
                }
            } else {
                leftPanel.style.setProperty('display', 'none', 'important');
                leftPanel.classList.add('hidden');
                if (resizer) resizer.classList.add('hidden');
            }
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    }

    function clearNotices() {
        console.debug(`[Sentinel] Cleaned by ${CONFIG.AUTHOR_SIG}`);
        state.capturedNotices.clear();
        const trayContent = document.querySelector('#sentinel-tray .tray-content');
        if (trayContent) trayContent.innerHTML = '<div style="padding:15px;text-align:center;color:#666">No new notifications</div>';
        document.getElementById('sentinel-tray').classList.remove('open');
        updateBadge();
    }

    /**
     * FEATURE: NOTIFICATION INTERCEPTOR
     */
    function startNotificationInterceptor() {
        const badge = document.createElement('div');
        badge.id = 'sentinel-badge';
        badge.innerHTML = `${ICONS.bell} <span id="sentinel-count" style="display:none">0</span>`;
        document.body.appendChild(badge);

        const tray = document.createElement('div');
        tray.id = 'sentinel-tray';
        tray.innerHTML = `<div class="tray-header"><span>Notifications</span><button class="tray-close-btn" type="button">${ICONS.close}</button></div><div class="tray-content"></div>`;
        document.body.appendChild(tray);

        const scanNodes = (node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            if (node.matches(CONFIG.SEL_NOTICES) || node.querySelector(CONFIG.SEL_NOTICES)) {
                const text = node.innerText.trim();
                if (text && !state.capturedNotices.has(text)) {
                    state.capturedNotices.add(text);
                    const item = document.createElement('div');
                    item.className = 'tray-item';
                    item.innerHTML = node.innerHTML;

                    const trayContent = tray.querySelector('.tray-content');
                    if (trayContent.innerText.includes('No new')) trayContent.innerHTML = '';
                    trayContent.prepend(item);

                    updateBadge();
                }
            }
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => m.addedNodes.forEach(scanNodes));
        });

        observer.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll(CONFIG.SEL_NOTICES).forEach(scanNodes);

        badge.onclick = () => tray.classList.toggle('open');
        tray.querySelector('.tray-close-btn').onclick = clearNotices;
    }

    function updateBadge() {
        const badge = document.getElementById('sentinel-badge');
        const countSpan = document.getElementById('sentinel-count');
        const count = state.capturedNotices.size;
        countSpan.innerText = count;

        if (count > 0) {
            badge.classList.add('active');
            countSpan.style.display = 'flex';
        } else {
            badge.classList.remove('active');
            countSpan.style.display = 'none';
        }
    }

    /**
     * FEATURE: RESIZER
     */
    function createResizer() {
        const wrapper = document.querySelector(CONFIG.SEL_WRAPPER);
        const resizer = document.createElement('div');
        resizer.className = 'sidebar-resizer';
        wrapper.appendChild(resizer);

        let isActive = false;

        resizer.onmousedown = () => {
            isActive = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            document.querySelectorAll('iframe').forEach((iframe) => { iframe.style.pointerEvents = 'none'; });
        };

        window.onmousemove = (e) => {
            if (!isActive) return;

            if (state.resizingRaf) cancelAnimationFrame(state.resizingRaf);

            state.resizingRaf = requestAnimationFrame(() => {
                const leftPanel = document.querySelector(CONFIG.SEL_LEFT);
                const newWidth = e.clientX - wrapper.getBoundingClientRect().left;

                if (newWidth > 150 && newWidth < window.innerWidth - 100) {
                    leftPanel.style.width = `${newWidth}px`;
                    leftPanel.style.flexBasis = `${newWidth}px`;
                    resizer.style.left = `${newWidth}px`;

                    const mw = document.querySelector('.marketwatch-wrap');
                    if (mw) mw.style.width = `${newWidth}px`;
                }
            });
        };

        window.onmouseup = () => {
            isActive = false;
            if (state.resizingRaf) cancelAnimationFrame(state.resizingRaf);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.querySelectorAll('iframe').forEach((iframe) => { iframe.style.pointerEvents = ''; });
        };

        // Initial Sync
        const leftPanel = document.querySelector(CONFIG.SEL_LEFT);
        if (leftPanel && getComputedStyle(leftPanel).display !== 'none') {
            resizer.style.left = `${leftPanel.getBoundingClientRect().width}px`;
        }
    }

})();
// ==UserScript==
// @name         stevenuniverse.best Adblock Popup Remover (Stable + Scroll Fix + Gradient Border)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Remove adblock popups, restore scrolling, show notification with thin moving gradient border and styled text
// @author       Mindlz
// @license All rights reserved. You may use this script only as installed; no copying, modifying, or redistribution allowed.
// @match        *://stevenuniverse.best/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556297/stevenuniversebest%20Adblock%20Popup%20Remover%20%28Stable%20%2B%20Scroll%20Fix%20%2B%20Gradient%20Border%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556297/stevenuniversebest%20Adblock%20Popup%20Remover%20%28Stable%20%2B%20Scroll%20Fix%20%2B%20Gradient%20Border%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const POPUP_SELECTOR = '.gf-ad-block-popup, div[role="dialog"], #adblock-popup';
    const BACKDROP_SELECTOR = '.modal-backdrop, .fixed.inset-0, [data-wp-dark-mode-overlay], .swal2-container, .remodal-overlay';
    const ALL_SELECTORS = POPUP_SELECTOR + ', ' + BACKDROP_SELECTOR;

    function removePopups() {
        let removed = false;

        // Remove target elements
        document.querySelectorAll(ALL_SELECTORS).forEach(el => {
            el.remove();
            removed = true;
        });

        if (removed) {
            // Restore scroll
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'auto';
            document.documentElement.style.height = 'auto';
            document.body.style.height = 'auto';
            document.documentElement.style.position = 'initial';
            document.body.style.position = 'initial';
            document.documentElement.classList.remove('no-scroll', 'scroll-lock', 'overflow-hidden');
            document.body.classList.remove('no-scroll', 'scroll-lock', 'overflow-hidden');

            setTimeout(showNotification, 100);
        }
    }

    // Debounced MutationObserver to prevent page freeze
    function setupObserver() {
        let timeout;
        const observer = new MutationObserver(() => {
            if (timeout) return;
            timeout = setTimeout(() => {
                removePopups();
                timeout = null;
            }, 100);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function showNotification() {
        if (document.getElementById('adblock-removed-notice')) return;

        const notice = document.createElement('div');
        notice.id = 'adblock-removed-notice';
        notice.style.position = 'fixed';
        notice.style.bottom = '20px';
        notice.style.left = '20px';
        notice.style.padding = '10px 18px';
        notice.style.borderRadius = '12px';
        notice.style.color = '#fff';
        notice.style.zIndex = '999999';
        notice.style.whiteSpace = 'pre-line';
        notice.style.background = 'rgba(20,20,20,0.9)';
        notice.style.opacity = '0';
        notice.style.transform = 'translateX(-20px)';
        notice.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        notice.style.boxSizing = 'border-box';

        // Thin gradient border
        const border = document.createElement('div');
        Object.assign(border.style, {
            position: 'absolute',
            top: '-1.5px',
            left: '-1.5px',
            right: '-1.5px',
            bottom: '-1.5px',
            borderRadius: '13.5px',
            background: 'linear-gradient(270deg, #00ffcc, #00bfff, #ff00ff, #ff5500)',
            backgroundSize: '600% 600%',
            zIndex: '-1',
            animation: 'gradientMove 4s ease infinite',
            pointerEvents: 'none',
            boxSizing: 'border-box'
        });

        // Inner solid box to mask gradient as border
        const inner = document.createElement('div');
        Object.assign(inner.style, {
            position: 'absolute',
            top: '1.5px',
            left: '1.5px',
            right: '1.5px',
            bottom: '1.5px',
            borderRadius: '10.5px',
            background: 'rgba(20,20,20,0.9)',
            zIndex: '0'
        });

        notice.appendChild(border);
        notice.appendChild(inner);

        // Main text
        const message = document.createElement('div');
        message.textContent = 'Ädblok popup removed, Enjoy😘';
        Object.assign(message.style, {
            position: 'relative',
            zIndex: '1',
            fontFamily: '"Segoe UI", "Roboto", "Inter", sans-serif',
            fontWeight: '600',
            fontSize: '14px'
        });
        notice.appendChild(message);

        // Fine text
        const fine = document.createElement('div');
        fine.textContent = 'Script by Mindlz';
        Object.assign(fine.style, {
            position: 'relative',
            zIndex: '1',
            fontFamily: 'sans-serif',
            fontWeight: '400',
            fontSize: '10px',
            marginTop: '2px',
            opacity: '0.7'
        });
        notice.appendChild(fine);

        // Gradient animation keyframes (only once)
        if (!document.getElementById('gradient-move-style')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'gradient-move-style';
            styleEl.textContent = `
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(styleEl);
        }

        document.body.appendChild(notice);

        requestAnimationFrame(() => {
            notice.style.opacity = '1';
            notice.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            notice.style.opacity = '0';
            notice.style.transform = 'translateX(-20px)';
            setTimeout(() => notice.remove(), 3000);
        }, 3000);
    }

    // Initial run
    removePopups();
    setupObserver();
})();

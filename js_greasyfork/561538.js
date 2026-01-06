// ==UserScript==
// @name         LiteBits Full Auto Claim Flow + Ultra Lightweight
// @namespace    https://litebits.io/
// @version      1.0
// @description  Dashboard slider + SPA-safe claim reload + continue + return, ultra lightweight
// @author       Rubystance
// @license      MIT
// @match        https://litebits.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561538/LiteBits%20Full%20Auto%20Claim%20Flow%20%2B%20Ultra%20Lightweight.user.js
// @updateURL https://update.greasyfork.org/scripts/561538/LiteBits%20Full%20Auto%20Claim%20Flow%20%2B%20Ultra%20Lightweight.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REF_LINK = 'https://litebits.io/ref/WLX822BU';
    const REF_FLAG = 'litebits_referral_applied';

    function ensureReferral() {
        if (localStorage.getItem(REF_FLAG)) return;

        const isAuthPage =
            location.pathname === '/' ||
            location.pathname.startsWith('/login') ||
            location.pathname.startsWith('/register');

        if (isAuthPage) {
            localStorage.setItem(REF_FLAG, 'true');
            console.log('[LiteBits] Applying referral link once.');
            location.replace(REF_LINK);
        }
    }

    function optimizePerformance() {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                transition-duration: 0ms !important;
                animation-duration: 0ms !important;
                animation-delay: 0ms !important;
                animation-iteration-count: 1 !important;
            }
            body {
                scroll-behavior: auto !important;
            }
            .background, .particles, .floating-element, .banner {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('[LiteBits] Heavy decorations and animations disabled.');

        const originalSetInterval = window.setInterval;
        window.setInterval = function(fn, delay, ...args) {
            const toSkip =
                fn.toString().includes('updateDecorative') ||
                fn.toString().includes('updateParticles');
            if (toSkip && delay < 100) return 0;
            return originalSetInterval(fn, delay, ...args);
        };
    }

    function waitUntil(fn, cb, delay = 500) {
        const t = setInterval(() => {
            try {
                if (fn()) {
                    clearInterval(t);
                    cb();
                }
            } catch (_) {}
        }, delay);
    }

    function isClickable(el) {
        return el && !el.disabled && el.offsetParent !== null;
    }

    function onUrlChange(cb) {
        let last = location.href;
        setInterval(() => {
            if (location.href !== last) {
                last = location.href;
                cb(location.href);
            }
        }, 300);
    }

    function handleDashboard() {
        if (location.pathname !== '/dashboard') return;

        waitUntil(
            () => document.querySelector('input[type="range"].heavy-interaction'),
            () => {
                const slider = document.querySelector('input[type="range"].heavy-interaction');

                slider.setAttribute('min', '100');
                slider.setAttribute('max', '1000');
                slider.value = 0;

                slider.dispatchEvent(new Event('input', { bubbles: true }));
                slider.dispatchEvent(new Event('change', { bubbles: true }));

                setTimeout(() => {
                    const r = slider.getBoundingClientRect();
                    slider.dispatchEvent(new MouseEvent('mousedown', {
                        bubbles: true,
                        clientX: r.right - 3,
                        clientY: r.top + r.height / 2
                    }));
                    slider.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    slider.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }, 600);
            }
        );
    }

    function handleClaim() {
        if (!location.pathname.startsWith('/claim')) return;

        console.log('[Auto] Claim detected (SPA-safe).');

        const reloadKey = 'litebits_claim_reload_done';

        if (!sessionStorage.getItem(reloadKey)) {
            sessionStorage.setItem(reloadKey, 'true');

            console.log('[Auto] Forcing HARD reload in 2s.');
            setTimeout(() => {
                location.replace(location.href);
            }, 2000);
            return;
        }

        console.log('[Auto] Reload already done. Continuing flow.');

        setTimeout(() => {
            waitUntil(
                () => {
                    const btn = [...document.querySelectorAll('button')]
                        .find(b => b.textContent.trim() === 'Continue');
                    return isClickable(btn);
                },
                () => {
                    console.log('[Auto] Clicking Continue.');
                    [...document.querySelectorAll('button')]
                        .find(b => b.textContent.trim() === 'Continue')
                        .click();
                },
                600
            );

            waitUntil(
                () => {
                    const btn = [...document.querySelectorAll('button')]
                        .find(b => b.textContent.includes('Return to Dashboard'));
                    return isClickable(btn);
                },
                () => {
                    console.log('[Auto] Returning to Dashboard.');
                    [...document.querySelectorAll('button')]
                        .find(b => b.textContent.includes('Return to Dashboard'))
                        .click();
                },
                600
            );
        }, 3000);
    }

    ensureReferral();
    optimizePerformance();
    handleDashboard();
    handleClaim();

    onUrlChange(() => {
        handleDashboard();
        handleClaim();
    });

})();

// ==UserScript==
// @name         Mouse-Follow Auto Clicker (Smooth + Burst, Max 10k CPS, Hold M1)
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  Auto clicker: Smooth + Burst modes, max 10k CPS. Hold M1 to click, Q to toggle or set CPS.
// @author       TheHackerClient
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550717/Mouse-Follow%20Auto%20Clicker%20%28Smooth%20%2B%20Burst%2C%20Max%2010k%20CPS%2C%20Hold%20M1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550717/Mouse-Follow%20Auto%20Clicker%20%28Smooth%20%2B%20Burst%2C%20Max%2010k%20CPS%2C%20Hold%20M1%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Config ---
    let running = false;           // toggled by Alt+M
    let cps = 10000;                 // default clicks per second
    const CPS_MAX = 10000;         // maximum allowed
    const TICK_MS = 1000;            // scheduler tick in milliseconds (controls smoothness)

    // --- State ---
    let tickInterval = null;
    let acc = 0;                   // fractional click accumulator
    let lastMouseX = 0, lastMouseY = 0;
    // No mouse-hold needed in toggle mode
    let clicking = false;

    // Track mouse position
    document.addEventListener('mousemove', e => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }, {passive: true});

    // M1 hold logic removed — toggle-based clicking
    document.addEventListener('mouseup', e => { if (e.button === 0) m1Down = false; }, true);

    // Key controls: Alt+M toggle, Alt+N set CPS
    // Key controls (NO Alt required)
    document.addEventListener('keydown', evt => {
        const k = evt.key.toLowerCase();

        // M → master enable / disable
        if (k === 'm') {
            running = !running;
            if (!running) {
                clicking = false;
                stopScheduler();
                try { showToast('Auto Clicker DISABLED'); } catch(e){}
            } else {
                startScheduler();
                try { showToast('Auto Clicker ENABLED'); } catch(e){}
            }
            evt.preventDefault();
        }

        // N → toggle clicking ON / OFF
        if (k === 'n') {
            if (!running) return;
            clicking = !clicking;
            acc = 0;
            try { showToast(clicking ? 'Clicking ON' : 'Clicking OFF'); } catch(e){}
            evt.preventDefault();
        }
    }, true);

    // Scheduler: accumulative approach gives smooth clicks and supports very high CPS without tiny intervals
    function startScheduler() {
        if (tickInterval) return;
        acc = 0;
        tickInterval = setInterval(() => {
            if (!running || !clicking) return;
            // accumulate expected clicks for this tick
            acc += (cps * (TICK_MS / 1000));
            let toDo = Math.floor(acc);
            acc -= toDo;
            if (toDo <= 0) return;

            for (let i = 0; i < toDo; i++) {
                simulateClick(lastMouseX, lastMouseY);
            }
        }, TICK_MS);
    }

    function stopScheduler() {
        if (tickInterval) {
            clearInterval(tickInterval);
            tickInterval = null;
            acc = 0;
        }
    }

    function restartScheduler() {
        stopScheduler();
        startScheduler();
    }

    // Simulate a fuller click sequence: mousedown -> mouseup -> click
    function simulateClick(x, y) {
        const el = document.elementFromPoint(x, y);
        if (!el) return;

        // Avoid clicking inside form fields or contenteditable regions to prevent accidental typing deletions
        try {
            if (el.closest && el.closest('input, textarea, select')) return;
            if (el.isContentEditable) return;
        } catch (e) {
            // ignore and proceed if DOM methods throw for exotic elements
        }

        const opts = {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button: 0
        };

        // Dispatch sequence
        el.dispatchEvent(new MouseEvent('mousedown', opts));
        // small micro-delay for more realistic behavior — use setTimeout 0 to yield
        setTimeout(() => {
            el.dispatchEvent(new MouseEvent('mouseup', opts));
            el.dispatchEvent(new MouseEvent('click', opts));
        }, 0);
    }

    // Small, temporary toast helper so pages don't get blocked by alerts
    function showToast(text, duration = 2000) {
        const id = '__tm_toast_autoclicker__';
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement('div');
            el.id = id;
            el.style.position = 'fixed';
            el.style.right = '12px';
            el.style.bottom = '12px';
            el.style.zIndex = 999999999;
            el.style.padding = '8px 12px';
            el.style.borderRadius = '6px';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
            el.style.background = 'rgba(0,0,0,0.75)';
            el.style.color = 'white';
            el.style.fontSize = '12px';
            el.style.fontFamily = 'sans-serif';
            document.documentElement.appendChild(el);
        }
        el.textContent = text;
        el.style.opacity = '1';
        setTimeout(() => {
            if (!el) return;
            el.style.transition = 'opacity 500ms';
            el.style.opacity = '0';
            setTimeout(() => { try { el.remove(); } catch(e){} }, 500);
        }, duration);
    }

    // Ensure scheduler stops when navigating away or unloading
    window.addEventListener('beforeunload', stopScheduler);
    window.addEventListener('visibilitychange', () => { if (document.hidden) stopScheduler(); });

    // Expose some debug commands on window for convenience (optional)
    Object.defineProperty(window, 'AutoClicker', {
        value: {
            enable: () => { running = true; startScheduler(); },
            disable: () => { running = false; clicking = false; stopScheduler(); },
            toggleClicking: () => { clicking = !clicking; acc = 0; },
            setCPS: (v) => { cps = Math.max(1, Math.min(CPS_MAX, parseInt(v,10)||cps)); restartScheduler(); },
            getCPS: () => cps
        },
        writable: false,
        configurable: false
    });

})();

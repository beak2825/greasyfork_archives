// ==UserScript==
// @name               X/Twitter Timeline Master
// @version            1.1
// @description        Easily fish yourself out of a doomscroll and reload your timeline without refreshing the page. Also includes an auto-refresh countdown timer, draggable UI, and hotkey functionality.
// @author             Gemini
// @match              https://x.com/*
// @grant              GM_getValue
// @license            MIT
// @namespace https://greasyfork.org/users/1275465
// @downloadURL https://update.greasyfork.org/scripts/561795/XTwitter%20Timeline%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/561795/XTwitter%20Timeline%20Master.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Safe GM access helpers ---
    const gmGet = (key, fallback) => {
        try {
            return typeof GM_getValue === 'function' ? GM_getValue(key, fallback) : fallback;
        } catch {
            return fallback;
        }
    };

    const gmSet = (key, value) => {
        try {
            if (typeof GM_setValue === 'function') GM_setValue(key, value);
        } catch {
            // ignore
        }
    };

    // --- Configurations ---
    let refreshInterval = gmGet('refreshInterval', 5);
    let autoRefreshEnabled = gmGet('autoRefreshEnabled', false);
    let hotkeyUp = gmGet('hotkeyUp', 'u');
    let hotkeyDown = gmGet('hotkeyDown', 'd');

    let secondsRemaining = refreshInterval;
    let autoRefreshTick = null;
    let dragHoldTimer = null;
    let isDragging = false;

    const isTwitterHome = () => window.location.href.startsWith('https://x.com/home');

    // --- Icons (Scaled down slightly for smaller buttons) ---
    const ICON_UP = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="#00ff00" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
    const ICON_DOWN = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="#00ff00" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`;
    const ICON_MENU = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="#00ff00" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;

    // --- Styles ---
    const style = document.head.appendChild(document.createElement('style'));
    style.textContent = `
        .neon-btn-container {
            position: fixed; z-index: 2147483647; display: flex; flex-direction: column;
            gap: 7px;
            transition: opacity 0.5s ease; right: 20px; bottom: 100px; user-select: none;
        }
        .neon-btn {
            width: 31.5px !important; height: 31.5px !important;
            background-color: #000 !important; border: 2px solid #00ff00 !important;
            border-radius: 7px !important; display: flex !important; align-items: center !important;
            justify-content: center !important; cursor: pointer; box-sizing: border-box !important;
            transition: all 0.25s ease; position: relative;
        }
        .neon-btn:hover {
            transform: scale(1.08); border-color: #00ff88 !important;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.6), inset 0 0 4px rgba(0, 255, 0, 0.3) !important;
        }
        .neon-btn:hover svg { filter: drop-shadow(0 0 4px rgba(0, 255, 0, 0.8)); }

        #neon-settings-menu {
            position: absolute; right: 45px; bottom: 0; background: #000;
            border: 2px solid #00ff00; border-radius: 8px; padding: 12px; color: #00ff00;
            width: 190px; display: none; flex-direction: column; gap: 10px;
            font-family: sans-serif; font-size: 13px;
            box-shadow: 0 0 20px rgba(0,0,0,1), 0 0 10px rgba(0, 255, 0, 0.2);
        }
        #neon-settings-menu.open { display: flex; }
        .menu-row { display: flex; justify-content: space-between; align-items: center; }
        .menu-row input {
            background: #111; border: 1px solid #00ff00; color: #00ff00;
            width: 60px; text-align: center; border-radius: 4px; padding: 3px; cursor: pointer;
        }

        .countdown-badge {
            position: absolute; bottom: -5px; right: -5px; width: 15px; height: 15px;
            background: #000; border: 1.5px solid #00ff00; border-radius: 50%; color: #00ff00;
            font-size: 9px; font-weight: bold; display: none; align-items: center;
            justify-content: center; z-index: 10; pointer-events: none;
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
        }
        .countdown-badge.active { display: flex; }

        @keyframes neonPulse {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.1) rotate(180deg); opacity: 0.8; }
        }
        .neon-ring {
            position: absolute; width: 40px; height: 40px; border: 3.5px solid transparent;
            border-top-color: #00ff00; border-right-color: #00ff88; border-radius: 50%;
            animation: neonPulse 1s linear infinite;
        }
        .inner-ring {
            width: 30px; height: 30px; border-top-color: #00ff88; border-right-color: #00ff00;
            animation-direction: reverse; animation-duration: 0.8s;
        }
        .spark {
            position: absolute; width: 4px; height: 4px; background: #00ff00;
            border-radius: 50%; box-shadow: 0 0 10px #00ff00;
            animation: sparkBurst 0.8s ease-out infinite;
        }
        @keyframes sparkBurst {
            0% { transform: translate(0, 0) scale(1.3); opacity: 1; }
            100% { transform: translate(12px, 12px) scale(0); opacity: 0; }
        }
    `;

    // --- Utility ---
    function createBtn(svg) {
        const b = document.createElement('div');
        b.className = 'neon-btn';
        b.innerHTML = svg;
        return b;
    }

    function createMenu() {
        const m = document.createElement('div');
        m.id = 'neon-settings-menu';
        m.innerHTML = `
            <div class="menu-row">
                <span>Auto Refresh</span><input type="checkbox" id="ar-check">
            </div>
            <div class="menu-row">
                <span>Interval (s)</span><input type="number" id="ar-val" min="1">
            </div>
            <div class="menu-row">
                <span>Hotkey Up</span><input type="text" id="hk-up" readonly>
            </div>
            <div class="menu-row">
                <span>Hotkey Down</span><input type="text" id="hk-down" readonly>
            </div>
        `;

        const chk = m.querySelector('#ar-check');
        const val = m.querySelector('#ar-val');
        const hkUpInp = m.querySelector('#hk-up');
        const hkDownInp = m.querySelector('#hk-down');

        chk.checked = autoRefreshEnabled;
        val.value = refreshInterval;
        hkUpInp.value = hotkeyUp;
        hkDownInp.value = hotkeyDown;

        chk.onchange = (e) => {
            autoRefreshEnabled = e.target.checked;
            gmSet('autoRefreshEnabled', autoRefreshEnabled);
            startTimer();
        };

        val.onchange = (e) => {
            const parsed = parseInt(e.target.value, 10);
            refreshInterval = Math.max(1, Number.isNaN(parsed) ? 5 : parsed);
            e.target.value = refreshInterval;
            gmSet('refreshInterval', refreshInterval);
            // reset timer with new interval if enabled
            if (autoRefreshEnabled) startTimer();
        };

        hkUpInp.onkeydown = (e) => {
            e.preventDefault();
            hotkeyUp = e.key;
            hkUpInp.value = e.key;
            gmSet('hotkeyUp', e.key);
        };

        hkDownInp.onkeydown = (e) => {
            e.preventDefault();
            hotkeyDown = e.key;
            hkDownInp.value = e.key;
            gmSet('hotkeyDown', e.key);
        };

        return m;
    }

    // --- UI Creation ---
    const container = document.createElement('div');
    container.className = 'neon-btn-container';

    const btnUp = createBtn(ICON_UP);
    const btnDown = createBtn(ICON_DOWN);
    const btnMenu = createBtn(ICON_MENU);

    const badge = document.createElement('div');
    badge.className = 'countdown-badge';
    btnMenu.appendChild(badge);

    const menu = createMenu();
    container.append(btnUp, btnDown, btnMenu, menu);
    document.body.appendChild(container);

    const savedPos = gmGet('btnPos', { right: 20, bottom: 100 });
    container.style.right = savedPos.right + 'px';
    container.style.bottom = savedPos.bottom + 'px';

    // --- Core Action Functions ---
    function showSpinner() {
        if (!isTwitterHome()) return;

        const existing = document.getElementById('refresh-spinner');
        if (existing) existing.remove();

        const spinner = document.createElement('div');
        spinner.id = 'refresh-spinner';
        spinner.innerHTML = `
            <div class="neon-ring"></div>
            <div class="neon-ring inner-ring"></div>
            <div class="spark"></div>
            <div class="spark" style="transform: rotate(90deg);"></div>
        `;

        let targetX = '50%';
        let targetY = '50%';

        try {
            const firstTweet = document.querySelector('article[data-testid="tweet"]');
            if (firstTweet) {
                const rect = firstTweet.getBoundingClientRect();
                targetX = (rect.left + rect.width / 2) + 'px';
                targetY = (rect.top + (rect.height / 3)) + 'px';
            }
        } catch {
            // fallback to center
        }

        spinner.style.cssText = `
            position: fixed; top: ${targetY}; left: ${targetX};
            transform: translate(-50%, -50%); width: 50px; height: 50px;
            display: flex; justify-content: center; align-items: center;
            z-index: 10000; pointer-events: none;
        `;

        document.body.appendChild(spinner);
        setTimeout(() => spinner.remove(), 2000);
    }

    function clickHomeRefresh() {
        if (!isTwitterHome()) return;
        try {
            const refreshBtn = document.querySelector(
                '[href="/home"], [aria-label*="Home"], [data-testid="AppTabBar_Home_Link"]'
            );
            if (refreshBtn) {
                showSpinner();
                refreshBtn.click();
            }
        } catch {
            // ignore if DOM changes
        }
    }

    function goUp() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        clickHomeRefresh();
    }

    function goDown() {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }

    // --- Auto-refresh Timer ---
    function startTimer() {
        if (autoRefreshTick) clearInterval(autoRefreshTick);

        if (!autoRefreshEnabled) {
            badge.classList.remove('active');
            badge.innerText = '';
            return;
        }

        secondsRemaining = refreshInterval;
        badge.innerText = secondsRemaining;
        badge.classList.add('active');

        autoRefreshTick = setInterval(() => {
            badge.innerText = secondsRemaining;
            if (secondsRemaining <= 0) {
                if (isTwitterHome()) {
                    goUp();
                } else {
                    location.reload();
                }
                secondsRemaining = refreshInterval;
                badge.innerText = secondsRemaining;
            } else {
                secondsRemaining--;
            }
        }, 1000);
    }

    // --- Hotkeys ---
    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if (
            active &&
            (['INPUT', 'TEXTAREA'].includes(active.tagName) || active.isContentEditable)
        ) {
            return;
        }

        const key = e.key.toLowerCase();
        if (key === String(hotkeyUp).toLowerCase()) {
            e.preventDefault();
            goUp();
        } else if (key === String(hotkeyDown).toLowerCase()) {
            e.preventDefault();
            goDown();
        }
    });

    // --- Button Clicks ---
    btnUp.onclick = (e) => {
        e.stopPropagation();
        goUp();
    };

    btnDown.onclick = (e) => {
        e.stopPropagation();
        goDown();
    };

    btnMenu.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('open');
    };

    // --- Close menu on outside click ---
    document.addEventListener('mousedown', (e) => {
        if (menu.classList.contains('open') && !menu.contains(e.target) && !btnMenu.contains(e.target)) {
            menu.classList.remove('open');
        }
    });

    // --- Draggable Container ---
    let dragStartX = 0;
    let dragStartY = 0;
    let startRight = 0;
    let startBottom = 0;

    const onMouseMove = (e) => {
        if (!isDragging) return;

        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        const newRight = Math.max(0, startRight - dx);
        const newBottom = Math.max(0, startBottom - dy);

        container.style.right = newRight + 'px';
        container.style.bottom = newBottom + 'px';
    };

    const endDrag = () => {
        if (dragHoldTimer) {
            clearTimeout(dragHoldTimer);
            dragHoldTimer = null;
        }
        if (!isDragging) return;
        isDragging = false;

        const right = parseInt(container.style.right, 10) || 0;
        const bottom = parseInt(container.style.bottom, 10) || 0;
        gmSet('btnPos', { right, bottom });

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', endDrag);
    };

    container.addEventListener('mousedown', (e) => {
        // Don't start drag when interacting with menu or inputs
        if (menu.contains(e.target) || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        dragStartX = e.clientX;
        dragStartY = e.clientY;

        startRight = parseInt(container.style.right, 10) || 0;
        startBottom = parseInt(container.style.bottom, 10) || 0;

        dragHoldTimer = setTimeout(() => {
            isDragging = true;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', endDrag);
        }, 120); // small delay to distinguish click vs drag
    });

    document.addEventListener('mouseup', endDrag);

    // --- Observe URL changes (SPA navigation robustness) ---
    (function patchHistoryForNavigation() {
        const fireNavEvent = () => {
            const ev = new Event('tm-url-change');
            window.dispatchEvent(ev);
        };

        const origPush = history.pushState;
        const origReplace = history.replaceState;

        history.pushState = function(...args) {
            origPush.apply(this, args);
            fireNavEvent();
        };

        history.replaceState = function(...args) {
            origReplace.apply(this, args);
            fireNavEvent();
        };

        window.addEventListener('popstate', fireNavEvent);
    })();

    window.addEventListener('tm-url-change', () => {
        // When navigation happens, reset timer state appropriately
        if (autoRefreshEnabled) {
            startTimer();
        } else {
            if (autoRefreshTick) clearInterval(autoRefreshTick);
        }
    });

    // Initial timer start
    startTimer();
})();
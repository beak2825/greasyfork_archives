// ==UserScript==
// @name         P3 – Eyrie Auto Egg Feeder
// @namespace    p3_eyrie_auto_feeder_html_v3
// @version      1.7
// @description  Auto-feeds Eyrie eggs with Start/Stop, selectable priority modes, per-item toggles, and stationary bar
// @match        https://pocketpumapets.com/eyrie.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @icon         https://www.pocketpumapets.com/favicon.ico
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/561200/P3%20%E2%80%93%20Eyrie%20Auto%20Egg%20Feeder.user.js
// @updateURL https://update.greasyfork.org/scripts/561200/P3%20%E2%80%93%20Eyrie%20Auto%20Egg%20Feeder.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ---------- CLEAR USED LINKS ON LOAD ----------
    // Ensures egggrow=2468 and egggrow=17542 are never skipped
    sessionStorage.removeItem('P3_EYRIE_USED');

    /* ========= STORAGE KEYS ========= */

    const RUN_KEY      = 'P3_EYRIE_RUNNING';
    const USED_KEY     = 'P3_EYRIE_USED';
    const MODE_KEY     = 'P3_EYRIE_PRIORITY_MODE';
    const ENABLED_KEY  = 'P3_EYRIE_ENABLED_ITEMS';

    /* ========= FEED OPTIONS ========= */

    const FEED_ITEMS = {
        'egggrow=17542': 'Super Grow',
        'egggrow=2468' : 'Egg Grow',
        'dragnbites=6' : 'Bacon',
        'dragnbites=7' : 'Veggie',
        'dragnbites=5' : 'Salmon',
        'dragnbites=4' : 'Tuna',
        'dragnbites=3' : 'Pork',
        'dragnbites=2' : 'Chicken',
        'dragnbites=1' : 'Beef'
    };

    const PRIORITY_MODES = {
        max: [
            'egggrow=17542',
            'egggrow=2468',
            'dragnbites=6',
            'dragnbites=7',
            'dragnbites=5',
            'dragnbites=4',
            'dragnbites=3',
            'dragnbites=2',
            'dragnbites=1'
        ],
        least: [
            'egggrow=2468',
            'egggrow=17542',
            'dragnbites=3',
            'dragnbites=2',
            'dragnbites=1',
            'dragnbites=5',
            'dragnbites=4',
            'dragnbites=7',
            'dragnbites=6'
        ]
    };

    /* ========= STATE ========= */

    const running = () => GM_getValue(RUN_KEY, false);
    const setRunning = v => {
        GM_setValue(RUN_KEY, v);
        updateStatus();
        if (v) runFeeder();
    };

    const getMode = () => GM_getValue(MODE_KEY, 'max');
    const setMode = v => GM_setValue(MODE_KEY, v);

    const getEnabled = () =>
        GM_getValue(ENABLED_KEY, Object.keys(FEED_ITEMS));

    const setEnabled = arr =>
        GM_setValue(ENABLED_KEY, arr);

    /* ========= UI BAR ========= */

    const bar = document.createElement('div');
    bar.id = 'p3EyrieBar';
    bar.style.cssText = `
        position:fixed;top:0;left:0;width:100%;
        background:#111;color:#fff;z-index:99999;
        padding:6px 10px;font-family:Arial;font-size:13px;
        display:flex;flex-wrap:wrap;gap:10px;align-items:center;
    `;

    const start = document.createElement('button');
    const stop  = document.createElement('button');
    const status = document.createElement('span');

    start.textContent = 'Start';
    stop.textContent  = 'Stop';

    /* ========= PRIORITY SELECT ========= */

    const modeSelect = document.createElement('select');
    modeSelect.innerHTML = `
        <option value="max">Max Interactions</option>
        <option value="least">Least Interactions</option>
    `;
    modeSelect.value = getMode();
    modeSelect.onchange = () => setMode(modeSelect.value);

    /* ========= CHECKBOXES ========= */

    const checkboxWrap = document.createElement('div');
    checkboxWrap.style.display = 'flex';
    checkboxWrap.style.flexWrap = 'wrap';
    checkboxWrap.style.gap = '6px 12px';

    function rebuildCheckboxes() {
        checkboxWrap.innerHTML = '';
        const enabled = getEnabled();

        for (const key in FEED_ITEMS) {
            const label = document.createElement('label');
            label.style.cursor = 'pointer';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = enabled.includes(key);

            cb.onchange = () => {
                const set = new Set(getEnabled());
                cb.checked ? set.add(key) : set.delete(key);
                setEnabled([...set]);
            };

            label.append(cb, ` ${FEED_ITEMS[key]}`);
            checkboxWrap.append(label);
        }
    }

    rebuildCheckboxes();

    bar.append(
        start,
        stop,
        status,
        document.createTextNode('Priority:'),
        modeSelect,
        checkboxWrap
    );

    document.body.prepend(bar);

    // Ensure page content isn't hidden behind bar
    const topPadding = parseInt(window.getComputedStyle(document.body).paddingTop) || 0;
    document.body.style.paddingTop = `${topPadding + 70}px`;

    start.onclick = () => setRunning(true);
    stop.onclick  = () => setRunning(false);

    function updateStatus() {
        status.textContent = `Eyrie Feeder: ${running() ? 'RUNNING' : 'STOPPED'}`;
        status.style.color = running() ? '#7CFF7C' : '#FF7C7C';
    }

    updateStatus();

    /* ========= USED LINKS ========= */

    const getUsed = () => JSON.parse(sessionStorage.getItem(USED_KEY) || '[]');

    const markUsed = href => {
        const used = getUsed();
        if (!used.includes(href)) {
            used.push(href);
            sessionStorage.setItem(USED_KEY, JSON.stringify(used));
        }
    };

    function greyOutUsed() {
        const used = getUsed();
        document.querySelectorAll('a[href*="eyrie_feed.php"]').forEach(a => {
            if (used.includes(a.getAttribute('href'))) {
                a.style.opacity = '0.35';
                a.style.pointerEvents = 'none';
                const img = a.querySelector('img');
                if (img) img.style.filter = 'grayscale(100%)';
            }
        });
    }

    greyOutUsed();

    /* ========= CORE FEEDER ========= */

    function runFeeder() {
        if (!running()) return;

        const enabled = getEnabled();
        const priority = PRIORITY_MODES[getMode()]
            .filter(k => enabled.includes(k));

        for (const key of priority) {
            const link = [...document.querySelectorAll(`a[href*="${key}"]`)]
                .find(a => !getUsed().includes(a.getAttribute('href')));

            if (link) {
                const href = link.getAttribute('href');
                markUsed(href);
                greyOutUsed();

                console.log('[Eyrie Feeder] Feeding:', href);

                setTimeout(() => {
                    window.location.href = href;
                }, 120);
                return;
            }
        }

        scheduleRefresh();
    }

    /* ========= REFRESH ========= */

    function scheduleRefresh() {
        if (!running()) return;
        const mins = Math.floor(Math.random() * 5) + 3;
        setTimeout(() => location.reload(), mins * 60 * 1000);
    }

    /* ========= AUTO RESUME ========= */

    if (running()) {
        setTimeout(runFeeder, 800);
    }

})();

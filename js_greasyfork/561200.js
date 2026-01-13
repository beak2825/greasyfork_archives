// ==UserScript==
// @name         P3 – Eyrie Auto Egg Feeder
// @namespace    p3_eyrie_auto_feeder_html_v3
// @version      1.9
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

    sessionStorage.removeItem('P3_EYRIE_USED');

    /* ========= STORAGE KEYS ========= */
    const RUN_KEY      = 'P3_EYRIE_RUNNING';
    const USED_KEY     = 'P3_EYRIE_USED';
    const MODE_KEY     = 'P3_EYRIE_PRIORITY_MODE';
    const ENABLED_KEY  = 'P3_EYRIE_ENABLED_ITEMS';
    const END_KEY      = 'P3_EYRIE_ENDTIME';
    const DURATION_KEY = 'P3_EYRIE_DURATION';

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
        max: Object.keys(FEED_ITEMS),
        least: [
            'egggrow=2468','egggrow=17542',
            'dragnbites=3','dragnbites=2','dragnbites=1',
            'dragnbites=5','dragnbites=4','dragnbites=7','dragnbites=6'
        ]
    };

    /* ========= STATE ========= */
    const running = () => GM_getValue(RUN_KEY, false);
    const setRunning = v => {
        GM_setValue(RUN_KEY, v);
        if (!v) GM_setValue(END_KEY, null);
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
    bar.style.cssText = `
        position:fixed;top:0;left:0;width:100%;
        background:#111;color:#fff;z-index:99999;
        padding:6px 10px;font-family:Arial;font-size:13px;
        display:flex;flex-wrap:wrap;gap:10px;align-items:center;
    `;

    const start = document.createElement('button');
    const stop  = document.createElement('button');
    const duration = document.createElement('input');
    const timer = document.createElement('span');
    const status = document.createElement('span');

    start.textContent = 'Start';
    stop.textContent  = 'Stop';

    duration.type = 'text';
    duration.placeholder = 'HH:MM';
    duration.style.width = '60px';
    duration.value = GM_getValue(DURATION_KEY, '');

    duration.oninput = () => GM_setValue(DURATION_KEY, duration.value.trim());

    /* ========= TIME HELPERS ========= */
    function parseDuration(val) {
        const m = val.match(/^(\d+):([0-5]\d)$/);
        if (!m) return null;
        return (parseInt(m[1]) * 60 + parseInt(m[2])) * 60000;
    }

    function fmt(ms) {
        const s = Math.max(0, Math.floor(ms / 1000));
        return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    }

    start.onclick = () => {
        const dur = parseDuration(duration.value);
        if (!dur) return alert('Use HH:MM format (example: 02:30)');
        GM_setValue(DURATION_KEY, duration.value.trim());
        GM_setValue(END_KEY, Date.now() + dur);
        setRunning(true);
    };

    stop.onclick = () => setRunning(false);

    /* ========= STATUS ========= */
    function updateStatus() {
        status.textContent = `Eyrie Feeder: ${running() ? 'RUNNING' : 'STOPPED'}`;
        status.style.color = running() ? '#7CFF7C' : '#FF7C7C';
    }

    setInterval(() => {
        const end = GM_getValue(END_KEY, null);
        if (!running() || !end) {
            timer.textContent = '';
            return;
        }
        const remaining = end - Date.now();
        if (remaining <= 0) {
            setRunning(false);
            timer.textContent = 'Finished';
        } else {
            timer.textContent = `⏳ ${fmt(remaining)}`;
        }
    }, 1000);

    /* ========= PRIORITY UI ========= */
    const modeSelect = document.createElement('select');
    modeSelect.innerHTML = `
        <option value="max">Max Interactions</option>
        <option value="least">Least Interactions</option>
    `;
    modeSelect.value = getMode();
    modeSelect.onchange = () => setMode(modeSelect.value);

    const checkboxWrap = document.createElement('div');
    checkboxWrap.style.display = 'flex';
    checkboxWrap.style.flexWrap = 'wrap';
    checkboxWrap.style.gap = '6px 12px';

    function rebuildCheckboxes() {
        checkboxWrap.innerHTML = '';
        const enabled = getEnabled();
        for (const key in FEED_ITEMS) {
            const label = document.createElement('label');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = enabled.includes(key);
            cb.onchange = () => {
                const s = new Set(getEnabled());
                cb.checked ? s.add(key) : s.delete(key);
                setEnabled([...s]);
            };
            label.append(cb, ` ${FEED_ITEMS[key]}`);
            checkboxWrap.append(label);
        }
    }

    rebuildCheckboxes();

    bar.append(start, stop, duration, timer, status, document.createTextNode('Priority:'), modeSelect, checkboxWrap);
    document.body.prepend(bar);
    document.body.style.paddingTop = '80px';

    updateStatus();

    /* ========= FEEDER ========= */
    const getUsed = () => JSON.parse(sessionStorage.getItem(USED_KEY) || '[]');

    const markUsed = href => {
        const used = getUsed();
        if (!used.includes(href)) {
            used.push(href);
            sessionStorage.setItem(USED_KEY, JSON.stringify(used));
        }
    };

    function runFeeder() {
        if (!running()) return;

        const enabled = getEnabled();
        const priority = PRIORITY_MODES[getMode()].filter(k => enabled.includes(k));

        for (const key of priority) {
            const link = [...document.querySelectorAll(`a[href*="${key}"]`)]
                .find(a => !getUsed().includes(a.getAttribute('href')));
            if (link) {
                markUsed(link.href);
                setTimeout(() => window.location.href = link.href, 120);
                return;
            }
        }
        scheduleRefresh();
    }

    function scheduleRefresh() {
        if (!running()) return;
        const mins = Math.floor(Math.random() * 5) + 3;
        setTimeout(() => location.reload(), mins * 60 * 1000);
    }

    if (running() && GM_getValue(END_KEY, 0) > Date.now()) {
        setTimeout(runFeeder, 800);
    }

})();




(function () {
    'use strict';

    const STORAGE_KEY = 'p3_hide_nurture_history';

    function init() {
        const header = [...document.querySelectorAll('h3.center')]
            .find(h => h.textContent.trim() === 'Nurture History');

        if (!header) return;

        const pagination = header.nextElementSibling;
        const table = document.querySelector('table.centerdiv');

        if (!pagination || !table) return;

        if (document.getElementById('p3-nurture-toggle')) return;

        const button = document.createElement('button');
        button.id = 'p3-nurture-toggle';
        button.style.display = 'block';
        button.style.margin = '10px auto';
        button.style.padding = '6px 14px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';

        let hidden = localStorage.getItem(STORAGE_KEY) === 'true';

        function update() {
            pagination.style.display = hidden ? 'none' : '';
            table.style.display = hidden ? 'none' : '';
            button.textContent = hidden ? 'Show Nurture History' : 'Hide Nurture History';
            localStorage.setItem(STORAGE_KEY, hidden);
        }

        button.onclick = () => {
            hidden = !hidden;
            update();
        };

        header.insertAdjacentElement('afterend', button);
        update();
    }

    init();
})();

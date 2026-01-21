// ==UserScript==
// @name         Torn Bust Panel
// @description  Fetch jail list, calculate hardness, filter targets, and bust them.
// @author       Allenone [2033011]
// @namespace    https://torn.com/
// @version      1.2.0
// @match        https://www.torn.com/jailview.php*
// @icon         https://www.torn.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562189/Torn%20Bust%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/562189/Torn%20Bust%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let minH = GM_getValue('hardnessMin', 0);
    let maxH = GM_getValue('hardnessMax', 300);

    /* ============================
       BAIL CONFIG
    ============================ */
    const MAX_BAIL = GM_getValue('maxBailAmount', 75000); // <-- change as desired
    const BAIL_SKIP_TTL = 10 * 60 * 1000; // 10 minutes

    // Runtime state
    let bailIndex = 0;
    let bailArmedUser = null;

    // GM cache: { [userId]: timestamp }
    let bailSkipCache = GM_getValue('bailSkipCache', {});

    /* ============================
       AUTH / TOKENS
    ============================ */
    const getRfcvToken = () => {
        const match = document.cookie.match(/rfc_v=([^;]+)/);
        return match ? match[1] : null;
    };

    /* ============================
       HARDNESS PARSING
    ============================ */
    function parseDurationToHours(timeStr) {
        if (typeof timeStr !== 'string') return 0;
        const h = +(timeStr.match(/(\d+)h/)?.[1] || 0);
        const m = +(timeStr.match(/(\d+)m/)?.[1] || 0);
        return h + m / 60;
    }

    function extractName(html) {
        const m = html.match(/data-placeholder="([^[]+)/);
        return m ? m[1].trim() : 'Unknown';
    }

    /* ============================
       DETERMINE START FROM URL
    ============================ */
    function getStartFromURL() {
        const hash = window.location.hash; // e.g. "#start=50"
        const match = hash.match(/start=(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    function isBailSkipped(userId) {
        const ts = bailSkipCache[userId];
        if (!ts) return false;
        if (Date.now() - ts > BAIL_SKIP_TTL) {
            delete bailSkipCache[userId];
            GM_setValue('bailSkipCache', bailSkipCache);
            return false;
        }
        return true;
    }

    function markBailSkipped(userId) {
        bailSkipCache[userId] = Date.now();
        GM_setValue('bailSkipCache', bailSkipCache);
    }

    function parseBailAmount(msg) {
        // Matches $2,471,634
        const m = msg?.match(/\$([\d,]+)/);
        return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
    }

    /* ============================
       PANEL CREATION (only once)
    ============================ */
    let panel, minInput, maxInput, listEl, playersCache = [];

    const BAIL_SKIPPED_STYLE = `
        background: linear-gradient(90deg, #444, #2a2a2a);
        opacity: 0.75;
    `;

    function createPanel() {
        panel = document.getElementById('jail-bust-panel');
        if (panel) return;

        panel = document.createElement('div');
        panel.id = 'jail-bust-panel';
        panel.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        width: 350px;
        max-height: 70vh;
        overflow-y: auto;
        background: #1e1e1e;
        color: #f0f0f0;
        border: 1px solid #555;
        padding: 12px;
        z-index: 9999;
        font-size: 13px;
        font-family: Arial, sans-serif;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
    `;
        document.body.appendChild(panel);

        panel.innerHTML = `
        <div style="margin-bottom:10px; display:flex; gap:6px; align-items:center;">
            <strong>Hardness</strong>
            <input id="minH" type="number" value="0" style="width:60px; padding:2px; border-radius:4px; border:1px solid #555; background:#333; color:#fff">
            -
            <input id="maxH" type="number" value="300" style="width:60px; padding:2px; border-radius:4px; border:1px solid #555; background:#333; color:#fff">
            <button id="applyFilter" style="padding:4px 8px; background:#007acc; color:#fff; border:none; border-radius:4px; cursor:pointer;">Apply</button>
            <button id="refreshJail" style="padding:4px 11px; background:#28a745; color:#fff; border:none; border-radius:4px; cursor:pointer;">Refresh</button>
        </div>
        <div id="bust-list"></div>
    `;

        minInput = panel.querySelector('#minH');
        maxInput = panel.querySelector('#maxH');
        listEl = panel.querySelector('#bust-list');

        minInput.value = minH;
        maxInput.value = maxH;

        // Button click effect
        const buttons = panel.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('mousedown', () => btn.style.opacity = '0.7');
            btn.addEventListener('mouseup', () => btn.style.opacity = '1');
            btn.addEventListener('mouseleave', () => btn.style.opacity = '1');
        });

        panel.querySelector('#applyFilter').onclick = () => {
            minH = parseInt(minInput.value, 10) || 0;
            maxH = parseInt(maxInput.value, 10) || Infinity;

            GM_setValue('hardnessMin', minH);
            GM_setValue('hardnessMax', maxH);

            renderList();
        };
        panel.querySelector('#refreshJail').onclick = () => fetchJail();
    }

    /* ============================
       FETCH JAIL
    ============================ */
    function fetchJail() {
        const rfcv = getRfcvToken();
        const initialStart = getStartFromURL();
        if (!rfcv) {
            console.error('rfc_v token not found');
            return;
        }

        const ts = Date.now();
        const rnd = Math.random();
        const url = `https://www.torn.com/jailview.php?${ts}=${rnd}&rfcv=${rfcv}`;

        const body = new URLSearchParams({ action: 'jail', start: initialStart });

        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: body.toString()
        })
            .then(r => r.json())
            .then(response => {
            if (!response?.data?.players) return console.warn('Unexpected response', response);

            playersCache = Object.values(response.data.players).map(p => {
                const durationHours = parseDurationToHours(p.time);
                return {
                    id: p.user_id,
                    name: extractName(p.print_name),
                    level: p.level,
                    time: p.time.trim(),
                    hardness: Math.floor(p.level * (durationHours + 3))
                };
            });

            renderList();
        })
            .catch(err => console.error('Jail fetch failed:', err));
    }

    /* ============================
       RENDER LIST (uses cached players)
    ============================ */
    function renderList() {
        if (!listEl) return;

        let min = GM_getValue('hardnessMin', 0);
        let max = GM_getValue('hardnessMax', 300);
        if (isNaN(min)) min = 0;
        if (isNaN(max)) max = Infinity;

        listEl.innerHTML = '';

        let filtered = playersCache
        .filter(p => p.hardness >= minH && p.hardness <= maxH)
        .sort((a, b) => a.hardness - b.hardness);

        if (!filtered.length) {
            listEl.innerHTML = `<div style="padding:6px;color:#888">No players in range (${min}–${max})</div>`;
            return;
        }

        filtered.forEach(p => {
            const row = document.createElement('div');
            row.dataset.userId = p.id;
            row.style.cssText = `
                display:grid;
                grid-template-columns: 1fr 60px 60px;
                gap:6px;
                align-items:center;
                margin:4px 0;
                padding:6px;
                border-bottom:1px solid #333;
                border-radius:4px;
            `;

            if (isBailSkipped(p.id)) {
                row.style.cssText += BAIL_SKIPPED_STYLE;
                row.title = 'Skipped (bail over limit – cached)';
            }

            row.innerHTML = `
                <span title="${p.time} | lvl ${p.level}">${p.name}</span>
                <span>${p.hardness}</span>
                <button style="padding:2px 6px; background:#d9534f; color:#fff; border:none; border-radius:4px; cursor:pointer;">Bust</button>
            `;

            row.querySelector('button').onclick = () => bustPlayer(p.id, row);
            listEl.appendChild(row);
        });
    }

    /* ============================
       BUST ACTION
    ============================ */
    function bustPlayer(userId, rowElement) {
        const rfcv = getRfcvToken();
        if (!rfcv) return;

        const ts = Date.now(); // unique query param
        const url = `https://www.torn.com/jailview.php?XID=${userId}&action=rescue&step=breakout1&rfcv=${rfcv}&_=${ts}`;

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(r => r.json())
            .then(res => {
            if (!res?.color) return;

            rowElement.style.transition = 'background-color 0.5s, opacity 2s';

            // Check for special "no longer in jail" case
            if (res.msg && res.msg.includes("no longer in jail")) {
                rowElement.remove();
                return;
            }

            // Normal success/fail highlighting
            rowElement.style.backgroundColor = res.color === 'green' ? '#28a74599' : '#dc354599';

            if (res.color === 'green') {
                // Fade out and remove after 2.5s
                setTimeout(() => {
                    rowElement.style.opacity = '0';
                }, 500);

                setTimeout(() => {
                    rowElement.remove();
                }, 3000);
            }
        })
            .catch(err => {
            console.error('Bust failed:', err);
            rowElement.style.backgroundColor = '#dc354599'; // fail fallback
        });
    }

    function bailStepBuy(user, row) {
        const rfcv = getRfcvToken();
        if (!rfcv) return;

        const url = `https://www.torn.com/jailview.php?XID=${user.id}&action=rescue&step=buy&rfcv=${rfcv}&_=${Date.now()}`;

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(r => r.json())
            .then(res => {
            const bail = parseBailAmount(res.msg);

            if (bail === null) {
                markBailSkipped(user.id);
                bailArmedUser = null;
                return;
            }

            if (bail > MAX_BAIL) {
                markBailSkipped(user.id);
                row.style.backgroundColor = '#444';
                bailArmedUser = null;
                return;
            }

            // Arm second press
            bailArmedUser = { user, row };
            row.style.outline = '2px solid #17a2b8';
        })
            .catch(() => markBailSkipped(user.id));
    }

    function bailStepBuy1(user, row) {
        const rfcv = getRfcvToken();
        if (!rfcv) return;

        const url = `https://www.torn.com/jailview.php?XID=${user.id}&action=rescue&step=buy1&rfcv=${rfcv}&_=${Date.now()}`;

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(r => r.json())
            .then(res => {
            if (res?.color === 'green') {
                row.style.backgroundColor = '#28a74599';
                setTimeout(() => row.remove(), 2000);
            }
            bailArmedUser = null;
        })
            .catch(() => bailArmedUser = null);
    }


    /* ============================
       KEYBOARD SHORTCUT (Q = bust lowest hardness)
    ============================ */
    document.addEventListener('keydown', (e) => {
        // Only plain "Q"
        if (e.key !== 'q' && e.key !== 'Q') return;
        if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;

        // Don't trigger while typing
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        if (!playersCache.length || !listEl) return;

        const min = GM_getValue('hardnessMin', 0);
        const max = GM_getValue('hardnessMax', Infinity);

        const candidates = playersCache
        .filter(p => p.hardness >= min && p.hardness <= max)
        .sort((a, b) => a.hardness - b.hardness);

        if (!candidates.length) return;

        const target = candidates[0];

        // Find the row that matches this user
        const rows = [...listEl.children];
        const row = rows.find(r => r.textContent.includes(target.name));

        if (!row) return;

        // Visual feedback
        row.style.outline = '2px solid #ffc107';

        bustPlayer(target.id, row);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'e' && e.key !== 'E') return;
        if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;

        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        if (!playersCache.length || !listEl) return;

        // Second press: confirm bail
        if (bailArmedUser) {
            bailStepBuy1(bailArmedUser.user, bailArmedUser.row);
            return;
        }

        // First press: find next eligible target
        const min = GM_getValue('hardnessMin', 0);
        const max = GM_getValue('hardnessMax', Infinity);

        const candidates = playersCache
        .filter(p =>
                p.hardness >= min &&
                p.hardness <= max &&
                !isBailSkipped(p.id)
               )
        .sort((a, b) => a.hardness - b.hardness);

        if (!candidates.length) return;

        const user = candidates[bailIndex % candidates.length];
        bailIndex++;

        const row = [...listEl.children].find(r => r.textContent.includes(user.name));
        if (!row) return;

        row.style.outline = '2px dashed #0dcaf0';
        bailStepBuy(user, row);
    });


    createPanel();
})();

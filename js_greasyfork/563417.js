// ==UserScript==
// @name        Torn Bust Panel v3.1
// @description Enhanced: Success % est (row colors), penalty recovery proj, guide-accurate formulas, persisted timestamps
// @author      Allenone [2033011] — personalized for 50% faction + all edus/LAW3102
// @namespace   https://torn.com/
// @version     3.1.2
// @match       https://www.torn.com/jailview.php*
// @icon        https://www.torn.com/favicon.ico
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/563417/Torn%20Bust%20Panel%20v31.user.js
// @updateURL https://update.greasyfork.org/scripts/563417/Torn%20Bust%20Panel%20v31.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ────────────────────────────────────────────────
    // CONFIG CONSTANTS (edit these directly if needed)
    // ────────────────────────────────────────────────
    const MY_LEVEL = 96;                               // ← Your current level (change here when you level up)
    const API_KEY = '';                // ← Paste your full access API key here (or leave empty and set via GM)

    // ────────────────────────────────────────────────
    // CONFIG & DEFAULTS (Personalized for Allen)
    // ────────────────────────────────────────────────
    const REFRESH_RATE = 45;                             // seconds
    const LOG_CATEGORY = '5360';                         // Bust logs
    const C_PENALTY = 0.1;                               // /h from guide
    const P0_SCALE = 1800;                               // ~29% at L61, ~18% at L100 — matches guide graphs
    const M_PERKS = 2.65;                                // 1 + 0.5(faction) + 0.15(edu) + 1.0(LAW3102)
    const SUCCESS_A = 110;                               // (realistic no-pen cap 102) — 110 gives more headroom before clamping to 0
    const SUCCESS_B = 0.38;                              // slope
    const SAFE_MARGIN_BUSTS = 3;

    const DEFAULTS = {
        user_level: 100,
        hardnessMin: 0,
        hardnessMax: 400,
        bustInsteadEnabled: false,
        bustInsteadMaxHardness: 50,
        maxBailAmount: 75000,
        customPenaltyThresh: 0,
    };

    let state = {
        playersCache: [],
        timestamps: GM_getValue('bustTimestamps', []),   // persisted
        penaltyScore: 0,
        penaltyThreshold: 0,
        availableBusts: 0,
        projectedRecovery: {},
        bailSkipCache: GM_getValue('bailSkipCache', {}),
        bailArmedUser: null,
        bailIndex: 0,
        apiError: null,
        lastUpdate: 0,
        lastEAction: 0,
    };

    // Load/save other values
    Object.keys(DEFAULTS).forEach(k => {
        if (GM_getValue(k) === undefined) GM_setValue(k, DEFAULTS[k]);
        state[k] = GM_getValue(k);
    });
    state.user_level = GM_getValue('user_level', MY_LEVEL);

    const BAIL_SKIP_TTL = 10 * 60 * 1000;

    // ────────────────────────────────────────────────
    // UTILS
    // ────────────────────────────────────────────────
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

    function getRfcvToken() {
        const m = document.cookie.match(/rfc_v=([^;]+)/);
        return m ? m[1] : null;
    }

    function getStartFromURL() {
        const m = window.location.hash.match(/start=(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
    }

    function isBailSkipped(userId) {
        const ts = state.bailSkipCache[userId];
        if (!ts) return false;
        if (Date.now() - ts > BAIL_SKIP_TTL) {
            delete state.bailSkipCache[userId];
            GM_setValue('bailSkipCache', state.bailSkipCache);
            return false;
        }
        return true;
    }

    function markBailSkipped(userId) {
        state.bailSkipCache[userId] = Date.now();
        GM_setValue('bailSkipCache', state.bailSkipCache);
    }

    function parseBailAmount(msg) {
        const m = msg?.match(/\$([\d,]+)/);
        return m ? parseInt(m[1].replace(/,/g, ''), 10) : null;
    }

    function getP0() {
        return Math.max(12, P0_SCALE / state.user_level);
    }

    // ────────────────────────────────────────────────
    // PENALTY & CHANCE CALCS
    // ────────────────────────────────────────────────
    function calcPenaltyScore(timestamps = state.timestamps, now = Date.now() / 1000) {
        const P0 = getP0();
        let score = 0;
        for (const ts of timestamps) {
            const hours = (now - ts) / 3600;
            if (hours <= 72) score += P0 / (1 + C_PENALTY * hours);
        }
        return Math.floor(score);
    }

    function calcPenaltyThreshold(timestamps = state.timestamps) {
        if (state.customPenaltyThresh) return state.customPenaltyThresh;
        if (timestamps.length === 0) return getP0() * SAFE_MARGIN_BUSTS;

        const period = 72 * 3600;
        let longestSeq = 1, currSeq = 1;
        let currMin = timestamps[0], currMax = timestamps[0];
        for (let i = 1; i < timestamps.length; i++) {
            const ts = timestamps[i];
            if (currMin - ts <= period && currMax - ts <= period) {
                currSeq++;
                currMin = Math.min(currMin, ts);
                currMax = Math.max(currMax, ts);
            } else {
                longestSeq = Math.max(longestSeq, currSeq);
                currSeq = 1;
                currMin = currMax = ts;
            }
        }
        longestSeq = Math.max(longestSeq, currSeq);

        let maxScore = 0;
        const P0 = getP0();
        for (let i = 0; i <= timestamps.length - longestSeq; i++) {
            let score = 0;
            const init_ts = timestamps[i];
            for (let j = 0; j < longestSeq; j++) {
                const hours = (init_ts - timestamps[i + j]) / 3600;
                score += P0 / (1 + C_PENALTY * hours);
            }
            maxScore = Math.max(maxScore, score);
        }
        return Math.floor(maxScore);
    }

    function updatePenaltyStats(increment = false) {
        const now = Date.now() / 1000;
        state.penaltyScore = calcPenaltyScore();
        state.penaltyThreshold = calcPenaltyThreshold();
        state.availableBusts = Math.floor((state.penaltyThreshold - state.penaltyScore) / getP0());
        computeRecoveryProjection();
        updatePenaltyDisplay();
    }

    function computeRecoveryProjection() {
        state.projectedRecovery = {};
        const P0 = getP0();
        const now = Date.now() / 1000;
        for (let h = 0; h <= 72; h += 2) {
            const future_now = now + h * 3600;
            const future_score = calcPenaltyScore(state.timestamps, future_now);
            state.projectedRecovery[h] = Math.floor((state.penaltyThreshold - future_score) / P0);
        }
        state.hoursToSafe = 72;
        for (let h in state.projectedRecovery) {
            if (state.projectedRecovery[h] >= SAFE_MARGIN_BUSTS) {
                state.hoursToSafe = parseInt(h);
                break;
            }
        }
    }

    function estSuccessChance(hardness) {
        const norm_diff = hardness / (state.user_level * M_PERKS);
        const no_pen = SUCCESS_A - SUCCESS_B * norm_diff;
        return Math.max(0, Math.min(100, Math.round(no_pen - state.penaltyScore)));
    }

    // ────────────────────────────────────────────────
    // PANEL & UI
    // ────────────────────────────────────────────────
    let panel, listEl;

    const STYLE = `
        #jail-bust-panel-v3 {
            position: fixed !important; top: 90px !important; right: 16px !important;
            width: 380px; max-height: 78vh; overflow-y: auto;
            background: #181a1f !important; color: #e0e0e0 !important;
            border: 1px solid #444; border-radius: 8px; padding: 12px; z-index: 99999 !important;
            font: 13px Arial, sans-serif; box-shadow: 0 4px 16px #0006;
        }
        #jail-bust-panel-v3 input[type=number] { width: 60px; padding: 3px 6px; background: #222; color: #eee; border: 1px solid #555; border-radius: 4px; }
        #jail-bust-panel-v3 button { padding: 4px 10px; background: #2a6ebf; color: white; border: none; border-radius: 4px; cursor: pointer; }
        #jail-bust-panel-v3 button:hover { background: #3b7fd0; }
        .player-row { display: grid; grid-template-columns: 1fr 55px 45px 55px; gap: 8px; padding: 6px; margin: 4px 0; background: #222; border-radius: 5px; align-items: center; }
        .player-row.bail-skipped { background: linear-gradient(90deg, #2a2a2a, #1a1a1a); opacity: 0.8; }
        .player-row.high-chance  { background: rgba(40,167,69,0.22); }
        .player-row.medium-chance { background: rgba(255,193,7,0.18); }
        .player-row.low-chance    { background: rgba(220,53,69,0.20); opacity: 0.85; }
        .est-chance { font-weight: bold; }
        .est-chance.low { color: #dc3545; }
        .api-error { color: #ff4d4d; font-size: 11px; margin-top: 4px; }
        @media (max-width: 768px) { #jail-bust-panel-v3 { width: 96vw !important; right: 2vw !important; top: 120px !important; } }
    `;

    function createPanel() {
        if (document.getElementById('jail-bust-panel-v3')) return;
        const style = document.createElement('style');
        style.textContent = STYLE;
        document.head.appendChild(style);

        panel = document.createElement('div');
        panel.id = 'jail-bust-panel-v3';
        document.body.appendChild(panel);

        panel.innerHTML = `
        <div style="margin-bottom:10px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            <strong>Hardness</strong>
            <input id="minH" type="number" value="${state.hardnessMin}">
            <span>–</span>
            <input id="maxH" type="number" value="${state.hardnessMax}">
            <button id="applyFilter">Apply</button>
            <button id="refreshJail">Refresh</button>
        </div>
        <div style="margin:8px 0;padding:8px;background:#222;border-radius:6px;font-size:11px;">
            <strong>Penalty:</strong> <span id="penScore">–</span> / <span id="penThresh">–</span> → <span id="safeBusts">–</span> safe<br>
            <strong>Recovery:</strong> Safe (~${SAFE_MARGIN_BUSTS}) in <span id="hoursToSafe">–</span>h | 1h:<span id="proj1h">–</span> | 10h:<span id="proj10h">–</span> | 24h:<span id="proj24h">–</span>
            <div id="apiError" class="api-error"></div>
        </div>
        <div style="margin-bottom:10px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:11px;">
            <label><input id="bustInsteadToggle" type="checkbox" ${state.bustInsteadEnabled ? 'checked' : ''}> Bust instead &lt;<input id="bustInsteadValue" type="number" value="${state.bustInsteadMaxHardness}" style="width:50px;"> Hardness</label>
        </div>
        <div id="bust-list"></div>
        `;

        listEl = panel.querySelector('#bust-list');

        // Event handlers (same as before, just without level/API inputs)
        panel.querySelector('#applyFilter').onclick = () => {
            state.hardnessMin = parseInt(panel.querySelector('#minH').value) || 0;
            state.hardnessMax = parseInt(panel.querySelector('#maxH').value) || 9999;
            GM_setValue('hardnessMin', state.hardnessMin);
            GM_setValue('hardnessMax', state.hardnessMax);
            renderList();
        };

        panel.querySelector('#refreshJail').onclick = fetchJail;

        panel.querySelector('#bustInsteadToggle').onchange = () => {
            state.bustInsteadEnabled = panel.querySelector('#bustInsteadToggle').checked;
            GM_setValue('bustInsteadEnabled', state.bustInsteadEnabled);
        };

        panel.querySelector('#bustInsteadValue').onchange = e => {
            state.bustInsteadMaxHardness = parseInt(e.target.value) || 0;
            GM_setValue('bustInsteadMaxHardness', state.bustInsteadMaxHardness);
        };

        // Initial API key check
        if (!API_KEY && !GM_getValue('apiKey')) {
            state.apiError = 'No API key set — penalty tracking disabled';
        }
    }

    // ────────────────────────────────────────────────
    // FETCH & RENDER
    // ────────────────────────────────────────────────
    async function fetchJail() {
        const rfcv = getRfcvToken();
        if (!rfcv) return console.warn("No rfc_v token");
        const url = `https://www.torn.com/jailview.php?rfcv=${rfcv}&_=${Date.now()}`;
        const body = new URLSearchParams({ action: 'jail', start: getStartFromURL() });
        try {
            const r = await fetch(url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body
            });
            const data = await r.json();
            if (!data?.data?.players) return;
            state.playersCache = Object.values(data.data.players).map(p => ({
                id: p.user_id,
                name: extractName(p.print_name),
                level: p.level,
                time: p.time.trim(),
                hardness: Math.floor(p.level * (parseDurationToHours(p.time) + 3))
            }));
            renderList();
        } catch (err) {
            console.error("Jail fetch error", err);
        }
    }

    async function fetchBustLog() {
        const API_KEY = GM_getValue('apiKey', '');
        if (!API_KEY) {
            state.apiError = 'Set full API key';
            updatePenaltyDisplay();
            return;
        }
        try {
            const url = `https://api.torn.com/user/?selections=log&log=${LOG_CATEGORY}&key=${API_KEY}`;
            const r = await fetch(url);
            const data = await r.json();
            if (data.error) throw new Error(data.error.error);
            const now = Date.now() / 1000;
            state.timestamps = Object.values(data.log || {})
                .map(e => e.timestamp)
                .filter(ts => now - ts <= 80 * 3600)
                .sort((a, b) => b - a);
            GM_setValue('bustTimestamps', state.timestamps);
            state.apiError = null;
            updatePenaltyStats();
        } catch (err) {
            state.apiError = err.message;
            updatePenaltyDisplay();
        }
    }

    function renderList() {
        listEl.innerHTML = '';
        const min = state.hardnessMin, max = state.hardnessMax;
        const filtered = state.playersCache
        .filter(p => p.hardness >= min && p.hardness <= max)
        .sort((a, b) => a.hardness - b.hardness);

        if (!filtered.length) {
            listEl.innerHTML = '<div style="padding:10px;color:#777;text-align:center;">No matching targets</div>';
            return;
        }

        filtered.forEach(p => {
            const est = estSuccessChance(p.hardness);
            const chanceClass = est >= 70 ? 'high-chance' : est >= 30 ? 'medium-chance' : 'low-chance';
            const row = document.createElement('div');
            row.className = `player-row ${chanceClass}` + (isBailSkipped(p.id) ? ' bail-skipped' : '');
            row.dataset.userId = p.id;
            row.innerHTML = `
                <span title="lvl ${p.level} • ${p.time}">${p.name}</span>
                <span>${p.hardness}</span>
                <span class="est-chance ${est < 30 ? 'low' : ''}">${est}%</span>
                <button data-id="${p.id}">Bust</button>
            `;
            row.querySelector('button').onclick = () => bustPlayer(p.id, row);
            listEl.appendChild(row);
        });
    }

    function updatePenaltyDisplay() {
        document.getElementById('penScore').textContent = state.penaltyScore || '0';
        document.getElementById('penThresh').textContent = state.penaltyThreshold || '0';
        document.getElementById('safeBusts').textContent = state.availableBusts || '0';
        document.getElementById('hoursToSafe').textContent = state.hoursToSafe || '72+';
        document.getElementById('proj1h').textContent = state.projectedRecovery[1] ?? '0';
        document.getElementById('proj10h').textContent = state.projectedRecovery[10] ?? '0';
        document.getElementById('proj24h').textContent = state.projectedRecovery[24] ?? '0';
        document.getElementById('apiError').textContent = state.apiError || '';
    }

    function bustPlayer(userId, row) {
        const API_KEY = GM_getValue('apiKey', '');
        if (state.availableBusts <= 0 && API_KEY && !state.apiError) {
            if (!confirm("Penalty high — safe busts ≈ 0. Still attempt?")) return;
        }
        const rfcv = getRfcvToken();
        if (!rfcv) return;
        const url = `https://www.torn.com/jailview.php?XID=${userId}&action=rescue&step=breakout1&rfcv=${rfcv}&_=${Date.now()}`;
        fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(r => r.json())
            .then(res => {
            if (res.msg?.includes("no longer in jail")) {
                row.remove();
                return;
            }
            row.style.background = res.color === 'green' ? '#28a74588' : '#dc354588';
            if (res.color === 'green') {
                setTimeout(() => { row.style.opacity = '0'; }, 600);
                setTimeout(() => {
                    row.remove();
                    updatePenaltyStats();  // ensure penalty updated
                    state.lastEAction = Date.now();  // ← ADD: cooldown for E
                }, 2400);
            }
        })
            .catch(() => row.style.background = '#dc354588');
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
                state.bailArmedUser = null;
                return;
            }
            if (bail > state.maxBailAmount) {
                markBailSkipped(user.id);
                row.style.backgroundColor = '#444';
                state.bailArmedUser = null;
                return;
            }
            // Arm second press
            state.bailArmedUser = { user, row };
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
                setTimeout(() => {
                    row.remove();
                    state.lastEAction = Date.now();  // ← ADD: cooldown
                }, 2000);
            }
            state.bailArmedUser = null;
        })
            .catch(() => state.bailArmedUser = null);
    }

    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
        if (Date.now() - state.lastEAction < 3000) return;  // ← ADD: 3s cooldown after action

        if (e.key.toLowerCase() === 'q') {
            e.preventDefault();
            const cands = state.playersCache
            .filter(p => p.hardness >= state.hardnessMin && p.hardness <= state.hardnessMax)
            .sort((a,b) => a.hardness - b.hardness);
            if (!cands.length) return;
            const target = cands[0];
            const row = listEl.querySelector(`[data-user-id="${target.id}"]`);
            if (row) {
                row.style.outline = '2px solid gold';
                bustPlayer(target.id, row);
            }
        }

        if (e.key.toLowerCase() === 'e') {
            e.preventDefault();
            if (state.bailArmedUser) {
                bailStepBuy1(state.bailArmedUser.user, state.bailArmedUser.row);
                return;
            }
            const cands = state.playersCache
            .filter(p => p.hardness >= state.hardnessMin && p.hardness <= state.hardnessMax && !isBailSkipped(p.id))
            .sort((a,b) => a.hardness - b.hardness);
            if (!cands.length) return;
            const user = cands[state.bailIndex % cands.length];
            state.bailIndex++;
            const row = listEl.querySelector(`[data-user-id="${user.id}"]`);
            if (!row) return;
            if (state.bustInsteadEnabled && user.hardness < state.bustInsteadMaxHardness) {
                row.style.outline = '2px solid #ffc107';
                bustPlayer(user.id, row);
                return;
            }
            row.style.outline = '2px dashed #0dcaf0';
            bailStepBuy(user, row);
        }
    });

    // ────────────────────────────────────────────────
    // INIT
    // ────────────────────────────────────────────────
    createPanel();
    fetchBustLog();
    if (GM_getValue('apiKey')) setInterval(fetchBustLog, REFRESH_RATE * 1000);
    window.addEventListener('focus', updatePenaltyStats);
})();
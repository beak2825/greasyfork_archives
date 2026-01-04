// ==UserScript==
// @name         Volvo's SVS
// @namespace    https://greasyfork.org/scripts/552157-volvos-svs
// @version      1.20, 이게 1.20 으로 보이면 자동 업데이트 된거임
// @description  Single Village Snipe UI + auto sender: info_village UI patch, place auto distribution/input, timed send, auto tab close
// @author       Volvo
// @license      Volvo
// @match        https://*.tribalwars.net/game.php*
// ==/UserScript==

(function () {
    'use strict';

    const SEL_TABLE = '#possibleCombinationsTable table.ra-table';
    const K = (id, sfx) => `Volvo[${id}]${sfx}`;
    const S = {
        get: (id, s) => localStorage.getItem(K(id, s)),
        set: (id, s, v) => localStorage.setItem(K(id, s), v),
        remove: (id, s) => localStorage.removeItem(K(id, s))
    };
    const t2s = str => {
        const m = String(str || '').trim().match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
        return m ? (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) : 0;
    };
    const randThreshold9to10 = () => 9 + Math.random();

    const OPENED = new Set();
    const THRESH = new Map();

    function getVillageIdFromRow(row) {
        const link = row?.querySelector('a[href*="screen=info_village"][href*="id="]');
        if (!link) return null;
        try {
            return new URL(link.href, location.origin).searchParams.get('id');
        } catch {
            const m = link.href.match(/id=(\d+)/);
            return m ? m[1] : null;
        }
    }

    function getLaunchTimeFromRow(row) {
        const cell = row?.cells?.[4];
        if (!cell) return null;
        const full = (cell.textContent || '').trim();
        if (!full) return null;
        const parts = full.split(' ');
        const t = parts.length > 1 ? parts[1] : full;
        return /^\d{1,2}:\d{2}:\d{2}$/.test(t) ? t : null;
    }

    function getUnitTypeFromRow(row) {
        const img = row?.querySelector('img[src*="/graphic/unit/unit_"]');
        if (!img) return null;
        const m = (img.getAttribute('src') || '').match(/unit_([a-z]+)\./);
        return m ? m[1] : null;
    }

    function findSendAnchor(row) {
        return row.querySelector('a.btn[href*="screen=place"]') ||
            Array.from(row.querySelectorAll('a[href]')).find(a => a.href.includes('screen=place')) ||
            null;
    }

    function getRowURL(row) {
        const a = findSendAnchor(row);
        if (!a) return '';
        try {
            return new URL(a.href, location.origin).href;
        } catch {
            return a.getAttribute('href') || '';
        }
    }

    (function injectStyle() {
        if (document.getElementById('svs-ui-style')) return;
        const style = document.createElement('style');
        style.id = 'svs-ui-style';
        style.textContent = `
            .svs-hidden{display:none!important}
            .svs-divide-wrap{display:flex;gap:8px;align-items:center;justify-content:center}
            .svs-inputs{display:flex;flex-wrap:wrap;gap:4px;max-width:180px;justify-content:center}
            .svs-input{width:42px;text-align:center;padding:2px 4px;font-size:12px;border:1px solid #c7c7c7;border-radius:3px}
            .svs-input::-webkit-outer-spin-button,
            .svs-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
            .svs-input[type=number]{-moz-appearance:textfield}
            .svs-attack,.svs-support{margin-left:4px}
            .btn.svs-btn-active{background:linear-gradient(to bottom,#0bac00 0%,#0e7a1e 100%)!important;color:#fff!important;border-color:#006712!important}
            #TabAutoCloseBtn{margin-left:8px}
        `;
        document.head.appendChild(style);
    })();

    function ensureDivideHeader(tbl) {
        const bodyRow = tbl.querySelector('tbody tr'),
            thead = tbl.querySelector('thead');
        if (!bodyRow || !thead) return;
        const idx = bodyRow.lastElementChild?.cellIndex;
        if (idx == null) return;
        const th = thead.querySelectorAll('th')[idx];
        if (th && th.textContent.trim() !== 'Divide / Custom')
            th.textContent = 'Divide / Custom';
    }

    function percentDefaults(n) {
        const base = Math.floor(100 / n),
            rem = 100 - base * n;
        return Array.from({ length: n }, (_, i) => String(base + (i < rem ? 1 : 0)));
    }

    function buildPercentInputs(td, wrap, count, reset) {
        let vals = reset ? percentDefaults(count) : JSON.parse(td.dataset.svsPValues || '[]');
        if (!Array.isArray(vals) || vals.length !== count) vals = percentDefaults(count);
        td.dataset.svsPValues = JSON.stringify(vals);
        wrap.textContent = '';
        wrap.style.display = 'flex';
        vals.forEach((val, idx) => {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.max = '100';
            input.step = '1';
            input.className = 'svs-input';
            input.value = val;
            const commit = () => {
                const v = String(input.value || '');
                const cur = JSON.parse(td.dataset.svsPValues || '[]');
                cur[idx] = v;
                td.dataset.svsPValues = JSON.stringify(cur);
                input.value = v;
            };
            input.addEventListener('input', commit);
            input.addEventListener('blur', commit);
            wrap.appendChild(input);
        });
    }

    function buildCustomInputs(td, wrap, initDefaults) {
        const val = initDefaults ? '1000' : JSON.parse(td.dataset.svsCValues || '["1000"]')[0];
        td.dataset.svsCValues = JSON.stringify([val]);
        wrap.textContent = '';
        wrap.style.display = 'flex';
        const input = document.createElement('input');
        input.type = 'number';
        input.step = '1';
        input.className = 'svs-input';
        input.style.width = '56px';
        input.value = val;
        const commit = () => {
            const v = String(input.value || '');
            td.dataset.svsCValues = JSON.stringify([v]);
            input.value = v;
        };
        input.addEventListener('input', commit);
        input.addEventListener('blur', commit);
        wrap.appendChild(input);
    }

    function showDivide(row, show) {
        row.querySelector('td:last-child')?.classList.toggle('svs-hidden', !show);
    }

    function setDividePercent(row, n, reset = true) {
        const td = row.querySelector('td:last-child');
        if (!td) return;
        const wrap = td.querySelector('.svs-inputs');
        const btn = td.querySelector('.svs-divide');
        td.dataset.svsMode = 'percent';
        td.dataset.svsDivideN = String(n);
        if (btn) btn.textContent = `Divide: ${n}`;
        buildPercentInputs(td, wrap, n, reset);
    }

    function setDivideCustom(row, init = true) {
        const td = row.querySelector('td:last-child');
        if (!td) return;
        const wrap = td.querySelector('.svs-inputs');
        const btn = td.querySelector('.svs-divide');
        td.dataset.svsMode = 'custom';
        if (btn) btn.textContent = 'Custom';
        buildCustomInputs(td, wrap, init);
    }

    function makeDivideCell(td) {
        if (!td || td.closest('thead') || td.querySelector('.svs-divide')) return;
        td.dataset.svsDivideReady = '1';
        td.textContent = '';
        const wrap = document.createElement('div');
        wrap.className = 'svs-divide-wrap';
        const btn = document.createElement('a');
        btn.href = 'javascript:void(0)';
        btn.className = 'btn svs-divide';
        btn.textContent = 'Divide: 1';
        btn.title = 'Attack: 1→2→3→4→Custom→1 / Support: 1↔Custom';
        const inputs = document.createElement('div');
        inputs.className = 'svs-inputs';
        td.dataset.svsMode = 'percent';
        td.dataset.svsDivideN = '1';
        buildPercentInputs(td, inputs, 1, true);
        btn.addEventListener('click', () => {
            const row = td.closest('tr');
            const mode = td.dataset.svsMode;
            const n = parseInt(td.dataset.svsDivideN || '1', 10);
            const sendType = row.querySelector('.svs-btn-active')?.textContent || '';
            if (!sendType) return;
            if (sendType === 'Support') {
                if (mode === 'percent') setDivideCustom(row, true);
                else setDividePercent(row, 1, false);
            } else {
                if (mode === 'percent') {
                    if (n < 4) {
                        td.dataset.svsDivideN = String(n + 1);
                        setDividePercent(row, n + 1, true);
                    } else setDivideCustom(row, true);
                } else setDividePercent(row, 1, true);
            }
        });
        wrap.appendChild(btn);
        wrap.appendChild(inputs);
        td.appendChild(wrap);
        td.classList.add('svs-hidden');
    }

    function addAttackSupport(sendTd) {
        if (!sendTd || sendTd.querySelector('.svs-attack')) return;
        const handle = (e) => {
            e.preventDefault();
            const btn = e.currentTarget;
            const row = btn.closest('tr');
            const wasActive = btn.classList.contains('svs-btn-active');
            const allBtns = row.querySelectorAll('.svs-attack, .svs-support');
            if (wasActive) {
                btn.classList.remove('svs-btn-active');
                showDivide(row, false);
            } else {
                allBtns.forEach(b => b.classList.remove('svs-btn-active'));
                btn.classList.add('svs-btn-active');
                showDivide(row, true);
                setDividePercent(row, 1, true);
            }
        };
        const mk = (t, c) => {
            const a = document.createElement('a');
            a.href = 'javascript:void(0)';
            a.className = `btn ${c}`;
            a.textContent = t;
            a.addEventListener('click', handle);
            return a;
        };
        const sendA = sendTd.querySelector('a.btn[href*="screen=place"]');
        if (!sendA) return;
        const atk = mk('Attack', 'svs-attack');
        const sup = mk('Support', 'svs-support');
        sendA.insertAdjacentElement('afterend', atk);
        atk.insertAdjacentElement('afterend', sup);
    }

    function addTabAutoCloseButton() {
        if (document.getElementById('TabAutoCloseBtn')) return;
        const btn = document.createElement('a');
        btn.href = 'javascript:void(0)';
        btn.id = 'TabAutoCloseBtn';
        btn.className = 'btn';
        btn.textContent = 'Tab Auto Close';
        let state = localStorage.getItem('VolvoTabAutoClose');
        if (state === null) {
            state = 'Off';
            localStorage.setItem('VolvoTabAutoClose', state);
        }
        if (state === 'On') btn.classList.add('svs-btn-active');
        btn.addEventListener('click', () => {
            const cur = localStorage.getItem('VolvoTabAutoClose') || 'Off';
            const ns = cur === 'On' ? 'Off' : 'On';
            localStorage.setItem('VolvoTabAutoClose', ns);
            btn.classList.toggle('svs-btn-active', ns === 'On');
        });
        const resetBtn = document.getElementById('resetScriptBtn');
        if (resetBtn) resetBtn.insertAdjacentElement('afterend', btn);
        else(document.getElementById('content_value') || document.body).appendChild(btn);
    }

    function patchTableAndUI() {
        const tbl = document.querySelector(SEL_TABLE);
        if (!tbl) return;
        ensureDivideHeader(tbl);
        tbl.querySelectorAll('tbody tr').forEach(tr => {
            if (!tr.dataset.svsUiPatched) {
                const tds = [...tr.children];
                const sendTd = tds.find(td => td.querySelector('a.btn[href*="screen=place"]'));
                addAttackSupport(sendTd);
                const last = tr.querySelector('td:last-child');
                if (last) makeDivideCell(last);
                tr.dataset.svsUiPatched = '1';
            }
        });
        addTabAutoCloseButton();
    }

    function extractTimeWithOptionalMs(val) {
        const str = String(val || '');
        const m = str.match(/(\d{1,2}:\d{2}:\d{2})(?::\d{1,3})?/);
        return m ? m[0] : '';
    }

    function readServerNowSec() {
        const el = document.getElementById('serverTime');
        return el ? t2s((el.textContent || '').trim()) : 0;
    }

    function snapshotAndOpen(row) {
        const id = getVillageIdFromRow(row);
        if (!id) return;
        const url = getRowURL(row);
        if (!url) return;
        const type = row.querySelector('.svs-attack.svs-btn-active,.svs-support.svs-btn-active')?.textContent || '';
        const unit = getUnitTypeFromRow(row) || '';
        if (type || unit) S.set(id, 'Send', JSON.stringify({ type, unit }));
        S.set(id, 'URL', url);
        const td = row.querySelector('td:last-child[data-svs-divide-ready="1"]');
        if (!td) return;
        const mode = td.dataset.svsMode || 'percent';
        if (mode === 'custom') {
            const input = td.querySelector('.svs-input');
            const raw = String(input?.value ?? '1000');
            S.set(id, 'Divide', JSON.stringify({ mode: 'custom', count: '1', '#1': raw }));
        } else {
            const count = Math.max(1, Math.min(4, parseInt(td.dataset.svsDivideN || '1', 10) || 1));
            const inputs = Array.from(td.querySelectorAll('.svs-input') || []);
            const obj = { mode: 'percent', count: String(count) };
            for (let i = 1; i <= count; i++) {
                obj['#' + i] = String(inputs[i - 1]?.value ?? '');
            }
            S.set(id, 'Divide', JSON.stringify(obj));
        }
        const ltEl = document.getElementById('raLandingTime');
        if (ltEl) {
            const t = extractTimeWithOptionalMs(ltEl.value);
            if (t) S.set(id, 'LandingTime', t);
        }
        const launchTime = getLaunchTimeFromRow(row);
        if (launchTime) S.set(id, 'LaunchTime', launchTime);
        try {
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch {}
    }

    function autoOpenLoop() {
        const nowSec = readServerNowSec();
        if (!nowSec) return;
        const tbl = document.querySelector(SEL_TABLE);
        if (!tbl) return;
        let best = { row: null, key: null, diff: 1e9 };
        tbl.querySelectorAll('tbody tr').forEach(tr => {
            const activeBtn = tr.querySelector('.svs-attack.svs-btn-active, .svs-support.svs-btn-active');
            if (!activeBtn) return;
            const id = getVillageIdFromRow(tr);
            if (!id) return;
            const lt = getLaunchTimeFromRow(tr);
            if (!lt) return;
            const url = getRowURL(tr);
            if (!url) return;
            let diff = t2s(lt) - nowSec;
            if (diff < -43200) diff += 86400;
            const key = `${id}|${lt}|${url}`;
            if (OPENED.has(key)) return;
            if (diff > 0 && diff < best.diff) best = { row: tr, key, diff };
        });
        if (!best.row) return;
        if (!THRESH.has(best.key)) THRESH.set(best.key, randThreshold9to10());
        if (best.diff <= THRESH.get(best.key)) {
            OPENED.add(best.key);
            snapshotAndOpen(best.row);
        }
    }

    function start() {
        patchTableAndUI();
        const root = document.querySelector('#possibleCombinationsTable') || document.body;
        const mo = new MutationObserver(() => patchTableAndUI());
        mo.observe(root, { childList: true, subtree: true });
        setInterval(autoOpenLoop, 500);
        setInterval(updateServerTime, 500);
        setInterval(autoCloseAndCleanup, 1000);
    }

    function updateServerTime() {
        const serverTime = readServerTime();
        if (serverTime && /^\d{1,2}:\d{2}:\d{2}$/.test(serverTime)) {
            const dateEl = document.getElementById('serverDate');
            if (dateEl) {
                const dateText = (dateEl.textContent || '').trim();
                const dateMatch = dateText.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                if (dateMatch) {
                    const [, mm, dd, yyyy] = dateMatch;
                    const formattedDateTime = `${yyyy}-${mm}-${dd} ${serverTime}`;
                    localStorage.setItem('VolvoServerTime', formattedDateTime);
                    return;
                }
            }
            localStorage.setItem('VolvoServerTime', serverTime);
        }
    }

    function getVillageIdFromURL() {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.get('village') || null;
        } catch {
            const m = window.location.href.match(/village=(\d+)/);
            return m ? m[1] : null;
        }
    }

    function cleanupStorage(id) {
        const keys = ['LandingTime', 'Divide', 'Send', 'URL', 'LaunchTime', 'UnitCount'];
        keys.forEach(k => S.remove(id, k));
    }

    function readServerTime() {
        const el = document.getElementById('serverTime');
        if (!el) {
            const dateEl = document.getElementById('serverDate');
            if (dateEl) {
                const text = (dateEl.textContent || '').trim();
                const match = text.match(/(\d{1,2}:\d{2}:\d{2})/);
                if (match) return match[1];
            }
            return null;
        }
        const text = (el.textContent || el.innerText || '').trim();
        const match = text.match(/(\d{1,2}:\d{2}:\d{2})/);
        return match ? match[1] : null;
    }

    function autoCloseAndCleanup() {
        const serverTimeRaw = localStorage.getItem('VolvoServerTime');
        if (!serverTimeRaw) return;

        let serverTime;
        const fullMatch = serverTimeRaw.match(/\d{4}-\d{2}-\d{2} (\d{1,2}:\d{2}:\d{2})/);
        if (fullMatch) {
            serverTime = fullMatch[1];
        } else if (/^\d{1,2}:\d{2}:\d{2}$/.test(serverTimeRaw)) {
            serverTime = serverTimeRaw;
        } else {
            return;
        }

        const serverSec = t2s(serverTime);

        const qs = new URLSearchParams(window.location.search);
        const isPlacePage = qs.get('screen') === 'place';

        if (isPlacePage) {
            const id = getVillageIdFromURL();
            if (!id) return;
            const launchTime = S.get(id, 'LaunchTime');
            if (!launchTime) return;
            const launchSec = t2s(launchTime);
            let diff = serverSec - launchSec;
            if (diff < -43200) diff += 86400;
            if (diff >= 3) {
                const autoClose = localStorage.getItem('VolvoTabAutoClose');
                cleanupStorage(id);
                if (autoClose === 'On') {
                    window.close();
                }
            }
        } else {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key || !key.startsWith('Volvo[') || !key.includes(']LaunchTime')) continue;
                const match = key.match(/^Volvo\[(\d+)\]LaunchTime$/);
                if (!match) continue;
                const id = match[1];
                const launchTime = S.get(id, 'LaunchTime');
                if (!launchTime) continue;
                const launchSec = t2s(launchTime);
                let diff = serverSec - launchSec;
                if (diff < -43200) diff += 86400;
                if (diff >= 3) {
                    cleanupStorage(id);
                }
            }
        }
    }

    start();

    const randDelay = () => 200 + Math.floor(Math.random() * 201);
    const shortDelay = () => 20 + Math.floor(Math.random() * 21);

    const UNIT_MAP = {
        spear:    ['spear', 'spy', 'heavy'],
        sword:    ['spear', 'sword', 'spy', 'heavy'],
        axe:      ['axe', 'spy', 'light'],
        light:    ['light'],
        heavy:    ['heavy'],
        ram:      ['spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult'],
        catapult: ['spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult'],
        snob:     ['snob', 'spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult'],
    };

    function getAllUnitInputs() {
        return {
            spear:    document.getElementById('unit_input_spear'),
            sword:    document.getElementById('unit_input_sword'),
            axe:      document.getElementById('unit_input_axe'),
            spy:      document.getElementById('unit_input_spy'),
            light:    document.getElementById('unit_input_light'),
            heavy:    document.getElementById('unit_input_heavy'),
            ram:      document.getElementById('unit_input_ram'),
            catapult: document.getElementById('unit_input_catapult'),
            snob:     document.getElementById('unit_input_snob'),
        };
    }

    function readAllCounts(unitInputs) {
        const counts = {};
        for (const [unit, input] of Object.entries(unitInputs)) {
            if (!input) continue;
            const allCount = input.getAttribute('data-all-count');
            counts[unit] = parseInt(allCount || '0', 10) || 0;
        }
        return counts;
    }

    function setAmount(input, value) {
        if (!input) return;
        input.value = value > 0 ? String(value) : '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function applyDivideMode(unitType, percent, unitCounts, unitInputs) {
        const group = UNIT_MAP[unitType] || (unitInputs[unitType] ? [unitType] : []);
        if (!group.length) return;
        const p = Math.max(0, Math.min(100, percent));
        for (const u of group) {
            if (unitType === 'snob' && u === 'snob') {
                setAmount(unitInputs[u], 1);
            } else {
                setAmount(unitInputs[u], Math.floor((unitCounts[u] || 0) * p / 100));
            }
        }
    }

    function applyMultiAttackMode(unitType, attackCount, percent, unitCounts, unitInputs) {
        const group = UNIT_MAP[unitType] || (unitInputs[unitType] ? [unitType] : []);
        if (!group.length) return;
        const hasRam = (unitCounts.ram || 0) > 0;
        const hasCat = (unitCounts.catapult || 0) > 0;
        const reserve = attackCount - 1;
        const p = Math.max(0, Math.min(100, percent));

        for (const t of group) {
            const n = unitCounts[t] || 0;
            const inp = unitInputs[t];
            if (!inp) continue;
            let cnt = 0;

            if (t === 'ram' || t === 'catapult') {
                if (unitType === 'snob') {
                    if (t === 'ram') cnt = hasRam ? Math.max(n - reserve, 0) : 0;
                    else if (t === 'catapult') cnt = (!hasRam && hasCat) ? Math.max(n - reserve, 0) : 0;
                } else if (unitType === 'ram') {
                    if (t === 'ram' && hasRam) cnt = Math.max(n - reserve, 0);
                    else if (t === 'catapult' && hasRam) cnt = n;
                    else if (t === 'catapult' && !hasRam) cnt = Math.max(n - reserve, 0);
                } else if (unitType === 'catapult') {
                    if (t === 'catapult') cnt = Math.max(n - reserve, 0);
                    else if (t === 'ram') cnt = n;
                }
            } else if (t === 'snob') {
                cnt = unitType === 'snob' ? 1 : 0;
            } else {
                cnt = Math.floor(n * p / 100);
            }
            setAmount(inp, cnt);
        }
    }

    function applyCustomMode(unitType, customTotal, unitCounts, unitInputs) {
        const cap = Math.max(0, customTotal | 0);
        const group = (UNIT_MAP[unitType] || (unitInputs[unitType] ? [unitType] : []))
            .map(u => ({ unit: u, input: unitInputs[u], available: unitCounts[u] || 0 }))
            .filter(e => e.input);
        const total = group.reduce((s, e) => s + e.available, 0);
        if (total <= 0) { group.forEach(e => setAmount(e.input, 0)); return; }
        if (cap >= total) { group.forEach(e => setAmount(e.input, e.available)); return; }

        const scale = cap / total;
        let floorSum = 0;
        const dist = group.map(e => {
            const exact = e.available * scale;
            const base = Math.floor(exact);
            floorSum += base;
            return { ...e, base, fraction: exact - base };
        });
        let rem = cap - floorSum;
        dist.sort((a, b) => b.fraction - a.fraction);
        for (let i = 0; i < dist.length && rem > 0; i++) {
            if (dist[i].base < dist[i].available) { dist[i].base++; rem--; }
        }
        for (const d of dist) setAmount(d.input, d.base);
    }

    function setTrainValue(rowIdx, unitKey, val) {
        const inp = document.querySelector(`input[type="number"][name="train[${rowIdx}][${unitKey}]"]`);
        if (!inp) return;
        inp.value = val > 0 ? String(val) : '';
        inp.setAttribute('value', inp.value);
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function getTrainRows() {
        const rows = new Set();
        document.querySelectorAll('input[type="number"][name^="train["]').forEach(el => {
            const m = el.name.match(/^train\[(\d+)\]\[/);
            if (m) rows.add(parseInt(m[1], 10));
        });
        return Array.from(rows).sort((a, b) => a - b);
    }

    function handleTimedClick(submitBtn, villageId) {
        const landingTime = localStorage.getItem(K(villageId, 'LandingTime'));
        if (!landingTime || landingTime.trim() === '') {
            submitBtn.click();
            return;
        }

        const parts = landingTime.split(':');
        if (parts.length < 3) {
            submitBtn.click();
            return;
        }

        const [hh, mm, ss, ms] = parts;
        const targetHms = `${hh}:${mm}:${ss}`;
        const targetMs = parseInt(ms || '0', 10);
        const relativeTimeEl = document.querySelector('.relative_time');

        if (!relativeTimeEl) {
            submitBtn.click();
            return;
        }

        const readTime = () => {
            const text = relativeTimeEl.textContent || relativeTimeEl.innerText || '';
            const match = text.match(/\d{2}:\d{2}:\d{2}/);
            return match ? match[0] : null;
        };

        const currentTime = readTime();
        const parseHMS = (hms) => {
            if (!hms) return null;
            const [h, m, s] = hms.split(':').map(Number);
            return h * 3600 + m * 60 + s;
        };

        const currentSec = parseHMS(currentTime);
        const targetSec = parseHMS(targetHms);

        if (currentSec !== null && targetSec !== null && currentSec > targetSec) {
            submitBtn.click();
            return;
        }

        const interval = setInterval(() => {
            if (readTime() === targetHms) {
                setTimeout(() => submitBtn.click(), targetMs);
                clearInterval(interval);
            }
        }, 5);
    }

    async function handleConfirmScreen() {
        const qs = new URLSearchParams(location.search);
        const villageId = qs.get('village');
        if (!villageId) return;

        const sendRaw = localStorage.getItem(K(villageId, 'Send'));
        const divideRaw = localStorage.getItem(K(villageId, 'Divide')) || localStorage.getItem(K(villageId, 'Divde'));
        const unitCountRaw = localStorage.getItem(K(villageId, 'UnitCount'));
        if (!sendRaw || !divideRaw || !unitCountRaw) return;

        const sendConfig = JSON.parse(sendRaw);
        const divideConfig = JSON.parse(divideRaw);
        const unitCounts = JSON.parse(unitCountRaw);
        const unitType = sendConfig.unit;
        const attackCount = parseInt(String(divideConfig.count || '1'), 10);

        if (attackCount <= 1) {
            await new Promise(r => setTimeout(r, randDelay()));
            const submitBtn = document.querySelector('.troop_confirm_go, #troop_confirm_submit');
            if (!submitBtn) return;
            const flagKey = K(villageId, 'ConfirmClicked');
            if (sessionStorage.getItem(flagKey) === '1') return;
            sessionStorage.setItem(flagKey, '1');
            handleTimedClick(submitBtn, villageId);
            return;
        }

        const trainBtn = document.getElementById('troop_confirm_train');
        if (!trainBtn) return;

        const toAdd = attackCount - 1;
        for (let i = 0; i < toAdd; i++) {
            if (i === 0) await new Promise(r => setTimeout(r, shortDelay()));
            trainBtn.click();
            await new Promise(r => setTimeout(r, shortDelay()));
        }

        await new Promise(r => setTimeout(r, shortDelay()));

        const rows = getTrainRows();
        if (rows.length === 0) return;

        const allUnits = ['spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult', 'snob'];
        rows.forEach(rowIdx => {
            allUnits.forEach(unit => setTrainValue(rowIdx, unit, 0));
        });

        await new Promise(r => setTimeout(r, shortDelay()));

        const group = UNIT_MAP[unitType] || [unitType];
        rows.forEach(rowIdx => {
            const percent = parseInt(String(divideConfig[`#${rowIdx}`] || '0'), 10);
            group.forEach(unit => {
                let amount = 0;
                if ((unitType === 'snob' && unit === 'snob') ||
                    (unitType === 'ram' && unit === 'ram') ||
                    (unitType === 'catapult' && unit === 'catapult')) {
                    amount = 1;
                } else if (unit !== 'ram' && unit !== 'catapult' && unit !== 'snob') {
                    amount = Math.floor((unitCounts[unit] || 0) * percent / 100);
                }
                setTrainValue(rowIdx, unit, amount);
            });
        });

        await new Promise(r => setTimeout(r, randDelay()));

        const submitBtn = document.querySelector('.troop_confirm_go, #troop_confirm_submit');
        if (!submitBtn) return;
        const flagKey = K(villageId, 'ConfirmClicked');
        if (sessionStorage.getItem(flagKey) === '1') return;
        sessionStorage.setItem(flagKey, '1');
        handleTimedClick(submitBtn, villageId);
    }

    function handlePlaceScreen() {
        const qs = new URLSearchParams(location.search);
        const villageId = qs.get('village');
        if (!villageId) return;

        const hasSend = !!localStorage.getItem(K(villageId, 'Send'));
        const hasDivide = !!localStorage.getItem(K(villageId, 'Divide')) || !!localStorage.getItem(K(villageId, 'Divde'));
        const hasCustom = !!localStorage.getItem(K(villageId, 'Custom'));
        if (!hasSend && !hasDivide && !hasCustom) return;

        const isReady = () => {
            const any = document.querySelector(
                '#unit_input_spear, #unit_input_sword, #unit_input_axe, ' +
                '#unit_input_spy, #unit_input_light, #unit_input_heavy, ' +
                '#unit_input_ram, #unit_input_catapult, #unit_input_snob'
            );
            return !!(any && any.getAttribute('data-all-count') !== null);
        };

        function parseSend() {
            let sendType = null;
            let unitType = null;
            const raw = localStorage.getItem(K(villageId, 'Send'));
            if (raw) {
                try {
                    const j = JSON.parse(raw);
                    if (j && typeof j === 'object') {
                        if (j.type === 'Attack' || j.type === 'Support') sendType = j.type;
                        if (typeof j.unit === 'string' && j.unit) unitType = j.unit;
                    }
                } catch (_) {}
            }
            if (!unitType) {
                const order = ['snob', 'catapult', 'ram', 'axe', 'light', 'heavy', 'spear', 'sword'];
                for (const u of order) {
                    const v = qs.get(u);
                    if (v && parseInt(v, 10) > 0) { unitType = u; break; }
                }
            }
            return { sendType, unitType };
        }

        function parseDivide() {
            let raw = localStorage.getItem(K(villageId, 'Divide'));
            if (!raw) raw = localStorage.getItem(K(villageId, 'Divde'));
            if (raw) {
                try {
                    const j = JSON.parse(raw);
                    if (j && typeof j === 'object') return j;
                } catch (_) {}
            }
            return null;
        }

        const fillTroops = () => {
            const unitInputs = getAllUnitInputs();
            const unitCounts = readAllCounts(unitInputs);
            localStorage.setItem(K(villageId, 'UnitCount'), JSON.stringify(unitCounts));

            const { sendType, unitType } = parseSend();
            if (!unitType) return;

            const divideConfig = parseDivide();

            if (divideConfig && divideConfig.mode === 'custom' && divideConfig['#1']) {
                const customTotal = parseInt(String(divideConfig['#1']), 10);
                if (!isNaN(customTotal) && customTotal > 0) {
                    applyCustomMode(unitType, customTotal, unitCounts, unitInputs);
                    return sendType;
                }
            }

            const customRaw = localStorage.getItem(K(villageId, 'Custom'));
            if (customRaw && customRaw.trim() !== '') {
                const customTotal = parseInt(customRaw, 10);
                if (!isNaN(customTotal) && customTotal > 0) {
                    applyCustomMode(unitType, customTotal, unitCounts, unitInputs);
                    return sendType;
                }
            }

            if (divideConfig && parseInt(String(divideConfig.count || '1'), 10) > 1 &&
                (unitType === 'ram' || unitType === 'catapult' || unitType === 'snob')) {
                const percent = parseInt(String(divideConfig['#1'] || '100'), 10);
                applyMultiAttackMode(unitType, parseInt(String(divideConfig.count), 10), percent, unitCounts, unitInputs);
                return sendType;
            }

            if (divideConfig && divideConfig.mode === 'percent' && divideConfig['#1']) {
                const percent = parseInt(String(divideConfig['#1']), 10);
                if (!isNaN(percent)) {
                    applyDivideMode(unitType, percent, unitCounts, unitInputs);
                    return sendType;
                }
            }

            const legacyPercent = parseInt(localStorage.getItem(K(villageId, 'Divide#1')) || '100', 10);
            applyDivideMode(unitType, legacyPercent, unitCounts, unitInputs);
            return sendType;
        };

        const clickButton = (sendType) => {
            const flagKey = K(villageId, 'PlaceClicked');
            if (sessionStorage.getItem(flagKey) === '1') return;
            const btn = sendType === 'Attack' ? document.getElementById('target_attack') :
                        sendType === 'Support' ? document.getElementById('target_support') : null;
            if (!btn) return;
            sessionStorage.setItem(flagKey, '1');
            setTimeout(() => {
                const form = btn.closest('form');
                if (form && form.requestSubmit) form.requestSubmit(btn);
                else btn.click();
            }, randDelay());
        };

        const execute = () => {
            setTimeout(() => {
                const sendType = fillTroops();
                setTimeout(() => clickButton(sendType), randDelay());
            }, shortDelay());
        };

        let executed = false;
        const tryExecute = () => {
            if (executed) return;
            if (isReady()) {
                executed = true;
                observer.disconnect();
                clearInterval(poll);
                clearTimeout(hard);
                execute();
            }
        };

        const observer = new MutationObserver(tryExecute);
        observer.observe(document.body, { childList: true, subtree: true });
        const poll = setInterval(tryExecute, 20);
        const hard = setTimeout(() => {
            if (!executed) {
                executed = true;
                observer.disconnect();
                clearInterval(poll);
                execute();
            }
        }, 1200);
    }

    const qs = new URLSearchParams(location.search);
    if (location.pathname.includes('/game.php') && qs.get('screen') === 'place') {
        if (qs.get('try') === 'confirm') {
            const checkReady = () => !!document.getElementById('troop_confirm_train');
            let executed = false;
            const tryExecute = () => {
                if (executed) return;
                if (checkReady()) {
                    executed = true;
                    observer.disconnect();
                    clearInterval(poll);
                    clearTimeout(hard);
                    handleConfirmScreen();
                }
            };
            const observer = new MutationObserver(tryExecute);
            observer.observe(document.body, { childList: true, subtree: true });
            const poll = setInterval(tryExecute, 20);
            const hard = setTimeout(() => {
                if (!executed) {
                    executed = true;
                    observer.disconnect();
                    clearInterval(poll);
                    handleConfirmScreen();
                }
            }, 1500);
        } else {
            handlePlaceScreen();
        }
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const qs = new URLSearchParams(location.search);
            if (location.pathname.includes('/game.php') &&
                qs.get('screen') === 'place' &&
                qs.get('try') === 'confirm') {
                setTimeout(() => {
                    if (document.getElementById('troop_confirm_train')) handleConfirmScreen();
                }, 500);
            }
        }
    }).observe(document, {subtree: true, childList: true});
})();
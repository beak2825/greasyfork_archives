// ==UserScript==
// @name         Escape tracker
// @namespace    torn.com
// @version      1.5
// @description  Escape tracker (attacksfull → outgoing → Escape)
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561559/Escape%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/561559/Escape%20tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COMMENT = 'SuperGogu-escape-tracker';

    const STORE_KEY = 'et_apiKey';
    const STORE_POS = 'et_panelPos';
    const STORE_FROM = 'et_fromTs';
    const STORE_COUNTS = 'et_escapeCounts';
    const STORE_NAMES = 'et_userNames';
    const STORE_HIDDEN = 'et_hidden';

    const MIN_API_GAP_MS = 700;
    let lastApiCallAt = 0;

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const apiFetch = async (url, options) => {
        const now = Date.now();
        const wait = Math.max(0, MIN_API_GAP_MS - (now - lastApiCallAt));
        if (wait) await sleep(wait);
        lastApiCallAt = Date.now();
        return fetch(url, options);
    };

    const nowTs = () => Math.floor(Date.now() / 1000);
    const twoWeeksAgoTs = () => nowTs() - 14 * 24 * 60 * 60;

    const fmtTs = (ts) => {
        if (!ts || !Number.isFinite(ts)) return '—';
        try { return new Date(ts * 1000).toLocaleString(); } catch { return '—'; }
    };

    const savedKey = (GM_getValue(STORE_KEY, '') || '').trim();
    const savedPos = GM_getValue(STORE_POS, { left: 40, top: 120 });
    const isHidden = !!GM_getValue(STORE_HIDDEN, false);

    let fromTs = GM_getValue(STORE_FROM, twoWeeksAgoTs());
    let counts = GM_getValue(STORE_COUNTS, {});
    if (!counts || typeof counts !== 'object' || Array.isArray(counts)) counts = {};

    let userNames = GM_getValue(STORE_NAMES, {});
    if (!userNames || typeof userNames !== 'object' || Array.isArray(userNames)) userNames = {};

    GM_addStyle(`
        #et-panel {
            position: fixed;
            width: 340px;
            background: #2b2b2b;
            border: 2px solid #00ff66;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.45);
            z-index: 999999;
            color: #e8e8e8;
            font-family: Arial, Helvetica, sans-serif;
            user-select: none;
        }
        #et-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 10px 8px 10px;
            cursor: move;
            border-bottom: 1px solid rgba(0,255,102,0.35);
            touch-action: none;
        }
        #et-title {
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.2px;
        }
        #et-controls {
            display: flex;
            gap: 8px;
        }
        .et-btn {
            background: #1f1f1f;
            color: #e8e8e8;
            border: 1px solid rgba(0,255,102,0.55);
            border-radius: 8px;
            padding: 6px 10px;
            font-size: 12px;
            cursor: pointer;
            white-space: nowrap;
        }
        .et-btn:hover { filter: brightness(1.12); }
        .et-btn:active { transform: translateY(1px); }
        .et-btn[disabled] { opacity: 0.55; cursor: not-allowed; }
        #et-body {
            padding: 10px;
            user-select: text;
        }
        .et-row {
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 10px;
        }
        #et-apiKey {
            flex: 1;
            background: #1f1f1f;
            color: #e8e8e8;
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 8px;
            padding: 8px 10px;
            outline: none;
            font-size: 12px;
            min-width: 0;
        }
        #et-apiKey:focus {
            border-color: rgba(0,255,102,0.7);
            box-shadow: 0 0 0 2px rgba(0,255,102,0.18);
        }
        #et-status {
            font-size: 12px;
            opacity: 0.95;
            padding: 7px 8px;
            background: rgba(255,255,255,0.06);
            border-radius: 8px;
            line-height: 1.25;
            flex: 1;
            min-width: 0;
        }
        #et-meta {
            font-size: 12px;
            opacity: 0.9;
            padding: 7px 8px;
            background: rgba(0,255,102,0.08);
            border: 1px solid rgba(0,255,102,0.25);
            border-radius: 8px;
            line-height: 1.25;
            margin-bottom: 10px;
            white-space: pre-line;
        }
        #et-list {
            background: rgba(0,0,0,0.18);
            border: 1px solid rgba(255,255,255,0.14);
            border-radius: 10px;
            padding: 10px;
            max-height: 260px;
            overflow: auto;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
            font-size: 12px;
            line-height: 1.35;
            white-space: pre;
        }
        #et-list .dim { opacity: 0.75; }

        #et-gear {
            position: fixed;
            left: 14px;
            right: auto;
            bottom: 14px;
            width: 44px;
            height: 44px;
            border-radius: 999px;
            background: #2b2b2b;
            border: 2px solid #00ff66;
            box-shadow: 0 10px 30px rgba(0,0,0,0.45);
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            font-size: 20px;
            line-height: 1;
            color: #e8e8e8;
        }
        #et-gear:hover { filter: brightness(1.12); }
        #et-gear:active { transform: translateY(1px); }
    `);

    if (document.getElementById('et-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'et-panel';
    panel.style.left = `${Math.max(0, Number(savedPos.left) || 40)}px`;
    panel.style.top = `${Math.max(0, Number(savedPos.top) || 120)}px`;

    const gear = document.createElement('div');
    gear.id = 'et-gear';
    gear.textContent = '⚙';
    document.body.appendChild(gear);

    const header = document.createElement('div');
    header.id = 'et-header';

    const title = document.createElement('div');
    title.id = 'et-title';
    title.textContent = 'Escape tracker';

    const controls = document.createElement('div');
    controls.id = 'et-controls';

    const btnHide = document.createElement('button');
    btnHide.className = 'et-btn';
    btnHide.type = 'button';
    btnHide.textContent = 'Hide';

    controls.appendChild(btnHide);
    header.appendChild(title);
    header.appendChild(controls);

    const body = document.createElement('div');
    body.id = 'et-body';

    const rowKey = document.createElement('div');
    rowKey.className = 'et-row';

    const input = document.createElement('input');
    input.id = 'et-apiKey';
    input.type = 'password';
    input.placeholder = 'Enter Torn API key';
    input.value = savedKey;

    const btnSave = document.createElement('button');
    btnSave.className = 'et-btn';
    btnSave.type = 'button';
    btnSave.textContent = 'Save';

    const btnShow = document.createElement('button');
    btnShow.className = 'et-btn';
    btnShow.type = 'button';
    btnShow.textContent = 'Show';

    rowKey.appendChild(input);
    rowKey.appendChild(btnSave);
    rowKey.appendChild(btnShow);

    const meta = document.createElement('div');
    meta.id = 'et-meta';

    const rowActions = document.createElement('div');
    rowActions.className = 'et-row';

    const btnGet = document.createElement('button');
    btnGet.className = 'et-btn';
    btnGet.type = 'button';
    btnGet.textContent = 'Get Escapes';

    const btnReset = document.createElement('button');
    btnReset.className = 'et-btn';
    btnReset.type = 'button';
    btnReset.textContent = 'Reset';

    const status = document.createElement('div');
    status.id = 'et-status';

    rowActions.appendChild(btnGet);
    rowActions.appendChild(btnReset);
    rowActions.appendChild(status);

    const list = document.createElement('div');
    list.id = 'et-list';

    body.appendChild(rowKey);
    body.appendChild(meta);
    body.appendChild(rowActions);
    body.appendChild(list);

    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);

    const setStatus = (msg) => { status.textContent = msg; };

    const renderMeta = () => {
        const keySaved2 = !!(GM_getValue(STORE_KEY, '') || '').trim();
        const namesCount = Object.keys(userNames || {}).length;
        const defendersCount = Object.keys(counts || {}).length;
        meta.textContent =
            `From timestamp: ${fmtTs(fromTs)}\n` +
            `API key: ${keySaved2 ? 'saved' : 'missing'}\n` +
            `Cached names: ${namesCount} | Defenders tracked: ${defendersCount}`;
    };

    const renderList = () => {
        const entries = Object.entries(counts || {})
            .map(([id, c]) => [String(id), Number(c) || 0])
            .filter(([, c]) => c > 0)
            .sort((a, b) => (b[1] - a[1]) || (a[0].localeCompare(b[0])));

        const total = entries.reduce((s, [, c]) => s + c, 0);

        if (!entries.length) {
            list.innerHTML = `<span class="dim">No escape data yet.</span>`;
            return;
        }

        const rows = entries.map(([id, c]) => {
            const name = (userNames && userNames[id]) ? String(userNames[id]) : null;
            const label = name ? `${name} [${id}]` : `ID ${id}`;
            return { label, c };
        });

        const labelW = Math.max(10, ...rows.map(r => r.label.length));
        const cW = Math.max(6, ...rows.map(r => String(r.c).length));

        const headerLine = `${'Defender'.padEnd(labelW)}  ${'Escapes'.padStart(cW)}`;
        const sep = `${'-'.repeat(labelW)}  ${'-'.repeat(cW)}`;
        const lines = rows.map(r => `${r.label.padEnd(labelW)}  ${String(r.c).padStart(cW)}`);

        list.textContent = `${headerLine}\n${sep}\n${lines.join('\n')}\n\nTotal escapes: ${total}`;
    };

    const safeJson = async (res) => {
        const txt = await res.text();
        try { return JSON.parse(txt); } catch { return { error: { code: res.status, message: txt || 'Invalid JSON' } }; }
    };

    const addCommonParams = (u, key) => {
        if (!u.searchParams.get('key')) u.searchParams.set('key', key);
        if (!u.searchParams.get('comment')) u.searchParams.set('comment', COMMENT);
        return u;
    };

    const buildFirstUrl = (key, from) => {
        const u = new URL('https://api.torn.com/v2/user/attacksfull');
        u.searchParams.set('filters', 'outgoing');
        u.searchParams.set('limit', '1000');
        u.searchParams.set('sort', 'ASC');
        u.searchParams.set('from', String(from));
        return addCommonParams(u, key);
    };

    const buildUserBasicUrl = (key, userId) => {
        const u = new URL(`https://api.torn.com/v2/user/${encodeURIComponent(String(userId))}/basic`);
        u.searchParams.set('striptags', 'true');
        return addCommonParams(u, key);
    };

    const fetchAndCacheName = async (key, userId) => {
        const id = String(userId);
        if (userNames[id]) return userNames[id];

        const url = buildUserBasicUrl(key, id);
        const res = await apiFetch(url.toString(), { method: 'GET', headers: { accept: 'application/json' } });
        const data = await safeJson(res);

        if (!res.ok || data?.error) return null;

        const name = data?.profile?.name ? String(data.profile.name) : null;
        if (name) {
            userNames[id] = name;
            GM_setValue(STORE_NAMES, userNames);
        }
        return name;
    };

    const fetchAllEscapes = async () => {
        const key = (GM_getValue(STORE_KEY, '') || '').trim();
        if (!key) {
            setStatus('Please enter and save an API key.');
            return;
        }

        btnGet.disabled = true;
        btnReset.disabled = true;
        setStatus('Fetching...');

        let url = buildFirstUrl(key, fromTs);
        let pages = 0;
        let totalAttacks = 0;
        let newEscapes = 0;
        let maxEnded = fromTs;
        const missingIds = new Set();
        const MAX_PAGES = 200;

        try {
            while (url) {
                pages += 1;
                if (pages > MAX_PAGES) throw new Error('Too many pages (safety stop).');
                setStatus(`Fetching... page ${pages} | attacks ${totalAttacks} | new escapes ${newEscapes}`);

                const res = await apiFetch(url.toString(), { method: 'GET', headers: { accept: 'application/json' } });
                const data = await safeJson(res);

                if (!res.ok || data?.error) {
                    const msg = data?.error?.message || `HTTP ${res.status}`;
                    throw new Error(msg);
                }

                const attacks = Array.isArray(data.attacks) ? data.attacks : [];
                totalAttacks += attacks.length;

                for (const a of attacks) {
                    const ended = Number(a?.ended);
                    if (Number.isFinite(ended) && ended > maxEnded) maxEnded = ended;

                    if (a?.result === 'Escape') {
                        const did = a?.defender?.id;
                        if (did !== null && did !== undefined) {
                            const k = String(did);
                            counts[k] = (Number(counts[k]) || 0) + 1;
                            newEscapes += 1;
                            if (!userNames[k]) missingIds.add(k);
                        }
                    }
                }

                const next = data?._metadata?.links?.next ?? null;
                url = next ? addCommonParams(new URL(next), key) : null;
            }

            GM_setValue(STORE_COUNTS, counts);

            if (missingIds.size) {
                let i = 0;
                const total = missingIds.size;
                for (const id of missingIds) {
                    i += 1;
                    setStatus(`Resolving names... ${i}/${total}`);
                    await fetchAndCacheName(key, id);
                }
            }

            if (maxEnded > fromTs) fromTs = maxEnded + 1;
            GM_setValue(STORE_FROM, fromTs);

            renderMeta();
            renderList();

            setStatus(`Done. New escapes: ${newEscapes}.`);
        } catch (e) {
            setStatus(`Error: ${String(e?.message || e)}`);
        } finally {
            btnGet.disabled = false;
            btnReset.disabled = false;
        }
    };

    const setHidden = (hidden) => {
        GM_setValue(STORE_HIDDEN, !!hidden);
        if (hidden) {
            panel.style.display = 'none';
            gear.style.display = 'flex';
        } else {
            panel.style.display = 'block';
            gear.style.display = 'none';
        }
    };

    btnSave.addEventListener('click', () => {
        const key = (input.value || '').trim();
        GM_setValue(STORE_KEY, key);
        setStatus(key ? 'API key saved.' : 'API key cleared.');
        renderMeta();
    });

    btnShow.addEventListener('click', () => {
        const isHidden2 = input.type === 'password';
        input.type = isHidden2 ? 'text' : 'password';
        btnShow.textContent = isHidden2 ? 'Hide' : 'Show';
    });

    btnGet.addEventListener('click', fetchAllEscapes);

    btnReset.addEventListener('click', () => {
        counts = {};
        GM_setValue(STORE_COUNTS, counts);
        fromTs = twoWeeksAgoTs();
        GM_setValue(STORE_FROM, fromTs);
        renderMeta();
        renderList();
        setStatus('Reset done (API key + name cache kept).');
    });

    btnHide.addEventListener('click', () => setHidden(true));
    gear.addEventListener('click', () => setHidden(false));

    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;
    let raf = 0;
    let pendingLeft = 0, pendingTop = 0;
    let activePointerId = null;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const applyMove = () => {
        raf = 0;
        const w = panel.offsetWidth;
        const h = panel.offsetHeight;
        const maxLeft = window.innerWidth - w;
        const maxTop = window.innerHeight - h;
        const left = clamp(pendingLeft, 0, Math.max(0, maxLeft));
        const top = clamp(pendingTop, 0, Math.max(0, maxTop));
        panel.style.left = left + 'px';
        panel.style.top = top + 'px';
        GM_setValue(STORE_POS, { left, top });
    };

    const startDrag = (clientX, clientY) => {
        dragging = true;
        startX = clientX;
        startY = clientY;
        const r = panel.getBoundingClientRect();
        startLeft = Math.round(r.left);
        startTop = Math.round(r.top);
    };

    const moveDrag = (clientX, clientY) => {
        if (!dragging) return;
        pendingLeft = startLeft + (clientX - startX);
        pendingTop = startTop + (clientY - startY);
        if (!raf) raf = requestAnimationFrame(applyMove);
    };

    const endDrag = () => {
        dragging = false;
        activePointerId = null;
    };

    if ('PointerEvent' in window) {
        header.addEventListener('pointerdown', (e) => {
            if (e.target && e.target.closest && e.target.closest('.et-btn')) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            activePointerId = e.pointerId;
            try { header.setPointerCapture(activePointerId); } catch (_) {}
            startDrag(e.clientX, e.clientY);
            e.preventDefault();
        }, true);

        header.addEventListener('pointermove', (e) => {
            if (!dragging || e.pointerId !== activePointerId) return;
            moveDrag(e.clientX, e.clientY);
            e.preventDefault();
        }, true);

        header.addEventListener('pointerup', (e) => {
            if (e.pointerId !== activePointerId) return;
            try { header.releasePointerCapture(activePointerId); } catch (_) {}
            endDrag();
            e.preventDefault();
        }, true);

        header.addEventListener('pointercancel', (e) => {
            if (e.pointerId !== activePointerId) return;
            try { header.releasePointerCapture(activePointerId); } catch (_) {}
            endDrag();
            e.preventDefault();
        }, true);
    } else {
        header.addEventListener('mousedown', (e) => {
            if (e.target && e.target.closest && e.target.closest('.et-btn')) return;
            if (e.button !== 0) return;
            startDrag(e.clientX, e.clientY);

            const onMove = (ev) => moveDrag(ev.clientX, ev.clientY);
            const onUp = () => {
                document.removeEventListener('mousemove', onMove, true);
                document.removeEventListener('mouseup', onUp, true);
                endDrag();
            };

            document.addEventListener('mousemove', onMove, true);
            document.addEventListener('mouseup', onUp, true);
            e.preventDefault();
        }, true);

        header.addEventListener('touchstart', (e) => {
            if (e.target && e.target.closest && e.target.closest('.et-btn')) return;
            const t = e.touches && e.touches[0];
            if (!t) return;
            startDrag(t.clientX, t.clientY);
            e.preventDefault();
        }, { capture: true, passive: false });

        header.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            const t = e.touches && e.touches[0];
            if (!t) return;
            moveDrag(t.clientX, t.clientY);
            e.preventDefault();
        }, { capture: true, passive: false });

        header.addEventListener('touchend', () => endDrag(), { capture: true });
        header.addEventListener('touchcancel', () => endDrag(), { capture: true });
    }

    renderMeta();
    renderList();
    setStatus(savedKey ? 'Ready.' : 'Enter your API key to start.');
    setHidden(isHidden);
})();

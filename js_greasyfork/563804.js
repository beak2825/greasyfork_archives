// ==UserScript==
// @name         Company Effectiveness Report Panel
// @namespace    r4g3runn3r.company.effectiveness
// @version      1.4.8
// @description  Floating company effectiveness report with live employee data, minimize button, and premium breakdown table
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563804/Company%20Effectiveness%20Report%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/563804/Company%20Effectiveness%20Report%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REFRESH_MS = 7000;
    const URL_POLL_MS = 400;

    const PANEL_ID = 'r4g-eff-panel';
    const MINI_ID  = 'r4g-eff-mini';

    // ---------- Helpers ----------
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    function onCompanyPage() {
        // Hard stop: never render on Crimes etc.
        return location.pathname.includes('companies.php');
    }

    function isDirectorViewPresent() {
        // Your Details: Position: Director (wording appears in your screenshots and is stable)
        const t = document.body?.innerText || '';
        return t.includes('Your Details:') && t.includes('Position: Director');
    }

    function getStatus(eff) {
        if (eff >= 100) return 'healthy';
        if (eff >= 50) return 'warning';
        return 'critical';
    }

    function parseIntSafe(s) {
        const n = parseInt(String(s || '').replace(/[^\d-]/g, ''), 10);
        return Number.isFinite(n) ? n : null;
    }

    function extractStatsText(li) {
        // Usually exists as a compact "4k / 1.3k / 3.1k" string in a .stats div
        const statsDiv = qs('.stats', li);
        if (statsDiv && statsDiv.textContent.trim()) return statsDiv.textContent.trim();

        // Fallback: try to build from title/aria if present
        const effBox = qs('.effectiveness', li);
        const title = effBox?.getAttribute('title') || effBox?.getAttribute('aria-label') || '';
        // Try to pick out "Manual labor: X / Intelligence: Y / Endurance: Z"
        if (title.includes('Manual labor') || title.includes('Manual')) return title;

        return '';
    }

    function readPositionsFromEmployeesDOM() {
        // This reads position from the actual Employees tab DOM (even when hidden).
        // We map by employee ID (li[data-user]).
        const map = new Map();

        const employeeLis = qsa('#employees .employee-list-wrap li[data-user], .employee-list-wrap li[data-user]');
        for (const li of employeeLis) {
            const id = li.getAttribute('data-user');
            if (!id) continue;

            // Most common: a select for role/position
            let pos = '';

            const sel = qs('.position select', li) ||
                        qs('select[name*="position"]', li) ||
                        qs('select', qs('.position', li) || null);

            if (sel) {
                const opt = sel.options?.[sel.selectedIndex];
                if (opt?.textContent) pos = opt.textContent.trim();
            }

            // Sometimes it’s rendered as text
            if (!pos) {
                const posDiv = qs('.position', li);
                if (posDiv) {
                    const txt = posDiv.textContent.trim();
                    // Avoid grabbing huge chunks
                    if (txt && txt.length < 40) pos = txt;
                }
            }

            if (pos) map.set(id, pos);
        }

        return map;
    }

    function getEmployees() {
        // Source of truth: the employee list in the company Employees panel.
        // This exists on Manage Company and is stable across your HTML snapshots.
        const posMap = readPositionsFromEmployeesDOM();

        const lis = qsa('#employees .employee-list-wrap li[data-user], .employee-list-wrap li[data-user]');
        const list = [];

        for (const li of lis) {
            const id = li.getAttribute('data-user');
            if (!id) continue;

            // Name (different layouts)
            const name =
                qs('.employee-name', li)?.textContent?.trim() ||
                qs('.employee', li)?.textContent?.trim() ||
                qs('strong', li)?.textContent?.trim() ||
                qs('.name', li)?.textContent?.trim() ||
                '';

            // Effectiveness number is in <p class="desc effectiveness-value ...">70</p>
            const effEl = qs('.effectiveness-value', li);
            const eff = parseIntSafe(effEl?.textContent);

            // Days (div.days exists in your DOM view)
            const daysEl = qs('.days', li);
            const days = parseIntSafe(daysEl?.textContent) ?? parseIntSafe(daysEl?.getAttribute('aria-label')) ?? null;

            const stats = extractStatsText(li);

            const position = posMap.get(id) || 'Unknown';

            if (name && eff !== null) {
                list.push({ id, name, eff, position, days, stats });
            }
        }

        return list;
    }

    // ---------- UI ----------
    function ensureUI() {
        if (qs(`#${PANEL_ID}`)) return;

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `
            <div class="r4g-head">
                <div class="r4g-title">Company Effectiveness Report</div>
                <div class="r4g-controls">
                    <button class="r4g-btn r4g-min" title="Minimize">🗕</button>
                    <button class="r4g-btn r4g-close" title="Close">✕</button>
                </div>
            </div>
            <div class="r4g-body">
                <div class="r4g-status">Status: Scanning company data...</div>
                <div class="r4g-top"></div>
                <div class="r4g-divider"></div>
                <div class="r4g-premium-title">Premium effectiveness breakdowns</div>
                <div class="r4g-premium"></div>
            </div>
            <div class="r4g-resize"></div>
        `;

        const mini = document.createElement('div');
        mini.id = MINI_ID;
        mini.textContent = 'Company Report';
        mini.style.display = 'none';

        document.body.appendChild(panel);
        document.body.appendChild(mini);

        // Default placement
        panel.style.top = '120px';
        panel.style.left = '120px';

        makeDraggable(panel, qs('.r4g-head', panel));
        makeResizable(panel, qs('.r4g-resize', panel));

        qs('.r4g-close', panel).addEventListener('click', () => {
            panel.remove();
            mini.remove();
        });

        qs('.r4g-min', panel).addEventListener('click', () => {
            panel.style.display = 'none';
            mini.style.display = 'block';
        });

        mini.addEventListener('click', () => {
            mini.style.display = 'none';
            panel.style.display = 'block';
        });
    }

    function setMiniFlashing(isCritical) {
        const mini = qs(`#${MINI_ID}`);
        if (!mini) return;
        mini.classList.toggle('r4g-mini-critical', !!isCritical);
    }

    function render() {
        if (!onCompanyPage() || !isDirectorViewPresent()) {
            // If we navigate away, hide UI entirely (and remove mini too).
            const panel = qs(`#${PANEL_ID}`);
            const mini  = qs(`#${MINI_ID}`);
            if (panel) panel.remove();
            if (mini) mini.remove();
            return;
        }

        ensureUI();

        const panel = qs(`#${PANEL_ID}`);
        const statusEl = qs('.r4g-status', panel);
        const topEl = qs('.r4g-top', panel);
        const premEl = qs('.r4g-premium', panel);

        const employees = getEmployees();

        if (!employees.length) {
            statusEl.textContent = 'Status: No employee rows detected yet. Open Manage Company → Employees tab.';
            topEl.innerHTML = '';
            premEl.innerHTML = `<div class="r4g-note">Premium will add explanations, causes, and recommendations here.</div>`;
            setMiniFlashing(false);
            return;
        }

        // Counts + flashing logic
        const counts = { healthy: 0, warning: 0, critical: 0 };
        for (const e of employees) counts[getStatus(e.eff)]++;
        const hasCritical = counts.critical > 0;
        setMiniFlashing(hasCritical);

        statusEl.innerHTML = `
            Employees detected: <b>${employees.length}</b>
            <span class="r4g-pill healthy">Healthy (≥100): ${counts.healthy}</span>
            <span class="r4g-pill warning">Warning (50–99): ${counts.warning}</span>
            <span class="r4g-pill critical">Critical (&lt;50): ${counts.critical}</span>
        `;

        // ---- TOP TABLE (Free info) ----
        // Icon + Eff + Name + Position + Days in company
        topEl.innerHTML = `
            <table class="r4g-table">
                <thead>
                    <tr>
                        <th class="col-icon"></th>
                        <th class="col-eff">Eff</th>
                        <th>Employee</th>
                        <th class="col-pos">Position</th>
                        <th class="col-days">Days in the company</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(e => {
                        const st = getStatus(e.eff);
                        return `
                            <tr>
                                <td><span class="r4g-dot ${st}"></span></td>
                                <td class="r4g-eff ${st}">${e.eff}</td>
                                <td class="r4g-emp">${escapeHtml(e.name)} <span class="r4g-id">[${e.id}]</span></td>
                                <td class="r4g-pos">${escapeHtml(e.position)}</td>
                                <td class="r4g-days">${e.days ?? '-'}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        // ---- PREMIUM TABLE (structure + readable colors) ----
        premEl.innerHTML = `
            <table class="r4g-table r4g-table-prem">
                <thead>
                    <tr>
                        <th class="col-icon"></th>
                        <th class="col-eff">Eff</th>
                        <th>Employee</th>
                        <th>Cause</th>
                        <th class="col-rec">Recommendation</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(e => {
                        const st = getStatus(e.eff);

                        // Placeholder logic (we’ll replace with real breakdown later)
                        let cause, rec;
                        if (st === 'critical') {
                            cause = 'Very low effectiveness impacting company output.';
                            rec = 'Review role fit or consider replacement.';
                        } else if (st === 'warning') {
                            cause = 'Moderate effectiveness; improvements possible.';
                            rec = 'Monitor and adjust training or role.';
                        } else {
                            cause = 'Strong effectiveness; maintain performance.';
                            rec = 'Keep consistent training and role assignment.';
                        }

                        // Extra hint if position unknown
                        if (e.position === 'Unknown') {
                            cause += ' (Position not readable from DOM.)';
                        }

                        return `
                            <tr>
                                <td><span class="r4g-dot ${st}"></span></td>
                                <td class="r4g-eff ${st}">${e.eff}</td>
                                <td class="r4g-emp">${escapeHtml(e.name)}</td>
                                <td class="r4g-cause">${escapeHtml(cause)}</td>
                                <td class="r4g-rec ${st}">${escapeHtml(rec)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    // ---------- Drag / Resize ----------
    function makeDraggable(panel, handle) {
        let dragging = false;
        let startX = 0, startY = 0, origX = 0, origY = 0;

        handle.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            origX = panel.offsetLeft;
            origY = panel.offsetTop;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel.style.left = Math.max(0, origX + dx) + 'px';
            panel.style.top  = Math.max(0, origY + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            document.body.style.userSelect = '';
        });
    }

    function makeResizable(panel, grip) {
        let resizing = false;
        let startX = 0, startY = 0, startW = 0, startH = 0;

        grip.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            resizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startW = panel.offsetWidth;
            startH = panel.offsetHeight;
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!resizing) return;
            const w = Math.max(520, startW + (e.clientX - startX));
            const h = Math.max(280, startH + (e.clientY - startY));
            panel.style.width = w + 'px';
            panel.style.height = h + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!resizing) return;
            resizing = false;
        });
    }

    function escapeHtml(s) {
        return String(s ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    // ---------- Styles ----------
    GM_addStyle(`
        #${PANEL_ID} {
            position: fixed;
            z-index: 999999;
            width: 820px;
            height: 520px;
            background: rgba(10,10,10,0.96);
            border: 1px solid #2a2a2a;
            border-radius: 10px;
            box-shadow: 0 12px 35px rgba(0,0,0,0.6);
            color: #eaeaea;
            overflow: hidden;
        }

        #${PANEL_ID} .r4g-head {
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding: 10px 12px;
            background: linear-gradient(#1b1b1b, #121212);
            border-bottom: 1px solid #2a2a2a;
            cursor: move;
        }
        #${PANEL_ID} .r4g-title {
            font-weight: 800;
            letter-spacing: .2px;
        }
        #${PANEL_ID} .r4g-controls { display:flex; gap:8px; }
        #${PANEL_ID} .r4g-btn {
            background: #111;
            border: 1px solid #333;
            color: #ddd;
            border-radius: 6px;
            padding: 4px 8px;
            cursor: pointer;
            font-weight: 900;
        }
        #${PANEL_ID} .r4g-btn:hover { background:#161616; }
        #${PANEL_ID} .r4g-close { color:#ff6b6b; }

        #${PANEL_ID} .r4g-body {
            padding: 10px 12px 12px;
            height: calc(100% - 46px);
            overflow: auto;
        }

        #${PANEL_ID} .r4g-status {
            margin-bottom: 10px;
            color: #cfd3d8;
            font-size: 13px;
        }

        #${PANEL_ID} .r4g-pill {
            display:inline-block;
            margin-left: 10px;
            padding: 2px 8px;
            border-radius: 999px;
            font-weight: 800;
            font-size: 12px;
        }
        #${PANEL_ID} .r4g-pill.healthy { background: rgba(60,255,60,.12); color:#b9ffb9; border:1px solid rgba(60,255,60,.25); }
        #${PANEL_ID} .r4g-pill.warning { background: rgba(255,179,0,.12); color:#ffd580; border:1px solid rgba(255,179,0,.25); }
        #${PANEL_ID} .r4g-pill.critical { background: rgba(255,59,59,.12); color:#ff9b9b; border:1px solid rgba(255,59,59,.25); }

        #${PANEL_ID} .r4g-divider {
            margin: 12px 0 10px;
            border-top: 2px solid rgba(255,255,255,0.12);
        }

        #${PANEL_ID} .r4g-premium-title {
            color: #ffbf3a;
            font-weight: 900;
            margin: 0 0 8px;
        }

        #${PANEL_ID} .r4g-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        #${PANEL_ID} .r4g-table th, #${PANEL_ID} .r4g-table td {
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 7px 8px;
            font-size: 13px;
            vertical-align: top;
        }
        #${PANEL_ID} .r4g-table th {
            color: #cfd3d8;
            font-weight: 900;
        }

        #${PANEL_ID} .col-icon { width: 26px; }
        #${PANEL_ID} .col-eff  { width: 60px; }
        #${PANEL_ID} .col-pos  { width: 170px; }
        #${PANEL_ID} .col-days { width: 150px; }
        #${PANEL_ID} .col-rec  { width: 270px; }

        #${PANEL_ID} .r4g-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px rgba(0,0,0,0.5);
        }
        #${PANEL_ID} .r4g-dot.healthy { background:#3cff3c; }
        #${PANEL_ID} .r4g-dot.warning { background:#ffb300; }
        #${PANEL_ID} .r4g-dot.critical { background:#ff3b3b; animation: r4gBlink 1s infinite; }

        #${PANEL_ID} .r4g-eff.healthy { color:#b9ffb9; font-weight: 900; }
        #${PANEL_ID} .r4g-eff.warning { color:#ffd580; font-weight: 900; }
        #${PANEL_ID} .r4g-eff.critical { color:#ff9b9b; font-weight: 900; }

        #${PANEL_ID} .r4g-id {
            color: rgba(255,255,255,0.35);
            font-weight: 700;
            margin-left: 6px;
            font-size: 12px;
        }

        #${PANEL_ID} .r4g-rec {
            font-weight: 800;
        }
        #${PANEL_ID} .r4g-rec.healthy { color:#b9ffb9; }
        #${PANEL_ID} .r4g-rec.warning { color:#ffd580; }
        #${PANEL_ID} .r4g-rec.critical { color:#ff9b9b; }

        #${PANEL_ID} .r4g-note {
            color: rgba(255,255,255,0.6);
            font-style: italic;
        }

        #${PANEL_ID} .r4g-resize {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 16px;
            height: 16px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.25) 50%);
        }

        @keyframes r4gBlink { 50% { opacity: 0.25; } }

        #${MINI_ID} {
            position: fixed;
            right: 18px;
            bottom: 120px;
            z-index: 1000000;
            background: #39ff14;
            color: #000;
            border: 2px solid #2ecc71;
            padding: 10px 14px;
            font-weight: 900;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 0 12px rgba(57,255,20,0.65);
            user-select: none;
        }

        #${MINI_ID}.r4g-mini-critical {
            animation: r4gMiniBlink 1s infinite;
        }

        @keyframes r4gMiniBlink {
            50% { filter: brightness(0.6); box-shadow: 0 0 22px rgba(255,59,59,0.9); }
        }
    `);

    // ---------- Navigation-safe loop ----------
    let lastHref = '';
    let running = false;

    async function tick() {
        if (running) return;
        running = true;

        try {
            // Render immediately when appropriate
            render();
        } catch (e) {
            console.error('[EFF-REPORT] render error:', e);
        } finally {
            running = false;
        }
    }

    // Re-render on URL changes (Torn SPA-ish navigation)
    setInterval(() => {
        const href = location.href;
        if (href !== lastHref) {
            lastHref = href;
            tick();
        }
    }, URL_POLL_MS);

    // Refresh loop (keeps data current)
    setInterval(() => tick(), REFRESH_MS);

    // Initial
    lastHref = location.href;
    tick();

})();

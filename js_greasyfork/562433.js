// ==UserScript==
// @name         Whanau Contracts Monitor
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Monitor active contracts - Whanau
// @author       Leofierus
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @connect      docs.google.com
// @connect      googleusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562433/Whanau%20Contracts%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/562433/Whanau%20Contracts%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlTLuTV_5mj4cvSavIVOXV3GQiWgkEWtS2bswFG45QjiVPzasMdfWEBqQA3S3sqBzTL6bqa3_ITFUE/pub?gid=0&single=true&output=csv";
    const BASE_SHEET_REFRESH_MINS = 15;
    const JITTER_SECONDS = 60;
    const DEFAULT_MONITOR_INTERVAL = 60;

    // --- STATE MANAGEMENT ---
    let apiKey = GM_getValue('tornApiKey', '');
    let activeMonitors = {};

    // --- STYLES ---
    GM_addStyle(`
        #merc-widget {
            position: fixed;
            /* Default: Top Right */
            top: 50px; right: 20px;
            background: #1e1e1e; color: #ddd;
            border-radius: 6px; font-family: 'Segoe UI', Arial, sans-serif;
            z-index: 999999; box-shadow: 0 4px 15px rgba(0,0,0,0.6);
            font-size: 12px; border: 1px solid #333;
            width: auto; max-width: 95vw;
            /* Critical for smooth expansion */
            transition: width 0.2s ease, min-width 0.2s ease;
            box-sizing: border-box;
        }
        #merc-header {
            padding: 8px 12px; background: #2a2a2a; color: #fff;
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #444; border-radius: 6px 6px 0 0;
            font-weight: bold; user-select: none;
            cursor: move;
        }
        #merc-content { max-height: 500px; overflow-y: auto; background: #121212; }
        #merc-table { width: 100%; border-collapse: collapse; text-align: left; }
        #merc-table th {
            background: #181818; color: #fff; padding: 8px;
            position: sticky; top: 0; z-index: 10; border-bottom: 2px solid #444;
            font-weight: 600; white-space: nowrap;
        }
        #merc-table td {
            padding: 5px 8px; border-bottom: 1px solid #2a2a2a;
            white-space: nowrap; vertical-align: middle;
        }
        #merc-table tr:hover { background: #1f1f1f; }

        .merc-input-interval { width: 30px; background: #333; border: 1px solid #444; color: #fff; text-align: center; border-radius: 3px; padding: 2px; }
        .merc-checkbox { cursor: pointer; }

        /* DOTS */
        .dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; border: 1px solid #000; margin-right: 2px; }
        .dot-green { background-color: #2ecc71; box-shadow: 0 0 2px #2ecc71; }
        .dot-red { background-color: #e74c3c; }
        .dot-orange { background-color: #f39c12; }
        .dot-grey { background-color: #555; }
        .dot-empty { border: 1px solid #444; background: transparent; }

        .merc-btn-key { background: #333; border: 1px solid #555; color: #aaa; cursor: pointer; padding: 0 6px; font-size: 10px; margin-right: 5px; border-radius: 3px; }
        .merc-btn-key:hover { background: #444; color: #fff; }
        .merc-row-refresh { background: none; border: none; color: #666; cursor: pointer; font-size: 14px; padding: 0; }
        .merc-row-refresh:hover { color: #fff; transform: rotate(180deg); transition: transform 0.3s; }

        .col-name { color: #67c8ff; font-weight: bold; text-decoration: none; }
        .col-stats { color: #aaaaaa; }
        .col-whentohit { color: #f1c40f; }
        .col-pay { color: #2ecc71; font-weight: bold; }
        .col-comments { color: #999; font-style: italic; white-space: normal !important; max-width: 200px; min-width: 100px; font-size: 0.9em; }

        #merc-footer { font-size: 10px; color: #555; text-align: center; padding: 3px; background: #111; border-radius: 0 0 6px 6px; }
        #merc-widget.collapsed #merc-content, #merc-widget.collapsed #merc-footer { display: none; }
    `);

    // --- CSV PARSER ---
    function parseCSV(text) {
        const lines = text.split(/\r\n|\r|\n/);
        const data = [];
        let headers = [];
        lines.forEach((line, index) => {
            if (!line.trim()) return;
            const row = [];
            let inQuote = false, currentCell = '';
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuote && line[i+1] === '"') { currentCell += '"'; i++; }
                    else { inQuote = !inQuote; }
                } else if (char === ',' && !inQuote) {
                    row.push(currentCell); currentCell = '';
                } else { currentCell += char; }
            }
            row.push(currentCell);
            if (index === 0) headers = row.map(h => h.trim());
            else if(row.length > 0) {
                let obj = {};
                headers.forEach((h, i) => { obj[h] = row[i] || ''; });
                data.push(obj);
            }
        });
        return data;
    }

    // --- API & UI ---
    function checkApiKey() {
        if (apiKey === '') {
            const input = prompt("Enter Torn API Key:\n(Enter '-' to disable API features)");
            if (input) { apiKey = input.trim(); GM_setValue('tornApiKey', apiKey); location.reload(); }
        }
    }
    function updateApiKey() {
        const input = prompt("Update API Key:", apiKey === '-' ? '' : apiKey);
        if (input !== null) { apiKey = input.trim(); GM_setValue('tornApiKey', apiKey); location.reload(); }
    }

    function createUI() {
        if (document.getElementById('merc-widget')) return;
        checkApiKey();

        const container = document.createElement('div');
        container.id = 'merc-widget';
        if (GM_getValue('isCollapsed', false)) container.classList.add('collapsed');

        // --- RESTORE SMART POSITION ---
        const savedPos = GM_getValue('widgetPos', null);
        if (savedPos) {
            container.style.top = savedPos.top;
            if (savedPos.anchor === 'right') {
                container.style.right = savedPos.right;
                container.style.left = 'auto'; // Force growth to left
            } else {
                container.style.left = savedPos.left;
                container.style.right = 'auto'; // Force growth to right
            }
        }

        container.innerHTML = `
            <div id="merc-header">
                <div style="display:flex; align-items:center;">
                    <span>📋 Contracts</span>
                    <button id="merc-key-btn" class="merc-btn-key" title="Update API Key">+</button>
                </div>
                <div style="display:flex; align-items:center;">
                    <button id="merc-refresh-all" class="merc-row-refresh" title="Refresh Sheet" style="margin-right:10px; font-size:12px">↻ Sheet</button>
                    <span id="merc-toggle-icon" style="cursor:pointer">${GM_getValue('isCollapsed', false) ? '▼' : '▲'}</span>
                </div>
            </div>
            <div id="merc-content"><div style="padding:15px; text-align:center;">Loading CSV...</div></div>
            <div id="merc-footer">Init...</div>
        `;
        document.body.appendChild(container);

        // --- SMART DRAG LOGIC ---
        const header = container.querySelector('#merc-header');
        let isDragging = false, startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;

            // Switch to absolute LEFT for dragging stability
            const rect = container.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            container.style.right = 'auto';
            container.style.left = `${startLeft}px`;

            const onMouseMove = (ev) => {
                isDragging = true;
                container.style.left = `${startLeft + (ev.clientX - startX)}px`;
                container.style.top = `${startTop + (ev.clientY - startY)}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                if (isDragging) {
                    // CALCULATE ANCHOR ON DROP
                    const finalRect = container.getBoundingClientRect();
                    const centerX = finalRect.left + (finalRect.width / 2);
                    const screenMid = window.innerWidth / 2;

                    if (centerX > screenMid) {
                        // Right Side -> Anchor Right
                        const rightDist = window.innerWidth - finalRect.right;
                        container.style.left = 'auto';
                        container.style.right = `${rightDist}px`;
                        GM_setValue('widgetPos', { top: container.style.top, right: `${rightDist}px`, anchor: 'right' });
                    } else {
                        // Left Side -> Anchor Left
                        // container.style.left is already set correctly from drag
                        container.style.right = 'auto';
                        GM_setValue('widgetPos', { top: container.style.top, left: container.style.left, anchor: 'left' });
                    }
                }
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        document.getElementById('merc-key-btn').addEventListener('click', updateApiKey);
        document.getElementById('merc-refresh-all').addEventListener('click', () => fetchSheetData(true));
       header.addEventListener('click', (e) => {
           if (e.target.tagName === 'BUTTON' || isDragging) return;

           container.classList.toggle('collapsed');
           GM_setValue('isCollapsed', container.classList.contains('collapsed'));

           document.getElementById('merc-toggle-icon').textContent =
               container.classList.contains('collapsed') ? '▼' : '▲';

           // 🔑 FORCE EXPANSION DIRECTION
           const pos = GM_getValue('widgetPos', null);
           if (pos?.anchor === 'right') {
               container.style.left = 'auto';
               container.style.right = pos.right;
           } else {
               container.style.right = 'auto';
               container.style.left = pos.left;
           }
       });
    }

    // --- DATA HANDLING ---
    function fetchSheetData(force = false) {
        const lastFetch = GM_getValue('lastSheetFetch', 0);
        const now = Date.now();
        const diffMins = (now - lastFetch) / 1000 / 60;
        const footer = document.getElementById('merc-footer');

        if (!force && diffMins < BASE_SHEET_REFRESH_MINS) {
            const cached = GM_getValue('cachedSheetData', null);
            if (cached) { renderTable(cached); if(footer) footer.textContent = `Cached: ${Math.round(diffMins)}m ago`; return; }
        }

        if(footer) footer.textContent = "Fetching CSV...";
        GM_xmlhttpRequest({
            method: "GET", url: SHEET_URL,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = parseCSV(response.responseText);
                        GM_setValue('cachedSheetData', data);
                        GM_setValue('lastSheetFetch', now);
                        renderTable(data);
                        if(footer) footer.textContent = "CSV Updated";
                    } catch (e) { console.error(e); }
                }
            }
        });
    }

    function fetchTornStatus(tornId, callback) {
        if (!apiKey || apiKey === '-') return;
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/user/${tornId}/profile?striptags=true`,
            headers: { "accept": "application/json", "Authorization": `ApiKey ${apiKey}` },
            onload: function(response) {
                if (response.status === 200) { try { callback(JSON.parse(response.responseText)); } catch (e) {} }
                else if (response.status === 429) { document.getElementById('merc-footer').textContent = "⚠️ Rate Limit!"; }
            }
        });
    }

    function toggleMonitor(tornId, checkbox, intervalInput) {
        if (checkbox.checked) {
            const intervalSecs = parseInt(intervalInput.value) || DEFAULT_MONITOR_INTERVAL;
            if(intervalSecs < 2) intervalInput.value = 2;
            fetchTornStatus(tornId, (data) => updateRowStatus(tornId, data));
            if (activeMonitors[tornId]) clearInterval(activeMonitors[tornId]);
            activeMonitors[tornId] = setInterval(() => { fetchTornStatus(tornId, (data) => updateRowStatus(tornId, data)); }, intervalSecs * 1000);
            intervalInput.disabled = true;
        } else {
            if (activeMonitors[tornId]) { clearInterval(activeMonitors[tornId]); delete activeMonitors[tornId]; }
            intervalInput.disabled = false;
        }
    }

    function updateRowStatus(tornId, data) {
        if (!data || !data.profile) return;
        const p = data.profile;
        const dot = document.getElementById(`status-dot-${tornId}`);
        if (dot) {
            dot.className = 'dot';
            if (p.last_action.status === 'Online') dot.classList.add('dot-green');
            else if (p.last_action.status === 'Idle') dot.classList.add('dot-orange');
            else dot.classList.add('dot-grey');
            dot.title = `Last Action: ${p.last_action.relative}`;
        }
        const hospDot = document.getElementById(`hosp-dot-${tornId}`);
        if (hospDot) {
            hospDot.className = 'dot';
            const isOkay = p.status.state === 'Okay';
            if(isOkay) hospDot.classList.add('dot-green');
            else hospDot.classList.add('dot-red');
            hospDot.title = `${p.status.state} (${p.status.description})`;
        }
    }

    function renderTable(data) {
        const contentDiv = document.getElementById('merc-content');
        if (!data || data.length === 0) { contentDiv.innerHTML = `<div style="padding:15px;">No active contracts.</div>`; return; }
        const apiDisabled = (apiKey === '-' || !apiKey);

        let html = `
            <table id="merc-table">
                <thead>
                    <tr>
                        <th title="Auto-Check">👁️</th>
                        <th title="Seconds">Sec</th>
                        <th style="color:#67c8ff">Name</th>
                        <th title="Live Status">●</th>
                        <th title="Is Hosped?">🏥</th>
                        <th style="color:#aaa">Stats</th>
                        <th style="color:#d6a2e8">Merits</th>
                        <th style="color:#e74c3c">Stricken</th>
                        <th style="color:#f1c40f">When to hit?</th>
                        <th style="color:#e67e22">If Orange</th>
                        <th style="color:#2ecc71">Pay</th>
                        <th>↻</th>
                        <th style="color:#999">Comments</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let activeCount = 0;
        data.forEach(row => {
            if (!row.ID) return;
            const isActive = row['Contract Active'] && row['Contract Active'].trim().toLowerCase() === 'active';
            if (!isActive) return;

            activeCount++;
            const id = row.ID;
            const name = row.Name || row.ID;
            const isTrue = (val) => {
                if (val === true) return true;
                if (!val) return false;
                const s = String(val).toLowerCase().trim();
                return s === 'true' || s === 'yes' || s === 'on';
            };

            const isFaction = isTrue(row['Faction Contract']);
            const meritsDot = isTrue(row.Merits) ? '<span class="dot dot-green" title="Yes"></span>' : '<span class="dot dot-red" title="No"></span>';
            const strickenDot = isTrue(row.Stricken) ? '<span class="dot dot-green" title="Yes"></span>' : '<span class="dot dot-red" title="No"></span>';

            let linkUrl = `/profiles.php?XID=${id}`;
            let linkClass = "col-name user-name";
            let linkAttr = `data-placeholder="0" target="_blank"`;
            let monitorCheck, intervalInput, statusDot, hospDot, refreshBtn;

            if (isFaction) {
                linkUrl = `https://www.torn.com/factions.php?step=profile&ID=${id}`;
                linkClass = "col-name";
                linkAttr = `target="_blank"`;
                monitorCheck = `<span style="color:#666">🏰</span>`;
                intervalInput = `<span style="color:#444">-</span>`;
                statusDot = `<span style="color:#444">-</span>`;
                hospDot = `<span style="color:#444">-</span>`;
                refreshBtn = ``;
            } else {
                monitorCheck = apiDisabled ? `<span style="color:#555">-</span>` : `<input type="checkbox" class="merc-checkbox monitor-toggle" data-id="${id}">`;
                intervalInput = apiDisabled ? `<span style="color:#555">-</span>` : `<input type="number" class="merc-input-interval" value="${DEFAULT_MONITOR_INTERVAL}" min="5" data-id="${id}">`;
                statusDot = `<span id="status-dot-${id}" class="dot dot-empty" title="Unknown"></span>`;
                hospDot = `<span id="hosp-dot-${id}" class="dot dot-empty" title="Unknown"></span>`;
                refreshBtn = apiDisabled ? '' : `<button class="merc-row-refresh manual-refresh" data-id="${id}" title="Check Now">↻</button>`;
            }

            const whenToHit = row['When to hit?'] || row['When to hit'] || row.Status || '-';

            html += `
                <tr id="row-${id}">
                    <td style="text-align:center">${monitorCheck}</td>
                    <td>${intervalInput}</td>
                    <td><a href="${linkUrl}" class="${linkClass}" ${linkAttr}>${name}</a></td>
                    <td style="text-align:center">${statusDot}</td>
                    <td style="text-align:center">${hospDot}</td>
                    <td class="col-stats">${row.Stats || '-'}</td>
                    <td style="text-align:center">${meritsDot}</td>
                    <td style="text-align:center">${strickenDot}</td>
                    <td class="col-whentohit">${whenToHit}</td>
                    <td style="color:#e67e22">${row['If Orange'] || row.IfOrange || '-'}</td>
                    <td class="col-pay">${row.Pay || '-'}</td>
                    <td>${refreshBtn}</td>
                    <td class="col-comments">${row.Comments || ''}</td>
                </tr>
            `;
        });

        if (activeCount === 0) html += `<tr><td colspan="13" style="text-align:center; padding:10px;">No contracts found with status "Active"</td></tr>`;
        html += `</tbody></table>`;
        contentDiv.innerHTML = html;

        if (!apiDisabled) {
            contentDiv.querySelectorAll('.monitor-toggle').forEach(chk => {
                chk.addEventListener('change', (e) => {
                    const tid = e.target.getAttribute('data-id');
                    const input = contentDiv.querySelector(`.merc-input-interval[data-id="${tid}"]`);
                    toggleMonitor(tid, e.target, input);
                });
            });
            contentDiv.querySelectorAll('.manual-refresh').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tid = e.target.getAttribute('data-id');
                    btn.style.color = '#fff';
                    fetchTornStatus(tid, (data) => updateRowStatus(tid, data));
                });
            });
        }
    }

    createUI();
    fetchSheetData();
    const randomJitter = (Math.random() * JITTER_SECONDS * 2000) - (JITTER_SECONDS * 1000);
    setInterval(fetchSheetData, (BASE_SHEET_REFRESH_MINS * 60 * 1000) + randomJitter);

})();
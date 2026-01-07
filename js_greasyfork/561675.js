// ==UserScript==
// @name         🍸 Date Manager
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Elegant restaurant menu design with seamless automation + Family Call
// @author       anon
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Relations/*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Interact/Details/*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Interact/Phone/*
// @match        https://*.popmundo.com/World/Popmundo.aspx
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561675/%F0%9F%8D%B8%20Date%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/561675/%F0%9F%8D%B8%20Date%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'pop_date_queue';
    const CONFIG_KEY = 'pop_date_settings';

    // Get current domain dynamically
    const DOMAIN = window.location.hostname;
    const BASE_URL = `https://${DOMAIN}`;

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* Icon Styles */
        #dm-icon {
            position: fixed; top: 20px; right: 20px; width: 47px; height: 47px;
            background: #ffffff; border-radius: 50%; z-index: 9999;
            cursor: pointer; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
            display: flex; align-items: center; justify-content: center;
            border: 2px solid #c9a961; transition: all 0.2s ease;
            font-size: 24px; color: #8b7355;
        }
        #dm-icon:hover {
            transform: scale(1.1); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            background: #fef9f0;
        }
        #dm-icon:active {
            transform: scale(0.95);
        }

        /* UI Styles (hidden by default) */
        #dm-ui {
            position: fixed; top: 20px; right: 20px; width: 240px;
            background: #fefefe; border-radius: 16px; z-index: 10000;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #c9a961; overflow: hidden;
            display: none;
        }
        .dm-header {
            padding: 16px 14px 12px; background: #fefefe;
            border-bottom: 1px solid #c9a961;
            position: relative;
        }
        .dm-close {
            position: absolute; top: 12px; right: 12px;
            width: 24px; height: 24px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: #999; font-size: 16px; transition: color 0.2s;
            border-radius: 4px;
        }
        .dm-close:hover {
            color: #8b7355; background: #f8f8f8;
        }
        .dm-title {
            font-family: 'Inter', sans-serif;
            font-size: 16px; font-weight: 600; letter-spacing: 0.5px;
            text-align: center; color: #8b7355; text-transform: uppercase;
            padding-right: 30px;
        }
        .dm-city-badge {
            text-align: center; font-size: 9px; font-weight: 600;
            color: #999; margin-top: 4px; letter-spacing: 1px;
        }
        .dm-body { padding: 12px; background: #fefefe; }
        .dm-btn-row { display: flex; gap: 6px; margin-bottom: 10px; }
        .dm-small-btn {
            cursor: pointer; border: 1px solid #c9a961; border-radius: 8px;
            padding: 6px 10px; font-size: 9px; font-weight: 600; flex: 1;
            transition: all 0.2s; background: transparent; color: #8b7355;
            font-family: 'Inter', sans-serif; text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .dm-small-btn:hover { background: #c9a961; color: #ffffff; }
        .dm-small-btn:active { transform: scale(0.97); }
        .dm-input {
            width: 100%; font-size: 11px; padding: 7px 10px;
            border: 1px solid #e5e5e5; border-radius: 8px;
            margin-bottom: 8px; background: #fafafa; outline: none;
            transition: all 0.2s; font-weight: 400; color: #333;
            font-family: 'Inter', sans-serif;
        }
        .dm-input:focus { border-color: #c9a961; background: #ffffff; }
        .dm-time-row { display: flex; gap: 6px; margin-bottom: 8px; }
        .dm-time-row .dm-input { margin: 0; }
        #dm-list {
            max-height: 160px; overflow-y: auto; border: 1px solid #e5e5e5;
            margin: 10px 0; border-radius: 12px; background: #fafafa;
        }
        #dm-list::-webkit-scrollbar { width: 6px; }
        #dm-list::-webkit-scrollbar-track { background: #fafafa; border-radius: 12px; }
        #dm-list::-webkit-scrollbar-thumb {
            background: #c9a961; border-radius: 12px;
        }
        .dm-item {
            display: flex; align-items: center; padding: 8px 10px;
            border-bottom: 1px solid #f0f0f0; cursor: grab;
            background: #ffffff; font-size: 11px; transition: all 0.2s;
        }
        .dm-item:first-child { border-radius: 12px 12px 0 0; }
        .dm-item:last-child { border-bottom: none; border-radius: 0 0 12px 12px; }
        .dm-item:hover { background: #f8f8f8; }
        .dm-item.dragging {
            opacity: 0.4; cursor: grabbing;
        }
        .dm-item.processing {
            background: #fef9f0; border-left: 3px solid #c9a961;
        }
        .dm-time {
            font-size: 9px; font-weight: 500; color: #8b7355;
            margin-left: auto; padding: 3px 8px; background: #fef9f0;
            border: 1px solid #e5d5b7; letter-spacing: 0.5px; border-radius: 6px;
        }
        .dm-handle {
            color: #ccc; margin-right: 8px; cursor: grab;
            font-size: 14px; line-height: 1;
        }
        .dm-item:hover .dm-handle { color: #999; }
        .dm-name {
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            flex: 1; font-weight: 500; color: #333;
        }
        .dm-go {
            width: 100%; background: transparent; color: #8b7355;
            border: 1px solid #c9a961; padding: 10px; border-radius: 10px;
            cursor: pointer; font-weight: 600; font-size: 11px;
            transition: all 0.2s; font-family: 'Inter', sans-serif;
            text-transform: uppercase; letter-spacing: 1px;
        }
        .dm-go:hover { background: #c9a961; color: #ffffff; }
        .dm-go:active { transform: scale(0.98); }
        .dm-go:disabled {
            background: transparent; color: #ccc; border-color: #e5e5e5;
            cursor: not-allowed;
        }
        .dm-footer {
            text-align: center; margin-top: 10px; padding-top: 10px;
            border-top: 1px solid #e5e5e5;
        }
        .dm-reset {
            font-size: 9px; cursor: pointer; color: #999;
            transition: color 0.2s; font-weight: 500;
            text-transform: uppercase; letter-spacing: 0.5px;
        }
        .dm-reset:hover { color: #c9a961; }
        .dm-syncing {
            background: #c9a961 !important; color: #ffffff !important;
            pointer-events: none;
        }
        .strong-row { background-color: rgba(201, 169, 97, 0.08) !important; }
        .dm-empty {
            text-align: center; padding: 30px 15px; color: #aaa;
            font-size: 10px; font-weight: 400; font-style: italic;
        }
    `);

    const timeLabels = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

    const ui = document.createElement('div');
    ui.id = 'dm-ui';
    document.body.appendChild(ui);

    let isUIOpen = false;

    // Visibility logic: Only show icon on Relations page
    if (window.location.href.includes('/Character/Relations/')) {
        const icon = document.createElement('div');
        icon.id = 'dm-icon';
        icon.innerHTML = '🍸';
        document.body.appendChild(icon);

        icon.addEventListener('click', () => { if (!isUIOpen) openUI(icon); else closeUI(icon); });

        document.addEventListener('click', (e) => {
            if (isUIOpen && !ui.contains(e.target) && e.target !== icon) closeUI(icon);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isUIOpen) closeUI(icon);
        });
    }

    setTimeout(() => {
        const isFamilyProcessing = GM_getValue('family_processing', false);
        const isProcessing = GM_getValue('processing', false);

        if (isFamilyProcessing) {
            processFamilyCall();
        } else if (isProcessing && (window.location.href.includes('/Interact/Details/') || window.location.href.includes('/Interact/Phone/'))) {
            processInteraction();
        }
    }, 500);

    function openUI(icon) {
        isUIOpen = true;
        if(icon) icon.style.display = 'none';
        ui.style.display = 'block';
        if (window.location.href.includes('/Character/Relations/')) {
            initRelationsPage(icon);
        } else {
            let q = GM_getValue(STORAGE_KEY, []);
            let cfg = GM_getValue(CONFIG_KEY, { city: "5", loc: "0", hour: 8, period: 'pm' });
            renderUI(ui, q, cfg, icon);
        }
    }

    function closeUI(icon) {
        isUIOpen = false;
        ui.style.display = 'none';
        if(icon) icon.style.display = 'flex';
    }

    function initRelationsPage(icon) {
        let q = GM_getValue(STORAGE_KEY, []);
        let cfg = GM_getValue(CONFIG_KEY, { city: "5", loc: "0", hour: 8, period: 'pm' });
        renderUI(ui, q, cfg, icon);
        document.querySelectorAll('table.data tbody tr').forEach((row) => {
            const lnk = row.querySelector('a[id*="lnkCharacter"]');
            if (lnk) {
                const isStrong = lnk.querySelector('strong') !== null;
                const charId = lnk.href.match(/\d+$/)[0];
                if (isStrong) row.classList.add('strong-row');
                const td = row.cells[0];
                let cb = td.querySelector('input[type="checkbox"]');
                if (!cb) {
                    cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.style.marginRight = "8px";
                    td.prepend(cb);
                }
                cb.className = 'dm-cb' + (isStrong ? ' strong-city' : '');
                cb.dataset.id = charId;
                cb.dataset.name = lnk.innerText;
                cb.checked = q.some(i => i.id === charId);
                cb.onclick = () => syncFromPage(cfg, icon);
            }
        });
    }

    function syncFromPage(cfg, icon) {
        let q = GM_getValue(STORAGE_KEY, []);
        let newQ = [];
        document.querySelectorAll('.dm-cb:checked').forEach((cb) => {
            const existing = q.find(i => i.id === cb.dataset.id);
            newQ.push(existing ? existing : { id: cb.dataset.id, name: cb.dataset.name });
        });
        updateQ(newQ, cfg, icon);
    }

    function updateQ(q, cfg, icon) {
        const startHour = cfg.period === 'pm' ? (cfg.hour === 12 ? 12 : cfg.hour + 12) : (cfg.hour === 12 ? 0 : cfg.hour);
        q.forEach((item, idx) => { item.t = (startHour + idx) % 24; });
        GM_setValue(STORAGE_KEY, q);
        renderUI(ui, q, cfg, icon);
    }

    function renderUI(cont, q, cfg, icon) {
        const locs = GM_getValue('locs_' + cfg.city, []);
        const isEmpty = q.length === 0;

        cont.innerHTML = `
            <div class="dm-header">
                <div class="dm-title">🍸 Reservations</div>
                <div class="dm-city-badge">City ${cfg.city}</div>
                <div class="dm-close" id="dm-close-btn">×</div>
            </div>
            <div class="dm-body">
                <div class="dm-btn-row">
                    <button id="dm-auto" class="dm-small-btn">Select</button>
                    <button id="dm-sync" class="dm-small-btn">Sync</button>
                </div>
                <button id="dm-family" class="dm-small-btn" style="width: 100%; margin-bottom: 10px;">Family Call</button>
                <select id="dm-loc-sel" class="dm-input">
                    <option value="0">Select venue</option>
                    ${locs.map(l => `<option value="${l.id}" ${l.id === cfg.loc ? 'selected' : ''}>${l.name}</option>`).join('')}
                </select>
                <div class="dm-time-row">
                    <select id="dm-hour-sel" class="dm-input" style="flex: 2;">
                        ${[...Array(12)].map((_, i) => `<option value="${i}" ${cfg.hour == i ? 'selected' : ''}>${i === 0 ? 12 : i}</option>`).join('')}
                    </select>
                    <select id="dm-period-sel" class="dm-input" style="flex: 1;">
                        <option value="am" ${cfg.period === 'am' ? 'selected' : ''}>AM</option>
                        <option value="pm" ${cfg.period === 'pm' ? 'selected' : ''}>PM</option>
                    </select>
                </div>
                <div id="dm-list">
                    ${isEmpty ? '<div class="dm-empty">No reservations</div>' : q.map((i, idx) => `
                        <div class="dm-item ${idx === 0 ? 'processing' : ''}" draggable="true" data-idx="${idx}">
                            <span class="dm-handle">⋮</span><span class="dm-name">${i.name}</span><span class="dm-time">${timeLabels[i.t]}</span>
                        </div>`).join('')}
                </div>
                <button id="dm-start" class="dm-go" ${isEmpty || cfg.loc === "0" ? 'disabled' : ''}>${isEmpty ? 'No guests' : `Confirm ${q.length}`}</button>
                <div class="dm-footer"><span id="dm-reset" class="dm-reset">Clear all</span></div>
            </div>
        `;

        cont.querySelector('#dm-close-btn').onclick = () => closeUI(icon);
        if (!isEmpty) setupDrag(cont, cfg, icon);
        cont.querySelector('#dm-sync').onclick = () => doSync(cfg, icon);
        cont.querySelector('#dm-auto').onclick = () => { document.querySelectorAll('.dm-cb.strong-city').forEach(cb => cb.checked = true); syncFromPage(cfg, icon); };
        cont.querySelector('#dm-family').onclick = () => doFamilyCall(cfg);
        cont.querySelector('#dm-hour-sel').onchange = (e) => { cfg.hour = parseInt(e.target.value); GM_setValue(CONFIG_KEY, cfg); syncFromPage(cfg, icon); };
        cont.querySelector('#dm-period-sel').onchange = (e) => { cfg.period = e.target.value; GM_setValue(CONFIG_KEY, cfg); syncFromPage(cfg, icon); };
        cont.querySelector('#dm-loc-sel').onchange = (e) => { cfg.loc = e.target.value; GM_setValue(CONFIG_KEY, cfg); renderUI(cont, q, cfg, icon); };
        cont.querySelector('#dm-start').onclick = () => { if (q.length > 0 && cfg.loc !== "0") { GM_setValue('total_items', q.length); GM_setValue('processing', true); closeUI(icon); window.location.href = `${BASE_URL}/World/Popmundo.aspx/Interact/Details/${q[0].id}`; } };
        cont.querySelector('#dm-reset').onclick = () => { if (confirm('Clear all?')) { GM_deleteValue(STORAGE_KEY); GM_deleteValue('total_items'); GM_deleteValue('processing'); location.reload(); } };
    }

    function setupDrag(cont, cfg, icon) {
        let dragIdx = null;
        cont.querySelectorAll('.dm-item').forEach(el => {
            el.ondragstart = (e) => { dragIdx = e.target.dataset.idx; e.target.classList.add('dragging'); };
            el.ondragend = (e) => e.target.classList.remove('dragging');
            el.ondragover = (e) => e.preventDefault();
            el.ondrop = (e) => {
                const target = e.target.closest('.dm-item');
                if (!target) return;
                let q = GM_getValue(STORAGE_KEY, []);
                const [moved] = q.splice(dragIdx, 1);
                q.splice(target.dataset.idx, 0, moved);
                updateQ(q, cfg, icon);
            };
        });
    }

    async function doSync(cfg, icon) {
        const btn = document.getElementById('dm-sync');
        const first = document.querySelector('.dm-cb.strong-city');
        if (!first) return;
        btn.classList.add('dm-syncing'); btn.textContent = 'Syncing...';
        GM_xmlhttpRequest({
            method: "GET",
            url: `${BASE_URL}/World/Popmundo.aspx/Interact/Details/${first.dataset.id}`,
            onload: (res) => {
                const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                const l = doc.getElementById('ctl00_cphTopColumn_ctl00_ddlDateLocale');
                const c = doc.getElementById('ctl00_cphTopColumn_ctl00_ddlDateCity');
                if (l && c) {
                    GM_setValue('locs_' + c.value, Array.from(l.options).filter(o => o.value !== "0").map(o => ({ id: o.value, name: o.text })));
                    cfg.city = c.value; GM_setValue(CONFIG_KEY, cfg);
                    renderUI(ui, GM_getValue(STORAGE_KEY, []), cfg, icon);
                }
                btn.classList.remove('dm-syncing'); btn.textContent = 'Sync';
            }
        });
    }

    async function doFamilyCall(cfg) {
        if (cfg.loc === "0") { alert('Please select a venue first!'); return; }
        const pairs = [['Park Wonbin', '3571876'], ['Lee Sohee', '3572154'], ['Osaki Shotaro', '3572316'], [Math.random() < 0.5 ? 'Song Eunseok' : 'Jung Sungchan', '3572401']];
        GM_setValue('family_pairs', pairs);
        GM_setValue('family_config', cfg);
        GM_setValue('family_processing', true);
        GM_setValue('family_current_pair', 0);
        GM_deleteValue('family_redirect_to_receiver');
        window.location.href = `${BASE_URL}/World/Popmundo.aspx`;
    }

    function processInteraction() {
        const q = GM_getValue(STORAGE_KEY, []);
        const cfg = GM_getValue(CONFIG_KEY, null);
        if (!cfg || q.length === 0) return;
        const cid = window.location.href.match(/\d+$/)?.[0];
        if (q[0].id !== cid) return;

        document.body.style.opacity = '0.3';
        const selL = document.getElementById('ctl00_cphTopColumn_ctl00_ddlDateLocale');
        const selT = document.getElementById('ctl00_cphTopColumn_ctl00_ddlDateTime');
        const selType = document.getElementById('ctl00_cphTopColumn_ctl00_ddlDateType');
        const btn = document.getElementById('ctl00_cphTopColumn_ctl00_btnDate');

        if (selT) selT.value = q[0].t;
        if (selL) selL.value = cfg.loc;
        if (selType) {
            const hangout = Array.from(selType.options).find(o => o.text.toLowerCase().includes('hang out'));
            if (hangout) selType.value = hangout.value;
        }

        if (selL && selL.value !== "0" && btn) {
            const next = q.slice(1);
            GM_setValue(STORAGE_KEY, next);
            setTimeout(() => {
                btn.click();
                setTimeout(() => {
                    if (next.length > 0) window.location.href = `${BASE_URL}/World/Popmundo.aspx/Interact/Details/${next[0].id}`;
                    else { GM_deleteValue('processing'); window.location.href = `${BASE_URL}/World/Popmundo.aspx/Character/Relations/`; }
                }, 400);
            }, 200);
        }
    }

    function processFamilyCall() {
        const pairs = GM_getValue('family_pairs', []);
        const cfg = GM_getValue('family_config', null);
        const currentPairIndex = GM_getValue('family_current_pair', 0);
        const receiverRedirect = GM_getValue('family_redirect_to_receiver', null);
        const currentUrl = window.location.href;

        if (currentPairIndex >= pairs.length) { cleanupFamilyProcessing(); window.location.href = `${BASE_URL}/World/Popmundo.aspx/Character/Relations/`; return; }

        const [senderName, receiverId] = pairs[currentPairIndex];

        if (receiverRedirect && currentUrl === `${BASE_URL}/World/Popmundo.aspx`) {
            GM_deleteValue('family_redirect_to_receiver');
            window.location.href = `${BASE_URL}/World/Popmundo.aspx/Interact/Details/${receiverId}`;
            return;
        }

        if (currentUrl === `${BASE_URL}/World/Popmundo.aspx`) {
            switchToCharacter(senderName, receiverId);
            return;
        }

        if (currentUrl.includes('/Interact/Details/') || currentUrl.includes('/Interact/Phone/')) {
            const cid = currentUrl.match(/\d+$/)?.[0];
            if (cid === receiverId) {
                setupAndSubmitInteraction(cfg);
            } else {
                window.location.href = `${BASE_URL}/World/Popmundo.aspx/Interact/Details/${receiverId}`;
            }
            return;
        }

        if (!currentUrl.includes('/Interact/')) window.location.href = `${BASE_URL}/World/Popmundo.aspx`;
    }

    function switchToCharacter(senderName, receiverId) {
        const charSelector = document.getElementById('ctl00_ctl08_ucCharacterBar_ddlCurrentCharacter');
        const switchBtn = document.getElementById('ctl00_ctl08_ucCharacterBar_btnChangeCharacter');
        if (charSelector && switchBtn) {
            const currentName = charSelector.options[charSelector.selectedIndex].text.trim();
            if (currentName === senderName) {
                window.location.href = `${BASE_URL}/World/Popmundo.aspx/Interact/Details/${receiverId}`;
                return;
            }
            const senderOption = Array.from(charSelector.options).find(o => o.text.trim() === senderName);
            if (senderOption) {
                charSelector.value = senderOption.value;
                GM_setValue('family_redirect_to_receiver', receiverId);
                setTimeout(() => switchBtn.click(), 200);
            } else {
                GM_setValue('family_current_pair', GM_getValue('family_current_pair', 0) + 1);
                location.reload();
            }
        }
    }

    function setupAndSubmitInteraction(cfg) {
        const selL = document.getElementById('ctl00_cphTopColumn_ctl00_ddlDateLocale');
        const selT = document.getElementById('ctl00_cphTopColumn_ctl00_ddlDateTime');
        const selType = document.getElementById('ctl00_cphTopColumn_ctl00_ddlDateType');
        const btn = document.getElementById('ctl00_cphTopColumn_ctl00_btnDate');
        if (!selL || !selT || !btn) return;

        document.body.style.opacity = '0.3';
        selT.value = cfg.period === 'pm' ? (cfg.hour === 12 ? 12 : cfg.hour + 12) : (cfg.hour === 12 ? 0 : cfg.hour);
        selL.value = cfg.loc;
        if (selType) {
            const hangout = Array.from(selType.options).find(o => o.text.toLowerCase().includes('hang out'));
            if (hangout) selType.value = hangout.value;
        }

        GM_setValue('family_current_pair', GM_getValue('family_current_pair', 0) + 1);
        setTimeout(() => { btn.click(); setTimeout(() => { window.location.href = `${BASE_URL}/World/Popmundo.aspx`; }, 600); }, 300);
    }

    function cleanupFamilyProcessing() {
        ['family_pairs','family_config','family_processing','family_current_pair','family_redirect_to_receiver'].forEach(k => GM_deleteValue(k));
    }
})();
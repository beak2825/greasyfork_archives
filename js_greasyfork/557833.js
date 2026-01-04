// ==UserScript==
// @name         Odoo Stock History RPC (V23.88 SearchBar Ultra)
// @namespace    http://tampermonkey.net/
// @version      23.88
// @description  Odoo库存 - 搜索框深度适配 + 暴力兜底 + 修复产品名读取
// @author       Playbox
// @match        *://*.odoo.com/web*
// @match        *://*.odoo.com/odoo*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557833/Odoo%20Stock%20History%20RPC%20%28V2388%20SearchBar%20Ultra%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557833/Odoo%20Stock%20History%20RPC%20%28V2388%20SearchBar%20Ultra%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 配置常量
    // ==========================================
    const SCRIPT_VER = 'V23.88 (SearchBar Ultra)';
    const MAX_CACHE_SIZE = 5000;
    const BTN_ID = 'odoo-stock-rpc-btn-final';
    const BTN_CLASS = 'odoo-stock-floating-button-custom';
    const STORAGE_KEY_DATA = 'odoo_stock_history_cache_v3';
    const STORAGE_KEY_POS = 'odoo_stock_rpc_btn_pos_final';
    const STORAGE_KEY_THEME = 'odoo_stock_theme_mode';

    const ICONS = {
        search: '📡', check: '✅', loc: '📍',
        pause: '❚❚', play: '▶', stop: '■',
        up: '▲', down: '▼', trash: '🗑️',
        col_hand: '📦', col_act: '📉', col_virt: '🔮',
        manual: '🎯', sun: '☀️', moon: '🌙', close: '✕'
    };

    console.log(`🚀 Odoo Inventory Script ${SCRIPT_VER} Loaded`);

    // ==========================================
    // 全局变量
    // ==========================================
    window.hasAskedLocation = false;
    let autoQueryTimer = null;
    let consecutiveErrors = 0;
    let currentRunId = 0;
    let isPaused = false;
    let manualOverrideLocation = null;
    let debugLogCount = 0;
    let globalSearchProduct = null; // 全局缓存搜索框内容

    let MEMORY_CACHE = {};
    try {
        const saved = localStorage.getItem(STORAGE_KEY_DATA);
        if (saved) MEMORY_CACHE = JSON.parse(saved);
    } catch (e) { MEMORY_CACHE = {}; }

    let GLOBAL_ID_CACHE = { products: {}, locations: {} };
    let currentTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';

    // ==========================================
    // 样式注入
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --rpc-bg: #2c3e50; --rpc-text: #ffffff; --rpc-border: rgba(255,255,255,0.3); --rpc-shadow: rgba(0,0,0,0.5);
            --rpc-btn-bg: rgba(255,255,255,0.15); --rpc-btn-hover: rgba(255,255,255,0.25);
            --rpc-table-text: #ffffff; --rpc-table-th: #81ecec; --rpc-table-border: rgba(255,255,255,0.2);
            --rpc-val-hand: #55efc4; --rpc-val-act: #ff7675; --rpc-val-virt: #a29bfe; --rpc-val-zero: #b2bec3;
        }
        body.odoo-rpc-light-mode {
            --rpc-bg: #f8f9fa; --rpc-text: #2d3436; --rpc-border: #b2bec3; --rpc-shadow: rgba(0,0,0,0.2);
            --rpc-btn-bg: rgba(0,0,0,0.05); --rpc-btn-hover: rgba(0,0,0,0.1);
            --rpc-table-text: #000000; --rpc-table-th: #2d3436; --rpc-table-border: #dcdde1;
            --rpc-val-hand: #006400; --rpc-val-act: #d63031; --rpc-val-virt: #6c5ce7; --rpc-val-zero: #999999;
        }
        .${BTN_CLASS} {
            position: fixed; z-index: 2147483647; background: var(--rpc-bg); color: var(--rpc-text);
            border: 1px solid var(--rpc-border); padding: 5px 8px; border-radius: 6px;
            box-shadow: 0 4px 12px var(--rpc-shadow); cursor: move; font-size: 12px; font-weight: 600;
            font-family: -apple-system, sans-serif; user-select: none; display: flex; flex-direction: column; gap: 4px;
            min-width: 110px; touch-action: none; transition: background 0.2s, color 0.2s;
        }
        .${BTN_CLASS}:active { opacity: 0.9; transform: scale(0.98); }
        .${BTN_CLASS}.loading { cursor: default; opacity: 0.8; }
        .odoo-controls { display: flex; justify-content: space-between; align-items: center; gap: 4px; border-bottom: 1px solid var(--rpc-border); padding-bottom: 4px; margin-bottom: 2px; }
        .odoo-controls.hidden { display: none; }
        .odoo-auto-group { display: flex; align-items: center; gap: 2px; font-size: 11px; opacity: 1; font-weight: bold; color: var(--rpc-text); }
        .odoo-auto-switch { width: 14px; height: 14px; cursor: pointer; accent-color: #00d4ff; margin: 0; }
        .odoo-cols-group { display: flex; gap: 2px; background: rgba(0,0,0,0.1); padding: 2px 3px; border-radius: 4px; }
        .odoo-col-btn { width: 18px; height: 18px; font-size: 11px; display: flex; align-items: center; justify-content: center; border-radius: 3px; cursor: pointer; transition: all 0.2s; opacity: 0.7; border: 1px solid transparent; background: var(--rpc-btn-bg); color: var(--rpc-text); }
        .odoo-col-btn:hover { opacity: 1; }
        .odoo-col-btn.active.hand { opacity: 1; background: #00b894; color: #fff; }
        .odoo-col-btn.active.act { opacity: 1; background: #ff7675; color: #fff; }
        .odoo-col-btn.active.virt { opacity: 1; background: #6c5ce7; color: #fff; }
        .odoo-actions-group { display: flex; gap: 3px; align-items: center; }
        .odoo-icon-btn { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; opacity: 0.8; cursor: pointer; font-size: 12px; color: var(--rpc-text); border-radius: 4px; transition: background 0.2s; }
        .odoo-icon-btn:hover { background: var(--rpc-btn-hover); opacity: 1; }
        .odoo-icon-btn.delete:hover { color: #ff7675; }
        .odoo-icon-btn.manual:hover { color: #ffeaa7; }
        .odoo-icon-btn.theme:hover { color: #fdcb6e; }
        .odoo-main-row { display: flex; align-items: center; justify-content: space-between; height: 20px; width: 100%; }
        .odoo-status-area { display: flex; align-items: center; gap: 4px; flex-grow: 1; justify-content: center; font-weight: 700; font-size: 12px; color: var(--rpc-text); }
        .odoo-status-text { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .odoo-fold-btn { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; opacity: 0.8; cursor: pointer; margin-left: 2px; font-size: 10px; color: var(--rpc-text); }
        .odoo-ctrl-btn { background: var(--rpc-btn-bg); border-radius: 3px; padding: 0 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; height: 18px; font-size: 11px; line-height: 1; font-family: monospace; color: var(--rpc-text); }
        .th-rpc-col, .td-rpc-col {
            width: 65px !important; min-width: 65px !important;
            text-align: right !important; border-left: 1px solid var(--rpc-table-border) !important;
            white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;
            font-family: "Roboto Mono", Consolas, monospace !important; font-size: 13px !important;
            vertical-align: middle !important; color: var(--rpc-table-text) !important;
        }
        .th-rpc-col { color: var(--rpc-table-th) !important; font-weight: 900 !important; padding-right: 2px !important; background-color: rgba(128,128,128,0.05) !important; }
        .rpc-val-hand { font-weight: 800 !important; color: var(--rpc-val-hand) !important; }
        .rpc-val-act { font-weight: 800 !important; color: var(--rpc-val-act) !important; }
        .rpc-val-virt { font-weight: 800 !important; color: var(--rpc-val-virt) !important; }
        .rpc-val-zero { color: var(--rpc-val-zero) !important; font-weight: 700; opacity: 0.8; }
        #odoo-loc-selector-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 2147483649; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
        .odoo-loc-modal { background: var(--rpc-bg); border: 1px solid var(--rpc-border); border-radius: 12px; padding: 15px; width: 280px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.6); display: flex; flex-direction: column; gap: 10px; color: var(--rpc-text); position: relative; }
        .odoo-loc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; border-bottom: 1px solid var(--rpc-border); padding-bottom: 10px; }
        .odoo-loc-title { font-size: 14px; font-weight: bold; }
        .odoo-loc-close-x { cursor: pointer; padding: 4px 10px; font-size: 18px; color: #ff6b6b; border-radius: 6px; background: rgba(255,255,255,0.1); font-weight: bold; line-height: 1; opacity: 1 !important; }
        .odoo-loc-close-x:hover { background: #ff7675; color: white; }
        .odoo-loc-btn { background: var(--rpc-btn-bg); color: var(--rpc-text); border: 1px solid var(--rpc-border); padding: 12px; border-radius: 8px; font-size: 13px; cursor: pointer; text-align: left; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between; }
        .odoo-loc-btn:hover, .odoo-loc-btn:active { background: var(--rpc-val-hand); border-color: var(--rpc-val-hand); color: #fff; }
        .odoo-loc-count { font-size: 10px; opacity: 0.7; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 10px; }
        .odoo-loc-cancel { background: transparent; color: var(--rpc-val-zero); text-align: center; font-size: 12px; padding: 10px; cursor: pointer; margin-top: 5px; border: 1px dashed var(--rpc-border); border-radius: 8px; }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 按钮逻辑
    // ==========================================
    function manageButton() {
        if (currentTheme === 'light') document.body.classList.add('odoo-rpc-light-mode');
        else document.body.classList.remove('odoo-rpc-light-mode');

        const currentUrl = window.location.href;
        const isTargetPage = currentUrl.includes('stock.move.line') || currentUrl.includes('moves-history');

        if (!isTargetPage) {
            const existingBtn = document.getElementById(BTN_ID);
            if (existingBtn) existingBtn.remove();
            window.hasAskedLocation = false;
            if (autoQueryTimer) clearTimeout(autoQueryTimer);
            if (Object.keys(GLOBAL_ID_CACHE.products).length > 0) GLOBAL_ID_CACHE = { products: {}, locations: {} };
            return;
        }

        const table = document.querySelector('.o_list_table');
        if (!table || table.closest('.o_field_widget')) {
            const b = document.getElementById(BTN_ID);
            if (b) b.remove();
            return;
        }

        const existingBtn = document.getElementById(BTN_ID);
        if (!existingBtn) {
            createButton();
        } else {
            const isAuto = localStorage.getItem('odoo_auto_query_v23') === 'true';
            if (isAuto && !existingBtn.classList.contains('loading')) {
                const rawRows = table.querySelectorAll('tbody tr.o_data_row');
                let hasNewRows = false;
                for (const row of rawRows) {
                    if (!row.querySelector('.td-rpc-col')) {
                        hasNewRows = true;
                        break;
                    }
                }
                if (hasNewRows && !autoQueryTimer) {
                    autoQueryTimer = setTimeout(() => { runLogic(true); autoQueryTimer = null; }, 600);
                }
            }
        }
    }

    function createButton() {
        const btn = document.createElement('div');
        btn.id = BTN_ID;
        btn.className = BTN_CLASS;
        const isAuto = localStorage.getItem('odoo_auto_query_v23') === 'true';
        const sHand = localStorage.getItem('odoo_show_hand') !== 'false';
        const sAct = localStorage.getItem('odoo_show_act') !== 'false';
        const sVirt = localStorage.getItem('odoo_show_virt') === 'true';
        const isCollapsed = localStorage.getItem('odoo_ui_collapsed') === 'true';
        const themeIcon = currentTheme === 'light' ? ICONS.sun : ICONS.moon;

        btn.innerHTML = `
            <div class="odoo-controls ${isCollapsed ? 'hidden' : ''}" id="odoo-controls-panel">
                <label class="odoo-auto-group" title="翻页自动查询">
                    <input type="checkbox" id="chk-auto" class="odoo-auto-switch" ${isAuto ? 'checked' : ''}><span>自动</span>
                </label>
                <div class="odoo-cols-group">
                    <div id="tog-hand" class="odoo-col-btn hand ${sHand ? 'active' : ''}" title="显示[在手]">${ICONS.col_hand}</div>
                    <div id="tog-act"  class="odoo-col-btn act  ${sAct ? 'active' : ''}"  title="显示[实际]">${ICONS.col_act}</div>
                    <div id="tog-virt" class="odoo-col-btn virt ${sVirt ? 'active' : ''}" title="显示[预测]">${ICONS.col_virt}</div>
                </div>
                <div class="odoo-actions-group">
                    <div class="odoo-icon-btn theme" id="btn-theme-toggle" title="日夜模式">${themeIcon}</div>
                    <div class="odoo-icon-btn manual" id="btn-manual-loc" title="手动选仓">${ICONS.manual}</div>
                    <div class="odoo-icon-btn delete" id="btn-clear-cache" title="清空缓存">${ICONS.trash}</div>
                </div>
            </div>
            <div class="odoo-main-row">
                <div id="odoo-btn-text" class="odoo-status-area">${ICONS.search} <span class="odoo-status-text">查询库存</span></div>
                <div id="odoo-fold-btn" class="odoo-fold-btn" title="折叠/展开">${isCollapsed ? ICONS.down : ICONS.up}</div>
            </div>`;

        let savedPos = { top: '85px', right: '40px' };
        try { const raw = localStorage.getItem(STORAGE_KEY_POS); if (raw) savedPos = JSON.parse(raw); } catch (e) { }
        btn.style.top = savedPos.top; btn.style.right = savedPos.right || 'auto'; btn.style.left = savedPos.left || 'auto';
        document.body.appendChild(btn);

        const chkAuto = btn.querySelector('#chk-auto');
        const togHand = btn.querySelector('#tog-hand');
        const togAct = btn.querySelector('#tog-act');
        const togVirt = btn.querySelector('#tog-virt');
        const btnClear = btn.querySelector('#btn-clear-cache');
        const btnManual = btn.querySelector('#btn-manual-loc');
        const btnTheme = btn.querySelector('#btn-theme-toggle');
        const foldBtn = btn.querySelector('#odoo-fold-btn');
        const txtArea = btn.querySelector('#odoo-btn-text');
        const controlsPanel = btn.querySelector('#odoo-controls-panel');

        const toggleCol = (key, el) => {
            let val = localStorage.getItem(key);
            let isOn = val === 'true'; if (val === null) isOn = (key !== 'odoo_show_virt');
            const newState = !isOn; localStorage.setItem(key, newState);
            if (newState) el.classList.add('active'); else el.classList.remove('active');
            runLogic(false);
        };

        togHand.onclick = (e) => { e.stopPropagation(); toggleCol('odoo_show_hand', togHand); };
        togAct.onclick = (e) => { e.stopPropagation(); toggleCol('odoo_show_act', togAct); };
        togVirt.onclick = (e) => { e.stopPropagation(); toggleCol('odoo_show_virt', togVirt); };
        chkAuto.addEventListener('change', (e) => { localStorage.setItem('odoo_auto_query_v23', e.target.checked); if (e.target.checked) runLogic(true); });

        btnTheme.onclick = (e) => {
            e.stopPropagation();
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(STORAGE_KEY_THEME, currentTheme);
            btnTheme.innerText = currentTheme === 'light' ? ICONS.sun : ICONS.moon;
            manageButton();
        };

        btnClear.onclick = (e) => {
            e.stopPropagation();
            if (confirm('确定清空缓存？')) {
                MEMORY_CACHE = {}; manualOverrideLocation = null;
                localStorage.removeItem(STORAGE_KEY_DATA);
                GLOBAL_ID_CACHE = { products: {}, locations: {} };
                debugLogCount = 0;
                updateStatus('idle', '缓存已清');
                setTimeout(() => updateStatus('idle', '查询库存'), 1000);
            }
        };

        btnManual.onclick = (e) => {
            e.stopPropagation();
            const table = document.querySelector('.o_list_table'); if (!table) return;
            const cells = Array.from(table.querySelectorAll('tbody tr.o_data_row'));
            const locCounts = {};
            for (const row of cells) {
                const srcCell = row.querySelector('td[name="location_id"]'); const dstCell = row.querySelector('td[name="location_dest_id"]');
                if (srcCell) { const t = srcCell.textContent.trim(); if (t && !t.includes('Partner') && !t.includes('Virtual')) locCounts[t] = (locCounts[t] || 0) + 1; }
                if (dstCell) { const t = dstCell.textContent.trim(); if (t && !t.includes('Partner') && !t.includes('Virtual')) locCounts[t] = (locCounts[t] || 0) + 1; }
            }
            const sortedLocs = Object.entries(locCounts).sort((a, b) => b[1] - a[1]).map(x => ({ name: x[0], count: x[1] }));
            if (sortedLocs.length === 0) { alert('当前页面没找到有效的内部位置'); return; }
            showLocationSelector(sortedLocs, async (selectedName) => {
                if (!selectedName) return;
                try {
                    updateStatus('running', '锁定中...');
                    const loc = await searchLocationByName(selectedName, true);
                    if (loc) { manualOverrideLocation = loc; runLogic(false); } else { updateStatus('idle', '未找到ID'); }
                } catch (e) { console.error(e); }
            });
        };

        foldBtn.onclick = (e) => {
            e.stopPropagation();
            const wasCollapsed = controlsPanel.classList.contains('hidden');
            if (wasCollapsed) { controlsPanel.classList.remove('hidden'); foldBtn.innerText = ICONS.up; localStorage.setItem('odoo_ui_collapsed', 'false'); }
            else { controlsPanel.classList.add('hidden'); foldBtn.innerText = ICONS.down; localStorage.setItem('odoo_ui_collapsed', 'true'); }
        };

        [chkAuto, togHand, togAct, togVirt, btnClear, btnManual, btnTheme, foldBtn, txtArea].forEach(el => {
            el.addEventListener('mousedown', (e) => e.stopPropagation());
            el.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });
            if (el.parentNode) {
                el.parentNode.addEventListener('mousedown', (e) => e.stopPropagation());
                el.parentNode.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });
            }
        });

        txtArea.addEventListener('click', () => { if (!btn.classList.contains('loading')) runLogic(false); });

        let isDragging = false; let hasMoved = false; let startX, startY, initialLeft, initialTop;
        const startDrag = (x, y) => { isDragging = true; hasMoved = false; startX = x; startY = y; const rect = btn.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top; btn.style.cursor = 'grabbing'; };
        const moveDrag = (x, y) => { if (!isDragging) return; if (Math.abs(x - startX) > 5 || Math.abs(y - startY) > 5) { hasMoved = true; btn.style.right = 'auto'; btn.style.left = (initialLeft + (x - startX)) + 'px'; btn.style.top = (initialTop + (y - startY)) + 'px'; } };
        const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
        const onTouchMove = (e) => { if (isDragging) e.preventDefault(); const touch = e.touches[0]; moveDrag(touch.clientX, touch.clientY); };
        const endDrag = (removeListenerFunc, moveEvent, endEvent) => { isDragging = false; removeListenerFunc(moveEvent, moveEvent === 'touchmove' ? onTouchMove : onMouseMove); removeListenerFunc(endEvent, endEvent === 'touchend' ? onTouchEnd : onMouseUp); if (hasMoved) { localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ top: btn.style.top, left: btn.style.left, right: 'auto' })); } btn.style.cursor = 'move'; };
        const onMouseUp = () => endDrag(document.removeEventListener, 'mousemove', 'mouseup');
        const onTouchEnd = () => { endDrag(document.removeEventListener, 'touchmove', 'touchend'); document.removeEventListener('touchcancel', onTouchEnd); };
        btn.onmousedown = (e) => { if (e.button !== 0) return; if (e.target.closest('.odoo-auto-switch') || e.target.closest('.odoo-col-btn') || e.target.closest('.odoo-icon-btn') || e.target.closest('.odoo-fold-btn') || e.target.closest('.odoo-ctrl-btn')) return; startDrag(e.clientX, e.clientY); document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); };
        btn.ontouchstart = (e) => { if (e.touches.length > 1) return; if (e.target.closest('.odoo-auto-switch') || e.target.closest('.odoo-col-btn') || e.target.closest('.odoo-icon-btn') || e.target.closest('.odoo-fold-btn') || e.target.closest('.odoo-ctrl-btn')) return; const touch = e.touches[0]; startDrag(touch.clientX, touch.clientY); document.addEventListener('touchmove', onTouchMove, { passive: false }); document.addEventListener('touchend', onTouchEnd); document.addEventListener('touchcancel', onTouchEnd); };
    }

    function updateStatus(state, text) {
        const btn = document.getElementById(BTN_ID); if (!btn) return;
        const txtArea = btn.querySelector('#odoo-btn-text');
        if (state === 'idle') {
            btn.classList.remove('loading');
            let icon = text.includes('已查') ? ICONS.check : ICONS.search;
            if (text.includes('全库')) icon = ICONS.loc; if (text.includes('已清')) icon = ICONS.check;
            txtArea.innerHTML = `${icon} <span class="odoo-status-text">${text || '查询库存'}</span>`;
        } else if (state === 'running') {
            btn.classList.add('loading');
            txtArea.innerHTML = `<div class="odoo-ctrl-btn" id="btn-pause">${ICONS.pause}</div><div class="odoo-ctrl-btn" id="btn-stop">${ICONS.stop}</div><span class="odoo-status-text" style="font-family:monospace; margin-left:4px; font-size:11px;">${text}</span>`;
            bindControls();
        } else if (state === 'paused') {
            btn.classList.add('loading');
            txtArea.innerHTML = `<div class="odoo-ctrl-btn" id="btn-resume">${ICONS.play}</div><div class="odoo-ctrl-btn" id="btn-stop">${ICONS.stop}</div><span style="font-size:11px; margin-left:2px;">暂停</span>`;
            bindControls();
        } else if (state === 'stopped') {
            btn.classList.remove('loading');
            txtArea.innerHTML = `<span style="opacity:0.9">${ICONS.stop}</span> <span>已停止</span>`;
            setTimeout(() => { if (!btn.classList.contains('loading')) updateStatus('idle', `已查: ${text}`); }, 2000);
        }
    }

    function bindControls() {
        const btnPause = document.getElementById('btn-pause'); const btnResume = document.getElementById('btn-resume'); const btnStop = document.getElementById('btn-stop');
        if (btnPause) btnPause.onclick = (e) => { e.stopPropagation(); isPaused = true; updateStatus('paused'); };
        if (btnResume) btnResume.onclick = (e) => { e.stopPropagation(); isPaused = false; updateStatus('running', '继续...'); };
        if (btnStop) btnStop.onclick = (e) => { e.stopPropagation(); currentRunId++; isPaused = false; updateStatus('stopped', '中止'); };
        [btnPause, btnResume, btnStop].forEach(btn => { if (btn) btn.addEventListener('touchstart', (e) => { e.stopPropagation(); btn.click(); }, { passive: false }); });
    }

    function saveCacheToDisk() {
        const trimCache = (countToRemove) => { const keys = Object.keys(MEMORY_CACHE); const newCache = {}; const keepKeys = keys.slice(countToRemove); keepKeys.forEach(k => { newCache[k] = MEMORY_CACHE[k]; }); MEMORY_CACHE = newCache; return keys.length - keepKeys.length; };
        try {
            const currentSize = Object.keys(MEMORY_CACHE).length;
            if (currentSize > MAX_CACHE_SIZE) { trimCache(currentSize - MAX_CACHE_SIZE + 500); }
            try { localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(MEMORY_CACHE)); } catch (quotaErr) { if (quotaErr.name === 'QuotaExceededError') { trimCache(2000); localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(MEMORY_CACHE)); } }
        } catch (e) { console.error('Cache Save Err:', e); }
    }

    function showLocationSelector(candidates, callback) {
        if (document.getElementById('odoo-loc-selector-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'odoo-loc-selector-overlay';
        let html = `
        <div class="odoo-loc-modal">
            <div class="odoo-loc-header">
                <div class="odoo-loc-title">🎯 请选择目标仓库</div>
                <div class="odoo-loc-close-x" id="odoo-loc-close-top">${ICONS.close}</div>
            </div>`;
        candidates.forEach(item => { html += `<div class="odoo-loc-btn" data-loc="${item.name}"><span>${ICONS.loc} ${item.name}</span><span class="odoo-loc-count">${item.count}</span></div>`; });
        html += '<div class="odoo-loc-cancel" id="odoo-loc-cancel">取消 (查全库)</div></div>';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        const closeFunc = () => { overlay.remove(); updateStatus('idle', '已取消'); if (typeof callback === 'function') callback(null); };
        const btns = overlay.querySelectorAll('.odoo-loc-btn');
        btns.forEach(btn => { btn.onclick = (e) => { e.stopPropagation(); const selected = btn.getAttribute('data-loc'); overlay.remove(); callback(selected); }; });
        document.getElementById('odoo-loc-cancel').onclick = (e) => { e.stopPropagation(); closeFunc(); };
        document.getElementById('odoo-loc-close-top').onclick = (e) => { e.stopPropagation(); closeFunc(); };
        overlay.onclick = (e) => { if (e.target === overlay) { e.stopPropagation(); closeFunc(); } };
    }

    // ==========================================
    // 搜索框读取逻辑 (核心修复)
    // ==========================================
    function extractProductFromSearch() {
        // 1. 获取所有筛选标签
        const facets = document.querySelectorAll('.o_searchview_facet');
        console.log(`🔍 [搜索框] 扫描到 ${facets.length} 个筛选条件`);

        for (const facet of facets) {
            // 2. 宽松获取标签名 (去掉图标、去掉空格、转小写)
            const labelEl = facet.querySelector('.o_searchview_facet_label');
            const labelText = labelEl ? labelEl.textContent.trim().toLowerCase() : '';

            // 3. 获取具体值
            const valueEl = facet.querySelector('.o_facet_value');
            const valueText = valueEl ? valueEl.textContent.trim() : '';

            console.log(`🔍 [搜索框] 条件: [${labelText}] = [${valueText}]`);

            // 4. 只要标签包含“产”或“品”或“product”，就认为是产品
            if (labelText.includes('product') || labelText.includes('产品') || labelText.includes('品') || labelText.includes('货') || labelText.includes('produ')) {
                console.log(`✅ [搜索框] 锁定产品名: ${valueText}`);
                return valueText;
            }
        }

        // 5. 暴力兜底：如果没识别出“产品”标签，但只有一个筛选条件，盲猜它是产品 (应对非常规语言或标签)
        if (facets.length === 1) {
            const val = facets[0].querySelector('.o_facet_value')?.textContent.trim();
            if (val) {
                console.warn(`⚠️ [搜索框] 未识别标签，强制使用唯一条件作为产品名: ${val}`);
                return val;
            }
        }

        console.log(`❌ [搜索框] 未找到产品信息`);
        return null;
    }

    async function runLogic(isAutoTrigger = false) {
        const table = document.querySelector('.o_list_table'); if (!table) return;
        const myRunId = ++currentRunId;
        if (!isAutoTrigger) window.hasAskedLocation = false;
        consecutiveErrors = 0; isPaused = false;
        debugLogCount = 0;

        // ★ 核心修复：每次运行前，先扫描搜索框
        globalSearchProduct = extractProductFromSearch();

        const showHand = localStorage.getItem('odoo_show_hand') !== 'false';
        const showAct = localStorage.getItem('odoo_show_act') !== 'false';
        const showVirt = localStorage.getItem('odoo_show_virt') === 'true';

        const activeCols = [];
        if (showHand) activeCols.push({ key: 'hand', title: '在手' });
        if (showAct) activeCols.push({ key: 'act', title: '实际' });
        if (showVirt) activeCols.push({ key: 'virt', title: '预测' });

        if (activeCols.length === 0) { updateStatus('idle', '未选列'); return; }

        if (!isAutoTrigger) console.clear();
        console.log(`▶️ Start Query Run #${myRunId}`);
        updateStatus('running', '侦测...');

        try {
            if (myRunId !== currentRunId || !table.isConnected) return;
            await new Promise(r => setTimeout(r, 50));

            let targetLocationId = null; let targetLocationName = '全库';
            const GENERIC_NAMES = ['库存', '实物库存', 'Stock', 'Inventory', 'Existencias', 'Physical Locations', '移动历史', 'Moves History'];

            if (manualOverrideLocation) {
                targetLocationId = manualOverrideLocation.id; targetLocationName = manualOverrideLocation.complete_name;
            } else {
                try {
                    const params = new URLSearchParams(window.location.hash.substring(1));
                    if (params.get('active_id') && (!params.get('active_model') || params.get('active_model') === 'stock.location')) { targetLocationId = parseInt(params.get('active_id')); targetLocationName = 'URL锁定'; }
                } catch (e) { /* ignore */ }

                if (!targetLocationId) {
                    const candidates = [];
                    Array.from(document.querySelectorAll('.breadcrumb-item, .o_breadcrumb .active')).forEach(el => candidates.push(el.innerText.trim()));
                    document.querySelectorAll('.o_searchview_facet .o_facet_value').forEach(el => candidates.push(el.innerText.trim()));
                    candidates.reverse();
                    for (const rawTxt of candidates) {
                        if (myRunId !== currentRunId) return; if (!rawTxt) continue;
                        const cleanTxt = rawTxt.includes(':') ? rawTxt.split(':')[1].trim() : rawTxt;
                        const parts = cleanTxt.split('/');
                        for (let part of parts.reverse()) {
                            part = part.trim(); if (part.length < 2 || GENERIC_NAMES.includes(part)) continue;
                            try { const loc = await searchLocationByName(part, true); if (loc) { targetLocationId = loc.id; targetLocationName = loc.complete_name; break; } } catch (e) { /* ignore */ }
                        }
                        if (targetLocationId) break;
                    }
                }

                if (!targetLocationId) {
                    if (myRunId !== currentRunId) return;
                    const cells = Array.from(table.querySelectorAll('tbody tr.o_data_row')).slice(0, 30);
                    const locCounts = {}; let totalInternal = 0;
                    for (const row of cells) {
                        const srcCell = row.querySelector('td[name="location_id"]'); const dstCell = row.querySelector('td[name="location_dest_id"]');
                        if (srcCell) { const t = srcCell.textContent.trim(); if (t && !t.includes('Partner') && !t.includes('Virtual')) { locCounts[t] = (locCounts[t] || 0) + 1; totalInternal++; } }
                        if (dstCell) { const t = dstCell.textContent.trim(); if (t && !t.includes('Partner') && !t.includes('Virtual')) { locCounts[t] = (locCounts[t] || 0) + 1; totalInternal++; } }
                    }
                    let maxCount = 0; let maxName = null;
                    for (const [name, count] of Object.entries(locCounts)) { if (count > maxCount) { maxCount = count; maxName = name; } }
                    const isAmbiguous = (cells.length === 1 && totalInternal >= 2);
                    if (isAmbiguous) {
                        const candidates = Object.entries(locCounts).map(x => ({ name: x[0], count: x[1] }));
                        updateStatus('stopped', '待选择');
                        showLocationSelector(candidates, async (selectedName) => {
                            if (!selectedName) { runLogic(false); return; }
                            try { const loc = await searchLocationByName(selectedName, true); if (loc) { manualOverrideLocation = loc; runLogic(false); } } catch (e) { /* ignore */ }
                        });
                        return;
                    }
                    if (maxName && maxCount > (cells.length * 2) * 0.4) {
                        try { const loc = await searchLocationByName(maxName, true); if (loc) { targetLocationId = loc.id; targetLocationName = loc.complete_name; } } catch (e) { /* ignore */ }
                    }
                }
            }

            if (!targetLocationId && !window.hasAskedLocation && !isAutoTrigger) {
                await new Promise(r => setTimeout(r, 100)); if (myRunId !== currentRunId) return;
                const manualInput = prompt('🕵️ 位置未知，请输入 (不输查全库)：'); window.hasAskedLocation = true;
                if (manualInput && manualInput.trim().length > 0) { try { const loc = await searchLocationByName(manualInput.trim(), true); if (loc) { targetLocationId = loc.id; targetLocationName = loc.complete_name; } } catch (e) { /* ignore */ } }
            }

            let shortLocName = '全库';
            if (targetLocationId) {
                const parts = targetLocationName.split('/'); const lastName = parts[parts.length - 1].trim();
                shortLocName = GENERIC_NAMES.includes(lastName) ? (parts.length > 1 ? parts[parts.length - 2].trim() : '全库') : lastName;
            }
            updateStatus('running', `查: ${shortLocName}`);
            console.log(`📍 Locked Location: ${targetLocationName} (ID: ${targetLocationId})`);

            const theadRow = table.querySelector('thead tr'); const actionTh = theadRow.querySelector('.o_list_actions_header');
            const oldThs = theadRow.querySelectorAll('.th-rpc-col'); if (oldThs.length !== activeCols.length) oldThs.forEach(th => th.remove());
            if (!theadRow.querySelector('.th-rpc-col')) {
                activeCols.forEach(col => {
                    const th = document.createElement('th'); th.className = 'th-rpc-col align-middle'; th.innerText = col.title; th.title = `基准: ${targetLocationName}`;
                    if (actionTh) actionTh.before(th); else theadRow.appendChild(th);
                });
            }

            const rows = Array.from(table.querySelectorAll('tbody tr.o_data_row'));
            let model = 'stock.move.line'; if (!table.querySelector('td[name="reference"]')) model = 'stock.move';
            const pendingRows = []; const colCount = activeCols.length; const CHUNK_SIZE = 15;

            for (let i = 0; i < rows.length; i++) {
                if (i > 0 && i % CHUNK_SIZE === 0) { await new Promise(r => setTimeout(r, 0)); if (myRunId !== currentRunId) return; }
                const row = rows[i]; const existingCols = row.querySelectorAll('.td-rpc-col');
                if (existingCols.length !== colCount) {
                    existingCols.forEach(td => td.remove()); const actionTd = row.querySelector('td.w-print-0') || row.lastElementChild;
                    for (let j = 0; j < colCount; j++) {
                        const td = document.createElement('td'); td.className = 'td-rpc-col o_data_cell'; td.innerText = '...'; td.style.color = '#ccc';
                        if (actionTd) actionTd.before(td); else row.appendChild(td);
                    }
                }

                let productName = '';
                const prodCell = row.querySelector('td[name="product_id"]');
                if (prodCell) {
                    productName = prodCell.textContent.trim();
                    if (!productName) productName = prodCell.getAttribute('title') || '';
                    if (!productName) { const input = prodCell.querySelector('input'); if (input) productName = input.value; }
                }

                // ★ 关键：如果行内没名字，使用全局搜索框的名字
                if (!productName && globalSearchProduct) {
                    productName = globalSearchProduct;
                }

                // 如果依然没名字，就只能跳过了
                if (!productName) continue;

                const refText = row.querySelector('td[name="reference"]')?.textContent.trim() || '';
                const dateText = row.querySelector('td[name="date"]')?.textContent.trim() || '';
                const qtyCell = row.querySelector('td[name="quantity"]') || row.querySelector('td[name="qty_done"]');
                const qtyVal = qtyCell ? parseFloat(qtyCell.textContent.trim().replace(/,/g, '')) : 0;

                const tds = row.querySelectorAll('.td-rpc-col');
                const cacheKey = `${targetLocationId || 'all'}_${productName}_${refText}_${dateText}_${qtyVal}`;
                const cachedData = MEMORY_CACHE[cacheKey];

                if (cachedData) { renderResult(tds, cachedData, activeCols); }
                else if (tds[0] && (tds[0].innerText === '...' || tds[0].innerText === '')) { pendingRows.push(row); }
            }

            if (pendingRows.length === 0) { if (myRunId === currentRunId) updateStatus('idle', `已查: ${shortLocName}`); return; }

            console.log(`📋 Rows to process: ${pendingRows.length}`);
            const CONCURRENCY = 6; let completedCount = 0; const totalCount = pendingRows.length; let newDataFetched = false;

            const processBatch = async () => {
                for (let i = 0; i < pendingRows.length; i += CONCURRENCY) {
                    while (isPaused) { if (myRunId !== currentRunId) return; await new Promise(r => setTimeout(r, 200)); }
                    if (myRunId !== currentRunId || !table.isConnected) return;
                    if (consecutiveErrors > 5) { updateStatus('idle', '网络Err'); break; }
                    const batch = pendingRows.slice(i, i + CONCURRENCY);
                    if (myRunId === currentRunId && !isPaused) updateStatus('running', `${completedCount}/${totalCount}`);
                    await Promise.all(batch.map(async row => { const success = await processSingleRow(row, model, targetLocationId, activeCols); if (success) newDataFetched = true; }));
                    completedCount += batch.length; await new Promise(r => setTimeout(r, 10));
                }
            };

            if (totalCount > 0) await processBatch();
            if (newDataFetched) saveCacheToDisk();
            if (myRunId === currentRunId && consecutiveErrors <= 5 && !isPaused) updateStatus('idle', `已查: ${shortLocName}`);

        } catch (globalErr) { console.error(globalErr); if (myRunId === currentRunId) updateStatus('idle', '出错'); }
    }

    async function processSingleRow(row, model, targetLocationId, activeCols) {
        if (!row.isConnected) return false;
        const tds = row.querySelectorAll('.td-rpc-col');
        if (tds.length !== activeCols.length) return false;
        if (tds[0].innerText !== '...' && tds[0].innerText !== '-') return false;

        let shouldLog = false;
        if (debugLogCount < 3) { shouldLog = true; debugLogCount++; console.group(`🔎 [排查] Row #${debugLogCount}`); }

        try {
            let productName = '';
            const prodCell = row.querySelector('td[name="product_id"]');
            if (prodCell) {
                productName = prodCell.textContent.trim();
                if (!productName) productName = prodCell.getAttribute('title') || '';
                if (!productName && prodCell.dataset.tooltip) productName = prodCell.dataset.tooltip;
                if (!productName) { const input = prodCell.querySelector('input'); if (input) productName = input.value; }
            }

            // ★ 再次确认：使用全局搜索框名字
            if (!productName && globalSearchProduct) {
                productName = globalSearchProduct;
            }

            if (!productName) {
                tds.forEach(t => { t.innerText = 'No Name'; t.style.color = '#ff6b6b'; });
                if (shouldLog) { console.warn('❌ 无法读取产品名称'); console.groupEnd(); }
                return false;
            }

            const refText = row.querySelector('td[name="reference"]')?.textContent.trim() || '';
            const dateText = row.querySelector('td[name="date"]')?.textContent.trim() || '';
            const qtyCell = row.querySelector('td[name="quantity"]') || row.querySelector('td[name="qty_done"]');
            const qtyVal = qtyCell ? parseFloat(qtyCell.textContent.trim().replace(/,/g, '')) : 0;

            if (shouldLog) console.log('Raw Data:', { productName, dateText, refText, qtyVal });

            const cacheKey = `${targetLocationId || 'all'}_${productName}_${refText}_${dateText}_${qtyVal}`;
            if (MEMORY_CACHE[cacheKey]) {
                renderResult(tds, MEMORY_CACHE[cacheKey], activeCols);
                if (shouldLog) { console.log('Cache Hit'); console.groupEnd(); }
                return false;
            }

            let localDateObj = null;
            if (dateText.includes('年')) {
                const m = dateText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2})[时:](\d{1,2})/);
                if (m) localDateObj = new Date(m[1], m[2] - 1, m[3], m[4], m[5]);
            } else if (/\d{4}-\d{1,2}-\d{1,2}/.test(dateText)) {
                localDateObj = new Date(dateText.replace(/-/g, '/'));
            } else if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(dateText)) {
                localDateObj = new Date(dateText);
            } else { localDateObj = new Date(dateText); }

            if (localDateObj && !isNaN(localDateObj)) localDateObj.setSeconds(59);
            const utcDateStr = localDateObj && !isNaN(localDateObj) ? localDateObj.toISOString().replace('T', ' ').substring(0, 19) : null;

            if (shouldLog) console.log('Parsed Date:', utcDateStr);

            let productId = null;
            let exactDate = null;
            if (GLOBAL_ID_CACHE.products[productName]) {
                productId = GLOBAL_ID_CACHE.products[productName];
            } else {
                const p = await callOdooRPC('product.product', 'search_read', [[['display_name', '=', productName]]], { fields: ['id'], limit: 1 });
                if (p && p.length) { productId = p[0].id; GLOBAL_ID_CACHE.products[productName] = productId; }
            }

            if (shouldLog) console.log('Product ID:', productId);

            if (productId && !utcDateStr) {
                tds.forEach(t => { t.innerText = 'Date?'; t.style.color = 'orange'; });
                if (shouldLog) { console.warn('Date fail'); console.groupEnd(); }
                return false;
            }

            if (!productId) {
                tds.forEach(t => { t.innerText = '?'; });
                if (shouldLog) { console.warn('Product fail'); console.groupEnd(); }
                return false;
            }

            if (productId && utcDateStr) { exactDate = utcDateStr; }

            const context = { to_date: exactDate };
            if (targetLocationId) context.location = targetLocationId;

            if (shouldLog) console.log('RPC Request:', { context });

            const stockData = await callOdooRPC('product.product', 'read', [[productId], ['qty_available', 'free_qty', 'virtual_available', 'outgoing_qty']], { context: context });

            if (shouldLog) console.log('RPC Response:', stockData);

            if (stockData && stockData.length > 0) {
                const d = stockData[0];
                const calcActual = (d.qty_available || 0) - (d.outgoing_qty || 0);
                const resultData = { hand: d.qty_available || 0, act: calcActual, virt: d.virtual_available || 0 };
                renderResult(tds, resultData, activeCols);
                MEMORY_CACHE[cacheKey] = resultData;
                consecutiveErrors = 0;
                if (shouldLog) console.groupEnd();
                return true;
            } else {
                tds.forEach(t => { t.innerText = '-'; });
                if (shouldLog) { console.warn('Empty data'); console.groupEnd(); }
                return false;
            }

        } catch (e) {
            console.error(e); tds.forEach(t => { t.innerText = 'Err'; }); consecutiveErrors++;
            if (shouldLog) console.groupEnd();
            return false;
        }
    }

    function renderResult(tds, data, activeCols) {
        const renderVal = (td, val, cls) => {
            if (!td) return;
            td.innerHTML = val === 0 ? '<span class="rpc-val-zero" title="0">0</span>' : `<span class="${cls}" title="${val}">${Math.round(val)}</span>`;
        };
        activeCols.forEach((col, idx) => {
            if (tds[idx]) {
                if (col.key === 'hand') renderVal(tds[idx], data.hand, 'rpc-val-hand');
                if (col.key === 'act') renderVal(tds[idx], data.act, 'rpc-val-act');
                if (col.key === 'virt') renderVal(tds[idx], data.virt, 'rpc-val-virt');
            }
        });
    }

    async function searchLocationByName(name, forceInternal = true) {
        if (!name) return null;
        if (GLOBAL_ID_CACHE.locations[name]) return GLOBAL_ID_CACHE.locations[name];
        const domain = [['complete_name', 'ilike', name]];
        if (forceInternal) domain.push(['usage', '=', 'internal']);
        let res = await callOdooRPC('stock.location', 'search_read', [domain], { fields: ['id', 'complete_name'], limit: 1 });
        if ((!res || !res.length) && forceInternal) { res = await callOdooRPC('stock.location', 'search_read', [[['complete_name', 'ilike', name]]], { fields: ['id', 'complete_name'], limit: 1 }); }
        if (res && res.length > 0) { GLOBAL_ID_CACHE.locations[name] = res[0]; return res[0]; }
        return null;
    }

    function callOdooRPC(model, method, args, kwargs = {}) {
        return new Promise((resolve, reject) => {
            fetch(`/web/dataset/call_kw/${model}/${method}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { model, method, args, kwargs }, id: Math.random() })
            }).then(r => r.json()).then(d => { if (d.error) reject(d.error); else resolve(d.result); }).catch(error => { reject(new Error(error.message || 'Network Error')); });
        });
    }

    setInterval(manageButton, 1000);
})();
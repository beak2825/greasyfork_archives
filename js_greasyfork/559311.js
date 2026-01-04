// ==UserScript==
// @name         MQC 資料暫存與統計儀表板 V25
// @namespace    http://tampermonkey.net/
// @version      27.0
// @description  自動讀取 PVIM5242 下拉選單。優化資料庫刪除邏輯：靜音受阻警告，並確保 UI 立即反應。
// @author       Ken
// @match        https://appsvr12.panasonic.com.tw/VIMS/PVIM5241.asp*
// @match        https://appsvr12.panasonic.com.tw/VIMS/PVIM5243.asp*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license      All rights reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559311/MQC%20%E8%B3%87%E6%96%99%E6%9A%AB%E5%AD%98%E8%88%87%E7%B5%B1%E8%A8%88%E5%84%80%E8%A1%A8%E6%9D%BF%20V25.user.js
// @updateURL https://update.greasyfork.org/scripts/559311/MQC%20%E8%B3%87%E6%96%99%E6%9A%AB%E5%AD%98%E8%88%87%E7%B5%B1%E8%A8%88%E5%84%80%E8%A1%A8%E6%9D%BF%20V25.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 設定 ---
    const DB_BASE_NAME = 'mqc_record';
    const STORE_NAME = 'reasons';
    const DB_VERSION = 1;
    const MAPPING_KEY = 'mqc_product_map_cache';

    let activeConnections = {};

    // --- 注入 CSS ---
    function injectStyles(doc = document) {
        if (doc.getElementById('mqc-style-injected')) return;
        const style = doc.createElement('style');
        style.id = 'mqc-style-injected';
        style.innerHTML = `
            .mqc-switch { position: relative; display: inline-block; width: 34px; height: 18px; vertical-align: middle; }
            .mqc-switch input { opacity: 0; width: 0; height: 0; }
            .mqc-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 18px; }
            .mqc-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .mqc-slider { background-color: #2196F3; }
            input:checked + .mqc-slider:before { transform: translateX(16px); }

            .mqc-card-input { border: 1px solid #ddd; border-radius: 4px; padding: 4px; font-size: 13px; color: #333; width: 100%; box-sizing: border-box; font-family: Arial, sans-serif; }
            .mqc-card-input:disabled { background: #eee; color: #aaa; cursor: not-allowed; }

            .mqc-btn { border: none; border-radius: 4px; cursor: pointer; color: white; font-size: 13px; padding: 5px 0; transition: opacity 0.2s; }
            .mqc-btn:hover { opacity: 0.9; }
            .mqc-btn-blue { background: #007bff; }
            .mqc-btn-info { background: #17a2b8; }
            .mqc-btn-gray { background: #6c757d; font-size: 11px; padding: 3px 0; }
            .mqc-btn-green { background: #28a745; font-size: 11px; padding: 3px 0; }

            .mqc-history-badge {
                display: inline-flex; justify-content: center; align-items: center;
                background-color: #dc3545; color: white; border-radius: 50%;
                width: 20px; height: 20px; font-size: 11px; font-weight: bold;
                margin-left: 5px; cursor: pointer; vertical-align: middle;
                box-shadow: 1px 1px 3px rgba(0,0,0,0.2); transition: transform 0.2s;
            }
            .mqc-history-badge:hover { transform: scale(1.2); z-index: 10; }
            .mqc-pop-anim { animation: mqc-pop 0.3s ease-out; }
            @keyframes mqc-pop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }

            .mqc-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 99999;
                display: flex; justify-content: center; align-items: center;
            }
            .mqc-modal {
                background: white; width: 400px; max-width: 90%; max-height: 80vh;
                border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex; flex-direction: column; overflow: hidden;
                font-family: Arial, sans-serif;
            }
            .mqc-modal-header {
                padding: 10px 15px; background: #f8f9fa; border-bottom: 1px solid #ddd;
                display: flex; justify-content: space-between; align-items: center;
            }
            .mqc-modal-title { font-weight: bold; font-size: 14px; color: #333; }
            .mqc-modal-close { cursor: pointer; font-size: 18px; color: #666; }
            .mqc-modal-body { padding: 15px; overflow-y: auto; flex: 1; }
            .mqc-modal-footer { padding: 10px 15px; border-top: 1px solid #ddd; text-align: right; }

            .mqc-edit-row { display: flex; gap: 5px; margin-bottom: 8px; align-items: center; }
            .mqc-edit-input { flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; }
            .mqc-edit-time { font-size: 11px; color: #888; width: 110px; text-align: right; }
            .mqc-del-btn { background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 2px 6px; font-size: 12px; }

            .mqc-db-del-btn {
                cursor: pointer; color: #dc3545; font-size: 14px; font-weight: bold;
                padding: 2px 6px; border-radius: 4px; transition: background 0.2s;
                margin-left: 5px; line-height: 1;
            }
            .mqc-db-del-btn:hover { background: #ffebee; }
        `;
        doc.head.appendChild(style);
    }
    injectStyles();

    // --- 核心工具 ---
    function getDynamicDBName(doc) {
        try {
            const loc = doc.location || window.location;
            const urlParams = new URLSearchParams(loc.search);
            const ord1 = urlParams.get('ORD1');
            if (ord1 && ord1.trim() !== '') return `${DB_BASE_NAME}_${ord1.trim()}`;
        } catch (e) { }
        return null;
    }

    function getTodayString() {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    function getFirstDayOfMonthString() {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    }

    function normalizeHistory(record) {
        if (!record) return [];
        if (record.history && Array.isArray(record.history)) return JSON.parse(JSON.stringify(record.history));
        if (record.history && typeof record.history === 'string' && record.history.trim() !== '') {
            return [{
                text: record.history,
                time: record.timestamp ? new Date(record.timestamp).toISOString() : new Date().toISOString()
            }];
        }
        return [];
    }

    function formatHistoryForTooltip(historyArray) {
        if (!historyArray || historyArray.length === 0) return '';
        return historyArray.slice().reverse().map((h, index) => {
            const dateStr = new Date(h.time).toLocaleString('zh-TW', { hour12: false });
            return `${historyArray.length - index}. [${dateStr}] ${h.text}`;
        }).join('\n');
    }

    function formatHistoryForExcel(historyArray) {
         if (!historyArray || historyArray.length === 0) return '';
         return historyArray.map(h => `[${new Date(h.time).toLocaleString('zh-TW', { hour12: false })}] ${h.text}`).join('\n');
    }

    function syncProductMapping() {
        try {
            const siblingFrame = window.top.frames['PVIM5242'];
            if (!siblingFrame) return;
            const doc = siblingFrame.document;
            const select = doc.getElementById('ORD1');
            if (select && select.options.length > 0) {
                const mapping = JSON.parse(localStorage.getItem(MAPPING_KEY) || '{}');
                for (let i = 0; i < select.options.length; i++) {
                    const opt = select.options[i];
                    if (opt.value.trim()) mapping[opt.value.trim()] = opt.text.trim();
                }
                localStorage.setItem(MAPPING_KEY, JSON.stringify(mapping));
            }
        } catch (e) { }
    }

    function getProductName(code) {
        const map = JSON.parse(localStorage.getItem(MAPPING_KEY) || '{}');
        return map[code] || code;
    }

    // --- IndexedDB 工具 ---
    const dbUtils = {
        open: (dbName) => new Promise((resolve, reject) => {
            if (activeConnections[dbName]) {
                resolve(activeConnections[dbName]);
                return;
            }
            const request = indexedDB.open(dbName, DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            };
            request.onsuccess = (e) => {
                activeConnections[dbName] = e.target.result;
                resolve(e.target.result);
            };
            request.onerror = (e) => reject(e);
        }),
        putBatch: async (dbName, dataArray) => {
            if (dataArray.length === 0) return;
            const db = await dbUtils.open(dbName);
            return new Promise((resolve, reject) => {
                const tx = db.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject('Transaction error');
                dataArray.forEach(item => store.put(item));
            });
        },
        get: async (dbName, key) => {
            const db = await dbUtils.open(dbName);
            return new Promise((resolve, reject) => {
                const tx = db.transaction([STORE_NAME], 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject('Get error');
            });
        },
        getAllAsMap: async (dbName) => {
            const db = await dbUtils.open(dbName);
            return new Promise((resolve, reject) => {
                const tx = db.transaction([STORE_NAME], 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.getAll();
                req.onsuccess = () => {
                    const map = new Map();
                    if (req.result) req.result.forEach(item => map.set(item.id, item));
                    resolve(map);
                };
                req.onerror = () => reject('GetAll error');
            });
        },
        getAll: async (dbName) => {
            const db = await dbUtils.open(dbName);
            return new Promise((resolve, reject) => {
                const tx = db.transaction([STORE_NAME], 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject('GetAll error');
            });
        },
        getStats: async (dbName, startDate, endDate) => {
            const db = await dbUtils.open(dbName);
            return new Promise((resolve, reject) => {
                const tx = db.transaction([STORE_NAME], 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const request = store.openCursor();
                let total = 0; let filled = 0;
                const start = new Date(startDate).setHours(0, 0, 0, 0);
                const end = new Date(endDate).setHours(23, 59, 59, 999);
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const record = cursor.value;
                        if (record.timestamp) {
                            const rTime = new Date(record.timestamp).getTime();
                            if (rTime >= start && rTime <= end) {
                                total++;
                                if (normalizeHistory(record).length > 0) filled++;
                            }
                        }
                        cursor.continue();
                    } else { resolve({ total, filled }); }
                };
                request.onerror = () => reject('Cursor error');
            });
        },
        deleteDatabase: (dbName) => new Promise((resolve) => {
            // 【優化】主動關閉目前的連線
            if (activeConnections[dbName]) {
                activeConnections[dbName].close();
                delete activeConnections[dbName];
            }
            const req = indexedDB.deleteDatabase(dbName);
            // 不再使用 alert 警告 onblocked，因為瀏覽器排程會在頁面釋放後自動執行
            req.onblocked = () => { console.log(`[MQC] Delete ${dbName} is pending (blocked by other tab).`); };
            req.onsuccess = () => { console.log(`[MQC] DB ${dbName} deleted.`); };
            // 直接 resolve，讓 UI 先消失
            resolve();
        })
    };

    // --- 彈窗編輯 ---
    async function openEditModal(doc, key, dbName, elWhy) {
        let record;
        try { record = await dbUtils.get(dbName, key); } catch(e) { return; }
        let tempHistory = normalizeHistory(record);
        const existing = doc.getElementById('mqc-edit-modal-overlay');
        if (existing) existing.remove();

        const overlay = doc.createElement('div');
        overlay.id = 'mqc-edit-modal-overlay';
        overlay.className = 'mqc-modal-overlay';

        const renderRows = () => {
            const body = overlay.querySelector('.mqc-modal-body');
            body.innerHTML = '';
            tempHistory.slice().reverse().forEach((item, rIndex) => {
                const realIndex = tempHistory.length - 1 - rIndex;
                const row = doc.createElement('div');
                row.className = 'mqc-edit-row';
                const input = doc.createElement('input');
                input.type = 'text'; input.className = 'mqc-edit-input'; input.value = item.text;
                input.oninput = (e) => { tempHistory[realIndex].text = e.target.value; };
                const timeSpan = doc.createElement('span');
                timeSpan.className = 'mqc-edit-time';
                timeSpan.innerText = new Date(item.time).toLocaleString('zh-TW', { hour12: false, month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' });
                const delBtn = doc.createElement('button');
                delBtn.className = 'mqc-del-btn'; delBtn.innerText = 'X';
                delBtn.onclick = () => { tempHistory.splice(realIndex, 1); renderRows(); };
                row.appendChild(timeSpan); row.appendChild(input); row.appendChild(delBtn);
                body.appendChild(row);
            });
            if(tempHistory.length === 0) body.innerHTML = '<div style="text-align:center; color:#999; margin-top:20px;">無紀錄</div>';
        };

        overlay.innerHTML = `
            <div class="mqc-modal">
                <div class="mqc-modal-header">
                    <span class="mqc-modal-title">編輯紀錄 - 管號: ${key}</span>
                    <span class="mqc-modal-close">&times;</span>
                </div>
                <div class="mqc-modal-body"></div>
                <div class="mqc-modal-footer">
                    <button class="mqc-btn mqc-btn-green" id="mqc-modal-save" style="padding: 5px 15px;">保存修改</button>
                </div>
            </div>
        `;
        doc.body.appendChild(overlay);
        renderRows();

        overlay.querySelector('.mqc-modal-close').onclick = () => overlay.remove();
        overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };
        overlay.querySelector('#mqc-modal-save').onclick = async () => {
            try {
                const finalHistory = tempHistory.filter(h => h.text && h.text.trim() !== '');
                const currentRec = await dbUtils.get(dbName, key);
                let newReason = (finalHistory.length === 0) ? '' : (currentRec ? currentRec.reason : '');
                const newData = { id: key, reason: newReason, history: finalHistory, timestamp: currentRec ? currentRec.timestamp : new Date() };
                await dbUtils.putBatch(dbName, [newData]);
                updateBadge(doc, elWhy, finalHistory, key, dbName);
                if (finalHistory.length === 0) { elWhy.value = ''; elWhy.style.backgroundColor = ''; }
                overlay.remove();
            } catch (err) { alert('存檔失敗'); }
        };
    }

    // --- UI 元件 ---
    function updateBadge(doc, elWhy, historyArr, key, dbName) {
        const parent = elWhy.parentNode;
        let badge = parent.getElementsByClassName('mqc-history-badge')[0];
        if (historyArr && historyArr.length > 0) {
            if (!badge) {
                injectStyles(doc);
                badge = doc.createElement('span');
                badge.className = 'mqc-history-badge';
                if (elWhy.nextSibling) parent.insertBefore(badge, elWhy.nextSibling); else parent.appendChild(badge);
            }
            badge.onclick = (e) => { e.stopPropagation(); openEditModal(doc, key, dbName, elWhy); };
            badge.textContent = historyArr.length; badge.title = formatHistoryForTooltip(historyArr); badge.style.display = 'inline-flex';
            badge.classList.remove('mqc-pop-anim'); void badge.offsetWidth; badge.classList.add('mqc-pop-anim');
        } else if (badge) { badge.style.display = 'none'; }
    }

    function createCard(dbName) {
        const suffix = dbName.replace('mqc_record_', '');
        const cardId = `mqc-card-${suffix}`;
        const displayName = getProductName(suffix);
        const existingCard = document.getElementById(cardId);
        if (existingCard) return null;

        const card = document.createElement('div');
        card.id = cardId;
        card.style.cssText = `background: #fff; border: 1px solid #ccc; border-radius: 6px; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #333; transition: transform 0.2s; position: relative;`;
        card.onmouseover = () => card.style.transform = "translateY(-3px)";
        card.onmouseout = () => card.style.transform = "translateY(0)";

        card.innerHTML = `
            <div style="font-weight:bold; color:#0056b3; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:0px; display:flex; justify-content:space-between; align-items:center;">
                <span class="mqc-card-title" style="font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px;" title="${displayName}">📂 ${displayName}</span>
                <div style="display:flex; align-items:center; gap:5px;">
                    <label class="mqc-switch"><input type="checkbox" class="mqc-toggle-today"><span class="mqc-slider"></span></label>
                    <span class="mqc-db-del-btn" title="刪除此資料庫">✕</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
                <div style="display:flex; align-items:center; gap:5px;"><span style="width:20px; text-align:right; font-weight:bold; color:#555;">起</span><input type="date" class="mqc-start mqc-card-input"></div>
                <div style="display:flex; align-items:center; gap:5px;"><span style="width:20px; text-align:right; font-weight:bold; color:#555;">迄</span><input type="date" class="mqc-end mqc-card-input"></div>
            </div>
            <div style="background:#f8f9fa; padding:8px; border-radius:4px; margin-top:2px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>總數:</span><strong class="mqc-total" style="font-size:14px;">0</strong></div>
                <div style="display:flex; justify-content:space-between; color:#28a745; margin-bottom:4px;"><span>撤回:</span><strong class="mqc-filled" style="font-size:14px;">0</strong></div>
                <div style="background:#e9ecef; height:8px; border-radius:4px; overflow:hidden;"><div class="mqc-bar" style="width:0%; height:100%; background:#28a745; transition:width 0.5s;"></div></div>
                <div class="mqc-percent" style="text-align:right; font-size:12px; margin-top:4px; color:#666; font-weight:bold;">0%</div>
            </div>
            <div style="display:flex; gap:5px;"><button class="mqc-refresh-btn mqc-btn mqc-btn-blue" style="flex:1;">更新</button><button class="mqc-export-xlsx mqc-btn mqc-btn-info" style="flex:2;">Excel</button></div>
            <div style="display:flex; gap:5px; margin-top:2px;"><button class="mqc-json-export mqc-btn mqc-btn-gray" style="flex:1;">備份</button><button class="mqc-json-import mqc-btn mqc-btn-green" style="flex:1;">還原</button></div>
        `;

        card.querySelector('.mqc-db-del-btn').onclick = async () => {
            if (confirm(`確定要刪除資料庫 [${displayName}] 嗎？\n這將移除所有歷史紀錄！`)) {
                // UI 立即反應
                card.style.opacity = '0.3';
                card.style.pointerEvents = 'none';
                await dbUtils.deleteDatabase(dbName);
                card.remove();
            }
        };

        const startIn = card.querySelector('.mqc-start'); const endIn = card.querySelector('.mqc-end');
        const togTod = card.querySelector('.mqc-toggle-today'); const totEl = card.querySelector('.mqc-total');
        const filEl = card.querySelector('.mqc-filled'); const barEl = card.querySelector('.mqc-bar'); const perEl = card.querySelector('.mqc-percent');
        startIn.value = getFirstDayOfMonthString(); endIn.value = getTodayString();

        const refresh = async () => {
            startIn.disabled = togTod.checked; endIn.disabled = togTod.checked;
            const r = togTod.checked ? { start: getTodayString(), end: getTodayString() } : { start: startIn.value, end: endIn.value };
            try {
                const s = await dbUtils.getStats(dbName, r.start, r.end);
                totEl.innerText = s.total; filEl.innerText = s.filled;
                let p = s.total > 0 ? Math.round((s.filled / s.total) * 100) : 0;
                barEl.style.width = p + '%'; perEl.innerText = p + '%';
            } catch(e) {}
        };
        togTod.onchange = refresh; card.querySelector('.mqc-refresh-btn').onclick = refresh;
        card.querySelector('.mqc-export-xlsx').onclick = async () => {
            const r = togTod.checked ? { start: getTodayString(), end: getTodayString() } : { start: startIn.value, end: endIn.value };
            const allData = await dbUtils.getAll(dbName);
            const sTime = new Date(r.start).setHours(0,0,0,0); const eTime = new Date(r.end).setHours(23,59,59,999);
            const filtered = allData.filter(i => i.timestamp && new Date(i.timestamp).getTime() >= sTime && new Date(i.timestamp).getTime() <= eTime);
            if (filtered.length === 0) { alert('無資料'); return; }
            const ws = XLSX.utils.json_to_sheet(filtered.map(i => ({ '管號': i.id, '最後原因': i.reason || '', '歷史紀錄': formatHistoryForExcel(normalizeHistory(i)), '最後確認時間': i.timestamp ? new Date(i.timestamp).toLocaleString() : '' })));
            ws['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 50 }, { wch: 20 }];
            const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "MQC_Data");
            XLSX.writeFile(wb, `MQC_${suffix}_${r.start}.xlsx`);
        };
        card.querySelector('.mqc-json-export').onclick = async () => {
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(await dbUtils.getAll(dbName), null, 2)], { type: "application/json" }));
            a.download = `MQC_${suffix}_Backup.json`; a.click();
        };
        card.querySelector('.mqc-json-import').onclick = () => {
            const i = document.createElement('input'); i.type = 'file'; i.accept = '.json';
            i.onchange = e => {
                const r = new FileReader();
                r.onload = async ev => { try { if (confirm(`還原?`)) { await dbUtils.putBatch(dbName, JSON.parse(ev.target.result)); refresh(); } } catch (x) { alert('失敗'); } };
                r.readAsText(e.target.files[0]);
            }; i.click();
        };
        setTimeout(refresh, 500); return card;
    }

    // --- 初始化 ---
    async function renderGlobalGrid() {
        let container = document.getElementById('mqc-grid-container');
        if (!container) {
            container = document.createElement('div'); container.id = 'mqc-grid-container';
            container.style.cssText = `position: absolute; top: 60px; left: 0; right: 0; padding: 15px; display: grid; grid-template-columns: repeat(auto-fit, 200px); justify-content: center; gap: 15px; pointer-events: none; z-index: 9999;`;
            document.body.appendChild(container);
        }
        try {
            if (indexedDB.databases) {
                const dbs = (await indexedDB.databases()).filter(db => db.name.startsWith(DB_BASE_NAME)).map(db => db.name);
                dbs.forEach(dbName => { const card = createCard(dbName); if (card) { card.style.pointerEvents = "auto"; container.appendChild(card); } });
            }
        } catch (e) { }
    }

    function initSpecificDashboard(currentDBName) {
        if (document.getElementById('mqc-dashboard')) return;
        const div = document.createElement('div');
        div.id = 'mqc-dashboard'; div.innerText = '📊';
        div.style.cssText = `position: fixed; top: 10px; right: 20px; width: 40px; height: 40px; background: #007bff; color: white; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.3); z-index: 10000; cursor: pointer; display: flex; justify-content: center; align-items: center; font-size: 20px;`;
        div.onclick = () => {
             const existing = document.getElementById('mqc-single-panel');
             if(existing) { existing.remove(); return; }
             const card = createCard(currentDBName);
             if (card) { card.id = 'mqc-single-panel'; card.style.position = 'fixed'; card.style.top = '60px'; card.style.right = '20px'; card.style.zIndex = '10001'; card.style.width = '200px'; document.body.appendChild(card); }
        };
        document.body.appendChild(div);
    }

    async function initPageLogic(currentDBName) {
        const countInput = document.getElementById('reCnt');
        if (!countInput) return;
        const count = parseInt(countInput.value, 10);
        for (let i = 1; i <= count; i++) {
            const elCtl = document.getElementById('SSHCTLNO' + i); const elWhy = document.getElementById('SSHWHY' + i);
            if (elCtl && elWhy && !elWhy.dataset.mqcLoaded) {
                const key = elCtl.value.trim();
                try {
                    const record = await dbUtils.get(currentDBName, key);
                    if (record) {
                        if (record.reason && elWhy.value === '') { elWhy.value = record.reason; elWhy.style.backgroundColor = "#e6ffe6"; }
                        updateBadge(elWhy.ownerDocument, elWhy, normalizeHistory(record), key, currentDBName);
                    }
                } catch (e) { }
                elWhy.dataset.mqcLoaded = "true";
            }
            const ec = document.getElementById('check' + i);
            if (ec && elWhy && !ec.dataset.mqcListened) {
                ec.dataset.mqcListened = "true";
                ec.addEventListener('change', function () { if (this.checked) { elWhy.value = ''; elWhy.style.backgroundColor = ''; } });
            }
        }
    }

    let hasInitGrid = false;
    setInterval(() => {
        syncProductMapping();
        const currentDBName = getDynamicDBName(document);
        if (currentDBName) {
            const grid = document.getElementById('mqc-grid-container'); if (grid) grid.style.display = 'none';
            initSpecificDashboard(currentDBName); initPageLogic(currentDBName);
        } else if (window.location.href.indexOf('PVIM5243.asp') > -1) {
            if (!hasInitGrid) { renderGlobalGrid(); hasInitGrid = true; }
            const grid = document.getElementById('mqc-grid-container'); if (grid) grid.style.display = 'grid';
        }
    }, 1000);

    const btnSend = document.getElementById('button2');
    if (btnSend && !btnSend.dataset.mqcAttached) {
        btnSend.dataset.mqcAttached = "true";
        btnSend.addEventListener('click', async function () {
            const findDF = (w) => { try { if (w.document.getElementById('reCnt')) return w; } catch(e){} for (let i=0; i<w.frames.length; i++) { let f = findDF(w.frames[i]); if(f) return f; } return null; };
            const targetWin = findDF(window.top); if (!targetWin) return;
            const doc = targetWin.document; const targetDBName = getDynamicDBName(doc); if (!targetDBName) return;
            const count = parseInt(doc.getElementById('reCnt').value, 10);
            const backupData = []; const dbMap = await dbUtils.getAllAsMap(targetDBName); const now = new Date();

            for (let i = 1; i <= count; i++) {
                const elCtl = doc.getElementById('SSHCTLNO' + i); const elWhy = doc.getElementById('SSHWHY' + i);
                if (elCtl && elWhy) {
                    const key = elCtl.value.trim(); const val = elWhy.value;
                    if (key) {
                        const oldR = dbMap.get(key); let historyArr = normalizeHistory(oldR);
                        let reasonToSave = ""; let saveNeeded = false;
                        if (val && val.trim() !== '') { historyArr.push({ text: val, time: now.toISOString() }); reasonToSave = val; saveNeeded = true; }
                        else if (oldR) { if (oldR.reason && oldR.reason !== '') { reasonToSave = ""; saveNeeded = true; } }
                        else { reasonToSave = ""; historyArr = []; saveNeeded = true; }

                        if (saveNeeded) {
                            backupData.push({ id: key, reason: reasonToSave, history: historyArr, timestamp: now });
                            updateBadge(doc, elWhy, historyArr, key, targetDBName);
                            elWhy.value = reasonToSave; elWhy.style.backgroundColor = (reasonToSave !== '') ? '#e6ffe6' : '';
                        }
                    }
                }
            }
            if (backupData.length > 0) dbUtils.putBatch(targetDBName, backupData);
        }, true);
    }
})();
// ==UserScript==
// @name         E-SAKIP Kaltim - Panel Editor
// @namespace    http://tampermonkey.net/
// @version      28.0
// @description  Logo Pemprov, Strict Empty Table Check, Fixed Animation, Modern UI
// @author       You
// @match        https://e-sakip.kaltimprov.go.id/realisasi-kinerja*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561888/E-SAKIP%20Kaltim%20-%20Panel%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/561888/E-SAKIP%20Kaltim%20-%20Panel%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes('/edit')) return;

    // --- 0. STATE MANAGEMENT ---
    const STORAGE_KEY = 'sakip_config_v28';
    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { top: null, left: '20px', minimized: false, fullscreen: false, tw: '4' };
    }
    function saveState(newState) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadState(), ...newState }));
    }
    const startState = loadState();

    // --- 1. CSS STYLING ---
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        #sakip-panel { font-family: "Inter", sans-serif; font-size: 13px; color: #334155; }
        #sakip-panel * { box-sizing: border-box; }

        /* CARD CONTAINER & ANIMATION */
        .sakip-card {
            position: fixed;
            width: 700px;
            /* Default Max Height (State Expanded) */
            max-height: 90vh;

            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            z-index: 99999;
            display: flex; flex-direction: column;
            overflow: hidden;

            /* Kunci Animasi Mulus */
            transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .sakip-card:not(.fullscreen) { bottom: 20px; left: 20px; }

        /* FULLSCREEN STATE */
        .sakip-card.fullscreen {
            top: 0 !important; left: 0 !important;
            width: 100vw !important; max-width: 100vw !important;
            height: 100vh !important; max-height: 100vh !important;
            border-radius: 0; transform: none !important;
        }

        /* MINIMIZED STATE */
        .sakip-card.minimized {
            max-height: 60px !important; /* Force shrink height */
            min-height: 60px !important;
        }

        /* HEADER */
        .sakip-header {
            padding: 0 15px;
            background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
            color: white; border-bottom: 1px solid rgba(0,0,0,0.1);
            display: flex; justify-content: space-between; align-items: center;
            height: 60px; min-height: 60px; /* Fix height agar header tidak penyet */
            flex-shrink: 0; cursor: grab; user-select: none;
        }
        .sakip-header:active { cursor: grabbing; }
        .sakip-card.fullscreen .sakip-header { cursor: default; }

        .header-title { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; }
        .kaltim-logo { height: 32px; width: auto; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2)); }

        .header-controls { display: flex; gap: 8px; }
        .header-btn {
            background: rgba(255,255,255,0.15); border: none; color: white;
            width: 32px; height: 32px; border-radius: 6px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; font-size: 14px;
            transition: background 0.2s;
        }
        .header-btn:hover { background: rgba(255,255,255,0.3); }

        /* BODY */
        .sakip-body { flex: 1; padding: 15px; overflow-y: auto; background-color: #f8fafc; }

        /* INPUTS & SELECT2 STYLE */
        .filter-section { background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .form-group { margin-bottom: 12px; }
        .form-label { display: block; font-weight: 600; font-size: 11px; margin-bottom: 6px; color: #64748b; text-transform: uppercase; }
        .form-control { width: 100%; padding: 8px 12px; font-size: 13px; color: #334155; background-color: #fff; border: 1px solid #cbd5e1; border-radius: 6px; transition: all 0.2s; font-family: inherit; }
        .form-control:focus { border-color: #0f766e; outline: 0; box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.2); }
        textarea.form-control { resize: vertical; min-height: 80px; }
        select.form-control { appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 10px center; background-size: 14px; padding-right: 30px; }
        .search-input { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: 10px center; background-size: 16px; padding-left: 34px; }

        /* ITEM ROW */
        .item-row { background: white; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px; overflow: hidden; transition: all 0.2s; }
        .item-row.hidden { display: none; }
        .item-summary { padding: 12px 15px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: #fff; border-left: 6px solid transparent; }
        .item-summary:hover { background-color: #f1f5f9; }
        .item-summary.status-ok { border-left-color: #10b981; }
        .item-summary.status-bad { border-left-color: #ef4444; }
        .summary-text { flex: 1; display: flex; align-items: flex-start; line-height: 1.5; color: #334155; font-weight: 500; }
        .item-details { max-height: 0; opacity: 0; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); background-color: #fff; padding: 0 20px; border-top: 1px solid transparent; }
        .item-row.open .item-details { max-height: 2000px; opacity: 1; padding: 20px; border-top: 1px solid #f1f5f9; }

        /* DASHBOARD */
        .mini-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 12px; margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; }
        .mini-table th { background: #f8fafc; padding: 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 600; color: #475569; }
        .mini-table td { padding: 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: #334155; text-align: center; }
        .mini-table .highlight { font-weight: 700; background: #f0fdf4; color: #166534; }

        .renaksi-row { display: flex; gap: 8px; margin-bottom: 10px; align-items: start; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 12px; align-items:center; color: #475569; }
        .badge { padding: 3px 8px; font-size: 10px; font-weight: 700; color: #fff; border-radius: 4px; text-transform: uppercase; }
        .bg-success { background-color: #10b981; } .bg-danger { background-color: #ef4444; }
        .btn { padding: 8px 14px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; display: inline-block; text-decoration: none; transition: all 0.2s; }
        .btn-primary { background-color: #0f766e; color: white; width: 100%; } .btn-primary:hover { background-color: #115e59; }
        .btn-success { background-color: #10b981; color: white; }
        .btn-danger { background-color: #ef4444; color: white; }
        .btn-warning { background-color: #f59e0b; color: white; width: 100%; }
        .btn-secondary { background-color: #64748b; color: white; width: 100%; margin-top: 8px; }
        .btn-sm { padding: 4px 8px; font-size: 11px; }
        .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #0f766e; animation: spin 1s infinite; vertical-align: middle; margin-right: 8px;}
        @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    // --- 2. PANEL UI ---
    const panel = document.createElement('div');
    panel.id = 'sakip-panel';
    panel.className = 'sakip-card';

    // Apply Saved State
    if (startState.top) { panel.style.top = startState.top; panel.style.left = startState.left; }
    else { panel.style.bottom = '20px'; panel.style.left = '20px'; }
    if (startState.fullscreen) panel.classList.add('fullscreen');
    if (startState.minimized) panel.classList.add('minimized');

    panel.innerHTML = `
        <div class="sakip-header" id="panelHeader" title="Klik Tahan untuk Geser | Klik 2x untuk Fullscreen">
            <div class="header-title">
                <img src="https://kaltimprov.go.id/images/logofavicon.png" class="kaltim-logo" alt="Kaltim">
                E-SAKIP Dashboard
            </div>
            <div class="header-controls">
                <button id="btnReload" class="header-btn" title="Refresh Tabel Data">🔄</button>
                <button id="btnMaximize" class="header-btn" title="Layar Penuh">◻</button>
                <button id="togglePanel" class="header-btn" title="Minimize">➖</button>
            </div>
        </div>
        <div class="sakip-body" id="sakip-body">
            <div class="filter-section">
                <div class="form-group">
                    <label class="form-label">Periode Triwulan (Auto Reload):</label>
                    <select id="twSelect" class="form-control"></select>
                </div>
                <div class="form-group">
                    <label class="form-label">Cari Uraian:</label>
                    <input type="text" id="searchUraian" class="form-control search-input" placeholder="Ketik kata kunci...">
                </div>
            </div>
            <div id="resultList"></div>
        </div>
    `;
    document.body.appendChild(panel);

    // --- 3. CONTROLS ---
    const toggleBtn = document.getElementById('togglePanel');
    const maxBtn = document.getElementById('btnMaximize');
    const reloadBtn = document.getElementById('btnReload');
    const searchInput = document.getElementById('searchUraian');
    const panelHeader = document.getElementById('panelHeader');
    const panelCard = document.getElementById('sakip-panel');

    // Toggle Minimize
    toggleBtn.onclick = () => {
        const isMin = panelCard.classList.toggle('minimized');
        toggleBtn.innerText = isMin ? '➕' : '➖';
        saveState({ minimized: isMin });
        // Jika expand, hapus height inline agar CSS max-height 90vh bekerja kembali
        if(!isMin) panelCard.style.height = '';
    };

    // Toggle Fullscreen
    const toggleFullscreen = () => {
        const isFull = panelCard.classList.toggle('fullscreen');
        maxBtn.innerText = isFull ? '❐' : '◻';

        if (isFull) {
            panelCard.style.top = ''; panelCard.style.left = ''; panelCard.style.bottom = '';
            panelCard.style.width = ''; panelCard.style.height = '';
        } else {
            const saved = loadState();
            if (saved.top) { panelCard.style.top = saved.top; panelCard.style.left = saved.left; }
            else { panelCard.style.bottom = '20px'; panelCard.style.left = '20px'; }
        }
        saveState({ fullscreen: isFull });
    };

    maxBtn.onclick = toggleFullscreen;
    reloadBtn.onclick = () => window.location.reload();

    // Header Double Click
    panelHeader.ondblclick = (e) => {
        if (e.target.closest('.header-btn')) return;
        toggleFullscreen();
    };

    // Draggable Logic
    let isDragging = false, startX, startY, initialLeft, initialTop;
    panelHeader.onmousedown = (e) => {
        if (e.target.closest('.header-btn') || panelCard.classList.contains('fullscreen')) return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = panelCard.getBoundingClientRect();
        initialLeft = rect.left; initialTop = rect.top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    function onMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panelCard.style.left = `${initialLeft + dx}px`;
        panelCard.style.top = `${initialTop + dy}px`;
        panelCard.style.bottom = 'auto';
    }

    function onMouseUp() {
        if (isDragging) {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            saveState({ top: panelCard.style.top, left: panelCard.style.left });
        }
    }

    // --- 4. DATA LOGIC ---
    const urlParams = new URLSearchParams(window.location.search);
    const currentTw = urlParams.get('tw') || startState.tw || '4';
    const select = document.getElementById('twSelect');

    [1, 2, 3, 4].forEach(i => {
        const opt = document.createElement('option');
        opt.value = i; opt.text = `Triwulan ${i}`;
        if(i == currentTw) opt.selected = true;
        select.appendChild(opt);
    });

    select.onchange = function() {
        saveState({ tw: this.value });
        urlParams.set('tw', this.value);
        window.location.search = urlParams.toString();
    };

    searchInput.oninput = (e) => {
        const term = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.item-row');
        items.forEach(item => {
            const text = item.querySelector('.summary-text').innerText.toLowerCase();
            if (text.includes(term)) item.classList.remove('hidden'); else item.classList.add('hidden');
        });
    };

    function getFreshUrl(url) { return `${url}${url.includes('?')?'&':'?'}t=${new Date().getTime()}`; }

    // --- 5. ANALYZER (FIX EMPTY TABLE DETECTION) ---
    function analyzeData() {
        const resultList = document.getElementById('resultList');
        resultList.innerHTML = '';

        const mainTableBody = document.querySelector('table.datatable-basic > tbody');
        if(!mainTableBody) {
            resultList.innerHTML = '<div style="padding:20px; color:#ef4444; font-weight:bold; text-align:center;">Tabel data tidak ditemukan!</div>';
            return;
        }

        Array.from(mainTableBody.children).forEach((row) => {
            const cells = row.querySelectorAll('td');
            if(cells.length < 10) return;
            const noText = cells[0].innerText.trim();
            if(!/^\d+\.$/.test(noText)) return;

            const fullUraian = cells[2].innerText.trim();
            const dataStats = {
                t1: cells[5]?.innerText || '-', t2: cells[6]?.innerText || '-', t3: cells[7]?.innerText || '-', t4: cells[8]?.innerText || '-',
                t_thn: cells[9]?.innerText || '-',
                r1: cells[10]?.innerText || '-', r2: cells[11]?.innerText || '-', r3: cells[12]?.innerText || '-', r4: cells[13]?.innerText || '-',
                r_thn: cells[15]?.innerText || '-', cap_tw: cells[16]?.innerText || '-', cap_thn: cells[17]?.innerText || '-'
            };

            const totalCols = cells.length;
            const cellAksi = cells[totalCols - 1];
            const cellBukti = cells[totalCols - 3];
            const cellUpaya = cells[totalCols - 4];
            const cellPenghambat = cells[totalCols - 5];
            const cellPendorong = cells[totalCols - 6];
            const cellRenaksi = cells[totalCols - 7];

            const linkTag = cellAksi.querySelector('a');
            const editLink = linkTag ? linkTag.href : null;

            // --- STRICT CHECK RENAKSI (THE FIX) ---
            // Cari tabel di dalam cell Rencana Aksi
            const renaksiTable = cellRenaksi.querySelector('table');

            // Hitung jumlah baris (tr) di dalam tabel tersebut
            // Jika tabel kosong (<table></table>), querySelectorAll('tr').length akan 0
            const renaksiRows = renaksiTable ? renaksiTable.querySelectorAll('tr').length : 0;

            // Cek apakah ada tombol SELESAI (Backup)
            const hasSelesaiBtn = cellRenaksi.querySelector('.btn-success') !== null;

            // Logic: OK hanya jika ada baris data (>0) ATAU ada tombol selesai
            const renaksiOk = renaksiRows > 0 || hasSelesaiBtn;

            const pendorongOk = cellPendorong.textContent.trim().length > 1;
            const penghambatOk = cellPenghambat.textContent.trim().length > 1;
            const upayaOk = cellUpaya.textContent.trim().length > 1;
            const buktiOk = cellBukti.querySelector('a') !== null;

            const isComplete = renaksiOk && pendorongOk && penghambatOk && upayaOk && buktiOk;

            // --- UI BUILDER ---
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-row';
            const badgeHtml = isComplete ? '<span class="badge bg-success">LENGKAP</span>' : '<span class="badge bg-danger">KURANG</span>';
            const statusClass = isComplete ? 'status-ok' : 'status-bad';

            itemDiv.innerHTML = `
                <div class="item-summary ${statusClass}">
                    <div class="summary-text">
                        <span style="font-weight:700; margin-right:12px; min-width:25px; color:#3b82f6;">${noText}</span>
                        <span>${fullUraian}</span>
                    </div>
                    <div style="margin-left:15px;">${badgeHtml}</div>
                </div>
                <div class="item-details">
                    <div style="margin-bottom:20px;">
                        <table class="mini-table">
                            <thead><tr><th>DATA</th><th>TW 1</th><th>TW 2</th><th>TW 3</th><th>TW 4</th><th>1 TAHUN</th><th>CAPAIAN (%)</th></tr></thead>
                            <tbody>
                                <tr>
                                    <td style="font-weight:bold; color:#3b82f6;">TARGET</td>
                                    <td>${dataStats.t1}</td><td>${dataStats.t2}</td><td>${dataStats.t3}</td><td>${dataStats.t4}</td>
                                    <td style="background:#e0f2fe; font-weight:bold;">${dataStats.t_thn}</td>
                                    <td class="highlight">${dataStats.cap_tw}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:bold; color:#10b981;">REALISASI</td>
                                    <td>${dataStats.r1}</td><td>${dataStats.r2}</td><td>${dataStats.r3}</td><td>${dataStats.r4}</td>
                                    <td style="background:#fffbeb; font-weight:bold;">${dataStats.r_thn}</td>
                                    <td class="highlight">${dataStats.cap_thn} <br><span style="font-size:9px; font-weight:normal; color:#64748b;">(TAHUNAN)</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    ${createCheckRow('Rencana Aksi', renaksiOk)}
                    ${createCheckRow('Faktor Pendorong', pendorongOk)}
                    ${createCheckRow('Faktor Penghambat', penghambatOk)}
                    ${createCheckRow('Upaya', upayaOk)}
                    ${createCheckRow('Bukti Dukung', buktiOk)}

                    <button class="btn btn-warning btn-edit-trigger">📝 EDIT / ISI DATA</button>
                    <a href="${editLink}" target="_blank" class="btn btn-secondary">🔗 Buka Halaman Edit (Tab Baru)</a>
                    <div class="editor-container"></div>
                </div>
            `;

            const header = itemDiv.querySelector('.item-summary');
            const editBtn = itemDiv.querySelector('.btn-edit-trigger');
            const editorContainer = itemDiv.querySelector('.editor-container');

            header.onclick = () => { itemDiv.classList.toggle('open'); };
            editBtn.onclick = () => {
                editBtn.style.display = 'none';
                editorContainer.style.display = 'block';
                if (editLink) {
                    editorContainer.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b;"><div class="spinner"></div> Mengambil data form...</div>';
                    fetchFormData(getFreshUrl(editLink), editLink, editorContainer, itemDiv);
                }
            };
            resultList.appendChild(itemDiv);
        });
    }

    function createCheckRow(label, status) {
        const color = status ? '#10b981' : '#ef4444';
        const icon = status ? '✅ OK' : '❌ KOSONG';
        return `<div class="detail-row"><span style="font-weight:600;">${label}</span><span style="color:${color}; font-weight:700;">${icon}</span></div>`;
    }

    // --- 6. FETCH FORM ---
    function fetchFormData(url, originalUrl, container, itemDiv) {
        fetch(url, { credentials: 'include' })
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const originalForm = doc.querySelector('form');
                if(!originalForm) { container.innerHTML = '<div style="color:red; padding:10px;">Gagal mengambil form.</div>'; return; }
                let metaToken = doc.querySelector('meta[name="_token"]')?.getAttribute('content');
                if (!metaToken) metaToken = originalForm.querySelector('input[name="_token"]')?.value;
                buildInlineForm(doc, originalForm, container, itemDiv, metaToken, originalUrl);
            })
            .catch(err => { container.innerHTML = `<div style="color:red; padding:10px;">Error Fetch: ${err.message}</div>`; });
    }

    // --- 7. BUILD FORM ---
    function buildInlineForm(doc, originalForm, container, itemDiv, metaToken, originalUrl) {
        const getVal = (name) => { const el = doc.querySelector(`input[name="${name}"]`); return el ? el.getAttribute('value') : ''; };
        const getTxt = (name) => { const el = doc.querySelector(`textarea[name="${name}"]`); return el ? el.textContent : ''; };

        const token = getVal('_token');
        let idTarget = getVal('id_target');
        if (!idTarget) {
            const match = originalUrl.match(/realisasi-kinerja\/(\d+)\/edit/);
            if (match && match[1]) idTarget = match[1];
        }

        const pj = getVal('pj');
        const unit = getVal('unit');
        const tahun = getVal('tahun');
        const nilaiTarget = getVal('nilai_target');
        let twVal = '4';
        const selectedOption = doc.querySelector('select[name="tw"] option[selected]');
        if(selectedOption) twVal = selectedOption.getAttribute('value').split('tw=')[1] || '4';

        if(!token || !idTarget) { container.innerHTML = `<div style="color:red;">GAGAL: Token/ID Invalid.</div>`; return; }

        const realisasi = getVal('realisasi_target');
        const pendorong = getTxt('faktor_pendorong');
        const penghambat = getTxt('analisa_masalah');
        const upaya = getTxt('upaya');
        const linkBukti = getVal('link_pendukung');

        const renaksiAreas = doc.querySelectorAll(`textarea[name="rencana_aksi[]"]`);
        const renaksiIds = doc.querySelectorAll(`input[name="id_rencana_aksi[]"]`);
        let renaksiHtml = '';
        if(renaksiAreas.length > 0) {
            renaksiAreas.forEach((area, i) => {
                const idVal = renaksiIds[i] ? renaksiIds[i].getAttribute('value') : '';
                renaksiHtml += createRenaksiRowHtml(area.textContent, idVal);
            });
        } else {
            renaksiHtml = '';
        }

        container.innerHTML = `
            <form class="inline-save-form" onsubmit="return false;">
                <input type="hidden" name="_token" value="${token}">
                <input type="hidden" name="id_target" value="${idTarget}">
                <input type="hidden" name="pj" value="${pj}">
                <input type="hidden" name="unit" value="${unit}">
                <input type="hidden" name="tahun" value="${tahun}">
                <input type="hidden" name="tw" value="${twVal}">
                <input type="hidden" name="triwulan_target" value="${twVal}">
                <input type="hidden" name="nilai_target" value="${nilaiTarget}">

                <div style="background:#f0fdf4; color:#166534; padding:12px; border-radius:8px; margin-bottom:15px; font-weight:600; text-align:center; border:1px solid #bbf7d0;">
                    🎯 TARGET KINERJA: ${nilaiTarget}
                </div>

                <div class="form-group">
                    <label class="form-label">Realisasi (Angka):</label>
                    <input type="number" class="form-control" name="realisasi_target" value="${realisasi}">
                </div>

                <div class="form-group">
                    <label class="form-label">Rencana Aksi:</label>
                    <div class="renaksi-wrapper">${renaksiHtml}</div>
                    <button type="button" class="btn btn-success btn-sm btn-add-renaksi" style="width:auto; margin-top:5px;">+ Tambah Aksi</button>
                </div>

                <div class="form-group">
                    <label class="form-label">Faktor Pendorong:</label>
                    <textarea class="form-control" name="faktor_pendorong">${pendorong}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Faktor Penghambat:</label>
                    <textarea class="form-control" name="analisa_masalah">${penghambat}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Upaya:</label>
                    <textarea class="form-control" name="upaya">${upaya}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Link Bukti Dukung:</label>
                    <input type="text" class="form-control" name="link_pendukung" value="${linkBukti}">
                </div>

                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button type="button" class="btn btn-primary btn-save" style="flex:2;">💾 SIMPAN (NO RELOAD)</button>
                    <button type="button" class="btn btn-danger btn-reset" style="flex:1;">🗑️ KOSONGKAN</button>
                </div>
                <div class="save-status" style="margin-top:10px; font-weight:bold; font-size:12px; text-align:center;"></div>
            </form>
        `;

        const formEl = container.querySelector('form');
        const wrapper = formEl.querySelector('.renaksi-wrapper');
        const statusEl = formEl.querySelector('.save-status');
        const saveBtn = formEl.querySelector('.btn-save');
        const resetBtn = formEl.querySelector('.btn-reset');

        formEl.querySelector('.btn-add-renaksi').onclick = () => {
            const div = document.createElement('div');
            div.innerHTML = createRenaksiRowHtml('', '');
            wrapper.appendChild(div.firstElementChild);
        };

        wrapper.onclick = (e) => {
            if(e.target.closest('.btn-del-renaksi')) {
                const btn = e.target.closest('.btn-del-renaksi');
                const row = btn.closest('.renaksi-row');
                const idInput = row.querySelector('input[name="id_rencana_aksi[]"]');
                const idVal = idInput ? idInput.value : '';

                if(idVal) {
                    if(confirm("Yakin HAPUS PERMANEN?")) {
                        btn.innerHTML = '...'; btn.disabled = true;
                        fetch(`https://e-sakip.kaltimprov.go.id/rencana-aksi/${idVal}`, {
                            method: 'DELETE', headers: { 'X-CSRF-TOKEN': metaToken || token }, credentials: 'include'
                        }).then(res => {
                            if(res.ok) {
                                row.remove();
                                statusEl.innerHTML = '<span style="color:#10b981">✅ Baris terhapus. (Refresh untuk update)</span>';
                            } else { alert("Gagal hapus. Code: " + res.status); btn.disabled = false; }
                        }).catch(err => { alert("Koneksi Error"); btn.disabled = false; });
                    }
                } else { row.remove(); }
            }
        };

        resetBtn.onclick = () => {
            if(!confirm("Yakin kosongkan form? (Isi akan dihapus bersih)")) return;
            formEl.querySelector('[name="realisasi_target"]').value = '0';
            formEl.querySelector('[name="faktor_pendorong"]').value = '';
            formEl.querySelector('[name="analisa_masalah"]').value = '';
            formEl.querySelector('[name="upaya"]').value = '';
            formEl.querySelector('[name="link_pendukung"]').value = '';
            wrapper.querySelectorAll('textarea').forEach(ta => ta.value = '');
        };

        saveBtn.onclick = () => {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<div class="spinner"></div> Menyimpan...';
            const formData = new FormData(formEl);
            fetch('https://e-sakip.kaltimprov.go.id/update-realisasi-kinerja', { method: 'POST', body: formData, credentials: 'include' })
            .then(res => {
                if(res.ok || res.status === 302) {
                    statusEl.innerHTML = '<span style="color:#10b981">✅ TERSIMPAN! (Refresh untuk update tabel)</span>';
                    saveBtn.innerHTML = '✅ TERSIMPAN';
                    const header = itemDiv.querySelector('.item-summary');
                    header.classList.remove('status-bad'); header.classList.add('status-ok');
                    header.querySelector('.badge').className = 'badge bg-success';
                    header.querySelector('.badge').innerText = 'LENGKAP';
                    setTimeout(() => { saveBtn.innerHTML = '💾 SIMPAN (NO RELOAD)'; saveBtn.disabled = false; }, 2000);
                } else { throw new Error('Server reject'); }
            })
            .catch(err => {
                statusEl.innerHTML = `<span style="color:#ef4444">❌ Gagal: ${err.message}</span>`;
                saveBtn.disabled = false;
                saveBtn.innerHTML = '💾 SIMPAN (NO RELOAD)';
            });
        };
    }

    function createRenaksiRowHtml(val, id) {
        const safeVal = val ? val : '';
        const safeId = id ? id : '';
        return `
            <div class="renaksi-row">
                <textarea class="form-control" name="rencana_aksi[]" placeholder="Isi rencana aksi..." style="min-height:60px;">${safeVal}</textarea>
                <input type="hidden" name="id_rencana_aksi[]" value="${safeId}">
                <button type="button" class="btn btn-danger btn-del-renaksi" style="padding:6px 12px; margin-left:5px;" title="Hapus Permanen">🗑️</button>
            </div>
        `;
    }

    setTimeout(analyzeData, 1500);
})();
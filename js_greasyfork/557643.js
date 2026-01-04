// ==UserScript==
// @name         Ruang Baca Virtual Downloader
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A script for downloading module materials from Ruang Baca Virtual (RBV).
// @author       deoffuscated
// @match        https://pustaka.ut.ac.id/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557643/Ruang%20Baca%20Virtual%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/557643/Ruang%20Baca%20Virtual%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const CONCURRENCY_LIMIT = 5;
    const MAX_PAGE_SAFETY_LIMIT = 1000;
    const existingWrapper = document.getElementById('ut-scraper-wrapper');
    if (existingWrapper) existingWrapper.remove();
    const existingStyle = document.getElementById('ut-scraper-style');
    if (existingStyle) existingStyle.remove();
    const navLinks = document.querySelectorAll('nav.sidebar-nav a');
    if (navLinks.length === 0) {
        console.warn("Navigasi tidak ditemukan. Script ini hanya bekerja di halaman baca modul.");
        return;
    }

    const style = document.createElement('style');
    style.id = 'ut-scraper-style';
    style.innerHTML = `
        :root {
            --primary-color: #1859BC;
            --accent-color: #e67e22;
            --glass-bg: rgba(255, 255, 255, 0.95);
            --glass-blur: blur(16px);
        }

        #ut-scraper-wrapper {
            position: fixed; z-index: 99999; bottom: 30px; right: 30px;
            display: flex; flex-direction: column; align-items: flex-end;
            font-family: -apple-system, system-ui, sans-serif;
        }

        #ut-widget-trigger {
            width: 50px; height: 50px; border-radius: 50%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border: 2px solid var(--primary-color);
            box-shadow: 0 4px 20px rgba(24, 89, 188, 0.35);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s; z-index: 100000; padding: 8px; box-sizing: border-box;
        }
        #ut-widget-trigger:hover { transform: scale(1.1); background: #fff; }
        #ut-widget-trigger img { width: 100%; height: 100%; object-fit: contain; }
        #ut-widget-trigger.is-open { border-color: var(--accent-color); }
        #ut-widget-trigger.is-open img { transform: scale(0.9); filter: grayscale(20%); }

        #ut-main-panel {
            background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            border-radius: 16px; width: 300px; margin-bottom: 15px; overflow: hidden;
            transform-origin: bottom right; transform: scale(0) translateY(20px); opacity: 0;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex; flex-direction: column;
            position: relative;
            max-height: 70vh;
        }
        #ut-main-panel.active { transform: scale(1) translateY(0); opacity: 1; }

        .ut-header { padding: 12px 15px; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.4); }
        .ut-title { font-weight: 800; color: var(--primary-color); font-size: 14px; margin: 0; }
        .ut-subtitle { font-size: 10px; color: #4a5568; margin: 1px 0 0; }

        .ut-content {
            padding: 10px; overflow-y: auto; flex: 1; scrollbar-width: thin;
        }

        .ut-item {
            display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; margin-bottom: 4px;
            background: rgba(255,255,255,0.6); border-radius: 8px; border: 1px solid rgba(255,255,255,0.5);
            cursor: pointer; transition: all 0.2s; color: #2d3748; font-weight: 600; font-size: 12px;
        }
        .ut-item:hover { background: #fff; transform: translateX(-2px); color: var(--primary-color); border-color: var(--primary-color); }
        .ut-item svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 2.5; fill: none; }

        .ut-progress-section {
            padding: 8px 15px; background: #f8fafc; border-top: 1px solid rgba(0,0,0,0.05); display: none;
        }
        .ut-prog-labels { display: flex; justify-content: space-between; font-size: 10px; color: #64748b; margin-bottom: 4px; font-weight: 600; }
        .ut-prog-track { width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; }
        .ut-prog-bar { height: 100%; background: var(--primary-color); width: 0%; transition: width 0.3s ease; }

        .ut-footer-action { padding: 10px 15px; background: rgba(255,255,255,0.6); border-top: 1px solid rgba(0,0,0,0.05); }
        .btn-download-all {
            width: 100%; padding: 8px 16px; border: none; border-radius: 8px;
            background: linear-gradient(135deg, #1859BC 0%, #0d3c85 100%);
            color: white; font-weight: 600; font-size: 12px; cursor: pointer;
            display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px;
            box-shadow: 0 2px 5px rgba(24, 89, 188, 0.2); transition: transform 0.2s;
            min-height: 36px;
        }
        .btn-download-all:hover { transform: translateY(-1px); background: linear-gradient(135deg, #134696 0%, #0a2a5e 100%); }
        .btn-download-all:disabled { background: #94a3b8; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-download-all svg { width: 16px; height: 16px; flex-shrink: 0; }

        .ut-modal-overlay {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(5px);
            z-index: 500; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.2s; border-radius: 16px;
        }
        .ut-modal-overlay.show { display: flex; opacity: 1; }
        .ut-modal-box {
            background: white; width: 80%; padding: 15px; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid #e2e8f0;
            transform: scale(0.9); transition: transform 0.2s; text-align: center;
        }
        .ut-modal-overlay.show .ut-modal-box { transform: scale(1); }
        .ut-modal-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 5px; }
        .ut-modal-text { font-size: 11px; color: #64748b; margin-bottom: 12px; line-height: 1.3; }
        .ut-modal-actions { display: flex; gap: 8px; justify-content: center; }
        .ut-btn { flex: 1; padding: 6px 0; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; transition: background 0.2s; }
        .ut-btn-cancel { background: #f1f5f9; color: #64748b; }
        .ut-btn-cancel:hover { background: #e2e8f0; color: #334155; }
        .ut-btn-confirm { background: #1859BC; color: white; }
        .ut-btn-confirm:hover { background: #134696; }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.id = 'ut-scraper-wrapper';

    const trigger = document.createElement('div');
    trigger.id = 'ut-widget-trigger';
    trigger.innerHTML = `<img src="https://suopmkm.ut.ac.id/uo/statics/logo.png" alt="UT Logo">`;

    const panel = document.createElement('div');
    panel.id = 'ut-main-panel';
    panel.innerHTML = `
        <div class="ut-header">
            <h3 class="ut-title">Ruang Baca Virtual Downloader</h3>
            <p class="ut-subtitle">Pilih modul yang ingin kamu download.</p>
        </div>
        <div class="ut-content" id="ut-list-container"></div>
        <div class="ut-progress-section" id="ut-prog-container">
            <div class="ut-prog-labels">
                <span id="ut-prog-status">Menyiapkan...</span>
                <span id="ut-prog-percent">0%</span>
            </div>
            <div class="ut-prog-track">
                <div class="ut-prog-bar" id="ut-prog-fill"></div>
            </div>
        </div>
        <div class="ut-footer-action">
            <button class="btn-download-all" id="btn-dl-all">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Download Semua</span>
            </button>
        </div>
        <div class="ut-modal-overlay" id="ut-custom-modal">
            <div class="ut-modal-box">
                <div class="ut-modal-title" id="ut-modal-title">Konfirmasi</div>
                <div class="ut-modal-text" id="ut-modal-text">Pesan...</div>
                <div class="ut-modal-actions">
                    <button class="ut-btn ut-btn-cancel" id="ut-modal-cancel">Batal</button>
                    <button class="ut-btn ut-btn-confirm" id="ut-modal-ok">Lanjutkan</button>
                </div>
            </div>
        </div>
    `;

    wrapper.appendChild(panel);
    wrapper.appendChild(trigger);
    document.body.appendChild(wrapper);

    let isOpen = false;
    trigger.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            panel.classList.add('active');
            trigger.classList.add('is-open');
        } else {
            panel.classList.remove('active');
            trigger.classList.remove('is-open');
        }
    });

    let confirmCallback = null;
    const modalOverlay = document.getElementById('ut-custom-modal');
    const modalTitle = document.getElementById('ut-modal-title');
    const modalText = document.getElementById('ut-modal-text');
    const btnCancel = document.getElementById('ut-modal-cancel');
    const btnOk = document.getElementById('ut-modal-ok');

    function showDialog(title, message, onConfirm, isAlert = false) {
        modalTitle.innerText = title;
        modalText.innerText = message;
        confirmCallback = onConfirm;
        if (isAlert) {
            btnCancel.style.display = 'none';
            btnOk.innerText = 'Tutup';
            btnOk.onclick = hideDialog;
        } else {
            btnCancel.style.display = 'block';
            btnOk.innerText = 'Lanjutkan';
            btnOk.onclick = () => {
                if (confirmCallback) confirmCallback();
                setTimeout(hideDialog, 100);
            };
        }
        modalOverlay.classList.add('show');
    }

    function hideDialog() {
        modalOverlay.classList.remove('show');
        confirmCallback = null;
    }

    btnCancel.onclick = hideDialog;

    const listContainer = document.getElementById('ut-list-container');
    const allModules = [];
    let globalCourseName = "Materi UT";

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.includes('javascript:')) return;

        const urlParams = new URLSearchParams(href.split('?')[1]);
        const subfolder = urlParams.get('subfolder');
        let docName = urlParams.get('doc');
        let label = link.innerText.trim() || docName;

        if (subfolder && docName) {
            const docId = docName.replace('.pdf', '');
            const itemData = { subfolder, docId, label };
            allModules.push(itemData);
            if (globalCourseName === "Materi UT") {
                globalCourseName = subfolder.replace(/\/$/, '');
            }
            const btn = document.createElement('div');
            btn.className = 'ut-item';
            btn.innerHTML = `<span>${label}</span><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`;
            btn.onclick = () => {
                showDialog("Konfirmasi", `Ingin download "${label}"?`, () => startDownload([itemData]));
            };
            listContainer.appendChild(btn);
        }
    });

    document.getElementById('btn-dl-all').addEventListener('click', () => {
        if (allModules.length > 0) {
            showDialog('Konfirmasi', `Download semua modul? Ini memakan waktu dan pastikan koneksi kamu stabil.`, () => startDownload(allModules));
        } else {
            showDialog('Info', 'Tidak ada modul.', null, true);
        }
    });

    const baseUrl = `${window.location.origin}/reader/services/view.php`;

    function setProgress(msg, percent) {
        const progContainer = document.getElementById('ut-prog-container');
        const statusEl = document.getElementById('ut-prog-status');
        const pctEl = document.getElementById('ut-prog-percent');
        const barEl = document.getElementById('ut-prog-fill');

        progContainer.style.display = 'block';
        statusEl.innerText = msg;
        const safePct = Math.min(100, Math.max(0, percent));
        pctEl.innerText = Math.round(safePct) + '%';
        barEl.style.width = safePct + '%';
    }

    async function fetchImage(mod, pageNum) {
        const imgUrl = `${baseUrl}?doc=${mod.docId}&format=jpg&subfolder=${mod.subfolder}&page=${pageNum}`;
        try {
            const response = await fetch(imgUrl);
            if (!response.ok) return null;
            const blob = await response.blob();
            if (blob.size < 500) return null;
            return URL.createObjectURL(blob);
        } catch (e) { return null; }
    }

    async function startDownload(modulesList) {
        const btnAll = document.getElementById('btn-dl-all');
        const originalBtnText = btnAll.innerHTML;
        btnAll.disabled = true;
        btnAll.innerHTML = `<span>Sedang Memproses...</span>`;

        let combinedHtml = "";
        let totalModules = modulesList.length;
        let pageTitle = globalCourseName;
        if (modulesList.length === 1) pageTitle += `: ${modulesList[0].label}`;

        for (let mIdx = 0; mIdx < totalModules; mIdx++) {
            const mod = modulesList[mIdx];
            const validImages = [];
            let page = 1;
            let consecutiveErrors = 0;

            setProgress(`Scan ${mod.label}...`, (mIdx / totalModules) * 100);

            while (page < MAX_PAGE_SAFETY_LIMIT) {
                const promises = [];
                for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
                    promises.push(fetchImage(mod, page + i));
                }

                const results = await Promise.all(promises);
                let batchHasData = false;
                for (let res of results) {
                    if (res) {
                        validImages.push(res);
                        batchHasData = true;
                        consecutiveErrors = 0;
                    } else {
                        consecutiveErrors++;
                    }
                }
                if (!batchHasData || consecutiveErrors >= CONCURRENCY_LIMIT) break;
                page += CONCURRENCY_LIMIT;
                setProgress(`Proses download ${mod.label} (${validImages.length} halaman)`, (mIdx / totalModules) * 100);
            }

            if (validImages.length > 0) {
                combinedHtml += `<div class="mod-section"><h2>${mod.label}</h2>`;
                validImages.forEach(blobUrl => {
                    combinedHtml += `<img src="${blobUrl}" loading="lazy" />`;
                });
                combinedHtml += `</div><div class="page-break"></div>`;
            }
        }

        setProgress("Selesai! Membuat PDF...", 100);
        setTimeout(() => {
            generatePrintWindow(combinedHtml, pageTitle);
            document.getElementById('ut-prog-container').style.display = 'none';
            btnAll.disabled = false;
            btnAll.innerHTML = originalBtnText;
        }, 1000);
    }

    function generatePrintWindow(content, title) {
        const win = window.open('', '_blank');
        if (!win) {
            showDialog('Gagal', 'Pop-up diblokir browser. Izinkan pop-up.', null, true);
            return;
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { background: #f1f5f9; margin: 0; padding: 20px; font-family: 'Segoe UI', sans-serif; color: #1e293b; display:flex; flex-direction:column; align-items:center; }
                    .doc-container { max-width: 850px; width:100%; }
                    .info-card {
                        background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                        margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0;
                    }
                    .info-card h1 { margin: 0; font-size: 16px; }
                    .btn-print {
                        background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px;
                        font-weight: 600; cursor: pointer; font-size: 13px;
                    }
                    .mod-section { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 30px; padding: 0 0 20px 0; }
                    .mod-section h2 {
                        background: #f8fafc; padding: 10px; margin: 0 0 15px 0; font-size: 14px; border-bottom: 1px solid #e2e8f0; text-align:center; color: #64748b;
                    }
                    img { width: 100%; height: auto; display: block; margin: 0 auto; }

                    @page {
                        margin: 0; /* Menghilangkan header/footer default (tanggal/url) */
                        size: auto;
                    }
                    @media print {
                        body { background: white; padding: 0; margin: 0; }
                        .info-card { display: none; }
                        .mod-section { box-shadow: none; margin: 0; }
                        .mod-section h2 { display: none; } /* Opsi: Sembunyikan judul per modul saat print agar rapi */
                        .page-break { page-break-after: always; }
                        img { page-break-inside: avoid; margin: 0; width: 100%; max-width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="doc-container">
                    <div class="info-card">
                        <h1>${title}</h1>
                        <button class="btn-print" onclick="window.print()">Simpan PDF</button>
                    </div>
                    ${content}
                </div>
            </body>
            </html>
        `;

        win.document.write(html);
        win.document.close();
    }
})();
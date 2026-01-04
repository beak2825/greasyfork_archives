// ==UserScript==
// @name         IEEE Batch Downloader for Chrome
// @namespace    https://greasyfork.org/zh-CN/users/236397-hust-hzb
// @version      1
// @description  IEEE Xplore PDF batch downloader. Features: Shift multi-select, max-speed downloading (no artificial delays), and automatic token refresh/cache cleaning upon blocking. Optimized for Chrome.
// @description:zh-CN IEEE Xplore PDF 批量下载插件。支持 Shift 键多选、极速下载模式（无人工延迟）、遇阻自动清除缓存并刷新续传。专为 Chrome 浏览器优化。
// @author       HUST Huangzhenbin
// @license      MIT
// @match        *://ieeexplore.ieee.org/*
// @icon         https://ieeexplore.ieee.org/assets/img/favicon.ico
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560371/IEEE%20Batch%20Downloader%20for%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/560371/IEEE%20Batch%20Downloader%20for%20Chrome.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 🌐 多语言配置 (I18N) ===
    const USER_LANG = navigator.language.startsWith('zh') ? 'zh' : 'en';

    const I18N = {
        zh: {
            btn_main: 'IEEE 批量导出',
            folder_label: '📂 归档文件夹',
            min_delay_label: '⏱️ 最小延迟(ms)',
            max_delay_label: '⏱️ 最大延迟(ms)',
            btn_start: '⬇️ 开始下载',
            btn_resume: '🔄 自动续传中...',
            btn_stop: '🛑 停止并清除',
            btn_select_all: '全选',
            btn_deselect_all: '反选',
            btn_refresh_list: '刷新列表',
            btn_close: '关闭',
            table_sel: '选',
            table_idx: '#',
            table_title: '论文标题',
            table_status: '状态',
            status_pending: '待下载',
            status_fetching: '获取数据...',
            status_validating: '校验文件...',
            status_done: '完成',
            status_failed: '失败',
            status_blocked: '拦截(清洗中)',
            status_wait: '---',
            alert_resume: '<b>🔄 自动续传模式：</b> 拦截已解除，Token 已更新。脚本自动唤醒，全速继续下载...',
            alert_logic_info: '<b>⚡ 极限竞速模式：</b> 不再主动刷新。脚本会一直下载直到遇到 HTML 拦截，然后自动<b>清除缓存并刷新</b>救场。',
            alert_config_title: '<b>🛠️ 配置检查：</b>',
            alert_config_browser: '1. 浏览器：关闭 "下载前询问每个文件的保存位置"。',
            alert_config_plugin: '2. 油猴：下载模式必须设为 <strong>Browser API</strong>。',
            msg_no_paper: '未找到可下载的论文 (请等待页面加载完毕)',
            msg_stopped: '🛑 任务已停止',
            msg_blocked_fix: '⚠️ <b>Token 已耗尽!</b><br>检测到下载变为 HTML。正在<b>清除 IEEE 缓存</b>并重置连接...',
            msg_all_done: '✨ 所有任务已完成！',
            msg_progress: '进度: {done} / {total}<br>正在下载: {name}...<br>⏳ 极速等待: {sec}s',
            tag_current_page: '当前页',
            author_by: 'Script by:',
            msg_waiting_load: '⏳ <b>正在唤醒脚本...</b><br>等待 IEEE 页面渲染列表，请稍候...'
        },
        en: {
            btn_main: 'IEEE Batch Export',
            folder_label: '📂 Save Folder',
            min_delay_label: '⏱️ Min Delay(ms)',
            max_delay_label: '⏱️ Max Delay(ms)',
            btn_start: '⬇️ Start Download',
            btn_resume: '🔄 Auto Resuming...',
            btn_stop: '🛑 Stop & Clear',
            btn_select_all: 'All',
            btn_deselect_all: 'None',
            btn_refresh_list: 'Refresh List',
            btn_close: 'Close',
            table_sel: 'Sel',
            table_idx: '#',
            table_title: 'Paper Title',
            table_status: 'Status',
            status_pending: 'Pending',
            status_fetching: 'Fetching...',
            status_validating: 'Validating...',
            status_done: 'Done',
            status_failed: 'Failed',
            status_blocked: 'Blocked(Cleaning)',
            status_wait: '---',
            alert_resume: '<b>🔄 Auto Resuming...</b> Block removed. Token updated. Resuming full speed...',
            alert_logic_info: '<b>⚡ Max Speed Mode:</b> No preemptive refresh. Script runs until blocked by HTML, then auto-clears cache & reloads.',
            alert_config_title: '<b>🛠️ Check:</b>',
            alert_config_browser: '1. Browser: Disable "Ask where to save".',
            alert_config_plugin: '2. Tampermonkey: Set Download Mode to <strong>Browser API</strong>.',
            msg_no_paper: 'Waiting for paper list... (Please manually refresh if stuck)',
            msg_stopped: '🛑 Task Stopped',
            msg_blocked_fix: '⚠️ <b>Token Expired!</b><br>HTML detected. Clearing <b>IEEE Cache</b> to reset connection...',
            msg_all_done: '✨ All Tasks Completed!',
            msg_progress: 'Batch: {done}/{total}<br>Downloading: {name}...<br>⏳ Waiting: {sec}s',
            tag_current_page: 'Current Page',
            author_by: 'Script by:',
            msg_waiting_load: '⏳ <b>Waking up...</b><br>Waiting for IEEE page render...'
        }
    };

    function t(key, params = {}) {
        let str = I18N[USER_LANG][key] || I18N['en'][key] || key;
        for (let k in params) {
            str = str.replace(`{${k}}`, params[k]);
        }
        return str;
    }

    // === 核心配置 ===
    const DEFAULT_FOLDER = "IEEE_Downloads";
    // ⚡ 提速：默认延迟降低
    const DEFAULT_MIN_DELAY = 2000;
    const DEFAULT_MAX_DELAY = 5000;

    const AUTHOR_INFO = {
        name: "Huangzhenbin",
        orcid: "https://orcid.org/0000-0002-0628-0387"
    };

    const SELECTORS = {
        resultItem: '.List-results-items .result-item, xpl-results-item',
        listTitle: 'h3.text-md-md-lh, h2 a',
        listPdfLink: 'a.pdf, a[href*="stamp.jsp"]',
        docTitle: 'h1.document-title, h1.display-title',
        docContainer: '.document-main-content'
    };

    let isRunning = false;
    let uiTimer = null;
    let lastChecked = null;
    const $ = unsafeWindow.jQuery;

    // --- 样式注入 ---
    const css = `
        #diy-btn-float { position: fixed; right: 20px; bottom: 80px; z-index: 9999; padding: 12px 20px; background: #00629B; color: #fff; border: none; border-radius: 4px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer; transition: all 0.3s; }
        #diy-btn-float:hover { background: #0056b3; transform: scale(1.05); }
        .diy-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:10000; display:flex; justify-content:center; align-items:center; }
        .diy-box { width:900px; height:90%; background:#fff; padding:20px; border-radius:8px; box-shadow:0 0 25px rgba(0,0,0,0.5); display:flex; flex-direction:column; position:relative; }
        .diy-config-alert { background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 12px; border-radius: 5px; margin-bottom: 15px; font-size: 13px; line-height: 1.6; }
        .diy-config-alert strong { color: #d9534f; }
        .diy-alert { background:#e2f0fb; color:#00629B; padding:10px; border-radius:4px; font-size:13px; margin-bottom:10px; border-left: 4px solid #00629B; }
        .diy-controls { background:#f8f9fa; padding:15px; border-radius:5px; margin-bottom:15px; display:flex; flex-wrap:wrap; gap:15px; border:1px solid #eee; align-items: center; }
        .diy-input-group { display: flex; flex-direction: column; }
        .diy-label { font-size: 12px; font-weight: bold; color: #555; margin-bottom: 4px; }
        .diy-input { padding: 6px; border: 1px solid #ccc; border-radius: 4px; width: 150px; }
        .diy-input-small { padding: 6px; border: 1px solid #ccc; border-radius: 4px; width: 60px; }
        .diy-actions { display: flex; gap: 10px; margin-bottom: 10px; }
        .diy-btn { padding: 8px 16px; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-size: 13px; font-weight: bold; transition: opacity 0.2s; }
        .diy-btn:hover { opacity: 0.9; }
        .diy-table-wrap { flex: 1; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f1f3f5; padding: 10px; position: sticky; top: 0; text-align: left; font-size: 13px; color: #555; border-bottom: 2px solid #ddd; }
        td { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 13px; color: #333; }
        tr:hover { background-color: #f8f9fa; }
        .status-ready { color: #aaa; }
        .status-pending { color: #007bff; font-weight: bold; }
        .status-downloading { color: #e67e22; font-weight: bold; }
        .status-done { color: #28a745; font-weight: bold; }
        #diy-loading { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#fff; padding:25px; border:2px solid #00629B; border-radius:8px; z-index:999999; text-align:center; font-weight:bold; box-shadow:0 5px 20px rgba(0,0,0,0.3); min-width: 300px; display:none;}
        .diy-footer { margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #666; text-align: right; display: flex; justify-content: flex-end; align-items: center; gap: 10px; }
        .diy-author-link { color: #00629B; text-decoration: none; font-weight: bold; display: flex; align-items: center; gap: 5px; }
        .diy-author-link:hover { text-decoration: underline; }
        .orcid-icon { width: 16px; height: 16px; vertical-align: middle; }
    `;
    function loadCss(code) {
        const style = document.createElement('style');
        style.textContent = code;
        document.head.appendChild(style);
    }
    loadCss(css);

    function createLoading(text, duration = 0) {
        let el = document.getElementById('diy-loading');
        if (!el) {
            el = document.createElement('div');
            el.id = 'diy-loading';
            document.body.appendChild(el);
        }
        el.innerHTML = text.replace(/\n/g, '<br>');
        el.style.display = 'block';
        if (duration) setTimeout(() => { if(el.parentNode) el.style.display = 'none'; }, duration);
        return el;
    }

    function hideLoading() {
        const el = document.getElementById('diy-loading');
        if (el) el.style.display = 'none';
        if (uiTimer) clearInterval(uiTimer);
    }

    function createPopupButton() {
        if (document.getElementById('diy-btn-float')) return;
        const popupButton = document.createElement('button');
        popupButton.textContent = t('btn_main');
        popupButton.id = 'diy-btn-float';
        popupButton.onclick = () => { createPopup(); getLinksFromCurrentPage(); };
        document.body.appendChild(popupButton);
    }

    // --- 🎯 核心功能：IEEE 定向数据清洗 ---
    function clearIEEESession() {
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch(e) {}

        const cookies = document.cookie.split(";");
        const domains = [window.location.hostname, ".ieee.org", "ieeexplore.ieee.org"];

        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            domains.forEach(domain => {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            });
        });
        console.log("🧹 IEEE 专用缓存已清理");
    }

    // --- 核心：Fetch + 验证 + 熔断 ---
    async function downloadPdfAndValidate(url, filename, folder, statusCallback) {
        return new Promise(async (resolve, reject) => {
            try {
                // 1. 原生 Fetch
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Accept': 'application/pdf' }
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                // 2. 获取 Blob
                const blob = await response.blob();

                // 3. 文件头校验 (Magic Bytes)
                statusCallback(t('status_validating'));
                const headerText = await blob.slice(0, 4).text();

                // 4. 熔断判断: 不是 PDF 立即报错
                if (headerText !== '%PDF') {
                    console.error("Signature Mismatch: Expected %PDF, got", headerText);
                    reject({ type: 'BLOCKED', msg: 'File signature is not PDF' });
                    return;
                }

                // 5. 验证通过，保存
                const localUrl = URL.createObjectURL(blob);
                const finalPath = folder ? `${folder}/${filename}` : filename;

                GM_download({
                    url: localUrl,
                    name: finalPath,
                    saveAs: false,
                    conflictAction: 'overwrite',
                    onload: () => {
                        URL.revokeObjectURL(localUrl);
                        resolve();
                    },
                    onerror: (err) => {
                        URL.revokeObjectURL(localUrl);
                        reject(err);
                    }
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    // --- UI 构建 ---
    function createPopup(isAutoResuming = false) {
        if (document.getElementById('popup')) return;

        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.className = 'diy-overlay';

        const content = document.createElement('div');
        content.className = 'diy-box';

        const configAlert = `
            <div class="diy-config-alert">
                ${t('alert_config_title')}<br>
                ${t('alert_config_browser')}<br>
                ${t('alert_config_plugin')}
            </div>
        `;

        let logicAlert = '';
        if (isAutoResuming) {
            logicAlert = `<div class="diy-alert" style="background:#fff3cd;color:#856404;border-left-color:#ffeeba">${t('alert_resume')}</div>`;
        } else {
            logicAlert = `<div class="diy-alert">${t('alert_logic_info')}</div>`;
        }

        content.innerHTML = `
            ${configAlert}
            ${logicAlert}
            <div class="diy-controls">
                <div class="diy-input-group">
                    <span class="diy-label">${t('folder_label')}</span>
                    <input type="text" id="folder-input" class="diy-input" value="${GM_getValue('savedFolder', DEFAULT_FOLDER)}">
                </div>
                <div class="diy-input-group">
                    <span class="diy-label">${t('min_delay_label')}</span>
                    <input type="number" id="min-delay-input" class="diy-input-small" value="${GM_getValue('savedMinDelay', DEFAULT_MIN_DELAY)}">
                </div>
                <div class="diy-input-group">
                    <span class="diy-label">${t('max_delay_label')}</span>
                    <input type="number" id="max-delay-input" class="diy-input-small" value="${GM_getValue('savedMaxDelay', DEFAULT_MAX_DELAY)}">
                </div>
                <div style="flex:1;"></div>
            </div>
            <div class="diy-actions">
                <button id="btn-start" class="diy-btn" style="background:#28a745;flex:1">${t('btn_start')}</button>
                <button id="btn-stop" class="diy-btn" style="background:#dc3545">${t('btn_stop')}</button>
                <button id="btn-all" class="diy-btn" style="background:#6c757d">${t('btn_select_all')}</button>
                <button id="btn-none" class="diy-btn" style="background:#6c757d">${t('btn_deselect_all')}</button>
                <button id="btn-refresh" class="diy-btn" style="background:#00629B">${t('btn_refresh_list')}</button>
                <button id="btn-close" class="diy-btn" style="background:#333">${t('btn_close')}</button>
            </div>
            <div class="diy-table-wrap">
                <table id="my-table">
                    <thead>
                        <tr><th style="width:40px">${t('table_sel')}</th><th style="width:40px">${t('table_idx')}</th><th>${t('table_title')}</th><th style="width:80px">${t('table_status')}</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="diy-footer">
                <span>${t('author_by')}</span>
                <a href="${AUTHOR_INFO.orcid}" target="_blank" class="diy-author-link">
                    <img src="https://orcid.org/sites/default/files/images/orcid_16x16.png" class="orcid-icon" alt="ORCID logo">
                    ${AUTHOR_INFO.name}
                </a>
            </div>
        `;

        popup.appendChild(content);
        document.body.appendChild(popup);

        document.getElementById('btn-close').onclick = () => document.body.removeChild(popup);
        document.getElementById('btn-stop').onclick = stopDownloadAndClear;
        document.getElementById('btn-all').onclick = selectAll;
        document.getElementById('btn-none').onclick = deselectAll;
        document.getElementById('btn-refresh').onclick = () => getLinksFromCurrentPage();
        document.getElementById('btn-start').onclick = downloadSelected;

        getLinksFromCurrentPage(isAutoResuming);
    }

    function sanitizeFilename(name) {
        return (name || "Unknown").replace(/[\/\\:*?"<>|]/g, '_').replace(/[\t\n\r]/g, '').replace(/\s+/g, ' ').trim();
    }

    function getArnumber(url) {
        const match = url.match(/arnumber=(\d+)/);
        return match ? match[1] : null;
    }

    function delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getLinksFromCurrentPage(isAutoResume = false) {
        const tableBody = document.querySelector('#my-table tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        lastChecked = null;

        const isDetailPage = window.location.href.includes('/document/');
        let items = [];

        if (isDetailPage) {
            const titleEl = document.querySelector(SELECTORS.docTitle);
            const urlMatch = window.location.href.match(/\/document\/(\d+)/);
            if (titleEl && urlMatch) {
                items.push({ title: titleEl.textContent.trim(), arnumber: urlMatch[1], type: 'detail' });
            }
        } else {
            const resultElements = document.querySelectorAll(SELECTORS.resultItem);
            resultElements.forEach(el => {
                const titleEl = el.querySelector(SELECTORS.listTitle);
                const pdfEl = el.querySelector(SELECTORS.listPdfLink);
                if (titleEl && pdfEl) {
                    const arnumber = getArnumber(pdfEl.href);
                    if (arnumber) {
                        items.push({ title: titleEl.textContent.trim(), arnumber: arnumber, type: 'list' });
                    }
                }
            });
        }

        if (items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:10px">${t('msg_no_paper')}</td></tr>`;
            if (isAutoResume) { return; }
            return;
        }

        const resumeQueue = GM_getValue('resumeQueue', []);
        let autoCheckCount = 0;

        items.forEach((item, index) => {
            const row = tableBody.insertRow();
            const directDownloadLink = `https://ieeexplore.ieee.org/stampPDF/getPDF.jsp?tp=&arnumber=${item.arnumber}`;
            const safeFileName = sanitizeFilename(item.title) + '.pdf';

            row.dataset.arnumber = item.arnumber;
            row.dataset.url = directDownloadLink;
            row.dataset.filename = safeFileName;

            let shouldCheck = true;
            if (isAutoResume) {
                shouldCheck = resumeQueue.includes(item.arnumber);
            }
            if(shouldCheck) autoCheckCount++;

            row.innerHTML = `
                <td style="text-align:center"><input type="checkbox" class="selectItem" ${shouldCheck ? 'checked' : ''}></td>
                <td style="text-align:center">${index + 1}</td>
                <td>${item.title} ${item.type === 'detail' ? `<span style="color:red;font-size:10px;border:1px solid red;padding:0 2px;border-radius:3px;">${t('tag_current_page')}</span>` : ''}</td>
                <td class="status-cell" style="font-weight:bold;color:${shouldCheck?'#007bff':'#aaa'}">${shouldCheck ? t('status_pending') : t('status_wait')}</td>
            `;

            const checkbox = row.querySelector('.selectItem');
            checkbox.addEventListener('click', function(e) {
                if (e.shiftKey && lastChecked) {
                    const allChecks = Array.from(document.querySelectorAll('.selectItem'));
                    const start = allChecks.indexOf(this);
                    const end = allChecks.indexOf(lastChecked);
                    if (start !== -1 && end !== -1) {
                        const low = Math.min(start, end);
                        const high = Math.max(start, end);
                        for (let i = low; i <= high; i++) {
                            allChecks[i].checked = this.checked;
                            updateRowStatus(allChecks[i]);
                        }
                    }
                }
                lastChecked = this;
                updateRowStatus(this);
                updateStartBtn();
            });
        });
        updateStartBtn();

        if (isAutoResume && autoCheckCount > 0) {
            createLoading(t('msg_waiting_load'), 0);
            setTimeout(() => {
                hideLoading();
                const btn = document.getElementById('btn-start');
                if (btn) btn.click();
            }, 3000);
        } else if (isAutoResume) {
            GM_setValue('isAutoRun', false);
            createLoading(t('msg_all_done'), 3000);
        }
    }

    function updateRowStatus(checkbox) {
        const cell = checkbox.closest('tr').querySelector('.status-cell');
        if (cell) {
            cell.innerHTML = checkbox.checked ? `<span style="color:#007bff">${t('status_pending')}</span>` : `<span style="color:#aaa">${t('status_wait')}</span>`;
        }
    }

    function stopDownloadAndClear() {
        isRunning = false;
        GM_setValue('isAutoRun', false);
        GM_setValue('resumeQueue', []);
        hideLoading();
        createLoading(t('msg_stopped'), 1500);
        setTimeout(() => location.reload(), 1500);
    }

    async function downloadSelected() {
        if (isRunning) return;

        const selected = document.querySelectorAll('.selectItem:checked');
        if (selected.length === 0) return;

        isRunning = true;
        GM_setValue('isAutoRun', true);

        const folder = document.getElementById('folder-input').value.trim();
        const minDelay = parseInt(document.getElementById('min-delay-input').value) || 3000;
        const maxDelay = parseInt(document.getElementById('max-delay-input').value) || 6000;

        GM_setValue('savedFolder', folder);
        GM_setValue('savedMinDelay', minDelay);
        GM_setValue('savedMaxDelay', maxDelay);

        const queue = [];
        selected.forEach(cb => queue.push(cb.closest('tr').dataset.arnumber));
        GM_setValue('resumeQueue', queue);

        let batchCount = 0;

        for (let i = 0; i < selected.length; i++) {
            if (!isRunning) break;

            // ⚠️ 移除了主动刷新，全靠熔断机制 ⚠️

            const cb = selected[i];
            const row = cb.closest('tr');
            const url = row.dataset.url;
            const filename = row.dataset.filename;
            const statusCell = row.querySelector('.status-cell');
            const arnumber = row.dataset.arnumber;

            statusCell.innerHTML = `<span style="color:#e67e22">${t('status_fetching')}</span>`;
            row.style.background = '#fff3cd';

            const finalPath = folder ? `${folder}/${filename}` : filename;

            try {
                // 执行下载并进行字节校验
                await downloadPdfAndValidate(url, filename, folder, (status) => {
                    statusCell.innerHTML = `<span style="color:#e67e22">${status}</span>`;
                });

                statusCell.innerHTML = `<span style="color:#28a745">${t('status_done')}</span>`;
                row.style.background = '#d4edda';
                cb.checked = false;

                let q = GM_getValue('resumeQueue', []);
                q = q.filter(id => id !== arnumber);
                GM_setValue('resumeQueue', q);

                batchCount++;

                // 随机延迟
                if (i < selected.length - 1 && isRunning) {
                    const waitTime = getRandomInt(minDelay, maxDelay);
                    const endTime = Date.now() + waitTime;

                    if (uiTimer) clearInterval(uiTimer);
                    uiTimer = setInterval(() => {
                        if (!isRunning) { clearInterval(uiTimer); return; }
                        const left = Math.ceil((endTime - Date.now()) / 1000);
                        if (left <= 0) { clearInterval(uiTimer); return; }
                        createLoading(t('msg_progress', {done: batchCount, total: selected.length, name: filename.substring(0, 20), sec: left}), 0);
                    }, 500);

                    await delay(waitTime);
                    clearInterval(uiTimer);
                    hideLoading();
                }

            } catch (e) {
                console.error(e);
                // 4. 熔断触发 - 强力清灰
                if (e.type === 'BLOCKED') {
                    statusCell.innerHTML = `<span style="color:red">${t('status_blocked')}</span>`;

                    // 显示清洗提示
                    createLoading(t('msg_blocked_fix'), 0);

                    // ⚠️ 执行定向数据清洗 ⚠️
                    clearIEEESession();

                    await delay(2000);
                    window.location.reload();
                    return;
                } else {
                    statusCell.innerHTML = `<span style="color:red">${t('status_failed')}</span>`;
                }
            }
        }

        if (isRunning) {
            hideLoading();
            createLoading(t('msg_all_done'), 3000);
            GM_setValue('isAutoRun', false);
            isRunning = false;
            updateStartBtn();
        }
    }

    function selectAll() {
        const checkboxes = document.querySelectorAll('.selectItem');
        checkboxes.forEach(cb => {
            cb.checked = true;
            updateRowStatus(cb);
        });
        updateStartBtn();
        if(checkboxes.length > 0) lastChecked = checkboxes[checkboxes.length - 1];
    }

    function deselectAll() {
        const checkboxes = document.querySelectorAll('.selectItem');
        checkboxes.forEach(cb => {
            cb.checked = false;
            updateRowStatus(cb);
        });
        updateStartBtn();
        lastChecked = null;
    }

    function updateStartBtn() {
        const count = document.querySelectorAll('.selectItem:checked').length;
        const btn = document.getElementById('btn-start');
        if(btn) btn.innerHTML = `${t('btn_start')} (${count})`;
    }

    // === 启动检测 ===
    function init() {
        if (GM_getValue('isAutoRun', false)) {
            const q = GM_getValue('resumeQueue', []);
            if (q.length > 0) {
                createLoading(t('msg_waiting_load'), 0);

                const forceCheck = setInterval(() => {
                    const isList = document.querySelector(SELECTORS.resultItem);
                    const isDetail = window.location.href.includes('/document/');

                    if (isList || isDetail) {
                        clearInterval(forceCheck);
                        hideLoading();
                        if(!document.getElementById('popup')) createPopup(true);
                    }
                }, 500);
            } else {
                GM_setValue('isAutoRun', false);
            }
        }

        setInterval(() => {
             const isList = document.querySelector(SELECTORS.resultItem);
             const isDetail = window.location.href.includes('/document/');

             if ((isList || isDetail) && !document.getElementById('diy-btn-float')) {
                 createPopupButton();
             }
        }, 1000);
    }

    window.addEventListener('load', init);
    setTimeout(init, 2000);
})();
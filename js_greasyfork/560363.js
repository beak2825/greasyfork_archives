// ==UserScript==
// @name         IEEE Batch Downloader
// @namespace    https://greasyfork.org/zh-CN/users/236397-hust-hzb
// @version      2.0
// @description  IEEE文献批量下载器 2.0 - 实时数字进度/支持子文件夹/文件名修复/自动特权清灰 (Chrome+Edge)
// @description:en IEEE Batch Downloader 2.0 - Real-time progress/Sub-folder support/Filename fix/Auto-nuke cookies (Chrome+Edge)
// @author       HUST Huangzhenbin & 编码助手
// @license      MIT
// @match        *://ieeexplore.ieee.org/*
// @icon         https://ieeexplore.ieee.org/assets/img/favicon.ico
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560363/IEEE%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560363/IEEE%20Batch%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 🌐 多语言配置 (I18N) ===
    const USER_LANG = navigator.language.startsWith('zh') ? 'zh' : 'en';

    const I18N = {
        zh: {
            btn_main: '📥 批量导出',
            title_main: 'IEEE 批量下载助手 v2.0',
            folder_label: '📂 归档文件夹',
            format_label: '📝 命名格式',
            refresh_label: '🔄 刷新阈值(篇)',
            delay_label: '⏳ 随机延迟(ms)',
            fmt_year_title: '年份_标题.pdf',
            fmt_title: '仅标题.pdf',
            btn_start: '开始下载',
            btn_stop: '停止任务',
            btn_select_all: '全选',
            btn_deselect_all: '清空',
            btn_refresh_list: '重获列表',
            btn_close: '最小化',
            table_idx: '#',
            table_title: '年份 / 论文标题 / 进度',
            status_pending: '待下载',
            status_downloading: '0%',
            status_validating: '写入中...',
            status_retrying: '修复Token...',
            status_done: '完成',
            status_failed: '失败',
            status_no_pdf: '🚫 无资源',
            status_wait: '---',
            alert_config_title: '⚙️ 关键配置检查',
            alert_config_msg: '如果要自动创建文件夹，请务必将油猴设置中的<b>下载模式</b>改为 <b>Browser API</b>。',
            msg_scan_result: '扫描完成：共发现 {total} 条，其中 {valid} 条可下载。',
            msg_no_paper: '未检测到论文，请点击“重获列表”或等待页面加载...',
            msg_stopped: '已停止任务',
            msg_blocked_fix: '☢️ 检测到下载拦截，正在通过特权API清除Cookie...',
            msg_token_updated: 'Token 刷新成功',
            msg_all_done: '🎉 所有任务已完成！',
            msg_progress: '进度: {done}/{total} | 当前: {name}... | 等待: {sec}s',
            tag_current_page: '详情页',
            author_by: 'Designed by'
        },
        en: {
            btn_main: '📥 Batch Export',
            title_main: 'IEEE Batch Downloader v2.0',
            folder_label: '📂 Save Folder',
            format_label: '📝 Filename Format',
            refresh_label: '🔄 Refresh Rate',
            delay_label: '⏳ Random Delay(ms)',
            fmt_year_title: 'Year_Title.pdf',
            fmt_title: 'Title_Only.pdf',
            btn_start: 'Start',
            btn_stop: 'Stop',
            btn_select_all: 'All',
            btn_deselect_all: 'None',
            btn_refresh_list: 'Reload List',
            btn_close: 'Minimize',
            table_idx: '#',
            table_title: 'Year / Title / Progress',
            status_pending: 'Pending',
            status_downloading: '0%',
            status_validating: 'Saving...',
            status_retrying: 'Fixing Token...',
            status_done: 'Done',
            status_failed: 'Failed',
            status_no_pdf: '🚫 No PDF',
            status_wait: '---',
            alert_config_title: '⚙️ Configuration Check',
            alert_config_msg: 'To create folders, please set Tampermonkey <b>Download Mode</b> to <b>Browser API</b>.',
            msg_scan_result: 'Scan result: {total} found, {valid} downloadable.',
            msg_no_paper: 'No papers found. Click "Reload List" or wait for page load.',
            msg_stopped: 'Task Stopped',
            msg_blocked_fix: '☢️ Block detected. Nuking cookies via privileged API...',
            msg_token_updated: 'Token Updated',
            msg_all_done: '🎉 All tasks completed!',
            msg_progress: 'Progress: {done}/{total} | File: {name}... | Wait: {sec}s',
            tag_current_page: 'Detail Page',
            author_by: 'Designed by'
        }
    };

    function t(key, params = {}) {
        let str = I18N[USER_LANG][key] || I18N['en'][key] || key;
        for (let k in params) {
            str = str.replace(`{${k}}`, params[k]);
        }
        return str;
    }

    // === 核心配置 (v2.0 极速版参数) ===
    const DEFAULT_FOLDER = "IEEE_Downloads";
    const DEFAULT_MIN_DELAY = 200;  // ⚡ 极速：200ms
    const DEFAULT_MAX_DELAY = 500;  // ⚡ 极速：500ms
    const DEFAULT_REFRESH_RATE = 3; // 🔄 阈值：3篇
    const DEFAULT_FORMAT = "year_title";

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

    // --- 💎 UI 样式 ---
    const css = `
        :root {
            --ieee-blue: #00629B;
            --ieee-dark: #004a75;
            --success-green: #28a745;
            --danger-red: #dc3545;
            --warning-orange: #f57c00;
            --disabled-gray: #e0e0e0;
            --text-disabled: #999;
            --bg-gray: #f8f9fa;
            --border-radius: 8px;
            --shadow-float: 0 4px 15px rgba(0, 98, 155, 0.3);
            --shadow-card: 0 10px 40px rgba(0,0,0,0.15);
        }
        #diy-btn-float {
            position: fixed; right: 30px; bottom: 80px; 
            z-index: 2147483647 !important; 
            padding: 12px 24px; background: linear-gradient(135deg, var(--ieee-blue), var(--ieee-dark));
            color: #fff; border: none; border-radius: 50px; font-family: sans-serif; font-weight: 600;
            box-shadow: var(--shadow-float); cursor: pointer; transition: all 0.3s ease;
            display: block !important;
        }
        #diy-btn-float:hover { transform: translateY(-3px) scale(1.02); }
        
        .diy-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(3px);
            z-index: 2147483647; display: flex; justify-content: center; align-items: center;
            opacity: 0; animation: diyFadeIn 0.3s forwards;
        }
        .diy-box {
            width: 900px; height: 85%; max-height: 800px; background: #fff; border-radius: 12px;
            box-shadow: var(--shadow-card); display: flex; flex-direction: column; overflow: hidden;
            font-family: 'Segoe UI', Roboto, sans-serif; transform: scale(0.95); animation: diyPopIn 0.3s forwards;
        }
        .diy-header { padding: 15px 25px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .diy-title { font-size: 18px; font-weight: 700; color: var(--ieee-blue); display: flex; align-items: center; gap: 10px; }
        .diy-close { background: none; border: none; font-size: 24px; color: #999; cursor: pointer; }
        .diy-close:hover { color: var(--danger-red); }
        .diy-body { flex: 1; padding: 20px 25px; display: flex; flex-direction: column; gap: 15px; overflow: hidden; background: var(--bg-gray); }
        
        .diy-info-bar { font-size: 12px; color: #666; background: #eee; padding: 8px 12px; border-radius: 4px; margin-bottom: 5px; border-left: 4px solid #999; }

        .diy-controls {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            background: #fff; padding: 15px; border-radius: var(--border-radius); box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .diy-input-group { display: flex; flex-direction: column; gap: 6px; }
        .diy-input-group.wide { grid-column: span 2; }
        
        .diy-label { font-size: 11px; font-weight: 700; color: #777; letter-spacing: 0.5px; text-transform: uppercase; }
        .diy-input { padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .diy-input:focus { border-color: var(--ieee-blue); }
        
        .diy-actions { display: flex; gap: 10px; }
        .diy-btn { padding: 10px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; color: #fff; flex: 1; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; }
        .diy-btn:hover { opacity: 0.9; }
        .btn-primary { background: var(--ieee-blue); flex: 2; }
        .btn-danger { background: var(--danger-red); }
        .btn-secondary { background: #fff; color: #555; border: 1px solid #ddd; }

        .diy-table-container { flex: 1; background: #fff; border-radius: var(--border-radius); border: 1px solid #eee; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #fff; padding: 12px 15px; text-align: left; font-size: 12px; font-weight: 700; color: #555; position: sticky; top: 0; z-index: 10; border-bottom: 2px solid #eee; }
        td { padding: 10px 15px; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #333; vertical-align: middle; transition: background 0.3s; }
        
        tr.row-pending { background-color: #fff; }
        tr.row-downloading { background-color: #fffde7; }
        tr.row-validating { background-color: #e3f2fd; }
        tr.row-success { background-color: #e8f5e9; }
        tr.row-failed { background-color: #ffebee; }
        tr.row-skipped { background-color: #f5f5f5; color: #aaa; }
        tr.row-skipped td { color: #aaa; }
        tr:hover { filter: brightness(0.98); }
        
        /* 进度条 Badge 样式 */
        .badge { 
            display: inline-block; padding: 4px 10px; border-radius: 12px; 
            font-size: 11px; font-weight: 700; min-width: 70px; text-align: center;
            transition: none; /* 关键：移除过渡以实现实时数字跳动 */
            border: 1px solid transparent;
        }
        .badge-pending { background: #eee; color: #777; }
        
        /* 动态进度条背景 */
        .badge-progress {
            background-image: linear-gradient(90deg, #a5d6a7 var(--pct, 0%), #fff3e0 var(--pct, 0%));
            color: #2e7d32; 
            border: 1px solid #a5d6a7;
        }
        
        .badge-validating { background: #e3f2fd; color: var(--ieee-blue); border: 1px solid #90caf9; }
        .badge-retrying { background: #fff3cd; color: #856404; animation: pulse 1s infinite; border: 1px solid #ffe082; }
        .badge-done { background: #c8e6c9; color: #2e7d32; border: 1px solid #a5d6a7; }
        .badge-failed { background: #ffcdd2; color: #c62828; border: 1px solid #ef9a9a; }
        .badge-skipped { background: #e0e0e0; color: #777; border: 1px solid #ccc; cursor: not-allowed; }

        .tag-year { font-weight: bold; color: #555; background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 12px; }

        .diy-footer { padding: 10px 25px; background: #fff; border-top: 1px solid #eee; font-size: 12px; color: #999; display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
        .diy-author-link { color: var(--ieee-blue); text-decoration: none; font-weight: 600; }
        #diy-loading { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: #fff; padding: 15px 25px; border-radius: 8px; z-index: 2147483647; display: none; text-align: center; }
        
        @keyframes diyFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes diyPopIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
    `;

    function loadCss(code) {
        const style = document.createElement('style');
        style.textContent = code;
        document.head.appendChild(style);
    }
    loadCss(css);

    // --- 辅助函数 ---
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

    function sanitizeFilename(name) {
        return (name || "Unknown").replace(/[\/\\:*?"<>|]/g, '_').replace(/[\t\n\r]/g, '').replace(/\s+/g, ' ').trim();
    }

    function getArnumber(url) {
        if(!url) return null;
        const match = url.match(/arnumber=(\d+)/) || url.match(/\/document\/(\d+)/);
        return match ? match[1] : null;
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    // --- 业务逻辑 ---
    function createPopupButton() {
        if (document.getElementById('diy-btn-float')) return;
        const btn = document.createElement('button');
        btn.id = 'diy-btn-float';
        btn.innerHTML = `<span>${t('btn_main')}</span>`;
        btn.onclick = () => {
            const popup = document.getElementById('popup');
            if (popup) {
                popup.style.display = 'flex';
            } else {
                createPopup();
            }
        };
        document.body.appendChild(btn);
    }

    async function nukeCookiesViaPrivilege() {
        console.log("☢️ [Privilege] Nuking Cookies...");
        if (typeof GM_cookie === 'undefined') {
            try { localStorage.clear(); sessionStorage.clear(); } catch(e) {}
            return;
        }
        return new Promise((resolve) => {
            GM_cookie.list({ url: 'https://ieeexplore.ieee.org/' }, (cookies, error) => {
                if (!cookies || error) { resolve(); return; }
                let pending = cookies.length;
                if(pending === 0) resolve();
                cookies.forEach(c => {
                    GM_cookie.delete({ url: 'https://ieeexplore.ieee.org/', name: c.name }, () => {
                        if(--pending <= 0) resolve();
                    });
                });
            });
        });
    }

    async function refreshSessionViaIframe() {
        return new Promise((resolve) => {
            const iframeId = 'ieee-refresh-iframe';
            let iframe = document.getElementById(iframeId);
            if (iframe) document.body.removeChild(iframe);

            iframe = document.createElement('iframe');
            iframe.id = iframeId;
            iframe.style.display = 'none';
            iframe.src = window.location.href + (window.location.href.includes('?') ? '&' : '?') + '_t=' + Date.now();

            iframe.onload = () => {
                setTimeout(() => { if(iframe.parentNode) document.body.removeChild(iframe); resolve(true); }, 1000);
            };
            iframe.onerror = () => resolve(false);
            document.body.appendChild(iframe);
        });
    }

    // UI 构建
    function createPopup() {
        if (document.getElementById('popup')) return;

        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.className = 'diy-overlay';

        const content = document.createElement('div');
        content.className = 'diy-box';

        const savedMin = GM_getValue('savedMinDelay', DEFAULT_MIN_DELAY);
        const savedMax = GM_getValue('savedMaxDelay', DEFAULT_MAX_DELAY);
        const savedFormat = GM_getValue('savedFormat', DEFAULT_FORMAT);

        content.innerHTML = `
            <div class="diy-header">
                <div class="diy-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    ${t('title_main')}
                </div>
                <button id="btn-close" class="diy-close">&times;</button>
            </div>
            <div class="diy-body">
                <div id="diy-scan-info" class="diy-info-bar"></div>
                <div class="diy-controls">
                    <div class="diy-input-group wide">
                        <span class="diy-label">${t('folder_label')}</span>
                        <input type="text" id="folder-input" class="diy-input" value="${GM_getValue('savedFolder', DEFAULT_FOLDER)}">
                    </div>
                    <div class="diy-input-group wide">
                        <span class="diy-label">${t('format_label')}</span>
                        <select id="format-select" class="diy-input">
                            <option value="year_title" ${savedFormat === 'year_title' ? 'selected' : ''}>${t('fmt_year_title')}</option>
                            <option value="title" ${savedFormat === 'title' ? 'selected' : ''}>${t('fmt_title')}</option>
                        </select>
                    </div>
                    <div class="diy-input-group">
                        <span class="diy-label">${t('refresh_label')}</span>
                        <input type="number" id="refresh-rate-input" class="diy-input" value="${GM_getValue('savedRefreshRate', DEFAULT_REFRESH_RATE)}" min="1">
                    </div>
                    <div class="diy-input-group">
                        <span class="diy-label">${t('delay_label')} (Min)</span>
                        <input type="number" id="min-delay-input" class="diy-input" value="${savedMin}">
                    </div>
                    <div class="diy-input-group">
                        <span class="diy-label">${t('delay_label')} (Max)</span>
                        <input type="number" id="max-delay-input" class="diy-input" value="${savedMax}">
                    </div>
                    <div class="diy-input-group" style="display:flex; justify-content:flex-end; align-items:flex-end;"></div>
                </div>
                <div class="diy-actions">
                    <button id="btn-start" class="diy-btn btn-primary">${t('btn_start')}</button>
                    <button id="btn-stop" class="diy-btn btn-danger">${t('btn_stop')}</button>
                    <button id="btn-all" class="diy-btn btn-secondary">${t('btn_select_all')}</button>
                    <button id="btn-none" class="diy-btn btn-secondary">${t('btn_deselect_all')}</button>
                    <button id="btn-refresh" class="diy-btn btn-secondary">${t('btn_refresh_list')}</button>
                </div>
                <div class="diy-table-container">
                    <table id="my-table">
                        <thead>
                            <tr>
                                <th style="width:40px">✔</th>
                                <th style="width:40px">${t('table_idx')}</th>
                                <th>${t('table_title')}</th>
                                <th style="width:120px;text-align:center">Progress</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
            <div class="diy-footer">
                <span>${t('author_by')}</span>
                <a href="${AUTHOR_INFO.orcid}" target="_blank" class="diy-author-link">${AUTHOR_INFO.name}</a>
            </div>
        `;

        popup.appendChild(content);
        document.body.appendChild(popup);

        document.getElementById('btn-close').onclick = () => { document.getElementById('popup').style.display = 'none'; };
        document.getElementById('btn-stop').onclick = stopDownloadAndClear;
        document.getElementById('btn-all').onclick = selectAll;
        document.getElementById('btn-none').onclick = deselectAll;
        document.getElementById('btn-refresh').onclick = () => getLinksFromCurrentPage();
        document.getElementById('btn-start').onclick = downloadSelected;
        document.getElementById('format-select').onchange = (e) => GM_setValue('savedFormat', e.target.value);

        getLinksFromCurrentPage();
    }

    function getLinksFromCurrentPage() {
        const tableBody = document.querySelector('#my-table tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        lastChecked = null;

        const isDetailPage = window.location.href.includes('/document/');
        let items = [];

        const extractYear = (text) => {
            const match = text.match(/20\d{2}|19\d{2}/);
            return match ? match[0] : "0000";
        };

        if (isDetailPage) {
            const titleEl = document.querySelector(SELECTORS.docTitle);
            const urlMatch = window.location.href.match(/\/document\/(\d+)/);
            let year = "0000";
            const dateEl = document.querySelector('.doc-layout-pub-date, .u-pb-1, .doc-abstract-pubdate');
            if (dateEl) year = extractYear(dateEl.textContent);

            if (titleEl && urlMatch) {
                items.push({ title: titleEl.textContent.trim(), arnumber: urlMatch[1], type: 'detail', year: year, valid: true });
            }
        } else {
            // ⚡ 强力抓取 + 去重
            let resultElements = document.querySelectorAll('xpl-results-item');
            if (resultElements.length === 0) {
                resultElements = document.querySelectorAll('.List-results-items .result-item');
            }

            resultElements.forEach(el => {
                const titleEl = el.querySelector(SELECTORS.listTitle);
                const pdfEl = el.querySelector(SELECTORS.listPdfLink);
                let year = "0000";
                const textContent = el.textContent || "";
                const yearMatch = textContent.match(/Year:\s*(\d{4})/);
                if (yearMatch) year = yearMatch[1];

                if (titleEl) {
                    const title = titleEl.textContent.trim();
                    let arnumber = null;
                    if (pdfEl) {
                        arnumber = getArnumber(pdfEl.href);
                    } 
                    if (!arnumber) {
                        const titleLink = titleEl.getAttribute('href');
                        if (titleLink) arnumber = getArnumber(titleLink);
                    }

                    if (arnumber) {
                        items.push({ title: title, arnumber: arnumber, type: 'list', year: year, valid: true });
                    } else {
                        items.push({ title: title, arnumber: null, type: 'list', year: year, valid: false });
                    }
                }
            });
        }

        const validCount = items.filter(i => i.valid).length;
        const totalCount = items.length;
        
        const infoBar = document.getElementById('diy-scan-info');
        if (infoBar) {
            infoBar.innerHTML = t('msg_scan_result', { total: totalCount, valid: validCount, invalid: totalCount - validCount });
        }

        if (items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:#888;">${t('msg_no_paper')}</td></tr>`;
            return;
        }

        items.forEach((item, index) => {
            const row = tableBody.insertRow();
            
            const cleanTitle = sanitizeFilename(item.title);
            row.dataset.cleanTitle = cleanTitle;
            row.dataset.year = item.year;

            if (item.valid) {
                const directDownloadLink = `https://ieeexplore.ieee.org/stampPDF/getPDF.jsp?tp=&arnumber=${item.arnumber}`;
                row.dataset.arnumber = item.arnumber;
                row.dataset.url = directDownloadLink;
                row.className = 'row-pending';

                row.innerHTML = `
                    <td style="text-align:center"><input type="checkbox" class="selectItem" checked></td>
                    <td style="text-align:center;color:#999">${index + 1}</td>
                    <td>
                        <span class="tag-year">${item.year}</span>
                        <span style="font-weight:600;color:#333;margin-left:5px">${item.title}</span>
                        ${item.type === 'detail' ? `<span style="font-size:10px;background:#eee;padding:1px 4px;border-radius:3px;color:#666">${t('tag_current_page')}</span>` : ''}
                    </td>
                    <td class="status-cell" style="text-align:center">
                        <span class="badge badge-pending">${t('status_pending')}</span>
                    </td>
                `;
            } else {
                row.className = 'row-skipped';
                row.innerHTML = `
                    <td style="text-align:center"><input type="checkbox" disabled></td>
                    <td style="text-align:center;color:#ccc">${index + 1}</td>
                    <td style="color:#aaa">
                        <span class="tag-year" style="color:#aaa;background:#f0f0f0">${item.year}</span>
                        <span style="margin-left:5px">${item.title}</span>
                    </td>
                    <td class="status-cell" style="text-align:center">
                        <span class="badge badge-skipped">${t('status_no_pdf')}</span>
                    </td>
                `;
            }

            const checkbox = row.querySelector('.selectItem');
            if (checkbox && !checkbox.disabled) {
                checkbox.addEventListener('click', function(e) {
                    if (e.shiftKey && lastChecked) {
                        const allChecks = Array.from(document.querySelectorAll('.selectItem:not([disabled])'));
                        const start = allChecks.indexOf(this);
                        const end = allChecks.indexOf(lastChecked);
                        if (start !== -1 && end !== -1) {
                            const low = Math.min(start, end);
                            const high = Math.max(start, end);
                            for (let i = low; i <= high; i++) {
                                allChecks[i].checked = this.checked;
                            }
                        }
                    }
                    lastChecked = this;
                    updateStartBtn();
                });
            }
        });
        updateStartBtn();
    }

    function stopDownloadAndClear() {
        isRunning = false;
        hideLoading();
        createLoading(t('msg_stopped'), 1500);
    }

    // 🔥 核心逻辑：双工下载 (Fetch监控进度 + GM_download保存)
    async function downloadPdfCycle(url, filename, folder, statusCell, row) {
        let attempts = 0;
        const maxAttempts = 3; 

        while (attempts < maxAttempts && isRunning) {
            try {
                // 1. Fetch 数据流 (用于监控进度)
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const reader = response.body.getReader();
                const contentLength = +response.headers.get('Content-Length');
                let receivedLength = 0;
                let chunks = [];

                row.className = 'row-downloading';
                const badge = statusCell.querySelector('.badge');
                badge.className = 'badge badge-progress';

                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    receivedLength += value.length;
                    
                    // ✨ 实时更新百分比
                    if (contentLength) {
                        const pct = Math.floor((receivedLength / contentLength) * 100);
                        badge.innerText = `${pct}%`;
                        badge.style.setProperty('--pct', `${pct}%`);
                    } else {
                        badge.innerText = `${(receivedLength / 1024).toFixed(0)}KB`;
                    }
                }

                // 2. 组装 Blob
                const blob = new Blob(chunks, { type: 'application/pdf' });
                const headerText = await blob.slice(0, 5).text();
                
                if (headerText.startsWith('%PDF')) {
                    // 3. 校验通过，交给 GM_download 保存 (支持文件夹)
                    const blobUrl = URL.createObjectURL(blob);
                    // ⚡ 拼接路径
                    const finalPath = folder ? `${folder}/${filename}` : filename;
                    
                    statusCell.innerHTML = `<span class="badge badge-validating">${t('status_validating')}</span>`;
                    
                    await new Promise((resolve, reject) => {
                        GM_download({
                            url: blobUrl, 
                            name: finalPath, 
                            saveAs: false, 
                            conflictAction: 'overwrite',
                            onload: () => { URL.revokeObjectURL(blobUrl); resolve(); },
                            onerror: (e) => { URL.revokeObjectURL(blobUrl); reject(e); }
                        });
                    });
                    return true;
                } else {
                    console.warn(`[Block] HTML detected. Attempting repair...`);
                    row.className = 'row-failed';
                    statusCell.innerHTML = `<span class="badge badge-retrying">${t('status_retrying')}</span>`;
                    await nukeCookiesViaPrivilege();
                    await refreshSessionViaIframe();
                    await delay(3000);
                    attempts++;
                }
            } catch (e) {
                console.error("Error:", e);
                await delay(2000);
                attempts++;
            }
        }
        throw new Error("Max retries exceeded");
    }

    async function downloadSelected() {
        if (isRunning) return;

        const selected = document.querySelectorAll('.selectItem:checked');
        if (selected.length === 0) return;

        isRunning = true;
        const folder = document.getElementById('folder-input').value.trim();
        const minDelay = parseInt(document.getElementById('min-delay-input').value) || 2000;
        const maxDelay = parseInt(document.getElementById('max-delay-input').value) || 5000;
        const refreshRate = parseInt(document.getElementById('refresh-rate-input').value) || 5;
        const nameFormat = document.getElementById('format-select').value; 

        GM_setValue('savedFolder', folder);
        GM_setValue('savedMinDelay', minDelay);
        GM_setValue('savedMaxDelay', maxDelay);
        GM_setValue('savedRefreshRate', refreshRate);
        GM_setValue('savedFormat', nameFormat);

        let batchCount = 0;

        for (let i = 0; i < selected.length; i++) {
            if (!isRunning) break;

            const cb = selected[i];
            const row = cb.closest('tr');
            const url = row.dataset.url;
            const statusCell = row.querySelector('.status-cell');

            let filename = `${row.dataset.cleanTitle}.pdf`;
            if (nameFormat === 'year_title') {
                filename = `${row.dataset.year}_${row.dataset.cleanTitle}.pdf`;
            }

            try {
                await downloadPdfCycle(url, filename, folder, statusCell, row);

                row.className = 'row-success';
                statusCell.innerHTML = `<span class="badge badge-done">${t('status_done')}</span>`;
                cb.checked = false;
                batchCount++;

                if (i < selected.length - 1 && isRunning) {
                    const waitTime = getRandomInt(minDelay, maxDelay);
                    const endTime = Date.now() + waitTime;
                    if (uiTimer) clearInterval(uiTimer);
                    uiTimer = setInterval(() => {
                        if (!isRunning) { clearInterval(uiTimer); return; }
                        const left = Math.ceil((endTime - Date.now()) / 1000);
                        if (left <= 0) { clearInterval(uiTimer); return; }
                        createLoading(t('msg_progress', {done: batchCount, total: selected.length, name: filename.substring(0, 15), sec: left}), 0);
                    }, 500);
                    await delay(waitTime);
                    clearInterval(uiTimer);
                    hideLoading();
                }

            } catch (e) {
                console.error(e);
                row.className = 'row-failed';
                statusCell.innerHTML = `<span class="badge badge-failed">${t('status_failed')}</span>`;
            }
        }

        if (isRunning) {
            hideLoading();
            createLoading(t('msg_all_done'), 3000);
            isRunning = false;
            updateStartBtn();
        }
    }

    function selectAll() {
        const checkboxes = document.querySelectorAll('.selectItem:not([disabled])');
        checkboxes.forEach(cb => { cb.checked = true; });
        updateStartBtn();
    }

    function deselectAll() {
        const checkboxes = document.querySelectorAll('.selectItem');
        checkboxes.forEach(cb => { cb.checked = false; });
        updateStartBtn();
    }

    function updateStartBtn() {
        const count = document.querySelectorAll('.selectItem:checked').length;
        const btn = document.getElementById('btn-start');
        if(btn) btn.innerHTML = `${t('btn_start')} (${count})`;
    }

    // --- 强制按钮显示 ---
    function init() {
        if (window.self !== window.top) return;

        const checkAndInject = () => {
            if (!document.getElementById('diy-btn-float')) {
                createPopupButton();
            }
        };

        checkAndInject();
        setInterval(checkAndInject, 500);
    }

    window.addEventListener('load', init);
    setTimeout(init, 1000);
})();
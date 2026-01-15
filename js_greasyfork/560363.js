// ==UserScript==
// @name         IEEE Batch Downloader
// @namespace    https://greasyfork.org/zh-CN/users/236397-hust-hzb
// @version      2.30
// @description  IEEE文献批量下载器 (终极修复版) - 融合自动日期/高并发/智能嗅探/Token自我修复
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
            title_main: 'IEEE 批量下载助手 v2.30',
            folder_label: '📂 归档文件夹',
            format_label: '📝 命名格式 (控制日期显示)',
            refresh_label: '🔄 刷新阈值(篇)',
            delay_label: '⏳ 随机延迟(ms)',
            fmt_year_title: '年份_标题 (2025_Title)',
            fmt_year_month_title: '年月_标题 (202511_Title)',
            fmt_date_title: '年月日_标题 (20251104_Title)',
            fmt_title: '仅标题 (Title)',
            btn_start: '开始下载',
            btn_fetch_dates: '🚀 重新获取日期',
            btn_stop: '停止任务',
            btn_select_all: '全选',
            btn_deselect_all: '清空',
            btn_refresh_list: '重获列表',
            btn_close: '最小化',
            table_idx: '#',
            table_title: '论文标题 (日期跟随格式)',
            table_state: '状态',
            status_pending: '待下载',
            status_analyzing: '⚡ 获取中...',
            status_deep_scan: '🕵️ 提取真链...',
            status_downloading: '0%',
            status_validating: '写入中...',
            status_date_ok: '日期更新',
            status_done: '完成',
            status_failed: '失败',
            status_retrying: '🛠️ 修复Token...', // v2.0 回归
            status_no_access: '🚫 无权限',
            status_no_pdf: '🚫 无资源',
            msg_scan_result: '扫描完成：共发现 {total} 条 (已去重)，{valid} 条可下载。正在自动获取日期...',
            msg_no_paper: '未检测到论文，请点击“重获列表”或等待页面加载...',
            msg_stopped: '已停止任务',
            msg_all_done: '🎉 所有任务已完成！',
            msg_date_done: '✅ 日期自动获取完成！',
            msg_progress: '进度: {done}/{total} | 当前: {name}... | 等待: {sec}s',
            tag_current_page: '详情页',
            author_by: 'Designed by'
        },
        en: {
            btn_main: '📥 Batch Export',
            title_main: 'IEEE Batch Downloader v2.30',
            folder_label: '📂 Save Folder',
            format_label: '📝 Filename Format (Controls UI)',
            refresh_label: '🔄 Refresh Rate',
            delay_label: '⏳ Random Delay(ms)',
            fmt_year_title: 'Year_Title (2025_Title)',
            fmt_year_month_title: 'YearMonth_Title (202511_Title)',
            fmt_date_title: 'YearMonthDay_Title (20251104_Title)',
            fmt_title: 'Title_Only (Title)',
            btn_start: 'Start',
            btn_fetch_dates: '🚀 Refetch Dates',
            btn_stop: 'Stop',
            btn_select_all: 'All',
            btn_deselect_all: 'None',
            btn_refresh_list: 'Reload List',
            btn_close: 'Minimize',
            table_idx: '#',
            table_title: 'Paper Title (Date follows format)',
            table_state: 'State',
            status_pending: 'Pending',
            status_analyzing: '⚡ Fetching...',
            status_deep_scan: '🕵️ Extracting...',
            status_downloading: '0%',
            status_validating: 'Saving...',
            status_date_ok: 'Date Updated',
            status_done: 'Done',
            status_failed: 'Failed',
            status_retrying: '🛠️ Fixing Token...', // v2.0 Return
            status_no_access: '🚫 No Access',
            status_no_pdf: '🚫 No PDF',
            msg_scan_result: 'Scan result: {total} unique found, {valid} downloadable. Auto-fetching dates...',
            msg_no_paper: 'No papers found. Click "Reload List" or wait for page load.',
            msg_stopped: 'Task Stopped',
            msg_all_done: '🎉 All tasks completed!',
            msg_date_done: '✅ Auto-fetch completed!',
            msg_progress: 'Progress: {done}/{total} | File: {name}... | Wait: {sec}s',
            tag_current_page: 'Detail Page',
            author_by: 'Designed by'
        }
    };

    function t(key, params = {}) {
        let str = I18N[USER_LANG][key] || I18N['en'][key] || key;
        for (let k in params) str = str.replace(`{${k}}`, params[k]);
        return str;
    }

    // === 核心配置 ===
    const DEFAULT_FOLDER = "IEEE_Downloads";
    const DEFAULT_MIN_DELAY = 200;
    const DEFAULT_MAX_DELAY = 500;
    const DEFAULT_REFRESH_RATE = 3;
    const DEFAULT_FORMAT = "date_title";
    const CONCURRENCY_LIMIT = 10;
    const AUTHOR_INFO = { name: "Huangzhenbin", orcid: "https://orcid.org/0000-0002-0628-0387" };

    const SELECTORS = {
        resultItem: 'xpl-results-item, .List-results-items .result-item',
        listTitle: 'h3.text-md-md-lh, h2 a',
        listPdfLink: 'a.pdf, a[href*="stamp.jsp"]',
        docTitle: 'h1.document-title, h1.display-title',
        pubInfo: '.publisher-info-container, .description, .result-item-align'
    };

    let isRunning = false;
    let uiTimer = null;
    let lastChecked = null;
    let scannedItems = [];

    // --- 💎 UI 样式 ---
    const css = `
        :root { --ieee-blue: #00629B; --ieee-dark: #004a75; --success-green: #28a745; --danger-red: #dc3545; --bg-gray: #f8f9fa; --border-radius: 8px; }
        #diy-btn-float { position: fixed; right: 30px; bottom: 80px; z-index: 2147483647; padding: 12px 24px; background: linear-gradient(135deg, var(--ieee-blue), var(--ieee-dark)); color: #fff; border: none; border-radius: 50px; font-weight: 600; box-shadow: 0 4px 15px rgba(0, 98, 155, 0.3); cursor: pointer; transition: all 0.3s ease; }
        #diy-btn-float:hover { transform: translateY(-3px) scale(1.02); }
        .diy-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(3px); z-index: 2147483647; display: flex; justify-content: center; align-items: center; display: none; }
        .diy-box { width: 900px; height: 85%; max-height: 800px; background: #fff; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; font-family: 'Segoe UI', Roboto, sans-serif; }
        .diy-header { padding: 15px 25px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .diy-title { font-size: 18px; font-weight: 700; color: var(--ieee-blue); }
        .diy-close { background: none; border: none; font-size: 24px; color: #999; cursor: pointer; }
        .diy-body { flex: 1; padding: 20px 25px; display: flex; flex-direction: column; gap: 15px; overflow: hidden; background: var(--bg-gray); }
        .diy-info-bar { font-size: 12px; color: #666; background: #eee; padding: 8px 12px; border-radius: 4px; border-left: 4px solid #999; }
        .diy-controls { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; background: #fff; padding: 15px; border-radius: var(--border-radius); }
        .diy-input-group { display: flex; flex-direction: column; gap: 6px; }
        .diy-input-group.wide { grid-column: span 2; }
        .diy-label { font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; }
        .diy-input { padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; width: 100%; box-sizing: border-box; }
        .diy-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .diy-btn { padding: 10px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; color: #fff; flex: 1; display: flex; align-items: center; justify-content: center; min-width: 80px;}
        .btn-primary { background: var(--ieee-blue); flex-grow: 2; }
        .btn-danger { background: var(--danger-red); }
        .btn-secondary { background: #fff; color: #555; border: 1px solid #ddd; }
        .diy-table-container { flex: 1; background: #fff; border-radius: var(--border-radius); border: 1px solid #eee; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #fff; padding: 12px 15px; text-align: left; font-size: 12px; font-weight: 700; color: #555; position: sticky; top: 0; z-index: 10; border-bottom: 2px solid #eee; }
        td { padding: 10px 15px; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #333; vertical-align: middle; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; min-width: 70px; text-align: center; }
        .badge-pending { background: #eee; color: #777; }
        .badge-progress {
            background-image: linear-gradient(90deg, #a5d6a7 var(--pct, 0%), #fff3e0 var(--pct, 0%));
            color: #2e7d32;
            border: 1px solid #a5d6a7;
            transition: --pct 0.1s linear;
        }
        .badge-analyzing { background: #b2ebf2; color: #0097a7; border: 1px solid #80deea; }
        .badge-deep { background: #fff9c4; color: #f57f17; border: 1px solid #fbc02d; animation: pulse 1s infinite; }
        .badge-retrying { background: #ffe0b2; color: #e65100; border: 1px solid #ffb74d; animation: pulse 1s infinite; } /* New v2.0 style */
        .badge-done { background: #c8e6c9; color: #2e7d32; border: 1px solid #a5d6a7; }
        .badge-info { background: #e3f2fd; color: #1976d2; border: 1px solid #90caf9; }
        .badge-failed { background: #ffcdd2; color: #c62828; border: 1px solid #ef9a9a; }
        .badge-skipped { background: #e0e0e0; color: #aaa; }
        .tag-year { font-weight: bold; color: #555; background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: monospace; }
        .diy-footer { padding: 10px 25px; background: #fff; border-top: 1px solid #eee; font-size: 12px; color: #999; display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
        #diy-loading { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: #fff; padding: 15px 25px; border-radius: 8px; z-index: 2147483647; display: none; text-align: center; }
        .hidden-el { display: none !important; }
        @keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
    `;

    function loadCss(code) { const style = document.createElement('style'); style.textContent = code; document.head.appendChild(style); }
    loadCss(css);

    // --- 辅助函数 ---
    function createLoading(text, duration = 0) {
        let el = document.getElementById('diy-loading');
        if (!el) { el = document.createElement('div'); el.id = 'diy-loading'; document.body.appendChild(el); }
        el.innerHTML = text.replace(/\n/g, '<br>');
        el.style.display = 'block';
        if (duration) setTimeout(() => { if(el.parentNode) el.style.display = 'none'; }, duration);
        return el;
    }

    function hideLoading() { const el = document.getElementById('diy-loading'); if (el) el.style.display = 'none'; if (uiTimer) clearInterval(uiTimer); }
    function sanitizeFilename(name) { return (name || "Unknown").replace(/[\/\\:*?"<>|]/g, '_').replace(/[\t\n\r]/g, '').replace(/\s+/g, ' ').trim(); }
    function getArnumber(url) { if(!url) return null; const match = url.match(/arnumber=(\d+)/) || url.match(/\/document\/(\d+)/); return match ? match[1] : null; }
    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    // --- 🔥 v2.0 回归: 特权 API 用于 Session 修复 ---
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
            // 添加时间戳防止缓存
            iframe.src = window.location.href.split('#')[0] + (window.location.href.includes('?') ? '&' : '?') + '_t=' + Date.now();

            iframe.onload = () => {
                setTimeout(() => { if(iframe.parentNode) document.body.removeChild(iframe); resolve(true); }, 1000);
            };
            iframe.onerror = () => resolve(false);
            document.body.appendChild(iframe);
        });
    }

    // --- 日期解析 (8位) ---
    function parseDateStr(text) {
        if (!text) return null;
        text = text.replace(/[\n\r\t]/g, ' ').trim();
        const monthMap = { 'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12', 'sept': '09', 'july': '07', 'april': '04', 'march': '03', 'january': '01', 'february': '02', 'march': '03', 'april': '04', 'june': '06', 'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12' };

        let year = "0000"; let month = "00"; let day = "00";
        const dmyMatch = text.match(/\b(\d{1,2})(?:[\-\u2013]\d{1,2})?[\s\xA0]+([a-zA-Z]+)[\s\xA0,]+(\d{4})\b/);
        if (dmyMatch) {
            const mStr = dmyMatch[2].toLowerCase();
            for (let k in monthMap) { if (mStr.startsWith(k)) { month = monthMap[k]; break; } }
            if (month !== "00") { year = dmyMatch[3]; day = dmyMatch[1].padStart(2, '0'); return year + month + day; }
        }
        const mdyMatch = text.match(/\b([a-zA-Z]+)[\s\xA0]+(\d{1,2})(?:[\-\u2013]\d{1,2})?[\s\xA0,]+(\d{4})\b/);
        if (mdyMatch) {
            const mStr = mdyMatch[1].toLowerCase();
            for (let k in monthMap) { if (mStr.startsWith(k)) { month = monthMap[k]; break; } }
            if (month !== "00") { year = mdyMatch[3]; day = mdyMatch[2].padStart(2, '0'); return year + month + day; }
        }
        const yearMatch = text.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
            year = yearMatch[0];
            const lower = text.toLowerCase();
            for (let m in monthMap) { if (lower.includes(m)) { month = monthMap[m]; break; } }
        }
        if (year === "0000") return null;
        return year + month + day;
    }

    function formatDateByMode(fullDate, format) {
        if (!fullDate) return "0000";
        if (format === 'year_title') return fullDate.substring(0, 4);
        if (format === 'year_month_title') return fullDate.substring(0, 6);
        return fullDate;
    }

    function getRequiredLength(format) {
        if (format === 'year_title') return 4;
        if (format === 'year_month_title') return 6;
        if (format === 'date_title') return 8;
        return 0;
    }

    async function fetchPreciseDate(arnumber) {
        if (!arnumber) return null;
        try {
            const url = `https://ieeexplore.ieee.org/document/${arnumber}`;
            const response = await fetch(url);
            const text = await response.text();
            const insertMatch = text.match(/"dateOfInsertion"\s*:\s*"([^"]+)"/);
            const pubMatch = text.match(/"displayPublicationDate"\s*:\s*"([^"]+)"/);
            let rawDate = "";
            if (insertMatch) rawDate = insertMatch[1];
            else if (pubMatch) rawDate = pubMatch[1];
            else {
                const htmlDateMatch = text.match(/Date Added to IEEE Xplore:?\s*<[^>]+>\s*([a-zA-Z0-9,\s]+)/i) || text.match(/Date of Publication:?\s*<[^>]+>\s*([a-zA-Z0-9,\s]+)/i);
                if(htmlDateMatch) rawDate = htmlDateMatch[1];
            }
            return parseDateStr(rawDate);
        } catch (e) { return null; }
    }

    // --- 业务逻辑 ---
    function createPopupButton() {
        if (document.getElementById('diy-btn-float')) return;
        const btn = document.createElement('button');
        btn.id = 'diy-btn-float';
        btn.innerHTML = `<span>${t('btn_main')}</span>`;
        btn.onclick = () => {
            const popup = document.getElementById('popup');
            if (popup) popup.style.display = 'flex';
            else createPopup();
        };
        document.body.appendChild(btn);
    }

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
                <div class="diy-title">${t('title_main')}</div>
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
                            <option value="date_title" ${savedFormat === 'date_title' ? 'selected' : ''}>${t('fmt_date_title')}</option>
                            <option value="year_month_title" ${savedFormat === 'year_month_title' ? 'selected' : ''}>${t('fmt_year_month_title')}</option>
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
                </div>
                <div class="diy-actions">
                    <button id="btn-start" class="diy-btn btn-primary">${t('btn_start')}</button>
                    <div id="date-btn-wrapper" style="display:contents">
                        <button id="btn-fetch-dates" class="diy-btn btn-secondary">${t('btn_fetch_dates')}</button>
                    </div>
                    <button id="btn-stop" class="diy-btn btn-danger">${t('btn_stop')}</button>
                    <button id="btn-all" class="diy-btn btn-secondary">${t('btn_select_all')}</button>
                    <button id="btn-none" class="diy-btn btn-secondary">${t('btn_deselect_all')}</button>
                    <button id="btn-refresh" class="diy-btn btn-secondary">${t('btn_refresh_list')}</button>
                </div>
                <div class="diy-table-container">
                    <table id="my-table">
                        <thead><tr><th style="width:40px">✔</th><th style="width:40px">${t('table_idx')}</th><th>${t('table_title')}</th><th style="width:120px;text-align:center">${t('table_state')}</th></tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
            <div class="diy-footer"><span>${t('author_by')}</span><a href="${AUTHOR_INFO.orcid}" target="_blank" style="color:var(--ieee-blue)">${AUTHOR_INFO.name}</a></div>
        `;
        popup.appendChild(content);
        document.body.appendChild(popup);

        document.getElementById('btn-close').onclick = () => { document.getElementById('popup').style.display = 'none'; };
        document.getElementById('btn-stop').onclick = () => { isRunning = false; hideLoading(); createLoading(t('msg_stopped'), 1500); };
        document.getElementById('btn-all').onclick = () => { document.querySelectorAll('.selectItem:not([disabled])').forEach(cb => cb.checked = true); updateStartBtn(); };
        document.getElementById('btn-none').onclick = () => { document.querySelectorAll('.selectItem').forEach(cb => cb.checked = false); updateStartBtn(); };
        document.getElementById('btn-refresh').onclick = scanCurrentPage;
        document.getElementById('btn-start').onclick = downloadSelected;
        document.getElementById('btn-fetch-dates').onclick = fetchDatesForSelected;
        document.getElementById('format-select').onchange = (e) => {
            GM_setValue('savedFormat', e.target.value);
            renderTable();
        };

        scanCurrentPage();
    }

    function scanCurrentPage() {
        scannedItems = [];
        lastChecked = null;

        const isDetailPage = window.location.href.includes('/document/');
        const seenIds = new Set();
        const seenTitles = new Set();

        const processItem = (titleEl, pdfEl, pubInfoText, urlMatchArg) => {
            if (!titleEl) return;
            const title = titleEl.textContent.trim();
            let arnumber = urlMatchArg || null;
            if (!arnumber && pdfEl) arnumber = getArnumber(pdfEl.href);
            if (!arnumber) { const titleLink = titleEl.getAttribute('href'); if (titleLink) arnumber = getArnumber(titleLink); }

            const fullDate = parseDateStr(pubInfoText) || "00000000";

            const idKey = arnumber ? `id:${arnumber}` : null;
            const titleKey = `title:${title}`;
            if (idKey && seenIds.has(idKey)) return;
            if (!idKey && seenTitles.has(titleKey)) return;
            if(idKey) seenIds.add(idKey);
            seenTitles.add(titleKey);

            scannedItems.push({
                title: title,
                arnumber: arnumber,
                fullDate: fullDate,
                valid: !!arnumber
            });
        };

        if (isDetailPage) {
            const titleEl = document.querySelector(SELECTORS.docTitle);
            const urlMatch = window.location.href.match(/\/document\/(\d+)/) ? window.location.href.match(/\/document\/(\d+)/)[1] : null;
            let dateStr = "";
            try {
                if (unsafeWindow.xplGlobal && unsafeWindow.xplGlobal.document && unsafeWindow.xplGlobal.document.metadata) {
                     dateStr = unsafeWindow.xplGlobal.document.metadata.dateOfInsertion || unsafeWindow.xplGlobal.document.metadata.displayPublicationDate;
                }
            } catch(e) {}
            if (!dateStr) { const dateEl = document.querySelector('.doc-layout-pub-date, .u-pb-1'); dateStr = dateEl ? dateEl.textContent : ""; }
            processItem(titleEl, null, dateStr, urlMatch);
        } else {
            document.querySelectorAll(SELECTORS.resultItem).forEach(el => {
                const titleEl = el.querySelector(SELECTORS.listTitle);
                const pdfEl = el.querySelector(SELECTORS.listPdfLink);
                let fullText = el.textContent || "";
                let pubInfo = el.querySelector(SELECTORS.pubInfo)?.textContent || fullText;
                processItem(titleEl, pdfEl, pubInfo, null);
            });
        }
        renderTable();
        fetchDatesForSelected();
    }

    function renderTable() {
        const tableBody = document.querySelector('#my-table tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        const currentFormat = GM_getValue('savedFormat', DEFAULT_FORMAT);
        const infoBar = document.getElementById('diy-scan-info');
        const dateBtnWrapper = document.getElementById('date-btn-wrapper');

        if (currentFormat === 'title') {
            dateBtnWrapper.classList.add('hidden-el');
        } else {
            dateBtnWrapper.classList.remove('hidden-el');
        }

        if (infoBar) infoBar.innerHTML = t('msg_scan_result', { total: scannedItems.length, valid: scannedItems.filter(i=>i.valid).length });

        if (scannedItems.length === 0) { tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:#888;">${t('msg_no_paper')}</td></tr>`; return; }

        scannedItems.forEach((item, index) => {
            const row = tableBody.insertRow();
            row.dataset.cleanTitle = sanitizeFilename(item.title);
            row.dataset.date = item.fullDate;

            if (item.valid) {
                row.dataset.arnumber = item.arnumber;
                row.dataset.url = `https://ieeexplore.ieee.org/stampPDF/getPDF.jsp?tp=&arnumber=${item.arnumber}`;
                row.className = 'row-pending';

                let dateHtml = '';
                if (currentFormat !== 'title') {
                    const displayDate = formatDateByMode(item.fullDate, currentFormat);
                    dateHtml = `<span class="tag-year" id="date-${item.arnumber}">${displayDate}</span>`;
                }

                row.innerHTML = `
                    <td style="text-align:center"><input type="checkbox" class="selectItem" checked></td>
                    <td style="text-align:center;color:#999">${index + 1}</td>
                    <td>
                        ${dateHtml}
                        <span style="font-weight:600;color:#333;margin-left:5px">${item.title}</span>
                    </td>
                    <td class="status-cell" style="text-align:center"><span class="badge badge-pending">${t('status_pending')}</span></td>
                `;
            } else {
                row.className = 'row-skipped';
                row.innerHTML = `<td style="text-align:center"><input type="checkbox" disabled></td><td style="text-align:center">${index+1}</td><td style="color:#aaa">${item.title}</td><td class="status-cell" style="text-align:center"><span class="badge badge-skipped">${t('status_no_pdf')}</span></td>`;
            }

            const checkbox = row.querySelector('.selectItem');
            if (checkbox && !checkbox.disabled) {
                checkbox.addEventListener('click', function(e) {
                    if (e.shiftKey && lastChecked) {
                        const allChecks = Array.from(document.querySelectorAll('.selectItem:not([disabled])'));
                        const start = allChecks.indexOf(this), end = allChecks.indexOf(lastChecked);
                        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) allChecks[i].checked = this.checked;
                    }
                    lastChecked = this;
                    updateStartBtn();
                });
            }
        });
        updateStartBtn();
    }

    async function fetchDatesForSelected() {
        if (isRunning) return;
        const selected = document.querySelectorAll('.selectItem:checked');
        if (selected.length === 0) return;
        const nameFormat = document.getElementById('format-select').value;
        if (nameFormat === 'title') return;
        const requiredLen = getRequiredLength(nameFormat);

        let tasks = [];
        for (let i = 0; i < selected.length; i++) {
            const cb = selected[i];
            const row = cb.closest('tr');
            const storedFullDate = row.dataset.date;
            const validLen = storedFullDate.replace(/0+$/, '').length;
            if (validLen < requiredLen) tasks.push(row);
        }

        const processTask = async (row) => {
            const arnumber = row.dataset.arnumber;
            const statusCell = row.querySelector('.status-cell');
            if (row.classList.contains('row-pending')) {
                statusCell.innerHTML = `<span class="badge badge-analyzing">${t('status_analyzing')}</span>`;
            }
            const preciseFullDate = await fetchPreciseDate(arnumber);
            if (preciseFullDate) {
                row.dataset.date = preciseFullDate;
                const cacheItem = scannedItems.find(it => it.arnumber === arnumber);
                if (cacheItem) cacheItem.fullDate = preciseFullDate;
                const displayDate = formatDateByMode(preciseFullDate, nameFormat);
                const dateTag = row.querySelector(`#date-${arnumber}`);
                if(dateTag) {
                    dateTag.innerText = displayDate;
                    dateTag.style.backgroundColor = "#fffde7";
                    dateTag.style.border = "1px solid #fdd835";
                }
                if (row.classList.contains('row-pending')) {
                    statusCell.innerHTML = `<span class="badge badge-info">${t('status_date_ok')}</span>`;
                }
            }
            await delay(getRandomInt(200, 600));
        };

        for (let i = 0; i < tasks.length; i += CONCURRENCY_LIMIT) {
            const chunk = tasks.slice(i, i + CONCURRENCY_LIMIT);
            await Promise.all(chunk.map(row => processTask(row)));
        }
    }

    // 🔥 52KB 修复版 + Token自我修复逻辑
    async function downloadPdfCycle(url, filename, folder, statusCell, row) {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts && isRunning) {
            try {
                // 1. 发起请求
                let response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                // 🔥 2. 智能嗅探: 检查是否是 HTML 伪装
                const contentType = response.headers.get('Content-Type') || '';
                if (contentType.includes('text/html')) {
                    statusCell.innerHTML = `<span class="badge badge-deep">${t('status_deep_scan')}</span>`;
                    const text = await response.text();

                    const iframeMatch = text.match(/<iframe.*?src="(.*?\.pdf.*?)"/i);
                    const locationMatch = text.match(/location\.href\s*=\s*['"](.*?\.pdf.*?)['"]/i);
                    const directMatch = text.match(/pdfUrl\s*=\s*['"](.*?\.pdf.*?)['"]/i);

                    let realUrl = null;
                    if (iframeMatch) realUrl = iframeMatch[1];
                    else if (locationMatch) realUrl = locationMatch[1];
                    else if (directMatch) realUrl = directMatch[1];

                    if (realUrl) {
                        if (realUrl.startsWith('/')) realUrl = window.location.origin + realUrl;
                        console.log(`Deep link found: ${realUrl}`);
                        response = await fetch(realUrl);
                    } else {
                        throw new Error("No PDF found in HTML wrapper (Auth Blocked)");
                    }
                }

                // 3. 流式下载
                const contentLength = +response.headers.get('Content-Length');
                const reader = response.body.getReader();
                let receivedLength = 0;
                let chunks = [];

                row.className = 'row-downloading';
                const badge = document.createElement('span');
                badge.className = 'badge badge-progress';
                statusCell.innerHTML = '';
                statusCell.appendChild(badge);

                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    receivedLength += value.length;

                    if (contentLength) {
                        const pct = Math.floor((receivedLength / contentLength) * 100);
                        badge.innerText = `${pct}%`;
                        badge.style.setProperty('--pct', `${pct}%`);
                    } else {
                        badge.innerText = `${(receivedLength / 1024).toFixed(0)}KB`;
                    }
                }

                const blob = new Blob(chunks, { type: 'application/pdf' });

                // 🔥 4. 完整性校验
                if (blob.size < 2000) {
                    throw new Error("File too small (Auth failed)");
                }

                const blobUrl = URL.createObjectURL(blob);
                const finalPath = folder ? `${folder}/${filename}` : filename;

                statusCell.innerHTML = `<span class="badge badge-done">${t('status_validating')}</span>`;

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

            } catch (e) {
                console.error(`Attempt ${attempts+1} failed:`, e);
                // 🔥 5. 触发 v2.0 核弹修复机制
                statusCell.innerHTML = `<span class="badge badge-retrying">${t('status_retrying')}</span>`;

                // 步骤A: 销毁所有 IEEE Cookie
                await nukeCookiesViaPrivilege();
                // 步骤B: 利用iframe强刷 Session
                await refreshSessionViaIframe();
                // 步骤C: 等待生效
                await delay(3000);

                attempts++;
                if (attempts >= maxAttempts) {
                    if (e.message.includes("Auth") || e.message.includes("No PDF")) {
                        statusCell.innerHTML = `<span class="badge badge-skipped">${t('status_no_access')}</span>`;
                        row.className = 'row-skipped';
                    } else {
                        throw e;
                    }
                }
            }
        }
    }

    async function downloadSelected() {
        if (isRunning) return;
        const selected = document.querySelectorAll('.selectItem:checked');
        if (selected.length === 0) return;
        isRunning = true;

        const folder = document.getElementById('folder-input').value.trim();
        const minDelay = parseInt(document.getElementById('min-delay-input').value) || 200;
        const maxDelay = parseInt(document.getElementById('max-delay-input').value) || 500;
        const nameFormat = document.getElementById('format-select').value;

        GM_setValue('savedFolder', folder);
        GM_setValue('savedMinDelay', minDelay);
        GM_setValue('savedMaxDelay', maxDelay);
        GM_setValue('savedFormat', nameFormat);

        for (let i = 0; i < selected.length; i++) {
            if (!isRunning) break;
            const cb = selected[i];
            const row = cb.closest('tr');
            const url = row.dataset.url;
            const statusCell = row.querySelector('.status-cell');

            let filename = `${row.dataset.cleanTitle}.pdf`;
            if (nameFormat !== 'title') {
                const dateStrForFile = formatDateByMode(row.dataset.date, nameFormat);
                filename = `${dateStrForFile}_${row.dataset.cleanTitle}.pdf`;
            }

            try {
                await downloadPdfCycle(url, filename, folder, statusCell, row);
                if (!row.className.includes('skipped')) {
                    row.className = 'row-success';
                    statusCell.innerHTML = `<span class="badge badge-done">${t('status_done')}</span>`;
                }
                cb.checked = false;

                if (i < selected.length - 1 && isRunning) {
                    await delay(getRandomInt(minDelay, maxDelay));
                }
            } catch (e) {
                console.error(e);
                row.className = 'row-failed';
                statusCell.innerHTML = `<span class="badge badge-failed">${t('status_failed')}</span>`;
            }
        }
        isRunning = false;
        hideLoading();
        updateStartBtn();
        createLoading(t('msg_all_done'), 2000);
    }

    function updateStartBtn() {
        const count = document.querySelectorAll('.selectItem:checked').length;
        const btn = document.getElementById('btn-start');
        if(btn) btn.innerHTML = `${t('btn_start')} (${count})`;
    }

    function init() {
        if (window.self !== window.top) return;
        const checkAndInject = () => { if (!document.getElementById('diy-btn-float')) createPopupButton(); };
        checkAndInject();
        setInterval(checkAndInject, 500);
    }

    window.addEventListener('load', init);
    setTimeout(init, 1000);
})();
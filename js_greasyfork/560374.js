// ==UserScript==
// @name         CNKI Batch Downloader (Bilingual)
// @name:zh-CN   知网CNKI论文PDF批量下载-双语版
// @namespace    https://greasyfork.org/zh-CN/users/236397-hust-hzb
// @version      1.2
// @icon         https://www.cnki.net/favicon.ico
// @description  Batch download CNKI papers/theses PDF (Bilingual, Smart monitoring, Auto verification)
// @description:zh-CN  知网文献、硕博论文PDF批量下载 (中英双语，智能驻守，自动核对)
// @author       HUST HuangZhenbin
// @license      MIT
// @match        *://*.cnki.net/*
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560374/CNKI%20Batch%20Downloader%20%28Bilingual%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560374/CNKI%20Batch%20Downloader%20%28Bilingual%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置与状态 ---
    let useWebVPN = GM_getValue('useWebVPN', false);
    // 命名模式: 'title', 'year_title', 'date_title'
    let namingMode = GM_getValue('namingMode', 'title');

    // 默认语言检测
    const defaultLang = navigator.language.includes('zh') ? 'zh' : 'en';
    let currentLang = GM_getValue('cnki_lang', defaultLang);

    const DEFAULT_MIN_DELAY = 5000;
    const DEFAULT_MAX_DELAY = 10000;
    const DEFAULT_FOLDER = "CNKI_Downloads";

    let isRunning = false;
    let lastCheckedIndex = null;

    // --- 国际化文本字典 ---
    const i18n = {
        zh: {
            title: "📚 CNKI 批量下载助手",
            version: "v1.2",
            close: "关闭",
            guide_title: "使用前请务必检查以下配置，否则无法自动下载：",
            guide_browser: "<b>浏览器设置：</b>请关闭“下载前询问每个文件的保存位置”（设置 -> 下载 -> 询问保存位置 -> 关）。",
            guide_tamper: "<b>油猴权限：</b>请允许 Tampermonkey 扩展访问“管理下载”权限（扩展管理 -> 详情 -> 允许访问文件URL/下载）。",
            guide_overwrite: "<b>文件去重：</b>下载时若本地存在同名文件，脚本将直接<b>替换覆盖</b>。",
            mask_title: "任务已暂停：需要人工验证",
            mask_desc: "检测到知网验证码拦截。<br>已为您自动打开验证窗口，请在<strong>新窗口中手动点击下载并完成滑块验证</strong>。<br>验证成功且开始下载后，关闭那个窗口，回来点击下方按钮。",
            btn_resume: "✅ 我已解除，继续下载",
            btn_stop_task: "⏹ 停止任务",
            report_title: "📊 下载结果核对报告",
            report_retry: "🔄 重试失败项目",
            report_close: "关闭报告",
            label_folder: "📂 归档文件夹:",
            label_naming: "🏷️ 命名:",
            opt_title_only: "仅标题",
            opt_year_title: "年份_标题 (2025_Title)",
            opt_date_title: "日期_标题 (20250521_Title)",
            label_vpn: "开启 WebVPN 模式",
            btn_scan: "🔍 1. 扫描当前页",
            btn_start: "▶ 2. 开始下载选中",
            btn_verify: "🛠️ 仅打开验证页",
            btn_clear: "🗑 清空列表",
            btn_reset_history: "🧹 清除历史记录",
            tip_shift: "💡 <b>提示：</b> 按住 <b>Shift</b> 键点击复选框可进行批量多选。文件名纯净，同名文件将自动覆盖。",
            th_check: "选",
            th_no: "No.",
            th_title: "标题",
            th_author: "日期/作者",
            th_status: "状态",
            status_wait: "待下载",
            status_done: "✔ 完成",
            status_error: "✘ 失败",
            status_pay: "💰 需付费",
            status_nopdf: "⚪ 无PDF",
            status_exists: "🔁 已存在",
            status_running: "⟳ 解析中...",
            status_downloading: "⬇ 下载中...",
            status_skip: "⚠ 跳过",
            status_ready: "等待操作...",
            status_stopped: "🚫 任务已手动停止",
            status_scanned: "扫描完成，新增 {new} 条，共 {total} 条。",
            status_total: "列表共 {total} 条文献",
            status_finished: "✅ 批量任务完成",
            alert_no_item: "未找到文献，请确保在搜索结果页",
            alert_no_check: "请先勾选需要下载的文献",
            alert_history_clear: "确定要清除所有下载历史记录吗？\n这将导致脚本不再跳过同名文件。",
            alert_history_done: "历史记录已清除。",
            report_success: "成功",
            report_exists: "已存在",
            report_pay: "需付费",
            report_nopdf: "无PDF",
            report_fail: "失败",
            report_msg_check: "请检查以下失败项目：",
            report_msg_none: "🎉 没有下载失败的项目",
            main_btn: "CNKI批量导出",
            err_captcha: "触发验证码",
            err_no_auth: "无权限/收费",
            err_download_fail: "下载失败",
            cool_down: "冷却"
        },
        en: {
            title: "📚 CNKI Batch Downloader",
            version: "v1.2",
            close: "Close",
            guide_title: "Please check the following configurations before use:",
            guide_browser: "<b>Browser:</b> Disable 'Ask where to save each file before downloading' (Settings -> Downloads).",
            guide_tamper: "<b>Tampermonkey:</b> Allow 'Manage Downloads' permission (Extension Management -> Details).",
            guide_overwrite: "<b>Overwrite:</b> If a file with the same name exists locally, it will be <b>overwritten</b>.",
            mask_title: "Task Paused: Manual Verification Required",
            mask_desc: "CNKI CAPTCHA detected.<br>A verification window has been opened. Please <strong>manually click download and solve the slider</strong> in the new window.<br>After success, close that window and click the button below.",
            btn_resume: "✅ I've Solved it, Continue",
            btn_stop_task: "⏹ Stop Task",
            report_title: "📊 Download Result Report",
            report_retry: "🔄 Retry Failed Items",
            report_close: "Close Report",
            label_folder: "📂 Folder:",
            label_naming: "🏷️ Name:",
            opt_title_only: "Title Only",
            opt_year_title: "Year_Title (2025_Title)",
            opt_date_title: "Date_Title (20250521_Title)",
            label_vpn: "Enable WebVPN Mode",
            btn_scan: "🔍 1. Scan Page",
            btn_start: "▶ 2. Start Download",
            btn_verify: "🛠️ Open Verify Page",
            btn_clear: "🗑 Clear List",
            btn_reset_history: "🧹 Reset History",
            tip_shift: "💡 <b>Tip:</b> Hold <b>Shift</b> to select multiple items. Filenames are clean and will overwrite duplicates.",
            th_check: "chk",
            th_no: "No.",
            th_title: "Title",
            th_author: "Date/Author",
            th_status: "Status",
            status_wait: "Waiting",
            status_done: "✔ Done",
            status_error: "✘ Failed",
            status_pay: "💰 Pay Req",
            status_nopdf: "⚪ No PDF",
            status_exists: "🔁 Exists",
            status_running: "⟳ Parsing...",
            status_downloading: "⬇ Downloading...",
            status_skip: "⚠ Skipped",
            status_ready: "Ready...",
            status_stopped: "🚫 Task Stopped",
            status_scanned: "Scanned, added {new}, total {total}.",
            status_total: "Total {total} items",
            status_finished: "✅ Batch Task Completed",
            alert_no_item: "No papers found. Please use on search result page.",
            alert_no_check: "Please select items first.",
            alert_history_clear: "Are you sure to clear download history?\nThis will cause re-downloading of existing files.",
            alert_history_done: "History cleared.",
            report_success: "Success",
            report_exists: "Exists",
            report_pay: "Pay Req",
            report_nopdf: "No PDF",
            report_fail: "Failed",
            report_msg_check: "Please check failed items:",
            report_msg_none: "🎉 No failed items",
            main_btn: "CNKI Export",
            err_captcha: "Captcha Triggered",
            err_no_auth: "No Auth/Paid",
            err_download_fail: "Download Failed",
            cool_down: "Cooldown"
        }
    };

    function t(key) {
        return i18n[currentLang][key] || key;
    }

    function toggleLang() {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        GM_setValue('cnki_lang', currentLang);
        const overlay = document.getElementById('cnki-overlay');
        if (overlay) overlay.remove();
        openDashboard();
    }

    // --- CSS ---
    function injectStyle() {
        if (document.getElementById('cnki-style')) return;
        const style = document.createElement('style');
        style.id = 'cnki-style';
        style.textContent = `
    .cnki-ui-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); z-index: 99999; display: flex; justify-content: center; align-items: center; }
    .cnki-ui-modal { background: #fff; width: 950px; height: 90vh; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.25); display: flex; flex-direction: column; overflow: hidden; font-family: "Microsoft YaHei", sans-serif; animation: fadeIn 0.3s ease; position: relative;}
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

    .cnki-ui-header { padding: 15px 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; }
    .cnki-ui-title { font-size: 18px; font-weight: bold; color: #333; display: flex; align-items: center; gap: 8px; }
    .cnki-ui-close { cursor: pointer; border: none; background: none; font-size: 24px; color: #999; transition: color 0.2s; }
    .cnki-ui-close:hover { color: #333; }
    .cnki-lang-btn { font-size: 12px; background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; padding: 2px 8px; border-radius: 4px; cursor: pointer; margin-right: 10px; }

    .cnki-config-guide { background: #fff1f2; border-bottom: 1px solid #fecdd3; padding: 12px 25px; font-size: 13px; color: #881337; line-height: 1.6; display: flex; gap: 10px; align-items: flex-start; }
    .cnki-guide-icon { font-size: 18px; }
    .cnki-guide-list { margin: 0; padding-left: 20px; }

    .cnki-ui-toolbar { padding: 15px 25px; border-bottom: 1px solid #eee; background: #fff; display: flex; flex-direction: column; gap: 12px; }
    .cnki-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

    .cnki-ui-btn { padding: 8px 16px; border-radius: 6px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
    .cnki-ui-btn:hover { background: #f3f4f6; transform: translateY(-1px); }
    .cnki-ui-btn:active { transform: translateY(0); }

    .cnki-btn-primary { background: #3b82f6; color: #fff; border-color: #3b82f6; box-shadow: 0 2px 5px rgba(59,130,246,0.3); }
    .cnki-btn-primary:hover { background: #2563eb; }
    .cnki-btn-warn { background: #f59e0b; color: #fff; border-color: #f59e0b; }
    .cnki-btn-warn:hover { background: #d97706; }
    .cnki-btn-danger { background: #ef4444; color: #fff; border-color: #ef4444; }
    .cnki-btn-danger:hover { background: #dc2626; }
    .cnki-btn-info { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
    .cnki-btn-info:hover { background: #0284c7; }

    .cnki-input-group { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; background: #f9fafb; padding: 5px 10px; border-radius: 6px; border: 1px solid #e5e7eb; }
    .cnki-input { padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; }
    .cnki-input:focus { border-color: #3b82f6; outline: none; }

    .cnki-table-wrap { flex: 1; overflow-y: auto; padding: 0; background: #fdfdfd; }
    .cnki-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .cnki-table th { position: sticky; top: 0; background: #f1f5f9; padding: 12px 15px; text-align: left; color: #475569; font-weight: 600; border-bottom: 1px solid #e2e8f0; z-index: 10; }
    .cnki-table td { padding: 10px 15px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
    .cnki-table tr:hover { background: #f8fafc; }
    .cnki-row-selected { background: #eff6ff !important; }

    .cnki-footer { padding: 10px 25px; border-top: 1px solid #eee; background: #f8f9fa; font-size: 12px; color: #666; display: flex; justify-content: space-between; align-items: center; }
    .cnki-orcid-link { color: #a3d014; text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: bold; }
    .cnki-orcid-link:hover { text-decoration: underline; }

    .cnki-pause-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); z-index: 20; display: none; flex-direction: column; justify-content: center; align-items: center; gap: 20px; }
    .cnki-pause-box { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #eee; text-align: center; max-width: 450px; }

    /* 结果报告遮罩 */
    .cnki-report-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 30; display: none; justify-content: center; align-items: center; }
    .cnki-report-box { background: white; width: 650px; max-height: 85%; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3); animation: fadeIn 0.2s ease; }
    .cnki-report-header { padding: 20px; background: #f0fdf4; border-bottom: 1px solid #dcfce7; }
    .cnki-report-header.has-error { background: #fef2f2; border-bottom: 1px solid #fee2e2; }
    .cnki-report-list { flex: 1; overflow-y: auto; padding: 20px; }
    .cnki-report-item { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; font-size: 13px; align-items: center; }
    .cnki-report-item:last-child { border-bottom: none; }
    .cnki-report-status-fail { color: #dc2626; font-weight: bold; background: #fef2f2; padding: 2px 6px; border-radius: 4px; font-size: 12px;}
    .cnki-report-status-pay { color: #b45309; font-weight: bold; background: #fffbeb; padding: 2px 6px; border-radius: 4px; font-size: 12px;}
    .cnki-report-status-nopdf { color: #6b7280; font-weight: bold; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;}
    .cnki-report-btn { padding: 15px; text-align: right; border-top: 1px solid #eee; background: #fff; display: flex; justify-content: flex-end; gap: 10px;}

    /* 主按钮 */
    .cnki-main-btn { position: fixed; bottom: 60px; right: 40px; padding: 12px 20px; border-radius: 50px; background: #3b82f6; color: white; border: none; box-shadow: 0 4px 15px rgba(59,130,246,0.4); cursor: pointer; z-index: 2147483647 !important; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: bold; transition: all 0.2s; }
    .cnki-main-btn:hover { transform: translateY(-2px); background: #2563eb; }

    .cnki-status-wait { color: #94a3b8; }
    .cnki-status-run { color: #3b82f6; font-weight: bold; }
    .cnki-status-ok { color: #16a34a; font-weight: bold; }
    .cnki-status-err { color: #ef4444; font-weight: bold; }
    .cnki-status-pay { color: #f59e0b; font-weight: bold; }
    .cnki-status-nopdf { color: #6b7280; font-weight: bold; }
    .cnki-status-exists { color: #9ca3af; font-weight: bold; }
    `;
        document.head.appendChild(style);
    }

    // --- 核心入口：智能驻守 (轮询检测) ---
    function tryCreateButton() {
        if (document.getElementById('cnki-main-btn')) return;
        const currentURL = window.location.href;
        if (currentURL.includes('defaultresult') || currentURL.includes('advsearch') || currentURL.includes('search') || currentURL.includes('kns8s')) {
            const btn = document.createElement('button');
            btn.id = 'cnki-main-btn';
            btn.className = 'cnki-main-btn';
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${t('main_btn')}`;
            btn.title = t('title');
            btn.onclick = openDashboard;
            document.body.appendChild(btn);
        }
    }

    const observer = new MutationObserver(() => {
        tryCreateButton();
    });

    function startObserver() {
        const targetNode = document.body;
        if(targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        } else {
            setTimeout(startObserver, 500);
        }
    }

    function openDashboard() {
        if (document.getElementById('cnki-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'cnki-overlay';
        overlay.className = 'cnki-ui-overlay';
        overlay.innerHTML = `
            <div class="cnki-ui-modal">
                <div class="cnki-ui-header">
                    <div class="cnki-ui-title">
                        ${t('title')}
                        <span style="font-size:12px;font-weight:normal;color:#666;background:#f3f4f6;padding:2px 6px;border-radius:4px">${t('version')}</span>
                    </div>
                    <div>
                        <button class="cnki-lang-btn" id="cnki-lang-toggle">${currentLang === 'zh' ? '中 / En' : 'En / 中'}</button>
                        <button class="cnki-ui-close" id="cnki-close">×</button>
                    </div>
                </div>

                <div class="cnki-config-guide">
                    <div class="cnki-guide-icon">⚠️</div>
                    <div>
                        <div style="font-weight:bold;margin-bottom:5px">${t('guide_title')}</div>
                        <ul class="cnki-guide-list">
                            <li>${t('guide_browser')}</li>
                            <li>${t('guide_tamper')}</li>
                            <li>${t('guide_overwrite')}</li>
                        </ul>
                    </div>
                </div>

                <div class="cnki-pause-mask" id="cnki-pause-mask">
                    <div class="cnki-pause-box">
                        <div style="font-size:48px;margin-bottom:10px">🛡️</div>
                        <h3 style="margin:0 0 10px 0;color:#333">${t('mask_title')}</h3>
                        <p style="color:#666;font-size:13px;margin-bottom:20px;line-height:1.6">
                            ${t('mask_desc')}
                        </p>
                        <div style="display:flex;gap:10px;justify-content:center">
                            <button class="cnki-ui-btn cnki-btn-primary" id="cnki-resume">${t('btn_resume')}</button>
                            <button class="cnki-ui-btn" id="cnki-stop-pause">${t('btn_stop_task')}</button>
                        </div>
                    </div>
                </div>

                <div class="cnki-report-mask" id="cnki-report-mask">
                    <div class="cnki-report-box">
                        <div class="cnki-report-header" id="cnki-report-header">
                            <h3 style="margin:0;font-size:18px">${t('report_title')}</h3>
                            <div id="cnki-report-summary" style="margin-top:10px;font-size:14px;line-height:1.6"></div>
                        </div>
                        <div class="cnki-report-list" id="cnki-report-list"></div>
                        <div class="cnki-report-btn">
                            <button class="cnki-ui-btn cnki-btn-primary" id="cnki-report-retry" style="display:none">${t('report_retry')}</button>
                            <button class="cnki-ui-btn" id="cnki-report-close">${t('report_close')}</button>
                        </div>
                    </div>
                </div>

                <div class="cnki-ui-toolbar">
                    <div class="cnki-row">
                        <div class="cnki-input-group">
                            <span>${t('label_folder')}</span>
                            <input type="text" id="cnki-folder" class="cnki-input" style="width:130px" value="${GM_getValue('savedFolder', DEFAULT_FOLDER)}" placeholder="CNKI_Downloads">
                        </div>
                        <div class="cnki-input-group">
                            <span>${t('label_naming')}</span>
                            <select id="cnki-naming" class="cnki-input" style="width:140px">
                                <option value="title" ${namingMode==='title'?'selected':''}>${t('opt_title_only')}</option>
                                <option value="year_title" ${namingMode==='year_title'?'selected':''}>${t('opt_year_title')}</option>
                                <option value="date_title" ${namingMode==='date_title'?'selected':''}>${t('opt_date_title')}</option>
                            </select>
                        </div>
                        <div class="cnki-input-group">
                            <label style="cursor:pointer;display:flex;align-items:center;gap:5px"><input type="checkbox" id="cnki-webvpn" ${useWebVPN?'checked':''}> ${t('label_vpn')}</label>
                        </div>
                        <button class="cnki-ui-btn cnki-btn-info" id="cnki-reset-history" title="">${t('btn_reset_history')}</button>
                    </div>

                    <div class="cnki-row">
                        <button class="cnki-ui-btn cnki-btn-primary" id="cnki-scan">${t('btn_scan')}</button>
                        <button class="cnki-ui-btn cnki-btn-primary" id="cnki-start">${t('btn_start')}</button>
                        <button class="cnki-ui-btn cnki-btn-danger" id="cnki-stop" style="display:none">${t('btn_stop_task')}</button>
                        <button class="cnki-ui-btn cnki-btn-warn" id="cnki-verify">${t('btn_verify')}</button>
                        <button class="cnki-ui-btn" id="cnki-clear">${t('btn_clear')}</button>
                    </div>
                    <div style="font-size:12px;color:#666;margin-top:5px">
                        ${t('tip_shift')}
                    </div>
                </div>

                <div class="cnki-table-wrap">
                    <table class="cnki-table">
                        <thead>
                            <tr>
                                <th style="width:40px"><input type="checkbox" id="cnki-check-all"></th>
                                <th style="width:50px">${t('th_no')}</th>
                                <th>${t('th_title')}</th>
                                <th style="width:150px">${t('th_author')}</th>
                                <th style="width:140px">${t('th_status')}</th>
                            </tr>
                        </thead>
                        <tbody id="cnki-tbody"></tbody>
                    </table>
                </div>

                <div class="cnki-footer">
                    <span id="cnki-status-text">${t('status_ready')}</span>
                    <div style="display:flex;gap:15px;align-items:center">
                        <span style="color:#999">Author: HuangZhenbin</span>
                        <a href="https://orcid.org/0000-0002-0628-0387" target="_blank" class="cnki-orcid-link">
                            <svg viewBox="0 0 256 256" width="16" height="16" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="#A6CE39" d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"/><path fill="#FFF" d="M86.3 186.2H70.9V79.1h15.4v107.1zM78.6 61.6c-5.8 0-10.5-4.7-10.5-10.5s4.7-10.5 10.5-10.5 10.5 4.7 10.5 10.5-4.7 10.5-10.5 10.5zM127 186.2H111.6V79.1h15.4v12.9c3.3-5.9 10.6-15.5 28.1-15.5 22.3 0 35.8 13.9 35.8 45.4v64.3h-15.4v-61.6c0-15.3-6.1-24.9-19.4-24.9-13.9 0-21.1 10.3-21.1 27.9v58.6z"/></svg>
                            ORCID
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('cnki-close').onclick = () => overlay.remove();
        document.getElementById('cnki-lang-toggle').onclick = toggleLang;
        document.getElementById('cnki-scan').onclick = scanPage;
        document.getElementById('cnki-start').onclick = () => startBatchDownload(false);
        document.getElementById('cnki-stop').onclick = stopDownload;
        document.getElementById('cnki-clear').onclick = clearTable;
        document.getElementById('cnki-report-close').onclick = () => document.getElementById('cnki-report-mask').style.display = 'none';
        document.getElementById('cnki-report-retry').onclick = () => {
            document.getElementById('cnki-report-mask').style.display = 'none';
            startBatchDownload(true);
        };
        document.getElementById('cnki-verify').onclick = () => openVerificationWindow(null);
        document.getElementById('cnki-reset-history').onclick = () => {
            if(confirm(t('alert_history_clear'))) {
                GM_setValue('cnki_dl_history', []);
                alert(t('alert_history_done'));
            }
        };

        document.getElementById('cnki-check-all').onclick = (e) => {
            document.querySelectorAll('.cnki-item-check').forEach(cb => {
                cb.checked = e.target.checked;
                toggleRowHighlight(cb);
            });
        };
        document.getElementById('cnki-webvpn').onchange = (e) => {
            useWebVPN = e.target.checked;
            GM_setValue('useWebVPN', useWebVPN);
        };
        document.getElementById('cnki-folder').onchange = (e) => {
            GM_setValue('savedFolder', e.target.value.trim());
        };
        document.getElementById('cnki-naming').onchange = (e) => {
            namingMode = e.target.value;
            GM_setValue('namingMode', namingMode);
        };
        renderTable();
    }

    function toggleRowHighlight(checkbox) {
        const tr = checkbox.closest('tr');
        if(checkbox.checked) tr.classList.add('cnki-row-selected');
        else tr.classList.remove('cnki-row-selected');
    }

    // --- 核心功能 ---

    function openVerificationWindow(targetUrl) {
        let url = targetUrl;
        if (!url) {
            const data = JSON.parse(sessionStorage.getItem('cnki_data') || '[]');
            if (data.length > 0) url = data[0].detailUrl;
        }
        if (!url) {
            alert(t('alert_no_item'));
            return;
        }
        window.open(url, '_blank', 'width=1024,height=768');
    }

    function waitForUserVerification(url) {
        return new Promise((resolve) => {
            openVerificationWindow(url);
            const mask = document.getElementById('cnki-pause-mask');
            const resumeBtn = document.getElementById('cnki-resume');
            const stopBtn = document.getElementById('cnki-stop-pause');
            mask.style.display = 'flex';
            const onResume = () => { mask.style.display = 'none'; cleanup(); resolve(true); };
            const onStop = () => { mask.style.display = 'none'; cleanup(); resolve(false); };
            const cleanup = () => { resumeBtn.removeEventListener('click', onResume); stopBtn.removeEventListener('click', onStop); };
            resumeBtn.addEventListener('click', onResume);
            stopBtn.addEventListener('click', onStop);
        });
    }

    // 扫描页面
    function scanPage() {
        const rows = Array.from(document.querySelectorAll('tbody tr, .list-item')).filter(row => {
            return row.style.display !== 'none' && row.innerText.trim() !== '';
        });

        if(rows.length === 0) {
            alert(t('alert_no_item'));
            return;
        }

        const currentData = JSON.parse(sessionStorage.getItem('cnki_data') || '[]');
        let newCount = 0;

        rows.forEach((row, index) => {
            const link = row.querySelector('.fz14, .name a, .wx-tit h1');
            if (!link) return;

            let detailUrl = link.href;
            if (!detailUrl || detailUrl.includes('javascript')) return;

            if(useWebVPN) {
                const origin = window.location.origin;
                detailUrl = origin + detailUrl.replace(/^(https?:\/\/)?(www\.)?[^\/]+/, '');
            }

            const title = link.textContent.trim();
            const author = row.querySelector('.author')?.textContent.trim() || '-';
            const source = row.querySelector('.source')?.textContent.trim() || '-';

            // 提取日期/年份
            let dateStr = '';
            let year = '';
            const dateNode = row.querySelector('.date') || row.querySelectorAll('td')[4];
            if (dateNode) {
                const text = dateNode.innerText.trim();
                // 提取完整日期 YYYY-MM-DD 或 YYYY/MM/DD
                const fullDateMatch = text.match(/(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})/);
                if (fullDateMatch) {
                    const y = fullDateMatch[1];
                    const m = fullDateMatch[2].padStart(2, '0');
                    const d = fullDateMatch[3].padStart(2, '0');
                    dateStr = `${y}${m}${d}`;
                    year = y;
                } else {
                    // 仅提取年份
                    const yearMatch = text.match(/\d{4}/);
                    if (yearMatch) {
                        year = yearMatch[0];
                        dateStr = year; // 如果没有具体日期，日期字段就是年份
                    }
                }
            }

            if(!currentData.find(d => d.detailUrl === detailUrl)) {
                currentData.push({
                    id: Date.now() + index,
                    title, author, source,
                    year, dateStr, // 存入年份和日期字符串
                    detailUrl, status: 'wait', errorMsg: ''
                });
                newCount++;
            }
        });

        sessionStorage.setItem('cnki_data', JSON.stringify(currentData));
        renderTable();
        updateStatusText(t('status_scanned').replace('{new}', newCount).replace('{total}', currentData.length));
    }

    function renderTable() {
        const tbody = document.getElementById('cnki-tbody');
        if(!tbody) return;
        tbody.innerHTML = '';
        const data = JSON.parse(sessionStorage.getItem('cnki_data') || '[]');

        data.forEach((item, idx) => {
            const tr = document.createElement('tr');
            let statusHtml = `<span class="cnki-status-wait">${t('status_wait')}</span>`;
            if(item.status === 'done') statusHtml = `<span class="cnki-status-ok">${t('status_done')}</span>`;
            if(item.status === 'error') statusHtml = `<span class="cnki-status-err">✘ ${item.errorMsg || t('status_error')}</span>`;
            if(item.status === 'pay') statusHtml = `<span class="cnki-status-pay">${t('status_pay')}</span>`;
            if(item.status === 'no_pdf') statusHtml = `<span class="cnki-status-nopdf">${t('status_nopdf')}</span>`;
            if(item.status === 'exists') statusHtml = `<span class="cnki-status-exists">${t('status_exists')}</span>`;
            if(item.status === 'running') statusHtml = `<span class="cnki-status-run">${t('status_running')}</span>`;
            if(item.status === 'downloading') statusHtml = `<span class="cnki-status-run">${t('status_downloading')}</span>`;

            // 显示日期：如果有完整日期显示完整，否则显示年份
            const displayDate = item.dateStr && item.dateStr.length === 8
                ? `${item.dateStr.slice(0,4)}-${item.dateStr.slice(4,6)}-${item.dateStr.slice(6,8)}`
                : (item.year || '-');

            tr.innerHTML = `
                <td><input type="checkbox" class="cnki-item-check" value="${item.id}" ${item.status==='done' || item.status==='exists'?'':'checked'}></td>
                <td>${idx + 1}</td>
                <td><a href="${item.detailUrl}" target="_blank" style="text-decoration:none;color:#333;font-weight:bold" title="${item.title}">${item.title}</a></td>
                <td>
                    <div style="font-size:12px;color:#666">${item.author}</div>
                    <div style="font-size:12px;color:#999"><span style="background:#f3f4f6;padding:0 4px;border-radius:2px">${displayDate}</span> ${item.source}</div>
                </td>
                <td id="status-${item.id}">${statusHtml}</td>
            `;
            tbody.appendChild(tr);

            const checkbox = tr.querySelector('.cnki-item-check');
            checkbox.addEventListener('click', (e) => {
                toggleRowHighlight(checkbox);
                if (e.shiftKey && lastCheckedIndex !== null) {
                    const checks = Array.from(document.querySelectorAll('.cnki-item-check'));
                    const start = Math.min(idx, lastCheckedIndex);
                    const end = Math.max(idx, lastCheckedIndex);
                    for (let i = start; i <= end; i++) {
                        checks[i].checked = checkbox.checked;
                        toggleRowHighlight(checks[i]);
                    }
                }
                lastCheckedIndex = idx;
            });
            if(checkbox.checked) toggleRowHighlight(checkbox);
        });
        updateStatusText(t('status_total').replace('{total}', data.length));
    }

    function clearTable() { sessionStorage.removeItem('cnki_data'); renderTable(); }
    function updateStatusText(text) { const el = document.getElementById('cnki-status-text'); if(el) el.textContent = text; }
    function stopDownload() {
        isRunning = false;
        document.getElementById('cnki-start').style.display = 'inline-block';
        document.getElementById('cnki-stop').style.display = 'none';
        updateStatusText(t('status_stopped'));
        showFinalReport();
    }

    function showFinalReport() {
        const data = JSON.parse(sessionStorage.getItem('cnki_data') || '[]');
        let totalSelected = 0, success = 0, failed = 0, pay = 0, nopdf = 0, exists = 0;
        const failedList = [];

        data.forEach(item => {
            if (item.status !== 'wait') {
                totalSelected++;
                if (item.status === 'done') success++;
                else if (item.status === 'exists') exists++;
                else if (item.status === 'pay') pay++;
                else if (item.status === 'no_pdf') nopdf++;
                else if (item.status === 'error') {
                    failed++;
                    failedList.push(item);
                }
            }
        });

        if (totalSelected === 0) return;

        const mask = document.getElementById('cnki-report-mask');
        const header = document.getElementById('cnki-report-header');
        const summary = document.getElementById('cnki-report-summary');
        const list = document.getElementById('cnki-report-list');
        const retryBtn = document.getElementById('cnki-report-retry');

        mask.style.display = 'flex';
        list.innerHTML = '';

        let reportHtml = `
            <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span>${t('report_success')}: <b style="color:#16a34a">${success}</b></span>
                <span>${t('report_exists')}: <b style="color:#6b7280">${exists}</b></span>
                <span>${t('report_pay')}: <b style="color:#d97706">${pay}</b></span>
                <span>${t('report_nopdf')}: <b style="color:#6b7280">${nopdf}</b></span>
                <span>${t('report_fail')}: <b style="color:#ef4444">${failed}</b></span>
            </div>
        `;

        if (failed > 0) {
            header.classList.add('has-error');
            reportHtml += `<div style="color:#666">${t('report_msg_check')}</div>`;
            summary.innerHTML = reportHtml;

            failedList.forEach((item, idx) => {
                const div = document.createElement('div');
                div.className = 'cnki-report-item';
                div.innerHTML = `
                    <div style="width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${item.title}">${idx + 1}. ${item.title}</div>
                    <div class="cnki-report-status-fail">${item.errorMsg || t('status_error')}</div>
                `;
                list.appendChild(div);
            });
            retryBtn.style.display = 'inline-block';
        } else {
            header.classList.remove('has-error');
            summary.innerHTML = reportHtml;
            list.innerHTML = `<div style="text-align:center;color:#999;margin-top:30px">${t('report_msg_none')}</div>`;
            retryBtn.style.display = 'none';
        }
    }

    async function startBatchDownload(isRetry = false) {
        if(isRunning) return;

        let checkboxes = Array.from(document.querySelectorAll('.cnki-item-check'));
        if (isRetry) {
            const data = JSON.parse(sessionStorage.getItem('cnki_data') || '[]');
            checkboxes.forEach(cb => {
                const id = parseInt(cb.value);
                const item = data.find(d => d.id === id);
                if (item && item.status === 'error') cb.checked = true;
                else cb.checked = false;
            });
        }

        const checkedBoxes = document.querySelectorAll('.cnki-item-check:checked');
        if(checkedBoxes.length === 0) { alert(t('alert_no_check')); return; }

        isRunning = true;
        document.getElementById('cnki-start').style.display = 'none';
        document.getElementById('cnki-stop').style.display = 'inline-block';
        const data = JSON.parse(sessionStorage.getItem('cnki_data') || '[]');
        const folder = document.getElementById('cnki-folder').value.trim() || DEFAULT_FOLDER;

        for(let i=0; i<checkedBoxes.length; i++) {
            if(!isRunning) break;
            const id = parseInt(checkedBoxes[i].value);
            const item = data.find(d => d.id === id);
            if(!item) continue;

            const result = await processSingleItem(item, folder);

            if (result === 'captcha') {
                updateStatus(id, 'error', `⛔ ${t('err_captcha')}`);
                item.errorMsg = t('err_captcha');
                const userChoice = await waitForUserVerification(item.detailUrl);
                if (userChoice) { i--; continue; } else { stopDownload(); return; }
            } else if (result === 'skip') {
                updateStatus(id, 'skip', `⚠ ${t('err_no_auth')}`);
                item.status = 'skip';
                item.errorMsg = t('err_no_auth');
                sessionStorage.setItem('cnki_data', JSON.stringify(data));
                checkedBoxes[i].checked = false;
            } else if (result === 'no_pdf') {
                updateStatus(id, 'no_pdf', `⚪ ${t('status_nopdf')}`);
                item.status = 'no_pdf';
                sessionStorage.setItem('cnki_data', JSON.stringify(data));
                checkedBoxes[i].checked = false;
            } else if (result === 'exists') {
                updateStatus(id, 'exists', `🔁 ${t('status_exists')}`);
                item.status = 'exists';
                sessionStorage.setItem('cnki_data', JSON.stringify(data));
                checkedBoxes[i].checked = false;
                continue;
            } else if (result === true) {
                updateStatus(id, 'done', t('status_done'));
                item.status = 'done';
                item.errorMsg = '';
                sessionStorage.setItem('cnki_data', JSON.stringify(data));
                checkedBoxes[i].checked = false;
            } else {
                updateStatus(id, 'error', `✘ ${t('status_error')}`);
                item.status = 'error';
                item.errorMsg = t('err_download_fail');
                sessionStorage.setItem('cnki_data', JSON.stringify(data));
            }

            if(i < checkedBoxes.length - 1 && isRunning) {
                if (result === true) {
                    const delay = Math.floor(Math.random() * (DEFAULT_MAX_DELAY - DEFAULT_MIN_DELAY + 1)) + DEFAULT_MIN_DELAY;
                    let remaining = delay / 1000;
                    let finalText = t('status_done');
                    const timer = setInterval(() => {
                        if(!isRunning) clearInterval(timer);
                        updateStatus(id, item.status, `${finalText} (${t('cool_down')} ${remaining.toFixed(0)}s)`);
                        remaining--;
                    }, 1000);
                    await new Promise(r => setTimeout(r, delay));
                    clearInterval(timer);
                    updateStatus(id, item.status, finalText);
                } else {
                     let msg = '';
                     if(item.status === 'exists') msg = `🔁 ${t('status_exists')}`;
                     else if(item.status === 'no_pdf') msg = `⚪ ${t('status_nopdf')}`;
                     else if(item.status === 'pay') msg = `💰 ${t('status_pay')}`;
                     else msg = `✘ ${t('status_error')}`;

                     updateStatus(id, item.status, msg + ` (⏩ ${t('status_skip')})`);
                     await new Promise(r => setTimeout(r, 500));
                     updateStatus(id, item.status, msg);
                }
            }
        }
        stopDownload();
        if(isRunning) {
            updateStatusText(t('status_finished'));
            showFinalReport();
        }
    }

    function updateStatus(id, status, text) {
        const cell = document.getElementById(`status-${id}`);
        if(cell) {
            let color = '#94a3b8';
            if(status.includes('run') || status.includes('download')) color = '#3b82f6';
            if(status === 'done') color = '#16a34a';
            if(status === 'error') color = '#ef4444';
            if(status === 'pay') color = '#f59e0b';
            if(status === 'no_pdf') color = '#6b7280';
            if(status === 'exists') color = '#6b7280';
            cell.innerHTML = `<span style="color:${color};font-weight:bold">${text || status}</span>`;
        }
    }

    async function processSingleItem(item, folder) {
        return new Promise(async (resolve) => {
            try {
                const safeTitle = item.title.replace(/[\\/:*?"<>|]/g, '_').trim();
                let fileNameBase = safeTitle;

                // 应用命名规则
                if (namingMode === 'year_title' && item.year) {
                    fileNameBase = `${item.year}_${safeTitle}`;
                } else if (namingMode === 'date_title' && item.dateStr) {
                    // 如果有完整日期则使用日期，否则退化为年份
                    fileNameBase = `${item.dateStr}_${safeTitle}`;
                }

                const finalName = folder ? `${folder}/${fileNameBase}.pdf` : `${fileNameBase}.pdf`;

                const history = GM_getValue('cnki_dl_history', []);
                if (history.includes(finalName)) {
                    resolve('exists');
                    return;
                }

                updateStatus(item.id, 'running', t('status_running'));

                const res = await new Promise((rs, rj) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: item.detailUrl,
                        headers: { 'Referer': window.location.href },
                        onload: rs,
                        onerror: rj
                    });
                });

                const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                if (res.responseText.includes('captcha-element') || res.responseText.includes('TencentCaptcha') || res.responseText.includes('拼图校验')) {
                    resolve('captcha');
                    return;
                }

                let pdfLink = null;
                const btnArea = doc.querySelector('.operate-btn') || doc.querySelector('#DownLoadParts');
                if(btnArea) {
                    const links = btnArea.querySelectorAll('a');
                    for(let a of links) {
                        if(a.textContent.includes('PDF') || a.textContent.includes('整本') || a.textContent.includes('Whole')) {
                            pdfLink = a.href;
                            break;
                        }
                    }
                }

                if(!pdfLink) {
                    resolve('no_pdf');
                    return;
                }

                if(!pdfLink.startsWith('http')) {
                    const origin = new URL(item.detailUrl).origin;
                    pdfLink = origin + (pdfLink.startsWith('/') ? '' : '/') + pdfLink;
                }

                updateStatus(item.id, 'downloading', t('status_downloading'));

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: pdfLink,
                    responseType: 'blob',
                    headers: {
                        'Referer': item.detailUrl,
                        'Cookie': document.cookie,
                        'User-Agent': navigator.userAgent
                    },
                    onload: function(response) {
                        const blob = response.response;
                        const contentType = response.responseHeaders.match(/content-type:\s*(.*)/i)?.[1] || '';

                        if(contentType.includes('text/html')) {
                            const reader = new FileReader();
                            reader.onload = function() {
                                const text = reader.result;
                                if (text.includes('captcha-element') || text.includes('TencentCaptcha')) {
                                    resolve('captcha');
                                } else if (text.includes('充值') || text.includes('登录') || text.includes('权限') || text.includes('fee') || text.includes('cz-alert') || text.includes('购买')) {
                                    resolve('pay');
                                } else {
                                    resolve(false);
                                }
                            };
                            reader.readAsText(blob);
                            return;
                        }

                        if(blob.size < 2000) {
                            resolve(false);
                            return;
                        }

                        const blobUrl = URL.createObjectURL(blob);

                        GM_download({
                            url: blobUrl,
                            name: finalName,
                            saveAs: false,
                            conflictAction: 'overwrite',
                            onload: () => {
                                const currentHistory = GM_getValue('cnki_dl_history', []);
                                if (!currentHistory.includes(finalName)) {
                                    currentHistory.push(finalName);
                                    GM_setValue('cnki_dl_history', currentHistory);
                                }
                                setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
                                resolve(true);
                            },
                            onerror: (err) => {
                                console.error(err);
                                resolve(false);
                            }
                        });
                    },
                    onerror: function(err) {
                        console.error(err);
                        resolve(false);
                    }
                });

            } catch(e) {
                console.error(e);
                resolve(false);
            }
        });
    }

    // 启动
    injectStyle();
    setInterval(tryCreateButton, 1000);
    tryCreateButton();
    startObserver();

})();
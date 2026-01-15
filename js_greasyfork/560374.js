// ==UserScript==
// @name         CNKI Batch Downloader (Bilingual) - Turbo & AutoVerify
// @name:zh-CN   知网CNKI论文PDF批量下载-双语版 (极速+自动验证)
// @namespace    https://greasyfork.org/zh-CN/users/236397-hust-hzb
// @version      1.3.0
// @icon         https://www.cnki.net/favicon.ico
// @description  Batch download CNKI papers/theses PDF (Bilingual, Smart monitoring, Auto verification)
// @description:zh-CN 知网文献、硕博论文PDF批量下载 (极速版，自动弹出验证窗口并模拟点击，滑块验证后自动重试)
// @author       HUST HuangZhenbin (Modified for User)
// @license      MIT
// @match        *://*.cnki.net/*
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560374/CNKI%20Batch%20Downloader%20%28Bilingual%29%20-%20Turbo%20%20AutoVerify.user.js
// @updateURL https://update.greasyfork.org/scripts/560374/CNKI%20Batch%20Downloader%20%28Bilingual%29%20-%20Turbo%20%20AutoVerify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. 验证模式专用逻辑 (子窗口自动点击) ---
    // 如果当前URL包含特定的hash标记，说明这是脚本自动打开的验证窗口
    if (window.location.hash === '#auto_verify_mode') {
        console.log("CNKI Downloader: Auto Verify Mode Active");

        // 注入提示样式
        const tipDiv = document.createElement('div');
        tipDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:60px;background:#fef2f2;color:#dc2626;z-index:999999;display:flex;justify-content:center;align-items:center;font-size:16px;font-weight:bold;box-shadow:0 2px 10px rgba(0,0,0,0.2);border-bottom:2px solid #ef4444;';
        tipDiv.innerHTML = '🛡️ 自动验证模式：请完成滑块验证，成功后直接关闭本窗口即可！';
        document.body.appendChild(tipDiv);

        const checkAndClick = setInterval(() => {
            // 尝试查找常见的下载按钮ID或类名
            const btn = document.getElementById('pdfDown') ||
                        document.querySelector('.btn-dlpdf a') ||
                        document.querySelector('a:contains("PDF下载")');

            if (btn) {
                clearInterval(checkAndClick);
                console.log("CNKI Downloader: Found button, clicking...", btn);
                // 模拟点击触发验证码
                btn.click();

                // 更改提示文字
                tipDiv.style.background = '#f0fdf4';
                tipDiv.style.color = '#16a34a';
                tipDiv.style.borderBottom = '2px solid #22c55e';
                tipDiv.innerHTML = '✅ 已自动点击下载。<b>请手动完成滑块验证</b>，然后关闭此窗口。';
            }
        }, 500);

        // 30秒后如果没反应则停止查找
        setTimeout(() => clearInterval(checkAndClick), 30000);
        return; // 在验证窗口中不运行主面板代码
    }

    // --- 配置与状态 ---
    let useWebVPN = GM_getValue('useWebVPN', false);
    let namingMode = GM_getValue('namingMode', 'title');

    const defaultLang = navigator.language.includes('zh') ? 'zh' : 'en';
    let currentLang = GM_getValue('cnki_lang', defaultLang);

    // [修改] 缩短冷却时间，提升速度
    const DEFAULT_MIN_DELAY = 1500; // 1.5秒
    const DEFAULT_MAX_DELAY = 3000; // 3.0秒
    const DEFAULT_FOLDER = "CNKI_Downloads";

    let isRunning = false;
    let lastCheckedIndex = null;

    // --- 国际化文本字典 ---
    const i18n = {
        zh: {
            title: "📚 CNKI 批量下载 (极速版)",
            version: "v1.3",
            guide_title: "使用配置检查：",
            guide_browser: "<b>浏览器设置：</b>请关闭“下载前询问位置”。",
            guide_tamper: "<b>权限：</b>请允许扩展访问“管理下载”权限。",
            guide_overwrite: "<b>去重：</b>同名文件将自动跳过或覆盖。",
            mask_title: "等待验证...",
            mask_desc: "检测到验证码。已为您自动打开验证窗口并点击了下载。<br>请在<b>新窗口中完成滑块验证</b>，验证成功后<b>关闭那个窗口</b>，脚本将自动继续。",
            btn_resume: "✅ 我已完成验证 (或窗口已关闭)",
            btn_stop_task: "⏹ 停止任务",
            report_title: "📊 下载报告",
            report_retry: "🔄 重试失败项",
            report_close: "关闭",
            label_folder: "📂 保存子文件夹:",
            label_naming: "🏷️ 命名:",
            opt_title_only: "仅标题",
            opt_year_title: "年份_标题",
            opt_date_title: "日期_标题",
            label_vpn: "WebVPN模式",
            btn_scan: "🔍 1. 扫描本页",
            btn_start: "▶ 2. 开始下载",
            btn_verify: "🛠️ 手动验证",
            btn_clear: "🗑 清空",
            btn_reset_history: "🧹 清除历史",
            tip_shift: "💡 <b>提示：</b> 按住 Shift 可多选。保存路径为浏览器下载目录下的子文件夹。",
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
            status_ready: "准备就绪",
            status_stopped: "🚫 已停止",
            status_scanned: "新增 {new} 条，共 {total} 条。",
            status_total: "列表共 {total} 条",
            status_finished: "✅ 任务完成",
            status_verifying: "🛡️ 正在验证...",
            alert_no_item: "未找到文献",
            alert_no_check: "请先勾选文献",
            alert_history_clear: "确定清除下载历史记录？",
            alert_history_done: "已清除。",
            report_success: "成功",
            report_fail: "失败",
            main_btn: "批量下载",
            err_captcha: "需验证",
            err_no_auth: "无权限",
            err_download_fail: "下载失败",
            cool_down: "冷却"
        },
        en: {
            title: "📚 CNKI Downloader (Turbo)",
            version: "v1.3",
            guide_title: "Config Check:",
            guide_browser: "<b>Browser:</b> Disable 'Ask where to save'.",
            guide_tamper: "<b>Tampermonkey:</b> Allow 'Manage Downloads'.",
            guide_overwrite: "<b>Duplicate:</b> Will be overwritten/skipped.",
            mask_title: "Verifying...",
            mask_desc: "Captcha detected. A window has opened and download clicked.<br>Please <b>solve the slider</b> in the new window, then <b>close it</b> to resume.",
            btn_resume: "✅ Done / Window Closed",
            btn_stop_task: "⏹ Stop",
            report_title: "📊 Report",
            report_retry: "🔄 Retry",
            report_close: "Close",
            label_folder: "📂 Sub-folder:",
            label_naming: "🏷️ Name:",
            opt_title_only: "Title Only",
            opt_year_title: "Year_Title",
            opt_date_title: "Date_Title",
            label_vpn: "WebVPN",
            btn_scan: "🔍 1. Scan",
            btn_start: "▶ 2. Start",
            btn_verify: "🛠️ Verify",
            btn_clear: "🗑 Clear",
            btn_reset_history: "🧹 Reset History",
            tip_shift: "💡 <b>Tip:</b> Shift+Click to select multiple. Saves to sub-folder of browser downloads.",
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
            status_ready: "Ready",
            status_stopped: "🚫 Stopped",
            status_scanned: "Added {new}, Total {total}.",
            status_total: "Total {total}",
            status_finished: "✅ Finished",
            status_verifying: "🛡️ Verifying...",
            alert_no_item: "No items found",
            alert_no_check: "Select items first",
            alert_history_clear: "Clear download history?",
            alert_history_done: "Cleared.",
            report_success: "Success",
            report_fail: "Failed",
            main_btn: "Batch DL",
            err_captcha: "Captcha",
            err_no_auth: "No Auth",
            err_download_fail: "Failed",
            cool_down: "Cooling"
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
    .cnki-ui-toolbar { padding: 15px 25px; border-bottom: 1px solid #eee; background: #fff; display: flex; flex-direction: column; gap: 12px; }
    .cnki-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .cnki-ui-btn { padding: 8px 16px; border-radius: 6px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
    .cnki-ui-btn:hover { background: #f3f4f6; transform: translateY(-1px); }
    .cnki-btn-primary { background: #3b82f6; color: #fff; border-color: #3b82f6; }
    .cnki-btn-primary:hover { background: #2563eb; }
    .cnki-btn-warn { background: #f59e0b; color: #fff; border-color: #f59e0b; }
    .cnki-btn-danger { background: #ef4444; color: #fff; border-color: #ef4444; }
    .cnki-btn-info { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
    .cnki-input-group { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; background: #f9fafb; padding: 5px 10px; border-radius: 6px; border: 1px solid #e5e7eb; }
    .cnki-input { padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; }
    .cnki-table-wrap { flex: 1; overflow-y: auto; padding: 0; background: #fdfdfd; }
    .cnki-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .cnki-table th { position: sticky; top: 0; background: #f1f5f9; padding: 12px 15px; text-align: left; color: #475569; font-weight: 600; border-bottom: 1px solid #e2e8f0; z-index: 10; }
    .cnki-table td { padding: 10px 15px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
    .cnki-table tr:hover { background: #f8fafc; }
    .cnki-row-selected { background: #eff6ff !important; }
    .cnki-footer { padding: 10px 25px; border-top: 1px solid #eee; background: #f8f9fa; font-size: 12px; color: #666; display: flex; justify-content: space-between; align-items: center; }
    .cnki-pause-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); z-index: 20; display: none; flex-direction: column; justify-content: center; align-items: center; gap: 20px; }
    .cnki-pause-box { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #eee; text-align: center; max-width: 450px; }
    .cnki-report-mask { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 30; display: none; justify-content: center; align-items: center; }
    .cnki-report-box { background: white; width: 650px; max-height: 85%; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3); animation: fadeIn 0.2s ease; }
    .cnki-report-header { padding: 20px; background: #f0fdf4; border-bottom: 1px solid #dcfce7; }
    .cnki-report-header.has-error { background: #fef2f2; border-bottom: 1px solid #fee2e2; }
    .cnki-report-list { flex: 1; overflow-y: auto; padding: 20px; }
    .cnki-report-item { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; font-size: 13px; align-items: center; }
    .cnki-report-status-fail { color: #dc2626; font-weight: bold; background: #fef2f2; padding: 2px 6px; border-radius: 4px; font-size: 12px;}
    .cnki-report-btn { padding: 15px; text-align: right; border-top: 1px solid #eee; background: #fff; display: flex; justify-content: flex-end; gap: 10px;}
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

    // --- 核心入口：智能驻守 ---
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
                    <div style="font-size:18px">⚠️</div>
                    <div>
                        <div style="font-weight:bold;margin-bottom:5px">${t('guide_title')}</div>
                        <ul style="margin:0;padding-left:20px">
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
                        <button class="cnki-ui-btn cnki-btn-info" id="cnki-reset-history">${t('btn_reset_history')}</button>
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
                        <span style="color:#999">Script by HuangZhenbin</span>
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
        document.getElementById('cnki-verify').onclick = () => openVerificationWindow(null, true);
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

    // --- 自动验证窗口逻辑 ---

    // 打开验证窗口，autoMode=true 时会自动带上hash触发子脚本
    function openVerificationWindow(targetUrl, autoMode = false) {
        let url = targetUrl;
        if (!url) {
            const data = JSON.parse(sessionStorage.getItem('cnki_data') || '[]');
            if (data.length > 0) url = data[0].detailUrl;
        }
        if (!url) {
            alert(t('alert_no_item'));
            return null;
        }

        // 自动模式添加 hash
        if (autoMode) {
            url = url.split('#')[0] + '#auto_verify_mode';
        }

        return window.open(url, '_blank', 'width=1024,height=768');
    }

    // 等待用户验证（自动模式）
    function waitForUserVerification(url) {
        return new Promise((resolve) => {
            // 打开带自动hash的窗口
            const popup = openVerificationWindow(url, true);

            const mask = document.getElementById('cnki-pause-mask');
            const resumeBtn = document.getElementById('cnki-resume');
            const stopBtn = document.getElementById('cnki-stop-pause');

            mask.style.display = 'flex';

            let timer = null;

            const cleanup = () => {
                if(timer) clearInterval(timer);
                resumeBtn.removeEventListener('click', onResume);
                stopBtn.removeEventListener('click', onStop);
            };

            const onResume = () => {
                mask.style.display = 'none';
                cleanup();
                resolve(true);
            };

            const onStop = () => {
                mask.style.display = 'none';
                cleanup();
                if(popup && !popup.closed) popup.close();
                resolve(false);
            };

            resumeBtn.addEventListener('click', onResume);
            stopBtn.addEventListener('click', onStop);

            // 轮询检查弹出窗口是否已关闭
            // 如果用户在弹窗里验证完并关闭了窗口，我们视为验证成功
            timer = setInterval(() => {
                if(popup.closed) {
                    console.log("CNKI Downloader: Popup closed, resuming...");
                    onResume();
                }
            }, 1000);
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
                const fullDateMatch = text.match(/(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})/);
                if (fullDateMatch) {
                    const y = fullDateMatch[1];
                    const m = fullDateMatch[2].padStart(2, '0');
                    const d = fullDateMatch[3].padStart(2, '0');
                    dateStr = `${y}${m}${d}`;
                    year = y;
                } else {
                    const yearMatch = text.match(/\d{4}/);
                    if (yearMatch) {
                        year = yearMatch[0];
                        dateStr = year;
                    }
                }
            }

            if(!currentData.find(d => d.detailUrl === detailUrl)) {
                currentData.push({
                    id: Date.now() + index,
                    title, author, source,
                    year, dateStr,
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
            reportHtml += `<div style="color:#666">请检查失败项:</div>`;
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
            list.innerHTML = `<div style="text-align:center;color:#999;margin-top:30px">🎉 全部完成</div>`;
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

            // 递归处理逻辑（支持验证码重试）
            const processRecursive = async () => {
                const result = await processSingleItem(item, folder);

                if (result === 'captcha') {
                    updateStatus(id, 'error', `🛡️ ${t('status_verifying')}`);
                    item.errorMsg = t('err_captcha');
                    // 弹出窗口等待用户处理
                    const userChoice = await waitForUserVerification(item.detailUrl);
                    if (userChoice) {
                        // 用户验证后，重试当前项
                        return await processRecursive();
                    } else {
                        stopDownload();
                        return 'stopped';
                    }
                }
                return result;
            };

            const result = await processRecursive();
            if(result === 'stopped') return;

            if (result === 'skip') {
                updateStatus(id, 'skip', `⚠ ${t('err_no_auth')}`);
                item.status = 'skip';
                item.errorMsg = t('err_no_auth');
                checkedBoxes[i].checked = false;
            } else if (result === 'no_pdf') {
                updateStatus(id, 'no_pdf', `⚪ ${t('status_nopdf')}`);
                item.status = 'no_pdf';
                checkedBoxes[i].checked = false;
            } else if (result === 'exists') {
                updateStatus(id, 'exists', `🔁 ${t('status_exists')}`);
                item.status = 'exists';
                checkedBoxes[i].checked = false;
                continue; // 已存在不冷却
            } else if (result === true) {
                updateStatus(id, 'done', t('status_done'));
                item.status = 'done';
                item.errorMsg = '';
                checkedBoxes[i].checked = false;
            } else {
                updateStatus(id, 'error', `✘ ${t('status_error')}`);
                item.status = 'error';
                item.errorMsg = t('err_download_fail');
            }
            sessionStorage.setItem('cnki_data', JSON.stringify(data));

            if(i < checkedBoxes.length - 1 && isRunning) {
                if (result === true) {
                    const delay = Math.floor(Math.random() * (DEFAULT_MAX_DELAY - DEFAULT_MIN_DELAY + 1)) + DEFAULT_MIN_DELAY;
                    let remaining = delay / 1000;
                    let finalText = t('status_done');
                    const timer = setInterval(() => {
                        if(!isRunning) clearInterval(timer);
                        updateStatus(id, item.status, `${finalText} (${t('cool_down')} ${remaining.toFixed(1)}s)`);
                        remaining -= 0.5;
                    }, 500);
                    await new Promise(r => setTimeout(r, delay));
                    clearInterval(timer);
                    updateStatus(id, item.status, finalText);
                } else {
                     await new Promise(r => setTimeout(r, 500));
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

                if (namingMode === 'year_title' && item.year) {
                    fileNameBase = `${item.year}_${safeTitle}`;
                } else if (namingMode === 'date_title' && item.dateStr) {
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

                // 增强的验证码检测
                if (res.responseText.includes('captcha-element') ||
                    res.responseText.includes('TencentCaptcha') ||
                    res.responseText.includes('拼图校验') ||
                    res.responseText.includes('waf_captcha_marker')) {
                    resolve('captcha');
                    return;
                }

                let pdfLink = null;
                // 根据提供的HTML结构优化选择器
                const btnArea = doc.querySelector('.operate-btn') || doc.querySelector('#DownLoadParts');
                if(btnArea) {
                    const links = btnArea.querySelectorAll('a');
                    for(let a of links) {
                        // 包含PDF关键字 或 id="pdfDown"
                        if(a.id === 'pdfDown' || a.textContent.includes('PDF') || a.textContent.includes('整本')) {
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
                        // 检查文件头或类型
                        if(blob.type.includes('text/html')) {
                             // 如果下载链接返回的是HTML，可能是触发了下载验证或收费页
                            resolve('captcha');
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
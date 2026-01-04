// ==UserScript==
// @name         美国大兵 GPT 认证（自用版）
// @namespace    http://tampermonkey.net/
// @version      16.2.2
// @description  全流程全自动军人身份验证助手：**白嫖一年 GPT Plus，感谢美国大兵！！！**
// @author       Antigravity
// @match        https://services.sheerid.com/*
// @match        https://gravelocator.cem.va.gov/*
// @match        https://chatgpt.com/veterans-claim*
// @match        https://outlook.live.com/*
// @match        https://outlook.office.com/*
// @match        https://outlook.office365.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561264/%E7%BE%8E%E5%9B%BD%E5%A4%A7%E5%85%B5%20GPT%20%E8%AE%A4%E8%AF%81%EF%BC%88%E8%87%AA%E7%94%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561264/%E7%BE%8E%E5%9B%BD%E5%A4%A7%E5%85%B5%20GPT%20%E8%AE%A4%E8%AF%81%EF%BC%88%E8%87%AA%E7%94%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // --- 强力后台保活 (Web Worker Hack) ---
    function setWorkerInterval(callback, delay) {
        const blob = new Blob([`setInterval(() => postMessage('tick'), ${delay});`], { type: 'text/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage = callback;
        return worker;
    }
 
    // --- 核心配置 ---
    const FIELD_MAP = {
        status: '#sid-military-status',
        branch: '#sid-branch-of-service',
        firstName: '#sid-first-name',
        lastName: '#sid-last-name',
        bMonth: '#sid-birthdate__month',
        bDay: '#sid-birthdate-day',
        bYear: '#sid-birthdate-year',
        dMonth: '#sid-discharge-date__month',
        dDay: '#sid-discharge-date-day',
        dYear: '#sid-discharge-date-year',
        email: '#sid-email'
    };
    const SUBMIT_BTN_SELECTOR = '#sid-submit-btn-collect-info';
    const CHATGPT_CLAIM_TEXTS = ['Verify eligibility', '验证资格条件', '验证资格', '验证', 'Claim offer', '领取优惠'];
    const SHEERID_RETRY_TEXTS = ['Try again', 'Retry', 'Try Again'];
    const GRAVE_SEARCH_URL = "https://gravelocator.cem.va.gov/ngl/index.jsp";
 
    // 🔥 可配置项 (从存储读取，带默认值)
    function getConfig() {
        return {
            FIXED_STATUS: GM_getValue('config_fixed_status', "Military Veteran or Retiree"),
            FIXED_DISCHARGE_YEAR: GM_getValue('config_discharge_year', "2025"),
            FIXED_EMAIL: GM_getValue('config_email', "your-email@example.com"),
            MIN_BIRTH_YEAR: GM_getValue('config_min_birth_year', 1930),
            SENDER_FILTER: GM_getValue('config_sender_filter', "SheerID")
        };
    }
    function saveConfig(config) {
        GM_setValue('config_fixed_status', config.FIXED_STATUS);
        GM_setValue('config_discharge_year', config.FIXED_DISCHARGE_YEAR);
        GM_setValue('config_email', config.FIXED_EMAIL);
        GM_setValue('config_min_birth_year', config.MIN_BIRTH_YEAR);
        GM_setValue('config_sender_filter', config.SENDER_FILTER);
    }
    const MONTH_MAP = {
        "01": "January", "02": "February", "03": "March", "04": "April",
        "05": "May", "06": "June", "07": "July", "08": "August",
        "09": "September", "10": "October", "11": "November", "12": "December"
    };
 
    // 🔥 Outlook 专属配置 (senderFilter 从动态配置读取)
    function getOutlookConfig() {
        return {
            senderFilter: getConfig().SENDER_FILTER,
            linkKeywords: ['verify', 'confirm', 'complete', '验证', '点击'],
            checkInterval: 5000,
            autoClick: true,
            maxRetries: 3
        };
    }
    let outlookLogBuffer = [];
    let autoScrapeTimer = null;
    let inlineDataManagerInitialized = false;
    let inlineDataManagerIframe = null;

    function notifyInlineDataManager(data) {
        if (inlineDataManagerIframe && inlineDataManagerIframe.contentWindow) {
            inlineDataManagerIframe.contentWindow.postMessage({ action: 'hydrateQueue', data }, '*');
        }
    }
 
    // --- 状态管理 ---
    function getQueue() { return GM_getValue('global_auth_queue', []); }
    function saveQueue(arr) {
        GM_setValue('global_auth_queue', arr);
        updateUI();
        notifyInlineDataManager(arr);
    }
    function getCurrentTask() { return GM_getValue('current_active_task', null); }
    function setCurrentTask(task) { GM_setValue('current_active_task', task); }
    function getIsRunning() { return GM_getValue('is_script_running', false); }
    function setIsRunning(bool) { GM_setValue('is_script_running', bool); updateUI(); }
    function getTaskStage() { return GM_getValue('current_task_stage', 'IDLE'); }
    function setTaskStage(stage) { GM_setValue('current_task_stage', stage); }
 
    // --- Outlook 专用工具函数 ---
    function logOutlook(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
        console.log(logEntry);
        outlookLogBuffer.push(logEntry);
        if (outlookLogBuffer.length > 50) outlookLogBuffer.shift();
        updateOutlookUI();
    }
    function getProcessedHistory() { return GM_getValue('processed_history_ids', []); }
    function addToHistory(id) {
        let history = getProcessedHistory();
        if (!history.includes(id)) {
            history.push(id);
            if (history.length > 50) history.shift();
            GM_setValue('processed_history_ids', history);
        }
    }
 
    // --- Outlook 核心业务逻辑 ---
    async function processOutlookEmails() {
        if (!getIsRunning()) return;
        try {
            // 互斥检查已移除 (V17.5 独立守护进程架构)：Outlook 将持续扫描未读邮件，不再依赖 T1 状态
 
            const emailItems = document.querySelectorAll('div[role="option"], div[data-convid]');
            const history = getProcessedHistory();
 
            for (let idx = 0; idx < emailItems.length; idx++) {
                const item = emailItems[idx];
                const fullAria = (item.getAttribute('aria-label') || "");
                const ariaLabel = fullAria.toLowerCase();
                const isUnread = ariaLabel.includes('unread') || ariaLabel.includes('未读');
                const isSelected = item.getAttribute('aria-selected') === 'true';
 
                if (!isUnread || !ariaLabel.includes(getOutlookConfig().senderFilter.toLowerCase()) || isSelected) continue;
 
                // 使用 data-convid 作为唯一 ID (如果存在)，否则用增强指纹
                const convId = item.getAttribute('data-convid') || '';
                const stableFingerprint = fullAria.replace(/^(未读|unread|已读|read)\s*/i, '').substring(0, 120).replace(/[^a-zA-Z0-9]/g, '');
                // 优先使用 convId，它是 Outlook 的唯一会话 ID
                const emailId = convId ? `conv_${convId}` : `mail_${stableFingerprint}_i${idx}`;
 
                if (history.includes(emailId)) continue;
 
                logOutlook(`📨 Detect New Mail (ID:${emailId.substring(0, 20)}...)`, 'success');
                simulateClick(item);
                addToHistory(emailId);
 
                let finalLink = null;
                for (let i = 0; i < 20; i++) {
                    await new Promise(r => setTimeout(r, 500));
                    const readingPane = document.querySelector('div[role="document"], #ReadingPaneContainerId');
                    if (readingPane) {
                        const found = Array.from(readingPane.querySelectorAll('a')).find(a =>
                            a.href.toLowerCase().includes('sheerid.com/verify') ||
                            (getOutlookConfig().linkKeywords.some(kw => a.innerText.toLowerCase().includes(kw)) && a.href.includes('sheerid'))
                        );
                        const regexMatch = readingPane.innerHTML.match(/https?:\/\/services\.sheerid\.com\/verify\/[a-zA-Z0-9_-]+/);
                        finalLink = found?.href || regexMatch?.[0];
                        if (finalLink) break;
                    }
                }
 
                if (finalLink && getOutlookConfig().autoClick) {
                    const cleanLink = finalLink.trim();
                    logOutlook(`🔗 Opening Verify Link...`, 'action');
                    // 增加微小延迟，确保在重负载下标签页开启指令能被浏览器正确接收
                    setTimeout(() => {
                        GM_openInTab(cleanLink, { active: true, insert: true, setParent: true });
                    }, 100);
                    return;
                } else if (!finalLink) {
                    logOutlook('❌ Timeout: No link found', 'error');
                }
                break;
            }
        } catch (error) {
            logOutlook(`System Error: ${error.message}`, 'error');
        }
    }
 
    function runOutlookDiagnostics() {
        logOutlook("🔍 Running Enhanced Diagnostics...", "action");
 
        // 1. 检查邮件项
        const items = document.querySelectorAll('div[role="option"], div[data-convid]');
        logOutlook(`找到 ${items.length} 个邮件项`, 'info');
 
        // 2. 输出前5个邮件项的详细信息
        Array.from(items).slice(0, 5).forEach((el, i) => {
            const aria = el.getAttribute('aria-label') || '';
            const isSheerID = aria.toLowerCase().includes('sheerid');
            const isUnread = aria.toLowerCase().includes('unread') || aria.toLowerCase().includes('未读');
 
            logOutlook(`--- 邮件 ${i + 1} ${isSheerID ? '✅SheerID' : ''} ${isUnread ? '📩未读' : ''} ---`, 'debug');
            logOutlook(`aria(前100): ${aria.substring(0, 100)}`, 'debug');
            logOutlook(`data-convid: ${el.getAttribute('data-convid') || '无'}`, 'debug');
 
            // 输出所有 data-* 属性
            const dataAttrs = Array.from(el.attributes)
                .filter(a => a.name.startsWith('data-'))
                .map(a => `${a.name}=${a.value.substring(0, 30)}`);
            if (dataAttrs.length > 0) {
                logOutlook(`data-*: ${dataAttrs.join(', ')}`, 'debug');
            }
        });
 
        // 3. 统计 SheerID 未读邮件
        const sheerIdUnread = Array.from(items).filter(el => {
            const aria = (el.getAttribute('aria-label') || '').toLowerCase();
            return aria.includes('sheerid') && (aria.includes('unread') || aria.includes('未读'));
        });
        logOutlook(`SheerID 未读邮件数: ${sheerIdUnread.length}`, 'info');
 
        // 4. 显示已处理历史
        const history = getProcessedHistory();
        logOutlook(`已处理历史: ${history.length} 条`, 'info');
        if (history.length > 0) {
            logOutlook(`最近3条: ${history.slice(-3).join(' | ')}`, 'debug');
        }
    }
 
    function updateOutlookUI() {
        const container = document.getElementById('outlook-log-container');
        if (!container) return;
        container.innerHTML = outlookLogBuffer.map(msg => {
            let className = 'log-entry';
            if (msg.includes('[SUCCESS]')) className += ' log-success';
            if (msg.includes('[WARN]')) className += ' log-warn';
            if (msg.includes('[ERROR]')) className += ' log-error';
            if (msg.includes('[ACTION]')) className += ' log-action';
            return `<div class="${className}">${msg}</div>`;
        }).join('');
        container.scrollTop = container.scrollHeight;
    }
 
    function createOutlookPanel() {
        if (document.getElementById('outlook-assistant-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'outlook-assistant-panel';
        panel.innerHTML = `
            <div class="outlook-header">
                <h3>📧 Outlook 联动窗 (V16.0)</h3>
                <button id="close-outlook" style="background:none; border:none; color:#fff; cursor:pointer;">×</button>
            </div>
            <div class="outlook-controls">
                <button id="btn-outlook-toggle" style="width:100%; padding:10px; border:none; border-radius:4px; cursor:pointer; font-weight:bold; margin-bottom:8px; color:white;"></button>
                <div style="display:flex; gap:5px; margin-bottom:5px;">
                    <button id="btn-outlook-diag" style="flex:2; padding:8px; background:#6c757d; color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px;">🔍 诊断</button>
                    <button id="btn-outlook-copy" style="flex:1; padding:8px; background:#17a2b8; color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px;">📋 复制</button>
                </div>
                <button id="btn-outlook-clear" style="width:100%; padding:6px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; font-size:11px;">🗑️ 清空历史记录</button>
            </div>
            <div class="outlook-status" style="font-size:11px; margin-top:5px; opacity:0.8; text-align:center;">
                共享状态: <span id="outlook-status-text">...</span>
            </div>
            <div id="outlook-log-container" style="height:150px; overflow-y:auto; background:rgba(0,0,0,0.2); padding:8px; font-family:monospace; font-size:11px; margin-top:8px; border-top:1px solid rgba(255,255,255,0.1);"></div>
        `;
        document.body.appendChild(panel);
 
        GM_addStyle(`
            #outlook-assistant-panel {
                position: fixed; top: 10px; right: 20px; width: 280px; background: rgba(30,30,30,0.9);
                color: #fff; border-radius: 8px; z-index: 999999; padding: 10px; font-family: sans-serif;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 1px solid #444; backdrop-filter: blur(5px);
            }
            .outlook-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 5px; margin-bottom: 8px; }
            .outlook-header h3 { margin: 0; font-size: 13px; color: #0078d4; }
            #outlook-log-container .log-entry { margin-bottom: 2px; border-bottom: 1px solid rgba(255,255,255,0.05); }
            #outlook-log-container .log-success { color: #4ec9b0; }
            #outlook-log-container .log-error { color: #f44747; }
            #outlook-log-container .log-action { color: #3794ff; }
        `);
 
        document.getElementById('btn-outlook-diag').onclick = runOutlookDiagnostics;
        document.getElementById('btn-outlook-copy').onclick = () => {
            const text = outlookLogBuffer.join('\n');
            navigator.clipboard.writeText(text).then(() => {
                alert('已复制到剪贴板!');
            }).catch(() => {
                // Fallback: 输出到 console
                console.log('=== Outlook 诊断日志 ===\n' + text);
                alert('复制失败，请打开控制台查看 (F12)');
            });
        };
        document.getElementById('btn-outlook-clear').onclick = () => {
            if (confirm('确定清空邮件处理历史？这会导致已处理的邮件被重新检测。')) {
                GM_setValue('processed_history_ids', []);
                logOutlook('✅ 历史记录已清空', 'success');
            }
        };
        document.getElementById('close-outlook').onclick = () => panel.style.display = 'none';
 
        const toggleBtn = document.getElementById('btn-outlook-toggle');
        const statusText = document.getElementById('outlook-status-text');
 
        function syncOutlookUI() {
            const running = getIsRunning();
            toggleBtn.innerText = running ? "⏸️ 停止助手" : "▶️ 启动助手";
            toggleBtn.style.background = running ? "#d83b01" : "#0078d4";
            statusText.innerText = running ? "正在监听任务..." : "已停止";
            statusText.style.color = running ? "#4ec9b0" : "#f44747";
        }
 
        toggleBtn.onclick = () => {
            const newState = !getIsRunning();
            setIsRunning(newState);
            syncOutlookUI();
            if (newState) logOutlook("助手已启动，监听 AWAITING_EMAIL 信号...", "info");
        };
 
        syncOutlookUI();
        setInterval(syncOutlookUI, 2000); // 跨标签页同步状态
        logOutlook("Outlook 联动模块已就绪");
        updateOutlookUI();
    }
 
    // --- UI 创建 ---
    function createPanel() {
        if (document.getElementById('auth_helper_panel')) return;
        const div = document.createElement('div');
        div.id = 'auth_helper_panel';
        div.style.cssText = "position: fixed; bottom: 50px; right: 20px; width: 360px; background: #fff; border: 2px solid #6610f2; box-shadow: 0 5px 25px rgba(0,0,0,0.3); z-index: 999999; padding: 15px; border-radius: 8px; font-family: sans-serif; font-size: 13px;";
 
        const header = document.createElement('div');
        header.style.cssText = "font-weight:bold; color:#6610f2; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:10px; display:flex; justify-content:space-between; align-items:center;";
        const title = document.createElement('span');
        title.style.fontSize = "14px";
        title.textContent = "🚀 认证助手 V16.0 (统一版)";
        const count = document.createElement('span');
        count.id = "queue_count";
        count.style.cssText = "background:#dc3545; color:white; padding:4px 12px; border-radius:20px; font-size:18px; font-weight:bold;";
        count.textContent = "0";
        header.appendChild(title);
        header.appendChild(count);
        div.appendChild(header);
 
        const statusArea = document.createElement('div');
        statusArea.id = "status_area";
        statusArea.style.cssText = "margin-bottom: 10px; color: #333; min-height: 20px; font-weight:bold;";
        statusArea.textContent = "待命中...";
        div.appendChild(statusArea);
 
        const btnRow = document.createElement('div');
        btnRow.style.cssText = "display:flex; gap:8px; margin-bottom: 10px;";
        const btnToggle = document.createElement('button');
        btnToggle.id = "btn_toggle";
        btnToggle.style.cssText = "flex:2; padding: 12px; border: none; border-radius: 4px; font-weight: bold; font-size: 15px; cursor: pointer; color: white;";
        const btnSkip = document.createElement('button');
        btnSkip.id = "btn_skip";
        btnSkip.style.cssText = "flex:1; padding: 12px; background: #ffc107; color: #000; border: none; border-radius: 4px; font-weight: bold; font-size: 13px; cursor: pointer;";
        btnSkip.textContent = "⏭️ 跳过";
        btnRow.appendChild(btnToggle);
        btnRow.appendChild(btnSkip);
        div.appendChild(btnRow);
 
        const importSection = document.createElement('div');
        const textarea = document.createElement('textarea');
        textarea.id = "bulk_input";
        textarea.placeholder = "粘贴数据或抓取数据...";
        textarea.style.cssText = "width: 100%; height: 60px; margin-bottom: 5px; font-size:12px; border:1px solid #ccc; padding:5px;";
        const subBtnRow = document.createElement('div');
        subBtnRow.style.cssText = "display:flex; gap:5px; margin-bottom:5px;";
        const btnScrape = document.createElement('button');
        btnScrape.id = "btn_scrape";
        btnScrape.style.cssText = "flex:1.5; padding: 8px; cursor: pointer; background:#198754; color:white; border:none; border-radius:4px; display:none;";
        btnScrape.textContent = "📥 抓取本页";
        if (location.host.includes('gravelocator.cem.va.gov')) btnScrape.style.display = 'block';
        const btnImport = document.createElement('button');
        btnImport.id = "btn_import";
        btnImport.style.cssText = "flex:1; padding: 8px; cursor: pointer; background:#0d6efd; color:white; border:none; border-radius:4px;";
        btnImport.textContent = "📥 存入";
        const btnManage = document.createElement('button');
        btnManage.id = "btn_manage";
        btnManage.style.cssText = "flex:1; padding: 8px; cursor: pointer; background:#17a2b8; color:white; border:none; border-radius:4px;";
        btnManage.textContent = "📊 管理数据";
        const btnReset = document.createElement('button');
        btnReset.id = "btn_reset";
        btnReset.style.cssText = "flex:0.8; padding: 8px; cursor: pointer; background:#dc3545; color:white; border:none; border-radius:4px;";
        btnReset.textContent = "🗑️";
        subBtnRow.appendChild(btnScrape);
        subBtnRow.appendChild(btnImport);
        subBtnRow.appendChild(btnManage);
        subBtnRow.appendChild(btnReset);
        importSection.appendChild(textarea);
        importSection.appendChild(subBtnRow);
        
        // 自动抓取区域（仅在 gravelocator 显示）
        if (location.host.includes('gravelocator.cem.va.gov')) {
            const autoScrapeSection = document.createElement('div');
            autoScrapeSection.style.cssText = "margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;";
            
            const autoTitle = document.createElement('div');
            autoTitle.style.cssText = "font-weight: bold; margin-bottom: 8px; color: #495057; font-size: 12px;";
            autoTitle.textContent = "🤖 自动批量抓取";
            
            const autoTextarea = document.createElement('textarea');
            autoTextarea.id = "auto_scrape_input";
            autoTextarea.placeholder = "输入Last Name列表（每行一个）\n例如:\nSmith\nJohnson\nWilliams";
            autoTextarea.style.cssText = "width: 100%; height: 50px; margin-bottom: 5px; font-size:11px; border:1px solid #ccc; padding:5px;";
            
            const autoStatus = document.createElement('div');
            autoStatus.id = "auto_scrape_status";
            autoStatus.style.cssText = "font-size: 11px; margin-bottom: 5px; color: #6c757d; min-height: 18px;";
            autoStatus.textContent = "未运行";
            
            const autoBtnRow = document.createElement('div');
            autoBtnRow.style.cssText = "display:flex; gap:5px;";
            
            const btnAutoStart = document.createElement('button');
            btnAutoStart.id = "btn_auto_scrape_start";
            btnAutoStart.style.cssText = "flex:1; padding: 6px; cursor: pointer; background:#28a745; color:white; border:none; border-radius:4px; font-size:11px; font-weight:bold;";
            btnAutoStart.textContent = "▶️ 开始提取";
            
            const btnAutoClear = document.createElement('button');
            btnAutoClear.id = "btn_auto_scrape_clear";
            btnAutoClear.style.cssText = "flex:0.8; padding: 6px; cursor: pointer; background:#ffc107; color:#000; border:none; border-radius:4px; font-size:11px; font-weight:bold;";
            btnAutoClear.textContent = "🗑️ 清空";
            
            autoBtnRow.appendChild(btnAutoStart);
            autoBtnRow.appendChild(btnAutoClear);
            
            autoScrapeSection.appendChild(autoTitle);
            autoScrapeSection.appendChild(autoTextarea);
            autoScrapeSection.appendChild(autoStatus);
            autoScrapeSection.appendChild(autoBtnRow);
            
            importSection.appendChild(autoScrapeSection);
        }
        
        div.appendChild(importSection);
 
        // === 配置面板 ===
        const configSection = document.createElement('div');
        configSection.id = "config_section";
        configSection.style.cssText = "margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;";
 
        const configToggle = document.createElement('button');
        configToggle.id = "btn_config_toggle";
        configToggle.style.cssText = "width: 100%; padding: 6px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-bottom: 8px;";
        configToggle.textContent = "⚙️ 显示配置";
        configSection.appendChild(configToggle);
 
        const configPanel = document.createElement('div');
        configPanel.id = "config_panel";
        configPanel.style.cssText = "display: none; font-size: 11px; color: #000;";
 
        const cfg = getConfig();
        const configFields = [
            { id: 'cfg_email', label: '📧 邮箱', value: cfg.FIXED_EMAIL, key: 'FIXED_EMAIL' },
            { id: 'cfg_status', label: '🎖️ 身份', value: cfg.FIXED_STATUS, key: 'FIXED_STATUS' },
            { id: 'cfg_discharge_year', label: '📅 退役年', value: cfg.FIXED_DISCHARGE_YEAR, key: 'FIXED_DISCHARGE_YEAR' },
            { id: 'cfg_min_birth_year', label: '🎂 最小出生年', value: cfg.MIN_BIRTH_YEAR, key: 'MIN_BIRTH_YEAR', type: 'number' },
            { id: 'cfg_sender_filter', label: '📬 发件人过滤', value: cfg.SENDER_FILTER, key: 'SENDER_FILTER' }
        ];
 
        configFields.forEach(field => {
            const row = document.createElement('div');
            row.style.cssText = "display: flex; align-items: center; margin-bottom: 5px;";
            const label = document.createElement('label');
            label.style.cssText = "flex: 0 0 90px; font-size: 11px; color: #000;";
            label.textContent = field.label;
            const input = document.createElement('input');
            input.id = field.id;
            input.type = field.type || 'text';
            input.value = field.value;
            input.dataset.key = field.key;
            input.style.cssText = "flex: 1; padding: 4px; font-size: 11px; border: 1px solid #ccc; border-radius: 3px; color: #000;";
            row.appendChild(label);
            row.appendChild(input);
            configPanel.appendChild(row);
        });
 
        const btnSaveConfig = document.createElement('button');
        btnSaveConfig.id = "btn_save_config";
        btnSaveConfig.style.cssText = "width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 8px;";
        btnSaveConfig.textContent = "💾 保存配置";
        configPanel.appendChild(btnSaveConfig);
 
        configSection.appendChild(configPanel);
        div.appendChild(configSection);
 
        document.body.appendChild(div);
    }
 
    // --- 核心工具函数 ---
    function simulateClick(element) {
        if (!element) return;
        try {
            element.click();
        } catch (e) {
            const events = ['mousedown', 'mouseup', 'click'];
            events.forEach(name => {
                const evt = new MouseEvent(name, { bubbles: true, cancelable: true });
                element.dispatchEvent(evt);
            });
        }
        // 补丁：模拟 Enter 键
        try {
            element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        } catch (e) { }
    }
 
    function setNativeValue(element, value) {
        if (!element) return;
        const lastValue = element.value;
        element.value = value;
        const tracker = element._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }
 
    function pressEnter(element) {
        try {
            ['keydown', 'keypress', 'keyup'].forEach(type => {
                element.dispatchEvent(new KeyboardEvent(type, {
                    bubbles: true, cancelable: true,
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, charCode: 13
                }));
            });
        } catch (e) {
            console.warn("[pressEnter] Failed:", e);
        }
    }
 
    // 专门针对下拉框的智能填值 (自动匹配 Option Value)
    function setDropdownValue(element, textOrValue) {
        if (!element) return;
 
        // 0. 预处理：模拟用户点击以激活下拉菜单（对 React 组件很重要）
        try {
            element.focus();
            simulateClick(element);
        } catch (e) { }
 
        // 1. 如果是标准 SELECT，尝试按文本匹配 Option
        if (element.tagName === 'SELECT') {
            // Wait for options to load (Lazy loading check)
            if (element.options.length === 0) {
                console.warn("[Dropdown] Options empty, waiting/retrying...");
                try { element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); } catch (e) { }
                return;
            }
 
            const opts = Array.from(element.options);
            const target = (textOrValue || "").toString().toLowerCase().trim();
 
            // A. Prefer Exact Match (Text or Value)
            let foundOption = opts.find(opt =>
                opt.text.toLowerCase().trim() === target ||
                opt.value.toLowerCase().trim() === target
            );
 
            // B. Fuzzy Match Text (Contains)
            if (!foundOption) {
                foundOption = opts.find(opt => opt.text.toLowerCase().includes(target));
            }
 
            // C. Month Name to Value Mapping fallback (e.g. "May" -> "05")
            if (!foundOption) {
                const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
                const idx = months.indexOf(target);
                if (idx !== -1) {
                    const val1 = (idx + 1).toString(); // "5"
                    const val2 = (idx + 1).toString().padStart(2, '0'); // "05"
                    foundOption = opts.find(opt => opt.value === val1 || opt.value === val2);
                }
            }
 
            if (foundOption) {
                console.log(`[Dropdown] Matched "${textOrValue}" to option value "${foundOption.value}" (Text: "${foundOption.text}")`);
                setNativeValue(element, foundOption.value);
                pressEnter(element); // Simulate Enter key
                return;
            } else {
                // Diagnostics: Log first 5 options to help debug
                const debugOpts = opts.slice(0, 5).map(o => `"${o.text}"=${o.value}`).join(', ');
                console.warn(`[Dropdown] No match for "${textOrValue}". Available: [${debugOpts}...]`);
            }
        }
 
        // 2. Fallback to raw input (for custom dropdowns)
        console.warn(`[Dropdown] Fallback to raw input for "${textOrValue}"`);
        setNativeValue(element, textOrValue);
        // 对自定义下拉组件，模拟 Enter 键来确认选择
        pressEnter(element);
    }
 
    function getExactBranch(text) {
        const upper = (text || "").toUpperCase();
        if (upper.includes("SPACE FORCE")) return "Space Force";
        if (upper.includes("ARMY")) return "Army";
        if (upper.includes("NAVY")) return "Navy";
        if (upper.includes("MARINE")) return "Marine Corps";
        if (upper.includes("AIR FORCE")) return "Air Force";
        if (upper.includes("COAST GUARD")) return "Coast Guard";
        return "Army";
    }
 
    function scrapeGraveLocator() {
        const rows = document.querySelectorAll('#searchResults tbody tr');
        let records = [];
        let currentRecord = {};
        rows.forEach(row => {
            const itemNum = row.querySelector('.item-number');
            if (itemNum) {
                if (currentRecord.lastName) records.push(currentRecord);
                currentRecord = { branch: "Army" };
            }
            const header = row.querySelector('.row-header')?.innerText || "";
            const value = row.querySelector('.results-info')?.innerText || "";
            if (header.includes("Name:")) {
                const parts = value.split(',');
                currentRecord.lastName = parts[0]?.trim();
                currentRecord.firstName = parts[1]?.trim();
            } else if (header.includes("Rank & Branch:")) {
                currentRecord.branch = getExactBranch(value);
            } else if (header.includes("Date of Birth:")) {
                const parts = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                if (parts) {
                    currentRecord.bMonth = MONTH_MAP[parts[1]];
                    currentRecord.bDay = parts[2];
                    currentRecord.bYear = parts[3];
                }
            } else if (header.includes("Date of Death:")) {
                const parts = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                if (parts) { currentRecord.dMonth = MONTH_MAP[parts[1]]; currentRecord.dDay = parts[2]; }
            }
        });
        if (currentRecord.lastName) records.push(currentRecord);
        const cfg = getConfig();
        return records.filter(r => r.bYear && parseInt(r.bYear) >= cfg.MIN_BIRTH_YEAR).map(r => [
            "GLOBAL", r.branch, r.firstName, r.lastName,
            r.bMonth, r.bDay, r.bYear,
            r.dMonth || "January", r.dDay || "01",
            "GLOBAL", "GLOBAL" // Discharge Year & Email are now runtime config
        ]);
    }

    // 数据管理功能
    function deduplicateQueue() {
        const queue = getQueue();
        const seen = new Set();
        const deduplicated = queue.filter(item => {
            const key = `${item[3]}_${item[2]}_${item[6]}`; // lastName_firstName_bYear
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        saveQueue(deduplicated);
        return queue.length - deduplicated.length;
    }

    function captureCurrentPage(showAlert = true) {
        const data = scrapeGraveLocator();
        if (data.length > 0) {
            saveQueue(getQueue().concat(data));
        }
        if (showAlert) {
            alert(`捕捉到 ${data.length} 条数据`);
        }
        return data.length;
    }

    function ensureInlineDataManager() {
        let overlay = document.getElementById('data_manager_overlay');
        if (overlay) {
            inlineDataManagerIframe = overlay.querySelector('#dm_iframe');
            return overlay;
        }

        overlay = document.createElement('div');
        overlay.id = 'data_manager_overlay';
        overlay.innerHTML = `
            <div class="dm-backdrop"></div>
            <div class="dm-shell">
                <div class="dm-header">
                    <span class="dm-title">📊 数据管理器</span>
                    <button id="dm_close_btn" title="关闭">×</button>
                </div>
                <iframe id="dm_iframe" class="dm-frame" sandbox="allow-scripts allow-same-origin"></iframe>
            </div>`;
        document.body.appendChild(overlay);

        if (!inlineDataManagerInitialized) {
            GM_addStyle(`
                #data_manager_overlay { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 10000000; }
                #data_manager_overlay .dm-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.55); }
                #data_manager_overlay .dm-shell { position: relative; width: 92%; max-width: 940px; height: 86%; background: #fff; border-radius: 12px; box-shadow: 0 25px 70px rgba(0,0,0,0.45); display: flex; flex-direction: column; overflow: hidden; border: 2px solid #6610f2; }
                #data_manager_overlay .dm-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; background: linear-gradient(135deg,#6610f2,#845ef7); color: #fff; }
                #data_manager_overlay .dm-title { font-weight: bold; font-size: 16px; }
                #data_manager_overlay #dm_close_btn { background: transparent; border: none; color: #fff; font-size: 20px; cursor: pointer; }
                #data_manager_overlay .dm-frame { border: none; width: 100%; height: calc(100% - 48px); background: #f5f5f5; }
            `);
            inlineDataManagerInitialized = true;
        }

        const closeOverlay = () => {
            overlay.style.display = 'none';
        };

        overlay.querySelector('.dm-backdrop').addEventListener('click', closeOverlay);
        overlay.querySelector('#dm_close_btn').addEventListener('click', closeOverlay);

        inlineDataManagerIframe = overlay.querySelector('#dm_iframe');

        return overlay;
    }

    function openDataManager() {
        const queue = getQueue();
        const cfg = getConfig();

        const baseHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>数据管理器</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        h1 { color: #6610f2; margin-bottom: 20px; }
        .controls { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .controls button { padding: 10px 20px; margin-right: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; }
        .btn-dedupe { background: #ffc107; color: #000; }
        .btn-clear { background: #dc3545; }
        .btn-close { background: #6c757d; }
        .stats { background: #e7f3ff; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
        table { width: 100%; background: white; border-collapse: collapse; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        th { background: #6610f2; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f8f9fa; }
        .btn-delete { background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
        .btn-delete:hover { background: #c82333; }
        .filter-section { margin-bottom: 15px; }
        .filter-section input { padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>📊 数据管理器</h1>
    <div class="controls">
        <div class="stats">
            <strong>总数据量:</strong> <span id="totalCount">${queue.length}</span> 条 | 
            <strong>最小出生年:</strong> ${cfg.MIN_BIRTH_YEAR} | 
            <strong>邮箱:</strong> ${cfg.FIXED_EMAIL}
        </div>
        <div class="filter-section">
            <input type="text" id="searchName" placeholder="搜索姓名..." />
            <button id="btnFilter" style="padding: 8px 15px; background: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer;">🔍 搜索</button>
        </div>
        <button class="btn-dedupe" id="btnDedupe">🔄 去重</button>
        <button class="btn-clear" id="btnClear">🗑️ 清空全部</button>
        <button class="btn-close" onclick="window.close()">✖️ 关闭</button>
    </div>
    <table id="dataTable">
        <thead>
            <tr>
                <th>#</th>
                <th>姓名</th>
                <th>军种</th>
                <th>出生日期</th>
                <th>死亡日期</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody id="tableBody"></tbody>
    </table>
</body>
</html>`;

    const scriptContent = `(() => {
    const targetWindow = window.opener || window.parent;
    let currentData = ${JSON.stringify(queue)};

    function renderTable(records = null) {
        const list = records ?? currentData.map((item, index) => ({ item, index }));
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = list.map(({ item, index }, idx) => {
            const name = item[2] + ' ' + item[3];
            const birth = item[4] + ' ' + item[5] + ', ' + item[6];
            const death = item[7] + ' ' + item[8];
            return \`
                <tr>
                    <td>\${idx + 1}</td>
                    <td>\${name}</td>
                    <td>\${item[1]}</td>
                    <td>\${birth}</td>
                    <td>\${death}</td>
                    <td><button class="btn-delete" data-index="\${index}">删除</button></td>
                </tr>
            \`;
        }).join('');
        document.getElementById('totalCount').textContent = list.length;
        bindDeleteButtons();
    }

    function hydrate(newData) {
        if (!Array.isArray(newData)) return;
        currentData = newData.slice();
        renderTable();
    }

    function bindDeleteButtons() {
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const originalIndex = Number(btn.getAttribute('data-index'));
                if (Number.isInteger(originalIndex) && confirm('确定删除这条记录？')) {
                    currentData.splice(originalIndex, 1);
                    targetWindow?.postMessage({ action: 'updateQueue', data: currentData }, '*');
                    renderTable();
                }
            });
        });
    }

    document.getElementById('btnDedupe').addEventListener('click', () => {
        const seen = new Set();
        const before = currentData.length;
        currentData = currentData.filter(item => {
            const key = item[3] + '_' + item[2] + '_' + item[6];
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        targetWindow?.postMessage({ action: 'updateQueue', data: currentData }, '*');
        alert('去重完成！删除了 ' + (before - currentData.length) + ' 条重复数据');
        renderTable();
    });

    document.getElementById('btnClear').addEventListener('click', () => {
        if (confirm('确定清空所有数据？此操作不可撤销！')) {
            currentData = [];
            targetWindow?.postMessage({ action: 'updateQueue', data: currentData }, '*');
            renderTable();
        }
    });

    document.getElementById('btnFilter').addEventListener('click', filterData);
    document.getElementById('searchName').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            filterData();
        }
    });

    function filterData() {
        const keyword = document.getElementById('searchName').value.toLowerCase();
        if (!keyword) {
            renderTable();
            return;
        }
        const filtered = currentData
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => {
                const name = (item[2] + ' ' + item[3]).toLowerCase();
                return name.includes(keyword);
            });
        renderTable(filtered);
    }

    window.addEventListener('message', (event) => {
        if (event.data && event.data.action === 'hydrateQueue') {
            hydrate(event.data.data);
        }
    });

    renderTable();
    targetWindow?.postMessage({ action: 'requestQueueSnapshot' }, '*');
})();`;

        const fullHtml = baseHtml.replace('</body>', `<script>${scriptContent.replace(/<\/script>/g, '<\\/script>')}</script></body>`);

        const win = window.open('', 'DataManager', 'width=900,height=700,resizable=yes,scrollbars=yes');
        if (win) {
            win.document.open();
            win.document.write(fullHtml);
            win.document.close();
        } else {
            const overlay = ensureInlineDataManager();
            const iframe = overlay.querySelector('#dm_iframe');
            if (iframe) {
                iframe.srcdoc = fullHtml;
                inlineDataManagerIframe = iframe;
            }
            overlay.style.display = 'flex';
        }
    }

    // 监听来自数据管理器的消息
    window.addEventListener('message', (event) => {
        if (event.data && event.data.action === 'updateQueue') {
            const updated = Array.isArray(event.data.data) ? event.data.data.slice() : [];
            saveQueue(updated);
        } else if (event.data && event.data.action === 'requestQueueSnapshot') {
            const current = getQueue();
            notifyInlineDataManager(current);
        }
    });

    // 自动抓取功能状态管理
    function getAutoScrapeState() {
        return {
            isRunning: GM_getValue('auto_scrape_running', false),
            isPaused: GM_getValue('auto_scrape_paused', false),
            lastNames: GM_getValue('auto_scrape_names', []),
            currentIndex: GM_getValue('auto_scrape_index', 0),
            currentPage: GM_getValue('auto_scrape_page', 0),
            submittedName: GM_getValue('auto_scrape_submitted_name', ''),
            lastCaptureSignature: GM_getValue('auto_scrape_last_capture', '')
        };
    }

    function setAutoScrapeState(state) {
        GM_setValue('auto_scrape_running', state.isRunning);
        GM_setValue('auto_scrape_paused', state.isPaused);
        GM_setValue('auto_scrape_names', state.lastNames);
        GM_setValue('auto_scrape_index', state.currentIndex);
        GM_setValue('auto_scrape_page', state.currentPage);
        GM_setValue('auto_scrape_submitted_name', state.submittedName || '');
        GM_setValue('auto_scrape_last_capture', state.lastCaptureSignature || '');
    }

    function clearAutoScrapeState() {
        GM_deleteValue('auto_scrape_running');
        GM_deleteValue('auto_scrape_paused');
        GM_deleteValue('auto_scrape_names');
        GM_deleteValue('auto_scrape_index');
        GM_deleteValue('auto_scrape_page');
        GM_deleteValue('auto_scrape_submitted_name');
        GM_deleteValue('auto_scrape_last_capture');
        GM_deleteValue('auto_scrape_watchdog');
        if (autoScrapeTimer) {
            clearTimeout(autoScrapeTimer);
            autoScrapeTimer = null;
        }
    }

    function getAutoScrapeWatchdog() {
        return GM_getValue('auto_scrape_watchdog', Date.now());
    }

    function tickAutoScrapeWatchdog() {
        GM_setValue('auto_scrape_watchdog', Date.now());
    }

    function scheduleAutoScrape(delay = 1000) {
        if (autoScrapeTimer) clearTimeout(autoScrapeTimer);
        autoScrapeTimer = setTimeout(runAutoScrape, delay);
    }

    function getSheerIDWatchdog() {
        return GM_getValue('sheerid_watchdog_ts', Date.now());
    }

    function touchSheerIDWatchdog(tag = '') {
        GM_setValue('sheerid_watchdog_ts', Date.now());
        if (tag) GM_setValue('sheerid_watchdog_note', tag);
    }

    function clearSheerIDWatchdog() {
        GM_deleteValue('sheerid_watchdog_ts');
        GM_deleteValue('sheerid_watchdog_note');
    }

    async function waitForSearchResults(timeout = 10000, interval = 500) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const rows = document.querySelectorAll('#searchResults tbody tr');
            if (rows.length > 0) return true;
            const containerText = document.querySelector('#searchResults')?.textContent?.toLowerCase() || '';
            if (containerText.includes('no records')) return true;
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        return false;
    }

    // 自动抓取主逻辑
    async function runAutoScrape() {
        const state = getAutoScrapeState();

        if (!state.isRunning || state.isPaused) return;

        const names = Array.isArray(state.lastNames) ? state.lastNames : [];
        if (state.currentIndex >= names.length) {
            alert('✅ 自动抓取完成！共处理 ' + names.length + ' 个姓氏');
            clearAutoScrapeState();
            updateAutoScrapeUI();
            setAutoScrapeStatus('未运行');
            return;
        }

        const currentName = (names[state.currentIndex] || '').trim();
        if (!currentName) {
            state.currentIndex++;
            state.currentPage = 0;
            state.submittedName = '';
            state.lastCaptureSignature = '';
            setAutoScrapeState(state);
            scheduleAutoScrape(600);
            return;
        }

        const watchdogAge = Date.now() - getAutoScrapeWatchdog();
        if (watchdogAge > 60000) {
            console.warn('[AutoScrape] Watchdog timeout，跳过当前姓氏');
            state.currentIndex++;
            state.currentPage = 0;
            state.submittedName = '';
            state.lastCaptureSignature = '';
            setAutoScrapeState(state);
            tickAutoScrapeWatchdog();
            window.location.href = GRAVE_SEARCH_URL;
            return;
        }

        const lastNameInput = document.querySelector('#lname');
        const deathYearInput = document.querySelector('#death_yy');
        const searchBtn = document.querySelector('#searchb');
        const resultsTable = document.querySelector('#searchResults');
        const rows = resultsTable ? resultsTable.querySelectorAll('tbody tr') : [];
        const hasResults = rows.length > 0 && Array.from(rows).some(row => row.querySelector('.item-number'));
        const resultText = (resultsTable?.textContent || '').toLowerCase();
        const noRecordsFound = resultText.includes('no records');
        const displayingText = document.body.textContent?.toLowerCase() || '';
        const isResultPage = !!resultsTable && (hasResults || noRecordsFound || displayingText.includes('displaying 1 to'));
        const isFormReady = !!(lastNameInput && deathYearInput && searchBtn);

        if (!isFormReady && !isResultPage) {
            setAutoScrapeStatus('等待搜索表单加载...');
            scheduleAutoScrape(1000);
            return;
        }

        if (state.submittedName !== currentName) {
            if (!lastNameInput || !deathYearInput || !searchBtn) {
                scheduleAutoScrape(600);
                return;
            }
            setNativeValue(lastNameInput, currentName);
            setNativeValue(deathYearInput, '2025');
            if (searchBtn.disabled) searchBtn.disabled = false;

            setAutoScrapeStatus(`正在搜索: ${currentName} (${state.currentIndex + 1}/${names.length})`);
            state.submittedName = currentName;
            state.currentPage = 0;
            state.lastCaptureSignature = '';
            setAutoScrapeState(state);
            tickAutoScrapeWatchdog();

            setTimeout(() => {
                simulateClick(searchBtn);
            }, 300);

            scheduleAutoScrape(1500);
            return;
        }

        if (!hasResults && !noRecordsFound) {
            setAutoScrapeStatus(`等待结果: ${currentName}`);
            scheduleAutoScrape(1000);
            return;
        }

        setAutoScrapeStatus(`处理中: ${currentName} - 第 ${state.currentPage + 1} 页`);
        tickAutoScrapeWatchdog();

        const captureSignature = `${currentName}::${state.currentPage}`;
        if (state.lastCaptureSignature !== captureSignature) {
            const captured = captureCurrentPage(false);
            console.log(`[AutoScrape] 自动抓取到 ${captured} 条数据 (name=${currentName}, page=${state.currentPage + 1})`);
            setAutoScrapeStatus(`已抓取 ${captured} 条: ${currentName} - 第 ${state.currentPage + 1} 页`);
            state.lastCaptureSignature = captureSignature;
            setAutoScrapeState(state);
        } else {
            console.log(`[AutoScrape] 当前页已捕获，跳过重复处理 (${captureSignature})`);
        }

        const nextBtn = Array.from(document.querySelectorAll('a, button, input')).find(el => {
            const label = (el.getAttribute('aria-label') || '').toLowerCase();
            const title = (el.getAttribute('title') || '').toLowerCase();
            const valueText = (el.value || '').trim().toLowerCase();
            const text = (el.textContent || valueText).trim().toLowerCase();
            const disabled = el.disabled || el.getAttribute('aria-disabled') === 'true' || el.classList.contains('disabled');
            const visible = el.offsetParent !== null;
            const isNext = label.includes('next') || title.includes('next') || text === 'next' || text.startsWith('next') || text === '>' || text === '›' || valueText.includes('next');
            return isNext && !disabled && visible;
        });

        if (nextBtn && state.currentPage < 50) {
            state.currentPage++;
            state.lastCaptureSignature = '';
            setAutoScrapeState(state);
            setAutoScrapeStatus(`翻页中: ${currentName} - 准备第 ${state.currentPage + 1} 页`);
            simulateClick(nextBtn);
            scheduleAutoScrape(1800);
            return;
        }

        console.log('[AutoScrape] 无下一页，准备下一个姓氏');
        state.currentIndex++;
        state.currentPage = 0;
        state.submittedName = '';
        state.lastCaptureSignature = '';
        setAutoScrapeState(state);

        if (state.currentIndex >= names.length) {
            alert('✅ 自动抓取完成！共处理 ' + names.length + ' 个姓氏');
            clearAutoScrapeState();
            updateAutoScrapeUI();
            setAutoScrapeStatus('未运行');
            return;
        }

        setAutoScrapeStatus(`完成: ${currentName}，准备下一个`);
        tickAutoScrapeWatchdog();
        window.location.href = GRAVE_SEARCH_URL;
    }

    function updateAutoScrapeUI() {
        const state = getAutoScrapeState();
        const statusDiv = document.getElementById('auto_scrape_status');
        const btnStart = document.getElementById('btn_auto_scrape_start');
        const btnPause = document.getElementById('btn_auto_scrape_pause');
        const btnClear = document.getElementById('btn_auto_scrape_clear');
        
        if (statusDiv) {
            if (state.isRunning && !state.isPaused) {
                statusDiv.textContent = `运行中: ${state.currentIndex}/${state.lastNames.length}`;
                statusDiv.style.color = '#28a745';
            } else if (state.isPaused) {
                statusDiv.textContent = '已暂停';
                statusDiv.style.color = '#ffc107';
            } else {
                statusDiv.textContent = '未运行';
                statusDiv.style.color = '#6c757d';
            }
        }
        
        if (btnStart) btnStart.textContent = state.isRunning && !state.isPaused ? '⏸️ 暂停提取' : '▶️ 开始提取';
        if (btnPause) btnPause.disabled = !state.isRunning;
    }

    function setAutoScrapeStatus(msg) {
        const statusDiv = document.getElementById('auto_scrape_status');
        if (statusDiv) {
            statusDiv.textContent = msg;
            statusDiv.style.color = '#0d6efd';
        }
    }
 
    // --- Refactored Filling Logic (Decoupled) ---
    async function fillSheerIDForm(task, cfg) {
        // Unpack "Data" (Identity) - Fixed from Queue
        // Index Mapping:
        // 0: Status (Ignored, use Global)
        // 1: Branch
        // 2: FirstName
        // 3: LastName
        // 4: B-Month
        // 5: B-Day
        // 6: B-Year
        // 7: D-Month
        // 8: D-Day
        // 9: D-Year (Ignored, use Global)
        // 10: Email (Ignored, use Global)
 
        // 处理 Discharge date：如果是1月1号，改为3月19号
        let dMonth = task[7];
        let dDay = task[8];
        if (dMonth === "January" && (dDay === "01" || dDay === "1")) {
            dMonth = "March";
            dDay = "19";
            console.log("[Filling] Discharge date 1/1 detected, changed to 3/19");
        }

        const data = {
            branch: task[1],
            first: task[2],
            last: task[3],
            bMonth: task[4],
            bDay: task[5],
            bYear: task[6],
            dMonth: dMonth,
            dDay: dDay
        };
 
        setStatus(`📝 正在填写: ${data.first} ${data.last}`);
 
        const statusEl = document.querySelector(FIELD_MAP.status);
        if (statusEl) {
            // ALWAYS use global config for Status
            if (statusEl.value !== cfg.FIXED_STATUS) {
                statusEl.focus();
                simulateClick(statusEl);
                await new Promise(r => setTimeout(r, 100));
                setNativeValue(statusEl, cfg.FIXED_STATUS);
                statusEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                await new Promise(r => setTimeout(r, 500));
            }
        }
 
        const branchEl = document.querySelector(FIELD_MAP.branch);
        if (branchEl) {
            branchEl.focus();
            simulateClick(branchEl);
            await new Promise(r => setTimeout(r, 50));
            setNativeValue(branchEl, data.branch);
            branchEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            await new Promise(r => setTimeout(r, 100));
        }
 
        setNativeValue(document.querySelector(FIELD_MAP.firstName), data.first);
        setNativeValue(document.querySelector(FIELD_MAP.lastName), data.last);
 
        const bmEl = document.querySelector(FIELD_MAP.bMonth);
        if (bmEl) {
            bmEl.focus();
            simulateClick(bmEl);
            await new Promise(r => setTimeout(r, 50));
            setNativeValue(bmEl, data.bMonth);
            bmEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
        setNativeValue(document.querySelector(FIELD_MAP.bDay), data.bDay);
        setNativeValue(document.querySelector(FIELD_MAP.bYear), data.bYear);
 
        // 退役月份不能是1月，如果是则改为9月
        let dischargeMonth = data.dMonth;
        if (dischargeMonth && dischargeMonth.toLowerCase() === 'january') {
            console.log('[Filling] Discharge month is January, changing to September');
            dischargeMonth = 'September';
        }

        const dmEl = document.querySelector(FIELD_MAP.dMonth);
        if (dmEl) {
            dmEl.focus();
            simulateClick(dmEl);
            await new Promise(r => setTimeout(r, 50));
            setNativeValue(dmEl, dischargeMonth);
            dmEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
        setNativeValue(document.querySelector(FIELD_MAP.dDay), data.dDay);
 
        // ALWAYS use global config for Discharge Year
        setNativeValue(document.querySelector(FIELD_MAP.dYear), cfg.FIXED_DISCHARGE_YEAR);
 
        // ALWAYS use global config for Email
        console.log(`[Filling] Using Global Email: ${cfg.FIXED_EMAIL}`);
        setNativeValue(document.querySelector(FIELD_MAP.email), cfg.FIXED_EMAIL);
    }
 
    // --- 自动化循环 ---
    async function runAutomation() {
        if (!getIsRunning()) return;
        const host = location.host;
 
        // 1. ChatGPT 自动点击 (不含跳转 Outlook)
        if (host.includes('chatgpt.com')) {
            // V17: ChatGPT 仅作为初始启动入口，不再负责后续循环
 
            const btn = Array.from(document.querySelectorAll('a, button, [role="button"]')).find(el => {
                const text = (el.textContent || "").toLowerCase();
                return CHATGPT_CLAIM_TEXTS.some(t => text.includes(t.toLowerCase())) || el.href?.includes('sheerid.com');
            });
            if (btn) {
                const targetUrl = btn.href;
                if (targetUrl && targetUrl.includes('sheerid.com')) {
                    setStatus("🚀 强制接管链接并开启所属权...");
                    GM_openInTab(targetUrl, { active: true, insert: true, setParent: true });
                    // 我们不需要在这里点击，因为 openInTab 已经处理了跳转
                    // 也不需要关闭自身，ChatGPT 是总控
                } else {
                    setStatus("🚀 点击验证按钮...");
                    btn.click();
                }
            }
        }
 
        // 2. SheerID 验证流程 (V17 极简架构)
        else if (host.includes('services.sheerid.com')) {
            const stage = getTaskStage();
            const watchdogAge = Date.now() - getSheerIDWatchdog();
            if (watchdogAge > 30000 && stage !== 'IDLE') {
                console.warn(`[SheerID] Watchdog triggered after ${watchdogAge}ms, 强制重置当前任务`);
                const stalledTask = getCurrentTask();
                if (stalledTask) {
                    setCurrentTask(null);
                }
                setTaskStage('IDLE');
                clearSheerIDWatchdog();
                setStatus('⚠️ 30秒无响应，已舍弃当前姓名并重置');
                setTimeout(() => location.reload(), 800);
                return;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const hasEmailToken = urlParams.has('emailToken');
 
            // === T2 (验证页): 幽灵模式 ===
            // 只要一打开，就说明 Outlook 已经点击了链接。等待后端处理完，直接关闭。
            if (hasEmailToken) {
                touchSheerIDWatchdog('email-token');
                setStatus("🏁 验证页: 激活后端验证...");
                // 给后端一点时间处理，然后自毁
                setTimeout(() => {
                    console.log("[T2] Backend should be done. Closing.");
                    window.close();
                }, 1500);
                return;
            }
 
            // === T1 (表单页): 持久循环模式 ===
            // 逻辑: 填表 -> 提交 -> 等待/成功 -> 刷新 -> 只有看到 Try Again 才点击 -> 回到表单
            const pageText = document.body.textContent.toLowerCase();
            const firstNameEl = document.querySelector(FIELD_MAP.firstName);
 
            // A. 检测 "Try Again" / 重置按钮 (这是回到表单的唯一路径)
            // 注意: 一些页面可能用 'Retry' 或 'Verify another person'
            const retryBtn = Array.from(document.querySelectorAll('button, a')).find(el => {
                const t = (el.textContent || "").trim();
                return SHEERID_RETRY_TEXTS.some(kw => t.toLowerCase() === kw.toLowerCase() || t.includes(kw));
            });
 
            if (retryBtn) {
                setStatus("🔄 发现重置按钮，点击以开始新任务...");
                touchSheerIDWatchdog('retry');
                retryBtn.click();
                return;
            }
 
            // B. 检测等待或完成信令
            const WAIT_KEYWORDS = ["check your email", "sent an email", "verification email"];
            const SUCCESS_KEYWORDS = ["you've been verified", "you have been verified", "success", "you're confirmed", "congratulations"];
            // Continue 按钮是验证成功的另一个标志
            const hasContinueBtn = !!Array.from(document.querySelectorAll('button, a')).find(el =>
                (el.textContent || "").toLowerCase().trim() === 'continue'
            );
 
            // 只有在没有表单的情况下才判定这些状态，防止误判
            if (!firstNameEl) {
                const isWait = WAIT_KEYWORDS.some(k => pageText.includes(k));
                const isSuccess = SUCCESS_KEYWORDS.some(k => pageText.includes(k)) || hasContinueBtn;
                // 错误页也视为等待重置的状态 (包含 "We could not verify" / "Unable to verify")
                const hasError = pageText.includes("error") || pageText.includes("limit exceeded") ||
                    pageText.includes("unable to verify") || pageText.includes("could not verify");
 
                // 错误页处理：如果是 "Verification Limit Exceeded"，通常没有重试按钮，直接跳转回 ChatGPT
                const isLimitError = pageText.includes("verification limit exceeded") || pageText.includes("already redeemed");
 
                if (isWait || isSuccess || hasError) {
                    const statusStr = isSuccess ? "✅ 验证成功" : (hasError ? "❌ 发生错误" : "⏳ 等待邮件链接点击...");
                    setStatus(`${statusStr} | 3秒后刷新检测状态...`);
 
                    // 关键修复：任务已完成/挂起，立即清空当前任务，以便下一轮领取新任务
                    if (getCurrentTask()) {
                        console.log("[V17] Terminal state reached. Clearing current task.");
                        setCurrentTask(null);
                    }
 
                    if (isWait) setTaskStage('AWAITING_EMAIL');
                    if (isSuccess) {
                        setTaskStage('COMPLETED');
                        touchSheerIDWatchdog('success');
                    }
                    if (hasError) {
                        touchSheerIDWatchdog('error');
                    }
 
                    // 遇到致命错误（达到上限），直接重置回 ChatGPT
                    if (isLimitError) {
                        setStatus("❌ 达到验证上限，强制重置...");
                        clearSheerIDWatchdog();
                        setTimeout(() => location.href = "https://chatgpt.com/veterans-claim", 2000);
                        return;
                    }
 
                    // V17 核心: 不断刷新，直到页面变样
                    // 使用 setInterval 而不是 setTimeout，防止浏览器后台休眠导致计时器暂停
                    // 并尝试夺取焦点
                    window.focus();
                    setTimeout(() => location.reload(), 3000);
                    return;
                }
            }
 
            // C. 填表逻辑 (仅当看到表单时)
            if (firstNameEl) {
                const queue = getQueue();
                let currentTask = getCurrentTask();
                const currentStage = getTaskStage();
 
                // 自我修复: 如果之前是等待/完成/填写/提交状态，但当前没任务，说明是上一轮的残留状态
                if (!currentTask && (currentStage === 'AWAITING_EMAIL' || currentStage === 'COMPLETED' || currentStage === 'FILLING' || currentStage === 'SUBMITTING')) {
                    console.log(`[V17] State Reset: ${currentStage} -> IDLE`);
                    setTaskStage('IDLE');
                    clearSheerIDWatchdog();
                }
 
                if (!currentTask && queue.length > 0 && getTaskStage() === 'IDLE') {
                    currentTask = queue.shift();
                    saveQueue(queue);
                    setCurrentTask(currentTask);
                    setTaskStage('FILLING');
                    touchSheerIDWatchdog('pick-task');
                }
 
                if (currentTask) {
                    setTaskStage('FILLING');
                    touchSheerIDWatchdog('filling');
                    await fillSheerIDForm(currentTask, getConfig());
 
                    // C. 点击提交按钮 (V14 逻辑: 直接检查并点击)
                    const submitBtn = document.querySelector(SUBMIT_BTN_SELECTOR);
                    if (submitBtn && submitBtn.getAttribute('aria-disabled') !== 'true') {
                        setTaskStage('SUBMITTING');
                        touchSheerIDWatchdog('submitted');
                        submitBtn.click();
                    }
                    return;
                }
            }
            if (!firstNameEl && !retryBtn) {
                // 可能是加载中，或者是未知的中间状态，稍微刷新一下保活
                // setTimeout(() => location.reload(), 5000);
            }
        }
 
        // 3. SheerID 联动扫描 (仅在等待邮件阶段生效)
        else if (host.includes('outlook.')) {
            processOutlookEmails();
        }
 
        // 4. 重置状态 (如果 host 不匹配且正在运行)
        else if (getIsRunning()) {
            setStatus("📡 脚本运行中 | 监听特定页面...");
        }
    }
 
    // --- UI/事件控制 ---
    function setStatus(msg) { const area = document.getElementById('status_area'); if (area) area.innerText = msg; }
    function updateUI() {
        const queue = getQueue(); const running = getIsRunning();
        const btn = document.getElementById('btn_toggle');
        const count = document.getElementById('queue_count');
        const statusArea = document.getElementById('status_area');
 
        if (count) count.innerText = queue.length;
        if (btn) {
            btn.innerText = running ? "⏸️ 运行中" : "▶️ 启动助手";
            btn.style.background = running ? "#198754" : "#0d6efd";
        }
 
        // 增强状态显示
        if (statusArea) {
            if (!running) {
                statusArea.innerText = "⏸️ 助手已暂停";
                statusArea.style.color = "#6c757d";
            } else if (queue.length === 0 && !getCurrentTask()) {
                statusArea.innerText = "📭 队列为空，等待输入...";
                statusArea.style.color = "#dc3545";
            } else if (statusArea.innerText === "待命中...") {
                statusArea.innerText = "📡 正在寻找目标表单...";
                statusArea.style.color = "#0d6efd";
            }
        }
    }
 
    function bindEvents() {
        document.getElementById('btn_toggle').onclick = () => {
            const running = getIsRunning();
            if (!running) {
                // 启动前检查
                const cfg = getConfig();
                if (cfg.FIXED_EMAIL === "your-email@example.com") {
                    alert("❌ 请先配置有效的邮箱！\n不能使用默认演示邮箱。");
                    return;
                }
                const emailDomain = (cfg.FIXED_EMAIL.split('@')[1] || "").toLowerCase();
                // 使用正则严谨匹配：域名前缀必须精确匹配
                const isValid = /^(outlook|hotmail|live|msn)(\.|$)/.test(emailDomain);
                if (!isValid) {
                    alert("❌ 仅支持 Outlook 系列邮箱！\n(Outlook, Hotmail, Live, MSN)\n因为脚本需要访问 Outlook 网页版进行自动验证。");
                    return;
                }
            }
            setIsRunning(!running);
        };
        document.getElementById('btn_skip').onclick = () => { setCurrentTask(null); setStatus("⏭️ 已跳过..."); };
        document.getElementById('btn_scrape')?.addEventListener('click', () => {
            captureCurrentPage(true);
        });
        document.getElementById('btn_import').onclick = () => {
            try {
                const data = JSON.parse(document.getElementById('bulk_input').value);
                saveQueue(getQueue().concat(data)); 
                alert("导入成功");
            } catch (e) { alert("JSON 格式错误"); }
        };
        document.getElementById('btn_manage')?.addEventListener('click', () => {
            openDataManager();
        });
        document.getElementById('btn_reset').onclick = () => {
            if (confirm("清空并重置？")) {
                GM_deleteValue('global_auth_queue'); 
                GM_deleteValue('current_active_task'); 
                GM_deleteValue('is_script_running');
                location.reload();
            }
        };

        // 自动抓取按钮事件
        if (location.host.includes('gravelocator.cem.va.gov')) {
            document.getElementById('btn_auto_scrape_start')?.addEventListener('click', () => {
                const state = getAutoScrapeState();
                
                if (state.isRunning && !state.isPaused) {
                    // 暂停
                    state.isPaused = true;
                    setAutoScrapeState(state);
                    updateAutoScrapeUI();
                    setAutoScrapeStatus('已暂停');
                } else if (state.isPaused) {
                    // 恢复
                    state.isPaused = false;
                    setAutoScrapeState(state);
                    updateAutoScrapeUI();
                    tickAutoScrapeWatchdog();
                    scheduleAutoScrape(800);
                } else {
                    // 启动
                    const input = document.getElementById('auto_scrape_input').value.trim();
                    if (!input) {
                        alert('请输入Last Name列表！');
                        return;
                    }
                    
                    const names = input.split('\n').map(n => n.trim()).filter(n => n);
                    if (names.length === 0) {
                        alert('没有有效的Last Name！');
                        return;
                    }
                    
                    if (confirm(`将自动处理 ${names.length} 个姓氏，确定开始？`)) {
                        setAutoScrapeState({
                            isRunning: true,
                            isPaused: false,
                            lastNames: names,
                            currentIndex: 0,
                            currentPage: 0,
                            submittedName: '',
                            lastCaptureSignature: ''
                        });
                        updateAutoScrapeUI();
                        tickAutoScrapeWatchdog();
                        scheduleAutoScrape(800);
                    }
                }
            });
            
            document.getElementById('btn_auto_scrape_clear')?.addEventListener('click', () => {
                if (confirm('确定清空自动抓取任务？')) {
                    clearAutoScrapeState();
                    updateAutoScrapeUI();
                    document.getElementById('auto_scrape_input').value = '';
                    setAutoScrapeStatus('未运行');
                }
            });
            
            // 页面加载时更新UI
            updateAutoScrapeUI();
            
            // 检查是否需要继续运行自动抓取
            const state = getAutoScrapeState();
            if (state.isRunning && !state.isPaused) {
                scheduleAutoScrape(1000);
            }
        }

        document.getElementById('btn_config_toggle').onclick = () => {
            const panel = document.getElementById('config_panel');
            const btn = document.getElementById('btn_config_toggle');
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                btn.textContent = '⚙️ 隐藏配置';
            } else {
                panel.style.display = 'none';
                btn.textContent = '⚙️ 显示配置';
            }
        };

        document.getElementById('btn_save_config').onclick = () => {
            const newConfig = {
                FIXED_EMAIL: document.getElementById('cfg_email').value,
                FIXED_STATUS: document.getElementById('cfg_status').value,
                FIXED_DISCHARGE_YEAR: document.getElementById('cfg_discharge_year').value,
                MIN_BIRTH_YEAR: parseInt(document.getElementById('cfg_min_birth_year').value) || 1930,
                SENDER_FILTER: document.getElementById('cfg_sender_filter').value
            };
            saveConfig(newConfig);
            alert('✅ 配置已保存！');
        };
    }
 
    // --- 初始化 ---
    function init() {
        const host = location.host;
        if (host.includes('outlook.')) {
            // Outlook 需要等待 body 稳定
            const checkBody = setInterval(() => {
                if (document.body) {
                    clearInterval(checkBody);
                    createOutlookPanel();
                    setInterval(() => {
                        if (getIsRunning()) processOutlookEmails();
                    }, getOutlookConfig().checkInterval);
                }
            }, 500);
        } else {
            createPanel();
            bindEvents();
            updateUI();
            setInterval(runAutomation, 3000);
        }
    }
 
    init();
})();
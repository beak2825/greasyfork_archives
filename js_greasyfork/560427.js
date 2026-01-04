// ==UserScript==
// @name         美国大兵 GPT 认证
// @namespace    http://tampermonkey.net/
// @version      16.2.1
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
// @downloadURL https://update.greasyfork.org/scripts/560427/%E7%BE%8E%E5%9B%BD%E5%A4%A7%E5%85%B5%20GPT%20%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/560427/%E7%BE%8E%E5%9B%BD%E5%A4%A7%E5%85%B5%20GPT%20%E8%AE%A4%E8%AF%81.meta.js
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

    // --- 状态管理 ---
    function getQueue() { return GM_getValue('global_auth_queue', []); }
    function saveQueue(arr) { GM_setValue('global_auth_queue', arr); updateUI(); }
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
        subBtnRow.style.cssText = "display:flex; gap:5px;";
        const btnScrape = document.createElement('button');
        btnScrape.id = "btn_scrape";
        btnScrape.style.cssText = "flex:1.5; padding: 8px; cursor: pointer; background:#198754; color:white; border:none; border-radius:4px; display:none;";
        btnScrape.textContent = "📥 抓取本页";
        if (location.host.includes('gravelocator.cem.va.gov')) btnScrape.style.display = 'block';
        const btnImport = document.createElement('button');
        btnImport.id = "btn_import";
        btnImport.style.cssText = "flex:1; padding: 8px; cursor: pointer; background:#0d6efd; color:white; border:none; border-radius:4px;";
        btnImport.textContent = "📥 存入";
        const btnReset = document.createElement('button');
        btnReset.id = "btn_reset";
        btnReset.style.cssText = "flex:1; padding: 8px; cursor: pointer; background:#dc3545; color:white; border:none; border-radius:4px;";
        btnReset.textContent = "🗑️ 清空状态";
        subBtnRow.appendChild(btnScrape);
        subBtnRow.appendChild(btnImport);
        subBtnRow.appendChild(btnReset);
        importSection.appendChild(textarea);
        importSection.appendChild(subBtnRow);
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

        const data = {
            branch: task[1],
            first: task[2],
            last: task[3],
            bMonth: task[4],
            bDay: task[5],
            bYear: task[6],
            dMonth: task[7],
            dDay: task[8]
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

        const dmEl = document.querySelector(FIELD_MAP.dMonth);
        if (dmEl) {
            dmEl.focus();
            simulateClick(dmEl);
            await new Promise(r => setTimeout(r, 50));
            setNativeValue(dmEl, data.dMonth);
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
            const urlParams = new URLSearchParams(window.location.search);
            const hasEmailToken = urlParams.has('emailToken');

            // === T2 (验证页): 幽灵模式 ===
            // 只要一打开，就说明 Outlook 已经点击了链接。等待后端处理完，直接关闭。
            if (hasEmailToken) {
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
                    if (isSuccess) setTaskStage('COMPLETED');

                    // 遇到致命错误（达到上限），直接重置回 ChatGPT
                    if (isLimitError) {
                        setStatus("❌ 达到验证上限，强制重置...");
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
                }

                if (!currentTask && queue.length > 0 && getTaskStage() === 'IDLE') {
                    currentTask = queue.shift();
                    saveQueue(queue);
                    setCurrentTask(currentTask);
                    setTaskStage('FILLING');
                }

                if (currentTask) {
                    setTaskStage('FILLING');
                    await fillSheerIDForm(currentTask, getConfig());

                    // C. 点击提交按钮 (V14 逻辑: 直接检查并点击)
                    const submitBtn = document.querySelector(SUBMIT_BTN_SELECTOR);
                    if (submitBtn && submitBtn.getAttribute('aria-disabled') !== 'true') {
                        setTaskStage('SUBMITTING');
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
        document.getElementById('btn_scrape').onclick = () => {
            const data = scrapeGraveLocator(); saveQueue(getQueue().concat(data));
            alert(`捕捉到 ${data.length} 条数据`);
        };
        document.getElementById('btn_import').onclick = () => {
            try {
                const data = JSON.parse(document.getElementById('bulk_input').value);
                saveQueue(getQueue().concat(data)); alert("导入成功");
            } catch (e) { alert("JSON 格式错误"); }
        };
        document.getElementById('btn_reset').onclick = () => {
            if (confirm("清空并重置？")) {
                GM_deleteValue('global_auth_queue'); GM_deleteValue('current_active_task'); GM_deleteValue('is_script_running');
                location.reload();
            }
        };

        // 配置面板事件
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
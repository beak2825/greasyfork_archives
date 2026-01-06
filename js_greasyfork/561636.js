// ==UserScript==
// @name         美国大兵 GPT 认证
// @namespace    http://tampermonkey.net/
// @version      16.7.0
// @description  感谢作者FunkJ， 全流程全自动军人身份验证助手：**白嫖一年 GPT Plus，修复VLM自动翻页 + 动态加载检测 + 数据去重/预览/导出（优化提取）
// @author       Antigravity
// @match        https://services.sheerid.com/*
// @match        https://gravelocator.cem.va.gov/*
// @match        https://www.vlm.cem.va.gov/*
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
// @downloadURL https://update.greasyfork.org/scripts/561636/%E7%BE%8E%E5%9B%BD%E5%A4%A7%E5%85%B5%20GPT%20%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/561636/%E7%BE%8E%E5%9B%BD%E5%A4%A7%E5%85%B5%20GPT%20%E8%AE%A4%E8%AF%81.meta.js
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
    
    // 🆕 VLM 月份简写映射 (如 "Jun-13-1930" 格式)
    const MONTH_ABBR_MAP = {
        "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April",
        "May": "May", "Jun": "June", "Jul": "July", "Aug": "August",
        "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"
    };
    
    function normalizeMonthName(monthStr) {
        if (!monthStr) return "";
        const s = String(monthStr).trim();
        // 处理数字格式 "01", "1" 等
        if (/^\d{1,2}$/.test(s)) {
            const mm = s.padStart(2, "0");
            return MONTH_MAP[mm] || "";
        }
        // 处理简写格式 "Jan", "Jun" 等
        const abbr = s.substring(0, 3);
        if (MONTH_ABBR_MAP[abbr]) return MONTH_ABBR_MAP[abbr];
        // 已经是完整格式
        return s;
    }

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

    // 🆕 自动翻页抓取状态管理
    function getAutoScrapeRunning() { return GM_getValue('auto_scrape_running', false); }
    function setAutoScrapeRunning(bool) { GM_setValue('auto_scrape_running', bool); updateAutoScrapeUI(); }
    function getAutoScrapeCount() { return GM_getValue('auto_scrape_count', 0); }
    function setAutoScrapeCount(count) { GM_setValue('auto_scrape_count', count); }
    function getAutoScrapePageCount() { return GM_getValue('auto_scrape_page_count', 0); }
    function setAutoScrapePageCount(count) { GM_setValue('auto_scrape_page_count', count); }

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
            const emailItems = document.querySelectorAll('div[role="option"], div[data-convid]');
            const history = getProcessedHistory();

            for (let idx = 0; idx < emailItems.length; idx++) {
                const item = emailItems[idx];
                const fullAria = (item.getAttribute('aria-label') || "");
                const ariaLabel = fullAria.toLowerCase();
                const isUnread = ariaLabel.includes('unread') || ariaLabel.includes('未读');
                const isSelected = item.getAttribute('aria-selected') === 'true';

                if (!isUnread || !ariaLabel.includes(getOutlookConfig().senderFilter.toLowerCase()) || isSelected) continue;

                const convId = item.getAttribute('data-convid') || '';
                const stableFingerprint = fullAria.replace(/^(未读|unread|已读|read)\s*/i, '').substring(0, 120).replace(/[^a-zA-Z0-9]/g, '');
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

        const items = document.querySelectorAll('div[role="option"], div[data-convid]');
        logOutlook(`找到 ${items.length} 个邮件项`, 'info');

        Array.from(items).slice(0, 5).forEach((el, i) => {
            const aria = el.getAttribute('aria-label') || '';
            const isSheerID = aria.toLowerCase().includes('sheerid');
            const isUnread = aria.toLowerCase().includes('unread') || aria.toLowerCase().includes('未读');

            logOutlook(`--- 邮件 ${i + 1} ${isSheerID ? '✅SheerID' : ''} ${isUnread ? '📩未读' : ''} ---`, 'debug');
            logOutlook(`aria(前100): ${aria.substring(0, 100)}`, 'debug');
            logOutlook(`data-convid: ${el.getAttribute('data-convid') || '无'}`, 'debug');

            const dataAttrs = Array.from(el.attributes)
                .filter(a => a.name.startsWith('data-'))
                .map(a => `${a.name}=${a.value.substring(0, 30)}`);
            if (dataAttrs.length > 0) {
                logOutlook(`data-*: ${dataAttrs.join(', ')}`, 'debug');
            }
        });

        const sheerIdUnread = Array.from(items).filter(el => {
            const aria = (el.getAttribute('aria-label') || '').toLowerCase();
            return aria.includes('sheerid') && (aria.includes('unread') || aria.includes('未读'));
        });
        logOutlook(`SheerID 未读邮件数: ${sheerIdUnread.length}`, 'info');

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
                <h3>📧 Outlook 联动窗 (V16.3)</h3>
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
        setInterval(syncOutlookUI, 2000);
        logOutlook("Outlook 联动模块已就绪");
        updateOutlookUI();
    }

    // --- 通用工具函数 ---
    function simulateClick(el) {
        if (!el) return;
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }

    function setNativeValue(element, value) {
        if (!element) return;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
            Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, value);
        } else {
            element.value = value;
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function pressEnter(element) {
        if (!element) return;
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
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

    // --- GraveLocator 抓取逻辑 ---
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
            "GLOBAL", "GLOBAL"
        ]);
    }

    // 🆕 VLM 搜索列表页抓取逻辑 (直接从搜索结果表格提取，无需进入详情页)
    // 列表页 URL 示例: https://www.vlm.cem.va.gov/search?lname=V&dodFrom=01%2F01%2F2025&dodTo=09%2F30%2F2025&serviceBranch=AR
    // 表格列顺序: First Name | Middle Name | Last Name | DOB | Country/State/Territory | DOD | Cemetery | War Period | Service Branch | Decoration(s)
    // 日期格式: "Jun-13-1930" 或 "Apr-04-2025"
    function scrapeVLMList() {
        let records = [];
        const cfg = getConfig();
        
        // 检测是否在搜索列表页
        const isSearchPage = location.pathname.includes('/search') || location.search.includes('lname=');
        console.log(`[VLM] Current URL: ${location.href}, isSearchPage: ${isSearchPage}`);
        
        // 查找表格行 - VLM 使用 Chakra UI，结构为 table > tbody > tr
        let dataRows = [];
        
        // 方案1: 直接查找表格行 (最可靠)
        const tableRows = document.querySelectorAll('table tbody tr');
        if (tableRows.length > 0) {
            dataRows = Array.from(tableRows);
            console.log(`[VLM] Found ${dataRows.length} table rows via 'table tbody tr'`);
        }
        
        // 方案2: 查找带有 role="row" 的元素 (备用)
        if (dataRows.length === 0) {
            const roleRows = document.querySelectorAll('[role="row"]');
            // 排除表头行
            dataRows = Array.from(roleRows).filter(row => {
                const cells = row.querySelectorAll('td, [role="cell"]');
                return cells.length > 0;
            });
            console.log(`[VLM] Found ${dataRows.length} rows via role="row"`);
        }
        
        // 方案3: 查找包含日期格式的行
        if (dataRows.length === 0) {
            const allRows = document.querySelectorAll('tr, [class*="css-"]');
            dataRows = Array.from(allRows).filter(row => {
                const text = row.textContent || "";
                // 检查是否包含日期格式 (如 Jun-13-1930)
                return /[A-Za-z]{3}-\d{1,2}-\d{4}/.test(text);
            });
            console.log(`[VLM] Found ${dataRows.length} rows via date pattern matching`);
        }
        
        console.log(`[VLM] Processing ${dataRows.length} data rows...`);
        
        dataRows.forEach((row, idx) => {
            try {
                // 获取所有单元格 (td 或 role="cell")
                const cells = row.querySelectorAll('td, [role="cell"]');
                if (cells.length < 6) {
                    console.log(`[VLM] Row ${idx}: Only ${cells.length} cells, skipping`);
                    return;
                }
                
                // 提取每个单元格的文本
                const cellTexts = Array.from(cells).map(c => (c.textContent || "").trim());
                console.log(`[VLM] Row ${idx} cells:`, cellTexts);
                
                // 表格列顺序 (基于截图):
                // 0: First Name, 1: Middle Name, 2: Last Name, 3: DOB, 4: Country/State, 5: DOD, 6: Cemetery, 7: War Period, 8: Service Branch, 9: Decoration(s)
                const firstName = cellTexts[0] || "";
                const middleName = cellTexts[1] || "";
                const lastName = cellTexts[2] || "";
                const dobText = cellTexts[3] || "";
                const dodText = cellTexts[5] || "";
                const branchText = cellTexts[8] || "";
                
                // 解析 DOB: 格式 "Jun-13-1930"
                const dobMatch = dobText.match(/([A-Za-z]{3})-(\d{1,2})-(\d{4})/);
                // 解析 DOD: 格式 "Mar-08-2025"
                const dodMatch = dodText.match(/([A-Za-z]{3})-(\d{1,2})-(\d{4})/);
                
                if (!firstName || !lastName) {
                    console.log(`[VLM] Row ${idx}: Missing name, skipping`);
                    return;
                }
                
                if (!dobMatch) {
                    console.log(`[VLM] Row ${idx}: Cannot parse DOB "${dobText}", skipping`);
                    return;
                }
                
                const bMonth = normalizeMonthName(dobMatch[1]);
                const bDay = dobMatch[2];
                const bYear = dobMatch[3];
                
                const dMonth = dodMatch ? normalizeMonthName(dodMatch[1]) : "January";
                const dDay = dodMatch ? dodMatch[2] : "01";
                
                // 检查出生年份是否符合要求
                if (parseInt(bYear) < cfg.MIN_BIRTH_YEAR) {
                    console.log(`[VLM] Row ${idx}: Birth year ${bYear} < ${cfg.MIN_BIRTH_YEAR}, skipping ${firstName} ${lastName}`);
                    return;
                }
                
                // 提取军种
                const branch = getExactBranch(branchText);
                
                records.push({
                    firstName: firstName,
                    lastName: lastName,
                    branch: branch,
                    bMonth: bMonth,
                    bDay: bDay,
                    bYear: bYear,
                    dMonth: dMonth,
                    dDay: dDay
                });
                
                console.log(`[VLM] ✅ Extracted: ${firstName} ${lastName}, Branch: ${branch}, DOB: ${bMonth} ${bDay}, ${bYear}, DOD: ${dMonth} ${dDay}`);
                
            } catch (e) {
                console.error(`[VLM] Error parsing row ${idx}:`, e);
            }
        });
        
        console.log(`[VLM] Successfully extracted ${records.length} records from list page`);
        
        return records.map(r => [
            "GLOBAL", r.branch, r.firstName, r.lastName,
            r.bMonth, r.bDay, r.bYear,
            r.dMonth || "January", r.dDay || "01",
            "GLOBAL", "GLOBAL"
        ]);
    }
    
    // 🆕 通用抓取函数 - 根据当前网站自动选择抓取方法
    function scrapeCurrentPage() {
        const host = location.host;
        if (host.includes('vlm.cem.va.gov')) {
            return scrapeVLMList();
        } else if (host.includes('gravelocator.cem.va.gov')) {
            return scrapeGraveLocator();
        }
        return [];
    }

    // 🆕 自动翻页抓取功能 (支持多种网站)
    async function autoScrapeAllPages() {
        if (!getAutoScrapeRunning()) return;

        // 等待页面加载完成
        await new Promise(r => setTimeout(r, 2000));

        const host = location.host;
        
        // 1. 抓取当前页
        const data = scrapeCurrentPage();
        const pageCount = getAutoScrapePageCount() + 1;
        setAutoScrapePageCount(pageCount);

        if (data.length > 0) {
            const newCount = getAutoScrapeCount() + data.length;
            setAutoScrapeCount(newCount);
            saveQueue(getQueue().concat(data));
            setStatus(`✅ 第 ${pageCount} 页: 抓取 ${data.length} 条 | 累计: ${newCount} 条`);
            console.log(`[AutoScrape] Page ${pageCount}: ${data.length} records, Total: ${newCount}`);
        } else {
            setStatus(`⚠️ 第 ${pageCount} 页: 未找到数据`);
            console.log(`[AutoScrape] Page ${pageCount}: No data found`);
        }

        // 2. 查找下一页按钮 (根据不同网站使用不同选择器)
        let nextBtn = null;
        
        if (host.includes('gravelocator.cem.va.gov')) {
            nextBtn = document.querySelector('a[aria-label="Goto Next Page"]');
        } else if (host.includes('vlm.cem.va.gov')) {
            // VLM 分页结构: 数字按钮 + ">" 箭头按钮
            // 优先查找 ">" 箭头按钮
            const allButtons = document.querySelectorAll('button, a, [role="button"]');
            for (const btn of allButtons) {
                const text = (btn.textContent || "").trim();
                const ariaLabel = (btn.getAttribute('aria-label') || "").toLowerCase();
                
                // 查找 ">" 或 "›" 或 "Next" 按钮
                if (text === '>' || text === '›' || text === '»' || 
                    ariaLabel.includes('next') || ariaLabel.includes('下一页')) {
                    // 确保按钮不是禁用状态
                    const isDisabled = btn.disabled || 
                                       btn.classList.contains('disabled') || 
                                       btn.getAttribute('aria-disabled') === 'true' ||
                                       btn.hasAttribute('disabled') ||
                                       btn.style.pointerEvents === 'none' ||
                                       btn.style.opacity === '0.5';
                    if (!isDisabled) {
                        nextBtn = btn;
                        console.log(`[AutoScrape] Found next button:`, btn);
                        break;
                    }
                }
            }
            
            // 备用方案: 查找当前页码，然后点击下一个数字
            if (!nextBtn) {
                const paginationBtns = document.querySelectorAll('button, a');
                const pageNumbers = [];
                let currentPageNum = null;
                
                for (const btn of paginationBtns) {
                    const text = (btn.textContent || "").trim();
                    const num = parseInt(text);
                    if (!isNaN(num) && num > 0 && num < 1000) {
                        // 检查是否是当前页（通常有特殊样式）
                        const isCurrent = btn.classList.contains('active') || 
                                         btn.classList.contains('current') ||
                                         btn.getAttribute('aria-current') === 'page' ||
                                         btn.style.fontWeight === 'bold' ||
                                         btn.style.backgroundColor !== '';
                        pageNumbers.push({ btn, num, isCurrent });
                        if (isCurrent) {
                            currentPageNum = num;
                        }
                    }
                }
                
                // 如果找到当前页码，点击下一个数字
                if (currentPageNum) {
                    const nextPageBtn = pageNumbers.find(p => p.num === currentPageNum + 1);
                    if (nextPageBtn) {
                        nextBtn = nextPageBtn.btn;
                        console.log(`[AutoScrape] Found next page number button: ${currentPageNum + 1}`);
                    }
                }
            }
        }

        if (nextBtn && getAutoScrapeRunning()) {
            setStatus(`📖 第 ${pageCount} 页完成，2秒后跳转下一页...`);
            updateAutoScrapeUI();
            
            // 保存当前表格内容的签名，用于检测页面是否更新
            const oldTableSignature = getTableSignature();
            
            await new Promise(r => setTimeout(r, 1000));

            if (getAutoScrapeRunning()) {
                console.log(`[AutoScrape] Clicking next page button...`);
                nextBtn.click();
                
                // 等待页面内容更新（VLM是动态加载，不会刷新页面）
                let waitCount = 0;
                const maxWait = 20; // 最多等待20秒
                
                while (waitCount < maxWait && getAutoScrapeRunning()) {
                    await new Promise(r => setTimeout(r, 1000));
                    waitCount++;
                    
                    const newTableSignature = getTableSignature();
                    if (newTableSignature !== oldTableSignature) {
                        console.log(`[AutoScrape] Page content changed after ${waitCount}s`);
                        break;
                    }
                    
                    setStatus(`⏳ 等待页面加载... ${waitCount}s`);
                }
                
                // 继续抓取下一页
                if (getAutoScrapeRunning()) {
                    await new Promise(r => setTimeout(r, 1000));
                    autoScrapeAllPages();
                }
            }
        } else {
            // 没有下一页或已停止，结束自动抓取
            const totalCount = getAutoScrapeCount();
            const totalPages = getAutoScrapePageCount();
            
            setAutoScrapeRunning(false);
            setStatus(`🏁 抓取完成！共 ${totalPages} 页，${totalCount} 条数据`);
            
            // 重置计数器
            setAutoScrapeCount(0);
            setAutoScrapePageCount(0);
            
            updateAutoScrapeUI();
            alert(`✅ 自动翻页抓取完成！\n\n📊 统计:\n- 总页数: ${totalPages} 页\n- 总记录: ${totalCount} 条\n\n数据已添加到队列中。`);
        }
    }
    
    // 获取表格内容签名，用于检测页面是否更新
    function getTableSignature() {
        const rows = document.querySelectorAll('table tbody tr');
        if (rows.length === 0) return '';
        
        // 取前3行的文本作为签名
        const texts = [];
        for (let i = 0; i < Math.min(3, rows.length); i++) {
            texts.push((rows[i].textContent || "").trim().substring(0, 50));
        }
        return texts.join('|');
    }

    function updateAutoScrapeUI() {
        const btn = document.getElementById('btn_auto_scrape');
        const statusEl = document.getElementById('auto_scrape_status');
        
        if (btn) {
            const running = getAutoScrapeRunning();
            btn.textContent = running ? "⏹️ 停止自动抓取" : "🔄 自动翻页抓取";
            btn.style.background = running ? "#dc3545" : "#9c27b0";
        }
        
        if (statusEl) {
            const running = getAutoScrapeRunning();
            const count = getAutoScrapeCount();
            const pages = getAutoScrapePageCount();
            if (running) {
                statusEl.textContent = `正在抓取: 第 ${pages} 页 | 累计 ${count} 条`;
                statusEl.style.display = 'block';
            } else {
                statusEl.style.display = 'none';
            }
        }
    }

    // --- SheerID 表单填写逻辑 ---
    async function fillSheerIDForm(task, cfg) {
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

        setNativeValue(document.querySelector(FIELD_MAP.dYear), cfg.FIXED_DISCHARGE_YEAR);

        console.log(`[Filling] Using Global Email: ${cfg.FIXED_EMAIL}`);
        setNativeValue(document.querySelector(FIELD_MAP.email), cfg.FIXED_EMAIL);
    }

    // --- 自动化循环 ---
    async function runAutomation() {
        if (!getIsRunning()) return;
        const host = location.host;

        // 1. ChatGPT 自动点击
        if (host.includes('chatgpt.com')) {
            const btn = Array.from(document.querySelectorAll('a, button, [role="button"]')).find(el => {
                const text = (el.textContent || "").toLowerCase();
                return CHATGPT_CLAIM_TEXTS.some(t => text.includes(t.toLowerCase())) || el.href?.includes('sheerid.com');
            });
            if (btn) {
                const targetUrl = btn.href;
                if (targetUrl && targetUrl.includes('sheerid.com')) {
                    setStatus("🚀 强制接管链接并开启所属权...");
                    GM_openInTab(targetUrl, { active: true, insert: true, setParent: true });
                } else {
                    setStatus("🚀 点击验证按钮...");
                    btn.click();
                }
            }
        }

        // 2. SheerID 验证流程
        else if (host.includes('services.sheerid.com')) {
            const urlParams = new URLSearchParams(window.location.search);
            const hasEmailToken = urlParams.has('emailToken');

            if (hasEmailToken) {
                setStatus("🏁 验证页: 激活后端验证...");
                setTimeout(() => {
                    console.log("[T2] Backend should be done. Closing.");
                    window.close();
                }, 1500);
                return;
            }

            const pageText = document.body.textContent.toLowerCase();
            const firstNameEl = document.querySelector(FIELD_MAP.firstName);

            const retryBtn = Array.from(document.querySelectorAll('button, a')).find(el => {
                const t = (el.textContent || "").trim();
                return SHEERID_RETRY_TEXTS.some(kw => t.toLowerCase() === kw.toLowerCase() || t.includes(kw));
            });

            if (retryBtn) {
                setStatus("🔄 发现重置按钮，点击以开始新任务...");
                retryBtn.click();
                return;
            }

            const WAIT_KEYWORDS = ["check your email", "sent an email", "verification email"];
            const SUCCESS_KEYWORDS = ["you've been verified", "you have been verified", "success", "you're confirmed", "congratulations"];
            const hasContinueBtn = !!Array.from(document.querySelectorAll('button, a')).find(el =>
                (el.textContent || "").toLowerCase().trim() === 'continue'
            );

            if (!firstNameEl) {
                const isWait = WAIT_KEYWORDS.some(k => pageText.includes(k));
                const isSuccess = SUCCESS_KEYWORDS.some(k => pageText.includes(k)) || hasContinueBtn;
                const hasError = pageText.includes("error") || pageText.includes("limit exceeded") ||
                    pageText.includes("unable to verify") || pageText.includes("could not verify");
                const isLimitError = pageText.includes("verification limit exceeded") || pageText.includes("already redeemed");

                if (isWait || isSuccess || hasError) {
                    const statusStr = isSuccess ? "✅ 验证成功" : (hasError ? "❌ 发生错误" : "⏳ 等待邮件链接点击...");
                    setStatus(`${statusStr} | 3秒后刷新检测状态...`);

                    if (getCurrentTask()) {
                        console.log("[V17] Terminal state reached. Clearing current task.");
                        setCurrentTask(null);
                    }

                    if (isWait) setTaskStage('AWAITING_EMAIL');
                    if (isSuccess) setTaskStage('COMPLETED');

                    if (isLimitError) {
                        setStatus("❌ 达到验证上限，强制重置...");
                        setTimeout(() => location.href = "https://chatgpt.com/veterans-claim", 2000);
                        return;
                    }

                    window.focus();
                    setTimeout(() => location.reload(), 3000);
                    return;
                }
            }

            if (firstNameEl) {
                const queue = getQueue();
                let currentTask = getCurrentTask();
                const currentStage = getTaskStage();

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

                    const submitBtn = document.querySelector(SUBMIT_BTN_SELECTOR);
                    if (submitBtn && submitBtn.getAttribute('aria-disabled') !== 'true') {
                        setTaskStage('SUBMITTING');
                        submitBtn.click();
                    }
                    return;
                }
            }
        }

        // 3. Outlook 联动扫描
        else if (host.includes('outlook.')) {
            processOutlookEmails();
        }

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
        
        updateAutoScrapeUI();
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
        title.textContent = "🚀 认证助手 V16.5 (完整版)";
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
        btnSkip.textContent = "⏭️ 跳过";
        btnSkip.style.cssText = "flex:1; padding: 12px; border: none; background: #6c757d; border-radius: 4px; color: white; cursor: pointer;";
        btnRow.appendChild(btnToggle);
        btnRow.appendChild(btnSkip);
        div.appendChild(btnRow);

        // 🆕 自动翻页抓取按钮区域
        const autoScrapeSection = document.createElement('div');
        autoScrapeSection.style.cssText = "margin-bottom: 10px; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px;";
        
        const autoScrapeBtn = document.createElement('button');
        autoScrapeBtn.id = "btn_auto_scrape";
        autoScrapeBtn.textContent = "🔄 自动翻页抓取";
        autoScrapeBtn.style.cssText = "width:100%; padding:12px; border:none; border-radius:4px; background:#9c27b0; color:white; cursor:pointer; font-weight:bold; font-size:14px; margin-bottom:8px;";
        
        const autoScrapeStatus = document.createElement('div');
        autoScrapeStatus.id = "auto_scrape_status";
        autoScrapeStatus.style.cssText = "color:white; font-size:12px; text-align:center; display:none;";
        
        const autoScrapeHint = document.createElement('div');
        autoScrapeHint.style.cssText = "color:rgba(255,255,255,0.8); font-size:11px; text-align:center;";
        autoScrapeHint.textContent = "📖 支持 GraveLocator 和 VLM 列表页自动翻页抓取";
        
        autoScrapeSection.appendChild(autoScrapeBtn);
        autoScrapeSection.appendChild(autoScrapeStatus);
        autoScrapeSection.appendChild(autoScrapeHint);
        div.appendChild(autoScrapeSection);

        // 手动抓取按钮
        const btnScrape = document.createElement('button');
        btnScrape.id = "btn_scrape";
        btnScrape.textContent = "📥 抓取本页";
        btnScrape.style.cssText = "width:100%; padding:10px; border:none; border-radius:4px; background:#17a2b8; color:white; cursor:pointer; font-weight:bold; margin-bottom:8px;";
        div.appendChild(btnScrape);

        // 🆕 数据去重按钮
        const dedupeSection = document.createElement('div');
        dedupeSection.style.cssText = "margin-bottom: 10px;";
        
        const btnDedupe = document.createElement('button');
        btnDedupe.id = "btn_dedupe";
        btnDedupe.textContent = "🧹 一键去重";
        btnDedupe.style.cssText = "width:100%; padding:10px; border:none; border-radius:4px; background:linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color:white; cursor:pointer; font-weight:bold; font-size:14px;";
        
        const dedupeHint = document.createElement('div');
        dedupeHint.style.cssText = "color:#666; font-size:10px; text-align:center; margin-top:4px;";
        dedupeHint.textContent = "移除队列中重复的数据（按姓名+出生日期判断）";
        
        dedupeSection.appendChild(btnDedupe);
        dedupeSection.appendChild(dedupeHint);
        div.appendChild(dedupeSection);

        const textarea = document.createElement('textarea');
        textarea.id = "bulk_input";
        textarea.placeholder = '批量导入 JSON 数据...';
        textarea.style.cssText = "width:100%; height:50px; margin-bottom:8px; border:1px solid #ddd; border-radius:4px; padding:8px; box-sizing:border-box; font-size:11px;";
        div.appendChild(textarea);

        // 🆕 导入/导出按钮行
        const importExportRow = document.createElement('div');
        importExportRow.style.cssText = "display:flex; gap:5px; margin-bottom:8px;";
        
        const btnImport = document.createElement('button');
        btnImport.id = "btn_import";
        btnImport.textContent = "📥 导入";
        btnImport.style.cssText = "flex:1; padding:8px; border:none; border-radius:4px; background:#28a745; color:white; cursor:pointer; font-weight:bold;";
        
        const btnExportJSON = document.createElement('button');
        btnExportJSON.id = "btn_export_json";
        btnExportJSON.textContent = "📤 导出JSON";
        btnExportJSON.style.cssText = "flex:1; padding:8px; border:none; border-radius:4px; background:#6f42c1; color:white; cursor:pointer; font-weight:bold;";
        
        const btnExportCSV = document.createElement('button');
        btnExportCSV.id = "btn_export_csv";
        btnExportCSV.textContent = "📊 导出CSV";
        btnExportCSV.style.cssText = "flex:1; padding:8px; border:none; border-radius:4px; background:#fd7e14; color:white; cursor:pointer; font-weight:bold;";
        
        importExportRow.appendChild(btnImport);
        importExportRow.appendChild(btnExportJSON);
        importExportRow.appendChild(btnExportCSV);
        div.appendChild(importExportRow);
        
        // 🆕 数据预览按钮
        const btnPreview = document.createElement('button');
        btnPreview.id = "btn_preview";
        btnPreview.textContent = "👁️ 预览队列数据";
        btnPreview.style.cssText = "width:100%; padding:8px; border:none; border-radius:4px; background:#20c997; color:white; cursor:pointer; font-weight:bold; margin-bottom:8px;";
        div.appendChild(btnPreview);
        
        // 🆕 数据预览面板 (默认隐藏)
        const previewPanel = document.createElement('div');
        previewPanel.id = "preview_panel";
        previewPanel.style.cssText = "display:none; max-height:200px; overflow-y:auto; background:#f8f9fa; border:1px solid #ddd; border-radius:4px; padding:8px; margin-bottom:8px; font-size:11px;";
        div.appendChild(previewPanel);

        // 配置面板切换按钮
        const btnConfigToggle = document.createElement('button');
        btnConfigToggle.id = "btn_config_toggle";
        btnConfigToggle.textContent = "⚙️ 显示配置";
        btnConfigToggle.style.cssText = "width:100%; padding:8px; border:none; border-radius:4px; background:#6f42c1; color:white; cursor:pointer; margin-bottom:8px;";
        div.appendChild(btnConfigToggle);

        // 配置面板
        const configPanel = document.createElement('div');
        configPanel.id = "config_panel";
        configPanel.style.cssText = "display:none; padding:10px; background:#f8f9fa; border-radius:4px; margin-bottom:8px;";
        const cfg = getConfig();
        configPanel.innerHTML = `
            <div style="margin-bottom:8px;">
                <label style="font-size:11px; color:#666;">邮箱地址:</label>
                <input id="cfg_email" type="email" value="${cfg.FIXED_EMAIL}" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            </div>
            <div style="margin-bottom:8px;">
                <label style="font-size:11px; color:#666;">军人状态:</label>
                <input id="cfg_status" type="text" value="${cfg.FIXED_STATUS}" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            </div>
            <div style="margin-bottom:8px;">
                <label style="font-size:11px; color:#666;">退役年份:</label>
                <input id="cfg_discharge_year" type="text" value="${cfg.FIXED_DISCHARGE_YEAR}" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            </div>
            <div style="margin-bottom:8px;">
                <label style="font-size:11px; color:#666;">最小出生年份:</label>
                <input id="cfg_min_birth_year" type="number" value="${cfg.MIN_BIRTH_YEAR}" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            </div>
            <div style="margin-bottom:8px;">
                <label style="font-size:11px; color:#666;">邮件发件人过滤:</label>
                <input id="cfg_sender_filter" type="text" value="${cfg.SENDER_FILTER}" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            </div>
            <button id="btn_save_config" style="width:100%; padding:8px; border:none; border-radius:4px; background:#28a745; color:white; cursor:pointer;">💾 保存配置</button>
        `;
        div.appendChild(configPanel);

        const btnReset = document.createElement('button');
        btnReset.id = "btn_reset";
        btnReset.textContent = "🗑️ 重置";
        btnReset.style.cssText = "width:100%; padding:8px; border:none; border-radius:4px; background:#dc3545; color:white; cursor:pointer;";
        div.appendChild(btnReset);

        document.body.appendChild(div);
    }

    function bindEvents() {
        document.getElementById('btn_toggle').onclick = () => {
            const running = getIsRunning();
            if (!running) {
                const cfg = getConfig();
                if (cfg.FIXED_EMAIL === "your-email@example.com") {
                    alert("❌ 请先配置有效的邮箱！\n不能使用默认演示邮箱。");
                    return;
                }
                const emailDomain = (cfg.FIXED_EMAIL.split('@')[1] || "").toLowerCase();
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
            const host = location.host;
            if (!host.includes('gravelocator.cem.va.gov') && !host.includes('vlm.cem.va.gov')) {
                alert("❌ 请先打开 gravelocator.cem.va.gov 或 vlm.cem.va.gov 网站的搜索结果页面！");
                return;
            }
            const data = scrapeCurrentPage();
            saveQueue(getQueue().concat(data));
            alert(`✅ 捕捉到 ${data.length} 条数据`);
        };
        
        // 🆕 自动翻页抓取按钮事件 (支持多种网站)
        document.getElementById('btn_auto_scrape').onclick = () => {
            if (getAutoScrapeRunning()) {
                // 停止自动抓取
                setAutoScrapeRunning(false);
                setStatus("⏹️ 已停止自动抓取");
                
                const totalCount = getAutoScrapeCount();
                const totalPages = getAutoScrapePageCount();
                
                // 重置计数器
                setAutoScrapeCount(0);
                setAutoScrapePageCount(0);
                
                updateAutoScrapeUI();
                alert(`⏹️ 已停止自动抓取\n\n📊 本次统计:\n- 已抓取页数: ${totalPages} 页\n- 已抓取记录: ${totalCount} 条`);
            } else {
                const host = location.host;
                // 检查是否在支持的页面
                if (!host.includes('gravelocator.cem.va.gov') && !host.includes('vlm.cem.va.gov')) {
                    alert("❌ 请先打开以下网站的搜索结果页面：\n\n1. gravelocator.cem.va.gov\n2. vlm.cem.va.gov");
                    return;
                }
                
                // 重置计数器并开始
                setAutoScrapeCount(0);
                setAutoScrapePageCount(0);
                setAutoScrapeRunning(true);
                
                updateAutoScrapeUI();
                setStatus("🚀 开始自动翻页抓取...");
                
                // 开始抓取
                autoScrapeAllPages();
            }
        };
        
        document.getElementById('btn_import').onclick = () => {
            const text = document.getElementById('bulk_input').value.trim();
            if (!text) {
                alert("❌ 请先粘贴数据到输入框！");
                return;
            }
            try {
                let newData = [];
                // 检测 JSON 格式
                if (text.startsWith('[') && text.endsWith(']')) {
                    newData = JSON.parse(text);
                    if (!Array.isArray(newData)) throw new Error("格式错误");
                } else {
                    alert("❌ 请粘贴有效的 JSON 数组格式数据");
                    return;
                }
                
                // 🆕 导入时自动去重
                const currentQueue = getQueue();
                const seen = new Set();
                
                // 先将现有数据加入 seen
                currentQueue.forEach(row => {
                    const firstName = (row[2] || "").toLowerCase().trim();
                    const lastName = (row[3] || "").toLowerCase().trim();
                    const bMonth = (row[4] || "").toLowerCase().trim();
                    const bDay = (row[5] || "").toString().trim();
                    const bYear = (row[6] || "").toString().trim();
                    const key = `${firstName}|${lastName}|${bMonth}|${bDay}|${bYear}`;
                    seen.add(key);
                });
                
                // 过滤新数据中的重复项
                let addedCount = 0;
                let skippedCount = 0;
                const uniqueNewData = [];
                
                newData.forEach(row => {
                    const firstName = (row[2] || "").toLowerCase().trim();
                    const lastName = (row[3] || "").toLowerCase().trim();
                    const bMonth = (row[4] || "").toLowerCase().trim();
                    const bDay = (row[5] || "").toString().trim();
                    const bYear = (row[6] || "").toString().trim();
                    const key = `${firstName}|${lastName}|${bMonth}|${bDay}|${bYear}`;
                    
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueNewData.push(row);
                        addedCount++;
                    } else {
                        skippedCount++;
                    }
                });
                
                saveQueue(currentQueue.concat(uniqueNewData));
                document.getElementById('bulk_input').value = "";
                
                let msg = `✅ 导入完成！\n\n📊 统计:\n- 新增: ${addedCount} 条`;
                if (skippedCount > 0) {
                    msg += `\n- 跳过重复: ${skippedCount} 条`;
                }
                alert(msg);
            } catch (e) { 
                alert("❌ JSON 格式错误: " + e.message); 
            }
        };
        
        // 🆕 数据预览功能
        document.getElementById('btn_preview').onclick = () => {
            const queue = getQueue();
            const panel = document.getElementById('preview_panel');
            
            if (panel.style.display !== 'none') {
                panel.style.display = 'none';
                document.getElementById('btn_preview').textContent = "👁️ 预览队列数据";
                return;
            }
            
            if (queue.length === 0) {
                panel.innerHTML = '<div style="text-align:center; color:#999; padding:20px;">队列为空</div>';
            } else {
                let html = `<div style="font-weight:bold; margin-bottom:8px; color:#495057;">共 ${queue.length} 条数据:</div>`;
                html += '<table style="width:100%; border-collapse:collapse; font-size:10px;">';
                html += '<tr style="background:#e9ecef;"><th style="padding:4px; border:1px solid #ddd;">#</th><th style="padding:4px; border:1px solid #ddd;">姓名</th><th style="padding:4px; border:1px solid #ddd;">军种</th><th style="padding:4px; border:1px solid #ddd;">出生日期</th></tr>';
                
                // 只显示前50条
                const displayData = queue.slice(0, 50);
                displayData.forEach((row, idx) => {
                    const firstName = row[2] || "";
                    const lastName = row[3] || "";
                    const branch = row[1] || "";
                    const bMonth = row[4] || "";
                    const bDay = row[5] || "";
                    const bYear = row[6] || "";
                    html += `<tr><td style="padding:3px; border:1px solid #ddd; text-align:center;">${idx + 1}</td><td style="padding:3px; border:1px solid #ddd;">${firstName} ${lastName}</td><td style="padding:3px; border:1px solid #ddd;">${branch}</td><td style="padding:3px; border:1px solid #ddd;">${bMonth} ${bDay}, ${bYear}</td></tr>`;
                });
                html += '</table>';
                
                if (queue.length > 50) {
                    html += `<div style="text-align:center; color:#666; margin-top:8px;">... 还有 ${queue.length - 50} 条数据未显示</div>`;
                }
                panel.innerHTML = html;
            }
            
            panel.style.display = 'block';
            document.getElementById('btn_preview').textContent = "👁️ 隐藏预览";
        };
        
        // 🆕 导出 JSON 功能
        document.getElementById('btn_export_json').onclick = () => {
            const queue = getQueue();
            if (queue.length === 0) {
                alert("❌ 当前队列为空，没有数据可以导出！");
                return;
            }
            const jsonStr = JSON.stringify(queue, null, 2);
            navigator.clipboard.writeText(jsonStr).then(() => {
                alert(`✅ 已复制 ${queue.length} 条数据到剪贴板！\n\n使用方法：\n1. 发送给朋友\n2. 朋友粘贴到输入框\n3. 点击【📥 导入】即可`);
            }).catch(err => {
                // 备用方案：下载文件
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `veteran_data_${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                alert(`✅ 已下载 ${queue.length} 条数据`);
            });
        };
        
        // 🆕 导出 CSV 功能
        document.getElementById('btn_export_csv').onclick = () => {
            const queue = getQueue();
            if (queue.length === 0) {
                alert("❌ 当前队列为空，没有数据可以导出！");
                return;
            }
            // CSV 表头
            const headers = ['Status', 'Branch', 'FirstName', 'LastName', 'BirthMonth', 'BirthDay', 'BirthYear', 'DeathMonth', 'DeathDay', 'DischargeYear', 'Email'];
            const csvRows = [headers.join(',')];
            
            queue.forEach(row => {
                const csvRow = row.map(cell => {
                    // 处理包含逗号或引号的单元格
                    const cellStr = String(cell || '');
                    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                        return `"${cellStr.replace(/"/g, '""')}"`;
                    }
                    return cellStr;
                });
                csvRows.push(csvRow.join(','));
            });
            
            const csvContent = csvRows.join('\n');
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' }); // 添加 BOM 支持中文
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `veteran_data_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            alert(`✅ 已下载 ${queue.length} 条数据为 CSV 文件`);
        };
        
        // 🆕 一键去重功能
        document.getElementById('btn_dedupe').onclick = () => {
            const queue = getQueue();
            if (queue.length === 0) {
                alert("❌ 队列为空，无需去重！");
                return;
            }
            
            // 使用 Set 去重，基于 姓名 + 出生日期 生成唯一键
            const seen = new Set();
            const uniqueData = [];
            let duplicateCount = 0;
            
            queue.forEach(row => {
                // row[2] = firstName, row[3] = lastName, row[4] = bMonth, row[5] = bDay, row[6] = bYear
                const firstName = (row[2] || "").toLowerCase().trim();
                const lastName = (row[3] || "").toLowerCase().trim();
                const bMonth = (row[4] || "").toLowerCase().trim();
                const bDay = (row[5] || "").toString().trim();
                const bYear = (row[6] || "").toString().trim();
                
                // 生成唯一标识
                const key = `${firstName}|${lastName}|${bMonth}|${bDay}|${bYear}`;
                
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueData.push(row);
                } else {
                    duplicateCount++;
                }
            });
            
            if (duplicateCount === 0) {
                alert("✅ 队列中没有重复数据！");
                return;
            }
            
            saveQueue(uniqueData);
            setStatus(`🧹 已去重: 移除 ${duplicateCount} 条重复数据`);
            alert(`✅ 去重完成！\n\n📊 统计:\n- 原有数据: ${queue.length} 条\n- 重复数据: ${duplicateCount} 条\n- 保留数据: ${uniqueData.length} 条`);
        };
        
        document.getElementById('btn_reset').onclick = () => {
            if (confirm("清空并重置？")) {
                GM_deleteValue('global_auth_queue'); 
                GM_deleteValue('current_active_task'); 
                GM_deleteValue('is_script_running');
                GM_deleteValue('auto_scrape_running');
                GM_deleteValue('auto_scrape_count');
                GM_deleteValue('auto_scrape_page_count');
                location.reload();
            }
        };

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
            
            // 🆕 如果自动抓取正在运行且在支持的页面，延迟后继续抓取
            if ((host.includes('gravelocator.cem.va.gov') || host.includes('vlm.cem.va.gov')) && getAutoScrapeRunning()) {
                console.log("[AutoScrape] Resuming auto-scrape after page load...");
                setTimeout(() => autoScrapeAllPages(), 2000);
            }
        }
    }

    init();
})();

// ==UserScript==
// @name         ChatGPT 身份认证全自动 (V21.1 增强版)GPT认证
// @namespace    http://tampermonkey.net/
// @version      21.1.4
// @description  加强版，自动从页面提取数据并填充表单，支持一键导出数据
// @author       CreatorEdition
// @match        https://gravelocator.cem.va.gov/*
// @match        https://www.vlm.cem.va.gov/*
// @match        https://www.cmohs.org/recipients/*
// @match        https://services.sheerid.com/*
// @match        https://chatgpt.com/veterans-claim/*
// @match        https://chatgpt.com/veterans-claim
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561057/ChatGPT%20%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%85%A8%E8%87%AA%E5%8A%A8%20%28V211%20%E5%A2%9E%E5%BC%BA%E7%89%88%29GPT%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/561057/ChatGPT%20%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%85%A8%E8%87%AA%E5%8A%A8%20%28V211%20%E5%A2%9E%E5%BC%BA%E7%89%88%29GPT%E8%AE%A4%E8%AF%81.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- 核心配置 ---
    const DEFAULT_EMAIL = "?????@outlook.com"; // 默认备用邮箱
    const MIN_BIRTH_YEAR = 1930;
    const FILL_DELAY = 1000; // 在 sheerid 页面延迟1秒填写
 
    // --- 获取当前使用的邮箱 ---
    function getCurrentEmail() {
        return GM_getValue('custom_target_email', DEFAULT_EMAIL);
    }
    // --- 设置新邮箱 ---
    function setNewEmail(email) {
        GM_setValue('custom_target_email', email);
    }
 
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
    const RESULT_TABLE_SELECTOR = '#searchResults tbody';
    const ERROR_BUTTON_SELECTOR = '.sid-error-button-container a.sid-btn';
    // 固定配置
    const FIXED_STATUS = "Military Veteran or Retiree";
    const FIXED_DISCHARGE_YEAR = "2025";
    const MONTH_MAP = {
        "01": "January", "02": "February", "03": "March", "04": "April",
        "05": "May", "06": "June", "07": "July", "08": "August",
        "09": "September", "10": "October", "11": "November", "12": "December"
    };
    // --- ✅ VLM 页面月份缩写映射 ---
    const MONTH_ABBR_MAP = {
        Jan: "January", Feb: "February", Mar: "March", Apr: "April",
        May: "May", Jun: "June", Jul: "July", Aug: "August",
        Sep: "September", Oct: "October", Nov: "November", Dec: "December"
    };
    function normalizeMonthName(m) {
        if (!m) return "";
        const s = String(m).trim();
        // 兼容 "10"/"01" 这种
        if (/^\d{1,2}$/.test(s)) {
            const mm = s.padStart(2, "0");
            return MONTH_MAP[mm] || "";
        }
        // 兼容 "Oct"/"October"
        const key = s.slice(0, 3);
        if (MONTH_ABBR_MAP[key]) return MONTH_ABBR_MAP[key];
        return s;
    }
 
    // --- 随机工具函数 (用于生成1-25的日期) ---
    function getRandomDay1to25() {
        return Math.floor(Math.random() * 25) + 1;
    }
    function getRandomMonth() {
        const months = Object.values(MONTH_MAP);
        return months[Math.floor(Math.random() * months.length)];
    }
 
    // --- 状态管理 ---
    function getQueue() { return GM_getValue('global_auth_queue', []); }
    function saveQueue(arr) { GM_setValue('global_auth_queue', arr); updateUI(); }
    function getCurrentTask() { return GM_getValue('current_active_task', null); }
    function setCurrentTask(task) { GM_setValue('current_active_task', task); }
    function getSubmitState() { return GM_getValue('is_submitting_flag', false); }
    function setSubmitState(bool) { GM_setValue('is_submitting_flag', bool); }
    function getIsRunning() { return GM_getValue('is_script_running', false); }
    function setIsRunning(bool) { GM_setValue('is_script_running', bool); updateUI(); }
    function getFillingStage() { return GM_getValue('filling_stage', 0); }
    function setFillingStage(stage) { GM_setValue('filling_stage', stage); }
    function getWaitingForRetry() { return GM_getValue('waiting_for_retry', false); }
    function setWaitingForRetry(bool) { GM_setValue('waiting_for_retry', bool); }
    function getClaimPageAttempts() { return GM_getValue('claim_page_attempts', 0); }
    function setClaimPageAttempts(count) { GM_setValue('claim_page_attempts', count); }
    function getInitialFillDelay() { return GM_getValue('initial_fill_delay_done', false); }
    function setInitialFillDelay(bool) { GM_setValue('initial_fill_delay_done', bool); }
    function getLastClickedUrl() { return GM_getValue('last_clicked_url', ''); }
    function setLastClickedUrl(url) { GM_setValue('last_clicked_url', url); }
 
    // --- 🔥 错误检测和自动重试 ---
    function checkForErrorAndRetry() {
        const errorBtn = document.querySelector(ERROR_BUTTON_SELECTOR);
        if (errorBtn) {
            const href = errorBtn.getAttribute('href');
            log('⚠️ 检测到错误页面，准备重试...', '#ff6b6b');
            statusArea.innerHTML = "🔄 检测到错误，自动重试中...";
            // 标记为等待重试状态
            setWaitingForRetry(true);
            setClaimPageAttempts(0);
            // 点击 Try Again 按钮
            setTimeout(() => {
                log('🔄 点击 Try Again 按钮...', '#ffc107');
                errorBtn.click();
            }, 500);
            return true;
        }
        return false;
    }
 
    // --- 🔥 在 veterans-claim 页面持续尝试点击"验证资格条件"按钮 ---
    function checkClaimPageButton() {
        const currentUrl = window.location.href;
        if (!currentUrl.includes('chatgpt.com/veterans-claim')) {
            return false;
        }
        const isRunning = getIsRunning();
        const isWaitingRetry = getWaitingForRetry();
        if (!isRunning && !isWaitingRetry) {
            return false;
        }
        // 查找"验证资格条件"按钮
        const buttons = Array.from(document.querySelectorAll('button.btn.relative.btn-primary'));
        let targetBtn = null;
 
        for (let btn of buttons) {
            const text = btn.textContent.trim();
            if (text.includes('验证资格条件') || text.includes('验证') || text.includes('领取优惠') || text.includes('Verify')) {
                targetBtn = btn;
                break;
            }
        }
        if (targetBtn) {
            const isDisabled = targetBtn.disabled ||
                               targetBtn.hasAttribute('disabled') ||
                               targetBtn.classList.contains('cursor-not-allowed') ||
                               targetBtn.getAttribute('data-visually-disabled') !== null;
 
            const attempts = getClaimPageAttempts();
            if (isDisabled) {
                setClaimPageAttempts(attempts + 1);
                log(`⏳ 按钮加载中，等待... (尝试 ${attempts + 1})`, '#ffc107');
                statusArea.innerHTML = `🔄 等待按钮激活中...`;
                return true;
            } else {
                // 🔥 修改：点击1次后，2秒后还没有跳转重新点击 (无次数限制)
                const lastClickTs = GM_getValue('last_verify_click_ts', 0);
                // 如果距离上次点击不足 2000 毫秒 (2秒)，则跳过本次，等待下一次循环
                if (Date.now() - lastClickTs < 2000) {
                     statusArea.innerHTML = "⏳ 等待跳转 (2s)...";
                     return true;
                }
                // 更新本次点击时间
                GM_setValue('last_verify_click_ts', Date.now());
                // 🔥 修改结束
 
                const lastUrl = getLastClickedUrl();
                if (lastUrl === currentUrl) {
                    setClaimPageAttempts(attempts + 1);
                    log(`🎯 点击按钮... (第 ${attempts + 1} 次)`, '#28a745');
                    statusArea.innerHTML = `🎯 点击按钮...`;
                } else {
                    log(`✅ 按钮已激活，准备点击`, '#28a745');
                    statusArea.innerHTML = "🎯 按钮已激活，正在点击...";
                    setClaimPageAttempts(0);
                }
 
                setLastClickedUrl(currentUrl);
                setTimeout(() => {
                    targetBtn.click();
                    log('🚀 已点击按钮，等待跳转...', '#0d6efd');
                }, 300);
                return true;
            }
        } else {
            const attempts = getClaimPageAttempts();
            setClaimPageAttempts(attempts + 1);
            log(`⏳ 等待页面加载按钮... (尝试 ${attempts + 1})`, '#6c757d');
            statusArea.innerHTML = `⏳ 等待页面加载...`;
            return true;
        }
    }
 
    // --- 🔥 检测是否成功跳转到 SheerID 页面 ---
    function checkIfLeftClaimPage() {
        const currentUrl = window.location.href;
        const lastUrl = getLastClickedUrl();
 
        if (lastUrl.includes('chatgpt.com/veterans-claim') && currentUrl.includes('services.sheerid.com')) {
            log('✅ 成功跳转到 SheerID 页面', '#28a745');
            setWaitingForRetry(false);
            setClaimPageAttempts(0);
            setFillingStage(0);
            setInitialFillDelay(false);
            setLastClickedUrl('');
            return true;
        }
        return false;
    }
 
    // --- 页面初始化 ---
    function initLogic() {
        const currentUrl = window.location.href;
        const justSubmitted = getSubmitState();
        if (justSubmitted) {
            console.log("✅ 提交完成，清除任务");
            setCurrentTask(null);
            setSubmitState(false);
            setFillingStage(0);
            setInitialFillDelay(false);
        }
        checkIfLeftClaimPage();
        checkForErrorAndRetry();
        if (currentUrl.includes('services.sheerid.com')) {
            const stage = getFillingStage();
            if (stage === 0 && !getInitialFillDelay()) {
                log('📍 SheerID 页面已加载，准备延迟填写...', '#0d6efd');
            }
        }
    }
 
    // --- UI 创建 (✅ 按照图片风格重写 + 增加最小化功能) ---
    function createPanel() {
        // --- 1. 恢复按钮（小圆球）---
        const restoreBtn = document.createElement('div');
        restoreBtn.id = 'gpt_auth_restore_btn';
        restoreBtn.style = `
            position: fixed;
            bottom: 50px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #C31D1A;
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 999999;
            cursor: pointer;
            display: none; /* 默认隐藏 */
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            border: 2px solid #fff;
        `;
        restoreBtn.innerHTML = "🚀"; // 图案
        restoreBtn.title = "点击恢复面板";
        document.body.appendChild(restoreBtn);
 
        // --- 2. 主面板 ---
        const div = document.createElement('div');
        div.id = 'gpt_auth_main_panel';
        // 外部容器样式：红色圆角边框
        div.style = `
            position: fixed;
            bottom: 50px;
            right: 20px;
            width: 380px;
            background: #fff;
            border: 8px solid #C31D1A;
            box-shadow: 0 8px 30px rgba(0,0,0,0.25);
            z-index: 999999;
            padding: 15px;
            border-radius: 25px; /* 大圆角 */
            font-family: 'Microsoft YaHei', sans-serif;
            font-size: 13px;
            box-sizing: border-box;
            display: block; /* 默认显示 */
        `;
 
div.innerHTML = `
            <div id="btn_minimize" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 30px;
                height: 30px;
                background: #C31D1A;
                color: white;
                font-size: 9px;
                line-height: 24px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 1000;
                border-bottom-right-radius: 8px; /*右下角一点圆角，美观*/
            ">最小化</div>
 
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 5px; padding-left: 25px;">
                <div style="font-size:18px; font-weight:bold; color:#C31D1A; display:flex; align-items:center; gap:5px;">
                    <span>🚀</span>
                    <span>GPT认证 V21.1 增强版</span>
                </div>
 
                <div style="position:relative; text-align:right; display:flex; gap:10px; align-items:center;">
                     <span id="update_log_trigger" style="font-size:12px; color:#333; text-decoration:underline; cursor:pointer; font-weight:bold;">更新日志</span>
                     <div id="queue_count" style="display:inline-block; background:#D9363E; color:white; width:24px;
                     height:24px; line-height:24px; text-align:center; border-radius:50%; font-size:14px; font-weight:bold;">0</div>
 
                    <div id="update_tooltip" style="
                        display:none;
                        position: absolute;
                        top: -35px;
                        right: 0;
                        background: white;
                        border: 1px solid #ccc;
                        padding: 10px;
                        border-radius: 4px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        white-space: nowrap;
                        color: #333;
                        font-size: 12px;
                        pointer-events: none;
                        text-align: left;
                        line-height: 1.5;
                        z-index: 1001;
                        ">
                        <strong style="text-decoration: underline;">用户：chatgpt充值会员 制作此加强版本</strong><br>
                        →后续会更新，点油猴的管理面板，点这个脚本，点主页可以看到更新<br>
                        <strong>注意事项：</strong><br>
                        ①<strong>注意要用美国ip！！</strong><br>
                        ②显示error是正常现象，换下一个人就行了<br><br>
 
                        <span style="color: #666;">加强版更新</span><br>
                        1，支持新大兵网站：https://www.vlm.cem.va.gov/<br>
                        2，支持新大兵网站：https://www.cmohs.org/recipients/page/5?action_year[start]=1964&deceased=No<br>
                        3，改进了稳定性，修复了第一列有时不选择的bug<br>
                        4，新增导出功能，可以导出数据到不同浏览器使用<br>
                        5，增加按钮不亮进行重新填写的功能<br>
                        6，增加绑定邮箱功能<br>
                        7，增加最小化功能
                    </div>
                </div>
            </div>
 
            <div style="background:#fff0f0;
            border:1px dashed #C31D1A; border-radius:8px; padding:8px; margin-bottom:12px;">
 
                <div style="font-size:12px;
                margin-bottom: 8px; border-bottom:1px solid #ffcccc; padding-bottom:8px;">
                    <span style="color:#000;
                    font-weight:500; font-weight:bold; text-decoration:underline;">普通充值Plus会员138一个月/新号115一个月</span>
                    <span style="color:#000;
                    font-weight:500;">→</span>
                    <a href="https://work.weixin.qq.com/ca/cawcde170dc32c3290" target="_blank" style="color:#0d6efd;
                    text-decoration:underline; cursor:pointer; font-weight:bold;">点击跳转</a>
                </div>
 
                <div style="font-weight:bold;
                color:#C31D1A; margin-bottom:4px; font-size:13px;">重要：输入你的邮箱</div>
                <div style="display:flex;
                gap:5px; margin-bottom:4px;">
                    <input id="input_custom_email" type="text" placeholder="name@outlook.com" style="flex:1;
                    padding:6px; border:1px solid #C31D1A; border-radius:4px; font-size:12px;">
                    <button id="btn_save_email" style="padding:4px 12px;
                    background:#C31D1A; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">保存</button>
                </div>
                <div style="font-size:12px;
                color:#555;">
                    当前认证邮箱：<span id="current_email_display" style="font-weight:bold;
                    color:#d63384; text-decoration:underline;">${getCurrentEmail()}</span>
                </div>
            </div>
 
            <div id="status_area" style="font-weight:bold;
            color:#000; font-size:14px; margin-bottom: 10px;">等待操作...</div>
 
            <div style="background:#F0FDF4;
            border-left: 4px solid #28a745; color:#28a745; padding: 8px; font-size:12px; margin-bottom: 12px;
            border-radius: 2px;">
                ✅ 脚本已加载 V21.1 增强版<br>
                用户：chatgpt充值会员 制作此加强版本
            </div>
 
            <div id="debug_area" style="display:none;"></div>
 
            <div style="display:flex;
            gap:10px; margin-bottom: 10px;">
                <button id="btn_toggle" style="
                    flex:2;
                    padding: 12px;
                    border: none;
                    border-radius: 15px;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    gap: 5px;
                    background: #f1f3f5;
                    color: #dc3545;
                    transition: 0.2s;
                ">
                    <span>🚫</span> 无数据
                </button>
 
                <button id="btn_skip" style="
                    flex:1;
                    padding: 12px;
                    background: #FFC107;
                    color: #000;
                    border: none;
                    border-radius: 15px;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    gap: 5px;
                ">
                    <span>⏭️</span> 跳过
                </button>
            </div>
 
            <button id="btn_auto_extract" style="
                width: 100%;
                padding: 12px;
                margin-bottom: 12px;
                cursor: pointer;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 15px;
                font-weight: bold;
                font-size: 15px;
                display:flex;
                align-items:center;
                justify-content:center;
                gap: 8px;
            ">
                <span>🤖</span> 自动提取当前页面数据
            </button>
 
            <textarea id="bulk_input" placeholder="手动粘贴数据(支持原始文本 或 导出的JSON)..." style="
                width: 100%;
                height: 80px;
                margin-bottom: 10px;
                font-size: 12px;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 8px;
                display: block;
                box-sizing: border-box;
                resize: none;
                font-family: monospace;
            "></textarea>
 
            <div style="display:flex;
            gap:8px;">
                <button id="btn_export" style="flex:1;
                padding: 10px; cursor: pointer; background:#6f42c1; color:white; border:none; border-radius:12px; font-weight:bold; display:flex; justify-content:center; align-items:center;
                gap:4px;">
                    <span>📤</span> 导出
                </button>
                <button id="btn_import" style="flex:1;
                padding: 10px; cursor: pointer; background:#0d6efd; color:white; border:none; border-radius:12px; font-weight:bold; display:flex; justify-content:center; align-items:center;
                gap:4px;">
                    <span>📥</span> 导入
                </button>
                <button id="btn_reset" style="flex:1;
                padding: 10px; cursor: pointer; background:#dc3545; color:white; border:none; border-radius:12px; font-weight:bold; display:flex; justify-content:center; align-items:center;
                gap:4px;">
                    <span>🗑️</span> 清空
                </button>
            </div>
        `;
 
 
        document.body.appendChild(div);
 
        // --- ✅ 添加更新日志的悬停逻辑 ---
        const logTrigger = document.getElementById('update_log_trigger');
        const tooltip = document.getElementById('update_tooltip');
        if (logTrigger && tooltip) {
            logTrigger.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
            });
            logTrigger.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }
 
        // --- ✅ 最小化/恢复逻辑 ---
        const btnMinimize = document.getElementById('btn_minimize');
        if (btnMinimize) {
            btnMinimize.onclick = () => {
                div.style.display = 'none';
                restoreBtn.style.display = 'flex';
            };
        }
        restoreBtn.onclick = () => {
            restoreBtn.style.display = 'none';
            div.style.display = 'block';
        };
 
        return div;
    }
 
    const panel = createPanel();
    const statusArea = document.getElementById('status_area');
    const debugArea = document.getElementById('debug_area');
    const queueCount = document.getElementById('queue_count');
    const inputArea = document.getElementById('bulk_input');
    const btnToggle = document.getElementById('btn_toggle');
    const btnSkip = document.getElementById('btn_skip');
    const btnAutoExtract = document.getElementById('btn_auto_extract');
    const btnExport = document.getElementById('btn_export');
    const btnImport = document.getElementById('btn_import');
    const btnReset = document.getElementById('btn_reset');
    // 邮箱相关元素
    const btnSaveEmail = document.getElementById('btn_save_email');
    const inputCustomEmail = document.getElementById('input_custom_email');
    const currentEmailDisplay = document.getElementById('current_email_display');
    // --- 调试日志 ---
    function log(msg, color = '#333') {
        console.log(msg);
        // debugArea.innerHTML = `<span style="color:${color}">${msg}</span>`;
    }
 
    // --- 🔥 自动提取页面数据函数 ---
    function autoExtractFromPage() {
        const tableBody = document.querySelector(RESULT_TABLE_SELECTOR);
 
        // 1. 尝试 CMOHS 页面提取
        const cmohsResult = extractFromCMOHSPage();
        if (cmohsResult && (cmohsResult.list.length > 0 || cmohsResult.skipped > 0)) {
             log(`✅ 从 CMOHS 页面提取 ${cmohsResult.list.length} 条记录`, '#28a745');
             return cmohsResult;
        }
 
        // 2. 尝试 VLM 页面提取
        if (!tableBody) {
            const vlmResult = extractFromVlmPage();
            if (vlmResult && (vlmResult.list.length > 0 || vlmResult.skipped > 0)) {
                log(`✅ 从 VLM 页面提取 ${vlmResult.list.length} 条记录`, '#28a745');
                return vlmResult;
            }
            alert("❌ 未找到搜索结果表格，也未识别到 VLM/CMOHS 纪念页信息！\n请确保在搜索结果页或 VLM/CMOHS 纪念页。");
            return null;
        }
 
        // 3. 原始表格提取
        const parsedList = [];
        let skippedCount = 0;
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        let currentPerson = {};
        let recordCount = 0;
        rows.forEach(row => {
            const header = row.querySelector('th.row-header');
            const data = row.querySelector('td.results-info');
            if (!header || !data) return;
            const label = header.textContent.trim().replace(':', '');
            const value = data.textContent.trim();
            if (label === 'Name') {
                if (Object.keys(currentPerson).length > 0) {
                    processAndAddPerson(currentPerson, parsedList);
                    recordCount++;
                }
                currentPerson = { name: value };
            } else {
                currentPerson[label] = value;
            }
        });
        if (Object.keys(currentPerson).length > 0) {
            processAndAddPerson(currentPerson, parsedList);
            recordCount++;
        }
        log(`✅ 从页面提取 ${recordCount} 条记录`, '#28a745');
        return { list: parsedList, skipped: skippedCount };
    }
 
    function processAndAddPerson(person, list) {
        let lastName = "", firstName = "";
        if (person.name) {
            const parts = person.name.split(',').map(s => s.trim());
            lastName = parts[0] || "";
            firstName = parts[1] || "";
        }
        const branch = getExactBranch(person['Rank & Branch'] || "");
        const dob = person['Date of Birth'] || "";
        const dobParts = dob.split('/');
        const bMonth = dobParts[0] ? MONTH_MAP[dobParts[0]] : "";
        const bDay = dobParts[1] || "";
        const bYear = dobParts[2] || "";
        const dod = person['Date of Death'] || "";
        const dodParts = dod.split('/');
        const dMonth = dodParts[0] ? MONTH_MAP[dodParts[0]] : "";
        const dDay = dodParts[1] || "";
        if (bYear && parseInt(bYear, 10) < MIN_BIRTH_YEAR) {
            log(`⚠️ 跳过 ${lastName} (${bYear} < 1930)`, '#ffc107');
            return;
        }
        if (firstName && lastName && bMonth && bDay && bYear) {
            // 🔥 这里使用了动态获取的邮箱
            list.push([
                FIXED_STATUS,
                branch,
                firstName,
                lastName,
                bMonth,
                bDay,
                bYear,
                dMonth,
                dDay,
                FIXED_DISCHARGE_YEAR,
                getCurrentEmail() // <--- 关键修改
            ]);
            log(`✅ ${firstName} ${lastName} | ${branch}`, '#198754');
        }
    }
 
    // --- 军种识别 ---
    function getExactBranch(text) {
        const upper = text.toUpperCase();
        if (upper.includes("SPACE FORCE")) return "Space Force";
        if (upper.includes("AIR NATIONAL GUARD") || upper.includes("ANG")) return "Air National Guard";
        if (upper.includes("AIR FORCE RESERVE") || upper.includes("USAFR")) return "Air Force Reserve";
        if (upper.includes("AIR FORCE") || upper.includes("USAF")) return "Air Force";
        if (upper.includes("ARMY NATIONAL GUARD") || upper.includes("ARNG")) return "Army";
        if (upper.includes("ARMY RESERVE") || upper.includes("USAR")) return "Army Reserve";
        if (upper.includes("ARMY") || upper.includes("USA")) return "Army";
        if (upper.includes("COAST GUARD RESERVE")) return "Coast Guard Reserve";
        if (upper.includes("COAST GUARD") || upper.includes("USCG")) return "Coast Guard";
        if (upper.includes("MARINE CORPS FORCE RESERVE")) return "Marine Corps Force Reserve";
        if (upper.includes("MARINE") || upper.includes("USMC")) return "Marine Corps";
        if (upper.includes("NAVY RESERVE") || upper.includes("USNR")) return "Navy Reserve";
        if (upper.includes("NAVY") || upper.includes("USN")) return "Navy";
        return "Army";
    }
 
// --- ✅ CMOHS 页面数据提取 (V21.2 修复名字匹配版) ---
    function extractFromCMOHSPage() {
        const currentUrl = window.location.href;
        // 1. 检查网址是否匹配
        if (!/cmohs\.org\/recipients/i.test(currentUrl)) return null;
 
        // --- A. 增强名字提取逻辑 (修复 "Stories of Sacrifice" 问题) ---
        let fullName = "";
 
        // 3. (兜底方案) 如果还是没找到，从网页标题 (document.title) 提取
        // 网页标题通常是: "Earl D. Plumlee | Medal of Honor Recipient | CMOHS"
        if (!fullName || fullName.includes("Stories of Sacrifice")) {
            const pageTitle = document.title;
            if (pageTitle.includes("|")) {
                fullName = pageTitle.split('|')[0].trim(); // 取竖线前面的部分
            } else {
                fullName = pageTitle;
            }
        }
 
        // 清理名字中的换行符和多余空格
        fullName = fullName.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
 
        if (!fullName) return null;
 
        // --- B. 处理名字: "LAST, FIRST" 或 "FIRST LAST" ---
        let lastName = "", firstName = "";
        if (fullName.includes(',')) {
            const parts = fullName.split(',').map(s => s.trim());
            lastName = parts[0];
            const firstParts = parts[1] ? parts[1].split(' ') : [];
            firstName = firstParts[0] || "";
        } else {
            const parts = fullName.split(' ');
            if (parts.length > 0) {
                // 处理后缀如 Sr., Jr., III 等
                const lastPart = parts[parts.length - 1];
                if (/^(Jr\.|Sr\.|I{1,3}|IV)$/i.test(lastPart) && parts.length > 1) {
                    lastName = parts[parts.length - 2];
                } else {
                    lastName = lastPart;
                }
                firstName = parts[0];
            }
        }
 
    // --- C. 增强出生日期提取逻辑 ---
        const bodyText = document.body.innerText;
 
        // ✅ 修改点 1：针对 Born: 进行匹配
        const dateRegex = /Born:\s*[\s\S]{0,50}?([A-Za-z]{3,}|[0-9]{1,2})[\s\.\/-]+(\d{1,2})[\s,\.\/-]+(\d{4})/i;
        const bornMatch = bodyText.match(dateRegex);
 
        let bMonth = "", bDay = "", bYear = "";
        if (bornMatch) {
            bMonth = normalizeMonthName(bornMatch[1]);
            bDay = bornMatch[2];
            bYear = bornMatch[3];
        }
 
        // --- D. 军种提取 ---
        // ✅ 修改点 2：针对 Military Service Branch: 进行提取
        let branch = "Army";
        const branchMatch = bodyText.match(/Military Service Branch:\s*([^\n\r<]+)/i);
 
        if (branchMatch) {
            branch = getExactBranch(branchMatch[1]);
        } else {
            // 旧的模糊匹配作为备用
            if (/U\.?S\.?\s*Navy/i.test(bodyText)) branch = "Navy";
            else if (/U\.?S\.?\s*Marine/i.test(bodyText)) branch = "Marine Corps";
            else if (/U\.?S\.?\s*Air Force/i.test(bodyText)) branch = "Air Force";
            else if (/U\.?S\.?\s*Coast Guard/i.test(bodyText)) branch = "Coast Guard";
        }
 
        // --- E. 随机生成 Discharge Date ---
        const dDay = getRandomDay1to25();
        const dMonth = getRandomMonth();
 
        // 校验年份
        if (bYear && parseInt(bYear, 10) < MIN_BIRTH_YEAR) {
            log(`⚠️ CMOHS 跳过 ${lastName} (${bYear} < ${MIN_BIRTH_YEAR})`, '#ffc107');
            return { list: [], skipped: 1 };
        }
 
        if (firstName && lastName && bMonth && bDay && bYear) {
             log(`✅ 成功解析: ${firstName} ${lastName}`, '#28a745');
            return {
                list: [[
                    FIXED_STATUS, branch, firstName, lastName,
                    bMonth, bDay, bYear,
                    dMonth, dDay, FIXED_DISCHARGE_YEAR,
                    getCurrentEmail()
                ]],
                skipped: 0
            };
        }
 
        log(`❌ CMOHS 提取失败: Name=[${fullName}], DOB=[${bMonth}-${bDay}-${bYear}]`, '#dc3545');
        return { list: [], skipped: 1 };
    }
 
    // --- ✅ VLM 纪念页数据提取 ---
    function extractFromVlmPage() {
        const currentUrl = window.location.href;
        if (!/vlm\.cem\.va\.gov/i.test(currentUrl)) return null;
        const pageText = (document.body && document.body.innerText) ? document.body.innerText : "";
        let fullName = "";
        const h1 = document.querySelector("h1");
        if (h1 && h1.textContent && h1.textContent.trim()) {
            fullName = h1.textContent.trim();
        } else {
            fullName = (document.title || "").trim();
        }
        fullName = fullName.replace(/\s+/g, " ").trim();
        if (!fullName) return null;
        const dateRangeMatch = pageText.match(
            /\b([A-Za-z]{3,9})\s+(\d{1,2}),\s+(\d{4})\s*[-–—−]\s*([A-Za-z]{3,9})\s+(\d{1,2}),\s+(\d{4})\b/
        );
        if (!dateRangeMatch) return null;
 
        const bMonth = normalizeMonthName(dateRangeMatch[1]);
        const bDay = dateRangeMatch[2];
        const bYear = dateRangeMatch[3];
        const dMonth = normalizeMonthName(dateRangeMatch[4]);
        const dDay = dateRangeMatch[5];
 
        let branchRaw = "";
        const branchMatch = pageText.match(/\b(U\.?S\.?\s+AIR\s+FORCE|U\.?S\.?\s+ARMY|U\.?S\.?\s+NAVY|U\.?S\.?\s+MARINE\s+CORPS|U\.?S\.?\s+COAST\s+GUARD|SPACE\s+FORCE|AIR\s+FORCE|ARMY|NAVY|MARINE\s+CORPS|COAST\s+GUARD)\b/i);
        if (branchMatch) branchRaw = branchMatch[0];
        const branch = getExactBranch(branchRaw);
 
        const nameParts = fullName.split(" ").filter(Boolean);
        const lastName = nameParts.length ? nameParts[nameParts.length - 1] : "";
        const firstName = nameParts.length > 1 ?
            nameParts.slice(0, -1).join(" ") : (nameParts[0] || "");
        if (bYear && parseInt(bYear, 10) < MIN_BIRTH_YEAR) {
            log(`⚠️ VLM 跳过 ${fullName} (${bYear} < ${MIN_BIRTH_YEAR})`, '#ffc107');
            return { list: [], skipped: 1 };
        }
 
        if (firstName && lastName && bMonth && bDay && bYear) {
            return {
                list: [[
                    FIXED_STATUS,
                    branch,
                    firstName,
                    lastName,
                    bMonth,
                    bDay,
                    bYear,
                    dMonth,
                    dDay,
                    FIXED_DISCHARGE_YEAR,
                    getCurrentEmail() // <--- 关键修改
                ]],
                skipped: 0
            };
        }
        return { list: [], skipped: 1 };
    }
 
    // --- 手动解析数据 (兼容旧版文本格式) ---
    function parseRawData(text) {
        const parsedList = [];
        let skippedCount = 0;
        const blocks = text.split(/Name:\s*\n/g).filter(b => b.trim());
        for (let block of blocks) {
            const nameLine = block.split('\n')[0].trim();
            let lastName = "", firstName = "";
            if (nameLine.includes(',')) {
                const parts = nameLine.split(',').map(s => s.trim());
                lastName = parts[0];
                firstName = parts[1] || "";
            } else {
                lastName = nameLine;
            }
            const branch = getExactBranch(block);
            const dobMatch = block.match(/Date of Birth:\s*\n(\d{2})\/(\d{2})\/(\d{4})/);
            const bMonth = dobMatch ? MONTH_MAP[dobMatch[1]] : "";
            const bDay = dobMatch ? dobMatch[2] : "";
            const bYear = dobMatch ? dobMatch[3] : "";
            const dodMatch = block.match(/Date of Death:\s*\n(\d{2})\/(\d{2})\/(\d{4})/);
            const dMonth = dodMatch ? MONTH_MAP[dodMatch[1]] : "";
            const dDay = dodMatch ? dodMatch[2] : "";
            if (bYear && parseInt(bYear, 10) < MIN_BIRTH_YEAR) {
                skippedCount++;
                continue;
            }
            if (firstName && lastName && bMonth && bDay && bYear) {
                parsedList.push([
                    FIXED_STATUS, branch, firstName, lastName,
                    bMonth, bDay, bYear,
                    dMonth, dDay, FIXED_DISCHARGE_YEAR,
                    getCurrentEmail() // <--- 关键修改
                ]);
            } else {
                skippedCount++;
            }
        }
        return { list: parsedList, skipped: skippedCount };
    }
 
    // --- 表单填充函数 ---
    function simulateClick(element) {
        if (!element) return;
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        element.click();
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
    async function selectDropdown(selector, value, waitTime = 300) {
        const el = document.querySelector(selector);
        if (!el) return false;
 
        // 1. 模拟用户点击，激活下拉框
        el.focus();
        simulateClick(el);
        await new Promise(r => setTimeout(r, 200));
 
        // 2. 检查是否为标准 <select> 标签 (SheerID常用)
        if (el.tagName === 'SELECT') {
            let found = false;
            // 遍历所有选项，查找文本匹配的一项
            for (let i = 0; i < el.options.length; i++) {
                const option = el.options[i];
                // 比较显示文本(text) 或 标签(label) 或 值(value)
                if (option.text.trim() === value || option.label === value || option.value === value) {
                    el.selectedIndex = i;
                    // 选中该项
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    // 触发变更事件
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    found = true;
                    log(`✅ 已选中选项: ${value}`, '#198754');
                    break;
                }
            }
            if (!found) {
                log(`⚠️ 未找到选项: ${value}，尝试直接赋值`, '#ffc107');
                setNativeValue(el, value); // 降级处理
            }
        } else {
            // 3. 如果是自定义 div/input 下拉框
            setNativeValue(el, value);
            // 模拟下箭头和回车，尝试触发自动完成
            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            await new Promise(r => setTimeout(r, 100));
            el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
 
        await new Promise(r => setTimeout(r, waitTime));
        return true;
    }
 
    // --- ⚡ 核心自动化逻辑 ---
    async function runAutomation() {
        const queue = getQueue();
        const isRunning = getIsRunning();
        const currentUrl = window.location.href;
 
        if (!isRunning) return;
        // 🔥 优先检查错误页面
        if (checkForErrorAndRetry()) {
            return;
        }
        // 🔥 优先检查 claim 页面按钮（持续尝试点击）
        if (checkClaimPageButton()) {
            return;
        }
 
        let currentTask = getCurrentTask();
        let stage = getFillingStage();
        // 如果在 SheerID 页面且有任务，先等待1秒
        if (currentUrl.includes('services.sheerid.com') && currentTask && stage === 0 && !getInitialFillDelay()) {
            statusArea.innerHTML = `⏳ SheerID 页面加载完成，等待 1 秒...`;
            log('⏳ 延迟 1 秒后开始填写...', '#ffc107');
            await new Promise(r => setTimeout(r, FILL_DELAY));
            setInitialFillDelay(true);
            log('✅ 延迟完成，开始填写表单', '#28a745');
        }
 
        // 1. 获取新任务
        if (!currentTask && queue.length > 0) {
            currentTask = queue.shift();
            saveQueue(queue);
            setCurrentTask(currentTask);
            setFillingStage(0);
            setInitialFillDelay(false);
            stage = 0;
            log(`🆕 载入: ${currentTask[2]} ${currentTask[3]}`, '#0d6efd');
            // 如果在 SheerID 页面，立即延迟
            if (currentUrl.includes('services.sheerid.com')) {
                statusArea.innerHTML = `⏳ 等待1秒后开始填写: <span style="color:#0d6efd">${currentTask[2]} ${currentTask[3]}</span>`;
                await new Promise(r => setTimeout(r, FILL_DELAY));
                setInitialFillDelay(true);
            }
        }
 
        // 2. 完成
        if (!currentTask) {
            statusArea.innerHTML = "✅ 所有数据已处理完毕";
            statusArea.style.color = "green";
            log('🎉 全部完成！', '#198754');
            setIsRunning(false);
            return;
        }
 
        statusArea.innerHTML = `处理中 (${stage + 1}/4): <span style="color:#0d6efd">${currentTask[2]} ${currentTask[3]}</span>`;
        const statusEl = document.querySelector(FIELD_MAP.status);
        const nameEl = document.querySelector(FIELD_MAP.firstName);
 
        // ===================== 🔴 新增代码开始 =====================
        // 只有在 SheerID 页面且处于第0步时，才检测这段文字
        if (currentUrl.includes('services.sheerid.com') && stage === 0) {
            const bodyText = document.body.innerText;
            // 如果页面不包含指定的文字 "Unlock this Military-Only Offer"
            if (!bodyText.includes("Unlock this Military-Only Offer")) {
                log('⏳ 等待页面出现 "Unlock this Military-Only Offer"...', '#ffc107');
                statusArea.innerHTML = "⏳ 等待识别关键文本...";
                return; // ⛔️ 强制结束本次循环，不往下执行，直到文字出现
            }
            log('✅ 已识别到关键文本，继续执行...', '#198754');
        }
 
      try {
            // ✅ 阶段 0: 设置 Status (身份)
            if (stage === 0) {
                // 修改：使用 currentTask[0] (提取的数据) 替代硬编码字符串
                // 确保数据里有值，如果没有则使用默认值
                const statusValue = currentTask[0] ||
                "Military Veteran or Retiree";
                log(`📝 1. 设置 Status: ${statusValue}`, '#0d6efd');
                if (statusEl) {
                    // 使用改进后的 selectDropdown，它会去列表里找匹配的字
                    await selectDropdown(FIELD_MAP.status, statusValue, 600);
                } else {
                    log('⚠️ 未找到 Status 下拉框，但仍继续流程', '#ffc107');
                }
                setFillingStage(1);
                // -> 去选 Branch
                return;
            }
 
            // ✅ 阶段 1: 设置 Branch (军种)
            if (stage === 1) {
                // 修改：明确使用 currentTask[1]
                const branchValue = currentTask[1];
                log(`📝 2. 设置 Branch: ${branchValue}`, '#0d6efd');
 
                // 这里增加等待，确保上一步的Status切换动画完成，选项加载出来
                await selectDropdown(FIELD_MAP.branch, branchValue, 500);
                setFillingStage(2); // -> 去填姓名
                return;
            }
 
            // ✅ 阶段 2: 填写姓名、日期、邮箱 (原阶段1的内容)
            if (stage === 2 && nameEl) {
                log('📝 3. 填充详细信息...', '#0d6efd');
                // 注意：这里删掉了原来的 selectDropdown(branch...)，因为上面已经做过了
                setNativeValue(document.querySelector(FIELD_MAP.firstName), currentTask[2]);
                setNativeValue(document.querySelector(FIELD_MAP.lastName), currentTask[3]);
                await selectDropdown(FIELD_MAP.bMonth, currentTask[4], 150);
                setNativeValue(document.querySelector(FIELD_MAP.bDay), currentTask[5]);
                setNativeValue(document.querySelector(FIELD_MAP.bYear), currentTask[6]);
                await selectDropdown(FIELD_MAP.dMonth, currentTask[7], 150);
                setNativeValue(document.querySelector(FIELD_MAP.dDay), currentTask[8]);
                setNativeValue(document.querySelector(FIELD_MAP.dYear), currentTask[9]);
                setNativeValue(document.querySelector(FIELD_MAP.email), currentTask[10]);
                setFillingStage(3); // -> 去提交
                return;
            }
 
            // ✅ 阶段 3: 提交 (原阶段2)
            if (stage === 3) {
                const submitBtn = document.querySelector(SUBMIT_BTN_SELECTOR);
                if (submitBtn) {
                    const isDisabled = submitBtn.getAttribute('aria-disabled') === 'true' ||
                                     submitBtn.disabled ||
                                     submitBtn.classList.contains('disabled');
 
                    if (!isDisabled) {
                        // 按钮可用，正常提交
                        log('🚀 提交表单...', '#198754');
                        setSubmitState(true);
                        submitBtn.click();
                        setFillingStage(0); // 提交成功，重置准备下一个人
                        setInitialFillDelay(false);
                    } else {
                        // 🔴 核心修改点：按钮未激活，回退到 Status (Stage 0) 重新填写
                        log('⚠️ 提交按钮未激活，正在重新开始填写 (回到 Status)...', '#ff6b6b');
                        setFillingStage(0); // 强制重置步骤为 0
                    }
                }
            }
        } catch (e) {
            log(`❌ 错误: ${e.message}`, '#dc3545');
        }
    }
 
    // --- UI 更新 (✅ 适配新UI的按钮样式) ---
    function updateUI() {
        const queue = getQueue();
        const isRunning = getIsRunning();
        queueCount.innerText = queue.length;
        if (isRunning) {
            btnToggle.innerHTML = "<span>⏸️</span> 运行中";
            btnToggle.style.backgroundColor = "#28a745"; // 绿色
            btnToggle.style.color = "#fff";
        } else {
            if (queue.length > 0) {
                btnToggle.innerHTML = "<span>▶️</span> 启动";
                btnToggle.style.backgroundColor = "#0d6efd"; // 蓝色
                btnToggle.style.color = "#fff";
                statusArea.innerText = "⏸️ 已暂停";
            } else {
                // 默认状态：无数据 (灰色背景，红色文字和图标，仿图片)
                btnToggle.innerHTML = "<span>🚫</span> 无数据";
                btnToggle.style.backgroundColor = "#f1f3f5";
                btnToggle.style.color = "#dc3545";
            }
        }
    }
 
    // --- 按钮事件 ---
    btnToggle.onclick = () => {
        const queue = getQueue();
        if (queue.length === 0 && !getCurrentTask()) {
            alert("请先提取或导入数据！");
            return;
        }
        setIsRunning(!getIsRunning());
    };
    btnSkip.onclick = () => {
        const current = getCurrentTask();
        if (!current && getQueue().length === 0) {
            alert("没有任务可以跳过");
            return;
        }
        setCurrentTask(null);
        setSubmitState(false);
        setFillingStage(0);
        setWaitingForRetry(false);
        setClaimPageAttempts(0);
        setInitialFillDelay(false);
        setLastClickedUrl('');
        if (!getIsRunning()) {
            setIsRunning(true);
        }
        statusArea.innerHTML = "⏭️ 已跳过！正在载入下一位...";
        statusArea.style.color = "orange";
        setTimeout(runAutomation, 100);
    };
    btnAutoExtract.onclick = () => {
        const result = autoExtractFromPage();
        if (!result) return;
        const newData = result.list;
        const skipped = result.skipped;
        if (newData.length === 0) {
            alert("未提取到有效数据");
            return;
        }
        const currentQueue = getQueue();
        saveQueue(currentQueue.concat(newData));
        let msg = `✅ 成功提取 ${newData.length} 人`;
        if (skipped > 0) msg += `\n🚫 跳过 ${skipped} 人`;
        alert(msg);
        log(`✅ 提取完成: ${newData.length} 人`, '#28a745');
    };
 
    // --- ✅ 新增：保存邮箱事件 ---
    btnSaveEmail.onclick = () => {
        const val = inputCustomEmail.value.trim();
        if (val) {
            setNewEmail(val);
            currentEmailDisplay.innerText = val;
            alert(`✅ 邮箱已锁定为：\n${val}\n\n注意：此设置仅对【新提取】的数据生效，如果列表里已有旧数据，建议【清空】后重新提取。`);
        } else {
            alert("❌ 请输入有效的邮箱地址！");
        }
    };
 
    // --- ✅ 新增：导出数据功能 ---
    btnExport.onclick = () => {
        const queue = getQueue();
        if (queue.length === 0) {
            alert("当前队列为空，没有数据可以导出！\n请先提取数据后再试。");
            return;
        }
        // 将数据转换为 JSON 字符串
        const jsonStr = JSON.stringify(queue);
        // 复制到剪贴板
        navigator.clipboard.writeText(jsonStr).then(() => {
            alert(`✅ 已成功复制 ${queue.length} 条数据到剪贴板！\n\n使用方法：\n1. 发送给朋友\n2. 朋友复制内容\n3. 粘贴到插件输入框\n4. 点击【📥 导入】即可`);
        }).catch(err => {
            alert("❌ 复制失败，请手动复制控制台输出 (F12)");
            console.log("手动复制数据:", jsonStr);
        });
    };
 
    // --- ✅ 修改：导入数据功能 (支持文本 + JSON) ---
    btnImport.onclick = () => {
        const text = inputArea.value.trim();
        if (!text) return;
 
        try {
            let newData = [];
            let skipped = 0;
 
            // 1. 尝试检测是否为 JSON 格式 (导出格式)
            if (text.startsWith('[') && text.endsWith(']')) {
                try {
                    newData = JSON.parse(text);
                    if (!Array.isArray(newData)) throw new Error("JSON 格式不正确");
                    log(`✅ 检测到 JSON 数据包，直接载入`, '#6f42c1');
                } catch (jsonErr) {
                    alert("JSON 解析失败，请检查数据完整性");
                    return;
                }
            } else {
                // 2. 如果不是 JSON，尝试用旧的文本解析逻辑
                const result = parseRawData(text);
                newData = result.list;
                skipped = result.skipped;
            }
 
            if (newData.length === 0 && skipped === 0) {
                alert("无有效数据");
                return;
            }
            const currentQueue = getQueue();
            saveQueue(currentQueue.concat(newData));
            inputArea.value = "";
            let msg = `✅ 成功导入 ${newData.length} 人`;
            if (skipped > 0) msg += `\n🚫 跳过 ${skipped} 人`;
            alert(msg);
        } catch (e) {
            alert("解析错误: " + e.message);
        }
    };
 
    btnReset.onclick = () => {
        if(confirm("确定清空全部数据？")) {
            saveQueue([]);
            setCurrentTask(null);
            setSubmitState(false);
            setFillingStage(0);
            setIsRunning(false);
            setWaitingForRetry(false);
            setClaimPageAttempts(0);
            setInitialFillDelay(false);
            setLastClickedUrl('');
            log('🗑️ 已清空所有数据', '#dc3545');
            location.reload();
        }
    };
    // --- 初始化 ---
    initLogic();
    updateUI();
    function loop() {
        runAutomation();
        setTimeout(loop, 1500);
    }
    setTimeout(loop, 1000);
    log('✅ 脚本已加载 V21.1 增强版<br>用户：chatgpt充值会员 制作此加强版本', '#198754');
})();
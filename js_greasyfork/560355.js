// ==UserScript==
// @name         ChatGPT 身份认证全自动助手 (V19.0 持续点击修复版)
// @namespace    http://tampermonkey.net/
// @version      19.0.1
// @description  自动从搜索结果页面提取数据并填充表单，智能检测页面加载
// @author       CreatorEdition
// @match        https://gravelocator.cem.va.gov/*
// @match        https://services.sheerid.com/*
// @match        https://chatgpt.com/veterans-claim/*
// @match        https://chatgpt.com/veterans-claim
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560355/ChatGPT%20%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B%20%28V190%20%E6%8C%81%E7%BB%AD%E7%82%B9%E5%87%BB%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560355/ChatGPT%20%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8A%A9%E6%89%8B%20%28V190%20%E6%8C%81%E7%BB%AD%E7%82%B9%E5%87%BB%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // --- 核心配置 ---
    const FIXED_EMAIL = "test@email.com";//修改你的邮箱
    const MIN_BIRTH_YEAR = 1930;
    const FILL_DELAY = 1000; // 在 sheerid 页面延迟1秒填写
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
            statusArea.style.color = "orange";

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

        // 只在 veterans-claim 页面运行
        if (!currentUrl.includes('chatgpt.com/veterans-claim')) {
            return false;
        }
        const isRunning = getIsRunning();
        const isWaitingRetry = getWaitingForRetry();

        // 只有在运行状态或等待重试状态下才执行
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
            // 检查按钮是否被禁用（加载中）
            const isDisabled = targetBtn.disabled ||
                             targetBtn.hasAttribute('disabled') ||
                             targetBtn.classList.contains('cursor-not-allowed') ||
                             targetBtn.getAttribute('data-visually-disabled') !== null;

            const attempts = getClaimPageAttempts();

            if (isDisabled) {
                // 按钮加载中
                setClaimPageAttempts(attempts + 1);
                log(`⏳ 按钮加载中，等待... (尝试 ${attempts + 1})`, '#ffc107');
                statusArea.innerHTML = `🔄 等待按钮激活中 (尝试 ${attempts + 1})...`;
                statusArea.style.color = "orange";
                return true; // 继续等待
            } else {
                // 按钮可用，准备点击
                const lastUrl = getLastClickedUrl();

                // 如果 URL 没有变化，说明还在同一页面，继续点击
                if (lastUrl === currentUrl) {
                    setClaimPageAttempts(attempts + 1);
                    log(`🎯 持续点击按钮... (第 ${attempts + 1} 次)`, '#28a745');
                    statusArea.innerHTML = `🎯 持续点击按钮 (第 ${attempts + 1} 次)...`;
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
            // 未找到按钮
            const attempts = getClaimPageAttempts();
            setClaimPageAttempts(attempts + 1);
            log(`⏳ 等待页面加载按钮... (尝试 ${attempts + 1})`, '#6c757d');
            statusArea.innerHTML = `⏳ 等待页面加载 (尝试 ${attempts + 1})...`;
            return true;
        }
    }
    // --- 🔥 检测是否成功跳转到 SheerID 页面 ---
    function checkIfLeftClaimPage() {
        const currentUrl = window.location.href;
        const lastUrl = getLastClickedUrl();

        // 如果从 claim 页面跳转到了其他页面
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
        // 检查是否成功跳转到 SheerID
        checkIfLeftClaimPage();
        // 检查是否是错误页面
        checkForErrorAndRetry();

        // 如果在 sheerid 页面，重置初始延迟标记
        if (currentUrl.includes('services.sheerid.com')) {
            const stage = getFillingStage();
            if (stage === 0 && !getInitialFillDelay()) {
                log('📍 SheerID 页面已加载，准备延迟填写...', '#0d6efd');
            }
        }
    }
    // --- UI 创建 ---
    function createPanel() {
        const div = document.createElement('div');
        div.style = "position: fixed; bottom: 50px; right: 20px; width: 400px; background: #fff; border: 2px solid #6610f2; box-shadow: 0 5px 25px rgba(0,0,0,0.3); z-index: 999999; padding: 15px; border-radius: 8px; font-family: sans-serif; font-size: 13px;";
        div.innerHTML = `
            <div style="font-weight:bold; color:#6610f2; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:14px;">🚀 认证助手 V19.0</span>
                <span id="queue_count" style="background:#dc3545; color:white; padding:4px 12px; border-radius:20px; font-size:18px; font-weight:bold; box-shadow: 0 2px 5px rgba(220,53,69,0.5);">0</span>
            </div>
            <div id="status_area" style="margin-bottom: 10px; color: #333; min-height: 20px; font-weight:bold;">等待操作...</div>
            <div id="debug_area" style="margin-bottom: 10px; font-size: 11px; color: #666; background: #f8f9fa; padding: 5px; border-radius: 3px; max-height: 60px; overflow-y: auto;"></div>
            <div style="display:flex; gap:8px; margin-bottom: 10px;">
                <button id="btn_toggle" style="flex:2; padding: 12px; border: none; border-radius: 4px; font-weight: bold; font-size: 15px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    ▶️ 启动
                </button>
                <button id="btn_skip" style="flex:1; padding: 12px; background: #ffc107; color: #000; border: none; border-radius: 4px; font-weight: bold; font-size: 13px; cursor: pointer;">
                    ⏭️ 跳过
                </button>
            </div>
            <div id="import_section">
                <button id="btn_auto_extract" style="width: 100%; padding: 12px; margin-bottom: 8px; cursor: pointer; background:#28a745; color:white; border:none; border-radius:4px; font-weight:bold; font-size:14px;">
                    🤖 自动提取当前页面数据
                </button>
                <textarea id="bulk_input" placeholder="或手动粘贴数据..." style="width: 100%; height: 70px; margin-bottom: 5px; font-size:12px; border:1px solid #ccc; padding:5px; display:block;"></textarea>
                <div style="display:flex; gap:5px; margin-bottom: 5px;">
                    <button id="btn_import" style="flex:1; padding: 8px; cursor: pointer; background:#0d6efd; color:white; border:none; border-radius:4px;">📥 手动导入</button>
                    <button id="btn_reset" style="flex:1; padding: 8px; cursor: pointer; background:#dc3545; color:white; border:none; border-radius:4px;">🗑️ 清空</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);
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
    const btnImport = document.getElementById('btn_import');
    const btnReset = document.getElementById('btn_reset');
    // --- 调试日志 ---
    function log(msg, color = '#333') {
        console.log(msg);
        debugArea.innerHTML = `<span style="color:${color}">${msg}</span>`;
    }
    // --- 🔥 自动提取页面数据函数 ---
    function autoExtractFromPage() {
        const tableBody = document.querySelector(RESULT_TABLE_SELECTOR);
        if (!tableBody) {
            alert("❌ 未找到搜索结果表格！\n请确保在搜索结果页面上。");
            return null;
        }
        const parsedList = [];
        let skippedCount = 0;
        // 按行分组（每个退伍军人占多行）
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
                // 新的记录开始
                if (Object.keys(currentPerson).length > 0) {
                    // 保存上一个记录
                    processAndAddPerson(currentPerson, parsedList);
                    recordCount++;
                }
                currentPerson = { name: value };
            } else {
                currentPerson[label] = value;
            }
        });
        // 处理最后一条记录
        if (Object.keys(currentPerson).length > 0) {
            processAndAddPerson(currentPerson, parsedList);
            recordCount++;
        }
        log(`✅ 从页面提取 ${recordCount} 条记录`, '#28a745');
        return {
list: parsedList, skipped: skippedCount };
    }
    function processAndAddPerson(person, list) {
        // 解析姓名
        let lastName = "", firstName = "";
        if (person.name) {
            const parts = person.name.split(',').map(s => s.trim());
            lastName = parts[0] || "";
            firstName = parts[1] || "";
        }
        // 解析军种
        const branch = getExactBranch(person['Rank & Branch'] || "");
        // 解析出生日期
        const dob = person['Date of Birth'] || "";
        const dobParts = dob.split('/');
        const bMonth = dobParts[0] ? MONTH_MAP[dobParts[0]] : "";
        const bDay = dobParts[1] || "";
        const bYear = dobParts[2] || "";
        // 解析死亡/退役日期
        const dod = person['Date of Death'] || "";
        const dodParts = dod.split('/');
        const dMonth = dodParts[0] ? MONTH_MAP[dodParts[0]] : "";
        const dDay = dodParts[1] || "";
        // 过滤出生年份太早的
        if (bYear && parseInt(bYear, 10) < MIN_BIRTH_YEAR) {
            log(`⚠️ 跳过 ${lastName} (${bYear} < 1930)`, '#ffc107');
            return;
        }
        // 验证必填字段
        if (firstName && lastName && bMonth && bDay && bYear) {
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
                FIXED_EMAIL
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
    // --- 手动解析数据 ---
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
                    dMonth, dDay, FIXED_DISCHARGE_YEAR, FIXED_EMAIL
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
        el.focus();
        simulateClick(el);
        await new Promise(r => setTimeout(r, 150));
        setNativeValue(el, value);
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
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
            statusArea.innerHTML = `⏳ SheerID 页面加载完成，等待 1 秒后开始填写...`;
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
        statusArea.innerHTML = `处理中 (${stage+1}/3): <span style="color:#0d6efd">${currentTask[2]} ${currentTask[3]}</span>`;
        const statusEl = document.querySelector(FIELD_MAP.status);
        const nameEl = document.querySelector(FIELD_MAP.firstName);
        try {
            // 阶段 0: Status
            if (stage === 0) {
                if (statusEl && statusEl.value !== FIXED_STATUS) {
                    log('📝 填充 Status...', '#0d6efd');
                    await selectDropdown(FIELD_MAP.status, FIXED_STATUS, 600);
                }
                setFillingStage(1);
                return;
            }
            // 阶段 1: 详细信息
            if (stage === 1 && nameEl) {
                log('📝 填充详细信息...', '#0d6efd');
                await selectDropdown(FIELD_MAP.branch, currentTask[1], 200);
                setNativeValue(document.querySelector(FIELD_MAP.firstName), currentTask[2]);
                setNativeValue(document.querySelector(FIELD_MAP.lastName), currentTask[3]);
                await selectDropdown(FIELD_MAP.bMonth, currentTask[4], 150);
                setNativeValue(document.querySelector(FIELD_MAP.bDay), currentTask[5]);
                setNativeValue(document.querySelector(FIELD_MAP.bYear), currentTask[6]);
                await selectDropdown(FIELD_MAP.dMonth, currentTask[7], 150);
                setNativeValue(document.querySelector(FIELD_MAP.dDay), currentTask[8]);
                setNativeValue(document.querySelector(FIELD_MAP.dYear), currentTask[9]);
                setNativeValue(document.querySelector(FIELD_MAP.email), currentTask[10]);
                setFillingStage(2);
                return;
            }
            // 阶段 2: 提交
            if (stage === 2) {
                const submitBtn = document.querySelector(SUBMIT_BTN_SELECTOR);
                if (submitBtn) {
                    const isDisabled = submitBtn.getAttribute('aria-disabled') === 'true' ||
                                     submitBtn.disabled ||
                                     submitBtn.classList.contains('disabled');
                    if (!isDisabled) {
                        log('🚀 提交表单...', '#198754');
                        setSubmitState(true);
                        submitBtn.click();
                        setFillingStage(0);
                        setInitialFillDelay(false);
                    } else {
                        log('⚠️ 提交按钮未激活，等待...', '#ffc107');
                    }
                }
            }
        } catch (e) {
            log(`❌ 错误: ${e.message}`, '#dc3545');
        }
    }
    // --- UI 更新 ---
    function updateUI() {
        const queue = getQueue();
        const isRunning = getIsRunning();
        queueCount.innerText = queue.length;
        if (isRunning) {
            btnToggle.innerText = "⏸️ 运行中";
            btnToggle.style.backgroundColor = "#198754";
            btnToggle.style.color = "#fff";
        } else {
            if (queue.length > 0) {
                btnToggle.innerText = "▶️ 启动";
                btnToggle.style.backgroundColor = "#0d6efd";
                btnToggle.style.color = "#fff";
                statusArea.innerText = "⏸️ 已暂停";
            } else {
                btnToggle.innerText = "🚫 无数据";
                btnToggle.style.backgroundColor = "#e9ecef";
                btnToggle.style.color = "#6c757d";
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
    // 🔥 自动提取按钮
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
    btnImport.onclick = () => {
        const text = inputArea.value;
        if (!text) return;
        try {
            const result = parseRawData(text);
            const newData = result.list;
            const skipped = result.skipped;
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
log('✅ 脚本已加载 V19.0', '#198754');
})();
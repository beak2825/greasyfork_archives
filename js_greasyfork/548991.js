// ==UserScript==
// @name         12306自动抢票
// @namespace    http://tampermonkey.net/
// @version      2025-09-12
// @description  已登录后自动查询->点预订->勾选乘客->优先席别->提交订单。不会绕过登录或验证码。
// @author       zskfree
// @match        https://kyfw.12306.cn/otn/leftTicket/init*
// @match        https://kyfw.12306.cn/otn/confirmPassenger/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548991/12306%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548991/12306%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%A5%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 调试开关（关闭以减少日志开销）
    const DEBUG = false;
    const dbg = (...args) => { if (DEBUG) console.debug('[12306]', ...args); };

    // 基本配置（按需修改）
    const CONFIG = {
        fromCode: '',     // 例："北京,BJP"
        toCode: '',       // 例："上海,SHH"
        date: '',         // 例："2025-09-30"

        // 抢票偏好
        trainPrefixes: ['G', 'D'],      // 仅抢这些车次前缀；留空表示不筛选
        startTimeOption: '00002400',    // 发车时间选项：'00002400'(全天),'00000600'(00:00-06:00),'06001200'(06:00-12:00),'12001800'(12:00-18:00),'18002400'(18:00-24:00)
        orderIndex: 1,                  // 第几个可预订车次(1起)
        queryIntervalMs: 1500,          // 轮询间隔(毫秒)

        // 定时抢票功能
        enableScheduled: false,         // 是否启用定时抢票
        scheduledTime: '',              // 开抢时间，格式："HH:MM" 如 "09:15"
        preStartSeconds: 5,             // 提前几秒开始准备（默认5秒）

        // 乘客与席别（在确认乘客页使用）
        passengers: ['张三', '李四'],    // 与12306常用联系人姓名一致
        seatTextPrefer: ['二等座', '一等座', '商务座'], // 优先席别文本（按先后顺序尝试）
        allowNoSeat: true               // 若无票/余票0，是否继续尝试提交
    };

    // 工具
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // 移除原来的 inTimeRange 函数，改为时间选项匹配
    const matchTimeOption = (trainTime, selectedOption) => {
        if (!selectedOption || selectedOption === '00002400') return true; // 全天
        if (!trainTime || !trainTime.match(/^\d{2}:\d{2}$/)) return true;

        const [hour, minute] = trainTime.split(':').map(Number);
        const timeInMinutes = hour * 60 + minute;

        switch (selectedOption) {
            case '00000600': return timeInMinutes >= 0 && timeInMinutes < 360;    // 00:00-06:00
            case '06001200': return timeInMinutes >= 360 && timeInMinutes < 720;  // 06:00-12:00
            case '12001800': return timeInMinutes >= 720 && timeInMinutes < 1080; // 12:00-18:00
            case '18002400': return timeInMinutes >= 1080 && timeInMinutes < 1440; // 18:00-24:00
            default: return true;
        }
    };

    // 状态与配置持久化 + 右上角 UI
    const STORE_KEY = 'tm_12306_config_v1';
    const RUN_KEY = 'tm_12306_running_v1';
    let pollTimer = null;
    let scheduledTimer = null;
    let attempts = 0;
    let ui = null;

    function loadSettings() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (typeof saved.fromCode === 'string') CONFIG.fromCode = saved.fromCode;
            if (typeof saved.toCode === 'string') CONFIG.toCode = saved.toCode;
            if (typeof saved.date === 'string') CONFIG.date = saved.date;
            if (Array.isArray(saved.trainPrefixes)) CONFIG.trainPrefixes = saved.trainPrefixes;
            if (typeof saved.startTimeOption === 'string') CONFIG.startTimeOption = saved.startTimeOption;
            if (typeof saved.orderIndex === 'number') CONFIG.orderIndex = saved.orderIndex;
            if (typeof saved.queryIntervalMs === 'number') CONFIG.queryIntervalMs = saved.queryIntervalMs;
            if (typeof saved.enableScheduled === 'boolean') CONFIG.enableScheduled = saved.enableScheduled;
            if (typeof saved.scheduledTime === 'string') CONFIG.scheduledTime = saved.scheduledTime;
            if (typeof saved.preStartSeconds === 'number') CONFIG.preStartSeconds = saved.preStartSeconds;
            if (Array.isArray(saved.passengers)) CONFIG.passengers = saved.passengers;
            if (Array.isArray(saved.seatTextPrefer)) CONFIG.seatTextPrefer = saved.seatTextPrefer;
            if (typeof saved.allowNoSeat === 'boolean') CONFIG.allowNoSeat = saved.allowNoSeat;
        } catch { /* ignore */ }
    }

    function saveSettings() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(CONFIG)); } catch { /* ignore */ }
    }
    function isRunning() { return sessionStorage.getItem(RUN_KEY) === '1'; }
    function setRunning(flag) {
        if (flag) sessionStorage.setItem(RUN_KEY, '1');
        else sessionStorage.removeItem(RUN_KEY);
        updateUIState();
    }

    // 解析计划时间为今天的时间戳
    function parseScheduledTime(timeStr) {
        if (!timeStr || !timeStr.match(/^\d{1,2}:\d{2}$/)) return null;
        const [hour, minute] = timeStr.split(':').map(Number);
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

        const now = new Date();
        const scheduled = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

        // 如果设定时间已过，则设为明天同一时间
        if (scheduled <= now) {
            scheduled.setDate(scheduled.getDate() + 1);
        }

        return scheduled;
    }

    // 计算距离开抢时间的毫秒数
    function getTimeUntilStart() {
        if (!CONFIG.enableScheduled || !CONFIG.scheduledTime) return -1;

        const scheduledDate = parseScheduledTime(CONFIG.scheduledTime);
        if (!scheduledDate) return -1;

        const now = new Date();
        const preStartMs = (CONFIG.preStartSeconds || 5) * 1000;
        const startTime = new Date(scheduledDate.getTime() - preStartMs);

        return startTime.getTime() - now.getTime();
    }

    // 启动定时抢票
    function startScheduledBooking() {
        if (scheduledTimer) {
            clearTimeout(scheduledTimer);
            scheduledTimer = null;
        }

        if (!CONFIG.enableScheduled || !CONFIG.scheduledTime) {
            updateUIState();
            return;
        }

        const timeUntilStart = getTimeUntilStart();
        if (timeUntilStart <= 0) {
            // 时间已到，立即开始
            dbg('定时时间已到，立即开始抢票');
            startPolling();
            return;
        }

        dbg(`定时抢票设置：将在 ${Math.round(timeUntilStart / 1000)} 秒后开始`);

        scheduledTimer = setTimeout(() => {
            dbg('⏰ 定时时间到，开始抢票！');
            startPolling();
        }, timeUntilStart);

        updateUIState();
    }

    // 停止定时抢票
    function stopScheduledBooking() {
        if (scheduledTimer) {
            clearTimeout(scheduledTimer);
            scheduledTimer = null;
            dbg('定时抢票已取消');
        }
        updateUIState();
    }

    function updateUIState() {
        if (!ui) return;
        const running = isRunning();
        const scheduled = !!scheduledTimer;
        const timeUntilStart = getTimeUntilStart();

        // 更新按钮状态
        if (running) {
            ui.startBtn.textContent = '停止抢票';
        } else if (scheduled && timeUntilStart > 0) {
            const minutes = Math.floor(timeUntilStart / 60000);
            const seconds = Math.floor((timeUntilStart % 60000) / 1000);
            ui.startBtn.textContent = `等待开抢 (${minutes}:${seconds.toString().padStart(2, '0')})`;
        } else {
            ui.startBtn.textContent = '开始抢票';
        }

        // 更新状态显示
        if (running) {
            ui.status.textContent = `运行中 | 已尝试 ${attempts} 次`;
        } else if (scheduled && timeUntilStart > 0) {
            const scheduledDate = parseScheduledTime(CONFIG.scheduledTime);
            const formatTime = scheduledDate ? scheduledDate.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '';
            ui.status.textContent = `等待定时开抢: ${formatTime}`;
        } else {
            ui.status.textContent = '已停止';
        }

        // 控制输入框状态
        const disabled = running || scheduled;
        ui.intervalInput.disabled = disabled;
        ui.orderInput.disabled = disabled;
        ui.scheduledTimeInput.disabled = disabled;
        ui.preStartSecondsInput.disabled = disabled;
    }

    function parseCsv(str) {
        return (str || '').split(',').map(s => s.trim()).filter(Boolean);
    }
    function stringifyCsv(arr) {
        return (arr || []).join(', ');
    }

    function applyConfigFromUI() {
        CONFIG.fromCode = ui.fromInput.value.trim();
        CONFIG.toCode = ui.toInput.value.trim();
        CONFIG.date = ui.dateInput.value.trim();
        CONFIG.trainPrefixes = parseCsv(ui.prefixInput.value);
        CONFIG.startTimeOption = ui.startTimeSelect.value;
        CONFIG.orderIndex = Math.max(1, parseInt(ui.orderInput.value || '1', 10));
        CONFIG.queryIntervalMs = Math.max(800, parseInt(ui.intervalInput.value || '1500', 10));
        CONFIG.enableScheduled = ui.enableScheduled.checked;
        CONFIG.scheduledTime = ui.scheduledTimeInput.value.trim();
        CONFIG.preStartSeconds = Math.max(1, parseInt(ui.preStartSecondsInput.value || '5', 10));
        CONFIG.passengers = parseCsv(ui.passengersInput.value);
        CONFIG.seatTextPrefer = parseCsv(ui.seatPreferInput.value);
        CONFIG.allowNoSeat = ui.allowNoSeat.checked;
        saveSettings();
    }

    function fillUIFromConfig() {
        ui.fromInput.value = CONFIG.fromCode || '';
        ui.toInput.value = CONFIG.toCode || '';
        ui.dateInput.value = CONFIG.date || '';
        ui.prefixInput.value = stringifyCsv(CONFIG.trainPrefixes);
        ui.startTimeSelect.value = CONFIG.startTimeOption || '00002400';
        ui.orderInput.value = CONFIG.orderIndex || 1;
        ui.intervalInput.value = CONFIG.queryIntervalMs || 1500;
        ui.enableScheduled.checked = !!CONFIG.enableScheduled;
        ui.scheduledTimeInput.value = CONFIG.scheduledTime || '';
        ui.preStartSecondsInput.value = CONFIG.preStartSeconds || 5;
        ui.passengersInput.value = stringifyCsv(CONFIG.passengers);
        ui.seatPreferInput.value = stringifyCsv(CONFIG.seatTextPrefer);
        ui.allowNoSeat.checked = !!CONFIG.allowNoSeat;
        updateUIState();
    }

    function createUI() {
        if (document.getElementById('tm-12306-ui')) return ui;
        const style = document.createElement('style');
        style.textContent = `
        .tm-12306-panel{position:fixed;top:16px;right:16px;z-index:2147483647;width:300px;background:#fff;color:#222;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.12);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial;overflow:hidden}
        .tm-12306-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:linear-gradient(135deg,#4f46e5,#22c55e);color:#fff}
        .tm-12306-title{font-weight:600;font-size:14px}
        .tm-12306-actions{display:flex;gap:6px}
        .tm-12306-min{background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer}
        .tm-12306-body{padding:10px 12px;display:grid;grid-template-columns:1fr 1fr;gap:8px 10px}
        .tm-12306-row-2{grid-column:1 / span 2}
        .tm-12306-label{font-size:12px;color:#6b7280}
        .tm-12306-input,.tm-12306-time,.tm-12306-number, .tm-12306-textarea{width:100%;box-sizing:border-box;border:1px solid #e5e7eb;border-radius:8px;padding:6px 8px;font-size:12px;outline:none}
        .tm-12306-textarea{min-height:44px;resize:vertical}
        .tm-12306-footer{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-top:1px solid #f1f5f9;background:#f8fafc}
        .tm-12306-btn{padding:6px 10px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-size:12px}
        .tm-12306-btn.primary{background:#22c55e;border-color:#16a34a;color:#fff}
        .tm-12306-status{font-size:12px;color:#475569}
        .tm-12306-scheduled-section{grid-column:1 / span 2;border:1px solid #e5e7eb;border-radius:8px;padding:8px;margin:4px 0;background:#f8fafc}
        .tm-12306-scheduled-title{font-size:12px;font-weight:600;color:#374151;margin-bottom:6px}
        .tm-12306-scheduled-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        @media (prefers-color-scheme: dark){
          .tm-12306-panel{background:#0f172a;color:#e2e8f0;border-color:#1f2937}
          .tm-12306-body .tm-12306-input,
          .tm-12306-body .tm-12306-time,
          .tm-12306-body .tm-12306-number,
          .tm-12306-body .tm-12306-textarea{background:#111827;border-color:#374151;color:#e5e7eb}
          .tm-12306-footer{background:#111827;border-top-color:#1f2937}
          .tm-12306-status{color:#9ca3af}
          .tm-12306-scheduled-section{background:#111827;border-color:#374151}
          .tm-12306-scheduled-title{color:#e2e8f0}
        }`;
        document.head.appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'tm-12306-ui';
        panel.className = 'tm-12306-panel';
        panel.innerHTML = `
          <div class="tm-12306-header">
            <div class="tm-12306-title">12306 自动抢票</div>
            <div class="tm-12306-actions">
              <button class="tm-12306-min" title="折叠">—</button>
            </div>
          </div>
          <div class="tm-12306-body">
            <div>
              <div class="tm-12306-label">出发(城市,代码)</div>
              <input class="tm-12306-input" data-key="fromCode" placeholder="北京,BJP">
            </div>
            <div>
              <div class="tm-12306-label">到达(城市,代码)</div>
              <input class="tm-12306-input" data-key="toCode" placeholder="上海,SHH">
            </div>
            <div>
              <div class="tm-12306-label">日期</div>
              <input class="tm-12306-input" data-key="date" placeholder="2025-09-30">
            </div>
            <div>
              <div class="tm-12306-label">车次前缀</div>
              <input class="tm-12306-input" data-key="prefix" placeholder="G,D">
            </div>
            <div class="tm-12306-row-2">
              <div class="tm-12306-label">出发时间段</div>
              <select class="tm-12306-input" data-key="startTime">
                <option value="00002400">00:00--24:00</option>
                <option value="00000600">00:00--06:00</option>
                <option value="06001200">06:00--12:00</option>
                <option value="12001800">12:00--18:00</option>
                <option value="18002400">18:00--24:00</option>
              </select>
            </div>
            <div>
              <div class="tm-12306-label">选择第N个</div>
              <input type="number" min="1" class="tm-12306-number" data-key="order">
            </div>
            <div>
              <div class="tm-12306-label">轮询间隔(ms)</div>
              <input type="number" min="800" step="100" class="tm-12306-number" data-key="interval">
            </div>
            
            <div class="tm-12306-scheduled-section">
              <div class="tm-12306-scheduled-title">⏰ 定时抢票设置</div>
              <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#6b7280;margin-bottom:6px">
                <input type="checkbox" data-key="enableScheduled">
                启用定时抢票
              </label>
              <div class="tm-12306-scheduled-grid">
                <div>
                  <div class="tm-12306-label">开抢时间</div>
                  <input type="time" class="tm-12306-input" data-key="scheduledTime" placeholder="09:15">
                </div>
                <div>
                  <div class="tm-12306-label">提前秒数</div>
                  <input type="number" min="1" max="60" class="tm-12306-number" data-key="preStartSeconds" placeholder="5">
                </div>
              </div>
            </div>
            
            <div class="tm-12306-row-2">
              <div class="tm-12306-label">乘客（逗号分隔）</div>
              <textarea class="tm-12306-textarea" data-key="passengers" placeholder="张三, 李四"></textarea>
            </div>
            <div class="tm-12306-row-2">
              <div class="tm-12306-label">席别优先（逗号分隔）</div>
              <input class="tm-12306-input" data-key="seatPrefer" placeholder="二等座, 一等座, 商务座">
            </div>
            <div class="tm-12306-row-2">
              <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#6b7280">
                <input type="checkbox" data-key="allowNoSeat">
                无票/余票0也尝试提交
              </label>
            </div>
          </div>
          <div class="tm-12306-footer">
            <div class="tm-12306-status">已停止</div>
            <div style="display:flex;gap:8px">
              <button class="tm-12306-btn" data-action="apply">应用条件并刷新</button>
              <button class="tm-12306-btn primary" data-action="start">开始抢票</button>
            </div>
          </div>
        `;
        document.body.appendChild(panel);

        ui = {
            panel,
            status: panel.querySelector('.tm-12306-status'),
            minBtn: panel.querySelector('.tm-12306-min'),
            fromInput: panel.querySelector('[data-key="fromCode"]'),
            toInput: panel.querySelector('[data-key="toCode"]'),
            dateInput: panel.querySelector('[data-key="date"]'),
            prefixInput: panel.querySelector('[data-key="prefix"]'),
            startTimeSelect: panel.querySelector('[data-key="startTime"]'),
            orderInput: panel.querySelector('[data-key="order"]'),
            intervalInput: panel.querySelector('[data-key="interval"]'),
            enableScheduled: panel.querySelector('[data-key="enableScheduled"]'),
            scheduledTimeInput: panel.querySelector('[data-key="scheduledTime"]'),
            preStartSecondsInput: panel.querySelector('[data-key="preStartSeconds"]'),
            passengersInput: panel.querySelector('[data-key="passengers"]'),
            seatPreferInput: panel.querySelector('[data-key="seatPrefer"]'),
            allowNoSeat: panel.querySelector('[data-key="allowNoSeat"]'),
            startBtn: panel.querySelector('[data-action="start"]'),
            applyBtn: panel.querySelector('[data-action="apply"]'),
            bodyEl: panel.querySelector('.tm-12306-body')
        };

        ui.minBtn.addEventListener('click', () => {
            const hidden = ui.bodyEl.style.display === 'none';
            ui.bodyEl.style.display = hidden ? '' : 'none';
            panel.querySelector('.tm-12306-footer').style.display = hidden ? '' : 'none';
            ui.minBtn.textContent = hidden ? '—' : '+';
        });

        panel.addEventListener('input', (e) => {
            if (!(e.target instanceof HTMLElement)) return;
            const key = e.target.getAttribute('data-key');
            if (!key) return;
            applyConfigFromUI();

            // 移除自动启动定时的逻辑
            // 现在只保存配置，不自动启动
        });

        ui.applyBtn.addEventListener('click', async () => {
            applyConfigFromUI();
            await presetQueryCookiesIfNeeded();
            setTimeout(() => { clickQuery(); }, 300);
        });

        ui.startBtn.addEventListener('click', () => {
            applyConfigFromUI();
            if (!requireLoginOrExit()) return;

            if (isRunning() || scheduledTimer) {
                // 停止抢票或定时
                stopPolling();
                stopScheduledBooking();
                sessionStorage.removeItem('tm_12306_auto_booking');
            } else {
                if (location.href.includes('/confirmPassenger/')) {
                    setRunning(true);
                    runOnConfirmPassenger();
                } else {
                    // 修改这里：根据是否启用定时来决定行为
                    if (CONFIG.enableScheduled && CONFIG.scheduledTime) {
                        // 启用定时抢票时，点击开始按钮才开始定时等待
                        startScheduledBooking();
                    } else {
                        // 立即开始抢票
                        startPolling();
                    }
                }
            }
        });

        // 定时更新倒计时显示
        setInterval(() => {
            if (scheduledTimer && !isRunning()) {
                updateUIState();
            }
        }, 1000);

        loadSettings();
        fillUIFromConfig();
        updateUIState();
        return ui;
    }

    function startPolling() {
        if (pollTimer) return;

        // 停止定时器（如果有）
        stopScheduledBooking();

        setRunning(true);
        attempts = 0;

        pollTimer = setInterval(async () => {
            try {
                attempts++;
                updateUIState();

                const queryBtn = document.querySelector('#query_ticket');
                if (!queryBtn) return;

                clickQuery();

                const hasResults = await waitForQueryResults();
                if (!hasResults) return;

                const success = tryBookOne();
                if (success) {
                    sessionStorage.setItem('tm_12306_auto_booking', '1');
                    stopPolling();
                    setTimeout(() => {
                        if (location.href.includes('/confirmPassenger/')) {
                            runOnConfirmPassenger();
                        }
                    }, 500);
                }
            } catch (e) {
                if (attempts > 20) stopPolling();
            }
        }, Math.max(800, CONFIG.queryIntervalMs | 0));
    }

    function stopPolling() {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
        setRunning(false);
        updateUIState();
    }

    function isLoggedIn() {
        const userInfo = document.querySelector('.login_user_name, .user-name, #login_user');
        const logoutBtn = document.querySelector('a[onclick*="logout"], .logout');
        const loginForm = document.querySelector('#loginUserDTO, .login-form');
        return (!!userInfo && !loginForm) || !!logoutBtn;
    }

    function requireLoginOrExit() {
        if (!isLoggedIn()) {
            const tip = document.createElement('div');
            tip.style.cssText = 'position:fixed;z-index:999999;top:15px;right:15px;background:#fffae6;color:#333;padding:10px 14px;border:1px solid #f0c36d;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.15);';
            tip.textContent = '请先登录 12306 后再使用自动抢票脚本。本脚本不绕过登录/验证码。';
            document.body.appendChild(tip);
            return false;
        }
        return true;
    }

    async function presetQueryCookiesIfNeeded() {
        const { fromCode, toCode, date, startTimeOption } = CONFIG;

        const fromStationInput = document.querySelector('#fromStationText');
        const toStationInput = document.querySelector('#toStationText');
        const fromHidden = document.querySelector('#fromStation');
        const toHidden = document.querySelector('#toStation');
        const departureDateInput = document.querySelector('#train_date');
        const startTimeSelect = document.querySelector('#cc_start_time');

        // 改进的站点设置函数（保留容错，但缩短等待）
        const setStationBetter = async (type, inputEl, hiddenEl, codeStr) => {
            if (!inputEl || !hiddenEl || !codeStr) return false;
            const [cityName, stationCode] = codeStr.split(',').map(s => s?.trim());
            if (!cityName || !stationCode) {
                dbg(`${type} 配置格式错误，应为 "城市名,代码" 格式`);
                return false;
            }

            dbg(`开始设置${type}:`, { cityName, stationCode });

            try {
                // 方法1: 直接设置并验证
                inputEl.value = cityName;
                hiddenEl.value = stationCode;
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                inputEl.dispatchEvent(new Event('change', { bubbles: true }));
                hiddenEl.dispatchEvent(new Event('input', { bubbles: true }));
                hiddenEl.dispatchEvent(new Event('change', { bubbles: true }));
                await sleep(50);
                if (hiddenEl.value === stationCode && inputEl.value === cityName) {
                    dbg(`${type} 直接设置成功`);
                    return true;
                }

                // 方法2: 模拟用户输入流程（缩短等待时间）
                dbg(`${type} 直接设置失败，尝试模拟输入`);
                inputEl.value = '';
                inputEl.focus();
                await sleep(30);
                for (let i = 0; i < cityName.length; i++) {
                    inputEl.value = cityName.substring(0, i + 1);
                    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                    inputEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                    await sleep(20);
                }
                await sleep(120);

                // 查找并点击下拉选项
                const dropdownSelectors = [
                    '.station_search_result li',
                    '.station-name li',
                    '.search-result li',
                    '.ui-autocomplete li',
                    '[id*="ui-id-"] li'
                ];

                let optionFound = false;
                for (const selector of dropdownSelectors) {
                    const options = document.querySelectorAll(selector);
                    for (const option of options) {
                        const optionText = option.textContent || '';
                        if (optionText.includes(cityName) || optionText.includes(stationCode)) {
                            dbg(`${type} 找到下拉选项:`, optionText);
                            option.click();
                            optionFound = true;
                            break;
                        }
                    }
                    if (optionFound) break;
                }

                await sleep(100);

                // 如果下拉选择失败，再次强制设置
                if (!optionFound || hiddenEl.value !== stationCode) {
                    dbg(`${type} 下拉选择失败，强制设置`);
                    inputEl.value = cityName;
                    hiddenEl.value = stationCode;
                    inputEl.blur();
                    await sleep(30);
                }

                // 最终验证
                const finalResult = hiddenEl.value === stationCode && inputEl.value === cityName;
                dbg(`${type} 最终设置结果:`, {
                    输入框: inputEl.value,
                    隐藏字段: hiddenEl.value,
                    成功: finalResult
                });

                return finalResult;

            } catch (error) {
                dbg(`${type} 设置异常:`, error);
                return false;
            }
        };

        // 设置出发地
        let fromOK = true;
        if (fromCode && fromStationInput && fromHidden) {
            fromOK = await setStationBetter('出发地', fromStationInput, fromHidden, fromCode);
        }

        // 设置目的地
        let toOK = true;
        if (toCode && toStationInput && toHidden) {
            toOK = await setStationBetter('目的地', toStationInput, toHidden, toCode);
        }

        // 设置日期
        if (departureDateInput && date) {
            departureDateInput.value = date;
            departureDateInput.dispatchEvent(new Event('input', { bubbles: true }));
            departureDateInput.dispatchEvent(new Event('change', { bubbles: true }));
            dbg('已设置日期:', date);
        }

        // 设置发车时间
        if (startTimeSelect && startTimeOption) {
            startTimeSelect.value = startTimeOption;
            startTimeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            dbg('已设置发车时间选项:', startTimeOption);
        }

        // 应用车型筛选
        applyTrainTypeFiltersByPrefix();

        await sleep(200);

        // 最终验证所有必要字段
        const finalFromCode = fromHidden?.value;
        const finalToCode = toHidden?.value;
        const finalDate = departureDateInput?.value;

        dbg('查询前最终验证:', {
            出发地代码: finalFromCode,
            目的地代码: finalToCode,
            日期: finalDate,
            出发地OK: fromOK,
            目的地OK: toOK
        });

        return false;
    }

    function clickQuery() {
        const fromText = document.querySelector('#fromStationText')?.value;
        const toText = document.querySelector('#toStationText')?.value;
        const fromHidden = document.querySelector('#fromStation')?.value;
        const toHidden = document.querySelector('#toStation')?.value;
        const trainDate = document.querySelector('#train_date')?.value;

        dbg('clickQuery 校验:', { fromText, toText, fromHidden, toHidden, trainDate });

        // 严格验证必要字段
        if (!fromHidden || !toHidden || !trainDate) {
            dbg('关键字段缺失，取消查询');
            return false;
        }

        if (!fromText || !toText) {
            dbg('显示字段缺失，取消查询');
            return false;
        }

        const btn = document.querySelector('#query_ticket');
        if (btn) {
            dbg('执行点击查询');
            btn.click();
            return true;
        }

        dbg('未找到查询按钮');
        return false;
    }

    // 等待查询结果（缩短等待时间）
    async function waitForQueryResults() {
        const maxWait = 5000; // 最多等待5秒
        const start = Date.now();

        while (Date.now() - start < maxWait) {
            await sleep(150);

            // 检查是否有查询结果
            const resultTable = document.querySelector('#queryLeftTable, .result-table, #t-list');
            const resultRows = document.querySelectorAll('#queryLeftTable tr, .result-table tr');
            const noResultMsg = document.querySelector('.no-result, .no-ticket');

            // 如果有结果行（排除表头）
            if (resultTable && resultRows.length > 1) {
                dbg('查询结果已加载，共', resultRows.length - 1, '行');
                return true;
            }

            // 如果显示无结果消息
            if (noResultMsg) {
                dbg('查询无结果');
                return false;
            }

            // 检查是否还在加载中
            const loading = document.querySelector('.loading, .query-loading, [class*="loading"]');
            if (!loading) {
                // 没有loading状态，可能已经完成
                await sleep(300); // 再等一会儿
                const finalCheck = document.querySelectorAll('#queryLeftTable tr');
                if (finalCheck.length > 1) {
                    dbg('查询结果延迟加载完成');
                    return true;
                }
            }
        }

        dbg('等待查询结果超时');
        return false;
    }

    function tryBookOne() {
        const orderIndex = Math.max(1, CONFIG.orderIndex | 0) - 1;
        const bookButtons = Array.from(document.querySelectorAll('#queryLeftTable tr td.no-br a.btn72'))
            .filter(a => a.textContent?.trim() === '预订' && !a.hasAttribute('disabled') && !a.classList.contains('disabled'));
        dbg('找到可点击"预订"的按钮数:', bookButtons.length);

        if (!bookButtons.length) return false;

        // 提取行信息
        const extractTrainInfo = (row) => {
            let trainNo = '';
            // 多种方式提取车次号
            const idMatch = (row.id || '').match(/ticket_\w*([A-Z]\d+)/);
            if (idMatch) trainNo = idMatch[1];

            if (!trainNo) {
                trainNo = row.querySelector('a.number')?.textContent?.trim()
                    || row.querySelector('td:first-child a')?.textContent?.trim()
                    || row.querySelector('td:first-child')?.textContent?.trim()
                    || '';
            }

            // 尝试提取发车时间
            let depTime = '';
            const timeCells = Array.from(row.querySelectorAll('td, .start-t, .cdz, .cds'));
            for (const cell of timeCells) {
                const m = cell.textContent && cell.textContent.match(/(\d{2}:\d{2})/);
                if (m) { depTime = m[1]; break; }
            }
            return { trainNo: (trainNo || '').toUpperCase(), depTime };
        };

        // 检查是否有筛选条件
        const hasTrainPrefixFilter = CONFIG.trainPrefixes && CONFIG.trainPrefixes.length > 0;
        const hasTimeFilter = CONFIG.startTimeOption && CONFIG.startTimeOption !== '00002400';
        const hasAnyFilter = hasTrainPrefixFilter || hasTimeFilter;

        // 如果没有任何筛选条件，直接按序号选择
        if (!hasAnyFilter) {
            const targetIndex = Math.min(orderIndex, bookButtons.length - 1);
            const chosen = bookButtons[targetIndex];
            try {
                dbg('无筛选条件，直接点击第', targetIndex + 1, '个（配置第', CONFIG.orderIndex, '个）');
                chosen.click();
                return true;
            } catch {
                return false;
            }
        }

        // 有筛选条件时，先筛选出候选车次
        const candidateTrains = [];
        for (const btn of bookButtons) {
            const row = btn.closest('tr');
            if (!row) continue;
            const { trainNo, depTime } = extractTrainInfo(row);

            let prefixOK = true;
            if (hasTrainPrefixFilter) {
                prefixOK = CONFIG.trainPrefixes.some(p => trainNo.startsWith((p || '').toUpperCase().trim()));
            }

            let timeOK = true;
            if (hasTimeFilter && depTime) {
                timeOK = matchTimeOption(depTime, CONFIG.startTimeOption);
            }

            dbg('车次检测', { trainNo, depTime, prefixOK, timeOK, 通过筛选: prefixOK && timeOK });

            if (prefixOK && timeOK) {
                candidateTrains.push({ btn, trainNo, depTime });
            }
        }

        dbg('筛选结果:', {
            候选车次数: candidateTrains.length,
            车次列表: candidateTrains.map(c => c.trainNo),
            配置选择第几个: CONFIG.orderIndex,
            实际索引: orderIndex
        });

        if (!candidateTrains.length) {
            dbg('没有符合筛选条件的车次');
            return false;
        }

        // 在候选车次中按序号选择
        const targetIndex = Math.min(orderIndex, candidateTrains.length - 1);
        const chosen = candidateTrains[targetIndex];

        try {
            dbg('筛选后点击候选车次:', {
                选择: `第${targetIndex + 1}个`,
                车次号: chosen.trainNo,
                发车时间: chosen.depTime,
                总候选数: candidateTrains.length
            });
            chosen.btn.click();
            return true;
        } catch (error) {
            dbg('点击失败:', error);
            return false;
        }
    }

    async function runOnLeftTicket() {
        createUI();
        updateUIState();
        if (isRunning()) {
            if (!requireLoginOrExit()) return;
            startPolling();
        }
        // 移除自动启动定时抢票的逻辑
        // 现在只有手动点击"开始抢票"才会启动
    }

    // 车辆类型筛选（根据 trainPrefixes 勾选页面过滤器，容错选择）
    function applyTrainTypeFiltersByPrefix() {
        if (!CONFIG.trainPrefixes || CONFIG.trainPrefixes.length === 0) {
            dbg('未配置车次前缀，不调整车辆类型筛选');
            return;
        }
        const want = new Set((CONFIG.trainPrefixes || []).map(s => (s || '').toUpperCase().trim()));
        // 常见映射：G/GC(高铁/城际), D(动车), Z(直达), T(特快), K(快速), 其他
        const map = [
            { key: 'G', match: ['G', 'GC', '高铁', '城际'] },
            { key: 'D', match: ['D', '动车'] },
            { key: 'Z', match: ['Z', '直达'] },
            { key: 'T', match: ['T', '特快'] },
            { key: 'K', match: ['K', '快速'] },
            { key: 'QT', match: ['其他'] },
        ];

        const containers = [
            document.querySelector('#cc_train_type_btn_all')?.parentElement,
            document.querySelector('#cc_train_type'),
            document.querySelector('#train_type'),
            document.querySelector('.sear-sel-fix'),
            document
        ].filter(Boolean);

        const findAllTypeInputs = () => {
            const inputs = [];
            containers.forEach(c => {
                inputs.push(...c.querySelectorAll('input[type="checkbox"], input[type="radio"]'));
            });
            return Array.from(new Set(inputs));
        };

        const inputs = findAllTypeInputs();
        if (!inputs.length) { dbg('未找到车辆类型筛选控件'); return; }

        // 尽量先清空选择
        inputs.forEach(inp => {
            const label = cLabel(inp);
            const text = (label?.textContent || inp.value || '').trim();
            if (inp.checked) inp.click?.();
            dbg('取消筛选:', text);
        });

        function cLabel(inp) {
            const byFor = inp.id ? document.querySelector(`label[for="${inp.id}"]`) : null;
            return byFor || inp.closest('label');
        }

        // 勾选目标类型
        inputs.forEach(inp => {
            const label = cLabel(inp);
            const text = (label?.textContent || inp.value || '').toUpperCase();
            const hit = map.find(m => m.match.some(k => text.includes(k.toUpperCase())));
            if (!hit) return;
            if (hit.key === 'G' && (want.has('G') || want.has('GC'))) { inp.click?.(); dbg('选择类型: 高铁/城际'); }
            else if (hit.key === 'D' && want.has('D')) { inp.click?.(); dbg('选择类型: 动车'); }
            else if (hit.key === 'Z' && want.has('Z')) { inp.click?.(); dbg('选择类型: 直达'); }
            else if (hit.key === 'T' && want.has('T')) { inp.click?.(); dbg('选择类型: 特快'); }
            else if (hit.key === 'K' && want.has('K')) { inp.click?.(); dbg('选择类型: 快速'); }
            else if (hit.key === 'QT' && want.has('QT')) { inp.click?.(); dbg('选择类型: 其他'); }
        });
    }

    // 选择乘客（缩短等待时间）
    async function selectPassengers() {
        await sleep(30);
        let passengerContainer = document.querySelector('#normal_passenger_id')
            || document.querySelector('.passenger-list, #passenger_list, .passenger-box');

        if (!passengerContainer) {
            const all = document.querySelectorAll('[id*="passenger"], [class*="passenger"], li[onclick*="passenger"]');
            if (all.length === 0) return;
            passengerContainer = all[0].closest('ul, ol, div') || document.body;
        }

        const candidates = Array.from(passengerContainer.querySelectorAll('li, .passenger-item, [onclick*="passenger"]'));
        if (candidates.length === 0) {
            // 容器内为空，扩大搜索
            const allLi = Array.from(document.querySelectorAll('li'));
            candidates.push(...allLi.filter(li => {
                const txt = li.textContent || '';
                return txt.includes('姓名') || txt.includes('身份证') || txt.includes('乘客') ||
                    li.querySelector('input[type="checkbox"]') || li.onclick;
            }));
        }

        const map = new Map();
        candidates.forEach(el => {
            const text = el.textContent || '';
            for (const name of CONFIG.passengers || []) {
                if (text.includes(name)) map.set(name, el);
            }
        });

        for (const name of CONFIG.passengers || []) {
            const el = map.get(name);
            if (!el) continue;
            try {
                let checkbox = el.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    if (!checkbox.checked) checkbox.click();
                } else if (el.onclick) {
                    el.click();
                } else {
                    const clickableChild = el.querySelector('a, button, [onclick]');
                    if (clickableChild) clickableChild.click();
                }
            } catch { /* ignore */ }
        }
        await sleep(30);
    }

    // 选择席别
    function pickSeatPrefer() {
        if (!CONFIG.seatTextPrefer?.length) return;

        const seatSelects = document.querySelectorAll('select[name*="seatType"], select[id*="seatType"], select[name*="seat"]');
        if (seatSelects.length > 0) {
            seatSelects.forEach((select) => {
                for (const preferSeat of CONFIG.seatTextPrefer) {
                    const option = Array.from(select.options).find(opt =>
                        opt.text?.includes(preferSeat) || opt.value?.includes(preferSeat)
                    );
                    if (option) {
                        select.value = option.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        return;
                    }
                }
            });
            return;
        }

        const seatRadios = document.querySelectorAll('input[name*="seatType"], input[name*="seat"]');
        for (const preferSeat of CONFIG.seatTextPrefer) {
            const seatRadio = Array.from(seatRadios).find(radio => {
                const label = document.querySelector(`label[for="${radio.id}"]`);
                const labelText = label?.textContent || '';
                const parentText = radio.parentElement?.textContent || '';
                return labelText.includes(preferSeat) || parentText.includes(preferSeat);
            });
            if (seatRadio) { seatRadio.click(); return; }
        }
    }

    // 保持原有的完整 submitOrderFlow 逻辑
    async function submitOrderFlow() {
        const submitBtn = document.querySelector('#submitOrder_id');
        if (!submitBtn) return false;

        dbg('🚀 开始提交订单流程，点击提交按钮');
        submitBtn.click();

        const start = Date.now();
        const maxWait = 60000;

        while (Date.now() - start < maxWait) {
            await sleep(500);

            const pageText = document.body.innerText;

            // 修复：正确检查确认弹窗是否显示
            const confirmDialog = document.querySelector('#checkticketinfo_id');
            const isDialogVisible = confirmDialog &&
                confirmDialog.style.display !== 'none' &&
                window.getComputedStyle(confirmDialog).display !== 'none';

            if (isDialogVisible) {
                dbg('✅ 确认弹窗已出现，等待确认按钮可用');

                const confirmResult = await waitAndClickConfirmButton();
                if (confirmResult === true) {
                    dbg('🎉 确认成功！');
                    return true;
                } else if (confirmResult === false) {
                    dbg('❌ 确认失败');
                    return false;
                }
            }

            // 检查无票情况
            const noTicketKeywords = ['无票', '余票0', '余票不足', '无法满足', '车票不足'];
            const hasNoTicket = noTicketKeywords.some(k => pageText.includes(k));
            if (hasNoTicket && !CONFIG.allowNoSeat) {
                dbg('❌ 检测到无票，准备返回');
                const backBtn = document.querySelector('#back_edit_id');
                if (backBtn) {
                    dbg('🔙 点击返回按钮');
                    backBtn.click();
                }
                return false;
            }

            // 检查是否已经到达支付页面
            if (location.href.includes('/payOrder/') ||
                pageText.includes('支付') ||
                pageText.includes('订单号')) {
                dbg('🎉 已到达支付页面');
                return true;
            }

            // 检查错误情况
            const errorKeywords = ['系统繁忙', '网络异常', '提交失败', '请重试', '验证码错误'];
            if (errorKeywords.some(k => pageText.includes(k))) {
                dbg('❌ 检测到错误信息，退出流程');
                break;
            }
        }

        dbg('⏰ 提交订单流程超时');
        return false;
    }

    // 保持原有的完整确认按钮点击逻辑
    async function waitAndClickConfirmButton() {
        const maxConfirmWait = 15000;
        const start = Date.now();

        while (Date.now() - start < maxConfirmWait) {
            await sleep(50);

            const confirmBtn = document.querySelector('#qr_submit_id');
            const confirmDialog = document.querySelector('#checkticketinfo_id');

            // 更准确的弹窗检查
            const isDialogVisible = confirmDialog &&
                confirmDialog.style.display !== 'none' &&
                window.getComputedStyle(confirmDialog).display !== 'none';

            if (!isDialogVisible) {
                dbg('🎉 确认弹窗已消失，可能已成功');
                return true;
            }

            if (!confirmBtn) {
                dbg('⚠️ 确认按钮不存在，继续等待...');
                continue;
            }

            // 强制点击，不管检查结果
            try {
                dbg('🖱️ 强制点击确认按钮');

                // 多种点击方式组合
                confirmBtn.click();
                confirmBtn.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));

                // 等待响应
                await sleep(1000);

                // 检查结果
                const afterClick = document.querySelector('#checkticketinfo_id');
                const afterDialogVisible = afterClick &&
                    afterClick.style.display !== 'none' &&
                    window.getComputedStyle(afterClick).display !== 'none';

                if (!afterDialogVisible) {
                    dbg('✅ 弹窗消失，点击成功');
                    return true;
                }

                // 检查是否跳转到支付页面
                if (location.href.includes('/payOrder/')) {
                    dbg('✅ 已跳转到支付页面');
                    return true;
                }

                // 检查是否有错误信息
                const pageText = document.body.innerText;
                const errorKeywords = ['系统繁忙', '网络异常', '提交失败', '请重试', '验证码错误'];
                if (errorKeywords.some(k => pageText.includes(k))) {
                    dbg('❌ 出现错误信息');
                    return false;
                }

            } catch (error) {
                dbg('❌ 点击确认按钮失败:', error);
            }
        }

        dbg('⏰ 等待确认按钮超时');
        return null;
    }

    // 确认乘客页流程（缩短等待时间）
    async function runOnConfirmPassenger() {
        createUI();
        const fromAutoBooking = sessionStorage.getItem('tm_12306_auto_booking') === '1';
        if (!isRunning() && !fromAutoBooking) {
            ui.status.textContent = '已停止（确认页面）';
            return;
        }
        if (!requireLoginOrExit()) return;

        try {
            sessionStorage.setItem('tm_12306_auto_booking', '1');
            await sleep(150);
            await selectPassengers();
            await sleep(60);
            pickSeatPrefer();
            await sleep(60);
            await submitOrderFlow();
        } catch { /* ignore */ }
        finally {
            sessionStorage.removeItem('tm_12306_auto_booking');
        }
    }

    // 入口
    const href = location.href;
    if (/\/leftTicket\/init/.test(href)) {
        runOnLeftTicket();
    } else if (/\/confirmPassenger\//.test(href)) {
        runOnConfirmPassenger();
    }
})();
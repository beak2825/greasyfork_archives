// ==UserScript==
// @name         ETOPFUN_Roulette_Auto
// @namespace    ETOPFUN_Roulette_Auto
// @version      1.0.8
// @description  ETOPFUN Roulette Auto
// @author       HVD
// @license MIT
// @match        *://*.etopfun.*/*/roulette/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/562728/ETOPFUN_Roulette_Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/562728/ETOPFUN_Roulette_Auto.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // ===========================
    // 1. CONFIGURATION & CONSTANTS
    // ===========================
    const CONFIG = {
        STORAGE_PREFIX: 'g_',
        SELECTORS: {
            START_MONEY: 'g-start-money',
            CURRENT_MONEY: 'g-current-money',
            PROFIT_VAL: 'g-profit-val',
            CNT_WIN: 'g-cnt-win',
            CNT_LOSS: 'g-cnt-loss',
            BTN_TOGGLE: 'g-toggle-btn',
            BTN_RESET: 'g-reset-btn',
            INPUTS: {
                CAPITAL: 'inp-capital',
                BET: 'inp-bet-amount',
                BETJP: 'inp-betjp-amount',
                CUSTOM: 'inp-custom-bet',
                SKIP: 'inp-skip-loss',
                STOP_WIN: 'inp-stop-win',
                STOP_LOSS: 'inp-stop-loss',
                CHECK_10: 'inp-check-10'
            }
        },
        AUDIO: 'https://www.myinstants.com/media/sounds/brave-browser-timer-sound.mp3'
    };

    const UserAPI = {
        async getBalance() {
            const response = await fetch(`${location.origin}/api/user/bag/570/list.do?page=1&rows=200&lang=en&t=${new Date().getTime()}`);
            const json = await response.json();
            return json.datas.values || 0;
        }
    };

    // ===========================
    // 2. STATE MANAGEMENT
    // ===========================
    const State = {
        isRunning: false,
        startMoney: 0,
        currentMoney: 0,
        profit: 0,
        winCount: 0,
        lossCount: 0,
        loseStreak: 0,
        lastPredict: '',

        async load() {

            this.winCount = parseInt(GM_getValue('saved_win', 0));
            this.lossCount = parseInt(GM_getValue('saved_loss', 0));

            const realBalance = await UserAPI.getBalance();
            this.currentMoney = realBalance;

            const savedStart = GM_getValue('saved_startMoney');

            if (typeof savedStart !== 'number' || isNaN(savedStart)) {
                this.startMoney = realBalance;
                GM_setValue('saved_startMoney', this.startMoney);
            } else {
                this.startMoney = parseFloat(savedStart);
            }

            this.profit = parseFloat(this.currentMoney - this.startMoney);
            UI.updateDashboard();
        },

        save() {
            // GM_setValue('saved_profit', this.profit);
            GM_setValue('saved_win', this.winCount);
            GM_setValue('saved_loss', this.lossCount);
        },

        async reset() {
            const realBalance = await UserAPI.getBalance();
            this.startMoney = realBalance;
            this.currentMoney = realBalance;

            GM_setValue('saved_startMoney', this.startMoney);

            this.profit = 0;
            this.winCount = 0;
            this.lossCount = 0;
            this.loseStreak = 0;
            this.lastPredict = '';
            this.save();
            UI.updateDashboard();

            const box = document.getElementById('gemini-float-box');
            if (box) {
                // Đặt lại các giá trị mặc định
                const defaultTop = '120px';
                const defaultRight = '100px';
                const defaultWidth = '280px';
                const defaultHeight = 'auto';

                // Apply vào DOM ngay lập tức
                box.style.top = defaultTop;
                box.style.right = defaultRight;
                box.style.width = defaultWidth;
                box.style.height = defaultHeight;

                // Mở rộng nếu đang thu gọn
                box.classList.remove('collapsed');
                const btnCollapse = box.querySelector('#g-collapse-btn');
                if (btnCollapse) btnCollapse.innerText = '_';

                // Lưu lại vào Storage
                GM_setValue('box_top', defaultTop);
                GM_setValue('box_right', defaultRight);
                GM_setValue('box_width', defaultWidth);
                GM_setValue('box_height', defaultHeight);
                GM_setValue('box_collapsed', false);
            }
        },

        updateResult(isWin) {
            if (isWin) {
                this.winCount++;
                this.loseStreak = 0; // Reset streak nếu thắng
            } else {
                this.lossCount++;
                this.loseStreak++;
            }
            this.save();
            UI.updateDashboard();
        }
    };

    // ===========================
    // 3. UI MODULE
    // ===========================
    const UI = {
        elements: {},

        init() {
            this.injectStyles();
            this.renderHTML();
            this.cacheElements();
            this.bindEvents();
            this.loadInputs();
            this.updateDashboard();
        },

        injectStyles() {
            // Giữ nguyên style cũ của bạn và chèn thêm style cho chức năng mới
            GM_addStyle(`
                #gemini-float-box {
                    position: fixed;
                    /* Load vị trí & size từ storage */
                    top: ${GM_getValue('box_top', '120px')};
                    right: ${GM_getValue('box_right', '100px')};
                    width: ${GM_getValue('box_width', '280px')};
                    height: ${GM_getValue('box_height', 'auto')};

                    background-color: rgba(0, 0, 0, 0.95);
                    color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
                    font-family: Arial, sans-serif;
                    z-index: 99999;
                    font-size: 13px;
                    border: 1px solid #444;
                    box-sizing: border-box;

                    /* Flex layout để chia Header và Content */
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    min-width: 220px;
                    min-height: 40px;
                }

                /* --- PHẦN MỚI THÊM: HEADER --- */
                #g-header {
                    padding: 8px 12px;
                    background: #222;
                    border-bottom: 1px solid #444;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    user-select: none;
                    flex-shrink: 0;
                }
                #g-header h3 { margin: 0; color: #00bcd4; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }

                #g-collapse-btn {
                    cursor: pointer; padding: 0 6px;
                    background: #333; border-radius: 3px;
                    font-weight: bold; line-height: 1.5;
                }
                #g-collapse-btn:hover { background: #444; }

                /* --- PHẦN MỚI THÊM: CONTENT WRAPPER --- */
                #g-content {
                    padding: 20px;
                    overflow-y: auto; /* Cuộn dọc nếu dài */
                    flex: 1;
                    max-height: 80vh;
                }

                /* --- PHẦN MỚI THÊM: RESIZE HANDLE (Góc trái dưới) --- */
                #g-resize-handle {
                    width: 15px;
                    height: 15px;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    cursor: sw-resize;
                    z-index: 100;
                    background: linear-gradient(45deg, transparent 50%, #00bcd4 50%);
                    opacity: 0.7;
                }
                #g-resize-handle:hover { opacity: 1; }

                /* --- LOGIC THU GỌN --- */
                #gemini-float-box.collapsed { height: auto !important; width: 200px !important; }
                #gemini-float-box.collapsed #g-content,
                #gemini-float-box.collapsed #g-resize-handle { display: none; }


                /* --- CSS CŨ CỦA BẠN (GIỮ NGUYÊN) --- */
                .g-row { margin-bottom: 12px; display: flex; flex-direction: column; width: 100%; }
                .g-row label { margin-bottom: 5px; font-weight: bold; color: #ccc; font-size: 12px; }
                .g-input { padding: 8px 10px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff; width: 100%; box-sizing: border-box; font-size: 13px; transition: 0.3s; }
                .g-input:focus { border-color: #00bcd4; outline: none; }
                .g-input:disabled { background: #333; color: #777; border-color: #333; cursor: not-allowed; opacity: 0.7; }

                #g-profit-display { text-align: center; margin-bottom: 20px; padding: 12px; background: #111; border-radius: 8px; border: 1px solid #333; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
                .g-balance-info { display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: white; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px dashed #333; }
                .g-balance-info span span { color: #00bcd4; }

                .g-main-profit { font-size: 20px; font-weight: bold; margin: 5px 0; }
                .g-sub-stats { font-size: 12px; color: #aaa; border-top: 1px solid #333; padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-around; }

                .profit-pos { color: #00ff00 !important; text-shadow: 0 0 10px rgba(0,255,0,0.3); }
                .profit-neg { color: #ff4444 !important; text-shadow: 0 0 10px rgba(255,0,0,0.3); }
                .profit-neu { color: #ffffff !important; }
                .stat-win { color: #00ff00; font-weight: bold; }
                .stat-loss { color: #ff4444; font-weight: bold; }

                .g-btn-row { display: flex; gap: 10px; margin-top: 15px; width: 100%; }
                #g-toggle-btn { flex: 2; padding: 12px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px; text-transform: uppercase; transition: all 0.2s; color: #fff; box-sizing: border-box; }
                .btn-start { background-color: #28a745; box-shadow: 0 4px 0 #218838; }
                .btn-start:hover { background-color: #218838; transform: translateY(2px);}
                .btn-stop { background-color: #dc3545; box-shadow: 0 4px 0 #c82333; }
                .btn-stop:hover { background-color: #c82333; transform: translateY(2px);}
                .btn-start:active, .btn-stop:active { transform: translateY(4px);}

                #g-reset-btn { flex: 1; padding: 12px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px; text-transform: uppercase; background-color: #17a2b8; color: #fff; transition: all 0.2s; }
                #g-reset-btn:hover { background-color: #138496; transform: translateY(2px); }
                #g-reset-btn:active { transform: translateY(4px); }

                .g-checkbox-row { display: flex !important; align-items: center !important; margin-bottom: 12px; color: #ccc; font-size: 12px; font-weight: bold; cursor: pointer; line-height: 1; }
                .g-checkbox-row input { width: 16px; height: 16px; margin: 0 8px 0 0 !important; padding: 0 !important; cursor: pointer; display: block; }
                .g-checkbox-row label { margin: 0 !important; padding: 0 !important; cursor: pointer; user-select: none; }

                .g-row-dual label{
                    font-weight: bold; color: #ccc; font-size: 12px;
                }
                .g-row-dual {
                    display: flex !important;
                    flex-direction: row !important;
                    gap: 10px;
                    margin-bottom: 12px;
                    width: 100%;
                }
                .g-col-50 {
                    display: flex;
                    flex-direction: column;
                    flex: 1; /* Chiếm 50% chiều rộng */
                }
            `);
        },

        renderHTML() {
            const box = document.createElement('div');
            box.id = 'gemini-float-box';

            // Khôi phục trạng thái thu gọn
            if (GM_getValue('box_collapsed', false)) box.classList.add('collapsed');

            box.innerHTML = `
                <div id="g-header">
                    <h3>AUTO ROULETTE</h3>
                    <div id="g-collapse-btn">${GM_getValue('box_collapsed', false) ? '+' : '_'}</div>
                </div>

                <div id="g-content">
                    <div id="g-profit-display">
                        <div class="g-balance-info">
                            <span>Bắt đầu: <span id="${CONFIG.SELECTORS.START_MONEY}">0</span> $</span>
                            <span>Hiện tại: <span id="${CONFIG.SELECTORS.CURRENT_MONEY}">0</span> $</span>
                        </div>
                        <div class="g-main-profit">
                            Lãi: <span id="${CONFIG.SELECTORS.PROFIT_VAL}" class="profit-neu">0.00</span> $
                        </div>
                        <div class="g-sub-stats">
                            <span>Thắng: <span id="${CONFIG.SELECTORS.CNT_WIN}" class="stat-win">0</span></span>
                            <span>Thua: <span id="${CONFIG.SELECTORS.CNT_LOSS}" class="stat-loss">0</span></span>
                        </div>
                    </div>

                    <div class="g-row"><label>Tiền vốn ($)</label><input type="number" id="${CONFIG.SELECTORS.INPUTS.CAPITAL}" class="g-input" placeholder="Nhập vốn..."></div>

                    <div class="g-row-dual">
                        <div class="g-col-50">
                            <label>Cược gốc ($)</label>
                            <input type="number" id="${CONFIG.SELECTORS.INPUTS.BET}" class="g-input">
                        </div>
                        <div class="g-col-50">
                            <label>Cược JP ($)</label>
                            <input type="number" id="${CONFIG.SELECTORS.INPUTS.BETJP}" class="g-input">
                        </div>
                    </div>

                    <div class="g-row">
                        <label>Chuỗi cược tùy chỉnh (VD: 1,2,4,8,17)</label>
                        <input type="text" id="${CONFIG.SELECTORS.INPUTS.CUSTOM}" class="g-input" placeholder="">
                    </div>

                    <div class="g-row"><label>Bỏ vòng nếu chuỗi thua (lần)</label><input type="number" id="${CONFIG.SELECTORS.INPUTS.SKIP}" class="g-input" value="3"></div>

                    <div class="g-row-dual">
                        <div class="g-col-50">
                            <label>Dừng lãi ($)</label>
                            <input type="number" id="${CONFIG.SELECTORS.INPUTS.STOP_WIN}" class="g-input" value="4">
                        </div>
                        <div class="g-col-50">
                            <label>Dừng lỗ ($)</label>
                            <input type="number" id="${CONFIG.SELECTORS.INPUTS.STOP_LOSS}" class="g-input" value="10">
                        </div>
                    </div>

                    <div class="g-checkbox-row">
                        <input type="checkbox" id="${CONFIG.SELECTORS.INPUTS.CHECK_10}">
                        <label for="${CONFIG.SELECTORS.INPUTS.CHECK_10}">Kiểm tra thêm lệch 10 trận</label>
                    </div>

                    <div class="g-btn-row">
                        <button id="${CONFIG.SELECTORS.BTN_TOGGLE}" class="btn-start">Bắt đầu</button>
                        <button id="${CONFIG.SELECTORS.BTN_RESET}">Reset</button>
                    </div>
                </div>

                <div id="g-resize-handle"></div>
            `;

            document.body.appendChild(box);

            this.makeDraggable(box);
            this.makeResizable(box);
            this.handleCollapse(box);
        },

        // --- DRAG MƯỢT (Logic Delta) ---
        makeDraggable(el) {
            const header = el.querySelector('#g-header');
            header.onmousedown = (e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startY = e.clientY;
                const rect = el.getBoundingClientRect();
                const startRight = document.documentElement.clientWidth - rect.right;
                const startTop = rect.top;

                const onMouseMove = (e) => {
                    const deltaX = startX - e.clientX;
                    const deltaY = e.clientY - startY;
                    el.style.right = (startRight + deltaX) + 'px';
                    el.style.top = (startTop + deltaY) + 'px';
                    el.style.left = 'auto';
                };
                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    GM_setValue('box_top', el.style.top);
                    GM_setValue('box_right', el.style.right);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };
        },

        // --- RESIZE GÓC TRÁI DƯỚI (2 Chiều) ---
        makeResizable(el) {
            const handle = el.querySelector('#g-resize-handle');
            handle.onmousedown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = parseInt(getComputedStyle(el).width, 10);
                const startHeight = parseInt(getComputedStyle(el).height, 10);

                const onMouseMove = (e) => {
                    // Kéo sang trái -> Tăng width
                    const deltaX = startX - e.clientX;
                    // Kéo xuống -> Tăng height
                    const deltaY = e.clientY - startY;

                    const newWidth = startWidth + deltaX;
                    const newHeight = startHeight + deltaY;

                    if (newWidth > 220) el.style.width = newWidth + 'px';
                    if (newHeight > 200) el.style.height = newHeight + 'px';
                };
                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    GM_setValue('box_width', el.style.width);
                    GM_setValue('box_height', el.style.height);
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };
        },

        // --- THU GỌN ---
        handleCollapse(el) {
            const btn = el.querySelector('#g-collapse-btn');
            btn.onclick = () => {
                el.classList.toggle('collapsed');
                const isCollapsed = el.classList.contains('collapsed');
                btn.innerText = isCollapsed ? "+" : "_";

                if (!isCollapsed) {
                   el.style.height = GM_getValue('box_height', 'auto');
                } else {
                   el.style.height = 'auto';
                }
                GM_setValue('box_collapsed', isCollapsed);
            };
        },

        cacheElements() {
            this.elements = {
                startMoney: document.getElementById(CONFIG.SELECTORS.START_MONEY),
                currentMoney: document.getElementById(CONFIG.SELECTORS.CURRENT_MONEY),
                profitVal: document.getElementById(CONFIG.SELECTORS.PROFIT_VAL),
                cntWin: document.getElementById(CONFIG.SELECTORS.CNT_WIN),
                cntLoss: document.getElementById(CONFIG.SELECTORS.CNT_LOSS),
                btnToggle: document.getElementById(CONFIG.SELECTORS.BTN_TOGGLE),
                btnReset: document.getElementById(CONFIG.SELECTORS.BTN_RESET),
                inputs: {}
            };
            for (const [key, id] of Object.entries(CONFIG.SELECTORS.INPUTS)) {
                this.elements.inputs[key] = document.getElementById(id);
            }
        },

        bindEvents() {
            this.elements.btnToggle.addEventListener('click', () => Core.toggleAuto());
            this.elements.btnReset.addEventListener('click', () => State.reset());

            // Logic hiển thị tổng tiền khi click item trong game
            document.body.addEventListener('click', e => {
                if (e.target.matches('.count-right span[role="button"]') || e.target.closest('div.item_box')) {
                    this.updateSelectedAmountDisplay();
                }
            });
        },

        updateDashboard() {
            const { profit, winCount, lossCount, startMoney, currentMoney } = State;
            this.elements.startMoney.innerText = startMoney.toFixed(2);
            this.elements.currentMoney.innerText = currentMoney.toFixed(2);
            this.elements.profitVal.innerText = (profit > 0 ? "+" : "") + profit.toFixed(2);
            this.elements.profitVal.className = profit > 0 ? 'profit-pos' : (profit < 0 ? 'profit-neg' : 'profit-neu');
            this.elements.cntWin.innerText = winCount;
            this.elements.cntLoss.innerText = lossCount;
        },

        toggleInputs(disabled) {
            Object.values(this.elements.inputs).forEach(inp => inp.disabled = disabled);
        },

        setBtnState(active) {
            const btn = this.elements.btnToggle;
            if (active) {
                btn.innerText = "Dừng lại";
                btn.className = "btn-stop";
            } else {
                btn.innerText = "Bắt đầu";
                btn.className = "btn-start";
            }
        },

        saveInputs() {
            for (const [key, el] of Object.entries(this.elements.inputs)) {
                GM_setValue(CONFIG.STORAGE_PREFIX + key, (el.type === 'checkbox') ? el.checked : el.value);
            }
        },

        loadInputs() {
            for (const [key, el] of Object.entries(this.elements.inputs)) {
                const val = GM_getValue(CONFIG.STORAGE_PREFIX + key);
                if (val) {
                    if (el.type === 'checkbox') el.checked = (val === 'true');
                    else el.value = val;
                }
            }
        },

        updateSelectedAmountDisplay() {
            let display = document.querySelector('#selected-amount');
            if (!display) {
                const container = document.querySelector('.modal-body-tab');
                if (container) {
                    container.insertAdjacentHTML('beforeend', `<div><div class="btn btn-info" disabled><span id="selected-amount">Đã chọn: 0 $</span></div></div>`);
                    display = document.querySelector('#selected-amount');
                }
            }
            if (display && VNEngine?.define?.inst?.selectedList) {
                const total = VNEngine.define.inst.selectedList.reduce((acc, item) => acc + item.value, 0);
                display.textContent = `Đã chọn: ${total.toFixed(2)} \$`;
            }
        }
    };

    // ===========================
    // 4. UTILITIES
    // ===========================
    const Utils = {
        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

        // Anti-throttle worker trick preserved from original code
        waitForElement: (selector, getAll = false) => new Promise(resolve => {
            const initialCheck = document.querySelectorAll(selector);
            if (initialCheck.length > 0) return resolve(getAll ? initialCheck : initialCheck[0]);

            const workerBlob = new Blob([`
                self.onmessage = function(e) {
                    if (e.data === 'start') {
                        setInterval(() => { self.postMessage('tick'); }, 500);
                    }
                };
            `], { type: "text/javascript" });

            const workerUrl = URL.createObjectURL(workerBlob);
            const worker = new Worker(workerUrl);

            worker.onmessage = () => {
                const list = document.querySelectorAll(selector);
                if (list.length > 0) {
                    worker.terminate();
                    URL.revokeObjectURL(workerUrl);
                    resolve(getAll ? list : list[0]);
                }
            };
            worker.postMessage('start');
        }),

        preventThrottling() {
            const killEvent = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            };
            ['blur', 'visibilitychange', 'webkitvisibilitychange'].forEach(ev => window.addEventListener(ev, killEvent, true));
            document.addEventListener('visibilitychange', killEvent, true);

            Object.defineProperty(document, 'hidden', { value: false, writable: true });
            Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
            Object.defineProperty(document, 'hasFocus', { value: () => true, writable: true });

            // AudioContext hack to keep tab alive
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    const ctx = new AudioCtx();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.value = 1;
                    gain.gain.value = 0.0001;
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(0);
                    if (ctx.state === 'suspended') ctx.resume();
                }
            } catch (e) { console.error(e); }
        }
    };

    // ===========================
    // 5. CORE LOGIC
    // ===========================
    const Core = {
        toggleAuto() {
            State.isRunning ? this.stop() : this.start();
        },

        start() {
            if (!VNEngine?.define?.inst) return alert('Page chưa load xong chờ chút!');
            const cap = UI.elements.inputs.CAPITAL.value;
            const bet = UI.elements.inputs.BET.value;
            if (!cap || !bet) return alert("Vui lòng nhập Vốn và Tiền Cược!");

            UI.saveInputs();
            State.isRunning = true;
            UI.setBtnState(true);
            UI.toggleInputs(true);

            this.hookGameEngine();
        },

        stop() {
            State.loseStreak = 0;
            State.isRunning = false;
            UI.setBtnState(false);
            UI.toggleInputs(false);
        },

        calculateBetAmount() {
            const currentBet = parseFloat(UI.elements.inputs.BET.value);
            const customSeqStr = UI.elements.inputs.CUSTOM.value.trim();

            // Nếu có nhập chuỗi Custom (VD: 1,2,4,8,17)
            if (customSeqStr) {
                const seq = customSeqStr.split(',').map(n => parseFloat(n));
                // Nếu thua nhiều hơn độ dài chuỗi thì lấy số cuối cùng
                return seq[State.loseStreak] !== undefined
                       ? seq[State.loseStreak]
                       : seq[seq.length - 1];
            }

            // Mặc định: Martingale (Nhân 2 mũ số lần thua)
            return currentBet * (2 ** State.loseStreak);
        },

        checkStopConditions() {
            const stopWin = parseFloat(UI.elements.inputs.STOP_WIN.value) || 0;
            const stopLoss = parseFloat(UI.elements.inputs.STOP_LOSS.value) || 0;

            if (stopWin > 0 && State.profit >= stopWin) {
                alert(`✅ Đã đạt mục tiêu lãi: ${State.profit}$`);
                this.stop();
                return true;
            }
            if (stopLoss > 0 && State.profit <= -stopLoss) {
                alert(`⚠️ Đã chạm giới hạn lỗ: ${State.profit}$`);
                this.stop();
                return true;
            }
            return false;
        },

        hookGameEngine() {
            if (window._parseCoinMsg) return; // Prevent double hook
            window._parseCoinMsg = VNEngine.define.inst.parseCoinMsg;

            VNEngine.define.inst.parseCoinMsg = async (data) => {
                window._parseCoinMsg(data);
                if (!State.isRunning || data.type != 3) return;
                await this.handleGameMessage(data);
            };
        },

        async handleGameMessage(data) {

            const roundId = data.datas.id;
            const mapWinpick = win => win === 'c1' ? 'a' : win === 'c14' ? 'b' : win;
            const betJPVal = parseFloat(UI.elements.inputs.BETJP.value);

            // XỬ LÝ KẾT QUẢ VÁN TRƯỚC
            if (State.lastPredict !== '') {
                const result = mapWinpick(data.datas.winpicksub);
                const isWin = (data.datas.winpicksub === 'd' && State.lastPredict === 'd') || (result === State.lastPredict);

                // Tính tiền log hiển thị (Ván vừa xổ xong)
                let resultAmount = 0;
                if (State.lastPredict === 'd') {
                    resultAmount = betJPVal;
                    if (isWin) resultAmount *= 14;
                } else {
                    // Logic tính tiền ván trước cũng dùng hàm này (lưu ý: loseStreak lúc này chưa cập nhật)
                    resultAmount = this.calculateBetAmount();
                }

                if (isWin) {
                    State.loseStreak = 0;
                    new Audio(CONFIG.AUDIO).play();
                    console.log(`%c✅ THẮNG (+${resultAmount}) -> ID: ${roundId}`, "color: #00FF00; font-weight: bold;");
                } else {
                    console.log(`%c❌ THUA (-${resultAmount}) -> ID: ${roundId}`, "color: red; font-weight: bold;");
                    // Lưu ý: Nếu muốn đánh D thua KHÔNG tăng streak thì thêm if ở đây
                }
                console.groupEnd();

                State.currentMoney = await UserAPI.getBalance();
                State.profit = State.currentMoney - State.startMoney;
                UI.updateDashboard();

                State.updateResult(isWin, resultAmount);
                State.lastPredict = '';
            }

            if (this.checkStopConditions()) { console.groupEnd(); return; }

            // LOGIC BET: JP
            if (betJPVal > 0) {
                const last3Str = [...VNEngine.define.inst.last10WinNum].slice(-3).map(i => i.winpicksub).join('');
                if (last3Str.endsWith('dd') && last3Str !== 'ddd') {
                    await this.placeBet('d', betJPVal, roundId);
                    return;
                }
            }

            // LOGIC BET: A/B
            const last10 = [...VNEngine.define.inst.last10WinNum].filter(i => i.winpicksub !== 'd').slice(-4);
            const winGrouped = last10.map(w => mapWinpick(w.winpicksub));
            const allSame = new Set(winGrouped).size === 1;

            if (!allSame) { State.loseStreak = 0; return; }

            const timeLog = new Date().toLocaleTimeString();
            console.group(`%c[${timeLog}] PHÁT HIỆN CHUỖI: ${winGrouped[0]}`, "background: #333; color: white; padding: 5px;");

            const skipLimit = parseInt(UI.elements.inputs.SKIP.value);
            if (State.loseStreak > 0 && State.loseStreak >= skipLimit) {
                console.log(`%c❌ CHUỖI THUA ${State.loseStreak} => SKIP`, "color: red; font-weight: bold;");
                console.groupEnd();
                return;
            }

            // CHECK LỆCH 10
            const predictWin = winGrouped[0] === 'a' ? 'b' : 'a';
            if (UI.elements.inputs.CHECK_10.checked) {
                const summaryCount = document.querySelectorAll('.roll-last-summer span');
                if (summaryCount.length >= 2) {
                    const ct = parseInt(summaryCount[0].textContent), t = parseInt(summaryCount[1].textContent);
                    if ((ct - t >= 10 && predictWin === 'a') || (t - ct >= 10 && predictWin === 'b')) {
                        console.log(`%c❌ LỆCH > 10 => SKIP`, "color: red; font-weight: bold;");
                        console.groupEnd();
                        return;
                    }
                }
            }

            // TÍNH TIỀN CƯỢC VÁN MỚI
            const nextBetAmount = this.calculateBetAmount();
            await this.placeBet(predictWin, nextBetAmount, roundId);
        },

        async placeBet(predictSide, finalAmount, roundId) { // Tham số thứ 2 đổi thành finalAmount

            const sideBtns = await Utils.waitForElement('.jackpotroll-item-header-active', true);
            if (predictSide === 'b') sideBtns[0].click();
            else if (predictSide === 'd') sideBtns[1].click();
            else sideBtns[3].click();

            await Utils.waitForElement('.el-dialog__body');
            const dotaTabXPath = "//div[contains(@class,'el-dialog__body')]//*[contains(@class,'btn')][.//span[normalize-space()='DOTA2']]";
            document.evaluate(dotaTabXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.click();

            let items = await Utils.waitForElement('.dota2-list .item_price', true);
            if (!items || items.length === 0) { console.error("❌ Hết item."); console.groupEnd(); return this.stop(); }

            // BỎ LOGIC TÍNH TOÁN CŨ, DÙNG THẲNG SỐ TIỀN ĐƯỢC TRUYỀN VÀO
            let targetAmount = finalAmount;

            const solver = (list, target, idx = 0, sum = 0, selected = []) => {
                if (Math.abs(sum - target) < 0.001) {
                    selected.forEach(el => el.closest('div').click());
                    return true;
                }
                if (idx >= list.length || sum > target) return false;
                return solver(list, target, idx + 1, sum + parseFloat(list[idx].innerText), [...selected, list[idx]]) ||
                       solver(list, target, idx + 1, sum, selected);
            };

            if (!solver(items, targetAmount)) {
                console.log("🔍 Trang 1 thiếu, lật trang...");
                const pages = [...document.querySelectorAll('.el-pager li.number:not(.active)')];
                let found = false;
                for (let page of pages) {
                    page.click();
                    await Utils.sleep(700);
                    items = [...document.querySelectorAll('.dota2-list .item_price')];
                    if (solver(items, targetAmount)) { found = true; break; }
                }
                if (!found) { console.error("❌ Không đủ item."); console.groupEnd(); return; }
            }

            await Utils.sleep(1000);
            const submitBtn = document.querySelector('.el-dialog__body button.btn.btn-primary');
            if (submitBtn) {
                submitBtn.click();
                State.lastPredict = predictSide;
                console.log(`%c🚀 ĐÃ CƯỢC "${predictSide}" - TIỀN: ${targetAmount}`, "background: green; color: white;");
            }
        }
    };

    // ===========================
    // 6. INITIALIZATION
    // ===========================
    State.load();
    UI.init();
    Utils.preventThrottling();

})();
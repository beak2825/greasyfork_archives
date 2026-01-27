// ==UserScript==
// @name         ETOPFUN Roulette
// @namespace    etopfun-roulette
// @version      1.3.2
// @description  ETOPFUN Roulette Auto Bet & Shark Tracker Script
// @author       Gemini
// @match        *://*.etopfun.*/*/roulette/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      api.telegram.org
// @connect      firebaseio.com
// @connect      firebasedatabase.app
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563850/ETOPFUN%20Roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/563850/ETOPFUN%20Roulette.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = '1.3.2';
    console.log(`🔵 Script Injecting... (v${VERSION})`);

    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                              CONFIGURATION                                   ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const CONFIG = {
        API: {
            JOIN: '/api/coinflip/jackpot/join.do',
            INVENTORY: '/api/user/bag/570/listroll.do',
        },
        TIMING: {
            DELAY_BET: 500
        },
        RETENTION_DAYS: 7,
        TELEGRAM: {
            TOKEN: '8543175557:AAEJ1XXOXeAy5PG4evwoCP7Hz85dtFFHJaA',
            CHAT_ID: '-4784777154'
        },
        FIREBASE: {
            // 🔥 DÁN LINK FIREBASE CỦA BẠN VÀO DƯỚI ĐÂY
            URL: 'https://sharkcl0ud-default-rtdb.asia-southeast1.firebasedatabase.app/'
        }
    };

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                        CORE: BACKGROUND WORKER                               ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const WorkerTimer = {
        worker: null,
        callbacks: new Map(),
        init() {
            const blob = new Blob([`
                const timers = {};
                self.onmessage = function(e) {
                    const { id, ms, type } = e.data;
                    if (type === 'timeout') {
                        timers[id] = setTimeout(() => { postMessage({ id }); delete timers[id]; }, ms);
                    }
                    if (type === 'interval') {
                        timers[id] = setInterval(() => postMessage({ id, isInterval: true }), ms);
                    }
                    if (type === 'clear') {
                        if (timers[id]) { clearTimeout(timers[id]); clearInterval(timers[id]); delete timers[id]; }
                    }
                };
            `], {
                type: 'text/javascript'
            });

            this.worker = new Worker(window.URL.createObjectURL(blob));
            this.worker.onmessage = (e) => {
                const cb = this.callbacks.get(e.data.id);
                if (cb) {
                    cb();
                }
                if (!e.data.isInterval) {
                    this.callbacks.delete(e.data.id);
                }
            };
        },
        wait(ms) {
            return new Promise(r => {
                const id = Math.random().toString(36).substr(2);
                this.callbacks.set(id, r);
                this.worker.postMessage({
                    id,
                    ms,
                    type: 'timeout'
                });
            });
        },
        loop(fn, ms) {
            const id = Math.random().toString(36).substr(2);
            this.callbacks.set(id, fn);
            this.worker.postMessage({
                id,
                ms,
                type: 'interval'
            });
            return id;
        },
        clear(id) {
            if (id) {
                this.worker.postMessage({
                    id,
                    type: 'clear'
                });
                this.callbacks.delete(id);
            }
        }
    };
    WorkerTimer.init();

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                           SYSTEM UTILS                                       ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const Spoofer = {
        active() {
            try {
                const AC = win.AudioContext || win.webkitAudioContext;
                if (AC) {
                    const ctx = new AC();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.value = 1;
                    gain.gain.value = 0.0001;
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(0);
                    const resumeAudio = () => {
                        if (ctx.state === 'suspended') {
                            ctx.resume();
                        }
                        ['click', 'keydown', 'touchstart'].forEach(evt => document.removeEventListener(evt, resumeAudio));
                    };
                    ['click', 'keydown', 'touchstart'].forEach(evt => document.addEventListener(evt, resumeAudio));
                }
            } catch (e) {}
            try {
                Object.defineProperties(win.document, {
                    hidden: {
                        value: false,
                        configurable: true
                    },
                    visibilityState: {
                        value: 'visible',
                        configurable: true
                    },
                    hasFocus: {
                        value: () => true,
                        configurable: true
                    }
                });
            } catch (e) {}
            try {
                const block = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                };
                ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'blur', 'pagehide'].forEach(evt => {
                    win.addEventListener(evt, block, true);
                    win.document.addEventListener(evt, block, true);
                });
            } catch (e) {}
        }
    };
    Spoofer.active();

    const TimeSync = {
        offset: 0,
        ready: false,
        init() {
            if (!Cloud.isValid) {
                return;
            }
            GM_xmlhttpRequest({
                method: "HEAD",
                url: CONFIG.FIREBASE.URL,
                onload: (resp) => {
                    const serverDateStr = resp.responseHeaders.match(/Date: (.*)/i);
                    if (serverDateStr && serverDateStr[1]) {
                        this.offset = new Date(serverDateStr[1]).getTime() - new Date().getTime();
                        this.ready = true;
                        Cloud.load();
                        WorkerTimer.wait(5000).then(() => Cloud.autoClean());
                    }
                }
            });
        },
        getDateKey() {
            const now = new Date().getTime();
            const adjustedTime = new Date(now + this.offset);
            const vnDateStr = adjustedTime.toLocaleDateString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh'
            });
            const parts = vnDateStr.split('/');
            return `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
        },
        parseDateKey: (dateStr) => {
            const parts = dateStr.split('-');
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
    };

    const Utils = {
        formatMoney: (val) => val >= 0 ? `+$${val.toFixed(2)}` : `-$${Math.abs(val).toFixed(2)}`,
        mapResult: (sub) => {
            const s = String(sub).toLowerCase().trim();
            if (['c', 'c1', 'c14'].includes(s)) {
                return 'c';
            }
            if (s === 'd') {
                return 'd';
            }
            return s;
        },
        getLabel: (sub) => {
            const s = String(sub).toLowerCase().trim();
            const mapped = Utils.mapResult(s);
            if (mapped === 'a') return 'A (Cảnh Sát)';
            if (mapped === 'b') return 'B (Cướp)';
            if (['c', 'c1', 'c14'].includes(s)) return `${s.toUpperCase()} (X7)`;
            if (mapped === 'd') return 'D (X14)';
            return s.toUpperCase();
        },
        compressHead: (url) => {
            if (!url) return "";
            return url.split('/').pop(); // Lấy phần tử cuối sau dấu /
        },
        decompressHead: (filename) => {
            if (!filename) return "";
            if (filename.startsWith('http')) return filename;
            return `https://avatars.steamstatic.com/${filename}`;
        },
        getDisplayInfo: (s) => {
            return {
                name: s.name || s.steamId || 'Unknown', // Nếu mất tên thì hiện SteamID
                head: s.head || 'https://www.google.com/s2/favicons?sz=16&domain=steampowered.com' // Default Logo Steam
            };
        }
    };

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                        CLOUD MODULE                                          ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const Cloud = {
        isWritable: true,
        working: false,

        get isValid() {
            const url = CONFIG.FIREBASE.URL;
            return url && (url.includes('firebaseio.com') || url.includes('firebasedatabase.app'));
        },

        get enabled() {
            const isSyncOn = document.getElementById('inp-cloud_sync')?.checked ?? true;
            return isSyncOn && this.isValid;
        },

        get url() {
            let base = CONFIG.FIREBASE.URL;
            if (!base.endsWith('/')) {
                base += '/';
            }
            return `${base}sharks/${TimeSync.getDateKey()}.json`;
        },

        load(manual = false) {
            if (!manual && !this.enabled) {
                UI.updateSyncDot('off');
                return;
            }
            if (!this.isValid) {
                if (manual) {
                    UI.log('⚠️ Link Firebase không hợp lệ!', 'warn');
                }
                return;
            }

            const dateKey = TimeSync.getDateKey();
            if (manual) {
                UI.log(`☁️ Syncing: ${dateKey}...`, 'info');
            }

            this.working = true;
            UI.updateSyncDot('working');

            GM_xmlhttpRequest({
                method: "GET",
                url: this.url,
                onload: (resp) => {
                    this.working = false;
                    try {
                        const cloudData = JSON.parse(resp.responseText);
                        if (cloudData && typeof cloudData === 'object') {

                            Object.keys(cloudData).forEach(key => {
                                cloudData[key].steamId = key;
                                if (cloudData[key].head) {
                                    cloudData[key].head = Utils.decompressHead(cloudData[key].head);
                                }
                            });
                            SharkTracker.data = cloudData;
                            SharkTracker.save();

                            UI.updateSharkTable();
                            UI.updateStats();

                            this.isWritable = true;
                            if (manual) {
                                UI.log(`✅ Đã tải dữ liệu ngày ${dateKey}`, 'success');
                            }
                        } else {
                            if (manual) {
                                UI.log('☁️ Cloud chưa có dữ liệu', 'info');
                            }
                            if (this.enabled && !manual && this.isWritable) {
                                this.push(SharkTracker.data, true);
                            }
                        }
                        UI.updateSyncDot(this.enabled ? 'on' : 'off');
                    } catch (e) {
                        UI.log('❌ Lỗi đọc Cloud', 'error');
                        UI.updateSyncDot('off');
                    }
                },
                onerror: () => {
                    this.working = false;
                    UI.log('❌ Kết nối Cloud thất bại', 'error');
                    UI.updateSyncDot('off');
                }
            });
        },

        push(updates, isFullReplace = false) {
            if (!this.enabled || Object.keys(updates).length === 0) {
                UI.updateSyncDot('off');
                return;
            }
            if (!this.isWritable && !isFullReplace) {
                console.warn('🚫 Cloud Write Blocked');
                return;
            }

            this.working = true;
            UI.updateSyncDot('working');

            GM_xmlhttpRequest({
                method: isFullReplace ? "PUT" : "PATCH",
                url: this.url,
                data: JSON.stringify(updates),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: () => {
                    this.working = false;
                    UI.updateSyncDot('on');
                },
                onerror: () => {
                    this.working = false;
                    UI.updateSyncDot('on');
                }
            });
        },

        resetCloud() {
            if (!this.isValid) {
                return;
            }
            const dateKey = TimeSync.getDateKey();
            const doReset = () => {
                GM_xmlhttpRequest({
                    method: "PUT",
                    url: this.url,
                    data: "{}",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: () => UI.log(`🔥 Đã xóa sạch data Cloud ngày ${dateKey}`, 'warn'),
                    onerror: () => UI.log('❌ Xóa data trên Cloud thất bại', 'error')
                });
            };
            if (win.VNEngine && win.VNEngine.dialog && win.VNEngine.dialog.confirm) {
                win.VNEngine.dialog.confirm(
                    'XÓA DỮ LIỆU CLOUD',
                    `Bạn có chắc muốn xóa sạch dữ liệu ngày ${dateKey} trên Cloud không?\n\nHành động này không thể khôi phục lại được!`,
                    doReset
                );
            } else if (confirm(`Xóa sạch Cloud ngày ${dateKey}?`)) {
                doReset();
            }
        },

        autoClean() {
            if (!this.isValid) {
                return;
            }
            const today = TimeSync.getDateKey();
            const lastCheck = GM_getValue('last_auto_clean_date', '');
            if (lastCheck === today) {
                return;
            }

            let baseUrl = CONFIG.FIREBASE.URL;
            if (!baseUrl.endsWith('/')) {
                baseUrl += '/';
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `${baseUrl}sharks.json?shallow=true`,
                onload: (resp) => {
                    try {
                        const keys = JSON.parse(resp.responseText);
                        if (!keys) {
                            return;
                        }
                        const now = new Date();
                        const cutoffDate = new Date(now);
                        cutoffDate.setDate(now.getDate() - CONFIG.RETENTION_DAYS);
                        const datesToDelete = [];
                        Object.keys(keys).forEach(dateStr => {
                            if (Utils.parseDateKey(dateStr) < cutoffDate) {
                                datesToDelete.push(dateStr);
                            }
                        });
                        if (datesToDelete.length > 0) {
                            UI.log(`🧹 Đang dọn ${datesToDelete.length} ngày dữ liệu cũ...`, 'info');
                            datesToDelete.forEach(date => {
                                GM_xmlhttpRequest({
                                    method: "DELETE",
                                    url: `${baseUrl}sharks/${date}.json`
                                });
                            });
                        }
                        GM_setValue('last_auto_clean_date', today);
                    } catch (e) {}
                }
            });
        }
    };

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                        STATS MODULE                                          ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const Stats = {
        isListVisible: false,
        cache: [],
        sortKey: 'profit',
        sortDesc: true,
        filter: '',

        toggleList() {
            const list = document.getElementById('stats-dropdown-list');
            const icon = document.getElementById('stats-dropdown-icon');
            if (this.isListVisible) {
                list.style.display = 'none';
                icon.textContent = '▼';
            } else {
                list.style.display = 'block';
                icon.textContent = '▲';
                if (list.children.length <= 1) {
                    this.getAvailableDates();
                }
            }
            this.isListVisible = !this.isListVisible;
        },

        getAvailableDates() {
            if (!Cloud.isValid) {
                UI.log('⚠️ Link Firebase không hợp lệ', 'warn');
                return;
            }

            const listContainer = document.getElementById('stats-dropdown-list');
            listContainer.innerHTML = '<div style="padding:8px;text-align:center;color:#888">Loading...</div>';

            let baseUrl = CONFIG.FIREBASE.URL;
            if (!baseUrl.endsWith('/')) {
                baseUrl += '/';
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `${baseUrl}sharks.json?shallow=true`,
                onload: (resp) => {
                    try {
                        const keys = JSON.parse(resp.responseText);
                        listContainer.innerHTML = '';

                        if (!keys) {
                            listContainer.innerHTML = '<div style="padding:8px;text-align:center">No Data</div>';
                            return;
                        }

                        const sortedDates = Object.keys(keys).sort((a, b) => {
                            const dateA = a.split('-').reverse().join('');
                            const dateB = b.split('-').reverse().join('');
                            return dateB.localeCompare(dateA);
                        });

                        const allItem = document.createElement('div');
                        allItem.className = 'dropdown-item';
                        allItem.innerHTML = `<input type="checkbox" id="chk-stats-all"> <label for="chk-stats-all" class="cursor-pointer font-bold purple-text">Chọn tất cả (${sortedDates.length})</label>`;
                        listContainer.appendChild(allItem);

                        sortedDates.forEach(date => {
                            const item = document.createElement('div');
                            item.className = 'dropdown-item';
                            const chkId = `chk-date-${date}`;
                            item.innerHTML = `<input type="checkbox" id="${chkId}" value="${date}" class="stats-date-chk"> <label for="${chkId}" class="cursor-pointer w-full">${date}</label>`;

                            item.onclick = (e) => {
                                if (e.target.tagName !== 'INPUT') {
                                    e.preventDefault();
                                    const chk = item.querySelector('input');
                                    chk.checked = !chk.checked;
                                    updateLabel();
                                }
                                e.stopPropagation();
                            };
                            const input = item.querySelector('input');
                            input.onclick = (e) => {
                                e.stopPropagation();
                                updateLabel();
                            };
                            listContainer.appendChild(item);
                        });

                        const chkAll = listContainer.querySelector('#chk-stats-all');
                        if (chkAll) {
                            chkAll.onclick = (e) => {
                                listContainer.querySelectorAll('.stats-date-chk').forEach(c => c.checked = e.target.checked);
                                updateLabel();
                                e.stopPropagation();
                            };
                        }

                        const updateLabel = () => {
                            const count = listContainer.querySelectorAll('.stats-date-chk:checked').length;
                            document.getElementById('stats-dropdown-label').textContent = count > 0 ? `Đã chọn ${count} ngày` : 'Chọn ngày báo cáo...';
                        };

                    } catch (e) {
                        listContainer.innerHTML = '<div style="padding:8px;color:red">Error loading</div>';
                    }
                }
            });
        },

        async calculate() {
            const checkboxes = document.querySelectorAll('.stats-date-chk:checked');
            if (checkboxes.length === 0) {
                UI.log('⚠️ Chưa chọn ngày nào!', 'warn');
                return;
            }

            const dates = Array.from(checkboxes).map(c => c.value);
            UI.log(`📊 Đang tổng hợp ${dates.length} ngày...`, 'info');

            if (this.isListVisible) {
                this.toggleList();
            }

            const totalData = {};
            let aggregatedHouseRevenue = 0;
            let baseUrl = CONFIG.FIREBASE.URL;
            if (!baseUrl.endsWith('/')) {
                baseUrl += '/';
            }

            const promises = dates.map(date => {
                return new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${baseUrl}sharks/${date}.json`,
                        onload: (resp) => resolve(JSON.parse(resp.responseText)),
                        onerror: () => resolve(null)
                    });
                });
            });

            const results = await Promise.all(promises);

            results.forEach(dayData => {
                if (!dayData) {
                    return;
                }

                Object.entries(dayData).forEach(([sid, shark]) => {
                    // Logic: House = -User Profit
                    aggregatedHouseRevenue -= shark.profit;

                    if (!totalData[sid]) {
                        totalData[sid] = { ...shark,
                            steamId: sid
                        };
                    } else {
                        totalData[sid].wins += shark.wins;
                        totalData[sid].losses += shark.losses;
                        totalData[sid].profit += shark.profit;
                        if (shark.name) totalData[sid].name = shark.name;
                        if (shark.head) totalData[sid].head = shark.head;
                    }
                });
            });

            this.cache = Object.values(totalData);
            this.renderTable();

            const houseEl = document.getElementById('st-stats-house');
            if (houseEl) {
                houseEl.textContent = Utils.formatMoney(aggregatedHouseRevenue);
                houseEl.className = aggregatedHouseRevenue >= 0 ? 'pos' : 'neg';
            }
            UI.log(`✅ Tổng hợp xong!`, 'success');
        },

        renderTable() {
            let list = [...this.cache];

            if (this.filter) {
                list = list.filter(s =>
                    (s.name && s.name.toLowerCase().includes(this.filter)) ||
                    (s.steamId && s.steamId.includes(this.filter))
                );
            }

            list.sort((a, b) => {
                const key = this.sortKey;
                const valA = key === 'winrate' ? (a.wins / (a.wins + a.losses) || 0) : a[key];
                const valB = key === 'winrate' ? (b.wins / (b.wins + b.losses) || 0) : b[key];
                return this.sortDesc ? valB - valA : valA - valB;
            });

            const tbody = document.getElementById('stats-list');
            if (!list.length) {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center pad-10">No Data</td></tr>';
                return;
            }

            tbody.innerHTML = list.map(s => {
                const total = s.wins + s.losses;
                const winrate = total > 0 ? (s.wins / total) * 100 : 0;
                const info = Utils.getDisplayInfo(s);
                return `
                    <tr>
                        <td>
                            <div class="shark-name-wrap">
                                <img src="${info.head}" class="shark-avatar" onerror="this.style.display='none'">
                                ${info.name}
                            </div>
                        </td>
                        <td class="${s.profit >= 0 ? 'pos' : 'neg'}">${s.profit >= 0 ? '+' : ''}${s.profit.toFixed(2)}</td>
                        <td>${winrate.toFixed(0)}% <span class="sub-text">(${s.wins}/${s.losses})</span></td>
                    </tr>
                `;
            }).join('');
        },

        toggleSort(key) {
            if (this.sortKey === key) {
                this.sortDesc = !this.sortDesc;
            } else {
                this.sortKey = key;
                this.sortDesc = true;
            }
            this.renderTable();
        }
    };

    const Telegram = {
        get enabled() {
            return GM_getValue('tg_enabled', false);
        },
        get player() {
            return GM_getValue('tg_player', 'Player');
        },
        send(msg) {
            if (!this.enabled) {
                return;
            }
            const prefix = State.demoMode ? '🧪 *[DEMO]* ' : '🦈 *[LIVE]* ';
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://api.telegram.org/bot${CONFIG.TELEGRAM.TOKEN}/sendMessage`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    chat_id: CONFIG.TELEGRAM.CHAT_ID,
                    text: `${prefix} [${this.player}] ${msg}`,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                })
            });
        }
    };

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                           GLOBAL STATE                                       ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const State = {
        running: false,
        activeMode: null,
        demoMode: false,
        roundId: 0,
        profit: 0,
        houseProfit: 0,
        houseRounds: 0,
        wins: 0,
        losses: 0,
        placedSides: [],
        currentBets: [],

        normal: {
            chasing: false, // Đang trong chuỗi đuổi (cho Method A)
            targetSide: null, // Bên đang nuôi
            nextAmount: 0, // Số tiền ván tiếp theo (Martingale)
        },

        init() {
            const saved = GM_getValue('saved_stats', null);
            if (saved) {
                this.profit = saved.profit || 0;
                this.wins = saved.wins || 0;
                this.losses = saved.losses || 0;
                this.houseProfit = saved.houseProfit || 0;
                this.houseRounds = saved.houseRounds || 0;
            }
        },
        save() {
            GM_setValue('saved_stats', {
                profit: this.profit,
                wins: this.wins,
                losses: this.losses,
                houseProfit: this.houseProfit,
                houseRounds: this.houseRounds
            });
        },
        resetPL() {
            this.profit = 0;
            this.wins = 0;
            this.losses = 0;
            this.placedSides = [];
            this.currentBets = [];
            this.save();
            UI.updateStats();
            UI.log('↺ Đã Reset P/L', 'info');
        },
        resetHouse() {
            this.houseProfit = 0;
            this.houseRounds = 0;
            this.save();
            UI.updateStats();

            UI.log('🏠 Đã Reset Nhà Cái', 'warn');
        },
        updateHouse(roundUserProfit) {
            this.houseProfit -= roundUserProfit;
            this.houseRounds++;
            this.save();
            UI.updateStats();
        },
        updateResult(winpicksub) {
            if (!this.currentBets.length) {
                return;
            }
            const resultSide = Utils.mapResult(winpicksub);
            let roundProfit = 0;
            let hasWin = false;
            let winType = "LOSS";

            this.currentBets.forEach(bet => {
                let won = false;
                let profitMult = -1;
                if (bet.side === resultSide) {
                    won = true;
                    if (bet.side === 'c') profitMult = 6;
                    else if (bet.side === 'd') profitMult = 13;
                    else profitMult = 1;
                }
                if (won) {
                    hasWin = true;
                    roundProfit += bet.amount * profitMult;
                    if (profitMult === 6) winType = "X7";
                    else if (profitMult === 13) winType = "X14";
                    else winType = "X2";
                } else {
                    roundProfit -= bet.amount;
                }
            });

            if (this.activeMode === 'normal') {
                const base = parseFloat(UI.get('normal_base')) || 1;
                const method = UI.get('normal_method');
                const lastBetAmount = this.currentBets[0]?.amount || base;

                // Xử lý riêng cho Method B (Bẻ cầu 4)
                if (method === 'B' && this.normal.chasing) {
                    if (hasWin) {
                        // Nếu Thắng -> Dừng đuổi, Reset trạng thái
                        this.normal.chasing = false;
                        this.normal.targetSide = null;
                        this.normal.nextAmount = base;
                        UI.log('🛑 Bẻ cầu thành công (Win).', 'info');
                    } else {
                        // Nếu Thua (ra A tiếp hoặc ra D) -> Vẫn giữ chasing = true, Gấp thếp tiền
                        this.normal.nextAmount = lastBetAmount * 2;
                    }
                }
                // Xử lý cho Method A (Chênh lệch) - Điều kiện dừng nằm ở strategyMethodA, ở đây chỉ tính tiền
                else {
                    if (hasWin) {
                        this.normal.nextAmount = base;
                    } else {
                        this.normal.nextAmount = lastBetAmount * 2;
                    }
                }
            }

            this.profit += roundProfit;
            const roundProfitStr = Utils.formatMoney(roundProfit);
            const profitStr = Utils.formatMoney(this.profit);

            if (hasWin) {
                this.wins++;
                UI.log(`✅ WIN (${winType}): ${roundProfitStr}`, winType === 'X14' ? 'jackpot' : 'success');
                Telegram.send(`✅ WIN (${winType}) ${roundProfitStr} | Total: ${profitStr}`);
            } else {
                this.losses++;
                UI.log(`❌ LOSS: ${roundProfitStr}`, 'error');
                Telegram.send(`❌ LOSS ${roundProfitStr} | Total: ${profitStr}`);
            }
            this.currentBets = [];
            this.placedSides = [];
            this.save();
            UI.updateStats();
        }
    };

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                         GAME ENGINE WRAPPER                                  ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const VNE = {
        get inst() {
            return (win.VNEngine && win.VNEngine.define) ? win.VNEngine.define.inst : null;
        },
        hooked: false,
        hook() {
            if (!this.inst || this.hooked) {
                return false;
            }
            const original = this.inst.parseCoinMsg;
            this.inst.parseCoinMsg = function(data) {
                if (original) {
                    original.call(this, data);
                }
                try {
                    Bot.onData(data);
                } catch (e) {
                    console.error('Bot Err', e);
                }
            };
            this.hookWS();
            this.hooked = true;
            UI.log('✅ Hook VNEngine Success', 'api');
            TimeSync.init();
            UI.updateSyncDot(UI.get('cloud_sync') ? 'working' : 'off');
            return true;
        },
        hookWS() {
            if (this.inst && this.inst.wsExample) {
                const originalError = this.inst.wsExample.onerror;
                this.inst.wsExample.onerror = (e) => {
                    if (typeof originalError === 'function') {
                        originalError.call(this.inst.wsExample, e);
                    }
                    if (this.inst.getToken) {
                        this.inst.getToken();
                    }
                };
                const originalClose = this.inst.wsExample.onclose;
                this.inst.wsExample.onclose = (e) => {
                    if (typeof originalClose === 'function') {
                        originalClose.call(this.inst.wsExample, e);
                    }
                    if (this.inst.getToken) {
                        this.inst.getToken();
                    }
                };
            } else {
                WorkerTimer.wait(1000).then(() => this.hookWS());
            }
        },
        async getInventory() {
            return new Promise(resolve => {
                if (!this.inst) {
                    return resolve([]);
                }
                try {
                    win.VNEngine.ajax.get(CONFIG.API.INVENTORY, resp => {
                        if (resp?.statusCode === 200 && resp.datas?.list) {
                            const items = resp.datas.list.filter(i => (!i.status?.lock && !i.status?.limit) && (i.state === 0 || !i.state)).map(i => ({
                                id: i.id,
                                price: parseFloat(i.value) || 0
                            })).filter(i => i.price > 0).sort((a, b) => b.price - a.price);
                            resolve(items);
                        } else {
                            resolve([]);
                        }
                    }, {
                        page: 1,
                        rows: 500,
                        max: 50000
                    }, false, false);
                } catch (e) {
                    resolve([]);
                }
            });
        },
        async sendBet(roundId, itemIds, side) {
            return new Promise(resolve => {
                try {
                    win.VNEngine.ajax.post(CONFIG.API.JOIN, resp => {
                        resolve({
                            success: resp?.statusCode === 200,
                            msg: resp?.message
                        });
                    }, {
                        infoid: roundId,
                        itemIds,
                        appid: this.inst.appid || '570',
                        pick: side
                    }, false, true);
                } catch (e) {
                    resolve({
                        success: false,
                        msg: e.message
                    });
                }
            });
        }
    };

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                          SHARK TRACKER                                       ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const SharkTracker = {
        data: {},
        bettingMap: {},
        sortKey: 'profit',
        sortDesc: true,
        filter: '',

        init() {
            this.data = GM_getValue('saved_sharks', {});
            const lastDate = GM_getValue('last_working_date', '');
            const today = TimeSync.getDateKey();

            // Nếu ngày lưu khác ngày hôm nay => Reset dữ liệu Shark
            if (lastDate && lastDate !== today) {
                this.data = {};
                this.save();
                GM_setValue('last_working_date', today);
                console.log('📅 New Day Detected: Shark Data Reset');
            }
        },
        save() {
            GM_setValue('saved_sharks', this.data);
        },

        resetSharkData() {
            this.data = {};
            this.bettingMap = {};
            this.save();
            UI.updateSharkTable();
            Cloud.isWritable = false;
            const syncToggle = document.getElementById('inp-cloud_sync');
            if (syncToggle) {
                syncToggle.checked = false;
                syncToggle.dispatchEvent(new Event('change'));
            }
            UI.log('🗑️ Đã xóa dữ liệu Shark Local (Sync OFF)', 'warn');
        },

        reset() {
            this.bettingMap = {};
            UI.updateSharkTable();
        },
        process(payload) {
            if (!Array.isArray(payload)) {
                return;
            }
            payload.forEach(group => {
                const pick = group.pick?.toLowerCase();
                if (pick) {
                    this.bettingMap[pick] = group;
                }
            });
            this.analyzeForUI();
        },
        analyzeForUI() {
            Object.values(this.bettingMap).forEach(group => {
                (group.userAndPickTotal?.users || []).forEach(u => {
                    const sid = u.user?.steamId;
                    if (!sid) {
                        return;
                    }
                    if (!this.data[sid]) {
                        this.data[sid] = {
                            steamId: sid,
                            name: u.user?.nickname,
                            head: u.user?.head,
                            wins: 0,
                            losses: 0,
                            profit: 0
                        };
                    } else {
                        if (u.user?.head) {
                            this.data[sid].head = u.user.head;
                        }
                        if (u.user?.nickname) {
                            this.data[sid].name = u.user.nickname;
                        }
                    }
                });
            });
            UI.updateSharkTable();
        },
        finalizeRound(winpicksub) {

            const today = TimeSync.getDateKey();
            const lastDate = GM_getValue('last_working_date', '');
            if (lastDate !== today) {
                this.data = {}; // Xóa sạch dữ liệu cũ
                this.bettingMap = {}; // Xóa map cược cũ
                this.save();
                GM_setValue('last_working_date', today);
                UI.log('📅 Sang ngày mới: Đã Reset Shark Data', 'warn');
            } else if (!lastDate) {
                // Nếu chưa có ngày nào (chạy lần đầu) -> Lưu ngày nay lại để mai so sánh
                 GM_setValue('last_working_date', today);
            }

            const resultSide = Utils.mapResult(winpicksub);
            const isJackpot = ['c', 'd'].includes(resultSide);

            const updates = {};
            const roundResults = {};
            let totalRoundUserProfit = 0;

            Object.values(this.bettingMap).forEach(group => {
                const pick = Utils.mapResult(group.pick);
                (group.userAndPickTotal?.users || []).forEach(u => {
                    const sid = u.user?.steamId;
                    const betAmt = parseFloat(u.val) || 0;
                    if (!sid) {
                        return;
                    }

                    if (!roundResults[sid]) {
                        roundResults[sid] = 0;
                    }

                    let profit = -betAmt;
                    if (pick === 'c' || pick === 'd') {
                        const jpProfit = pick === 'c' ? 6 : 13;
                        if (isJackpot && resultSide === pick) {
                            profit = betAmt * jpProfit;
                        }
                    } else if (pick === 'a' || pick === 'b') {
                        if (pick === resultSide) {
                            profit = betAmt;
                        }
                    }
                    roundResults[sid] += profit;
                    totalRoundUserProfit += profit;
                });
            });

            State.updateHouse(totalRoundUserProfit);

            Object.entries(roundResults).forEach(([sid, netProfit]) => {
                if (!this.data[sid]) {
                    return;
                }

                if (netProfit > 0) {
                    this.data[sid].wins++;
                } else if (netProfit < 0) {
                    this.data[sid].losses++;
                }

                // Cập nhật Profit và làm tròn 2 chữ số thập phân để tránh lỗi floating point
                this.data[sid].profit = Math.round((this.data[sid].profit + netProfit) * 100) / 100;

                updates[`${sid}/wins`] = this.data[sid].wins;
                updates[`${sid}/losses`] = this.data[sid].losses;
                updates[`${sid}/profit`] = this.data[sid].profit;

                if (this.data[sid].name) {
                    updates[`${sid}/name`] = this.data[sid].name;
                }
                if (this.data[sid].head) {
                    updates[`${sid}/head`] = Utils.compressHead(this.data[sid].head);
                }
            });

            this.bettingMap = {};
            this.save();
            UI.updateSharkTable();
            if (Object.keys(updates).length > 0) {
                Cloud.push(updates);
            }
        },
        findTarget(term) {
            if (!term) {
                return [];
            }
            term = term.toLowerCase();
            const targets = [];
            Object.values(this.bettingMap).forEach(group => {
                const found = (group.userAndPickTotal?.users || []).find(u => u.user?.steamId === term || (u.user?.nickname || '').toLowerCase().includes(term));
                if (found) {
                    targets.push({
                        side: group.pick?.toLowerCase(),
                        amount: parseFloat(found.val) || 0,
                        name: found.user?.nickname
                    });
                }
            });
            return targets;
        }
    };

    const Bot = {
        onData(data) {
            if (data.type === 1) {
                State.roundId = data.datas.id;
                State.placedSides = [];
                SharkTracker.reset();

                if (State.running) {
                    // Ưu tiên 1: Check JP Streak (Xảy ra ở mọi chế độ nếu có config)
                    this.checkJPStreak();

                    // Ưu tiên 2: Chạy chế độ chính
                    if (State.activeMode === 'autocd' && State.placedSides.length === 0) {
                        WorkerTimer.wait(2000).then(() => this.strategyAutoCD());
                    } else if (State.activeMode === 'normal') {
                        // Delay 1 chút để lấy info sum mới nhất
                        WorkerTimer.wait(2000).then(() => this.strategyNormal());
                    }
                }
            }
            if (data.type === 12) {
                SharkTracker.process(data.datas);
                if (State.running && State.activeMode === 'shark') {
                    this.strategyShark();
                }
            }
            if (data.type === 3) {
                const winpicksub = data.datas.winpicksub;
                SharkTracker.finalizeRound(winpicksub);
                State.updateResult(winpicksub);
                if (State.running) {
                    this.checkStop();
                }
            }
        },
        async executeBet(side, amount, silent = false) {
            if (State.placedSides.includes(side)) {
                return false;
            }
            State.placedSides.push(side);
            if (State.demoMode) {
                if (!silent) {
                    UI.log(`🧪 DEMO: ${Utils.getLabel(side)} $${amount}`, 'api');
                }
                State.currentBets.push({
                    side,
                    amount
                });
                return true;
            }
            const inv = await VNE.getInventory();
            let target = amount;
            let current = 0;
            const selected = [];

            // FIX: Sai số động (Dynamic Tolerance)
            // Nếu cược < 1$ -> Sai số tối đa 0.05$ (để không bị nhặt nhầm item to)
            // Nếu cược >= 1$ -> Sai số 0.8$ (để dễ ghép item)
            const tolerance = target < 1 ? 0.05 : 0.8;

            for (const item of inv) {
                if (current >= target) break;

                let nextVal = Math.round((current + item.price) * 100) / 100;

                // Kiểm tra điều kiện với sai số động
                if (nextVal <= target + tolerance) {
                    selected.push(item);
                    current = nextVal;
                }
            }

            // Chấp nhận thiếu một chút (90% target) nhưng không được vượt quá tolerance quá nhiều
            if (current < target * 0.9) {
                UI.log(`❌ Không đủ item cho $${amount} (Có: $${current})`, 'error');
                this.unlockSide(side);
                return false;
            }
            const res = await VNE.sendBet(State.roundId, selected.map(i => i.id), side);
            if (res.success) {
                if (!silent) {
                    UI.log(`✅ BET ${Utils.getLabel(side)} $${current.toFixed(2)}`, 'bet');
                }
                State.currentBets.push({
                    side,
                    amount: current
                });
                return true;
            } else {
                UI.log(`❌ Lỗi API: ${res.msg}`, 'error');
                this.unlockSide(side);
                return false;
            }
        },
        unlockSide(side) {
            State.placedSides = State.placedSides.filter(s => s !== side);
        },
        async strategyAutoCD() {
            if (State.placedSides.length > 0) {
                return;
            }
            await this.executeBet('c', parseFloat(UI.get('autocd_c')) || 1);
            await WorkerTimer.wait(CONFIG.TIMING.DELAY_BET);
            await this.executeBet('d', parseFloat(UI.get('autocd_d')) || 0.5);
        },
        async strategyShark() {
            const targets = SharkTracker.findTarget(UI.get('shark_target'));
            if (targets && targets.length > 0) {
                const mode = UI.get('shark_mode');
                const maxBetLimit = parseFloat(UI.get('shark_max')) || 0;
                for (const target of targets) {
                    if (!State.placedSides.includes(target.side)) {
                        let betAmount = 0;
                        if (mode === 'fixed') {
                            betAmount = parseFloat(UI.get('shark_amount')) || 0;
                        } else {
                            const ratio = parseFloat(UI.get('shark_ratio')) || 1;
                            betAmount = Math.round((target.amount * ratio) * 100) / 100;
                        }
                        if (maxBetLimit > 0 && betAmount > maxBetLimit) {
                            betAmount = maxBetLimit;
                        }
                        if (betAmount < 0.01) continue;
                        const success = await this.executeBet(target.side, betAmount, true);
                        if (success) {
                            UI.log(`${State.demoMode ? '🧪 DEMO' : '🦈'} Copy ${target.name} BET ${Utils.getLabel(target.side)} $${betAmount.toFixed(2)}`, 'warn');
                        }
                        await WorkerTimer.wait(CONFIG.TIMING.DELAY_BET);
                    }
                }
            }
        },
        // --- LOGIC BET JP (X14) KHI CÓ CHUỖI 2 ---
        async checkJPStreak() {
            const jpBet = parseFloat(UI.get('setting_jp_streak'));
            if (!jpBet || jpBet <= 0) return;

            // Lấy lịch sử từ Engine
            const h = this.getHistory();
            // Engine thường lưu: [Cũ nhất, ..., Mới nhất]
            if (h.length >= 2) {
                const last1 = h[h.length - 1]; // Ván vừa xong
                const last2 = h[h.length - 2]; // Ván trước đó

                if (last1 === 'd' && last2 === 'd') {
                    UI.log(`🔥 Phát hiện chuỗi 2 JP! Bet X14 $${jpBet}`, 'jackpot');
                    await this.executeBet('d', jpBet);
                }
            }
        },

        // --- LOGIC BET THƯỜNG (A/B) ---
        async strategyNormal() {
            const method = UI.get('normal_method');
            if (method === 'A') {
                await this.strategyMethodA();
            } else {
                await this.strategyMethodB();
            }
        },

        async strategyMethodA() {
            // Lấy thông tin Sum từ VNEngine
            let sumA = 0, sumB = 0;
            try {
                // [0] là A, [1] là B
                if (win.VNEngine && win.VNEngine.define && win.VNEngine.define.inst && win.VNEngine.define.inst.lastSummer) {
                    sumA = win.VNEngine.define.inst.lastSummer[0]?.sum || 0;
                    sumB = win.VNEngine.define.inst.lastSummer[1]?.sum || 0;
                }
            } catch (e) {
                console.error("Cannot read sum", e);
                return;
            }

            const diff = Math.abs(sumA - sumB);
            const startDiff = parseFloat(UI.get('normal_diff_start')) || 10;
            const stopDiff = parseFloat(UI.get('normal_diff_stop')) || 5;
            const betAmount = State.normal.nextAmount || parseFloat(UI.get('normal_base')) || 1;

            // Logic State Machine
            if (!State.normal.chasing) {
                // Điều kiện bắt đầu: Chênh lệch >= X
                if (diff >= startDiff) {
                    State.normal.chasing = true;
                    // Nếu A > B (10đ) -> Đặt B (cửa thấp hơn)
                    State.normal.targetSide = sumA > sumB ? 'b' : 'a';
                    UI.log(`⚡ Diff ${diff} >= ${startDiff}. Start chasing ${Utils.getLabel(State.normal.targetSide)}`, 'info');
                    await this.executeBet(State.normal.targetSide, betAmount);
                }
            } else {
                // Đang trong chuỗi đuổi
                // Điều kiện dừng: Chênh lệch <= Y
                if (diff <= stopDiff) {
                    State.normal.chasing = false;
                    State.normal.targetSide = null;
                    State.normal.nextAmount = parseFloat(UI.get('normal_base')); // Reset tiền
                    UI.log(`🛑 Diff ${diff} <= ${stopDiff}. Stop chasing.`, 'info');
                } else {
                    // Tiếp tục đuổi (sử dụng tiền Martingale đã tính ở updateResult)
                    await this.executeBet(State.normal.targetSide, betAmount);
                }
            }
        },
        async strategyMethodB() {
            // 1. CHẾ ĐỘ ĐUỔI (CHASING): Ưu tiên cao nhất
            // Nếu cờ chasing đang bật (do updateResult set), cứ thế mà đặt
            if (State.normal.chasing && State.normal.targetSide) {
                const amount = State.normal.nextAmount || parseFloat(UI.get('normal_base')) || 1;
                await this.executeBet(State.normal.targetSide, amount);
                return;
            }

            // 2. CHẾ ĐỘ QUÉT (SCAN): Chỉ chạy khi đang rảnh (chasing = false)
            const h = this.getHistory(); // Lấy lịch sử 10 ván cuối
            if (h.length < 4) return;

            // Lấy 4 ván mới nhất
            const last4 = h.slice(-4); // [a, a, a, a]
            const side = last4[0];

            // Chỉ bắt cầu A hoặc B (bỏ qua nếu cầu D)
            if (side !== 'a' && side !== 'b') return;

            // Kiểm tra xem cả 4 ván có giống nhau không
            const isStreak4 = last4.every(s => s === side);

            if (isStreak4) {
                // KÍCH HOẠT CHẾ ĐỘ ĐUỔI
                State.normal.chasing = true;
                State.normal.targetSide = side === 'a' ? 'b' : 'a'; // Đánh ngược

                const betAmount = parseFloat(UI.get('normal_base')) || 1;
                State.normal.nextAmount = betAmount; // Reset tiền

                UI.log(`⚡ Phát hiện chuỗi 4 ${Utils.getLabel(side)}. Bắt đầu bẻ -> ${Utils.getLabel(State.normal.targetSide)}`, 'info');
                await this.executeBet(State.normal.targetSide, betAmount);
            }
        },
        getHistory() {
            try {
                if (win.VNEngine && win.VNEngine.define && win.VNEngine.define.inst) {
                    const list = win.VNEngine.define.inst.last10WinNum;
                    if (Array.isArray(list)) {
                        return list.map(item => {
                            // Lấy giá trị raw từ game
                            let val = (typeof item === 'object' && item.winpicksub) ? item.winpicksub : item;
                            val = String(val).toLowerCase().trim();
                            // --- LOGIC MAPPING RIÊNG CHO LỊCH SỬ ---
                            if (val === 'c1') return 'a';   // Nếu là c1 coi như A
                            if (val === 'c14') return 'b';  // Nếu là c14 coi như B
                            return val;
                        });
                    }
                }
            } catch (e) {
                console.error("Error reading history", e);
            }
            return [];
        },
        checkStop() {
            const m = State.activeMode;
            const sw = parseFloat(UI.get(`${m}_stop_win`));
            const sl = parseFloat(UI.get(`${m}_stop_loss`));
            if (sw && State.profit >= sw) {
                this.stop('Stop Win');
            }
            if (sl && State.profit <= -sl) {
                this.stop('Stop Loss');
            }
        },
        start(mode) {
            State.running = true;
            State.activeMode = mode;
            State.demoMode = UI.get('demo');

            let label = 'SHARK COPY';
            if (mode === 'autocd') label = 'X7+X14';
            else if (mode === 'normal') label = 'BET';

            UI.log(`🚀 START ${label} (${State.demoMode ? 'DEMO' : 'LIVE'})`, 'success');
            UI.updateStartBtn(true, mode);
        },
        stop(reason) {
            State.running = false;
            UI.log(`⏹ STOP: ${reason}`, 'warn');
            Telegram.send(`⏹️ BOT STOPPED: ${reason}`);
            UI.updateStartBtn(false);
        }
    };

    // ╔══════════════════════════════════════════════════════════════════════════════╗
    // ║                              UI SYSTEM                                       ║
    // ╚══════════════════════════════════════════════════════════════════════════════╝
    const UI = {
        init() {
            this.injectCSS();
            this.createPanel();
            this.bindEvents();
            this.loadSettings();
            this.toggleSharkInputs();
            State.init();
            SharkTracker.init();
            this.updateStats();
        },
        injectCSS() {
            GM_addStyle(`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                :root { --bg: #0f0f14; --card: #16161e; --border: #2a2a3a; --text: #e4e4e7; --primary: #8b5cf6; --success: #10b981; --danger: #ef4444; }
                #rlt-panel { position: fixed; top: 20px; right: 90px; width: 350px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; font-family: 'Inter', sans-serif; color: var(--text); z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); font-size: 13px; display: flex; flex-direction: column; }
                #rlt-panel.minimized .rlt-body { display: none; }
                .rlt-header { padding: 6px 12px; background: linear-gradient(135deg, var(--primary), #6d28d9); display: flex; justify-content: space-between; border-radius: 12px 12px 0 0; cursor: move; font-weight: 700; user-select: none; flex-shrink: 0; }
                .rlt-body { padding: 0; max-height: 85vh; overflow-y: auto; display: flex; flex-direction: column; }
                .rlt-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; position: sticky; top: 0; z-index: 500; background: var(--bg); padding: 12px 12px 5px 12px; border-bottom: none; margin-bottom: 5px; flex-shrink: 0; cursor: context-menu; }
                .rlt-stat-box { background: var(--card); border: 1px solid var(--border); padding: 6px; text-align: center; border-radius: 6px; }
                .rlt-stat-box.house-box { background: #3f3f3f; border-color: #616161; }
                .rlt-stat-val { font-weight: 700; font-size: 13px; }
                .pos { color: var(--success); } .neg { color: var(--danger); }
                .rlt-tabs { display: flex; gap: 4px; background: var(--card); padding: 4px; border-radius: 8px; flex-shrink: 0; margin: 0 12px 10px 12px; font-size: 12px; }
                .rlt-tab { flex: 1; padding: 10px 4px; border: none; background: transparent; color: #888; cursor: pointer; border-radius: 6px; font-weight: 600; }
                .rlt-tab.active { background: var(--primary); color: #fff; }
                .tab-content { padding: 0 12px 12px 12px; display: flex; flex-direction: column; gap: 10px; }
                .rlt-row-group { display: flex; gap: 10px; align-items: flex-start; }
                .rlt-col { flex: 1; display: flex; flex-direction: column; gap: 6px; }
                .rlt-label { font-size: 11px; color: #9ca3af; font-weight: 500; }
                .rlt-input { width: 100%; padding: 8px; background: #222; border: 1px solid var(--border); color: #fff; border-radius: 6px; box-sizing: border-box; }
                .rlt-btn { width: 100%; padding: 10px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; margin-top: 15px; flex-shrink: 0; margin-left: 12px; margin-right: 12px; margin-bottom: 12px; width: auto; }
                .btn-start { background: var(--success); color: #fff; }
                .btn-stop { background: var(--danger); color: #fff; }
                .hidden { display: none !important; }
                #rlt-log { height: 150px; overflow-y: auto; background: #111; border: 1px solid var(--border); padding: 6px; font-family: monospace; font-size: 11px; border-radius: 6px; flex-shrink: 0; margin: 0 12px 12px 12px; }
                .log-line { margin-bottom: 4px; padding: 4px 6px; border-radius: 4px; display: flex; gap: 6px; align-items: center; }
                .log-line.success { background: rgba(16,185,129,0.15); color: #10b981; }
                .log-line.error { background: rgba(239,68,68,0.15); color: #ef4444; }
                .log-line.warn { background: rgba(245,158,11,0.15); color: #fbbf24; }
                .log-line.info { background: rgba(59,130,246,0.15); color: #60a5fa; }
                .log-line.api { background: rgba(139,92,246,0.15); color: #a78bfa; }
                .log-line.jackpot { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; }
                .log-line.bet { background: rgba(34, 211, 238, 0.15); color: #22d3ee; }
                .shark-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 11px; margin-top: 0px; table-layout: fixed; }
                .shark-table th { text-align: left; color: #888; padding: 6px 4px; border-bottom: 1px solid var(--border); cursor: pointer; user-select: none; position: sticky; top: 0; background: #1e1e28; z-index: 50; height: 30px; vertical-align: middle; }
                .shark-table th:hover { color: #fff; }
                .shark-table td { padding: 4px; border-bottom: 1px solid #222; }
                .shark-avatar { width: 16px; height: 16px; border-radius: 50%; vertical-align: middle; margin-right: 6px; }
                .shark-name-wrap { display: flex; align-items: center; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
                .status-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; background: #555; transition: 0.3s; border: 1px solid rgba(255,255,255,0.2); }
                .status-dot.on { background: #10b981; box-shadow: 0 0 8px #10b981; }
                .status-dot.off { background: #ef4444; }
                .status-dot.working { background: #fbbf24; box-shadow: 0 0 8px #fbbf24; animation: pulse 1s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

                .custom-select-container { position: relative; background: #222; border: 1px solid #333; border-radius: 6px; padding: 8px; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 600; }
                .custom-select-container:hover { background: #2a2a2a; border-color: #444; }
                .custom-dropdown { position: absolute; top: 100%; left: 0; width: 100%; background: #1a1a1a; border: 1px solid #333; border-radius: 6px; margin-top: 4px; max-height: 150px; overflow-y: auto; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: none; }
                .dropdown-item { padding: 4px 8px; border-bottom: 1px solid #222; display: flex; align-items: center; font-size: 11px; color: #ccc; height: 24px; }
                .dropdown-item:hover { background: #2a2a2a; color: #fff; }
                .dropdown-item input { margin: 0 8px 0 0; pointer-events: none; }
                .dropdown-item label { margin: 0; cursor: pointer; width: 100%; line-height: 1.2; user-select: none; }

                .setting-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .setting-title { font-size: 11px; font-weight: 600; color: #e4e4e7; }
                .action-btn { background: #27272a; color: #d4d4d8; border: 1px solid #3f3f46; font-size: 11px; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: 0.2s; text-align: center; }
                .action-btn:hover { background: #3f3f46; color: #fff; }
                .action-btn.danger { background: rgba(220, 38, 38, 0.1); color: #ef4444; border-color: rgba(220, 38, 38, 0.3); }
                .action-btn.danger:hover { background: rgba(220, 38, 38, 0.2); }
                .action-btn.btn-start { background: var(--success); color: #fff; border:none; font-weight:700; }
                .toggle-switch { position: relative; display: inline-block; width: 34px; height: 18px; flex-shrink: 0; }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3f3f46; transition: .4s; border-radius: 34px; }
                .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider { background-color: #8b5cf6; }
                input:checked + .slider:before { transform: translateX(16px); }
                .rlt-section { background: var(--card); border: 1px solid var(--border); border-radius: 6px; margin-top: 10px; overflow: hidden; flex-shrink: 0; }
                .rlt-sec-head { padding: 8px 12px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); user-select: none; }
                .rlt-sec-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
                .collapsed .rlt-sec-body { display: none !important; }
                .shark-table th { position: sticky; top: 0; overflow: hidden; z-index: 50; }
                #inp-search-name, #inp-stats-search { position: absolute; top: 2px; left: 2px; right: 2px; bottom: 2px; width: calc(100% - 4px); height: calc(100% - 4px); border: 1px solid #8b5cf6; border-radius: 4px; background: #000; color: #fff; font-size: 10px; padding: 0 4px; box-sizing: border-box; outline: none; z-index: 60; }

                /* Context Menu */
                .ctx-menu { position: fixed; background: #222; border: 1px solid #444; padding: 4px 0; cursor: pointer; z-index: 100000; color: #d4d4d8; border-radius: 6px; font-size: 12px; display: none; box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-weight: 600; min-width: 120px; }
                .ctx-item { padding: 8px 12px; transition: 0.2s; display: flex; align-items: center; }
                .ctx-item:hover { background: #3f3f46; color: #fff; }
                .ctx-icon { width: 20px; text-align: center; display: inline-block; flex-shrink: 0; }

                /* Helpers */
                .flex-center { display: flex; align-items: center; }
                .flex-gap-10 { display: flex; gap: 10px; }
                .flex-col-gap-10 { display: flex; flex-direction: column; gap: 10px; }
                .flex-col { display: flex; flex-direction: column; }
                .rlt-btn-group { display: flex; gap: 10px; margin-bottom: 6px; }
                .margin-top-2 { margin-top: 2px; }
                .text-center { text-align: center; }
                .pad-10 { padding: 10px; }
                .w-full { width: 100%; }
                .cursor-pointer { cursor: pointer; }
                .font-bold { font-weight: bold; }
                .purple-text { color: #8b5cf6; }
                .sub-text { font-size: 11px; color: #aaa; margin-left: 4px; }
                .stats-summary { padding: 8px 12px; background: #222; border-radius: 6px; border: 1px solid #333; font-size: 12px; font-weight: 600; display: flex; justify-content: space-between; }
            `);
        },

        createPanel() {
            const html = `
                <div id="rlt-panel">
                    <div class="rlt-header" id="rlt-drag">
                        <div class="flex-center">
                            <span id="sync-dot" class="status-dot off" title="Cloud Status (Xanh=ON, Đỏ=OFF, Vàng=Syncing)"></span>
                            <span>Ultimate v${VERSION}</span>
                        </div>
                        <div class="flex-gap-10">
                            <span id="btn-minimize" class="cursor-pointer" style="font-size:16px;">−</span>
                        </div>
                    </div>
                    <div class="rlt-body">
                        <div class="rlt-stats" id="rlt-header-stats">
                            <div class="rlt-stat-box house-box" title="Lợi nhuận của Nhà cái">
                                <div class="rlt-stat-val" id="st-house">$0.00</div>
                                <div style="font-size:10px;color:#aaa" id="st-house-rounds">0 trận</div>
                            </div>
                            <div class="rlt-stat-box" title="Lợi nhuận của bạn"><div class="rlt-stat-val" id="st-profit">$0.00</div><div style="font-size:10px;color:#888">Profit</div></div>
                            <div class="rlt-stat-box" title="Số ván thắng"><div class="rlt-stat-val" id="st-win">0</div><div style="font-size:10px;color:#888">Wins</div></div>
                            <div class="rlt-stat-box" title="Số ván thua"><div class="rlt-stat-val" id="st-loss">0</div><div style="font-size:10px;color:#888">Losses</div></div>
                        </div>

                        <div class="rlt-tabs">
                            <button class="rlt-tab active" data-tab="normal">X2</button>
                            <button class="rlt-tab" data-tab="autocd">X7+X14</button>
                            <button class="rlt-tab" data-tab="shark">Shark</button>
                            <button class="rlt-tab" data-tab="stats">Thống kê</button>
                        </div>

                        <div id="tab-normal" class="tab-content">
                            <div class="rlt-row-group">
                                <div class="rlt-col">
                                    <span class="rlt-label">Phương thức Bet</span>
                                    <select class="rlt-input" id="inp-normal_method">
                                        <option value="A" title="So sánh tổng điểm A và B. Nếu lệch >= X thì đánh cửa ít hơn. Dừng khi lệch <= Y.">Phương thức A (Chênh lệch)</option>
                                        <option value="B" title="Phát hiện chuỗi 4 (VD: AAAA) thì đánh ngược lại (B).">Phương thức B (Bẻ cầu 4)</option>
                                    </select>
                                </div>
                                <div class="rlt-col">
                                    <span class="rlt-label">Tiền cược gốc ($)</span>
                                    <input class="rlt-input" id="inp-normal_base" type="number" step="0.01" value="1">
                                </div>
                            </div>

                            <div id="grp-normal-a" class="rlt-row-group">
                                <div class="rlt-col">
                                    <span class="rlt-label">Bắt đầu khi A-B >=</span>
                                    <input class="rlt-input" id="inp-normal_diff_start" type="number" value="10" title="Chênh lệch điểm bắt đầu vào tiền">
                                </div>
                                <div class="rlt-col">
                                    <span class="rlt-label">Dừng khi A-B <=</span>
                                    <input class="rlt-input" id="inp-normal_diff_stop" type="number" value="5" title="Chênh lệch điểm để dừng chuỗi bet">
                                </div>
                            </div>

                            <div class="rlt-row-group">
                                <div class="rlt-col"><span class="rlt-label">Stop Win ($)</span><input class="rlt-input" id="inp-normal_stop_win" type="number" placeholder="---"></div>
                                <div class="rlt-col"><span class="rlt-label">Stop Loss ($)</span><input class="rlt-input" id="inp-normal_stop_loss" type="number" placeholder="---"></div>
                            </div>
                            <div style="font-size:10px; color:#888; text-align:center; margin-top:5px">⚠️ Tự động gấp thếp (Martingale) khi thua</div>
                        </div>

                        <div id="tab-autocd" class="tab-content hidden">
                            <div class="rlt-row-group">
                                <div class="rlt-col"><span class="rlt-label">Bet X7 ($)</span><input class="rlt-input" id="inp-autocd_c" type="number" step="0.01" value="1" title="Số tiền cược cho ô C (X7)"></div>
                                <div class="rlt-col"><span class="rlt-label">Bet X14 ($)</span><input class="rlt-input" id="inp-autocd_d" type="number" step="0.01" value="0.5" title="Số tiền cược cho ô D (X14)"></div>
                            </div>
                            <div class="rlt-row-group">
                                <div class="rlt-col"><span class="rlt-label">Stop Win ($)</span><input class="rlt-input" id="inp-autocd_stop_win" type="number" placeholder="---"></div>
                                <div class="rlt-col"><span class="rlt-label">Stop Loss ($)</span><input class="rlt-input" id="inp-autocd_stop_loss" type="number" placeholder="---"></div>
                            </div>
                        </div>

                        <div id="tab-shark" class="tab-content hidden">
                            <div class="rlt-row-group">
                                <div class="rlt-col">
                                    <span class="rlt-label">Target (SteamID)</span>
                                    <input class="rlt-input" id="inp-shark_target" type="text" placeholder="ID..." title="Nhập SteamID người muốn copy">
                                </div>
                                <div class="rlt-col">
                                    <span class="rlt-label">Chế độ cược</span>
                                    <select class="rlt-input" id="inp-shark_mode" title="Chọn kiểu vào tiền">
                                        <option value="fixed">Cố định ($)</option>
                                        <option value="ratio">Tỉ lệ (x)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="rlt-row-group">
                                <div class="rlt-col">
                                    <div id="grp-fixed">
                                        <span class="rlt-label">Số tiền ($)</span>
                                        <input class="rlt-input" id="inp-shark_amount" type="number" step="0.01" value="1" title="Cược cố định mỗi ván">
                                    </div>
                                    <div id="grp-ratio" class="hidden">
                                        <span class="rlt-label">Tỉ lệ (1 = 100%)</span>
                                        <input class="rlt-input" id="inp-shark_ratio" type="number" value="1" step="0.1" placeholder="0.1" title="Nhân bản số tiền của Shark theo tỉ lệ">
                                    </div>
                                </div>
                                <div class="rlt-col">
                                    <span class="rlt-label">Max Limit ($)</span>
                                    <input class="rlt-input" id="inp-shark_max" type="number" value="0" placeholder="0 = No Limit" title="Giới hạn cược tối đa để bảo toàn vốn">
                                </div>
                            </div>
                            <div class="rlt-row-group" style="margin-top:0px">
                                <div class="rlt-col"><span class="rlt-label">Stop Win ($)</span><input class="rlt-input" id="inp-shark_stop_win" type="number" placeholder="---" title="Dừng copy khi thắng đủ"></div>
                                <div class="rlt-col"><span class="rlt-label">Stop Loss ($)</span><input class="rlt-input" id="inp-shark_stop_loss" type="number" placeholder="---" title="Dừng copy khi thua quá"></div>
                            </div>

                            <div style="height:150px; overflow-y:auto; background:var(--card); border:1px solid var(--border); border-radius:6px; flex-shrink:0;">
                                <table class="shark-table">
                                    <thead>
                                        <tr>
                                            <th width="45%" id="th-name" style="cursor:pointer">
                                                <span id="lbl-name">Name 🔍</span>
                                                <input id="inp-search-name" type="text" style="display:none" placeholder="Tìm tên hoặc SteamID..." title="Nhập tên để lọc danh sách">
                                            </th>
                                            <th width="25%" data-sort="profit" title="Click sort by P/L">P/L ↕</th>
                                            <th width="30%" data-sort="winrate" title="Click sort by Win%">Win% ↕</th>
                                        </tr>
                                    </thead>
                                    <tbody id="shark-list"><tr><td colspan="3" class="text-center pad-10">Waiting data...</td></tr></tbody>
                                </table>
                            </div>
                        </div>

                        <div id="tab-stats" class="tab-content hidden flex-col-gap-10">
                            <div class="custom-select-container" id="btn-toggle-dates" title="Bấm để chọn ngày cần xem">
                                <span id="stats-dropdown-label">Chọn ngày báo cáo...</span>
                                <span id="stats-dropdown-icon">▼</span>
                                <div class="custom-dropdown" id="stats-dropdown-list"></div>
                            </div>
                            <button id="btn-stats-calc" class="action-btn btn-start" style="margin:0" title="Bấm để tải và cộng dồn dữ liệu">📊 TỔNG HỢP DỮ LIỆU</button>
                            <div class="stats-summary"><span>Doanh thu Nhà cái:</span><span id="st-stats-house" class="">---</span></div>
                            <div style="height:250px; overflow-y:auto; background:var(--card); border:1px solid var(--border); border-radius:6px; flex-shrink:0;"><table class="shark-table"><thead><tr><th width="42%" id="th-stats-name" style="cursor:pointer"><span id="lbl-stats-name">Name 🔍</span><input id="inp-stats-search" type="text" style="display:none" placeholder="Tìm tên hoặc SteamID..." title="Nhập tên để lọc kết quả"></th><th width="25%" data-sort="profit" title="Click sort by P/L">P/L ↕</th><th width="33%" data-sort="winrate" title="Click sort by Win%">Win% ↕</th></tr></thead><tbody id="stats-list"><tr><td colspan="3" class="text-center pad-10">Chọn ngày -> Tổng hợp</td></tr></tbody></table></div>
                        </div>

                        <div class="rlt-section collapsed" id="sec-settings">
                            <div class="rlt-sec-head" title="Bấm để mở/đóng cài đặt"><span>⚙️ Cài đặt</span><span>▼</span></div>
                            <div class="rlt-sec-body">
                                <div class="rlt-btn-group"><button id="btn-cloud-reset" class="action-btn danger" style="flex:1" title="CẢNH BÁO: Xóa sạch dữ liệu trên Cloud">🔥 Xóa Data Cloud</button></div>

                                <div style="display:flex; align-items:center; justify-content:space-between;" title="Tự động cược X14 khi thấy 2 ván X14 liên tiếp">
                                    <span class="rlt-label">Bet chuỗi 2 JP (X14) ($)</span>
                                    <input class="rlt-input" id="inp-setting_jp_streak" type="number" step="0.01" placeholder="Off" style="width:60px; text-align:center; padding:4px;">
                                </div>

                                <div class="setting-row" title="Tự động tải và gửi dữ liệu lên Cloud sau mỗi ván"><div class="setting-title">🔄 Auto Sync Cloud</div><label class="toggle-switch"><input type="checkbox" id="inp-cloud_sync" checked><span class="slider"></span></label></div>
                                <div class="setting-row" title="Chế độ chơi thử (Không mất tiền thật)"><div class="setting-title">🧪 Demo Mode</div><label class="toggle-switch"><input type="checkbox" id="inp-demo"><span class="slider"></span></label></div>
                                <div class="setting-row" title="Gửi thông báo kết quả về Telegram"><div class="setting-title">📱 Telegram</div><label class="toggle-switch"><input type="checkbox" id="inp-tg_enabled"><span class="slider"></span></label></div>
                                <input class="rlt-input margin-top-2" style="font-size:11px" id="inp-tg_player" type="text" placeholder="Player Name" title="Tên người chơi hiển thị trên tin nhắn Telegram">
                            </div>
                        </div>

                        <button id="btn-start" class="rlt-btn btn-start" title="Bắt đầu chạy">▶ START BET</button>
                        <div id="rlt-log"></div>
                    </div>
                </div>

                <div id="rlt-log-menu" class="ctx-menu"><div class="ctx-item" id="ctx-log-clear"><span class="ctx-icon">🗑️</span> Xóa Log</div></div>
                <div id="rlt-header-menu" class="ctx-menu"><div class="ctx-item" id="ctx-reset-pl"><span class="ctx-icon">↺</span> Reset P/L</div><div class="ctx-item" id="ctx-reset-house"><span class="ctx-icon">🏠</span> Reset Nhà Cái</div></div>
                <div id="rlt-shark-menu" class="ctx-menu"><div class="ctx-item" id="ctx-sync"><span class="ctx-icon">☁️</span> Đồng bộ</div><div class="ctx-item" id="ctx-shark-clear" style="color:#ef4444"><span class="ctx-icon">🗑️</span> Xóa Shark Data</div></div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        },

        bindEvents() {
            const p = document.getElementById('rlt-panel'), h = document.getElementById('rlt-drag');
            let isDrag = false, offX, offY;
            h.onmousedown = e => {
                if (e.target.tagName !== 'SPAN') {
                    e.preventDefault();
                }
                isDrag = true;
                offX = e.clientX - p.offsetLeft;
                offY = e.clientY - p.offsetTop;
            };
            document.addEventListener('mousemove', e => {
                if (isDrag) {
                    let newX = e.clientX - offX;
                    let newY = e.clientY - offY;
                    const rect = p.getBoundingClientRect();
                    const winW = window.innerWidth;
                    const winH = window.innerHeight;
                    if (newX < 0) newX = 0;
                    if (newY < 0) newY = 0;
                    if (newX + rect.width > winW) newX = winW - rect.width;
                    if (newY + rect.height > winH) newY = winH - rect.height;
                    p.style.left = newX + 'px';
                    p.style.top = newY + 'px';
                }
            });
            document.addEventListener('mouseup', () => isDrag = false);
            document.getElementById('btn-minimize').onclick = () => {
                p.classList.toggle('minimized');
            };

            // HELPER: Show Context Menu
            const showCtx = (e, menuId) => {
                e.preventDefault();
                document.querySelectorAll('.ctx-menu').forEach(m => m.style.display = 'none'); // Hide others
                const menu = document.getElementById(menuId);
                menu.style.display = 'block';
                menu.style.left = e.clientX + 'px';
                menu.style.top = e.clientY + 'px';
            };

            // === 1. LOG CONTEXT MENU ===
            document.getElementById('rlt-log').oncontextmenu = (e) => showCtx(e, 'rlt-log-menu');
            document.getElementById('ctx-log-clear').onclick = () => {
                document.getElementById('rlt-log').innerHTML = '';
                document.getElementById('rlt-log-menu').style.display = 'none';
            };

            // === 2. HEADER CONTEXT MENU (RESET P/L & HOUSE) ===
            document.getElementById('rlt-header-stats').oncontextmenu = (e) => showCtx(e, 'rlt-header-menu');
            document.getElementById('ctx-reset-pl').onclick = () => {
                State.resetPL();
                document.getElementById('rlt-header-menu').style.display = 'none';
            };
            document.getElementById('ctx-reset-house').onclick = () => {
                State.resetHouse();
                document.getElementById('rlt-header-menu').style.display = 'none';
            };

            // === 3. SHARK LIST CONTEXT MENU (SYNC & CLEAR DATA) ===
            document.getElementById('shark-list').parentElement.oncontextmenu = (e) => showCtx(e, 'rlt-shark-menu');
            document.getElementById('ctx-sync').onclick = () => {
                Cloud.load(true);
                document.getElementById('rlt-shark-menu').style.display = 'none';
            };
            document.getElementById('ctx-shark-clear').onclick = () => {
                SharkTracker.resetSharkData();
                document.getElementById('rlt-shark-menu').style.display = 'none';
            };

            // GLOBAL CLICK (Close Menus)
            document.addEventListener('click', (e) => {
                document.querySelectorAll('.ctx-menu').forEach(m => {
                    if (!m.contains(e.target)) m.style.display = 'none';
                });

                // Close other UI elements
                if (inpName.style.display === 'block' && !thName.contains(e.target)) closeSearchInput();
                if (inpStats.style.display === 'block' && !thStats.contains(e.target)) closeStatsSearch();
                const dropdown = document.getElementById('stats-dropdown-list');
                const btn = document.getElementById('btn-toggle-dates');
                if (Stats.isListVisible && !dropdown.contains(e.target) && !btn.contains(e.target)) Stats.toggleList();
            });

            // === SHARK SEARCH ===
            const thName = document.getElementById('th-name');
            const inpName = document.getElementById('inp-search-name');
            const lblName = document.getElementById('lbl-name');
            const closeSearchInput = () => {
                const val = inpName.value.trim();
                inpName.style.display = 'none';
                lblName.style.display = 'inline';
                if (val === '') {
                    lblName.textContent = 'Name 🔍';
                    lblName.style.color = '';
                    if (SharkTracker.filter !== '') {
                        SharkTracker.filter = '';
                        UI.updateSharkTable();
                    }
                } else {
                    lblName.textContent = `🔍 ${val}`;
                    lblName.style.color = '#10b981';
                }
            };
            thName.onclick = (e) => {
                e.stopPropagation();
                if (inpName.style.display === 'none') {
                    lblName.style.display = 'none';
                    inpName.style.display = 'block';
                    inpName.focus();
                }
            };
            inpName.oninput = () => {
                SharkTracker.filter = inpName.value.trim().toLowerCase();
                UI.updateSharkTable();
            };
            inpName.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    if (e.key === 'Escape') {
                        inpName.value = '';
                    }
                    closeSearchInput();
                }
            };

            // === STATS SEARCH ===
            const thStats = document.getElementById('th-stats-name');
            const inpStats = document.getElementById('inp-stats-search');
            const lblStats = document.getElementById('lbl-stats-name');
            const closeStatsSearch = () => {
                const val = inpStats.value.trim();
                inpStats.style.display = 'none';
                lblStats.style.display = 'inline';
                if (val === '') {
                    lblStats.textContent = 'Name 🔍';
                    lblStats.style.color = '';
                    if (Stats.filter !== '') {
                        Stats.filter = '';
                        Stats.renderTable();
                    }
                } else {
                    lblStats.textContent = `🔍 ${val}`;
                    lblStats.style.color = '#10b981';
                }
            };
            thStats.onclick = (e) => {
                e.stopPropagation();
                if (inpStats.style.display === 'none') {
                    lblStats.style.display = 'none';
                    inpStats.style.display = 'block';
                    inpStats.focus();
                }
            };
            inpStats.oninput = () => {
                Stats.filter = inpStats.value.trim().toLowerCase();
                Stats.renderTable();
            };
            inpStats.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    if (e.key === 'Escape') {
                        inpStats.value = '';
                    }
                    closeStatsSearch();
                }
            };

            document.getElementById('stats-dropdown-list').onclick = (e) => e.stopPropagation();

            // SORTS
            document.querySelector('#shark-list').parentElement.querySelector('thead').onclick = (e) => {
                const th = e.target.closest('th');
                if (th && th.dataset.sort) {
                    SharkTracker.toggleSort(th.dataset.sort);
                }
            };
            document.querySelector('#stats-list').parentElement.querySelector('thead').onclick = (e) => {
                const th = e.target.closest('th');
                if (th && th.dataset.sort) {
                    Stats.toggleSort(th.dataset.sort);
                }
            };

            // Cloud & Stats
            document.getElementById('btn-cloud-reset').onclick = () => Cloud.resetCloud();
            document.getElementById('btn-toggle-dates').onclick = () => Stats.toggleList();
            document.getElementById('btn-stats-calc').onclick = () => Stats.calculate();

            // SETTINGS CLICK
            const settingsHeader = document.getElementById('sec-settings').querySelector('.rlt-sec-head');
            settingsHeader.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById('sec-settings').classList.toggle('collapsed');
            };

            document.getElementById('inp-shark_mode').onchange = (e) => {
                this.toggleSharkInputs();
                this.saveSettings();
            };
            // SYNC TOGGLE LISTENER
            document.getElementById('inp-cloud_sync').onchange = (e) => {
                const isChecked = e.target.checked;
                UI.saveSettings();
                if (isChecked) {
                    Cloud.load(true); // Pull from Cloud immediately
                }
            };

            document.getElementById('shark-list').onclick = (e) => {
                const tr = e.target.closest('tr');
                if (tr && tr.dataset.id) {
                    document.getElementById('inp-shark_target').value = tr.dataset.id;
                    GM_setValue('shark_target', tr.dataset.id);
                }
            };

            document.querySelectorAll('.rlt-tab').forEach(b => b.onclick = () => {
                document.querySelectorAll('.rlt-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
                b.classList.add('active');
                document.getElementById(`tab-${b.dataset.tab}`).classList.remove('hidden');

                const settings = document.getElementById('sec-settings');
                const btnStart = document.getElementById('btn-start');
                if (b.dataset.tab === 'stats') {
                    settings.style.display = 'none';
                    btnStart.style.display = 'none';
                } else {
                    settings.style.display = 'block';
                    btnStart.style.display = 'block';
                }
                this.updateStartBtn(State.running, b.dataset.tab);
            });

            document.getElementById('inp-normal_method').onchange = (e) => {
                const isA = e.target.value === 'A';
                const grpA = document.getElementById('grp-normal-a');
                if (isA) grpA.classList.remove('hidden');
                else grpA.classList.add('hidden');
                UI.saveSettings();
            };

            document.getElementById('btn-start').onclick = () => {
                if (State.running) {
                    Bot.stop('User Click');
                } else {
                    const tab = document.querySelector('.rlt-tab.active').dataset.tab;
                    this.saveSettings();
                    // Reset trạng thái Normal khi bắt đầu mới
                    if (tab === 'normal') {
                        State.normal.chasing = false;
                        State.normal.nextAmount = parseFloat(UI.get('normal_base')) || 1;
                    }
                    Bot.start(tab);
                }
            };

            document.querySelectorAll('input').forEach(i => i.onchange = () => this.saveSettings());
        },

        updateDateDisplay() {},
        updateSyncDot(status) {
            const dot = document.getElementById('sync-dot');
            if (dot) {
                dot.className = 'status-dot ' + status;
            }
        },
        toggleSharkInputs() {
            const mode = document.getElementById('inp-shark_mode').value;
            if (mode === 'fixed') {
                document.getElementById('grp-fixed').classList.remove('hidden');
                document.getElementById('grp-ratio').classList.add('hidden');
            } else {
                document.getElementById('grp-fixed').classList.add('hidden');
                document.getElementById('grp-ratio').classList.remove('hidden');
            }
        },
        get(id) {
            const el = document.getElementById('inp-' + id);
            return el.type === 'checkbox' ? el.checked : el.value;
        },
        set(id, val) {
            const el = document.getElementById('inp-' + id);
            if (!el) {
                return;
            }
            if (el.type === 'checkbox') {
                el.checked = val;
            } else {
                el.value = val;
            }
        },
        saveSettings() {
            ['normal_method', 'normal_base', 'normal_diff_start', 'normal_diff_stop', 'normal_stop_win', 'normal_stop_loss', 'setting_jp_streak', 'autocd_c', 'autocd_d', 'autocd_stop_win', 'autocd_stop_loss', 'shark_target', 'shark_amount', 'shark_ratio', 'shark_max', 'shark_mode', 'shark_stop_win', 'shark_stop_loss', 'demo', 'tg_enabled', 'tg_player', 'cloud_sync'].forEach(k => GM_setValue(k, this.get(k)));
            const isSyncOn = this.get('cloud_sync');
            if (Cloud && !Cloud.working) {
                this.updateSyncDot(isSyncOn ? 'on' : 'off');
            }
        },
        loadSettings() {
            // Danh sách đầy đủ các key cần lưu
            ['autocd_c', 'autocd_d', 'autocd_stop_win', 'autocd_stop_loss',
             'shark_target', 'shark_amount', 'shark_ratio', 'shark_max', 'shark_mode', 'shark_stop_win', 'shark_stop_loss',
             'normal_method', 'normal_base', 'normal_diff_start', 'normal_diff_stop', 'normal_stop_win', 'normal_stop_loss',
             'setting_jp_streak',
             'demo', 'tg_enabled', 'tg_player', 'cloud_sync'].forEach(k => {
                const v = GM_getValue(k);
                if (v !== undefined) {
                    this.set(k, v);
                }
            });

            // FIX: Cập nhật giao diện ẩn/hiện ngay sau khi load settings
            const method = this.get('normal_method');
            const grpA = document.getElementById('grp-normal-a');
            if (grpA) {
                if (method === 'A') grpA.classList.remove('hidden');
                else grpA.classList.add('hidden');
            }

            // Trigger cập nhật UI cho Shark Mode (Fixed/Ratio) luôn cho chắc
            this.toggleSharkInputs();
        },
        updateStartBtn(running, mode) {
            const btn = document.getElementById('btn-start');

            // FIX: Nếu đang chạy (running=true) -> Luôn lấy State.activeMode
            // Nếu đang dừng -> Lấy mode truyền vào (hoặc tab đang active)
            const targetMode = running ? State.activeMode : (mode || document.querySelector('.rlt-tab.active').dataset.tab);

            let label = 'BET'; // Mặc định cho Normal
            if (targetMode === 'autocd') label = 'X7+X14';
            else if (targetMode === 'shark') label = 'SHARK COPY';

            if (running) {
                btn.textContent = `⏹ STOP ${label}`;
                btn.className = 'rlt-btn btn-stop';
            } else {
                btn.textContent = `▶ START ${label}`;
                btn.className = 'rlt-btn btn-start';
            }
        },
        updateStats() {
            const p = document.getElementById('st-profit');
            p.textContent = Utils.formatMoney(State.profit);
            p.className = `rlt-stat-val ${State.profit >= 0 ? 'pos' : 'neg'}`;

            const h = document.getElementById('st-house');
            h.textContent = Utils.formatMoney(State.houseProfit);
            h.className = `rlt-stat-val ${State.houseProfit >= 0 ? 'pos' : 'neg'}`;
            document.getElementById('st-house-rounds').textContent = `${State.houseRounds} trận`;

            document.getElementById('st-win').textContent = State.wins;
            document.getElementById('st-loss').textContent = State.losses;
        },
        log(msg, type = 'normal') {
            const d = document.getElementById('rlt-log');
            const time = new Date().toLocaleTimeString('vi-VN');
            d.insertAdjacentHTML('afterbegin', `<div class="log-line ${type}"><span style="opacity:0.7">[${time}]</span> <span>${msg}</span></div>`);
            if (d.children.length > 200) {
                d.lastElementChild.remove();
            }
        },
        updateSharkTable() {
            let list = Object.values(SharkTracker.data);
            if (SharkTracker.filter) {
                list = list.filter(s => (s.name && s.name.toLowerCase().includes(SharkTracker.filter)) || (s.steamId && s.steamId.includes(SharkTracker.filter)));
            }
            list = list.map(s => {
                const row = { ...s };
                const total = row.wins + row.losses;
                row.winrate = total > 0 ? (row.wins / total) * 100 : 0;
                return row;
            }).sort((a, b) => {
                const key = SharkTracker.sortKey;
                const valA = a[key];
                const valB = b[key];
                return SharkTracker.sortDesc ? valB - valA : valA - valB;
            });
            const tbody = document.getElementById('shark-list');
            if (!list.length) {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center pad-10">No shark found...</td></tr>';
                return;
            }

            tbody.innerHTML = list.slice(0, 20).map(s => {
                const info = Utils.getDisplayInfo(s);
                return `
                <tr data-id="${s.steamId}" style="cursor:pointer" title="Ấn vào để copy shark">
                    <td><div class="shark-name-wrap"><img src="${info.head}" class="shark-avatar" onerror="this.style.display='none'">${info.name}</div></td>
                    <td class="${s.profit >= 0 ? 'pos' : 'neg'}">${s.profit >= 0 ? '+' : ''}${s.profit.toFixed(2)}</td>
                    <td>${s.winrate.toFixed(0)}% <span class="sub-text">(${s.wins}/${s.losses})</span></td>
                </tr>
            `;}).join('');
        },
        updateSortHeader() { }
    };
    SharkTracker.toggleSort = function(key) {
        if (this.sortKey === key) {
            this.sortDesc = !this.sortDesc;
        } else {
            this.sortKey = key;
            this.sortDesc = true;
        }
        UI.updateSharkTable();
    };

    const initLoopId = WorkerTimer.loop(() => {
        if (win.VNEngine && win.VNEngine.define && win.VNEngine.define.inst) {
            WorkerTimer.clear(initLoopId);
            if (!VNE.hooked) {
                UI.init();
                VNE.hook();
                console.log(`✅ ETOPFUN v${VERSION} LOADED`);
            }
        }
    }, 500);

})();
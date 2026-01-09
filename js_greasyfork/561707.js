// ==UserScript==
// @name         pterclub-auto-wof
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  猫站大转盘小助手，感谢源作者昙花 https://greasyfork.org/zh-CN/scripts/561489-pterclub-auto-wof
// @author       昙花&VicQ
// @match        https://pterclub.net/wof.php*
// @match        https://pterclub.net/dowof.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561707/pterclub-auto-wof.user.js
// @updateURL https://update.greasyfork.org/scripts/561707/pterclub-auto-wof.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ----- Config -----
    const CONFIG = {
        clickDelayMs: 500,
        historyLimit: 50,
        snapThreshold: 100,
        ballSize: 46,
        panelWidth: 270,
        costPerSpin: 2000
    };

    const PRIZES = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖'];
    const THEME = {
        gradient: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
        gradientBtn: 'linear-gradient(135deg, #FF512F, #DD2476)',
        white: 'rgba(255, 255, 255, 0.98)',
        shadowPanel: '0 8px 30px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)',
        textActive: '#d63031',
        textInactive: '#95a5a6',
        colorWin: '#e74c3c',
        colorLoss: '#27ae60',
        colorItem: '#8e44ad',
        colorDisabled: '#bdc3c7',
        bgDisabled: '#ecf0f1'
    };

    // ----- State Management -----
    const KEY = {
        statsTotal: 'wof_v3_stats_total',
        statsSession: 'wof_v3_stats_session',
        settings: 'wof_v3_settings',
        historyList: 'wof_v3_history_list',
        uiState: 'wof_v3_ui_state',
        pendingSpin: 'wof_v3_pending_spin',
        sessionFlag: 'wof_v3_session_active'
    };

    const createEmptyStats = () => ({
        total: 0,
        w1: 0, w2: 0, w3: 0, w4: 0, w5: 0, w6: 0, miss: 0,
        logs: { w1: [], w2: [], w3: [], w4: [], w5: [], w6: [], miss: [] },
        spent: 0, wonKarma: 0, wonUpload: 0, wonItems: 0,
        itemsLog: [],
        archives: []
    });

    const defaultSettings = {
        autoRun: false,
        stopEnabled: false,
        stopRanks: [],
        remainingCount: 10,
        unlimitedMode: false,
        stopReason: ''
    };

    const defaultUI = {
        x: window.innerWidth - 70,
        y: 200,
        minimized: false,
        dockSide: 'right',
        activeTab: 'session'
    };

    const storage = {
        get: (key, def) => {
            try {
                const val = localStorage.getItem(key);
                return val ? JSON.parse(val) : def;
            } catch (e) { return def; }
        },
        set: (key, val) => {
            localStorage.setItem(key, JSON.stringify(val));
        },
        remove: (key) => {
            localStorage.removeItem(key);
        }
    };

    // ----- Initialization -----
    let statsTotal = { ...createEmptyStats(), ...storage.get(KEY.statsTotal, createEmptyStats()) };
    if (!statsTotal.archives) statsTotal.archives = [];

    let statsSession = { ...createEmptyStats(), ...storage.get(KEY.statsSession, createEmptyStats()) };

    const isPageReload = sessionStorage.getItem(KEY.sessionFlag);
    if (!isPageReload) {
        if (statsSession.total > 0) {
            const archiveItem = {
                id: Date.now(),
                timestamp: new Date().toLocaleString() + ' (自动)',
                total: statsSession.total, logs: statsSession.logs,
                spent: statsSession.spent, wonKarma: statsSession.wonKarma, wonUpload: statsSession.wonUpload, wonItems: statsSession.wonItems, itemsLog: statsSession.itemsLog
            };
            statsTotal.archives = [archiveItem, ...(statsTotal.archives || [])];
            if (statsTotal.archives.length > 50) statsTotal.archives.pop();
            storage.set(KEY.statsTotal, statsTotal);
        }
        statsSession = createEmptyStats();
        storage.set(KEY.statsSession, statsSession);
        storage.set(KEY.historyList, []);
    }
    sessionStorage.setItem(KEY.sessionFlag, '1');

    const checkStruct = (obj) => {
        if (!obj.logs) obj.logs = createEmptyStats().logs;
        if (typeof obj.miss === 'undefined') obj.miss = 0;
        if (!obj.logs.miss) obj.logs.miss = [];
        if (typeof obj.spent === 'undefined') {
            obj.spent = 0; obj.wonKarma = 0; obj.wonUpload = 0; obj.wonItems = 0; obj.itemsLog = [];
        }
        return obj;
    };
    statsTotal = checkStruct(statsTotal);
    statsSession = checkStruct(statsSession);

    let settings = { ...defaultSettings, ...storage.get(KEY.settings, defaultSettings) };
    let historyList = storage.get(KEY.historyList, []);
    let uiState = storage.get(KEY.uiState, defaultUI);

    // ----- Logic Helpers -----
    const getCatFoodSpins = () => {
        try {
            const pTags = document.querySelectorAll('.Detail p, .Detail b');
            for (let p of pTags) {
                const text = p.innerText || p.textContent;
                if (text && text.includes('当前拥有猫粮')) {
                    const match = text.match(/[\d,.]+/);
                    if (match) return parseFloat(match[0].replace(/,/g, ''));
                }
            }
        } catch (e) { }
        return 0;
    };

    const addHistory = (result, currentSessionTotal) => {
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        historyList.unshift({ str: `#${currentSessionTotal} ${time}`, res: result });
        if (historyList.length > CONFIG.historyLimit) historyList.pop();
        storage.set(KEY.historyList, historyList);
    };

    const processPendingSpin = () => {
        const pending = storage.get(KEY.pendingSpin, null);
        if (!pending) return;

        const currentKarma = getCatFoodSpins();

        let diff = Math.round(currentKarma - pending.beforeKarma);

        const rankStr = pending.rank;

        let spinResult = { rankKey: '', isItem: false, prizeName: '', detailStr: '', upload: 0, karma: 0 };
        const prizeMap = { '一等': 'w1', '二等': 'w2', '三等': 'w3', '四等': 'w4', '五等': 'w5', '六等': 'w6' };
        let found = false;

        for (const [k, v] of Object.entries(prizeMap)) {
            if (rankStr.includes(k)) {
                spinResult.rankKey = v;
                spinResult.prizeName = k + '奖';
                found = true;
                break;
            }
        }

        if (!found || rankStr.includes('谢谢') || rankStr.includes('再接再厉')) {
            spinResult.rankKey = 'miss';
            spinResult.prizeName = '未中奖';
        }

        const cost = CONFIG.costPerSpin;
        if (spinResult.rankKey === 'miss') {
            spinResult.detailStr = '谢谢参与';
        } else if (spinResult.rankKey === 'w5') {
            spinResult.upload = 5.0;
            spinResult.detailStr = '5.0GB上传';
        } else if (spinResult.rankKey === 'w6') {
            spinResult.upload = 1.0;
            spinResult.detailStr = '1.0GB上传';
        } else {
            let gainedKarmaRaw = Math.round(diff + cost);

            if (gainedKarmaRaw > 5000) {
                spinResult.karma = gainedKarmaRaw;
                spinResult.isItem = false;
                spinResult.detailStr = `${spinResult.karma.toLocaleString()}猫粮`;
            } else {
                spinResult.isItem = true;
                spinResult.karma = 0;
                if(spinResult.rankKey === 'w1') spinResult.detailStr = "无敌幸运星";
                if(spinResult.rankKey === 'w2') spinResult.detailStr = "彩虹ID";
                if(spinResult.rankKey === 'w3') spinResult.detailStr = "VIP";
                if(spinResult.rankKey === 'w4') spinResult.detailStr = "邀请名额";
            }
        }

        const updateObj = (obj) => {
            obj.total += 1;
            obj.spent += cost;
            obj.wonKarma = Math.round(obj.wonKarma + spinResult.karma);
            obj.wonUpload = parseFloat((obj.wonUpload + spinResult.upload).toFixed(1));

            if (spinResult.rankKey === 'miss') {
                 obj.miss = (obj.miss || 0) + 1;
                 if (!obj.logs.miss) obj.logs.miss = [];
                 obj.logs.miss.push(obj.total);
            } else {
                 obj[spinResult.rankKey] = (obj[spinResult.rankKey] || 0) + 1;
                 if (!obj.logs[spinResult.rankKey]) obj.logs[spinResult.rankKey] = [];
                 obj.logs[spinResult.rankKey].push(obj.total);
            }
            if (spinResult.isItem) {
                obj.wonItems += 1;
                obj.itemsLog.push(`#${obj.total} ${spinResult.detailStr}`);
            }
            return obj;
        };

        statsTotal = updateObj(statsTotal);
        statsSession = updateObj(statsSession);
        storage.set(KEY.statsTotal, statsTotal);
        storage.set(KEY.statsSession, statsSession);

        let logMsg = `${spinResult.prizeName} (${spinResult.detailStr})`;
        addHistory(logMsg, statsSession.total);
        storage.remove(KEY.pendingSpin);
    };

    const resetSessionStats = () => {
        if (statsSession.total > 0) {
            const archiveItem = {
                id: Date.now(),
                timestamp: new Date().toLocaleString() + ' (手动)',
                total: statsSession.total, logs: JSON.parse(JSON.stringify(statsSession.logs)),
                spent: statsSession.spent, wonKarma: statsSession.wonKarma, wonUpload: statsSession.wonUpload, wonItems: statsSession.wonItems, itemsLog: [...statsSession.itemsLog]
            };
            statsTotal.archives = [archiveItem, ...(statsTotal.archives || [])];
            if (statsTotal.archives.length > 50) statsTotal.archives.pop();
            storage.set(KEY.statsTotal, statsTotal);
        }
        statsSession = createEmptyStats();
        historyList = [];
        storage.set(KEY.statsSession, statsSession);
        storage.set(KEY.historyList, historyList);
        renderPanelContent();
        renderHistory();
    };

    const resetTotalStats = () => {
        statsTotal = createEmptyStats();
        storage.set(KEY.statsTotal, statsTotal);
        renderPanelContent();
    };

    const getRate = (obj, count) => obj.total === 0 ? '0%' : ((count / obj.total) * 100).toFixed(1) + '%';

    // ----- UI Construction -----
    const createUI = () => {
        const container = document.createElement('div');
        container.id = 'wof-container';
        container.style.cssText = `
            position: fixed; left: ${uiState.x}px; top: ${uiState.y}px; z-index: 9999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            user-select: none; overflow: hidden; color: #333;
            background: ${THEME.white}; border-radius: 10px; box-shadow: ${THEME.shadowPanel};
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        `;
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes wof-pulse { 0% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.4); } 70% { box-shadow: 0 0 0 3px rgba(39, 174, 96, 0); } 100% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0); } }
            .wof-status-running { background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; animation: wof-pulse 1.5s infinite; border:none; box-shadow: 0 2px 5px rgba(39,174,96,0.2); }
            .wof-status-stopped { background: #e0e0e0; color: #7f8c8d; border: 1px solid #d0d0d0; }
        `;
        container.appendChild(style);

        container.innerHTML += `
            <div id="wof-ball-content" style="
                position: absolute; width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                font-size: 24px; cursor: move; color: white;
                opacity: 0; pointer-events: none; transition: opacity 0.2s;
            ">🎰</div>

            <div id="wof-panel-content" style="width: ${CONFIG.panelWidth}px; display: flex; flex-direction: column;">
                <div id="wof-header" style="padding: 6px 10px; display:flex; justify-content:space-between; align-items:center; cursor:move; border-bottom: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.6);">
                    <div style="font-weight:800; font-size:12px; color:#c0392b;">🎰 转盘小助手 by VicQ</div>
                    <div style="display:flex; gap:5px; align-items:center;">
                        <div id="wof-status-badge" style="font-size:9px; padding:1px 6px; border-radius:8px; font-weight:bold; transition:all 0.3s; cursor:default; letter-spacing:0.5px;">已停止</div>
                        <div id="wof-minimize-btn" style="cursor:pointer; width:18px; height:18px; border-radius:4px; background:#f1f2f6; display:flex; align-items:center; justify-content:center; color:#999; font-size:12px; font-weight:bold;">－</div>
                    </div>
                </div>

                <div id="wof-stop-reason" style="display:none; background:#fff0f0; padding:3px 10px; font-size:10px; color:#e74c3c; border-bottom:1px solid #fadbd8;"></div>

                <div style="padding: 8px;">
                    <div style="display:flex; background:#f1f2f6; border-radius:5px; padding:2px; margin-bottom:6px;">
                        <div id="wof-tab-session" style="flex:1; text-align:center; padding:3px; font-size:10px; cursor:pointer; border-radius:4px; transition:all 0.2s; font-weight:700;">⏱️ 本次</div>
                        <div id="wof-tab-total" style="flex:1; text-align:center; padding:3px; font-size:10px; cursor:pointer; border-radius:4px; transition:all 0.2s; font-weight:700;">📚 总计</div>
                    </div>

                    <div id="wof-stats-container"></div>

                    <div style="margin-bottom:6px;">
                        <div id="wof-logs-header" style="font-size:10px; color:#e17055; cursor:pointer; text-align:center; padding:3px; background:#fff5f5; border-radius:5px; border:1px solid #fadbd8; transition:0.2s;">
                            🏆 中奖详情 ▼
                        </div>
                        <div id="wof-logs-content" style="display:none; margin-top:4px; max-height:120px; overflow-y:auto; font-size:10px; background:#f8f9fa; padding:6px; border-radius:5px; border:1px solid #eee; box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);"></div>
                    </div>

                    <div style="margin-bottom:6px; background:#fff; padding:5px 6px; border-radius:5px; border:1px solid #eee;">
                        <div style="display:flex; align-items:center; justify-content:space-between; height:20px;">
                            <label style="display:flex; align-items:center; cursor:pointer; font-size:10px; color:#555; font-weight:600;">
                                <input type="checkbox" id="wof-unlimited" ${settings.unlimitedMode ? 'checked' : ''} style="accent-color:#e17055; margin-right:3px;">
                                不限次数
                            </label>

                            <div style="display:flex; align-items:center;">
                                <span style="font-size:10px; margin-right:3px; color:#999;">剩余</span>
                                <div style="position:relative; width:40px; height:18px;">
                                    <input type="number" id="wof-limit-input" value="${settings.remainingCount}" min="0"
                                        style="width:100%; height:100%; text-align:center; border:1px solid #e0e0e0; border-radius:3px; font-weight:bold; color:#2c3e50; outline:none; background:#f9f9f9; padding:0; font-size:11px;">
                                    <div id="wof-limit-infinity" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:#fff5f5; border-radius:3px; border:1px solid #fadbd8; align-items:center; justify-content:center; color:#e17055; font-size:12px; line-height:1; font-weight:bold;">∞</div>
                                </div>
                            </div>

                            <label style="display:flex; align-items:center; cursor:pointer; font-size:10px; color:#555;">
                                <input type="checkbox" id="wof-stop-toggle" ${settings.stopEnabled ? 'checked' : ''} style="accent-color:#e17055; margin-right:3px;">
                                中奖停止
                            </label>
                        </div>

                        <div id="wof-stop-options-container" style="display:${settings.stopEnabled ? 'flex' : 'none'}; flex-wrap:wrap; gap:2px; margin-top:4px; padding-top:3px; border-top:1px dashed #eee;">
                            ${PRIZES.map(p => `
                                <label style="font-size:9px; color:#666; display:inline-flex; align-items:center; background:${settings.stopRanks.includes(p) ? '#fff5f5' : '#fff'}; border:1px solid ${settings.stopRanks.includes(p) ? '#fadbd8' : '#e0e0e0'}; padding:1px 4px; border-radius:4px; cursor:pointer; transition:all 0.2s;">
                                    <input type="checkbox" value="${p}" ${settings.stopRanks.includes(p) ? 'checked' : ''} style="display:none;"> ${p}
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div style="display:flex; gap:5px;">
                        <button id="wof-start" style="flex:1; padding:5px; border:none; border-radius:5px; font-weight:700; font-size:11px; box-shadow:0 2px 5px rgba(0,0,0,0.1); transition:all 0.2s; letter-spacing:1px; color:white;">开始</button>
                        <button id="wof-stop" style="flex:1; padding:5px; background:#fff; color:#555; border:1px solid #e0e0e0; border-radius:5px; cursor:pointer; font-weight:700; font-size:11px; transition:all 0.2s; letter-spacing:1px;">停止</button>
                    </div>

                    <div id="wof-history-header" style="margin-top:6px; padding-top:4px; border-top:1px dashed #e0e0e0; display:flex; justify-content:center; align-items:center; cursor:pointer;">
                        <span style="font-size:9px; color:#999; display:flex; align-items:center; gap:3px;">📜 当前流水</span>
                    </div>
                    <div id="wof-history-list" style="display:none; max-height:70px; overflow-y:auto; margin-top:3px; font-size:9px; color:#666;"></div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        setTimeout(() => {
             container.style.transition = 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.4s ease, background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease';
        }, 100);

        updateContainerStyle(uiState.minimized, uiState.dockSide);
        updateTabStyle();
        renderPanelContent();
        renderStatus();
        renderHistory();
        return container;
    };

    // ----- Status & Logic Logic -----
    const updateStartButtonState = () => {
        const btn = document.getElementById('wof-start');
        if (!btn) return;

        const isRunnable = settings.unlimitedMode || settings.remainingCount > 0;

        if (isRunnable) {
            btn.dataset.disabled = "false";
            btn.style.background = THEME.gradientBtn;
            btn.style.color = '#fff';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.pointerEvents = 'auto';
            btn.innerHTML = settings.unlimitedMode ? '开始 (无限)' : `开始 (剩 ${settings.remainingCount})`;
        } else {
            btn.dataset.disabled = "true";
            btn.style.background = THEME.bgDisabled;
            btn.style.color = THEME.colorDisabled;
            btn.style.opacity = '1';
            btn.style.cursor = 'not-allowed';
            btn.style.pointerEvents = 'none';
            btn.innerHTML = '次数不足';
        }
    };

    const renderStatus = () => {
        const isAuto = settings.autoRun;
        const badge = document.getElementById('wof-status-badge');
        const reasonEl = document.getElementById('wof-stop-reason');
        const optionsContainer = document.getElementById('wof-stop-options-container');

        if (badge) {
            if (isAuto) {
                badge.className = 'wof-status-running';
                badge.innerText = '运行中';
            } else {
                badge.className = 'wof-status-stopped';
                badge.innerText = '已停止';
            }
        }

        if (!isAuto && settings.stopReason) {
            reasonEl.style.display = 'block';
            reasonEl.innerText = `⏹ 停止: ${settings.stopReason}`;
        } else {
            reasonEl.style.display = 'none';
        }

        if (optionsContainer) optionsContainer.style.display = settings.stopEnabled ? 'flex' : 'none';

        const spins = Math.floor(getCatFoodSpins() / 2000);
        const remEl = document.getElementById('site-remaining');
        if (remEl) remEl.innerText = spins;

        const input = document.getElementById('wof-limit-input');
        const infinity = document.getElementById('wof-limit-infinity');
        if (settings.unlimitedMode) {
            input.style.display = 'none';
            infinity.style.display = 'flex';
        } else {
            input.style.display = 'block';
            infinity.style.display = 'none';
        }

        const opts = document.querySelectorAll('#wof-stop-options-container label');
        opts.forEach(lbl => {
            const input = lbl.querySelector('input');
            if (input.checked) {
                lbl.style.background = '#fff5f5';
                lbl.style.borderColor = '#fadbd8';
                lbl.style.color = '#e74c3c';
            } else {
                lbl.style.background = '#fff';
                lbl.style.borderColor = '#e0e0e0';
                lbl.style.color = '#666';
            }
        });
        updateStartButtonState();
    };

    const stopAutoRun = (reason) => {
        settings.autoRun = false;
        settings.stopReason = reason;
        storage.set(KEY.settings, settings);
        renderStatus();
    };

    // ----- Panel Behavior -----
    const updateTabStyle = () => {
        const tabSession = document.getElementById('wof-tab-session');
        const tabTotal = document.getElementById('wof-tab-total');
        if(!tabSession) return;
        const isSession = uiState.activeTab === 'session';
        tabSession.style.background = isSession ? '#fff' : 'transparent';
        tabSession.style.color = isSession ? THEME.textActive : THEME.textInactive;
        tabSession.style.boxShadow = isSession ? '0 1px 3px rgba(0,0,0,0.05)' : 'none';
        tabTotal.style.background = !isSession ? '#fff' : 'transparent';
        tabTotal.style.color = !isSession ? THEME.textActive : THEME.textInactive;
        tabTotal.style.boxShadow = !isSession ? '0 1px 3px rgba(0,0,0,0.05)' : 'none';
    };

    const renderPanelContent = () => {
        try {
            const container = document.getElementById('wof-stats-container');
            const logsContainer = document.getElementById('wof-logs-content');
            if(!container) return;

            const isSession = uiState.activeTab === 'session';
            const data = isSession ? statsSession : statsTotal;
            const spins = Math.floor(getCatFoodSpins() / 2000);

            const netKarma = Math.round(data.wonKarma - data.spent);
            const netClass = netKarma >= 0 ? `color:${THEME.colorWin}` : `color:${THEME.colorLoss}`;
            const netPrefix = netKarma > 0 ? '+' : '';

            let itemNamesHtml = '';
            if (data.wonItems > 0 && Array.isArray(data.itemsLog) && data.itemsLog.length > 0) {
                const names = data.itemsLog.filter(s => typeof s === 'string').map(s => {
                    const parts = s.split(' '); return parts.length > 1 ? parts.slice(1).join(' ') : s;
                });
                const uniqueNames = [...new Set(names)].join(', ');
                itemNamesHtml = `<span style="font-size:9px; color:${THEME.colorItem}; margin-left:3px;">(${uniqueNames})</span>`;
            }

            const countLabel = isSession ? '本次' : '历史';
            const topLabel = isSession ? '最多可抽' : '中奖率';
            const topVal = isSession ? `<span style="color:${THEME.colorWin}">${spins}</span>` : `<span style="color:${THEME.colorWin}">${getRate(data, (data.w1||0)+(data.w2||0)+(data.w3||0)+(data.w4||0)+(data.w5||0)+(data.w6||0))}</span>`;

            const econHtml = `
                <div style="background:#fff; border:1px solid #f0f0f0; border-radius:6px; padding:5px 8px; margin-bottom:6px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; border-bottom:1px solid #f8f9fa; padding-bottom:3px;">
                        <div style="font-size:10px; color:#999;">${topLabel}: <strong style="font-size:11px;">${topVal}</strong></div>
                        <div style="font-size:10px; color:#999;">${countLabel}: <strong style="color:#333; font-size:11px;">${data.total}</strong></div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2px 8px; font-size:10px;">
                        <div style="display:flex; justify-content:space-between; color:#999;">
                            <span>消耗:</span> <span style="font-weight:600; color:#333;">${data.spent}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; color:#999;">
                            <span>猫粮:</span> <span style="font-weight:600; color:#e67e22;">${Math.round(data.wonKarma)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; color:#999;">
                            <span>上传:</span> <span style="font-weight:600; color:#3498db;">${data.wonUpload} G</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; color:#999;">
                            <span>盈亏:</span> <span style="font-weight:bold; ${netClass}">${netPrefix}${netKarma}</span>
                        </div>
                    </div>
                    <div style="margin-top:3px; border-top:1px dashed #eee; font-size:10px; display:flex; justify-content:space-between; align-items:center; padding-top:3px;">
                        <span style="color:#999;">物品:</span>
                        <div style="text-align:right;">
                            <span style="font-weight:bold; color:${THEME.colorItem};">${data.wonItems}</span>
                            ${itemNamesHtml}
                        </div>
                    </div>
                </div>
            `;

            let clearBtnText = isSession ? '🗑️ 清空&归档' : '🗑️ 清空历史';

            const gridHtml = `
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-bottom:4px;">
                    ${PRIZES.map((p, i) => {
                        const key = 'w' + (i + 1);
                        const count = data[key];
                        return `
                            <div style="background:#fff; padding:3px 8px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; border:1px solid #f4f4f4;">
                                <span style="color:#666; font-size:10px;">${p}</span>
                                <div style="text-align:right; line-height:1;">
                                    <div style="font-weight:700; font-size:10px; color:#333;">${count}</div>
                                    <div style="font-size:9px; color:#bbb;">${getRate(data, count)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="background:#f9f9f9; padding:3px 8px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; border:1px solid #f0f0f0; margin-bottom:6px;">
                    <span style="color:#999; font-size:10px;">未中奖</span>
                    <div style="text-align:right; display:flex; align-items:center; gap:6px;">
                        <span style="font-weight:700; font-size:10px; color:#95a5a6;">${data.miss||0}</span>
                        <span style="font-size:9px; color:#ccc;">${getRate(data, data.miss||0)}</span>
                    </div>
                </div>
            `;

            container.innerHTML = `
                ${econHtml}
                <div style="text-align:right; margin-bottom:4px;">
                    <button id="wof-reset-btn" style="
                        border:1px solid #fadbd8; background:#fffafa; color:#e74c3c;
                        border-radius:4px; padding:1px 5px; font-size:9px; cursor:pointer;
                        transition:all 0.2s;
                    " onmouseover="this.style.background='#ffecec'" onmouseout="this.style.background='#fffafa'">${clearBtnText}</button>
                </div>
                ${gridHtml}
            `;

            const btn = document.getElementById('wof-reset-btn');
            if(btn) {
                btn.onclick = () => {
                    if (isSession) {
                        if(confirm('点击确定归档并清空本次数据')) resetSessionStats();
                    } else {
                        if(confirm('点击确定清空所有数据')) resetTotalStats();
                    }
                };
            }

            // Logs (No changes needed for layout, kept compact)
            let logHtml = '';
            if (isSession) {
                const prizeMap = { 'w1': '一等奖', 'w2': '二等奖', 'w3': '三等奖', 'w4': '四等奖', 'w5': '五等奖', 'w6': '六等奖' };
                let hasData = false;
                for (const [key, name] of Object.entries(prizeMap)) {
                    const arr = data.logs[key];
                    if (arr && arr.length > 0) {
                        hasData = true;
                        const displayArr = arr.length > 20 ? [...arr.slice(0, 5), '...', ...arr.slice(-5)] : arr;
                        const formattedLogs = displayArr.map(idx => `#${idx}`).join(', ');
                        logHtml += `<div style="margin-bottom:3px; border-bottom:1px dashed #eee; padding-bottom:2px;">
                            <div style="color:${THEME.colorWin}; font-weight:bold; margin-bottom:1px;">${name}</div>
                            <div style="color:#666; line-height:1.1;">${formattedLogs}</div>
                        </div>`;
                    }
                }
                if (data.wonItems > 0 && Array.isArray(data.itemsLog) && data.itemsLog.length > 0) {
                    hasData = true;
                    const names = data.itemsLog.filter(s => typeof s === 'string').map(s => { const parts = s.split(' '); return parts.length > 1 ? parts.slice(1).join(' ') : s; });
                    const uniqueNames = [...new Set(names)].join(', ');
                    logHtml += `<div style="margin-top:3px; padding-top:3px; border-top:1px solid #eee;">
                        <div style="color:${THEME.colorItem}; font-weight:bold; margin-bottom:1px;">获得实物</div>
                        <div style="color:#666; font-size:9px;">${uniqueNames}</div>
                    </div>`;
                }
                if(!hasData && (data.miss > 0)){
                     logHtml += `<div style="text-align:center; color:#999; margin-top:5px;">本次暂无中奖 (未中奖 ${data.miss} 次)</div>`;
                     hasData = true;
                }
                if(!hasData) logsContainer.innerHTML = `<div style="text-align:center; color:#999;">暂无数据</div>`;
                else logsContainer.innerHTML = logHtml;

            } else {
                let batches = [];
                if (statsSession.total > 0) {
                    batches.push({
                        id: 'current', timestamp: '🟢 进行中', total: statsSession.total, logs: statsSession.logs,
                        isCurrent: true, spent: statsSession.spent, wonKarma: statsSession.wonKarma, wonUpload: statsSession.wonUpload, wonItems: statsSession.wonItems, itemsLog: statsSession.itemsLog, miss: statsSession.miss
                    });
                }
                if (statsTotal.archives) batches = batches.concat(statsTotal.archives);

                if (batches.length === 0) {
                    logsContainer.innerHTML = `<div style="text-align:center; color:#999;">暂无归档</div>`;
                } else {
                    logHtml = batches.map((batch, index) => {
                        let detailsHtml = '';
                        let hasPrize = false;
                        const rankKeys = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
                        const rankNames = ['一等', '二等', '三等', '四等', '五等', '六等'];
                        const rankColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#95a5a6'];

                        rankKeys.forEach((key, rIdx) => {
                            const idxList = batch.logs[key];
                            if (idxList && idxList.length > 0) {
                                hasPrize = true;
                                const percent = ((idxList.length / batch.total) * 100).toFixed(0) + '%';
                                const idxStr = idxList.map(i => `#${i}`).join(' ');
                                detailsHtml += `<div style="display:flex; align-items:baseline; margin-top:1px; font-size:10px;">
                                    <span style="color:${rankColors[rIdx]}; font-weight:bold; margin-right:4px; min-width:28px;">${rankNames[rIdx]}</span>
                                    <span style="color:#999; font-size:9px; margin-right:4px;">(${percent})</span>
                                    <span style="color:#555; font-family:monospace;">${idxStr}</span>
                                </div>`;
                            }
                        });

                        const missCount = batch.miss || (batch.logs.miss ? batch.logs.miss.length : 0);
                        if(missCount > 0) {
                             const percent = ((missCount / batch.total) * 100).toFixed(0) + '%';
                             detailsHtml += `<div style="display:flex; align-items:baseline; margin-top:1px; font-size:10px;">
                                <span style="color:#999; font-weight:bold; margin-right:4px; min-width:28px;">未中奖</span>
                                <span style="color:#999; font-size:9px; margin-right:4px;">(${percent})</span>
                                <span style="color:#999; font-family:monospace;">${missCount}次</span>
                            </div>`;
                        }

                        if (!hasPrize && missCount === 0) detailsHtml += `<div style="color:#ccc; font-size:10px; margin-top:2px; font-style:italic;">无记录</div>`;

                        const bNet = Math.round((batch.wonKarma||0) - (batch.spent||0));
                        const bNetClass = bNet>=0 ? THEME.colorWin : THEME.colorLoss;

                        let bItemsHtml = '';
                        if (batch.wonItems > 0 && Array.isArray(batch.itemsLog) && batch.itemsLog.length > 0) {
                             const bNames = batch.itemsLog.filter(s=>typeof s==='string').map(s => { const parts = s.split(' '); return parts.length > 1 ? parts.slice(1).join(' ') : s; });
                            const bUniqueNames = [...new Set(bNames)].join(', ');
                            bItemsHtml = `<span style="color:${THEME.colorItem}; margin-left:4px;">(${bUniqueNames})</span>`;
                        }

                        const bgStyle = batch.isCurrent ? 'background:#fffbfb; border:1px solid #ffdede;' : 'background:#fff; border:1px solid #eee;';
                        const titleColor = batch.isCurrent ? '#d63031' : '#333';

                        return `<div style="${bgStyle} border-radius:5px; padding:5px; margin-bottom:5px;">
                            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f0f0f0; padding-bottom:2px; margin-bottom:2px;">
                                <span style="font-weight:bold; color:${titleColor}; font-size:10px;">${index+1}. ${batch.timestamp}</span>
                                <span style="font-weight:bold; color:#555; font-size:10px;">共 ${batch.total} 抽</span>
                            </div>
                            <div>${detailsHtml}</div>
                            <div style="margin-top:3px; padding-top:2px; border-top:1px dashed #eee; font-size:9px; display:flex; flex-wrap:wrap; gap:6px; color:#777;">
                                <span style="font-weight:bold; color:${bNetClass}">净: ${bNet>0?'+':''}${bNet}</span>
                                <span style="color:#3498db;">⬆${batch.wonUpload||0}G</span>
                                <span style="color:${THEME.colorItem};">🎁${batch.wonItems||0}${bItemsHtml}</span>
                            </div>
                        </div>`;
                    }).join('');
                    logsContainer.innerHTML = logHtml;
                }
            }

        } catch (e) {
            console.error('Render Panel Error:', e);
        }
    };

    const renderHistory = () => {
        const div = document.getElementById('wof-history-list');
        if(!div) return;
        div.innerHTML = historyList.map(h => `
            <div style="padding:1px 0; display:flex; justify-content:space-between; align-items:center; width:100%; white-space:nowrap;">
                <span style="color:#999; margin-right:6px; font-family:monospace; font-size:9px;">${h.str}</span>
                <span style="font-weight:500; color:#333; font-size:10px;">${h.res}</span>
            </div>`).join('');
    };

    // ----- Panel Behavior (Standard) -----
    const updateContainerStyle = (minimized, side) => {
        const container = document.getElementById('wof-container');
        if (!container) return;
        if (minimized) {
            container.style.background = THEME.gradient;
            container.style.boxShadow = THEME.shadowRed;
            container.style.backdropFilter = 'none';
            container.style.width = CONFIG.ballSize + 'px';
            container.style.height = CONFIG.ballSize + 'px';
            if (side === 'left') container.style.borderRadius = '0 24px 24px 0';
            else if (side === 'right') container.style.borderRadius = '24px 0 0 24px';
            else container.style.borderRadius = '50%';
        } else {
            container.style.background = THEME.white;
            container.style.boxShadow = THEME.shadowPanel;
            container.style.backdropFilter = 'blur(10px)';
            container.style.width = CONFIG.panelWidth + 'px';
            container.style.height = 'auto';
            container.style.borderRadius = '16px';
        }
    };

    const handleDragEndBall = () => {
        const container = document.getElementById('wof-container');
        const rect = container.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        let newX = rect.left;
        let newY = rect.top;
        newX = Math.max(0, Math.min(newX, winW - CONFIG.ballSize));
        newY = Math.max(0, Math.min(newY, winH - CONFIG.ballSize));
        const distLeft = newX;
        const distRight = winW - (newX + CONFIG.ballSize);

        if (distLeft < CONFIG.snapThreshold) {
            newX = 0;
            uiState.dockSide = 'left';
            updateContainerStyle(true, 'left');
        } else if (distRight < CONFIG.snapThreshold) {
            newX = winW - CONFIG.ballSize;
            uiState.dockSide = 'right';
            updateContainerStyle(true, 'right');
        } else {
            uiState.dockSide = null;
            updateContainerStyle(true, null);
        }
        container.style.left = newX + 'px';
        container.style.top = newY + 'px';
        uiState.x = newX;
        uiState.y = newY;
        storage.set(KEY.uiState, uiState);
    };

    const toggleMinimize = (minimize) => {
        const container = document.getElementById('wof-container');
        const ballContent = document.getElementById('wof-ball-content');
        const panelContent = document.getElementById('wof-panel-content');
        uiState.minimized = minimize;
        if (minimize) {
            const rect = container.getBoundingClientRect();
            const winW = window.innerWidth;
            const distLeft = rect.left;
            const distRight = winW - (rect.left + rect.width);
            if (distLeft < CONFIG.snapThreshold) uiState.dockSide = 'left';
            else if (distRight < CONFIG.snapThreshold) uiState.dockSide = 'right';
        }
        storage.set(KEY.uiState, uiState);

        if (minimize) {
            const winW = window.innerWidth;
            let targetX = parseInt(container.style.left);
            if (uiState.dockSide === 'left') targetX = 0;
            else if (uiState.dockSide === 'right') targetX = winW - CONFIG.ballSize;
            updateContainerStyle(true, uiState.dockSide);
            container.style.left = targetX + 'px';
            panelContent.style.opacity = '0';
            panelContent.style.pointerEvents = 'none';
            setTimeout(() => {
                if(uiState.minimized) {
                    panelContent.style.display = 'none';
                    ballContent.style.display = 'flex';
                    requestAnimationFrame(() => ballContent.style.opacity = '1');
                    ballContent.style.pointerEvents = 'auto';
                }
            }, 300);
        } else {
            const winW = window.innerWidth;
            let currentLeft = parseInt(container.style.left);
            let targetLeft = currentLeft;
            if (currentLeft < 10 || uiState.dockSide === 'left') targetLeft = 10;
            else if (currentLeft > winW - 200 || uiState.dockSide === 'right') targetLeft = winW - CONFIG.panelWidth - 10;
            updateContainerStyle(false, null);
            container.style.left = targetLeft + 'px';
            ballContent.style.opacity = '0';
            ballContent.style.pointerEvents = 'none';
            panelContent.style.display = 'flex';
            void panelContent.offsetWidth;
            panelContent.style.opacity = '1';
            panelContent.style.pointerEvents = 'auto';
            setTimeout(() => {
                ballContent.style.display = 'none';
                clampPanelPosition();
            }, 300);
        }
    };

    const clampPanelPosition = () => {
         const container = document.getElementById('wof-container');
         if (uiState.minimized) return;
         const rect = container.getBoundingClientRect();
         const winW = window.innerWidth;
         const winH = window.innerHeight;
         const margin = 10;
         let newX = rect.left;
         let newY = rect.top;
         if (newX + rect.width > winW) newX = winW - rect.width - margin;
         if (newY + rect.height > winH) newY = winH - rect.height - margin;
         if (newX < margin) newX = margin;
         if (newY < margin) newY = margin;
         if (newX !== rect.left || newY !== rect.top) {
             container.style.left = newX + 'px';
             container.style.top = newY + 'px';
             uiState.x = newX;
             uiState.y = newY;
             storage.set(KEY.uiState, uiState);
         }
    };

    const enableDrag = (container) => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        let hasMoved = false;

        const handleMouseDown = (e) => {
            if (e.target.closest('#wof-header') || e.target.closest('#wof-ball-content')) {
                isDragging = true;
                hasMoved = false;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = container.offsetLeft;
                initialTop = container.offsetTop;
                if (uiState.minimized) container.style.borderRadius = '50%';
                container.style.transition = 'none';
                e.preventDefault();
            }
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
            container.style.left = `${initialLeft + dx}px`;
            container.style.top = `${initialTop + dy}px`;
        };

        const handleMouseUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            container.style.transition = 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.4s ease, background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease';

            if (e.target.closest('#wof-ball-content')) {
                if (!hasMoved) toggleMinimize(false);
                else handleDragEndBall();
            } else {
                if (hasMoved) {
                    uiState.dockSide = null;
                    storage.set(KEY.uiState, uiState);
                }
                clampPanelPosition();
            }
        };

        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const bindEvents = () => {
        document.getElementById('wof-minimize-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleMinimize(true); });
        document.getElementById('wof-tab-session').addEventListener('click', () => { uiState.activeTab = 'session'; storage.set(KEY.uiState, uiState); updateTabStyle(); renderPanelContent(); });
        document.getElementById('wof-tab-total').addEventListener('click', () => { uiState.activeTab = 'total'; storage.set(KEY.uiState, uiState); updateTabStyle(); renderPanelContent(); });
        document.getElementById('wof-history-header').addEventListener('click', () => { const list = document.getElementById('wof-history-list'); list.style.display = list.style.display === 'none' ? 'block' : 'none'; });
        document.getElementById('wof-logs-header').addEventListener('click', () => { const list = document.getElementById('wof-logs-content'); list.style.display = list.style.display === 'none' ? 'block' : 'none'; });
        document.getElementById('wof-unlimited').addEventListener('change', (e) => { settings.unlimitedMode = e.target.checked; storage.set(KEY.settings, settings); renderStatus(); });
        document.getElementById('wof-limit-input').addEventListener('input', (e) => {
            let val = parseInt(e.target.value);
            if(isNaN(val) || val < 0) { val = 0; e.target.value = 0; }
            settings.remainingCount = val;
            storage.set(KEY.settings, settings);
            renderStatus();
        });
        document.getElementById('wof-stop-toggle').addEventListener('change', (e) => { settings.stopEnabled = e.target.checked; storage.set(KEY.settings, settings); renderStatus(); });
        document.getElementById('wof-stop-options-container').addEventListener('change', () => { settings.stopRanks = Array.from(document.querySelectorAll('#wof-stop-options-container input:checked')).map(cb => cb.value); storage.set(KEY.settings, settings); renderStatus(); });
        document.getElementById('wof-start').addEventListener('click', () => {
            const btn = document.getElementById('wof-start');
            if(btn.dataset.disabled === "true") return;
            settings.autoRun = true; settings.stopReason = ''; storage.set(KEY.settings, settings); renderStatus(); clickWheel();
        });
        document.getElementById('wof-stop').addEventListener('click', () => { stopAutoRun('手动停止'); });
    };

    // ----- Main Logic -----
    const originalAlert = window.alert;
    window.alert = function (msg) {
        const currentKarma = getCatFoodSpins();
        const pendingState = { rank: msg, beforeKarma: currentKarma, timestamp: Date.now() };
        storage.set(KEY.pendingSpin, pendingState);
        console.log('[抽奖拦截] Pending...', pendingState);
        if (settings.autoRun) {
            if (!settings.unlimitedMode) {
                settings.remainingCount -= 1;
                if (settings.remainingCount <= 0) {
                    settings.remainingCount = 0;
                    stopAutoRun('次数耗尽');
                } else {
                    storage.set(KEY.settings, settings);
                }
            }
            if (settings.autoRun && settings.stopEnabled && settings.stopRanks.some(rank => msg.includes(rank))) {
                 const hitRank = settings.stopRanks.find(r => msg.includes(r));
                 stopAutoRun(`命中 [${hitRank}]`);
            }
        }
    };

    const clickWheel = () => {
        if (!settings.autoRun) return;
        const btn = document.querySelector('#inner');
        if (btn) {
            btn.click();
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            btn.dispatchEvent(event);
        }
    };

    // ----- Initialization -----
    processPendingSpin();
    const container = createUI();
    enableDrag(container);
    bindEvents();

    if (uiState.minimized) {
        updateContainerStyle(true, uiState.dockSide);
        document.getElementById('wof-panel-content').style.display = 'none';
        document.getElementById('wof-ball-content').style.display = 'flex';
        document.getElementById('wof-ball-content').style.opacity = '1';
        document.getElementById('wof-ball-content').style.pointerEvents = 'auto';
        const winW = window.innerWidth;
        if (uiState.dockSide === 'left') container.style.left = '0px';
        else if (uiState.dockSide === 'right') container.style.left = (winW - CONFIG.ballSize) + 'px';
        else container.style.left = uiState.x + 'px';
        container.style.top = uiState.y + 'px';
    } else {
        updateContainerStyle(false, null);
        clampPanelPosition();
    }

    if (/pterclub\.net\/(wof|dowof)\.php/.test(location.href)) {
        if (settings.autoRun) {
            if (settings.unlimitedMode || settings.remainingCount > 0) {
                setTimeout(clickWheel, CONFIG.clickDelayMs);
            } else {
                stopAutoRun('刷新后检测到次数为0');
            }
        }
    }
})();
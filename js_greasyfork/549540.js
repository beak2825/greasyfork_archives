// ==UserScript==
// @name         Tool full options
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Tool khoáng
// @author       Optimized by KeshiNguyen
// @match        *://*/*
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/549540/Tool%20full%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/549540/Tool%20full%20options.meta.js
// ==/UserScript==
    'use strict';

(function() {
    //Check update
    function checkForUpdates() {
        const currentVersion = GM_info.script.version;
        const lastVersion = GM_getValue('lastVersion', '');

        if (lastVersion && lastVersion !== currentVersion) {
            // Hiển thị thông báo cập nhật
            GM_notification({
                text: `Script đã được cập nhật từ ${lastVersion} lên ${currentVersion}. Nhấp để xem thay đổi.`,
                title: 'Cập nhật Script',
                image: 'https://greasyfork.org/assets/blacklogo96-ea600e6a6acf4efc2c543cc4a6f5c6c3506a567aeda3e3b8c347c2baab4d2f90.png',
                onclick: function() {
                    // Mở trang changelog hoặc Greasy Fork
                    window.open('https://greasyfork.org/en/scripts/549540-tool-full-options/versions', '_blank');
                }
            });

            // Ghi log vào console
            console.log(`[Script Update] Đã cập nhật từ ${lastVersion} lên ${currentVersion}`);
        }

        // Lưu phiên bản hiện tại
        GM_setValue('lastVersion', currentVersion);
    }
    checkForUpdates();
    const isGameDomain = () => {
        return /cmangax\d+\.com|cnovel/.test(location.hostname);
    };

    if (!isGameDomain()) return;
    let target = "";
    let reload = 10 * 1000;
    const URL = {
        ENERGY: (character_id) => `/api/character_energy_mine?character=${character_id}`,
        HMK_AREA: (area) => `/api/score_list?type=battle_mine&area=${area}`,
        OTHER: (id) => `api/get_data_by_id?table=game_character&data=info,other&id=${id}`,
    };
    let diffTimeServer = 2 * 60 * 60; //lệch 2 giờ

    // Thêm CSS cho giao diện
    GM_addStyle(`
        .keshi-miner-ui {
            position: fixed;
            bottom: 140px;
            left: 20px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        }

        .keshi-miner-button {
            background: linear-gradient(135deg, #4ecca3 0%, #2a9d8f 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .keshi-miner-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .keshi-miner-menu {
            position: absolute;
            bottom: 70px;
            left: 0;
            min-width: 800px;
            background: #16213e;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            display: none;
            min-height: 1000px;
            font-size: 18px;
        }

        .keshi-miner-menu.active {
            display: block;
        }

        .keshi-menu-header {
            padding: 15px;
            background: #0f3460;
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            color: #4ecca3;
        }

        .keshi-tabs {
            display: flex;
            background: #0f3460;
        }

        .keshi-tab {
            flex: 1;
            padding: 12px;
            text-align: center;
            cursor: pointer;
            transition: background 0.3s;
            color: white;
        }

        .keshi-tab.active {
            background: #4ecca3;
            color: #16213e;
            font-weight: bold;
        }

        .keshi-tab-content {
            padding: 15px;
            overflow-y: auto;
            color: white;
        }

        .keshi-tab-pane {
            display: none;
        }

        .keshi-tab-pane.active {
            display: block;
        }

        .keshi-sub-tabs {
            display: flex;
            margin-bottom: 15px;
            background: #1a1a2e;
            border-radius: 5px;
            overflow: hidden;
        }

        .keshi-sub-tab {
            flex: 1;
            padding: 8px;
            text-align: center;
            cursor: pointer;
            transition: background 0.3s;
            color: white;
            min-heigth: 500px;
        }

        .keshi-sub-tab.active {
            background: #4ecca3;
            color: #16213e;
            font-weight: bold;
        }

        .keshi-form-group {
            margin-bottom: 15px;
        }

        .keshi-form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #4ecca3;
        }

        .keshi-form-group input, .keshi-form-group select {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background: #1a1a2e;
            color: white;
            border: 1px solid #0f3460;
        }

        .keshi-btn {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }

        .keshi-btn-primary {
            background: #4ecca3;
            color: #16213e;
        }

        .keshi-btn-primary:hover {
            background: #2a9d8f;
        }

        .keshi-btn-danger {
            background: #e94560;
            color: white;
        }

        .keshi-btn-danger:hover {
            background: #c1334d;
        }

        .keshi-target-list {
            margin-top: 20px;
            overflow-y: auto;
        }

        .keshi-target-item {
            padding: 10px;
            background: #1a1a2e;
            border-radius: 5px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 3px solid #4ecca3;
            color: white;
        }

        .keshi-target-info {
            flex: 1;
        }

        .keshi-target-actions {
            display: flex;
            gap: 5px;
        }

        .keshi-miner-list {
            margin-top: 15px;
            max-height: 800px;
            overflow-y: auto;
        }

        .keshi-miner-item {
            padding: 12px;
            background: #1a1a2e;
            border-radius: 5px;
            margin-bottom: 10px;
            border-left: 3px solid #0f3460;
            color: white;
            font-size: 18px;
        }

        .keshi-miner-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .keshi-miner-area {
            font-weight: bold;
            color: #4ecca3;
        }

        .keshi-miner-rare {
            color: #e94560;
        }

        .keshi-miner-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 0.9rem;
        }

        .keshi-status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
        }

        .keshi-status-active {
            background: #4ecca3;
        }

        .keshi-status-inactive {
            background: #e94560;
        }

        .keshi-mining-controls {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }

        .keshi-stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }

        .keshi-stat-card {
            background: #1a1a2e;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            border-left: 4px solid #4ecca3;
        }

        .keshi-stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #4ecca3;
            margin: 10px 0;
        }

        .keshi-stat-label {
            font-size: 14px;
            color: #cfd0d4;
        }

        .keshi-clear-data {
            margin-top: 20px;
            text-align: center;
        }
        .keshi-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    }

    .keshi-stat-item {
        display: grid;
        grid-template-columns: 250px 1fr;
        align-items: center;
        gap: 10px;
        font-size: 22px;
        padding: 12px;
        margin: 4px 0;
        border-left: 6px solid transparent;
        background: #1a1a1a;
        border-radius: 6px;
    }

    .keshi-stat-item span {
        font-weight: bold;
    }

    /* màu theo trạng thái */
    .keshi-stat-item.success {
        border-left-color: #4CAF50; /* xanh lá */
    }
    .keshi-stat-item.fail {
        border-left-color: #f44336; /* đỏ */
    }
    .keshi-stat-item.register {
        border-left-color: #ffffff; /* trắng */
    }
    .keshi-modal-content {
        background: #16213e;
        border-radius: 10px;
        padding: 20px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    }
    .keshi-detail-miner {
        display: flex;
        justify-content: space-between;
        padding: 15px;
    }

    .keshi-modal-header {
        font-size: 18px;
        font-weight: bold;
        color: #4ecca3;
        margin-bottom: 15px;
        text-align: center;
    }

    .keshi-character-info {
        display: flex;
        margin-bottom: 20px;
        align-items: center;
    }

    .keshi-character-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 15px;
        border: 3px solid #4ecca3;
    }

    .keshi-character-details {
        flex: 1;
    }

    .keshi-character-name {
        font-size: 16px;
        font-weight: bold;
        color: white;
        margin-bottom: 5px;
    }

    .keshi-character-guild {
        font-size: 14px;
        color: #cfd0d4;
        margin-bottom: 5px;
    }

    .keshi-character-id {
        font-size: 14px;
        color: #cfd0d4;
    }

    .keshi-modal-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .keshi-loading {
        text-align: center;
        padding: 20px;
        color: #4ecca3;
    }

    .battle-detail {

    }
    `);
    const RARE = {
        4: { name: '🔥 Truyền Thuyết', src: '/assets/img/level/icon/mine/4.png',color: '#ff0000' },
        3: { name: '📜 Sử Thi', src: '/assets/img/level/icon/mine/3.png', color: '#c700ff' },
        2: { name: '🛡️ Hiếm', src: '/assets/img/level/icon/mine/2.png', color: '#0099ff' },
        1: { name: '⚔️ Thường', src: '/assets/img/level/icon/mine/1.png', color: '#666666' },
    };

    const ACTION = {
        attack: { name: "Tấn công"},
        isAttacked: { name: "Bị tấn công"},
        buy: { name: "Mua"},
        read: { name: "Đọc truyện"},
        sign: { name: "Tham gia"},
        donate: { name: "Cống"},
    }

    const COLOR_CODE = {
        success: {color: "#4CAF50"},
        fail: {color: "#f44336"},
        register: {color: "#ffffff"},
    }

    const waitForGameKeys = (timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                const scripts = document.getElementsByTagName('script');
                for (const script of scripts) {
                    const player_id = script.textContent.match(/my_character\s*=\s*['"]?(\d+)['"]?/);
                    const token_user = script.textContent.match(/token_user\s*=\s*['"]?(\d+)['"]?/);
                    const token_character = script.textContent.match(/token_character\s*=\s*['"]?([a-zA-Z0-9]+)['"]?/);
                    if (player_id && token_character) {
                        return resolve({
                            player_id: parseInt(player_id[1], 10),
                            token_character: token_character[1],
                            token_user: parseInt(token_user[1], 10),
                        });
                    }
                }

                if (Date.now() - start > timeout) {
                    return reject("Không tìm thấy thông tin player/token trong thời gian cho phép.");
                }

                setTimeout(check, 200);
            };
            check();
        });
    };

    const getTime = (time) => {
        const options = {
            timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return time.toLocaleString('vi-VN', options)
    }

    function deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== "object") {
                    target[key] = {};
                }
                deepMerge(target[key], source[key])
            } else {
                target[key] = source[key]
            }
        }
        return target;
    }

    class MinerUI {
        constructor() {
            if (!window.MiningManager) {
                let _targets = [];
                window.MiningManager = {
                    get targets() {
                        return _targets;
                    },
                    set targets(val) {
                        _targets = val;
                        //console.log("[MiningManager] cập nhật targets:", _targets);
                        if (window.minerUIInstance) {
                            window.minerUIInstance.renderMiningList();
                        }
                    },
                    me: []
                };
            }

            if (!window.SManager) {
                window.SManager = {
                    save(key, data) {
                        try {
                            localStorage.setItem(`keshi_miner_${key}`, JSON.stringify(data));
                            return true;
                        } catch (e) {
                            console.error('Lỗi khi lưu dữ liệu:', e);
                            return false;
                        }
                    },
                    load(key) {
                        try {
                            const data = localStorage.getItem(`keshi_miner_${key}`);
                            return data ? JSON.parse(data) : null;
                        } catch (e) {
                            console.error('Lỗi khi tải dữ liệu:', e);
                            return null;
                        }
                    },
                    remove(key) {
                        try {
                            localStorage.removeItem(`keshi_miner_${key}`);
                            return true;
                        } catch (e) {
                            console.error('Lỗi khi xóa dữ liệu:', e);
                            return false;
                        }
                    }
                };
            }

            if (!window.AccountManager) {
                let _accounts = window.SManager.load("accounts") ?? [];
                /*
                account: {
                     info: {id, name, level, guild, legendary},
                     activity: {
                          daily: {dungeon: {turn: ?? / max_turn}, dragon_tomb: {sign_at, total: 10000}, word: {event: ??/3, total_sign: ??/20, repair: ,detail_turn: [{time: {start_at, end_at}, treasure: {gold, item:[]}, repair:{fee} }], legendary, guild_transport: {sign_at, upgrade, total},treasure_find: {turn: ??/max_turn, detail: {turn_1: {sign_at}, turn_2: {}}} },
                          weekly: {battle_doa, pet_champion, battle_champion, black_prison, guild_battle}
                     },
                     mine: {}
                }
                */
                window.AccountManager = {
                    accounts: _accounts,
                    get accounts() {
                        return _accounts;
                    },
                    loadAccounts() {
                        const accountsSaved = window.SManager.load("acccounts") ?? [];
                        if (Array.isArray(accountsSaved)) _accounts = accountsSaved;
                        return _accounts;
                    },
                    addAccount(account) {
                        const exists = _accounts.some(acc => acc.info?.id === account?.info?.id);
                        if (!exists) {
                            _accounts.push(account);
                            this.save();
                        }
                        return null
                    },
                    updateAccount(account_id, field_update={}) {
                        const idx = _accounts.findIndex(acc => acc.info?.id === account_id)
                        if (idx===-1) {
                            console.warn(`[AccountManager] Account ${account_id} not found`);
                            return null;
                        }
                        _accounts[idx] = deepMerge(_accounts[idx], field_update)
                        this.save();
                        return _accounts[idx]
                    },
                    removeAccount(account_id) {
                        const before = _accounts.length;
                        _accounts = _accounts.filter(acc => acc.info?.id !== account_id);
                        if (_accounts.length < before) {
                            this.save();
                            return true;
                        }
                        return true;
                    },
                    save() {
                        window.SManager.save("accounts", _accounts);
                        return true;
                    }
                }
            }

            if (!window.TargetManager) {
                const baseManager = {
                    targets: [],
                    loadTargets() {
                        const saved = window.SManager.load("targets");
                        this.targets = saved || [];
                        console.log("load target from localStorage")
                        return this.targets;
                    },
                    saveTargets() {
                        return window.SManager.save("targets", this.targets);
                    },
                    updateProcess(target_id) {
                        const target = this.targets.find(t => t.id == target_id)
                        if (!target) return false;
                        target.processing = !target.processing;
                        this.saveTargets();
                        return target.processing;
                    },
                    addTarget(target) {
                        if (this.targets.some(t => t.id === target.id)) return false;
                        target.addedAt = new Date().toISOString();
                        this.targets.push(target);
                        return this.saveTargets();
                    },
                    removeTarget(targetId) {
                        this.targets = this.targets.filter(t => t.id !== targetId);
                        return this.saveTargets();
                    },
                    clearAllTargets() {
                        this.targets = [];
                        return this.saveTargets();
                    }
                }
                window.TargetManager = new Proxy(baseManager, {
                    set(target, prop, value) {
                        if (prop === "targets") {
                            const old = target[prop];
                            if (JSON.stringify(old) !== JSON.stringify(value)){
                                target[prop] = value;
                                //console.log("[TargetManager] targets thay đổi:", value);
                                target.saveTargets();

                                if (window.autoMiner) window.autoMiner.init();
                                if (window.minerUIInstance) window.minerUIInstance.renderTargetList();
                            }
                        }
                        target[prop] = value;
                        return true;
                    }
                })
            }

            if (!window.StatsManager) {
                let _stats = window.SManager.load("stats") ?? {};
                const todayKey = getTime(new Date()).split(" ")[1];
                _stats[todayKey] ??= [];
                window.StatsManager = {
                    get stats() { return _stats; },
                    set stats(val) {
                        if (val && typeof val === 'object') {
                            _stats = val;
                            window.SManager.save('stats', _stats);
                            if (window.minerUIInstance && typeof window.minerUIInstance.updateStatsDisplay === 'function') {
                                window.minerUIInstance.updateStatsDisplay();
                            }
                        } else {
                            console.error("StatsManager: stats phải là object theo ngày");
                        }
                    },
                    loadStats() {
                        const saved = window.SManager.load('stats');
                        if (saved && typeof saved === 'object') _stats = saved;
                        return _stats;
                    },
                    getToday() {
                        const statDate = getTime(new Date()).split(' ')[1]
                        return this.get(statDate)
                    },
                    add(stat) {
                        //stat {time, action, map, detail, target, status, other, }
                        if(!stat || typeof stat !== 'object' || !stat.time) {
                            alert("Lỗi dữ liệu đầu vào")
                            return false
                        };
                        // Check phạm vi thời gian (không quá 10 phút trước và không vượt tương lai)
                        if ((new Date().getTime() - stat.time > 10 * 60 * 1000) || stat?.time > new Date().getTime()) {
                            alert("Thời gian không thuộc phạm vi cho phép")
                            return false;
                        }
                        const statDate = getTime(new Date(stat.time)).split(' ')[1]
                        //test
                        if (!_stats[statDate]) {
                            _stats[statDate] = [];
                        }

                        _stats[statDate].push(stat)
                        window.SManager.save("stats", _stats)
                        console.log("Đã lưu thành công 1 stat mới:::", stat);
                        console.log(window.StatsManager.loadStats())
                        if (window.minerUIInstance && typeof window.minerUIInstance.updateStatsDisplay === 'function') {
                            window.minerUIInstance.updateStatsDisplay(stat);
                        }
                        return true
                    },
                    get(dateKey) {
                        return _stats[dateKey] || null;
                    }
                };
                window.SManager.save("stats", _stats);
            }

            this.miningManager = window.MiningManager;
            this.targetManager = window.TargetManager;
            this.statManager = window.StatsManager;
            this.accountManager = window.AccountManager;
            window.minerUIInstance = this;

            // Tạo container UI
            this.minerUI = document.createElement('div');
            this.minerUI.className = 'keshi-miner-ui';
            document.body.appendChild(this.minerUI);

            this.initUI();
            //console.log("DEBUG StorageManager:", window.StorageManager);
            //console.log("DEBUG typeof load:", typeof window.StorageManager.load);

            this.targetManager.loadTargets();
            this.statManager.loadStats();
            this.statManager.getToday();

            this.renderTargetList();
            this.renderMiningList();
            this.renderStatsList({ mode: "all" });
            this.renderStatsList({ mode: "today" });
            this.renderCloneList();

        }

        initUI() {
            this.minerUI.innerHTML = `
            <button class="keshi-miner-button" id="keshiMinerToggle">Tool</button>
            <div class="keshi-miner-menu" id="keshiMinerMenu">
                <div class="keshi-tabs">
                    <div class="keshi-tab active" data-tab="status">Trang thái</div>
                    <div class="keshi-tab" data-tab="dig">Dí khoáng</div>
                    <div class="keshi-tab" data-tab="clone">Clone</div>
                    <div class="keshi-tab" data-tab="stats">Thống kê</div>
                    <div class="keshi-tab" data-tab="settings">Cài đặt</div>
                </div>

                <div class="keshi-tab-content">
                    <div class="keshi-tab-pane" id="keshi-status-pane">
                        <div class="keshi-sub-tabs">
                            <div class="keshi-sub-tab active" data-subtab="activity">Hoạt động</div>
                            <div class="keshi-sub-tab" data-subtab="word">Cửu giới</div>
                            <div class="keshi-sub-tab" data-subtab="mine">Khoáng</div>
                        </div>

                        <div class="keshi-sub-tab-content">
                            <div class="keshi-tab-pane active" id="keshi-activity-pane">
                                <div class="keshi-miner-list" id="keshi-activity-list"></div>
                            </div>

                            <div class="keshi-tab-pane" id="keshi-word-pane">
                                <div class="keshi-miner-list" id="keshi-word-list"></div>
                            </div>

                            <div class="keshi-tab-pane" id="keshi-mine-pane">
                                <div class="keshi-miner-list" id="keshi-mine-list"></div>
                            </div>
                        </div>
                    </div>
                    <div class="keshi-tab-pane" id="keshi-clone-pane">
                        <div class="keshi-sub-tabs">
                            <div class="keshi-sub-tab active" data-subtab="clone-accounts">List account</div>
                            <div class="keshi-sub-tab " data-subtab="clone-status">Status</div>
                            <div class="keshi-sub-tab" data-subtab="clone-mine">Khoáng</div>
                        </div>
                        <div class="keshi-sub-tab-content">
                            <div class="keshi-tab-pane active" id="keshi-clone-accounts-pane">
                                <div class="keshi-form-group">
                                    <label for="keshiCloneId">ID:</label>
                                    <input type="text" id="keshiCloneId" placeholder="Nhập ID clone">
                                </div>
                                <button class="keshi-btn keshi-btn-primary" id="keshiAddClone">Thêm clone</button>

                                <div class="keshi-target-list" id="keshi-clone-list"></div>
                            </div>

                            <div class="keshi-tab-pane" id="keshi-clone-status-pane">
                                <div class="keshi-miner-list" id="keshi-clone-status"></div>
                            </div>
                            <div class="keshi-tab-pane" id="keshi-clone-mine-pane">
                                <div class="keshi-miner-list" id="keshi-clone-mine"></div>
                            </div>
                        </div>
                    </div>
                    <div class="keshi-tab-pane active" id="keshi-dig-pane">
                        <div class="keshi-sub-tabs">
                            <div class="keshi-sub-tab active" data-subtab="setting">Mục tiêu</div>
                            <div class="keshi-sub-tab" data-subtab="miner">Khoáng</div>
                        </div>

                        <div class="keshi-sub-tab-content">
                            <div class="keshi-tab-pane active" id="keshi-setting-pane">
                                <div class="keshi-form-group">
                                    <label for="keshiTargetId">ID:</label>
                                    <input type="text" id="keshiTargetId" placeholder="Nhập ID">
                                </div>
                                <div class="keshi-form-group">
                                    <label for="keshiTargetNickname">Biệt danh:</label>
                                    <input type="text" id="keshiTargetNickname" placeholder="Nhập biệt danh">
                                </div>
                                <div class="keshi-form-group">
                                    <label for="keshiTargetMode">Chế độ:</label>
                                    <select id="keshiTargetMode">
                                        <option value="UntilDead">Dí đến chết</option>
                                        <option value="Once">Dí 1 lần</option>
                                    </select>
                                </div>
                                <div class="keshi-form-group">
                                    <label for="keshiTargetLimit">Giới hạn dí:</label>
                                    <input type="number" id="keshiTargetLimit" placeholder="Số lượt tối đa trong ngày...(Mặc định k giới hạn) min="1" step="1"">
                                </div>
                                <button class="keshi-btn keshi-btn-primary" id="keshiAddTarget">Thêm mục tiêu</button>

                                <div class="keshi-target-list" id="keshiTargetList"></div>
                            </div>

                            <div class="keshi-tab-pane" id="keshi-miner-pane">
                                <div class="keshi-miner-list" id="keshiMinerList"></div>
                            </div>
                        </div>
                    </div>

                    <div class="keshi-tab-pane" id="keshi-stats-pane">
                        <div class="keshi-sub-tabs">
                            <div class="keshi-sub-tab active" data-subtab="today">Hôm nay</div>
                            <div class="keshi-sub-tab" data-subtab="all">Toàn bộ</div>
                        </div>

                        <div class="keshi-sub-tab-content">
                            <div class="keshi-tab-pane active" id="keshi-today-pane">
                                <div class="keshi-target-list" id="keshi-stat-today"></div>
                            </div>

                            <div class="keshi-tab-pane" id="keshi-all-pane">
                                <div class="keshi-miner-list" id="keshi-stat-all"></div>
                            </div>
                        </div>
                    </div>

                    <div class="keshi-tab-pane" id="keshi-settings-pane">
                        <div class="keshi-sub-tabs">
                            <div class="keshi-sub-tab active" data-subtab="mine">Khoáng</div>
                            <div class="keshi-sub-tab" data-subtab="activity">Hoạt động</div>
                        </div>

                        <div class="keshi-sub-tab-content">
                            <div class="keshi-tab-pane active" id="keshi-mine-pane">
                            </div>

                            <div class="keshi-tab-pane" id="keshi-acitivity-pane">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal xác nhận thêm mục tiêu -->
            <div class="keshi-modal" id="keshiConfirmModal" style="display: none;">
                <div class="keshi-modal-content">
                    <div class="keshi-modal-header">Xác nhận thêm mục tiêu</div>
                    <div id="keshiCharacterInfo"><div class="keshi-loading">Đang tải thông tin...</div></div>
                    <div class="keshi-modal-actions">
                        <button class="keshi-btn keshi-btn-primary" id="keshiConfirmAdd">Thêm</button>
                        <button class="keshi-btn keshi-btn-danger" id="keshiCancelAdd">Hủy</button>
                    </div>
                </div>
           </div>
        `;

            this.setupEventListeners();
        }

        setupEventListeners() {
            const minerToggle = this.minerUI.querySelector('#keshiMinerToggle');
            const minerMenu = this.minerUI.querySelector('#keshiMinerMenu');

            // Toggle menu
            minerToggle.addEventListener('click', e => {
                e.stopPropagation();
                minerMenu.classList.toggle('active');
            });

            // Close menu if clicked outside
            document.addEventListener('click', e => {
                if (!this.minerUI.contains(e.target)) minerMenu.classList.remove('active');
            });

            // Tabs chính
            this.minerUI.querySelectorAll('.keshi-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    this.minerUI.querySelectorAll('.keshi-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    this.minerUI.querySelectorAll('.keshi-tab-pane').forEach(p => p.classList.remove('active'));
                    const tabId = tab.dataset.tab;
                    const tabPane = this.minerUI.querySelector(`#keshi-${tabId}-pane`);
                    tabPane.classList.add('active');

                    const firstSubTab = tabPane.querySelector('.keshi-sub-tab.active') || tabPane.querySelector('.keshi-sub-tab');
                    if (firstSubTab) firstSubTab.click();
                });
            });

            // Sub-tabs
            this.minerUI.querySelectorAll('.keshi-sub-tab').forEach(subTab => {
                subTab.addEventListener('click', () => {
                    // bỏ active khỏi tất cả subtab
                    this.minerUI.querySelectorAll('.keshi-sub-tab').forEach(t => t.classList.remove('active'));
                    subTab.classList.add('active');

                    // bỏ active khỏi tất cả pane trong cùng cha
                    const parentContent = subTab.closest('.keshi-tab-pane').querySelector('.keshi-sub-tab-content');
                    parentContent.querySelectorAll('.keshi-tab-pane').forEach(p => p.classList.remove('active'));

                    // active pane đúng theo data-subtab
                    const subtabId = subTab.dataset.subtab;
                    const targetPane = parentContent.querySelector(`#keshi-${subtabId}-pane`);
                    if (targetPane) targetPane.classList.add('active');
                });
            });
            // Sau khi setupEventListeners
            // Tìm tab đang active và trigger click
            const activeTab = this.minerUI.querySelector('.keshi-tab.active');
            if (activeTab) activeTab.click();

            // Với subtab cũng vậy
            const activeSubTab = this.minerUI.querySelector('.keshi-sub-tab.active');
            if (activeSubTab) activeSubTab.click();

            // Thêm mục tiêu
            this.minerUI.querySelector('#keshiAddTarget').addEventListener('click', () => this.handleAddTarget());

            this.minerUI.querySelector('#keshiAddClone').addEventListener('click', () => this.handleAddClone());
        }

        renderTargetList() {
            //console.log(this.targetManager.targets)
            const targetList = this.minerUI.querySelector('#keshiTargetList');
            targetList.innerHTML = '';

            if (!this.targetManager.targets.length) {
                targetList.innerHTML = '<p>Chưa có mục tiêu nào. Hãy thêm mục tiêu mới.</p>';
                return;
            }

            this.targetManager.targets.forEach(target => {
                const targetElement = document.createElement('div');
                targetElement.className = 'keshi-target-item';
                targetElement.innerHTML = `
                <div class="keshi-target-info">
                    <div><strong>ID:</strong> ${target.id}</div>
                    <div><strong>Tên:</strong> ${target.name}</div>
                    <div><strong>Biệt danh:</strong> ${target.nickname || 'N/A'}</div>
                    <div><strong>Chế độ:</strong> ${target.mode == "UntilDead" ? "Dí đến chết" : "Đấm 1 lần"}</div>
                    <div><strong>Trạng thái:</strong> ${target.processing ? "Đang dí" : "Đã dừng"}</div>
                </div>
                <div class="keshi-target-actions">
                    <button class="keshi-btn keshi-btn-danger" data-id="${target.id}">Xóa</button>
                </div>
            `;
                targetElement.querySelector('.keshi-btn-danger').addEventListener('click', () => {
                    if (confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
                        this.targetManager.removeTarget(target.id);
                        this.renderTargetList();
                    }
                });

                targetList.appendChild(targetElement);
            });
        }

        renderMiningList() {
            const minerList = this.minerUI.querySelector('#keshiMinerList');
            minerList.innerHTML = '';

            if(!this.targetManager.targets.length) {
                minerList.innerHTML = '<p>Chưa có mục tiêu nào.</p>';
                return;
            }
            if (!this.miningManager.targets.length) {
                minerList.innerHTML = '<p>Đang tải dữ liệu</p>';
                return;
            }

            this.miningManager.targets.forEach(target => {
                const minerItem = document.createElement('div');
                minerItem.className = 'keshi-miner-item';
                minerItem.dataset.targetId = target.id;

                minerItem.innerHTML = `
                <div class="keshi-miner-header">
                    <div style="display: flex; align-items: center;">
                        <img src="${target?.avatar}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;" onerror="this.src='https://via.placeholder.com/40'">
                        <div>
                            <div><strong>${target?.name}</strong></div>
                            <div>ID: ${target.id}</div>
                        </div>
                    </div>
                    <span class="keshi-miner-status" data-status="idle">${target.processing ? "Đang tiến hành" : "Chưa bắt đầu"}</span>
                </div>
                <div class="keshi-miner-details">
                    <div><strong>Guild:</strong> ${target?.guild || 'N/A'}</div>
                    <div><strong>Biệt danh:</strong> ${target?.nickname || 'N/A'}</div>
                    <div><strong>Chế độ:</strong> ${target.mode}</div>
                    <div><strong>Lần cuối dí:</strong> <span class="keshi-last-mined">Chưa có</span></div>
                </div>
                <hr>
                <div class="">
                    <div class="keshi-detail-miner"><strong>Số lượt còn lại:</strong>${target?.energy?.current}</div>
                    <div class="keshi-detail-miner"><strong>Lần thêm lượt tiếp theo lúc:</strong>${new Date(target?.energy?.next_energy * 1000 ).toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh"})}</div>
                    <div class="keshi-detail-miner"><strong>Trạng thái khoáng:</strong> ${target?.miner ? '<span style="font-size:18px;">🟢Đang đào khoáng</span>' : '<span style="font-size:18px;">🔴Off</span>'}</div>
                    ${target?.miner ? `
                    <div class="keshi-detail-miner"><strong>Đang ngồi khoáng ở tầng:</strong> ${target?.miner?.area || 'N/A'}</div>
                    <div class="keshi-detail-miner"><strong>Rare:</strong> ${RARE[target?.miner?.rare]?.name}</div>
                    <div class="keshi-detail-miner"><strong>Thời gian:</strong> <span class="keshi-last-mined">Chưa có</span></div>
                    <div class="keshi-detail-miner"><strong>Mine id:</strong> ${target?.miner?.mine_id || 'N/A'}</div>
                    <div class="keshi-detail-miner"><strong>Dùng khiên:</strong> ${target?.miner?.isProtect ? "Có khiên" : "Không"}</div>
                    ` : ''}
                </div>
                <div class="keshi-mining-controls" style="margin-top: 10px;">
                    <button class="keshi-btn keshi-btn-${target.processing ? "danger" : "primary"} keshi-start-mining" data-target-color = {}  data-target-id="${target.id}">${target.processing ? "Dừng lại" : "Bắt đầu"}</button>
                </div>
                <div class="keshi-mining-results" style="margin-top: 10px; display: none;">
                    <div class="keshi-mining-stats">
                        <span class="keshi-stat-success">Thành công: 0</span>
                        <span class="keshi-stat-fail">Thất bại: 0</span>
                    </div>
                </div>
            `;

                minerList.appendChild(minerItem);
                const button = minerItem.querySelector(".keshi-start-mining");
               button.addEventListener("click", () => {
                   const targetId = button.dataset.targetId;
                   const newProcessingState = window.TargetManager.updateProcess(targetId);
                   button.textContent = newProcessingState ? "Dừng lại" : "Bắt đầu";
                   button.classList.remove('keshi-btn-danger', 'keshi-btn-primary');
                   button.classList.add(`keshi-btn-${newProcessingState ? "danger" : "primary"}`);

                   // Cập nhật cả trạng thái hiển thị
                   const statusSpan = minerItem.querySelector('.keshi-miner-status');
                   statusSpan.textContent = newProcessingState ? "Đang tiến hành" : "Chưa bắt đầu";
                   statusSpan.dataset.status = newProcessingState ? "processing" : "idle";
               });
            });
        }

        renderCloneList() {
            const cloneList = this.minerUI.querySelector('#keshi-clone-list');
            cloneList.innerHTML = '';
            //console.log("Render clone list:", this.accountManager.accounts)

            if (!this.accountManager.accounts.length) {
                cloneList.innerHTML = '<p>Chưa có clone nào. Hãy thêm clone mới.</p>';
                return;
            }

            this.accountManager.accounts.forEach(account => {
                const accountElement = document.createElement('div');
                accountElement.className = 'keshi-target-item';
                accountElement.innerHTML = `
                <div class="keshi-target-info">
                    <div><strong>ID:</strong> ${account.id}</div>
                    <div><strong>Tên:</strong> ${account.name}</div>
                    <div><strong>Tên:</strong> ${account.guild}</div>
                </div>
                <div class="keshi-target-actions">
                    <button class="keshi-btn keshi-btn-danger" data-id="${target.id}">Xóa</button>
                </div>
            `;
                accountElement.querySelector('.keshi-btn-danger').addEventListener('click', () => {
                    if (confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
                        this.accountManager.removeAccount(target.id);
                        this.renderCloneList();
                    }
                });

                cloneList.appendChild(accountElement);
            });
        }

        renderDetailCloneList() {
            const detailCloneList = this.minerUI.querySelector('#keshi-detail-clone-list');
            detailCloneList.innerHTML = '';
            const accounts = this.accountManager.accounts;
            if (!accounts || !accounts.length) {
                detailCloneList.innerHTML = '<div class="keshi-stat-item"><div><span>Chưa có dữ liệu</span></div></div>';
                return;
            }
            accounts.forEach(account => {
                const {info = {}, activity = {}} = account;
                const {id, name, level, guild, legendary} = info;
                const daily = activity?.daily || {};

            })
        }

        generateLogMessage(stat) {
            if (!stat) {
                return `
                    <div class="keshi-stat-item ">
                        <div><span>Chưa có dữ liệu</span></div>
                    </div>
                `;
            }
            let message = "";
            const time = getTime( new Date(stat?.time));
            const timeSpan = `<div class="time">${time}</div>`;
            // class mặc định
            let statusClass = "";

            switch (stat.action) {
                case 'attack':
                case 'isAttacked': {
                    statusClass = (stat.action === "attack") === (stat.detail.success) ? "success" : "fail"
                    const targetText = stat.detail.target ? `<span>${stat.detail.target.name} ID ${stat.detail.target.id}</span>` : "";
                    const detailText = stat.detail ? `<a class="detail" onclick="battle_id = ${stat.detail.battle_id};frame_load('battle');"> &lt;Chi tiết: <span>Chiến báo ${stat.detail.battle_id}</span>&gt;</a>` : '';

                    if (stat.action === 'attack') {
                        message = `Bạn đã <span style="color: ${COLOR_CODE[statusClass].color}"> ${statusClass === "success" ? "tiêu diệt" : "thất bại khi tấn công"}</span> ${targetText} trong ${stat.detail.map}.${detailText}`;
                    } else if (stat.action === "isAttacked") {
                        message = `Bạn đã <span style="color: ${COLOR_CODE[statusClass].color}"> ${statusClass === "success" ? "bị tiêu diệt" : "bị tấn công"}</span> bởi ${targetText} trong ${stat.detail.map}.${detailText}`;
                        statusClass = stat.detail.success ? "fail" : "success";
                    }
                    break;
                }
                case 'buy': {
                    const quantity = stat.detail?.quantity || 0;
                    const itemName = stat.detail?.item || 'vật phẩm';
                    const price = stat.detail?.price || 0;
                    message = `Bạn đã mua ${quantity} ${itemName} với giá ${price}lt.`;
                    statusClass = "register"; // ví dụ coi như giao dịch thành công
                    break;
                }
                case 'read': {
                    message = `Bạn đã ${ACTION[stat.action]} ${stat.detail}`;
                    statusClass = "register";
                    break;
                }
                default: {
                    message = `Bạn đã ${ACTION[stat.action]} ${stat.other || ''}`;
                    statusClass = "register";
                    break;
                }
            }
            //console.log(message)

            return `
        <div class="keshi-stat-item ${statusClass}">
            <div><span>${timeSpan}</span></div>
            <div class="flex">${message}</div>
        </div>
    `;
        }
        generateDayBlock(date, statArray) {
            const sortedStats = [...statArray].sort((a, b) => b.time - a.time); // sắp xếp mới → cũ
            return `
              <div class="keshi-stat-day" data-date="${date}">
                <h3>Nhật ký ngày ${date}</h3>
                ${statArray?.length ? sortedStats.map(stat => this.generateLogMessage(stat)).join("") : "Chưa có dữ liệu gì về ngày hôm nay"}
                <hr>
              </div>
            `;
        }
        parseDDMMYYYY(dateStr) {
            const [day, month, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day);
        }

        renderStatsList({ mode = "all" } = {}) {
            let container;
            if (mode === "all") {
                container = this.minerUI.querySelector('#keshi-stat-all');
            } else if (mode === "today") {
                container = this.minerUI.querySelector('#keshi-stat-today');
            } else {
                console.error("Sai mode:", mode);
                return;
            }
            //console.log("mode",mode)

            if (!container) {
                console.error("Không tìm thấy container để render:", mode);
                return;
            }

            container.innerHTML = '';

            const stats = (mode === "all") ? this.statManager.stats : this.statManager.getToday();
            /*if (!stats || Object.keys(stats).length === 0) {
                container.innerHTML = '<p>Chưa có thông tin nào.</p>';
                return;
            }*/

            let html = '';

           if (mode === "all") {
               // render tất cả ngày, mới → cũ
               html = Object.entries(stats)
                   .sort(([dateA], [dateB]) => this.parseDDMMYYYY(dateB) - this.parseDDMMYYYY(dateA))
                   .map(([date, statArray]) => this.generateDayBlock(date, statArray))
                   .join("");
           } else {
               // render chỉ hôm nay
               const todayKey = getTime(new Date()).split(" ")[1];
               html = this.generateDayBlock(todayKey, stats);
           }

            container.innerHTML = html;
        }

        updateStatsDisplay(stat) {
            if (!stat) return;
            const newItemHTML = this.generateLogMessage(stat);
            const todayKey = getTime(new Date(stat.time)).split(" ")[1];

            // --- Update tab "today" ---
            const todayContainer = this.minerUI.querySelector("#keshi-stat-today");
            if (todayContainer) {
                let todayBlock = todayContainer.querySelector(`.keshi-stat-day[data-date="${todayKey}"]`);
                if (!todayBlock) {
                    todayContainer.insertAdjacentHTML("afterbegin",
                                                      `<div class="keshi-stat-day" data-date="${todayKey}">
                    <h3>Nhật ký ngày ${todayKey}</h3>
                    ${newItemHTML}
                    <hr>
                </div>`
                                                     );
                } else {
                    const h3 = todayBlock.querySelector("h3");
                    h3.insertAdjacentHTML("afterend", newItemHTML);
                }
            }

            // --- Update tab "all" ---
            const allContainer = this.minerUI.querySelector("#keshi-stat-all");
            if (allContainer) {
                let dateBlock = allContainer.querySelector(`.keshi-stat-day[data-date="${todayKey}"]`);
                if (!dateBlock) {
                    allContainer.insertAdjacentHTML("afterbegin",
                                                    `<div class="keshi-stat-day" data-date="${todayKey}">
                    <h3>Nhật ký ngày ${todayKey}</h3>
                    ${newItemHTML}
                    <hr>
                </div>`
                                                   );
                } else {
                    const h3 = dateBlock.querySelector("h3");
                    h3.insertAdjacentHTML("afterend", newItemHTML);
                }
            }
        }

        handleAddTarget() {
            const targetId = this.minerUI.querySelector('#keshiTargetId').value;
            const targetNickname = this.minerUI.querySelector('#keshiTargetNickname').value;
            const targetMode = this.minerUI.querySelector('#keshiTargetMode').value;
            const targetLimit = parseInt(this.minerUI.querySelector('#keshiTargetLimit').value) || "infinity";

            if (!targetId) return alert('Vui lòng nhập ít nhất ID!');

            if (this.targetManager.targets.some(t => t.id === targetId)) {
                return alert('ID này đã tồn tại trong danh sách!');
            }

            const confirmModal = this.minerUI.querySelector('#keshiConfirmModal');
            confirmModal.style.display = 'flex';

            fetch(`/api/get_data_by_id?table=game_character&data=info&id=${targetId}`)
                .then(res => res.json())
                .then(data => {
                const info = JSON.parse(data.info);
                const name = info.name;
                const guild = info.guild ? info.guild.name : 'Không có guild';
                const avatar = `/assets/tmp/avatar/${info.avatar}`;

                const characterInfo = this.minerUI.querySelector('#keshiCharacterInfo');
                characterInfo.innerHTML = `
                    <div class="keshi-character-info">
                        <img src="${avatar}" class="keshi-character-avatar">
                        <div>
                            <div>${info?.id}</div>
                            <div>${name}</div>
                            <div>Guild: ${guild}</div>
                        </div>
                    </div>
                    <div class="keshi-form-group">
                        <label>Biệt danh:</label>
                        <input type="text" id="keshiConfirmNickname" value="${targetNickname || ''}">
                    </div>
                    <div class="keshi-form-group">
                        <label>Chế độ:</label>
                        <select id="keshiConfirmMode">
                            <option value="UntilDead" ${targetMode === 'UntilDead' ? 'selected' : ''}>Dí đến chết</option>
                            <option value="Once" ${targetMode === 'Once' ? 'selected' : ''}>Dí 1 lần</option>
                        </select>
                    </div>
                    <div class="keshi-form-group">
                        <label>Giới hạn dí mỗi ngày:</label>
                        <input type="text" id="keshiConfirmNickname" value="${targetLimit || ''}">
                    </div>
                `;

                // Xác nhận thêm
                this.minerUI.querySelector('#keshiConfirmAdd').onclick = async () => {
                    const confirmedNickname = this.minerUI.querySelector('#keshiConfirmNickname').value;
                    const confirmedMode = this.minerUI.querySelector('#keshiConfirmMode').value;

                    const newTarget = { id: targetId, name, nickname: confirmedNickname, mode: confirmedMode, guild, avatar };
                    this.targetManager.addTarget(newTarget);
                    this.renderTargetList();
                    confirmModal.style.display = 'none';
                    this.minerUI.querySelector('#keshiTargetId').value = '';
                    this.minerUI.querySelector('#keshiTargetNickname').value = '';
                    if (window.autoMiner) {
                        console.log("⚡ Reload AutoMiner after adding target...");
                        await window.autoMiner.init();
                    }
                };

                this.minerUI.querySelector('#keshiCancelAdd').onclick = () => confirmModal.style.display = 'none';
            })
                .catch(err => console.error('Lỗi khi lấy thông tin nhân vật:', err));
        }

        handleAddClone() {
            const cloneId = this.minerUI.querySelector('#keshiCloneId').value;

            if (!cloneId) return alert('Vui lòng nhập ít nhất ID!');

            if (this.accountManager.accounts.some(t => t.id === cloneId)) {
                return alert('ID này đã tồn tại trong danh sách!');
            }
            const confirmModal = this.minerUI.querySelector('#keshiConfirmModal');
            confirmModal.style.display = 'flex';

            fetch(`/api/get_data_by_id?table=game_character&data=info&id=${cloneId}`)
                .then(res => res.json())
                .then(data => {
                const info = JSON.parse(data.info);
                const name = info.name;
                const guild = info.guild ? info.guild.name : 'Không có guild';
                const avatar = `/assets/tmp/avatar/${info.avatar}`;
                                const characterInfo = this.minerUI.querySelector('#keshiCharacterInfo');
                characterInfo.innerHTML = `
                    <div class="keshi-character-info">
                        <img src="${avatar}" class="keshi-character-avatar">
                        <div>
                            <div>${info?.id}</div>
                            <div>${name}</div>
                            <div>Guild: ${guild}</div>
                        </div>
                    </div>
                `;

                this.minerUI.querySelector('#keshiConfirmAdd').onclick = async () => {
                    const newTarget = { info: {id: cloneId, name, guild, avatar }};
                    this.accountManager.addAccount(newTarget);
                    this.renderCloneList();
                    confirmModal.style.display = 'none';
                    this.minerUI.querySelector('#keshi-clone-id').value = '';
                    if (window.autoMiner) {
                        console.log("⚡ Reload AutoMiner after adding target...");
                        await window.autoMiner.init();
                    }
                };

                this.minerUI.querySelector('#keshiCancelAdd').onclick = () => confirmModal.style.display = 'none';
            })
                .catch(err => console.error('Lỗi khi lấy thông tin nhân vật:', err));
        }
    }

    class AutoMiner {
        constructor(targetManager, miningManager, statsManager,accountMangaer,urlConfig, diffTimeServer = 0) {
            this.TargetManager = targetManager;
            this.MiningManager = miningManager;
            this.StatsManager = statsManager;
            this.URL = urlConfig;
            this.diffTimeServer = diffTimeServer;
            this.AccountManager= accountMangaer;

            // Tự động khởi tạo khi tạo instance
            console.log("[DEBUG] StatsManager:", this.StatsManager);

            this.init();
            setInterval(() => {
                this.init();
            },5 * 60 * 1000);
        }

        async processMiner(list_target, miner, area, index) {
            try {
                if (!list_target.includes(parseInt(miner.target, 10))) return null;

                const data = JSON.parse(miner.data);
                const reward = data.miner?.reward;
                const isProtect = !!data.miner?.protect;

                if (!reward || typeof reward !== 'object' || isProtect) return null;

                return {
                    area,
                    rare: data.rare,
                    stt: index + 1,
                    mine_id: parseInt(miner.id_score, 10),
                    character_id: parseInt(miner.target, 10),
                    author: data.miner?.info?.name,
                    isProtect
                };
            } catch (e) {
                console.error(`Error processing miner: ${e}`);
                return null;
            }
        }

        async processArea(targetIds, area) {
            try {
                const url = this.URL.HMK_AREA(area);
                const response = await fetch(url);
                const miners = await response.json();

                const minersPromises = miners.map((miner, index) => this.processMiner(targetIds, miner, area, index));
                const areaResults = await Promise.all(minersPromises);
                return areaResults.filter(item => item !== null);
            } catch (e) {
                console.error(`Error processing area ${area}: ${e}`);
                GM_notification(`Lỗi khi xử lý tầng ${area}: ${e.message}`, 'Lỗi');
                return [];
            }
        }

        async getEnergy(id) {
            try {
                const url = this.URL.ENERGY(id);
                const response = await fetch(url);
                if (response.status === 200) {
                    const data = await response.json();
                    return {
                        current: data.current,
                        next_energy: data.time + this.diffTimeServer
                    };
                }
            } catch (e) {
                console.error('Lỗi khi check lượt đánh:', e);
                window.location.reload();
            }
        }

        async getHmkArea(targetIds) {
            const areas = Array.from({ length: 11 }, (_, i) => i + 1);
            const areaPromises = areas.map(area => this.processArea(targetIds, area));
            const allResults = await Promise.all(areaPromises);
            return allResults.flatMap(arr => arr);
        }

        async processBattle (mine_id) {
            try {
                const response = await fetch(
                    `/assets/ajax/character_activity.php`,
                    {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: `action=battle_mine_challenge&mine_id=${mine_id}&target=private`
                    }
                );
                //attackEndTime = Date.now();

                const responseText = await response.text();
                if (!responseText || responseText.trim() == "" ||responseText.includes("<!--empty-->")) {
                    window.location.reload()
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(responseText, "text/html");
                const scripts = doc.getElementsByTagName('script');
                let isWeak = false;
                let battle_id = null;
                let popupData = {};
                let popupDataRaw = {};
                let isSuccess = false;// trạng thái request
                let errorMessage = '';
                let battleLoaded = false;
                let status = true; //thành công hay thất bại

                for (const script of scripts) {
                    const scriptContent = script.textContent;
                    const battleIdMatch = scriptContent.match(/battle_id\s*=\s*'([^']+)'/);
                    if (battleIdMatch) {
                        battle_id = battleIdMatch[1];
                        console.log(`[DEBUG] Found battle_id: ${battle_id}`);
                    }

                    if (scriptContent.includes("alertify.success")) {
                        isSuccess = true;
                        console.log("Tấn công thành công");
                    } else if (scriptContent.includes("alertify.error")) {
                        isSuccess = false;
                        status = false;
                        const errorMatch = scriptContent.match(/alertify\.error\('([^']+)'\)/);
                        if (errorMatch) {
                            errorMessage = errorMatch[1];
                            console.log('[DEBUG] Lỗi khi khiêu chiến:', errorMessage);
                        }
                    }

                    const popupMatch = scriptContent.match(/popup_data\s*=\s*({[\s\S]*?})\s*;/);
                    if (popupMatch) {
                        try {
                            const rawData = JSON.parse(popupMatch[1]);
                            console.log('[DEBUG] Parsed popup_data:', rawData);
                            popupData = Object.fromEntries(
                                Object.entries(rawData)
                                .filter(([key]) => key !== 'gold' && key !== 'mine_ore')
                                .map(([key, value]) => {
                                    if (value && typeof value === 'object' && 'amount' in value) {
                                        return [key, value.amount];
                                    }
                                    return [key, value];
                                })
                            );
                            popupDataRaw = Object.fromEntries(
                                Object.entries(rawData)
                                .filter(([key]) => key)
                                .map(([key, value]) => {
                                    if (value && typeof value === 'object' && 'amount' in value) {
                                        return [key, value.amount];
                                    }
                                    return [key, value];
                                })
                            );
                            console.log("[processBattle] done parse popup_data");
                        } catch (e) {
                            console.error('[DEBUG] Lỗi parse popup_data:', e);
                        }
                    }
                }

                return {
                    success: isSuccess,
                    popupData: popupData,
                    popupDataRaw: popupDataRaw,
                    error: errorMessage,
                    status: status,
                    rawResponse: responseText,
                    battle_id: battle_id ? battle_id : null
                };

            } catch (error) {
                console.error('[DEBUG] Lỗi processBattle:', {
                    error: error,
                    stack: error.stack
                });
                return {
                    success: false,
                    error: error?.message || error,
                    //rawResponse: responseText
                };
            }
        };

        async autoAttack () {
            try {
                if (!this.MiningManager?.targets?.length) {
                    console.warn("[autoAttack] Không có targets để xử lý");
                    return;
                }
                //tạo khóa bảo vẹ trong trường hợp k mặc đồ  = cách check set hoặc

                for (const target of this.MiningManager.targets) {
                    if (!target.processing || !target.miner) continue;
                    const miner = target.miner;

                    const doAttack = async () => {
                        const energy = await this.getEnergy(window?.my_character);
                        if (energy.current <= 0) {
                            const wait_time =energy.next_energy  * 1000 - Date.now();
                            console.log(`[autoAttack] Hết lượt đánh, chờ thêm lượt sau ${Math.ceil(wait_time / 1000)} giây...`);
                            await new Promise(res => setTimeout(res, wait_time + 2000));
                            return doAttack();
                        }
                        console.log(`[autoAttack] Tấn công target ${target.id} - mine_id: ${miner.mine_id}`);
                        const response = await this.processBattle(miner.mine_id);

                        const stat = {
                            time: Date.now(),
                            action: "attack",
                            detail: {
                                target: {
                                    id: target.id,
                                    name: target.name,
                                    guild: target?.guild || ""
                                },
                                success: response?.status,
                                map: "Hồng mao khoáng",
                                battle_id: response?.battle_id || null,
                                error: response?.error || null
                            }
                        };

                        this.StatsManager.add(stat);
                        // Nếu thất bại và mode != Once thì lặp lại
                        if (response?.status === false && target.mode !== "Once") {
                            console.log(`[autoAttack] Attack thất bại, thử lại target ${target.id}...`)
                            await new Promise(res => setTimeout(res, 2000))
                            return doAttack()
                        }
                        return response;
                    };



                    if(miner?.isProtect === true ||(miner?.isProtect && miner.isProtect.time)) {
                        const delay = miner.isProtect.time || 5 * 60 * 1000;
                        setTimeout(async () => {
                            if(!target.processing || !target.miner) return;
                            if (!target.miner.isProtect) {
                                await doAttack()
                            } else {
                                console.log(`[autoAttack] Target ${target.id} vẫn còn bảo vệ, bỏ qua.`)
                            }
                        }, delay)
                    } else {
                        await doAttack()
                    }
                }
            } catch (e){
                console.error("[autoAttack] Lỗi:", e);
            }
        }
        async getOther(id) {
            const resposne = await fetch(this.URL.OTHER(id))
            if (resposne.status === 200) {
                const data = await resposne.jon()
                const info = JSON.parse(data?.info)
                const other = JSON.parse(data?.other)
                return {
                    info: {
                        name: info.name,
                        avatar: info.avatar,
                        id: info.id,
                        guild: info.guild.name
                    },
                    other: {
                        energy: other.energy,
                        word: other.word,
                        legendary: other.legendary,
                        ancient: other.ancient,
                        time: other.time,
                        treasure_find: other.treasure_find,
                        guild_quest: other.guild_quest,
                        donate: other.donate,
                        guild_transpot: other.guild_transpot,
                        word_daily_event: other.word_daily_event,
                        training: other.training
                    }
                }
            }
            return null
        }

        async processAccountList() {
            const accounts = this.AccountManager.accounts;
            if (!accounts || !accounts.length) {
                console.warn("[processAccountList] Không có tài khoản để xử lý");
                return;
            }

            const accountPromises = accounts.map(async (account) => {
                const characterId = account.id;
                const characterData = await this.getOther(characterId);
                account.activity.daily = {
                    dungeon: {
                        current: parseInt(characterData?.other?.energy?.current),
                        buy: parseInt(characterData?.other?.energy?.buy),
                        turn: 30 - parseInt(characterData?.other?.energy?.remain) + parseInt(characterData?.other?.energy?.buy) || 0 - parseInt(characterData?.other?.energy?.current) || 0,
                        max: parseInt(account?.activity?.daily?.dungeon?.max) || 40
                    },
                    word: {
                        event: {
                            current: parseInt(characterData?.other?.word_daily_event?.day) == new Date().getDate() ? parseInt(characterData?.other?.word_daily_event?.current) : 0,
                        },
                        total_sign: parseInt(characterData?.other?.day) == new Date().getDate() ? parseInt(characterData?.other?.word?.num) : 0,
                    },
                    guild_transport: parseInt(characterData?.other?.guild_transpot?.day) === new Date().getDate(),
                    treasure_find: {
                        current: parseInt(characterData?.other?.treasure_find?.day) === new Date().getDate() ? parseInt(characterData?.other?.treasure_find?.num) : 0,
                        max: account.activity.daily.treasure_find.max ?? 3
                    }
                };
            });
            await Promise.all(accountPromises);
        }

        async init() {
            try {
                console.log("Init data")
                this.TargetManager.loadTargets();
                console.log(this.StatsManager)
                // Xóa dữ liệu cũ
                this.MiningManager.targets = [];
                console.log("mining::::", this.MiningManager.targets)

                const targetIds = this.TargetManager.targets.map(target => parseInt(target.id, 10));
                const hmkArea = await this.getHmkArea(targetIds);

                const minersByCharacterId = {};
                hmkArea.forEach(miner => {
                    minersByCharacterId[miner.character_id] = miner;
                });
                //console.log(hmkArea)

                // Dùng map để tạo mảng mới rồi gán thẳng
                const updatedTargets = await Promise.all(this.TargetManager.targets.map(async target => {
                    const targetId = parseInt(target.id, 10);

                    // Lấy thông tin energy
                    const energy = await this.getEnergy(targetId);

                    // Kiểm tra khoáng
                    const minerInfo = minersByCharacterId[targetId] || false;

                    return {
                        ...target,
                        energy: {
                            current: energy.current,
                            next_energy: energy.next_energy
                        },
                        miner: minerInfo,
                        lastUpdated: Date.now()
                    };
                }));

                this.MiningManager.targets = updatedTargets;
                console.log("mining",this.MiningManager.targets)
                await this.autoAttack()
            } catch (e) {
                console.error('Lỗi AutoMiner init:', e);
            }
        }
    }

    window.addEventListener('load', async () => {
        try {
            const { player_id, token_character, token_user } = await waitForGameKeys();
            window.my_character = player_id;
            window.token_character = token_character;
            window.token_user = token_user;
            const minerUI = new MinerUI();
            window.autoMiner = new AutoMiner(minerUI.targetManager, minerUI.miningManager, minerUI.statManager, minerUI.accountManager,URL, diffTimeServer);
            await window.autoMiner.init();
        } catch (error) {
            console.error('Lỗi khi khởi động script:', error);
        }
    });
})();
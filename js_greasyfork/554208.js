// ==UserScript==
// @name         sorceryntax3戰鬥顯示
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  將sorceryntax3戰鬥過程圖像化顯示，新增掉落物記錄和傷害統計功能
// @match        https://sorceryntax3.onrender.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554208/sorceryntax3%E6%88%B0%E9%AC%A5%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/554208/sorceryntax3%E6%88%B0%E9%AC%A5%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ===== 工具 ===== */
    const timeNow = () => new Date().toLocaleTimeString();
    const tryParseJSON = (s) => { try { return JSON.parse(s); } catch { return null; } };
    const decodePayload = (data) => (typeof data === 'string') ? data : new TextDecoder().decode(new Uint8Array(data instanceof ArrayBuffer ? data : data.buffer || []));
    const escapeHtml = (s) => s ? s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])) : '';

    /* ===== 狀態 ===== */
    const state = {
        battles: [], // 儲存最多三次戰鬥
        currentBattleIndex: -1, // 當前顯示的戰鬥索引
        currentRoundIndex: -1, // 當前顯示的回合索引
        playing: true, // 預設為播放中狀態
        timer: null,
        playInterval: 800,
        isPaused: false, // 是否處於暫停觀看狀態
        pendingUpdates: [], // 暫存暫停期間收到的更新
        // 掉落物記錄狀態（全域累計，不隨戰鬥清除）
        dropRecords: {}, // 記錄每個玩家的掉落落物 {playerName: {items: {}, money: 0, soul: 0}}
        enableDropRecording: true, // 是否啟用掉落物記錄功能（預設開啟）
        // 傷害統計狀態（每場戰鬥獨立，包含每回合快照）
        damageStats: {} // 記錄傷害統計 {battleId: { roundIndex: { entityName: { dealt: number, taken: number, type: 'player'|'enemy' } } }}
    };

    /* ===== UI 建立 ===== */
    const createUI = () => {
        const ui = document.createElement('div');
        ui.id = 'battle-monitor';
        ui.innerHTML = `
      <div id="bm-header">
        <div id="bm-title">⚔ Battle Monitor</div>
        <div id="bm-controls">
          <button id="bm-play">⏸</button> <!-- 預設顯示暫停按鈕 -->
          <button id="bm-prev">◀</button>
          <input type="range" id="bm-progress" min="0" value="0" step="1">
          <button id="bm-next">▶</button>
          <button id="bm-clear">清除</button>
          <button id="bm-toggle">—</button>
        </div>
      </div>
      <div id="bm-main">
        <div id="bm-battle-section">
          <div id="bm-battle-selector">
            <select id="bm-battle-list">
              <option value="-1">選擇戰鬥記錄</option>
            </select>
            <span id="bm-battle-count">0/3</span>
            <span id="bm-paused-indicator" style="color: #ff9800; display: none;">⏸️ 暫停中</span>
          </div>
          <div id="bm-info">
            <div>戰鬥ID: <span id="bm-bid">—</span></div>
            <div>回合: <span id="bm-round-now">0</span>/<span id="bm-round-total">0</span></div>
            <div>事件: <span id="bm-msg">—</span></div>
          </div>
          <div id="bm-top">
            <div class="bm-side"><div class="bm-title">我方</div><div id="bm-team" class="bm-members"></div></div>
            <div class="bm-side"><div class="bm-title">敵方</div><div id="bm-enemy" class="bm-members"></div></div>
          </div>
          <div id="bm-log"><div class="bm-log-body"></div></div>
        </div>
        <!-- 掉落物記錄和傷害統計區域 -->
        <div id="bm-stats-section">
          <div id="bm-stats-tabs">
            <button class="bm-tab active" data-tab="drops">掉落物</button>
            <button class="bm-tab" data-tab="damage">傷害統計</button>
          </div>
          <!-- 掉落物記錄 -->
          <div id="bm-drops-section" class="bm-tab-content active">
            <div id="bm-drops-header">
              <label>
                <input type="checkbox" id="bm-enable-drops" ${state.enableDropRecording ? 'checked' : ''}>
                記錄掉落物
              </label>
              <button id="bm-clear-drops">清除除掉落記錄</button>
            </div>
            <div id="bm-drops-content"></div>
          </div>
          <!-- 傷害統計 -->
          <div id="bm-damage-section" class="bm-tab-content">
            <div id="bm-damage-header">
              <div>傷害統計 (至當前回合累計)</div>
            </div>
            <div id="bm-damage-content">
              <!-- 玩家家傷害統計區塊 (新增滾動功能) -->
              <div id="bm-damage-players" class="bm-damage-group">
                <div class="bm-damage-group-title">玩家</div>
                <div class="bm-damage-group-content scrollable"></div>
              </div>
              <!-- 怪物傷害統計區塊 (新增滾動功能) -->
              <div id="bm-damage-enemies" class="bm-damage-group">
                <div class="bm-damage-group-title">敵人</div>
                <div class="bm-damage-group-content scrollable"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
        document.documentElement.appendChild(ui);

        /* ===== CSS ===== */
        const css = `
      #battle-monitor {
        position: fixed; top: 10px; right: 10px;
        width: 580px; height: 500px;
        background: rgba(20,20,20,0.95); color: #eee;
        font-family: 'Segoe UI', sans-serif; font-size: 13px;
        border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        display: flex; flex-direction: column; resize: both; overflow: hidden;
        z-index: 999999;
      }
      #bm-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 6px 8px; background: rgba(40,40,40,0.9);
        cursor: move; border-bottom: 1px solid rgba(255,255,255,0.05);
        user-select: none;
      }
      #bm-controls {
        display: flex; align-items: center; gap: 5px;
      }
      #bm-controls button {
        background: transparent; color: inherit;
        border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
        cursor: pointer; padding: 4px 6px;
      }
      #bm-progress {
        flex: 1; min-width: 100px; max-width: 150px;
        background: rgba(255,255,255,0.1); border-radius: 4px;
        cursor: pointer;
      }
      #bm-battle-selector {
        display: flex; justify-content: space-between; align-items: center;
        padding: 4px 8px; background: rgba(255,255,255,0.05);
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      #bm-battle-list {
        flex: 1; background: rgba(0,0,0,0.3); color: #eee;
        border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;
        padding: 2px 4px;
      }
      #bm-battle-count {
        font-size: 11px; opacity: 0.7; margin-left: 8px;
      }

      /* 主要佈局樣式 */
#bm-main {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-height: 0;
}
#bm-battle-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
#bm-info {
  display: flex;
  justify-content: space-around;
  padding: 4px;
  background: rgba(255,255,255,0.05);
  overflow-y: auto;
  max-height: 30px;
  min-height: 0;
  flex-shrink: 0;
}
#bm-top {
  display: flex;
  gap: 6px;
  padding: 6px;
  flex-shrink: 0;
  height: 40%; /* 固定高度 */
  min-height: 150px; /* 最小高度 */
  overflow-y: auto; /* 內容超出時顯示垂直滾動條 */
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  margin: 4px;
}
.bm-side {
  flex: 1;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  padding: 3px;
  overflow: hidden;
}
.bm-title { font-weight: bold; margin-bottom: 4px; }
.bm-members {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 90%;
  overflow-y: auto;
}
.bm-member { display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.15); padding: 4px 6px; border-radius: 6px; }
.bm-name { min-width: 60px; font-weight: 600; }
.bm-hpbar { flex: 1; height: 10px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; overflow: hidden; }
.bm-fill { height: 100%; transition: width 0.3s ease; }
.bm-dead { opacity: 0.4; text-decoration: line-through; }
#bm-log {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px;
  background: rgba(255,255,255,0.02);
  font-family: monospace;
  font-size: 12px;
  height: 40%;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  margin: 4px;
}
      .bm-log-line { border-bottom: 1px dashed rgba(255,255,255,0.05); padding: 2px 0; }
      .bm-flash { animation: flash 0.6s ease; }
      @keyframes flash { 0%{background:#555;} 100%{background:transparent;} }
      #battle-monitor.collapsed #bm-main { display: none; }
      #battle-monitor.collapsed { height: auto !important; }
      #battle-monitor.collapsed #bm-header { border-bottom: none; }

      /* 統計區域樣式 */
      #bm-stats-section {
        border-top: 1px solid rgba(255,255,255,0.1);
        background: rgba(0,0,0,0.2);
        flex: 0 0 30%;
        min-height: 100px;
        max-height: none;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      #bm-stats-tabs {
        display: flex;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .bm-tab {
        flex: 1;
        background: transparent;
        border: none;
        color: #eee;
        padding: 4px 0;
        cursor: pointer;
        font-size: 12px;
      }
      .bm-tab.active {
        background: rgba(255,255,255,0.1);
        border-bottom: 2px solid #4caf50;
      }
      .bm-tab-content {
        display: none;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }
      .bm-tab-content.active {
        display: flex;
      }

      /* 掉落物樣式 */
      #bm-drops-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 8px;
        background: rgba(255,255,255,0.05);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        flex-shrink: 0;
      }
      #bm-drops-header label {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
      }
      #bm-clear-drops {
        background: rgba(255,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        color: #fff;
        padding: 2px 6px;
        cursor: pointer;
        font-size: 11px;
        margin: 0 5px;
      }
      #bm-clear-drops:hover {
        background: rgba(255,0,0,0.5);
      }
      #bm-drops-content {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 4px;
        background: rgba(255,255,255,0.02);
        font-family: monospace;
        font-size: 12px;
      }
      .bm-drop-player {
        margin-bottom: 6px;
        padding-bottom: 4px;
        border-bottom: 1px dashed rgba(255,255,255,0.1);
      }
      .bm-drop-player:last-child {
        margin-bottom: 0;
        border-bottom: none;
      }
      .bm-drop-player-name {
        font-weight: bold;
        color: #4caf50;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .bm-drop-player-stats {
        display: flex;
        gap: 10px;
        font-size: 11px;
        opacity: 0.8;
      }
      .bm-drop-player-money {
        color: #ffd700;
      }
      .bm-drop-player-soul {
        color: #9c27b0;
      }
      .bm-drop-items {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .bm-drop-item {
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
        padding: 2px 6px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .bm-drop-item-name {
        color: #ff9800;
      }
      .bm-drop-item-quantity {
        background: rgba(255,255,255,0.2);
        border-radius: 3px;
        padding: 0 4px;
        font-weight: bold;
      }

      /* 傷害統計樣式 - 新增滾動功能 */
      #bm-damage-header {
        padding: 4px 8px;
        background: rgba(255,255,255,0.05);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        flex-shrink: 0;
        font-weight: bold;
      }
      #bm-damage-content {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 4px;
        background: rgba(255,255,255,0.02);
        font-family: monospace;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .bm-damage-group {
        background: rgba(0,0,0,0.2);
        border-radius: 6px;
        overflow: hidden;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .bm-damage-group-title {
        font-weight: bold;
        padding: 4px 6px;
        background: rgba(255,255,255,0.05);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        flex-shrink: 0;
      }
      .bm-damage-group-content {
        padding: 4px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      }
      /* 新增：滾動容器樣式 */
      .scrollable {
        overflow-y: auto;
        max-height: 90%; /* 設置最大高度以啟用滾動 */
      }
      .scrollable::-webkit-scrollbar {
        width: 6px;
      }
      .scrollable::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
      }
      .scrollable::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.3);
        border-radius: 3px;
      }
      .scrollable::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.5);
      }

      .bm-damage-entity {
        padding: 4px;
        background: rgba(0,0,0,0.15);
        border-radius: 4px;
      }
      .bm-damage-entity-name {
        font-weight: bold;
        margin-bottom: 4px;
      }
      .bm-damage-player .bm-damage-entity-name { color: #4caf50; }
      .bm-damage-enemy .bm-damage-entity-name { color: #f44336; }
      .bm-damage-bar-container {
        margin-top: 4px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-size: 11px;
      }
      .bm-damage-bar {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .bm-damage-bar-label {
        display: flex;
        justify-content: space-between;
      }
      .bm-damage-bar-fill {
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        background: rgba(255,255,255,0.1);
      }
      .bm-damage-bar-value {
        height: 100%;
        transition: width 0.3s ease;
      }
      .bm-damage-dealt .bm-damage-bar-value { background: #ffeb3b; }
      .bm-damage-taken .bm-damage-bar-value { background: #ff9800; }
    `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        /* ===== 拖曳記錄位置 ===== */
        const header = ui.querySelector('#bm-header');
        let drag = false, sx, sy, sr, st;

        // 防止在進度條上拖動時觸發整體移動
        const progress = ui.querySelector('#bm-progress');
        if (progress) {
            progress.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
            progress.addEventListener('mouseup', (e) => {
                e.stopPropagation();
            });
        }

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('input, button, select')) {
                return;
            }

            drag = true; sx = e.clientX; sy = e.clientY;
            const rect = ui.getBoundingClientRect();
            sr = window.innerWidth - rect.right;
            st = rect.top;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!drag) return;
            const dx = e.clientX - sx, dy = e.clientY - sy;
            ui.style.right = (sr - dx) + 'px';
            ui.style.top = (st + dy) + 'px';
        });

        window.addEventListener('mouseup', () => {
            if (!drag) return;
            drag = false;
            savePosition();
        });

        // 儲存位置
        const savePosition = () => {
            const ui = document.getElementById('battle-monitor');
            if (!ui) return;

            const rect = ui.getBoundingClientRect();

            localStorage.setItem('bm-pos', JSON.stringify({
                right: window.innerWidth - rect.right,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                collapsed: ui.classList.contains('collapsed')
            }));
        };

        const restorePosition = () => {
            const ui = document.getElementById('battle-monitor');
            const pos = JSON.parse(localStorage.getItem('bm-pos') || '{}');

            if (pos.width) ui.style.width = pos.width + 'px';
            if (pos.height) ui.style.height = pos.height + 'px';
            if (typeof pos.right === 'number') ui.style.right = pos.right + 'px';
            if (typeof pos.top === 'number') ui.style.top = pos.top + 'px';
            if (pos.collapsed) ui.classList.add('collapsed');
        };

        const resizeObserver = new ResizeObserver(savePosition);
        resizeObserver.observe(ui);

        // 初始化功能
        restorePosition();

        // 標籤切換功能
        const tabs = ui.querySelectorAll('.bm-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有標籤的active類
                tabs.forEach(t => t.classList.remove('active'));
                // 為當前點擊的標籤添加active類
                tab.classList.add('active');

                // 隱藏所有內容
                const contents = ui.querySelectorAll('.bm-tab-content');
                contents.forEach(content => content.classList.remove('active'));

                // 顯示對應的內容
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`bm-${tabId}-section`).classList.add('active');
            });
        });

        return ui;
    };

    /* ===== 掉落物記錄功能 (全域累計) ===== */
    const addDropRecord = (playerName, items, money = 0, soul = 0) => {
        if (!state.enableDropRecording) return;

        if (!state.dropRecords[playerName]) {
            state.dropRecords[playerName] = {
                items: {},
                money: 0,
                soul: 0
            };
        }

        const playerRecord = state.dropRecords[playerName];

        // 記錄金幣和靈魂
        if (money > 0) {
            playerRecord.money += money;
        }
        if (soul > 0) {
            playerRecord.soul += soul;
        }

        // 記錄物品
        if (items && items.length > 0) {
            items.forEach(item => {
                const itemId = item.itemId || item.name;
                if (playerRecord.items[itemId]) {
                    playerRecord.items[itemId].quantity += item.quantity || 1;
                } else {
                    playerRecord.items[itemId] = {
                        name: item.name,
                        type: item.type,
                        quantity: item.quantity || 1,
                        description: item.description || ''
                    };
                }
            });
        }

        renderDropRecords();
    };

    const clearDropRecords = () => {
        state.dropRecords = {};
        renderDropRecords();
        localStorage.removeItem('bm-drop-records');
    };

    const renderDropRecords = () => {
        const container = document.getElementById('bm-drops-content');
        if (!container) return;

        container.innerHTML = '';

        const players = Object.keys(state.dropRecords);
        if (players.length === 0) {
            container.innerHTML = '<div class="bm-log-line">尚無掉落記錄</div>';
            return;
        }

        players.forEach(playerName => {
            const record = state.dropRecords[playerName];
            const playerEl = document.createElement('div');
            playerEl.className = 'bm-drop-player';

            playerEl.innerHTML = `
        <div class="bm-drop-player-name">
          ${escapeHtml(playerName)}
          <div class="bm-drop-player-stats">
            <span class="bm-drop-player-money">💰 ${record.money}</span>
            <span class="bm-drop-player-soul">💧 ${record.soul}</span>
          </div>
        </div>
        <div class="bm-drop-items"></div>
      `;

            const itemsEl = playerEl.querySelector('.bm-drop-items');
            Object.values(record.items).forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'bm-drop-item';
                itemEl.innerHTML = `
          <span class="bm-drop-item-name">${escapeHtml(item.name)}</span>
          <span class="bm-drop-item-quantity">×${item.quantity}</span>
        `;
                itemsEl.appendChild(itemEl);
            });

            container.appendChild(playerEl);
        });
    };

    /* ===== 傷害統計功能 (每場戰鬥獨立) ===== */
    const initDamageStats = (battleId, teamMembers, enemyTeam) => {
        if (!state.damageStats[battleId]) {
            state.damageStats[battleId] = [];
        }

        // 初始化第0回合（戰鬥開始前狀態）
        const initialStats = {};

        // 初始化玩家
        teamMembers.forEach(member => {
            initialStats[member.name] = {
                dealt: 0,
                taken: 0,
                type: 'player'
            };
        });

        // 初始化敵人
        enemyTeam.forEach(enemy => {
            initialStats[enemy.name] = {
                dealt: 0,
                taken: 0,
                type: 'enemy'
            };
        });

        state.damageStats[battleId][0] = { ...initialStats };
    };

    const updateDamageStats = (battleId, roundIndex, currentState, previousState, attacker) => {
        if (!state.damageStats[battleId]) return;

        // 獲取上一回合的統計數據（如果不存在則初始化）
        const prevStats = state.damageStats[battleId][roundIndex - 1] || JSON.parse(JSON.stringify(state.damageStats[battleId][0]));
        const newStats = JSON.parse(JSON.stringify(prevStats));

        // 嚴格按照要求實現傷害計算邏輯
        if (roundIndex === 1) {
            // 回合1：玩家行動 - 與每個目標的maxHp做比對
            currentState.enemyTeam.forEach(enemy => {
                const maxHp = enemy.maxHp;
                const currentHp = enemy.hp;
                const damageDealt = maxHp - currentHp;

                if (damageDealt > 0) {
                    // 更新攻擊者的造成傷害
                    if (newStats[attacker]) {
                        newStats[attacker].dealt += damageDealt;
                    }

                    // 更新敵人的承受傷害
                    if (newStats[enemy.name]) {
                        newStats[enemy.name].taken += damageDealt;
                    }
                }
            });
        } else {
            // 回合2及以後：敵方行動 - 與上一回合結果做比對
            if (previousState) {
                // 對每個玩家計算承受傷害
                currentState.teamMembers.forEach(member => {
                    const prevMember = previousState.teamMembers.find(m => m.name === member.name);
                    if (prevMember) {
                        const damageTaken = prevMember.hp - member.hp;
                        if (damageTaken > 0) {
                            // 更新敵人攻擊者的造成傷害
                            if (newStats[attacker]) {
                                newStats[attacker].dealt += damageTaken;
                            }

                            // 更新玩家的承受傷害
                            if (newStats[member.name]) {
                                newStats[member.name].taken += damageTaken;
                            }
                        }
                    }
                });

                // 如果後續回合有玩家再次攻擊（超過2回合的情況），同樣與上一回合比對
                if (currentState.teamMembers.some(m => m.name === attacker)) {
                    currentState.enemyTeam.forEach(enemy => {
                        const prevEnemy = previousState.enemyTeam.find(e => e.name === enemy.name);
                        if (prevEnemy) {
                            const damageDealt = prevEnemy.hp - enemy.hp;
                            if (damageDealt > 0) {
                                if (newStats[attacker]) {
                                    newStats[attacker].dealt += damageDealt;
                                }
                                if (newStats[enemy.name]) {
                                    newStats[enemy.name].taken += damageDealt;
                                }
                            }
                        }
                    });
                }
            }
        }

        // 確保回合索引對應正確
        state.damageStats[battleId][roundIndex] = newStats;

        // 即時刷新傷害統計顯示
        if (state.currentBattleIndex !== -1 &&
            state.battles[state.currentBattleIndex].id === battleId &&
            state.currentRoundIndex === roundIndex - 1) {
            renderDamageStats(battleId, roundIndex);
        }
    };

    const renderDamageStats = (battleId, roundIndex) => {
        const battleStats = state.damageStats[battleId];
        if (!battleStats || !battleStats[roundIndex]) return;

        const currentStats = battleStats[roundIndex];
        const playersContainer = document.querySelector('#bm-damage-players .bm-damage-group-content');
        const enemiesContainer = document.querySelector('#bm-damage-enemies .bm-damage-group-content');

        if (!playersContainer || !enemiesContainer) return;

        playersContainer.innerHTML = '';
        enemiesContainer.innerHTML = '';

        // 分離玩家和敵人的數據
        const players = [];
        const enemies = [];

        Object.entries(currentStats).forEach(([name, stats]) => {
            if (stats.type === 'player') {
                players.push({ name, ...stats });
            } else {
                enemies.push({ name, ...stats });
            }
        });

        // 計算最大傷害值（用於進度條顯示）
        const maxPlayerDealt = players.length > 0 ? Math.max(...players.map(p => p.dealt)) : 1;
        const maxEnemyDealt = enemies.length > 0 ? Math.max(...enemies.map(e => e.dealt)) : 1;

        // 渲染玩家傷害統計
        players.forEach(entity => {
            const entityEl = document.createElement('div');
            entityEl.className = 'bm-damage-entity bm-damage-player';

            entityEl.innerHTML = `
        <div class="bm-damage-entity-name">${escapeHtml(entity.name)}</div>
        <div class="bm-damage-bar-container">
          <div class="bm-damage-bar bm-damage-dealt">
            <div class="bm-damage-bar-label">
              <span>造成傷害</span>
              <span>${entity.dealt}</span>
            </div>
            <div class="bm-damage-bar-fill">
              <div class="bm-damage-bar-value" style="width: ${entity.dealt>0?(entity.dealt / maxPlayerDealt) * 100:0}%"></div>
            </div>
          </div>
          <div class="bm-damage-bar bm-damage-taken">
            <div class="bm-damage-bar-label">
              <span>承受傷害</span>
              <span>${entity.taken}</span>
            </div>
            <div class="bm-damage-bar-fill">
              <div class="bm-damage-bar-value" style="width: ${entity.taken > 0 ? (entity.taken / Math.max(entity.dealt || 1, entity.taken)) * 100 : 0}%"></div>
            </div>
          </div>
        </div>
      `;
            playersContainer.appendChild(entityEl);
        });

        // 渲染敵人傷害統計
        enemies.forEach(entity => {
            const entityEl = document.createElement('div');
            entityEl.className = 'bm-damage-entity bm-damage-enemy';

            entityEl.innerHTML = `
        <div class="bm-damage-entity-name">${escapeHtml(entity.name)}</div>
        <div class="bm-damage-bar-container">
          <div class="bm-damage-bar bm-damage-dealt">
            <div class="bm-damage-bar-label">
              <span>造成傷害</span>
              <span>${entity.dealt}</span>
            </div>
            <div class="bm-damage-bar-fill">
              <div class="bm-damage-bar-value" style="width: ${entity.dealt>0?(entity.dealt / maxEnemyDealt) * 100:0}%"></div>
            </div>
          </div>
          <div class="bm-damage-bar bm-damage-taken">
            <div class="bm-damage-bar-label">
              <span>承受傷害</span>
              <span>${entity.taken}</span>
            </div>
            <div class="bm-damage-bar-fill">
              <div class="bm-damage-bar-value" style="width: ${entity.taken > 0 ? (entity.taken / Math.max(entity.dealt || 1, entity.taken)) * 100 : 0}%"></div>
            </div>
          </div>
        </div>
      `;
            enemiesContainer.appendChild(entityEl);
        });
    };

    /* ===== 戰鬥記錄處理 ===== */
    const addBattleEvent = (event) => {
        if (event.type === 'battleStart') {
            // 創建新戰鬥
            const newBattle = {
                id: event.battleId,
                rounds: [],
                team: event.teamMembers,
                enemies: event.enemyTeam,
                startTime: new Date()
            };

            // 初始化傷害統計
            initDamageStats(event.battleId, event.teamMembers, event.enemyTeam);

            // 保持最多3場戰鬥記錄
            state.battles.push(newBattle);
            if (state.battles.length > 3) {
                state.battles.shift();
            }

            state.currentBattleIndex = state.battles.length - 1;
            updateBattleSelector();
            updateBattleCount();

            // 如果有戰鬥且處於播放狀態，自動開始播放
            if (state.playing && state.battles[state.currentBattleIndex].rounds.length > 0) {
                state.currentRoundIndex = 0;
                renderCurrentRound();
                updateProgressBar();
                playNextRound();
            }
        }
        else if (event.type === 'battleUpdate' && state.currentBattleIndex !== -1) {
            const currentBattle = state.battles[state.currentBattleIndex];
            if (!currentBattle) return;

            // 添加新回合
            const newRoundIndex = currentBattle.rounds.length + 1;
            currentBattle.rounds.push({
                index: newRoundIndex,
                data: event,
                timestamp: new Date()
            });

            // 更新傷害統計（傳入正確的上一回合數據）
            const previousState = newRoundIndex > 1
                ? currentBattle.rounds[newRoundIndex - 2].data
                : null;
            updateDamageStats(
                currentBattle.id,
                newRoundIndex,
                event,
                previousState,
                event.attacker
            );

            // 如果正在播放或沒有選擇當前回合，自動顯示最新回合
            if (state.playing || state.currentRoundIndex === -1) {
                state.currentRoundIndex = newRoundIndex - 1;
                renderCurrentRound();
                updateProgressBar();
            }

            // 如果處於播放狀態，繼續自動播放
            if (state.playing && state.timer === null) {
                playNextRound();
            }
        }
        else if (event.type === 'battleReward' && state.currentBattleIndex !== -1) {
            const currentBattle = state.battles[state.currentBattleIndex];
            if (!currentBattle) return;

            // 記錄掉落物
            Object.entries(event.memberDrops).forEach(([playerName, items]) => {
                const money = event.moneyRewards[playerName] || 0;
                const soul = event.soulRewards[playerName] || 0;
                addDropRecord(playerName, items, money, soul);
            });
        }
    };

    /* ===== UI 渲染 ===== */
    const renderCurrentRound = () => {
        const battle = state.battles[state.currentBattleIndex];
        if (!battle || state.currentRoundIndex < 0 || state.currentRoundIndex >= battle.rounds.length) return;

        const round = battle.rounds[state.currentRoundIndex];
        const data = round.data;

        // 更新戰鬥信息
        document.getElementById('bm-bid').textContent = battle.id;
        document.getElementById('bm-round-now').textContent = round.index;
        document.getElementById('bm-round-total').textContent = battle.rounds.length;

        // 更新隊伍狀態
        const teamContainer = document.getElementById('bm-team');
        const enemyContainer = document.getElementById('bm-enemy');

        if (teamContainer && data.teamMembers) {
            teamContainer.innerHTML = '';
            data.teamMembers.forEach(member => {
                const hpPercent = (member.hp / member.maxHp) * 100;
                const hpColor = hpPercent > 50 ? '#4caf50' : hpPercent > 20 ? '#ffeb3b' : '#f44336';

                const memberEl = document.createElement('div');
                memberEl.className = `bm-member ${!member.isAlive ? 'bm-dead' : ''}`;
                memberEl.innerHTML = `
          <div class="bm-name">${escapeHtml(member.name)} Lv${member.lv || 1}</div>
          <div class="bm-hpbar">
            <div class="bm-fill" style="width: ${hpPercent}%; background: ${hpColor}"></div>
          </div>
          <div class="bm-hp">${member.hp}/${member.maxHp}</div>
        `;
                teamContainer.appendChild(memberEl);
            });
        }

        if (enemyContainer && data.enemyTeam) {
            enemyContainer.innerHTML = '';
            data.enemyTeam.forEach(enemy => {
                const hpPercent = (enemy.hp / enemy.maxHp) * 100;
                const hpColor = hpPercent > 50 ? '#4caf50' : hpPercent > 20 ? '#ffeb3b' : '#f44336';

                const enemyEl = document.createElement('div');
                enemyEl.className = `bm-member ${!enemy.isAlive ? 'bm-dead' : ''}`;
                enemyEl.innerHTML = `
          <div class="bm-name">${escapeHtml(enemy.name)} Lv${enemy.lv || 1}</div>
          <div class="bm-hpbar">
            <div class="bm-fill" style="width: ${hpPercent}%; background: ${hpColor}"></div>
          </div>
          <div class="bm-hp">${enemy.hp}/${enemy.maxHp}</div>
        `;
                enemyContainer.appendChild(enemyEl);
            });
        }

        // 更新日誌
        const logBody = document.querySelector('#bm-log .bm-log-body');
        if (logBody && data.messages) {
            logBody.innerHTML = '';
            data.messages.forEach(msg => {
                const logLine = document.createElement('div');
                logLine.className = 'bm-log-line';
                logLine.textContent = msg;
                logBody.appendChild(logLine);
            });
            // 最新日誌閃爍效果
            const lastLine = logBody.lastChild;
            if (lastLine) lastLine.classList.add('bm-flash');
        }

        // 確保傷害統計同步渲染
        renderDamageStats(battle.id, round.index);
    };

    const updateBattleSelector = () => {
        const selector = document.getElementById('bm-battle-list');
        if (!selector) return;

        const currentValue = selector.value;
        selector.innerHTML = '<option value="-1">選擇戰鬥記錄</option>';

        state.battles.forEach((battle, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `戰鬥 ${battle.id.slice(-6)} (${battle.rounds.length}回合)`;
            selector.appendChild(option);
        });

        selector.value = state.currentBattleIndex.toString();
    };

    const updateBattleCount = () => {
        const countEl = document.getElementById('bm-battle-count');
        if (countEl) {
            countEl.textContent = `${state.battles.length}/3`;
        }
    };

    const updateProgressBar = () => {
        const battle = state.battles[state.currentBattleIndex];
        const progress = document.getElementById('bm-progress');
        if (!battle || !progress) return;

        progress.max = battle.rounds.length - 1;
        progress.value = state.currentRoundIndex;
    };

    /* ===== 事件監聽器 ===== */
    const setupEventListeners = () => {
        // 播放/暫停按鈕
        document.getElementById('bm-play').addEventListener('click', () => {
            const battle = state.battles[state.currentBattleIndex];
            if (!battle || battle.rounds.length === 0) return;

            state.playing = !state.playing;
            const playBtn = document.getElementById('bm-play');
            playBtn.textContent = state.playing ? '⏸' : '▶';

            // 暫停指示器
            const pausedIndicator = document.getElementById('bm-paused-indicator');
            pausedIndicator.style.display = state.playing ? 'none' : 'inline';

            if (state.playing) {
                playNextRound();
            } else if (state.timer) {
                clearTimeout(state.timer);
                state.timer = null;
            }
        });

        // 上一回合按鈕
        document.getElementById('bm-prev').addEventListener('click', () => {
            if (state.currentRoundIndex > 0) {
                state.currentRoundIndex--;
                renderCurrentRound();
                updateProgressBar();
            }
        });

        // 下一回合按鈕
        document.getElementById('bm-next').addEventListener('click', () => {
            const battle = state.battles[state.currentBattleIndex];
            if (battle && state.currentRoundIndex < battle.rounds.length - 1) {
                state.currentRoundIndex++;
                renderCurrentRound();
                updateProgressBar();
            }
        });

        // 進度條
        document.getElementById('bm-progress').addEventListener('input', (e) => {
            const battle = state.battles[state.currentBattleIndex];
            if (!battle) return;

            const newIndex = parseInt(e.target.value);
            if (newIndex >= 0 && newIndex < battle.rounds.length) {
                state.currentRoundIndex = newIndex;
                renderCurrentRound();
            }
        });

        // 清除按鈕
        document.getElementById('bm-clear').addEventListener('click', () => {
            state.battles = [];
            state.currentBattleIndex = -1;
            state.currentRoundIndex = -1;
            if (state.timer) {
                clearTimeout(state.timer);
                state.timer = null;
            }
            state.playing = true; // 清除後仍保持播放狀態
            document.getElementById('bm-play').textContent = '⏸';
            document.getElementById('bm-paused-indicator').style.display = 'none';

            updateBattleSelector();
            updateBattleCount();
            document.getElementById('bm-bid').textContent = '—';
            document.getElementById('bm-round-now').textContent = '0';
            document.getElementById('bm-round-total').textContent = '0';
            document.getElementById('bm-team').innerHTML = '';
            document.getElementById('bm-enemy').innerHTML = '';
            document.querySelector('#bm-log .bm-log-body').innerHTML = '';
            document.getElementById('bm-progress').value = 0;

            // 清空傷害統計顯示
            document.querySelector('#bm-damage-players .bm-damage-group-content').innerHTML = '';
            document.querySelector('#bm-damage-enemies .bm-damage-group-content').innerHTML = '';
        });

        // 最小化按鈕
        document.getElementById('bm-toggle').addEventListener('click', () => {
            const ui = document.getElementById('battle-monitor');
            ui.classList.toggle('collapsed');
            const toggleBtn = document.getElementById('bm-toggle');
            toggleBtn.textContent = ui.classList.contains('collapsed') ? '+' : '—';
        });

        // 戰鬥選擇器
        document.getElementById('bm-battle-list').addEventListener('change', (e) => {
            const index = parseInt(e.target.value);
            if (index >= 0 && index < state.battles.length) {
                state.currentBattleIndex = index;
                state.currentRoundIndex = 0;
                renderCurrentRound();
                updateProgressBar();

                // 切換戰鬥後保持播放狀態
                if (state.playing && state.timer === null) {
                    playNextRound();
                }
            } else {
                state.currentBattleIndex = -1;
                state.currentRoundIndex = -1;
            }
        });

        // 掉落物記錄開關
        document.getElementById('bm-enable-drops').addEventListener('change', (e) => {
            state.enableDropRecording = e.target.checked;
        });

        // 清除掉落記錄按鈕
        document.getElementById('bm-clear-drops').addEventListener('click', clearDropRecords);
    };

    /* ===== 自動播放功能 ===== */
    const playNextRound = () => {
        if (!state.playing) return;

        const battle = state.battles[state.currentBattleIndex];
        if (!battle) {
            state.playing = true; // 沒有戰鬥時仍保持播放狀態
            document.getElementById('bm-play').textContent = '⏸';
            document.getElementById('bm-paused-indicator').style.display = 'none';
            return;
        }

        if (state.currentRoundIndex < battle.rounds.length - 1) {
            state.currentRoundIndex++;
            renderCurrentRound();
            updateProgressBar();

            state.timer = setTimeout(playNextRound, state.playInterval);
        } else {
            // 播放到最後一回合時，保持播放狀態（便於接收新回合）
            state.playing = true;
            document.getElementById('bm-play').textContent = '⏸';
            document.getElementById('bm-paused-indicator').style.display = 'none';
        }
    };

    /* ===== WebSocket 鉤子 ===== */
    const hookWebSocket = () => {
        const originalWebSocket = window.WebSocket;
        window.WebSocket = class extends originalWebSocket {
            constructor(url, protocols) {
                super(url, protocols);

                // 監聽來自伺服器的消息
                this.addEventListener('message', (event) => {
                    const data = decodePayload(event.data);
                    if (typeof data === 'string' && data.startsWith('42')) {
                        try {
                            // 解析 Socket.IO 消息
                            const payload = JSON.parse(data.slice(2));
                            if (Array.isArray(payload) && payload.length >= 2) {
                                const [eventType, eventData] = payload;

                                // 處理戰鬥相關事件
                                if (eventType === 'battleStart' ||
                                    eventType === 'battleUpdate' ||
                                    eventType === 'battleReward') {
                                    addBattleEvent({ type: eventType, ...eventData });
                                }
                            }
                        } catch (e) {
                            console.error('解析WebSocket消息失敗:', e);
                        }
                    }
                });
            }
        };
    };

    /* ===== 初始化 ===== */
    const init = () => {
        // 建立UI
        const ui = createUI();
        if (!ui) return;

        // 設置事件監聽器
        setupEventListeners();

        // 初始化播放按鈕狀態和暫停指示器
        const playBtn = document.getElementById('bm-play');
        const pausedIndicator = document.getElementById('bm-paused-indicator');
        playBtn.textContent = state.playing ? '⏸' : '▶';
        pausedIndicator.style.display = state.playing ? 'none' : 'inline';

        // 鉤子WebSocket
        hookWebSocket();

        // 從本地存儲加載掉落記錄
        const savedDrops = localStorage.getItem('bm-drop-records');
        if (savedDrops) {
            try {
                state.dropRecords = JSON.parse(savedDrops);
                renderDropRecords();
            } catch (e) {
                console.error('加載掉落記錄失敗:', e);
            }
        }

        // 保存掉落記錄到本地存儲
        setInterval(() => {
            if (state.enableDropRecording) {
                localStorage.setItem('bm-drop-records', JSON.stringify(state.dropRecords));
            }
        }, 5000);

        // 初始化時如果有戰鬥，自動開始播放
        if (state.battles.length > 0 && state.currentBattleIndex !== -1) {
            state.currentRoundIndex = 0;
            renderCurrentRound();
            updateProgressBar();
            if (state.playing) {
                playNextRound();
            }
        }
    };

    // 啟動腳本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// ==UserScript==
// @name         [Milky Way Idle] Detailed Mob Drop Analysis
// @namespace    http://tampermonkey.net/
// @version      3.65
// @description  Current session only + tier-aware coins
// @author       Your Name
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/554821/%5BMilky%20Way%20Idle%5D%20Detailed%20Mob%20Drop%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/554821/%5BMilky%20Way%20Idle%5D%20Detailed%20Mob%20Drop%20Analysis.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`
        .mob-drops-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 1150px;
            max-height: 80vh;
            background: rgba(30, 30, 30, 0.98);
            border: 2px solid rgba(80, 80, 80, 0.8);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
        }
        .mob-drops-header {
            background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
            padding: 12px 16px;
            border-radius: 10px 10px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        .mob-drops-title {
            font-size: 16px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .mob-drops-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .mob-drops-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        .mob-drops-content {
            overflow-y: auto;
            padding: 16px;
            max-height: calc(80vh - 120px);
        }
        .mob-drops-content::-webkit-scrollbar {
            width: 8px;
        }
        .mob-drops-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }
        .mob-drops-content::-webkit-scrollbar-thumb {
            background: rgba(100, 100, 100, 0.6);
            border-radius: 4px;
        }
        .mob-drops-content::-webkit-scrollbar-thumb:hover {
            background: rgba(120, 120, 120, 0.8);
        }
        .map-section {
            background: rgba(40, 40, 40, 0.6);
            border: 1px solid rgba(80, 80, 80, 0.4);
            border-radius: 8px;
            margin-bottom: 12px;
            overflow: hidden;
        }
        .map-header {
            background: rgba(50, 50, 50, 0.8);
            padding: 8px 12px;
            font-weight: 600;
            font-size: 12px;
            border-bottom: 1px solid rgba(80, 80, 80, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .map-name {
            color: #e8e8e8;
        }
        .map-stats {
            color: #a0a0a0;
            font-size: 11px;
            font-weight: 400;
        }
        .drop-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        .drop-table thead {
            background: rgba(40, 40, 40, 0.8);
        }
        .drop-table th {
            padding: 4px 2px;
            text-align: center;
            font-size: 9px;
            color: #b0b0b0;
            font-weight: 600;
            border-bottom: 1px solid rgba(80, 80, 80, 0.3);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .drop-table td {
            padding: 4px 2px;
            font-size: 10px;
            border-bottom: 1px solid rgba(80, 80, 80, 0.15);
            text-align: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .drop-table tr:last-child td {
            border-bottom: none;
        }
        .drop-table tbody tr:hover {
            background: rgba(60, 60, 60, 0.4);
        }
        .item-name {
            color: #d0d0d0;
            font-weight: 500;
            text-align: left !important;
            max-width: 100px;
        }
        .value-positive {
            color: #4ade80;
        }
        .value-negative {
            color: #f87171;
        }
        .value-neutral {
            color: #a8aed4;
        }
        .mob-drops-toggle {
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
            border: 2px solid rgba(80, 80, 80, 0.8);
            color: white;
            padding: 10px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            transition: all 0.2s;
        }
        .mob-drops-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }
        .no-drops {
            text-align: center;
            padding: 30px;
            color: #a8aed4;
            font-size: 14px;
        }
        .session-stats {
            background: rgba(40, 40, 40, 0.8);
            border: 1px solid rgba(80, 80, 80, 0.5);
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
        }
        .session-stats-title {
            font-size: 12px;
            font-weight: 600;
            color: #e8e8e8;
            margin-bottom: 6px;
            text-align: center;
        }
        .session-stat-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            padding: 3px 0;
            color: #a8aed4;
        }
        .tier-badge {
            display: inline-block;
            background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 8px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
    `);
    const STORAGE_KEY = 'mobDropsAnalysis_v6';
    const PersistentData = {
        battleSessions: {},
        previousTotals: {},
        load() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                if (data) {
                    const parsed = JSON.parse(data);
                    this.battleSessions = parsed.battleSessions || {};
                    this.previousTotals = parsed.previousTotals || {};
                    this.currentSessionKey = parsed.currentSessionKey || null;
                }
            } catch (e) {
            }
        },
        save() {
            try {
                const data = {
                    battleSessions: this.battleSessions,
                    previousTotals: this.previousTotals,
                    currentSessionKey: this.currentSessionKey,
                    lastSaved: Date.now()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
            }
        },
        addBattleSession(mapHrid, mapName, battleStartTime, battleId, difficultyTier, playersData) {
            const sessionKey = Math.round(battleStartTime);
            if (!this.battleSessions[sessionKey]) {
                this.battleSessions[sessionKey] = {
                    mapHrid: mapHrid,
                    mapName: mapName,
                    runCount: 0,
                    battleId: 0,
                    startTime: battleStartTime,
                    latestBattleTime: battleStartTime,
                    difficultyTier: difficultyTier,
                    partySize: playersData.length,
                    players: playersData.map(p => ({ name: p.name, drops: {} }))
                };
            }
            const session = this.battleSessions[sessionKey];
            session.runCount = battleId - 1;
            session.battleId = battleId;
            session.latestBattleTime = Date.now() / 1000;
            for (const newPlayerData of playersData) {
                let existingPlayer = session.players.find(p => p.name === newPlayerData.name);
                if (!existingPlayer) {
                    existingPlayer = { name: newPlayerData.name, drops: {} };
                    session.players.push(existingPlayer);
                }
                for (const [itemHrid, count] of Object.entries(newPlayerData.drops)) {
                    if (!existingPlayer.drops[itemHrid]) {
                        existingPlayer.drops[itemHrid] = 0;
                    }
                    existingPlayer.drops[itemHrid] += count;
                }
            }
            this.save();
        },
        reset() {
            this.battleSessions = {};
            this.previousTotals = {};
            this.save();
        }
    };
    const CharacterData = {
        playerId: null,
        playerName: null
    };
    const GameData = {
        itemNames: {},
        itemPrices: {},
        marketPrices: {},
        mapNames: {},
        mapData: {},
        openableLootDropMap: {},
        playerStats: {},
        currentMapHrid: null,
        currentDifficultyTier: 0,
        inBattle: false
    };
    const MarketData = {
        MARKET_API_URL: 'https://www.milkywayidle.com/game_data/marketplace.json',
        STORAGE_KEY: 'mobDropsAnalysis_marketData',
        UPDATE_INTERVAL: 3600,
        chestValues: {},
        specialItemPrices: {},
        async fetchMarketData() {
            try {
                const response = await fetch(this.MARKET_API_URL);
                const data = await response.json();
                const marketPrices = {};
                if (data.marketData) {
                    for (const [itemHrid, levels] of Object.entries(data.marketData)) {
                        if (levels['0']) {
                            marketPrices[itemHrid] = {
                                ask: levels['0'].a,
                                bid: levels['0'].b
                            };
                        }
                    }
                }
                marketPrices['/items/coin'] = { ask: 1, bid: 1 };
                const marketDataCache = {
                    prices: marketPrices,
                    timestamp: Math.floor(Date.now() / 1000)
                };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(marketDataCache));
                GameData.marketPrices = marketPrices;
                return marketPrices;
            } catch (e) {
                return null;
            }
        },
        loadCachedMarketData() {
            try {
                const cached = localStorage.getItem(this.STORAGE_KEY);
                if (!cached) return null;
                const marketDataCache = JSON.parse(cached);
                const age = Math.floor(Date.now() / 1000) - marketDataCache.timestamp;
                if (age < this.UPDATE_INTERVAL) {
                    GameData.marketPrices = marketDataCache.prices;
                    return marketDataCache.prices;
                }
                return null;
            } catch (e) {
                return null;
            }
        },
        async init() {
            const cached = this.loadCachedMarketData();
            if (!cached) {
                await this.fetchMarketData();
            }
            this.calculateSpecialItemPrices();
        },
        calculateSpecialItemPrices() {
            const bagPrice = GameData.marketPrices['/items/bag_of_10_cowbells'];
            if (bagPrice) {
                this.specialItemPrices['/items/cowbell'] = {
                    ask: bagPrice.ask / 10,
                    bid: bagPrice.bid / 10
                };
            }
            this.specialItemPrices['/items/coin'] = { ask: 1, bid: 1 };
        },
        getPrice(itemHrid, priceType = 'bid') {
            if (this.specialItemPrices[itemHrid]) {
                return this.specialItemPrices[itemHrid][priceType] || 0;
            }
            if (this.chestValues[itemHrid]) {
                return this.chestValues[itemHrid][priceType] || 0;
            }
            if (GameData.marketPrices[itemHrid]) {
                return GameData.marketPrices[itemHrid][priceType] || 0;
            }
            return GameData.itemPrices[itemHrid] || 0;
        },
        calculateChestValues(openableLootDropMap) {
            if (!openableLootDropMap) return;
            const maxIterations = 20;
            for (let iter = 0; iter < maxIterations; iter++) {
                for (const [chestHrid, drops] of Object.entries(openableLootDropMap)) {
                    if (chestHrid === '/items/bag_of_10_cowbells') continue;
                    if (!this.chestValues[chestHrid]) {
                        this.chestValues[chestHrid] = { ask: 0, bid: 0 };
                    }
                    let totalAsk = 0;
                    let totalBid = 0;
                    for (const drop of drops) {
                        const itemHrid = drop.itemHrid;
                        const expectedCount = DropAnalyzer.itemCountExpt(drop, 0);
                        const askPrice = this.getPrice(itemHrid, 'ask');
                        const bidPrice = this.getPrice(itemHrid, 'bid');
                        totalAsk += askPrice * expectedCount;
                        totalBid += bidPrice * expectedCount;
                    }
                    this.chestValues[chestHrid].ask = totalAsk;
                    this.chestValues[chestHrid].bid = totalBid;
                }
            }
            const treasureChests = [
                '/items/small_treasure_chest',
                '/items/medium_treasure_chest',
                '/items/large_treasure_chest'
            ];
            for (const chestHrid of treasureChests) {
                if (this.chestValues[chestHrid]) {
                    const chestName = GameData.itemNames[chestHrid] || chestHrid;
                }
            }
        }
    };
    const MessageHandler = new class {
        listeners = {};
        constructor() {
            this.hookWS();
        }
        hookWS() {
            const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
            const oriGet = dataProperty.get;
            const handleMessageRecv = this.handleMessageRecv.bind(this);
            dataProperty.get = function hookedGet() {
                const socket = this.currentTarget;
                if (!(socket instanceof WebSocket)) {
                    return oriGet.call(this);
                }
                if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 &&
                    socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                    return oriGet.call(this);
                }
                const message = oriGet.call(this);
                Object.defineProperty(this, "data", { value: message });
                handleMessageRecv(message);
                return message;
            };
            Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
        }
        addListener(type, handler, priority = 0) {
            (this.listeners[type] ??= []).push({
                handler: handler,
                priority: priority,
            });
        }
        handleMessageRecv(message) {
            let obj = JSON.parse(message);
            if (!obj) return message;
            if (!this.listeners.hasOwnProperty(obj.type)) return message;
            this.listeners[obj.type]
                .sort((a, b) => a.priority - b.priority)
                .forEach(f => { f.handler(obj); });
            return message;
        }
    };
    const Utils = {
        isRareItem(itemHrid) {
            return itemHrid.includes('_chest');
        },
        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(2) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            if (num >= 10) {
                return num.toFixed(1);
            }
            if (num >= 1) {
                return num.toFixed(2);
            }
            if (num > 0) {
                return num.toFixed(3);
            }
            return '0';
        },
        formatExpected(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(4) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(4) + 'K';
            }
            return num.toFixed(4);
        },
        getPercentClass(percent) {
            if (percent > 5) return 'value-positive';
            if (percent < -5) return 'value-negative';
            return 'value-neutral';
        }
    };
    const DropAnalyzer = {
        itemCountExpt(drop, tier) {
            let baseDropRate;
            if (typeof drop.dropRate === 'number') {
                baseDropRate = drop.dropRate;
            } else if (Array.isArray(drop.dropRate)) {
                baseDropRate = drop.dropRate[tier] || drop.dropRate[0];
                return baseDropRate * (drop.minCount + drop.maxCount) / 2;
            } else {
                baseDropRate = 0;
            }
            const dropRatePerTier = drop.dropRatePerDifficultyTier || 0;
            let adjustedDropRate = baseDropRate + tier * dropRatePerTier;
            adjustedDropRate = adjustedDropRate * (1 + tier * 0.1);
            adjustedDropRate = Math.min(Math.max(adjustedDropRate, 0), 1);
            const expected = adjustedDropRate * (drop.minCount + drop.maxCount) / 2;
            return expected;
        },


        getTierDropRate(drop, tier) {
            let baseDropRate;
            if (typeof drop.dropRate === 'number') {
                baseDropRate = drop.dropRate;
            } else if (Array.isArray(drop.dropRate)) {
                return drop.dropRate[tier] || drop.dropRate[0];
            } else {
                return 0;
            }
            const dropRatePerTier = drop.dropRatePerDifficultyTier || 0;
            let adjustedDropRate = baseDropRate + tier * dropRatePerTier;
            adjustedDropRate = adjustedDropRate * (1 + tier * 0.1);
            adjustedDropRate = Math.min(Math.max(adjustedDropRate, 0), 1);
            return adjustedDropRate;
        },
        computeExpectedSpawns(spawnInfo) {
            const spawns = spawnInfo.spawns;
            const maxSpawnCount = spawnInfo.maxSpawnCount;
            const maxTotalStrength = spawnInfo.maxTotalStrength;
            const res = {};
            spawns.forEach(m => { res[m.combatMonsterHrid] = 0; });
            const dp = [];
            for (let i = 0; i <= maxTotalStrength; i++) {
                dp[i] = new Array(maxSpawnCount + 1).fill(0);
            }
            dp[0][0] = 1;
            for (let i = 0; i <= maxTotalStrength; i++) {
                for (let j = 0; j <= maxSpawnCount; j++) {
                    if (dp[i][j] === 0) continue;
                    for (const monster of spawns) {
                        const ni = i + monster.strength;
                        const nj = j + 1;
                        if (ni > maxTotalStrength || nj > maxSpawnCount) continue;
                        const val = dp[i][j] * monster.rate;
                        dp[ni][nj] += val;
                        res[monster.combatMonsterHrid] += val;
                    }
                }
            }
            return res;
        },
        calculateExpectedDrops(mapHrid, runCount, difficultyTier, partySize) {
            const mapData = GameData.mapData[mapHrid];
            if (!mapData) {
                return {};
            }
            const spawnInfo = mapData.spawnInfo;
            let bossWave = spawnInfo.bossWave || 0;
            if (!bossWave && mapData.type === 'dungeon') {
                bossWave = 1;
            } else if (!bossWave && mapData.type === 'group' && mapData.bossDrops && Object.keys(mapData.bossDrops).length > 0) {
                bossWave = 10;
            }
            const bossCount = bossWave ? Math.floor((runCount - 1) / bossWave) : 0;
            const normalCount = bossWave ?
                bossCount * (bossWave - 1) + (runCount - 1) % bossWave :
                runCount - 1;
            const expectedSpawns = this.computeExpectedSpawns(spawnInfo);
            const expectedDrops = {};
            if (mapData.bossDrops && Object.keys(mapData.bossDrops).length > 0) {
                for (const [monsterHrid, drops] of Object.entries(mapData.bossDrops)) {
                    for (const drop of drops) {
                        const itemExpt = this.itemCountExpt(drop, difficultyTier);
                        const expected = bossCount * itemExpt;
                        if (!expectedDrops[drop.itemHrid]) {
                            expectedDrops[drop.itemHrid] = { count: 0, tierDropRate: this.getTierDropRate(drop, difficultyTier) };
                        }
                        expectedDrops[drop.itemHrid].count += expected;
                    }
                }
            }
            if (mapData.monsterDrops && Object.keys(mapData.monsterDrops).length > 0) {
                for (const [monsterHrid, drops] of Object.entries(mapData.monsterDrops)) {
                    const spawnCount = expectedSpawns[monsterHrid] || 0;
                    for (const drop of drops) {
                        const itemExpt = this.itemCountExpt(drop, difficultyTier);
                        const expected = spawnCount * normalCount * itemExpt;
                        if (!expectedDrops[drop.itemHrid]) {
                            expectedDrops[drop.itemHrid] = { count: 0, tierDropRate: this.getTierDropRate(drop, difficultyTier) };
                        }
                        expectedDrops[drop.itemHrid].count += expected;
                    }
                }
            }
            return expectedDrops;
        }
    };
    let panel, toggleButton;
    const BUTTON_POSITION_KEY = 'mobDropsToggleButtonPosition';
    const PANEL_POSITION_KEY = 'mobDropsPanelPosition';

    function saveButtonPosition() {
        if (toggleButton) {
            const position = {
                top: toggleButton.style.top,
                right: toggleButton.style.right,
                left: toggleButton.style.left
            };
            localStorage.setItem(BUTTON_POSITION_KEY, JSON.stringify(position));
        }
    }

    function loadButtonPosition() {
        try {
            const saved = localStorage.getItem(BUTTON_POSITION_KEY);
            if (saved) {
                const position = JSON.parse(saved);
                if (toggleButton) {
                    if (position.left && position.left !== 'auto') {
                        toggleButton.style.left = position.left;
                        toggleButton.style.right = 'auto';
                    } else if (position.right) {
                        toggleButton.style.right = position.right;
                    }
                    if (position.top) {
                        toggleButton.style.top = position.top;
                    }
                }
            }
        } catch (e) {
            // Invalid saved position, use defaults
        }
    }

    function savePanelPosition() {
        if (panel) {
            const position = {
                top: panel.style.top,
                right: panel.style.right,
                left: panel.style.left
            };
            localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify(position));
        }
    }

    function loadPanelPosition() {
        try {
            const saved = localStorage.getItem(PANEL_POSITION_KEY);
            if (saved) {
                const position = JSON.parse(saved);
                if (panel) {
                    if (position.left && position.left !== 'auto') {
                        panel.style.left = position.left;
                        panel.style.right = 'auto';
                    } else if (position.right) {
                        panel.style.right = position.right;
                    }
                    if (position.top) {
                        panel.style.top = position.top;
                    }
                }
            }
        } catch (e) {
            // Invalid saved position, use defaults
        }
    }

    let headerTitle;

    function updateHeaderTitle(playerStats = null) {
        if (!headerTitle) return;

        if (!playerStats) {
            headerTitle.innerHTML = 'No active session';
            toggleButton.innerHTML = 'No session';
            return;
        }

        let headerHtml = '';
        let buttonHtml = '';

        for (const [playerName, stats] of Object.entries(playerStats.players)) {
            const percentDiff = stats.expectedValue > 0
                ? ((stats.actualValue / stats.expectedValue - 1) * 100)
                : 0;
            const sign = percentDiff > 0 ? '+' : '';
            const colorClass = Utils.getPercentClass(percentDiff);

            // Map class names to actual colors
            const colorMap = {
                'value-positive': '#4ade80',
                'value-negative': '#f87171',
                'value-neutral': '#a8aed4'
            };
            const color = colorMap[colorClass];

            headerHtml += `${playerName} <span style="color: ${color};">${sign}${percentDiff.toFixed(1)}%</span>  `;
            buttonHtml += `${playerName} <span style="color: ${color} !important;">${sign}${percentDiff.toFixed(1)}%</span>  `;
        }

        const totalPercentDiff = playerStats.totalExpectedValue > 0
            ? ((playerStats.totalActualValue / playerStats.totalExpectedValue - 1) * 100)
            : 0;
        const totalSign = totalPercentDiff > 0 ? '+' : '';
        const totalColorClass = Utils.getPercentClass(totalPercentDiff);
        const colorMap = {
            'value-positive': '#4ade80',
            'value-negative': '#f87171',
            'value-neutral': '#a8aed4'
        };
        const totalColor = colorMap[totalColorClass];

        headerHtml += `Total <span style="color: ${totalColor};">${totalSign}${totalPercentDiff.toFixed(1)}%</span>`;
        buttonHtml += `Total <span style="color: ${totalColor} !important;">${totalSign}${totalPercentDiff.toFixed(1)}%</span>`;

        headerTitle.innerHTML = headerHtml;
        toggleButton.innerHTML = buttonHtml;
    }

    function createPanel() {
        toggleButton = document.createElement('button');
        toggleButton.className = 'mob-drops-toggle';
        toggleButton.textContent = 'Drop Stats';
        toggleButton.onclick = () => {
            if (panel.style.display === 'none' || panel.style.display === '') {
                // Position panel where the toggle button is
                panel.style.left = toggleButton.style.left || toggleButton.offsetLeft + 'px';
                panel.style.top = toggleButton.style.top || toggleButton.offsetTop + 'px';
                panel.style.right = 'auto';
                savePanelPosition();

                panel.style.display = 'flex';
                toggleButton.style.display = 'none';
            }
        };
        document.body.appendChild(toggleButton);

        // Load saved position
        loadButtonPosition();

        // Create panel
        panel = document.createElement('div');
        panel.className = 'mob-drops-panel';
        const header = document.createElement('div');
        header.className = 'mob-drops-header';
        headerTitle = document.createElement('div');
        headerTitle.className = 'mob-drops-title';
        headerTitle.textContent = 'No active session';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mob-drops-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => {
            // Position toggle button where the panel is before hiding
            toggleButton.style.left = panel.style.left || panel.offsetLeft + 'px';
            toggleButton.style.top = panel.style.top || panel.offsetTop + 'px';
            toggleButton.style.right = 'auto';
            saveButtonPosition();

            panel.style.display = 'none';
            toggleButton.style.display = 'block';
        };
        header.appendChild(headerTitle);
        header.appendChild(closeBtn);
        const content = document.createElement('div');
        content.className = 'mob-drops-content';
        content.id = 'mob-drops-content';
        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        // Load saved panel position
        loadPanelPosition();

        // Optimized dragging system with combined event listeners
        let isDraggingButton = false;
        let isDraggingPanel = false;
        let buttonInitialX, buttonInitialY, buttonMaxX, buttonMaxY;
        let panelInitialX, panelInitialY, panelMaxX, panelMaxY;
        let buttonDragStartTime = 0;
        let buttonLastPosition = null;
        let panelLastPosition = null;
        const DRAG_THRESHOLD = 150;

        // Button drag start
        toggleButton.addEventListener('mousedown', (e) => {
            buttonDragStartTime = Date.now();
            buttonInitialX = e.clientX - toggleButton.offsetLeft;
            buttonInitialY = e.clientY - toggleButton.offsetTop;
            buttonMaxX = window.innerWidth - toggleButton.offsetWidth;
            buttonMaxY = window.innerHeight - toggleButton.offsetHeight;
        });

        // Panel drag start
        header.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn) return;
            isDraggingPanel = true;
            panelInitialX = e.clientX - panel.offsetLeft;
            panelInitialY = e.clientY - panel.offsetTop;
            panelMaxX = window.innerWidth - panel.offsetWidth;
            panelMaxY = window.innerHeight - panel.offsetHeight;
        });

        // Combined mousemove listener (50% reduction in event processing)
        document.addEventListener('mousemove', (e) => {
            // Handle button dragging
            if (buttonDragStartTime > 0 && (Date.now() - buttonDragStartTime > DRAG_THRESHOLD)) {
                if (!isDraggingButton) {
                    isDraggingButton = true;
                    toggleButton.style.cursor = 'grabbing';
                }
                e.preventDefault();
                let newX = e.clientX - buttonInitialX;
                let newY = e.clientY - buttonInitialY;
                newX = Math.max(0, Math.min(newX, buttonMaxX));
                newY = Math.max(0, Math.min(newY, buttonMaxY));
                toggleButton.style.left = newX + 'px';
                toggleButton.style.top = newY + 'px';
                toggleButton.style.right = 'auto';
                return;
            }

            // Handle panel dragging
            if (isDraggingPanel) {
                e.preventDefault();
                let newX = e.clientX - panelInitialX;
                let newY = e.clientY - panelInitialY;
                newX = Math.max(0, Math.min(newX, panelMaxX));
                newY = Math.max(0, Math.min(newY, panelMaxY));
                panel.style.left = newX + 'px';
                panel.style.top = newY + 'px';
                panel.style.right = 'auto';
            }
        });

        // Combined mouseup listener (50% reduction in event processing)
        document.addEventListener('mouseup', () => {
            // Handle button drag end
            if (isDraggingButton) {
                isDraggingButton = false;
                toggleButton.style.cursor = 'pointer';

                // Only save if position actually changed
                const currentPos = `${toggleButton.style.left},${toggleButton.style.top}`;
                if (currentPos !== buttonLastPosition) {
                    saveButtonPosition();
                    buttonLastPosition = currentPos;
                }
            }
            buttonDragStartTime = 0;

            // Handle panel drag end
            if (isDraggingPanel) {
                isDraggingPanel = false;

                // Only save if position actually changed
                const currentPos = `${panel.style.left},${panel.style.top}`;
                if (currentPos !== panelLastPosition) {
                    savePanelPosition();
                    panelLastPosition = currentPos;
                }
            }
        });
    }
    MessageHandler.addListener('init_client_data', (msg) => {
        if (msg.itemDetailMap) {
            for (const [hrid, item] of Object.entries(msg.itemDetailMap)) {
                GameData.itemNames[hrid] = item.name;
                if (hrid === '/items/coin') {
                    GameData.itemPrices[hrid] = 1;
                } else {
                    GameData.itemPrices[hrid] = item.sellPrice || 0;
                }
            }
        }
        if (msg.actionDetailMap && msg.combatMonsterDetailMap) {
            const monsterMap = msg.combatMonsterDetailMap;
            const actionDetailMap = msg.actionDetailMap;
            for (const [actionHrid, actionDetail] of Object.entries(actionDetailMap)) {
                if (!actionHrid.startsWith("/actions/combat/")) continue;
                if (!actionDetail.combatZoneInfo) continue;
                GameData.mapNames[actionHrid] = actionDetail.name;
                if (actionDetail.combatZoneInfo.isDungeon) {
                    const dungeonInfo = actionDetail.combatZoneInfo.dungeonInfo;
                    GameData.mapData[actionHrid] = {
                        name: actionDetail.name,
                        type: 'dungeon',
                        spawnInfo: {
                            bossWave: 1,
                            maxSpawnCount: 0,
                            maxTotalStrength: 0,
                            spawns: []
                        },
                        monsterDrops: {},
                        bossDrops: {
                            '_dungeon': dungeonInfo.rewardDropTable.map(item => ({
                                isRare: false,
                                ...item
                            }))
                        }
                    };
                    continue;
                }
                const fightInfo = actionDetail.combatZoneInfo.fightInfo;
                if (!fightInfo) continue;
                const spawnInfo = fightInfo.randomSpawnInfo;
                if (!spawnInfo || !spawnInfo.spawns || spawnInfo.spawns.length === 0) continue;
                const mapType = spawnInfo.spawns.length > 1 || spawnInfo.bossWave > 0 ? "group" : "solo";
                const totalRate = spawnInfo.spawns.reduce((s, x) => s + x.rate, 0);
                const spawns = spawnInfo.spawns.map(s => ({
                    combatMonsterHrid: s.combatMonsterHrid,
                    strength: s.strength,
                    rate: s.rate / totalRate
                }));
                const monsterDrops = {};
                for (const spawn of spawns) {
                    const monster = monsterMap[spawn.combatMonsterHrid];
                    if (!monster) continue;
                    const drops = [];
                    if (monster.dropTable) {
                        monster.dropTable.forEach(drop => {
                            drops.push({
                                itemHrid: drop.itemHrid,
                                dropRate: drop.dropRate,
                                minCount: drop.minCount,
                                maxCount: drop.maxCount,
                                isRare: false,
                                dropRatePerDifficultyTier: drop.dropRatePerDifficultyTier || 0
                            });
                        });
                    }
                    if (monster.rareDropTable) {
                        monster.rareDropTable.forEach(drop => {
                            drops.push({
                                itemHrid: drop.itemHrid,
                                dropRate: drop.dropRate,
                                minCount: drop.minCount,
                                maxCount: drop.maxCount,
                                isRare: true,
                                dropRatePerDifficultyTier: drop.dropRatePerDifficultyTier || 0
                            });
                        });
                    }
                    monsterDrops[spawn.combatMonsterHrid] = drops;
                }
                const bossDrops = {};
                if (fightInfo.bossSpawns) {
                    for (const bossSpawn of fightInfo.bossSpawns) {
                        const boss = monsterMap[bossSpawn.combatMonsterHrid];
                        if (!boss) continue;
                        const drops = [];
                        if (boss.dropTable) {
                            boss.dropTable.forEach(drop => {
                                drops.push({
                                    itemHrid: drop.itemHrid,
                                    dropRate: drop.dropRate,
                                    minCount: drop.minCount,
                                    maxCount: drop.maxCount,
                                    isRare: false,
                                    dropRatePerDifficultyTier: drop.dropRatePerDifficultyTier || 0
                                });
                            });
                        }
                        if (boss.rareDropTable) {
                            boss.rareDropTable.forEach(drop => {
                                drops.push({
                                    itemHrid: drop.itemHrid,
                                    dropRate: drop.dropRate,
                                    minCount: drop.minCount,
                                    maxCount: drop.maxCount,
                                    isRare: true,
                                    dropRatePerDifficultyTier: drop.dropRatePerDifficultyTier || 0
                                });
                            });
                        }
                        bossDrops[bossSpawn.combatMonsterHrid] = drops;
                    }
                }
                GameData.mapData[actionHrid] = {
                    name: actionDetail.name,
                    type: mapType,
                    spawnInfo: {
                        maxSpawnCount: spawnInfo.maxSpawnCount,
                        maxTotalStrength: spawnInfo.maxTotalStrength,
                        bossWave: spawnInfo.bossWave || 0,
                        spawns: spawns
                    },
                    monsterDrops: monsterDrops,
                    bossDrops: bossDrops
                };
            }
        }
        if (msg.openableLootDropMap) {
            GameData.openableLootDropMap = msg.openableLootDropMap;
            MarketData.calculateChestValues(GameData.openableLootDropMap);
        }
    });
    MessageHandler.addListener('init_character_data', (msg) => {
        if (msg.character) {
            CharacterData.playerId = msg.character.id;
            CharacterData.playerName = msg.character.name;
        }
        if (msg.characterActions && msg.characterActions[0]) {
            const action = msg.characterActions[0];
            if (action.actionHrid) {
                GameData.currentMapHrid = action.actionHrid;
                GameData.currentDifficultyTier = action.difficultyTier || 0;
                GameData.inBattle = true;
            }
        }
    });

    MessageHandler.addListener('new_battle', (msg) => {
        GameData.inBattle = true;
        const battleId = msg.battleId || 1;
        const battleStartTime = new Date(msg.combatStartTime).getTime() / 1000;
        const difficultyTier = msg.difficultyTier || GameData.currentDifficultyTier || 0;
        if (battleId === 1) {
            const newSessionKey = Math.round(battleStartTime);

            // Delete all old sessions, keep only the new one
            PersistentData.battleSessions = {};
            PersistentData.currentSessionKey = newSessionKey;

            if (msg.players && msg.players.length > 0) {
                const mapHrid = GameData.currentMapHrid;
                const key = `${mapHrid}_${difficultyTier}`;
                PersistentData.previousTotals[key] = {};
                for (const player of msg.players) {
                    if (!player.character) continue;
                    const playerName = player.character.name;
                    PersistentData.previousTotals[key][playerName] = {};
                }
                PersistentData.save();
            }
            return;
        }
        if (msg.players && msg.players.length > 0) {
            let mapHrid = GameData.currentMapHrid;
            let mapName = GameData.mapNames[mapHrid] || mapHrid;
            const key = `${mapHrid}_${difficultyTier}`;
            if (!PersistentData.previousTotals[key]) {

                PersistentData.previousTotals[key] = {};
            }
            const playersData = [];
            for (const player of msg.players) {
                if (!player.character || !player.totalLootMap) continue;
                const playerName = player.character.name;
                if (player.combatDetails && player.combatDetails.combatStats) {
                    const stats = player.combatDetails.combatStats;
                    GameData.playerStats[playerName] = {
                        combatDropQuantity: stats.combatDropQuantity || 0,
                        combatDropRate: stats.combatDropRate || 0,
                        combatRareFind: stats.combatRareFind || 0,

                        allStats: stats
                    };

                }
                if (!PersistentData.previousTotals[key][playerName]) {

                    PersistentData.previousTotals[key][playerName] = {};
                }
                const previousTotal = PersistentData.previousTotals[key][playerName];
                const currentTotal = {};
                const incrementalDrops = {};
                Object.values(player.totalLootMap).forEach(loot => {
                    currentTotal[loot.itemHrid] = loot.count;
                    const previous = previousTotal[loot.itemHrid] || 0;
                    const increment = loot.count - previous;
                    if (increment > 0) {
                        incrementalDrops[loot.itemHrid] = increment;
                    }
                });
                PersistentData.previousTotals[key][playerName] = currentTotal;
                playersData.push({
                    name: playerName,
                    drops: incrementalDrops
                });
            }
            if (mapHrid && playersData.length > 0) {
                const sessionKey = Math.round(battleStartTime);
                PersistentData.currentSessionKey = sessionKey;
                PersistentData.addBattleSession(mapHrid, mapName, battleStartTime, battleId, difficultyTier, playersData);
                if (panel && panel.style.display === 'flex') {
                    updatePanel();
                }
            }
        }

    });

    MessageHandler.addListener('action_completed', (msg) => {
        if (msg.endCharacterAction && msg.endCharacterAction.actionHrid) {
            const previousMap = GameData.currentMapHrid;
            const previousTier = GameData.currentDifficultyTier;
            GameData.currentMapHrid = msg.endCharacterAction.actionHrid;
            GameData.currentDifficultyTier = msg.endCharacterAction.difficultyTier || 0;
            if (previousMap !== GameData.currentMapHrid || previousTier !== GameData.currentDifficultyTier) {
                const key = `${GameData.currentMapHrid}_${GameData.currentDifficultyTier}`;
                delete PersistentData.previousTotals[key];
                PersistentData.save();
            }
        }
    });

    function updatePanel() {
        const content = document.getElementById('mob-drops-content');
        if (!content) {

            return;
        }
        const mapAggregates = {};
        const currentSessionKey = PersistentData.currentSessionKey;
        if (!currentSessionKey || !PersistentData.battleSessions[currentSessionKey]) {
            const html = '<div class="no-drops">No active combat session. Start fighting to see statistics!</div>';
            content.innerHTML = html;
            return;
        }
        for (const [sessionKey, session] of Object.entries(PersistentData.battleSessions)) {
            if (sessionKey !== String(currentSessionKey)) continue;
            const mapHrid = session.mapHrid;
            const tier = session.difficultyTier || 0;
            const partySize = session.partySize || 1;
            const aggregateKey = `${mapHrid}_tier${tier}`;
            if (!mapAggregates[aggregateKey]) {
                mapAggregates[aggregateKey] = {
                    mapHrid: mapHrid,
                    mapName: session.mapName,
                    difficultyTier: tier,
                    totalKills: 0,
                    totalSessions: 0,
                    playerData: {},
                    partySize: partySize,
                    earliestTime: Infinity,
                    latestTime: 0
                };
            }
            const aggregate = mapAggregates[aggregateKey];
            aggregate.totalKills += session.runCount;
            aggregate.totalSessions++;
            if (session.startTime < aggregate.earliestTime) {
                aggregate.earliestTime = session.startTime;
            }
            const sessionEnd = session.latestBattleTime || session.startTime;
            if (sessionEnd > aggregate.latestTime) {
                aggregate.latestTime = sessionEnd;
            }
            if (session.players) {
                for (const player of session.players) {
                    if (!aggregate.playerData[player.name]) {
                        aggregate.playerData[player.name] = {};
                    }

                    for (const [itemHrid, count] of Object.entries(player.drops)) {
                        if (!aggregate.playerData[player.name][itemHrid]) {
                            aggregate.playerData[player.name][itemHrid] = 0;
                        }
                        aggregate.playerData[player.name][itemHrid] += count;
                    }
                }
            }
        }
        let html = '';
        let totalKillsAllMaps = 0;
        let totalSessionsAllMaps = 0;
        let earliestOverall = Infinity;
        let latestOverall = 0;
        for (const aggregate of Object.values(mapAggregates)) {
            totalKillsAllMaps += aggregate.totalKills;
            totalSessionsAllMaps += aggregate.totalSessions;
            if (aggregate.earliestTime < earliestOverall) earliestOverall = aggregate.earliestTime;
            if (aggregate.latestTime > latestOverall) latestOverall = aggregate.latestTime;
        }
        const sessionTimeSeconds = earliestOverall !== Infinity ? (latestOverall - earliestOverall) : 0;
        const sessionTimeHours = sessionTimeSeconds / 3600;
        const encountersPerHour = sessionTimeHours > 0 ? totalKillsAllMaps / sessionTimeHours : 0;
        const hours = Math.floor(sessionTimeHours);
        const minutes = Math.floor((sessionTimeHours - hours) * 60);
        const seconds = Math.floor(((sessionTimeHours - hours) * 60 - minutes) * 60);
        const timeDisplay = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        html += `
            <div class="session-stats">
                <div class="session-stats-title">Overall Statistics</div>
                <div class="session-stat-row">
                    <span>Total Encounters:</span>
                    <span>${totalKillsAllMaps}</span>
                </div>
                <div class="session-stat-row">
                    <span>Session Time:</span>
                    <span id="session-time-display">${timeDisplay}</span>
                </div>
                <div class="session-stat-row">
                    <span>Encounters/Hour:</span>
                    <span>${encountersPerHour.toFixed(1)}</span>
                </div>
            </div>
        `;
        for (const [aggregateKey, aggregate] of Object.entries(mapAggregates)) {
            const mapName = aggregate.mapName;
            const totalKills = aggregate.totalKills;
            const tier = aggregate.difficultyTier;
            const mapData = GameData.mapData[aggregate.mapHrid];
            const mapType = mapData?.type || 'solo';
            const partySize = aggregate.partySize;
            const playerNames = Object.keys(aggregate.playerData);
            let tierDisplay = '';
            if (mapType === 'group' || mapType === 'dungeon') {
                tierDisplay = `<span class="tier-badge">Tier ${tier}</span>`;
            }
            html += `
                <div class="map-section">
                    <div class="map-header">
                        <div class="map-name">${mapName}${tierDisplay} <span style="color: #4ade80; font-size: 0.9em;">&#9679; CURRENT SESSION</span></div>
                        <div class="map-stats">${totalKills} kills, Party: ${partySize}</div>
                    </div>
                    <table class="drop-table">
                        <thead>
                            <tr>
                                <th>Item</th>
            `;
            for (const playerName of playerNames) {
                const stats = GameData.playerStats[playerName];
                let statsText = '';
                if (stats) {
                    const dropQty = (stats.combatDropQuantity * 100).toFixed(3);
                    const dropRate = (stats.combatDropRate * 100).toFixed(3);
                    const rareFind = (stats.combatRareFind * 100).toFixed(3);
                    statsText = `<br><span style="font-size: 9px; font-weight: 400; color: #a0b9ff;">DQ: ${dropQty}% | DR: ${dropRate}% | RF: ${rareFind}%</span>`;
                }
                html += `
                    <th colspan="4" style="text-align: center; border-left: 2px solid rgba(103, 113, 149, 0.5);">${playerName}${statsText}</th>
                `;
            }
            html += `
                                <th colspan="3" style="text-align: center; border-left: 2px solid rgba(103, 113, 149, 0.5);">Total</th>
                                <th colspan="2" style="text-align: center; border-left: 2px solid rgba(103, 113, 149, 0.5);">Total Expected</th>
                            </tr>
                            <tr>
                                <th></th>
            `;
            for (const playerName of playerNames) {
                html += `
                    <th style="border-left: 2px solid rgba(103, 113, 149, 0.5);">Qty</th>
                    <th>Value</th>
                    <th colspan="2" style="text-align: center;">Expected</th>
                `;
            }
            html += `
                                <th style="border-left: 2px solid rgba(103, 113, 149, 0.5);">Qty</th>
                                <th>Value</th>
                                <th>%</th>
                                <th style="border-left: 2px solid rgba(103, 113, 149, 0.5);">Qty</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            const expectedDropsTotal = DropAnalyzer.calculateExpectedDrops(
                aggregate.mapHrid,
                totalKills + 1,
                tier,
                partySize
            );
            const allItems = new Set();
            for (const playerName of playerNames) {
                for (const itemHrid of Object.keys(aggregate.playerData[playerName])) {
                    allItems.add(itemHrid);
                }
            }
            for (const itemHrid of Object.keys(expectedDropsTotal)) {
                const dropData = expectedDropsTotal[itemHrid];
                const expectedCount = typeof dropData === 'number' ? dropData : dropData.count;
                if (expectedCount > 0) {
                    allItems.add(itemHrid);
                }
            }
            const dropsList = [];
            for (const itemHrid of allItems) {
                const itemName = GameData.itemNames[itemHrid] || itemHrid.split('/').pop().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const itemPrice = MarketData.getPrice(itemHrid, 'bid');
                const dropData = expectedDropsTotal[itemHrid] || { count: 0, tierDropRate: 1.0 };
                const baseExpectedTotal = typeof dropData === 'number' ? dropData : dropData.count;
                const tierDropRate = typeof dropData === 'object' ? dropData.tierDropRate : 1.0;
                const isRareItem = Utils.isRareItem(itemHrid);
                const playerStatsData = {};
                let totalActualValue = 0;
                let totalActualQty = 0;
                let totalExpectedQty = 0;
                let totalExpectedValue = 0;
                for (const playerName of playerNames) {
                    const actualCount = aggregate.playerData[playerName][itemHrid] || 0;
                    const actualValue = actualCount * itemPrice;
                    const stats = GameData.playerStats[playerName];
                    let playerExpected = baseExpectedTotal;
                    if (stats) {
                        const isCoin = (itemHrid === "/items/coin");
                        let rateMultiplier;
                        if (isRareItem) {
                            rateMultiplier = (1 + stats.combatRareFind);
                        } else if (isCoin && tierDropRate >= 1.0) {
                            rateMultiplier = 1;
                        } else if (isCoin && tierDropRate < 1.0) {
                            const adjustedRate = Math.min(tierDropRate * (1 + stats.combatDropRate), 1.0);
                            rateMultiplier = adjustedRate / tierDropRate;
                        } else {
                            rateMultiplier = (1 + stats.combatDropRate);
                        }
                        const dungeonMultiplier = mapType === 'dungeon' ? 5 : 1;
                        const quantityMultiplier = (1 + stats.combatDropQuantity) / playerNames.length * dungeonMultiplier;
                        playerExpected = playerExpected * rateMultiplier * quantityMultiplier;
                    } else {
                        playerExpected = playerExpected / playerNames.length;
                    }
                    const playerExpectedValue = playerExpected * itemPrice;
                    const percentOfExpected = playerExpected > 0 ? ((actualCount / playerExpected - 1) * 100) : 0;
                    playerStatsData[playerName] = {
                        actualCount,
                        actualValue,
                        expectedCount: playerExpected,
                        expectedValue: playerExpectedValue,
                        percentOfExpected
                    };
                    totalActualValue += actualValue;
                    totalActualQty += actualCount;
                    totalExpectedQty += playerExpected;
                    totalExpectedValue += playerExpectedValue;
                }
                const totalPercentOfExpected = totalExpectedQty > 0 ? ((totalActualQty / totalExpectedQty - 1) * 100) : 0;
                dropsList.push({
                    itemHrid,
                    itemName,
                    expectedCountTotal: totalExpectedQty,
                    expectedValueTotal: totalExpectedValue,
                    totalPercentOfExpected,
                    playerStats: playerStatsData,
                    totalActualValue,
                    totalActualQty
                });
            }
            dropsList.sort((a, b) => b.totalActualValue - a.totalActualValue);
            const summaryTotals = {
                players: {},
                totalActualValue: 0,
                totalExpectedValue: 0
            };
            for (const playerName of playerNames) {
                summaryTotals.players[playerName] = {
                    actualValue: 0,
                    expectedValue: 0
                };
            }
            for (const drop of dropsList) {
                html += `<tr><td class="item-name">${drop.itemName}</td>`;
                for (const playerName of playerNames) {
                    const stats = drop.playerStats[playerName];
                    const percentClass = Utils.getPercentClass(stats.percentOfExpected);
                    const percentSign = stats.percentOfExpected > 0 ? '+' : '';
                    summaryTotals.players[playerName].actualValue += stats.actualValue;
                    summaryTotals.players[playerName].expectedValue += stats.expectedValue;
                    html += `
                        <td style="border-left: 2px solid rgba(103, 113, 149, 0.5);">${Utils.formatNumber(stats.actualCount)}</td>
                        <td>${Utils.formatNumber(stats.actualValue)}</td>
                        <td>${Utils.formatExpected(stats.expectedCount)}</td>
                        <td class="${percentClass}">${percentSign}${stats.percentOfExpected.toFixed(1)}%</td>
                    `;
                }
                summaryTotals.totalActualValue += drop.totalActualValue;
                summaryTotals.totalExpectedValue += drop.expectedValueTotal;
                const totalPercentClass = Utils.getPercentClass(drop.totalPercentOfExpected);
                const totalPercentSign = drop.totalPercentOfExpected > 0 ? '+' : '';
                html += `
                    <td style="border-left: 2px solid rgba(103, 113, 149, 0.5);">${Utils.formatNumber(drop.totalActualQty)}</td>
                    <td>${Utils.formatNumber(drop.totalActualValue)}</td>
                    <td class="${totalPercentClass}">${totalPercentSign}${drop.totalPercentOfExpected.toFixed(1)}%</td>
                `;
                html += `
                    <td style="border-left: 2px solid rgba(103, 113, 149, 0.5);">${Utils.formatExpected(drop.expectedCountTotal)}</td>
                    <td>${Utils.formatExpected(drop.expectedValueTotal)}</td>
                </tr>
                `;
            }
            html += `
                <tr style="background: rgba(84, 109, 219, 0.15); font-weight: 600; border-top: 2px solid rgba(113, 123, 169, 0.8);">
                    <td class="item-name">TOTAL</td>
            `;
            for (const playerName of playerNames) {
                const playerSummary = summaryTotals.players[playerName];
                const percentDiff = playerSummary.expectedValue > 0
                    ? ((playerSummary.actualValue / playerSummary.expectedValue - 1) * 100)
                    : 0;
                const percentClass = Utils.getPercentClass(percentDiff);
                const percentSign = percentDiff > 0 ? '+' : '';
                html += `
                    <td style="border-left: 2px solid rgba(113, 123, 169, 0.5);"></td>
                    <td>${Utils.formatNumber(playerSummary.actualValue)}</td>
                    <td>${Utils.formatExpected(playerSummary.expectedValue)}</td>
                    <td class="${percentClass}">${percentSign}${percentDiff.toFixed(1)}%</td>
                `;
            }
            const totalPercentDiff = summaryTotals.totalExpectedValue > 0
                ? ((summaryTotals.totalActualValue / summaryTotals.totalExpectedValue - 1) * 100)
                : 0;
            const totalPercentClass = Utils.getPercentClass(totalPercentDiff);
            const totalPercentSign = totalPercentDiff > 0 ? '+' : '';
            html += `
                    <td style="border-left: 2px solid rgba(113, 123, 169, 0.5);"></td>
                    <td>${Utils.formatNumber(summaryTotals.totalActualValue)}</td>
                    <td class="${totalPercentClass}">${totalPercentSign}${totalPercentDiff.toFixed(1)}%</td>
                    <td style="border-left: 2px solid rgba(113, 123, 169, 0.5);"></td>
                    <td>${Utils.formatExpected(summaryTotals.totalExpectedValue)}</td>
                </tr>
            `;
            html += `
                        </tbody>
                    </table>
                </div>
            `;

            // Update header with summary totals
            updateHeaderTitle(summaryTotals);
        }
        if (Object.keys(mapAggregates).length === 0) {
            html = '<div class="no-drops">No combat data recorded yet. Start a battle to track drops!</div>';
            updateHeaderTitle(null);
        }
        content.innerHTML = html;
    }
    function init() {
        PersistentData.load();
        MarketData.init();
        try {
            const cachedData = localStorage.getItem("initClientData");
            if (cachedData && typeof LZString !== 'undefined') {
                const decompressed = LZString.decompressFromUTF16(cachedData);
                if (decompressed && typeof decompressed === 'string') {
                    MessageHandler.handleMessageRecv(decompressed);
                }
            }
        } catch (e) {
        }
        const createPanelWhenReady = () => {
            if (document.body) {
                createPanel();
                const hasSavedData = Object.keys(PersistentData.battleSessions).length > 0;
                if (hasSavedData) {
                    setTimeout(() => {
                        updatePanel();
                    }, 1000);
                }
            } else {
                setTimeout(createPanelWhenReady, 100);
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createPanelWhenReady);
        } else {
            createPanelWhenReady();
        }
    }
    init();
})();
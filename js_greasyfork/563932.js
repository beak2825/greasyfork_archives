// ==UserScript==
// @name         Phantom War v1.0.8 - Intelligence System
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  Ranked war intelligence system for Torn PDA
// @author       Daturax
// @license      GPLv3
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563932/Phantom%20War%20v108%20-%20Intelligence%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/563932/Phantom%20War%20v108%20-%20Intelligence%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        VERSION: '1.0.8',
        UPDATE_INTERVAL: 5000,
        API_INTERVAL: 30000,
        FAB_POSITION_KEY: 'phantomWar_fabPosition',
        NOTES_KEY_PREFIX: 'phantomWar_note_',
        USER_ID_KEY: 'phantomWar_userId',
        USER_NAME_KEY: 'phantomWar_userName',
        LAST_USER_UPDATE_KEY: 'phantomWar_lastUserUpdate',
        API_KEY: '###PDA-APIKEY###',
        BASE_API_URL: 'https://api.torn.com/v2',
        TORNSTATS_BASE_URL: 'https://www.tornstats.com/api/v2',
        FACTION_TAGS_URL: 'https://factiontags.torn.com',
        LONG_PRESS_DELAY: 500,
        SNAP_THRESHOLD: 20,
        DRAG_THRESHOLD: 5,
        DIFFICULTY_RANGES: {
            VERY_HARD: 1.5,
            HARD: 1.0,
            FAIR: 0.5,
            EASY: 0.25,
            VERY_EASY: 0.0
        },
        CHAIN_WARNING_ENABLED: true,
        CHAIN_WARNING_THRESHOLD: 45,
        MAX_RETRIES: 3,
        CACHE_DURATION: 60000,
        USER_UPDATE_INTERVAL: 604800000,
        LOGO_URL: 'https://images2.imgbox.com/fd/9e/2stE8Ksv_o.png'
    };

    let state = {
        warData: null,
        tornStatsData: null,
        userFaction: null,
        enemyFaction: null,
        isWindowOpen: false,
        activeTab: 'overview',
        pollInterval: null,
        apiInterval: null,
        lastUpdate: null,
        fabPosition: { x: 20, y: 120 },
        isDragging: false,
        longPressTimer: null,
        dragStartPos: { x: 0, y: 0 },
        openProfile: null,
        chainWarningShown: false,
        userInfo: {
            id: null,
            name: null,
            level: 0,
            faction_id: null,
            lastUpdated: 0
        },
        userStats: {
            total: 0,
            strength: 0,
            defense: 0,
            speed: 0,
            dexterity: 0,
            intelligence: 0,
            endurance: 0,
            manual_labor: 0,
            totalAllStats: 0
        },
        cache: {
            tornStats: { data: null, timestamp: 0 },
            warData: { data: null, timestamp: 0 },
            userStats: { data: null, timestamp: 0 },
            userInfo: { data: null, timestamp: 0 }
        },
        retryCounts: {
            tornStats: 0,
            warData: 0,
            userStats: 0,
            userInfo: 0
        },
        isInitialized: false,
        toastContainer: null,
        uiState: {
            sortAllStats: false
        }
    };

    const IntelligenceDB = {
        notes: {},
        playerCache: {},
        
        init() {
            this.loadAllNotes();
            this.loadPlayerCache();
        },
        
        loadAllNotes() {
            const allStorage = GM_listValues?.() || [];
            const noteKeys = allStorage.filter(key => key.startsWith(CONFIG.NOTES_KEY_PREFIX));
            
            noteKeys.forEach(key => {
                const playerId = key.replace(CONFIG.NOTES_KEY_PREFIX, '');
                const note = GM_getValue(key, '');
                this.notes[playerId] = note;
            });
        },
        
        loadPlayerCache() {
            const cache = GM_getValue('phantomWar_playerCache', null);
            if (cache) {
                this.playerCache = cache;
            }
        },
        
        savePlayerCache() {
            GM_setValue('phantomWar_playerCache', this.playerCache);
        },
        
        getNote(playerId) {
            const key = `${CONFIG.NOTES_KEY_PREFIX}${playerId}`;
            if (this.notes[playerId] === undefined) {
                this.notes[playerId] = GM_getValue(key, '');
            }
            return this.notes[playerId];
        },
        
        saveNote(playerId, note) {
            const key = `${CONFIG.NOTES_KEY_PREFIX}${playerId}`;
            GM_setValue(key, note);
            this.notes[playerId] = note;
        },
        
        getPlayerIntelligence(playerId, playerData) {
            const currentWarId = state.warData?.wars?.ranked?.war_id;
            const cacheKey = `${playerId}_${currentWarId}`;
            
            if (this.playerCache[cacheKey] && 
                Date.now() - this.playerCache[cacheKey].timestamp < CONFIG.CACHE_DURATION) {
                return this.playerCache[cacheKey];
            }
            
            const intel = {
                id: playerId,
                name: playerData.name || 'Unknown',
                level: playerData.level || 0,
                rank: playerData.position || 'Unknown',
                stats: this.analyzeStats(playerData),
                combat: this.analyzeCombat(playerData),
                patterns: this.analyzePatterns(playerData),
                note: this.getNote(playerId),
                timestamp: Date.now()
            };
            
            this.playerCache[cacheKey] = intel;
            this.savePlayerCache();
            
            return intel;
        },
        
        analyzeStats(playerData) {
            const spy = playerData.spy || {};
            const total = spy.total || 0;
            return {
                total: total,
                strength: spy.strength || 0,
                defense: spy.defense || 0,
                speed: spy.speed || 0,
                dexterity: spy.dexterity || 0,
                totalBattleStats: total,
                timestamp: spy.timestamp || 0,
                age: spy.timestamp ? Math.floor((Date.now()/1000 - spy.timestamp)/86400) : 'Unknown'
            };
        },
        
        analyzeCombat(playerData) {
            const stats = playerData.personalstats || {};
            const attacksWon = stats['Attacks Won'] || 0;
            const attacksLost = stats['Attacks Lost'] || 0;
            const totalAttacks = attacksWon + attacksLost;
            
            return {
                attacksWon: attacksWon,
                attacksLost: attacksLost,
                winRate: totalAttacks > 0 ? Math.round((attacksWon / totalAttacks) * 100) : 0,
                totalRespect: stats['Total Respect Gained'] || 0,
                rankedWins: stats['Ranked warring wins'] || 0,
                bestKillStreak: stats['Best Kill Streak'] || 0,
                xanaxUsed: stats['Xanax Taken'] || 0,
                boostersUsed: stats['Boosters Used'] || 0,
                refills: stats['Refills'] || 0,
                totalAttacks: totalAttacks
            };
        },
        
        analyzePatterns(playerData) {
            const lastAction = playerData.last_action || {};
            const status = playerData.status || {};
            
            return {
                lastSeen: lastAction.timestamp || 0,
                lastSeenRelative: lastAction.relative || 'Unknown',
                status: status.state || 'Unknown',
                location: status.description || 'Unknown',
                activity: playerData.personalstats?.['User Activity'] || 0,
                dangerLevel: this.calculateDangerLevel(playerData)
            };
        },
        
        calculateDangerLevel(playerData) {
            const stats = playerData.personalstats || {};
            const attacks = stats['Attacks Won'] || 0;
            const wins = stats['Ranked warring wins'] || 0;
            
            if (attacks > 5000 && wins > 20) return 'HIGH';
            if (attacks > 2000 && wins > 10) return 'MEDIUM-HIGH';
            if (attacks > 1000 && wins > 5) return 'MEDIUM';
            if (attacks > 500) return 'LOW-MEDIUM';
            return 'LOW';
        },
        
        getDifficulty(enemyStats) {
            const userTotal = state.userStats.total;
            
            if (!userTotal || !enemyStats.total) {
                if (!userTotal && enemyStats.total) {
                    if (enemyStats.total > 200000000) return 'VERY_HARD';
                    if (enemyStats.total > 100000000) return 'HARD';
                    if (enemyStats.total > 50000000) return 'FAIR';
                    if (enemyStats.total > 25000000) return 'EASY';
                    return 'VERY_EASY';
                }
                return 'UNKNOWN';
            }
            
            const ratio = enemyStats.total / userTotal;
            
            if (ratio >= CONFIG.DIFFICULTY_RANGES.VERY_HARD) return 'VERY_HARD';
            if (ratio >= CONFIG.DIFFICULTY_RANGES.HARD) return 'HARD';
            if (ratio >= CONFIG.DIFFICULTY_RANGES.FAIR) return 'FAIR';
            if (ratio >= CONFIG.DIFFICULTY_RANGES.EASY) return 'EASY';
            return 'VERY_EASY';
        },
        
        getDifficultyText(difficulty) {
            const texts = {
                'VERY_HARD': '⚠️ VERY HARD (150%+)',
                'HARD': '🔴 HARD (100-150%)',
                'FAIR': '🟡 FAIR (50-100%)',
                'EASY': '🟢 EASY (25-50%)',
                'VERY_EASY': '💚 VERY EASY (<25%)',
                'UNKNOWN': '⚠️ CALCULATING...'
            };
            return texts[difficulty] || texts['UNKNOWN'];
        },
        
        getDifficultyColor(difficulty) {
            const colors = {
                'VERY_HARD': '#ff4444',
                'HARD': '#ff6b6b',
                'FAIR': '#ffd93d',
                'EASY': '#6bcf7f',
                'VERY_EASY': '#4caf50',
                'UNKNOWN': '#aaaaaa'
            };
            return colors[difficulty] || colors['UNKNOWN'];
        },
        
        getTopPlayers(teamData, count = 10) {
            if (!teamData || !teamData.members) return [];
            
            return Object.values(teamData.members)
                .filter(member => member && member.spy?.total)
                .sort((a, b) => {
                    const aStats = a.spy?.total || 0;
                    const bStats = b.spy?.total || 0;
                    return bStats - aStats;
                })
                .slice(0, count);
        }
    };

    function initialize() {
        if (state.isInitialized) return;
        
        const savedPos = GM_getValue(CONFIG.FAB_POSITION_KEY, null);
        if (savedPos) {
            state.fabPosition = savedPos;
        }
        
        loadUserInfo();
        IntelligenceDB.init();
        injectStyles();
        createToastContainer();
        createFAB();
        setupPageListeners();
        
        setTimeout(() => {
            startPolling();
            fetchUserStats();
            fetchUserInfo();
        }, 1000);
        
        state.isInitialized = true;
    }

    function injectStyles() {
        const css = `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
            
            :root {
                --primary-color: #00ffea;
                --secondary-color: #ff0055;
                --accent-color: #9d00ff;
                --dark-bg: #0a0a14;
                --darker-bg: #05050a;
                --panel-bg: rgba(10, 15, 30, 0.95);
                --panel-border: rgba(0, 255, 234, 0.3);
                --text-primary: #ffffff;
                --text-secondary: #a0a0c0;
                --text-dim: #666688;
                --danger-color: #ff4444;
                --warning-color: #ffaa00;
                --success-color: #00ff88;
                --info-color: #00aaff;
                --font-main: 'Rajdhani', sans-serif;
                --font-display: 'Orbitron', monospace;
            }
            
            .phantom-war-toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000001;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            }
            
            .phantom-war-toast {
                background: var(--panel-bg);
                backdrop-filter: blur(10px);
                border: 1px solid var(--panel-border);
                border-left: 4px solid var(--primary-color);
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                animation: toastSlideIn 0.3s ease-out;
                transform: translateX(0);
                transition: all 0.3s ease;
            }
            
            .phantom-war-toast.warning {
                border-left-color: var(--warning-color);
                background: rgba(255, 170, 0, 0.05);
            }
            
            .phantom-war-toast.danger {
                border-left-color: var(--danger-color);
                background: rgba(255, 68, 68, 0.05);
            }
            
            .phantom-war-toast.success {
                border-left-color: var(--success-color);
                background: rgba(0, 255, 136, 0.05);
            }
            
            .phantom-war-toast.hiding {
                transform: translateX(100%);
                opacity: 0;
            }
            
            @keyframes toastSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .toast-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .toast-title {
                font-family: var(--font-display);
                font-size: 12px;
                font-weight: 700;
                color: var(--primary-color);
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: var(--text-dim);
                font-size: 14px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }
            
            .toast-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
            }
            
            .toast-content {
                font-size: 11px;
                color: var(--text-secondary);
                line-height: 1.4;
            }
            
            .phantom-war-fab {
                position: fixed;
                z-index: 999999;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(145deg, var(--dark-bg), var(--darker-bg));
                box-shadow: 
                    0 0 25px rgba(0, 255, 234, 0.6),
                    0 4px 15px rgba(0, 0, 0, 0.8),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    0 0 0 1px rgba(0, 255, 234, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                touch-action: none;
                user-select: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                animation: fabGlow 2s infinite alternate;
            }
            
            .phantom-war-fab::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('${CONFIG.LOGO_URL}') center/70% no-repeat;
                filter: invert(1) brightness(2) drop-shadow(0 0 5px rgba(0, 255, 234, 0.8));
                transition: all 0.3s;
            }
            
            @keyframes fabGlow {
                0% { 
                    box-shadow: 
                        0 0 15px rgba(0, 255, 234, 0.4),
                        0 4px 12px rgba(0, 0, 0, 0.8),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        0 0 0 1px rgba(0, 255, 234, 0.2);
                }
                100% { 
                    box-shadow: 
                        0 0 30px rgba(0, 255, 234, 0.8),
                        0 4px 20px rgba(0, 0, 0, 0.9),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        0 0 0 1px rgba(0, 255, 234, 0.5);
                }
            }
            
            .phantom-war-fab:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 
                    0 0 35px rgba(0, 255, 234, 0.9),
                    0 6px 25px rgba(0, 0, 0, 0.9),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3),
                    0 0 0 1px rgba(0, 255, 234, 0.6);
            }
            
            .phantom-war-fab:active {
                transform: scale(0.95);
                transition: transform 0.1s;
            }
            
            .phantom-war-fab.dragging {
                transform: scale(1.15);
                box-shadow: 
                    0 0 40px var(--primary-color),
                    0 8px 30px rgba(0, 0, 0, 0.95),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4),
                    0 0 0 2px var(--primary-color);
            }
            
            .phantom-war-fab.snap-highlight {
                animation: snapPulse 0.5s infinite alternate;
            }
            
            @keyframes snapPulse {
                0% { box-shadow: 0 0 15px rgba(0, 255, 234, 0.5); }
                100% { box-shadow: 0 0 30px var(--secondary-color); }
            }
            
            .phantom-war-window {
                position: fixed;
                top: 10px;
                left: 10px;
                right: 10px;
                z-index: 999998;
                background: var(--panel-bg);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 1px solid var(--panel-border);
                box-shadow: 
                    0 15px 40px rgba(0, 0, 0, 0.8),
                    0 0 0 1px rgba(0, 255, 234, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                overflow: hidden;
                display: none;
                max-height: calc(100vh - 20px);
                font-family: var(--font-main);
                animation: windowSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes windowSlideIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .phantom-war-header {
                background: linear-gradient(90deg, var(--darker-bg), rgba(10, 15, 30, 0.9));
                padding: 14px 20px;
                border-bottom: 1px solid var(--panel-border);
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                overflow: hidden;
            }
            
            .phantom-war-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
            }
            
            .phantom-war-title {
                font-family: var(--font-display);
                font-size: 16px;
                font-weight: 700;
                color: var(--primary-color);
                letter-spacing: 1.5px;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .phantom-war-title::before {
                content: '';
                display: inline-block;
                width: 24px;
                height: 24px;
                background: url('${CONFIG.LOGO_URL}') center/contain no-repeat;
                filter: invert(1) brightness(2);
            }
            
            .phantom-war-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .phantom-war-btn {
                background: rgba(0, 255, 234, 0.1);
                border: 1px solid var(--panel-border);
                border-radius: 6px;
                color: var(--primary-color);
                padding: 8px 14px;
                font-family: var(--font-main);
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 6px;
                backdrop-filter: blur(5px);
            }
            
            .phantom-war-btn:hover {
                background: rgba(0, 255, 234, 0.2);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 255, 234, 0.2);
            }
            
            .phantom-war-btn:active {
                transform: translateY(0);
            }
            
            .phantom-war-btn.close {
                background: rgba(255, 0, 85, 0.1);
                color: var(--secondary-color);
                border-color: rgba(255, 0, 85, 0.3);
            }
            
            .phantom-war-tabs {
                display: flex;
                background: var(--darker-bg);
                border-bottom: 1px solid var(--panel-border);
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                padding: 0 10px;
            }
            
            .phantom-war-tab {
                padding: 12px 20px;
                font-family: var(--font-main);
                font-size: 12px;
                font-weight: 600;
                color: var(--text-secondary);
                white-space: nowrap;
                border: none;
                background: transparent;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
                letter-spacing: 0.8px;
                backdrop-filter: blur(5px);
            }
            
            .phantom-war-tab:hover {
                color: var(--primary-color);
                background: rgba(0, 255, 234, 0.05);
            }
            
            .phantom-war-tab.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
                background: linear-gradient(to top, rgba(0, 255, 234, 0.1), transparent);
            }
            
            .phantom-war-content {
                padding: 20px;
                overflow-y: auto;
                max-height: calc(100vh - 140px);
                -webkit-overflow-scrolling: touch;
            }
            
            .phantom-war-section {
                background: rgba(5, 10, 20, 0.6);
                border-radius: 8px;
                border: 1px solid var(--panel-border);
                padding: 20px;
                margin-bottom: 20px;
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(5px);
            }
            
            .section-header {
                font-family: var(--font-display);
                font-size: 14px;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .section-header::after {
                content: '';
                flex: 1;
                margin-left: 15px;
                height: 1px;
                background: linear-gradient(90deg, var(--primary-color), transparent);
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .stat-card {
                background: rgba(10, 20, 40, 0.7);
                border: 1px solid rgba(0, 255, 234, 0.15);
                border-radius: 6px;
                padding: 12px;
                transition: all 0.3s;
                backdrop-filter: blur(5px);
                cursor: pointer;
            }
            
            .stat-card:hover {
                border-color: var(--primary-color);
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0, 255, 234, 0.15);
            }
            
            .stat-label {
                font-size: 10px;
                color: var(--text-dim);
                text-transform: uppercase;
                letter-spacing: 0.8px;
                margin-bottom: 6px;
            }
            
            .stat-value {
                font-family: var(--font-display);
                font-size: 20px;
                font-weight: 700;
                color: var(--primary-color);
                line-height: 1;
            }
            
            .stat-subvalue {
                font-size: 11px;
                color: var(--text-secondary);
                margin-top: 4px;
            }
            
            .progress-container {
                background: rgba(0, 0, 0, 0.6);
                border-radius: 2px;
                height: 12px;
                overflow: hidden;
                margin: 10px 0;
                border: 1px solid rgba(0, 255, 234, 0.2);
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, 
                    rgba(0, 255, 234, 0.8), 
                    rgba(157, 0, 255, 0.8),
                    rgba(0, 255, 234, 0.8));
                border-radius: 1px;
                transition: width 0.5s ease-out;
                position: relative;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 255, 234, 0.5);
            }
            
            .progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.6), 
                    transparent);
                animation: progressShine 1.5s infinite;
            }
            
            @keyframes progressShine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .target-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .target-card {
                background: rgba(20, 25, 40, 0.7);
                border: 1px solid rgba(0, 255, 234, 0.15);
                border-radius: 6px;
                padding: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s;
                backdrop-filter: blur(5px);
            }
            
            .target-card:hover {
                border-color: var(--primary-color);
                background: rgba(20, 25, 40, 0.9);
            }
            
            .target-card.unattackable {
                opacity: 0.7;
                border-color: rgba(255, 68, 68, 0.3);
            }
            
            .target-card.risky {
                border-color: rgba(0, 170, 255, 0.4);
            }
            
            .target-info {
                flex: 1;
            }
            
            .target-name {
                font-family: var(--font-main);
                font-size: 13px;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 4px;
            }
            
            .target-meta {
                display: flex;
                gap: 10px;
                font-size: 10px;
                color: var(--text-secondary);
                flex-wrap: wrap;
            }
            
            .target-status {
                font-size: 10px;
                padding: 3px 8px;
                border-radius: 4px;
                display: inline-block;
                font-weight: 600;
            }
            
            .target-status.green {
                background: rgba(0, 255, 136, 0.15);
                color: var(--success-color);
                border: 1px solid rgba(0, 255, 136, 0.3);
            }
            
            .target-status.blue {
                background: rgba(0, 170, 255, 0.15);
                color: var(--info-color);
                border: 1px solid rgba(0, 170, 255, 0.3);
            }
            
            .target-status.red {
                background: rgba(255, 68, 68, 0.15);
                color: var(--danger-color);
                border: 1px solid rgba(255, 68, 68, 0.3);
            }
            
            .target-actions {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            
            .action-btn {
                padding: 5px 12px;
                font-size: 10px;
                font-weight: 600;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid;
                backdrop-filter: blur(5px);
                white-space: nowrap;
            }
            
            .action-btn.attack {
                background: rgba(255, 0, 85, 0.15);
                border-color: rgba(255, 0, 85, 0.4);
                color: var(--secondary-color);
            }
            
            .action-btn.attack:hover {
                background: rgba(255, 0, 85, 0.25);
                transform: translateY(-1px);
                box-shadow: 0 4px 10px rgba(255, 0, 85, 0.2);
            }
            
            .action-btn.info {
                background: rgba(0, 255, 234, 0.15);
                border-color: var(--panel-border);
                color: var(--primary-color);
            }
            
            .action-btn.info:hover {
                background: rgba(0, 255, 234, 0.25);
                transform: translateY(-1px);
                box-shadow: 0 4px 10px rgba(0, 255, 234, 0.2);
            }
            
            .difficulty-badge {
                display: inline-block;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.6px;
            }
            
            .top-players-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-top: 15px;
            }
            
            @media (max-width: 768px) {
                .top-players-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            .top-player-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .top-player-card {
                background: rgba(20, 25, 40, 0.7);
                border: 1px solid rgba(0, 255, 234, 0.15);
                border-radius: 6px;
                padding: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.2s;
            }
            
            .top-player-card:hover {
                border-color: var(--primary-color);
                background: rgba(20, 25, 40, 0.9);
            }
            
            .top-player-rank {
                width: 28px;
                height: 28px;
                background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-display);
                font-size: 12px;
                font-weight: 700;
                color: white;
            }
            
            .top-player-info {
                flex: 1;
            }
            
            .top-player-name {
                font-size: 12px;
                font-weight: 600;
                color: var(--text-primary);
            }
            
            .top-player-stats {
                font-size: 10px;
                color: var(--text-secondary);
            }
            
            .profile-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000000;
                background: var(--panel-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--panel-border);
                border-radius: 12px;
                box-shadow: 
                    0 25px 70px rgba(0, 0, 0, 0.9),
                    0 0 0 1px rgba(0, 255, 234, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                width: 90vw;
                max-width: 550px;
                max-height: 80vh;
                overflow: hidden;
                animation: modalAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes modalAppear {
                from { opacity: 0; transform: translate(-50%, -40%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            
            .profile-header {
                background: linear-gradient(90deg, var(--darker-bg), rgba(10, 15, 30, 0.9));
                padding: 18px;
                border-bottom: 1px solid var(--panel-border);
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .profile-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
            }
            
            .profile-title {
                font-family: var(--font-display);
                font-size: 15px;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 5px;
            }
            
            .profile-subtitle {
                font-size: 11px;
                color: var(--text-secondary);
            }
            
            .profile-close {
                background: rgba(255, 0, 85, 0.1);
                border: 1px solid rgba(255, 0, 85, 0.3);
                border-radius: 6px;
                color: var(--secondary-color);
                padding: 6px 12px;
                font-family: var(--font-main);
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .profile-close:hover {
                background: rgba(255, 0, 85, 0.2);
                transform: translateY(-1px);
            }
            
            .profile-content {
                padding: 20px;
                overflow-y: auto;
                max-height: 60vh;
            }
            
            .profile-section {
                margin-bottom: 25px;
            }
            
            .profile-section-title {
                font-family: var(--font-display);
                font-size: 12px;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                padding-bottom: 6px;
                border-bottom: 1px solid var(--panel-border);
            }
            
            .stat-bars {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .stat-bar {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .stat-bar-label {
                width: 90px;
                font-size: 10px;
                color: var(--text-dim);
                text-transform: uppercase;
                letter-spacing: 0.8px;
            }
            
            .stat-bar-value {
                width: 70px;
                font-family: var(--font-display);
                font-size: 12px;
                font-weight: 600;
                color: var(--text-primary);
            }
            
            .stat-bar-track {
                flex: 1;
                height: 12px;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 2px;
                overflow: hidden;
                border: 1px solid rgba(0, 255, 234, 0.2);
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
            }
            
            .stat-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, 
                    rgba(0, 255, 234, 0.8), 
                    rgba(157, 0, 255, 0.8),
                    rgba(0, 255, 234, 0.8));
                border-radius: 1px;
                box-shadow: 0 0 8px rgba(0, 255, 234, 0.4);
            }
            
            .notes-container {
                margin-top: 20px;
            }
            
            .notes-textarea {
                width: 100%;
                height: 90px;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid var(--panel-border);
                border-radius: 6px;
                padding: 10px;
                font-family: var(--font-main);
                font-size: 11px;
                color: var(--text-primary);
                resize: vertical;
                backdrop-filter: blur(5px);
            }
            
            .notes-textarea:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(0, 255, 234, 0.2);
            }
            
            .notes-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 10px;
            }
            
            .faction-header {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .faction-icon-container {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .faction-icon {
                width: 50px;
                height: 50px;
                border-radius: 6px;
                border: 1px solid var(--panel-border);
                background: rgba(0, 0, 0, 0.4);
                object-fit: cover;
                flex-shrink: 0;
            }
            
            .faction-details {
                flex: 1;
            }
            
            .faction-name {
                font-family: var(--font-display);
                font-size: 15px;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 4px;
            }
            
            .faction-tag {
                font-size: 11px;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 1.2px;
                margin-bottom: 10px;
            }
            
            .faction-info {
                font-size: 11px;
                color: var(--text-secondary);
                line-height: 1.6;
                background: rgba(0, 0, 0, 0.3);
                padding: 10px;
                border-radius: 6px;
                border: 1px solid rgba(0, 255, 234, 0.1);
            }
            
            .timestamp {
                font-size: 10px;
                color: var(--text-dim);
                text-align: center;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid var(--panel-border);
            }
            
            .settings-toggle {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                padding: 10px;
                background: rgba(20, 25, 40, 0.7);
                border-radius: 6px;
                border: 1px solid var(--panel-border);
            }
            
            .toggle-label {
                font-size: 11px;
                color: var(--text-secondary);
                flex: 1;
            }
            
            .toggle-switch {
                position: relative;
                width: 44px;
                height: 24px;
            }
            
            .toggle-checkbox {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 68, 68, 0.3);
                transition: .4s;
                border-radius: 24px;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            .toggle-checkbox:checked + .toggle-slider {
                background-color: rgba(0, 255, 136, 0.3);
            }
            
            .toggle-checkbox:checked + .toggle-slider:before {
                transform: translateX(20px);
            }
            
            ::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            
            ::-webkit-scrollbar-track {
                background: rgba(10, 15, 30, 0.8);
                border-radius: 2px;
                border: 1px solid rgba(0, 255, 234, 0.2);
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
            }
            
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(45deg, 
                    rgba(0, 255, 234, 0.8), 
                    rgba(157, 0, 255, 0.8),
                    rgba(0, 255, 234, 0.8));
                border-radius: 2px;
                border: 1px solid rgba(0, 255, 234, 0.4);
                box-shadow: 0 0 8px rgba(0, 255, 234, 0.3);
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(45deg, 
                    rgba(157, 0, 255, 0.8),
                    rgba(0, 255, 234, 0.8),
                    rgba(157, 0, 255, 0.8));
                box-shadow: 0 0 12px rgba(0, 255, 234, 0.5);
            }
            
            ::-webkit-scrollbar-corner {
                background: transparent;
            }
            
            @media (max-width: 768px) {
                .phantom-war-window {
                    left: 5px;
                    right: 5px;
                    top: 5px;
                    max-height: calc(100vh - 10px);
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .target-card {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .target-actions {
                    width: 100%;
                    justify-content: flex-end;
                }
                
                .profile-modal {
                    width: 95vw;
                    max-height: 90vh;
                }
                
                .phantom-war-tab {
                    padding: 10px 15px;
                    font-size: 11px;
                }
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .slide-in {
                animation: slideIn 0.3s ease-out;
            }
        `;
        
        GM_addStyle(css);
    }

    function createToastContainer() {
        state.toastContainer = document.createElement('div');
        state.toastContainer.className = 'phantom-war-toast-container';
        document.body.appendChild(state.toastContainer);
    }
    
    function showToast(message, type = 'info', duration = 5000) {
        if (!state.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `phantom-war-toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-title">${type.toUpperCase()}</div>
                <button class="toast-close">✕</button>
            </div>
            <div class="toast-content">${message}</div>
        `;
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => hideToast(toast));
        
        state.toastContainer.appendChild(toast);
        
        if (duration > 0) {
            setTimeout(() => hideToast(toast), duration);
        }
        
        return toast;
    }
    
    function hideToast(toast) {
        if (!toast || !toast.parentNode) return;
        
        toast.classList.add('hiding');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    function createFAB() {
        const fab = document.createElement('div');
        fab.className = 'phantom-war-fab';
        fab.style.left = `${state.fabPosition.x}px`;
        fab.style.top = `${state.fabPosition.y}px`;
        fab.setAttribute('title', 'Phantom War - Tap to open, long press to move');
        
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let isPotentialTap = true;
        
        fab.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const touch = e.touches[0];
            touchStartTime = Date.now();
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isPotentialTap = true;
            
            state.longPressTimer = setTimeout(() => {
                if (isPotentialTap) {
                    isPotentialTap = false;
                    state.isDragging = true;
                    fab.classList.add('dragging');
                    
                    const rect = fab.getBoundingClientRect();
                    state.dragStartPos = {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top
                    };
                }
            }, CONFIG.LONG_PRESS_DELAY);
        }, { passive: false });
        
        document.addEventListener('touchmove', function(e) {
            if (!state.isDragging && isPotentialTap) {
                const touch = e.touches[0];
                const dx = Math.abs(touch.clientX - touchStartX);
                const dy = Math.abs(touch.clientY - touchStartY);
                
                if (dx > CONFIG.DRAG_THRESHOLD || dy > CONFIG.DRAG_THRESHOLD) {
                    isPotentialTap = false;
                    clearTimeout(state.longPressTimer);
                }
            }
            
            if (state.isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                
                const newX = touch.clientX - state.dragStartPos.x;
                const newY = touch.clientY - state.dragStartPos.y;
                
                const maxX = window.innerWidth - fab.offsetWidth;
                const maxY = window.innerHeight - fab.offsetHeight;
                
                fab.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
                fab.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
                
                checkFABSnapping(fab, newX, newY);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', function(e) {
            clearTimeout(state.longPressTimer);
            
            if (state.isDragging) {
                state.isDragging = false;
                fab.classList.remove('dragging', 'snap-highlight');
                
                const rect = fab.getBoundingClientRect();
                state.fabPosition = {
                    x: rect.left,
                    y: rect.top
                };
                GM_setValue(CONFIG.FAB_POSITION_KEY, state.fabPosition);
                
                applyFABSnap(fab, rect.left, rect.top);
            } else if (isPotentialTap) {
                const touchDuration = Date.now() - touchStartTime;
                
                if (touchDuration < CONFIG.LONG_PRESS_DELAY) {
                    toggleWindow();
                }
            }
            
            isPotentialTap = false;
        });
        
        fab.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.button !== 0) return;
            
            touchStartTime = Date.now();
            touchStartX = e.clientX;
            touchStartY = e.clientY;
            isPotentialTap = true;
            
            state.longPressTimer = setTimeout(() => {
                if (isPotentialTap) {
                    isPotentialTap = false;
                    state.isDragging = true;
                    fab.classList.add('dragging');
                    
                    state.dragStartPos = {
                        x: e.clientX - fab.offsetLeft,
                        y: e.clientY - fab.offsetTop
                    };
                }
            }, CONFIG.LONG_PRESS_DELAY);
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!state.isDragging && isPotentialTap) {
                const dx = Math.abs(e.clientX - touchStartX);
                const dy = Math.abs(e.clientY - touchStartY);
                
                if (dx > CONFIG.DRAG_THRESHOLD || dy > CONFIG.DRAG_THRESHOLD) {
                    isPotentialTap = false;
                    clearTimeout(state.longPressTimer);
                }
            }
            
            if (state.isDragging) {
                e.preventDefault();
                
                const newX = e.clientX - state.dragStartPos.x;
                const newY = e.clientY - state.dragStartPos.y;
                
                const maxX = window.innerWidth - fab.offsetWidth;
                const maxY = window.innerHeight - fab.offsetHeight;
                
                fab.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
                fab.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
                
                checkFABSnapping(fab, newX, newY);
            }
        });
        
        document.addEventListener('mouseup', function(e) {
            clearTimeout(state.longPressTimer);
            
            if (state.isDragging) {
                state.isDragging = false;
                fab.classList.remove('dragging', 'snap-highlight');
                
                const rect = fab.getBoundingClientRect();
                state.fabPosition = {
                    x: rect.left,
                    y: rect.top
                };
                GM_setValue(CONFIG.FAB_POSITION_KEY, state.fabPosition);
                
                applyFABSnap(fab, rect.left, rect.top);
            } else if (isPotentialTap) {
                const clickDuration = Date.now() - touchStartTime;
                
                if (clickDuration < CONFIG.LONG_PRESS_DELAY) {
                    toggleWindow();
                }
            }
            
            isPotentialTap = false;
        });
        
        document.body.appendChild(fab);
        return fab;
    }
    
    function checkFABSnapping(fab, x, y) {
        const otherFabs = document.querySelectorAll('.phantom-war-fab, .nano-fab, [class*="fab"]');
        let isSnapping = false;
        
        otherFabs.forEach(otherFab => {
            if (otherFab === fab) return;
            
            const rect = otherFab.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(x - rect.left, 2) + 
                Math.pow(y - rect.top, 2)
            );
            
            if (distance < CONFIG.SNAP_THRESHOLD) {
                isSnapping = true;
            }
        });
        
        if (isSnapping) {
            fab.classList.add('snap-highlight');
        } else {
            fab.classList.remove('snap-highlight');
        }
    }
    
    function applyFABSnap(fab, x, y) {
        const otherFabs = document.querySelectorAll('.phantom-war-fab, .nano-fab, [class*="fab"]');
        let closestFab = null;
        let minDistance = Infinity;
        
        otherFabs.forEach(otherFab => {
            if (otherFab === fab) return;
            
            const rect = otherFab.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(x - rect.left, 2) + 
                Math.pow(y - rect.top, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestFab = otherFab;
            }
        });
        
        if (closestFab && minDistance < CONFIG.SNAP_THRESHOLD) {
            const targetRect = closestFab.getBoundingClientRect();
            fab.style.left = `${targetRect.left}px`;
            fab.style.top = `${targetRect.top}px`;
            
            state.fabPosition = {
                x: targetRect.left,
                y: targetRect.top
            };
            GM_setValue(CONFIG.FAB_POSITION_KEY, state.fabPosition);
        }
    }

    function createWindow() {
        const window = document.createElement('div');
        window.className = 'phantom-war-window';
        window.style.display = 'none';
        
        window.innerHTML = `
            <div class="phantom-war-header">
                <div class="phantom-war-title">
                    PHANTOM WAR v${CONFIG.VERSION}
                </div>
                <div class="phantom-war-controls">
                    <button class="phantom-war-btn refresh" title="Refresh Intelligence">
                        <span>⟳</span> Refresh
                    </button>
                    <button class="phantom-war-btn close" title="Close">
                        <span>✕</span> Close
                    </button>
                </div>
            </div>
            <div class="phantom-war-tabs">
                <button class="phantom-war-tab active" data-tab="overview">OVERVIEW</button>
                <button class="phantom-war-tab" data-tab="enemies">ENEMY TARGETS</button>
                <button class="phantom-war-tab" data-tab="ourteam">OUR TEAM</button>
                <button class="phantom-war-tab" data-tab="top">TOP PLAYERS</button>
                <button class="phantom-war-tab" data-tab="chains">CHAIN ANALYSIS</button>
                <button class="phantom-war-tab" data-tab="intel">INTELLIGENCE</button>
            </div>
            <div class="phantom-war-content" id="phantom-war-content">
                <div class="phantom-war-section">
                    <div class="section-header">INITIALIZING</div>
                    <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                        Loading intelligence data...
                    </div>
                </div>
            </div>
        `;
        
        window.querySelector('.refresh').addEventListener('click', forceRefresh);
        window.querySelector('.close').addEventListener('click', toggleWindow);
        
        const tabs = window.querySelectorAll('.phantom-war-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
        
        document.body.appendChild(window);
        return window;
    }
    
    function toggleWindow() {
        const window = document.querySelector('.phantom-war-window') || createWindow();
        
        if (!state.isWindowOpen) {
            window.style.display = 'block';
            state.isWindowOpen = true;
            updateWindowContent();
        } else {
            window.style.display = 'none';
            state.isWindowOpen = false;
            closeProfileModal();
        }
    }
    
    function switchTab(tabName) {
        state.activeTab = tabName;
        
        document.querySelectorAll('.phantom-war-tab').forEach(tab => {
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        updateTabContent(tabName);
    }
    
    function updateWindowContent() {
        if (!state.isWindowOpen) return;
        updateTabContent(state.activeTab);
        updateTimestamp();
    }
    
    function updateTabContent(tabName) {
        const container = document.getElementById('phantom-war-content');
        if (!container) return;
        
        let content = '';
        
        switch(tabName) {
            case 'overview':
                content = renderOverview();
                break;
            case 'enemies':
                content = renderEnemies();
                break;
            case 'ourteam':
                content = renderOurTeam();
                break;
            case 'top':
                content = renderTopPlayers();
                break;
            case 'chains':
                content = renderChains();
                break;
            case 'intel':
                content = renderIntel();
                break;
            default:
                content = '<div class="phantom-war-section">Invalid tab</div>';
        }
        
        container.innerHTML = content;
        attachEventListeners();
        
        if (tabName === 'chains') {
            initializeChainSettings();
        }
    }
    
    function renderOverview() {
        const war = state.warData?.wars?.ranked;
        const now = Math.floor(Date.now() / 1000);
        const isActive = war && war.start <= now;
        
        let content = `
            <div class="phantom-war-section">
                <div class="section-header">WAR STATUS</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">STATUS</div>
                        <div class="stat-value" style="color: ${isActive ? 'var(--success-color)' : 'var(--warning-color)'}">
                            ${war ? (isActive ? 'ACTIVE' : 'PENDING') : 'NO WAR'}
                        </div>
                        <div class="stat-subvalue">${war ? `Target: ${formatNumber(war.target)}` : 'No active war'}</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">TIME</div>
                        <div class="stat-value">${war ? formatDetailedDuration(Math.abs(war.start - now)) : '--:--'}</div>
                        <div class="stat-subvalue">${war ? (war.start > now ? 'Starts in' : 'Duration') : '--'}</div>
                    </div>
                    
                    <div class="stat-card" id="our-score">
                        <div class="stat-label">OUR SCORE</div>
                        <div class="stat-value" style="color: var(--success-color);">${state.userFaction?.score ? formatNumber(state.userFaction.score) : '0'}</div>
                        <div class="stat-subvalue">Chain: ${state.userFaction?.chain || '0'}</div>
                    </div>
                    
                    <div class="stat-card" id="enemy-score">
                        <div class="stat-label">ENEMY SCORE</div>
                        <div class="stat-value" style="color: var(--danger-color);">${state.enemyFaction?.score ? formatNumber(state.enemyFaction.score) : '0'}</div>
                        <div class="stat-subvalue">Chain: ${state.enemyFaction?.chain || '0'}</div>
                    </div>
                </div>
                
                ${war ? `
                    <div style="margin-top: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 10px; color: var(--text-dim);">
                            <span>Our Progress</span>
                            <span>${Math.round((state.userFaction?.score || 0) / war.target * 100)}%</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${Math.min(100, (state.userFaction?.score || 0) / war.target * 100)}%"></div>
                        </div>
                        <div style="font-size: 9px; color: var(--text-secondary); margin-top: 4px; text-align: center;">
                            ${formatNumber(state.userFaction?.score || 0)} / ${formatNumber(war.target)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        if (state.userFaction && state.enemyFaction) {
            const ourTag = state.tornStatsData?.faction_a?.tag_image;
            const enemyTag = state.tornStatsData?.faction_b?.tag_image;
            
            content += `
                <div class="phantom-war-section">
                    <div class="section-header">FACTION INTELLIGENCE</div>
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div>
                            <div class="faction-header">
                                <div class="faction-icon-container">
                                    ${ourTag ? `<img src="${CONFIG.FACTION_TAGS_URL}/${ourTag}" class="faction-icon" alt="Our Faction">` : '<div class="faction-icon"></div>'}
                                    <div class="faction-details">
                                        <div class="faction-name">${escapeHtml(state.userFaction.name)}</div>
                                        <div class="faction-tag">${state.tornStatsData?.faction_a?.tag || 'No Tag'}</div>
                                    </div>
                                </div>
                                <div class="faction-info">
                                    <div>Leader: ${state.tornStatsData?.faction_a?.leader || 'Unknown'}</div>
                                    <div>Members: ${state.tornStatsData?.faction_a?.members ? Object.keys(state.tornStatsData.faction_a.members).length : '?'}</div>
                                    <div>Best Chain: ${state.tornStatsData?.faction_a?.best_chain || '0'}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="faction-header">
                                <div class="faction-icon-container">
                                    ${enemyTag ? `<img src="${CONFIG.FACTION_TAGS_URL}/${enemyTag}" class="faction-icon" alt="Enemy Faction">` : '<div class="faction-icon"></div>'}
                                    <div class="faction-details">
                                        <div class="faction-name">${escapeHtml(state.enemyFaction.name)}</div>
                                        <div class="faction-tag">${state.tornStatsData?.faction_b?.tag || 'No Tag'}</div>
                                    </div>
                                </div>
                                <div class="faction-info">
                                    <div>Leader: ${state.tornStatsData?.faction_b?.leader || 'Unknown'}</div>
                                    <div>Members: ${state.tornStatsData?.faction_b?.members ? Object.keys(state.tornStatsData.faction_b.members).length : '?'}</div>
                                    <div>Best Chain: ${state.tornStatsData?.faction_b?.best_chain || '0'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (state.tornStatsData?.faction_a && state.tornStatsData?.faction_b) {
            const ourMembers = state.tornStatsData.faction_a.members || {};
            const enemyMembers = state.tornStatsData.faction_b.members || {};
            
            let ourOnline = 0;
            let enemyOnline = 0;
            let ourTotalStats = 0;
            let enemyTotalStats = 0;
            
            Object.values(ourMembers).forEach(member => {
                if (member && member.last_action?.status && ['Online', 'Idle'].includes(member.last_action.status)) ourOnline++;
                if (member && member.spy) {
                    ourTotalStats += member.spy.total || 0;
                }
            });
            
            Object.values(enemyMembers).forEach(member => {
                if (member && member.last_action?.status && ['Online', 'Idle'].includes(member.last_action.status)) enemyOnline++;
                if (member && member.spy) {
                    enemyTotalStats += member.spy.total || 0;
                }
            });
            
            content += `
                <div class="phantom-war-section">
                    <div class="section-header">QUICK ANALYSIS</div>
                    <div class="stats-grid">
                        <div class="stat-card" id="our-online" style="cursor: pointer;">
                            <div class="stat-label">OUR ONLINE</div>
                            <div class="stat-value" style="color: var(--success-color);">${ourOnline}</div>
                            <div class="stat-subvalue">Active Agents</div>
                        </div>
                        
                        <div class="stat-card" id="enemy-online" style="cursor: pointer;">
                            <div class="stat-label">ENEMY ONLINE</div>
                            <div class="stat-value" style="color: var(--danger-color);">${enemyOnline}</div>
                            <div class="stat-subvalue">Active Targets</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-label">OUR FIREPOWER</div>
                            <div class="stat-value">${formatNumber(ourTotalStats)}</div>
                            <div class="stat-subvalue">Battle Stats Combined</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-label">ENEMY FIREPOWER</div>
                            <div class="stat-value">${formatNumber(enemyTotalStats)}</div>
                            <div class="stat-subvalue">Battle Stats Combined</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        content += `<div class="timestamp">Last update: ${state.lastUpdate ? formatTimeSince(state.lastUpdate) : 'Never'} ago | Phantom War v${CONFIG.VERSION}</div>`;
        
        return content;
    }
    
    function renderEnemies() {
        const enemyMembers = state.tornStatsData?.faction_b?.members;
        if (!enemyMembers) {
            return `
                <div class="phantom-war-section">
                    <div class="section-header">ENEMY TARGETS</div>
                    <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                        No enemy intelligence available
                    </div>
                </div>
            `;
        }
        
        const enemies = Object.values(enemyMembers)
            .filter(member => member && member.id)
            .sort((a, b) => {
                const aStats = a.spy?.total || 0;
                const bStats = b.spy?.total || 0;
                return bStats - aStats;
            });
        
        let content = `
            <div class="phantom-war-section">
                <div class="section-header">ENEMY TARGETS</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span>${enemies.length} targets identified</span>
                    <span>Sorted by BattleStats</span>
                </div>
                <div class="target-list">
        `;
        
        enemies.forEach((member, index) => {
            if (!member) return;
            
            const status = member.status || {};
            const canAttack = canAttackTarget(status);
            const className = canAttack === 'yes' ? '' : 
                             canAttack === 'risky' ? 'risky' : 'unattackable';
            
            const statusText = getStatusText(status);
            const statusClass = getStatusClass(status);
            
            const enemyStats = member.spy?.total || 0;
            const difficulty = IntelligenceDB.getDifficulty({ total: enemyStats });
            const difficultyText = IntelligenceDB.getDifficultyText(difficulty);
            const difficultyColor = IntelligenceDB.getDifficultyColor(difficulty);
            
            // Calculate difference
            const userTotal = state.userStats.total || 0;
            const diff = enemyStats - userTotal;
            const diffFormatted = formatNumber(Math.abs(diff));
            const diffSign = diff >= 0 ? '+' : '-';
            
            content += `
                <div class="target-card ${className} slide-in" style="animation-delay: ${index * 0.03}s;">
                    <div class="target-info">
                        <div class="target-name">${escapeHtml(member.name || 'Unknown')} [Lvl ${member.level || 0}]</div>
                        <div class="target-meta">
                            <span>Rank: ${member.position || 'Unknown'}</span>
                            <span>RW Wins: ${member.personalstats?.['Ranked warring wins'] || 0}</span>
                            <span>BattleStats: ${formatNumber(enemyStats)} (${diffSign}${diffFormatted})</span>
                            <span>Win Rate: ${member.personalstats?.['Attacks Won'] && member.personalstats?.['Attacks Lost'] ? 
                                Math.round((member.personalstats['Attacks Won'] / (member.personalstats['Attacks Won'] + member.personalstats['Attacks Lost'])) * 100) : 0}%</span>
                        </div>
                        <div style="margin-top: 6px; display: flex; align-items: center; gap: 10px;">
                            <span class="target-status ${statusClass}">${statusText}</span>
                            <span class="difficulty-badge" style="background: ${difficultyColor}; color: white;">
                                ${difficultyText}
                            </span>
                        </div>
                    </div>
                    <div class="target-actions">
                        ${canAttack !== 'no' ? `
                            <a href="https://www.torn.com/loader.php?sid=attack&user2ID=${member.id}" 
                               target="_blank" 
                               class="action-btn attack">
                                ⚔ Attack
                            </a>
                        ` : ''}
                        <button class="action-btn info" data-player-id="${member.id}" data-player-name="${escapeHtml(member.name || 'Unknown')}">
                            📊 Intel
                        </button>
                    </div>
                </div>
            `;
        });
        
        content += `
                </div>
            </div>
            <div class="timestamp">${enemies.length} enemy targets analyzed | Phantom War v${CONFIG.VERSION}</div>
        `;
        
        return content;
    }
    
    function renderOurTeam() {
        const ourMembers = state.tornStatsData?.faction_a?.members;
        if (!ourMembers) {
            return `
                <div class="phantom-war-section">
                    <div class="section-header">OUR TEAM</div>
                    <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                        No team intelligence available
                    </div>
                </div>
            `;
        }
        
        const teammates = Object.values(ourMembers)
            .filter(member => member && member.id)
            .sort((a, b) => {
                const aStats = a.spy?.total || 0;
                const bStats = b.spy?.total || 0;
                return bStats - aStats;
            });
        
        let content = `
            <div class="phantom-war-section">
                <div class="section-header">TEAM INTELLIGENCE</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 15px;">
                    ${teammates.length} team members (sorted by BattleStats)
                </div>
                <div class="target-list">
        `;
        
        teammates.forEach((member, index) => {
            if (!member) return;
            
            const status = member.status || {};
            const statusText = getStatusText(status);
            const statusClass = getStatusClass(status);
            
            const isOnline = member.last_action?.status && ['Online', 'Idle'].includes(member.last_action.status);
            const battleStats = member.spy?.total || 0;
            
            content += `
                <div class="target-card slide-in" style="animation-delay: ${index * 0.03}s; border-color: ${isOnline ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 255, 234, 0.15)'};">
                    <div class="target-info">
                        <div class="target-name">${escapeHtml(member.name || 'Unknown')} [Lvl ${member.level || 0}]</div>
                        <div class="target-meta">
                            <span>Rank: ${member.position || 'Unknown'}</span>
                            <span>RW Wins: ${member.personalstats?.['Ranked warring wins'] || 0}</span>
                            <span>BattleStats: ${formatNumber(battleStats)}</span>
                            <span>Win Rate: ${member.personalstats?.['Attacks Won'] && member.personalstats?.['Attacks Lost'] ? 
                                Math.round((member.personalstats['Attacks Won'] / (member.personalstats['Attacks Won'] + member.personalstats['Attacks Lost'])) * 100) : 0}%</span>
                        </div>
                        <div style="margin-top: 6px; display: flex; align-items: center; gap: 10px;">
                            <span class="target-status ${statusClass}">${statusText}</span>
                            <span style="font-size: 10px; color: ${isOnline ? 'var(--success-color)' : 'var(--text-dim)'};">
                                ${isOnline ? '🟢 ONLINE' : '⚫ OFFLINE'}
                            </span>
                        </div>
                    </div>
                    <div class="target-actions">
                        <button class="action-btn info" data-player-id="${member.id}" data-player-name="${escapeHtml(member.name || 'Unknown')}">
                            📊 Profile
                        </button>
                    </div>
                </div>
            `;
        });
        
        content += `
                </div>
            </div>
            <div class="timestamp">${teammates.length} team members analyzed | Phantom War v${CONFIG.VERSION}</div>
        `;
        
        return content;
    }
    
    function renderTopPlayers() {
        const ourTeam = state.tornStatsData?.faction_a;
        const enemyTeam = state.tornStatsData?.faction_b;
        
        if (!ourTeam || !enemyTeam) {
            return `
                <div class="phantom-war-section">
                    <div class="section-header">TOP PLAYERS</div>
                    <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
                        No team data available
                    </div>
                </div>
            `;
        }
        
        const ourTopPlayers = IntelligenceDB.getTopPlayers(ourTeam, 10);
        const enemyTopPlayers = IntelligenceDB.getTopPlayers(enemyTeam, 10);
        
        let content = `
            <div class="phantom-war-section">
                <div class="section-header">TOP PLAYERS COMPARISON</div>
                <div class="top-players-grid">
                    <div>
                        <div style="font-size: 13px; color: var(--success-color); font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: var(--success-color); border-radius: 2px;"></span>
                            OUR TOP 10
                        </div>
                        <div class="top-player-list" id="our-top-players">
        `;
        
        ourTopPlayers.forEach((player, index) => {
            if (!player) return;
            
            const battleStats = player.spy?.total || 0;
            const winRate = player.personalstats?.['Attacks Won'] && player.personalstats?.['Attacks Lost'] ? 
                Math.round((player.personalstats['Attacks Won'] / (player.personalstats['Attacks Won'] + player.personalstats['Attacks Lost'])) * 100) : 0;
            
            content += `
                <div class="top-player-card slide-in" style="animation-delay: ${index * 0.05}s;">
                    <div class="top-player-rank">${index + 1}</div>
                    <div class="top-player-info">
                        <div class="top-player-name">${escapeHtml(player.name || 'Unknown')}</div>
                        <div class="top-player-stats">
                            ${formatNumber(battleStats)} BattleStats • ${winRate}% win rate
                        </div>
                    </div>
                    <button class="action-btn info" data-player-id="${player.id}" data-player-name="${escapeHtml(player.name || 'Unknown')}" style="padding: 4px 10px; font-size: 9px;">
                        Intel
                    </button>
                </div>
            `;
        });
        
        content += `
                        </div>
                    </div>
                    
                    <div>
                        <div style="font-size: 13px; color: var(--danger-color); font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span style="display: inline-block; width: 12px; height: 12px; background: var(--danger-color); border-radius: 2px;"></span>
                            ENEMY TOP 10
                        </div>
                        <div class="top-player-list" id="enemy-top-players">
        `;
        
        enemyTopPlayers.forEach((player, index) => {
            if (!player) return;
            
            const battleStats = player.spy?.total || 0;
            const winRate = player.personalstats?.['Attacks Won'] && player.personalstats?.['Attacks Lost'] ? 
                Math.round((player.personalstats['Attacks Won'] / (player.personalstats['Attacks Won'] + player.personalstats['Attacks Lost'])) * 100) : 0;
            const difficulty = IntelligenceDB.getDifficulty({ total: battleStats });
            const difficultyColor = IntelligenceDB.getDifficultyColor(difficulty);
            
            content += `
                <div class="top-player-card slide-in" style="animation-delay: ${index * 0.05}s;">
                    <div class="top-player-rank" style="background: ${difficultyColor};">${index + 1}</div>
                    <div class="top-player-info">
                        <div class="top-player-name">${escapeHtml(player.name || 'Unknown')}</div>
                        <div class="top-player-stats">
                            ${formatNumber(battleStats)} BattleStats • ${winRate}% win rate
                        </div>
                    </div>
                    <button class="action-btn info" data-player-id="${player.id}" data-player-name="${escapeHtml(player.name || 'Unknown')}" style="padding: 4px 10px; font-size: 9px;">
                        Intel
                    </button>
                </div>
            `;
        });
        
        content += `
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="phantom-war-section">
                <div class="section-header">STATISTICAL ANALYSIS</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">OUR AVG BATTLE</div>
                        <div class="stat-value" style="color: var(--success-color);">
                            ${ourTopPlayers.length > 0 ? formatNumber(ourTopPlayers.reduce((sum, p) => sum + (p.spy?.total || 0), 0) / ourTopPlayers.length) : '0'}
                        </div>
                        <div class="stat-subvalue">Per top player</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">ENEMY AVG BATTLE</div>
                        <div class="stat-value" style="color: var(--danger-color);">
                            ${enemyTopPlayers.length > 0 ? formatNumber(enemyTopPlayers.reduce((sum, p) => sum + (p.spy?.total || 0), 0) / enemyTopPlayers.length) : '0'}
                        </div>
                        <div class="stat-subvalue">Per top player</div>
                    </div>
                </div>
            </div>
            
            <div class="timestamp">Top players analysis complete | Phantom War v${CONFIG.VERSION}</div>
        `;
        
        return content;
    }
    
    function renderChains() {
        const userChain = state.userFaction?.chain || 0;
        const enemyChain = state.enemyFaction?.chain || 0;
        
        const chainBonuses = [
            { hits: 10, respect: 10 },
            { hits: 25, respect: 20 },
            { hits: 50, respect: 40 },
            { hits: 100, respect: 80 },
            { hits: 250, respect: 160 },
            { hits: 500, respect: 320 },
            { hits: 1000, respect: 640 },
            { hits: 2500, respect: 1280 },
            { hits: 5000, respect: 2560 },
            { hits: 10000, respect: 5120 },
            { hits: 25000, respect: 10240 },
            { hits: 50000, respect: 20480 },
            { hits: 100000, respect: 40960 }
        ];
        
        let nextBonus = null;
        for (const bonus of chainBonuses) {
            if (userChain < bonus.hits) {
                nextBonus = bonus;
                break;
            }
        }
        
        const isMaxChain = !nextBonus;
        
        let content = `
            <div class="phantom-war-section">
                <div class="section-header">CHAIN ANALYSIS</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">OUR CHAIN HITS</div>
                        <div class="stat-value" style="color: var(--success-color);">${userChain}</div>
                        <div class="stat-subvalue">Active Chain</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">ENEMY CHAIN HITS</div>
                        <div class="stat-value" style="color: var(--danger-color);">${enemyChain}</div>
                        <div class="stat-subvalue">Enemy Chain</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">CHAIN DIFFERENCE</div>
                        <div class="stat-value" style="color: ${userChain > enemyChain ? 'var(--success-color)' : 'var(--danger-color)'}">
                            ${Math.abs(userChain - enemyChain)}
                        </div>
                        <div class="stat-subvalue">${userChain > enemyChain ? 'We lead by' : 'They lead by'}</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">EST. RESPECT</div>
                        <div class="stat-value">${calculateChainRespect(userChain)}</div>
                        <div class="stat-subvalue">Current bonus</div>
                    </div>
                </div>
                
                ${nextBonus ? `
                    <div style="margin-top: 20px;">
                        <div class="section-header" style="font-size: 12px; margin-bottom: 10px;">NEXT BONUS: ${formatNumber(nextBonus.hits)} HITS</div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; color: var(--text-dim);">
                            <span>Progress: ${userChain}/${nextBonus.hits}</span>
                            <span>${Math.round((userChain / nextBonus.hits) * 100)}%</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${Math.min(100, (userChain / nextBonus.hits) * 100)}%"></div>
                        </div>
                        <div style="font-size: 10px; color: var(--text-secondary); margin-top: 6px; text-align: center;">
                            ${formatNumber(nextBonus.hits - userChain)} hits remaining for ${formatNumber(nextBonus.respect)} respect
                        </div>
                    </div>
                ` : `
                    <div style="margin-top: 20px; text-align: center; padding: 15px; background: rgba(0, 255, 136, 0.1); border-radius: 6px; border: 1px solid rgba(0, 255, 136, 0.3);">
                        <div style="font-size: 14px; font-weight: 700; color: var(--success-color); margin-bottom: 5px;">MAXIMUM CHAIN REACHED!</div>
                        <div style="font-size: 11px; color: var(--text-secondary);">All chain bonuses achieved!</div>
                    </div>
                `}
            </div>
            
            <div class="phantom-war-section">
                <div class="section-header">CHAIN SETTINGS</div>
                <div class="settings-toggle">
                    <div class="toggle-label">Chain Cooldown Warning (${CONFIG.CHAIN_WARNING_THRESHOLD} seconds)</div>
                    <label class="toggle-switch">
                        <input type="checkbox" class="toggle-checkbox" id="chain-warning-toggle" ${CONFIG.CHAIN_WARNING_ENABLED ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div style="font-size: 10px; color: var(--text-dim); margin-top: 8px; padding-left: 10px;">
                    Shows a warning toast when your faction's chain is about to go into cooldown
                </div>
            </div>
            
            <div class="timestamp">Chain analysis updated | Phantom War v${CONFIG.VERSION}</div>
        `;
        
        return content;
    }
    
    function renderIntel() {
        const notesCount = Object.keys(IntelligenceDB.notes).length;
        const cachedPlayers = Object.keys(IntelligenceDB.playerCache).length;
        
        let userStatsFromTornStats = 0;
        if (state.tornStatsData?.faction_a?.members) {
            const userMember = Object.values(state.tornStatsData.faction_a.members).find(m => m.id == state.userInfo.id);
            if (userMember && userMember.spy) {
                userStatsFromTornStats = userMember.spy.total || 0;
            }
        }
        
        // Use TornStats data for user stats if available, otherwise use API data
        const userTotal = userStatsFromTornStats || state.userStats.total;
        
        let content = `
            <div class="phantom-war-section">
                <div class="section-header">INTELLIGENCE BRIEFING</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">LAST UPDATE</div>
                        <div class="stat-value">${state.lastUpdate ? formatTimeSince(state.lastUpdate) : 'Never'}</div>
                        <div class="stat-subvalue">Time ago</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">API STATUS</div>
                        <div class="stat-value" style="color: ${state.tornStatsData ? 'var(--success-color)' : 'var(--warning-color)'};">${state.tornStatsData ? 'ACTIVE' : 'OFFLINE'}</div>
                        <div class="stat-subvalue">TornStats ${state.tornStatsData ? 'Online' : 'Offline'}</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">YOUR STATS</div>
                        <div class="stat-value">${formatNumber(userTotal)}</div>
                        <div class="stat-subvalue">Battle Stats</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">INTEL DATABASE</div>
                        <div class="stat-value">${notesCount}</div>
                        <div class="stat-subvalue">Player Notes</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">PLAYER CACHE</div>
                        <div class="stat-value">${cachedPlayers}</div>
                        <div class="stat-subvalue">Profiles</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-label">APP VERSION</div>
                        <div class="stat-value">v${CONFIG.VERSION}</div>
                        <div class="stat-subvalue">Phantom War</div>
                    </div>
                </div>
            </div>
            
            <div class="phantom-war-section">
                <div class="section-header">SYSTEM PERFORMANCE</div>
                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.6;">
                    <div>• Update Interval: ${CONFIG.UPDATE_INTERVAL/1000}s (TornStats)</div>
                    <div>• API Interval: ${CONFIG.API_INTERVAL/1000}s (Torn API)</div>
                    <div>• Cache Duration: ${CONFIG.CACHE_DURATION/1000}s</div>
                    <div>• Player Cache: ${cachedPlayers} profiles cached</div>
                    <div>• Intelligence Notes: ${notesCount} notes stored</div>
                    <div>• War ID: ${state.warData?.wars?.ranked?.war_id || 'None'}</div>
                </div>
            </div>
            
            <div class="timestamp">Intelligence system operational | Phantom War v${CONFIG.VERSION}</div>
        `;
        
        return content;
    }
    
    function initializeChainSettings() {
        const chainToggle = document.getElementById('chain-warning-toggle');
        if (chainToggle) {
            chainToggle.checked = CONFIG.CHAIN_WARNING_ENABLED;
            chainToggle.addEventListener('change', function() {
                CONFIG.CHAIN_WARNING_ENABLED = this.checked;
                showToast(`Chain warning ${this.checked ? 'enabled' : 'disabled'}`, 'success', 3000);
            });
        }
    }
    
    function attachEventListeners() {
        document.querySelectorAll('.action-btn.info').forEach(btn => {
            btn.addEventListener('click', function() {
                const playerId = this.getAttribute('data-player-id');
                const playerName = this.getAttribute('data-player-name');
                showPlayerProfile(playerId, playerName);
            });
        });
        
        document.querySelectorAll('.action-btn.attack').forEach(link => {
            link.addEventListener('click', function(e) {
                if (!confirm('Launch attack on this target?')) {
                    e.preventDefault();
                }
            });
        });
        
        const ourOnline = document.getElementById('our-online');
        if (ourOnline) {
            ourOnline.addEventListener('click', () => switchTab('ourteam'));
        }
        
        const enemyOnline = document.getElementById('enemy-online');
        if (enemyOnline) {
            enemyOnline.addEventListener('click', () => switchTab('enemies'));
        }
        
        const ourScore = document.getElementById('our-score');
        if (ourScore) {
            ourScore.addEventListener('click', () => switchTab('chains'));
        }
        
        const enemyScore = document.getElementById('enemy-score');
        if (enemyScore) {
            enemyScore.addEventListener('click', () => switchTab('chains'));
        }
    }

    function showPlayerProfile(playerId, playerName) {
        closeProfileModal();
        
        let playerData = null;
        let isEnemy = false;
        
        if (state.tornStatsData?.faction_b?.members?.[playerId]) {
            playerData = state.tornStatsData.faction_b.members[playerId];
            isEnemy = true;
        } else if (state.tornStatsData?.faction_a?.members?.[playerId]) {
            playerData = state.tornStatsData.faction_a.members[playerId];
            isEnemy = false;
        }
        
        if (!playerData) {
            console.error(`[Phantom War] Player ${playerId} not found`);
            return;
        }
        
        const intel = IntelligenceDB.getPlayerIntelligence(playerId, playerData);
        const difficulty = IntelligenceDB.getDifficulty(intel.stats);
        
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        
        modal.innerHTML = `
            <div class="profile-header">
                <div>
                    <div class="profile-title">PLAYER PROFILE: ${escapeHtml(playerName)}</div>
                    <div class="profile-subtitle">ID: ${playerId} | Level: ${playerData.level || 0} | ${isEnemy ? '🎯 ENEMY TARGET' : '🛡️ FRIENDLY AGENT'}</div>
                </div>
                <button class="profile-close">✕ Close</button>
            </div>
            <div class="profile-content">
                <div class="profile-section">
                    <div class="profile-section-title">COMBAT STATISTICS</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
                        <div>
                            <div style="font-size: 10px; color: var(--text-dim);">ATTACKS WON</div>
                            <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${intel.combat.attacksWon}</div>
                        </div>
                        <div>
                            <div style="font-size: 10px; color: var(--text-dim);">WIN RATE</div>
                            <div style="font-size: 18px; font-weight: 700; color: ${intel.combat.winRate > 50 ? 'var(--success-color)' : 'var(--danger-color)'};">${intel.combat.winRate}%</div>
                        </div>
                        <div>
                            <div style="font-size: 10px; color: var(--text-dim);">RANKED WINS</div>
                            <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${intel.combat.rankedWins}</div>
                        </div>
                        <div>
                            <div style="font-size: 10px; color: var(--text-dim);">BEST KILLSTREAK</div>
                            <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${intel.combat.bestKillStreak}</div>
                        </div>
                    </div>
                    
                    <div style="font-size: 10px; color: var(--text-dim); margin-bottom: 6px;">XANAX USED / BOOSTERS / REFILLS</div>
                    <div style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
                        ${intel.combat.xanaxUsed} / ${intel.combat.boostersUsed} / ${intel.combat.refills}
                    </div>
                </div>
                
                <div class="profile-section">
                    <div class="profile-section-title">STATISTICS BREAKDOWN</div>
                    <div class="stat-bars">
                        <div class="stat-bar">
                            <div class="stat-bar-label">TOTAL BATTLE</div>
                            <div class="stat-bar-value">${formatNumber(intel.stats.total)}</div>
                            <div class="stat-bar-track">
                                <div class="stat-bar-fill" style="width: ${Math.min(100, intel.stats.total / 1000000000 * 100)}%"></div>
                            </div>
                        </div>
                        <div class="stat-bar">
                            <div class="stat-bar-label">STRENGTH</div>
                            <div class="stat-bar-value">${formatNumber(intel.stats.strength)}</div>
                            <div class="stat-bar-track">
                                <div class="stat-bar-fill" style="width: ${Math.min(100, intel.stats.strength / 250000000 * 100)}%"></div>
                            </div>
                        </div>
                        <div class="stat-bar">
                            <div class="stat-bar-label">DEFENSE</div>
                            <div class="stat-bar-value">${formatNumber(intel.stats.defense)}</div>
                            <div class="stat-bar-track">
                                <div class="stat-bar-fill" style="width: ${Math.min(100, intel.stats.defense / 250000000 * 100)}%"></div>
                            </div>
                        </div>
                        <div class="stat-bar">
                            <div class="stat-bar-label">SPEED</div>
                            <div class="stat-bar-value">${formatNumber(intel.stats.speed)}</div>
                            <div class="stat-bar-track">
                                <div class="stat-bar-fill" style="width: ${Math.min(100, intel.stats.speed / 250000000 * 100)}%"></div>
                            </div>
                        </div>
                        <div class="stat-bar">
                            <div class="stat-bar-label">DEXTERITY</div>
                            <div class="stat-bar-value">${formatNumber(intel.stats.dexterity)}</div>
                            <div class="stat-bar-track">
                                <div class="stat-bar-fill" style="width: ${Math.min(100, intel.stats.dexterity / 250000000 * 100)}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${isEnemy ? `
                    <div class="profile-section">
                        <div class="profile-section-title">DIFFICULTY ASSESSMENT</div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 6px; border-left: 4px solid ${IntelligenceDB.getDifficultyColor(difficulty)};">
                            <div style="font-size: 14px; font-weight: 700; color: ${IntelligenceDB.getDifficultyColor(difficulty)};">
                                ${IntelligenceDB.getDifficultyText(difficulty)}
                            </div>
                            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 6px;">
                                Enemy has ${formatNumber(intel.stats.total)} BattleStats
                                ${state.userStats.total ? `(vs your ${formatNumber(state.userStats.total)})` : ''}
                            </div>
                            <div style="font-size: 10px; color: var(--text-dim); margin-top: 4px;">
                                Ratio: ${state.userStats.total ? (intel.stats.total / state.userStats.total).toFixed(2) : '?'}x your stats
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="profile-section">
                    <div class="profile-section-title">PATTERN ANALYSIS</div>
                    <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.8;">
                        <div><strong>Last Seen:</strong> ${intel.patterns.lastSeenRelative}</div>
                        <div><strong>Status:</strong> ${intel.patterns.status} (${intel.patterns.location})</div>
                        <div><strong>User Activity:</strong> ${formatNumber(intel.patterns.activity)}</div>
                        <div><strong>Danger Level:</strong> <span style="color: ${intel.patterns.dangerLevel === 'HIGH' ? 'var(--danger-color)' : intel.patterns.dangerLevel === 'MEDIUM-HIGH' ? '#ffaa00' : 'var(--text-secondary)'}">${intel.patterns.dangerLevel}</span></div>
                        <div><strong>Stats Age:</strong> ${intel.stats.age !== 'Unknown' ? intel.stats.age + ' days' : 'Unknown'}</div>
                    </div>
                </div>
                
                <div class="profile-section">
                    <div class="profile-section-title">INTELLIGENCE NOTES</div>
                    <div class="notes-container">
                        <textarea class="notes-textarea" id="player-notes" placeholder="Add intelligence notes about this player...">${escapeHtml(intel.note || '')}</textarea>
                        <div class="notes-actions">
                            <button class="phantom-war-btn" id="save-notes" data-player-id="${playerId}">
                                💾 Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        state.openProfile = modal;
        
        modal.querySelector('#save-notes').addEventListener('click', function() {
            const notes = modal.querySelector('#player-notes').value;
            IntelligenceDB.saveNote(playerId, notes);
            
            const btn = this;
            const originalText = btn.textContent;
            btn.textContent = '✓ Saved!';
            btn.style.background = 'rgba(0, 255, 136, 0.2)';
            btn.style.borderColor = 'rgba(0, 255, 136, 0.5)';
            btn.style.color = 'var(--success-color)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 2000);
        });
        
        modal.querySelector('.profile-close').addEventListener('click', closeProfileModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProfileModal();
            }
        });
        
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                closeProfileModal();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    function closeProfileModal() {
        if (state.openProfile) {
            state.openProfile.remove();
            state.openProfile = null;
        }
    }

    function loadUserInfo() {
        const savedId = GM_getValue(CONFIG.USER_ID_KEY, null);
        const savedName = GM_getValue(CONFIG.USER_NAME_KEY, null);
        const lastUpdated = GM_getValue(CONFIG.LAST_USER_UPDATE_KEY, 0);
        
        if (savedId && savedName && Date.now() - lastUpdated < CONFIG.USER_UPDATE_INTERVAL) {
            state.userInfo = {
                id: savedId,
                name: savedName,
                level: 0,
                faction_id: null,
                lastUpdated: lastUpdated
            };
        }
    }
    
    function saveUserInfo(id, name, level, factionId) {
        state.userInfo = {
            id: id,
            name: name,
            level: level || 0,
            faction_id: factionId || null,
            lastUpdated: Date.now()
        };
        
        GM_setValue(CONFIG.USER_ID_KEY, id);
        GM_setValue(CONFIG.USER_NAME_KEY, name);
        GM_setValue(CONFIG.LAST_USER_UPDATE_KEY, Date.now());
    }
    
    function fetchUserInfo() {
        if (state.cache.userInfo.data && 
            Date.now() - state.cache.userInfo.timestamp < CONFIG.CACHE_DURATION) {
            return;
        }
        
        const url = `${CONFIG.BASE_API_URL}/user/?key=${CONFIG.API_KEY}&selections=profile`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 10000,
            onload: function(response) {
                if (response && response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && !data.error && data.profile) {
                            saveUserInfo(
                                data.profile.id,
                                data.profile.name,
                                data.profile.level,
                                data.profile.faction?.faction_id || null
                            );
                            
                            state.cache.userInfo = { data: data.profile, timestamp: Date.now() };
                            state.retryCounts.userInfo = 0;
                        }
                    } catch (error) {
                        console.warn('[Phantom War] Error parsing user info:', error);
                    }
                }
            },
            onerror: function(error) {
                console.warn('[Phantom War] Error fetching user info:', error);
            },
            ontimeout: function() {
                console.warn('[Phantom War] Timeout fetching user info');
            }
        });
    }

    function startPolling() {
        if (state.pollInterval) clearInterval(state.pollInterval);
        if (state.apiInterval) clearInterval(state.apiInterval);
        
        fetchWarData();
        fetchTornStatsData();
        
        state.pollInterval = setInterval(fetchTornStatsData, CONFIG.UPDATE_INTERVAL);
        state.apiInterval = setInterval(() => {
            fetchWarData();
            fetchUserStats();
            fetchUserInfo();
        }, CONFIG.API_INTERVAL);
    }
    
    function fetchWarData() {
        if (state.cache.warData.data && 
            Date.now() - state.cache.warData.timestamp < CONFIG.CACHE_DURATION) {
            return;
        }
        
        const url = `${CONFIG.BASE_API_URL}/faction/wars?key=${CONFIG.API_KEY}`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Accept': 'application/json'
            },
            timeout: 10000,
            onload: function(response) {
                if (response && response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && !data.error) {
                            state.warData = data;
                            state.cache.warData = { data: data, timestamp: Date.now() };
                            
                            if (data.wars?.ranked?.factions) {
                                const factions = data.wars.ranked.factions;
                                
                                if (state.userInfo.faction_id) {
                                    factions.forEach(faction => {
                                        if (faction.id == state.userInfo.faction_id) {
                                            state.userFaction = faction;
                                        } else {
                                            state.enemyFaction = faction;
                                        }
                                    });
                                } else {
                                    state.userFaction = factions[0];
                                    state.enemyFaction = factions[1];
                                }
                            }
                            
                            state.lastUpdate = new Date();
                            state.retryCounts.warData = 0;
                            
                            if (state.isWindowOpen) {
                                updateWindowContent();
                            }
                        }
                    } catch (error) {
                        console.warn('[Phantom War] Error parsing war data:', error);
                    }
                }
            },
            onerror: function(error) {
                console.warn('[Phantom War] Error fetching war data:', error);
            },
            ontimeout: function() {
                console.warn('[Phantom War] Timeout fetching war data');
            }
        });
    }
    
    function fetchTornStatsData() {
        if (!state.warData?.wars?.ranked?.war_id) {
            return;
        }
        
        if (state.cache.tornStats.data && 
            Date.now() - state.cache.tornStats.timestamp < CONFIG.UPDATE_INTERVAL) {
            return;
        }
        
        const warId = state.warData.wars.ranked.war_id;
        const url = `${CONFIG.TORNSTATS_BASE_URL}/${CONFIG.API_KEY}/wars/${warId}`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 15000,
            onload: function(response) {
                if (response && response.status === 200 && response.responseText) {
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        if (data && data.status !== false) {
                            state.tornStatsData = data;
                            state.cache.tornStats = { data: data, timestamp: Date.now() };
                            
                            if (data.war && state.userFaction && state.enemyFaction) {
                                state.userFaction.score = data.war.faction_a_score || 0;
                                state.userFaction.chain = data.war.faction_a_chain || 0;
                                state.enemyFaction.score = data.war.faction_b_score || 0;
                                state.enemyFaction.chain = data.war.faction_b_chain || 0;
                            }
                            
                            state.lastUpdate = new Date();
                            state.retryCounts.tornStats = 0;
                            
                            if (state.isWindowOpen) {
                                updateWindowContent();
                            }
                            
                            // Check chain warning if enabled
                            if (CONFIG.CHAIN_WARNING_ENABLED && state.userFaction?.chain) {
                                checkChainWarning();
                            }
                        }
                    } catch (error) {
                        console.warn('[Phantom War] Error parsing TornStats data:', error);
                    }
                }
            },
            onerror: function(error) {
                console.warn('[Phantom War] Error fetching TornStats data:', error);
            },
            ontimeout: function() {
                console.warn('[Phantom War] Timeout fetching TornStats data');
            }
        });
    }
    
    function fetchUserStats() {
        if (state.cache.userStats.data && 
            Date.now() - state.cache.userStats.timestamp < CONFIG.CACHE_DURATION * 2) {
            return;
        }
        
        const url = `${CONFIG.BASE_API_URL}/user/?key=${CONFIG.API_KEY}&selections=battlestats`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 10000,
            onload: function(response) {
                if (response && response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && !data.error && data.strength !== undefined) {
                            state.userStats = {
                                strength: data.strength || 0,
                                defense: data.defense || 0,
                                speed: data.speed || 0,
                                dexterity: data.dexterity || 0,
                                intelligence: data.intelligence || 0,
                                endurance: data.endurance || 0,
                                manual_labor: data.manual_labor || 0,
                                total: (data.strength || 0) + (data.defense || 0) + (data.speed || 0) + (data.dexterity || 0)
                            };
                            
                            state.cache.userStats = { data: state.userStats, timestamp: Date.now() };
                            state.retryCounts.userStats = 0;
                        }
                    } catch (error) {
                        console.warn('[Phantom War] Error parsing user stats:', error);
                    }
                }
            },
            onerror: function(error) {
                console.warn('[Phantom War] Error fetching user stats:', error);
            },
            ontimeout: function() {
                console.warn('[Phantom War] Timeout fetching user stats');
            }
        });
    }
    
    function checkChainWarning() {
        if (!CONFIG.CHAIN_WARNING_ENABLED || !state.warData?.wars?.ranked) return;
        
        const war = state.warData.wars.ranked;
        const now = Math.floor(Date.now() / 1000);
        const lastAttack = war.last_attack || 0;
        const timeSinceLastAttack = now - lastAttack;
        
        if (lastAttack > 0 && timeSinceLastAttack >= (60 - CONFIG.CHAIN_WARNING_THRESHOLD)) {
            if (!state.chainWarningShown) {
                const timeLeft = 60 - timeSinceLastAttack;
                if (timeLeft > 0) {
                    showToast(`Chain cooldown in ${timeLeft} seconds!`, 'warning', 5000);
                    state.chainWarningShown = true;
                    
                    // Reset after 5 seconds
                    setTimeout(() => {
                        state.chainWarningShown = false;
                    }, 5000);
                }
            }
        } else {
            state.chainWarningShown = false;
        }
    }
    
    function forceRefresh() {
        state.lastUpdate = new Date();
        
        state.cache.warData = { data: null, timestamp: 0 };
        state.cache.tornStats = { data: null, timestamp: 0 };
        state.cache.userStats = { data: null, timestamp: 0 };
        state.cache.userInfo = { data: null, timestamp: 0 };
        
        fetchWarData();
        fetchTornStatsData();
        fetchUserStats();
        fetchUserInfo();
        
        if (state.isWindowOpen) {
            updateWindowContent();
        }
        
        const refreshBtn = document.querySelector('.phantom-war-btn.refresh');
        if (refreshBtn) {
            const originalText = refreshBtn.textContent;
            refreshBtn.textContent = '✓ Refreshed!';
            refreshBtn.style.background = 'rgba(0, 255, 136, 0.2)';
            refreshBtn.style.borderColor = 'rgba(0, 255, 136, 0.5)';
            
            setTimeout(() => {
                refreshBtn.textContent = originalText;
                refreshBtn.style.background = '';
                refreshBtn.style.borderColor = '';
            }, 2000);
        }
    }
    
    function canAttackTarget(status) {
        if (!status) return 'no';
        
        const stateVal = status.state || '';
        const color = status.color || '';
        
        if (color === 'green' && stateVal === 'Okay') {
            return 'yes';
        }
        
        if (color === 'blue' && (stateVal === 'abroad' || stateVal === 'traveling')) {
            return 'risky';
        }
        
        if (color === 'red' && stateVal === 'hospital') {
            return 'no';
        }
        
        return 'no';
    }
    
    function getStatusText(status) {
        if (!status) return 'Unknown';
        
        const stateVal = status.state || '';
        const description = status.description || '';
        
        switch(stateVal) {
            case 'Okay': return 'Available';
            case 'abroad': return 'Abroad';
            case 'traveling': return 'Traveling';
            case 'hospital': return 'Hospitalized';
            case 'jail': return 'In Jail';
            default: return description || stateVal;
        }
    }
    
    function getStatusClass(status) {
        if (!status) return '';
        
        const color = status.color || '';
        switch(color) {
            case 'green': return 'green';
            case 'blue': return 'blue';
            case 'red': return 'red';
            default: return '';
        }
    }
    
    function formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    function formatDetailedDuration(seconds) {
        seconds = Math.abs(seconds);
        
        if (seconds < 60) return `${seconds}s`;
        
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    function formatTimeSince(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        
        if (diff < 60) return `${diff}s`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return `${Math.floor(diff / 86400)}d`;
    }
    
    function calculateChainRespect(chain) {
        const bonuses = [
            { hits: 10, respect: 10 },
            { hits: 25, respect: 20 },
            { hits: 50, respect: 40 },
            { hits: 100, respect: 80 },
            { hits: 250, respect: 160 },
            { hits: 500, respect: 320 },
            { hits: 1000, respect: 640 },
            { hits: 2500, respect: 1280 },
            { hits: 5000, respect: 2560 },
            { hits: 10000, respect: 5120 },
            { hits: 25000, respect: 10240 },
            { hits: 50000, respect: 20480 },
            { hits: 100000, respect: 40960 }
        ];
        
        let respect = 0;
        for (const bonus of bonuses) {
            if (chain >= bonus.hits) {
                respect = bonus.respect;
            } else {
                break;
            }
        }
        
        return formatNumber(respect);
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function updateTimestamp() {
        const element = document.querySelector('.timestamp');
        if (element && state.lastUpdate) {
            element.textContent = `Last update: ${formatTimeSince(state.lastUpdate)} ago | Phantom War v${CONFIG.VERSION}`;
        }
    }
    
    function setupPageListeners() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (url.includes('torn.com')) {
                    if (!state.isInitialized) {
                        setTimeout(initialize, 1000);
                    }
                }
            }
        }).observe(document, { subtree: true, childList: true });
        
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                if (state.isInitialized && Date.now() - (state.lastUpdate?.getTime() || 0) > 30000) {
                    forceRefresh();
                }
            }
        });
    }
    
    function cleanup() {
        if (state.pollInterval) clearInterval(state.pollInterval);
        if (state.apiInterval) clearInterval(state.apiInterval);
        if (state.longPressTimer) clearTimeout(state.longPressTimer);
        
        const elements = document.querySelectorAll('.phantom-war-fab, .phantom-war-window, .profile-modal, .phantom-war-toast-container');
        elements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        IntelligenceDB.savePlayerCache();
        state.isInitialized = false;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    window.addEventListener('beforeunload', cleanup);
})();
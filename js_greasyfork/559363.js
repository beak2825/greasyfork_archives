// ==UserScript==
// @name         Grepolis Auto-Invite
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Système complet d'invitation avec modes, stats, Discord, planificateur
// @author       Julien
// @match        https://*.grepolis.com/game/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *.grepolis.com
// @connect      discord.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559363/Grepolis%20Auto-Invite.user.js
// @updateURL https://update.greasyfork.org/scripts/559363/Grepolis%20Auto-Invite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // ==================== CONFIGURATION ====================

    const CONFIG = {
        storageKeys: {
            members: 'grepolis_alliance_members',
            history: 'grepolis_alliance_history',
            players: 'grepolis_all_players',
            settings: 'grepolis_bot_settings',
            stats: 'grepolis_bot_stats',
            blacklist: 'grepolis_blacklist',
            whitelist: 'grepolis_whitelist',
            scheduler: 'grepolis_scheduler',
            panelPosition: 'grepolis_panel_position'
        },

        defaults: {
            checkInterval: 60000,
            inviteDelay: 5000,
            mode: 'standard',
            discordWebhook: '',
            discordEnabled: false,
            schedulerEnabled: false,
            schedulerInterval: 3600000,
            schedulerPlayers: []
        }
    };

    // ==================== ÉTAT GLOBAL ====================

    const state = {
        currentMembers: new Set(),
        allPlayers: {},
        history: [],
        settings: {},
        blacklist: new Set(),
        whitelist: new Set(),
        stats: {
            totalInvites: 0,
            successfulInvites: 0,
            failedInvites: 0,
            totalDepartures: 0,
            totalJoins: 0,
            lastCheck: null,
            invitesByHour: Array(24).fill(0),
            departuresByDay: {}
        },
        activeTab: 'dashboard',
        isMinimized: false,
        isDragging: false,
        panelPosition: { x: null, y: null },
        isInitialized: false,
        isActive: true,
        checkInterval: null,
        schedulerInterval: null
    };

    // ==================== UTILITAIRES ====================

    function log(message, color = '#0066cc') {
        const time = new Date().toLocaleTimeString('fr-FR');
        console.log(`%c[AutoInvite ${time}] ${message}`, `color: ${color}; font-weight: bold;`);
    }

    function showToast(message, type = 'info') {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            animation: slideDown 0.3s ease;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function getWorldServer() {
        const hostname = window.location.hostname;
        const match = hostname.match(/^([a-z]+\d+)\.grepolis\.com$/);
        return match ? match[1] : null;
    }

    function getCSRFToken() {
        if (uw.Game && uw.Game.csrfToken) {
            return uw.Game.csrfToken;
        }
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const content = script.textContent;
            if (content && content.includes('csrfToken')) {
                const match = content.match(/csrfToken['"]\s*:\s*['"]([^'"]+)['"]/);
                if (match) return match[1];
            }
        }
        return null;
    }

    function getCookies() {
        const cookies = {};
        document.cookie.split(';').forEach(cookie => {
            const parts = cookie.trim().split('=');
            if (parts.length === 2) {
                cookies[parts[0]] = parts[1];
            }
        });
        return cookies;
    }

    // ==================== STOCKAGE ====================

    function saveData(key, data) {
        try {
            localStorage.setItem(CONFIG.storageKeys[key], JSON.stringify(data));
            return true;
        } catch (e) {
            log(`Erreur sauvegarde ${key}: ${e.message}`, '#ff0000');
            return false;
        }
    }

    function loadData(key, defaultValue = null) {
        try {
            const saved = localStorage.getItem(CONFIG.storageKeys[key]);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            log(`Erreur chargement ${key}: ${e.message}`, '#ff9900');
            return defaultValue;
        }
    }

    function saveSettings() {
        saveData('settings', state.settings);
    }

    function loadSettings() {
        state.settings = { ...CONFIG.defaults, ...loadData('settings', {}) };
    }

    function saveStats() {
        saveData('stats', state.stats);
    }

    function loadStats() {
        state.stats = { ...state.stats, ...loadData('stats', {}) };
    }

    function saveMembers() {
        saveData('members', {
            members: Array.from(state.currentMembers),
            timestamp: new Date().toISOString()
        });
    }

    function loadMembers() {
        const data = loadData('members', { members: [] });
        state.currentMembers = new Set(data.members);
    }

    function saveHistory(event) {
        state.history.unshift(event);
        if (state.history.length > 100) {
            state.history = state.history.slice(0, 100);
        }
        saveData('history', state.history);
        updateHistoryUI();
    }

    function loadHistory() {
        state.history = loadData('history', []);
    }

    function savePlayers() {
        saveData('players', {
            players: state.allPlayers,
            timestamp: new Date().toISOString()
        });
    }

    function loadPlayers() {
        const data = loadData('players', null);
        if (data) {
            const timestamp = new Date(data.timestamp);
            const now = new Date();
            if (now - timestamp < 3600000) {
                state.allPlayers = data.players;
                return true;
            }
        }
        return false;
    }

    function saveBlacklist() {
        saveData('blacklist', Array.from(state.blacklist));
    }

    function loadBlacklist() {
        state.blacklist = new Set(loadData('blacklist', []));
    }

    function saveWhitelist() {
        saveData('whitelist', Array.from(state.whitelist));
    }

    function loadWhitelist() {
        state.whitelist = new Set(loadData('whitelist', []));
    }

    function savePanelPosition() {
        saveData('panelPosition', state.panelPosition);
    }

    function loadPanelPosition() {
        state.panelPosition = loadData('panelPosition', { x: null, y: null });
    }

    // ==================== RÉCUPÉRATION DONNÉES ====================

    function fetchPlayersData() {
        return new Promise((resolve, reject) => {
            const server = getWorldServer();
            if (!server) {
                reject(new Error('Serveur introuvable'));
                return;
            }

            const url = `https://${server}.grepolis.com/data/players.txt`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    async function getAllPlayers() {
        const players = {};

        try {
            const data = await fetchPlayersData();
            const lines = data.split('\n');

            log(`Chargement de ${lines.length} joueurs`, '#9c27b0');

            lines.forEach(line => {
                if (!line.trim()) return;

                const parts = line.split(',');
                if (parts.length < 6) return;

                const playerId = parseInt(parts[0]);
                const playerName = decodeURIComponent(parts[1].replace(/\+/g, ' '));
                const allianceId = parts[2] ? parseInt(parts[2]) : null;

                players[playerId] = {
                    id: playerId,
                    name: playerName,
                    allianceId: allianceId,
                    points: parseInt(parts[3]),
                    rank: parseInt(parts[4]),
                    towns: parseInt(parts[5])
                };
            });

            state.allPlayers = players;
            savePlayers();
            log(`✅ ${Object.keys(players).length} joueurs chargés`, '#4CAF50');

        } catch (e) {
            log(`❌ Erreur chargement joueurs: ${e.message}`, '#ff0000');
        }
    }

    async function getCurrentMembers() {
        const members = new Set();
        const allianceId = uw.Game?.alliance_id;

        if (!allianceId) {
            return members;
        }

        if (Object.keys(state.allPlayers).length === 0) {
            await getAllPlayers();
        }

        Object.values(state.allPlayers).forEach(player => {
            if (player.allianceId === allianceId) {
                members.add(player.id);
            }
        });

        return members;
    }

    // ==================== DISCORD WEBHOOK ====================

    function sendDiscordNotification(title, description, color = 3447003) {
        if (!state.settings.discordEnabled || !state.settings.discordWebhook) {
            return;
        }

        const embed = {
            title: title,
            description: description,
            color: color,
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Grepolis Auto-Invite'
            }
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: state.settings.discordWebhook,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ embeds: [embed] }),
            onload: function(response) {
                if (response.status === 204) {
                    log('✅ Notification Discord envoyée', '#4CAF50');
                }
            },
            onerror: function(error) {
                log('❌ Erreur Discord webhook', '#ff0000');
            }
        });
    }

    // ==================== INVITATION ====================

    function invitePlayer(playerId, source = 'auto') {
        return new Promise((resolve, reject) => {
            const playerName = state.allPlayers[playerId]?.name || `ID ${playerId}`;

            // Vérifier mode
            if (state.settings.mode === 'blacklist' && state.blacklist.has(playerId)) {
                const msg = `⛔ ${playerName} est dans la blacklist`;
                log(msg, '#ff9900');
                showToast(msg, 'warning');
                reject(new Error('Blacklisted'));
                return;
            }

            if (state.settings.mode === 'whitelist' && !state.whitelist.has(playerId)) {
                const msg = `⛔ ${playerName} n'est pas dans la whitelist`;
                log(msg, '#ff9900');
                showToast(msg, 'warning');
                reject(new Error('Not whitelisted'));
                return;
            }

            if (!uw.Game || !uw.Game.townId) {
                reject(new Error('Game.townId non disponible'));
                return;
            }

            const townId = uw.Game.townId;
            const server = getWorldServer();
            const csrfToken = getCSRFToken();

            const baseUrl = `https://${server}.grepolis.com/game/alliance`;
            const params = new URLSearchParams({
                town_id: townId,
                action: 'invite'
            });

            if (csrfToken) {
                params.append('h', csrfToken);
            }

            const url = `${baseUrl}?${params.toString()}`;

            const payload = {
                player_name: playerName,
                town_id: townId,
                nl_init: true
            };

            const formData = `json=${encodeURIComponent(JSON.stringify(payload))}`;
            const cookies = getCookies();
            const cookieString = Object.entries(cookies)
                .map(([key, value]) => `${key}=${value}`)
                .join('; ');

            log(`📤 Invitation: ${playerName}`, '#2196F3');

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'text/plain, */*; q=0.01',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cookie': cookieString,
                    'Origin': `https://${server}.grepolis.com`,
                    'Referer': window.location.href
                },
                data: formData,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        // Vérifier si succès dans json.success
                        if (response.status === 200 && data.json && data.json.success) {
                            // Succès
                            state.stats.totalInvites++;
                            state.stats.successfulInvites++;

                            const hour = new Date().getHours();
                            state.stats.invitesByHour[hour]++;

                            saveStats();

                            const successMsg = data.json.success;
                            log(`✅ ${successMsg}`, '#4CAF50');
                            showToast(`✅ ${playerName}: ${successMsg}`, 'success');

                            saveHistory({
                                type: 'invite_success',
                                playerId: playerId,
                                playerName: playerName,
                                source: source,
                                timestamp: new Date().toISOString(),
                                message: `✅ ${playerName}: ${successMsg}`
                            });

                            if (state.settings.discordEnabled) {
                                sendDiscordNotification(
                                    '✅ Invitation envoyée',
                                    `${playerName} a été invité à rejoindre l'alliance`,
                                    3066993
                                );
                            }

                            resolve(data);

                        } else {
                            // Erreur
                            state.stats.totalInvites++;
                            state.stats.failedInvites++;
                            saveStats();

                            const errorMsg = data?.json?.error || data?.error || data?.message || 'Erreur inconnue';
                            log(`❌ Erreur: ${errorMsg}`, '#ff0000');
                            showToast(`❌ ${playerName}: ${errorMsg}`, 'error');

                            saveHistory({
                                type: 'invite_error',
                                playerId: playerId,
                                playerName: playerName,
                                source: source,
                                timestamp: new Date().toISOString(),
                                message: `❌ ${playerName}: ${errorMsg}`,
                                error: errorMsg
                            });

                            reject(new Error(errorMsg));
                        }

                        updateUI();

                    } catch (e) {
                        log(`❌ Erreur parsing: ${e.message}`, '#ff0000');
                        showToast(`❌ Erreur: ${e.message}`, 'error');
                        reject(e);
                    }
                },
                onerror: function(error) {
                    state.stats.totalInvites++;
                    state.stats.failedInvites++;
                    saveStats();
                    showToast('❌ Erreur réseau', 'error');
                    reject(error);
                }
            });
        });
    }

    // ==================== VÉRIFICATION MEMBRES ====================

    async function checkForChanges() {
        if (!state.isActive && state.settings.mode !== 'surveillance') {
            return;
        }

        log('🔄 Vérification...', '#0066cc');
        state.stats.lastCheck = new Date().toISOString();
        saveStats();

        const newMembers = await getCurrentMembers();

        if (newMembers.size === 0) {
            log('❌ Aucun membre trouvé', '#ff0000');
            showToast('❌ Aucun membre trouvé', 'error');
            return { success: false, message: 'Aucun membre trouvé' };
        }

        // Initialisation
        if (!state.isInitialized) {
            state.currentMembers = newMembers;
            saveMembers();
            state.isInitialized = true;
            log(`✅ Initialisé: ${state.currentMembers.size} membres`, '#4CAF50');

            saveHistory({
                type: 'init',
                timestamp: new Date().toISOString(),
                message: `🚀 ${state.currentMembers.size} membres détectés`
            });

            updateUI();
            showToast(`✅ ${state.currentMembers.size} membres détectés`, 'success');
            return { success: true, message: `${state.currentMembers.size} membres détectés`, type: 'init' };
        }

        // Détecter changements
        const leavers = [...state.currentMembers].filter(id => !newMembers.has(id));
        const joiners = [...newMembers].filter(id => !state.currentMembers.has(id));

        // Départs
        if (leavers.length > 0) {
            state.stats.totalDepartures += leavers.length;

            const today = new Date().toISOString().split('T')[0];
            state.stats.departuresByDay[today] = (state.stats.departuresByDay[today] || 0) + leavers.length;

            saveStats();

            const leaverNames = leavers.map(id => state.allPlayers[id]?.name || id).join(', ');
            log(`⚠️ ${leavers.length} départ(s): ${leaverNames}`, '#ff9900');

            saveHistory({
                type: 'leave',
                playerIds: leavers,
                timestamp: new Date().toISOString(),
                message: `⚠️ ${leavers.length} départ(s): ${leaverNames}`
            });

            // Discord notification
            if (state.settings.discordEnabled) {
                sendDiscordNotification(
                    `⚠️ ${leavers.length} départ(s)`,
                    `Joueurs: ${leaverNames}`,
                    15158332
                );
            }

            // Inviter (sauf en mode surveillance)
            if (state.settings.mode !== 'surveillance' && state.isActive) {
                leavers.forEach((playerId, index) => {
                    setTimeout(() => {
                        invitePlayer(playerId, 'auto').catch(() => {});
                    }, state.settings.inviteDelay + (index * 2000));
                });
            }
        }

        // Arrivées
        if (joiners.length > 0) {
            state.stats.totalJoins += joiners.length;
            saveStats();

            const joinerNames = joiners.map(id => state.allPlayers[id]?.name || id).join(', ');
            log(`➕ ${joiners.length} arrivée(s): ${joinerNames}`, '#00cc66');

            saveHistory({
                type: 'join',
                playerIds: joiners,
                timestamp: new Date().toISOString(),
                message: `➕ ${joiners.length} arrivée(s): ${joinerNames}`
            });
        }

        let resultMessage = '';
        if (leavers.length === 0 && joiners.length === 0) {
            log('✓ Aucun changement', '#00cc66');
            resultMessage = 'Aucun changement détecté';
            showToast('✓ Aucun changement', 'info');
        } else {
            const parts = [];
            if (leavers.length > 0) parts.push(`${leavers.length} départ(s)`);
            if (joiners.length > 0) parts.push(`${joiners.length} arrivée(s)`);
            resultMessage = parts.join(', ');
            showToast(`✓ ${resultMessage}`, 'info');
        }

        state.currentMembers = newMembers;
        saveMembers();
        updateUI();

        return {
            success: true,
            message: resultMessage,
            leavers: leavers.length,
            joiners: joiners.length
        };
    }

    // ==================== PLANIFICATEUR ====================

    function startScheduler() {
        if (state.schedulerInterval) {
            clearInterval(state.schedulerInterval);
        }

        if (!state.settings.schedulerEnabled) {
            return;
        }

        log(`⏰ Planificateur activé (${state.settings.schedulerInterval / 1000}s)`, '#9c27b0');

        state.schedulerInterval = setInterval(() => {
            if (state.settings.schedulerPlayers.length === 0) {
                return;
            }

            log(`⏰ Planificateur: ${state.settings.schedulerPlayers.length} invitations`, '#9c27b0');

            state.settings.schedulerPlayers.forEach((playerId, index) => {
                setTimeout(() => {
                    invitePlayer(playerId, 'scheduler').catch(() => {});
                }, index * 2000);
            });

        }, state.settings.schedulerInterval);
    }

    function stopScheduler() {
        if (state.schedulerInterval) {
            clearInterval(state.schedulerInterval);
            state.schedulerInterval = null;
            log('⏸️ Planificateur arrêté', '#ff9900');
        }
    }

    // ==================== AUTOCOMPLETE RÉUTILISABLE ====================

    function createPlayerAutocomplete(inputId, dropdownId, onSelect) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);

        if (!input || !dropdown) return;

        input.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();

            if (query.length < 2) {
                dropdown.style.display = 'none';
                return;
            }

            const matches = Object.values(state.allPlayers)
                .filter(p => p.name.toLowerCase().includes(query))
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, 10);

            if (matches.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            dropdown.innerHTML = matches.map(player => {
                const icon = player.allianceId ? '👥' : '🚶';

                return `
                    <div class="autocomplete-item" data-id="${player.id}" data-name="${player.name}" style="
                        padding: 10px;
                        cursor: pointer;
                        border-bottom: 1px solid #eee;
                        transition: background 0.2s;
                    ">
                        <div style="font-weight: bold; color: #333;">
                            ${icon} ${player.name}
                        </div>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">
                            ID: ${player.id} | Points: ${player.points.toLocaleString()} | Villes: ${player.towns}
                        </div>
                    </div>
                `;
            }).join('');

            dropdown.style.display = 'block';

            // Click handlers
            dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.background = '#f0f0f0';
                });
                item.addEventListener('mouseleave', function() {
                    this.style.background = 'white';
                });
                item.addEventListener('click', function() {
                    const playerId = parseInt(this.dataset.id);
                    const playerName = this.dataset.name;
                    input.value = playerName;
                    input.dataset.selectedId = playerId;
                    dropdown.style.display = 'none';
                    if (onSelect) onSelect(playerId, playerName);
                });
            });
        });

        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // ==================== INTERFACE UTILISATEUR ====================

    function createPanel() {
        // Ajouter les animations CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translate(-50%, -100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translate(-50%, 0); opacity: 1; }
                to { transform: translate(-50%, -100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'ai-panel';
        panel.style.cssText = `
            position: fixed;
            ${state.panelPosition.x ? `left: ${state.panelPosition.x}px;` : 'right: 10px;'}
            ${state.panelPosition.y ? `top: ${state.panelPosition.y}px;` : 'top: 10px;'}
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 13px;
            width: 420px;
            max-height: 85vh;
            overflow: hidden;
            transition: all 0.3s ease;
        `;

        panel.innerHTML = `
            <div id="ai-header" style="
                padding: 15px;
                background: rgba(0,0,0,0.2);
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            ">
                <div style="font-weight: bold; font-size: 16px;">
                    🤖 Auto-Invite v1.0
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="ai-minimize" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                    ">_</button>
                </div>
            </div>

            <div id="ai-content" style="max-height: calc(85vh - 60px); overflow-y: auto;">
                <div id="ai-tabs" style="
                    display: flex;
                    background: rgba(0,0,0,0.15);
                    border-bottom: 2px solid rgba(255,255,255,0.1);
                ">
                    <button class="ai-tab" data-tab="dashboard">📊 Dashboard</button>
                    <button class="ai-tab" data-tab="invite">📤 Inviter</button>
                    <button class="ai-tab" data-tab="lists">📋 Listes</button>
                    <button class="ai-tab" data-tab="stats">📈 Stats</button>
                    <button class="ai-tab" data-tab="settings">⚙️ Config</button>
                </div>

                <div id="ai-tab-dashboard" class="ai-tab-content" style="padding: 15px;"></div>
                <div id="ai-tab-invite" class="ai-tab-content" style="padding: 15px; display: none;"></div>
                <div id="ai-tab-lists" class="ai-tab-content" style="padding: 15px; display: none;"></div>
                <div id="ai-tab-stats" class="ai-tab-content" style="padding: 15px; display: none;"></div>
                <div id="ai-tab-settings" class="ai-tab-content" style="padding: 15px; display: none;"></div>
            </div>
        `;

        document.body.appendChild(panel);

        // Style des tabs
        document.querySelectorAll('.ai-tab').forEach(tab => {
            tab.style.cssText = `
                flex: 1;
                padding: 12px;
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.7);
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                border-bottom: 3px solid transparent;
            `;

            tab.addEventListener('click', function() {
                switchTab(this.dataset.tab);
            });

            tab.addEventListener('mouseenter', function() {
                if (state.activeTab !== this.dataset.tab) {
                    this.style.background = 'rgba(255,255,255,0.1)';
                }
            });

            tab.addEventListener('mouseleave', function() {
                if (state.activeTab !== this.dataset.tab) {
                    this.style.background = 'transparent';
                }
            });
        });

        setupDraggable();
        document.getElementById('ai-minimize').addEventListener('click', toggleMinimize);

        renderDashboard();
        renderInviteTab();
        renderListsTab();
        renderStatsTab();
        renderSettingsTab();

        switchTab('dashboard');
    }

    function setupDraggable() {
        const panel = document.getElementById('ai-panel');
        const header = document.getElementById('ai-header');

        let offsetX, offsetY;

        header.addEventListener('mousedown', function(e) {
            state.isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.transition = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!state.isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            if (state.isDragging) {
                state.isDragging = false;
                panel.style.transition = 'all 0.3s ease';

                state.panelPosition = {
                    x: panel.offsetLeft,
                    y: panel.offsetTop
                };
                savePanelPosition();
            }
        });
    }

    function toggleMinimize() {
        const content = document.getElementById('ai-content');
        const panel = document.getElementById('ai-panel');
        const btn = document.getElementById('ai-minimize');

        state.isMinimized = !state.isMinimized;

        if (state.isMinimized) {
            content.style.display = 'none';
            panel.style.width = '200px';
            btn.textContent = '□';
        } else {
            content.style.display = 'block';
            panel.style.width = '420px';
            btn.textContent = '_';
        }
    }

    function switchTab(tabName) {
        state.activeTab = tabName;

        document.querySelectorAll('.ai-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.style.color = 'white';
                tab.style.background = 'rgba(255,255,255,0.15)';
                tab.style.borderBottom = '3px solid white';
            } else {
                tab.style.color = 'rgba(255,255,255,0.7)';
                tab.style.background = 'transparent';
                tab.style.borderBottom = '3px solid transparent';
            }
        });

        document.querySelectorAll('.ai-tab-content').forEach(content => {
            content.style.display = 'none';
        });

        document.getElementById(`ai-tab-${tabName}`).style.display = 'block';
    }

    // ==================== DASHBOARD ====================

    function renderDashboard() {
        const container = document.getElementById('ai-tab-dashboard');

        const modeColors = {
            standard: '#4CAF50',
            surveillance: '#2196F3',
            blacklist: '#ff9800',
            whitelist: '#9c27b0'
        };

        const modeLabels = {
            standard: 'Standard',
            surveillance: 'Surveillance',
            blacklist: 'Blacklist',
            whitelist: 'Whitelist'
        };

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">
                    Status du Bot
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">État</div>
                        <div style="font-size: 16px; font-weight: bold;" id="ai-dash-status">
                            ${state.isActive ? '🟢 Actif' : '🔴 Inactif'}
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Mode</div>
                        <div style="font-size: 16px; font-weight: bold; color: ${modeColors[state.settings.mode]};">
                            ${modeLabels[state.settings.mode]}
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Membres</div>
                        <div style="font-size: 16px; font-weight: bold;" id="ai-dash-members">
                            ${state.currentMembers.size}
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Invitations</div>
                        <div style="font-size: 16px; font-weight: bold;" id="ai-dash-invites">
                            ${state.stats.successfulInvites}
                        </div>
                    </div>
                </div>

                <button id="ai-dash-toggle" style="
                    width: 100%;
                    padding: 12px;
                    background: ${state.isActive ? '#f44336' : '#4CAF50'};
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                ">
                    ${state.isActive ? '⏸️ Désactiver' : '▶️ Activer'}
                </button>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    Historique Récent
                </div>
                <div id="ai-dash-history" style="
                    max-height: 200px;
                    overflow-y: auto;
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    padding: 10px;
                "></div>
            </div>
        `;

        document.getElementById('ai-dash-toggle').addEventListener('click', function() {
            state.isActive = !state.isActive;
            log(state.isActive ? '✅ Bot activé' : '⏸️ Bot désactivé', state.isActive ? '#4CAF50' : '#ff9900');
            showToast(state.isActive ? '✅ Bot activé' : '⏸️ Bot désactivé', state.isActive ? 'success' : 'info');
            renderDashboard();
        });

        updateHistoryUI();
    }

    function updateHistoryUI() {
        const container = document.getElementById('ai-dash-history');
        if (!container) return;

        if (state.history.length === 0) {
            container.innerHTML = '<div style="text-align: center; opacity: 0.6; padding: 20px;">Aucun événement</div>';
            return;
        }

        const icons = {
            init: '🚀',
            leave: '⚠️',
            join: '➕',
            invite_success: '✅',
            invite_error: '❌'
        };

        container.innerHTML = state.history.slice(0, 10).map(event => {
            const time = new Date(event.timestamp).toLocaleTimeString('fr-FR');
            const icon = icons[event.type] || '•';

            return `
                <div style="
                    margin-bottom: 8px;
                    padding: 8px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                    font-size: 12px;
                ">
                    <div style="font-weight: bold; margin-bottom: 3px;">
                        ${icon} ${time}
                    </div>
                    <div style="opacity: 0.9;">
                        ${event.message}
                    </div>
                </div>
            `;
        }).join('');
    }

    // ==================== ONGLET INVITATION ====================

    function renderInviteTab() {
        const container = document.getElementById('ai-tab-invite');

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    Invitation Manuelle
                </div>

                <div style="position: relative; margin-bottom: 10px;">
                    <input id="ai-invite-input" type="text" placeholder="Rechercher un joueur..." style="
                        width: 100%;
                        padding: 10px;
                        border: none;
                        border-radius: 8px;
                        font-size: 13px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                    ">
                    <div id="ai-invite-dropdown" style="
                        display: none;
                        position: absolute;
                        top: 45px;
                        left: 0;
                        right: 0;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        max-height: 250px;
                        overflow-y: auto;
                        z-index: 1000;
                    "></div>
                </div>

                <button id="ai-invite-btn" style="
                    width: 100%;
                    padding: 12px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    📤 Inviter ce joueur
                </button>
            </div>

            <div>
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    Vérifier Maintenant
                </div>
                <button id="ai-check-now" style="
                    width: 100%;
                    padding: 12px;
                    background: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    🔄 Vérifier les changements
                </button>
            </div>
        `;

        createPlayerAutocomplete('ai-invite-input', 'ai-invite-dropdown');

        document.getElementById('ai-invite-btn').addEventListener('click', function() {
            const input = document.getElementById('ai-invite-input');
            const playerId = input.dataset.selectedId;

            if (!playerId) {
                showToast('⚠️ Veuillez sélectionner un joueur !', 'warning');
                return;
            }

            this.disabled = true;
            this.textContent = '⏳ Invitation en cours...';

            invitePlayer(parseInt(playerId), 'manual').then(() => {
                input.value = '';
                delete input.dataset.selectedId;
            }).catch(() => {}).finally(() => {
                this.disabled = false;
                this.textContent = '📤 Inviter ce joueur';
            });
        });

        document.getElementById('ai-check-now').addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = '⏳ Vérification en cours...';

            const result = await checkForChanges();

            this.disabled = false;
            this.textContent = '🔄 Vérifier les changements';
        });
    }

    // ==================== ONGLET LISTES ====================

    function renderListsTab() {
        const container = document.getElementById('ai-tab-lists');

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    🚫 Blacklist (${state.blacklist.size})
                </div>
                <div style="font-size: 12px; opacity: 0.8; margin-bottom: 10px;">
                    Ces joueurs ne seront jamais invités
                </div>
                <div id="ai-blacklist-container" style="
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    padding: 10px;
                    max-height: 150px;
                    overflow-y: auto;
                    margin-bottom: 10px;
                "></div>
                <div style="position: relative;">
                    <input id="ai-blacklist-input" type="text" placeholder="Rechercher un joueur..." style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        margin-bottom: 5px;
                    ">
                    <div id="ai-blacklist-dropdown" style="
                        display: none;
                        position: absolute;
                        top: 38px;
                        left: 0;
                        right: 0;
                        background: white;
                        border-radius: 6px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        max-height: 200px;
                        overflow-y: auto;
                        z-index: 1000;
                    "></div>
                </div>
                <button id="ai-blacklist-add" style="
                    width: 100%;
                    padding: 8px;
                    background: #f44336;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">Ajouter à la Blacklist</button>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    ✅ Whitelist (${state.whitelist.size})
                </div>
                <div style="font-size: 12px; opacity: 0.8; margin-bottom: 10px;">
                    Seuls ces joueurs seront invités (mode whitelist)
                </div>
                <div id="ai-whitelist-container" style="
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    padding: 10px;
                    max-height: 150px;
                    overflow-y: auto;
                    margin-bottom: 10px;
                "></div>
                <div style="position: relative;">
                    <input id="ai-whitelist-input" type="text" placeholder="Rechercher un joueur..." style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        margin-bottom: 5px;
                    ">
                    <div id="ai-whitelist-dropdown" style="
                        display: none;
                        position: absolute;
                        top: 38px;
                        left: 0;
                        right: 0;
                        background: white;
                        border-radius: 6px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        max-height: 200px;
                        overflow-y: auto;
                        z-index: 1000;
                    "></div>
                </div>
                <button id="ai-whitelist-add" style="
                    width: 100%;
                    padding: 8px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">Ajouter à la Whitelist</button>
            </div>
        `;

        updateListsUI();

        // Autocomplete pour blacklist
        createPlayerAutocomplete('ai-blacklist-input', 'ai-blacklist-dropdown');

        // Autocomplete pour whitelist
        createPlayerAutocomplete('ai-whitelist-input', 'ai-whitelist-dropdown');

        document.getElementById('ai-blacklist-add').addEventListener('click', function() {
            const input = document.getElementById('ai-blacklist-input');
            const id = parseInt(input.dataset.selectedId);
            if (!id || isNaN(id)) {
                showToast('⚠️ Veuillez sélectionner un joueur !', 'warning');
                return;
            }

            const name = state.allPlayers[id]?.name || id;
            state.blacklist.add(id);
            saveBlacklist();
            input.value = '';
            delete input.dataset.selectedId;
            renderListsTab();
            showToast(`✅ ${name} ajouté à la blacklist`, 'success');
            log(`Ajouté à la blacklist: ${name}`, '#ff9900');
        });

        document.getElementById('ai-whitelist-add').addEventListener('click', function() {
            const input = document.getElementById('ai-whitelist-input');
            const id = parseInt(input.dataset.selectedId);
            if (!id || isNaN(id)) {
                showToast('⚠️ Veuillez sélectionner un joueur !', 'warning');
                return;
            }

            const name = state.allPlayers[id]?.name || id;
            state.whitelist.add(id);
            saveWhitelist();
            input.value = '';
            delete input.dataset.selectedId;
            renderListsTab();
            showToast(`✅ ${name} ajouté à la whitelist`, 'success');
            log(`Ajouté à la whitelist: ${name}`, '#4CAF50');
        });
    }

    function updateListsUI() {
        // Blacklist
        const blacklistContainer = document.getElementById('ai-blacklist-container');
        if (blacklistContainer) {
            if (state.blacklist.size === 0) {
                blacklistContainer.innerHTML = '<div style="text-align: center; opacity: 0.6; padding: 10px;">Aucun joueur</div>';
            } else {
                blacklistContainer.innerHTML = Array.from(state.blacklist).map(id => {
                    const name = state.allPlayers[id]?.name || `ID ${id}`;
                    return `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 6px;
                            margin-bottom: 5px;
                            background: rgba(255,255,255,0.05);
                            border-radius: 4px;
                        ">
                            <span>${name} (${id})</span>
                            <button class="remove-blacklist" data-id="${id}" style="
                                background: #f44336;
                                color: white;
                                border: none;
                                padding: 3px 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 11px;
                            ">✕</button>
                        </div>
                    `;
                }).join('');

                blacklistContainer.querySelectorAll('.remove-blacklist').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.dataset.id);
                        const name = state.allPlayers[id]?.name || id;
                        state.blacklist.delete(id);
                        saveBlacklist();
                        renderListsTab();
                        showToast(`✅ ${name} retiré de la blacklist`, 'success');
                        log(`Retiré de la blacklist: ${name}`, '#ff9900');
                    });
                });
            }
        }

        // Whitelist
        const whitelistContainer = document.getElementById('ai-whitelist-container');
        if (whitelistContainer) {
            if (state.whitelist.size === 0) {
                whitelistContainer.innerHTML = '<div style="text-align: center; opacity: 0.6; padding: 10px;">Aucun joueur</div>';
            } else {
                whitelistContainer.innerHTML = Array.from(state.whitelist).map(id => {
                    const name = state.allPlayers[id]?.name || `ID ${id}`;
                    return `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 6px;
                            margin-bottom: 5px;
                            background: rgba(255,255,255,0.05);
                            border-radius: 4px;
                        ">
                            <span>${name} (${id})</span>
                            <button class="remove-whitelist" data-id="${id}" style="
                                background: #f44336;
                                color: white;
                                border: none;
                                padding: 3px 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 11px;
                            ">✕</button>
                        </div>
                    `;
                }).join('');

                whitelistContainer.querySelectorAll('.remove-whitelist').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.dataset.id);
                        const name = state.allPlayers[id]?.name || id;
                        state.whitelist.delete(id);
                        saveWhitelist();
                        renderListsTab();
                        showToast(`✅ ${name} retiré de la whitelist`, 'success');
                        log(`Retiré de la whitelist: ${name}`, '#4CAF50');
                    });
                });
            }
        }
    }

    // ==================== ONGLET STATISTIQUES ====================

    function renderStatsTab() {
        const container = document.getElementById('ai-tab-stats');

        const successRate = state.stats.totalInvites > 0
            ? Math.round((state.stats.successfulInvites / state.stats.totalInvites) * 100)
            : 0;

        const mostActiveHour = state.stats.invitesByHour.indexOf(Math.max(...state.stats.invitesByHour));

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">
                    📊 Statistiques Globales
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Total Invitations</div>
                        <div style="font-size: 20px; font-weight: bold;">${state.stats.totalInvites}</div>
                    </div>

                    <div style="background: rgba(76,175,80,0.3); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Réussies</div>
                        <div style="font-size: 20px; font-weight: bold;">${state.stats.successfulInvites}</div>
                    </div>

                    <div style="background: rgba(244,67,54,0.3); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Échouées</div>
                        <div style="font-size: 20px; font-weight: bold;">${state.stats.failedInvites}</div>
                    </div>

                    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Taux Succès</div>
                        <div style="font-size: 20px; font-weight: bold;">${successRate}%</div>
                    </div>

                    <div style="background: rgba(255,152,0,0.3); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Départs</div>
                        <div style="font-size: 20px; font-weight: bold;">${state.stats.totalDepartures}</div>
                    </div>

                    <div style="background: rgba(76,175,80,0.3); padding: 12px; border-radius: 8px;">
                        <div style="font-size: 11px; opacity: 0.8;">Arrivées</div>
                        <div style="font-size: 20px; font-weight: bold;">${state.stats.totalJoins}</div>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    ⏰ Activité par Heure
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 13px; margin-bottom: 5px;">
                        Heure la plus active: <strong>${mostActiveHour}h</strong> (${state.stats.invitesByHour[mostActiveHour]} invitations)
                    </div>
                    <div style="display: flex; align-items: flex-end; gap: 2px; height: 80px;">
                        ${state.stats.invitesByHour.map((count, hour) => {
                            const maxCount = Math.max(...state.stats.invitesByHour, 1);
                            const height = (count / maxCount) * 100;
                            return `
                                <div style="
                                    flex: 1;
                                    background: rgba(76,175,80,0.6);
                                    height: ${height}%;
                                    border-radius: 2px 2px 0 0;
                                    position: relative;
                                " title="${hour}h: ${count}">
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; margin-top: 5px; opacity: 0.7;">
                        <span>0h</span>
                        <span>6h</span>
                        <span>12h</span>
                        <span>18h</span>
                        <span>23h</span>
                    </div>
                </div>
            </div>

            <div>
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    📅 Départs par Jour (7 derniers)
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
                    ${Object.entries(state.stats.departuresByDay)
                        .slice(-7)
                        .map(([date, count]) => `
                            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <span>${new Date(date).toLocaleDateString('fr-FR')}</span>
                                <span style="font-weight: bold;">${count}</span>
                            </div>
                        `).join('') || '<div style="text-align: center; opacity: 0.6; padding: 10px;">Aucune donnée</div>'}
                </div>
            </div>
        `;
    }

    // ==================== ONGLET PARAMÈTRES ====================

    function renderSettingsTab() {
        const container = document.getElementById('ai-tab-settings');

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    🎮 Mode de Fonctionnement
                </div>
                <select id="ai-mode-select" style="
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.9);
                    color: #333;
                    font-size: 13px;
                ">
                    <option value="standard">Standard - Inviter tous les départs</option>
                    <option value="surveillance">Surveillance - Notifier uniquement</option>
                    <option value="blacklist">Blacklist - Exclure certains joueurs</option>
                    <option value="whitelist">Whitelist - Inviter uniquement certains</option>
                </select>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    ⏱️ Intervalles (millisecondes)
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 12px; opacity: 0.9;">Vérification (60000 = 1min)</label>
                    <input id="ai-check-interval" type="number" value="${state.settings.checkInterval}" style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        margin-top: 5px;
                    ">
                </div>
                <div>
                    <label style="font-size: 12px; opacity: 0.9;">Délai entre invitations (5000 = 5s)</label>
                    <input id="ai-invite-delay" type="number" value="${state.settings.inviteDelay}" style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        margin-top: 5px;
                    ">
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    🔔 Discord Webhook
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input id="ai-discord-enabled" type="checkbox" ${state.settings.discordEnabled ? 'checked' : ''}>
                        <span>Activer les notifications Discord</span>
                    </label>
                </div>
                <input id="ai-discord-webhook" type="text" placeholder="https://discord.com/api/webhooks/..." value="${state.settings.discordWebhook}" style="
                    width: 100%;
                    padding: 8px;
                    border: none;
                    border-radius: 6px;
                    background: rgba(255,255,255,0.9);
                    color: #333;
                    font-size: 12px;
                ">
            </div>

            <div style="margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                    📅 Planificateur d'Invitations
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input id="ai-scheduler-enabled" type="checkbox" ${state.settings.schedulerEnabled ? 'checked' : ''}>
                        <span>Activer le planificateur</span>
                    </label>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 12px; opacity: 0.9;">Intervalle (3600000 = 1h)</label>
                    <input id="ai-scheduler-interval" type="number" value="${state.settings.schedulerInterval}" style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        margin-top: 5px;
                    ">
                </div>
                <div>
                    <label style="font-size: 12px; opacity: 0.9;">IDs à inviter (séparés par virgule)</label>
                    <input id="ai-scheduler-players" type="text" placeholder="123,456,789" value="${state.settings.schedulerPlayers.join(',')}" style="
                        width: 100%;
                        padding: 8px;
                        border: none;
                        border-radius: 6px;
                        background: rgba(255,255,255,0.9);
                        color: #333;
                        margin-top: 5px;
                    ">
                </div>
            </div>

            <button id="ai-save-settings" style="
                width: 100%;
                padding: 12px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
            ">
                💾 Sauvegarder les Paramètres
            </button>
        `;

        document.getElementById('ai-mode-select').value = state.settings.mode;

        document.getElementById('ai-save-settings').addEventListener('click', function() {
            state.settings.mode = document.getElementById('ai-mode-select').value;
            state.settings.checkInterval = parseInt(document.getElementById('ai-check-interval').value);
            state.settings.inviteDelay = parseInt(document.getElementById('ai-invite-delay').value);
            state.settings.discordEnabled = document.getElementById('ai-discord-enabled').checked;
            state.settings.discordWebhook = document.getElementById('ai-discord-webhook').value;

            const schedulerWasEnabled = state.settings.schedulerEnabled;
            state.settings.schedulerEnabled = document.getElementById('ai-scheduler-enabled').checked;
            state.settings.schedulerInterval = parseInt(document.getElementById('ai-scheduler-interval').value);

            const playersInput = document.getElementById('ai-scheduler-players').value;
            state.settings.schedulerPlayers = playersInput
                .split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id));

            saveSettings();

            if (state.checkInterval) {
                clearInterval(state.checkInterval);
            }
            state.checkInterval = setInterval(checkForChanges, state.settings.checkInterval);

            if (schedulerWasEnabled !== state.settings.schedulerEnabled || state.settings.schedulerEnabled) {
                stopScheduler();
                if (state.settings.schedulerEnabled) {
                    startScheduler();
                }
            }

            log('✅ Paramètres sauvegardés', '#4CAF50');
            showToast('✅ Paramètres sauvegardés !', 'success');

            renderDashboard();
        });
    }

    // ==================== UPDATE UI ====================

    function updateUI() {
        const statusEl = document.getElementById('ai-dash-status');
        if (statusEl) {
            statusEl.textContent = state.isActive ? '🟢 Actif' : '🔴 Inactif';
        }

        const membersEl = document.getElementById('ai-dash-members');
        if (membersEl) {
            membersEl.textContent = state.currentMembers.size;
        }

        const invitesEl = document.getElementById('ai-dash-invites');
        if (invitesEl) {
            invitesEl.textContent = state.stats.successfulInvites;
        }
    }

    // ==================== INITIALISATION ====================

    async function init() {
        log('═══════════════════════════════════', '#667eea');
        log('🚀 Auto-Invite 6.0', '#667eea');
        log('═══════════════════════════════════', '#667eea');

        if (!uw.Game || !uw.Game.alliance_id) {
            log('⚠️ API pas prête, retry dans 2s...', '#ff9900');
            setTimeout(init, 2000);
            return;
        }

        log(`✅ Alliance ID: ${uw.Game.alliance_id}`, '#4CAF50');
        log(`✅ Serveur: ${getWorldServer()}`, '#4CAF50');

        loadSettings();
        loadStats();
        loadMembers();
        loadHistory();
        loadBlacklist();
        loadWhitelist();
        loadPanelPosition();

        const hasCachedPlayers = loadPlayers();

        if (!hasCachedPlayers) {
            log('⏳ Chargement des joueurs...', '#ff9900');
            await getAllPlayers();
        } else {
            log(`👥 ${Object.keys(state.allPlayers).length} joueurs en cache`, '#4CAF50');
        }

        createPanel();

        setTimeout(() => {
            log('🔍 Première vérification...', '#2196F3');
            checkForChanges();
        }, 3000);

        state.checkInterval = setInterval(() => {
            if (state.isActive || state.settings.mode === 'surveillance') {
                checkForChanges();
            }
        }, state.settings.checkInterval);

        if (state.settings.schedulerEnabled) {
            startScheduler();
        }

        log(`✅ Bot démarré`, '#4CAF50');
        showToast('✅ Bot Auto-Invite activé !', 'success');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();
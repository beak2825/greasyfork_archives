// ==UserScript==
// @license MIT
// @name         Torn Poker Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Torn poker helper with mobile support
// @author       You
// @match        *://www.torn.com/page.php?sid=holdem*
// @connect      tornteampoker.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/551342/Torn%20Poker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551342/Torn%20Poker%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styles = `
    #my-torn-helper-window {
        position: fixed;
        top: 10%;
        left: 10%;
        width: 300px;
        background-color: #333;
        color: #f0f0f0;
        border: 1px solid #555;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        font-family: Arial, sans-serif;
        font-size: 14px;
    }
    .window-header {
        padding: 10px;
        background-color: #444;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .window-header button {
        background: #555; border: none; color: white; cursor: pointer;
        width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 3px;
    }
    .window-menu { display: flex; background-color: #2c2c2c; padding: 5px; gap: 5px; }
    .menu-button {
        flex-grow: 1; padding: 8px; background-color: #555; color: #f0f0f0;
        border: none; border-radius: 3px; cursor: pointer; text-align: center; transition: background-color 0.2s;
    }
    .menu-button:hover { background-color: #666; }
    .menu-button.active { background-color: #2196F3; }
    .menu-button.warning { background-color: #D32F2F; color: white; }
    .menu-button.warning:hover { background-color: #B71C1C; }
    .tab-content { padding: 15px; }
    .settings-section { margin-bottom: 20px; }
    .api-section { display: flex; flex-direction: column; gap: 8px; }
    .api-section input {
        padding: 8px; background-color: #555; border: 1px solid #777;
        color: #f0f0f0; border-radius: 3px; font-size: 14px;
    }
    #save-status.error { color: #F44336; }
    .chat-container { display: flex; flex-direction: column; height: 300px; }
    #chat-display {
        display: flex; flex-direction: column; flex-grow: 1; border: 1px solid #555; background-color: #2c2c2c;
        padding: 10px; overflow-y: auto; margin-bottom: 10px; border-radius: 3px; font-size: 14px;
    }
    #chat-display p { margin: 0 0 8px 0; word-wrap: break-word; }
    .self-message {
        background-color: #0d47a1; align-self: flex-end; border-radius: 8px;
        padding: 8px 12px; max-width: 80%;
    }
    #chat-input {
        border: 1px solid #555; background-color: #3f3f3f; color: #f0f0f0; padding: 8px; border-radius: 3px;
        resize: vertical; min-height: 40px; font-family: inherit; font-size: 14px;
    }
    #chat-send-button {
        padding: 10px; width: 100%; background-color: #2196F3; color: white;
        border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.2s;
    }
    #chat-send-button:hover { background-color: #1976D2; }
    .chat-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .chat-toggle-button {
        padding: 5px 10px; color: white; border: none; border-radius: 5px;
        font-weight: bold; cursor: pointer; transition: background-color 0.2s;
    }
    .chat-toggle-button.connect-button { background-color: #4CAF50; }
    .chat-toggle-button.connect-button:hover { background-color: #45a049; }
    .chat-toggle-button.disconnect-button { background-color: #f44336; }
    .chat-toggle-button.disconnect-button:hover { background-color: #d32f2f; }
    .chat-toggle-button:disabled { background-color: #FFC107; color: black; cursor: wait; }
    .chat-status { padding: 5px 10px; border-radius: 5px; font-weight: bold; font-size: 12px; }
    .status-connected { color: white; background-color: #4CAF50; }
    .status-disconnected { color: #e0e0e0; background-color: #f44336; }
    .status-connecting { color: black; background-color: #FFC107; }
    .resizer {
        position: absolute; right: 0; bottom: 0; width: 10px; height: 10px; cursor: se-resize;
        background: repeating-linear-gradient(-45deg, #555, #555 1px, transparent 1px, transparent 4px);
    }
    .poker-controls { display: flex; gap: 10px; margin-bottom: 15px; align-items: center; }
    .poker-controls button {
        flex-basis: 100%; padding: 10px; color: white; border: none; border-radius: 3px;
        cursor: pointer; font-size: 14px; transition: background-color 0.2s;
    }
    #get-logs-button { background-color: #4CAF50; }
    #get-logs-button:hover { background-color: #45a049; }
    #reset-button { background-color: #6c757d; }
    #reset-button:hover { background-color: #5a6268; }
    .hidden { display: none !important; }
    .player-info { margin-bottom: 10px; }
    .prediction-details summary {
        cursor: pointer; padding: 5px; background-color: #4a4a4a; border-radius: 3px;
        margin-top: 5px; outline: none; font-size: 13px;
    }
    .prediction-details summary:hover { background-color: #5a5a5a; }
    .prediction-details ul {
        list-style-type: none; padding-left: 15px; margin-top: 8px; border-left: 2px solid #555;
    }
    .prediction-details li { padding: 2px 0; font-size: 13px; color: #ccc; }
    `;
    GM_addStyle(styles);

    let socket = null;
    let currentStatus = 'disconnected';
    const backendAddress = 'wss://tornteampoker.com';

    let uiElements = {};
    function broadcastStatus(status) {
        currentStatus = status;
        if (uiElements.updateChatUI) {
            uiElements.updateChatUI(status);
        }
    }

    async function connectWebSocket() {
        if (socket) return;

        broadcastStatus('connecting');

        const chatChannel = await GM_getValue('chatChannel');
        const authToken = await GM_getValue('authToken');

        if (!authToken) {
            console.error("Connection failed: Missing auth token.");
            disconnectWebSocket();
            return;
        }

        const channel = chatChannel || 'general';
        const fullUrl = `${backendAddress}/ws/chat/${channel}/${authToken}/`;

        console.log(`Connecting to WebSocket: ${fullUrl}`);
        socket = new WebSocket(fullUrl);

        socket.onopen = () => {
            broadcastStatus('connected');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'chat_message':
                    if (uiElements.addMessageToChat) uiElements.addMessageToChat(data.user, data.message);
                    break;
                case 'recv_active_game':
                    if (uiElements.render_active_game) uiElements.render_active_game(data.active_game);
                    break;
                case 'update_hands':
                    if (uiElements.send_hand) uiElements.send_hand();
                    break;
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        socket.onclose = () => {
            socket = null;
            broadcastStatus('disconnected');
        };
    }

    function disconnectWebSocket() {
        if (socket) {
            socket.onclose = null;
            socket.close();
            socket = null;
        }
        broadcastStatus('disconnected');
    }

    function sendMessageToSocket(type, payload) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
        } else {
            console.error(`Failed to send ${type} message: WebSocket is not open.`);
        }
    }

    function performAuthRequest(endpoint, username, password) {
        return new Promise((resolve) => {
            const httpAddress = backendAddress.replace(/^ws/, 'http');
            const apiUrl = `${httpAddress}/api/v1/auth/${endpoint}`;
            console.log(apiUrl);

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                data: JSON.stringify({ name: username, password: password }),
                onload: function(response) {
                    resolve(JSON.parse(response.responseText));
                },
                onerror: function(error) {
                    console.error("Auth request failed:", error);
                    resolve({ error: "Network request failed. Check backend URL." });
                }
            });
        });
    }

    function createHelperWindow() {
        const myWindow = document.createElement('div');
        myWindow.id = 'my-torn-helper-window';
        myWindow.innerHTML = `
            <div class="window-header">
                <span>Teamplay tab</span>
                <button id="toggle-button">-</button>
            </div>
            <div class="window-menu">
                <button class="menu-button" data-tab="settings">Settings</button>
                <button class="menu-button" data-tab="chat">Chat</button>
                <button class="menu-button active" data-tab="poker">Poker</button>
            </div>
            <div class="window-content">
                <div id="tab-settings" class="tab-content">
                    <div class="settings-section" id="user-info-section" style="display: none;">
                        <p>User Info:</p>
                        <div>User: <span id="user-name" style="font-weight: bold;">Unknown</span></div>
                        <button id="logout-button" style="width: 100%; padding: 8px; margin-top: 10px; background-color: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">Logout</button>
                    </div>
                    <div class="settings-section" id="auth-form-section">
                        <p>Account:</p>
                        <div class="api-section">
                            <input type="text" id="username-input" placeholder="Username" autocomplete="username">
                            <input type="password" id="password-input" placeholder="Password" autocomplete="current-password">
                        </div>
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <button id="login-button" style="flex-grow: 1; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">Login</button>
                            <button id="register-button" style="flex-grow: 1; padding: 10px; background-color: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">Register</button>
                        </div>
                    </div>
                    <hr style="border-color: #555; margin: 20px 0;">
                    <div class="settings-section">
                        <p>DON'T USE GENERAL CHANNEL IF YOU DON'T WANT TO BE SPYED ON</p><br/>
                        <p>Channel:</p>
                        <div class="api-section">
                            <input type="text" id="channel-input" placeholder="e.g., general">
                        </div>
                    </div>
                    <button id="save-connection-button" style="width: 100%; padding: 10px; background-color: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;">Save Connection Settings</button>
                    <div id="save-status" style="text-align: center; margin-top: 10px; height: 15px;"></div>
                </div>
                <div id="tab-chat" class="tab-content hidden">
                    <div class="chat-controls">
                        <button class="chat-toggle-button connect-button">Connect</button>
                        <div class="chat-status status-disconnected">Status: Disconnected</div>
                    </div>
                    <div class="chat-container">
                        <div id="chat-display"></div>
                        <textarea id="chat-input" placeholder="Type your message..." disabled></textarea>
                        <button id="chat-send-button" disabled>Send</button>
                    </div>
                </div>
                <div id="tab-poker" class="tab-content hidden">
                    <div class="chat-controls">
                        <button class="chat-toggle-button connect-button">Connect</button>
                        <div class="chat-status status-disconnected">Status: Disconnected</div>
                    </div>
                    <hr style="border-color: #555; margin-bottom: 15px;">
                    <div id="poker-auto-controls">
                        <div class="poker-controls">
                            <button id="get-logs-button">Request Update</button>
                            <button id="reset-button">Start Game</button>
                        </div>
                    </div>
                    <div id="poker-results"></div>
                </div>
            </div>
            <div class="resizer"></div>
        `;
        document.body.appendChild(myWindow);

        const settingsButton = myWindow.querySelector('.menu-button[data-tab="settings"]');
        const channelInput = document.getElementById('channel-input');
        const saveStatus = document.getElementById('save-status');
        const userNameSpan = document.getElementById('user-name');
        const usernameInput = document.getElementById('username-input');
        const passwordInput = document.getElementById('password-input');
        const loginButton = document.getElementById('login-button');
        const registerButton = document.getElementById('register-button');
        const logoutButton = document.getElementById('logout-button');
        const saveConnectionButton = document.getElementById('save-connection-button');
        const authFormSection = document.getElementById('auth-form-section');
        const userInfoSection = document.getElementById('user-info-section');
        const chatStatusDisplays = myWindow.querySelectorAll('.chat-status');
        const chatToggleButtons = myWindow.querySelectorAll('.chat-toggle-button');
        const chatDisplay = document.getElementById('chat-display');
        const chatInput = document.getElementById('chat-input');
        const chatSendButton = document.getElementById('chat-send-button');
        const requestUpdateButton = document.getElementById('get-logs-button');
        const autoResetButton = document.getElementById('reset-button');
        const pokerResultsDiv = document.getElementById('poker-results');
        const toggleButton = document.getElementById('toggle-button');
        const header = myWindow.querySelector('.window-header');
        const resizer = myWindow.querySelector('.resizer');
        const menuButtons = myWindow.querySelectorAll('.menu-button');
        const tabContents = myWindow.querySelectorAll('.tab-content');

        let currentUser = { name: 'Unknown', id: null };

        function displayUserInfo(name, id) {
            userNameSpan.textContent = name;
            currentUser = { name, id };
            settingsButton.classList.remove('warning');
            authFormSection.style.display = 'none';
            userInfoSection.style.display = 'block';
        }

        function clearUserInfo() {
            userNameSpan.textContent = 'Unknown';
            currentUser = { name: 'Unknown', id: null };
            settingsButton.classList.add('warning');
            authFormSection.style.display = 'block';
            userInfoSection.style.display = 'none';
        }

        uiElements.updateChatUI = function(status) {
            chatToggleButtons.forEach(button => {
                button.classList.remove('connect-button', 'disconnect-button');
                switch (status) {
                    case 'connected': button.textContent = 'Disconnect'; button.classList.add('disconnect-button'); button.disabled = false; break;
                    case 'connecting': button.textContent = 'Connecting...'; button.disabled = true; break;
                    default: button.textContent = 'Connect'; button.classList.add('connect-button'); button.disabled = false; break;
                }
            });
            chatStatusDisplays.forEach(display => {
                switch (status) {
                    case 'connected': display.textContent = 'Status: Connected'; display.className = 'chat-status status-connected'; break;
                    case 'connecting': display.textContent = 'Status: Connecting...'; display.className = 'chat-status status-connecting'; break;
                    default: display.textContent = 'Status: Disconnected'; display.className = 'chat-status status-disconnected'; break;
                }
            });
            const isConnected = (status === 'connected');
            chatInput.disabled = !isConnected;
            chatSendButton.disabled = !isConnected;
        };

        async function loadData() {
            const authToken = await GM_getValue('authToken');
            const username = await GM_getValue('username');
            const userId = await GM_getValue('userId');
            const chatChannel = await GM_getValue('chatChannel');

            if (authToken && username) {
                displayUserInfo(username, userId);
            } else {
                clearUserInfo();
            }
            channelInput.value = chatChannel || 'general';
            broadcastStatus(currentStatus);
        }

        async function handleAuth(endpoint) {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                saveStatus.textContent = 'All fields are required.';
                saveStatus.className = 'error';
                setTimeout(() => { saveStatus.textContent = ''; saveStatus.className = ''; }, 3000);
                return;
            }
            saveStatus.textContent = 'Processing...';
            saveStatus.className = '';

            try {
                const data = await performAuthRequest(endpoint, username, password);

                if (data.error) {
                    saveStatus.textContent = `Error: ${data.error}`;
                    saveStatus.className = 'error';
                    clearUserInfo();
                } else if (data.token) {
                    const userData = { id: data.id || 'N/A', name: username };
                    saveStatus.textContent = `Success! Welcome, ${userData.name}.`;
                    saveStatus.className = '';
                    await GM_setValue('authToken', data.token);
                    await GM_setValue('username', userData.name);
                    await GM_setValue('userId', userData.id);
                    displayUserInfo(userData.name, userData.id);
                }
            } catch (error) {
                saveStatus.textContent = 'An error occurred during auth.';
                saveStatus.className = 'error';
                console.error(error);
            }
            setTimeout(() => { saveStatus.textContent = ''; saveStatus.className = ''; }, 3000);
        }

        async function handleLogout() {
            await GM_deleteValue('authToken');
            await GM_deleteValue('username');
            await GM_deleteValue('userId');
            clearUserInfo();
            disconnectWebSocket();
            saveStatus.textContent = 'You have been logged out.';
            setTimeout(() => { saveStatus.textContent = ''; }, 3000);
        }

        uiElements.addMessageToChat = function(user, message) {
            if (!user || !message) { return; }
            const messageElement = document.createElement('p');
            if (user === currentUser.name) {
                messageElement.classList.add('self-message');
                messageElement.innerHTML = message;
            } else {
                messageElement.innerHTML = `<strong>${user}:</strong> ${message}`;
            }
            chatDisplay.appendChild(messageElement);
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        };

        function sendMessage() {
            const messageText = chatInput.value.trim();
            if (messageText) {
                sendMessageToSocket("SEND_MESSAGE", { type: "chat.message", message: messageText });
                chatInput.value = '';
            }
        }

        uiElements.render_active_game = function(activeGame) {
            if (!activeGame) {
                pokerResultsDiv.innerHTML = '<p style="color: #ffc107;">No active game found.</p>';
                autoResetButton.textContent = 'Start Game';
                requestUpdateButton.style.display = 'none';
                return;
            }

            requestUpdateButton.style.display = 'inline-block';
            autoResetButton.textContent = 'End Game';

            const hasPlayers = Array.isArray(activeGame.related_players) && activeGame.related_players.length > 0;
            const hasTableCards = Array.isArray(activeGame.related_table) && activeGame.related_table.length > 0;
            const hasEquity = activeGame.get_equity && typeof activeGame.get_equity === 'object';
            const hasPredictions = activeGame.get_prediction && typeof activeGame.get_prediction === 'object';

            if (!hasPlayers && !hasTableCards) {
                pokerResultsDiv.innerHTML = `<p style="color: #4caf50;">Active game is present</p>`;
                return;
            }

            let html = '<div>';

            if (hasTableCards) {
                html += '<h4 style="margin-top: 15px;">Table Cards:</h4>';
                const tableCards = activeGame.related_table.map(tableCard =>
                                                                tableCard.card.__str__
                                                               ).join(' | ');
                html += `<p>${tableCards}</p><br/><hr style="border-color: #555;"><br/>`;
            }

            if (hasPlayers) {
                const shouldShowDifference = activeGame.related_players.length > 1;

                activeGame.related_players.forEach(playerData => {
                    const playerName = playerData.player.name;
                    const hand = playerData.related_hand.map(handCard =>
                                                             handCard.card.__str__
                                                            ).join(', ');

                    html += `<div class="player-info">`;
                    html += `<p><strong>${playerName}:</strong> ${hand}</p>`;

                    if (hasEquity && activeGame.get_equity[playerName] !== undefined) {
                        const equity = (activeGame.get_equity[playerName] * 100).toFixed(2);
                        html += `<p><strong>Equity:</strong> ${equity}%</p>`;
                    }

                    if (hasPredictions && activeGame.get_prediction[playerName]) {
                        const predictionValue = activeGame.get_prediction[playerName];
                        const sortedPredictions = Object.entries(predictionValue)
                        .filter(([_, data]) => data.informed_chance > 0)
                        .sort(([, a], [, b]) => b.informed_chance - a.informed_chance);

                        if (sortedPredictions.length > 0) {
                            html += `<details class="prediction-details"><summary>Show Predictions</summary><ul>`;
                            sortedPredictions.forEach(([handName, data]) => {
                                const chance = data.informed_chance.toFixed(2);
                                let diffHtml = '';

                                if (shouldShowDifference) {
                                    const difference = data.difference;
                                    if (Math.abs(difference) > 0.001) {
                                        const formattedDiff = difference.toFixed(2);
                                        const sign = difference > 0 ? '+' : '';
                                        const color = difference > 0 ? '#4CAF50' : '#f44336';
                                        diffHtml = ` <span style="font-size: 11px; color: ${color};">(${sign}${formattedDiff}%)</span>`;
                                    }
                                }
                                html += `<li>${handName}: ${chance}%${diffHtml}</li>`;
                            });
                            html += `</ul></details>`;
                        }
                    }
                    html += `</div><hr style="border-color: #444; margin: 10px 0;">`;
                });

                if (html.endsWith('<hr style="border-color: #444; margin: 10px 0;">')) {
                    html = html.slice(0, -50);
                }
            }
            html += '</div>';
            pokerResultsDiv.innerHTML = html;
        };

        function handleGameAction(button) {
            const action = button.textContent === 'Start Game' ? 'START_GAME' : 'END_GAME';
            const payload = { type: action.toLowerCase().replace('_', '.') };
            if (action === 'START_GAME') {
                payload.total_players = get_active_players();
            }
            sendMessageToSocket(action, payload);
        }

        uiElements.send_hand = function() {
            const hand = get_hand();
            const table = get_table();
            if (hand.length === 0 && table.length === 0) { return; }
            sendMessageToSocket('RECEIVE_HANDS', {type: 'receive_hands', hand: hand, table: table, active_players: get_active_players()});
        };

        function get_hand() {
            const cards = document.querySelectorAll('.playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ .front___osz1p > div');
            if (cards.length === 0) { return []; }
            return Array.from(cards).map(card => eval_card(card.className)).filter(card => card !== null);
        }

        function get_table() {
            const cards = document.querySelectorAll('.communityCards___cGHD3 .front___osz1p > div');
            if (cards.length === 0) { return []; }
            return Array.from(cards).map(card => eval_card(card.className)).filter(card => card !== null);
        }

        function eval_card(card){
            const regex = /(clubs|spades|hearts|diamonds)-([0-9TJQKA]+)/;
            const match = card.match(regex);
            if (!match) return null;
            const suits = { clubs: 4, spades: 1, hearts: 3, diamonds: 2 };
            const ranks = { '2':0, '3':1, '4':2, '5':3, '6':4, '7':5, '8':6, '9':7, '10':8, 'J':9, 'Q':10, 'K':11, 'A':12 };
            const suit = suits[match[1]];
            const rank = ranks[match[2]];
            return (rank * 4) + suit;
        }

        function get_active_players() {
            let players = document.querySelectorAll('[class*="opponent___"]');
            if (players.length === 0) players = document.querySelectorAll('[id*="player-"]');

            let activePlayers = 0;
            if (players.length > 0) {
                players.forEach(player => {
                    const playerText = player.textContent ? player.textContent.toLowerCase() : '';
                    const isInactive = playerText.includes('sitting out') || playerText.includes('waiting') || playerText.includes('folded');
                    if (!isInactive) activePlayers++;
                });
            }
            return Math.max(activePlayers + 1, 2);
        }
        loginButton.addEventListener('click', () => handleAuth('login'));
        registerButton.addEventListener('click', () => handleAuth('register'));
        logoutButton.addEventListener('click', handleLogout);
        saveConnectionButton.addEventListener('click', async () => {
            await GM_setValue('chatChannel', channelInput.value.trim() || 'general');
            saveStatus.textContent = 'Connection settings saved.';
            setTimeout(() => { saveStatus.textContent = ''; }, 3000);
        });

        chatSendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } });
        chatToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentState = button.textContent.toLowerCase();
                if (currentState === 'connect') connectWebSocket();
                else if (currentState === 'disconnect') disconnectWebSocket();
            });
        });

        autoResetButton.addEventListener('click', () => handleGameAction(autoResetButton));
        requestUpdateButton.addEventListener('click', () => sendMessageToSocket('PROPAGATE_UPDATE_HANDS', {type: 'update_hands'}));

        menuButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = `tab-${button.dataset.tab}`;
                menuButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(tab => tab.classList.add('hidden'));
                myWindow.querySelector(`#${targetTabId}`).classList.remove('hidden');
            });
        });

        toggleButton.addEventListener('click', () => {
            const menu = myWindow.querySelector('.window-menu');
            const content = myWindow.querySelector('.window-content');
            menu.classList.toggle('hidden');
            content.classList.toggle('hidden');
            const isHidden = content.classList.contains('hidden');
            toggleButton.textContent = isHidden ? '+' : '-';
            if (isHidden) myWindow.style.height = 'auto';
        });

        let isDragging = false, dragOffsetX, dragOffsetY;

        function dragStart(e) {
            if (e.target.id === 'toggle-button') return;
            isDragging = true;

            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;

            dragOffsetX = clientX - myWindow.getBoundingClientRect().left;
            dragOffsetY = clientY - myWindow.getBoundingClientRect().top;

            if (e.type === 'touchstart') {
                e.preventDefault();
            }
        }

        function dragMove(e) {
            if (!isDragging) return;

            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;

            myWindow.style.right = 'auto';
            myWindow.style.bottom = 'auto';
            myWindow.style.left = `${clientX - dragOffsetX}px`;
            myWindow.style.top = `${clientY - dragOffsetY}px`;
        }

        function dragEnd() {
            isDragging = false;
        }

        // Mouse events
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        // Touch events for mobile
        header.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', dragMove);
        document.addEventListener('touchend', dragEnd);

        resizer.addEventListener('mousedown', function (e) {
            e.preventDefault(); const startX = e.clientX; const startY = e.clientY;
            const startWidth = myWindow.offsetWidth; const startHeight = myWindow.offsetHeight;
            function doResize(e) { myWindow.style.width = `${startWidth + e.clientX - startX}px`; myWindow.style.height = `${startHeight + e.clientY - startY}px`; }
            function stopResize() { document.documentElement.removeEventListener('mousemove', doResize, false); document.documentElement.removeEventListener('mouseup', stopResize, false); }
            document.documentElement.addEventListener('mousemove', doResize, false);
            document.documentElement.addEventListener('mouseup', stopResize, false);
        });

        loadData();
        menuButtons[2].click();
    }

    createHelperWindow();

})();
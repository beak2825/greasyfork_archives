// ==UserScript==
// @name         Torn Poker Join/Leave Monitor
// @namespace    torn.poker.monitor
// @version      2.0.29
// @description  Monitor poker table join/leave events
// @author       Flav
// @license      MIT
// @match        https://www.torn.com/page.php?sid=holdem
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        window.focus
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/562749/Torn%20Poker%20JoinLeave%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/562749/Torn%20Poker%20JoinLeave%20Monitor.meta.js
// ==/UserScript==


function runWhenJQueryReady(fn) {
    if (typeof jQuery !== 'undefined') {
        fn(unsafeWindow, jQuery);
    } else {
        setTimeout(() => runWhenJQueryReady(fn), 50);
    }
}

runWhenJQueryReady(function (unsafeWindow, $) {

    let lastIncomingMessage = null;
    let lastIncomingTime = 0;
    let FL_API_KEY = GM_getValue("FL_API_KEY", "");
    let FL_MAX_BS = parseInt(GM_getValue("FL_MAX_BS", 0));
    let FL_MIN_MUG_AMOUNT = parseInt(GM_getValue("FL_MIN_MUG_AMOUNT", 0));
    const USER_LIST = new Map();
    const PRELOADED_TABS = new Map();

    const BSP_KEY = 'tdup.battleStatsPredictor.cache.prediction.';
    let monitorStarted = false;
    const BASE_MIN_PERCENTAGE = 0.05; // 5%
    const BASE_MAX_PERCENTAGE = 0.10; // 10%


    class User {
        /**
         * @param {number} userId
         * @param {string} username
         * @param {number} bs
         * @param {string} faction
         * @param {number} potAmount
         * @param {string} formattedBs
         * @param {string} mugText
         */
        constructor(userId, username, bs, faction, potAmount, formattedBs, mugText) {
            this.userId = userId;
            this.username = username;
            this.bs = bs;
            this.faction = faction;
            this.potAmount = potAmount;
            this.formattedBs = formattedBs;
            this.mugText = mugText;
        }
    }

    function getBsFromStorage(userId) {
        const bspStats = window.localStorage.getItem(BSP_KEY + userId);
        if (bspStats) {

            return JSON.parse(bspStats).TBS;

        }

        return 0;
    }

    /* Data fetches */
    async function fetchBspData(userId) {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://www.lol-manager.com/api/battlestats/${FL_API_KEY}/${userId}/9.0.2`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.Result && data.Result > 0) {
                            window.localStorage.setItem(BSP_KEY + userId, response.responseText);
                        }
                        resolve();
                    } catch (error) {
                        console.error('Error parsing bs data:', error);
                        reject(error);
                    }
                },
                onerror: function (error) {
                    console.error('Error fetching bs data:', error);
                    reject(error);
                }
            });
        });
    }

    async function fetchUserData(userId) {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/user/${userId}?selections=profile&key=${FL_API_KEY}`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status && data.status.state) {
                            //console.log(data);
                            resolve({
                                ...data,
                                username: data.name, // Fetch the username
                                healthStatus: data.status.state,
                                Age: data.age, // Fetch the age,
                                faction: data.faction ?
                                    (data.faction.faction_tag === null || data.faction.faction_tag === "" ? "N/A" : data.faction.faction_tag)
                                    : "N/A"
                            });
                        } else {
                            resolve({
                                ...data,
                                username: data.name, // Fetch the username
                                healthStatus: 'Error: Status unavailable or missing',
                                Age: data.age
                            });
                        }
                    } catch (error) {
                        console.error('Error parsing user data:', error);
                        reject(error);
                    }
                },
                onerror: function (error) {
                    console.error('Error fetching user data:', error);
                    reject(error);
                }
            });
        });
    }
    /* Data fetches */

    function formatCompactNumber(number) {
        if (number < 1000) {
            return number;
        } else if (number >= 1000 && number < 1_000_000) {
            return (number / 1000).toFixed(1) + "K";
        } else if (number >= 1_000_000 && number < 1_000_000_000) {
            return (number / 1_000_000).toFixed(1) + "M";
        } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
            return (number / 1_000_000_000).toFixed(1) + "B";
        } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000_000_000) {
            return (number / 1_000_000_000_000).toFixed(1) + "T";
        }
    }

    function calculateMugRange(potAmount) {
        if (!potAmount) {
            return [0, 0];
        }
        const actualBetAmount = potAmount;
        const baseMinMugAmount = actualBetAmount * BASE_MIN_PERCENTAGE;
        const baseMaxMugAmount = actualBetAmount * BASE_MAX_PERCENTAGE;

        const minMugAmount = Math.floor(baseMinMugAmount);
        const maxMugAmount = Math.floor(baseMaxMugAmount);

        return [minMugAmount, maxMugAmount];
    }

    function unSetUser(userId) {
        removeUserFromList(userId);
        USER_LIST.delete(userId);
    }

    function removeUserFromList(userId) {
        const userItem = document.getElementById(`poker-user-${userId}`);
        if (userItem) {
            userItem.remove();
        }

        // Clean up preloaded tab reference
        PRELOADED_TABS.delete(userId);

        const noUsers = document.getElementById('poker-no-users');
        if (USER_LIST.size === 0 && noUsers) {
            noUsers.style.display = 'block';
        }
    }

    function addUserToList(userId, user) {
        const container = document.getElementById('poker-user-list');
        const noUsers = document.getElementById('poker-no-users');

        if (!container) return;

        // Hide "no users" message
        if (noUsers) noUsers.style.display = 'none';

        // Check if user already exists
        if (document.getElementById(`poker-user-${userId}`)) {
            return; // Already exists, don't add again
        }

        // Create new user item
        const userItem = document.createElement('div');
        userItem.className = 'poker-user-item';
        userItem.id = `poker-user-${userId}`;
        userItem.innerHTML = `
            <input type="checkbox" id="poker-check-${userId}" class="poker-checkbox" />
            <span class="poker-faction">[${user.faction}]</span>
            <span class="poker-faction">[${user.formattedBs}]</span>
            <a title="${user.username}" href="https://www.torn.com/profiles.php?XID=${userId}" target="_blank" class="poker-username">${user.username}</a>
            <span class="poker-mugtext" id="poker-mugtext-${userId}">${user.mugText}</span>
            <button type="button" id="poker-pre-${userId}" class="poker-btn-small torn-btn btn___RxE8_ silver">Pre</button>
            <button type="button" id="poker-go-${userId}" class="poker-btn-small torn-btn btn___RxE8_ silver" style="display: none;">Go</button>
        `;

        container.appendChild(userItem);

        // Add event listeners
        const preBtn = document.getElementById(`poker-pre-${userId}`);
        const goBtn = document.getElementById(`poker-go-${userId}`);

        preBtn.addEventListener('click', () => {
            if (PRELOADED_TABS.has(userId) && !PRELOADED_TABS.get(userId).closed) return;
            const attackUrl = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
            const tab = window.open(attackUrl, '_blank');
            if (tab) {
                PRELOADED_TABS.set(userId, tab);
                tab.blur();
                setTimeout(() => window.focus(), 100);
                goBtn.style.display = 'inline-block';
            }
        });

        goBtn.addEventListener('click', () => {
            const tab = PRELOADED_TABS.get(userId);
            if (tab && !tab.closed) {
                tab.focus();
                PRELOADED_TABS.delete(userId);
                goBtn.style.display = 'none';
            }
        });
    }

    function updateUserMugText(userId, mugText) {
        const mugTextElement = document.getElementById(`poker-mugtext-${userId}`);
        if (mugTextElement) {
            mugTextElement.textContent = mugText;
        }
    }

    function updateUser(userId, potAmount) {
        let user = USER_LIST.get(userId);
        if (user) {
            user.potAmount = potAmount;
            const [minMug, maxMug] = calculateMugRange(potAmount);
            user.mugText = `$${formatCompactNumber(minMug)} - $${formatCompactNumber(maxMug)}`;
            updateUserMugText(userId, user.mugText);
        }
    }

    async function getPlayerBS(userId) {
        let bspStats = window.localStorage.getItem(BSP_KEY + userId);
        if (!bspStats) {
            await fetchBspData(userId);

            bspStats = window.localStorage.getItem(BSP_KEY + userId);
            bspStats = JSON.parse(bspStats).TBS;

        }
        else {
            bspStats = JSON.parse(bspStats).TBS;
        }
        return bspStats;
    }


    async function addUser(userId, potAmount, isUpdate = false) {
        if (!isUpdate && userId && !USER_LIST.has(userId)) {
            try {
                const userData = await fetchUserData(userId);
                const tbs = Number(await getPlayerBS(userId));
                if (tbs > FL_MAX_BS) {
                    return;
                }
                const formattedBs = formatCompactNumber(tbs);
                const [minMug, maxMug] = calculateMugRange(potAmount);
                const mugText = `$${formatCompactNumber(minMug)} - $${formatCompactNumber(maxMug)}`;
                const faction = userData.faction || '';
                const updatedUser = new User(userId, userData.username, tbs, faction, potAmount, formattedBs, mugText);
                USER_LIST.set(userId, updatedUser);
                addUserToList(userId, updatedUser);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else if (USER_LIST.has(userId)) {
            if (potAmount !== "N/A") {
                updateUser(userId, potAmount);
            }
        }
    }

    function getPlayerFromTable(playerElement) {
        const firstChild = $(playerElement).children()[0];
        const userId = $(firstChild).attr("id").split("-")[1];
        const username = $(firstChild).find('.username-selector').text() || '';
        let playerPot = $(playerElement).find('div[class*=potString___]').html();
        if (playerPot) {
            playerPot = parseInt(playerPot.replace("$", "").replaceAll(",", ""));
            return {
                userId,
                username,
                playerPot
            };
        }
        return {
            userId,
            username,
            playerPot: 0
        };
    }

    async function waitForPlayersToLoad(timeout = 10000) {
        const interval = 50;
        let waited = 0;
        while (waited < timeout) {
            const players = $('div[class*=playerPositioner___]');
            if (players.length > 0) {
                return players;
            }
            await new Promise(res => setTimeout(res, interval));
            waited += interval;
        }
        return $('div[class*=playerPositioner___]'); // Return whatever is there after timeout
    }

    async function getPlayersFromTable() {
        const players = await waitForPlayersToLoad();
        if (players.length > 0) {
            for (let i = 0; i < players.length; i++) {
                const playerDetails = getPlayerFromTable(players[i]);
                await addUser(playerDetails.userId, playerDetails.playerPot);
            }
        }
    }

    // Functions to handle join/leave events
    function joinedTheTable(userId) {
        // Empty for now
        let playerPot = $("#player-" + userId).find(".potString___pM1js").html();
        if (playerPot) {
            playerPot = parseInt(playerPot.replace("$", "").replaceAll(",", ""));
        } else {
            playerPot = 0;
        }
        addUser(userId, playerPot);
    }

    function leftTheTable(userId) {
        const user = USER_LIST.get(userId);
        if (user) {
            const checkbox = document.getElementById(`poker-check-${userId}`);
            const isIgnored = checkbox && checkbox.checked;

            if (!isIgnored && user.potAmount >= FL_MIN_MUG_AMOUNT) {
                try {
                    const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1230-pretty-good.ogg');
                    audio.play();
                } catch (e) {
                    console.log("Couldn't play audio");
                }

                const goBtn = document.getElementById(`poker-go-${userId}`);

                if (goBtn && goBtn.style.display !== 'none') {
                    // Go button is visible - focus it and play sound
                    goBtn.focus();

                } else {
                    // Go button is hidden - open and focus new tab
                    const attackUrl = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
                    const newTab = window.open(attackUrl, '_blank');
                    if (newTab) newTab.focus();
                }


                const mugText = `BS: ${user.formattedBs} - ${user.mugText}`;

                GM_notification({
                    text: mugText,
                    title: "POKER Mug",
                    image: "",
                    silent: false,
                    timeout: 60 * 1000,
                    highlight: false,
                    onclick: function () {
                        window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`);
                    }
                });

            }

            // Highlight the user row to show it will be removed
            const userRow = document.getElementById(`poker-user-${userId}`);
            if (userRow) {
                userRow.classList.add('poker-user-leaving');
            }

            setTimeout(() => {
                unSetUser(userId);
            }, 30000); // Delay to ensure data is up-to-date
        }
    }

    // Override the native WebSocket constructor
    function setupListener() {
        const originalWebSocket = unsafeWindow.WebSocket;

        unsafeWindow.WebSocket = function (url, protocols) {
            const socket = new originalWebSocket(url, protocols);
            // Only monitor Torn's WebSocket server
            if (url.includes('ws-centrifugo.torn.com')) {
                // Intercept incoming messages - wrap onmessage handler
                let originalOnMessageHandler = null;
                Object.defineProperty(socket, 'onmessage', {
                    set: function (handler) {
                        originalOnMessageHandler = handler;
                        // Create a wrapped handler that logs before calling the original
                        const wrappedHandler = function (event) {
                            logIncomingMessage(event.data);
                            if (originalOnMessageHandler) {
                                return originalOnMessageHandler.call(this, event);
                            }
                        };
                        // Set the wrapped handler on the original socket
                        originalWebSocket.prototype.__lookupSetter__('onmessage').call(socket, wrappedHandler);
                    },
                    get: function () {
                        return originalOnMessageHandler;
                    },
                    configurable: true
                });

                // Also add a direct listener to catch all messages
                originalWebSocket.prototype.addEventListener.call(socket, 'message', function (event) {
                    logIncomingMessage(event.data);
                });
            }

            return socket;
        };

        // Copy static properties
        Object.setPrototypeOf(unsafeWindow.WebSocket, originalWebSocket);
        Object.defineProperty(unsafeWindow.WebSocket, 'prototype', {
            value: originalWebSocket.prototype,
            writable: false
        });
    }

    function inspectPlayers(mutationRecord) {
        const players = $('div[class*=playerPositioner___]');
        if (players.length > 0) {
            players.each(function () {
                const playerDetails = getPlayerFromTable(this);
                addUser(playerDetails.userId, playerDetails.playerPot, true);
            });
        }
    }

    // Start function - initializes the monitor
    async function waitForSidebar(timeout = 10000) {
        const interval = 50;
        let waited = 0;
        while (waited < timeout) {
            const sidebar = $('.sidebar');
            if (sidebar.length > 0) {
                return sidebar;
            }
            await new Promise(res => setTimeout(res, interval));
            waited += interval;
        }
        return $('.sidebar'); // Return whatever is there after timeout
    }

    async function start() {
        setupListener();
        await getPlayersFromTable();

        const gameWrapper = await waitForSidebar();

        if (gameWrapper.length > 0) {
            observer = new MutationObserver(inspectPlayers);

            gameWrapper.each(function () {
                observer.observe(gameWrapper[0], {
                    childList: true,
                    subtree: true
                });
            });
        }
    }

    // Deduplicate incoming messages and filter for join/leave events
    function logIncomingMessage(data) {

        // Parse and filter for specific messages
        try {
            const parsed = JSON.parse(data);

            // Check if this is a push message with chat event
            if (parsed.push &&
                parsed.push.pub &&
                parsed.push.pub.data &&
                parsed.push.pub.data.message &&
                parsed.push.pub.data.message.eventType === "chat") {

                const chatData = parsed.push.pub.data.message.data;
                const channel = parsed.push.channel;

                // Check for "joined the table" message
                if (chatData.message === "joined the table") {
                    joinedTheTable(chatData.userID.toString());
                }
                // Check for "left the table" message
                else if (chatData.message === "left the table") {
                    leftTheTable(chatData.userID.toString());
                }
                else {
                    //console.log(JSON.stringify(chatData));
                }
            }
        } catch (e) {
            // Not JSON or not the format we're looking for, ignore
        }
    }

    // Create the draggable dialog
    function createDialog() {
        // Create main dialog HTML
        const dialogHTML = `
        <div id="poker-monitor-dialog" class="poker-dialog">
            <div class="poker-dialog-header">
                <span>🎰 Poker Monitor</span>
                <div class="poker-dialog-buttons">
                    <button id="poker-settings-btn" class="poker-btn" title="Settings">⚙️</button>
                </div>
            </div>
            <div class="poker-dialog-content">
                <p id="poker-no-users" style="display: block;">No users being tracked.</p>
                <div id="poker-user-list"></div>
            </div>
        </div>
    `;

        // Create settings dialog HTML
        const settingsHTML = `
        <div id="poker-settings-dialog" class="poker-settings-dialog" style="display: none;">
            <div class="poker-dialog-header">
                <span>⚙️ Settings</span>
            </div>
            <div class="poker-dialog-content">
                <div class="poker-setting-row">
                    <label for="poker-api-key">API Key:</label>
                    <input type="text" id="poker-api-key" placeholder="Enter your Torn API key" value="${FL_API_KEY}">
                </div>
                <div class="poker-setting-row">
                    <label for="poker-max-bs">Max BS:</label>
                    <input type="number" id="poker-max-bs" placeholder="Maximum BS value" value="${FL_MAX_BS}">
                </div>
                <div class="poker-setting-row">
                    <label for="poker-min-mug">Min Mug Amount:</label>
                    <input type="number" id="poker-min-mug" placeholder="Minimum mug amount" value="${FL_MIN_MUG_AMOUNT}">
                </div>
                <div class="poker-setting-row">
                    <button id="poker-save-settings" class="poker-btn poker-save-btn">💾 Save Settings</button>
                </div>
            </div>
        </div>
    `;

        // Add to page
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        document.body.insertAdjacentHTML('beforeend', settingsHTML);

        // Make dialogs draggable
        makeDraggable(document.getElementById('poker-monitor-dialog'));
        makeDraggable(document.getElementById('poker-settings-dialog'));

        // Event listeners
        document.getElementById('poker-settings-btn').addEventListener('click', () => {
            document.getElementById('poker-settings-dialog').style.display = 'block';
        });

        document.getElementById('poker-save-settings').addEventListener('click', () => {
            // Get values from inputs
            const apiKey = document.getElementById('poker-api-key').value.trim();
            const maxBS = document.getElementById('poker-max-bs').value;
            const minMug = document.getElementById('poker-min-mug').value;

            // Validate that no values are default
            if (apiKey === "" || parseInt(maxBS) === 0 || parseInt(minMug) === 0) {
                const saveBtn = document.getElementById('poker-save-settings');
                const originalText = saveBtn.textContent;
                saveBtn.textContent = '❌ Please fill all fields!';
                saveBtn.style.background = '#f44336';

                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.background = '';
                }, 2000);
                return;
            }

            // Save to GM storage
            GM_setValue('FL_API_KEY', apiKey);
            GM_setValue('FL_MAX_BS', maxBS);
            GM_setValue('FL_MIN_MUG_AMOUNT', minMug);

            // Update local variables
            FL_API_KEY = apiKey;
            FL_MAX_BS = parseInt(maxBS);
            FL_MIN_MUG_AMOUNT = parseInt(minMug);

            // Close dialog immediately
            document.getElementById('poker-settings-dialog').style.display = 'none';

            // Start the monitor if it hasn't been started yet
            if (!monitorStarted) {
                start();
                monitorStarted = true;
            }
        });
    }

    // Make element draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.poker-dialog-header');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            header.style.cursor = 'grabbing';
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            header.style.cursor = 'move';
        }
    }

    // Initialize dialog when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDialog);
    } else {
        createDialog();
    }

    // Check if settings are configured, if not show settings dialog
    if (FL_API_KEY === "" || FL_MAX_BS === 0 || FL_MIN_MUG_AMOUNT === 0) {
        // Wait for dialog to be created, then show settings
        setTimeout(() => {
            const settingsDialog = document.getElementById('poker-settings-dialog');
            if (settingsDialog) {
                settingsDialog.style.display = 'block';
            }
        }, 100);
    } else {
        // Settings are configured, start the monitor
        start();
        monitorStarted = true;
    }

    // Add CSS styling
    GM_addStyle(`
    .poker-dialog {
        position: fixed;
        top: 100px;
        right: 20px;
        width: 450px;
        background: #2a2a2a;
        border: 2px solid #444;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        z-index: 999999;
        font-family: Arial, sans-serif;
        color: #fff;
    }

    .poker-settings-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background: #2a2a2a;
        border: 2px solid #444;
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0,0,0,0.7);
        z-index: 9999999;
        font-family: Arial, sans-serif;
        color: #fff;
    }

    .poker-dialog-header {
        background: #1a1a1a;
        padding: 10px 15px;
        border-bottom: 1px solid #444;
        border-radius: 6px 6px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
    }

    .poker-dialog-header span {
        font-weight: bold;
        font-size: 14px;
    }

    .poker-dialog-buttons {
        display: flex;
        gap: 5px;
    }

    .poker-btn {
        background: #444;
        border: 1px solid #666;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
    }

    .poker-btn:hover {
        background: #555;
    }

    .poker-dialog-content {
        font-size: 12px;
    }

    .poker-setting-row {
        margin-bottom: 15px;
    }

    .poker-setting-row label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #aaa;
    }

    .poker-setting-row input {
        width: 100%;
        padding: 8px;
        background: #1a1a1a;
        border: 1px solid #444;
        border-radius: 4px;
        color: #fff;
        font-size: 13px;
        box-sizing: border-box;
    }

    .poker-setting-row input:focus {
        outline: none;
        border-color: #666;
    }

    .poker-save-btn {
        width: 100%;
        padding: 10px;
        background: #2196f3;
        font-weight: bold;
        font-size: 14px;
    }

    .poker-save-btn:hover {
        background: #1976d2;
    }

    #poker-user-list {
        display: flex;
        flex-direction: column;
    }

    .poker-user-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #1a1a1a;
        border-radius: 4px;
        border: 1px solid #333;
    }

    .poker-checkbox {
        width: 16px;
        height: 16px;
        cursor: pointer;
    }

    .poker-faction {
        color: #888;
        font-size: 11px;
        min-width: 45px;
    }

    .poker-username {
        color: #4a9eff;
        text-decoration: none;
        font-weight: bold;
        flex: 1 1 auto;
        min-width: 80px;
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .poker-username:hover {
        text-decoration: underline;
    }

    .poker-mugtext {
        color: #4caf50;
        font-size: 12px;
        min-width: 100px;
        text-align: right;
    }

    .poker-btn-small {
        background: #444;
        border: 1px solid #666;
        color: #fff;
        padding: 4px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        transition: background 0.2s;
    }

    .poker-btn-small:hover {
        background: #555;
    }

    #poker-no-users {
        color: #888;
        font-style: italic;
    }

    .poker-user-leaving {
        background: #3a1a1a !important;
        border-color: #ff4444 !important;
        animation: pulse-red 2s ease-in-out infinite;
    }

    @keyframes pulse-red {
        0%, 100% {
            background: #3a1a1a;
            border-color: #ff4444;
        }
        50% {
            background: #4a2020;
            border-color: #ff6666;
        }
    }
`);

});

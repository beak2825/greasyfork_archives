// ==UserScript==
// @name         Drawaria Kick Tools (Standalone Script)
// @namespace    drawaria.modded.kick
// @version      1.0.0
// @description  Kick tools for Drawaria.online with a draggable menu. Includes manual and automatic kick/prohibit drawing vote.
// @author       ≺ᴄᴜʙᴇ³≻ and YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/549560/Drawaria%20Kick%20Tools%20%28Standalone%20Script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549560/Drawaria%20Kick%20Tools%20%28Standalone%20Script%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Utilities and QBit Replacements ---

    // === 1. UUID Generator (replaces generate.uuidv4()) ===
    function uuidv4() {
        return crypto.randomUUID();
    }

    // === 2. Notification System (replaces ModBase.notify) ===
    function notify(level, message, moduleName = "Kick Tools") {
        let color = "#6c757d"; // log
        if (level === "error") color = "#dc3545";
        else if (level === "warning") color = "#ffc107";
        else if (level === "info") color = "#17a2b8";
        else if (level === "success") color = "#28a745";

        console.log(`%c${moduleName}: ${message}`, `color: ${color}`);

        // Optional: Display message in game chat if available
        const loggingContainer = document.getElementById("chatbox_messages");
        if (loggingContainer) {
            const chatmessage = document.createElement("div");
            chatmessage.className = `chatmessage systemchatmessage5`;
            chatmessage.dataset.ts = Date.now().toString();
            chatmessage.style.color = color;
            chatmessage.textContent = `${moduleName}: ${message}`;
            loggingContainer.appendChild(chatmessage);
            loggingContainer.scrollTop = loggingContainer.scrollHeight;
        }
    }

    // === 3. domMake Replacements (for building UI) ===
    function createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        for (const attr in attrs) {
            if (attr === "className") {
                el.className = attrs[attr];
            } else {
                el.setAttribute(attr, attrs[attr]);
            }
        }
        children.forEach(child => {
            if (typeof child === "string") {
                el.appendChild(document.createTextNode(child));
            } else if (child) {
                el.appendChild(child);
            }
        });
        return el;
    }

    function createButton(content, className = "btn btn-outline-secondary", attrs = {}) {
        const btn = createElement("button", { className: className, ...attrs });
        if (typeof content === "string") {
            btn.innerHTML = content;
        } else {
            btn.appendChild(content);
        }
        return btn;
    }

    function createRow(children = [], className = "_row", attrs = {}) {
        const row = createElement("div", { className: className, ...attrs });
        children.forEach(child => {
            if (child) row.appendChild(child);
        });
        return row;
    }

    function createIconList(children = [], className = "icon-list", attrs = {}) {
        const list = createElement("div", { className: className, ...attrs });
        children.forEach(child => {
            if (child) list.appendChild(child);
        });
        return list;
    }

    // === 4. _io.emits Replacement (for sending WebSocket commands) ===
    const emits = {
        sendvotekick: function (playerid) {
            let data = ["sendvotekick", playerid];
            return `${42}${JSON.stringify(data)}`;
        },
        pgdrawvote: function (playerid, value) {
            let data = ["pgdrawvote", playerid, value];
            return `${42}${JSON.stringify(data)}`;
        }
    };

    // === 5. Socket Management (replaces globalThis.sockets and BotClientManager._getBot) ===
    const activeSockets = [];
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (activeSockets.indexOf(this) === -1) {
            activeSockets.push(this);
            this.addEventListener('close', () => {
                const pos = activeSockets.indexOf(this);
                if (~pos) activeSockets.splice(pos, 1);
            });
        }
        return originalWebSocketSend.apply(this, args);
    };

    function getPrimarySocket(skipNotification = false) {
        if (activeSockets.length === 0) {
            if (!skipNotification) notify("warning", "No active WebSocket connections to send commands.", "Kick Tools");
            return null;
        }
        // Returns the first active socket, assuming it's the primary or most relevant one
        return activeSockets[0];
    }

    // === 6. Helper functions to drag the menu ===
    function makeDraggable(element, handle = element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const dragMouseDown = (e) => {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        const elementDrag = (e) => {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        };

        const closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        handle.onmousedown = dragMouseDown;
    }

    // --- Adapted PlayerKickTools Class ---
    class PlayerKickTools {
        _containerId = "kick-tools-menu-container";
        _humanKickPlayerListContainer;
        _botKickPlayerListContainer;
        _cachedPlayers = [];

        _isAutoKickActive = false;
        _autoKickInterval = null;
        _kickedPlayersThisSession = new Set();

        _isAutoProhibitDrawingActive = false;
        _autoProhibitDrawingInterval = null;
        _prohibitedPlayersThisSession = new Set();

        constructor() {
            this._createMenu();
            this._onStartup();
        }

        _createMenu() {
            const menuContainer = createElement("div", {
                id: this._containerId,
                className: "cubic-engine-mod-menu",
                style: `
                    position: fixed;
                    top: 10%;
                    left: 10%;
                    width: 300px;
                    background-color: var(--CE-bg_color, #f8f9fa);
                    border: 1px solid var(--CE-color, #ced4da);
                    border-radius: .25rem;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    z-index: 9999;
                    font-family: Arial, sans-serif;
                    color: var(--CE-color, #212529);
                    max-height: 80vh;
                    overflow-y: auto;
                `
            });

            const header = createElement("div", {
                className: "cubic-engine-mod-menu-header",
                style: `
                    padding: 8px;
                    background-color: var(--primary, #007bff);
                    color: white;
                    cursor: grab;
                    border-top-left-radius: .25rem;
                    border-top-right-radius: .25rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `
            }, [createElement("span", {}, ["Kick Tools"]), createButton("X", "btn-close-menu")]);

            header.querySelector(".btn-close-menu").addEventListener("click", () => {
                menuContainer.style.display = "none";
                this._isAutoKickActive = false;
                this._isAutoProhibitDrawingActive = false;
                if (this._autoKickInterval) clearInterval(this._autoKickInterval);
                if (this._autoProhibitDrawingInterval) clearInterval(this._autoProhibitDrawingInterval);
                const autoKickBtn = document.querySelector(`#${this._containerId} .auto-action-toggle:has(.fa-user-minus)`);
                if (autoKickBtn) autoKickBtn.classList.remove("active");
                const autoProhibitBtn = document.querySelector(`#${this._containerId} .auto-action-toggle:has(.fa-user-slash)`);
                if (autoProhibitBtn) autoProhibitBtn.classList.remove("active");
            });

            const content = createElement("div", {
                className: "cubic-engine-mod-menu-content",
                style: `padding: 10px;`
            });

            menuContainer.append(header, content);
            document.body.appendChild(menuContainer);
            makeDraggable(menuContainer, header);

            this.htmlElements = {
                section: content,
                details: menuContainer
            };
        }

        _onStartup() {
            this._loadInterface();
            this._setupObservers();
            notify("info", " 'Kick Tools' Module Loaded.", "Kick Tools");
        }

        _loadInterface() {
            const container = createElement("div");

            // --- Section 1: Vote to Kick (You) ---
            const humanKickSection = createElement("div", { className: "kick-tools-section" });
            humanKickSection.appendChild(createElement("div", { className: "kick-tools-section-title" }, ["Vote to Kick (You)"]));
            this._humanKickPlayerListContainer = createIconList([], "kick-tools-player-list");
            humanKickSection.appendChild(this._humanKickPlayerListContainer);
            container.appendChild(humanKickSection);

            // --- Section 2: Kick with Bot ---
            const botKickSection = createElement("div", { className: "kick-tools-section" });
            botKickSection.appendChild(createElement("div", { className: "kick-tools-section-title" }, ["Kick with Bot"]));
            this._botKickPlayerListContainer = createIconList([], "kick-tools-player-list");
            botKickSection.appendChild(this._botKickPlayerListContainer);
            container.appendChild(botKickSection);

            // --- Section 3: Bot Actions Automation (Combined Section) ---
            const automationSection = createElement("div", { className: "kick-tools-section" });
            automationSection.appendChild(createElement("div", { className: "kick-tools-section-title" }, ["Bot Actions Automation"]));

            // Auto Kick Toggle Button
            const autoKickRow = createRow([]);
            const autoKickButton = createButton('<i class="fas fa-user-minus"></i> Auto Kick');
            autoKickButton.classList.add("auto-action-toggle");
            autoKickButton.addEventListener("click", () => this._toggleAutoKick(autoKickButton));
            autoKickRow.appendChild(autoKickButton);
            automationSection.appendChild(autoKickRow);

            // Auto Prohibit Drawing Toggle Button
            const autoProhibitDrawingRow = createRow([]);
            const autoProhibitDrawingButton = createButton('<i class="fas fa-user-slash"></i> Auto Prohibit Drawing');
            autoProhibitDrawingButton.classList.add("auto-action-toggle");
            autoProhibitDrawingButton.addEventListener("click", () => this._toggleAutoProhibitDrawing(autoProhibitDrawingButton));
            autoProhibitDrawingRow.appendChild(autoProhibitDrawingButton);
            automationSection.appendChild(autoProhibitDrawingRow);

            container.appendChild(automationSection);

            this.htmlElements.section.appendChild(container);
        }

        _setupObservers() {
            const playerListElement = document.getElementById("playerlist");
            if (playerListElement) {
                const observer = new MutationObserver(() => {
                    this._updatePlayerLists();
                    // Execute continuous checks if toggles are active
                    if (this._isAutoKickActive) {
                        this._performAutoKick();
                    }
                    if (this._isAutoProhibitDrawingActive) {
                        this._performAutoProhibitDrawing();
                    }
                });
                observer.observe(playerListElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-playerid', 'style'] });
                this._updatePlayerLists(); // Initial update
            }
        }

        _updatePlayerLists() {
            this._humanKickPlayerListContainer.innerHTML = '';
            this._botKickPlayerListContainer.innerHTML = '';
            this._cachedPlayers = [];

            const playerRows = document.querySelectorAll("#playerlist .playerlist-row");
            const myPlayerIdElement = document.querySelector(".playerlist-name-self")?.parentElement;
            const myPlayerId = myPlayerIdElement ? myPlayerIdElement.dataset.playerid : null;

            if (playerRows.length <= 1) {
                const noPlayersMessage = createElement("span", {}, ["No other players."]);
                this._humanKickPlayerListContainer.appendChild(noPlayersMessage.cloneNode(true));
                this._botKickPlayerListContainer.appendChild(noPlayersMessage.cloneNode(true));
                return;
            }

            playerRows.forEach(playerRow => {
                const playerId = playerRow.dataset.playerid;
                if (playerId === myPlayerId) {
                    return;
                }

                const playerName = playerRow.querySelector(".playerlist-name a")?.textContent || `Player ${playerId}`;
                const isDrawing = playerRow.querySelector(".playerlist-draw")?.style.display !== 'none';

                this._cachedPlayers.push({ id: parseInt(playerId), name: playerName, isDrawing: isDrawing });
            });

            this._renderHumanKickButtons();
            this._renderBotKickButtons();
        }

        _renderHumanKickButtons() {
            this._humanKickPlayerListContainer.innerHTML = '';
            if (this._cachedPlayers.length === 0) {
                this._humanKickPlayerListContainer.appendChild(document.createTextNode("No players."));
                return;
            }

            this._cachedPlayers.forEach(player => {
                const playerButton = createButton(player.name, "btn btn-outline-secondary");
                playerButton.title = `Vote to kick ${player.name} (ID: ${player.id}).`;
                playerButton.addEventListener("click", () => this._sendHumanVoteKick(player.id, player.name));
                this._humanKickPlayerListContainer.appendChild(playerButton);
            });
        }

        _renderBotKickButtons() {
            this._botKickPlayerListContainer.innerHTML = '';
            if (this._cachedPlayers.length === 0) {
                this._botKickPlayerListContainer.appendChild(document.createTextNode("No players."));
                return;
            }

            this._cachedPlayers.forEach(player => {
                const playerButton = createButton(player.name, "btn btn-outline-secondary");
                playerButton.title = `Kick ${player.name} (ID: ${player.id}) with the selected bot.`;
                playerButton.addEventListener("click", () => this._sendBotKick(player.id, player.name));
                this._botKickPlayerListContainer.appendChild(playerButton);
            });
        }

        _sendHumanVoteKick(targetPlayerId, targetPlayerName) {
            const socket = getPrimarySocket();
            if (socket) {
                const data = emits.sendvotekick(targetPlayerId);
                socket.send(data);
                notify("info", `Vote to kick sent for ${targetPlayerName} (ID: ${targetPlayerId}).`, "Kick Tools");
            }
        }

        _sendBotKick(targetPlayerId, targetPlayerName) {
            const socket = getPrimarySocket();
            if (!socket) return; // getPrimarySocket already notifies if no socket

            const data = emits.sendvotekick(targetPlayerId);
            socket.send(data);
            notify("success", `Bot (via socket) sent kick request for ${targetPlayerName}.`, "Kick Tools");
        }

        _toggleAutoKick(button) {
            this._isAutoKickActive = !this._isAutoKickActive;
            button.classList.toggle("active", this._isAutoKickActive);
            button.innerHTML = this._isAutoKickActive
                ? '<i class="fas fa-user-minus"></i> Auto Kick Active'
                : '<i class="fas fa-user-minus"></i> Auto Kick';

            if (this._isAutoKickActive) {
                const socketReady = getPrimarySocket(true); // Pass true to suppress initial notification
                if (!socketReady) {
                    notify("error", "You need an active connection (human or bot) to use 'Auto Kick'.", "Kick Tools");
                    this._isAutoKickActive = false;
                    button.classList.remove("active");
                    button.innerHTML = '<i class="fas fa-user-minus"></i> Auto Kick';
                    return;
                }
                notify("success", " 'Auto Kick' automation activated. It will attempt to kick all players.", "Kick Tools");
                this._kickedPlayersThisSession.clear();
                this._performAutoKick(); // Perform an initial sweep
            } else {
                clearInterval(this._autoKickInterval);
                this._autoKickInterval = null;
                notify("info", " 'Auto Kick' automation deactivated.", "Kick Tools");
            }
        }

        _performAutoKick() {
            if (!this._isAutoKickActive) return;

            const socket = getPrimarySocket(true);
            const myPlayerIdElement = document.querySelector(".playerlist-name-self")?.parentElement;
            const myPlayerId = myPlayerIdElement ? parseInt(myPlayerIdElement.dataset.playerid) : null;

            if (!socket) {
                notify("warning", "Socket disconnected. Stopping 'Auto Kick'.", "Kick Tools");
                const button = document.querySelector(`#${this._containerId} .auto-action-toggle:has(.fa-user-minus)`);
                if (button) {
                    this._toggleAutoKick(button);
                }
                return;
            }

            const playersToTarget = this._cachedPlayers.filter(player => {
                return player.id !== myPlayerId && !this._kickedPlayersThisSession.has(player.id);
            });

            if (playersToTarget.length === 0) {
                return;
            }

            playersToTarget.forEach(player => {
                const data = emits.sendvotekick(player.id);
                socket.send(data); // Send the kick command
                this._kickedPlayersThisSession.add(player.id);
                notify("info", ` (Auto) vote to kick ${player.name} (ID: ${player.id}).`, "Kick Tools");
            });
        }

        _toggleAutoProhibitDrawing(button) {
            this._isAutoProhibitDrawingActive = !this._isAutoProhibitDrawingActive;
            button.classList.toggle("active", this._isAutoProhibitDrawingActive);
            button.innerHTML = this._isAutoProhibitDrawingActive
                ? '<i class="fas fa-user-slash"></i> Auto Prohibit Drawing Active'
                : '<i class="fas fa-user-slash"></i> Auto Prohibit Drawing';

            if (this._isAutoProhibitDrawingActive) {
                const socketReady = getPrimarySocket(true);
                if (!socketReady) {
                    notify("error", "You need an active connection (bot) to use 'Auto Prohibit Drawing'.", "Kick Tools");
                    this._isAutoProhibitDrawingActive = false;
                    button.classList.remove("active");
                    button.innerHTML = '<i class="fas fa-user-slash"></i> Auto Prohibit Drawing';
                    return;
                }
                notify("success", " 'Auto Prohibit Drawing' automation activated. Players who are drawing will be periodically prohibited.", "Kick Tools");
                this._prohibitedPlayersThisSession.clear();
                this._performAutoProhibitDrawing();
                this._autoProhibitDrawingInterval = setInterval(() => {
                    this._performAutoProhibitDrawing();
                }, 5000); // Check every 5 seconds
            } else {
                clearInterval(this._autoProhibitDrawingInterval);
                this._autoProhibitDrawingInterval = null;
                notify("info", " 'Auto Prohibit Drawing' automation deactivated.", "Kick Tools");
            }
        }

        _performAutoProhibitDrawing() {
            if (!this._isAutoProhibitDrawingActive) return;

            const socket = getPrimarySocket(true);
            if (!socket) {
                notify("warning", "Socket disconnected. Stopping 'Auto Prohibit Drawing'.", "Kick Tools");
                const button = document.querySelector(`#${this._containerId} .auto-action-toggle:has(.fa-user-slash)`);
                if (button) {
                    this._toggleAutoProhibitDrawing(button);
                }
                return;
            }

            const playersToProhibit = this._cachedPlayers.filter(player => {
                return player.isDrawing && !this._prohibitedPlayersThisSession.has(player.id);
            });

            if (playersToProhibit.length === 0) {
                return;
            }

            playersToProhibit.forEach(player => {
                const data = emits.pgdrawvote(player.id, 0); // 0 means "prohibit drawing"
                socket.send(data);
                this._prohibitedPlayersThisSession.add(player.id);
                notify("info", ` (Auto) vote to prohibit drawing for ${player.name} (ID: ${player.id}).`, "Kick Tools");
            });
        }
    }

    // --- Style Injection ---
    GM_addStyle(`
        /* Variables and base styles adapted from the original for standalone operation */
        :root {
            --light: #f8f9fa;
            --dark: #212529;
            --primary: #007bff;
            --secondary: #6c757d;
            --success: #28a745;
            --info: #17a2b8;
            --danger: #dc3545;
            --warning: #ffc107;
            --dark-blue-title: #0056b3; /* A slightly darker color for titles */

            /* Adapt if the game uses its own vars or default to a fixed color */
            --CE-bg_color: var(--light);
            --CE-color: var(--dark);
            --input-border-blue: #007bff;
            --input-bg: #e9ecef;
            --dark-text: #343a40;
            --orange: #fd7e14;
        }

        .cubic-engine-mod-menu {
            line-height: normal;
            font-size: 1rem;
        }

        .cubic-engine-mod-menu > details {
            position: relative;
            overflow: visible;
            z-index: 999;
            background-color: var(--CE-bg_color);
            border: var(--CE-color) 1px solid;
            border-radius: .25rem;
        }

        .cubic-engine-mod-menu .btn {
            padding: 5px 10px;
            font-size: 0.9em;
            cursor: pointer;
            border: 1px solid var(--secondary);
            border-radius: .25rem;
            background-color: var(--secondary);
            color: var(--dark);
            transition: background-color 0.2s, color 0.2s, border-color 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 2px; /* Space between buttons */
        }
        .cubic-engine-mod-menu .btn:hover {
            opacity: 0.9;
        }
        .cubic-engine-mod-menu .btn i {
            margin-right: 5px;
        }

        .cubic-engine-mod-menu .btn-close-menu {
            background-color: var(--danger);
            color: white;
            padding: 3px 8px;
            font-size: 0.8em;
            border: none;
            line-height: 1;
        }
        .cubic-engine-mod-menu .btn-close-menu:hover {
            background-color: #c82333;
        }

        /* Specific Kick Tools module styles */
        .kick-tools-section {
            border: 1px solid var(--CE-color);
            border-radius: .25rem;
            padding: 5px;
            margin-bottom: 10px;
            background-color: var(--CE-bg_color);
        }
        .kick-tools-section-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: var(--dark-blue-title);
            text-align: center;
        }
        .kick-tools-player-list {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            max-height: 150px;
            overflow-y: auto;
            padding: 5px;
            border: 1px dashed var(--CE-color);
            border-radius: .25rem;
        }
        .kick-tools-player-list .btn {
            flex: 0 0 auto;
            margin: 0;
            padding: 3px 8px;
            font-size: 0.8em;
        }
        .auto-action-toggle {
            width: 100%;
            background-color: var(--secondary);
            color: var(--dark);
            border: 1px solid var(--CE-color);
            border-radius: .25rem;
            padding: 8px;
            font-size: 1em;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, color 0.2s;
        }
        .auto-action-toggle i {
            margin-right: 8px;
        }
        .auto-action-toggle.active {
            background-color: var(--info);
            color: white;
            border-color: var(--info);
        }
        ._row {
            display: flex;
            width: 100%;
            gap: 5px;
            margin-bottom: 5px;
        }
        ._row > * {
            flex: 1;
            width: 100%;
        }
        .icon-list {
            display: flex;
            flex-flow: wrap;
            gap: 5px;
        }
        /* For the draggable menu header */
        .cubic-engine-mod-menu-header {
            cursor: grab;
        }
    `);

    // --- Module Initialization ---
    function initializeKickTools() {
        // Ensure the DOM is fully loaded
        if (document.body) {
            new PlayerKickTools();

            // Optional: Add a floating button to open/close the menu
            const toggleButton = createElement("button", {
                id: "open-kick-tools-menu",
                style: `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: var(--primary, #007bff);
                    color: white;
                    border: none;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    font-size: 1.5em;
                    cursor: pointer;
                    z-index: 9998;
                `
            }, ['🔨']); // Judge's hammer icon

            document.body.appendChild(toggleButton);

            toggleButton.addEventListener("click", () => {
                const menu = document.getElementById("kick-tools-menu-container");
                if (menu) {
                    menu.style.display = menu.style.display === "none" ? "block" : "none";
                    if (menu.style.display === "block") {
                        notify("info", "Kick Tools Menu opened.", "Kick Tools");
                    } else {
                        notify("info", "Kick Tools Menu closed.", "Kick Tools");
                    }
                }
            });
            notify("info", "Floating 'Kick Tools' button added.", "Kick Tools");

        } else {
            setTimeout(initializeKickTools, 100); // Retry if body is not ready yet
        }
    }

    initializeKickTools();

})();
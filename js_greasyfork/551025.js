// ==UserScript==
// @name         Console FE - August10Loop
// @namespace    http://tampermonkey.net/
// @version      2025-09-04
// @description  Adds a console button in the game
// @author       August10Loop
// @license      MIT
// @match        https://drawaria.online/*
// @icon https://d.drawaria.online/avatar/cache/54030ad0-9ae1-11f0-a8cf-853f811805e0.1758895321374.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551025/Console%20FE%20-%20August10Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/551025/Console%20FE%20-%20August10Loop.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const EL = (sel) => document.querySelector(sel);
    const ELL = (sel) => document.querySelectorAll(sel);

    window.myRoom = {};
    window.sockets = [];
    window.bots = [];
    window.botGroups = [];

    // Override WebSocket.prototype.send to track sockets and handle messages
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!window.sockets.includes(this)) {
            window.sockets.push(this);
            if (window.sockets.indexOf(this) === 0) {
                this.addEventListener('message', (event) => {
                    const message = String(event.data);
                    if (message.startsWith('42')) {
                        const payload = JSON.parse(message.slice(2));
                        if (payload[0] === 'bc_uc_freedrawsession_changedroom') {
                            window.myRoom.players = payload[3];
                        }
                        if (payload[0] === 'mc_roomplayerschange') {
                            window.myRoom.players = payload[3];
                        }
                    } else if (message.startsWith('430')) {
                        const configs = JSON.parse(message.slice(3))[0];
                        window.myRoom.players = configs.players;
                        window.myRoom.id = configs.roomid;
                    }
                });
            }
        }
        return originalSend.call(this, ...args);
    };

    function addBoxIcons() {
        const boxicons = document.createElement('link');
        boxicons.href = 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';
        boxicons.rel = 'stylesheet';
        document.head.appendChild(boxicons);
    }

    function createStylesheet() {
        const container = document.createElement('style');
        container.textContent = `
            textarea { width: 100%; padding: 5px; font-size: 12px; border: 1px solid coral; resize: none; }
            .hidden { display: none; }
            .cheat-row { display: flex; gap: 2px; margin: 2px 0; flex-wrap: wrap; }
            .cheat-border { text-align: center; padding: 4px; margin: 1px; border: 1px solid coral; font-size: 12px; cursor: pointer; flex: 1; min-width: 50px; }
            .cheat-border.active { background-color: coral; color: white; }
            .console-container { text-align: center; padding: 5px; font-size: 12px; }
            .console-label { font-weight: bold; margin-bottom: 5px; }
            .cheat-container { max-width: 300px; padding: 5px; position: relative; }
            .instructions-container { position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%); width: 300px; background: white; border: 1px solid coral; padding: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 1000; text-align: center; }
            .instructions-header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .instructions-close { position: absolute; top: 5px; right: 5px; cursor: pointer; font-size: 16px; }
            .script-warning { color: red; font-size: 12px; margin-bottom: 5px; }
            .script-board { display: flex; align-items: center; gap: 5px; margin: 2px 0; border: 1px solid coral; padding: 4px; }
            .script-name { flex: 1; font-size: 12px; }
            .script-input-container { margin: 5px 0; }
            .script-name-input { width: 100%; padding: 5px; font-size: 12px; border: 1px solid coral; margin-bottom: 5px; }
        `;
        document.head.appendChild(container);
    }

    function Engine() {
        const chatboxMessages = EL('#chatbox_messages');
        if (!chatboxMessages) {
            console.error('Chatbox messages element not found');
            return;
        }

        const cheatContainer = document.createElement('div');
        cheatContainer.id = 'Engine-Cheatcontainer';
        cheatContainer.className = 'cheat-container hidden';
        chatboxMessages.after(cheatContainer);

        function createToggleButton(cheatContainer) {
            const target = EL('#chatbox_textinput');
            if (!target) {
                console.error('Chatbox text input element not found');
                return;
            }

            const btnContainer = document.createElement('div');
            btnContainer.id = 'togglecheats';
            btnContainer.className = 'input-group-append';

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'btn btn-outline-secondary';
            toggleBtn.innerHTML = '<i class="bx bx-terminal"></i>';
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleBtn.classList.toggle('active');
                cheatContainer.classList.toggle('hidden');
            });
            btnContainer.appendChild(toggleBtn);
            target.after(btnContainer);
        }

        function consoleControl(cheatContainer) {
            const container = document.createElement('div');
            container.innerHTML = `
                <div class='cheat-row'>
                    <i class='bx bx-info-circle cheat-border' id='showInstructions' title='Instructions'><span>Instructions</span></i>
                    <i class='bx bx-code-alt cheat-border' id='showScripts' title='Saved Scripts'><span>Saved Scripts</span></i>
                </div>
                <div id='consoleContainer' class='console-container'>
                    <div class='console-label'>CONSOLE FE</div>
                    <textarea id='consoleInput' rows='5' placeholder='Enter script...'></textarea>
                    <div class='cheat-row'>
                        <i class='bx bx-play-circle cheat-border' id='executeConsole' title='Execute Script'><span>Execute</span></i>
                        <i class='bx bx-trash cheat-border' id='clearConsole' title='Clear Console'><span>Clear</span></i>
                    </div>
                </div>
                <div id='instructionsContainer' class='instructions-container hidden'>
                    <i class='bx bx-x instructions-close' id='closeInstructions' title='Close'></i>
                    <div class='instructions-header'>Hello</div>
                    <p>This console can execute all JavaScript scripts without pressing F12 or Ctrl + Shift + I.</p>
                    <p>Enjoy, User!</p>
                </div>
                <div id='scriptsContainer' class='hidden'>
                    <div class='script-warning'>Warning: If you reload the page, your scripts will be lost and will need to be entered again.</div>
                    <div class='cheat-row'>
                        <i class='bx bx-plus-circle cheat-border' id='addScript' title='Add Script'><span>Add Script</span></i>
                    </div>
                    <div id='scriptInputContainer' class='script-input-container hidden'>
                        <input type='text' id='scriptNameInput' class='script-name-input' placeholder='Enter script name...'>
                        <textarea id='scriptInput' rows='5' placeholder='Enter script...'></textarea>
                        <div class='cheat-row'>
                            <i class='bx bx-save cheat-border' id='saveScript' title='Save Script'><span>Save</span></i>
                            <i class='bx bx-x cheat-border' id='cancelScript' title='Cancel'><span>Cancel</span></i>
                        </div>
                    </div>
                    <div id='savedScriptsList'></div>
                </div>
            `;

            cheatContainer.appendChild(container);

            EL('#showInstructions').addEventListener('mousedown', () => {
                EL('#instructionsContainer').classList.toggle('hidden');
                EL('#scriptsContainer').classList.add('hidden');
            });

            EL('#closeInstructions').addEventListener('mousedown', () => {
                EL('#instructionsContainer').classList.add('hidden');
            });

            EL('#showScripts').addEventListener('mousedown', () => {
                EL('#scriptsContainer').classList.toggle('hidden');
                EL('#instructionsContainer').classList.add('hidden');
            });

            EL('#executeConsole').addEventListener('mousedown', () => {
                const script = EL('#consoleInput').value;
                try {
                    eval(script); // Note: Using eval is risky; consider safer alternatives in production
                    console.log('Script executed successfully');
                } catch (e) {
                    console.error('Error executing script:', e);
                }
            });

            EL('#clearConsole').addEventListener('mousedown', () => {
                EL('#consoleInput').value = '';
            });

            EL('#addScript').addEventListener('mousedown', () => {
                EL('#scriptInputContainer').classList.toggle('hidden');
            });

            EL('#cancelScript').addEventListener('mousedown', () => {
                EL('#scriptInputContainer').classList.add('hidden');
                EL('#scriptNameInput').value = '';
                EL('#scriptInput').value = '';
            });

            EL('#saveScript').addEventListener('mousedown', () => {
                const scriptName = EL('#scriptNameInput').value.trim();
                const scriptContent = EL('#scriptInput').value.trim();
                if (scriptName && scriptContent) {
                    const scriptBoard = document.createElement('div');
                    scriptBoard.className = 'script-board';
                    scriptBoard.innerHTML = `
                        <span class='script-name'>${scriptName}</span>
                        <i class='bx bx-play-circle cheat-border' title='Execute Script'><span>Execute</span></i>
                        <i class='bx bx-trash cheat-border' title='Delete Script'><span>Delete</span></i>
                    `;

                    const executeBtn = scriptBoard.querySelector('.bx-play-circle');
                    const deleteBtn = scriptBoard.querySelector('.bx-trash');

                    executeBtn.addEventListener('mousedown', () => {
                        try {
                            eval(scriptContent); // Note: Using eval is risky
                            console.log(`Script "${scriptName}" executed successfully`);
                        } catch (e) {
                            console.error(`Error executing script "${scriptName}":`, e);
                        }
                    });

                    deleteBtn.addEventListener('mousedown', () => {
                        scriptBoard.remove();
                    });

                    EL('#savedScriptsList').prepend(scriptBoard);
                    EL('#scriptInputContainer').classList.add('hidden');
                    EL('#scriptNameInput').value = '';
                    EL('#scriptInput').value = '';
                }
            });
        }

        createToggleButton(cheatContainer);
        consoleControl(cheatContainer);
    }

    const Player = function (name = undefined) {
        this.name = name;
        this.sid1 = null;
        this.uid = '';
        this.wt = '';
        this.conn = new Connection(this);
        this.room = new Room(this.conn);
        this.action = new Actions(this.conn);
    };

    Player.prototype.annonymize = function (name) {
        this.name = name;
        this.uid = undefined;
        this.wt = undefined;
    };

    const Connection = function (player) {
        this.player = player;
        this.socket = null;
    };

    Connection.prototype.onopen = function () {
        this.Heartbeat(25000);
    };

    Connection.prototype.onclose = function () {};

    Connection.prototype.onerror = function () {};

    Connection.prototype.onmessage = function (event) {
        const message = String(event.data);
        if (message.startsWith('42')) {
            this.onbroadcast(message.slice(2));
        } else if (message.startsWith('40')) {
            this.onrequest();
        } else if (message.startsWith('41')) {
            this.player.room.join(this.player.room.id);
        } else if (message.startsWith('430')) {
            const configs = JSON.parse(message.slice(3))[0];
            this.player.room.players = configs.players;
            this.player.room.id = configs.roomid;
        }
    };

    Connection.prototype.onbroadcast = function (payload) {
        const data = JSON.parse(payload);
        if (data[0] === 'bc_uc_freedrawsession_changedroom') {
            this.player.room.players = data[3];
            this.player.room.id = data[4];
        }
        if (data[0] === 'mc_roomplayerschange') {
            this.player.room.players = data[3];
        }
    };

    Connection.prototype.onrequest = function () {};

    Connection.prototype.open = function (url) {
        this.socket = new WebSocket(url);
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
    };

    Connection.prototype.close = function (code, reason) {
        if (this.socket) {
            this.socket.close(code, reason);
        }
    };

    Connection.prototype.Heartbeat = function (interval) {
        const timeout = setTimeout(() => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send('2');
                this.Heartbeat(interval);
            }
        }, interval);
    };

    Connection.prototype.serverconnect = function (server, room) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.open(server);
        } else {
            this.socket.send('41');
            this.socket.send('40');
        }
        this.onrequest = () => {
            this.socket.send(room);
        };
    };

    const Room = function (conn) {
        this.conn = conn;
        this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        this.players = [];
    };

    Room.prototype.join = function (invitelink) {
        let gamemode = 2;
        let server = '';
        if (!invitelink) {
            this.id = null;
            server = 'sv3.';
        } else {
            this.id = invitelink.startsWith('http') ? invitelink.split('/').pop() : invitelink;
            if (invitelink.endsWith('.3')) {
                server = 'sv3.';
                gamemode = 2;
            } else if (invitelink.endsWith('.2')) {
                server = 'sv2.';
                gamemode = 2;
            } else {
                server = '';
                gamemode = 1;
            }
        }

        const serverurl = `wss://${server}drawaria.online/socket.io/?sid1=undefined&hostname=drawaria.online&EIO=3&transport=websocket`;
        const player = this.conn.player;
        const connectstring = `420["startplay","${player.name}",${gamemode},"en",${nullify(this.id)},null,[null,"https://drawaria.online/",1000,1000,[${nullify(player.sid1)},${nullify(player.uid)},${nullify(player.wt)}],null]]`;

        this.conn.serverconnect(serverurl, connectstring);
    };

    const Actions = function (conn) {
        this.conn = conn;
    };

    Actions.prototype.SendMessage = function (message) {
        if (this.conn.socket?.readyState === WebSocket.OPEN) {
            this.conn.socket.send(`42["chatmsg","${message}"]`);
        }
    };

    Actions.prototype.DrawLine = function (bx, by, ex, ey, thickness, color) {
        if (this.conn.socket?.readyState === WebSocket.OPEN) {
            bx = bx / 100;
            by = by / 100;
            ex = ex / 100;
            ey = ey / 100;
            this.conn.socket.send(`42["drawcmd",0,[${bx},${by},${ex},${ey},false,${0 - thickness},"${color}",0,0,{}]]`);
        }
    };

    const nullify = (value = null) => {
        return value == null ? null : `"${value}"`;
    };

    if (!document.getElementById('Engine-Cheatcontainer')) {
        addBoxIcons();
        createStylesheet();
        Engine();
    }
})();
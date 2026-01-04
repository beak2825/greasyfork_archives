// ==UserScript==
// @name         Kour Helper
// @match        *://kour.io/*
// @version      1.01
// @author       anonymous
// @run-at       document-start
// @description  Some code yeah idk
// @namespace https://greasyfork.org/en/users/1522288
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551582/Kour%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551582/Kour%20Helper.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', () => {
    IS_DEBUG = false;

    const style = document.createElement('style');
    style.textContent = `
        #overlay {
            position: fixed;
            width: -webkit-fill-available;
            background-color: #1e1e1e;
            color: #cccccc;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 0;
            font-family: Consolas, 'Courier New', monospace;
            z-index: 9999;
            box-shadow: 0 0 10px #000;
            display: block;
            user-select: none;
            overflow: hidden;
            transition: height 0.3s ease;
            max-width: 500px;
        }

        #overlay-title {
            padding: 10px;
            background-color: #252526;
            cursor: move;
            border-bottom: 1px solid #333;
            color: #ffffff;
            font-weight: bold;
            font-size: 16px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #overlay-title .toggle-arrow {
            cursor: pointer;
            font-size: 24px;
            font-weight: bold;
            transition: transform 0.3s ease;
        }

        #overlay-content {
            padding: 15px;
            max-height: 400px;
            opacity: 1;
            overflow-y: auto;
            overflow-x: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }

        .collapsed #overlay-content {
            max-height: 0;
            opacity: 0;
            padding: 0;
        }

        .collapsed #overlay {
            height: 50px;
        }

        .expanded #overlay-title .toggle-arrow {
            transform: rotate(180deg);
        }

        #overlay label {
            display: flex;
            margin-bottom: 10px;
            cursor: pointer;
            max-width: 1px;
            align-items: center;
            white-space: nowrap;
        }

        #overlay input[type="checkbox"] {
            margin-right: 10px;
            accent-color: #007acc;
        }

        #overlay input[type="number"], 
        #overlay input[type="text"] {
            background-color: #252526;
            border-color: #2525263b;
            border-width: 1px;
            color: white;
            margin-top: 4px;
            margin-left: 3px;
        }

        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* General button styling inside overlay */
        #overlay button {
            background-color: #c0392b;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-family: Consolas, 'Courier New', monospace;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }

        #overlay button:hover {
            background-color: #e74c3c;
            transform: scale(1.03);
        }

        #overlay button:active {
            background-color: #a93226;
            transform: scale(0.98);
        }

        #overlay label button {
            margin-left: 0;
        }

        #overlay-content::-webkit-scrollbar {
            width: 10px;
        }

        #overlay-content::-webkit-scrollbar-track {
            background: #1e1e1e;
            border-radius: 4px;
        }

        #overlay-content::-webkit-scrollbar-thumb {
            background-color: #444;
            border-radius: 4px;
            border: 2px solid #1e1e1e;
        }

        #overlay-content::-webkit-scrollbar-thumb:hover {
            background-color: #666;
        }
    `;


    function setInStorage(key, value) {
        let existing = JSON.parse(localStorage.getItem('KH.settings')) || {};
        existing[key] = value;
        return localStorage.setItem('KH.settings', JSON.stringify(existing));
    }

    function getInStorage(key) {
        let existing = JSON.parse(localStorage.getItem('KH.settings')) || {};
        return existing[key];
    }


    const overlay = document.createElement('div');
    let settings = JSON.parse(localStorage.getItem('KH.settings')) || {};
    

    if (!settings.coords) {
        settings.coords = [20, 20];
        setInStorage('coords', settings.coords);
    }

    let collapsed = !settings.collapsed ? false : true;
    if (collapsed) {
        overlay.classList.toggle('collapsed');
        overlay.classList.toggle('expanded');
    }

    let overlayVisibility = settings['overlayVisibility'];
    if (overlayVisibility) {
        overlay.style.display = overlayVisibility; 
    }

    overlay.style.left = `${settings.coords[0]}px`;
    overlay.style.top = `${settings.coords[1]}px`;

    overlay.id = 'overlay';
    overlay.innerHTML = `
        <div id="overlay-title">
            &#x1F7E2 Kour Helper v1.0
            <span class="toggle-arrow">↓</span>
        </div>
        <div id="overlay-content">
            <label><input type="checkbox" id="invis" checked="1"/> Invis</label>
            <label><input type="checkbox" id="instakill" /> Instakill</label>
            <label><input type="checkbox" id="crashPlayers" /> Crash all players</label>
            <label title="Does the same thing as crash all players but makes the lobby impossible to render on any computer and is impossible to fix via monkey patching"><button id="crashLobby">Crash lobby</button></label>
            <label><input type="checkbox" id="teamScore" /> Auto team score</label>
            <label title="This must be toggled on before picking a team"><input type="checkbox" id="fakeTeam"/> Turn tdm into ffa</label>
            <label><input type="checkbox" id="largeLobbys" /> Host large lobbys<input id="playerCount" type="number" min="0" max="255" value="255" placeholder="0"></></label> 
            <label><input type="checkbox" id="customLobby" /> Custom lobby name<input id="customLobbyName" type="text" maxLength="255" placeholder="test_123"></></label>
            <label><input type="checkbox" id="playerJoined" /> Custom joined message<input id="playerJoinedMessage" type="text" maxLength="112" placeholder="has joined!"></></label>
            <label><input type="checkbox" id="customName" /> Custom username<input id="customNameMessage" type="text" maxLength="160" placeholder="<color=red>God"></></label>
            <label><input type="checkbox" id="customKillPlayer" /> On kill message<input id="customKillPlayerMessage" type="text" maxLength="240" placeholder="noob down"></></label>
            <!-- <label><button id="customChat" /> Send custom chat message<input id="customChatMessage" type="text" maxLength="112" placeholder="Custom chat message"></></label> -->
            <label><input type="checkbox" id="teleportEnemys" /> Teleport enemys to player (clientside)</label>
            <label><input type="checkbox" id="teleportEnemysServer" /> Teleport enemys to player (serverside)</label>
            <label title="This must be toggled on while killing a player to autokill the last player you killed"><input type="checkbox" id="autoKillSingle" /> Autokill last killed enemy</label>
            <label title="This must be toggled on while killing a player to super autokill the last player you killed"><input type="checkbox" id="superAutoKillSingle" /> Super autokill last killed enemy</label>
            <label title="Auto kills all possible players without needing to kill someone first"><input type="checkbox" id="autoKillAll" /> Autokill all enemies</label>
            <label title="Super auto kills all possible players without needing to kill someone first"><input type="checkbox" id="superAutoKillAll" /> Super autokill all enemies</label>
            <label title="Gives the enemies seizures by teleporting them into narnia (can only teleport someone once per life)"><input type="checkbox" id="giveSeizures" /> Give enemies seizures</label>
            <label title="Impersonates user when they say cheat or hack or report etc... for a little trolling"><input type="checkbox" id="impersonate" /> Impersonate user on chat</label>
            <label title="Spawns a bot for only other users when you yourself moves around and also super cook their game"><input type="checkbox" id="spawnBotCook" /> Spawn bot/super cook game</label>
            <label title="Spawns a bot for only other users when you yourself moves around and does NOT cook the users game and should be unkillable"><input type="checkbox" id="spawnBotNormal" /> Spawn bot normal</label>
            <label title="Spawns a bot for only other users when you shoot any gun and does NOT cook the users game and should be unkillable"><input type="checkbox" id="spawnBotShoot" /> Spawn bot on shoot</label>
        </div>
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Toggle collapse/expand functionality
    const toggleArrow = overlay.querySelector('.toggle-arrow');
    const overlayContent = overlay.querySelector('#overlay-content');

    toggleArrow.addEventListener('click', () => {
        collapsed = collapsed ? false : true
        overlay.classList.toggle('collapsed');
        overlay.classList.toggle('expanded');
        setInStorage('collapsed', collapsed);
    });


    document.getElementById('crashLobby').addEventListener('click', () => {
        if (currentSocket && window.spawn_player) {
            let new_spawn_player = toArray(window.spawn_player);
            for (let i = 0; i <= 5000; i++) {
                new_spawn_player.set(intToByteArray(i), new_spawn_player.byteLength - 2);
                currentSocket.originalSend(new_spawn_player);
            }
        }
    });



    // Toggle with Right Shift key
    document.addEventListener('keydown', (e) => {
        if (e.code === 'ShiftRight') {
            overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
            setInStorage('overlayVisibility', overlay.style.display);
            if (overlay.style.display == 'block') {
                document.exitPointerLock();
            }
        }
    });

    // Drag functionality
    const header = overlay.querySelector('#overlay-title');
    let isDragging = false, offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - overlay.offsetLeft;
      offsetY = e.clientY - overlay.offsetTop;
      if (!e.target == overlay) {
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            overlay.style.left = `${Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - overlay.offsetWidth))}px`;
            overlay.style.top = `${Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - overlay.offsetHeight))}px`;
        }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    header.addEventListener('mouseup', (e) => {
      setInStorage('coords', [overlay.offsetLeft,overlay.offsetTop])
    });

    let playerCount = document.getElementById('playerCount');
    let customLobbyName = document.getElementById('customLobbyName');
    let playerJoinedMessage = document.getElementById('playerJoinedMessage');
    let customNameMessage = document.getElementById('customNameMessage');
    let customKillPlayerMessage = document.getElementById('customKillPlayerMessage');

    // let customChatMessage = document.getElementById('customChatMessage'); 
    // let customChatbtn = document.getElementById('customChat');

    let currentSocket;

    // customChatbtn.onclick = () => {
    //     if (!currentSocket) return
    //     sendCustomChat(currentSocket, customChatMessage.value);
    // };

    
    let toggles = {}

    overlay.querySelectorAll('input[type="number"]').forEach((e) => {
        let settingsValue = settings[`${e.id}Number`] ?? '';
        if (!settingsValue) setInStorage(`${e.id}Number`, '');
        e.value = settingsValue;

        e.onkeydown = function(event) {
            event.stopPropagation();
            if (Number(event.key) || Number(event.key) == 0 && !event.ctrlKey && !event.altKey) {
                let currentValue = Number(event.key);
                let newValue = Math.min(this.value + Number(event.key), 255);
                this.value = newValue;
                setInStorage(`${this.id}Number`, this.value);
            }

        e.onkeyup = function(event) {
            if (event.key == 'Backspace') {
                setInStorage(`${this.id}Number`, this.value);
            }
        }
        }
    });

    overlay.querySelectorAll('input[type="text"]').forEach((e) => {
        let settingsValue = settings[`${e.id}Text`] ?? '';
        if (!settingsValue) setInStorage(`${e.id}Text`, '');
        e.value = settingsValue;

        e.onkeydown = function(event) {
            event.stopPropagation();

            // Only handle printable characters, ignore ctrl/alt/meta keys
            if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
                event.preventDefault(); // Prevent default character input

                const start = this.selectionStart;
                const end = this.selectionEnd;
                const before = this.value.substring(0, start);
                const after = this.value.substring(end);
                const newValue = before + event.key + after;

                this.value = newValue;
                this.selectionStart = this.selectionEnd = start + 1;
                this.scrollLeft = this.scrollWidth;

                setInStorage(`${this.id}Text`, newValue);
            }
        }

        e.onkeyup = function(event) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                setInStorage(`${this.id}Text`, this.value);
            }
        }
    });


    overlay.querySelectorAll('input[type="checkbox"]').forEach((e) => {
        let settingsValue = settings[`${e.id}Toggled`];
        if (!settingsValue) setInStorage(`${e.id}Toggled`, false);
        
        e.checked = settingsValue;
        toggles[e.id] = settingsValue;
        e.onclick = function() {
            toggles[this.id] = this.checked;
            setInStorage(`${this.id}Toggled`, this.checked);
            if (window.socket && IS_DEBUG) {
                sendCustomChat(window.socket, `Toggling ${this.id}: ${this.checked} <color=red>Kour Helper v1.0`);
            }
        }
    });







    // Non ui related things


    function identifyMessage(data) { // Should only be used for debugging purposes when logging websocket messages since using it comes at a performance loss that gets bigger and bigger the more signatures that are added
        let parsed = arrayToString(data);
        let hex_parsed = arrayToHexString(data);
        let type = 'unknown';

        const signatures = [
            {
                type: 'createGame',
                check: () => parsed.includes('customSqlLobby') && parsed.includes('characterSkinIndex')
            },
            {
                type: 'badCreateGame',
                check: () => parsed.includes('customSqlLobby') && !parsed.includes('characterSkinIndex') && !parsed.includes('!=')
            },
            {
                type: 'websocketConnection',
                check: () => parsed.endsWith('==')
            },
            {
                type: 'getLobbys',
                check: () => parsed.includes('!= -1 AND C0 != -1')
            },
            {
                type: 'enemyBullets',
                check: () => hex_parsed.includes('f3 04 c8 02 f5 15 04')
            },
            {
                type: 'chatMsg',
                check: () => parsed.includes('<color=#e8e8e8>')
            },
            {
                type: 'updatePlayer',
                check: () => /00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00$/i.test(hex_parsed) && /^f3 02 fd 02 f4 03 [A-Za-z0-9]+ f5 17 03 09/i.test(hex_parsed)
            },
            {
                type: 'updateEnemyPlayer',
                check: () => /00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00/i.test(hex_parsed)
            },
            {
                type: 'setGroundedState',
                check: () => (/^f3 02 fd 02 f4 03 c8 f5 15 04 22 0d [0-9a-fA-F]{2} 03 03 02 09/i.test(hex_parsed) || /^f3 02 fd 02 f4 03 c8 f5 15 04 22 [0-9a-fA-F]{2} [0-9a-fA-F]{2} [0-9a-fA-F]{2} [0-9a-fA-F]{2} 03 02 09/i.test(hex_parsed)) && (hex_parsed.endsWith('1c') || hex_parsed.endsWith('1b'))
            },
            {
                type: 'pong',
                check: () => hex_parsed.includes('f3 06 01 01 01')
            
            }, {
                type: 'shoot',
                check: () => hex_parsed.endsWith('0c 01 1e 0c 01')
            },
            {
                type: 'damagePlayer',
                check: () => data.byteLength > 60 && !hex_parsed.endsWith('0c 01 1e 0c 01') && /f3 02 fd 02 f4 03 c8 f5 15 04 22 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 03/i.test(hex_parsed) && !(/^f3 02 fd 02 f4 03 c8 f5 15 04 22 0d [0-9a-fA-F]{2} 03 03 02 09/i.test(hex_parsed) || /^f3 02 fd 02 f4 03 c8 f5 15 04 22 [0-9a-fA-F]{2} [0-9a-fA-F]{2} [0-9a-fA-F]{2} [0-9a-fA-F]{2} 03 02 09/i.test(hex_parsed))
            },
            {
                type: 'playerJoined',
                check: () => parsed.includes('weaponSkinIndex') && hex_parsed.includes('03 ff')
            },
            {
                type: 'selectTeam',
                check: () => /^f3 02 fc 03 fb 15 01 07 03 5f 70 74 03 [A-Za-z0-9]+ fe 0b [A-Za-z0-9]+ fa 1c$/i.test(hex_parsed)
            },
            {
                type: 'killPlayer',
                check: () => (/^f3 02 fd 03 f7 03 04 f4 03 c8 f5 15 04 22 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 03 02 09/i.test(hex_parsed) || /^f3 02 fd 03 f7 03 04 f4 03 c8 f5 15 04 22 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 03 02 09/i.test(hex_parsed)) && !hex_parsed.endsWith('01') && data.byteLength > 35
            },
            {
                type: 'mapSecret',
                check: () => parsed.includes('<color=green> Has found a map secret.</color>')
            },
            {
                type: 'killstreak',
                check: () => parsed.includes('</color> Kill Streak</color>')
            },
            {
                type: 'setTeamScore',
                check: () => parsed.startsWith('f3 02 fc 02 fb 15 01 07 03 54')
            },
            {
                type: 'jumppad',
                check: () => hex_parsed.includes('03 05 03 0f 03 04 17 01') && hex_parsed.includes('03 02 09')
            },
            {
                type: 'websocketError',
                check: () => hex_parsed.startsWith('f3 05') && (parsed.includes('Failed to parse') || parsed.includes('invalid message'))
            },
            {
                type: 'DisconnectMessage',
                check: () => hex_parsed.startsWith('f3 05')
            },
            {
                type: 'playerSpawn',
                check: () => parsed.includes('Player') && /f3 02 fd 03 f7 03 04 f4 03 ca f5 15 [A-Za-z0-9]+ 22 07 06 50 6c 61 79 65 72 03 01 d6 0c/.test(hex_parsed)
            }
        ];

        for (const sig of signatures) {
            if (sig.check()) {
                type = sig.type;
                break;
            }
        }

        return type;
    };


    function sendCustomChat(socket, message) {
        let parsed = arrayToString("f3 02 fd 03 f6 03 01 f4 22 f5 17 03 07 2f 3c 63 6f 6c 6f 72 3d 23 65 38 65 38 65 38 3e 0c 01 1b");
        message = message.slice(0, 240); // 127 characters is the max unless you add an extra byte 01 past it to go up to 255 as the max, custom message + 15 for the predefinded <color>
        let new_length_chars = String.fromCharCode(message.length + 15);

        if (message.length + 15 >= 128) { // Safety check to stop the user from crashing, all strings can only go to 127 characters (signed) and for some reason you need to specify that its unsigned with an extra 0x01 byte even though the game only uses unsigned arrays on the javascript websocket side of things
            new_length_chars = new_length_chars + String.fromCharCode(1);
        }

        let newChat = parsed.slice(0, 13) + new_length_chars + parsed.slice(14).replace('<color=#e8e8e8>', `<color=#00ff00>${message}`)
        socket.originalSend(toArray(newChat));
    };

    function findAllByteSequenceIndices(array, sequence) {
        if (typeof sequence === 'string') {
            sequence = sequence.split(' ');
        }

        const indices = [];

        for (let i = 0; i <= array.length - sequence.length; i++) {
            if (sequence.every((byte, j) => array[i + j] === byte)) {
                indices.push(i);
            }
        }

        return indices;
    }

    // Function to get the byte index in a hex string

    function findByteSequenceIndex(array, sequence) {
        if (typeof sequence == 'string') sequence = sequence.split(' ');
        for (let i = 0; i <= array.length - sequence.length; i++) {
        if (sequence.every((byte, j) => array[i + j] === byte)) {
          return i;
            }
        }
        return -1; // not found
    }


    function toSignedInt8(n) {
        return (n & 0xFF) << 24 >> 24;
    }

    function getPlayerInfo(data) {
        if (typeof data == 'object') {
            let hex_parsed = arrayToHexString(data);
            data = toArray(data);
            let signature = findByteSequenceIndex(hex_parsed.split(' '), '1b 08');
            if (signature == -1) return;
        
            let identifiers = [data[signature - 3], data[signature - 2], data[signature - 1]]


            return identifiers;
        }
        return false;
    }

    // function processMessage(data_, raw_data) {
    //     let parsed = arrayToString(data_);
    //     let hex_parsed = arrayToHexString(data_);
    //     let response;
    //     let data = data_;

    //     const checks = [
    //         {
    //             check: () => identifyMessage(data) == 'damagePlayer',
    //             action: () => {repeatMessage(raw_data, 20)}
    //         },
    //         {
    //             check: () => toggles['invis'] && /00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00$/i.test(hex_parsed) && /^f3 02 fd 02 f4 03 [A-Za-z0-9]+ f5 17 03 09/i.test(hex_parsed),
    //             action: () => {
    //                 let data = toArray(data);
            
    //                 data[data.byteLength - 40] = 75; // y player coords are stored as a float (4 bytes) but changing byte 1 and byte 2 to 75, 255 makes the player go so far outside of the map that we dont need to modify the rest of the bytes also they are obscured
    //                 data[data.byteLength - 39] = 255;

            
    //                 return data;
    //             }
    //         },
    //         {
    //             check: () => toggles['crashPlayers'] && /00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00$/i.test(hex_parsed) && /^f3 02 fd 02 f4 03 [A-Za-z0-9]+ f5 17 03 09/i.test(hex_parsed),
    //             action: () => {
    //                 let data = toArray(data);
            
    //                 data.set([255, 255, 255, 255], data.byteLength - 40);
    //                 return data;
    //             }
    //         },
    //         {
    //             check: () =>  toggles['teamScore'] && hex_parsed.startsWith('f3 02 fc 02 fb 15 01 07 03 54'),
    //             action: () => {
    //                 let data = toArray('f3 02 fc 02 fb 15 01 07 03 54 32 53 09 a6 80 08 fa 1c'); 
    //                 if (hex_parsed.slice(30, 32) == '31') {
    //                     data.set([0x31], 10); // 10th byte is your team, 31 = KourKartel and 32 = KBI Agents
    //                 }
    //                 return data;
    //             }
    //         },
    //         {
    //             check: () => toggles['largeLobbys'] && parsed.includes('customSqlLobby') && parsed.includes('characterSkinIndex'),
    //             action: () => {
    //                 let array = new Uint8Array(data);
            
    //                 array[array.byteLength - 8] = playerCount.value; // Player count is stored as a 1 byte int 8 bytes away from the end of the socket message
    //                 array.set([116, 19], array.byteLength - 17); // Game time is stored as a 2 byte int 17 bytes away from the end of the message and cannot surpase 83 minutes for some reason (dogshit game code)

                    
    //                 return array;
    //             }
    //         },
    //         {
    //             check: () => toggles['teleportEnemys'] && identifyMessage(data) == 'updatePlayer',
    //             action: () => {
    //                 let x = new DataView(toArray(data.slice(data.byteLength - 36, data.byteLength - 32)).buffer).getFloat32().toFixed(3);
    //                 let y = new DataView(toArray(data.slice(data.byteLength - 40, data.byteLength - 36)).buffer).getFloat32().toFixed(3);
    //                 let z = new DataView(toArray(data.slice(data.byteLength - 44, data.byteLength - 40)).buffer).getFloat32().toFixed(3);
    //                 window.my_x = x;
    //                 window.my_y = y;
    //                 window.my_z = z;
    //             }
    //         },
    //         {
    //             check: () => toggles['teleportEnemys'] && window.my_x && window.my_z && /00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00/i.test(data_parsed.hex),
    //             action: () => {
    //                 let y = new DataView(toArray(data.slice(data.byteLength - 43, data.byteLength - 39)).buffer).getFloat32().toFixed(3);
                    
    //                 const floatArray = new DataView(data_parsed.Uint8Array.buffer);
    //                 floatArray.setFloat32(data.byteLength - 47, parseFloat(window.my_z) + 4);
    //                 floatArray.setFloat32(data.byteLength - 43, parseFloat(y) + 0.2);
    //                 floatArray.setFloat32(data.byteLength - 39, parseFloat(window.my_x) + 1);
    //                 return data_parsed;
    //             }
    //         },
    //         {
    //             check: () => toggles['fakeTeam'] && /^f3 02 fc 03 fb 15 01 07 03 5f 70 74 03 [A-Za-z0-9]+ fe 0b [A-Za-z0-9]+ fa 1c$/i.test(hex_parsed),
    //             action: () => {
    //                 data[data.byteLength - 6] = 3; // 6 bytes away from the end of the message is the chosen team
    //                 return data;
    //             }
    //         },
    //         {
    //             check: () => toggles['instakill'] && identifyMessage(data) == 'damagePlayer',
    //             action: () => {
    //                 repeatMessage(raw_data, 20);
    //             }
    //         },
    //         {
    //             check: () => toggles['customLobby'] && identifyMessage(data) == 'badCreateGame',
    //             action: () => {
    //                 const new_lobby_name = customLobbyName.value;
    //                 const new_lobby_length = new_lobby_name.length;
    //                 parsed = parsed.slice(0, 6) + String.fromCharCode(new_lobby_length) + new_lobby_name + parsed.slice(13);
    //                 data = toArray(parsed);
    //                 return data;
    //             }
    //         }
            
    //     ]

    //     for (const sig of checks) {
    //         if (sig.check()) {
    //             response = sig.action();
    //             break;
    //         }
    //     }
    //     return response;
    // }

    // window.addEventListener('onsocketSend', (e) => {
    //     let processed = processMessage(e.detail.data, e);
    //     if (processed) {
    //         e.detail.data = processed;
    //     }
    // })

    // window.addEventListener('onsocketReceive', (e) => {
    //     let processed = processMessage(e.detail.data.data, e);
    //     if (processed) {
    //         e.detail.data.data = processed;
    //     }
    // })



    window.addEventListener("onsocketOpen", (e) => {
        if (!e.detail.this.url.includes('firebase')) {
            currentSocket = e.detail.this; 
        }
    });


    // All of this code "could" be optimized but it would make the reading ability worse and possibly cause breakages if we put all onsocketSend in 1 listener and all onsocketReceive in another listener but will have better performance


    // The first byte is the header, the second byte is the message type, third byte i have no idea, fourth byte is the parameter code


    // Give the user a reason on why  they crashed if they do
    window.addEventListener('onsocketReceive', (e) => {
        let parsed = arrayToString(e.detail.data.data);
        let hex_parsed = arrayToHexString(e.detail.data.data)
        if (hex_parsed.startsWith('f3 05') && (parsed.includes('Failed to parse') || parsed.includes('invalid message'))) { // Check if the 2nd byte of the message is 05 (disconnect) to stop someone from triggering this by sending a websocket message containing our target strings
            console.error(parsed);
        }
    })

    // window.addEventListener('onsocketSend', (e) => {
    //     let parsed = arrayToString(e.detail.data);
    //     let hex_parsed = arrayToHexString(e.detail.data);
    //     if (parsed.includes('Player') && /f3 02 fd 03 f7 03 04 f4 03 ca f5 15 [A-Za-z0-9]+ 22 07 06 50 6c 61 79 65 72 03 01 d6 0c/.test(hex_parsed)) {
    //         window.spawn_player = hex_parsed;
    //     }
    // })


    // let player_ids = [];
    // window.addEventListener('onsocketReceive', (e) => {
    //     let parsed = arrayToString(e.detail.data.data);
    //     let hex_parsed = arrayToHexString(e.detail.data.data);
    //     if (parsed.includes('Player') && (hex_parsed.startsWith('f3 04 ca 02 f5 15 06 03 07 0d') || hex_parsed.includes('fe 0b'))) {
    //         let data = toArray(e.detail.data.data);
    //         let position = findByteSequenceIndex(hex_parsed.split(' '), '03 07') + 2;
    //         let player = arrayToHexString(data.slice(position, position + 3))
    //         player_ids.push(player);
    //     }
    // })


    // window.addEventListener('onsocketReceive', (e) => {
    //     let hex_parsed = arrayToHexString(e.detail.data.data);
    //     if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00/i.test(hex_parsed) && window.kill_player) { // Update player (instead of on player update we should do on player spawn to minimize breakage since updatePlayer messages get pretty bad depending on the lobby the user is in)
    //         let id;
    //         for (const e of player_ids) {
    //             if (hex_parsed.includes(e)) {
    //                 id = e;
    //                 break
    //             }
    //         }
    //         if (!id) return;
    //         let new_killed_player = toArray(window.kill_player.replace('0d 39 4a', id).replace('0d 6b 42', id)); // Replacing the hard coded player id's with the new target player id


    //         e.detail.this.originalSend(new_killed_player); // Kill the player
    //         player_ids.pop(id);

    //     }
    // });

    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['teamScore']) return;
        let hex_parsed = arrayToHexString(e.detail.data);
        if (hex_parsed.startsWith('f3 02 fc 02 fb 15 01 07 03 54')) {
            let data = toArray('f3 02 fc 02 fb 15 01 07 03 54 32 53 09 a6 80 08 fa 1c'); 
            if (hex_parsed.slice(30, 32) == '31') {
                data.set([0x31], 10); // 10th byte is your team, 31 = KourKartel and 32 = KBI Agents
            }
            e.detail.data = data;
        }
    });




    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['largeLobbys']) return;
        const parsed = arrayToString(e.detail.data);
        if (parsed.includes('customSqlLobby') && parsed.includes('characterSkinIndex')) {
            let array = new Uint8Array(e.detail.data);
            
            array[array.byteLength - 8] = playerCount.value; // Player count is stored as a 1 byte int 8 bytes away from the end of the socket message
            array.set([116, 19], array.byteLength - 17); // Game time is stored as a 2 byte int 17 bytes away from the end of the message and cannot surpase 83 minutes for some reason (dogshit game code)

            
            // e.detail.data = array; // Not needed once again
        }
    });


    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['teleportEnemys'] && !toggles['teleportEnemysServer'] && !toggles['spawnBotCook'] && !toggles['spawnBotNormal'] && !toggles['spawnBotShoot']) return;
        let parsed = arrayToHexString(e.detail.data);
        if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00$/i.test(parsed) && /^f3 02 fd 02 f4 03 [A-Za-z0-9]+ f5 17 03 09/i.test(parsed)) { // updatePlayer
            const floatArray = new DataView(e.detail.data);
            let x = floatArray.getFloat32(e.detail.data.byteLength - 36).toFixed(3); // Changed code to not create 3 dataviews for no reason and to not convert it to an array for every single dataview and removed slicing
            let y = floatArray.getFloat32(e.detail.data.byteLength - 40).toFixed(3); // Changed code to not create 3 dataviews for no reason and to not convert it to an array for every single dataview and removed slicing
            let z = floatArray.getFloat32(e.detail.data.byteLength - 44).toFixed(3); // Changed code to not create 3 dataviews for no reason and to not convert it to an array for every single dataview and removed slicing
            window.my_x = x; // This is probably z but i dont care
            window.my_y = y;
            window.my_z = z; // This is probably x but i dont care
            if (toggles['spawnBotCook'] || toggles['spawnBotNormal']) {
                let new_spawn_player = toArray(window.spawn_player);
                let new_id = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
                if (toggles['spawnBotNormal']) {
                    new_id.unshift(30);
                }
                new_spawn_player.set(new_id, new_spawn_player.byteLength - new_id.length);
                let view = new DataView(new_spawn_player.buffer);

                view.setFloat32(new_spawn_player.byteLength - 56, x);
                view.setFloat32(new_spawn_player.byteLength - 60, y);
                view.setFloat32(new_spawn_player.byteLength - 64, z);
                e.detail.this.originalSend(new_spawn_player);
            }
        }
    });

    window.addEventListener('onsocketReceive', (e) => {
        if (!toggles['teleportEnemys'] && !toggles['teleportEnemysServer']) return;
        let data_parsed = {'Uint8Array': new Uint8Array(e.detail.data.data),'string': arrayToString(e.detail.data.data),'hex': arrayToHexString(e.detail.data.data)};
        
        if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00/i.test(data_parsed.hex)) { // updateEnemyPlayer
            if (window.my_x && window.my_y && window.my_z) {
                // let y = new DataView(toArray(e.detail.data.data.slice(e.detail.data.data.byteLength - 43, e.detail.data.data.byteLength - 39)).buffer).getFloat32().toFixed(3); // Get users current y and add some to it in case they're slightly lower than the ground
                
                if (toggles['teleportEnemysServer']) {
                    let ids = data_parsed.hex.match(/0d [A-Za-z0-9]+ [A-Za-z0-9]+/g)
                    if (!ids) return;
                    let new_movement = toArray(window.our_movement.replace('0d ea 03', ids[0]));
                    let view = new DataView(new_movement.buffer);
                    view.setFloat32(new_movement.byteLength - 36, window.my_x);
                    view.setFloat32(new_movement.byteLength - 40, window.my_y + 1);
                    view.setFloat32(new_movement.byteLength - 44, window.my_z);
                    e.detail.this.originalSend(new_movement);
                    return;
                }

                const floatArray = new DataView(data_parsed.Uint8Array.buffer);
                floatArray.setFloat32(e.detail.data.data.byteLength - 47, parseFloat(window.my_z) + 4);
                floatArray.setFloat32(e.detail.data.data.byteLength - 43, parseFloat(window.my_y));
                // floatArray.setFloat32(e.detail.data.data.byteLength - 43, parseFloat(y) + 0.2); // Cant be asked to get my real y so we just use the enemies instead
                floatArray.setFloat32(e.detail.data.data.byteLength - 39, parseFloat(window.my_x) + 1);
                // e.detail.data.data = data_parsed; // Why was this ever a thing ??????? this sets the data to a object that isnt a uint8array which should have been crashing the user this whole time ???????????????
            }
        }
    });


    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['spawnBotShoot']) return;
        let hex_parsed = arrayToHexString(e.detail.data);
        if (hex_parsed.endsWith('0c 01 1e 0c 01') && window.my_x && window.my_y && window.my_z) {
            let new_spawn_player = toArray(window.spawn_player);
            let new_id = [30, Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
            
            new_spawn_player.set(new_id, new_spawn_player.byteLength - new_id.length);
            let view = new DataView(new_spawn_player.buffer);

            view.setFloat32(new_spawn_player.byteLength - 56, window.my_x);
            view.setFloat32(new_spawn_player.byteLength - 60, window.my_y);
            view.setFloat32(new_spawn_player.byteLength - 64, window.my_z);
            e.detail.this.originalSend(new_spawn_player);
        }
    })


    // The only reason this is so far down is so we can get our real x,y,z if teleportEnemys is toggled since i dont want to merge all of these functions into 1 big function blehhhhh
    // This must be above crash player otherwise crash player will not work if invis is toggled
    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['invis']) return;
        let parsed = arrayToHexString(e.detail.data);
        if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00$/i.test(parsed) && /^f3 02 fd 02 f4 03 [A-Za-z0-9]+ f5 17 03 09/i.test(parsed)) {
            let data = toArray(e.detail.data);
            
            // Not needed since i can just move down this function below other things that parse real x,y,z
            // let view = new DataView(data.buffer);
            // window.my_y = view.getFloat32(e.detail.data.byteLength - 40).toFixed(3); // Needed to be able to spawn bots in at the right y
            

            data[e.detail.data.byteLength - 40] = 75; // y player coords are stored as a float (4 bytes) but changing byte 1 and byte 2 to 75, 255 makes the player go so far outside of the map that we dont need to modify the rest of the bytes also they are obscured
            data[e.detail.data.byteLength - 39] = 255;

            
            // e.detail.data = data; // This isnt needed if we are modifying a raw byte array since its updating this variable already
        }
    });

    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['crashPlayers']) return;
        let parsed = arrayToHexString(e.detail.data);
        if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00$/i.test(parsed) && /^f3 02 fd 02 f4 03 [A-Za-z0-9]+ f5 17 03 09/i.test(parsed)) { // updatePlayer
            let data = toArray(e.detail.data);
            
            data.set([255, 255, 255, 255], data.byteLength - 40);
            // e.detail.data = data; // This isnt needed if we are modifying a raw byte array since its updating this variable already
        }
    });

    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['fakeTeam']) return;
        let parsed = arrayToHexString(e.detail.data);
        if (/^f3 02 fc 03 fb 15 01 07 03 5f 70 74 03 [A-Za-z0-9]+ fe 0b [A-Za-z0-9]+ fa 1c$/i.test(parsed)) { // selectTeam
            let data = toArray(e.detail.data);
            data[data.byteLength - 6] = 3; // 6 bytes away from the end of the message is the chosen team always
            // e.detail.data = data; // This isnt needed if we are modifying a raw byte array since its updating this variable already
        }
    });

    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['instakill']) return;
        let data = new toArray(e.detail.data);
        let hex_parsed = arrayToHexString(e.detail.data);
        if (data.byteLength > 60 && !hex_parsed.endsWith('0c 01 1e 0c 01') && /f3 02 fd 02 f4 03 c8 f5 15 04 22 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 03/i.test(hex_parsed) && !(/^f3 02 fd 02 f4 03 c8 f5 15 04 22 0d [0-9a-fA-F]{2} 03 03 02 09/i.test(hex_parsed) || /^f3 02 fd 02 f4 03 c8 f5 15 04 22 [0-9a-fA-F]{2} [0-9a-fA-F]{2} [0-9a-fA-F]{2} [0-9a-fA-F]{2} 03 02 09/i.test(hex_parsed)) && data.byteLength < 100) {
            let to_subtract = {68: 2}[data.byteLength] ?? 3; // Calculate the position of the player damage amount byte (could have probably gotten the position via a signature but this still works so why change it)
            data.set([255], data.byteLength - to_subtract); // Player damage amount byte
            // e.detail.data = data; // This isnt needed if we are modifying a raw byte array since its updating this variable already
            // repeatMessage(e, 20); // If all else fails just repeat the message instead (increases overhead slightly meaning worse performance)
        }
    });


    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['customLobby']) return;
        let parsed = arrayToString(e.detail.data);
        if (parsed.includes('customSqlLobby') && !parsed.includes('characterSkinIndex') && !parsed.includes('!=')) { // badCreateGame refers to the websocket message that contains no match settings and only contains the url
            const new_lobby_name = customLobbyName.value;
            const new_lobby_length = new_lobby_name.length;
            let new_lobby_chars = String.fromCharCode(new_lobby_length);
            if (new_lobby_length >= 128) { // Safety check to stop the user from crashing, all strings can only go to 127 characters (signed) and for some reason you need to specify that its unsigned with an extra 0x01 byte even though the game only uses unsigned arrays on the javascript websocket side of things
                new_lobby_chars = new_lobby_chars + String.fromCharCode(1);
            }
            parsed = parsed.slice(0, 6) + new_lobby_chars + new_lobby_name + parsed.slice(13);
            e.detail.data = toArray(parsed);
        }
    });


    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['customKillPlayer']) return;
        let hex_parsed = arrayToHexString(e.detail.data);
        if ((/^f3 02 fd 03 f7 03 04 f4 03 c8 f5 15 04 22 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 03 02 09/i.test(hex_parsed) || /^f3 02 fd 03 f7 03 04 f4 03 c8 f5 15 04 22 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 03 02 09/i.test(hex_parsed)) && !hex_parsed.endsWith('01') && e.detail.data.byteLength > 35) { // killPlayer
            sendCustomChat(e.detail.this, customKillPlayerMessage.value);
        }
    });


    // Idk what i did but doing this causes the user to instantly die the moment they spawn and also omega cook their game, (perhaps this is a better autokill???????) turns out this actually crashes the user if they dont have an anti crash buuuut if they do have anti crash then their game gets deep fried
    // window.our_movement = 'f3 02 fd 02 f4 03 c9 f5 17 03 09 84 e4 be 8c 09 08 17 07 0d ea 03 1b 08 1e d6 0c c2 2e 23 43 bf 47 4c dc 41 85 00 e9 d6 0c 3e 59 9b 00 bd 3b 4f 60 3e 9a 44 c0 d1 10 3e ee 23 58 00 00 00 00 3f 62 9f d1 00 00 00 00'

    // window.addEventListener('onsocketReceive', (e) => {
    //     let hex_parsed = arrayToHexString(e.detail.data.data);
    //     if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00/i.test(hex_parsed)) {
            
    //         let ids = hex_parsed.match(/0d [A-Za-z0-9]+ [A-Za-z0-9]+/g)
    //         if (!ids) return; // Safety check to stop us from crashing yet again
    //         let data = toArray(e.detail.data.data);
            
    //         const floatArray = new DataView(data.buffer);
    //         let x = floatArray.getFloat32(e.detail.data.byteLength - 39).toFixed(3);
    //         let y = floatArray.getFloat32(e.detail.data.byteLength - 43).toFixed(3);
    //         let z = floatArray.getFloat32(e.detail.data.byteLength - 47).toFixed(3);
            
    //         let new_movement = toArray(window.our_movement.replace('0d ea 03', ids[0]));
            

    //         const newfloatArray = new DataView(new_movement.buffer);
    //         newfloatArray.setFloat32(new_movement.byteLength - 36, parseFloat(x));
    //         newfloatArray.setFloat32(new_movement.byteLength - 40, parseFloat(y));
    //         newfloatArray.setFloat32(new_movement.byteLength - 44, parseFloat(z));

    //         e.detail.this.originalSend(new_movement);
            
            
    //     }
    // })



    // Annoy the user when he moves (jump pads dont have an x y z position in websocket messages and instead are handled in unity so this doesnt do anything really)
    // window.jump_pad = "f3 02 fd 02 f4 03 c8 f5 15 04 22 0d 84 3e 03 02 09 a6 c3 a1 fd 0a 03 05 03 0f 03 04 17 01 1e";

    // window.addEventListener('onsocketReceive', (e) => {
    //     let hex_parsed = arrayToHexString(e.detail.data.data);
    //     if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00/i.test(hex_parsed)) {
            
    //         let ids = hex_parsed.match(/0d [A-Za-z0-9]+ [A-Za-z0-9]+/g)
    //         if (!ids) return; // Safety check to stop us from crashing yet again

            
    //         let new_jumppad = toArray(window.jump_pad.replace('0d 84 3e', ids[0]));


    //         e.detail.this.originalSend(new_jumppad);
    //     }
    // })



    // THIS EXPLOIT ONLY ALLOWS US TO UPDATE THEIR POSITION A SINGULAR TIME PER SPAWN (when they spawn)
    // Work in progress code that force teleports all players if we can find their id (we can also just simply teleport a singular player if we get their checksum)
    window.our_movement = 'f3 02 fd 02 f4 03 c9 f5 17 03 09 84 e4 be 8c 09 08 17 07 0d ea 03 1b 08 1e d6 0c c2 2e 23 43 bf 47 4c dc 41 85 00 e9 d6 0c 3e 59 9b 00 bd 3b 4f 60 3e 9a 44 c0 d1 10 3e ee 23 58 00 00 00 00 3f 62 9f d1 00 00 00 00'


    window.addEventListener('onsocketReceive', (e) => {
        if (!toggles['giveSeizures']) return;
        let hex_parsed = arrayToHexString(e.detail.data.data);
        if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00/i.test(hex_parsed)) {
            
            let ids = hex_parsed.match(/0d [A-Za-z0-9]+ [A-Za-z0-9]+/g)
            if (!ids) return;
            // let id;
            // if (!ids) { // If we dont get an id using a regex then we use a fallback which logs player ids when they spawn and puts them in player_ids array
            //     for (const e of player_ids) {
            //         if (hex_parsed.includes(e)) {
            //             id = e;
            //             break
            //         }
            //     }
            //     if (!id) return; // If the player movement message doesnt contain anyones id then we do nothing, maybe in the future we do some logging here?
            // } else {
            //     id = ids[0];
            // }


            let new_movement = toArray(window.our_movement.replace('0d ea 03', ids[0]));
            // let new_movement = toArray(window.our_movement.replace('0d ea 03', id));
            // let data = toArray(e.detail.data.data);
            
            new_movement[new_movement.byteLength - 40] = 75;

            e.detail.this.originalSend(new_movement);
        }
    })



    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['autoKillSingle'] && !toggles['autoKillAll'] && !toggles['superAutoKillSingle']) return;
        let hex_parsed = arrayToHexString(e.detail.data);
        if ((/^f3 02 fd 03 f7 03 04 f4 03 c8 f5 15 04 22 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 03 02 09/i.test(hex_parsed) || /^f3 02 fd 03 f7 03 04 f4 03 c8 f5 15 04 22 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 03 02 09/i.test(hex_parsed)) && !hex_parsed.endsWith('01') && e.detail.data.byteLength > 35) { // killPlayer
            let ids = hex_parsed.match(/0d [A-Za-z0-9]+/g);
            if (!ids) return; // Apparently not all id's start with 0d but 0d is the most common of them
            // window.myID = ids[0];
            // window.kill_player = hex_parsed; // Save the kill player message since we still dont know how to create our own checksum needed to kill any player, my thought is since the checksum is 4 bytes it gets the current date and time that the user joined the server and uses that for validation in those bytes?
            // Neither of the above code needs to be used anymore since all we need to do is log the users checksum
            window.last_checksum = hex_parsed.slice(hex_parsed.length - 2) // Get the last byte

        }
    });

    window.kill_player = "f3 02 fd 03 f7 03 04 f4 03 c8 f5 15 04 22 0d 39 4a 03 02 09 ac d3 b0 86 09 03 05 03 04 03 04 17 01 0d 6b 42"
    window.spawn_player = "f3 02 fd 03 f7 03 04 f4 03 ca f5 15 06 22 07 06 50 6c 61 79 65 72 03 01 d6 0c c1 fa 01 d5 c0 cd 0e 56 c2 7a 02 b1 03 02 d1 10 3f 67 75 65 80 00 00 00 3e da c0 18 80 00 00 00 03 05 17 05 1e 1e 0b 01 0c 01 06 3d 0a d7 03 ce df 42 41 03 06 09 ef 99 dc c8 0d 03 07 0d 0d 0d"
    window.addEventListener('onsocketReceive', (e) => {
        if (!toggles['autoKillSingle'] && !toggles['autoKillAll'] && !toggles['superAutoKillAll'] && !toggles['superAutoKillSingle']) return;
        let hex_parsed = arrayToHexString(e.detail.data.data);
        if (/00 00 00 00 [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ [A-Za-z0-9]+ 00 00 00 00/i.test(hex_parsed) && window.kill_player) { // Update player (instead of on player update we should do on player spawn to minimize breakage since updatePlayer messages get pretty bad depending on the lobby the user is in)

            if (!/0d [A-Za-z0-9]+ [A-Za-z0-9]+/i.test(hex_parsed)) return; // Test if we can find the user's id so we dont get force disconnected when we send an invalid message that cant be parsed right (will still break very rarely since messages can vary in byte sizes anywhere from 30 bytes to 200 bytes)
            let ids = hex_parsed.match(/0d [A-Za-z0-9]+ [A-Za-z0-9]+/g); // Apparently not all id's start with 0d but 0d is the most common of them

            if (!ids) return;

            // let id;
            // if (!ids) { // If we dont get an id using a regex then we use a fallback which logs player ids when they spawn and puts them in player_ids array
            //     for (const e of player_ids) {
            //         if (hex_parsed.includes(e)) {
            //             id = e;
            //             break
            //         }
            //     }
            //     if (!id) return; // If the player movement message doesnt contain anyones id then we do nothing, maybe in the future we do some logging here?
            // } else {
            //     id = ids[0];
            // }
            // let data = toArray(e.detail.data.data);
            // let checksum = data.slice(18, 19);
            let checksum = ids[0].split(' ')[2] // This is used for autokillSingle and superAutoKillSingle
            

            // let info = getPlayerInfo(e.detail.data.data);
            // if (!info) return;
            // let id = arrayToHexString([info[0], info[1]]);
            // let checksum = info[2]





            // if (toggles['autoKillSingle'] && !window.kill_player.endsWith(arrayToHexString(checksum))) return; // Doing this so we doing have to run redundant javascript when another user that isnt out target user is moving
            // Old code that isnt used now

            if ((toggles['autoKillSingle'] || toggles['superAutoKillSingle']) && window.last_checksum != checksum) return; // Doing this so we doing have to run redundant javascript when another user that isnt out target user is moving
            // if (toggles['autoKillSingle'] && window.last_checksum != checksum) return; // Doing this so we doing have to run redundant javascript when another user that isnt out target user is moving     

            // let kill_player_ids = kill_player.match(/0d [A-Za-z0-9]+/g); // not needed anymore as we are using a hard coded kill player message now
            // if (kill_player_ids.length >) { // Some kill player messages can contain 0d 3 times (1 extra time in its checksum) so we do this to not crash on repeat
            //     kill_player_ids = [kill_player_ids[0], kill_player_ids[kill_player_ids.length - 1]]
            // }
            
            // let new_killed_player = toArray(window.kill_player.replace(kill_player_ids[1], ids[0])); // Replacing the old target player id with the new target player id


            // This new system also allows the user to no longer need to kill someone before activating and shouldnt force the user to refresh when getting a bad killPlayer message (only on autoKillAll)
            // With this new info we can probably change anyones class/position/stats/force disconnect them from lobbies and much more
            // let new_killed_player = toArray(window.kill_player.replace('0d 39', ids[0]).replace('0d 6b', ids[0])); // Replacing the hard coded player id's with the new target player id
            let new_killed_player = toArray(window.kill_player.replace('0d 39 4a', ids[0]).replace('0d 6b 42', ids[0])); // Replacing the hard coded player id's with the new target player id
            // let new_killed_player = toArray(window.kill_player.replace('0d 39 4a', id).replace('0d 6b 42', id)); // Replacing the hard coded player id's with the new target player id

            // let new_killed_player = toArray(window.kill_player.replace('0d 39', id).replace('0d 6b', id)); // Replacing the hard coded player id's with the new target player id
            
            // new_killed_player.set(checksum, 16); // New and improved auto kill system, we no longer need to log our own id/killPlayer messages and can instead go off a hard coded one and making the player "suicide" via this checksum and his own id
            // new_killed_player.set(checksum, new_killed_player.byteLength - 1); // Setting the target user checksum (we can also if we wanted make any player kill other players)


            // Apparently with the player id and checksum we can teleport players to x,y,z by sending a normal updatePlayer message faked as them but i couldnt get it to work more than once

            // if (toggles['autoKillAll']) { // Autokill all users in the lobby if its enabled (not needed anymore since we are doing this in the above code anyways always)
            //     new_killed_player.set(checksum, new_killed_player.byteLength - 1);
            // }

            

            e.detail.this.originalSend(new_killed_player); // Kill the player
            if (toggles['superAutoKillAll'] || toggles['superAutoKillSingle']) {
                let new_spawn_player = toArray(window.spawn_player.replace('0d 0d 0d', ids[0]));
                e.detail.this.originalSend(new_spawn_player); // Respawn the player
            }
            
            // player_ids.pop(id);
            if (toggles['customKillPlayer']) { // Allow a custom message to be sent when auto killing users too
                sendCustomChat(e.detail.this, customKillPlayerMessage.value)
            }

        }
    });


    window.addEventListener('onsocketReceive', (e) => {
        if (!toggles['playerJoined']) return;
        let parsed = {'Uint8Array': new Uint8Array(e.detail.data.data), 'string': arrayToString(e.detail.data.data), 'hex': arrayToHexString(e.detail.data.data)};

        if (parsed.string.includes('weaponSkinIndex') && parsed.hex.includes('03 ff')) { // playerJoined (this includes us because the server echos your own messages in chat for no reason)
            let username_start_bytes = findAllByteSequenceIndices(parsed.hex.split(' '), '03 ff 07');
            let amount_of_players = username_start_bytes.length;
            if (amount_of_players != 1) return; // When you join a lobby it sends us the list of already connected users so we dont want to run any more javascript so we just return (eventually this check wont return and will add into the GUI so the user can see the already connected players via their)
            
            username_start_bytes.forEach((i) => { // Extracting everyones username and sending it in chat
                let username_start_byte = i + 3;
                let username_length = parsed.Uint8Array[username_start_byte];
                let username =  parsed.string.slice(username_start_byte + 1, username_start_byte + 1 + username_length);
                if (username.includes('</color>')) { // Users in clans can have something like <color=#ffffff>[DEV]</color>our_name_here so we remove the clan from the username to get the real username (could probably use regex which would be more reliable if a user created a custom name via mapscripts or websockets)
                    username = username.split('</color>')[1];
                }
                let custom_message = `User: ${username} ${playerJoinedMessage.value}`;
                sendCustomChat(e.detail.this, custom_message);
            })
        }
    })


    // Get self username when joining a game

    window.addEventListener('onsocketSend', (e) => {
        // We have no toggles check because we always want the latest username so the user doesnt have to rejoin a game when they toggle this on for the first time
        let parsed = {'Uint8Array': new Uint8Array(e.detail.data), 'string': arrayToString(e.detail.data), 'hex': arrayToHexString(e.detail.data)};
        if (parsed.string.includes('weaponSkinIndex') && parsed.hex.includes('03 ff')) {
            let username_start_byte = findByteSequenceIndex(parsed.hex.split(' '), '03 ff 07') + 3;
            let username_size = parsed.Uint8Array[username_start_byte];
            let username = parsed.string.slice(username_start_byte + 1, username_start_byte + 1 + username_size);
            window.username = username;
        }
    });


    // Change our username to the new one we specify

    window.addEventListener('onsocketSend', (e) => {
        if (!toggles['customName']) return;
        let parsed = {'Uint8Array': new Uint8Array(e.detail.data), 'string': arrayToString(e.detail.data), 'hex': arrayToHexString(e.detail.data)};
        if (window.username && parsed.string.includes(window.username)) { // Make sure to not modify chat messages since the string length gets set before <color=white>
            let new_username = customNameMessage.value;
            let new_username_length = new_username.length;
            let username_index = parsed.string.indexOf(window.username);
            let new_data;
            if (parsed.string.includes('</color>')) { // We need a special check for chat messages since they have their own included string which starts at byte 13 always
                let new_msg_length = parsed.Uint8Array[13] + new_username_length - window.username.length;
                let new_msg_length_chars = String.fromCharCode(new_msg_length);
                if (new_msg_length >= 128) { // Safety check to stop the user from crashing, all strings can only go to 127 characters (signed) and for some reason you need to specify that its unsigned with an extra 0x01 byte even though the game only uses unsigned arrays on the javascript websocket side of things
                    new_msg_length_chars = new_msg_length_chars + String.fromCharCode(1);
                } 
                new_data = parsed.string.slice(0, 13) + new_msg_length_chars + parsed.string.slice(14, username_index) + new_username + parsed.string.slice(username_index + window.username.length);
            } else {
                let new_username_chars = String.fromCharCode(new_username_length);
                if (new_username_length >= 128) { // Safety check to stop the user from crashing, all strings can only go to 127 characters (signed) and for some reason you need to specify that its unsigned with an extra 0x01 byte even though the game only uses unsigned arrays on the javascript websocket side of things
                    new_username_chars = new_username_chars + String.fromCharCode(1);
                } 
                new_data = parsed.string.slice(0, username_index - 1) + new_username_chars + new_username + parsed.string.slice(username_index + window.username.length);
            }
            e.detail.data = toArray(new_data);
        }
    });


    window.addEventListener('onsocketReceive', (e) => {
        if (!toggles['impersonate']) return;
        let parsed = arrayToString(e.detail.data.data);
        if (/<color.*?<\/color>:.*?/.test(parsed) && ['hack', 'cheat', 'report', 'loser'].some(word => parsed.toLowerCase().includes(word))){
            let user = parsed.match(/<color.*?<\/color>:.*?>/g);
            if (!user) return;
            let messages = ["wtf???", "thats not me", "stop impersonating me", "hacker took over me", "i like dick", "report me please", "im cheating", "send me discord i want to chat", "i use kour helper v1.0", "these FAGGOTS", "kill yourself", "help me", '<- pedo']
            sendCustomChat(e.detail.this, '</color>' + user + messages[Math.floor(Math.random() * messages.length)])
        }
    })


})
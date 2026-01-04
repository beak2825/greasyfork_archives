// ==UserScript==
// @name         Braains.io packet injector/analyzer
// @namespace    braains.io
// @description  John pork is proud
// @version      2.2
// @author       John pork
// @match        https://www.modd.io/play/braainsio/*
// @match        https://www.modd.io/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561219/Braainsio%20packet%20injectoranalyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/561219/Braainsio%20packet%20injectoranalyzer.meta.js
// ==/UserScript==

/*John pork says have fun*/

(function() {
    'use strict';

    let capturing = false;
    let packets = [];
    let packetFolders = {};
    let originalSend = null;
    let selectedPacketIndex = null;
    let analyzerWindow = null;
    let currentView = 'list';
    let selectedFolder = null;
    let customSenderWindow = null;
    let reHookInterval = null;
    let searchFilter = '';
    let directionFilter = 'all';
    let packetHistory = [];
    let autoSpamInterval = null;
    let autoSpamActive = false;

    function getNetwork() {
        return window.taro?.network;
    }

    function startCapture() {
        const network = getNetwork();
        if (!network) return false;

        if (!originalSend) {
            originalSend = network.send.bind(network);
        }

        network.send = function(command, data) {
            if (capturing) capturePacket('outgoing', command, data);
            return originalSend(command, data);
        };

        if (network._networkCommands) {
            const commands = Object.keys(network._networkCommands);
            commands.forEach(command => {
                const originalHandler = network._networkCommands[command];
                if (!originalHandler._hooked) {
                    const wrappedHandler = function(data) {
                        if (capturing) capturePacket('incoming', command, data);
                        return originalHandler.apply(this, arguments);
                    };
                    wrappedHandler._hooked = true;
                    network._networkCommands[command] = wrappedHandler;
                }
            });
        }

        if (network.stream && network.stream.on && !network.stream._captureHooked) {
            const originalOn = network.stream.on.bind(network.stream);
            network.stream.on = function(event, handler) {
                if (event === 'message' || event === 'data') {
                    const wrappedHandler = function(data) {
                        return handler.apply(this, arguments);
                    };
                    return originalOn(event, wrappedHandler);
                }
                return originalOn(event, handler);
            };
            network.stream._captureHooked = true;
        }

        capturing = true;

        if (!reHookInterval) {
            reHookInterval = setInterval(() => {
                if (capturing) {
                    const network = getNetwork();
                    if (network && network._networkCommands) {
                        const commands = Object.keys(network._networkCommands);
                        commands.forEach(command => {
                            const handler = network._networkCommands[command];
                            if (!handler._hooked) {
                                const originalHandler = handler;
                                const wrappedHandler = function(data) {
                                    if (capturing) capturePacket('incoming', command, data);
                                    return originalHandler.apply(this, arguments);
                                };
                                wrappedHandler._hooked = true;
                                network._networkCommands[command] = wrappedHandler;
                            }
                        });
                    }
                }
            }, 5000);
        }

        updateAnalyzerUI();
        return true;
    }

    function stopCapture() {
        capturing = false;
        if (reHookInterval) {
            clearInterval(reHookInterval);
            reHookInterval = null;
        }
        updateAnalyzerUI();
    }

    function capturePacket(direction, command, data) {
        const packet = {
            id: packets.length,
            timestamp: Date.now(),
            direction: direction,
            command: command,
            data: JSON.parse(JSON.stringify(data)),
            size: JSON.stringify(data).length
        };

        packets.push(packet);

        if (!packetFolders[command]) {
            packetFolders[command] = [];
        }
        packetFolders[command].push(packet);

        if (packets.length > 15000) {
            const removed = packets.shift();
            packets.forEach((p, i) => p.id = i);
            if (packetFolders[removed.command]) {
                packetFolders[removed.command] = packetFolders[removed.command].filter(p => p.id !== removed.id);
            }
        }

        updateAnalyzerUI();
    }

    function injectPacket(command, data) {
        const network = getNetwork();
        if (!network || !originalSend) {
            console.log('❌ Network not available');
            return false;
        }

        try {
            console.log(`💉 INJECTING: ${command}`, data);
            originalSend(command, data);
            showNotification(`Injected: ${command}`, '#fff');
            return true;
        } catch (e) {
            console.log('❌ Injection failed:', e.message);
            showNotification('Injection Failed!', '#fff');
            return false;
        }
    }

    function modifyAndInject(packet) {
        const dataStr = prompt(
            `Modify packet data for: ${packet.command}\n\nEdit the JSON below:`,
            JSON.stringify(packet.data, null, 2)
        );

        if (!dataStr) return;

        try {
            const newData = JSON.parse(dataStr);
            injectPacket(packet.command, newData);
        } catch (e) {
            alert('Invalid JSON! Check your syntax.');
        }
    }

    function copyPacketData(packet) {
        const text = JSON.stringify(packet.data, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', '#fff');
        });
    }

    function copyFullPacket(packet) {
        const text = JSON.stringify(packet, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Full packet copied!', '#fff');
        });
    }

    function customInject() {
        createCustomSenderWindow();
    }

    function createCustomSenderWindow() {
        if (customSenderWindow) {
            customSenderWindow.style.display = 'flex';
            return;
        }

        customSenderWindow = document.createElement('div');
        customSenderWindow.style.cssText = `
            position: fixed; top: 100px; right: 50px; width: 500px; height: 650px;
            background: #000; border: 2px solid #fff; border-radius: 0;
            font-family: 'Courier New', monospace; color: #fff; z-index: 99998;
            display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(255,255,255,0.3);
            resize: both; overflow: hidden; min-width: 350px; min-height: 400px;
        `;

        customSenderWindow.innerHTML = `
            <div id="sender-header" style="padding: 12px; background: #111; border-bottom: 2px solid #fff; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                <div style="font-size: 16px; font-weight: bold;">PACKET SENDER</div>
                <button id="sender-close" style="padding: 4px 12px; background: #000; border: 2px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-weight: bold;">X</button>
            </div>

            <div style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: bold;">COMMAND:</label>
                    <input id="sender-command" type="text" placeholder="e.g., buyItem, ping"
                           style="width: 100%; padding: 8px; background: #000; border: 2px solid #fff; border-radius: 0; color: #fff; font-family: 'Courier New', monospace; font-size: 13px;">
                </div>

                <div style="flex: 1; display: flex; flex-direction: column;">
                    <label style="margin-bottom: 5px; font-size: 12px; font-weight: bold;">DATA (JSON):</label>
                    <textarea id="sender-data" placeholder='{"itemId": "6T5fWSolir"}'
                              style="flex: 1; padding: 10px; background: #000; border: 2px solid #fff; border-radius: 0; color: #fff; font-family: 'Courier New', monospace; font-size: 12px; resize: none;"></textarea>
                </div>

                <div style="display: flex; gap: 10px; align-items: center; padding: 8px; background: #111; border-radius: 0;">
                    <label style="font-size: 11px; font-weight: bold;">AUTO-SPAM:</label>
                    <input id="spam-delay" type="number" value="25" min="25" max="10000" step="5"
                           style="width: 80px; padding: 4px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; font-size: 11px;">
                    <span style="font-size: 10px; color: #999;">ms</span>
                    <button id="spam-toggle" style="padding: 4px 12px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 11px; font-weight: bold;">START SPAM</button>
                </div>

                <div style="font-size: 11px;">
                    <div style="margin-bottom: 5px; font-weight: bold;">TEMPLATES:</div>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button onclick="window.loadTemplate('buyItem')" style="padding: 4px 10px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 10px;">Buy Item</button>
                        <button onclick="window.loadTemplate('ping')" style="padding: 4px 10px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 10px;">Ping</button>
                        <button onclick="window.loadTemplate('chat')" style="padding: 4px 10px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 10px;">Chat</button>
                        <button onclick="window.loadTemplate('keyDown')" style="padding: 4px 10px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 10px;">Key Down</button>
                        <button onclick="window.loadTemplate('keyUp')" style="padding: 4px 10px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 10px;">Key Up</button>
                        <button onclick="window.loadTemplate('empty')" style="padding: 4px 10px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 10px;">Empty</button>
                    </div>
                </div>

                <button id="sender-send" style="padding: 12px; background: #111; border: 2px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-weight: bold; font-size: 14px;">SEND PACKET</button>

                <div style="font-size: 11px;">
                    <div style="margin-bottom: 5px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                        <span>HISTORY (Last 5):</span>
                        <button onclick="window.clearHistory()" style="padding: 2px 8px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 9px;">CLEAR</button>
                    </div>
                    <div id="packet-history" style="display: flex; flex-direction: column; gap: 3px; max-height: 100px; overflow-y: auto;">
                        <div style="color: #666; font-size: 10px; padding: 5px;">No history yet</div>
                    </div>
                </div>

                <div id="sender-status" style="font-size: 11px; color: #999; text-align: center; min-height: 20px;"></div>
            </div>
        `;

        document.body.appendChild(customSenderWindow);
        makeDraggable(customSenderWindow, document.getElementById('sender-header'));

        document.getElementById('sender-close').addEventListener('click', () => {
            customSenderWindow.style.display = 'none';
            if (autoSpamActive) toggleAutoSpam();
        });

        document.getElementById('sender-send').addEventListener('click', sendCustomPacket);
        document.getElementById('spam-toggle').addEventListener('click', toggleAutoSpam);

        document.getElementById('sender-data').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                sendCustomPacket();
            }
        });

        document.getElementById('sender-command').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendCustomPacket();
            }
        });

        updateHistoryUI();
    }

    function sendCustomPacket() {
        const command = document.getElementById('sender-command').value.trim();
        const dataStr = document.getElementById('sender-data').value.trim();
        const status = document.getElementById('sender-status');

        if (!command) {
            status.style.color = '#fff';
            status.textContent = 'Command is required!';
            return;
        }

        if (!dataStr) {
            status.style.color = '#fff';
            status.textContent = 'Data is required!';
            return;
        }

        try {
            const data = JSON.parse(dataStr);
            const success = injectPacket(command, data);

            if (success) {
                status.style.color = '#fff';
                status.textContent = `Sent: ${command}`;
                addToHistory(command, data);
                setTimeout(() => status.textContent = '', 3000);
            } else {
                status.style.color = '#fff';
                status.textContent = 'Failed to send packet';
            }
        } catch (e) {
            status.style.color = '#fff';
            status.textContent = 'Invalid JSON: ' + e.message;
        }
    }

    function addToHistory(command, data) {
        packetHistory.unshift({ command, data, timestamp: Date.now() });
        if (packetHistory.length > 5) packetHistory.pop();
        updateHistoryUI();
    }

    function updateHistoryUI() {
        const historyDiv = document.getElementById('packet-history');
        if (!historyDiv) return;

        if (packetHistory.length === 0) {
            historyDiv.innerHTML = '<div style="color: #666; font-size: 10px; padding: 5px;">No history yet</div>';
            return;
        }

        historyDiv.innerHTML = packetHistory.map((item, index) => {
            const timeAgo = Math.floor((Date.now() - item.timestamp) / 1000);
            return `
                <div onclick="window.loadFromHistory(${index})"
                     style="padding: 5px; background: #111; border: 1px solid #fff; border-radius: 0; cursor: pointer; font-size: 10px;"
                     onmouseover="this.style.background='#222'"
                     onmouseout="this.style.background='#111'">
                    <div style="font-weight: bold;">${item.command}</div>
                    <div style="color: #999;">${timeAgo}s ago</div>
                </div>
            `;
        }).join('');
    }

    window.loadFromHistory = function(index) {
        const item = packetHistory[index];
        if (!item) return;
        document.getElementById('sender-command').value = item.command;
        document.getElementById('sender-data').value = JSON.stringify(item.data, null, 2);
        showNotification('Loaded from history!', '#fff');
    };

    window.clearHistory = function() {
        if (confirm('Clear packet history?')) {
            packetHistory = [];
            updateHistoryUI();
            showNotification('History cleared!', '#fff');
        }
    };

    function toggleAutoSpam() {
        const btn = document.getElementById('spam-toggle');
        const delayInput = document.getElementById('spam-delay');

        if (autoSpamActive) {
            if (autoSpamInterval) {
                clearInterval(autoSpamInterval);
                autoSpamInterval = null;
            }
            autoSpamActive = false;
            btn.textContent = 'START SPAM';
            btn.style.background = '#000';
            showNotification('Auto-spam stopped', '#fff');
        } else {
            const delay = Math.max(25, parseInt(delayInput.value) || 25);
            const command = document.getElementById('sender-command').value.trim();
            const dataStr = document.getElementById('sender-data').value.trim();

            if (!command || !dataStr) {
                alert('Enter command and data before starting spam!');
                return;
            }

            try {
                const data = JSON.parse(dataStr);
                autoSpamActive = true;
                btn.textContent = 'STOP SPAM';
                btn.style.background = '#333';

                let count = 0;
                autoSpamInterval = setInterval(() => {
                    injectPacket(command, data);
                    count++;
                    document.getElementById('sender-status').textContent = `Spammed ${count}x`;
                }, delay);

                showNotification(`Auto-spam started (${delay}ms)`, '#fff');
            } catch (e) {
                alert('Invalid JSON! Fix data before spamming.');
            }
        }
    }

    window.loadTemplate = function(type) {
        const commandInput = document.getElementById('sender-command');
        const dataInput = document.getElementById('sender-data');

        const templates = {
            buyItem: { command: 'buyItem', data: '{\n  "itemId": "6T5fWSolir"\n}' },
            ping: { command: 'ping', data: '{\n  "sentAt": ' + Date.now() + '\n}' },
            chat: { command: 'taroChatMsg', data: '{\n  "text": "Hello!",\n  "roomId": "1"\n}' },
            keyDown: { command: 'playerKeyDown', data: '{\n  "device": "key",\n  "key": "w"\n}' },
            keyUp: { command: 'playerKeyUp', data: '{\n  "device": "key",\n  "key": "w"\n}' },
            empty: { command: '', data: '{}' }
        };

        const template = templates[type];
        if (template) {
            commandInput.value = template.command;
            dataInput.value = template.data;
        }
    };

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function createAnalyzerWindow() {
        if (analyzerWindow) analyzerWindow.remove();

        analyzerWindow = document.createElement('div');
        analyzerWindow.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 95vw; max-width: 1400px; height: 90vh; background: #000;
            border: 2px solid #fff; border-radius: 0; font-family: 'Courier New', monospace;
            color: #fff; z-index: 99999; display: flex; flex-direction: column;
            box-shadow: 0 0 30px rgba(255,255,255,0.5);
        `;

        analyzerWindow.innerHTML = `
            <div style="padding: 15px; background: #111; border-bottom: 2px solid #fff; display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 22px; font-weight: bold;">PACKET INJECTOR</div>
                <div style="display: flex; gap: 10px;">
                    <button id="btn-capture" style="padding: 8px 20px; background: #000; border: 2px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-weight: bold;">START</button>
                    <button id="btn-clear" style="padding: 8px 20px; background: #000; border: 2px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-weight: bold;">CLEAR</button>
                    <button id="btn-inject" style="padding: 8px 20px; background: #000; border: 2px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-weight: bold;">INJECT</button>
                    <button id="btn-close" style="padding: 8px 20px; background: #000; border: 2px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-weight: bold;">CLOSE</button>
                </div>
            </div>

            <div style="padding: 10px; background: #0a0a0a; border-bottom: 1px solid #fff; display: flex; gap: 15px; align-items: center; font-size: 12px; flex-wrap: wrap;">
                <button id="btn-view-list" style="padding: 5px 15px; background: #222; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer;">LIST</button>
                <button id="btn-view-folders" style="padding: 5px 15px; background: #000; border: 1px solid #666; color: #666; border-radius: 0; cursor: pointer;">FOLDERS</button>

                <div style="display: flex; gap: 5px; align-items: center;">
                    <input id="search-input" type="text" placeholder="Search packets..."
                           style="padding: 5px 10px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; font-family: 'Courier New', monospace; font-size: 11px; width: 200px;">
                    <button id="btn-clear-search" style="padding: 5px 8px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 10px; display: none;">X</button>
                </div>

                <select id="direction-filter" style="padding: 5px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; font-family: 'Courier New', monospace; font-size: 11px;">
                    <option value="all">All</option>
                    <option value="outgoing">Out</option>
                    <option value="incoming">In</option>
                </select>

                <button id="btn-export" style="padding: 5px 12px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 11px;">EXPORT</button>
                <button id="btn-import" style="padding: 5px 12px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 11px;">IMPORT</button>

                <div style="flex: 1;"></div>
                <div id="capture-indicator" style="display: none; font-size: 11px; color: #fff; font-weight: bold; animation: blink 1s infinite;">CAPTURING</div>
                <div id="packet-stats" style="font-size: 12px; color: #fff; font-weight: bold;">
                    Total: <span id="stat-total">0</span> |
                    Out: <span id="stat-out">0</span> |
                    In: <span id="stat-in">0</span> |
                    Folders: <span id="stat-folders">0</span>
                </div>
            </div>

            <style>
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.3; }
                }
            </style>

            <div style="flex: 1; display: flex; overflow: hidden;">
                <div id="left-panel" style="width: 300px; border-right: 2px solid #fff; background: #0a0a0a; overflow-y: auto;"></div>

                <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
                    <div id="packet-list" style="flex: 1; overflow-y: auto;">
                        <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                            <thead style="position: sticky; top: 0; background: #111; z-index: 1;">
                                <tr style="border-bottom: 2px solid #fff;">
                                    <th style="padding: 8px; text-align: left; width: 50px;">#</th>
                                    <th style="padding: 8px; text-align: left; width: 100px;">Time</th>
                                    <th style="padding: 8px; text-align: left; width: 60px;">Dir</th>
                                    <th style="padding: 8px; text-align: left;">Command</th>
                                    <th style="padding: 8px; text-align: right; width: 70px;">Size</th>
                                </tr>
                            </thead>
                            <tbody id="packet-tbody">
                                <tr><td colspan="5" style="padding: 20px; text-align: center; color: #666;">No packets captured</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="packet-details" style="width: 450px; border-left: 2px solid #fff; overflow-y: auto; padding: 15px; background: #0a0a0a;">
                    <div style="color: #666; text-align: center; margin-top: 50px;">Select a packet to view details</div>
                </div>
            </div>

            <div style="padding: 10px; background: #0a0a0a; border-top: 2px solid #fff; font-size: 10px; color: #999;">
                Shortcuts: Shift+F12 = Toggle | Ctrl+Shift+I = Sender | Ctrl+Shift+C = Capture | Ctrl+Shift+E = Export
            </div>
        `;

        document.body.appendChild(analyzerWindow);

        document.getElementById('btn-capture').addEventListener('click', toggleCapture);
        document.getElementById('btn-clear').addEventListener('click', clearPackets);
        document.getElementById('btn-inject').addEventListener('click', customInject);
        document.getElementById('btn-close').addEventListener('click', () => { analyzerWindow.style.display = 'none'; });
        document.getElementById('btn-view-list').addEventListener('click', () => switchView('list'));
        document.getElementById('btn-view-folders').addEventListener('click', () => switchView('folders'));

        document.getElementById('search-input').addEventListener('input', (e) => {
            searchFilter = e.target.value.toLowerCase();
            document.getElementById('btn-clear-search').style.display = searchFilter ? 'block' : 'none';
            updateAnalyzerUI();
        });

        document.getElementById('btn-clear-search').addEventListener('click', () => {
            document.getElementById('search-input').value = '';
            searchFilter = '';
            document.getElementById('btn-clear-search').style.display = 'none';
            updateAnalyzerUI();
        });

        document.getElementById('direction-filter').addEventListener('change', (e) => {
            directionFilter = e.target.value;
            updateAnalyzerUI();
        });

        document.getElementById('btn-export').addEventListener('click', exportPackets);
        document.getElementById('btn-import').addEventListener('click', importPackets);

        updateAnalyzerUI();
    }

    function switchView(view) {
        currentView = view;
        selectedFolder = null;

        const listBtn = document.getElementById('btn-view-list');
        const folderBtn = document.getElementById('btn-view-folders');

        if (view === 'list') {
            listBtn.style.background = '#222';
            listBtn.style.borderColor = '#fff';
            listBtn.style.color = '#fff';
            folderBtn.style.background = '#000';
            folderBtn.style.borderColor = '#666';
            folderBtn.style.color = '#666';
        } else {
            folderBtn.style.background = '#222';
            folderBtn.style.borderColor = '#fff';
            folderBtn.style.color = '#fff';
            listBtn.style.background = '#000';
            listBtn.style.borderColor = '#666';
            listBtn.style.color = '#666';
        }

        updateAnalyzerUI();
    }

    function updateAnalyzerUI() {
        if (!analyzerWindow) return;
        updateStats();
        updateLeftPanel();
        updatePacketList();
    }

    function updateStats() {
        const outgoing = packets.filter(p => p.direction === 'outgoing').length;
        const incoming = packets.filter(p => p.direction === 'incoming').length;
        const folderCount = Object.keys(packetFolders).length;

        document.getElementById('stat-total').textContent = packets.length;
        document.getElementById('stat-out').textContent = outgoing;
        document.getElementById('stat-in').textContent = incoming;
        document.getElementById('stat-folders').textContent = folderCount;

        const captureBtn = document.getElementById('btn-capture');
        const captureIndicator = document.getElementById('capture-indicator');

        if (capturing) {
            captureBtn.textContent = 'STOP';
            captureBtn.style.background = '#222';
            if (captureIndicator) captureIndicator.style.display = 'block';
        } else {
            captureBtn.textContent = 'START';
            captureBtn.style.background = '#000';
            if (captureIndicator) captureIndicator.style.display = 'none';
        }
    }

    function updateLeftPanel() {
        const leftPanel = document.getElementById('left-panel');

        if (currentView === 'folders') {
            const folders = Object.keys(packetFolders).sort();

            leftPanel.innerHTML = `
                <div style="padding: 10px; border-bottom: 1px solid #fff; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                    <span>PACKET FOLDERS</span>
                    <button onclick="window.copyAllFolders()" style="padding: 3px 8px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 10px; font-weight: bold;">COPY ALL</button>
                </div>
                ${folders.map(folder => {
                    const count = packetFolders[folder].length;
                    const isSelected = selectedFolder === folder;
                    const bgColor = isSelected ? '#222' : 'transparent';

                    return `
                        <div style="padding: 10px; border-bottom: 1px solid #333; background: ${bgColor}; transition: background 0.2s; display: flex; justify-content: space-between; align-items: center;">
                            <div onclick="window.selectFolder('${folder}')" style="flex: 1; cursor: pointer;">
                                <div style="font-size: 12px; font-weight: bold;">${folder}</div>
                                <div style="font-size: 10px; color: #999;">${count} packets</div>
                            </div>
                            <button onclick="event.stopPropagation(); window.copyFolder('${folder}')" style="padding: 4px 8px; background: #000; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 9px; font-weight: bold;">COPY</button>
                        </div>
                    `;
                }).join('')}
            `;
        } else {
            leftPanel.innerHTML = `
                <div style="padding: 10px; border-bottom: 1px solid #fff; font-weight: bold;">ALL PACKETS</div>
                <div style="padding: 10px; color: #666; font-size: 11px;">
                    Showing all captured packets in chronological order. Switch to Folder View to organize by command type.
                </div>
            `;
        }
    }

    function updatePacketList() {
        const tbody = document.getElementById('packet-tbody');

        let displayPackets = [];
        if (currentView === 'folders' && selectedFolder) {
            displayPackets = packetFolders[selectedFolder] || [];
        } else {
            displayPackets = packets;
        }

        if (directionFilter !== 'all') {
            displayPackets = displayPackets.filter(p => p.direction === directionFilter);
        }

        if (searchFilter) {
            displayPackets = displayPackets.filter(p => {
                const commandMatch = p.command.toLowerCase().includes(searchFilter);
                const dataMatch = JSON.stringify(p.data).toLowerCase().includes(searchFilter);
                return commandMatch || dataMatch;
            });
        }

        if (displayPackets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #666;">No packets match filters</td></tr>';
            return;
        }

        tbody.innerHTML = displayPackets.slice(-200).reverse().map(p => {
            const time = new Date(p.timestamp).toLocaleTimeString() + '.' + (p.timestamp % 1000);
            const dirColor = p.direction === 'outgoing' ? '#fff' : '#fff';
            const selected = selectedPacketIndex === p.id ? 'background: #222;' : '';
            const sizeWarning = p.size > 1000 ? 'color: #fff; font-weight: bold;' : '';

            return `
                <tr style="border-bottom: 1px solid #333; cursor: pointer; ${selected}"
                    onclick="window.selectPacket(${p.id})"
                    onmouseover="this.style.background='#111'"
                    onmouseout="this.style.background='${selected ? '#222' : 'transparent'}'">
                    <td style="padding: 6px;">${p.id}</td>
                    <td style="padding: 6px; font-size: 9px;">${time}</td>
                    <td style="padding: 6px; color: ${dirColor}; font-weight: bold;">${p.direction === 'outgoing' ? 'OUT' : 'IN'}</td>
                    <td style="padding: 6px;">${p.command}</td>
                    <td style="padding: 6px; text-align: right; font-size: 9px; ${sizeWarning}">${p.size > 1000 ? '! ' : ''}${p.size}B</td>
                </tr>
            `;
        }).join('');
    }

    window.selectFolder = function(folder) {
        selectedFolder = folder;
        updateAnalyzerUI();
    };

    window.copyAllFolders = function() {
        const allData = {};
        const folders = Object.keys(packetFolders).sort();

        folders.forEach(folder => {
            allData[folder] = packetFolders[folder].map(p => ({
                id: p.id, timestamp: p.timestamp, direction: p.direction,
                command: p.command, data: p.data, size: p.size
            }));
        });

        const text = JSON.stringify(allData, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            showNotification(`Copied ${folders.length} folders with ${packets.length} packets!`, '#fff');
        }).catch(() => {
            showNotification('Failed to copy!', '#fff');
        });
    };

    window.copyFolder = function(folder) {
        if (!packetFolders[folder]) return;

        const folderData = packetFolders[folder].map(p => ({
            id: p.id, timestamp: p.timestamp, direction: p.direction,
            command: p.command, data: p.data, size: p.size
        }));

        const text = JSON.stringify(folderData, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            showNotification(`Copied ${folderData.length} packets from "${folder}"`, '#fff');
        }).catch(() => {
            showNotification('Failed to copy!', '#fff');
        });
    };

    window.selectPacket = function(packetId) {
        const packet = packets.find(p => p.id === packetId);
        if (!packet) return;

        selectedPacketIndex = packetId;
        const details = document.getElementById('packet-details');

        const dirText = packet.direction === 'outgoing' ? 'OUTGOING' : 'INCOMING';

        details.innerHTML = `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #fff;">
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
                    ${dirText}: ${packet.command}
                </div>
                <div style="font-size: 10px; color: #999;">
                    ID: ${packet.id} | Time: ${new Date(packet.timestamp).toISOString()}<br>
                    Size: ${packet.size} bytes | Direction: ${packet.direction}
                </div>
            </div>

            <div style="margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 8px;">
                <button onclick="window.modifyPacket(${packet.id})" style="padding: 8px 15px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 11px; font-weight: bold;">MODIFY & INJECT</button>
                <button onclick="window.replayPacket(${packet.id})" style="padding: 8px 15px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 11px; font-weight: bold;">REPLAY AS-IS</button>
                <button onclick="window.loadToSender(${packet.id})" style="padding: 8px 15px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 11px; font-weight: bold;">LOAD TO SENDER</button>
                <button onclick="window.copyData(${packet.id})" style="padding: 8px 15px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 11px; font-weight: bold;">COPY DATA</button>
                <button onclick="window.copyFull(${packet.id})" style="padding: 8px 15px; background: #111; border: 1px solid #fff; color: #fff; border-radius: 0; cursor: pointer; font-size: 11px; font-weight: bold;">COPY ALL</button>
            </div>

            <div>
                <div style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">PACKET DATA:</div>
                <pre id="packet-data-display" style="background: #000; padding: 12px; border-radius: 0; overflow-x: auto; font-size: 10px; color: #fff; max-height: 400px; overflow-y: auto; border: 1px solid #fff; cursor: text; user-select: text;">${JSON.stringify(packet.data, null, 2)}</pre>
            </div>
        `;

        updateAnalyzerUI();
    };

    window.modifyPacket = function(packetId) {
        const packet = packets.find(p => p.id === packetId);
        if (packet) modifyAndInject(packet);
    };

    window.replayPacket = function(packetId) {
        const packet = packets.find(p => p.id === packetId);
        if (packet) injectPacket(packet.command, packet.data);
    };

    window.copyData = function(packetId) {
        const packet = packets.find(p => p.id === packetId);
        if (packet) copyPacketData(packet);
    };

    window.copyFull = function(packetId) {
        const packet = packets.find(p => p.id === packetId);
        if (packet) copyFullPacket(packet);
    };

    window.loadToSender = function(packetId) {
        const packet = packets.find(p => p.id === packetId);
        if (!packet) return;

        if (!customSenderWindow) {
            createCustomSenderWindow();
        } else {
            customSenderWindow.style.display = 'flex';
        }

        setTimeout(() => {
            document.getElementById('sender-command').value = packet.command;
            document.getElementById('sender-data').value = JSON.stringify(packet.data, null, 2);
            showNotification('Loaded to sender!', '#fff');
        }, 100);
    };

    function toggleCapture() {
        if (capturing) {
            stopCapture();
        } else {
            startCapture();
        }
    }

    function clearPackets() {
        if (confirm('Clear all captured packets?')) {
            packets = [];
            packetFolders = {};
            selectedPacketIndex = null;
            selectedFolder = null;
            updateAnalyzerUI();
        }
    }

    function exportPackets() {
        const exportData = {
            exportDate: new Date().toISOString(),
            totalPackets: packets.length,
            packets: packets,
            folders: packetFolders
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `packets_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(`Exported ${packets.length} packets!`, '#fff');
    }

    function importPackets() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importData = JSON.parse(event.target.result);

                    if (confirm(`Import ${importData.totalPackets} packets? This will ADD to existing packets.`)) {
                        const startId = packets.length;
                        importData.packets.forEach((p, i) => {
                            const newPacket = { ...p, id: startId + i };
                            packets.push(newPacket);

                            if (!packetFolders[p.command]) {
                                packetFolders[p.command] = [];
                            }
                            packetFolders[p.command].push(newPacket);
                        });

                        updateAnalyzerUI();
                        showNotification(`Imported ${importData.totalPackets} packets!`, '#fff');
                    }
                } catch (err) {
                    alert('Failed to import: Invalid JSON file');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    function showNotification(text, color) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #000; color: ${color}; padding: 15px 30px; border-radius: 0;
            font-family: Arial, sans-serif; font-size: 18px; font-weight: bold;
            z-index: 999999; border: 2px solid ${color}; box-shadow: 0 0 20px ${color};
            pointer-events: none;
        `;
        notification.textContent = text;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' && e.shiftKey) {
            e.preventDefault();
            if (!analyzerWindow || analyzerWindow.style.display === 'none') {
                createAnalyzerWindow();
                analyzerWindow.style.display = 'flex';
            } else {
                analyzerWindow.style.display = 'none';
            }
        }

        if (e.key === 'I' && e.ctrlKey && e.shiftKey) {
            e.preventDefault();
            if (!customSenderWindow) {
                createCustomSenderWindow();
            } else {
                customSenderWindow.style.display = customSenderWindow.style.display === 'none' ? 'flex' : 'none';
            }
        }

        if (e.key === 'C' && e.ctrlKey && e.shiftKey) {
            e.preventDefault();
            if (capturing) {
                stopCapture();
            } else {
                startCapture();
            }
        }

        if (e.key === 'E' && e.ctrlKey && e.shiftKey) {
            e.preventDefault();
            if (packets.length > 0) {
                exportPackets();
            }
        }
    });

    const toggleBtn = document.createElement('div');
    toggleBtn.style.cssText = `
        position: fixed; bottom: 20px; left: 20px; background: #fff; color: #000;
        padding: 12px 25px; border-radius: 0; font-family: monospace; font-weight: bold;
        font-size: 16px; cursor: pointer; z-index: 9997; box-shadow: 0 0 20px rgba(255,255,255,0.5);
        user-select: none; border: 2px solid #000;
    `;
    toggleBtn.textContent = 'INJECTOR';
    toggleBtn.addEventListener('click', () => {
        if (!analyzerWindow) {
            createAnalyzerWindow();
        } else {
            analyzerWindow.style.display = analyzerWindow.style.display === 'none' ? 'flex' : 'none';
        }
    });
    document.body.appendChild(toggleBtn);
})();
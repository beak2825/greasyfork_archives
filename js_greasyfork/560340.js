// ==UserScript==
// @name Zlap.io Bot Hack v1.2
// @namespace http://tampermonkey.net/
// @version 1.2
// @description Up to 4 bots with WASD + Space mirroring, automated funneling with directions, and custom names. Saves settings. Includes Player Mode and custom delays.
// @author Ech0
// @license MIT
// @match https://www.zlap.io/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/560340/Zlapio%20Bot%20Hack%20v12.user.js
// @updateURL https://update.greasyfork.org/scripts/560340/Zlapio%20Bot%20Hack%20v12.meta.js
// ==/UserScript==
(function() {
'use strict';

// --- Global State ---
let isBotConnecting = false; // Flag to distinguish bot sockets from game sockets
const MAX_BOTS = 4;
const DEFAULT_SPAWN = 4;
const BOT_ATTACK_INTERVAL_MS = 2500;
const OPCODES = {
    PLAY: 0,
    DIRECTION: 1,
    MOVE_UP: 2,
    MOVE_DOWN: 3,
    MOVE_LEFT: 4,
    MOVE_RIGHT: 5,
    STOP_MOVE_UP: 6,
    STOP_MOVE_DOWN: 7,
    STOP_MOVE_LEFT: 8,
    STOP_MOVE_RIGHT: 9,
};

// Configuration for Funnel Directions
const FUNNEL_CONFIG = {
    "WestBottom": { label: "WestBottom (Hold A, Toggle S)", hold: "moveLeft", toggle: "moveDown" },
    "West":       { label: "West (Hold A Only)", hold: "moveLeft", toggle: null },
    "WestTop":    { label: "WestTop (Hold A, Toggle W)", hold: "moveLeft", toggle: "moveUp" },

    "NorthLeft":  { label: "NorthLeft (Hold W, Toggle A)", hold: "moveUp", toggle: "moveLeft" },
    "North":      { label: "North (Hold W Only)", hold: "moveUp", toggle: null },
    "NorthRight": { label: "NorthRight (Hold W, Toggle D)", hold: "moveUp", toggle: "moveRight" },

    "EastTop":    { label: "EastTop (Hold D, Toggle W)", hold: "moveRight", toggle: "moveUp" },
    "East":       { label: "East (Hold D Only)", hold: "moveRight", toggle: null },
    "EastBottom": { label: "EastBottom (Hold D, Toggle S)", hold: "moveRight", toggle: "moveDown" },

    "SouthRight": { label: "SouthRight (Hold S, Toggle D)", hold: "moveDown", toggle: "moveRight" },
    "South":      { label: "South (Hold S Only)", hold: "moveDown", toggle: null },
    "SouthLeft":  { label: "SouthLeft (Hold S, Toggle A)", hold: "moveDown", toggle: "moveLeft" }
};

const BOT_SKIN = 0;

// --- Settings Management ---
const Settings = {
    botNames: ["Bot 1", "Bot 2", "Bot 3", "Bot 4"],
    mirrorKeys: false,
    funnelActive: false,
    funnelDirection: "WestBottom",
    funnelDelay: 100, // Default 100ms
    playerMode: false, // Player acts as bot

    load() {
        // Load Names
        for(let i=0; i<4; i++) {
            const savedName = localStorage.getItem(`zlap_bot_name_${i}`);
            if (savedName !== null) this.botNames[i] = savedName;
        }
        // Legacy support
        const oldName = localStorage.getItem("zlap_bot_name");
        if (oldName && !localStorage.getItem("zlap_bot_name_0")) {
            this.botNames[0] = oldName;
        }

        const savedMirror = localStorage.getItem("zlap_mirror");
        if (savedMirror !== null) this.mirrorKeys = (savedMirror === "true");

        const savedFunnelActive = localStorage.getItem("zlap_funnel_active");
        if (savedFunnelActive !== null) this.funnelActive = (savedFunnelActive === "true");

        const savedFunnelDir = localStorage.getItem("zlap_funnel_dir");
        if (savedFunnelDir !== null && FUNNEL_CONFIG[savedFunnelDir]) {
            this.funnelDirection = savedFunnelDir;
        }

        const savedDelay = localStorage.getItem("zlap_funnel_delay");
        if (savedDelay !== null) this.funnelDelay = parseInt(savedDelay, 10);

        const savedPlayerMode = localStorage.getItem("zlap_player_mode");
        if (savedPlayerMode !== null) this.playerMode = (savedPlayerMode === "true");
    },

    save() {
        for(let i=0; i<4; i++) {
            localStorage.setItem(`zlap_bot_name_${i}`, this.botNames[i]);
        }
        localStorage.setItem("zlap_mirror", this.mirrorKeys);
        localStorage.setItem("zlap_funnel_active", this.funnelActive);
        localStorage.setItem("zlap_funnel_dir", this.funnelDirection);
        localStorage.setItem("zlap_funnel_delay", this.funnelDelay);
        localStorage.setItem("zlap_player_mode", this.playerMode);
    }
};

Settings.load();

// --- WebSocket Hook ---
let mainPlayerSocket = null;
const NativeWebSocket = window.WebSocket;

// Override the WebSocket constructor to capture the main player's socket
window.WebSocket = function(...args) {
    const ws = new NativeWebSocket(...args);

    // Only capture if this is NOT a bot connection initiated by our script
    if (!isBotConnecting) {
        // Basic check to ensure it's likely a game socket
        if (args[0] && typeof args[0] === 'string' && (args[0].includes("zlap.") || args[0].includes("amazonlightsail"))) {
            mainPlayerSocket = ws;
            BotManager.attachMainPlayer(ws);
        }
    }
    return ws;
};

// CRITICAL: Restore static properties so the game logic (checking WebSocket.OPEN etc.) doesn't break
for (const key in NativeWebSocket) {
    window.WebSocket[key] = NativeWebSocket[key];
}
window.WebSocket.prototype = NativeWebSocket.prototype;

// Ensure standard constants exist (some browsers/environments might miss them in the loop)
window.WebSocket.CONNECTING = 0;
window.WebSocket.OPEN = 1;
window.WebSocket.CLOSING = 2;
window.WebSocket.CLOSED = 3;


class PacketBuilder {
    constructor() {
        this._data = [];
        this._buffer = new ArrayBuffer(8);
        this._u8 = new Uint8Array(this._buffer);
        this._u16 = new Uint16Array(this._buffer);
        this._u32 = new Uint32Array(this._buffer);
        this._i8 = new Int8Array(this._buffer);
        this._i16 = new Int16Array(this._buffer);
        this._i32 = new Int32Array(this._buffer);
        this._f32 = new Float32Array(this._buffer);
    }

    _write(value, view, bytes) {
        view[0] = value;
        for (let i = bytes - 1; i >= 0; i--) {
            this._data.push(this._u8[i]);
        }
    }

    u8(v) { this._data.push(v & 0xFF); }
    string(str) {
        for (let i = 0; i < str.length; i++) {
            this.u8(str.charCodeAt(i) & 0xFF);
        }
        this.u8(0);
    }
    done() {
        const out = new Uint8Array(this._data);
        this._data = [];
        return out;
    }
}

// Wrapper for the main player's socket to allow bot-like control
class PlayerWrapper {
    constructor(ws) {
        this.ws = ws;
        this.isMainPlayer = true;
        this._respawnTimer = null;
        this._setupAutoRespawn();
    }

    _setupAutoRespawn() {
        if (this._respawnTimer) clearInterval(this._respawnTimer);
        this._respawnTimer = setInterval(() => {
            // Auto-swing / Auto-respawn logic if Player Mode is enabled
            if (Settings.playerMode && this.ws.readyState === WebSocket.OPEN) {
                this.sendPlay();
            }
        }, BOT_ATTACK_INTERVAL_MS);
    }

    sendPlay() { this._send(OPCODES.PLAY); }
    moveUp(on) { this._send(on ? OPCODES.MOVE_UP : OPCODES.STOP_MOVE_UP); }
    moveDown(on) { this._send(on ? OPCODES.MOVE_DOWN : OPCODES.STOP_MOVE_DOWN); }
    moveLeft(on) { this._send(on ? OPCODES.MOVE_LEFT : OPCODES.STOP_MOVE_LEFT); }
    moveRight(on) { this._send(on ? OPCODES.MOVE_RIGHT : OPCODES.STOP_MOVE_RIGHT); }

    stopMoving() {
        this.moveUp(false);
        this.moveDown(false);
        this.moveLeft(false);
        this.moveRight(false);
    }

    _send(opcode) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const pb = new PacketBuilder();
        pb.u8(opcode);
        this.ws.send(pb.done());
    }
}

class ZlapBot {
    constructor(name, skin, cheatString = "") {
        this.name = name;
        this.skin = skin;
        this.cheatString = cheatString;
        this.ws = null;
        this.alive = false;
        this._attackTimer = null;
        this._serverUrl = this._findServer();
        this._connect();
    }

    _findServer() {
        if (mainPlayerSocket) return mainPlayerSocket.url;
        // Fallback default
        return "wss://zlap.6192k7tcej8ks.eu-central-1.cs.amazonlightsail.com";
    }

    _connect() {
        try {
            isBotConnecting = true; // Set flag so WebSocket hook ignores this connection
            const ws = new WebSocket(this._serverUrl);
            isBotConnecting = false; // Reset flag immediately

            ws.binaryType = "arraybuffer";
            this.ws = ws;

            ws.onopen = () => {
                this._sendJoin();
                this._startAttackLoop();
                if (FunnelManager.active) {
                    FunnelManager.applyToBot(this);
                }
            };
            ws.onclose = () => {
                this._stopAttackLoop();
                this.ws = null;
                this.alive = false;
            };
            ws.onerror = () => { this._stopAttackLoop(); };
        } catch (e) {
            isBotConnecting = false;
        }
    }

    _sendRawPacket(buildFn) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const pb = new PacketBuilder();
        buildFn(pb);
        this.ws.send(pb.done());
    }

    _sendJoin() {
        const pb = new PacketBuilder();
        pb.string(this.name);
        pb.u8(this.skin);
        pb.string(this.cheatString || "");
        this.ws.send(pb.done());
        this.alive = true;
    }

    sendPlay() { this._sendRawPacket(pb => pb.u8(OPCODES.PLAY)); }
    moveUp(on) { this._sendRawPacket(pb => pb.u8(on ? OPCODES.MOVE_UP : OPCODES.STOP_MOVE_UP)); }
    moveDown(on) { this._sendRawPacket(pb => pb.u8(on ? OPCODES.MOVE_DOWN : OPCODES.STOP_MOVE_DOWN)); }
    moveLeft(on) { this._sendRawPacket(pb => pb.u8(on ? OPCODES.MOVE_LEFT : OPCODES.STOP_MOVE_LEFT)); }
    moveRight(on) { this._sendRawPacket(pb => pb.u8(on ? OPCODES.MOVE_RIGHT : OPCODES.STOP_MOVE_RIGHT)); }

    stopMoving() {
        this.moveUp(false);
        this.moveDown(false);
        this.moveLeft(false);
        this.moveRight(false);
    }

    _startAttackLoop() {
        this._attackTimer = setInterval(() => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
            this.sendPlay();
        }, BOT_ATTACK_INTERVAL_MS);
    }

    _stopAttackLoop() {
        if (this._attackTimer) {
            clearInterval(this._attackTimer);
            this._attackTimer = null;
        }
    }

    kill() {
        this._stopAttackLoop();
        if (this.ws) {
            try { this.ws.close(); } catch (e) {}
            this.ws = null;
        }
    }
}

const BotManager = {
    bots: [],
    playerWrapper: null,

    attachMainPlayer(ws) {
        this.playerWrapper = new PlayerWrapper(ws);
    },

    spawnBots(count) {
        const available = Math.max(0, MAX_BOTS - this.bots.length);
        const toSpawn = Math.min(count, available);
        if (toSpawn <= 0) return;

        for (let i = 0; i < toSpawn; i++) {
            const nameIndex = this.bots.length % 4;
            const name = Settings.botNames[nameIndex] || Settings.botNames[0];
            const bot = new ZlapBot(name, BOT_SKIN, "");
            this.bots.push(bot);
        }
    },

    killAll() {
        for (const bot of this.bots) bot.kill();
        this.bots = [];
    },

    forEachBot(fn) {
        for (const bot of this.bots) {
            if (bot.ws && bot.ws.readyState === WebSocket.OPEN) fn(bot);
        }
    },

    forEachEntity(fn) {
        this.forEachBot(fn);
        if (Settings.playerMode && this.playerWrapper) {
            fn(this.playerWrapper);
        }
    }
};

window.ZlapBotManager = BotManager;

function setupKeyMirroring() {
    window.addEventListener("keydown", (ev) => {
        if (!Settings.mirrorKeys) return;
        if (ev.repeat) return;
        const code = ev.code || ev.key;
        switch (code) {
            case "KeyW": case "ArrowUp": BotManager.forEachBot(bot => bot.moveUp(true)); break;
            case "KeyS": case "ArrowDown": BotManager.forEachBot(bot => bot.moveDown(true)); break;
            case "KeyA": case "ArrowLeft": BotManager.forEachBot(bot => bot.moveLeft(true)); break;
            case "KeyD": case "ArrowRight": BotManager.forEachBot(bot => bot.moveRight(true)); break;
            case "Space": BotManager.forEachBot(bot => bot.sendPlay()); break;
        }
    });

    window.addEventListener("keyup", (ev) => {
        if (!Settings.mirrorKeys) return;
        if (ev.repeat) return;
        const code = ev.code || ev.key;
        switch (code) {
            case "KeyW": case "ArrowUp": BotManager.forEachBot(bot => bot.moveUp(false)); break;
            case "KeyS": case "ArrowDown": BotManager.forEachBot(bot => bot.moveDown(false)); break;
            case "KeyA": case "ArrowLeft": BotManager.forEachBot(bot => bot.moveLeft(false)); break;
            case "KeyD": case "ArrowRight": BotManager.forEachBot(bot => bot.moveRight(false)); break;
        }
    });
}

const FunnelManager = {
    active: false,
    timeout: null,
    toggleState: false,

    applyToBot(bot) {
        if (!this.active) return;
        const config = FUNNEL_CONFIG[Settings.funnelDirection];
        if (!config) return;
        bot[config.hold](true);
        if (config.toggle) bot[config.toggle](this.toggleState);
    },

    loop() {
        if (!this.active) return;
        const config = FUNNEL_CONFIG[Settings.funnelDirection];
        if (!config) return;

        this.toggleState = !this.toggleState;
        BotManager.forEachEntity(entity => {
            entity[config.hold](true);
            if (config.toggle) entity[config.toggle](this.toggleState);
        });
        this.timeout = setTimeout(() => this.loop(), Settings.funnelDelay);
    },

    start() {
        if (this.active) return;
        this.active = true;
        this.toggleState = true;
        const config = FUNNEL_CONFIG[Settings.funnelDirection];
        if (!config) return;

        BotManager.forEachEntity(entity => {
            entity[config.hold](true);
            if (config.toggle) entity[config.toggle](true);
        });
        this.timeout = setTimeout(() => this.loop(), Settings.funnelDelay);
    },

    stop() {
        if (!this.active) return;
        this.active = false;
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        BotManager.forEachEntity(entity => {
            entity.stopMoving();
        });
    },

    restart() {
        if (this.active) {
            this.stop();
            this.start();
        }
    }
};

function createControlPanel() {
    const style = document.createElement('style');
    style.innerHTML = `
        .zlap-panel {
            position: fixed; bottom: 40px; left: 10px; z-index: 999999;
            background-color: rgba(20, 20, 20, 0.95); color: #eee; padding: 15px;
            font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 12px;
            border-radius: 8px; min-width: 250px; border: 1px solid #444;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6); backdrop-filter: blur(4px);
        }
        .zlap-title {
            margin-bottom: 12px; font-weight: 700; text-align: center;
            border-bottom: 1px solid #444; padding-bottom: 8px; font-size: 14px;
        }
        .zlap-input {
            background: #222; border: 1px solid #444; color: #fff; padding: 5px;
            border-radius: 4px; font-size: 11px; width: 100%; box-sizing: border-box; outline: none;
        }
        .zlap-input:focus { border-color: #2ecc71; }
        .zlap-btn {
            flex: 1; padding: 8px; border: none; color: white; cursor: pointer;
            border-radius: 4px; font-weight: 600; transition: opacity 0.2s;
        }
        .zlap-btn:hover { opacity: 0.9; }
        .zlap-btn-green { background: #27ae60; }
        .zlap-btn-red { background: #c0392b; }
        .zlap-toggle-row {
            display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
        }
        .zlap-switch {
            position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0;
        }
        .zlap-switch input { opacity: 0; width: 0; height: 0; }
        .zlap-slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: #555; transition: .3s; border-radius: 20px;
        }
        .zlap-slider:before {
            position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
            background-color: white; transition: .3s; border-radius: 50%;
        }
        input:checked + .zlap-slider { background-color: #2ecc71; }
        input:checked + .zlap-slider:before { transform: translateX(16px); }
        .zlap-status { margin-top: 12px; font-size: 10px; color: #aaa; text-align: center; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement("div");
    panel.className = "zlap-panel";

    const title = document.createElement("div");
    title.className = "zlap-title";
    title.textContent = "Zlap Bot v1.2";
    panel.appendChild(title);

    const namesGrid = document.createElement("div");
    namesGrid.style.display = "grid";
    namesGrid.style.gridTemplateColumns = "1fr 1fr";
    namesGrid.style.gap = "6px";
    namesGrid.style.marginBottom = "12px";

    for(let i=0; i<4; i++) {
        const inp = document.createElement("input");
        inp.className = "zlap-input";
        inp.placeholder = `Bot ${i+1}`;
        inp.value = Settings.botNames[i];
        inp.oninput = () => { Settings.botNames[i] = inp.value; Settings.save(); };
        namesGrid.appendChild(inp);
    }
    panel.appendChild(namesGrid);

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";
    btnContainer.style.marginBottom = "15px";

    const spawnBtn = document.createElement("button");
    spawnBtn.className = "zlap-btn zlap-btn-green";
    spawnBtn.textContent = "Spawn Bots";
    spawnBtn.onclick = () => { BotManager.spawnBots(DEFAULT_SPAWN); updateStatus(); };

    const killBtn = document.createElement("button");
    killBtn.className = "zlap-btn zlap-btn-red";
    killBtn.textContent = "Kill All";
    killBtn.onclick = () => { BotManager.killAll(); updateStatus(); };
    btnContainer.append(spawnBtn, killBtn);
    panel.appendChild(btnContainer);

    const createToggle = (label, settingKey, onChange) => {
        const row = document.createElement("div");
        row.className = "zlap-toggle-row";
        const txt = document.createElement("span");
        txt.textContent = label;
        const switchLabel = document.createElement("label");
        switchLabel.className = "zlap-switch";
        const inp = document.createElement("input");
        inp.type = "checkbox";
        inp.checked = Settings[settingKey];
        inp.onchange = () => {
            Settings[settingKey] = inp.checked;
            Settings.save();
            if(onChange) onChange(inp.checked);
            updateStatus();
        };
        const slider = document.createElement("span");
        slider.className = "zlap-slider";
        switchLabel.append(inp, slider);
        row.append(txt, switchLabel);
        return row;
    };

    panel.appendChild(createToggle("Mirror Keys (WASD)", "mirrorKeys"));
    panel.appendChild(createToggle("Player as Bot", "playerMode", () => {
         if(Settings.funnelActive) FunnelManager.restart();
    }));

    const hr = document.createElement("div");
    hr.style.borderTop = "1px solid #444";
    hr.style.margin = "10px 0";
    panel.appendChild(hr);

    panel.appendChild(createToggle("Enable Funneling", "funnelActive", (checked) => {
        checked ? FunnelManager.start() : FunnelManager.stop();
    }));

    const dirSelect = document.createElement("select");
    dirSelect.className = "zlap-input";
    dirSelect.style.marginBottom = "8px";
    Object.keys(FUNNEL_CONFIG).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = FUNNEL_CONFIG[key].label;
        if (Settings.funnelDirection === key) opt.selected = true;
        dirSelect.appendChild(opt);
    });
    dirSelect.onchange = () => {
        Settings.funnelDirection = dirSelect.value;
        Settings.save();
        FunnelManager.restart();
    };
    panel.appendChild(dirSelect);

    const delayRow = document.createElement("div");
    delayRow.className = "zlap-toggle-row";
    const delayLbl = document.createElement("span");
    delayLbl.textContent = "Toggle Delay:";
    const delaySelect = document.createElement("select");
    delaySelect.className = "zlap-input";
    delaySelect.style.width = "auto";
    [10, 50, 100, 200, 500, 1000, 2000, 5000].forEach(ms => {
        const opt = document.createElement("option");
        opt.value = ms;
        opt.textContent = ms + " ms";
        if(Settings.funnelDelay === ms) opt.selected = true;
        delaySelect.appendChild(opt);
    });
    delaySelect.onchange = () => {
        Settings.funnelDelay = parseInt(delaySelect.value);
        Settings.save();
        FunnelManager.restart();
    };
    delayRow.append(delayLbl, delaySelect);
    panel.appendChild(delayRow);

    const status = document.createElement("div");
    status.className = "zlap-status";
    panel.appendChild(status);

    const updateStatus = () => {
        status.textContent = `Bots: ${BotManager.bots.length} | Mode: ${Settings.playerMode ? "Player+Bot" : "Bot Only"}`;
    };

    document.body.appendChild(panel);
    setInterval(updateStatus, 1000);
    updateStatus();
}

function onReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") fn();
    else document.addEventListener("DOMContentLoaded", fn);
}

onReady(() => {
    createControlPanel();
    setupKeyMirroring();
    if (Settings.funnelActive) FunnelManager.start();
});
})();
// ==UserScript==
// @name        Kb++ - cuberealm.io
// @namespace   https://github.com/Thibb1
// @match       https://cuberealm.io/*
// @match       https://www.cuberealm.io/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      Thibb1, Modified by pi
// @description Cuberealm extender Kb++, adds helpful features like Zoom and friend/enemy list + addon support
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/555983/Kb%2B%2B%20-%20cuberealmio.user.js
// @updateURL https://update.greasyfork.org/scripts/555983/Kb%2B%2B%20-%20cuberealmio.meta.js
// ==/UserScript==

let loaded = false;
console.log("Kb+ started, waiting to load...");

let player = null;

let messageQueue = [];
let lastMessageSendTime = 0;

setInterval(() => {
    if (!messageQueue.length) return

    const time = Date.now()
    if ((time - lastMessageSendTime) > 3500) {
        const msg = messageQueue[0]
        messageQueue = messageQueue.slice(1)
        __eventEmitter.emit(Events.SendMessage, msg);
        lastMessageSendTime = time;
    }
}, 50)

Object.defineProperties(Object.prototype, {
    "_eventEmitter": {
        get() { return this.__eventEmitter },
        set(v) {
            if (!loaded) {
                loaded = true;
                console.log("Kb+ loaded");
            }
            this.__eventEmitter = v;
            window.__eventEmitter = v;
            this.__eventEmitter.emit = new Proxy(this.__eventEmitter.emit, {
                apply(target, thisArg, args) {
                    try {
                        const type = Number(args[0]);
                        switch (type) {
                            case Event.Tick:
                                break;
                            case Events.InitPlayer:
                                if (!settings.welcomeText) break;
                                sendMessage("Kb++ loaded. Made by Thibb1, modified by pi", Colors.GREEN);
                                sendMessage(`Send ${settings.commandPrefix}help to see available commands.`, Colors.GREEN);
                                break;
                            case Events.Message:
                                args[1] = handleMessage(args[1]);
                                if (args[1] == "") args[0] = Events.Disable;
                                break;
                            case Events.SendMessage:
                                lastMessageSendTime = Date.now()
                                const send = args[1];
                                if (settings.keepHistory) saveHistory(send);
                                if (send.startsWith(settings.commandPrefix)) {
                                    const cmd = send.split(" ")[0].slice(1)
                                    const cmdNames = Object.keys(commands)
                                    if (settings.commandPrefix === "/" && (!cmdNames.includes(cmd) || cmd == "help")) break

                                    handleCommand(send.slice(settings.commandPrefix.length));

                                    args[0] = Events.Disable;
                                } else {
                                    break;
                                    const message = handleSendMessage(send);
                                    if (message == "") args[0] = Events.Disable;
                                    args[1] = message;
                                }

                                break;
                            case Events.TabValues:
                                handleTabValues(args[1]);
                                break;
                            default:
                                const addons = getAddons();
                                for (const addon of addons) {
                                    addon.onGameEvent?.(args);
                                }

                                if (settings.debug) console.log(`Event ${type} emitted with args:`, args.slice(1));
                                break;
                        }
                    } catch (error) {
                        console.error('Error in event emitter:', error);
                    } finally {
                        return target.apply(thisArg, args);
                    }
                }
            });
        }
    },
    "autoClearStencil": {
        get() { return _autoClearStencil; },
        set(value) {
            _autoClearStencil = value;
            if (this.domElement.id === 'canvas') {
                setTimeout(() => {
                    this.render = new Proxy(this.render, {
                        apply(target, thisArg, args) {
                            try {
                                if (!loaded) return;
                                if (args[1].children.length !== 1 || args[1].children[0].type !== 'AudioListener') return;
                                if (!player && args[0].children.length > 0) {
                                    const childrens = args[0].children[0].children;
                                    if (childrens.length > 7) {
                                        player = childrens[6].children[0];
                                    }
                                }
                            } catch {} finally {
                                return target.apply(thisArg, args);
                            }
                        }
                    });
                }, 100);
            }
        }
    }
});

const Events = {
    Tick: 0,
    JoinRoom: 1,
    InitPlayer: 2,
    Disconnect: 4,
    Keyboard: 9,
    ChunkData: 10,
    // 11 load/unload chunk ?
    UnlockMouse: 15,
    LockMouse: 16,
    // 20 remove player/entity?
    ChangeSlot: 24,
    HoldingItem: 32,
    Message: 33,
    SendMessage: 34,
    TabValues: 44,
    Disable: 99999
}

const defaultSettings = {
    commandPrefix: '?',
    zoomKey: 'z',
    welcomeText: true,
    keepHistory: true,
    showCoords: true,
    debug: false,
    requirePlayerToBeOnline: true,
    disableTips: true,
    disableCantBreak: true,
    disableChunkInChat: true,
    disableAds: true,
    disableJoinMessages: false,
    version: "1.2.2",
    gameVersion: 23
}

let settings = defaultSettings;

const coordsDiv = document.createElement('div');
coordsDiv.id = 'coords-display';
coordsDiv.style.cssText = `position: absolute;bottom: 10px;right: 10px;color: white;font-size: 16px;font-family: monospace;z-index: 9999;background-color: rgba(0, 0, 0, 0.5);padding: 5px;border-radius: 5px;cursor: pointer;`;
document.body.appendChild(coordsDiv);
coordsDiv.addEventListener('click', () => {
    if (player && settings.showCoords) {
        const x = player.position.x.toFixed(2);
        const y = player.position.y.toFixed(2);
        const z = player.position.z.toFixed(2);
        const coordsText = `X: ${x}, Y: ${y}, Z: ${z}`;
        navigator.clipboard.writeText(coordsText);
        sendMessage("Copied coordinates to clipboard!", Colors.GREEN);
    }
});


function updateCoordsDisplay() {
    if (player && settings.showCoords) {
        const x = player.position.x.toFixed(2);
        const y = player.position.y.toFixed(2);
        const z = player.position.z.toFixed(2);
        coordsDiv.innerText = `X: ${x}\nY: ${y}\nZ: ${z}`;
        coordsDiv.style.display = 'block';
    } else {
        coordsDiv.style.display = 'none';
    }
}

setInterval(updateCoordsDisplay, 100);

const createColor = (code) => ({
    code,
    convert() { return "∁" + this.code.slice(1); }
});

const Colors = {
    DARK_RED: createColor("#c43535"),
    RED: createColor("#ff5050"),
    PINK: createColor("#ff89e9"),
    BROWN: createColor("#de660f"),
    ORANGE: createColor("#ffa540"),
    GOLD: createColor("#ffd700"),
    YELLOW: createColor("#ffff40"),
    DARK_GREEN: createColor("#40aa40"),
    GREEN: createColor("#40ff40"),
    DARK_CYAN: createColor("#40a5a5"),
    CYAN: createColor("#40ffff"),
    DARK_BLUE: createColor("#1b7dff"),
    BLUE: createColor("#6ab4ff"),
    DARK_PURPLE: createColor("#c04eff"),
    PURPLE: createColor("#c28fff"),
    MAGENTA: createColor("#ff40ff"),
    WHITE: createColor("#ffffff"),
    GRAY: createColor("#a9a9a9"),
    DARK_GRAY: createColor("#808080"),
    BLACK: createColor("#565656")
}
Colors.ENEMY = Colors.RED;
Colors.FRIEND = Colors.GREEN;
const Modes = ["survival", "creative", "peaceful", "custom"];

const lsCache = {}; // Cache localStorage for performance reasons

function getLocalStorage(key, defaultValue = {}) {
    if (lsCache[key] && key != "Kb+Addons") return lsCache[key]; // Return cached value if it exists

    const raw = localStorage.getItem(key);
    if (raw) {
        const data = JSON.parse(raw);
        if (data.version && data.version !== defaultValue.version) {
            const mergedSettings = { ...defaultValue, ...data };
            mergedSettings.version = defaultValue.version;
            setLocalStorage(key, mergedSettings);
            return mergedSettings;
        }

        if (key != "Kb+Addons") lsCache[key] = data; // Update cache
        return data;
    }
    return defaultValue;
}

function setLocalStorage(key, data) {
    if (key != "Kb+Addons") lsCache[key] = data // Update cache

    localStorage.setItem(key, JSON.stringify(data));
}

settings = getLocalStorage('Kb+', defaultSettings);
const tabList = [];

function saveSettings() {
    setLocalStorage('Kb+', settings);
}

const history = getLocalStorage("Kb+_hst", []);
let historyIndex = -1;
const MAX_HISTORY = 50;

function saveHistory(message) {
    history.push(message);
    if (history.length > MAX_HISTORY) {
        history.shift();
    }
    setLocalStorage('Kb+_hst', history);
    historyIndex = history.length - 1;
}

CanvasRenderingContext2D.prototype.fillText = new Proxy(CanvasRenderingContext2D.prototype.fillText, {
    apply(target, thisArg, args) {
        try {
            const text = args[0];
            const addons = getAddons();
            for (const addon of addons) {
                const color = addon.onGetColor?.(text);
                if (color) {
                    thisArg.fillStyle = Colors[color].code;
                    break;
                }
            }
        } catch (error) {
            console.error('Error in fillText proxy:', error);
        } finally {
            return target.apply(thisArg, args);
        }
    }
});

Object.defineProperty(Object.prototype, "generalFOV", {
    get() { return this._generalFOV; },
    set(v) {
        this._generalFOV = v;
        window.__cbSettings = this;
        setTimeout(() => {
            for (const key of Object.keys(this)) {
                if (typeof this[key] === 'function' && this[key].toString().includes('generalFOV')) {
                    this.setGeneralFOV = this[key];
                    break;
                }
            }
        }, 0)
    }
});

if (settings.disableAds) {
    // needs refining
    Object.defineProperty(Object.prototype, "adplayer", {
        get() {
            if (window.adsLoadedPromiseResolve) window.adsLoadedPromiseResolve();
            return null;
        },
        set(v) {}
    });
    Object.defineProperty(Object.prototype, "requestAds", {
        get() {
            if (window.adsLoadedPromiseResolve) window.adsLoadedPromiseResolve();
            return () => {};
        },
        set(v) {}
    });
}

let previousFOV = 100;
let zoomOn = false;
document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === settings.zoomKey.toLowerCase() && window.__cbSettings && !zoomOn) {
        zoomOn = true;
        const CBsettings = JSON.parse(localStorage.getItem("settings"));
        previousFOV = CBsettings.state._generalFOV ?? CBsettings.state.generalFOV ?? previousFOV;
        window.__cbSettings?.setGeneralFOV(40);
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === settings.zoomKey.toLowerCase() && window.__cbSettings && zoomOn) {
        zoomOn = false;
        window.__cbSettings?.setGeneralFOV(previousFOV);
    }
});

function sendMessage(message, color) {
    const text = (color ? color.convert() : "") + message + "        ";
    window.__eventEmitter.emit(Events.Message, text);
}

function sendChatMessage(message) {
    messageQueue.push(message)
    // window.__eventEmitter.emit(Events.SendMessage, message);
}

const commands = {
    "help": {
        description: "[command] - Shows help menu or details about a command",
        cmdCallback: handleCmdHelp,
        acpCallback: () => autocomplete("help", Object.keys(commands))
    },
    "toggle": {
        description: "[setting] - Toggle a setting on or off",
        cmdCallback: handleCmdToggle,
        acpCallback: () => autocomplete("toggle", commands.toggle.settings),
        settings: ["welcomeText", "keepHistory", "disableTips", "disableCantBreak", "disableChunkInChat", "disableAds", "disableJoinMessages", "showCoords", "debug", "requirePlayerToBeOnline"]
    },
    "toggles": {
        description: "- List available toggle settings",
        cmdCallback: () => sendMessage("Available toggles: " + commands.toggle.settings.join(", "), Colors.YELLOW),
        acpCallback: () => {}
    },
    "addon": {
        description: "- Manage addons",
        cmdCallback: handleCmdAddon,
        acpCallback: (cmd) => {
            const addonCommands = ["details", "enable", "disable", "install", "uninstall", "list"];
            const parts = cmd.slice(settings.commandPrefix.length + "addon ".length).split(" ");
            if (parts.length === 1) {
                autocomplete("addon", addonCommands);
            } else {
                autocomplete(`addon ${parts[0]}`, getAddons().map(addon => addon.name));
            }
        }
    }
}

function handleCmdAddon(args) {
    const actions = ["details", "enable", "disable", "install", "uninstall", "list"];
    const addons = getAddons();
    const addonNames = addons.map(addon => addon.name)
    const m = new Matcher(args, { actions, addonNames })

    if (m.match("list")) {
        sendMessage("Available addons: "+addonNames.join(", "), Colors.BLUE);
        return
    }
    m.match("details ${... as rest}")
    if (m.matched.all) {
        const addon = addons.find(addon => addon.name === m.rest) ?? "error"
        sendMessage(`${Colors.ORANGE.convert()}${addon.name} ${Colors.BLUE.convert()}- ${addon.description}`)
        return
    } else if (!m.matched.rest) {
        sendMessage(`[Help] ${settings.commandPrefix}addon details [name]`, Colors.RED);
        return
    }

    sendMessage(`${"=".repeat(20)} Addon Help ${"=".repeat(20)}`, Colors.CYAN)
    sendMessage(`${settings.commandPrefix}addon list - Lists all addons`, Colors.ORANGE)
    sendMessage(`${settings.commandPrefix}addon details [name] - shows addon information`, Colors.ORANGE)
    sendMessage("Features coming soon:", Colors.CYAN)
    sendMessage(`${settings.commandPrefix}addon install [code] - Install an addon`, Colors.ORANGE)
    sendMessage(`${settings.commandPrefix}addon uninstall [name] - Uninstall an addon`, Colors.ORANGE)
    sendMessage(`${settings.commandPrefix}addon enable [name] - Enable an addon`, Colors.ORANGE)
    sendMessage(`${settings.commandPrefix}addon disable [name] - Disable an addon`, Colors.ORANGE)
    sendMessage("=".repeat(49), Colors.CYAN)
}

function handleCmdHelp(args) {
    const m = new Matcher(args, { commands: Object.keys(commands) })

    if (m.match("")) {
        printHelpMenu()
    } else if (m.match("${commands as command}")) {
        const cmd = m.command
        sendMessage(`${settings.commandPrefix}${cmd} ${commands[cmd].description}`, Colors.ORANGE);
        if (commands[cmd].settings) {
            sendMessage("Available settings: " + commands[cmd].settings.join(", "), Colors.ORANGE);
        }
    } else {
        sendMessage(`Command not found: '${m.command}'`, Colors.RED);
    }
}

function handleCmdToggle(args) {
    const m = new Matcher(args, { settings: commands.toggle.settings })

    if (m.match("")) {
        sendMessage("[Help] " + settings.commandPrefix + "toggle <setting>", Colors.RED);
    } else if (m.match("${settings as setting}")) {
        settings[m.setting] = !settings[m.setting];
        saveSettings();
        sendMessage(`Toggled ${m.setting} to ${settings[m.setting]}`, Colors.GREEN);
    } else {
        sendMessage("Unknown setting: "+m.setting, Colors.RED);
    }
}


function getAddons() {
    return getLocalStorage("Kb+Addons", []).map(addon => restoreAddon(addon))
}

function registerCommand(name, description, handleCmdCallback, handleAutocompleteCallback) {
    commands[name] = {
        description,
        cmdCallback: handleCmdCallback,
        acpCallback: handleAutocompleteCallback
    };
}

function registerToggle(name, initialValue = false) {
    commands.toggle.settings.push(name);
    if (!settings[name]) settings[name] = initialValue;

    saveSettings();
}

function handleSendMessage(message) {
    for (const key in commands) {
        if (commands[key].onSendMessage) {
            message = commands[key].onSendMessage(message)
        }
        if (message === "") return "";
    }
    return message;
}

function handleCommand(cmd) {
    const parts = cmd.split(" ").filter(Boolean);
    const partsLen = parts.length;
    const command = parts.slice(1).join(" ");

    if (partsLen === 0) {
        sendMessage("Please enter a command.", Colors.RED);
        return;
    }
    const commandName = parts[0];

    if (commands[commandName]) {
        commands[commandName].cmdCallback(command); // Call the function for that command
    } else {
        sendMessage(`Unknown command: ${parts[0]}`, Colors.RED);
    }
}

function leave() {
    __eventEmitter.emit(Events.Disconnect);
}

function joinGame(mode, region) {
    if (!Modes.includes(mode)) {
        sendMessage("Invalid mode: " + mode + ". Available modes: " + Modes.join(", "), Colors.RED);
        return;
    }
    if (mode == "custom") {
        sendMessage(`Attempting to join ${region}...`, Colors.YELLOW);
        const secure = region.startsWith("wss://") ? true : false;
        region = region.slice(secure ? 6 : 5); // ws or wss
        const parts = region.split(":");
        const hostname = parts[0];
        const port = parts[1];
        leave();
        setTimeout(() => {__eventEmitter.emit(Events.JoinRoom, hostname, port, secure, "battle", "custom");}, 1000);
        return;
    }
    sendMessage(`Attempting to join ${mode}-${region}...`, Colors.YELLOW);
    fetch("https://cuberealm.io/v1/matchmake", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mode: mode, room: `${mode}-${region}`, version: String(settings.gameVersion) })
    }).then(response => response.json()).then(data => {
        if (settings.debug) console.log("Matchmake response:", data);
        if (data.hostname && data.port) {
            leave();
            __eventEmitter.emit(Events.JoinRoom, data.hostname, data.port, data.isSecure, mode, data.room);
        } else {
            sendMessage(`Failed to join ${mode}-${region}. ${data.message || ''}`, Colors.RED);
        }
    }).catch(error => {
        console.error("Matchmake error:", error);
        sendMessage(`Error joining ${mode}-${region}: ${error.message}`, Colors.RED);
    });
}

function printHelpMenu() {
    // To do: make addons be able to add to help message?
    const commandPrefix = settings.commandPrefix;
    sendMessage("=".repeat(20) + "Help Menu" + "=".repeat(20), Colors.CYAN);
    sendMessage(commandPrefix + "help [<command>] - Help menu or details on a command", Colors.ORANGE);
    const friendsHelp = ["friends", "addfriend [name]", "delfriend [name]"].map(cmd => commandPrefix + cmd).join(" ");
    sendMessage(friendsHelp + " - Manage friends", Colors.ORANGE);
    const enemiesHelp = ["enemies", "addenemy [name]", "delenemy [name]"].map(cmd => commandPrefix + cmd).join(" ");
    sendMessage(enemiesHelp + " - Manage enemies", Colors.ORANGE);
    const markHelp = ["marks", "addmark [color] [name]", "delmark [name]"].map(cmd => commandPrefix + cmd).join(" ");
    sendMessage(markHelp + " - Manage marked players", Colors.ORANGE);
    const toggleHelp = ["toggle [setting]", "toggles"].map(cmd => commandPrefix + cmd).join(" ");
    sendMessage(toggleHelp + " - Manage Kb+ toggles", Colors.ORANGE);
    sendMessage(commandPrefix + "join <mode> <region> - Join a specific region", Colors.ORANGE);
    sendMessage(commandPrefix + "reset <home> - Reset a home to your current location", Colors.ORANGE);
    sendMessage(commandPrefix + "leave - Leave the current game", Colors.ORANGE);
    sendMessage("=".repeat(49), Colors.CYAN);
}

function checkList(list, name) {
    if (!settings.requirePlayerToBeOnline) return name
    if (!list.includes(name)) {
        const matchingPlayers = list.filter(player => player.startsWith(name));
        if (matchingPlayers.length > 0) {
            return matchingPlayers[0];
        }
        sendMessage("Player not found: " + name, Colors.RED);
        return "";
    }
    return name;
}

function handleMessage(message) {
    // To do: make usable with addons
    if (message.startsWith("∁6ab4ff[∁ffd700Tip")) {
        if (settings.disableTips) return "";
    }
    if (message.startsWith(Colors.RED.convert())) {
        const error = message.slice(7);
        if (error.startsWith("You can't") && settings.disableCantBreak) return "";
    }
    if (message.startsWith(Colors.GREEN.convert())) {
        const success = message.slice(7);
        if (success.startsWith("Entering") && settings.disableChunkInChat) return "";
        if (success.startsWith("Leaving") && settings.disableChunkInChat) return "";
    }
    if (message.startsWith(Colors.GOLD.convert()) && settings.disableJoinMessages) return "";

    if (message.endsWith("        ")) return message; // if message ends with 8 spaces, it's made by an addon
    const addons = getAddons();

    let newMessage = message; // Leave OG message alone so addons can use it if they want
    for (const addon of addons) {
        newMessage = addon.onRecieveMessage?.(newMessage, message) ?? newMessage;
        if (newMessage === "") return "";
    }

    return newMessage;
}

function setInputValue(input, newValue) {
    // You need to use this to update react state or it wont register the change
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value').set;
    nativeInputValueSetter.call(input, newValue);
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
}

let currentValue = "";
let inputElement = null;
function autocomplete(baseCommand, list, commandPrefix = settings.commandPrefix) {
    if (!currentValue.startsWith(commandPrefix + baseCommand + " ")) return;
    const settingVar = currentValue.slice(commandPrefix.length + baseCommand.length + 1).toLowerCase();
    const matchs = list.filter(el => el.toLowerCase().startsWith(settingVar));
    if (matchs.length > 0) {
        setInputValue(inputElement, commandPrefix + baseCommand + " " + matchs[0]);
    }
};

function handleKeydownInput(event, input) {
    if (event.key === 'Tab' && input.value.startsWith(settings.commandPrefix)) {
        event.preventDefault();
        currentValue = input.value;
        inputElement = input;
        const commandPrefix = settings.commandPrefix;
        const command = currentValue.slice(commandPrefix.length);

        const availableCommands = Object.keys(commands);
        const matchingCommands = availableCommands.filter(cmd => cmd.startsWith(command));

        if (matchingCommands.length > 0) {
            setInputValue(input, commandPrefix + matchingCommands[0]);
        } else {
            for (const key of Object.keys(commands)) {
                commands[key].acpCallback?.(currentValue);
            }
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex >= 0) {
            setInputValue(input, history[historyIndex]);
            historyIndex = Math.max(historyIndex - 1, 0);
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            setInputValue(input, history[historyIndex]);
        } else {
            setInputValue(input, "");
            historyIndex = history.length - 1;
        }
    }
}

function findStringInObject(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            return obj[key];
        } else if (Array.isArray(obj[key])) {
            for (const item of obj[key]) {
                if (typeof item === 'object') {
                    const result = findStringInObject(item);
                    if (result) return result;
                }
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            const result = findStringInObject(obj[key]);
            if (result) return result;
        }
    }
    return null;
}


function handleTabValues(object) {
    const playerName = findStringInObject(object);
    if (playerName) {
        if (!tabList.includes(playerName)) {
            tabList.push(playerName);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (settings.disableAds) window.adSDKType = '';
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((addedNode) => {
                    if (addedNode.tagName === 'INPUT' && addedNode.getAttribute('maxlength') === '100') {
                        addedNode.setAttribute("maxlength", 4000);
                        historyIndex = history.length - 1;
                        addedNode.addEventListener('keydown', (event) => handleKeydownInput(event, addedNode));
                    }
                    if (!addedNode.querySelectorAll) return;
                    addedNode.querySelectorAll('span').forEach(span => {
                        const player = span.innerText;

                        const addons = getAddons();
                        for (const addon of addons) {
                            const color = addon.onGetColor?.(player)
                            if (color) {
                                span.style.color = Colors[color].code;
                                break;
                            }
                        }
                    });
                });
            }
        });
    });
    try {
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            const appUI = document.querySelector('#app > div > div');
            observer.observe(appUI, { childList: true, subtree: true });
        }, 10000)
    } catch (error) {
        console.error("Couldn't hook input / document body, features like tab autocomplete and name coloring won't work. Try reloading the page.");
    }
});


class Matcher {
    #str; #context;

    constructor(str, context) {
        this.#str = str;
        this.#context = context
    }

    match(template) {
        let str = this.#str;
        let context = this.#context
        let output = { matched: { all: true } }
        const dbg = (...msg) => false && console.log(...msg)

        while (template.length > 0) {
            dbg(`match(str='${str}', template='${template}'), out=${JSON.stringify(output)}`)

            if (template.startsWith("${")) {
                // Template section
                const closeIdx = template.indexOf("}");
                if (closeIdx === -1) throw new Error("Unclosed ${ in template");
                const inner = template.slice(2, closeIdx).trim(); // e.g. list as item, item, ... as var

                // Parse the inside
                if (inner.includes(" as ")) {
                    dbg("finding ${list as item}")

                    const [left, right] = inner.split(" as ").map(s => s.trim());

                    if (left.startsWith("...")) {
                        // "${... as var}" captures rest of string
                        const varName = right;
                        output[varName] = str;
                        output.matched[varName] = true;
                        str = "";
                        template = template.slice(closeIdx + 2);
                        continue;
                    }

                    // "${list as item}" pattern
                    const listName = left;
                    const varName = right;
                    const nextSpace = str.indexOf(" ");
                    const token = nextSpace === -1 ? str : str.slice(0, nextSpace);

                    if (Array.isArray(context[listName]) && context[listName].includes(token)) {
                        output[varName] = token;
                        output.matched[varName] = true;
                        str = str.slice(token.length).trimStart();
                    } else {
                        output[varName] = token;
                        output.matched[varName] = false;
                        output.matched.all = false;
                        str = str.slice(token.length).trimStart();
                    }

                    template = template.slice(closeIdx + 2);
                    continue;

                } else {
                    dbg("finding ${var}")
                    // "${item}" pattern — single variable capture
                    const varName = inner;
                    const nextSpace = str.indexOf(" ");
                    const token = nextSpace === -1 ? str : str.slice(0, nextSpace);

                    dbg(`'${varName}', '${token}'`)

                    output[varName] = token;
                    output.matched[varName] = true;
                    str = str.slice(token.length).trimStart();
                    dbg(`str=${str}`)
                    template = template.slice(closeIdx + 2);
                    continue;
                }
            } else {
                dbg("finding literal")

                // Literal text
                let nextExpr = template.indexOf("${");
                if (nextExpr === -1) nextExpr = template.length;
                const literal = template.slice(0, nextExpr);

                if (!str.startsWith(literal)) output.matched.all = false;

                str = str.slice(literal.length);

                template = template.slice(nextExpr);
                dbg(`'${str}', '${literal}', '${template}'`)
                dbg(JSON.stringify(output))
            }
        }

        // If any leftover string remains, not a full match
        if (str.length > 0) output.matched.all = false;
        dbg(`out=${JSON.stringify(output)}`)

        for (const key in output) {
            if (key === "matched") {
                // Special case: copy the whole object
                this.matched = { ...output.matched };
            } else {
                this[key] = output[key];
            }
        }
        return this.matched.all
    }

    setString(newStr) { this.#str = newStr; }
    getString() { return this.#str; }
}

// ------------ ADDONS --------------

const addonSetCommandPrefixAndZoomKey = {
    name: "command-prefix-and-zoom-key",
    description: `Change the command prefix with ${settings.commandPrefix}prefix [string], and set zoom key with ${settings.commandPrefix}zoomkey [key]`,
    addon() {
        registerCommand("prefix", "[prefix] - Set the command prefix", (args) => {
            if (args === "") {
                sendMessage("[Help] "+settings.commandPrefix+"prefix [prefix]", Colors.RED)
                return
            }
            settings.commandPrefix = args;
            saveSettings();
            sendMessage("Set command prefix to "+args, Colors.GREEN)
        }, () => {})
        registerCommand("zoomkey", "[key] - Set zoom key", (args) => {
            if (args === "") {
                sendMessage("[Help] "+settings.commandPrefix+"zoomkey [key]", Colors.RED)
                return
            }
            settings.zoomKey = args;
            saveSettings();
            sendMessage("Set zoom key to "+args, Colors.GREEN)
        }, () => {})
    }
}

const addonJoinLeave = {
    name: "join-and-leave",
    description: "Adds ?join and ?leave commands",
    addon() {
        registerCommand(
            "join", "[mode] [server] - Join a server. Ex: survival us-1",
            handleJoin, handleAcpJoin
        );
        registerCommand(
            "leave", "- Leaves the game",
            handleLeave, () => {}
        )

        function handleJoin(args) {
            const modes = ["survival", "creative", "peaceful", "custom"];
            const m = new Matcher(args, { modes })

            m.match("${modes as mode} ${region}")
            if (!m.matched.mode) {
                sendMessage("Invalid mode: " + m.mode + ". Available modes: " + modes.join(", "), Colors.RED);
                return
            }

            if (!m.matched.region) {
                sendMessage("Please provide a server region (eg us-1)", Colors.RED)
                return
            }

            console.log(m)
            const mode = m.mode;
            const region = m.region;
            if (mode == "custom") {
                sendMessage(`Attempting to join ${region}...`, Colors.YELLOW);
                const secure = region.startsWith("wss://") ? true : false;
                region = region.slice(secure ? 6 : 5); // ws or wss
                const parts = region.split(":");
                const hostname = parts[0];
                const port = parts[1];
                leave();
                setTimeout(() => {__eventEmitter.emit(Events.JoinRoom, hostname, port, secure, "battle", "custom");}, 1000);
                return;
            }
            sendMessage(`Attempting to join ${mode}-${region}...`, Colors.YELLOW);
            fetch("https://cuberealm.io/v1/matchmake", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mode: mode, room: `${mode}-${region}`, version: String(settings.gameVersion) })
            }).then(response => response.json()).then(data => {
                if (settings.debug) console.log("Matchmake response:", data);
                if (data.hostname && data.port) {
                    leave();
                    __eventEmitter.emit(Events.JoinRoom, data.hostname, data.port, data.isSecure, mode, data.room);
                } else {
                    sendMessage(`Failed to join ${mode}-${region}. ${data.message || ''}`, Colors.RED);
                }
            }).catch(error => {
                console.error("Matchmake error:", error);
                sendMessage(`Error joining ${mode}-${region}: ${error.message}`, Colors.RED);
            });
        }

        function handleAcpJoin(args) {
            const parts = args.split();
            if (parts.length > 1) return;

            const modes = ["survival", "creative", "peaceful", "custom"];

            autocomplete("join", modes)
        }

        function handleLeave() {
            __eventEmitter.emit(Events.Disconnect);
        }
    }
}

const addonFriendsEnemiesMarks = {
    name: "friends-enemies-marks",
    description: "Adds friend, enemy, and custom color marks to players",
    addon() {
        registerCommand(
            "friends", "[add | del | list ] [name] - Add or remove a player from your friends list, or list friends",
            handleFriends, acpFriends
        );
        registerCommand(
            "enemies", "[ add | del | list ] [name] - Add or remove a player from your enemies list, or list enemies",
            handleEnemies, acpEnemies
        );
        registerCommand(
            "marks", "[ add | del | list ] [name] - Add or remove a player from your marked players list, or list marked players",
            handleMarks, acpMarks
        );

        const friends = getLocalStorage("Kb+Addon_friends", []);
        const enemies = getLocalStorage("Kb+Addon_enemies", []);
        const marked = getLocalStorage("Kb+Addon_marked", {});

        function handleFriends(args) {
            const m = new Matcher(args, { friends, tabList });

            if (m.match("list")) {
                sendMessage(`Friends: ${friends.join(", ")}`, Colors.BLUE);
            } else if (m.match("add ${name}") ) {
                const name = checkList(tabList, m.name);
                if (name === "") return;
                if (friends.includes(name)) return sendMessage(`${name} is already on your friends list`, Colors.YELLOW)
                friends.push(name);
                if (enemies.includes(name)) handleEnemies("del "+ name)
                if (marked[name]) handleMarks("del "+name)
                setLocalStorage("Kb+Addon_friends", friends);
                sendMessage(`Added ${name} to your friends list`, Colors.GREEN)
            } else if (m.match("del ${name}")) {
                const name = checkList(friends, m.name);
                if (name === "") return;
                const index = friends.indexOf(name);
                if (index > -1) {
                    friends.splice(index, 1);
                    setLocalStorage(`Kb+Addon_friends`, friends);
                    sendMessage(`Reomved ${name} from your friends list`, Colors.GREEN);
                } else {
                    sendMessage(`${name} is not in your friends list`, Colors.YELLOW);
                }
            } else {
                sendMessage(`[Help] ${settings.commandPrefix}friends [add | del | list] [name]`, Colors.RED);
            }
        }


        function handleEnemies(args) {
            const m = new Matcher(args, { enemies, tabList });

            if (m.match("list")) {
                sendMessage(`Enemies: ${enemies.join(", ")}`, Colors.BLUE);
            } else if (m.match("add ${name}") ) {
                const name = checkList(tabList, m.name);
                if (name === "") return;
                if (enemies.includes(name)) return sendMessage(`${name} is already on your enemies list`, Colors.YELLOW)
                enemies.push(name);
                if (friends.includes(name)) handleFriends("del "+ name)
                if (marked[name]) handleMarks("del "+name)
                setLocalStorage("Kb+Addon_enemies", enemies);
                sendMessage(`Added ${name} to your enemies list`, Colors.GREEN)
            } else if (m.match("del ${name}")) {
                const name = checkList(enemies, m.name);
                if (name === "") return;
                const index = enemies.indexOf(name);
                if (index > -1) {
                    enemies.splice(index, 1);
                    setLocalStorage(`Kb+Addon_enemies`, enemies);
                    sendMessage(`Reomved ${name} from your enemies list`, Colors.GREEN);
                } else {
                    sendMessage(`${name} is not in your enemies list`, Colors.YELLOW);
                }
            } else {
                sendMessage(`[Help] ${settings.commandPrefix}enemies [add | del | list] [name]`, Colors.RED);
            }
        }

        function handleMarks(args) {
            const m = new Matcher(args, { colors: Object.keys(Colors), tabList })

            if (m.match("list")) {
                sendMessage(Colors.BLUE.convert() + "Marked players:" + Object.keys(marked).map(name => ` ${Colors[marked[name]].convert()}${name}`), Colors.BLUE);
            } else if (m.match("add")) {
                sendMessage("Available colors: " + Object.keys(Colors).map(color => Colors[color].convert() + color).join(", "), Colors.RED);
            } else if (m.match("add ${color} ${name}")) {
                const color = m.color;
                const name = m.name;
                if (Colors[color]) {
                    const playerName = checkList(tabList, name);
                    if (playerName === "") return;
                    if (friends.includes(name)) handleFriends("friends del "+name);
                    if (enemies.includes(name)) handleEnemies("enemies del "+name);
                    marked[playerName] = color;
                    setLocalStorage("Kb+Addon_marked", marked);
                    sendMessage(`Marked ${playerName} with color ${Colors[color].convert()}${color}`, Colors.GREEN);
                } else {
                    sendMessage("Invalid color: " + color + ". Available colors: " + Object.keys(Colors).map(color => Colors[color].convert() + color).join(", "), Colors.RED);
                }
            } else if (m.match("del ${name}")) {
                const name = checkList(Object.keys(marked), m.name);
                if (name === "") return sendMessage(`Player "${name} not found`, Colors.RED);
                if (marked[name]) {
                    delete marked[name];
                    setLocalStorage("Kb+Addon_marked", marked);
                    sendMessage(`Removed mark from ${name}`, Colors.GREEN);
                } else {
                    sendMessage(`${name} is not marked`, Colors.YELLOW);
                }
            } else {
                sendMessage(`[Help] ${settings.commandPrefix}marks add [color] [name] | del [name] | list`, Colors.RED);
            }
        }

        function acpFriends(msg) {
            const parts = msg.split(" ");
            if (parts.length === 2) {
                autocomplete("friends", ["add", "del", "list"]);
            } else if (parts.length === 3) {
                if (parts[1] === "add") {
                    autocomplete("friends add", tabList);
                } else if (parts[1] === "del") {
                    autocomplete("friends del", friends);
                }
            }
        }
        function acpEnemies(msg) {
            const parts = msg.split(" ");
            if (parts.length === 2) {
                autocomplete("enemies", ["add", "del", "list"]);
            } else if (parts.length === 3) {
                if (parts[1] === "add") {
                    autocomplete("enemies add", tabList);
                } else if (parts[1] === "del") {
                    autocomplete("enemies del", enemies);
                }
            }
        }
        function acpMarks(msg) {
            const parts = msg.split(" ");
            if (parts.length === 2) {
                autocomplete("marks", ["add", "del", "list"]);
            } else if (parts.length === 3) {
                if (parts[1] === "add") {
                    autocomplete("marks add", Object.keys(Colors));
                } else if (parts[1] === "del") {
                    autocomplete("marks del", Object.keys(marked));
                }
            } else if (parts.length === 4 && parts[1] === "add") {
                autocomplete("marks add "+parts[2], tabList);
            }
        }
    },
    onRecieveMessage(message) {
        if (!message.includes(": ")) return message;

        const parts = message.split(": ");
        const name = parts[0];
        const chatMsg = ": " + parts.slice(1).join(": ");

        const friends = getLocalStorage("Kb+Addon_friends");
        if (friends.includes(name)) return Colors.FRIEND.convert() + name + Colors.WHITE.convert() + chatMsg;

        const enemies = getLocalStorage("Kb+Addon_enemies");
        if (enemies.includes(name)) return Colors.ENEMY.convert() + name + Colors.WHITE.convert() + chatMsg;

        const marked = getLocalStorage("Kb+Addon_marked");
        if (marked[name]) return Colors[marked[name]].convert() + name + Colors.WHITE.convert() + chatMsg;

        return message;
    },
    onGetColor(playerName) {
        const friends = getLocalStorage("Kb+Addon_friends");
        const enemies = getLocalStorage("Kb+Addon_enemies");
        const marked = getLocalStorage("Kb+Addon_marked");

        if (friends.includes(playerName)) return "FRIEND";
        if (enemies.includes(playerName)) return "ENEMY";
        if (marked[playerName]) return marked[playerName];
    },
}

const addonWhitelist = {
    name: "whitelist",
    description: "Adds a whitelist chat mode",
    addon() {
        const whitelist = getLocalStorage("Kb+Addon_whitelist", []);

        registerCommand(
            "whitelist", "[add [name] | del [name] | list] - Add or remove players from your whitelist, or list whitelisted players",
            handleWhitelist, handleACPWhitelist
        );

        registerToggle("enableWhitelist", false)

        function handleWhitelist(args) {
            const m = new Matcher(args)

            if (m.match("list")) {
                sendMessage(`Whitelisted players: ${whitelist.join(", ")}`, Colors.BLUE)

            } else if (m.match("add ${name}")) {
                const name = m.name
                if (whitelist.includes(name)) {
                    sendMessage(`${name} is already whitelisted`, Colors.RED);
                    return;
                }

                whitelist.push(name);
                setLocalStorage(`Kb+Addon_whitelist`, whitelist);
                sendMessage(`Added ${name} to your whitelist`, Colors.GREEN);

            } else if (m.match("del ${name}")) {
                const name = m.name;
                if (!whitelist.includes(name)) {
                    sendMessage(`${name} is not whitelisted`, Colors.RED);
                    return;
                }

                const index = whitelist.indexOf(name);
                whitelist.splice(index, 1);
                setLocalStorage(`Kb+Addon_whitelist`, whitelist);
                sendMessage(`Reomved ${name} from your whitelist`, Colors.GREEN);
            } else {
                sendMessage(`[Help] ${settings.commandPrefix}whitelist [add [name] | del [name] | list]`, Colors.RED);
            }
        }

        function handleACPWhitelist(args) {
            args = args.split(" ").slice(1) // remove /whitelist

            if (args[0] == "add") {
                autocomplete("whitelist add", tabList)
            } else if (args[0] == "del") {
                autocomplete("whitelist del", whitelist)
            } else {
                autocomplete("whitelist", ["add", "del", "list"])
            }
        }
    },
    onRecieveMessage(modifiedMsg, ogMessage) {
        if (!settings.enableWhitelist) return modifiedMsg

        const whitelist = getLocalStorage("Kb+Addon_whitelist", []);

        let msg = ogMessage
        // if (message.startsWith("∁")) msg = message.slice(7);

        const parts = msg.split(": ")
        if (parts.length > 1) {
            let name = parts[0]

            if (!whitelist.includes(name)) return ""
        } else if (ogMessage.startsWith(Colors.YELLOW.convert())) {
            const name = ogMessage.split(" ")[0].slice(7)
            if (ogMessage.slice(7).includes("∁")) return modifiedMsg;
            if (ogMessage.startsWith(Colors.YELLOW.convert()+"Teleporting")) return modifiedMsg

            if (!whitelist.includes(name)) sendChatMessage("/tpdeny "+name)

            return ""
        }

        return modifiedMsg;
    }
}

setLocalStorage("Kb+Addons", [
    addonFriendsEnemiesMarks,
    addonWhitelist,
    addonJoinLeave,
    addonSetCommandPrefixAndZoomKey,
].map(a => saveAddon(a)))

function installAddons() {
    const addons = getAddons();
    for (const addon of addons) {
        addon.addon?.();
        console.log(`Installed Kb+ addon ${addon.name}`)
    }
}
installAddons();

function saveAddon(addon) {
    for (const fn of ["addon", "onRecieveMessage", "onSendMessage", "onGetColor", "onGameEvent"]) {
        if (addon[fn]) addon[fn] = addon[fn].toString();
    }

    return addon;
}

function restoreAddon(addon) {
    for (const fn of ["addon", "onRecieveMessage", "onSendMessage", "onGetColor", "onGameEvent"]) {
        if (addon[fn]) addon[fn] = eval(`(function ${addon[fn]})`);
    }

    return addon;
}
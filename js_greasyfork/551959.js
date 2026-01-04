// ==UserScript==
// @name         Astral [Without AI]
// @namespace    -
// @version      5.1.0:4
// @description  This script was been writed by ilyax aka the real name liyaa basically this script was made for Nightmare who used to bully us thanks for waiting this script.
// @author       ilyax aka liyaa, doorsfloor2, cubicflex, jeanne
// @match        *://sploop.io/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/brain.js@2.0.0-beta.24/dist/browser.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/551959/Astral%20%5BWithout%20AI%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/551959/Astral%20%5BWithout%20AI%5D.meta.js
// ==/UserScript==

let testmode = true;

const AstralInfo = {
    version: "5.0.0"
}

async function sleep(a) {
    await new Promise(a => {
        setTimeout(() => {
            a();
        },1000);
    });
}

const AstralID = Math.floor(Math.random() * 99999)
let AstralName;
var log = console.log;
let statusMode = {
    cps: 0,
    pps: 0,
    ping: 0,
    shame: 0,
    language: null,
    lasthat: 0,
    ReplaceDelay: 0,
    predictedDamage: 0,
    connected: false,
    overridepush: false,
    isSongplaying: false,
}

const server = {
    spawned: 35,
    update: 20,
    died: 19,
    ping: 15,
    entity_spawned: 32,
    killed: 28,
    create_clan: 24,
    update_clan: 16,
    leave_clan: 27,
    entity_chat: 30,
    connected: 33,
    hooked: 25,
}

let Vars = {
    entities: [],
    clan: [],
    enemyLength: []
}

const type = {
    spike: 4,
    windwill: 5,
    trap: 7,
    heal: 2,
}

const hats = {
    bush_gear: 1,
    berserker: 2,
    jungle_gear: 3,
    crystal_gear: 4,
    spike_gear: 5,
    immunity_gear: 6,
    boost_Hat: 7,
    apple_gear: 8,
    scuba_gear: 9,
    hood_gear: 10,
    demolist: 11,
    snow_Hat: 12,
    pumpking_curse: 13
}

let Game_Tick = 111;
let sincetick = 0;
let ping = {
    previousPingValues: [],
    lagSpikeThreshold: 3,
    maxPingHistory: 10,
}

let debug = {}

let sizes = {
    trap: 70,
    spike: 70,
    player: 70,
}

let IDweapon = {
    hammer: 15,
    naginata: 28,
}

const astralPlayerNames = new Set();

const astralIosStyles = document.createElement('style');
astralIosStyles.innerHTML = `
    .astral-ios-menu {
        background: rgba(44, 44, 46, 0.85);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 14px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #f2f2f7;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .astral-ios-menu p {
        color: #f2f2f7;
        font-weight: 400;
        font-size: 16px;
        margin: 8px 0 8px 5px;
        position: static;
        left: auto;
    }

    .astral-ios-menu .translate-dropdownlist {
        width: 100%;
        margin: 15px 0 5px 0;
        padding: 12px;
        border-radius: 8px;
        background-color: rgba(118, 118, 128, 0.24);
        border: none;
        color: #f2f2f7;
        font-size: 15px;
        -webkit-appearance: none;
        appearance: none;
    }

    .astral-button-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
        border-top: 1px solid rgba(80, 80, 80, 0.5);
        padding-top: 15px;
    }

    .astral-ios-button {
        background-color: #0A84FF;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        width: 100%;
        transition: transform 0.15s ease, background-color 0.15s ease;
    }

    .astral-ios-button:active {
        transform: scale(0.97);
        background-color: #0060b8;
    }

    .astral-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: flex; justify-content: center; align-items: center;
        z-index: 10001; opacity: 0; visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .astral-modal-overlay.visible {
        opacity: 1; visibility: visible;
    }

    .astral-modal-content {
        background: rgba(44, 44, 46, 0.85);
        color: #f2f2f7;
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-radius: 14px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        transform: scale(1.1); opacity: 0;
        transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s ease;
        padding: 0;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
    }

    .astral-modal-overlay.visible .astral-modal-content {
        transform: scale(1); opacity: 1;
    }

    .astral-modal-header {
        padding: 16px; border-bottom: 1px solid rgba(80, 80, 80, 0.5);
        text-align: center; position: relative;
        flex-shrink: 0;
    }

    .astral-modal-title {
        font-size: 1.1rem; font-weight: 600; margin: 0;
    }

    .astral-modal-close-btn {
        position: absolute; right: 10px; top: 50%;
        width: 30px; height: 30px;
        border-radius: 50%; background-color: rgba(120, 120, 128, 0.3);
        border: none; color: rgba(235, 235, 245, 0.8); cursor: pointer;
        display: flex; justify-content: center; align-items: center;
        font-size: 15px;
        transform: translateY(-50%) scale(1) rotate(0deg);
        transition: background-color 0.2s ease, transform 0.2s ease;
    }
    .astral-modal-close-btn:hover { background-color: rgba(120, 120, 128, 0.4); }
    .astral-modal-close-btn:active {
        transform: translateY(-50%) scale(0.9) rotate(90deg);
    }

    .astral-modal-body {
        padding: 0; text-align: left; overflow-y: auto;
    }

    .player-list-entry, .ban-list-entry {
        padding: 12px 20px;
        border-bottom: 1px solid rgba(80, 80, 80, 0.5);
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .player-list-entry:last-child, .ban-list-entry:last-child {
        border-bottom: none;
    }
    .empty-server-msg, .ban-check-init-msg {
        padding: 20px;
        text-align: center;
        color: #8e8e93;
    }
    .status-badge {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 600;
    }
    .status-safe { background-color: #30D158; color: white; }
    .status-banned { background-color: #FF453A; color: white; }
    .status-checking { background-color: #FF9F0A; color: white; }
    .status-error { background-color: #8e8e93; color: white; }
`;

const modalContainer = document.createElement('div');
modalContainer.innerHTML = `
    <div id="astral-bans-modal" class="astral-modal-overlay">
        <div class="astral-modal-content" style="width: 90%; max-width: 400px;">
            <div class="astral-modal-header">
                <h2 class="astral-modal-title">Ban List</h2>
                <button class="astral-modal-close-btn" aria-label="Close">✕</button>
            </div>
            <div class="astral-modal-body">
                <div id="astral-ban-list-container">
                    <div class="ban-check-init-msg">Shows which server you're banned</div>
                </div>
                <div class="astral-button-container" style="padding: 15px; border-top: 1px solid rgba(80, 80, 80, 0.5);">
                    <button id="astral-check-bans-btn" style="display: none;" class="astral-ios-button">Check Again</button>
                </div>
            </div>
        </div>
    </div>
    <div id="astral-players-modal" class="astral-modal-overlay">
        <div class="astral-modal-content" style="width: 90%; max-width: 400px;">
            <div class="astral-modal-header">
                <h2 class="astral-modal-title">Player List</h2>
                <button class="astral-modal-close-btn" aria-label="Close">✕</button>
            </div>
            <div class="astral-modal-body">
                <div id="astral-player-list-container">
                    <div class="empty-server-msg">Connecting...</div>
                </div>
            </div>
        </div>
    </div>
`;

let statusMenu = document.createElement("div");
statusMenu.className = "astral-ios-menu";
statusMenu.style.position = "fixed";
statusMenu.style.width = "280px";
statusMenu.style.height = "auto";
statusMenu.style.top = "20px";
statusMenu.style.left = "20px";
statusMenu.style.zIndex = "10000";
statusMenu.style.padding = "15px";
statusMenu.id = "modmenu";

const buttonsHTML = `
    <div class="astral-button-container">
        <button id="show-bans-btn" class="astral-ios-button">Show Bans</button>
        <button id="show-players-btn" class="astral-ios-button">Player List</button>
    </div>
`;

statusMenu.innerHTML = `
    <p id="showCps">CPS: null</p>
    <p id="showPps">lastBan: null</p>
    <p id="showPing">Ping: null</p>
    <p id="showShame">Shame: null</p>
    ${buttonsHTML}
`;

let languageDropdown = document.createElement("select");
languageDropdown.className = "translate-dropdownlist";
const languages = [
    "No Translate", "Abkhazian (ab)", "Afar (aa)", "Afrikaans (af)", "Albanian (sq)", "Amharic (am)", "Arabic (ar)", "Armenian (hy)", "Aymara (ay)", "Azerbaijani (az)", "Bashkir (ba)", "Basque (eu)", "Bemba (bem)", "Belarusian (be)", "Bengali (bn)", "Bislama (bi)", "Bosnian (bs)", "Breton (br)", "Bulgarian (bg)", "Burmese (my)", "Catalan (ca)", "Cebuano (ceb)", "Chamorro (ch)", "Chinese (zh)", "Corsican (co)", "Croatian (hr)", "Czech (cs)", "Danish (da)", "Dutch (nl)", "Dzongkha (dz)", "English (en)", "Esperanto (eo)", "Estonian (et)", "Fijian (fj)", "Finnish (fi)", "French (fr)", "Fula (ff)", "Galician (gl)", "Georgian (ka)", "German (de)", "Greek (el)", "Guarani (gn)", "Gujarati (gu)", "Haitian Creole (ht)", "Hebrew (he)", "Hindi (hi)", "Hmong (hmn)", "Hungarian (hu)", "Icelandic (is)", "Igbo (ig)", "Indonesian (id)", "Irish (ga)", "Italian (it)", "Japanese (ja)", "Javanese (jw)", "Kannada (kn)", "Kazakh (kk)", "Khmer (km)", "Kinyarwanda (rw)", "Korean (ko)", "Kurdish (ku)", "Kyrgyz (ky)", "Lao (lo)", "Latvian (lv)", "Lithuanian (lt)", "Luxembourgish (lb)", "Macedonian (mk)", "Malagasy (mg)", "Malay (ms)", "Malayalam (ml)", "Maltese (mt)", "Maori (mi)", "Marathi (mr)", "Mingrelian (mg)", "Mingrelian (xmf)", "Mongolian (mn)", "Nepali (ne)", "Norwegian (no)", "Oromo (om)", "Pashto (ps)", "Persian (fa)", "Polish (pl)", "Portuguese (pt)", "Punjabi (pa)", "Quechua (qu)", "Romanian (ro)", "Russian (ru)", "Samoan (sm)", "Serbian (sr)", "Shona (sn)", "Sindhi (sd)", "Sinhala (si)", "Slovak (sk)", "Slovenian (sl)", "Somali (so)", "Sotho (st)", "Spanish (es)", "Sundanese (su)", "Swahili (sw)", "Swedish (sv)", "Tajik (tg)", "Tamil (ta)", "Telugu (te)", "Thai (th)", "Tigrinya (ti)", "Turkish (tr)", "Turkmen (tk)", "Twi (tw)", "Ukrainian (uk)", "Urdu (ur)", "Uzbek (uz)", "Vietnamese (vi)", "Welsh (cy)", "Wolof (wo)", "Xhosa (xh)", "Yoruba (yo)", "Zulu (zu)"
];
languages.forEach(language => {
    let option = document.createElement("option");
    option.className = "translated-option";
    option.value = language.split(" ")[1];
    option.textContent = language;
    languageDropdown.appendChild(option);
});
statusMenu.appendChild(languageDropdown);

languageDropdown.addEventListener("change", function() {
    const selectedLanguage = this.value;
    if (selectedLanguage !== "No Translate") {
        const languageCode = selectedLanguage.slice(-3).replace(")", "");
        statusMode.language = languageCode;
    } else {
        statusMode.language = "none";
    }
});

function addPlayerToList(name) {
    if (!name || astralPlayerNames.has(name)) return;
    const playerListContainer = document.getElementById('astral-player-list-container');
    if (!playerListContainer) return;
    const emptyMsg = playerListContainer.querySelector('.empty-server-msg');
    if (emptyMsg) emptyMsg.remove();
    astralPlayerNames.add(name);
    const playerEntry = document.createElement('div');
    playerEntry.className = 'player-list-entry';
    playerEntry.textContent = name;
    playerListContainer.appendChild(playerEntry);
}

function clearPlayerList() {
    astralPlayerNames.clear();
    const playerListContainer = document.getElementById('astral-player-list-container');
    if (playerListContainer) {
        playerListContainer.innerHTML = '<div class="empty-server-msg">Server is empty.</div>';
    }
}

const servers = {
    normal: { 'SGP1FFA': 'Normal Singapore #1', 'FRA1FFA': 'Normal Frankfurt #1', 'CA1FFA': 'Normal California #1' },
    sandbox: { 'SFRA': 'Sandbox Frankfurt #1', 'SFRA2BIS': 'Sandbox Frankfurt #2', 'SGP': 'Sandbox Singapore #1', 'SGP2': 'Sandbox Singapore #2', 'SCA': 'Sandbox California #1', 'SCA2': 'Sandbox California #2' },
    event: { 'CA1EVENT': 'Event California #1', 'FR1EVENT': 'Event Frankfurt #1' }
};

function checkServerBan(serverCode) {
    return new Promise((resolve) => {
        const socketUrl = `wss://${serverCode.toLowerCase()}.sploop.io/ws`;
        let socket;
        try {
            socket = new WebSocket(socketUrl);
        } catch (e) {
            resolve('Error');
            return;
        }

        const timeout = setTimeout(() => {
            if(socket.readyState !== WebSocket.CLOSED) socket.close();
            resolve('Error');
        }, 5000);

        socket.onopen = () => socket.send("Astral Ban Check");
        socket.onmessage = () => resolve('Safe');
        socket.onerror = () => resolve('Error');
        socket.onclose = (event) => {
            if (!event.wasClean || event.code === 1005 || event.code === 1006) {
                resolve('Banned');
            } else {
                resolve('Playable');
            }
        };

        socket.addEventListener('message', () => { clearTimeout(timeout); socket.close(); });
        socket.addEventListener('close', () => clearTimeout(timeout));
    });
}

async function startBanCheck() {
    const banListContainer = document.getElementById('astral-ban-list-container');
    banListContainer.innerHTML = '';

    const allServers = {...servers.normal, ...servers.sandbox, ...servers.event};

    for (const code in allServers) {
        const name = allServers[code];
        const entry = document.createElement('div');
        entry.className = 'ban-list-entry';
        entry.innerHTML = `<span>${name} (${code})</span><span class="status-badge status-checking">Checking...</span>`;
        banListContainer.appendChild(entry);

        checkServerBan(code).then(status => {
            const statusBadge = entry.querySelector('.status-badge');
            statusBadge.textContent = status;
            statusBadge.className = `status-badge status-${status.toLowerCase()}`;
        });
    }
}

setTimeout(() => {
    document.head.appendChild(astralIosStyles);
    document.body.appendChild(modalContainer);
    document.documentElement.appendChild(statusMenu);

    const bansModal = document.getElementById('astral-bans-modal');
    const playersModal = document.getElementById('astral-players-modal');

    statusMenu.querySelector('#show-bans-btn').addEventListener('click', () => {
        bansModal.classList.add('visible');
        if (!document.querySelector('#astral-ban-list-container .ban-list-entry')) {
            startBanCheck();
        }
    });
    statusMenu.querySelector('#show-players-btn').addEventListener('click', () => playersModal.classList.add('visible'));

    document.getElementById('astral-check-bans-btn').addEventListener('click', startBanCheck);

    document.querySelectorAll('.astral-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) overlay.classList.remove('visible');
        });
        overlay.querySelector('.astral-modal-close-btn').addEventListener('click', () => overlay.classList.remove('visible'));
    });

    try {
        const original_Packets_message = Packets.message;
        Packets.message = function(event) {
            original_Packets_message.apply(this, arguments);
            const data = Tools.parseMessage(event.data);
            switch (data.type) {
                case server.connected:
                    clearPlayerList();
                    const players = data[3];
                    if (players && players.length > 0) {
                        players.forEach(player => player && player[1] && addPlayerToList(player[1]));
                    }
                    break;
                case server.entity_spawned:
                    addPlayerToList(data[2]);
                    break;
            }
        };
    } catch (e) {
        console.error("Astral: Packets could not be initialized for player list.", e);
    }
    startBanCheck()
}, 2000);


let Features = {
    auto_heal: true,
    auto_placer: true,
    auto_break: true,
    naginata_sync: true,
    auto_replace: true,
    musket_sync: false,
    auto_push: true,
    pre_place: false,
    ab_spike: true,
    ab: true,
    ab_sync: true,
    always_immunity: false,
    l_combat: true,
    r_combat: true,
    new_heal: true,
    repeater: true,
    auto_hat: true,
    kill_chat: false,
    packgod: true,
    test1: false,
    test2: false,
    test3: false
}

const runAstralMenu = () => {
    if (document.getElementById('astral-menu')) return;

    function getFeaturesObj() {
        if (typeof Features !== 'undefined' && Features && typeof Features === 'object') return Features;
        if (window.Features && typeof window.Features === 'object') return window.Features;
        return {};
    }

    function normalizeFeatureValue(val) {
        return val === true || val === 'true' || val === 1 || val === '1' || val === 'on' || val === 'yes';
    }

    function createToggle(name, desc, featureKey, isWorking = true, isDev = false) {
        const features = getFeaturesObj();
        const val = features.hasOwnProperty(featureKey) ? features[featureKey] : false;
        const enabled = normalizeFeatureValue(val);
        const statusClass = isDev ? 'dev' : 'working';
        const statusText = isDev ? 'In Development' : 'Working';
        const disabledAttr = isDev ? 'disabled' : '';
        const enabledClass = enabled ? 'enabled' : '';
        const aria = enabled ? 'true' : 'false';
        return `
            <div class="toggle-item">
                <div class="toggle-header">
                    <div class="toggle-text">
                        <h3>${name}</h3>
                        <p>${desc}</p>
                    </div>
                    <div class="toggle-controls">
                        <span class="status ${statusClass}">[${statusText}]</span>
                        <button class="astral-toggle ${enabledClass}" data-feature="${featureKey}" aria-pressed="${aria}" ${disabledAttr}>
                            <span class="toggle-track">
                                <span class="toggle-thumb"></span>
                            </span>
                            <span class="toggle-label on">ON</span>
                            <span class="toggle-label off">OFF</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    const menu = document.createElement('div');
    menu.id = 'astral-menu';
    menu.innerHTML = `
    <style>
       @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');

#astral-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    background: rgba(40, 40, 55, 0.65);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-radius: 24px; /* Daha yuvarlak köşeler */
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
    padding: 25px;
    width: 800px;
    max-height: 90vh;
    height: 600px;
    font-family: 'Poppins', sans-serif;
    color: #e6e6fa;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translate(-50%, -48%) scale(0.95);
    transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), visibility 0.5s;
}

#astral-menu.visible {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) scale(1);
}

#corner-image-link{position:fixed;bottom:20px;left:20px;z-index:9998;transition:opacity .5s cubic-bezier(0.34, 1.56, 0.64, 1),transform .5s cubic-bezier(0.34, 1.56, 0.64, 1);opacity:0;transform:translateY(20px) scale(.9);visibility:hidden}
#corner-image-link.visible{opacity:1;transform:translateY(0) scale(1);visibility:visible}
#corner-image-link img{width:80px;height:80px;border-radius:50%;border:3px solid rgba(255,255,255,0.4);box-shadow:0 0 25px rgba(107,214,255,0.4);object-fit:cover;cursor:pointer}
.astral-tabs{display:flex;gap:10px;margin-bottom:25px;flex-shrink:0}.astral-tabs button{border:none;padding:10px 20px;border-radius:12px;background:rgba(255,255,255,0.05);color:#b8b5ff;cursor:pointer;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);font-family:'Poppins',sans-serif}.astral-tabs button.active{background:linear-gradient(45deg,#9d7cff,#6bd6ff);color:#fff;font-weight:bold; box-shadow: 0 4px 15px rgba(157, 124, 255, 0.3);}
.content-wrapper{position:relative;flex-grow:1;height:100%}.tab-content{height:100%;overflow-y:scroll;padding-right:20px}.tab-content::-webkit-scrollbar{display:none}.tab-content{-ms-overflow-style:none;scrollbar-width:none}.tab-content>div{display:none;opacity:0;transition:opacity .3s ease}.tab-content>div.active{display:block;opacity:1}.custom-scrollbar{position:absolute;right:0px;top:0;width:8px;height:100%;background:rgba(255,255,255,0.05);border-radius:4px;display:none}.scrollbar-thumb{position:absolute;width:100%;background:linear-gradient(180deg,#9d7cff,#6bd6ff);border-radius:4px;cursor:pointer;opacity:.8;transition:opacity .2s ease}.scrollbar-thumb:hover{opacity:1}

.toggle-item{background:rgba(255,255,255,0.04);padding:18px;border-radius:16px;margin:12px 0;border:1px solid rgba(255,255,255,0.08); transition: all 0.3s ease;}
.toggle-item:hover { transform: translateY(-2px); background: rgba(255,255,255,0.08); }
.toggle-header{display:flex;justify-content:space-between;align-items:center;gap:15px}
.toggle-text{flex-grow:1;max-width:80%}.toggle-controls{display:flex;align-items:center;gap:10px}
.toggle-item h3{margin:0 0 5px 0;color:#efefff; font-family: 'Poppins', sans-serif; font-weight: 700; letter-spacing: 0.5px;}
.toggle-item p{margin:0;color:#b8b5ff;font-size:.9em}
.status{font-size:.8em;padding:3px 8px;border-radius:5px}.working{background:rgba(151,186,66,0.2);color:#97ba42}.dev{background:rgba(255,108,144,0.2);color:#ff6c90}
.credits-section{text-align:center}.credits-section h2,.credits-section h3{color:#9d7cff}.credits-section p{color:#e6e6fa;margin-bottom:10px}#musicPlayerContainer{background:linear-gradient(135deg,rgba(30,30,40,0.9),rgba(20,20,30,0.9));padding:30px;border-radius:20px;box-shadow:0 12px 35px rgba(0,0,0,0.8),inset 0 0 12px rgba(255,255,255,0.1);color:#f0f0f0;font-family:'Poppins',Arial,sans-serif;display:flex;flex-direction:column;align-items:center;border:1px solid rgba(255,255,255,0.1);max-width:400px;margin:20px auto}
#musicPlayerContainer h2{font-size:26px;margin:0 0 20px 0;color:#ffffff;letter-spacing:2.5px;text-transform:uppercase;text-shadow:0 4px 12px rgba(0,0,0,0.9);font-weight:900}#musicSelect{width:100%;padding:14px;border:1px solid rgba(255,255,255,0.15);border-radius:12px;background:rgba(10,10,10,0.8);color:white;font-size:16px;font-family:'Poppins',Arial,sans-serif;cursor:pointer;margin-bottom:20px;box-shadow:0 6px 12px rgba(0,0,0,0.6)}.play-button,.stop-button{width:70px;height:70px;border:none;border-radius:50%;color:white;font-size:30px;font-weight:bold;cursor:pointer;display:flex;justify-content:center;align-items:center;box-shadow:0 12px 36px rgba(0,0,0,0.9),inset 0 -3px 8px rgba(255,255,255,0.2);transition:all .3s ease,transform .2s ease}.play-button{background:radial-gradient(circle,#57C84D,#3E8E39)}.stop-button{background:radial-gradient(circle,#C84D4D,#8E3939)}.play-button:hover{transform:scale(1.1);box-shadow:0 20px 50px rgba(0,0,0,1),inset 0 4px 12px rgba(255,255,255,0.3);background:radial-gradient(circle,#66E459,#4DA547)}.stop-button:hover{transform:scale(1.1);box-shadow:0 20px 50px rgba(0,0,0,1),inset 0 4px 12px rgba(255,255,255,0.3);background:radial-gradient(circle,#E45959,#A54747)}#lyrics{margin-top:20px;font-size:16px;font-weight:bold;color:rgba(255,255,255,0.9);text-align:center;line-height:1.6;text-shadow:0 3px 8px rgba(0,0,0,0.9);padding:15px;background:rgba(255,255,255,0.1);border-radius:12px;width:100%;min-height:50px;box-sizing:border-box}

.astral-toggle{display:inline-flex;align-items:center;gap:10px;padding:6px 8px;border-radius:999px;border:none;background:transparent;cursor:pointer;position:relative;outline:none;}
.astral-toggle[disabled]{opacity:.5;cursor:not-allowed}
.toggle-track{width:56px;height:30px;border-radius:999px;background:rgba(255,255,255,0.1);display:inline-block;position:relative;border: none;transition:all .3s cubic-bezier(.2,.9,.2,1);box-sizing:border-box}
.toggle-thumb{width:26px;height:26px;border-radius:50%;background:#fff;position:absolute;left:2px;top:2px;box-shadow:0 3px 8px rgba(0,0,0,0.3);transition:transform .4s cubic-bezier(0.34, 1.56, 0.64, 1)}
.astral-toggle.enabled .toggle-track{background:linear-gradient(90deg,#81f295,#64c5ef);}
.astral-toggle.enabled .toggle-thumb{transform:translateX(26px);}
.toggle-label{font-family:'Poppins',Arial,sans-serif;font-size:11px;letter-spacing:1px;user-select:none;padding:0 6px}
.toggle-label.on{display:none}
.astral-toggle.enabled .toggle-label.on{display:inline-block}
.astral-toggle.enabled .toggle-label.off{display:none}

@media (max-width:820px){#astral-menu{width:92vw;height:80vh}}
    </style>
    <div class="astral-tabs">
        <button data-tab="combat" class="active">⚔️ Combat</button>
        <button data-tab="visuals">👁️ Visuals</button>
        <button data-tab="defense">🛡️ Defense</button>
        <button data-tab="config">⚙️ Config</button>
        <button data-tab="music">🎵 Music</button>
        <button data-tab="credits">🌟 Credits</button>
    </div>
    <div class="content-wrapper">
        <div class="tab-content">
            <div data-content="combat" class="active">
                ${createToggle('Auto Place', 'Automatically placing objects against the enemy.', 'auto_placer')}
                ${createToggle('Auto Re-Place', 'Automatically Put the objects broken by the enemy in the same position', 'auto_replace', false, true)}
                ${createToggle('Naginata Weapon Sync', 'Synchronize to Destroy enemies with your Naginata Weapon.', 'naginata_sync')}
                ${createToggle('Secondary Weapon Sync', 'Synchronize Secondary weapon with musket.', 'musket_sync')}
                ${createToggle('Auto Push', 'If the enemy is trapped and there is a thorn nearby, it pushes them towards it.', 'auto_push')}
                ${createToggle('Test', 'A feature that has been testing by developer', 'test1')}
            </div>
            <div data-content="visuals"></div>
            <div data-content="defense">
                ${createToggle('Auto Heal', 'Automatic health management', 'auto_heal')}
                ${createToggle('Auto Break', 'Automatic defense breaking', 'auto_break')}
                ${createToggle('Auto Hat', 'Automatically uses hats in your area or in battle.', 'auto_hat')}
                ${createToggle('packgod', 'Auto Roast people who is threads you.', 'packgod')}
                ${createToggle('Kill chat', 'Automatically send a message if someone dies [packgod] [BAN RISK]', 'kill_chat')}
                ${createToggle('Test', 'A feature that has been testing by developer', 'test2')}
            </div>
            <div data-content="config">
                ${createToggle('AutoBreak Spike', 'Before breaking the trap, it breaks the dangerous spikes near to you.', 'ab_spike')}
                ${createToggle('Always Equip Immunity', 'Always use Immunity gear. Except for AutoSync with Autobreak.', 'always_immunity')}
                ${createToggle('Left Click Combat', 'Equip Berserker gear & Hit by holding down left click.', 'l_combat')}
                ${createToggle('Right Click Combat', 'Equip Immunity gear & Hit by holding down left click.', 'r_combat')}
                ${createToggle('New Auto Heal', 'Disable this If you dont even like our autoheal. or dying too much', 'new_heal')}
                ${createToggle('Test', 'A feature that has been testing by developer', 'test3')}
            </div>
            <div data-content="music">
                <div id="musicPlayerContainer">
                    <h2>Astral Player</h2>
                    <select id="musicSelect">
                        <option value="">Select a song!</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">Shamrain - To Leave</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3">Hardwell & KSHMR - Power</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3">Woodkid - To ashes and blood</option>
                    </select>
                    <audio id="audioPlayer" style="display: none;"></audio>
                    <div style="display: flex; gap: 20px;">
                        <button class="play-button">▶</button>
                        <button class="stop-button">■</button>
                    </div>
                    <div id="lyrics">Select a song to begin...</div>
                </div>
            </div>
            <div data-content="credits">
                <div class="credits-section">
                    <h2>🌟 Development Team</h2>
                    <p>Ilyax & Kusoi - Lead Developers</p>
                    <p>Crygen & Cubic & Jeanne - Contributor</p>
                </div>
            </div>
        </div>
        <div class="custom-scrollbar">
            <div class="scrollbar-thumb"></div>
        </div>
    </div>
    `;
    document.documentElement.appendChild(menu);

    function addCornerImage() {
        if (document.getElementById('corner-image-link')) return;
        const cornerLink = document.createElement('a');
        cornerLink.id = 'corner-image-link';
        const links = ["https://github.com", "https://developer.mozilla.org", "https://stackoverflow.com"];
        cornerLink.href = links[Math.floor(Math.random() * links.length)];
        cornerLink.target = '_blank';
        cornerLink.innerHTML = `<img src="https://picsum.photos/seed/${Math.random()}/100" alt="Astral Link">`; // I was going to add a anime girl on the menu but me too lazy for do that frfr
        document.body.appendChild(cornerLink);
    }
    addCornerImage();

    const menuElement = document.getElementById('astral-menu');
    const cornerLinkElement = document.getElementById('corner-image-link');
    const tabContent = menuElement.querySelector('.tab-content');
    const scrollbar = menuElement.querySelector('.custom-scrollbar');
    const thumb = menuElement.querySelector('.scrollbar-thumb');
    const tabs = menuElement.querySelectorAll('.astral-tabs button');
    const tabPanes = menuElement.querySelectorAll('.tab-content > div');

    function updateScrollbar() {
        requestAnimationFrame(() => {
            const scrollHeight = tabContent.scrollHeight, clientHeight = tabContent.clientHeight;
            if (scrollHeight > clientHeight) {
                scrollbar.style.display = 'block';
                const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * clientHeight);
                thumb.style.height = `${thumbHeight}px`;
                const thumbTop = (tabContent.scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbHeight);
                thumb.style.top = `${thumbTop}px`;
            } else {
                scrollbar.style.display = 'none';
            }
        });
    }

    let isDragging = false;
    thumb.addEventListener('mousedown', (e) => {
        e.preventDefault(); e.stopPropagation(); isDragging = true;
        const startY = e.clientY, startScrollTop = tabContent.scrollTop;
        document.body.style.cssText += 'cursor:grabbing; user-select:none;';
        const onMouseMove = (moveEvent) => {
            if (!isDragging) return;
            const deltaY = moveEvent.clientY - startY;
            tabContent.scrollTop = startScrollTop + (deltaY / tabContent.clientHeight) * tabContent.scrollHeight;
        };
        const onMouseUp = () => {
            isDragging = false;
            document.body.style.cursor = ''; document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function initToggles() {
        const features = getFeaturesObj();
        menuElement.querySelectorAll('.astral-toggle').forEach(btn => {
            const featureKey = btn.dataset.feature;
            const isDev = btn.hasAttribute('disabled');
            const val = features.hasOwnProperty(featureKey) ? features[featureKey] : false;
            const enabled = normalizeFeatureValue(val);
            btn.classList.toggle('enabled', enabled && !isDev);
            btn.setAttribute('aria-pressed', (enabled && !isDev) ? 'true' : 'false');
        });
    }

    menuElement.addEventListener('click', (e) => {
        const btn = e.target.closest('.astral-toggle');
        if (!btn) return;
        if (btn.disabled) return;
        const featureKey = btn.dataset.feature;
        const currentlyEnabled = btn.classList.contains('enabled');
        const willEnable = !currentlyEnabled;
        btn.classList.toggle('enabled', willEnable);
        btn.setAttribute('aria-pressed', willEnable ? 'true' : 'false');

        try {
            if (typeof Features !== 'undefined' && Features && typeof Features === 'object') {
                Features[featureKey] = willEnable;
            }
        } catch (err) {}
        if (!window.Features || typeof window.Features !== 'object') window.Features = {};
        window.Features[featureKey] = willEnable;

        if (typeof newNotif === 'function') {
            newNotif(`${featureKey.replace(/_/g, ' ')} ${willEnable ? 'enabled' : 'disabled'}.`, 'info', 2000);
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            menuElement.querySelector(`.tab-content > div[data-content="${tab.dataset.tab}"]`)?.classList.add('active');
            tabContent.scrollTop = 0; updateScrollbar();
            setTimeout(initToggles, 50);
        });
    });

    const audioPlayer = menuElement.querySelector('#audioPlayer');
    const musicSelect = menuElement.querySelector('#musicSelect');
    musicSelect.addEventListener('change', () => {
        audioPlayer.src = musicSelect.value;
        if (musicSelect.value) audioPlayer.play(); else audioPlayer.pause();
    });
    menuElement.querySelector('.play-button').addEventListener('click', () => audioPlayer.src && audioPlayer.play());
    menuElement.querySelector('.stop-button').addEventListener('click', () => { audioPlayer.pause(); audioPlayer.currentTime = 0; });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            menuElement.classList.toggle('visible');
            cornerLinkElement.classList.toggle('visible');
            if (menuElement.classList.contains('visible')) {
                updateScrollbar();
                setTimeout(initToggles, 50);
            }
        }
    });

    window.addEventListener('resize', updateScrollbar);

    setTimeout(() => { updateScrollbar(); initToggles(); }, 100);

    let lastSnapshot = JSON.stringify(getFeaturesObj() || {});
    const syncInterval = setInterval(() => {
        try {
            const currentSnapshot = JSON.stringify(getFeaturesObj() || {});
            if (currentSnapshot !== lastSnapshot) {
                lastSnapshot = currentSnapshot;
                initToggles();
            }
        } catch (err) {}
    }, 400);

    const mo = new MutationObserver(() => {
        if (!document.getElementById('astral-menu')) {
            clearInterval(syncInterval);
            mo.disconnect();
        }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
};

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', runAstralMenu);
} else {
    runAstralMenu();
}



// Notification System
function newNotif(message, type = 'info', duration = 3000) {
    const container = getNotificationContainer();
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    container.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    if (duration > 0) {
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 400);
        }, duration);
    }
}

function getNotificationContainer() {
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    return container;
}

setTimeout(() => {
    newNotif("Astral Script loaded successfully! Press ESC to open menu", "success", 5000);
}, 1000);

let ShamraimtoLeave = [
    { "seconds": 72,"lyrics": "I really have to leave now" },
    { "seconds": 78,"lyrics": "Can't stay here anymore" },
    { "seconds": 82,"lyrics": "No more" },
    { "seconds": 84,"lyrics": "We've come too far" },
    { "seconds": 90,"lyrics": "Not another day no more" },
    { "seconds": 96,"lyrics": "There is no return" },
    { "seconds": 102,"lyrics": "No words to explain" },
    { "seconds": 106,"lyrics": "No excuses left to make" },
    { "seconds": 112,"lyrics": "There is no one to blame" },
    { "seconds": 120,"lyrics": "Blame" },
    { "seconds": 125,"lyrics": "> Blame <" },
    { "seconds": 131,"lyrics": "There is no one to blame" },
    { "seconds": 137,"lyrics": "There is no one else to blame" },
    { "seconds": 142,"lyrics": "But me" },
    { "seconds": 168,"lyrics": "I've lost myself" },
    { "seconds": 174,"lyrics": "And I lost you" },
    { "seconds": 179,"lyrics": "Things are not well" },
    { "seconds": 180,"lyrics": "I know you see it too" },
    { "seconds": 184,"lyrics": "No,they're not well" },
    { "seconds": 186,"lyrics": "I know you feel it too" },
    { "seconds": 192,"lyrics": "There is no return" },
    { "seconds": 198,"lyrics": "No point of going on" },
    { "seconds": 203,"lyrics": "All excuses that we made" },
    { "seconds": 208,"lyrics": "There is no one to blame" },
    { "seconds": 215,"lyrics": "BLAME" },
    { "seconds": 221,"lyrics": "BLAMEEEEEE..." },
    { "seconds": 226,"lyrics": "There is no one to blame" },
    { "seconds": 232,"lyrics": "There is no one else to blame" },
    { "seconds": 239,"lyrics": "But me" }
];

let isThisPower = [
    { "seconds": 0,"lyrics": "I fill you up with bones" },
    { "seconds": 1,"lyrics": "That could never break" },
    { "seconds": 3,"lyrics": "Take you to a darker" },
    { "seconds": 4,"lyrics": "shade of grey" },
    { "seconds": 7,"lyrics": "Warm you like a sun" },
    { "seconds": 8,"lyrics": "That'll never fade" },
    { "seconds": 11,"lyrics": "Oh-oh-oh,oh-oh" },
    { "seconds": 14,"lyrics": "This is power" },
    { "seconds": 18,"lyrics": "> This is power <" },
    { "seconds": 21,"lyrics": ">> This is power <<" },
    { "seconds": 25,"lyrics": "This is power,power," },
    { "seconds": 28,"lyrics": "power" },
    { "seconds": 43,"lyrics": "Power (Power)" },
    { "seconds": 47,"lyrics": "This is power" },
    { "seconds": 51,"lyrics": "> This is power <" },
    { "seconds": 54,"lyrics": "This is power,power," },
    { "seconds": 57,"lyrics": "power" },
    { "seconds": 62,"lyrics": "I'll give you every heart" },
    { "seconds": 63,"lyrics": "Of a hundred souls" },
    { "seconds": 65,"lyrics": "You could be the fire" },
    { "seconds": 67,"lyrics": "To kill the cold" },
    { "seconds": 69,"lyrics": "I'll break you like a rock" },
    { "seconds": 70,"lyrics": "That could never hold" },
    { "seconds": 72,"lyrics": "Oh-oh-oh,oh-oh" },
    { "seconds": 76,"lyrics": "This is power" },
    { "seconds": 80,"lyrics": "> This is power <" },
    { "seconds": 83,"lyrics": ">> This is power <<" },
    { "seconds": 87,"lyrics": "This is power,power," },
    { "seconds": 98,"lyrics": "power" },
    { "seconds": 113 ,"lyrics": "Power" },
    { "seconds": 127,"lyrics": "This is power" },
    { "seconds": 131,"lyrics": "> This is power <" },
    { "seconds": 135,"lyrics": ">> This is power <<" },
    { "seconds": 139,"lyrics": "This is power,power," },
    { "seconds": 142,"lyrics": "power" }
];

let toAshesAndBlood = [
    { "seconds": 12,"lyrics": "You walk along the edge of danger" },
    { "seconds": 16,"lyrics": "And it will change you" },
    { "seconds": 22,"lyrics": "Why would you let this voice" },
    { "seconds": 23,"lyrics": "set in your head?" },
    { "seconds": 27,"lyrics": "It is meant to destroy you" },
    { "seconds": 35,"lyrics": "You summon storms,you" },
    { "seconds": 37,"lyrics": "play with nature" },
    { "seconds": 40,"lyrics": "Now watch it hurt you" },
    { "seconds": 46,"lyrics": "Why would you want to shape" },
    { "seconds": 47,"lyrics": "the world in your hands?"},
    { "seconds": 51,"lyrics": "You will never make it through" },
    { "seconds": 68,"lyrics": "Catch the fire burning" },
    { "seconds": 71,"lyrics": "out your soul" },
    { "seconds": 79,"lyrics": "Just make it die or" },
    { "seconds": 82,"lyrics": "you will turn it all" },
    { "seconds": 89,"lyrics": "To ashes and blood" },
    { "seconds": 95,"lyrics": "To ashes and blood" },
    { "seconds": 102,"lyrics": "You waste your life to gain power" },
    { "seconds": 106,"lyrics": "You shift the game rules" },
    { "seconds": 113,"lyrics": "How does it feel to reach the line" },
    { "seconds": 114,"lyrics": "that no one ever got to cross?" },
    { "seconds": 118,"lyrics": "Does it make you a god now?" },
    { "seconds": 126,"lyrics": "Every sin will be forgiven" },
    { "seconds": 131,"lyrics": "If you lay down your weapons to the ground" },
    { "seconds": 153,"lyrics": "Catch the fire burning" },
    { "seconds": 155,"lyrics": "out your soul" },
    { "seconds": 164,"lyrics": "Just make it die" },
    { "seconds": 166,"lyrics": "or you will fall" },
    { "seconds": 175,"lyrics": "Catch the fire burning" },
    { "seconds": 177,"lyrics": "out your soul" },
    { "seconds": 187,"lyrics": "Just make it die or" },
    { "seconds": 189,"lyrics": "you will turn it all" },
    { "seconds": 196,"lyrics": "To ashes and blood" },
    { "seconds": 201,"lyrics": "To ashes and blood" },
    { "seconds": 207,"lyrics": "To ashes and blood" },
    { "seconds": 213,"lyrics": "To ashes and blood" },
    { "seconds": 219,"lyrics": "To ashes and blood" },
];

let Daisy = [
    { "seconds": 4,"lyrics": "You don't wanna see me bratty" },
    { "seconds": 6,"lyrics": "Pet the kitty,call me catty" },
    { "seconds": 8,"lyrics": "Make your man call me daddy" },
    { "seconds": 10,"lyrics": "He talk too much,he's too chatty" },
    { "seconds": 12,"lyrics": "CEO,I'm savvy" },
    { "seconds": 14,"lyrics": "Respect a bitch,I'm a maverick" },
    { "seconds": 16,"lyrics": "Flexible,so elastic" },
    { "seconds": 18,"lyrics": "But don't do you dare" },
    { "seconds": 19,"lyrics": "bend a bitch backwards" },
    { "seconds": 20,"lyrics": "Fuck a princess,I'm a king" },
    { "seconds": 22,"lyrics": "Bow down and kiss on my ring" },
    { "seconds": 24,"lyrics": "Being a bitch is my kink" },
    { "seconds": 26,"lyrics": "What the fuck else did you think?" },
    { "seconds": 28,"lyrics": "Fuck a princess,I'm a king" },
    { "seconds": 30,"lyrics": "Bow down and kiss on my ring" },
    { "seconds": 32,"lyrics": "It's gonna hurt,it'll sting" },
    { "seconds": 34,"lyrics": "Spittin' your blood in the sink" },
    { "seconds": 35,"lyrics": "I'm crazy,but you like that" },
    { "seconds": 37,"lyrics": "I bite back" },
    { "seconds": 39,"lyrics": "Daisies on your nightstand" },
    { "seconds": 41,"lyrics": "never forget it" },
    { "seconds": 43,"lyrics": "I blossom in the moonlight" },
    { "seconds": 45,"lyrics": "screw eyes" },
    { "seconds": 47,"lyrics": "Glacial with the blue ice" },
    { "seconds": 50,"lyrics": "I'm terrifying" },
    { "seconds": 58,"lyrics": "" },
    { "seconds": 60,"lyrics": "I no Cinderella I like the shoes" },
    { "seconds": 61,"lyrics": "Big glass platforms" },
    { "seconds": 62,"lyrics": "bitch,I'm choosy" },
    { "seconds": 63,"lyrics": "Long blue hair,blue as a bruise" },
    { "seconds": 65,"lyrics": "Only trust a fella for some" },
    { "seconds": 66,"lyrics": "light amusement" },
    { "seconds": 67,"lyrics": "I'm no prey,but I am pursued" },
    { "seconds": 69,"lyrics": "Pray for me,Nana,on" },
    { "seconds": 70,"lyrics": "the church's pews" },
    { "seconds": 71,"lyrics": "No dickstraction can confuse me" },
    { "seconds": 73,"lyrics": "Whiskey in my hip flask" },
    { "seconds": 74,"lyrics": "nothing fruity" },
    { "seconds": 75,"lyrics": "Fuck a princess,I'm a king" },
    { "seconds": 77,"lyrics": "Bow down and kiss on my ring" },
    { "seconds": 79,"lyrics": "Being a bitch is my kink" },
    { "seconds": 81,"lyrics": "What the fuck else did you think?" },
    { "seconds": 83,"lyrics": "Fuck a princess,I'm a king" },
    { "seconds": 85,"lyrics": "Bow down and kiss on my ring" },
    { "seconds": 87,"lyrics": "It's gonna hurt,it'll sting" },
    { "seconds": 89,"lyrics": "Spittin' your blood in the sink" },
    { "seconds": 90,"lyrics": "I'm crazy,but you like that" },
    { "seconds": 92,"lyrics": "I bite back" },
    { "seconds": 94,"lyrics": "Daisies on your nightstand" },
    { "seconds": 96,"lyrics": "never forget it" },
    { "seconds": 98,"lyrics": "I blossom in the moonlight," },
    { "seconds": 100,"lyrics": "screw eyes" },
    { "seconds": 102,"lyrics": "Glacial with the blue ice" },
    { "seconds": 104,"lyrics": "I'm terrifying" },
    { "seconds": 106,"lyrics": "I'm crazy,but you like that" },
    { "seconds": 108,"lyrics": "I bite back" },
    { "seconds": 110,"lyrics": "Daisies on your nightstand" },
    { "seconds": 112,"lyrics": "never forget it" },
    { "seconds": 114,"lyrics": "I blossom in the moonlight" },
    { "seconds": 116,"lyrics": "screw eyes" },
    { "seconds": 118,"lyrics": "Glacial with the blue ice" },
    { "seconds": 118,"lyrics": "I'm terrifying" },
    { "seconds": 122,"lyrics": "La,la,la" },
    { "seconds": 124,"lyrics": "> La,la,la <" },
    { "seconds": 125,"lyrics": ">> La,la,la <<" },
    { "seconds": 127,"lyrics": ">>> La,la,la <<<" },
    { "seconds": 129,"lyrics": "I'm terrifying" },
    { "seconds": 130,"lyrics": "La,la,la" },
    { "seconds": 131,"lyrics": "> La,la,la <" },
    { "seconds": 133,"lyrics": ">> La,la,la <<" },
    { "seconds": 135,"lyrics": ">>> La,la,la <<<" },
    { "seconds": 136,"lyrics": "I'm terrifying" }
];

const Bertaraf = [
    { "seconds": 1,"lyrics": "(Jexkilla)" },
    { "seconds": 6,"lyrics": "(Audaz on beat's)" },
    { "seconds": 10,"lyrics": "" },
    { "seconds": 13,"lyrics": "(Ya,Etki on the track)" },
    { "seconds": 17,"lyrics": "(YT)" },
    { "seconds": 17,"lyrics": "Yaşıyoruz ellam ellam,shawty Ciao" },
    { "seconds": 18,"lyrics": "Bella" },
    { "seconds": 21,"lyrics": "Tehdit mi edelim lan illa?" },
    { "seconds": 22,"lyrics": "(Ne ayaksın olum?)" },
    { "seconds": 24,"lyrics": "Seni gidi seni seni" },
    { "seconds": 25,"lyrics": "Manitana kızıp bize oluyo'n Alemdar" },
    { "seconds": 27,"lyrics": "Tamam kardeş,kızma; sensin,okey" },
    { "seconds": 29,"lyrics": "Bi' an biter,hayallerin paket" },
    { "seconds": 31,"lyrics": "Zaman zaman gelir üstüme dert" },
    { "seconds": 34,"lyrics": "Çektim tetiği,bir el ettim ateş" },
    { "seconds": 36,"lyrics": "Beklediğime değdi,artık bizde güç" },
    { "seconds": 38,"lyrics": "Yarım açık cam,selam 19 Gen 3" },
    { "seconds": 40,"lyrics": "Benim olan ben-de vermedim ödünç" },
    { "seconds": 42,"lyrics": "Ayık ol da yapmayasın lisan-ı sürç" },
    { "seconds": 46,"lyrics": "Alo,nerdesin be oğlum?" },
    { "seconds": 48,"lyrics": "Üçten beri arıyoruz,hiçbi' yerde" },
    { "seconds": 49,"lyrics": "yoksun" },
    { "seconds": 50,"lyrics": "Kuzen,duymamışım n'oldu?" },
    { "seconds": 52,"lyrics": "İki saate ordayım,cihazları doldur" },
    { "seconds": 54,"lyrics": "Bu kez olmadı Ya Rab bertaraf" },
    { "seconds": 57,"lyrics": "Çile,gam,keder; hepsi bi' ara" },
    { "seconds": 59,"lyrics": "Hey canan,bertaraf" },
    { "seconds": 62,"lyrics": "Giden de geri gelmedi hâlâ" },
    { "seconds": 64,"lyrics": "Olmadı Ya Rab,bertaraf" },
    { "seconds": 66,"lyrics": "Çile,gam,keder; hepsi bi' ara" },
    { "seconds": 68,"lyrics": "Hey canan,bertaraf" },
    { "seconds": 71,"lyrics": "Giden de geri gelmedi hâlâ" },
    { "seconds": 73,"lyrics": "Büyüdüm mahallede,İstanbul ne ki?" },
    { "seconds": 75,"lyrics": "Karakol,adliye ömrümüzü yedi" },
    { "seconds": 77,"lyrics": "Müziği kolpa boş konuşanların" },
    { "seconds": 80,"lyrics": "Bi' gece düşürüp hepsini yedik" },
    { "seconds": 82,"lyrics": "İstanbul okyanus,attım bi' olta" },
    { "seconds": 84,"lyrics": "Finali belli,avluda volta" },
    { "seconds": 87,"lyrics": "Sizden birisi kalana kadar rush" },
    { "seconds": 89,"lyrics": "Kurtaramaz sizi illegal kontak" },
    { "seconds": 91,"lyrics": "Hiç fark etmez" },
    { "seconds": 93,"lyrics": "Size dönse de devran (Allah Allah)" },
    { "seconds": 95,"lyrics": "Yansa da dünya düşse de kullar" },
    { "seconds": 98,"lyrics": "Bu başı önümüze eğdirme Ya Rab" },
    { "seconds": 100,"lyrics": "Hiç fark etmez (Valla)" },
    { "seconds": 102,"lyrics": "Size dönse devran (Hiç fark etmez)" },
    { "seconds": 104,"lyrics": "Yansa da mahalle,düşse de kullar" },
    { "seconds": 107,"lyrics": "Bu başı önümüze eğdirme Ya Rab" },
    { "seconds": 109,"lyrics": "Bu kez olmadı Ya Rab bertaraf" },
    { "seconds": 112,"lyrics": "Çile,gam,keder; hepsi bi' ara" },
    { "seconds": 114,"lyrics": "Hey canan,bertaraf" },
    { "seconds": 116,"lyrics": "Giden de geri gelmedi hâlâ" },
    { "seconds": 119,"lyrics": "Olmadı Ya Rab bertaraf" },
    { "seconds": 121,"lyrics": "Çile,gam,keder; hepsi bi' ara" },
    { "seconds": 123,"lyrics": "Hey canan,bertaraf" },
    { "seconds": 125,"lyrics": "Giden de geri gelmedi hâlâ" }
];

let likeJennie = [
    { "lyrics": "Hah,c'mon,it's gonna be","seconds": 0 },
    { "lyrics": "fucking hard","seconds": 4 },
    { "lyrics": "Special edition,and your AI","seconds": 9 },
    { "lyrics": "couldnt copy","seconds": 11 },
    { "lyrics": "I'm leaving clues in the fittin","seconds": 13 },
    { "lyrics": "room,and it's hot tea","seconds": 14 },
    { "lyrics": "No,I'm not thinking 'bout no exes,","seconds": 17 },
    { "lyrics": "know they miss me","seconds": 18 },
    { "lyrics": "I got the whole world spinnin' like","seconds": 21 },
    { "lyrics": "it's tipsy (don't bore us,","seconds": 22 },
    { "lyrics": "take it to the chorus)","seconds": 23 },
    { "lyrics": "Who wanna rock with JENNIE?","seconds": 26 },
    { "lyrics": "Keep your hair done,nails done","seconds": 28 },
    { "lyrics": "like JENNIE","seconds": 29 },
    { "lyrics": "Who else got 'em obsessed,","seconds": 30 },
    { "lyrics": "like JENNIE?","seconds": 31 },
    { "lyrics": "Like,like,like (JENNIE,JENNIE,","seconds": 32 },
    { "lyrics": "JENNIE,JENNIE)","seconds": 33 },
    { "lyrics": "I think I really like","seconds": 34 },
    { "lyrics": "JENNIE JENNIE JENNIE","seconds": 35 },
    { "lyrics": "Haters,they don't really like","seconds": 36 },
    { "lyrics": "JENNIE,JENNIE,JENNIE,JENNIE","seconds": 37 },
    { "lyrics": "'Cause they could never,ever be","seconds": 38 },
    { "lyrics": "(JENNIE,JENNIE,JENNIE)","seconds": 39 },
    { "lyrics": "But have you ever met?","seconds": 40 },
    { "lyrics": "JENNIE,JENNIE,JENNIE,JENNIE,","seconds": 41 },
    { "lyrics": "JENNIE (JENNIE,JENNIE)","seconds": 42 },
    { "lyrics": "It's JENNIE,JENNIE,","seconds": 44 },
    { "lyrics": "JENNIE,JENNIE,JENNIE","seconds": 45 },
    { "lyrics": "But have you ever met?","seconds": 47 },
    { "lyrics": "But have you ever met?","seconds": 51 },
    { "lyrics": "But have you ever met?","seconds": 55 },
    { "lyrics": "얼말 줘도 못해,서커스짓","seconds": 55 },
    { "lyrics": "포징 한 번에 만들어,mosh pit","seconds": 57 },
    { "lyrics": "They can't deal with me,'cause I'm","seconds": 59 },
    { "lyrics": "priceless","seconds": 60 },
    { "lyrics": "여러 셀럽들 속에,내 DNA","seconds": 61 },
    { "lyrics": "Get,get outta my way","seconds": 63 },
    { "lyrics": "바비가 처키가 되기 전에","seconds": 65 },
    { "lyrics": "Name,shame,blame,tryna burst my","seconds": 68 },
    { "lyrics": "bubble","seconds": 69 },
    { "lyrics": "터트려봐,그럼 더 큰 홀에서 만나는 거야","seconds": 70 },
    { "lyrics": "제니를 keep shading","seconds": 72 },
    { "lyrics": "예술작품엔 필요해,frame이","seconds": 74 },
    { "lyrics": "I've slayed it,and I graved it","seconds": 75 },
    { "lyrics": "Yes,I'm guilty,잘난 게 죄니 (mmh)","seconds": 76 },
    { "lyrics": "Who wanna rock with JENNIE?","seconds": 78 },
    { "lyrics": "Keep your hair done,nails done","seconds": 80 },
    { "lyrics": "like JENNIE","seconds": 82 },
    { "lyrics": "Who else got em obsessed,","seconds": 83 },
    { "lyrics": "like JENNIE?","seconds": 85 },
    { "lyrics": "Like,like,like","seconds": 86 },
    { "lyrics": "I think I really like (JENNIE)","seconds": 87 },
    { "lyrics": "Haters,they don't really","seconds": 89 },
    { "lyrics": "like JENNIE","seconds": 91 },
    { "lyrics": "Cause they could never,","seconds": 93 },
    { "lyrics": "ever be JENNIE","seconds": 94 },
    { "lyrics": "But have you ever met?","seconds": 95 },
    { "lyrics": "JENNIE,JENNIE,JENNIE,JENNIE,","seconds": 96 },
    { "lyrics": "JENNIE,JENNIE,JENNIE","seconds": 97 },
    { "lyrics": "It's JENNIE,JENNIE,JENNIE,","seconds": 99 },
    { "lyrics": "JENNIE,JENNIE,JENNIE,JENNIE","seconds": 100 },
    { "lyrics": "Like JENNIE,JENNIE,JENNIE,","seconds": 103 },
    { "lyrics": "JENNIE,JENNIE","seconds": 104 },
    { "lyrics": "Rock with JENNIE","seconds": 106 },
    { "lyrics": "Keep your hair done,nails done","seconds": 108 },
    { "lyrics": "like JENNIE","seconds": 110 },
    { "lyrics": "Who else got 'em obsessed,like-","seconds": 112 },
    { "lyrics": "But have you ever met? (JENNIE)","seconds": 114 },
    { "lyrics": "But have you ever met?","seconds": 116 },
    { "lyrics": "JENNIE,JENNIE,JENNIE","seconds": 118 },
    { "lyrics": "It's JENNIE,JENNIE,JENNIE,JENNIE","seconds": 120 }
];


const songState = {
    intervalId: null,
    currentIndex: 0,
    currentSong: null,
    lyricsArray: null
};

function playSong(name,mode = "start") {
    if (songState.intervalId) {
        clearInterval(songState.intervalId);
        songState.intervalId = null;
    }

    if (mode === "stop") {
        songState.currentIndex = 0;
        songState.currentSong = null;
        songState.lyricsArray = null;
        Packets.sendmsg("");
        return;
    }

    songState.currentIndex = 0;
    songState.currentSong = name;

    switch(name) {
        case "Shamrain - To Leave":
            songState.lyricsArray = ShamraimtoLeave;
            break;
        case "Hardwell & KSHMR - Power":
            songState.lyricsArray = isThisPower;
            break;
        case "Woodkid - To ashes and blood":
            songState.lyricsArray = toAshesAndBlood;
            break;
        case "Ashnikko - Daisy":
            songState.lyricsArray = Daisy;
            break;
        case "Canbay & Wolker feat. Heijan & Muti - Bertaraf":
            songState.lyricsArray = Bertaraf;
            break;
        case "Jennie - like JENNIE":
            songState.lyricsArray = likeJennie;
            break;
        default:
            newNotif("Song not found","error",3000);
            return;
    }

    const startTime = Math.floor(Date.now() / 1000);

    songState.intervalId = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000) - startTime;

        if (songState.currentIndex < songState.lyricsArray.length) {
            const item = songState.lyricsArray[songState.currentIndex];
            if (currentTime >= item.seconds) {
                Packets.sendmsg(item.lyrics);
                songState.currentIndex++;
            }
        } else {
            clearInterval(songState.intervalId);
            songState.intervalId = null;
        }
    },1000);
}

// Astral_Load
setTimeout(() => {
    document.documentElement.appendChild(statusMenu);
},2e3);

const notificationstyle = document.createElement('style');
notificationstyle.innerHTML = `
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
}

.notification {
    background: rgba(50, 50, 70, 0.5); /* Yarı şeffaf, koyu mor/gri bir ton */
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    color: #f0f0f5; /* Koyu arka plan için açık metin rengi */
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 14px;
    border-radius: 16px;
    padding: 15px 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.15);
    min-width: 280px;
    max-width: 320px;
    margin: 0;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 15px;
    opacity: 0;
    transform: translateX(50px) scale(0.9);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: currentColor;
    opacity: 1;
}

.notification.show {
    opacity: 1;
    transform: translateX(0) scale(1);
}

.notification.hide {
    opacity: 0;
    transform: translateX(50px) scale(0.9);
}

.notification-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

.notification-content {
    flex-grow: 1;
}

.notification.success {
    color: #4ade80;
}
.notification.error {
    color: #f87171;
}
.notification.warning {
    color: #facc15;
}
.notification.info {
    color: #60a5fa;
}

.notification.translate {
    color: #c084fc;
    background: rgba(60, 50, 80, 0.5);
}

.notification button.close {
    background: none;
    border: none;
    color: currentColor;
    opacity: 0.6;
    padding: 4px;
    margin: -4px -4px -4px 10px;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.notification button.close:hover {
    opacity: 1;
}

.notification button.close svg {
    width: 16px;
    height: 16px;
    display: block;
}

.notification:hover {
    /* Hover efektini daha belirgin yapalım */
    transform: translateX(0) scale(1.03);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}
`;
document.documentElement.appendChild(notificationstyle);


document.addEventListener("DOMContentLoaded",() => {
    const chatContainerHTML = `
<div id="AlyAI"
     style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 450px;
        backdrop-filter: blur(10px);
        border: 1px solid #444;
        background: #66000000;
        z-index: 9999;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        transition: all 1.2s;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;"> <!-- Horizontally centers content -->

    <div id="chatBox"
         style="
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            color: #ffffff;
            font-family: Arial,sans-serif;
            background: #66000000;
            opacity: 0;
            transition: all 1.2s ease;
            width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 10px;">
        <!-- Messages will appear here -->
    </div>

<div style="display: flex; align-items: center;">
    <input type="text"
           placeholder="Message Aly..."
           style="
                flex: 1;
                margin: 10px;
                padding: 12px 20px;
                border-radius: 8px;
                border: 1px solid #888;
                background-color: #444;
                color: #f2f2f2;
                font-family: 'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
                font-size: 16px;
                transition: all 1.2s ease;
                caret-color: #007bff;
                outline: none;
                line-height: 1.5;
           ">
    <button style="
                margin: 10px;
                padding: 10px 15px;
                border-radius: 8px;
                border: 1px solid #444;
                background-color: #333;
                color: #ffffff;
                font-family: 'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
                cursor: pointer;
                transition: all 1.2s ease;
                outline: none;
                box-shadow: 0 0 5px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
           ">
        📩
    </button>
</div>


</div>

<!-- Custom scrollbar CSS -->
<style>
    #chatBox {
        scrollbar-width: thin;  /* Firefox */
        scrollbar-color: #66000000  #66000000;
    }

    #chatBox::-webkit-scrollbar {
        width: 8px;
    }

    #chatBox::-webkit-scrollbar-thumb {
        background-color: #66000000;
        border-radius: 10px;
    }

    #chatBox::-webkit-scrollbar-track {
        background: #66000000;
        border-radius: 10px;
    }

    input[type="text"]:focus {
        outline: none;
        border-color: #007bff;
        background-color: #333;
        box-shadow: 0 0 5px rgba(0,123,255,0.5);
        caret-color: #00bfff;
        transition: border-color 0.5s ease,background-color 0.5s ease,box-shadow 0.5s ease;
    }

    input[type="text"] {
        caret-color: #007bff;
        transition: caret-color 0.5s ease,transform 0.5s ease;
    }

    input[type="text"]:not(:focus) {
        caret-color: transparent;
    }

    input[type="text"]:focus {
        transform: scale(1.05);
    }

    button:hover {
        background-color: #555;
        transform: scale(1.05);
        box-shadow: 0 0 8px rgba(0,123,255,0.6);
        transition: background-color 0.4s ease,transform 0.4s ease,box-shadow 0.4s ease;
    }

    button:focus {
        outline: none;
        border-color: #007bff;
        background-color: #444;
        box-shadow: 0 0 5px rgba(0,123,255,0.5);
        transition: border-color 0.4s ease,background-color 0.4s ease,box-shadow 0.4s ease;
    }

    button:active {
        background-color: #222;
        transform: scale(0.98);
        transition: transform 0.1s ease,background-color 0.1s ease;
    }

@keyframes rainbowBorderEffect {
    0% {
        border-color: red;
        box-shadow: 0 0 5% red,0 0 10% red,0 0 15% red;
    }
    16.6% {
        border-color: orange;
        box-shadow: 0 0 20px orange,0 0 40px orange,0 0 60px orange;
    }
    33.3% {
        border-color: yellow;
        box-shadow: 0 0 20px yellow,0 0 40px yellow,0 0 60px yellow;
    }
    50% {
        border-color: green;
        box-shadow: 0 0 20px green,0 0 40px green,0 0 60px green;
    }
    66.6% {
        border-color: blue;
        box-shadow: 0 0 20px blue,0 0 40px blue,0 0 60px blue;
    }
    83.3% {
        border-color: indigo;
        box-shadow: 0 0 20px indigo,0 0 40px indigo,0 0 60px indigo;
    }
    100% {
        border-color: red;
        box-shadow: 0 0 20px red,0 0 40px red,0 0 60px red;
    }
}

    .rainbow-border {
        border: 8px solid red;
        border-radius: 20px;
        animation: rainbowBorderEffect 3s linear infinite;
    }

</style>

`;

    document.body.insertAdjacentHTML('beforeend',chatContainerHTML);

    var chatContainer = document.getElementById('AlyAI');
    var chatBox = document.getElementById('chatBox');
    var inputBox = chatContainer.querySelector('input');
    var sendButton = chatContainer.querySelector('button');

    chatContainer.style.width = '150px';
    chatContainer.style.height = '50px';
    chatContainer.style.borderRadius = "100px";
    chatBox.style.opacity = '0';
    sendButton.style.opacity = '0';
    inputBox.style.opacity = '0';
    chatContainer.classList.add('rainbow-border');

    chatContainer.addEventListener('mouseenter',() => {
        chatContainer.style.width = '95%';
        chatContainer.style.height = '250px';
        chatContainer.style.borderRadius = '10px';
        chatBox.style.opacity = '1';
        sendButton.style.opacity = '1';
        inputBox.style.opacity = '1';
    });

    chatContainer.addEventListener('mouseleave',() => {
        chatContainer.style.width = '150px';
        chatContainer.style.height = '50px';
        chatContainer.style.borderRadius = "100px";
        chatBox.style.opacity = '0';
        sendButton.style.opacity = '0';
        inputBox.style.opacity = '0';
    });



    inputBox.addEventListener('focus',() => {
        inputBox.style.borderColor = '#007bff';
    });
    inputBox.addEventListener('blur',() => {
        inputBox.style.borderColor = '#444';
    });
    sendButton.addEventListener('mouseover',() => {
        sendButton.style.backgroundColor = '#212121';
    });
    sendButton.addEventListener('mouseout',() => {
        sendButton.style.backgroundColor = '#333';
    });


    // I've removed Astral Intelligence so Aly is NOT AI
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('ban')) {
            return "Have you been banned from Sploop? Don't worry,Ban systems don't rule the world. If you have a Dynamic IP Address,turn off your Internet and turn it back on after 15 seconds and you will be Unbanned. If you have a static IP Address. We recommend using applications such as VPN and Proxy.";
        } else if (lowerMessage.includes('vpn')) {
            return "Here 50 VPN Lists for Chrome: ExpressVPN,Surfshark,NordVPN,PureVPN,TunnelBear,ZenMate,Hotspot Shield,CyberGhost,ProtonVPN,Windscribe,Hola VPN,SetupVPN,uVPN,VeePN,Astar VPN,ValeVPN,VPN Proxy Master,Betternet,Touch VPN,Browsec VPN,Goose VPN,Speedify,Private Internet Access (PIA),SaferVPN,Hoxx VPN,VPN Unlimited,Avira Phantom VPN,Norton Secure VPN,KeepSolid VPN Unlimited,ZenMate VPN,CactusVPN,Buffered VPN,F-Secure Freedome,Atlas VPN,Hide.me VPN,StrongVPN,Mullvad VPN,TorGuard,IPVanish,Norton Secure VPN,CyberGhost VPN,SurfEasy VPN,SecureLine VPN,VPNhub,Anonymizer VPN,Panda VPN,Aloha Browser,Browsec VPN,VPN Proxy,Free VPN Proxy - VPNLY";
        } else if (lowerMessage.includes('toggle autoheal') || lowerMessage.includes('toggle the autoheal') || lowerMessage.includes('toggle auto heal') || lowerMessage.includes('toggle the auto heal')) {
            Features.auto_heal = !Features.auto_heal;
            newNotif(`Autoheal has been changed to ${Features.auto_heal}`,'success',1900)
            return `Of course! I set Auto Heal to ${Features.auto_heal}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle autoplacer') || lowerMessage.includes('toggle the autoplacer') || lowerMessage.includes('toggle auto placer') || lowerMessage.includes('toggle the auto placer') || lowerMessage.includes('toggle autoplace') || lowerMessage.includes('toggle the autoplace') || lowerMessage.includes('toggle auto place') || lowerMessage.includes('toggle the auto place')) {
            Features.auto_placer = !Features.auto_placer;
            newNotif(`Autoplacer has been changed to ${Features.auto_placer}`,'success',1900)
            return `Of course! I set Auto Place to ${Features.auto_placer}! Do you have any other requests?`;
        } else if (lowerMessage.includes('feature') || lowerMessage.includes('feature')) {
            return "Features include only Astral Intelligence Auto Heal,High CPS Placement,and Packet Preventive."
        } else if (lowerMessage.includes('toggles') || lowerMessage.includes("toggle's")) {
            return `Features that are either open or closed: Auto Heal: ${Features.auto_heal},Auto Placer: ${Features.auto_placer}`
        } else if (lowerMessage.includes('can') && lowerMessage.includes("do")) {
            return `I'm doing my best to help you,As an assistant,I am happy to make your experience even better by reading sploop.io.`
        } else if (lowerMessage.includes('toggle autobreak') || lowerMessage.includes('toggle the autobreak') || lowerMessage.includes('toggle auto break') || lowerMessage.includes('toggle the auto break')) {
            Features.auto_break = !Features.auto_break;
            newNotif(`AutoBreak has been changed to ${Features.auto_break}`,'success',1900)
            return `Of course! I set AutoBreak to ${Features.auto_break}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle naginata sync') || lowerMessage.includes('toggle the naginata sync')) {
            Features.naginata_sync = !Features.naginata_sync;
            newNotif(`Naginata Sync has been changed to ${Features.naginata_sync}`,'success',1900)
            return `Of course! I set Naginata Sync to ${Features.naginata_sync}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle musket sync') || lowerMessage.includes('toggle the musket sync')) {
            Features.musket_sync = !Features.musket_sync;
            newNotif(`musket Sync has been changed to ${Features.musket_sync}`,'success',1900)
            return `Of course! I set musket Sync to ${Features.musket_sync}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle auto replace') || lowerMessage.includes('toggle the auto replace') || lowerMessage.includes('toggle autoreplace') || lowerMessage.includes('toggle the autoreplace') || lowerMessage.includes('toggle replace') || lowerMessage.includes('toggle the replace') || lowerMessage.includes('toggle replace') || lowerMessage.includes('toggle the replace')) {
            Features.auto_replace = !Features.auto_replace;
            newNotif(`Auto replace has been changed to ${Features.auto_replace}`,'success',1900)
            return `Of course! I set Auto replace to ${Features.auto_replace}! Do you have any other requests?`;
        } else if (lowerMessage.includes('toggle autopush') || lowerMessage.includes('toggle the autopush') || lowerMessage.includes('toggle auto push') || lowerMessage.includes('toggle the auto push')) {
            Features.auto_push = !Features.auto_push;
            newNotif(`Auto Push has been changed to ${Features.auto_push}`,'success',1900)
            return `Of course! I set Auto Push to ${Features.auto_push}! Do you have any other requests?`;
        }
        else {
            return "Command not found";
        }
    }

    function sendMessage(message) {
        const userMessage = document.createElement('div');
        userMessage.textContent = document.getElementById("nickname").value + ': ' + message;
        userMessage.style.color = '#ffffff';
        userMessage.style.border = "2px solid white";
        userMessage.style.background = "#212121";
        userMessage.style.borderRadius = "10px";
        userMessage.style.padding = "10px";
        userMessage.style.lineHeight = "1.5";
        userMessage.style.display = "inline-block";
        chatBox.appendChild(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        const aiMessage = getAIResponse(message);
        const aiResponse = document.createElement('div');
        aiResponse.textContent = 'Aly AI: ' + aiMessage;

        aiResponse.style.background = 'linear-gradient(270deg,rgb(255,0,0),rgb(255,255,0),rgb(0,255,0),rgb(0,255,255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))';
        aiResponse.style.backgroundSize = '600% 600%';
        aiResponse.style.webkitBackgroundClip = 'text'; // Safari
        aiResponse.style.color = 'transparent';
        aiResponse.style.fontWeight = 'bold';
        aiResponse.style.fontSize = '16px';
        aiResponse.style.padding = '5px';
        aiResponse.style.margin = '5px 0';
        aiResponse.style.animation = 'gradientAnimation 5s linear infinite';
        aiResponse.style.border = "2px solid white";
        aiResponse.style.borderRadius = "10px";
        aiResponse.style.padding = "10px";
        aiResponse.style.lineHeight = "1.5";
        aiResponse.style.display = "inline-block";

        const styleSheet = document.createElement("style");
        styleSheet.type = "text /css";
        styleSheet.innerText = `
        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            100% {
                background-position: 100% 50%;
            }
        }
    `;
        document.head.appendChild(styleSheet);

        chatBox.appendChild(aiResponse);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    inputBox.addEventListener('keypress',function(event) {
        if (event.key === 'Enter' && inputBox.value.trim() !== '') {
            sendMessage(inputBox.value.trim());
            inputBox.value = '';
        }
    });

    sendButton.addEventListener('click',function() {
        if (inputBox.value.trim() !== '') {
            sendMessage(inputBox.value.trim());
            inputBox.value = '';
        }
    });

    setTimeout(() => {
        const aiResponse = document.createElement('div');
        aiResponse.textContent = "Aly AI: Hello,I'm Aly! I'm the Assistant of Astral script! Thank you for using Astral!";

        aiResponse.style.background = 'linear-gradient(270deg,rgb(255,0,0),rgb(255,255,0),rgb(0,255,0),rgb(0,255,255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))';
        aiResponse.style.backgroundSize = '600% 600%';
        aiResponse.style.webkitBackgroundClip = 'text'; // Safari
        aiResponse.style.color = 'transparent';
        aiResponse.style.fontWeight = 'bold';
        aiResponse.style.fontSize = '16px';
        aiResponse.style.padding = '5px';
        aiResponse.style.margin = '5px 0';
        aiResponse.style.animation = 'gradientAnimation 5s linear infinite';
        aiResponse.style.border = "2px solid white";
        aiResponse.style.borderRadius = "10px";
        aiResponse.style.padding = "10px";
        aiResponse.style.lineHeight = "1.5";
        aiResponse.style.display = "inline-block";

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            100% {
                background-position: 100% 50%;
            }
        }
    `;
        document.head.appendChild(styleSheet);

        chatBox.appendChild(aiResponse);
        chatBox.scrollTop = chatBox.scrollHeight;
    },3e3);
});

function LoadingUI() {
    const overlay = document.createElement('div');
    overlay.id = 'cosmic-loading-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999999999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
    overlay.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    // Create cosmic background elements
    const cosmicBg = document.createElement('div');
    cosmicBg.style.position = 'absolute';
    cosmicBg.style.top = '0';
    cosmicBg.style.left = '0';
    cosmicBg.style.width = '100%';
    cosmicBg.style.height = '100%';
    cosmicBg.style.overflow = 'hidden';
    overlay.appendChild(cosmicBg);

    // Create loading content
    const loadingContent = document.createElement('div');
    loadingContent.className = 'loading-content';
    loadingContent.style.textAlign = 'center';
    loadingContent.style.padding = '40px';
    loadingContent.style.background = 'rgba(10, 8, 30, 0.8)';
    loadingContent.style.borderRadius = '20px';
    loadingContent.style.boxShadow = '0 0 50px rgba(80, 60, 200, 0.6)';
    loadingContent.style.border = '1px solid rgba(100, 100, 255, 0.2)';
    loadingContent.style.maxWidth = '500px';
    loadingContent.style.width = '90%';
    loadingContent.style.backdropFilter = 'blur(10px)';


    // Add loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.width = '80px';
    spinner.style.height = '80px';
    spinner.style.border = '8px solid rgba(100, 100, 255, 0.2)';
    spinner.style.borderTop = '8px solid #5d9bff';
    spinner.style.borderRadius = '50%';
    spinner.style.margin = '0 auto 30px';
    spinner.style.animation = 'spin 1.5s linear infinite';
    loadingContent.appendChild(spinner);

    // Add loading title
    const title = document.createElement('h2');
    title.className = 'loading-title';
    title.style.fontSize = '2.5rem';
    title.style.color = '#5d9bff';
    title.style.marginBottom = '20px';
    title.style.textShadow = '0 0 20px rgba(93, 155, 255, 0.5)';
    title.textContent = 'Loading sploop.io';
    loadingContent.appendChild(title);

    // Add loading message
    const message = document.createElement('p');
    message.className = 'loading-message';
    message.style.color = '#b0c4ff';
    message.style.fontSize = '1.2rem';
    message.style.marginBottom = '30px';
    message.style.lineHeight = '1.6';
    message.textContent = 'Preparing your gaming experience...';
    loadingContent.appendChild(message);

    // Add progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.style.width = '100%';
    progressContainer.style.height = '10px';
    progressContainer.style.background = 'rgba(100, 100, 255, 0.2)';
    progressContainer.style.borderRadius = '5px';
    progressContainer.style.margin = '20px 0';
    progressContainer.style.overflow = 'hidden';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = 'cosmic-progress-bar';
    progressBar.style.height = '100%';
    progressBar.style.background = 'linear-gradient(90deg, #8a2be2, #5d9bff)';
    progressBar.style.width = '0%';
    progressBar.style.borderRadius = '5px';
    progressBar.style.transition = 'width 0.3s ease';

    progressContainer.appendChild(progressBar);
    loadingContent.appendChild(progressContainer);

    overlay.appendChild(loadingContent);

    // Add to document
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);

    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'cosmic-star';
        star.style.position = 'absolute';
        star.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        star.style.borderRadius = '50%';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`;
        cosmicBg.appendChild(star);
    }

    for (let i = 0; i < 5; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'cosmic-nebula';
        nebula.style.position = 'absolute';
        nebula.style.borderRadius = '50%';
        nebula.style.filter = 'blur(50px)';
        nebula.style.opacity = '0.3';
        nebula.style.width = Math.random() * 200 + 100 + 'px';
        nebula.style.height = nebula.style.width;
        nebula.style.left = Math.random() * 100 + '%';
        nebula.style.top = Math.random() * 100 + '%';
        nebula.style.background = `radial-gradient(circle,
            rgba(${Math.floor(Math.random() * 100 + 100)},
            ${Math.floor(Math.random() * 100)},
            ${Math.floor(Math.random() * 200 + 55)},
            ${Math.random() * 0.3 + 0.2}),
            transparent)`;
        cosmicBg.appendChild(nebula);
    }

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 1;
        progressBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                title.textContent = 'Ready to Play!';
                message.textContent = 'sploop.io has loaded successfully';

                spinner.style.display = 'none';

                const checkmarkContainer = document.createElement('div');
                checkmarkContainer.className = 'checkmark';

                const checkmark = document.createElement('div');
                checkmark.className = 'checkmark-icon';
                checkmarkContainer.appendChild(checkmark);

                loadingContent.insertBefore(checkmarkContainer, title);

                setTimeout(() => {
                    overlay.style.opacity = '0';

                    setTimeout(() => {
                        overlay.remove();
                        document.body.style.overflow = '';
                    }, 1500);
                }, 1500);
            }, 500);
        }
    }, 30);
}

setTimeout(() => { LoadingUI() }, 1500);


class HTMLManager {
    static loadMain() {
        Vars.loaded = true;

        Mouse.listeners();
    }
}


class Tools {
    static distance(position1,position2) {
        if (position1 === undefined || position2 === undefined) {
            return NaN;
        }
        return Math.sqrt(Math.pow(position2.y - position1.y,2) + Math.pow(position2.x - position1.x,2));
    }


    static direction(position1,position2) {
        const { x,y } = position1;

        return Math.atan2(y - position2.y,x - position2.x);
    }

    static CalculateAngle(a,b) {
        if (a && b) return Math.atan2(a.y - b.y,a.x - b.x);
    }

    static toRad(angle) {
        const radians = angle * (Math.PI / 180);

        return radians;
    }

    static clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    // WebSocket
    static parseAngle(direction) {
        const angle = 65535 * (direction + Math.PI) / (2 * Math.PI);

        return [255 & angle,angle >> 8 & 255];
    }

    static parseMessage(message) {
        const isString = typeof message === 'string';
        const data = isString ? JSON.parse(message) : new Uint8Array(message);

        data.type = data[0];

        return data;
    }

    static quad() {

        for (let i = 0; i < this.toRad(360); i += this.toRad(10)) {
            if (Tools.canPlace(i,true,scalee.trap)) {
                Packets.place(7,i);
                break;
            }
        }
    }

    static tickWithPing(ping,add = 0) {
        return Game_Tick - ((ping * 0.5) % Game_Tick) + add;
    }

    static canPlace(where,IsPlayer,scale = 70) {
        let placeCoord = {
            y: Client.y + scale * Math.sin(where),
            x: Client.x + scale * Math.cos(where),
        };
        return IsPlayer
            ? Vars.entities.filter((entity) => entity && entity.type !== 0 && this.distance(placeCoord,entity) < 90)
        : Vars.entities.filter((entity) => entity && ([3,4,1,19,20,38,25,34,33,32,21,29,1].includes(entity.type)
                                                      ? this.distance(placeCoord,entity) < 128
                                                      : this.distance(placeCoord,entity) < 90));
    }


    static mine(entity) {
        if (entity.sid === Client.sid) return true;
        for (let i = 0; i < Vars.clan.length; i++) {
            if (Vars.clan[i] === entity.sid) return true;
        }
        if (entity.type !== 0) return false;
    }


    static translate(text,lang = "auto") {
        if (text == null || text.trim() == "") {
            return Promise.resolve("");
        }

        return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`)
            .then(doors => {
            return doors.json();
        })
            .then(translated => {
            const ae86 = translated[0][0][0];
            return ae86;
        })

    }

    static parseUpdate(data) {
        for (let index = 1; index < data.length; index += 19) {
            // Get info
            const type = data[index + 0];
            const sid = data[index + 1];

            const id = data[index + 2] | (data[index + 3] << 8);
            const x = data[index + 4] | (data[index + 5] << 8);
            const y = data[index + 6] | (data[index + 7] << 8);

            const angle = data[index + 9] / 255 * 6.283185307179586 - Math.PI;

            const broke = data[index + 8];

            const weapon = data[index + 10];
            const hat = data[index + 11];
            const team = data[index + 12];

            const health = data[index + 13] / 255 * 100;

            if (2 & broke) {
                Vars.entities[id] = null;
            } else {
                const entity = Vars.entities[id] || {};

                Object.assign(entity,{ type,sid,id,x,y,weapon,hat,team,health,angle });
                debug.yours = `ID: ${Client.sid} \n XY : ${Client.x}/${Client.y} \n weapon: ${Client.weapon} \n Hat: ${Client.hat} \n Health: ${Client.health}`;
                debug.enemys = `ID: ${Vars.enemy && Vars.enemy.sid} \n XY : ${Vars.enemy && Vars.enemy.x}/${Vars.enemy && Vars.enemy.y} \n weapon: ${Vars.enemy && Vars.enemy.weapon} \n Hat: ${Vars.enemy && Vars.enemy.hat} \n Health: ${Vars.enemy && Vars.enemy.health}`;
                Vars.entities[id] = entity;

                const clan = (!Client.team || team != Client.team);

                if (Client.id === id) {
                    Object.assign(Client,entity);
                } else if (!type && clan) {
                    const newDist = Math.hypot(Client.y - y,Client.x - x);

                    if (!Vars.enemy) {
                        Vars.enemy = entity;
                    } else {
                        const enemyDist = Math.hypot(Client.y - Vars.enemy.y,Client.x - Vars.enemy.x);
                        if (newDist < enemyDist) {

                            Vars.secEnemy = Vars.enemy;
                            Vars.enemy = entity;
                        } else {
                            if (!Vars.secEnemy) {
                                Vars.secEnemy = entity;
                            } else {
                                const secEnemyDist = Math.hypot(Client.y - Vars.secEnemy.y,Client.x - Vars.secEnemy.x);
                                if (newDist < secEnemyDist) {
                                    Vars.secEnemy = entity;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}
let grid = [];
let List = { open: [],closed: [] };
let myGridPos;
let isSolvable = false;

let scales = new Map(Object.entries({
    0: 35,1: 75,2: 45,3: 90,4: 76,5: 50,
    6: 40,7: 45,8: 45,9: 60,10: 40,11: 40,
    12: 0,13: 45,14: 90,15: 50,16: 54,17: 42,
    18: 45,19: 80,20: 80,21: 60,22: 59,
}));

const weapons = [
    { name: "Tool Hammer", range: 80, reload: 300, damage: 25, id: 0 },
    { name: "Stone sword", range: 135, reload: 300, damage: 35, id: 1 },
    { name: "Stone Spear", range: 160, reload: 700, damage: 49, id: 2 },
    { name: "Stone Axe", range: 90, reload: 400, damage: 30, id: 3 },
    { name: "Stone Musket", range: 1000, reload: 1500, damage: 49, id: 4 },
    {}, // ID 5
    {}, // ID 6
    {}, // ID 7
    {}, // ID 8
    {}, // ID 9
    {}, // ID 10
    { name: "Shield", range: 55, reload: 500, damage: 15, id: 11 },
    {}, // ID 12
    { name: "Stick", range: 100, reload: 400, damage: 1, id: 13 },
    {}, // ID 14
    { name: "Hammer", range: 80, reload: 400, damage: 12, id: 15 }, 
    {}, // ID 16
    { name: "Katana", range: 140, reload: 300, damage: 40, id: 17 },
    {}, // ID 18
    {}, // ID 19
    {}, // ID 20
    {}, // ID 21
    {}, // ID 22
    {}, // ID 23
    {}, // ID 24
    {}, // ID 25
    { name: "Bow", range: 800, reload: 600, damage: 25, id: 26 },
    { name: "XBow", range: 800, reload: 235, damage: 27, id: 27 },
    { name: "Naginata", range: 165, reload: 700, damage: 52, id: 28 },
    {}, // ID 29
    { name: "Great Axe", range: 94, reload: 400, damage: 38, id: 30 }, 
    { name: "Bat", range: 115, reload: 600, damage: 28, id: 31 }, 
    { name: "Diamond Axe", range: 90, reload: 400, damage: 36, id: 32 },
    { name: "Gold Axe", range: 90, reload: 400, damage: 33, id: 33 }, 
    { name: "Diamond Great Axe", range: 94, reload: 400, damage: 46, id: 34 },
    { name: "Gold Great Axe", range: 94, reload: 400, damage: 42, id: 35 }, 
    { name: "Diamond Katana", range: 140, reload: 300, damage: 46.5, id: 36 },
    { name: "Gold Katana", range: 140, reload: 300, damage: 43, id: 37 },
    { name: "Diamond Spear", range: 160, reload: 700, damage: 53, id: 38 },
    { name: "Gold Spear", range: 160, reload: 700, damage: 51, id: 39 },
    { name: "Chillrend [Katana]", range: 140, reload: 300, damage: 48.5, id: 40 },
    { name: "Gold Stick", range: 100, reload: 400, damage: 1, id: 41 },
    { name: "Diamond Stick", range: 100, reload: 400, damage: 1, id: 42 },
    { name: "Ruby Stick", range: 100, reload: 400, damage: 1, id: 43 },
    { name: "Diamond Naginata", range: 165, reload: 700, damage: 56, id: 44 }, 
    { name: "Gold Naginata", range: 165, reload: 700, damage: 54, id: 45 },
    { name: "Gold Tool Hammer", range: 80, reload: 300, damage: 32, id: 46 },
    { name: "Diamond Tool Hammer", range: 80, reload: 300, damage: 38, id: 47 },
    { name: "Ruby Tool Hammer", range: 80, reload: 300, damage: 41, id: 48 },
    {}, // ID 49
    { name: "Ender Pearl", range: 800, reload: 7500, damage: 10, id: 50 },
    {}, // ID 51
    { name: "Dagger", range: 80, reload: 150, damage: 28, id: 52 },
    { name: "Gold Dagger", range: 80, reload: 150, damage: 30, id: 53 },
    { name: "Diamond Dagger", range: 80, reload: 150, damage: 32, id: 54 },
    { name: "Ruby Dagger", range: 80, reload: 150, damage: 34, id: 55 },
    { name: "Secret Weapon", range: 115, reload: 1250, damage: 28, id: 56 },
    { name: "Scythe", range: 160, reload: 450, damage: 52, id: 57 },
    {}, // ID 58
    { name: "Healing Staff", range: 140, reload: 500, damage: 21, id: 59 }, 
    { name: "Gold Healing Staff", range: 140, reload: 500, damage: 24, id: 60 }, 
    { name: "Diamond Healing Staff", range: 140, reload: 500, damage: 27, id: 61 }, 
    { name: "Ruby Healing Staff", range: 140, reload: 500, damage: 30, id: 62 },
    {}, // ID 63
    {}, // ID 64
    { name: "Golden Hammer", range: 80, reload: 400, damage: 15, id: 65 },
    { name: "Diamond Hammer", range: 80, reload: 400, damage: 18, id: 66 },
    { name: "Ruby Hammer", range: 80, reload: 400, damage: 21, id: 67 }, 
    { name: "Gold Bat", range: 115, reload: 600, damage: 28, id: 68 },
    { name: "Diamond Bat", range: 115, reload: 600, damage: 28, id: 69 }, 
    { name: "Ruby Bat", range: 115, reload: 600, damage: 28, id: 70 }, 
    { name: "Crystal Dagger", range: 80, reload: 150, damage: 34, id: 71 },
    { name: "Ruby Naginata", range: 165, reload: 700, damage: 59, id: 72 }, 
    { name: "Ruby Spear", range: 160, reload: 700, damage: 56, id: 73 }, 
    { name: "Gold Sword", range: 135, reload: 300, damage: 38, id: 74 },
    { name: "Diamond Sword", range: 135, reload: 300, damage: 42, id: 75 }, 
    { name: "Ruby Sword", range: 135, reload: 300, damage: 46, id: 76 },
    { name: "Diamond Axe 2", range: 90, reload: 400, damage: 39, id: 77 }, 
    { name: "Ruby Great Axe", range: 94, reload: 400, damage: 50, id: 78 }, 
];

// Check Hats
const checkhats = [
    {name: "Bush Gear"},
    {name: "Berserker"},
    {name: "Jungle Gear"},
    {name: "Crystal Gear"},
    {name: "Spike Gear"},
    {name: "Immunity Gear"},
    {name: "Boost Hat"},
    {name: "Apple Gear"},
    {name: "Scuba Gear"},
    {name: "Hood Gear"},
    {name: "Demolist"},
    {name: "Snow Hat"},
    {name: "Pumpking's Curse"}
];


let nextPlacement = performance.now()

const scalee = {
    spike: 45,
    trap: 40,
}

// Player / Client manager
class PlayerManager {
    constructor() {
        this.clan = [];
        this.health = 100;
        this.alive = false;
        this.keyWeapon = 0;
        this.prevhealth = 100;
        this.lastdamageofDayte = 0;
        this.shame = 0;
        this.intrap = false;
        this.delayshame = 135;
        this.autopushing = false;
        this.antitrapangle = 0
        this.spinning = false;
        this.spinAngle = 0;
        this.togglespinning;
        this.autohealinterval = false;
        this.healed = false;
        this.toggleantispiketick = false;
        this.lastbreakTrapAim = null;
        this.lastTrapPrePlace = null;
        this.lastautoplacedobject = Date.now();
        this.lastAutoplaceTime = 0;
    }
    validPos(position) {
        let distToPosition = Math.hypot(position[0] - Client.x,position[1] - Client.y)
        return (distToPosition >= 45 && distToPosition <= 75)
    }

    antiTrapCalculateAndPlace(id,angle) {
        for (let currentAngle = 0; currentAngle < Math.PI * 2; currentAngle += Math.PI / 180) {
            let decide = id === 7 ? scalee.trap : scalee.spike
            if (Tools.canPlace(currentAngle,false,decide).length <= 1) {
                debug.antitrap = currentAngle;
                Packets.place(id,currentAngle);
                break;
            }
        }
    }

    syncWithServerTicks() { // idk what the heck kusoi talkin about
        let currentTime = performance.now();
        let ping = statusMode.ping;
        let estimatedServerTime = currentTime - ping / 2;
        let nextExpectedTick = Math.ceil(estimatedServerTime / 1000/9) * 1000/9;
        nextPlacement = nextExpectedTick > nextPlacement ? nextExpectedTick : nextPlacement + 1000/9;
        let idealSendTime = nextPlacement - ping / 2 - 1;
        let clientSendTime = idealSendTime + ping / 2;
        const schedulePreplace = (t) => {
            if (performance.now() >= t) {

                nextPlacement.nextServerTick += 1000/9;
            } else {
                requestAnimationFrame(() => schedulePreplace(t));
            }
        };
        let timeUntilSend = clientSendTime - currentTime;
        if (timeUntilSend <= 0) {
            schedulePreplace(clientSendTime);
        } else {
            setTimeout(() => schedulePreplace(clientSendTime),timeUntilSend - 1);
        }
        requestAnimationFrame(nextPlacement);
    }

    updateGame() {
        /*
        Vars.enemy = our enemy data
        Client = our player data
        */
        if (!Client.alive) return;
        if (!toggleHack) return;
        let neardist = Tools.distance(Vars.enemy,Client)
        let nearangle = Tools.direction(Vars.enemy,Client)
        let forVelPrevEnemyX = Vars.enemy.x;
        let forVelPrevEnemyY = Vars.enemy.y;
        let forVelPrevTime = Date.now();
        let InTrapped = Vars.entities.find(a => a && Tools.distance(a,this) < 60 && a.type == 6 && !Tools.mine(a));
        // Ticks
        let nextTickTime = sincetick + Game_Tick;
        let serverTime = performance.now() - (statusMode.ping / 2);
        let pingBasedTick = nextTickTime - (statusMode.ping / 2) - 1;
        let final_delay = pingBasedTick - performance.now();

        let antiSpikeTick = Vars.entities.find(a => a && [2,7,17,42].includes(a.type) && !Tools.mine(a) && Tools.distance(a,this) < 80);
        const unspikeTickableWeapon = [0,1,2,3,4,13,17,30,31,32,33,34,35,36,37,38,39,40,31,42,43,47,48,52,53,54,55,56]
        const spikeTickableWeapon = [57,45,44,28]

        let mySpike = Vars.entities.find(a => a && [2,7,17].includes(a.type) && Tools.mine(a) && Tools.distance(a,this) < 115);
        let myTrap = Vars.entities.find(a => a && Tools.mine(a) && a.type == 6 && Tools.distance(a,Client) <= 115);
        Vars.secEnemy = false;
        if (Vars.secEnemy) var secdist = Tools.distance(Vars.secEnemy,Client)
        if (Features.auto_placer && Vars.enemy && neardist < 200 && !InTrapped) {
            const placeItem = (itemId, angle) => {
                Packets.place(itemId, angle);
            };
            const findPlacementAngle = (startAngle, item, placementCheck, searchArc, angleIncrement) => {
                let validAngles = [];

                for (let offset = -searchArc; offset <= searchArc; offset += angleIncrement) {
                    if (Tools.canPlace(startAngle + offset, placementCheck, item).length <= 1) {
                        validAngles.push(startAngle + offset);
                    }
                }

                if (validAngles.length > 0) {
                    return validAngles[Math.floor(Math.random() * validAngles.length)];
                }

                return null;
            };

            let isEnemyTrapped = Vars.entities.find(entity => entity && Tools.mine(entity) && Tools.distance(Vars.enemy, entity) <= 50 && entity.type === 6);

            if (neardist <= 120 && !isEnemyTrapped) {
                let trapAngle = findPlacementAngle(nearangle, scalee.trap, true, Math.PI / 3, Math.PI / 9);
                if (trapAngle !== null) {
                    placeItem(7, trapAngle);
                    return;
                }
            }

            if (neardist < 180 && isEnemyTrapped) {
                let spikeAngle = findPlacementAngle(nearangle, scalee.spike, false, Math.PI / 2, Math.PI / 10);
                if (spikeAngle !== null) {
                    placeItem(4, spikeAngle);
                }
            }
        }


        // Auto Break
        if (InTrapped && Features.auto_break) {
            const enemyTrapped = Vars.entities.find(entity =>
                                                    entity && Tools.mine(entity) &&
                                                    Tools.distance(Vars.enemy,entity) <= 50 &&
                                                    entity.type === 6
                                                   );

            const TrapAimbot = Tools.direction(InTrapped,this,0,0);
            this.lastbreakTrapAim = TrapAimbot
            if (!this.intrap) {
                newNotif("Breaking Trap/Spike.","info",3000)
                Client.keyWeapon = 1
                Packets.select(1)
                if (Client.weapon !== IDweapon.hammer) {
                    Packets.select(1)
                }
                if (Client.weapon === IDweapon.hammer) {
                    this.intrap = true;
                    debug.usesHammer = true
                } else {
                    Packets.select(0)
                    this.intrap = true;
                    debug.usesHammer = false;
                }
            }

            let EnemyTrapped = Vars.entities.find(a => a && Tools.mine(a) && Tools.distance(Vars.enemy,a) < 60 && a.type == 6);
            let SpikeBreakInTrap = Vars.entities.find(a => a && [2,7,17,42].includes(a.type) && !Tools.mine(a) && Tools.distance(a,this) < 115);
            debug.isEnemyTrappedWhileIinTrap = EnemyTrapped ? true : false;
            if (neardist < 165 && Features.naginata_sync && Vars.enemy.health < 65 || Vars.secEnemy.health < 65) {
                debug.isSyncingwhilebreaking = true;
                Packets.select(0)
                Packets.equip(hats.berserker)
                Packets.hit(Vars.enemy.health < 65 ? nearangle : Tools.direction(Vars.secEnemy,Client))
            } else {
                debug.isSyncingwhilebreaking = false;
            }
            if (statusMode.lasthat !== hats.demolist && !Features.always_immunity) Packets.equip(hats.demolist)
            if (enemyTrapped && neardist < 140) {
                setTimeout(() => {
                    Packets.place(type.trap,enemyTrapped)
                },Date.now() - sincetick - statusMode.ping);
            } else {
                if (neardist < 500) this.antiTrapCalculateAndPlace(type.trap,TrapAimbot)
            }
            if (SpikeBreakInTrap) {
                let spikeAimbot = Tools.direction(SpikeBreakInTrap,this,0,0);
                debug.isBreakingSpike = true;
                Packets.hit(spikeAimbot)
            } else {
                debug.isSyncingwhilebreaking = false;
                Packets.hit(TrapAimbot)
            }
        } else {
            if (this.intrap) {
                if (Features.always_immunity && statusMode.lasthat !== hats.immunity_gear && secdist < 250) Packets.equip(hats.immunity_gear)
                setTimeout(() => {
                    Packets.place(type.trap,this.lastbreakTrapAim)
                    Packets.place(type.food)
                },final_delay);
            }
            this.intrap = false
            debug.usesHammer = null;
            debug.isEnemyTrappedWhileIinTrap = null;
            debug.isBreakingSpike = null;
        }

        if((Vars.enemy.health<65||Vars.secEnemy.health<65)&&Features.naginata_sync&&(neardist<165||secdist<165)){
            Packets.select(0);Packets.equip(hats.berserker);
            Packets.hit(Vars.enemy.health<65?nearangle:(Vars.secEnemy.health<65?Tools.direction(Vars.secEnemy,Client):0));
        }
        if((Vars.enemy.health<49||Vars.secEnemy.health<49)&&Features.musket_sync&&(neardist<1000||secdist<1000)){
            Packets.select(1);
            Packets.hit(Vars.enemy.health<49?nearangle:(Vars.secEnemy.health<49?Tools.direction(Vars.secEnemy,Client):0));
        }
        if(antiSpikeTick&&neardist<=165&&this.toggleantispiketick&&Vars.enemy.hat===hats.berserker){
            setTimeout(()=>{for(let i=0;i<3;i++)Packets.place(2)},Game_Tick/2);
        }


        if (unspikeTickableWeapon.includes(Vars.enemy.weapon)) {
            if (this.toggleantispiketick) {
                this.toggleantispiketick = false;
                newNotif("Anti Spike Tick Set to " + this.toggleantispiketick);
            }
        } else if (spikeTickableWeapon.includes(Vars.enemy.weapon)) {
            if (!this.toggleantispiketick) {
                this.toggleantispiketick = true;
                newNotif("Anti Spike Tick Set to " + this.toggleantispiketick);
            }
        }

        if (this.health < 100 && !Features.new_heal) {
            setTimeout(() => {Packets.place(2)},statusMode.ping > Game_Tick ? 1 : 1e3/9);
        }

        // Auto Push
        if (!this.intrap && neardist < 220 && Features.auto_push) {
            let EnemyTrapped = Vars.entities.find(a => a && Tools.mine(a) && Tools.distance(Vars.enemy,a) < 60 && a.type == 6);
            let spikes = Vars.entities.filter((entity) => entity && [2,7,17].includes(entity.type) && Tools.mine(entity) && neardist <= 1000);
            let findEnemySpike = Vars.entities.filter((entity) => entity && [2,7,17].includes(entity.type) && !Tools.mine(entity) && neardist <= 115);
            let distance = neardist;
            if (spikes.length) {
                let spike = spikes.sort((a,b) => Tools.distance(a,Vars.enemy) - Tools.distance(b,Vars.enemy))[0];
                let angle = Tools.CalculateAngle(Vars.enemy,spike);
                distance = Tools.distance(Vars.enemy,spike) + 70;
                let position = {
                    x: spike.x + distance * Math.cos(angle),
                    y: spike.y + distance * Math.sin(angle),
                };

                distance = Tools.distance(position,Client);
                if (Vars.enemy && Tools.distance(EnemyTrapped,spike) <= 150 && findEnemySpike) {
                    if (!this.autopushing) newNotif("trying to push","info",3000)
                    debug.pushmode = distance > 90 ? "To Spike" : "To Enemy"
                    Packets.move(Tools.CalculateAngle(distance > 50 ? position : Vars.enemy,Client));
                    this.autopushing = true;
                } else {
                    if (this.autopushing) {
                        newNotif("Failed to find enemy","error",3000)
                        Packets.stopMove()
                    }
                    this.autopushing = false;
                    debug.pushmode = null;
                }
            }
        } else {
            this.autopushing = false
            debug.pushmode = null;
        }


        // Shame detection logic
        if (this.health < this.prevhealth) {
            this.lastdamageofDayte = Date.now();
        }

        if (this.health > this.prevhealth) {
            if (this.shame < 8) {
                if (Date.now() - this.lastdamageofDayte < this.delayshame) {
                    this.shame++;
                    document.getElementById("showShame").textContent = "Shame: " + this.shame;
                }
            } else {
                this.shame = 0;
                document.getElementById("showShame").textContent = "Shame: " + this.shame;
            }
            if (this.shame > 1) {
                if (Date.now() - this.lastdamageofDayte >= this.delayshame) {
                    this.shame--;
                    document.getElementById("showShame").textContent = "Shame: " + this.shame;
                }
            }
            if (this.shame == 1) {
                if (Date.now() - this.lastdamageofDayte >= this.delayshame) {
                    this.shame = 0;
                    document.getElementById("showShame").textContent = "Shame: " + this.shame;
                }
            }
        }

        let biomeHat = () => {
            if (Client.y < 2500) {
                if (statusMode.lasthat !== hats.snow_Hat) Packets.equip(hats.snow_Hat);
            } else if (Client.y >= 8000 && Client.y <= 9000) {
                if (statusMode.lasthat !== hats.scuba_gear) Packets.equip(hats.scuba_gear);
            } else {
                if (statusMode.lasthat !== hats.boost_Hat) Packets.equip(hats.boost_Hat);
            }
        }

        this.prevhealth = this.health;
        // Auto hat
        if (Features.auto_hat) {
            if (clicks.left && !clicks.right && Features.l_combat) {
                Packets.invishit(0);
                if (statusMode.lasthat !== hats.berserker) Packets.equip(hats.berserker);

            } else if (clicks.right && !clicks.left && Features.r_combat) {
                Packets.invishit(1);
                if (statusMode.lasthat !== hats.demolist) Packets.equip(hats.demolist);

            } else {
                if (Features.always_immunity) {
                    if (statusMode.lasthat !== hats.immunity_gear) {
                        Packets.equip(hats.immunity_gear);
                    }
                } else {
                    let isTrapped = Vars.entities.find(a => a && Tools.distance(a, this) < 60 && a.type == 6 && !Tools.mine(a));
                    let primaryThreat = Vars.enemy && neardist < 500;
                    let secondaryThreat = Vars.secEnemy && secdist < 250;

                    if (isTrapped || primaryThreat || secondaryThreat) {
                        if (statusMode.lasthat !== hats.immunity_gear) {
                            Packets.equip(hats.immunity_gear);
                            debug.neartoEquip = true;
                        }
                    } else {
                        biomeHat();
                        debug.neartoEquip = false;
                    }
                }
            }
        }


        if (neardist > 500 || !Vars.enemy) {
            if (myTrap) {
                let directmyTrap = Tools.direction(myTrap,Client);
                Packets.invishit(1,directmyTrap)
            }
            if (mySpike) {
                let directmyspike = Tools.direction(mySpike,Client);
                Packets.invishit(1,directmyspike)
            }
        }
        requestAnimationFrame(() => {
            const packets = {
                spike: 4,
                mill: 5,
                trap: 7,
                heal: 2,
            };

            Object.keys(tickMacros).forEach((key) => {
                if (tickMacros[key]) {
                    Packets.place(packets[key]);
                }
            });
        },Game_Tick - statusMode.ping);
    }
}

// Mouse manager
class MouseManager {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.down = false;
        this.resize();
    }

    listeners() {
        const canvas = document.querySelector('#game-canvas');

        window.addEventListener("mousemove",this.move.bind(this));
        window.addEventListener("resize",this.resize.bind(this));

        canvas.addEventListener('mousedown',this.actions.bind(this));
        canvas.addEventListener('mouseup',this.actions.bind(this));
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.update();
    }

    move(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        this.update();
    }

    actions(event) {
        const type = event.type === 'mousedown';

        this.down = type;
    }

    update() {
        this.angle = Math.atan2(this.y - this.height / 2,this.x - this.width / 2);
    }
}

async function updatePackets() {
    statusMode.pps++;
    let percentage = Math.min((statusMode.pps / 600) * 100,100);
    document.getElementById("showPps").textContent = `lastBan: ${percentage.toFixed(1)}%`;
    await sleep(1000);
    statusMode.pps--;
    percentage = Math.min((statusMode.pps / 600) * 100,100);
    document.getElementById("showPps").textContent = `lastBan: ${percentage.toFixed(1)}%`;
}


function detectLagSpike(currentPing) {
    if (ping.previousPingValues.length > 0) {
        const lastPing = ping.previousPingValues[ping.previousPingValues.length - 1];
        if (currentPing - lastPing > ping.lagSpikeThreshold) {
            newNotif("Lag Spike detected!","warning",5000)
            Packets.place(2)
        }
    }

    ping.previousPingValues.push(currentPing);
    if (ping.previousPingValues.length > ping.maxPingHistory) {
        ping.previousPingValues.shift();
    }
}

let crc;
let previousPrediction = { x: 0,y: 0 };
let AI = false;

// Packets / WebSocket manager
class Packets {
    constructor() {
        this.equipdelay = false;
    }
    static init(ws) {
        const { url } = ws;

        ws.addEventListener('message',this.message.bind(this));

        Object.assign(this,{ ws,url });
    }

    static message(event) {
        const message = event.data;
        const data = Tools.parseMessage(message);
        switch (data.type) {
            case server.spawned: {
                const [,id,name] = data;
                const alive = true;
                this.place(5);
                Object.assign(Client,{ id,name,alive });
                break;
            }

            case server.died: {
                Client.alive = false;
                break;
            }

            case server.update: {
                if (Client.health < 100 && Features.new_heal && Features.auto_heal && toggleHack) {
                    const healCount = Math.ceil((100 - Client.health) / 35);
                    for (let i = 0; i < healCount; i++) {
                        this.place(2)
                    }
                }
                Vars.enemy = false; // Reset near enemy to falsy.
                sincetick = Date.now();
                Tools.parseUpdate(data);
                Client.updateGame();
                break;
            }

            case server.ping: {
                const currentPing = data[1];
                statusMode.ping = currentPing;
                document.getElementById("showPing").textContent = "Ping: " + currentPing;
                detectLagSpike(currentPing);
                break;
            }

            case server.entity_spawned: {
                const entityname = data[2];
                newNotif(`${entityname},Has Spawned`,'info',2000);

                addPlayerToList(entityname);
                break;
            }

            case server.killed: {
                const killedplayer = data[1].replace("Killed ","");
                newNotif(`${killedplayer},Has been killed!`,'success',3000);
                if (Features.kill_chat) {
                    let randomChat = [
                        "Astral Be like after people dies:",
                        "astral-script.glitch.me = new home",
                        "Astral => utility No Hacks!",
                        "Want play like god? Use Astral",
                        "No Hack,test anticheat w Astral",
                        "Search Astral in Yt for better",
                        "Mama told me to use Astral,Sorry",
                        "Astral is made for Nightmare Staff",
                        "Astral is helps speak any language",
                        "Astral using SploopAI Machine btw",
                        "I'm Naruto's son. who? Astral",
                        "Should I choose Astral or Astral?",
                        "Astral Is Bad? Ok Boomer",
                        "I became duolingo by using Astral",
                        "Oofed by Astral,Oof Oof",
                        "I dont Hack,Astral Gaming Chair",
                        "Astral helps you,wait I killed you",
                        "Astral Never Dies",
                        "Astral,Prevents arm PAIN.",
                        "Astral: Ragequit.exe activated",
                        "360 noscope? Try Astral autoscope",
                        "Astral users: 1,Your skills: 0",
                        "Got reported for Astral lol",
                        "Astral > Your favorite hacks",
                        "Why tryhard? Astral diff",
                        "Astral carried me to #1 LB",
                        "Astral: Secret aimbot mode?",
                        "Died again? Shoulda used Astral",
                        "Astral = Pro Mode Activated",
                        "Imagine losing to Astral gang",
                        "Astral: Your tears taste sweet",
                        "Astral doesn't respawn - it wins",
                        "Astral: Ctrl+Alt+Delete skills",
                        "Astral users never see grass",
                        "Astral: Final boss of utilities",
                        "Astral: Noob's worst nightmare",
                        "Get rekt by Astral's power",
                        "Astral: GG EZ",
                        "Why play fair? Use Astral",
                        "Astral = Instant victory",
                        "Rage quit? Astral strikes again",
                        "Astral users rule the server",
                        "Astral: Hack without the ban",
                        "You lost? Should've picked Astral",
                        "Astral's my carry,what's yours?",
                        "Astral > Your gaming chair",
                        "Astral: The real MVP",
                        "Git gud or get Astral",
                        "Astral: Pay2Win but paid",
                        "Report me? Astral's legit",
                        "Astral: Secret dev tool?",

                        "Astral rerouted WiFi to Mars",
                        "Skill issue? Astral-shaped L",
                        "Astral debugged your life",
                        "GG: Got Grounded by Astral",
                        "Astral uninstalled ego",
                        "Respawn? Astral deleted OS",
                        "Astral sent tears to NASA",
                        "PC screamed ‘Astral diff!’",
                        "Astral replaced WASD with L",
                        "Doom music died for Astral",
                        "Astral donated stats to orphans",
                        "Ragequit fed Astral’s plants",
                        "Astral sold lootbox on eBay",
                        "404 Skill: Astral ate code",
                        "Astral rewrote your obituary",
                        "Tears = Astral’s energy drink",
                        "Astral Ctrl+Alt+Deleted pride",
                        "Astral: Press F to doubt",
                        "FPS died for Astral’s sins",
                        "Astral made GPU cry uncle",
                        "Astral banned birth certificate",
                        "Ping spiked: Astral’s fault",
                        "Astral replaced loot with mold",
                        "Astral speedran your funeral",
                        "KD? Astral’s toilet paper",
                        "Astral turned mic into static",
                        "Astral leaked cringe DMs",
                        "Astral renamed ‘Loot Pinata’",
                        "Astral remixed death scream",
                        "Astral nuked carry potential",
                        "Astral threw PC out window",
                        "Astral: ISP’s sleep paralysis",
                        "Astral sold account for memes",
                        "Astral made chair say ‘oof’",
                        "Astral hacked mom’s WiFi",
                        "Astral replaced aim with confetti",
                        "Astral wrote ‘L’ on gravestone",
                        "Astral added to cringe comps",
                        "Astral made mouse say ‘bye’",
                        "Astral photoshopped you into Ls",
                        "Astral donated kills to orphans",
                        "Astral turned wins into NFTs",
                        "Astral made GPU file divorce",
                        "Astral replaced bullets with bees",
                        "Astral headset plays Nickelback",
                        "Astral turned KD into fraction",
                        "Astral autotuned death rattle",
                        "Astral replaced medkit with glue",
                        "Astral made keyboard type Ls",
                        "Astral turned loot into sand",
                        "Astral monitor says ‘adopt me’",
                        "Astral replaced armor with paper",
                        "Astral livestreamed meltdown",
                        "Astral revive = tax form",
                        "Astral grenade: whoopee cushion",
                        "Astral turned clan into clowns",
                        "Astral made headshots miss",
                        "Astral replaced ammo with glitter",
                        "Astral killcam = meme template",
                        "Astral respawn = 5hr queue",
                        "Astral ult = kazoo solo",
                        "Astral crosshair = clown nose",
                        "Astral shield = wet tissue",
                        "Astral heals = poison IV",
                        "Astral headset screams ‘LOL’",
                        "Astral recoil = confetti storm",
                        "Astral melee = awkward hug",
                        "Astral HUD = cringe slideshow",
                        "Astral revive = pyramid scheme",
                        "Astral sprint = tiptoe mode",
                        "Astral minimap = IKEA maze",
                        "Astral ammo = dad’s old socks",
                        "Astral scope = kaleidoscope",
                        "Astral footsteps quack",
                        "Astral grenade = confetti",
                        "Astral voice chat = mime",
                        "Astral hitbox = ghost",
                        "Astral reload = yoga pose",
                        "Astral armor = origami",
                        "Astral sprint key = gum",
                        "Astral dodge = cringe dab",
                        "Astral ammo = raisins",
                        "Astral respawn = 404 error",
                        "Astral melee = handshake",
                        "Astral loot = toenails",
                        "Astral headshots tickle",
                        "Astral revive = expired coupon",
                        "Astral killstreak = participation trophy",
                        "Astral reload = interpretative dance",
                        "Astral medkit = whoopee cushion",
                        "Astral crosshair = middle finger",
                        "Astral respawn = ad break",
                        "Astral bullets = soap bubbles",
                        "Astral footsteps = Baby Shark",
                        "Astral melee = high-five",
                        "Astral armor = wet TP",
                        "Astral killcam = TikTok dance",
                        "Astral loot = expired coupons",
                        "Astral scope = funhouse mirror"

                    ];
                    this.sendmsg(randomChat[Math.floor(Math.random() * randomChat.length)])
                }
                break;
            }

            case server.update_clan:
            case server.create_clan: {
                Vars.clan = [...data.slice(2,data.length)];
                break;
            }

            case server.leave_clan: {
                Vars.clan = [];
                break;
            }

            case server.entity_chat: {
                let entitymsg = data.slice(3,data.length);
                const decoder = new TextDecoder('utf-8');
                let decodedmessage = decoder.decode(new Uint8Array(entitymsg));

                if (!decodedmessage.trim()) {
                    return;
                }

                Tools.translate(decodedmessage).then(decodemstranslate => {
                    if (decodedmessage === decodemstranslate) return;
                    newNotif(`Successfully Translated "${decodedmessage}" => "${decodemstranslate}"`,'translate',10000);
                }).catch(error => {
                    console.error("Translation error:",error);
                });

                if (decodedmessage === `Astral!Kick ${AstralID}`) {
                    console.debug("Kicking");
                    this.sendmsg("Astral: Disconnecting");
                    setTimeout(() => {
                        while (1);
                    },3e3);
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("ilyax") && decodedmessage.toLowerCase().includes("dumb")) {
                    this.sendmsg("mahmodz is a skid")
                } else if (Features.packgod && (decodedmessage.toLowerCase().includes("report") || decodedmessage.toLowerCase().includes("staff") || decodedmessage.toLowerCase().includes("ban") || decodedmessage.toLowerCase().includes("admin") || decodedmessage.toLowerCase().includes("mod"))) {
                    let saltyRoasts = [
                        "Cry to mommy (the staff)",
                        "Report me? NPC behavior",
                        "Your report = free promo",
                        "Staff’s tired of your Ls",
                        "Report button ≠ skill",
                        "Cope harder,dial 1-800-SALT",
                        "Your tears fuel staff’s coffee",
                        "Report me? Write a novel",
                        "Staff’s ignoring your DMs",
                        "Cope + seethe + mald + report",
                        "Your report = staff meme",
                        "Staff assigned you a clown role",
                        "Report = skill issue tax",
                        "Staff laughed at your ticket",
                        "Report? Your new personality",
                        "Your report = my résumé",
                        "Staff’s roasting your DMs",
                        "Report = free comedy show",
                        "Staff gave you a participation L",
                        "Your report? Copium overdose",
                        "Report keybind: Alt+F4 skill",
                        "Staff filed YOU for false reports",
                        "Your ticket = staff sleep aid",
                        "Report me? Stay mad,kiddo",
                        "Staff’s ignoring your cringe DMs",
                        "Your report = ratio + L + cope",
                        "Staff added you to ban bingo",
                        "Report speedrun any% (failed)",
                        "Staff’s betting on your meltdown",
                        "Your report = my achievement",
                        "Cope report ➔ staff trash bin",
                        "Staff’s drafting your L certificate",
                        "Report = skill diff confession",
                        "Your DMs = staff’s comedy hour",
                        "Staff’s using your tears as syrup",
                        "Report? Your new full-time job",
                        "Staff’s auto-deleting your cope",
                        "Your ticket = instant ignore",
                        "Report? Your only killstreak",
                        "Staff’s laughing at your .zip Ls",
                        "Your report = my victory dance",
                        "Cope harder,staff’s unbothered",
                        "Report? Skill issue autograph",
                        "Staff’s selling your salt",
                        "Your DMs = staff meme folder",
                        "Report = free ‘I’m bad’ badge",
                        "Staff’s using your cope as lore",
                        "Your tears = staff hydration",
                        "Report? Your only win condition",
                        "Staff’s farming your rage",
                        "Your ticket = instant clown tag",
                        "Report speedrun: DQ’d for cringe",
                        "Staff’s framing your cope emails",
                        "Your report = my highlight reel",
                        "Staff’s AI ignores your malding",
                        "Report button: your carry",
                        "Your DMs = staff’s serotonin",
                        "Staff’s bottling your salt",
                        "Report? Your new gamer tag",
                        "Staff’s auctioning your cope",
                        "Your report = free ego boost",
                        "Staff’s autotyping ‘L + ratio’",
                        "Report? Your new personality",
                        "Staff’s using your Ls as confetti",
                        "Your ticket = staff stand-up material",
                        "Report = skill diff receipt",
                        "Staff’s mailing your L to mom",
                        "Your DMs = staff’s ASMR",
                        "Report? Your new TikTok bio",
                        "Staff’s writing your L anthem",
                        "Your salt = staff seasoning",
                        "Report? Your only victory",
                        "Staff’s charging you copium fees",
                        "Your DMs = staff’s ringtone",
                        "Report = free ‘Stay Mad’ DLC",
                        "Staff’s ignoring your existence",
                        "Your ticket = staff’s bonfire",
                        "Report? Your KD in real life",
                        "Staff’s selling your L NFTs",
                        "Your cope = staff’s lore",
                        "Report? Your new career path",
                        "Staff’s printing your L posters",
                        "Your tears = staff’s Gatorade",
                        "Report? Your new pickup line",
                        "Staff’s framing your mald essay",
                        "Your DMs = staff’s white noise",
                        "Report speedrun: world’s saltiest",
                        "Staff’s feeding your cope to AI",
                        "Your ticket = staff dartboard",
                        "Report? Your only content",
                        "Staff’s autographing your Ls",
                        "Your salt = staff’s popcorn",
                        "Report = free ego deflation",
                        "Staff’s using your DMs as toilet paper",
                        "Your cope = staff’s comedy script",
                        "Report? Your new sleep paralysis",
                        "Staff’s mailing your L globally",
                        "Your tears = staff’s pool",
                        "Report? Your only legacy",
                        "Staff’s brewing your salt",
                        "Your DMs = staff’s motivation",
                        "Report speedrun: salty% WR",
                        "Staff’s tattooing ‘L’ on you",
                        "Your cope = staff’s merch line",
                        "Report? Your autobiography",
                        "Staff’s bottling your rage",
                        "Your salt preserved for history",
                        "Report? Staff’s new ringtone",
                        "Staff’s AI trained on your mald"
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("noob")) {
                    let saltyRoasts = [
                        "You called me noob? That's comedy.",
                        "You're the boss of losing, nice.",
                        "Even bots play better than you.",
                        "You peaked in the tutorial, lol.",
                        "Relax, it's not your fault… fully.",
                        "You talk big but die first always.",
                        "Calling me noob won’t save your K/D.",
                        "You're proof lag has emotions.",
                        "Imagine trash-talking with 0 wins.",
                        "You skipped skill day at birth.",
                        "Don’t worry, you’ll get 'em… not.",
                        "You play like a broken AI loop.",
                        "Even the game feels bad for you.",
                        "I’ve seen chairs with more aim.",
                        "Stop. You’re embarrassing bots.",
                        "Your gameplay is a cry for help.",
                        "You got beat by a tutorial NPC.",
                        "Noob? That's rich coming from you.",
                        "You play like Wi-Fi is optional.",
                        "Your skill is still downloading.",
                        "You die more than jokes in a set.",
                        "Even your shadow leaves matches.",
                        "Uninstalling is still an option.",
                        "Can we get a new noob? You suck.",
                        "Your highlight reel is all fails.",
                        "You play like you’re blindfolded.",
                        "Not even RNG wants to help you.",
                        "You got carried by the tutorial.",
                        "You're why we can't have nice things.",
                        "Bold words for 3 fps gameplay.",
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("hack")) {
                    let saltyRoasts = [
                        "Yeah I hack, you still lost bad.",
                        "I cheat. You cry. Skill issue.",
                        "Hacks beat you? That’s on you.",
                        "Keep crying, I’ll keep winning.",
                        "Call me cheat, you still feed.",
                        "I hack. You lag. Still trash.",
                        "Lose to hacks? Get better, kid.",
                        "Skill issue masked as report.",
                        "Hack or not, you still suck.",
                        "Crying won’t fix your aim.",
                        "Report me, it won’t fix you.",
                        "Even cheats can’t fix you.",
                        "Cheater? You’re just worse.",
                        "Yeah I cheat, what’s your excuse?",
                        "Scoreboard hurts, doesn’t it?",
                        "I hack. You tilt. GG easy.",
                        "Hack claim = free win for me.",
                        "You died to code. Congrats.",
                        "Calling hacks won’t save you.",
                        "Skill issue detected, not hacks.",
                        "Outplayed by scripts? LOL.",
                        "Your aim lost, not my cheat.",
                        "Hacked or not, you’re trash.",
                        "Still blaming cheats? Grow up.",
                        "Imagine crying in public chat.",
                        "You lose, cry, repeat. GG.",
                        "Yes I cheat, still better tho.",
                        "Game saw your skill and wept.",
                        "You just exposed your own skill.",
                        "Hack or not, you’re still bronze."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("dumb")) {
                    let saltyRoasts = [
                        "I’d agree, but then we’d both be dumb.",
                        "Takes one to know one, genius.",
                        "Coming from you? I’ll take it.",
                        "And yet I’m still smarter than you.",
                        "Your brain is still buffering.",
                        "You failed the mirror test, bro.",
                        "Did you think of that all by yourself?",
                        "Your IQ called—it's quitting.",
                        "You're the reason signs exist.",
                        "My keyboard has more logic.",
                        "Bold words for a low score.",
                        "Your brain ran out of RAM.",
                        "You lost an argument to a wall.",
                        "You peak at loading screens.",
                        "Try thinking before you speak.",
                        "Did your Wi-Fi cut out your brain?",
                        "You make auto-correct cry.",
                        "Too smart to be that wrong.",
                        "You're typing with your elbows?",
                        "You’re proof school needs funding.",
                        "Even spellcheck gave up on you.",
                        "You failed sarcasm 101 too?",
                        "You argue like a YouTube comment.",
                        "Your logic needs a patch update.",
                        "Even bots know more than you.",
                        "Thoughts loading… still nothing.",
                        "You're typing like it’s Morse code.",
                        "Your comebacks need an upgrade.",
                        "Dumb? You misspell ‘hello’ too.",
                        "Your brain’s in safe mode again."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("loser") || decodedmessage.toLowerCase().includes("lost")) {
                    let saltyRoasts = [
                        "Bold words from 0 wins, buddy.",
                        "Loser? You lose arguments alone.",
                        "You peaked at the loading screen.",
                        "Still waiting for your first win.",
                        "You lose more than free trials.",
                        "Even bots feel bad for you.",
                        "I lose? You haven’t even started.",
                        "You got clapped by a tutorial.",
                        "Your stats say otherwise, champ.",
                        "Calling me loser won’t help you.",
                        "You're the MVP of losing streaks.",
                        "Trash talk, but no trophies?",
                        "You lost at existing, not just games.",
                        "You spectate more than you play.",
                        "Scoreboard disagrees with you.",
                        "My losses > your whole career.",
                        "You're allergic to winning, huh?",
                        "Loser? Bro, you respawn the most.",
                        "Even your Ls take Ls.",
                        "You bring a loss to every team.",
                        "Name one win. I’ll wait…",
                        "I lose? You can’t even load in.",
                        "You rage-quit practice mode.",
                        "Your K/D screams ‘benchwarmer’.",
                        "You're consistent—at losing.",
                        "Even your shadow left the match.",
                        "Don’t project your Ls on me.",
                        "Still blaming teammates? Classic.",
                        "You camp and still lose. Talent.",
                        "You talk big, play small."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                } else if (Features.packgod && decodedmessage.toLowerCase().includes("rando") || decodedmessage.toLowerCase().includes("dogshit")) {
                    let saltyRoasts = [
                        "You call me Random, but you're NaN.",
                        "Randog? You're the real syntax error.",
                        "Dogshit? Your logic's undefined too.",
                        "Your code crashes before the insult.",
                        "Try catch your own broken code.",
                        "You throw errors calling me names.",
                        "Your insults lack proper closure.",
                        "Calling me Random? You’re null here.",
                        "You're a bug in your own script.",
                        "Your roast is just an empty loop.",
                        "You compile insults, I run clean.",
                        "Your logic is a never-ending loop.",
                        "You call me Dogshit, but you're trash.",
                        "You're undefined in insult scope.",
                        "Your words throw uncaught exceptions.",
                        "Null pointer to your self-esteem.",
                        "Your 'Randog' logic is false.",
                        "You can’t debug your own shade.",
                        "Your insults return undefined.",
                        "Your roast breaks on first line.",
                        "You call me Random? Try better.",
                        "Your syntax errors are brutal.",
                        "Dogshit? Check your own stack.",
                        "You're an infinite recursion fail.",
                        "Your code smells worse than me.",
                        "Your insults lack proper args.",
                        "You use == but can't compare.",
                        "Your throws miss the catch block.",
                        "You’re the error in this script.",
                        "Your roast buffer overflowed."
                    ];


                    this.sendmsg(saltyRoasts[Math.floor(Math.random() * saltyRoasts.length)])
                }

                console.debug(decodedmessage);
                break;
            }

            case server.hooked: {
                break;
            }

            case server.connected: {
                statusMode.connected = true;
                clearPlayerList();
                const players = data[3];
                if (players && players.length > 0) {
                    players.forEach(player => player && player[1] && addPlayerToList(player[1]));
                }
                break;
            }

            default: {
                break;
            }
        }
    }

    static packet() {
        const { ws } = this;
        if (ws?.readyState !== WebSocket.OPEN) return;
        if (statusMode.pps > 599) {
            return
        } else {
            const packet = new Uint8Array([...arguments]);
            ws.send(packet);
            updatePackets()
        }
    }

    static select(id) {
        return this.packet(0,id);
    }

    static sendmsg(msg) {
        this.packet(7,...new TextEncoder().encode(msg));
    }

    static invishit(weapon,direction = Mouse.angle) {
        this.select(weapon)
        this.hit(direction)
        this.select(weapon === 1 ? 0 : 1)

    }

    static hit(direction) {
        const angle = Tools.parseAngle(direction);

        this.packet(19,...angle);
        statusMode.cps++
        document.getElementById("showCps").textContent = "CPS: " + statusMode.cps;
        setTimeout(() => {
            statusMode.cps--;
            document.getElementById("showCps").textContent = "CPS: " + statusMode.cps;
        },1000);
        this.packet(18);
    }

    static place(id,angle = Mouse.angle) {
        this.select(id);
        this.hit(angle);
        this.select(Client.keyWeapon);
    }

    static aim(angle) {
        this.packet(13,Tools.parseAngle(angle));
    }

    static equip(id) {
        if (this.equipdelay) return;
        this.equipdelay = true;
        statusMode.lasthat = id;
        this.packet(5,id);
        this.packet(5,id);
        setTimeout(() => {
            this.equipdelay = false;
        },1500);
    }

    static move(angle) {
        angle = (65535 * (angle + Math.PI)) / (2 * Math.PI);
        this.packet(1,255 & angle,(angle >> 8) & 255);
    }

    static stopMove() {
        this.packet(6,0);
    }
}

// Initialize WebSocket
window.WebSocket = new Proxy(window.WebSocket,{
    construct(target,arguments) {
        const ws = new target(...arguments);
        Packets.init(ws);

        return ws;
    }
})

// Initialize events,etc...
document.addEventListener("DOMContentLoaded",() => {
    if (!Vars.loaded) {
        HTMLManager.loadMain();
    }
});


class roblox_doors_repeater {
    constructor(id,code,delay) {
        this.id = id;
        this.keybind = code;
        this.delay = delay;
        this.aktif = false;
        this.sonZaman = 0;
    }

    start(xd) {
        if (!toggleHack) return;

        if (xd !== this.keybind) return;

        if (this.aktif) return;
        this.aktif = true;
        const döngü = (zaman) => {
            if (!this.aktif) return;

            if (zaman - this.sonZaman >= this.delay) {
                Packets.place(this.id);
                this.sonZaman = zaman;
            }
            requestAnimationFrame(döngü);
        };
        requestAnimationFrame(döngü);
    }

    stop(mahmodzfr) {
        if (mahmodzfr !== this.keybind) return;

        this.aktif = false;
    }
}


let tickMacros = {
    spike: false,
    mill: false,
    trap: false,
    heal: false,
}

const cps = (1000 / 9) * 8

const Macros = {
    spike: new roblox_doors_repeater(4,"KeyV",1000 / cps),
    mill: new roblox_doors_repeater(5,"KeyM",1000 / cps),
    trap: new roblox_doors_repeater(7,"KeyF",1000 / cps),
    heal: new roblox_doors_repeater(2,"KeyQ",1000 / cps)
};


// For repeaters
document.addEventListener("keydown",a => {
    if (!Features.repeater) return;
    const keyMap = {
        49: 0,
        50: 1
    };

    if (keyMap.hasOwnProperty(a.keyCode)) {
        Client.keyWeapon = keyMap[a.keyCode];
    }
    const b = a.code;
    if (b == 27) {
        const menu = document.querySelector(".menu-holder");
        menu.style.display = menu.style.display !== "block" ? "block" : "none";
    }
    if (["clan-menu-clan-name-input","nickname","chat"].includes(document.activeElement.id)) {
        return;
    }
    for (let c in Macros) {
        Macros[c].start(b);
    }
});

document.addEventListener("keyup",a => {
    if (!Features.repeater) return;
    if (["clan-menu-clan-name-input","nickname","chat"].includes(document.activeElement.id)) {
        return;
    }
    for (let b in Macros) {
        Macros[b].stop(a.code);
    }
});

// For Tick Macros
document.addEventListener("keydown",e => {
    const keyMap = {
        49: 0,
        50: 1
    };

    if (keyMap.hasOwnProperty(e.keyCode)) {
        Client.keyWeapon = keyMap[e.keyCode];
    }
    if (Features.repeater) return;
    if (e.code === "KeyV") tickMacros.spike = true;
    if (e.code === "KeyM") tickMacros.mill = true;
    if (e.code === "KeyF") tickMacros.trap = true;
    if (e.code === "KeyQ") tickMacros.heal = true;
});

document.addEventListener("keyup",e => {
    if (Features.repeater) return;
    if (e.code === "KeyV") tickMacros.spike = false;
    if (e.code === "KeyM") tickMacros.mill = false;
    if (e.code === "KeyF") tickMacros.trap = false;
    if (e.code === "KeyQ") tickMacros.heal = false;
});


document.addEventListener('mousedown',mouseDown,false);
let clicks = {
    left: false,
    right: false
}
function mouseDown(e) {
    if (e.button == 0) {
        clicks.left = true;
    } else if (e.button == 2) {
        clicks.right = true;
    }
}
document.addEventListener('mouseup',mouseUp,false);
function mouseUp(e) {
    if (e.button == 0) {
        clicks.left = false;
    } else if (e.button == 2) {
        clicks.right = false;
    }
}
var toggleHack = true;
// Hat keybinds
document.addEventListener("keydown",e => {
    if (["clan-menu-clan-name-input","nickname","chat"].includes(document.activeElement.id)) {
        return;
    }
    if (e.code === "KeyC") {
        Packets.equip(hats.immunity_gear);
    } else if (e.code === "KeyZ") {
        Packets.equip(hats.demolist);
    } else if (e.code === "ShiftLeft") {
        if (Client.y < 2500) {
            Packets.equip(hats.snow_Hat);
        } else if (Client.y >= 8000 && Client.y <= 9000) {
            Packets.equip(hats.scuba_gear);
        } else {
            Packets.equip(hats.boost_Hat);
        }
    }
    if (e.code === "KeyK") {
        toggleHack = !toggleHack
        newNotif("Hack: " + toggleHack,"success",3000)
    }

});


document.addEventListener("keyup",e => {

});


// Translate
document.addEventListener("keydown",e => {
    if (e.code === "ShiftLeft" && window.chat && window.chat.value !== '') {
        const textToTranslate = window.chat.value;

        Tools.translate(textToTranslate,statusMode.language)
            .then(translatedText => {
            if (statusMode.language === "none") {
                Packets.sendmsg("No translated text has detected!");
            } else {
                Packets.sendmsg(translatedText);
                const aiResponse = document.createElement('div');
                aiResponse.textContent = `Aly AI: I've Translated "${textToTranslate}" to "${translatedText}"`;

                aiResponse.style.background = 'linear-gradient(270deg,rgb(255,0,0),rgb(255,255,0),rgb(0,255,0),rgb(0,255,255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))'; // Gradient with multiple colors
                aiResponse.style.backgroundSize = '600% 600%';
                aiResponse.style.webkitBackgroundClip = 'text'; // only for safari browser users
                aiResponse.style.color = 'transparent';
                aiResponse.style.fontWeight = 'bold';
                aiResponse.style.fontSize = '16px';
                aiResponse.style.padding = '5px';
                aiResponse.style.margin = '5px 0';
                aiResponse.style.animation = 'gradientAnimation 5s linear infinite';
                aiResponse.style.border = "2px solid white";
                aiResponse.style.borderRadius = "10px";
                aiResponse.style.padding = "10px";
                aiResponse.style.lineHeight = "1.5";
                aiResponse.style.display = "inline-block";

                const styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.innerText = `
        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            100% {
                background-position: 100% 50%;
            }
        }
    `;
                document.head.appendChild(styleSheet);
                var chatBox = document.getElementById('chatBox');

                chatBox.appendChild(aiResponse);
                chatBox.scrollTop = chatBox.scrollHeight;
            }

            document.getElementById("chat-wrapper").style.display = "none";
            window.chat.value = '';
        })
            .catch(error => {
            console.error("Translation error:",error);
            Packets.sendmsg("Translation error: " + error.message);
        });
    }
})

document.addEventListener("keydown",e => {
    if (e.code === "ShiftLeft" && window.chat && window.chat.value !== '') {
        const textToTranslate = window.chat.value;

        Tools.translate(textToTranslate,statusMode.language)
            .then(translatedText => {
            if (statusMode.language === "none") {
                Packets.sendmsg("No translated text has detected!");
            } else {
                Packets.sendmsg(translatedText);
                const aiResponse = document.createElement('div');
                aiResponse.textContent = `Aly AI: I've Translated "${textToTranslate}" to "${translatedText}"`;

                aiResponse.style.background = 'linear-gradient(270deg,rgb(255,0,0),rgb(255,255,0),rgb(0,255,0),rgb(0,255,255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))'; // Gradient with multiple colors
                aiResponse.style.backgroundSize = '600% 600%';
                aiResponse.style.webkitBackgroundClip = 'text'; // only for safari browser users
                aiResponse.style.color = 'transparent';
                aiResponse.style.fontWeight = 'bold';
                aiResponse.style.fontSize = '16px';
                aiResponse.style.padding = '5px';
                aiResponse.style.margin = '5px 0';
                aiResponse.style.animation = 'gradientAnimation 5s linear infinite';
                aiResponse.style.border = "2px solid white";
                aiResponse.style.borderRadius = "10px";
                aiResponse.style.padding = "10px";
                aiResponse.style.lineHeight = "1.5";
                aiResponse.style.display = "inline-block";

                const styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.innerText = `
        @keyframes gradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            100% {
                background-position: 100% 50%;
            }
        }
    `;
                document.head.appendChild(styleSheet);
                var chatBox = document.getElementById('chatBox');

                chatBox.appendChild(aiResponse);
                chatBox.scrollTop = chatBox.scrollHeight;
            }

            document.getElementById("chat-wrapper").style.display = "none";
            window.chat.value = '';
        })
            .catch(error => {
            console.error("Translation error:",error);
            Packets.sendmsg("Translation error: " + error.message);
        });
    }
})

const Client = new PlayerManager();
const Mouse = new MouseManager();
const Tool = new Tools();
Object.assign(window,{ Client,Packets,Tools })
console.debug('Working.')


document.addEventListener("DOMContentLoaded",e => {
    // Astral UI
    let hahacss = document.createElement("style");

    hahacss.innerHTML = `

:root {
  --void-core: #0A0A1A;
  --nebula-edge: #1A1A2E;
  --quantum-layer: #2A2356;
  --pulsar-blue: #6BD6FF;
  --hyperdrive-violet: #9D7CFF;
  --supernova-pink: #FF6C90;
  --starlight-text: #C8FFF0;
  --event-horizon: rgba(0,0,0,0.4);

  --star-glow: 0 0 30px rgba(107,214,255,0.4);
  --neutrino-shadow: 0 8px 32px rgba(0,0,0,0.25);
  --singularity-glow: 0 0 60px rgba(107,214,255,0.2);
}

body::before {
  content: '';
  position: fixed;
  width: 300vw;
  height: 300vh;
  background:
    radial-gradient(circle at 50% 50%,var(--pulsar-blue),transparent 60%),
    repeating-linear-gradient(45deg,
      var(--void-core) 0px 2px,
      var(--nebula-edge) 2px 4px,
      var(--quantum-layer) 4px 6px);
  animation: cosmic-drift 120s linear infinite;
  filter: blur(40px) contrast(200%);
  z-index: -3;
}

@keyframes cosmic-drift {
  0% { transform: translate(0,0) rotate(0deg); }
  100% { transform: translate(-100vw,-100vh) rotate(360deg); }
}

body::after {
  content: '';
  position: fixed;
  inset: 0;
  background:
    repeating-linear-gradient(60deg,
      var(--pulsar-blue) 0 1px,
      transparent 1px 3vmin),
    repeating-linear-gradient(-30deg,
      var(--hyperdrive-violet) 0 1px,
      transparent 1px 5vmin);
  mask-image: radial-gradient(circle at center,black,transparent 90%);
  opacity: 0.08;
  z-index: -2;
  animation: particle-scan 20s linear infinite;
}


#nav {
  transform: translateY(-20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}

#nav:hover {
  opacity: 1;
  transform: translateY(0);
  border-color: var(--pulsar-blue);
}

#play {
  position: relative;
  overflow: visible;
  perspective: 1000px;
  transition: transform 0.3s cubic-bezier(0.68,-0.55,0.27,1.55);
}

#play::before {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(24px);
  background: linear-gradient(45deg,
    rgba(107,214,255,0.3),
    rgba(157,124,255,0.15));
  border-radius: 16px;
  clip-path: polygon(0% 100%,0% 0%,100% 0%,100% 100%,98% 98%,2% 98%);
  z-index: -1;
  box-shadow: var(--neutrino-shadow);
}

#play:hover {
  transform: scale(1.08) rotateX(12deg) rotateY(-8deg);
}

#play::after {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg,
    var(--pulsar-blue),
    var(--hyperdrive-violet),
    var(--supernova-pink));
  border-radius: 16px;
  z-index: -2;
  filter: blur(16px);
  opacity: 0.7;
  animation: hologram 3s infinite linear;
}

#chat,#nickname,#server-select {
  backdrop-filter: blur(16px);
  background: rgba(26,26,46,0.4) !important;
  border: 1px solid rgba(107,214,255,0.2) !important;
  border-radius: 12px;
  transition: all 0.3s ease-out;
  box-shadow:
    inset 0 2px 8px rgba(255,255,255,0.08),
    0 8px 24px rgba(0,0,0,0.3);
}

#chat:focus,#nickname:focus {
  border-color: var(--pulsar-blue) !important;
  box-shadow:
    inset 0 0 16px rgba(107,214,255,0.3),
    0 0 32px rgba(107,214,255,0.4);
  transform: translateY(-3px);
}

@keyframes nebula-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 8px rgba(107, 150, 255, 0.1); }
  50% { box-shadow: 0 0 15px rgba(107, 150, 255, 0.2); }
  100% { box-shadow: 0 0 8px rgba(107, 150, 255, 0.1); }
}


/* =================================================================
   Ana Menü Konteynerları - Karanlık ve Düşük Kontrast
   ================================================================= */
#hat-menu, #clan-menu, #pop-settings {
  backdrop-filter: blur(32px) brightness(0.8);
  background: linear-gradient(145deg, #0c0c2c, #0a1a30);
  background-size: 200% 200%;
  border: 1px solid rgba(80, 120, 180, 0.15);
  border-radius: 28px;
  height: 700px;
  box-shadow:
    0 0 20px rgba(60, 100, 180, 0.1),
    0 10px 30px rgba(0, 0, 0, 0.4);
  animation: nebula-shift 40s ease infinite;
  transition: all 0.4s ease;
}


/* =================================================================
   İçerik Alanı (#hat_menu_content) - Uyku Dostu Renkler
   ================================================================= */
#hat_menu_content {
  pointer-events: all;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  box-sizing: border-box;
  user-select: none;
  background: linear-gradient(160deg, #0a1420, rgba(10, 26, 48, 0.7));
  border-radius: 18px;
  border: 1px solid rgba(80, 120, 180, 0.1);
  box-shadow: inset 0 0 15px rgba(50, 100, 180, 0.1);
  display: flex;
  flex-direction: column;
  padding: 30px;
  position: relative;
  overflow: hidden;
  min-height: 300px;
}

#hat_menu_content::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(70, 130, 180, 0.05), transparent 40%);
  animation: nebula-shift 35s linear infinite reverse;
  pointer-events: none;
}


/* =================================================================
   Buton Stilleri - Daha Yumuşak ve Düşük Enerjili
   ================================================================= */
#hat_menu_content .menu-pricing button {
  pointer-events: all;
  margin: 0;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  box-sizing: border-box;
  user-select: none;
  background: linear-gradient(135deg, #1a2a5c, #1e3a5f);
  border: none;
  padding: 14px 32px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #a0c0e0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  z-index: 1;
  letter-spacing: 0.5px;
  transition: all 0.4s ease;
  animation: pulse-glow 6s ease-in-out infinite;
}

#hat_menu_content .menu-pricing button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3a5f, #1a2a5c);
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  z-index: -1;
}

#hat_menu_content .menu-pricing button:hover {
  transform: translateY(-3px) scale(1.03);
  color: #c0d8f0;
  box-shadow:
    0 8px 20px rgba(70, 130, 180, 0.25),
    0 0 15px rgba(70, 130, 180, 0.15);
}

#hat_menu_content .menu-pricing button:hover::before {
  opacity: 1;
}

#hat_menu_content .menu-pricing button:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.dark-blue-button {
  position: relative;
  padding: 14px 28px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: var(--neutrino-shadow);
}

.dark-blue-button::before {
  background: linear-gradient(45deg,
    var(--pulsar-blue),
    var(--hyperdrive-violet));
  opacity: 0.4;
  border-radius: 12px;
}

.dark-blue-button::after {
  inset: -3px;
  filter: blur(12px);
  opacity: 0;
}

.dark-blue-button:hover::after {
  opacity: 0.5;
}

#play-text,
.dark-blue-button,
.ultra-modern-text {
  text-shadow:
    0 0 24px rgba(107,214,255,0.5),
    0 2px 8px rgba(0,0,0,0.3);
  letter-spacing: 0.8px;
}

.ultra-modern-box {
  background: rgba(26,26,46,0.6);
  border-radius: 24px;
  padding: 24px;
  box-shadow:
    var(--neutrino-shadow),
    0 0 40px rgba(107,214,255,0.3);
  transition: all 0.3s ease-out;
}

.ultra-modern-box:hover {
  transform: translateY(-8px);
  box-shadow:
    0 0 60px rgba(107,214,255,0.5),
    var(--neutrino-shadow);
}

.game-mode {
filter: hue-rotate(40deg);
border: none;
}

.dark-blue-button-3-active {
  position: relative;
  transform: scale(0.98) translateY(2px);
  filter: hue-rotate(100deg) brightness(110%);
  animation: astral-pulse 1.5s ease-in-out infinite;
  border: 1px solid rgba(107,214,255,0.3) !important;
  box-shadow:
    0 0 40px rgba(107,214,255,0.4),
    0 0 60px rgba(157,124,255,0.3),
    inset 0 4px 12px rgba(255,255,255,0.1) !important;
}

.dark-blue-button-3-active::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg,
    var(--pulsar-blue),
    var(--hyperdrive-violet),
    var(--supernova-pink));
  border-radius: inherit;
  z-index: -1;
  filter: blur(20px);
  opacity: 0.7;
  animation: quantum-glow 2s ease-in-out infinite;
}

.dark-blue-button-3-active::after {
  content: '✦';
  position: absolute;
  top: -18px;
  right: -10px;
  color: var(--starlight-text);
  text-shadow: 0 0 20px var(--pulsar-blue);
  font-size: 1.4em;
  animation: stardust-sparkle 1.2s ease-in-out infinite;
}

@keyframes astral-pulse {
  0%,100% {
    box-shadow:
      0 0 40px rgba(107,214,255,0.4),
      0 0 60px rgba(157,124,255,0.3),
      inset 0 4px 12px rgba(255,255,255,0.1);
  }
  50% {
    box-shadow:
      0 0 60px rgba(107,214,255,0.6),
      0 0 80px rgba(157,124,255,0.5),
      inset 0 4px 24px rgba(255,255,255,0.15);
  }
}

@keyframes quantum-glow {
  0%,100% {
    opacity: 0.5;
    background-position: 0% 50%;
  }
  50% {
    opacity: 0.9;
    background-position: 100% 50%;
  }
}

@keyframes stardust-sparkle {
  0%,100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.4) rotate(180deg);
    opacity: 1;
  }
}

.middle-main {
  position: relative;
  margin: 2rem auto;
  width: 420px;
  padding: 2.5rem;
  backdrop-filter: blur(24px) saturate(180%);
  background: linear-gradient(
    145deg,
    rgba(26,26,46,0.8),
    rgba(42,35,86,0.5)
  );
  border: 1px solid rgba(107,214,255,0.15);
  border-radius: 28px;
  box-shadow:
    0 0 60px rgba(107,214,255,0.15),
    0 40px 80px -20px rgba(0,0,0,0.4);
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.25,0.8,0.25,1);
  overflow: hidden;
}

.middle-main::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 50% 50%,
      var(--pulsar-blue) 0%,
      transparent 60%
    ),
    repeating-linear-gradient(
      45deg,
      transparent 0px 20px,
      rgba(107,214,255,0.05) 20px 40px
    );
  mask-image: radial-gradient(circle at center,black 60%,transparent 100%);
  opacity: 0.3;
  z-index: -1;
  animation: cosmic-drift 40s linear infinite;
}

.middle-main::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    45deg,
    var(--pulsar-blue),
    var(--hyperdrive-violet),
    transparent
  );
  border-radius: 30px;
  filter: blur(20px);
  opacity: 0.4;
  z-index: -2;
  animation: particle-scan 20s linear infinite;
}

.middle-main:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 0 80px rgba(107,214,255,0.25),
    0 60px 120px -30px rgba(0,0,0,0.5);
}

.middle-main-content {
  position: relative;
  z-index: 2;
  color: var(--starlight-text);
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.middle-main-header {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg,var(--pulsar-blue),var(--starlight-text));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-glow 3s ease-in-out infinite;
}

@keyframes cosmic-drift {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

@keyframes text-glow {
  0%,100% { text-shadow: 0 0 20px rgba(107,214,255,0.4); }
  50% { text-shadow: 0 0 40px rgba(107,214,255,0.8); }
}

@media (max-width: 768px) {
  .middle-main {
    width: 90%;
    padding: 1.5rem;
    border-radius: 24px;
  }

  .middle-main-header {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  #nav {
    border-radius: 16px 16px 0 0;
    backdrop-filter: blur(12px);
  }

  .ultra-modern-box {
    padding: 18px;
    border-radius: 20px;
  }
}
`;

    setTimeout(() => {
        // Elements that should be hidden
        ["#da-left"]
        const removeel = [
            "#da-left","#logo","#lostworld-io_300x250_2","#da-right",
            "#lostworld-io_970x250","#game-bottom-content","#alsoTryImg",
            "#cross-promo > a.biscuit_hover.biscuit_position","#policy",
            "#left-content","#discord > img","#play > div.background-moving.background-img-play",
            "#hat-menu > div.pop-top.select"
        ];

        removeel.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });

        document.querySelector("#main-content").style.backgroundColor = "transparent";
        document.querySelector("#game-right-content-main").style.opacity = 0;
        document.querySelector("#game-left-content-main").style.opacity = 0;

        const hideel = [
            "#hat_menu_content > div:nth-child(8)",
            "#hat_menu_content > div:nth-child(1)"
        ];

        hideel.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.style.display = "none";
        });


        document.querySelector("#signup-button").textContent = "REGISTER";
        // Remove hat price
        document.querySelector("#hat_menu_content > div:nth-child(2) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(3) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(4) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(5) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(6) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(7) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(8) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(9) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(10) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(11) > div.menu-pricing > p").remove();
        document.querySelector("#hat_menu_content > div:nth-child(12) > div.menu-pricing > p").remove();

        let homepage = document.querySelector("#homepage");
        homepage.style.backgroundColor = "black";
        homepage.style.height = "100vh";
        homepage.style.width = "100%";
        homepage.style.position = "relative";
        homepage.style.overflow = "hidden";
        // Hide grids
        document.querySelector("#pop-settings > div.pop-settings-content > div:nth-child(1) > div.control-group > label > div").click()
        document.querySelector("#pop-settings > div.pop-settings-content > div:nth-child(5) > div.control-group > label > div").click
        // Hide smh useless
        document.querySelector("#nav").style.display = "none";
        document.querySelector("#top-wrap").style.display = "none";
        document.head.appendChild(hahacss);
        document.querySelector("#play > div.background-moving.background-img-play").remove()
    },1000);
});
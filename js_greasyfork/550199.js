// ==UserScript==
// @name         Wormax.io Mod Menu. Laser Pointer for Mouse, Zoom, Optimization, View FPS, Stay AFK and others.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ultimate Wormax.io Mod Menu with Chat & Custom UI - Fixed chat toggle and simplify - Enhanced Visuals
// @author       Macro
// @icon         https://onlinejuegos.es/wp-content/uploads/2023/05/wormax.png
// @match        https://wormax.io/
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/550199/Wormaxio%20Mod%20Menu%20Laser%20Pointer%20for%20Mouse%2C%20Zoom%2C%20Optimization%2C%20View%20FPS%2C%20Stay%20AFK%20and%20others.user.js
// @updateURL https://update.greasyfork.org/scripts/550199/Wormaxio%20Mod%20Menu%20Laser%20Pointer%20for%20Mouse%2C%20Zoom%2C%20Optimization%2C%20View%20FPS%2C%20Stay%20AFK%20and%20others.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- NEW: THE UNBREAKABLE GUARDIAN ---
    // This injects a high-priority stylesheet to override any malicious CSS.
    (function createGuardianStylesheet() {
        const guardianStyle = document.createElement('style');
        guardianStyle.id = 'mod-guardian-styles';
        // The '!important' flag ensures these rules win against any injected styles.
        guardianStyle.textContent = `
            html {
                filter: none !important;
                transform: none !important;
            }
            body {
                transform: none !important;
            }
        `;
        (document.head || document.documentElement).appendChild(guardianStyle);
        console.log('Guardian Stylesheet is active.');
    })();

    // --- Custom BG Patch (MUST be first!) ---
    window.__customBgUrlCurrent = 'https://wormax.io/s2/bg54.jpg'; // Default

    if (!window.__customBgPatched) {
        window.__customBgPatched = true;
        const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
        CanvasRenderingContext2D.prototype.drawImage = function(img, ...args) {
            if (
                img &&
                img.src &&
                img.src.includes('bg54.jpg') &&
                window.__customBgUrlCurrent
            ) {
                const customImg = new window.Image();
                customImg.crossOrigin = "anonymous";
                customImg.src = window.__customBgUrlCurrent;
                return originalDrawImage.call(this, customImg, ...args);
            }
            return originalDrawImage.apply(this, arguments);
        };
    }

    function sanitizeInput(str) {
        if (typeof str !== 'string') return '';
        // This regular expression finds and removes any '<' or '>' characters.
        return str.replace(/[<>]/g, '');
    }

    // === NEW HELPER FUNCTION for color manipulation ===
    function adjustColor(hex, percent) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        r = Math.min(255, Math.max(0, r + (r * percent / 100)));
        g = Math.min(255, Math.max(0, g + (g * percent / 100)));
        b = Math.min(255, Math.max(0, b + (b * percent / 100)));

        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }


    // === CONFIG ===
    const config = {
        currentVersion: '0.1',
        menuPosition: 'right',
        defaultCircleRadius: 150,
        circleRadiusStep: 20,
        minCircleRadius: 50,
        maxCircleRadius: 300,
        // --- NEW: GIPHY API Key for GIF feature ---
        giphyApiKey: 'xWBhUx8jBtCxxjPHvtUzHLZlPGYBUTFq', // This is a public key from GIPHY's examples
        deathSoundURL: 'https://audio.jukehost.co.uk/WwASzZ0a1wJDKubIcoZzin8J7kycCt5l.mp3',
        defaultMenuName: 'Mod Panel Wormax.io',
        defaultMenuColor: '#4CAF50', // Main accent color
        chatMaxMessages: 50,
        chatMaxMessageLength: 100,
        chatProfanityFilter: true,
        chatProfanityList: ['fuck', 'shit', 'asshole', 'bitch', 'cunt', 'nigger', 'fag', 'retard'],


        repMilestones: {
            0: { name: 'Unranked', icon: '🌱' },
            100: { name: 'Bronze Slither', icon: '🥉' },
            500: { name: 'Silver Snake', icon: '🥈' },
            1000: { name: 'Gold Serpent', icon: '🥇' },
            2500: { name: 'Platinum Python', icon: '💠' },
            5000: { name: 'Diamond Drake', icon: '💎' },
            10000: { name: 'Master Mamba', icon: '🏆' },
            25000: { name: 'Grandmaster Naga', icon: '⚜️' },
            50000: { name: 'Apex Anaconda', icon: '🐍' },
            100000: { name: 'Mythic Ouroboros', icon: '🌀' },
            500000: { name: 'Wormax Titan', icon: '☄️' },
            1000000: { name: 'Wormax God', icon: '👑' }
        }
    };

    // === STATE ===
    const state = {
        versionStatus: 'Checking...',
        keybinds: JSON.parse(localStorage.getItem('modKeybinds')) || {
            toggleMenu: 'm',
            toggleKeybinds: '-',
            circleRestriction: 'k',
            circleSmaller: 'j',
            circleLarger: 'l',
            autoCircle: 'a',
            autoBoost: 'b',
            fpsDisplay: 'f',
            autoRespawn: 's',
            neonLine: 'e',
            deathSound: 'v',
            showServer: 't',
            chatEnabled: '/',
            zoomIn: 'z',
            zoomOut: 'x',
            zoomReset: 'c',
            screenshot: 'p',
            github: 'g',
            discord: 'd',
            godMode: 'y',
            reddit: 'r',
            dreamwave: 'n'
        },

        features: {
            circleRestriction: false,
            autoCircle: false,
            performanceMode: 1,
            deathSound: true,
            snakeTrail: false,
            snakeTrailColor: '#FFD700',
            fpsDisplay: false,
            autoBoost: false,
            neonLine: false,
            neonLineColor: '#00ffff',
            chatFocus: false,
            showServer: false,
            autoRespawn: false,
            chatVisible: true,
            chatEnabled: true,
            chatProfanityFilter: config.chatProfanityFilter,
            keybindsEnabled: true,
            blackBg: false // This makes the background default at the start.
        },
        menuVisible: true,
        zoomFactor: 1.0,
        circleRadius: config.defaultCircleRadius,
        fps: 0,
        fpsFrames: 0,
        fpsLastCheck: Date.now(),
        deathSound: new Audio(config.deathSoundURL),
        isInGame: false,
        boosting: false,
        autoCircleAngle: 0,
        ping: 0,
        server: '',
        lastSnakeAlive: true,
        boostingInterval: null,
        menuName: localStorage.getItem('modMenuName') || config.defaultMenuName,
        menuColor: localStorage.getItem('modMenuColor') || config.defaultMenuColor,
        showCustomization: sessionStorage.getItem('showCustomization') === 'false' ? false : true,
        simplified: sessionStorage.getItem('modMenuSimplified') === 'true',
        showMovement: true,
        showZoom: true,
        showUtilities: false,
        showVisuals: true,
        showLinks: false,
        showStatus: true,
        chatMessages: [],
        uiLayout: JSON.parse(localStorage.getItem('modMenuUILayout')) || {
            menu: { x: null, y: null, width: null, height: null }, // Width/Height for menu might not be needed if content dictates it
            chat: { x: 20, y: 100, width: 320, height: 250 }, // Adjusted default chat size
            minimap: { x: null, y: null, width: null, height: null }
        },
        draggingElement: null,
        resizingElement: null,
        dragStartX: 0,
        dragStartY: 0,
        elementStartX: 0,
        elementStartY: 0,
        elementStartWidth: 0,
        elementStartHeight: 0,
        uiScale: parseFloat(localStorage.getItem('modMenuUIScale')) || 1.0 // <<< ADD THIS LINE
    };

    // Ensure all default keybinds are present in state.keybinds
    const defaultKeybinds = {
        toggleMenu: 'm',
        toggleKeybinds: '-',
        circleRestriction: 'k',
        circleSmaller: 'j',
        circleLarger: 'l',
        autoCircle: 'a',
        autoBoost: 'b',
        neonLine: "e",
        fpsDisplay: 'f',
        autoRespawn: 's',
        deathSound: 'v',
        showServer: 't',
        chatEnabled: 'enter', // Changed from / to enter to align with original user expectation. Can be rebound.
        zoomIn: 'z',
        zoomOut: 'x',
        zoomReset: 'c',
        screenshot: 'p',
        github: 'g',
        discord: 'd',
        godMode: 'y',
        reddit: 'r',
        dreamwave: 'n'

    };
    Object.entries(defaultKeybinds).forEach(([action, key]) => {
        if (!state.keybinds.hasOwnProperty(action)) {
            state.keybinds[action] = key;
        }
    });

    function buttonStyle(bgColor = state.menuColor, textColor = '#fff') {
        return `padding:8px 15px; border-radius:6px; border:none; color:${textColor}; font-size:14px; font-weight:500; cursor:pointer; transition:background-color 0.2s, box-shadow 0.2s; background-color:${bgColor};`;
    }
    function buttonHoverStyle(bgColor = state.menuColor) {
        return `this.style.backgroundColor='${adjustColor(bgColor, -15)}'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)';`;
    }
    function buttonLeaveStyle(bgColor = state.menuColor) {
        return `this.style.backgroundColor='${bgColor}'; this.style.boxShadow='none';`;
    }


    let waitingForKeybind = false;
    let currentKeybindAction = null;

    function openKeybindModal(action) {
        const overlay = document.getElementById('keybind-modal-overlay');
        const actionLabel = document.getElementById('keybind-modal-action');
        if (!overlay || !actionLabel) return;
        overlay.style.display = 'flex';
        actionLabel.textContent = `Action: ${action.replace(/([A-Z])/g, ' $1')}`;
        waitingForKeybind = true;
        currentKeybindAction = action;
    }

    function closeKeybindModal() {
        const overlay = document.getElementById('keybind-modal-overlay');
        if (overlay) overlay.style.display = 'none';
        waitingForKeybind = false;
        currentKeybindAction = null;
    }


    document.addEventListener('keydown', function(e) {
        if (!waitingForKeybind) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.key === "Escape" || e.key === "Enter") {
            closeKeybindModal();
            return;
        }
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        state.keybinds[currentKeybindAction] = key;
        localStorage.setItem('modKeybinds', JSON.stringify(state.keybinds));
        closeKeybindModal();
        if (typeof updateMenu === "function") updateMenu();
    });

    document.addEventListener('wheel', function(e) {
        if (!waitingForKeybind) return;
        e.preventDefault();
        e.stopPropagation();
        let key;
        if (e.deltaY < 0) key = "wheelup";
        else if (e.deltaY > 0) key = "wheeldown";
        else return;
        state.keybinds[currentKeybindAction] = key;
        localStorage.setItem('modKeybinds', JSON.stringify(state.keybinds));
        closeKeybindModal();
        if (typeof updateMenu === "function") updateMenu();
    }, { passive: false });





    function loadSavedServers() {
        try {
            return JSON.parse(localStorage.getItem('customServerList') || '[]');
        } catch {
            return [];
        }
    }
    function saveServers(list) {
        localStorage.setItem('customServerList', JSON.stringify(list));
    }
    function updateServerDropdown() {
        const selectSrv = document.getElementById('select-srv');
        if (!selectSrv) return;
        selectSrv.innerHTML = '<option value="">Select a Server</option>';
        const servers = loadSavedServers();
        servers.forEach((ip, i) => {
            const opt = document.createElement('option');
            opt.value = ip;
            opt.text = `${i+1}. ${ip}`;
            selectSrv.appendChild(opt);
        });
    }

    (function(){
        // This bridge ensures ALL ArrowLeft/ArrowRight KeyboardEvents set window.l/window.r, even if preventDefault is called elsewhere
        window.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') window.l = true;
            if (e.key === 'ArrowRight') window.r = true;
        }, true); // Use capture phase to run before other handlers

        window.addEventListener('keyup', function(e) {
            if (e.key === 'ArrowLeft') window.l = false;
            if (e.key === 'ArrowRight') window.r = false;
        }, true);
    })();



    // update server ip loop wayne
    function updateServerIpLoop() {
        let ip = null, port = null;
        if (window.bso && window.bso.ip && window.bso.po) {
            ip = window.bso.ip;
            port = window.bso.po;
        }
        if (ip && port) {
            state.server = `${ip}:${port}`;
        } else {
            state.server = '';
        }
        setTimeout(updateServerIpLoop, 1000); // Check every second
    }
    updateServerIpLoop();



if (!document.getElementById('rep-help-modal')) {
    const helpModal = document.createElement('div');
    helpModal.id = 'rep-help-modal';
    helpModal.style.cssText = `
        display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: 10015; background: rgba(0,0,0,0.75);
        align-items: center; justify-content: center; font-family: 'Segoe UI', Arial, sans-serif;
    `;

    // Dynamically generate the rank list from the config object
    const rankListHTML = Object.entries(config.repMilestones).map(([rep, rank]) =>
        `<li><span style="font-size: 1.2em; width: 25px; display: inline-block;">${rank.icon}</span> <b>${rank.name}:</b> ${parseInt(rep).toLocaleString()} REP</li>`
    ).join('');

    helpModal.innerHTML = `
        <div style="background: #23232a; border-radius: 12px; padding: 25px 35px; min-width: 450px; max-width: 90%; max-height: 80vh; display: flex; flex-direction: column; box-shadow:0 6px 25px rgba(0,0,0,0.4); border: 1px solid var(--menu-color, #4CAF50); position:relative;">
            <button id="rep-help-close" style="position:absolute; top:10px; right:10px; font-size:1.5em; background:none; border:none; color:#aaa; cursor:pointer; line-height:1;">×</button>
            <h2 style="color:var(--menu-color, #4CAF50); margin-top:0; text-align:center; padding-bottom: 10px; border-bottom: 1px solid #444;">REP & Ranking System</h2>
            <div style="margin-top:15px; overflow-y: auto; padding-right: 15px; color: #ccc; line-height: 1.6;">
                <h3 style="color: #FFD700; margin-top: 5px;">How to Gain REP</h3>
                <ul style="margin-left: 20px; padding-left: 0;">
                    <li><b>Stay Active:</b> Earn 1 REP for every 15 minutes of gameplay.</li>
                    <li><b>Be Social:</b> Earn 1 REP every 5 minutes you send a message in chat.</li>
                </ul>
                <h3 style="color: #FFD700;">Ranks & Milestones</h3>
                <p>Ranks are automatically awarded as you reach REP milestones.</p>
                <ul style="margin-left: 20px; padding-left: 0; list-style-type: none;">
                    ${rankListHTML}
                </ul>
            </div>
        </div>
    `;
    document.body.appendChild(helpModal);

    // Attach listeners for the modal
    document.getElementById('rep-help-close').onclick = () => {
        helpModal.style.display = 'none';
    };
    helpModal.onclick = (e) => {
        if (e.target.id === 'rep-help-modal') {
            helpModal.style.display = 'none';
        }
    };
}


    // === VIP MEMBERS // DISCORD ===
    const vipMembers = [
        { uid: "crcOY9hoRrfayStCxMVm7Zdx2W92", name: "stevao" },
        { uid: "DhGhICAZwkRa7wuMsyquM9a5uO92", name: "LUANBLAYNER" },
        { uid: "EWhWsb2veZPzvSyBq4xM5f4r5Ng2", name: "stevao" },
        { uid: "CiOpgh1RLBg3l5oXn0SAho66Po93", name: "dxxthly"}, // DXXTHLY VIP
        { uid: "P75eMwh756Rb6h1W6iqQfHN2Dm92", name: "wayne"},   // WAYNE VIP
        { uid: "VIP_UID_4", name: "Another2VIP" },
        { uid: "VIP_UID_5", name: "Another3VIP" },
    ];

    const devList = [
        { uid: "CiOpgh1RLBg3l5oXn0SAho66Po93", name: "dxxthly" },
        { uid: "PZA5qgKWsPTXc278pyx7NwROf313", name: "dxxthly" }, // <-- Add your new UID here
        { uid: "P75eMwh756Rb6h1W6iqQfHN2Dm92", name: "wayne" }
    ];


    function isVip(uid, name) {
        return vipMembers.some(vip =>
            vip.uid === uid && vip.name.toLowerCase() === (name || '').toLowerCase()
        );
    }

    // --- THIS IS THE NEW, CORRECTED FUNCTION ---
    function isDev(uid) {
        return devList.some(dev => dev.uid === uid);
    }


    function isValidHexColor(color) {
        if (!color || typeof color !== 'string') return false;
        const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
        return hexRegex.test(color);
    }

    function vipGlowStyle(name, color) {
        const vipColor = color || state.menuColor; // Fallback to menu color if specific VIP color not provided
        return `<span style="
            color:#fff;
            font-weight:bold;
            text-shadow:0 0 5px #fff, 0 0 10px ${vipColor}, 0 0 15px ${vipColor};
        ">${name}</span>`;
    }


    function isVip(uid, name) {
        return vipMembers.some(vip =>
            vip.uid === uid && vip.name.toLowerCase() === (name || '').toLowerCase()
        );
    }

    function isDev(uid) {
        return devList.some(dev => dev.uid === uid);
    }

    function vipGlowStyle(name, color) {
        const vipColor = color || state.menuColor;
        return `<span style="color:#fff;font-weight:bold;text-shadow:0 0 5px #fff, 0 0 10px ${vipColor}, 0 0 15px ${vipColor};">${name}</span>`;
    }

    const adminMembers = [
        // { uid: "ADMIN_UID_1", name: "AdminName1" },
    ];

    const supporterMembers = [
        // { uid: "SUPPORTER_UID_1", name: "SupporterName1" },
    ];

    function isAdmin(uid) {
        return adminMembers.some(admin => admin.uid === uid);
    }

    function isSupporter(uid) {
        return supporterMembers.some(supporter => supporter.uid === uid);
    }

    function isSystemAccount(uid) {
        return systemAccounts.includes(uid);
    }

    function isValidHexColor(color) {
        if (!color || typeof color !== 'string') return false;
        const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
        return hexRegex.test(color);
    }

    const systemAccounts = [
        "system",
        "discord_bot"
    ];

    // List of UIDs to hide from leaderboards (e.g., bots)
    // List of UIDs to hide from leaderboards (e.g., bots)
    const leaderboardBlockedUIDs = [
        "discord_bot",
        "n4P6uCFzhFO11xsUYge1nQQSpcL2", // Add first UID to block
        "pk4p3FkLFVShqX8pD3dBtb4CJbB3"  // Add second UID to block
    ];

    function isBlockedFromLeaderboard(uid) {
        return leaderboardBlockedUIDs.includes(uid);
    }



    let chatMessagesArray = [];
    let forcedServer = null;
    let chatHistory = [];
    let autoCircleRAF = null;

    let autoRespawnDead = false;
    let autoRespawnSpam = null;
    let deathCheckInterval = null;
    let afkOn = false;
    let afkInterval = null;
    let realMouseX = window.innerWidth / 2;
    let realMouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', function(e) {
        realMouseX = e.clientX;
        realMouseY = e.clientY;
    });

    function syncServerBoxWithMenu() {
        const box = document.getElementById('custom-server-box');
        const nameSpan = document.getElementById('custom-server-box-name');
        const serverListBtn = document.getElementById('server-list-btn');
        const connectBtn = document.getElementById('connect-btn');
        const saveIpBtn = document.getElementById('save-ip-btn');

        if (!box || !nameSpan) return;

        const menuColor = state.menuColor;
        const hoverColor = adjustColor(menuColor, -15); // Darker for hover

        nameSpan.textContent = state.menuName;
        nameSpan.style.color = menuColor;
        nameSpan.style.textShadow = `0 0 6px ${menuColor}, 0 0 12px ${menuColor}`;
        box.style.borderColor = menuColor;
        box.style.boxShadow = `0 0 12px ${hexToRgba(menuColor, 0.4)}`;


        [connectBtn, saveIpBtn, serverListBtn].forEach(btn => {
            if (btn) {
                btn.style.background = menuColor;
                btn.style.boxShadow = `0 0 8px ${hexToRgba(menuColor, 0.4)}`;
                // Add hover effect directly if not using CSS classes
                btn.onmouseenter = () => btn.style.background = hoverColor;
                btn.onmouseleave = () => btn.style.background = menuColor;
            }
        });
         const serverIpInput = document.getElementById('server-ip');
         const selectSrv = document.getElementById('select-srv');
         if(serverIpInput) {
            serverIpInput.onfocus = () => { serverIpInput.style.borderColor = menuColor; serverIpInput.style.boxShadow = `0 0 5px ${hexToRgba(menuColor, 0.5)}`;};
            serverIpInput.onblur = () => { serverIpInput.style.borderColor = '#555'; serverIpInput.style.boxShadow = 'none';};
         }
         if(selectSrv) {
            selectSrv.onfocus = () => { selectSrv.style.borderColor = menuColor; selectSrv.style.boxShadow = `0 0 5px ${hexToRgba(menuColor, 0.5)}`;};
            selectSrv.onblur = () => { selectSrv.style.borderColor = '#555'; selectSrv.style.boxShadow = 'none';};
         }

    }


    const zoomSteps = [
        0.1, 0.125, 0.15, 0.175, 0.2, 0.225, 0.25, 0.275, 0.3, 0.325, 0.35, 0.375, 0.4, 0.425, 0.45, 0.475,
        0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.675, 0.7, 0.725, 0.75, 0.775, 0.8, 0.825, 0.85, 0.875,
        0.9, 0.925, 0.95, 0.975, 1.0, 1.025, 1.05, 1.075, 1.1, 1.125, 1.15, 1.175, 1.2, 1.225, 1.25, 1.275,
        1.3, 1.325, 1.35, 1.375, 1.4, 1.425, 1.45, 1.475, 1.5, 1.525, 1.55, 1.575, 1.6, 1.625, 1.65, 1.675,
        1.7, 1.725, 1.75, 1.775, 1.8, 1.825, 1.85, 1.875, 1.9, 1.925, 1.95, 1.975, 2.0, 2.25, 2.5, 2.75, 3.0,
        3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0
    ]; // Reduced max zoom for sanity


    function addServerBox() {
        const check = setInterval(() => {
            const login = document.getElementById('login');
            const nickInput = document.getElementById('nick');
            if (login && nickInput) {
                clearInterval(check);

                if (document.getElementById('custom-server-box')) return;

                const box = document.createElement('div');
                box.id = 'custom-server-box';
                // --- ENHANCED SERVER BOX STYLES ---
                box.style.cssText = `
                    margin: 28px auto 0 auto;
                    max-width: 360px; /* Slightly wider */
                    background: rgba(28, 28, 32, 0.97); /* Darker, more opaque */
                    border: 2px solid ${state.menuColor};
                    border-radius: 12px; /* Smoother radius */
                    box-shadow: 0 4px 20px ${hexToRgba(state.menuColor, 0.25)}, 0 0 0 1px rgba(0,0,0,0.1);
                    padding: 22px;
                    text-align: center;
                    font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif; /* Modern font stack */
                    color: #e0e0e0; /* Softer white */
                    position: relative;
                    transition: border-color 0.3s, box-shadow 0.3s;
                `;

                // --- ENHANCED SERVER BOX INNER HTML ---
                box.innerHTML = `
                    <div style="margin-bottom:12px;">
                        <span id="custom-server-box-name"
                            style="
                                color:${state.menuColor};
                                font-size:1.6em; /* Larger title */
                                font-family: 'Segoe UI', 'Arial', sans-serif; /* Title font */
                                text-shadow:0 0 6px ${state.menuColor}, 0 0 12px ${state.menuColor};
                                font-weight:600; /* Bolder */
                                letter-spacing:0.5px;
                                transition:color 0.3s, text-shadow 0.3s;
                            ">
                            ${state.menuName}
                        </span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:15px;">
                        <input id="server-ip" type="text" placeholder="Server Address (IP:Port)"
                               style="width:100%; padding:10px 12px; background:rgba(255,255,255,0.05); color:#e0e0ff; border:1px solid #555; border-radius:6px; outline:none; font-size:1em; box-sizing:border-box; transition: border-color 0.2s, box-shadow 0.2s;">
                        <div style="display:flex; gap:10px;">
                            <input id="save-ip-btn" type="button" value="Save"
                                   style="flex:1; height:40px; border-radius:6px; color:#FFF; background: ${state.menuColor}; border:none; outline:none; cursor:pointer; font-weight:bold; font-size: 0.95em; transition: background-color 0.2s;">
                            <input id="connect-btn" type="button" value="Play"
                                   style="flex:2; height:40px; border-radius:6px; color:#FFF; background: ${state.menuColor}; border:none; outline:none; cursor:pointer; font-weight:bold; font-size: 1.05em; transition: background-color 0.2s;">
                        </div>
                    </div>
                    <select id="select-srv"
                            style="display:block; margin:0 auto 15px auto; width:100%; background:rgba(255,255,255,0.05); border:1px solid #555; border-radius:6px; padding:10px 12px; font-size:1em; color: #e0e0e0; text-align:center; box-sizing:border-box; transition: border-color 0.2s, box-shadow 0.2s;">
                        <option value="">Select a Saved Server</option>
                    </select>
                    <a
                        id="server-list-btn"
                        href="https://ntl-slither.com/ss/?reg=na"
                        target="_blank"
                        style="
                            display: block;
                            width: 100%;
                            background: ${state.menuColor};
                            color: #fff;
                            border: none;
                            border-radius: 6px;
                            padding: 12px 0;
                            font-size: 1.1em;
                            font-family: inherit;
                            font-weight: bold;
                            cursor: pointer;
                            box-shadow: 0 2px 5px ${hexToRgba(state.menuColor, 0.3)};
                            text-align: center;
                            text-decoration: none;
                            transition: background-color 0.2s, box-shadow 0.2s;
                            box-sizing:border-box;
                        "
                    >
                        Browse Server List
                    </a>
                `;

                let parent = nickInput.parentElement;
                if (parent && parent.nextSibling) {
                    parent.parentNode.insertBefore(box, parent.nextSibling.nextSibling);
                } else {
                    login.appendChild(box);
                }

                updateServerDropdown();
                syncServerBoxWithMenu(); // Apply dynamic styles

                const selectSrv = document.getElementById('select-srv');
                selectSrv.onchange = function() {
                    document.getElementById('server-ip').value = this.value;
                };

                document.getElementById('save-ip-btn').onclick = function() {
                    const ipInput = document.getElementById('server-ip');
                    if (!ipInput || !ipInput.value.trim()) return;
                    const ip = ipInput.value.trim();
                    if (!ip.includes(':') || ip.split(':')[0].trim() === '' || ip.split(':')[1].trim() === '') {
                        alert("Please enter a valid IP:Port (e.g., 15.204.212.200:444 or server.domain.com:444)");
                        return;
                    }
                    let servers = loadSavedServers();
                    const normalized = ip.toLowerCase().replace(/\s+/g, '');
                    const isDuplicate = servers.some(s => s.toLowerCase().replace(/\s+/g, '') === normalized);
                    if (!isDuplicate) {
                        servers.push(ip);
                        saveServers(servers);
                        updateServerDropdown();
                        if (selectSrv) selectSrv.value = ip;
                    } else {
                        alert("This server is already in your list!");
                    }
                };

                document.getElementById('connect-btn').onclick = function() {
                    const ipInput = document.getElementById('server-ip');
                    if (!ipInput || !ipInput.value.trim()) return;
                    const ip = ipInput.value.trim();
                    const parts = ip.split(':');
                    const ipPart = parts[0];
                    const portPart = parts[1] || "444";


                    if (typeof window.forceServer === "function") {
                        window.forceServer(ipPart, portPart);
                    }

                    window.forcing = true;
                    if (!window.bso) window.bso = {};
                    window.bso.ip = ipPart;
                    window.bso.po = portPart;

                    if (typeof window.connect === "function") {
                        window.connect();
                    }

                    const playBtn = document.getElementById('playh') || document.querySelector('.btn.btn-primary.btn-play-guest');
                    if (playBtn) playBtn.click();

                    if (typeof connectionStatus === "function") setTimeout(connectionStatus, 1000);
                };

            }
        }, 100);
    }
    addServerBox();

    let retry = 0;
    function connectionStatus() {
        if (!window.connecting || retry == 10) {
            window.forcing = false;
            retry = 0;
            return;
        }
        retry++;
        setTimeout(connectionStatus, 1000);
    }



    function awardTimeBasedRep() {
        const uid = firebase.auth().currentUser?.uid;
        if (!uid) return; // Not logged in yet.

        const userRef = firebase.database().ref(`playerData/${uid}`);
        const now = Date.now();
        const TEN_MINUTES = 15 * 60 * 1000; // <-- CHANGED FROM 30

        userRef.once('value', async (snapshot) => {
            if (!snapshot.exists()) return; // Data not created yet.

            const data = snapshot.val();
            const lastAwardTime = data.lastRepAwardTime || 0;

            if (now - lastAwardTime > TEN_MINUTES) { // <-- USES THE NEW VALUE
                await userRef.child('rep').transaction(currentRep => (currentRep || 0) + 1);
                await userRef.child('lastRepAwardTime').set(now);
                console.log("Awarded 1 REP for 10 minutes of activity."); // <-- Updated log
            }
        });
    }

    function processEndOfGame(score) {
        // This is a placeholder for now. You can add point logic here later.
        // For the REP system, we only care about awarding for time and chat.
    }



    function autoRespawnCheck() {
        if (!state.features.autoRespawn) {
            autoRespawnDead = false;
            stopAutoRespawnSpam();
            return;
        }
        const isDead = (
            (window.snake && !window.snake.alive) ||
            (window.dead_mtm !== undefined && window.dead_mtm !== -1) ||
            (document.getElementById('died')?.style.display !== 'none') ||
            (document.querySelector('.playagain')?.offsetParent !== null)
        );
        if (isDead && !autoRespawnDead) {
            autoRespawnDead = true;
            startAutoRespawnSpam();
        } else if (!isDead && autoRespawnDead) {
            autoRespawnDead = false;
            stopAutoRespawnSpam();
        }
    }

    function startAutoRespawnSpam() {
        if (autoRespawnSpam) return;
        attemptAutoRespawn();
        autoRespawnSpam = setInterval(attemptAutoRespawn, 50);
    }

    function attemptAutoRespawn() {
        if (!autoRespawnDead || !state.features.autoRespawn) {
            stopAutoRespawnSpam();
            return;
        }
        const nickInput = document.getElementById('nick');
        if (nickInput && !nickInput.value.trim()) {
            nickInput.value = localStorage.getItem("nickname") || "Anon";
            nickInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (nickInput) nickInput.focus();
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
        }));
    }

    function stopAutoRespawnSpam() {
        if (autoRespawnSpam) {
            clearInterval(autoRespawnSpam);
            autoRespawnSpam = null;
        }
    }

    function enableAutoRespawn() {
        if (!deathCheckInterval) {
            deathCheckInterval = setInterval(autoRespawnCheck, 100);
        }
    }

    function disableAutoRespawn() {
        if (deathCheckInterval) {
            clearInterval(deathCheckInterval);
            deathCheckInterval = null;
        }
        autoRespawnDead = false;
        stopAutoRespawnSpam();
    }

    if (state.features.autoRespawn) enableAutoRespawn();

    const primeAudio = () => {
        state.deathSound.volume = 0.01;
        state.deathSound.play().then(() => {
            state.deathSound.pause();
            state.deathSound.currentTime = 0;
            state.deathSound.volume = 1;
        }).catch(console.error);
        document.removeEventListener('click', primeAudio);
        document.removeEventListener('keydown', primeAudio);
    };
    document.addEventListener('click', primeAudio);
    document.addEventListener('keydown', primeAudio);

    // --- ENHANCED GLOBAL STYLES (PROFILE POPUP) ---
    const style = document.createElement('style');
    style.textContent = `
    .profile-popup {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(1);
        min-width: 280px; /* Slightly wider */
        max-width: 90vw;
        background: linear-gradient(145deg, #38383E, #2A2A2F); /* Darker gradient */
        color: #e0e0e0; /* Softer white */
        border-radius: 12px; /* Smoother radius */
        border: 1px solid var(--menu-color-transparent, rgba(76, 175, 80, 0.5)); /* Use menu color for border */
        box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2);
        padding: 24px 30px 20px 30px;
        z-index: 10001; /* Ensure it's above chat */
        font-family: 'Segoe UI', 'Arial', sans-serif; /* Modern font */
        font-size: 1.05em;
        animation: fadeInProfile 0.25s cubic-bezier(.17,.67,.6,1.04);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    @keyframes fadeInProfile {
        from { opacity: 0; transform: translate(-50%, -55%) scale(0.92);}
        to   { opacity: 1; transform: translate(-50%, -50%) scale(1);}
    }
    .profile-popup .close-btn {
        position: absolute;
        top: 12px; right: 12px;
        background: none;
        border: none;
        color: #aaa; /* Softer color */
        font-size: 1.6em;
        line-height: 1;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s, color 0.2s;
    }
    .profile-popup .close-btn:hover { opacity: 1; color: #fff; }
    .profile-popup .avatar {
        width: 72px; height: 72px; /* Larger avatar */
        border-radius: 50%;
        background: #444; /* Darker placeholder */
        margin-bottom: 16px;
        object-fit: cover;
        border: 3px solid var(--menu-color, #4CAF50); /* Menu color border */
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    .profile-popup .status-dot {
        display: inline-block;
        width: 11px; height: 11px;
        border-radius: 50%;
        margin-right: 7px;
        vertical-align: middle;
        border: 1px solid rgba(0,0,0,0.2); /* Subtle border for dot */
    }
    .profile-popup_action_button {
        background-color: var(--menu-color, #4CAF50);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 6px 12px;
        font-size: 0.9em;
        cursor: pointer;
        margin: 2px;
        transition: background-color 0.2s ease;
    }
    .profile-popup_action_button:hover {
        /* Use JS to set darker color based on --menu-color */
    }

    /* General button styles for menu - can be used via classes if preferred */
    .mod-menu-button {
        padding: 8px 15px;
        border-radius: 6px;
        border: none;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s, box-shadow 0.2s;
        background-color: ${state.menuColor}; /* Default */
    }
    .mod-menu-button:hover {
        background-color: ${adjustColor(state.menuColor, -15)}; /* Darken on hover */
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .mod-menu-button-secondary {
        background-color: #4a4a4e; /* Dark gray for secondary actions */
    }
    .mod-menu-button-secondary:hover {
        background-color: #5a5a5e; /* Slightly lighter gray */
    }

    /* Styling for input fields */
    .mod-menu-input {
        padding: 8px 10px;
        border-radius: 5px;
        border: 1px solid #454548; /* Darker border */
        background-color: #2c2c30; /* Dark input background */
        color: #e0e0e0;
        font-size: 14px;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
    }
    .mod-menu-input:focus {
        outline: none;
        border-color: ${state.menuColor}; /* Accent color on focus */
        box-shadow: 0 0 0 2px ${hexToRgba(state.menuColor, 0.3)};
    }

    /* Keybind modal specific improvements */
    #keybind-modal {
        background: #2E2E34 !important; /* Darker background */
        border-radius: 10px !important;
        padding: 30px 35px !important;
        box-shadow: 0 6px 25px rgba(0,0,0,0.3) !important;
        border: 1px solid rgba(255,255,255,0.1);
    }
    #keybind-modal-action {
        color: #b0b0b0 !important; /* Softer text */
        font-size: 1.15em !important;
        margin-bottom: 16px !important;
    }
    #keybind-modal-cancel {
        background: #555 !important; /* Darker cancel button */
        padding: 9px 25px !important;
        border-radius: 5px !important;
        font-size: 0.95em !important;
        transition: background-color 0.2s !important;
    }
    #keybind-modal-cancel:hover {
        background: #666 !important;
    }

    /* --- NEW LEADERBOARD STYLES --- */
    #rep-leaderboard-content {
        display: flex;
        flex-direction: column;
        gap: 8px; /* Spacing between rows */
    }
    .leaderboard-row {
        display: flex;
        align-items: center;
        border-radius: 8px;
        padding: 10px;
        transition: all 0.2s ease-in-out;
        cursor: pointer; /* Make it look clickable */
    }
    .leaderboard-row:hover {
        transform: scale(1.02); /* Pop out on hover */
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    .leaderboard-rank {
        font-size: 1.4em;
        font-weight: 700;
        width: 40px;
        text-align: center;
        margin-right: 15px;
    }
    .leaderboard-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 15px;
        border: 2px solid #555;
    }
    .leaderboard-info {
        flex-grow: 1;
    }
    .leaderboard-name {
        font-weight: bold;
        font-size: 1.1em;
        color: #fff;
    }
    .leaderboard-rep {
        color: #aaa;
        font-size: 0.95em;
    }
    /* --- NEW: Styles for Chat Buttons and Pop-ups --- */
    .chat-action-btn {
        padding: 0 12px;
        height: 100%;
        background: transparent;
        border: none;
        border-left: 1px solid rgba(255,255,255,0.1);
        color: #aaa;
        font-size: 16px;
        cursor: pointer;
        transition: color 0.2s, background-color 0.2s;
    }
    .chat-action-btn:hover {
        color: #fff;
        background-color: rgba(255,255,255,0.1);
    }
    .emoji-picker, .gif-picker-modal {
        display: none;
        position: absolute;
        bottom: 50px; /* Position above the input bar */
        right: 10px;
        background: #2E2E34;
        border: 1px solid var(--menu-color, #4CAF50);
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.4);
        z-index: 10001;
        flex-direction: column;
        overflow: hidden;
    }
    .emoji-picker {
        padding: 10px;
        width: 280px;
        max-height: 200px;
        overflow-y: auto;
    }
    .emoji-picker span {
        font-size: 22px;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        display: inline-block;
    }
    .emoji-picker span:hover {
        background: #444;
    }
    .gif-picker-modal {
        width: 300px;
        height: 320px;
    }
    .gif-picker-header {
        display: flex;
        padding: 8px;
        border-bottom: 1px solid #444;
        background: rgba(0,0,0,0.2);
    }
    #gif-search-input {
        flex-grow: 1;
        background: #222;
        border: 1px solid #555;
        color: #eee;
        border-radius: 4px;
        padding: 6px 8px;
        outline: none;
    }
    #gif-search-input:focus {
        border-color: var(--menu-color, #4CAF50);
    }
    .gif-results-container {
        flex-grow: 1;
        overflow-y: auto;
        padding: 8px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
    .gif-results-container img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        cursor: pointer;
        border-radius: 4px;
        border: 2px solid transparent;
        transition: border-color 0.2s;
    }
    .gif-results-container img:hover {
        border-color: var(--menu-color, #4CAF50);
    }
    .chat-image-preview {
        max-width: 90%;
        max-height: 150px;
        border-radius: 6px;
        margin-top: 8px;
        cursor: pointer;
        border: 1px solid #555;
    }
    /* --- NEW: One-Time Info Popup Styles --- */
    .info-popup-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: 10050; /* High z-index to be on top of everything */
        background: rgba(0,0,0,0.8);
        align-items: center;
        justify-content: center;
        font-family: 'Segoe UI', Arial, sans-serif;
    }
    .info-popup-content {
        background: #2E2E34;
        border-radius: 12px;
        padding: 30px 40px;
        box-shadow: 0 8px 35px rgba(0,0,0,0.5);
        border: 1px solid var(--menu-color, #4CAF50);
        max-width: 500px;
        text-align: center;
        color: #e0e0e0;
        animation: fadeInProfile 0.3s cubic-bezier(.17,.67,.6,1.04);
    }
    .info-popup-content h2 {
        color: var(--menu-color, #4CAF50);
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.6em;
    }
    .info-popup-content p {
        font-size: 1.1em;
        line-height: 1.6;
        margin-bottom: 25px;
    }
    .info-popup-content a {
        color: #3498db; /* A nice link blue */
        text-decoration: none;
        font-weight: bold;
    }
    .info-popup-content a:hover {
        text-decoration: underline;
    }
    .info-popup-button {
        padding: 10px 30px;
        border-radius: 6px;
        border: none;
        color: #fff;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s;
        background-color: var(--menu-color, #4CAF50);
    }
    .info-popup-button:hover {
        background-color: var(--menu-color-darker, #3e8e41);
    }

    `;
    document.head.appendChild(style);
    // Function to update --menu-color CSS variable for profile popup border etc.
    function updateCSSVariables() {
        document.documentElement.style.setProperty('--menu-color', state.menuColor);
        document.documentElement.style.setProperty('--menu-color-transparent', hexToRgba(state.menuColor, 0.5));
        document.documentElement.style.setProperty('--menu-color-darker', adjustColor(state.menuColor, -15));
    }
    updateCSSVariables(); // Initial call


    function hexToRgba(hex, alpha = 1) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
        const num = parseInt(c, 16);
        return `rgba(${(num>>16)&255},${(num>>8)&255},${num&255},${alpha})`;
    }


    function replaceLinksWithDiscord(text) {
        const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
        return text.replace(urlRegex, 'https://dsc.gg/143X');
    }

    document.addEventListener('pointerdown', function primeDeathSoundOnce() {
        state.deathSound.volume = 0.01; // Very low volume
        state.deathSound.play().then(() => {
            state.deathSound.pause();
            state.deathSound.currentTime = 0;
            state.deathSound.volume = 1; // Reset to full volume
        }).catch(()=>{/* User hasn't interacted yet */});
        document.removeEventListener('pointerdown', primeDeathSoundOnce);
        document.removeEventListener('keydown', primeDeathSoundOnce); // Also remove keydown listener
    });
    // Add keydown listener as well for priming
    document.addEventListener('keydown', function primeDeathSoundOnceKey() {
        // This is the same function as above, effectively.
        // It ensures that either click or keydown will prime the audio.
        // The removeEventListener calls will handle removing both.
        state.deathSound.volume = 0.01;
        state.deathSound.play().then(() => {
            state.deathSound.pause();
            state.deathSound.currentTime = 0;
            state.deathSound.volume = 1;
        }).catch(()=>{});
        document.removeEventListener('pointerdown', primeDeathSoundOnce); // Remove the click listener
        document.removeEventListener('keydown', primeDeathSoundOnceKey); // Remove this keydown listener
    });


    function createChatSystem() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'mod-menu-chat-container';
        // --- ENHANCED CHAT CONTAINER STYLES ---
        chatContainer.style.cssText = `
            position: fixed;
            left: ${state.uiLayout.chat.x}px;
            top: ${state.uiLayout.chat.y}px;
            width: ${state.uiLayout.chat.width}px;
            height: ${state.uiLayout.chat.height}px;
            z-index: 9999;
            display: ${state.features.chatVisible ? 'flex' : 'none'};
            flex-direction: column;
            background: rgba(28, 28, 32, 0.97); /* Darker, more opaque */
            border: 1px solid ${hexToRgba(state.menuColor, 0.5)};
            border-radius: 8px; /* Smoother radius */
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            overflow: hidden; /* Important for border-radius */
            user-select: none; /* Prevent text selection during drag */
            font-family: 'Segoe UI', Arial, sans-serif; /* Modern font */
        `;

        // --- ENHANCED CHAT TABS ---
        const chatTabs = document.createElement('div');
        chatTabs.style.display = 'flex';
        chatTabs.style.borderBottom = `1px solid ${hexToRgba(state.menuColor, 0.3)}`;
        chatTabs.style.background = `rgba(0,0,0,0.1)`; // Subtle background for tab bar

        const chatTab = document.createElement('div');
        chatTab.textContent = '143X Chat';
        chatTab.id = 'chat-tab-main';
        chatTab.style.cssText = `
            flex: 1; padding: 10px 12px; text-align: center; cursor: pointer;
            font-weight: 500; color: #fff;
            background: ${hexToRgba(state.menuColor, 0.25)}; /* Active by default */
            transition: background 0.2s, color 0.2s;
            border-right: 1px solid ${hexToRgba(state.menuColor, 0.2)};
        `;

        const usersTab = document.createElement('div');
        usersTab.textContent = 'Online Users';
        usersTab.id = 'chat-tab-users';
        usersTab.style.cssText = `
            flex: 1; padding: 10px 12px; text-align: center; cursor: pointer;
            font-weight: 500; color: #ccc;
            background: transparent;
            transition: background 0.2s, color 0.2s;
        `;

        chatTab.onclick = () => {
            document.getElementById('mod-menu-chat-body').style.display = 'flex';
            document.getElementById('mod-menu-online-users').style.display = 'none';
            chatTab.style.background = hexToRgba(state.menuColor, 0.25);
            chatTab.style.color = '#fff';
            usersTab.style.background = 'transparent';
            usersTab.style.color = '#ccc';
        };
        usersTab.onclick = () => {
            document.getElementById('mod-menu-chat-body').style.display = 'none';
            document.getElementById('mod-menu-online-users').style.display = 'flex';
            chatTab.style.background = 'transparent';
            chatTab.style.color = '#ccc';
            usersTab.style.background = hexToRgba(state.menuColor, 0.25);
            usersTab.style.color = '#fff';
        };

        chatTabs.appendChild(chatTab);
        chatTabs.appendChild(usersTab);
        // chatContainer.appendChild(chatTabs); // Tabs will be part of header now

        // --- ENHANCED CHAT HEADER (for dragging and close button) ---
        const chatHeader = document.createElement('div');
        chatHeader.style.cssText = `
            /* height: 38px; Combined with tabs */
            /* padding: 0 12px; */ /* Padding will be within tabs */
            background: rgba(0,0,0,0.1); /* Match tabs bar */
            display: flex;
            /* justify-content: space-between; */ /* Tabs handle this */
            align-items: center;
            cursor: move; /* Draggable handle */
            border-bottom: 1px solid ${hexToRgba(state.menuColor, 0.3)};
        `;
        chatHeader.dataset.draggable = 'true';
        chatHeader.appendChild(chatTabs); // Tabs are inside header

        const chatToggle = document.createElement('div');
        chatToggle.innerHTML = '&times;'; // HTML entity for X
        chatToggle.style.cssText = `
            cursor: pointer; font-size: 22px; padding: 0 15px; color: #aaa;
            line-height: 1; transition: color 0.2s;
            position: absolute; right: 0; top: 0; height: 38px; /* Align with tab height */
            display: flex; align-items: center;
`;
        chatToggle.title = state.features.chatVisible ? 'Hide chat' : 'Show chat';
        chatToggle.onclick = (e) => { e.stopPropagation(); toggleChatVisible(); };
        chatToggle.onmouseenter = () => chatToggle.style.color = '#fff';
        chatToggle.onmouseleave = () => chatToggle.style.color = '#aaa';


        // --- MODIFIED: Create a container for the input and new buttons ---
        const chatInputContainer = document.createElement('div');
        chatInputContainer.style.cssText = `
            display: flex;
            align-items: center;
            border-top: 1px solid ${hexToRgba(state.menuColor, 0.3)};
            background: rgba(0,0,0,0.25);
        `;

        const slowModeIndicator = document.createElement('span');
        slowModeIndicator.id = 'slow-mode-indicator';
        slowModeIndicator.style.cssText = `
            display: none; /* Hidden by default */
            position: absolute;
            left: 15px; /* Aligns with input padding */
            top: 50%;
            transform: translateY(-50%);
            color: #ffc107; /* A nice warning yellow */
            font-size: 13px;
            font-weight: bold;
            pointer-events: none; /* Allows you to click through it */
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        `;

        const chatInput = document.createElement('input');
        chatInput.id = 'mod-menu-chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = `Press '${state.keybinds.chatEnabled.toUpperCase()}' to type...`;
        chatInput.style.cssText = `
            flex-grow: 1; /* Allow input to take up most space */
            padding: 12px 15px;
            border: none;
            background: transparent; /* Make background transparent */
            color: #e0e0e0; outline: none; font-size: 14px; box-sizing: border-box;
        `;

        // --- NEW: Create the GIF and Emoji buttons ---
        const gifBtn = document.createElement('button');
        gifBtn.id = 'gif-btn';
        gifBtn.textContent = 'GIF';
        gifBtn.title = 'Send a GIF';
        gifBtn.className = 'chat-action-btn'; // We will style this class later

        const emojiBtn = document.createElement('button');
        emojiBtn.id = 'emoji-btn';
        emojiBtn.textContent = '🙂';
        emojiBtn.title = 'Send an Emoji';
        emojiBtn.className = 'chat-action-btn';

        // Add elements to the container
        chatInputContainer.appendChild(chatInput);
        chatInputContainer.appendChild(slowModeIndicator);
        chatInputContainer.appendChild(gifBtn);
        chatInputContainer.appendChild(emojiBtn);

        // Add the new container to the chat area
        chatArea.appendChild(chatInputContainer);
        chatContainer.appendChild(chatArea);

        // --- ENHANCED RESIZE HANDLE ---
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute; right: 0; bottom: 0; width: 15px; height: 15px;
            cursor: nwse-resize;
            background-color: ${hexToRgba(state.menuColor, 0.4)}; /* Subtler handle */
            opacity: 0.7; transition: opacity 0.2s, background-color 0.2s;
            border-top-left-radius: 5px; /* Rounded corner for handle */
        `;
        resizeHandle.dataset.resizable = 'true';
        resizeHandle.onmouseenter = () => { resizeHandle.style.opacity = '1'; resizeHandle.style.backgroundColor = hexToRgba(state.menuColor, 0.6); };
        resizeHandle.onmouseleave = () => { resizeHandle.style.opacity = '0.7'; resizeHandle.style.backgroundColor = hexToRgba(state.menuColor, 0.4); };
        chatContainer.appendChild(resizeHandle);







        document.body.appendChild(chatContainer);

        makeDraggable(chatContainer, chatHeader);
        makeResizable(chatContainer, resizeHandle);




    }


    function syncChatBoxWithMenu() {
        const chatContainer = document.getElementById('mod-menu-chat-container');
        if (!chatContainer) return;

        const menuColor = state.menuColor;
        const lighterMenuColor = hexToRgba(menuColor, 0.25);
        const borderColor = hexToRgba(menuColor, 0.5);
        const borderTopColor = hexToRgba(menuColor, 0.3);

        chatContainer.style.border = `1px solid ${borderColor}`;

        const chatHeader = chatContainer.querySelector('div[style*="cursor: move"]'); // The draggable header
        if (chatHeader) {
            chatHeader.style.borderBottom = `1px solid ${borderTopColor}`;
        }

        const chatTabMain = document.getElementById('chat-tab-main');
        const chatTabUsers = document.getElementById('chat-tab-users');

        if (chatTabMain && chatTabUsers) {
            // Determine which tab is active to reapply styles correctly
            const chatBodyVisible = document.getElementById('mod-menu-chat-body')?.style.display !== 'none';
            if (chatBodyVisible) {
                chatTabMain.style.background = lighterMenuColor;
                chatTabMain.style.color = '#fff';
                chatTabUsers.style.background = 'transparent';
                chatTabUsers.style.color = '#ccc';
            } else {
                chatTabMain.style.background = 'transparent';
                chatTabMain.style.color = '#ccc';
                chatTabUsers.style.background = lighterMenuColor;
                chatTabUsers.style.color = '#fff';
            }
             chatTabMain.style.borderRight = `1px solid ${hexToRgba(menuColor, 0.2)}`;
        }


        const chatInput = document.getElementById('mod-menu-chat-input');
        if (chatInput) {
            chatInput.style.borderTop = `1px solid ${borderTopColor}`;
            chatInput.placeholder = `Press '${state.keybinds.chatEnabled.toUpperCase()}' to type...`; // Update placeholder if keybind changes
        }

        const resizeHandle = chatContainer.querySelector('div[style*="cursor: nwse-resize"]');
        if (resizeHandle) {
            const baseHandleColor = hexToRgba(menuColor, 0.4);
            const hoverHandleColor = hexToRgba(menuColor, 0.6);
            resizeHandle.style.backgroundColor = baseHandleColor;
            resizeHandle.onmouseenter = () => { resizeHandle.style.opacity = '1'; resizeHandle.style.backgroundColor = hoverHandleColor; };
            resizeHandle.onmouseleave = () => { resizeHandle.style.opacity = '0.7'; resizeHandle.style.backgroundColor = baseHandleColor; };
        }

        const chatBody = document.getElementById('mod-menu-chat-body');
        if (chatBody) {
            chatBody.style.scrollbarColor = `${menuColor} rgba(0,0,0,0.2)`;
        }
        const onlineUsers = document.getElementById('mod-menu-online-users');
        if (onlineUsers) {
            onlineUsers.style.scrollbarColor = `${menuColor} rgba(0,0,0,0.2)`;
        }
    }


    function rainbowTextStyle(name) {
        const rainbowColors = ["#ef3550","#f48fb1","#7e57c2","#2196f3","#26c6da","#43a047","#eeff41","#f9a825","#ff5722"];
        return name.split('').map((char, i) =>
            `<span style="color:${rainbowColors[i % rainbowColors.length]}; font-weight: bold; text-shadow: 0 0 3px ${rainbowColors[i % rainbowColors.length]}66;">${char}</span>`
        ).join('');
    }

    // --- NEW: Helper function to escape HTML characters for security ---
    function escapeHTML(str) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }


// --- REPLACEMENT: Corrected Firebase Chat Loading and Rendering System ---
function loadFirebaseChat() {
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
    script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';
        script2.onload = () => {
            const script3 = document.createElement('script');
            script3.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js';
            script3.onload = () => {
                const firebaseConfig = { // KEEP YOUR CONFIG PRIVATE
                    apiKey: "AIzaSyCtTloqGNdhmI3Xt0ta11vF0MQJHiKpO7Q",
                    authDomain: "chatforwormax.firebaseapp.com",
                    databaseURL: "https://chatforwormax-default-rtdb.firebaseio.com",
                    projectId: "chatforwormax",
                    storageBucket: "chatforwormax.appspot.com",
                    messagingSenderId: "1045559625491",
                    appId: "1:1045559625491:web:79eb8200eb87edac00bce6"
                };
                if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

                firebase.database().ref('/modInfo/latestVersion').once('value')
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const latestVersion = snapshot.val();
                        state.versionStatus = (latestVersion === config.currentVersion) ? 'Current' : `Outdated! (v${latestVersion} is available)`;
                    } else { state.versionStatus = 'Unknown'; }
                }).catch(error => {
                    console.error("Firebase version check failed:", error);
                    state.versionStatus = 'Check Failed';
                }).finally(() => { if (typeof updateMenu === "function") updateMenu(); });

                const auth = firebase.auth();
                auth.signInAnonymously().then(async (userCredential) => {
                    const uid = userCredential.user.uid;
                    const playerDataRef = firebase.database().ref(`playerData/${uid}`);
                    playerDataRef.once('value', (snapshot) => {
                        if (!snapshot.exists()) {
                            playerDataRef.set({ rep: 0, lastRepAwardTime: 0, lastChatRepTime: 0, });
                        }
                    });
                    const nickname = localStorage.getItem("nickname") || "Anon";
                    const userRef = firebase.database().ref("onlineUsers/" + uid);
                    let snapshot;
                    try {
                        snapshot = await userRef.once('value');
                    } catch (err) { console.error("Failed to fetch profile from Firebase:", err); snapshot = null; }
                    if (snapshot && snapshot.exists()) {
                        const cloudData = snapshot.val();
                        if (cloudData.profileAvatar) localStorage.setItem("profileAvatar", cloudData.profileAvatar);
                        if (cloudData.profileMotto) localStorage.setItem("profileMotto", cloudData.profileMotto);
                    }
                    const localAvatar = localStorage.getItem("profileAvatar");
                    const localMotto = localStorage.getItem("profileMotto");
                    let needsUpdate = false;
                    const updates = {};
                    if (localAvatar && (!snapshot?.val()?.profileAvatar || snapshot.val().profileAvatar !== localAvatar)) {
                        updates.profileAvatar = localAvatar;
                        needsUpdate = true;
                    }
                    if (localMotto && (!snapshot?.val()?.profileMotto || snapshot.val().profileMotto !== localMotto)) {
                        updates.profileMotto = localMotto;
                        needsUpdate = true;
                    }
                    if (needsUpdate) await userRef.update(updates);
                    userRef.onDisconnect().remove();
                    let chatColor = localStorage.getItem("chatNameColor") || "#FFD700";
                    // This regex ensures the color is a valid 3 or 6-digit hex code.
                    if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(chatColor)) {
                        chatColor = "#FFD700"; // If it's invalid, reset to default.
                        localStorage.setItem("chatNameColor", chatColor); // Correct the bad value in storage.
                    }
                    await userRef.update({ name: nickname, uid: uid, lastActive: Date.now(), chatNameColor: chatColor });
                    setInterval(() => { userRef.update({ lastActive: Date.now() }); }, 30000);
                }).catch(err => { console.error("Firebase sign-in error:", err); });

                firebase.database().ref("onlineUsers").on("value", snapshot => {
                    const users = snapshot.val() || {};
                    const onlineUsersEl = document.getElementById('mod-menu-online-users');
                    if (onlineUsersEl) {
                        const now = Date.now();
                        const usersList = Object.entries(users)
                        .filter(([_, user]) => now - (user.lastActive || 0) < 300000)
                        // SECURED CODE
                        .map(([userUid, user]) => {
                            let displayName = escapeHTML(filterProfanity(user.name || 'Anon'));
                            let nameColor = user.chatNameColor || '#FFD700';

                            // --- THIS VALIDATION IS CRITICAL ---
                            // It ensures only a valid hex color code can be used.
                            if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(nameColor)) {
                                nameColor = '#FFD700'; // If it's malicious, force it to be the default yellow.
                            }
                            // --- END OF CRITICAL VALIDATION ---

                            let userIdentifier = (auth.currentUser && userUid === auth.currentUser.uid) ? ' <span style="color: #8f8; font-size:0.9em;">(You)</span>' : '';
                            if (isDev(user.uid, user.name)) displayName = rainbowTextStyle(displayName);
                            else if (isVip(user.uid, user.name)) displayName = vipGlowStyle(displayName, nameColor);
                            return `<div style="padding: 5px 2px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center;"><span style="width: 10px; height: 10px; border-radius: 50%; background-color: lime; margin-right: 8px;"></span><span class="online-username" data-uid="${user.uid}" style="color:${nameColor};font-weight:bold; flex-grow: 1; cursor:pointer;text-decoration:underline dotted;">${displayName}</span>${userIdentifier}</div>`;
                        }).join('');
                        onlineUsersEl.innerHTML = usersList || '<div style="text-align:center;color:#888;margin-top:10px;">No other users online.</div>';
                    }
                });


                // --- END OF FIXED CHAT LOADING LOGIC ---

                const chatInput = document.getElementById('mod-menu-chat-input');
                chatInput.addEventListener('keydown', async function (e) {
                    if (e.key === 'Enter') {
                        const now = Date.now();
                        const timeSinceLastMessage = now - lastChatMessageTime;

                        // NEW: Enforce slow mode with a better alert
                        if (timeSinceLastMessage < chatCooldown) {
                            const timeLeft = Math.ceil((chatCooldown - timeSinceLastMessage) / 1000);
                            alert(`Slow mode is active. Please wait ${timeLeft} more second(s).`);
                            e.preventDefault();
                            return;
                        }

                        e.preventDefault(); e.stopPropagation();
                        const currentUID = auth.currentUser.uid;

                        try {
                            const punishSnap = await firebase.database().ref(`chatPunishments/${currentUID}`).once('value');
                            if (punishSnap.exists()) {
                                const punishment = punishSnap.val();
                                if (punishment.type === "timeout" && Date.now() < punishment.until) {
                                    let mins = Math.ceil((punishment.until - Date.now()) / 60000);
                                    alert(`You are timed out from chat for ${mins} more minute(s).`);
                                    chatInput.value = ''; chatInput.blur(); return;
                                }
                            }
                        } catch (err) { console.error("Error checking punishment:", err); }

                        if (chatInput.value.trim()) {
                            const nickname = localStorage.getItem("nickname") || "Anon";
                            let chatColor = localStorage.getItem("chatNameColor") || "#FFD700";
                            // This regex ensures the color is a valid 3 or 6-digit hex code.
                            if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(chatColor)) {
                                chatColor = "#FFD700"; // If it's invalid, reset to default.
                            }
                            const messagePayload = {
                                uid: currentUID, name: nickname, text: chatInput.value.trim(),
                                time: firebase.database.ServerValue.TIMESTAMP, // Use server time for accuracy
                                chatNameColor: chatColor // Use the validated color
                            };

                            firebase.database().ref("slitherChat").push(messagePayload);
                            firebase.database().ref("discordBridge").push(messagePayload);

                            lastChatMessageTime = Date.now();
                            chatInput.value = '';

                            // NEW: Start the visual countdown timer loop
                            if (slowModeInterval) clearInterval(slowModeInterval);
                            slowModeInterval = setInterval(updateSlowModeIndicator, 250);
                            updateSlowModeIndicator(); // Run once immediately to hide it
                        }
                        chatInput.blur();

                        const userRef = firebase.database().ref(`playerData/${currentUID}`);
                        const CHAT_REP_COOLDOWN = 5 * 60 * 1000;
                        const snapshot = await userRef.once('value');
                        if (snapshot.exists()) {
                            const lastChatTime = snapshot.val().lastChatRepTime || 0;
                            if (now - lastChatTime > CHAT_REP_COOLDOWN) {
                                await userRef.child('rep').transaction(currentRep => (currentRep || 0) + 1);
                                await userRef.child('lastChatRepTime').set(now);
                                console.log("Awarded 1 REP for chatting.");
                            }
                        }
                    }
                }); // This is the closing of the keydown listener


                chatInput.addEventListener('input', function() {
                    // When the user types, check if a cooldown is active
                    if (Date.now() - lastChatMessageTime < chatCooldown) {
                        // If it is, and the timer isn't already running, start it
                        if (!slowModeInterval) {
                            slowModeInterval = setInterval(updateSlowModeIndicator, 250);
                        }
                    }
                    // Always run the update function on input to correctly show/hide the timer
                    updateSlowModeIndicator();
                });
                // ^^^ END OF NEW LISTENER ^^^
            };
            document.head.appendChild(script3);
        };
        document.head.appendChild(script2);
    };
    document.head.appendChild(script1);
}

// --- THIS IS THE FINAL, WORKING CHAT RENDERING FUNCTION ---
async function renderChatMessage(msg, chatBodyElement, currentUid, shouldScroll = false) {
    if (!msg || !msg.uid) return;

    // Helper function to validate hex color
    const isValidHexColor = (color) => /^#([0-9a-fA-F]{3}){1,2}$/.test(color);
    let userColor = msg.chatNameColor || '#FFD700';
    if (!isValidHexColor(userColor)) {
        userColor = '#FFD700';
    }

    let nameHtml;
    let messageText;
    let roleTagHTML = '';
    let displayName;


    // 4. Assemble and render
    const el = document.createElement('div');
    const borderColor = (msg.uid === currentUid) ? state.menuColor : userColor;
    const bgColor = (msg.uid === currentUid) ? hexToRgba(state.menuColor, 0.12) : 'rgba(255,255,255,0.04)';
    el.style.cssText = `margin-bottom: 8px; word-break: break-word; background: ${bgColor}; padding: 8px 12px; border-radius: 6px; color: #ddd; font-family: inherit; font-size: 14px; line-height: 1.5; border-left: 3px solid ${borderColor};`;

    const timestamp = new Date(msg.time).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
    el.innerHTML = `<span style="color:#888; font-size:0.9em; margin-right:5px;">${timestamp}</span> <b>${nameHtml}${roleTagHTML}:</b> ${finalMessage}`;

    chatBodyElement.appendChild(el);

    if (shouldScroll || chatBodyElement.scrollTop >= chatBodyElement.scrollHeight - chatBodyElement.clientHeight - 150) {
        chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
    }
}

    function createTrailOverlayCanvas() {
        let overlay = document.getElementById('snake-trail-overlay');
        if (overlay) {
            overlay.style.display = 'block'; // <-- Always show overlay when trail is ON
            return overlay;
        }
        const gameCanvas = document.querySelector('canvas');
        if (!gameCanvas) return null;

        overlay = document.createElement('canvas');
        overlay.id = 'snake-trail-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = gameCanvas.style.left || '0px';
        overlay.style.top = gameCanvas.style.top || '0px';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9000';
        overlay.width = window.innerWidth; // Match window size as per your original
        overlay.height = window.innerHeight; // Match window size
        overlay.style.display = 'block'; // <-- Make sure it's visible when created
        document.body.appendChild(overlay);

        // Adjust overlay size on resize
        window.addEventListener('resize', () => {
            if (overlay) { // Check if overlay still exists
                overlay.width = window.innerWidth;
                overlay.height = window.innerHeight;
            }
        });

        return overlay;
    }


    function addChatMessage(messageContent, isSystemMessage = false) {
       // This function is largely for local messages if ever needed.
       // Firebase handles the main chat display.
       console.log("Local addChatMessage called (primarily for debug/local system messages):", messageContent);
       // If you want to display these in the chat UI, you would add DOM manipulation here
       // similar to renderChatMessage but without Firebase specific data.
    }

    function updateChatDisplay() {
        // This function is effectively replaced by the real-time updates
        // from Firebase handled by renderChatMessage.
        // console.log("updateChatDisplay called (mostly deprecated).");
    }


    function makeDraggable(element, handle) {
        handle.addEventListener('mousedown', function(e) {
            // Check if the event target is the handle itself or a child that shouldn't prevent dragging (e.g. text in header)
            // And ensure it's a left-click
            if ((e.target.dataset.draggable === 'true' || handle.contains(e.target)) && e.button === 0) {
                 // Prevent dragging if mousedown on an interactive element within the handle (e.g., a button in chat header)
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'A' || e.target.closest('button, input, a')) {
                    return;
                }

                e.preventDefault(); // Prevent text selection
                state.draggingElement = element;
                state.dragStartX = e.clientX;
                state.dragStartY = e.clientY;
                state.elementStartX = parseInt(element.style.left, 10) || 0; // Use current position
                state.elementStartY = parseInt(element.style.top, 10) || 0;
            }
        });
    }

    function makeResizable(element, handle) {
        handle.addEventListener('mousedown', function(e) {
            if (e.target.dataset.resizable === 'true' && e.button === 0) {
                e.preventDefault();
                state.resizingElement = element;
                state.dragStartX = e.clientX;
                state.dragStartY = e.clientY;
                state.elementStartWidth = parseInt(element.style.width, 10) || 300;
                state.elementStartHeight = parseInt(element.style.height, 10) || 200;
            }
        });
    }

    // --- START: Slow Mode Indicator Logic ---
    let slowModeInterval = null; // This will hold our timer

    function updateSlowModeIndicator() {
        const indicator = document.getElementById('slow-mode-indicator');
        const chatInput = document.getElementById('mod-menu-chat-input');
        if (!indicator || !chatInput) return; // Exit if elements don't exist

        const now = Date.now();
        const timeSinceLastMessage = now - lastChatMessageTime;

        if (timeSinceLastMessage < chatCooldown && chatInput.value.length > 0) {
            // If in cooldown and user is typing, show the timer
            const timeLeft = Math.ceil((chatCooldown - timeSinceLastMessage) / 1000);
            indicator.textContent = `Slow Mode: ${timeLeft}s`;
            indicator.style.display = 'block';
            chatInput.style.textIndent = '115px'; // Push the typed text to the right
        } else {
            // Otherwise, hide the timer
            indicator.style.display = 'none';
            chatInput.style.textIndent = '0px'; // Reset text position
            if (slowModeInterval) {
                clearInterval(slowModeInterval); // Stop the timer loop
                slowModeInterval = null;
            }
        }
    }
    // --- END: Slow Mode Indicator Logic ---



    function applyUIScale() {
        const menu = document.getElementById('mod-menu');
        const chat = document.getElementById('mod-menu-chat-container');
        const serverBox = document.getElementById('custom-server-box'); // Get the server box
        const scaleValue = state.uiScale;

        // Apply scaling to the main menu
        if (menu) {
            if (menu.style.right && menu.style.right !== 'auto') {
                menu.style.transformOrigin = 'top right';
            } else {
                menu.style.transformOrigin = 'top left';
            }
            menu.style.transform = `scale(${scaleValue})`;
        }
        // Apply scaling to the chat window
        if (chat) {
            chat.style.transformOrigin = 'top left';
            chat.style.transform = `scale(${scaleValue})`;
        }
        // Apply scaling to the server IP box
        if (serverBox) {
            serverBox.style.transformOrigin = 'center top'; // Scales from the top center
            serverBox.style.transform = `scale(${scaleValue})`;
        }
    }

    document.addEventListener('mousemove', function(e) {
        if (state.draggingElement) {
            const dx = e.clientX - state.dragStartX;
            const dy = e.clientY - state.dragStartY;
            let newX = state.elementStartX + dx;
            let newY = state.elementStartY + dy;

            // Boundary checks (optional, but good for usability)
            const eleRect = state.draggingElement.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - eleRect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - eleRect.height));


            state.draggingElement.style.left = `${newX}px`;
            state.draggingElement.style.top = `${newY}px`;

            const id = state.draggingElement.id;
            if (id === 'mod-menu') { state.uiLayout.menu.x = newX; state.uiLayout.menu.y = newY; }
            else if (id === 'mod-menu-chat-container') { state.uiLayout.chat.x = newX; state.uiLayout.chat.y = newY; }
        }

        if (state.resizingElement) {
            const dx = e.clientX - state.dragStartX;
            const dy = e.clientY - state.dragStartY;
            const newWidth = Math.max(250, state.elementStartWidth + dx); // Min width
            const newHeight = Math.max(200, state.elementStartHeight + dy); // Min height

            state.resizingElement.style.width = `${newWidth}px`;
            state.resizingElement.style.height = `${newHeight}px`;

            const id = state.resizingElement.id;
            if (id === 'mod-menu') { state.uiLayout.menu.width = newWidth; state.uiLayout.menu.height = newHeight; }
            else if (id === 'mod-menu-chat-container') { state.uiLayout.chat.width = newWidth; state.uiLayout.chat.height = newHeight; }
        }
    });

    document.addEventListener('mouseup', function() {
        if (state.draggingElement || state.resizingElement) {
            localStorage.setItem('modMenuUILayout', JSON.stringify(state.uiLayout));
        }
        state.draggingElement = null;
        state.resizingElement = null;
    });

    // === MENU CREATION (Structural Change) ===
    const menu = document.createElement('div');
    menu.id = 'mod-menu';
    menu.style.position = 'fixed';
    menu.style.top = state.uiLayout.menu.y !== null ? `${state.uiLayout.menu.y}px` : '50px';
    menu.style.left = state.uiLayout.menu.x !== null ? `${state.uiLayout.menu.x}px` :
                      (config.menuPosition === 'left' ? '50px' :
                      (config.menuPosition === 'center' ? '50%' : 'auto'));
    if (config.menuPosition === 'center' && state.uiLayout.menu.x === null) {
        menu.style.transform = 'translateX(-50%)';
    }
    menu.style.right = state.uiLayout.menu.x !== null ? 'auto' :
                      (config.menuPosition === 'right' ? '50px' : 'auto');

    // --- ENHANCED MENU STYLES ---
    menu.style.background = 'rgba(28, 28, 32, 0.97)'; // Darker, more opaque
    menu.style.border = `1px solid ${hexToRgba(state.menuColor, 0.6)}`; // Thinner, but distinct border
    menu.style.borderRadius = '10px'; // Consistent radius
    // Padding is handled by header and content area
    menu.style.zIndex = '9999';
    menu.style.color = '#e0e0e0'; // Softer white
    menu.style.fontFamily = "'Segoe UI', Arial, sans-serif"; // Modern font
    menu.style.fontSize = '14px';
    // Width is set in updateMenu based on simplified state
    menu.style.boxShadow = '0 6px 25px rgba(0,0,0,0.3)'; // Softer, larger shadow
    menu.style.backdropFilter = 'blur(8px)'; // Stronger blur if supported
    menu.style.transition = 'border-color 0.3s, box-shadow 0.3s'; // For color changes
    menu.style.userSelect = "none"; // Prevent text selection on menu body
    menu.style.overflow = 'hidden'; // Crucial for border-radius on children
    document.body.appendChild(menu);

    // Persistent Draggable Header for Main Menu
    const menuDraggableHeader = document.createElement('div');
    menuDraggableHeader.id = 'mod-menu-draggable-header';
    menuDraggableHeader.dataset.draggable = 'true'; // For makeDraggable
    // Styles for this header will be set in updateMenu to react to state.menuColor and state.menuName
    menu.appendChild(menuDraggableHeader);

    // Persistent Content Area for Main Menu
    const menuContentArea = document.createElement('div');
    menuContentArea.id = 'mod-menu-content-area';
    menuContentArea.style.padding = '0 20px 15px 20px'; // Padding for content below header
    menuContentArea.style.maxHeight = 'calc(90vh - 80px)'; // Max height with some margin
    menuContentArea.style.overflowY = 'auto'; // Scrollable content
    menuContentArea.style.overflowX = 'hidden';
    // Custom scrollbar for content area
    menuContentArea.style.scrollbarWidth = 'thin';
    menuContentArea.style.scrollbarColor = `${state.menuColor} rgba(0,0,0,0.2)`;
    menu.appendChild(menuContentArea);

    makeDraggable(menu, menuDraggableHeader); // Initialize dragging

    // --- START: Add Resize Handle for Main Menu ---
    const menuResizeHandle = document.createElement('div');
    menuResizeHandle.id = 'mod-menu-resize-handle';
    menuResizeHandle.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        width: 18px; /* A good size for grabbing */
        height: 18px;
        cursor: nwse-resize; /* The diagonal resize cursor */
        z-index: 10000; /* Ensures it's on top of menu content */
        opacity: 0.6;
        transition: opacity 0.2s, border-color 0.3s;
    `;
    menuResizeHandle.dataset.resizable = 'true';
    menuResizeHandle.onmouseenter = () => { menuResizeHandle.style.opacity = '1'; };
    menuResizeHandle.onmouseleave = () => { menuResizeHandle.style.opacity = '0.6'; };
    menu.appendChild(menuResizeHandle);

    // Now, connect the handle to the resizing logic function
    makeResizable(menu, menuResizeHandle);
    // --- END: Add Resize Handle ---

    // (modal injection):
// REPLACE the old block with this NEW, FIXED block
// (modal injection):
if (!document.getElementById('keybind-modal-overlay')) {
    const modalHTML = `
    <div id="keybind-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10002; background:rgba(0,0,0,0.75); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;">
        <div id="keybind-modal" style="background:#2E2E34; border-radius:10px; padding:30px 35px; box-shadow:0 6px 25px rgba(0,0,0,0.4); display:flex; flex-direction:column; align-items:center; min-width:320px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color:#fff; font-size:1.4em; font-weight:600; margin-bottom:12px;">Rebind Key</div>
            <div id="keybind-modal-action" style="color:#b0b0b0; font-size:1.15em; margin-bottom:18px;">Action: Placeholder</div>
            <div style="color:#fff; font-size:1.1em; margin-bottom:24px;">Press a key to assign... <br><small>(Or scroll mouse wheel)</small></div>
            <button id="keybind-modal-cancel" style="background:#555; color:#fff; border:none; padding:9px 25px; border-radius:5px; font-size:0.95em; cursor:pointer; transition: background-color 0.2s;">Cancel</button>
        </div>
    </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstElementChild);

    // Attach the click listener for the cancel button RIGHT HERE <<< FIX
    // This guarantees the button exists before we try to find it.
    const cancelBtn = document.getElementById('keybind-modal-cancel');
    if (cancelBtn) {
        // We can reuse the existing `closeKeybindModal` function. <<< FIX
        // It already does everything we need (hides the modal and resets the state).
        cancelBtn.onclick = closeKeybindModal;
    }
}



    // --- NEW: Edit Profile Modal ---
    if (!document.getElementById('edit-profile-modal-overlay')) {
        const profileModalStyle = document.createElement('style');
        profileModalStyle.textContent = `
            #edit-profile-modal-overlay {
                display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 10003; background: rgba(0,0,0,0.75);
                align-items: center; justify-content: center; font-family: 'Segoe UI', Arial, sans-serif;
            }
            #edit-profile-modal {
                background: #2E2E34; border-radius: 10px; padding: 25px 30px;
                box-shadow: 0 6px 25px rgba(0,0,0,0.4); display:flex; flex-direction:column;
                min-width: 400px; border: 1px solid rgba(255,255,255,0.1);
            }
            .profile-modal-title {
                color: #fff; font-size: 1.4em; font-weight: 600; margin-bottom: 20px; text-align: center;
            }
            .profile-modal-label {
                color: #bbb; font-size: 0.9em; margin-bottom: 5px;
            }
            .profile-modal-input {
                width: 100%; padding: 10px; margin-bottom: 15px; background: #222;
                border: 1px solid #555; border-radius: 5px; color: #eee; font-size: 1em;
                box-sizing: border-box; transition: border-color 0.2s;
            }
            .profile-modal-input:focus {
                outline: none; border-color: ${state.menuColor};
            }
            .profile-modal-buttons {
                display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;
            }
            #profile-modal-save { background: ${state.menuColor}; color: #fff; }
            #profile-modal-cancel { background: #555; color: #fff; }
            .profile-modal-button {
                border: none; padding: 9px 20px; border-radius: 5px;
                font-size: 0.95em; cursor: pointer; transition: background-color 0.2s;
            }
            #profile-modal-save:hover { background: ${adjustColor(state.menuColor, -15)}; }
            #profile-modal-cancel:hover { background: #666; }
        `;
        document.head.appendChild(profileModalStyle);

        const profileModalHTML = `
        <div id="edit-profile-modal-overlay">
            <div id="edit-profile-modal">
                <div class="profile-modal-title">Edit Your Profile</div>

                <label for="profile-avatar-input" class="profile-modal-label">Avatar URL (.png, .jpg, .gif)</label>
                <input id="profile-avatar-input" type="text" class="profile-modal-input" placeholder="https://i.imgur.com/example.png">

                <label for="profile-motto-input" class="profile-modal-label">Motto / Status</label>
                <input id="profile-motto-input" type="text" class="profile-modal-input" placeholder="The best slither player!" maxlength="60">

                <div id="profile-modal-status" style="color: #ffc107; text-align: center; height: 18px; margin-top: 5px; font-size: 0.9em;"></div>

                <div class="profile-modal-buttons">
                    <button id="profile-modal-cancel" class="profile-modal-button">Cancel</button>
                    <button id="profile-modal-save" class="profile-modal-button">Save</button>
                </div>
            </div>
        </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = profileModalHTML;
        document.body.appendChild(tempDiv.firstElementChild);

        // Attach listeners for the modal's buttons RIGHT AWAY
        // Attach listeners for the modal's buttons RIGHT AWAY
        document.getElementById('profile-modal-cancel').onclick = () => {
            const editModal = document.getElementById('edit-profile-modal-overlay');
            if (editModal) {
                editModal.style.display = 'none';
                delete editModal.dataset.targetUid; // Add this line to clear the target
            }
        };
        // The 'Save' button logic will be handled later.
    }


    // --- NEW: Timeout Modal ---
    if (!document.getElementById('timeout-modal-overlay')) {
        const timeoutModal = document.createElement('div');
        timeoutModal.id = 'timeout-modal-overlay';
        timeoutModal.style = `
            display:none; position:fixed; top:0; left:0; width:100vw; height:100vh;
            z-index:10005; background:rgba(0,0,0,0.7); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;`;
        timeoutModal.innerHTML = `
        <div style="background:#2E2E34;padding:28px 33px;border-radius:10px;box-shadow:0 6px 25px rgba(0,0,0,0.4);min-width:320px;display:flex;flex-direction:column;align-items:center; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color:#fff;font-size:1.3em;font-weight:600;margin-bottom:20px;">Timeout User</div>
            <div style="margin-bottom:15px; display:flex; align-items:center; gap: 8px;">
            <input id="timeout-value" type="number" min="1" max="9999" value="5" style="width:70px;padding:8px 10px;border-radius:5px;border:1px solid #555;background:#222;color:#eee;font-size:1em;text-align:center;">
            <select id="timeout-unit" style="padding:8px 10px;border-radius:5px;border:1px solid #555;background:#222;color:#eee;font-size:1em;">
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
            </select>
            </div>
            <div style="display:flex;gap:10px; margin-top:10px;">
            <button id="timeout-cancel-btn" style="padding:9px 20px;border-radius:5px;background:#555;color:#fff;border:none;cursor:pointer; font-size: 0.95em; transition: background 0.2s;">Cancel</button>
            <button id="timeout-confirm-btn" style="padding:9px 20px;border-radius:5px;background:#c9302c;color:#fff;border:none;cursor:pointer; font-size: 0.95em; transition: background 0.2s;">Confirm Timeout</button>
            </div>
        </div>
        `;
        document.body.appendChild(timeoutModal);

        // --- Add Listeners for the Timeout Modal ---
        document.getElementById('timeout-cancel-btn').onclick = () => {
            document.getElementById('timeout-modal-overlay').style.display = 'none';
        };

        document.getElementById('timeout-confirm-btn').onclick = async () => {
            const overlay = document.getElementById('timeout-modal-overlay');
            const uid = overlay.dataset.targetUid;
            const username = overlay.dataset.targetName;
            const value = parseInt(document.getElementById('timeout-value').value, 10);
            const unit = document.getElementById('timeout-unit').value;

            if (!uid || !username || !value || value < 1) {
                alert("Invalid timeout value.");
                return;
            }

            let mins = value;
            if (unit === 'hours') mins *= 60;
            if (unit === 'days') mins *= 1440; // 60 * 24

            const until = Date.now() + mins * 60 * 1000;

            try {
                await firebase.database().ref(`chatPunishments/${uid}`).set({
                    type: "timeout",
                    until,
                    by: firebase.auth().currentUser.uid,
                    name: username
                });

                await firebase.database().ref("slitherChat").push({
                    uid: "system",
                    name: "System",
                    text: `${username} was timed out from chat for ${value} ${unit}.`,
                    time: Date.now(),
                    chatNameColor: "#e91e63"
                });

                alert(`${username} timed out successfully.`);
                overlay.style.display = 'none';
                document.getElementById('profile-popup')?.remove();
            } catch(err) {
                alert(`Failed to timeout user: ${err.message}`);
            }
        };
    }

    // --- NEW: REP Leaderboard Modal ---
    if (!document.getElementById('rep-leaderboard-modal')) {
        const leaderboardModal = document.createElement('div');
        leaderboardModal.id = 'rep-leaderboard-modal';
        // We set the border color here using a CSS variable that our other code already updates
        leaderboardModal.style = `
            display:none; position:fixed; top:0; left:0; width:100vw; height:100vh;
            z-index:10010; background:rgba(0,0,0,0.75); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;`;
        leaderboardModal.innerHTML = `
            <div style="background:#23232a; border-radius:12px; padding:28px 35px; min-width:380px; max-height: 80vh; display: flex; flex-direction: column; box-shadow:0 6px 25px rgba(0,0,0,0.4); border: 1px solid var(--menu-color, #4CAF50); position:relative;">
                <button id="rep-leaderboard-close" style="position:absolute;top:10px;right:10px;font-size:1.5em;background:none;border:none;color:#aaa;cursor:pointer;line-height:1;">×</button>
                <h2 style="color:#FFD700; margin-top:0; text-align:center; padding-bottom: 10px; border-bottom: 1px solid #444;">REP Leaderboard</h2>
                <div id="rep-leaderboard-content" style="margin-top:15px; overflow-y: auto; padding-right: 10px;"></div>
            </div>
        `;
        document.body.appendChild(leaderboardModal);

        // Attach the listener to the close button right away
        document.getElementById('rep-leaderboard-close').onclick = () => {
            leaderboardModal.style.display = 'none';
        };
    }

    // --- NEW: Cleanup for Expired Punishments ---
    // This runs in the background to remove old timeouts from the database.
    setInterval(async () => {
        try {
            const punishRef = firebase.database().ref("chatPunishments");
            const snap = await punishRef.orderByChild('until').endAt(Date.now()).once('value');
            if (snap.exists()) {
                const updates = {};
                snap.forEach(child => {
                    updates[child.key] = null; // Mark for deletion
                });
                punishRef.update(updates);
                console.log('Cleaned up expired punishments.');
            }
        } catch (err) {
            console.error('Error during punishment cleanup:', err);
        }
    }, 5 * 60 * 1000); // Check every 5 minutes


    // --- ENHANCED FPS/PING DISPLAYS ---
    const fpsDisplay = document.createElement('div');
    fpsDisplay.id = 'fps-display';
    fpsDisplay.style.cssText = `
        position: fixed; bottom: 10px; right: 10px; color: #e0e0e0;
        font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; z-index: 10000;
        display: ${state.features.fpsDisplay ? 'block' : 'none'};
        background: rgba(15,15,18,0.85); padding: 5px 10px; border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(4px);
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(fpsDisplay);

    // Ping display removed from here, integrated into simplified menu if needed, or can be added back similarly
    // const pingDisplay = document.createElement('div'); ...

    // --- ENHANCED CIRCLE VISUAL ---
    const circleVisual = document.createElement('div');
    circleVisual.id = 'circle-visual';
    circleVisual.style.cssText = `
        position: fixed; border: 2px dashed ${hexToRgba(state.menuColor, 0.7)};
        border-radius: 50%; pointer-events: none; transform: translate(-50%, -50%);
        z-index: 9998; display: none; transition: all 0.2s ease;
        box-shadow: 0 0 12px ${hexToRgba(state.menuColor, 0.3)}, inset 0 0 8px ${hexToRgba(state.menuColor, 0.2)};
    `;
    document.body.appendChild(circleVisual);

    // Chat overlay (for updates/maintenance) - style slightly enhanced
    const chatOverlay = document.createElement('div');
    chatOverlay.id = 'mod-menu-chat-overlay';
    chatOverlay.style.cssText = `
        position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
        background: rgba(20,20,24,0.95); border: 1px solid ${state.menuColor};
        border-radius: 8px; padding: 25px 30px; z-index: 10000; color: #e0e0e0;
        font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; text-align: center;
        display: none; box-shadow: 0 5px 20px rgba(0,0,0,0.4);
    `;
    chatOverlay.textContent = 'Chat feature is currently under maintenance.';
    document.body.appendChild(chatOverlay);


    async function promptForUniqueNickname() {
        let nickname;
        let isValidNickname = false;

        while (!isValidNickname) {
            nickname = prompt("Enter a nickname for chat (1-20 chars, letters, numbers, and underscores_ only):");

            if (nickname === null) {
                nickname = "Anon";
                isValidNickname = true;
                break;
            }

            nickname = nickname.trim();

            if (nickname === "") {
                nickname = "Anon";
                isValidNickname = true;
                break;
            }

            if (nickname.length < 1 || nickname.length > 20) {
                alert("Nickname must be between 1 and 20 characters long.");
                continue;
            }

            if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
                alert("Nickname can only contain letters, numbers, and underscores (_).");
                continue;
            }

            if (nickname.toLowerCase() === "anon") {
                 isValidNickname = true;
                 break;
            }

            let exists = false;
            if (typeof firebase !== "undefined" && firebase.database) {
                try {
                    const snapshot = await firebase.database().ref("onlineUsers")
                                         .orderByChild("name_lowercase")
                                         .equalTo(nickname.toLowerCase())
                                         .once('value');
                    exists = snapshot.exists();
                } catch (e) {
                    console.warn("Firebase nickname uniqueness check failed during prompt:", e);
                    exists = false;
                }
            } else {
                console.warn("promptForUniqueNickname: Firebase not available to check uniqueness.");
            }

            if (exists) {
                alert("That nickname is already in use. Please choose another.");
            } else {
                isValidNickname = true;
            }
        }

        localStorage.setItem("nickname", nickname);
        if (firebase && firebase.auth && firebase.auth().currentUser) {
            const userRef = firebase.database().ref(`onlineUsers/${firebase.auth().currentUser.uid}`);
            userRef.update({ name: nickname, name_lowercase: nickname.toLowerCase() })
                .catch(err => console.error("Error updating nickname in Firebase during prompt:", err));
        }
        return nickname;
    }

    (async function ensureUniqueNickname() {
        if (!localStorage.getItem("nickname")) {
            await promptForUniqueNickname();
        } else {
            const nickname = localStorage.getItem("nickname");
            // Basic check if Firebase is likely loaded - more robust checks are in loadFirebaseChat
            if (typeof firebase !== "undefined" && firebase.database) {
                 try {
                    const snapshot = await firebase.database().ref("onlineUsers").once('value');
                    const users = snapshot.val() || {};
                    const currentUserUid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
                    // If someone else (not current user) is using this nickname, prompt again
                    const isTakenByOther = Object.entries(users).some(([uid, user]) =>
                        uid !== currentUserUid && user.name && user.name.toLowerCase() === nickname.toLowerCase()
                    );
                    if (isTakenByOther) {
                        alert("That nickname is already in use by another player. Please choose another.");
                        await promptForUniqueNickname();
                    }
                } catch (e) {
                    console.warn("Firebase check for nickname failed, proceeding:", e);
                }
            }
        }
        createChatSystem();
        loadFirebaseChat();
        syncChatBoxWithMenu(); // Initial sync after creation
    })();


    // --- THOROUGHLY REVAMPED updateMenu FUNCTION ---
    function updateMenu() {
        const menuColor = state.menuColor;
        const menuDraggableHeader = document.getElementById('mod-menu-draggable-header');
        const menuContentArea = document.getElementById('mod-menu-content-area');

        // Update persistent draggable header styles
        if (menuDraggableHeader) {
            menuDraggableHeader.style.cssText = `
                padding: 12px 20px; /* Consistent padding */
                margin-bottom: 10px; /* Space before content */
                background: linear-gradient(to bottom, ${hexToRgba(menuColor, 0.3)}, ${hexToRgba(menuColor, 0.2)});
                border-bottom: 1px solid ${hexToRgba(menuColor, 0.4)};
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            `;
            // Content of the header (title + version/buttons)
            menuDraggableHeader.innerHTML = `
                <h2 id="mod-menu-title" style="margin:0; color:#fff; font-size:1.4em; font-weight:600; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                    ${state.menuName}
                </h2>
                <div style="color:#ccc; font-size:0.9em;">0.1</div>
            `;
        }

        // Update main menu border and shadow
        menu.style.border = `1px solid ${hexToRgba(menuColor, 0.6)}`;
        menu.style.boxShadow = `0 6px 25px ${hexToRgba(menuColor, 0.15)}`;
        circleVisual.style.border = `2px dashed ${hexToRgba(menuColor, 0.7)}`;
        circleVisual.style.boxShadow = `0 0 12px ${hexToRgba(menuColor, 0.3)}, inset 0 0 8px ${hexToRgba(menuColor, 0.2)}`;


        // --- START: Update Menu Resize Handle Style ---
        const menuResizeHandle = document.getElementById('mod-menu-resize-handle');
        if (menuResizeHandle) {
            // Creates a visual triangle in the corner using borders
            menuResizeHandle.style.borderRight = `2px solid ${hexToRgba(menuColor, 0.8)}`;
            menuResizeHandle.style.borderBottom = `2px solid ${hexToRgba(menuColor, 0.8)}`;
        }
        // --- END: Update Menu Resize Handle Style ---

        // Update scrollbar color for content area
        if (menuContentArea) {
            menuContentArea.style.scrollbarColor = `${menuColor} rgba(0,0,0,0.2)`;
        }


        const arrow = state.showCustomization ? '▼' : '▶';
        const inputStyle = `padding:8px 10px; border-radius:5px; border:1px solid #454548; background-color:#2c2c30; color:#e0e0e0; font-size:14px; box-sizing:border-box; transition: border-color 0.2s, box-shadow 0.2s;`;
        const focusStyle = `this.style.borderColor='${menuColor}'; this.style.boxShadow='0 0 0 2px ${hexToRgba(menuColor, 0.3)}';`;
        const blurStyle = `this.style.borderColor='#454548'; this.style.boxShadow='none';`;

        const buttonStyle = (bgColor = menuColor, textColor = '#fff') =>
            `padding:8px 15px; border-radius:6px; border:none; color:${textColor}; font-size:14px; font-weight:500; cursor:pointer; transition:background-color 0.2s, box-shadow 0.2s; background-color:${bgColor};`;
        const buttonHoverStyle = (bgColor = menuColor) => `this.style.backgroundColor='${adjustColor(bgColor, -15)}'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)';`;
        const buttonLeaveStyle = (bgColor = menuColor) => `this.style.backgroundColor='${bgColor}'; this.style.boxShadow='none';`;


        if (state.simplified) {
            menu.style.width = state.uiLayout.menu.width !== null ? `${state.uiLayout.menu.width}px` : '340px'; // Slightly wider simplified menu
            menuContentArea.innerHTML = `
                <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
                     <button id="default-menu-btn" title="Expand menu" style="${buttonStyle(menuColor)}; padding: 6px 12px; font-size: 13px;"
                        onmouseover="${buttonHoverStyle(menuColor)}" onmouseout="${buttonLeaveStyle(menuColor)}">
                        Full Menu
                    </button>
                </div>
                <div style="background:${hexToRgba(menuColor,0.08)}; padding:12px 15px; border-radius:8px; margin-bottom:15px; border: 1px solid ${hexToRgba(menuColor,0.2)};">
                    <div style="font-size:1.1em; margin-bottom:10px; color:${menuColor}; font-weight:600; text-align:center; padding-bottom:8px; border-bottom: 1px solid ${hexToRgba(menuColor,0.2)};">
                        Quick Status
                    </div>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; font-size:14px; line-height:1.8;">
                        <span><b>Perf Mode:</b></span> <span style="color:#87CEEB; text-align:right;">Low (Optimized)</span>
                        <span><b>Zoom:</b></span> <span style="text-align:right;">${Math.round(100 / state.zoomFactor)}%</span>
                        <span><b>FPS:</b></span> <span style="color:#90EE90; text-align:right;">${state.fps}</span>
                        <span><b>Server:</b></span> <span style="color:#FFD700; text-align:right;">${state.features.showServer ? (state.server || 'N/A') : 'Hidden'}</span>
                        <span><b>Chat:</b></span> <span style="color:${state.features.chatVisible ? '#90EE90' : '#FF7F7F'}; text-align:right;">${state.features.chatVisible ? 'ON' : 'OFF'}</span>
                        <span><b>Keybinds:</b></span> <span style="color:${state.features.keybindsEnabled ? '#90EE90' : '#FF7F7F'}; text-align:right;">${state.features.keybindsEnabled ? 'ON' : 'OFF'}</span>
                        <span><b>Ping:</b></span> <span id="ping-value-simplified" style="color:#FFD700; text-align:right;">${state.ping} ms</span>
                    </div>
                </div>
                 <div style="text-align:center; font-size:12px; color:#888; margin-top:15px; padding-top:10px; border-top:1px solid #444; line-height:1.6;">
                    Press <strong>${state.keybinds.toggleMenu.toUpperCase()}</strong> to toggle menu
                </div>
            `;
            // Logic for simplified menu button
            setTimeout(() => {
                const btn = document.getElementById('default-menu-btn');
                if (btn) {
                    btn.onclick = () => {
                        state.simplified = false;
                        sessionStorage.setItem('modMenuSimplified', 'false');
                        state.features.performanceMode = parseInt(localStorage.getItem('prevPerformanceMode')) || 2; // Restore
                        applyPerformanceMode();
                        updateMenu();
                    };
                }
                 // Update ping display in simplified menu
                const pingValueDisplay = document.getElementById("ping-value-simplified");
                if (pingValueDisplay) pingValueDisplay.textContent = `${state.ping} ms`;
            }, 0);

             if (state.features.performanceMode !== 1) {
                state.features.performanceMode = 1;
                applyPerformanceMode();
            }
            return; // End simplified menu update
        }


            let versionColor = '#FFD700'; // Yellow for 'Checking...'
            if (state.versionStatus === 'Current') {
                versionColor = '#90EE90'; // Green
            } else if (state.versionStatus.startsWith('Outdated')) {
                versionColor = '#FF7F7F'; // Red
            } else if (state.versionStatus === 'Unknown' || state.versionStatus === 'Check Failed') {
                versionColor = '#aaa'; // Gray for errors
            }


        // Full Menu
        menu.style.width = state.uiLayout.menu.width !== null ? `${state.uiLayout.menu.width}px` : '480px'; // Wider full menu
        let menuHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div>
                <span id="customization-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; font-weight:bold; font-size:1.05em;">
                    ${arrow} Menu Customization
                </span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <button id="simplify-menu-btn" title="Simplify menu" style="${buttonStyle('#5a5a5e')}; padding: 6px 12px; font-size: 13px;"
                    onmouseover="${buttonHoverStyle('#5a5a5e')}" onmouseout="${buttonLeaveStyle('#5a5a5e')}">Simplify</button>
                <button id="open-keybinds-menu-btn" style="${buttonStyle()}; padding: 6px 12px; font-size: 13px;"
                     onmouseover="${buttonHoverStyle()}" onmouseout="${buttonLeaveStyle()}">Keybinds</button>
            </div>
        </div>

        <div id="customization-section" style="display:${state.showCustomization ? 'block' : 'none'}; background:${hexToRgba(menuColor,0.08)}; padding:15px; border-radius:8px; margin-bottom:20px; border: 1px solid ${hexToRgba(menuColor,0.2)};">
            <div style="display:grid; grid-template-columns: 1fr auto; gap:10px; align-items:center; margin-bottom:12px;">
                <input id="mod-menu-name-input" type="text" placeholder="Menu Name..." value="${state.menuName.replace(/"/g,'&quot;')}" style="${inputStyle} width:100%;" onfocus="${focusStyle}" onblur="${blurStyle}">
                <button id="mod-menu-name-btn" style="${buttonStyle(menuColor)}; padding: 8px 12px;" onmouseover="${buttonHoverStyle()}" onmouseout="${buttonLeaveStyle()}">Set Name</button>
            </div>
            <div style="display:flex; gap:15px; align-items:center; justify-content:start;">
                <div style="display:flex; align-items:center; gap:5px;">
                     <label for="mod-menu-color-input" style="color:${menuColor}; font-size:14px; cursor:pointer;">Theme:</label>
                     <input id="mod-menu-color-input" type="color" value="${state.menuColor}" style="width:28px; height:28px; border:none; outline:2px solid ${menuColor}; border-radius:5px; cursor:pointer; background:transparent;">
                </div>
                <div style="display:flex; align-items:center; gap:5px;">
                    <label for="chat-name-color-input" style="color:${menuColor}; font-size:14px; cursor:pointer;">Chat Name:</label>
                    <input id="chat-name-color-input" type="color" value="${localStorage.getItem("chatNameColor") || "#FFD700"}" style="width:28px; height:28px; border:none; outline:2px solid ${localStorage.getItem("chatNameColor") || "#FFD700"}; border-radius:5px; cursor:pointer; background:transparent;">
                </div>
            </div>
        </div>
        `;

        menuHtml += `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom:20px">
            <div>
                <div id="movement-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-top:0; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showMovement ? '▼' : '▶'} Movement
                </div>
                <div id="movement-section" style="display:${state.showMovement ? 'block' : 'none'};">
                <p><strong>${state.keybinds.circleRestriction.toUpperCase()}: Circle Restrict:</strong> <span style="color:${state.features.circleRestriction ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.circleRestriction ? 'ON' : 'OFF'}</span></p>
                <p><strong>${state.keybinds.circleSmaller.toUpperCase()}/${state.keybinds.circleLarger.toUpperCase()}: Circle Size:</strong> <span style="float:right;">${state.circleRadius}px</span></p>
                <p><strong>${state.keybinds.autoCircle.toUpperCase()}: Bot Movement:</strong> <span style="color:${state.features.autoCircle ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.autoCircle ? 'ON' : 'OFF'}</span></p>
                <p><strong>${state.keybinds.autoBoost.toUpperCase()}: Auto Boost:</strong> <span style="color:${state.features.autoBoost ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.autoBoost ? 'ON' : 'OFF'}</span></p>

                </div> <!-- ADD THIS CLOSING DIV -->
                <div id="zoom-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-top:20px; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showZoom ? '▼' : '▶'} Zoom
                </div>
                <div id="zoom-section" style="display:${state.showZoom ? 'block' : 'none'};">
                <p><strong>${state.keybinds.zoomOut.toUpperCase()}: Zoom In</strong></p>
                <p><strong>${state.keybinds.zoomReset.toUpperCase()}: Reset Zoom</strong></p>
                </div>

                <div id="utilities-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-top:20px; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showUtilities ? '▼' : '▶'} Utilities
                </div>
                <div id="utilities-section" style="display:${state.showUtilities ? 'block' : 'none'};">
                 <p><strong>${(state.keybinds.autoRespawn || 'S').toUpperCase()}: Auto Respawn:</strong> <span style="color:${state.features.autoRespawn ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.autoRespawn ? 'ON' : 'OFF'}</span></p>
                 <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <span><strong>${(state.keybinds.neonLine || 'E').toUpperCase()}: Neon Line:</strong> <span style="color:${state.features.neonLine ? '#90EE90' : '#FF7F7F'};">${state.features.neonLine ? 'ON' : 'OFF'}</span></span>
                    <input id="neon-line-color-input" type="color" value="${state.features.neonLineColor}" style="width:24px;height:24px;border:none;outline:2px solid ${state.features.neonLineColor};border-radius:4px;cursor:pointer;background:transparent;">
                </div>
                <button id="help-info-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-top:10px; padding: 7px 0;"
                    onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                    ❔ Level Info
                </button>
                    <button id="rep-leaderboard-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-top:10px; padding: 7px 0;"onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">🏆 Rep Leaderboard</button>
            </div>
            </div>
            <div>
                <div id="visuals-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-top:0; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showVisuals ? '▼' : '▶'} Visuals & Audio
                </div>
                <div id="visuals-section" style="display:${state.showVisuals ? 'block' : 'none'};">
                <p><strong>1-3: Performance:</strong> <span style="color:${['#90EE90','#87CEEB','#FFA07A'][state.features.performanceMode-1] || '#aaa'}; float:right;">${['Low','Medium','High'][state.features.performanceMode-1] || 'N/A'}</span></p>
                <p><strong>${state.keybinds.fpsDisplay.toUpperCase()}: FPS Display:</strong> <span style="color:${state.features.fpsDisplay ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.fpsDisplay ? 'ON' : 'OFF'}</span></p>
                <p><strong>${state.keybinds.deathSound.toUpperCase()}: Death Sound:</strong> <span style="color:${state.features.deathSound ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.deathSound ? 'ON' : 'OFF'}</span></p>
                <p><strong>${state.keybinds.showServer.toUpperCase()}: Show Server IP:</strong> <span style="color:${state.features.showServer ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.showServer ? 'ON' : 'OFF'}</span></p>
                <div style="display:flex; align-items:center; justify-content:space-between; margin:10px 0;">
                    <button id="trail-toggle-btn" style="${buttonStyle('#4a4a4e')}; flex-grow:1; margin-right:10px;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Trail: <span style="color:${state.features.snakeTrail ? '#90EE90' : '#FF7F7F'};">${state.features.snakeTrail ? 'ON' : 'OFF'}</span>
                    </button>
                    <input id="trail-color-input" type="color" value="${state.features.snakeTrailColor}" style="width:28px;height:28px;border:none;outline:2px solid ${state.features.snakeTrailColor};border-radius:5px;cursor:pointer;background:transparent;">
                </div>
                <button id="afk-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:10px;"
                    onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                    AFK Mode: <span id="afk-status" style="color:${afkOn ? '#90EE90' : '#FF7F7F'};">${afkOn ? 'ON' : 'OFF'}</span>
                </button>

                <!-- START OF NEW BUTTONS -->
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <button id="ui-scale-down-btn" style="${buttonStyle('#4a4a4e')}; flex:1; padding:7px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        UI Scale -
                    </button>
                    <button id="ui-scale-up-btn" style="${buttonStyle('#4a4a4e')}; flex:1; padding:7px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        UI Scale +
                    </button>
                </div>
                <!-- END OF NEW BUTTONS -->

                </div>
                <div id="links-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-top:20px; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showLinks ? '▼' : '▶'} Info
                </div>
                <div id="links-section" style="display:${state.showLinks ? 'block' : 'none'};">
                Macro Es El Mejor Creador de Mods De Wormax.io</strong> <span style="float:right; opacity:0.7;">🔗</span></p>

            </div>
            </div>
        </div>

        <div id="status-toggle" style="background:${hexToRgba(menuColor,0.08)}; color:${menuColor}; font-weight:bold; cursor:pointer; user-select:none; padding:10px 15px; border-radius:8px; margin-bottom:0px; border: 1px solid ${hexToRgba(menuColor,0.2)};">
                ${state.showStatus ? '▼' : '▶'} Status & Extras
            </div>
            <div id="status-section" style="display:${state.showStatus ? 'block' : 'none'}; background:${hexToRgba(menuColor,0.08)}; padding:15px; border-radius:8px; margin-bottom:15px; border: 1px solid ${hexToRgba(menuColor,0.2)}; border-top:none; border-top-left-radius:0; border-top-right-radius:0;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                <div>
                    <h3 style="color:${menuColor}; margin-top:0; margin-bottom:10px; font-size:1.1em; font-weight:600;">Status</h3>
                    <p><strong>Game State:</strong> <span style="float:right;">${state.isInGame ? 'In Game' : 'Menu'}</span></p>
                    <p><strong>Zoom:</strong> <span style="float:right;">${Math.round(100 / state.zoomFactor)}%</span></p>
                    <p><strong>FPS:</strong> <span style="float:right;">${state.fps}</span></p>
                    <p><strong>Keybinds:</strong> <span style="color:${state.features.keybindsEnabled ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.keybindsEnabled ? 'ON' : 'OFF'}</span></p>
                    <p><strong>Version:</strong> <span style="color:${versionColor}; font-weight:bold; float:right;">${state.versionStatus}</span></p>
                </div>
                <div>
                    <h3 style="color:${menuColor}; margin-top:0; margin-bottom:10px; font-size:1.1em; font-weight:600;">Extras</h3>
                    <p><strong>Server:</strong> <span style="color:#FFD700; float:right;">${state.features.showServer ? (state.server || 'N/A') : 'Hidden'}</span></p>
                    <div style="margin-top:8px;">


                    </div>
                </div>
            </div>
        </div>

        <div style="text-align:center; font-size:12px; color:#888; margin-top:15px; padding-top:10px; border-top:1px solid #444; line-height:1.7;">
            <span style="color:#ff6b6b; font-weight:bold;">(Developers will NEVER ask for money in chat. Beware of Scammers.)</span><br>
            Press <strong>${state.keybinds.toggleMenu.toUpperCase()}</strong> to hide/show menu |
            <b>Mod Panel Wormax.io</b> |
            <strong>${state.keybinds.screenshot.toUpperCase()}</strong> Screenshot<br>
            Made by: <b>Macro</b> on Discord
        </div>
        `;

        if (menuContentArea) menuContentArea.innerHTML = menuHtml;


        // Event listeners for newly created elements
        setTimeout(() => {
            // Customization Toggle
            const custToggle = document.getElementById('customization-toggle');
            if (custToggle) {
                custToggle.onclick = () => {
                    state.showCustomization = !state.showCustomization;
                    sessionStorage.setItem('showCustomization', state.showCustomization.toString());
                    updateMenu();
                };
            }



            // --- Our New Click Handlers ---
            const movementToggle = document.getElementById('movement-toggle');
            if (movementToggle) {
                movementToggle.onclick = () => {
                    state.showMovement = !state.showMovement;
                    updateMenu();
                };
            }

            const zoomToggle = document.getElementById('zoom-toggle');
            if (zoomToggle) {
                zoomToggle.onclick = () => {
                    state.showZoom = !state.showZoom;
                    updateMenu();
                };
            }

            const utilitiesToggle = document.getElementById('utilities-toggle');
            if (utilitiesToggle) {
                utilitiesToggle.onclick = () => {
                    state.showUtilities = !state.showUtilities;
                    updateMenu();
                };
            }

            const visualsToggle = document.getElementById('visuals-toggle');
            if (visualsToggle) {
                visualsToggle.onclick = () => {
                    state.showVisuals = !state.showVisuals;
                    updateMenu();
                };
            }

            const linksToggle = document.getElementById('links-toggle');
            if (linksToggle) {
                linksToggle.onclick = () => {
                    state.showLinks = !state.showLinks;
                    updateMenu();
                };
            }

            const statusToggle = document.getElementById('status-toggle');
            if (statusToggle) {
                statusToggle.onclick = () => {
                    state.showStatus = !state.showStatus;
                    updateMenu();
                };
            }

            // Simplify Button
            const simplifyBtn = document.getElementById('simplify-menu-btn');
            if (simplifyBtn) {
                simplifyBtn.onclick = () => {
                    localStorage.setItem('prevPerformanceMode', state.features.performanceMode.toString());
                    state.simplified = true;
                    state.features.performanceMode = 1;
                    applyPerformanceMode();
                    sessionStorage.setItem('modMenuSimplified', 'true');
                    updateMenu();
                };
            }
            // Keybinds Button
            const keybindsBtn = document.getElementById('open-keybinds-menu-btn');
            if (keybindsBtn) keybindsBtn.onclick = showKeybindsMenu;

            // Menu Name and Color Inputs
            const nameInput = document.getElementById('mod-menu-name-input');
            const nameBtn = document.getElementById('mod-menu-name-btn');
            const colorIn = document.getElementById('mod-menu-color-input');
            if (nameBtn && nameInput) {
                nameBtn.onclick = () => {
                    const val = nameInput.value.trim();
                    if (val.length > 0) {
                        state.menuName = val;
                        localStorage.setItem('modMenuName', val);
                        updateMenu(); // Update menu title in draggable header
                        syncServerBoxWithMenu(); // Update server box title
                    }
                };
                nameInput.onkeydown = (e) => { if (e.key === 'Enter') nameBtn.click(); };
            }
            if (colorIn) {
                colorIn.oninput = () => {
                    state.menuColor = colorIn.value;
                    localStorage.setItem('modMenuColor', state.menuColor);
                    updateCSSVariables(); // Update global CSS vars
                    updateMenu(); // Re-style elements based on new color
                    syncServerBoxWithMenu();
                    syncChatBoxWithMenu();
                };
                colorIn.style.outlineColor = state.menuColor; // Sync outline with current color
            }
            const chatNameColorIn = document.getElementById('chat-name-color-input');
            if (chatNameColorIn) {
                chatNameColorIn.oninput = () => {
                    localStorage.setItem('chatNameColor', chatNameColorIn.value);
                    // No full updateMenu needed, but if there's a live preview, update it.
                    // For now, color picker outline updates itself.
                    chatNameColorIn.style.outlineColor = chatNameColorIn.value;
                };
                chatNameColorIn.style.outlineColor = localStorage.getItem("chatNameColor") || "#FFD700";
            }


            // Neon Line Color Input
            const neonLineColorInput = document.getElementById('neon-line-color-input');
            if (neonLineColorInput) {
                neonLineColorInput.value = state.features.neonLineColor;
                neonLineColorInput.oninput = () => {
                    state.features.neonLineColor = neonLineColorInput.value;
                    neonLineColor = neonLineColorInput.value; // Assuming global var for drawing
                    if (neonCtx) neonCtx.shadowColor = neonLineColor;
                    neonLineColorInput.style.outlineColor = state.features.neonLineColor;
                };
                neonLineColorInput.style.outlineColor = state.features.neonLineColor;
            }

             // AFK Button
            const afkBtnEl = document.getElementById('afk-btn');
            if (afkBtnEl) afkBtnEl.onclick = () => setAfk(!afkOn); // setAfk updates its own status text



            // UI Scale Buttons
            const uiScaleDownBtn = document.getElementById('ui-scale-down-btn');
            const uiScaleUpBtn = document.getElementById('ui-scale-up-btn');
            const scaleStep = 0.05;

            if (uiScaleDownBtn) {
                uiScaleDownBtn.onclick = () => {
                    state.uiScale = Math.max(0.6, state.uiScale - scaleStep); // Min 60%
                    localStorage.setItem('modMenuUIScale', state.uiScale.toString());
                    applyUIScale();
                };
            }
            if (uiScaleUpBtn) {
                uiScaleUpBtn.onclick = () => {
                    state.uiScale = Math.min(1.5, state.uiScale + scaleStep); // Max 150%
                    localStorage.setItem('modMenuUIScale', state.uiScale.toString());
                    applyUIScale();
                };
            }


            // Toggle Background Button
            const helpInfoBtn = document.getElementById('help-info-btn');
            if (helpInfoBtn) {
                helpInfoBtn.onclick = () => {
                    const helpModal = document.getElementById('rep-help-modal');
                    if (helpModal) {
                        helpModal.style.display = 'flex';
                    }
                };
            }

            // Leaderboard for Rep
            const repLeaderboardBtn = document.getElementById('rep-leaderboard-btn');
            if (repLeaderboardBtn) {

            repLeaderboardBtn.onclick = async () => {
                const modal = document.getElementById('rep-leaderboard-modal');
                const content = document.getElementById('rep-leaderboard-content');
                if (!modal || !content) return;

                modal.style.display = 'flex';
                content.innerHTML = '<div style="color:#aaa;text-align:center;">Loading leaderboard...</div>';

                try {
                    // First, get the top 10 players by REP score. This is always correct.
                    const repSnapshot = await firebase.database().ref('playerData').orderByChild('rep').limitToLast(10).once('value');
                    if (!repSnapshot.exists()) {
                        content.innerHTML = '<div style="color:#aaa;text-align:center;">No players with REP found yet.</div>';
                        return;
                    }

                    const players = [];
                    const userPromises = [];

                    repSnapshot.forEach(child => {
                        const playerData = child.val();
                        const uid = child.key;

                        // For each top player, TRY to get their profile from the working `onlineUsers` list.
                        const userPromise = firebase.database().ref(`onlineUsers/${uid}`).once('value')
                            .then(userSnap => {
                                let userProfile = {};
                                if (userSnap.exists()) {
                                    // If they are online, we have their info!
                                    userProfile = userSnap.val();
                                } else {
                                    // If they are OFFLINE, create a placeholder profile. THIS PREVENTS THE CRASH.
                                    userProfile = { name: 'Offline User', profileAvatar: null };
                                }

                                players.push({
                                    uid: uid,
                                    rep: playerData.rep || 0,
                                    name: userProfile.name || 'Offline User',
                                    avatar: userProfile.profileAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(uid)}`
                                });
                            });
                        userPromises.push(userPromise);
                    });

                    // Wait for all lookups to finish
                    await Promise.all(userPromises);

                    // Sort players by REP score, descending
                    players.sort((a, b) => b.rep - a.rep);
                    // --- NEW: Filter out devs and system accounts from the leaderboard ---
                    const filteredPlayers = players.filter(player =>
                        !isDev(player.uid) &&
                        !isSystemAccount(player.uid)
                    );
                    // --- End of new filter ---

                    // Build and display the leaderboard HTML
                    content.innerHTML = filteredPlayers.map((p, i) => {
                        const rank = i + 1;
                        let rankStyle = 'color: #ddd;';
                        let rowStyle = 'background: rgba(255, 255, 255, 0.04); border-left: 4px solid #555;';
                        if (rank === 1) { rankStyle = 'color: #FFD700; text-shadow: 0 0 5px #FFD700;'; rowStyle = 'background: linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0) 60%); border-left: 4px solid #FFD700;'; }
                        else if (rank === 2) { rankStyle = 'color: #C0C0C0; text-shadow: 0 0 5px #C0C0C0;'; rowStyle = 'background: linear-gradient(90deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0) 60%); border-left: 4px solid #C0C0C0;'; }
                        else if (rank === 3) { rankStyle = 'color: #CD7F32; text-shadow: 0 0 5px #CD7F32;'; rowStyle = 'background: linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0) 60%); border-left: 4px solid #CD7F32;'; }

                        let displayName = escapeHTML(filterProfanity(p.name));
                        if (p.name === 'Offline User') { displayName = `<i style="color:#999;">${displayName}</i>`; }

                        if (isDev(p.uid)) { displayName = rainbowTextStyle(filterProfanity(p.name)); }
                        else if (isVip(p.uid, p.name)) { displayName = vipGlowStyle(filterProfanity(p.name), '#FFD700'); }

                        return `<div class="leaderboard-row leaderboard-clickable-row" data-uid="${p.uid}" style="${rowStyle}">
                                    <div class="leaderboard-rank" style="${rankStyle}">#${rank}</div>
                                    <img class="leaderboard-avatar" src="${p.avatar}" onerror="this.src='https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(p.uid)}';">
                                    <div class="leaderboard-info">
                                        <div class="leaderboard-name">${displayName}</div>
                                        <div class="leaderboard-rep"><b style="color:var(--menu-color, #4CAF50); font-weight:900;">${p.rep.toLocaleString()}</b> REP</div>
                                    </div>
                                </div>`;
                    }).join('');

                } catch (err) {
                    console.error("Error loading rep leaderboard:", err);
                    content.innerHTML = `<div style="color:#f77;text-align:center;">Error loading leaderboard. Please check console.</div>`;
                }
            };
            }

            // Trail Toggle and Color
            const trailToggleBtn = document.getElementById('trail-toggle-btn');
            if (trailToggleBtn) {
                trailToggleBtn.onclick = () => {
                    state.features.snakeTrail = !state.features.snakeTrail;
                    if (!state.features.snakeTrail) {
                        state.snakeTrailPoints = [];
                        clearTrailOverlay();
                    }
                    updateMenu();
                };
            }
            const trailColorInput = document.getElementById('trail-color-input');
            if (trailColorInput) {
                trailColorInput.oninput = () => {
                    state.features.snakeTrailColor = trailColorInput.value;
                    trailColorInput.style.outlineColor = state.features.snakeTrailColor;
                    // No full updateMenu needed unless other elements depend on this color live.
                };
                trailColorInput.style.outlineColor = state.features.snakeTrailColor;
            }

            // Chat Toggle Button (in main menu)
            const chatToggleBtn = document.getElementById('chat-toggle-btn');
            if (chatToggleBtn) chatToggleBtn.onclick = toggleChatVisible;

            // Change Nickname Button
            const changeNickBtn = document.getElementById('change-nickname-btn');
            if (changeNickBtn) {
                changeNickBtn.onclick = async () => {
                    localStorage.removeItem("nickname"); // Clear old one
                    await promptForUniqueNickname(); // Prompt for new
                    // Consider re-initializing chat or parts of it if needed, or simply reload
                    window.location.reload();
                };
            }



        }, 0); // End setTimeout for event listeners

        syncServerBoxWithMenu();
        syncChatBoxWithMenu();
        updateCSSVariables(); // Ensure CSS variables are current
    }



    let lastWheelTime = 0;
    document.addEventListener('wheel', function(e) {
        const now = Date.now();
        if (now - lastWheelTime < 100) return;
        lastWheelTime = now;

        if (!state.features.keybindsEnabled) return;

        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable || state.features.chatFocus)) {
            return;
        }

        if (!state.isInGame) return;

        const binds = state.keybinds;
        let currentZoomIdx = zoomSteps.findIndex(z => Math.abs(z - state.zoomFactor) < 1e-5);
        if (currentZoomIdx === -1) {
            currentZoomIdx = zoomSteps.reduce((bestIdx, currentStep, idx) =>
                Math.abs(currentStep - state.zoomFactor) < Math.abs(zoomSteps[bestIdx] - state.zoomFactor) ? idx : bestIdx, 0);
        }

        let actionTaken = false;
        if (e.deltaY < 0 && binds.zoomIn === "wheelup") {
            if (currentZoomIdx > 0) {
                state.zoomFactor = zoomSteps[--currentZoomIdx];
                actionTaken = true;
            }
        } else if (e.deltaY > 0 && binds.zoomOut === "wheeldown") {
            if (currentZoomIdx < zoomSteps.length - 1) {
                state.zoomFactor = zoomSteps[++currentZoomIdx];
                actionTaken = true;
            }
        }

        if (actionTaken) {
            if (typeof updateMenu === "function") updateMenu();
            e.preventDefault();
        }
    }, { passive: false });

    function displayKey(key) {
        if (!key) return 'N/A';
        if (key.toLowerCase() === " ") return "SPACE";
        if (key.toLowerCase() === "wheelup") return "Wheel Up";
        if (key.toLowerCase() === "wheeldown") return "Wheel Down";
        return key.toUpperCase();
    }

    // The IIFE for Keybind Modal Logic is already defined within the
    // `if (!document.getElementById('keybind-modal-overlay'))` block.
    // No need to repeat it here if you followed SECTION 4 instructions.
    // If you didn't, ensure the IIFE from SECTION 4 is correctly placed.


    function showKeybindsMenu() {
        const menuColor = state.menuColor;
        const menuContentArea = document.getElementById('mod-menu-content-area');
        if (!menuContentArea) return;

        // Update draggable header for keybinds menu
        const menuDraggableHeader = document.getElementById('mod-menu-draggable-header');
        if (menuDraggableHeader) {
             menuDraggableHeader.innerHTML = `
                <h2 style="margin:0; color:#fff; font-size:1.4em; font-weight:600; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                    Keybind Settings
                </h2>
                <button id="back-to-main-menu-btn" style="${buttonStyle(menuColor)}; padding: 6px 12px; font-size: 13px;"
                    onmouseover="${buttonHoverStyle(menuColor)}" onmouseout="${buttonLeaveStyle(menuColor)}">
                    Back
                </button>
            `;
            // Attach listener for the new back button
             setTimeout(() => {
                const backBtn = document.getElementById('back-to-main-menu-btn');
                if (backBtn) backBtn.onclick = updateMenu;
            },0);
        }


        menuContentArea.innerHTML = `
          <table style="width:100%; font-size:14px; margin-top:5px; border-collapse:collapse; background:rgba(0,0,0,0.1); border-radius:8px; overflow:hidden;">
            <thead>
                <tr>
                  <th style="text-align:left; color:${menuColor}; padding:10px 12px; border-bottom: 1px solid ${hexToRgba(menuColor, 0.4)}; font-weight:600;">Action</th>
                  <th style="text-align:left; color:${menuColor}; padding:10px 12px; border-bottom: 1px solid ${hexToRgba(menuColor, 0.4)}; font-weight:600;">Key</th>
                  <th style="text-align:right; padding:10px 12px; border-bottom: 1px solid ${hexToRgba(menuColor, 0.4)};"></th>
                </tr>
            </thead>
            <tbody>
            ${Object.entries(state.keybinds).map(([action, key], index, arr) => `
                <tr style="${index === arr.length - 1 ? '' : 'border-bottom: 1px solid rgba(255,255,255,0.08);'}">
                  <td style="color:#ccc; padding:9px 12px; text-transform: capitalize;">${action.replace(/([A-Z])/g, ' $1')}</td>
                  <td style="color:#FFD700; font-weight:bold; padding:9px 12px;">${displayKey(key)}</td>
                  <td style="text-align:right; padding:9px 12px;">
                    <button data-action="${action}" class="set-keybind-btn"
                            style="${buttonStyle(menuColor)};"
                            onmouseover="${buttonHoverStyle(menuColor)}"
                            onmouseout="${buttonLeaveStyle(menuColor)}">Set</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="font-size:12px; color:#999; margin-top:15px; text-align:center;">
            Click "Set" to rebind. Press <strong>${(state.keybinds.toggleKeybinds || '-').toUpperCase()}</strong> to toggle all mod keybinds.
          </div>
        `;

        setTimeout(() => {
            // Back button listener is set when header is created above
            document.querySelectorAll('.set-keybind-btn').forEach(btn => {
                btn.onclick = () => openKeybindModal(btn.dataset.action);
            });
        }, 0);
    }

    function applyBackground() {
        const defaultBgUrl = 'https://Wormax.io/s2/bg54.jpg';
        const blackBgDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

        window.__customBgUrlCurrent = state.features.blackBg ? blackBgDataUrl : defaultBgUrl;

        if (window.resize) {
             window.resize();
        }
    }


    // === GAME STATE DETECTION ===
    // === GAME STATE DETECTION ===
    function checkGameState() {
        const gameCanvas = document.querySelector('canvas');
        const loginForm = document.getElementById('login');
        state.isInGame = !!(gameCanvas && gameCanvas.style.display !== 'none' && (!loginForm || loginForm.style.display === 'none'));
        setTimeout(checkGameState, 1000);
    }


    // === CIRCLE RESTRICTION VISUAL ===
    // === CIRCLE RESTRICTION VISUAL ===
    function drawCircleRestriction() {
        if (state.features.circleRestriction && state.isInGame) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            // Ensure circleVisual is defined and accessible (it's created globally in your script)
            if (circleVisual) {
                circleVisual.style.left = `${centerX}px`;
                circleVisual.style.top = `${centerY}px`;
                circleVisual.style.width = `${state.circleRadius * 2}px`;
                circleVisual.style.height = `${state.circleRadius * 2}px`;
                circleVisual.style.display = 'block';
            }
        } else {
            if (circleVisual) {
                circleVisual.style.display = 'none';
            }
        }
        requestAnimationFrame(drawCircleRestriction);
    }
    // REMOVE the standalone drawCircleRestriction(); call from here if it exists. It will be called once at the end.

    document.addEventListener('keydown', function (e) {
        const activeEl = document.activeElement;

        // --- THIS IS THE FIX ---
        // Check if the user is currently focused on ANY input, textarea,
        // or if the keybind rebinding modal is active.
        if ( (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) || waitingForKeybind ) {
            // If they are typing, we do nothing and let the browser handle the key press.
            // We only make an exception for the 'Escape' key to allow blurring the input.
            if (e.key === 'Escape' && activeEl) {
                activeEl.blur();
            }
            return; // This is the most important part: it stops the function right here.
        }
        // --- END OF FIX ---

        // If we get past the check above, it means the user is NOT typing in an input box,
        // so we can now safely process our mod's keybinds.

        // Handle arrow keys first (for AFK mode)
        if (e.key === 'ArrowLeft') window.l = true;
        if (e.key === 'ArrowRight') window.r = true;

        const key = e.key.toLowerCase() === " " ? "space" : e.key.toLowerCase();
        const binds = state.keybinds;

        // Universal toggles (these should work even if other keybinds are off)
        if (key === binds.toggleMenu) {
            state.menuVisible = !state.menuVisible;
            menu.style.display = state.menuVisible ? 'block' : 'none';
            if (state.menuVisible && typeof updateMenu === "function") updateMenu();
            e.preventDefault();
            return;
        }
        if (key === binds.toggleKeybinds) {
            state.features.keybindsEnabled = !state.features.keybindsEnabled;
            if (typeof updateMenu === "function") updateMenu();
            e.preventDefault();
            return;
        }

        if (!state.features.keybindsEnabled) return;

        if (key === binds.chatEnabled && state.features.chatVisible) {
            const chatInput = document.getElementById('mod-menu-chat-input');
            if (chatInput) {
                chatInput.focus();
                e.preventDefault();
            }
            return;
        }

        let actionTaken = false;

        switch (key) {
            case '=':
                state.features.blackBg = !state.features.blackBg; // This toggles the switch ON/OFF
                applyBackground(); // This tells the game to update the background
                actionTaken = true;
                break;

            case binds.circleRestriction:
                state.features.circleRestriction = !state.features.circleRestriction;
                actionTaken = true;
                break;
            case binds.circleSmaller:
                state.circleRadius = Math.max(config.minCircleRadius, state.circleRadius - config.circleRadiusStep);
                actionTaken = true;
                break;
            case binds.circleLarger:
                state.circleRadius = Math.min(config.maxCircleRadius, state.circleRadius + config.circleRadiusStep);
                actionTaken = true;
                break;
            case binds.autoCircle:
                state.features.autoCircle = !state.features.autoCircle;
                if (state.features.autoCircle && !autoCircleRAF) {
                    autoCircleRAF = requestAnimationFrame(autoCircle);
                } else if (autoCircleRAF) {
                    cancelAnimationFrame(autoCircleRAF);
                    autoCircleRAF = null;
                }
                if (typeof updateMenu === "function") updateMenu();
                break;
            case binds.autoBoost:
                state.features.autoBoost = !state.features.autoBoost;
                if (typeof updateMenu === "function") updateMenu();
                break;
            case binds.fpsDisplay:
                state.features.fpsDisplay = !state.features.fpsDisplay;
                if (fpsDisplay) fpsDisplay.style.display = state.features.fpsDisplay ? 'block' : 'none';
                actionTaken = true;
                break;
            case binds.deathSound:
                state.features.deathSound = !state.features.deathSound;
                actionTaken = true;
                break;
            case binds.showServer:
                state.features.showServer = !state.features.showServer;
                actionTaken = true;
                break;
            case binds.neonLine:
                state.features.neonLine = !state.features.neonLine;
                if (state.features.neonLine) {
                    neonLineActive = true; createNeonLineCanvas(); window.addEventListener('mousemove', neonLineDraw);
                } else {
                    neonLineActive = false; if (neonCtx && neonCanvas) neonCtx.clearRect(0,0,neonCanvas.width, neonCanvas.height); window.removeEventListener('mousemove', neonLineDraw);
                }
                actionTaken = true;
                break;
            case binds.zoomIn:
            case binds.zoomOut:
                if (state.isInGame) {
                    let idx = zoomSteps.findIndex(z => Math.abs(z - state.zoomFactor) < 1e-5);
                    if (idx === -1) idx = zoomSteps.reduce((best, z_1, i) => Math.abs(z_1 - state.zoomFactor) < Math.abs(zoomSteps[best] - state.zoomFactor) ? i : best, 0);
                    if (key === binds.zoomIn && idx > 0) idx--;
                    else if (key === binds.zoomOut && idx < zoomSteps.length - 1) idx++;
                    state.zoomFactor = zoomSteps[idx];
                    actionTaken = true;
                }
                break;
            case binds.zoomReset:
                if (state.isInGame) {
                    state.zoomFactor = 1.0;
                    actionTaken = true;
                }
                break;
            case binds.autoRespawn:
                state.features.autoRespawn = !state.features.autoRespawn;
                if (state.features.autoRespawn) enableAutoRespawn(); else disableAutoRespawn();
                actionTaken = true;
                break;
            case binds.screenshot:
                if (state.isInGame) {
                    try {
                        const canvas = document.querySelector('canvas');
                        if (canvas) {
                            const dataURL = canvas.toDataURL();
                            const link = document.createElement('a');
                            link.href = dataURL;
                            link.download = `wormax_screenshot_${Date.now()}.png`;
                            document.body.appendChild(link); link.click(); document.body.removeChild(link);
                        }
                    } catch (err) { alert('Screenshot failed: ' + err); }
                }
                actionTaken = true;
                break;
            case binds.dreamwave:
                window.open("https://www.deathly.info", "_blank");
                actionTaken = true;
                break;


                state.features.performanceMode = parseInt(key);
                applyPerformanceMode();
                actionTaken = true;
                break;
        }

        if (actionTaken) {
            if (typeof updateMenu === "function") {
                updateMenu();
            }
            e.preventDefault();
        }
    });


    document.addEventListener('keyup', function(e) {
        if (e.key === 'ArrowLeft') window.l = false;
        if (e.key === 'ArrowRight') window.r = false;
    });


        // === FORCED SERVER LOGIC ===
    function applyForcedServer() {
        try {
            const savedForcedServer = localStorage.getItem('forcedServer');
            if (!savedForcedServer) return;
            const serverDetails = JSON.parse(savedForcedServer);
            if (!serverDetails.ip || !serverDetails.port) { localStorage.removeItem('forcedServer'); return; }
            window.forcing = true;
            if (!window.bso) window.bso = {};
            window.bso.ip = serverDetails.ip;
            window.bso.po = parseInt(serverDetails.port, 10);
        } catch (e) { console.error("Error applying forced server:", e); localStorage.removeItem('forcedServer'); }
    }

    function patchPlayButtons() {
        const mainPlayBtn = document.getElementById('playh') || document.querySelector('.btn-play-guest') || document.querySelector('form .btn.btn-primary');
        if (mainPlayBtn && !mainPlayBtn._patchedForceServer) { mainPlayBtn._patchedForceServer = true; mainPlayBtn.addEventListener('click', () => { setTimeout(applyForcedServer, 0); }, true); }
        document.querySelectorAll('.btn-play-again, #play-again, .play_btn').forEach(playAgainBtn => { if (playAgainBtn && !playAgainBtn._patchedForceServer) { playAgainBtn._patchedForceServer = true; playAgainBtn.addEventListener('click', () => { setTimeout(applyForcedServer, 0); }, true); } });
    }
    // These calls below this function are important for its operation:
    setInterval(patchPlayButtons, 1000);
    applyForcedServer(); // Apply on load


    // === AUTO CIRCLE (Bot Movement) ===
    // autoCircleRAF is already declared globally
        // autoCircleRAF is declared in the global-like scope of your IIFE
    // === AUTO CIRCLE ===
    function autoCircle() {
        if (!state.features.autoCircle || !state.isInGame) { // Check isInGame from your state
            if (autoCircleRAF) { // Ensure autoCircleRAF is declared in the script's scope
                cancelAnimationFrame(autoCircleRAF);
                autoCircleRAF = null;
            }
            // If the feature is ON in UI but conditions not met, update UI
            if (state.features.autoCircle) {
                state.features.autoCircle = false; // Correct the state
                if (typeof updateMenu === "function") updateMenu();
            }
            return;
        }

        try {
            state.autoCircleAngle += 0.025; // Your original speed
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const radius = Math.min(Math.max(state.circleRadius, 80), 180); // Your original radius logic

            const moveX = centerX + Math.cos(state.autoCircleAngle) * radius;
            const moveY = centerY + Math.sin(state.autoCircleAngle) * radius;

            const canvas = document.querySelector('canvas');
            if (canvas) {
                const event = new MouseEvent('mousemove', {
                    clientX: moveX,
                    clientY: moveY,
                    bubbles: true
                });
                canvas.dispatchEvent(event);
            }
        } catch (err) {
            console.error("Auto Circle error:", err); // Good to keep error logging
        }

        if (state.features.autoCircle) { // Keep requesting frame if feature is still on
            autoCircleRAF = requestAnimationFrame(autoCircle);
        } else { // Explicitly clear if toggled off elsewhere
            if (autoCircleRAF) {
                cancelAnimationFrame(autoCircleRAF);
                autoCircleRAF = null;
            }
        }
    }

    // === SNAKE TRAIL DRAWING ===
    function drawSnakeTrail() {
        if (!state.features.snakeTrail || !state.snakeTrailPoints || !state.snakeTrailPoints.length) { // Removed isInGame check here, trail can be drawn if points exist
             if (typeof clearTrailOverlay === "function") clearTrailOverlay(); // Call your clear function
             return;
        }
        const overlay = createTrailOverlayCanvas(); // Use your (now updated) createTrailOverlayCanvas
        if (!overlay) return;
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        const TRAIL_MAX_AGE = 1500;
        const now = Date.now();

        const viewX = window.snake ? window.snake.xx || 0 : 0;
        const viewY = window.snake ? window.snake.yy || 0 : 0;
        const viewZoom = window.gsc || 1;
        // Use overlay center if trail is aligned to game canvas, else window center
        const screenCenterX = overlay.width / 2;
        const screenCenterY = overlay.height / 2;

        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 8; // Your original lineWidth
        ctx.shadowBlur = 12; // Your original shadowBlur
        ctx.shadowColor = state.features.snakeTrailColor;

        for (let i = 1; i < state.snakeTrailPoints.length; i++) {
            const p1 = state.snakeTrailPoints[i-1];
            const p2 = state.snakeTrailPoints[i];
            const age = now - ((p1.time + p2.time) / 2);
            const alpha = Math.max(0, 1 - age / TRAIL_MAX_AGE);

            if (alpha <= 0) continue;

            const deltaX1 = p1.x - viewX;
            const deltaY1 = p1.y - viewY;
            const screenX1 = screenCenterX + deltaX1 * viewZoom;
            const screenY1 = screenCenterY + deltaY1 * viewZoom;

            const deltaX2 = p2.x - viewX;
            const deltaY2 = p2.y - viewY;
            const screenX2 = screenCenterX + deltaX2 * viewZoom;
            const screenY2 = screenCenterY + deltaY2 * viewZoom;

            ctx.strokeStyle = hexToRgba(state.features.snakeTrailColor, alpha * 0.7);
            ctx.beginPath();
            ctx.moveTo(screenX1, screenY1);
            ctx.lineTo(screenX2, screenY2);
            ctx.stroke();
        }
        ctx.restore();
    }

        // === AUTO BOOST ===
        function autoBoost() {
            if (!state.features.autoBoost || !state.isInGame) {
                if (state.boosting) {
                    state.boosting = false;
                    if (typeof window.setAcceleration === 'function') window.setAcceleration(0);
                    document.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
                }
                return;
            }
            if (!state.boosting) {
                state.boosting = true;
                if (typeof window.setAcceleration === 'function') window.setAcceleration(1);
                document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
            }
        }
        function autoBoostLoop() {
            autoBoost();
            setTimeout(autoBoostLoop, 100);
        }
        autoBoostLoop();

    function fpsCounter() {
        state.fpsFrames++;
        const now = Date.now();
        if (now - state.fpsLastCheck >= 1000) {
            state.fps = state.fpsFrames;
            state.fpsFrames = 0;
            state.fpsLastCheck = now;
            if (state.features.fpsDisplay && fpsDisplay) { // Check if fpsDisplay exists
                fpsDisplay.textContent = `FPS: ${state.fps}`;
            }
            // Update ping in simplified menu status if visible
            if (state.simplified && state.menuVisible) {
                const pingValueDisplay = document.getElementById("ping-value-simplified");
                if (pingValueDisplay) pingValueDisplay.textContent = `${state.ping} ms`;
            }

        }
        requestAnimationFrame(fpsCounter);
    }
    fpsCounter();

    function deathSoundObserver() { /* ... unchanged ... */ }
    state.deathSound.preload = 'auto';
    state.deathSound.load();
    state.deathSound.addEventListener('ended', () => { state.deathSound.currentTime = 0; });
    deathSoundObserver();

    function applyPerformanceMode() {
        if (typeof window !== "undefined") {
            switch (state.features.performanceMode) {
                case 1: window.want_quality = 0; window.high_quality = false; window.render_mode = 1; break;
                case 2: window.want_quality = 1; window.high_quality = false; window.render_mode = 2; break;
                case 3: window.want_quality = 2; window.high_quality = true; window.render_mode = 2; break;
            }
        }
        updateMenu(); // Update menu to reflect change
    }
    applyPerformanceMode(); // Initial call

    // === ZOOM LOCK ===
    // === ZOOM LOCK ===
    function zoomLockLoop() {
        if (typeof window.gsc !== 'undefined' && state.isInGame) { // Check isInGame
            if (Math.abs(window.gsc - state.zoomFactor) > 0.001) { // Avoid tiny floating point updates
                window.gsc = state.zoomFactor;
            }
        }
        requestAnimationFrame(zoomLockLoop);
    }
    // REMOVE the standalone zoomLockLoop(); call from here. It will be called once at the end.

    function pingLoop() { // Simplified ping display, mainly for simplified menu status
        let currentPing = 0;
        if (window.lagging && typeof window.lagging === "number") currentPing = Math.round(window.lagging);
        else if (window.lag && typeof window.lag === "number") currentPing = Math.round(window.lag);
        state.ping = currentPing;

        // Ping display element outside menu is removed, rely on status in menu
        // If you want it back, recreate it and update here:
        // const pingDisplayEl = document.getElementById('ping-display');
        // if (pingDisplayEl) pingDisplayEl.textContent = `Ping: ${currentPing} ms`;

        // This is now handled in fpsCounter to reduce DOM updates
        // if (state.simplified && state.menuVisible) {
        //    const pingValueDisplay = document.getElementById("ping-value-simplified");
        //    if (pingValueDisplay) pingValueDisplay.textContent = `${currentPing} ms`;
        // }
        setTimeout(pingLoop, 500);
    }
    pingLoop();

    function clearTrailOverlay() {
        const overlay = document.getElementById('snake-trail-overlay');
        if (overlay) {
            const ctx = overlay.getContext('2d');
            ctx.clearRect(0, 0, overlay.width, overlay.height);
            overlay.style.display = 'none'; // <--- Hide the overlay when trail is off
        }
    }

    menu.style.display = state.menuVisible ? 'block' : 'none';
    if (fpsDisplay) fpsDisplay.style.display = state.features.fpsDisplay ? 'block' : 'none'; // Check fpsDisplay existence
    if (circleVisual) circleVisual.style.border = `2px dashed ${hexToRgba(state.menuColor, 0.7)}`; // Check existence

    function snakeTrailAnimationLoop() {
        requestAnimationFrame(snakeTrailAnimationLoop);
        drawSnakeTrail();
    }
    setInterval(() => {
        if (!state.features.snakeTrail) {
            state.snakeTrailPoints = [];
            return;
        }

       // Get mouse screen position
       const mouseX = realMouseX;
       const mouseY = realMouseY;


        // Convert screen position to world (game) coordinates
        const viewX = window.snake ? window.snake.xx || 0 : 0;
        const viewY = window.snake ? window.snake.yy || 0 : 0;
        const viewZoom = window.gsc || 1;
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;

        // This formula converts screen (mouse) to world coordinates
        const worldX = viewX + (mouseX - screenCenterX) / viewZoom;
        const worldY = viewY + (mouseY - screenCenterY) / viewZoom;

        if (
            state.snakeTrailPoints.length === 0 ||
            Math.abs(state.snakeTrailPoints[state.snakeTrailPoints.length-1].x - worldX) > 1 ||
            Math.abs(state.snakeTrailPoints[state.snakeTrailPoints.length-1].y - worldY) > 1
        ) {
            state.snakeTrailPoints.push({
                x: worldX,
                y: worldY,
                time: Date.now()
            });

            // Limit trail length
            if (state.snakeTrailPoints.length > 100) state.snakeTrailPoints.shift();
        }

    }, 30);



// ===================================================================
// === START: FINAL ADMIN PROFILE/MODERATION CLICK HANDLING SYSTEM ===
// ===================================================================

// This function handles opening the "Edit Profile" modal FOR YOURSELF
function openEditProfileModal() {
    document.getElementById('profile-avatar-input').value = localStorage.getItem("profileAvatar") || '';
    document.getElementById('profile-motto-input').value = localStorage.getItem("profileMotto") || '';
    const editModal = document.getElementById('edit-profile-modal-overlay');
    if (editModal) { editModal.style.display = 'flex'; }
    const statusEl = document.getElementById('profile-modal-status');
    if (statusEl) { statusEl.textContent = ''; }
}
// ===================================================================
// === START: COMBINED PROFILE & MODERATION SYSTEM (FINAL FIX) =====
// ===================================================================

// This function handles opening the "Edit Profile" modal FOR YOURSELF.
function openEditProfileModal() {
    const editModal = document.getElementById('edit-profile-modal-overlay');
    document.getElementById('profile-avatar-input').value = localStorage.getItem("profileAvatar") || '';
    document.getElementById('profile-motto-input').value = localStorage.getItem("profileMotto") || '';
    // IMPORTANT: Clear any leftover target UID from a previous admin edit
    delete editModal.dataset.targetUid;
    if (editModal) { editModal.style.display = 'flex'; }
    const statusEl = document.getElementById('profile-modal-status');
    if (statusEl) { statusEl.textContent = ''; }
}

// This function handles saving profile data for YOURSELF or for OTHERS (if you're an admin).
// This is the SECURED version of the function
async function saveProfile() {
    const statusEl = document.getElementById('profile-modal-status');
    const saveButton = document.getElementById('profile-modal-save');
    const editModal = document.getElementById('edit-profile-modal-overlay');

    const targetUid = editModal.dataset.targetUid;
    const currentUser = firebase.auth().currentUser;
    const uidToSave = targetUid || currentUser?.uid;

    if (!uidToSave) {
        if (statusEl) statusEl.textContent = 'Error: No user to save for!';
        return;
    }

    if (saveButton) saveButton.disabled = true;
    if (statusEl) statusEl.textContent = 'Saving...';

    // --- FIX IS HERE: We now use sanitizeInput() on both fields ---
    const newAvatarUrl = sanitizeInput(document.getElementById('profile-avatar-input').value.trim());
    const newMotto = sanitizeInput(document.getElementById('profile-motto-input').value.trim());
    // --- END OF FIX ---

    try {
        const userRef = firebase.database().ref(`onlineUsers/${uidToSave}`);
        await userRef.update({ profileAvatar: newAvatarUrl, profileMotto: newMotto });

        // Update localStorage only if it's your own profile
        if (uidToSave === currentUser?.uid) {
            localStorage.setItem("profileAvatar", newAvatarUrl);
            localStorage.setItem("profileMotto", newMotto);
        }

        if (statusEl) statusEl.textContent = 'Saved Successfully!';
        setTimeout(() => {
            editModal.style.display = 'none';
            delete editModal.dataset.targetUid;
            document.getElementById('profile-popup')?.remove();
        }, 1200);

    } catch (error) {
        console.error("Error saving profile:", error);
        if (statusEl) statusEl.textContent = 'Error: Could not save to cloud.';
    } finally {
        if (saveButton) saveButton.disabled = false;
    }
}

// ===================================================================
// === START: COMBINED PROFILE & MODERATION SYSTEM (FINAL FIX) =====
// ===================================================================

// This function handles opening the "Edit Profile" modal FOR YOURSELF.
function openEditProfileModal() {
    const editModal = document.getElementById('edit-profile-modal-overlay');
    document.getElementById('profile-avatar-input').value = localStorage.getItem("profileAvatar") || '';
    document.getElementById('profile-motto-input').value = localStorage.getItem("profileMotto") || '';
    // IMPORTANT: Clear any leftover target UID from a previous admin edit
    delete editModal.dataset.targetUid;
    if (editModal) { editModal.style.display = 'flex'; }
    const statusEl = document.getElementById('profile-modal-status');
    if (statusEl) { statusEl.textContent = ''; }
}

// This function handles saving profile data for YOURSELF or for OTHERS (if you're an admin).
async function saveProfile() {
    const statusEl = document.getElementById('profile-modal-status');
    const saveButton = document.getElementById('profile-modal-save');
    const editModal = document.getElementById('edit-profile-modal-overlay');

    const targetUid = editModal.dataset.targetUid;
    const currentUser = firebase.auth().currentUser;
    const uidToSave = targetUid || currentUser?.uid;

    if (!uidToSave) {
        if (statusEl) statusEl.textContent = 'Error: No user to save for!';
        return;
    }

    if (saveButton) saveButton.disabled = true;
    if (statusEl) statusEl.textContent = 'Saving...';

    const newAvatarUrl = document.getElementById('profile-avatar-input').value.trim();
    const newMotto = document.getElementById('profile-motto-input').value.trim();

    try {
        const userRef = firebase.database().ref(`onlineUsers/${uidToSave}`);
        await userRef.update({ profileAvatar: newAvatarUrl, profileMotto: newMotto });

        // Update localStorage only if it's your own profile
        if (uidToSave === currentUser?.uid) {
            localStorage.setItem("profileAvatar", newAvatarUrl);
            localStorage.setItem("profileMotto", newMotto);
        }

        if (statusEl) statusEl.textContent = 'Saved Successfully!';
        setTimeout(() => {
            editModal.style.display = 'none';
            delete editModal.dataset.targetUid;
            document.getElementById('profile-popup')?.remove();
        }, 1200);

    } catch (error) {
        console.error("Error saving profile:", error);
        if (statusEl) statusEl.textContent = 'Error: Could not save to cloud.';
    } finally {
        if (saveButton) saveButton.disabled = false;
    }
}

// --- NEW, DEDICATED FUNCTION TO SHOW ANY USER'S PROFILE ---
async function showUserProfile(uid) {
    if (!uid) return;

    // Close any existing popups first
    document.getElementById('profile-popup')?.remove();

    let avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(uid)}`,
        motto = '<i>No motto set.</i>', isOnline = false, userChatColor = '#FFD700',
        username = 'Anon', playerRep = 0, unlockedBadges = {};

    try {
        const userSnap = await firebase.database().ref("onlineUsers/" + uid).once('value');
        // SECURED CODE (Replace with this)
        // ...
        if (userSnap.exists()) {
            const userData = userSnap.val();
            // THE FIX: Use escapeHTML on all user-provided text from the database.
            username = escapeHTML(filterProfanity(userData.name || 'Anon'));
            if (userData.profileAvatar) avatarUrl = userData.profileAvatar;
            if (userData.profileMotto) motto = escapeHTML(filterProfanity(userData.profileMotto));
            // END OF FIX
            if (!motto.trim() || motto === '<i></i>') motto = '<i>No motto set.</i>';
            // ...
            isOnline = (Date.now() - (userData.lastActive || 0) < 300000);
            userChatColor = userData.chatNameColor || '#FFD700';
        }
        const playerDataSnap = await firebase.database().ref("playerData/" + uid).once('value');
        if (playerDataSnap.exists()) {
            const pData = playerDataSnap.val();
            playerRep = pData.rep || 0;
            unlockedBadges = pData.badges || {};
        }
    } catch (err) { console.error(`Failed to fetch profile for UID ${uid}:`, err); }

    const popup = document.createElement('div');
    popup.className = 'profile-popup';
    popup.id = 'profile-popup';
    popup.dataset.targetUid = uid;
    popup.dataset.targetName = username;
    popup.style.setProperty('--menu-color', state.menuColor);

    let highestRank = { name: 'Unranked', icon: '🌱', level: 0 };
    if (config.repMilestones) {
        for (const level in config.repMilestones) {
            const repNeeded = parseInt(level);
            if (playerRep >= repNeeded && repNeeded >= highestRank.level) {
                highestRank = { ...config.repMilestones[level], level: repNeeded };
            }
        }
    }

    const sortedBadgeKeys = Object.keys(unlockedBadges).sort((a, b) => parseInt(a) - parseInt(b));
    const badgesHTML = `<div style="margin-top: 5px; margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 220px;">
        ${sortedBadgeKeys.map(level => {
            const badge = unlockedBadges[level];
            return `<span title="${badge.name} (Unlocked at ${level} REP)" style="font-size: 1.5em; cursor: help;">${badge.icon}</span>`;
        }).join('')}
    </div>`;

    let nameDisplay, devTagHTML = '', selfEditButtonHTML = '', adminButtonsHTML = '', giveRepButtonHTML = '';
    const isDeveloper = isDev(uid);
    const currentUser = firebase.auth()?.currentUser;

    if (isDeveloper) { nameDisplay = rainbowTextStyle(username); devTagHTML = `<span style="background: #e91e63; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; margin-left: 8px; font-weight: 700; vertical-align:middle;">DEV</span>`; }
    else if (isVip(uid, username)) { nameDisplay = vipGlowStyle(username, userChatColor); }
    else { nameDisplay = username; }

    if (currentUser && uid === currentUser.uid) { selfEditButtonHTML = `<button id="profile-edit-btn" title="Edit Your Profile" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.3); border: 1px solid #888; color: #fff; width: 30px; height: 30px; border-radius: 50%; font-size: 16px; cursor: pointer; line-height: 1; display: flex; align-items: center; justify-content: center;">✎</button>`; }
    if (currentUser && isDev(currentUser.uid) && uid !== currentUser.uid) { adminButtonsHTML = `<div style="margin-top:10px; display:flex; gap: 8px;"><button id="admin-edit-profile-btn" class="profile-popup_action_button" style="background-color:${state.menuColor};">🛠️ Edit Profile</button><button id="timeout-chat-btn" class="profile-popup_action_button" style="background-color:#c9302c;">⏰ Timeout</button></div>`; }
    if (currentUser && uid !== currentUser.uid) { giveRepButtonHTML = `<div style="display: flex; gap: 10px; align-items: center; margin: 15px 0 0 0; width: 90%;"><input id="rep-amount-input" type="number" min="1" placeholder="Amt" style="width: 70px; padding: 8px; border-radius: 5px; border: 1px solid #555; background: #222; color: #eee; text-align: center; font-size: 1em;"><button id="give-rep-btn" data-target-uid="${uid}" style="padding:8px 15px; border-radius:6px; border:none; color:#fff; font-size:14px; font-weight:500; cursor:pointer; background-color:#3F51B5; flex-grow: 1;">👍 Give REP</button></div>`; }

    const defaultAvatar = `https://i.imgur.com/M6NYjjO.jpeg`;

    // --- THIS IS THE PART WITH THE CORRECTED LAYOUT ---
    popup.innerHTML = `
        ${selfEditButtonHTML}
        <button class="close-btn" title="Close" onclick="this.parentElement.remove();">×</button>
        <img class="avatar" src="${avatarUrl}" alt="Avatar" style="border-color:${userChatColor};" onerror="this.src='${defaultAvatar}';">
        <div style="font-size:1.23em;font-weight:bold;margin-bottom:2px;">${nameDisplay} ${devTagHTML}</div>
        <div title="${highestRank.name} - Unlocked at ${highestRank.level} REP" style="color: #ccc; cursor: help; margin-bottom: 8px;">
            <span style="font-size: 1.2em; vertical-align: middle;">${highestRank.icon}</span> ${highestRank.name}
        </div>
        <div style="margin-bottom:10px;"><span class="status-dot" style="background:${isOnline ? '#0f0':'#888'}"></span><span style="font-size:1.04em;">${isOnline ? 'Online':'Offline'}</span></div>
        ${badgesHTML}
        <div style="width: 90%; text-align: left; margin-bottom: 15px;">
            <div style="font-size: 0.9em; color: #ccc; margin-bottom: 4px; display: flex; justify-content: space-between;">
                <span>REP Level: ${Math.floor(playerRep/100)}</span><span style="font-weight: bold;">${playerRep.toLocaleString()}</span>
            </div>
            <div style="background: #222; border-radius: 5px; height: 12px; border: 1px solid #444; padding: 1px;">
                <div style="width: ${playerRep%100}%; height: 100%; background: linear-gradient(to right, #4CAF50, #8BC34A); border-radius: 3px;"></div>
            </div>
        </div>

        <div style="margin:8px 0 0 0; color:#ccc; font-style: italic; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px; text-align: center; word-break: break-word;">
            ${motto}
        </div>

        ${giveRepButtonHTML}

        ${adminButtonsHTML}

        <div style="margin-top: 15px; font-size: 0.8em; color: #aaa; font-family: 'Courier New', monospace; word-break: break-all;">
            UID: <span style="color: #fff; user-select: text; cursor: text;">${uid}</span>
        </div>
    `;

    document.body.appendChild(popup);
}

document.addEventListener('click', async function(e) {
    // --- Button Handlers (Order is important!) ---
    if (e.target.id === 'profile-modal-save') { saveProfile(); return; }
    if (e.target.id === 'admin-edit-profile-btn') {
        const profilePopup = e.target.closest('.profile-popup');
        const editModal = document.getElementById('edit-profile-modal-overlay');
        const currentUser = firebase.auth()?.currentUser;
        if (!profilePopup || !editModal || !currentUser || !isDev(currentUser.uid)) return;
        const targetUid = profilePopup.dataset.targetUid;
        const userSnap = await firebase.database().ref("onlineUsers/" + targetUid).once('value');
        const userData = userSnap.val() || {};
        document.getElementById('profile-avatar-input').value = userData.profileAvatar || '';
        document.getElementById('profile-motto-input').value = userData.profileMotto || '';
        editModal.dataset.targetUid = targetUid;
        editModal.style.display = 'flex';
        return;
    }
    if (e.target.id === 'timeout-chat-btn') {
        const profilePopup = e.target.closest('.profile-popup');
        const timeoutModal = document.getElementById('timeout-modal-overlay');
        const currentUser = firebase.auth()?.currentUser;
        if (!profilePopup || !timeoutModal || !currentUser || !isDev(currentUser.uid)) return;
        timeoutModal.dataset.targetUid = profilePopup.dataset.targetUid;
        timeoutModal.dataset.targetName = profilePopup.dataset.targetName;
        timeoutModal.style.display = 'flex';
        return;
    }
    if (e.target.id === 'profile-edit-btn') { openEditProfileModal(); return; }
    if (e.target.id === 'give-rep-btn') {
        const giverUid = firebase.auth().currentUser?.uid;
        const receiverUid = e.target.dataset.targetUid;
        const amountInput = document.getElementById('rep-amount-input');
        const amount = parseInt(amountInput.value, 10);
        if (!amount || amount < 1) { alert("Please enter a valid, positive amount of REP to give."); return; }
        if (!giverUid || !receiverUid || giverUid === receiverUid) return;
        firebase.database().ref(`repTransfers`).push().set({ from: giverUid, to: receiverUid, amount: amount, timestamp: firebase.database.ServerValue.TIMESTAMP });
        alert(`You sent ${amount} REP!`);
        e.target.disabled = true;
        amountInput.disabled = true;
        e.target.textContent = "REP Sent!";
        return;
    }

    // --- Clicks that OPEN a profile ---
    const userSpan = e.target.closest('.chat-username, .online-username');
    if (userSpan) {
        showUserProfile(userSpan.dataset.uid);
        return;
    }

    const leaderboardRow = e.target.closest('.leaderboard-clickable-row');
    if (leaderboardRow) {
        document.getElementById('rep-leaderboard-modal').style.display = 'none';
        showUserProfile(leaderboardRow.dataset.uid);
        return;
    }

    // --- Handle clicks outside of popups to close them ---
    const profilePopup = document.getElementById('profile-popup');
    if (profilePopup && !profilePopup.contains(e.target) && !e.target.closest('.leaderboard-clickable-row, .online-username, .chat-username')) {
        profilePopup.remove();
    }
});

// ===================================================================
// === END: COMBINED PROFILE & MODERATION SYSTEM (FINAL FIX) =====
// ===================================================================


    let neonCanvas = null; /* ... (neon line logic largely unchanged, ensure colors update) ... */
    let neonCtx = null;
    let neonLineActive = false;
    let neonLineColor = state.features.neonLineColor || '#00ffff'; // Initialized from state

    function createNeonLineCanvas() {
        if (neonCanvas) { // If canvas exists, just update size and clear if needed
            neonCanvas.width = window.innerWidth;
            neonCanvas.height = window.innerHeight;
            if (neonCtx) neonCtx.clearRect(0,0,neonCanvas.width, neonCanvas.height); // Clear on resize/re-enable
            return;
        }
        neonCanvas = document.createElement('canvas');
        neonCanvas.width = window.innerWidth;
        neonCanvas.height = window.innerHeight;
        neonCanvas.style.cssText = `
            position: fixed; top: 0; left: 0; z-index: 9990; /* Below menu but above game */
            pointer-events: none; background: transparent;
        `;
        neonCanvas.id = 'neon-line-canvas';
        document.body.appendChild(neonCanvas);
        neonCtx = neonCanvas.getContext('2d');

        window.addEventListener('resize', () => {
            if (neonCanvas) {
                neonCanvas.width = window.innerWidth;
                neonCanvas.height = window.innerHeight;
                // No need to re-set context properties if they don't change on resize
            }
        });
    }

    function removeNeonLineCanvas() { // Optional: if you want to fully remove it
        if (neonCanvas) {
            neonCanvas.remove();
            neonCanvas = null;
            neonCtx = null;
        }
    }

    function neonLineDraw(event) {
        if (!neonCanvas || !neonCtx || !neonLineActive) return;

        // Update context properties based on current state (e.g., color)
        neonCtx.lineWidth = 2.5; // Slightly thicker
        neonCtx.lineCap = 'round';
        neonCtx.shadowBlur = 12; // Main line glow
        neonCtx.shadowColor = state.features.neonLineColor; // Use current color from state
        neonCtx.strokeStyle = state.features.neonLineColor;

        neonCtx.clearRect(0, 0, neonCanvas.width, neonCanvas.height);
        const centerX = neonCanvas.width / 2;
        const centerY = neonCanvas.height / 2;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Draw line
        neonCtx.beginPath();
        neonCtx.moveTo(centerX, centerY);
        neonCtx.lineTo(mouseX, mouseY);
        neonCtx.stroke();

        // Draw glowing dot at mouse cursor
        neonCtx.beginPath();
        neonCtx.arc(mouseX, mouseY, 6, 0, 2 * Math.PI);
        neonCtx.fillStyle = state.features.neonLineColor;
        neonCtx.shadowBlur = 20; // Larger glow for the dot
        neonCtx.shadowColor = hexToRgba(state.features.neonLineColor, 0.7); // slightly transparent shadow for dot for better effect
        neonCtx.fill();
    }




function setAfk(on) {
    afkOn = on;
    const afkStatus = document.getElementById('afk-status');
    if (afkStatus) {
        afkStatus.textContent = afkOn ? 'ON' : 'OFF';
        afkStatus.style.color = afkOn ? 'lime' : 'red';
    }
    if (typeof updateMenu === "function") updateMenu();

    if (afkOn) {
        if (afkInterval) return;
        afkInterval = setInterval(() => {
            if (!state.isInGame) return;
            const keys = ['ArrowLeft', 'ArrowRight'];
            const key = keys[Math.floor(Math.random() * 2)];
            const type = Math.random() > 0.5 ? 'keydown' : 'keyup';
            const evt = new KeyboardEvent(type, {
                key: key,
                code: key,
                keyCode: key === 'ArrowLeft' ? 37 : 39,
                which: key === 'ArrowLeft' ? 37 : 39,
                bubbles: true
            });
            document.dispatchEvent(evt);
        }, Math.random() * 400 + 200);
    } else {
        if (afkInterval) clearInterval(afkInterval);
        afkInterval = null;
        ['ArrowLeft', 'ArrowRight'].forEach(key => {
            const evt = new KeyboardEvent('keyup', {
                key: key,
                code: key,
                keyCode: key === 'ArrowLeft' ? 37 : 39,
                which: key === 'ArrowLeft' ? 37 : 39,
                bubbles: true
            });
            document.dispatchEvent(evt);
        });
    }
}





    // Initial actions
    updateMenu(); // Call to build the menu structure and apply styles
    syncServerBoxWithMenu(); // Sync server box styles
    updateCSSVariables(); // Set CSS variables based on initial state.menuColor

        // --- INITIALIZATION ---
        updateServerIpLoop();
        if (state.features.autoRespawn) enableAutoRespawn();

        document.addEventListener('click', primeAudio);
        document.addEventListener('keydown', primeAudio);

        addServerBox();
        patchPlayButtons();
        // applyForcedServer(); // Called by patchPlayButtons setup

        // Start continuous loops
        zoomLockLoop();
        autoBoostLoop();
        checkGameState();
        drawCircleRestriction();
        fpsCounter();
        deathSoundObserver();
        snakeTrailAnimationLoop();
        // The setInterval for snakeTrailPoints is already defined globally where its logic is.

        // Initial UI setup calls
        applyPerformanceMode();
        pingLoop();

        updateMenu();
        syncServerBoxWithMenu();
        syncChatBoxWithMenu();
        updateCSSVariables();
        applyUIScale();
        applyBackground();

        menu.style.display = state.menuVisible ? 'block' : 'none';
        if (fpsDisplay) fpsDisplay.style.display = state.features.fpsDisplay ? 'block' : 'none';
        setInterval(awardTimeBasedRep, 5 * 60 * 1000); // Check for time-based REP every 5 minutes


        // --- NEW: One-Time Informational Popup ---
(function showOneTimePopup() {
    const popupVersion = 'betaPopup_v1'; // Change this to 'v2', 'v3' etc. to re-show the popup after an update
    const hasSeenPopup = localStorage.getItem(popupVersion);

    if (!hasSeenPopup) {
        // Create the popup elements
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'info-popup-overlay';

        const popupContent = document.createElement('div');
        popupContent.className = 'info-popup-content';

        popupContent.innerHTML = `
            <h2>Get the Latest Updates!</h2>
            <p>
                If you would like the newest, most updated BETA extension before it eventually releases, please join our Discord!
            </p>
            <p>
                <a href="https://Mod Panel Wormax.io" target="_blank">Mod Panel Wormax.io</a>
            </p>
            <button id="info-popup-ok-btn" class="info-popup-button">OK</button>
        `;

        popupOverlay.appendChild(popupContent);
        document.body.appendChild(popupOverlay);

        // Make it visible
        popupOverlay.style.display = 'flex';

        // Add the event listener for the OK button
        document.getElementById('info-popup-ok-btn').addEventListener('click', () => {
            popupOverlay.style.display = 'none';
            localStorage.setItem(popupVersion, 'true'); // Mark as seen
            popupOverlay.remove(); // Clean up the element from the page
        });
    }
})();
// --- END: One-Time Informational Popup ---
    })(); // End of the main IIFE
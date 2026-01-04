// ==UserScript==
// @name             AimbaeShiro – Krunker.IO Cheat
// @name:tr          AimbaeShiro – Krunker.IO Hilesi
// @name:ja          AimbaeShiro – Krunker.IO チート
// @name:az          AimbaeShiro – Krunker.IO Hilesi
// @namespace        https://github.com/GameSketchers/AimbaeShiro
// @version          1.5.7
// @description      Krunker.io Cheat 2025: Anime Aimbot, ESP/Wallhack, Free Skins, Bhop Script. Working & updated mod menu.
// @description:tr   Krunker.io Hile 2025: Anime Aimbot, ESP/Wallhack, Bedava Skinler, Bhop Script. Çalışan güncel mod menü.
// @description:ja   Krunker.io チート 2025: アニメエイムボット、ESP/ウォールハック、無料スキン、Bhopスクリプト。動作中の最新MODメニュー。
// @description:az   Krunker.io Hilesi 2025: Anime Aimbot, ESP/Wallhack, Pulsuz Skinlər, Bhop Skript. İşlək və güncəl mod menyu.
// @author           anonimbiri
// @match            *://krunker.io/*
// @match            *://*.browserfps.com/*
// @exclude          *://krunker.io/social*
// @exclude          *://krunker.io/editor*
// @exclude          *://krunker.io/viewer*
// @icon             https://cdn.jsdelivr.net/gh/GameSketchers/AimbaeShiro@main/Assets/logo.png
// @grant            none
// @supportURL       https://github.com/GameSketchers/AimbaeShiro/issues/new?labels=bug&type=bug&template=bug_report.md&title=Bug+Report
// @homepage         https://github.com/GameSketchers/AimbaeShiro
// @run-at           document-start
// @tag              games
// @license          MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/538607/AimbaeShiro%20%E2%80%93%20KrunkerIO%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/538607/AimbaeShiro%20%E2%80%93%20KrunkerIO%20Cheat.meta.js
// ==/UserScript==

(function(uniqueId, CRC2d) {

    class AimbaeShiro {
        constructor() {
            console.log("🌸 AimbaeShiro: Initializing...");

            this.GUI = {};
            this.game = null;
            this.me = null;
            this.renderer = null;
            this.controls = null;
            this.overlay = null;
            this.ctx = null;
            this.socket = null;
            this.skinCache = {};
            this.playerMaps = [];
            this.scale = 1;
            this.three = null;
            this.vars = {};
            this.exports = null;
            this.gameJS = '';
            this.weaponIconCache = {};
            this.notifyContainer = null;
            this.legitTarget = null;
            this.lastTargetChangeTime = 0;
            this.aimOffset = { x: 0, y: 0 };

            this.PLAYER_HEIGHT = 11;
            this.PLAYER_WIDTH = 4;
            this.CROUCH_FACTOR = 3;
            this.BOT_CROUCH_FACTOR = 2;
            this.CAMERA_HEIGHT = 1.5;

            this.tempVector = null;
            this.cameraPos = null;

            this.isProxy = Symbol('isProxy');
            this.rightMouseDown = false;
            this.isBindingHotkey = false;
            this.currentBindingSetting = null;
            this.pressedKeys = new Set();

            this.defaultSettings = {
                aimbotEnabled: true,
                aimbotOnRightMouse: false,
                aimbotWallCheck: true,
                aimbotWallBangs: false,
                aimbotTeamCheck: true,
                aimbotBotCheck: true,
                superSilentEnabled: false,
                autoFireEnabled: false,
                fovSize: 90,
                aimOffset: 0,
                drawFovCircle: true,
                espLines: true,
                espSquare: true,
                espNameTags: true,
                espWeaponIcons: true,
                espInfoBackground: true,
                espTeamCheck: true,
                espBotCheck: true,
                wireframeEnabled: false,
                unlockSkins: true,
                bhopEnabled: false,
                antiAimEnabled: false,
                espColor: "#ff0080",
                boxColor: "#ff0080",
                botColor: "#00ff80",
                autoNuke: false,
                antikick: true,
                autoReload: true,
                legitAimbot: true,
                flickSpeed: 25,
                adsTremorReduction: 50,
                aimRandomness: 1.5,
                aimTremor: 0.2,
            };
            this.defaultHotkeys = {
                toggleMenu: 'F1',
                aimbotEnabled: 'F2',
                espSquare: 'F3',
                bhopEnabled: 'F4',
                autoFireEnabled: 'F5',
                superSilentEnabled: 'F6',
                antiAimEnabled: 'F7',
                wireframeEnabled: 'F8',
                unlockSkins: 'F9',
                aimbotTeamCheck: 'Numpad1',
                espTeamCheck: 'Numpad2',
                aimbotBotCheck: 'Numpad3',
                espBotCheck: 'Numpad4',
                aimbotWallCheck: 'Numpad5',
                aimbotWallBangs: 'Numpad6',
                espLines: 'Numpad7',
                espNameTags: 'Numpad8',
                espWeaponIcons: 'Numpad9',
            };
            this.settings = {};
            this.hotkeys = {};

            try {
                this.loadSettings();
                this.initializeNotifierContainer();
                this.checkForUpdates();
                this.initializeLoader();
                this.initializeGameHooks();
                this.waitFor(() => window.windows).then(() => {
                    this.initGameGUI();
                });
                this.addEventListeners();
                console.log("🌸 AimbaeShiro: Successfully Initialized!");
            } catch (error)
            {
                console.error('🌸 AimbaeShiro: FATAL ERROR during initialization.', error);
            }
        }

        loadSettings() {
            let loadedSettings = {}, loadedHotkeys = {};
            try {
                loadedSettings = JSON.parse(window.localStorage.getItem('aimbaeshiro_settings'));
                loadedHotkeys = JSON.parse(window.localStorage.getItem('aimbaeshiro_hotkeys'));
            } catch (e) {
                console.warn("🌸 AimbaeShiro: Could not parse settings, using defaults.");
            }
            this.settings = { ...this.defaultSettings, ...loadedSettings };
            this.hotkeys = { ...this.defaultHotkeys, ...loadedHotkeys };
        }

        saveSettings(key, value) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error("🌸 AimbaeShiro: Could not save settings.", e);
            }
        }

        async checkForUpdates() {
            const current = GM_info.script.version || '0.0.0';

            const getLatestFromGitHub = async () => {
                try {
                    const res = await fetch('https://api.github.com/repos/GameSketchers/AimbaeShiro/releases/latest', { cache: 'no-store' });
                    if (!res.ok) throw new Error('GitHub latest failed');
                    const json = await res.json();
                    const latestTag = (json && (json.tag_name || json.name)) ? (json.tag_name || '').toString().trim() : '';
                    const assetUrl = (json.assets && json.assets[0] && json.assets[0].browser_download_url) ? json.assets[0].browser_download_url : null;
                    const version = latestTag.replace(/^v/i, '').trim();
                    return { version, downloadUrl: assetUrl, source: 'github' };
                } catch (e) {
                    return null;
                }
            };

            const getLatestFromGreasyFork = async () => {
                try {
                    const res = await fetch('https://api.greasyfork.org/en/scripts/538607.json', { cache: 'no-store' });
                    if (!res.ok) throw new Error('GF latest failed');
                    const json = await res.json();
                    const version = (json && json.version) ? json.version : null;
                    const code_url = (json && json.code_url) ? json.code_url : null;
                    return { version, downloadUrl: code_url, source: 'greasyfork' };
                } catch (e) {
                    return null;
                }
            };

            const latestGh = await getLatestFromGitHub();
            const latest = latestGh || await getLatestFromGreasyFork();

            if (!latest || !latest.version) return;

            const cmp = this.compareVersionStrings(current, latest.version);
            if (cmp < 0) {
                const url = latest.downloadUrl || 'https://greasyfork.org/en/scripts/538607-aimbaeshiro-krunker-io-cheat';
                this.notify({
                    title: 'New version available',
                    message: `Current: ${current} → Latest: ${latest.version}`,
                    actionText: 'Update',
                    onAction: () => {
                        try { window.open(url, '_blank', 'noopener'); } catch (e) { location.href = url; }
                    },
                    timeout: 0
                });
            }
        }

        compareVersionStrings(a, b) {
            const na = String(a || '').replace(/^v/i, '').split('.').map(x => parseInt(x, 10) || 0);
            const nb = String(b || '').replace(/^v/i, '').split('.').map(x => parseInt(x, 10) || 0);
            const len = Math.max(na.length, nb.length);
            for (let i = 0; i < len; i++) {
                const da = na[i] || 0, db = nb[i] || 0;
                if (da > db) return 1;
                if (da < db) return -1;
            }
            return 0;
        }

        initializeNotifierContainer() {
            let container = document.getElementById('anonimbiri-notify-wrap');
            if (!container) {
                container = document.createElement('div');
                container.id = 'anonimbiri-notify-wrap';
                document.documentElement.appendChild(container);
            }
            this.notifyContainer = container;
        }

        notify({ title = 'Notification', message = '', actionText, onAction, timeout = 6000 } = {}) {
            if (!this.notifyContainer) {
                console.error("🌸 AimbaeShiro: Notifier container not initialized.");
                return;
            }

            const card = document.createElement('div');
            card.className = 'anonimbiri-notify-card';

            setTimeout(() => card.classList.add('visible'), 10);

            const content = document.createElement('div');
            content.className = 'anonimbiri-notify-content';

            const logo = document.createElement('div');
            logo.className = 'anonimbiri-notify-logo';

            const texts = document.createElement('div');
            texts.className = 'anonimbiri-notify-texts';

            const titleEl = document.createElement('label');
            titleEl.className = 'anonimbiri-notify-title';
            titleEl.textContent = title;

            const messageEl = document.createElement('div');
            messageEl.className = 'anonimbiri-notify-message';
            messageEl.textContent = message;

            texts.append(titleEl, messageEl);
            content.append(logo, texts);

            const controls = document.createElement('div');
            controls.className = 'anonimbiri-notify-controls';

            if (actionText && typeof onAction === 'function') {
                const btn = document.createElement('div');
                btn.className = 'anonimbiri-notify-action-btn';
                btn.textContent = actionText;
                btn.addEventListener('click', (e) => { e.stopPropagation(); onAction(); dismiss(); });
                controls.appendChild(btn);
            }

            card.append(content, controls);
            this.notifyContainer.appendChild(card);

            let hideTimer;
            if (timeout > 0) hideTimer = setTimeout(dismiss, timeout);

            function dismiss() {
                clearTimeout(hideTimer);
                card.classList.remove('visible');
                setTimeout(() => card.remove(), 350);
            }

            return { dismiss };
        }

        initializeLoader() {
            let tokenPromiseResolve;
            const tokenPromise = new Promise((resolve) => (tokenPromiseResolve = resolve));
            const ifr = document.createElement('iframe');
            ifr.src = location.origin + '/' + (window.location.search ? window.location.search : '');
            ifr.style.display = 'none';
            document.documentElement.append(ifr);
            ifr.contentWindow.fetch=new Proxy(ifr.contentWindow.fetch,{apply(t,a,[u,...r]){if(typeof u==="string"&&u.includes("/seek-game")){ifr.remove();tokenPromiseResolve(u);return;}return Reflect.apply(t,a,[u,...r]);}});
            window.fetch=new Proxy(window.fetch,{apply:async(t,a,[u,...r])=>{if(typeof u==="string"&&u.includes("/seek-game"))u=await tokenPromise;return Reflect.apply(t,a,[u,...r]);}});
            function downloadFileSync(url) { var req = new XMLHttpRequest(); req.open('GET', url, false); req.send(); if (req.status === 200) { return req.response; } return null; }
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.tagName === 'SCRIPT' && node.src && node.src.includes('/static/index-')) {
                            node.remove(); observer.disconnect();
                            this.gameJS = downloadFileSync(`https://cdn.jsdelivr.net/gh/GameSketchers/AimbaeShiro@${GM_info.script.version}/GameSource/game.js`);
                            const patchedScript = this.patchGameScript(this.gameJS);
                            window.addEventListener('load', () => { Function(patchedScript)(); });
                            return;
                        }
                    }
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        }

        patchGameScript(script) {
            const entries = {
                isYou: { regex: /(?:this\.\w+\s*=\s*true;)\s*this\.(\w+)\s*=\s*[^;]+;(?:\s*this\.\w+\s*=\s*[^;]+;){5}\s*this\.\w+\s*=\s*null;/s, index: 1 },
                pchObjc: { regex: /this\.([^\s=]+)\s*=\s*new\s+[^\s]+\.Object3D\(\)/u, index: 1 },
                inView: { regex: /([^\s=.]+)\.([^\s=]+)\s*=\s*\([^;]+;\s*if\s*\(\1\.latestData\)/s, index: 2 },
                procInputs: { regex: /for\s*\(\s*var\s+[^\s=]+\s*=\s*0;\s*[^\s<]+\s*<\s*this\.[^;]+;\s*\+\+[^\s)]+\s*\)\s*{\s*this\.([^\s(]+)\([^)]+\);\s*}\s*this\.[^\s(]+\(\);/s, index: 1 },
                weaponIndex: { regex: /}\s*else\s*{\s*this\.[^\s=\[]+\[this\.([^\s=\]]+)\]\s*=\s*[^;]+;\s*}\s*[^.\s]+\.updatePlayerAmmo\(this\);/s, index: 1 },
                respawnT: { regex: /(:\s*)\(parseFloat\([^)]+\)\s*\|\|\s*0\)\s*\*\s*1000/g, patch: `$10` },
                anticheat1: { regex: /if\s*\(\s*window\.utilities\s*\)\s*\{[\s\S]*?\}/, patch: '/* Anticheat Removed By Anonimbiri */' },
                //anticheat2: { regex: /for\s*\(var.*?windows\.length.*?\)\s*\{[\s\S]*?\}/, patch: '/* Anticheat Removed By Anonimbiri */' },
                commandline: { regex: /Object\.defineProperty\(console,\s*['_"]_commandLineAPI['_"][\s\S]*?}\);?/g, patch: "/* Antidebug removed by anonimbiri */" },
                typeError: {regex: /throw new TypeError/g, patch: "console.error"},
                error: { regex: /throw new Error/g, patch: "console.error" },
            };

            for (const name in entries) {
                const object = entries[name];
                const found = object.regex.exec(script);
                if (object.hasOwnProperty('index')) {
                    if (!found) {
                        console.warn(`🌸 AimbaeShiro: Failed to Find '${name}'`);
                        this.vars[name] = null;
                    } else {
                        this.vars[name] = found[object.index];
                        console.log(`🌸 AimbaeShiro: Found '${name}': ${this.vars[name]}`);
                    }
                } else if (found) {
                    script = script.replace(object.regex, object.patch);
                    console.log(`🌸 AimbaeShiro: Patched '${name}'`);
                } else {
                    console.warn(`🌸 AimbaeShiro: Failed to Patch '${name}'`);
                }
            }
            return script;
        }

        initializeGameHooks() {
            const cheatInstance = this;
            const originalSkinsSymbol = Symbol('origSkins');
            const localSkinsSymbol = Symbol('localSkins');

            Object.defineProperties(Object.prototype, {
                canvas: {
                    set(canvasValue) {
                        this['_canvas'] = canvasValue;
                        if (canvasValue && canvasValue.id === 'game-overlay') {
                            cheatInstance.overlay = this;
                            cheatInstance.ctx = canvasValue.getContext('2d');
                            Object.defineProperty(this, 'render', {
                                set(originalRender) {
                                    this['_render'] = new Proxy(originalRender, {
                                        apply(target, thisArg, args) {
                                            ['scale', 'game', 'controls', 'renderer', 'me'].forEach((prop, i) => {
                                                cheatInstance[prop] = args[i];
                                            });
                                            Reflect.apply(...arguments);
                                            if (cheatInstance.me && cheatInstance.ctx) {
                                                cheatInstance.onRenderFrame();
                                            }
                                        },
                                    });
                                },
                                get() { return this['_render']; },
                            });
                        }
                    },
                    get() { return this['_canvas']; },
                },
                THREE: {
                    configurable: true,
                    set(value) {
                        if(cheatInstance.three == null){
                            console.log("🌸 AimbaeShiro: THREE object captured!");
                            cheatInstance.three = value;
                            cheatInstance.tempVector = new value.Vector3();
                            cheatInstance.cameraPos = new value.Vector3();
                            cheatInstance.rayC = new value.Raycaster();
                            cheatInstance.vec2 = new value.Vector2(0, 0);
                        }
                        this['_value'] = value;
                    },
                    get() { return this['_value']; },
                },
                skins: {
                    set(skinsArray) {
                        this[originalSkinsSymbol] = skinsArray;
                        if (!this[localSkinsSymbol]) {
                            this[localSkinsSymbol] = Array.apply(null, Array(25000)).map((_, i) => { return { ind: i, cnt: 1, }});
                        }
                        return skinsArray;
                    },
                    get() {
                        return cheatInstance.settings.unlockSkins && this.stats ? this[localSkinsSymbol] : this[originalSkinsSymbol];
                    },
                },
                events: {
                    configurable: true,
                    set(eventEmitter) {
                        this['_events'] = eventEmitter;
                        if (this.ahNum === 0) {
                            cheatInstance.socket = this;
                            cheatInstance.wsEvent = this._dispatchEvent.bind(this);
                            cheatInstance.wsSend = this.send.bind(this);
                            this.send = new Proxy(this.send, {
                                apply(target, thisArg, [type, ...message]) {
                                    if (type=="ah2") return;
                                    let data = message[0];
                                    if (type === 'en' && data) {
                                        cheatInstance.skinCache = { main: data[2][0], secondary: data[2][1], hat: data[3], body: data[4], knife: data[9], dye: data[14], waist: data[17], playerCard: data[32] };
                                    }
                                    if(cheatInstance.settings.unlockSkins && type === 'spry' && data && data !== 4577){
                                        cheatInstance.skinCache.spray = data;
                                        message[0] = 4577;
                                    }
                                    return target.apply(thisArg, [type, ...message]);
                                }
                            });

                            this._dispatchEvent = new Proxy(this._dispatchEvent, {
                                apply(target, thisArg, [eventName, ...eventData]) {
                                    if (eventName === 'error' && eventData[0][0].includes('Connection Banned')) {
                                        localStorage.removeItem('krunker_token');
                                        cheatInstance.notify({
                                            title: 'Banned',
                                            message: 'Due to a ban, you have been signed out.\nPlease connect to the game with a VPN.',
                                            timeout: 5000
                                        });
                                        console.log('🌸 AimbaeShiro: Due to a ban, you have been signed out, Please connect to the game with a VPN.');
                                    }
                                    if (cheatInstance.settings.unlockSkins && eventName === '0') {
                                        let playerData = eventData[0][0];
                                        let playerStride = 38;
                                        while (playerData.length % playerStride !== 0) playerStride++;
                                        for (let i = 0; i < playerData.length; i += playerStride) {
                                            if (playerData[i] === cheatInstance.socket.socketId || 0) {
                                                playerData[i + 12] = [cheatInstance.skinCache.main, cheatInstance.skinCache.secondary];
                                                playerData[i + 13] = cheatInstance.skinCache.hat;
                                                playerData[i + 14] = cheatInstance.skinCache.body;
                                                playerData[i + 19] = cheatInstance.skinCache.knife;
                                                playerData[i + 24] = cheatInstance.skinCache.dye;
                                                playerData[i + 33] = cheatInstance.skinCache.waist;
                                                playerData[i + 43] = cheatInstance.skinCache.playerCard;
                                            }
                                        }
                                    }
                                    if (cheatInstance.settings.unlockSkins && eventName === 'sp') {
                                        eventData[0][1] = cheatInstance.skinCache.spray;
                                    }
                                    return target.apply(thisArg, [eventName, ...eventData]);
                                }
                            });
                        }
                    },
                    get() { return this['_events']; },
                },
                premiumT: {
                    set(value) { return value; },
                    get() { return cheatInstance.settings.unlockSkins; }
                },
                idleTimer: {
                    enumerable: false,
                    get() { return cheatInstance.settings.antikick ? 0 : this['_idleTimer']; },
                    set(value) { this['_idleTimer'] = value; },
                },
                kickTimer: {
                    enumerable: false,
                    get() { return cheatInstance.settings.antikick ? Infinity : this['_kickTimer']; },
                    set(value) { this['_kickTimer'] = value; },
                },
                cnBSeen: {
                    set(value) { this.inView = value; },
                    get() {
                        const isEnemy = !this.team || (cheatInstance.me && this.team !== cheatInstance.me.team);
                        return isEnemy && (cheatInstance.settings.espSquare || cheatInstance.settings.espNameTags) ? false : this.inView;
                    },
                },
                canBSeen: {
                    set(value) { this.inViewBot = value; },
                    get() {
                        const isEnemy = !this.team || (cheatInstance.me && this.team !== cheatInstance.me.team);
                        return isEnemy && (cheatInstance.settings.espSquare || cheatInstance.settings.espNameTags) ? false : this.inViewBot;
                    },
                },
            });
        }

        onRenderFrame() {
            if (!this.three || !this.renderer?.camera || !this.me) return;

            if (this.me.procInputs && !this.me.procInputs[this.isProxy]) {
                const originalProcInputs = this.me.procInputs;
                this.me.procInputs = new Proxy(originalProcInputs, {
                    apply: (target, thisArg, args) => {
                        if (thisArg) {
                            this.onProcessInputs(args[0], thisArg);
                        }
                        return Reflect.apply(target, thisArg, args);
                    },
                    get: (target, prop) => {
                        if (prop === this.isProxy) return true;
                        return Reflect.get(target, prop);
                    }
                });
            }

            if (this.renderer.scene) {
                this.renderer.scene.traverse(child => {
                    if (child.material && child.type == 'Mesh' && child.name != '' && child.isObject3D && !child.isModel && child.isMesh){
                        if (Array.isArray(child.material)) {
                            for (const material of child.material) material.wireframe = this.settings.wireframeEnabled;
                        } else child.material.wireframe = this.settings.wireframeEnabled;
                    }
                });
            }

            const original_strokeStyle = this.ctx.strokeStyle;
            const original_lineWidth = this.ctx.lineWidth;
            const original_font = this.ctx.font;
            const original_fillStyle = this.ctx.fillStyle;

            CRC2d.save.apply(this.ctx, []);

            if (this.settings.fovSize > 0 && this.settings.drawFovCircle) {
                const centerX = this.overlay.canvas.width / 2;
                const centerY = this.overlay.canvas.height / 2;
                const radius = this.settings.fovSize;

                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = 'rgba(255, 0, 128, 0.7)';
                this.ctx.shadowColor = 'rgba(255, 0, 128, 1)';
                this.ctx.shadowBlur = 10;
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }

            for (const player of this.game.players.list) {
                if (player.isYou || !player.active || !player.objInstances) continue;
                this.drawCanvasESP(player , false);
            }

            if(this.settings.espBotCheck){
                for (const bot of this.game.AI.ais) {
                    if (!bot.mesh && !bot.mesh.visible && bot.health >! 0) continue;
                    this.drawCanvasESP(bot, true);
                }
            }

            CRC2d.restore.apply(this.ctx, []);

            this.ctx.strokeStyle = original_strokeStyle;
            this.ctx.lineWidth = original_lineWidth;
            this.ctx.font = original_font;
            this.ctx.fillStyle = original_fillStyle;
        }

        onProcessInputs(inputPacket, player) {
            const gameInputIndices = { frame: 0, delta: 1, xdir: 2, ydir: 3, moveDir: 4, shoot: 5, scope: 6, jump: 7, reload: 8, crouch: 9, weaponScroll: 10, weaponSwap: 11, moveLock: 12 };

            if (this.settings.bhopEnabled && this.pressedKeys.has('Space')) {
                this.controls.keys[this.controls.binds.jump.val] ^= 1;
                if (this.controls.keys[this.controls.binds.jump.val]) {
                    this.controls.didPressed[this.controls.binds.jump.val] = 1;
                }

                if (this.me.velocity.y < -0.03 && this.me.canSlide) {
                    setTimeout(() => { this.controls.keys[this.controls.binds.crouch.val] = 0; }, this.me.slideTimer || 325);
                    this.controls.keys[this.controls.binds.crouch.val] = 1;
                    this.controls.didPressed[this.controls.binds.crouch.val] = 1;
                }
            }

            if (this.settings.autoNuke && Object.keys(this.me.streaks).length && this.socket?.send) {
                this.socket.send('k', 0);
            }

            if (this.settings.autoReload && this.me.weapon.secondary !== undefined && this.me.weapon.secondary !== null && this.me.ammos[this.me[this.vars.weaponIndex]] === 0 && this.me.reloadTimer === 0) {
                this.game.players.reload(this.me);
                inputPacket[gameInputIndices.reload] = 1;
            }

            // Aimbot
            let target = null;
            if (this.settings.aimbotEnabled && (!this.settings.aimbotOnRightMouse || this.rightMouseDown)) {
                let potentialTargets = this.game.players.list
                .filter(p => this.isDefined(p) && !p.isYou && p.active && p.health > 0 && (!this.settings.aimbotTeamCheck || !this.isTeam(p)) && (!this.settings.aimbotWallCheck || this.getCanSee(p)))
                .map(p => ({ ...p, isBot: false }));

                if (this.settings.aimbotBotCheck && this.game.AI?.ais) {
                    const botTargets = this.game.AI.ais
                    .filter(bot => bot.mesh && bot.mesh.visible && bot.health > 0 && (!this.settings.aimbotWallCheck || this.getCanSee(bot)))
                    .map(bot => ({ ...bot, isBot: true }));
                    potentialTargets = potentialTargets.concat(botTargets);
                }

                potentialTargets.sort((a, b) => this.getDistance(this.me, a) - this.getDistance(this.me, b));

                if (this.settings.fovSize > 0) {
                    const fovRadius = this.settings.fovSize;
                    const centerX = this.overlay.canvas.width / 2;
                    const centerY = this.overlay.canvas.height / 2;

                    potentialTargets = potentialTargets.filter(p => {
                        const screenPos = this.world2Screen(new this.three.Vector3(p.x, p.y, p.z));
                        if (!screenPos) return false;

                        const dist = Math.sqrt(Math.pow(screenPos.x - centerX, 2) + Math.pow(screenPos.y - centerY, 2));
                        return dist <= fovRadius;
                    });
                }

                target = potentialTargets[0] || null;
            }

            if (target && this.me.reloadTimer === 0 && this.game.gameState !== 4 && this.game.gameState !== 5) {
                const isMelee = this.me.weapon.melee;
                const closeRange = 17.6;
                const throwRange = 65.2;
                const distance = this.getDistance(this.me, target);

                if (isMelee && distance > (this.me.weapon.canThrow ? throwRange : closeRange)) {
                    // Do nothing if melee and out of range
                } else {
                    if (this.settings.legitAimbot) {
                        let adsReduction = 1.0;
                        if (this.me.aimVal < 1) {
                            adsReduction = 1.0 - (this.settings.adsTremorReduction / 100.0);
                        }

                        if (this.legitTarget !== target) {
                            this.legitTarget = target;
                            this.lastTargetChangeTime = Date.now();
                            this.aimOffset.x = (Math.random() - 0.5) * (this.settings.aimRandomness * adsReduction);
                            this.aimOffset.y = (Math.random() - 0.5) * (this.settings.aimRandomness * adsReduction);
                        }

                        const wanderAmount = this.settings.aimRandomness * adsReduction;
                        this.aimOffset.x += (Math.random() - 0.5) * wanderAmount * 0.1;
                        this.aimOffset.y += (Math.random() - 0.5) * wanderAmount * 0.1;
                        this.aimOffset.x = Math.max(-wanderAmount, Math.min(wanderAmount, this.aimOffset.x));
                        this.aimOffset.y = Math.max(-wanderAmount, Math.min(wanderAmount, this.aimOffset.y));

                        const targetY = target.isBot ? (target.y - target.dat.mSize / 2) : (target.y - target.crouchVal * 3 + this.me.crouchVal * 3 + this.settings.aimOffset);

                        const yDire = this.getDirection(this.me.z, this.me.x, target.z, target.x);
                        const xDire = this.getXDirection(this.me.x, this.me.y, this.me.z, target.x, targetY, target.z);

                        const currentY = this.controls.object.rotation.y;
                        const currentX = this.controls[this.vars.pchObjc].rotation.x;

                        const finalX = xDire - (0.3 * this.me.recoilAnimY) + this.aimOffset.y * 0.01;
                        const finalY = yDire + this.aimOffset.x * 0.01;

                        const flickFactor = this.settings.flickSpeed * 0.01;
                        const shortestAngleY = Math.atan2(Math.sin(finalY - currentY), Math.cos(finalY - currentY));
                        let newY = currentY + shortestAngleY * flickFactor;

                        const shortestAngleX = finalX - currentX;
                        let newX = currentX + shortestAngleX * flickFactor;

                        if (this.settings.aimTremor > 0) {
                            const tremorAmount = this.settings.aimTremor * adsReduction;
                            const tremorX = (Math.random() - 0.5) * tremorAmount * 0.01;
                            const tremorY = (Math.random() - 0.5) * tremorAmount * 0.01;
                            newX += tremorX;
                            newY += tremorY;
                        }

                        if (!this.settings.superSilentEnabled) this.lookDir(newX, newY);
                        inputPacket[gameInputIndices.xdir] = newX * 1000;
                        inputPacket[gameInputIndices.ydir] = newY * 1000;

                    } else {
                        const yDire = (this.getDirection(this.me.z, this.me.x, target.z, target.x) || 0);
                        const xDire = target.isBot ? ((this.getXDirection(this.me.x, this.me.y, this.me.z, target.x, target.y - target.dat.mSize / 2, target.z) || 0) - (0.3 * this.me.recoilAnimY)) : ((this.getXDirection(this.me.x, this.me.y, this.me.z, target.x, target.y - target.crouchVal * 3 + this.me.crouchVal * 3 + this.settings.aimOffset, target.z) || 0) - (0.3 * this.me.recoilAnimY));
                        if (!this.settings.superSilentEnabled) this.lookDir(xDire, yDire);
                        inputPacket[gameInputIndices.xdir] = xDire * 1000;
                        inputPacket[gameInputIndices.ydir] = yDire * 1000;
                    }

                    if (this.settings.autoFireEnabled) {
                        this.playerMaps.length = 0;
                        this.rayC.setFromCamera(this.vec2, this.renderer.fpsCamera);
                        this.playerMaps = this.game.players.list
                            .map(p => p.objInstances)
                            .filter(Boolean);
                        let inCast = this.rayC.intersectObjects(this.playerMaps, true).length;
                        let canSee = target.objInstances && this.containsPoint(target.objInstances.position);

                        if (isMelee) {
                            if (distance <= closeRange && this.me.reloadTimer === 0 && !this.me.didShoot && this.me.aimVal === 0 && (!this.settings.legitAimbot || (inCast && canSee))) {
                                inputPacket[gameInputIndices.shoot] = 1;
                            } else if (distance <= throwRange && this.me.weapon.canThrow) {
                                inputPacket[gameInputIndices.scope] = 1;
                                if(this.me.aimVal === 0 && this.me.reloadTimer === 0 && !this.me.didShoot && (!this.settings.legitAimbot || (inCast && canSee))){
                                    inputPacket[gameInputIndices.shoot] = 1;
                                }
                            }
                        } else {
                            if (!this.me.weapon.noAim) inputPacket[gameInputIndices.scope] = 1;
                            if ((this.me.weapon.noAim || this.me.aimVal === 0) && this.me.reloadTimer === 0 && !this.me.didShoot && (!this.settings.legitAimbot || (inCast && canSee))) {
                                inputPacket[gameInputIndices.shoot] = 1;
                            }
                        }
                    }
                }
            } else if (!target && this.game.gameState !== 4 && this.game.gameState !== 5) {
                this.legitTarget = null;
                if (!this.settings.superSilentEnabled && !this.settings.antiAimEnabled) this.resetLookAt();
                if (this.settings.antiAimEnabled && !this.me.didShoot && this.me.aimVal !== 0){
                    inputPacket[gameInputIndices.xdir] = -Math.PI * 500;
                }
            } else if (this.me.weapon.nAuto && this.me.didShoot) {
                inputPacket[gameInputIndices.shoot] = 0;
                inputPacket[gameInputIndices.scope] = 0;
                this.me.inspecting = false;
                this.me.inspectX = 0;
            }
        }

        showGUI() {
            if (this.game && !this.game.gameClosed) {
                if (document.pointerLockElement || document.mozPointerLockElement) {
                    document.exitPointerLock();
                }
            }
            window.showWindow(this.GUI.windowIndex);
        }

        initGameGUI() {
            const fontLink = document.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);

            const animeFontLink = document.createElement('link');
            animeFontLink.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&display=swap';
            animeFontLink.rel = 'stylesheet';
            document.head.appendChild(animeFontLink);

            const menuCSS = `
              .anonimbiri-menu-container{font-family:'Orbitron',monospace!important;background-color:rgba(10,10,10,.95)!important;border:2px solid #ff0080!important;border-radius:15px!important;box-shadow:0 0 30px rgba(255,0,128,.5),inset 0 0 20px rgba(255,0,128,.1)!important;backdrop-filter:blur(10px)!important;padding:0px!important; animation:anonimbiri-menuGlow 2s ease-in-out infinite alternate,anonimbiri-slideIn .5s ease-out;}
              @keyframes anonimbiri-menuGlow{from{box-shadow:0 0 30px rgba(255,0,128,.3),inset 0 0 20px rgba(255,0,128,.1)}to{box-shadow:0 0 50px rgba(255,0,128,.6),inset 0 0 30px rgba(255,0,128,.2)}}
              @keyframes anonimbiri-slideIn{from{opacity:0;transform:translate(-50%, calc(-50% - 20px)) scale(.95)}to{opacity:1;transform:translate(-50% - 20px) scale(1)}}
              .anonimbiri-menu-header{height:250px;background:linear-gradient(45deg,#ff0080,#ff4da6);border-radius:13px 13px 0 0;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
              .anonimbiri-menu-header::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background-image:url(https://cdn.jsdelivr.net/gh/GameSketchers/AimbaeShiro@main/Assets/banner.jpeg);background-size:cover;background-position:center;opacity:.8;z-index:1;animation:anonimbiri-bannerShift 10s ease-in-out infinite}
              @keyframes anonimbiri-bannerShift{0%,100%{transform:scale(1.05) rotate(-1deg)}50%{transform:scale(1.1) rotate(1deg)}}
              .anonimbiri-menu-header::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(45deg,rgba(255,0,128,.3),rgba(255,77,166,.3));z-index:2}
              .anonimbiri-tab-container{display:flex;background:rgba(20,20,20,.9);border-bottom:1px solid #ff0080}
              .anonimbiri-tab{flex:1;padding:12px;background:rgba(30,30,30,.8);color:#ff0080;text-align:center;cursor:pointer;transition:all .3s ease;font-weight:700;font-size:12px;letter-spacing:1px;border-right:1px solid rgba(255,0,128,.3);position:relative;overflow:hidden}
              .anonimbiri-tab::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);transition:left .5s ease}
              .anonimbiri-tab:hover::before{left:100%}
              .anonimbiri-tab:last-child{border-right:none}
              .anonimbiri-tab:hover{background:rgba(255,0,128,.2);color:#fff;transform:translateY(-2px)}
              .anonimbiri-tab.active{background:linear-gradient(45deg,#ff0080,#ff4da6);color:#fff;box-shadow:0 2px 10px rgba(255,0,128,.5)}
              .anonimbiri-tab-content{padding:15px;min-height:150px;overflow-y:auto;height: calc(97% - 300px);}
              .anonimbiri-tab-pane{display:none}
              .anonimbiri-tab-pane.active{display:block;animation:anonimbiri-fadeIn .3s ease}
              @keyframes anonimbiri-fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
              .anonimbiri-menu-item{display:flex;justify-content:space-between;align-items:center;padding:10px 15px;margin:8px 0;background:rgba(30,30,30,.8);border:1px solid rgba(255,0,128,.3);border-radius:8px;transition:all .3s ease;cursor:pointer;position:relative;overflow:hidden}
              .anonimbiri-menu-item::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,0,128,.1),transparent);transition:left .5s ease}
              .anonimbiri-menu-item:hover::before{left:100%}
              .anonimbiri-menu-item:hover{background:rgba(255,0,128,.1);border-color:#ff0080;transform:translateX(5px) scale(1.02);box-shadow:0 5px 15px rgba(255,0,128,.3)}
              .anonimbiri-menu-item.active{background:rgba(255,0,128,.2);border-color:#ff0080}
              .anonimbiri-menu-item-content{display:flex;align-items:center;gap:12px}
              .anonimbiri-menu-item-icon{width:20px;height:20px;stroke:#ff4da6;fill:none;stroke-width:1.8;transition:all .3s ease;stroke-linecap:round;stroke-linejoin:round}
              .anonimbiri-menu-item:hover .anonimbiri-menu-item-icon{stroke:#ff0080;transform:scale(1.08)}
              .anonimbiri-menu-item label{color:#ff4da6;font-weight:700;font-size:14px;letter-spacing:1px;cursor:pointer;transition:color .3s ease}
              .anonimbiri-menu-item:hover label{color:#ff0080}
              .anonimbiri-controls{display:flex;align-items:center;gap:10px}
              .anonimbiri-toggle-switch{position:relative;width:50px;height:24px;background:rgba(40,40,40,.8);border-radius:12px;pointer-events:none;transition:all .3s ease;border:1px solid rgba(255,0,128,.3)}
              .anonimbiri-toggle-switch::before{content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;background:#666;border-radius:50%;transition:all .3s cubic-bezier(.68,-.55,.265,1.55);box-shadow:0 2px 5px rgba(0,0,0,.3)}
              .anonimbiri-toggle-switch.active{background:linear-gradient(45deg,#ff0080,#ff4da6);box-shadow:0 0 15px rgba(255,0,128,.5)}
              .anonimbiri-toggle-switch.active::before{left:28px;background:#fff}
              .anonimbiri-color-container{position:relative}
              .anonimbiri-color-picker-input{opacity:0;position:absolute;width:40px;height:24px;cursor:pointer}
              .anonimbiri-color-preview{width:40px;height:24px;border:1px solid #ff0080;border-radius:4px;pointer-events:none;transition:all .3s ease}
              .anonimbiri-menu-item:hover .anonimbiri-color-preview{transform:scale(1.1);box-shadow:0 0 10px rgba(255,0,128,.7)}
              .anonimbiri-hotkey{background:rgba(255,0,128,.2);color:#fff;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:700;border:1px solid #ff0080;pointer-events:none;min-width:40px;text-align:center}
              .anonimbiri-menu-item:hover .anonimbiri-hotkey{background:#ff0080;transform:scale(1.05)}
              .anonimbiri-tab-content::-webkit-scrollbar{width:8px}
              .anonimbiri-tab-content::-webkit-scrollbar-track{background:rgba(20,20,20,.5);border-radius:4px}
              .anonimbiri-tab-content::-webkit-scrollbar-thumb{background:#ff0080;border-radius:4px}
              .anonimbiri-tab-content::-webkit-scrollbar-thumb:hover{background:#ff4da6}
              .anonimbiri-close-btn{position:absolute;top:10px;right:15px;color:#fff;font-size:20px;cursor:pointer;z-index:4;width:25px;height:25px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);border-radius:50%;transition:all .3s ease}
              .anonimbiri-close-btn svg{width:16px;height:16px;fill:#fff}
              .anonimbiri-close-btn:hover{background:#ff0080;transform:rotate(90deg) scale(1.1)}
              .anonimbiri-hotkey-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.9);display:none;align-items:center;justify-content:center;z-index:2000;animation:anonimbiri-fadeIn .3s ease}
              .anonimbiri-hotkey-modal.active{display:flex}
              .anonimbiri-hotkey-content{background:linear-gradient(135deg,#1a1a1a,#2a1a2a);padding:40px;border-radius:15px;border:2px solid #ff0080;box-shadow:0 0 50px rgba(255,0,128,.7);text-align:center;animation:anonimbiri-modalPulse .5s ease-out}
              @keyframes anonimbiri-modalPulse{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
              .anonimbiri-hotkey-content h2{color:#ff0080;font-size:24px;margin-bottom:20px;letter-spacing:2px}
              .anonimbiri-hotkey-content p{color:#fff;font-size:16px;margin-bottom:30px}
              .anonimbiri-hotkey-content p span{color:#ff4da6;font-weight:700}
              #shiro-menu-button{height:80px;background-color:rgba(255,0,128,.05);border:1px solid rgba(255,0,128,.5);cursor:pointer;background-image:url('https://cdn.jsdelivr.net/gh/GameSketchers/AimbaeShiro@main/Assets/logo.png');background-size:contain;background-position:center;background-repeat:no-repeat;transition:all .3s ease}
              #shiro-menu-button:hover{background-color:rgba(255,0,128,.2);border-color:#ff0080;transform:scale(1.03);box-shadow:0 0 15px rgba(255,0,128,.5)}
              .anonimbiri-slider-container{display:flex;align-items:center;gap:10px;min-width:160px}
              .anonimbiri-slider{appearance:none;-webkit-appearance:none;width:140px;height:6px;background:linear-gradient(90deg,rgba(255,0,128,.35),rgba(255,77,166,.35));border:1px solid rgba(255,0,128,.35);border-radius:999px;outline:none;transition:box-shadow .2s ease}
              .anonimbiri-slider:hover{box-shadow:0 0 12px rgba(255,0,128,.45)}
              .anonimbiri-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid #ff0080;box-shadow:0 0 12px rgba(255,0,128,.6);cursor:pointer;transition:transform .15s ease}
              .anonimbiri-slider:active::-webkit-slider-thumb{transform:scale(1.08)}
              .anonimbiri-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid #ff0080;box-shadow:0 0 12px rgba(255,0,128,.6);cursor:pointer}
              .anonimbiri-slider::-moz-range-track{height:6px;background:linear-gradient(90deg,rgba(255,0,128,.35),rgba(255,77,166,.35));border:1px solid rgba(255,0,128,.35);border-radius:999px}
              .anonimbiri-slider-value{color:#fff;font-weight:800;letter-spacing:.5px;font-size:12px;width:50px;text-align:center;background: rgba(255,0,128,.2);border: 1px solid #ff0080;border-radius:6px;padding:3px 8px; -moz-appearance: textfield;}
              .anonimbiri-menu-item:hover .anonimbiri-slider-value{background:#ff0080}
              #anonimbiri-notify-wrap{position:fixed;top:16px;right:16px;z-index:20000;display:flex;flex-direction:column;gap:10px}
              .anonimbiri-notify-card{font-family:'Orbitron',monospace;display:flex;justify-content:space-between;align-items:center;padding:10px 15px;background:rgba(30,30,30,.9);border:1px solid rgba(255,0,128,.6);border-radius:8px;backdrop-filter:blur(6px);width:min(92vw,360px);cursor:default;transform:translateX(calc(100% + 20px));opacity:0;transition:transform .35s ease,opacity .35s ease,box-shadow .3s ease}
              .anonimbiri-notify-card.visible{transform:translateX(0);opacity:1;box-shadow:0 10px 25px rgba(255,0,128,.3)}
              .anonimbiri-notify-content{display:flex;align-items:center;gap:12px;min-width:0}
              .anonimbiri-notify-logo{width:40px;height:40px;flex:0 0 40px;background-image:url('https://cdn.jsdelivr.net/gh/GameSketchers/AimbaeShiro@main/Assets/logo.png');background-size:cover;background-position:center}
              .anonimbiri-notify-texts{display:flex;flex-direction:column;gap:4px;min-width:0}
              .anonimbiri-notify-title{color:#fff;font-weight:800;letter-spacing:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
              .anonimbiri-notify-message{color:#ddd;font-size:10px;line-height:1.5;white-space:normal;word-break:break-word}
              .anonimbiri-notify-controls{display:flex;align-items:center;gap:8px;padding-left:5px}
              .anonimbiri-notify-action-btn{background:rgba(255,0,128,.2);color:#fff;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:700;border:1px solid #ff0080;min-width:40px;text-align:center;cursor:pointer;transition:all .2s ease}
              .anonimbiri-notify-action-btn:hover{background:#ff0080;transform:scale(1.05)}
              `;

            const style = document.createElement('style');
            style.textContent = menuCSS;
            document.head.appendChild(style);

            const hotkeyModalHTML = `
              <div class="anonimbiri-hotkey-modal" id="anonimbiri-hotkeyModal">
                  <div class="anonimbiri-hotkey-content">
                      <h2>Assign Hotkey</h2>
                      <p>Press any key to assign it to <span id="anonimbiri-hotkeyFeatureName">...</span></p>
                      <p>(Press ESC to cancel)</p>
                  </div>
              </div>`;
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = hotkeyModalHTML;
            document.body.appendChild(modalContainer);
            this.hotkeyModal = document.getElementById('anonimbiri-hotkeyModal');

            this.GUI.windowIndex = window.windows.length + 1;
            this.GUI.windowObj = {
                closed: false,
                header: "🌸 AimbaeShiro 🌸",
                html: "",
                extraCls: "anonimbiri-menu-container",
                gen: () => this.getGuiHtml(),
                hideScroll: true,
                height: 'calc(100% - 300px)',
                width: 500,
            };

            Object.defineProperty(window.windows, window.windows.length, { value: this.GUI.windowObj });

            this.waitFor(() => window.menuItemContainer).then(menu => {
                if (menu && !document.getElementById('shiro-menu-button')) {
                    const btn = document.createElement("div");
                    btn.id = 'shiro-menu-button';
                    btn.className = "menuItem";
                    btn.innerHTML = ``;
                    btn.addEventListener("click", () => this.showGUI());
                    btn.addEventListener('mouseenter', () => { if (window.SOUND) window.SOUND.play('hover_0', 0.1); });
                    menu.prepend(btn);
                }
            });
        }

        getGuiHtml() {
            const neonIcons = {
                aimbot: '<circle cx="12" cy="12" r="7" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke-width="2"/>',
                rightMouse: '<rect x="7" y="3" width="10" height="18" rx="3" stroke-width="2" fill="none"/><path d="M12 3v6" stroke-width="2"/><line x1="9.5" y1="11" x2="9.5" y2="11" stroke-width="2" stroke-linecap="round"/><line x1="14.5" y1="11" x2="14.5" y2="11" stroke-width="2" stroke-linecap="round"/>',
                wallCheck: '<rect x="4" y="6" width="16" height="12" rx="1" stroke-width="2" fill="none"/><path d="M4 12h16M8 6v12M16 6v12" stroke-width="1.5" opacity="0.6"/><circle cx="12" cy="12" r="2" fill="currentColor"><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/></circle>',
                wallbangs: '<rect x="3" y="8" width="4" height="8" stroke-width="2" fill="none"/><path d="M7 12h5" stroke-width="2" stroke-dasharray="2 1"/><circle cx="14" cy="12" r="1" fill="currentColor"/><path d="M15 12l4 0" stroke-width="2"><animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite"/></path>',
                teamCheck: '<path d="M12 2l8 3.5v7c0 5.5-3.5 9.3-8 10.5-4.5-1.2-8-5-8-10.5v-7z" stroke-width="2" fill="none"/><path d="M8 12l3 3 5-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
                autoFire: '<path d="M13 2l-2 7h4l-3 11 7-11h-4l2-7z" stroke-width="2" fill="none"><animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite"/></path>',
                superSilentEnabled: '<circle cx="12" cy="12" r="3" stroke-width="2" fill="none"/><path d="M3 12h6M15 12h6" stroke-width="2" stroke-dasharray="3 2"/><path d="M12 3v6M12 15v6" stroke-width="2" stroke-dasharray="3 2" opacity="0.5"/>',
                espLines: '<circle cx="12" cy="12" r="8" stroke-width="2" fill="none"/><path d="M12 12l5-5M12 12l5 5M12 12h7" stroke-width="1.5"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/></path>',
                espSquare: '<path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" stroke-width="2" stroke-linecap="round"/>',
                nameTags: '<rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2" fill="none"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><line x1="11" y1="10" x2="18" y2="10" stroke-width="1.5"/><line x1="11" y1="14" x2="16" y2="14" stroke-width="1.5"/>',
                weaponIcons: '<path d="M7 4l1.5 3v11a1 1 0 001 1h3a1 1 0 001-1V7l1.5-3z" stroke-width="2" fill="none"/><path d="M16 8v8l2 2" stroke-width="2" stroke-linecap="round"/>',
                espInfoBackground: '<rect x="3" y="6" width="18" height="12" rx="2" stroke-width="2" fill="none"/><rect x="5" y="8" width="14" height="8" rx="1" opacity="0.3" fill="currentColor"/>',
                colorPicker: '<circle cx="12" cy="12" r="9" stroke-width="2" fill="none"/><circle cx="12" cy="8" r="2" fill="#ff0080"/><circle cx="15.5" cy="11" r="2" fill="#00ff80"/><circle cx="14" cy="15" r="2" fill="#0080ff"/><circle cx="9" cy="15" r="2" fill="#ffff00"/><circle cx="8.5" cy="11" r="2" fill="#ff00ff"/>',
                wireframe: '<path d="M12 2l9 5v10l-9 5-9-5V7z" stroke-width="2" fill="none"/><path d="M12 2v20M21 7l-18 10M3 7l18 10" stroke-width="1" opacity="0.5"/>',
                unlockSkins: '<rect x="5" y="11" width="14" height="10" rx="2" stroke-width="2" fill="none"/><path d="M8 11V7a4 4 0 018 0v4" stroke-width="2" fill="none"/><circle cx="12" cy="16" r="1" fill="currentColor"/><path d="M12 16v2" stroke-width="2"/>',
                bunnyHop: '<path d="M4 20h16" stroke-width="2"/><path d="M7 20c0-3 2-5 2-5s1 2 3 2 3-2 3-2 2 2 2 5" stroke-width="2" fill="none"><animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="0.6s" repeatCount="indefinite"/></path>',
                antiAimEnabled: '<circle cx="12" cy="12" r="8" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke-width="2" stroke-linecap="round"/><path d="M16 8l2-2m0 0l2 2m-2-2v4" stroke-width="1.5"><animateTransform attributeName="transform" type="rotate" from="0 18 6" to="360 18 6" dur="3s" repeatCount="indefinite"/></path>',
                autoNuke: '<circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="12" cy="12" r="6" stroke-width="2" fill="none" stroke-dasharray="2 1"/><circle cx="12" cy="12" r="9" stroke-width="2" fill="none" opacity="0.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" stroke-width="1.5"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/></path>',
                antiKick: '<path d="M12 2l8 3.5v7c0 5.5-3.5 9.3-8 10.5-4.5-1.2-8-5-8-10.5v-7z" stroke-width="2" fill="none"/><path d="M8 8l8 8M16 8l-8 8" stroke-width="2" stroke-linecap="round"/>',
                autoReload: '<path d="M21 12a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9c2.5 0 4.7 1 6.3 2.7" stroke-width="2" fill="none"/><path d="M21 4v5h-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
                hotkeys: '<rect x="3" y="7" width="18" height="10" rx="2" stroke-width="2" fill="none"/><rect x="6" y="10" width="3" height="2" fill="currentColor"/><rect x="10.5" y="10" width="3" height="2" fill="currentColor"/><rect x="15" y="10" width="3" height="2" fill="currentColor"/><rect x="8" y="13" width="8" height="2" fill="currentColor"/>',
                fov: '<circle cx="12" cy="12" r="9" stroke-width="2" fill="none"/><path d="M12 12l6-4M12 12l6 4" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"><animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite"/></circle>',
                botCheck: '<circle cx="12" cy="5" r="2" stroke-width="2" fill="none"/><rect x="8" y="7" width="8" height="5" rx="1" stroke-width="2" fill="none"/><rect x="7" y="12" width="10" height="7" rx="2" stroke-width="2" fill="none"/><circle cx="10" cy="15" r="1" fill="currentColor"/><circle cx="14" cy="15" r="1" fill="currentColor"/><path d="M10 17h4" stroke-width="1.5" stroke-linecap="round"/>',
                botColor: '<circle cx="12" cy="12" r="8" stroke-width="2" fill="none"/><circle cx="9" cy="10" r="1.5" fill="#ff0080"/><circle cx="15" cy="10" r="1.5" fill="#00ff80"/><circle cx="12" cy="14" r="1.5" fill="#0080ff"/><path d="M18 5l1-1m0 0l1 1m-1-1v2" stroke-width="1.5" stroke-linecap="round"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/></path>'
            };

            const tooltips = {
                aimbotEnabled: 'Master aimbot toggle.',
                aimbotOnRightMouse: 'Only activate aimbot when right mouse is held.',
                aimbotWallCheck: 'Aimbot will not target players through walls.',
                aimbotWallBangs: 'Allows aimbot to shoot through penetrable walls.',
                aimbotTeamCheck: 'Aimbot will not target teammates.',
                aimbotBotCheck: 'Aimbot will target AI/bots.',
                autoFireEnabled: 'Automatically fires when an aimbot target is acquired.',
                superSilentEnabled: 'Aimbot aims without moving your camera view.',
                fovSize: 'Radius of the circle (in pixels) where aimbot can target enemies. Set to 0 for full screen.',
                drawFovCircle: 'Displays the aimbot FOV circle on screen.',
                espTeamCheck: 'Do not show ESP for teammates.',
                espBotCheck: 'Show ESP for AI/bots.',
                espLines: 'Draws a line from the bottom of your screen to enemies.',
                espSquare: 'Draws a box around enemies.',
                espNameTags: 'Shows player name, health, and current weapon.',
                espWeaponIcons: 'Shows weapon icon/name in Full Info ESP.',
                espInfoBackground: 'Displays a background panel for player name/weapon information.',
                espColor: 'Color for ESP lines.',
                boxColor: 'Color for ESP boxes and text.',
                botColor: 'Special color for bot ESP.',
                wireframeEnabled: 'Renders the map and players in wireframe mode.',
                unlockSkins: 'Client-side skin unlocker.',
                bhopEnabled: 'Hold space to automatically jump/slide.',
                antiAimEnabled: 'Makes you harder to hit by looking down when not shooting.',
                tooltips: 'Makes you harder to hit by looking down when not shooting.',
                autoNuke: 'Automatically uses nuke when available.',
                antikick: 'Prevents being kicked for inactivity.',
                autoReload: 'Automatically reloads your weapon when out of ammo.',
                toggleMenu: 'Set a key to open/close this menu.',
            }

            setTimeout(this.bindMenuEvents.bind(this), 100);

            return `
                  <div class="anonimbiri-menu-header" id="anonimbiri-menuHeader"></div>

                  <div class="anonimbiri-tab-container">
                  <div class="anonimbiri-tab active" data-tab="aimbot">AIMBOT</div>
                  <div class="anonimbiri-tab" data-tab="esp">ESP</div>
                  <div class="anonimbiri-tab" data-tab="misc">MISC</div>
                  <div class="anonimbiri-tab" data-tab="hotkeys">HOTKEYS</div>
                  </div>

                  <div class="anonimbiri-tab-content">
                      <div class="anonimbiri-tab-pane active" id="anonimbiri-tab-aimbot">
                          ${this.createMenuItemHTML('toggle','aimbotEnabled','Aimbot Enabled', neonIcons.aimbot, tooltips.aimbotEnabled)}
                          ${this.createMenuItemHTML('toggle','aimbotOnRightMouse','Right Mouse Trigger', neonIcons.rightMouse, tooltips.aimbotOnRightMouse)}
                          ${this.createMenuItemHTML('toggle','aimbotWallCheck','Wall Check', neonIcons.wallCheck, tooltips.aimbotWallCheck)}
                          ${this.createMenuItemHTML('toggle','aimbotWallBangs','WallBangs', neonIcons.wallbangs, tooltips.aimbotWallBangs)}
                          ${this.createMenuItemHTML('toggle','aimbotTeamCheck','Team Check', neonIcons.teamCheck, tooltips.aimbotTeamCheck)}
                          ${this.createMenuItemHTML('toggle','aimbotBotCheck','Bot Aim', neonIcons.botCheck, tooltips.aimbotBotCheck)}
                          ${this.createMenuItemHTML('toggle','autoFireEnabled','Auto Fire', neonIcons.autoFire, tooltips.autoFireEnabled)}
                          ${this.createMenuItemHTML('toggle','superSilentEnabled','Super Silent Aim', neonIcons.superSilentEnabled, tooltips.superSilentEnabled)}
                          <hr style="border-color: #ff00803d;">
                          ${this.createMenuItemHTML('toggle','legitAimbot','Legit AI Aim', neonIcons.teamCheck, 'Simulates human-like aiming.')}
                          ${this.createMenuItemHTML('slider','flickSpeed','Flick Speed', neonIcons.autoFire, 'Controls the speed of the initial flick. Higher is faster.', 0, 100, 1)}
                          ${this.createMenuItemHTML('slider','adsTremorReduction','ADS Stability %', neonIcons.aimbot, 'Reduces tremor and wandering when aiming down sights (ADS).', 0, 100, 1)}
                          ${this.createMenuItemHTML('slider','aimRandomness','Aim Wandering', neonIcons.espLines, 'Simulates imperfect aim. Higher is more random.', 0, 5, 0.1)}
                          ${this.createMenuItemHTML('slider','aimTremor','Aim Tremor', neonIcons.wireframe, 'Simulates hand tremor during movement. Higher is more shaky.', 0, 5, 0.1)}
                          <hr style="border-color: #ff00803d;">
                          ${this.createMenuItemHTML('slider','fovSize','FOV Size', neonIcons.fov, tooltips.fovSize, 0, 300, 1)}
                          ${this.createMenuItemHTML('toggle','drawFovCircle','Draw FOV Circle', neonIcons.espSquare, tooltips.drawFovCircle)}
                      </div>

                      <div class="anonimbiri-tab-pane" id="anonimbiri-tab-esp">
                          ${this.createMenuItemHTML('toggle','espTeamCheck','Team Check', neonIcons.teamCheck, tooltips.espTeamCheck)}
                          ${this.createMenuItemHTML('toggle','espBotCheck','Bot Esp', neonIcons.botCheck, tooltips.espBotCheck)}
                          ${this.createMenuItemHTML('toggle','espLines','Energy Trail ESP', neonIcons.espLines, tooltips.espLines)}
                          ${this.createMenuItemHTML('toggle','espSquare','Glowing Box ESP', neonIcons.espSquare, tooltips.espSquare)}
                          ${this.createMenuItemHTML('toggle','espNameTags','Full Info (Name/HP/Wpn)', neonIcons.nameTags, tooltips.espNameTags)}
                          ${this.createMenuItemHTML('toggle','espWeaponIcons','Show Weapon (in Full Info)', neonIcons.weaponIcons, tooltips.espWeaponIcons)}
                          ${this.createMenuItemHTML('toggle','espInfoBackground','Info Panel Background', neonIcons.espInfoBackground, tooltips.espInfoBackground)}
                          ${this.createMenuItemHTML('color','espColor','Trail Color', neonIcons.colorPicker, tooltips.espColor)}
                          ${this.createMenuItemHTML('color','boxColor','Box & Info Color', neonIcons.colorPicker, tooltips.boxColor)}
                          ${this.createMenuItemHTML('color','botColor','Bot Color', neonIcons.botColor, tooltips.botColor)}
                      </div>

                      <div class="anonimbiri-tab-pane" id="anonimbiri-tab-misc">
                          ${this.createMenuItemHTML('toggle','wireframeEnabled','Wireframe', neonIcons.wireframe, tooltips.wireframeEnabled)}
                          ${this.createMenuItemHTML('toggle','unlockSkins','Unlock All Skins', neonIcons.unlockSkins, tooltips.unlockSkins)}
                          ${this.createMenuItemHTML('toggle','bhopEnabled','Bunny Hop', neonIcons.bunnyHop, tooltips.bhopEnabled)}
                          ${this.createMenuItemHTML('toggle','antiAimEnabled','Anti-Aim', neonIcons.antiAimEnabled, tooltips.antiAimEnabled)}
                          ${this.createMenuItemHTML('toggle','autoNuke','Auto Nuke', neonIcons.autoNuke, tooltips.autoNuke)}
                          ${this.createMenuItemHTML('toggle','antikick','Anti Kick', neonIcons.antiKick, tooltips.antikick)}
                          ${this.createMenuItemHTML('toggle','autoReload','Auto Reload', neonIcons.autoReload, tooltips.autoReload)}
                      </div>

                      <div class="anonimbiri-tab-pane" id="anonimbiri-tab-hotkeys">
                          ${this.createMenuItemHTML('hotkey','toggleMenu','Toggle Menu', neonIcons.hotkeys, tooltips.toggleMenu)}
                          ${this.createMenuItemHTML('hotkey','aimbotEnabled','Toggle Aimbot', neonIcons.aimbot, tooltips.aimbotEnabled)}
                          ${this.createMenuItemHTML('hotkey','aimbotWallCheck','Toggle Wall Check', neonIcons.wallCheck, tooltips.aimbotWallCheck)}
                          ${this.createMenuItemHTML('hotkey','aimbotWallBangs','Toggle WallBangs', neonIcons.wallbangs, tooltips.aimbotWallBangs)}
                          ${this.createMenuItemHTML('hotkey','aimbotTeamCheck','Toggle Aimbot Team', neonIcons.teamCheck, tooltips.aimbotTeamCheck)}
                          ${this.createMenuItemHTML('hotkey','aimbotBotCheck','Toggle Bot Aim', neonIcons.botCheck, tooltips.aimbotBotCheck)}
                          ${this.createMenuItemHTML('hotkey','espTeamCheck','Toggle ESP Team', neonIcons.teamCheck, tooltips.espTeamCheck)}
                          ${this.createMenuItemHTML('hotkey','espBotCheck','Toggle Bot ESP', neonIcons.botCheck, tooltips.espBotCheck)}
                          ${this.createMenuItemHTML('hotkey','espNameTags','Toggle Full Info', neonIcons.nameTags, tooltips.espNameTags)}
                          ${this.createMenuItemHTML('hotkey','espWeaponIcons','Toggle Weapon Icon', neonIcons.weaponIcons, tooltips.espWeaponIcons)}
                          ${this.createMenuItemHTML('hotkey','autoFireEnabled','Toggle Auto Fire', neonIcons.autoFire, tooltips.autoFireEnabled)}
                          ${this.createMenuItemHTML('hotkey','superSilentEnabled','Toggle Super Silent', neonIcons.superSilentEnabled, 'Set a key to toggle Super Silent Aim.')}
                          ${this.createMenuItemHTML('hotkey','espLines','Toggle Energy Trail', neonIcons.espLines, tooltips.espLines)}
                          ${this.createMenuItemHTML('hotkey','espSquare','Toggle Glowing Box', neonIcons.espSquare, tooltips.espSquare)}
                          ${this.createMenuItemHTML('hotkey','wireframeEnabled','Toggle Wireframe', neonIcons.wireframe, tooltips.wireframeEnabled)}
                          ${this.createMenuItemHTML('hotkey','unlockSkins','Toggle Unlock Skins', neonIcons.unlockSkins, tooltips.unlockSkins)}
                          ${this.createMenuItemHTML('hotkey','bhopEnabled','Toggle Bunny Hop', neonIcons.bunnyHop, tooltips.bhopEnabled)}
                          ${this.createMenuItemHTML('hotkey','antiAimEnabled','Toggle Anti-Aim', neonIcons.antiAimEnabled, 'Set a key to toggle Anti-Aim.')}
                      </div>
                  </div>`;
        }

        createMenuItemHTML(type, setting, label, iconPath, tooltip = '', min, max, step) {
            let controlHTML = '';
            const iconSVG = `<svg class="anonimbiri-menu-item-icon" viewBox="0 0 24 24">${iconPath}</svg>`;
            switch (type) {
                case 'toggle':
                    controlHTML = `<div class="anonimbiri-toggle-switch ${this.settings[setting] ? 'active' : ''}"></div>`;
                    break;
                case 'color':
                    controlHTML = `<div class="anonimbiri-color-container">
                          <input type="color" class="anonimbiri-color-picker-input" data-setting="${setting}" value="${this.settings[setting]}">
                          <div class="anonimbiri-color-preview" data-setting="${setting}" style="background-color: ${this.settings[setting]}"></div>
                      </div>`;
                    break;
                case 'hotkey':
                    controlHTML = `<div class="anonimbiri-hotkey" data-hotkey="${setting}">${this.hotkeys[setting]?.replace('Key', '').replace('Digit', '') || 'N/A'}</div>`;
                    break;
                case 'slider':
                    const val = (this.settings && typeof this.settings[setting] !== 'undefined') ? this.settings[setting] : 0;
                    const displayVal = val <= 0 ? 'Off' : val;
                    controlHTML = `<div class="anonimbiri-slider-container" data-setting="${setting}">
                          <input type="range" class="anonimbiri-slider" data-setting="${setting}" min="${min}" max="${max}" step="${step}" value="${val}">
                          <input type="text" class="anonimbiri-slider-value" data-setting="${setting}" value="${displayVal}" onfocus="this.type='number'" onblur="this.type='text'; this.value = this.value <= 0 ? 'Off' : this.value">
                      </div>`;
                    break;
            }
            return `<div class="anonimbiri-menu-item ${this.settings[setting] ? 'active' : ''}" data-setting="${setting}" title="${tooltip}">
                  <div class="anonimbiri-menu-item-content">${iconSVG}<label>${label}</label></div>
                  <div class="anonimbiri-controls">${controlHTML}</div>
              </div>`;
        }

        bindMenuEvents() {
            const menu = document.querySelector('.anonimbiri-menu-container');
            if (!menu) return;

            menu.querySelector('.anonimbiri-tab-container').addEventListener('click', (e) => {
                if (e.target.classList.contains('anonimbiri-tab')) {
                    if (window.SOUND) window.SOUND.play('select_0', 0.1);
                    const tabName = e.target.dataset.tab;
                    menu.querySelectorAll('.anonimbiri-tab').forEach(t => t.classList.remove('active'));
                    menu.querySelectorAll('.anonimbiri-tab-pane').forEach(p => p.classList.remove('active'));
                    e.target.classList.add('active');
                    menu.querySelector(`#anonimbiri-tab-${tabName}`).classList.add('active');
                }
            });

            menu.querySelector('.anonimbiri-tab-content').addEventListener('click', (e) => {
                const menuItem = e.target.closest('.anonimbiri-menu-item');
                if (!menuItem) return;
                const setting = menuItem.dataset.setting;
                if (!setting || menuItem.querySelector('.anonimbiri-slider-container')) return;

                if (window.SOUND) window.SOUND.play('select_0', 0.1);

                if (menuItem.querySelector('.anonimbiri-toggle-switch')) {
                    this.settings[setting] = !this.settings[setting];
                    this.saveSettings('aimbaeshiro_settings', this.settings);
                    menuItem.classList.toggle('active');
                    menuItem.querySelector('.anonimbiri-toggle-switch').classList.toggle('active');
                } else if (menuItem.querySelector('.anonimbiri-color-picker-input')) {
                    menuItem.querySelector('.anonimbiri-color-picker-input').click();
                } else if (menuItem.querySelector('.anonimbiri-hotkey')) {
                    this.showHotkeyModal(setting);
                }
            });

            menu.querySelectorAll('.anonimbiri-color-picker-input').forEach(cp => cp.addEventListener('input', (e) => {
                const setting = e.target.dataset.setting;
                this.settings[setting] = e.target.value;
                this.saveSettings('aimbaeshiro_settings', this.settings);
                menu.querySelector(`.anonimbiri-color-preview[data-setting="${setting}"]`).style.backgroundColor = e.target.value;
            }));

            menu.querySelectorAll('.anonimbiri-slider').forEach(slider => {
                const setting = slider.dataset.setting;
                const valueInput = menu.querySelector(`.anonimbiri-slider-value[data-setting="${setting}"]`);
                slider.addEventListener('input', () => {
                    const value = slider.value;
                    this.settings[setting] = Number(value);
                    const displayVal = value <= 0 ? 'Off' : value;
                    if (valueInput) valueInput.value = displayVal;
                });
                slider.addEventListener('change', () => this.saveSettings('aimbaeshiro_settings', this.settings));
            });

            menu.querySelectorAll('.anonimbiri-slider-value').forEach(valueInput => {
                const setting = valueInput.dataset.setting;
                const slider = menu.querySelector(`.anonimbiri-slider[data-setting="${setting}"]`);
                valueInput.addEventListener('input', () => {
                    let value = Number(valueInput.value);
                    const min = Number(slider.min);
                    const max = Number(slider.max);
                    if (value > max) value = max;
                    if (value < min) value = min;
                    valueInput.value = value;
                    this.settings[setting] = value;
                    if (slider) slider.value = value;
                });
                valueInput.addEventListener('change', () => this.saveSettings('aimbaeshiro_settings', this.settings));
            });

            menu.querySelectorAll('.anonimbiri-menu-item, .anonimbiri-tab').forEach(el => {
                el.addEventListener('mouseenter', () => { if (window.SOUND) window.SOUND.play('hover_0', 0.1); });
            });
        }

        addEventListeners() {
            window.addEventListener('pointerdown', (e) => { if (e.button === 2) this.rightMouseDown = true; });
            window.addEventListener('pointerup', (e) => { if (e.button === 2) this.rightMouseDown = false; });
            window.addEventListener('keydown', (e) => {
                this.pressedKeys.add(e.code);
                if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

                if (this.isBindingHotkey) {
                    e.preventDefault(); e.stopPropagation();
                    if (e.code === 'Escape') { this.hideHotkeyModal(); return; }
                    if (Object.values(this.hotkeys).includes(e.code)) { this.notify({ title: "Hotkey Error", message: "Key already assigned!"}); return; }
                    this.hotkeys[this.currentBindingSetting] = e.code;
                    this.saveSettings('aimbaeshiro_hotkeys', this.hotkeys);

                    const menu = document.querySelector('.anonimbiri-menu-container');
                    if(menu) {
                        const btn = menu.querySelector(`.anonimbiri-hotkey[data-hotkey="${this.currentBindingSetting}"]`);
                        if(btn) btn.textContent = e.code.replace('Key', '').replace('Digit', '');
                    }

                    this.hideHotkeyModal();
                    return;
                }

                const action = Object.keys(this.hotkeys).find(key => this.hotkeys[key] === e.code);
                if (action) {
                    if (action === 'toggleMenu') { this.showGUI(); }
                    else if (this.settings.hasOwnProperty(action)) {
                        this.settings[action] = !this.settings[action];
                        this.saveSettings('aimbaeshiro_settings', this.settings);
                        this.notify({ title: "Toggled", message: `${action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${this.settings[action] ? 'ON' : 'OFF'}`});
                        const menu = document.querySelector('.anonimbiri-menu-container');
                        if (menu) {
                            const item = menu.querySelector(`.anonimbiri-menu-item[data-setting="${action}"]`);
                            if (item) {
                                item.classList.toggle('active', this.settings[action]);
                                const toggle = item.querySelector('.anonimbiri-toggle-switch');
                                if (toggle) toggle.classList.toggle('active', this.settings[action]);
                            }
                        }
                    }
                }
            });
            window.addEventListener('keyup', (e) => { this.pressedKeys.delete(e.code); });
        }

        showHotkeyModal(settingName) {
            if (!this.hotkeyModal) return;
            this.isBindingHotkey = true; this.currentBindingSetting = settingName;
            const featureNameEl = document.getElementById('anonimbiri-hotkeyFeatureName');
            if (featureNameEl) featureNameEl.textContent = settingName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            this.hotkeyModal.classList.add('active');
        }

        hideHotkeyModal() { if (!this.hotkeyModal) return; this.isBindingHotkey = false; this.currentBindingSetting = null; this.hotkeyModal.classList.remove('active'); }

        isDefined(val) { return val !== undefined && val !== null; }
        isTeam(player) { return this.me && this.me.team ? this.me.team === player.team : false; }
        getDistance(p1, p2) { return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2)); }
        getDirection(z1, x1, z2, x2) { return Math.atan2(x1 - x2, z1 - z2); }
        getXDirection(t,e,o,i,s,n){const r=s-e,a=this.getDistance({x:t,y:e,z:o},{x:i,y:s,z:n});return Math.asin(r/a)}

        containsPoint(point) {
            let planes = this.renderer.frustum.planes;
            for (let i = 0; i < 6; i ++) {
                if (planes[i].distanceToPoint(point) < 0) {
                    return false;
                }
            }
            return true;
        }

        lineInRect(lx1, lz1, ly1, dx, dz, dy, x1, z1, y1, x2, z2, y2) {
            let t1 = (x1 - lx1) * dx;
            let t2 = (x2 - lx1) * dx;
            let t3 = (y1 - ly1) * dy;
            let t4 = (y2 - ly1) * dy;
            let t5 = (z1 - lz1) * dz;
            let t6 = (z2 - lz1) * dz;
            let tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
            let tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
            if (tmax < 0) return false;
            if (tmin > tmax) return false;
            return tmin;
        }

        getCanSee(player, boxSize) {
            const from = this.me;
            if (!from || !this.game?.map?.manager?.objects) return true;

            boxSize = boxSize || 0;
            const toX = player.x, toY = player.y, toZ = player.z;
            let penetrableWallsHit = 0;

            for (let obj, dist = this.getDistance(from, player), xDr = this.getDirection(from.z, from.x, toZ, toX), yDr = this.getDirection(this.getDistance({x: from.x, y: 0, z: from.z}, {x: toX, y: 0, z: toZ}), toY, 0, from.y), dx = 1 / (dist * Math.sin(xDr - Math.PI) * Math.cos(yDr)), dz = 1 / (dist * Math.cos(xDr - Math.PI) * Math.cos(yDr)), dy = 1 / (dist * Math.sin(yDr)), yOffset = from.y + (from.height || this.PLAYER_HEIGHT) - this.CAMERA_HEIGHT, i = 0; i < this.game.map.manager.objects.length; ++i) {
                let tmpDst;
                if (
                    !(obj = this.game.map.manager.objects[i]).noShoot && obj.active && obj.transparent !== false &&
                    (tmpDst = this.lineInRect(from.x, from.z, yOffset, dx, dz, dy, obj.x - Math.max(0, obj.width - boxSize), obj.z - Math.max(0, obj.length - boxSize), obj.y - Math.max(0, obj.height - boxSize), obj.x + Math.max(0, obj.width - boxSize), obj.z + Math.max(0, obj.length - boxSize), obj.y + Math.max(0, obj.height - boxSize))) &&
                    1 > tmpDst
                ) {
                    if (!this.settings.aimbotWallBangs || !obj.penetrable || !this.me.weapon.pierce) {
                        return false;
                    }
                    penetrableWallsHit++;
                }
            }
            return penetrableWallsHit <= 1;
        }

        async waitFor(condition, timeout = Infinity) {
            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            return new Promise(async (resolve, reject) => {
                if (typeof timeout != 'number') reject('Timeout argument not a number in waitFor');
                let result;
                while (result === undefined || result === false || result === null || result.length === 0) {
                    if ((timeout -= 100) < 0) { resolve(false); return; }
                    await sleep(100);
                    result = typeof condition === 'string' ? Function(condition)() : condition();
                }
                resolve(result);
            });
        }

        lookDir(xDire, yDire) {
            this.controls.object.rotation.y = yDire
            this.controls[this.vars.pchObjc].rotation.x = xDire;
            this.controls[this.vars.pchObjc].rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.controls[this.vars.pchObjc].rotation.x));
            this.controls.yDr = (this.controls[this.vars.pchObjc].rotation.x % Math.PI).round(3);
            this.controls.xDr = (this.controls.object.rotation.y % Math.PI).round(3);
            this.renderer.camera.updateProjectionMatrix();
            this.renderer.updateFrustum();
        }

        resetLookAt() {
            this.controls.yDr = this.controls[this.vars.pchObjc].rotation.x;
            this.controls.xDr = this.controls.object.rotation.y;
            this.renderer.camera.updateProjectionMatrix();
            this.renderer.updateFrustum();
        }

        world2Screen(worldPosition) {
            if (!this.renderer?.camera || !this.overlay?.canvas) return null;
            const pos = worldPosition.clone(); pos.project(this.renderer.camera);
            if (pos.z > 1) return null;
            return { x: (pos.x + 1) / 2 * this.overlay.canvas.width, y: (-pos.y + 1) / 2 * this.overlay.canvas.height, };
        }

        drawCanvasESP(player, isBot) {
            if (this.settings.espTeamCheck && this.isTeam(player)) return;

            const playerPos = new this.three.Vector3(player.x, player.y, player.z);
            const effectiveHeight = isBot ? player.dat.mSize : (player.height || this.PLAYER_HEIGHT) - ((player.crouchVal || 0) * this.CROUCH_FACTOR);
            const halfWidth = isBot ? (player.dat.mSize * 0.4) / 2 : this.PLAYER_WIDTH / 2;

            const corners = [
                new this.three.Vector3(playerPos.x - halfWidth, playerPos.y, playerPos.z - halfWidth), new this.three.Vector3(playerPos.x + halfWidth, playerPos.y, playerPos.z - halfWidth),
                new this.three.Vector3(playerPos.x - halfWidth, playerPos.y, playerPos.z + halfWidth), new this.three.Vector3(playerPos.x + halfWidth, playerPos.y, playerPos.z + halfWidth),
                new this.three.Vector3(playerPos.x - halfWidth, playerPos.y + effectiveHeight, playerPos.z - halfWidth), new this.three.Vector3(playerPos.x + halfWidth, playerPos.y + effectiveHeight, playerPos.z - halfWidth),
                new this.three.Vector3(playerPos.x - halfWidth, playerPos.y + effectiveHeight, playerPos.z + halfWidth), new this.three.Vector3(playerPos.x + halfWidth, playerPos.y + effectiveHeight, playerPos.z + halfWidth),
            ];

            let xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity, onScreen = false;
            for (const corner of corners) {
                const screenPos = this.world2Screen(corner);
                if (screenPos) { onScreen = true; xmin = Math.min(xmin, screenPos.x); xmax = Math.max(xmax, screenPos.x); ymin = Math.min(ymin, screenPos.y); ymax = Math.max(ymax, screenPos.y); }
            }

            if (!onScreen || !isFinite(xmin + xmax + ymin + ymax)) return;

            const boxWidth = xmax - xmin;
            const boxHeight = ymax - ymin;

            CRC2d.save.apply(this.ctx, []);

            if (this.settings.espLines) {
                const startX = this.overlay.canvas.width / 2, startY = this.overlay.canvas.height, endX = xmin + boxWidth / 2, endY = ymax, trailColor = isBot ? this.settings.botColor : this.settings.espColor;
                const hexToRgba = (hex, alpha) => { let r=0,g=0,b=0; if (hex.length == 7) { r=parseInt(hex.slice(1,3),16); g=parseInt(hex.slice(3,5),16); b=parseInt(hex.slice(5,7),16); } return `rgba(${r},${g},${b},${alpha})`; };
                const gradient = this.ctx.createLinearGradient(startX, startY, endX, endY);
                gradient.addColorStop(0, hexToRgba(trailColor, 0.7)); gradient.addColorStop(1, hexToRgba(trailColor, 0));
                this.ctx.lineWidth = 2.5; this.ctx.strokeStyle = gradient; this.ctx.shadowColor = trailColor; this.ctx.shadowBlur = 15;
                CRC2d.beginPath.apply(this.ctx, []);
                CRC2d.moveTo.apply(this.ctx, [startX, startY]);
                CRC2d.lineTo.apply(this.ctx, [endX, endY]);
                CRC2d.stroke.apply(this.ctx, []);
            }

            if (this.settings.espSquare) {
                this.ctx.shadowColor = this.settings.boxColor; this.ctx.shadowBlur = 10; this.ctx.lineWidth = 1.5; this.ctx.strokeStyle = isBot ? this.settings.botColor : this.settings.boxColor;
                CRC2d.strokeRect.apply(this.ctx, [xmin, ymin, boxWidth, boxHeight]);
            }

            if (player.health && player.maxHealth) {
                const healthPercentage = Math.max(0, player.health / player.maxHealth);
                const barX = xmin - 7;
                const barY = ymin;
                const barWidth = 4;
                const barHeight = boxHeight;

                this.ctx.fillStyle = "rgba(0,0,0,0.5)";
                CRC2d.fillRect.apply(this.ctx, [barX, barY, barWidth, barHeight]);

                this.ctx.fillStyle = healthPercentage > 0.75 ? "#43A047" : healthPercentage > 0.4 ? "#FDD835" : "#E53935";
                CRC2d.fillRect.apply(this.ctx, [barX, barY + barHeight * (1-healthPercentage), barWidth, barHeight * healthPercentage]);

                const healthText = `♥ ${Math.round(player.health)}`;
                this.ctx.font = "bold 11px Rajdhani, sans-serif";
                this.ctx.textAlign = "right";
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.shadowColor = '#000000'; this.ctx.shadowBlur = 4;
                CRC2d.fillText.apply(this.ctx, [healthText, barX - 4, barY + 11]);
            }

            if (this.settings.espNameTags) {
                this.ctx.font = "bold 11px Rajdhani, sans-serif";
                this.ctx.textAlign = "left";

                const padding = 4;
                const iconHeight = 16;
                const borderRadius = 4;
                let iconWidth = 0;
                const hasWeapon = player.weapon && player.weapon.name;

                let weaponIcon = null;
                if (hasWeapon && this.settings.espWeaponIcons && player.weapon.icon) {
                    if (!this.weaponIconCache) this.weaponIconCache = {};
                    if (!this.weaponIconCache[player.weapon.melee ? 'melee_' : 'weapons_' + player.weapon.icon]) {
                        this.weaponIconCache[player.weapon.melee ? 'melee_' : 'weapons_' + player.weapon.icon] = new Image();
                        this.weaponIconCache[player.weapon.melee ? 'melee_' : 'weapons_' + player.weapon.icon].src = `https://assets.krunker.io/textures/${player.weapon.melee ? 'melee' : 'weapons'}/${player.weapon.icon}.png`;
                    }
                    weaponIcon = this.weaponIconCache[player.weapon.melee ? 'melee_' : 'weapons_' + player.weapon.icon];
                    if (weaponIcon.complete && weaponIcon.naturalWidth > 0) {
                        iconWidth = weaponIcon.width * (iconHeight / weaponIcon.height);
                    }
                }

                const namePart = isBot ? `[AI] ${player.name || 'Bot'}` : player.level ? `[LVL ${player.level}] ${player.name || 'Player'}` : `${player.name || 'Player'}`;
                const weaponPart = hasWeapon ? ` • ${player.weapon.name}` : '';
                const fullText = namePart + weaponPart;
                const fullTextWidth = this.ctx.measureText(fullText).width;

                const infoBoxWidth = fullTextWidth + (iconWidth > 0 ? iconWidth + padding : 0) + padding * 2;
                const infoBoxHeight = 20;
                const infoBoxX = (xmin + boxWidth / 2) - (infoBoxWidth / 2);
                const infoBoxY = ymin - infoBoxHeight - 5;

                if (this.settings.espInfoBackground) {
                    this.ctx.fillStyle = "rgba(25, 10, 30, 0.55)";
                    this.ctx.strokeStyle = isBot ? this.settings.botColor : this.settings.boxColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.shadowColor = isBot ? this.settings.botColor : this.settings.boxColor;
                    this.ctx.shadowBlur = 6;
                    CRC2d.beginPath.apply(this.ctx, []);
                    CRC2d.moveTo.apply(this.ctx, [infoBoxX + borderRadius, infoBoxY]);
                    CRC2d.lineTo.apply(this.ctx, [infoBoxX + infoBoxWidth - borderRadius, infoBoxY]);
                    CRC2d.arcTo.apply(this.ctx, [infoBoxX + infoBoxWidth, infoBoxY, infoBoxX + infoBoxWidth, infoBoxY + borderRadius, borderRadius]);
                    CRC2d.lineTo.apply(this.ctx, [infoBoxX + infoBoxWidth, infoBoxY + infoBoxHeight - borderRadius]);
                    CRC2d.arcTo.apply(this.ctx, [infoBoxX + infoBoxWidth, infoBoxY + infoBoxHeight, infoBoxX + infoBoxWidth - borderRadius, infoBoxY + infoBoxHeight, borderRadius]);
                    CRC2d.lineTo.apply(this.ctx, [infoBoxX + borderRadius, infoBoxY + infoBoxHeight]);
                    CRC2d.arcTo.apply(this.ctx, [infoBoxX, infoBoxY + infoBoxHeight, infoBoxX, infoBoxY + infoBoxHeight - borderRadius, borderRadius]);
                    CRC2d.lineTo.apply(this.ctx, [infoBoxX, infoBoxY + borderRadius]);
                    CRC2d.arcTo.apply(this.ctx, [infoBoxX, infoBoxY, infoBoxX + borderRadius, infoBoxY, borderRadius]);
                    CRC2d.closePath.apply(this.ctx, []);
                    CRC2d.fill.apply(this.ctx, []);
                    CRC2d.stroke.apply(this.ctx, []);
                }

                this.ctx.fillStyle = "#FFFFFF";
                if (this.settings.espInfoBackground) {
                    this.ctx.shadowColor = '#ff008080';
                    this.ctx.shadowBlur = 4;
                } else {
                    this.ctx.shadowColor = '#000000';
                    this.ctx.shadowBlur = 5;
                }
                CRC2d.fillText.apply(this.ctx, [fullText, infoBoxX + padding, infoBoxY + infoBoxHeight / 2 + 4]);

                if (weaponIcon && weaponIcon.complete && iconWidth > 0) {
                    const iconX = infoBoxX + padding + fullTextWidth + padding;
                    const iconY = infoBoxY + (infoBoxHeight - iconHeight) / 2;
                    this.ctx.drawImage(weaponIcon, iconX, iconY, iconWidth, iconHeight);
                }
                this.ctx.shadowBlur = 0;

                const distance = Math.round(this.getDistance(this.me, player) / 10);
                const distanceText = `[${distance}m]`;
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "#FFFFFF";
                this.ctx.shadowColor = '#000000'; this.ctx.shadowBlur = 4;
                CRC2d.fillText.apply(this.ctx, [distanceText, xmin + boxWidth / 2, ymax + 14]);
            }
            CRC2d.restore.apply(this.ctx, []);
        }
    }

    window[uniqueId] = new AimbaeShiro();

})('shiro_' + Math.random().toString(36).substring(2, 10), CanvasRenderingContext2D.prototype);
// ==UserScript==
// @name         Braains.io script
// @namespace    braains.io
// @description  fun project for my fellow players
// @version      2.5
// @author       John pork
// @match        https://www.modd.io/play/braainsio/*
// @match        https://www.modd.io/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561123/Braainsio%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/561123/Braainsio%20script.meta.js
// ==/UserScript==

/*John pork says have fun*/
(function () {
    'use strict';

    // STARTUP POPUP
    function createStartupPopup() {
        const popup = document.createElement('div');
        popup.id = 'startup-popup';
        popup.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 420px;
            background: #000;
            border: 3px solid #fff;
            border-radius: 8px;
            padding: 32px;
            z-index: 999999;
            box-shadow: 0 8px 40px rgba(0,0,0,0.95), inset 0 0 0 1px #333;
            text-align: center;
        `;

        popup.innerHTML = `
            <div style="font-size: 32px; color: #fff; font-weight: 900; margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase;">
                Client Side Script
            <div style="font-size: 18px; color: #888; margin-bottom: 28px; font-weight: 600;">
                Made by <span id="madeby-scribble"></span>
            </div>
            <div style="border-top: 2px solid #333; border-bottom: 2px solid #333; padding: 12px 0; margin-bottom: 24px;">
                <div style="font-size: 14px; color: #aaa; margin-bottom: 6px;">Press <strong style="color: #fff;">ESC</strong> to open control panel</div>
            </div>
            <button id="startup-close-btn" style="
                background: #fff;
                border: 2px solid #fff;
                color: #000;
                padding: 12px 32px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 700;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.2s;
            ">Start Playing</button>
        `;

        document.body.appendChild(popup);

        // 🔀 SCRIBBLE "Made by"
        const scribbleEl = document.getElementById('madeby-scribble');
        scribbleEl.textContent = 'John Pork';

        // ⬇️ KEEP ALL THIS AS-IS
        const closeBtn = document.getElementById('startup-close-btn');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#000';
            closeBtn.style.color = '#fff';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = '#fff';
            closeBtn.style.color = '#000';
        });
        closeBtn.onclick = () => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
            popup.style.transition = 'all 0.3s';
            setTimeout(() => popup.remove(), 300);
        };
    }

    // Check if startup UI is disabled
    const startupUIDisabled = localStorage.getItem('braains_disable_startup_ui') === 'true';

    // Show popup after short delay (only if not disabled)
    if (!startupUIDisabled) {
        setTimeout(createStartupPopup, 500);
    }

    // STATE
    let isPanelVisible = false;
    let antiBushEnabled = false, treeLayer = null;
    let minimapEnabled = true, hitboxEnabled = false, spinnerEnabled = false;
    let nameDisplayEnabled = false, keySpamEnabled = false;
    let autoSellEnabled = false, emoteSpamEnabled = false;
    let showHumans = true, showZombies = true, showCoins = true, showOtherItems = true;
    let showGems = true, showSG = true;
    let disableStartupUI = startupUIDisabled;

    let hitboxGraphics = null, nameGraphics = null, pillGraphics = null;
    let textObjects = new Map(), pillTexts = new Map(), loggedPlayers = new Set(), loggedItems = new Map();
    let humanCount = 0, zombieCount = 0, coinCount = 0, otherItemCount = 0;
    let gemCount = 0, sgCount = 0;
    let immunityDisplayEnabled = false;

    let spinAngle = 0, spinRadius = 150, spinSpeed = 0.15, spinAnimationFrame = null;
    let currentZoom = 1.0;
    const MIN_ZOOM = 0.1, MAX_ZOOM = 3.0, ZOOM_STEP = 0.05;

    let autoSellCycles = 0;
    const AUTOSELL_CONFIG = {
        CLICK_1_SCREEN_X: 600, CLICK_1_SCREEN_Y: 450,
        CLICK_2_SCREEN_X: 600, CLICK_2_SCREEN_Y: 250,
        CLICK_1_COUNT: 20, DELAY_BETWEEN_ACTIONS: 0,
        KEY_PRESS_DURATION: 5, HOLD_B_DURING_CLICKS: true, CYCLE_DELAY: 1
    };

    let emoteSpamCount = 0, currentEmoteIndex = 0, emoteSpamDelay = 500;
    const EMOTE_CONFIG = {
        EMOTES: [
            { id: 'emote-picker-1', name: 'Grr' }, { id: 'emote-picker-2', name: 'Boohoo' },
            { id: 'emote-picker-3', name: 'Stop' }, { id: 'emote-picker-4', name: 'Sorry' },
            { id: 'emote-picker-5', name: 'Haha' }, { id: 'emote-picker-6', name: 'Push!' },
            { id: 'emote-picker-7', name: 'Help!' }, { id: 'emote-picker-8', name: '<3' },
            { id: 'emote-picker-9', name: 'Im Muted' }
        ],
        LOOP_DELAY: 1000
    };

    let keySpamInterval = null, keySpamCount = 0, currentSpamKey = 'G';
    const KEY_SPAM_DELAY = 50;

    let MAP_WIDTH = 2300, MAP_HEIGHT = 4100, MAP_RATIO = MAP_WIDTH / MAP_HEIGHT;

    // AUTO-DETECT MAP DIMENSIONS
    function updateMapDimensions() {
        const mapData = window.taro?.map?.data;
        if (!mapData) return false;

        const mapTileWidth = mapData.width || 36;
        const mapTileHeight = mapData.height || 64;
        const tileSize = 64;

        MAP_WIDTH = mapTileWidth * tileSize;
        MAP_HEIGHT = mapTileHeight * tileSize;
        MAP_RATIO = MAP_WIDTH / MAP_HEIGHT;

        return true;
    }

    // HELPERS
    function getGameScene() {
        try {
            if (window.taro?.renderer?.scene) {
                return taro.renderer.scene.scenes.find(s => s.sys?.config?.key === 'Game');
            }
        } catch (e) {}
        return null;
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // TOGGLE STARTUP UI
    function toggleStartupUI() {
        disableStartupUI = !disableStartupUI;
        localStorage.setItem('braains_disable_startup_ui', disableStartupUI.toString());

        const btn = document.getElementById('startup-ui-btn');
        const state = document.getElementById('startup-ui-state');
        if (btn) btn.style.background = disableStartupUI ? '#fff' : '#000';
        if (btn) btn.style.color = disableStartupUI ? '#000' : '#fff';
        if (state) state.textContent = disableStartupUI ? 'OFF' : 'ON';
    }

    // ANTI-BUSH
    function findTreeLayer() {
        try {
            const scene = getGameScene();
            if (!scene) return null;
            const tilemaps = scene.children.list.filter(c => c.type === 'TilemapLayer');
            for (const tm of tilemaps) {
                if (tm.layer?.name === 'trees') return tm;
            }
        } catch (e) {}
        return null;
    }

    function toggleAntiBush() {
        antiBushEnabled = !antiBushEnabled;
        if (!treeLayer) treeLayer = findTreeLayer();
        if (treeLayer) {
            treeLayer.setVisible(!antiBushEnabled);
            treeLayer.setAlpha(antiBushEnabled ? 0 : 1);
        }
        const btn = document.getElementById('antibush-btn');
        const state = document.getElementById('antibush-state');
        if (btn) btn.style.background = antiBushEnabled ? '#fff' : '#000';
        if (btn) btn.style.color = antiBushEnabled ? '#000' : '#fff';
        if (state) state.textContent = antiBushEnabled ? 'ON' : 'OFF';
    }

    setInterval(() => {
        if (!treeLayer) {
            treeLayer = findTreeLayer();
            if (treeLayer && antiBushEnabled) {
                treeLayer.setVisible(false);
                treeLayer.setAlpha(0);
            }
        }
    }, 2000);

    // G+E KEY SPAMMER
    function pressSpamKey(key) {
        const keyCode = key.toUpperCase().charCodeAt(0);
        if (window.taro?.input?._state) {
            taro.input._state[keyCode] = true;
            setTimeout(() => {
                if (window.taro?.input?._state) taro.input._state[keyCode] = false;
            }, 10);
        }
    }

    function toggleKeySpam() {
        keySpamEnabled = !keySpamEnabled;

        if (keySpamEnabled) {
            keySpamCount = 0;
            keySpamInterval = setInterval(() => {
                if (!keySpamEnabled) return;
                pressSpamKey(currentSpamKey);
                currentSpamKey = currentSpamKey === 'G' ? 'E' : 'G';
                keySpamCount++;
                const c = document.getElementById('keyspam-count');
                const k = document.getElementById('keyspam-current');
                if (c) c.textContent = keySpamCount;
                if (k) k.textContent = currentSpamKey;
            }, KEY_SPAM_DELAY);
        } else {
            if (keySpamInterval) {
                clearInterval(keySpamInterval);
                keySpamInterval = null;
            }
            if (window.taro?.input?._state) {
                taro.input._state[71] = false;
                taro.input._state[69] = false;
            }
        }

        const btn = document.getElementById('keyspam-btn');
        const state = document.getElementById('keyspam-state');
        if (btn) btn.style.background = keySpamEnabled ? '#fff' : '#000';
        if (btn) btn.style.color = keySpamEnabled ? '#000' : '#fff';
        if (state) state.textContent = keySpamEnabled ? 'ON' : 'OFF';
    }

    // NAME DISPLAY
    function createNameGraphics() {
        const scene = getGameScene();
        if (!scene || nameGraphics) return;
        nameGraphics = scene.add.container();
        nameGraphics.setDepth(1000000);
    }

    // PILL/IMMUNITY DISPLAY
    function createPillGraphics() {
        const scene = getGameScene();
        if (!scene || pillGraphics) return;
        pillGraphics = scene.add.container();
        pillGraphics.setDepth(1000002);
    }

    function drawPillIndicators() {
        if (!immunityDisplayEnabled || !pillGraphics) {
            pillTexts.forEach(t => t?.destroy && t.destroy());
            pillTexts.clear();
            return;
        }

        const scene = getGameScene();
        if (!scene) return;

        try {
            const entities = window.taro?.entitiesToRender?.trackEntityById;
            if (!(entities instanceof Map)) return;

            const activePlayers = new Set();

            entities.forEach((entity, id) => {
                if (!entity?._alive || !entity._translate || entity._category !== 'unit') return;

                const type = entity._stats?.type;
                if (!['human', 'zombie', 'zombieKing'].includes(type)) return;

                const name = entity._stats?.name;
                if (!name || name.startsWith('AI ')) return;

                const immunityValue = entity._stats?.attributes?.immunity?.value || 0;

                if (immunityValue > 0) {
                    activePlayers.add(id);

                    const {x, y} = entity._translate;
                    let textObj = pillTexts.get(id);

                    let displayText = immunityValue === 1 ? 'pilled' : `pilled ${immunityValue}`;

                    if (!textObj) {
                        textObj = scene.add.text(x, y - 75, displayText, {
                            fontFamily: 'Arial', fontSize: '13px', fontStyle: 'bold',
                            color: '#222', stroke: '#fff', strokeThickness: 2,
                            backgroundColor: 'rgba(255,255,255,0.8)', padding: {x: 5, y: 2}
                        });
                        textObj.setOrigin(0.5, 0.5).setDepth(1000003);
                        pillGraphics.add(textObj);
                        pillTexts.set(id, textObj);
                    } else {
                        textObj.setText(displayText);
                        textObj.setPosition(x, y - 75);
                        textObj.setVisible(true);
                    }
                } else {
                    const textObj = pillTexts.get(id);
                    if (textObj) textObj.setVisible(false);
                }
            });

            pillTexts.forEach((textObj, id) => {
                if (!activePlayers.has(id)) {
                    textObj?.destroy && textObj.destroy();
                    pillTexts.delete(id);
                }
            });
        } catch (e) {}
    }

    function toggleImmunityDisplay() {
        immunityDisplayEnabled = !immunityDisplayEnabled;
        if (immunityDisplayEnabled && !pillGraphics) createPillGraphics();

        const btn = document.getElementById('immunity-btn');
        const state = document.getElementById('immunity-state');
        if (btn) btn.style.background = immunityDisplayEnabled ? '#fff' : '#000';
        if (btn) btn.style.color = immunityDisplayEnabled ? '#000' : '#fff';
        if (state) state.textContent = immunityDisplayEnabled ? 'ON' : 'OFF';
    }

    function drawPlayerNames() {
        if (!nameDisplayEnabled || !nameGraphics) {
            textObjects.forEach(t => t?.destroy && t.destroy());
            textObjects.clear();
            return;
        }

        const scene = getGameScene();
        if (!scene) return;

        try {
            const entities = window.taro?.entitiesToRender?.trackEntityById;
            if (!(entities instanceof Map)) return;

            const active = new Set();

            entities.forEach((entity, id) => {
                if (!entity?._alive || !entity._translate || entity._category !== 'unit') return;

                const type = entity._stats?.type;
                if (!['human', 'zombie', 'zombieKing'].includes(type)) return;

                const name = entity._stats?.name;
                if (!name || name.startsWith('AI ')) return;

                active.add(id);
                loggedPlayers.add(name);

                const {x, y} = entity._translate;
                let textObj = textObjects.get(id);

                if (!textObj) {
                    textObj = scene.add.text(x, y - 60, name, {
                        fontFamily: 'Arial', fontSize: '12px', fontStyle: 'bold',
                        color: '#fff', stroke: '#000', strokeThickness: 2,
                        backgroundColor: 'rgba(0,0,0,0.7)', padding: {x:4, y:2}
                    });
                    textObj.setOrigin(0.5, 0.5).setDepth(1000001);
                    nameGraphics.add(textObj);
                    textObjects.set(id, textObj);
                } else {
                    textObj.setPosition(x, y - 60).setVisible(true);
                }
            });

            textObjects.forEach((t, id) => {
                if (!active.has(id)) {
                    t?.destroy && t.destroy();
                    textObjects.delete(id);
                }
            });
        } catch (e) {}
    }

    function toggleNameDisplay() {
        nameDisplayEnabled = !nameDisplayEnabled;
        if (nameDisplayEnabled && !nameGraphics) createNameGraphics();

        const btn = document.getElementById('names-btn');
        const state = document.getElementById('names-state');
        if (btn) btn.style.background = nameDisplayEnabled ? '#fff' : '#000';
        if (btn) btn.style.color = nameDisplayEnabled ? '#000' : '#fff';
        if (state) state.textContent = nameDisplayEnabled ? 'ON' : 'OFF';
    }

    // MINIMAP DRAWING
    function drawMapBackground(ctx, w, h) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        const mapData = window.taro?.map?.data;
        if (!mapData) return;

        const mapW = mapData.width || 36, tileSize = 64;

        [
            { layer: 'trees', color: '#333' },
            { layer: 'walls', color: '#fff' }
        ].forEach(({layer, color}) => {
            const l = mapData.layers?.find(l => l.name === layer);
            if (l?.data) {
                ctx.fillStyle = color;
                l.data.forEach((id, idx) => {
                    if (id > 0) {
                        const tx = idx % mapW, ty = Math.floor(idx / mapW);
                        const wx = tx * tileSize, wy = ty * tileSize;
                        ctx.fillRect((wx/MAP_WIDTH)*w, (wy/MAP_HEIGHT)*h,
                                    (tileSize/MAP_WIDTH)*w, (tileSize/MAP_HEIGHT)*h);
                    }
                });
            }
        });
    }

    function drawEntitiesOnMinimap(ctx, w, h) {
        try {
            const entities = window.taro?.entitiesToRender?.trackEntityById;
            if (!(entities instanceof Map)) return;

            humanCount = 0; zombieCount = 0; coinCount = 0; otherItemCount = 0;
            gemCount = 0; sgCount = 0;

            entities.forEach((entity, id) => {
                if (!entity?._translate || !entity._alive) return;
                const {x: px, y: py} = entity._translate;
                const x = (px/MAP_WIDTH)*w, y = (py/MAP_HEIGHT)*h;

                // ITEMS
                if (entity._category === 'item') {
                    const name = entity._stats?.name;
                    const itemId = entity._stats?.itemTypeId;

                    // GEMS (Purple)
                    if (itemId === 'HoRkmdYOhT' && showGems) {
                        loggedItems.set(id, name || 'gem');
                        ctx.fillStyle = '#a020f0';  // Purple
                        ctx.beginPath();
                        ctx.arc(x, y, 2.5, 0, Math.PI*2);
                        ctx.fill();
                        gemCount++;
                    }
                    // SG (Dark Grey)
                    else if (itemId === 'd73qo6nov5' && showSG) {
                        loggedItems.set(id, name || 'sg');
                        ctx.fillStyle = '#333333';  // Dark grey
                        ctx.beginPath();
                        ctx.arc(x, y, 2.5, 0, Math.PI*2);
                        ctx.fill();
                        sgCount++;
                    }
                    // COINS
                    else if ((itemId === 'Z4vVSxpakD' || name === 'Modd-coin') && showCoins) {
                        loggedItems.set(id, name);
                        ctx.fillStyle = '#ffd700';
                        ctx.beginPath();
                        ctx.arc(x, y, 2.5, 0, Math.PI*2);
                        ctx.fill();
                        coinCount++;
                    }
                    // OTHER ITEMS
                    else if (showOtherItems) {
                        loggedItems.set(id, name || 'Unknown');
                        ctx.fillStyle = '#666';
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI*2);
                        ctx.fill();
                        otherItemCount++;
                    }
                    return;
                }

                // PLAYERS
                if (entity._category !== 'unit' || !entity.phaserEntity?.key) return;
                const type = entity._stats?.type;
                if (!['human', 'zombie', 'zombieKing'].includes(type)) return;

                const isZ = type === 'zombie' || type === 'zombieKing';

                if ((isZ && !showZombies) || (!isZ && !showHumans)) return;

                ctx.fillStyle = isZ ? '#ff0000' : '#00ff00';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI*2);
                ctx.fill();

                if (isZ) zombieCount++; else humanCount++;
            });

            ['human-count', 'zombie-count', 'coin-count', 'other-count', 'gem-count', 'sg-count'].forEach((sid, i) => {
                const el = document.getElementById(sid);
                if (el) el.textContent = [humanCount, zombieCount, coinCount, otherItemCount, gemCount, sgCount][i];
            });
        } catch (e) {}
    }

    // AUTO-SELL
    async function pressKey(key, dur = AUTOSELL_CONFIG.KEY_PRESS_DURATION) {
        const kc = key.toUpperCase().charCodeAt(0);
        if (window.taro?.input?._state) {
            taro.input._state[kc] = true;
            await sleep(dur);
            taro.input._state[kc] = false;
        }
    }

    async function holdKey(k) {
        const kc = k.toUpperCase().charCodeAt(0);
        if (window.taro?.input?._state) taro.input._state[kc] = true;
    }

    async function releaseKey(k) {
        const kc = k.toUpperCase().charCodeAt(0);
        if (window.taro?.input?._state) taro.input._state[kc] = false;
    }

    async function clickAtScreenPosition(sx, sy) {
        const el = document.elementFromPoint(sx, sy);
        if (!el) return false;

        if (el.tagName !== 'CANVAS') {
            el.click();
            const down = new MouseEvent('mousedown', {bubbles:true, clientX:sx, clientY:sy, button:0, buttons:1});
            el.dispatchEvent(down);
            await sleep(10);
            const up = new MouseEvent('mouseup', {bubbles:true, clientX:sx, clientY:sy, button:0, buttons:0});
            el.dispatchEvent(up);
            return true;
        }

        const scene = getGameScene();
        if (!scene?.sys?.canvas || !scene.cameras?.main) return false;
        const canvas = scene.sys.canvas, cam = scene.cameras.main;
        const wx = sx + cam.scrollX, wy = sy + cam.scrollY;

        if (window.taro?._mousePos) {
            taro._mousePos.x = wx;
            taro._mousePos.y = wy;
        }

        if (scene.input?.activePointer) {
            scene.input.activePointer.x = sx;
            scene.input.activePointer.y = sy;
            scene.input.activePointer.worldX = wx;
            scene.input.activePointer.worldY = wy;
        }

        const down = new MouseEvent('mousedown', {bubbles:true, clientX:sx, clientY:sy, button:0, buttons:1});
        canvas.dispatchEvent(down);
        await sleep(10);
        const up = new MouseEvent('mouseup', {bubbles:true, clientX:sx, clientY:sy, button:0, buttons:0});
        canvas.dispatchEvent(up);
        return true;
    }

    async function runAutoSellCycle() {
        try {
            if (AUTOSELL_CONFIG.HOLD_B_DURING_CLICKS) {
                await holdKey('b');
                await sleep(AUTOSELL_CONFIG.KEY_PRESS_DURATION);
            } else {
                await pressKey('b');
                await sleep(AUTOSELL_CONFIG.DELAY_BETWEEN_ACTIONS);
            }

            for (let i = 0; i < AUTOSELL_CONFIG.CLICK_1_COUNT; i++) {
                await clickAtScreenPosition(AUTOSELL_CONFIG.CLICK_1_SCREEN_X, AUTOSELL_CONFIG.CLICK_1_SCREEN_Y);
                await sleep(AUTOSELL_CONFIG.DELAY_BETWEEN_ACTIONS);
            }

            await clickAtScreenPosition(AUTOSELL_CONFIG.CLICK_2_SCREEN_X, AUTOSELL_CONFIG.CLICK_2_SCREEN_Y);
            await sleep(AUTOSELL_CONFIG.DELAY_BETWEEN_ACTIONS);

            if (AUTOSELL_CONFIG.HOLD_B_DURING_CLICKS) {
                await releaseKey('b');
                await sleep(AUTOSELL_CONFIG.DELAY_BETWEEN_ACTIONS);
            }

            await pressKey('g');
            await sleep(AUTOSELL_CONFIG.DELAY_BETWEEN_ACTIONS);

            autoSellCycles++;
            const c = document.getElementById('autosell-count');
            if (c) c.textContent = autoSellCycles;

            if (autoSellEnabled) setTimeout(() => runAutoSellCycle(), AUTOSELL_CONFIG.CYCLE_DELAY);
        } catch (e) {
            if (autoSellEnabled) setTimeout(() => runAutoSellCycle(), 500);
        }
    }

    function toggleAutoSell() {
        autoSellEnabled = !autoSellEnabled;
        if (autoSellEnabled) {
            autoSellCycles = 0;
            runAutoSellCycle();
        } else {
            ['b', 'g'].forEach(k => releaseKey(k));
        }
        const btn = document.getElementById('autosell-btn');
        const state = document.getElementById('autosell-state');
        if (btn) btn.style.background = autoSellEnabled ? '#fff' : '#000';
        if (btn) btn.style.color = autoSellEnabled ? '#000' : '#fff';
        if (state) state.textContent = autoSellEnabled ? 'ON' : 'OFF';
    }

    // EMOTE SPAM
    async function clickEmoteById(eid) {
        const el = document.getElementById(eid);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width/2, cy = r.top + r.height/2;
        ['pointerdown', 'pointerup', 'click'].forEach(t => {
            el.dispatchEvent(new PointerEvent(t, {bubbles:true, clientX:cx, clientY:cy, button:0, buttons:t==='pointerdown'?1:0, pointerId:1, pointerType:'mouse', isPrimary:true}));
        });
        return true;
    }

    async function runEmoteSpam() {
        while (emoteSpamEnabled) {
            await clickEmoteById(EMOTE_CONFIG.EMOTES[currentEmoteIndex].id);
            emoteSpamCount++;
            const cnt = document.getElementById('emote-count');
            const cur = document.getElementById('emote-current');
            if (cnt) cnt.textContent = emoteSpamCount;
            if (cur) cur.textContent = EMOTE_CONFIG.EMOTES[currentEmoteIndex].name;

            if (emoteSpamDelay > 0) await sleep(emoteSpamDelay);

            currentEmoteIndex++;
            if (currentEmoteIndex >= EMOTE_CONFIG.EMOTES.length) {
                currentEmoteIndex = 0;
                if (EMOTE_CONFIG.LOOP_DELAY > 0) await sleep(EMOTE_CONFIG.LOOP_DELAY);
            }
        }
    }

    function toggleEmoteSpam() {
        emoteSpamEnabled = !emoteSpamEnabled;
        if (emoteSpamEnabled) {
            currentEmoteIndex = 0;
            emoteSpamCount = 0;
            runEmoteSpam();
        }
        const btn = document.getElementById('emote-btn');
        const state = document.getElementById('emote-state');
        if (btn) btn.style.background = emoteSpamEnabled ? '#fff' : '#000';
        if (btn) btn.style.color = emoteSpamEnabled ? '#000' : '#fff';
        if (state) state.textContent = emoteSpamEnabled ? 'ON' : 'OFF';
    }

    // ZOOM
    function setZoom(z) {
        const cam = getGameScene()?.cameras?.main;
        if (!cam) return;
        currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
        cam.zoomTo(currentZoom, 100, 'Cubic.easeOut');
        const d = document.getElementById('zoom-display');
        const b = document.getElementById('zoom-bar');
        if (d) d.textContent = `${(currentZoom*100).toFixed(0)}%`;
        if (b) b.style.width = `${((currentZoom-MIN_ZOOM)/(MAX_ZOOM-MIN_ZOOM))*100}%`;
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === '=' || e.key === '+') { e.preventDefault(); setZoom(currentZoom + ZOOM_STEP); }
        else if (e.key === '-' || e.key === '_') { e.preventDefault(); setZoom(currentZoom - ZOOM_STEP); }
        else if (e.key === '0') { e.preventDefault(); setZoom(1.0); }
    });

    // MOUSE WHEEL ZOOM
    document.addEventListener('wheel', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.target.tagName === 'CANVAS' || e.target.closest('#panel') || e.target.closest('#minimap')) {
            return;
        }

        e.preventDefault();

        if (e.deltaY < 0) {
            setZoom(currentZoom + ZOOM_STEP);
        } else if (e.deltaY > 0) {
            setZoom(currentZoom - ZOOM_STEP);
        }
    }, { passive: false });

    // SPINNER
    function spinMouseLoop() {
        if (!spinnerEnabled) {
            if (spinAnimationFrame) cancelAnimationFrame(spinAnimationFrame);
            spinAnimationFrame = null;
            return;
        }

        const scene = getGameScene();
        if (!scene) {
            spinAnimationFrame = requestAnimationFrame(spinMouseLoop);
            return;
        }

        const cx = window.innerWidth/2, cy = window.innerHeight/2;
        const sx = cx + Math.cos(spinAngle)*spinRadius;
        const sy = cy + Math.sin(spinAngle)*spinRadius;
        spinAngle += spinSpeed;
        if (spinAngle > Math.PI*2) spinAngle -= Math.PI*2;

        const cam = scene.cameras.main;
        const wx = sx + (cam?.scrollX || 0);
        const wy = sy + (cam?.scrollY || 0);

        try {
            if (scene.input?.activePointer) {
                scene.input.activePointer.x = sx;
                scene.input.activePointer.y = sy;
                scene.input.activePointer.worldX = wx;
                scene.input.activePointer.worldY = wy;
            }
            if (scene.input?.mousePointer) {
                scene.input.mousePointer.x = sx;
                scene.input.mousePointer.y = sy;
                scene.input.mousePointer.worldX = wx;
                scene.input.mousePointer.worldY = wy;
            }
            if (window.taro?._mousePos) {
                taro._mousePos.x = wx;
                taro._mousePos.y = wy;
            }
        } catch (e) {}

        spinAnimationFrame = requestAnimationFrame(spinMouseLoop);
    }

    function toggleSpinner() {
        spinnerEnabled = !spinnerEnabled;
        spinAngle = 0;
        if (spinnerEnabled) spinMouseLoop();
        else if (spinAnimationFrame) {
            cancelAnimationFrame(spinAnimationFrame);
            spinAnimationFrame = null;
        }
        const btn = document.getElementById('spinner-btn');
        const state = document.getElementById('spinner-state');
        if (btn) btn.style.background = spinnerEnabled ? '#fff' : '#000';
        if (btn) btn.style.color = spinnerEnabled ? '#000' : '#fff';
        if (state) state.textContent = spinnerEnabled ? 'ON' : 'OFF';
    }

    // HITBOX
    function createHitboxGraphics() {
        const scene = getGameScene();
        if (!scene || hitboxGraphics) return;
        hitboxGraphics = scene.add.graphics();
        hitboxGraphics.setDepth(999999);
    }

    function drawHitbox() {
        if (!hitboxGraphics) return;
        hitboxGraphics.clear();
        if (!hitboxEnabled) return;

        try {
            const entities = window.taro?.entitiesToRender?.trackEntityById;
            if (!(entities instanceof Map)) return;

            entities.forEach((ent) => {
                if (!ent || ent._category !== 'unit' || !ent._alive || !ent.phaserEntity) return;
                const name = ent._stats?.name;
                if (!name || name.startsWith('AI ')) return;

                const go = ent.phaserEntity.gameObject;
                if (!go) return;

                hitboxGraphics.fillStyle(0xffffff, 0.2);
                hitboxGraphics.fillCircle(go.x, go.y, 20);
                hitboxGraphics.lineStyle(1, 0xffffff, 1);
                hitboxGraphics.strokeCircle(go.x, go.y, 20);
            });
        } catch (e) {}
    }

    function toggleHitbox() {
        hitboxEnabled = !hitboxEnabled;
        if (hitboxEnabled && !hitboxGraphics) createHitboxGraphics();
        else if (!hitboxEnabled && hitboxGraphics) hitboxGraphics.clear();

        const btn = document.getElementById('hitbox-btn');
        const state = document.getElementById('hitbox-state');
        if (btn) btn.style.background = hitboxEnabled ? '#fff' : '#000';
        if (btn) btn.style.color = hitboxEnabled ? '#000' : '#fff';
        if (state) state.textContent = hitboxEnabled ? 'ON' : 'OFF';
    }

    // MINIMAP
    function createMinimapElement() {
        if (document.getElementById('minimap')) return;

        if (!updateMapDimensions()) {
            setTimeout(createMinimapElement, 500);
            return;
        }

        const mh = 340, mw = Math.floor(mh * MAP_RATIO);
        const cont = document.createElement('div');
        cont.id = 'minimap';
        cont.style.cssText = `position:fixed;right:10px;bottom:80px;width:${mw}px;height:${mh}px;background:#000;border:2px solid #fff;padding:6px;z-index:99998;user-select:none;cursor:grab;display:flex;flex-direction:column;gap:4px;`;

        const header = document.createElement('div');
        header.style.cssText = `height:20px;line-height:20px;font-size:12px;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 6px;font-weight:700;`;
        header.innerHTML = `<span>MINIMAP</span><span style="font-size:11px;">ON</span>`;
        cont.appendChild(header);

        const canvas = document.createElement('canvas');
        canvas.id = 'minimap-canvas';
        canvas.width = mw - 15;
        canvas.height = mh - 36;
        canvas.style.cssText = 'width:100%;height:100%;background:#000;display:block;';
        cont.appendChild(canvas);

        document.body.appendChild(cont);

        let drag = false, dx = 0, dy = 0;
        header.addEventListener('mousedown', (e) => {
            drag = true;
            dx = e.clientX - cont.getBoundingClientRect().left;
            dy = e.clientY - cont.getBoundingClientRect().top;
            cont.style.cursor = 'grabbing';
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!drag) return;
            cont.style.right = 'auto';
            cont.style.bottom = 'auto';
            cont.style.left = (e.clientX - dx) + 'px';
            cont.style.top = (e.clientY - dy) + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (drag) {
                drag = false;
                cont.style.cursor = 'grab';
            }
        });
    }
    console.log("Made By Cpnl")

    // UI PANEL
    function createPanel() {
        if (document.getElementById('panel')) return;

        const ph = 240, pw = Math.floor(ph * MAP_RATIO);
        const panel = document.createElement('div');
        panel.id = 'panel';
        panel.style.cssText = `position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:680px;max-width:calc(100vw - 20px);max-height:calc(100vh - 20px);background:#000;border:2px solid #fff;padding:16px;z-index:99999;color:#fff;font-family:Arial,sans-serif;user-select:none;display:none;overflow-y:auto;font-size:11px;`;

        panel.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                <div style="font-weight:700;font-size:13px;color:#fff;">CONTROL PANEL</div>
                <button id="close-btn" style="background:#fff;border:1px solid #fff;padding:4px 10px;color:#000;cursor:pointer;font-weight:600;font-size:11px;">Close</button>
            </div>

            <div style="display:grid;grid-template-columns:1fr ${pw+16}px;gap:12px;">
                <div style="display:flex;flex-direction:column;gap:8px;overflow-y:auto;">
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        <button id="antibush-btn" class="btn">Anti-Bush: <span id="antibush-state">OFF</span></button>
                        <button id="minimap-btn" class="btn">Minimap: <span id="minimap-state">ON</span></button>
                        <button id="hitbox-btn" class="btn">Hitbox: <span id="hitbox-state">OFF</span></button>
                        <button id="spinner-btn" class="btn">Spinner: <span id="spinner-state">OFF</span></button>
                        <button id="autosell-btn" class="btn">Auto-Sell: <span id="autosell-state">OFF</span></button>
                        <button id="emote-btn" class="btn">Emote: <span id="emote-state">OFF</span></button>
                        <button id="names-btn" class="btn">Names: <span id="names-state">OFF</span></button>
                        <button id="immunity-btn" class="btn">Immunity: <span id="immunity-state">OFF</span></button>
                        <button id="keyspam-btn" class="btn">G+E Spam: <span id="keyspam-state">OFF</span></button>
                        <button id="startup-ui-btn" class="btn">Startup UI: <span id="startup-ui-state">${disableStartupUI ? 'OFF' : 'ON'}</span></button>
                    </div>

                    <div style="background:#111;padding:8px;border:1px solid #333;">
                        <div style="font-size:11px;color:#fff;margin-bottom:6px;font-weight:700;">G+E Spam</div>
                        <div style="font-size:10px;color:#888;margin-bottom:4px;">Key: <strong id="keyspam-current" style="color:#fff;">G</strong> | Count: <strong id="keyspam-count" style="color:#fff;">0</strong></div>
                    </div>

                    <div style="background:#111;padding:8px;border:1px solid #333;">
                        <div style="font-size:11px;color:#fff;margin-bottom:8px;font-weight:700;">Spinner</div>
                        <div style="margin-bottom:6px;">
                            <div style="display:flex;justify-content:space-between;font-size:10px;"><span>Radius</span><strong id="radius-val">${spinRadius}</strong></div>
                            <input id="radius-slider" type="range" min="50" max="300" value="${spinRadius}" style="width:100%;margin-top:4px;">
                        </div>
                        <div>
                            <div style="display:flex;justify-content:space-between;font-size:10px;"><span>Speed</span><strong id="speed-val">${spinSpeed.toFixed(2)}</strong></div>
                            <input id="speed-slider" type="range" min="0.02" max="0.6" step="0.01" value="${spinSpeed}" style="width:100%;margin-top:4px;">
                        </div>
                    </div>

                    <div style="background:#111;padding:8px;border:1px solid #333;">
                        <div style="font-size:11px;color:#fff;margin-bottom:6px;font-weight:700;">Stats</div>
                        <div style="font-size:10px;">Sell: <strong id="autosell-count">0</strong> | Emote: <strong id="emote-count">0</strong></div>
                        <div style="font-size:10px;margin-top:4px;">Current: <strong id="emote-current">-</strong></div>
                        <div style="margin-top:6px;">
                            <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;"><span>Delay (ms)</span><strong id="emote-delay-val">${emoteSpamDelay}</strong></div>
                            <input id="emote-delay-slider" type="range" min="50" max="2000" step="50" value="${emoteSpamDelay}" style="width:100%;">
                        </div>
                    </div>

                    <div style="background:#111;padding:8px;border:1px solid #333;">
                        <div style="font-size:11px;color:#fff;margin-bottom:6px;font-weight:700;">Zoom</div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-size:10px;">Level</span><strong id="zoom-display" style="font-size:10px;">100%</strong></div>
                        <div style="background:#222;height:6px;overflow:hidden;"><div id="zoom-bar" style="background:#fff;height:100%;width:50%;"></div></div>
                        <div style="font-size:9px;color:#666;margin-top:4px;">Mouse wheel or +/- keys | 0 to reset</div>
                    </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:8px;">
                    <div style="background:#111;padding:8px;border:1px solid #333;">
                        <div style="font-size:11px;color:#fff;font-weight:700;margin-bottom:6px;">Map Preview</div>
                        <canvas id="preview-canvas" width="${pw}" height="${ph}" style="width:100%;background:#000;margin-bottom:6px;"></canvas>

                        <div style="font-size:10px;color:#fff;font-weight:700;margin-bottom:4px;">Filters</div>
                        <div style="display:flex;flex-direction:column;gap:4px;">
                            <button id="filter-humans" style="background:#fff;border:1px solid #fff;color:#000;padding:4px;cursor:pointer;font-size:10px;font-weight:600;">HUMANS</button>
                            <button id="filter-zombies" style="background:#fff;border:1px solid #fff;color:#000;padding:4px;cursor:pointer;font-size:10px;font-weight:600;">ZOMBIES</button>
                            <button id="filter-gems" style="background:#fff;border:1px solid #fff;color:#000;padding:4px;cursor:pointer;font-size:10px;font-weight:600;">GEMS</button>
                            <button id="filter-sg" style="background:#fff;border:1px solid #fff;color:#000;padding:4px;cursor:pointer;font-size:10px;font-weight:600;">SG</button>
                            <button id="filter-coins" style="background:#fff;border:1px solid #fff;color:#000;padding:4px;cursor:pointer;font-size:10px;font-weight:600;">COINS</button>
                            <button id="filter-other" style="background:#fff;border:1px solid #fff;color:#000;padding:4px;cursor:pointer;font-size:10px;font-weight:600;">OTHER</button>
                        </div>

                        <div style="margin-top:8px;padding-top:6px;border-top:1px solid #333;">
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;font-size:9px;color:#888;">
                                <div>H: <strong id="human-count" style="color:#fff;">0</strong></div>
                                <div>Z: <strong id="zombie-count" style="color:#fff;">0</strong></div>
                                <div>G: <strong id="gem-count" style="color:#a020f0;">0</strong></div>
                                <div>S: <strong id="sg-count" style="color:#777;">0</strong></div>
                                <div>C: <strong id="coin-count" style="color:#ffd700;">0</strong></div>
                                <div>O: <strong id="other-count" style="color:#fff;">0</strong></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .btn {
                    background:#000;
                    color:#fff;
                    border:1px solid #fff;
                    padding:6px 10px;
                    cursor:pointer;
                    font-weight:600;
                    font-size:10px;
                    transition:all .1s;
                }
                .btn:hover {
                    background:#222;
                }
            </style>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('close-btn').onclick = () => togglePanelVisibility(false);
        document.getElementById('antibush-btn').onclick = toggleAntiBush;
        document.getElementById('minimap-btn').onclick = () => {
            minimapEnabled = !minimapEnabled;
            const c = document.getElementById('minimap');
            if (c) c.style.display = minimapEnabled ? 'flex' : 'none';
            const s = document.getElementById('minimap-state');
            if (s) s.textContent = minimapEnabled ? 'ON' : 'OFF';
        };
        document.getElementById('hitbox-btn').onclick = toggleHitbox;
        document.getElementById('spinner-btn').onclick = toggleSpinner;
        document.getElementById('autosell-btn').onclick = toggleAutoSell;
        document.getElementById('emote-btn').onclick = toggleEmoteSpam;
        document.getElementById('names-btn').onclick = toggleNameDisplay;
        document.getElementById('immunity-btn').onclick = toggleImmunityDisplay;
        document.getElementById('keyspam-btn').onclick = toggleKeySpam;
        document.getElementById('startup-ui-btn').onclick = toggleStartupUI;

        // Initialize startup UI button styling
        const startupBtn = document.getElementById('startup-ui-btn');
        if (startupBtn) {
            startupBtn.style.background = disableStartupUI ? '#fff' : '#000';
            startupBtn.style.color = disableStartupUI ? '#000' : '#fff';
        }

        document.getElementById('radius-slider').oninput = (e) => {
            spinRadius = parseInt(e.target.value);
            document.getElementById('radius-val').textContent = spinRadius;
        };
        document.getElementById('speed-slider').oninput = (e) => {
            spinSpeed = parseFloat(e.target.value);
            document.getElementById('speed-val').textContent = spinSpeed.toFixed(2);
        };
        document.getElementById('emote-delay-slider').oninput = (e) => {
            emoteSpamDelay = parseInt(e.target.value);
            document.getElementById('emote-delay-val').textContent = emoteSpamDelay;
        };

        document.getElementById('filter-humans').onclick = () => {
            showHumans = !showHumans;
            const b = document.getElementById('filter-humans');
            b.style.opacity = showHumans ? '1' : '0.3';
        };
        document.getElementById('filter-zombies').onclick = () => {
            showZombies = !showZombies;
            const b = document.getElementById('filter-zombies');
            b.style.opacity = showZombies ? '1' : '0.3';
        };
        document.getElementById('filter-gems').onclick = () => {
            showGems = !showGems;
            const b = document.getElementById('filter-gems');
            b.style.opacity = showGems ? '1' : '0.3';
        };
        document.getElementById('filter-sg').onclick = () => {
            showSG = !showSG;
            const b = document.getElementById('filter-sg');
            b.style.opacity = showSG ? '1' : '0.3';
        };
        document.getElementById('filter-coins').onclick = () => {
            showCoins = !showCoins;
            const b = document.getElementById('filter-coins');
            b.style.opacity = showCoins ? '1' : '0.3';
        };
        document.getElementById('filter-other').onclick = () => {
            showOtherItems = !showOtherItems;
            const b = document.getElementById('filter-other');
            b.style.opacity = showOtherItems ? '1' : '0.3';
        };
    }

    function togglePanelVisibility(force) {
        const p = document.getElementById('panel');
        if (!p) return;
        isPanelVisible = typeof force === 'boolean' ? force : !isPanelVisible;
        p.style.display = isPanelVisible ? 'block' : 'none';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!document.getElementById('panel')) createPanel();
            togglePanelVisibility();
            e.preventDefault();
        }
    }, true);

    // MAIN LOOPS
    function startLoops() {
        function loop() {
            try {
                const prev = document.getElementById('preview-canvas');
                if (prev && isPanelVisible) {
                    const ctx = prev.getContext('2d');
                    ctx.clearRect(0, 0, prev.width, prev.height);
                    drawMapBackground(ctx, prev.width, prev.height);
                    drawEntitiesOnMinimap(ctx, prev.width, prev.height);
                }

                const main = document.getElementById('minimap-canvas');
                if (main && minimapEnabled) {
                    const ctx = main.getContext('2d');
                    ctx.clearRect(0, 0, main.width, main.height);
                    drawMapBackground(ctx, main.width, main.height);
                    drawEntitiesOnMinimap(ctx, main.width, main.height);
                }
            } catch (e) {}
            requestAnimationFrame(loop);
        }
        loop();

        const scene = getGameScene();
        if (scene) {
            scene.events.on('postupdate', () => {
                drawPlayerNames();
                drawHitbox();
                drawPillIndicators();
            });
        } else {
            setTimeout(() => {
                const s = getGameScene();
                if (s) {
                    s.events.on('postupdate', () => {
                        drawPlayerNames();
                        drawHitbox();
                        drawPillIndicators();
                    });
                }
            }, 1000);
        }
    }

    // INIT
    (function init() {
        function tryInit() {
            if (!window.taro?.map?.data) {
                setTimeout(tryInit, 500);
                return;
            }

            updateMapDimensions();
            createPanel();
            createMinimapElement();
            createNameGraphics();
            createPillGraphics();
            createHitboxGraphics();
            startLoops();
        }
        tryInit();
    })();
})();
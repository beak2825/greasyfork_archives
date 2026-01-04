// ==UserScript==
// @name         Hoai An Dev
// @namespace    http://tampermonkey.net/
// @version      beta 1.1
// @description  A lot of things are fixed and many new features are added, Enhanced ESP with dynamic colors, aimbot, FPS unlock + menu with Render/Player/World/Binds/cam tabs, im not like the others ima keep yall updated and if you need me to fix something or need me to add something please tell me, i really think this is fun.
// @author       Huu Tien ✘ Cheat - Modded by Hoai An dev
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://sf-static.upanhlaylink.com/img/image_2025123199ed9d4ef01bf14e45fdd96df2b10612.jpg
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_addStyle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/561324/Hoai%20An%20Dev.user.js
// @updateURL https://update.greasyfork.org/scripts/561324/Hoai%20An%20Dev.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MAX_FPS = 1000;
    window.requestAnimationFrame = mdwap => setTimeout(mdwap, 1000 / MAX_FPS);

    const defaultSettings = {
        aimbotEnabled: true,
        aimbotOnKey: true,
        aimbotActivationButton: 'right',
        aimbotCustomBind: 'None',
        espEnabled: true,
        espLines: true,
        wireframe: false,
        charmsEnabled: true,
        charmsColor: '#ff00ff',
        charmsOpacity: 1,
        fogEnabled: false,
        fogDistance: 500,
        fogColor: '#000000',
        closeAimDistance: 0,
        aimHeight: 3.3,
        criticalHeight: 10,
        standingHeight: 10,
        fovAngle: 150,
        espLineColor: '#ff0000',
        espBoxColor: '#ff0000',
        espBoxColorMode: 'dynamic',
        espLineColorMode: 'dynamic',
        charmsColorMode: 'rgb',
        espBoxTransitionDistance: 170,
        espLineTransitionDistance: 170,
        rainbowSpeed: 20,
        rgbColors: ['#ff0000', '#00ff00', '#0000ff'],
        espBoxColors: ['#ff0000', '#ffff00', '#00ff00'],
        espLineColors: ['#ff0000', '#ffff00', '#00ff00'],
        aimbotPrioritizationMode: 'locked',
        cam: {
            x: 0,
            y: 0,
            z: 0
        }
    };

    const defaultKeyBinds = {
        aimbotEnabled: 'KeyK',
        aimbotOnKey: 'KeyF',
        espEnabled: 'KeyM',
        espLines: 'KeyN',
        wireframe: 'KeyJ',
        charmsEnabled: 'KeyP',
        toggleMenu: 'KeyO'
    };

    let settings = { ...defaultSettings };
    let keyBinds = { ...defaultKeyBinds };
    let guiEl, overlayEl;
    let myController = null;
    let colorIndex = 0;
    let colorProgress = 0;
    let currentTarget = null;
    let leftDown = false;
    let customKeyDown = false;

    async function loadSettings() {
        const savedSettings = await GM.getValue('settings');
        const savedKeyBinds = await GM.getValue('keyBinds');

        if (savedSettings) Object.assign(settings, savedSettings);
        if (savedKeyBinds) Object.assign(keyBinds, savedKeyBinds);

        if (!settings.espBoxColors) settings.espBoxColors = [...defaultSettings.espBoxColors];
        if (!settings.espLineColors) settings.espLineColors = [...defaultSettings.espLineColors];
    }

    async function saveSettings() {
        await GM.setValue('settings', settings);
        await GM.setValue('keyBinds', keyBinds);
    }

    function fromHtml(html) {
        const tpl = document.createElement('template');
        tpl.innerHTML = html.trim();
        return tpl.content.firstChild;
    }

    function toggleSetting(key) {
        settings[key] = !settings[key];
        updateGUI();
        if (key.startsWith('fog')) updateFog();
        saveSettings();
    }

    function updateGUI() {
        if (!guiEl) return;
        guiEl.querySelectorAll('.krkUI-item').forEach(item => {
            const k = item.dataset.setting;
            if (k) item.classList.toggle('krkUI-item-active', settings[k]);
        });
    }

    function showOverlay() {
        if (!overlayEl) {
            overlayEl = document.createElement('div');
            overlayEl.id = 'krkUI-overlay';
            Object.assign(overlayEl.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: 9998,
                cursor: 'pointer'
            });
            overlayEl.addEventListener('click', e => {
                e.stopPropagation();
                hideGUI();
            });
            document.body.appendChild(overlayEl);
        }
        overlayEl.style.display = 'block';
    }

    function hideOverlay() {
        if (overlayEl) overlayEl.style.display = 'none';
    }

    function createGUI() {
        if (guiEl) {
            guiEl.style.display = 'flex';
            showOverlay();
            updateGUI();
            return;
        }

        const renderSettings = {
            espEnabled: 'Box ESP',
            espLines: 'Line ESP',
            wireframe: 'Wireframe',
            charmsEnabled: 'Charms'
        };

        const playerSettings = {
            aimbotEnabled: 'Aimbot',
            aimbotOnKey: 'Aimbot On Key',
            aimbotPrioritization: 'Aimbot Prioritization'
        };

        const bindLabels = {
            aimbotEnabled: 'Toggle Aimbot',
            aimbotOnKey: 'Aimbot Activation',
            espEnabled: 'Toggle ESP',
            espLines: 'Toggle Line ESP',
            wireframe: 'Toggle Wireframe',
            charmsEnabled: 'Toggle Charms',
            toggleMenu: 'Toggle Menu'
        };

        let currentTab = 'Render';
        const tabLabels = ['Render', 'Player', 'World', 'Binds', 'Cam'];

        guiEl = fromHtml(`
            <div class="krkUI" id="krkUI">
                <div class="krkUI-tabs">
                    ${tabLabels.map(tab => `
                        <div class="krkUI-tab ${tab === 'Render' ? 'krkUI-tab-active' : ''}"
                             data-tab="${tab}">${tab}</div>
                    `).join('')}
                </div>
                <div class="krkUI-content"></div>
            </div>
        `);

        const tabs = guiEl.querySelectorAll('.krkUI-tab');
        const content = guiEl.querySelector('.krkUI-content');

        function renderMenu() {
            content.innerHTML = '';
            if (currentTab === 'Render') {
                for (const [k, label] of Object.entries(renderSettings)) {
                    let html;
                    if (k === 'espEnabled' || k === 'espLines') {
                        const isBox = k === 'espEnabled';
                        const colors = isBox ? settings.espBoxColors : settings.espLineColors;
                        const colorMode = isBox ? settings.espBoxColorMode : settings.espLineColorMode;
                        const transitionDist = isBox ?
                            settings.espBoxTransitionDistance :
                            settings.espLineTransitionDistance;

                        html = `
                            <div class="krkUI-item" data-setting="${k}">
                                <div class="menuItemTitle" style="display: flex; align-items: center; justify-content: space-between;">
                                    <span>${label}</span>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <input type="color" value="${isBox ? settings.espBoxColor : settings.espLineColor}"
                                            style="${colorMode === 'dynamic' ? 'display:none' : ''}"
                                            class="color-input">
                                        <div class="dynamic-controls" style="display: ${colorMode === 'dynamic' ? 'flex' : 'none'}; gap: 4px; align-items: center;">
                                            <div class="dynamic-colors" style="display: flex; gap: 4px;">
                                                ${colors.map((color, i) => `
                                                    <input type="color" class="dynamic-color" value="${color}" data-index="${i}">
                                                `).join('')}
                                            </div>
                                            <input type="number" value="${transitionDist}"
                                                min="1" max="500" step="1"
                                                class="transition-input"
                                                placeholder="170">
                                        </div>
                                        <button class="mode-switch ${colorMode === 'dynamic' ? 'dynamic' : ''}">
                                            ${colorMode === 'dynamic' ? 'DYN' : 'FIX'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    } else if (k === 'charmsEnabled') {
                        html = `
                            <div class="krkUI-item" data-setting="${k}">
                                <div class="menuItemTitle" style="display: flex; align-items: center; justify-content: space-between;">
                                    <span>${label}</span>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <input type="color" value="${settings.charmsColor}"
                                            style="${settings.charmsColorMode === 'fixed' ? '' : 'display:none'}">
                                        <div class="rgb-controls" style="display: ${settings.charmsColorMode === 'rgb' ? 'flex' : 'none'}; gap: 4px;">
                                            ${settings.rgbColors.map((color, i) => `
                                                <input type="color" class="rgb-color" value="${color}" data-index="${i}">
                                            `).join('')}
                                        </div>
                                        <div class="speed-control" style="display: ${settings.charmsColorMode === 'rgb' ? 'flex' : 'none'}; align-items: center; gap: 2px;">
                                            <input type="number" value="${settings.rainbowSpeed}" min="1" max="20"
                                                style="width: 40px; text-align: center;" class="speed-input">
                                            <div class="arrow-stack">
                                                <button class="speed-btn">▲</button>
                                                <button class="speed-btn">▼</button>
                                            </div>
                                        </div>
                                        <button class="mode-switch ${settings.charmsColorMode === 'rgb' ? 'dynamic' : ''}">
                                            ${settings.charmsColorMode === 'fixed' ? 'FIX' : 'RGB'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        html = `
                            <div class="krkUI-item" data-setting="${k}">
                                <div class="menuItemTitle">${label}</div>
                            </div>
                        `;
                    }

                    const it = fromHtml(html);
                    it.querySelector('.menuItemTitle').addEventListener('click', e => {
                        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
                        e.stopPropagation();
                        toggleSetting(k);
                    });

                    if (k === 'espEnabled' || k === 'espLines') {
                        const isBox = k === 'espEnabled';
                        const colorPicker = it.querySelector('.color-input');
                        const dynamicControls = it.querySelector('.dynamic-controls');
                        const transitionInput = it.querySelector('.transition-input');
                        const modeSwitch = it.querySelector('.mode-switch');
                        const dynamicColors = it.querySelectorAll('.dynamic-color');

                        modeSwitch.addEventListener('click', e => {
                            e.stopPropagation();
                            const newMode = isBox ?
                                (settings.espBoxColorMode === 'fixed' ? 'dynamic' : 'fixed') :
                                (settings.espLineColorMode === 'fixed' ? 'dynamic' : 'fixed');

                            if (isBox) settings.espBoxColorMode = newMode;
                            else settings.espLineColorMode = newMode;

                            colorPicker.style.display = newMode === 'dynamic' ? 'none' : 'block';
                            dynamicControls.style.display = newMode === 'dynamic' ? 'flex' : 'none';
                            modeSwitch.textContent = newMode === 'dynamic' ? 'DYN' : 'FIX';
                            modeSwitch.classList.toggle('dynamic', newMode === 'dynamic');
                            saveSettings();
                        });

                        transitionInput.addEventListener('input', e => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                                const clamped = Math.max(1, Math.min(value, 500));
                                if (isBox) settings.espBoxTransitionDistance = clamped;
                                else settings.espLineTransitionDistance = clamped;
                                saveSettings();
                            }
                        });

                        dynamicColors.forEach(input => {
                            input.addEventListener('input', e => {
                                const idx = parseInt(e.target.dataset.index);
                                if (isBox) {
                                    settings.espBoxColors[idx] = e.target.value;
                                } else {
                                    settings.espLineColors[idx] = e.target.value;
                                }
                                saveSettings();
                            });
                        });
                    } else if (k === 'charmsEnabled') {
                        const colorPicker = it.querySelector('input[type="color"]');
                        const modeSwitch = it.querySelector('.mode-switch');
                        const speedInput = it.querySelector('.speed-input');
                        const speedUp = it.querySelector('.speed-btn:first-child');
                        const speedDown = it.querySelector('.speed-btn:last-child');
                        const speedControl = it.querySelector('.speed-control');
                        const rgbControls = it.querySelector('.rgb-controls');

                        modeSwitch.addEventListener('click', e => {
                            settings.charmsColorMode = settings.charmsColorMode === 'fixed' ? 'rgb' : 'fixed';
                            colorPicker.style.display = settings.charmsColorMode === 'fixed' ? 'block' : 'none';
                            rgbControls.style.display = settings.charmsColorMode === 'rgb' ? 'flex' : 'none';
                            speedControl.style.display = settings.charmsColorMode === 'rgb' ? 'flex' : 'none';
                            modeSwitch.textContent = settings.charmsColorMode === 'fixed' ? 'FIX' : 'RGB';
                            modeSwitch.classList.toggle('dynamic', settings.charmsColorMode === 'rgb');
                            saveSettings();
                        });

                        speedUp.addEventListener('click', e => {
                            e.stopPropagation();
                            settings.rainbowSpeed = Math.min(20, settings.rainbowSpeed + 1);
                            speedInput.value = settings.rainbowSpeed;
                            saveSettings();
                        });

                        speedDown.addEventListener('click', e => {
                            e.stopPropagation();
                            settings.rainbowSpeed = Math.max(1, settings.rainbowSpeed - 1);
                            speedInput.value = settings.rainbowSpeed;
                            saveSettings();
                        });

                        speedInput.addEventListener('input', e => {
                            let value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                                value = Math.min(20, Math.max(1, value));
                                settings.rainbowSpeed = value;
                                e.target.value = value;
                                saveSettings();
                            }
                        });

                        colorPicker.addEventListener('input', e => {
                            settings.charmsColor = e.target.value;
                            saveSettings();
                        });

                        it.querySelectorAll('.rgb-color').forEach(input => {
                            input.addEventListener('input', e => {
                                const idx = parseInt(e.target.dataset.index);
                                settings.rgbColors[idx] = e.target.value;
                                saveSettings();
                            });
                        });
                    }
                    content.appendChild(it);
                }

                const op = fromHtml(`<div class="krkUI-item"><div class="menuItemTitle">Charms Opacity: ${settings.charmsOpacity.toFixed(1)}</div><input type="range" id="charmsOpacitySlider" min="0" max="1" step="0.1" value="${settings.charmsOpacity}" style="width:100%;"></div>`);
                const opLabel = op.querySelector('.menuItemTitle');
                op.querySelector('#charmsOpacitySlider').addEventListener('input', e => {
                    settings.charmsOpacity = +e.target.value;
                    opLabel.textContent = `Charms Opacity: ${settings.charmsOpacity.toFixed(1)}`;
                    saveSettings();
                });
                content.appendChild(op);
            } else if (currentTab === 'Player') {
                for (const [k, label] of Object.entries(playerSettings)) {
                    if (k === 'aimbotPrioritization') {
                        const it = fromHtml(`
                            <div class="krkUI-item" data-setting="${k}">
                                <div class="menuItemTitle">
                                    ${label}: ${settings.aimbotPrioritizationMode.toUpperCase()}
                                </div>
                            </div>
                        `);
                        it.addEventListener('click', e => {
                            e.stopPropagation();
                            settings.aimbotPrioritizationMode =
                                settings.aimbotPrioritizationMode === 'locked' ? 'open' : 'locked';
                            it.querySelector('.menuItemTitle').textContent =
                                `${label}: ${settings.aimbotPrioritizationMode.toUpperCase()}`;
                            saveSettings();
                        });
                        content.appendChild(it);
                        continue;
                    }

                    if (k === 'aimbotOnKey') {
                        const currentMode = settings.aimbotActivationButton;
                        const it = fromHtml(`
                            <div class="krkUI-item" data-setting="${k}">
                                <div class="menuItemTitle" style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>${label}:</span>
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        ${settings.aimbotActivationButton === 'binded' ? `
                                            <button class="bind-button" style="width: 80px;">
                                                ${settings.aimbotCustomBind === 'None' ? 'Bind' : settings.aimbotCustomBind}
                                            </button>
                                        ` : ''}
                                        <button class="mode-switch" style="width: 80px;">
                                            ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `);

                        const modeButton = it.querySelector('.mode-switch');
                        const bindButton = it.querySelector('.bind-button');

                        modeButton.addEventListener('click', e => {
                            e.stopPropagation();
                            const modes = ['right', 'left', 'binded'];
                            const currentIndex = modes.indexOf(settings.aimbotActivationButton);
                            settings.aimbotActivationButton = modes[(currentIndex + 1) % 3];

                            if (settings.aimbotActivationButton !== 'binded') {
                                settings.aimbotCustomBind = 'None';
                            }

                            modeButton.textContent = settings.aimbotActivationButton.charAt(0).toUpperCase() +
                                settings.aimbotActivationButton.slice(1);

                            saveSettings();
                            renderMenu();
                        });

                        if (bindButton) {
                            bindButton.addEventListener('click', e => {
                                e.stopPropagation();
                                bindButton.textContent = 'Press key...';

                                const handleKeyPress = event => {
                                    event.preventDefault();
                                    document.removeEventListener('keydown', handleKeyPress);

                                    if (event.code === 'Escape') {
                                        settings.aimbotCustomBind = 'None';
                                    } else {
                                        settings.aimbotCustomBind = eventCodeToKey(event.code);
                                    }

                                    bindButton.textContent = settings.aimbotCustomBind;
                                    saveSettings();
                                };

                                document.addEventListener('keydown', handleKeyPress, { once: true });
                            });
                        }

                        content.appendChild(it);
                        continue;
                    }

                    const it = fromHtml(`<div class="krkUI-item" data-setting="${k}"><div class="menuItemTitle">${label}</div></div>`);
                    it.addEventListener('click', e => {
                        e.stopPropagation();
                        toggleSetting(k);
                    });
                    content.appendChild(it);
                }

                const hW = fromHtml(`<div class="krkUI-item"><div id="aimHeightLabel" class="menuItemTitle">Aim Height: ${settings.aimHeight}</div><input type="range" id="aimHeightSlider" min="-10" max="20" step="0.1" value="${settings.aimHeight}" style="width:100%;"></div>`);
                const aL = hW.querySelector('#aimHeightLabel');
                const aS = hW.querySelector('#aimHeightSlider');
                aS.addEventListener('input', e => {
                    settings.aimHeight = +e.target.value;
                    aL.textContent = `Aim Height: ${settings.aimHeight}`;
                    saveSettings();
                });
                content.appendChild(hW);

                const standH = fromHtml(`<div class="krkUI-item"><div id="standingHeightLabel" class="menuItemTitle">Standing Height: ${settings.standingHeight}</div><input type="range" id="standingHeightSlider" min="10" max="20" step="0.1" value="${settings.standingHeight}" style="width:100%;"></div>`);
                const standLabel = standH.querySelector('#standingHeightLabel');
                const standSlider = standH.querySelector('#standingHeightSlider');
                standSlider.addEventListener('input', e => {
                    settings.standingHeight = +e.target.value;
                    standLabel.textContent = `Standing Height: ${settings.standingHeight}`;
                    saveSettings();
                });
                content.appendChild(standH);

                const critH = fromHtml(`<div class="krkUI-item"><div id="criticalHeightLabel" class="menuItemTitle">Critical Height: ${settings.criticalHeight}</div><input type="range" id="criticalHeightSlider" min="0" max="20" step="0.1" value="${settings.criticalHeight}" style="width:100%;"></div>`);
                const critLabel = critH.querySelector('#criticalHeightLabel');
                const critSlider = critH.querySelector('#criticalHeightSlider');
                critSlider.addEventListener('input', e => {
                    settings.criticalHeight = +e.target.value;
                    critLabel.textContent = `Critical Height: ${settings.criticalHeight}`;
                    saveSettings();
                });
                content.appendChild(critH);

                const fW = fromHtml(`<div class="krkUI-item"><div id="fovLabel" class="menuItemTitle">FOV Angle: ${settings.fovAngle}</div><input type="range" id="fovSlider" min="1" max="360" step="1" value="${settings.fovAngle}" style="width:100%;"></div>`);
                const fL = fW.querySelector('#fovLabel');
                const fS = fW.querySelector('#fovSlider');
                fS.addEventListener('input', e => {
                    settings.fovAngle = +e.target.value;
                    fL.textContent = `FOV Angle: ${settings.fovAngle}`;
                    saveSettings();
                });
                content.appendChild(fW);

                const cAim = fromHtml(`<div class="krkUI-item"><div id="closeAimLabel" class="menuItemTitle">Close Aim Distance: ${settings.closeAimDistance}</div><input type="range" id="closeAimSlider" min="0" max="100" step="0.1" value="${settings.closeAimDistance}" style="width:100%;"></div>`);
                const cALabel = cAim.querySelector('#closeAimLabel');
                const cASlider = cAim.querySelector('#closeAimSlider');
                cASlider.addEventListener('input', e => {
                    settings.closeAimDistance = +e.target.value;
                    cALabel.textContent = `Close Aim Distance: ${settings.closeAimDistance}`;
                    saveSettings();
                });
                content.appendChild(cAim);
            } else if (currentTab === 'World') {
                const ft = fromHtml(`
                    <div class="krkUI-item" data-setting="fogEnabled">
                        <div class="menuItemTitle" style="display: flex; align-items: center; justify-content: space-between;">
                            <span>Fog</span>
                            <input type="color" value="${settings.fogColor}">
                        </div>
                    </div>
                `);
                const colorPicker = ft.querySelector('input[type="color"]');
                colorPicker.addEventListener('input', e => {
                    settings.fogColor = e.target.value;
                    updateFog();
                    saveSettings();
                });
                ft.addEventListener('click', (e) => {
                    if (!e.target.closest('input[type="color"]')) toggleSetting('fogEnabled');
                });
                content.appendChild(ft);

                const dw = fromHtml(`<div class="krkUI-item"><div class="menuItemTitle">Fog Distance: ${settings.fogDistance}</div><input type="range" id="fogDistanceSlider" min="1" max="500" value="${settings.fogDistance}" style="width:100%;"></div>`);
                const dwL = dw.querySelector('.menuItemTitle');
                dw.querySelector('#fogDistanceSlider').addEventListener('input', e => {
                    settings.fogDistance = +e.target.value;
                    dwL.textContent = `Fog Distance: ${settings.fogDistance}`;
                    updateFog();
                    saveSettings();
                });
                content.appendChild(dw);
            } else if (currentTab === 'Binds') {
                Object.entries(bindLabels).forEach(([action, label]) => {
                    const currentKey = keyBinds[action] ? eventCodeToKey(keyBinds[action]) : 'None';
                    const row = fromHtml(`
                        <div class="krkUI-item">
                            <div class="menuItemTitle" style="display: flex; justify-content: space-between; align-items: center;">
                                <span>${label}</span>
                                <span class="current-key">${currentKey}</span>
                            </div>
                        </div>
                    `);

                    const keyDisplay = row.querySelector('.current-key');

                    row.addEventListener('click', (e) => {
                        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;

                        keyDisplay.textContent = 'Choose Bind';
                        keyDisplay.classList.add('changing');

                        const handleKeyPress = (event) => {
                            event.preventDefault();
                            keyDisplay.classList.remove('changing');

                            if (event.code === 'Escape') {
                                keyBinds[action] = '';
                                keyDisplay.textContent = 'None';
                                saveSettings();
                                return;
                            }

                            Object.keys(keyBinds).forEach(k => {
                                if (keyBinds[k] === event.code) delete keyBinds[k];
                            });

                            keyBinds[action] = event.code;
                            keyDisplay.textContent = eventCodeToKey(event.code);
                            saveSettings();
                        };

                        document.addEventListener('keydown', handleKeyPress, { once: true });
                    });

                    content.appendChild(row);
                });
            } else if (currentTab === 'Cam') {
                const camSettings = [
                    { key: 'x', label: 'X Position', min: -50, max: 50 },
                    { key: 'y', label: 'Y Position', min: -50, max: 50 },
                    { key: 'z', label: 'Z Position', min: -50, max: 50 }
                ];

                camSettings.forEach(({ key, label, min, max }) => {
                    const item = fromHtml(`
                        <div class="cam-container">
                            <div class="cam-title" style="display: flex; justify-content: space-between; align-items: center;">
                                <span>${label}</span>
                                <input type="number"
                                       value="${settings.cam[key]}"
                                       min="${min}"
                                       max="${max}"
                                       step="0.1"
                                       style="width: 100px; margin-left: 10px;"
                                       class="cam-input">
                            </div>
                        </div>
                    `);

                    const input = item.querySelector('input');
                    input.addEventListener('input', e => {
                        settings.cam[key] = parseFloat(e.target.value) || 0;
                        saveSettings();
                    });

                    content.appendChild(item);
                });

                const resetButton = fromHtml(`
                    <div class="krkUI-item" style="margin-top: 15px;">
                        <div class="menuItemTitle" style="text-align: center; color: #ff6666 !important;">
                            Reset Camera Position
                        </div>
                    </div>
                `);

                resetButton.addEventListener('click', () => {
                    settings.cam.x = 0;
                    settings.cam.y = 0;
                    settings.cam.z = 0;
                    saveSettings();
                    renderMenu();
                });

                content.appendChild(resetButton);
            }
            updateGUI();
        }

        tabs.forEach(btn => btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabs.forEach(b => b.classList.toggle('krkUI-tab-active', b === btn));
            currentTab = tab;
            renderMenu();
        }));

        document.body.appendChild(guiEl);
        guiEl.style.display = 'flex';
        showOverlay();
        renderMenu();
    }

    function hideGUI() {
        if (guiEl) guiEl.style.display = 'none';
        hideOverlay();
    }

    function createMenuButton() {
        let c = document.getElementById('menuItemContainer');
        if (!c) {
            c = document.createElement('div');
            c.id = 'menuItemContainer';
            Object.assign(c.style, {
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 9999
            });
            document.body.appendChild(c);
        }

        const btn = fromHtml(`
            <div class="menuItem menuItem1">
                <img src="https://i.pinimg.com/originals/54/2b/9e/542b9e472a4bf8fff355af5761011ce9.gif" width="80" height="80" style="margin:-10px 0 0">
                <div class="menuItemTitle menuItemTitle1" style="font-size:15px;">Tool</div>
                <div class="menuItemTitle menuItemTitle1" style="margin-top:-35px;font-size:15px;">Sphere</div>
            </div>
        `);
        btn.addEventListener('click', e => {
            e.stopPropagation();
            createGUI();
        });
        c.appendChild(btn);
    }

    document.addEventListener('keydown', e => {
        Object.entries(keyBinds).forEach(([action, keyCode]) => {
            if (e.code === keyCode) {
                if (action === 'toggleMenu') {
                    if (guiEl && guiEl.style.display === 'flex') {
                        hideGUI();
                    } else {
                        createGUI();
                    }
                } else {
                    toggleSetting(action);
                }
            }
        });

        if (settings.aimbotActivationButton === 'binded' && settings.aimbotCustomBind !== 'None') {
            if (e.code === keyBinds.aimbotCustomBind) {
                customKeyDown = true;
            }
        }
    });

    document.addEventListener('keyup', e => {
        if (settings.aimbotActivationButton === 'binded' && settings.aimbotCustomBind !== 'None') {
            if (e.code === keyBinds.aimbotCustomBind) {
                customKeyDown = false;
                currentTarget = null;
            }
        }
    });

    window.addEventListener('pointerdown', e => {
        if (settings.aimbotActivationButton === 'right' && e.button === 2) {
            leftDown = true;
        } else if (settings.aimbotActivationButton === 'left' && e.button === 0) {
            leftDown = true;
        }
    });

    window.addEventListener('pointerup', e => {
        if ((settings.aimbotActivationButton === 'right' && e.button === 2) ||
            (settings.aimbotActivationButton === 'left' && e.button === 0)) {
            leftDown = false;
            currentTarget = null;
        }
    });

    const sceneData = { scene: null };
    const tempVec = new THREE.Vector3();
    const tempObj = new THREE.Object3D();
    tempObj.rotation.order = 'YXZ';

    const boxGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 15, 5).translate(0, 7.5, 0));
    const lineMat = new THREE.LineBasicMaterial({ color: settings.espLineColor, depthTest: false, depthWrite: false, transparent: true });
    const boxMat = new THREE.LineBasicMaterial({ color: settings.espBoxColor, depthTest: false, depthWrite: false, transparent: true });
    const lineSeg = new THREE.LineSegments(new THREE.BufferGeometry(), lineMat.clone());
    lineSeg.frustumCulled = false;
    const linePos = new THREE.BufferAttribute(new Float32Array(1200), 3);
    lineSeg.geometry.setAttribute('position', linePos);

    function hookScene() {
        const orig = Array.prototype.push;
        Array.prototype.push = function(...items) {
            for (const o of items) {
                if (o?.parent?.type === 'Scene' && o.parent.name === 'Main') {
                    sceneData.scene = o.parent;
                    Array.prototype.push = orig;
                    break;
                }
            }
            return orig.apply(this, items);
        };
    }

    function updateFog() {
        if (!sceneData.scene) return;
        sceneData.scene.fog = settings.fogEnabled ?
            new THREE.Fog(new THREE.Color(settings.fogColor), 0, settings.fogDistance) :
            null;
    }

    function getProximityColor(dist, type) {
        const maxDistance = type === 'box' ?
            settings.espBoxTransitionDistance :
            settings.espLineTransitionDistance;
        const colors = type === 'box' ? settings.espBoxColors : settings.espLineColors;
        const ratio = Math.min(dist / maxDistance, 1);

        const segment = ratio * (colors.length - 1);
        const index = Math.floor(segment);
        const localRatio = segment - index;

        const color1 = new THREE.Color(colors[index]);
        const color2 = new THREE.Color(colors[Math.min(index + 1, colors.length - 1)]);
        return `#${color1.clone().lerp(color2, localRatio).getHexString()}`;
    }

    function updateRainbowCharms() {
        if (!settings.charmsEnabled || settings.charmsColorMode !== 'rgb') return;

        colorProgress += (0.001 * settings.rainbowSpeed);
        if (colorProgress >= 1) {
            colorProgress = 0;
            colorIndex = (colorIndex + 1) % settings.rgbColors.length;
        }

        const currentColor = new THREE.Color(settings.rgbColors[colorIndex]);
        const nextColor = new THREE.Color(settings.rgbColors[(colorIndex + 1) % settings.rgbColors.length]);

        const interpolatedColor = currentColor.clone().lerp(nextColor, colorProgress);
        settings.charmsColor = `#${interpolatedColor.getHexString()}`;
    }

    function animate() {
        requestAnimationFrame(animate);
        updateRainbowCharms();

        if (!sceneData.scene) {
            hookScene();
            return;
        }

        const scene = sceneData.scene;
        scene.traverse(o => {
            if (o.isMesh && o.material) o.material.wireframe = settings.wireframe;
        });

        let players = [];
        myController = null;
        scene.children.forEach(c => {
            if (c.type === 'Object3D') {
                try {
                    if (c.children[0].children[0].type === 'PerspectiveCamera') {
                        myController = c;
                    } else {
                        const bbox = new THREE.Box3().setFromObject(c);
                        const size = new THREE.Vector3();
                        bbox.getSize(size);
                        if (size.y > settings.criticalHeight) {
                            players.push(c);
                        }
                    }
                } catch {}
            }
        });

        if (!myController) {
            sceneData.scene = null;
            return;
        }

        if (currentTarget && (!players.includes(currentTarget) ||
           (settings.aimbotActivationButton === 'binded' ? !customKeyDown : !leftDown))) {
            currentTarget = null;
        }

        const allPlayers = [...players, myController];

        let count = 0;
        const closeList = [];
        const fovList = [];
        const now = performance.now();

        allPlayers.forEach(p => {
            if (p.position.x === myController.position.x &&
                p.position.z === myController.position.z) {
                if (p.box) p.box.visible = false;
                return;
            }

            if (settings.charmsEnabled) {
                try {
                    let headFound = false;
                    p.traverse(child => {
                        if (child.name === 'head') headFound = true;
                    });

                    if (headFound) {
                        const bodyModel = p.children[0];
                        const mat = bodyModel.children[0].material;
                        const col = new THREE.Color(settings.charmsColor);

                        mat.transparent = true;
                        mat.fog = false;
                        mat.color.copy(col);
                        mat.emissive.copy(col);
                        mat.depthTest = !settings.espEnabled;
                        mat.depthWrite = false;
                        mat.opacity = settings.charmsOpacity;

                        if (settings.charmsColorMode === 'rgb') {
                            mat.emissiveIntensity = 1.5;
                            mat.needsUpdate = true;
                        }
                    }
                } catch {}
            }

            const dx = p.position.x - myController.position.x;
            const dz = p.position.z - myController.position.z;
            const horizontalDist = Math.sqrt(dx * dx + dz * dz);
            const dist = p.position.distanceTo(myController.position);

            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(myController.quaternion).normalize();
            const toP = new THREE.Vector3().subVectors(p.position, myController.position).normalize();
            const angle = forward.angleTo(toP) * (180 / Math.PI);

            if (settings.espEnabled) {
                if (!p.box) {
                    p.box = new THREE.LineSegments(boxGeo, boxMat.clone());
                    p.box.frustumCulled = false;
                    p.add(p.box);
                }
                p.box.visible = true;
                const color = settings.espBoxColorMode === 'dynamic' ?
                    getProximityColor(dist, 'box') : settings.espBoxColor;
                p.box.material.color.set(color);
            } else if (p.box) {
                p.box.visible = false;
            }

            if (settings.espLines) {
                if (!p._espLine) {
                    const geom = new THREE.BufferGeometry();
                    geom.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, -5, 0, 0, 0], 3));
                    p._espLineMat = new THREE.LineBasicMaterial({
                        color: settings.espLineColor,
                        depthTest: false,
                        depthWrite: false,
                        transparent: true
                    });
                    p._espLine = new THREE.LineSegments(geom, p._espLineMat);
                    p._espLine.frustumCulled = false;
                    p._espLine.userData = {
                        isEspLine: true,
                        lastUpdate: now
                    };
                    myController.add(p._espLine);
                }

                const v = p.position.clone();
                v.y += settings.aimHeight;
                v.applyMatrix4(new THREE.Matrix4().copy(myController.matrix).invert());

                const arr = p._espLine.geometry.attributes.position.array;
                arr[3] = v.x;
                arr[4] = v.y;
                arr[5] = v.z;
                p._espLine.geometry.attributes.position.needsUpdate = true;
                p._espLine.userData.lastUpdate = now;

                const col = settings.espLineColorMode === 'dynamic' ?
                    getProximityColor(dist, 'line') : settings.espLineColor;
                p._espLineMat.color.set(col);
                p._espLine.visible = true;
            } else if (p._espLine) {
                p._espLine.visible = false;
            }

            if (horizontalDist <= settings.closeAimDistance) {
                closeList.push({ p, dist: horizontalDist });
            } else if (angle <= settings.fovAngle / 2) {
                fovList.push({ p, dist });
            }
        });

        if (myController) {
            const activeLines = new Set();
            players.forEach(p => {
                if (p._espLine) activeLines.add(p._espLine);
            });

            myController.children.slice().forEach(child => {
                if (child.userData?.isEspLine) {
                    const isActive = activeLines.has(child);
                    const isStale = (now - child.userData.lastUpdate) > 2000;

                    if (!isActive || isStale) {
                        myController.remove(child);
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) child.material.dispose();
                    }
                }
            });
        }

        if (settings.espLines) {
            if (lineSeg.parent !== myController) {
                myController.add(lineSeg);
            }
            lineSeg.visible = true;
            lineSeg.geometry.setDrawRange(0, count);
            linePos.needsUpdate = true;
        } else if (lineSeg.parent === myController) {
            lineSeg.visible = false;
        }

        const candidates = closeList.length ? closeList : fovList;
        const activationCondition = settings.aimbotActivationButton === 'binded' ?
            customKeyDown : leftDown;

        if (candidates.length && settings.aimbotEnabled &&
            (!settings.aimbotOnKey || activationCondition)) {
            let tgt = null;

            if (settings.aimbotPrioritizationMode === 'locked' && currentTarget) {
                tgt = currentTarget;
            } else {
                candidates.sort((a, b) => a.dist - b.dist);
                tgt = candidates[0]?.p;

                if (tgt && settings.aimbotPrioritizationMode === 'locked') {
                    currentTarget = tgt;
                }
            }

            if (!tgt) return;

            tempVec.setScalar(0);
            tgt.children[0].children[0].localToWorld(tempVec);

            const bbox = new THREE.Box3().setFromObject(tgt);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const standingHeight = settings.standingHeight;
            const currentHeight = size.y;
            const heightRatio = currentHeight / standingHeight;
            const adjustedAimHeight = settings.aimHeight * heightRatio;

            tempVec.y += adjustedAimHeight;

            tempObj.position.copy(myController.position);
            tempObj.lookAt(tempVec);
            myController.children[0].rotation.x = -tempObj.rotation.x;
            myController.rotation.y = tempObj.rotation.y + Math.PI;
        }

        // Apply camera position adjustments
        if (myController && myController.children[0]) {
            myController.children[0].position.set(
                settings.cam.x,
                settings.cam.y,
                settings.cam.z
            );
        }
    }

    GM_addStyle(`
        .krkUI {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            display: none;
            flex-direction: column;
            font: 16px monospace;
            color: #fff;
            width: 420px;
            user-select: none;
            border: 3px solid #fff;
            background: radial-gradient(circle at center, #2a0033, #1a0033);
            animation: krkUIGlow 2s infinite ease-in-out;
            border-radius: 16px;
            overflow: hidden;
            transition: color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
        }

        .krkUI * {
            transition: color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
        }

        .krkUI-tabs {
            display: flex;
            justify-content: space-around;
            background: #3a003f;
            border-bottom: 2px solid #a020f0;
        }

        .krkUI-tab {
            padding: 8px 10px;
            cursor: pointer;
            color: #fff;
            flex: 1;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.3s;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .krkUI-tab:hover {
            background: #5c007a;
        }

        .krkUI-tab-active {
            background: #a020f0;
            color: #fff;
        }

        /* === Hover Effect for Active Items === */
        .krkUI-item-active:hover {
            background: rgba(160, 32, 240, 0.4) !important;
        }

        .krkUI-content {
            display: flex;
            flex-direction: column;
            padding: 10px;
        }

        .krkUI-item {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px;
            margin-bottom: 6px;
            transition: all 0.3s;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
        }

        .krkUI-item:hover {
            background: rgba(225, 182, 252, 0.15);
        }

        .krkUI-item-active {
            background: rgba(160, 32, 240, 0.25) !important;
        }

        .krkUI-item-active .menuItemTitle {
            color: #a020f0 !important;
            text-shadow: 0 0 8px #a020f0;
        }

        .menuItemTitle {
            font-weight: bold;
            margin-top: 6px;
            color: #fff;
            font-size: 14px;
            width: 100%;
            transition: color 0.4s ease, text-shadow 0.4s ease;
        }

        input[type="color"] {
            background: #2a0033;
            border: 2px solid #a020f0 !important;
            border-radius: 4px;
            padding: 2px;
            outline: none;
            box-shadow: 0 0 8px rgba(160, 32, 240, 0.5);
            min-height: 30px;
        }

        .cam-container {
          width: 100%;
          margin-bottom: 8px;
        }

        .cam-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .cam-title span {
           padding-left: 4px;
           margin-right: auto;
        }

        /* Remove button-like styles from inputs */
        .cam-container .cam-input {
           background: #2a0033;
           border: 2px solid #a020f0;
           color: #fff;
           padding: 6px;
           border-radius: 4px;
           width: 100px;
           margin-left: 10px;
           transition: none;
        }

        .cam-container .cam-input:hover,
        .cam-container .cam-input:focus {
           background: #2a0033;
           box-shadow: 0 0 8px #a020f0;
        }

        /* Remove hover effects from container */
        .cam-container:hover {
            background: transparent !important;
        }

        .mode-switch {
            position: relative;
            width: 80px;
            height: 26px;
            border: 2px solid #a020f0;
            border-radius: 15px;
            background: #2a0033;
            cursor: pointer;
            color: #fff;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .mode-switch.dynamic {
            color: #a020f0 !important;
            text-shadow: 0 0 12px #a020f0 !important;
        }

        .mode-switch:hover {
            background: #3a003f;
        }

        .bind-button {
            background: #3a003f;
            border: 2px solid #a020f0;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 12px;
            text-align: center;
        }

        .bind-button:hover {
            background: #5c007a;
        }

        .krkUI-item input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #444;
            box-shadow: 0 0 8px #a020f0;
        }

        .krkUI-item input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #a020f0;
            box-shadow: 0 0 12px #a020f0;
            cursor: pointer;
            margin-top: -5px;
        }

        .transition-input {
            width: 70px !important;
            background: #2a0033;
            border: 2px solid #a020f0;
            border-radius: 4px;
            color: #fff;
            padding: 2px 5px;
            font-size: 14px;
        }

        .dynamic-colors {
            display: flex;
            gap: 4px;
        }

        .dynamic-colors input[type="color"] {
            width: 40px;
            height: 30px;
            padding: 1px;
            border-radius: 4px;
        }

        .current-key {
            min-width: 60px;
            text-align: center;
            transition: all 0.3s;
            color: #fff;
        }

        .krkUI-item .menuItemTitle .current-key.changing {
            color: #a020f0 !important;
            text-shadow: 0 0 8px #a020f0 !important;
        }

        /* === Aimbot Prioritization Exception === */
        .krkUI-item[data-setting="aimbotPrioritization"],
        .krkUI-item[data-setting="aimbotPrioritization"].krkUI-item-active {
            background: rgba(255, 255, 255, 0.05) !important;
            transition: background 0.3s ease !important;
        }

        .krkUI-item[data-setting="aimbotPrioritization"]:hover {
            background: rgba(225, 182, 252, 0.15) !important;
        }

        .krkUI-item[data-setting="aimbotPrioritization"] .menuItemTitle,
        .krkUI-item[data-setting="aimbotPrioritization"].krkUI-item-active .menuItemTitle {
            background: transparent !important;
            text-shadow: none !important;
            color: #fff !important;
        }

        .rgb-controls input[type="color"] {
            width: 30px;
            height: 24px;
            padding: 1px;
            border-radius: 3px;
        }

        .speed-input {
            width: 50px !important;
            background: #2a0033;
            border: 1px solid #a020f0;
            color: #fff;
            padding: 2px 5px;
            font-size: 14px;
            border-radius: 4px;
            -moz-appearance: textfield;
        }

        .speed-btn {
            background: #3a003f;
            border: none;
            color: #fff;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
            height: 12px;
            width: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            transition: all 0.2s;
        }

        .speed-btn:hover {
            background: #5c007a;
        }

        .arrow-stack {
            display: flex;
            flex-direction: column;
            gap: 1px;
            margin-left: 2px;
        }

        .cam-input {
            background: #2a0033;
            border: 2px solid #a020f0;
            color: #fff;
            padding: 4px;
            border-radius: 4px;
            text-align: center;
        }

        .cam-input:focus {
            outline: none;
            box-shadow: 0 0 8px #a020f0;
        }

         /* === Override global gray for menu text === */
        .krkUI .menuItemTitle,
        .krkUI .menuItemTitle span,
        .krkUI .cam-title,
        .krkUI .cam-title span {
            color: #fff !important;
        }

        .krkUI-item.krkUI-item-active .menuItemTitle,
        .krkUI-item.krkUI-item-active .menuItemTitle span,
        .krkUI-item.krkUI-item-active .cam-title,
        .krkUI-item.krkUI-item-active .cam-title span {
            color: #a020f0 !important;
            text-shadow: 0 0 8px #a020f0 !important;
        }

        @keyframes krkUIGlow {
            0%, 100% { box-shadow: 0 0 12px #8a2be2; }
            50% { box-shadow: 0 0 24px #8a2be2; }
        }
    `);

    (async () => {
        await loadSettings();
        setTimeout(() => {
            hookScene();
            animate();
            createMenuButton();
        }, 3000);
    })();
})();

function eventCodeToKey(code) {
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    if (code.startsWith('Arrow')) return code.slice(5);
    return code;
}
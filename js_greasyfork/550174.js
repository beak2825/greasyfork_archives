// ==UserScript==
// @name         AmbAssist - All-in-One
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A consolidated userscript for all AmbAssist utilities, managed by a central settings panel.
// @author       AMBiSCA [2662550]
// @license      MIT
// @match        https://www.torn.com/*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/550174/AmbAssist%20-%20All-in-One.user.js
// @updateURL https://update.greasyfork.org/scripts/550174/AmbAssist%20-%20All-in-One.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================
    // Main AmbAssist Controller & Shared Logic
    // ===================================================================

    const amb = {
        settings: {
            apiKey: '',
            channelId: '',
            enabled: {
                bank: true,
                target: true,
                inspector: true,
                war: true,
                brother: true,
            },
            buttonOrder: ['bank', 'inspector', 'war', 'brother', 'target']
        },

        modules: {},

        loadSettings: function() {
            const savedSettings = GM_getValue('ambassist_settings', this.settings);
            this.settings = { ...this.settings, ...savedSettings };
        },

        saveSettings: function() {
            GM_setValue('ambassist_settings', this.settings);
        },

        init: function() {
            this.loadSettings();
            this.styles.inject();
            this.buttons.init();
            this.settings.buttonOrder.forEach(key => {
                if (this.settings.enabled[key] && this.modules[key] && typeof this.modules[key].init === 'function') {
                    this.modules[key].init();
                }
            });
        },

        // ===================================================================
        // Shared Utilities
        // ===================================================================
        utils: {
            dragElement: function(elmnt) {
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                const header = document.getElementById(elmnt.id + "-header");
                if (header) header.onmousedown = dragMouseDown;
                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }
                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    const parentOverlay = elmnt.parentNode;
                    let newTop = elmnt.offsetTop - pos2;
                    let newLeft = elmnt.offsetLeft - pos1;
                    if (newTop < 0) newTop = 0;
                    if (newLeft < 0) newLeft = 0;
                    if (newTop + elmnt.offsetHeight > parentOverlay.clientHeight) newTop = parentOverlay.clientHeight - elmnt.offsetHeight;
                    if (newLeft + elmnt.offsetWidth > parentOverlay.clientWidth) newLeft = parentOverlay.clientWidth - elmnt.offsetWidth;
                    elmnt.style.top = newTop + "px";
                    elmnt.style.left = newLeft + "px";
                }
                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            },
            isMobileDevice: function() {
                return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent || navigator.vendor || window.opera);
            }
        },

        // ===================================================================
        // Button Manager
        // ===================================================================
        buttons: {
            definitions: {
                bank: {
                    id: 'amb-bank-icon',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="24" height="24" viewBox="0 0 512 481.75"><path fill="#ccc" d="M11.18 166.57 246.07 0l236.1 166.57H11.18zm414.96 156.44-5.39-24.71c23.12 4.31 60.2 51.38 72.19 72.78 6.12 10.92 11.48 22.96 15.86 36.41 8.75 32.55.33 63-34.99 70.09-22.13 4.46-63.4 4.77-86.66 3.56-25.03-1.28-63.74-1.25-73.86-26.94-16.31-41.46 13.58-90.85 40.85-121.09 3.6-3.98 7.32-7.68 11.14-11.11 9.92-8.72 20.62-19.08 33.39-23.38l-12.34 22.96 17.92-23.75h9.42l12.47 25.18zm-11.53 19.59v6.95c4.58.49 8.52 1.43 11.79 2.83 3.29 1.42 6.14 3.55 8.59 6.43 1.93 2.19 3.42 4.44 4.47 6.74 1.05 2.33 1.58 4.43 1.58 6.36 0 2.15-.79 4.02-2.35 5.57-1.57 1.56-3.46 2.35-5.69 2.35-4.21 0-6.95-2.28-8.18-6.82-1.43-5.35-4.83-8.92-10.21-10.68v26.72c5.3 1.45 9.55 2.79 12.69 3.99 3.15 1.19 5.98 2.92 8.46 5.2 2.65 2.35 4.71 5.17 6.16 8.44 1.42 3.29 2.14 6.86 2.14 10.76 0 4.89-1.13 9.45-3.43 13.7-2.31 4.28-5.68 7.74-10.13 10.46-4.48 2.7-9.76 4.3-15.89 4.8v16c0 2.52-.25 4.37-.75 5.53-.49 1.16-1.56 1.73-3.25 1.73-1.53 0-2.6-.46-3.24-1.4-.62-.95-.92-2.42-.92-4.39v-17.34c-5-.54-9.38-1.73-13.13-3.53-3.75-1.79-6.89-4.03-9.39-6.71-2.49-2.69-4.36-5.48-5.54-8.35-1.21-2.89-1.8-5.74-1.8-8.53 0 2.03.79-3.9 2.41-5.54 1.6-1.64 3.6-2.48 5.99-2.48 1.93 0 3.55.44 4.88 1.34 1.32.9 2.24 2.17 2.77 3.79 1.14 3.51 2.15 6.21 3 8.07.88 1.86 2.17 3.57 3.9 5.11 1.73 1.53 4.04 2.71 6.91 3.53v-29.86c-5.75-1.6-10.53-3.35-14.38-5.3-3.86-1.96-7-4.72-9.38-8.31-2.39-3.6-3.6-8.22-3.6-13.88 0-7.36 2.35-13.41 7.04-18.11 4.69-4.71 11.46-7.45 20.32-8.22v-6.81c0-3.6 1.36-5.4 4.05-5.4 2.75 0 4.11 1.76 4.11 5.26zm-8.16 44.07v-24.6c-3.6 1.08-6.4 2.48-8.42 4.23-2.02 1.75-3.03 4.43-3.03 7.98 0 3.37.95 5.94 2.83 7.67 1.89 1.74 4.76 3.31 8.62 4.72zm8.16 19.07v28.14c4.31-.85 7.65-2.58 10.01-5.19 2.35-2.63 3.53-5.66 3.53-9.14 0-3.73-1.14-6.6-3.44-8.64-2.28-2.04-5.66-3.77-10.1-5.17zm-23.46-142.75c-4.08-12.02-7.76-24.2-10.85-36.56 11.55-12.68 56.24-10.99 69.08-.19l-11.89 28.28c6.4-8.4 8.55-11.85 12.37-16.54 1.59 1.05 3.11 2.23 4.53 3.52 3.38 3.07 6.4 6.45 7.02 11.16.39 3.06-.49 6.18-3.2 9.35L430.9 293.8c-3.5-.58-6.94-1.41-10.27-2.6 1.55-3.64 3.42-7.65 4.96-11.29l-9.94 10.73c-10.34-2.19-18.67-.89-26.43 3.22l-27.68-33.23c-1.64-1.97-2.38-3.96-2.38-5.93.03-8.04 11.99-14.96 18.27-17.59l13.72 25.88zM0 409.64h27.32v-25.35h14.33v-12.1h15.42v-145.1H25.55v-34.77h367.39c-12.5 2.38-23.86 7.12-31.36 14.51a27.239 27.239 0 0 0-7.33 12.15c-3.14 2.06-6.26 4.46-9.03 7.12l-1 .99h-15.8v94.31c-15.65 18.55-31.3 42.46-39.91 67.98-5.15 15.26-7.82 31.07-6.71 46.81H0v-26.55zm433.74-217.32h32.81v13.07c-7.58-6.27-19.7-10.74-32.81-13.07zM130.53 384.29h17.78v-12.1h15.42v-145.1h-48.62v145.1h15.42v12.1zm106.65 0H255v-12.1h15.38v-145.1h-48.62v145.1h15.42v12.1zm-70.21-259.73 79.46-60.96 79.9 60.96H166.97z"/></svg>`,
                    clickHandler: (el) => amb.modules.bank.togglePanel(el)
                },
                target: {
                    id: 'amb-target-icon',
                    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 12H18" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12H2" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6V2" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V18" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
                    clickHandler: () => amb.modules.target.find()
                },
                inspector: {
                    id: 'amb-inspector-icon',
                    icon: `<svg fill="#ccc" height="24px" width="24px" viewBox="0 0 512 512"><path d="M495.9,166.6c-2.2-6.1-5.6-11.6-10.1-16.4c-6.2-6.2-13.7-10.3-22.1-12.2c-4.9-1.1-9.9-1.7-15-1.7H362V79.8 c0-21.7-17.6-39.3-39.3-39.3H189.3c-21.7,0-39.3,17.6-39.3,39.3v56.4H63.3c-5.1,0-10.1,0.6-15,1.7c-8.4,1.9-15.9,6-22.1,12.2 c-4.5,4.8-7.9,10.3-10.1,16.4c-2.2,6.1-3.2,12.5-3,18.9v118c-0.2,6.4,0.8,12.8,3,18.9c2.2,6.1,5.6,11.6,10.1,16.4 c6.2,6.2,13.7,10.3,22.1,12.2c4.9,1.1,9.9,1.7,15,1.7h86.7v56.4c0,21.7,17.6,39.3,39.3,39.3h133.3c21.7,0,39.3-17.6,39.3-39.3 v-56.4h86.7c5.1,0,10.1-0.6,15-1.7c8.4-1.9,15.9-6,22.1-12.2c4.5-4.8,7.9-10.3,10.1-16.4c2.2-6.1,3.2-12.5,3-18.9v-118 C499.1,179.1,498.1,172.7,495.9,166.6z M256,335.6c-41.4,0-75-33.6-75-75s33.6-75,75-75s75,33.6,75,75S297.4,335.6,256,335.6z"/></svg>`,
                    clickHandler: (el) => amb.modules.inspector.togglePanel(el)
                },
                war: {
                    id: 'amb-war-icon',
                    icon: `<svg fill="#ccc" height="24px" width="24px" viewBox="0 0 24 24"><path d="M16,13C15.71,13 15.42,13.12 15.21,13.33L9.5,10.08C9.5,10.08 9.5,10.08 9.5,10.07C9.61,9.85 9.68,9.62 9.68,9.38C9.68,8.55 9.03,7.9 8.2,7.9C7.37,7.9 6.72,8.55 6.72,9.38C6.72,10.2 7.37,10.85 8.2,10.85C8.44,10.85 8.67,10.78 8.88,10.67L14.6,13.92C14.54,14.16 14.5,14.41 14.5,14.67C14.5,15.5 15.15,16.15 15.98,16.15C16.81,16.15 17.46,15.5 17.46,14.67C17.46,13.85 16.81,13.2 16,13.2M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>`,
                    clickHandler: () => amb.modules.war.showModal()
                },
                brother: {
                    id: 'amb-brother-icon',
                    icon: `<svg fill="#ccc" height="24px" width="24px" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
                    clickHandler: () => amb.modules.brother.showModal()
                }
            },
            init: function() {
                const basePosition = 37;
                const buttonHeight = 38;
                const buttonMargin = -0;
                let currentPosition = basePosition;
                amb.settings.buttonOrder.forEach(key => {
                    if (amb.settings.enabled[key]) {
                        const def = this.definitions[key];
                        if (def) {
                            this.create(def.id, currentPosition, def.icon, def.clickHandler);
                            currentPosition += buttonHeight + buttonMargin;
                        }
                    }
                });
            },
            create: function(id, position, iconHtml, clickHandler) {
                if (document.getElementById(id)) return;
                const button = document.createElement('button');
                button.id = id;
                button.className = 'amb-icon-button';
                button.style.bottom = `${position}px`;
                button.innerHTML = iconHtml;
                document.body.appendChild(button);
                if (id === 'amb-target-icon') {
                    let pressTimer = null;
                    let isHeld = false;
                    let isButtonUp = false;
                    button.addEventListener('pointerdown', () => {
                        isHeld = false;
                        pressTimer = setTimeout(() => {
                            isHeld = true;
                            isButtonUp = !isButtonUp;
                            button.classList.toggle('moved-up', isButtonUp);
                        }, 750);
                    });
                    button.addEventListener('pointerup', () => {
                        clearTimeout(pressTimer);
                    });
                    button.addEventListener('click', () => {
                        if (!isHeld) {
                            clickHandler(button);
                        }
                    });
                } else {
                    let pressTimer = null;
                    const handlePointerDown = (e) => {
                        e.preventDefault();
                        const handlePointerUp = () => {
                            if (pressTimer) {
                                clearTimeout(pressTimer);
                                pressTimer = null;
                                clickHandler(button);
                            }
                            window.removeEventListener('pointerup', handlePointerUp);
                        };
                        pressTimer = setTimeout(() => {
                            pressTimer = null;
                            amb.settingsUI.show(button);
                            window.removeEventListener('pointerup', handlePointerUp);
                        }, 1000);
                        window.addEventListener('pointerup', handlePointerUp, { once: true });
                    };
                    button.addEventListener('pointerdown', handlePointerDown);
                }
            }
        },

          // ===================================================================
        // Central Settings UI
        // ===================================================================
        settingsUI: {
            show: function(buttonElement) {
                if (document.getElementById('amb-settings-panel')) return;
                const panel = document.createElement('div');
                panel.id = 'amb-settings-panel';
                panel.className = 'amb-panel';
                const buttonOrderHtml = amb.settings.buttonOrder.map(key => {
                    const name = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
                    return `<label><input type="checkbox" data-key="${key}" ${amb.settings.enabled[key] ? 'checked' : ''}> Enable ${name}</label>`;
                }).join('');
                panel.innerHTML = `
                    <div class="amb-panel-header">
                        <div class="amb-panel-title">AmbAssist Settings</div>
                        <button id="amb-settings-close-btn" class="amb-panel-close-btn">&times;</button>
                    </div>
                    <div>
                        <label>Torn API Key:</label>
                        <input type="text" id="amb-settings-api-key" value="${amb.settings.apiKey}">
                        <label>Discord Channel ID (for Bank):</label>
                        <input type="text" id="amb-settings-channel-id" value="${amb.settings.channelId}">
                    </div>
                    <div class="amb-settings-toggles">
                        <div class="amb-panel-subtitle">Enabled Tools</div>
                        ${buttonOrderHtml}
                    </div>
                    <div class="amb-settings-buttons">
                        <button id="amb-settings-save-btn">Save & Reload</button>
                        <button id="amb-settings-close-panel-btn">Close</button>
                    </div>
                `;
                document.body.appendChild(panel);
                const firstEnabledButtonKey = amb.settings.buttonOrder.find(key => amb.settings.enabled[key]);
                const anchorButtonId = amb.buttons.definitions[firstEnabledButtonKey]?.id;
                const anchorButton = document.getElementById(anchorButtonId);
                const referenceElement = anchorButton || buttonElement;
                const buttonRect = referenceElement.getBoundingClientRect();
                const isMobile = amb.utils.isMobileDevice();
                panel.style.bottom = `${window.innerHeight - buttonRect.top - 36}px`;
                if (isMobile) {
                    panel.style.right = `${window.innerWidth - buttonRect.right + 38}px`;
                } else {
                    panel.style.right = `${window.innerWidth - buttonRect.right + 26}px`;
                }
                const close = () => panel.remove();
                document.getElementById('amb-settings-close-btn').addEventListener('click', close);
                document.getElementById('amb-settings-close-panel-btn').addEventListener('click', close);
                document.getElementById('amb-settings-save-btn').addEventListener('click', () => {
                    amb.settings.apiKey = document.getElementById('amb-settings-api-key').value.trim();
                    amb.settings.channelId = document.getElementById('amb-settings-channel-id').value.trim();
                    panel.querySelectorAll('.amb-settings-toggles input[type="checkbox"]').forEach(cb => {
                        amb.settings.enabled[cb.dataset.key] = cb.checked;
                    });
                    amb.saveSettings();
                    alert('Settings saved. The page will now reload to apply changes.');
                    window.location.reload();
                });
            }
        },

        // ===================================================================
        // CSS Styles Block
        // ===================================================================
        styles: {
            inject: function() {
                GM_addStyle(`
                    /* --- Global Styles --- */
                    .amb-icon-button {
                        position: fixed !important; right: 5px !important; z-index: 99999 !important;
                        cursor: pointer; width: 38px; height: 38px; border: none; padding: 0;
                        background: linear-gradient(180deg, #00698c, #003040);
                        border-radius: 5px; display: flex; align-items: center; justify-content: center;
                        box-shadow: inset 0 0 4px hsla(0,0%,100%,.251), inset 0 -2px 4px 0 rgba(0,0,0,.502);
                    }
                    .amb-icon-button:hover { background: linear-gradient(180deg, #008fbf, #004c66); }
                    .amb-panel {
                        position: fixed; z-index: 100000; width: 280px; background-color: #2e2e2e;
                        border: 1px solid #444; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,.3);
                        color: #fff; padding: 10px; display: flex; flex-direction: column;
                    }
                    .amb-panel-header {
                        display: flex; align-items: center; justify-content: space-between; gap: 5px;
                        font-size: 16px; padding: 10px; margin: -10px -10px 10px -10px; font-weight: bold; color: #c0c0c0;
                        background-image: linear-gradient(to bottom, #101010, #222222);
                        border-bottom: 1px solid #005080; border-radius: 4px 4px 0 0;
                    }
                    .amb-panel-title { flex-grow: 1; color: #008fbf; text-shadow: 1px 1px 1px #000; }
                    .amb-panel-subtitle { font-weight: bold; margin: 10px 0 5px 0; color: #ccc; }
                    .amb-panel-close-btn {
                        background: none !important; border: none !important; color: #c0c0c0 !important;
                        cursor: pointer; font-size: 20px !important; padding: 0 5px !important;
                        line-height: 1;
                    }
                    .amb-panel input[type="text"] {
                        background-color: #222; border: 1px solid #444; color: #fff; padding: 8px;
                        border-radius: 4px; margin-bottom: 10px; width: 100%; box-sizing: border-box;
                    }
                    .amb-panel button, .amb-action-button {
                        background: linear-gradient(180deg, #2884b2, #18506b); border: 1px solid #23698c;
                        color: #fff; cursor: pointer; padding: 10px; border-radius: 4px; font-weight: bold;
                    }
                     .amb-action-button:hover { filter: brightness(1.2); }
                    .amb-settings-toggles { margin-top: 10px; }
                    .amb-settings-toggles label { display: block; margin-bottom: 5px; cursor: pointer; }
                    .amb-settings-buttons { display: flex; gap: 10px; margin-top: 15px; }
                    .amb-settings-buttons button { flex: 1; }
                    #amb-settings-close-panel-btn { background-color: #6c757d; border-color: #5a6268; }
                    .amb-modal-overlay {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background-color: rgba(0,0,0,0.8); z-index: 100000;
                        display: none; justify-content: center; align-items: center;
                    }
                    .amb-modal-content {
                        background: #2e2e2e; color: #fff; border: 1px solid #111; border-radius: 5px;
                        display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,.5);
                    }
                    .amb-modal-header {
                        padding: 15px; border-bottom: 1px solid #005080; display: grid;
                        grid-template-columns: 1fr auto 1fr; align-items: center;
                        background-image: linear-gradient(to bottom, #101010, #222222);
                    }
                    .amb-modal-header-title { font-weight: bold; font-size: 1.1em; color: #999; text-shadow: 1px 1px 1px #000; }
                    .amb-modal-main-title { text-align: center; }
                    .amb-modal-main-title h3 { font-size: 1.5em; font-weight: bold; color: #00a8ff; margin: 0; text-shadow: 1px 1px 2px #000; }
                    .amb-modal-main-title small { font-size: 0.9em; color: #ccc; text-shadow: 1px 1px 1px #000; }
                    .amb-modal-header .amb-panel-close-btn { justify-self: end; }
                    .amb-modal-footer { text-align: center; border-top: 1px solid #005080; padding: 15px; background-image: linear-gradient(to bottom,#101010,#222); }
                    .amb-modal-table-container { overflow: auto; padding: 0 15px 15px; }
                    .amb-modal-table-container::-webkit-scrollbar { width: 8px; }
                    .amb-modal-table-container::-webkit-scrollbar-track { background: #222; }
                    .amb-modal-table-container::-webkit-scrollbar-thumb { background: #555; }
                    #amb-target-icon { transition: transform 0.4s ease-in-out; }
                    #amb-target-icon.moved-up { transform: translateY(-35vh); }
                    /* --- War Activity Watcher Specific --- */
                    #amb-war-modal-content { position: relative; width: 95%; max-width: 1600px; max-height: 95vh; }
                    #amb-war-modal-header { cursor: move; }
                    #amb-war-controls-panel { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 15px; padding-bottom: 20px; border-bottom: 1px solid #444; margin-bottom: 20px; }
                    .amb-war-control-group { display: flex; flex-direction: column; gap: 5px; }
                    .amb-war-control-group label { font-weight: bold; color: #00a8ff; font-size: 1.1em; white-space: nowrap; }
                    .amb-war-control-group input, .amb-war-control-group select { background-color: #222; border: 1px solid #444; color: #fff; padding: 8px 12px; border-radius: 4px; font-size: 1em; }
                    .amb-war-info-group { display: flex; gap: 8px; align-items: center; font-size: 1.1em; color: #ccc; white-space: nowrap; padding-bottom: 12px; }
                    .amb-war-info-group label { color: #00a8ff; font-weight: bold; }
                    #amb-war-chartsGridArea { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 20px; min-height: 520px; }
                    .amb-war-chart-panel { background-color: #222; padding: 15px; border-radius: 8px; border: 2px solid black; }
                    #amb-war-clearDataButton { background: linear-gradient(180deg, #b22828, #6b1818); border-color: #8c2323; }
                    /* --- Inspector Specific --- */
                    #amb-inspector-panel { bottom: 79px; right: 50px; }
                    #amb-inspector-loadingOverlay .spinner{border:8px solid #f3f3f3;border-top:8px solid #3498db;border-radius:50%;width:60px;height:60px;animation:amb-spin 2s linear infinite}
                    @keyframes amb-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
                    #amb-inspector-stat-selector-modal .amb-modal-content{max-width:600px}
                    #amb-inspector-stat-selector-body{padding:15px;max-height:60vh;overflow-y:auto}
                    #amb-inspector-selected-tags-container{padding:10px;background:#222;border-radius:4px;min-height:40px;display:flex;flex-wrap:wrap;gap:5px;border:1px solid #111}
                    .amb-inspector-selector-controls{padding:10px 15px;display:flex;justify-content:space-between;align-items:center;background:#222}
                    .amb-inspector-stat-tag{background:#005080;padding:5px 8px;border-radius:4px;font-size:.9em;display:flex;align-items:center}
                    .amb-inspector-remove-tag{background:none;border:none;color:#fff;margin-left:5px;cursor:pointer;font-size:1.2em}
                    .amb-inspector-accordion-header{width:100%;background:#3a3a3a;border:none;color:#eaeaea;padding:10px;text-align:left;cursor:pointer;font-size:1em;margin-top:5px;border-radius:3px}
                    .amb-inspector-accordion-header:hover{background:#4a4a4a}
                    .amb-inspector-accordion-content{padding:0 10px;max-height:0;overflow:hidden;transition:max-height .3s ease-out;background:#282828;border-radius:0 0 3px 3px}
                    .amb-inspector-stat-item{padding:8px;cursor:pointer;border-bottom:1px solid #333}
                    .amb-inspector-stat-item:last-child{border-bottom:none}
                    .amb-inspector-stat-item:hover{background:#005080}
                    .amb-inspector-stat-item.selected{background:#008fbf;font-weight:700}
                    .amb-inspector-results-table{table-layout:fixed;width:100%;border-collapse:separate;font-size:.95em;border-spacing:0}
                    .amb-inspector-results-table thead{position:sticky;top:0;z-index:1;background-color:#2e2e2e}
                    .amb-inspector-results-table td,.amb-inspector-results-table th{padding:12px 15px;border-bottom:1px solid #222;color:#eaeaea;text-align:left;text-shadow:1px 1px 1px #000}
                    .amb-inspector-results-table td:not(:last-child),.amb-inspector-results-table th:not(:last-child){border-right:1px solid #222}
                    .amb-inspector-results-table tbody tr:hover{background-color:#005080;color:#fff;font-weight:700}
                    /* --- Big Brother Specific --- */
                    .amb-brother-table { table-layout: fixed; width: 100%; border-collapse: separate; font-size: 1.1em; border-spacing: 0; }
                    .amb-brother-table thead { position: sticky; top: -1px; z-index: 1; background-color: #2e2e2e; }
                    .amb-brother-table td, .amb-brother-table th { padding: 12px 8px; border: 1px solid #444; color: #eaeaea; text-align: center; text-shadow: 1px 1px 1px #000; }
                    .amb-brother-table th:first-child, .amb-brother-table td:first-child { text-align: left; width: 15%; }
                    .amb-brother-table th[data-sort-key] { cursor: pointer; }
                    .amb-brother-table tbody tr:hover { background-color: #005080; color: #fff; font-weight: bold; }
                    .amb-brother-table a { color: #f0f0f0; text-decoration: none; }
                    .amb-brother-table a:hover { text-decoration: underline; color: #8ab4f8; }
                    .amb-brother-stat-cell { color: black !important; font-weight: bold; }
                    .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-1 { background: #c8efff; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-2 { background: #b5e4ff; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-3 { background: #a3d9ff; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-4 { background: #90ceff; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-5 { background: #8dc1f4; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-6 { background: #9bb2de; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-7 { background: #aaa1c5; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-8 { background: #bc8ea9; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-9 { background: #d57482; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-10 { background: #e4575a; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-11 { background: #db484c; color: #000; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-12 { background: #d2393d; color: #FFF; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-13 { background: #c7292c; color: #FFF; } .amb-brother-table-striped > tbody > tr > td.amb-brother-stat-tier-14 { background: #bc161a; color: #FFF; }
                    .amb-brother-status-okay { color: #28a745 !important; } .amb-brother-status-hospital { color: #dc3545 !important; } .amb-brother-status-jail { color: #ffc107 !important; } .amb-brother-status-traveling { color: #17a2b8 !important; } .amb-brother-status-other { color: #ffb86c !important; }
                `);
            }
        }
    };

    // ===================================================================
    // Bank Request Module
    // ===================================================================
    amb.modules.bank = {
        cooldownInterval: null,
        COOLDOWN_SECONDS: 60,
        BACKEND_URL: 'https://tornrequest-ggvqizj32q-nw.a.run.app',

        init: function() {
            const panel = document.createElement('div');
            panel.id = 'amb-bank-panel';
            panel.className = 'amb-panel';
            panel.style.display = 'none';

            panel.innerHTML = `
                <div class="amb-panel-header">
                    <div class="amb-panel-title">Bank Request</div>
                    <button id="amb-bank-close-btn" class="amb-panel-close-btn">&times;</button>
                </div>
                <label for="amb-bank-amount">Amount:</label>
                <input type="text" id="amb-bank-amount" placeholder="e.g., 50m, 1.2b...">
                <button id="amb-bank-request-btn">Request</button>
            `;
            document.body.appendChild(panel);

            document.getElementById('amb-bank-close-btn').addEventListener('click', () => this.togglePanel(document.getElementById('amb-bank-icon')));
            document.getElementById('amb-bank-request-btn').addEventListener('click', () => this.handleRequest());
            document.getElementById('amb-bank-amount').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleRequest();
                }
            });
        },

        togglePanel: function(buttonElement) {
            const panel = document.getElementById('amb-bank-panel');
            if (!panel || !buttonElement) return;

            if (panel.style.display === 'flex') {
                panel.style.display = 'none';
            } else {
                this.updateCooldownDisplay();
                const buttonRect = buttonElement.getBoundingClientRect();
                const isMobile = amb.utils.isMobileDevice();
                panel.style.bottom = `${window.innerHeight - buttonRect.top}px`;
                panel.style.right = `${window.innerWidth - buttonRect.right + (isMobile ? 38 : 42)}px`;
                panel.style.display = 'flex';
                document.getElementById('amb-bank-amount').focus();
            }
        },

        parseShorthandAmount: function(inputStr) {
            if (!inputStr || typeof inputStr !== 'string') return 0;
            const str = String(inputStr).toLowerCase().trim().replace(/[^\d.kmb]/g, '');
            const lastChar = str.slice(-1);
            let value;
            if (['k', 'm', 'b'].includes(lastChar)) {
                const numPart = parseFloat(str.slice(0, -1));
                if (isNaN(numPart)) return 0;
                if (lastChar === 'k') value = numPart * 1e3;
                if (lastChar === 'm') value = numPart * 1e6;
                if (lastChar === 'b') value = numPart * 1e9;
            } else {
                value = parseFloat(str);
            }
            return isNaN(value) ? 0 : Math.floor(value);
        },

        updateCooldownDisplay: function() {
            clearInterval(this.cooldownInterval);
            const button = document.getElementById('amb-bank-request-btn');
            if (!button) return;

            const update = () => {
                const endTime = GM_getValue('amb_bank_cooldownEnd', 0);
                const remaining = Math.ceil((endTime - Date.now()) / 1000);
                if (remaining > 0) {
                    button.disabled = true;
                    button.textContent = `On Cooldown (${remaining}s)`;
                } else {
                    button.disabled = false;
                    button.textContent = 'Request';
                    clearInterval(this.cooldownInterval);
                }
            };
            if (GM_getValue('amb_bank_cooldownEnd', 0) > Date.now()) {
                this.cooldownInterval = setInterval(update, 1000);
            }
            update();
        },

        handleRequest: function() {
            const amountInput = document.getElementById('amb-bank-amount');
            const button = document.getElementById('amb-bank-request-btn');
            const amount = this.parseShorthandAmount(amountInput.value);

            if (amount <= 0) { return alert("Please enter a valid amount."); }
            if (!amb.settings.apiKey || !amb.settings.channelId) { return alert("API Key and Channel ID must be set in settings."); }

            button.disabled = true;
            button.textContent = 'Sending...';

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/user/?selections=&key=${amb.settings.apiKey}`,
                onload: (userResponse) => {
                    try {
                        const userData = JSON.parse(userResponse.responseText);
                        if (userData.error) throw new Error(userData.error.error);
                        if (!userData.faction || !userData.faction.faction_id) throw new Error("Could not find Faction ID.");

                        const tornData = {
                            username: userData.name, amount: amount, userId: userData.player_id,
                            factionId: userData.faction.faction_id, channelId: amb.settings.channelId,
                            factionName: userData.faction.faction_name
                        };

                        GM_xmlhttpRequest({
                            method: "POST", url: `${this.BACKEND_URL}/torn-request`,
                            headers: { "Content-Type": "application/json" }, data: JSON.stringify(tornData),
                            onload: (response) => {
                                if (response.status === 200) {
                                    GM_setValue('amb_bank_cooldownEnd', Date.now() + (this.COOLDOWN_SECONDS * 1000));
                                    this.updateCooldownDisplay();
                                    button.textContent = 'Sent!';
                                    setTimeout(() => {
                                        amountInput.value = '';
                                        this.togglePanel(document.getElementById('amb-bank-icon'));
                                    }, 1500);
                                } else { throw new Error("Backend failed to process the request."); }
                            },
                            onerror: () => { throw new Error("Network error connecting to the backend."); }
                        });
                    } catch (e) {
                        alert(`Error: ${e.message}`);
                        button.disabled = false; button.textContent = 'Request';
                    }
                },
                onerror: () => {
                    alert("A network error occurred with the Torn API. Check your API key.");
                    button.disabled = false; button.textContent = 'Request';
                }
            });
        }
    };

    // ===================================================================
    // Quick Target Module
    // ===================================================================
    amb.modules.target = {
        config: { rangeStart: 3000000, rangeEnd: 3400000 },
        init: function() {},
        find: function() {
            const randomId = Math.floor(Math.random() * (this.config.rangeEnd - this.config.rangeStart + 1)) + this.config.rangeStart;
            window.location.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${randomId}`;
        }
    };

    // ===================================================================
    // Torn Inspector Module
    // ===================================================================
    amb.modules.inspector = {
        popularPresetStats: ['Level', 'Age', 'Last Action', 'Xanax Taken', 'Refills', 'Total War Hits'],
        statCategories: [
            { name: "⚔️ Combat", stats: ['Attacks Won', 'Attacks Lost', 'Attacks Draw', 'Defends Won', 'Defends Lost', 'Total Attack Hits', 'Attack Damage Dealt', 'Best Single Hit Damage', 'Critical Hits', 'One-Hit Kills', 'Best Kill Streak', 'ELO Rating', 'Stealth Attacks', 'Highest Level Beaten', 'Unarmed Fights Won', 'Times You Ran Away', 'Opponent Ran Away', 'Total War Assists'] },
            { name: "💰 Economy & Items", stats: ['Networth', 'Money Mugged', 'Largest Mug', 'Bazaar Profit ($)', 'Bazaar Sales (#)', 'Bazaar Customers', 'Points Bought', 'Points Sold', 'Items Bought (Market/Shops)', 'City Items Bought', 'Items Bought Abroad', 'Items Sent', 'Items Looted', 'Items Dumped', 'Trades Made', 'Businesses Owned', 'Properties Owned'] },
            { name: "🚨 Crime & Jail", stats: ['Criminal Record (Total)', 'Times Jailed', 'People Busted', 'Failed Busts', 'Arrests Made'] },
            { name: "💊 Medical & Drugs", stats: ['Medical Items Used', 'Times Hospitalized', 'Drugs Used (Times)', 'Times Overdosed', 'Times Rehabbed', 'Boosters Used', 'Energy Drinks Used', 'Alcohol Used', 'Candy Used', 'Nerve Refills Used'] },
            { name: "📈 Activity & Progress", stats: ['Daily Login Streak', 'Best Active Streak', 'User Activity', 'Awards', 'Donator Days', 'Missions Completed', 'Contracts Completed', 'Mission Credits Earned', 'Job Points Used', 'Stat Trains Received', 'Travels Made', 'City Finds', 'Dump Finds', 'Items Dumped', 'Books Read', 'Viruses Coded', 'Races Won', 'Racing Skill', 'Status', 'Respect'] },
            { name: "🎯 Bounties & Revives", stats: ['Total Bounties', 'Bounties Placed', 'Bounties Collected', 'Money Spent on Bounties', 'Money From Bounties Collected', 'Revives Made', 'Revives Received', 'Revive Skill'] }
        ],
        maxSelection: 6,
        selectedStatsSet: new Set(),
        currentApiData: null,
        currentDataType: '',
        init: function() {
            const uiHtml = `
                <div id="amb-inspector-panel" class="amb-panel" style="display: none;">
                    <div class="amb-panel-header">
                        <div class="amb-panel-title">Torn Inspector</div>
                        <button id="amb-inspector-panelClose" class="amb-panel-close-btn">&times;</button>
                    </div>
                    <div style="padding: 15px;">
                        <label for="amb-inspector-id-input">User or Faction ID:</label>
                        <input type="text" id="amb-inspector-id-input" placeholder="Enter ID...">
                        <button id="amb-inspector-fetchButton" class="amb-action-button" style="width: 100%;">Fetch Data</button>
                    </div>
                </div>
                <div id="amb-inspector-loadingOverlay" class="amb-modal-overlay"><div class="spinner"></div></div>
                <div id="amb-inspector-faction-results-modal" class="amb-modal-overlay">
                    <div class="amb-modal-content" style="max-width: 1200px;">
                        <div class="amb-modal-header">
                            <div class="amb-modal-header-title">AmbAssist Utilities</div>
                            <div class="amb-modal-main-title"><h3 id="amb-inspector-modal-faction-name">Faction</h3><small id="amb-inspector-modal-member-count">0 members</small></div>
                            <button id="amb-inspector-closeFactionModal" class="amb-panel-close-btn">&times;</button>
                        </div>
                        <div class="amb-modal-table-container">
                            <table class="amb-inspector-results-table"><thead id="amb-inspector-faction-table-header"></thead><tbody id="amb-inspector-faction-table-body"></tbody></table>
                        </div>
                        <div class="amb-modal-footer"><button id="amb-inspector-downloadBtn" class="amb-action-button">Download</button></div>
                    </div>
                </div>
                <div id="amb-inspector-profile-results-modal" class="amb-modal-overlay">
                    <div class="amb-modal-content" style="max-width: 600px;">
                        <div class="amb-modal-header">
                            <div class="amb-modal-header-title">AmbAssist Utilities</div>
                            <div class="amb-modal-main-title"><h3 id="amb-inspector-profile-modal-name">User Profile</h3><small id="amb-inspector-profile-modal-id">[0]</small></div>
                            <button id="amb-inspector-closeProfileModal" class="amb-panel-close-btn">&times;</button>
                        </div>
                        <div class="amb-modal-table-container">
                             <table class="amb-inspector-results-table"><thead><tr><th>Statistic</th><th>Value</th></tr></thead><tbody id="amb-inspector-profile-table-body"></tbody></table>
                        </div>
                    </div>
                </div>
                <div id="amb-inspector-stat-selector-modal" class="amb-modal-overlay">
                    <div class="amb-modal-content" style="max-width: 600px;">
                        <div class="amb-modal-header">
                            <div class="amb-modal-header-title">Stat Selector</div>
                            <div class="amb-modal-main-title"><h3 id="amb-inspector-selector-title">Select up to 6 stats</h3></div>
                            <button id="amb-inspector-closeSelectorModal" class="amb-panel-close-btn">&times;</button>
                        </div>
                        <div class="amb-inspector-selector-controls"><label><input type="checkbox" id="amb-inspector-popular-checkbox"> ⭐ Most Popular</label></div>
                        <div id="amb-inspector-selected-tags-container"></div>
                        <div id="amb-inspector-stat-selector-body"></div>
                        <div class="amb-modal-footer"><button id="amb-inspector-show-results-btn" class="amb-action-button">Show Results</button></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', uiHtml);
            this.attachEventListeners();
        },
        togglePanel: function(buttonElement) {
            const panel = document.getElementById('amb-inspector-panel');
            if (!panel || !buttonElement) return;
            if (panel.style.display === 'flex') {
                panel.style.display = 'none';
            } else {
                const buttonRect = buttonElement.getBoundingClientRect();
                const isMobile = amb.utils.isMobileDevice();
                panel.style.bottom = `${window.innerHeight - buttonRect.top}px`;
                panel.style.right = `${window.innerWidth - buttonRect.right + (isMobile ? 38 : 42)}px`;
                panel.style.display = 'flex';
                document.getElementById('amb-inspector-id-input').focus();
            }
        },
        attachEventListeners: function() {
            document.getElementById('amb-inspector-panelClose').addEventListener('click', () => this.togglePanel(document.getElementById('amb-inspector-icon')));
            document.getElementById('amb-inspector-fetchButton').addEventListener('click', () => this.fetchData());
            document.getElementById('amb-inspector-closeFactionModal').addEventListener('click', () => this.closeModal('amb-inspector-faction-results-modal'));
            document.getElementById('amb-inspector-closeProfileModal').addEventListener('click', () => this.closeModal('amb-inspector-profile-results-modal'));
            document.getElementById('amb-inspector-closeSelectorModal').addEventListener('click', () => this.closeModal('amb-inspector-stat-selector-modal'));
            document.getElementById('amb-inspector-show-results-btn').addEventListener('click', () => this.displayResults());
            document.getElementById('amb-inspector-downloadBtn').addEventListener('click', () => {
                const tableElement = document.querySelector('#amb-inspector-faction-results-modal .amb-modal-table-container');
                const factionName = document.getElementById('amb-inspector-modal-faction-name').textContent.replace(/[^a-zA-Z0-9]/g, '_');
                html2canvas(tableElement, { scale: 2, useCORS: true, scrollY: -window.scrollY }).then(canvas => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = `${factionName}_stats.png`;
                    link.click();
                });
            });
            document.getElementById('amb-inspector-stat-selector-body').addEventListener('click', e => {
                if (e.target.classList.contains('amb-inspector-accordion-header')) {
                    const content = e.target.nextElementSibling;
                    content.style.maxHeight = content.style.maxHeight ? null : `${content.scrollHeight}px`;
                } else if (e.target.classList.contains('amb-inspector-stat-item')) {
                    const stat = e.target.dataset.stat;
                    if (this.selectedStatsSet.has(stat)) {
                        this.selectedStatsSet.delete(stat);
                        e.target.classList.remove('selected');
                    } else if (this.selectedStatsSet.size < this.maxSelection) {
                        this.selectedStatsSet.add(stat);
                        e.target.classList.add('selected');
                    }
                    document.getElementById('amb-inspector-popular-checkbox').checked = false;
                    this.renderSelectedTags();
                }
            });
            document.getElementById('amb-inspector-selected-tags-container').addEventListener('click', e => {
                if (e.target.classList.contains('amb-inspector-remove-tag')) {
                    const stat = e.target.dataset.stat;
                    this.selectedStatsSet.delete(stat);
                    document.querySelector(`.amb-inspector-stat-item[data-stat="${stat}"]`)?.classList.remove('selected');
                    document.getElementById('amb-inspector-popular-checkbox').checked = false;
                    this.renderSelectedTags();
                }
            });
            document.getElementById('amb-inspector-popular-checkbox').addEventListener('change', e => {
                this.selectedStatsSet.clear();
                document.querySelectorAll('.amb-inspector-stat-item.selected').forEach(el => el.classList.remove('selected'));
                if (e.target.checked) {
                    this.popularPresetStats.forEach(stat => {
                        if (this.selectedStatsSet.size < this.maxSelection) this.selectedStatsSet.add(stat);
                    });
                    this.popularPresetStats.forEach(stat => {
                        document.querySelector(`.amb-inspector-stat-item[data-stat="${stat}"]`)?.classList.add('selected');
                    });
                }
                this.renderSelectedTags();
            });
        },
        getValueForStat: function(statDisplayName, userData) {
            let value = 'N/A';
            const personalstats = userData.personalstats || {};
            switch (statDisplayName) {
                case 'Level': value = userData.level; break;
                case 'Age': value = userData.age; break;
                case 'Last Action':
                    const la = userData.last_action || {};
                    if (la.timestamp && la.timestamp > 0) {
                        const secondsAgo = Math.floor(Date.now() / 1000) - la.timestamp;
                        if (secondsAgo < 60) value = `${secondsAgo}s Ago`;
                        else if (secondsAgo < 3600) value = `${Math.floor(secondsAgo/60)}m Ago`;
                        else if (secondsAgo < 86400) value = `${Math.floor(secondsAgo/3600)}h Ago`;
                        else value = `${Math.floor(secondsAgo/86400)}d Ago`;
                    } else { value = la.relative?.replace(' ago', ' Ago') || 'N/A'; }
                    break;
                case 'Xanax Taken': value = personalstats.xantaken; break;
                case 'Refills': value = personalstats.refills; break;
                case 'Total War Hits': value = personalstats.rankedwarhits; break;
                case 'Networth': value = personalstats.networth; break;
            }
            if (value === undefined || value === null || value === "") { return 'N/A'; }
            if (typeof value === 'number' && !isNaN(value)) { return value.toLocaleString(); }
            return String(value);
        },
        showLoadingSpinner: function() { document.getElementById('amb-inspector-loadingOverlay')?.style.setProperty('display', 'flex'); },
        hideLoadingSpinner: function() { document.getElementById('amb-inspector-loadingOverlay')?.style.setProperty('display', 'none'); },
        showModal: function(id) { document.getElementById(id)?.style.setProperty('display', 'flex'); },
        closeModal: function(id) {
            const modal = document.getElementById(id);
            if (modal) modal.style.display = 'none';
        },
        displayResults: async function() {
            if (this.currentDataType === 'user') {
                document.getElementById('amb-inspector-profile-modal-name').textContent = this.currentApiData.name || 'Unknown User';
                document.getElementById('amb-inspector-profile-modal-id').textContent = `[${this.currentApiData.player_id}]`;
                const tableBody = document.getElementById('amb-inspector-profile-table-body');
                tableBody.innerHTML = Array.from(this.selectedStatsSet).map(stat => `
                    <tr><td>${stat}</td><td>${this.getValueForStat(stat, this.currentApiData)}</td></tr>`).join('');
                this.closeModal('amb-inspector-stat-selector-modal');
                this.showModal('amb-inspector-profile-results-modal');
            } else if (this.currentDataType === 'faction') {
                this.showLoadingSpinner();
                document.getElementById('amb-inspector-modal-faction-name').textContent = this.currentApiData.name || 'Unknown Faction';
                document.getElementById('amb-inspector-modal-member-count').textContent = `${Object.keys(this.currentApiData.members).length} members`;
                const headers = ["Name"].concat(Array.from(this.selectedStatsSet));
                document.getElementById('amb-inspector-faction-table-header').innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
                const tableBody = document.getElementById('amb-inspector-faction-table-body');
                tableBody.innerHTML = '';
                this.closeModal('amb-inspector-stat-selector-modal');
                this.showModal('amb-inspector-faction-results-modal');
                const memberIds = Object.keys(this.currentApiData.members);
                let allMemberData = [];
                for (let i = 0; i < memberIds.length; i += 10) {
                    const batchIds = memberIds.slice(i, i + 10);
                    const promises = batchIds.map(id =>
                        fetch(`https://api.torn.com/user/${id}?selections=profile,personalstats&key=${amb.settings.apiKey}`)
                        .then(res => res.json())
                        .then(data => data.error ? { name: this.currentApiData.members[id]?.name, error: data.error.error } : data)
                        .catch(() => ({ name: this.currentApiData.members[id]?.name, error: 'Network Error' }))
                    );
                    allMemberData.push(...await Promise.all(promises));
                    if (memberIds.length > 10) await new Promise(resolve => setTimeout(resolve, 250));
                }
                allMemberData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                tableBody.innerHTML = allMemberData.map(user => `
                    <tr>
                        <td>${user.name || 'Error'}</td>
                        ${user.error ? `<td colspan="${this.selectedStatsSet.size}" style="color: #ff4d4d;">Error: ${user.error}</td>` :
                        Array.from(this.selectedStatsSet).map(stat => `<td>${this.getValueForStat(stat, user)}</td>`).join('')}
                    </tr>`).join('');
                this.hideLoadingSpinner();
            }
        },
        fetchData: async function() {
            this.showLoadingSpinner();
            const id = document.getElementById('amb-inspector-id-input')?.value.trim();
            if (!amb.settings.apiKey) {
                alert('API Key not set. Long-press an icon to open settings.');
                this.hideLoadingSpinner();
                return;
            }
            if (!id || isNaN(id)) {
                alert('Please enter a valid numeric ID.');
                this.hideLoadingSpinner();
                return;
            }
            try {
                const userRes = await fetch(`https://api.torn.com/user/${id}?selections=profile,personalstats&key=${amb.settings.apiKey}`);
                const userData = await userRes.json();
                if (!userData.error) {
                    this.currentApiData = userData;
                    this.currentDataType = 'user';
                    this.showStatSelector();
                } else if (userData.error && (userData.error.code === 2 || userData.error.error.includes("Incorrect ID"))) {
                    const facRes = await fetch(`https://api.torn.com/faction/${id}?selections=basic&key=${amb.settings.apiKey}`);
                    const facData = await facRes.json();
                    if (!facData.error) {
                        this.currentApiData = facData;
                        this.currentDataType = 'faction';
                        this.showStatSelector();
                    } else {
                        throw new Error("Invalid User or Faction ID");
                    }
                } else {
                    throw new Error(`API Error: ${userData.error.error}`);
                }
            } catch (error) {
                alert(`Error: ${error.message}`);
            } finally {
                this.hideLoadingSpinner();
            }
        },
        renderSelectedTags: function() {
            const tagsContainer = document.getElementById('amb-inspector-selected-tags-container');
            tagsContainer.innerHTML = Array.from(this.selectedStatsSet).map(stat => `
                <div class="amb-inspector-stat-tag">${stat} <button data-stat="${stat}" class="amb-inspector-remove-tag">&times;</button></div>`).join('');
            document.getElementById('amb-inspector-show-results-btn').disabled = this.selectedStatsSet.size === 0;
        },
        showStatSelector: function() {
            this.selectedStatsSet.clear();
            document.getElementById('amb-inspector-popular-checkbox').checked = false;
            const selectorBody = document.getElementById('amb-inspector-stat-selector-body');
            selectorBody.innerHTML = this.statCategories.map(cat => `
                <div class="amb-inspector-accordion">
                    <button class="amb-inspector-accordion-header">${cat.name}</button>
                    <div class="amb-inspector-accordion-content">
                        ${cat.stats.map(stat => `<div class="amb-inspector-stat-item" data-stat="${stat}">${stat}</div>`).join('')}
                    </div>
                </div>`).join('');
            const title = document.getElementById('amb-inspector-selector-title');
            title.textContent = `Select up to 6 stats for ${this.currentDataType === 'user' ? this.currentApiData.name : this.currentApiData.name}`;
            this.renderSelectedTags();
            this.showModal('amb-inspector-stat-selector-modal');
        }
    };

    // ===================================================================
// War Activity Watcher Module
// ===================================================================
amb.modules.war = {
    rawActivityChartInstance: null,
    myFactionIndividualsChartInstance: null,
    activityDifferenceChartInstance: null,
    enemyFactionIndividualsChartInstance: null,
    fetchInterval: null,
    autoStopInterval: null,
    SESSION_KEY: 'amb_war_activitySessionState',
    DATA_KEY: 'amb_war_factionActivityData',
    historicalData: [],

    init: function() {
        this.createUI();
        this.attachEventListeners();

        const savedData = GM_getValue(this.DATA_KEY, []);
        if (savedData && Array.isArray(savedData)) {
            this.historicalData = savedData;
        }

        this.updateCharts();
        if (this.historicalData.length > 0) {
            const lastRecord = this.historicalData[this.historicalData.length - 1];
            this.populateIndividualComparisonDropdowns(
                lastRecord.myFaction.individuals, lastRecord.enemyFaction.individuals,
                lastRecord.myFaction.name, lastRecord.enemyFaction.name
            );
        }

        const sessionState = this.loadSessionState();
        if (sessionState && sessionState.isRunning) {
            this.enterRunningState(sessionState);
        } else {
            this.enterStoppedState();
        }
    },

    createUI: function() {
        if (document.getElementById('amb-war-modal-overlay')) return;

        const uiHtml = `
            <div id="amb-war-modal-overlay" class="amb-modal-overlay">
                <div id="amb-war-modal-content" class="amb-modal-content">
                    <div id="amb-war-modal-content-header" class="amb-modal-header">
                        <div class="amb-modal-header-title">AmbAssist Utilities</div>
                        <div class="amb-modal-main-title">
                            <h3 id="amb-war-modal-faction-name">Faction Activity Watcher</h3>
                            <small id="amb-war-modal-member-count">Enter faction IDs to begin</small>
                        </div>
                        <button id="amb-war-modal-close" class="amb-panel-close-btn">&times;</button>
                    </div>
                    <div class="amb-modal-table-container">
                        <div id="amb-war-controls-panel">
                            <div class="amb-war-control-group"><label>My Faction ID:</label><input type="text" id="amb-war-myFactionID"></div>
                            <div class="amb-war-control-group"><label>Enemy Faction ID:</label><input type="text" id="amb-war-enemyFactionID"></div>
                            <div class="amb-war-control-group"><label>Refresh (min):</label><select id="amb-war-activityInterval"><option value="15">15</option><option value="30" selected>30</option></select></div>
                            <div class="amb-war-control-group"><label>Stop In (hrs):</label><select id="amb-war-stopTimerHours"><option value="6">6</option><option value="12">12</option><option value="24">24</option><option value="48">48</option><option value="72">72</option></select></div>
                            <div class="amb-war-control-group"><label>&nbsp;</label><button id="amb-war-startButton" class="amb-action-button">Start</button></div>
                            <div class="amb-war-control-group"><label>&nbsp;</label><button id="amb-war-stopButton" class="amb-action-button">Stop</button></div>
                            <div style="display: flex; gap: 20px; margin: 0 20px;">
                                <div class="amb-war-info-group"><label>Status:</label> <span id="amb-war-statusDisplay">Ready</span></div>
                                <div class="amb-war-info-group"><label>Last Refresh:</label> <span id="amb-war-lastRefreshTime">N/A</span></div>
                                <div class="amb-war-info-group"><label>Ends In:</label> <span id="amb-war-countdownTimer">0h 0m</span></div>
                            </div>
                            <div style="margin-left: auto; display: flex; gap: 20px; align-items: flex-end;">
                                <div class="amb-war-control-group"><label>Compare Member 1:</label><select id="amb-war-compareUser1"></select></div>
                                <div class="amb-war-control-group"><label>Compare Member 2:</label><select id="amb-war-compareUser2"></select></div>
                            </div>
                        </div>
                        <div id="amb-war-chartsGridArea">
                            <div class="amb-war-chart-panel"><canvas id="amb-war-rawActivityChart"></canvas></div>
                            <div class="amb-war-chart-panel"><canvas id="amb-war-myFactionIndividualsChart"></canvas></div>
                            <div class="amb-war-chart-panel"><canvas id="amb-war-activityDifferenceChart"></canvas></div>
                            <div class="amb-war-chart-panel"><canvas id="amb-war-enemyFactionIndividualsChart"></canvas></div>
                        </div>
                    </div>
                    <div class="amb-modal-footer">
                        <button id="amb-war-downloadCsvButton" class="amb-action-button">Download CSV</button>
                        <button id="amb-war-clearDataButton" class="amb-action-button">Clear Data</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', uiHtml);
        amb.utils.dragElement(document.getElementById("amb-war-modal-content"));
    },

    attachEventListeners: function() {
        document.getElementById('amb-war-modal-close').addEventListener('click', () => this.closeModal());

        document.getElementById('amb-war-startButton').addEventListener('click', () => {
            const myFactionId = document.getElementById('amb-war-myFactionID').value.trim();
            const enemyFactionId = document.getElementById('amb-war-enemyFactionID').value.trim();
            if (!myFactionId || !enemyFactionId) {
                return alert("Please enter both Faction IDs before starting!");
            }
            if (!amb.settings.apiKey) {
                return alert("Torn API Key not available. Long-press an icon to set it.");
            }
            const interval = parseInt(document.getElementById('amb-war-activityInterval').value, 10);
            const stopHours = parseInt(document.getElementById('amb-war-stopTimerHours').value, 10);
            const sessionState = {
                isRunning: true, myFactionID: myFactionId, enemyFactionID: enemyFactionId,
                interval: interval, autoStopTime: (!isNaN(stopHours) && stopHours > 0) ? Date.now() + stopHours * 3600000 : null,
                autoStopDuration: (!isNaN(stopHours) && stopHours > 0) ? stopHours : null
            };
            this.saveSessionState(sessionState);
            this.enterRunningState(sessionState);
        });

        document.getElementById('amb-war-stopButton').addEventListener('click', () => this.enterStoppedState());
        document.getElementById('amb-war-downloadCsvButton').addEventListener('click', () => this.generateAndDownloadReport());
        document.getElementById('amb-war-clearDataButton').addEventListener('click', () => {
            if (confirm("Are you sure you want to permanently clear all historical data? This cannot be undone.")) {
                this.enterStoppedState();
                GM_setValue(this.DATA_KEY, []);
                this.historicalData = [];
                this.destroyCharts();
                document.getElementById('amb-war-myFactionID').value = '';
                document.getElementById('amb-war-enemyFactionID').value = '';
                document.getElementById('amb-war-modal-faction-name').textContent = 'Faction Activity Watcher';
                document.getElementById('amb-war-modal-member-count').textContent = 'Enter faction IDs to begin';
                document.getElementById('amb-war-lastRefreshTime').textContent = 'N/A';
                this.populateIndividualComparisonDropdowns([], [], "My Faction", "Enemy Faction");
                this.updateStatus("Ready");
            }
        });

        document.getElementById('amb-war-compareUser1').addEventListener('change', () => this.updateIndividualCharts());
        document.getElementById('amb-war-compareUser2').addEventListener('change', () => this.updateIndividualCharts());
    },

    showModal: function() {
        const overlay = document.getElementById('amb-war-modal-overlay');
        const content = document.getElementById('amb-war-modal-content');
        if (overlay) {
            overlay.style.display = 'flex';
            content.style.top = '';
            content.style.left = '';
        }
    },

    closeModal: function() {
        const overlay = document.getElementById('amb-war-modal-overlay');
        if (overlay) overlay.style.display = 'none';
    },

    saveSessionState: function(state) { GM_setValue(this.SESSION_KEY, state); },
    loadSessionState: function() { return GM_getValue(this.SESSION_KEY, null); },
    clearSessionState: function() { GM_setValue(this.SESSION_KEY, null); },

    updateStatus: function(displayMessage) {
        const statusDisplay = document.getElementById('amb-war-statusDisplay');
        if (!statusDisplay) return;
        statusDisplay.textContent = displayMessage;
        let textColor = '#eee';
        if (displayMessage === "Running...") { textColor = '#33FF57'; }
        else if (displayMessage === "Ready") { textColor = '#FFD700'; }
        else if (displayMessage === "Stopped") { textColor = '#FF3333'; }
        else if (displayMessage.startsWith("Error")) { textColor = '#FF3333'; }
        statusDisplay.style.color = textColor;
    },

    startAutoStopTimer: function(endTime) {
        if (this.autoStopInterval) clearInterval(this.autoStopInterval);
        const countdownTimerDisplay = document.getElementById('amb-war-countdownTimer');
        const updateCountdown = () => {
            const remainingMs = endTime - Date.now();
            if (remainingMs <= 0) {
                countdownTimerDisplay.textContent = '0h 0m';
                if (this.fetchInterval) document.getElementById('amb-war-stopButton').click();
                clearInterval(this.autoStopInterval);
                return;
            }
            const totalSeconds = Math.round(remainingMs / 1000);
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            countdownTimerDisplay.textContent = `${h}h ${m}m`;
        };
        this.autoStopInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    },

    stopAutoStopTimer: function() {
        if (this.autoStopInterval) {
            clearInterval(this.autoStopInterval);
            this.autoStopInterval = null;
        }
        document.getElementById('amb-war-countdownTimer').textContent = '0h 0m';
    },

    convertLastActionToMinutes: function(relative) {
        if (!relative) return 0;
        const parts = relative.split(' ');
        const value = parseFloat(parts[0]);
        const unit = parts[1];
        if (isNaN(value)) return 0;
        if (unit.includes("minute")) return value;
        if (unit.includes("hour")) return value * 60;
        if (unit.includes("day")) return value * 1440;
        return 0;
    },

    formatTimestamp: function(date) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    },

    fetchTornApi: function(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        let errorJson;
                        try { errorJson = JSON.parse(response.responseText); } catch (e) {
                            return reject(new Error(`API Error: ${response.statusText}`));
                        }
                        const errorMessage = errorJson?.error?.error || `API Error ${response.status}`;
                        reject(new Error(errorMessage));
                    }
                },
                onerror: (error) => reject(new Error("Network error during API request."))
            });
        });
    },

    processFactionDataFromTornApi: function(id, resp) {
        const data = { factionName: "Unknown", members: [] };
        if (resp.error) throw new Error(`API Error for ${id}: ${resp.error.error || resp.error}`);
        data.factionName = resp.name || `Faction ${id}`;
        if (resp.members) {
            Object.entries(resp.members).forEach(([memberId, member]) => {
                const minutesAgo = this.convertLastActionToMinutes(member.last_action?.relative);
                data.members.push({
                    id: memberId, name: member.name, minutesAgo: minutesAgo,
                    active: minutesAgo <= 15 ? 1 : 0,
                    display: `${member.name} [${memberId}]`
                });
            });
        }
        return data;
    },

    destroyCharts: function() {
        if (this.rawActivityChartInstance) this.rawActivityChartInstance.destroy();
        if (this.myFactionIndividualsChartInstance) this.myFactionIndividualsChartInstance.destroy();
        if (this.activityDifferenceChartInstance) this.activityDifferenceChartInstance.destroy();
        if (this.enemyFactionIndividualsChartInstance) this.enemyFactionIndividualsChartInstance.destroy();
        this.rawActivityChartInstance = this.myFactionIndividualsChartInstance = this.activityDifferenceChartInstance = this.enemyFactionIndividualsChartInstance = null;
    },

    populateIndividualComparisonDropdowns: function(myMembers, enMembers, myName, enName) {
        const compareUser1Select = document.getElementById('amb-war-compareUser1');
        const compareUser2Select = document.getElementById('amb-war-compareUser2');
        compareUser1Select.innerHTML = `<option value="">${myName || 'My Faction'} Member</option>`;
        compareUser2Select.innerHTML = `<option value="">${enName || 'Enemy Faction'} Member</option>`;

        if (myMembers) myMembers.sort((a, b) => a.name.localeCompare(b.name)).forEach(m => {
            const o = document.createElement('option');
            o.value = m.id; o.textContent = m.display; compareUser1Select.appendChild(o);
        });
        if (enMembers) enMembers.sort((a, b) => a.name.localeCompare(b.name)).forEach(m => {
            const o = document.createElement('option');
            o.value = m.id; o.textContent = m.display; compareUser2Select.appendChild(o);
        });
    },

    updateIndividualCharts: function() {
        const myId = document.getElementById('amb-war-compareUser1').value;
        const enId = document.getElementById('amb-war-compareUser2').value;
        const labels = this.historicalData.map(r => r.formattedTime);

        if (this.myFactionIndividualsChartInstance) {
            this.myFactionIndividualsChartInstance.data.labels = labels;
            this.myFactionIndividualsChartInstance.data.datasets = [];
            if (myId) {
                const data = this.historicalData.map(r => r.myFaction.individuals.find(m => m.id === myId)?.active ?? 0);
                this.myFactionIndividualsChartInstance.data.datasets.push({ label: 'My Faction', data: data, type: 'bar', backgroundColor: 'rgba(0, 168, 255, 0.2)', borderColor: '#00a8ff' });
            }
            this.myFactionIndividualsChartInstance.update();
        }
        if (this.enemyFactionIndividualsChartInstance) {
            this.enemyFactionIndividualsChartInstance.data.labels = labels;
            this.enemyFactionIndividualsChartInstance.data.datasets = [];
            if (enId) {
                const data = this.historicalData.map(r => r.enemyFaction.individuals.find(m => m.id === enId)?.active ?? 0);
                this.enemyFactionIndividualsChartInstance.data.datasets.push({ label: 'Enemy Faction', data: data, type: 'bar', backgroundColor: 'rgba(220, 53, 69, 0.2)', borderColor: '#dc3545' });
            }
            this.enemyFactionIndividualsChartInstance.update();
        }
    },

    getChartOptions: function(title) {
        return {
            responsive: true, maintainAspectRatio: false,
            plugins: { title: { display: true, text: title, color: '#00a8ff', font: { size: 16 } }, legend: { labels: { color: '#eee' } } },
            scales: { x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#eee' } }, y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#eee' } } }
        };
    },

    initializeChart: function(canvasId, type, data, options) {
        const canvas = document.getElementById(canvasId);
        if (canvas) return new Chart(canvas.getContext('2d'), { type, data, options });
        return null;
    },

    updateCharts: function() {
        if (this.historicalData.length === 0) { this.destroyCharts(); return; }
        const labels = this.historicalData.map(r => r.formattedTime);
        const myData = this.historicalData.map(r => r.myFaction.activeMembers);
        const enData = this.historicalData.map(r => r.enemyFaction.activeMembers);
        const diffData = this.historicalData.map(r => r.activityDifference);
        this.destroyCharts();
        this.rawActivityChartInstance = this.initializeChart('amb-war-rawActivityChart', 'line', { labels: labels, datasets: [{ label: 'My Faction', data: myData, borderColor: '#00a8ff', backgroundColor: 'rgba(0,168,255,0.2)', tension: 0.3, fill: true }, { label: 'Enemy Faction', data: enData, borderColor: '#dc3545', backgroundColor: 'rgba(220,53,69,0.2)', tension: 0.3, fill: true }] }, this.getChartOptions('Raw Activity Data'));
        this.activityDifferenceChartInstance = this.initializeChart('amb-war-activityDifferenceChart', 'bar', { labels: labels, datasets: [{ label: 'Activity Difference', data: diffData, backgroundColor: diffData.map(v => v >= 0 ? 'rgba(0, 168, 255, 0.2)' : 'rgba(220, 53, 69, 0.2)'), borderColor: diffData.map(v => v >= 0 ? '#00a8ff' : '#dc3545') }] }, this.getChartOptions('Activity Difference'));
        this.myFactionIndividualsChartInstance = this.initializeChart('amb-war-myFactionIndividualsChart', 'bar', {}, this.getChartOptions('My Faction Individuals'));
        this.enemyFactionIndividualsChartInstance = this.initializeChart('amb-war-enemyFactionIndividualsChart', 'bar', {}, this.getChartOptions('Enemy Faction Individuals'));
        this.updateIndividualCharts();
    },

    fetchAndProcessFactionActivity: async function() {
        this.updateStatus("Running...");
        try {
            const myFid = document.getElementById('amb-war-myFactionID').value.trim();
            const enFid = document.getElementById('amb-war-enemyFactionID').value.trim();
            if (myFid === '' || enFid === '') {
                this.updateStatus("Error: Faction IDs missing");
                document.getElementById('amb-war-stopButton').click(); return;
            }
            const myResp = await this.fetchTornApi(`https://api.torn.com/faction/${myFid}?selections=basic&key=${amb.settings.apiKey}`);
            const myData = this.processFactionDataFromTornApi(myFid, myResp);
            const enResp = await this.fetchTornApi(`https://api.torn.com/faction/${enFid}?selections=basic&key=${amb.settings.apiKey}`);
            const enData = this.processFactionDataFromTornApi(enFid, enResp);

            const now = new Date();
            document.getElementById('amb-war-lastRefreshTime').textContent = this.formatTimestamp(now);
            const myActive = myData.members.filter(m => m.active === 1).length;
            const enActive = enData.members.filter(m => m.active === 1).length;
            document.getElementById('amb-war-modal-faction-name').textContent = `${myData.factionName} vs ${enData.factionName}`;
            document.getElementById('amb-war-modal-member-count').textContent = `${myData.members.length} vs ${enData.members.length} members`;

            const record = {
                timestamp: now.getTime(), formattedTime: this.formatTimestamp(now),
                myFaction: { id: myFid, name: myData.factionName, totalMembers: myData.members.length, activeMembers: myActive, individuals: myData.members },
                enemyFaction: { id: enFid, name: enData.factionName, totalMembers: enData.members.length, activeMembers: enActive, individuals: enData.members },
                activityDifference: myActive - enActive
            };
            this.historicalData.push(record);
            GM_setValue(this.DATA_KEY, this.historicalData);
            this.updateStatus("Running...");
            this.updateCharts();
            this.populateIndividualComparisonDropdowns(myData.members, enData.members, myData.factionName, enData.factionName);
        } catch (e) {
            this.updateStatus(`Error: ${e.message}`);
            document.getElementById('amb-war-stopButton').click();
        }
    },

    enterRunningState: function(sessionState) {
        if (this.fetchInterval) clearInterval(this.fetchInterval);
        document.getElementById('amb-war-myFactionID').value = sessionState.myFactionID;
        document.getElementById('amb-war-enemyFactionID').value = sessionState.enemyFactionID;
        document.getElementById('amb-war-activityInterval').value = sessionState.interval;
        if (sessionState.autoStopDuration) {
            document.getElementById('amb-war-stopTimerHours').value = sessionState.autoStopDuration;
        }
        this.fetchAndProcessFactionActivity();
        this.fetchInterval = setInterval(() => this.fetchAndProcessFactionActivity(), sessionState.interval * 60 * 1000);
        if (sessionState.autoStopTime) {
            this.startAutoStopTimer(sessionState.autoStopTime);
        }
        this.updateStatus("Running...");
        document.getElementById('amb-war-startButton').disabled = true;
        document.getElementById('amb-war-stopButton').disabled = false;
        document.getElementById('amb-war-myFactionID').readOnly = true;
        document.getElementById('amb-war-enemyFactionID').readOnly = true;
        document.getElementById('amb-war-activityInterval').disabled = true;
        document.getElementById('amb-war-stopTimerHours').disabled = true;
    },

    enterStoppedState: function() {
        if (this.fetchInterval) clearInterval(this.fetchInterval);
        this.fetchInterval = null;
        this.stopAutoStopTimer();
        this.clearSessionState();
        this.updateStatus("Stopped");
        document.getElementById('amb-war-startButton').disabled = !amb.settings.apiKey;
        document.getElementById('amb-war-stopButton').disabled = true;
        document.getElementById('amb-war-myFactionID').readOnly = false;
        document.getElementById('amb-war-enemyFactionID').readOnly = false;
        document.getElementById('amb-war-activityInterval').disabled = false;
        document.getElementById('amb-war-stopTimerHours').disabled = false;
    },

    generateAndDownloadReport: function() {
        if (this.historicalData.length === 0) { return alert("No data recorded to generate a report."); }
        const myFactionName = this.historicalData[0].myFaction.name || 'My Faction';
        const enemyFactionName = this.historicalData[0].enemyFaction.name || 'Enemy Faction';
        let csvContent = "data:text/csv;charset=utf-8,";
        const headers = ["Timestamp", `${myFactionName} Active`, `${enemyFactionName} Active`, "Difference"];
        csvContent += headers.join(",") + "\r\n";
        this.historicalData.forEach(row => {
            const csvRow = [`"${new Date(row.timestamp).toLocaleString()}"`, row.myFaction.activeMembers, row.enemyFaction.activeMembers, row.activityDifference].join(",");
            csvContent += csvRow + "\r\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `War_Activity_Report_${myFactionName}_vs_${enemyFactionName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

    // ===================================================================
    // Big Brother Module
    // ===================================================================
    amb.modules.brother = {
        friendlyMembersDataCache: [],
        currentSort: { column: 'total', direction: 'desc' },
        init: function() {
            this.createUI();
            this.attachEventListeners();
        },
        createUI: function() {
            if (document.getElementById('amb-brother-modal-overlay')) return;
            const uiHtml = `
                <div id="amb-brother-modal-overlay" class="amb-modal-overlay">
                    <div id="amb-brother-modal-content" class="amb-modal-content">
                        <div class="amb-modal-header" id="amb-brother-modal-content-header">
                            <div class="amb-modal-header-title">AmbAssist Utilities</div>
                            <div class="amb-modal-main-title"><h3 id="amb-brother-modal-faction-name">Faction</h3><small id="amb-brother-modal-member-count">0 members</small></div>
                            <button id="amb-brother-modal-close" class="amb-panel-close-btn">&times;</button>
                        </div>
                        <div class="amb-modal-table-container">
                            <table class="amb-brother-table" id="amb-brother-friendly-members-table">
                                <thead>
                                    <tr>
                                        <th data-sort-key="name">Name</th><th data-sort-key="lastAction">Last Action</th><th data-sort-key="strength">Strength</th><th data-sort-key="dexterity">Dexterity</th><th data-sort-key="speed">Speed</th><th data-sort-key="defense">Defense</th><th data-sort-key="total">Total</th><th data-sort-key="status">Status</th><th data-sort-key="nerve">Nerve</th><th data-sort-key="energy">Energy</th><th data-sort-key="drug">Drug CD</th>
                                    </tr>
                                </thead>
                                <tbody id="amb-brother-friendly-members-tbody"></tbody>
                            </table>
                        </div>
                        <div class="amb-modal-footer"><button id="amb-brother-downloadBtn" class="amb-action-button">Download PNG</button></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', uiHtml);
            amb.utils.dragElement(document.getElementById("amb-brother-modal-content"));
        },
        attachEventListeners: function() {
            document.getElementById('amb-brother-modal-close').addEventListener('click', () => this.closeModal());
            document.getElementById('amb-brother-friendly-members-table').addEventListener('click', (event) => {
                const header = event.target.closest('th');
                if (!header || !header.dataset.sortKey) return;
                const sortKey = header.dataset.sortKey;
                if (this.currentSort.column === sortKey) {
                    this.currentSort.direction = this.currentSort.direction === 'desc' ? 'asc' : 'desc';
                } else {
                    this.currentSort.column = sortKey;
                    this.currentSort.direction = (sortKey === 'name' || sortKey === 'status') ? 'asc' : 'desc';
                }
                this.renderTable();
            });
            document.getElementById('amb-brother-downloadBtn').addEventListener('click', () => {
                const tableContainer = document.querySelector('#amb-brother-modal-overlay .amb-modal-table-container');
                const factionName = document.getElementById('amb-brother-modal-faction-name').textContent.replace(/[^a-zA-Z0-9]/g, '_');
                const headerClone = document.querySelector('#amb-brother-modal-content-header').cloneNode(true);
                headerClone.style.borderRadius = '5px 5px 0 0';
                const tempContainer = document.createElement('div');
                tempContainer.style.width = tableContainer.offsetWidth + 'px';
                tempContainer.style.background = '#2e2e2e';
                tempContainer.appendChild(headerClone);
                tempContainer.appendChild(tableContainer.cloneNode(true));
                document.body.appendChild(tempContainer);
                html2canvas(tempContainer, { scale: 2, useCORS: true, scrollY: -window.scrollY, windowWidth: tempContainer.scrollWidth, windowHeight: tempContainer.scrollHeight }).then(canvas => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = `${factionName}_stats.png`;
                    link.click();
                    document.body.removeChild(tempContainer);
                });
            });
        },
        showModal: function() {
            const modal = document.getElementById('amb-brother-modal-overlay');
            if (modal) {
                modal.style.display = 'flex';
                this.fetchData();
            }
        },
        closeModal: function() {
            const modal = document.getElementById('amb-brother-modal-overlay');
            if (modal) modal.style.display = 'none';
        },
        formatBattleStats: function(num) {
            if (isNaN(num) || num === 0) return '0';
            if (num >= 1e9) return (num / 1e9).toFixed(2) + 'b';
            if (num >= 1e6) return (num / 1e6).toFixed(2) + 'm';
            if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
            return num.toLocaleString();
        },
        parseStatValue: function(statString) {
            if (typeof statString === 'number') return statString;
            if (typeof statString !== 'string' || statString.trim() === '' || statString.toLowerCase() === 'n/a') return 0;
            let value = statString.trim().toLowerCase();
            let multiplier = 1;
            if (value.endsWith('k')) { multiplier = 1000; value = value.slice(0, -1); }
            else if (value.endsWith('m')) { multiplier = 1000000; value = value.slice(0, -1); }
            else if (value.endsWith('b')) { multiplier = 1000000000; value = value.slice(0, -1); }
            const number = parseFloat(value.replace(/,/g, ''));
            return isNaN(number) ? 0 : number * multiplier;
        },
        applyStatColorCoding: function(tableElement, columnIndices) {
            if (!tableElement || !columnIndices || columnIndices.length === 0) return;
            tableElement.classList.add('amb-brother-table-striped');
            const selector = columnIndices.map(index => `tbody td:nth-child(${index})`).join(', ');
            const statCells = tableElement.querySelectorAll(selector);
            statCells.forEach(cell => {
                for (let i = 1; i <= 14; i++) cell.classList.remove(`amb-brother-stat-tier-${i}`);
                cell.classList.remove('amb-brother-stat-cell');
                const value = this.parseStatValue(cell.textContent);
                let tierClass = '';
                if (value >= 10e9) { tierClass = 'amb-brother-stat-tier-14'; }
                else if (value >= 5e9) { tierClass = 'amb-brother-stat-tier-13'; }
                else if (value >= 2.5e9) { tierClass = 'amb-brother-stat-tier-12'; }
                else if (value >= 1e9) { tierClass = 'amb-brother-stat-tier-11'; }
                else if (value >= 500e6) { tierClass = 'amb-brother-stat-tier-10'; }
                else if (value >= 250e6) { tierClass = 'amb-brother-stat-tier-9'; }
                else if (value >= 100e6) { tierClass = 'amb-brother-stat-tier-8'; }
                else if (value >= 50e6) { tierClass = 'amb-brother-stat-tier-7'; }
                else if (value >= 10e6) { tierClass = 'amb-brother-stat-tier-6'; }
                else if (value >= 5e6) { tierClass = 'amb-brother-stat-tier-5'; }
                else if (value >= 1e6) { tierClass = 'amb-brother-stat-tier-4'; }
                else if (value >= 100e3) { tierClass = 'amb-brother-stat-tier-3'; }
                else if (value >= 10e3) { tierClass = 'amb-brother-stat-tier-2'; }
                else if (value > 0) { tierClass = 'amb-brother-stat-tier-1'; }
                if (tierClass) {
                    cell.classList.add(tierClass, 'amb-brother-stat-cell');
                }
            });
        },
        formatRelativeTime: function(timestampInSeconds) {
            if (!timestampInSeconds || timestampInSeconds === 0) return "N/A";
            const diffSeconds = Math.floor(Date.now() / 1000) - timestampInSeconds;
            if (diffSeconds < 60) return "Now";
            if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
            if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
            return `${Math.floor(diffSeconds / 86400)}d ago`;
        },
        formatStatus: function(status) {
            if (!status || !status.description) return 'N/A';
            const desc = status.description;
            const state = status.state;
            if (state === 'Traveling' || state === 'Abroad') {
                if (desc.includes('Switzerland')) return 'Travel: Swiss';
                if (desc.includes('Argentina')) return 'Travel: Arg';
                if (desc.includes('Canada')) return 'Travel: Can';
                if (desc.includes('Mexico')) return 'Travel: Mex';
                if (desc.includes('Japan')) return 'Travel: Jap';
                if (desc.includes('China')) return 'Travel: Chi';
                if (desc.includes('Hawaii')) return 'Travel: Haw';
                if (desc.includes('UAE')) return 'Travel: UAE';
                if (desc.includes('South Africa')) return 'Travel: SA';
                if (desc.includes('Cayman Islands')) return 'Travel: CI';
                if (desc.includes('United Kingdom')) return 'Travel: UK';
                return 'Traveling';
            }
            if (desc.includes('Jail') || desc.includes('Prison')) return 'Jail';
            if (desc.includes('Hospital') || desc.includes('Revive')) return 'Hospital';
            if (desc === 'Okay') return 'Okay';
            return 'Other';
        },
        showLoadingMessage: function(message) {
            const tbody = document.getElementById('amb-brother-friendly-members-tbody');
            if (tbody) {
                const colspan = tbody.previousElementSibling.firstElementChild.children.length;
                tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding: 40px;">${message}</td></tr>`;
            }
        },
        renderTable: function() {
            const tbody = document.getElementById('amb-brother-friendly-members-tbody');
            const table = document.getElementById('amb-brother-friendly-members-table');
            const tableHeaders = document.querySelectorAll('#amb-brother-friendly-members-table th[data-sort-key]');
            if (!tbody || !table) return;
            const getStat = (member, stat) => this.parseStatValue(member.fullUserData?.personalstats?.[stat] || 0);
            this.friendlyMembersDataCache.sort((a, b) => {
                let valA, valB;
                switch (this.currentSort.column) {
                    case 'name': valA = a.name || ''; valB = b.name || ''; return valA.localeCompare(valB);
                    case 'lastAction': valA = a.fullUserData?.last_action?.timestamp || 0; valB = b.fullUserData?.last_action?.timestamp || 0; return valB - valA;
                    case 'strength': return getStat(b, 'strength') - getStat(a, 'strength');
                    case 'dexterity': return getStat(b, 'dexterity') - getStat(a, 'dexterity');
                    case 'speed': return getStat(b, 'speed') - getStat(a, 'speed');
                    case 'defense': return getStat(b, 'defense') - getStat(a, 'defense');
                    case 'status': valA = a.fullUserData?.status?.description || ''; valB = b.fullUserData?.status?.description || ''; return valA.localeCompare(valB);
                    case 'nerve': valA = a.fullUserData?.bars?.nerve?.current || 0; valB = b.fullUserData?.bars?.nerve?.current || 0; return valB - valA;
                    case 'energy': valA = a.fullUserData?.bars?.energy?.current || 0; valB = b.fullUserData?.bars?.energy?.current || 0; return valB - valA;
                    case 'drug': valA = a.fullUserData?.cooldowns?.drug || 0; valB = b.fullUserData?.cooldowns?.drug || 0; return valB - valA;
                    default: return b.totalStats - a.totalStats;
                }
            });
            if (this.currentSort.direction === 'asc') {
                this.friendlyMembersDataCache.reverse();
            }
            tableHeaders.forEach(th => {
                const sortKey = th.dataset.sortKey;
                th.textContent = th.textContent.replace(/ [▼▲↕]/g, '');
                if (sortKey === this.currentSort.column) {
                    th.textContent += this.currentSort.direction === 'desc' ? ' ▼' : ' ▲';
                } else {
                    th.textContent += ' ↕';
                }
            });
            tbody.innerHTML = this.friendlyMembersDataCache.map(member => {
                const { name, fullUserData, totalStats, player_id } = member;
                const profileUrl = `https://www.torn.com/profiles.php?XID=${player_id}`;
                const lastAction = this.formatRelativeTime(fullUserData?.last_action?.timestamp);
                const status = this.formatStatus(fullUserData?.status);
                let statusClass = 'amb-brother-status-okay';
                if (status.includes('Hosp')) statusClass = 'amb-brother-status-hospital';
                else if (status.includes('Jail')) statusClass = 'amb-brother-status-jail';
                else if (status.includes('Travel')) statusClass = 'amb-brother-status-traveling';
                else if (status !== 'Okay') statusClass = 'amb-brother-status-other';
                const drugCDValue = fullUserData?.cooldowns?.drug || 0;
                let drugCD = 'None 🍁';
                let drugCDClass = 'amb-brother-status-okay';
                if (drugCDValue > 0) {
                    const h = Math.floor(drugCDValue / 3600);
                    const m = Math.floor((drugCDValue % 3600) / 60);
                    drugCD = `${h > 0 ? h + 'h' : ''} ${m > 0 ? m + 'm' : ''}`.trim() || '<1m';
                    drugCDClass = 'amb-brother-status-other';
                }
                return `
                    <tr data-id="${player_id}">
                        <td><a href="${profileUrl}" target="_blank">${name}</a></td>
                        <td>${lastAction}</td>
                        <td>${this.formatBattleStats(getStat(member, 'strength'))}</td>
                        <td>${this.formatBattleStats(getStat(member, 'dexterity'))}</td>
                        <td>${this.formatBattleStats(getStat(member, 'speed'))}</td>
                        <td>${this.formatBattleStats(getStat(member, 'defense'))}</td>
                        <td>${this.formatBattleStats(totalStats)}</td>
                        <td class="${statusClass}">${status}</td>
                        <td>${fullUserData?.bars?.nerve?.current ?? 'N/A'}/${fullUserData?.bars?.nerve?.maximum ?? 'N/A'}</td>
                        <td>${fullUserData?.bars?.energy?.current ?? 'N/A'}/${fullUserData?.bars?.energy?.maximum ?? 'N/A'}</td>
                        <td class="${drugCDClass}">${drugCD}</td>
                    </tr>
                `;
            }).join('');
            this.applyStatColorCoding(table, [3, 4, 5, 6, 7]);
        },
        makeRequest: function(endpoint) {
            if (!amb.settings.apiKey) {
                alert("API Key is not set. Long-press an icon to open settings.");
                return Promise.reject('No API Key');
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://mytornpa.com/.netlify/functions/${endpoint}`,
                    headers: { "Authorization": `Bearer ${amb.settings.apiKey}`, "Content-Type": "application/json" },
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(JSON.parse(response.responseText));
                        } else {
                            const errorData = JSON.parse(response.responseText);
                            reject(errorData);
                        }
                    },
                    onerror: (error) => reject(error)
                });
            });
        },
        fetchData: async function() {
            this.showLoadingMessage('Fetching data from mytornpa.com...');
            document.getElementById('amb-brother-modal-faction-name').textContent = 'Loading...';
            document.getElementById('amb-brother-modal-member-count').textContent = '';
            try {
                const data = await this.makeRequest('getFactionStats');
                document.getElementById('amb-brother-modal-faction-name').textContent = data.factionName || 'Unknown Faction';
                document.getElementById('amb-brother-modal-member-count').textContent = `${data.members.length} members`;
                this.friendlyMembersDataCache = data.members.map(member => {
                    const pStats = member.fullUserData?.personalstats || {};
                    const total = (pStats.strength || 0) + (pStats.defense || 0) + (pStats.speed || 0) + (pStats.dexterity || 0);
                    return { ...member, totalStats: total };
                });
                this.renderTable();
            } catch (error) {
                this.showLoadingMessage(`Error: ${error.error || 'Failed to fetch data.'}`);
                document.getElementById('amb-brother-modal-faction-name').textContent = 'Error';
            }
        }
    };

    // ===================================================================
    // Script Initialization
    // ===================================================================

    setTimeout(() => amb.init(), 500);

})();
// ==UserScript==
// @name         Sportlogiq: Replay Control
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hold hotkeys to scrub forward/backward, release to auto-jump back to the start point.
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554200/Sportlogiq%3A%20Replay%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/554200/Sportlogiq%3A%20Replay%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #arc-settings-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #2c3e50; color: #ecf0f1; border: 1px solid #7f8c8d; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); z-index: 9999; padding: 20px; width: 420px; font-family: sans-serif; }
        #arc-settings-modal h2 { margin-top: 0; border-bottom: 1px solid #7f8c8d; padding-bottom: 10px; }
        #arc-settings-modal .arc-form-group { margin-bottom: 15px; }
        #arc-settings-modal label { display: block; margin-bottom: 5px; font-size: 14px; }
        #arc-settings-modal label small { font-size: 11px; opacity: 0.7; }
        #arc-settings-modal input[type="checkbox"] { margin-right: 5px; vertical-align: middle; }
        #arc-settings-modal select, #arc-settings-modal input[type="text"], #arc-settings-modal input[type="number"] { width: 100%; padding: 8px; background-color: #34495e; color: #ecf0f1; border: 1px solid #7f8c8d; border-radius: 4px; box-sizing: border-box; }
        #arc-settings-modal input.arc-hotkey-input { text-align: center; font-weight: bold; cursor: pointer; }
        #arc-settings-modal .arc-split-group { display: flex; gap: 10px; }
        #arc-settings-modal .arc-button-group { text-align: right; margin-top: 20px; }
        #arc-settings-modal button { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; background-color: #3498db; color: white; margin-left: 10px; }
        #arc-settings-modal button.arc-close-btn { background-color: #e74c3c; }
        .arc-hidden { display: none; }
    `);

    const SettingsManager = {
        modal: null,
        show() { if (!this.modal) this.create(); document.body.appendChild(this.modal); this.loadValues(); this.attachListeners(); },
        hide() { if (this.modal) this.modal.remove(); },
        create() {
            this.modal = document.createElement('div');
            this.modal.id = 'arc-settings-modal';
            this.modal.innerHTML = `
                <h2>Advanced Replay Control Settings</h2>
                <div class="arc-form-group"><label for="arc-mode-select">Control Mode:</label><select id="arc-mode-select"><option value="mouse">Side Mouse Buttons</option><option value="keyboard">Keyboard</option></select></div>
                <div id="arc-mouse-settings" class="arc-hidden">
                    <div class="arc-form-group">
                        <label for="arc-invert-mouse">
                            <input type="checkbox" id="arc-invert-mouse"> Invert Side Mouse Buttons
                            <small>(Default: Back Btn = Forward, Fwd Btn = Backward)</small>
                        </label>
                    </div>
                </div>
                <div id="arc-keyboard-settings" class="arc-hidden">
                    <div class="arc-split-group">
                        <div class="arc-form-group"><label for="arc-backward-key">Backward Key</label><input type="text" id="arc-backward-key" class="arc-hotkey-input" readonly></div>
                        <div class="arc-form-group"><label for="arc-forward-key">Forward Key</label><input type="text" id="arc-forward-key" class="arc-hotkey-input" readonly></div>
                    </div>
                </div>
                <hr style="border-color: #7f8c8d; margin: 20px 0;">
                <div class="arc-split-group">
                    <div class="arc-form-group"><label for="arc-scrub-speed">Scrub Speed <small>(ms)</small></label><input type="number" id="arc-scrub-speed" min="10"></div>
                    <div class="arc-form-group"><label for="arc-jump-speed">Jump Back Speed <small>(ms)</small></label><input type="number" id="arc-jump-speed" min="10"></div>
                </div>
                <div class="arc-form-group"><label for="arc-continuation-delay">Return Delay <small>(ms)</small></label><input type="number" id="arc-continuation-delay" min="0"></div>
                <div class="arc-button-group"><button id="arc-save-btn">Save & Reload</button><button id="arc-close-btn" class="arc-close-btn">Cancel</button></div>`;
        },
        loadValues() {
            const config = ReplayControl.config;
            document.getElementById('arc-mode-select').value = config.mode;
            document.getElementById('arc-invert-mouse').checked = config.invertMouse;
            document.getElementById('arc-backward-key').value = config.backwardKey;
            document.getElementById('arc-forward-key').value = config.forwardKey;
            document.getElementById('arc-scrub-speed').value = config.scrubSpeed;
            document.getElementById('arc-jump-speed').value = config.jumpSpeed;
            document.getElementById('arc-continuation-delay').value = config.continuationDelay;
            this.toggleModeView(config.mode);
        },
        toggleModeView(mode) {
            document.getElementById('arc-mouse-settings').classList.toggle('arc-hidden', mode !== 'mouse');
            document.getElementById('arc-keyboard-settings').classList.toggle('arc-hidden', mode !== 'keyboard');
        },
        attachListeners() {
            this.modal.querySelector('#arc-close-btn').addEventListener('click', () => this.hide());
            this.modal.querySelector('#arc-save-btn').addEventListener('click', () => this.save());
            const modeSelect = this.modal.querySelector('#arc-mode-select');
            modeSelect.addEventListener('change', () => this.toggleModeView(modeSelect.value));
            ['arc-backward-key', 'arc-forward-key'].forEach(id => {
                const input = document.getElementById(id);
                input.addEventListener('click', () => { input.value = 'Press a key...'; input.focus(); });
                input.addEventListener('keydown', e => { e.preventDefault(); input.value = e.code; input.blur(); });
                input.addEventListener('blur', () => { if (input.value === 'Press a key...') input.value = GM_getValue(`replayControl_${id.replace('arc-','')}`, ''); });
            });
        },
        save() {
            GM_setValue('replayControl_mode', document.getElementById('arc-mode-select').value);
            GM_setValue('replayControl_invertMouse', document.getElementById('arc-invert-mouse').checked);
            GM_setValue('replayControl_backwardKey', document.getElementById('arc-backward-key').value);
            GM_setValue('replayControl_forwardKey', document.getElementById('arc-forward-key').value);
            GM_setValue('replayControl_scrubSpeed', parseInt(document.getElementById('arc-scrub-speed').value, 10));
            GM_setValue('replayControl_jumpSpeed', parseInt(document.getElementById('arc-jump-speed').value, 10));
            GM_setValue('replayControl_continuationDelay', parseInt(document.getElementById('arc-continuation-delay').value, 10));
            alert('Settings saved. Page will now reload.'); window.location.reload();
        }
    };

    const ReplayControl = {
        config: {},
        state: { scrubInterval: null, startTimestamp: null, returnTimer: null, isScrubbing: false },
        
        init() {
            this.loadConfig();
            const readyCheck = setInterval(() => { if (document.getElementById('current-frame') && document.getElementById('m-1f')) { clearInterval(readyCheck); this.addListeners(); }}, 500);
        },
        loadConfig() {
            this.config = {
                mode: GM_getValue('replayControl_mode', 'mouse'),
                invertMouse: GM_getValue('replayControl_invertMouse', false),
                backwardKey: GM_getValue('replayControl_backwardKey', 'KeyA'),
                forwardKey: GM_getValue('replayControl_forwardKey', 'KeyD'),
                scrubSpeed: GM_getValue('replayControl_scrubSpeed', 80),
                jumpSpeed: GM_getValue('replayControl_jumpSpeed', 20),
                continuationDelay: GM_getValue('replayControl_continuationDelay', 700),
            };
        },
        addListeners() {
            const keys = { back: this.config.backwardKey, fwd: this.config.forwardKey };
            const mouse = {
                back: this.config.invertMouse ? 3 : 4, 
                fwd: this.config.invertMouse ? 4 : 3   
            };

            document.addEventListener('mousedown', e => {
                if (this.config.mode !== 'mouse' || this.state.isScrubbing) return;
                if (e.button === mouse.back) this.startScrub(e, 'backward');
                else if (e.button === mouse.fwd) this.startScrub(e, 'forward');
            });
            document.addEventListener('keydown', e => {
                if (this.config.mode !== 'keyboard' || e.repeat || this.state.isScrubbing) return;
                if (e.code === keys.back) this.startScrub(e, 'backward');
                else if (e.code === keys.fwd) this.startScrub(e, 'forward');
            });
            document.addEventListener('mouseup', e => {
                if (this.config.mode !== 'mouse' || !this.state.isScrubbing) return;
                if (e.button === mouse.back || e.button === mouse.fwd) this.stopScrub(e);
            });
            document.addEventListener('keyup', e => {
                if (this.config.mode !== 'keyboard' || !this.state.isScrubbing) return;
                if (e.code === keys.back || e.code === keys.fwd) this.stopScrub(e);
            });
            document.addEventListener('contextmenu', e => { if (this.state.isScrubbing && this.config.mode === 'mouse') e.preventDefault(); });
        },
        startScrub(event, direction) {
            event.preventDefault();
            this.state.isScrubbing = true;
            clearTimeout(this.state.returnTimer);
            if (!this.state.startTimestamp) this.state.startTimestamp = document.getElementById('current-frame')?.textContent.trim();
            const btnId = direction === 'backward' ? 'm-1f' : 'p-1f';
            const btn = document.getElementById(btnId);
            if (!btn) return;
            this.state.scrubInterval = setInterval(() => btn.click(), this.config.scrubSpeed);
        },
        stopScrub(event) {
            event.preventDefault();
            clearInterval(this.state.scrubInterval);
            this.state.isScrubbing = false;
            const finalTimestamp = document.getElementById('current-frame')?.textContent.trim();
            if (this.state.startTimestamp && finalTimestamp !== this.state.startTimestamp) {
                this.state.returnTimer = setTimeout(() => this.jumpBack(), this.config.continuationDelay);
            } else {
                this.state.startTimestamp = null;
            }
        },
        jumpBack() {
            if (!this.state.startTimestamp) return;
            
            const startFrame = this.timestampToFrames(this.state.startTimestamp);
            let initialCurrentFrame;
            try {
                initialCurrentFrame = this.timestampToFrames(document.getElementById('current-frame')?.textContent.trim());
            } catch (e) {
                this.state.startTimestamp = null;
                return;
            }
            
            if (initialCurrentFrame === startFrame) { this.state.startTimestamp = null; return; }

            const isMovingBackward = initialCurrentFrame > startFrame;
            const buttonId = isMovingBackward ? 'm-1f' : 'p-1f';
            const button = document.getElementById(buttonId);
            if (!button) { this.state.startTimestamp = null; return; }

            const jumpInterval = setInterval(() => {
                let currentFrame;
                try {
                    currentFrame = this.timestampToFrames(document.getElementById('current-frame')?.textContent.trim());
                } catch(e) {
                    clearInterval(jumpInterval); this.state.startTimestamp = null; return;
                }

                const shouldStop = isMovingBackward ? (currentFrame <= startFrame) : (currentFrame >= startFrame);

                if (shouldStop) {
                    clearInterval(jumpInterval);
                    this.state.startTimestamp = null;
                } else {
                    button.click();
                }
            }, this.config.jumpSpeed);
        },
        timestampToFrames(ts, fps = 30) {
            const parts = ts.split(':').map(Number);
            if (parts.length < 4 || parts.some(isNaN)) throw new Error('Invalid timestamp');
            return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * fps + parts[3];
        }
    };
    
    GM_registerMenuCommand('Open Replay Settings', () => SettingsManager.show());
    ReplayControl.init();
})();
// ==UserScript==
// @name         Google AI Studio - Auto Settings (UX Pro - v19.0)
// @namespace    https://github.com/Stranmor/google-ai-studio-auto-settings
// @version      19.0
// @description  Robust settings application with Smart Selectors, MD3 UI, and reliable focus restoration.
// @author       Stranmor
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554936/Google%20AI%20Studio%20-%20Auto%20Settings%20%28UX%20Pro%20-%20v190%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554936/Google%20AI%20Studio%20-%20Auto%20Settings%20%28UX%20Pro%20-%20v190%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ==================== 1. CORE CONFIG & CONSTANTS ====================
    const APP_NAME = 'AI Studio Auto Settings';
    const CONSTANTS = {
        maxAttempts: 50,
        retryDelay: 150,
        waitTimeout: 8000,
        animDuration: 200
    };

    const SELECTORS = {
        panel: 'ms-run-settings',
        toggleBtn: 'button.runsettings-toggle-button',
        closeBtn: 'ms-run-settings button[iconname="close"]',

        // Inputs
        temperature: 'div[data-test-id="temperatureSliderContainer"] input',
        topP: 'ms-slider input[max="1"]', // Top P has max 1, Temp has max 2
        topK: 'input[name="topK"]',
        maxTokens: 'input[name="maxOutputTokens"]',

        // Dropdowns (Text based search is preferred for these)
        mediaRes: { label: 'Media resolution', testId: 'mediaResolution' },
        thinking: { label: 'Thinking level', fallback: 'Thinking' },

        // Toggles (Smart Search Configs)
        toggles: {
            structuredOutput: { label: 'Structured outputs', selector: '.structured-output-toggle' },
            codeExecution: { label: 'Code execution', selector: '.code-execution-toggle' },
            functionCalling: { label: 'Function calling', selector: '.function-calling-toggle' },
            googleSearch: { label: 'Grounding with Google Search', selector: '.search-as-a-tool-toggle' },
            urlContext: { label: 'URL context', selector: 'ms-browse-as-a-tool mat-slide-toggle' },
            safety: { label: 'Safety settings', selector: '.safety-settings' } // Placeholder for future
        },

        // Chat Input for focus
        chatInput: [
            'textarea[aria-label="Type something"]',
            'ms-chunk-input textarea',
            'footer textarea'
        ]
    };

    // ==================== 2. LOGGER & STORAGE ====================
    const Logger = {
        log: (msg) => console.log(`%c[${APP_NAME}] ${msg}`, 'color: #0b57d0; font-weight: bold;'),
        warn: (msg) => console.warn(`%c[${APP_NAME}] ${msg}`, 'color: #e67c73; font-weight: bold;'),
        error: (msg, err) => console.error(`%c[${APP_NAME}] ${msg}`, 'color: #b3261e; font-weight: bold;', err)
    };

    const Store = {
        defaults: {
            ui: { showFab: true, fabPos: { bottom: '80px', left: '24px' } },
            temperature: { value: 1.0, enabled: true },
            topP: { value: 0.00, enabled: true },
            maxOutputTokens: { value: 65536, enabled: true },
            mediaResolution: { value: "Default", enabled: true },
            thinkingLevel: { value: "High", enabled: true },
            googleSearch: { value: true, enabled: true },
            urlContext: { value: false, enabled: true },
            codeExecution: { value: false, enabled: true },
            structuredOutput: { value: false, enabled: true },
            functionCalling: { value: false, enabled: true }
        },
        get() {
            const saved = GM_getValue('as_config_v19', null);
            return saved ? { ...this.defaults, ...saved, ui: { ...this.defaults.ui, ...(saved.ui || {}) } } : JSON.parse(JSON.stringify(this.defaults));
        },
        save(cfg) {
            GM_setValue('as_config_v19', cfg);
        },
        reset() {
            this.save(this.defaults);
        }
    };

    // ==================== 3. UTILITIES ====================
    const Utils = {
        sleep: (ms) => new Promise(r => setTimeout(r, ms)),
        isMobile: () => window.innerWidth < 900,

        /**
         * Waits for an element using MutationObserver (Performance optimized)
         */
        waitFor: (selector, parent = document, timeout = 3000) => {
            return new Promise((resolve) => {
                const el = parent.querySelector(selector);
                if (el) return resolve(el);

                const observer = new MutationObserver(() => {
                    const el = parent.querySelector(selector);
                    if (el) {
                        observer.disconnect();
                        resolve(el);
                    }
                });

                observer.observe(parent, { childList: true, subtree: true });
                setTimeout(() => {
                    observer.disconnect();
                    resolve(null);
                }, timeout);
            });
        },

        /**
         * Sets value on Angular/React controlled inputs
         */
        setNativeValue: (element, value) => {
            if (!element || element.disabled) return false;
            if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
                element = element.querySelector('input');
            }
            if (!element) return false;

            const lastValue = element.value;
            // Loose equality for numbers (1.0 vs 1)
            if (element.type === 'number' || element.type === 'range') {
                if (Math.abs(parseFloat(lastValue) - parseFloat(value)) < 0.001) return true;
            } else {
                if (String(lastValue) === String(value)) return true;
            }

            try {
                const proto = Object.getPrototypeOf(element);
                const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
                if (setter) setter.call(element, value);
                else element.value = value;

                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                element.dispatchEvent(new Event('blur', { bubbles: true }));
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Finds a toggle/element by searching for nearby text labels.
         * This is the "Smart Selector" logic.
         */
        findSmartElement: (config, type = 'toggle') => {
            // 1. Try CSS Selector first (fastest)
            if (config.selector) {
                const el = document.querySelector(config.selector);
                if (el) return el;
            }

            // 2. Try Text Search (Robust fallback)
            if (config.label) {
                // Find all headers/labels
                const candidates = Array.from(document.querySelectorAll('h3, .item-description-title, .v3-font-body, span.title'));
                const target = candidates.find(el => el.textContent.trim().toLowerCase().includes(config.label.toLowerCase()));

                if (target) {
                    // Traverse up to find the container row
                    const container = target.closest('.settings-item') || target.closest('ms-browse-as-a-tool') || target.closest('.settings-tool');
                    if (container) {
                        if (type === 'toggle') return container.querySelector('mat-slide-toggle');
                        if (type === 'select') return container.querySelector('mat-select');
                    }
                }
            }
            return null;
        }
    };

    // ==================== 4. UI MANAGER (MD3 Style) ====================
    class UIManager {
        constructor(callbacks) {
            this.cb = callbacks;
            this.injectStyles();
        }

        injectStyles() {
            if (document.getElementById('as-styles')) return;
            const css = `
                :root { --as-sys-color-primary: #0b57d0; --as-sys-color-on-primary: #ffffff; --as-sys-color-surface: #ffffff; --as-sys-color-surface-container: #f0f4f9; --as-sys-color-outline: #747775; }
                /* Modal */
                .as-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); opacity: 0; animation: as-fade 0.2s forwards; }
                .as-modal { background: var(--as-sys-color-surface); width: 400px; max-height: 85vh; border-radius: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; flex-direction: column; font-family: 'Google Sans', Roboto, sans-serif; transform: scale(0.9); animation: as-scale 0.2s cubic-bezier(0.2,0,0,1) forwards; overflow: hidden; }
                .as-header { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e3e1; }
                .as-header h2 { margin: 0; font-size: 20px; font-weight: 500; color: #1f1f1f; }
                .as-content { padding: 16px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
                .as-section { background: var(--as-sys-color-surface-container); border-radius: 12px; padding: 12px; }
                .as-section-title { font-size: 11px; font-weight: 700; color: var(--as-sys-color-primary); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
                .as-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
                .as-row:last-child { margin-bottom: 0; }
                .as-label { font-size: 14px; color: #1f1f1f; font-weight: 500; }
                .as-input { width: 60px; padding: 6px; border: 1px solid var(--as-sys-color-outline); border-radius: 4px; text-align: center; }
                .as-select { padding: 6px; border-radius: 4px; border: 1px solid var(--as-sys-color-outline); width: 100px; }
                .as-footer { padding: 16px 24px; border-top: 1px solid #e0e3e1; display: flex; justify-content: flex-end; gap: 8px; }
                .as-btn { padding: 8px 20px; border-radius: 100px; border: none; font-weight: 500; cursor: pointer; transition: 0.2s; }
                .as-btn-text { background: transparent; color: var(--as-sys-color-primary); }
                .as-btn-text:hover { background: rgba(11, 87, 208, 0.08); }
                .as-btn-fill { background: var(--as-sys-color-primary); color: var(--as-sys-color-on-primary); }
                .as-btn-fill:hover { box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
                /* Switch */
                .as-switch { position: relative; display: inline-block; width: 32px; height: 18px; }
                .as-switch input { opacity: 0; width: 0; height: 0; }
                .as-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 34px; }
                .as-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
                input:checked + .as-slider { background-color: var(--as-sys-color-primary); }
                input:checked + .as-slider:before { transform: translateX(14px); }
                /* Toast */
                .as-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(20px); background: #303030; color: white; padding: 10px 20px; border-radius: 50px; font-size: 14px; opacity: 0; transition: 0.3s; pointer-events: none; z-index: 1000000; display: flex; align-items: center; gap: 8px; }
                .as-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
                @keyframes as-fade { to { opacity: 1; } }
                @keyframes as-scale { to { transform: scale(1); } }
            `;
            const s = document.createElement('style'); s.id = 'as-styles'; s.textContent = css; document.head.appendChild(s);
        }

        createControl(key, type, options = []) {
            const cfg = Store.get();
            const item = cfg[key];
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
            const disabled = !item.enabled;

            let inputHtml;
            if (type === 'toggle') {
                inputHtml = `<label class="as-switch"><input type="checkbox" id="as-inp-${key}" ${item.value ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span class="as-slider"></span></label>`;
            } else if (type === 'select') {
                inputHtml = `<select id="as-inp-${key}" class="as-select" ${disabled ? 'disabled' : ''}>${options.map(o => `<option value="${o}" ${o === item.value ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
            } else {
                inputHtml = `<input type="number" id="as-inp-${key}" value="${item.value}" class="as-input" step="${key === 'temperature' ? 0.1 : 1}" ${disabled ? 'disabled' : ''}>`;
            }

            return `
            <div class="as-row">
                <div style="display:flex; align-items:center; gap:10px; flex:1">
                    <input type="checkbox" data-key="${key}" ${item.enabled ? 'checked' : ''}
                        onchange="document.getElementById('as-inp-${key}').disabled = !this.checked; this.closest('.as-row').style.opacity = this.checked ? 1 : 0.5">
                    <span class="as-label">${label}</span>
                </div>
                <div style="opacity: ${item.enabled ? 1 : 0.5}">${inputHtml}</div>
            </div>`;
        }

        openSettings() {
            if (document.querySelector('.as-overlay')) return;
            const cfg = Store.get();
            const overlay = document.createElement('div');
            overlay.className = 'as-overlay';

            overlay.innerHTML = `
            <div class="as-modal">
                <div class="as-header"><h2>Auto Settings</h2><button class="as-btn-text" id="as-close">✕</button></div>
                <div class="as-content">
                    <div class="as-section">
                        <div class="as-section-title">UI</div>
                        <div class="as-row"><span class="as-label">Show Floating Button</span><label class="as-switch"><input type="checkbox" id="as-ui-fab" ${cfg.ui.showFab ? 'checked' : ''}><span class="as-slider"></span></label></div>
                    </div>
                    <div class="as-section">
                        <div class="as-section-title">Parameters</div>
                        ${this.createControl('temperature', 'number')}
                        ${this.createControl('topP', 'number')}
                        ${this.createControl('maxOutputTokens', 'number')}
                        ${this.createControl('mediaResolution', 'select', ['Default', 'Low', 'Medium', 'High'])}
                        ${this.createControl('thinkingLevel', 'select', ['Low', 'High'])}
                    </div>
                    <div class="as-section">
                        <div class="as-section-title">Tools</div>
                        ${this.createControl('googleSearch', 'toggle')}
                        ${this.createControl('codeExecution', 'toggle')}
                        ${this.createControl('structuredOutput', 'toggle')}
                        ${this.createControl('functionCalling', 'toggle')}
                        ${this.createControl('urlContext', 'toggle')}
                    </div>
                </div>
                <div class="as-footer">
                    <button class="as-btn as-btn-text" id="as-reset" style="color:#b3261e; margin-right:auto">Reset</button>
                    <button class="as-btn as-btn-text" id="as-cancel">Cancel</button>
                    <button class="as-btn as-btn-fill" id="as-save">Apply</button>
                </div>
            </div>`;

            document.body.appendChild(overlay);

            const close = () => overlay.remove();

            overlay.onclick = (e) => { if(e.target === overlay) close(); };
            document.getElementById('as-close').onclick = close;
            document.getElementById('as-cancel').onclick = close;

            document.getElementById('as-reset').onclick = () => {
                if(confirm('Reset all settings?')) { Store.reset(); close(); this.cb.onSave(); }
            };

            document.getElementById('as-save').onclick = () => {
                const newCfg = { ui: { ...cfg.ui } };
                newCfg.ui.showFab = document.getElementById('as-ui-fab').checked;

                Object.keys(Store.defaults).forEach(k => {
                    if (k === 'ui') return;
                    const enabled = overlay.querySelector(`input[data-key="${k}"]`).checked;
                    const inp = document.getElementById(`as-inp-${k}`);
                    let val = inp.type === 'checkbox' ? inp.checked : (inp.type === 'number' ? parseFloat(inp.value) : inp.value);
                    newCfg[k] = { enabled, value: val };
                });

                Store.save(newCfg);
                close();
                this.cb.onSave();
            };
        }

        showToast(msg, type = 'success') {
            let t = document.querySelector('.as-toast');
            if (!t) { t = document.createElement('div'); t.className = 'as-toast'; document.body.appendChild(t); }
            const icon = type === 'success' ? '✓' : (type === 'error' ? '⚠' : 'ℹ');
            t.innerHTML = `<span>${icon}</span> ${msg}`;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }
    }

    // ==================== 5. SETTINGS APPLIER (LOGIC) ====================
    class Applier {
        constructor() {
            this.openedByScript = false;
        }

        async openPanel() {
            const panel = document.querySelector(SELECTORS.panel);
            if (panel && panel.offsetParent !== null) return true;

            const btn = document.querySelector(SELECTORS.toggleBtn);
            if (!btn) return false;

            this.openedByScript = true;
            btn.click();
            return await Utils.waitFor(SELECTORS.panel);
        }

        async applyDropdown(targetVal, config) {
            try {
                // Try finding by ID first, then by Smart Search
                let select = document.querySelector(`div[data-test-id="${config.testId}"] mat-select`);
                if (!select && config.label) {
                    select = Utils.findSmartElement(config, 'select');
                }

                if (!select) return false;

                const currentText = select.querySelector('.mat-mdc-select-value-text span')?.textContent?.trim();
                if (currentText === targetVal) return true;

                select.click();
                const panel = await Utils.waitFor('.mat-mdc-select-panel');
                if (!panel) return false;

                const options = Array.from(document.querySelectorAll('mat-option'));
                const targetOpt = options.find(o => o.textContent.trim().includes(targetVal));

                if (targetOpt) targetOpt.click();
                else document.querySelector('.cdk-overlay-backdrop')?.click(); // Close if not found
                return true;
            } catch (e) {
                return false;
            }
        }

        async applyToggle(config, targetState) {
            try {
                const toggle = Utils.findSmartElement(config, 'toggle');
                if (!toggle) return false;

                const btn = toggle.querySelector('button[role="switch"]');
                if (!btn || btn.disabled) return true; // Skip if disabled

                const isChecked = btn.getAttribute('aria-checked') === 'true';
                if (isChecked !== targetState) {
                    btn.click();
                    // Fallback: sometimes click needs to be on the component
                    if (btn.getAttribute('aria-checked') === String(isChecked)) {
                        toggle.click();
                    }
                }
                return true;
            } catch (e) {
                return false;
            }
        }

        async run() {
            if (!await this.openPanel()) return false;
            const cfg = Store.get();

            // 1. Expand all sections (Lazy loading fix)
            document.querySelectorAll('.settings-group-header button[aria-expanded="false"]').forEach(b => b.click());
            await Utils.sleep(100); // Give animation a moment

            // 2. Apply Inputs
            if (cfg.temperature.enabled) Utils.setNativeValue(document.querySelector(SELECTORS.temperature), cfg.temperature.value);
            if (cfg.topP.enabled) Utils.setNativeValue(document.querySelector(SELECTORS.topP), cfg.topP.value);
            if (cfg.maxOutputTokens.enabled) Utils.setNativeValue(document.querySelector(SELECTORS.maxTokens), cfg.maxOutputTokens.value);

            // 3. Apply Dropdowns
            if (cfg.mediaResolution.enabled) await this.applyDropdown(cfg.mediaResolution.value, SELECTORS.mediaRes);
            if (cfg.thinkingLevel.enabled) await this.applyDropdown(cfg.thinkingLevel.value, SELECTORS.thinking);

            // 4. Apply Toggles (Iterate safely)
            const toggleMap = {
                structuredOutput: SELECTORS.toggles.structuredOutput,
                codeExecution: SELECTORS.toggles.codeExecution,
                functionCalling: SELECTORS.toggles.functionCalling,
                googleSearch: SELECTORS.toggles.googleSearch,
                urlContext: SELECTORS.toggles.urlContext
            };

            for (const [key, selectorCfg] of Object.entries(toggleMap)) {
                if (cfg[key]?.enabled) {
                    await this.applyToggle(selectorCfg, cfg[key].value);
                }
            }

            // 5. Close if opened by script
            if (Utils.isMobile() && this.openedByScript) {
                const closeBtn = document.querySelector(SELECTORS.closeBtn);
                if (closeBtn) closeBtn.click();
                else document.querySelector(SELECTORS.toggleBtn)?.click();
                this.openedByScript = false;
            }

            // 6. Restore Focus
            for (const sel of SELECTORS.chatInput) {
                const el = document.querySelector(sel);
                if (el) {
                    el.focus({ preventScroll: true });
                    break;
                }
            }
            return true;
        }
    }

    // ==================== 6. MAIN CONTROLLER ====================
    class Main {
        constructor() {
            this.applier = new Applier();
            this.ui = new UIManager({
                onSave: () => { this.updateFab(); this.restart(); }
            });
            this.fab = null;
            this.isApplying = false;
            this.lastUrl = location.href;
            this.runId = 0;

            this.init();
        }

        init() {
            this.createFab();
            this.setupShortcuts();
            this.setupNavigation();
            GM_registerMenuCommand("⚙️ Settings", () => this.ui.openSettings());
            GM_registerMenuCommand("🔄 Re-apply", () => this.restart());

            // Initial run
            setTimeout(() => this.restart(), 1000);
        }

        createFab() {
            if (document.getElementById('as-fab')) return;
            const btn = document.createElement('button');
            btn.id = 'as-fab';
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.49l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`;

            const cfg = Store.get().ui;
            Object.assign(btn.style, {
                position: 'fixed', bottom: cfg.fabPos.bottom, left: cfg.fabPos.left,
                width: '48px', height: '48px', borderRadius: '16px',
                background: '#e8f0fe', color: '#0b57d0', border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer',
                zIndex: '999998', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s, opacity 0.3s'
            });

            // Drag Logic
            let isDragging = false, startX, startY, startLeft, startBottom;
            const onMove = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const cx = e.clientX || e.touches?.[0].clientX;
                const cy = e.clientY || e.touches?.[0].clientY;
                btn.style.left = `${startLeft + (cx - startX)}px`;
                btn.style.bottom = `${startBottom - (cy - startY)}px`;
            };
            const onUp = () => {
                if (isDragging) {
                    isDragging = false;
                    const newCfg = Store.get();
                    newCfg.ui.fabPos = { left: btn.style.left, bottom: btn.style.bottom };
                    Store.save(newCfg);
                }
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onUp);
            };
            const onDown = (e) => {
                if (e.button === 2) return; // Right click
                isDragging = true;
                startX = e.clientX || e.touches?.[0].clientX;
                startY = e.clientY || e.touches?.[0].clientY;
                const rect = btn.getBoundingClientRect();
                startLeft = rect.left;
                startBottom = window.innerHeight - rect.bottom;
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
                document.addEventListener('touchmove', onMove, { passive: false });
                document.addEventListener('touchend', onUp);
            };

            btn.addEventListener('mousedown', onDown);
            btn.addEventListener('touchstart', onDown, { passive: false });
            btn.onclick = (e) => {
                if (Math.abs((e.clientX || e.changedTouches?.[0].clientX) - startX) < 5) this.restart();
            };
            btn.oncontextmenu = (e) => { e.preventDefault(); this.ui.openSettings(); };

            document.body.appendChild(btn);
            this.fab = btn;
            this.updateFab();
        }

        updateFab() {
            if (!this.fab) return;
            const cfg = Store.get().ui;
            this.fab.style.display = cfg.showFab ? 'flex' : 'none';
        }

        setFabStatus(status) {
            if (!this.fab) return;
            this.fab.style.opacity = '1';

            if (status === 'loading') {
                this.fab.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="animation:spin 1s linear infinite"><path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg>`;
                const s = document.createElement('style'); s.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`; document.head.appendChild(s);
            } else if (status === 'success') {
                this.fab.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="#137333"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
                this.fab.style.background = '#e6f4ea';
                setTimeout(() => this.resetFab(), 2000);
            } else if (status === 'error') {
                this.fab.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="#c5221f"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;
                this.fab.style.background = '#fce8e6';
                setTimeout(() => this.resetFab(), 3000);
            }
        }

        resetFab() {
            if (!this.fab) return;
            this.fab.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.49l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`;
            this.fab.style.background = '#e8f0fe';
            this.fab.style.opacity = '0.5'; // Idle state
        }

        setupShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.code === 'KeyS') { e.preventDefault(); this.ui.openSettings(); }
                if (e.altKey && e.code === 'KeyA') { e.preventDefault(); this.restart(); }
            });
        }

        setupNavigation() {
            const check = () => {
                if (location.href !== this.lastUrl) {
                    const isNewChat = location.href.includes('/new_chat');
                    const wasNewChat = this.lastUrl.includes('/new_chat');
                    this.lastUrl = location.href;

                    // Don't re-apply if we just saved a chat (ID changed from new_chat to UUID)
                    if (wasNewChat && !isNewChat && location.href.includes('/prompts/')) return;

                    Logger.log('Navigation detected, applying settings...');
                    this.restart();
                }
            };

            // Hook history API
            const push = history.pushState;
            history.pushState = (...args) => { push.apply(history, args); check(); };
            window.addEventListener('popstate', check);

            // Fallback observer
            new MutationObserver(check).observe(document.body, { childList: true, subtree: true });
        }

        async restart() {
            this.runId++;
            const currentId = this.runId;
            this.isApplying = true;
            this.setFabStatus('loading');

            // Retry loop
            for (let i = 0; i < CONSTANTS.maxAttempts; i++) {
                if (currentId !== this.runId) return; // Cancelled by newer run

                const success = await this.applier.run();
                if (success) {
                    this.setFabStatus('success');
                    this.ui.showToast('Settings Applied');
                    this.isApplying = false;
                    return;
                }
                await Utils.sleep(CONSTANTS.retryDelay);
            }

            this.setFabStatus('error');
            this.ui.showToast('Could not apply all settings', 'error');
            this.isApplying = false;
        }
    }

    // Start
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => new Main());
    else new Main();

})();

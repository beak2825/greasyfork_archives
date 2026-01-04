// ==UserScript==
// @name         MSC
// @namespace    http://tampermonkey.net/
// @version      8.1.2
// @description  MSC8
// @author       NBH
// @match        *://*.pornhub.com/*
// @match        *://pornhub.com/*
// @match        *://*.xvideos.com/*
// @match        *://xvideos.com/*
// @match        *://*.xhamster.com/*
// @match        *://xhamster.com/*
// @license 	 MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560771/MSC.user.js
// @updateURL https://update.greasyfork.org/scripts/560771/MSC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================================================================================
    // == 1. DEFAULT CONFIGURATION (Base Data)
    // ==================================================================================
    const DEFAULT_CONFIG = {
        isActive: true, // Master switch
        settings: {
            runOptions: true,
            runStyles: true,
            runScripts: true,
            generalOptions: "{\n  \"observerTarget\": \"body\"\n}", // General Options JSON
            generalStyle: "",
            generalScript: ""
        },
        // Rules 1: Soft98
        rule1: {
            domains: "soft98.ir",
            autoTrigger: { enabled: false, itemSelector: "", triggerSelector: "", delay: 20 },
            remove: [
                { mode: "delete", selectors: [] }
            ],
            style: ""
        },
        // Rules 2: Pornhub
        rule2: {
            domains: "pornhub.com",
            autoTrigger: { enabled: false, itemSelector: "", triggerSelector: "", delay: 20 },
            remove: [
                {
                    mode: "transparent.38%",
                    selectors: [
                        "li div.wrap ::: span.title a:contains(/cfnm|bbw|big dick|anal|black bull|bbc|toy|squirt|ass fucked|black dick|black cock|cum cleanup|bff|mmf|trio|lesbian|self/i)"
                    ]
                },
                {
                    mode: "transparent.60%",
                    selectors: ["li.pcVideoListItem:has(a[data-video-added='1'])"]
                },
                {
                    mode: "hide",
                    selectors: [
                        "li div.wrap ::: span.title a:contains(/assfucked|anal sex|ass fuck|bbws|big dicks|trans|shemale|gay guy|gay man|ass hole|oldwoman|extreme femdom/i)",
                        "li div.wrap ::: div.usernameWrap a:contains('Serenity Cox')",
                        "div.wrap ::: i.premiumIcon[data-title='Premium Video']"
                    ]
                },
                {
                    mode: "transparent.85%",
                    selectors: ["li div.wrap ::: div:contains('Watched')"]
                }
            ],
            style: ""
        },
        // Rules 3: xHamster & xVideos (Combined)
        rule3: {
            domains: "xhamster.com, xvideos.com",
            autoTrigger: {
                enabled: true,
                itemSelector: ".thumb-list__item",
                triggerSelector: ".video-thumb__trigger",
                delay: 20
            },
            remove: [
                {
                    mode: "transparent.75%",
                    selectors: [
                        "div.video-thumb ::: div:contains('Watched')",
                        "div.video-thumb ::: a:contains(/cfnm|bbw|big dick|anal|black bull|bbc|squirt|ass fucked|black dick|black cock|cum cleanup|bff|mmf|trio|lesbian|self/i)"
                    ]
                },
                {
                    mode: "transparent.80%",
                    selectors: [
                        "div.thumb-list__item:has(i.tick3)",
                        "div.thumb-list__item:has(i.plus-new)"
                    ]
                },
                {
                    mode: "hide",
                    selectors: [
                        "div.video-thumb ::: a:contains(/assfucked|trans|shemale|gay guy|gay man|ass hole|oldwoman|extreme femdom/i)",
                        "div.video-thumb ::: div.video-uploader-data a:contains('Serenity Cox')",
                        "div.thumb-list__item ::: i.badge_premium",
                        "div.channel[class*='premium-n-overlay']"
                    ]
                }
            ],
            style: ""
        }
    };

    // Load Config from Storage or use Default
    let config = GM_getValue('msc_config_v8', DEFAULT_CONFIG);
    if (!config.rule1) config = DEFAULT_CONFIG;


    // ==================================================================================
    // == 2. ENGINE
    // ==================================================================================
    function queryExtended(selector, context = document) {
        const baseSelector = selector.split(/:visible|:hidden|:contains|:has|:eq|:first|:last/)[0] || '*';
        let elements;
        try {
            elements = Array.from(context.querySelectorAll(baseSelector));
        } catch (e) {
            return [];
        }

        const filters = selector.match(/:visible|:hidden|:contains\(([^)]+)\)|:has\(([^)]+)\)|:eq\(([^)]+)\)|:first|:last/g) || [];

        for (const filter of filters) {
            if (filter.startsWith(':contains')) {
                const content = filter.match(/:contains\((.*)\)/)[1];
                const regExpMatch = content.match(/^\/(.*)\/([gimyusv]*)$/);
                if (regExpMatch) {
                    const pattern = regExpMatch[1];
                    const flags = regExpMatch[2];
                    const regex = new RegExp(pattern, flags);
                    elements = elements.filter(el => regex.test(el.textContent));
                } else {
                    const text = content.replace(/^['"]|['"]$/g, '');
                    elements = elements.filter(el => el.textContent.includes(text));
                }
            } else if (filter.startsWith(':has')) {
                const subSelector = filter.match(/:has\((.+)\)/)[1];
                elements = elements.filter(el => queryExtended(subSelector, el).length > 0);
            } else if (filter === ':visible') {
                elements = elements.filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
            } else if (filter === ':hidden') {
                elements = elements.filter(el => !(el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0));
            } else if (filter.startsWith(':eq')) {
                const index = parseInt(filter.match(/:eq\((\d+)\)/)[1], 10);
                elements = elements[index] ? [elements[index]] : [];
            } else if (filter === ':first') {
                elements = elements.length > 0 ? [elements[0]] : [];
            } else if (filter === ':last') {
                elements = elements.length > 0 ? [elements[elements.length - 1]] : [];
            }
        }
        return elements;
    }

    class ScriptEngine {
        constructor(cfg) {
            this.config = cfg;
            this.url = window.location.hostname;
            this.activeRules = this.getApplicableRules();
            this.generalOptions = {};
            try {
                this.generalOptions = JSON.parse(this.config.settings.generalOptions || "{}");
            } catch(e) { console.error("Invalid General Options JSON"); }
        }

        getApplicableRules() {
            const checkDomain = (ruleKey) => {
                const rule = this.config[ruleKey];
                const domains = rule.domains.split(',').map(d => d.trim());
                return domains.some(d => this.url.includes(d)) ? rule : null;
            };
            return checkDomain('rule1') || checkDomain('rule2') || checkDomain('rule3');
        }

        run() {
            if (!this.config.isActive) return;

            // 1. Run General Settings
            if (this.config.settings.runStyles && this.config.settings.generalStyle) {
                this.injectStyle(this.config.settings.generalStyle);
            }
            if (this.config.settings.runScripts && this.config.settings.generalScript) {
                this.injectScript(this.config.settings.generalScript);
            }

            // 2. Run Specific Rules
            if (this.activeRules) {
                if (this.config.settings.runStyles) this.injectStyle(this.activeRules.style);
                if (this.config.settings.runOptions) this.processOptions(this.activeRules);

                if (this.activeRules.autoTrigger && this.activeRules.autoTrigger.enabled) {
                    this.processAutoTriggers(this.activeRules.autoTrigger);
                }

                // Observer Target logic: Rule overrides General
                const observerTarget = this.activeRules.observerTarget || this.generalOptions.observerTarget || 'body';

                const observer = new MutationObserver((mutations) => {
                    if (this.config.settings.runOptions) {
                        this.processOptions(this.activeRules);
                    }
                });

                const initObserver = () => {
                    const targetNode = document.querySelector(observerTarget);
                    if (targetNode) {
                        observer.observe(targetNode, { childList: true, subtree: true });
                    } else if (document.body) { // Fallback if specific target not ready
                        // Retry shortly
                        setTimeout(initObserver, 500);
                    } else {
                        setTimeout(initObserver, 100);
                    }
                };
                initObserver();
            }
        }

        injectStyle(css) {
            if (!css || !css.trim()) return;
            try {
                GM_addStyle(css);
            } catch (e) {
                const style = document.createElement('style');
                style.textContent = css;
                (document.head || document.documentElement).appendChild(style);
            }
        }

        injectScript(js) {
            if (!js || !js.trim()) return;
            const script = document.createElement('script');
            script.textContent = js;
            (document.body || document.documentElement).appendChild(script);
        }

        processOptions(ruleSet) {
            if (ruleSet.remove && Array.isArray(ruleSet.remove)) {
                ruleSet.remove.forEach(rule => this.executeRemoveRule(rule));
            }
        }

        async processAutoTriggers(triggerConfig) {
            const { itemSelector, triggerSelector, delay } = triggerConfig;
            if (!itemSelector || !triggerSelector) return;

            const checkAndTrigger = async () => {
                const items = document.querySelectorAll(itemSelector);
                for (const item of items) {
                    if (item.dataset.mscTriggered) continue;
                    item.dataset.mscTriggered = "true";

                    item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
                    await new Promise(r => setTimeout(r, 50));
                    const btn = item.querySelector(triggerSelector);
                    if (btn) {
                        btn.click();
                        await new Promise(r => setTimeout(r, parseInt(delay) || 50));
                    }
                }
            };
            setInterval(checkAndTrigger, 2000);
            checkAndTrigger();
        }

        executeRemoveRule(rule) {
            if (!rule.mode || !rule.selectors || !Array.isArray(rule.selectors)) return;

            rule.selectors.forEach(selector => {
                if (!selector.trim()) return;
                try {
                    if (selector.includes(':::')) {
                        const [parentSelector, childConditionSelector] = selector.split(':::').map(s => s.trim());
                        queryExtended(parentSelector).forEach(parent => {
                            if (queryExtended(childConditionSelector, parent).length > 0) {
                                this.applyModification(parent, rule);
                            }
                        });
                    } else {
                        queryExtended(selector).forEach(el => this.applyModification(el, rule));
                    }
                } catch (e) {
                    console.warn(`[MSC] Selector error: ${selector}`);
                }
            });
        }

        applyModification(element, rule) {
            const mode = rule.mode;
            if (mode === 'hide') {
                element.style.visibility = 'hidden';
            } else if (mode === 'delete') {
                element.style.display = 'none';
            } else if (mode.startsWith('transparent.')) {
                const percent = parseInt(mode.split('.')[1]);
                if (!isNaN(percent)) {
                    element.style.opacity = (100 - percent) / 100;
                }
            } else if (mode.startsWith('color.')) {
                const color = mode.split('.')[1]; // color.#ff0000
                element.style.backgroundColor = color;
                // Optional: Hide children to show only the color block if desired, similar to v6 logic?
                // v6 logic: element.style.backgroundColor = ...; for(child) child.style.visibility='hidden';
                // Keeping it simpler here unless requested:
                element.style.backgroundColor = color;
            }
        }
    }

    // Initialize Engine
    const engine = new ScriptEngine(config);
    engine.run();
    window.addEventListener('DOMContentLoaded', () => engine.run());
    window.addEventListener('load', () => engine.run());


    // ==================================================================================
    // == 3. SETTINGS UI (Polished, LTR, English Fonts)
    // ==================================================================================

    function createUI() {
        if (document.getElementById('msc-ui-root')) return;

        const root = document.createElement('div');
        root.id = 'msc-ui-root';
        root.innerHTML = `
        <div class="msc-overlay">
            <div class="msc-container">
                <div class="msc-header">
                    <h2>MSC Config v8.1</h2>
                    <div class="msc-actions">
                        <button id="msc-save-only" class="msc-btn secondary">Save</button>
                        <button id="msc-save-reload" class="msc-btn primary">Save & Reload</button>
                        <button id="msc-close" class="msc-btn danger">Close</button>
                    </div>
                </div>

                <div class="msc-body">
                    <!-- Sidebar -->
                    <div class="msc-sidebar">
                        <div class="msc-tab active" data-tab="general">General</div>
                        <div class="msc-tab" data-tab="rule1">Rule 1</div>
                        <div class="msc-tab" data-tab="rule2">Rule 2</div>
                        <div class="msc-tab" data-tab="rule3">Rule 3</div>
                    </div>

                    <!-- Content Area -->
                    <div class="msc-content">

                        <!-- General Tab -->
                        <div id="tab-general" class="msc-pane active">
                            <div class="msc-box">
                                <h3>Global Switches</h3>
                                <label class="msc-row"><input type="checkbox" id="cfg-isActive"> <span>Enable Master Script</span></label>
                                <hr>
                                <label class="msc-row"><input type="checkbox" id="cfg-runOptions"> <span>Run Options (Remove/Trigger)</span></label>
                                <label class="msc-row"><input type="checkbox" id="cfg-runStyles"> <span>Run Styles</span></label>
                                <label class="msc-row"><input type="checkbox" id="cfg-runScripts"> <span>Run Scripts</span></label>
                            </div>
                            <div class="msc-box">
                                <h3>General Rules</h3>
                                <label>General Options (JSON)</label>
                                <textarea id="cfg-generalOptions" rows="4" style="font-family: monospace; color: #a5d6ff;"></textarea>
                                <label>General Styles (CSS)</label>
                                <textarea id="cfg-generalStyle" rows="4"></textarea>
                                <label>General Script (JS)</label>
                                <textarea id="cfg-generalScript" rows="4"></textarea>
                            </div>
                        </div>

                        <!-- Rule Tabs Template (Generated via JS) -->
                        <div id="tab-rule1" class="msc-pane"></div>
                        <div id="tab-rule2" class="msc-pane"></div>
                        <div id="tab-rule3" class="msc-pane"></div>

                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.appendChild(root);

        // --- STYLES FOR UI (LTR, Polished) ---
        GM_addStyle(`
            #msc-ui-root {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                direction: ltr; /* LTR enforced */
                font-size: 14px;
            }
            .msc-overlay {
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(4px);
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
            }
            .msc-container {
                background: #1e1e1e; color: #e0e0e0;
                width: 900px; height: 85%;
                border-radius: 8px;
                display: flex; flex-direction: column;
                box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                overflow: hidden;
                border: 1px solid #333;
            }
            .msc-header {
                background: #252526; padding: 12px 20px;
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid #333;
            }
            .msc-header h2 { margin: 0; font-size: 1.1rem; color: #4ec9b0; font-weight: 600; letter-spacing: 0.5px; }
            .msc-actions { display: flex; gap: 10px; }

            .msc-body { flex: 1; display: flex; overflow: hidden; }
            .msc-sidebar {
                width: 180px; background: #252526;
                border-right: 1px solid #333; /* Changed to border-right for LTR */
                display: flex; flex-direction: column;
                padding-top: 10px;
            }
            .msc-tab {
                padding: 12px 20px; cursor: pointer; transition: 0.2s;
                border-left: 3px solid transparent; /* Left border for LTR active indicator */
                color: #888;
            }
            .msc-tab:hover { background: #2d2d30; color: #ccc; }
            .msc-tab.active {
                background: #1e1e1e;
                border-left-color: #4ec9b0;
                color: #e0e0e0; font-weight: 600;
            }
            .msc-content { flex: 1; padding: 25px; overflow-y: auto; background: #1e1e1e; }
            .msc-pane { display: none; }
            .msc-pane.active { display: block; animation: fadeIn 0.2s ease; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            .msc-box {
                background: #252526; padding: 20px;
                border-radius: 6px; margin-bottom: 25px;
                border: 1px solid #333;
            }
            .msc-box h3 {
                margin-top: 0; font-size: 0.95rem; color: #4ec9b0;
                border-bottom: 1px solid #3e3e42; padding-bottom: 8px; margin-bottom: 15px;
                text-transform: uppercase; letter-spacing: 1px;
            }
            .msc-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; cursor: pointer; user-select: none; }
            .msc-input-text {
                background: #3c3c3c; border: 1px solid #444; color: #f0f0f0;
                padding: 6px 10px; border-radius: 4px; width: 100%;
                margin-top: 5px; margin-bottom: 15px; font-family: monospace; outline: none;
            }
            .msc-input-text:focus { border-color: #4ec9b0; }
            textarea {
                background: #3c3c3c; border: 1px solid #444; color: #d4d4d4;
                padding: 10px; border-radius: 4px; width: 100%;
                margin-top: 5px; margin-bottom: 15px; resize: vertical;
                font-family: monospace; font-size: 0.9rem; outline: none; box-sizing: border-box;
            }
            textarea:focus { border-color: #4ec9b0; }
            label { display: block; font-size: 0.85rem; color: #aaa; margin-top: 5px; }

            .msc-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-family: inherit; transition: background 0.2s; }
            .msc-btn.primary { background: #007acc; color: white; }
            .msc-btn.primary:hover { background: #0062a3; }
            .msc-btn.secondary { background: #3e3e42; color: white; }
            .msc-btn.secondary:hover { background: #4e4e52; }
            .msc-btn.danger { background: #ce3829; color: white; }
            .msc-btn.danger:hover { background: #a82b1e; }

            /* Block Styles */
            .msc-block {
                background: #1e1e1e; padding: 15px;
                border: 1px solid #3e3e42; margin-bottom: 15px; border-radius: 6px;
                position: relative;
            }
            .msc-block-header {
                display: flex; gap: 15px; margin-bottom: 10px; align-items: center;
                background: #252526; padding: 8px; border-radius: 4px;
            }
            select {
                background: #3c3c3c; color: white; border: 1px solid #444;
                padding: 5px 10px; border-radius: 4px; outline: none; cursor: pointer;
            }
            .aux-controls { display: flex; align-items: center; gap: 10px; flex: 1; }
            .slider-container { display: flex; align-items: center; gap: 10px; flex: 1; }
            input[type="range"] { flex: 1; cursor: pointer; }
            .small-num { width: 60px; margin: 0 !important; text-align: center; }
            input[type="color"] { background: transparent; border: none; height: 30px; width: 50px; cursor: pointer; }

            hr { border: 0; border-top: 1px solid #333; margin: 15px 0; }
            .hidden { display: none !important; }
        `);

        // --- RENDER LOGIC ---

        // 1. Fill General Tab
        document.getElementById('cfg-isActive').checked = config.isActive;
        document.getElementById('cfg-runOptions').checked = config.settings.runOptions;
        document.getElementById('cfg-runStyles').checked = config.settings.runStyles;
        document.getElementById('cfg-runScripts').checked = config.settings.runScripts;
        document.getElementById('cfg-generalOptions').value = config.settings.generalOptions;
        document.getElementById('cfg-generalStyle').value = config.settings.generalStyle;
        document.getElementById('cfg-generalScript').value = config.settings.generalScript;

        // 2. Helper to Render Rule Tabs
        const renderRuleTab = (ruleKey, containerId) => {
            const data = config[ruleKey];
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = `
                <div class="msc-box">
                    <h3>Domain Configuration</h3>
                    <label>Domains (comma separated)</label>
                    <input type="text" class="msc-input-text domain-input" value="${data.domains}">
                </div>

                <div class="msc-box">
                    <h3>Auto Trigger</h3>
                    <label class="msc-row"><input type="checkbox" class="at-enable" ${data.autoTrigger.enabled ? 'checked' : ''}> Enable Auto Trigger</label>
                    <div class="at-settings ${data.autoTrigger.enabled ? '' : 'hidden'}">
                        <label>Item Selector</label>
                        <input type="text" class="msc-input-text at-item" value="${data.autoTrigger.itemSelector || ''}">
                        <label>Trigger Selector</label>
                        <input type="text" class="msc-input-text at-trigger" value="${data.autoTrigger.triggerSelector || ''}">
                        <label>Delay (ms)</label>
                        <div class="slider-container" style="margin-bottom:15px;">
                            <input type="range" min="0" max="1000" class="at-delay-range" value="${data.autoTrigger.delay}">
                            <input type="number" class="msc-input-text small-num at-delay-num" value="${data.autoTrigger.delay}">
                        </div>
                    </div>
                </div>

                <div class="msc-box">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #3e3e42; padding-bottom:8px; margin-bottom:15px;">
                        <h3 style="border:none; margin:0; padding:0;">Remove Rules</h3>
                        <span style="font-size:0.8em; color:#666;">Max 5 blocks</span>
                    </div>
                    <div class="remove-blocks-container"></div>
                    <button class="msc-btn primary add-block-btn" style="width:100%; margin-top:10px;">+ Add Rule Block</button>
                </div>

                <div class="msc-box">
                    <h3>Custom CSS</h3>
                    <textarea class="custom-style" rows="6">${data.style}</textarea>
                </div>
            `;

            // Auto Trigger UI Logic
            const atEnable = container.querySelector('.at-enable');
            const atSettings = container.querySelector('.at-settings');
            atEnable.addEventListener('change', (e) => {
                if (e.target.checked) atSettings.classList.remove('hidden');
                else atSettings.classList.add('hidden');
            });

            const range = container.querySelector('.at-delay-range');
            const num = container.querySelector('.at-delay-num');
            range.addEventListener('input', () => num.value = range.value);
            num.addEventListener('input', () => range.value = num.value);

            // Render Remove Blocks
            const blockContainer = container.querySelector('.remove-blocks-container');
            const addBtn = container.querySelector('.add-block-btn');

            const renderBlock = (blockData) => {
                // Parse Mode
                let selectedMode = 'delete';
                let transVal = 50;
                let colorVal = '#ff0000';

                if (blockData.mode === 'hide') selectedMode = 'hide';
                else if (blockData.mode.startsWith('transparent.')) {
                    selectedMode = 'transparent';
                    transVal = parseInt(blockData.mode.split('.')[1]) || 50;
                } else if (blockData.mode.startsWith('color.')) {
                    selectedMode = 'color';
                    colorVal = blockData.mode.split('.')[1] || '#ff0000';
                }

                const div = document.createElement('div');
                div.className = 'msc-block';
                div.innerHTML = `
                    <div class="msc-block-header">
                        <label style="margin:0;">Mode:</label>
                        <select class="block-mode">
                            <option value="delete" ${selectedMode === 'delete' ? 'selected' : ''}>Delete</option>
                            <option value="hide" ${selectedMode === 'hide' ? 'selected' : ''}>Hide</option>
                            <option value="transparent" ${selectedMode === 'transparent' ? 'selected' : ''}>Transparent</option>
                            <option value="color" ${selectedMode === 'color' ? 'selected' : ''}>Color</option>
                        </select>

                        <!-- Aux Controls -->
                        <div class="aux-controls aux-trans ${selectedMode !== 'transparent' ? 'hidden' : ''}">
                            <input type="range" min="0" max="100" class="trans-slider" value="${transVal}">
                            <input type="number" class="msc-input-text small-num trans-num" value="${transVal}">
                            <span>%</span>
                        </div>

                        <div class="aux-controls aux-color ${selectedMode !== 'color' ? 'hidden' : ''}">
                            <input type="color" class="color-picker" value="${colorVal}">
                            <input type="text" class="msc-input-text small-num color-text" value="${colorVal}" style="width:80px;">
                        </div>

                        <button class="msc-btn danger remove-block-btn" style="margin-left:auto; padding: 4px 10px;">✕</button>
                    </div>
                    <textarea class="block-selectors" rows="3" placeholder="Enter selectors (one per line)...">${blockData.selectors.join('\n')}</textarea>
                `;

                // Events inside block
                const modeSel = div.querySelector('.block-mode');
                const auxTrans = div.querySelector('.aux-trans');
                const auxColor = div.querySelector('.aux-color');

                modeSel.addEventListener('change', () => {
                    const val = modeSel.value;
                    auxTrans.classList.add('hidden');
                    auxColor.classList.add('hidden');
                    if (val === 'transparent') auxTrans.classList.remove('hidden');
                    if (val === 'color') auxColor.classList.remove('hidden');
                });

                // Trans Sync
                const tSlider = div.querySelector('.trans-slider');
                const tNum = div.querySelector('.trans-num');
                tSlider.addEventListener('input', () => tNum.value = tSlider.value);
                tNum.addEventListener('input', () => tSlider.value = tNum.value);

                // Color Sync
                const cPicker = div.querySelector('.color-picker');
                const cText = div.querySelector('.color-text');
                cPicker.addEventListener('input', () => cText.value = cPicker.value);
                cText.addEventListener('input', () => cPicker.value = cText.value);

                div.querySelector('.remove-block-btn').addEventListener('click', () => {
                    div.remove();
                    checkBtn();
                });

                return div;
            };

            data.remove.forEach((blk, idx) => {
                if(idx < 5) blockContainer.appendChild(renderBlock(blk));
            });

            const checkBtn = () => {
                addBtn.style.display = blockContainer.children.length >= 5 ? 'none' : 'block';
            };
            checkBtn();

            addBtn.addEventListener('click', () => {
                if (blockContainer.children.length < 5) {
                    blockContainer.appendChild(renderBlock({ mode: 'delete', selectors: [] }));
                    checkBtn();
                }
            });
        };

        renderRuleTab('rule1', 'tab-rule1');
        renderRuleTab('rule2', 'tab-rule2');
        renderRuleTab('rule3', 'tab-rule3');


        // --- EVENTS ---

        // Tabs
        const tabs = root.querySelectorAll('.msc-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                root.querySelectorAll('.msc-pane').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            });
        });

        document.getElementById('msc-close').addEventListener('click', () => root.remove());

        const saveConfig = (shouldReload) => {
            const newConfig = JSON.parse(JSON.stringify(config));

            // General
            newConfig.isActive = document.getElementById('cfg-isActive').checked;
            newConfig.settings.runOptions = document.getElementById('cfg-runOptions').checked;
            newConfig.settings.runStyles = document.getElementById('cfg-runStyles').checked;
            newConfig.settings.runScripts = document.getElementById('cfg-runScripts').checked;
            newConfig.settings.generalOptions = document.getElementById('cfg-generalOptions').value;
            newConfig.settings.generalStyle = document.getElementById('cfg-generalStyle').value;
            newConfig.settings.generalScript = document.getElementById('cfg-generalScript').value;

            const harvestRule = (ruleKey, tabId) => {
                const container = document.getElementById(tabId);
                const rule = newConfig[ruleKey];
                rule.domains = container.querySelector('.domain-input').value;
                rule.style = container.querySelector('.custom-style').value;
                rule.autoTrigger.enabled = container.querySelector('.at-enable').checked;
                rule.autoTrigger.itemSelector = container.querySelector('.at-item').value;
                rule.autoTrigger.triggerSelector = container.querySelector('.at-trigger').value;
                rule.autoTrigger.delay = parseInt(container.querySelector('.at-delay-num').value);

                rule.remove = [];
                container.querySelectorAll('.msc-block').forEach(blk => {
                    const modeSel = blk.querySelector('.block-mode').value;
                    let finalMode = modeSel;
                    if (modeSel === 'transparent') {
                        finalMode = `transparent.${blk.querySelector('.trans-num').value}%`;
                    } else if (modeSel === 'color') {
                        finalMode = `color.${blk.querySelector('.color-text').value}`;
                    }

                    const text = blk.querySelector('.block-selectors').value;
                    const selectors = text.split('\n').map(s => s.trim()).filter(s => s !== "");
                    if (selectors.length > 0) {
                        rule.remove.push({ mode: finalMode, selectors });
                    }
                });
            };

            harvestRule('rule1', 'tab-rule1');
            harvestRule('rule2', 'tab-rule2');
            harvestRule('rule3', 'tab-rule3');

            GM_setValue('msc_config_v8', newConfig);
            if (shouldReload) {
                alert('Settings Saved! Reloading...');
                location.reload();
            } else {
                alert('Settings Saved successfully (No Reload).');
            }
        };

        document.getElementById('msc-save-only').addEventListener('click', () => saveConfig(false));
        document.getElementById('msc-save-reload').addEventListener('click', () => saveConfig(true));
    }

    GM_registerMenuCommand("Open MSC Settings", createUI);

})();
// ==UserScript==
// @name         Roon Display Companion
// @namespace    bys13.roon.classical
// @version      1.0
// @description  A premium UX overlay for Roon Display that provides context for music using DeepSeek, OpenAI, or Gemini.
// @author       bys13
// @include      /^https?://\d+\.\d+\.\d+\.\d+:9330/display/.*$/
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/1200px-Apple_Music_icon.svg.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      api.deepseek.com
// @connect      api.openai.com
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/556772/Roon%20Display%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/556772/Roon%20Display%20Companion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION DEFAULTS
    // ==========================================
    const CONFIG_DEFAULTS = {
        pollInterval: 2000,
        cacheDuration: 24 * 60 * 60 * 1000,
        theme: {
            primary: '#2ecc71', // Emerald Green
            accent: '#a55eea', // Amethyst Purple
            glass: 'rgba(12, 12, 12, 0.90)',
            border: 'rgba(255, 255, 255, 0.12)',
            text: '#ffffff',
            subtext: '#cccccc'
        }
    };

    // Supported Providers Definition
    const PROVIDERS = {
        deepseek: {
            name: "DeepSeek AI",
            url: "https://api.deepseek.com/chat/completions",
            model: "deepseek-chat",
            type: "openai-compatible" // Uses standard chat/completions format
        },
        openai: {
            name: "OpenAI (GPT-4o)",
            url: "https://api.openai.com/v1/chat/completions",
            model: "gpt-4o",
            type: "openai-compatible"
        },
        gemini: {
            name: "Google Gemini (2.5 Flash)",
            url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            model: "gemini-2.5-flash",
            type: "google" // Uses different payload structure
        }
    };

    // ==========================================
    // STYLES
    // ==========================================
    const STYLES = `
        :root {
            --rcc-primary: ${CONFIG_DEFAULTS.theme.primary};
            --rcc-accent: ${CONFIG_DEFAULTS.theme.accent};
            --rcc-bg: ${CONFIG_DEFAULTS.theme.glass};
            --rcc-border: ${CONFIG_DEFAULTS.theme.border};
            --rcc-text: ${CONFIG_DEFAULTS.theme.text};
            --rcc-subtext: ${CONFIG_DEFAULTS.theme.subtext};
            --rcc-shadow: 0 30px 90px rgba(0,0,0,1);
            --rcc-ease: cubic-bezier(0.19, 1, 0.22, 1);
        }

        /* --- Floating Action Button --- */
        #rcc-fab {
            position: fixed;
            bottom: 30%;
            right: 40px;
            width: 60px;
            height: 60px;
            background: rgba(0,0,0,0.6);
            border: 1px solid var(--rcc-border);
            border-radius: 50%;
            backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            transition: transform 0.4s var(--rcc-ease), opacity 0.2s;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            color: var(--rcc-primary);
        }
        #rcc-fab:hover {
            transform: scale(1.1);
            background: rgba(255,255,255,0.15);
        }
        #rcc-fab.hidden {
            transform: scale(0);
            opacity: 0;
            pointer-events: none;
        }

        /* --- Main Panel --- */
        #rcc-panel {
            position: fixed;
            top: 4%;
            left: 50%;
            width: 80%;
            max-width: 1400px;
            bottom: 28%;
            background: var(--rcc-bg);
            border: 1px solid var(--rcc-border);
            backdrop-filter: blur(60px) saturate(180%);
            -webkit-backdrop-filter: blur(60px) saturate(180%);
            border-radius: 24px;
            box-shadow: var(--rcc-shadow);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transform-origin: 95% 100%;
            transform: translateX(-50%) scale(0.1);
            transition: opacity 0.3s ease, transform 0.5s var(--rcc-ease);
        }

        #rcc-panel.visible {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(-50%) scale(1);
        }

        /* --- Header & Controls --- */
        .rcc-header {
            flex: 0 0 auto;
            padding: 25px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.02);
            border-radius: 24px 24px 0 0;
        }
        .rcc-brand {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 1.6rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--rcc-primary);
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .rcc-brand svg {
            color: var(--rcc-accent);
            filter: drop-shadow(0 0 8px rgba(165, 94, 234, 0.4));
        }
        .rcc-controls {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .rcc-icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            color: var(--rcc-text);
            font-size: 20px;
        }
        .rcc-icon-btn:hover {
            background: rgba(255,255,255,0.15);
            transform: scale(1.05);
        }
        .rcc-close:hover {
            background: rgba(255,60,60,0.25);
            color: #ff6b6b;
        }

        /* --- Content --- */
        .rcc-content {
            flex: 1;
            overflow-y: auto;
            padding: 40px 50px;
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
            transition: scrollbar-color 0.3s;
        }
        .rcc-content:hover { scrollbar-color: rgba(255,255,255,0.3) transparent; }
        .rcc-content::-webkit-scrollbar { width: 8px; }
        .rcc-content::-webkit-scrollbar-track { background: transparent; }
        .rcc-content::-webkit-scrollbar-thumb { background-color: transparent; border-radius: 4px; }
        .rcc-content:hover::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); }

        /* --- Typography --- */
        .rcc-track { font-size: 2.6rem; font-weight: 800; color: var(--rcc-text); margin-bottom: 8px; line-height: 1.2; }
        .rcc-artist { font-size: 1.8rem; color: var(--rcc-subtext); margin-bottom: 40px; font-weight: 400; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 25px; display: block; }
        .rcc-body {
            font-size: 1.6rem; line-height: 1.8; color: #f0f0f0; text-align: justify; white-space: pre-line; font-weight: 300;
            column-count: 2; column-gap: 60px; column-rule: 1px solid rgba(255,255,255,0.05);
        }
        @media (max-width: 1000px) { .rcc-body { column-count: 1; } }

        /* --- Footer --- */
        .rcc-footer {
            flex: 0 0 auto; padding: 15px 40px; font-size: 0.9rem; color: rgba(255,255,255,0.3); text-align: right;
            border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); border-radius: 0 0 24px 24px;
            text-transform: uppercase; letter-spacing: 1px; font-weight: 500;
        }

        /* --- Settings Modal --- */
        #rcc-settings-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); z-index: 20000;
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        #rcc-settings-overlay.visible { opacity: 1; pointer-events: auto; }
        .rcc-settings-box {
            width: 500px; padding: 40px; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.15);
            border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); color: #fff;
        }
        .rcc-settings-box h2 { margin: 0 0 20px 0; font-size: 1.5rem; color: var(--rcc-primary); }
        .rcc-form-group { margin-bottom: 20px; }
        .rcc-form-group label { display: block; margin-bottom: 8px; color: #ccc; font-size: 0.9rem; }
        .rcc-form-group select, .rcc-form-group input {
            width: 100%; box-sizing: border-box; padding: 12px; background: #111; border: 1px solid #333;
            color: #fff; border-radius: 8px; font-size: 1rem; outline: none;
        }
        .rcc-form-group input:focus, .rcc-form-group select:focus { border-color: var(--rcc-primary); }
        .rcc-btn-save {
            width: 100%; padding: 14px; background: var(--rcc-primary); border: none;
            border-radius: 8px; color: #111; font-weight: bold; font-size: 1rem; cursor: pointer; margin-top: 10px;
        }
        .rcc-btn-save:hover { opacity: 0.9; }

        /* --- Skeleton --- */
        .rcc-skeleton {
            background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
            background-size: 200% 100%; animation: rcc-shimmer 1.5s infinite; border-radius: 6px; margin-bottom: 15px;
        }
        .sk-title { height: 50px; width: 60%; margin-bottom: 20px; }
        .sk-line { height: 20px; width: 100%; }
        @keyframes rcc-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    `;

    // ==========================================
    // LOGIC
    // ==========================================
    class RoonClassicalAssistant {
        constructor() {
            this.state = {
                isOpen: false,
                isSettingsOpen: false,
                currentTrack: null,
                currentArtist: null,
                abortController: null,
                settings: {
                    provider: 'deepseek',
                    apiKey: ''
                }
            };
            this.ui = {};
            this.init();
        }

        init() {
            GM_addStyle(STYLES);
            this.loadSettings();
            this.createUI();

            // Check if API Key is missing on startup
            if (!this.state.settings.apiKey) {
                console.log('RCC: No API Key found. Opening settings.');
                this.toggleSettings(true);
            }

            this.startMonitoring();
        }

        loadSettings() {
            const saved = GM_getValue('rcc_settings');
            if (saved) {
                this.state.settings = { ...this.state.settings, ...saved };
            }
        }

        saveSettings(newSettings) {
            this.state.settings = { ...this.state.settings, ...newSettings };
            GM_setValue('rcc_settings', this.state.settings);
            // Update footer text
            const providerName = PROVIDERS[this.state.settings.provider].name;
            if (this.ui.footer) this.ui.footer.textContent = `Powered by ${providerName}`;
        }

        createUI() {
            // 1. FAB
            const fab = document.createElement('div');
            fab.id = 'rcc-fab';
            fab.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                   <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>`;
            fab.title = "Read Context";

            // 2. Panel
            const panel = document.createElement('div');
            panel.id = 'rcc-panel';

            // Header Icon: Beamed Notes
            const headerIcon = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            `;

            const providerName = PROVIDERS[this.state.settings.provider].name;

            panel.innerHTML = `
                <div class="rcc-header">
                    <div class="rcc-brand">
                        ${headerIcon}
                        曲目介绍
                    </div>
                    <div class="rcc-controls">
                        <div class="rcc-icon-btn rcc-settings-btn" title="Settings">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </div>
                        <div class="rcc-icon-btn rcc-close" title="Close">✕</div>
                    </div>
                </div>
                <div class="rcc-content" id="rcc-content-area"></div>
                <div class="rcc-footer">Powered by ${providerName}</div>
            `;

            // 3. Settings Modal
            const settingsOverlay = document.createElement('div');
            settingsOverlay.id = 'rcc-settings-overlay';
            settingsOverlay.innerHTML = `
                <div class="rcc-settings-box">
                    <h2>API Setup</h2>
                    <div class="rcc-form-group">
                        <label>AI Provider</label>
                        <select id="rcc-provider-select">
                            <option value="deepseek">DeepSeek AI</option>
                            <option value="openai">OpenAI (GPT-4o)</option>
                            <option value="gemini">Google Gemini</option>
                        </select>
                    </div>
                    <div class="rcc-form-group">
                        <label>API Key</label>
                        <input type="password" id="rcc-apikey-input" placeholder="sk-..." value="${this.state.settings.apiKey}">
                    </div>
                    <button class="rcc-btn-save" id="rcc-save-btn">Save & Connect</button>
                </div>
            `;

            document.body.appendChild(fab);
            document.body.appendChild(panel);
            document.body.appendChild(settingsOverlay);

            // Store refs
            this.ui.fab = fab;
            this.ui.panel = panel;
            this.ui.content = panel.querySelector('#rcc-content-area');
            this.ui.footer = panel.querySelector('.rcc-footer');
            this.ui.closeBtn = panel.querySelector('.rcc-close');
            this.ui.settingsBtn = panel.querySelector('.rcc-settings-btn');
            this.ui.settingsOverlay = settingsOverlay;
            this.ui.providerSelect = settingsOverlay.querySelector('#rcc-provider-select');
            this.ui.apiKeyInput = settingsOverlay.querySelector('#rcc-apikey-input');
            this.ui.saveBtn = settingsOverlay.querySelector('#rcc-save-btn');

            // Bind Events
            this.ui.fab.addEventListener('click', () => {
                if (!this.state.settings.apiKey) {
                    this.toggleSettings(true);
                } else {
                    this.toggle(true);
                }
            });
            this.ui.closeBtn.addEventListener('click', () => this.toggle(false));
            this.ui.settingsBtn.addEventListener('click', () => this.toggleSettings(true));

            // Close panels when clicking outside
            document.addEventListener('click', (e) => {
                if (this.state.isOpen && !panel.contains(e.target) && !fab.contains(e.target) && !settingsOverlay.contains(e.target)) {
                    this.toggle(false);
                }
                if (this.state.isSettingsOpen && e.target === settingsOverlay) {
                    this.toggleSettings(false);
                }
            });

            // Settings Logic
            this.ui.providerSelect.value = this.state.settings.provider;

            this.ui.saveBtn.addEventListener('click', () => {
                const provider = this.ui.providerSelect.value;
                const key = this.ui.apiKeyInput.value.trim();
                if (key) {
                    this.saveSettings({ provider, apiKey: key });
                    this.toggleSettings(false);
                    this.toggle(true); // Open main panel after save
                    this.state.currentTrack = null; // Force refresh
                } else {
                    alert("Please enter an API Key");
                }
            });
        }

        toggle(shouldOpen) {
            this.state.isOpen = shouldOpen;
            if (shouldOpen) {
                this.ui.panel.classList.add('visible');
                this.ui.fab.classList.add('hidden');
                this.checkTrackAndFetch();
            } else {
                this.ui.panel.classList.remove('visible');
                setTimeout(() => this.ui.fab.classList.remove('hidden'), 300);
            }
        }

        toggleSettings(shouldOpen) {
            this.state.isSettingsOpen = shouldOpen;
            if (shouldOpen) {
                this.ui.settingsOverlay.classList.add('visible');
                this.ui.apiKeyInput.value = this.state.settings.apiKey; // Refresh input
            } else {
                this.ui.settingsOverlay.classList.remove('visible');
            }
        }

        startMonitoring() {
            setInterval(() => {
                const info = this.scrapeTrackInfo();
                if (!info) return;
                if (info.track !== this.state.currentTrack || info.artist !== this.state.currentArtist) {
                    this.state.currentTrack = info.track;
                    this.state.currentArtist = info.artist;
                    if (this.state.isOpen && this.state.settings.apiKey) this.fetchInfo(info);
                }
            }, CONFIG_DEFAULTS.pollInterval);
        }

        scrapeTrackInfo() {
            const get = (id) => {
                const el = document.getElementById(id);
                if (!el) return '';
                return (el.querySelector('.front')?.textContent || el.querySelector('.back')?.textContent || el.textContent || '').trim();
            };
            const track = get('line1container');
            const artist = get('line2container');
            return (track && artist) ? { track, artist } : null;
        }

        checkTrackAndFetch() {
            const info = this.scrapeTrackInfo();
            if (info && this.state.settings.apiKey) this.fetchInfo(info);
        }

        async fetchInfo(info) {
            if (this.state.abortController) this.state.abortController.abort();
            this.state.abortController = new AbortController();

            this.renderSkeleton(info);

            const cacheKey = `rcc_univ_${info.track}_${info.artist}`;
            const cached = GM_getValue(cacheKey);

            if (cached && (Date.now() - cached.timestamp < CONFIG_DEFAULTS.cacheDuration)) {
                this.renderContent(info, cached.text);
                return;
            }

            try {
                const prompt = `请详细介绍这首古典音乐作品：\n
                曲目：${info.track}\n
                艺术家：${info.artist}\n\n
                请从以下几个方面用中文介绍（不超过300字）：\n
                1. 作品创作背景和历史时期\n
                2. 音乐风格和结构特点\n
                3. 作曲家相关信息\n
                4. 该版本演奏的特色\n\n
                请用通俗易懂的语言，适合音乐爱好者阅读。如遇音译的人名等，请用英语或原国家语言在后面用括号说明`;

                const response = await this.fetchFromAI(prompt, this.state.abortController.signal);
                GM_setValue(cacheKey, { text: response, timestamp: Date.now() });
                this.renderContent(info, response);
            } catch (err) {
                if (err.name !== 'AbortError') this.renderError(err.message);
            }
        }

        fetchFromAI(prompt, signal) {
            return new Promise((resolve, reject) => {
                const config = PROVIDERS[this.state.settings.provider];
                const apiKey = this.state.settings.apiKey;

                let headers = { 'Content-Type': 'application/json' };
                let data = {};
                let targetUrl = config.url;

                if (config.type === 'openai-compatible') {
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    data = {
                        model: config.model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 1000,
                        temperature: 0.7
                    };
                } else if (config.type === 'google') {
                    // CRITICAL: Key MUST be in the URL for Gemini
                    targetUrl = `${config.url}?key=${apiKey}`;
                    data = {
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    };
                }

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: targetUrl,
                    headers: headers,
                    data: JSON.stringify(data),
                    timeout: 30000,
                    onload: (res) => {
                        if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));

                        if (res.status !== 200) {
                            console.error("API Error Payload:", res.responseText);
                            return reject(new Error(`API Error ${res.status}: ${res.responseText}`));
                        }

                        try {
                            const json = JSON.parse(res.responseText);
                            let content = "";

                            if (config.type === 'openai-compatible') {
                                content = json.choices[0].message.content;
                            } else if (config.type === 'google') {
                                if (json.candidates && json.candidates[0] && json.candidates[0].content) {
                                    content = json.candidates[0].content.parts[0].text;
                                } else {
                                    content = "No content generated. (Check safety settings)";
                                }
                            }
                            resolve(content);
                        } catch (e) { reject(e); }
                    },
                    onerror: (e) => reject(new Error("Network Request Failed"))
                });
                signal.addEventListener('abort', () => {});
            });
        }

        renderSkeleton(info) {
            this.ui.content.innerHTML = `
                <div class="rcc-track">${info.track}</div>
                <div class="rcc-artist">${info.artist}</div>
                <div style="margin-top: 40px; column-count: 2; column-gap: 60px;">
                    <div class="rcc-skeleton sk-title"></div>
                    <div class="rcc-skeleton sk-line"></div><div class="rcc-skeleton sk-line"></div><div class="rcc-skeleton sk-line"></div>
                    <br>
                    <div class="rcc-skeleton sk-line"></div><div class="rcc-skeleton sk-line"></div><div class="rcc-skeleton sk-line"></div>
                </div>
            `;
        }

        renderContent(info, text) {
            this.ui.content.innerHTML = `
                <div class="rcc-track">${info.track}</div>
                <div class="rcc-artist">${info.artist}</div>
                <div class="rcc-body">${text}</div>
            `;
        }

        renderError(msg) {
            this.ui.content.innerHTML = `
                <div style="color: #ff6b6b; text-align: center; margin-top: 100px;">
                    <h3>Information Unavailable</h3>
                    <p>${msg}</p>
                    <button class="rcc-btn-save" style="width:auto; padding: 10px 20px; margin-top:20px;" onclick="document.querySelector('.rcc-settings-btn').click()">Check API Settings</button>
                </div>
            `;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new RoonClassicalAssistant());
    } else {
        new RoonClassicalAssistant();
    }

})();
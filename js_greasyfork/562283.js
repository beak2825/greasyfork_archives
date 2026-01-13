// ==UserScript==
// @name         Universal Captcha Solver
// @namespace    http://github.com/quantavil
// @version      1.1
// @description  Solve captchas on any website using Gemini AI with a generic selector picker
// @author       quantavil
// @match        *://*/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/562283/Universal%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/562283/Universal%20Captcha%20Solver.meta.js
// ==/UserScript==
 
(function () {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        get apiKey() { return GM_getValue('gemini_api_key', ''); },
        get model() { return GM_getValue('gemini_model', 'gemma-3-27b-it'); },
        timeouts: {
            imageLoad: 5000,
            api: 12000
        },
        delays: {
            initialRun: 100,
            afterRefresh: 100,
            afterSrcChange: 50
        }
    };

    // --- Aesthetic UI Styles ---
    const STYLES = `
        :root {
            --ucs-bg: rgba(18, 18, 18, 0.95);
            --ucs-border: rgba(255, 255, 255, 0.1);
            --ucs-text: #fff;
            --ucs-accent: #6366f1;
            --ucs-accent-hover: #4f46e5;
            --ucs-success: #34d399;
            --ucs-error: #f87171;
            --ucs-warning: #fbbf24;
            --ucs-font: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .ucs-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647; /* Max z-index */
            background: var(--ucs-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--ucs-border);
            border-radius: 12px;
            padding: 10px 14px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            font-family: var(--ucs-font);
            color: var(--ucs-text);
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 13px;
        }

        .ucs-widget.minimized {
            width: 40px;
            height: 40px;
            padding: 0;
            justify-content: center;
            border-radius: 50%;
            overflow: hidden;
        }

        .ucs-widget.minimized .ucs-content { display: none; }
        .ucs-widget.minimized .ucs-icon { display: block; }

        .ucs-icon {
            display: none;
            cursor: pointer;
            font-size: 18px;
        }

        .ucs-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .ucs-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #666;
            transition: background 0.3s ease;
        }

        /* Status Colors */
        .ucs-status-idle .ucs-status-dot { background: #9ca3af; box-shadow: 0 0 8px rgba(156, 163, 175, 0.4); }
        .ucs-status-ready .ucs-status-dot { background: var(--ucs-accent); box-shadow: 0 0 8px rgba(99, 102, 241, 0.4); }
        .ucs-status-solving .ucs-status-dot { background: var(--ucs-warning); box-shadow: 0 0 12px rgba(251, 191, 36, 0.6); animation: ucs-pulse 1.5s infinite; }
        .ucs-status-success .ucs-status-dot { background: var(--ucs-success); box-shadow: 0 0 12px rgba(52, 211, 153, 0.6); }
        .ucs-status-error .ucs-status-dot { background: var(--ucs-error); box-shadow: 0 0 12px rgba(248, 113, 113, 0.6); }

        @keyframes ucs-pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }

        .ucs-btn {
            background: linear-gradient(135deg, var(--ucs-accent) 0%, var(--ucs-accent-hover) 100%);
            border: none;
            border-radius: 6px;
            color: white;
            padding: 6px 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .ucs-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }

        .ucs-btn:active { transform: translateY(0); }

        .ucs-btn.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #ccc;
        }
        .ucs-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
            box-shadow: none;
        }

        /* Picker Overlay */
        .ucs-picker-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 2147483646;
            cursor: crosshair;
            background: rgba(0,0,0,0.1);
        }

        .ucs-highlight {
            outline: 2px solid var(--ucs-accent) !important;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2) !important;
            transition: all 0.1s;
        }

        .ucs-tooltip {
            position: fixed;
            background: #333;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 2147483648;
            transform: translate(10px, 10px);
        }
    `;

    // --- Modules ---

    /**
     * Handles Local Storage / Configuration
     */
    class ConfigManager {
        constructor() {
            this.domain = window.location.hostname;
        }

        getConfig() {
            const stored = GM_getValue(this.domain);
            return stored ? JSON.parse(stored) : null;
        }

        saveConfig(config) {
            GM_setValue(this.domain, JSON.stringify(config));
        }

        clearConfig() {
            GM_setValue(this.domain, null);
        }
    }

    /**
     * Handles Visual Selection of Elements
     */
    class SelectorPicker {
        constructor(onSelect) {
            this.onSelect = onSelect;
            this.active = false;
            this.overlay = null;
            this.tooltip = null;
            this.currentElement = null;
            this.rafId = null;

            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleClick = this.handleClick.bind(this);
            this.handleKeyDown = this.handleKeyDown.bind(this);
        }

        start(message) {
            this.active = true;
            this.createOverlay(message);
            document.addEventListener('mousemove', this.handleMouseMove, true);
            document.addEventListener('click', this.handleClick, true);
            document.addEventListener('keydown', this.handleKeyDown, true);
        }

        stop() {
            this.active = false;
            if (this.currentElement) {
                this.currentElement.classList.remove('ucs-highlight');
            }
            if (this.rafId) cancelAnimationFrame(this.rafId);

            this.overlay?.remove();
            this.tooltip?.remove();
            document.removeEventListener('mousemove', this.handleMouseMove, true);
            document.removeEventListener('click', this.handleClick, true);
            document.removeEventListener('keydown', this.handleKeyDown, true);
        }

        createOverlay(msg) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'ucs-picker-overlay';
            // Note: overlay must allow pointer events to pass through for elementFromPoint to work easily,
            // OR we toggle it. Here we use pointer-events: none in CSS usually, but we need to catch clicks?
            // Actually, we'll keep it simple: overlay is for visual tint, we use elementFromPoint.
            document.body.appendChild(this.overlay);

            this.tooltip = document.createElement('div');
            this.tooltip.className = 'ucs-tooltip';
            this.tooltip.textContent = msg;
            document.body.appendChild(this.tooltip);
        }

        handleMouseMove(e) {
            if (!this.active) return;

            // Optimization: Throttling with rAF
            if (this.rafId) return;

            this.rafId = requestAnimationFrame(() => {
                this.rafId = null;

                // Update tooltip pos
                this.tooltip.style.left = (e.clientX + 10) + 'px';
                this.tooltip.style.top = (e.clientY + 10) + 'px';

                this.overlay.style.pointerEvents = 'none';
                const el = document.elementFromPoint(e.clientX, e.clientY);
                this.overlay.style.pointerEvents = 'auto';

                if (el && el !== this.currentElement && el !== this.overlay && !el.classList.contains('ucs-widget')) {
                    if (this.currentElement) this.currentElement.classList.remove('ucs-highlight');
                    this.currentElement = el;
                    this.currentElement.classList.add('ucs-highlight');
                }
            });
        }

        handleClick(e) {
            if (!this.active) return;
            e.preventDefault();
            e.stopPropagation();

            if (this.currentElement) {
                const selector = this.generateSelector(this.currentElement);
                this.stop();
                this.onSelect(selector, this.currentElement.tagName);
            }
        }

        handleKeyDown(e) {
            if (e.key === 'Escape') this.stop();
        }

        generateSelector(el) {
            if (el.id) return `#${el.id}`;
            let path = [];
            while (el && el.nodeType === Node.ELEMENT_NODE && el.tagName !== 'HTML') {
                let selector = el.tagName.toLowerCase();
                if (el.className && typeof el.className === 'string') {
                    const classes = Array.from(el.classList).filter(c => !c.startsWith('ucs-'));
                    if (classes.length > 0) selector += '.' + classes.join('.');
                }
                path.unshift(selector);
                el = el.parentNode;
                if (path.length > 3) break;
            }
            return path.join(' > ');
        }
    }

    /**
     * Main Solver Logic (Gemini)
     */
    class GeminiSolver {
        constructor() {
            this.config = CONFIG;
        }

        async solve(base64Image) {
            return new Promise((resolve, reject) => {
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;
                const payload = {
                    contents: [{
                        parts: [
                            { text: "Solve this captcha. Output ONLY the alphanumeric characters visible in the image. Do not include spaces or special characters." },
                            { inline_data: { mime_type: "image/jpeg", data: base64Image } }
                        ]
                    }]
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: apiUrl,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify(payload),
                    timeout: this.config.timeouts.api,
                    ontimeout: () => reject("Timeout"),
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                                const solution = text ? text.trim().replace(/[^a-zA-Z0-9]/g, '') : '';
                                if (solution.length < 3) reject("Invalid format");
                                else resolve(solution);
                            } catch (e) { reject("Parse Error"); }
                        } else {
                            reject(`API ${response.status}`);
                        }
                    },
                    onerror: () => reject("Network Error")
                });
            });
        }
    }

    /**
     * Main Controller
     */
    class UniversalSolver {
        constructor() {
            this.configManager = new ConfigManager();
            this.picker = null;
            this.solver = new GeminiSolver();
            this.siteConfig = this.configManager.getConfig();

            this.registerMenu();

            if (this.siteConfig) {
                this.injectStyles();
                this.createUI();
                this.initAutoSolve();
            }
        }

        registerMenu() {
            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand("🔑 Set API Key", () => {
                    const currentKey = GM_getValue('gemini_api_key', '');
                    const key = prompt('Enter your Gemini API Key:', currentKey);
                    if (key !== null && key.trim()) {
                        GM_setValue('gemini_api_key', key.trim());
                        const currentModel = GM_getValue('gemini_model', 'gemma-3-27b-it');
                        const model = prompt('Enter model name (leave empty for default):', currentModel);
                        if (model && model.trim()) GM_setValue('gemini_model', model.trim());
                        alert('API Key saved!');
                    }
                });

                GM_registerMenuCommand("⚙️ Configure Captcha Solver", () => {
                    this.injectStyles();
                    this.startSetup();
                });

                GM_registerMenuCommand("❌ Reset Configuration", () => {
                    if (confirm('Reset configuration for this site?')) {
                        this.configManager.clearConfig();
                        location.reload();
                    }
                });
            }
        }

        injectStyles() {
            if (this.stylesInjected) return;
            this.stylesInjected = true;

            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(STYLES);
            } else {
                const style = document.createElement('style');
                style.textContent = STYLES;
                document.head.appendChild(style);
            }
        }

        createUI() {
            document.querySelector('.ucs-widget')?.remove();

            this.widget = document.createElement('div');
            this.widget.className = 'ucs-widget ucs-status-idle';
            this.widget.innerHTML = `
                <div class="ucs-icon">🤖</div>
                <div class="ucs-content">
                    <div class="ucs-status-dot"></div>
                    <span class="ucs-status-text">Ready</span>
                    <button class="ucs-btn cmd-solve">Solve</button>
                    <button class="ucs-btn secondary cmd-close" title="Close Session">✕</button>
                </div>
            `;

            this.widget.querySelector('.ucs-icon').onclick = () => this.toggleMinimize();

            const solveBtn = this.widget.querySelector('.cmd-solve');
            const closeBtn = this.widget.querySelector('.cmd-close');

            if (solveBtn) solveBtn.onclick = () => this.runSolve();
            if (closeBtn) closeBtn.onclick = () => {
                this.widget.remove();
            };

            this.updateStatus('ready', 'Ready');
            document.body.appendChild(this.widget);
        }

        updateStatus(status, text) {
            if (!this.widget) return;
            this.widget.className = `ucs-widget ucs-status-${status}`;
            const txt = this.widget.querySelector('.ucs-status-text');
            if (txt) txt.textContent = text;

            const btn = this.widget.querySelector('.cmd-solve');
            if (btn) {
                if (status === 'solving') {
                    btn.textContent = '...';
                    btn.disabled = true;
                } else if (status === 'error') {
                    btn.textContent = 'Retry';
                    btn.disabled = false;
                } else {
                    btn.textContent = 'Solve';
                    btn.disabled = false;
                }
            }
        }

        toggleMinimize() {
            this.widget.classList.toggle('minimized');
        }

        async startSetup() {
            this.picker = new SelectorPicker((selector, tagName) => {
                // Step 1: Image
                const imgSelector = selector;
                const isCanvas = tagName === 'CANVAS';

                // Delay slightly
                setTimeout(() => {
                    this.picker = new SelectorPicker((inputSelector) => {
                        // Step 2: Input - Done
                        const config = {
                            captchaSelector: imgSelector,
                            inputSelector: inputSelector,
                            isCanvas: isCanvas
                        };
                        this.configManager.saveConfig(config);
                        alert('Configuration Saved! Page will reload.');
                        location.reload();
                    });
                    this.picker.start("CLICK THE INPUT FIELD");
                }, 500);
            });
            this.picker.start("CLICK THE CAPTCHA IMAGE");
        }

        async getImageBase64() {
            const el = document.querySelector(this.siteConfig.captchaSelector);
            if (!el) throw new Error('Captcha element not found');

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            try {
                if (this.siteConfig.isCanvas || el.tagName === 'CANVAS') {
                    canvas.width = el.width;
                    canvas.height = el.height;
                    ctx.drawImage(el, 0, 0);
                    return canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
                } else {
                    if (!el.complete || el.naturalWidth === 0) {
                        await new Promise((resolve, reject) => {
                            el.onload = resolve;
                            el.onerror = () => reject(new Error('Image failed to load'));
                            setTimeout(() => reject(new Error('Timeout')), CONFIG.timeouts.imageLoad);
                        });
                    }
                    canvas.width = el.naturalWidth || el.width;
                    canvas.height = el.naturalHeight || el.height;
                    ctx.drawImage(el, 0, 0);
                    try {
                        return canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
                    } catch (corsError) {
                        // CORS blocked - fallback to GM_xmlhttpRequest
                        return await this.fetchCrossOriginImage(el.src);
                    }
                }
            } catch (e) {
                console.error(e);
                throw new Error('Image extraction failed');
            }
        }

        async fetchCrossOriginImage(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    timeout: CONFIG.timeouts.imageLoad,
                    onload: (response) => {
                        if (response.status === 200) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const base64 = reader.result.replace(/^data:image\/[^;]+;base64,/, '');
                                resolve(base64);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(response.response);
                        } else reject(new Error(`HTTP ${response.status}`));
                    },
                    onerror: () => reject(new Error('Network Error')),
                    ontimeout: () => reject(new Error('Timeout'))
                });
            });
        }

        async runSolve() {
            if (!this.siteConfig) return;

            try {
                this.updateStatus('solving', 'Solving...');
                const base64 = await this.getImageBase64();
                const solution = await this.solver.solve(base64);

                this.fillInput(solution);
                this.updateStatus('success', 'Solved');

            } catch (e) {
                console.error('Solver Error:', e);
                this.updateStatus('error', 'Failed');
            }
        }

        fillInput(text) {
            const input = document.querySelector(this.siteConfig.inputSelector);
            if (!input) return;

            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }

        initAutoSolve() {
            setTimeout(() => this.runSolve(), CONFIG.delays.initialRun);

            const el = document.querySelector(this.siteConfig.captchaSelector);
            if (el && !this.siteConfig.isCanvas) {
                const observer = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                        if (m.attributeName === 'src') {
                            setTimeout(() => this.runSolve(), CONFIG.delays.afterSrcChange);
                        }
                    }
                });
                observer.observe(el, { attributes: true });
            }
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new UniversalSolver());
    } else {
        new UniversalSolver();
    }

})();

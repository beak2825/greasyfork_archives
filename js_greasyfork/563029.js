// ==UserScript==
// @name         LMArena Manager
// @namespace    http://tampermonkey.net/
// @version      4.4.2
// @description  智能管理 LMArena 模型显示 - UI细节精修、严格模式扫描、多模式归属系统
// @author       LMArena Manager Team
// @match        https://lmarena.ai/*
// @match        https://web.lmarena.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563029/LMArena%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/563029/LMArena%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'lmarena_manager_v4';
    const VERSION = '4.4.2';

    // ==================== 1. 选择器与配置 ====================
    const SELECTORS = {
        modelOption: '[cmdk-item][role="option"]',
        modelName: 'span.truncate',
        companyIcon: 'svg title',
        dropdown: '[cmdk-list]',
        // 核心修正：利用你提供的 HTML 中的特有类名定位按钮
        modalityBtn: 'button.group\\/modality-button'
    };

    const TIER1_COMPANIES = [
        'OpenAI', 'Google', 'Anthropic', 'xAI', 'DeepSeek', 'Qwen',
        'Zai', 'MoonshotAI', 'Baidu', 'MistralAI', 'Minimax'
    ];

    const TIER2_COMPANIES = [
        'LongCat', 'Xiaomi', 'Tencent', 'Amazon', 'PrimeIntellect',
        'IBM', 'Cohere', 'AntGroup', 'Stepfun', 'Meta', 'Nvidia',
        'AllenAI', 'Inception'
    ];

    const DEFAULT_COMPANY_ORDER = [
        ...TIER1_COMPANIES,
        ...TIER2_COMPANIES,
        'Perplexity', 'Diffbot',
        'Bytedance', 'Flux', 'MicrosoftAI', 'ShengShu', 'Recraft', 'Luma', 'Ideogram', 'Reve', 'LeonardoAI', 'Kwai'
    ];

    const COMPANY_RULES = [
        { patterns: [/^gemini/i, /^gemma/i, /^imagen/i], company: 'Google', icon: '🔵' },
        { patterns: [/^gpt/i, /^o3/i, /^o4/i, /^chatgpt/i, /^dall-e/i], company: 'OpenAI', icon: '🟢' },
        { patterns: [/^claude/i], company: 'Anthropic', icon: '🟤' },
        { patterns: [/^grok/i], company: 'xAI', icon: '⚫' },
        { patterns: [/^deepseek/i], company: 'DeepSeek', icon: '🐋' },
        { patterns: [/^qwen/i, /^qwq/i, /^wan/i], company: 'Qwen', icon: '🟣' },
        { patterns: [/^glm/i], company: 'Zai', icon: '🔮' },
        { patterns: [/^kimi/i], company: 'MoonshotAI', icon: '🌙' },
        { patterns: [/^ernie/i], company: 'Baidu', icon: '🔴' },
        { patterns: [/^mistral/i, /^magistral/i, /^devstral/i], company: 'MistralAI', icon: '🟠' },
        { patterns: [/^minimax/i], company: 'Minimax', icon: '🎯' },
        { patterns: [/^longcat/i], company: 'LongCat', icon: '🐱' },
        { patterns: [/^mimo/i], company: 'Xiaomi', icon: '🍊' },
        { patterns: [/^hunyuan/i], company: 'Tencent', icon: '🐧' },
        { patterns: [/^nova/i, /^amazon/i], company: 'Amazon', icon: '📦' },
        { patterns: [/^intellect/i], company: 'PrimeIntellect', icon: '🧠' },
        { patterns: [/^ibm/i, /^granite/i], company: 'IBM', icon: '💠' },
        { patterns: [/^command/i], company: 'Cohere', icon: '🟡' },
        { patterns: [/^ling/i, /^ring/i], company: 'AntGroup', icon: '🐜' },
        { patterns: [/^step/i], company: 'Stepfun', icon: '👣' },
        { patterns: [/^llama/i], company: 'Meta', icon: '🔷' },
        { patterns: [/^nvidia/i, /^nemotron/i], company: 'Nvidia', icon: '💚' },
        { patterns: [/^olmo/i], company: 'AllenAI', icon: '🔬' },
        { patterns: [/^mercury/i], company: 'Inception', icon: '☿️' },
        { patterns: [/^ppl/i, /^perplexity/i, /^sonar/i], company: 'Perplexity', icon: '❓' },
        { patterns: [/^diffbot/i], company: 'Diffbot', icon: '🤖' },
        { patterns: [/^seedream/i], company: 'Bytedance', icon: '🎵' },
        { patterns: [/^flux/i], company: 'Flux', icon: '🌊' },
        { patterns: [/^mai-/i, /^microsoft/i], company: 'MicrosoftAI', icon: '🪟' },
        { patterns: [/^vidu/i], company: 'ShengShu', icon: '🎬' },
        { patterns: [/^recraft/i], company: 'Recraft', icon: '🎨' },
        { patterns: [/^photon/i], company: 'Luma', icon: '💡' },
        { patterns: [/^ideogram/i], company: 'Ideogram', icon: '✏️' },
        { patterns: [/^reve/i], company: 'Reve', icon: '💭' },
        { patterns: [/^lucid/i], company: 'LeonardoAI', icon: '🖼️' },
        { patterns: [/^kat/i], company: 'Kwai', icon: '🎥' },
    ];

    const CATEGORY_RULES = [
        { category: 'speed', patterns: [/flash/i, /lite(?!ct)/i, /fast/i, /haiku/i, /instant/i, /turbo/i], label: '⚡ 快速' },
        { category: 'thinking', patterns: [/thinking/i, /reasoner/i, /[\-_]r1/i, /^o[34]/i, /^qwq/i, /[\-_]think/i], label: '🧠 思考' },
        { category: 'pro', patterns: [/[\-_]pro/i, /[\-_]max/i, /[\-_]ultra/i, /[\-_]large/i, /[\-_]high/i], label: '👑 旗舰' },
        { category: 'mini', patterns: [/[\-_]mini/i, /[\-_]nano/i, /[\-_]small/i, /[\-_]tiny/i], label: '📱 轻量' },
    ];

    const OSS_PATTERNS = [
        /^llama/i, /^qwen/i, /^glm/i, /^olmo/i, /^gemma/i, /^mistral/i, /^mixtral/i, /^falcon/i,
        /^yi-/i, /^deepseek/i, /^baichuan/i, /^internlm/i, /^phi-/i, /^mimo/i, /gpt-oss/i
    ];

    // ==================== 2. 模式检测器 ====================
    class ModeDetector {
        static detect() {
            const buttons = document.querySelectorAll(SELECTORS.modalityBtn);
            if (buttons.length !== 1) return 'chat';

            const btn = buttons[0];
            const text = (btn.textContent || '').trim().toLowerCase();
            const label = (btn.getAttribute('aria-label') || '').toLowerCase();

            if (text.includes('code') || label.includes('code')) return 'code';
            if (text.includes('search') || label.includes('search')) return 'search';
            if (text.includes('image') || label.includes('image')) return 'image';
            if (text.includes('video') || label.includes('video')) return 'video';

            return 'chat';
        }
    }

    // ==================== 3. 数据管理 ====================
    class DataManager {
        constructor() {
            this.data = this.load();
            this.ensureDefaults();
            this.migrate();
        }

        ensureDefaults() {
            if (!this.data.models) this.data.models = {};
            if (!this.data.companyOrder) this.data.companyOrder = [...DEFAULT_COMPANY_ORDER];
            if (!this.data.settings) this.data.settings = { showNewAlert: true, defaultVisible: true, autoApply: false };
            if (!this.data.modelOrder) this.data.modelOrder = { chat: [], search: [], image: [], code: [], video: [] };
        }

        migrate() {
            let changed = false;
            Object.values(this.data.models).forEach(m => {
                if (typeof m.arenaMode === 'string') {
                    m.modes = [m.arenaMode === 'llm' ? 'chat' : m.arenaMode];
                    delete m.arenaMode;
                    changed = true;
                }
                if (!Array.isArray(m.modes)) { m.modes = ['chat']; changed = true; }
            });
            if (changed) this.save();
        }

        load() {
            try { return JSON.parse(GM_getValue(STORAGE_KEY) || '{}'); }
            catch (e) { console.error('[LMM] Load failed:', e); return {}; }
        }

        save() { GM_setValue(STORAGE_KEY, JSON.stringify(this.data)); }
        getModel(name) { return this.data.models[name]; }
        setModel(name, data) { this.data.models[name] = { ...this.data.models[name], ...data }; this.save(); }
        deleteModels(names) { names.forEach(n => delete this.data.models[n]); this.save(); }
        getAllModels() { return Object.entries(this.data.models).map(([name, data]) => ({ name, ...data })); }

        isVisible(name) { const m = this.data.models[name]; return m ? m.visible !== false : this.data.settings.defaultVisible; }

        setVisibility(name, visible) {
            if (!this.data.models[name]) this.data.models[name] = this.analyze(name, null, 'chat');
            this.data.models[name].visible = visible;
            this.data.models[name].isNew = false;
            this.save();
        }

        toggleStar(name) {
            if (!this.data.models[name]) return false;
            const starred = !this.data.models[name].starred;
            this.data.models[name].starred = starred;
            this.data.models[name].starredAt = starred ? Date.now() : null;
            this.save();
            return starred;
        }

        getModelOrder(mode) { return this.data.modelOrder[mode] || []; }
        setModelOrder(mode, order) {
            if (!this.data.modelOrder) this.data.modelOrder = {};
            this.data.modelOrder[mode] = order;
            this.save();
        }

        getCompanyOrder() { return this.data.companyOrder || DEFAULT_COMPANY_ORDER; }
        setCompanyOrder(order) { this.data.companyOrder = order; this.save(); }
        updateModel(name, updates) { if (!this.data.models[name]) return; Object.assign(this.data.models[name], updates); this.save(); }

        addModeToModel(name, mode) {
            const model = this.data.models[name];
            if (model && !model.modes.includes(mode)) { model.modes.push(mode); this.save(); }
        }

        clearNewFlags() { Object.keys(this.data.models).forEach(k => { this.data.models[k].isNew = false; }); this.save(); }
        export() { return JSON.stringify(this.data, null, 2); }
        import(json) { try { this.data = JSON.parse(json); this.ensureDefaults(); this.migrate(); this.save(); return true; } catch { return false; } }

        analyze(name, svgCompany, strictMode) {
            let company = 'Other', icon = '❔';
            if (svgCompany && svgCompany !== '') {
                if (svgCompany.toLowerCase() === 'zhipu') company = 'Zai';
                else if (svgCompany.toLowerCase().includes('microsoft')) company = 'MicrosoftAI';
                else company = svgCompany;
                for (const rule of COMPANY_RULES) {
                    if (rule.company.toLowerCase() === company.toLowerCase()) { icon = rule.icon; company = rule.company; break; }
                }
            } else {
                for (const rule of COMPANY_RULES) {
                    if (rule.patterns.some(p => p.test(name))) { company = rule.company; icon = rule.icon; break; }
                }
            }
            const categories = [];
            for (const rule of CATEGORY_RULES) { if (rule.patterns.some(p => p.test(name))) categories.push(rule.category); }
            if (OSS_PATTERNS.some(p => p.test(name))) categories.push('oss');

            return {
                visible: this.data.settings.defaultVisible, company, icon, companyManual: false,
                modes: [strictMode], categories, categoriesManual: false,
                starred: false, starredAt: null, isNew: true, addedAt: Date.now()
            };
        }
    }

    // ==================== 4. 扫描器 ====================
    class Scanner {
        constructor(dm) {
            this.dm = dm;
            this.scanSession = { active: false, startedAt: null, scannedModels: new Set(), scannedModes: new Set() };
            this.initHistoryHook();
        }

        initHistoryHook() {
            const originalPush = history.pushState;
            const originalReplace = history.replaceState;
            const onUrlChange = () => { setTimeout(() => { this.scan(); this.applyFilters(); }, 150); };
            history.pushState = function() { originalPush.apply(this, arguments); onUrlChange(); };
            history.replaceState = function() { originalReplace.apply(this, arguments); onUrlChange(); };
            window.addEventListener('popstate', onUrlChange);
        }

        extractInfo(el) {
            const nameEl = el.querySelector(SELECTORS.modelName);
            const name = nameEl?.textContent?.trim();
            if (!name || name.length < 2) return null;
            const titleEl = el.querySelector(SELECTORS.companyIcon);
            const svgCompany = titleEl?.textContent?.trim() || null;
            return { name, svgCompany };
        }

        scan() {
            const options = document.querySelectorAll(SELECTORS.modelOption);
            if (options.length === 0) return;

            const currentMode = ModeDetector.detect();
            const found = new Map();
            const newModels = [];

            options.forEach(el => {
                const info = this.extractInfo(el);
                if (!info) return;
                found.set(info.name, el);

                if (this.scanSession.active) {
                    this.scanSession.scannedModels.add(info.name);
                    this.scanSession.scannedModes.add(currentMode);
                }

                let model = this.dm.getModel(info.name);
                if (!model) {
                    const data = this.dm.analyze(info.name, info.svgCompany, currentMode);
                    this.dm.setModel(info.name, data);
                    newModels.push(info.name);
                } else {
                    this.dm.addModeToModel(info.name, currentMode);
                }
            });

            if (newModels.length > 0 && this.dm.data.settings.showNewAlert) {
                const msg = newModels.length <= 3 ? `发现新模型: ${newModels.slice(0, 3).join(', ')}` : `发现 ${newModels.length} 个新模型`;
                this.toast(msg);
            }
            return found;
        }

        startScanSession() {
            this.scanSession = { active: true, startedAt: Date.now(), scannedModels: new Set(), scannedModes: new Set() };
            this.toast('扫描已开始，请依次打开各模式的模型下拉框', 'info');
        }

        endScanSession() {
            if (!this.scanSession.active) return { missing: [], modes: [] };
            const allModels = this.dm.getAllModels();
            const scanned = this.scanSession.scannedModels;
            const missing = allModels.filter(m => !scanned.has(m.name)).map(m => m.name);
            const result = { missing, scannedCount: scanned.size, modes: [...this.scanSession.scannedModes] };
            this.scanSession.active = false;
            return result;
        }

        isScanActive() { return this.scanSession.active; }

        applyFilters() {
            const options = document.querySelectorAll(SELECTORS.modelOption);
            if (options.length === 0) return;
            const currentMode = ModeDetector.detect();
            const companyOrder = this.dm.getCompanyOrder();

            options.forEach(el => {
                const info = this.extractInfo(el);
                if (!info) return;
                const model = this.dm.getModel(info.name);
                if (!model) return;

                const visible = this.dm.isVisible(info.name);
                el.style.display = visible ? '' : 'none';

                if (visible) {
                    let order = 0;
                    if (model.starred) {
                        order = -99999 + (model.name.charCodeAt(0) || 0) * 0.001;
                    } else {
                        const modeSort = this.dm.getModelOrder(currentMode);
                        const customIndex = modeSort ? modeSort.indexOf(info.name) : -1;
                        if (customIndex !== -1) {
                            order = customIndex;
                        } else {
                            const baseOrder = 10000;
                            const companyIndex = companyOrder.indexOf(model.company);
                            const companyScore = (companyIndex !== -1 ? companyIndex : 900) * 100;
                            order = baseOrder + companyScore + (model.name.charCodeAt(0) || 0) * 0.01;
                        }
                    }
                    el.style.order = order;
                }
            });
        }

        toast(msg, type = 'info') {
            document.querySelectorAll('.lmm-toast').forEach(t => t.remove());
            const t = document.createElement('div'); t.className = `lmm-toast lmm-toast-${type}`;
            t.innerHTML = `<span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span><span>${msg}</span><button class="lmm-toast-x">×</button>`;
            document.body.appendChild(t); t.querySelector('.lmm-toast-x').onclick = () => t.remove(); setTimeout(() => t.remove(), 4000);
        }

        startObserving() {
            let timer = null;
            const observer = new MutationObserver(() => {
                const dropdown = document.querySelector(SELECTORS.dropdown);
                if (dropdown) {
                    clearTimeout(timer);
                    timer = setTimeout(() => { this.scan(); this.applyFilters(); }, 50);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // ==================== 5. UI (精修版) ====================
    class UI {
        constructor(dm, scanner) {
            this.dm = dm;
            this.scanner = scanner;
            this.isOpen = false;
            this.isSortMode = false;
            this.isModelSortMode = false;
            this.isTier2Expanded = false;
            this.editingModel = null;
            this.currentMode = 'all';
            this.visibleSubMode = 'chat';
            this.filter = { search: '', company: 'all', category: 'all', visibility: 'all' };
            this.sort = { by: 'name', order: 'asc' };
        }

        init() {
            this.injectStyles();
            this.createFab();
            this.createPanel();
            this.createEditModal();
            this.createConfirmModal();
            this.createScanResultModal();
            this.bindShortcuts();
        }

        injectStyles() {
            GM_addStyle(`
                :root {
                    --lmm-primary: #6366f1; --lmm-primary-dark: #4f46e5;
                    --lmm-success: #22c55e; --lmm-warning: #f59e0b; --lmm-danger: #ef4444;
                    --lmm-bg: #fff; --lmm-bg2: #f8fafc; --lmm-bg3: #f1f5f9;
                    --lmm-text: #1e293b; --lmm-text2: #64748b; --lmm-border: #e2e8f0;
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        --lmm-bg: #1a1a2e; --lmm-bg2: #252540; --lmm-bg3: #2f2f4a;
                        --lmm-text: #e2e8f0; --lmm-text2: #94a3b8; --lmm-border: #3f3f5a;
                    }
                }
                [cmdk-group-items] { display: flex !important; flex-direction: column !important; }
                [cmdk-list] { display: flex !important; flex-direction: column !important; }
                [cmdk-item] span.truncate { overflow: visible !important; text-overflow: unset !important; white-space: normal !important; }
                [data-radix-popper-content-wrapper] > [role="dialog"] { max-height: 85vh !important; }

                /* FAB & Overlay */
                .lmm-fab { position: fixed; top: 12px; right: 12px; width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, var(--lmm-primary), var(--lmm-primary-dark)); color: #fff; border: none; cursor: pointer; z-index: 99990; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 10px rgba(99,102,241,0.3); transition: transform 0.15s; }
                .lmm-fab:hover { transform: scale(1.08); }
                .lmm-fab.has-new::after { content: ''; position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; background: var(--lmm-danger); border-radius: 50%; border: 2px solid var(--lmm-bg); }
                .lmm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); z-index: 99995; opacity: 0; visibility: hidden; transition: all 0.2s; }
                .lmm-overlay.open { opacity: 1; visibility: visible; }

                /* Main Panel */
                .lmm-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); width: 96vw; max-width: 1000px; height: 88vh; max-height: 720px; background: var(--lmm-bg); border-radius: 12px; z-index: 99999; display: flex; flex-direction: column; opacity: 0; visibility: hidden; transition: all 0.2s; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: var(--lmm-text); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
                .lmm-panel.open { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }

                /* Layout Stabilization: flex-shrink: 0 on all headers */
                .lmm-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--lmm-border); background: var(--lmm-bg2); border-radius: 12px 12px 0 0; flex-wrap: nowrap; gap: 8px; flex-shrink: 0; }
                .lmm-title { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 15px; white-space: nowrap; flex-shrink: 0; }
                .lmm-header-btns { display: flex; gap: 5px; align-items: center; margin-left: auto; }
                .lmm-close { width: 28px; height: 28px; border: none; background: none; font-size: 20px; cursor: pointer; color: var(--lmm-text2); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 8px; }
                .lmm-close:hover { background: var(--lmm-bg3); color: var(--lmm-danger); }

                .lmm-btn { padding: 5px 10px; border-radius: 6px; border: 1px solid var(--lmm-border); background: var(--lmm-bg); color: var(--lmm-text); cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; height: 28px; box-sizing: border-box; }
                .lmm-btn:hover { background: var(--lmm-bg3); border-color: var(--lmm-primary); }
                .lmm-btn-primary { background: var(--lmm-primary); color: #fff; border-color: var(--lmm-primary); }
                .lmm-btn-primary:hover { background: var(--lmm-primary-dark); }
                .lmm-btn-danger { background: var(--lmm-danger); color: #fff; border-color: var(--lmm-danger); }
                .lmm-btn-success { background: var(--lmm-success); color: #fff; border-color: var(--lmm-success); }
                .lmm-btn.scanning { animation: lmm-pulse 1.5s infinite; }
                @keyframes lmm-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }

                .lmm-topbar { display: flex; gap: 5px; padding: 8px 14px; border-bottom: 1px solid var(--lmm-border); overflow-x: hidden; flex-shrink: 0; flex-wrap: wrap; }
                .lmm-topbar-item { padding: 4px 8px; border-radius: 12px; border: 1px solid var(--lmm-border); background: var(--lmm-bg); font-size: 12px; cursor: pointer; white-space: nowrap; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; height: 26px; box-sizing: border-box; }
                .lmm-topbar-item:hover { border-color: var(--lmm-primary); color: var(--lmm-primary); }
                .lmm-topbar-item.active { background: var(--lmm-primary); border-color: var(--lmm-primary); color: #fff; }
                .lmm-topbar-item .cnt { font-size: 10px; background: rgba(0,0,0,0.1); padding: 1px 5px; border-radius: 8px; }
                .lmm-topbar-item.active .cnt { background: rgba(255,255,255,0.2); }
                .lmm-topbar-sep { border-left: 1px solid var(--lmm-border); margin: 0 4px; }

                .lmm-subbar { display: flex; gap: 8px; padding: 8px 14px 0; align-items: center; flex-wrap: wrap; flex-shrink: 0; }
                .lmm-subbar-group { display: flex; background: var(--lmm-bg2); border-radius: 6px; padding: 2px; border: 1px solid var(--lmm-border); }
                .lmm-subbar-item { padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; color: var(--lmm-text2); transition: all 0.1s; }
                .lmm-subbar-item.active { background: var(--lmm-bg); color: var(--lmm-text); font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

                .lmm-toolbar { display: flex; gap: 8px; padding: 8px 14px; border-bottom: 1px solid var(--lmm-border); flex-wrap: wrap; align-items: center; flex-shrink: 0; }
                .lmm-search { flex: 1; min-width: 140px; position: relative; }
                .lmm-search-icon { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: var(--lmm-text2); font-size: 12px; }
                .lmm-search input { width: 100%; padding: 6px 8px 6px 28px; border: 1px solid var(--lmm-border); border-radius: 6px; font-size: 12px; background: var(--lmm-bg); color: var(--lmm-text); height: 30px; box-sizing: border-box; }
                .lmm-select { padding: 4px 22px 4px 8px; border: 1px solid var(--lmm-border); border-radius: 6px; background: var(--lmm-bg); color: var(--lmm-text); font-size: 11px; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath fill='%2364748b' d='M1 3l4 4 4-4'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 6px center; height: 30px; box-sizing: border-box; }

                /* Content Area */
                .lmm-content { display: flex; flex: 1; overflow: hidden; min-height: 0; }
                .lmm-sidebar { width: 170px; border-right: 1px solid var(--lmm-border); background: var(--lmm-bg2); overflow-y: auto; padding: 8px 6px; flex-shrink: 0; }
                .lmm-content.visible-mode .lmm-sidebar { display: none; }

                .lmm-sidebar-item { display: flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 5px; cursor: pointer; font-size: 11px; transition: all 0.1s; user-select: none; }
                .lmm-sidebar-item:hover { background: var(--lmm-bg3); }
                .lmm-sidebar-item.active { background: var(--lmm-primary); color: #fff; }
                .lmm-sidebar-item .icon { display: inline-flex; width: 1.4em; justify-content: center; flex-shrink: 0; }
                .lmm-sidebar-item .cnt { margin-left: auto; font-size: 10px; background: var(--lmm-bg); padding: 1px 5px; border-radius: 6px; color: var(--lmm-text2); }
                .lmm-sidebar-item.active .cnt { background: rgba(255,255,255,0.2); color: #fff; }
                .lmm-sidebar-item.sort-mode { cursor: grab; background: var(--lmm-bg3); }
                .lmm-sidebar-item.sort-mode:active { cursor: grabbing; }
                .lmm-sidebar-item.dragging { opacity: 0.5; background: var(--lmm-primary); color: #fff; }
                .lmm-sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 0 6px; margin: 6px 0 4px; }
                .lmm-sidebar-title { font-size: 10px; font-weight: 600; text-transform: uppercase; color: var(--lmm-text2); letter-spacing: 0.3px; }
                .lmm-sidebar-btn { font-size: 10px; color: var(--lmm-primary); cursor: pointer; background: none; border: none; padding: 2px 4px; }
                .lmm-sidebar-btn.active { color: var(--lmm-success); font-weight: 600; }
                .lmm-sidebar-folder { display: flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 5px; cursor: pointer; font-size: 11px; color: var(--lmm-text2); transition: all 0.1s; }
                .lmm-sidebar-folder:hover { background: var(--lmm-bg3); color: var(--lmm-text); }
                .lmm-sidebar-folder .icon { display: inline-flex; width: 1.4em; justify-content: center; }
                .lmm-sidebar-folder .cnt { margin-left: auto; font-size: 10px; background: var(--lmm-bg); padding: 1px 5px; border-radius: 6px; color: var(--lmm-text2); }
                .lmm-sidebar-folder-content { display: none; padding-left: 8px; }
                .lmm-sidebar-folder-content.open { display: block; }

                .lmm-list { flex: 1; overflow-y: auto; padding: 10px; }
                .lmm-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px; }
                .lmm-count { color: var(--lmm-text2); font-size: 12px; }
                .lmm-batch { display: flex; gap: 5px; flex-wrap: wrap; }
                .lmm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }

                .lmm-grid.list-view { display: flex; flex-direction: column; gap: 4px; }
                .lmm-grid.list-view .lmm-card { padding: 6px 10px; }
                .lmm-grid.list-view .lmm-card-info { display: flex; align-items: center; gap: 8px; }
                .lmm-grid.list-view .lmm-card-name { margin-bottom: 0; font-size: 12px; }
                .lmm-grid.list-view .lmm-tags { margin-left: auto; }
                .lmm-grid.list-view .lmm-card.dragging { opacity: 0.5; border-color: var(--lmm-primary); background: var(--lmm-bg3); }
                .lmm-drag-handle { cursor: grab; color: var(--lmm-text2); font-size: 12px; margin-right: 4px; }

                .lmm-card { display: flex; align-items: flex-start; gap: 8px; padding: 9px; border: 1px solid var(--lmm-border); border-radius: 8px; background: var(--lmm-bg); cursor: pointer; transition: all 0.15s; position: relative; }
                .lmm-card:hover { border-color: var(--lmm-primary); }
                .lmm-card.hidden { opacity: 0.5; background: var(--lmm-bg3); }
                .lmm-card.new { border-color: var(--lmm-success); }
                .lmm-card.starred { border-color: var(--lmm-warning); }
                .lmm-check { width: 15px; height: 15px; border: 2px solid var(--lmm-border); border-radius: 3px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 9px; margin-top: 2px; }
                .lmm-check.on { background: var(--lmm-primary); border-color: var(--lmm-primary); color: #fff; }
                .lmm-card-info { flex: 1; min-width: 0; }
                .lmm-card-name { font-weight: 500; font-size: 11px; display: flex; align-items: center; gap: 4px; margin-bottom: 3px; }
                .lmm-card-name .n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .lmm-tags { display: flex; flex-wrap: wrap; gap: 2px; }
                .lmm-tag { padding: 1px 4px; border-radius: 3px; font-size: 9px; background: var(--lmm-bg3); color: var(--lmm-text2); }
                .lmm-tag.company { background: #e0e7ff; color: #4338ca; }
                .lmm-tag.mode { background: #fef3c7; color: #92400e; }
                .lmm-tag.new { background: #dcfce7; color: #166534; }
                .lmm-tag.oss { background: #dbeafe; color: #1e40af; }
                @media (prefers-color-scheme: dark) {
                    .lmm-tag.company { background: #3730a3; color: #c7d2fe; }
                    .lmm-tag.mode { background: #78350f; color: #fef3c7; }
                    .lmm-tag.new { background: #166534; color: #bbf7d0; }
                    .lmm-tag.oss { background: #1e40af; color: #bfdbfe; }
                }
                .lmm-card-actions { position: absolute; top: 4px; right: 4px; display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; }
                .lmm-card:hover .lmm-card-actions { opacity: 1; }
                .lmm-card-btn { font-size: 12px; background: var(--lmm-bg2); border: 1px solid var(--lmm-border); border-radius: 4px; padding: 2px 5px; cursor: pointer; transition: all 0.15s; }
                .lmm-card-btn:hover { background: var(--lmm-primary); color: #fff; border-color: var(--lmm-primary); }
                .lmm-card-btn.starred { color: var(--lmm-warning); }

                .lmm-footer { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-top: 1px solid var(--lmm-border); background: var(--lmm-bg2); border-radius: 0 0 12px 12px; font-size: 11px; color: var(--lmm-text2); flex-wrap: wrap; gap: 6px; flex-shrink: 0; }
                .lmm-stats { display: flex; gap: 12px; }
                .lmm-stat b { color: var(--lmm-text); }
                .lmm-empty { text-align: center; padding: 30px 20px; color: var(--lmm-text2); }
                .lmm-empty-icon { font-size: 32px; margin-bottom: 8px; opacity: 0.5; }
                .lmm-toast { position: fixed; top: 60px; right: 12px; display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--lmm-bg); border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 100001; animation: lmm-in 0.25s ease; border-left: 3px solid var(--lmm-primary); font-size: 13px; max-width: 350px; }
                .lmm-toast-success { border-left-color: var(--lmm-success); }
                .lmm-toast-warning { border-left-color: var(--lmm-warning); }
                @keyframes lmm-in { from { transform: translateX(100%); opacity: 0; } }
                .lmm-toast-x { background: none; border: none; font-size: 16px; cursor: pointer; color: var(--lmm-text2); }
                .lmm-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); background: var(--lmm-bg); border-radius: 10px; padding: 16px; z-index: 100002; min-width: 320px; max-width: 90vw; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2); opacity: 0; visibility: hidden; transition: all 0.2s; }
                .lmm-modal.open { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }
                .lmm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100001; opacity: 0; visibility: hidden; transition: all 0.2s; }
                .lmm-modal-overlay.open { opacity: 1; visibility: visible; }
                .lmm-modal-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
                .lmm-modal-body { margin-bottom: 14px; }
                .lmm-modal-footer { display: flex; justify-content: flex-end; gap: 8px; }
                .lmm-form-group { margin-bottom: 12px; }
                .lmm-form-label { display: block; font-size: 11px; font-weight: 500; margin-bottom: 4px; color: var(--lmm-text2); }
                .lmm-form-input, .lmm-form-select { width: 100%; padding: 7px 10px; border: 1px solid var(--lmm-border); border-radius: 6px; font-size: 13px; background: var(--lmm-bg); color: var(--lmm-text); }
                .lmm-checkbox-group { display: flex; flex-wrap: wrap; gap: 6px; }
                .lmm-checkbox-item { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border: 1px solid var(--lmm-border); border-radius: 5px; font-size: 11px; cursor: pointer; transition: all 0.15s; }
                .lmm-checkbox-item:hover { border-color: var(--lmm-primary); }
                .lmm-checkbox-item.checked { background: var(--lmm-primary); color: #fff; border-color: var(--lmm-primary); }
                .lmm-scan-list { max-height: 300px; overflow-y: auto; margin: 10px 0; }
                .lmm-scan-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--lmm-border); font-size: 12px; }
                .lmm-scan-item:last-child { border-bottom: none; }

                @media (max-width: 600px) {
                    .lmm-panel { width: 100vw; height: 100vh; max-width: none; max-height: none; border-radius: 0; }
                    .lmm-sidebar { display: none; }
                    .lmm-grid { grid-template-columns: 1fr; }
                }
            `);
        }

        createFab() {
            const fab = document.createElement('button'); fab.className = 'lmm-fab'; fab.innerHTML = '🎛️'; fab.title = 'LMArena Manager (Ctrl+Shift+M)'; fab.onclick = () => this.toggle(); document.body.appendChild(fab); this.fab = fab; this.updateFabBadge();
        }
        updateFabBadge() { const hasNew = this.dm.getAllModels().some(m => m.isNew); this.fab?.classList.toggle('has-new', hasNew); }

        getModeCounts() {
            const models = this.dm.getAllModels();
            const counts = { all: models.length, chat: 0, search: 0, image: 0, code: 0, video: 0, starred: 0 };
            models.forEach(m => {
                if (Array.isArray(m.modes)) {
                    m.modes.forEach(mode => {
                        if (counts[mode] !== undefined) counts[mode]++;
                    });
                }
                if (m.starred) counts.starred++;
            });
            return counts;
        }

        createPanel() {
            const overlay = document.createElement('div'); overlay.className = 'lmm-overlay'; overlay.onclick = () => this.close(); document.body.appendChild(overlay); this.overlay = overlay;
            const panel = document.createElement('div'); panel.className = 'lmm-panel';
            // 修复 Select Option 的图标对齐
            panel.innerHTML = `
                <div class="lmm-header">
                    <div class="lmm-title"><span>🎛️</span> LMArena Manager <span style="font-size:10px;color:var(--lmm-text2)">v${VERSION}</span></div>
                    <div class="lmm-header-btns">
                        <button class="lmm-btn" id="lmm-scan-toggle">🔍 开始扫描</button>
                        <button class="lmm-btn" id="lmm-export">📤 导出</button>
                        <button class="lmm-btn" id="lmm-import">📥 导入</button>
                        <button class="lmm-btn" id="lmm-clear-new">✨ 清除标记</button>
                        <button class="lmm-btn" id="lmm-settings">⚙️</button>
                    </div>
                    <button class="lmm-close" id="lmm-close">×</button>
                </div>
                <div class="lmm-topbar" id="lmm-topbar"></div>
                <div class="lmm-subbar" id="lmm-subbar" style="display:none">
                    <div class="lmm-subbar-group">
                        <div class="lmm-subbar-item" data-mode="chat">Chat</div>
                        <div class="lmm-subbar-item" data-mode="search">Search</div>
                        <div class="lmm-subbar-item" data-mode="image">Image</div>
                        <div class="lmm-subbar-item" data-mode="code">Code</div>
                        <div class="lmm-subbar-item" data-mode="video">Video</div>
                    </div>
                    <div style="flex:1"></div>
                    <button class="lmm-btn" id="lmm-model-sort-btn">⇅ 排序</button>
                </div>
                <div class="lmm-toolbar">
                    <div class="lmm-search"><span class="lmm-search-icon">🔍</span><input type="text" placeholder="搜索模型..." id="lmm-search"></div>
                    <select class="lmm-select" id="lmm-company"><option value="all">📂 所有公司</option></select>
                    <select class="lmm-select" id="lmm-category"><option value="all">📂 所有类型</option><option value="speed">⚡ 快速</option><option value="thinking">🧠 思考</option><option value="pro">👑 旗舰</option><option value="mini">📱 轻量</option><option value="oss">🔓 开源</option></select>
                    <select class="lmm-select" id="lmm-sort"><option value="starred-desc">⭐ 收藏优先</option><option value="name-asc">🔤 名称 A-Z</option><option value="name-desc">🔤 名称 Z-A</option><option value="company-asc">🏢 按公司</option><option value="date-desc">🕒 最新添加</option></select>
                </div>
                <div class="lmm-content" id="lmm-content"><div class="lmm-sidebar" id="lmm-sidebar"></div><div class="lmm-list"><div class="lmm-list-header"><span class="lmm-count" id="lmm-count">0 个模型</span><div class="lmm-batch"><button class="lmm-btn" id="lmm-all-show">全部显示</button><button class="lmm-btn" id="lmm-all-hide">全部隐藏</button><button class="lmm-btn lmm-btn-primary" id="lmm-apply">✓ 应用</button></div></div><div class="lmm-grid" id="lmm-grid"></div></div></div>
                <div class="lmm-footer"><div class="lmm-stats"><span class="lmm-stat">显示: <b id="lmm-v">0</b></span><span class="lmm-stat">隐藏: <b id="lmm-h">0</b></span><span class="lmm-stat">总计: <b id="lmm-t">0</b></span></div><span>Ctrl+Shift+M 打开 | 双击卡片编辑</span></div>
            `;
            document.body.appendChild(panel); this.panel = panel; this.bindEvents();
        }

        // ... helpers ...
        createEditModal() { const modalOverlay = document.createElement('div'); modalOverlay.className = 'lmm-modal-overlay'; modalOverlay.onclick = () => this.closeEditModal(); document.body.appendChild(modalOverlay); this.editModalOverlay = modalOverlay; const modal = document.createElement('div'); modal.className = 'lmm-modal'; modal.innerHTML = `<div class="lmm-modal-title">✏️ 编辑模型</div><div class="lmm-modal-body"><div class="lmm-form-group"><label class="lmm-form-label">模型名称</label><input type="text" class="lmm-form-input" id="lmm-edit-name" readonly></div><div class="lmm-form-group"><label class="lmm-form-label">所属公司</label><input type="text" class="lmm-form-input" id="lmm-edit-company" placeholder="输入公司名"></div><div class="lmm-form-group"><label class="lmm-form-label">Arena 模式 (多选)</label><div class="lmm-checkbox-group" id="lmm-edit-modes"><div class="lmm-checkbox-item" data-mode="chat">💬 Chat</div><div class="lmm-checkbox-item" data-mode="search">🔍 Search</div><div class="lmm-checkbox-item" data-mode="image">🎨 Image</div><div class="lmm-checkbox-item" data-mode="code">💻 Code</div><div class="lmm-checkbox-item" data-mode="video">🎬 Video</div></div></div><div class="lmm-form-group"><label class="lmm-form-label">类型标签</label><div class="lmm-checkbox-group" id="lmm-edit-categories"><div class="lmm-checkbox-item" data-cat="speed">⚡ 快速</div><div class="lmm-checkbox-item" data-cat="thinking">🧠 思考</div><div class="lmm-checkbox-item" data-cat="pro">👑 旗舰</div><div class="lmm-checkbox-item" data-cat="mini">📱 轻量</div><div class="lmm-checkbox-item" data-cat="oss">🔓 开源</div></div></div></div><div class="lmm-modal-footer"><button class="lmm-btn" id="lmm-edit-cancel">取消</button><button class="lmm-btn lmm-btn-primary" id="lmm-edit-save">保存</button></div>`; document.body.appendChild(modal); this.editModal = modal; modal.querySelectorAll('.lmm-checkbox-item').forEach(item => { item.onclick = () => item.classList.toggle('checked'); }); modal.querySelector('#lmm-edit-cancel').onclick = () => this.closeEditModal(); modal.querySelector('#lmm-edit-save').onclick = () => this.saveEdit(); }
        createConfirmModal() { const modalOverlay = document.createElement('div'); modalOverlay.className = 'lmm-modal-overlay'; document.body.appendChild(modalOverlay); this.confirmModalOverlay = modalOverlay; const modal = document.createElement('div'); modal.className = 'lmm-modal'; modal.innerHTML = `<div class="lmm-modal-title" id="lmm-confirm-title">确认操作</div><div class="lmm-modal-body"><p id="lmm-confirm-msg">确定要执行此操作吗？</p></div><div class="lmm-modal-footer"><button class="lmm-btn" id="lmm-confirm-no">取消</button><button class="lmm-btn lmm-btn-danger" id="lmm-confirm-yes">确认</button></div>`; document.body.appendChild(modal); this.confirmModal = modal; }
        createScanResultModal() { const modalOverlay = document.createElement('div'); modalOverlay.className = 'lmm-modal-overlay'; document.body.appendChild(modalOverlay); this.scanModalOverlay = modalOverlay; const modal = document.createElement('div'); modal.className = 'lmm-modal'; modal.style.minWidth = '400px'; modal.innerHTML = `<div class="lmm-modal-title">🔍 扫描结果</div><div class="lmm-modal-body"><p id="lmm-scan-summary"></p><div class="lmm-scan-list" id="lmm-scan-list"></div></div><div class="lmm-modal-footer"><button class="lmm-btn" id="lmm-scan-keep">保留全部</button><button class="lmm-btn lmm-btn-danger" id="lmm-scan-delete">删除选中</button></div>`; document.body.appendChild(modal); this.scanModal = modal; }
        showConfirm(title, msg, onConfirm) { this.confirmModal.querySelector('#lmm-confirm-title').textContent = title; this.confirmModal.querySelector('#lmm-confirm-msg').textContent = msg; this.confirmModalOverlay.classList.add('open'); this.confirmModal.classList.add('open'); const closeConfirm = () => { this.confirmModalOverlay.classList.remove('open'); this.confirmModal.classList.remove('open'); }; this.confirmModal.querySelector('#lmm-confirm-yes').onclick = () => { closeConfirm(); onConfirm(); }; this.confirmModal.querySelector('#lmm-confirm-no').onclick = closeConfirm; this.confirmModalOverlay.onclick = closeConfirm; }
        showScanResult(result) { const { missing, scannedCount } = result; this.scanModal.querySelector('#lmm-scan-summary').innerHTML = `本次扫描到 <b>${scannedCount}</b> 个模型，${missing.length > 0 ? `以下 <b>${missing.length}</b> 个模型未被扫描到：` : `所有模型均已扫描到 ✓`}`; const list = this.scanModal.querySelector('#lmm-scan-list'); if (missing.length > 0) { list.innerHTML = `<div class="lmm-scan-item" style="font-weight:500;background:var(--lmm-bg3)"><input type="checkbox" id="lmm-scan-all" checked><label for="lmm-scan-all">全选</label></div>` + missing.map(name => `<div class="lmm-scan-item"><input type="checkbox" class="lmm-scan-check" value="${this.esc(name)}" checked><span>${this.esc(name)}</span></div>`).join(''); list.querySelector('#lmm-scan-all').onchange = (e) => { list.querySelectorAll('.lmm-scan-check').forEach(cb => cb.checked = e.target.checked); }; } else { list.innerHTML = ''; } this.scanModal.querySelector('#lmm-scan-delete').style.display = missing.length > 0 ? '' : 'none'; this.scanModalOverlay.classList.add('open'); this.scanModal.classList.add('open'); const closeScan = () => { this.scanModalOverlay.classList.remove('open'); this.scanModal.classList.remove('open'); }; this.scanModal.querySelector('#lmm-scan-keep').onclick = closeScan; this.scanModal.querySelector('#lmm-scan-delete').onclick = () => { const toDelete = [...list.querySelectorAll('.lmm-scan-check:checked')].map(cb => cb.value); if (toDelete.length > 0) { this.dm.deleteModels(toDelete); this.scanner.toast(`已删除 ${toDelete.length} 个模型`, 'success'); this.refresh(); this.updateSidebar(); this.updateTopbar(); } closeScan(); }; this.scanModalOverlay.onclick = closeScan; }

        $(sel) { return this.panel.querySelector(sel); }
        $$(sel) { return this.panel.querySelectorAll(sel); }

        bindEvents() {
            this.$('#lmm-close').onclick = () => this.close();
            this.$('#lmm-scan-toggle').onclick = () => {
                const btn = this.$('#lmm-scan-toggle');
                if (this.scanner.isScanActive()) {
                    const result = this.scanner.endScanSession();
                    btn.textContent = '🔍 开始扫描'; btn.classList.remove('scanning', 'lmm-btn-success');
                    this.showScanResult(result);
                } else {
                    this.scanner.startScanSession(); btn.textContent = '⏹️ 结束扫描'; btn.classList.add('scanning', 'lmm-btn-success');
                }
            };
            this.$('#lmm-export').onclick = () => { const blob = new Blob([this.dm.export()], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `lmarena-manager-${new Date().toISOString().slice(0,10)}.json`; a.click(); this.scanner.toast('已导出', 'success'); };
            this.$('#lmm-import').onclick = () => { const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'; input.onchange = e => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => { if (this.dm.import(ev.target.result)) { this.refresh(); this.updateSidebar(); this.updateTopbar(); this.scanner.toast('导入成功', 'success'); } else { this.scanner.toast('导入失败', 'warning'); } }; reader.readAsText(file); }; input.click(); };
            this.$('#lmm-clear-new').onclick = () => { this.dm.clearNewFlags(); this.refresh(); this.updateFabBadge(); this.scanner.toast('已清除标记', 'success'); };
            this.$('#lmm-settings').onclick = () => { const autoApply = this.dm.data.settings.autoApply; this.showConfirm('⚙️ 设置', `自动应用当前${autoApply ? '已开启' : '已关闭'}，是否${autoApply ? '关闭' : '开启'}？`, () => { this.dm.data.settings.autoApply = !autoApply; this.dm.save(); this.scanner.toast(`自动应用已${!autoApply ? '开启' : '关闭'}`, 'success'); }); };
            this.$('#lmm-search').oninput = e => { this.filter.search = e.target.value.toLowerCase(); this.refresh(); };
            this.$('#lmm-company').onchange = e => { this.filter.company = e.target.value; this.refresh(); };
            this.$('#lmm-category').onchange = e => { this.filter.category = e.target.value; this.refresh(); };
            this.$('#lmm-sort').onchange = e => { const [by, order] = e.target.value.split('-'); this.sort = { by, order: order || 'asc' }; this.refresh(); };
            this.$('#lmm-all-show').onclick = () => this.batchSet(true);
            this.$('#lmm-all-hide').onclick = () => this.batchSet(false);
            this.$('#lmm-apply').onclick = () => { this.scanner.applyFilters(); this.scanner.toast('已应用', 'success'); };

            this.$('#lmm-subbar').querySelectorAll('.lmm-subbar-item').forEach(item => {
                item.onclick = () => {
                    this.visibleSubMode = item.dataset.mode;
                    this.updateSubbar();
                    this.refresh();
                }
            });

            this.$('#lmm-model-sort-btn').onclick = () => {
                this.isModelSortMode = !this.isModelSortMode;
                const btn = this.$('#lmm-model-sort-btn');
                if (this.isModelSortMode) {
                    this.$('#lmm-grid').classList.add('list-view');
                    btn.textContent = '✓ 排序中 (拖拽自动保存)';
                    btn.classList.add('active');
                } else {
                    this.$('#lmm-grid').classList.remove('list-view');
                    btn.textContent = '⇅ 排序';
                    btn.classList.remove('active');
                }
                this.refresh();
            };
        }

        bindShortcuts() {
            document.addEventListener('keydown', e => {
                if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) { e.preventDefault(); this.toggle(); }
                if (e.key === 'Escape') {
                    if (this.editModal.classList.contains('open')) this.closeEditModal();
                    else if (this.confirmModal.classList.contains('open')) { this.confirmModalOverlay.classList.remove('open'); this.confirmModal.classList.remove('open'); }
                    else if (this.scanModal.classList.contains('open')) { this.scanModalOverlay.classList.remove('open'); this.scanModal.classList.remove('open'); }
                    else if (this.isOpen) this.close();
                }
            });
        }

        toggle() { this.isOpen ? this.close() : this.open(); }
        open() { this.isOpen = true; this.panel.classList.add('open'); this.overlay.classList.add('open'); this.updateTopbar(); this.refresh(); this.updateSidebar(); }
        close() { this.isOpen = false; this.isSortMode = false; this.isModelSortMode = false; this.$('#lmm-grid').classList.remove('list-view'); this.panel.classList.remove('open'); this.overlay.classList.remove('open'); }

        updateTopbar() {
            const counts = this.getModeCounts();
            const topbar = this.$('#lmm-topbar');
            const items = [
                { key: 'all', icon: '📋', label: '全部', count: counts.all },
                { key: 'chat', icon: '💬', label: 'Chat', count: counts.chat },
                { key: 'search', icon: '🔍', label: 'Search', count: counts.search },
                { key: 'image', icon: '🎨', label: 'Image', count: counts.image },
                { key: 'code', icon: '💻', label: 'Code', count: counts.code },
                { key: 'video', icon: '🎬', label: 'Video', count: counts.video },
            ];
            topbar.innerHTML = items.map(it => `<div class="lmm-topbar-item ${this.currentMode === it.key ? 'active' : ''}" data-mode="${it.key}">${it.icon} ${it.label} ${it.count > 0 ? `<span class="cnt">${it.count}</span>` : ''}</div>`).join('') + `<div class="lmm-topbar-sep"></div><div class="lmm-topbar-item ${this.currentMode === 'visible' ? 'active' : ''}" data-mode="visible">👁️ 已启用</div><div class="lmm-topbar-item ${this.currentMode === 'hidden' ? 'active' : ''}" data-mode="hidden">🙈 已隐藏</div><div class="lmm-topbar-item ${this.currentMode === 'starred' ? 'active' : ''}" data-mode="starred">⭐ 收藏 ${counts.starred > 0 ? `<span class="cnt">${counts.starred}</span>` : ''}</div><div class="lmm-topbar-item ${this.currentMode === 'new' ? 'active' : ''}" data-mode="new">✨ 新发现</div>`;
            topbar.querySelectorAll('.lmm-topbar-item').forEach(item => {
                item.onclick = () => {
                    this.currentMode = item.dataset.mode;
                    this.filter = { search: '', company: 'all', category: 'all', visibility: 'all' };
                    this.$('#lmm-search').value = ''; this.$('#lmm-company').value = 'all'; this.$('#lmm-category').value = 'all';
                    this.isTier2Expanded = false; this.isModelSortMode = false; this.$('#lmm-grid').classList.remove('list-view');
                    this.updateTopbar(); this.updateSidebar(); this.updateSubbar(); this.refresh();
                };
            });
        }

        updateSubbar() {
            const subbar = this.$('#lmm-subbar'); const content = this.$('#lmm-content');
            if (this.currentMode === 'visible') {
                subbar.style.display = 'flex'; content.classList.add('visible-mode');
                subbar.querySelectorAll('.lmm-subbar-item').forEach(el => { el.classList.toggle('active', el.dataset.mode === this.visibleSubMode); });
                const btn = this.$('#lmm-model-sort-btn'); btn.textContent = this.isModelSortMode ? '✓ 排序中' : '⇅ 排序'; btn.classList.toggle('active', this.isModelSortMode);
            } else { subbar.style.display = 'none'; content.classList.remove('visible-mode'); }
        }

        getModelsInCurrentMode() {
            const models = this.dm.getAllModels();
            if (this.currentMode === 'visible') {
                return models.filter(m => m.visible !== false && Array.isArray(m.modes) && m.modes.includes(this.visibleSubMode));
            }
            switch (this.currentMode) {
                case 'all': return models;
                case 'starred': return models.filter(m => m.starred);
                case 'hidden': return models.filter(m => m.visible === false);
                case 'new': return models.filter(m => m.isNew);
                default: return models.filter(m => Array.isArray(m.modes) && m.modes.includes(this.currentMode));
            }
        }

        updateSidebar() {
            if (this.currentMode === 'visible') return;
            const modeModels = this.getModelsInCurrentMode();
            const companyOrder = this.dm.getCompanyOrder();
            const showCategories = !['search', 'image', 'video'].includes(this.currentMode);
            const noFolderModes = ['search', 'image', 'code', 'video'];
            const useFolder = !noFolderModes.includes(this.currentMode);

            let html = `<div class="lmm-sidebar-header"><span class="lmm-sidebar-title">按公司</span><button class="lmm-sidebar-btn ${this.isSortMode ? 'active' : ''}" id="lmm-sort-btn">${this.isSortMode ? '完成' : '排序'}</button></div><div id="lmm-company-list"></div>`;
            if (showCategories) html += `<div class="lmm-sidebar-header" style="margin-top:12px"><span class="lmm-sidebar-title">按类型</span></div><div id="lmm-category-list"></div>`;
            this.$('#lmm-sidebar').innerHTML = html;

            const companies = {};
            modeModels.forEach(m => { const c = m.company || 'Other'; if (!companies[c]) companies[c] = { cnt: 0, icon: m.icon || '❔' }; companies[c].cnt++; });
            const tier1 = [], tier2 = [], other = [];
            Object.entries(companies).forEach(([name, data]) => {
                const item = { name, ...data };
                if (TIER1_COMPANIES.includes(name)) tier1.push(item);
                else if (useFolder && TIER2_COMPANIES.includes(name)) tier2.push(item);
                else if (name !== 'Other') other.push(item);
            });
            const sortByOrder = arr => arr.sort((a, b) => { const ai = companyOrder.indexOf(a.name); const bi = companyOrder.indexOf(b.name); return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi); });
            sortByOrder(tier1); sortByOrder(tier2); sortByOrder(other);
            const tier2Total = tier2.reduce((sum, c) => sum + c.cnt, 0); const hasOther = companies['Other'];
            this.renderCompanyList(tier1, tier2, tier2Total, hasOther, other);

            if (showCategories) {
                const cats = { speed: 0, thinking: 0, pro: 0, mini: 0, oss: 0 };
                modeModels.forEach(m => { (m.categories || []).forEach(c => { if (cats[c] !== undefined) cats[c]++; }); });
                const catLabels = { speed: { icon: '⚡', label: '快速' }, thinking: { icon: '🧠', label: '思考' }, pro: { icon: '👑', label: '旗舰' }, mini: { icon: '📱', label: '轻量' }, oss: { icon: '🔓', label: '开源' } };
                const catList = this.$('#lmm-category-list');
                if (catList) {
                    catList.innerHTML = Object.entries(cats).filter(([_, cnt]) => cnt > 0).map(([cat, cnt]) => `<div class="lmm-sidebar-item ${this.filter.category === cat ? 'active' : ''}" data-cat="${cat}"><span class="icon">${catLabels[cat].icon}</span> <span>${catLabels[cat].label}</span> <span class="cnt">${cnt}</span></div>`).join('');
                    catList.querySelectorAll('.lmm-sidebar-item').forEach(item => { item.onclick = () => { if (this.isSortMode) return; catList.querySelectorAll('.lmm-sidebar-item').forEach(i => i.classList.remove('active')); item.classList.add('active'); this.filter.category = item.dataset.cat; this.refresh(); }; });
                }
            }
            this.$('#lmm-sort-btn').onclick = () => this.toggleSortMode();
        }

        renderCompanyList(tier1, tier2, tier2Total, hasOther, other) {
            const list = this.$('#lmm-company-list');
            const renderItem = (c, inFolder = false) => `<div class="lmm-sidebar-item ${this.isSortMode ? 'sort-mode' : ''} ${this.filter.company === c.name ? 'active' : ''}" data-company="${this.esc(c.name)}" ${this.isSortMode ? 'draggable="true"' : ''}>${this.isSortMode ? '<span class="lmm-drag-handle">⠿</span>' : ''}<span class="icon">${c.icon}</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis">${this.esc(c.name)}</span><span class="cnt">${c.cnt}</span></div>`;
            let html = tier1.map(c => renderItem(c)).join('');
            if (tier2.length > 0) {
                html += `<div class="lmm-sidebar-folder" id="lmm-tier2-folder"><span class="icon">${this.isTier2Expanded ? '📂' : '📁'}</span><span>更多公司</span><span class="cnt">${tier2Total}</span></div><div class="lmm-sidebar-folder-content ${this.isTier2Expanded ? 'open' : ''}" id="lmm-tier2-content">${tier2.map(c => renderItem(c, true)).join('')}</div>`;
            }
            other.forEach(c => html += renderItem(c));
            if (hasOther) html += renderItem({ name: 'Other', icon: '❔', cnt: hasOther.cnt });
            list.innerHTML = html;

            const folder = this.$('#lmm-tier2-folder');
            if (folder) folder.onclick = () => { this.isTier2Expanded = !this.isTier2Expanded; this.$('#lmm-tier2-content').classList.toggle('open', this.isTier2Expanded); folder.querySelector('.icon').textContent = this.isTier2Expanded ? '📂' : '📁'; };

            list.querySelectorAll('.lmm-sidebar-item').forEach(item => {
                if (this.isSortMode) { this.bindDragEvents(item); item.onclick = (e) => e.preventDefault(); }
                else { item.onclick = (e) => { if (e.target.closest('.lmm-drag-handle')) return; list.querySelectorAll('.lmm-sidebar-item').forEach(i => i.classList.remove('active')); item.classList.add('active'); this.filter.company = item.dataset.company; this.refresh(); }; }
            });
        }

        toggleSortMode() {
            this.isSortMode = !this.isSortMode;
            if (!this.isSortMode) {
                const items = this.$('#lmm-company-list').querySelectorAll('.lmm-sidebar-item[data-company]');
                const newOrder = [...items].map(i => i.dataset.company).filter(Boolean);
                this.dm.setCompanyOrder(newOrder);
            } else { if(this.$('#lmm-tier2-folder')) this.isTier2Expanded = true; }
            this.updateSidebar();
        }

        bindDragEvents(item) {
            item.ondragstart = (e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', item.dataset.company); item.classList.add('dragging'); };
            item.ondragend = () => item.classList.remove('dragging');
            item.ondragover = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
            item.ondrop = (e) => {
                e.preventDefault(); const from = e.dataTransfer.getData('text/plain'); const to = item.dataset.company;
                if (from && to && from !== to) {
                    const order = this.dm.getCompanyOrder(); const fromIdx = order.indexOf(from);
                    if (fromIdx !== -1) { order.splice(fromIdx, 1); const toIdx = order.indexOf(to); order.splice(toIdx === -1 ? order.length : toIdx, 0, from); this.dm.setCompanyOrder(order); this.updateSidebar(); }
                }
            };
        }

        bindModelDragEvents(card) {
            card.setAttribute('draggable', 'true');
            card.ondragstart = (e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', card.dataset.name); card.classList.add('dragging'); };
            card.ondragend = () => card.classList.remove('dragging');
            card.ondragover = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
            card.ondrop = (e) => {
                e.preventDefault();
                const from = e.dataTransfer.getData('text/plain'); const to = card.dataset.name;
                if (from && to && from !== to) {
                    const grid = this.$('#lmm-grid'); const cards = Array.from(grid.children);
                    const fromCard = cards.find(c => c.dataset.name === from); const toCard = cards.find(c => c.dataset.name === to);
                    if (fromCard && toCard) {
                        const fromIdx = cards.indexOf(fromCard); const toIdx = cards.indexOf(toCard);
                        if (fromIdx < toIdx) grid.insertBefore(fromCard, toCard.nextSibling); else grid.insertBefore(fromCard, toCard);
                        const names = Array.from(grid.children).map(el => el.dataset.name);
                        this.dm.setModelOrder(this.visibleSubMode, names);
                        this.scanner.applyFilters();
                    }
                }
            };
        }

        updateCompanyFilter() {
            const modeModels = this.getModelsInCurrentMode();
            const companyOrder = this.dm.getCompanyOrder();
            const companies = [...new Set(modeModels.map(m => m.company).filter(Boolean))];
            companies.sort((a, b) => {
                if (a === 'Other') return 1; if (b === 'Other') return -1;
                const ai = companyOrder.indexOf(a); const bi = companyOrder.indexOf(b);
                return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            });
            const sel = this.$('#lmm-company'); const val = sel.value;
            sel.innerHTML = '<option value="all">📂 所有公司</option>' + companies.map(c => `<option value="${this.esc(c)}">${this.esc(c)}</option>`).join('');
            sel.value = companies.includes(val) ? val : 'all';
        }

        getFiltered() {
            let models = this.getModelsInCurrentMode();
            if (this.filter.search) { const s = this.filter.search; models = models.filter(m => m.name.toLowerCase().includes(s) || m.company?.toLowerCase().includes(s)); }
            if (this.filter.company !== 'all') models = models.filter(m => m.company === this.filter.company);
            if (this.filter.category !== 'all') models = models.filter(m => m.categories?.includes(this.filter.category));

            const companyOrder = this.dm.getCompanyOrder();

            if (this.currentMode === 'visible') {
                const customOrder = this.dm.getModelOrder(this.visibleSubMode);
                if (customOrder.length > 0) {
                     models.sort((a, b) => {
                        let ai = customOrder.indexOf(a.name); let bi = customOrder.indexOf(b.name);
                        if (ai === -1) ai = 9999; if (bi === -1) bi = 9999;
                        if (ai !== bi) return ai - bi;
                        const cai = companyOrder.indexOf(a.company); const cbi = companyOrder.indexOf(b.company);
                        return (cai === -1 ? 999 : cai) - (cbi === -1 ? 999 : cbi);
                     });
                     return models;
                }
            }

            models.sort((a, b) => {
                if (this.sort.by === 'starred') { if (a.starred && !b.starred) return -1; if (!a.starred && b.starred) return 1; return a.name.localeCompare(b.name); }
                let c = 0;
                if (this.sort.by === 'name') c = a.name.localeCompare(b.name);
                else if (this.sort.by === 'company') { const ai = companyOrder.indexOf(a.company); const bi = companyOrder.indexOf(b.company); c = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.name.localeCompare(b.name); }
                else if (this.sort.by === 'date') c = (a.addedAt || 0) - (b.addedAt || 0);
                return this.sort.order === 'desc' ? -c : c;
            });
            return models;
        }

        batchSet(visible) {
            const models = this.getFiltered();
            models.forEach(m => {
                this.dm.setVisibility(m.name, visible);
            });
            this.refresh();
            if (this.dm.data.settings.autoApply) this.scanner.applyFilters();
        }

        esc(s) { if (!s) return ''; return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
        getModeIcon(modes) {
            if (!Array.isArray(modes) || modes.length === 0) return '❓';
            const icons = { chat: '💬', search: '🔍', image: '🎨', code: '💻', video: '🎬' };
            if (this.currentMode !== 'all' && this.currentMode !== 'visible' && icons[this.currentMode]) return icons[this.currentMode];
            return icons[modes[0]] || '❓';
        }
        getCategoryLabel(cat) { const labels = { speed: '⚡', thinking: '🧠', pro: '👑', mini: '📱', oss: '🔓' }; return labels[cat] || cat; }

        refresh() {
            const grid = this.$('#lmm-grid');
            const models = this.getFiltered();

            if (models.length === 0) {
                grid.innerHTML = `<div class="lmm-empty" style="grid-column:1/-1"><div class="lmm-empty-icon">📭</div><div>没有匹配的模型<br><br>请打开模型下拉框以触发自动扫描</div></div>`;
            } else {
                grid.innerHTML = models.map(m => {
                    const vis = m.visible !== false;
                    const catTags = (m.categories || []).slice(0, 3).map(c => `<span class="lmm-tag">${this.getCategoryLabel(c)}</span>`).join('');
                    const dragHandle = this.isModelSortMode ? '<span class="lmm-drag-handle">⠿</span>' : '';
                    const modes = Array.isArray(m.modes) ? m.modes : ['chat'];

                    return `
                        <div class="lmm-card ${vis ? '' : 'hidden'} ${m.isNew ? 'new' : ''} ${m.starred ? 'starred' : ''}" data-name="${this.esc(m.name)}">
                            ${dragHandle}
                            ${!this.isModelSortMode ? `<div class="lmm-check ${vis ? 'on' : ''}">${vis ? '✓' : ''}</div>` : ''}
                            <div class="lmm-card-info">
                                <div class="lmm-card-name">
                                    <span>${m.icon || '❔'}</span>
                                    <span class="n" title="${this.esc(m.name)}">${this.esc(m.name)}</span>
                                </div>
                                <div class="lmm-tags">
                                    <span class="lmm-tag company">${this.esc(m.company || 'Other')}</span>
                                    <span class="lmm-tag mode">${this.getModeIcon(modes)}</span>
                                    ${m.isNew ? '<span class="lmm-tag new">新</span>' : ''}
                                    ${catTags}
                                </div>
                            </div>
                            <div class="lmm-card-actions">
                                <button class="lmm-card-btn lmm-star-btn ${m.starred ? 'starred' : ''}" title="收藏">${m.starred ? '⭐' : '☆'}</button>
                                <button class="lmm-card-btn lmm-edit-btn" title="编辑">✏️</button>
                            </div>
                        </div>
                    `;
                }).join('');

                grid.querySelectorAll('.lmm-card').forEach(card => {
                    const name = card.dataset.name;
                    if (this.isModelSortMode) {
                        this.bindModelDragEvents(card);
                    } else {
                        card.onclick = (e) => {
                            if (e.target.closest('.lmm-card-actions')) return;
                            const newVis = !this.dm.isVisible(name);
                            this.dm.setVisibility(name, newVis);
                            card.classList.toggle('hidden', !newVis);
                            card.classList.remove('new');
                            const chk = card.querySelector('.lmm-check'); if(chk) { chk.classList.toggle('on', newVis); chk.textContent = newVis ? '✓' : ''; }
                            this.updateStats(); this.updateFabBadge();
                            if (this.dm.data.settings.autoApply) this.scanner.applyFilters();
                        };
                    }
                    card.ondblclick = () => this.openEditModal(name);
                    card.querySelector('.lmm-star-btn').onclick = (e) => { e.stopPropagation(); const starred = this.dm.toggleStar(name); card.classList.toggle('starred', starred); card.querySelector('.lmm-star-btn').textContent = starred ? '⭐' : '☆'; card.querySelector('.lmm-star-btn').classList.toggle('starred', starred); this.updateTopbar(); };
                    card.querySelector('.lmm-edit-btn').onclick = (e) => { e.stopPropagation(); this.openEditModal(name); };
                });
            }
            this.$('#lmm-count').textContent = `${models.length} 个模型`;
            this.updateStats(); this.updateCompanyFilter();
        }

        updateStats() {
            const modeModels = this.getModelsInCurrentMode();
            const v = modeModels.filter(m => m.visible !== false).length;
            this.$('#lmm-v').textContent = v; this.$('#lmm-h').textContent = modeModels.length - v; this.$('#lmm-t').textContent = modeModels.length;
        }

        openEditModal(name) {
            const m = this.dm.getModel(name);
            if (!m) return;
            this.editingModel = name;
            this.editModal.querySelector('#lmm-edit-name').value = name;
            this.editModal.querySelector('#lmm-edit-company').value = m.company === 'Other' ? '' : m.company;

            this.editModal.querySelectorAll('#lmm-edit-modes .lmm-checkbox-item').forEach(item => {
                const mode = item.dataset.mode;
                item.classList.toggle('checked', Array.isArray(m.modes) && m.modes.includes(mode));
            });

            this.editModal.querySelectorAll('#lmm-edit-categories .lmm-checkbox-item').forEach(item => {
                item.classList.toggle('checked', (m.categories || []).includes(item.dataset.cat));
            });
            this.editModalOverlay.classList.add('open'); this.editModal.classList.add('open');
        }

        closeEditModal() { this.editModalOverlay.classList.remove('open'); this.editModal.classList.remove('open'); this.editingModel = null; }

        saveEdit() {
            if (!this.editingModel) return;
            const company = this.editModal.querySelector('#lmm-edit-company').value.trim();
            const modes = [];
            this.editModal.querySelectorAll('#lmm-edit-modes .lmm-checkbox-item.checked').forEach(item => { modes.push(item.dataset.mode); });
            if (modes.length === 0) modes.push('chat'); // 至少保留 Chat

            const categories = [];
            this.editModal.querySelectorAll('#lmm-edit-categories .lmm-checkbox-item.checked').forEach(item => { categories.push(item.dataset.cat); });

            this.dm.updateModel(this.editingModel, { company: company || 'Other', companyManual: true, modes, modesManual: true, categories, categoriesManual: true });
            this.closeEditModal(); this.refresh(); this.updateSidebar(); this.updateTopbar(); this.scanner.toast('已保存', 'success');
        }
    }

    function init() {
        console.log(`[LMM] LMArena Manager v${VERSION} 启动`);
        const dm = new DataManager();
        const scanner = new Scanner(dm);
        const ui = new UI(dm, scanner);
        ui.init();
        scanner.startObserving();
        // 延迟初次扫描
        setTimeout(() => scanner.scan(), 2000);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
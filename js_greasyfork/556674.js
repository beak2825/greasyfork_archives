// ==UserScript==
// @name         浮生十梦AI自动游玩 Pro Max
// @namespace    http://tampermonkey.net/
// @version      6.1.1
// @description  AI智能决策·玻璃态UI·Tab标签页·Pro Max升级版
// @author       HarleyAI
// @match        https://immortal.game.elysia.h-e.top/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.openai.com
// @connect      api.anthropic.com
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/556674/%E6%B5%AE%E7%94%9F%E5%8D%81%E6%A2%A6AI%E8%87%AA%E5%8A%A8%E6%B8%B8%E7%8E%A9%20Pro%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/556674/%E6%B5%AE%E7%94%9F%E5%8D%81%E6%A2%A6AI%E8%87%AA%E5%8A%A8%E6%B8%B8%E7%8E%A9%20Pro%20Max.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 常量定义 =====
    const SCRIPT_VERSION = '6.1.1';
    const API_INIT_ENDPOINT = 'https://immortal.game.elysia.h-e.top/api/game/init';
    const MAX_NARRATIVE_LOGS = 60;
    const HISTORY_LIMIT = 5;
    const MAX_HISTORY_LINES = 6;
    const MIN_WATCHDOG_INTERVAL = 1500;
    const GEMINI_DEFAULT_MODEL = 'gemini-1.5-flash';
    const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

    const DEFAULT_CONFIG = {
        aiProvider: 'openai',
        apiKey: 'YOUR_API_KEY_HERE',
        model: 'gpt-4o-mini',
        autoPlay: false,
        targetStones: 50,
        safetyThreshold: 30,
        debugMode: false,
        userConfirmExit: true,
        customApiUrl: '',
        useCustomUrl: false,
        manualMode: false,
        watchdogInterval: 4000,
        uiCompact: false,
        activeTab: 'dashboard'  // 新增：当前激活的Tab
    };

    // ===== 主题配置 =====
    const STATUS_THEME = {
        idle: {
            label: '待命',
            border: 'rgba(147,197,253,0.6)',
            glow: '0 0 22px rgba(147,197,253,0.3)',
            color: '#bfdbfe',
            icon: '⏸️'
        },
        thinking: {
            label: '思考中',
            border: 'rgba(59,130,246,0.85)',
            glow: '0 0 28px rgba(59,130,246,0.35)',
            color: '#93c5fd',
            icon: '🧠'
        },
        danger: {
            label: '高危',
            border: 'rgba(248,113,113,0.85)',
            glow: '0 0 28px rgba(248,113,113,0.45)',
            color: '#fecaca',
            icon: '⚠️'
        },
        safe: {
            label: '安全',
            border: 'rgba(74,222,128,0.85)',
            glow: '0 0 28px rgba(74,222,128,0.45)',
            color: '#bbf7d0',
            icon: '✅'
        }
    };

    const RISK_THEME = {
        high: { color: '#f87171', label: '高危', bg: 'rgba(248,113,113,0.15)' },
        medium: { color: '#fbbf24', label: '中危', bg: 'rgba(251,191,36,0.15)' },
        low: { color: '#34d399', label: '低危', bg: 'rgba(52,211,153,0.15)' },
        unknown: { color: '#a5b4fc', label: '未知', bg: 'rgba(165,180,252,0.15)' }
    };

    // ===== 风险关键词 =====
    const RISK_KEYWORDS = {
        high: ['强行突破', '献祭', '拼死', '粉身碎骨', '死亡', '覆灭', '崩溃', '魂飞魄散', '不得善终'],
        medium: ['挑战', '闯入', '搏杀', '深入', '险地', '危机', '对抗', '攻伐', '冒险'],
        low: ['休整', '防守', '观察', '谨慎', '准备', '疗伤', '回避', '稳固', '研究']
    };

    const HEALING_KEYWORDS = ['疗伤', '疗愈', '调息', '休整', '静养', '炼化', '稳固', '恢复'];
    const DEFENSE_KEYWORDS = ['防守', '后撤', '退避', '防御', '筑阵', '稳固', '观望'];
    const EXIT_KEYWORDS = ['破碎虚空', '结束', '收功', '离开梦境', '告别此梦'];
    const GAME_END_KEYWORDS = ['完成冒险并获得灵石', '功德圆满', '破碎虚空而去', '此番试炼,功德圆满'];

    // ===== ConfigManager 类 =====
    class ConfigManager {
        constructor() {
            this.values = { ...DEFAULT_CONFIG };
            this.persistKeys = new Set(Object.keys(DEFAULT_CONFIG).filter(key => key !== 'manualMode'));
            this.listeners = new Set();
            this.loadFromStorage();
        }

        loadFromStorage() {
            Object.keys(this.values).forEach(key => {
                const stored = GM_getValue(key, this.values[key]);
                this.values[key] = stored;
            });
        }

        get(key) {
            return this.values[key];
        }

        snapshot() {
            return { ...this.values };
        }

        set(key, value, options = {}) {
            if (!(key in this.values)) return;
            const previous = this.values[key];
            if (previous === value) return;
            this.values[key] = value;
            if (options.persist !== false && this.persistKeys.has(key)) {
                GM_setValue(key, value);
            }
            this.emit(key, value, options.meta);
        }

        batchSet(entries = {}) {
            Object.entries(entries).forEach(([key, value]) => this.set(key, value));
        }

        toggle(key) {
            this.set(key, !this.values[key]);
        }

        saveAll() {
            this.persistKeys.forEach(key => {
                GM_setValue(key, this.values[key]);
            });
        }

        subscribe(listener) {
            this.listeners.add(listener);
            return () => this.listeners.delete(listener);
        }

        emit(key, value, meta) {
            const payload = this.snapshot();
            this.listeners.forEach(listener => {
                try {
                    listener(key, value, payload, meta);
                } catch (error) {
                    console.error('[AI脚本] 配置监听器异常', error);
                }
            });
        }
    }

    // ===== UIManager 类 (重构版) =====
    class UIManager {
        constructor(configManager) {
            this.config = configManager;
            this.panel = null;
            this.banner = null;
            this.stoneLabel = null;
            this.progressBar = null;
            this.statusBadge = null;
            this.statusSubtitle = null;
            this.decisionLabel = null;
            this.historyList = null;
            this.resumeButton = null;
            this.apiStatus = null;
            this.testButton = null;
            this.testResult = null;
            this.toastHost = null;
            this.floatingOrb = null;
            this.tabs = {};
            this.tabButtons = {};
            this.configInputs = {};
            this.currentStatus = 'idle';
            this.handlers = {};
            this.compact = Boolean(this.config.get('uiCompact'));
            this.config.subscribe((key, value, snapshot) => this.handleConfigChange(key, value, snapshot));
        }

        mount(handlers = {}) {
            this.handlers = handlers;
            this.renderPanel();
            this.renderFloatingOrb();
            this.renderToastHost();
            this.applyConfigSnapshot(this.config.snapshot());
            this.syncCompactState();
        }

        renderPanel() {
            if (this.panel) return;
            const panel = document.createElement('div');
            panel.id = 'ai-control-panel';
            panel.style.cssText = `
                position: fixed;
                top: 24px;
                right: 24px;
                width: 380px;
                background: rgba(15, 23, 42, 0.85);
                color: #e5f2ff;
                border-radius: 18px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', system-ui, sans-serif;
                z-index: 10000;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                overflow: hidden;
            `;

            panel.innerHTML = this.buildPanelHTML();

            // 添加拖拽功能
            this.makeDraggable(panel);

            // 双击收缩
            panel.addEventListener('dblclick', (e) => {
                if (e.target === panel || e.target.id === 'ai-panel-header' || e.target.closest('#ai-panel-header')) {
                    this.toggleCompact();
                }
            });

            document.body.appendChild(panel);
            this.panel = panel;
            this.cacheDOMElements();
            this.bindEvents();
            this.switchTab(this.config.get('activeTab') || 'dashboard');
        }

        makeDraggable(element) {
            const header = element.querySelector('#ai-panel-header');
            if (!header) return;

            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let startLeft = 0;
            let startTop = 0;

            header.style.cursor = 'move';

            const onMouseDown = (e) => {
                // 忽略双击事件和非左键点击
                if (e.detail === 2 || e.button !== 0) return;

                // 只在标题栏上触发
                if (!e.target.closest('#ai-panel-header')) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                // 获取当前位置
                const rect = element.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;

                element.style.transition = 'none';
                e.preventDefault();
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newLeft = startLeft + deltaX;
                let newTop = startTop + deltaY;

                // 边界检查
                const rect = element.getBoundingClientRect();
                const maxLeft = window.innerWidth - rect.width - 10;
                const maxTop = window.innerHeight - rect.height - 10;

                newLeft = Math.max(10, Math.min(maxLeft, newLeft));
                newTop = Math.max(10, Math.min(maxTop, newTop));

                element.style.left = newLeft + 'px';
                element.style.top = newTop + 'px';
                element.style.right = 'auto';
                element.style.bottom = 'auto';

                e.preventDefault();
            };

            const onMouseUp = () => {
                if (isDragging) {
                    isDragging = false;
                    element.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
                }
            };

            header.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        buildPanelHTML() {
            return `
                <!-- Header -->
                <div id="ai-panel-header" style="padding:18px;border-bottom:1px solid rgba(255,255,255,0.08);cursor:move;user-select:none;background:rgba(255,255,255,0.03);">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#818cf8,#34d399);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 12px rgba(129,140,248,0.3);">⚡</div>
                            <div>
                                <div style="font-size:15px;font-weight:700;letter-spacing:0.5px;">AI 灵控舱</div>
                                <div id="ai-status-subtitle" style="font-size:11px;opacity:0.7;">v${SCRIPT_VERSION}</div>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <button id="ai-minimize-btn" style="width:28px;height:28px;border:none;border-radius:8px;background:rgba(255,255,255,0.08);color:#93c5fd;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;" title="最小化面板">−</button>
                            <div id="ai-status-badge" style="padding:6px 14px;border-radius:999px;border:1px solid rgba(147,197,253,0.6);font-size:11px;color:#bfdbfe;white-space:nowrap;">待命</div>
                        </div>
                    </div>
                </div>

                <!-- Tab Navigation -->
                <nav style="display:flex;padding:0 18px;gap:4px;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.15);">
                    <button class="tab-btn" data-tab="dashboard" style="flex:1;padding:12px 0;border:none;background:transparent;color:#93c5fd;font-size:12px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;">监控</button>
                    <button class="tab-btn" data-tab="settings" style="flex:1;padding:12px 0;border:none;background:transparent;color:#64748b;font-size:12px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;">配置</button>
                    <button class="tab-btn" data-tab="logs" style="flex:1;padding:12px 0;border:none;background:transparent;color:#64748b;font-size:12px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;">日志</button>
                </nav>

                <!-- Tab Content Container -->
                <div style="padding:18px;max-height:520px;overflow-y:auto;">
                    ${this.buildDashboardTab()}
                    ${this.buildSettingsTab()}
                    ${this.buildLogsTab()}
                </div>
            `;
        }

        buildDashboardTab() {
            return `
                <div class="tab-pane" id="tab-dashboard" style="display:none;">
                    <!-- Control Switch -->
                    <section style="margin-bottom:18px;padding:16px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
                        <label style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
                            <span style="font-size:13px;font-weight:600;">AI 自动托管</span>
                            <div style="position:relative;width:56px;height:30px;background:rgba(100,116,139,0.5);border-radius:999px;transition:0.3s;">
                                <input type="checkbox" id="ai-toggle" style="display:none;">
                                <div class="toggle-slider" style="position:absolute;width:26px;height:26px;background:#fff;border-radius:50%;top:2px;left:2px;transition:0.3s;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
                            </div>
                        </label>
                        <button id="ai-resume" style="display:none;margin-top:12px;width:100%;padding:10px;border:none;border-radius:999px;background:linear-gradient(120deg,#f97316,#fb7185);color:#fff;font-size:12px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(251,113,133,0.3);">🎮 AI继续游玩</button>
                    </section>

                    <!-- Stone Progress Card -->
                    <section style="margin-bottom:18px;padding:16px;border-radius:14px;background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.08);">
                        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
                            <span style="font-size:11px;opacity:0.7;">灵石进度</span>
                            <div style="display:flex;align-items:baseline;gap:6px;font-family:monospace;">
                                <span id="ai-stone-count" style="font-size:20px;font-weight:700;color:#60a5fa;">0</span>
                                <span style="font-size:14px;opacity:0.6;">/</span>
                                <span id="ai-target-stones" style="font-size:14px;opacity:0.7;">30</span>
                            </div>
                        </div>
                        <div style="height:8px;background:rgba(0,0,0,0.3);border-radius:999px;overflow:hidden;">
                            <div id="ai-progress-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#34d399,#3b82f6);transition:width 0.5s cubic-bezier(0.4,0,0.2,1);border-radius:999px;"></div>
                        </div>
                    </section>

                    <!-- Latest Decision -->
                    <section style="padding:14px;border-radius:14px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);">
                        <div style="font-size:11px;opacity:0.7;margin-bottom:8px;">最新决策</div>
                        <div id="ai-last-decision" style="font-size:12px;line-height:1.5;min-height:22px;">等待中...</div>
                    </section>
                </div>
            `;
        }

        buildSettingsTab() {
            return `
                <div class="tab-pane" id="tab-settings" style="display:none;">
                    <!-- Thresholds -->
                    <section style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                        <label style="font-size:11px;">
                            安全阈值
                            <input id="ai-safety" type="number" min="10" max="999999" value="30" style="width:100%;margin-top:4px;padding:8px;background:rgba(12,18,30,0.8);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#e5f2ff;font-size:13px;">
                        </label>
                        <label style="font-size:11px;">
                            巡检间隔(秒)
                            <input id="ai-watchdog" type="number" step="0.5" min="${(MIN_WATCHDOG_INTERVAL / 1000).toFixed(1)}" value="4.0" style="width:100%;margin-top:4px;padding:8px;background:rgba(12,18,30,0.8);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#e5f2ff;font-size:13px;">
                        </label>
                    </section>

                    <!-- AI Provider Config -->
                    <section style="padding:14px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);margin-bottom:16px;">
                        <div style="font-size:11px;opacity:0.85;margin-bottom:10px;font-weight:600;">模型配置</div>
                        <label style="font-size:11px;display:block;margin-bottom:10px;">
                            提供商
                            <select id="ai-provider" style="margin-top:4px;width:100%;padding:8px;border-radius:8px;background:rgba(12,18,30,0.8);color:#e5f2ff;border:1px solid rgba(255,255,255,0.12);font-size:12px;">
                                <option value="openai">OpenAI</option>
                                <option value="anthropic">Anthropic</option>
                                <option value="gemini">Google Gemini</option>
                            </select>
                        </label>
                        <label style="font-size:11px;display:block;margin-bottom:10px;">
                            模型名称
                            <input id="ai-model" type="text" value="gpt-4o-mini" style="margin-top:4px;width:100%;padding:8px;border-radius:8px;background:rgba(12,18,30,0.8);color:#e5f2ff;border:1px solid rgba(255,255,255,0.12);font-size:12px;">
                        </label>
                        <label style="font-size:11px;display:block;">
                            API Key
                            <input id="ai-api-key" type="password" value="YOUR_API_KEY_HERE" style="margin-top:4px;width:100%;padding:8px;border-radius:8px;background:rgba(12,18,30,0.8);color:#e5f2ff;border:1px solid rgba(255,255,255,0.12);font-size:12px;">
                        </label>
                    </section>

                    <!-- Custom URL -->
                    <section style="margin-bottom:16px;">
                        <label style="display:flex;gap:8px;align-items:center;font-size:11px;margin-bottom:8px;">
                            <input type="checkbox" id="ai-use-custom-url" style="accent-color:#fbbf24;">
                            <span>使用自定义API地址</span>
                        </label>
                        <input id="ai-custom-api" type="text" placeholder="https://your-proxy.com/v1/chat/completions" style="display:none;width:100%;padding:8px;border-radius:8px;background:rgba(12,18,30,0.8);color:#e5f2ff;border:1px solid rgba(255,255,255,0.12);font-size:11px;">
                    </section>

                    <!-- Options -->
                    <section style="display:flex;gap:12px;font-size:11px;margin-bottom:16px;">
                        <label style="display:flex;gap:6px;align-items:center;">
                            <input type="checkbox" id="ai-debug-mode" style="accent-color:#fbbf24;">
                            <span>调试日志</span>
                        </label>
                        <label style="display:flex;gap:6px;align-items:center;">
                            <input type="checkbox" id="ai-confirm-exit" checked style="accent-color:#fbbf24;">
                            <span>结束需确认</span>
                        </label>
                    </section>

                    <!-- Actions -->
                    <section style="display:grid;grid-template-columns:1fr auto;gap:10px;">
                        <button id="ai-save" style="padding:10px;border:none;border-radius:10px;background:linear-gradient(120deg,#10b981,#3b82f6);color:#fff;font-weight:600;cursor:pointer;font-size:12px;box-shadow:0 4px 12px rgba(16,185,129,0.3);">💾 保存配置</button>
                        <button id="ai-test" style="padding:10px 16px;border:none;border-radius:10px;background:linear-gradient(120deg,#f97316,#ef4444);color:#fff;font-weight:600;cursor:pointer;font-size:12px;white-space:nowrap;box-shadow:0 4px 12px rgba(239,68,68,0.3);">🧪 测试</button>
                    </section>
                    <div id="ai-test-result" style="display:none;font-size:11px;padding:12px;border-radius:10px;background:rgba(255,255,255,0.05);margin-top:12px;"></div>

                    <!-- API Status -->
                    <div id="ai-api-status" style="font-size:10px;opacity:0.65;padding-top:12px;margin-top:12px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">准备就绪</div>
                </div>
            `;
        }

        buildLogsTab() {
            return `
                <div class="tab-pane" id="tab-logs" style="display:none;">
                    <div style="font-size:11px;opacity:0.7;margin-bottom:10px;">决策历史 (最近${HISTORY_LIMIT}条)</div>
                    <div id="ai-history" style="display:flex;flex-direction:column;gap:8px;font-size:11px;"></div>
                </div>
            `;
        }

        cacheDOMElements() {
            this.statusBadge = this.panel.querySelector('#ai-status-badge');
            this.statusSubtitle = this.panel.querySelector('#ai-status-subtitle');
            this.decisionLabel = this.panel.querySelector('#ai-last-decision');
            this.historyList = this.panel.querySelector('#ai-history');
            this.stoneLabel = this.panel.querySelector('#ai-stone-count');
            this.progressBar = this.panel.querySelector('#ai-progress-bar');
            this.resumeButton = this.panel.querySelector('#ai-resume');
            this.apiStatus = this.panel.querySelector('#ai-api-status');
            this.testButton = this.panel.querySelector('#ai-test');
            this.testResult = this.panel.querySelector('#ai-test-result');

            this.tabs = {
                dashboard: this.panel.querySelector('#tab-dashboard'),
                settings: this.panel.querySelector('#tab-settings'),
                logs: this.panel.querySelector('#tab-logs')
            };

            this.tabButtons = {};
            this.panel.querySelectorAll('.tab-btn').forEach(btn => {
                this.tabButtons[btn.dataset.tab] = btn;
            });

            this.configInputs = {
                aiToggle: this.panel.querySelector('#ai-toggle'),
                safety: this.panel.querySelector('#ai-safety'),
                watchdog: this.panel.querySelector('#ai-watchdog'),
                provider: this.panel.querySelector('#ai-provider'),
                model: this.panel.querySelector('#ai-model'),
                apiKey: this.panel.querySelector('#ai-api-key'),
                useCustomUrl: this.panel.querySelector('#ai-use-custom-url'),
                customApi: this.panel.querySelector('#ai-custom-api'),
                debug: this.panel.querySelector('#ai-debug-mode'),
                confirmExit: this.panel.querySelector('#ai-confirm-exit'),
                saveBtn: this.panel.querySelector('#ai-save')
            };
        }

        bindEvents() {
            if (!this.panel) return;

            // Tab切换
            Object.entries(this.tabButtons).forEach(([tabName, btn]) => {
                btn.addEventListener('click', () => this.switchTab(tabName));
            });

            // Toggle开关
            const { aiToggle } = this.configInputs;
            const toggleContainer = aiToggle.parentElement;
            toggleContainer.addEventListener('click', () => {
                aiToggle.checked = !aiToggle.checked;
                this.updateToggleUI(aiToggle.checked);
                this.config.set('autoPlay', aiToggle.checked);
            });

            // 配置输入
            const { safety, watchdog, provider, model, apiKey, useCustomUrl, customApi, debug, confirmExit, saveBtn } = this.configInputs;

            safety.addEventListener('change', (e) => this.config.set('safetyThreshold', clampNumber(parseInt(e.target.value, 10), 1, 999999)));
            watchdog.addEventListener('change', (e) => {
                const seconds = clampNumber(parseFloat(e.target.value), MIN_WATCHDOG_INTERVAL / 1000, 60);
                this.config.set('watchdogInterval', Math.round(seconds * 1000));
                e.target.value = seconds.toFixed(1);
            });
            provider.addEventListener('change', (e) => {
                const value = e.target.value;
                const normalized = model.value.toLowerCase();
                this.config.set('aiProvider', value);
                if (value === 'openai' && normalized.startsWith('claude')) {
                    model.value = 'gpt-4o-mini';
                    this.config.set('model', 'gpt-4o-mini');
                }
                if (value === 'anthropic' && normalized.startsWith('gpt')) {
                    model.value = 'claude-3-5-sonnet-20241022';
                    this.config.set('model', 'claude-3-5-sonnet-20241022');
                }
                if (value === 'gemini' && !normalized.includes('gemini')) {
                    model.value = GEMINI_DEFAULT_MODEL;
                    this.config.set('model', GEMINI_DEFAULT_MODEL);
                }
            });
            model.addEventListener('change', (e) => this.config.set('model', e.target.value.trim()));
            apiKey.addEventListener('change', (e) => this.config.set('apiKey', e.target.value.trim()));
            useCustomUrl.addEventListener('change', (e) => {
                customApi.style.display = e.target.checked ? 'block' : 'none';
                this.config.set('useCustomUrl', e.target.checked);
            });
            customApi.addEventListener('input', (e) => this.config.set('customApiUrl', e.target.value.trim()));
            debug.addEventListener('change', (e) => this.config.set('debugMode', e.target.checked));
            confirmExit.addEventListener('change', (e) => this.config.set('userConfirmExit', e.target.checked));
            saveBtn.addEventListener('click', () => {
                this.config.saveAll();
                this.toast('success', '配置已保存');
            });

            // 其他按钮
            if (this.resumeButton) {
                this.resumeButton.addEventListener('click', () => this.handlers.onResumeAI && this.handlers.onResumeAI());
            }
            if (this.testButton) {
                this.testButton.addEventListener('click', () => this.handlers.onTestAI && this.handlers.onTestAI());
            }

            // 最小化按钮
            const minimizeBtn = this.panel.querySelector('#ai-minimize-btn');
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 防止触发拖拽
                    this.toggleMinimize();
                });
            }
        }

        switchTab(tabName) {
            Object.values(this.tabs).forEach(tab => tab.style.display = 'none');
            Object.values(this.tabButtons).forEach(btn => {
                btn.style.color = '#64748b';
                btn.style.borderBottomColor = 'transparent';
            });

            if (this.tabs[tabName]) {
                this.tabs[tabName].style.display = 'block';
            }
            if (this.tabButtons[tabName]) {
                this.tabButtons[tabName].style.color = '#93c5fd';
                this.tabButtons[tabName].style.borderBottomColor = '#60a5fa';
            }

            this.config.set('activeTab', tabName, { persist: false });
        }

        updateToggleUI(checked) {
            const slider = this.panel.querySelector('.toggle-slider');
            const container = slider.parentElement;
            if (checked) {
                container.style.background = 'rgba(52,211,153,0.8)';
                slider.style.transform = 'translateX(26px)';
            } else {
                container.style.background = 'rgba(100,116,139,0.5)';
                slider.style.transform = 'translateX(0)';
            }
        }

        handleConfigChange(key, value, snapshot) {
            if (!this.panel) return;
            switch (key) {
                case 'autoPlay':
                    if (this.configInputs.aiToggle) {
                        this.configInputs.aiToggle.checked = Boolean(value);
                        this.updateToggleUI(Boolean(value));
                    }
                    this.setStatus(value ? 'thinking' : 'idle', value ? '托管中' : '已暂停');
                    break;
                case 'safetyThreshold':
                    if (this.configInputs.safety) this.configInputs.safety.value = value;
                    if (this.panel.querySelector('#ai-target-stones')) {
                        this.panel.querySelector('#ai-target-stones').textContent = value;
                    }
                    this.updateProgressBar();
                    break;
                case 'watchdogInterval':
                    if (this.configInputs.watchdog) this.configInputs.watchdog.value = (value / 1000).toFixed(1);
                    break;
                case 'aiProvider':
                    if (this.configInputs.provider) this.configInputs.provider.value = value;
                    break;
                case 'model':
                    if (this.configInputs.model) this.configInputs.model.value = value;
                    break;
                case 'apiKey':
                    if (this.configInputs.apiKey) this.configInputs.apiKey.value = value;
                    this.setApiStatus();
                    break;
                case 'useCustomUrl':
                    if (this.configInputs.useCustomUrl) {
                        this.configInputs.useCustomUrl.checked = Boolean(value);
                    }
                    if (this.configInputs.customApi) {
                        this.configInputs.customApi.style.display = value ? 'block' : 'none';
                    }
                    this.setApiStatus();
                    break;
                case 'customApiUrl':
                    if (this.configInputs.customApi) this.configInputs.customApi.value = value;
                    this.setApiStatus();
                    break;
                case 'debugMode':
                    if (this.configInputs.debug) this.configInputs.debug.checked = Boolean(value);
                    break;
                case 'userConfirmExit':
                    if (this.configInputs.confirmExit) this.configInputs.confirmExit.checked = Boolean(value);
                    break;
                case 'uiCompact':
                    this.compact = Boolean(value);
                    this.syncCompactState();
                    break;
                default:
                    break;
            }
        }

        applyConfigSnapshot(snapshot) {
            Object.entries(snapshot).forEach(([key, value]) => this.handleConfigChange(key, value, snapshot));
        }

        renderFloatingOrb() {
            if (this.floatingOrb) return;
            const orb = document.createElement('div');
            orb.id = 'ai-floating-orb';
            orb.style.cssText = `
                position: fixed;
                right: 32px;
                bottom: 32px;
                width: 72px;
                height: 72px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(129,140,248,0.85));
                border: 2px solid rgba(147,197,253,0.7);
                box-shadow: 0 0 40px rgba(59,130,246,0.6);
                color: #0f172a;
                font-weight: 700;
                display: none;
                align-items: center;
                justify-content: center;
                text-align: center;
                cursor: pointer;
                user-select: none;
                z-index: 10000;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            orb.innerHTML = '<div style="font-size:13px;line-height:1.3;">AI<br>灵球</div>';
            orb.addEventListener('dblclick', () => this.toggleCompact(false));
            orb.addEventListener('mouseenter', () => {
                orb.style.transform = 'scale(1.1)';
            });
            orb.addEventListener('mouseleave', () => {
                orb.style.transform = 'scale(1)';
            });
            document.body.appendChild(orb);
            this.floatingOrb = orb;
        }

        renderToastHost() {
            if (this.toastHost) return;
            const host = document.createElement('div');
            host.style.cssText = 'position:fixed;right:32px;bottom:120px;display:flex;flex-direction:column;gap:10px;z-index:10001;';
            document.body.appendChild(host);
            this.toastHost = host;
        }

        syncCompactState() {
            if (!this.panel || !this.floatingOrb) return;
            if (this.compact) {
                this.panel.style.display = 'none';
                this.floatingOrb.style.display = 'flex';
            } else {
                this.panel.style.display = 'block';
                this.floatingOrb.style.display = 'none';
            }
        }

        toggleCompact(nextState) {
            const state = typeof nextState === 'boolean' ? nextState : !this.compact;
            this.compact = state;
            this.config.set('uiCompact', state);
        }

        toggleMinimize() {
            if (!this.panel) return;

            const isMinimized = this.panel.dataset.minimized === 'true';
            const tabNav = this.panel.querySelector('nav');
            const tabContent = this.panel.querySelector('nav + div');
            const minimizeBtn = this.panel.querySelector('#ai-minimize-btn');

            if (isMinimized) {
                // 展开面板
                this.panel.dataset.minimized = 'false';
                this.panel.style.width = '380px';
                if (tabNav) tabNav.style.display = 'flex';
                if (tabContent) tabContent.style.display = 'block';
                if (minimizeBtn) minimizeBtn.textContent = '−';
                if (minimizeBtn) minimizeBtn.title = '最小化面板';
            } else {
                // 最小化面板
                this.panel.dataset.minimized = 'true';
                this.panel.style.width = '280px';
                if (tabNav) tabNav.style.display = 'none';
                if (tabContent) tabContent.style.display = 'none';
                if (minimizeBtn) minimizeBtn.textContent = '+';
                if (minimizeBtn) minimizeBtn.title = '展开面板';
            }
        }

        setStatus(mode = 'idle', subtitle) {
            this.currentStatus = mode;
            const theme = STATUS_THEME[mode] || STATUS_THEME.idle;

            // 更新面板边框
            if (this.panel) {
                this.panel.style.borderColor = theme.border;
                this.panel.style.boxShadow = `0 30px 60px rgba(0, 0, 0, 0.4), ${theme.glow}`;
            }

            // 更新状态徽章
            if (this.statusBadge) {
                this.statusBadge.textContent = `${theme.icon} ${theme.label}`;
                this.statusBadge.style.borderColor = theme.border;
                this.statusBadge.style.color = theme.color;
                this.statusBadge.style.boxShadow = theme.glow;
            }

            // 更新副标题
            if (subtitle && this.statusSubtitle) {
                this.statusSubtitle.textContent = subtitle;
            }

            // 更新浮动灵球
            if (this.floatingOrb) {
                this.floatingOrb.style.borderColor = theme.border;
                this.floatingOrb.style.boxShadow = `0 0 40px ${theme.border}`;
            }
        }

        setDecision(message, { status = 'idle', emphasis = false } = {}) {
            if (this.decisionLabel) {
                this.decisionLabel.textContent = message;
                this.decisionLabel.style.color = emphasis ? '#fecaca' : '#e5f2ff';
            }
            this.setStatus(status);
            this.updateDecisionBanner(message, status, emphasis);
        }

        updateDecisionBanner(message, status = 'idle', emphasis = false) {
            if (!this.banner || !document.body.contains(this.banner)) {
                const banner = document.createElement('div');
                banner.id = 'ai-decision-banner';
                banner.style.cssText = `
                    margin-bottom: 10px;
                    padding: 14px 16px;
                    border-radius: 14px;
                    background: rgba(15,23,42,0.85);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: #e0f2fe;
                    font-size: 12px;
                    font-family: -apple-system, system-ui, sans-serif;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s ease;
                `;
                banner.innerHTML = `
                    <div id="ai-banner-icon" style="font-size:18px;flex-shrink:0;">🧠</div>
                    <div style="flex:1;">
                        <div style="font-size:10px;opacity:0.6;margin-bottom:3px;">AI 决策</div>
                        <div id="ai-banner-text" style="font-size:12px;line-height:1.4;">等待决策中...</div>
                    </div>
                    <div id="ai-banner-risk" style="padding:4px 10px;border-radius:999px;font-size:10px;white-space:nowrap;display:none;"></div>
                `;
                const actionArea = document.getElementById('action-area') || document.body;
                actionArea.insertAdjacentElement('afterbegin', banner);
                this.banner = banner;
            }

            const theme = STATUS_THEME[status] || STATUS_THEME.idle;
            this.banner.style.borderColor = theme.border;
            this.banner.style.boxShadow = `${theme.glow}, 0 10px 30px rgba(0,0,0,0.4)`;

            const iconEl = this.banner.querySelector('#ai-banner-icon');
            if (iconEl) iconEl.textContent = theme.icon;

            const textEl = this.banner.querySelector('#ai-banner-text');
            if (textEl) {
                textEl.textContent = message;
                textEl.style.color = emphasis ? '#fecaca' : '#e0f2fe';
            }
        }

        setStoneCount(value) {
            if (this.stoneLabel) {
                this.stoneLabel.textContent = Number(value || 0).toLocaleString();
            }
            this.updateProgressBar(value);
        }

        updateProgressBar(currentStones) {
            const stones = currentStones !== undefined ? currentStones : (this.stoneLabel ? parseInt(this.stoneLabel.textContent.replace(/,/g, ''), 10) : 0);
            const threshold = this.config.get('safetyThreshold') || 30;
            const progress = Math.min(100, (stones / threshold) * 100);

            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;

                // 根据进度改变颜色
                if (progress >= 90) {
                    this.progressBar.style.background = 'linear-gradient(90deg,#34d399,#10b981)';
                } else if (progress >= 50) {
                    this.progressBar.style.background = 'linear-gradient(90deg,#60a5fa,#3b82f6)';
                } else {
                    this.progressBar.style.background = 'linear-gradient(90deg,#818cf8,#6366f1)';
                }
            }
        }

        renderHistory(records = []) {
            if (!this.historyList) return;
            this.historyList.innerHTML = '';

            if (records.length === 0) {
                const empty = document.createElement('div');
                empty.textContent = '暂无决策记录';
                empty.style.cssText = 'opacity:0.6;text-align:center;padding:20px 0;';
                this.historyList.appendChild(empty);
                return;
            }

            records.forEach((record, index) => {
                const theme = RISK_THEME[record.risk] || RISK_THEME.unknown;
                const row = document.createElement('div');
                row.style.cssText = `
                    padding:12px;
                    border-radius:10px;
                    background:${theme.bg};
                    border:1px solid rgba(255,255,255,0.06);
                    transition:all 0.2s;
                `;
                row.onmouseenter = () => row.style.background = 'rgba(255,255,255,0.08)';
                row.onmouseleave = () => row.style.background = theme.bg;

                const header = document.createElement('div');
                header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;';

                const leftPart = document.createElement('div');
                leftPart.style.cssText = 'display:flex;align-items:center;gap:8px;';

                const dot = document.createElement('span');
                dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${theme.color};box-shadow:0 0 10px ${theme.color};`;

                const text = document.createElement('span');
                text.textContent = `${index + 1}. ${record.action}`;
                text.style.cssText = 'font-weight:600;';

                leftPart.appendChild(dot);
                leftPart.appendChild(text);

                const rightPart = document.createElement('div');
                rightPart.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:10px;';

                const risk = document.createElement('span');
                risk.textContent = theme.label;
                risk.style.cssText = `color:${theme.color};`;

                rightPart.appendChild(risk);

                if (record.confidence != null) {
                    const conf = document.createElement('span');
                    conf.textContent = `${record.confidence}%`;
                    conf.style.cssText = 'opacity:0.7;';
                    rightPart.appendChild(conf);
                }

                header.appendChild(leftPart);
                header.appendChild(rightPart);

                const reason = document.createElement('div');
                reason.textContent = record.reason || '无说明';
                reason.style.cssText = 'font-size:10px;opacity:0.7;margin-left:16px;';

                row.appendChild(header);
                row.appendChild(reason);
                this.historyList.appendChild(row);
            });
        }

        setManualResumeVisible(visible) {
            if (this.resumeButton) {
                this.resumeButton.style.display = visible ? 'block' : 'none';
            }
        }

        setApiStatus() {
            if (!this.apiStatus) return;
            const hasKey = this.config.get('apiKey') && this.config.get('apiKey') !== 'YOUR_API_KEY_HERE';
            const usingCustom = this.config.get('useCustomUrl') && this.config.get('customApiUrl');
            this.apiStatus.textContent = hasKey ? `✅ API已配置${usingCustom ? ' (自定义)' : ''}` : '⚠️ 请先配置API Key';
        }

        setTestState({ loading, success, message, duration }) {
            if (!this.testButton || !this.testResult) return;

            if (loading) {
                this.testButton.disabled = true;
                this.testButton.textContent = '测试中...';
                this.testResult.style.display = 'block';
                this.testResult.style.background = 'rgba(251,191,36,0.15)';
                this.testResult.style.color = '#fde68a';
                this.testResult.textContent = '⏳ 正在测试AI连接...';
                return;
            }

            this.testButton.disabled = false;
            this.testButton.textContent = '🧪 测试';
            this.testResult.style.display = 'block';

            if (success) {
                this.testResult.style.background = 'rgba(16,185,129,0.15)';
                this.testResult.style.color = '#6ee7b7';
                this.testResult.innerHTML = `✅ 测试成功 · ${duration}ms<br><span style="opacity:0.8;font-size:10px;">响应: ${message}</span>`;
            } else {
                this.testResult.style.background = 'rgba(248,113,113,0.15)';
                this.testResult.style.color = '#fecaca';
                this.testResult.innerHTML = `❌ 测试失败<br><span style="opacity:0.8;font-size:10px;">${message}</span>`;
            }
        }

        toast(type, message) {
            if (!this.toastHost) return;
            const toast = document.createElement('div');
            const palette = {
                success: { bg: 'rgba(16,185,129,0.2)', color: '#bbf7d0', icon: '✅' },
                error: { bg: 'rgba(248,113,113,0.25)', color: '#fecaca', icon: '❌' },
                info: { bg: 'rgba(59,130,246,0.25)', color: '#bfdbfe', icon: 'ℹ️' }
            };
            const theme = palette[type] || palette.info;

            toast.style.cssText = `
                padding: 12px 16px;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.1);
                background: ${theme.bg};
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                color: ${theme.color};
                font-size: 12px;
                min-width: 240px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease;
            `;

            toast.innerHTML = `<span style="font-size:16px;">${theme.icon}</span><span>${message}</span>`;
            this.toastHost.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(20px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }
    }

    // ===== AIService 类 (优化版) =====
    class AIService {
        constructor(configManager, uiManager) {
            this.config = configManager;
            this.ui = uiManager;
        }

        async requestDecision(payload) {
            const prompt = this.buildPrompt(payload);

            // 🔍 调试日志: 显示完整Prompt
            logDebug(this.config, `📝 发送给AI的完整Prompt:\n${'='.repeat(60)}\n${prompt}\n${'='.repeat(60)}`);

            const response = await this.callModel(prompt);
            return this.parseResponse(response);
        }

        async testConnection() {
            const start = performance.now();
            const response = await this.callModel('{"action":"TEST","reason":"ok","risk":"low","confidence":100}');
            const duration = Math.round(performance.now() - start);
            return { response, duration };
        }

        detectRollFailures(lastMessage, history) {
            // 检测最近的判定失败模式
            const recentMessages = [lastMessage, ...(history.slice(-5) || [])];
            const allText = recentMessages.join('\n');

            // 提取所有判定记录
            const rollPattern = /【系统提示：针对 '(.+?)' 的D\d+判定已执行。.+?最终结果: (成功|失败|大成功|大失败)】/g;
            const rolls = [];
            let match;

            while ((match = rollPattern.exec(allText)) !== null) {
                rolls.push({
                    type: match[1],
                    result: match[2]
                });
            }

            // 检查最近的连续失败
            if (rolls.length === 0) {
                return { count: 0, type: '' };
            }

            // 从最新的判定开始往前查找连续失败
            let failureCount = 0;
            let failureType = '';

            for (let i = rolls.length - 1; i >= 0; i--) {
                if (rolls[i].result === '失败' || rolls[i].result === '大失败') {
                    if (failureCount === 0) {
                        failureType = rolls[i].type;
                    }
                    if (rolls[i].type === failureType) {
                        failureCount++;
                    } else {
                        break; // 不同类型的判定，停止计数
                    }
                } else {
                    break; // 遇到成功，停止计数
                }
            }

            return { count: failureCount, type: failureType };
        }

        buildPrompt({ lastMessage, history = [], options = [], stones, safetyThreshold, opportunities, lifeSnapshot, riskSignals }) {
            const remaining = opportunities ?? '?';
            const phase = determinePhase(opportunities);
            const directive = describeOpportunityDirective(opportunities);

            const optionText = options.length
                ? options.map(opt => `${opt.id}.${opt.description}(风险:${opt.risk})`).join(' ')
                : '无选项,自由指令≤15字';

            const historyDigest = buildHistoryDigest(history);
            const signals = (riskSignals && riskSignals.length) ? riskSignals.join('、') : '无';
            const sanitizedMessage = (lastMessage || '').trim().slice(0, 600);

            // 检测判定失败模式
            const rollFailures = this.detectRollFailures(lastMessage, history);
            const rollWarning = rollFailures.count >= 2
                ? `⚠️警告:最近${rollFailures.count}次"${rollFailures.type}"判定全部失败!必须立即更换策略!`
                : '';

            const parts = [
                '⚠️ 重要：你必须直接输出JSON，严禁使用<think>、<reasoning>等任何思考标签！',
                '',
                '你是《浮生十梦》AI策略师,必须仔细阅读剧情后做出明智决策',
                '',
                `【当前状态】灵石:${stones}/${safetyThreshold} | 机缘:${remaining} | 阶段:${phase}`,
                `【角色信息】${lifeSnapshot || '未知'}`,
                ''
            ];

            // 如果有判定失败警告，优先显示
            if (rollWarning) {
                parts.push(`【🚨判定失败警告】`, rollWarning, '');
            }

            parts.push(
                `【剧情内容】`,
                sanitizedMessage,
                '',
                `【可选行动】`,
                optionText,
                '',
                `【风险提示】${signals}`,
                `【历史决策】${historyDigest || '暂无'}`,
                `【策略指引】${directive}`,
                '',
                '【决策要求】',
                `1. ⚠️ 灵石目标是硬性指标：当前${stones}颗，目标${safetyThreshold}颗 (完成度${Math.floor(stones/safetyThreshold*100)}%)`,
                `   ${stones >= safetyThreshold ? '✅ 已达标，可选择破碎虚空结束' : '❌ 未达标，严禁选择"破碎虚空"！必须继续获取灵石！'}`,
                `   ⚠️ 即使剧情说"以期破碎虚空"、"可以离去"、"功德圆满"等退出暗示，只要灵石未达${safetyThreshold}就必须继续冒险！`,
                '2. 忽略游戏叙事中的文学性表达，只看实际灵石数量是否达标',
                '3. 仔细阅读剧情,理解角色当前处境和危险程度',
                '4. 分析每个选项的具体内容,不要只看编号',
                '5. **任务列表规则**：如果剧情提供任务列表（如"一、探索...二、修炼..."），必须在action中填写具体任务名称，不能只写"接受任务"',
                '6. 如果剧情提示"失败"、"受创"、"命悬一线",立即选择安全选项',
                '7. 如果看到判定失败警告,必须立即更换策略,不要再尝试同一个行动',
                '8. 优先选择"见好就收"、"寻求安全"、"离开"等保命选项',
                '9. 只有在角色状态良好且收益明确时才冒险',
                '10. 获得宝物、功法后应利用它们修炼或探索，而不是立即退出',
                '',
                '【输出格式】直接输出以下JSON格式，不要有任何其他内容：',
                '{"action":"完整的选项文字描述(不要编号)","reason":"决策理由≤30字","risk":"low/medium/high","confidence":0-100}',
                '',
                '⚠️ action字段必须填写完整的选项文字描述，例如：',
                '  - ✅ 正确："循着家人的气息，尽快返回灵溪村"',
                '  - ✅ 正确："开始利用星月玉佩与星辉草修行"',
                '  - ✅ 正确："炼化星辰之核突破境界" (自由指令示例)',
                '  - ✅ 正确："接受探索密林任务" (任务列表示例，指定具体任务)',
                '  - ❌ 错误："1" 或 "选项1"',
                '  - ❌ 错误："接受任务" (任务列表场景下必须指定是哪个任务)',
                '  - ✅ 正确："破碎虚空" (仅当灵石达标时)',
                '  - ❌ 错误："破碎虚空：带着所得【1】颗灵石..." (不要冒号后的说明)',
                '',
                '【示例1 - 有选项场景】',
                '剧情：前方岔路，一条通往幽暗山洞，一条通往明亮森林',
                '选项：1.进入幽暗山洞(风险:high) 2.前往明亮森林(风险:low)',
                '{',
                '  "action": "前往明亮森林",  // ← 完整文字描述',
                '  "reason": "优先安全路径",',
                '  "risk": "low",',
                '  "confidence": 85',
                '}',
                '',
                '【示例2 - 自由指令场景（获得宝物后）】',
                '剧情：汝获得星辰之核，感到修为瓶颈破碎，此物可助汝破境。',
                '当前：灵石2501/10000，机缘充裕',
                '{',
                '  "action": "炼化星辰之核突破境界",  // ← 利用宝物提升实力',
                '  "reason": "利用至宝突破可获更多收益",',
                '  "risk": "medium",',
                '  "confidence": 85',
                '}',
                '',
                '【示例3 - 叙事暗示退出但未达标】',
                '剧情：...此番机缘已足，汝可破碎虚空而去。',
                '当前：灵石3000/10000',
                '{',
                '  "action": "继续探索秘境深处",  // ← 忽略退出暗示，继续获取灵石',
                '  "reason": "灵石仅30%需继续积累",',
                '  "risk": "medium",',
                '  "confidence": 90',
                '}',
                '',
                '【示例4 - 任务列表场景】',
                '剧情：面前出现三个任务：一、探索密林(高风险高收益)；二、修炼内功(稳健)；三、炼制丹药(低收益)',
                '{',
                '  "action": "修炼内功",  // ← 指定具体任务名称，不能只写"接受任务"',
                '  "reason": "稳健路线积累实力",',
                '  "risk": "low",',
                '  "confidence": 80',
                '}',
                '',
                '🚫 严禁使用<think>、<reasoning>等标签！',
                '🚫 严禁输出任何解释性文字！',
                '🚫 严禁在action中使用编号！',
                '🚫 严禁复制冒号后的说明文字！',
                '🚫 严禁在未达灵石目标时选择"破碎虚空"！',
                '✅ 只输出纯JSON！',
                '✅ action只要核心动作，不要冒号后的说明！',
                '✅ 任务列表场景必须指定具体任务名称！'
            );

            return parts.join('\n');
        }

        parseResponse(raw) {
            // 🔍 调试日志1: 显示AI原始返回
            logDebug(this.config, `📥 AI原始返回:\n${raw}`);

            const cleaned = cleanJsonContent(raw);
            logDebug(this.config, `🧹 清理后内容:\n${cleaned}`);

            const { cleaned: stripped } = stripThinkBlocks(cleaned);
            logDebug(this.config, `✂️ 移除<think>后:\n${stripped}`);

            // 检查是否为空或只包含think标签
            if (!stripped || stripped.trim().length === 0) {
                const errorMsg = `AI返回空内容或仅包含思考标签,请重试\n原始返回: ${raw.substring(0, 200)}`;
                logDebug(this.config, `❌ 验证失败: ${errorMsg}`);
                throw new Error(errorMsg);
            }

            let parsed;

            try {
                parsed = JSON.parse(stripped);
                logDebug(this.config, `✅ JSON解析成功: ${JSON.stringify(parsed)}`);
            } catch (error) {
                logDebug(this.config, `⚠️ JSON解析失败,尝试fallback解析: ${error.message}`);
                parsed = this.fallbackParse(stripped);
                logDebug(this.config, `🔄 Fallback解析结果: ${JSON.stringify(parsed)}`);
            }

            // 验证action有效性
            const action = (parsed.action || '').trim();
            logDebug(this.config, `🎯 提取的action: "${action}"`);

            if (!action || action === '<think>' || action.includes('<think>')) {
                const errorMsg = `AI返回无效动作,请刷新页面重试\naction值: "${action}"\n完整返回: ${JSON.stringify(parsed)}`;
                logDebug(this.config, `❌ Action验证失败: ${errorMsg}`);
                throw new Error(errorMsg);
            }

            const result = {
                action: action,
                reason: (parsed.reason || '').trim(),
                risk: (parsed.risk || '').toLowerCase(),
                confidence: typeof parsed.confidence === 'number' ? clampNumber(parsed.confidence, 0, 100) : undefined
            };

            logDebug(this.config, `✅ 最终解析结果: ${JSON.stringify(result)}`);
            return result;
        }

        fallbackParse(content) {
            const actionMatch = content.match(/action\s*[:：=]\s*([^\n]+)/i);
            const reasonMatch = content.match(/reason\s*[:：=]\s*([^\n]+)/i);
            const riskMatch = content.match(/risk\s*[:：=]\s*([^\n]+)/i);
            const confMatch = content.match(/confidence\s*[:：=]\s*([^\n]+)/i);

            return {
                action: actionMatch ? actionMatch[1].trim() : content.split(/\n|。/)[0],
                reason: reasonMatch ? reasonMatch[1].trim() : '',
                risk: riskMatch ? riskMatch[1].trim() : 'unknown',
                confidence: confMatch ? parseInt(confMatch[1].trim(), 10) : undefined
            };
        }

        callModel(prompt) {
            return new Promise((resolve, reject) => {
                const provider = this.config.get('aiProvider');
                const apiKey = this.config.get('apiKey');

                if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
                    reject(new Error('未配置API Key'));
                    return;
                }

                const useCustom = Boolean(this.config.get('useCustomUrl') && this.config.get('customApiUrl'));
                const rawModel = (this.config.get('model') || '').trim();
                const resolvedGeminiModel = rawModel || GEMINI_DEFAULT_MODEL;
                const geminiModelPath = resolvedGeminiModel.startsWith('models/')
                    ? resolvedGeminiModel
                    : `models/${resolvedGeminiModel}`;

                const buildGeminiEndpoint = (template) => {
                    if (!template) return '';
                    let endpoint = template.trim();
                    if (endpoint.includes('{model}')) {
                        endpoint = endpoint.split('{model}').join(geminiModelPath);
                    } else if (!endpoint.includes('models/')) {
                        endpoint = endpoint.replace(/\/$/, '');
                        endpoint = `${endpoint}/models/${geminiModelPath}`;
                    }
                    if (!/:(?:generateContent|streamGenerateContent)(?:[/?]|$)/.test(endpoint)) {
                        endpoint = `${endpoint}:generateContent`;
                    }
                    return endpoint;
                };

                const ensureGeminiKey = (endpoint) => {
                    if (!endpoint) return endpoint;
                    const hasKey = /[?&]key=/i.test(endpoint);
                    const separator = endpoint.includes('?') ? '&' : '?';
                    return hasKey ? endpoint : `${endpoint}${separator}key=${encodeURIComponent(apiKey)}`;
                };

                let url = '';

                if (useCustom) {
                    url = provider === 'gemini'
                        ? buildGeminiEndpoint(this.config.get('customApiUrl'))
                        : this.config.get('customApiUrl');
                } else if (provider === 'anthropic') {
                    url = 'https://api.anthropic.com/v1/messages';
                } else if (provider === 'gemini') {
                    url = `${GEMINI_BASE_URL}/${geminiModelPath}:generateContent`;
                } else {
                    url = 'https://api.openai.com/v1/chat/completions';
                }

                const requestUrl = provider === 'gemini' ? ensureGeminiKey(url) : url;
                const safeLogUrl = provider === 'gemini'
                    ? requestUrl.replace(/key=([^&]+)/gi, 'key=***')
                    : requestUrl;

                const headers = provider === 'anthropic' && !useCustom
                    ? {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01'
                    }
                    : provider === 'gemini'
                        ? {
                            'Content-Type': 'application/json',
                            'x-goog-api-key': apiKey
                        }
                        : {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        };

                const body = provider === 'anthropic' && !useCustom
                    ? {
                        model: this.config.get('model'),
                        max_tokens: 300,
                        messages: [{ role: 'user', content: prompt }]
                    }
                    : provider === 'gemini'
                        ? {
                            contents: [{
                                role: 'user',
                                parts: [{ text: prompt }]
                            }],
                            generationConfig: {
                                temperature: 0.3,
                                maxOutputTokens: 300
                            }
                        }
                        : {
                            model: this.config.get('model'),
                            temperature: 0.3,
                            max_tokens: 300,
                            messages: [{ role: 'user', content: prompt }]
                        };

                logDebug(this.config, `📤 请求AI: ${safeLogUrl}`);

                const timeout = setTimeout(() => {
                    reject(new Error('API请求超时(30s)'));
                }, 30000);

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: requestUrl,
                    headers,
                    data: JSON.stringify(body),
                    onload: (response) => {
                        clearTimeout(timeout);
                        logDebug(this.config, `📥 HTTP状态: ${response.status}`);

                        if (response.status !== 200) {
                            const errorMsg = `API返回错误: ${response.status}\n响应体: ${response.responseText.substring(0, 500)}`;
                            logDebug(this.config, `❌ ${errorMsg}`);
                            reject(new Error(errorMsg));
                            return;
                        }

                        try {
                            const data = JSON.parse(response.responseText);
                            logDebug(this.config, `📦 完整响应体:\n${JSON.stringify(data, null, 2)}`);

                            let aiResponse = '';

                            if ((provider === 'anthropic') && !useCustom) {
                                if (!data.content || !data.content[0]?.text) {
                                    throw new Error('Anthropic 响应异常: 缺少content字段');
                                }
                                aiResponse = data.content[0].text.trim();
                            } else if (provider === 'gemini') {
                                if (!Array.isArray(data.candidates) || data.candidates.length === 0) {
                                    throw new Error('Gemini 响应异常: 缺少candidates字段');
                                }
                                const candidate = data.candidates.find(item => item?.content?.parts?.length);
                                if (!candidate) {
                                    throw new Error('Gemini 响应异常: 缺少content.parts');
                                }
                                const textPart = candidate.content.parts.find(part => typeof part.text === 'string' && part.text.trim());
                                if (!textPart) {
                                    throw new Error('Gemini 响应异常: 未找到文本响应');
                                }
                                aiResponse = textPart.text.trim();
                            } else {
                                if (!data.choices || !data.choices[0]?.message?.content) {
                                    throw new Error('OpenAI 响应异常: 缺少choices字段');
                                }
                                aiResponse = data.choices[0].message.content.trim();
                            }

                            logDebug(this.config, `✅ 提取的AI文本:\n${aiResponse}`);
                            resolve(aiResponse);
                        } catch (error) {
                            logDebug(this.config, `❌ 解析响应失败: ${error.message}`);
                            reject(error);
                        }
                    },
                    onerror: (error) => {
                        clearTimeout(timeout);
                        reject(new Error(error?.error || 'API请求失败'));
                    },
                    ontimeout: () => {
                        clearTimeout(timeout);
                        reject(new Error('API请求超时'));
                    }
                });
            });
        }
    }

    // ===== GameEngine 类 (保持不变,只调用新UI) =====
    class GameEngine {
        constructor(configManager, uiManager, aiService) {
            this.config = configManager;
            this.ui = uiManager;
            this.ai = aiService;
            this.manualMode = false;
            this.isProcessing = false;
            this.lastSignature = '';
            this.decisionHistory = [];
            this.observer = null;
            this.observerHeartbeat = null;
            this.watchdog = null;
            this.lastGameState = null;
            this.currentStones = 0;
            this.domAnalyzer = createDebounce((payload) => this.analyzeNarrative(payload), 800);
            this.config.subscribe((key, value) => this.handleConfigChange(key, value));
        }

        bootstrap() {
            this.ui.mount({
                onTestAI: () => this.testAIConnection(),
                onResumeAI: () => this.resumeAutoPlay()
            });

            const start = () => this.waitForGameShell(() => {
                this.bindManualInputSensors();
                this.attachNarrativeObserver();
                this.ensureObserverHeartbeat();
                this.fetchInitialStones();

                if (this.config.get('autoPlay')) {
                    this.startWatchdog();
                    this.ui.setStatus('idle', '托管准备就绪');
                    this.requestImmediateAnalysis();
                }
            });

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', start);
            } else {
                start();
            }
        }

        waitForGameShell(callback) {
            const retry = () => {
                const gameView = document.getElementById('game-view');
                const actionInput = document.getElementById('action-input');
                if (gameView && actionInput) {
                    callback();
                } else {
                    setTimeout(retry, 600);
                }
            };
            retry();
        }

        handleConfigChange(key, value) {
            if (key === 'autoPlay') {
                this.onAutoPlayChange(Boolean(value));
            }
            if (key === 'watchdogInterval' && this.config.get('autoPlay')) {
                this.startWatchdog(true);
            }
        }

        onAutoPlayChange(enabled) {
            if (enabled) {
                this.manualMode = false;
                this.ui.setManualResumeVisible(false);
                this.startWatchdog();
                this.requestImmediateAnalysis(true);
            } else {
                this.stopWatchdog();
            }
        }

        bindManualInputSensors() {
            const actionInput = document.getElementById('action-input');
            const actionButton = document.getElementById('action-button');
            if (!actionInput || !actionButton) return;

            const enterManual = () => {
                if (!this.config.get('autoPlay')) return;
                this.manualMode = true;
                this.config.set('autoPlay', false);
                this.ui.setManualResumeVisible(true);
                this.ui.setDecision('🖐️ 手动操作中,完成后点击"AI继续游玩"', { status: 'danger', emphasis: true });
            };

            actionInput.addEventListener('keydown', (e) => {
                if (e.isTrusted && e.key === 'Enter' && actionInput.value.trim()) {
                    enterManual();
                }
            });

            actionButton.addEventListener('click', (e) => {
                if (e.isTrusted && actionInput.value.trim()) {
                    enterManual();
                }
            });
        }

        attachNarrativeObserver() {
            const target = document.getElementById('narrative-window');
            if (!target) return false;

            if (this.observer) {
                this.observer.disconnect();
            }

            this.observer = new MutationObserver(() => {
                if (this.config.get('autoPlay') && !this.isProcessing && !this.manualMode) {
                    this.triggerAnalysis();
                }
            });

            this.observer.observe(target, { childList: true, subtree: true });
            return true;
        }

        ensureObserverHeartbeat() {
            if (this.observerHeartbeat) return;
            this.observerHeartbeat = setInterval(() => {
                const target = document.getElementById('narrative-window');
                if (target && (!this.observer || !target.isConnected)) {
                    this.attachNarrativeObserver();
                }
            }, 5000);
        }

        startWatchdog(restart = false) {
            if (this.watchdog && !restart) return;
            if (this.watchdog) clearInterval(this.watchdog);

            const interval = Math.max(MIN_WATCHDOG_INTERVAL, this.config.get('watchdogInterval') || 4000);
            this.watchdog = setInterval(() => {
                if (!this.config.get('autoPlay') || this.manualMode || this.isProcessing) return;
                this.triggerAnalysis();
            }, interval);
        }

        stopWatchdog() {
            if (this.watchdog) {
                clearInterval(this.watchdog);
                this.watchdog = null;
            }
        }

        triggerAnalysis(force = false) {
            const messages = this.extractNarrativeMessages();
            if (!messages.length) return;

            const loadingSpinner = document.getElementById('loading-spinner');
            if (loadingSpinner && loadingSpinner.style.display !== 'none') {
                return;
            }

            const signature = this.computeStateSignature(messages);
            if (!force && signature === this.lastSignature) return;

            this.lastSignature = signature;
            this.domAnalyzer({ messages, force });
        }

        requestImmediateAnalysis() {
            this.triggerAnalysis(true);
        }

        extractNarrativeMessages(limit = MAX_NARRATIVE_LOGS) {
            const narrativeWindow = document.getElementById('narrative-window');
            if (!narrativeWindow) return [];

            const nodes = Array.from(narrativeWindow.children);
            return nodes.slice(-limit).map(node => (node.innerText || node.textContent || '').trim()).filter(Boolean);
        }

        computeStateSignature(messages) {
            const tail = messages.slice(-3).join('||');
            return hashString(`${tail}#${messages.length}`);
        }

        async analyzeNarrative({ messages, force }) {
            if (!Array.isArray(messages) || !messages.length) return;
            if (!this.config.get('autoPlay') || this.manualMode) return;
            if (this.isProcessing && !force) return;

            this.isProcessing = true;
            const lastMessage = messages[messages.length - 1];
            this.ui.setDecision('AI正在思考...', { status: 'thinking' });

            try {
                await this.refreshGameSnapshot();
                const opportunities = getAccurateOpportunities(this.lastGameState);
                const options = extractOptionsFromText(lastMessage);
                const riskSignals = detectRiskSignals(lastMessage);
                const trialEnded = this.hasTrialActuallyEnded();

                if (trialEnded && isGameEndText(lastMessage)) {
                    if (lastMessage.includes('开始')) {
                        this.executeDecision({
                            action: '开始试炼',
                            reason: '检测到新的试炼入口',
                            risk: 'low',
                            confidence: 85
                        });
                    } else {
                        this.ui.setDecision('游戏完成,等待重新开始...', { status: 'safe' });
                    }
                    this.isProcessing = false;
                    return;
                }

                if (this.currentStones >= this.config.get('safetyThreshold')) {
                    if (this.config.get('userConfirmExit')) {
                        this.config.set('autoPlay', false);
                        this.ui.setManualResumeVisible(true);
                        this.ui.setDecision(`⚠️ 灵石${this.currentStones}已达安全线,请确认是否收官`, { status: 'danger', emphasis: true });
                        this.manualMode = true;
                        this.isProcessing = false;
                        return;
                    } else {
                        this.executeDecision({
                            action: '破碎虚空',
                            reason: `灵石达到${this.currentStones}/${this.config.get('safetyThreshold')}`,
                            risk: 'low',
                            confidence: 95
                        });
                        this.isProcessing = false;
                        return;
                    }
                }

                // 启发式规则已禁用，全部交给AI决策
                // const heuristicDecision = this.applyHeuristics({
                //     lastMessage,
                //     options,
                //     opportunities,
                //     riskSignals,
                //     stones: this.currentStones,
                //     safetyThreshold: this.config.get('safetyThreshold'),
                //     gameState: this.lastGameState,
                //     confirmExit: this.config.get('userConfirmExit')
                // });

                // if (heuristicDecision) {
                //     this.executeDecision(heuristicDecision);
                //     this.isProcessing = false;
                //     return;
                // }

                const decision = await this.ai.requestDecision({
                    lastMessage,
                    history: messages,
                    options,
                    stones: this.currentStones,
                    safetyThreshold: this.config.get('safetyThreshold'),
                    opportunities,
                    lifeSnapshot: buildLifeSnapshot(this.lastGameState),
                    riskSignals
                });

                const normalizedAction = normalizeActionText(decision.action);
                if (!normalizedAction) {
                    throw new Error('AI未返回可执行动作');
                }

                if (shouldConfirmExit(normalizedAction) && this.config.get('userConfirmExit')) {
                    this.config.set('autoPlay', false);
                    this.manualMode = true;
                    this.ui.setManualResumeVisible(true);
                    this.ui.setDecision(`⚠️ AI建议 ${normalizedAction},请确认`, { status: 'danger', emphasis: true });
                    this.isProcessing = false;
                    return;
                }

                this.executeDecision({
                    action: normalizedAction,
                    reason: decision.reason,
                    risk: decision.risk,
                    confidence: decision.confidence
                });
            } catch (error) {
                console.error('[AI脚本] 分析异常', error);

                // 🔍 增强错误日志
                logDebug(this.config, `❌ 完整错误信息:\n${error.stack || error.message}`);

                // 显示详细错误消息（截取前200字符避免过长）
                const errorPreview = error.message.length > 200
                    ? error.message.substring(0, 200) + '...'
                    : error.message;

                this.ui.setDecision(`错误: ${errorPreview}`, { status: 'danger', emphasis: true });
                this.ui.toast('error', errorPreview);
            } finally {
                this.isProcessing = false;
            }
        }

        async refreshGameSnapshot() {
            try {
                const response = await fetch(API_INIT_ENDPOINT, { method: 'POST', credentials: 'include' });
                if (!response.ok) return;

                const data = await response.json();
                this.lastGameState = data;

                if (data?.current_life?.灵石 !== undefined) {
                    this.currentStones = data.current_life.灵石;
                    this.ui.setStoneCount(this.currentStones);
                }
            } catch (error) {
                logDebug(this.config, `⚠️ 获取灵石失败: ${error.message}`);
            }
        }

        hasTrialActuallyEnded() {
            // 优先使用游戏状态判断
            if (this.lastGameState) {
                const { is_in_trial, daily_success_achieved, opportunities_remaining } = this.lastGameState;

                // 明确的结束条件
                if (daily_success_achieved) {
                    return true; // 今日已成功
                }

                if (is_in_trial === false && opportunities_remaining === 0) {
                    return true; // 不在试炼中且机缘耗尽
                }

                // 如果还在试炼中(is_in_trial === true)，一定没结束
                if (is_in_trial === true) {
                    return false;
                }

                // 如果还有机缘(opportunities_remaining > 0)，可能结束了当前轮回
                if (opportunities_remaining > 0 && is_in_trial === false) {
                    return true; // 当前轮回结束，但还有机缘
                }
            }

            // 备用判断：检查开始按钮
            const startButton = document.getElementById('start-trial-button');
            if (startButton && !startButton.disabled) {
                const text = (startButton.textContent || '').trim();
                if (/开始试炼|开启下一次试炼/.test(text)) {
                    return true;
                }
            }

            return false;
        }

        applyHeuristics(context) {
            const { lastMessage, options, riskSignals, gameState } = context;

            // 更严格的重启判断：必须明确提示可以开始新试炼
            const canRestart = (
                /开启.*?试炼|再度踏入|重新.*?试炼|功德圆满.*?开始/.test(lastMessage) &&
                !/未曾终结|尚未有结果|当前之试炼/.test(lastMessage) // 排除游戏拒绝的提示
            );

            const heuristicsContext = {
                ...context,
                richStoneOption: this.findOptionContaining(options, ['灵石', '宝藏']),
                healOption: this.findOptionContaining(options, HEALING_KEYWORDS),
                safeOption: this.findOptionContaining(options, DEFENSE_KEYWORDS),
                injured: /重伤|重创|濒死|血染|裂骨|伤势/.test(lastMessage),
                highRiskText: riskSignals.some(signal => signal.includes('high')),
                trialEnded: this.hasTrialActuallyEnded(),
                canRestart: canRestart
            };

            for (const rule of HEURISTIC_RULES) {
                const result = rule(heuristicsContext);
                if (result) {
                    logDebug(this.config, `✨ 启用启发式: ${result.reason}`);
                    return result;
                }
            }

            return null;
        }

        findOptionContaining(options, keywords) {
            if (!Array.isArray(options)) return null;
            const option = options.find(opt => keywords.some(keyword => opt.description.includes(keyword)));
            // 返回完整的文字描述，并清理冒号后的说明
            if (!option) return null;

            // 移除冒号及其后面的说明文字
            const description = option.description;
            const colonIndex = description.indexOf('：');
            if (colonIndex > 0) {
                return description.substring(0, colonIndex).trim();
            }

            const colonIndexEn = description.indexOf(':');
            if (colonIndexEn > 0) {
                return description.substring(0, colonIndexEn).trim();
            }

            return description;
        }

        executeDecision(decision) {
            const normalizedRisk = ['low', 'medium', 'high'].includes(decision.risk) ? decision.risk : 'unknown';
            const display = `动作:${decision.action} | 理由:${decision.reason || 'AI策略'} | 风险:${normalizedRisk}`;
            this.ui.setDecision(display, { status: normalizedRisk === 'high' ? 'danger' : 'safe' });
            this.sendAction(decision.action);
            this.pushHistory({
                action: decision.action,
                reason: decision.reason,
                risk: normalizedRisk,
                confidence: decision.confidence
            });
        }

        sendAction(action) {
            try {
                logDebug(this.config, `📤 发送指令: ${action}`);

                if (window.socketManager?.sendAction) {
                    window.socketManager.sendAction(action);
                    return;
                }

                const actionInput = document.getElementById('action-input');
                const actionButton = document.getElementById('action-button');

                if (!actionInput || !actionButton) {
                    throw new Error('找不到游戏输入框');
                }

                actionInput.value = action;
                actionButton.click();
            } catch (error) {
                console.error('[AI脚本] 指令发送失败', error);
                this.ui.toast('error', error.message);
            }
        }

        pushHistory(entry) {
            const normalized = {
                action: entry.action || '未知',
                reason: entry.reason || '无',
                risk: entry.risk || 'unknown',
                confidence: entry.confidence != null ? Math.round(entry.confidence) : undefined,
                timestamp: new Date().toLocaleTimeString()
            };

            this.decisionHistory.unshift(normalized);
            if (this.decisionHistory.length > HISTORY_LIMIT) {
                this.decisionHistory.pop();
            }

            this.ui.renderHistory(this.decisionHistory);
        }

        resumeAutoPlay() {
            this.manualMode = false;
            this.ui.setManualResumeVisible(false);
            this.config.set('autoPlay', true);
            this.requestImmediateAnalysis(true);
        }

        async testAIConnection() {
            try {
                this.ui.setTestState({ loading: true });
                const { response, duration } = await this.ai.testConnection();
                this.ui.setTestState({ loading: false, success: true, message: response.slice(0, 80), duration });
                this.ui.toast('success', `测试成功 (${duration}ms)`);
            } catch (error) {
                this.ui.setTestState({ loading: false, success: false, message: error.message });
                this.ui.toast('error', `测试失败: ${error.message}`);
            }
        }

        async fetchInitialStones() {
            await this.refreshGameSnapshot();
        }
    }

    // ===== 启发式规则 =====
    const HEURISTIC_RULES = [
        (ctx) => {
            // 严格判断：必须同时满足多个条件才能开始新试炼
            if (!ctx.trialEnded || !ctx.canRestart) {
                return null;
            }

            // 检查1：游戏状态必须明确不在试炼中
            if (ctx.gameState?.is_in_trial === true) {
                return null; // 还在试炼中，绝对不能重新开始
            }

            // 检查2：开始按钮必须存在且可用
            const hasStartButton = document.getElementById('start-trial-button');
            if (!hasStartButton || hasStartButton.disabled) {
                return null;
            }

            // 检查3：防止循环执行（检查最近3次历史）
            const recentHistory = ctx.history?.slice(-3) || [];
            const recentStartCount = recentHistory.filter(msg =>
                typeof msg === 'string' && msg.includes('开始试炼')
            ).length;
            if (recentStartCount >= 2) {
                return null; // 最近已经执行过2次，不再重复
            }

            // 检查4：剧情文本不能包含拒绝提示
            if (/未曾终结|尚未有结果|当前之试炼|何来再次/.test(ctx.lastMessage)) {
                return null; // 游戏明确拒绝了
            }

            return { action: '开始试炼', reason: '检测到试炼结束,可立即开始新局', risk: 'low', confidence: 75 };
        },
        (ctx) => {
            if (ctx.richStoneOption && /灵石丰厚|灵石盈满/.test(ctx.lastMessage)) {
                return { action: ctx.richStoneOption, reason: '灵石丰厚提示,优先保值', risk: 'low', confidence: 80 };
            }
            return null;
        },
        (ctx) => {
            if (ctx.injured && ctx.healOption) {
                return { action: ctx.healOption, reason: '角色重伤,先行疗伤', risk: 'low', confidence: 85 };
            }
            return null;
        },
        (ctx) => {
            if (ctx.highRiskText && ctx.safeOption) {
                return { action: ctx.safeOption, reason: '高危剧情,使用防御选项', risk: 'medium', confidence: 72 };
            }
            return null;
        },
        (ctx) => {
            // 移除"仅有一个选项"的启发式规则
            // 即使只有一个选项，也应该让 AI 阅读剧情后决策
            // 这样可以避免机械选择，提升决策质量
            return null;
        }
    ];

    // ===== 工具函数 =====
    function logDebug(config, message) {
        if (config.get('debugMode')) {
            console.log(`[AI调试] ${message}`);
        }
    }

    const FULLWIDTH_DIGIT_MAP = { '১': '1', '२': '2', '३': '3', '४': '4' };
    const CHINESE_DIGIT_MAP = { '一': '1', '二': '2', '三': '3', '四': '4' };

    function clampNumber(value, min, max) {
        if (Number.isNaN(value)) return min;
        return Math.min(max, Math.max(min, value));
    }

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    function createDebounce(fn, wait = 300) {
        let timer = null;
        const debounced = (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(null, args), wait);
        };
        debounced.cancel = () => timer && clearTimeout(timer);
        return debounced;
    }

    function normalizeChoiceToken(token) {
        if (!token) return null;
        const cleaned = token.trim();
        if (FULLWIDTH_DIGIT_MAP[cleaned]) return FULLWIDTH_DIGIT_MAP[cleaned];
        if (CHINESE_DIGIT_MAP[cleaned]) return CHINESE_DIGIT_MAP[cleaned];
        const digitMatch = cleaned.match(/[1-4]/);
        return digitMatch ? digitMatch[0] : null;
    }

    function evaluateRiskFromText(text = '') {
        if (!text) return 'medium';
        if (RISK_KEYWORDS.high.some(word => text.includes(word))) return 'high';
        if (RISK_KEYWORDS.low.some(word => text.includes(word))) return 'low';
        if (RISK_KEYWORDS.medium.some(word => text.includes(word))) return 'medium';
        if (/危|险|搏|死/.test(text)) return 'high';
        if (/稳|谨慎|防|休整/.test(text)) return 'low';
        return 'medium';
    }

    function extractOptionsFromText(text = '') {
        const options = [];
        text.split('\n').forEach(line => {
            const match = line.trim().match(/^[（(]?([1234১२३४一二三四])[)）．\.、\s-]+(.+)/);
            if (match) {
                const choice = normalizeChoiceToken(match[1]);
                if (choice) {
                    options.push({
                        id: choice,
                        description: match[2].trim(),
                        risk: evaluateRiskFromText(match[2])
                    });
                }
            }
        });
        return options;
    }

    function detectRiskSignals(text = '') {
        const signals = [];
        Object.entries(RISK_KEYWORDS).forEach(([level, keywords]) => {
            keywords.forEach(keyword => {
                if (text.includes(keyword)) {
                    signals.push(`${keyword}:${level}`);
                }
            });
        });
        return signals.slice(0, 6);
    }

    function determinePhase(remaining) {
        if (remaining == null) return '未知阶段';
        if (remaining >= 8) return '序章';
        if (remaining >= 4) return '中盘';
        if (remaining >= 1) return '终局';
        return '机缘耗尽';
    }

    function describeOpportunityDirective(remaining) {
        if (remaining == null) return '机缘未知,稳健推进';
        if (remaining >= 8) return '机缘充裕,可尝试高收益路径但保留脱身手段';
        if (remaining >= 5) return '机缘尚多,稳固基础可择机突破';
        if (remaining >= 3) return '机缘过半,攻守平衡,以收益>风险为准';
        if (remaining >= 2) return '机缘偏紧,优先回血与积累灵石';
        return '最后机会,优先保命保石';
    }

    function buildLifeSnapshot(gameState) {
        const life = gameState?.current_life;
        if (!life) return '角色状态未知';

        const segments = [];
        if (life['生命']) segments.push(`生命:${life['生命']}`);
        if (life['生命值']) segments.push(`生命:${life['生命值']}`);

        ['修为', '境界', '灵石', '状态', '法宝', '符箓'].forEach(key => {
            if (life[key]) {
                segments.push(`${key}:${Array.isArray(life[key]) ? life[key].join('、') : life[key]}`);
            }
        });

        return segments.join('；') || '暂无显著信息';
    }

    function buildHistoryDigest(history) {
        if (!Array.isArray(history) || history.length === 0) return '';
        const recent = history.slice(-MAX_HISTORY_LINES);
        return recent.map((entry, idx) => `${history.length - recent.length + idx + 1}.${entry}`).join(' ');
    }

    function cleanJsonContent(raw = '') {
        const fenceMatch = raw.match(/```(?:json)?([\s\S]+?)```/i);
        return (fenceMatch ? fenceMatch[1] : raw).trim();
    }

    function stripThinkBlocks(text = '') {
        const segments = [];

        // 先移除完整的 <think>...</think> 标签对
        let cleaned = text.replace(/<think>([\s\S]*?)<\/think>/gi, (_, block) => {
            if (block.trim()) segments.push(block.trim());
            return '';
        });

        // 再移除未闭合的 <think> 标签及其后续内容（处理被截断的情况）
        cleaned = cleaned.replace(/<think>[\s\S]*/gi, '');

        // 移除孤立的 </think> 标签
        cleaned = cleaned.replace(/<\/think>/gi, '');

        return { cleaned: cleaned.trim(), thinkSegments: segments };
    }

    function shouldConfirmExit(action = '') {
        return EXIT_KEYWORDS.some(keyword => action.includes(keyword));
    }

    function normalizeActionText(actionText = '') {
        const trimmed = actionText.trim();
        if (!trimmed) return '';

        // 特殊指令处理
        if (EXIT_KEYWORDS.some(keyword => trimmed.includes(keyword))) return '破碎虚空';
        // 只有完全匹配"开始试炼"时才转换，不要把所有包含"开始"的action都转换
        if (trimmed === '开始试炼' || trimmed === '开始新的试炼' || trimmed === '开启试炼') return '开始试炼';

        // 检测是否包含多个选项（包含"一、"、"二、"、"三、"等）
        const hasMultipleOptions = /[一二三四]\s*[、．.]/g.test(trimmed);
        if (hasMultipleOptions) {
            // 只取第一个选项的文字描述
            const firstOption = trimmed.split(/[一二三四]\s*[、．.]/)[1];
            if (firstOption) {
                // 截取到第一个句号、冒号或下一个选项标记之前
                const cleanText = firstOption.split(/[。：:]/)[0].trim();
                return cleanText;
            }
        }

        // 移除冒号及其后面的说明文字
        // 例如："破碎虚空：带着所得【1】颗灵石，就此结束此番试炼。" → "破碎虚空"
        const colonIndex = trimmed.indexOf('：');
        if (colonIndex > 0) {
            return trimmed.substring(0, colonIndex).trim();
        }

        const colonIndexEn = trimmed.indexOf(':');
        if (colonIndexEn > 0) {
            return trimmed.substring(0, colonIndexEn).trim();
        }

        // 直接返回完整文字描述，不再转换成编号
        // 移除了编号提取逻辑，保留AI输出的完整文字
        return trimmed;
    }

    function isGameEndText(text = '') {
        return GAME_END_KEYWORDS.some(keyword => text.includes(keyword));
    }

    function getAccurateOpportunities(state) {
        if (state?.opportunities_remaining != null) {
            return state.opportunities_remaining;
        }
        return null;
    }

    // ===== 初始化 =====
    const configManager = new ConfigManager();
    const uiManager = new UIManager(configManager);
    const aiService = new AIService(configManager, uiManager);
    const gameEngine = new GameEngine(configManager, uiManager, aiService);

    gameEngine.bootstrap();
})();

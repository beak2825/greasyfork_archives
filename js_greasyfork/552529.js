// ==UserScript==
// @name         B站硬核会员答题辅助(可配置API版)
// @namespace    http://tampermonkey.net/
// @version      2025.10.14.5
// @description  B站硬核会员答题辅助 - 支持多API配置和模型选择
// @author       chaogei888
// @match        *://*.bilibili.com/h5/senior-newbie*
// @license      GPL-3.0-only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/552529/B%E7%AB%99%E7%A1%AC%E6%A0%B8%E4%BC%9A%E5%91%98%E7%AD%94%E9%A2%98%E8%BE%85%E5%8A%A9%28%E5%8F%AF%E9%85%8D%E7%BD%AEAPI%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552529/B%E7%AB%99%E7%A1%AC%E6%A0%B8%E4%BC%9A%E5%91%98%E7%AD%94%E9%A2%98%E8%BE%85%E5%8A%A9%28%E5%8F%AF%E9%85%8D%E7%BD%AEAPI%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        apiEndpoint: "https://api.siliconflow.cn/v1/chat/completions",
        apiKey: "填你硅基流动的API",
        model: "Qwen/Qwen2.5-VL-72B-Instruct",
        autoMode: false,
        answerDelay: 1500,
        enableSound: true,
        showNotifications: true,
        temperature: 0.1,
        topP: 0.9
    };

    // 支持的API提供商和模型
    const API_PROVIDERS = {
        "siliconflow": {
            endpoint: "https://api.siliconflow.cn/v1/chat/completions",
            models: ["Qwen/Qwen2.5-VL-72B-Instruct", "DeepSeek-V3", "GLM-4"]
        },
        "openai": {
            endpoint: "https://api.openai.com/v1/chat/completions",
            models: ["gpt-4", "gpt-3.5-turbo"]
        },
        "volcano": {
            endpoint: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
            models: ["Doubao-pro-128k", "Doubao-lite-128k"]
        }
    };

    // 状态管理
    let state = {
        isUIVisible: true,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        currentQuestionElement: null,
        lastProcessedQuestion: '',
        isProcessing: false,
        answeredCount: 0,
        correctCount: 0
    };

    // 加载配置
    function loadConfig() {
        return {
            apiEndpoint: GM_getValue('apiEndpoint', DEFAULT_CONFIG.apiEndpoint),
            apiKey: GM_getValue('apiKey', DEFAULT_CONFIG.apiKey),
            model: GM_getValue('model', DEFAULT_CONFIG.model),
            autoMode: GM_getValue('autoMode', DEFAULT_CONFIG.autoMode),
            answerDelay: GM_getValue('answerDelay', DEFAULT_CONFIG.answerDelay),
            enableSound: GM_getValue('enableSound', DEFAULT_CONFIG.enableSound),
            showNotifications: GM_getValue('showNotifications', DEFAULT_CONFIG.showNotifications),
            temperature: GM_getValue('temperature', DEFAULT_CONFIG.temperature),
            topP: GM_getValue('topP', DEFAULT_CONFIG.topP)
        };
    }

    // 保存配置
    function saveConfig(config) {
        Object.keys(config).forEach(key => {
            GM_setValue(key, config[key]);
        });
    }

    // 添加CSS样式 - 修复下拉框颜色问题
    GM_addStyle(`
        #bilibili-helper-ui {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-family: 'Segoe UI', system-ui, sans-serif;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            font-size: 14px;
        }

        #bilibili-helper-ui.minimized {
            width: 200px;
            height: 40px;
            font-size: 12px;
        }

        .helper-header {
            background: rgba(0, 0, 0, 0.2);
            padding: 12px 16px;
            border-radius: 12px 12px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            font-weight: 600;
            user-select: none;
        }

        .helper-title {
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .helper-controls {
            display: flex;
            gap: 6px;
        }

        .helper-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 4px;
            color: white;
            width: 24px;
            height: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .helper-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .helper-content {
            padding: 16px;
            color: white;
            max-height: 500px;
            overflow-y: auto;
        }

        .helper-section {
            margin-bottom: 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 12px;
        }

        .helper-section-title {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 8px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .config-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .form-label {
            font-size: 11px;
            font-weight: 600;
            opacity: 0.8;
        }

        /* 修复下拉框样式 */
        .form-input, .form-select {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 4px;
            color: white !important;
            padding: 6px 8px;
            font-size: 12px;
            outline: none;
            transition: all 0.2s ease;
        }

        .form-input:focus, .form-select:focus {
            border-color: rgba(255, 255, 255, 0.6) !important;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .form-input::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
        }

        /* 下拉框选项样式 */
        .form-select option {
            background: rgba(40, 40, 60, 0.95) !important;
            color: white !important;
            padding: 8px 12px;
            border: none;
        }

        .form-select option:hover {
            background: rgba(60, 60, 80, 0.95) !important;
        }

        .form-select option:checked {
            background: rgba(102, 126, 234, 0.8) !important;
            color: white !important;
        }

        /* 修复数字输入框的样式 */
        .form-input[type="number"] {
            -moz-appearance: textfield;
        }

        .form-input[type="number"]::-webkit-outer-spin-button,
        .form-input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .form-row {
            display: flex;
            gap: 8px;
        }

        .form-row .form-group {
            flex: 1;
        }

        .config-actions {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }

        .btn {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.2s ease;
            flex: 1;
            text-align: center;
        }

        .btn-primary {
            background: rgba(74, 222, 128, 0.3);
            color: white;
            border: 1px solid rgba(74, 222, 128, 0.5);
        }

        .btn-primary:hover {
            background: rgba(74, 222, 128, 0.4);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .helper-question {
            font-size: 13px;
            line-height: 1.4;
            margin-bottom: 8px;
            background: rgba(0, 0, 0, 0.2);
            padding: 8px;
            border-radius: 4px;
            max-height: 80px;
            overflow-y: auto;
        }

        .helper-answer {
            font-size: 14px;
            font-weight: 600;
            color: #4ade80;
            background: rgba(74, 222, 128, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 3px solid #4ade80;
            margin-top: 8px;
        }

        .helper-status {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .helper-loading {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .helper-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .action-btn {
            flex: 1;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 6px;
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            text-align: center;
        }

        .action-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }

        .action-btn.primary {
            background: rgba(74, 222, 128, 0.3);
            border: 1px solid rgba(74, 222, 128, 0.5);
        }

        .action-btn.primary:hover {
            background: rgba(74, 222, 128, 0.4);
        }

        .action-btn.danger {
            background: rgba(239, 68, 68, 0.3);
            border: 1px solid rgba(239, 68, 68, 0.5);
        }

        .action-btn.danger:hover {
            background: rgba(239, 68, 68, 0.4);
        }

        .hidden {
            display: none !important;
        }

        .tab-container {
            display: flex;
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tab {
            padding: 8px 16px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            opacity: 0.7;
            transition: all 0.2s ease;
            border-bottom: 2px solid transparent;
        }

        .tab.active {
            opacity: 1;
            border-bottom-color: rgba(255, 255, 255, 0.8);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .auto-selected {
            background: rgba(74, 222, 128, 0.3) !important;
            border: 2px solid #4ade80 !important;
            transition: all 0.3s ease;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 8px;
        }

        .stat-item {
            text-align: center;
            padding: 6px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }

        .stat-value {
            font-size: 16px;
            font-weight: bold;
            color: #4ade80;
        }

        .stat-label {
            font-size: 10px;
            opacity: 0.8;
        }

        /* 复选框和单选框样式 */
        input[type="checkbox"], input[type="radio"] {
            accent-color: #667eea;
            transform: scale(1.1);
            margin-right: 6px;
        }

        /* 设置项标签样式 */
        .setting-label {
            display: flex;
            align-items: center;
            font-size: 11px;
            cursor: pointer;
            padding: 4px 0;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            #bilibili-helper-ui {
                width: 350px;
                right: 10px;
            }

            .form-row {
                flex-direction: column;
                gap: 6px;
            }
        }
    `);

    // 创建悬浮界面
    function createFloatingUI() {
        const config = loadConfig();

        const ui = document.createElement('div');
        ui.id = 'bilibili-helper-ui';
        ui.innerHTML = `
            <div class="helper-header">
                <div class="helper-title">
                    <span>🎯 B站答题助手</span>
                    <span style="opacity: 0.8; font-size: 11px;">${config.autoMode ? '自动模式' : '手动模式'}</span>
                </div>
                <div class="helper-controls">
                    <button class="helper-btn" id="settings-btn" title="设置">⚙️</button>
                    <button class="helper-btn" id="minimize-btn" title="最小化">−</button>
                    <button class="helper-btn" id="close-btn" title="关闭">×</button>
                </div>
            </div>
            <div class="helper-content">
                <div class="tab-container">
                    <div class="tab active" data-tab="main">主界面</div>
                    <div class="tab" data-tab="config">API设置</div>
                    <div class="tab" data-tab="stats">统计</div>
                </div>

                <!-- 主界面 -->
                <div class="tab-content active" id="main-tab">
                    <div class="helper-section">
                        <div class="helper-section-title">当前问题</div>
                        <div class="helper-question" id="current-question">等待题目出现...</div>
                    </div>
                    <div class="helper-section">
                        <div class="helper-section-title">AI推荐答案</div>
                        <div class="helper-answer" id="ai-answer">-</div>
                        <div class="helper-status" id="api-status">准备就绪</div>
                    </div>
                    <div class="helper-actions">
                        <button class="action-btn" id="refresh-btn">🔄 重新获取</button>
                        <button class="action-btn ${config.autoMode ? 'danger' : 'primary'}" id="auto-mode-btn">
                            ${config.autoMode ? '⏹️ 停止自动' : '🤖 自动答题'}
                        </button>
                    </div>
                </div>

                <!-- API设置界面 -->
                <div class="tab-content" id="config-tab">
                    <div class="helper-section">
                        <div class="helper-section-title">API配置</div>
                        <div class="config-form">
                            <div class="form-group">
                                <label class="form-label">API提供商</label>
                                <select class="form-select" id="api-provider">
                                    <option value="siliconflow">硅基流动 (SiliconFlow)</option>
                                    <option value="openai">OpenAI</option>
                                    <option value="volcano">火山引擎</option>
                                    <option value="custom">自定义</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">API端点</label>
                                <input type="text" class="form-input" id="api-endpoint" placeholder="https://api.siliconflow.cn/v1/chat/completions" value="${config.apiEndpoint}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">API密钥</label>
                                <input type="password" class="form-input" id="api-key" placeholder="输入API密钥" value="${config.apiKey}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">模型名称</label>
                                <input type="text" class="form-input" id="model-name" placeholder="Qwen/Qwen2.5-VL-72B-Instruct" value="${config.model}">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">温度 (Temperature)</label>
                                    <input type="number" class="form-input" id="temperature" min="0" max="1" step="0.1" value="${config.temperature}">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Top P</label>
                                    <input type="number" class="form-input" id="top-p" min="0" max="1" step="0.1" value="${config.topP}">
                                </div>
                            </div>
                            <div class="config-actions">
                                <button class="btn btn-primary" id="save-config">保存配置</button>
                                <button class="btn btn-secondary" id="reset-config">恢复默认</button>
                            </div>
                        </div>
                    </div>
                    <div class="helper-section">
                        <div class="helper-section-title">功能设置</div>
                        <div class="config-form">
                            <div class="form-group">
                                <label class="setting-label">
                                    <input type="checkbox" id="auto-mode" ${config.autoMode ? 'checked' : ''}>
                                    <span>自动答题模式</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="setting-label">
                                    <input type="checkbox" id="enable-sound" ${config.enableSound ? 'checked' : ''}>
                                    <span>启用提示音</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="setting-label">
                                    <input type="checkbox" id="show-notifications" ${config.showNotifications ? 'checked' : ''}>
                                    <span>显示通知</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <label class="form-label">答题延迟 (毫秒)</label>
                                <input type="number" class="form-input" id="answer-delay" value="${config.answerDelay}" min="500" max="5000">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 统计界面 -->
                <div class="tab-content" id="stats-tab">
                    <div class="helper-section">
                        <div class="helper-section-title">答题统计</div>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-value">${state.answeredCount}</div>
                                <div class="stat-label">已答题数</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${state.correctCount}</div>
                                <div class="stat-label">正确题数</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${state.answeredCount > 0 ? Math.round((state.correctCount / state.answeredCount) * 100) : 0}%</div>
                                <div class="stat-label">正确率</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${100 - state.answeredCount}</div>
                                <div class="stat-label">剩余题数</div>
                            </div>
                        </div>
                    </div>
                    <div class="helper-actions">
                        <button class="action-btn" id="reset-stats">重置统计</button>
                        <button class="action-btn" id="export-stats">导出数据</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(ui);
        setupDragAndDrop(ui);
        setupEventListeners();
        setupConfigHandlers();
    }

    // 设置拖拽功能
    function setupDragAndDrop(ui) {
        const header = ui.querySelector('.helper-header');

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.helper-btn')) return;

            state.isDragging = true;
            const rect = ui.getBoundingClientRect();
            state.dragOffset.x = e.clientX - rect.left;
            state.dragOffset.y = e.clientY - rect.top;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!state.isDragging) return;

            ui.style.left = (e.clientX - state.dragOffset.x) + 'px';
            ui.style.top = (e.clientY - state.dragOffset.y) + 'px';
            ui.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            state.isDragging = false;
        });
    }

    // 设置事件监听器
    function setupEventListeners() {
        const ui = document.getElementById('bilibili-helper-ui');
        const minimizeBtn = document.getElementById('minimize-btn');
        const closeBtn = document.getElementById('close-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        const autoModeBtn = document.getElementById('auto-mode-btn');
        const settingsBtn = document.getElementById('settings-btn');

        // 标签页切换
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });

        minimizeBtn.addEventListener('click', () => {
            ui.classList.toggle('minimized');
            const content = ui.querySelector('.helper-content');
            content.classList.toggle('hidden');
            minimizeBtn.textContent = ui.classList.contains('minimized') ? '+' : '−';
        });

        closeBtn.addEventListener('click', () => {
            ui.style.display = 'none';
            state.isUIVisible = false;
        });

        refreshBtn.addEventListener('click', () => {
            if (state.currentQuestionElement) {
                processQuestion(state.currentQuestionElement);
            } else {
                const question = findCurrentQuestion();
                if (question) {
                    processQuestion(question);
                }
            }
        });

        autoModeBtn.addEventListener('click', () => {
            const config = loadConfig();
            config.autoMode = !config.autoMode;
            saveConfig(config);

            autoModeBtn.textContent = config.autoMode ? '⏹️ 停止自动' : '🤖 自动答题';
            autoModeBtn.className = `action-btn ${config.autoMode ? 'danger' : 'primary'}`;

            updateUIStatus(config.autoMode ? '自动模式已开启' : '自动模式已关闭');

            if (config.autoMode) {
                const question = findCurrentQuestion();
                if (question) {
                    processQuestion(question);
                }
            }
        });

        settingsBtn.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            document.querySelector('[data-tab="config"]').classList.add('active');
            document.getElementById('config-tab').classList.add('active');
        });
    }

    // 设置配置处理器
    function setupConfigHandlers() {
        const saveBtn = document.getElementById('save-config');
        const resetBtn = document.getElementById('reset-config');
        const apiProvider = document.getElementById('api-provider');

        // API提供商变更事件
        apiProvider.addEventListener('change', function() {
            const provider = API_PROVIDERS[this.value];
            if (provider && this.value !== 'custom') {
                document.getElementById('api-endpoint').value = provider.endpoint;
            }
        });

        saveBtn.addEventListener('click', () => {
            const newConfig = {
                apiEndpoint: document.getElementById('api-endpoint').value,
                apiKey: document.getElementById('api-key').value,
                model: document.getElementById('model-name').value,
                temperature: parseFloat(document.getElementById('temperature').value),
                topP: parseFloat(document.getElementById('top-p').value),
                autoMode: document.getElementById('auto-mode').checked,
                enableSound: document.getElementById('enable-sound').checked,
                showNotifications: document.getElementById('show-notifications').checked,
                answerDelay: parseInt(document.getElementById('answer-delay').value)
            };

            saveConfig(newConfig);
            updateUIStatus('配置已保存');

            // 更新自动模式按钮状态
            const autoModeBtn = document.getElementById('auto-mode-btn');
            autoModeBtn.textContent = newConfig.autoMode ? '⏹️ 停止自动' : '🤖 自动答题';
            autoModeBtn.className = `action-btn ${newConfig.autoMode ? 'danger' : 'primary'}`;
        });

        resetBtn.addEventListener('click', () => {
            if (confirm('确定要恢复默认配置吗？')) {
                saveConfig(DEFAULT_CONFIG);
                location.reload();
            }
        });
    }

    // 更新界面显示
    function updateUI(question, answers, aiAnswer, status) {
        const questionEl = document.getElementById('current-question');
        const answerEl = document.getElementById('ai-answer');
        const statusEl = document.getElementById('api-status');

        if (questionEl) questionEl.textContent = question || '等待题目出现...';
        if (answerEl) answerEl.textContent = aiAnswer || '-';
        if (answerEl) answerEl.dataset.answers = answers || '';

        if (statusEl) {
            if (status === 'loading') {
                statusEl.innerHTML = '<span class="helper-loading"></span> 正在获取答案...';
            } else if (status === 'error') {
                statusEl.textContent = '❌ 获取失败';
            } else {
                statusEl.textContent = status || '准备就绪';
            }
        }
    }

    // 更新状态显示
    function updateUIStatus(status) {
        const statusEl = document.getElementById('api-status');
        if (statusEl) statusEl.textContent = status;
    }

    // 获取AI答案
    function getAIAnswer(questionText, answersText, questionElement) {
        if (!questionText || questionText === '等待题目出现...') return;

        const config = loadConfig();
        updateUI(questionText, answersText, '', 'loading');

        const prompt = `你是一个资深的 B 站答题专家。请直接告诉我最有可能正确的选项字母（如 A、B、C、D），不要提供任何解释。

问题: ${questionText}
选项: ${answersText}

请只返回选项字母（A、B、C或D）：`;

        console.log('发送AI请求到:', config.apiEndpoint);

        GM_xmlhttpRequest({
            method: "POST",
            url: config.apiEndpoint,
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${config.apiKey}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                model: config.model,
                messages: [{ role: "user", content: prompt }],
                stream: false,
                max_tokens: 4096,
                temperature: config.temperature,
                top_p: config.topP,
                response_format: { type: "text" }
            }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    let content = "";
                    if (data.choices && data.choices.length > 0) {
                        content = data.choices[0].message.content || "未找到答案";
                    } else {
                        content = "未找到答案";
                    }

                    const match = content.match(/[A-D]/);
                    const finalAnswer = match ? `推荐选项: ${match[0]}` : `无法确定: ${content}`;

                    updateUI(questionText, answersText, finalAnswer, 'success');

                    if (config.autoMode && match) {
                        setTimeout(() => {
                            autoSelectAnswer(finalAnswer, questionElement);
                        }, config.answerDelay);
                    }
                } catch (error) {
                    console.error('解析响应失败:', error);
                    updateUI(questionText, answersText, '解析失败', 'error');
                }
            },
            onerror: function(error) {
                console.error('API 请求失败:', error);
                updateUI(questionText, answersText, '请求失败', 'error');
            }
        });
    }

    // 自动选择答案
    function autoSelectAnswer(answerText, questionElement) {
        const match = answerText.match(/[A-D]/);
        if (!match || !questionElement) return false;

        const answerLetter = match[0];
        const answerElements = questionElement.querySelectorAll('.senior-question__answer, .answer-option');

        for (let i = 0; i < answerElements.length; i++) {
            const element = answerElements[i];
            if (element.textContent.includes(answerLetter)) {
                element.click();
                state.answeredCount++;
                state.correctCount++;
                return true;
            }
        }
        return false;
    }

    // 查找和处理题目的函数
    function findCurrentQuestion() {
        const selectors = ['.senior-question', '.question-container', '[class*="question"]'];
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.getBoundingClientRect().width > 0) {
                return element;
            }
        }
        return null;
    }

    function processQuestion(questionElement) {
        if (!questionElement || state.isProcessing) return;

        const questionText = questionElement.querySelector('.senior-question__qs, .question-text')?.innerText;
        if (questionText && questionText !== state.lastProcessedQuestion) {
            state.lastProcessedQuestion = questionText;
            state.currentQuestionElement = questionElement;
            state.isProcessing = true;

            const answerElements = questionElement.querySelectorAll('.senior-question__answer, .answer-option');
            const answersText = Array.from(answerElements).map((answer, index) => {
                const letter = String.fromCharCode(65 + index);
                return `${letter}. ${answer.textContent.trim()}`;
            }).join(' | ');

            getAIAnswer(questionText, answersText, questionElement);

            setTimeout(() => {
                state.isProcessing = false;
            }, 2000);
        }
    }

    // 注册Tampermonkey菜单命令
    GM_registerMenuCommand("打开答题助手", function() {
        const ui = document.getElementById('bilibili-helper-ui');
        if (ui) {
            ui.style.display = 'block';
            state.isUIVisible = true;
        }
    });

    // 初始化
    function init() {
        // 加载统计信息
        state.answeredCount = GM_getValue('answeredCount', 0);
        state.correctCount = GM_getValue('correctCount', 0);

        createFloatingUI();

        // 设置题目监听
        setInterval(() => {
            if (!state.isProcessing) {
                const question = findCurrentQuestion();
                if (question) {
                    processQuestion(question);
                }
            }
        }, 3000);

        console.log('🎯 B站答题助手已加载 - 下拉框样式已修复');
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
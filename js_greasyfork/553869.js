// ==UserScript==
// @name         厦大嘉庚校园网助手
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  智能检测并预填写校园网登录信息，支持自定义倒计时
// @author       You
// @match        http://10.100.1.5/eportal/index.jsp*
// @match        http://www.msftconnecttest.com/redirect*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/553869/%E5%8E%A6%E5%A4%A7%E5%98%89%E5%BA%9A%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553869/%E5%8E%A6%E5%A4%A7%E5%98%89%E5%BA%9A%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置管理类
    class ConfigManager {
        constructor() {
            this.defaultConfig = {
                username: '',
                password: '',
                operator: '校园网',
                countdownTime: 10,
                isConfigured: false
            };
            this.loadConfig();
        }

        loadConfig() {
            const saved = GM_getValue('campus_config', this.defaultConfig);
            this.config = { ...this.defaultConfig, ...saved };
        }

        saveConfig(newConfig = {}) {
            this.config = { ...this.config, ...newConfig };
            this.config.isConfigured = this.isComplete();
            GM_setValue('campus_config', this.config);
            return this.config;
        }

        isComplete() {
            return this.config.username &&
                   this.config.password &&
                   this.config.operator;
        }

        validate() {
            const errors = [];
            if (!this.config.username) errors.push('学号/教工号');
            if (!this.config.password) errors.push('密码');
            if (!this.config.operator) errors.push('运营商');
            return errors;
        }
    }

    // 主控制器
    class CampusLoginMaster {
        constructor() {
            this.configManager = new ConfigManager();
            this.countdown = this.configManager.config.countdownTime;
            this.isPaused = false;
            this.timer = null;
            this.isExecuting = false;
            this.retryCount = 0;
            this.maxRetries = 3;
            this.init();
        }

        init() {
            // 检查当前页面类型
            if (window.location.href.includes('msftconnecttest.com/redirect')) {
                this.handleRedirectPage();
                return;
            }

            this.injectStyles();
            this.createUI();
            this.startWorkflow();
        }

        // 处理重定向页面
        handleRedirectPage() {
            console.log('检测到网络重定向页面，正在跳转到登录页面...');

            const waitMessage = document.createElement('div');
            waitMessage.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    font-family: 'Microsoft YaHei', sans-serif;
                    z-index: 10000;
                ">
                    <div style="font-size: 24px; margin-bottom: 15px;">🎓</div>
                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
                        厦大嘉庚校园网助手
                    </div>
                    <div style="font-size: 14px; opacity: 0.9;">
                        正在跳转到登录页面...
                    </div>
                </div>
            `;
            document.body.appendChild(waitMessage);

            setTimeout(() => {
                window.location.href = 'http://10.100.1.5/eportal/index.jsp';
            }, 2000);

            setTimeout(() => {
                if (window.location.href.includes('msftconnecttest.com')) {
                    window.location.reload();
                }
            }, 5000);
        }

        // 注入CSS样式
        injectStyles() {
            GM_addStyle(`
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

                .campus-login-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 360px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    color: white;
                    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
                    z-index: 10000;
                    border: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    max-height: 90vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    flex-shrink: 0;
                }

                .panel-title {
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .panel-controls {
                    display: flex;
                    gap: 6px;
                }

                .control-btn {
                    background: rgba(255,255,255,0.15);
                    border: none;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-size: 12px;
                }

                .control-btn:hover {
                    background: rgba(255,255,255,0.25);
                    transform: scale(1.1);
                }

                .countdown-display {
                    text-align: center;
                    font-size: 24px;
                    font-weight: 700;
                    margin: 15px 0;
                    background: rgba(0,0,0,0.2);
                    padding: 12px;
                    border-radius: 12px;
                    border: 2px solid rgba(255,255,255,0.1);
                    position: relative;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .countdown-display::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }

                .action-buttons {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 15px;
                    flex-shrink: 0;
                }

                .action-btn {
                    padding: 10px;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .action-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .pause-btn {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                }

                .pause-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #ff5252, #e53935);
                    transform: translateY(-2px);
                }

                .login-btn {
                    background: linear-gradient(135deg, #51cf66, #40c057);
                }

                .login-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #40c057, #2f9e44);
                    transform: translateY(-2px);
                }

                .config-section {
                    background: rgba(255,255,255,0.08);
                    padding: 15px;
                    border-radius: 12px;
                    margin-top: 10px;
                    border: 1px solid rgba(255,255,255,0.05);
                    overflow-y: auto;
                    flex: 1;
                    min-height: 0;
                }

                .config-group {
                    margin-bottom: 12px;
                }

                .config-label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    opacity: 0.9;
                }

                .config-input {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.12);
                    color: white;
                    font-size: 13px;
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                    box-sizing: border-box;
                }

                .config-input:focus {
                    outline: none;
                    background: rgba(255,255,255,0.18);
                    border-color: rgba(255,255,255,0.3);
                }

                .config-input::placeholder {
                    color: rgba(255,255,255,0.6);
                }

                .config-select {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.12);
                    color: white;
                    font-size: 13px;
                    cursor: pointer;
                    box-sizing: border-box;
                }

                .config-select option {
                    background: #4a5568;
                    color: white;
                }

                .slider-container {
                    padding: 8px 0;
                }

                .time-slider {
                    width: 100%;
                    height: 5px;
                    border-radius: 3px;
                    background: rgba(255,255,255,0.2);
                    outline: none;
                    -webkit-appearance: none;
                }

                .time-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #51cf66;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                }

                .time-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #51cf66;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                }

                .time-display {
                    text-align: center;
                    font-size: 11px;
                    margin-top: 4px;
                    opacity: 0.8;
                }

                .save-buttons {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-top: 15px;
                }

                .save-btn {
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                    transition: all 0.3s ease;
                }

                .save-config-btn {
                    background: linear-gradient(135deg, #339af0, #228be6);
                }

                .save-config-btn:hover {
                    background: linear-gradient(135deg, #228be6, #1c7ed6);
                    transform: translateY(-1px);
                }

                .test-fill-btn {
                    background: linear-gradient(135deg, #f59f00, #f08c00);
                }

                .test-fill-btn:hover {
                    background: linear-gradient(135deg, #f08c00, #e67700);
                    transform: translateY(-1px);
                }

                .status-message {
                    margin-top: 12px;
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 12px;
                    text-align: center;
                    display: none;
                    animation: slideIn 0.3s ease;
                    flex-shrink: 0;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .status-success {
                    background: rgba(81, 207, 102, 0.2);
                    border: 1px solid rgba(81, 207, 102, 0.4);
                }

                .status-error {
                    background: rgba(255, 107, 107, 0.2);
                    border: 1px solid rgba(255, 107, 107, 0.4);
                }

                .status-warning {
                    background: rgba(245, 159, 0, 0.2);
                    border: 1px solid rgba(245, 159, 0, 0.4);
                }

                .status-info {
                    background: rgba(51, 154, 240, 0.2);
                    border: 1px solid rgba(51, 154, 240, 0.4);
                }

                .welcome-section {
                    text-align: center;
                    padding: 15px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 12px;
                    margin-bottom: 15px;
                    flex-shrink: 0;
                }

                .welcome-icon {
                    font-size: 36px;
                    margin-bottom: 10px;
                    opacity: 0.9;
                }

                .welcome-text {
                    font-size: 14px;
                    line-height: 1.4;
                    opacity: 0.9;
                }

                .step-indicator {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    margin: 10px 0;
                }

                .step-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.3);
                    transition: all 0.3s ease;
                }

                .step-dot.active {
                    background: white;
                    transform: scale(1.2);
                }

                .main-content {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-height: 0;
                    overflow: hidden;
                }
            `);
        }

        // 创建用户界面
        createUI() {
            const panelHTML = `
                <div class="campus-login-panel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <i class="fas fa-graduation-cap"></i>
                            <span>厦大嘉庚校园网助手</span>
                        </div>
                        <div class="panel-controls">
                            <button class="control-btn" id="settings-btn" title="设置">
                                <i class="fas fa-cog"></i>
                            </button>
                        </div>
                    </div>

                    <div class="main-content">
                        <div class="welcome-section" id="welcome-section">
                            <div class="welcome-icon">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="welcome-text" id="welcome-text">
                                正在检测登录信息...
                            </div>
                            <div class="step-indicator">
                                <div class="step-dot" id="step-1"></div>
                                <div class="step-dot" id="step-2"></div>
                                <div class="step-dot" id="step-3"></div>
                            </div>
                        </div>

                        <div class="countdown-display" id="countdown-display">
                            <div id="countdown-text">准备就绪</div>
                        </div>

                        <div class="action-buttons">
                            <button class="action-btn pause-btn" id="pause-btn">
                                <i class="fas fa-pause"></i>
                                <span>暂停执行</span>
                            </button>
                            <button class="action-btn login-btn" id="login-now-btn">
                                <i class="fas fa-rocket"></i>
                                <span>立即登录</span>
                            </button>
                        </div>

                        <div class="config-section" id="config-section" style="display: none;">
                            <div class="config-group">
                                <label class="config-label">学号/教工号</label>
                                <input type="text" class="config-input" id="config-username"
                                       placeholder="请输入学号或教工号" value="${this.configManager.config.username}">
                            </div>

                            <div class="config-group">
                                <label class="config-label">密码</label>
                                <input type="password" class="config-input" id="config-password"
                                       placeholder="请输入密码" value="${this.configManager.config.password}">
                            </div>

                            <div class="config-group">
                                <label class="config-label">运营商</label>
                                <select class="config-select" id="config-operator">
                                    <option value="校园网">校园网</option>
                                    <option value="中国电信">中国电信</option>
                                    <option value="中国移动">中国移动</option>
                                    <option value="中国联通">中国联通</option>
                                </select>
                            </div>

                            <div class="config-group">
                                <label class="config-label">倒计时时间: <span id="time-value">${this.configManager.config.countdownTime}</span> 秒</label>
                                <div class="slider-container">
                                    <input type="range" class="time-slider" id="time-slider"
                                           min="1" max="15" value="${this.configManager.config.countdownTime}">
                                    <div class="time-display">1秒 - 15秒</div>
                                </div>
                            </div>

                            <div class="save-buttons">
                                <button class="save-btn save-config-btn" id="save-config">
                                    <i class="fas fa-save"></i>
                                    <span>保存配置</span>
                                </button>
                                <button class="save-btn test-fill-btn" id="test-fill-btn">
                                    <i class="fas fa-vial"></i>
                                    <span>测试预填</span>
                                </button>
                            </div>
                        </div>

                        <div class="status-message" id="status-message"></div>
                    </div>
                </div>
            `;

            $('body').append(panelHTML);
            this.bindEvents();
            this.setOperatorSelect();
            this.updateStepIndicator(1);
        }

        // 设置运营商选择框
        setOperatorSelect() {
            $('#config-operator').val(this.configManager.config.operator);
        }

        // 绑定事件
        bindEvents() {
            // 控制按钮
            $('#settings-btn').on('click', () => this.toggleSettings());

            // 操作按钮
            $('#pause-btn').on('click', () => this.togglePause());
            $('#login-now-btn').on('click', () => this.loginNow());

            // 配置相关
            $('#save-config').on('click', () => this.saveConfig());
            $('#test-fill-btn').on('click', () => this.testPreFill());

            // 滑块事件
            $('#time-slider').on('input', (e) => {
                const value = e.target.value;
                $('#time-value').text(value);
                this.countdown = parseInt(value);
            });

            // 输入验证
            $('#config-username, #config-password').on('input', () => this.validateInputs());
        }

        // 开始工作流程
        startWorkflow() {
            this.updateStepIndicator(1);
            this.showStatus('正在检测登录信息...', 'info');

            setTimeout(() => {
                this.checkAndPreFill();
            }, 1000);
        }

        // 检测并预填写
        checkAndPreFill() {
            this.updateStepIndicator(2);

            const currentState = this.getFormState();
            const missingFields = this.getMissingFields(currentState);
            const needsCorrection = this.needsCorrection(currentState);

            if (missingFields.length > 0 || needsCorrection) {
                const issues = [];
                if (missingFields.length > 0) issues.push(`缺失: ${missingFields.join(', ')}`);
                if (needsCorrection) issues.push('运营商不匹配');

                this.showStatus(`检测到问题: ${issues.join('; ')}`, 'warning');

                // 检查预填写配置
                const configErrors = this.configManager.validate();
                if (configErrors.length > 0) {
                    this.showConfigurationRequired(configErrors);
                    return;
                }

                // 执行预填写
                this.executePreFill();
            } else {
                this.showStatus('表单信息完整，准备登录', 'success');
                this.startCountdown();
            }
        }

        // 获取表单当前状态
        getFormState() {
            const username = document.getElementById('username')?.value || '';
            const password = document.getElementById('pwd')?.value || '';
            const operatorSelect = document.getElementById('selectDisname');
            const operator = operatorSelect?.innerText?.trim() || '';
            const operatorHidden = document.getElementById('net_access_type')?.value || '';

            return {
                username,
                password,
                operator: operator || operatorHidden
            };
        }

        // 获取缺失字段
        getMissingFields(state) {
            const missing = [];
            if (!state.username) missing.push('学号');
            if (!state.password) missing.push('密码');
            if (!state.operator) missing.push('运营商');
            return missing;
        }

        // 检查是否需要修正（运营商不匹配）
        needsCorrection(state) {
            const config = this.configManager.config;
            return state.operator && state.operator !== config.operator;
        }

        // 显示配置要求
        showConfigurationRequired(missingFields) {
            this.updateStepIndicator(1);
            $('#welcome-text').html(`
                请先完成信息预填写<br>
                <small style="opacity:0.8; font-size:12px;">缺失: ${missingFields.join(', ')}</small>
            `);
            $('#config-section').slideDown(300);
            this.showStatus(`请先配置以下信息: ${missingFields.join(', ')}`, 'error');
        }

        // 执行预填写 - 增强版本
        executePreFill() {
            this.updateStepIndicator(3);

            try {
                const config = this.configManager.config;
                let filledCount = 0;
                const currentState = this.getFormState();

                // 填写用户名
                const usernameInput = document.getElementById('username');
                if (usernameInput && (!usernameInput.value || usernameInput.value !== config.username) && config.username) {
                    usernameInput.value = config.username;
                    usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
                    filledCount++;
                }

                // 填写密码
                const passwordInput = document.getElementById('pwd');
                if (passwordInput && (!passwordInput.value || passwordInput.value !== config.password) && config.password) {
                    passwordInput.value = config.password;
                    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                    filledCount++;
                }

                // 选择运营商 - 增强版本，增加重试机制
                const targetOperator = config.operator;
                const operatorCorrected = this.correctOperatorSelection(targetOperator);

                if (operatorCorrected) {
                    filledCount++;
                }

                this.showStatus(`成功预填写 ${filledCount} 项信息`, 'success');

                // 验证填写结果
                setTimeout(() => {
                    this.verifyAndContinue();
                }, 1500);

            } catch (error) {
                this.showStatus(`预填写失败: ${error.message}`, 'error');
                this.retryOperation();
            }
        }

        // 修正运营商选择 - 增强版本
        correctOperatorSelection(targetOperator) {
            const maxAttempts = 3;
            let attempts = 0;

            while (attempts < maxAttempts) {
                attempts++;

                // 检查当前运营商状态
                const currentState = this.getFormState();

                // 如果已经匹配，直接返回成功
                if (currentState.operator === targetOperator) {
                    console.log(`运营商已正确选择: ${targetOperator}`);
                    return true;
                }

                // 尝试选择运营商
                this.showStatus(`尝试选择运营商: ${targetOperator} (${attempts}/${maxAttempts})`, 'info');

                if (this.selectOperator(targetOperator)) {
                    // 等待页面响应
                    setTimeout(() => {
                        const newState = this.getFormState();
                        if (newState.operator === targetOperator) {
                            console.log(`运营商选择成功: ${targetOperator}`);
                            return true;
                        } else {
                            console.log(`运营商选择未生效，当前: ${newState.operator}, 目标: ${targetOperator}`);
                        }
                    }, 500);
                }

                // 等待下一次尝试
                if (attempts < maxAttempts) {
                    this.showStatus(`等待重试运营商选择... (${attempts}/${maxAttempts})`, 'warning');
                    // 使用同步等待（不推荐但简单）
                    const start = Date.now();
                    while (Date.now() - start < 1000) {
                        // 等待1秒
                    }
                }
            }

            // 最终检查
            const finalState = this.getFormState();
            if (finalState.operator === targetOperator) {
                return true;
            } else {
                this.showStatus(`运营商选择失败，当前: ${finalState.operator}, 目标: ${targetOperator}`, 'error');
                return false;
            }
        }

        // 选择运营商 - 修复版本
        selectOperator(operator) {
            try {
                const operatorMap = {
                    '校园网': { index: '0', name: '校园网' },
                    '中国电信': { index: '1', name: '中国电信' },
                    '中国移动': { index: '2', name: '中国移动' },
                    '中国联通': { index: '3', name: '中国联通' }
                };

                const operatorInfo = operatorMap[operator];
                if (!operatorInfo) {
                    console.error('未知的运营商:', operator);
                    return false;
                }

                // 方法1: 使用页面原有的selectService函数
                if (typeof selectService === 'function') {
                    selectService(operatorInfo.name, operatorInfo.name, operatorInfo.index);
                    console.log('使用selectService选择运营商:', operator);
                    return true;
                }

                // 方法2: 直接模拟点击对应的运营商选项
                const serviceElement = document.getElementById(`bch_service_${operatorInfo.index}`);
                if (serviceElement) {
                    serviceElement.click();
                    console.log('通过点击元素选择运营商:', operator);
                    return true;
                }

                // 方法3: 触发下拉框显示并选择
                const xialaElement = document.getElementById('xiala');
                if (xialaElement) {
                    // 先点击下拉箭头显示选项
                    xialaElement.click();

                    // 等待下拉框显示后点击对应选项
                    setTimeout(() => {
                        const targetService = document.getElementById(`bch_service_${operatorInfo.index}`);
                        if (targetService) {
                            targetService.click();
                            console.log('通过下拉框选择运营商:', operator);
                        }
                    }, 100);
                    return true;
                }

                console.error('无法选择运营商，所有方法都失败了');
                return false;

            } catch (error) {
                console.error('选择运营商时发生错误:', error);
                return false;
            }
        }

        // 验证填写结果并继续
        verifyAndContinue() {
            const currentState = this.getFormState();
            const config = this.configManager.config;
            const issues = [];

            // 检查用户名
            if (currentState.username !== config.username) {
                issues.push('用户名不匹配');
            }

            // 检查运营商
            if (currentState.operator !== config.operator) {
                issues.push('运营商不匹配');
            }

            if (issues.length > 0) {
                this.retryCount++;
                if (this.retryCount <= this.maxRetries) {
                    this.showStatus(`检测到问题: ${issues.join(', ')}，准备第${this.retryCount}次重试...`, 'warning');
                    setTimeout(() => {
                        this.executePreFill();
                    }, 2000);
                } else {
                    this.showStatus(`经过${this.maxRetries}次尝试仍存在问题: ${issues.join(', ')}，请手动检查`, 'error');
                    // 仍然尝试开始倒计时，但提示用户可能需要手动干预
                    this.startCountdown();
                }
            } else {
                this.retryCount = 0; // 重置重试计数
                this.showStatus('所有信息验证通过，准备登录', 'success');
                this.startCountdown();
            }
        }

        // 重试操作
        retryOperation() {
            this.retryCount++;
            if (this.retryCount <= this.maxRetries) {
                this.showStatus(`准备第${this.retryCount}次重试...`, 'warning');
                setTimeout(() => {
                    this.executePreFill();
                }, 2000);
            } else {
                this.showStatus(`经过${this.maxRetries}次尝试仍失败，请检查网络或手动操作`, 'error');
            }
        }

        // 开始倒计时
        startCountdown() {
            this.updateStepIndicator(3);
            $('#welcome-text').text('倒计时开始，准备自动登录');
            this.isExecuting = true;

            this.timer = setInterval(() => {
                if (!this.isPaused) {
                    this.countdown--;
                    $('#countdown-text').text(`${this.countdown}秒后自动登录`);

                    if (this.countdown <= 0) {
                        clearInterval(this.timer);
                        this.performLogin();
                    }
                }
            }, 1000);
        }

        // 切换暂停状态
        togglePause() {
            this.isPaused = !this.isPaused;
            const btn = $('#pause-btn');

            if (this.isPaused) {
                btn.html('<i class="fas fa-play"></i><span>继续执行</span>');
                btn.removeClass('pause-btn').addClass('login-btn');
                this.showStatus('已暂停自动登录', 'info');
            } else {
                btn.html('<i class="fas fa-pause"></i><span>暂停执行</span>');
                btn.removeClass('login-btn').addClass('pause-btn');
                this.hideStatus();
            }
        }

        // 立即登录
        loginNow() {
            if (!this.isExecuting) {
                this.startCountdown();
                this.countdown = 1;
            } else {
                this.performLogin();
            }
        }

        // 执行登录
        performLogin() {
            try {
                const loginBtn = document.getElementById('loginLink');
                if (loginBtn) {
                    loginBtn.click();
                    this.showStatus('正在登录中...', 'info');

                    // 检查登录状态
                    setTimeout(() => {
                        this.checkLoginStatus();
                    }, 3000);

                    // 登录成功后清理资源
                    this.cleanup();
                } else {
                    this.showStatus('未找到登录按钮', 'error');
                }
            } catch (error) {
                this.showStatus(`登录失败: ${error.message}`, 'error');
            }
        }

        // 检查登录状态
        checkLoginStatus() {
            const errorInfo = document.getElementById('errorInfo_center');
            if (errorInfo && errorInfo.innerText.trim()) {
                this.showStatus('登录失败: ' + errorInfo.innerText, 'error');
                // 登录失败时提供重试选项
                this.retryCount++;
                if (this.retryCount <= this.maxRetries) {
                    this.showStatus(`准备第${this.retryCount}次登录重试...`, 'warning');
                    setTimeout(() => {
                        this.performLogin();
                    }, 3000);
                } else {
                    this.showStatus(`经过${this.maxRetries}次登录尝试仍失败，请检查账号信息`, 'error');
                }
            } else {
                this.showStatus('登录成功！脚本即将关闭', 'success');
                setTimeout(() => {
                    this.cleanupAndRemove();
                }, 2000);
            }
        }

        // 保存配置
        saveConfig() {
            if (!this.validateInputs()) return;

            const newConfig = {
                username: $('#config-username').val().trim(),
                password: $('#config-password').val(),
                operator: $('#config-operator').val(),
                countdownTime: parseInt($('#time-slider').val())
            };

            this.configManager.saveConfig(newConfig);
            this.showStatus('配置已保存！', 'success');

            setTimeout(() => {
                this.hideStatus();
                this.checkAndPreFill();
            }, 2000);
        }

        // 测试预填写
        testPreFill() {
            if (!this.validateInputs()) return;
            this.saveConfig();
            this.executePreFill();
        }

        // 验证输入
        validateInputs() {
            const username = $('#config-username').val().trim();
            const password = $('#config-password').val();

            if (!username) {
                this.showStatus('请输入学号/教工号', 'error');
                return false;
            }

            if (!password) {
                this.showStatus('请输入密码', 'error');
                return false;
            }

            if (password.length < 6) {
                this.showStatus('密码长度至少6位', 'warning');
                return false;
            }

            return true;
        }

        // 切换设置面板
        toggleSettings() {
            $('#config-section').slideToggle(300);
        }

        // 更新步骤指示器
        updateStepIndicator(step) {
            $('.step-dot').removeClass('active');
            $(`#step-${step}`).addClass('active');
        }

        // 显示状态消息
        showStatus(message, type) {
            const statusEl = $('#status-message');
            statusEl.text(message)
                   .removeClass('status-success status-error status-warning status-info')
                   .addClass(`status-${type}`)
                   .slideDown(200);
        }

        // 隐藏状态消息
        hideStatus() {
            $('#status-message').slideUp(200);
        }

        // 清理资源
        cleanup() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }

        // 清理资源并移除面板
        cleanupAndRemove() {
            this.cleanup();
            $('.campus-login-panel').fadeOut(500, function() {
                $(this).remove();
            });
        }
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new CampusLoginMaster();
        });
    } else {
        new CampusLoginMaster();
    }

})();
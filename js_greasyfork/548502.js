// ==UserScript==
// @name         井冈山大学校园网自动登录
// @namespace    https://github.com/Flower-MUYi
// @version      1.0
// @description  可用于井冈山大学校园网快速登录
// @author       Flower-MUYi
// @match        http://192.168.77.18/*
// @grant        window.close
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548502/%E4%BA%95%E5%86%88%E5%B1%B1%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/548502/%E4%BA%95%E5%86%88%E5%B1%B1%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

/**
 * 井冈山大学校园网自动登录脚本
 * 功能：
 * 1. 自动填充并提交登录表单
 * 2. 提供浮动设置按钮管理账号信息
 * 3. 支持登录成功后自动关闭页面
 * 4. 提供完善的错误处理和日志功能
 */

/* ==================== 配置区域 ==================== */
const CONFIG = {
    STORAGE_KEY: 'jgsu_auto_login_info',     // 本地存储账号信息的键名
    CUSTOM_KEY: 'jgsu_auto_login_custom',    // 本地存储自定义设置的键名
    LOGIN_PAGE_PATH: '/a79.htm',             // 登录页面的路径
    
    // 时间配置（毫秒）
    CHECK_INTERVAL: 2000,        // 检查浮动按钮的间隔
    INIT_DELAY: 300,             // 初始检查延迟
    ACTION_DELAY: 200,           // 操作之间的延迟
    CLOSE_DELAY: 1500,           // 关闭页面的延迟
    LOGIN_RETRY_DELAY: 1000,     // 登录重试检查的延迟
    
    MAX_LOGIN_ATTEMPTS: 3,       // 最大登录尝试次数
    
    // 页面元素选择器
    SELECTORS: {
        boxOfLogin: '#edit_body > div:nth-child(2) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form',
        inputOfAccount: '#edit_body > div:nth-child(2) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(4)',
        inputOfPassword: '#edit_body > div:nth-child(2) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(5)',
        buttonOfLSP: (lsp) => `#edit_body > div:nth-child(2) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > div.edit_lobo_cell.edit_radio > span:nth-child(${lsp + 2}) > input`,
        buttonOfLogin: '#edit_body > div:nth-child(2) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(2)',
        buttonOfBack: 'input[name="GobackButton"][value="返  回"]',
        buttonOfLogout: 'input[name="logout"][value="注  销"]',
        errorMessage: '#edit_body > div.edit_loginBox.ui-resizable-autohide > div'
    },
    
    // 运营商选项
    LSP_OPTIONS: [
        { value: 0, text: '校园网' },
        { value: 1, text: '电信' },
        { value: 2, text: '移动' },
        { value: 3, text: '联通' }
    ]
};

/* ==================== 全局变量 ==================== */
let USER_ACCOUNT, USER_PASSWORD, USER_LSP;   // 用户账号信息
let loginAttempts = 0;                       // 登录尝试次数
let isAutoClosing = false;                   // 是否正在自动关闭
let hasPerformedLogin = false;               // 是否已执行登录操作
let loginCheckInterval = null;               // 登录检查间隔器
let loginCheckTimeout = null;                // 登录检查超时器

/* ==================== 工具函数 ==================== */

/**
 * 记录信息日志
 * @param {string} msg - 日志消息
 */
function logInfo(msg) {
    console.log(`%c[校园网登录] ${msg}`, 'color: #1e90ff; font-weight: bold;');
}

/**
 * 记录警告日志
 * @param {string} msg - 日志消息
 */
function logWarn(msg) {
    console.warn(`%c[校园网登录] ${msg}`, 'color: orange; font-weight: bold;');
}

/**
 * 记录错误日志
 * @param {string} msg - 日志消息
 */
function logError(msg) {
    console.error(`%c[校园网登录] ${msg}`, 'color: red; font-weight: bold;');
}

/**
 * 显示通知消息
 * @param {string} text - 通知内容
 * @param {string} title - 通知标题
 */
function showNotification(text, title = '校园网登录') {
    if (typeof GM_notification !== 'undefined') {
        GM_notification({ text, title, timeout: 3000 });
    }
}

/**
 * 从本地存储加载用户信息
 * @returns {Object|null} 用户信息对象或null
 */
function loadUserInfo() {
    try {
        const info = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (!info) return null;

        const parsedInfo = JSON.parse(info);
        if (parsedInfo.account && parsedInfo.password && typeof parsedInfo.lsp === 'number') {
            return parsedInfo;
        }
        logWarn('存储的用户信息格式不正确');
        return null;
    } catch (e) {
        logError('解析用户信息失败: ' + e.message);
        return null;
    }
}

/**
 * 保存用户信息到本地存储
 * @param {Object} info - 用户信息对象
 */
function saveUserInfo(info) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(info));
        logInfo('用户信息已保存');
    } catch (e) {
        logError('保存用户信息失败: ' + e.message);
    }
}

/**
 * 清除所有存储的用户信息
 */
function clearAllUserInfo() {
    try {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        localStorage.removeItem(CONFIG.CUSTOM_KEY);
        
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue(CONFIG.CUSTOM_KEY, false);
        }
        
        logInfo('所有用户信息已清除');
        showNotification('所有设置已重置', '校园网登录');
    } catch (e) {
        logError('清除用户信息失败: ' + e.message);
    }
}

/**
 * 确保用户信息已加载，如未加载则提示用户输入
 * @returns {boolean} 是否成功获取用户信息
 */
function ensureUserInfo() {
    let userInfo = loadUserInfo();
    
    if (!userInfo) {
        logWarn('未找到保存的用户信息，请通过浮动设置按钮添加');
        showNotification('请先设置账号信息', '校园网登录');
        showSettingsPanel();
        return false;
    }
    
    USER_ACCOUNT = userInfo.account;
    USER_PASSWORD = userInfo.password;
    USER_LSP = userInfo.lsp;
    
    return true;
}

/**
 * 检查是否启用自动关闭功能
 * @returns {boolean} 是否启用自动关闭
 */
function isAutoCloseEnabled() {
    if (typeof GM_getValue !== 'undefined') {
        return GM_getValue(CONFIG.CUSTOM_KEY, false);
    } else {
        return localStorage.getItem(CONFIG.CUSTOM_KEY) === '1';
    }
}

/**
 * 保存自动关闭设置
 * @param {boolean} enabled - 是否启用自动关闭
 */
function saveAutoCloseSetting(enabled) {
    if (typeof GM_setValue !== 'undefined') {
        GM_setValue(CONFIG.CUSTOM_KEY, enabled);
    } else {
        localStorage.setItem(CONFIG.CUSTOM_KEY, enabled ? '1' : '0');
    }
    logInfo(`自动关闭功能已${enabled ? '启用' : '禁用'}`);
}

/* ==================== 页面操作函数 ==================== */

/**
 * 尝试关闭当前标签页
 * 使用多种方法尝试关闭页面
 */
function tryCloseTab() {
    if (isAutoClosing) return;
    isAutoClosing = true;
    
    logInfo('尝试关闭页面...');
    
    // 方法1: 直接调用window.close()
    try {
        window.close();
        logInfo('已调用window.close()');
    } catch (e) {
        logWarn('window.close()失败: ' + e.message);
    }
    
    // 方法2: 延迟检查是否成功关闭
    setTimeout(() => {
        if (!window.closed) {
            logWarn('无法自动关闭窗口，显示提示信息');
            showClosePrompt();
        } else {
            logInfo('窗口已成功关闭');
        }
    }, 500);
}

/**
 * 显示关闭页面提示
 */
function showClosePrompt() {
    if (document.getElementById('jgsu_close_prompt')) return;
    
    if (window.stop) window.stop();
    
    document.body.innerHTML = '';
    
    const prompt = document.createElement('div');
    prompt.id = 'jgsu_close_prompt';
    prompt.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: system-ui;
    `;
    
    prompt.innerHTML = `
        <h2 style="color: #1e90ff; margin-bottom: 20px;">登录成功！</h2>
        <p style="margin-bottom: 30px; font-size: 16px;">您可以安全地关闭此标签页。</p>
        <button onclick="window.close()" style="
            padding: 12px 24px;
            background: #1e90ff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        ">关闭页面</button>
    `;
    
    document.body.appendChild(prompt);
}

/* ==================== 核心登录功能 ==================== */

/**
 * 执行登录操作
 */
function performLogin() {
    if (!ensureUserInfo()) return;
    
    // 检查登录尝试次数
    if (loginAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
        logError('登录尝试次数过多，请检查账号信息');
        showNotification('登录失败次数过多，请检查账号信息', '校园网登录');
        showSettingsPanel();
        return;
    }
    
    loginAttempts++;
    logInfo(`尝试登录 (${loginAttempts}/${CONFIG.MAX_LOGIN_ATTEMPTS})`);
    hasPerformedLogin = true;
    
    try {
        // 获取表单元素
        const accountInput = document.querySelector(CONFIG.SELECTORS.inputOfAccount);
        const passwordInput = document.querySelector(CONFIG.SELECTORS.inputOfPassword);
        const lspButton = document.querySelector(CONFIG.SELECTORS.buttonOfLSP(USER_LSP));
        const loginButton = document.querySelector(CONFIG.SELECTORS.buttonOfLogin);
        
        // 验证元素是否存在
        if (!accountInput || !passwordInput || !lspButton || !loginButton) {
            throw new Error('找不到登录表单元素');
        }
        
        // 填充表单
        accountInput.value = USER_ACCOUNT;
        passwordInput.value = USER_PASSWORD;
        lspButton.checked = true;
        
        // 延迟点击登录按钮
        setTimeout(() => {
            loginButton.click();
            logInfo('已自动点击登录按钮');
            startLoginResultCheck(); // 开始检查登录结果
        }, CONFIG.ACTION_DELAY);
    } catch (e) {
        logError('自动登录失败: ' + e.message);
    }
}

/**
 * 开始检查登录结果
 */
function startLoginResultCheck() {
    logInfo('开始检查登录结果...');
    
    // 清除之前的检查器
    if (loginCheckInterval) clearInterval(loginCheckInterval);
    if (loginCheckTimeout) clearTimeout(loginCheckTimeout);
    
    // 设置超时时间，防止无限检查
    loginCheckTimeout = setTimeout(() => {
        if (loginCheckInterval) clearInterval(loginCheckInterval);
        logWarn('登录结果检查超时');
        showNotification('登录操作超时，请手动检查登录状态', '校园网登录');
    }, 15000); // 15秒超时
    
    // 定期检查登录状态
    loginCheckInterval = setInterval(() => {
        // 检查是否有返回按钮（登录失败）
        const backButton = document.querySelector(CONFIG.SELECTORS.buttonOfBack);
        
        if (backButton) {
            clearInterval(loginCheckInterval);
            clearTimeout(loginCheckTimeout);
            handleLoginFailure();
            return;
        }
        
        // 检查是否登录成功
        const logoutButton = document.querySelector(CONFIG.SELECTORS.buttonOfLogout);
        const isLoggedIn = logoutButton && logoutButton.value === '注  销';
        
        if (isLoggedIn) {
            clearInterval(loginCheckInterval);
            clearTimeout(loginCheckTimeout);
            handleLoginSuccess();
            return;
        }
        
        logInfo('仍在检查登录状态...');
    }, 1000); // 每秒检查一次
}

/**
 * 处理登录成功情况
 */
function handleLoginSuccess() {
    logInfo('登录成功！检测到注销按钮');
    loginAttempts = 0; // 重置登录尝试次数
    
    // 只有在执行过登录操作后才检查自动关闭
    if (hasPerformedLogin && isAutoCloseEnabled()) {
        logInfo('自动关闭已启用，即将关闭页面...');
        setTimeout(tryCloseTab, CONFIG.CLOSE_DELAY);
    } else if (hasPerformedLogin) {
        logInfo('自动关闭未启用，显示成功消息');
        showNotification('登录成功！', '校园网登录');
    }
}

/**
 * 处理登录失败情况
 */
function handleLoginFailure() {
    logError('登录失败，检测到返回按钮');
    showSettingsPanelWithError('登录失败，请检查账号信息是否正确');
}

/**
 * 检查页面状态并执行相应操作
 */
function checkPageState() {
    // 检查是否是登录页面
    const loginBox = document.querySelector(CONFIG.SELECTORS.boxOfLogin);
    if (loginBox && location.pathname === CONFIG.LOGIN_PAGE_PATH) {
        logInfo('检测到登录表单，开始自动登录...');
        performLogin();
    } else {
        logInfo('未检测到登录表单，页面可能已更改或已登录');
    }
}

/* ==================== 用户界面函数 ==================== */

/**
 * 显示设置面板并显示错误信息
 * @param {string} errorMessage - 错误消息
 */
function showSettingsPanelWithError(errorMessage) {
    const floatBtn = document.getElementById('jgsu_auto_login_float_btn');
    const drawer = document.getElementById('jgsu_auto_login_drawer');
    const overlay = document.getElementById('jgsu_auto_login_overlay');
    
    if (floatBtn && drawer && overlay) {
        const userInfo = loadUserInfo() || { account: '', password: '', lsp: 0 };
        
        document.getElementById('jgsu_drawer_account').value = userInfo.account || '';
        document.getElementById('jgsu_drawer_password').value = userInfo.password || '';
        document.getElementById('jgsu_drawer_lsp').value = userInfo.lsp || 0;
        document.getElementById('jgsu_drawer_autoclose').checked = isAutoCloseEnabled();
        
        // 显示错误信息
        const errorElement = document.getElementById('jgsu_drawer_error');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        
        drawer.style.display = 'flex';
        overlay.style.display = 'block';
    } else {
        logWarn('无法显示设置面板，浮动按钮未初始化');
    }
}

/**
 * 显示设置面板
 */
function showSettingsPanel() {
    const floatBtn = document.getElementById('jgsu_auto_login_float_btn');
    const drawer = document.getElementById('jgsu_auto_login_drawer');
    const overlay = document.getElementById('jgsu_auto_login_overlay');
    
    if (floatBtn && drawer && overlay) {
        const userInfo = loadUserInfo() || { account: '', password: '', lsp: 0 };
        
        document.getElementById('jgsu_drawer_account').value = userInfo.account || '';
        document.getElementById('jgsu_drawer_password').value = userInfo.password || '';
        document.getElementById('jgsu_drawer_lsp').value = userInfo.lsp || 0;
        document.getElementById('jgsu_drawer_autoclose').checked = isAutoCloseEnabled();
        
        // 隐藏错误信息
        document.getElementById('jgsu_drawer_error').style.display = 'none';
        
        drawer.style.display = 'flex';
        overlay.style.display = 'block';
    } else {
        logWarn('无法显示设置面板，浮动按钮未初始化');
    }
}

/**
 * 创建浮动设置按钮
 */
function createFloatingButton() {
    // 避免重复创建
    if (document.getElementById('jgsu_auto_login_float_btn')) return;
    
    // 添加样式
    const style = document.createElement('style');
    style.innerHTML = `
        #jgsu_auto_login_float_btn {
            position: fixed !important;
            right: 24px !important;
            bottom: 24px !important;
            z-index: 2147483647 !important;
            background: #1e90ff;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            font-size: 24px;
            box-shadow: 0 2px 8px rgba(30,144,255,0.2);
            cursor: pointer;
            transition: all 0.2s;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        #jgsu_auto_login_float_btn:hover {
            background: #005fa3;
            transform: scale(1.05);
        }
        #jgsu_auto_login_drawer {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 380px;
            max-width: 96vw;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 2147483647;
            display: none;
            flex-direction: column;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            color: #333;
        }
        #jgsu_auto_login_drawer .drawer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
        }
        #jgsu_auto_login_drawer .drawer-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e90ff;
        }
        #jgsu_auto_login_drawer .drawer-close {
            background: none;
            border: none;
            font-size: 22px;
            cursor: pointer;
            color: #888;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        #jgsu_auto_login_drawer .drawer-close:hover {
            background: #f5f5f5;
            color: #333;
        }
        #jgsu_auto_login_drawer .drawer-row {
            margin-bottom: 16px;
        }
        #jgsu_auto_login_drawer label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
            color: #555;
        }
        #jgsu_auto_login_drawer input[type="text"],
        #jgsu_auto_login_drawer input[type="password"],
        #jgsu_auto_login_drawer select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 15px;
            box-sizing: border-box;
            transition: border 0.2s;
        }
        #jgsu_auto_login_drawer input:focus,
        #jgsu_auto_login_drawer select:focus {
            border-color: #1e90ff;
            outline: none;
        }
        #jgsu_auto_login_drawer .switch-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;
            padding: 12px 0;
            border-top: 1px solid #eee;
        }
        #jgsu_auto_login_drawer .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 26px;
        }
        #jgsu_auto_login_drawer .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        #jgsu_auto_login_drawer .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .3s;
            border-radius: 34px;
        }
        #jgsu_auto_login_drawer .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }
        #jgsu_auto_login_drawer .switch input:checked + .slider {
            background-color: #1e90ff;
        }
        #jgsu_auto_login_drawer .switch input:checked + .slider:before {
            transform: translateX(24px);
        }
        #jgsu_auto_login_drawer .drawer-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;
            gap: 10px;
        }
        #jgsu_auto_login_drawer .btn-save {
            background: #1e90ff;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 20px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        #jgsu_auto_login_drawer .btn-save:hover {
            background: #005fa3;
        }
        #jgsu_auto_login_drawer .btn-clear {
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 20px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        #jgsu_auto_login_drawer .btn-clear:hover {
            background: #c0392b;
        }
        #jgsu_auto_login_overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 2147483646;
            display: none;
        }
        .error-message {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 8px;
            display: none;
            background: #fdf2f2;
            padding: 8px 12px;
            border-radius: 4px;
            border-left: 4px solid #e74c3c;
        }
    `;
    document.head.appendChild(style);
    
    // 创建浮动按钮
    const floatBtn = document.createElement('button');
    floatBtn.id = 'jgsu_auto_login_float_btn';
    floatBtn.title = '自动登录设置';
    floatBtn.innerHTML = '⚙';
    document.body.appendChild(floatBtn);
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'jgsu_auto_login_overlay';
    document.body.appendChild(overlay);
    
    // 创建设置面板
    const drawer = document.createElement('div');
    drawer.id = 'jgsu_auto_login_drawer';
    
    // 生成运营商选项HTML
    const lspOptionsHTML = CONFIG.LSP_OPTIONS.map(option => 
        `<option value="${option.value}">${option.text}</option>`
    ).join('');
    
    drawer.innerHTML = `
        <div class="drawer-header">
            <div class="drawer-title">自动登录设置</div>
            <button class="drawer-close" id="jgsu_drawer_close">×</button>
        </div>
        <div class="drawer-row">
            <label for="jgsu_drawer_account">学号</label>
            <input id="jgsu_drawer_account" type="text" maxlength="32" autocomplete="username" placeholder="请输入学号">
        </div>
        <div class="drawer-row">
            <label for="jgsu_drawer_password">密码</label>
            <input id="jgsu_drawer_password" type="password" maxlength="32" autocomplete="current-password" placeholder="请输入密码">
        </div>
        <div class="drawer-row">
            <label for="jgsu_drawer_lsp">运营商</label>
            <select id="jgsu_drawer_lsp">
                ${lspOptionsHTML}
            </select>
        </div>
        <div class="switch-container">
            <label for="jgsu_drawer_autoclose">登录后自动关闭网页</label>
            <label class="switch">
                <input id="jgsu_drawer_autoclose" type="checkbox">
                <span class="slider"></span>
            </label>
        </div>
        <div class="error-message" id="jgsu_drawer_error"></div>
        <div class="drawer-actions">
            <button class="btn-clear" id="jgsu_drawer_clear">清除缓存</button>
            <button class="btn-save" id="jgsu_drawer_save">保存设置</button>
        </div>
    `;
    document.body.appendChild(drawer);
    
    // 添加事件处理
    setupDrawerEvents(floatBtn, drawer, overlay);
}

/**
 * 设置浮动面板的事件处理
 * @param {HTMLElement} floatBtn - 浮动按钮元素
 * @param {HTMLElement} drawer - 设置面板元素
 * @param {HTMLElement} overlay - 遮罩层元素
 */
function setupDrawerEvents(floatBtn, drawer, overlay) {
    // 浮动按钮点击事件
    floatBtn.addEventListener('click', showSettingsPanel);
    
    // 关闭按钮事件
    document.getElementById('jgsu_drawer_close').addEventListener('click', () => {
        drawer.style.display = 'none';
        overlay.style.display = 'none';
        document.getElementById('jgsu_drawer_error').style.display = 'none';
    });
    
    // 遮罩层点击事件
    overlay.addEventListener('click', () => {
        drawer.style.display = 'none';
        overlay.style.display = 'none';
        document.getElementById('jgsu_drawer_error').style.display = 'none';
    });
    
    // 保存按钮事件
    document.getElementById('jgsu_drawer_save').addEventListener('click', () => {
        const account = document.getElementById('jgsu_drawer_account').value.trim();
        const password = document.getElementById('jgsu_drawer_password').value;
        const lsp = parseInt(document.getElementById('jgsu_drawer_lsp').value, 10);
        
        if (!account || !password) {
            const errorElement = document.getElementById('jgsu_drawer_error');
            errorElement.textContent = '请填写完整的账号和密码信息';
            errorElement.style.display = 'block';
            return;
        }
        
        saveUserInfo({ account, password, lsp });
        drawer.style.display = 'none';
        overlay.style.display = 'none';
        document.getElementById('jgsu_drawer_error').style.display = 'none';
        
        // 重置登录尝试次数
        loginAttempts = 0;
        
        // 如果当前在登录页面，尝试重新登录
        if (location.pathname === CONFIG.LOGIN_PAGE_PATH) {
            setTimeout(performLogin, CONFIG.ACTION_DELAY);
        }
    });
    
    // 清除缓存按钮事件
    document.getElementById('jgsu_drawer_clear').addEventListener('click', () => {
        if (confirm('确定要清除所有保存的账号信息和设置吗？此操作不可撤销。')) {
            clearAllUserInfo();
            
            // 重置表单
            document.getElementById('jgsu_drawer_account').value = '';
            document.getElementById('jgsu_drawer_password').value = '';
            document.getElementById('jgsu_drawer_lsp').value = '0'; // 默认校园网
            document.getElementById('jgsu_drawer_autoclose').checked = false; // 默认关闭
            
            // 隐藏错误信息
            document.getElementById('jgsu_drawer_error').style.display = 'none';
            
            // 重置登录尝试次数
            loginAttempts = 0;
        }
    });
    
    // 自动关闭开关事件
    const autoCloseCheckbox = document.getElementById('jgsu_drawer_autoclose');
    autoCloseCheckbox.checked = isAutoCloseEnabled();
    autoCloseCheckbox.addEventListener('change', function() {
        saveAutoCloseSetting(this.checked);
    });
    
    // ESC键关闭面板
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.style.display === 'flex') {
            drawer.style.display = 'none';
            overlay.style.display = 'none';
            document.getElementById('jgsu_drawer_error').style.display = 'none';
        }
    });
}

/* ==================== 主执行逻辑 ==================== */

/**
 * 初始化脚本
 */
function initScript() {
    'use strict';
    
    // 创建浮动按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }
    
    // 定期检查浮动按钮是否存在（防止被动态移除）
    setInterval(createFloatingButton, CONFIG.CHECK_INTERVAL);
    
    // 延迟执行页面状态检查
    setTimeout(checkPageState, CONFIG.INIT_DELAY);
}

// 启动脚本
initScript();
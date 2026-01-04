// ==UserScript==
// @name         USST Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  A Tampermonkey user script for automatic login to University of Shanghai for Science and Technology(USST) authentication pages.
// @description:zh-cn  一个用于自动登录上海理工大学相关认证页面的 Tampermonkey 用户脚本。
// @author       Zhuocheng Lang
// @license      MIT
// @icon         https://www.usst.edu.cn/_upload/tpl/00/40/64/template64/favicon.ico
// @match        *://ids6.usst.edu.cn/authserver/*
// @match        *://courses.usst.edu.cn/auth/*
// @noframes
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561257/USST%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/561257/USST%20Auto%20Login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration Storage Keys ---
    const CONFIG_KEY = 'usst_cas_config';
    const CONFIG_VERSION_KEY = 'usst_cas_config_version';
    const CURRENT_CONFIG_VERSION = 1;

    const STYLES = `
        .usst-config-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .usst-config-dialog {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
        }
        .usst-config-header {
            margin: 0 0 20px 0;
            color: #333;
            font-size: 20px;
        }
        .usst-config-field {
            margin-bottom: 15px;
        }
        .usst-config-label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: 500;
        }
        .usst-config-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .usst-config-help {
            color: #666;
            font-size: 12px;
            display: block;
            margin-top: 4px;
        }
        .usst-config-error {
            color: #d32f2f;
            font-size: 14px;
            display: none;
            margin-bottom: 10px;
        }
        .usst-config-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .usst-config-btn {
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: opacity 0.2s;
        }
        .usst-config-btn:hover {
            opacity: 0.8;
        }
        .usst-config-btn-primary {
            border: none;
            background: #1976d2;
            color: white;
        }
        .usst-config-btn-secondary {
            border: 1px solid #ddd;
            background: white;
            color: #333;
        }
    `;

    /**
     * Log a message with the script prefix
     * @param {string} message - The message to log
     */
    function log(message) {
        GM_log(`[USST Auto Login] ${message}`);
        console.log(`[USST Auto Login] ${message}`);
    }

    // Inject styles
    GM_addStyle(STYLES);

    /**
     * Show configuration dialog
     * @param {boolean} isFirstTime - Whether this is the first time configuration
     * @returns {Promise<Object|null>} The configuration object or null if cancelled
     */
    function showConfigDialog(isFirstTime = false) {
        return new Promise((resolve) => {
            // Get existing configuration
            const existingConfig = GM_getValue(CONFIG_KEY, {});

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'usst-config-overlay';

            // Create dialog
            const dialog = document.createElement('div');
            dialog.className = 'usst-config-dialog';

            dialog.innerHTML = `
                <h2 class="usst-config-header">
                    ${isFirstTime ? '🔐 首次配置 USST 自动登录' : '⚙️ 修改登录配置'}
                </h2>
                <div class="usst-config-field">
                    <label class="usst-config-label">学号 <span style="color: red;">*</span></label>
                    <input type="text" id="usst-username" class="usst-config-input" value="${existingConfig.username || ''}" placeholder="请输入学号" />
                </div>
                <div class="usst-config-field">
                    <label class="usst-config-label">密码 <span style="color: red;">*</span></label>
                    <input type="password" id="usst-password" class="usst-config-input" value="${existingConfig.password || ''}" placeholder="请输入密码" />
                </div>
                <div class="usst-config-field">
                    <label class="usst-config-label">启动延迟(毫秒) <span style="color: #999; font-weight: normal;">(可选,默认10ms)</span></label>
                    <input type="number" id="usst-startup-delay" class="usst-config-input" value="${existingConfig.startupDelay || 10}" placeholder="10" min="0" max="5000" />
                    <small class="usst-config-help">脚本启动后等待多久开始自动登录</small>
                </div>
                <div class="usst-config-field">
                    <label class="usst-config-label">操作间隔(毫秒) <span style="color: #999; font-weight: normal;">(可选,默认100ms)</span></label>
                    <input type="number" id="usst-action-delay" class="usst-config-input" value="${existingConfig.actionDelay || 100}" placeholder="100" min="50" max="2000" />
                    <small class="usst-config-help">填充表单各步骤之间的等待时间</small>
                </div>
                <div id="usst-error-msg" class="usst-config-error"></div>
                <div class="usst-config-actions">
                    ${!isFirstTime ? '<button id="usst-cancel-btn" class="usst-config-btn usst-config-btn-secondary">取消</button>' : ''}
                    <button id="usst-save-btn" class="usst-config-btn usst-config-btn-primary">保存</button>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            const usernameInput = dialog.querySelector('#usst-username');
            const passwordInput = dialog.querySelector('#usst-password');
            const startupDelayInput = dialog.querySelector('#usst-startup-delay');
            const actionDelayInput = dialog.querySelector('#usst-action-delay');
            const saveBtn = dialog.querySelector('#usst-save-btn');
            const cancelBtn = dialog.querySelector('#usst-cancel-btn');
            const errorMsg = dialog.querySelector('#usst-error-msg');

            /**
             * Show error message in the dialog
             * @param {string} message - The error message to display
             */
            function showError(message) {
                errorMsg.textContent = message;
                errorMsg.style.display = 'block';
            }

            /**
             * Save configuration to GM storage
             */
            function saveConfig() {
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                const startupDelay = parseInt(startupDelayInput.value) || 10;
                const actionDelay = parseInt(actionDelayInput.value) || 100;

                // Validate required fields
                if (!username) {
                    showError('请输入学号');
                    usernameInput.focus();
                    return;
                }

                if (!password) {
                    showError('请输入密码');
                    passwordInput.focus();
                    return;
                }

                // Save configuration
                const config = {
                    username,
                    password,
                    startupDelay,
                    actionDelay,
                    // Keep backward compatibility
                    timeout: startupDelay
                };

                GM_setValue(CONFIG_KEY, config);
                GM_setValue(CONFIG_VERSION_KEY, CURRENT_CONFIG_VERSION);

                log('配置已保存');
                saveBtn.textContent = '✅ 已保存';
                saveBtn.disabled = true;

                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve(config);
                }, 800);
            }

            /**
             * Cancel configuration
             */
            function cancelConfig() {
                document.body.removeChild(overlay);
                resolve(null);
            }

            saveBtn.addEventListener('click', saveConfig);
            if (cancelBtn) {
                cancelBtn.addEventListener('click', cancelConfig);
            }

            // Press Enter to save
            [usernameInput, passwordInput, startupDelayInput, actionDelayInput].forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveConfig();
                    }
                });
            });

            // Focus on the first empty input field
            if (!usernameInput.value) {
                usernameInput.focus();
            } else if (!passwordInput.value) {
                passwordInput.focus();
            }
        });
    }

    /**
     * Get configuration from GM storage
     * @returns {Promise<Object|null>} The configuration object or null if cancelled
     */
    async function getConfig() {
        const configVersion = GM_getValue(CONFIG_VERSION_KEY, 0);
        let config = GM_getValue(CONFIG_KEY, null);

        // First run or incomplete configuration
        if (!config || !config.username || !config.password || configVersion < CURRENT_CONFIG_VERSION) {
            log('首次运行或配置不完整,显示配置弹窗...');
            config = await showConfigDialog(true);

            if (!config) {
                log('用户取消了配置,脚本将不会运行');
                return null;
            }
        }

        return config;
    }

    /**
     * Generic auto login handler
     * @param {Object} options - Login configuration options
     * @param {Object} config - User configuration (username, password, delays)
     */
    async function performAutoLogin(options, config) {
        const {
            formSelector,
            usernameSelector,
            passwordSelector,
            submitSelectors = [],
            siteName = 'Unknown'
        } = options;

        log(`Starting auto-login for ${siteName}...`);

        if (!config) {
            log('No configuration found, exiting.');
            return;
        }

        const { username, password, actionDelay = 100 } = config;

        // Wait for form
        const loginForm = await waitForElement(formSelector, 5000);
        if (!loginForm) {
            log(`Login form (${formSelector}) not found. Exiting.`);
            return;
        }

        // Wait for fields
        const usernameField = await waitForElement(usernameSelector, 3000);
        const passwordField = await waitForElement(passwordSelector, 3000);

        if (!usernameField || !passwordField) {
            log('Username or password field not found.');
            return;
        }

        if (usernameField.disabled || passwordField.disabled) {
            log('Fields are disabled, skipping.');
            return;
        }

        // Fill fields
        fillFieldWithEvents(usernameField, username);
        await sleep(actionDelay / 2);
        fillFieldWithEvents(passwordField, password);
        await sleep(actionDelay);

        // Trigger blur
        usernameField.dispatchEvent(new Event('blur', { bubbles: true }));
        passwordField.dispatchEvent(new Event('blur', { bubbles: true }));

        // Captcha check (specific to CAS)
        if (siteName === 'CAS') {
            const captchaImg = document.getElementById('captchaImg');
            if (captchaImg && captchaImg.querySelector('img')) {
                log('Captcha detected. Waiting for user...');
                return;
            }
        }

        await sleep(actionDelay);
        await submitForm(loginForm, submitSelectors);
    }

    /**
     * Auto login function for CAS (ids6.usst.edu.cn)
     * @param {Object} config - User configuration
     */
    async function autoLoginCAS(config) {
        await performAutoLogin({
            siteName: 'CAS',
            formSelector: '#casLoginForm',
            usernameSelector: '#username',
            passwordSelector: '#password'
        }, config);
    }

    /**
     * Auto login function for Courses (courses.usst.edu.cn)
     * @param {Object} config - User configuration
     */
    async function autoLoginCourses(config) {
        await performAutoLogin({
            siteName: 'Courses',
            formSelector: 'form',
            usernameSelector: 'input[name="userName"], #userName, input[type="text"]',
            passwordSelector: 'input[name="password"], #password, input[type="password"]',
            submitSelectors: ['.login-btn', 'button[type="submit"]']
        }, config);
    }

    /**
     * Wait for element to appear in DOM
     * @param {string} selector - CSS selector or comma-separated selectors
     * @param {number} timeout - Maximum time to wait in milliseconds
     * @returns {Promise<Element|null>} The element or null if timeout
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve) => {
            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return true;
                }
                return false;
            };

            if (check()) return;

            const observer = new MutationObserver(() => {
                if (check()) observer.disconnect();
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    /**
     * Fill field and trigger all related events
     * @param {HTMLInputElement} field - The input field to fill
     * @param {string} value - The value to set
     */
    function fillFieldWithEvents(field, value) {
        // Focus field
        field.focus();

        // Set value using native setter to bypass some framework protections
        try {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
            ).set;
            nativeInputValueSetter.call(field, value);
        } catch (e) {
            field.value = value;
        }

        // Trigger all related events
        const events = ['input', 'change', 'keydown', 'keyup'];
        events.forEach(eventType => {
            field.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
    }

    /**
     * Sleep for specified milliseconds
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise<void>}
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Submit the login form
     * @param {HTMLFormElement} loginForm - The login form element
     * @param {string[]} selectors - Optional selectors for the submit button
     */
    async function submitForm(loginForm, selectors = []) {
        log('Attempting to submit form...');

        let submitButton = null;

        // Try provided selectors first
        for (const selector of selectors) {
            submitButton = loginForm.querySelector(selector);
            if (submitButton) break;
        }

        // Fallback to default selectors if not found
        if (!submitButton) {
            submitButton = document.getElementById('login_submit')
                || loginForm.querySelector('button[type="submit"].auth_login_btn')
                || loginForm.querySelector('button[type="submit"]')
                || loginForm.querySelector('input[type="submit"]');
        }

        if (submitButton) {
            log(`Found submit button: ${submitButton.tagName}#${submitButton.id || '(no id)'}.${submitButton.className || '(no class)'}`);

            if (submitButton.disabled) {
                log('Submit button is disabled. Cannot submit.');
                return;
            }

            log('Clicking submit button...');
            submitButton.click();
        } else {
            log('Submit button not found. Attempting direct form submission...');
            const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true
            });

            if (loginForm.dispatchEvent(submitEvent)) {
                log('Submit event not prevented, calling form.submit()');
                loginForm.submit();
            } else {
                log('Submit event was prevented (validation may have failed)');
            }
        }
    }

    // Register menu command to allow users to modify configuration anytime
    GM_registerMenuCommand('⚙️ 修改登录配置', async () => {
        await showConfigDialog(false);
        log('配置已更新,请刷新页面使新配置生效');
    });

    // Main logic
    const SITE_CONFIGS = [
        {
            pattern: 'https://ids6.usst.edu.cn/authserver/login',
            handler: autoLoginCAS,
            name: 'CAS'
        },
        {
            pattern: 'https://courses.usst.edu.cn/auth/oauth/2.0/authorize',
            handler: autoLoginCourses,
            name: 'Courses'
        }
    ];

    log(`Current page URL: ${window.location.href}`);

    /**
     * Start auto-login with configured delay
     * @param {Function} loginFn - The login function to execute
     */
    async function startAutoLogin(loginFn) {
        // Get configuration only once
        const config = await getConfig();
        if (!config) {
            log('配置获取失败或用户取消配置，自动登录已终止');
            return;
        }

        log('配置已加载，准备开始自动登录');
        const startupDelay = config.startupDelay || 10;
        log(`Starting auto-login after ${startupDelay}ms delay...`);

        // Pass config to login function to avoid calling getConfig() again
        const executeLogin = () => loginFn(config);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(executeLogin, startupDelay));
        } else {
            setTimeout(executeLogin, startupDelay);
        }
    }

    // Check which login page we're on and execute appropriate handler
    const matchedSite = SITE_CONFIGS.find(site => window.location.href.startsWith(site.pattern));

    if (matchedSite) {
        log(`Matched ${matchedSite.name} login URL pattern. Proceeding.`);
        startAutoLogin(matchedSite.handler);
    } else {
        log(`URL does not match any known login pattern. Auto-login will not run on this page.`);
    }

})();

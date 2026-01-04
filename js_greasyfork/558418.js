// ==UserScript==
// @name         自动密码生成器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在检测到密码字段时，提供生成、填充和复制密码的功能
// @author       jwze
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/558418/%E8%87%AA%E5%8A%A8%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558418/%E8%87%AA%E5%8A%A8%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置和常量 ====================
    const PASSWORD_KEYWORDS = ['password', '密码', 'пароль', 'contraseña', 'senha', 'mot de passe', 'passwort'];

    // 内联SVG图标（钥匙图标）
    const ICON_SVG = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50">
            <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
    `)}`;

    // ==================== 全局变量 ====================
    let lastFocusedPasswordField = null;
    let currentLogoButton = null;
    let isPasswordFieldActive = false;
    let generatedPassword = '';

    // ==================== 样式注入 ====================
    GM_addStyle(`
        #ap-logo-button {
            position: absolute !important;
            width: 20px !important;
            height: 20px !important;
            cursor: pointer !important;
            z-index: 2147483647 !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            opacity: 0.8 !important;
            transition: opacity 0.2s !important;
            border: none !important;
            outline: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        #ap-logo-button:hover {
            opacity: 1 !important;
        }

        /* 设置面板样式 */
        #ap-settings-panel {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background-color: #ffffff !important;
            border: 1px solid #dcdcdc !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
            padding: 20px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            color: #333 !important;
            min-width: 320px !important;
            max-width: 400px !important;
            box-sizing: border-box !important;
            z-index: 2147483647 !important;
        }

        #ap-settings-panel h3 {
            margin: 0 0 16px 0 !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #333 !important;
            border-bottom: 1px solid #eee !important;
            padding-bottom: 12px !important;
        }

        #ap-settings-panel .ap-setting-row {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 12px !important;
            padding: 8px 0 !important;
        }

        #ap-settings-panel label {
            display: flex !important;
            align-items: center !important;
            cursor: pointer !important;
            color: #555 !important;
            font-weight: normal !important;
        }

        #ap-settings-panel input[type="checkbox"] {
            width: 16px !important;
            height: 16px !important;
            margin-right: 10px !important;
            cursor: pointer !important;
        }

        #ap-settings-panel input[type="number"] {
            width: 60px !important;
            padding: 6px 8px !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            margin-left: 10px !important;
        }

        #ap-settings-panel .ap-password-preview {
            background-color: #f5f5f5 !important;
            padding: 12px !important;
            border-radius: 6px !important;
            margin: 16px 0 !important;
            word-break: break-all !important;
            font-family: monospace !important;
            font-size: 14px !important;
            color: #007bff !important;
            text-align: center !important;
        }

        #ap-settings-panel .ap-btn-row {
            display: flex !important;
            gap: 10px !important;
            margin-top: 16px !important;
        }

        #ap-settings-panel button {
            flex: 1 !important;
            padding: 10px 16px !important;
            border: none !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            transition: background-color 0.2s !important;
        }

        #ap-settings-panel .ap-btn-primary {
            background-color: #4CAF50 !important;
            color: white !important;
        }

        #ap-settings-panel .ap-btn-primary:hover {
            background-color: #45a049 !important;
        }

        #ap-settings-panel .ap-btn-secondary {
            background-color: #f0f0f0 !important;
            color: #333 !important;
        }

        #ap-settings-panel .ap-btn-secondary:hover {
            background-color: #e0e0e0 !important;
        }

        #ap-settings-panel .ap-btn-danger {
            background-color: #f44336 !important;
            color: white !important;
        }

        #ap-settings-panel .ap-btn-danger:hover {
            background-color: #d32f2f !important;
        }

        /* 黑名单管理样式 */
        #ap-settings-panel .ap-blacklist-section {
            margin-top: 16px !important;
            padding-top: 16px !important;
            border-top: 1px solid #eee !important;
        }

        #ap-settings-panel .ap-blacklist-list {
            max-height: 150px !important;
            overflow-y: auto !important;
            border: 1px solid #eee !important;
            border-radius: 4px !important;
            margin: 8px 0 !important;
        }

        #ap-settings-panel .ap-blacklist-item {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 8px 12px !important;
            border-bottom: 1px solid #eee !important;
        }

        #ap-settings-panel .ap-blacklist-item:last-child {
            border-bottom: none !important;
        }

        #ap-settings-panel .ap-blacklist-item button {
            flex: none !important;
            padding: 4px 8px !important;
            font-size: 12px !important;
            background-color: #ff6b6b !important;
            color: white !important;
        }

        #ap-settings-panel .ap-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background-color: rgba(0,0,0,0.5) !important;
            z-index: 2147483646 !important;
        }
    `);

    // ==================== 存储管理 ====================
    function getSettings() {
        return {
            includeSymbols: GM_getValue('includeSymbols', true),
            length: GM_getValue('passwordLength', 16)
        };
    }

    function saveSettings(settings) {
        GM_setValue('includeSymbols', settings.includeSymbols);
        GM_setValue('passwordLength', settings.length);
    }

    function getBlacklist() {
        return GM_getValue('blacklist', []);
    }

    function addToBlacklist(domain) {
        const blacklist = getBlacklist();
        const mainDomain = domain.split('.').slice(-2).join('.');
        if (!blacklist.includes(mainDomain)) {
            blacklist.push(mainDomain);
            GM_setValue('blacklist', blacklist);
        }
    }

    function removeFromBlacklist(domain) {
        let blacklist = getBlacklist();
        blacklist = blacklist.filter(item => item !== domain);
        GM_setValue('blacklist', blacklist);
    }

    function isSiteBlacklisted() {
        const hostname = window.location.hostname;
        if (!hostname) return true;
        const blacklist = getBlacklist();
        return blacklist.some(domain => hostname.endsWith(domain));
    }

    // ==================== 密码生成 ====================
    function generateRandomPassword(options = {}) {
        const settings = getSettings();
        const includeSymbols = options.includeSymbols !== undefined ? options.includeSymbols : settings.includeSymbols;
        const length = options.length || settings.length;

        const alphaNum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
        const charset = includeSymbols ? alphaNum + symbols : alphaNum;

        let password = "";
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += charset.charAt(array[i] % charset.length);
        }
        return password;
    }

    // ==================== 密码框检测 ====================
    function checkAndMarkPasswordField(input) {
        if (!input || input.tagName !== 'INPUT' || input.readOnly) return false;

        if (input.getAttribute('data-ap-processed') === 'true') {
            return input.getAttribute('data-ap-is-password') === 'true';
        }

        input.setAttribute('data-ap-processed', 'true');
        const inputType = (input.type || 'text').toLowerCase();

        if (inputType === 'password') {
            input.setAttribute('data-ap-is-password', 'true');
            return true;
        }

        if (inputType === 'text') {
            const lowerPlaceholder = (input.placeholder || '').toLowerCase();
            const lowerAriaLabel = (input.getAttribute('aria-label') || '').toLowerCase();

            if (PASSWORD_KEYWORDS.some(kw => lowerPlaceholder.includes(kw) || lowerAriaLabel.includes(kw))) {
                input.setAttribute('data-ap-is-password', 'true');
                return true;
            }

            const label = input.id ? document.querySelector(`label[for="${input.id}"]`) : input.closest('label');
            if (label) {
                const lowerLabelText = (label.textContent || '').toLowerCase();
                if (PASSWORD_KEYWORDS.some(kw => lowerLabelText.includes(kw))) {
                    input.setAttribute('data-ap-is-password', 'true');
                    return true;
                }
            }
        }

        return false;
    }

    function scanForPasswordFields() {
        const inputs = document.querySelectorAll('input:not([data-ap-processed])');
        inputs.forEach(input => checkAndMarkPasswordField(input));
    }

    // ==================== Logo按钮 ====================
    function showLogoButton(inputField) {
        if (isSiteBlacklisted()) return;

        hideLogoButton();

        const button = document.createElement('div');
        button.id = 'ap-logo-button';
        button.title = '点击生成并填充密码';
        button.style.backgroundImage = `url("${ICON_SVG}")`;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 生成密码
            generatedPassword = generateRandomPassword();

            // 填充到输入框
            inputField.value = generatedPassword;
            inputField.dispatchEvent(new InputEvent('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));

            // 复制到剪贴板 - 使用 navigator.clipboard 作为主要方法
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(generatedPassword).then(() => {
                    console.log('密码已复制到剪贴板');
                }).catch(err => {
                    console.error('使用 navigator.clipboard 复制失败:', err);
                    fallbackCopy();
                });
            } else {
                fallbackCopy();
            }

            function fallbackCopy() {
                try {
                    GM_setClipboard(generatedPassword, 'text');
                    console.log('使用 GM_setClipboard 复制成功');
                } catch (err) {
                    console.error('GM_setClipboard 复制失败:', err);
                    // 最后的降级方案
                    const textArea = document.createElement('textarea');
                    textArea.value = generatedPassword;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    textArea.focus();
                    const success = document.execCommand('copy');
                    document.body.removeChild(textArea);

                    if (success) {
                        console.log('使用 execCommand 复制成功');
                    } else {
                        console.error('所有复制方法都失败了');
                    }
                }
            }

            // 隐藏按钮
            hideLogoButton();
        });

        document.body.appendChild(button);
        currentLogoButton = button;

        positionLogoButton(inputField);
    }

    function positionLogoButton(inputField) {
        if (!currentLogoButton || !inputField) return;

        const rect = inputField.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        currentLogoButton.style.left = `${rect.right + scrollX - 26}px`;
        currentLogoButton.style.top = `${rect.top + scrollY + (rect.height - 20) / 2}px`;
    }

    function hideLogoButton() {
        if (currentLogoButton) {
            currentLogoButton.remove();
            currentLogoButton = null;
        }
    }

    // ==================== 设置面板 ====================
    function showSettingsPanel() {
        // 移除已存在的面板
        const existingPanel = document.getElementById('ap-settings-panel');
        const existingOverlay = document.querySelector('.ap-overlay');
        if (existingPanel) existingPanel.remove();
        if (existingOverlay) existingOverlay.remove();

        const settings = getSettings();
        const blacklist = getBlacklist();
        const previewPassword = generateRandomPassword();

        // 创建遮罩
        const overlay = document.createElement('div');
        overlay.className = 'ap-overlay';

        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'ap-settings-panel';

        panel.innerHTML = `
            <h3>🔐 自动密码生成器 设置</h3>

            <div class="ap-setting-row">
                <label>
                    <input type="checkbox" id="ap-include-symbols" ${settings.includeSymbols ? 'checked' : ''}>
                    包含特殊符号
                </label>
            </div>

            <div class="ap-setting-row">
                <label>
                    密码长度:
                    <input type="number" id="ap-password-length" value="${settings.length}" min="8" max="64">
                </label>
            </div>

            <div class="ap-password-preview" id="ap-preview-password">${previewPassword}</div>

            <div class="ap-btn-row">
                <button class="ap-btn-secondary" id="ap-regenerate">重新生成</button>
                <button class="ap-btn-primary" id="ap-copy">复制密码</button>
            </div>

            <div class="ap-blacklist-section">
                <strong>黑名单管理</strong>
                <p style="font-size: 12px; color: #666; margin: 8px 0 !important;">以下网站不会显示密码生成按钮:</p>
                <div class="ap-blacklist-list" id="ap-blacklist-container">
                    ${blacklist.length === 0 ? '<div style="padding: 12px; color: #999; text-align: center;">黑名单为空</div>' :
                      blacklist.map(domain => `
                        <div class="ap-blacklist-item">
                            <span>${domain}</span>
                            <button data-domain="${domain}">移除</button>
                        </div>
                      `).join('')}
                </div>
                <button class="ap-btn-danger" id="ap-add-current-site" style="margin-top: 8px; width: 100%;">
                    将当前网站加入黑名单
                </button>
            </div>

            <div class="ap-btn-row" style="margin-top: 20px;">
                <button class="ap-btn-secondary" id="ap-close-settings">关闭</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // 事件绑定
        const includeSymbolsCheckbox = panel.querySelector('#ap-include-symbols');
        const passwordLengthInput = panel.querySelector('#ap-password-length');
        const previewEl = panel.querySelector('#ap-preview-password');
        const regenerateBtn = panel.querySelector('#ap-regenerate');
        const copyBtn = panel.querySelector('#ap-copy');
        const closeBtn = panel.querySelector('#ap-close-settings');
        const addCurrentSiteBtn = panel.querySelector('#ap-add-current-site');

        function updatePreview() {
            const newSettings = {
                includeSymbols: includeSymbolsCheckbox.checked,
                length: parseInt(passwordLengthInput.value, 10) || 16
            };
            saveSettings(newSettings);
            previewEl.textContent = generateRandomPassword(newSettings);
        }

        includeSymbolsCheckbox.addEventListener('change', updatePreview);
        passwordLengthInput.addEventListener('change', updatePreview);
        regenerateBtn.addEventListener('click', updatePreview);

        copyBtn.addEventListener('click', () => {
            GM_setClipboard(previewEl.textContent, 'text');
            copyBtn.textContent = '已复制!';
            setTimeout(() => { copyBtn.textContent = '复制密码'; }, 1500);
        });

        addCurrentSiteBtn.addEventListener('click', () => {
            addToBlacklist(window.location.hostname);
            hideLogoButton();
            showSettingsPanel(); // 刷新面板
        });

        // 黑名单移除按钮
        panel.querySelectorAll('.ap-blacklist-item button').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromBlacklist(btn.dataset.domain);
                showSettingsPanel(); // 刷新面板
            });
        });

        // 关闭
        const closePanel = () => {
            panel.remove();
            overlay.remove();
        };

        closeBtn.addEventListener('click', closePanel);
        overlay.addEventListener('click', closePanel);
    }

    // ==================== 事件监听 ====================
    document.addEventListener('focusin', (event) => {
        const target = event.target;
        if (checkAndMarkPasswordField(target)) {
            lastFocusedPasswordField = target;
            showLogoButton(target);
            isPasswordFieldActive = true;
        }
    }, true);

    document.addEventListener('focusout', (event) => {
        if (isPasswordFieldActive) {
            setTimeout(() => {
                if (document.activeElement && !checkAndMarkPasswordField(document.activeElement)) {
                    isPasswordFieldActive = false;
                    hideLogoButton();
                }
            }, 150);
        }
    }, true);

    // 监听滚动和窗口调整
    window.addEventListener('scroll', () => {
        if (currentLogoButton && lastFocusedPasswordField) {
            positionLogoButton(lastFocusedPasswordField);
        }
    }, true);

    window.addEventListener('resize', () => {
        if (currentLogoButton && lastFocusedPasswordField) {
            positionLogoButton(lastFocusedPasswordField);
        }
    });

    // ==================== 初始化 ====================
    // 扫描页面
    scanForPasswordFields();

    // MutationObserver 监视 DOM 变化
    const observer = new MutationObserver(() => scanForPasswordFields());
    observer.observe(document.body, { childList: true, subtree: true });

    // 注册油猴菜单命令
    GM_registerMenuCommand('⚙️ 打开设置', showSettingsPanel);
    GM_registerMenuCommand('🔑 生成并复制密码', () => {
        const password = generateRandomPassword();
        GM_setClipboard(password, 'text');
        alert('密码已生成并复制到剪贴板:\n\n' + password);
    });
    GM_registerMenuCommand('🚫 将当前网站加入黑名单', () => {
        addToBlacklist(window.location.hostname);
        hideLogoButton();
        alert('已将 ' + window.location.hostname + ' 加入黑名单');
    });

})();

// ==UserScript==
// @name         哒咩登录限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  这是一个限制登录的插件
// @author       大旭
// @match        http://223.244.92.218:18081/seeyon/main.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=92.218
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556224/%E5%93%92%E5%92%A9%E7%99%BB%E5%BD%95%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/556224/%E5%93%92%E5%92%A9%E7%99%BB%E5%BD%95%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        enabled: true,
        startHour: 11,
        startMinute: 0,
        endHour: 12,
        endMinute: 0,
        showNotification: true
    };

    // 获取配置
    function getConfig() {
        const saved = GM_getValue('timeConfig', defaultConfig);
        return {...defaultConfig, ...saved};
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue('timeConfig', config);
    }

    // 检查时间是否在配置的时间范围内
    function isInTimeRange(config) {
        if (!config.enabled) return true; // 如果功能禁用，则始终启用输入框

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // 当前时间总分钟数
        const currentMinutes = hours * 60 + minutes;
        // 开始时间的分钟数
        const startMinutes = config.startHour * 60 + config.startMinute;
        // 结束时间的分钟数
        const endMinutes = config.endHour * 60 + config.endMinute;

        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }

    // 设置输入框状态
    function setInputFieldsStatus() {
        const config = getConfig();
        const usernameInput = document.getElementById('login_username');
        const passwordInput = document.getElementById('login_password1');

        const isEnabled = isInTimeRange(config);

        if (usernameInput) {
            usernameInput.disabled = !isEnabled;
            if (config.enabled) {
                usernameInput.title = isEnabled ? '输入框已启用' : `只能在${config.startHour}:${config.startMinute.toString().padStart(2, '0')}-${config.endHour}:${config.endMinute.toString().padStart(2, '0')}之间使用`;
                usernameInput.style.opacity = isEnabled ? '1' : '0.6';
                usernameInput.style.backgroundColor = isEnabled ? '' : '#f0f0f0';
            } else {
                usernameInput.disabled = false;
                usernameInput.title = '时间限制功能已禁用';
                usernameInput.style.opacity = '1';
                usernameInput.style.backgroundColor = '';
            }
        }

        if (passwordInput) {
            passwordInput.disabled = !isEnabled;
            if (config.enabled) {
                passwordInput.title = isEnabled ? '输入框已启用' : `只能在${config.startHour}:${config.startMinute.toString().padStart(2, '0')}-${config.endHour}:${config.endMinute.toString().padStart(2, '0')}之间使用`;
                passwordInput.style.opacity = isEnabled ? '1' : '0.6';
                passwordInput.style.backgroundColor = isEnabled ? '' : '#f0f0f0';
            } else {
                passwordInput.disabled = false;
                passwordInput.title = '时间限制功能已禁用';
                passwordInput.style.opacity = '1';
                passwordInput.style.backgroundColor = '';
            }
        }

        // 显示状态提示
        if (config.showNotification) {
            showStatusMessage(isEnabled, config);
        }
    }

    // 显示状态提示
    function showStatusMessage(isEnabled, config) {
        // 移除旧提示
        const oldMessage = document.getElementById('time-range-message');
        if (oldMessage) {
            oldMessage.remove();
        }

        if (config.enabled && !isEnabled) {
            const message = document.createElement('div');
            message.id = 'time-range-message';
            message.innerHTML = `⚠️ 登录功能只能在 <strong>${config.startHour}:${config.startMinute.toString().padStart(2, '0')}-${config.endHour}:${config.endMinute.toString().padStart(2, '0')}</strong> 之间使用`;
            message.style.cssText = `
                position: fixed;
                top: 10px;
                right: 40px;
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                color: #856404;
                max-width: 300px;
            `;
            document.body.appendChild(message);
        }
    }

    // 创建配置面板
    function createConfigPanel() {
        const config = getConfig();

        const panel = document.createElement('div');
        panel.id = 'time-config-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: white;
            border: 2px solid #007cba;
            border-right: none;
            border-radius: 10px 0 0 10px;
            padding: 20px;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            z-index: 10001;
            width: 280px;
            transition: transform 0.3s ease;
            font-family: Arial, sans-serif;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #007cba;">时间限制配置</h3>
                <button id="close-config" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #666;">×</button>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="enable-feature" ${config.enabled ? 'checked' : ''} style="margin-right: 8px;">
                    启用时间限制功能
                </label>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">开始时间:</label>
                <div style="display: flex; gap: 10px;">
                    <select id="start-hour" style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                        ${Array.from({length: 24}, (_, i) =>
                            `<option value="${i}" ${i === config.startHour ? 'selected' : ''}>${i.toString().padStart(2, '0')}时</option>`
                        ).join('')}
                    </select>
                    <select id="start-minute" style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                        ${Array.from({length: 60}, (_, i) =>
                            `<option value="${i}" ${i === config.startMinute ? 'selected' : ''}>${i.toString().padStart(2, '0')}分</option>`
                        ).join('')}
                    </select>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">结束时间:</label>
                <div style="display: flex; gap: 10px;">
                    <select id="end-hour" style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                        ${Array.from({length: 24}, (_, i) =>
                            `<option value="${i}" ${i === config.endHour ? 'selected' : ''}>${i.toString().padStart(2, '0')}时</option>`
                        ).join('')}
                    </select>
                    <select id="end-minute" style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                        ${Array.from({length: 60}, (_, i) =>
                            `<option value="${i}" ${i === config.endMinute ? 'selected' : ''}>${i.toString().padStart(2, '0')}分</option>`
                        ).join('')}
                    </select>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="show-notification" ${config.showNotification ? 'checked' : ''} style="margin-right: 8px;">
                    显示状态提示
                </label>
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="save-config" style="flex: 1; padding: 10px; background: #007cba; color: white; border: none; border-radius: 5px; cursor: pointer;">保存</button>
                <button id="reset-config" style="flex: 1; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">重置</button>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; font-size: 12px; color: #666;">
                当前状态: <span id="current-status">${getCurrentStatusText(config)}</span>
            </div>
        `;

        document.body.appendChild(panel);

        // 事件监听
        document.getElementById('close-config').addEventListener('click', hideConfigPanel);
        document.getElementById('save-config').addEventListener('click', saveConfiguration);
        document.getElementById('reset-config').addEventListener('click', resetConfiguration);

        // 实时更新状态显示
        const inputs = panel.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', updateStatusDisplay);
        });

        return panel;
    }

    // 获取当前状态文本
    function getCurrentStatusText(config) {
        if (!config.enabled) {
            return '时间限制功能已禁用';
        }

        const isInRange = isInTimeRange(config);
        const startTime = `${config.startHour}:${config.startMinute.toString().padStart(2, '0')}`;
        const endTime = `${config.endHour}:${config.endMinute.toString().padStart(2, '0')}`;

        return isInRange ?
            `✅ 输入框已启用 (${startTime}-${endTime})` :
            `❌ 输入框已禁用 (仅限 ${startTime}-${endTime})`;
    }

    // 更新状态显示
    function updateStatusDisplay() {
        const config = getConfigFromForm();
        const statusElement = document.getElementById('current-status');
        if (statusElement) {
            statusElement.textContent = getCurrentStatusText(config);
        }
    }

    // 从表单获取配置
    function getConfigFromForm() {
        return {
            enabled: document.getElementById('enable-feature').checked,
            startHour: parseInt(document.getElementById('start-hour').value),
            startMinute: parseInt(document.getElementById('start-minute').value),
            endHour: parseInt(document.getElementById('end-hour').value),
            endMinute: parseInt(document.getElementById('end-minute').value),
            showNotification: document.getElementById('show-notification').checked
        };
    }

    // 保存配置
    function saveConfiguration() {
        const config = getConfigFromForm();
        saveConfig(config);
        setInputFieldsStatus();
        hideConfigPanel();
        showTempMessage('配置已保存！');
    }

    // 重置配置
    function resetConfiguration() {
        saveConfig(defaultConfig);
        setInputFieldsStatus();
        hideConfigPanel();
        showTempMessage('配置已重置为默认值！');
        // 重新打开配置面板显示默认值
        setTimeout(showConfigPanel, 500);
    }

    // 显示临时消息
    function showTempMessage(message) {
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10002;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }

    // 显示配置面板
    function showConfigPanel() {
        let panel = document.getElementById('time-config-panel');
        if (!panel) {
            panel = createConfigPanel();
        }
        panel.style.transform = 'translateY(-50%)';
    }

    // 隐藏配置面板
    function hideConfigPanel() {
        const panel = document.getElementById('time-config-panel');
        if (panel) {
            panel.style.transform = 'translateX(100%) translateY(-50%)';
            setTimeout(() => {
                if (panel && panel.parentNode) {
                    panel.parentNode.removeChild(panel);
                }
            }, 300);
        }
    }

    // 创建配置按钮
    function createConfigButton() {
        const button = document.createElement('button');
        button.innerHTML = '⚙️';
        button.title = '时间限制配置';
        button.style.cssText = `
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 50% 0 0 50%;
            cursor: pointer;
            z-index: 10000;
            font-size: 18px;
            box-shadow: -2px 0 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', function() {
            this.style.width = '45px';
            this.style.background = '#005a87';
        });

        button.addEventListener('mouseleave', function() {
            this.style.width = '40px';
            this.style.background = '#007cba';
        });

        button.addEventListener('click', showConfigPanel);

        document.body.appendChild(button);
        return button;
    }

    // 初始化函数
    function init() {
        // 创建配置按钮
        createConfigButton();

        // 立即设置一次状态
        setInputFieldsStatus();

        // 每分钟检查一次时间
        setInterval(setInputFieldsStatus, 60000);

        // 监听动态内容加载
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    setTimeout(setInputFieldsStatus, 100);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 注册油猴菜单命令
        GM_registerMenuCommand('时间限制配置', showConfigPanel);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        input:disabled {
            cursor: not-allowed;
        }
        #time-range-message strong {
            color: #d63031;
        }
        #time-config-panel input[type="checkbox"] {
            width: auto;
        }
        #time-config-panel select:focus {
            outline: none;
            border-color: #007cba;
        }
        #time-config-panel button:hover {
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);

})();
// ==UserScript==
// @name         Linux.do 自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通用 Linux.do 自动登录脚本，支持动态加载按钮和授权页面自动跳转。
// @author       bettermanxyz
// @match        *://*/*
// @match        https://connect.linux.do/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547835/Linuxdo%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/547835/Linuxdo%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项和菜单命令 ---
    const SCRIPT_PREFIX = 'LinuxDO_AutoLogin_';
    const CONFIG_KEYS = {
        ENABLE_TOAST: SCRIPT_PREFIX + 'enableToast',
        ENABLE_CLICK_BUTTON: SCRIPT_PREFIX + 'enableClickButton',
        ENABLE_REDIRECT: SCRIPT_PREFIX + 'enableRedirect'
    };

    // 获取或设置配置的默认值
    let enableToast = GM_getValue(CONFIG_KEYS.ENABLE_TOAST, true);
    let enableClickButton = GM_getValue(CONFIG_KEYS.ENABLE_CLICK_BUTTON, true);
    let enableRedirect = GM_getValue(CONFIG_KEYS.ENABLE_REDIRECT, true);

    // 注册菜单命令
    // 注册一个用于打开设置面板的菜单命令
    GM_registerMenuCommand('⚙️ Linux.do 自动登录设置', toggleSettingsPanel);

    // 气泡提示函数
    function showToast(message, duration = 3000) {
        if (!enableToast) return;

        const existingToast = document.getElementById('linuxdo-autologin-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'linuxdo-autologin-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            text-align: center;
            white-space: nowrap;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        void toast.offsetWidth;
        toast.style.opacity = '1';

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }

    // --- 设置面板 UI 和逻辑 ---
    let settingsPanel = null;

    function createSettingsPanel() {
        if (settingsPanel) {
            settingsPanel.remove();
        }

        settingsPanel = document.createElement('div');
        settingsPanel.id = 'linuxdo-autologin-settings-panel';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            background-color: #f0f0f0; /* 莫兰迪浅蓝色基调 */
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #333;
            z-index: 100000;
            padding: 20px;
            box-sizing: border-box;
            display: none; /* 默认隐藏 */
        `;

        settingsPanel.innerHTML = `
            <style>
                .linuxdo-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .linuxdo-panel-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                }
                .linuxdo-panel-close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #888;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                }
                .linuxdo-setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #eee;
                }
                .linuxdo-setting-item:last-child {
                    border-bottom: none;
                }
                .linuxdo-setting-label {
                    font-size: 15px;
                    color: #333;
                }
                .linuxdo-switch {
                    width: 44px;
                    height: 24px;
                    border-radius: 12px;
                    background-color: #e0e0e0; /* 灰色背景 */
                    position: relative;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .linuxdo-switch.on {
                    background-color: #4CAF50; /* 绿色 */
                }
                .linuxdo-switch.off {
                    background-color: #F44336; /* 红色 */
                }
                .linuxdo-switch-handle {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: white;
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    transition: transform 0.3s;
                }
                .linuxdo-switch.on .linuxdo-switch-handle {
                    transform: translateX(20px);
                }
            </style>
            <div class="linuxdo-panel-header">
                <span class="linuxdo-panel-title">Linux.do 自动登录设置</span>
                <button class="linuxdo-panel-close-btn" id="linuxdo-panel-close-btn">×</button>
            </div>
            <div class="linuxdo-settings-list">
                <div class="linuxdo-setting-item">
                    <span class="linuxdo-setting-label">气泡提示</span>
                    <div class="linuxdo-switch" id="switch-enableToast">
                        <div class="linuxdo-switch-handle"></div>
                    </div>
                </div>
                <div class="linuxdo-setting-item">
                    <span class="linuxdo-setting-label">点击登录按钮</span>
                    <div class="linuxdo-switch" id="switch-enableClickButton">
                        <div class="linuxdo-switch-handle"></div>
                    </div>
                </div>
                <div class="linuxdo-setting-item">
                    <span class="linuxdo-setting-label">自动跳转授权</span>
                    <div class="linuxdo-switch" id="switch-enableRedirect">
                        <div class="linuxdo-switch-handle"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(settingsPanel);

        // 添加事件监听器
        document.getElementById('linuxdo-panel-close-btn').addEventListener('click', toggleSettingsPanel);
        document.getElementById('switch-enableToast').addEventListener('click', () => toggleSetting(CONFIG_KEYS.ENABLE_TOAST));
        document.getElementById('switch-enableClickButton').addEventListener('click', () => toggleSetting(CONFIG_KEYS.ENABLE_CLICK_BUTTON));
        document.getElementById('switch-enableRedirect').addEventListener('click', () => toggleSetting(CONFIG_KEYS.ENABLE_REDIRECT));

        updatePanelSwitchState();
    }

    function updatePanelSwitchState() {
        if (!settingsPanel) return;

        const toastSwitch = settingsPanel.querySelector('#switch-enableToast');
        const clickSwitch = settingsPanel.querySelector('#switch-enableClickButton');
        const redirectSwitch = settingsPanel.querySelector('#switch-enableRedirect');

        enableToast = GM_getValue(CONFIG_KEYS.ENABLE_TOAST, true);
        enableClickButton = GM_getValue(CONFIG_KEYS.ENABLE_CLICK_BUTTON, true);
        enableRedirect = GM_getValue(CONFIG_KEYS.ENABLE_REDIRECT, true);

        if (enableToast) toastSwitch.classList.add('on'); else toastSwitch.classList.remove('on');
        if (enableClickButton) clickSwitch.classList.add('on'); else clickSwitch.classList.remove('on');
        if (enableRedirect) redirectSwitch.classList.add('on'); else redirectSwitch.classList.remove('on');
    }

    function toggleSetting(key) {
        let currentValue = GM_getValue(key, true);
        GM_setValue(key, !currentValue);
        updatePanelSwitchState(); // 更新面板显示
        showToast(`设置已更新: ${key.replace(SCRIPT_PREFIX, '')} ${!currentValue ? '开启' : '关闭'}`);
    }

    function toggleSettingsPanel() {
        if (!settingsPanel) {
            createSettingsPanel();
        }
        if (settingsPanel.style.display === 'none') {
            settingsPanel.style.display = 'block';
            updatePanelSwitchState(); // 每次打开时更新状态
        } else {
            settingsPanel.style.display = 'none';
        }
    }

    function clickLinuxDOButton() {
        if (!GM_getValue(CONFIG_KEYS.ENABLE_CLICK_BUTTON, true)) return false;

        const loginButton = Array.from(document.querySelectorAll('button span')).find(span => span.textContent.includes('使用 LinuxDO 继续'));
        if (loginButton) {
            showToast('找到 LinuxDO 按钮，点击中...');
            loginButton.closest('button').click();
            return true;
        }
        return false;
    }

    // 立即尝试点击按钮
    if (!window.location.hostname.includes('connect.linux.do')) {
        if (!clickLinuxDOButton()) {
            const observer = new MutationObserver((mutations, obs) => {
                if (clickLinuxDOButton()) {
                    obs.disconnect();
                    showToast('通过监听点击了按钮。');
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    } else { // 当前页面是 connect.linux.do
        if (GM_getValue(CONFIG_KEYS.ENABLE_REDIRECT, true)) {
            const allowLink = Array.from(document.querySelectorAll('a.bg-red-500')).find(a => a.textContent.trim() === '允许');

            if (allowLink && allowLink.href) {
                showToast('找到“允许”链接，跳转中...');
                window.location.href = allowLink.href;
            } else {
                showToast('未找到“允许”链接。');
            }
        } else {
            showToast('自动跳转授权已关闭。');
        }
    }
})();
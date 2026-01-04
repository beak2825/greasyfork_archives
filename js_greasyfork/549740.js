// ==UserScript==
// @name         通用自动填充助手(按需版3.0)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  智能填充各种网站的邮箱和密码字段，按需在特定网站激活，持久化保存激活状态
// @author       yaya
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://cdn-icons-png.flaticon.com/512/2977/2977425.png
// @downloadURL https://update.greasyfork.org/scripts/549740/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B%28%E6%8C%89%E9%9C%80%E7%89%8830%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549740/%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B%28%E6%8C%89%E9%9C%80%E7%89%8830%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==============================
    // 配置中心 - 在这里添加新网站配置
    // ==============================
    const siteConfigs = [
        // 港英云配置
        {
            name: '港英云',
            urlPattern: /港英云/,
            fields: {
                email: {
                    selector: 'input[placeholder="邮箱"]',
                    events: ['input', 'change', 'blur', 'keydown', 'keyup']
                },
                password: {
                    selector: 'input[placeholder="密码"][type="password"]',
                    events: ['input', 'change', 'blur', 'keydown', 'keyup']
                }
            },
            loginButton: 'button.n-button--primary-type'
        },
        // 通用配置 (作为后备)
        {
            name: '通用配置',
            urlPattern: /.*/,
            fields: {
                email: {
                    selector: 'input[type="email"], input[id*="email"], input[name*="email"], input[placeholder*="邮箱"]',
                    events: ['input', 'change']
                },
                password: {
                    selector: 'input[type="password"], input[id*="password"], input[name*="password"], input[placeholder*="密码"]',
                    events: ['input', 'change']
                }
            },
            loginButton: 'button[type="submit"], #login-btn, .login-button'
        }
    ];

    // ==============================
    // 用户信息
    // ==============================
    const USER_EMAIL = GM_getValue('user_email', 'xxx@example.com');
    const USER_PASSWORD = GM_getValue('user_password', 'xxx');

    // ==============================
    // 持久化激活的网站列表
    // ==============================
    let activatedSites = GM_getValue('activatedSites', []);

    // **检查当前网站是否已激活**
    function isSiteActivated() {
        const currentDomain = location.hostname;
        return activatedSites.includes(currentDomain);
    }

    // **添加当前网站到激活列表**
    function activateSite() {
        const currentDomain = location.hostname;
        if (!activatedSites.includes(currentDomain)) {
            activatedSites.push(currentDomain);
            GM_setValue('activatedSites', activatedSites);
            console.log(`已激活网站: ${currentDomain}`);
        }
    }

    // ==============================
    // 核心功能
    // ==============================

    // **增强填充函数** - 填充输入框并触发事件
    function enhancedFillInput(selector, value, events = ['input', 'change']) {
        let filled = false;
        try {
            const inputs = document.querySelectorAll(selector);
            if (inputs.length > 0) {
                inputs.forEach(input => {
                    input.value = value;
                    events.forEach(eventType => {
                        const event = new Event(eventType, { bubbles: true, cancelable: true });
                        input.dispatchEvent(event);
                    });
                    console.log(`填充成功: ${selector}`, value);
                    filled = true;
                });
            }
        } catch (e) {
            console.error(`填充错误: ${selector}`, e);
        }
        return filled;
    }

    // **获取当前网站配置** - 优先匹配特定配置，否则使用通用配置
    function getCurrentSiteConfig() {
        const specificConfig = siteConfigs.find(config =>
            config.urlPattern.test(document.title) ||
            config.urlPattern.test(location.href)
        );
        if (specificConfig && specificConfig.name !== '通用配置') {
            return specificConfig;
        }
        return siteConfigs.find(config => config.name === '通用配置');
    }

    // **自动填充主函数** - 执行填充并尝试登录
    function autoFill() {
        const config = getCurrentSiteConfig();
        if (!config) return {success: false, message: '未找到匹配的网站配置'};

        let results = {
            email: false,
            password: false,
            configName: config.name
        };

        if (config.fields.email) {
            results.email = enhancedFillInput(
                config.fields.email.selector,
                USER_EMAIL,
                config.fields.email.events
            );
        }

        if (config.fields.password) {
            results.password = enhancedFillInput(
                config.fields.password.selector,
                USER_PASSWORD,
                config.fields.password.events
            );
        }

        if (config.loginButton && results.email && results.password) {
            setTimeout(() => {
                const loginBtn = document.querySelector(config.loginButton);
                if (loginBtn) {
                    loginBtn.click();
                    console.log('已尝试点击登录按钮');
                }
            }, 800);
        }

        return results;
    }

    // **创建控制面板**
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'universal-fill-panel';
        panel.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            padding: 10px 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-width: 120px;
            max-width: 180px;
            transition: all 0.3s;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <h3 style="margin:0; font-size: 14px; color: #2c3e50; font-weight: 500;">
                    <span style="background: #3498db; color: white; border-radius: 3px; padding: 1px 4px; font-size: 12px;">填充助手</span>
                </h3>
                <button id="close-panel" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #95a5a6; line-height: 1;">×</button>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <button id="fill-btn" style="flex:1; background: #3498db; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer; font-size: 12px; min-width: 60px;">
                    填充
                </button>
                <button id="add-config-btn" style="flex:1; background: #9b59b6; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer; font-size: 12px; min-width: 60px;">
                    添加配置
                </button>
            </div>
            <div style="font-size: 11px; color: #7f8c8d; margin-top: 5px; text-align: center;">
                <span id="fill-status">就绪</span>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        document.getElementById('fill-btn').addEventListener('click', () => {
            updateStatus('填充中...', '#e67e22');
            setTimeout(executeFill, 300);
        });

        document.getElementById('add-config-btn').addEventListener('click', showAddSiteGuide);
    }

    // **执行填充操作**
    function executeFill() {
        const statusEl = document.getElementById('fill-status');
        try {
            const results = autoFill();
            if (results.email && results.password) {
                updateStatus('填充成功!', '#27ae60');
            } else {
                let message = '部分填充: ';
                if (!results.email) message += '邮箱 ';
                if (!results.password) message += '密码 ';
                updateStatus(message, '#e74c3c');
            }
        } catch (e) {
            updateStatus(`错误: ${e.message}`, '#e74c3c');
            console.error('填充错误:', e);
        }
    }

    // **更新状态显示**
    function updateStatus(message, color = '#34495e') {
        const statusEl = document.getElementById('fill-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.color = color;
        }
    }

    // **显示添加新网站指南**
    function showAddSiteGuide() {
        const panel = document.getElementById('universal-fill-panel');
        panel.innerHTML = `
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h3 style="margin:0; font-size: 14px; color: #2c3e50;">
                        ✏️ 添加新配置
                    </h3>
                    <button id="back-btn" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #95a5a6; line-height: 1;">←</button>
                </div>
                <div style="font-size: 11px; color: #34495e; line-height: 1.4; margin-bottom: 10px;">
                    1. 按 <strong>F12</strong> 打开开发者工具<br>
                    2. 使用选择器工具查找字段<br>
                    3. 右键元素 → 复制选择器
                </div>
                <div style="font-size: 11px; margin-bottom: 5px;">
                    <strong>配置模板:</strong>
                </div>
                <textarea id="config-template" style="width: 100%; height: 160px; font-family: monospace; font-size: 11px; padding: 6px; border-radius: 4px; border: 1px solid #ddd; resize: vertical;">
{
    name: '网站名称',
    urlPattern: /网站URL特征/,
    fields: {
        email: { selector: '...' },
        password: { selector: '...' }
    },
    loginButton: '...'
}</textarea>
                <div style="display: flex; gap: 6px; margin-top: 8px;">
                    <button id="copy-config-btn" style="flex:1; background: #9b59b6; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer; font-size: 11px;">
                        复制模板
                    </button>
                </div>
            </div>
        `;

        document.getElementById('back-btn').addEventListener('click', () => {
            panel.innerHTML = '';
            createControlPanel();
        });

        document.getElementById('copy-config-btn').addEventListener('click', () => {
            const textarea = document.getElementById('config-template');
            textarea.select();
            document.execCommand('copy');
            alert('配置模板已复制到剪贴板');
        });
    }

    // **注册Tampermonkey菜单命令**
    GM_registerMenuCommand('激活填充助手', () => {
        if (document.getElementById('universal-fill-panel')) {
            alert('填充助手已在当前网站激活');
            return;
        }
        activateSite();
        createControlPanel();
        alert('填充助手已激活并保存');
    });

    GM_registerMenuCommand('取消激活当前网站', () => {
        const currentDomain = location.hostname;
        if (!activatedSites.includes(currentDomain)) {
            alert('当前网站未激活填充助手');
            return;
        }
        activatedSites = activatedSites.filter(site => site !== currentDomain);
        GM_setValue('activatedSites', activatedSites);
        const panel = document.getElementById('universal-fill-panel');
        if (panel) {
            panel.remove();
        }
        alert(`已取消激活 ${currentDomain}`);
    });

    GM_registerMenuCommand('设置邮箱', () => {
        const newEmail = prompt('请输入邮箱:', USER_EMAIL);
        if (newEmail) {
            GM_setValue('user_email', newEmail);
            alert('邮箱已更新!');
        }
    });

    GM_registerMenuCommand('设置密码', () => {
        const newPassword = prompt('请输入密码:', USER_PASSWORD);
        if (newPassword) {
            GM_setValue('user_password', newPassword);
            alert('密码已更新!');
        }
    });

    // **初始化**
    window.addEventListener('load', () => {
        if (isSiteActivated()) {
            setTimeout(() => {
                if (!document.getElementById('universal-fill-panel')) {
                    createControlPanel();
                }
            }, 1500);
        } else {
            console.log('填充助手未激活，请通过Tampermonkey菜单激活');
        }
    });
})();
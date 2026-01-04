// ==UserScript==
// @name         JavaScript 控制器 (简化版)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  仅在需要的网页中启用JavaScript控制器，支持快捷键激活
// @author       Your Name
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560029/JavaScript%20%E6%8E%A7%E5%88%B6%E5%99%A8%20%28%E7%AE%80%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560029/JavaScript%20%E6%8E%A7%E5%88%B6%E5%99%A8%20%28%E7%AE%80%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当前网站域名
    const currentDomain = location.hostname;
    
    // 设置键名
    const ENABLED_DOMAINS_KEY = 'js_controller_enabled_domains';
    const DISABLED_SCRIPTS_KEY = 'js_disabled_scripts';
    
    // 添加自定义CSS样式
    GM_addStyle(`
        #js-controller-toggle {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 999998;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            opacity: 0.8;
        }
        
        #js-controller-toggle:hover {
            background: #45a049;
            transform: scale(1.1);
            opacity: 1;
        }
        
        #js-controller-toggle.hidden {
            display: none;
        }
        
        #js-controller-ui {
            position: fixed;
            top: 60px;
            right: 10px;
            background: white;
            border: 1px solid #ccc;
            padding: 15px;
            z-index: 999999;
            width: 450px;
            max-height: 85vh;
            overflow: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        #js-controller-ui.hidden {
            display: none;
        }
        
        .js-controller-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .js-controller-title {
            margin: 0;
            color: #333;
            font-size: 16px;
            font-weight: 600;
        }
        
        .js-controller-close {
            background: #ff5252;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        
        .js-controller-close:hover {
            background: #ff0000;
            transform: scale(1.1);
        }
        
        .activation-status {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .activation-status h3 {
            margin: 0 0 8px 0;
            color: white;
            font-size: 14px;
        }
        
        .activation-buttons {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin-top: 10px;
        }
        
        .activation-btn {
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            transition: all 0.2s ease;
            font-weight: 500;
        }
        
        .activation-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
        
        .activation-btn.primary {
            background: #4CAF50;
        }
        
        .activation-btn.primary:hover {
            background: #45a049;
        }
        
        .activation-btn.danger {
            background: #f44336;
        }
        
        .activation-btn.danger:hover {
            background: #d32f2f;
        }
        
        .shortcut-info {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 12px;
            color: #555;
            border-left: 4px solid #2196F3;
        }
        
        .shortcut-info kbd {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Consolas', monospace;
            font-size: 11px;
            border: 1px solid #ced4da;
            box-shadow: 0 1px 1px rgba(0,0,0,0.1);
        }
        
        .script-item {
            padding: 12px;
            margin: 8px 0;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            background: #fafafa;
            transition: all 0.2s ease;
        }
        
        .script-item.disabled {
            background: #fff5f5;
            border-color: #ffcdd2;
        }
        
        .script-item:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transform: translateY(-1px);
        }
        
        .script-info {
            margin-bottom: 10px;
        }
        
        .script-type {
            display: inline-block;
            padding: 3px 8px;
            background: #e3f2fd;
            color: #1976d2;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 8px;
        }
        
        .script-url {
            font-size: 12px;
            color: #666;
            word-break: break-all;
            margin-top: 6px;
            line-height: 1.4;
        }
        
        .script-content {
            font-size: 11px;
            color: #666;
            font-family: 'Consolas', monospace;
            margin-top: 6px;
            background: #f5f5f5;
            padding: 6px;
            border-radius: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            max-height: 40px;
            border: 1px solid #eee;
        }
        
        .script-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }
        
        .script-btn {
            padding: 5px 12px;
            font-size: 12px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            transition: all 0.2s ease;
            font-weight: 500;
        }
        
        .script-btn.enable {
            background: #4CAF50;
            color: white;
        }
        
        .script-btn.disable {
            background: #ff9800;
            color: white;
        }
        
        .script-btn.remove {
            background: #f44336;
            color: white;
        }
        
        .script-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .global-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .global-btn {
            flex: 1;
            min-width: 80px;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            border: none;
            border-radius: 6px;
            background: #607d8b;
            color: white;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .global-btn:hover {
            background: #546e7a;
            transform: translateY(-1px);
        }
        
        .global-btn.primary {
            background: #2196F3;
        }
        
        .global-btn.primary:hover {
            background: #0b7dda;
        }
        
        .global-btn.danger {
            background: #f44336;
        }
        
        .global-btn.danger:hover {
            background: #d32f2f;
        }
        
        .stats {
            font-size: 12px;
            color: #666;
            margin-top: 12px;
            text-align: center;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 6px;
            font-weight: 500;
        }
        
        .drag-handle {
            position: absolute;
            top: 5px;
            left: 5px;
            width: 24px;
            height: 24px;
            cursor: move;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        .tab-container {
            display: flex;
            border-bottom: 1px solid #eee;
            margin-bottom: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            padding: 4px;
        }
        
        .tab {
            flex: 1;
            padding: 8px 12px;
            text-align: center;
            cursor: pointer;
            background: transparent;
            border: none;
            font-size: 13px;
            font-weight: 500;
            color: #666;
            transition: all 0.2s ease;
            border-radius: 4px;
        }
        
        .tab:hover {
            background: #e9ecef;
            color: #333;
        }
        
        .tab.active {
            background: #2196F3;
            color: white;
            box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .domains-list {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 10px;
            border: 1px solid #eee;
            border-radius: 6px;
        }
        
        .domain-list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.2s ease;
        }
        
        .domain-list-item:last-child {
            border-bottom: none;
        }
        
        .domain-list-item:hover {
            background: #f8f9fa;
        }
        
        .domain-list-name {
            font-size: 13px;
            color: #333;
            font-weight: 500;
        }
        
        .domain-list-remove {
            font-size: 11px;
            padding: 3px 8px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .domain-list-remove:hover {
            background: #d32f2f;
            transform: scale(1.05);
        }
        
        .empty-state {
            text-align: center;
            padding: 30px 20px;
            color: #999;
        }
        
        .empty-state i {
            font-size: 24px;
            margin-bottom: 10px;
            display: block;
        }
        
        @media (max-width: 500px) {
            #js-controller-ui {
                width: 95vw;
                right: 2.5vw;
                left: 2.5vw;
            }
        }
    `);

    // 全局变量
    let isControllerActive = false;
    let disabledScripts = [];
    let allScripts = [];
    let isMonitoring = true;
    let isPanelVisible = false;
    
    // 存储原始方法
    const originalMethods = {
        createElement: document.createElement,
        setAttribute: Element.prototype.setAttribute,
        src: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src'),
        text: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'text')
    };

    // 加载设置
    function loadSettings() {
        // 检查当前网站是否已启用控制器
        const enabledDomains = JSON.parse(GM_getValue(ENABLED_DOMAINS_KEY, '[]'));
        const isDomainEnabled = enabledDomains.includes(currentDomain);
        
        // 检查是否有临时激活记录
        const tempActivated = sessionStorage.getItem(`js_temp_activated_${currentDomain}`);
        
        isControllerActive = isDomainEnabled || tempActivated === 'true';
        
        // 加载禁用脚本列表
        const allDisabledScripts = JSON.parse(GM_getValue(DISABLED_SCRIPTS_KEY, '{}'));
        disabledScripts = allDisabledScripts[currentDomain] || [];
    }
    
    // 保存设置
    function saveSettings() {
        // 保存禁用脚本列表
        const allDisabledScripts = JSON.parse(GM_getValue(DISABLED_SCRIPTS_KEY, '{}'));
        allDisabledScripts[currentDomain] = disabledScripts;
        GM_setValue(DISABLED_SCRIPTS_KEY, JSON.stringify(allDisabledScripts));
    }
    
    // 初始化设置
    loadSettings();
    
    // 拦截脚本创建（仅当控制器激活时）
    if (isControllerActive) {
        setupScriptInterception();
    }

    // 设置脚本拦截
    function setupScriptInterception() {
        document.createElement = function(...args) {
            const element = originalMethods.createElement.apply(this, args);
            
            if (args[0].toLowerCase() === 'script' && isMonitoring) {
                return createScriptProxy(element);
            }
            
            return element;
        };
    }

    // 创建脚本代理
    function createScriptProxy(scriptElement) {
        return new Proxy(scriptElement, {
            set(target, property, value) {
                if (property === 'src' && value && isMonitoring) {
                    const scriptInfo = {
                        type: '外部脚本',
                        url: value,
                        id: generateId(),
                        disabled: isScriptDisabled(value),
                        timestamp: Date.now()
                    };
                    allScripts.push(scriptInfo);
                    updateUI();
                    
                    if (scriptInfo.disabled) {
                        return true; // 阻止设置src
                    }
                }
                
                if (property === 'innerHTML' && isMonitoring && typeof value === 'string' && value.trim()) {
                    const scriptInfo = {
                        type: '内联脚本',
                        content: value.length > 150 ? value.substring(0, 150) + '...' : value,
                        id: generateId(),
                        disabled: isScriptDisabled(value),
                        timestamp: Date.now()
                    };
                    allScripts.push(scriptInfo);
                    updateUI();
                    
                    if (scriptInfo.disabled) {
                        return true; // 阻止设置innerHTML
                    }
                }
                
                return originalMethods.setAttribute ? 
                    target.setAttribute(property, value) :
                    Reflect.set(target, property, value);
            },

            get(target, property) {
                if (property === 'src' && isMonitoring) {
                    const src = originalMethods.src.get.call(target);
                    if (src && isScriptDisabled(src)) {
                        return ''; // 返回空字符串禁用
                    }
                }
                if (property === 'text' && isMonitoring) {
                    const text = originalMethods.text.get.call(target);
                    if (text && isScriptDisabled(text)) {
                        return ''; // 返回空字符串禁用
                    }
                }
                return Reflect.get(target, property);
            }
        });
    }

    // 生成唯一ID
    function generateId() {
        return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // 检查脚本是否被禁用
    function isScriptDisabled(identifier) {
        return disabledScripts.some(disabled => {
            if (!identifier || !disabled) return false;
            try {
                return identifier.includes(disabled) || disabled.includes(identifier) ||
                       new RegExp(disabled).test(identifier);
            } catch (e) {
                return identifier.includes(disabled) || disabled.includes(identifier);
            }
        });
    }

    // 在当前页面启用控制器
    function enableForCurrentPage(temporary = false) {
        if (isControllerActive) {
            showNotification('控制器已启用');
            showPanel();
            return;
        }
        
        isControllerActive = true;
        
        if (temporary) {
            // 临时激活（仅本次会话）
            sessionStorage.setItem(`js_temp_activated_${currentDomain}`, 'true');
        } else {
            // 永久激活（添加到启用列表）
            const enabledDomains = JSON.parse(GM_getValue(ENABLED_DOMAINS_KEY, '[]'));
            if (!enabledDomains.includes(currentDomain)) {
                enabledDomains.push(currentDomain);
                GM_setValue(ENABLED_DOMAINS_KEY, JSON.stringify(enabledDomains));
            }
        }
        
        // 设置脚本拦截
        setupScriptInterception();
        
        // 创建UI
        createUI();
        
        // 捕获已存在的脚本
        captureExistingScripts();
        
        // 显示面板
        showPanel();
        
        showNotification(`JavaScript控制器已${temporary ? '临时' : '永久'}启用`, 'success');
    }

    // 在当前页面禁用控制器
    function disableForCurrentPage() {
        if (!isControllerActive) {
            showNotification('控制器未启用');
            return;
        }
        
        isControllerActive = false;
        
        // 从启用列表中移除
        const enabledDomains = JSON.parse(GM_getValue(ENABLED_DOMAINS_KEY, '[]'));
        const index = enabledDomains.indexOf(currentDomain);
        if (index > -1) {
            enabledDomains.splice(index, 1);
            GM_setValue(ENABLED_DOMAINS_KEY, JSON.stringify(enabledDomains));
        }
        
        // 清除临时激活记录
        sessionStorage.removeItem(`js_temp_activated_${currentDomain}`);
        
        // 恢复原始方法
        document.createElement = originalMethods.createElement;
        
        // 隐藏UI
        hideUI();
        
        showNotification('JavaScript控制器已禁用', 'warning');
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        // 移除现有通知
        const existingNotification = document.querySelector('.js-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'js-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            cursor: pointer;
            font-weight: 500;
            max-width: 300px;
        `;
        
        notification.textContent = message;
        notification.addEventListener('click', () => notification.remove());
        
        document.body.appendChild(notification);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }
        }, 3000);
    }

    // 创建UI
    function createUI() {
        if (document.getElementById('js-controller-ui')) return;
        
        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'js-controller-toggle';
        toggleBtn.innerHTML = 'JS';
        toggleBtn.title = '显示/隐藏 JavaScript 控制器 (Ctrl+Shift+J)';
        toggleBtn.addEventListener('click', togglePanel);
        
        // 创建主面板
        const container = document.createElement('div');
        container.id = 'js-controller-ui';
        container.classList.add('hidden');
        
        // 检查是否为临时启用
        const isTemporary = sessionStorage.getItem(`js_temp_activated_${currentDomain}`) === 'true';
        
        // 创建面板内容
        container.innerHTML = `
            <div class="drag-handle">☰</div>
            <div class="js-controller-header">
                <h3 class="js-controller-title">JavaScript 控制器</h3>
                <button class="js-controller-close" title="关闭面板">×</button>
            </div>
            
            <div class="activation-status">
                <h3>${currentDomain}</h3>
                <div style="font-size: 12px; opacity: 0.9;">
                    ${isTemporary ? '临时启用' : '永久启用'}
                </div>
                <div class="activation-buttons">
                    <button id="js-disable-page" class="activation-btn danger">禁用控制器</button>
                    ${isTemporary ? '<button id="js-permanent-enable" class="activation-btn primary">设为永久</button>' : ''}
                </div>
            </div>
            
            <div class="shortcut-info">
                <strong>快捷键：</strong><br>
                <kbd>Ctrl+Shift+J</kbd> - 显示/隐藏面板<br>
                <kbd>Ctrl+Shift+K</kbd> - 启用控制器
            </div>
            
            <div class="tab-container">
                <button class="tab active" data-tab="control">脚本控制</button>
                <button class="tab" data-tab="domains">已启用网站</button>
            </div>
            
            <div id="tab-control" class="tab-content active">
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <button id="js-monitor-toggle" class="global-btn" style="flex: 1;">${isMonitoring ? '⏸️ 暂停监控' : '▶️ 恢复监控'}</button>
                    <button id="js-clear-list" class="global-btn danger" style="flex: 1;">🗑️ 清空列表</button>
                </div>
                
                <div id="js-script-list" style="min-height: 200px;">
                    <div class="empty-state">
                        <div>📋</div>
                        <div>正在监控脚本...</div>
                    </div>
                </div>
                
                <div class="global-controls">
                    <button id="js-disable-all" class="global-btn">🚫 禁用所有</button>
                    <button id="js-enable-all" class="global-btn">✅ 启用所有</button>
                    <button id="js-export" class="global-btn primary">💾 导出配置</button>
                </div>
                
                <div class="stats" id="js-stats">
                    已加载脚本: 0 | 已禁用: 0
                </div>
            </div>
            
            <div id="tab-domains" class="tab-content">
                <h4 style="margin: 0 0 12px 0; color: #333; font-size: 14px;">已永久启用的网站</h4>
                
                <div id="js-domains-list">
                    <div class="empty-state">
                        <div>🌐</div>
                        <div>正在加载网站列表...</div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                    <button id="js-clear-all-domains" class="global-btn danger">清除所有网站</button>
                </div>
            </div>
            
            <div style="margin-top: 12px; font-size: 11px; color: #888; text-align: center; padding-top: 12px; border-top: 1px solid #eee;">
                提示: 禁用脚本后需要刷新页面生效
            </div>
        `;
        
        document.body.appendChild(toggleBtn);
        document.body.appendChild(container);
        
        // 设置事件监听器
        setupEventListeners();
        
        // 添加拖动功能
        makeDraggable(container);
        
        // 加载网站列表
        loadDomainsList();
    }

    // 隐藏UI
    function hideUI() {
        const toggleBtn = document.getElementById('js-controller-toggle');
        const panel = document.getElementById('js-controller-ui');
        
        if (toggleBtn) toggleBtn.remove();
        if (panel) panel.remove();
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 面板控制
        document.querySelector('.js-controller-close').addEventListener('click', togglePanel);
        
        // 标签页切换
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(`tab-${this.dataset.tab}`).classList.add('active');
            });
        });
        
        // 激活控制
        document.getElementById('js-disable-page').addEventListener('click', disableForCurrentPage);
        
        const permanentEnableBtn = document.getElementById('js-permanent-enable');
        if (permanentEnableBtn) {
            permanentEnableBtn.addEventListener('click', () => {
                // 设为永久启用
                const enabledDomains = JSON.parse(GM_getValue(ENABLED_DOMAINS_KEY, '[]'));
                if (!enabledDomains.includes(currentDomain)) {
                    enabledDomains.push(currentDomain);
                    GM_setValue(ENABLED_DOMAINS_KEY, JSON.stringify(enabledDomains));
                }
                sessionStorage.removeItem(`js_temp_activated_${currentDomain}`);
                
                // 重新加载UI
                hideUI();
                enableForCurrentPage(false);
                
                showNotification('已设为永久启用');
            });
        }
        
        // 脚本控制
        document.getElementById('js-monitor-toggle').addEventListener('click', toggleMonitoring);
        document.getElementById('js-clear-list').addEventListener('click', clearList);
        document.getElementById('js-disable-all').addEventListener('click', () => toggleAllScripts(true));
        document.getElementById('js-enable-all').addEventListener('click', () => toggleAllScripts(false));
        document.getElementById('js-export').addEventListener('click', exportConfig);
        
        // 网站管理
        document.getElementById('js-clear-all-domains').addEventListener('click', clearAllDomains);
    }

    // 捕获已存在的脚本
    function captureExistingScripts() {
        if (!isControllerActive) return;
        
        document.querySelectorAll('script').forEach(script => {
            if (script.src) {
                const scriptInfo = {
                    type: '外部脚本',
                    url: script.src,
                    id: generateId(),
                    disabled: isScriptDisabled(script.src),
                    timestamp: Date.now()
                };
                allScripts.push(scriptInfo);
            } else if (script.textContent.trim()) {
                const scriptInfo = {
                    type: '内联脚本',
                    content: script.textContent.length > 150 ? 
                             script.textContent.substring(0, 150) + '...' : 
                             script.textContent,
                    id: generateId(),
                    disabled: isScriptDisabled(script.textContent),
                    timestamp: Date.now()
                };
                allScripts.push(scriptInfo);
            }
        });
        
        updateUI();
    }

    // 更新UI列表
    function updateUI() {
        const listContainer = document.getElementById('js-script-list');
        const statsContainer = document.getElementById('js-stats');
        
        if (!listContainer || !statsContainer) return;

        // 更新统计信息
        const disabledCount = allScripts.filter(s => s.disabled).length;
        statsContainer.textContent = `已加载脚本: ${allScripts.length} | 已禁用: ${disabledCount}`;
        
        if (allScripts.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div>📋</div>
                    <div>未检测到脚本</div>
                </div>
            `;
            return;
        }

        // 按时间倒序排序，最新的在前面
        const sortedScripts = [...allScripts].sort((a, b) => b.timestamp - a.timestamp);
        
        listContainer.innerHTML = '';
        
        sortedScripts.forEach((script, index) => {
            const item = document.createElement('div');
            item.className = `script-item ${script.disabled ? 'disabled' : ''}`;
            item.dataset.index = allScripts.findIndex(s => s.id === script.id);
            
            let contentHtml = `
                <div class="script-info">
                    <span class="script-type">${script.type}</span>
                    <span style="font-size: 11px; color: #999; margin-left: 8px;">${formatTime(script.timestamp)}</span>
            `;
            
            if (script.url) {
                const domain = new URL(script.url).hostname;
                contentHtml += `
                    <div class="script-url" title="${script.url}">
                        <strong>来源:</strong> ${domain}<br>
                        <span style="color: #888; font-size: 11px;">${truncateUrl(script.url, 70)}</span>
                    </div>
                `;
            }
            
            if (script.content) {
                contentHtml += `
                    <div class="script-content" title="${script.content.replace(/"/g, '&quot;')}">
                        ${escapeHtml(script.content)}
                    </div>
                `;
            }
            
            contentHtml += `
                </div>
                <div class="script-controls">
                    <button class="script-btn ${script.disabled ? 'enable' : 'disable'}" 
                            data-action="toggle">
                        ${script.disabled ? '✅ 启用' : '🚫 禁用'}
                    </button>
                    <button class="script-btn remove" data-action="remove">🗑️ 移除</button>
                </div>
            `;
            
            item.innerHTML = contentHtml;
            listContainer.appendChild(item);
        });
        
        // 添加事件委托
        listContainer.addEventListener('click', function(e) {
            const button = e.target.closest('.script-btn');
            if (!button) return;
            
            const item = button.closest('.script-item');
            const index = parseInt(item.dataset.index);
            const action = button.dataset.action;
            
            if (action === 'toggle') {
                toggleScript(index);
            } else if (action === 'remove') {
                removeScript(index);
            }
        });
    }

    // 加载网站列表
    function loadDomainsList() {
        const domainsList = document.getElementById('js-domains-list');
        if (!domainsList) return;
        
        const enabledDomains = JSON.parse(GM_getValue(ENABLED_DOMAINS_KEY, '[]'));
        
        if (enabledDomains.length === 0) {
            domainsList.innerHTML = `
                <div class="empty-state">
                    <div>🌐</div>
                    <div>暂无已永久启用的网站</div>
                </div>
            `;
            return;
        }
        
        let html = '';
        enabledDomains.sort().forEach(domain => {
            const isCurrent = domain === currentDomain;
            html += `
                <div class="domain-list-item" style="${isCurrent ? 'background: #e3f2fd;' : ''}">
                    <span class="domain-list-name">${domain} ${isCurrent ? '(当前)' : ''}</span>
                    <button class="domain-list-remove" data-domain="${domain}">
                        移除
                    </button>
                </div>
            `;
        });
        
        domainsList.innerHTML = html;
        
        // 添加移除按钮事件
        domainsList.querySelectorAll('.domain-list-remove').forEach(button => {
            button.addEventListener('click', function() {
                const domain = this.dataset.domain;
                removeDomain(domain);
            });
        });
    }

    // 移除网站
    function removeDomain(domain) {
        if (!confirm(`确定要从启用列表中移除 ${domain} 吗？`)) return;
        
        const enabledDomains = JSON.parse(GM_getValue(ENABLED_DOMAINS_KEY, '[]'));
        const index = enabledDomains.indexOf(domain);
        
        if (index > -1) {
            enabledDomains.splice(index, 1);
            GM_setValue(ENABLED_DOMAINS_KEY, JSON.stringify(enabledDomains));
            
            // 如果是当前网站，禁用控制器
            if (domain === currentDomain) {
                disableForCurrentPage();
            }
            
            // 重新加载列表
            loadDomainsList();
            
            showNotification(`已移除 ${domain}`);
        }
    }

    // 格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }

    // 截断URL
    function truncateUrl(url, maxLength) {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    }

    // 转义HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 切换脚本状态
    function toggleScript(index) {
        if (index < 0 || index >= allScripts.length || !isControllerActive) return;
        
        const script = allScripts[index];
        const identifier = script.url || script.content;
        
        if (!identifier) return;
        
        if (script.disabled) {
            // 启用脚本
            disabledScripts = disabledScripts.filter(s => {
                try {
                    return !new RegExp(s).test(identifier) && 
                           !identifier.includes(s) && 
                           !s.includes(identifier);
                } catch (e) {
                    return !identifier.includes(s) && !s.includes(identifier);
                }
            });
        } else {
            // 禁用脚本
            const simpleIdentifier = script.url ? 
                new URL(script.url).pathname.split('/').pop() || script.url :
                script.content.substring(0, 50);
                
            if (!disabledScripts.includes(simpleIdentifier)) {
                disabledScripts.push(simpleIdentifier);
            }
        }
        
        script.disabled = !script.disabled;
        saveSettings();
        updateUI();
    }

    // 移除脚本记录
    function removeScript(index) {
        if (index < 0 || index >= allScripts.length) return;
        
        allScripts.splice(index, 1);
        updateUI();
    }

    // 切换所有脚本状态
    function toggleAllScripts(disable) {
        if (!isControllerActive) return;
        
        allScripts.forEach(script => {
            const identifier = script.url || script.content;
            if (!identifier) return;
            
            if (disable && !script.disabled) {
                const simpleIdentifier = script.url ? 
                    new URL(script.url).pathname.split('/').pop() || script.url :
                    identifier.substring(0, 50);
                    
                if (!disabledScripts.includes(simpleIdentifier)) {
                    disabledScripts.push(simpleIdentifier);
                }
                script.disabled = true;
            } else if (!disable && script.disabled) {
                disabledScripts = disabledScripts.filter(s => {
                    try {
                        return !new RegExp(s).test(identifier) && 
                               !identifier.includes(s) && 
                               !s.includes(identifier);
                    } catch (e) {
                        return !identifier.includes(s) && !s.includes(identifier);
                    }
                });
                script.disabled = false;
            }
        });
        
        saveSettings();
        updateUI();
    }

    // 切换监控状态
    function toggleMonitoring() {
        if (!isControllerActive) return;
        
        isMonitoring = !isMonitoring;
        const toggleBtn = document.getElementById('js-monitor-toggle');
        toggleBtn.textContent = isMonitoring ? '⏸️ 暂停监控' : '▶️ 恢复监控';
    }

    // 清空列表
    function clearList() {
        if (!isControllerActive) return;
        
        if (confirm('确定要清空所有脚本记录吗？此操作不可撤销。')) {
            allScripts = [];
            updateUI();
        }
    }

    // 清除所有网站
    function clearAllDomains() {
        if (!confirm('确定要清除所有已启用的网站吗？此操作不可撤销。')) return;
        
        GM_setValue(ENABLED_DOMAINS_KEY, JSON.stringify([]));
        
        // 如果是当前网站，禁用控制器
        if (isControllerActive) {
            disableForCurrentPage();
        }
        
        // 重新加载列表
        loadDomainsList();
        
        showNotification('已清除所有网站');
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        if (!isControllerActive) {
            // 如果控制器未启用，先启用它
            enableForCurrentPage(true);
            return;
        }
        
        const panel = document.getElementById('js-controller-ui');
        const toggleBtn = document.getElementById('js-controller-toggle');
        
        if (panel.classList.contains('hidden')) {
            showPanel();
        } else {
            hidePanel();
        }
    }

    // 显示面板
    function showPanel() {
        if (!isControllerActive) return;
        
        const panel = document.getElementById('js-controller-ui');
        const toggleBtn = document.getElementById('js-controller-toggle');
        
        if (panel && toggleBtn) {
            panel.classList.remove('hidden');
            toggleBtn.classList.remove('hidden');
            isPanelVisible = true;
        }
    }

    // 隐藏面板
    function hidePanel() {
        const panel = document.getElementById('js-controller-ui');
        const toggleBtn = document.getElementById('js-controller-toggle');
        
        if (panel && toggleBtn) {
            panel.classList.add('hidden');
            isPanelVisible = false;
        }
    }

    // 导出配置
    function exportConfig() {
        const enabledDomains = JSON.parse(GM_getValue(ENABLED_DOMAINS_KEY, '[]'));
        const disabledScriptsData = JSON.parse(GM_getValue(DISABLED_SCRIPTS_KEY, '{}'));
        
        const config = {
            enabledDomains: enabledDomains,
            disabledScripts: disabledScriptsData,
            currentDomain: currentDomain,
            exportDate: new Date().toISOString(),
            version: '3.1'
        };
        
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `js-controller-backup-${Date.now()}.json`;
        link.click();
        
        showNotification('配置已导出！');
    }

    // 使UI可拖动
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragHandle = element.querySelector('.drag-handle');
        
        dragHandle.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // 计算新位置
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            
            // 限制在窗口内
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
            
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 添加快捷键支持
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+J: 显示/隐藏面板
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                togglePanel();
            }
            
            // Ctrl+Shift+K: 启用控制器
            if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                e.preventDefault();
                enableForCurrentPage(true);
            }
        });
    }

    // 初始化
    function init() {
        // 如果控制器已激活，创建UI
        if (isControllerActive) {
            createUI();
            captureExistingScripts();
        }
        
        // 设置键盘快捷键
        setupKeyboardShortcuts();
        
        // 添加油猴菜单命令
        GM_registerMenuCommand('在此网站启用控制器', () => {
            enableForCurrentPage(false);
        }, 'p');
        
        GM_registerMenuCommand('临时启用控制器', () => {
            enableForCurrentPage(true);
        }, 't');
        
        GM_registerMenuCommand('禁用控制器', () => {
            disableForCurrentPage();
        }, 'd');
        
        GM_registerMenuCommand('查看已启用网站', () => {
            const enabledDomains = JSON.parse(GM_getValue(ENABLED_DOMAINS_KEY, '[]'));
            alert(`已永久启用的网站 (${enabledDomains.length}个):\n\n${enabledDomains.join('\n') || '暂无'}`);
        }, 'l');
    }

    // 启动
    init();
})();
// ==UserScript==
// @name         精致元素隐藏工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  精致浅紫色渐变的可视化元素隐藏工具
// @author       YourName
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/554910/%E7%B2%BE%E8%87%B4%E5%85%83%E7%B4%A0%E9%9A%90%E8%97%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/554910/%E7%B2%BE%E8%87%B4%E5%85%83%E7%B4%A0%E9%9A%90%E8%97%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEY = 'element_hider_config';
    const SETTINGS_KEY = 'element_hider_settings';

    const defaultConfig = { domains: {}, globalSelectors: [] };
    const defaultSettings = {
        showTrigger: true,
        hotkey: 'Ctrl+Shift+H'
    };

    function getConfig() {
        const config = GM_getValue(CONFIG_KEY, JSON.stringify(defaultConfig));
        return JSON.parse(config);
    }

    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
    }

    function getSettings() {
        const settings = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
        return JSON.parse(settings);
    }

    function saveSettings(settings) {
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
        applySettings();
    }

    function getSelectorsForDomain(domain) {
        const config = getConfig();
        return config.domains[domain] || [];
    }

    function saveSelectorsForDomain(domain, selectors) {
        const config = getConfig();
        config.domains[domain] = selectors;
        saveConfig(config);
    }

    // 存储元素原始状态
    const originalElementStates = new Map();

    function hideElements() {
        const domain = window.location.hostname;
        const selectors = getSelectorsForDomain(domain);

        // 先恢复所有元素
        restoreAllElements();

        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    // 记录原始状态
                    if (!originalElementStates.has(element)) {
                        originalElementStates.set(element, {
                            display: element.style.display,
                            visibility: element.style.visibility
                        });
                    }
                    // 隐藏元素
                    element.style.display = 'none';
                });
            } catch (e) {
                console.warn(`无效的选择器: ${selector}`, e);
            }
        });
    }

    function restoreAllElements() {
        originalElementStates.forEach((originalState, element) => {
            element.style.display = originalState.display;
            element.style.visibility = originalState.visibility;
        });
        originalElementStates.clear();
    }

    function removeSelector(index) {
        const domain = window.location.hostname;
        const selectors = getSelectorsForDomain(domain);

        // 1. 恢复所有元素
        restoreAllElements();

        // 2. 移除选择器
        selectors.splice(index, 1);
        saveSelectorsForDomain(domain, selectors);

        // 3. 重新应用隐藏
        hideElements();
        updateSelectorList();
    }

    function applySettings() {
        const settings = getSettings();
        const trigger = document.getElementById('eh-trigger');

        if (trigger) {
            trigger.style.display = settings.showTrigger ? 'flex' : 'none';
        }
    }

    function setupHotkey() {
        const settings = getSettings();

        document.addEventListener('keydown', function(e) {
            let pressedHotkey = '';
            if (e.ctrlKey) pressedHotkey += 'Ctrl+';
            if (e.shiftKey) pressedHotkey += 'Shift+';
            if (e.altKey) pressedHotkey += 'Alt+';
            pressedHotkey += e.key.toUpperCase();

            if (pressedHotkey === settings.hotkey) {
                e.preventDefault();
                togglePanel();
            }
        });
    }

    function togglePanel() {
        const panel = document.getElementById('element-hider-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    }

    function addStyles() {
        GM_addStyle(`
            /* 精致浅紫色渐变设计 */
            :root {
                --white: #ffffff;
                --white-soft: #fafafa;
                --white-mute: #f8f8f8;
                --border-light: #f0f0f0;
                --border-regular: #e8e8e8;
                --text-primary: #2d3748;
                --text-secondary: #718096;
                --text-muted: #a0aec0;

                /* 浅紫色渐变 */
                --accent-primary: #8b5cf6;
                --accent-secondary: #a78bfa;
                --accent-light: #f3f0ff;
                --accent-hover: #7c3aed;
                --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
                --gradient-light: linear-gradient(135deg, #f3f0ff 0%, #f8f7ff 100%);

                --shadow-light: 0 1px 3px rgba(139, 92, 246, 0.1);
                --shadow-regular: 0 4px 12px rgba(139, 92, 246, 0.15);
                --shadow-heavy: 0 8px 24px rgba(139, 92, 246, 0.2);
                --radius-small: 6px;
                --radius-medium: 8px;
                --radius-large: 12px;
                --transition-fast: 0.15s ease;
                --transition-regular: 0.25s ease;
                --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* 主面板 */
            #element-hider-panel {
                position: fixed;
                width: 300px;
                background: var(--white);
                border-radius: var(--radius-large);
                box-shadow: var(--shadow-heavy);
                z-index: 10000;
                overflow: hidden;
                transition: var(--transition-smooth);
                transform: translateX(100%) scale(0.95);
                opacity: 0;
                top: 20px;
                right: 20px;
                border: 1px solid var(--border-light);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
            }

            #element-hider-panel.active {
                transform: translateX(0) scale(1);
                opacity: 1;
            }

            /* 头部 - 浅紫色渐变 */
            .eh-header {
                padding: 16px 20px;
                background: var(--gradient-primary);
                position: relative;
            }

            .eh-header h3 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                color: white;
                letter-spacing: 0.5px;
            }

            .eh-close {
                position: absolute;
                top: 12px;
                right: 16px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                font-size: 16px;
                color: white;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-small);
                transition: var(--transition-fast);
            }

            .eh-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            /* 内容区域 */
            .eh-body {
                padding: 0;
            }

            .eh-section {
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-light);
            }

            .eh-section:last-child {
                border-bottom: none;
            }

            /* 域名显示 */
            .eh-domain {
                display: inline-block;
                background: var(--accent-light);
                color: var(--accent-primary);
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
                margin-bottom: 12px;
                border: 1px solid rgba(139, 92, 246, 0.1);
            }

            /* 按钮组 - 小巧精致 */
            .eh-btn-group {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                width: 100%;
            }

            .eh-btn {
                background: var(--white);
                border: 1px solid var(--border-regular);
                border-radius: var(--radius-medium);
                padding: 8px 12px;
                cursor: pointer;
                font-size: 12px;
                transition: var(--transition-fast);
                color: var(--text-primary);
                font-weight: 500;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                height: 32px;
            }

            .eh-btn:hover {
                background: var(--white-soft);
                border-color: var(--accent-primary);
                transform: translateY(-1px);
                box-shadow: var(--shadow-light);
            }

            .eh-btn.primary {
                background: var(--gradient-primary);
                border: none;
                color: white;
            }

            .eh-btn.primary:hover {
                background: var(--accent-hover);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
            }

            /* 选择器列表 */
            .eh-selector-list {
                max-height: 120px;
                overflow-y: auto;
                margin: 0;
                padding: 0;
                list-style: none;
            }

            .eh-selector-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                font-size: 12px;
                transition: var(--transition-fast);
            }

            .eh-selector-item:hover {
                background: var(--white-soft);
                margin: 0 -4px;
                padding: 8px 4px;
                border-radius: var(--radius-small);
            }

            .eh-selector-text {
                color: var(--text-secondary);
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                font-family: 'SF Mono', Monaco, monospace;
                font-size: 11px;
            }

            .eh-selector-remove {
                background: none;
                border: 1px solid var(--border-regular);
                color: var(--text-muted);
                border-radius: var(--radius-small);
                width: 20px;
                height: 20px;
                cursor: pointer;
                font-size: 10px;
                transition: var(--transition-fast);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .eh-selector-remove:hover {
                background: #fee2e2;
                border-color: #fecaca;
                color: #dc2626;
                transform: scale(1.1);
            }

            /* 底部按钮组 - 更小巧 */
            .eh-footer-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 6px;
                width: 100%;
            }

            .eh-footer-buttons .eh-btn {
                height: 28px;
                padding: 6px 10px;
                font-size: 11px;
            }

            /* 触发按钮 - 精致小巧 */
            #eh-trigger {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                background: var(--gradient-primary);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 14px;
                cursor: pointer;
                box-shadow: var(--shadow-regular);
                z-index: 9999;
                transition: var(--transition-smooth);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
            }

            #eh-trigger:hover {
                transform: scale(1.1) rotate(90deg);
                box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
            }

            /* 高亮样式 */
            .eh-highlight {
                outline: 2px solid var(--accent-primary) !important;
                position: relative;
                cursor: pointer;
                border-radius: var(--radius-small);
            }

            .eh-highlight::after {
                content: "点击隐藏";
                position: absolute;
                top: -24px;
                left: 0;
                background: var(--accent-primary);
                color: white;
                padding: 3px 8px;
                border-radius: var(--radius-small);
                font-size: 10px;
                font-weight: 500;
                z-index: 10001;
            }

            /* 模态框 */
            .eh-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                opacity: 0;
                visibility: hidden;
                transition: var(--transition-regular);
                backdrop-filter: blur(4px);
            }

            .eh-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .eh-modal-content {
                background: var(--white);
                border-radius: var(--radius-large);
                padding: 20px;
                width: 90%;
                max-width: 360px;
                transform: scale(0.9);
                transition: var(--transition-smooth);
                box-shadow: var(--shadow-heavy);
                border: 1px solid var(--border-light);
            }

            .eh-modal.active .eh-modal-content {
                transform: scale(1);
            }

            .eh-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .eh-modal-title {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                color: var(--text-primary);
            }

            .eh-modal-close {
                background: none;
                border: none;
                font-size: 16px;
                color: var(--text-muted);
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-small);
                transition: var(--transition-fast);
            }

            .eh-modal-close:hover {
                background: var(--white-soft);
                color: var(--text-primary);
            }

            /* 输入框 */
            .eh-input {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid var(--border-regular);
                border-radius: var(--radius-medium);
                margin-bottom: 12px;
                font-size: 12px;
                transition: var(--transition-fast);
                background: var(--white);
            }

            .eh-input:focus {
                outline: none;
                border-color: var(--accent-primary);
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            }

            .eh-textarea {
                width: 100%;
                height: 100px;
                padding: 12px;
                border: 1px solid var(--border-regular);
                border-radius: var(--radius-medium);
                margin-bottom: 12px;
                resize: vertical;
                font-family: 'SF Mono', Monaco, monospace;
                font-size: 11px;
                background: var(--white);
            }

            .eh-textarea:focus {
                outline: none;
                border-color: var(--accent-primary);
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            }

            /* 设置项 */
            .eh-setting-item {
                margin-bottom: 16px;
            }

            .eh-setting-label {
                display: block;
                margin-bottom: 6px;
                font-size: 12px;
                color: var(--text-primary);
                font-weight: 500;
            }

            .eh-setting-description {
                font-size: 10px;
                color: var(--text-muted);
                margin-top: 4px;
                line-height: 1.4;
            }

            .eh-select {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid var(--border-regular);
                border-radius: var(--radius-medium);
                margin-bottom: 12px;
                font-size: 12px;
                background: var(--white);
                cursor: pointer;
            }

            .eh-select:focus {
                outline: none;
                border-color: var(--accent-primary);
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            }

            /* 空状态 */
            .eh-empty-state {
                text-align: center;
                padding: 30px 20px;
                color: var(--text-muted);
                font-size: 12px;
            }

            .eh-empty-state::before {
                content: "📋";
                font-size: 24px;
                display: block;
                margin-bottom: 8px;
                opacity: 0.5;
            }

            /* 滚动条 */
            .eh-selector-list::-webkit-scrollbar {
                width: 3px;
            }

            .eh-selector-list::-webkit-scrollbar-track {
                background: var(--white-soft);
                border-radius: 2px;
            }

            .eh-selector-list::-webkit-scrollbar-thumb {
                background: var(--border-regular);
                border-radius: 2px;
            }

            .eh-selector-list::-webkit-scrollbar-thumb:hover {
                background: var(--text-muted);
            }

            /* 动画 */
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .eh-selector-item {
                animation: slideIn 0.2s ease;
            }

            /* 设置按钮 */
            #eh-settings-btn {
                width: 100%;
                margin-top: 8px;
                height: 28px;
                font-size: 11px;
            }
        `);
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'element-hider-panel';
        panel.innerHTML = `
            <div class="eh-header">
                <h3>元素隐藏工具</h3>
                <button class="eh-close">×</button>
            </div>
            <div class="eh-body">
                <div class="eh-section">
                    <div class="eh-domain">${window.location.hostname}</div>
                    <div class="eh-btn-group">
                        <button class="eh-btn primary eh-pick-mode">选择元素</button>
                        <button class="eh-btn eh-manual-input">手动输入</button>
                    </div>
                </div>
                <div class="eh-section">
                    <h4 style="margin: 0 0 8px 0; font-size: 12px; color: var(--text-primary); font-weight: 600;">隐藏规则</h4>
                    <ul class="eh-selector-list"></ul>
                </div>
                <div class="eh-section">
                    <div class="eh-footer-buttons">
                        <button class="eh-btn eh-manage-config">管理</button>
                        <button class="eh-btn eh-export">导出</button>
                        <button class="eh-btn eh-import">导入</button>
                    </div>
                    <button class="eh-btn" id="eh-settings-btn">设置</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        const trigger = document.createElement('button');
        trigger.id = 'eh-trigger';
        trigger.innerHTML = 'H';
        trigger.title = '元素隐藏工具';
        document.body.appendChild(trigger);

        return panel;
    }

    function createModals() {
        const modals = [
            {
                id: 'manual-input-modal',
                title: '输入选择器',
                content: `
                    <input type="text" class="eh-input" placeholder="例如: .ad-banner, #sidebar-ad">
                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                        <button class="eh-btn" id="cancel-input">取消</button>
                        <button class="eh-btn primary" id="add-selector">添加</button>
                    </div>
                `
            },
            {
                id: 'config-modal',
                title: '配置管理',
                content: `
                    <div>
                        <h4 style="margin-bottom: 12px; font-size: 12px; color: var(--text-primary); font-weight: 600;">域名配置</h4>
                        <div id="domain-configs" style="max-height: 160px; overflow-y: auto;"></div>
                    </div>
                    <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
                        <button class="eh-btn primary" id="reset-config">重置配置</button>
                        <button class="eh-btn" id="close-config">关闭</button>
                    </div>
                `
            },
            {
                id: 'import-modal',
                title: '导入配置',
                content: `
                    <textarea class="eh-textarea" placeholder="粘贴配置JSON内容"></textarea>
                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                        <button class="eh-btn" id="cancel-import">取消</button>
                        <button class="eh-btn primary" id="confirm-import">导入</button>
                    </div>
                `
            },
            {
                id: 'settings-modal',
                title: '设置',
                content: `
                    <div class="eh-setting-item">
                        <label class="eh-setting-label">显示触发按钮</label>
                        <select class="eh-select" id="show-trigger">
                            <option value="true">显示</option>
                            <option value="false">隐藏</option>
                        </select>
                        <div class="eh-setting-description">控制右下角触发按钮的显示/隐藏</div>
                    </div>
                    <div class="eh-setting-item">
                        <label class="eh-setting-label">快捷键</label>
                        <select class="eh-select" id="hotkey-select">
                            <option value="Ctrl+Shift+H">Ctrl+Shift+H</option>
                            <option value="Ctrl+Shift+E">Ctrl+Shift+E</option>
                            <option value="Alt+Shift+H">Alt+Shift+H</option>
                            <option value="Alt+Shift+E">Alt+Shift+E</option>
                        </select>
                        <div class="eh-setting-description">打开/关闭面板的快捷键</div>
                    </div>
                    <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
                        <button class="eh-btn" id="close-settings">关闭</button>
                        <button class="eh-btn primary" id="save-settings">保存</button>
                    </div>
                `
            }
        ];

        modals.forEach(modal => {
            const modalElement = document.createElement('div');
            modalElement.className = 'eh-modal';
            modalElement.id = modal.id;
            modalElement.innerHTML = `
                <div class="eh-modal-content">
                    <div class="eh-modal-header">
                        <h3 class="eh-modal-title">${modal.title}</h3>
                        <button class="eh-modal-close">×</button>
                    </div>
                    ${modal.content}
                </div>
            `;
            document.body.appendChild(modalElement);
        });
    }

    function updateSelectorList() {
        const domain = window.location.hostname;
        const selectors = getSelectorsForDomain(domain);
        const list = document.querySelector('.eh-selector-list');

        list.innerHTML = '';

        if (selectors.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'eh-empty-state';
            emptyItem.innerHTML = '暂无隐藏规则';
            list.appendChild(emptyItem);
        } else {
            selectors.forEach((selector, index) => {
                const item = document.createElement('li');
                item.className = 'eh-selector-item';
                item.innerHTML = `
                    <span class="eh-selector-text" title="${selector}">${selector}</span>
                    <button class="eh-selector-remove" data-index="${index}">×</button>
                `;
                list.appendChild(item);
            });
        }

        document.querySelectorAll('.eh-selector-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeSelector(index);
            });
        });
    }

    function startPickMode() {
        const panel = document.getElementById('element-hider-panel');
        panel.classList.remove('active');

        let highlightedElement = null;

        function highlightElement(e) {
            if (highlightedElement) {
                highlightedElement.classList.remove('eh-highlight');
            }

            highlightedElement = e.target;
            highlightedElement.classList.add('eh-highlight');

            e.stopPropagation();
            e.preventDefault();
        }

        function selectElement(e) {
            if (highlightedElement) {
                highlightedElement.classList.remove('eh-highlight');

                const selector = generateSelector(highlightedElement);
                if (selector) {
                    addSelector(selector);
                }

                cancelPickMode();
            }

            e.stopPropagation();
            e.preventDefault();
        }

        function cancelPickMode(e) {
            if (e && e.key !== 'Escape') return;

            document.removeEventListener('mousemove', highlightElement);
            document.removeEventListener('click', selectElement, true);
            document.removeEventListener('keydown', cancelPickMode);

            if (highlightedElement) {
                highlightedElement.classList.remove('eh-highlight');
            }

            panel.classList.add('active');
        }

        document.addEventListener('mousemove', highlightElement);
        document.addEventListener('click', selectElement, true);
        document.addEventListener('keydown', cancelPickMode);
    }

    function generateSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(/\s+/).filter(c => c);
            if (classes.length > 0) return `.${classes[0]}`;
        }
        return element.tagName.toLowerCase();
    }

    function addSelector(selector) {
        const domain = window.location.hostname;
        const selectors = getSelectorsForDomain(domain);

        if (!selectors.includes(selector)) {
            selectors.push(selector);
            saveSelectorsForDomain(domain, selectors);
            updateSelectorList();
            hideElements();
        }
    }

    function toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (show) {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }

    function exportConfig() {
        const config = getConfig();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "element-hider-config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function enablePanelDrag() {
        const panel = document.getElementById('element-hider-panel');
        const header = panel.querySelector('.eh-header');
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            if (e.target.classList.contains('eh-close')) return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            panel.style.transition = 'none';
        }

        function drag(e) {
            if (!isDragging) return;
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
            panel.style.right = 'auto';
        }

        function stopDrag() {
            isDragging = false;
            panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    function initEventListeners() {
        const panel = document.getElementById('element-hider-panel');

        document.getElementById('eh-trigger').addEventListener('click', togglePanel);

        panel.querySelector('.eh-close').addEventListener('click', () => {
            panel.classList.remove('active');
        });

        panel.querySelector('.eh-pick-mode').addEventListener('click', startPickMode);
        panel.querySelector('.eh-manual-input').addEventListener('click', () => {
            toggleModal('manual-input-modal', true);
        });

        panel.querySelector('.eh-manage-config').addEventListener('click', () => {
            const config = getConfig();
            const domainConfigs = document.getElementById('domain-configs');
            domainConfigs.innerHTML = '';

            Object.keys(config.domains).forEach(domain => {
                const domainSection = document.createElement('div');
                domainSection.style.marginBottom = '12px';
                domainSection.style.padding = '12px';
                domainSection.style.background = 'var(--white-soft)';
                domainSection.style.borderRadius = 'var(--radius-medium)';
                domainSection.style.border = '1px solid var(--border-light)';
                domainSection.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 8px; color: var(--text-primary); font-size: 12px;">${domain}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                        ${config.domains[domain].map(selector =>
                            `<div style="margin: 4px 0;">• ${selector}</div>`
                        ).join('')}
                    </div>
                `;
                domainConfigs.appendChild(domainSection);
            });

            toggleModal('config-modal', true);
        });

        panel.querySelector('.eh-export').addEventListener('click', exportConfig);
        panel.querySelector('.eh-import').addEventListener('click', () => {
            toggleModal('import-modal', true);
        });

        document.getElementById('eh-settings-btn').addEventListener('click', () => {
            const settings = getSettings();
            document.getElementById('show-trigger').value = settings.showTrigger ? 'true' : 'false';
            document.getElementById('hotkey-select').value = settings.hotkey;
            toggleModal('settings-modal', true);
        });

        // 模态框事件
        document.getElementById('add-selector').addEventListener('click', () => {
            const selector = document.querySelector('#manual-input-modal .eh-input').value.trim();
            if (selector) {
                addSelector(selector);
                document.querySelector('#manual-input-modal .eh-input').value = '';
                toggleModal('manual-input-modal', false);
            }
        });

        document.getElementById('cancel-input').addEventListener('click', () => {
            toggleModal('manual-input-modal', false);
        });

        document.getElementById('reset-config').addEventListener('click', () => {
            if (confirm('确定要重置所有配置吗？此操作不可撤销。')) {
                restoreAllElements();
                saveConfig(defaultConfig);
                updateSelectorList();
                toggleModal('config-modal', false);
            }
        });

        document.getElementById('close-config').addEventListener('click', () => {
            toggleModal('config-modal', false);
        });

        document.getElementById('confirm-import').addEventListener('click', () => {
            const configText = document.querySelector('#import-modal .eh-textarea').value.trim();
            if (configText) {
                try {
                    restoreAllElements();
                    const newConfig = JSON.parse(configText);
                    saveConfig(newConfig);
                    updateSelectorList();
                    hideElements();
                    toggleModal('import-modal', false);
                    document.querySelector('#import-modal .eh-textarea').value = '';
                } catch (e) {
                    alert('配置格式错误，请检查JSON格式');
                }
            }
        });

        document.getElementById('cancel-import').addEventListener('click', () => {
            toggleModal('import-modal', false);
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            const showTrigger = document.getElementById('show-trigger').value === 'true';
            const hotkey = document.getElementById('hotkey-select').value;
            saveSettings({ showTrigger, hotkey });
            toggleModal('settings-modal', false);
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            toggleModal('settings-modal', false);
        });

        document.querySelectorAll('.eh-modal-close').forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.eh-modal');
                modal.classList.remove('active');
            });
        });

        document.querySelectorAll('.eh-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        enablePanelDrag();
    }

    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('打开面板', togglePanel);
            GM_registerMenuCommand('选择元素', startPickMode);
            GM_registerMenuCommand('手动输入选择器', () => {
                toggleModal('manual-input-modal', true);
            });
            GM_registerMenuCommand('管理配置', () => {
                const config = getConfig();
                const domainConfigs = document.getElementById('domain-configs');
                domainConfigs.innerHTML = '';

                Object.keys(config.domains).forEach(domain => {
                    const domainSection = document.createElement('div');
                    domainSection.style.marginBottom = '12px';
                    domainSection.style.padding = '12px';
                    domainSection.style.background = 'var(--white-soft)';
                    domainSection.style.borderRadius = 'var(--radius-medium)';
                    domainSection.style.border = '1px solid var(--border-light)';
                    domainSection.innerHTML = `
                        <div style="font-weight: 600; margin-bottom: 8px; color: var(--text-primary); font-size: 12px;">${domain}</div>
                        <div style="font-size: 11px; color: var(--text-secondary);">
                            ${config.domains[domain].map(selector =>
                                `<div style="margin: 4px 0;">• ${selector}</div>`
                            ).join('')}
                        </div>
                    `;
                    domainConfigs.appendChild(domainSection);
                });

                toggleModal('config-modal', true);
            });
            GM_registerMenuCommand('导出配置', exportConfig);
            GM_registerMenuCommand('导入配置', () => {
                toggleModal('import-modal', true);
            });
            GM_registerMenuCommand('设置', () => {
                const settings = getSettings();
                document.getElementById('show-trigger').value = settings.showTrigger ? 'true' : 'false';
                document.getElementById('hotkey-select').value = settings.hotkey;
                toggleModal('settings-modal', true);
            });
        }
    }

    function init() {
        addStyles();
        createControlPanel();
        createModals();
        initEventListeners();
        updateSelectorList();
        hideElements();
        applySettings();
        setupHotkey();
        registerMenuCommands();

        const observer = new MutationObserver(hideElements);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
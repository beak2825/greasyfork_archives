// ==UserScript==
// @name        WarSoul Auto-Equip Assistant
// @namespace   http://tampermonkey.net/
// @version     2.1
// @description 根据怪物血量和怪物名称自动换装，支持多套路管理
// @author      Lunaris
// @match       https://aring.cc/awakening-of-war-soul-ol/
// @icon        https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550606/WarSoul%20Auto-Equip%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/550606/WarSoul%20Auto-Equip%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'auto_equip_config_v4';

    let config = {
        enabled: false,
        equipmentList: [],
        currentRoutine: 'default',
        routines: {
            'default': {
                name: '默认套路',
                rules: []
            }
        },
        monsterRoutines: {}
    };

    let isSwitching = false;
    let switchTimeout = null;
    let lastSwitchTime = 0;
    const SWITCH_COOLDOWN = 3000;
    let currentMonster = null;
    let lastMonsterRoutine = null;

    function loadConfig() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const loadedConfig = JSON.parse(saved);
                config = { ...config, ...loadedConfig };
                if (!config.routines || Object.keys(config.routines).length === 0) {
                    config.routines = {
                        'default': {
                            name: '默认套路',
                            rules: []
                        }
                    };
                }
                if (!config.currentRoutine || !config.routines[config.currentRoutine]) {
                    config.currentRoutine = 'default';
                }
                if (!config.monsterRoutines) {
                    config.monsterRoutines = {};
                }
            }
        } catch (e) {
            console.error('加载配置失败:', e);
        }
    }

    function saveConfig() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch (e) {
            console.error('保存配置失败:', e);
        }
    }

    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;

        let bgColor = '#4a90e2';
        if (type === 'error') bgColor = '#ff4757';
        if (type === 'success') bgColor = '#2ed573';
        if (type === 'warning') bgColor = '#ffa500';

        messageDiv.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            padding: 10px 15px;
            background: ${bgColor};
            color: white;
            border-radius: 4px;
            z-index: 20000;
            font-size: 12px;
            max-width: 150px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(messageDiv);
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    function extractPureText(text) {
        if (!text) return '';
        return text
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
            .replace(/[\u{2600}-\u{26FF}]/gu, '')
            .replace(/[\u{2700}-\u{27BF}]/gu, '')
            .replace(/[◆◇★☆■□▲△●○♦♢]/g, '')
            .replace(/\s+/g, '')
            .trim();
    }

    function matchMonsterName(currentMonster, configuredMonster) {
        if (!currentMonster || !configuredMonster) return false;
        if (currentMonster === configuredMonster) return true;

        const cleanCurrent = extractPureText(currentMonster);
        const cleanConfigured = extractPureText(configuredMonster);

        if (cleanCurrent === cleanConfigured) return true;
        if (cleanCurrent.includes(cleanConfigured) || cleanConfigured.includes(cleanCurrent)) {
            return true;
        }

        return false;
    }

    // 从容器中提取血量（三种策略）
    function extractHP(container) {
        let hpElement = null;
        
        // 策略1: 标准选择器
        hpElement = container.querySelector('.el-progress-bar__innerText span');
        
        // 策略2: 通过data-v-09236a56属性
        if (!hpElement) {
            const dataElements = container.querySelectorAll('[data-v-09236a56]');
            for (let el of dataElements) {
                if (el.tagName === 'SPAN' && el.textContent.includes('%')) {
                    hpElement = el;
                    break;
                }
            }
        }
        
        // 策略3: 通过元素结构（el-progress > el-progress-bar > ... > span）
        if (!hpElement) {
            const progress = container.querySelector('.el-progress.el-progress--line');
            if (progress) {
                const progressBar = progress.querySelector('.el-progress-bar');
                if (progressBar) {
                    const innerText = progressBar.querySelector('.el-progress-bar__innerText');
                    if (innerText) {
                        const span = innerText.querySelector('span');
                        if (span && span.textContent.includes('%')) {
                            hpElement = span;
                        }
                    }
                }
            }
        }
        
        if (hpElement) {
            const hpText = hpElement.textContent.trim().replace('%', '').replace(/\s+/g, '');
            const hpValue = parseFloat(hpText);
            if (!isNaN(hpValue)) {
                return hpValue;
            }
        }
        
        return null;
    }

    function getBattleData() {
        const personFight = document.querySelector('.person-fight');
        const teamFight = document.querySelector('.team-fight');

        let personData = null;
        let teamData = null;

        if (personFight) {
            const hpValue = extractHP(personFight);
            const monsterElement = personFight.querySelector('h2[data-v-c8bc98e2]') || 
                                  personFight.querySelector('h2');

            if (hpValue !== null && monsterElement) {
                const monsterText = extractPureText(monsterElement.textContent.trim());
                personData = {
                    hp: hpValue,
                    monster: monsterText,
                    type: 'person'
                };
            }
        }

        if (teamFight) {
            const hpValue = extractHP(teamFight);
            const monsterElement = teamFight.querySelector('h2[data-v-c8bc98e2]') || 
                                 teamFight.querySelector('h2');

            if (hpValue !== null && monsterElement) {
                const monsterText = extractPureText(monsterElement.textContent.trim());
                teamData = {
                    hp: hpValue,
                    monster: monsterText,
                    type: 'team'
                };
            }
        }

        let activeBattle = null;
        if (personData && personData.hp > 0) {
            activeBattle = personData;
        } else if (teamData && teamData.hp > 0) {
            activeBattle = teamData;
        }

        return activeBattle;
    }

    function getCurrentHP() {
        const battleData = getBattleData();
        return battleData ? battleData.hp : null;
    }

    function getCurrentMonster() {
        const battleData = getBattleData();
        return battleData ? battleData.monster : null;
    }

    function getCurrentEquipment() {
        const selectors = [
            '.el-select__selected-item .el-select__placeholder span',
            '.equip-routine-wrap .el-select .el-select__selected-item span',
            '.equip-routine-wrap .el-select__placeholder span'
        ];

        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return '';
    }

    function readEquipmentList() {
        return new Promise((resolve) => {
            const selectWrapper = document.querySelector('.equip-routine-wrap .el-select__wrapper');
            if (!selectWrapper) {
                showMessage('未找到装备选择框', 'error');
                resolve(false);
                return;
            }

            console.log('📄 正在读取装备列表...');
            selectWrapper.click();

            setTimeout(() => {
                const dropdown = document.querySelector('.el-select-dropdown__list');
                if (!dropdown) {
                    showMessage('无法打开装备列表', 'error');
                    resolve(false);
                    return;
                }

                const equipmentList = [];
                const items = dropdown.querySelectorAll('.el-select-dropdown__item span');
                items.forEach(item => {
                    const equipName = item.textContent.trim();
                    if (equipName) {
                        equipmentList.push(equipName);
                    }
                });

                document.body.click();

                if (equipmentList.length > 0) {
                    config.equipmentList = equipmentList;
                    saveConfig();
                    console.log('✅ 装备列表读取成功:', equipmentList);
                    showMessage(`成功读取${equipmentList.length}个装备套路`, 'success');
                    resolve(true);
                } else {
                    showMessage('未读取到装备', 'error');
                    resolve(false);
                }
            }, 500);
        });
    }

    function createBasicPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-equip-panel';
        panel.innerHTML = `
            <div id="panel-header">
                <span>智能换装助手</span>
                <div id="panel-controls">
                    <button id="settings-btn" title="设置">⚙</button>
                    <button id="minimize-btn" title="最小化">−</button>
                    <button id="close-btn" title="关闭">×</button>
                </div>
            </div>
            <div id="panel-content">
                <div class="switch-container">
                    <label class="switch">
                        <input type="checkbox" id="enable-switch" ${config.enabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>启用自动换装</span>
                </div>
                <div id="advanced-panel" style="display: ${config.enabled ? 'block' : 'none'};">
                    <div id="routine-selector" style="display: none;"></div>
                    <div id="config-section" style="display: none;"></div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #auto-equip-panel {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 280px;
                background: #2c2c2c;
                border: 1px solid #404040;
                border-radius: 8px;
                color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 12px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            #panel-header {
                background: linear-gradient(135deg, #4a4a4a, #3a3a3a);
                padding: 10px 12px;
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
            }
            #panel-header span {
                font-weight: bold;
                font-size: 13px;
            }
            #panel-controls {
                display: flex;
                gap: 5px;
            }
            #panel-controls button {
                width: 22px;
                height: 22px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 14px;
                line-height: 1;
                transition: all 0.2s;
            }
            #settings-btn {
                background: #17a2b8;
                color: #fff;
            }
            #settings-btn:hover {
                background: #138496;
            }
            #minimize-btn {
                background: #ffa500;
                color: #fff;
            }
            #minimize-btn:hover {
                background: #ff8c00;
            }
            #close-btn {
                background: #ff4757;
                color: #fff;
            }
            #close-btn:hover {
                background: #ff3838;
            }
            #panel-content {
                padding: 15px;
                background: #333333;
                border-radius: 0 0 8px 8px;
            }
            .switch-container {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 15px;
            }
            .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 26px;
            }
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #555;
                transition: .3s;
                border-radius: 26px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: #4a90e2;
            }
            input:checked + .slider:before {
                transform: translateX(24px);
            }
            .routine-select-container {
                display: flex;
                gap: 6px;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #404040;
            }
            .routine-select-container select {
                flex: 1;
                background: #2c2c2c;
                border: 1px solid #555;
                color: #fff;
                padding: 6px 8px;
                border-radius: 3px;
                font-size: 12px;
            }
            .routine-btn {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }
            .routine-btn.add {
                background: #28a745;
                color: white;
            }
            .routine-btn.add:hover {
                background: #218838;
            }
            .routine-btn.delete {
                background: #dc3545;
                color: white;
            }
            .routine-btn.delete:hover {
                background: #c82333;
            }
            .section {
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #404040;
            }
            .section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                font-weight: bold;
                color: #4a90e2;
            }
            .rule-item {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
                padding: 8px;
                background: #404040;
                border-radius: 4px;
                flex-wrap: wrap;
            }
            .rule-item input, .rule-item select {
                background: #2c2c2c;
                border: 1px solid #555;
                color: #fff;
                padding: 4px 6px;
                border-radius: 3px;
                font-size: 11px;
            }
            .rule-item input {
                width: 50px;
            }
            .rule-item select {
                min-width: 120px;
                max-width: 150px;
            }
            .add-rule-btn, .delete-rule {
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
                transition: all 0.2s;
            }
            .add-rule-btn {
                width: 26px;
                height: 26px;
                background: #4a90e2;
                color: white;
                border-radius: 50%;
                font-size: 16px;
            }
            .add-rule-btn:hover {
                background: #357abd;
            }
            .delete-rule {
                width: 22px;
                height: 22px;
                background: #ff4757;
                color: white;
            }
            .delete-rule:hover {
                background: #ff3838;
            }
            .status-section {
                background: #2a2a2a;
                padding: 10px;
                border-radius: 4px;
                margin-top: 10px;
            }
            .status-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                font-size: 11px;
            }
            .status-item:last-child {
                margin-bottom: 0;
            }
            .status-value {
                color: #4a90e2;
                font-weight: bold;
            }
            .minimized #panel-content {
                display: none;
            }
            .minimized {
                width: 140px;
            }

            #settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10001;
                display: none;
                justify-content: center;
                align-items: center;
            }
            #settings-content {
                background: #2c2c2c;
                border-radius: 8px;
                width: 400px;
                max-height: 80vh;
                overflow-y: auto;
                color: #fff;
            }
            #settings-header {
                background: linear-gradient(135deg, #4a4a4a, #3a3a3a);
                padding: 15px;
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #settings-header h3 {
                margin: 0;
                font-size: 16px;
            }
            #settings-body {
                padding: 15px;
            }
            .monster-routine-item {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-bottom: 10px;
                padding: 8px;
                background: #404040;
                border-radius: 4px;
            }
            .monster-routine-item input {
                flex: 1;
                background: #2c2c2c;
                border: 1px solid #555;
                color: #fff;
                padding: 6px 8px;
                border-radius: 3px;
                font-size: 12px;
            }
            .monster-routine-item select {
                flex: 1;
                background: #2c2c2c;
                border: 1px solid #555;
                color: #fff;
                padding: 6px 8px;
                border-radius: 3px;
                font-size: 12px;
            }
            .monster-routine-item button {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                background: #dc3545;
                color: white;
                font-size: 14px;
            }
            .monster-routine-item button:hover {
                background: #c82333;
            }
            .add-monster-btn {
                width: 100%;
                padding: 8px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 10px;
            }
            .add-monster-btn:hover {
                background: #218838;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(panel);
        createSettingsModal();
        initBasicEvents();
    }

    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.innerHTML = `
            <div id="settings-content">
                <div id="settings-header">
                    <h3>怪物套路设置</h3>
                    <button id="close-settings" style="background: #ff4757; color: white; border: none; width: 28px; height: 28px; border-radius: 3px; cursor: pointer; font-size: 16px;">×</button>
                </div>
                <div id="settings-body">
                    <div id="monster-routines-list"></div>
                    <button class="add-monster-btn" id="add-monster-routine">+ 添加怪物套路</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        modal.querySelector('#close-settings').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.querySelector('#add-monster-routine').addEventListener('click', () => {
            const monster = prompt('请输入怪物名称（可以输入简化名称，如"钻石宝箱怪"）:');
            if (monster && monster.trim()) {
                const cleanMonster = extractPureText(monster.trim());

                let exists = false;
                for (const existingMonster of Object.keys(config.monsterRoutines)) {
                    if (matchMonsterName(cleanMonster, existingMonster)) {
                        exists = true;
                        showMessage(`类似怪物已存在: ${existingMonster}`, 'warning');
                        break;
                    }
                }

                if (!exists) {
                    config.monsterRoutines[cleanMonster] = 'default';
                    saveConfig();
                    updateMonsterRoutinesList();
                    showMessage(`已添加怪物: ${cleanMonster}`, 'success');
                }
            }
        });
    }

    function updateMonsterRoutinesList() {
        const list = document.getElementById('monster-routines-list');
        if (!list) return;

        list.innerHTML = '';

        const routineNames = Object.keys(config.routines);

        Object.entries(config.monsterRoutines).forEach(([monster, routine]) => {
            const item = document.createElement('div');
            item.className = 'monster-routine-item';
            item.innerHTML = `
                <input type="text" value="${monster}" readonly style="flex: 1;">
                <select data-monster="${monster}" style="flex: 1;">
                    ${routineNames.map(name =>
                        `<option value="${name}" ${routine === name ? 'selected' : ''}>${config.routines[name].name}</option>`
                    ).join('')}
                </select>
                <button data-monster="${monster}">×</button>
            `;
            list.appendChild(item);
        });

        list.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', (e) => {
                const monster = e.target.dataset.monster;
                config.monsterRoutines[monster] = e.target.value;
                saveConfig();
                showMessage(`已更新 ${monster} 的套路`, 'success');
            });
        });

        list.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const monster = e.target.dataset.monster;
                if (confirm(`确定删除怪物 "${monster}" 的套路设置吗？`)) {
                    delete config.monsterRoutines[monster];
                    saveConfig();
                    updateMonsterRoutinesList();
                    showMessage(`已删除 ${monster}`, 'success');
                }
            });
        });
    }

    function initBasicEvents() {
        const panel = document.getElementById('auto-equip-panel');
        const header = document.getElementById('panel-header');
        const minimizeBtn = document.getElementById('minimize-btn');
        const closeBtn = document.getElementById('close-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const enableSwitch = document.getElementById('enable-switch');

        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - dragOffset.x) + 'px';
            panel.style.top = (e.clientY - dragOffset.y) + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        minimizeBtn.addEventListener('click', () => {
            panel.classList.toggle('minimized');
            minimizeBtn.textContent = panel.classList.contains('minimized') ? '+' : '−';
        });

        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        settingsBtn.addEventListener('click', () => {
            const modal = document.getElementById('settings-modal');
            modal.style.display = 'flex';
            updateMonsterRoutinesList();
        });

        enableSwitch.addEventListener('change', async () => {
            config.enabled = enableSwitch.checked;
            saveConfig();

            const advancedPanel = document.getElementById('advanced-panel');
            if (config.enabled) {
                advancedPanel.style.display = 'block';
                showMessage('正在初始化...', 'info');

                setTimeout(async () => {
                    const success = await readEquipmentList();
                    if (success) {
                        showRoutineSelector();
                        showConfigPanel();
                    }
                }, 1000);
            } else {
                advancedPanel.style.display = 'none';
                showMessage('自动换装已关闭', 'warning');
            }
        });
    }

    function showRoutineSelector() {
        const routineSelector = document.getElementById('routine-selector');
        if (!routineSelector) return;

        routineSelector.style.display = 'block';
        routineSelector.innerHTML = `
            <div class="routine-select-container">
                <select id="routine-select">
                    ${Object.keys(config.routines).map(key =>
                        `<option value="${key}" ${config.currentRoutine === key ? 'selected' : ''}>${config.routines[key].name}</option>`
                    ).join('')}
                </select>
                <button class="routine-btn add" id="add-routine-btn" title="添加套路">+</button>
                <button class="routine-btn delete" id="delete-routine-btn" title="删除套路">×</button>
            </div>
        `;

        const select = document.getElementById('routine-select');
        const addBtn = document.getElementById('add-routine-btn');
        const deleteBtn = document.getElementById('delete-routine-btn');

        select.addEventListener('change', (e) => {
            const newRoutine = e.target.value;
            config.currentRoutine = newRoutine;
            saveConfig();

            const rulesList = document.getElementById('rules-list');
            if (rulesList) {
                updateRulesList();
            }

            showMessage(`切换到: ${config.routines[config.currentRoutine].name}`, 'success');
            console.log(`切换套路: ${config.routines[newRoutine].name}, 规则数量: ${config.routines[newRoutine].rules.length}`);
        });

        addBtn.addEventListener('click', () => {
            const name = prompt('请输入新套路名称:');
            if (name && name.trim()) {
                const key = 'routine_' + Date.now();
                config.routines[key] = {
                    name: name.trim(),
                    rules: []
                };
                config.currentRoutine = key;
                saveConfig();
                showRoutineSelector();
                updateRulesList();
                showMessage(`已创建套路: ${name}`, 'success');
            }
        });

        deleteBtn.addEventListener('click', () => {
            if (Object.keys(config.routines).length <= 1) {
                showMessage('至少需要保留一个套路', 'warning');
                return;
            }
            const currentRoutineName = config.routines[config.currentRoutine].name;
            if (confirm(`确定删除套路 "${currentRoutineName}" 吗？`)) {
                delete config.routines[config.currentRoutine];
                config.currentRoutine = Object.keys(config.routines)[0];
                saveConfig();
                showRoutineSelector();
                updateRulesList();
                showMessage('套路已删除', 'success');
            }
        });
    }

    function showConfigPanel() {
        const configSection = document.getElementById('config-section');

        if (configSection) {
            configSection.style.display = 'block';
            configSection.innerHTML = `
                <div class="section">
                    <div class="section-header">
                        <span>换装规则</span>
                        <button class="add-rule-btn" id="add-rule">+</button>
                    </div>
                    <div id="rules-list"></div>
                </div>
                <div class="status-section">
                    <div class="status-item">
                        <span>当前装备：</span><span class="status-value" id="current-equipment">-</span>
                    </div>
                    <div class="status-item">
                        <span>怪物血量：</span><span class="status-value" id="current-hp">-</span>
                    </div>
                    <div class="status-item">
                        <span>当前怪物：</span><span class="status-value" id="current-monster">-</span>
                    </div>
                    <div class="status-item">
                        <span>当前套路：</span><span class="status-value" id="current-routine-name">-</span>
                    </div>
                </div>
            `;

            initConfigEvents();
            updateRulesList();
            startStatusMonitor();
        }
    }

    function initConfigEvents() {
        const addRuleBtn = document.getElementById('add-rule');
        addRuleBtn.addEventListener('click', () => {
            if (config.equipmentList.length === 0) {
                showMessage('请先等待装备列表读取完成', 'error');
                return;
            }
            const routine = config.routines[config.currentRoutine];
            routine.rules.push({
                hp: 50,
                equipment: config.equipmentList[0]
            });
            saveConfig();
            updateRulesList();
        });
    }

    function updateRulesList() {
        const rulesList = document.getElementById('rules-list');
        if (!rulesList) return;

        const routine = config.routines[config.currentRoutine];
        if (!routine) {
            console.warn(`套路不存在: ${config.currentRoutine}`);
            return;
        }

        console.log(`更新规则列表 - 套路: ${routine.name}, 规则数: ${routine.rules.length}`);

        rulesList.innerHTML = '';

        if (routine.rules.length === 0) {
            rulesList.innerHTML = '<div style="color: #888; font-style: italic; padding: 10px; text-align: center;">暂无规则，点击+添加</div>';
            return;
        }

        routine.rules.forEach((rule, index) => {
            const ruleItem = document.createElement('div');
            ruleItem.className = 'rule-item';
            ruleItem.innerHTML = `
                <span>血量≤</span>
                <input type="number" value="${rule.hp}" min="0" max="100" class="hp-input" data-index="${index}">
                <span>%时用</span>
                <select class="equipment-select" data-index="${index}">
                    ${config.equipmentList.map(eq =>
                        `<option value="${eq}" ${rule.equipment === eq ? 'selected' : ''}>${eq}</option>`
                    ).join('')}
                </select>
                <button class="delete-rule" data-index="${index}">×</button>
            `;
            rulesList.appendChild(ruleItem);
        });

        rulesList.replaceWith(rulesList.cloneNode(true));
        const newRulesList = document.getElementById('rules-list');

        newRulesList.addEventListener('input', (e) => {
            if (e.target.classList.contains('hp-input')) {
                const index = parseInt(e.target.dataset.index);
                routine.rules[index].hp = parseInt(e.target.value) || 0;
                saveConfig();
                console.log(`更新规则 ${index} 的血量: ${routine.rules[index].hp}%`);
            }
        });

        newRulesList.addEventListener('change', (e) => {
            if (e.target.classList.contains('equipment-select')) {
                const index = parseInt(e.target.dataset.index);
                routine.rules[index].equipment = e.target.value;
                saveConfig();
                console.log(`更新规则 ${index} 的装备: ${routine.rules[index].equipment}`);
            }
        });

        newRulesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-rule')) {
                const index = parseInt(e.target.dataset.index);
                if (confirm(`确定删除规则 "血量≤${routine.rules[index].hp}%时用${routine.rules[index].equipment}" 吗？`)) {
                    routine.rules.splice(index, 1);
                    saveConfig();
                    updateRulesList();
                    showMessage('规则已删除', 'success');
                }
            }
        });
    }

    function startStatusMonitor() {
        setInterval(() => {
            const currentEquipment = getCurrentEquipment();
            const currentHP = getCurrentHP();
            const currentMonsterName = getCurrentMonster();

            const equipElement = document.getElementById('current-equipment');
            const hpElement = document.getElementById('current-hp');
            const monsterElement = document.getElementById('current-monster');
            const routineNameElement = document.getElementById('current-routine-name');

            if (equipElement) {
                equipElement.textContent = currentEquipment || '未知';
            }

            if (hpElement) {
                if (currentHP !== null && currentHP > 0) {
                    hpElement.textContent = `${currentHP.toFixed(1)}%`;
                    hpElement.style.color = currentHP <= 30 ? '#ff4757' :
                                             currentHP <= 60 ? '#ffa500' : '#2ed573';
                } else {
                    hpElement.textContent = '无战斗';
                    hpElement.style.color = '#888';
                }
            }

            if (monsterElement) {
                if (currentMonsterName) {
                    const shortName = currentMonsterName.length > 10 ?
                        currentMonsterName.substring(0, 10) + '...' : currentMonsterName;
                    monsterElement.textContent = shortName;
                    monsterElement.title = currentMonsterName;
                } else {
                    monsterElement.textContent = '-';
                    monsterElement.title = '';
                }
            }

            if (routineNameElement) {
                const routine = config.routines[config.currentRoutine];
                if (routine) {
                    routineNameElement.textContent = routine.name;
                }
            }
        }, 1000);
    }

    function resetSwitchState() {
        isSwitching = false;
        if (switchTimeout) {
            clearTimeout(switchTimeout);
            switchTimeout = null;
        }
    }

    function switchEquipment(targetEquipment) {
        if (isSwitching) return false;

        console.log(`🔄 执行换装: "${targetEquipment}"`);
        isSwitching = true;

        switchTimeout = setTimeout(() => {
            console.log('⚠️ 换装超时，重置状态');
            resetSwitchState();
        }, 5000);

        const selectWrapper = document.querySelector('.equip-routine-wrap .el-select__wrapper');
        if (!selectWrapper) {
            console.log('❌ 未找到装备选择框');
            resetSwitchState();
            return false;
        }

        selectWrapper.click();

        setTimeout(() => {
            const dropdown = document.querySelector('.el-select-dropdown__list');
            if (!dropdown) {
                console.log('❌ 下拉菜单未出现');
                resetSwitchState();
                return;
            }

            const options = dropdown.querySelectorAll('.el-select-dropdown__item');
            let found = false;

            options.forEach(option => {
                const span = option.querySelector('span');
                if (span && span.textContent.trim() === targetEquipment) {
                    console.log(`✅ 找到并点击: "${targetEquipment}"`);
                    option.click();
                    showMessage(`✅ 换装: ${targetEquipment}`, 'success');
                    found = true;
                }
            });

            if (!found) {
                console.log(`❌ 未找到装备: "${targetEquipment}"`);
                showMessage(`装备未找到: ${targetEquipment}`, 'error');
                document.body.click();
            }

            setTimeout(resetSwitchState, 1000);
        }, 300);

        return true;
    }

    function checkMonsterRoutineSwitch() {
        const monsterName = getCurrentMonster();

        if (!monsterName) {
            currentMonster = null;
            return;
        }

        if (currentMonster !== monsterName) {
            console.log(`🎯 检测到怪物: "${monsterName}"`);
            currentMonster = monsterName;

            let matchedRoutine = null;
            let matchedMonsterName = null;

            for (const [configuredMonster, routineKey] of Object.entries(config.monsterRoutines)) {
                if (matchMonsterName(monsterName, configuredMonster)) {
                    matchedRoutine = routineKey;
                    matchedMonsterName = configuredMonster;
                    console.log(`✅ 匹配成功: 当前"${monsterName}" 匹配配置"${configuredMonster}"`);
                    break;
                }
            }

            if (matchedRoutine && config.currentRoutine !== matchedRoutine) {
                const routineName = config.routines[matchedRoutine]?.name || matchedRoutine;
                console.log(`🔄 怪物 "${monsterName}" (匹配"${matchedMonsterName}") 切换套路到: ${routineName}`);

                config.currentRoutine = matchedRoutine;

                const routineSelect = document.getElementById('routine-select');
                if (routineSelect) {
                    routineSelect.value = matchedRoutine;
                }

                updateRulesList();
                showMessage(`🎯 ${routineName}`, 'info');
                lastMonsterRoutine = matchedRoutine;
            } else if (!matchedRoutine) {
                console.log(`ℹ️ 怪物 "${monsterName}" 未配置套路，使用当前套路`);
            }
        }
    }

    function checkAutoEquip() {
        if (!config.enabled) return;

        checkMonsterRoutineSwitch();

        const routine = config.routines[config.currentRoutine];
        if (!routine || routine.rules.length === 0) return;

        const currentHP = getCurrentHP();

        if (currentHP === null || currentHP <= 0) {
            return;
        }

        const currentEquipment = getCurrentEquipment();
        if (!currentEquipment) {
            console.log('⚠️ 无法获取当前装备，跳过换装检查');
            return;
        }

        const now = Date.now();
        if (isSwitching || now - lastSwitchTime < SWITCH_COOLDOWN) return;

        const sortedRules = [...routine.rules].sort((a, b) => a.hp - b.hp);
        let targetEquipment = null;
        let matchedRule = null;

        for (let rule of sortedRules) {
            if (currentHP <= rule.hp) {
                targetEquipment = rule.equipment;
                matchedRule = rule;
                break;
            }
        }

        if (!targetEquipment) {
            console.log(`📊 血量 ${currentHP}% 高于所有规则阈值，保持当前装备`);
            return;
        }

        if (currentEquipment !== targetEquipment) {
            console.log(`📊 血量: ${currentHP}% | 当前: "${currentEquipment}" | 目标: "${targetEquipment}" (规则≤${matchedRule.hp}%)`);
            if (switchEquipment(targetEquipment)) {
                lastSwitchTime = now;
            }
        }
    }

    function init() {
        loadConfig();
        createBasicPanel();

        if (config.enabled && config.equipmentList.length > 0) {
            setTimeout(() => {
                document.getElementById('advanced-panel').style.display = 'block';
                showRoutineSelector();
                showConfigPanel();
            }, 1000);
        }

        setInterval(checkAutoEquip, 2000);

        console.log('智能换装助手已启动');
        showMessage('智能换装助手已启动');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
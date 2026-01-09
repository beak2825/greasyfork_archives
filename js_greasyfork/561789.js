// ==UserScript==
// @name         迷宫助手测试服版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  迷宫助手
// @author       You
// @match        https://test.milkywayidle.com/*
// @match        https://test.milkywayidlecn.com/*
// @grant        notifications
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561789/%E8%BF%B7%E5%AE%AB%E5%8A%A9%E6%89%8B%E6%B5%8B%E8%AF%95%E6%9C%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561789/%E8%BF%B7%E5%AE%AB%E5%8A%A9%E6%89%8B%E6%B5%8B%E8%AF%95%E6%9C%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const skillTranslations = {
        'Milking': '挤奶',
        'Foraging': '采摘',
        'Woodcutting': '伐木',
        'Cheesemithing': '奶酪锻造',
        'Crafting': '制作',
        'Tailoring': '缝纫',
        'Cooking': '烹饪',
        'Brewing': '冲泡',
        'Alchemy': '炼金',
        'Enhancing': '强化',
        'Combat': '战斗',
        'Stamina': '耐力',
        'Intelligence': '智力',
        'Attack': '攻击',
        'Defense': '防御',
        'Melee': '近战',
        'Ranged': '远程',
        'Magic': '魔法'
    };

    let initialCharacterSkills = null;
    let lastCharacterSkills = null;
    let actionCompletedGainedExp = {};
    let battleStartTime = null;
    let battleTimerId = null;
    let mazeStartTime = null;
    let mazeTotalTime = 0; // 累计迷宫时长（秒）
    let mazeSessionTotalTime = 0; // 本次迷宫累计时长（秒）
    let isInMazeMode = false; // 当前是否在迷宫模式
    let mazeCheckTimerId = null;
    let lastSaveTime = 0; // 上次保存时长的时间戳
    const SAVE_INTERVAL = 5; // 保存间隔（秒）

    function formatTimeDiff(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        return totalSeconds >= 60 ? `${Math.floor(totalSeconds / 60)}m${totalSeconds % 60}s` : `${totalSeconds}s`;
    }

    function createSkillsMap(skills) {
        const skillsMap = {};
        skills.forEach(skill => skillsMap[skill.skillHrid] = skill.experience);
        return skillsMap;
    }

    function processSkillName(skillHrid) {
        let skillName = skillHrid.replace('/skills/', '');
        const normalizedSkillName = skillName.charAt(0).toUpperCase() + skillName.slice(1).toLowerCase();
        return skillTranslations[normalizedSkillName] || skillName;
    }

    function formatNumberWithUnits(number) {
        if (number >= 1000000) {
            return `${(number / 1000000).toFixed(2)}m`;
        } else if (number >= 1000) {
            return `${(number / 1000).toFixed(2)}k`;
        }
        return `${number.toFixed(2)}`;
    }

    // 计算每小时经验获取速率
    function calculateExpPerHour(expAmount, timeInSeconds) {
        if (timeInSeconds === 0) return '0';
        const expPerSecond = expAmount / timeInSeconds;
        const expPerHour = expPerSecond * 3600;
        return formatNumberWithUnits(expPerHour);
    }

    function formatSkillExp(skill, expDiff) {
        const skillName = processSkillName(skill.skillHrid);
        return `${skillName}：${formatNumberWithUnits(expDiff)}`;
    }

    function getCurrentExperienceArray(timeInSeconds = 0) {
        const experienceArray = [];
        for (const [skillHrid, exp] of Object.entries(actionCompletedGainedExp)) {
            if (exp > 0) {
                const tempSkill = { skillHrid: skillHrid };
                const expPerHour = calculateExpPerHour(exp, timeInSeconds);
                experienceArray.push(`${processSkillName(skillHrid)}：${formatNumberWithUnits(exp)}（${expPerHour}/h)`);
            }
        }
        return experienceArray;
    }

    function updateBattleTimeDisplay() {
        if (!battleStartTime) return;

        const now = new Date();
        const timeDiff = now - battleStartTime;

        const headerElement = document.querySelector('.Header_actionName__31-L2');
        if (headerElement) {
            const elementText = headerElement.textContent || headerElement.innerText;
            if (elementText.includes('迷宫')) {
                let timeElement = headerElement.querySelector('.battle-time-display');
                if (!timeElement) {
                    timeElement = document.createElement('div');
                    timeElement.className = 'battle-time-display';
                    timeElement.style.color = 'orange';
                    headerElement.appendChild(timeElement);
                }
                timeElement.textContent = `[战斗时长：${formatTimeDiff(timeDiff)}]`;
            } else {
                headerElement.querySelector('.battle-time-display')?.remove();
            }
        }
    }

    function checkMazeStatus() {
        const headerElement = document.querySelector('.Header_actionName__31-L2');
        if (headerElement) {
            const elementText = headerElement.textContent || headerElement.innerText;

            if (elementText.includes('迷宫')) {
                if (!isInMazeMode) {
                    // 进入迷宫模式，记录开始时间
                    mazeStartTime = new Date();
                    isInMazeMode = true;
                }
                // 更新历史经验显示（包含累计迷宫时长）
                updateHistoryExpDisplay(document.querySelector('.labyrinth-history-exp-display'));
                // 更新获得经验显示（包含本次迷宫时长）
                updateLabyrinthExpDisplay();
            } else {
                if (isInMazeMode) {
                    // 退出迷宫模式，累计时长（转换为秒）
                    const now = new Date();
                    const currentSessionTime = Math.floor((now - mazeStartTime) / 1000);
                    mazeTotalTime += currentSessionTime;
                    mazeSessionTotalTime += currentSessionTime;
                    mazeStartTime = null;
                    isInMazeMode = false;

                    // 退出迷宫模式时保存累计时长
                    saveMazeDurationToStorage();
                    // 更新历史经验显示（包含迷宫时长）
                    updateHistoryExpDisplay(document.querySelector('.labyrinth-history-exp-display'));
                }
                // 不要清零mazeTotalTime，保留累计时长
            }
        }
    }

    function isLabyrinthNavActive() {
        const navElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_navPanel__3wbAU > div > div.NavigationBar_navigationBar__1gRln > div.NavigationBar_navigationLinks__1XSSb > div:nth-child(4)");
        return navElement?.className?.includes("NavigationBar_active__3R-QS") || false;
    }

    function getLabyrinthShopTab(checkNavStatus = true) {
        if (checkNavStatus && !isLabyrinthNavActive()) return null;

        let labyrinthPanel = document.querySelector('.LabyrinthPanel_tabsComponentContainer__nYNJQ');
        if (labyrinthPanel) {
            const tabPanels = labyrinthPanel.querySelector('.TabsComponent_tabPanelsContainer__26mzo');
            if (tabPanels && tabPanels.children.length >= 3) return tabPanels.children[3];
        }

        let labyrinthShopTab = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7.GamePage_chatCollapsed__3pV19 > div.GamePage_mainPanel__2njyb > div > div:nth-child(2) > div > div.LabyrinthPanel_tabsComponentContainer__nYNJQ > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(3)");
        if (labyrinthShopTab) return labyrinthShopTab;

        let allTabPanels = document.querySelectorAll('.TabsComponent_tabPanelsContainer__26mzo');
        for (let i = 0; i < allTabPanels.length; i++) {
            if (allTabPanels[i].children.length >= 3) return allTabPanels[i].children[2];
        }

        return null;
    }

    function updateMazeTimeDisplay() {
        let currentSessionTime = 0;
        let now = new Date();

        if (isInMazeMode && mazeStartTime) {
            // 计算当前会话时长（转换为秒）
            currentSessionTime = Math.floor((now - mazeStartTime) / 1000);

            // 检查是否需要保存时长（每5秒保存一次）
            if (Math.floor((now - lastSaveTime) / 1000) >= SAVE_INTERVAL) {
                // 临时保存当前会话的时长
                const tempTotalTime = mazeTotalTime + currentSessionTime;
                localStorage.setItem('labyrinthTotalDuration', tempTotalTime.toString());
                lastSaveTime = now;
            }
        }

        // 总迷宫时长 = 累计时长 + 当前会话时长
        const totalMazeTime = mazeTotalTime + currentSessionTime;

        const labyrinthShopTab = getLabyrinthShopTab(false);
        if (labyrinthShopTab) {
            let timeDisplayElement = labyrinthShopTab.querySelector('.maze-time-display');
            if (!timeDisplayElement) {
                timeDisplayElement = document.createElement('div');
                timeDisplayElement.className = 'maze-time-display';
                // 使用与技能经验项一致的样式
                timeDisplayElement.style.cssText = 'color: orange;';

                // 将迷宫时长显示添加到累计经验显示的最下面
                const historyExpDisplayElement = labyrinthShopTab.querySelector('.labyrinth-history-exp-display');
                if (historyExpDisplayElement) {
                    const expContentDiv = historyExpDisplayElement.querySelector('div:nth-child(2)');
                    if (expContentDiv) {
                        expContentDiv.appendChild(timeDisplayElement);
                    } else {
                        historyExpDisplayElement.appendChild(timeDisplayElement);
                    }
                } else {
                    labyrinthShopTab.appendChild(timeDisplayElement);
                }
            }
            // 使用与技能经验一致的格式："项目：值"
            timeDisplayElement.textContent = `累计迷宫时长：${formatTimeDiff(totalMazeTime * 1000)}`;
        }
    }

    function updateLabyrinthExpDisplay() {
        try {
            const labyrinthShopTab = getLabyrinthShopTab(false);

            if (labyrinthShopTab) {
                let expDisplayElement = labyrinthShopTab.querySelector('.labyrinth-exp-display');
                if (!expDisplayElement) {
                    expDisplayElement = document.createElement('div');
                    expDisplayElement.className = 'labyrinth-exp-display';
                    expDisplayElement.style.cssText = 'margin-top: 20px; padding: 10px; background-color: rgba(0, 0, 0, 0.1); border-radius: 5px; color: white; font-size: 14px; z-index: 9999;';
                    labyrinthShopTab.appendChild(expDisplayElement);
                }

                // 计算本次迷宫累计时长
                let currentSessionTime = 0;
                if (isInMazeMode && mazeStartTime) {
                    currentSessionTime = Math.floor((new Date() - mazeStartTime) / 1000);
                }
                const totalSessionTime = mazeSessionTotalTime + currentSessionTime;

                // 获取包含每小时经验速率的经验数组
                const experienceArray = getCurrentExperienceArray(totalSessionTime);
                const experienceHtml = (experienceArray && experienceArray.length > 0) ? experienceArray.join('<br>') : '暂无';
                expDisplayElement.innerHTML = `<div style="font-weight: bold; margin-bottom: 5px;">本次迷宫获得经验:</div><div>${experienceHtml}</div><div style="color: orange;">本次迷宫时长：${formatTimeDiff(totalSessionTime * 1000)}</div>`;

                let historyExpDisplayElement = labyrinthShopTab.querySelector('.labyrinth-history-exp-display');
                if (!historyExpDisplayElement) {
                    historyExpDisplayElement = document.createElement('div');
                    historyExpDisplayElement.className = 'labyrinth-history-exp-display';
                    historyExpDisplayElement.style.cssText = 'margin-top: 20px; padding: 10px; background-color: rgba(0, 0, 0, 0.1); border-radius: 5px; color: white; font-size: 14px; z-index: 9999;';
                    labyrinthShopTab.appendChild(historyExpDisplayElement);
                }

                updateHistoryExpDisplay(historyExpDisplayElement);
            }
        } catch (error) {
            console.error('[经验显示] 更新迷宫商店经验显示失败:', error);
        }
    }

    function updateHistoryExpDisplay(element) {
        try {
            const totalExp = JSON.parse(localStorage.getItem('labyrinthTotalExp') || '{}');

            // 计算当前总迷宫时长
            let currentSessionTime = 0;
            if (isInMazeMode && mazeStartTime) {
                currentSessionTime = Math.floor((new Date() - mazeStartTime) / 1000);
            }
            const totalMazeTime = mazeTotalTime + currentSessionTime;

            // 创建清除按钮HTML
            const clearButtonHtml = '<button style="margin-right: 10px; padding: 2px 6px; background-color: rgba(255, 87, 34, 0.2); border: 1px solid rgba(255, 87, 34, 0.5); color: rgba(255, 87, 34, 0.8); border-radius: 3px; cursor: pointer; font-size: 12px;">清除</button>';

            if (Object.keys(totalExp).length > 0) {
                let historyHtml = `<div style="font-weight: bold; margin-bottom: 5px; display: flex; align-items: center;">${clearButtonHtml}累计获得经验:</div>`;
                Object.entries(totalExp).sort().forEach(([skillName, expValue]) => {
                    // 计算每小时经验获取速率
                    const expPerHour = calculateExpPerHour(expValue, totalMazeTime);
                    historyHtml += `<div>${skillName}：${formatNumberWithUnits(expValue)}（${expPerHour}/h）</div>`;
                });
                // 添加迷宫时长显示
                historyHtml += `<div style="color: orange;">累计迷宫时长：${formatTimeDiff(totalMazeTime * 1000)}</div>`;
                element.innerHTML = historyHtml;
            } else {
                let historyHtml = `<div style="font-weight: bold; margin-bottom: 5px; display: flex; align-items: center;">${clearButtonHtml}累计获得经验:</div><div>暂无累计经验</div>`;
                // 添加迷宫时长显示
                historyHtml += `<div style="color: orange;">累计迷宫时长：${formatTimeDiff(totalMazeTime * 1000)}</div>`;
                element.innerHTML = historyHtml;
            }

            // 绑定清除按钮事件
            const clearButton = element.querySelector('button');
            if (clearButton) {
                clearButton.onclick = function() {
                    // 创建网页内确认框
                    const confirmDiv = document.createElement('div');
                    confirmDiv.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: rgba(30, 30, 30, 0.9);
                        color: white;
                        padding: 20px;
                        border-radius: 5px;
                        z-index: 10000;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                        font-size: 14px;
                    `;

                    const confirmText = document.createElement('div');
                    confirmText.textContent = '确定要清除所有历史记录吗？';
                    confirmText.style.marginBottom = '15px';
                    confirmDiv.appendChild(confirmText);

                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.justifyContent = 'center';
                    buttonContainer.style.gap = '10px';
                    confirmDiv.appendChild(buttonContainer);

                    const confirmButton = document.createElement('button');
                    confirmButton.textContent = '确定';
                    confirmButton.style.cssText = `
                        padding: 5px 15px;
                        background-color: rgba(255, 87, 34, 0.7);
                        border: 1px solid rgba(255, 87, 34, 0.9);
                        color: white;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                    `;
                    confirmButton.onclick = function() {
                        clearHistory();
                        document.body.removeChild(confirmDiv);
                    };
                    buttonContainer.appendChild(confirmButton);

                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = '取消';
                    cancelButton.style.cssText = `
                        padding: 5px 15px;
                        background-color: rgba(120, 120, 120, 0.5);
                        border: 1px solid rgba(120, 120, 120, 0.7);
                        color: white;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                    `;
                    cancelButton.onclick = function() {
                        document.body.removeChild(confirmDiv);
                    };
                    buttonContainer.appendChild(cancelButton);

                    document.body.appendChild(confirmDiv);
                };
            }
        } catch (error) {
            console.error('[历史经验] 更新累计经验显示失败:', error);
            element.innerHTML = '<div style="font-weight: bold; margin-bottom: 5px;">累计获得经验:</div><div>加载失败</div>';
        }
    }

    function handleMessage(message, type) {
        const socket = this ? this.currentTarget : null;
        const url = socket ? socket.url : 'unknown';

        try {
            const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
            const messageType = parsedMessage.type || '未知类型';

            if (messageType === 'new_battle') {
                const headerElement = document.querySelector('.Header_actionName__31-L2');
                if (headerElement) {
                    const elementText = headerElement.textContent || headerElement.innerText;
                    if (elementText.includes('迷宫')) {
                        battleStartTime = new Date();
                        if (battleTimerId) clearInterval(battleTimerId);
                        updateBattleTimeDisplay();
                        battleTimerId = setInterval(updateBattleTimeDisplay, 1000);
                    }
                }
            }
            else if (messageType === 'action_completed') {
                if (parsedMessage.endCharacterSkills && initialCharacterSkills) {
                    const initialSkillsMap = createSkillsMap(initialCharacterSkills);
                    const lastSkillsMap = createSkillsMap(lastCharacterSkills);
                    const actionGainedExperience = [];
                    const expUpdates = {};
                    parsedMessage.endCharacterSkills.forEach(skill => {
                        if (skill.skillHrid === '/skills/total_level') return;

                        const initialExp = initialSkillsMap[skill.skillHrid] || 0;
                        const currentExp = skill.experience;
                        const lastExp = lastSkillsMap[skill.skillHrid] || initialExp;

                        // 本次非迷宫行动获得经验：当前经验 - 初始经验
                        const mazeSessionExp2 = currentExp - initialExp;
                        actionCompletedGainedExp[skill.skillHrid] = mazeSessionExp;

                        // 本次实际新增经验：当前经验 - 上次经验
                        const actualGainedExp2 = currentExp - lastExp;

                    });

                }
            }

            else if (messageType === 'skills_updated') {
                if (battleTimerId) {
                    clearInterval(battleTimerId);
                    battleTimerId = null;
                }

                if (parsedMessage.endCharacterSkills && initialCharacterSkills) {
                    const initialSkillsMap = createSkillsMap(initialCharacterSkills);
                    const lastSkillsMap = createSkillsMap(lastCharacterSkills);
                    const gainedExperience = [];
                    const expUpdates = {};

                    parsedMessage.endCharacterSkills.forEach(skill => {
                        if (skill.skillHrid === '/skills/total_level') return;

                        const initialExp = initialSkillsMap[skill.skillHrid] || 0;
                        const currentExp = skill.experience;
                        const lastExp = lastSkillsMap[skill.skillHrid] || initialExp;

                        // 本次迷宫获得经验：当前经验 - 初始经验
                        const mazeSessionExp = currentExp - initialExp;
                        actionCompletedGainedExp[skill.skillHrid] = mazeSessionExp;

                        // 本次实际新增经验：当前经验 - 上次经验
                        const actualGainedExp = currentExp - lastExp;

                        if (actualGainedExp > 0) {
                            const skillName = processSkillName(skill.skillHrid);
                            gainedExperience.push(formatSkillExp(skill, actualGainedExp));
                            expUpdates[skillName] = actualGainedExp;
                        }
                    });

                    updateLabyrinthExpDisplay();

                    // 更新累计经验，只累加实际新增的经验
                    if (Object.keys(expUpdates).length > 0) {
                        let totalExp = JSON.parse(localStorage.getItem('labyrinthTotalExp') || '{}');

                        Object.entries(expUpdates).forEach(([skillName, expValue]) => {
                            totalExp[skillName] = (totalExp[skillName] || 0) + expValue;
                        });

                        localStorage.setItem('labyrinthTotalExp', JSON.stringify(totalExp));
                    }
                }

                if (parsedMessage.endCharacterSkills) {
                    lastCharacterSkills = parsedMessage.endCharacterSkills.map(skill => ({
                        skillHrid: skill.skillHrid,
                        experience: skill.experience
                    }));
                }

                // 不要清空当前获得的经验值，以便在切换标签页时保持显示
            }
            else if (messageType === 'init_character_data') {
                if (parsedMessage.characterSkills) {
                    if (!initialCharacterSkills) {
                        initialCharacterSkills = parsedMessage.characterSkills.map(skill => ({
                            skillHrid: skill.skillHrid,
                            experience: skill.experience
                        }));
                        lastCharacterSkills = [...initialCharacterSkills];
                    } else {
                        lastCharacterSkills = parsedMessage.characterSkills.map(skill => ({
                            skillHrid: skill.skillHrid,
                            experience: skill.experience
                        }));
                    }
                }
            }

            if (messageType !== 'battle_updated' && messageType !== 'battle_consumable_ability_updated') {

            }
        } catch (parseErr) {
        }
    }

    function initWebSocketInterceptor() {
        const oriGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data").get;

        Object.defineProperty(MessageEvent.prototype, "data", {
            get: function() {
                const socket = this.currentTarget;
                if (!(socket instanceof WebSocket) || !socket.url || this._messageProcessed) return oriGet.call(this);

                const message = oriGet.call(this);
                try {
                    handleMessage.call(this, message, 'get');
                    this._messageProcessed = true;
                } catch (err) { console.error("[WebSocket拦截] 拦截接收消息时出错:", err); }
                return message;
            }
        });

        const originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(data) {
            try { handleMessage.call({ currentTarget: this }, data, 'send'); }
            catch (err) { console.error("[WebSocket拦截] 拦截发送消息时出错:", err); }
            return originalSend.apply(this, arguments);
        };
    }

    function initNavbarObserver(attempt = 0) {
        const maxAttempts = 15;
        const navElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_navPanel__3wbAU > div > div.NavigationBar_navigationBar__1gRln > div.NavigationBar_navigationLinks__1XSSb > div:nth-child(4)");

        if (navElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (isLabyrinthNavActive()) {
                            updateLabyrinthExpDisplay();
                            initLabyrinthTabObserver();
                        }
                    }
                });
            });

            observer.observe(navElement, { attributes: true });
        } else {
            if (attempt < maxAttempts) {
                setTimeout(() => initNavbarObserver(attempt + 1), 1000);
            }
        }
    }

    function initLabyrinthTabObserver(attempt = 0) {
        const maxAttempts = 5;
        const tabContainer = document.querySelector('.LabyrinthPanel_tabsComponentContainer__nYNJQ');

        if (tabContainer) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.className?.includes('active')) {
                        updateLabyrinthExpDisplay();
                    }
                });
            });
            observer.observe(tabContainer, { attributes: true, subtree: true });
        } else if (attempt < maxAttempts) {
            setTimeout(() => initLabyrinthTabObserver(attempt + 1), 1000);
        }
    }

    // 从localStorage加载累计迷宫时长
    function loadMazeDurationFromStorage() {
        const storedDuration = localStorage.getItem('labyrinthTotalDuration');
        if (storedDuration) {
            mazeTotalTime = parseInt(storedDuration) || 0;
        }
    }

    // 保存累计迷宫时长到localStorage
    function saveMazeDurationToStorage() {
        localStorage.setItem('labyrinthTotalDuration', mazeTotalTime.toString());
    }

    // 不再需要从localStorage加载获得经验数据，仅使用内存变量
    function loadGainedExperienceFromStorage() {
        // 直接使用空对象初始化
        actionCompletedGainedExp = {};
    }

    // 不再需要保存获得经验数据到localStorage，仅使用内存变量
    function saveGainedExperienceToStorage() {
        // 什么都不做，经验数据仅保存在内存中
    }

    // 清除历史记录函数
    function clearHistory() {
        // 清除localStorage中的数据
        localStorage.removeItem('labyrinthTotalExp');
        localStorage.removeItem('labyrinthTotalDuration');

        // 重置内存变量
        mazeTotalTime = 0;

        // 更新显示
        const labyrinthShopTab = getLabyrinthShopTab(false);
        if (labyrinthShopTab) {
            const historyExpDisplayElement = labyrinthShopTab.querySelector('.labyrinth-history-exp-display');
            if (historyExpDisplayElement) {
                updateHistoryExpDisplay(historyExpDisplayElement);
            }
        }

        // 重新检查迷宫状态以更新显示
        checkMazeStatus();
    }

    // 初始化脚本
    function init() {
        // 重置战斗时间相关变量
        battleStartTime = null;
        battleTimerId = null;

        // 重置当前会话的迷宫状态
        mazeStartTime = null;
        isInMazeMode = false;
        // 重置本次迷宫时长（仅在刷新后重置）
        mazeSessionTotalTime = 0;

        // 从localStorage加载累计迷宫时长
        loadMazeDurationFromStorage();
        // 初始化获得经验数据（仅使用内存变量）
        loadGainedExperienceFromStorage();

    updateBattleTimeDisplay();

    // 启动定期检查迷宫状态的定时器（每秒检查一次）
    if (mazeCheckTimerId) clearInterval(mazeCheckTimerId);
    checkMazeStatus(); // 立即检查一次
    mazeCheckTimerId = setInterval(checkMazeStatus, 1000);

    // 检查当前DOM状态并初始化监听器
    initNavbarObserver();
    initLabyrinthTabObserver();

    // 初始化WebSocket拦截器
    initWebSocketInterceptor();

    // 页面卸载前保存数据
    window.addEventListener('beforeunload', function() {
        saveMazeDurationToStorage();
        saveGainedExperienceToStorage();
    });

    // 处理页面可见性变化，确保迷宫状态在标签页切换时不丢失
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时保存当前迷宫状态
            if (isInMazeMode && mazeStartTime) {
                // 临时保存当前会话的迷宫状态
                localStorage.setItem('labyrinthCurrentSessionStartTime', mazeStartTime.getTime().toString());
                localStorage.setItem('labyrinthIsInMazeMode', 'true');
            }
        } else {
            // 页面显示时恢复迷宫状态
            const savedStartTime = localStorage.getItem('labyrinthCurrentSessionStartTime');
            const savedIsInMazeMode = localStorage.getItem('labyrinthIsInMazeMode');

            if (savedIsInMazeMode === 'true' && savedStartTime) {
                mazeStartTime = new Date(parseInt(savedStartTime));
                isInMazeMode = true;
                // 清除临时保存的状态
                localStorage.removeItem('labyrinthCurrentSessionStartTime');
                localStorage.removeItem('labyrinthIsInMazeMode');
            }
        }
    });
}

    // 运行初始化函数
    init();

})();
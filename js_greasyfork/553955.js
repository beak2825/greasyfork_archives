// ==UserScript==
// @name         Infinite Challenge
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动挑战选定的副本，智能检测战斗结束并自动返回，次数为零后自动停止。
// @author       Lunaris
// @match        https://aring.cc/awakening-of-war-soul-ol/
// @icon        https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/553955/Infinite%20Challenge.user.js
// @updateURL https://update.greasyfork.org/scripts/553955/Infinite%20Challenge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 副本配置
    const dungeons = {
        '装备挑战': {
            selector: '.daily-challenge .legend',
            needConfirm: false,
            autoReturn: true,
            buttonText: '开始'
        },
        '金币挑战': {
            selector: '.daily-challenge .gold',
            needConfirm: false,
            autoReturn: true,
            buttonText: '开始'
        },
        '钻石挑战': {
            selector: '.daily-challenge .diamond',
            needConfirm: false,
            autoReturn: true,
            buttonText: '开始'
        },
        '不朽之塔': {
            selector: '.eternal-tower .antiquity',
            needConfirm: true,
            autoReturn: false,
            buttonText: '进入'
        },
        '符石尖塔': {
            selector: '.rune-tower .awaken',
            needConfirm: true,
            autoReturn: false,
            buttonText: '进入',
            filter: (el) => el.textContent.trim() === '符石尖塔'
        },
        '符石神殿': {
            selector: '.rune-tower .awaken',
            needConfirm: true,
            autoReturn: false,
            buttonText: '开始战斗',
            filter: (el) => el.textContent.trim() === '符石神殿'
        },
        '无尽之塔': {
            selector: '.endless-tower .darkGold',
            needConfirm: true,
            autoReturn: false,
            buttonText: '进入'
        }
    };

    let isRunning = false;
    let selectedDungeon = null;
    let battleState = 'idle';
    let lastHp = null;
    let battleCheckCount = 0;
    let statusDisplay = null;
    let isMinimized = false;

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'dungeon-auto-panel';
        panel.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 6px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 10000;
            width: 150px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            border: 1px solid #333;
            cursor: move;
        `;

        // 标题栏
        const header = document.createElement('div');
        header.id = 'dungeon-header';
        header.style.cssText = `
            background: linear-gradient(90deg, #2c3e50, #34495e);
            padding: 6px 8px;
            border-radius: 5px 5px 0 0;
            font-weight: bold;
            font-size: 11px;
            color: #4CAF50;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        header.innerHTML = `
            <span id="header-text">副本自动挑战</span>
            <div>
                <button id="minimize-btn" style="
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 0 4px;
                    margin-left: 4px;
                " title="最小化">−</button>
                <button id="close-btn" style="
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 0 4px;
                    margin-left: 4px;
                " title="关闭">×</button>
            </div>
        `;

        // 内容区域
        const content = document.createElement('div');
        content.id = 'dungeon-content';
        content.style.cssText = `
            padding: 10px;
            font-size: 11px;
            line-height: 1.4;
        `;
        content.innerHTML = `
            <div style="margin-bottom: 8px;">
                <select id="dungeon-select" style="width: 100%; padding: 4px; background: #2c3e50; color: white; border: 1px solid #444; border-radius: 3px; font-size: 11px;">
                    <option value="">请选择副本</option>
                    ${Object.keys(dungeons).map(name => `<option value="${name}">${name}</option>`).join('')}
                </select>
            </div>
            <div id="dungeon-info" style="margin-bottom: 8px; color: #17A2B8; font-size: 10px;"></div>
            <div style="margin-bottom: 8px;">
                <button id="dungeon-start" style="width: 100%; padding: 6px; background: #28A745; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                    开始挑战
                </button>
                <button id="dungeon-stop" style="width: 100%; padding: 6px; background: #DC3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; display: none;">
                    停止挑战
                </button>
            </div>
            <div id="dungeon-status" style="color: #6C757D; font-size: 10px; line-height: 1.3;"></div>
        `;

        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        // 添加拖拽功能
        let startX, startY, panelX, panelY, isDragging = false;

        header.addEventListener('mousedown', (e) => {
            if (e.target.id === 'minimize-btn' || e.target.id === 'close-btn') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            panelX = rect.left;
            panelY = rect.top;
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        });

        function handleDrag(e) {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const newX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, panelX + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, panelY + deltaY));
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.right = 'auto';
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        // 最小化功能
        const minimizeBtn = header.querySelector('#minimize-btn');
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMinimize();
        });

        // 关闭功能
        const closeBtn = header.querySelector('#close-btn');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isRunning) {
                if (confirm('挑战正在进行中，确定要关闭吗？')) {
                    stopAuto();
                    panel.style.display = 'none';
                }
            } else {
                panel.style.display = 'none';
            }
        });

        // 绑定事件
        content.querySelector('#dungeon-select').addEventListener('change', updateDungeonInfo);
        content.querySelector('#dungeon-start').addEventListener('click', startAuto);
        content.querySelector('#dungeon-stop').addEventListener('click', stopAuto);

        return panel;
    }

    // 切换最小化状态
    function toggleMinimize() {
        const content = statusDisplay.querySelector('#dungeon-content');
        const minimizeBtn = statusDisplay.querySelector('#minimize-btn');
        const headerText = statusDisplay.querySelector('#header-text');

        isMinimized = !isMinimized;

        if (isMinimized) {
            content.style.display = 'none';
            statusDisplay.style.width = 'auto';
            statusDisplay.style.minWidth = '120px';
            minimizeBtn.textContent = '+';
            minimizeBtn.title = '展开';

            // 更新最小化标题
            if (isRunning) {
                headerText.textContent = `挑战中...`;
            } else {
                headerText.textContent = '副本挑战';
            }
        } else {
            content.style.display = 'block';
            statusDisplay.style.width = '120px';
            statusDisplay.style.minWidth = '120px';
            minimizeBtn.textContent = '−';
            minimizeBtn.title = '最小化';
            headerText.textContent = '副本自动挑战';
        }
    }

    // 更新副本信息
    function updateDungeonInfo() {
        const select = document.getElementById('dungeon-select');
        const info = document.getElementById('dungeon-info');
        selectedDungeon = select.value;

        if (!selectedDungeon) {
            info.textContent = '';
            return;
        }

        const remainingTimes = getRemainingTimes(selectedDungeon);
        if (remainingTimes !== null) {
            info.textContent = `剩余次数: ${remainingTimes}`;
        } else {
            info.textContent = '无法获取次数信息';
        }
    }

    // 获取剩余次数
    function getRemainingTimes(dungeonName) {
        const config = dungeons[dungeonName];
        const elements = document.querySelectorAll(config.selector);

        let targetElement = null;
        if (config.filter) {
            for (let el of elements) {
                if (config.filter(el)) {
                    targetElement = el;
                    break;
                }
            }
        } else {
            targetElement = elements[0];
        }

        if (!targetElement) return null;

        const container = targetElement.closest('.border-wrap');
        if (!container) return null;

        const text = container.textContent;
        const match = text.match(/(?:剩余)?次数[：:]\s*(\d+)/);

        return match ? parseInt(match[1]) : null;
    }

    // 查找并点击按钮
    function clickDungeonButton(dungeonName) {
        const config = dungeons[dungeonName];
        const elements = document.querySelectorAll(config.selector);

        let targetElement = null;
        if (config.filter) {
            for (let el of elements) {
                if (config.filter(el)) {
                    targetElement = el;
                    break;
                }
            }
        } else {
            targetElement = elements[0];
        }

        if (!targetElement) return false;

        const container = targetElement.closest('.border-wrap');
        if (!container) return false;

        const buttons = container.querySelectorAll('button');
        for (let btn of buttons) {
            if (btn.textContent.includes(config.buttonText)) {
                btn.click();
                return true;
            }
        }

        return false;
    }

    // 点击确定按钮
    function clickConfirmButton() {
        const buttons = document.querySelectorAll('button.el-button--primary.is-plain');
        for (let btn of buttons) {
            if (btn.textContent.includes('确定')) {
                btn.click();
                return true;
            }
        }
        return false;
    }

    // 点击返回按钮
    function clickReturnButton() {
        const buttons = document.querySelectorAll('button.el-button--success.is-plain.main');
        for (let btn of buttons) {
            if (btn.textContent.includes('返回') && btn.style.display !== 'none') {
                btn.click();
                return true;
            }
        }
        return false;
    }

    // 获取战斗数据
    function getBattleData() {
        const personFight = document.querySelector('.person-fight');
        const teamFight = document.querySelector('.team-fight');

        let battleData = null;

        // 优先检查个人战斗，然后检查团队战斗
        const fightElement = personFight || teamFight;

        if (fightElement) {
            const hpElement = fightElement.querySelector('.el-progress-bar__innerText span');
            const timeElement = fightElement.querySelector('.fight-over-timer');

            if (hpElement && timeElement) {
                const hpText = hpElement.textContent.trim().replace('%', '').replace(/\s/g, '');
                const timeText = timeElement.textContent.trim();

                // 打印调试信息
                console.log('[副本挑战] 血量文本:', hpElement.textContent, '=> 解析后:', hpText);
                console.log('[副本挑战] 时间文本:', timeText);

                battleData = {
                    hp: hpText,
                    time: timeText
                };
            } else {
                console.log('[副本挑战] 未找到血量或时间元素', {
                    hpElement: !!hpElement,
                    timeElement: !!timeElement,
                    fightType: personFight ? 'person' : 'team'
                });
            }
        } else {
            console.log('[副本挑战] 未找到战斗界面');
        }

        return battleData;
    }

    // 检测战斗是否活跃
    function isBattleActive(battleData) {
        if (!battleData || !battleData.hp || !battleData.time) {
            console.log('[副本挑战] 战斗不活跃 - 数据缺失:', battleData);
            return false;
        }

        // 如果时间为00:00或血量为0%，认为战斗未活跃
        const timeSeconds = parseTimeToSeconds(battleData.time);
        const hpPercent = parseFloat(battleData.hp);

        console.log('[副本挑战] 战斗状态检查:', {
            time: battleData.time,
            timeSeconds,
            hp: battleData.hp,
            hpPercent,
            isActive: timeSeconds > 0 && hpPercent > 0
        });

        if (timeSeconds === 0 || hpPercent === 0 || isNaN(hpPercent)) {
            return false;
        }

        return true;
    }

    // 解析时间字符串为秒数
    function parseTimeToSeconds(timeStr) {
        const parts = timeStr.split(' : ');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 0;
    }

    // 检查战斗是否结束
    function isBattleFinished() {
        const battleData = getBattleData();

        if (!battleData) {
            console.log('[副本挑战] 战斗已结束 - 无战斗数据');
            return true;
        }

        const hpPercent = parseFloat(battleData.hp);

        // 血量为0表示战斗结束
        if (hpPercent === 0) {
            console.log('[副本挑战] 战斗已结束 - 血量为0');
            return true;
        }

        // 检查是否有"挑战成功"或"挑战失败"文本
        const fightInfos = document.querySelectorAll('.fight-res-info');
        for (let info of fightInfos) {
            const text = info.textContent;
            if (text.includes('挑战成功') || text.includes('挑战失败')) {
                console.log('[副本挑战] 战斗已结束 - 发现结束文本:', text.includes('挑战成功') ? '挑战成功' : '挑战失败');
                return true;
            }
        }

        console.log('[副本挑战] 战斗进行中 - 血量:', hpPercent.toFixed(1) + '%');
        return false;
    }

    // 开始自动挑战
    function startAuto() {
        if (!selectedDungeon) {
            alert('请先选择副本！');
            return;
        }

        const remainingTimes = getRemainingTimes(selectedDungeon);
        if (remainingTimes === null) {
            alert('无法获取副本信息，请确认页面已加载完成！');
            return;
        }

        if (remainingTimes <= 0) {
            alert('该副本剩余次数为0！');
            return;
        }

        isRunning = true;
        battleState = 'idle';
        lastHp = null;
        battleCheckCount = 0;

        document.getElementById('dungeon-start').style.display = 'none';
        document.getElementById('dungeon-stop').style.display = 'block';
        document.getElementById('dungeon-select').disabled = true;

        updateStatus('开始挑战...');
        runAutoChallenge();
    }

    // 停止自动挑战
    function stopAuto() {
        isRunning = false;
        battleState = 'idle';
        document.getElementById('dungeon-start').style.display = 'block';
        document.getElementById('dungeon-stop').style.display = 'none';
        document.getElementById('dungeon-select').disabled = false;
        updateStatus('已停止');
    }

    // 更新状态
    function updateStatus(msg) {
        const statusEl = document.getElementById('dungeon-status');
        if (statusEl) {
            statusEl.innerHTML = msg;
        }
    }

    // 执行自动挑战
    function runAutoChallenge() {
        if (!isRunning) return;

        const remainingTimes = getRemainingTimes(selectedDungeon);
        updateDungeonInfo();

        if (remainingTimes === null || remainingTimes <= 0) {
            updateStatus('<div style="color: #28A745;">挑战完成！</div>');
            stopAuto();
            return;
        }

        const config = dungeons[selectedDungeon];
        const battleData = getBattleData();

        // 状态机处理
        if (battleState === 'idle') {
            // 空闲状态，开始新的挑战
            updateStatus(`<div>正在挑战...</div><div style="color: #FFC107;">剩余次数: ${remainingTimes}</div>`);

            if (clickDungeonButton(selectedDungeon)) {
                battleState = config.needConfirm ? 'confirming' : 'fighting';
                battleCheckCount = 0;
                setTimeout(runAutoChallenge, 500);
            } else {
                setTimeout(runAutoChallenge, 1000);
            }
        }
        else if (battleState === 'confirming') {
            // 等待确认
            if (clickConfirmButton()) {
                battleState = 'fighting';
                battleCheckCount = 0;
                updateStatus('<div style="color: #17A2B8;">战斗中...</div>');
            }
            setTimeout(runAutoChallenge, 500);
        }
        else if (battleState === 'fighting') {
            // 战斗中，监测战斗状态
            if (battleData && isBattleActive(battleData)) {
                const hpPercent = parseFloat(battleData.hp);

                // 更新最后血量
                lastHp = hpPercent;

                // 检查战斗是否结束
                if (isBattleFinished()) {
                    console.log('[副本挑战] 检测到战斗结束，等待返回');
                    updateStatus('<div style="color: #28A745;">战斗结束，准备返回...</div>');

                    if (config.autoReturn) {
                        // 自动返回的副本，等待更长时间确保返回完成
                        battleState = 'idle';
                        setTimeout(runAutoChallenge, 3000);
                    } else {
                        // 需要手动返回的副本
                        battleState = 'waiting_return';
                        setTimeout(runAutoChallenge, 1500);
                    }
                } else {
                    // 战斗还在继续
                    updateStatus(`<div style="color: #17A2B8;">战斗中...</div><div style="color: #DC3545;">怪物血量: ${hpPercent.toFixed(1)}%</div>`);
                    setTimeout(runAutoChallenge, 1000);
                }
            } else {
                // 战斗界面消失或不活跃
                console.log('[副本挑战] 战斗界面消失，检查次数:', battleCheckCount);
                battleCheckCount++;

                if (battleCheckCount > 5) {
                    // 确认战斗已结束，重置状态
                    console.log('[副本挑战] 确认战斗已结束，返回idle状态');
                    battleState = 'idle';
                    battleCheckCount = 0;
                    setTimeout(runAutoChallenge, 2000);
                } else {
                    setTimeout(runAutoChallenge, 500);
                }
            }
        }
        else if (battleState === 'waiting_return') {
            // 等待返回
            if (clickReturnButton()) {
                updateStatus('<div style="color: #28A745;">已返回，准备下一次挑战...</div>');
                battleState = 'idle';
                setTimeout(runAutoChallenge, 2000);
            } else {
                // 检查是否战斗界面已消失（可能已自动返回）
                if (!battleData || !isBattleActive(battleData)) {
                    battleCheckCount++;
                    if (battleCheckCount > 3) {
                        battleState = 'idle';
                        setTimeout(runAutoChallenge, 1000);
                    } else {
                        setTimeout(runAutoChallenge, 500);
                    }
                } else {
                    battleCheckCount = 0;
                    setTimeout(runAutoChallenge, 500);
                }
            }
        }
    }

    // 初始化
    console.log('副本自动挑战脚本已启动');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                statusDisplay = createControlPanel();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            statusDisplay = createControlPanel();
        }, 1000);
    }
})();
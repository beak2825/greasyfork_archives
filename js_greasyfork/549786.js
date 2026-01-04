// ==UserScript==
// @name         WarSoul Battle Monitor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  根据怪物血量下降速度，预测是否能按时击败怪物
// @author       Lunaris
// @match        https://aring.cc/awakening-of-war-soul-ol/
// @match        https://aring.cc/*
// @icon         https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549786/WarSoul%20Battle%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/549786/WarSoul%20Battle%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let monitoringData = {
        person: { lastHp: null, lastTime: null, samples: [], lastMonster: null, totalTime: null, timeHistory: [], maxHp: null },
        team: { lastHp: null, lastTime: null, samples: [], lastMonster: null, totalTime: null, timeHistory: [], maxHp: null }
    };

    let statusDisplay = null;
    let isMinimized = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let currentPrediction = null;
    let lastActiveBattleInfo = null;

    // 创建状态显示面板
    function createStatusDisplay() {
        const panel = document.createElement('div');
        panel.id = 'battle-monitor-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 6px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 10000;
            width: 140px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            border: 1px solid #333;
            display: none;
            cursor: move;
        `;

        const header = document.createElement('div');
        header.id = 'monitor-header';
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
            <span id="header-text">副本监控</span>
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
            </div>
        `;

        const content = document.createElement('div');
        content.id = 'monitor-content';
        content.style.cssText = `
            padding: 8px;
            font-size: 11px;
            line-height: 1.3;
        `;
        content.innerHTML = '等待检测战斗...';

        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        let startX, startY, panelX, panelY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.id === 'minimize-btn') return;
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

        const minimizeBtn = header.querySelector('#minimize-btn');
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMinimize();
        });

        return panel;
    }

    function toggleMinimize() {
        const content = statusDisplay.querySelector('#monitor-content');
        const minimizeBtn = statusDisplay.querySelector('#minimize-btn');
        const headerText = statusDisplay.querySelector('#header-text');

        isMinimized = !isMinimized;

        if (isMinimized) {
            content.style.display = 'none';
            statusDisplay.style.width = 'auto';
            statusDisplay.style.minWidth = '80px';
            minimizeBtn.textContent = '+';
            minimizeBtn.title = '展开';
            updateMinimizedHeader();
        } else {
            content.style.display = 'block';
            statusDisplay.style.width = '200px';
            statusDisplay.style.minWidth = '200px';
            minimizeBtn.textContent = '−';
            minimizeBtn.title = '最小化';
            headerText.textContent = '副本监控';
            headerText.style.color = '#4CAF50';
        }
    }

    function updateMinimizedHeader() {
        if (!isMinimized) return;

        const headerText = statusDisplay.querySelector('#header-text');

        if (currentPrediction) {
            if (currentPrediction.canFinish) {
                headerText.textContent = '轻松拿下🥰';
                headerText.style.color = '#28A745';
            } else {
                headerText.textContent = '打不过🥹';
                headerText.style.color = '#DC3545';
            }
        } else {
            headerText.textContent = '收集中...';
            headerText.style.color = '#6C757D';
        }
    }

    function showPanel() {
        if (!statusDisplay) {
            statusDisplay = createStatusDisplay();
        }
        statusDisplay.style.display = 'block';
    }

    function hidePanel() {
        if (statusDisplay) {
            statusDisplay.style.display = 'none';
        }
    }

    function parseTimeToSeconds(timeStr) {
        const parts = timeStr.split(' : ');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 0;
    }

    function formatSecondsToTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    function detectDungeonTime(battleType, currentTimeSeconds) {
        const data = monitoringData[battleType];

        if (data.totalTime !== null) {
            return data.totalTime;
        }

        data.timeHistory.push(currentTimeSeconds);

        if (data.timeHistory.length > 10) {
            data.timeHistory.shift();
        }

        if (data.timeHistory.length < 3) {
            return null;
        }

        const maxTime = Math.max(...data.timeHistory);
        const commonDurations = [30, 180, 300];

        let bestMatch = null;
        let minDiff = Infinity;

        for (const duration of commonDurations) {
            const diff = Math.abs(maxTime - duration);
            if (diff < minDiff && maxTime <= duration) {
                minDiff = diff;
                bestMatch = duration;
            }
        }

        if (bestMatch && minDiff <= 5) {
            data.totalTime = bestMatch;
            console.log(`动态识别副本时长: ${bestMatch}秒 (${formatSecondsToTime(bestMatch)})`);
            return bestMatch;
        }

        if (maxTime > 300) {
            const roundedTime = Math.ceil(maxTime / 30) * 30;
            data.totalTime = roundedTime;
            console.log(`使用向上取整时长: ${roundedTime}秒 (${formatSecondsToTime(roundedTime)})`);
            return roundedTime;
        }

        return null;
    }

    function isBattleActive(battleData) {
        if (!battleData.hp || !battleData.time) return false;

        const timeSeconds = parseTimeToSeconds(battleData.time);
        const hpPercent = parseFloat(battleData.hp);

        if (timeSeconds === 0 || hpPercent === 0) return false;

        return true;
    }

    // 灵活获取血量元素（支持动态 data-v-* 属性）
    function getHpElement(container) {
        // 方法1: 直接查找标准选择器
        let hpElement = container.querySelector('.el-progress-bar__innerText span');
        
        // 方法2: 如果方法1失败，通过结构查找（不依赖 data-v-* 属性）
        if (!hpElement) {
            const progressBars = container.querySelectorAll('.el-progress-bar__innerText');
            for (const bar of progressBars) {
                const span = bar.querySelector('span');
                if (span && span.textContent.includes('%')) {
                    hpElement = span;
                    break;
                }
            }
        }
        
        // 方法3: 通过进度条结构查找
        if (!hpElement) {
            const progressDivs = container.querySelectorAll('.el-progress');
            for (const div of progressDivs) {
                const innerText = div.querySelector('.el-progress-bar__innerText');
                if (innerText) {
                    const span = innerText.querySelector('span');
                    if (span && span.textContent.includes('%')) {
                        hpElement = span;
                        break;
                    }
                }
            }
        }
        
        return hpElement;
    }

    // 灵活获取怪物名称元素
    function getMonsterElement(container) {
        // 方法1: 尝试已知的 data-v-* 属性
        let monsterElement = container.querySelector('h2[data-v-c8bc98e2]');
        
        // 方法2: 查找按钮中的怪物名称（新结构）
        if (!monsterElement) {
            const buttons = container.querySelectorAll('button.common-btn');
            for (const btn of buttons) {
                const h2Elements = btn.querySelectorAll('h2');
                for (const h2 of h2Elements) {
                    const text = h2.textContent.trim();
                    // 排除"暂无战斗"，选择有效的怪物名称
                    if (text && 
                        text.length > 0 && 
                        text.length < 50 && 
                        !text.includes('暂无战斗') &&
                        h2.style.display !== 'none') {
                        monsterElement = h2;
                        break;
                    }
                }
                if (monsterElement) break;
            }
        }
        
        // 方法3: 查找所有 h2，选择最可能的那个
        if (!monsterElement) {
            const h2Elements = container.querySelectorAll('h2');
            for (const h2 of h2Elements) {
                const text = h2.textContent.trim();
                // 筛选：非空文本、长度合理、不是"暂无战斗"、不是隐藏的
                if (text && 
                    text.length > 0 && 
                    text.length < 50 && 
                    !text.includes('暂无战斗') &&
                    h2.style.display !== 'none') {
                    monsterElement = h2;
                    break;
                }
            }
        }
        
        return monsterElement;
    }

    function getBattleData() {
        const personFight = document.querySelector('.person-fight');
        const teamFight = document.querySelector('.team-fight');

        let personData = null;
        let teamData = null;

        if (personFight) {
            const hpElement = getHpElement(personFight);
            const timeElement = personFight.querySelector('.fight-over-timer');
            const monsterElement = getMonsterElement(personFight);
            const maxHpElement = personFight.querySelector('.monster-extra-info span');

            if (hpElement && timeElement && monsterElement) {
                let maxHp = null;
                if (maxHpElement) {
                    const hpText = maxHpElement.textContent.trim();
                    const parts = hpText.split(' / ');
                    if (parts.length === 2) {
                        maxHp = parseInt(parts[1].replace(/,/g, ''));
                    }
                }

                personData = {
                    hp: hpElement.textContent.trim().replace('%', '').trim(),
                    time: timeElement.textContent.trim(),
                    monster: monsterElement.textContent.trim(),
                    type: 'person',
                    maxHp: maxHp
                };
            }
        }

        if (teamFight) {
            const hpElement = getHpElement(teamFight);
            const timeElement = teamFight.querySelector('.fight-over-timer');
            const monsterElement = getMonsterElement(teamFight);
            const maxHpElement = teamFight.querySelector('.monster-extra-info span');

            if (hpElement && timeElement && monsterElement) {
                let maxHp = null;
                if (maxHpElement) {
                    const hpText = maxHpElement.textContent.trim();
                    const parts = hpText.split(' / ');
                    if (parts.length === 2) {
                        maxHp = parseInt(parts[1].replace(/,/g, ''));
                    }
                }

                teamData = {
                    hp: hpElement.textContent.trim().replace('%', '').trim(),
                    time: timeElement.textContent.trim(),
                    monster: monsterElement.textContent.trim(),
                    type: 'team',
                    maxHp: maxHp
                };
            }
        }

        let activeBattle = null;

        if (personData && isBattleActive(personData)) {
            activeBattle = personData;
        } else if (teamData && isBattleActive(teamData)) {
            activeBattle = teamData;
        }

        return { personData, teamData, activeBattle };
    }

    function isNewBattle(activeBattle) {
        if (!activeBattle) return false;

        if (!lastActiveBattleInfo) {
            console.log('首次检测到战斗:', activeBattle.monster);
            return true;
        }

        if (activeBattle.monster !== lastActiveBattleInfo.monster) {
            console.log('检测到怪物变化:', lastActiveBattleInfo.monster, '->', activeBattle.monster);
            return true;
        }

        if (activeBattle.type !== lastActiveBattleInfo.type) {
            console.log('检测到战斗类型变化:', lastActiveBattleInfo.type, '->', activeBattle.type);
            return true;
        }

        const currentTime = parseTimeToSeconds(activeBattle.time);
        const lastTime = parseTimeToSeconds(lastActiveBattleInfo.time);

        if (currentTime > lastTime) {
            console.log('检测到时间重置（新战斗）:', lastTime, 's ->', currentTime, 's');
            return true;
        }

        return false;
    }

    function detectHeal(battleType, currentHp, currentTime) {
        const data = monitoringData[battleType];

        if (!data.lastHp || !data.lastTime) {
            return false;
        }

        const lastTimeSeconds = parseTimeToSeconds(data.lastTime);
        const currentTimeSeconds = parseTimeToSeconds(currentTime);

        if (currentHp > data.lastHp && currentTimeSeconds <= lastTimeSeconds) {
            console.log(`检测到${battleType}怪物回血:`, data.lastHp, '% ->', currentHp, '%', '时间:', data.lastTime, '->', currentTime);
            return true;
        }

        return false;
    }

    function calculateProgress(battleType, currentHp, currentTime, maxHp) {
        const data = monitoringData[battleType];
        const now = Date.now();

        // 更新最大血量
        if (maxHp !== null) {
            data.maxHp = maxHp;
        }

        if (detectHeal(battleType, currentHp, currentTime)) {
            console.log(`${battleType}怪物回血，清空样本重新计算`);
            data.samples = [];
        }

        data.lastHp = currentHp;
        data.lastTime = currentTime;

        const currentTimeSeconds = parseTimeToSeconds(currentTime);
        const totalTime = detectDungeonTime(battleType, currentTimeSeconds);

        data.samples.push({
            hp: currentHp,
            time: currentTime,
            timestamp: now
        });

        if (data.samples.length > 30) {
            data.samples.shift();
        }

        if (data.samples.length < 3) {
            return { totalTime, maxHp: data.maxHp };
        }

        const samples = data.samples;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = samples.length;

        const firstTimestamp = samples[0].timestamp;
        for (let i = 0; i < n; i++) {
            const x = (samples[i].timestamp - firstTimestamp) / 1000;
            const y = samples[i].hp;
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }

        const denominator = n * sumXX - sumX * sumX;
        if (denominator === 0) {
            return { totalTime, maxHp: data.maxHp };
        }

        const slope = (n * sumXY - sumX * sumY) / denominator;

        if (slope >= 0) {
            return { totalTime, maxHp: data.maxHp };
        }

        const hpPerSecond = -slope;
        const remainingTime = parseTimeToSeconds(currentTime);
        const predictedHpDrop = hpPerSecond * remainingTime;
        const finalHp = currentHp - predictedHpDrop;

        return {
            hpPerSecond,
            predictedHpDrop,
            finalHp,
            canFinish: finalHp <= 0,
            remainingTime,
            sampleCount: samples.length,
            slope: slope,
            totalTime,
            maxHp: data.maxHp
        };
    }

    function updateDisplay() {
        const { personData, teamData, activeBattle } = getBattleData();

        if (!activeBattle) {
            hidePanel();
            currentPrediction = null;
            lastActiveBattleInfo = null;
            return;
        }

        if (isNewBattle(activeBattle)) {
            console.log('检测到新战斗，重置数据:', activeBattle.monster);
            resetMonitoringData(activeBattle.type);
        }

        lastActiveBattleInfo = { ...activeBattle };

        showPanel();

        const currentHp = parseFloat(activeBattle.hp);
        const currentTime = activeBattle.time;
        const battleType = activeBattle.type;
        const maxHp = activeBattle.maxHp;

        const progress = calculateProgress(battleType, currentHp, currentTime, maxHp);
        currentPrediction = progress;

        if (isMinimized) {
            updateMinimizedHeader();
            return;
        }

        const content = statusDisplay.querySelector('#monitor-content');

        const monsterName = activeBattle.monster.length > 8 ?
            activeBattle.monster.substring(0, 8) + '...' :
            activeBattle.monster;

        let dungeonTimeInfo = '';
        if (progress && progress.totalTime) {
            dungeonTimeInfo = `<div style="margin-bottom: 2px;">副本总时长: <span style="color: #17A2B8;">${formatSecondsToTime(progress.totalTime)}</span></div>`;
        } else {
            dungeonTimeInfo = `<div style="margin-bottom: 2px;">副本总时长: <span style="color: #6C757D;">识别中...</span></div>`;
        }

        let statusHtml = `
            <div style="color: #17A2B8; font-weight: bold; margin-bottom: 4px;">
                ${activeBattle.type === 'person' ? '个人' : '团队'}战斗
            </div>
            <div style="margin-bottom: 6px;">
                <div style="margin-bottom: 2px;">怪物: ${monsterName}</div>
                <div style="margin-bottom: 2px;">血量: <span style="color: #DC3545;">${currentHp.toFixed(1)}%</span></div>
                <div style="margin-bottom: 2px;">剩余: <span style="color: #FFC107;">${currentTime}</span></div>
                ${dungeonTimeInfo}
            </div>
        `;

        if (progress && progress.hpPerSecond !== undefined) {
            const canFinish = progress.canFinish;
            const statusColor = canFinish ? '#28A745' : '#DC3545';
            const statusText = canFinish ? '小小BOSS，拿下🥰' : '丸辣，继续沉淀🥹';

            let detailInfo = '';
            if (canFinish) {
                const timeToKill = currentHp / progress.hpPerSecond;
                const remainingTimeAfterKill = Math.max(0, progress.remainingTime - timeToKill);
                detailInfo = `
                    <div>速度: ${progress.hpPerSecond.toFixed(2)}%/秒</div>
                    <div>预计剩余时间: ${Math.floor(remainingTimeAfterKill / 60)}:${(remainingTimeAfterKill % 60).toFixed(0).padStart(2, '0')}</div>
                `;
            } else {
                const finalHpPercent = Math.max(0, progress.finalHp);
                const finalHpValue = progress.maxHp ? Math.round(finalHpPercent * progress.maxHp / 100) : null;

                let hpValueText = '';
                if (finalHpValue !== null) {
                    hpValueText = ` (${finalHpValue})`;
                }

                detailInfo = `
                    <div>速度: ${progress.hpPerSecond.toFixed(2)}%/秒</div>
                    <div>预计剩余: ${finalHpPercent.toFixed(1)}%${hpValueText}</div>
                `;
            }

            statusHtml += `
                <div style="border-top: 1px solid #444; padding-top: 4px;">
                    <div style="color: ${statusColor}; font-weight: bold; margin-bottom: 2px;">${statusText}</div>
                    <div style="font-size: 10px;">
                        ${detailInfo}
                    </div>
                </div>
            `;
        } else {
            statusHtml += `
                <div style="color: #6C757D; font-style: italic; font-size: 10px;">
                    收集数据中...
                </div>
            `;
        }

        content.innerHTML = statusHtml;
    }

    function resetMonitoringData(battleType) {
        if (battleType) {
            monitoringData[battleType].samples = [];
            monitoringData[battleType].lastHp = null;
            monitoringData[battleType].lastTime = null;
            monitoringData[battleType].lastMonster = null;
            monitoringData[battleType].totalTime = null;
            monitoringData[battleType].timeHistory = [];
            monitoringData[battleType].maxHp = null;
        } else {
            Object.keys(monitoringData).forEach(type => {
                monitoringData[type].samples = [];
                monitoringData[type].lastHp = null;
                monitoringData[type].lastTime = null;
                monitoringData[type].lastMonster = null;
                monitoringData[type].totalTime = null;
                monitoringData[type].timeHistory = [];
                monitoringData[type].maxHp = null;
            });
        }
        currentPrediction = null;
    }

    function mainLoop() {
        try {
            updateDisplay();
        } catch (error) {
            console.error('监控脚本错误:', error);
        }
    }

    console.log('战魂觉醒OL副本监控脚本已启动');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                setInterval(mainLoop, 1000);
            }, 2000);
        });
    } else {
        setTimeout(() => {
            setInterval(mainLoop, 1000);
        }, 2000);
    }

    window.resetBattleMonitor = function() {
        resetMonitoringData();
        lastActiveBattleInfo = null;
        console.log('战斗监控数据已重置');
    };

    window.toggleBattleMonitor = function() {
        if (statusDisplay && statusDisplay.style.display !== 'none') {
            toggleMinimize();
        }
    };
})();
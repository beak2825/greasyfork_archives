// ==UserScript==
// @name         WarSoul Daily Tasks
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动完成每日祈福、每日挑战和每月1号大荒野
// @author       Lunaris
// @match        https://aring.cc/awakening-of-war-soul-ol/
// @icon         https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552855/WarSoul%20Daily%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/552855/WarSoul%20Daily%20Tasks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // 自动模式开关 - 修改此处可恢复提示
    // 把默认 true 改为 false 可恢复提示
    let AUTO_MODE_ENABLED = false;
    try {
        AUTO_MODE_ENABLED = GM_getValue('autoModeEnabled', false);
    } catch (e) {
        // 若 GM_getValue 不可用，使用 localStorage
        AUTO_MODE_ENABLED = localStorage.getItem('autoModeEnabled') === 'true';
    }
    // ============================================

    function saveAutoMode(value) {
        try {
            GM_setValue('autoModeEnabled', value);
        } catch (e) {
            localStorage.setItem('autoModeEnabled', value);
        }
    }



    let taskStatus = {
        completed: false,
        blessing: false,
        challenges: false,
        wilderness: false
    };

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'daily-task-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 250px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            color: white;
        `;

        panel.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">每日任务助手</div>
            <div id="task-status" style="font-size: 12px; margin-bottom: 10px; opacity: 0.9;">等待执行...</div>
            <button id="start-daily-task" style="
                width: 100%;
                padding: 10px;
                background: white;
                color: #667eea;
                border: none;
                border-radius: 5px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                margin-bottom: 8px;
            ">一键完成每日任务</button>
            <button id="enable-auto-mode" style="
                width: 100%;
                padding: 8px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid white;
                border-radius: 5px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s;
            ">开启自动后台执行</button>
        `;

        document.body.appendChild(panel);

        const btn = document.getElementById('start-daily-task');
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = executeDailyTasks;

        const autoBtn = document.getElementById('enable-auto-mode');
        autoBtn.onmouseover = () => autoBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        autoBtn.onmouseout = () => autoBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        autoBtn.onclick = enableAutoMode;

        return panel;
    }

    function enableAutoMode() {
        const confirmed = confirm(
            '⚠️ 提醒：即将开启自动后台执行模式\n\n' +
            '开启后脚本将：\n' +
            '• 自动在后台完成每日任务\n' +
            '• 每月1号自动点击大荒野\n' +
            '• 不再弹出任何面板提示\n' +
            '• 每次打开页面自动执行\n\n' +
            '如需关闭提示，请在脚本中修改 AUTO_MODE_ENABLED 为 false。\n\n' +
            '确认要开启自动后台执行吗？'
        );

        if (confirmed) {
            saveAutoMode(true);
            AUTO_MODE_ENABLED = true;
            updateStatus('✅ 后台模式已开启');
            setTimeout(() => {
                alert('✅ 后台执行模式已启用。\n\n下次打开页面脚本会自动在后台完成任务。\n\n如需关闭，请将脚本中的 AUTO_MODE_ENABLED 改为 false。');
                const panel = document.getElementById('daily-task-panel');
                if (panel) {
                    panel.style.transition = 'opacity 0.5s';
                    panel.style.opacity = '0';
                    setTimeout(() => panel.remove(), 500);
                }
            }, 500);
        }
    }

    function updateStatus(message) {
        const statusDiv = document.getElementById('task-status');
        if (statusDiv) {
            statusDiv.textContent = message;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function clickConfirmDialog(keywords) {
        await sleep(800);

        const keywordList = Array.isArray(keywords) ? keywords : [keywords];
        const messageBoxes = document.querySelectorAll('.el-message-box');
        for (let box of messageBoxes) {
            const messageText = box.querySelector('.el-message-box__message');
            const content = messageText ? messageText.textContent : '';
            if (messageText && keywordList.some(k => content.includes(k))) {
                const confirmBtn = Array.from(box.querySelectorAll('.el-message-box__btns button')).find(btn =>
                    btn.textContent.includes('确定') && btn.classList.contains('el-button--primary')
                );
                if (confirmBtn) {
                    confirmBtn.click();
                    await sleep(500);
                    return true;
                }
            }
        }
        return false;
    }

    async function doBlessing() {
        updateStatus('正在进行祈福...');
        await sleep(500);

        // 找到"免费祈福"按钮（不依赖 data-v）
        const freeBlessBtn = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.includes('免费祈福')
        );

        if (freeBlessBtn && !freeBlessBtn.disabled) {
            freeBlessBtn.click();
            updateStatus('等待祈福确认...');

            const confirmed = await clickConfirmDialog(['祈福', '进行祈福', '确定进行祈福']);
            if (confirmed) {
                updateStatus('祈福完成');
                taskStatus.blessing = true;
                await sleep(1000);
                return true;
            } else {
                updateStatus('祈福确认失败');
                return false;
            }
        } else {
            updateStatus('今日祈福已完成或没有免费次数');
            taskStatus.blessing = true;
            return false;
        }
    }

    async function doChallenges() {
        updateStatus('检查每日挑战...');
        await sleep(500);

        // 找到"每日挑战"区域
        const dungeonElements = document.querySelectorAll('.dungeon.affix');
        let dailyChallengeSection = null;

        for (let elem of dungeonElements) {
            const title = elem.querySelector('.title h2');
            if (title && title.textContent.includes('每日挑战')) {
                dailyChallengeSection = elem;
                break;
            }
        }

        if (!dailyChallengeSection) {
            updateStatus('未找到每日挑战区域');
            taskStatus.challenges = true;
            return false;
        }

        const challengeBoxes = dailyChallengeSection.querySelectorAll('.daily-challenge');
        let hasAvailableChallenge = false;

        for (let box of challengeBoxes) {
            const text = box.textContent;
            const match = text.match(/次数：\s*(\d+)/);
            if (match && parseInt(match[1], 10) > 0) {
                hasAvailableChallenge = true;
                break;
            }
        }

        if (hasAvailableChallenge) {
            updateStatus('发现可用次数，执行一键扫荡...');
            await sleep(500);

            const sweepBtn = Array.from(dailyChallengeSection.querySelectorAll('button')).find(btn =>
                btn.textContent.includes('一键扫荡')
            );
            if (sweepBtn) {
                sweepBtn.click();
                updateStatus('等待扫荡确认...');

                const confirmed = await clickConfirmDialog(['每日挑战', '一键扫荡', '扫荡', '挑战']);
                if (confirmed) {
                    updateStatus('挑战扫荡完成');
                    taskStatus.challenges = true;
                    await sleep(1500);
                    return true;
                } else {
                    updateStatus('扫荡确认失败');
                    return false;
                }
            }
        } else {
            updateStatus('每日挑战次数已用完');
            taskStatus.challenges = true;
        }

        return false;
    }

    // 新增：大荒野功能
    async function doWilderness() {
        const today = new Date();

        // 检查是否是每月1号
        if (today.getDate() !== 1) {
            console.log('[大荒野] 今天不是1号，跳过');
            taskStatus.wilderness = true;
            return false;
        }

        updateStatus('检查大荒野...');
        await sleep(500);

        // 查找大荒野区域
        const borderWraps = document.querySelectorAll('.border-wrap.big-wild');
        let wildernessSection = null;

        for (let wrap of borderWraps) {
            const h4 = wrap.querySelector('h4');
            if (h4 && h4.textContent.includes('大荒野')) {
                wildernessSection = wrap;
                break;
            }
        }

        if (!wildernessSection) {
            updateStatus('未找到大荒野区域');
            taskStatus.wilderness = true;
            return false;
        }

        // 查找"进入"按钮
        const enterBtn = wildernessSection.querySelector('button.el-button--success');
        
        if (enterBtn && enterBtn.textContent.includes('进入')) {
            updateStatus('点击大荒野进入按钮...');
            enterBtn.click();
            
            taskStatus.wilderness = true;
            
            updateStatus('大荒野已进入');
            await sleep(1000);
            return true;
        } else {
            updateStatus('未找到大荒野进入按钮');
            taskStatus.wilderness = true;
            return false;
        }
    }

    async function executeDailyTasks() {
        if (taskStatus.completed) {
            updateStatus('今日任务已完成');
            return;
        }

        const btn = document.getElementById('start-daily-task');
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
        }

        try {
            await doBlessing();
            await sleep(1000);

            await doChallenges();
            await sleep(1000);

            await doWilderness();
            await sleep(1000);

            taskStatus.completed = true;
            updateStatus('🎉 每日任务已完成');
            if (btn) {
                btn.textContent = '今日已完成';
                btn.style.background = '#4ade80';
                btn.style.color = 'white';
            }

            setTimeout(() => {
                const panel = document.getElementById('daily-task-panel');
                if (panel) {
                    panel.style.transition = 'opacity 0.5s';
                    panel.style.opacity = '0';
                    setTimeout(() => panel.remove(), 500);
                }
            }, 3000);

        } catch (error) {
            updateStatus('执行出错：' + error.message);
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        }
    }

    async function executeDailyTasksBackground() {
        if (taskStatus.completed) {
            console.log('[每日任务] 已完成，停止执行');
            return;
        }

        try {
            console.log('[每日任务] ✅ 后台模式 - 开始执行');

            console.log('[每日任务] 进行祈福...');
            await doBlessing();
            await sleep(1000);

            console.log('[每日任务] 进行每日挑战扫荡...');
            await doChallenges();
            await sleep(1000);

            console.log('[每日任务] 检查大荒野...');
            await doWilderness();
            await sleep(1000);

            taskStatus.completed = true;
            console.log('[每日任务] ✅ 后台执行完毕');

        } catch (error) {
            console.error('[每日任务] 执行出错', error.message);
        }
    }

    function checkUnfinishedTasks() {
        let hasUnfinishedTask = false;

        const freeBlessBtn = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent.includes('免费祈福')
        );
        if (freeBlessBtn && !freeBlessBtn.disabled) {
            hasUnfinishedTask = true;
        }

        const dungeonElements = document.querySelectorAll('.dungeon.affix');
        for (let elem of dungeonElements) {
            const title = elem.querySelector('.title h2');
            if (title && title.textContent.includes('每日挑战')) {
                const challengeBoxes = elem.querySelectorAll('.daily-challenge');
                for (let box of challengeBoxes) {
                    const text = box.textContent;
                    const match = text.match(/次数：\s*(\d+)/);
                    if (match && parseInt(match[1], 10) > 0) {
                        hasUnfinishedTask = true;
                        break;
                    }
                }
            }
        }

        // 检查大荒野（每月1号）
        const today = new Date();
        if (today.getDate() === 1) {
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            const lastClick = getLastWildernessClick();
            
            if (lastClick !== todayStr) {
                const borderWraps = document.querySelectorAll('.border-wrap.big-wild');
                for (let wrap of borderWraps) {
                    const h4 = wrap.querySelector('h4');
                    if (h4 && h4.textContent.includes('大荒野')) {
                        const enterBtn = wrap.querySelector('button.el-button--success');
                        if (enterBtn && enterBtn.textContent.includes('进入')) {
                            hasUnfinishedTask = true;
                            break;
                        }
                    }
                }
            }
        }

        return hasUnfinishedTask;
    }

    function isGameLoaded() {
        const userIdElement = Array.from(document.querySelectorAll('p')).find(p =>
            p.textContent.includes('用户ID')
        );
        if (!userIdElement) {
            return false;
        }

        const match = userIdElement.textContent.match(/用户ID：\s*(\d+)/);
        if (!match) {
            return false;
        }

        const userId = parseInt(match[1], 10);
        return userId !== 0;
    }

    function startDetection() {
        let checkCount = 0;
        const maxChecks = 12; // 1分钟，每5秒一次
        let panelCreated = false;
        let taskExecuted = false;

        const detectionInterval = setInterval(() => {
            checkCount++;

            if (!isGameLoaded()) {
                console.log(`[每日任务] 第 ${checkCount} 次检测 - 游戏资源未加载...`);
            } else {
                console.log(`[每日任务] 第 ${checkCount} 次检测 - 游戏已加载，检查任务状态`);

                if (checkUnfinishedTasks()) {
                    if (AUTO_MODE_ENABLED && !taskExecuted) {
                        console.log('[每日任务] 后台自动执行模式 - 开始执行任务');
                        taskExecuted = true;
                        executeDailyTasksBackground();
                        clearInterval(detectionInterval);
                    } else if (!AUTO_MODE_ENABLED && !panelCreated) {
                        console.log('[每日任务] 检测到未完成任务，显示面板');
                        createPanel();
                        panelCreated = true;
                        clearInterval(detectionInterval);
                    }
                    return;
                } else if (!panelCreated && !taskExecuted) {
                    console.log('[每日任务] 今日每日任务已完成');
                    clearInterval(detectionInterval);
                    return;
                }
            }

            if (checkCount >= maxChecks) {
                console.log('[每日任务] 检测超时，停止检测');
                if (!panelCreated && !taskExecuted) {
                    console.log('[每日任务] 游戏未加载或任务不存在');
                }
                clearInterval(detectionInterval);
            }
        }, 5000);

        console.log('[每日任务] 开始检测...');
        if (AUTO_MODE_ENABLED) {
            console.log('[每日任务] 当前模式：后台自动执行');
        } else {
            console.log('[每日任务] 当前模式：手动执行');
        }

        if (isGameLoaded()) {
            console.log('[每日任务] 游戏已加载，立即检查任务状态');
            if (checkUnfinishedTasks()) {
                if (AUTO_MODE_ENABLED && !taskExecuted) {
                    console.log('[每日任务] 后台自动执行模式 - 开始执行任务');
                    taskExecuted = true;
                    executeDailyTasksBackground();
                    clearInterval(detectionInterval);
                } else if (!AUTO_MODE_ENABLED && !panelCreated) {
                    console.log('[每日任务] 检测到未完成任务，显示面板');
                    createPanel();
                    panelCreated = true;
                    clearInterval(detectionInterval);
                }
            } else {
                console.log('[每日任务] 今日每日任务已完成');
                clearInterval(detectionInterval);
            }
        } else {
            console.log('[每日任务] 第 0 次检测 - 游戏资源未加载...');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(startDetection, 2000);
        });
    } else {
        setTimeout(startDetection, 2000);
    }
})();
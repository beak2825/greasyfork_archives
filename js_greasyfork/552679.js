// ==UserScript==
// @name 清水河畔菠菜自动评分工具
// @description 根据菠菜结果自动给用户评分（加水滴或扣水滴）
// @namespace bbs.uestc.edu.cn
// @license MIT
// @author JackZhang 参考 ____
// @version 0.1.5
// @match *://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=*
// @match *://bbs.uestcer.org/forum.php?mod=viewthread&tid=*
// @match *://bbs-uestc-edu-cn-s.vpn.uestc.edu.cn/forum.php?mod=viewthread&tid=*
// @downloadURL https://update.greasyfork.org/scripts/552679/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E8%8F%A0%E8%8F%9C%E8%87%AA%E5%8A%A8%E8%AF%84%E5%88%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552679/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E8%8F%A0%E8%8F%9C%E8%87%AA%E5%8A%A8%E8%AF%84%E5%88%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取表单验证哈希值，用于后续请求的身份验证
    const formhash = document.querySelector('input[name=formhash]')?.value;
    // 获取当前帖子ID
    const threadId = new URLSearchParams(window.location.search).get('tid');

    // 如果没有formhash，说明可能未登录或者页面结构不同
    if (!formhash) {
        console.log('未找到formhash，可能未登录');
        return;
    }

    /**
     * 发送评分请求的函数
     * @param {number} water - 水滴增量（正数加分，负数扣分）
     * @param {string} reason - 评分理由
     * @param {string} pid - 帖子ID
     * @param {string} tid - 主题ID
     * @param {boolean} notify - 是否通知被评分用户
     * @returns {Promise} 返回一个Promise对象
     */
    function rate(water, reason, pid, tid, notify = true) {
        // 使用fetch API发送POST请求进行评分
        return fetch('/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // 构造请求体参数
            body: `formhash=${formhash}&tid=${tid}&pid=${pid}&handlekey=rate&score2=${water}&reason=${encodeURIComponent(reason)}&ratesubmit=true` +
                (notify ? '&sendreasonpm=on' : ''), // 如果需要通知，则添加相应参数
            credentials: 'include', // 包含cookies等凭证信息
        }).then(response => response.text()).then(text => {
            // 检查响应结果是否成功
            if (text.includes('感谢您的参与，现在将转入评分前页面')) {
                // 成功评分后更新页面显示
                try {
                    eval(text.match(/ajaxget\([^)]+\)/)[0]);
                } catch (e) {
                    console.log('页面更新失败，但评分已成功');
                }
                return Promise.resolve();
            } else {
                // 如果评分失败，返回拒绝的Promise并携带错误信息
                const errorMsg = (text.match(/<!\[CDATA\[([^<]+)/) || [])[1] || text;
                return Promise.reject(errorMsg);
            }
        });
    }

    function normalizeForCompare(value) {
        return (value || '').toString().trim().toLowerCase().replace(/\s+/g, '');
    }

    function isTeamNameMatch(choice, teamName) {
        if (!choice || !teamName) {
            return false;
        }
        return normalizeForCompare(choice).includes(normalizeForCompare(teamName));
    }

    function areTeamsEquivalent(teamA, teamB) {
        if (!teamA || !teamB) {
            return false;
        }
        return normalizeForCompare(teamA) === normalizeForCompare(teamB);
    }

    /**
     * 解析投注信息
     * @param {string} text - 回复内容
     * @param {string} teamA - 对战队伍A名称
     * @param {string} teamB - 对战队伍B名称
     * @param {string} winnerTeam - 胜利队伍名称
     * @param {number} minBet - 最小投注数
     * @param {number} maxBet - 最大投注数
     * @returns {Object|null} 投注信息对象或null
     */
    function parseBetInfo(text, teamA, teamB, winnerTeam, minBet, maxBet) {
        const cleanText = text.trim().replace(/\s+/g, ' ');
        const betPattern = /^(\d+)水滴看好(.+)$/;
        const match = cleanText.match(betPattern);

        if (!match) {
            return null;
        }

        const amount = parseInt(match[1], 10);
        const choice = match[2].trim();

        if (Number.isNaN(amount) || amount < minBet || amount > maxBet) {
            return null;
        }

        const betOnTeamA = isTeamNameMatch(choice, teamA);
        const betOnTeamB = isTeamNameMatch(choice, teamB);

        if (!betOnTeamA && !betOnTeamB) {
            return null;
        }

        if (betOnTeamA && betOnTeamB) {
            return null;
        }

        const winnerIsTeamA = areTeamsEquivalent(winnerTeam, teamA);
        const winnerIsTeamB = areTeamsEquivalent(winnerTeam, teamB);

        const matchedTeam = betOnTeamA ? teamA : teamB;
        let result;

        if (betOnTeamA) {
            result = winnerIsTeamA ? 'win' : 'lose';
        } else {
            result = winnerIsTeamB ? 'win' : 'lose';
        }

        return {
            amount,
            originalChoice: choice,
            matchedTeam,
            result
        };
    }

    /**
     * 初始化菠菜评分控制面板
     * 创建并设置控制面板界面，包括输入框、按钮和结果显示区域
     */
    function initBocaiPanel() {
        // 创建控制面板
        const panel = document.createElement('div');
        panel.id = 'bocaiPanel'; // 添加ID以便后续操作
        panel.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            width: 350px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            padding: 15px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            border-radius: 4px;
            resize: both;
            overflow: hidden;
        `;

        // 从localStorage加载保存的配置
        const savedConfig = localStorage.getItem('bocaiAutoRateConfig');
        const defaultConfig = {
            winnerTeam: '',
            odds: '',
            minBet: '20',
            maxBet: '1000',
            rewardLimit: '', // 收益上限，默认为空（无上限）
            teamA: 'GEN',
            teamB: 'AL',
            deadline: '2025年10月16日17点50分',
            oddsA: '1.13',
            oddsB: '2.53',
            advancedStyle: false, // 是否启用新版样式
            panelWidth: '350',
            panelHeight: 'auto',
            handleDuplicateBets: true,
            handleOppositeBets: true
        };
        const config = savedConfig ? { ...defaultConfig, ...JSON.parse(savedConfig) } : defaultConfig;

        // 应用保存的面板尺寸
        if (config.panelWidth && config.panelHeight) {
            panel.style.width = config.panelWidth + 'px';
            if (config.panelHeight !== 'auto') {
                panel.style.height = config.panelHeight + 'px';
            }
        }

        panel.innerHTML = `
            <div id="panelHeader" style="cursor: move; background: #ddd; margin: -15px -15px 10px -15px; padding: 10px; border-radius: 4px 4px 0 0; user-select: none;">
                <h3 style="margin: 0; color: #333; display: inline-block;">菠菜自动评分工具</h3>
                <div style="float: right;">
                    <button id="minimizeBtn" style="background: #999; color: white; border: none; border-radius: 3px; cursor: pointer; padding: 2px 6px;">_</button>
                    <button id="closeBtn" style="background: #f44; color: white; border: none; border-radius: 3px; cursor: pointer; padding: 2px 6px; margin-left: 5px;">×</button>
                </div>
            </div>
            <div id="mainPanel">
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label>队伍A：</label>
                        <input type="text" id="teamAInput" placeholder="请输入队伍A名称" value="${config.teamA}"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                    <div style="flex: 1;">
                        <label>队伍B：</label>
                        <input type="text" id="teamBInput" placeholder="请输入队伍B名称" value="${config.teamB}"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label>胜利队伍：</label>
                        <input type="text" id="winnerTeam" placeholder="请输入胜利队伍名称" value="${config.winnerTeam}"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                    <div style="flex: 1;">
                        <label>获胜赔率：</label>
                        <input type="number" id="odds" step="0.1" min="1.0" max="9.9" placeholder="例如: 1.5" value="${config.odds}"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label>最小投注数：</label>
                        <input type="number" id="minBet" value="${config.minBet}" min="1"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                    <div style="flex: 1;">
                        <label>最大投注数：</label>
                        <input type="number" id="maxBet" value="${config.maxBet}" min="1"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                    <label>收益上限（空为无上限）：</label>
                    <input type="number" id="rewardLimit" value="${config.rewardLimit}" min="1"
                           style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="handleDuplicateBets" ${config.handleDuplicateBets ? 'checked' : ''} style="margin-right: 5px;">
                        处理重复投注
                    </label>
                    <label style="display: flex; align-items: center; margin-top: 5px;">
                        <input type="checkbox" id="handleOppositeBets" ${config.handleOppositeBets ? 'checked' : ''} style="margin-right: 5px;">
                        处理双向投注
                    </label>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="advancedStyle" ${config.advancedStyle ? 'checked' : ''} style="margin-right: 5px;">
                        启用新版样式
                    </label>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button id="openBtn" style="flex: 1; padding: 8px; background: #FF9800; color: white; border: none; cursor: pointer; border-radius: 4px;">
                        开盘
                    </button>
                    <button id="scanBtn" style="flex: 1; padding: 8px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 4px;">
                        扫描投注信息
                    </button>
                </div>
                <div id="resultArea" style="margin-top: 10px; max-height: 300px; overflow-y: auto; display: none;"></div>
                <button id="rateBtn" style="width: 100%; padding: 8px; background: #2196F3; color: white; border: none; cursor: pointer; margin-top: 10px; display: none; border-radius: 4px;">
                    开始自动评分
                </button>
            </div>
            <div id="openPanel" style="display: none;">
                <h3 style="margin: 0 0 10px 0; color: #333;">开盘设置</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label>队伍A：</label>
                        <input type="text" id="teamA" placeholder="队伍A名称" value="${config.teamA}"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                    <div style="flex: 1;">
                        <label>赔率：</label>
                        <input type="number" id="oddsA" step="0.01" placeholder="例如: 1.13" value="${config.oddsA}"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label>队伍B：</label>
                        <input type="text" id="teamB" placeholder="队伍B名称" value="${config.teamB}"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                    <div style="flex: 1;">
                        <label>赔率：</label>
                        <input type="number" id="oddsB" step="0.01" placeholder="例如: 2.53" value="${config.oddsB}"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                </div>
                <div style="margin-bottom: 10px;">
                    <label>截止时间：</label>
                    <input type="text" id="deadline" placeholder="例如: 2025年10月16日17点50分" value="${config.deadline}"
                           style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label>最小投注数：</label>
                        <input type="number" id="openMinBet" value="${config.minBet}" min="1"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                    <div style="flex: 1;">
                        <label>最大投注数：</label>
                        <input type="number" id="openMaxBet" value="${config.maxBet}" min="1"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label>收益上限（空为无上限）：</label>
                        <input type="number" id="openRewardLimit" value="${config.rewardLimit}" min="1"
                               style="width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 5px;">
                    <button id="outputPostBtn" style="flex: 1; padding: 8px; background: #009688; color: white; border: none; cursor: pointer; border-radius: 4px;">
                        生成并复制发帖内容
                    </button>
                    <button id="backBtn" style="flex: 1; padding: 8px; background: #607D8B; color: white; border: none; cursor: pointer; border-radius: 4px;">
                        返回
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加拖拽功能
        const header = panel.querySelector('#panelHeader');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header) {
                isDragging = true;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;

            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, panel);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

        // 添加面板最小化和关闭功能
        document.getElementById('minimizeBtn').addEventListener('click', function() {
            const mainPanel = document.getElementById('mainPanel');
            const openPanel = document.getElementById('openPanel');
            const button = this;

            // 检查当前哪个面板是可见的
            if (mainPanel.style.display !== 'none') {
                // 最小化主面板
                mainPanel.style.display = 'none';
                button.textContent = '□';
            } else if (openPanel.style.display === 'block') {
                // 最小化开盘面板
                openPanel.style.display = 'none';
                button.textContent = '□';
            } else {
                // 恢复面板显示
                // 检查之前显示的是哪个面板
                if (localStorage.getItem('lastVisiblePanel') === 'openPanel') {
                    openPanel.style.display = 'block';
                } else {
                    mainPanel.style.display = 'block';
                }
                button.textContent = '_';
            }

            // 保存当前状态
            localStorage.setItem('panelMinimized', button.textContent === '□' ? 'true' : 'false');
        });

        document.getElementById('closeBtn').addEventListener('click', function() {
            panel.style.display = 'none';
        });

        // 记录当前显示的面板
        document.getElementById('openBtn').addEventListener('click', function() {
            localStorage.setItem('lastVisiblePanel', 'openPanel');
        });

        document.getElementById('backBtn').addEventListener('click', function() {
            localStorage.setItem('lastVisiblePanel', 'mainPanel');
        });

        // 添加面板大小变化监听
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                savePanelSize(width, height);
            }
        });

        resizeObserver.observe(panel);

        // 应用保存的样式设置
        setTimeout(() => {
            applyAdvancedStyle();
        }, 100);

        // 存储扫描到的投注记录
        let betRecords = {};
        let currentScanOptions = null;

        // 添加自动保存功能
        const inputs = ['teamAInput', 'teamBInput', 'winnerTeam', 'odds', 'minBet', 'maxBet', 'rewardLimit', 'teamA', 'teamB', 'deadline', 'oddsA', 'oddsB', 'openMinBet', 'openMaxBet', 'openRewardLimit', 'advancedStyle', 'handleDuplicateBets', 'handleOppositeBets'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const eventName = element.type === 'checkbox' ? 'change' : 'input';
                element.addEventListener(eventName, function() {
                    saveConfig();
                });
            }
        });

        ['handleDuplicateBets', 'handleOppositeBets'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', handlePolicyToggleChange);
            }
        });

        ['odds', 'rewardLimit', 'openRewardLimit'].forEach(id => {
            const element = document.getElementById(id);
            if (element && !element.dataset.recalcListenerAttached) {
                element.addEventListener('input', () => {
                    updateExpectedWaterDrops();
                });
                element.dataset.recalcListenerAttached = 'true';
            }
        });

        // 监听新版样式复选框变化
        document.getElementById('advancedStyle').addEventListener('change', function() {
            saveConfig();
            applyAdvancedStyle();
        });

        // 保存配置到localStorage
        function saveConfig() {
            const teamAInput = document.getElementById('teamAInput');
            const teamBInput = document.getElementById('teamBInput');
            const openTeamAInput = document.getElementById('teamA');
            const openTeamBInput = document.getElementById('teamB');
            const rewardLimitInput = document.getElementById('rewardLimit');
            const openRewardLimitInput = document.getElementById('openRewardLimit');

            const teamAValue = (teamAInput?.value ?? openTeamAInput?.value ?? '').trim() || 'GEN';
            const teamBValue = (teamBInput?.value ?? openTeamBInput?.value ?? '').trim() || 'AL';
            const rewardLimitValue = (rewardLimitInput?.value ?? openRewardLimitInput?.value ?? '').trim();

            if (teamAInput && teamAInput.value !== teamAValue) {
                teamAInput.value = teamAValue;
            }
            if (openTeamAInput && openTeamAInput.value !== teamAValue) {
                openTeamAInput.value = teamAValue;
            }
            if (teamBInput && teamBInput.value !== teamBValue) {
                teamBInput.value = teamBValue;
            }
            if (openTeamBInput && openTeamBInput.value !== teamBValue) {
                openTeamBInput.value = teamBValue;
            }
            if (rewardLimitInput && rewardLimitInput.value !== rewardLimitValue) {
                rewardLimitInput.value = rewardLimitValue;
            }
            if (openRewardLimitInput && openRewardLimitInput.value !== rewardLimitValue) {
                openRewardLimitInput.value = rewardLimitValue;
            }

            const config = {
                winnerTeam: (document.getElementById('winnerTeam')?.value || '').trim(),
                odds: (document.getElementById('odds')?.value || '').trim(),
                minBet: (document.getElementById('minBet')?.value || '20').trim(),
                maxBet: (document.getElementById('maxBet')?.value || '1000').trim(),
                rewardLimit: rewardLimitValue,
                teamA: teamAValue,
                teamB: teamBValue,
                deadline: (document.getElementById('deadline')?.value || '2025年10月16日17点50分').trim(),
                oddsA: (document.getElementById('oddsA')?.value || '1.13').trim(),
                oddsB: (document.getElementById('oddsB')?.value || '2.53').trim(),
                advancedStyle: document.getElementById('advancedStyle')?.checked || false,
                handleDuplicateBets: document.getElementById('handleDuplicateBets')?.checked ?? true,
                handleOppositeBets: document.getElementById('handleOppositeBets')?.checked ?? true,
                panelWidth: panel.style.width.replace('px', ''),
                panelHeight: panel.style.height ? panel.style.height.replace('px', '') : 'auto'
            };
            localStorage.setItem('bocaiAutoRateConfig', JSON.stringify(config));
        }

        // 保存面板尺寸
        function savePanelSize(width, height) {
            const savedConfig = localStorage.getItem('bocaiAutoRateConfig');
            const config = savedConfig ? JSON.parse(savedConfig) : {};
            config.panelWidth = width;
            config.panelHeight = height;
            localStorage.setItem('bocaiAutoRateConfig', JSON.stringify(config));
        }

        // 应用新版样式
        function applyAdvancedStyle() {
            const useAdvancedStyle = document.getElementById('advancedStyle').checked;
            const panel = document.querySelector('#bocaiPanel');

            if (useAdvancedStyle) {
                // 应用新版样式
                panel.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 20px;
                    width: 350px;
                    background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
                    border: 1px solid #ddd;
                    padding: 15px;
                    z-index: 9999;
                    font-size: 14px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    border-radius: 12px;
                    color: #333;
                    resize: both;
                    overflow: hidden;
                `;

                // 更新标题栏样式
                const header = panel.querySelector('#panelHeader');
                if (header) {
                    header.style.cssText = 'cursor: move; background: linear-gradient(135deg, #6a93cb 0%, #a4bfef 100%); margin: -15px -15px 10px -15px; padding: 10px; border-radius: 12px 12px 0 0; user-select: none;';
                }

                // 更新标题样式
                const title = panel.querySelector('h3');
                if (title) {
                    title.style.cssText = 'margin: 0; color: white; text-align: center; font-size: 18px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); display: inline-block;';
                }

                // 更新按钮样式
                const buttons = panel.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.id === 'minimizeBtn' || button.id === 'closeBtn') {
                        // 标题栏按钮样式
                        button.style.cssText = 'border: none; border-radius: 3px; cursor: pointer; padding: 2px 6px; font-weight: bold;';
                        if (button.id === 'closeBtn') {
                            button.style.background = '#ff4444';
                            button.style.color = 'white';
                        } else {
                            button.style.background = '#ffffff80';
                            button.style.color = '#333';
                        }
                    } else if (button.id === 'scanBtn') {
                        button.style.cssText = 'width: 100%; padding: 10px; background: linear-gradient(to bottom, #4CAF50, #45a049); color: white; border: none; cursor: pointer; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
                    } else if (button.id === 'rateBtn') {
                        button.style.cssText = 'width: 100%; padding: 10px; background: linear-gradient(to bottom, #2196F3, #1976D2); color: white; border: none; cursor: pointer; margin-top: 10px; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
                    } else if (button.id === 'openBtn') {
                        button.style.cssText = 'width: 100%; padding: 10px; background: linear-gradient(to bottom, #FF9800, #F57C00); color: white; border: none; cursor: pointer; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
                    } else if (button.id === 'backBtn') {
                        button.style.cssText = 'flex: 1; padding: 8px; background: linear-gradient(to bottom, #607D8B, #455A64); color: white; border: none; cursor: pointer; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
                    } else if (button.id === 'outputPostBtn') {
                        button.style.cssText = 'flex: 1; padding: 8px; background: linear-gradient(to bottom, #9C27B0, #7B1FA2); color: white; border: none; cursor: pointer; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
                    } else {
                        button.style.cssText = 'width: 100%; padding: 10px; background: linear-gradient(to bottom, #FF9800, #F57C00); color: white; border: none; cursor: pointer; border-radius: 6px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);';
                    }
                });

                // 更新输入框样式
                const inputs = panel.querySelectorAll('input[type="text"], input[type="number"]');
                inputs.forEach(input => {
                    input.style.cssText = 'width: 100%; padding: 8px; margin: 5px 0; border-radius: 6px; border: 1px solid #ccc; background: rgba(255, 255, 255, 0.95); box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); box-sizing: border-box;';
                });

                // 更新标签样式
                const labels = panel.querySelectorAll('label');
                labels.forEach(label => {
                    label.style.cssText = 'color: #333; font-weight: 500; text-shadow: 1px 1px 1px rgba(0,0,0,0.1);';
                });

                // 更新结果区域样式
                const resultArea = panel.querySelector('#resultArea');
                if (resultArea) {
                    resultArea.style.cssText = 'margin-top: 10px; max-height: 300px; overflow-y: auto; display: none; background: rgba(255, 255, 255, 0.7); border-radius: 6px; padding: 10px; box-shadow: inset 0 0 5px rgba(0,0,0,0.1);';
                }

                // 更新文本域样式
                const textareas = panel.querySelectorAll('textarea');
                textareas.forEach(textarea => {
                    textarea.style.cssText = 'width: 100%; padding: 8px; margin: 5px 0; border-radius: 6px; border: 1px solid #ccc; background: rgba(255, 255, 255, 0.95); box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); box-sizing: border-box;';
                });
            } else {
                // 恢复默认样式
                panel.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 20px;
                    width: 350px;
                    background: #f5f5f5;
                    border: 1px solid #ddd;
                    padding: 15px;
                    z-index: 9999;
                    font-size: 14px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.2);
                    border-radius: 4px;
                    resize: both;
                    overflow: hidden;
                `;

                // 恢复标题栏样式
                const header = panel.querySelector('#panelHeader');
                if (header) {
                    header.style.cssText = 'cursor: move; background: #ddd; margin: -15px -15px 10px -15px; padding: 10px; border-radius: 4px 4px 0 0; user-select: none;';
                }

                // 恢复标题样式
                const title = panel.querySelector('h3');
                if (title) {
                    title.style.cssText = 'margin: 0; color: #333; display: inline-block;';
                }

                // 恢复按钮样式
                const buttons = panel.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.id === 'minimizeBtn' || button.id === 'closeBtn') {
                        // 标题栏按钮样式
                        button.style.cssText = 'border: none; border-radius: 3px; cursor: pointer; padding: 2px 6px;';
                        if (button.id === 'closeBtn') {
                            button.style.background = '#f44';
                            button.style.color = 'white';
                        } else {
                            button.style.background = '#999';
                            button.style.color = 'white';
                        }
                    } else if (button.id === 'scanBtn') {
                        button.style.cssText = 'flex: 1; padding: 8px; background: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 4px;';
                    } else if (button.id === 'rateBtn') {
                        button.style.cssText = 'width: 100%; padding: 8px; background: #2196F3; color: white; border: none; cursor: pointer; margin-top: 10px; border-radius: 4px;';
                    } else if (button.id === 'openBtn') {
                        button.style.cssText = 'flex: 1; padding: 8px; background: #FF9800; color: white; border: none; cursor: pointer; border-radius: 4px;';
                    } else if (button.id === 'backBtn') {
                        button.style.cssText = 'flex: 1; padding: 8px; background: #607D8B; color: white; border: none; cursor: pointer; border-radius: 4px; margin-bottom: 5px;';
                    } else if (button.id === 'outputPostBtn') {
                        button.style.cssText = 'flex: 1; padding: 8px; background: #009688; color: white; border: none; cursor: pointer; border-radius: 4px; margin-bottom: 5px;';
                    } else {
                        button.style.cssText = 'width: 100%; padding: 8px; background: #FF9800; color: white; border: none; cursor: pointer; border-radius: 4px; margin-bottom: 5px;';
                    }
                });

                // 恢复输入框样式
                const inputs = panel.querySelectorAll('input[type="text"], input[type="number"]');
                inputs.forEach(input => {
                    input.style.cssText = 'width: 100%; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;';
                });

                // 恢复标签样式
                const labels = panel.querySelectorAll('label');
                labels.forEach(label => {
                    label.style.cssText = 'color: inherit; font-weight: normal; text-shadow: none;';
                });

                // 恢复结果区域样式
                const resultArea = panel.querySelector('#resultArea');
                if (resultArea) {
                    resultArea.style.cssText = 'margin-top: 10px; max-height: 300px; overflow-y: auto; display: none;';
                }

                // 恢复文本域样式
                const textareas = panel.querySelectorAll('textarea');
                textareas.forEach(textarea => {
                    textarea.style.cssText = 'width: 100%; height: 150px; padding: 5px; margin: 5px 0; border-radius: 4px; border: 1px solid #ddd; box-sizing: border-box;';
                });
            }
        }

        // 开盘按钮事件
        document.getElementById('openBtn').addEventListener('click', function() {
            document.getElementById('mainPanel').style.display = 'none';
            document.getElementById('openPanel').style.display = 'block';
            // 不再自动生成发帖内容
        });

        // 返回按钮事件
        document.getElementById('backBtn').addEventListener('click', function() {
            document.getElementById('openPanel').style.display = 'none';
            document.getElementById('mainPanel').style.display = 'block';
        });

        // 生成发帖内容按钮事件
        document.getElementById('outputPostBtn').addEventListener('click', async function() {
            try {
                await generatePostContent();
            } catch (error) {
                console.error('生成发帖内容时出错:', error);
                showNotification('生成发帖内容时出错: ' + error.message, 'error');
            }
        });

        // 显示通知函数
        function showNotification(message, type = 'info') {
            // 创建通知元素
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 4px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                transform: translateX(120%);
                transition: transform 0.3s ease-in-out;
                max-width: 300px;
                ${type === 'error' ? 'background-color: #f44336;' : 'background-color: #4CAF50;'}
            `;

            notification.textContent = message;

            // 添加到页面
            document.body.appendChild(notification);

            // 显示动画
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // 5秒后自动移除
            setTimeout(() => {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }

        /**
         * 将文本复制到系统剪贴板，优先使用现代 Clipboard API，失败时回退到 document.execCommand
         */
        async function copyToClipboard(text) {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                try {
                    await navigator.clipboard.writeText(text);
                    return true;
                } catch (error) {
                    console.warn('Clipboard API 写入失败，尝试回退方案:', error);
                }
            }

            // 回退：创建隐藏文本域，执行复制命令
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.pointerEvents = 'none';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            let success = false;
            try {
                success = document.execCommand('copy');
            } catch (error) {
                console.error('回退复制失败:', error);
            } finally {
                document.body.removeChild(textarea);
            }

            return success;
        }

        // 生成发帖内容函数
        async function generatePostContent() {
            const teamA = document.getElementById('teamA').value || '队伍A';
            const teamB = document.getElementById('teamB').value || '队伍B';
            const deadline = document.getElementById('deadline').value || '待定';
            const oddsA = document.getElementById('oddsA').value || '1.00';
            const oddsB = document.getElementById('oddsB').value || '2.00';
            const minBet = document.getElementById('openMinBet').value || '20';
            const maxBet = document.getElementById('openMaxBet').value || '1000';
            const rewardLimitElement = document.getElementById('rewardLimit') || document.getElementById('openRewardLimit');
            const configuredRewardLimit = rewardLimitElement ? rewardLimitElement.value.trim() : '';
            const rewardLimit = configuredRewardLimit ? parseInt(configuredRewardLimit, 10) : NaN;

            const rewardA = Math.round(100 * (parseFloat(oddsA) - 1));
            const rewardB = Math.round(100 * (parseFloat(oddsB) - 1));

            // 使用预定义的模板内容
            let template = `**小提醒:**

1. **<font color=red>编辑过的帖子</font> 会被视作 <font color=red>无效</font> 投注**，**<font color=red>引用了他人的回复</font> 会被视作 <font color=red>无效</font> 投注**，**<font color=red>投注信息不在回复开头</font> 会被视作 <font color=red>无效</font> 投注**。（如有需要，可重新投注）
2. 请务必按推荐格式投注。评分由程序自动完成
3. **请勿多次投注。若获胜, 只结算首次投注. 若失败, 则结算全部投注**。
4. **请勿双向投注。双向投注获胜的楼层收益将 <font color=Red>减半</font> ，失败的楼层 <font color=Red>照常</font> 结算**。
__LIMIT_PLACEHOLDER__

---

**水滴投注：** 猜 **队伍A** vs **队伍B** 比赛结果

**本期竞猜项目：** **队伍A** vs **队伍B**
**竞猜截止时间：** <font color=Red>待定</font> 超过该时间的投注会被视为无效投注
**结果公布时间：** 赛后

**赔率情况:（截止投注时会根据参考信息更新赔率）**

- **选项A： 看好队伍A** 赔率 **<font color=Red>1.00</font>** ，押注100水滴 获胜可赢得 **<font color=#ff0000>0</font>** 水滴，失败则扣除 **100** 水滴

- **选项B： 看好队伍B** 赔率 **<font color=#ff0000>2.00</font>** ，押注100水滴 获胜可赢得 **<font color=#ff0000>153</font>** 水滴，失败则扣除 **100** 水滴

**每人限投注一次**，投注范围 **<font color=Red>MIN_BET_PLACEHOLDER</font>** 水滴 ~ **<font color=Red>MAX_BET_PLACEHOLDER</font>** 水滴, 不在此范围的投注将被视为无效投注

**投注格式:**

如果你认为 **队伍A** 会赢，就在本帖回复 \`XXX水滴看好队伍A\` 或&nbsp;&nbsp;\`XXX水滴看好队伍a\`,举个例子
**\`100水滴看好队伍A\`**

如果你认为 **队伍B** 会赢，就在本帖回复 \`XXX水滴看好队伍B\` 或 \`XXX水滴看好队伍b\`,举个例子
**\`100水滴看好队伍B\`**

<font color=red>请务必以上述格式回帖</font>, <font color=red>诸如以下格式回帖</font>将视为<font color=Red>**无效**</font>投注

\`五十水滴看好队伍A\`<--- 水滴数量请用阿拉伯数字
\`100水看好队伍B\`<--- 请用 "水滴" 而不是 "水"

**其他说明:**

1. 投注数量不可超过自身已有水滴数量；
2. 当天竞猜截止时会锁定竞猜帖；
3. 再次提醒, 投注请符合格式；

<div>
<font size=6><b>who will win ?</b></font>
</div>`;

            // 替换模板中的变量，使用更精确的替换方式避免冲突
            let postContent = template
                .replace(/队伍A/g, teamA)
                .replace(/队伍B/g, teamB)
                .replace(/待定/g, deadline)
                .replace(/1\.00/g, oddsA)
                .replace(/2\.00/g, oddsB)
                // 特别处理赔率和奖励数字，避免误替换
                .replace(/<font color=#ff0000>0<\/font>/g, `<font color=#ff0000>${rewardA}<\/font>`)
                .replace(/<font color=#ff0000>153<\/font>/g, `<font color=#ff0000>${rewardB}<\/font>`)
                // 处理投注范围
                .replace(/<font color=Red>MIN_BET_PLACEHOLDER<\/font>/g, `<font color=Red>${minBet}<\/font>`)
                .replace(/<font color=Red>MAX_BET_PLACEHOLDER<\/font>/g, `<font color=Red>${maxBet}<\/font>`)
                // 处理举例中的投注数，保持100不变
                .replace(/队伍a/g, teamA.toLowerCase())
                .replace(/队伍b/g, teamB.toLowerCase());

            const limitLine = Number.isInteger(rewardLimit) && rewardLimit > 0
                ? `5. 本期收益上限：单次获胜最多奖励 ${rewardLimit} 水滴（超过部分不再发放）`
                : '';

            postContent = postContent.replace('__LIMIT_PLACEHOLDER__', limitLine);

            const copied = await copyToClipboard(postContent);
            if (copied) {
                showNotification('发帖内容已复制到剪贴板，可直接粘贴发布。');
            } else {
                console.warn('复制到剪贴板失败，已输出到控制台备用。');
                console.log('生成的发帖内容如下：');
                console.log(postContent);
                showNotification('内容生成成功，但复制剪贴板失败，请从控制台手动复制。', 'error');
            }
        }

        // 扫描按钮事件
        document.getElementById('scanBtn').addEventListener('click', function() {
            const teamAName = document.getElementById('teamAInput').value.trim();
            const teamBName = document.getElementById('teamBInput').value.trim();
            const winnerTeam = document.getElementById('winnerTeam').value.trim();
            const odds = document.getElementById('odds').value.trim();
            const minBet = document.getElementById('minBet').value.trim();
            const maxBet = document.getElementById('maxBet').value.trim();

            if (!teamAName || !teamBName) {
                alert('请填写对战的两个队伍名称！');
                return;
            }

            if (areTeamsEquivalent(teamAName, teamBName)) {
                alert('对战双方的队伍名称不能相同！');
                return;
            }

            if (!winnerTeam) {
                alert('请输入胜利队伍名称！');
                return;
            }

            if (!odds) {
                alert('请输入获胜赔率！');
                return;
            }

            if (!minBet) {
                alert('请输入最小投注数！');
                return;
            }

            if (!maxBet) {
                alert('请输入最大投注数！');
                return;
            }

            const oddsValue = parseFloat(odds);
            const minBetValue = parseInt(minBet, 10);
            const maxBetValue = parseInt(maxBet, 10);

            if (isNaN(oddsValue) || oddsValue < 1.0 || oddsValue > 9.9) {
                alert('请输入有效的赔率（1.0-9.9）！');
                return;
            }

            if (isNaN(minBetValue) || minBetValue < 1) {
                alert('请输入有效的最小投注数（大于0的整数）！');
                return;
            }

            if (isNaN(maxBetValue) || maxBetValue < 1) {
                alert('请输入有效的最大投注数（大于0的整数）！');
                return;
            }

            if (minBetValue > maxBetValue) {
                alert('最小投注数不能大于最大投注数！');
                return;
            }

            const winnerMatchesTeamA = areTeamsEquivalent(winnerTeam, teamAName);
            const winnerMatchesTeamB = areTeamsEquivalent(winnerTeam, teamBName);

            if (!winnerMatchesTeamA && !winnerMatchesTeamB) {
                alert('胜利队伍必须填写为队伍A或队伍B之一！');
                return;
            }

            const handleDuplicateBets = document.getElementById('handleDuplicateBets')?.checked ?? true;
            const handleOppositeBets = document.getElementById('handleOppositeBets')?.checked ?? true;

            scanBetInfo(teamAName, teamBName, winnerTeam, oddsValue, minBetValue, maxBetValue, {
                handleDuplicateBets,
                handleOppositeBets
            });
        });

        // 评分按钮事件
        document.getElementById('rateBtn').addEventListener('click', function() {
            // 弹出确认对话框
            if (confirm('确定要开始自动评分吗？此操作不可撤销！')) {
                performRating();
            }
        });

        /**
         * 计算单条投注的水滴变化
         * @param {Object} record - 投注记录
         * @param {number} oddsValue - 当前赔率
         * @param {number|null} rewardLimitValue - 收益上限，没有则为null
         * @returns {number} 水滴变化（胜利为正，失败为负）
         */
        function calculateWaterChange(record, oddsValue, rewardLimitValue) {
            if (record.result === 'win') {
                let reward = Math.round(record.amount * (oddsValue - 1.0));
                if (Number.isFinite(rewardLimitValue)) {
                    reward = Math.min(reward, rewardLimitValue);
                }
                reward = Math.min(reward, 10000);
                if (record.halfReward) {
                    reward = Math.floor(reward / 2);
                }
                return reward;
            }
            return -record.amount;
        }

        /**
         * 构建投注记录行的HTML
         * @param {Object} record - 投注记录
         * @param {number} expectedWater - 预计水滴变化
         * @returns {string} HTML字符串
         */
        function renderBetRecordRow(record, expectedWater) {
            const isWin = record.result === 'win';
            const signAdjusted = expectedWater > 0 ? `+${expectedWater}` : `${expectedWater}`;
            const expectedLabel = isWin
                ? `预计${signAdjusted}水滴${record.halfReward ? ' (已减半)' : ''}`
                : `预计${signAdjusted}水滴`;
            const color = isWin ? 'blue' : 'orange';
            const checkedAttr = record.enabled ? 'checked' : '';
            const opacityStyle = record.enabled ? '' : 'opacity: 0.5;';
            const policySummary = record.policyTags?.length ? record.policyTags.join('、') : '';
            const disabledHint = record.enabled ? '' : `<span style="color: #999; margin-left: 8px;">（已排除${policySummary ? `：${policySummary}` : ''}）</span>`;
            const policyBadge = policySummary ? `<span style="color: #c21807; margin-left: 8px;">违规: ${policySummary}</span>` : '';
            const halfRewardControl = isWin ? `
                    <label style="margin-left: 10px;">
                        <input type="checkbox" class="half-reward-checkbox" data-pid="${record.pid}" ${record.halfReward ? 'checked' : ''} />
                        收益减半
                    </label>` : '';

            return `
                <div class="bet-record" data-pid="${record.pid}" style="margin: 5px 0; color: green; padding: 5px; border-radius: 4px; background: rgba(255, 255, 255, 0.8); ${opacityStyle}">
                    <label>
                        <input type="checkbox" class="bet-checkbox" data-pid="${record.pid}" ${checkedAttr} />
                        [${record.author}] ${record.amount}水滴 投注"${record.displayChoice}" (PID: ${record.pid})
                        <span style="color: ${color}; font-weight: bold;">[${expectedLabel}]</span>${disabledHint}${policyBadge}
                    </label>
                    ${halfRewardControl}
                </div>`;
        }

        /**
         * 为结果区域绑定变更监听
         */
        function attachResultAreaChangeListener() {
            const resultArea = document.getElementById('resultArea');
            if (!resultArea || resultArea.dataset.changeListenerAttached) {
                return;
            }

            resultArea.addEventListener('change', event => {
                const target = event.target;
                if (!target) {
                    return;
                }

                const pid = target.getAttribute('data-pid');
                if (!pid || !betRecords[pid]) {
                    return;
                }

                if (target.classList.contains('bet-checkbox')) {
                    // 记录人工勾选状态，后续策略重算时优先使用
                    betRecords[pid].manualEnabled = target.checked;
                    betRecords[pid].enabled = target.checked;
                    updateExpectedWaterDrops();
                } else if (target.classList.contains('half-reward-checkbox')) {
                    // 同步人工收益减半设置
                    betRecords[pid].manualHalfReward = target.checked;
                    betRecords[pid].halfReward = target.checked;
                    updateExpectedWaterDrops();
                }
            });

            resultArea.dataset.changeListenerAttached = 'true';
        }

        /**
         * 根据配置处理重复投注与双向投注
         * 自动计算每条投注的默认结算状态，同时保留人工调整的优先级
         */
        function applyBetPolicies() {
            if (!currentScanOptions) {
                return;
            }

            const { handleDuplicateBets, handleOppositeBets } = currentScanOptions;
            const records = Object.values(betRecords);

            records.forEach(record => {
                record.autoEnabled = true;
                record.autoHalfReward = false;
                record.policyTags = [];
            });

            if (handleDuplicateBets) {
                const duplicateGroups = new Map();
                records.forEach(record => {
                    const key = `${record.author}|${record.matchedTeam}`;
                    if (!duplicateGroups.has(key)) {
                        duplicateGroups.set(key, []);
                    }
                    duplicateGroups.get(key).push(record);
                });

                duplicateGroups.forEach(group => {
                    if (group.length <= 1) {
                        return;
                    }
                    group.sort((a, b) => a.order - b.order);
                    const leader = group[0];
                    // 标记所有重复投注楼层，便于界面提示违规原因
                    group.forEach(item => {
                        item.policyTags.push('重复投注');
                    });
                    // 胜方只结算首注，其余默认排除
                    if (leader.result === 'win') {
                        group.slice(1).forEach(record => {
                            record.autoEnabled = false;
                        });
                    }
                });
            }

            if (handleOppositeBets) {
                const authorRecords = new Map();
                records.forEach(record => {
                    if (!authorRecords.has(record.author)) {
                        authorRecords.set(record.author, []);
                    }
                    authorRecords.get(record.author).push(record);
                });

                authorRecords.forEach(list => {
                    const teamSet = new Set(list.map(item => item.matchedTeam));
                    if (teamSet.size < 2) {
                        return;
                    }
                    list.forEach(item => {
                        item.policyTags.push('双向投注');
                        // 双向投注仅对获胜楼层执行收益减半
                        if (item.result === 'win') {
                            item.autoHalfReward = true;
                        }
                    });
                });
            }

            records.forEach(record => {
                const hasManualEnabled = record.manualEnabled !== null;
                const hasManualHalf = record.manualHalfReward !== null;

                // 人工调整优先生效，否则采用策略给出的默认状态
                record.enabled = hasManualEnabled ? record.manualEnabled : record.autoEnabled;
                record.halfReward = hasManualHalf ? record.manualHalfReward : record.autoHalfReward;
            });
        }

        /**
         * 处理策略开关切换事件，保持人工调整并重算默认状态
         */
        function handlePolicyToggleChange() {
            if (!currentScanOptions || Object.keys(betRecords).length === 0) {
                return;
            }

            const duplicateEnabled = document.getElementById('handleDuplicateBets')?.checked ?? true;
            const oppositeEnabled = document.getElementById('handleOppositeBets')?.checked ?? true;

            currentScanOptions.handleDuplicateBets = duplicateEnabled;
            currentScanOptions.handleOppositeBets = oppositeEnabled;

            applyBetPolicies();
            updateExpectedWaterDrops();
        }

        /**
         * 扫描页面上的投注信息
         * @param {string} teamA - 对战队伍A名称
         * @param {string} teamB - 对战队伍B名称
         * @param {string} winnerTeam - 胜利队伍名称
         * @param {number} odds - 获胜赔率
         * @param {number} minBet - 最小投注数
         * @param {number} maxBet - 最大投注数
         * @param {Object} options - 扩展配置
         */
        function scanBetInfo(teamA, teamB, winnerTeam, odds, minBet, maxBet, options = {}) {
            betRecords = {};
            const { handleDuplicateBets = true, handleOppositeBets = true } = options;
            // 记录扫描配置，便于策略开关或手动调整时复用
            currentScanOptions = { teamA, teamB, winnerTeam, minBet, maxBet, handleDuplicateBets, handleOppositeBets };

            const resultArea = document.getElementById('resultArea');
            resultArea.innerHTML = '<p>正在扫描投注信息...</p>';
            resultArea.style.display = 'block';

            const posts = document.querySelectorAll('#postlist > div[id^="post_"]');
            let validBets = 0;
            let invalidBets = 0;
            let invalidBetsDetails = '';
            let recordOrder = 0;

            posts.forEach(post => {
                const pid = post.id.replace('post_', '');
                const postMessage = post.querySelector('.t_f');
                const authorElement = post.querySelector('.authi .xw1');
                const author = authorElement ? authorElement.textContent.trim() : '未知用户';

                if (!postMessage) {
                    return;
                }

                const text = postMessage.textContent.trim();
                const betInfo = parseBetInfo(text, teamA, teamB, winnerTeam, minBet, maxBet);

                if (!betInfo) {
                    invalidBets++;
                    invalidBetsDetails += `<p style="margin: 5px 0; color: red; padding: 5px; border-radius: 4px; background: rgba(255, 255, 255, 0.8);">[${author}] 无法识别投注信息: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}" (PID: ${pid})</p>`;
                    return;
                }

                const displayChoice = normalizeForCompare(betInfo.originalChoice) === normalizeForCompare(betInfo.matchedTeam)
                    ? betInfo.matchedTeam
                    : `${betInfo.matchedTeam}（原：${betInfo.originalChoice}）`;

                betRecords[pid] = {
                    pid,
                    author,
                    amount: betInfo.amount,
                    result: betInfo.result,
                    matchedTeam: betInfo.matchedTeam,
                    originalChoice: betInfo.originalChoice,
                    displayChoice,
                    enabled: true,
                    halfReward: false,
                    expectedWater: 0,
                    order: recordOrder++,
                    // 自动策略与人工覆盖需要的状态信息
                    autoEnabled: true,
                    manualEnabled: null,
                    autoHalfReward: false,
                    manualHalfReward: null,
                    policyTags: []
                };
                validBets++;
            });

            applyBetPolicies();

            const invalidDetailsHtml = invalidBetsDetails || '<p style="margin: 5px 0; color: #666;">暂无</p>';

            resultArea.innerHTML = `
                <p style="font-weight: bold; color: #333;">扫描完成：</p>
                <p style="color: green;">有效投注: ${validBets} 条</p>
                <div style="margin-left: 10px;" id="validBetsDetails"></div>
                <p style="color: red;">无效投注: ${invalidBets} 条</p>
                <div style="margin-left: 10px;">${invalidDetailsHtml}</div>
                <p id="totalAddWater" style="font-weight: bold;">预计加水数量: 0 水滴</p>
                <p id="totalDeductWater" style="font-weight: bold;">预计扣水数量: 0 水滴</p>
                <p id="scanSummary" style="font-weight: bold;">胜利队伍: ${winnerTeam}，获胜赔率: ${odds}，投注范围: ${minBet}-${maxBet}水滴</p>
            `;

            document.getElementById('rateBtn').style.display = validBets > 0 ? 'block' : 'none';

            attachResultAreaChangeListener();
            updateExpectedWaterDrops();

            if (validBets === 0) {
                const validBetsContainer = document.getElementById('validBetsDetails');
                if (validBetsContainer) {
                    validBetsContainer.innerHTML = '<p style="color: #666;">暂无有效投注</p>';
                }
            }
        }

        /**
         * 更新预计水滴数显示
         */
        function updateExpectedWaterDrops() {
            if (!currentScanOptions) {
                return;
            }

            const oddsInput = document.getElementById('odds');
            const oddsValue = oddsInput ? parseFloat(oddsInput.value) : NaN;
            if (Number.isNaN(oddsValue) || oddsValue < 1.0 || oddsValue > 9.9) {
                return;
            }

            const rewardLimitInput = document.getElementById('rewardLimit');
            const rewardLimitValue = rewardLimitInput ? parseFloat(rewardLimitInput.value) : NaN;
            const rewardLimit = Number.isFinite(rewardLimitValue) ? rewardLimitValue : null;

            const validBetsContainer = document.getElementById('validBetsDetails');
            if (!validBetsContainer) {
                return;
            }

            let expectedAddWater = 0;
            let expectedDeductWater = 0;
            let rowsHtml = '';

            Object.keys(betRecords).forEach(pid => {
                const record = betRecords[pid];
                const change = calculateWaterChange(record, oddsValue, rewardLimit);
                record.expectedWater = change;

                if (record.enabled) {
                    if (change >= 0) {
                        expectedAddWater += change;
                    } else {
                        expectedDeductWater += Math.abs(change);
                    }
                }

                rowsHtml += renderBetRecordRow(record, change);
            });

            validBetsContainer.innerHTML = rowsHtml || '<p style="color: #666;">暂无有效投注</p>';

            const totalAddWaterEl = document.getElementById('totalAddWater');
            if (totalAddWaterEl) {
                totalAddWaterEl.innerHTML = `预计加水数量: ${expectedAddWater} 水滴`;
            }

            const totalDeductWaterEl = document.getElementById('totalDeductWater');
            if (totalDeductWaterEl) {
                totalDeductWaterEl.innerHTML = `预计扣水数量: ${expectedDeductWater} 水滴`;
            }

            const summaryEl = document.getElementById('scanSummary');
            if (summaryEl) {
                summaryEl.innerHTML = `胜利队伍: ${currentScanOptions.winnerTeam}，获胜赔率: ${oddsValue}，投注范围: ${currentScanOptions.minBet}-${currentScanOptions.maxBet}水滴`;
            }
        }

        /**
         * 执行自动评分
         * 根据扫描到的投注信息和用户输入的参数，执行实际的评分操作
         */
        function performRating() {
            if (!currentScanOptions || Object.keys(betRecords).length === 0) {
                alert('请先扫描投注信息，并确保存在有效投注。');
                return;
            }

            const oddsInput = document.getElementById('odds');
            const odds = oddsInput ? parseFloat(oddsInput.value) : NaN;
            if (Number.isNaN(odds) || odds < 1.0 || odds > 9.9) {
                alert('请输入有效的赔率（1.0-9.9）！');
                return;
            }

            const rewardLimitInput = document.getElementById('rewardLimit');
            const rewardLimitValue = rewardLimitInput ? parseFloat(rewardLimitInput.value) : NaN;
            const rewardLimit = Number.isFinite(rewardLimitValue) ? rewardLimitValue : null;

            const resultArea = document.getElementById('resultArea');
            resultArea.innerHTML = '<p style="text-align: center; font-weight: bold;">正在执行自动评分...</p>';

            let victoryCount = 0;
            let defeatCount = 0;
            let victoryWaterTotal = 0;
            let defeatWaterTotal = 0;

            const promises = [];

            Object.keys(betRecords).forEach(pid => {
                const record = betRecords[pid];
                if (!record.enabled) {
                    return;
                }

                const waterChange = calculateWaterChange(record, odds, rewardLimit);
                const reason = record.result === 'win'
                    ? `恭喜您！预测正确！特为您送上水滴！${record.halfReward ? '（收益已减半）' : ''}`
                    : `很遗憾！预测失败！就差那么一点点！`;

                if (record.result === 'win') {
                    victoryCount++;
                    victoryWaterTotal += waterChange;
                } else {
                    defeatCount++;
                    defeatWaterTotal += Math.abs(waterChange);
                }

                const promise = rate(waterChange, reason, pid, threadId)
                    .then(() => {
                        console.log(`评分成功: PID=${pid}, 水滴变化=${waterChange}`);
                    })
                    .catch(error => {
                        console.error(`评分失败: PID=${pid}`, error);
                    });

                promises.push(promise);
            });

            if (promises.length === 0) {
                resultArea.innerHTML = '<p style="text-align: center; font-weight: bold;">没有可评分的投注，请检查筛选条件。</p>';
                return;
            }

            Promise.all(promises).then(() => {
                resultArea.innerHTML = `
                    <p style="text-align: center; font-weight: bold; color: #333;">自动评分完成！</p>
                    <p style="color: green;">胜利人数: ${victoryCount} 人，总计奖励: ${victoryWaterTotal} 水滴</p>
                    <p style="color: red;">失败人数: ${defeatCount} 人，总计扣除: ${defeatWaterTotal} 水滴</p>
                `;
            });
        }
    }

    // 页面加载完成后初始化控制面板
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBocaiPanel);
    } else {
        initBocaiPanel();
    }
})();

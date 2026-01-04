// ==UserScript==
// @name         图寻活跃玩家查询
// @namespace    http://tpmpermonkey.net/
// @version      1.7
// @description  查询图寻中国和世界排名数据，记录活跃玩家
// @author       Asukaprpr
// @match        https://tuxun.fun/*
// @match        http://tuxun.fun/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      tuxun.fun
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xhc3M9ImxheWVyIj48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiLz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+PHRpdGxlPjcwIEJhc2ljIGljb25zIGJ5IFhpY29ucy5jbzwvdGl0bGU+PHBhdGggZD0ibTI0LDEuMzJjLTkuOTIsMCAtMTgsNy44IC0xOCwxNy4zOGExNi44MywxNi44MyAwIDAgMCAzLjU3LDEwLjM5bDEyLjg0LDE2LjhhMiwyIDAgMCAwIDMuMTgsMGwxMi44NCwtMTYuOGExNi44NCwxNi44NCAwIDAgMCAzLjU3LC0xMC4zOWMwLC05LjU4IC04LjA4LC0xNy4zOCAtMTgsLTE3LjM4eiIgZmlsbD0iI2ZmOTQyNyIgaWQ9InN2Z18xIi8+PHBhdGggZD0ibTI1LjM3LDEyLjEzYTcsNyAwIDEgMCA1LjUsNS41YTcsNyAwIDAgMCAtNS41LC01LjV6IiBmaWxsPSIjZmZmZmZmIiBpZD0ic3ZnXzIiLz48L2c+PHRleHQgZmlsbD0iI2ZmMDAwMCIgZm9udC1mYW1pbHk9IkhlbHZldGljYSIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGlkPSJzdmdfMyIgbGV0dGVyLXNwYWNpbmc9IjAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB0ZXh0TGVuZ3RoPSIwIiB3b3JkLXNwYWNpbmc9IjEiIHg9IjE1IiB4bWw6c3BhY2U9InByZXNlcnZlIiB5PSI0OCI+UmE8L3RleHQ+PHRleHQgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IkhlbHZldGljYSIgZm9udC1zaXplPSIxNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGlkPSJzdmdfNCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjMzIiB4bWw6c3BhY2U9InByZXNlcnZlIiB5PSI0OCI+bms8L3RleHQ+PC9nPjwvc3ZnPg==
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/556666/%E5%9B%BE%E5%AF%BB%E6%B4%BB%E8%B7%83%E7%8E%A9%E5%AE%B6%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/556666/%E5%9B%BE%E5%AF%BB%E6%B4%BB%E8%B7%83%E7%8E%A9%E5%AE%B6%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let playerHistory = GM_getValue('playerHistory', { china: {}, world: {} });
    let currentGameMode = GM_getValue('currentGameMode', 'china');
    let rankData = GM_getValue('rankData', { china: null, world: null });
    let lastFetchTime = GM_getValue('lastFetchTime', { china: 0, world: 0 });
    let lastCheckTime = GM_getValue('lastCheckTime', 0);
    let autoCheckInterval = null;

    function createPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
        position: fixed;
        top: 90px;
        left: 20px;
        background: rgba(25, 25, 35, 0.9);
        border: 1px solid #444;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        z-index: 10000;
        font-family: Arial, sans-serif;
        min-width: 140px;
        min-height: 130px;
        color: #e0e0e0;
        backdrop-filter: blur(5px);
        opacity: 0.9;
    `;

        panel.innerHTML = `
        <div style="margin-bottom: 12px; font-weight: bold; text-align: center; color: #ffffff; font-size: 14px;">图寻排名查询</div>
        <div style="margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
            <div style="font-size: 12px; margin-right: 8px; color:'#ffffff';">中国</div>
            <div class="toggle-switch" style="position: relative; width: 40px; height: 20px; background: ${currentGameMode === 'china' ? '#555' : '#555'}; border-radius: 10px; cursor: pointer;">
                <div class="toggle-slider" style="position: absolute; top: 2px; left: ${currentGameMode === 'china' ? '2px' : '22px'}; width: 16px; height: 16px; background: #e0e0e0; border-radius: 50%; transition: left 0.2s;"></div>
            </div>
            <div style="font-size: 12px; margin-left: 8px; color: ${currentGameMode === 'world' ? '#b0b0b0' : '#b0b0b0'};">世界</div>
        </div>
        <button id="fetchRankBtn" style="width: 100%; padding: 6px; background: #395f8bdd; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            获取排名数据
        </button>
        <div id="status" style="margin-top: 8px; font-size: 11px; color: #b0b0b0; text-align: center;"></div>
    `;

        document.body.appendChild(panel);

        const toggleSwitch = panel.querySelector('.toggle-switch');
        toggleSwitch.addEventListener('click', function () {
            const newMode = currentGameMode === 'china' ? 'world' : 'china';
            switchGameMode(newMode);
        });

        const fetchBtn = panel.querySelector('#fetchRankBtn');
        fetchBtn.addEventListener('click', fetchRankData);

        return panel;
    }

    function switchGameMode(newMode) {
        currentGameMode = newMode;
        GM_setValue('currentGameMode', currentGameMode);
        updateStatus('模式已切换');

        const toggleSwitch = document.querySelector('.toggle-switch');
        const toggleSlider = toggleSwitch.querySelector('.toggle-slider');
        const chinaLabel = toggleSwitch.previousElementSibling;
        const worldLabel = toggleSwitch.nextElementSibling;

        if (currentGameMode === 'china') {
            toggleSlider.style.left = '2px';
            toggleSwitch.style.background = '#555';
            chinaLabel.style.color = '#ffffffff';
            worldLabel.style.color = '#b0b0b0';
        } else {
            toggleSlider.style.left = '22px';
            toggleSwitch.style.background = '#555';
            chinaLabel.style.color = '#b0b0b0';
            worldLabel.style.color = '#ffffffff';
        }

        const now = Date.now();
        const twoMinutes = 2 * 60 * 1000;

        if (rankData[currentGameMode] && (now - lastFetchTime[currentGameMode]) < twoMinutes) {
            displayRankList(rankData[currentGameMode]);
            updateStatus('使用缓存数据');
        } else {
            fetchRankData();
        }
    }

    const reference = 'Script by Asukaprpr'

    function updateStatus(message) {
        const statusEl = document.querySelector('#status');
        if (statusEl) {
            statusEl.textContent = message;

            // 根据状态内容控制按钮禁用状态
            const toggleSwitch = document.querySelector('.toggle-switch');
            const fetchBtn = document.querySelector('#fetchRankBtn');

            if (message !== reference) {
                if (toggleSwitch) toggleSwitch.style.pointerEvents = 'none';
                if (fetchBtn) fetchBtn.disabled = true;
            } else {
                if (toggleSwitch) toggleSwitch.style.pointerEvents = 'auto';
                if (fetchBtn) fetchBtn.disabled = false;
            }

            if (message !== reference) {
                setTimeout(() => {
                    statusEl.textContent = reference;
                    if (toggleSwitch) toggleSwitch.style.pointerEvents = 'auto';
                    if (fetchBtn) fetchBtn.disabled = false;
                }, 2000);
            }
        }
    }

    function fetchRankData() {
        const url = `https://tuxun.fun/api/v0/tuxun/getRank?type=${currentGameMode}`;
        updateStatus('正在获取数据...');
        const toggleSwitch = document.querySelector('.toggle-switch');//disable btn
        const fetchBtn = document.querySelector('#fetchRankBtn');
        if (toggleSwitch) toggleSwitch.style.pointerEvents = 'none';
        if (fetchBtn) fetchBtn.disabled = true;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                setTimeout(() => {
                    if (toggleSwitch) toggleSwitch.style.pointerEvents = 'auto';
                    if (fetchBtn) fetchBtn.disabled = false;
                }, 500);

                try {
                    const data = JSON.parse(response.responseText);
                    if (data.success) {
                        updateStatus('数据获取成功');
                        processRankData(data.data);
                    } else {
                        updateStatus('获取数据失败');
                    }
                } catch (e) {
                    updateStatus('解析数据失败');
                }
            },
            onerror: function (error) {
                if (toggleSwitch) toggleSwitch.style.pointerEvents = 'auto';
                if (fetchBtn) fetchBtn.disabled = false;
                updateStatus('网络请求失败');
            }
        });
    }

    function processRankData(data) {
        if (!data || !Array.isArray(data)) {
            alert('数据格式错误');
            return;
        }

        const sortedData = data
            .filter(item => item && item.rank)
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 100);

        rankData[currentGameMode] = sortedData;
        lastFetchTime[currentGameMode] = Date.now();

        GM_setValue('rankData', rankData);
        GM_setValue('lastFetchTime', lastFetchTime);

        checkActivePlayers(sortedData).then(dataWithActive => {
            displayRankList(dataWithActive);
            updatePlayerHistory(sortedData);
            updateStatus('数据加载完成');
        });
    }

    function checkActivePlayers(data) {
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;
        const shouldCheckAll = (now - lastCheckTime) > tenMinutes;

        const checkPromises = [];

        data.forEach(player => {
            const userId = player.userAO.userId;
            const playerRecord = playerHistory[currentGameMode][userId];
            const currentRating = currentGameMode === 'china' ? player.userAO.chinaRating : player.userAO.rating;

            let shouldCheck = false;

            if (shouldCheckAll) {
                shouldCheck = true;
            } else if (playerRecord) {
                const ratingChanged = playerRecord.rating !== currentRating;
                const wasActive = playerRecord.isActive;
                shouldCheck = ratingChanged || wasActive;
            } else {
                shouldCheck = true;
            }

            if (shouldCheck) {
                checkPromises.push(checkPlayerActivity(userId).then(isActive => {
                    player.isActive = isActive;
                    return player;
                }));
            } else {
                player.isActive = playerRecord ? playerRecord.isActive : false;
                checkPromises.push(Promise.resolve(player));
            }
        });

        lastCheckTime = now;
        GM_setValue('lastCheckTime', lastCheckTime);

        return Promise.all(checkPromises);
    }

    function checkPlayerActivity(userId) {
        return new Promise((resolve) => {
            const url = `https://tuxun.fun/api/v0/tuxun/history/listUserRating?userId=${userId}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success && data.data && data.data.length > 0) {
                            const now = Date.now();
                            const activeTimeLimit = 10 * 60 * 1000;//time limit to determine active users
                            for (let game of data.data) {
                                if (isRelevantGame(game, currentGameMode)) {
                                    const gameStartTime = game.gmtCreate;
                                    if (now - gameStartTime <= activeTimeLimit) {
                                        resolve(true);
                                        return;
                                    }
                                    break;
                                }
                            }
                        }
                        resolve(false);
                    } catch (e) {
                        resolve(false);
                    }
                },
                onerror: function () {
                    resolve(false);
                },
                timeout: 5000
            });
        });
    }

    function isRelevantGame(game, gameMode) {
        if (gameMode === 'china') {
            return game.type === 'solo_match' && game.ratingType === 'china';
        } else {
            return (game.type === 'solo_match' && game.ratingType === 'world') ||
                game.type === 'main_game';
        }
    }

    function updatePlayerHistory(currentData) {
        const now = Date.now();

        currentData.forEach(player => {
            const userId = player.userAO.userId;
            const currentRating = currentGameMode === 'china' ? player.userAO.chinaRating : player.userAO.rating;

            playerHistory[currentGameMode][userId] = {
                rating: currentRating,
                timestamp: now,
                userName: player.userAO.userName,
                isActive: player.isActive || false
            };
        });

        GM_setValue('playerHistory', playerHistory);
    }

    function displayRankList(data) {
        try {
            let container = document.getElementById('rankListContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'rankListContainer';
                container.style.cssText = `
                    position: fixed;
                    top: 230px;
                    left: 20px;
                    background: rgba(25, 25, 35, 0.9);
                    border: 1px solid #444;
                    border-radius: 8px;
                    padding: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    z-index: 9999;
                    font-family: Arial, sans-serif;
                    max-height: 300px;
                    overflow-y: auto;
                    min-width: 320px;
                    color: #e0e0e0;
                    backdrop-filter: blur(5px);
                    opacity:0.95;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                `;
                const style = document.createElement('style');
                style.textContent = `
                #rankListContainer::-webkit-scrollbar {
                    display: none;
                }
            `;
                document.body.appendChild(container);
            }

            container.innerHTML = '';

            const activePlayers = data.filter(player => player.isActive).length;

            const title = document.createElement('div');
            title.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px; text-align: center; font-size: 14px; color: #ffffff;">
                    前100名排名 - ${currentGameMode === 'china' ? '中国积分' : '世界积分'}
                </div>
                <div style="font-size: 13px; margin-bottom: 4px; text-align: center; color: ${activePlayers > 0 ? '#4CAF50' : '#b0b0b0'};">
                    活跃玩家: ${activePlayers} 人
                </div>
            `;
            title.style.cssText = `
                padding-bottom: 4px;
                border-bottom: 1px solid #444;
            `;
            container.appendChild(title);

            const table = document.createElement('table');
            table.style.cssText = `
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
            `;

            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background: rgba(50, 50, 60, 0.8);">
                    <th style="padding: 6px; text-align: center; border-bottom: 1px solid #555; color: #ffffff;">排名</th>
                    <th style="padding: 6px; text-align: center; border-bottom: 1px solid #555; color: #ffffff;">玩家名称</th>
                    <th style="padding: 6px; text-align: center; border-bottom: 1px solid #555; color: #ffffff;">积分</th>
                    <th style="padding: 6px; text-align: center; border-bottom: 1px solid #555; color: #ffffff;">积分变化</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            data.forEach((player, index) => {
                const row = document.createElement('tr');

                if (player.isActive) {
                    row.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
                    row.style.fontWeight = 'bold';
                } else if (index % 2 === 0) {
                    row.style.backgroundColor = 'rgba(40, 40, 50, 0.5)';
                }

                let rankColor = '#e0e0e0';
                if (player.rank === 1) rankColor = '#FFD700';
                else if (player.rank === 2) rankColor = '#C0C0C0';
                else if (player.rank === 3) rankColor = '#CD7F32';
                else if (player.rank <= 10) rankColor = '#FF6B6B';

                let changeColor = '#b0b0b0';
                let changeText = '-';
                const playerRecord = playerHistory[currentGameMode][player.userAO.userId];
                if (playerRecord) {
                    const currentRating = currentGameMode === 'china' ? player.userAO.chinaRating : player.userAO.rating;
                    const ratingChange = currentRating - playerRecord.rating;
                    if (ratingChange > 0) {
                        changeColor = '#4CAF50';
                        changeText = `+${ratingChange}`;
                    } else if (ratingChange < 0) {
                        changeColor = '#F44336';
                        changeText = ratingChange.toString();
                    } else if (ratingChange === 0) {
                        changeText = '0';
                    }
                }

                const currentRating = currentGameMode === 'china' ? player.userAO.chinaRating : player.userAO.rating;

                row.innerHTML = `
                    <td style="padding: 4px; font-weight: bold; text-align: center; color: ${rankColor};">${player.rank}</td>
                    <td style="padding: 4px; color: #e0e0e0;">${escapeHtml(player.userAO.userName)}</td>
                    <td style="padding: 4px; text-align: center; font-weight: bold; color: #ffffff;">${currentRating}</td>
                    <td style="padding: 4px; text-align: center; color: ${changeColor}; font-weight: bold;">${changeText}</td>
                `;
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            container.appendChild(table);
        } catch (error) {
            console.error('显示排名列表时出错:', error);
            updateStatus('显示数据时出错');
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function autoCheck() {
        if (rankData[currentGameMode]) {
            updateStatus('自动更新数据...');
            fetchRankData();
        }
    }

    function startAutoCheck() {
        if (autoCheckInterval) {
            clearInterval(autoCheckInterval);
        }
        autoCheckInterval = setInterval(autoCheck, 2 * 60 * 1000);
    }

    function waitForPageLoad() {
        if (document.body) {
            init();
        } else {
            setTimeout(waitForPageLoad, 100);
        }
    }

    function init() {
        createPanel();
        updateStatus('工具已加载');
        startAutoCheck();

        const now = Date.now();
        const twoMinutes = 2 * 60 * 1000;

        if (rankData[currentGameMode] && (now - lastFetchTime[currentGameMode]) < twoMinutes) {
            displayRankList(rankData[currentGameMode]);
            updateStatus('使用缓存数据');
        } else {
            updateStatus('自动更新数据...');
            fetchRankData();
        }
    }

    window.addEventListener('beforeunload', function () {
        if (autoCheckInterval) {
            clearInterval(autoCheckInterval);
        }
    });

    waitForPageLoad();
})();
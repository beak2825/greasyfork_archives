// ==UserScript==
// @name         一键下馆子
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在思齐开餐馆页面添加“设置访问用户”和“一键下馆子”功能，简化每日操作。
// @author       ExpertCoder
// @match        https://si-qi.xyz/siqi_restaurant.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556185/%E4%B8%80%E9%94%AE%E4%B8%8B%E9%A6%86%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/556185/%E4%B8%80%E9%94%AE%E4%B8%8B%E9%A6%86%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEY = 'SIQI_RESTAURANT_VISIT_USERS';
    const MAX_USERS = 3;

    /**
     * 等待游戏对象和UI加载完成
     */
    const waitForGame = setInterval(() => {
        const gameApp = unsafeWindow.SiqiRestaurantGame;
        const dineOutContainer = document.querySelector('.rest-dine-out');

        if (gameApp && gameApp.showModal && dineOutContainer) {
            clearInterval(waitForGame);
            init();
        }
    }, 500);

    /**
     * 初始化脚本
     */
    function init() {
        const dineOutContainer = document.querySelector('.rest-dine-out');
        if (!dineOutContainer) return;

        // --- 创建“设置访问用户”按钮 ---
        const settingsButton = document.createElement('button');
        settingsButton.id = 'rest-users-settings-btn';
        settingsButton.className = 'rest-btn secondary';
        settingsButton.textContent = '设置访问用户';
        settingsButton.addEventListener('click', showSettingsModal);

        // --- 创建“一键下馆子”按钮 ---
        const oneClickButton = document.createElement('button');
        oneClickButton.id = 'rest-one-click-visit-btn';
        oneClickButton.className = 'rest-btn'; // 主按钮样式
        oneClickButton.textContent = '一键下馆子';
        oneClickButton.addEventListener('click', handleOneClickVisit);

        // --- 将按钮添加到页面 ---
        dineOutContainer.appendChild(settingsButton);
        dineOutContainer.appendChild(oneClickButton);
    }

    /**
     * 显示设置用户的模态框
     */
    function showSettingsModal() {
        const gameApp = unsafeWindow.SiqiRestaurantGame;
        const savedUsers = GM_getValue(CONFIG_KEY, []);

        let inputsHtml = '';
        for (let i = 0; i < MAX_USERS; i++) {
            const username = savedUsers[i] || '';
            inputsHtml += `
                <div class="rest-modal-field">
                    <label for="rest-visit-user-${i}">用户 ${i + 1}</label>
                    <input type="text" id="rest-visit-user-${i}" class="rest-modal-input" data-field="username" value="${escapeHtml(username)}" placeholder="输入用户名（可留空）" />
                </div>
            `;
        }

        gameApp.showModal({
            title: '设置一键下馆子用户列表',
            html: `
                <p>请在下方输入框中设置您想每日访问的用户，最多${MAX_USERS}位。</p>
                ${inputsHtml}
                <div class="rest-modal-note">保存后，点击“一键下馆子”按钮即可自动访问。</div>
            `,
            confirmText: '保存设置',
            onConfirm: ({ modal }) => {
                const newUsers = [];
                for (let i = 0; i < MAX_USERS; i++) {
                    const input = modal.querySelector(`#rest-visit-user-${i}`);
                    if (input && input.value.trim()) {
                        newUsers.push(input.value.trim());
                    }
                }
                GM_setValue(CONFIG_KEY, newUsers);
                gameApp.setMessage('用户列表已成功保存！', 'success');
            }
        });
    }

    /**
     * 处理“一键下馆子”按钮点击事件
     */
    function handleOneClickVisit() {
        const gameApp = unsafeWindow.SiqiRestaurantGame;
        const usersToVisit = GM_getValue(CONFIG_KEY, []);

        if (usersToVisit.length === 0) {
            gameApp.setMessage('您还没有设置要访问的用户。请先点击“设置访问用户”。', 'warning');
            return;
        }

        const message = `
            <p>即将开始一键下馆子，将按顺序访问以下用户：</p>
            <ul class="rest-modal-list">
                ${usersToVisit.map(u => `<li>${escapeHtml(u)}</li>`).join('')}
            </ul>
            <p>脚本会自动跳过已访问的用户和超出每日限制的访问。是否继续？</p>
        `;

        gameApp.showModal({
            title: '确认一键下馆子',
            html: message,
            confirmText: '开始访问',
            onConfirm: () => {
                runOneClickVisitProcess(usersToVisit);
            }
        });
    }

    /**
     * 执行一键访问流程
     * @param {string[]} users - 要访问的用户数组
     */
    async function runOneClickVisitProcess(users) {
        const gameApp = unsafeWindow.SiqiRestaurantGame;
        const oneClickButton = document.getElementById('rest-one-click-visit-btn');

        oneClickButton.disabled = true;
        oneClickButton.textContent = '正在访问...';

        let visitsPerformed = 0;

        for (const username of users) {
            // 每次循环前都获取最新的游戏数据
            const visitData = gameApp.data.visits;
            const remainingVisits = visitData.limit - visitData.count;

            if (remainingVisits <= 0) {
                gameApp.setMessage('今日下馆子次数已用完，访问中止。', 'warning');
                break;
            }

            const alreadyVisited = visitData.records.some(record => record.target_username.toLowerCase() === username.toLowerCase());

            if (alreadyVisited) {
                gameApp.setMessage(`用户“${escapeHtml(username)}”今日已访问过，自动跳过。`, 'info');
                await delay(500); // 短暂停顿，让用户看到消息
                continue;
            }

            gameApp.setMessage(`正在尝试访问用户：“${escapeHtml(username)}”...`, 'info');

            // 调用游戏内的方法进行访问，并传递确认参数
            gameApp.visitOtherRestaurant(username, true);
            visitsPerformed++;

            // 等待API调用完成（游戏内会设置loading状态）
            await waitFor(() => !gameApp.loading, 10000); // 等待最多10秒
            await delay(1500); // API调用后额外等待一下，确保数据刷新
        }

        if (visitsPerformed > 0) {
            gameApp.setMessage(`一键下馆子执行完毕，共成功发起 ${visitsPerformed} 次访问。`, 'success');
        } else {
             gameApp.setMessage(`一键下馆子执行完毕，没有需要访问的新用户。`, 'info');
        }

        oneClickButton.disabled = false;
        oneClickButton.textContent = '一键下馆子';
    }


    // --- 辅助工具函数 ---

    function escapeHtml(str) {
        const p = document.createElement("p");
        p.textContent = str;
        return p.innerHTML;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitFor(condition, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            const startTime = Date.now();

            const check = () => {
                if (condition()) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('等待超时'));
                } else {
                    setTimeout(check, interval);
                }
            };
            check();
        });
    }

})();


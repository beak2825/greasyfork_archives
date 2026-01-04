// ==UserScript==
// @name         GitHub Actions - 自动删除最旧的工作流 (带开关)
// @namespace    http://tampermonkey.net/
// @version      2025.09.07.6
// @description  【警告：此脚本会自动操作！】在 GitHub Actions 页面添加一个开关按钮，用于控制是否自动循环删除列表最底部（最旧的）那个工作流。
// @author       Gemini
// @match        https://github.com/*/*/actions
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548675/GitHub%20Actions%20-%20%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%9C%80%E6%97%A7%E7%9A%84%E5%B7%A5%E4%BD%9C%E6%B5%81%20%28%E5%B8%A6%E5%BC%80%E5%85%B3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548675/GitHub%20Actions%20-%20%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%9C%80%E6%97%A7%E7%9A%84%E5%B7%A5%E4%BD%9C%E6%B5%81%20%28%E5%B8%A6%E5%BC%80%E5%85%B3%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'isAutoDeleteOldestActive'; // 使用一个新的存储键以避免和旧脚本冲突

    // --- 样式定义 ---
    GM_addStyle(`
        .auto-delete-toggle-btn {
            margin-left: 8px;
            color: white;
            border: 1px solid rgba(27, 31, 35, 0.15);
            padding: 5px 16px;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            border-radius: 6px;
            cursor: pointer;
            width: 150px; /* 固定宽度防止文字变化时跳动 */
            text-align: center;
        }
        .auto-delete-toggle-btn.active {
            background-color: #d73a49; /* 红色代表激活状态 */
        }
        .auto-delete-toggle-btn.active:hover {
            background-color: #cb2431;
        }
        .auto-delete-toggle-btn.inactive {
            background-color: #2ea44f; /* 绿色代表非激活状态 */
        }
        .auto-delete-toggle-btn.inactive:hover {
            background-color: #2c974b;
        }
    `);

    // --- 核心功能函数 ---

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function deleteOldestWorkflow() {
        console.log('【自动删除已激活】正在查找最旧的工作流...');

        // *** 核心修改点 (1/2): 查找所有匹配的元素 ***
        const allKebabMenus = document.querySelectorAll('summary.timeline-comment-action[aria-haspopup="menu"]');

        if (allKebabMenus.length === 0) {
            console.log('未发现可删除的工作流。脚本结束运行，并自动关闭开关。');
            await GM_setValue(STORAGE_KEY, false); // 自动关闭开关
            updateButtonState(false);
            return;
        }

        // *** 核心修改点 (2/2): 从列表中选择最后一个元素 ***
        const oldestKebabMenu = allKebabMenus[allKebabMenus.length - 1];

        console.log('发现工作流，开始删除最旧的一个...');
        try {
            oldestKebabMenu.click();
            await sleep(300);

            const detailsElement = oldestKebabMenu.closest('details');
            const deleteButton = detailsElement.querySelector('button[data-show-dialog-id^="delete-workflow-run-"]');
            if (!deleteButton) {
                console.error('未找到 "Delete" 按钮。');
                oldestKebabMenu.click();
                return;
            }

            const dialogId = deleteButton.getAttribute('data-show-dialog-id');
            deleteButton.click();
            await sleep(400);

            const confirmButtonSelector = `#${dialogId} button.Button--danger[type="submit"]`;
            const confirmButton = document.querySelector(confirmButtonSelector);
            if (!confirmButton) {
                console.error('未找到 "Confirm" 按钮。');
                const closeButton = document.querySelector(`#${dialogId} .Overlay-closeButton`);
                if (closeButton) closeButton.click();
                return;
            }

            confirmButton.click();
            console.log('删除请求已提交！2.5秒后刷新页面...');
            setTimeout(() => {
                window.location.reload();
            }, 2500);

        } catch (error) {
            console.error('删除工作流时出错:', error);
            await GM_setValue(STORAGE_KEY, false);
            updateButtonState(false);
        }
    }

    // --- UI 和状态管理 ---

    const toggleButton = document.createElement('button');
    toggleButton.className = 'auto-delete-toggle-btn';

    function updateButtonState(isActive) {
        if (isActive) {
            toggleButton.innerHTML = '⏹️ 停止自动删除';
            toggleButton.classList.remove('inactive');
            toggleButton.classList.add('active');
            toggleButton.title = '点击后，将不再自动删除工作流。';
        } else {
            // *** 修改按钮文字 ***
            toggleButton.innerHTML = '▶️ 删除最旧的';
            toggleButton.classList.remove('active');
            toggleButton.classList.add('inactive');
            toggleButton.title = '点击后，每次打开此页面都会自动删除最底部（最旧的）的工作流。';
        }
    }

    async function main() {
        const headerActions = document.querySelector('.Box-header .table-list-header-toggle.states');
        if (headerActions) {
            headerActions.appendChild(toggleButton);
        } else {
            console.error('无法找到按钮的插入位置。');
            return;
        }

        const isActive = await GM_getValue(STORAGE_KEY, false);
        updateButtonState(isActive);

        toggleButton.addEventListener('click', async () => {
            const currentState = await GM_getValue(STORAGE_KEY, false);
            const newState = !currentState;
            await GM_setValue(STORAGE_KEY, newState);
            updateButtonState(newState);
            if (newState) {
                window.location.reload();
            }
        });

        if (isActive) {
            // *** 修改调用的函数 ***
            setTimeout(deleteOldestWorkflow, 2000);
        }
    }

    main();

})();
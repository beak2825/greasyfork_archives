// ==UserScript==
// @name         去尼玛的滚动条(某60众包平台漏洞列表)
// @namespace    https://greasyfork.org/en/users/1522931-hongzh0
// @version      1.02
// @description  优化第一版
// @author       hongzh0
// @match        https://src.360.net/hacker/bug/list
// @grant        GM_xmlhttpRequest
// @connect      src.360.net
// @run-at       document-idle
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/551781/%E5%8E%BB%E5%B0%BC%E7%8E%9B%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1%28%E6%9F%9060%E4%BC%97%E5%8C%85%E5%B9%B3%E5%8F%B0%E6%BC%8F%E6%B4%9E%E5%88%97%E8%A1%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551781/%E5%8E%BB%E5%B0%BC%E7%8E%9B%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1%28%E6%9F%9060%E4%BC%97%E5%8C%85%E5%B9%B3%E5%8F%B0%E6%BC%8F%E6%B4%9E%E5%88%97%E8%A1%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置与映射 ---
    const API_URL = 'https://src.360.net/api/frontend/hacker/usercenter/mysubmittedbugs';
    const PAGE = 1;
    const PAGE_NUM = 500;
    const STORAGE_KEY = '360src_viewer_theme';
    const VIEWER_POSITION_KEY = '360src_viewer_pos';
    const VIEWER_SIZE_KEY = '360src_viewer_size';
    const ICON_POSITION_KEY = '360src_icon_pos';

    const STATUS_MAP = {
        1: '待初审', 2: '待确认', 5: '已完成', 6: '已完成', 7: '已完成',
        10: '已完成', 15: '已忽略', 17: '已驳回'
    };

    const LEVEL_MAP = {
        1: '严重',
        5: '高危',
        10: '中危',
        15: '低危',
        0: '-'
    };

    let currentTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
    let viewerContainer = null;
    let floatButton = null;

    // --- 辅助函数 ---

    function createEditUrlParam(bugId) {
        const jsonString = JSON.stringify({ "id": bugId });
        const encoded1 = encodeURIComponent(jsonString);
        return encoded1;
    }

    /**
     * 加载元素状态 (位置和尺寸)。
     */
    function loadState(element, posKey, sizeKey) {
        const savedPos = localStorage.getItem(posKey);
        const hasSavedPos = savedPos && element;

        if (hasSavedPos) {
            const { x, y } = JSON.parse(savedPos);
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.transform = 'none';

            // 关键：移除居中类，确保它使用绝对定位
            if (element === viewerContainer) {
                 element.classList.remove('is-centered');
            }
        } else if (element === viewerContainer) {
            // 如果是查看器且没有保存位置，则添加居中类
            element.classList.add('is-centered');
        }

        if (sizeKey && element) {
            const savedSize = localStorage.getItem(sizeKey);
            if (savedSize) {
                const { w, h } = JSON.parse(savedSize);
                element.style.width = `${w}px`;
                element.style.height = `${h}px`;
                element.style.maxWidth = 'none';
                element.style.maxHeight = 'none';

                const tableWrapper = document.getElementById('bug-viewer-table-wrapper');
                if (tableWrapper) {
                    tableWrapper.style.maxHeight = `calc(${h}px - 100px)`;
                }
            }
        }
    }


    // --- 拖动和调整大小逻辑  ---
    let isDragging = false;
    let isResizing = false;
    let isInteracting = false;
    let offsetX, offsetY;
    let dragElement, posKey;

    function startInteraction(e) {
        if (e.button !== 0) return;

        // 排除交互元素：
        if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('#theme-toggle') || e.target.closest('#bug-viewer-close')) {
            return;
        }

        const containerRect = viewerContainer.getBoundingClientRect();
        let shouldStart = false;
        let interactiveElement = null; // 用于计算初始偏移量的元素

        // 1. 检查是否在拖动浮动按钮
        if (e.target.id === 'floating-bug-button') {
            dragElement = floatButton;
            posKey = ICON_POSITION_KEY;
            isDragging = true;
            shouldStart = true;
            interactiveElement = floatButton;
        }

        // 2. 检查是否在调整窗口大小
        else if (viewerContainer.style.display !== 'none' && e.clientX > containerRect.right - 25 && e.clientY > containerRect.bottom - 25) {
            isResizing = true;
            shouldStart = true;
            document.body.style.cursor = 'nwse-resize';
            interactiveElement = viewerContainer; // 调整大小基于容器本身
        }

        // 3. 检查是否在拖动窗口本身
        else if (e.target.closest('#bug-viewer-header')) {
            dragElement = viewerContainer;
            posKey = VIEWER_POSITION_KEY;
            viewerContainer.style.cursor = 'grabbing';
            isDragging = true;
            shouldStart = true;
            interactiveElement = viewerContainer;
        }

        if (shouldStart) {
            isInteracting = true;
            e.preventDefault();

            // 关键修复 1: 禁用动画，防止拖拽/调整大小过程中干扰，但保留 is-active
            viewerContainer.style.transition = 'none';

            // 关键修复 2: 如果是拖动或调整窗口，并且窗口是居中显示的，必须先转换为绝对定位
            if ((isDragging && dragElement === viewerContainer) || isResizing) {
                 if (viewerContainer.classList.contains('is-centered')) {
                     const currentRect = viewerContainer.getBoundingClientRect();
                     viewerContainer.style.transform = 'none';
                     viewerContainer.style.left = `${currentRect.left}px`;
                     viewerContainer.style.top = `${currentRect.top}px`;
                     viewerContainer.classList.remove('is-centered'); // 拖动/调整后就不是居中了
                 }
            }

            // 计算偏移量
            const rect = interactiveElement.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            document.addEventListener('mousemove', interaction);
            document.addEventListener('mouseup', stopInteraction);
        }
    }

    function interaction(e) {
        if (!isDragging && !isResizing) return;

        // 1. 调整大小
        if (isResizing) {
            const minWidth = 600;
            const minHeight = 480;
            // 关键: 必须使用 getBoundingClientRect() 获取当前的左上角位置
            const containerRect = viewerContainer.getBoundingClientRect();

            let newWidth = e.clientX - containerRect.left;
            let newHeight = e.clientY - containerRect.top;

            newWidth = Math.max(newWidth, minWidth);
            newHeight = Math.max(newHeight, minHeight);
            newWidth = Math.min(newWidth, window.innerWidth - containerRect.left - 10);
            newHeight = Math.min(newHeight, window.innerHeight - containerRect.top - 10);

            viewerContainer.style.width = `${newWidth}px`;
            viewerContainer.style.height = `${newHeight}px`;

            localStorage.setItem(VIEWER_SIZE_KEY, JSON.stringify({ w: newWidth, h: newHeight }));

            document.getElementById('bug-viewer-table-wrapper').style.maxHeight = `calc(${newHeight}px - 100px)`;
        }

        // 2. 拖动
        else if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            newX = Math.max(0, Math.min(newX, window.innerWidth - dragElement.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - dragElement.offsetHeight));

            dragElement.style.left = `${newX}px`;
            dragElement.style.top = `${newY}px`;

            // 实时保存位置
            localStorage.setItem(posKey, JSON.stringify({x: newX, y: newY}));
        }
    }

    function stopInteraction() {
        isDragging = false;
        isResizing = false;
        isInteracting = false;
        document.body.style.cursor = 'default';

        if (viewerContainer) {
            viewerContainer.style.cursor = 'default';
            viewerContainer.style.transition = 'opacity 0.3s, transform 0.3s';
            viewerContainer.classList.add('is-active'); // 确保窗口在停止交互后保持可见
        }
        if (floatButton) floatButton.style.transition = 'all 0.3s';

        document.removeEventListener('mousemove', interaction);
        document.removeEventListener('mouseup', stopInteraction);
    }

    // --- 主题切换函数  ---
    function toggleTheme() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.remove(currentTheme + '-theme');
        document.body.classList.add(newTheme + '-theme');
        currentTheme = newTheme;
        localStorage.setItem(STORAGE_KEY, newTheme);
        updateThemeToggleButton(newTheme);
    }

    function updateThemeToggleButton(theme) {
        const button = document.getElementById('theme-toggle');
        if(button) {
            button.textContent = theme === 'light' ? '🌙' : '☀️';
            button.title = theme === 'light' ? '切换到深色模式' : '切换到浅色模式';
        }
    }


    // --- 样式注入  ---
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'bug-viewer-styles';
        style.textContent = `
            /* --- 动画定义 --- */
            @keyframes slideInFromTop {
                0% { opacity: 0; transform: translate(-50%, -100px) scale(0.95); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* --- 主题变量 --- */
            .light-theme {
                --bg-primary: #f8f9fa; --bg-secondary: #ffffff; --text-primary: #212529; --text-muted: #6c757d; --border-color: #dee2e6; --hover-color: #e9ecef; --brand-color: #483d8b; --brand-accent: #6a5acd; --link-primary: #5f9ea0; --critical-color: #dc3545; --scroll-track: #e0e0e0; --scroll-thumb: #adb5bd; --status-pending-bg: #fff3cd; --status-done-bg: #d4edda; --status-reject-bg: #f8d7da; --status-text-pending: #856404; --status-text-done: #155724; --status-text-reject: #721c24;
            }

            .dark-theme {
                --bg-primary: #2b3035; --bg-secondary: #343a40; --text-primary: #f8f9fa; --text-muted: #adb5bd; --border-color: #495057; --hover-color: #495057; --brand-color: #7b68ee; --brand-accent: #8a2be2; --link-primary: #7fffd4; --critical-color: #dc3545; --scroll-track: #495057; --scroll-thumb: #6c757d; --status-pending-bg: #4e4035; --status-done-bg: #344e3a; --status-reject-bg: #5a3c42; --status-text-pending: #ffc107; --status-text-done: #90ee90; --status-text-reject: #ffb6c1;
            }

            /* --- 容器和全局样式 --- */
            #bug-viewer-container {
                position: fixed;
                min-width: 600px;
                min-height: 480px;
                width: 80%;
                max-width: 1600px;
                max-height: 95vh;
                background: var(--bg-primary);
                color: var(--text-primary);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 2px var(--brand-color);
                border-radius: 12px;
                z-index: 9999;
                padding: 25px;
                overflow: hidden;
                display: none;
                font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                transition: opacity 0.3s, transform 0.3s;

                /* 默认定位为左上角，等待 JS 设置 */
                top: 50px;
                left: 50px;
                right: auto;
                bottom: auto;
                transform: none;
                opacity: 0;
            }

            /* 第一次打开或没有保存位置时，应用居中定位和动画 */
            #bug-viewer-container.is-centered {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            #bug-viewer-container::after {
                content: '';
                position: absolute;
                bottom: 0;
                right: 0;
                width: 25px;
                height: 25px;
                cursor: nwse-resize;
                z-index: 10000;
                background: none;
            }

            #bug-viewer-container.is-active {
                display: block;
                animation: none;
                opacity: 1;
            }

            /* 如果居中，应用动画 */
            #bug-viewer-container.is-active.is-centered {
                animation: slideInFromTop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }

            #bug-viewer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 15px;
                margin-bottom: 15px;
                cursor: grab;
                user-select: none;
                border-bottom: 3px solid var(--brand-color);
            }
            #bug-viewer-header h2 {
                font-size: 1.4em;
                font-weight: 700;
                color: var(--brand-color);
            }

            /* --- 浮动图标按钮 (略) --- */
            #floating-bug-button {
                width: 55px; height: 55px; background-color: var(--brand-color); color: var(--bg-primary); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); font-size: 26px; border-radius: 50%; cursor: grab; z-index: 10001; position: fixed; border: 2px solid var(--bg-secondary); transition: all 0.2s; display: flex; align-items: center; justify-content: center; right: 30px; top: 100px;
            }
            #floating-bug-button:hover {
                transform: scale(1.1); background-color: var(--brand-accent); box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
            }
            #floating-bug-button.is-loading {
                animation: spin 1s linear infinite;
            }

            /* --- 表格和按钮样式 (略) --- */
            #bug-viewer-table-wrapper {
                max-height: calc(95vh - 100px); overflow-y: auto; overflow-x: hidden; padding-right: 5px; scrollbar-width: thin; scrollbar-color: var(--scroll-thumb) var(--scroll-track);
            }
            #bug-viewer-table-wrapper::-webkit-scrollbar {
                width: 8px;
            }
            #bug-viewer-table-wrapper::-webkit-scrollbar-thumb {
                background-color: var(--scroll-thumb); border-radius: 10px; border: 2px solid var(--scroll-track);
            }

            #bug-viewer-table {
                width: 100%; border-collapse: separate; border-spacing: 0 10px; table-layout: fixed; font-size: 14px;
            }

            #bug-viewer-table th {
                background-color: var(--bg-primary); font-weight: 700; padding: 12px 15px; color: var(--text-muted); position: sticky; top: -10px; z-index: 10; border-bottom: 1px solid var(--border-color);
            }

            #bug-viewer-table td {
                padding: 16px 15px; border: none; word-wrap: break-word; font-weight: 400; background-color: var(--bg-secondary);
            }

            .status-row-1 td, .status-row-2 td { background-color: var(--status-pending-bg) !important; }
            .status-row-5 td, .status-row-6 td, .status-row-7 td, .status-row-10 td { background-color: var(--status-done-bg) !important; }
            .status-row-15 td, .status-row-17 td { background-color: var(--status-reject-bg) !important; }

            #bug-viewer-table tbody tr {
                transition: transform 0.2s, box-shadow 0.2s; border-radius: 10px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1); overflow: hidden;
            }

            #bug-viewer-table tbody tr:hover {
                transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2), 0 0 0 2px var(--brand-accent);
            }

            #bug-viewer-table tbody tr td:first-child { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
            #bug-viewer-table tbody tr td:last-child { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }

            .level-tag {
                display: inline-block; padding: 5px 12px; border-radius: 6px; font-size: 0.9em; font-weight: 700; line-height: 1.2; letter-spacing: 0.5px; color: white; text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
            }
            .level-tag-1 { background-color: #f44336; border-color: #ffcdd2; }
            .level-tag-5 { background-color: #ff9800; border-color: #ffe0b2; }
            .level-tag-10 { background-color: var(--brand-color); border-color: #b0c4de; }
            .level-tag-15 { background-color: var(--brand-accent); border-color: #e1bee7; }

            .status-row-1 .status-cell, .status-row-2 .status-cell { color: var(--status-text-pending); font-weight: 700; }
            .status-row-5 .status-cell, .status-row-6 .status-cell, .status-row-7 .status-cell, .status-row-10 .status-cell { color: var(--status-text-done); font-weight: 700; }
            .status-row-15 .status-cell, .status-row-17 .status-cell { color: var(--status-text-reject); font-weight: 700; }

            .action-btn {
                padding: 6px 18px; margin-right: 10px; border: 1px solid transparent; border-radius: 9999px; cursor: pointer; font-size: 14px; text-decoration: none; display: inline-block; transition: all 0.2s; font-weight: 600;
            }
            .btn-view { background-color: var(--brand-accent); color: white; border-color: var(--brand-accent); }
            .btn-edit { background-color: transparent; color: var(--link-primary); border-color: var(--link-primary); }

            .btn-view:hover { background-color: #8a2be2; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
            .btn-edit:hover { background-color: var(--link-primary); color: var(--bg-primary); transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        `;
        document.head.appendChild(style);
        document.body.classList.add(currentTheme + '-theme');
    }

    // --- 核心逻辑 ---

    function showViewer() {
        // 1. 加载上次保存的位置和尺寸
        loadState(viewerContainer, VIEWER_POSITION_KEY, VIEWER_SIZE_KEY);

        // 2. 确保窗口可见
        viewerContainer.classList.remove('is-active');
        viewerContainer.style.display = 'block';

        // 3. 强制重绘，确保动画从正确的位置开始
        void viewerContainer.offsetWidth;

        // 4. 应用激活状态
        viewerContainer.classList.add('is-active');
    }


    function fetchBugs() {
        if (isInteracting) return;

        const statusSpan = document.getElementById('viewer-status');
        const tableBody = document.getElementById('viewer-tbody');

        floatButton.classList.add('is-loading');
        statusSpan.textContent = '正在请求数据...';
        tableBody.innerHTML = '';

        showViewer(); // 显示窗口

        const requestBody = JSON.stringify({
            page: String(PAGE),
            page_num: String(PAGE_NUM)
        });

        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            data: requestBody,
            onload: function(response) {
                floatButton.classList.remove('is-loading');
                try {
                    const data = JSON.parse(response.responseText);

                    if (data.code === 200) {
                        renderTable(data.result);
                        statusSpan.textContent = `加载成功! (总数: ${data.result.total_bug_num} | 当前 ${data.result.bug_list.length} 条)`;
                    } else {
                        statusSpan.textContent = `API 错误: ${data.msg} (Code: ${data.code}). 请检查是否登录。`;
                    }
                } catch (e) {
                    statusSpan.textContent = '数据解析失败。';
                    console.error("Tampermonkey Script Error (Parse):", e);
                }
            },
            onerror: function(response) {
                floatButton.classList.remove('is-loading');
                statusSpan.textContent = '网络请求失败。请检查网络或登录状态。';
                console.error("GM_xmlhttpRequest Error:", response);
            }
        });
    }

    function renderTable(result) {
        // ... (保持不变) ...
        const tableBody = document.getElementById('viewer-tbody');
        const bugList = result.bug_list || [];

        tableBody.innerHTML = '';

        const getLevelTagHtml = (levelId) => {
            const levelText = LEVEL_MAP[levelId] || '-';
            return `<span class="level-tag level-tag-${levelId}">${levelText}</span>`;
        };

        bugList.forEach(bug => {
            const row = tableBody.insertRow();

            const statusId = bug.status;
            const statusText = STATUS_MAP[statusId] || `未知 (${statusId})`;

            row.classList.add(`status-row-${statusId}`);

            let rewardText = '';
            if (bug.reward && bug.reward !== '0.00') {
                rewardText = `￥${bug.reward}`;
            } else if (bug.point && bug.point !== '') {
                rewardText = `${bug.point} 积分`;
            } else {
                rewardText = '-';
            }

            const bugId = bug.bug_id;

            // 1. 数据列
            row.insertCell().textContent = bug.bug_no;
            row.insertCell().textContent = bug.bug_name;

            const selfLevelCell = row.insertCell();
            selfLevelCell.innerHTML = getLevelTagHtml(bug.self_bug_level);

            const finalLevelCell = row.insertCell();
            finalLevelCell.innerHTML = getLevelTagHtml(bug.bug_level);

            row.insertCell().textContent = bug.submit_time;

            const statusCell = row.insertCell();
            statusCell.textContent = statusText;
            statusCell.classList.add('status-cell');


            row.insertCell().textContent = rewardText;

            // 2. 操作列 (查看 & 编辑)
            const actionCell = row.insertCell();

            const encodedBugId = encodeURIComponent(bugId);
            const viewLink = document.createElement('a');
            viewLink.href = `https://src.360.net/hacker/bug/detail/${encodedBugId}`;
            viewLink.textContent = '查看';
            viewLink.target = '_blank';
            viewLink.className = 'action-btn btn-view';
            actionCell.appendChild(viewLink);

            const editLink = document.createElement('a');
            const editParam = createEditUrlParam(bugId);
            editLink.href = `https://src.360.net/submit-bug?q=${editParam}`;
            editLink.textContent = '编辑';
            editLink.target = '_blank';
            editLink.className = 'action-btn btn-edit';
            actionCell.appendChild(editLink);
        });
    }


    function setupUI() {
        injectStyles();

        // 1. 创建浮动图标按钮
        floatButton = document.createElement('button');
        floatButton.id = 'floating-bug-button';
        floatButton.innerHTML = '⚙️';
        floatButton.title = '加载我的漏洞列表 (可拖动)';
        floatButton.addEventListener('mousedown', startInteraction);
        floatButton.addEventListener('click', fetchBugs);
        document.body.appendChild(floatButton);
        loadState(floatButton, ICON_POSITION_KEY, null);

        // 2. 创建查看器容器
        viewerContainer = document.createElement('div');
        viewerContainer.id = 'bug-viewer-container';

        // 2.1 头部控制区 (拖动区域)
        const headerHTML = `
            <div id="bug-viewer-header">
                <h2 style="margin: 0;">360SRC 漏洞报告列表</h2>
                <div style="display: flex; align-items: center;">
                    <span id="viewer-status">点击图标加载数据</span>
                    <button id="theme-toggle"></button>
                    <span id="bug-viewer-close">×</span>
                </div>
            </div>
        `;

        // 2.2 表格区
        const tableHTML = `
            <div id="bug-viewer-table-wrapper">
                <table id="bug-viewer-table">
                    <thead>
                        <tr>
                            <th style="width: 8%;">ID</th>
                            <th style="width: 25%;">漏洞名称</th>
                            <th style="width: 8%;">自评</th>
                            <th style="width: 8%;">确认</th>
                            <th style="width: 14%;">提交时间</th>
                            <th style="width: 10%;">状态</th>
                            <th style="width: 10%;">奖励</th>
                            <th style="width: 17%;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="viewer-tbody">
                        <tr><td colspan="8" style="text-align: center; padding: 50px; background: var(--bg-secondary);">点击右上角的 ⚙️ 图标加载您的漏洞列表。</td></tr>
                    </tbody>
                </table>
            </div>
        `;
        viewerContainer.innerHTML = headerHTML + tableHTML;
        document.body.appendChild(viewerContainer);

        loadState(viewerContainer, VIEWER_POSITION_KEY, VIEWER_SIZE_KEY);


        // 3. 绑定事件
        document.getElementById('bug-viewer-close').addEventListener('click', () => {
            viewerContainer.classList.remove('is-active');
            setTimeout(() => {
                 viewerContainer.style.display = 'none';
                 // 关闭后清除 transform，防止下次打开时位置冲突
                 viewerContainer.style.transform = 'none';
            }, 300);
        });
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        updateThemeToggleButton(currentTheme);

        // 4. 绑定悬浮窗拖动/调整大小事件
        viewerContainer.addEventListener('mousedown', startInteraction);
    }

    // 确保只在漏洞列表页运行
    if (window.location.href.includes('src.360.net/hacker/bug/list')) {
        setupUI();
    }
})();
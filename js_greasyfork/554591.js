// ==UserScript==

// @name         B站批量拉黑用户
// @namespace    bilibili.batch.block
// @version      1.0.0
// @description  在B站用户搜索页面批量拉黑用户
// @author       BingBingAFK
// @license MIT
// @match        https://search.bilibili.com/upuser*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.bilibili.com
// @run-at       document-end
// @charset      UTF-8
// @downloadURL https://update.greasyfork.org/scripts/554591/B%E7%AB%99%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/554591/B%E7%AB%99%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置
    const CONFIG = {
        pageSize: 36, // 与B站官方保持一致
        apiUrl: 'https://api.bilibili.com/x/web-interface/wbi/search/type',
        blockApiUrl: 'https://api.bilibili.com/x/relation/modify',
        blackListApiUrl: 'https://api.bilibili.com/x/relation/blacks'
    };

    // 样式
    const styles = `
        #batch-block-container {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }

        #batch-block-btn {
            padding: 10px 20px;
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
            outline: none;
        }

        #batch-block-btn:hover {
            background: #0090c0;
            box-shadow: 0 4px 8px rgba(0,161,214,0.3);
        }

        #batch-block-btn:focus {
            background: #00a1d6;
            outline: none;
        }

        #batch-block-btn:active {
            background: #0090c0;
        }

        #batch-block-panel {
            position: absolute;
            top: 50px;
            right: 0;
            width: 650px;
            max-width: 90vw;
            max-height: 80vh;
            display: none;
            flex-direction: column;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        #batch-block-panel.show {
            display: flex;
        }

        .panel-header {
            padding: 15px 20px;
            background: linear-gradient(135deg, #00a1d6, #00b5e5);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .panel-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
        }

        .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
        }

        .close-btn:hover {
            background: rgba(255,255,255,0.2);
        }

        .panel-controls {
            padding: 15px 20px;
            background: #f6f7f8;
            border-bottom: 1px solid #e7e7e7;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        .panel-controls label {
            font-size: 13px;
            color: #666;
        }

        .panel-controls input[type="number"] {
            width: 80px;
            padding: 6px 10px;
            border: 1px solid #e7e7e7;
            border-radius: 4px;
            font-size: 13px;
        }

        .panel-controls button {
            padding: 6px 15px;
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            outline: none;
        }

        .panel-controls button:hover {
            background: #0090c0;
        }

        .panel-controls button:focus {
            background: #00a1d6;
            outline: none;
        }

        .panel-controls button:active {
            background: #0090c0;
        }

        .panel-controls button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .select-all-controls {
            display: flex;
            gap: 5px;
        }

        .user-list {
            height: 400px;
            overflow-y: scroll !important;
            overflow-x: hidden;
            padding: 10px;
            box-sizing: border-box;
        }

        .user-list::-webkit-scrollbar {
            width: 8px;
        }

        .user-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .user-list::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        .user-list::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .user-item {
            display: flex;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: #f9f9f9;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .user-item:hover {
            background: #f0f0f0;
        }

        .user-item.blocked {
            opacity: 0.6;
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
        }

        .user-item.blocked .user-avatar {
            filter: grayscale(100%);
        }

        .user-item.high-level-user {
            opacity: 0.7;
            background: #fafafa;
            border: 1px solid #e8e8e8;
        }

        .user-item.high-level-user:hover {
            background: #fafafa;
        }

        .user-item input[type="checkbox"] {
            margin-right: 12px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .user-item input[type="checkbox"]:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .blocked-badge {
            display: inline-block;
            padding: 2px 8px;
            background: #ff4d4f;
            color: white;
            font-size: 11px;
            border-radius: 3px;
            margin-left: 8px;
        }

        .level-badge {
            display: inline-block;
            padding: 2px 8px;
            font-size: 11px;
            border-radius: 3px;
            margin-left: 8px;
            font-weight: bold;
        }

        .level-badge.level-0 {
            background: #d9d9d9;
            color: #666;
        }

        .level-badge.level-1 {
            background: #e3f2fd;
            color: #1976d2;
        }

        .level-badge.level-2 {
            background: #e8f5e9;
            color: #388e3c;
        }

        .level-badge.level-3 {
            background: #fff3e0;
            color: #f57c00;
        }

        .level-badge.level-4 {
            background: #fce4ec;
            color: #c2185b;
        }

        .level-badge.level-5 {
            background: #f3e5f5;
            color: #7b1fa2;
        }

        .level-badge.level-6 {
            background: #ffebee;
            color: #d32f2f;
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 12px;
            object-fit: cover;
        }

        .user-info {
            flex: 1;
            min-width: 0;
        }

        .user-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .user-stats {
            font-size: 12px;
            color: #999;
        }

        .user-stats span {
            margin-right: 10px;
        }

        .panel-footer {
            padding: 15px 20px;
            background: #f6f7f8;
            border-top: 1px solid #e7e7e7;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }

        .footer-info {
            font-size: 13px;
            color: #666;
            flex: 1;
            min-width: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }

        .footer-info .divider {
            color: #999;
        }

        .footer-info .text-danger {
            color: #ff4d4f;
        }

        .footer-info .text-success {
            color: #52c41a;
        }

        .footer-actions {
            display: flex;
            gap: 10px;
            flex-shrink: 0;
        }

        .batch-block-btn {
            padding: 8px 20px;
            background: #fb7299;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            outline: none;
            min-width: 90px;
            white-space: nowrap;
        }

        .batch-block-btn:hover {
            background: #e6648a;
        }

        .batch-block-btn:focus {
            background: #fb7299;
            outline: none;
        }

        .batch-block-btn:active {
            background: #e6648a;
        }

        .batch-block-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .batch-unblock-btn {
            padding: 8px 20px;
            background: #52c41a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            outline: none;
            min-width: 90px;
            white-space: nowrap;
        }

        .batch-unblock-btn:hover {
            background: #49aa17;
        }

        .batch-unblock-btn:focus {
            background: #52c41a;
            outline: none;
        }

        .batch-unblock-btn:active {
            background: #49aa17;
        }

        .batch-unblock-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .loading {
            text-align: center;
            padding: 20px;
            color: #999;
            font-size: 14px;
        }

        .error {
            text-align: center;
            padding: 20px;
            color: #ff4d4f;
            font-size: 14px;
        }

        .pagination {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-left: auto;
        }

        .pagination button {
            padding: 6px 12px;
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            outline: none;
        }

        .pagination button:hover:not(:disabled) {
            background: #0090c0;
        }

        .pagination button:focus:not(:disabled) {
            background: #00a1d6;
            outline: none;
        }

        .pagination button:active:not(:disabled) {
            background: #0090c0;
        }

        .pagination button:disabled {
            background: #e7e7e7;
            color: #999;
            cursor: not-allowed;
        }

        .pagination span {
            font-size: 13px;
            color: #666;
            white-space: nowrap;
        }

        .pagination strong {
            color: #00a1d6;
        }
    `;

    // 注入样式
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 全局变量
    let currentPage = 1;
    let totalPages = 1;
    let currentKeyword = '';
    let allUsers = [];
    let selectedUserIds = new Set();
    let blockedUserIds = new Set(); // 存储已拉黑的用户ID
    let isBlocking = false;

    // 创建UI
    function createUI() {
        const container = document.createElement('div');
        container.id = 'batch-block-container';
        container.innerHTML = `
            <button id="batch-block-btn">批量拉黑</button>
            <div id="batch-block-panel">
                <div class="panel-header">
                    <h3>批量拉黑用户</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="panel-controls">
                    <button id="fetch-btn">获取数据</button>
                    <div class="select-all-controls">
                        <button id="select-all-btn">全选</button>
                        <button id="deselect-all-btn">取消全选</button>
                    </div>
                    <div class="pagination">
                        <button id="prev-page-btn" disabled>上一页</button>
                        <span id="page-info">第 <strong>1</strong> 页 / 共 <strong>1</strong> 页</span>
                        <button id="next-page-btn" disabled>下一页</button>
                    </div>
                </div>
                <div class="user-list" id="user-list">
                    <div class="loading">请点击"获取数据"按钮加载用户列表</div>
                </div>
                <div class="panel-footer">
                    <div class="footer-info">
                        <span>已选择 <strong id="selected-count">0</strong> 个用户</span>
                        <span class="divider">|</span>
                        <span>已拉黑 <strong class="text-danger" id="blocked-count">0</strong> 个</span>
                        <span class="divider">|</span>
                        <span>保护 <strong class="text-success" id="protected-count">0</strong> 个</span>
                    </div>
                    <div class="footer-actions">
                        <button class="batch-unblock-btn" id="execute-unblock-btn">移除拉黑</button>
                        <button class="batch-block-btn" id="execute-block-btn">执行拉黑</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // 绑定事件
        bindEvents();
    }

    // 绑定事件
    function bindEvents() {
        const btn = document.getElementById('batch-block-btn');
        const panel = document.getElementById('batch-block-panel');
        const closeBtn = panel.querySelector('.close-btn');
        const fetchBtn = document.getElementById('fetch-btn');
        const selectAllBtn = document.getElementById('select-all-btn');
        const deselectAllBtn = document.getElementById('deselect-all-btn');
        const executeBtn = document.getElementById('execute-block-btn');
        const executeUnblockBtn = document.getElementById('execute-unblock-btn');
        const prevPageBtn = document.getElementById('prev-page-btn');
        const nextPageBtn = document.getElementById('next-page-btn');

        btn.addEventListener('click', () => {
            panel.classList.toggle('show');
            if (panel.classList.contains('show') && allUsers.length === 0) {
                // 自动获取当前搜索关键词
                const urlParams = new URLSearchParams(window.location.search);
                currentKeyword = urlParams.get('keyword') || '';
            }
        });

        closeBtn.addEventListener('click', () => {
            panel.classList.remove('show');
        });

        fetchBtn.addEventListener('click', () => {
            currentPage = 1;
            fetchUsers();
        });
        selectAllBtn.addEventListener('click', selectAll);
        deselectAllBtn.addEventListener('click', deselectAll);
        executeBtn.addEventListener('click', executeBlock);
        executeUnblockBtn.addEventListener('click', executeUnblock);

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchUsers();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchUsers();
            }
        });
    }

    // 获取用户列表
    async function fetchUsers() {
        const userList = document.getElementById('user-list');

        // 获取当前搜索关键词
        const urlParams = new URLSearchParams(window.location.search);
        currentKeyword = urlParams.get('keyword') || '';

        if (!currentKeyword) {
            userList.innerHTML = '<div class="error">请先在B站搜索用户</div>';
            return;
        }

        userList.innerHTML = '<div class="loading">加载中...</div>';

        try {
            // 获取当前页面的搜索参数
            const searchParams = new URLSearchParams(window.location.search);
            const apiParams = {
                search_type: 'bili_user',
                keyword: currentKeyword,
                page: currentPage,
                page_size: CONFIG.pageSize,
                platform: 'pc',
                highlight: 1,
                single_column: 0
            };

            // 复制其他可能需要的参数
            ['category_id', 'order', 'order_sort', 'user_type', 'duration', 'w_rid', 'wts'].forEach(key => {
                if (searchParams.has(key)) {
                    apiParams[key] = searchParams.get(key);
                }
            });

            const url = CONFIG.apiUrl + '?' + new URLSearchParams(apiParams).toString();

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Referer': 'https://search.bilibili.com/',
                    'User-Agent': navigator.userAgent
                },
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.data) {
                            allUsers = data.data.result || [];
                            totalPages = Math.ceil((data.data.numResults || 0) / CONFIG.pageSize);
                            // 先获取黑名单，再渲染列表
                            checkBlockedUsers().then(() => {
                                renderUserList();
                                updatePaginationUI();
                            });
                        } else {
                            userList.innerHTML = `<div class="error">获取失败: ${data.message || '未知错误'}</div>`;
                        }
                    } catch (e) {
                        userList.innerHTML = `<div class="error">解析数据失败: ${e.message}</div>`;
                    }
                },
                onerror: function (error) {
                    userList.innerHTML = '<div class="error">网络请求失败</div>';
                }
            });
        } catch (error) {
            userList.innerHTML = `<div class="error">发生错误: ${error.message}</div>`;
        }
    }

    // 检查已拉黑的用户
    function checkBlockedUsers() {
        return new Promise((resolve) => {
            // 清空之前的黑名单数据
            blockedUserIds.clear();

            // 获取CSRF token
            const csrf = getCookie('bili_jct');
            if (!csrf) {
                console.warn('未找到 CSRF token，跳过黑名单检查');
                resolve();
                return;
            }

            // 分页获取所有黑名单用户
            let allBlockedUsers = [];
            let page = 1;
            const pageSize = 50;

            function fetchPage() {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${CONFIG.blackListApiUrl}?pn=${page}&ps=${pageSize}&jsonp=jsonp`,
                    headers: {
                        'Referer': 'https://space.bilibili.com/',
                        'User-Agent': navigator.userAgent
                    },
                    onload: function (response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 0 && data.data && data.data.list) {
                                const list = data.data.list;
                                allBlockedUsers = allBlockedUsers.concat(list);

                                // 如果还有更多页，继续获取
                                if (list.length === pageSize && data.data.total > allBlockedUsers.length) {
                                    page++;
                                    fetchPage();
                                } else {
                                    // 所有页获取完成，存储黑名单用户ID
                                    allBlockedUsers.forEach(user => {
                                        blockedUserIds.add(user.mid);
                                    });
                                    console.log(`已加载 ${blockedUserIds.size} 个黑名单用户`);
                                    resolve();
                                }
                            } else {
                                console.warn('获取黑名单失败:', data.message);
                                resolve();
                            }
                        } catch (e) {
                            console.error('解析黑名单数据失败:', e);
                            resolve();
                        }
                    },
                    onerror: function (error) {
                        console.error('获取黑名单网络请求失败:', error);
                        resolve();
                    }
                });
            }

            fetchPage();
        });
    }

    // 渲染用户列表
    function renderUserList() {
        const userList = document.getElementById('user-list');

        if (allUsers.length === 0) {
            userList.innerHTML = '<div class="error">没有找到用户</div>';
            return;
        }

        userList.innerHTML = allUsers.map((user, index) => {
            const isBlocked = blockedUserIds.has(user.mid);
            const level = user.level || 0;
            const isHighLevel = level >= 1; // 等级≥1的用户
            const checked = selectedUserIds.has(user.mid) ? 'checked' : '';
            const blockedClass = isBlocked ? 'blocked' : '';
            const highLevelClass = isHighLevel ? 'high-level-user' : '';
            const disabledAttr = isHighLevel ? 'disabled' : ''; // 等级≥1禁用复选框
            const blockedBadge = isBlocked ? '<span class="blocked-badge">已拉黑</span>' : '';
            const levelBadge = `<span class="level-badge level-${level}">Lv${level}</span>`;

            return `
                <div class="user-item ${blockedClass} ${highLevelClass}" data-mid="${user.mid}" data-blocked="${isBlocked}" data-level="${level}">
                    <input type="checkbox" ${checked} ${disabledAttr} data-mid="${user.mid}">
                    <img class="user-avatar" src="${user.upic}" alt="${user.uname}">
                    <div class="user-info">
                        <div class="user-name">${user.uname}${blockedBadge}${levelBadge}</div>
                        <div class="user-stats">
                            <span>👤 粉丝: ${formatNumber(user.fans || 0)}</span>
                            <span>📹 视频: ${user.videos || 0}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 绑定复选框事件
        userList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const mid = parseInt(e.target.dataset.mid);
                if (e.target.checked) {
                    selectedUserIds.add(mid);
                } else {
                    selectedUserIds.delete(mid);
                }
                updateSelectedCount();
            });
        });

        updateSelectedCount();
        updateBlockedCount();
        updateProtectedCount();
    }

    // 更新已拉黑数量
    function updateBlockedCount() {
        const blockedCount = allUsers.filter(user => blockedUserIds.has(user.mid)).length;
        const blockedCountEl = document.getElementById('blocked-count');
        if (blockedCountEl) {
            blockedCountEl.textContent = blockedCount;
        }
    }

    // 更新受保护用户数量（等级>=1）
    function updateProtectedCount() {
        const protectedCount = allUsers.filter(user => (user.level || 0) >= 1).length;
        const protectedCountEl = document.getElementById('protected-count');
        if (protectedCountEl) {
            protectedCountEl.textContent = protectedCount;
        }
    }

    // 格式化数字
    function formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num.toString();
    }

    // 全选
    function selectAll() {
        allUsers.forEach(user => {
            // 只选择等级<1的用户
            const level = user.level || 0;
            if (level < 1) {
                selectedUserIds.add(user.mid);
            }
        });
        document.querySelectorAll('#user-list input[type="checkbox"]:not(:disabled)').forEach(cb => {
            cb.checked = true;
        });
        updateSelectedCount();
    }

    // 取消全选
    function deselectAll() {
        selectedUserIds.clear();
        document.querySelectorAll('#user-list input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        updateSelectedCount();
    }

    // 更新选中数量
    function updateSelectedCount() {
        document.getElementById('selected-count').textContent = selectedUserIds.size;

        // 统计选中的用户中有多少已拉黑，多少未拉黑
        let blockedCount = 0;
        let unblockedCount = 0;
        selectedUserIds.forEach(mid => {
            if (blockedUserIds.has(mid)) {
                blockedCount++;
            } else {
                unblockedCount++;
            }
        });

        // 根据选中的用户类型控制按钮状态
        document.getElementById('execute-block-btn').disabled = unblockedCount === 0 || isBlocking;
        document.getElementById('execute-unblock-btn').disabled = blockedCount === 0 || isBlocking;
    }

    // 更新分页UI
    function updatePaginationUI() {
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page-btn');
        const nextBtn = document.getElementById('next-page-btn');

        // 更新页码信息
        pageInfo.innerHTML = `第 <strong>${currentPage}</strong> 页 / 共 <strong>${totalPages}</strong> 页`;

        // 更新按钮状态
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    // 执行拉黑
    async function executeBlock() {
        if (selectedUserIds.size === 0) {
            alert('请先选择要拉黑的用户');
            return;
        }

        const confirmed = confirm(`确定要拉黑选中的 ${selectedUserIds.size} 个用户吗？\n\n注意：等级≥1的用户将被自动跳过`);
        if (!confirmed) return;

        isBlocking = true;
        updateSelectedCount();

        const executeBtn = document.getElementById('execute-block-btn');
        const originalText = executeBtn.textContent;

        let success = 0;
        let failed = 0;
        let skipped = 0;
        const total = selectedUserIds.size;

        for (const mid of selectedUserIds) {
            // 检查用户等级
            const userItem = document.querySelector(`.user-item[data-mid="${mid}"]`);
            const userLevel = userItem ? parseInt(userItem.getAttribute('data-level')) || 0 : 0;

            // 跳过等级 >= 1 的用户
            if (userLevel >= 1) {
                skipped++;
                console.log(`跳过等级${userLevel}的用户 (mid: ${mid})`);
                continue;
            }

            executeBtn.textContent = `处理中 ${success + failed + skipped}/${total}`;

            try {
                const result = await blockUser(mid);
                if (result) {
                    success++;
                    // 添加到已拉黑列表
                    blockedUserIds.add(mid);
                    // 标记已拉黑
                    if (userItem) {
                        userItem.classList.add('blocked');
                        // 添加已拉黑徽章
                        const userName = userItem.querySelector('.user-name');
                        if (userName && !userName.querySelector('.blocked-badge')) {
                            // 在等级徽章之前插入已拉黑徽章
                            const levelBadge = userName.querySelector('.level-badge');
                            if (levelBadge) {
                                levelBadge.insertAdjacentHTML('beforebegin', '<span class="blocked-badge">已拉黑</span>');
                            } else {
                                userName.innerHTML += '<span class="blocked-badge">已拉黑</span>';
                            }
                        }
                        // 头像灰度效果
                        const avatar = userItem.querySelector('.user-avatar');
                        if (avatar) {
                            avatar.style.filter = 'grayscale(100%)';
                        }
                    }
                } else {
                    failed++;
                }
            } catch (error) {
                failed++;
                console.error(`拉黑用户 ${mid} 失败:`, error);
            }

            // 添加延迟避免请求过快
            await sleep(500);
        }

        isBlocking = false;
        executeBtn.textContent = originalText;
        selectedUserIds.clear();
        updateSelectedCount();
        updateBlockedCount();

        let resultMsg = `拉黑完成！\n成功: ${success}\n失败: ${failed}`;
        if (skipped > 0) {
            resultMsg += `\n跳过: ${skipped} (等级≥1)`;
        }
        alert(resultMsg);
    }

    // 执行移除拉黑
    async function executeUnblock() {
        if (selectedUserIds.size === 0) {
            alert('请先选择要移除拉黑的用户');
            return;
        }

        // 只处理已拉黑的用户
        const blockedUsers = Array.from(selectedUserIds).filter(mid => blockedUserIds.has(mid));

        if (blockedUsers.length === 0) {
            alert('选中的用户中没有已拉黑的用户');
            return;
        }

        const confirmed = confirm(`确定要移除拉黑选中的 ${blockedUsers.length} 个用户吗？`);
        if (!confirmed) return;

        isBlocking = true;
        updateSelectedCount();

        const executeBtn = document.getElementById('execute-unblock-btn');
        const originalText = executeBtn.textContent;

        let success = 0;
        let failed = 0;
        const total = blockedUsers.length;

        for (const mid of blockedUsers) {
            executeBtn.textContent = `处理中 ${success + failed}/${total}`;

            try {
                const result = await unblockUser(mid);
                if (result) {
                    success++;
                    // 从已拉黑列表移除
                    blockedUserIds.delete(mid);
                    // 移除已拉黑标记
                    const userItem = document.querySelector(`.user-item[data-mid="${mid}"]`);
                    if (userItem) {
                        userItem.classList.remove('blocked');
                        userItem.setAttribute('data-blocked', 'false');
                        // 移除已拉黑徽章
                        const badge = userItem.querySelector('.blocked-badge');
                        if (badge) badge.remove();
                        // 恢复头像颜色
                        const avatar = userItem.querySelector('.user-avatar');
                        if (avatar) {
                            avatar.style.filter = 'none';
                        }
                    }
                } else {
                    failed++;
                }
            } catch (error) {
                failed++;
                console.error(`移除拉黑用户 ${mid} 失败:`, error);
            }

            // 添加延迟避免请求过快
            await sleep(500);
        }

        isBlocking = false;
        executeBtn.textContent = originalText;
        selectedUserIds.clear();
        updateSelectedCount();
        updateBlockedCount();

        alert(`移除拉黑完成！\n成功: ${success}\n失败: ${failed}`);
    }

    // 拉黑单个用户
    function blockUser(mid) {
        return new Promise((resolve, reject) => {
            // 获取 CSRF token
            const csrf = getCookie('bili_jct');

            if (!csrf) {
                console.error('未找到 CSRF token，请确保已登录B站');
                resolve(false);
                return;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.blockApiUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://space.bilibili.com/',
                    'User-Agent': navigator.userAgent
                },
                data: `fid=${mid}&act=5&re_src=11&csrf=${csrf}`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) {
                            resolve(true);
                        } else {
                            console.error(`拉黑失败: ${data.message}`);
                            resolve(false);
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        resolve(false);
                    }
                },
                onerror: function (error) {
                    console.error('请求失败:', error);
                    resolve(false);
                }
            });
        });
    }

    // 移除拉黑单个用户
    function unblockUser(mid) {
        return new Promise((resolve, reject) => {
            // 获取 CSRF token
            const csrf = getCookie('bili_jct');

            if (!csrf) {
                console.error('未找到 CSRF token，请确保已登录B站');
                resolve(false);
                return;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.blockApiUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://space.bilibili.com/',
                    'User-Agent': navigator.userAgent
                },
                data: `fid=${mid}&act=6&re_src=11&csrf=${csrf}`, // act=6 表示移除拉黑
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) {
                            resolve(true);
                        } else {
                            console.error(`移除拉黑失败: ${data.message}`);
                            resolve(false);
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e);
                        resolve(false);
                    }
                },
                onerror: function (error) {
                    console.error('请求失败:', error);
                    resolve(false);
                }
            });
        });
    }

    // 获取 Cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // 延迟函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 检查是否在用户搜索页面
    function isUserSearchPage() {
        return window.location.hostname === 'search.bilibili.com' &&
            window.location.pathname === '/upuser';
    }

    // 初始化
    function init() {
        if (isUserSearchPage()) {
            // 等待页面加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', createUI);
            } else {
                createUI();
            }
        }
    }

    // 启动
    init();

    // 监听URL变化（用于SPA页面）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const container = document.getElementById('batch-block-container');
            if (isUserSearchPage() && !container) {
                createUI();
            } else if (!isUserSearchPage() && container) {
                container.remove();
            }
        }
    }).observe(document, { subtree: true, childList: true });

})();


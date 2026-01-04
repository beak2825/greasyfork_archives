// ==UserScript==
// @name         青梨派助手：一键完成浏览任务
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在青梨派（理工易班）页面添加按钮，一键完成所有未读的文章浏览任务以获取积分。
// @author       毫厘
// @match        https://qlp.whut.edu.cn/mp-pc/home*
// @connect      qlpoa.whut.edu.cn
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554685/%E9%9D%92%E6%A2%A8%E6%B4%BE%E5%8A%A9%E6%89%8B%EF%BC%9A%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E6%B5%8F%E8%A7%88%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/554685/%E9%9D%92%E6%A2%A8%E6%B4%BE%E5%8A%A9%E6%89%8B%EF%BC%9A%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E6%B5%8F%E8%A7%88%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 全局状态管理 ====================
    let taskState = {
        isRunning: false,
        isPaused: false,
        shouldStop: false,
        currentIndex: 0,
        totalTasks: 0,
        completedCount: 0,
        failedCount: 0
    };

    // ==================== 工具函数 ====================
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 检查是否应该暂停
    async function checkPauseState() {
        while (taskState.isPaused && !taskState.shouldStop) {
            await sleep(100);
        }
    }

    // 显示通知
    function showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `lgeb-notification lgeb-notification-${type}`;
        notification.innerHTML = `
            <div class="lgeb-notification-content">
                <span class="lgeb-notification-icon">${getIcon(type)}</span>
                <span class="lgeb-notification-message">${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('lgeb-notification-show'), 10);

        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('lgeb-notification-show');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }

        return notification;
    }

    function getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    // 更新进度面板
    function updateProgressPanel(current, total, status) {
        const panel = document.getElementById('lgeb-progress-panel');
        if (!panel) return;

        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        panel.querySelector('.lgeb-progress-bar-fill').style.width = `${percentage}%`;
        panel.querySelector('.lgeb-progress-text').textContent = `${current} / ${total}`;
        panel.querySelector('.lgeb-progress-percentage').textContent = `${percentage}%`;
        panel.querySelector('.lgeb-progress-status').textContent = status;
    }


    // 显示进度面板
    function showProgressPanel(total) {
        let panel = document.getElementById('lgeb-progress-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'lgeb-progress-panel';
            panel.innerHTML = `
                <div class="lgeb-progress-header">
                    <h3>任务处理中</h3>
                    <button class="lgeb-progress-close" onclick="this.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="lgeb-progress-body">
                    <div class="lgeb-progress-info">
                        <span class="lgeb-progress-text">0 / ${total}</span>
                        <span class="lgeb-progress-percentage">0%</span>
                    </div>
                    <div class="lgeb-progress-bar">
                        <div class="lgeb-progress-bar-fill"></div>
                    </div>
                    <div class="lgeb-progress-status">准备开始...</div>
                    <div class="lgeb-progress-controls">
                        <button class="lgeb-control-btn lgeb-pause-btn" id="lgeb-pause-btn">⏸ 暂停</button>
                        <button class="lgeb-control-btn lgeb-stop-btn" id="lgeb-stop-btn">⏹ 停止</button>
                    </div>
                </div>
            `;
            document.body.appendChild(panel);

            // 绑定控制按钮事件
            document.getElementById('lgeb-pause-btn').addEventListener('click', togglePause);
            document.getElementById('lgeb-stop-btn').addEventListener('click', stopTasks);
        }
        setTimeout(() => panel.classList.add('lgeb-progress-panel-show'), 10);
        return panel;
    }

    // 切换暂停状态
    function togglePause() {
        const btn = document.getElementById('lgeb-pause-btn');
        if (!btn) return;

        taskState.isPaused = !taskState.isPaused;

        if (taskState.isPaused) {
            btn.innerHTML = '▶ 继续';
            btn.classList.add('lgeb-paused');
            updateProgressPanel(taskState.currentIndex, taskState.totalTasks, '已暂停');
            showNotification('任务已暂停', 'warning', 2000);
        } else {
            btn.innerHTML = '⏸ 暂停';
            btn.classList.remove('lgeb-paused');
            showNotification('继续处理任务...', 'info', 2000);
        }
    }

    // 停止任务
    function stopTasks() {
        taskState.shouldStop = true;
        taskState.isPaused = false;
        showNotification('正在停止任务...', 'warning', 2000);
        updateProgressPanel(taskState.currentIndex, taskState.totalTasks, '正在停止...');
    }

    // 隐藏进度面板
    function hideProgressPanel() {
        const panel = document.getElementById('lgeb-progress-panel');
        if (panel) {
            panel.classList.remove('lgeb-progress-panel-show');
            setTimeout(() => panel.remove(), 300);
        }
    }

    // 显示结果面板
    function showResultPanel(success, failed, total) {
        const panel = document.createElement('div');
        panel.className = 'lgeb-result-panel';
        panel.innerHTML = `
            <div class="lgeb-result-header">
                <h3>任务完成</h3>
                <button class="lgeb-result-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
            <div class="lgeb-result-body">
                <div class="lgeb-result-stats">
                    <div class="lgeb-stat-item lgeb-stat-total">
                        <div class="lgeb-stat-number">${total}</div>
                        <div class="lgeb-stat-label">总任务数</div>
                    </div>
                    <div class="lgeb-stat-item lgeb-stat-success">
                        <div class="lgeb-stat-number">${success}</div>
                        <div class="lgeb-stat-label">成功</div>
                    </div>
                    <div class="lgeb-stat-item lgeb-stat-failed">
                        <div class="lgeb-stat-number">${failed}</div>
                        <div class="lgeb-stat-label">失败</div>
                    </div>
                </div>
                ${failed > 0 ? '<div class="lgeb-result-note">失败的任务可能是特殊类型或已过期</div>' : ''}
                <button class="lgeb-result-refresh" onclick="location.reload()">刷新页面查看</button>
            </div>
        `;
        document.body.appendChild(panel);
        setTimeout(() => panel.classList.add('lgeb-result-panel-show'), 10);
    }

    // ==================== 主要逻辑 ====================
    async function completeTasks() {
        const btn = document.getElementById('lgeb-main-btn');

        // 防止重复点击
        if (taskState.isRunning) {
            showNotification('任务正在运行中', 'warning', 2000);
            return;
        }

        // 重置状态
        taskState = {
            isRunning: true,
            isPaused: false,
            shouldStop: false,
            currentIndex: 0,
            totalTasks: 0,
            completedCount: 0,
            failedCount: 0
        };

        btn.disabled = true;
        btn.classList.add('lgeb-btn-loading');

        const token = localStorage.getItem('token');
        if (!token) {
            showNotification('获取登录凭证失败！请确认已登录并刷新页面', 'error', 4000);
            resetTaskState(btn);
            return;
        }

        console.log("【青梨派助手】成功获取登录凭证, 开始获取文章列表...");
        showNotification('正在获取任务列表...', 'info', 2000);

        // 使用Promise包装GM_xmlhttpRequest
        const fetchArticles = () => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://qlpoa.whut.edu.cn/mp-api/auth/user/getArticleList?pageNum=1&pageSize=500&taskType=1,2,3",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Authorization": token,
                    "Origin": "https://qlp.whut.edu.cn",
                    "Referer": "https://qlp.whut.edu.cn/"
                },
                timeout: 15000, // 增加超时时间
                onload: (response) => resolve(response),
                onerror: (error) => reject(error),
                ontimeout: () => reject(new Error('请求超时'))
            });
        });

        try {
            const response = await fetchArticles();

            if (response.status !== 200) {
                throw new Error(`服务器响应异常, 状态码: ${response.status}`);
            }

            const data = JSON.parse(response.responseText);
            if (data.code !== 200 || !data.rows) {
                throw new Error(data.msg || "返回的数据格式不正确");
            }

            const articles = data.rows;
            const unreadArticles = articles.filter(article => article.isView === false);

            if (unreadArticles.length === 0) {
                showNotification('太棒了，所有任务都已完成！', 'success', 3000);
                resetTaskState(btn);
                btn.textContent = '✓ 任务已完成';
                setTimeout(() => {
                    btn.textContent = '一键完成任务';
                }, 3000);
                return;
            }

            console.log(`【青梨派助手】发现 ${unreadArticles.length} 个未完成的任务，开始处理...`);
            showNotification(`发现 ${unreadArticles.length} 个未完成任务，开始处理`, 'info', 2000);

            taskState.totalTasks = unreadArticles.length;
            showProgressPanel(unreadArticles.length);

            // 批量处理任务（优化效率）
            await processTasks(unreadArticles, token);

        } catch (e) {
            showNotification(`获取列表失败: ${e.message}`, 'error', 4000);
            console.error("【青梨派助手】解析文章列表失败:", e);
            resetTaskState(btn);
        }
    }

    // 批量处理任务（优化后的逻辑）
    async function processTasks(articles, token) {
        const btn = document.getElementById('lgeb-main-btn');

        for (let i = 0; i < articles.length; i++) {
            // 检查是否需要停止
            if (taskState.shouldStop) {
                showNotification('任务已停止', 'warning', 3000);
                break;
            }

            // 检查暂停状态
            await checkPauseState();

            if (taskState.shouldStop) break;

            taskState.currentIndex = i + 1;
            const article = articles[i];
            const articleId = article.id;

            updateProgressPanel(i, articles.length, `正在处理第 ${i + 1} 个任务...`);

            // 执行单个任务
            await processArticle(articleId, token);

            // 动态延迟（优化效率：减少等待时间）
            await sleep(200 + Math.random() * 200);
        }

        // 任务完成或停止
        updateProgressPanel(taskState.currentIndex, articles.length,
            taskState.shouldStop ? '已停止' : '处理完成！');

        setTimeout(() => {
            hideProgressPanel();
            showResultPanel(taskState.completedCount, taskState.failedCount, taskState.currentIndex);
            resetTaskState(btn);
        }, 1000);
    }

    // 处理单篇文章（Promise化）
    function processArticle(articleId, token) {
        return new Promise((resolve) => {
            const viewUrl = `https://qlpoa.whut.edu.cn/mp-api/auth/user/viewArticle?articleId=${articleId}&viewType=2`;

            GM_xmlhttpRequest({
                method: "GET",
                url: viewUrl,
                headers: { "Authorization": token },
                timeout: 10000,
                onload: function (viewResponse) {
                    try {
                        const result = JSON.parse(viewResponse.responseText);
                        if (result.code === 200) {
                            console.log(`%c✓ [ID: ${articleId}] 完成`, "color: green; font-weight: bold;");
                            taskState.completedCount++;
                        } else {
                            taskState.failedCount++;
                            let errorMsg = result.msg?.includes("Exception") ? "服务器内部错误" : result.msg;
                            console.warn(`%c✗ [ID: ${articleId}] ${errorMsg}`, "color: orange;");
                        }
                    } catch (e) {
                        taskState.failedCount++;
                        console.error(`%c✗ [ID: ${articleId}] 解析失败`, "color: red;");
                    }
                    resolve();
                },
                onerror: function () {
                    taskState.failedCount++;
                    console.error(`%c✗ [ID: ${articleId}] 网络错误`, "color: red;");
                    resolve();
                },
                ontimeout: function () {
                    taskState.failedCount++;
                    console.error(`%c✗ [ID: ${articleId}] 请求超时`, "color: red;");
                    resolve();
                }
            });
        });
    }

    // 重置任务状态
    function resetTaskState(btn) {
        taskState.isRunning = false;
        taskState.isPaused = false;
        taskState.shouldStop = false;
        btn.disabled = false;
        btn.classList.remove('lgeb-btn-loading');
    }

    // ==================== UI创建 ====================
    function addButton() {
        const btn = document.createElement("button");
        btn.textContent = "一键完成任务";
        btn.id = "lgeb-main-btn";
        btn.onclick = completeTasks;
        document.body.appendChild(btn);
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 主按钮样式 */
            #lgeb-main-btn {
                position: fixed;
                top: 150px;
                right: 20px;
                z-index: 99999;
                padding: 14px 28px;
                font-size: 15px;
                font-weight: 600;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            #lgeb-main-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
            }

            #lgeb-main-btn:active:not(:disabled) {
                transform: translateY(0);
            }

            #lgeb-main-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            #lgeb-main-btn.lgeb-btn-loading::after {
                content: '';
                position: absolute;
                top: 50%;
                right: 12px;
                width: 16px;
                height: 16px;
                margin-top: -8px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: lgeb-spin 0.6s linear infinite;
            }

            @keyframes lgeb-spin {
                to { transform: rotate(360deg); }
            }

            /* 通知样式 */
            .lgeb-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 100000;
                min-width: 300px;
                max-width: 400px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: translateX(400px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .lgeb-notification-show {
                opacity: 1;
                transform: translateX(0);
            }

            .lgeb-notification-content {
                display: flex;
                align-items: center;
                padding: 16px 20px;
                gap: 12px;
            }

            .lgeb-notification-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-weight: bold;
                font-size: 14px;
            }

            .lgeb-notification-success .lgeb-notification-icon {
                background: #10b981;
                color: white;
            }

            .lgeb-notification-error .lgeb-notification-icon {
                background: #ef4444;
                color: white;
            }

            .lgeb-notification-warning .lgeb-notification-icon {
                background: #f59e0b;
                color: white;
            }

            .lgeb-notification-info .lgeb-notification-icon {
                background: #3b82f6;
                color: white;
            }

            .lgeb-notification-message {
                flex: 1;
                color: #1f2937;
                font-size: 14px;
                line-height: 1.5;
            }

            /* 进度面板样式 */
            #lgeb-progress-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                z-index: 100001;
                width: 400px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #lgeb-progress-panel.lgeb-progress-panel-show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }

            .lgeb-progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid #e5e7eb;
            }

            .lgeb-progress-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }

            .lgeb-progress-close {
                width: 28px;
                height: 28px;
                border: none;
                background: #f3f4f6;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                color: #6b7280;
                transition: all 0.2s;
            }

            .lgeb-progress-close:hover {
                background: #e5e7eb;
                color: #1f2937;
            }

            .lgeb-progress-body {
                padding: 24px;
            }

            .lgeb-progress-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 14px;
                color: #6b7280;
            }

            .lgeb-progress-percentage {
                font-weight: 600;
                color: #667eea;
            }

            .lgeb-progress-bar {
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 16px;
            }

            .lgeb-progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 0%;
            }

            .lgeb-progress-status {
                text-align: center;
                font-size: 14px;
                color: #6b7280;
            }

            /* 控制按钮样式 */
            .lgeb-progress-controls {
                display: flex;
                gap: 12px;
                margin-top: 16px;
            }

            .lgeb-control-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .lgeb-pause-btn {
                background: #f59e0b;
                color: white;
            }

            .lgeb-pause-btn:hover {
                background: #d97706;
            }

            .lgeb-pause-btn.lgeb-paused {
                background: #10b981;
            }

            .lgeb-pause-btn.lgeb-paused:hover {
                background: #059669;
            }

            .lgeb-stop-btn {
                background: #ef4444;
                color: white;
            }

            .lgeb-stop-btn:hover {
                background: #dc2626;
            }

            /* 结果面板样式 */
            .lgeb-result-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                z-index: 100002;
                width: 450px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .lgeb-result-panel-show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }

            .lgeb-result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid #e5e7eb;
            }

            .lgeb-result-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }

            .lgeb-result-close {
                width: 28px;
                height: 28px;
                border: none;
                background: #f3f4f6;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                color: #6b7280;
                transition: all 0.2s;
            }

            .lgeb-result-close:hover {
                background: #e5e7eb;
                color: #1f2937;
            }

            .lgeb-result-body {
                padding: 24px;
            }

            .lgeb-result-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-bottom: 20px;
            }

            .lgeb-stat-item {
                text-align: center;
                padding: 20px;
                border-radius: 12px;
                background: #f9fafb;
            }

            .lgeb-stat-total {
                background: linear-gradient(135deg, #667eea15, #764ba215);
            }

            .lgeb-stat-success {
                background: linear-gradient(135deg, #10b98115, #10b98115);
            }

            .lgeb-stat-failed {
                background: linear-gradient(135deg, #ef444415, #ef444415);
            }

            .lgeb-stat-number {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 8px;
            }

            .lgeb-stat-total .lgeb-stat-number {
                color: #667eea;
            }

            .lgeb-stat-success .lgeb-stat-number {
                color: #10b981;
            }

            .lgeb-stat-failed .lgeb-stat-number {
                color: #ef4444;
            }

            .lgeb-stat-label {
                font-size: 14px;
                color: #6b7280;
            }

            .lgeb-result-note {
                text-align: center;
                font-size: 13px;
                color: #9ca3af;
                margin-bottom: 20px;
                padding: 12px;
                background: #fef3c7;
                border-radius: 8px;
                color: #92400e;
            }

            .lgeb-result-refresh {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }

            .lgeb-result-refresh:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    // ==================== 初始化 ====================
    function init() {
        addStyles();
        addButton();
        console.log('%c【青梨派助手】已加载 v1.0', 'color: #667eea; font-size: 14px; font-weight: bold;');
        console.log('%c功能: 一键完成任务 | 支持暂停/恢复/停止 | 优化效率', 'color: #6b7280; font-size: 12px;');
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
// ==UserScript==
// @name         [Nodeloc] NoHopeL - Nodeloc 刷阅读数据工具
// @namespace    nohope-nl-fixed
// @version      2026.01.11
// @description  优化修复版：修复频率限制问题，增加智能延迟和错误处理
// @author       Xiaoqiang
// @match        https://www.nodeloc.com/*
// @match        https://nodeloc.cc/*
// @match        https://nodeloc.org/*
// @match        https://*.nodeloc.com/*
// @match        https://*.nodeloc.cc/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562341/%5BNodeloc%5D%20NoHopeL%20-%20Nodeloc%20%E5%88%B7%E9%98%85%E8%AF%BB%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/562341/%5BNodeloc%5D%20NoHopeL%20-%20Nodeloc%20%E5%88%B7%E9%98%85%E8%AF%BB%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        minDelay: 1500,      // 最小延迟（毫秒）
        maxDelay: 3000,      // 最大延迟
        maxRetries: 3,       // 最大重试次数
        batchSize: 4,        // 每批处理的帖子数量
        debugMode: true      // 调试模式
    };

    // 状态管理
    const state = {
        running: true,
        csrfToken: null,
        tokenTime: 0,
        totalSuccess: 0,
        totalErrors: 0,
        lastRequestTime: 0,
        panelCreated: false
    };

    // 工具函数
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function log(...args) {
        if (CONFIG.debugMode) {
            console.log('[Nodeloc工具]', ...args);
        }
    }

    function showNotification(title, message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);

        // 如果页面右下角有通知区域，也显示在那里
        const notificationDiv = document.createElement('div');
        notificationDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease;
        `;

        notificationDiv.innerHTML = `
            <strong>${title}</strong><br>
            <small>${message}</small>
        `;

        document.body.appendChild(notificationDiv);

        // 3秒后自动消失
        setTimeout(() => {
            notificationDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notificationDiv.parentNode) {
                    notificationDiv.parentNode.removeChild(notificationDiv);
                }
            }, 300);
        }, 3000);
    }

    // 添加CSS动画
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }

    // 获取 CSRF Token（优化版）
    async function getCSRFToken() {
        const now = Date.now();

        // Token 10分钟内有效
        if (state.csrfToken && (now - state.tokenTime) < 10 * 60 * 1000) {
            return state.csrfToken;
        }

        try {
            log('正在获取 CSRF Token...');
            const response = await fetch('/session/csrf', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data && data.csrf_token) {
                state.csrfToken = data.csrf_token;
                state.tokenTime = now;
                log('CSRF Token 更新成功');
                return state.csrfToken;
            } else if (data && data.csrf) {
                // 兼容旧版本
                state.csrfToken = data.csrf;
                state.tokenTime = now;
                log('CSRF Token 更新成功（旧版格式）');
                return state.csrfToken;
            } else {
                throw new Error('未找到 CSRF Token');
            }
        } catch (error) {
            console.error('获取 CSRF Token 失败:', error);
            showNotification('Token错误', '无法获取CSRF Token', 'error');
            return null;
        }
    }

    // 生成随机的帖子ID列表
    function generatePostIds() {
        const startId = getRandom(10000, 45000);
        const ids = [];

        for (let i = 0; i < CONFIG.batchSize; i++) {
            ids.push(startId + i);
        }

        return ids;
    }

    // 生成时间数据
    function generateTimingsData(postIds) {
        const params = new URLSearchParams();
        const baseTime = getRandom(51000, 61000);

        // 添加帖子阅读时间
        postIds.forEach((id, index) => {
            const time = index === postIds.length - 1 ? 1000 : baseTime;
            params.append(`timings[${id}]`, time.toString());
        });

        // 添加主题阅读时间
        params.append('topic_time', baseTime.toString());
        params.append('topic_id', getRandom(10000, 45000).toString());

        return params.toString();
    }

    // 智能延迟控制
    async function smartDelay() {
        const now = Date.now();
        const timeSinceLastRequest = now - state.lastRequestTime;
        const minDelay = CONFIG.minDelay;

        if (timeSinceLastRequest < minDelay) {
            const delayNeeded = minDelay - timeSinceLastRequest + getRandom(100, 500);
            log(`需要延迟 ${delayNeeded}ms`);
            await sleep(delayNeeded);
        } else {
            const randomDelay = getRandom(100, 500);
            log(`随机延迟 ${randomDelay}ms`);
            await sleep(randomDelay);
        }

        state.lastRequestTime = Date.now();
    }

    // 执行阅读话题请求
    async function executeTopicRead(csrfToken) {
        const topicId = getRandom(10000, 45000);

        try {
            log(`开始阅读话题 ${topicId}...`);
            await smartDelay();

            const response = await fetch(`/t/${topicId}/1.json?track_visit=true&forceLoad=true`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (response.status === 429) {
                showNotification('频率限制', '触发频率限制，暂停15秒', 'error');
                log('触发频率限制，暂停15秒');
                await sleep(15000);
                return false;
            }

            if (response.ok) {
                state.totalSuccess++;
                log(`话题阅读成功: ${topicId}`);
                return true;
            }

            // 404 是正常的，因为话题ID是随机的
            if (response.status === 404) {
                log(`话题不存在（正常）: ${topicId}`);
                return true;
            }

            throw new Error(`HTTP ${response.status}`);

        } catch (error) {
            state.totalErrors++;
            console.error('话题阅读失败:', error);
            return false;
        }
    }

    // 执行阅读时长统计
    async function executeTimingsUpdate(csrfToken) {
        const postIds = generatePostIds();
        const data = generateTimingsData(postIds);

        try {
            log('开始更新阅读时长...');
            await smartDelay();

            const response = await fetch('/topics/timings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-CSRF-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: data,
                credentials: 'include'
            });

            if (response.status === 429) {
                showNotification('频率限制', '触发频率限制，暂停15秒', 'error');
                log('触发频率限制，暂停15秒');
                await sleep(15000);
                return false;
            }

            if (response.ok) {
                state.totalSuccess++;
                log('阅读时长更新成功');
                return true;
            }

            throw new Error(`HTTP ${response.status}`);

        } catch (error) {
            state.totalErrors++;
            console.error('阅读时长更新失败:', error);
            return false;
        }
    }

    // 主循环
    async function mainLoop() {
        log('主循环开始');

        while (state.running) {
            try {
                // 1. 获取 CSRF Token
                const csrfToken = await getCSRFToken();
                if (!csrfToken) {
                    log('无法获取CSRF Token，等待5秒后重试');
                    await sleep(5000);
                    continue;
                }

                // 2. 执行阅读任务
                log('开始执行阅读任务...');
                const tasks = [
                    executeTopicRead(csrfToken),
                    executeTimingsUpdate(csrfToken)
                ];

                const results = await Promise.allSettled(tasks);

                // 3. 统计结果
                const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
                const errorCount = results.length - successCount;

                if (errorCount > 0) {
                    log(`本轮有 ${errorCount} 个任务失败`);
                }

                // 4. 更新控制面板统计
                updateControlPanel();

                // 5. 每10轮显示一次通知
                if (state.totalSuccess % 20 === 0 && state.totalSuccess > 0) {
                    showNotification('运行统计',
                        `成功: ${state.totalSuccess} 次`,
                        'info');
                }

                // 6. 随机延迟避免频率限制
                const delay = getRandom(CONFIG.minDelay, CONFIG.maxDelay);
                log(`等待 ${delay}ms 后继续...`);
                await sleep(delay);

            } catch (error) {
                console.error('主循环异常:', error);
                log(`主循环异常，等待5秒后继续: ${error.message}`);
                await sleep(5000);
            }
        }

        log('主循环结束');
    }

    // 创建控制面板
    function createControlPanel() {
        if (state.panelCreated) return;

        log('创建控制面板...');

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            min-width: 200px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            border: 1px solid #444;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #4CAF50; font-size: 14px;">
                📊 Nodeloc 阅读工具
            </div>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; margin-right: 6px;"></div>
                状态: <span id="script-status" style="color: #4CAF50; margin-left: 4px;">运行中</span>
            </div>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: #2196F3; margin-right: 6px;"></div>
                成功: <span id="success-count" style="color: #2196F3; margin-left: 4px;">0</span> 次
            </div>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: #FF9800; margin-right: 6px;"></div>
                失败: <span id="error-count" style="color: #FF9800; margin-left: 4px;">0</span> 次
            </div>
            <div style="border-top: 1px solid #444; padding-top: 10px; margin-top: 10px;">
                <div style="font-size: 11px; color: #aaa; margin-bottom: 8px;">
                    网站: ${window.location.hostname}
                </div>
            </div>
            <div style="display: flex; gap: 5px; margin-top: 10px;">
                <button id="toggle-script" style="flex: 1; padding: 6px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    暂停
                </button>
                <button id="hide-panel" style="padding: 6px 10px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    ×
                </button>
            </div>
        `;

        document.body.appendChild(panel);
        state.panelCreated = true;

        // 切换脚本状态
        panel.querySelector('#toggle-script').addEventListener('click', () => {
            state.running = !state.running;
            const button = panel.querySelector('#toggle-script');
            button.textContent = state.running ? '暂停' : '继续';
            button.style.background = state.running ? '#4CAF50' : '#FF9800';

            showNotification('状态变更', state.running ? '脚本已继续运行' : '脚本已暂停', 'info');
            log(`脚本状态: ${state.running ? '运行中' : '已暂停'}`);

            if (state.running) {
                // 重启主循环
                setTimeout(() => mainLoop(), 1000);
            }
        });

        // 隐藏面板
        panel.querySelector('#hide-panel').addEventListener('click', () => {
            panel.style.display = 'none';
            log('控制面板已隐藏');
        });

        // 添加拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;

            panel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });

        log('控制面板创建完成');
    }

    // 更新控制面板
    function updateControlPanel() {
        const panel = document.querySelector('div[style*="z-index: 999999"]');
        if (!panel) return;

        const successEl = panel.querySelector('#success-count');
        const errorEl = panel.querySelector('#error-count');
        const statusEl = panel.querySelector('#script-status');

        if (successEl) successEl.textContent = state.totalSuccess;
        if (errorEl) errorEl.textContent = state.totalErrors;
        if (statusEl) {
            statusEl.textContent = state.running ? '运行中' : '已暂停';
            statusEl.style.color = state.running ? '#4CAF50' : '#FF9800';
        }
    }

    // 检查是否在正确的网站上
    function checkWebsite() {
        const hostname = window.location.hostname;
        const validDomains = ['nodeloc.com', 'nodeloc.cc', 'nodeloc.org'];

        for (const domain of validDomains) {
            if (hostname === domain || hostname.endsWith('.' + domain)) {
                return true;
            }
        }

        return false;
    }

    // 初始化
    async function init() {
        log('脚本初始化开始...');

        // 检查网站
        if (!checkWebsite()) {
            log(`不在支持的网站上: ${window.location.hostname}`);
            return;
        }

        log(`在支持的网站上: ${window.location.hostname}`);

        // 添加CSS样式
        addStyles();

        // 等待页面基本加载完成
        if (document.readyState !== 'complete') {
            log('等待页面加载...');
            await new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });
        }

        // 额外等待1秒确保页面完全加载
        await sleep(1000);

        // 创建控制面板
        createControlPanel();

        // 启动主循环
        setTimeout(() => {
            log('启动主循环...');
            mainLoop();
        }, 2000);

        showNotification('脚本加载完成', '控制面板在右上角', 'info');
        log('脚本初始化完成');
    }

    // 启动脚本
    if (checkWebsite()) {
        log('检测到支持的网站，启动脚本...');

        // 如果页面已经加载完成，直接初始化
        if (document.readyState === 'complete') {
            setTimeout(init, 1000);
        } else {
            // 否则等待页面加载完成
            window.addEventListener('load', () => {
                setTimeout(init, 1000);
            });
        }

        // 同时监听DOMContentLoaded事件作为备用
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1000);
        });
    } else {
        log(`不支持当前网站: ${window.location.hostname}`);
    }
})();
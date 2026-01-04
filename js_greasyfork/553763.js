// ==UserScript==
// @name         必应搜索助手
// @name:en      搜索助手
// @namespace    WretchedSniper
// @version      2.2.3
// @description  自动完成 Microsoft Rewards 在必应（Bing）上的每日搜索任务，使用今日热榜关键词，基于Rewards API获取实际积分状态。
// @description:en  Automatically completes Microsoft Rewards daily search tasks on Bing using hot search terms. Based on Rewards API for actual points status.
// @author       WretchedSniper
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @match        *://*.bing.com/search*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://www.bing.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js#sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==
// @downloadURL https://update.greasyfork.org/scripts/553763/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553763/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检测设备类型
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 存储搜索词
    let hotboardSearchTerms = []; // 热榜搜索词
    let usedSearchTerms = []; // 已使用的搜索词

    // 基于Rewards API的进度跟踪
    let rewardsProgress = {
        pcSearchProgress: 0,      // PC搜索进度
        mobileSearchProgress: 0,  // 移动搜索进度
        pcSearchMax: 0,           // PC搜索最大值
        mobileSearchMax: 0,       // 移动搜索最大值
        totalPoints: 0,           // 总积分
        availablePoints: 0,       // 可用积分
        lastUpdated: 0,           // 最后更新时间
        isCompleted: false,       // 是否已完成
        apiAvailable: false       // API是否可用
    };

    // 备用搜索次数跟踪（当API不可用时使用）
    let backupSearchCount = {
        completed: 0,
        target: isMobile ? 25 : 40
    };

    let isSearching = false;
    let countdownTimer = null;

    // 保底搜索词
    const fallbackSearchTerms = ['iPhone', 'Tesla', 'NVIDIA', 'Microsoft', 'AI', '科技', '新闻', '体育'];

    // 工作状态
    const searchState = {
        currentAction: 'idle', // 当前动作：idle, searching, scrolling, checking, waiting
        countdown: 0, // 倒计时
        isCollapsed: true // UI默认折叠
    };

    // 本地存储键名
    const STORAGE_KEY = 'bing_rewards_auto_searcher_state';
    const UI_POSITION_KEY = 'bing_rewards_ui_position';

    // 热榜配置
    let hotboardChannels = [];
    let selectedChannel = localStorage.getItem('SelectedRebangChannel') || '微博';

    // 生成随机滚动时间（5-10秒）
    function getRandomScrollTime() {
        return Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    }

    // 生成随机等待时间（80-140秒）
    function getRandomWaitTime() {
        return Math.floor(Math.random() * (140 - 80 + 1)) + 80;
    }

    // 添加CSS样式
    GM_addStyle(`
        #rewards-helper-container {
            font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .progress-section {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #e9ecef;
        }
        .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .progress-bar {
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #0078d4;
            transition: width 0.3s ease;
        }
        .progress-text {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 4px;
        }
        .points-info {
            font-size: 11px;
            color: #666;
            text-align: center;
            margin-top: 4px;
        }
        .device-info {
            font-size: 11px;
            color: #0078d4;
            text-align: center;
            margin-top: 4px;
            font-weight: bold;
        }
        .status-section {
            margin: 10px 0;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            border-left: 3px solid #0078d4;
        }
        .api-status {
            font-size: 10px;
            color: #666;
            text-align: center;
            margin-top: 4px;
            font-style: italic;
        }
        .api-status.available {
            color: #28a745;
        }
        .api-status.unavailable {
            color: #dc3545;
        }
        .refresh-btn {
            background: none;
            border: none;
            color: #0078d4;
            cursor: pointer;
            font-size: 12px;
            margin-left: 5px;
        }
    `);

    // 保存状态到localStorage
    function saveState() {
        const state = {
            isSearching: isSearching,
            usedSearchTerms: usedSearchTerms,
            searchStartTime: Date.now(),
            lastActivityTime: Date.now(),
            hotboardSearchTerms: hotboardSearchTerms,
            selectedChannel: selectedChannel,
            backupSearchCount: backupSearchCount,
            rewardsProgress: rewardsProgress
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            console.log('状态已保存');
        } catch (e) {
            console.log('保存状态失败:', e.message);
        }
    }

    // 保存UI位置到localStorage
    function saveUIPosition(top, left) {
        try {
            const position = { top, left };
            localStorage.setItem(UI_POSITION_KEY, JSON.stringify(position));
        } catch (e) {
            console.log('保存UI位置失败:', e.message);
        }
    }

    // 从localStorage加载UI位置
    function loadUIPosition() {
        try {
            const savedPosition = localStorage.getItem(UI_POSITION_KEY);
            if (savedPosition) {
                return JSON.parse(savedPosition);
            }
        } catch (e) {
            console.log('加载UI位置失败:', e.message);
        }
        return null;
    }

    // 从localStorage加载状态
    function loadState() {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) {
                const state = JSON.parse(savedState);
                const timeSinceLastActivity = Date.now() - (state.lastActivityTime || 0);
                const maxInactiveTime = 24 * 60 * 60 * 1000; // 24小时

                // 如果超过24小时未活动，清除状态
                if (timeSinceLastActivity > maxInactiveTime) {
                    console.log('状态已过期（超过24小时），清除本地存储');
                    clearState();
                    return null;
                }

                console.log('从本地存储加载状态');
                return state;
            }
        } catch (e) {
            console.log('加载状态失败:', e.message);
        }
        return null;
    }

    // 清除localStorage中的状态
    function clearState() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('已清除本地存储状态');
        } catch (e) {
            console.log('清除状态失败:', e.message);
        }
    }

    // 恢复所有状态
    function restoreAllState() {
        const savedState = loadState();
        if (savedState) {
            isSearching = savedState.isSearching || false;
            usedSearchTerms = savedState.usedSearchTerms || [];
            hotboardSearchTerms = savedState.hotboardSearchTerms || [];
            selectedChannel = savedState.selectedChannel || selectedChannel;
            backupSearchCount = savedState.backupSearchCount || backupSearchCount;
            
            // 恢复rewards进度，但标记API为不可用，需要重新获取
            if (savedState.rewardsProgress) {
                rewardsProgress = savedState.rewardsProgress;
                rewardsProgress.apiAvailable = false; // 需要重新验证
            }

            console.log('状态恢复成功');
            return true;
        }
        return false;
    }

    // 获取Rewards进度信息 - 改进版本
    function fetchRewardsProgress() {
        return new Promise((resolve, reject) => {
            // 尝试多个可能的API端点
            const apiEndpoints = [
                "https://www.bing.com/rewards/api/getuserinfo?type=1",
                "https://www.bing.com/rewards/api/browse/userhome",
                "https://www.bing.com/rewards/api/profile/searchuser?type=1"
            ];
            
            let currentEndpointIndex = 0;
            
            const tryNextEndpoint = () => {
                if (currentEndpointIndex >= apiEndpoints.length) {
                    rewardsProgress.apiAvailable = false;
                    reject(new Error('所有Rewards API端点都不可用'));
                    return;
                }
                
                const endpoint = apiEndpoints[currentEndpointIndex];
                console.log(`尝试Rewards API端点: ${endpoint}`);
                
                GM_xmlhttpRequest({
                    method: "GET",
                    url: endpoint,
                    anonymous: false, // 包含cookies
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('Rewards API响应:', data);
                            
                            if (data && (data.dashboard || data.profile || data.userInfo)) {
                                const dashboard = data.dashboard || data.profile || data.userInfo;
                                
                                // 更新进度信息
                                rewardsProgress.totalPoints = dashboard.userStatus?.availablePoints || 
                                                             data.availablePoints || 
                                                             data.points || 0;
                                rewardsProgress.availablePoints = dashboard.userStatus?.availablePoints || 
                                                                  data.availablePoints || 
                                                                  data.points || 0;
                                rewardsProgress.lastUpdated = Date.now();
                                rewardsProgress.apiAvailable = true;

                                // 查找搜索进度信息
                                if (dashboard.userStatus?.counters) {
                                    const searchCounters = dashboard.userStatus.counters;
                                    const pcSearch = searchCounters.pcSearch || [];
                                    const mobileSearch = searchCounters.mobileSearch || [];

                                    if (pcSearch.length > 0) {
                                        rewardsProgress.pcSearchProgress = pcSearch[0].pointProgress || 0;
                                        rewardsProgress.pcSearchMax = pcSearch[0].pointMax || 0;
                                    }

                                    if (mobileSearch.length > 0) {
                                        rewardsProgress.mobileSearchProgress = mobileSearch[0].pointProgress || 0;
                                        rewardsProgress.mobileSearchMax = mobileSearch[0].pointMax || 0;
                                    }
                                } else if (data.searchProgress) {
                                    // 备用API格式
                                    rewardsProgress.pcSearchProgress = data.searchProgress.pc || 0;
                                    rewardsProgress.mobileSearchProgress = data.searchProgress.mobile || 0;
                                    rewardsProgress.pcSearchMax = data.searchProgress.pcMax || (isMobile ? 0 : 40);
                                    rewardsProgress.mobileSearchMax = data.searchProgress.mobileMax || (isMobile ? 25 : 0);
                                }

                                console.log('Rewards进度更新成功:', rewardsProgress);
                                resolve(rewardsProgress);
                            } else {
                                console.log('API返回数据格式不正确，尝试下一个端点');
                                currentEndpointIndex++;
                                tryNextEndpoint();
                            }
                        } catch (e) {
                            console.log('解析Rewards数据失败:', e);
                            currentEndpointIndex++;
                            tryNextEndpoint();
                        }
                    },
                    onerror: function(error) {
                        console.log(`API端点 ${endpoint} 请求失败:`, error);
                        currentEndpointIndex++;
                        tryNextEndpoint();
                    },
                    ontimeout: function() {
                        console.log(`API端点 ${endpoint} 请求超时`);
                        currentEndpointIndex++;
                        tryNextEndpoint();
                    }
                });
            };
            
            tryNextEndpoint();
        });
    }

    // 检查搜索是否完成
    function checkSearchCompletion() {
        // 如果API可用，使用API数据
        if (rewardsProgress.apiAvailable) {
            const currentProgress = isMobile ? rewardsProgress.mobileSearchProgress : rewardsProgress.pcSearchProgress;
            const maxProgress = isMobile ? rewardsProgress.mobileSearchMax : rewardsProgress.pcSearchMax;
            
            // 如果API返回的max值为0，可能是数据不完整，使用备用目标
            if (maxProgress === 0) {
                return backupSearchCount.completed >= backupSearchCount.target;
            }
            
            return currentProgress >= maxProgress;
        } else {
            // 如果API不可用，使用备用计数
            return backupSearchCount.completed >= backupSearchCount.target;
        }
    }

    // 获取当前进度信息
    function getCurrentProgress() {
        if (rewardsProgress.apiAvailable) {
            const currentProgress = isMobile ? rewardsProgress.mobileSearchProgress : rewardsProgress.pcSearchProgress;
            const maxProgress = isMobile ? rewardsProgress.mobileSearchMax : rewardsProgress.pcSearchMax;
            
            // 如果API返回的max值为0，使用备用目标
            const effectiveMax = maxProgress === 0 ? backupSearchCount.target : maxProgress;
            const effectiveCurrent = maxProgress === 0 ? backupSearchCount.completed : currentProgress;
            
            return {
                current: effectiveCurrent,
                max: effectiveMax,
                remaining: effectiveMax - effectiveCurrent
            };
        } else {
            return {
                current: backupSearchCount.completed,
                max: backupSearchCount.target,
                remaining: backupSearchCount.target - backupSearchCount.completed
            };
        }
    }

    // 增加搜索计数
    function incrementSearchCount() {
        if (rewardsProgress.apiAvailable) {
            // 如果API可用，不修改本地计数，等待API更新
            return;
        } else {
            // 如果API不可用，增加备用计数
            backupSearchCount.completed++;
            saveState();
        }
    }

    // 手动刷新Rewards进度
    function refreshRewardsProgress() {
        updateStatus('手动刷新Rewards进度...');
        fetchRewardsProgress().then(() => {
            updateProgressDisplay();
            updateStatus('Rewards进度已更新');
        }).catch(error => {
            console.log('手动刷新Rewards进度失败:', error);
            updateStatus('刷新Rewards进度失败');
        });
    }

    // 创建UI控件
    function createUI() {
        // 检查是否在搜索页面，如果不是则不创建UI
        const isSearchPage = window.location.href.includes('/search') ||
                            window.location.href === 'https://www.bing.com/' ||
                            window.location.href === 'https://cn.bing.com/';

        if (!isSearchPage) {
            console.log('不在搜索页面，不创建UI');
            return;
        }

        // 如果UI已经存在，先移除
        const existingUI = document.getElementById('rewards-helper-container');
        if (existingUI) {
            existingUI.remove();
        }

        const container = document.createElement('div');
        container.id = 'rewards-helper-container';

        // 加载保存的UI位置，如果没有则使用默认位置
        const savedPosition = loadUIPosition();
        const defaultTop = isMobile ? '10px' : '10px';
        const defaultLeft = isMobile ? '10px' : 'auto';
        const defaultRight = isMobile ? 'auto' : '20%';

        container.style.cssText = `
            position: fixed;
            top: ${savedPosition ? savedPosition.top + 'px' : defaultTop};
            left: ${savedPosition ? savedPosition.left + 'px' : defaultLeft};
            right: ${savedPosition ? 'auto' : defaultRight};
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            width: ${isMobile ? '280px' : '320px'};
            max-height: 85vh;
            overflow-y: auto;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            -webkit-user-select: none;
        `;

        const headerTitle = document.createElement('span');
        headerTitle.textContent = `Rewards 搜索助手 v2.2.3 (${isMobile ? '手机版' : '电脑版'})`;
        headerTitle.style.fontSize = '14px';
        header.appendChild(headerTitle);

        const controlsContainer = document.createElement('div');
        controlsContainer.style.display = 'flex';
        controlsContainer.style.alignItems = 'center';
        controlsContainer.style.gap = '8px';

        const minimizeBtn = document.createElement('span');
        minimizeBtn.id = 'minimize-btn';
        minimizeBtn.textContent = '折叠';
        minimizeBtn.style.cssText = `
            cursor: pointer;
            font-size: 12px;
            color: #666;
        `;
        minimizeBtn.onclick = toggleCollapse;
        controlsContainer.appendChild(minimizeBtn);

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            cursor: pointer;
            font-size: 16px;
            color: #999;
        `;
        closeBtn.onclick = function () {
            container.style.display = 'none';
        };
        controlsContainer.appendChild(closeBtn);
        header.appendChild(controlsContainer);

        const content = document.createElement('div');
        content.id = 'rewards-helper-content';

        // 进度显示区域
        const progressSection = document.createElement('div');
        progressSection.className = 'progress-section';

        const progressInfo = document.createElement('div');
        progressInfo.className = 'progress-info';

        const progressTitle = document.createElement('div');
        progressTitle.id = 'rewards-progress';
        progressTitle.textContent = `Rewards 进度`;
        progressTitle.style.cssText = 'font-weight: bold;';
        progressInfo.appendChild(progressTitle);

        // 添加刷新按钮
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'refresh-btn';
        refreshBtn.innerHTML = '🔄';
        refreshBtn.title = '刷新Rewards进度';
        refreshBtn.onclick = refreshRewardsProgress;
        progressInfo.appendChild(refreshBtn);

        progressSection.appendChild(progressInfo);

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressFill = document.createElement('div');
        progressFill.id = 'progress-fill';
        progressFill.className = 'progress-fill';
        progressFill.style.width = `0%`;
        progressBar.appendChild(progressFill);
        progressSection.appendChild(progressBar);

        const progressText = document.createElement('div');
        progressText.id = 'progress-text';
        progressText.className = 'progress-text';
        progressText.textContent = '加载中...';
        progressSection.appendChild(progressText);

        // 积分信息
        const pointsInfo = document.createElement('div');
        pointsInfo.id = 'points-info';
        pointsInfo.className = 'points-info';
        pointsInfo.textContent = '总积分: 加载中...';
        progressSection.appendChild(pointsInfo);

        // API状态
        const apiStatus = document.createElement('div');
        apiStatus.id = 'api-status';
        apiStatus.className = 'api-status';
        apiStatus.textContent = 'Rewards API: 检测中...';
        progressSection.appendChild(apiStatus);

        // 设备信息
        const deviceInfo = document.createElement('div');
        deviceInfo.className = 'device-info';
        deviceInfo.textContent = `${isMobile ? '手机' : '电脑'}版搜索`;
        progressSection.appendChild(deviceInfo);

        content.appendChild(progressSection);

        // 状态区域
        const statusSection = document.createElement('div');
        statusSection.className = 'status-section';

        const searchStatus = document.createElement('div');
        searchStatus.id = 'search-status';
        searchStatus.style.cssText = `
            font-style: italic;
            color: #666;
            font-size: 12px;
        `;
        searchStatus.textContent = '就绪 - 点击"开始自动搜索"按钮开始';
        statusSection.appendChild(searchStatus);

        const countdown = document.createElement('div');
        countdown.id = 'countdown';
        countdown.style.cssText = `
            margin-top: 5px;
            font-weight: bold;
            color: #0078d4;
            font-size: 12px;
        `;
        statusSection.appendChild(countdown);

        content.appendChild(statusSection);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'rewards-buttons-container';
        buttonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 12px;
            gap: 8px;
        `;

        const startSearchBtn = document.createElement('button');
        startSearchBtn.id = 'start-search-btn';
        startSearchBtn.textContent = '开始自动搜索';
        startSearchBtn.style.cssText = `
            padding: 8px 16px;
            cursor: pointer;
            background-color: #0078d4;
            color: white;
            border: none;
            border-radius: 4px;
            width: 100%;
            font-weight: bold;
        `;
        startSearchBtn.onclick = function () {
            if (!isSearching) {
                startAutomatedSearch();
            } else {
                stopAutomatedSearch();
            }
        };
        buttonsContainer.appendChild(startSearchBtn);

        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(buttonsContainer);
        document.body.appendChild(container);

        // 让UI窗口可拖动（支持触摸设备）
        makeDraggable(container, header);

        // 初始更新进度显示
        updateProgressDisplay();

        // 更新状态显示
        updateStatus('就绪 - 点击"开始自动搜索"按钮开始');
    }

    // 让UI窗口可拖动（支持触摸设备）
    function makeDraggable(container, header) {
        let offsetX, offsetY;
        let isDragging = false;

        const onMouseDown = (e) => {
            if (window.getComputedStyle(e.target).cursor === 'pointer') {
                return;
            }

            isDragging = true;
            if (container.style.right) {
                container.style.left = container.offsetLeft + 'px';
                container.style.right = '';
            }

            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;

            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp, { once: true });
        };

        const onTouchStart = (e) => {
            if (window.getComputedStyle(e.target).cursor === 'pointer') {
                return;
            }

            isDragging = true;
            if (container.style.right) {
                container.style.left = container.offsetLeft + 'px';
                container.style.right = '';
            }

            const touch = e.touches[0];
            offsetX = touch.clientX - container.offsetLeft;
            offsetY = touch.clientY - container.offsetTop;

            document.body.style.userSelect = 'none';
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd, { once: true });
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            container.style.top = (e.clientY - offsetY) + 'px';
            container.style.left = (e.clientX - offsetX) + 'px';
        };

        const onTouchMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            container.style.top = (touch.clientY - offsetY) + 'px';
            container.style.left = (touch.clientX - offsetX) + 'px';
        };

        const onMouseUp = () => {
            isDragging = false;
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMouseMove);

            // 保存UI位置
            saveUIPosition(container.offsetTop, container.offsetLeft);
        };

        const onTouchEnd = () => {
            isDragging = false;
            document.body.style.userSelect = '';
            document.removeEventListener('touchmove', onTouchMove);

            // 保存UI位置
            saveUIPosition(container.offsetTop, container.offsetLeft);
        };

        header.addEventListener('mousedown', onMouseDown);
        header.addEventListener('touchstart', onTouchStart, { passive: true });
    }

    // 更新状态显示
    function updateStatus(message) {
        const statusElement = document.getElementById('search-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
        console.log(message);
    }

    // 切换UI折叠状态
    function toggleCollapse() {
        searchState.isCollapsed = !searchState.isCollapsed;
        applyCollapseState();
    }

    // 应用折叠状态
    function applyCollapseState() {
        const progressSection = document.querySelector('.progress-section');
        const statusSection = document.querySelector('.status-section');
        const minimizeBtn = document.getElementById('minimize-btn');

        if (searchState.isCollapsed) {
            if (progressSection) progressSection.style.display = 'none';
            if (statusSection) statusSection.style.display = 'none';
            if (minimizeBtn) minimizeBtn.textContent = '展开';
        } else {
            if (progressSection) progressSection.style.display = 'block';
            if (statusSection) statusSection.style.display = 'block';
            if (minimizeBtn) minimizeBtn.textContent = '折叠';
        }
    }

    // 更新进度显示
    function updateProgressDisplay() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const pointsInfo = document.getElementById('points-info');
        const apiStatus = document.getElementById('api-status');

        const progress = getCurrentProgress();
        let percentage = 0;
        if (progress.max > 0) {
            percentage = Math.min(100, Math.round((progress.current / progress.max) * 100));
        }

        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) {
            progressText.textContent = `${progress.current}/${progress.max} (${percentage}%)`;
        }
        
        if (pointsInfo) {
            if (rewardsProgress.apiAvailable && rewardsProgress.totalPoints > 0) {
                pointsInfo.textContent = `总积分: ${rewardsProgress.totalPoints} | 可用积分: ${rewardsProgress.availablePoints}`;
            } else {
                pointsInfo.textContent = `总积分: 未知 (API不可用)`;
            }
        }
        
        if (apiStatus) {
            if (rewardsProgress.apiAvailable) {
                apiStatus.textContent = 'Rewards API: 可用';
                apiStatus.className = 'api-status available';
            } else {
                apiStatus.textContent = 'Rewards API: 不可用 (使用备用计数)';
                apiStatus.className = 'api-status unavailable';
            }
        }

        if (rewardsProgress.isCompleted) {
            if (progressFill) progressFill.style.background = '#28a745';
        } else {
            if (progressFill) progressFill.style.background = '#0078d4';
        }
    }

    // 更新倒计时显示
    function updateCountdown(seconds, action) {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            if (seconds > 0) {
                let actionText = '';
                switch (action) {
                    case 'scrolling': actionText = '滚动中'; break;
                    case 'waiting': actionText = '等待中'; break;
                    case 'checking': actionText = '检查中'; break;
                    default: actionText = '倒计时';
                }
                countdownElement.textContent = `${actionText}: ${seconds}秒`;
                countdownElement.style.display = 'block';
            } else {
                countdownElement.style.display = 'none';
            }
        }
    }

    // 获取热榜关键词
    function fetchHotboardKeywords() {
        const cacheKey = `RebangChannel_${selectedChannel}`;
        updateStatus(`正在获取${selectedChannel}热榜...`);

        if (sessionStorage.getItem(cacheKey)) {
            const data = JSON.parse(sessionStorage.getItem(cacheKey));
            processHotboardData(data);
            console.log(`使用缓存的${selectedChannel}热榜`);
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.pearktrue.cn/api/dailyhot/?title=${encodeURIComponent(selectedChannel)}`,
            timeout: 10000,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.code === 200 && data.data) {
                        sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
                        processHotboardData(data.data);
                        console.log(`获取${selectedChannel}热榜成功`);
                    } else {
                        throw new Error('API返回数据格式错误');
                    }
                } catch (e) {
                    console.log('解析热榜数据失败:', e);
                    updateStatus('获取热榜失败，使用保底搜索词');
                    useFallbackKeywords();
                }
            },
            onerror: function() {
                console.log('获取热榜失败');
                updateStatus('获取热榜失败，使用保底搜索词');
                useFallbackKeywords();
            },
            ontimeout: function() {
                console.log('获取热榜超时');
                updateStatus('获取热榜超时，使用保底搜索词');
                useFallbackKeywords();
            }
        });
    }

    // 处理热榜数据
    function processHotboardData(data) {
        if (!data || !Array.isArray(data)) {
            useFallbackKeywords();
            return;
        }

        // 提取标题作为搜索词
        const keywords = data.map(item => item.title).filter(title => title && title.length > 0);

        if (keywords.length === 0) {
            useFallbackKeywords();
            return;
        }

        hotboardSearchTerms = keywords;
        updateStatus(`已加载 ${keywords.length} 个热榜搜索词`);
        saveState();
    }

    // 使用保底搜索词
    function useFallbackKeywords() {
        hotboardSearchTerms = [...fallbackSearchTerms];
        updateStatus(`使用 ${fallbackSearchTerms.length} 个保底搜索词`);
        saveState();
    }

    // 获取搜索词（只使用热榜搜索词）
    function getSearchTerm() {
        if (hotboardSearchTerms.length === 0) {
            return null;
        }

        let availableTerms = hotboardSearchTerms.filter(term => !usedSearchTerms.includes(term));

        // 如果所有搜索词都已使用过，重置已使用列表
        if (availableTerms.length === 0 && hotboardSearchTerms.length > 0) {
            console.log('所有热榜搜索词已用完，重置已使用列表');
            usedSearchTerms = [];
            availableTerms = [...hotboardSearchTerms];
        }

        if (availableTerms.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTerms.length);
            const term = availableTerms[randomIndex];
            usedSearchTerms.push(term);
            console.log(`选择搜索词: ${term} (热榜，还有 ${availableTerms.length - 1} 个未使用)`);
            return term;
        }

        return null;
    }

    // 执行搜索
    function performSearch(term) {
        if (!term) return false;

        const searchBox = document.querySelector('#sb_form_q');
        if (searchBox) {
            searchBox.value = term;
            const searchForm = document.querySelector('#sb_form');
            if (searchForm) {
                searchForm.submit();
                return true;
            }
        }
        return false;
    }

    // 模拟滚动
    function simulateScrolling(callback) {
        const scrollTime = getRandomScrollTime();
        updateStatus(`正在滚动页面... (${scrollTime}秒)`);
        searchState.currentAction = 'scrolling';

        startCountdown(scrollTime, 'scrolling', callback);

        const scrollInterval = setInterval(() => {
            const scrollAmount = Math.floor(Math.random() * 300) + 100;
            const scrollDirection = Math.random() > 0.3 ? 1 : -1;
            window.scrollBy(0, scrollAmount * scrollDirection);

            if (searchState.currentAction !== 'scrolling') {
                clearInterval(scrollInterval);
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(scrollInterval);
        }, scrollTime * 1000);
    }

    // 等待下一次搜索
    function waitForNextSearch() {
        const waitTime = getRandomWaitTime();
        updateStatus(`等待下一次搜索... (${waitTime}秒)`);
        startCountdown(waitTime, 'waiting', performNextSearch);
    }

    // 执行下一次搜索
    function performNextSearch() {
        if (!isSearching) return;

        // 定期检查Rewards进度（每5次搜索检查一次）
        if (backupSearchCount.completed % 5 === 0) {
            fetchRewardsProgress().then(() => {
                updateProgressDisplay();
                checkAndContinueSearch();
            }).catch(error => {
                console.log('定期检查Rewards进度失败:', error);
                checkAndContinueSearch();
            });
        } else {
            checkAndContinueSearch();
        }
    }

    // 检查并继续搜索
    function checkAndContinueSearch() {
        // 检查是否已完成
        const progress = getCurrentProgress();
        if (checkSearchCompletion()) {
            rewardsProgress.isCompleted = true;
            showCompletionNotification();
            updateStatus('搜索任务已完成！');
            stopAutomatedSearch();
            return;
        }

        const searchTerm = getSearchTerm();

        if (!searchTerm) {
            updateStatus('没有可用的搜索词，刷新热榜...');
            fetchHotboardKeywords();
            setTimeout(performNextSearch, 3000);
            return;
        }

        updateStatus(`正在搜索: ${searchTerm} [剩余:${progress.remaining}次]`);

        if (performSearch(searchTerm)) {
            // 搜索成功，增加计数
            incrementSearchCount();
            
            // 保存状态
            saveState();

            setTimeout(() => {
                simulateScrolling(() => {
                    waitForNextSearch();
                });
            }, 2000);
        } else {
            updateStatus('搜索失败，请检查网页状态');
            setTimeout(performNextSearch, 3000);
        }
    }

    // 开始自动搜索
    function startAutomatedSearch() {
        if (hotboardSearchTerms.length === 0) {
            updateStatus('获取热榜搜索词中...');
            fetchHotboardKeywords();
            setTimeout(() => {
                if (hotboardSearchTerms.length === 0) {
                    alert('没有搜索词，无法开始搜索');
                    return;
                }
                startSearchProcess();
            }, 2000);
        } else {
            startSearchProcess();
        }
    }

    // 开始搜索流程
    function startSearchProcess() {
        isSearching = true;
        usedSearchTerms = [];
        const startSearchBtn = document.getElementById('start-search-btn');
        if (startSearchBtn) {
            startSearchBtn.textContent = '停止搜索';
            startSearchBtn.style.backgroundColor = '#d83b01';
        }
        updateStatus('自动搜索已开始...');

        saveState();

        // 尝试获取Rewards进度，但不阻塞搜索开始
        fetchRewardsProgress().then(() => {
            updateProgressDisplay();
            
            if (checkSearchCompletion()) {
                rewardsProgress.isCompleted = true;
                updateStatus('搜索任务已完成！');
                stopAutomatedSearch();
                return;
            }
        }).catch(error => {
            console.log('获取Rewards进度失败，使用备用计数:', error);
            updateStatus('Rewards API不可用，使用备用计数进行搜索');
            updateProgressDisplay();
        });

        // 无论API是否可用，都开始搜索
        performNextSearch();
    }

    // 停止自动搜索
    function stopAutomatedSearch() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }

        isSearching = false;
        searchState.currentAction = 'idle';
        updateCountdown(0, '');

        const startSearchBtn = document.getElementById('start-search-btn');
        if (startSearchBtn) {
            startSearchBtn.textContent = '开始自动搜索';
            startSearchBtn.style.backgroundColor = '#0078d4';
        }
        updateStatus('搜索已停止');

        // 保存最终状态
        saveState();
    }

    // 显示完成通知
    function showCompletionNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #0078d4;
            color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 10001;
            text-align: center;
            font-size: 16px;
        `;
        
        const progress = getCurrentProgress();
        let message = '';
        if (rewardsProgress.apiAvailable) {
            message = `
                <div style="font-weight: bold; margin-bottom: 10px; font-size: 18px;">任务完成！</div>
                <div>${isMobile ? '移动' : 'PC'}搜索任务已完成</div>
                <div>当前积分: ${rewardsProgress.availablePoints}</div>
            `;
        } else {
            message = `
                <div style="font-weight: bold; margin-bottom: 10px; font-size: 18px;">任务完成！</div>
                <div>已完成 ${progress.current} 次搜索</div>
                <div>Rewards API不可用，请手动检查积分</div>
            `;
        }
        
        notification.innerHTML = message + `
            <button id="notification-close" style="
                margin-top: 15px;
                padding: 5px 15px;
                background-color: white;
                color: #0078d4;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            ">关闭</button>
        `;
        document.body.appendChild(notification);

        document.getElementById('notification-close').addEventListener('click', function () {
            notification.remove();
        });

        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 10000);
    }

    // 开始倒计时
    function startCountdown(seconds, action, callback) {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }

        searchState.currentAction = action;
        searchState.countdown = seconds;

        updateCountdown(seconds, action);

        countdownTimer = setInterval(() => {
            searchState.countdown--;
            updateCountdown(searchState.countdown, action);

            if (searchState.countdown <= 0) {
                clearInterval(countdownTimer);
                countdownTimer = null;
                if (callback) callback();
            }
        }, 1000);
    }

    // 在页面加载完成后初始化
    window.addEventListener('load', function () {
        console.log(`Microsoft Rewards 热榜搜索助手已加载 v2.2.3 (${isMobile ? '手机版' : '电脑版'})`);

        // 只在搜索页面创建UI
        const isSearchPage = window.location.href.includes('/search') ||
                            window.location.href === 'https://www.bing.com/' ||
                            window.location.href === 'https://cn.bing.com/';

        if (isSearchPage) {
            // 先恢复所有状态
            restoreAllState();

            // 创建UI
            createUI();
            applyCollapseState();

            // 初始化获取Rewards进度
            fetchRewardsProgress().then(() => {
                updateProgressDisplay();
            }).catch(error => {
                console.log('初始化获取Rewards进度失败，使用备用计数:', error);
                updateProgressDisplay();
            });

            // 初始化热榜
            setTimeout(() => {
                fetchHotboardKeywords();
            }, 1000);

            // 如果之前正在搜索，自动恢复
            if (isSearching && !rewardsProgress.isCompleted) {
                updateStatus(`检测到之前的搜索任务，正在恢复...`);
                setTimeout(() => {
                    startSearchProcess();
                }, 3000);
            }
        }
    });

    // 监听URL变化，在搜索页面显示UI，在其他页面隐藏UI
    let currentUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;

            const isSearchPage = currentUrl.includes('/search') ||
                                currentUrl === 'https://www.bing.com/' ||
                                currentUrl === 'https://cn.bing.com/';

            const container = document.getElementById('rewards-helper-container');

            if (isSearchPage && !container) {
                // 进入搜索页面，创建UI
                createUI();
                applyCollapseState();
            } else if (!isSearchPage && container) {
                // 离开搜索页面，隐藏UI
                container.style.display = 'none';
            } else if (isSearchPage && container) {
                // 在搜索页面，确保UI显示
                container.style.display = 'block';
            }
        }
    }, 1000);
})();
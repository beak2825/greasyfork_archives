// ==UserScript==
// @name         LinuxDo 论坛自动阅读器
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  自动阅读LinuxDo论坛话题，支持自定义浏览速度和话题数量，支持控制面板展开/收缩，记录已阅读话题避免重复，支持跳过前面几篇话题，智能识别短话题并立即跳转
// @author       A嘉技术
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550562/LinuxDo%20%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550562/LinuxDo%20%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项 - 使用GM存储来持久化状态
    let config = {
        readSpeed: GM_getValue('readSpeed', 3000),
        scrollSpeed: GM_getValue('scrollSpeed', 1000),
        maxTopics: GM_getValue('maxTopics', 10),
        skipCount: GM_getValue('skipCount', 0), // 跳过前面几篇话题
        currentCount: GM_getValue('currentCount', 0),
        isRunning: GM_getValue('isRunning', false),
        topicList: GM_getValue('topicList', []),
        currentIndex: GM_getValue('currentIndex', 0),
        startUrl: GM_getValue('startUrl', ''),
        isCollapsed: GM_getValue('isCollapsed', false),
        readTopicIds: GM_getValue('readTopicIds', []), // 已阅读的话题ID列表
        actualTopicCount: GM_getValue('actualTopicCount', 0) // 实际要阅读的话题数量
    };

    // 保存配置到GM存储
    function saveConfig() {
        GM_setValue('readSpeed', config.readSpeed);
        GM_setValue('scrollSpeed', config.scrollSpeed);
        GM_setValue('maxTopics', config.maxTopics);
        GM_setValue('skipCount', config.skipCount);
        GM_setValue('currentCount', config.currentCount);
        GM_setValue('isRunning', config.isRunning);
        GM_setValue('topicList', config.topicList);
        GM_setValue('currentIndex', config.currentIndex);
        GM_setValue('startUrl', config.startUrl);
        GM_setValue('isCollapsed', config.isCollapsed);
        GM_setValue('readTopicIds', config.readTopicIds);
        GM_setValue('actualTopicCount', config.actualTopicCount);
    }

    // 清除运行状态
    function clearRunningState() {
        config.isRunning = false;
        config.currentCount = 0;
        config.currentIndex = 0;
        config.topicList = [];
        config.startUrl = '';
        config.actualTopicCount = 0;
        saveConfig();
    }

    // 从URL提取话题ID
    function extractTopicId(url) {
        const match = url.match(/\/t\/topic\/(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    // 检查话题是否已阅读
    function isTopicRead(topicId) {
        return config.readTopicIds.includes(topicId);
    }

    // 标记话题为已阅读
    function markTopicAsRead(topicId) {
        if (!config.readTopicIds.includes(topicId)) {
            config.readTopicIds.push(topicId);
            // 限制已阅读列表最大长度为1000，避免存储过多数据
            if (config.readTopicIds.length > 1000) {
                config.readTopicIds = config.readTopicIds.slice(-1000);
            }
            saveConfig();
        }
    }

    // 清除已阅读记录
    function clearReadHistory() {
        config.readTopicIds = [];
        saveConfig();
        updateStatus('已清除阅读记录');
        setTimeout(() => {
            createControlPanel();
        }, 1000);
    }

    // 切换面板展开/收缩状态
    function togglePanel() {
        config.isCollapsed = !config.isCollapsed;
        saveConfig();
        updatePanelDisplay();
    }

    // 更新面板显示状态
    function updatePanelDisplay() {
        const panel = document.getElementById('linuxdo-auto-reader-panel');
        const content = document.getElementById('panel-content');
        const toggleBtn = document.getElementById('toggle-btn');
        const header = document.getElementById('panel-header');

        if (!panel || !content || !toggleBtn || !header) return;

        if (config.isCollapsed) {
            content.style.display = 'none';
            toggleBtn.innerHTML = '📖';
            toggleBtn.title = '展开控制面板';
            header.style.cursor = 'pointer';
            panel.style.width = '60px';
            panel.style.height = '60px';
            panel.style.borderRadius = '50%';
            // 隐藏标题文字
            const titleEl = header.querySelector('.panel-title');
            if (titleEl) titleEl.style.display = 'none';
        } else {
            content.style.display = 'block';
            toggleBtn.innerHTML = '📕';
            toggleBtn.title = '收缩控制面板';
            header.style.cursor = 'default';
            panel.style.width = '320px';
            panel.style.height = 'auto';
            panel.style.borderRadius = '8px';
            // 显示标题文字
            const titleEl = header.querySelector('.panel-title');
            if (titleEl) titleEl.style.display = 'block';
        }
    }

    // 安全地移除元素
    function safeRemoveElement(element) {
        try {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        } catch (error) {
            console.log('移除元素时出错，但已忽略:', error);
        }
    }

    // 创建控制面板
    function createControlPanel() {
        // 如果面板已存在，先安全地删除
        const existingPanel = document.getElementById('linuxdo-auto-reader-panel');
        if (existingPanel) {
            safeRemoveElement(existingPanel);
        }

        const panel = document.createElement('div');
        panel.id = 'linuxdo-auto-reader-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background: #fff;
            border: 2px solid #007cba;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            transition: all 0.3s ease;
            overflow: hidden;
        `;

        // 修复进度显示逻辑
        const totalTopics = config.isRunning ? config.actualTopicCount : Math.min(config.maxTopics, config.topicList.length);
        const statusText = config.isRunning ?
            (isTopicPage() ? '正在阅读话题内容...' : '准备跳转到下一个话题...') :
            '未运行';

        panel.innerHTML = `
            <div id="panel-header" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #007cba; color: white;">
                <div class="panel-title" style="font-weight: bold; font-size: 16px;">🤖 LinuxDo 自动阅读器</div>
                <button id="toggle-btn" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 2px 6px; border-radius: 3px; transition: background 0.2s;" title="收缩控制面板">📕</button>
            </div>
            <div id="panel-content" style="padding: 15px;">
                <div style="margin-bottom: 10px;">
                    <label style="display: inline-block; width: 100px;">阅读速度 (秒):</label>
                    <input type="number" id="readSpeed" value="${config.readSpeed/1000}" min="1" max="60" style="width: 60px; padding: 2px; border: 1px solid #ddd; border-radius: 3px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: inline-block; width: 100px;">滚动速度 (秒):</label>
                    <input type="number" id="scrollSpeed" value="${config.scrollSpeed/1000}" min="0.5" max="10" step="0.5" style="width: 60px; padding: 2px; border: 1px solid #ddd; border-radius: 3px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: inline-block; width: 100px;">话题数量:</label>
                    <input type="number" id="maxTopics" value="${config.maxTopics}" min="1" max="100" style="width: 60px; padding: 2px; border: 1px solid #ddd; border-radius: 3px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: inline-block; width: 100px;">跳过前面:</label>
                    <input type="number" id="skipCount" value="${config.skipCount}" min="0" max="50" style="width: 60px; padding: 2px; border: 1px solid #ddd; border-radius: 3px;">
                    <span style="font-size: 12px; color: #666; margin-left: 5px;">篇</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <button id="startBtn" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; transition: background 0.2s;" ${config.isRunning ? 'disabled' : ''}>▶️ 开始阅读</button>
                    <button id="stopBtn" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: background 0.2s;" ${!config.isRunning ? 'disabled' : ''}>⏹️ 停止阅读</button>
                </div>
                <div style="margin-bottom: 15px;">
                    <button id="backToListBtn" style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 10px; transition: background 0.2s;" ${config.isRunning ? 'disabled' : ''}>🔙 返回列表</button>
                    <button id="clearHistoryBtn" style="background: #ffc107; color: #212529; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background 0.2s;" ${config.isRunning ? 'disabled' : ''}>🗑️ 清除记录</button>
                </div>
                <div style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
                    <div>状态: <span id="status" style="font-weight: bold; color: ${config.isRunning ? '#28a745' : '#6c757d'};">${statusText}</span></div>
                    <div>进度: <span id="progress" style="font-weight: bold; color: #007cba;">${config.currentCount}/${totalTopics}</span></div>
                    <div>已读话题: <span style="font-weight: bold; color: #17a2b8;">${config.readTopicIds.length}</span> 个</div>
                    <div style="margin-top: 5px; font-size: 11px; color: #999;">
                        💡 提示：短话题滚动到底部后会立即跳转
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        bindEvents();

        // 应用当前的展开/收缩状态
        updatePanelDisplay();
    }

    // 绑定事件
    function bindEvents() {
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const backToListBtn = document.getElementById('backToListBtn');
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        const toggleBtn = document.getElementById('toggle-btn');
        const header = document.getElementById('panel-header');

        if (startBtn) startBtn.addEventListener('click', startReading);
        if (stopBtn) stopBtn.addEventListener('click', stopReading);
        if (backToListBtn) backToListBtn.addEventListener('click', backToList);
        if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearReadHistory);

        // 修复CSP问题：使用addEventListener而不是内联事件处理
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                togglePanel();
            });
        }

        // 为整个标题栏添加点击事件（仅在收缩状态下生效）
        if (header) {
            header.addEventListener('click', (e) => {
                // 如果点击的是按钮，不处理
                if (e.target.id === 'toggle-btn') return;

                // 只有在收缩状态下才允许通过点击标题栏展开
                if (config.isCollapsed) {
                    togglePanel();
                }
            });
        }

        // 监听配置变化
        const readSpeedInput = document.getElementById('readSpeed');
        const scrollSpeedInput = document.getElementById('scrollSpeed');
        const maxTopicsInput = document.getElementById('maxTopics');
        const skipCountInput = document.getElementById('skipCount');

        if (readSpeedInput) {
            readSpeedInput.addEventListener('change', (e) => {
                config.readSpeed = parseInt(e.target.value) * 1000;
                saveConfig();
            });
        }
        if (scrollSpeedInput) {
            scrollSpeedInput.addEventListener('change', (e) => {
                config.scrollSpeed = parseFloat(e.target.value) * 1000;
                saveConfig();
            });
        }
        if (maxTopicsInput) {
            maxTopicsInput.addEventListener('change', (e) => {
                config.maxTopics = parseInt(e.target.value);
                saveConfig();
            });
        }
        if (skipCountInput) {
            skipCountInput.addEventListener('change', (e) => {
                config.skipCount = parseInt(e.target.value) || 0;
                saveConfig();
                console.log('跳过前面话题数量已更新为:', config.skipCount);
            });
        }
    }

    // 更新状态显示
    function updateStatus(status, progress = null) {
        const statusEl = document.getElementById('status');
        const progressEl = document.getElementById('progress');
        if (statusEl) {
            statusEl.textContent = status;
            statusEl.style.color = config.isRunning ? '#28a745' : '#6c757d';
        }
        if (progressEl && progress) {
            progressEl.textContent = progress;
        }
    }

    // 获取话题列表（过滤已阅读的话题并应用跳过设置）
    function getTopicList() {
        // 尝试多种选择器来获取话题链接
        const selectors = [
            'a.title',
            'a[href*="/t/topic/"]',
            '.topic-list-item a',
            '.topic-title a'
        ];

        let topicLinks = [];
        for (const selector of selectors) {
            topicLinks = Array.from(document.querySelectorAll(selector));
            if (topicLinks.length > 0) break;
        }

        const allTopics = topicLinks
            .map(link => link.href)
            .filter(href => href && href.includes('/t/topic/'))
            .slice(0, 100); // 限制最多100个话题

        console.log(`原始话题列表长度: ${allTopics.length}`);
        console.log(`跳过前面话题数量: ${config.skipCount}`);

        // 应用跳过设置：跳过前面指定数量的话题
        const topicsAfterSkip = allTopics.slice(config.skipCount);
        console.log(`跳过后话题列表长度: ${topicsAfterSkip.length}`);

        // 过滤掉已阅读的话题
        const unreadTopics = topicsAfterSkip.filter(url => {
            const topicId = extractTopicId(url);
            return topicId && !isTopicRead(topicId);
        });

        console.log(`找到 ${allTopics.length} 个话题，跳过前 ${config.skipCount} 个后剩余 ${topicsAfterSkip.length} 个，其中 ${unreadTopics.length} 个未读`);
        return unreadTopics;
    }

    // 开始阅读
    async function startReading() {
        if (config.isRunning) return;

        config.isRunning = true;
        config.currentCount = 0;
        config.currentIndex = 0;
        config.startUrl = window.location.href;

        updateStatus('正在获取话题列表...');

        // 如果不在话题列表页面，先跳转到latest页面
        if (!isTopicListPage()) {
            updateStatus('跳转到话题列表页面...');
            saveConfig();
            window.location.href = 'https://linux.do/latest';
            return;
        }

        // 获取话题列表（已过滤已阅读的话题并应用跳过设置）
        config.topicList = getTopicList();
        if (config.topicList.length === 0) {
            const skipText = config.skipCount > 0 ? `，跳过前 ${config.skipCount} 个话题后` : '';
            updateStatus(`未找到未读话题${skipText}，请刷新页面或调整设置`);
            clearRunningState();
            createControlPanel();
            return;
        }

        // 计算实际要阅读的话题数量：用户设置的数量和实际可用话题数量的较小值
        config.actualTopicCount = Math.min(config.maxTopics, config.topicList.length);
        console.log(`用户设置话题数量: ${config.maxTopics}, 实际可用话题数量: ${config.topicList.length}, 实际要阅读: ${config.actualTopicCount}`);

        const skipText = config.skipCount > 0 ? `（已跳过前 ${config.skipCount} 个话题）` : '';
        updateStatus(`开始自动阅读...${skipText}`, `0/${config.actualTopicCount}`);

        // 保存状态
        saveConfig();

        // 更新按钮状态
        createControlPanel();

        // 开始阅读循环
        setTimeout(() => {
            readNextTopic();
        }, 1000);
    }

    // 停止阅读
    function stopReading() {
        clearRunningState();
        updateStatus('已停止');
        createControlPanel();
    }

    // 返回列表页面
    function backToList() {
        if (config.startUrl) {
            window.location.href = config.startUrl;
        } else {
            window.location.href = 'https://linux.do/latest';
        }
    }

    // 判断是否在话题列表页面
    function isTopicListPage() {
        const url = window.location.href;
        return url.includes('/latest') ||
               url.includes('/top') ||
               url.includes('/hot') ||
               url === 'https://linux.do/' ||
               url.includes('/c/') ||
               url.includes('/categories');
    }

    // 判断是否在话题页面
    function isTopicPage() {
        return window.location.href.includes('/t/topic/');
    }

    // 阅读下一个话题
    async function readNextTopic() {
        if (!config.isRunning) return;

        // 使用实际要阅读的话题数量进行判断
        if (config.currentCount >= config.actualTopicCount || config.currentIndex >= config.topicList.length) {
            const skipText = config.skipCount > 0 ? `（已跳过前 ${config.skipCount} 个话题）` : '';
            updateStatus(`阅读完成！${skipText}`, `${config.currentCount}/${config.actualTopicCount}`);
            clearRunningState();
            createControlPanel();
            // 自动返回列表页面
            setTimeout(() => {
                backToList();
            }, 2000);
            return;
        }

        const topicUrl = config.topicList[config.currentIndex];
        config.currentIndex++;
        config.currentCount++;

        updateStatus(`跳转到话题 ${config.currentCount}...`, `${config.currentCount}/${config.actualTopicCount}`);

        // 保存状态
        saveConfig();

        // 跳转到话题页面
        window.location.href = topicUrl;
    }

    // 改进的检查是否已滚动到页面底部函数
    function isScrolledToBottom() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 减少误差范围到30px，提高检测精度
        const threshold = 30;
        const isAtBottom = scrollTop + windowHeight >= documentHeight - threshold;

        console.log(`滚动检测: scrollTop=${scrollTop}, windowHeight=${windowHeight}, documentHeight=${documentHeight}, isAtBottom=${isAtBottom}`);

        return isAtBottom;
    }

    // 检查页面是否为短话题（内容较少）
    function isShortTopic() {
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        // 如果页面高度小于等于2倍窗口高度，认为是短话题
        const isShort = documentHeight <= windowHeight * 2;
        console.log(`短话题检测: documentHeight=${documentHeight}, windowHeight=${windowHeight}, isShort=${isShort}`);

        return isShort;
    }

    // 在话题页面自动滚动到底部
    async function autoScrollToBottom() {
        if (!config.isRunning || !isTopicPage()) return;

        // 获取当前话题ID并标记为已读
        const currentTopicId = extractTopicId(window.location.href);
        if (currentTopicId) {
            markTopicAsRead(currentTopicId);
            console.log(`标记话题 ${currentTopicId} 为已读`);
        }

        console.log('开始自动滚动，当前话题:', config.currentCount);

        updateStatus(`正在阅读话题 ${config.currentCount}...`, `${config.currentCount}/${config.actualTopicCount}`);

        // 等待页面加载
        await sleep(2000);

        // 检查是否为短话题
        const isShort = isShortTopic();
        if (isShort) {
            console.log('检测到短话题，将使用快速阅读模式');
        }

        // 获取页面高度信息
        let scrollHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollStep = Math.max(windowHeight / 3, 200); // 每次滚动至少200px
        let currentScroll = window.pageYOffset;

        // 先滚动到顶部
        window.scrollTo(0, 0);
        await sleep(500);

        // 记录开始滚动的时间
        const startTime = Date.now();
        let hasReachedBottom = false;
        let consecutiveBottomChecks = 0; // 连续检测到底部的次数

        // 逐步滚动到底部
        while (currentScroll < scrollHeight - windowHeight && config.isRunning && !hasReachedBottom) {
            currentScroll += scrollStep;
            window.scrollTo({
                top: Math.min(currentScroll, scrollHeight),
                behavior: 'smooth'
            });

            await sleep(config.scrollSpeed);

            // 重新获取页面高度，因为可能有动态内容加载
            scrollHeight = document.documentElement.scrollHeight;

            // 检查是否已经滚动到底部
            if (isScrolledToBottom()) {
                consecutiveBottomChecks++;
                console.log(`连续检测到底部 ${consecutiveBottomChecks} 次`);

                // 连续3次检测到底部才确认真的到底了
                if (consecutiveBottomChecks >= 3) {
                    hasReachedBottom = true;
                    console.log('确认已滚动到底部，准备跳转');
                    break;
                }
            } else {
                consecutiveBottomChecks = 0; // 重置计数器
            }
        }

        // 确保滚动到最底部
        if (!hasReachedBottom) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
            await sleep(1000);

            // 最后再检查一次是否到底部
            if (isScrolledToBottom()) {
                hasReachedBottom = true;
                console.log('最终确认已滚动到底部');
            }
        }

        // 计算已经花费的时间
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, config.readSpeed - elapsedTime);

        // 如果已经滚动到底部，根据话题长度决定等待时间
        let waitTime;
        if (hasReachedBottom) {
            if (isShort) {
                // 短话题：最少等待1秒，最多等待3秒
                waitTime = Math.max(1000, Math.min(3000, remainingTime));
            } else {
                // 长话题：最少等待2秒
                waitTime = Math.max(2000, remainingTime);
            }
        } else {
            // 没有到底部，等待完整的阅读时间
            waitTime = remainingTime;
        }

        console.log(`滚动完成，等待 ${waitTime/1000} 秒后跳转到下一个话题`);

        await sleep(waitTime);

        // 继续下一个话题
        if (config.isRunning) {
            updateStatus('准备下一个话题...');
            setTimeout(() => {
                readNextTopic();
            }, 1000);
        }
    }

    // 工具函数：延时
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 页面加载完成后初始化
    function init() {
        console.log('LinuxDo自动阅读器初始化，当前URL:', window.location.href);
        console.log('运行状态:', config.isRunning, '当前话题:', config.currentCount);
        console.log('已阅读话题数量:', config.readTopicIds.length);
        console.log('跳过话题数量:', config.skipCount);
        console.log('实际要阅读话题数量:', config.actualTopicCount);

        // 等待页面完全加载
        setTimeout(() => {
            createControlPanel();

            // 如果在话题页面且正在运行，开始滚动
            if (config.isRunning && isTopicPage()) {
                console.log('检测到正在运行且在话题页面，开始自动滚动');
                setTimeout(autoScrollToBottom, 1000);
            }
        }, 1000);
    }

    // 监听页面变化（用于SPA应用）
    let lastUrl = location.href;
    function checkForUrlChange() {
        const url = location.href;
        if (url !== lastUrl) {
            console.log('页面URL变化:', lastUrl, '->', url);
            lastUrl = url;

            // 页面变化后重新初始化
            setTimeout(() => {
                init();
            }, 1500);
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 定期检查URL变化
    setInterval(checkForUrlChange, 1000);

    // 监听DOM变化，但更加谨慎
    const observer = new MutationObserver(() => {
        // 如果控制面板不存在，重新创建
        if (!document.getElementById('linuxdo-auto-reader-panel')) {
            setTimeout(() => {
                try {
                    createControlPanel();
                } catch (error) {
                    console.log('创建控制面板时出错:', error);
                }
            }, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: false // 只监听直接子元素变化，减少性能开销
    });

    console.log('LinuxDo自动阅读器脚本已加载');

})();


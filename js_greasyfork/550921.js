// ==UserScript==
// @name         终极后台自动阅读脚本
// @namespace    http://tampermonkey.net/
// @version      3.6.1
// @description  使用最激进的方法强制后台运行，支持真人操作模拟，性能优化版
// @author       You
// @match        https://linux.do/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550921/%E7%BB%88%E6%9E%81%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550921/%E7%BB%88%E6%9E%81%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================
    // 🚫 终极 beforeunload 禁用系统
    // 必须在脚本最开始执行，在网站代码之前拦截
    // ========================================
    (function disableBeforeUnloadCompletely() {
        console.log('🔒 启动终极 beforeunload 禁用系统...');

        // 1. 立即清除现有的 beforeunload 处理器
        window.onbeforeunload = null;
        window.onunload = null;

        // 2. 拦截 window.onbeforeunload 属性的设置
        try {
            Object.defineProperty(window, 'onbeforeunload', {
                get: function () {
                    return null;
                },
                set: function (value) {
                    console.log('🚫 已阻止设置 window.onbeforeunload');
                    // 完全忽略设置
                },
                configurable: false,
                enumerable: true
            });
            console.log('✅ 已拦截 window.onbeforeunload 属性');
        } catch (e) {
            console.warn('⚠️ 无法拦截 onbeforeunload 属性:', e);
        }

        // 3. 拦截 window.onunload 属性的设置
        try {
            Object.defineProperty(window, 'onunload', {
                get: function () {
                    return null;
                },
                set: function (value) {
                    console.log('🚫 已阻止设置 window.onunload');
                },
                configurable: false,
                enumerable: true
            });
            console.log('✅ 已拦截 window.onunload 属性');
        } catch (e) {
            console.warn('⚠️ 无法拦截 onunload 属性:', e);
        }

        // 4. 拦截 addEventListener 方法，过滤 beforeunload 和 unload 事件
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (type === 'beforeunload' || type === 'unload') {
                console.log(`🚫 已阻止添加 ${type} 事件监听器`);
                return; // 完全忽略这些事件的监听器
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
        console.log('✅ 已拦截 addEventListener 方法');

        // 5. 拦截 removeEventListener 方法（防止移除我们的拦截）
        const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.removeEventListener = function (type, listener, options) {
            if (type === 'beforeunload' || type === 'unload') {
                console.log(`🚫 已阻止移除 ${type} 事件监听器`);
                return;
            }
            return originalRemoveEventListener.call(this, type, listener, options);
        };
        console.log('✅ 已拦截 removeEventListener 方法');

        // 6. 定期强制清除（作为备份机制）
        setInterval(() => {
            try {
                if (window.onbeforeunload !== null) {
                    window.onbeforeunload = null;
                    console.log('🔄 定期清除：已重置 window.onbeforeunload');
                }
                if (window.onunload !== null) {
                    window.onunload = null;
                    console.log('🔄 定期清除：已重置 window.onunload');
                }
            } catch (e) {
                // 忽略错误
            }
        }, 1000); // 每1秒检查一次

        console.log('✅ 终极 beforeunload 禁用系统已启动');
    })();

    // ========================================
    // 📋 配置常量
    // ========================================
    const CONFIG = {
        DEBUG_MODE: false, // 调试模式：true=详细日志，false=精简日志
        AUTO_SAVE_INTERVAL: 10000, // 自动保存间隔（毫秒）
        STATUS_UPDATE_INTERVAL: 3000, // 状态更新间隔（毫秒）
        KEEP_ALIVE_INTERVAL: 3000, // 保活检查间隔（毫秒）
        BACKGROUND_CHECK_INTERVAL: 5000, // 后台检查间隔（毫秒）
        BACK_COOLDOWN: 3000, // 返回操作冷却时间（毫秒）
        VISITED_POST_EXPIRE: 3600000, // 访问记录过期时间（1小时）
        OLD_RECORD_CLEANUP: 86400000, // 旧记录清理时间（24小时）
        SCROLL_RESTART_TIMEOUT: 10000, // 滚动重启超时（毫秒）
        MAIN_INTERVAL_TICK: 1000, // 主定时器间隔（毫秒）
        LOAD_MORE_WAIT_TIME: 2000, // 等待加载更多内容的时间（毫秒）
        LOAD_MORE_COOLDOWN: 5000, // 加载更多操作冷却时间（毫秒）
    };

    // 日志辅助函数
    const log = {
        debug: (...args) => CONFIG.DEBUG_MODE && console.log(...args),
        info: (...args) => console.log(...args),
        warn: (...args) => console.warn(...args),
        error: (...args) => console.error(...args)
    };

    // ========================================
    // 🔧 状态变量
    // ========================================
    let isRunning = false;
    let scrollCount = 0;
    let visitedPosts = new Map();
    let mainInterval = null;
    let scrollInterval = null;

    // 时间戳记录
    let lastScrollTime = 0;
    let lastStatusUpdate = 0;
    let lastKeepAlive = 0;
    let lastBackgroundCheck = 0;
    let lastBackTime = 0;
    let lastStatsSave = 0;
    let lastLoadMoreTime = 0; // 上次加载更多的时间

    // 统计数据
    let totalRunTime = 0;
    let sessionStartTime = null;
    let totalVisitedPostsCount = 0;

    // 数据变化标记（用于优化保存）
    let statsChanged = false;

    // 新增：活动状态管理
    let currentActivity = {
        action: '待机中',
        icon: '⏸️',
        timestamp: Date.now(),
        details: ''
    };

    /**
     * 更新当前活动状态
     * @param {string} action - 活动名称
     * @param {string} icon - 活动图标
     * @param {string} details - 详细信息
     */
    function updateActivity(action, icon = '🔄', details = '') {
        currentActivity = {
            action: action,
            icon: icon,
            timestamp: Date.now(),
            details: details
        };

        // 立即更新UI显示
        const activityEl = document.getElementById('current-activity');
        const activityIconEl = document.getElementById('activity-icon');
        const activityTextEl = document.getElementById('activity-text');

        if (activityEl && activityIconEl && activityTextEl) {
            activityIconEl.textContent = icon;
            activityTextEl.textContent = action;
            if (details) {
                activityTextEl.title = details;
            }
        }
    }

    /**
     * 导航前准备：保存数据并禁用 beforeunload
     * @param {string} context - 导航上下文（用于日志）
     */
    function prepareForNavigation(context = '导航') {
        // 强制保存统计数据
        saveStats(true);
        log.debug(`💾 ${context}前保存统计数据`);

        // 确保 beforeunload 已禁用
        try {
            window.onbeforeunload = null;
        } catch (e) {
            log.error('禁用 beforeunload 失败:', e);
        }
    }

    /**
     * 检查帖子是否最近访问过
     * @param {string} href - 帖子链接
     * @returns {boolean} 是否最近访问过
     */
    function isRecentlyVisited(href) {
        const lastVisit = visitedPosts.get(href);
        if (!lastVisit) return false;
        return (Date.now() - lastVisit) < CONFIG.VISITED_POST_EXPIRE;
    }

    /**
     * 添加访问记录
     * @param {string} href - 帖子链接
     */
    function addVisitedPost(href) {
        // 只有当这是新访问的帖子时才增加计数
        if (!visitedPosts.has(href)) {
            totalVisitedPostsCount++;
            statsChanged = true; // 标记数据已变化
        }

        visitedPosts.set(href, Date.now());

        // 清理超过24小时的记录，避免内存泄漏
        const oneDayAgo = Date.now() - CONFIG.OLD_RECORD_CLEANUP;
        for (const [url, timestamp] of visitedPosts.entries()) {
            if (timestamp < oneDayAgo) {
                visitedPosts.delete(url);
            }
        }
    }

    /**
     * 获取动态进入频率（根据可用链接数量调整）
     * @returns {number} 进入频率（每N次滚动尝试一次）
     */
    function getDynamicEnterFrequency() {
        const availableLinks = getPostLinks().length;

        if (availableLinks > 15) return 2;
        if (availableLinks > 8) return 3;
        if (availableLinks > 3) return 5;
        if (availableLinks > 0) return 8;
        return 15;
    }

    // ========================================
    // 🎭 真人操作模拟配置
    // ========================================
    let humanSimulation = {
        baseScrollInterval: 800,
        baseScrollDistance: 150,
        randomFactor: 0.3,
        pauseChance: 0.05,
        pauseDuration: [1000, 3000],
        nextPauseTime: 0,
        isInPause: false
    };

    // ========================================
    // 💾 状态持久化管理
    // ========================================
    const STATE_KEYS = {
        RUNNING: 'ultimate-reader-running',
        SETTINGS: 'ultimate-reader-settings',
        STATS: 'ultimate-reader-stats',
        PANEL_POSITION: 'ultimate-reader-panel-position',
        PANEL_COLLAPSED: 'ultimate-reader-panel-collapsed'
    };

    // 保存运行状态
    function saveRunningState(running) {
        try {
            localStorage.setItem(STATE_KEYS.RUNNING, JSON.stringify({
                isRunning: running,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.log('保存运行状态失败:', e);
        }
    }

    // 获取运行状态
    function getRunningState() {
        try {
            const data = localStorage.getItem(STATE_KEYS.RUNNING);
            if (data) {
                const state = JSON.parse(data);
                // 如果状态超过1小时，认为已过期
                if (Date.now() - state.timestamp < 3600000) {
                    return state.isRunning;
                }
            }
        } catch (e) {
            console.log('读取运行状态失败:', e);
        }
        return false;
    }

    // 保存用户设置
    function saveSettings() {
        try {
            const settings = {
                scrollInterval: humanSimulation.baseScrollInterval,
                scrollDistance: humanSimulation.baseScrollDistance,
                timestamp: Date.now()
            };
            localStorage.setItem(STATE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.log('保存设置失败:', e);
        }
    }

    // 加载用户设置
    function loadSettings() {
        try {
            const data = localStorage.getItem(STATE_KEYS.SETTINGS);
            if (data) {
                const settings = JSON.parse(data);
                humanSimulation.baseScrollInterval = settings.scrollInterval || 800;
                humanSimulation.baseScrollDistance = settings.scrollDistance || 150;
                return settings;
            }
        } catch (e) {
            console.log('读取设置失败:', e);
        }
        return null;
    }

    /**
     * 保存统计数据到 localStorage
     * @param {boolean} force - 是否强制保存（忽略变化标记）
     */
    function saveStats(force = false) {
        // 性能优化：只在数据变化或强制保存时才执行
        if (!force && !statsChanged) {
            log.debug('📊 数据未变化，跳过保存');
            return;
        }

        try {
            // 将 visitedPosts Map 转换为数组以便保存
            const visitedPostsArray = Array.from(visitedPosts.entries());

            const stats = {
                totalRunTime: totalRunTime,
                totalVisitedPostsCount: totalVisitedPostsCount,
                scrollCount: scrollCount,
                visitedPosts: visitedPostsArray, // 保存访问记录
                timestamp: Date.now()
            };
            localStorage.setItem(STATE_KEYS.STATS, JSON.stringify(stats));

            // 重置变化标记
            statsChanged = false;

            log.debug('💾 已保存统计数据:', {
                totalRunTime: formatDuration(totalRunTime),
                scrollCount: scrollCount,
                totalVisitedPostsCount: totalVisitedPostsCount,
                visitedPostsCount: visitedPosts.size
            });
        } catch (e) {
            log.error('保存统计数据失败:', e);
        }
    }

    /**
     * 从 localStorage 加载统计数据
     * @returns {Object|null} 加载的统计数据对象，失败返回 null
     */
    function loadStats() {
        try {
            const data = localStorage.getItem(STATE_KEYS.STATS);
            if (data) {
                const stats = JSON.parse(data);
                totalRunTime = stats.totalRunTime || 0;
                scrollCount = stats.scrollCount || 0;
                totalVisitedPostsCount = stats.totalVisitedPostsCount || 0;

                // 恢复 visitedPosts Map，并清理过期记录
                if (stats.visitedPosts && Array.isArray(stats.visitedPosts)) {
                    const oneDayAgo = Date.now() - CONFIG.OLD_RECORD_CLEANUP;
                    visitedPosts.clear();

                    stats.visitedPosts.forEach(([url, timestamp]) => {
                        // 只恢复24小时内的记录
                        if (timestamp > oneDayAgo) {
                            visitedPosts.set(url, timestamp);
                        }
                    });

                    log.info('📊 已恢复访问记录:', visitedPosts.size, '条');
                }

                log.info('📊 已加载统计数据:', {
                    totalRunTime: formatDuration(totalRunTime),
                    scrollCount: scrollCount,
                    totalVisitedPostsCount: totalVisitedPostsCount,
                    visitedPostsCount: visitedPosts.size
                });
                return stats;
            }
        } catch (e) {
            log.error('读取统计数据失败:', e);
        }
        return null;
    }

    // 真人操作模拟：生成随机间隔
    function getRandomInterval(baseInterval) {
        const factor = humanSimulation.randomFactor;
        const min = baseInterval * (1 - factor);
        const max = baseInterval * (1 + factor);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 真人操作模拟：生成随机滚动距离
    function getRandomScrollDistance(baseDistance) {
        const factor = humanSimulation.randomFactor;
        const min = baseDistance * (1 - factor);
        const max = baseDistance * (1 + factor);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 真人操作模拟：检查是否需要暂停
    function shouldPause() {
        const now = Date.now();
        if (now >= humanSimulation.nextPauseTime && Math.random() < humanSimulation.pauseChance) {
            const pauseDuration = Math.floor(Math.random() *
                (humanSimulation.pauseDuration[1] - humanSimulation.pauseDuration[0] + 1)) +
                humanSimulation.pauseDuration[0];

            humanSimulation.isInPause = true;
            humanSimulation.nextPauseTime = now + pauseDuration + Math.random() * 10000 + 5000; // 下次暂停至少5-15秒后

            console.log(`😴 模拟真人暂停 ${pauseDuration}ms`);

            setTimeout(() => {
                humanSimulation.isInPause = false;
                console.log('😊 继续操作');
            }, pauseDuration);

            return true;
        }
        return false;
    }

    // 终极保活方法
    function ultimateKeepAlive() {
        // 1. 重写所有页面可见性API
        const originalHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden') ||
            Object.getOwnPropertyDescriptor(document, 'hidden');

        Object.defineProperty(document, 'hidden', {
            get: () => false,
            configurable: true,
            enumerable: true
        });

        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: true,
            enumerable: true
        });

        // 2. 阻止所有可能暂停的事件（不包括 beforeunload/unload，已在脚本开头处理）
        const events = ['visibilitychange', 'blur', 'focus', 'pagehide', 'pageshow'];
        events.forEach(event => {
            window.addEventListener(event, (e) => {
                e.stopImmediatePropagation();
                e.preventDefault();
            }, { capture: true, passive: false });

            document.addEventListener(event, (e) => {
                e.stopImmediatePropagation();
                e.preventDefault();
            }, { capture: true, passive: false });
        });

        // 注意：beforeunload/unload 的禁用已在脚本开头的全局拦截器中处理

        // 3. 创建持续的音频上下文
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            gainNode.gain.setValueAtTime(0.001, audioContext.currentTime); // 极小音量
            oscillator.frequency.setValueAtTime(20000, audioContext.currentTime);
            oscillator.start();

            console.log('🔊 音频上下文已创建');
        } catch (e) {
            console.log('音频创建失败:', e);
        }

        // 4. 创建WebRTC连接保持活跃
        try {
            const pc = new RTCPeerConnection();
            const dc = pc.createDataChannel('keepalive');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            console.log('📡 WebRTC连接已创建');
        } catch (e) {
            console.log('WebRTC创建失败:', e);
        }

        // 5. 预创建事件对象，避免重复创建
        const keepAliveEvents = [
            new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: 5,
                clientY: 5
            }),
            new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: 1,
                clientY: 1
            })
        ];

        // 主定时器 - 合并所有功能
        mainInterval = setInterval(() => {
            const now = Date.now();

            // 保活功能
            if (now - lastKeepAlive >= CONFIG.KEEP_ALIVE_INTERVAL) {
                lastKeepAlive = now;

                // 网络请求保活
                fetch('/srv/status', { method: 'HEAD' }).catch(() => { });

                // 分发预创建的事件
                keepAliveEvents.forEach(event => {
                    document.dispatchEvent(event);
                });

                // 只在页面隐藏时输出日志
                if (document.hidden) {
                    log.warn('⚠️ 页面隐藏，强制保持活跃');
                    Object.defineProperty(document, 'hidden', {
                        get: () => false,
                        configurable: true,
                        enumerable: true
                    });
                }
            }

            // 后台检测
            if (now - lastBackgroundCheck >= CONFIG.BACKGROUND_CHECK_INTERVAL) {
                lastBackgroundCheck = now;

                const timeSinceLastScroll = now - lastScrollTime;

                // 如果超过指定时间没有滚动，重新启动
                if (isRunning && timeSinceLastScroll > CONFIG.SCROLL_RESTART_TIMEOUT) {
                    log.warn('⚠️ 滚动停止，重新启动');

                    // 清理旧的定时器
                    if (scrollInterval) {
                        clearTimeout(scrollInterval);
                        scrollInterval = null;
                    }

                    // 重新启动滚动调度
                    function scheduleNextScroll() {
                        if (!isRunning) return;

                        const randomInterval = getRandomInterval(humanSimulation.baseScrollInterval);
                        scrollInterval = setTimeout(() => {
                            if (!isRunning) return;
                            doScroll();
                            scheduleNextScroll();
                        }, randomInterval);
                    }

                    scheduleNextScroll();
                }
            }

            // 状态更新
            if (now - lastStatusUpdate >= CONFIG.STATUS_UPDATE_INTERVAL) {
                lastStatusUpdate = now;
                updateStatus();
            }

            // 自动保存统计数据（仅在运行时且数据有变化时）
            if (now - lastStatsSave >= CONFIG.AUTO_SAVE_INTERVAL) {
                lastStatsSave = now;
                if (isRunning) {
                    saveStats(); // 会自动检查 statsChanged 标记
                    log.debug('💾 自动保存统计数据');
                }
            }
        }, CONFIG.MAIN_INTERVAL_TICK);

        console.log('🔒 终极保活系统已启动');
    }

    // 获取帖子链接 - 优化版本，缓存结果 + 智能选择
    let cachedLinks = null;
    let lastCacheTime = 0;
    const CACHE_DURATION = 5000; // 延长缓存到5秒

    // 优化的选择器 - 针对linux.do
    const OPTIMIZED_SELECTORS = [
        '.topic-list-item .main-link a.title',           // 主要帖子标题
        '.topic-list tbody tr .main-link a.title',       // 表格形式主链接
        '.topic-list tbody tr td a.title',               // 表格形式标题
        '.topic-list tr td a[href*="/t/"]',              // 表格中的帖子链接
        '[data-topic-id] .title a',                      // 带topic-id的链接
        'table tr td a[href*="/t/"]',                    // 通用表格帖子链接
        'a[href*="/t/"]'                                 // 兜底选择器
    ];

    function getPostLinks() {
        const now = Date.now();

        // 使用缓存结果
        if (cachedLinks && (now - lastCacheTime) < CACHE_DURATION) {
            return cachedLinks;
        }

        let links = [];
        for (const selector of OPTIMIZED_SELECTORS) {
            links = document.querySelectorAll(selector);
            if (links.length > 0) break;
        }

        const filteredLinks = Array.from(links).filter(link => {
            return link.href &&
                link.href.includes('/t/') &&
                !isRecentlyVisited(link.href) &&
                link.textContent.trim().length > 5;
        });

        // 缓存结果
        cachedLinks = filteredLinks;
        lastCacheTime = now;

        return filteredLinks;
    }

    // 智能帖子选择算法
    function calculatePostScore(link) {
        let score = 0;

        try {
            // 1. 回复数权重 (从相邻元素获取)
            const replyElement = link.closest('tr')?.querySelector('.posts, .num.posts, [title*="replies"], [title*="回复"]');
            if (replyElement) {
                const replyCount = parseInt(replyElement.textContent.trim()) || 0;
                score += Math.min(replyCount * 2, 20); // 最多20分
            }

            // 2. 标题长度权重 (适中长度更好)
            const titleLength = link.textContent.trim().length;
            if (titleLength >= 10 && titleLength <= 50) {
                score += 15; // 理想长度
            } else if (titleLength > 5) {
                score += Math.min(titleLength / 5, 10); // 其他长度
            }

            // 3. 活跃度权重 (从最后回复时间)
            const timeElement = link.closest('tr')?.querySelector('.relative-date, .age, time');
            if (timeElement) {
                const timeText = timeElement.textContent.trim();
                if (timeText.includes('分钟') || timeText.includes('小时') || timeText.includes('min') || timeText.includes('hour')) {
                    score += 10; // 最近活跃
                } else if (timeText.includes('天') || timeText.includes('day')) {
                    score += 5; // 近期活跃
                }
            }

            // 4. 避免过长标题 (可能是垃圾内容)
            if (titleLength > 100) {
                score -= 5;
            }

            // 5. 特殊标记加分
            const titleText = link.textContent.trim().toLowerCase();
            if (titleText.includes('教程') || titleText.includes('分享') || titleText.includes('tutorial') || titleText.includes('guide')) {
                score += 8; // 教程类内容
            }

        } catch (e) {
            // 如果获取信息失败，给予基础分数
            score = 5;
        }

        return Math.max(score, 1); // 最低1分
    }

    // 智能选择最佳帖子
    function selectBestPost(links) {
        if (links.length === 0) return null;
        if (links.length === 1) return links[0];

        // 计算每个帖子的分数
        const scoredLinks = links.map(link => ({
            element: link,
            score: calculatePostScore(link)
        }));

        // 按分数排序
        scoredLinks.sort((a, b) => b.score - a.score);

        // 从前30%中随机选择，保持一定随机性
        const topCount = Math.max(1, Math.ceil(scoredLinks.length * 0.3));
        const topLinks = scoredLinks.slice(0, topCount);
        const selected = topLinks[Math.floor(Math.random() * topLinks.length)];

        console.log(`🎯 智能选择: 分数${selected.score}, 标题: ${selected.element.textContent.trim().substring(0, 30)}...`);

        return selected.element;
    }

    // 进入帖子 - 智能选择版本
    function enterPost() {
        const links = getPostLinks();
        if (links.length === 0) {
            updateActivity('等待新内容', '⏳', '暂无可访问的帖子链接');
            return false;
        }

        updateActivity('分析帖子质量', '🧠', `正在从${links.length}个帖子中智能选择`);

        const selectedLink = selectBestPost(links);
        if (!selectedLink) {
            updateActivity('选择失败', '❌', '未能找到合适的帖子');
            return false;
        }

        const title = selectedLink.textContent.trim().substring(0, 30);
        updateActivity('进入优质帖子', '📖', `正在进入：${title}...`);

        log.info(`🎯 智能进入: ${title}...`);

        // 导航前准备
        prepareForNavigation('进入帖子');

        addVisitedPost(selectedLink.href);
        selectedLink.click();
        return true;
    }

    // 检测页面类型
    function getPageType() {
        return window.location.href.includes('/t/') && window.location.href.match(/\/\d+$/) ? 'post' : 'list';
    }

    /**
     * 尝试加载更多主题（翻页功能）
     * @returns {Promise<boolean>} 是否成功触发加载
     */
    async function loadMoreTopics() {
        const now = Date.now();

        // 检查冷却时间
        if (now - lastLoadMoreTime < CONFIG.LOAD_MORE_COOLDOWN) {
            const remainingSeconds = Math.ceil((CONFIG.LOAD_MORE_COOLDOWN - (now - lastLoadMoreTime)) / 1000);
            log.debug(`⏳ 加载更多冷却中，还需等待 ${remainingSeconds} 秒`);
            return false;
        }

        updateActivity('加载更多主题', '📄', '正在尝试加载下一页内容');
        log.info('📄 尝试加载更多主题...');

        // 记录当前帖子数量
        const beforeCount = document.querySelectorAll('a[href*="/t/"]').length;

        // 尝试多种加载更多的方法
        let loadTriggered = false;

        // 方法1: 查找并点击"加载更多"按钮
        const loadMoreSelectors = [
            'button.load-more',
            '.load-more-topics',
            '[data-ember-action*="loadMore"]',
            'button:contains("加载更多")',
            'button:contains("Load More")',
            '.btn-load-more'
        ];

        for (const selector of loadMoreSelectors) {
            try {
                const button = document.querySelector(selector);
                if (button && button.offsetParent !== null) { // 确保按钮可见
                    log.info(`🔘 找到加载更多按钮: ${selector}`);
                    button.click();
                    loadTriggered = true;
                    break;
                }
            } catch (e) {
                // 继续尝试下一个选择器
            }
        }

        // 方法2: 如果没有找到按钮，尝试滚动到页面最底部触发无限滚动
        if (!loadTriggered) {
            log.info('📜 尝试滚动到底部触发无限滚动');
            window.scrollTo(0, document.documentElement.scrollHeight);
            loadTriggered = true;
        }

        if (loadTriggered) {
            lastLoadMoreTime = now;

            // 等待内容加载
            updateActivity('等待内容加载', '⏳', `等待 ${CONFIG.LOAD_MORE_WAIT_TIME / 1000} 秒`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.LOAD_MORE_WAIT_TIME));

            // 检查是否有新内容
            const afterCount = document.querySelectorAll('a[href*="/t/"]').length;
            const newPostsCount = afterCount - beforeCount;

            if (newPostsCount > 0) {
                log.info(`✅ 成功加载 ${newPostsCount} 个新帖子`);
                updateActivity('加载成功', '✅', `新增 ${newPostsCount} 个帖子`);

                // 清除缓存，强制重新获取链接
                cachedLinks = null;
                lastCacheTime = 0;

                return true;
            } else {
                log.warn('⚠️ 未检测到新内容，可能已到达列表末尾');
                updateActivity('无更多内容', '⚠️', '可能已到达列表末尾');
                return false;
            }
        }

        return false;
    }

    // 执行滚动 - 智能加速版本 + 真人操作模拟 + 自动翻页
    async function doScroll() {
        if (!isRunning) return;

        // 检查是否需要暂停（真人操作模拟）
        if (humanSimulation.isInPause) {
            updateActivity('暂停思考中', '😴', '模拟真人暂停，增强真实感');
            return; // 暂停中，跳过本次滚动
        }

        if (shouldPause()) {
            return; // 开始暂停，跳过本次滚动
        }

        // 更新最后滚动时间
        lastScrollTime = Date.now();

        scrollCount++;
        statsChanged = true; // 标记数据已变化
        const pageType = getPageType();

        // 更新活动状态
        updateActivity('智能滚动中', '📜', `第${scrollCount}次滚动，页面类型：${pageType}`);

        // 只在每10次滚动时输出日志，减少日志频率
        if (scrollCount % 10 === 0) {
            const time = new Date().toLocaleTimeString();
            console.log(`🔄 [${time}] 滚动#${scrollCount} [${pageType}]`);
        }

        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 智能滚动距离：列表页面更快，帖子页面适中
        let scrollDistance = humanSimulation.baseScrollDistance; // 使用基础距离

        // 获取用户设置的滚动距离
        const distanceSlider = document.getElementById('distance-slider');
        if (distanceSlider) {
            scrollDistance = parseInt(distanceSlider.value);
            humanSimulation.baseScrollDistance = scrollDistance; // 更新基础距离
        }

        if (pageType === 'list') {
            scrollDistance = Math.min(scrollDistance * 1.3, 300); // 列表页面更快，但不超过300px
        } else if (pageType === 'post') {
            scrollDistance = Math.min(scrollDistance * 0.7, 200); // 帖子页面适中，但不超过200px
        }

        // 应用真人操作模拟：随机滚动距离
        scrollDistance = getRandomScrollDistance(scrollDistance);

        // 智能底部检测 - 提前触发避免浪费滚动
        const distanceToBottom = documentHeight - (scrollTop + windowHeight);
        const isNearBottom = distanceToBottom <= 200; // 提前200px检测

        if (isNearBottom) {
            console.log(`📍 接近页面底部 (距离: ${distanceToBottom}px)`);

            if (pageType === 'list') {
                // 列表页面底部：先检查是否有未访问的帖子
                const availableLinks = getPostLinks();

                if (availableLinks.length === 0) {
                    // 没有未访问的帖子，尝试加载更多
                    log.info('📄 当前页面无未访问帖子，尝试加载更多...');
                    updateActivity('加载下一页', '📄', '当前页面已全部访问，加载新内容');

                    const loadSuccess = await loadMoreTopics();

                    if (loadSuccess) {
                        // 加载成功，重新检查链接
                        const newLinks = getPostLinks();
                        if (newLinks.length > 0) {
                            log.info(`✅ 加载成功，发现 ${newLinks.length} 个新帖子`);
                            updateActivity('发现新帖子', '🎉', `找到 ${newLinks.length} 个未访问的帖子`);
                            // 继续滚动，下次循环会尝试进入帖子
                            return;
                        }
                    } else {
                        log.warn('⚠️ 加载更多失败或无更多内容');
                    }
                }

                // 有未访问的帖子，或加载失败后，尝试进入帖子
                updateActivity('寻找优质帖子', '🔍', '页面底部，准备进入帖子');
                if (enterPost()) {
                    scrollCount = 0;
                    return;
                }
            } else {
                // 添加返回操作的冷却时间检查
                const now = Date.now();
                const timeSinceLastBack = now - lastBackTime;

                if (timeSinceLastBack < CONFIG.BACK_COOLDOWN) {
                    const remainingSeconds = Math.ceil((CONFIG.BACK_COOLDOWN - timeSinceLastBack) / 1000);
                    updateActivity('等待返回冷却', '⏳', `距离上次返回${remainingSeconds}秒`);
                    return;
                }

                updateActivity('返回帖子列表', '🔙', '帖子阅读完成，返回列表');
                log.info('📖 返回列表');

                lastBackTime = now;

                // 导航前准备
                prepareForNavigation('返回列表');

                // 尝试多种返回方法
                try {
                    // 方法1: 使用history.back()
                    window.history.back();

                    // 方法2: 如果3秒后仍在同一页面，尝试直接跳转
                    setTimeout(() => {
                        const currentPageType = getPageType();
                        if (currentPageType === 'post') {
                            log.warn('🔄 返回失败，尝试直接跳转到主页');
                            updateActivity('强制返回主页', '🏠', '常规返回失败，直接跳转');

                            // 导航前准备
                            prepareForNavigation('强制跳转');

                            // 尝试跳转到主页或分类页面
                            const currentUrl = window.location.href;
                            const baseUrl = currentUrl.split('/t/')[0];
                            window.location.href = baseUrl + '/latest';
                        }
                    }, CONFIG.BACK_COOLDOWN);

                } catch (e) {
                    console.log('返回操作失败:', e);
                    updateActivity('返回失败', '❌', '返回操作出现错误');
                }

                scrollCount = 0;
                return;
            }
        }

        // 尝试进入帖子 - 列表页面使用动态频率
        if (pageType === 'list') {
            const enterFrequency = getDynamicEnterFrequency();
            const tryEnterInterval = scrollCount % enterFrequency === 0;
            if (tryEnterInterval) {
                updateActivity('智能选择帖子', '🎯', `每${enterFrequency}次滚动尝试进入帖子`);
                if (enterPost()) {
                    scrollCount = 0;
                    return;
                }
            }
        }

        // 执行智能滚动（带随机性）
        window.scrollBy(0, scrollDistance);
    }

    // ========================================
    // 🚀 启动/停止控制
    // ========================================

    /**
     * 启动自动阅读
     */
    function startReading() {
        if (isRunning) return;

        isRunning = true;

        // 记录本次会话启动时间
        sessionStartTime = Date.now();

        // 重置真人操作模拟状态
        humanSimulation.nextPauseTime = Date.now() + Math.random() * 10000 + 5000; // 5-15秒后可能暂停
        humanSimulation.isInPause = false;

        // 更新活动状态
        updateActivity('系统启动中', '🚀', '正在初始化智能阅读系统');

        // 保存运行状态
        saveRunningState(true);

        // 启动保活系统
        ultimateKeepAlive();

        // 启动滚动定时器 - 使用简单的单一定时器（支持异步）
        function scheduleNextScroll() {
            if (!isRunning) return;

            const randomInterval = getRandomInterval(humanSimulation.baseScrollInterval);
            scrollInterval = setTimeout(async () => {
                if (!isRunning) return;
                await doScroll(); // 支持异步滚动（翻页功能需要等待）
                scheduleNextScroll(); // 递归调度下一次滚动
            }, randomInterval);
        }

        scheduleNextScroll();

        // 立即更新按钮状态
        updateStatus();

        // 启动后更新活动状态
        setTimeout(() => {
            updateActivity('准备就绪', '✅', '智能阅读系统已启动，开始工作');
        }, 1000);

        console.log('🚀 终极后台自动阅读已启动');
        console.log('⚡ 使用真人操作模拟模式');
        console.log('🔒 终极保活系统运行中');
        console.log(`⏰ 启动时间: ${new Date(sessionStartTime).toLocaleTimeString()}`);
    }

    // 停止自动阅读 - 规范化版本
    /**
     * 停止自动阅读
     */
    function stopReading() {
        if (!isRunning) return;

        isRunning = false;

        // 更新活动状态
        updateActivity('系统停止中', '⏹️', '正在安全停止所有操作');

        // 记录运行时间
        if (sessionStartTime) {
            const sessionDuration = Date.now() - sessionStartTime;
            totalRunTime += sessionDuration;
            statsChanged = true; // 标记数据已变化

            log.info(`⏱️ 本次运行时长: ${formatDuration(sessionDuration)}`);
            log.info(`📊 累计运行时长: ${formatDuration(totalRunTime)}`);
        }

        // 保存运行状态和统计数据
        saveRunningState(false);
        saveStats(true); // 强制保存

        // 清理所有定时器
        if (scrollInterval) {
            clearTimeout(scrollInterval);
            scrollInterval = null;
        }

        if (mainInterval) {
            clearInterval(mainInterval);
            mainInterval = null;
        }

        // 重置状态
        sessionStartTime = null;
        humanSimulation.isInPause = false;
        lastBackTime = 0;

        // 立即更新按钮状态
        updateStatus();

        // 停止后更新活动状态
        updateActivity('待机中', '⏸️', '系统已停止，等待下次启动');

        console.log('⏹️ 自动阅读已停止');
    }

    // 格式化时长显示
    function formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}小时${minutes % 60}分钟${seconds % 60}秒`;
        } else if (minutes > 0) {
            return `${minutes}分钟${seconds % 60}秒`;
        } else {
            return `${seconds}秒`;
        }
    }

    // 保存面板位置
    function savePanelPosition(x, y) {
        try {
            localStorage.setItem(STATE_KEYS.PANEL_POSITION, JSON.stringify({ x, y }));
        } catch (e) {
            log.error('保存面板位置失败:', e);
        }
    }

    // 加载面板位置
    function loadPanelPosition() {
        try {
            const data = localStorage.getItem(STATE_KEYS.PANEL_POSITION);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            log.error('加载面板位置失败:', e);
        }
        return null;
    }

    // 保存面板折叠状态
    function savePanelCollapsed(collapsed) {
        try {
            localStorage.setItem(STATE_KEYS.PANEL_COLLAPSED, JSON.stringify(collapsed));
        } catch (e) {
            log.error('保存面板折叠状态失败:', e);
        }
    }

    // 加载面板折叠状态
    function loadPanelCollapsed() {
        try {
            const data = localStorage.getItem(STATE_KEYS.PANEL_COLLAPSED);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            log.error('加载面板折叠状态失败:', e);
        }
        return false;
    }

    // 创建现代化控制面板
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'ultimate-reader-panel';

        // 加载保存的位置，默认右下角
        const savedPosition = loadPanelPosition();
        let initialLeft, initialTop;

        if (savedPosition) {
            initialLeft = savedPosition.x;
            initialTop = savedPosition.y;
        } else {
            // 默认位置：右下角
            initialLeft = window.innerWidth - 340; // 320px宽度 + 20px边距
            initialTop = Math.max(20, window.innerHeight - 600); // 预估高度，至少距离顶部20px
        }

        // 确保面板在可见区域内
        initialLeft = Math.max(20, Math.min(initialLeft, window.innerWidth - 320));
        initialTop = Math.max(20, Math.min(initialTop, window.innerHeight - 100));

        console.log('📍 面板初始位置:', { left: initialLeft, top: initialTop, windowWidth: window.innerWidth, windowHeight: window.innerHeight });

        panel.style.cssText = `
            position: fixed;
            left: ${initialLeft}px;
            top: ${initialTop}px;
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 20px;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #2d3748;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2);
            min-width: 280px;
            max-width: 320px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255,255,255,0.3);
        `;

        panel.innerHTML = `
            <div id="panel-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.1); cursor: move;">
                <div style="display: flex; align-items: center;">
                    <div style="width: 8px; height: 8px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 50%; margin-right: 12px; animation: pulse 2s infinite;"></div>
                    <div style="font-weight: 600; font-size: 16px; color: #2d3748;">
                        ⚡ 智能阅读器
                    </div>
                </div>
                <button id="toggle-collapse" style="padding: 4px 8px; border: none; background: transparent; color: #64748b; cursor: pointer; font-size: 16px; transition: all 0.2s ease; border-radius: 6px;" title="折叠/展开">
                    ➖
                </button>
            </div>
            <div id="panel-content">

            <div style="margin-bottom: 16px;">
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <button id="ultimate-start" style="flex: 1; padding: 12px 16px; border: none; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                        🚀 启动
                    </button>
                    <button id="ultimate-stop" style="flex: 1; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 10px; background: white; color: #64748b; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.2s ease;">
                        ⏹️ 停止
                    </button>
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 8px;">滚动速度</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; color: #94a3b8;">快</span>
                    <input type="range" id="speed-slider" min="500" max="2000" value="800" step="100" style="flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; outline: none; appearance: none;">
                    <span style="font-size: 11px; color: #94a3b8;">慢</span>
                </div>
                <div style="text-align: center; font-size: 11px; color: #64748b; margin-top: 4px;">
                    <span id="speed-value">800ms</span>
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 8px;">滚动距离</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; color: #94a3b8;">小</span>
                    <input type="range" id="distance-slider" min="50" max="300" value="150" step="25" style="flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; outline: none; appearance: none;">
                    <span style="font-size: 11px; color: #94a3b8;">大</span>
                </div>
                <div style="text-align: center; font-size: 11px; color: #64748b; margin-top: 4px;">
                    <span id="distance-value">150px</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 6px; margin-bottom: 16px;">
                <button id="test-links" style="flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s ease;">
                    🔍 检查链接
                </button>
                <button id="test-enter" style="flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s ease;">
                    🎯 进入帖子
                </button>
                <button id="clear-visited" style="flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s ease;">
                    🗑️ 清空
                </button>
            </div>
            
            <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 12px; border: 1px solid #e2e8f0;">
                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                     <div style="text-align: center;">
                         <div style="font-size: 18px; font-weight: 600; color: #667eea;" id="scroll-count">0</div>
                         <div style="font-size: 10px; color: #64748b;">滚动次数</div>
                     </div>
                     <div style="text-align: center;">
                         <div style="font-size: 18px; font-weight: 600; color: #764ba2;" id="visited-count">0</div>
                         <div style="font-size: 10px; color: #64748b;">访问帖子</div>
                     </div>
                 </div>
                 
                 <!-- 新增：运行时间统计 -->
                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.05);">
                     <div style="text-align: center;">
                         <div style="font-size: 14px; font-weight: 600; color: #059669;" id="session-time">00:00</div>
                         <div style="font-size: 10px; color: #64748b;">本次运行</div>
                     </div>
                     <div style="text-align: center;">
                         <div style="font-size: 14px; font-weight: 600; color: #7c3aed;" id="total-time">00:00</div>
                         <div style="font-size: 10px; color: #64748b;">累计时间</div>
                     </div>
                 </div>
                 
                 <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                     <div>
                         <span style="color: #64748b;">页面:</span>
                         <span id="page-type" style="font-weight: 500; color: #2d3748;">未知</span>
                     </div>
                     <div>
                         <span id="status" style="font-weight: 500; color: #e53e3e;">已停止</span>
                     </div>
                 </div>
                 
                 <!-- 新增：启动时间显示 -->
                 <div id="start-time-info" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.05); font-size: 10px; color: #64748b; text-align: center; display: none;">
                     启动于: <span id="start-time-display">--:--</span>
                 </div>
                 
                 <!-- 新增：实时活动日志 -->
                 <div id="current-activity" style="margin-top: 8px; padding: 8px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; border-left: 3px solid #3b82f6;">
                     <div style="display: flex; align-items: center; gap: 6px;">
                         <span id="activity-icon" style="font-size: 12px;">⏸️</span>
                         <span id="activity-text" style="font-size: 11px; color: #1e40af; font-weight: 500;">待机中</span>
                     </div>
                 </div>
             </div>
            
            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                #ultimate-reader-panel button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
                }
                
                #ultimate-reader-panel button:active:not(:disabled) {
                    transform: translateY(0);
                }
                
                #ultimate-reader-panel button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none !important;
                    box-shadow: none !important;
                }
                
                #ultimate-start:disabled {
                    background: #e2e8f0 !important;
                    color: #94a3b8 !important;
                }
                
                #ultimate-stop:disabled {
                    background: #f8fafc !important;
                    color: #cbd5e1 !important;
                    border-color: #f1f5f9 !important;
                }
                
                #ultimate-reader-panel input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
                
                #ultimate-reader-panel input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
            </style>
            </div>
        `;

        document.body.appendChild(panel);

        // ========================================
        // 拖动功能
        // ========================================
        let isDragging = false;
        let currentX;
        let currentY;
        let offsetX;
        let offsetY;

        const header = document.getElementById('panel-header');

        if (header) {
            log.debug('✅ 拖动功能已初始化');

            header.addEventListener('mousedown', (e) => {
                // 如果点击的是折叠按钮，不触发拖动
                if (e.target.id === 'toggle-collapse' || e.target.closest('#toggle-collapse')) {
                    return;
                }

                isDragging = true;

                // 计算鼠标相对于面板的偏移
                const rect = panel.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                header.style.cursor = 'grabbing';
                panel.style.transition = 'none'; // 拖动时禁用过渡动画

                log.debug('🖱️ 开始拖动面板');
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                e.preventDefault();

                // 计算新位置
                currentX = e.clientX - offsetX;
                currentY = e.clientY - offsetY;

                // 确保面板不会被拖出视口
                const maxX = window.innerWidth - panel.offsetWidth;
                const maxY = window.innerHeight - panel.offsetHeight;

                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                panel.style.left = currentX + 'px';
                panel.style.top = currentY + 'px';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    header.style.cursor = 'move';
                    panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

                    // 保存位置（使用 left 和 top）
                    const rect = panel.getBoundingClientRect();
                    savePanelPosition(rect.left, rect.top);

                    log.debug('💾 已保存面板位置:', { left: rect.left, top: rect.top });
                }
            });
        } else {
            log.error('❌ 无法找到 panel-header 元素，拖动功能未初始化');
        }

        // ========================================
        // 折叠功能
        // ========================================
        const toggleBtn = document.getElementById('toggle-collapse');
        const panelContent = document.getElementById('panel-content');
        let isCollapsed = loadPanelCollapsed();

        // 应用保存的折叠状态
        if (isCollapsed) {
            panelContent.style.display = 'none';
            toggleBtn.textContent = '➕';
            panel.style.minWidth = '200px';
        }

        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;

            if (isCollapsed) {
                panelContent.style.display = 'none';
                toggleBtn.textContent = '➕';
                panel.style.minWidth = '200px';
            } else {
                panelContent.style.display = 'block';
                toggleBtn.textContent = '➖';
                panel.style.minWidth = '280px';
            }

            savePanelCollapsed(isCollapsed);
        });

        // 事件绑定
        document.getElementById('ultimate-start').addEventListener('click', startReading);
        document.getElementById('ultimate-stop').addEventListener('click', stopReading);

        // 速度调节功能 - 修复版本
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        speedSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            speedValue.textContent = value + 'ms';

            // 直接更新基础间隔值
            humanSimulation.baseScrollInterval = value;

            // 保存设置
            saveSettings();

            console.log(`⚡ 滚动速度已调整为: ${value} ms`);
        });

        // 距离调节功能
        const distanceSlider = document.getElementById('distance-slider');
        const distanceValue = document.getElementById('distance-value');
        distanceSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            distanceValue.textContent = value + 'px';

            // 更新基础距离
            humanSimulation.baseScrollDistance = value;

            // 保存设置
            saveSettings();
        });

        // 测试功能
        document.getElementById('test-links').addEventListener('click', () => {
            const links = getPostLinks();
            console.log(`🔍 找到 ${links.length} 个帖子链接`);
            // 显示通知
            showNotification(`找到 ${links.length} 个帖子链接`, 'info');
        });

        document.getElementById('test-enter').addEventListener('click', () => {
            if (enterPost()) {
                showNotification('成功进入帖子', 'success');
            } else {
                showNotification('没有找到可进入的帖子', 'warning');
            }
        });

        document.getElementById('clear-visited').addEventListener('click', () => {
            // 清空所有统计数据
            visitedPosts.clear();
            totalVisitedPostsCount = 0;
            scrollCount = 0;
            totalRunTime = 0;
            sessionStartTime = null;
            cachedLinks = null;

            // 标记数据已变化并强制保存
            statsChanged = true;
            saveStats(true);

            updateStatus();
            showNotification('已清空所有统计数据', 'success');
            log.info('🗑️ 已清空所有统计数据');
        });

        // 状态更新函数 - 增强版本
        function updateStatus() {
            const scrollCountEl = document.getElementById('scroll-count');
            const visitedCountEl = document.getElementById('visited-count');
            const pageTypeEl = document.getElementById('page-type');
            const statusEl = document.getElementById('status');
            const sessionTimeEl = document.getElementById('session-time');
            const totalTimeEl = document.getElementById('total-time');
            const startTimeInfoEl = document.getElementById('start-time-info');
            const startTimeDisplayEl = document.getElementById('start-time-display');

            // 新增：按钮状态控制
            const startBtn = document.getElementById('ultimate-start');
            const stopBtn = document.getElementById('ultimate-stop');

            if (scrollCountEl) scrollCountEl.textContent = scrollCount;
            if (visitedCountEl) visitedCountEl.textContent = totalVisitedPostsCount;
            if (pageTypeEl) pageTypeEl.textContent = getPageType();

            if (statusEl) {
                statusEl.textContent = isRunning ? '运行中' : '已停止';
                statusEl.style.color = isRunning ? '#10b981' : '#e53e3e';
            }

            // 按钮互斥状态控制
            if (startBtn && stopBtn) {
                if (isRunning) {
                    startBtn.disabled = true;
                    stopBtn.disabled = false;
                } else {
                    startBtn.disabled = false;
                    stopBtn.disabled = true;
                }
            }

            // 更新运行时间显示
            if (sessionTimeEl) {
                if (isRunning && sessionStartTime) {
                    const sessionDuration = Date.now() - sessionStartTime;
                    sessionTimeEl.textContent = formatDurationShort(sessionDuration);
                } else {
                    sessionTimeEl.textContent = '00:00';
                }
            }

            if (totalTimeEl) {
                let displayTotalTime = totalRunTime;
                if (isRunning && sessionStartTime) {
                    displayTotalTime += (Date.now() - sessionStartTime);
                }
                totalTimeEl.textContent = formatDurationShort(displayTotalTime);
            }

            // 显示/隐藏启动时间信息
            if (startTimeInfoEl && startTimeDisplayEl) {
                if (isRunning && sessionStartTime) {
                    startTimeInfoEl.style.display = 'block';
                    startTimeDisplayEl.textContent = new Date(sessionStartTime).toLocaleTimeString();
                } else {
                    startTimeInfoEl.style.display = 'none';
                }
            }
        }

        // 格式化时长显示（简短版本）
        function formatDurationShort(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);

            if (hours > 0) {
                return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')} `;
            } else {
                return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')} `;
            }
        }

        // 通知功能
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50 %;
        transform: translateX(-50 %);
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border - radius: 8px;
        font - size: 14px;
        font - weight: 500;
        z - index: 100000;
        box - shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: slideDown 0.3s ease;
        `;
            notification.textContent = message;

            // 添加动画样式
            const style = document.createElement('style');
            style.textContent = `
        @keyframes slideDown {
                    from { opacity: 0; transform: translateX(-50 %) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50 %) translateY(0); }
        }
        `;
            document.head.appendChild(style);

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 3000);
        }

        // 导出函数供外部使用
        window.updateStatus = updateStatus;
        window.showNotification = showNotification;

        // 初始化按钮状态
        updateStatus();

        // 应用保存的设置到UI
        applySettingsToUI();
    }

    // 初始化 - 增强版本
    function init() {
        console.log('⚡ 终极后台自动阅读脚本已加载');
        console.log('💡 使用最激进的方法确保后台运行');

        // 加载保存的数据
        loadSettings();
        loadStats();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createPanel();
                // 延迟检查自动启动，确保页面完全加载
                setTimeout(checkAutoStart, 1000);
            });
        } else {
            createPanel();
            // 延迟检查自动启动，确保页面完全加载
            setTimeout(checkAutoStart, 1000);
        }
    }

    // 检查并自动启动
    function checkAutoStart() {
        const shouldAutoStart = getRunningState();

        // 确保统计数据在UI上正确显示
        if (typeof updateStatus === 'function') {
            updateStatus();
            console.log('✅ 已更新统计数据显示');
        }

        if (shouldAutoStart) {
            console.log('🔄 检测到之前的运行状态，自动启动...');
            updateActivity('自动恢复中', '🔄', '检测到之前的运行状态，正在自动启动');
            startReading();
        } else {
            updateActivity('待机中', '⏸️', '系统已就绪，等待用户启动');
        }
    }

    // 应用保存的设置到UI
    function applySettingsToUI() {
        const speedSlider = document.getElementById('speed-slider');
        const speedValue = document.getElementById('speed-value');
        const distanceSlider = document.getElementById('distance-slider');
        const distanceValue = document.getElementById('distance-value');

        if (speedSlider && speedValue) {
            speedSlider.value = humanSimulation.baseScrollInterval;
            speedValue.textContent = humanSimulation.baseScrollInterval + 'ms';
        }

        if (distanceSlider && distanceValue) {
            distanceSlider.value = humanSimulation.baseScrollDistance;
            distanceValue.textContent = humanSimulation.baseScrollDistance + 'px';
        }
    }

    init();
})();
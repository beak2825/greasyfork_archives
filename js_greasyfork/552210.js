// ==UserScript==
// @name        linux.do 小助手（增强版）
// @description 自动浏览、点赞、只看楼主、楼层号、保存帖子到本地、清爽模式、黑白灰模式、用户信息展示（批量展示）、查看用户话题、Credit积分悬浮窗。支持拖动和最小化控制面板。支持 linux.do 和 idcflare.com
// @namespace    https://example.com/userscripts
// @match       https://linux.do/*
// @match       https://idcflare.com/*
// @match       https://cdk.linux.do/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @connect     connect.linux.do
// @connect     credit.linux.do
// @connect     cdk.linux.do
// @connect     linux.do
// @connect     *
// @require     https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @run-at      document-idle
// @version     1.8.2
// @author      quantumcat & nulluser & enhanced & idear
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/552210/linuxdo%20%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552210/linuxdo%20%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// 获取当前站点域名
const CURRENT_DOMAIN = window.location.hostname;
const BASE_URL = `https://${CURRENT_DOMAIN}`;
// ========== CDK Bridge 逻辑（在 cdk.linux.do 域上运行）==========
// 参考 1.js 的 iframe bridge 方案绕过 Cloudflare 保护
const CDK_BRIDGE_ORIGIN = 'https://cdk.linux.do';
const isCDKPage = CURRENT_DOMAIN === 'cdk.linux.do';

if (isCDKPage) {
    // 在 CDK 域内只做数据桥接，不渲染面板
    const initCDKBridgePage = () => {
        const cacheAndNotify = async () => {
            try {
                // 并行获取用户信息和领取记录
                const [userRes, receivedRes] = await Promise.all([
                    fetch('https://cdk.linux.do/api/v1/oauth/user-info', {
                        credentials: 'include'
                    }),
                    fetch('https://cdk.linux.do/api/v1/projects/received?current=1&size=20&search=', {
                        credentials: 'include'
                    })
                ]);

                const userData = userRes.ok ? await userRes.json() : null;
                const receivedData = receivedRes.ok ? await receivedRes.json() : null;

                if (!userData?.data) return;

                // 构建完整的缓存数据
                const cacheData = {
                    user: userData.data,
                    received: receivedData?.data || null
                };

                // 通过 GM 存储缓存数据
                GM_setValue('lda_cdk_cache', { data: cacheData, ts: Date.now() });

                // 通过 postMessage 通知父页面
                try {
                    window.parent?.postMessage({
                        type: 'lda-cdk-data',
                        payload: { data: cacheData }
                    }, '*');
                } catch (_) { }

                console.log('[CDK Bridge] 数据已缓存:', cacheData);
            } catch (e) {
                console.error('[CDK Bridge] 获取数据失败:', e);
            }
        };

        // 初始化立即拉取一次
        cacheAndNotify();

        // 接收来自 linux.do 的请求再拉取一次
        window.addEventListener('message', (e) => {
            if (e.data?.type === 'lda-cdk-request') cacheAndNotify();
        });
    };

    initCDKBridgePage();
    // 在 CDK 页面上不需要运行其他逻辑，直接返回
    // 注意：这里不能 return，因为脚本可能在 CDK 页面上也需要其他功能
    // 但为了简单起见，我们只执行 bridge 逻辑
}

// 配置项
const CONFIG = {
    scroll: {
        minSpeed: 10,
        maxSpeed: 15,
        minDistance: 2,
        maxDistance: 4,
        checkInterval: 500,
        fastScrollChance: 0.08,
        fastScrollMin: 80,
        fastScrollMax: 200
    },
    time: {
        browseTime: 3600000,
        restTime: 600000,
        minPause: 300,
        maxPause: 500,
        loadWait: 1500,
    },
    article: {
        commentLimit: 5000,
        topicListLimit: 100,
        retryLimit: 3
    },
    levelRequirements: {
        0: { // 0级升1级
            topics_entered: 5,
            posts_read_count: 30,
            time_read: 600 // 10分钟 = 600秒
        },
        1: { // 1级升2级
            days_visited: 15,
            likes_given: 1,
            likes_received: 1,
            post_count: 3,
            topics_entered: 20,
            posts_read_count: 100,
            time_read: 3600 // 60分钟 = 3600秒
        }
    },
    mustRead: {
        posts: [
            {
                id: '1051',
                url: 'https://linux.do/t/topic/1051/'
            },
            {
                id: '5973',
                url: 'https://linux.do/t/topic/5973'
            },
            {
                id: '102770',
                url: 'https://linux.do/t/topic/102770'
            },
            {
                id: '154010',
                url: 'https://linux.do/t/topic/154010'
            },
            {
                id: '149576',
                url: 'https://linux.do/t/topic/149576'
            },
            {
                id: '22118',
                url: 'https://linux.do/t/topic/22118'
            },
        ],
        likesNeeded: 5
    },
    // 允许自动点赞的板块配置
    // 只在这些板块及其子版块中进行自动点赞和快速点赞
    likeAllowedCategories: {
        // 允许的板块名称列表（包含子版块）
        allowed: [
            '开发调优',
            '国产替代',
            '资源荟萃',
            '文档共建',
            '非我莫属',
            '读书成诗',
            '前沿快讯',
            '福利羊毛',
            '搞七捻三',
            '社区孵化',
            '运营反馈'
        ],
        // 排除的子版块（即使父版块在允许列表中，这些子版块也不点赞）
        excluded: [
            '网盘资源',   // 排除 资源荟萃 > 网盘资源
            '跳蚤市场',   // 特殊用途版块
            '深海幽域',   // 特殊用途版块
            '积分乐园',   // 特殊用途版块
            '扬帆起航'    // 特殊用途版块
        ]
    }
};

// 工具函数
const Utils = {
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    isPageLoaded: () => {
        const loadingElements = document.querySelectorAll('.loading, .infinite-scroll');
        return loadingElements.length === 0;
    },
    isNearBottom: () => {
        const {scrollHeight, clientHeight, scrollTop} = document.documentElement;
        return (scrollTop + clientHeight) >= (scrollHeight - 200);
    },
    debounce: (func, wait) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
};

// 存储管理
const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }
};

// ========== 点赞计数器类（参考 1.js 优化）==========
class LikeCounter {
    constructor() {
        this.CONFIG = {
            // 使用域名区分存储键，避免 linux.do 和 idcflare.com 数据互相干扰
            STORAGE_KEY: `linuxdo_likes_counter_${CURRENT_DOMAIN}`,
            SYNC_INTERVAL: 30 * 60 * 1000, // 30分钟同步一次
            MAX_STORED_ITEMS: 500,
            // 不同信任等级的每日点赞限额
            LIMITS: { 0: 50, 1: 50, 2: 75, 3: 100, 4: 150 }
        };

        this.state = {
            timestamps: [],      // 点赞时间戳数组
            cooldownUntil: 0,    // 冷却结束时间
            lastSync: 0,         // 上次同步时间
            matched: true,       // 计数是否与服务器匹配（初始为true，同步后更新）
            userTrustLevel: null // 缓存的用户信任等级
        };

        this.currentUser = null;
        this.uiUpdateCallbacks = [];
        this.syncTimer = null;

        this.loadState();
        this.installInterceptors();
        this.startPeriodicSync();
    }

    // ========== 持久化 ==========
    loadState() {
        try {
            const stored = GM_getValue(this.CONFIG.STORAGE_KEY, '{}');
            const parsed = JSON.parse(stored);
            this.state = { ...this.state, ...parsed };
            if (this.state.timestamps.length > this.CONFIG.MAX_STORED_ITEMS) {
                this.state.timestamps = this.state.timestamps.slice(0, this.CONFIG.MAX_STORED_ITEMS);
            }
        } catch (e) {
            console.error('[LikeCounter] 加载状态失败:', e);
            this.state = { timestamps: [], cooldownUntil: 0, lastSync: 0, matched: false, userTrustLevel: null };
        }
        this.cleanOldEntries();
    }

    saveState() {
        try {
            GM_setValue(this.CONFIG.STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.error('[LikeCounter] 保存状态失败:', e);
        }
    }

    // 清理24小时前的过期记录
    cleanOldEntries() {
        const now = Date.now();
        const cutoff = now - 24 * 60 * 60 * 1000;

        // 过滤掉过期的时间戳
        this.state.timestamps = this.state.timestamps.filter(ts => ts > cutoff);
        this.state.timestamps.sort((a, b) => b - a); // 降序排列

        // 检查冷却是否已过期
        if (this.state.cooldownUntil > 0 && this.state.cooldownUntil < now) {
            // 冷却结束后，清理可能的占位符时间戳
            const expectedBase = this.state.cooldownUntil - (24 * 60 * 60 * 1000);
            const beforeCount = this.state.timestamps.length;
            this.state.timestamps = this.state.timestamps.filter(ts =>
                ts < expectedBase || ts >= expectedBase + 5000
            );
            if (this.state.timestamps.length < beforeCount) {
                this.checkAndUpdateMismatch();
            }
            this.state.cooldownUntil = 0;
        }
    }

    checkAndUpdateMismatch() {
        const limit = this.getDailyLimit();
        const count = this.state.timestamps.length;
        // 匹配条件：
        // 1. 达到或超过限额
        // 2. 从未同步过（认为是新用户，默认匹配）
        // 3. 已同步过且计数为0（说明确实没有点赞记录）
        this.state.matched = (count >= limit) ||
                             (this.state.lastSync === 0) ||
                             (this.state.lastSync > 0 && count === 0);
    }

    // ========== 核心逻辑 ==========

    // 获取当前用户的每日点赞限额
    getDailyLimit() {
        // 优先使用 currentUser 的 trust_level
        if (this.currentUser && this.CONFIG.LIMITS[this.currentUser.trust_level] !== undefined) {
            return this.CONFIG.LIMITS[this.currentUser.trust_level];
        }
        // 其次使用缓存的 trust_level
        if (this.state.userTrustLevel !== null && this.CONFIG.LIMITS[this.state.userTrustLevel] !== undefined) {
            return this.CONFIG.LIMITS[this.state.userTrustLevel];
        }
        // 尝试从账号等级缓存中读取
        try {
            const username = this.currentUser?.username;
            if (username) {
                const cacheKey = `trustLevelCache_${CURRENT_DOMAIN}_${username}`;
                const cachedData = Storage.get(cacheKey, null);
                if (cachedData?.currentLevel !== undefined) {
                    const level = parseInt(cachedData.currentLevel);
                    if (this.CONFIG.LIMITS[level] !== undefined) {
                        return this.CONFIG.LIMITS[level];
                    }
                }
            }
        } catch (e) { }
        return 50; // 默认值
    }

    // 获取剩余可点赞数
    getRemainingLikes() {
        this.cleanOldEntries();
        const limit = this.getDailyLimit();
        const used = this.state.timestamps.length;
        return Math.max(0, limit - used);
    }

    // 获取已使用的点赞数
    getUsedLikes() {
        this.cleanOldEntries();
        return this.state.timestamps.length;
    }

    // 是否处于冷却期
    isInCooldown() {
        return this.state.cooldownUntil > Date.now();
    }

    // 获取冷却剩余时间（毫秒）
    getCooldownRemaining() {
        if (!this.isInCooldown()) return 0;
        return Math.max(0, this.state.cooldownUntil - Date.now());
    }

    // 格式化冷却时间显示
    formatCooldown() {
        const diff = this.getCooldownRemaining();
        if (diff <= 0) return null;

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        if (h > 0) {
            return `${h}小时${String(m).padStart(2, '0')}分${String(s).padStart(2, '0')}秒`;
        }
        return `${String(m).padStart(2, '0')}分${String(s).padStart(2, '0')}秒`;
    }

    // 处理点赞 API 响应
    processToggleResponse(url, data) {
        this.loadState();
        const now = Date.now();

        // 处理 429 限流错误
        if (data.errors && data.error_type === 'rate_limit') {
            const waitSeconds = data.extras?.wait_seconds || 0;
            if (waitSeconds > 0) {
                this.state.cooldownUntil = now + (waitSeconds * 1000);
                console.log(`[LikeCounter] 触发限流，冷却 ${waitSeconds} 秒`);
            }

            const limit = this.getDailyLimit();
            const currentCount = this.state.timestamps.length;
            this.state.matched = (currentCount >= limit);

            // 如果本地计数不足，补充占位符时间戳
            if (currentCount < limit && waitSeconds > 0) {
                const needed = limit - currentCount;
                const placeholderBaseTime = (now + waitSeconds * 1000) - (24 * 60 * 60 * 1000);
                const safeNeeded = Math.min(needed, 200);
                for (let i = 0; i < safeNeeded; i++) {
                    this.state.timestamps.push(placeholderBaseTime + i);
                }
                this.state.timestamps.sort((a, b) => b - a);
            }
        }
        // 处理成功的点赞/取消点赞
        else if (data.id || data.resource_post_id) {
            const isLike = !!data.current_user_reaction;
            if (isLike) {
                // 点赞：添加时间戳
                this.state.timestamps.push(now);
                console.log(`[LikeCounter] 记录点赞，当前已用 ${this.state.timestamps.length}/${this.getDailyLimit()}`);
            } else {
                // 取消点赞：移除最新的时间戳
                if (this.state.timestamps.length > 0) {
                    this.state.timestamps.shift();
                    console.log(`[LikeCounter] 取消点赞，当前已用 ${this.state.timestamps.length}/${this.getDailyLimit()}`);
                }
                // 取消点赞后，如果之前在冷却，可能可以解除
                if (this.state.cooldownUntil > now) {
                    this.state.cooldownUntil = 0;
                }
            }
        }

        this.saveState();
        this.notifyUIUpdate();
    }

    // ========== 请求拦截器 ==========
    installInterceptors() {
        const self = this;

        // 拦截 fetch
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = (typeof args[0] === 'string') ? args[0] : (args[0]?.url || '');
            const response = await originalFetch.apply(this, args);

            // 检查是否是点赞相关请求
            if (url && (url.includes('/toggle.json') || url.includes('/custom-reactions/') || url.includes('/discourse-reactions/'))) {
                try {
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.json();
                    self.processToggleResponse(url, data);
                } catch (e) {
                    // 忽略解析错误
                }
            }
            return response;
        };

        // 拦截 XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._likeCounterUrl = url;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            const url = this._likeCounterUrl;
            if (url && (url.includes('/toggle.json') || url.includes('/custom-reactions/') || url.includes('/discourse-reactions/'))) {
                this.addEventListener('load', function() {
                    try {
                        const data = JSON.parse(this.responseText);
                        self.processToggleResponse(url, data);
                    } catch (e) {
                        // 忽略解析错误
                    }
                });
            }
            return originalSend.apply(this, arguments);
        };

        console.log('[LikeCounter] 拦截器已安装');
    }

    // ========== 远程同步 ==========
    async syncRemote(force = false) {
        // 检查是否距离上次同步不到 30 分钟（防止多窗口重复同步）
        // 先重新从存储加载状态，确保获取到其他窗口可能更新的 lastSync
        if (!force) {
            this.loadState();
            const lastSyncTime = this.state.lastSync || 0;
            const timeSinceLastSync = Date.now() - lastSyncTime;
            const minSyncInterval = 30 * 60 * 1000; // 30 分钟
            if (timeSinceLastSync < minSyncInterval) {
                const remainMinutes = Math.ceil((minSyncInterval - timeSinceLastSync) / 60000);
                console.log(`[LikeCounter] 距离上次同步仅 ${Math.floor(timeSinceLastSync / 60000)} 分钟，跳过本次同步（剩余 ${remainMinutes} 分钟）`);
                // 虽然跳过同步，但仍需更新 UI 显示当前状态
                this.notifyUIUpdate();
                return;
            }
        }

        if (!this.currentUser) {
            // 尝试获取当前用户（优先使用 DOM 方法，减少 API 调用避免 429）
            let username = null;

            // 方法1：从 Discourse 全局对象获取
            try {
                const currentUser = window.Discourse?.User?.current?.() ||
                    window.Discourse?.currentUser ||
                    window.User?.current?.();
                if (currentUser?.username) {
                    this.currentUser = currentUser;
                    username = currentUser.username;
                }
            } catch (e) { }

            // 方法2：从页面 preload 数据获取
            if (!username) {
                try {
                    const preloadData = document.getElementById('data-preloaded');
                    if (preloadData) {
                        const data = JSON.parse(preloadData.dataset.preloaded);
                        if (data?.currentUser) {
                            const cu = JSON.parse(data.currentUser);
                            if (cu?.username) {
                                this.currentUser = cu;
                                username = cu.username;
                            }
                        }
                    }
                } catch (e) { }
            }

            // 方法3：从用户菜单头像 alt 获取
            if (!username) {
                const userMenuBtn = document.querySelector('.header-dropdown-toggle.current-user');
                if (userMenuBtn) {
                    const img = userMenuBtn.querySelector('img[alt]');
                    if (img && img.alt) {
                        username = img.alt.trim().replace(/^@/, '');
                        this.currentUser = { username };
                    }
                }
            }

            // 方法4：从用户头像 title 获取
            if (!username) {
                const userAvatar = document.querySelector('.current-user img[title]');
                if (userAvatar && userAvatar.title) {
                    username = userAvatar.title.trim().replace(/^@/, '');
                    this.currentUser = { username };
                }
            }

            // 方法5：从当前用户链接 href 获取
            if (!username) {
                const currentUserLink = document.querySelector('a.current-user, .header-dropdown-toggle.current-user a');
                if (currentUserLink) {
                    const href = currentUserLink.getAttribute('href');
                    if (href && href.includes('/u/')) {
                        username = href.split('/u/')[1].split('/')[0];
                        if (username) {
                            username = username.trim().replace(/^@/, '');
                            this.currentUser = { username };
                        }
                    }
                }
            }

            // 方法6：从 localStorage 获取
            if (!username) {
                try {
                    const stored = localStorage.getItem('discourse_current_user');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (parsed?.username) {
                            this.currentUser = parsed;
                            username = parsed.username;
                        }
                    }
                } catch (e) { }
            }

            // 方法7（最后手段）：从 API 获取
            if (!username) {
                // 先检查是否在 429 冷却期
                const session429Until = Storage.get('session429Until', 0);
                if (session429Until > Date.now()) {
                    const remainMinutes = Math.ceil((session429Until - Date.now()) / 60000);
                    console.log(`[LikeCounter] session/current 429 冷却期中，剩余 ${remainMinutes} 分钟，跳过同步`);
                    return;
                }

                try {
                    const response = await fetch(`${BASE_URL}/session/current.json`);
                    // 检测 429 错误
                    if (response.status === 429) {
                        console.warn('[LikeCounter] session/current 遇到 429，设置 30 分钟冷却');
                        Storage.set('session429Until', Date.now() + 30 * 60 * 1000);
                        return;
                    }
                    if (response.ok) {
                        const data = await response.json();
                        if (data.current_user) {
                            this.currentUser = data.current_user;
                        }
                    }
                } catch (e) {
                    console.error('[LikeCounter] 获取用户信息失败:', e);
                }
            }

            if (!this.currentUser) return;
        }

        const savedCooldown = this.state.cooldownUntil;
        this.cleanOldEntries();
        const username = this.currentUser.username;

        console.log(`[LikeCounter] 开始同步用户 ${username} 的点赞数据...`);

        try {
            const limit = this.getDailyLimit();

            // 先尝试获取服务器的冷却时间
            console.log(`[LikeCounter] 尝试获取服务器冷却时间...`);
            const serverCooldownTime = await this.fetchCooldownTime();

            // 关键修复：如果服务器返回了冷却时间（即已触发 429），说明已经达到限额
            // 此时不需要重新获取点赞数据，直接设置为已达限额状态
            if (serverCooldownTime > 0) {
                console.log(`[LikeCounter] 服务器确认已达限额，冷却时间: ${new Date(serverCooldownTime).toLocaleString()}`);

                // 直接设置为已达限额
                // 生成 limit 个占位时间戳（用冷却结束时间 - 24小时作为基准）
                const baseTime = serverCooldownTime - 24 * 60 * 60 * 1000;
                this.state.timestamps = [];
                for (let i = 0; i < limit; i++) {
                    // 分散在窗口内，避免全部相同
                    this.state.timestamps.push(baseTime + i * 60 * 1000);
                }
                this.state.cooldownUntil = serverCooldownTime;
                this.state.lastSync = Date.now();
                this.state.matched = true;

                // 同步到 BrowseController
                Storage.set('likeResumeTime', serverCooldownTime);

                // 缓存用户信任等级
                if (this.currentUser?.trust_level !== undefined) {
                    this.state.userTrustLevel = this.currentUser.trust_level;
                }

                this.saveState();
                this.notifyUIUpdate();
                console.log(`[LikeCounter] 同步完成（服务器确认限额），已用 ${limit}/${limit}`);
                return;
            }

            // serverCooldownTime === -1 表示无法测试（页面无帖子等原因）
            // serverCooldownTime === 0 表示服务器确认无限流
            const couldNotTest = serverCooldownTime === -1;

            // 正常获取点赞数据
            // 使用当前时间 - 24小时 作为窗口起点
            const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;
            if (couldNotTest) {
                console.log(`[LikeCounter] 无法测试服务器状态，使用 API 数据。窗口起点: ${new Date(cutoffTime).toLocaleString()}`);
            } else {
                console.log(`[LikeCounter] 服务器确认未达限额，使用默认窗口起点: ${new Date(cutoffTime).toLocaleString()}`);
            }

            // 使用 user_actions API 获取点赞数据（filter=1 表示点赞）
            // 注意：linux.do 的点赞限制是按"帖子数"计算的，不是按"反应次数"
            const reactions = await this.fetchUserActions(username, cutoffTime);

            // 按 post_id 去重（同一个帖子只计一次，即使点了多个表情）
            const postMap = new Map();
            for (const item of reactions) {
                // 每个 post_id 只保留最新的时间戳
                if (!postMap.has(item.post_id) || postMap.get(item.post_id) < item.timestamp) {
                    postMap.set(item.post_id, item.timestamp);
                }
            }
            const dedupedTimestamps = Array.from(postMap.values());

            console.log(`[LikeCounter] 用户信任等级: ${this.currentUser?.trust_level}, 限额: ${limit}`);
            console.log(`[LikeCounter] 从 API 获取到 ${reactions.length} 条反应记录，去重后 ${dedupedTimestamps.length} 个不同帖子`);

            // 检查是否有之前保存的冷却状态
            let effectiveCooldown = 0;
            if (savedCooldown > Date.now()) {
                effectiveCooldown = savedCooldown;
            }
            const bcLikeResumeTime = Storage.get('likeResumeTime', null);
            if (bcLikeResumeTime && bcLikeResumeTime > Date.now() && bcLikeResumeTime > effectiveCooldown) {
                effectiveCooldown = bcLikeResumeTime;
            }

            // 只有当服务器明确确认无限流时（serverCooldownTime === 0），才清除旧的冷却状态
            // 如果无法测试（couldNotTest === true），保留已有的冷却状态
            if (!couldNotTest && effectiveCooldown > 0) {
                console.log(`[LikeCounter] 服务器确认无限流，清除旧的冷却状态`);
                this.state.cooldownUntil = 0;
                Storage.set('likeResumeTime', null);
            } else if (couldNotTest && effectiveCooldown > 0) {
                // 无法测试时，如果 API 数据接近限额，保留冷却状态
                if (dedupedTimestamps.length >= limit - 1) {
                    console.log(`[LikeCounter] 无法测试服务器状态，API 数据接近限额(${dedupedTimestamps.length}/${limit})，保留冷却状态`);
                    this.state.cooldownUntil = effectiveCooldown;
                }
            }

            // 使用 API 返回的真实时间戳
            this.state.timestamps = dedupedTimestamps;
            this.state.lastSync = Date.now();
            this.state.matched = true;

            this.cleanOldEntries();

            // 如果 API 数据显示达到限额，估算冷却时间
            if (this.state.timestamps.length >= limit) {
                const oldestTs = Math.min(...this.state.timestamps);
                const estimatedCooldown = oldestTs + 24 * 60 * 60 * 1000;
                if (estimatedCooldown > Date.now()) {
                    this.state.cooldownUntil = estimatedCooldown;
                    Storage.set('likeResumeTime', estimatedCooldown);
                    console.log(`[LikeCounter] API 数据达到限额，估算冷却时间: ${new Date(estimatedCooldown).toLocaleString()}`);
                }
            }

            // 缓存用户信任等级，以便页面刷新后使用
            if (this.currentUser?.trust_level !== undefined) {
                this.state.userTrustLevel = this.currentUser.trust_level;
            }

            this.saveState();
            this.notifyUIUpdate();
            console.log(`[LikeCounter] 同步完成，已用 ${this.state.timestamps.length}/${limit}`);

        } catch (e) {
            console.error('[LikeCounter] 同步失败:', e);
        }
    }

    // 获取准确的冷却时间（通过尝试点赞触发 429 响应）
    // 返回值约定：
    //   > 0: 服务器返回的冷却结束时间戳（已达限额）
    //   0: 服务器确认没有限流（测试成功）
    //   -1: 无法测试（页面无帖子等原因），应保留已有状态
    async fetchCooldownTime() {
        try {
            // 找一个帖子来尝试点赞，从页面上找一个已存在的帖子 ID
            // 优先从页面上的帖子获取
            const postElement = document.querySelector('[data-post-id]');
            let testPostId = postElement?.dataset?.postId;

            // 如果页面上没有帖子，使用一个固定的测试帖子（首页欢迎帖之类的）
            if (!testPostId) {
                // 尝试从最近的时间戳数据中获取 post_id
                // 或者使用一个已知存在的帖子
                console.log(`[LikeCounter] 页面上没有帖子，跳过冷却时间获取`);
                return -1; // 返回 -1 表示无法测试，应保留已有状态
            }

            console.log(`[LikeCounter] 尝试对帖子 ${testPostId} 点赞以获取冷却时间...`);

            // 获取 CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            if (!csrfToken) {
                console.log(`[LikeCounter] 无法获取 CSRF token，跳过冷却时间获取`);
                return -1; // 无法测试
            }

            const response = await fetch(`${BASE_URL}/discourse-reactions/posts/${testPostId}/custom-reactions/heart/toggle.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                }
            });

            const data = await response.json();

            // 检查是否返回 429 限流错误
            if (data.errors && data.error_type === 'rate_limit') {
                const waitSeconds = data.extras?.wait_seconds || 0;
                if (waitSeconds > 0) {
                    const cooldownTime = Date.now() + (waitSeconds * 1000);
                    console.log(`[LikeCounter] 服务器返回限流，需等待 ${waitSeconds} 秒`);
                    return cooldownTime;
                }
            } else if (data.id || data.resource_post_id) {
                // 点赞成功了！说明其实没有到达限额，需要再点一次取消
                console.log(`[LikeCounter] 意外：点赞成功，立即取消并返回0`);
                // 取消点赞
                await fetch(`${BASE_URL}/discourse-reactions/posts/${testPostId}/custom-reactions/heart/toggle.json`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken
                    }
                });
                return 0; // 确认无限流
            }

            return -1; // 未知状态，保留已有
        } catch (e) {
            console.error('[LikeCounter] 获取冷却时间失败:', e);
            return -1; // 出错时也返回 -1，保留已有状态
        }
    }

    // 获取用户点赞历史（user_actions API）
    // cutoffTime: 滚动窗口的起点时间戳，早于此时间的点赞不计入限额
    async fetchUserActions(username, cutoffTime) {
        const allItems = [];
        const cutoff = cutoffTime || (Date.now() - 24 * 60 * 60 * 1000);
        let offset = 0;
        let pages = 0;

        console.log(`[LikeCounter] 开始获取 ${username} 的点赞历史，窗口起点: ${new Date(cutoff).toLocaleString()}`);

        while (pages < 5) {
            try {
                const url = `${BASE_URL}/user_actions.json?limit=50&username=${username}&filter=1&offset=${offset}`;
                // console.log(`[LikeCounter] 请求 URL: ${url}`);
                const response = await fetch(url);
                // console.log(`[LikeCounter] 响应状态: ${response.status}`);

                const res = await response.json();
                const items = res.user_actions || [];
                // console.log(`[LikeCounter] 第${pages + 1}页获取到 ${items.length} 条记录`);

                if (!items.length) {
                    console.log(`[LikeCounter] 没有更多数据，结束获取`);
                    break;
                }

                let hasOld = false;
                let addedCount = 0;
                for (const item of items) {
                    const t = new Date(item.created_at).getTime();
                    const hoursAgo = ((Date.now() - t) / (1000 * 60 * 60)).toFixed(1);
                    // console.log(`[LikeCounter] 记录: post_id=${item.post_id}, created_at=${item.created_at}, ${hoursAgo}小时前, ${t > cutoff ? '有效' : '过期'}`);
                    if (t > cutoff) {
                        allItems.push({ post_id: item.post_id, timestamp: t });
                        addedCount++;
                    } else {
                        hasOld = true;
                    }
                }
                // console.log(`[LikeCounter] 本页添加 ${addedCount} 条窗口内的记录，累计 ${allItems.length} 条`);

                if (hasOld || items.length < 50) {
                    console.log(`[LikeCounter] ${hasOld ? '遇到窗口外的旧数据' : '数据不足50条'}，结束获取`);
                    break;
                }
                offset += 50;
                pages++;
            } catch (e) {
                console.error(`[LikeCounter] 获取点赞历史出错:`, e);
                break;
            }
        }

        console.log(`[LikeCounter] 点赞历史获取完成，共 ${allItems.length} 条`);
        return allItems;
    }

    // 获取用户表情历史（reactions API）
    async fetchReactions(username) {
        const allItems = [];
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        let beforeId = null;
        let pages = 0;

        console.log(`[LikeCounter] 开始获取 ${username} 的反应历史...`);

        while (pages < 10) {
            try {
                let url = `${BASE_URL}/discourse-reactions/posts/reactions.json?username=${username}`;
                if (beforeId) url += `&before_reaction_user_id=${beforeId}`;

                console.log(`[LikeCounter] 请求 URL: ${url}`);
                const response = await fetch(url);
                console.log(`[LikeCounter] 响应状态: ${response.status}`);

                if (!response.ok) {
                    console.error(`[LikeCounter] API 请求失败: ${response.status} ${response.statusText}`);
                    break;
                }

                const items = await response.json();
                console.log(`[LikeCounter] 第${pages + 1}页获取到 ${Array.isArray(items) ? items.length : 0} 条记录`);

                if (!Array.isArray(items) || !items.length) {
                    console.log(`[LikeCounter] 没有更多数据，结束获取`);
                    break;
                }

                let hasOld = false;
                let addedCount = 0;
                for (const item of items) {
                    const t = new Date(item.created_at).getTime();
                    const hoursAgo = ((Date.now() - t) / (1000 * 60 * 60)).toFixed(1);
                    // console.log(`[LikeCounter] 记录: post_id=${item.post_id}, created_at=${item.created_at}, ${hoursAgo}小时前, ${t > cutoff ? '有效' : '过期'}`);
                    if (t > cutoff) {
                        allItems.push({ post_id: item.post_id, timestamp: t });
                        addedCount++;
                    } else {
                        hasOld = true;
                    }
                }
                console.log(`[LikeCounter] 本页添加 ${addedCount} 条24小时内的记录，累计 ${allItems.length} 条`);

                beforeId = items[items.length - 1].id;
                if (hasOld || items.length < 20) {
                    console.log(`[LikeCounter] ${hasOld ? '遇到旧数据' : '数据不足20条'}，结束获取`);
                    break;
                }
                pages++;
            } catch (e) {
                console.error(`[LikeCounter] 获取反应历史出错:`, e);
                break;
            }
        }

        console.log(`[LikeCounter] 反应历史获取完成，共 ${allItems.length} 条`);
        return allItems;
    }

    // 启动定期同步
    startPeriodicSync() {
        // 页面加载3秒后首次同步
        setTimeout(() => this.syncRemote(), 3000);

        // 定期同步
        this.syncTimer = setInterval(() => {
            this.syncRemote();
        }, this.CONFIG.SYNC_INTERVAL);
    }

    // 设置当前用户
    setCurrentUser(user) {
        this.currentUser = user;
        this.notifyUIUpdate();
    }

    // ========== UI 更新回调 ==========
    onUIUpdate(callback) {
        this.uiUpdateCallbacks.push(callback);
    }

    notifyUIUpdate() {
        for (const callback of this.uiUpdateCallbacks) {
            try {
                callback(this.getStatus());
            } catch (e) {
                console.error('[LikeCounter] UI更新回调错误:', e);
            }
        }
    }

    // 获取当前状态
    getStatus() {
        this.cleanOldEntries();
        return {
            remaining: this.getRemainingLikes(),
            used: this.getUsedLikes(),
            limit: this.getDailyLimit(),
            isInCooldown: this.isInCooldown(),
            cooldownRemaining: this.getCooldownRemaining(),
            cooldownFormatted: this.formatCooldown(),
            cooldownUntil: this.state.cooldownUntil,
            matched: this.state.matched,
            lastSync: this.state.lastSync
        };
    }

    // 清除冷却（手动）
    clearCooldown() {
        this.state.cooldownUntil = 0;
        // 同时清理可能的占位符时间戳
        const now = Date.now();
        const recentCutoff = now - 60000; // 1分钟内
        this.state.timestamps = this.state.timestamps.filter(ts => ts > recentCutoff || ts < now - 24 * 60 * 60 * 1000 + 60000);
        this.saveState();
        this.notifyUIUpdate();
        console.log('[LikeCounter] 冷却已清除');
    }

    // 手动触发同步（强制同步，忽略 30 分钟间隔限制）
    manualSync() {
        return this.syncRemote(true);
    }
}

// 全局点赞计数器实例（在 BrowseController 初始化前创建）
let globalLikeCounter = null;

// 用户信息助手类
class UserInfoHelper {
    constructor() {
        this.userInfoCache = new Map();
        this.pendingRequests = new Map();
        this.TRUST_LEVEL_LABELS = {
            0: 'Lv0',
            1: 'Lv1',
            2: 'Lv2',
            3: 'Lv3',
            4: 'Lv4'
        };
        this.DAY_IN_MS = 24 * 60 * 60 * 1000;
        this.revealInProgress = false;
        this.isEnabled = true; // 用户信息展示是否启用
        this.observer = null;

        this.init();
    }

    enable() {
        this.isEnabled = true;
        this.init();
    }

    disable() {
        this.isEnabled = false;
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    init() {
        if (!this.isEnabled) return;

        // 如果已有观察器，先断开
        if (this.observer) {
            this.observer.disconnect();
        }

        // 使用防抖，避免频繁触发
        const debouncedEnhance = this.debounce(() => {
            if (this.isEnabled) {
                this.enhanceUserInfo();
            }
        }, 300);

        // 监听页面变化，自动为新加载的用户添加信息
        this.observer = new MutationObserver(() => {
            if (this.isEnabled) {
                debouncedEnhance();
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始增强
        this.enhanceUserInfo();
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    isTopicPage() {
        return window.location.pathname.includes('/t/topic/');
    }

    async enhanceUserInfo() {
        if (!this.isTopicPage()) return;

        const articles = document.querySelectorAll('.topic-post article');
        for (const article of articles) {
            const anchor = article.querySelector('.names a[data-user-card]');
            if (!anchor) continue;

            const slug = anchor.getAttribute('data-user-card');
            if (!slug) continue;

            const normalizedSlug = slug.trim().toLowerCase();

            // 检查是否已经添加过信息
            if (article.querySelector(`.user-reg-info[data-user="${normalizedSlug}"]`)) {
                continue;
            }

            // 检查是否是第一楼（楼主）
            const postWrapper = article.closest('.topic-post');
            const postNumber = postWrapper?.getAttribute('data-post-number');
            const isFirstPost = postNumber === '1';

            // 第一楼直接显示，其他楼添加按钮
            if (isFirstPost) {
                await this.loadAndDisplayUserInfo(anchor, slug, normalizedSlug);
            } else {
                this.addInfoButton(anchor, slug, normalizedSlug);
            }
        }
    }

    addInfoButton(anchor, rawSlug, normalizedSlug) {
        const namesContainer = anchor.closest('.names');
        if (!namesContainer) return;

        // 检查是否已有按钮或信息
        if (namesContainer.querySelector(`.user-info-btn[data-user="${normalizedSlug}"]`)) {
            return;
        }

        // 如果已经有信息节点，不添加按钮
        if (namesContainer.querySelector(`.user-reg-info[data-user="${normalizedSlug}"]`)) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'user-info-btn';
        button.setAttribute('data-user', normalizedSlug);
        button.setAttribute('data-raw-slug', rawSlug);
        button.textContent = '📊';
        button.title = '点击查看用户注册信息';
        button.style.cssText = `
            margin-left: 6px;
            font-size: 14px;
            cursor: pointer;
            background: none;
            border: none;
            padding: 2px 4px;
            opacity: 0.6;
            transition: opacity 0.2s;
            vertical-align: middle;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });

        button.addEventListener('mouseleave', () => {
            button.style.opacity = '0.6';
        });

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (button.disabled) return;

            button.disabled = true;
            button.textContent = '⏳';

            try {
                await this.loadAndDisplayUserInfo(anchor, rawSlug, normalizedSlug);
                // 成功后按钮会被 loadAndDisplayUserInfo 中移除
            } catch (error) {
                console.error('加载用户信息失败:', error);
                button.textContent = '📊';
                button.disabled = false;
            }
        });

        anchor.insertAdjacentElement('afterend', button);

        // 添加"查看话题"按钮
        this.addTopicsButton(anchor, rawSlug, normalizedSlug);
    }

    addTopicsButton(anchor, rawSlug, normalizedSlug) {
        const namesContainer = anchor.closest('.names');
        if (!namesContainer) return;

        // 检查是否已有话题按钮
        if (namesContainer.querySelector(`.user-topics-btn[data-user="${normalizedSlug}"]`)) {
            return;
        }

        const topicsBtn = document.createElement('a');
        topicsBtn.className = 'user-topics-btn';
        topicsBtn.setAttribute('data-user', normalizedSlug);
        topicsBtn.href = `${BASE_URL}/u/${rawSlug}/activity/topics`;
        topicsBtn.target = '_blank';
        topicsBtn.textContent = '查看话题';
        topicsBtn.title = '查看该用户的话题';
        topicsBtn.style.cssText = `
            margin-left: 6px;
            font-size: 12px;
            cursor: pointer;
            text-decoration: none;
            padding: 2px 6px;
            opacity: 0.7;
            transition: all 0.2s;
            vertical-align: middle;
            display: inline-block;
            color: #667eea;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 4px;
        `;

        topicsBtn.addEventListener('mouseenter', () => {
            topicsBtn.style.opacity = '1';
            topicsBtn.style.background = 'rgba(102, 126, 234, 0.2)';
        });

        topicsBtn.addEventListener('mouseleave', () => {
            topicsBtn.style.opacity = '0.7';
            topicsBtn.style.background = 'rgba(102, 126, 234, 0.1)';
        });

        // 插入到信息按钮后面
        const infoBtn = namesContainer.querySelector(`.user-info-btn[data-user="${normalizedSlug}"]`);
        if (infoBtn) {
            infoBtn.insertAdjacentElement('afterend', topicsBtn);
        } else {
            anchor.insertAdjacentElement('afterend', topicsBtn);
        }
    }

    async loadAndDisplayUserInfo(anchor, slug, normalizedSlug) {
        const namesContainer = anchor.closest('.names');
        if (!namesContainer) return;

        // 再次检查是否已经存在，避免重复
        const existingInfo = namesContainer.querySelector(`.user-reg-info[data-user="${normalizedSlug}"]`);
        if (existingInfo) {
            console.log(`用户 ${normalizedSlug} 信息已存在，跳过`);
            // 确保按钮被移除
            const button = namesContainer.querySelector(`.user-info-btn[data-user="${normalizedSlug}"]`);
            if (button) button.remove();
            return;
        }

        const info = await this.fetchUserInfo(slug, normalizedSlug);
        if (!info) {
            // 获取失败，恢复按钮
            const button = namesContainer.querySelector(`.user-info-btn[data-user="${normalizedSlug}"]`);
            if (button) {
                button.textContent = '📊';
                button.disabled = false;
            }
            return;
        }

        const infoNode = this.buildInfoNode(info, normalizedSlug);
        if (!infoNode) {
            // 构建失败，恢复按钮
            const button = namesContainer.querySelector(`.user-info-btn[data-user="${normalizedSlug}"]`);
            if (button) {
                button.textContent = '📊';
                button.disabled = false;
            }
            return;
        }

        // 最后一次检查，确保在异步等待期间没有被其他调用添加
        const finalCheck = namesContainer.querySelector(`.user-reg-info[data-user="${normalizedSlug}"]`);
        if (finalCheck) {
            console.log(`用户 ${normalizedSlug} 信息在等待期间已被添加，跳过`);
            // 移除按钮
            const button = namesContainer.querySelector(`.user-info-btn[data-user="${normalizedSlug}"]`);
            if (button) button.remove();
            return;
        }

        // 先移除信息按钮
        const button = namesContainer.querySelector(`.user-info-btn[data-user="${normalizedSlug}"]`);
        if (button) button.remove();

        // 添加信息节点
        anchor.insertAdjacentElement('afterend', infoNode);

        // 确保话题按钮存在（如果还没有添加）
        if (!namesContainer.querySelector(`.user-topics-btn[data-user="${normalizedSlug}"]`)) {
            this.addTopicsButton(anchor, slug, normalizedSlug);
        }
    }

    async fetchUserInfo(slug, normalizedSlug) {
        // 检查缓存
        if (this.userInfoCache.has(normalizedSlug)) {
            return this.userInfoCache.get(normalizedSlug);
        }

        // 检查是否正在请求
        if (this.pendingRequests.has(normalizedSlug)) {
            return this.pendingRequests.get(normalizedSlug);
        }

        // 创建请求
        const requestPromise = this.doFetchUserInfo(slug, normalizedSlug);
        this.pendingRequests.set(normalizedSlug, requestPromise);

        try {
            const info = await requestPromise;
            if (info) {
                this.userInfoCache.set(normalizedSlug, info);
            }
            return info;
        } finally {
            this.pendingRequests.delete(normalizedSlug);
        }
    }

    async doFetchUserInfo(slug, normalizedSlug) {
        try {
            // 使用两个API并行请求,与原脚本保持一致
            const PROFILE_API_BUILDERS = [
                (s) => `${BASE_URL}/u/${encodeURIComponent(s)}.json`,
                (s) => `${BASE_URL}/users/${encodeURIComponent(s)}.json`,
            ];

            const SUMMARY_API_BUILDERS = [
                (s) => `${BASE_URL}/u/${encodeURIComponent(s)}/summary.json`,
                (s) => `${BASE_URL}/users/${encodeURIComponent(s)}/summary.json`,
            ];

            const [profileData, summaryData] = await Promise.all([
                this.fetchFirstAvailable(PROFILE_API_BUILDERS, slug),
                this.fetchFirstAvailable(SUMMARY_API_BUILDERS, slug),
            ]);

            if (!profileData && !summaryData) {
                return null;
            }

            const user = profileData && (profileData.user || profileData);
            const summary = summaryData && (summaryData.user_summary || summaryData.summary || summaryData);

            const createdAt = this.pickCreatedAt(user) || (summary && this.pickCreatedAt(summary));
            if (!createdAt) {
                return null;
            }

            const topicCount = this.pickFirstNumber(
                user && (user.topic_count ?? user.topicCount),
                summary && (summary.topic_count ?? summary.topics_count),
            );

            const totalPostCount = this.pickFirstNumber(
                user && (user.post_count ?? user.postCount),
                summary && (summary.post_count ?? summary.posts_count),
            );

            let repliesCount = this.pickFirstNumber(
                summary && (summary.replies_count ?? summary.reply_count),
            );
            if (repliesCount === null && totalPostCount !== null && topicCount !== null) {
                repliesCount = Math.max(0, totalPostCount - topicCount);
            }

            const trustLevelRaw = this.pickFirstValue(
                user && (user.trust_level ?? user.trustLevel),
                summary && (summary.trust_level ?? summary.trustLevel),
            );
            const trustLevel = this.normalizeTrustLevel(trustLevelRaw);

            const days = this.calcDays(createdAt);

            return {
                slug: normalizedSlug,
                createdAt,
                days,
                topicCount: typeof topicCount === 'number' && Number.isFinite(topicCount) ? topicCount : undefined,
                repliesCount: typeof repliesCount === 'number' && Number.isFinite(repliesCount) ? repliesCount : undefined,
                trustLevel
            };
        } catch (error) {
            console.error('获取用户信息失败:', slug, error);
            return null;
        }
    }

    async fetchFirstAvailable(builders, slug) {
        for (const builder of builders) {
            const url = builder(slug);
            const data = await this.safeFetchJson(url);
            if (data) {
                return data;
            }
        }
        return null;
    }

    async safeFetchJson(url) {
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    pickFirstNumber(...values) {
        for (const value of values) {
            const numberValue = Number(value);
            if (!Number.isNaN(numberValue)) {
                return numberValue;
            }
        }
        return null;
    }

    pickFirstValue(...values) {
        for (const value of values) {
            if (value !== undefined && value !== null) {
                return value;
            }
        }
        return null;
    }

    normalizeTrustLevel(raw) {
        if (raw === undefined || raw === null) {
            return undefined;
        }

        if (typeof raw === 'number' && Number.isFinite(raw)) {
            return raw;
        }

        if (typeof raw === 'string') {
            const TRUST_LEVEL_ALIAS = {
                newuser: 0,
                basic: 1,
                member: 2,
                regular: 3,
                leader: 4,
            };
            const alias = TRUST_LEVEL_ALIAS[raw.toLowerCase()];
            if (alias !== undefined) {
                return alias;
            }
            const numeric = Number(raw);
            if (!Number.isNaN(numeric)) {
                return numeric;
            }
        }

        return undefined;
    }

    pickCreatedAt(source) {
        if (!source) {
            return null;
        }
        return (
            source.created_at ||
            source.createdAt ||
            source.registration_date ||
            source.registrationDate ||
            source.joined ||
            source.joinedAt ||
            null
        );
    }

    calcDays(createdAt) {
        const createdTime = new Date(createdAt).getTime();
        if (Number.isNaN(createdTime)) {
            return 0;
        }
        const diff = Date.now() - createdTime;
        return Math.max(0, Math.floor(diff / this.DAY_IN_MS));
    }

    buildInfoNode(info, normalizedSlug) {
        const segments = [`注册 ${this.formatNumber(info.days)} 天`];

        if (typeof info.topicCount === 'number' && Number.isFinite(info.topicCount)) {
            segments.push(`发帖 ${this.formatNumber(info.topicCount)}`);
        }

        if (typeof info.repliesCount === 'number' && Number.isFinite(info.repliesCount)) {
            segments.push(`回帖 ${this.formatNumber(info.repliesCount)}`);
        }

        if (typeof info.trustLevel === 'number' && Number.isFinite(info.trustLevel)) {
            const FULL_TRUST_LEVEL_LABELS = {
                0: 'Lv0 新手',
                1: 'Lv1 入门',
                2: 'Lv2 成员',
                3: 'Lv3 常驻',
                4: 'Lv4 领袖',
            };
            const label = FULL_TRUST_LEVEL_LABELS[info.trustLevel] || `信任级别 Lv${info.trustLevel}`;
            segments.push(label);
        }

        if (!segments.length) {
            return null;
        }

        const span = document.createElement('span');
        span.className = 'user-reg-info';
        span.setAttribute('data-user', normalizedSlug);
        span.textContent = ` · ${segments.join(' · ')}`;
        span.style.cssText = `
            margin-left: 6px;
            font-size: 12px;
            color: #1a4c7c;
        `;

        return span;
    }

    formatNumber(value) {
        return Number(value).toLocaleString('zh-CN');
    }

    // 批量展示所有已加载的回复用户信息
    async revealAllVisibleReplies() {
        if (!this.isTopicPage()) return;
        if (this.revealInProgress) return;

        this.revealInProgress = true;

        try {
            const articles = document.querySelectorAll('.topic-post article');

            for (let index = 0; index < articles.length; index++) {
                const article = articles[index];

                // 跳过第一楼（楼主）
                const postWrapper = article.closest('.topic-post');
                const postNumber = postWrapper?.getAttribute('data-post-number');
                if (postNumber === '1') continue;

                const anchor = article.querySelector('.names a[data-user-card]');
                if (!anchor) continue;

                const slug = anchor.getAttribute('data-user-card');
                if (!slug) continue;

                const normalizedSlug = slug.trim().toLowerCase();
                const namesContainer = anchor.closest('.names');
                if (!namesContainer) continue;

                // 检查是否已经展示过
                const hasInfo = namesContainer.querySelector(`.user-reg-info[data-user="${normalizedSlug}"]`);
                if (hasInfo) {
                    // 移除可能残留的按钮
                    const button = namesContainer.querySelector(`.user-info-btn[data-user="${normalizedSlug}"]`);
                    if (button) button.remove();
                    continue;
                }

                // 加载并显示用户信息
                await this.loadAndDisplayUserInfo(anchor, slug, normalizedSlug);
            }
        } catch (error) {
            console.error('批量展示用户信息失败:', error);
        } finally {
            this.revealInProgress = false;
        }
    }
}

class BrowseController {
    constructor() {
        this.isScrolling = false;
        this.scrollInterval = null;
        this.pauseTimeout = null;
        this.trustLevelMonitorInterval = null; // 等级监控定时器
        this.navigationTimeout = null; // 导航超时定时器
        this.navigationGuardInterval = null; // 导航守护定时器

        // 初始化语言设置（必须在 setupButton 之前）
        this.language = Storage.get('language', 'zh'); // 默认中文
        this.tabOrder = Storage.get('tabOrder', [1, 2, 3, 4, 5, 6]); // 默认顺序：账号、积分、阅读、CDK、排名、设置

        // 国际化文本配置
        this.i18n = {
            zh: {
                panelTitle: '📚 Linux.do 助手',
                minimizedText: '助手',
                expandPanel: '点击展开控制面板',
                switchToCollapse: '切换到折叠布局',
                switchToTab: '切换到标签页布局',
                minimize: '最小化',
                tabAccount: '账号',
                tabCredits: '积分',
                tabRead: '阅读',
                tabCdk: 'CDK',
                tabRank: '排名',
                tabSettings: '设置',
                sectionAutoRead: '📖 自动阅读',
                sectionModeSettings: '⚙️ 模式设置',
                sectionArticleTools: '📖 文章页功能',
                sectionAccountInfo: '📊 账号信息',
                sectionCredit: '💰 Credit 积分',
                sectionRanking: '🏆 排行榜',
                sectionPluginSettings: '🔧 插件设置',
                startReading: '开始阅读',
                stopReading: '停止阅读',
                randomFloor: '随机楼层',
                randomFloorTip: '随机跳转到某个楼层（抽奖用）',
                batchShowInfo: '批量展示信息',
                batchShowInfoTip: '批量展示当前页面所有已加载回复的用户信息',
                clearCooldown: '清除冷却',
                clearCooldownTip: '清除点赞冷却时间，立即恢复点赞功能',
                clearPageHistory: '清空页码',
                clearPageHistoryTip: '清空续读页码记录，下次从第1页开始',
                pageHistoryCleared: '页码记录已清空',
                refresh: '🔄 刷新',
                refreshing: '刷新中...',
                resetTabOrder: '重置标签页顺序',
                detailInfo: '📊 详细信息 →',
                autoLikeTopic: '👍 自动点赞',
                quickLikeReply: '⚡ 快速点赞',
                cleanMode: '✨ 清爽模式',
                grayscaleMode: '🎨 黑白灰模式',
                readUnread: '📬 读取未读',
                myRanking: '🏆 我的排名',
                dailyRank: '日榜',
                weeklyRank: '周榜',
                monthlyRank: '月榜',
                quarterlyRank: '季榜',
                yearlyRank: '年榜',
                allTimeRank: '总榜',
                points: '分',
                modeSettingsLabel: '模式设置',
                languageLabel: '🌐 语言 / Language',
                tabOrderLabel: '📋 标签页排序',
                tabOrderTip: '💡 拖拽顶部标签按钮可自定义排序',
                layoutSwitchTip: '💡 点击面板标题栏的 ⫼ 按钮可切换到标签页布局',
                userCredits: '的积分',
                loading: '加载中...',
                loadingRank: '加载排名数据...',
                loadingCredits: '加载积分...',
                loadingLevel: '加载等级信息...',
                clickToLoad: '点击展开加载...',
                clickToLoadRank: '点击展开加载排名...',
                clickToLoadCredits: '点击展开加载积分...',
                loadFailed: '加载失败，请点击刷新重试',
                notLoggedIn: '未登录',
                notSupported: '当前站点不支持此功能',
                tabOrderUpdated: '标签页顺序已更新',
                tabOrderReset: '标签页顺序已重置',
                switchedToChinese: '已切换到中文',
                switchedToEnglish: 'Switched to English',
                switchedToCollapse: '已切换到折叠布局',
                switchedToTab: '已切换到标签页布局',
                update: '更新',
                remaining: '剩余',
                hours: '小时',
                minutes: '分',
                seconds: '秒',
                likeCooldownCleared: '✅ 点赞冷却已清除，可以正常点赞了！',
                noCooldown: '当前没有点赞冷却',
                ipRateLimited: '🚫 IP 被限流，自动阅读已暂停',
                ipRateLimitWait: '将在 30 分钟后自动恢复',
                ipRateLimitResume: '✅ IP 限流已解除，恢复自动阅读',
                ipRateLimitDetected: '检测到 IP 限流',
                loadingComplete: '加载完成',
                loadingFailed: '加载失败',
                noUnreadPosts: '📭 没有未读帖子，将切换到最新帖子',
                creditAvailable: '可用积分',
                creditTomorrow: '🌟 明日积分',
                creditTodayRank: '📊 今日排名',
                creditCurrentPoints: '📈 当前点数',
                creditYesterdayPoints: '📅 昨日点数',
                creditRankLabel: '排名',
                creditCommunityBalance: '社区积分',
                creditDailyLimit: '今日剩余额度',
                creditTotalIncome: '总收入',
                creditTotalExpense: '总支出',
                creditRecentIncome: '近7天收入',
                creditRecentExpense: '近7天支出',
                creditViewDetails: '查看详情 →',
                creditLoginRequired: '请先登录 credit.linux.do',
                creditGoLogin: '去登录',
                creditTransfer: '💸 转账',
                creditTransferTitle: '积分转账',
                creditTransferTo: '转账给',
                creditSelectAmount: '选择金额',
                creditCustomAmount: '自定义金额',
                creditRemark: '转账备注',
                creditRemarkPlaceholder: '选填，留言给对方',
                creditPayPassword: '支付密码',
                creditPayPasswordPlaceholder: '请输入支付密码',
                creditConfirmPay: '确认支付',
                creditProcessing: '处理中...',
                creditTransferSuccess: '✅ 转账成功！',
                creditTransferFailed: '❌ 转账失败',
                creditNetworkError: '❌ 网络请求错误',
                creditInvalidAmount: '请输入有效的金额',
                creditEnterPassword: '请输入支付密码',
                creditRecipient: '接收人',
                creditAmount: '金额',
                creditBack: '返回',
                creditCancel: '取消',
                creditNextStep: '下一步',
                restStart: '开始休息',
                restEnd: '休息结束，继续浏览',
                likeLimitReached: '点赞已达上限，将在 ',
                likeCoolingDown: '点赞功能冷却中',
                likeRemaining: '剩余点赞',
                likeUsed: '已用',
                likeCooldown: '冷却中',
                likeCountMismatch: '计数可能不准确，点击同步',
                likeSyncing: '同步中...',
                likeSyncSuccess: '同步成功',
                randomOrder: '🔀 随机阅读',
                randomOrderTip: '打乱帖子顺序，随机阅读',
                skipRead: '⏭️ 跳过已读',
                skipReadTip: '自动跳过已经阅读过的帖子',
                topicLimit: '📚 获取数量',
                topicLimitTip: '每次获取的帖子数量',
                restTimeLabel: '⏸️ 休息时间',
                restTimeTip: '连续阅读1小时后休息的时间（分钟）',
                stopAfterRead: '🛑 阅读限制',
                stopAfterReadTip: '阅读指定数量帖子后自动停止',
                stopAfterReadCount: '📖 阅读数量',
                stopAfterReadCountTip: '阅读多少帖子后停止',
                stopOnLikeLimit: '❤️ 点赞停止',
                stopOnLikeLimitTip: '点赞达到上限后自动停止阅读',
                stoppedByReadLimit: '✅ 已达到阅读数量限制，自动停止',
                stoppedByLikeLimit: '❤️ 点赞已达上限，自动停止阅读',
                // 点赞过滤相关
                likeFilterMode: '🎯 点赞过滤',
                likeFilterModeTip: '根据帖子已有赞数过滤，避免给奇怪的帖子点赞',
                likeFilterOff: '关闭',
                likeFilterThreshold: '阈值模式',
                likeFilterProbability: '概率模式',
                likeMinThreshold: '📊 最低赞数',
                likeMinThresholdTip: '帖子已有赞数大于此值才会点赞',
                likeFilterThresholdDesc: '只对赞数 ≥ 设定值的帖子点赞',
                likeFilterProbabilityDesc: '赞数越多点赞几率越高，0-1赞不点',
                likeSkippedLowLikes: '跳过低赞帖子',
                sessionReadCount: '本次已读',
                fetchingTopics: '📥 获取帖子中...',
                fetchProgress: '获取进度',
                totalFetched: '已获取',
                skippedRead: '跳过已读',
                unreadTopics: '未读帖子',
                latestTopics: '最新帖子',
                topicsReady: '帖子已就绪',
                currentReading: '📖 当前阅读',
                remainingTopics: '剩余帖子',
                todayRead: '今日阅读',
                totalRead: '总阅读',
                pageRange: '页码范围',
                startFromPage: '从第',
                pageUnit: '页',
                continueFetching: '续读中',
                // CDK 分数相关
                sectionCdk: '🎮 CDK 分数',
                cdkScore: 'CDK 分数',
                cdkTrustLevel: '信任等级',
                cdkUsername: '用户名',
                cdkNickname: '昵称',
                cdkNotAuth: '尚未登录 CDK',
                cdkAuthTip: '需先完成授权才能查看社区分数',
                cdkGoAuth: '前往登录',
                cdkScoreDesc: '基于徽章计算的社区信誉分',
                cdkMyReceived: '我的领取',
                cdkReceivedEmpty: '暂无领取记录',
                cdkProjectName: '项目',
                cdkCreator: '发布者',
                cdkContent: '内容',
                cdkReceivedAt: '领取时间',
                cdkCopy: '复制',
                cdkCopied: '已复制',
                cdkTotal: '共 {count} 条',
                cdkLoadingReceived: '加载领取记录...',
                loadingCdk: '加载 CDK 数据...',
                clickToLoadCdk: '点击展开加载 CDK 分数...',
                cdkRecentLimit: '最近20条',
                // 主题配色相关
                themeColorLabel: '🎨 主题配色',
                themeColorTip: '选择面板的主题配色方案',
                themePurple: '💜 紫罗兰',
                themeBlue: '💙 海洋蓝',
                themeGreen: '💚 森林绿',
                themeOrange: '🧡 暖阳橙',
                themePink: '💗 樱花粉',
                themeDark: '🖤 暗夜黑',
                themeChanged: '主题配色已切换',
                // 捐赠打赏相关
                donateLabel: '💝 捐赠打赏',
                donateTip: '如果觉得好用，可以请作者喝杯咖啡 ☕',
                donateAmount: '选择金额',
                // 下载位置相关
                downloadLocationLabel: '📁 下载位置',
                downloadLocationTip: '保存的文件会下载到浏览器默认下载文件夹',
                downloadLocationHint: '💡 如需更改位置，请在浏览器设置中开启"下载前询问保存位置"',
                downloadLocationPath: '默认路径：下载文件夹',
                // CloudFlare 5秒盾相关
                cfBypassLabel: '🛡️ CF 5秒盾',
                cfBypassTip: '当 CloudFlare 5秒盾检测失败时，自动跳转到 challenge 页面',
                cfBypassEnabled: 'CF 5秒盾自动跳转已启用',
                cfBypassDisabled: 'CF 5秒盾自动跳转已禁用',
                cfBypassDetected: '🛡️ 检测到 CF 验证失败，正在跳转...',
                cfBypassManual: '🛡️ 手动触发 CF 验证',
                cfBypassManualTip: '手动跳转到 CloudFlare challenge 页面',
                cfBypassAlreadyOnChallenge: '已在 Challenge 页面，无需跳转'
            },
            en: {
                panelTitle: '📚 Linux.do Helper',
                minimizedText: 'Help',
                expandPanel: 'Click to expand panel',
                switchToCollapse: 'Switch to collapse layout',
                switchToTab: 'Switch to tab layout',
                minimize: 'Minimize',
                tabAccount: 'Account',
                tabCredits: 'Credits',
                tabRead: 'Read',
                tabCdk: 'CDK',
                tabRank: 'Rank',
                tabSettings: 'Settings',
                sectionAutoRead: '📖 Auto Read',
                sectionModeSettings: '⚙️ Mode Settings',
                sectionArticleTools: '📖 Article Tools',
                sectionAccountInfo: '📊 Account Info',
                sectionCredit: '💰 Credit Points',
                sectionRanking: '🏆 Leaderboard',
                sectionPluginSettings: '🔧 Plugin Settings',
                startReading: 'Start Reading',
                stopReading: 'Stop Reading',
                randomFloor: 'Random Floor',
                randomFloorTip: 'Jump to a random floor (for lottery)',
                batchShowInfo: 'Batch Show Info',
                batchShowInfoTip: 'Show user info for all loaded replies',
                clearCooldown: 'Clear Cooldown',
                clearCooldownTip: 'Clear like cooldown immediately',
                clearPageHistory: 'Clear Pages',
                clearPageHistoryTip: 'Clear page history, start from page 1 next time',
                pageHistoryCleared: 'Page history cleared',
                refresh: '🔄 Refresh',
                refreshing: 'Refreshing...',
                resetTabOrder: 'Reset Tab Order',
                detailInfo: '📊 Details →',
                autoLikeTopic: '👍 Auto Like',
                quickLikeReply: '⚡ Quick Like',
                cleanMode: '✨ Clean Mode',
                grayscaleMode: '🎨 Grayscale',
                readUnread: '📬 Unread',
                myRanking: '🏆 My Ranking',
                dailyRank: 'Daily',
                weeklyRank: 'Weekly',
                monthlyRank: 'Monthly',
                quarterlyRank: 'Quarterly',
                yearlyRank: 'Yearly',
                allTimeRank: 'All Time',
                points: 'pts',
                modeSettingsLabel: 'Mode Settings',
                languageLabel: '🌐 Language / 语言',
                tabOrderLabel: '📋 Tab Order',
                tabOrderTip: '💡 Drag tab buttons above to customize order',
                layoutSwitchTip: '💡 Click ⫼ button in header to switch to tab layout',
                userCredits: "'s Credits",
                loading: 'Loading...',
                loadingRank: 'Loading rankings...',
                loadingCredits: 'Loading credits...',
                loadingLevel: 'Loading level info...',
                clickToLoad: 'Click to expand and load...',
                clickToLoadRank: 'Click to load rankings...',
                clickToLoadCredits: 'Click to load credits...',
                loadFailed: 'Load failed, click refresh to retry',
                notLoggedIn: 'Not logged in',
                notSupported: 'Not supported on this site',
                tabOrderUpdated: 'Tab order updated',
                tabOrderReset: 'Tab order reset',
                switchedToChinese: '已切换到中文',
                switchedToEnglish: 'Switched to English',
                switchedToCollapse: 'Switched to collapse layout',
                switchedToTab: 'Switched to tab layout',
                update: 'Update',
                remaining: 'Remaining',
                hours: 'h',
                minutes: 'm',
                seconds: 's',
                likeCooldownCleared: '✅ Like cooldown cleared!',
                noCooldown: 'No like cooldown',
                ipRateLimited: '🚫 IP rate limited, auto reading paused',
                ipRateLimitWait: 'Will resume in 30 minutes',
                ipRateLimitResume: '✅ IP rate limit lifted, resuming auto reading',
                ipRateLimitDetected: 'IP rate limit detected',
                loadingComplete: 'Complete',
                loadingFailed: 'Failed',
                noUnreadPosts: '📭 No unread posts, switching to latest',
                creditAvailable: 'Available Credits',
                creditTomorrow: '🌟 Tomorrow Credits',
                creditTodayRank: '📊 Today Rank',
                creditCurrentPoints: '📈 Current Points',
                creditYesterdayPoints: '📅 Yesterday Points',
                creditRankLabel: 'Rank',
                creditCommunityBalance: 'Community Credits',
                creditDailyLimit: 'Daily Limit Left',
                creditTotalIncome: 'Total Income',
                creditTotalExpense: 'Total Expense',
                creditRecentIncome: 'Recent 7 Days Income',
                creditRecentExpense: 'Recent 7 Days Expense',
                creditViewDetails: 'View Details →',
                creditLoginRequired: 'Please login to credit.linux.do',
                creditGoLogin: 'Go Login',
                creditTransfer: '💸 Transfer',
                creditTransferTitle: 'Credit Transfer',
                creditTransferTo: 'Transfer to',
                creditSelectAmount: 'Select Amount',
                creditCustomAmount: 'Custom Amount',
                creditRemark: 'Remark',
                creditRemarkPlaceholder: 'Optional, leave a message',
                creditPayPassword: 'Payment Password',
                creditPayPasswordPlaceholder: 'Enter payment password',
                creditConfirmPay: 'Confirm Payment',
                creditProcessing: 'Processing...',
                creditTransferSuccess: '✅ Transfer successful!',
                creditTransferFailed: '❌ Transfer failed',
                creditNetworkError: '❌ Network error',
                creditInvalidAmount: 'Please enter a valid amount',
                creditEnterPassword: 'Please enter payment password',
                creditRecipient: 'Recipient',
                creditAmount: 'Amount',
                creditBack: 'Back',
                creditCancel: 'Cancel',
                creditNextStep: 'Next',
                restStart: 'Taking a break',
                restEnd: 'Break over, resuming',
                likeLimitReached: 'Like limit reached, resuming in ',
                likeCoolingDown: 'Like cooldown in progress',
                likeRemaining: 'Remaining',
                likeUsed: 'Used',
                likeCooldown: 'Cooldown',
                likeCountMismatch: 'Count may be inaccurate, click to sync',
                likeSyncing: 'Syncing...',
                likeSyncSuccess: 'Sync success',
                randomOrder: '🔀 Random',
                randomOrderTip: 'Shuffle topics, read randomly',
                skipRead: '⏭️ Skip Read',
                skipReadTip: 'Auto skip already read topics',
                topicLimit: '📚 Limit',
                topicLimitTip: 'Number of topics to fetch',
                restTimeLabel: '⏸️ Rest',
                restTimeTip: 'Rest time after 1 hour of continuous reading (minutes)',
                stopAfterRead: '🛑 Read Limit',
                stopAfterReadTip: 'Auto stop after reading specified number of topics',
                stopAfterReadCount: '📖 Read Count',
                stopAfterReadCountTip: 'Stop after reading this many topics',
                stopOnLikeLimit: '❤️ Like Stop',
                stopOnLikeLimitTip: 'Auto stop reading when like limit reached',
                stoppedByReadLimit: '✅ Read limit reached, auto stopped',
                stoppedByLikeLimit: '❤️ Like limit reached, auto stopped reading',
                // Like filter related
                likeFilterMode: '🎯 Like Filter',
                likeFilterModeTip: 'Filter by existing likes to avoid liking odd posts',
                likeFilterOff: 'Off',
                likeFilterThreshold: 'Threshold',
                likeFilterProbability: 'Probability',
                likeMinThreshold: '📊 Min Likes',
                likeMinThresholdTip: 'Only like posts with likes above this value',
                likeFilterThresholdDesc: 'Only like posts with likes ≥ threshold',
                likeFilterProbabilityDesc: 'Higher likes = higher chance, 0-1 likes skipped',
                likeSkippedLowLikes: 'Skipped low-likes post',
                sessionReadCount: 'Session read',
                fetchingTopics: '📥 Fetching topics...',
                fetchProgress: 'Progress',
                totalFetched: 'Fetched',
                skippedRead: 'Skipped read',
                unreadTopics: 'Unread topics',
                latestTopics: 'Latest topics',
                topicsReady: 'Topics ready',
                currentReading: '📖 Reading',
                remainingTopics: 'Remaining',
                todayRead: 'Today',
                totalRead: 'Total',
                pageRange: 'Page range',
                startFromPage: 'From page ',
                pageUnit: '',
                continueFetching: 'Continuing',
                // CDK Score related
                sectionCdk: '🎮 CDK Score',
                cdkScore: 'CDK Score',
                cdkTrustLevel: 'Trust Level',
                cdkUsername: 'Username',
                cdkNickname: 'Nickname',
                cdkNotAuth: 'CDK Not Logged In',
                cdkAuthTip: 'Please authorize to view CDK score',
                cdkGoAuth: 'Go to Login',
                cdkScoreDesc: 'Community reputation based on badges',
                cdkMyReceived: 'My Received',
                cdkReceivedEmpty: 'No received items',
                cdkProjectName: 'Project',
                cdkCreator: 'Creator',
                cdkContent: 'Content',
                cdkReceivedAt: 'Received at',
                cdkCopy: 'Copy',
                cdkCopied: 'Copied',
                cdkTotal: 'Total: {count}',
                cdkLoadingReceived: 'Loading received items...',
                loadingCdk: 'Loading CDK data...',
                clickToLoadCdk: 'Click to load CDK score...',
                cdkRecentLimit: 'Recent 20',
                // Theme color related
                themeColorLabel: '🎨 Theme Color',
                themeColorTip: 'Choose panel theme color scheme',
                themePurple: '💜 Purple',
                themeBlue: '💙 Ocean Blue',
                themeGreen: '💚 Forest Green',
                themeOrange: '🧡 Warm Orange',
                themePink: '💗 Sakura Pink',
                themeDark: '🖤 Dark Night',
                themeChanged: 'Theme color changed',
                // Donate related
                donateLabel: '💝 Donate',
                donateTip: 'If you find it useful, buy the author a coffee ☕',
                donateAmount: 'Select Amount',
                // Download location related
                downloadLocationLabel: '📁 Download Location',
                downloadLocationTip: 'Saved files will be downloaded to browser default download folder',
                downloadLocationHint: '💡 To change location, enable "Ask where to save" in browser settings',
                downloadLocationPath: 'Default: Downloads folder',
                // CloudFlare bypass related
                cfBypassLabel: '🛡️ CF Bypass',
                cfBypassTip: 'Auto redirect to challenge page when CloudFlare protection fails',
                cfBypassEnabled: 'CF bypass auto redirect enabled',
                cfBypassDisabled: 'CF bypass auto redirect disabled',
                cfBypassDetected: '🛡️ CF verification failed, redirecting...',
                cfBypassManual: '🛡️ Manual CF Verify',
                cfBypassManualTip: 'Manually redirect to CloudFlare challenge page',
                cfBypassAlreadyOnChallenge: 'Already on Challenge page, no redirect needed'
            }
        };

        // 获取国际化文本的辅助方法
        this.t = (key) => {
            const lang = this.language || 'zh';
            return (this.i18n && this.i18n[lang] && this.i18n[lang][key]) || key;
        };

        // 使用 sessionStorage 存储窗口独立的状态
        this.accumulatedTime = this.getSessionStorage('accumulatedTime', 0);
        this.lastActionTime = Date.now();
        this.isTopicPage = window.location.href.includes("/t/topic/");

        // 检查是否是新开的窗口（通过 window.opener 判断）
        // 如果是新开的窗口，不继承自动阅读状态，确保窗口独立性
        const isNewWindow = window.opener !== null;
        if (isNewWindow) {
            // 新开的窗口，清除可能继承的自动阅读状态
            this.autoRunning = false;
            this.setSessionStorage('autoRunning', false);
            this.topicList = [];
            this.setSessionStorage('topicList', []);
            console.log('[窗口独立] 检测到新开窗口，已清除继承的自动阅读状态');
        } else {
            this.autoRunning = this.getSessionStorage('autoRunning', false);
            this.topicList = this.getSessionStorage('topicList', []);
        }

        // 使用 localStorage 存储全局共享的状态
        this.tabMode = Storage.get('tabMode', false); // 标签页切换模式
        // 如果正在自动阅读且是标签页模式，强制显示阅读标签页（标签3）
        if (this.autoRunning && this.tabMode) {
            this.activeTab = 3;
            console.log('[标签页] 自动阅读运行中，强制切换到阅读标签页');
        } else {
            this.activeTab = Storage.get('activeTab', 1); // 当前激活的标签页 (1, 2, 3, 4)
        }
        this.firstUseChecked = Storage.get('firstUseChecked', false);
        this.likesCount = Storage.get('likesCount', 0);
        this.selectedPost = Storage.get('selectedPost', null);
        this.autoLikeEnabled = Storage.get('autoLikeEnabled', false);
        this.quickLikeEnabled = Storage.get('quickLikeEnabled', false);
        this.cleanModeEnabled = Storage.get('cleanModeEnabled', false);
        this.grayscaleModeEnabled = Storage.get('grayscaleModeEnabled', false);
        this.themeColor = Storage.get('themeColor', 'purple'); // 主题配色：purple, blue, green, orange, pink, dark

        // 主题配色配置（必须在 setupButton 之前定义，因为 createThemeSelector 需要使用）
        this.themeConfigs = {
            purple: {
                name: 'themePurple',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                primary: '#667eea',
                secondary: '#764ba2'
            },
            blue: {
                name: 'themeBlue',
                gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                primary: '#2193b0',
                secondary: '#6dd5ed'
            },
            green: {
                name: 'themeGreen',
                gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                primary: '#11998e',
                secondary: '#38ef7d'
            },
            orange: {
                name: 'themeOrange',
                gradient: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)',
                primary: '#f2994a',
                secondary: '#f2c94c'
            },
            pink: {
                name: 'themePink',
                gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
                primary: '#ee9ca7',
                secondary: '#ffdde1'
            },
            dark: {
                name: 'themeDark',
                gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                primary: '#232526',
                secondary: '#414345'
            }
        };

        this.readUnreadEnabled = Storage.get('readUnreadEnabled', false);
        this.randomOrderEnabled = Storage.get('randomOrderEnabled', false); // 随机顺序阅读
        this.skipReadEnabled = Storage.get('skipReadEnabled', true); // 跳过已读帖子（默认开启）
        this.topicLimitCount = Storage.get('topicLimitCount', 100); // 获取帖子数量
        this.restTimeMinutes = Storage.get('restTimeMinutes', 10); // 休息时间（分钟），默认10分钟

        // 新增：阅读帖子数量限制功能
        this.stopAfterReadEnabled = Storage.get('stopAfterReadEnabled', false); // 是否开启阅读数量限制
        this.stopAfterReadCount = Storage.get('stopAfterReadCount', 10); // 阅读多少帖子后停止
        this.currentSessionReadCount = this.getSessionStorage('currentSessionReadCount', 0); // 当前会话已阅读数量

        // 新增：点赞上限停止阅读功能
        this.stopOnLikeLimitEnabled = Storage.get('stopOnLikeLimitEnabled', false); // 点赞达到上限后是否停止阅读

        // 新增：点赞过滤功能
        this.likeFilterMode = Storage.get('likeFilterMode', 'off'); // 'off' | 'threshold' | 'probability'
        this.likeMinThreshold = Storage.get('likeMinThreshold', 5); // 最低点赞数阈值

        // 新增：CloudFlare 5秒盾自动跳转功能
        this.cfBypassEnabled = Storage.get('cfBypassEnabled', true); // 默认开启

        this.likedTopics = Storage.get('likedTopics', []);
        this.quickLikedFloors = Storage.get('quickLikedFloors', {}); // 记录快速点赞过的楼层 {topicId: [floor1, floor2...]}
        this.panelMinimized = Storage.get('panelMinimized', false);
        this.panelPosition = Storage.get('panelPosition', { x: null, y: null });
        this.likeResumeTime = Storage.get('likeResumeTime', null);
        this.ipRateLimitResumeTime = Storage.get('ipRateLimitResumeTime', null); // IP 限流恢复时间
        this.ipRateLimitCheckInterval = null; // IP 限流恢复检测定时器
        this.currentUsername = null; // 当前用户名
        this.lastDetectedUser = null; // 上次检测到的用户名（用于账号切换检测）
        this.readTopics = []; // 当前用户的已阅读帖子列表，初始化后会加载
        this.skippedReadCount = this.getSessionStorage('skippedReadCount', 0); // 本次会话跳过的已读帖子数
        this.todayReadCount = this.loadTodayReadCount(); // 今日阅读帖子数
        this.totalReadCount = Storage.get('totalReadCount', 0); // 总阅读帖子数

        // 页码续读功能
        this.lastFetchedPage = this.getSessionStorage('lastFetchedPage', 0); // 当前会话上次获取到的最大页码
        this.historicalMaxPage = this.loadHistoricalMaxPage(); // 历史最大已读页码（跨天保存）

        // 检查是否到达恢复点赞的时间
        this.checkLikeResumeTime();
        // 监听点赞限制弹窗
        this.observeLikeLimit();
        // 检查 IP 限流状态并检测当前页面
        this.checkIpRateLimitStatus();
        this.detectIpRateLimit();

        this.setupButton();
        // 根据当前布局和激活状态决定是否加载账号信息
        this.initDataLoading();
        this.startUserSwitchMonitoring(); // 启动账号切换监控
        this.initFloorNumberDisplay();
        this.setupWindowResizeHandler(); // 设置窗口大小调整处理
        this.applyCleanModeStyles();
        this.applyGrayscaleModeStyles();
        this.initOnlyOwnerView();

        if (!this.firstUseChecked) {
            this.handleFirstUse();
        } else if (this.autoRunning) {
            // 先加载阅读历史，再恢复自动阅读
            this.loadUserReadHistory().then(() => {
                // 页面刷新后恢复阅读状态显示
                if (this.topicList.length > 0) {
                    // 延迟一点确保 DOM 已创建
                    setTimeout(() => this.updateReadingStatus(), 100);
                }

                if (this.isTopicPage) {
                    this.startScrolling();
                    if (this.autoLikeEnabled) {
                        this.autoLikeTopic();
                    }
                } else {
                    this.getLatestTopics().then(() => this.navigateNextTopic());
                }
            });
        } else {
            // 非自动运行模式，也加载阅读历史
            this.loadUserReadHistory();
        }

        // 启动导航守护程序 - 防止卡住
        this.startNavigationGuard();

        // 初始化用户信息助手 - 默认启用，让每个窗口独立工作
        this.userInfoHelper = new UserInfoHelper();

        // 初始化点赞计数器（仅在 linux.do 和 idcflare.com 上启用）
        if (CURRENT_DOMAIN === 'linux.do' || CURRENT_DOMAIN === 'idcflare.com') {
            this.initLikeCounter();
        }

        // 启动等级监控（60秒刷新一次）- 默认启用
        this.startTrustLevelMonitor();

        // 应用保存的主题配色
        this.applyThemeColor();

        // 初始化 CloudFlare 5秒盾自动跳转功能（仅在 linux.do 上启用）
        if (CURRENT_DOMAIN === 'linux.do') {
            this.initCloudFlareBypass();
        }
    }

    // 应用主题配色
    applyThemeColor() {
        const theme = this.themeConfigs[this.themeColor] || this.themeConfigs.purple;

        // 更新面板背景渐变
        if (this.container) {
            this.container.style.background = theme.gradient;
        }

        // 更新模态框样式（如果存在）
        const modals = document.querySelectorAll('.ld-modal');
        modals.forEach(modal => {
            modal.style.background = theme.gradient;
        });

        console.log(`[主题] 已应用主题配色: ${this.themeColor}`);
    }

    // 切换主题配色
    switchTheme(themeName) {
        if (!this.themeConfigs[themeName]) {
            console.warn(`[主题] 未知的主题: ${themeName}`);
            return;
        }

        this.themeColor = themeName;
        Storage.set('themeColor', themeName);
        this.applyThemeColor();

        // 更新主题选择器 UI
        this.updateThemeSelectorUI();

        this.showNotification(this.t('themeChanged'));
        console.log(`[主题] 切换到主题: ${themeName}`);
    }

    // 更新主题选择器 UI
    updateThemeSelectorUI() {
        const themeButtons = this.container?.querySelectorAll('.theme-btn');
        if (!themeButtons) return;

        themeButtons.forEach(btn => {
            const btnTheme = btn.getAttribute('data-theme');
            if (btnTheme === this.themeColor) {
                btn.classList.add('active');
                btn.style.border = '2px solid white';
                btn.style.transform = 'scale(1.1)';
            } else {
                btn.classList.remove('active');
                btn.style.border = '2px solid transparent';
                btn.style.transform = 'scale(1)';
            }
        });
    }

    // 创建主题选择器 UI
    createThemeSelector() {
        const container = document.createElement('div');
        container.className = 'theme-selector';
        container.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 8px;
        `;

        Object.entries(this.themeConfigs).forEach(([key, config]) => {
            const btn = document.createElement('button');
            btn.className = 'theme-btn';
            btn.setAttribute('data-theme', key);
            btn.style.cssText = `
                width: 100%;
                height: 36px;
                border-radius: 8px;
                border: 2px solid ${this.themeColor === key ? 'white' : 'transparent'};
                background: ${config.gradient};
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                color: white;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                transform: ${this.themeColor === key ? 'scale(1.1)' : 'scale(1)'};
            `;
            btn.innerHTML = this.t(config.name);
            btn.title = this.t(config.name);

            btn.addEventListener('mouseenter', () => {
                if (this.themeColor !== key) {
                    btn.style.transform = 'scale(1.05)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (this.themeColor !== key) {
                    btn.style.transform = 'scale(1)';
                    btn.style.boxShadow = 'none';
                }
            });

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.switchTheme(key);
            });

            if (this.themeColor === key) {
                btn.classList.add('active');
            }

            container.appendChild(btn);
        });

        return container;
    }

    // 创建捐赠选择器 UI
    createDonateSelector() {
        const container = document.createElement('div');
        container.className = 'donate-selector';
        container.style.cssText = `
            margin-top: 8px;
        `;

        // 提示文字
        const tip = document.createElement('div');
        tip.style.cssText = `
            font-size: 11px;
            color: rgba(255,255,255,0.8);
            margin-bottom: 10px;
            text-align: center;
        `;
        tip.textContent = this.t('donateTip');
        container.appendChild(tip);

        // 捐赠金额配置
        const donateAmounts = [
            { amount: '1.11', label: '☕ ¥1.11', url: 'https://credit.linux.do/paying/online?token=e2bc4ebae3625ddf613b489e105094bc14d0bde1a648beacb8cd711dcf20bc97' },
            { amount: '6.66', label: '🍵 ¥6.66', url: 'https://credit.linux.do/paying/online?token=668d72d7f70d7f8df24e1b187a2fec24a963da5fe5b058d519a5a9d4562b73dd' },
            { amount: '8.88', label: '🧋 ¥8.88', url: 'https://credit.linux.do/paying/online?token=1650f213ec6f17d7ba5a06f3dde623ef56c0faa3c6c711c782840f896cb74781' },
            { amount: '18.88', label: '🍰 ¥18.88', url: 'https://credit.linux.do/paying/online?token=2194e9c75da735ed860b56a5efe233e6c9ff2a965377f92de4b7c18c8bd4bdeb' }
        ];

        // 按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        `;

        donateAmounts.forEach(item => {
            const btn = document.createElement('a');
            btn.href = item.url;
            btn.target = '_blank';
            btn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px 8px;
                border-radius: 8px;
                background: linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.3) 100%);
                border: 1px solid rgba(255,215,0,0.4);
                color: white;
                text-decoration: none;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.2s;
                cursor: pointer;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            `;
            btn.textContent = item.label;

            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = '0 4px 12px rgba(255,215,0,0.4)';
                btn.style.background = 'linear-gradient(135deg, rgba(255,215,0,0.5) 0%, rgba(255,165,0,0.5) 100%)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
                btn.style.background = 'linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.3) 100%)';
            });

            btnContainer.appendChild(btn);
        });

        container.appendChild(btnContainer);

        return container;
    }

    // 初始化点赞计数器
    initLikeCounter() {
        // 创建全局实例（如果还没有）
        if (!globalLikeCounter) {
            globalLikeCounter = new LikeCounter();
        }
        this.likeCounter = globalLikeCounter;

        // 注册 UI 更新回调
        this.likeCounter.onUIUpdate((status) => {
            this.updateLikeCounterUI(status);

            // 如果进入冷却状态，自动关闭点赞开关
            if (status.isInCooldown) {
                if (this.autoLikeEnabled || this.quickLikeEnabled) {
                    this.autoLikeEnabled = false;
                    this.quickLikeEnabled = false;
                    Storage.set('autoLikeEnabled', false);
                    Storage.set('quickLikeEnabled', false);
                    this.updateLikeToggleUI();
                    console.log('[LikeCounter] 检测到冷却，已自动关闭点赞功能');
                }
            }
        });

        // 初始更新 UI
        setTimeout(() => {
            this.updateLikeCounterUI(this.likeCounter.getStatus());
        }, 500);
    }

    // 更新点赞计数器 UI
    updateLikeCounterUI(status) {
        if (!this.likeCounterContainer) return;

        const { remaining, used, limit, isInCooldown, cooldownFormatted, matched } = status;

        // 如果是冷却状态且定时器已在运行，只更新时间显示，不重建整个UI
        if (isInCooldown && this.likeCounterCooldownTimer) {
            const timeSpan = this.likeCounterContainer.querySelector('.like-cooldown-time');
            if (timeSpan && cooldownFormatted) {
                timeSpan.textContent = cooldownFormatted;
                return; // 定时器已在运行，直接返回
            }
        }

        // 清除之前的冷却倒计时定时器
        if (this.likeCounterCooldownTimer) {
            clearInterval(this.likeCounterCooldownTimer);
            this.likeCounterCooldownTimer = null;
        }

        let html = '';
        if (isInCooldown && cooldownFormatted) {
            // 冷却状态
            html = `
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 11px; color: #ff6b6b;">🔥 ${this.t('likeCooldown')}</span>
                    <span class="like-cooldown-time" style="font-size: 13px; font-weight: bold; color: #ff6b6b;">${cooldownFormatted}</span>
                </div>
            `;
            this.likeCounterContainer.style.background = 'linear-gradient(135deg, rgba(255,107,107,0.3) 0%, rgba(255,107,107,0.15) 100%)';
            this.likeCounterContainer.style.borderColor = 'rgba(255,107,107,0.4)';

            // 启动每秒更新倒计时（只有当定时器不存在时才创建）
            if (!this.likeCounterCooldownTimer) {
                this.likeCounterCooldownTimer = setInterval(() => {
                    if (!this.likeCounter) return;
                    const newFormatted = this.likeCounter.formatCooldown();
                    const timeSpan = this.likeCounterContainer?.querySelector('.like-cooldown-time');
                    if (timeSpan && newFormatted) {
                        timeSpan.textContent = newFormatted;
                    } else if (!newFormatted) {
                        // 冷却结束，重新获取完整状态并更新UI
                        clearInterval(this.likeCounterCooldownTimer);
                        this.likeCounterCooldownTimer = null;
                        this.updateLikeCounterUI(this.likeCounter.getStatus());
                    }
                }, 1000);
            }
        } else {
            // 正常状态
            const percentage = limit > 0 ? Math.round((remaining / limit) * 100) : 0;
            const color = percentage > 50 ? '#7dffb3' : (percentage > 20 ? '#ffd700' : '#ff6b6b');

            html = `
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        ${!matched ? `<span class="like-sync-btn" title="${this.t('likeCountMismatch')}" style="cursor: pointer; opacity: 0.7;">⚠️</span>` : ''}
                        <span style="font-size: 11px; color: rgba(255,255,255,0.8);">❤️ ${this.t('likeRemaining')}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 16px; font-weight: bold; color: ${color};">${remaining}</span>
                        <span style="font-size: 11px; color: rgba(255,255,255,0.6);">/ ${limit}</span>
                    </div>
                </div>
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin-top: 4px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: ${color}; border-radius: 2px; transition: width 0.3s;"></div>
                </div>
            `;
            this.likeCounterContainer.style.background = 'rgba(255, 255, 255, 0.1)';
            this.likeCounterContainer.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }

        this.likeCounterContainer.innerHTML = html;

        // 绑定同步按钮点击事件
        const syncBtn = this.likeCounterContainer.querySelector('.like-sync-btn');
        if (syncBtn) {
            syncBtn.onclick = async (e) => {
                e.stopPropagation();
                syncBtn.textContent = '🔄';
                syncBtn.style.animation = 'spin 1s linear infinite';
                await this.likeCounter.manualSync();
                syncBtn.style.animation = '';
            };
        }

        // 同步更新清除冷却按钮的显示状态
        this.updateClearCooldownButton();
    }

    // 更新点赞开关 UI 状态
    updateLikeToggleUI() {
        const toggleRows = this.container?.querySelectorAll('.toggle-row');
        if (!toggleRows) return;

        for (const row of toggleRows) {
            const label = row.querySelector('.toggle-label');
            if (label && (label.textContent.includes('自动点赞') || label.textContent.includes('Auto Like'))) {
                const input = row.querySelector('input[type="checkbox"]');
                if (input) input.checked = this.autoLikeEnabled;
            }
            if (label && (label.textContent.includes('快速点赞') || label.textContent.includes('Quick Like'))) {
                const input = row.querySelector('input[type="checkbox"]');
                if (input) input.checked = this.quickLikeEnabled;
            }
        }
    }

    // 启动等级监控（60秒刷新一次）- 仅在账号信息可见时才刷新
    startTrustLevelMonitor() {
        // 如果已经有定时器在运行，先清除
        if (this.trustLevelMonitorInterval) {
            clearInterval(this.trustLevelMonitorInterval);
        }

        this.trustLevelMonitorInterval = setInterval(() => {
            // 检查是否应该刷新等级信息
            if (this.shouldRefreshAccountInfo()) {
                console.log('自动刷新等级信息...');
                this.loadUserTrustLevel(false);
            }
        }, 30 * 60 * 1000); // 30分钟

        console.log('等级监控已启动（30分钟刷新一次，仅在可见时）');
    }

    // 停止等级监控
    stopTrustLevelMonitor() {
        if (this.trustLevelMonitorInterval) {
            clearInterval(this.trustLevelMonitorInterval);
            this.trustLevelMonitorInterval = null;
            console.log('等级监控已停止');
        }
    }

    // 检查是否应该刷新账号信息
    shouldRefreshAccountInfo() {
        // 如果面板已最小化，不刷新
        if (this.panelMinimized) {
            return false;
        }

        // 标签页模式：只有当前激活的是账号标签页(1)时才刷新
        if (this.tabMode) {
            return this.activeTab === 1;
        }

        // 折叠模式：只有账号信息区展开时才刷新
        if (this.accountSection && this.accountSectionContent) {
            return !this.accountSection.classList.contains('collapsed');
        }

        return false;
    }

    // 检查是否应该刷新积分信息
    shouldRefreshCreditInfo() {
        if (this.panelMinimized) return false;
        if (this.tabMode) return this.activeTab === 2;
        if (this.creditSectionContent) {
            return !this.creditSectionContent.classList.contains('collapsed');
        }
        return false;
    }

    // 检查是否应该刷新排名信息
    shouldRefreshRankInfo() {
        if (this.panelMinimized) return false;
        if (this.tabMode) return this.activeTab === 5;
        if (this.rankSectionContent) {
            return !this.rankSectionContent.classList.contains('collapsed');
        }
        return false;
    }

    // 初始化数据加载 - 根据当前布局和激活状态决定加载哪些数据
    initDataLoading() {
        // 如果面板已最小化，不加载任何数据
        if (this.panelMinimized) {
            console.log('[初始化] 面板已最小化，跳过数据加载');
            return;
        }

        if (this.tabMode) {
            // 标签页模式：只加载当前激活标签页的数据
            console.log(`[初始化] 标签页模式，当前激活标签页: ${this.activeTab}`);
            switch (this.activeTab) {
                case 1: // 账号信息
                    this.loadUserTrustLevel();
                    break;
                case 2: // 积分
                    if (CURRENT_DOMAIN === 'linux.do') {
                        this.loadCreditInfo();
                    }
                    break;
                case 4: // CDK 分数
                    if (CURRENT_DOMAIN === 'linux.do') {
                        this.loadCdkInfo();
                    }
                    break;
                case 5: // 排名
                    this.loadRankingData();
                    break;
                // 其他标签页不需要初始加载数据
            }
        } else {
            // 折叠模式：只加载展开区域的数据
            console.log('[初始化] 折叠模式');

            // 检查账号信息区是否展开（默认展开，除非正在自动阅读）
            if (this.accountSection && !this.accountSection.classList.contains('collapsed')) {
                console.log('[初始化] 账号信息区已展开，加载数据');
                this.loadUserTrustLevel();
            } else {
                console.log('[初始化] 账号信息区已折叠，跳过加载');
            }

            // 积分区和排名区默认折叠，不需要初始加载
            // 它们会在展开时通过点击事件加载
        }
    }

    // 启动导航守护程序 - 检测页面是否卡住
    startNavigationGuard() {
        if (this.navigationGuardInterval) {
            clearInterval(this.navigationGuardInterval);
        }

        // 记录页面加载时间
        this.pageLoadTime = Date.now();
        this.lastPageUrl = window.location.href;

        // 每5秒检查一次页面状态
        this.navigationGuardInterval = setInterval(() => {
            if (!this.autoRunning) return;

            const currentTime = Date.now();
            const timeOnPage = currentTime - this.pageLoadTime;
            const currentUrl = window.location.href;

            // 检测URL是否改变
            if (currentUrl !== this.lastPageUrl) {
                console.log('✅ 页面已跳转，重置守护定时器');
                this.pageLoadTime = currentTime;
                this.lastPageUrl = currentUrl;
                return;
            }

            // 如果在同一个文章页面停留超过60秒且正在自动运行，说明可能卡住了
            if (this.isTopicPage && timeOnPage > 60000 && !this.isScrolling) {
                console.warn('⚠️ 检测到页面可能卡住（60秒未跳转且未滚动），尝试恢复...');
                this.recoverFromStuck();
            }

            // 如果不是文章页且停留超过30秒，也可能卡住
            if (!this.isTopicPage && timeOnPage > 30000) {
                console.warn('⚠️ 检测到在非文章页卡住，尝试恢复...');
                this.recoverFromStuck();
            }
        }, 5000);

        console.log('🛡️ 导航守护程序已启动');
    }

    // 从卡住状态恢复
    async recoverFromStuck() {
        console.log('🔧 开始恢复流程...');

        // 停止当前滚动
        this.stopScrolling();

        await Utils.sleep(1000);

        // 尝试继续流程
        if (this.isTopicPage) {
            console.log('📖 在文章页，重新开始滚动');
            this.startScrolling();
        } else {
            console.log('📋 在列表页，尝试导航到下一篇');
            if (this.topicList.length === 0) {
                await this.getLatestTopics();
            }
            await this.navigateNextTopic();
        }

        // 重置页面加载时间
        this.pageLoadTime = Date.now();
    }

    // 停止导航守护
    stopNavigationGuard() {
        if (this.navigationGuardInterval) {
            clearInterval(this.navigationGuardInterval);
            this.navigationGuardInterval = null;
            console.log('🛡️ 导航守护程序已停止');
        }
    }

    // sessionStorage 辅助方法（用于窗口独立状态）
    getSessionStorage(key, defaultValue = null) {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    setSessionStorage(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('SessionStorage error:', error);
            return false;
        }
    }

    addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --panel-expanded-width: auto;
                --panel-minimized-size: 50px;
                --panel-edge-margin: 30px;
                --panel-border-radius: 16px;
            }

            /* Credit 积分区样式 */
            .credit-info-row {
                background: rgba(255, 255, 255, 0.15);
                padding: 8px 12px;
                border-radius: 10px;
            }

            /* CDK 分数区样式 */
            .cdk-info-row {
                background: rgba(255, 255, 255, 0.15);
                padding: 8px 12px;
                border-radius: 10px;
            }

            .credit-main-stat {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 12px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                margin: 8px 0;
            }

            .credit-stat-label {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.9);
            }

            .credit-stat-value {
                font-size: 20px;
                font-weight: 700;
                color: #ffd700;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            .credit-section-title {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.7);
                margin: 10px 0 4px 0;
                padding-left: 2px;
            }

            .credit-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
                padding-top: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }

            .credit-link {
                color: rgba(255, 255, 255, 0.9) !important;
                text-decoration: none !important;
                font-size: 12px;
                transition: opacity 0.2s;
            }

            .credit-link:hover {
                opacity: 0.8;
            }

            .credit-update-time {
                font-size: 10px;
                color: rgba(255, 255, 255, 0.6);
            }

            .credit-login-btn {
                display: inline-block;
                padding: 6px 16px;
                background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                color: white !important;
                text-decoration: none !important;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.2s;
                margin-top: 8px;
            }

            .credit-login-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(72, 187, 120, 0.4);
            }

            /* 转账按钮样式 */
            .credit-transfer-btn {
                display: inline-block;
                padding: 6px 16px;
                background: linear-gradient(135deg, #e7c300 0%, #d1b100 100%);
                color: white !important;
                text-decoration: none !important;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.2s;
                border: none;
                cursor: pointer;
            }

            .credit-transfer-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(231, 195, 0, 0.4);
                background: linear-gradient(135deg, #d1b100 0%, #bfa000 100%);
            }

            /* 转账模态框样式 */
            .ld-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(3px);
            }

            .ld-modal {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                border-radius: 12px;
                width: 320px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .ld-modal h3 {
                margin: 0 0 15px 0;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding-bottom: 12px;
                font-size: 16px;
            }

            .ld-amount-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-bottom: 15px;
            }

            .ld-amount-btn {
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                background: rgba(255, 255, 255, 0.1);
                cursor: pointer;
                text-align: center;
                border-radius: 6px;
                color: white;
                transition: all 0.2s;
                font-weight: 500;
            }

            .ld-amount-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .ld-amount-btn.active {
                background: #e7c300;
                color: #333;
                border-color: #e7c300;
            }

            .ld-input-group {
                margin-bottom: 15px;
            }

            .ld-input-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 600;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.9);
            }

            .ld-input {
                width: 100%;
                padding: 10px 12px;
                box-sizing: border-box;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 14px;
            }

            .ld-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }

            .ld-input:focus {
                outline: none;
                border-color: #e7c300;
                background: rgba(255, 255, 255, 0.15);
            }

            .ld-actions {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-top: 20px;
            }

            .ld-btn {
                flex: 1;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                border: none;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.2s;
            }

            .ld-btn-cancel {
                background: rgba(255, 255, 255, 0.2);
                color: white;
            }

            .ld-btn-cancel:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .ld-btn-confirm {
                background: #e7c300;
                color: #333;
            }

            .ld-btn-confirm:hover {
                background: #d1b100;
            }

            .ld-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .ld-loading {
                text-align: center;
                padding: 30px;
                color: rgba(255, 255, 255, 0.9);
            }

            .ld-confirm-info {
                text-align: center;
                margin-bottom: 20px;
                line-height: 1.8;
                padding: 15px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
            }

            .ld-confirm-info strong {
                color: #e7c300;
            }

            .ld-confirm-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .ld-confirm-row:last-child {
                border-bottom: none;
            }

            .ld-confirm-label {
                color: rgba(255, 255, 255, 0.7);
                font-size: 13px;
            }

            .ld-confirm-value {
                color: #fff;
                font-size: 14px;
            }

            .section-collapsible {
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .section-collapsible .collapse-icon {
                transition: transform 0.3s;
                font-size: 10px;
            }

            .section-collapsible.collapsed .collapse-icon {
                transform: rotate(-90deg);
            }

            .section-collapsible-content {
                max-height: 1000px;
                overflow: hidden;
                transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
                opacity: 1;
            }

            .section-collapsible-content.collapsed {
                max-height: 0;
                opacity: 0;
            }

            /* 当折叠区域收起时，隐藏其后的分隔线 */
            .section-collapsible.collapsed + .section-collapsible-content + .section-divider {
                display: none;
            }

            .linuxdo-helper-panel {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: fit-content;
                min-width: 280px;
                max-width: 450px;
                max-height: calc(100vh - 40px);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: var(--panel-border-radius);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                overflow-y: auto;
                overflow-x: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                will-change: transform;
            }

            /* 标签页切换布局模式 */
            .linuxdo-helper-panel.tab-mode {
                min-width: 280px;
                max-width: 320px;
            }

            /* 标签页导航栏 - 双列布局 */
            .tab-nav {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 4px;
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            }

            .tab-nav-btn {
                padding: 5px 8px;
                border: none;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.7);
                font-size: 10px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 3px;
                white-space: nowrap;
            }

            .tab-nav-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                color: white;
            }

            .tab-nav-btn.active {
                background: rgba(255, 255, 255, 0.25);
                color: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            /* 拖拽时的样式 */
            .tab-nav-btn.dragging {
                opacity: 0.5;
                transform: scale(0.95);
            }

            .tab-nav-btn.drag-over {
                background: rgba(255, 255, 255, 0.35);
                border: 1px dashed rgba(255, 255, 255, 0.5);
            }


            /* 标签页内容区 */
            .lda-tab-content {
                display: none;
                padding: 12px;
                flex-direction: column;
                gap: 6px;
            }

            .lda-tab-content.active {
                display: flex;
            }

            .lda-tab-content-title {
                font-size: 13px;
                font-weight: 600;
                color: white;
                margin-bottom: 8px;
                padding-bottom: 6px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                gap: 6px;
            }

            /* 标签页模式下隐藏折叠标题和分隔线 */
            .linuxdo-helper-panel.tab-mode .section-divider,
            .linuxdo-helper-panel.tab-mode .section-collapsible {
                display: none;
            }

            /* 标签页模式下内容区始终显示 */
            .linuxdo-helper-panel.tab-mode .section-collapsible-content {
                max-height: none !important;
                opacity: 1 !important;
            }

            /* 标签页模式下隐藏默认的 panel-content */
            .linuxdo-helper-panel.tab-mode .panel-content {
                display: none;
            }

            /* 标签页容器 */
            .tab-container {
                transition: all 0.3s;
            }

            .tab-container.hidden {
                display: none !important;
            }

            /* 标签页模式下的子区域标题 */
            .tab-sub-section {
                margin-top: 10px;
                padding-top: 8px;
                border-top: 1px dashed rgba(255, 255, 255, 0.15);
            }

            .tab-sub-title {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            /* 小屏幕适配 - 高度小于 800px */
            @media screen and (max-height: 800px) {
                .linuxdo-helper-panel .panel-content {
                    padding: 8px;
                    gap: 4px;
                }

                .linuxdo-helper-panel .toggle-row {
                    padding: 4px 8px;
                    min-height: 22px;
                }

                .linuxdo-helper-panel .toggle-label {
                    font-size: 11px;
                }

                .linuxdo-helper-panel .section-title {
                    font-size: 11px;
                    margin: 2px 0;
                }

                .linuxdo-helper-panel .trust-level-item {
                    font-size: 10px;
                    margin: 2px 0;
                    padding: 2px 0;
                }

                .linuxdo-helper-panel .main-action-btn {
                    padding: 5px 10px;
                    font-size: 12px;
                    min-height: 26px;
                }

                .linuxdo-helper-panel .random-floor-btn,
                .linuxdo-helper-panel .reveal-users-btn {
                    padding: 4px 8px;
                    font-size: 11px;
                    min-height: 22px;
                    margin-bottom: 3px;
                }

                .linuxdo-helper-panel .section-divider {
                    margin: 3px 0;
                }

                .linuxdo-helper-panel .trust-level-row,
                .linuxdo-helper-panel .credit-info-row {
                    padding: 5px 8px;
                    margin-top: 3px;
                }

                .linuxdo-helper-panel .trust-level-header {
                    font-size: 11px;
                    margin-bottom: 4px;
                }

                .linuxdo-helper-panel .panel-header {
                    padding: 8px 12px;
                }

                .linuxdo-helper-panel .panel-title {
                    font-size: 12px;
                }

                .linuxdo-helper-panel .toggle-switch {
                    width: 32px;
                    height: 18px;
                }

                .linuxdo-helper-panel .toggle-slider:before {
                    height: 12px;
                    width: 12px;
                }

                .linuxdo-helper-panel .toggle-switch input:checked + .toggle-slider:before {
                    transform: translateX(14px);
                }
            }

            /* 更小屏幕适配 - 高度小于 650px */
            @media screen and (max-height: 650px) {
                .linuxdo-helper-panel .panel-content {
                    padding: 6px;
                    gap: 3px;
                }

                .linuxdo-helper-panel .toggle-row {
                    padding: 3px 6px;
                    min-height: 20px;
                }

                .linuxdo-helper-panel .toggle-label {
                    font-size: 10px;
                }

                .linuxdo-helper-panel .section-title {
                    font-size: 10px;
                    margin: 1px 0;
                }

                .linuxdo-helper-panel .trust-level-item {
                    font-size: 9px;
                    margin: 1px 0;
                    padding: 1px 0;
                }

                .linuxdo-helper-panel .main-action-btn {
                    padding: 4px 8px;
                    font-size: 11px;
                    min-height: 24px;
                }

                .linuxdo-helper-panel .random-floor-btn,
                .linuxdo-helper-panel .reveal-users-btn {
                    padding: 3px 6px;
                    font-size: 10px;
                    min-height: 20px;
                    margin-bottom: 2px;
                }

                .linuxdo-helper-panel .section-divider {
                    margin: 2px 0;
                }

                .linuxdo-helper-panel .trust-level-row,
                .linuxdo-helper-panel .credit-info-row {
                    padding: 4px 6px;
                    margin-top: 2px;
                }

                .linuxdo-helper-panel .trust-level-header {
                    font-size: 10px;
                    margin-bottom: 3px;
                }

                .linuxdo-helper-panel .panel-header {
                    padding: 6px 10px;
                }

                .linuxdo-helper-panel .panel-title {
                    font-size: 11px;
                }

                .linuxdo-helper-panel .trust-level-bar {
                    width: 50px;
                    height: 5px;
                }

                .linuxdo-helper-panel .trust-level-value {
                    font-size: 9px;
                    min-width: 40px;
                }

                .linuxdo-helper-panel .toggle-switch {
                    width: 28px;
                    height: 16px;
                }

                .linuxdo-helper-panel .toggle-slider:before {
                    height: 10px;
                    width: 10px;
                }

                .linuxdo-helper-panel .toggle-switch input:checked + .toggle-slider:before {
                    transform: translateX(12px);
                }
            }

            /* 窄屏幕适配 - 宽度小于 400px */
            @media screen and (max-width: 400px) {
                .linuxdo-helper-panel {
                    min-width: 220px;
                    max-width: calc(100vw - 30px);
                    right: 10px;
                }
            }

            .linuxdo-helper-panel:hover {
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
            }

            .linuxdo-helper-panel.minimized {
                width: var(--panel-minimized-size);
                height: var(--panel-minimized-size);
                min-width: var(--panel-minimized-size);
                border-radius: 50%;
                overflow: hidden;
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .linuxdo-helper-panel.minimized:hover {
                transform: scale(1.15);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
                opacity: 1;
            }

            /* 左边展开：从左向右 */
            .linuxdo-helper-panel.on-left {
                transform-origin: left center;
            }

            /* 右边展开：从右向左 */
            .linuxdo-helper-panel.on-right {
                transform-origin: right center;
            }

            .panel-header {
                background: rgba(255, 255, 255, 0.15);
                padding: 12px 16px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                transition: opacity 0.3s;
            }

            .linuxdo-helper-panel.minimized .panel-header {
                opacity: 0;
                pointer-events: none;
                padding: 0;
                height: 0;
                overflow: hidden;
            }

            .panel-header:active {
                cursor: grabbing;
            }

            .panel-title {
                color: white;
                font-weight: 600;
                font-size: 14px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .panel-controls {
                display: flex;
                gap: 8px;
            }

            .panel-control-btn {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                padding: 0;
                line-height: 1;
            }

            .panel-control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .panel-control-btn:active {
                transform: scale(0.95);
            }

            .minimized-icon {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 20px;
                font-weight: 700;
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                letter-spacing: -1px;
            }

            .linuxdo-helper-panel.minimized .minimized-icon {
                display: flex;
            }

            .linuxdo-helper-panel.minimized:hover .minimized-icon {
                transform: scale(1.1);
                text-shadow: 0 3px 8px rgba(255, 255, 255, 0.6);
            }

            .panel-content {
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                transition: all 0.3s;
                overflow: hidden;
                width: 100%;
                box-sizing: border-box;
            }

            /* 布局切换按钮 */
            .layout-toggle-btn {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                border: none;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                padding: 0;
                line-height: 1;
            }

            .layout-toggle-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .layout-toggle-btn:active {
                transform: scale(0.95);
            }

            .panel-content.hidden {
                max-height: 0;
                padding: 0;
                opacity: 0;
            }

            .linuxdo-helper-panel.minimized .panel-content {
                display: none;
            }

            .main-action-btn {
                width: 100%;
                padding: 8px 12px;
                font-size: 13px;
                font-weight: 600;
                background: white;
                color: #667eea;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                white-space: nowrap;
                overflow: hidden;
                min-height: 32px;
                line-height: 1.1;
            }

            .main-action-btn .btn-text {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                min-width: 0;
            }

            .main-action-btn .btn-icon {
                flex-shrink: 0;
                font-size: 14px;
            }

            .main-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }

            .main-action-btn:active {
                transform: translateY(0);
            }

            .main-action-btn.running {
                background: #ff6b6b;
                color: white;
            }

            .btn-icon {
                font-size: 18px;
            }

            .trust-level-row {
                background: rgba(255, 255, 255, 0.15);
                padding: 8px 12px;
                border-radius: 10px;
                margin-top: 8px;
            }

            .trust-level-header {
                color: white;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 6px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .trust-level-refresh {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }

            .trust-level-refresh:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
            }

            .trust-level-refresh:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .trust-level-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: rgba(255, 255, 255, 0.9);
                font-size: 11px;
                margin: 4px 0;
                padding: 3px 0;
                white-space: nowrap;
                gap: 4px;
            }

            .trust-level-name {
                flex-shrink: 0;
                width: 110px;
                min-width: 110px;
                margin-right: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .trust-level-progress {
                display: flex;
                align-items: center;
                gap: 4px;
                flex: 1;
                justify-content: flex-end;
            }

            .trust-level-bar {
                display: none; /* 暂时隐藏进度条 */
                /*
                width: 30px;
                flex-shrink: 0;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
                */
            }

            .trust-level-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #48bb78 0%, #68d391 100%);
                transition: width 0.3s;
            }

            .trust-level-bar-fill.completed {
                background: linear-gradient(90deg, #4299e1 0%, #63b3ed 100%);
            }

            .trust-level-value {
                font-size: 10px;
                color: rgba(255, 255, 255, 0.8);
                min-width: 75px;
                text-align: right;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 3px;
                flex-shrink: 0;
            }

            /* 数据变化指示器样式 */
            .change-indicator {
                font-size: 9px;
                font-weight: 600;
                padding: 1px 2px;
                border-radius: 3px;
                white-space: nowrap;
                flex-shrink: 0;
            }

            .change-indicator.change-up {
                color: #48bb78;
                background: rgba(72, 187, 120, 0.2);
            }

            .change-indicator.change-down {
                color: #fc8181;
                background: rgba(252, 129, 129, 0.2);
            }

            .trust-level-loading {
                color: rgba(255, 255, 255, 0.7);
                font-size: 11px;
                text-align: center;
                padding: 8px 0;
            }

            .random-floor-btn, .reveal-users-btn {
                width: 100%;
                padding: 7px 12px;
                font-size: 12px;
                font-weight: 600;
                background: rgba(255, 255, 255, 0.95);
                color: #667eea;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                min-height: 28px;
                line-height: 1.2;
                margin-bottom: 6px;
            }

            .reveal-users-btn {
                margin-bottom: 0;
            }

            .random-floor-btn .btn-text,
            .reveal-users-btn .btn-text {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                min-width: 0;
            }

            .random-floor-btn .btn-icon,
            .reveal-users-btn .btn-icon {
                flex-shrink: 0;
                font-size: 13px;
            }

            .random-floor-btn:hover, .reveal-users-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
                background: rgba(255, 255, 255, 1);
            }

            .random-floor-btn:active, .reveal-users-btn:active {
                transform: translateY(0);
            }

            .reveal-users-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }

            .toggle-row {
                background: rgba(255, 255, 255, 0.15);
                padding: 5px 10px;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
                min-height: 26px;
            }

            .toggle-row:hover {
                background: rgba(255, 255, 255, 0.22);
            }

            .toggle-label {
                color: white;
                font-size: 12px;
                font-weight: 500;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                flex: 1;
                min-width: 0;
                margin-right: 8px;
            }

            /* 双列开关网格布局 */
            .toggle-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
                margin-bottom: 6px;
            }

            .toggle-grid .toggle-row {
                padding: 4px 8px;
                min-height: 24px;
            }

            .toggle-grid .toggle-label {
                font-size: 11px;
            }

            .toggle-grid .toggle-switch {
                width: 32px;
                height: 18px;
                flex-shrink: 0;
            }

            .toggle-grid .toggle-slider:before {
                height: 12px;
                width: 12px;
            }

            .toggle-grid .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(14px);
            }

            .toggle-switch {
                position: relative;
                width: 36px;
                height: 20px;
                flex-shrink: 0;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.3);
                transition: 0.3s;
                border-radius: 26px;
            }

            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .toggle-switch input:checked + .toggle-slider {
                background-color: rgba(76, 175, 80, 0.8);
            }

            .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(16px);
            }

            .section-divider {
                height: 1px;
                background: rgba(255, 255, 255, 0.2);
                margin: 6px 0;
            }

            .section-title {
                color: rgba(255, 255, 255, 0.9);
                font-size: 12px;
                font-weight: 600;
                margin: 4px 0 4px 0;
                padding: 0 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .linuxdo-helper-panel {
                animation: fadeIn 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    setupButton() {
        this.addGlobalStyles();

        // 创建主容器
        this.container = document.createElement("div");
        this.container.className = "linuxdo-helper-panel";
        if (this.panelMinimized) {
            this.container.classList.add('minimized');
        }

        // 如果有保存的位置，使用保存的位置；否则默认右上角
        if (this.panelPosition.x !== null && this.panelPosition.y !== null) {
            this.applyPanelPosition(this.panelPosition.x, this.panelPosition.y);
        } else {
            // 默认位置：右上角
            const defaultX = window.innerWidth - 300; // 280px 宽度 + 20px 边距
            const defaultY = 20;
            this.applyPanelPosition(defaultX, defaultY);
        }

        // 创建最小化图标 - 使用简洁的文字标识
        const minimizedIcon = document.createElement("div");
        minimizedIcon.className = "minimized-icon";
        minimizedIcon.textContent = this.t('minimizedText');
        minimizedIcon.title = this.t('expandPanel');

        // 创建面板头部
        const header = document.createElement("div");
        header.className = "panel-header";
        // 根据当前布局模式显示不同的图标：标签页模式显示 ≡（切换到折叠），折叠模式显示 ⫼（切换到标签页）
        const layoutIcon = this.tabMode ? '≡' : '⫼';
        const layoutTitle = this.tabMode ? this.t('switchToCollapse') : this.t('switchToTab');
        header.innerHTML = `
            <span class="panel-title">${this.t('panelTitle')}</span>
            <div class="panel-controls">
                <button class="panel-control-btn layout-toggle-btn" title="${layoutTitle}">${layoutIcon}</button>
                <button class="panel-control-btn minimize-btn" title="${this.t('minimize')}">─</button>
            </div>
        `;

        // 创建面板内容区
        const content = document.createElement("div");
        content.className = "panel-content";
        if (this.panelMinimized) {
            content.classList.add('hidden');
        }

        // 应用标签页布局模式
        if (this.tabMode) {
            this.container.classList.add('tab-mode');
        }

        // 主按钮
        this.button = document.createElement("button");
        this.button.className = "main-action-btn" + (this.autoRunning ? " running" : "");
        this.button.innerHTML = this.autoRunning
            ? `<span class="btn-icon">⏸</span><span class="btn-text">${this.t('stopReading')}</span>`
            : `<span class="btn-icon">▶</span><span class="btn-text">${this.t('startReading')}</span>`;
        this.button.addEventListener("click", () => this.handleButtonClick());

        // 阅读统计显示区域（始终显示在按钮下方）
        this.readStatsContainer = document.createElement("div");
        this.readStatsContainer.className = "read-stats-container";
        this.readStatsContainer.style.cssText = `
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 6px 10px;
            border-radius: 8px;
            margin-top: 6px;
        `;
        this.updateReadStatsDisplay();

        // 点赞计数显示区域
        this.likeCounterContainer = document.createElement("div");
        this.likeCounterContainer.className = "like-counter-container";
        this.likeCounterContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 12px;
            border-radius: 8px;
            margin-top: 6px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            font-size: 12px;
            color: #e0e0e0;
        `;
        this.likeCounterContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span class="like-counter-label">❤️ ${this.t('likeRemaining')}</span>
                <span class="like-counter-value" style="font-weight: 600;">-- / --</span>
            </div>
        `;
        // 点击同步（手动触发，忽略30分钟间隔限制）
        this.likeCounterContainer.style.cursor = 'pointer';
        this.likeCounterContainer.title = this.t('likeCountMismatch');
        this.likeCounterContainer.addEventListener('click', () => {
            if (this.likeCounter) {
                this.showNotification(this.t('likeSyncing'));
                this.likeCounter.manualSync().then(() => {
                    this.showNotification(this.t('likeSyncSuccess'));
                });
            }
        });

        // 随机楼层按钮
        this.randomBtn = document.createElement("button");
        this.randomBtn.className = "random-floor-btn";
        this.randomBtn.innerHTML = `<span class="btn-icon">🎲</span><span class="btn-text">${this.t('randomFloor')}</span>`;
        this.randomBtn.addEventListener("click", () => this.randomJump());
        this.randomBtn.style.display = this.isTopicPage ? 'flex' : 'none';
        this.randomBtn.title = this.t('randomFloorTip');

        // 批量展示用户信息按钮
        this.revealUsersBtn = document.createElement("button");
        this.revealUsersBtn.className = "reveal-users-btn";
        this.revealUsersBtn.innerHTML = `<span class="btn-icon">📊</span><span class="btn-text">${this.t('batchShowInfo')}</span>`;
        this.revealUsersBtn.addEventListener("click", () => this.handleRevealUsersClick());
        this.revealUsersBtn.style.display = this.isTopicPage ? 'flex' : 'none';
        this.revealUsersBtn.title = this.t('batchShowInfoTip');

        // 自动点赞开关
        const autoLikeRow = this.createToggleRow(
            this.t('autoLikeTopic'),
            this.autoLikeEnabled,
            (checked) => {
                // 检查是否在冷却期
                if (checked && this.likeResumeTime && Date.now() < this.likeResumeTime) {
                    const now = Date.now();
                    const remainingHours = Math.ceil((this.likeResumeTime - now) / (1000 * 60 * 60));
                    const resumeDate = new Date(this.likeResumeTime);
                    this.showNotification(`${this.t('likeCoolingDown')}，${resumeDate.toLocaleTimeString()}`);
                    console.log(`点赞冷却中，还需约 ${remainingHours} 小时，无法开启`);

                    // 恢复开关状态为关闭
                    setTimeout(() => {
                        const toggleRows = this.container.querySelectorAll('.toggle-row');
                        for (const row of toggleRows) {
                            const label = row.querySelector('.toggle-label');
                            if (label && label.textContent.includes('自动点赞')) {
                                const input = row.querySelector('input[type="checkbox"]');
                                if (input) {
                                    input.checked = false;
                                }
                                break;
                            }
                        }
                    }, 100);
                    return;
                }

                // 互斥逻辑:如果开启自动点赞,关闭快速点赞
                if (checked && this.quickLikeEnabled) {
                    this.quickLikeEnabled = false;
                    Storage.set('quickLikeEnabled', false);
                    // 更新快速点赞开关UI
                    const toggleRows = this.container.querySelectorAll('.toggle-row');
                    for (const row of toggleRows) {
                        const label = row.querySelector('.toggle-label');
                        if (label && label.textContent.includes('快速点赞')) {
                            const input = row.querySelector('input[type="checkbox"]');
                            if (input) {
                                input.checked = false;
                            }
                            break;
                        }
                    }
                }

                this.autoLikeEnabled = checked;
                Storage.set('autoLikeEnabled', this.autoLikeEnabled);
                console.log(`自动点赞主题: ${this.autoLikeEnabled ? '开启' : '关闭'}`);
                if (this.autoLikeEnabled && this.isTopicPage) {
                    this.autoLikeTopic();
                }
            }
        );

        // 快速点赞开关
        const quickLikeRow = this.createToggleRow(
            this.t('quickLikeReply'),
            this.quickLikeEnabled,
            (checked) => {
                // 检查是否在冷却期
                if (checked && this.likeResumeTime && Date.now() < this.likeResumeTime) {
                    const resumeDate = new Date(this.likeResumeTime);
                    this.showNotification(`${this.t('likeCoolingDown')}，${resumeDate.toLocaleTimeString()}`);

                    // 恢复开关状态为关闭
                    setTimeout(() => {
                        const toggleRows = this.container.querySelectorAll('.toggle-row');
                        for (const row of toggleRows) {
                            const label = row.querySelector('.toggle-label');
                            if (label && label.textContent.includes('快速点赞')) {
                                const input = row.querySelector('input[type="checkbox"]');
                                if (input) {
                                    input.checked = false;
                                }
                                break;
                            }
                        }
                    }, 100);
                    return;
                }

                // 互斥逻辑:如果开启快速点赞,关闭自动点赞
                if (checked && this.autoLikeEnabled) {
                    this.autoLikeEnabled = false;
                    Storage.set('autoLikeEnabled', false);
                    // 更新自动点赞开关UI
                    const toggleRows = this.container.querySelectorAll('.toggle-row');
                    for (const row of toggleRows) {
                        const label = row.querySelector('.toggle-label');
                        if (label && label.textContent.includes('自动点赞主题')) {
                            const input = row.querySelector('input[type="checkbox"]');
                            if (input) {
                                input.checked = false;
                            }
                            break;
                        }
                    }
                }

                this.quickLikeEnabled = checked;
                Storage.set('quickLikeEnabled', this.quickLikeEnabled);
                console.log(`快速点赞回复: ${this.quickLikeEnabled ? '开启' : '关闭'}`);
                if (this.quickLikeEnabled && this.isTopicPage) {
                    console.log("[调试] 条件满足，准备调用 quickLikeReplies()");
                    this.quickLikeReplies();
                }
            }
        );

        // 创建点赞过滤设置的工厂函数（因为两种布局模式需要独立的DOM元素）
        const createLikeFilterControls = () => {
            // 点赞过滤模式选择
            const modeRow = this.createSelectRow(
                this.t('likeFilterMode'),
                [
                    { value: 'off', label: this.t('likeFilterOff') },
                    { value: 'threshold', label: this.t('likeFilterThreshold') },
                    { value: 'probability', label: this.t('likeFilterProbability') }
                ],
                this.likeFilterMode,
                (value) => {
                    this.likeFilterMode = value;
                    Storage.set('likeFilterMode', this.likeFilterMode);
                    console.log(`点赞过滤模式: ${this.likeFilterMode}`);
                    // 更新所有阈值行的显示状态
                    document.querySelectorAll('.like-min-threshold-row').forEach(row => {
                        row.style.display = (value === 'off') ? 'none' : 'flex';
                    });
                }
            );
            modeRow.title = this.t('likeFilterModeTip');
            modeRow.classList.add('like-filter-mode-row');

            // 最低赞数阈值设置
            const thresholdRow = this.createSliderRow(
                this.t('likeMinThreshold'),
                this.likeMinThreshold,
                1, 20, 1,
                (value) => {
                    this.likeMinThreshold = value;
                    Storage.set('likeMinThreshold', this.likeMinThreshold);
                    console.log(`最低赞数阈值: ${this.likeMinThreshold}`);
                }
            );
            thresholdRow.title = this.t('likeMinThresholdTip');
            thresholdRow.classList.add('like-min-threshold-row');
            // 根据过滤模式决定是否显示阈值设置
            thresholdRow.style.display = (this.likeFilterMode === 'off') ? 'none' : 'flex';

            return { modeRow, thresholdRow };
        };

        // 为标签页模式创建点赞过滤控件
        const likeFilterControls1 = createLikeFilterControls();
        const likeFilterModeRow = likeFilterControls1.modeRow;
        const likeMinThresholdRow = likeFilterControls1.thresholdRow;

        // 为折叠布局模式创建点赞过滤控件
        const likeFilterControls2 = createLikeFilterControls();
        const likeFilterModeRow2 = likeFilterControls2.modeRow;
        const likeMinThresholdRow2 = likeFilterControls2.thresholdRow;

        // 清爽模式开关
        const cleanModeRow = this.createToggleRow(
            this.t('cleanMode'),
            this.cleanModeEnabled,
            (checked) => {
                this.cleanModeEnabled = checked;
                Storage.set('cleanModeEnabled', this.cleanModeEnabled);
                console.log(`清爽模式: ${this.cleanModeEnabled ? '开启' : '关闭'}`);
                this.toggleCleanMode();
            }
        );

        // 黑白灰模式开关
        const grayscaleModeRow = this.createToggleRow(
            this.t('grayscaleMode'),
            this.grayscaleModeEnabled,
            (checked) => {
                this.grayscaleModeEnabled = checked;
                Storage.set('grayscaleModeEnabled', this.grayscaleModeEnabled);
                console.log(`黑白灰模式: ${this.grayscaleModeEnabled ? '开启' : '关闭'}`);
                this.toggleGrayscaleMode();
            }
        );

        // 读取未读帖子开关
        const readUnreadRow = this.createToggleRow(
            this.t('readUnread'),
            this.readUnreadEnabled,
            (checked) => {
                this.readUnreadEnabled = checked;
                Storage.set('readUnreadEnabled', this.readUnreadEnabled);
                console.log(`读取未读帖子: ${this.readUnreadEnabled ? '开启' : '关闭'}`);

                // 切换模式时清空话题列表，强制重新获取
                this.topicList = [];
                this.setSessionStorage('topicList', []);
                console.log('已清空话题列表，下次将获取' + (this.readUnreadEnabled ? '未读' : '最新') + '帖子');
            }
        );

        // 随机顺序阅读开关
        const randomOrderRow = this.createToggleRow(
            this.t('randomOrder'),
            this.randomOrderEnabled,
            (checked) => {
                this.randomOrderEnabled = checked;
                Storage.set('randomOrderEnabled', this.randomOrderEnabled);
                console.log(`随机顺序阅读: ${this.randomOrderEnabled ? '开启' : '关闭'}`);

                // 切换模式时清空话题列表，强制重新获取
                this.topicList = [];
                this.setSessionStorage('topicList', []);
            }
        );
        randomOrderRow.title = this.t('randomOrderTip');

        // 跳过已读帖子开关
        const skipReadRow = this.createToggleRow(
            this.t('skipRead'),
            this.skipReadEnabled,
            (checked) => {
                this.skipReadEnabled = checked;
                Storage.set('skipReadEnabled', this.skipReadEnabled);
                console.log(`跳过已读帖子: ${this.skipReadEnabled ? '开启' : '关闭'}`);

                // 切换模式时清空话题列表，强制重新获取
                this.topicList = [];
                this.setSessionStorage('topicList', []);
            }
        );
        skipReadRow.title = this.t('skipReadTip');

        // 获取帖子数量滑块
        const topicLimitRow = this.createSliderRow(
            this.t('topicLimit'),
            this.topicLimitCount,
            10, 500, 10,
            (value) => {
                this.topicLimitCount = value;
                Storage.set('topicLimitCount', this.topicLimitCount);
                console.log(`获取帖子数量: ${this.topicLimitCount}`);

                // 切换数量时清空话题列表，强制重新获取
                this.topicList = [];
                this.setSessionStorage('topicList', []);
            }
        );
        topicLimitRow.title = this.t('topicLimitTip');

        // 休息时间滑块
        const restTimeRow = this.createSliderRow(
            this.t('restTimeLabel'),
            this.restTimeMinutes,
            1, 30, 1,
            (value) => {
                this.restTimeMinutes = value;
                Storage.set('restTimeMinutes', this.restTimeMinutes);
                console.log(`休息时间: ${this.restTimeMinutes} 分钟`);
            }
        );
        restTimeRow.title = this.t('restTimeTip');

        // 阅读数量限制开关
        const stopAfterReadRow = this.createToggleRow(
            this.t('stopAfterRead'),
            this.stopAfterReadEnabled,
            (checked) => {
                this.stopAfterReadEnabled = checked;
                Storage.set('stopAfterReadEnabled', this.stopAfterReadEnabled);
                console.log(`阅读数量限制: ${this.stopAfterReadEnabled ? '开启' : '关闭'}`);

                // 如果开启，重置当前会话计数
                if (checked) {
                    this.currentSessionReadCount = 0;
                    this.setSessionStorage('currentSessionReadCount', 0);
                }
            }
        );
        stopAfterReadRow.title = this.t('stopAfterReadTip');

        // 阅读数量滑块
        const stopAfterReadCountRow = this.createSliderRow(
            this.t('stopAfterReadCount'),
            this.stopAfterReadCount,
            5, 100, 5,
            (value) => {
                this.stopAfterReadCount = value;
                Storage.set('stopAfterReadCount', this.stopAfterReadCount);
                console.log(`阅读数量限制: ${this.stopAfterReadCount} 篇`);
            }
        );
        stopAfterReadCountRow.title = this.t('stopAfterReadCountTip');


        // 点赞上限停止阅读开关
        const stopOnLikeLimitRow = this.createToggleRow(
            this.t('stopOnLikeLimit'),
            this.stopOnLikeLimitEnabled,
            (checked) => {
                this.stopOnLikeLimitEnabled = checked;
                Storage.set('stopOnLikeLimitEnabled', this.stopOnLikeLimitEnabled);
                console.log(`点赞上限停止阅读: ${this.stopOnLikeLimitEnabled ? '开启' : '关闭'}`);
            }
        );
        stopOnLikeLimitRow.title = this.t('stopOnLikeLimitTip');

        // 清除点赞冷却按钮
        this.clearCooldownBtn = document.createElement("button");
        this.clearCooldownBtn.className = "reveal-users-btn";
        this.clearCooldownBtn.innerHTML = `<span class="btn-icon">🔥</span><span class="btn-text">${this.t('clearCooldown')}</span>`;
        this.clearCooldownBtn.addEventListener("click", () => this.handleClearCooldown());
        this.clearCooldownBtn.title = this.t('clearCooldownTip');
        this.clearCooldownBtn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        this.clearCooldownBtn.style.display = 'none'; // 默认隐藏

        // 按钮创建后立即更新冷却显示状态
        setTimeout(() => this.updateClearCooldownButton(), 0);

        // 清空页码历史按钮
        this.clearPageHistoryBtn = document.createElement("button");
        this.clearPageHistoryBtn.className = "reveal-users-btn";
        this.clearPageHistoryBtn.innerHTML = `<span class="btn-icon">🗑️</span><span class="btn-text">${this.t('clearPageHistory')}</span>`;
        this.clearPageHistoryBtn.addEventListener("click", () => this.handleClearPageHistory());
        this.clearPageHistoryBtn.title = this.t('clearPageHistoryTip');
        this.clearPageHistoryBtn.style.background = 'rgba(255, 255, 255, 0.95)';

        // 信任等级显示容器
        this.trustLevelContainer = document.createElement("div");
        this.trustLevelContainer.className = "trust-level-row";
        // 信任等级显示容器
        this.trustLevelContainer.innerHTML = `<div class="trust-level-loading">${this.t('loadingLevel')}</div>`;

        // 组装面板 - 根据布局模式选择不同的组装方式
        if (this.tabMode) {
            // ========== 标签页切换布局模式 ==========
            // 创建标签页容器（包含导航和内容）
            this.tabContainer = document.createElement("div");
            this.tabContainer.className = "tab-container";
            if (this.panelMinimized) {
                this.tabContainer.classList.add('hidden');
            }

            // 标签页配置
            this.tabConfig = {
                1: { icon: '📊', nameZh: '账号', nameEn: 'Account' },
                2: { icon: '💰', nameZh: '积分', nameEn: 'Credits' },
                3: { icon: '📖', nameZh: '阅读', nameEn: 'Read' },
                4: { icon: '🎮', nameZh: 'CDK', nameEn: 'CDK' },
                5: { icon: '🏆', nameZh: '排名', nameEn: 'Rank' },
                6: { icon: '🔧', nameZh: '设置', nameEn: 'Settings' }
            };

            // 创建标签页导航栏
            const tabNav = document.createElement("div");
            tabNav.className = "tab-nav";

            // 按照保存的顺序创建标签按钮
            this.tabButtons = {};
            this.tabOrder.forEach(tabId => {
                const config = this.tabConfig[tabId];
                if (!config) return;

                const tabBtn = document.createElement("button");
                tabBtn.className = "tab-nav-btn" + (this.activeTab === tabId ? " active" : "");
                tabBtn.setAttribute('data-tab-id', tabId);
                tabBtn.innerHTML = `${config.icon} ${this.language === 'zh' ? config.nameZh : config.nameEn}`;
                tabBtn.addEventListener("click", () => this.switchTab(tabId));

                // 添加拖拽功能
                tabBtn.draggable = true;
                tabBtn.addEventListener('dragstart', (e) => this.handleTabDragStart(e, tabId));
                tabBtn.addEventListener('dragend', (e) => this.handleTabDragEnd(e));
                tabBtn.addEventListener('dragover', (e) => this.handleTabDragOver(e));
                tabBtn.addEventListener('drop', (e) => this.handleTabDrop(e, tabId));
                tabBtn.addEventListener('dragleave', (e) => this.handleTabDragLeave(e));

                tabNav.appendChild(tabBtn);
                this.tabButtons[tabId] = tabBtn;
            });

            this.tabContainer.appendChild(tabNav);
            this.tabNav = tabNav;

            // ========== 标签页1内容：账号信息 ==========
            const tab1Content = document.createElement("div");
            tab1Content.className = "lda-tab-content" + (this.activeTab === 1 ? " active" : "");
            tab1Content.setAttribute("data-tab", "1");
            tab1Content.innerHTML = `<div class="lda-tab-content-title">${this.t('sectionAccountInfo')}</div>`;
            tab1Content.appendChild(this.trustLevelContainer);
            this.tabContainer.appendChild(tab1Content);

            // ========== 标签页2内容：积分 ==========
            const tab2Content = document.createElement("div");
            tab2Content.className = "lda-tab-content" + (this.activeTab === 2 ? " active" : "");
            tab2Content.setAttribute("data-tab", "2");

            if (CURRENT_DOMAIN === 'linux.do') {
                tab2Content.innerHTML = `<div class="lda-tab-content-title">${this.t('sectionCredit')}</div>`;
                // Credit 容器
                this.creditContainer = document.createElement("div");
                this.creditContainer.className = "credit-info-row";
                this.creditContainer.innerHTML = `<div class="trust-level-loading">${this.t('loadingCredits')}</div>`;
                tab2Content.appendChild(this.creditContainer);

                // 转账按钮 (暂时注释)
                // const transferBtn = document.createElement("button");
                // transferBtn.className = "credit-transfer-btn";
                // transferBtn.innerHTML = this.t('creditTransfer');
                // transferBtn.onclick = () => this.showTransferModal();
                // tab2Content.appendChild(transferBtn);

                // 注意：积分数据的加载由 initDataLoading() 统一处理
            } else {
                // 非 linux.do 站点，显示提示
                tab2Content.innerHTML = `<div class="lda-tab-content-title">${this.t('sectionCredit')}</div>`;
                tab2Content.innerHTML += `<div style="color: rgba(255,255,255,0.7); font-size: 12px; padding: 10px;">${this.t('notSupported')}</div>`;
            }
            this.tabContainer.appendChild(tab2Content);

            // ========== 标签页3内容：自动阅读 ==========
            const tab3Content = document.createElement("div");
            tab3Content.className = "lda-tab-content" + (this.activeTab === 3 ? " active" : "");
            tab3Content.setAttribute("data-tab", "3");
            tab3Content.innerHTML = `<div class="lda-tab-content-title">${this.t('sectionAutoRead')}</div>`;
            tab3Content.appendChild(this.button);
            tab3Content.appendChild(this.readStatsContainer);
            tab3Content.appendChild(this.likeCounterContainer);
            tab3Content.appendChild(this.clearCooldownBtn);
            tab3Content.appendChild(this.clearPageHistoryBtn);

            // 双列开关网格 - 所有开关合并到一个grid
            const toggleGrid = document.createElement("div");
            toggleGrid.className = "toggle-grid";
            toggleGrid.appendChild(autoLikeRow);
            toggleGrid.appendChild(quickLikeRow);
            toggleGrid.appendChild(readUnreadRow);
            toggleGrid.appendChild(randomOrderRow);
            toggleGrid.appendChild(skipReadRow);
            toggleGrid.appendChild(stopOnLikeLimitRow);
            tab3Content.appendChild(toggleGrid);

            // 滑块和选择器保持单列
            tab3Content.appendChild(likeFilterModeRow);
            tab3Content.appendChild(likeMinThresholdRow);
            tab3Content.appendChild(topicLimitRow);
            tab3Content.appendChild(restTimeRow);
            tab3Content.appendChild(stopAfterReadRow);
            tab3Content.appendChild(stopAfterReadCountRow);

            // 帖子获取状态显示区域（标签页模式）
            this.topicStatusContainer = document.createElement("div");
            this.topicStatusContainer.className = "topic-status-container";
            this.topicStatusContainer.style.cssText = `
                display: none;
                background: rgba(255, 255, 255, 0.15);
                padding: 8px 10px;
                border-radius: 8px;
                margin-top: 6px;
            `;
            tab3Content.appendChild(this.topicStatusContainer);

            this.tabContainer.appendChild(tab3Content);

            // ========== 标签页4内容：CDK 分数 ==========
            const tab4Content = document.createElement("div");
            tab4Content.className = "lda-tab-content" + (this.activeTab === 4 ? " active" : "");
            tab4Content.setAttribute("data-tab", "4");
            tab4Content.innerHTML = `<div class="lda-tab-content-title">${this.t('sectionCdk')}</div>`;

            if (CURRENT_DOMAIN === 'linux.do') {
                // CDK 数据容器
                this.cdkContainer = document.createElement("div");
                this.cdkContainer.className = "cdk-info-row";
                this.cdkContainer.innerHTML = `<div class="trust-level-loading">${this.t('clickToLoadCdk')}</div>`;
                tab4Content.appendChild(this.cdkContainer);
            } else {
                // 非 linux.do 站点，显示提示
                tab4Content.innerHTML += `<div style="color: rgba(255,255,255,0.7); font-size: 12px; padding: 10px;">${this.t('notSupported')}</div>`;
            }

            this.tabContainer.appendChild(tab4Content);

            // ========== 标签页5内容：排名 ==========
            const tab5Content = document.createElement("div");
            tab5Content.className = "lda-tab-content" + (this.activeTab === 5 ? " active" : "");
            tab5Content.setAttribute("data-tab", "5");
            tab5Content.innerHTML = `<div class="lda-tab-content-title">${this.t('sectionRanking')}</div>`;

            // 排名数据容器
            this.rankDataContainer = document.createElement("div");
            this.rankDataContainer.className = "rank-data-container";
            this.rankDataContainer.innerHTML = `<div class="trust-level-loading">${this.t('clickToLoadRank')}</div>`;

            tab5Content.appendChild(this.rankDataContainer);
            this.tabContainer.appendChild(tab5Content);
            this.tab5Content = tab5Content;

            // 注意：排名数据的加载由 initDataLoading() 统一处理

            // ========== 标签页6内容：设置（包含模式设置、文章页功能、插件设置） ==========
            const tab6Content = document.createElement("div");
            tab6Content.className = "lda-tab-content" + (this.activeTab === 6 ? " active" : "");
            tab6Content.setAttribute("data-tab", "6");
            tab6Content.innerHTML = `<div class="lda-tab-content-title">${this.t('sectionPluginSettings')}</div>`;

            // 模式设置
            const modeSettingsSection = document.createElement("div");
            modeSettingsSection.innerHTML = `<div class="tab-sub-title">🎨 ${this.t('modeSettingsLabel')}</div>`;
            modeSettingsSection.appendChild(cleanModeRow);
            modeSettingsSection.appendChild(grayscaleModeRow);
            tab6Content.appendChild(modeSettingsSection);

            // 文章页功能（仅在文章页显示）
            if (this.isTopicPage) {
                const toolSubSection = document.createElement("div");
                toolSubSection.className = "tab-sub-section";
                toolSubSection.innerHTML = `<div class="tab-sub-title">${this.t('sectionArticleTools')}</div>`;
                toolSubSection.appendChild(this.randomBtn);
                toolSubSection.appendChild(this.revealUsersBtn);
                tab6Content.appendChild(toolSubSection);
            }

            // 语言切换
            const langSection = document.createElement("div");
            langSection.className = "tab-sub-section";
            langSection.innerHTML = `<div class="tab-sub-title">${this.t('languageLabel')}</div>`;

            const langToggle = document.createElement("div");
            langToggle.style.cssText = 'display: flex; gap: 8px; margin-top: 6px;';

            const zhBtn = document.createElement("button");
            zhBtn.className = "reveal-users-btn";
            zhBtn.style.cssText = `flex: 1; ${this.language === 'zh' ? 'background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);' : ''}`;
            zhBtn.innerHTML = '🇨🇳 中文';
            zhBtn.addEventListener('click', () => this.switchLanguage('zh'));

            const enBtn = document.createElement("button");
            enBtn.className = "reveal-users-btn";
            enBtn.style.cssText = `flex: 1; ${this.language === 'en' ? 'background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);' : ''}`;
            enBtn.innerHTML = '🇺🇸 English';
            enBtn.addEventListener('click', () => this.switchLanguage('en'));

            langToggle.appendChild(zhBtn);
            langToggle.appendChild(enBtn);
            langSection.appendChild(langToggle);
            tab6Content.appendChild(langSection);

            // 标签页排序说明
            const sortSection = document.createElement("div");
            sortSection.className = "tab-sub-section";
            sortSection.innerHTML = `
                <div class="tab-sub-title">${this.t('tabOrderLabel')}</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.7); padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    ${this.t('tabOrderTip')}
                </div>
            `;
            tab6Content.appendChild(sortSection);

            // 重置标签页顺序按钮
            const resetOrderBtn = document.createElement("button");
            resetOrderBtn.className = "reveal-users-btn";
            resetOrderBtn.style.cssText = 'margin-top: 8px;';
            resetOrderBtn.innerHTML = `🔄 ${this.t('resetTabOrder')}`;
            resetOrderBtn.addEventListener('click', () => this.resetTabOrder());
            tab6Content.appendChild(resetOrderBtn);

            // 主题配色选择器
            const themeSection = document.createElement("div");
            themeSection.className = "tab-sub-section";
            themeSection.innerHTML = `<div class="tab-sub-title">${this.t('themeColorLabel')}</div>`;
            themeSection.appendChild(this.createThemeSelector());
            tab6Content.appendChild(themeSection);

            // 下载位置说明（标签页模式）
            const downloadSection = document.createElement("div");
            downloadSection.className = "tab-sub-section";
            downloadSection.innerHTML = `
                <div class="tab-sub-title">${this.t('downloadLocationLabel')}</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.8); padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px; line-height: 1.6;">
                    <div style="margin-bottom: 4px;">${this.t('downloadLocationTip')}</div>
                    <div style="color: rgba(255,255,255,0.6);">${this.t('downloadLocationPath')}</div>
                    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.2); color: #ffd700;">${this.t('downloadLocationHint')}</div>
                </div>
            `;
            tab6Content.appendChild(downloadSection);

            // CloudFlare 5秒盾设置区域（仅 linux.do 显示）
            if (CURRENT_DOMAIN === 'linux.do') {
                const cfBypassSection = document.createElement("div");
                cfBypassSection.className = "tab-sub-section";
                cfBypassSection.innerHTML = `<div class="tab-sub-title">${this.t('cfBypassLabel')}</div>`;

                // CF bypass 开关
                const cfBypassRow = this.createToggleRow(
                    this.t('cfBypassTip'),
                    this.cfBypassEnabled,
                    (checked) => {
                        this.cfBypassEnabled = checked;
                        Storage.set('cfBypassEnabled', this.cfBypassEnabled);
                        this.showNotification(checked ? this.t('cfBypassEnabled') : this.t('cfBypassDisabled'));
                        // 如果启用，立即初始化
                        if (checked) {
                            this.initCloudFlareBypass();
                        }
                    }
                );
                cfBypassSection.appendChild(cfBypassRow);

                // 手动触发按钮
                const manualCfBtn = document.createElement("button");
                manualCfBtn.className = "reveal-users-btn";
                manualCfBtn.style.cssText = 'margin-top: 8px;';
                manualCfBtn.innerHTML = `🛡️ ${this.t('cfBypassManual')}`;
                manualCfBtn.title = this.t('cfBypassManualTip');
                manualCfBtn.addEventListener('click', () => this.manualTriggerCF());
                cfBypassSection.appendChild(manualCfBtn);

                tab6Content.appendChild(cfBypassSection);
            }

            // 捐赠打赏区域
            const donateSection = document.createElement("div");
            donateSection.className = "tab-sub-section";
            donateSection.innerHTML = `<div class="tab-sub-title">${this.t('donateLabel')}</div>`;
            donateSection.appendChild(this.createDonateSelector());
            tab6Content.appendChild(donateSection);

            this.tabContainer.appendChild(tab6Content);
            this.tab6Content = tab6Content;

            // 保存标签页内容引用
            this.tab1Content = tab1Content;
            this.tab2Content = tab2Content;
            this.tab3Content = tab3Content;
            this.tab4Content = tab4Content;
        } else {
            // ========== 单列折叠布局模式（默认） ==========
            // 📖 自动阅读区（包含阅读按钮和相关设置）
            const autoSection = document.createElement("div");
            autoSection.className = "section-collapsible";
            autoSection.innerHTML = `<div class="section-title"><span class="collapse-icon">▼</span> ${this.t('sectionAutoRead')}</div>`;
            content.appendChild(autoSection);

            // 自动阅读内容区
            this.autoSectionContent = document.createElement("div");
            this.autoSectionContent.className = "section-collapsible-content";
            // 根据运行状态决定初始折叠状态：停止时折叠，运行时展开
            if (!this.autoRunning) {
                autoSection.classList.add('collapsed');
                this.autoSectionContent.classList.add('collapsed');
            }

            this.autoSectionContent.appendChild(this.button);
            this.autoSectionContent.appendChild(this.readStatsContainer);
            this.autoSectionContent.appendChild(this.likeCounterContainer);
            this.autoSectionContent.appendChild(this.clearCooldownBtn);

            // 双列开关网格 - 所有开关合并到一个grid
            const collapseToggleGrid = document.createElement("div");
            collapseToggleGrid.className = "toggle-grid";
            collapseToggleGrid.appendChild(autoLikeRow);
            collapseToggleGrid.appendChild(quickLikeRow);
            collapseToggleGrid.appendChild(readUnreadRow);
            collapseToggleGrid.appendChild(randomOrderRow);
            collapseToggleGrid.appendChild(skipReadRow);
            collapseToggleGrid.appendChild(stopAfterReadRow);
            collapseToggleGrid.appendChild(stopOnLikeLimitRow);
            this.autoSectionContent.appendChild(collapseToggleGrid);

            // 滑块和选择器保持单列
            this.autoSectionContent.appendChild(likeFilterModeRow2);
            this.autoSectionContent.appendChild(likeMinThresholdRow2);
            this.autoSectionContent.appendChild(topicLimitRow);
            this.autoSectionContent.appendChild(restTimeRow);
            this.autoSectionContent.appendChild(stopAfterReadCountRow);

            // 帖子获取状态显示区域
            this.topicStatusContainer = document.createElement("div");
            this.topicStatusContainer.className = "topic-status-container";
            this.topicStatusContainer.style.cssText = `
                display: none;
                background: rgba(255, 255, 255, 0.15);
                padding: 8px 10px;
                border-radius: 8px;
                margin-top: 6px;
            `;
            this.autoSectionContent.appendChild(this.topicStatusContainer);

            content.appendChild(this.autoSectionContent);

            // 自动阅读区折叠点击事件
            autoSection.addEventListener('click', () => {
                autoSection.classList.toggle('collapsed');
                this.autoSectionContent.classList.toggle('collapsed');
            });

            // 分隔线1
            this.divider1 = document.createElement("div");
            this.divider1.className = "section-divider";
            content.appendChild(this.divider1);

            // 📊 账号信息区
            this.accountSection = document.createElement("div");
            this.accountSection.className = "section-collapsible";
            // 如果正在自动阅读，默认折叠账号信息区
            if (this.autoRunning) {
                this.accountSection.classList.add('collapsed');
            }
            this.accountSection.innerHTML = `<div class="section-title"><span class="collapse-icon">▼</span> ${this.t('sectionAccountInfo')}</div>`;
            content.appendChild(this.accountSection);

            // 账号信息内容区（根据自动阅读状态决定是否折叠）
            this.accountSectionContent = document.createElement("div");
            this.accountSectionContent.className = "section-collapsible-content";
            if (this.autoRunning) {
                this.accountSectionContent.classList.add('collapsed');
            }
            this.accountSectionContent.appendChild(this.trustLevelContainer);
            content.appendChild(this.accountSectionContent);

            // 账号信息区折叠点击事件
            this.accountSection.addEventListener('click', () => {
                this.accountSection.classList.toggle('collapsed');
                this.accountSectionContent.classList.toggle('collapsed');
                // 展开时加载数据
                if (!this.accountSection.classList.contains('collapsed')) {
                    this.loadUserTrustLevel();
                }
            });

            // 💰 Credit 积分区（仅 linux.do 显示）
            if (CURRENT_DOMAIN === 'linux.do') {
                // 分隔线4
                this.divider4 = document.createElement("div");
                this.divider4.className = "section-divider";
                content.appendChild(this.divider4);

                const creditSection = document.createElement("div");
                creditSection.className = "section-collapsible collapsed";
                creditSection.innerHTML = `<div class="section-title"><span class="collapse-icon">▼</span> ${this.t('sectionCredit')}</div>`;
                content.appendChild(creditSection);

                // Credit 内容区（默认折叠）
                this.creditSectionContent = document.createElement("div");
                this.creditSectionContent.className = "section-collapsible-content collapsed";

                // Credit 容器
                this.creditContainer = document.createElement("div");
                this.creditContainer.className = "credit-info-row";
                this.creditContainer.innerHTML = `<div class="trust-level-loading">${this.t('clickToLoadCredits')}</div>`;
                this.creditSectionContent.appendChild(this.creditContainer);

                // 折叠模式下的转账按钮 (暂时注释)
                // const collapseTransferBtn = document.createElement("button");
                // collapseTransferBtn.className = "credit-transfer-btn";
                // collapseTransferBtn.innerHTML = this.t('creditTransfer');
                // collapseTransferBtn.onclick = (e) => {
                //     e.stopPropagation();
                //     this.showTransferModal();
                // };
                // this.creditSectionContent.appendChild(collapseTransferBtn);

                content.appendChild(this.creditSectionContent);

                // Credit 区折叠点击事件
                creditSection.addEventListener('click', () => {
                    creditSection.classList.toggle('collapsed');
                    this.creditSectionContent.classList.toggle('collapsed');
                    // 展开时加载数据
                    if (!creditSection.classList.contains('collapsed')) {
                        this.loadCreditInfo();
                    }
                });

                // 🎮 CDK 分数区（默认折叠）
                // 分隔线 CDK
                this.dividerCdk = document.createElement("div");
                this.dividerCdk.className = "section-divider";
                content.appendChild(this.dividerCdk);

                const cdkSection = document.createElement("div");
                cdkSection.className = "section-collapsible collapsed";
                cdkSection.innerHTML = `<div class="section-title"><span class="collapse-icon">▼</span> ${this.t('sectionCdk')}</div>`;
                content.appendChild(cdkSection);

                // CDK 内容区（默认折叠）
                this.cdkSectionContent = document.createElement("div");
                this.cdkSectionContent.className = "section-collapsible-content collapsed";

                // CDK 数据容器
                this.cdkContainer = document.createElement("div");
                this.cdkContainer.className = "cdk-info-row";
                this.cdkContainer.innerHTML = `<div class="trust-level-loading">${this.t('clickToLoadCdk')}</div>`;
                this.cdkSectionContent.appendChild(this.cdkContainer);

                content.appendChild(this.cdkSectionContent);

                // CDK 区折叠点击事件
                cdkSection.addEventListener('click', () => {
                    cdkSection.classList.toggle('collapsed');
                    this.cdkSectionContent.classList.toggle('collapsed');
                    // 展开时加载数据
                    if (!cdkSection.classList.contains('collapsed')) {
                        this.loadCdkInfo();
                    }
                });
            }

            // 🏆 排名区（默认折叠）
            // 分隔线5
            this.divider5 = document.createElement("div");
            this.divider5.className = "section-divider";
            content.appendChild(this.divider5);

            const rankSection = document.createElement("div");
            rankSection.className = "section-collapsible collapsed";
            rankSection.innerHTML = `<div class="section-title"><span class="collapse-icon">▼</span> ${this.t('sectionRanking')}</div>`;
            content.appendChild(rankSection);

            // 排名内容区（默认折叠）
            this.rankSectionContent = document.createElement("div");
            this.rankSectionContent.className = "section-collapsible-content collapsed";

            // 排名数据容器
            this.rankDataContainer = document.createElement("div");
            this.rankDataContainer.className = "rank-data-container";
            this.rankDataContainer.innerHTML = `<div class="trust-level-loading">${this.t('clickToLoadRank')}</div>`;
            this.rankSectionContent.appendChild(this.rankDataContainer);
            content.appendChild(this.rankSectionContent);

            // 排名区折叠点击事件
            rankSection.addEventListener('click', () => {
                rankSection.classList.toggle('collapsed');
                this.rankSectionContent.classList.toggle('collapsed');
                // 展开时加载数据
                if (!rankSection.classList.contains('collapsed')) {
                    this.loadRankingData();
                }
            });

            // 🔧 插件设置区（默认折叠）
            // 分隔线6
            this.divider6 = document.createElement("div");
            this.divider6.className = "section-divider";
            content.appendChild(this.divider6);

            const settingsPluginSection = document.createElement("div");
            settingsPluginSection.className = "section-collapsible collapsed";
            settingsPluginSection.innerHTML = `<div class="section-title"><span class="collapse-icon">▼</span> ${this.t('sectionPluginSettings')}</div>`;
            content.appendChild(settingsPluginSection);

            // 插件设置内容区（默认折叠）
            this.settingsPluginSectionContent = document.createElement("div");
            this.settingsPluginSectionContent.className = "section-collapsible-content collapsed";

            // 模式设置子区域
            const modeSubSection = document.createElement("div");
            modeSubSection.style.cssText = 'margin-bottom: 12px;';
            modeSubSection.innerHTML = `<div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 6px;">🎨 ${this.t('modeSettingsLabel')}</div>`;
            modeSubSection.appendChild(cleanModeRow);
            modeSubSection.appendChild(grayscaleModeRow);
            this.settingsPluginSectionContent.appendChild(modeSubSection);

            // 文章页功能子区域（始终添加，通过 CSS 控制显示/隐藏）
            const toolSubSection = document.createElement("div");
            toolSubSection.className = "tool-sub-section";
            toolSubSection.style.cssText = 'margin-bottom: 12px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15);';
            toolSubSection.innerHTML = `<div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 6px;">${this.t('sectionArticleTools')}</div>`;
            toolSubSection.appendChild(this.randomBtn);
            toolSubSection.appendChild(this.revealUsersBtn);
            // 初始化时根据页面类型设置显示状态
            toolSubSection.style.display = this.isTopicPage ? 'block' : 'none';
            this.toolSubSection = toolSubSection; // 保存引用以便后续更新
            this.settingsPluginSectionContent.appendChild(toolSubSection);

            // 语言切换
            const langSection = document.createElement("div");
            langSection.style.cssText = 'margin-bottom: 12px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15);';
            langSection.innerHTML = `<div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 6px;">${this.t('languageLabel')}</div>`;

            const langToggle = document.createElement("div");
            langToggle.style.cssText = 'display: flex; gap: 8px;';

            const zhBtn = document.createElement("button");
            zhBtn.className = "reveal-users-btn";
            zhBtn.style.cssText = `flex: 1; ${this.language === 'zh' ? 'background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);' : ''}`;
            zhBtn.innerHTML = '🇨🇳 中文';
            zhBtn.addEventListener('click', () => this.switchLanguage('zh'));

            const enBtn = document.createElement("button");
            enBtn.className = "reveal-users-btn";
            enBtn.style.cssText = `flex: 1; ${this.language === 'en' ? 'background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);' : ''}`;
            enBtn.innerHTML = '🇺🇸 English';
            enBtn.addEventListener('click', () => this.switchLanguage('en'));

            langToggle.appendChild(zhBtn);
            langToggle.appendChild(enBtn);
            langSection.appendChild(langToggle);
            this.settingsPluginSectionContent.appendChild(langSection);

            // 主题配色选择器（折叠模式）
            const collapseThemeSection = document.createElement("div");
            collapseThemeSection.style.cssText = 'margin-bottom: 12px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15);';
            collapseThemeSection.innerHTML = `<div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 6px;">${this.t('themeColorLabel')}</div>`;
            collapseThemeSection.appendChild(this.createThemeSelector());
            this.settingsPluginSectionContent.appendChild(collapseThemeSection);

            // 下载位置说明（折叠模式）
            const collapseDownloadSection = document.createElement("div");
            collapseDownloadSection.style.cssText = 'margin-bottom: 12px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15);';
            collapseDownloadSection.innerHTML = `
                <div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 6px;">${this.t('downloadLocationLabel')}</div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.8); padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px; line-height: 1.6;">
                    <div style="margin-bottom: 4px;">${this.t('downloadLocationTip')}</div>
                    <div style="color: rgba(255,255,255,0.6);">${this.t('downloadLocationPath')}</div>
                    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.2); color: #ffd700;">${this.t('downloadLocationHint')}</div>
                </div>
            `;
            this.settingsPluginSectionContent.appendChild(collapseDownloadSection);

            // CloudFlare 5秒盾设置区域（折叠模式，仅 linux.do 显示）
            if (CURRENT_DOMAIN === 'linux.do') {
                const collapseCfBypassSection = document.createElement("div");
                collapseCfBypassSection.style.cssText = 'margin-bottom: 12px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15);';
                collapseCfBypassSection.innerHTML = `<div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 6px;">${this.t('cfBypassLabel')}</div>`;

                // CF bypass 开关
                const cfBypassRow2 = this.createToggleRow(
                    this.t('cfBypassTip'),
                    this.cfBypassEnabled,
                    (checked) => {
                        this.cfBypassEnabled = checked;
                        Storage.set('cfBypassEnabled', this.cfBypassEnabled);
                        this.showNotification(checked ? this.t('cfBypassEnabled') : this.t('cfBypassDisabled'));
                        // 如果启用，立即初始化
                        if (checked) {
                            this.initCloudFlareBypass();
                        }
                    }
                );
                collapseCfBypassSection.appendChild(cfBypassRow2);

                // 手动触发按钮（折叠模式）
                const manualCfBtn2 = document.createElement("button");
                manualCfBtn2.className = "reveal-users-btn";
                manualCfBtn2.style.cssText = 'margin-top: 8px;';
                manualCfBtn2.innerHTML = `🛡️ ${this.t('cfBypassManual')}`;
                manualCfBtn2.title = this.t('cfBypassManualTip');
                manualCfBtn2.addEventListener('click', () => this.manualTriggerCF());
                collapseCfBypassSection.appendChild(manualCfBtn2);

                this.settingsPluginSectionContent.appendChild(collapseCfBypassSection);
            }

            // 捐赠打赏区域（折叠模式）
            const collapseDonateSection = document.createElement("div");
            collapseDonateSection.style.cssText = 'margin-bottom: 12px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15);';
            collapseDonateSection.innerHTML = `<div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 6px;">${this.t('donateLabel')}</div>`;
            collapseDonateSection.appendChild(this.createDonateSelector());
            this.settingsPluginSectionContent.appendChild(collapseDonateSection);

            // 布局切换说明
            const layoutSection = document.createElement("div");
            layoutSection.style.cssText = 'margin-top: 8px;';
            layoutSection.innerHTML = `
                <div style="font-size: 11px; color: rgba(255,255,255,0.7); padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;">
                    ${this.t('layoutSwitchTip')}
                </div>
            `;
            this.settingsPluginSectionContent.appendChild(layoutSection);

            content.appendChild(this.settingsPluginSectionContent);

            // 插件设置区折叠点击事件
            settingsPluginSection.addEventListener('click', () => {
                settingsPluginSection.classList.toggle('collapsed');
                this.settingsPluginSectionContent.classList.toggle('collapsed');
            });
        }

        this.container.appendChild(minimizedIcon);
        this.container.appendChild(header);
        // 根据布局模式添加不同的内容容器
        if (this.tabMode) {
            this.container.appendChild(this.tabContainer);
        } else {
            this.container.appendChild(content);
        }
        document.body.appendChild(this.container);

        // 添加拖动功能（只在展开状态可拖动）
        this.makeDraggable(header);

        // 添加布局切换功能
        header.querySelector('.layout-toggle-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLayout();
        });

        // 添加最小化功能
        header.querySelector('.minimize-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMinimize();
        });

        // 点击最小化图标展开
        minimizedIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.panelMinimized) {
                this.toggleMinimize();
            }
        });

        // 点击最小化的面板也可以展开
        this.container.addEventListener('click', (e) => {
            if (this.panelMinimized && e.target === this.container) {
                this.toggleMinimize();
            }
        });

        // 给最小化面板添加拖动功能
        this.makeMinimizedDraggable();
    }

    createToggleRow(label, checked, onChange) {
        const row = document.createElement("div");
        row.className = "toggle-row";

        const labelEl = document.createElement("span");
        labelEl.className = "toggle-label";
        labelEl.textContent = label;

        const toggleSwitch = document.createElement("label");
        toggleSwitch.className = "toggle-switch";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = checked;
        input.addEventListener("change", (e) => {
            onChange(e.target.checked);
        });

        const slider = document.createElement("span");
        slider.className = "toggle-slider";

        toggleSwitch.appendChild(input);
        toggleSwitch.appendChild(slider);

        row.appendChild(labelEl);
        row.appendChild(toggleSwitch);

        return row;
    }

    // 创建滑块行
    createSliderRow(label, value, min, max, step, onChange) {
        const row = document.createElement("div");
        row.className = "toggle-row";
        row.style.flexDirection = "column";
        row.style.alignItems = "stretch";
        row.style.gap = "6px";

        const topRow = document.createElement("div");
        topRow.style.cssText = "display: flex; justify-content: space-between; align-items: center;";

        const labelEl = document.createElement("span");
        labelEl.className = "toggle-label";
        labelEl.textContent = label;

        const valueEl = document.createElement("span");
        valueEl.className = "toggle-label";
        valueEl.style.cssText = "color: #ffd700; font-weight: bold; min-width: 40px; text-align: right;";
        valueEl.textContent = value;

        topRow.appendChild(labelEl);
        topRow.appendChild(valueEl);

        const sliderContainer = document.createElement("div");
        sliderContainer.style.cssText = "width: 100%; padding: 0 2px;";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = value;
        slider.className = "panel-slider-input";
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.cssText = `
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(to right, #ffd700 0%, #ffd700 ${percentage}%, rgba(255, 255, 255, 0.3) ${percentage}%, rgba(255, 255, 255, 0.3) 100%);
            outline: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;
        `;

        // 添加滑块样式
        if (!document.getElementById('panel-slider-style')) {
            const sliderStyle = document.createElement("style");
            sliderStyle.id = 'panel-slider-style';
            sliderStyle.textContent = `
                .panel-slider-input {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
                .panel-slider-input::-webkit-slider-runnable-track {
                    height: 4px;
                    border-radius: 2px;
                    background: transparent;
                }
                .panel-slider-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.5);
                    border: none;
                    margin-top: -5px;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }
                .panel-slider-input::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 215, 0, 0.6);
                }
                .panel-slider-input::-webkit-slider-thumb:active {
                    transform: scale(1.05);
                    background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
                }
                .panel-slider-input::-moz-range-track {
                    height: 4px;
                    border-radius: 2px;
                    background: transparent;
                    border: none;
                }
                .panel-slider-input::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.5);
                }
                .panel-slider-input::-moz-range-thumb:hover {
                    transform: scale(1.15);
                }
                .panel-slider-input::-moz-range-progress {
                    background: #ffd700;
                    border-radius: 2px;
                    height: 4px;
                }
                .panel-slider-input:focus {
                    outline: none;
                }
            `;
            document.head.appendChild(sliderStyle);
        }

        slider.addEventListener("input", (e) => {
            const newValue = parseInt(e.target.value);
            valueEl.textContent = newValue;
            // 更新滑块背景渐变以显示进度
            const newPercentage = ((newValue - min) / (max - min)) * 100;
            slider.style.background = `linear-gradient(to right, #ffd700 0%, #ffd700 ${newPercentage}%, rgba(255, 255, 255, 0.3) ${newPercentage}%, rgba(255, 255, 255, 0.3) 100%)`;
            onChange(newValue);
        });

        sliderContainer.appendChild(slider);
        row.appendChild(topRow);
        row.appendChild(sliderContainer);

        return row;
    }

    // 创建开关+滑块组合行（所有元素在同一行：标签 | 开关 | 滑块 | 数值）
    createToggleWithSliderRow(label, checked, onToggleChange, sliderValue, min, max, step, onSliderChange) {
        const row = document.createElement("div");
        row.className = "toggle-row";
        row.style.cssText = "display: flex; align-items: center; gap: 10px; flex-wrap: nowrap;";

        // 标签
        const labelEl = document.createElement("span");
        labelEl.className = "toggle-label";
        labelEl.textContent = label;
        labelEl.style.cssText = "white-space: nowrap; flex-shrink: 0;";

        // 开关
        const toggleSwitch = document.createElement("label");
        toggleSwitch.className = "toggle-switch";
        toggleSwitch.style.cssText = "flex-shrink: 0;";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = checked;

        const slider = document.createElement("span");
        slider.className = "toggle-slider";

        toggleSwitch.appendChild(input);
        toggleSwitch.appendChild(slider);

        // 滑块容器
        const sliderContainer = document.createElement("div");
        sliderContainer.style.cssText = "flex: 1; min-width: 80px;";

        const rangeSlider = document.createElement("input");
        rangeSlider.type = "range";
        rangeSlider.min = min;
        rangeSlider.max = max;
        rangeSlider.step = step;
        rangeSlider.value = sliderValue;
        rangeSlider.className = "toggle-with-slider-input";
        const percentage = ((sliderValue - min) / (max - min)) * 100;
        rangeSlider.style.cssText = `
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(to right, #ffd700 0%, #ffd700 ${percentage}%, rgba(255, 255, 255, 0.25) ${percentage}%, rgba(255, 255, 255, 0.25) 100%);
            outline: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;
            margin: 0;
            padding: 0;
            vertical-align: middle;
        `;

        // 添加滑块样式（如果还没有添加）
        if (!document.getElementById('toggle-with-slider-style')) {
            const sliderStyle = document.createElement("style");
            sliderStyle.id = 'toggle-with-slider-style';
            sliderStyle.textContent = `
                .toggle-with-slider-input {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
                .toggle-with-slider-input::-webkit-slider-runnable-track {
                    height: 4px;
                    border-radius: 2px;
                    background: transparent;
                }
                .toggle-with-slider-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.5);
                    border: none;
                    margin-top: -5px;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }
                .toggle-with-slider-input::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 215, 0, 0.6);
                }
                .toggle-with-slider-input::-webkit-slider-thumb:active {
                    transform: scale(1.05);
                    background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
                }
                .toggle-with-slider-input::-moz-range-track {
                    height: 4px;
                    border-radius: 2px;
                    background: transparent;
                    border: none;
                }
                .toggle-with-slider-input::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 215, 0, 0.5);
                }
                .toggle-with-slider-input::-moz-range-thumb:hover {
                    transform: scale(1.15);
                }
                .toggle-with-slider-input::-moz-range-progress {
                    background: #ffd700;
                    border-radius: 2px;
                    height: 4px;
                }
                .toggle-with-slider-input:focus {
                    outline: none;
                }
            `;
            document.head.appendChild(sliderStyle);
        }

        sliderContainer.appendChild(rangeSlider);

        // 数值显示
        const valueEl = document.createElement("span");
        valueEl.className = "toggle-label";
        valueEl.style.cssText = "color: #ffd700; font-weight: bold; min-width: 30px; text-align: right; flex-shrink: 0;";
        valueEl.textContent = sliderValue;

        // 开关事件
        input.addEventListener("change", (e) => {
            onToggleChange(e.target.checked);
        });

        // 滑块事件 - 更新数值和背景渐变
        rangeSlider.addEventListener("input", (e) => {
            const newValue = parseInt(e.target.value);
            valueEl.textContent = newValue;
            // 更新滑块背景渐变以显示进度
            const percentage = ((newValue - min) / (max - min)) * 100;
            rangeSlider.style.background = `linear-gradient(to right, #ffd700 0%, #ffd700 ${percentage}%, rgba(255, 255, 255, 0.3) ${percentage}%, rgba(255, 255, 255, 0.3) 100%)`;
            onSliderChange(newValue);
        });

        // 所有元素添加到同一行
        row.appendChild(labelEl);
        row.appendChild(toggleSwitch);
        row.appendChild(sliderContainer);
        row.appendChild(valueEl);

        return row;
    }

    // 创建下拉选择行
    createSelectRow(label, options, selectedValue, onChange) {
        const row = document.createElement("div");
        row.className = "toggle-row";

        const labelEl = document.createElement("span");
        labelEl.className = "toggle-label";
        labelEl.textContent = label;

        // 创建自定义下拉框容器
        const selectWrapper = document.createElement("div");
        selectWrapper.style.cssText = `
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            height: 100%;
        `;

        const select = document.createElement("select");
        select.style.cssText = `
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 4px;
            color: white;
            padding: 5px 22px 5px 8px;
            font-size: 11px;
            cursor: pointer;
            outline: none;
            transition: all 0.2s ease;
            text-align: center;
            text-align-last: center;
            min-width: auto;
            width: auto;
            white-space: nowrap;
            overflow: visible;
            text-overflow: clip;
            margin-bottom: 0;
        `;

        // 添加悬停和聚焦效果
        select.addEventListener('mouseenter', () => {
            select.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))';
            select.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        });
        select.addEventListener('mouseleave', () => {
            if (document.activeElement !== select) {
                select.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))';
                select.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }
        });
        select.addEventListener('focus', () => {
            select.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))';
            select.style.borderColor = 'rgba(100, 180, 255, 0.6)';
            select.style.boxShadow = '0 0 0 2px rgba(100, 180, 255, 0.2)';
        });
        select.addEventListener('blur', () => {
            select.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))';
            select.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            select.style.boxShadow = 'none';
        });

        // 添加下拉箭头
        const arrow = document.createElement("span");
        arrow.innerHTML = "▼";
        arrow.style.cssText = `
            position: absolute;
            right: 6px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 8px;
            color: rgba(255, 255, 255, 0.6);
            pointer-events: none;
        `;

        options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.label;
            option.selected = opt.value === selectedValue;
            option.style.cssText = `
                background: #2d2d2d;
                color: #fff;
                padding: 4px 8px;
            `;
            select.appendChild(option);
        });

        select.addEventListener("change", (e) => {
            onChange(e.target.value);
        });

        selectWrapper.appendChild(select);
        selectWrapper.appendChild(arrow);
        row.appendChild(labelEl);
        row.appendChild(selectWrapper);

        return row;
    }

    // 应用面板位置（带吸附效果）
    applyPanelPosition(x, y, snap = false) {
        let finalX = x;
        let finalY = y;

        if (snap) {
            // 吸附逻辑：判断靠近哪一边
            const windowWidth = window.innerWidth;
            const edgeMargin = 30; // 使用统一的边距变量
            const panelWidth = this.panelMinimized ? 50 : (this.container.offsetWidth || 280);
            const centerX = windowWidth / 2;

            // 判断在左边还是右边
            const isOnLeft = x < centerX;

            // 如果在左半边，吸附到左边；否则吸附到右边
            if (isOnLeft) {
                finalX = edgeMargin;
                this.container.classList.add('on-left');
                this.container.classList.remove('on-right');
            } else {
                finalX = windowWidth - panelWidth - edgeMargin;
                this.container.classList.add('on-right');
                this.container.classList.remove('on-left');
            }

            // Y 轴始终吸附到顶部
            finalY = 70;
        }

        // 应用位置
        this.container.style.position = 'fixed';
        this.container.style.left = finalX + 'px';
        this.container.style.top = finalY + 'px';
        this.container.style.right = 'auto';
        this.container.style.bottom = 'auto';
        this.container.style.transform = 'none';

        // 保存当前位置
        this.currentTranslateX = finalX;
        this.currentTranslateY = finalY;

        return { x: finalX, y: finalY };
    }

    makeDraggable(header) {
        let isDragging = false;
        let hasMoved = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let rafId = null;

        // 禁用过渡效果以提高拖动流畅度
        const disableTransition = () => {
            this.container.style.transition = 'none';
        };

        const enableTransition = () => {
            this.container.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        };

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('panel-control-btn') ||
                e.target.closest('.panel-control-btn')) {
                return;
            }

            isDragging = true;
            hasMoved = false;
            disableTransition();

            const rect = this.container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            // 使用捕获阶段，提高响应速度
            document.addEventListener('mousemove', onMouseMove, true);
            document.addEventListener('mouseup', onMouseUp, true);

            // 防止文本选择
            e.preventDefault();
        });

        const updatePosition = () => {
            // 限制在视窗内
            const maxX = window.innerWidth - this.container.offsetWidth;
            const maxY = window.innerHeight - this.container.offsetHeight;

            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));

            // 实时更新位置（拖动时不吸附）
            this.container.style.position = 'fixed';
            this.container.style.left = currentX + 'px';
            this.container.style.top = currentY + 'px';
            this.container.style.right = 'auto';
            this.container.style.bottom = 'auto';
            this.container.style.transform = 'none';
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            e.preventDefault();
            e.stopPropagation();

            hasMoved = true;
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // 使用 requestAnimationFrame 确保流畅渲染
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(updatePosition);
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                enableTransition();

                // 取消未完成的动画帧
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }

                // 只有在真正移动过才吸附
                if (hasMoved) {
                    // 松开鼠标时吸附到最近的边角
                    const snappedPos = this.applyPanelPosition(currentX, currentY, true);

                    // 保存吸附后的位置
                    this.panelPosition = snappedPos;
                    Storage.set('panelPosition', this.panelPosition);
                }
            }
            document.removeEventListener('mousemove', onMouseMove, true);
            document.removeEventListener('mouseup', onMouseUp, true);
        };
    }

    makeMinimizedDraggable() {
        let isDragging = false;
        let hasMoved = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let rafId = null;

        this.container.addEventListener('mousedown', (e) => {
            // 只在最小化状态下才能拖动整个容器
            if (!this.panelMinimized) return;

            isDragging = true;
            hasMoved = false;
            this.container.style.transition = 'none';

            const rect = this.container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            document.addEventListener('mousemove', onMouseMove, true);
            document.addEventListener('mouseup', onMouseUp, true);

            e.preventDefault();
            e.stopPropagation();
        });

        const updatePosition = () => {
            const maxX = window.innerWidth - 50;
            const maxY = window.innerHeight - 50;

            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));

            this.container.style.position = 'fixed';
            this.container.style.left = currentX + 'px';
            this.container.style.top = currentY + 'px';
            this.container.style.right = 'auto';
            this.container.style.bottom = 'auto';
            this.container.style.transform = 'none';
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            e.preventDefault();
            e.stopPropagation();

            hasMoved = true;
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(updatePosition);
        };

        const onMouseUp = (e) => {
            if (isDragging) {
                isDragging = false;
                this.container.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }

                if (hasMoved) {
                    // 松开鼠标时吸附
                    const snappedPos = this.applyPanelPosition(currentX, currentY, true);
                    this.panelPosition = snappedPos;
                    Storage.set('panelPosition', this.panelPosition);

                    // 阻止点击事件触发展开
                    e.stopPropagation();
                } else {
                    // 没有移动，触发展开
                    // 不阻止事件，让点击事件继续冒泡
                }
            }
            document.removeEventListener('mousemove', onMouseMove, true);
            document.removeEventListener('mouseup', onMouseUp, true);
        };
    }

    // 切换布局模式（单列折叠 <-> 标签页切换）
    toggleLayout() {
        this.tabMode = !this.tabMode;
        Storage.set('tabMode', this.tabMode);

        // 重新加载面板以应用新布局
        // 保存当前位置
        const currentPos = { ...this.panelPosition };

        // 移除旧面板
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }

        // 重新创建面板
        this.setupButton();

        // 恢复位置（需要重新计算以适应新宽度）
        setTimeout(() => {
            const snappedPos = this.applyPanelPosition(currentPos.x, currentPos.y, true);
            this.panelPosition = snappedPos;
            Storage.set('panelPosition', this.panelPosition);
        }, 100);

        // 显示切换提示
        this.showNotification(this.t(this.tabMode ? 'switchedToTab' : 'switchedToCollapse'));

        console.log(`布局模式切换: ${this.tabMode ? 'tab' : 'collapse'}`);
    }

    // 切换标签页
    switchTab(tabNum) {
        if (!this.tabMode) return;
        if (this.activeTab === tabNum) return;

        this.activeTab = tabNum;
        Storage.set('activeTab', this.activeTab);

        // 更新标签按钮状态
        const tabBtns = this.container.querySelectorAll('.tab-nav-btn');
        tabBtns.forEach((btn, index) => {
            if (index + 1 === tabNum) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 更新标签内容显示
        const tabContents = this.container.querySelectorAll('.lda-tab-content');
        tabContents.forEach(content => {
            const contentTab = parseInt(content.getAttribute('data-tab'));
            if (contentTab === tabNum) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // 根据标签页加载对应数据
        switch (tabNum) {
            case 1: // 账号信息
                this.loadUserTrustLevel();
                break;
            case 2: // 积分
                if (CURRENT_DOMAIN === 'linux.do' && this.creditContainer) {
                    this.loadCreditInfo();
                }
                break;
            case 4: // CDK 分数
                if (CURRENT_DOMAIN === 'linux.do' && this.cdkContainer) {
                    this.loadCdkInfo();
                }
                break;
            case 5: // 排名
                if (this.rankDataContainer) {
                    this.loadRankingData();
                }
                break;
        }

        console.log(`切换到标签页 ${tabNum}`);
    }

    // 标签页拖拽开始
    handleTabDragStart(e, tabId) {
        this.draggedTabId = tabId;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tabId);
    }

    // 标签页拖拽结束
    handleTabDragEnd(e) {
        e.target.classList.remove('dragging');
        // 移除所有 drag-over 样式
        const allBtns = this.tabNav.querySelectorAll('.tab-nav-btn');
        allBtns.forEach(btn => btn.classList.remove('drag-over'));
    }

    // 标签页拖拽经过
    handleTabDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.target.closest('.tab-nav-btn')?.classList.add('drag-over');
    }

    // 标签页拖拽离开
    handleTabDragLeave(e) {
        e.target.closest('.tab-nav-btn')?.classList.remove('drag-over');
    }

    // 标签页放置
    handleTabDrop(e, targetTabId) {
        e.preventDefault();
        const btn = e.target.closest('.tab-nav-btn');
        if (btn) btn.classList.remove('drag-over');

        if (this.draggedTabId === targetTabId) return;

        // 重新排序
        const draggedIndex = this.tabOrder.indexOf(this.draggedTabId);
        const targetIndex = this.tabOrder.indexOf(targetTabId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // 移除拖拽的元素
        this.tabOrder.splice(draggedIndex, 1);
        // 插入到目标位置
        this.tabOrder.splice(targetIndex, 0, this.draggedTabId);

        // 保存新顺序
        Storage.set('tabOrder', this.tabOrder);

        // 重新渲染标签页导航
        this.reorderTabNav();

        this.showNotification(this.t('tabOrderUpdated'));
    }

    // 重新排序标签页导航
    reorderTabNav() {
        // 清空导航栏
        this.tabNav.innerHTML = '';

        // 按新顺序重新添加按钮
        this.tabOrder.forEach(tabId => {
            const config = this.tabConfig[tabId];
            if (!config) return;

            const tabBtn = document.createElement("button");
            tabBtn.className = "tab-nav-btn" + (this.activeTab === tabId ? " active" : "");
            tabBtn.setAttribute('data-tab-id', tabId);
            tabBtn.innerHTML = `${config.icon} ${this.language === 'zh' ? config.nameZh : config.nameEn}`;
            tabBtn.addEventListener("click", () => this.switchTab(tabId));

            // 添加拖拽功能
            tabBtn.draggable = true;
            tabBtn.addEventListener('dragstart', (e) => this.handleTabDragStart(e, tabId));
            tabBtn.addEventListener('dragend', (e) => this.handleTabDragEnd(e));
            tabBtn.addEventListener('dragover', (e) => this.handleTabDragOver(e));
            tabBtn.addEventListener('drop', (e) => this.handleTabDrop(e, tabId));
            tabBtn.addEventListener('dragleave', (e) => this.handleTabDragLeave(e));

            this.tabNav.appendChild(tabBtn);
            this.tabButtons[tabId] = tabBtn;
        });
    }

    // 重置标签页顺序
    resetTabOrder() {
        this.tabOrder = [1, 2, 3, 4, 5, 6];
        Storage.set('tabOrder', this.tabOrder);
        this.reorderTabNav();
        this.showNotification(this.t('tabOrderReset'));
    }

    // 切换语言
    switchLanguage(lang) {
        if (this.language === lang) return;

        this.language = lang;
        Storage.set('language', lang);

        // 重新加载面板以应用新语言
        const currentPos = { ...this.panelPosition };

        // 移除旧面板
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }

        // 重新创建面板
        this.setupButton();

        // 恢复位置
        setTimeout(() => {
            const snappedPos = this.applyPanelPosition(currentPos.x, currentPos.y, true);
            this.panelPosition = snappedPos;
            Storage.set('panelPosition', this.panelPosition);
        }, 100);

        this.showNotification(this.t(lang === 'zh' ? 'switchedToChinese' : 'switchedToEnglish'));
    }

    // 加载排名数据
    async loadRankingData(isManualRefresh = false) {
        if (!this.rankDataContainer) return;

        // 显示加载状态
        if (isManualRefresh) {
            const refreshBtn = this.rankDataContainer.querySelector('.rank-refresh-btn');
            if (refreshBtn) {
                refreshBtn.textContent = this.t('refreshing');
                refreshBtn.disabled = true;
            }
        } else {
            this.rankDataContainer.innerHTML = `<div class="trust-level-loading">${this.t('loadingRank')}</div>`;
        }

        try {
            // 排名时间段配置
            const periods = [
                { key: 'daily', name: this.t('dailyRank'), icon: '📅' },
                { key: 'weekly', name: this.t('weeklyRank'), icon: '📆' },
                { key: 'monthly', name: this.t('monthlyRank'), icon: '🗓️' },
                { key: 'quarterly', name: this.t('quarterlyRank'), icon: '📊' },
                { key: 'yearly', name: this.t('yearlyRank'), icon: '📈' },
                { key: 'all', name: this.t('allTimeRank'), icon: '🏅' }
            ];

            // 并行获取所有时间段的排名数据
            const rankPromises = periods.map(period => this.fetchRankingByPeriod(period.key));
            const rankResults = await Promise.all(rankPromises);

            // 渲染排名数据
            this.renderRankingData(periods, rankResults);

        } catch (error) {
            console.error('加载排名数据失败:', error);
            this.rankDataContainer.innerHTML = `
                <div class="trust-level-header">
                    <span>🏆 ${this.t('sectionRanking')}</span>
                    <button class="trust-level-refresh rank-refresh-btn">${this.t('refresh')}</button>
                </div>
                <div class="trust-level-loading">${this.t('loadFailed')}</div>
            `;
            this.bindRankRefreshBtn();
        }
    }

    // 获取指定时间段的排名数据
    fetchRankingByPeriod(period) {
        return new Promise((resolve) => {
            fetch(`${BASE_URL}/leaderboard/1?period=${period}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('请求失败');
            })
            .then(data => {
                if (data && data.personal && data.personal.user) {
                    resolve({
                        score: data.personal.user.total_score || 0,
                        position: data.personal.position || data.personal.user.position || 0
                    });
                } else {
                    resolve({ score: 0, position: '-' });
                }
            })
            .catch(error => {
                console.error(`获取${period}排名失败:`, error);
                resolve({ score: 0, position: '-' });
            });
        });
    }

    // 渲染排名数据
    renderRankingData(periods, results) {
        const updateTime = new Date().toLocaleTimeString(this.language === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' });

        let html = `
            <div class="trust-level-header">
                <span>${this.t('myRanking')}</span>
                <button class="trust-level-refresh rank-refresh-btn">${this.t('refresh')}</button>
            </div>
        `;

        // 渲染每个时间段的排名（不带跳转链接）
        periods.forEach((period, index) => {
            const result = results[index];
            const positionText = result.position === '-' ? '-' : `#${result.position}`;
            const scoreText = result.score || 0;

            html += `
                <div class="rank-item" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 8px;
                    margin: 2px 0;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: white;
                ">
                    <span style="font-size: 11px; display: flex; align-items: center; gap: 4px;">
                        <span>${period.icon}</span>
                        <span>${period.name}</span>
                    </span>
                    <span style="display: flex; align-items: center; gap: 8px; font-size: 11px;">
                        <span style="color: #ffd700; font-weight: 600;">${scoreText}${this.t('points')}</span>
                        <span style="color: #87ceeb; min-width: 45px; text-align: right;">${positionText}</span>
                    </span>
                </div>
            `;
        });

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.1);">
                <a href="${BASE_URL}/leaderboard" target="_blank" style="font-size: 10px; color: rgba(255,255,255,0.8); text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${this.t('detailInfo')}</a>
                <span style="font-size: 9px; color: rgba(255,255,255,0.5);">${this.t('update')}: ${this.escapeHtml(updateTime)}</span>
            </div>
        `;

        this.rankDataContainer.innerHTML = html;
        this.bindRankRefreshBtn();
    }

    // 绑定排名刷新按钮事件
    bindRankRefreshBtn() {
        setTimeout(() => {
            const refreshBtn = this.rankDataContainer?.querySelector('.rank-refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.loadRankingData(true);
                });
            }
        }, 100);
    }

    toggleMinimize() {
        const wasMinimized = this.panelMinimized;
        this.panelMinimized = !this.panelMinimized;
        Storage.set('panelMinimized', this.panelMinimized);

        // 根据布局模式获取内容容器
        const content = this.tabMode
            ? this.container.querySelector('.tab-container')
            : this.container.querySelector('.panel-content');

        // 判断当前在左边还是右边
        const windowWidth = window.innerWidth;
        const isOnRight = this.container.classList.contains('on-right');

        if (this.panelMinimized) {
            // 缩小：从 280px -> 50px
            if (content) content.classList.add('hidden');
            this.container.classList.add('minimized');

            // 如果在右边，需要调整 left 值以保持右边缘位置不变
            if (isOnRight) {
                const currentLeft = parseInt(this.container.style.left);
                // 280px 变成 50px，差值是 230px，需要向右移动 230px
                this.container.style.left = (currentLeft + 230) + 'px';
                this.currentTranslateX = currentLeft + 230;
            }

            setTimeout(() => {
                const snappedPos = this.applyPanelPosition(this.currentTranslateX, this.currentTranslateY, true);
                this.panelPosition = snappedPos;
                Storage.set('panelPosition', this.panelPosition);
            }, 100);
        } else {
            // 展开：从 50px -> 280px
            if (content) content.classList.remove('hidden');
            this.container.classList.remove('minimized');

            // 如果在右边，需要调整 left 值以保持右边缘位置不变
            if (isOnRight) {
                const currentLeft = parseInt(this.container.style.left);
                // 50px 变成 280px，差值是 230px，需要向左移动 230px
                this.container.style.left = (currentLeft - 230) + 'px';
                this.currentTranslateX = currentLeft - 230;
            }

            setTimeout(() => {
                // 强制浏览器重排
                void this.container.offsetWidth;

                const snappedPos = this.applyPanelPosition(this.currentTranslateX, this.currentTranslateY, true);
                this.panelPosition = snappedPos;
                Storage.set('panelPosition', this.panelPosition);
            }, 350);
        }
    }

    setupWindowResizeHandler() {
        // 监听窗口大小变化，确保面板始终在可见区域内
        let resizeTimer;

        const adjustPosition = () => {
            if (this.currentTranslateX !== null && this.currentTranslateY !== null) {
                // 重新应用吸附位置（窗口大小变化时重新计算）
                const snappedPos = this.applyPanelPosition(this.currentTranslateX, this.currentTranslateY, true);

                // 保存新位置
                this.panelPosition = snappedPos;
                Storage.set('panelPosition', this.panelPosition);
            }

            // 根据屏幕高度自动折叠区域
            this.autoCollapseForSmallScreen();
        };

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(adjustPosition, 100);
        });

        // 初始调整一次
        setTimeout(adjustPosition, 500);
    }

    // 根据屏幕高度自动折叠区域
    autoCollapseForSmallScreen() {
        const screenHeight = window.innerHeight;

        // 如果屏幕高度小于 700px，自动折叠一些区域以确保内容能完整显示
        if (screenHeight < 700) {
            // 折叠插件设置区（如果未折叠）
            const allSections = this.container.querySelectorAll('.section-collapsible');
            for (const section of allSections) {
                const title = section.querySelector('.section-title');
                if (title && title.textContent.includes('插件设置')) {
                    if (!section.classList.contains('collapsed')) {
                        section.classList.add('collapsed');
                        if (this.settingsPluginSectionContent) {
                            this.settingsPluginSectionContent.classList.add('collapsed');
                        }
                    }
                    break;
                }
            }

            // 如果屏幕高度小于 600px，还要折叠账号信息区（除非正在自动阅读）
            if (screenHeight < 600 && !this.autoRunning) {
                if (this.accountSection && !this.accountSection.classList.contains('collapsed')) {
                    this.accountSection.classList.add('collapsed');
                    if (this.accountSectionContent) {
                        this.accountSectionContent.classList.add('collapsed');
                    }
                }
            }

            // 如果屏幕高度小于 500px，折叠自动阅读区（除非正在运行）
            if (screenHeight < 500 && !this.autoRunning) {
                const autoSection = this.container.querySelector('.section-collapsible');
                if (autoSection && !autoSection.classList.contains('collapsed')) {
                    autoSection.classList.add('collapsed');
                    if (this.autoSectionContent) {
                        this.autoSectionContent.classList.add('collapsed');
                    }
                }
            }
        }
    }

    checkLikeResumeTime() {
        if (this.likeResumeTime) {
            const now = Date.now();
            if (now >= this.likeResumeTime) {
                // 时间到了，清除冷却时间
                console.log('点赞冷却时间已过，可以正常使用点赞功能');
                this.likeResumeTime = null;
                Storage.set('likeResumeTime', null);
                this.updateClearCooldownButton();
                // 不自动开启点赞，由用户决定
            } else {
                // 还在冷却期，记录状态但不修改开关
                const remainingHours = Math.ceil((this.likeResumeTime - now) / (1000 * 60 * 60));
                const resumeDate = new Date(this.likeResumeTime);
                console.log(`点赞功能冷却中，将在 ${resumeDate.toLocaleString()} (还需约 ${remainingHours} 小时) 后恢复`);
                console.log(`提示：可以点击"清除点赞冷却"按钮立即恢复点赞功能`);
                this.updateClearCooldownButton();
            }
        } else {
            this.updateClearCooldownButton();
        }
    }

    // ========== IP 限流检测功能 ==========

    // 检测当前页面是否是 IP 限流页面
    detectIpRateLimit() {
        // 检查是否是正常的论坛页面（有 Discourse 特征）- 优先检查
        const isNormalPage = document.querySelector('#main-outlet') ||
                            document.querySelector('.topic-list') ||
                            document.querySelector('.topic-post') ||
                            document.querySelector('.d-header') ||
                            document.querySelector('.ember-application') ||
                            document.querySelector('[data-discourse-helper]');

        // 如果是正常页面，直接返回 false，不进行限流检测
        if (isNormalPage) {
            // 如果之前有误判的限流状态，清除它
            if (this.ipRateLimitResumeTime) {
                console.log('[IP限流] 检测到正常页面，清除之前的限流状态');
                this.ipRateLimitResumeTime = null;
                Storage.set('ipRateLimitResumeTime', null);
                this.stopIpRateLimitRecoveryCheck();
            }
            return false;
        }

        // 检查页面内容是否包含限流提示
        const pageText = document.body?.innerText || '';

        // 检测更严格的限流提示文本（必须是完整的错误页面特征）
        const rateLimitIndicators = [
            'You are being rate limited',
            'We have banned you temporarily',
            'Too Many Requests',
            'Error 429',
            'HTTP 429'
        ];

        // 使用更严格的匹配：必须包含这些完整短语
        const isRateLimited = rateLimitIndicators.some(indicator =>
            pageText.includes(indicator)
        );

        // 另外检查页面标题（更严格）
        const pageTitle = document.title || '';
        const titleRateLimited = pageTitle.includes('Rate Limited') ||
                                pageTitle.includes('429') ||
                                pageTitle.includes('Banned');

        // 额外检查：页面内容很短（错误页面通常内容很少）
        const isShortPage = pageText.length < 2000;

        // 只有同时满足：检测到限流指标 + 页面内容很短 + 不是正常页面，才判定为限流
        if ((isRateLimited || titleRateLimited) && isShortPage) {
            console.warn('🚫 [IP限流] 检测到 IP 被限流！');
            this.handleIpRateLimit();
            return true;
        }

        return false;
    }

    // 处理 IP 限流
    handleIpRateLimit() {
        // 如果已经在处理中，避免重复
        if (this.ipRateLimitResumeTime && Date.now() < this.ipRateLimitResumeTime) {
            console.log('[IP限流] 已在等待恢复中，跳过');
            return;
        }

        // 设置 30 分钟后恢复
        const waitTime = 30 * 60 * 1000; // 30 分钟
        this.ipRateLimitResumeTime = Date.now() + waitTime;
        Storage.set('ipRateLimitResumeTime', this.ipRateLimitResumeTime);

        // 停止自动阅读
        if (this.autoRunning) {
            console.log('[IP限流] 停止自动阅读...');
            this.stopScrolling();
            this.stopNavigationGuard();
            this.autoRunning = false;
            this.setSessionStorage('autoRunning', false);

            // 更新按钮状态
            if (this.button) {
                this.button.innerHTML = `<span class="btn-icon">▶</span><span class="btn-text">${this.t('startReading')}</span>`;
                this.button.classList.remove('running');
            }

            // 清理定时器
            if (this.navigationTimeout) {
                clearTimeout(this.navigationTimeout);
                this.navigationTimeout = null;
            }
        }

        // 显示通知
        const resumeTime = new Date(this.ipRateLimitResumeTime);
        this.showNotification(`${this.t('ipRateLimited')}\n${this.t('ipRateLimitWait')} (${resumeTime.toLocaleTimeString()})`);

        console.log(`[IP限流] 自动阅读已暂停，将在 ${resumeTime.toLocaleString()} 后自动恢复`);

        // 启动恢复检测定时器
        this.startIpRateLimitRecoveryCheck();
    }

    // 检查 IP 限流状态（初始化时调用）
    checkIpRateLimitStatus() {
        if (this.ipRateLimitResumeTime) {
            const now = Date.now();

            // 首先检查当前页面是否是正常页面
            const isNormalPage = document.querySelector('#main-outlet') ||
                                document.querySelector('.topic-list') ||
                                document.querySelector('.topic-post') ||
                                document.querySelector('.d-header') ||
                                document.querySelector('.ember-application');

            if (isNormalPage) {
                // 当前是正常页面，说明之前的限流状态是误判，清除它
                console.log('[IP限流] 当前是正常页面，清除之前的限流状态（可能是误判）');
                this.ipRateLimitResumeTime = null;
                Storage.set('ipRateLimitResumeTime', null);
                return;
            }

            if (now >= this.ipRateLimitResumeTime) {
                // 时间到了，清除限流状态
                console.log('[IP限流] 限流时间已过，清除状态');
                this.ipRateLimitResumeTime = null;
                Storage.set('ipRateLimitResumeTime', null);
            } else {
                // 还在限流期，记录状态
                const remainingMinutes = Math.ceil((this.ipRateLimitResumeTime - now) / (1000 * 60));
                const resumeTime = new Date(this.ipRateLimitResumeTime);
                console.log(`[IP限流] IP 限流中，还需约 ${remainingMinutes} 分钟，将在 ${resumeTime.toLocaleString()} 后恢复`);

                // 如果正在自动阅读，强制停止
                if (this.autoRunning) {
                    console.log('[IP限流] 检测到自动阅读运行中，强制停止');
                    this.autoRunning = false;
                    this.setSessionStorage('autoRunning', false);
                }

                // 启动恢复检测定时器
                this.startIpRateLimitRecoveryCheck();
            }
        }
    }

    // 启动 IP 限流恢复检测定时器
    startIpRateLimitRecoveryCheck() {
        // 清除之前的定时器
        if (this.ipRateLimitCheckInterval) {
            clearInterval(this.ipRateLimitCheckInterval);
        }

        // 每分钟检查一次是否可以恢复
        this.ipRateLimitCheckInterval = setInterval(() => {
            if (!this.ipRateLimitResumeTime) {
                clearInterval(this.ipRateLimitCheckInterval);
                this.ipRateLimitCheckInterval = null;
                return;
            }

            const now = Date.now();
            if (now >= this.ipRateLimitResumeTime) {
                console.log('[IP限流] 限流时间到，尝试恢复...');
                this.tryResumeAfterIpRateLimit();
            } else {
                const remainingMinutes = Math.ceil((this.ipRateLimitResumeTime - now) / (1000 * 60));
                console.log(`[IP限流] 等待恢复中，还需 ${remainingMinutes} 分钟`);
            }
        }, 60000); // 每分钟检查一次

        console.log('[IP限流] 恢复检测定时器已启动');
    }

    // 尝试在 IP 限流解除后恢复
    tryResumeAfterIpRateLimit() {
        // 清除限流状态
        this.ipRateLimitResumeTime = null;
        Storage.set('ipRateLimitResumeTime', null);

        // 清除定时器
        if (this.ipRateLimitCheckInterval) {
            clearInterval(this.ipRateLimitCheckInterval);
            this.ipRateLimitCheckInterval = null;
        }

        // 显示恢复通知
        this.showNotification(this.t('ipRateLimitResume'));

        console.log('[IP限流] IP 限流已解除，可以恢复自动阅读');

        // 刷新页面以重新开始（因为当前页面可能是限流页面）
        // 跳转到首页
        window.location.href = `${BASE_URL}/latest`;
    }

    // 停止 IP 限流恢复检测
    stopIpRateLimitRecoveryCheck() {
        if (this.ipRateLimitCheckInterval) {
            clearInterval(this.ipRateLimitCheckInterval);
            this.ipRateLimitCheckInterval = null;
            console.log('[IP限流] 恢复检测定时器已停止');
        }
    }

    // ========== CloudFlare 5秒盾自动跳转功能 ==========

    CF_BYPASS_CONFIG = {
        ERROR_TEXTS: ['403 error', '该回应是很久以前创建的', 'reaction was created too long ago', '我们无法加载该话题'],
        DIALOG_SELECTOR: '.dialog-body',
        CHALLENGE_PATH: '/challenge'
    };

    isChallengePage() {
        return window.location.pathname.startsWith(this.CF_BYPASS_CONFIG.CHALLENGE_PATH);
    }

    isChallengeFailure() {
        if (this.isChallengePage()) return false;
        const el = document.querySelector(this.CF_BYPASS_CONFIG.DIALOG_SELECTOR);
        if (!el) return false;
        const text = el.innerText || '';
        return this.CF_BYPASS_CONFIG.ERROR_TEXTS.some(t => text.includes(t));
    }

    redirectToChallenge() {
        if (this.isChallengePage()) return;
        const url = `${this.CF_BYPASS_CONFIG.CHALLENGE_PATH}?redirect=${encodeURIComponent(window.location.href)}`;
        this.showNotification(this.t('cfBypassDetected'));
        window.location.href = url;
    }

    checkAndRedirectCF() {
        if (!this.cfBypassEnabled) return;
        if (this.isChallengeFailure()) this.redirectToChallenge();
    }

    initCloudFlareBypass() {
        if (!this.cfBypassEnabled) return;
        this.checkAndRedirectCF();
        const observer = new MutationObserver(() => this.checkAndRedirectCF());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    manualTriggerCF() {
        if (this.isChallengePage()) {
            this.showNotification(this.t('cfBypassAlreadyOnChallenge'));
            return;
        }
        this.showNotification(this.t('cfBypassManual'));
        const url = `${this.CF_BYPASS_CONFIG.CHALLENGE_PATH}?redirect=${encodeURIComponent(window.location.href)}`;
        window.location.href = url;
    }

    updateClearCooldownButton() {
        if (!this.clearCooldownBtn) return;

        // 清除之前的定时器
        if (this.cooldownUpdateTimer) {
            clearInterval(this.cooldownUpdateTimer);
            this.cooldownUpdateTimer = null;
        }

        // 检查是否有冷却状态（来自 LikeCounter 或旧的 likeResumeTime）
        const likeCounterCooldown = this.likeCounter?.isInCooldown?.();
        const hasOldCooldown = this.likeResumeTime && Date.now() < this.likeResumeTime;

        if (likeCounterCooldown || hasOldCooldown) {
            // 如果 LikeCounter 已经显示冷却倒计时，按钮只显示简洁文字（不重复显示倒计时）
            if (likeCounterCooldown) {
                this.clearCooldownBtn.innerHTML = `<span class="btn-icon">❄️</span><span class="btn-text">${this.t('clearCooldown')}</span>`;
                this.clearCooldownBtn.style.display = 'flex';
            } else if (hasOldCooldown) {
                // 旧的冷却机制：显示倒计时（因为 LikeCounter 可能没有这个冷却信息）
                const updateDisplay = () => {
                    const now = Date.now();
                    if (now >= this.likeResumeTime) {
                        // 冷却结束
                        this.clearCooldownBtn.style.display = 'none';
                        if (this.cooldownUpdateTimer) {
                            clearInterval(this.cooldownUpdateTimer);
                            this.cooldownUpdateTimer = null;
                        }
                        // 清除冷却时间
                        this.likeResumeTime = null;
                        Storage.set('likeResumeTime', null);
                        this.showNotification(this.t('likeCooldownCleared'));
                        return;
                    }

                    const remaining = this.likeResumeTime - now;
                    const hours = Math.floor(remaining / (1000 * 60 * 60));
                    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

                    // 构建显示文本
                    let timeText = this.t('remaining');
                    if (hours > 0) {
                        timeText += `${hours}${this.t('hours')}`;
                    }
                    if (minutes > 0 || hours > 0) {
                        timeText += `${minutes}${this.t('minutes')}`;
                    }
                    timeText += `${seconds}${this.t('seconds')}`;

                    this.clearCooldownBtn.innerHTML = `<span class="btn-icon">🔥</span><span class="btn-text">${this.t('clearCooldown')} (${timeText})</span>`;
                };

                // 立即更新一次
                updateDisplay();
                this.clearCooldownBtn.style.display = 'flex';

                // 每秒更新一次
                this.cooldownUpdateTimer = setInterval(updateDisplay, 1000);
            }
        } else {
            this.clearCooldownBtn.style.display = 'none';
        }
    }

    handleClearCooldown() {
        const likeCounterCooldown = this.likeCounter?.isInCooldown?.();
        const hasOldCooldown = this.likeResumeTime && Date.now() < this.likeResumeTime;

        if (!likeCounterCooldown && !hasOldCooldown) {
            this.showNotification(this.t('noCooldown'));
            return;
        }

        // 清除 LikeCounter 的冷却
        if (this.likeCounter) {
            this.likeCounter.clearCooldown();
        }

        // 清除旧的冷却时间
        this.likeResumeTime = null;
        Storage.set('likeResumeTime', null);

        // 更新按钮显示
        this.updateClearCooldownButton();

        // 显示成功提示
        this.showNotification(this.t('likeCooldownCleared'));
        console.log('[清除冷却] 点赞冷却时间已清除');
    }

    observeLikeLimit() {
        // 标志：是否已经通过 API 处理过点赞限制
        this._likeLimitHandledByAPI = false;
        this._lastLikeLimitTime = 0;
        // 标志：防止 DOM 监听器在短时间内重复触发（防抖）
        this._likeLimitPopupLastTime = 0;
        this._likeLimitPopupTimeout = null;

        // 优先：拦截 XHR 请求，捕获 429 错误响应（精确获取等待时间）
        this.interceptFetchForLikeLimit();

        // 备用：监听 DOM 变化，检测点赞限制弹窗
        // 只有当 XHR 拦截器未能处理时，才使用 DOM 解析的时间
        const self = this;
        const observer = new MutationObserver((mutations) => {
            // 防抖：500ms 内不重复处理
            const now = Date.now();
            if (now - self._likeLimitPopupLastTime < 500) {
                return;
            }

            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        // 首先检查是否是模态框/弹窗元素，排除普通内容（如通知、帖子、回复等）
                        // Discourse 的点赞限制弹窗通常有以下特征类名
                        const isModalElement = (
                            node.classList.contains('modal') ||
                            node.classList.contains('d-modal') ||
                            node.classList.contains('bootbox') ||
                            node.classList.contains('dialog-body') ||
                            node.classList.contains('popup-menu') ||
                            node.closest?.('.modal, .d-modal, .bootbox, .dialog-container, .fk-d-modal') ||
                            // 检查 node 本身是否包含模态框结构
                            node.querySelector?.('.modal, .d-modal, .bootbox, .dialog-body, .fk-d-modal__inner')
                        );

                        // 如果不是模态框元素，跳过检测（避免匹配通知、帖子等普通内容）
                        if (!isModalElement) {
                            continue;
                        }

                        const text = node.textContent || '';

                        // 检测点赞限制弹窗
                        const isLikeLimit = (
                            (text.includes('点赞上限') ||
                             text.includes('分享很多爱') ||
                             (text.includes('点赞') && text.includes('小时后再次点赞'))) &&
                            !text.includes('回复') &&
                            !text.includes('创建更多新回复')
                        );

                        if (isLikeLimit) {
                            // 更新最后处理时间
                            self._likeLimitPopupLastTime = now;

                            // 清除之前的超时
                            if (self._likeLimitPopupTimeout) {
                                clearTimeout(self._likeLimitPopupTimeout);
                            }

                            // 等待 XHR 拦截器处理（XHR load 事件通常在 DOM 更新后触发）
                            self._likeLimitPopupTimeout = setTimeout(() => {
                                const currentTime = Date.now();
                                // 检查 XHR 是否已经处理过（2秒内）
                                if (self._likeLimitHandledByAPI && (currentTime - self._lastLikeLimitTime) < 2000) {
                                    console.log('[点赞限制] XHR 已处理，DOM 监听器仅关闭弹窗');
                                } else {
                                    // XHR 未处理，使用 DOM 解析作为备用方案
                                    console.log('[点赞限制] XHR 未处理，使用 DOM 解析作为备用');
                                    self.handleLikeLimit(text);
                                }

                                // 无论如何都自动关闭弹窗
                                self.closeLikeLimitPopup();
                            }, 300); // 等待 300ms，让 XHR 拦截器有时间处理

                            return; // 找到后立即返回，不再继续遍历
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 拦截 fetch 和 XMLHttpRequest 请求，捕获点赞 API 的 429 错误
    interceptFetchForLikeLimit() {
        const self = this;

        // 拦截 fetch
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            // 检查是否是点赞相关的 API 请求
            const url = args[0]?.toString() || '';
            const isLikeRequest = url.includes('/discourse-reactions/') ||
                                  url.includes('/toggle.json') ||
                                  url.includes('/like');

            // 如果是 429 错误且是点赞请求
            if (response.status === 429 && isLikeRequest) {
                try {
                    // 克隆响应以便读取内容（原响应只能读取一次）
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.json();

                    console.log('[点赞限制] fetch 检测到 429 错误:', data);

                    // 检查是否是点赞限制（而不是其他类型的限制）
                    if (data.error_type === 'rate_limit' && data.extras) {
                        const waitSeconds = data.extras.wait_seconds;
                        const timeLeft = data.extras.time_left;

                        if (waitSeconds && waitSeconds > 0) {
                            console.log(`[点赞限制] 从 fetch API 获取精确等待时间: ${waitSeconds} 秒 (${timeLeft})`);
                            self.handleLikeLimitFromAPI(waitSeconds, timeLeft);
                        }
                    }
                } catch (e) {
                    console.error('[点赞限制] 解析 fetch 429 响应失败:', e);
                }
            }

            return response;
        };

        // 拦截 XMLHttpRequest（jQuery ajax 使用的是 XHR）
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            this._method = method;
            return originalXHROpen.apply(this, [method, url, ...rest]);
        };

        XMLHttpRequest.prototype.send = function(body) {
            const xhr = this;
            const url = xhr._url || '';

            // 检查是否是点赞相关的 API 请求
            const isLikeRequest = url.includes('/discourse-reactions/') ||
                                  url.includes('/toggle.json') ||
                                  url.includes('/like');

            if (isLikeRequest) {
                xhr.addEventListener('load', function() {
                    if (xhr.status === 429) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            console.log('[点赞限制] XHR 检测到 429 错误:', data);

                            // 检查是否是点赞限制
                            if (data.error_type === 'rate_limit' && data.extras) {
                                const waitSeconds = data.extras.wait_seconds;
                                const timeLeft = data.extras.time_left;

                                if (waitSeconds && waitSeconds > 0) {
                                    console.log(`[点赞限制] 从 XHR API 获取精确等待时间: ${waitSeconds} 秒 (${timeLeft})`);
                                    self.handleLikeLimitFromAPI(waitSeconds, timeLeft);
                                }
                            }
                        } catch (e) {
                            console.error('[点赞限制] 解析 XHR 429 响应失败:', e);
                        }
                    }
                });
            }

            return originalXHRSend.apply(this, [body]);
        };

        console.log('[点赞限制] 已启用 fetch 和 XHR 拦截器');
    }

    // 处理从 API 获取的点赞限制
    handleLikeLimitFromAPI(waitSeconds, timeLeft) {
        console.log(`[点赞限制] 处理 API 返回的限制: ${waitSeconds} 秒`);

        // 标记已通过 API 处理，防止 DOM 监听器重复处理
        this._likeLimitHandledByAPI = true;
        this._lastLikeLimitTime = Date.now();

        // 计算恢复时间（使用精确的秒数）
        const resumeTime = Date.now() + (waitSeconds * 1000);
        this.likeResumeTime = resumeTime;
        Storage.set('likeResumeTime', resumeTime);

        // 同步到 LikeCounter 的冷却状态（确保两套机制一致）
        if (this.likeCounter && resumeTime > this.likeCounter.state.cooldownUntil) {
            this.likeCounter.state.cooldownUntil = resumeTime;
            this.likeCounter.saveState();
            this.likeCounter.notifyUIUpdate();
            console.log(`[点赞限制] 已同步冷却状态到 LikeCounter`);
        }

        // 关闭自动点赞和快速点赞
        this.autoLikeEnabled = false;
        this.quickLikeEnabled = false;
        Storage.set('autoLikeEnabled', false);
        Storage.set('quickLikeEnabled', false);

        // 更新UI - 更精确地定位到点赞开关
        const toggleRows = this.container.querySelectorAll('.toggle-row');
        for (const row of toggleRows) {
            const label = row.querySelector('.toggle-label');
            if (label && (label.textContent.includes('自动点赞') || label.textContent.includes('快速点赞'))) {
                const input = row.querySelector('input[type="checkbox"]');
                if (input) {
                    input.checked = false;
                }
            }
        }

        // 更新冷却按钮显示
        this.updateClearCooldownButton();

        const resumeDate = new Date(resumeTime);
        console.log(`[点赞限制] 已达到点赞上限，将在 ${resumeDate.toLocaleString()} (${timeLeft}) 后恢复`);

        // 显示提示
        this.showNotification(`${this.t('likeLimitReached')}${timeLeft}`);
    }

    handleLikeLimit(text) {
        console.log('检测到点赞限制提示:', text);

        let waitMinutes = 0; // 等待时间（分钟）

        // 优先匹配 "在 X 分钟后" 格式
        const minuteMatch = text.match(/[在|可以在]\s*(\d+)\s*分钟后/);
        if (minuteMatch) {
            waitMinutes = parseInt(minuteMatch[1]);
            console.log(`从 "X分钟后" 提取到等待时间: ${waitMinutes} 分钟`);
        } else {
            // 匹配 "在 X 小时后" 格式
            const hourMatch = text.match(/[在|可以在]\s*(\d+)\s*小时后/);
            if (hourMatch) {
                waitMinutes = parseInt(hourMatch[1]) * 60;
                console.log(`从 "X小时后" 提取到等待时间: ${hourMatch[1]} 小时 = ${waitMinutes} 分钟`);
            } else {
                // 尝试匹配最后一个数字+单位的组合
                const allMinuteMatches = text.match(/(\d+)\s*分钟/g);
                const allHourMatches = text.match(/(\d+)\s*小时/g);

                if (allMinuteMatches && allMinuteMatches.length > 0) {
                    // 取最后一个分钟匹配
                    const lastMatch = allMinuteMatches[allMinuteMatches.length - 1].match(/(\d+)/);
                    if (lastMatch) {
                        waitMinutes = parseInt(lastMatch[1]);
                        console.log(`从最后一个匹配提取到等待时间: ${waitMinutes} 分钟`);
                    }
                } else if (allHourMatches && allHourMatches.length > 0) {
                    // 取最后一个小时匹配
                    const lastMatch = allHourMatches[allHourMatches.length - 1].match(/(\d+)/);
                    if (lastMatch) {
                        waitMinutes = parseInt(lastMatch[1]) * 60;
                        console.log(`从最后一个匹配提取到等待时间: ${lastMatch[1]} 小时 = ${waitMinutes} 分钟`);
                    }
                } else {
                    // 默认10小时
                    waitMinutes = 10 * 60;
                    console.log(`未能提取等待时间，使用默认值: 10 小时 = ${waitMinutes} 分钟`);
                }
            }
        }

        // 计算恢复时间
        const resumeTime = Date.now() + (waitMinutes * 60 * 1000);
        this.likeResumeTime = resumeTime;
        Storage.set('likeResumeTime', resumeTime);

        // 同步到 LikeCounter 的冷却状态（确保两套机制一致）
        if (this.likeCounter && resumeTime > this.likeCounter.state.cooldownUntil) {
            this.likeCounter.state.cooldownUntil = resumeTime;
            this.likeCounter.saveState();
            this.likeCounter.notifyUIUpdate();
            console.log(`[点赞限制] 已同步冷却状态到 LikeCounter`);
        }

        // 关闭自动点赞和快速点赞
        this.autoLikeEnabled = false;
        this.quickLikeEnabled = false;
        Storage.set('autoLikeEnabled', false);
        Storage.set('quickLikeEnabled', false);

        // 更新UI - 更精确地定位到点赞开关
        const toggleRows = this.container.querySelectorAll('.toggle-row');
        for (const row of toggleRows) {
            const label = row.querySelector('.toggle-label');
            if (label && (label.textContent.includes('自动点赞') || label.textContent.includes('快速点赞'))) {
                const input = row.querySelector('input[type="checkbox"]');
                if (input) {
                    input.checked = false;
                }
            }
        }

        const resumeDate = new Date(resumeTime);
        const displayTime = waitMinutes >= 60
            ? `${Math.floor(waitMinutes / 60)}${this.t('hours')}${waitMinutes % 60 > 0 ? (waitMinutes % 60) + this.t('minutes') : ''}`.trim()
            : `${waitMinutes}${this.t('minutes')}`;

        console.log(`已达到点赞上限，自动关闭点赞功能，将在 ${resumeDate.toLocaleString()} (${displayTime}后) 恢复`);

        // 显示提示 - 使用提取到的实际时间
        this.showNotification(`${this.t('likeLimitReached')}${displayTime}`);
    }

    // 关闭点赞限制弹窗
    closeLikeLimitPopup() {
        console.log('[点赞限制] 尝试关闭弹窗...');

        // 方法1：直接查找并点击确定/关闭按钮
        const buttonSelectors = [
            // Discourse 标准弹窗按钮
            '.dialog-footer .btn-primary',
            '.modal-footer .btn-primary',
            '.d-modal__footer .btn-primary',
            '.bootbox .btn-primary',
            // 通用按钮
            'button.btn-primary',
            'button.btn-default',
            // 关闭按钮
            '.modal-close',
            '.close-modal',
            '.d-modal__dismiss',
            'button[aria-label="关闭"]',
            'button[aria-label="Close"]',
            '.dialog-close',
            // Discourse 特定
            '.d-modal__dismiss-icon',
            '.modal-header .close'
        ];

        for (const selector of buttonSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                // 检查元素是否可见
                if (element.offsetParent === null) continue;

                const text = (element.textContent || '').trim();
                // 对于 btn-primary，直接点击（通常是确定按钮）
                if (selector.includes('btn-primary') ||
                    text.includes('确定') || text.includes('OK') || text.includes('关闭') || text.includes('好') ||
                    element.classList.contains('modal-close') ||
                    element.classList.contains('close-modal') ||
                    element.classList.contains('d-modal__dismiss')) {
                    console.log(`[点赞限制] 找到关闭按钮: ${selector}, 文本: "${text}"`);
                    try {
                        element.click();
                        console.log('[点赞限制] 已点击关闭按钮');
                        return;
                    } catch (e) {
                        console.error('[点赞限制] 点击按钮失败:', e);
                    }
                }
            }
        }

        // 方法2：查找所有可见的弹窗，尝试点击其中的按钮
        const modalSelectors = ['.modal', '.d-modal', '.bootbox', '.dialog-body', '[role="dialog"]'];
        for (const modalSelector of modalSelectors) {
            const modal = document.querySelector(modalSelector);
            if (modal && modal.offsetParent !== null) {
                // 在弹窗内查找按钮
                const buttons = modal.querySelectorAll('button');
                for (const btn of buttons) {
                    const text = (btn.textContent || '').trim();
                    if (text.includes('确定') || text.includes('OK') || text.includes('关闭') || text.includes('好') ||
                        btn.classList.contains('btn-primary')) {
                        console.log(`[点赞限制] 在弹窗内找到按钮: "${text}"`);
                        try {
                            btn.click();
                            console.log('[点赞限制] 已点击弹窗内按钮');
                            return;
                        } catch (e) {
                            console.error('[点赞限制] 点击弹窗内按钮失败:', e);
                        }
                    }
                }
            }
        }

        // 方法3：尝试按 Escape 键关闭
        console.log('[点赞限制] 未找到关闭按钮，尝试按 Escape 键');
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true
        }));

        // 方法4：延迟后再次尝试（有时弹窗需要时间渲染）
        setTimeout(() => {
            const visibleButtons = document.querySelectorAll('.dialog-footer button, .modal-footer button');
            for (const btn of visibleButtons) {
                if (btn.offsetParent !== null) {
                    console.log(`[点赞限制] 延迟后找到按钮: "${btn.textContent}"`);
                    btn.click();
                    return;
                }
            }
        }, 500);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 100000;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 3秒后自动消失
        setTimeout(() => {
            notification.style.transition = 'all 0.3s';
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 获取当前用户名（参考 1.js 的多种方法，优先使用 DOM 方式，减少 API 调用避免 429）
    async getCurrentUsername() {
        if (this.currentUsername) return this.currentUsername;

        // cdk.linux.do 没有 Discourse API，跳过获取
        if (CURRENT_DOMAIN === 'cdk.linux.do') {
            return null;
        }

        try {
            // 方法1：从 Discourse 全局对象获取
            try {
                const currentUser = window.Discourse?.User?.current?.() ||
                    window.Discourse?.currentUser ||
                    window.User?.current?.();
                if (currentUser?.username) {
                    this.currentUsername = currentUser.username;
                    return this.currentUsername;
                }
            } catch (e) { }

            // 方法2：从页面 preload 数据获取
            try {
                const preloadData = document.getElementById('data-preloaded');
                if (preloadData) {
                    const data = JSON.parse(preloadData.dataset.preloaded);
                    if (data?.currentUser) {
                        const cu = JSON.parse(data.currentUser);
                        if (cu?.username) {
                            this.currentUsername = cu.username;
                            return this.currentUsername;
                        }
                    }
                }
            } catch (e) { }

            // 方法3：从用户菜单头像 alt 获取
            const userMenuBtn = document.querySelector('.header-dropdown-toggle.current-user');
            if (userMenuBtn) {
                const img = userMenuBtn.querySelector('img[alt]');
                if (img && img.alt) {
                    this.currentUsername = img.alt.trim().replace(/^@/, '');
                    return this.currentUsername;
                }
            }

            // 方法4：从用户头像 title 获取
            const userAvatar = document.querySelector('.current-user img[title]');
            if (userAvatar && userAvatar.title) {
                this.currentUsername = userAvatar.title.trim().replace(/^@/, '');
                return this.currentUsername;
            }

            // 方法5：从当前用户链接 href 获取
            const currentUserLink = document.querySelector('a.current-user, .header-dropdown-toggle.current-user a');
            if (currentUserLink) {
                const href = currentUserLink.getAttribute('href');
                if (href && href.includes('/u/')) {
                    const username = href.split('/u/')[1].split('/')[0];
                    if (username) {
                        this.currentUsername = username.trim().replace(/^@/, '');
                        return this.currentUsername;
                    }
                }
            }

            // 方法6：从导航栏用户头像链接获取
            try {
                const avatarLink = document.querySelector('#current-user a[href*="/u/"]');
                if (avatarLink) {
                    const match = avatarLink.href.match(/\/u\/([^\/]+)/);
                    if (match) {
                        this.currentUsername = match[1].trim().replace(/^@/, '');
                        return this.currentUsername;
                    }
                }
            } catch (e) { }

            // 方法7：从 localStorage 获取（Discourse 常用存储）
            try {
                const stored = localStorage.getItem('discourse_current_user');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed?.username) {
                        this.currentUsername = parsed.username;
                        return this.currentUsername;
                    }
                }
            } catch (e) { }

            // 方法8：遍历页面用户链接（排除帖子列表/帖子流）
            try {
                const userLinks = document.querySelectorAll('a[href*="/u/"]');
                for (const link of userLinks) {
                    if (link.closest('.topic-list') || link.closest('.post-stream')) continue;
                    const href = link.getAttribute('href');
                    if (href && href.includes('/u/')) {
                        const username = href.split('/u/')[1].split('/')[0];
                        if (username) {
                            this.currentUsername = username.trim().replace(/^@/, '');
                            return this.currentUsername;
                        }
                    }
                }
            } catch (e) { }

            // 方法9：如果当前 URL 在用户页面
            if (window.location.pathname.includes('/u/')) {
                const username = window.location.pathname.split('/u/')[1].split('/')[0];
                if (username) {
                    this.currentUsername = username.trim().replace(/^@/, '');
                    return this.currentUsername;
                }
            }

            // 方法10（最后手段）：从 API 获取 - 只在支持的站点使用，且只有前面所有方法都失败时才调用
            if (CURRENT_DOMAIN === 'linux.do' || CURRENT_DOMAIN === 'idcflare.com') {
                // 先检查是否在 429 冷却期
                const session429Until = Storage.get('session429Until', 0);
                if (session429Until > Date.now()) {
                    const remainMinutes = Math.ceil((session429Until - Date.now()) / 60000);
                    console.log(`[Session] session/current 429 冷却期中，剩余 ${remainMinutes} 分钟，跳过请求`);
                    return null;
                }

                const response = await fetch(`${BASE_URL}/session/current.json`);
                // 检测 429 错误
                if (response.status === 429) {
                    console.warn('[Session] session/current 遇到 429，设置 30 分钟冷却');
                    Storage.set('session429Until', Date.now() + 30 * 60 * 1000);
                    return null;
                }
                if (response.ok) {
                    const data = await response.json();
                    if (data.current_user && data.current_user.username) {
                        this.currentUsername = data.current_user.username;
                        return this.currentUsername;
                    }
                }
            }
        } catch (error) {
            console.error('获取用户名失败:', error);
        }
        return null;
    }

    // 加载用户信任等级
    async loadUserTrustLevel(isManualRefresh = false) {
        const username = await this.getCurrentUsername();
        if (!username) {
            this.trustLevelContainer.innerHTML = '<div class="trust-level-loading">未登录</div>';
            return;
        }

        const now = Date.now();
        const TRUST_LEVEL_CACHE_INTERVAL = 30 * 60 * 1000; // 30分钟
        const cacheKey = `trustLevelCache_${CURRENT_DOMAIN}_${username}`;
        const lastFetchKey = `lastTrustLevelFetch_${CURRENT_DOMAIN}_${username}`;
        const lastFetch = Storage.get(lastFetchKey, 0);

        // 非手动刷新时，检查30分钟缓存
        if (!isManualRefresh && lastFetch > 0 && (now - lastFetch) < TRUST_LEVEL_CACHE_INTERVAL) {
            const cachedData = Storage.get(cacheKey, null);
            if (cachedData) {
                console.log('使用缓存的等级数据，距上次获取:', Math.round((now - lastFetch) / 1000 / 60), '分钟');
                this.renderCachedTrustLevel(cachedData, lastFetch);
                return;
            }
        }

        // 手动刷新时显示加载状态
        if (isManualRefresh) {
            const refreshBtn = this.trustLevelContainer.querySelector('.trust-level-refresh');
            if (refreshBtn) {
                refreshBtn.textContent = this.t('refreshing');
                refreshBtn.disabled = true;
            }
        }

        try {
            // 域名判断：idcflare.com 使用原逻辑，linux.do 使用新逻辑
            if (CURRENT_DOMAIN === 'idcflare.com') {
                // idcflare.com 使用原来的 summary.json 逻辑
                const summaryResponse = await fetch(`${BASE_URL}/u/${username}/summary.json`);
                if (summaryResponse.ok) {
                    const data = await summaryResponse.json();
                    if (data.user_summary) {
                        this.renderTrustLevel(data, username);
                        return;
                    }
                }
                throw new Error('无法获取等级数据');
            } else if (CURRENT_DOMAIN === 'linux.do') {
                // linux.do: 完全使用 1.js 的逻辑（使用GM_xmlhttpRequest跨域请求）
                await this.fetchLinuxDoDataWithGM(username);
            }
        } catch (error) {
            console.error('加载信任等级失败:', error);
            this.trustLevelContainer.innerHTML = `
                <div class="trust-level-header">
                    📊 信任等级
                    <button class="trust-level-refresh" onclick="window.browseController.loadUserTrustLevel(true)">🔄 刷新</button>
                </div>
                <div class="trust-level-loading">加载失败，请点击刷新重试</div>
            `;
        } finally {
            // 恢复刷新按钮状态
            if (isManualRefresh) {
                setTimeout(() => {
                    const refreshBtn = this.trustLevelContainer.querySelector('.trust-level-refresh');
                    if (refreshBtn) {
                        refreshBtn.textContent = '🔄 刷新';
                        refreshBtn.disabled = false;
                    }
                }, 1000);
            }
        }
    }

    // 保存等级数据缓存（区分域名）
    saveTrustLevelCache(username, data) {
        const cacheKey = `trustLevelCache_${CURRENT_DOMAIN}_${username}`;
        const lastFetchKey = `lastTrustLevelFetch_${CURRENT_DOMAIN}_${username}`;
        Storage.set(cacheKey, data);
        Storage.set(lastFetchKey, Date.now());
        console.log(`等级数据已缓存 (${CURRENT_DOMAIN})`);

        // 保存每日历史快照
        this.saveDailySnapshot(username, data);
    }

    // 保存每日历史快照（用于追踪数据变化）
    saveDailySnapshot(username, data) {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 格式
        const historyKey = `trustLevelHistory_${CURRENT_DOMAIN}_${username}`;
        const history = Storage.get(historyKey, {});

        // 提取数值数据用于存储
        const snapshot = {
            date: today,
            timestamp: Date.now(),
            type: data.type,
            currentLevel: data.currentLevel,
            targetLevel: data.targetLevel,
            items: (data.items || data.requirements || []).map(item => {
                // 统一处理数值提取
                let currentNum = item.current;
                let requiredNum = item.required;

                // 如果是字符串，尝试提取数字
                if (typeof item.current === 'string') {
                    const match = item.current.match(/(\d+)/);
                    currentNum = match ? parseInt(match[1]) : 0;
                }
                if (typeof item.required === 'string') {
                    const match = item.required.match(/(\d+)/);
                    requiredNum = match ? parseInt(match[1]) : 0;
                }

                // 简化标签名称（与渲染时保持一致，确保匹配）
                let simpleName = item.name
                    .replace('已读帖子（所有时间）', '已读帖子')
                    .replace('浏览的话题（所有时间）', '浏览话题')
                    .replace('访问次数（过去', '访问次数(')
                    .replace('个月）', '月)')
                    .replace('回复次数（最近', '回复(近')
                    .replace('天内）', '天)');

                return {
                    name: simpleName,
                    current: currentNum,
                    required: requiredNum,
                    isMet: item.isMet
                };
            })
        };

        // 保存今天的数据（覆盖当天的旧数据）
        history[today] = snapshot;

        // 只保留最近30天的数据
        const dates = Object.keys(history).sort().reverse();
        if (dates.length > 30) {
            dates.slice(30).forEach(d => delete history[d]);
        }

        Storage.set(historyKey, history);
        console.log(`等级历史快照已保存 (${today})`);
    }

    // 获取昨日的等级数据快照
    getYesterdaySnapshot(username) {
        const historyKey = `trustLevelHistory_${CURRENT_DOMAIN}_${username}`;
        const history = Storage.get(historyKey, {});

        // 获取昨天的日期
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        return history[yesterdayStr] || null;
    }

    // 计算数据变化（今天相对于昨天）
    calculateDataChange(currentValue, yesterdaySnapshot, itemName) {
        if (!yesterdaySnapshot || !yesterdaySnapshot.items) return null;

        const yesterdayItem = yesterdaySnapshot.items.find(item => item.name === itemName);
        if (!yesterdayItem) return null;

        const diff = currentValue - yesterdayItem.current;
        return diff;
    }

    // 生成变化指示器 HTML
    generateChangeIndicator(diff) {
        if (diff === null || diff === undefined) return '';

        if (diff > 0) {
            return `<span class="change-indicator change-up" title="较昨日 +${diff}">↑${diff}</span>`;
        } else if (diff < 0) {
            return `<span class="change-indicator change-down" title="较昨日 ${diff}">↓${Math.abs(diff)}</span>`;
        }
        return ''; // 无变化不显示
    }

    // 渲染缓存的等级数据
    renderCachedTrustLevel(cachedData, lastFetch) {
        if (!cachedData) return;

        const { type, username, currentLevel, targetLevel, items, requirements, achievedCount, totalCount, allMet } = cachedData;

        // 计算缓存时间显示
        const cacheAge = Date.now() - lastFetch;
        const cacheMinutes = Math.floor(cacheAge / 1000 / 60);
        const cacheTimeText = cacheMinutes < 1 ? '刚刚' : `${cacheMinutes}分钟前`;

        // 等级名称映射
        const levelNames = {
            0: 'Lv0 → Lv1',
            1: 'Lv1 → Lv2',
            2: 'Lv1 → Lv2',
            3: 'Lv2 → Lv3',
            4: 'Lv3 → Lv4'
        };

        // 获取昨日数据用于对比
        const yesterdaySnapshot = this.getYesterdaySnapshot(username);

        // 判断是否已满足所有要求，决定标题显示
        const isAllMetForHeader = type === 'low_level' ? allMet : (achievedCount === totalCount);
        const headerTitle = isAllMetForHeader
            ? `Lv${targetLevel} ✓`
            : (levelNames[type === 'low_level' ? currentLevel : targetLevel] || `Lv${currentLevel} → Lv${targetLevel}`);

        let html = `
            <div class="trust-level-header">
                <span>📊 ${headerTitle} (${username})</span>
                <button class="trust-level-refresh" data-action="refresh">🔄 刷新</button>
            </div>
            <div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-bottom: 4px; text-align: right;">缓存: ${cacheTimeText}</div>
        `;

        // 根据类型渲染不同的数据
        const displayItems = type === 'low_level' ? items : requirements;

        displayItems.forEach(req => {
            let currentNum, requiredNum, displayCurrent, displayRequired;

            if (type === 'low_level') {
                currentNum = req.current;
                requiredNum = req.required;
                displayCurrent = req.current;
                displayRequired = req.required;
            } else {
                // 高级等级：从文本中提取数字
                const currentMatch = req.current.match(/(\d+)/);
                const requiredMatch = req.required.match(/(\d+)/);
                currentNum = currentMatch ? parseInt(currentMatch[1]) : 0;
                requiredNum = requiredMatch ? parseInt(requiredMatch[1]) : 1;
                displayCurrent = req.current;
                displayRequired = req.required;
            }

            const progress = Math.min((currentNum / requiredNum) * 100, 100);
            const isCompleted = req.isMet;
            const fillClass = isCompleted ? 'completed' : '';

            // 简化标签名称
            let simpleName = req.name
                .replace('已读帖子（所有时间）', '已读帖子')
                .replace('浏览的话题（所有时间）', '浏览话题')
                .replace('访问次数（过去', '访问次数(')
                .replace('个月）', '月)')
                .replace('回复次数（最近', '回复(近')
                .replace('天内）', '天)');

            // 计算与昨日的变化
            const diff = this.calculateDataChange(currentNum, yesterdaySnapshot, simpleName);
            const changeIndicator = this.generateChangeIndicator(diff);

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${simpleName}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${displayCurrent}/${displayRequired}${changeIndicator}</span>
                    </div>
                </div>
            `;
        });

        // 添加总结信息
        const isAllMet = type === 'low_level' ? allMet : (achievedCount === totalCount);
        if (isAllMet) {
            html += `
                <div style="background: rgba(255, 255, 255, 0.25); padding: 6px 8px; border-radius: 6px; margin: 6px 0 0 0;">
                    <div style="color: #fff; font-size: 11px; font-weight: 600; text-align: center;">
                        ✅ 已满足 Lv${targetLevel} 要求
                    </div>
                </div>
            `;
        } else {
            const unmetCount = totalCount - achievedCount;
            html += `
                <div style="background: rgba(255, 255, 255, 0.15); padding: 6px 8px; border-radius: 6px; margin: 6px 0 0 0;">
                    <div style="color: rgba(255, 255, 255, 0.9); font-size: 11px; font-weight: 500; text-align: center;">
                        还需完成 ${unmetCount} 项升级到 Lv${targetLevel}
                    </div>
                </div>
            `;
        }

        this.trustLevelContainer.innerHTML = html;

        // 添加刷新按钮事件监听
        setTimeout(() => {
            const refreshBtn = this.trustLevelContainer.querySelector('.trust-level-refresh');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadUserTrustLevel(true));
            }
        }, 100);
    }

    // 使用 GM_xmlhttpRequest 获取 linux.do 数据（完全按照1.js的逻辑）
    async fetchLinuxDoDataWithGM(username) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://connect.linux.do/",
                timeout: 15000,
                onload: (response) => {
                    if (response.status === 200) {
                        const responseText = response.responseText;
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = responseText;

                        // 1. 解析全局用户名和当前等级 (从 <h1>)
                        let globalUsername = username;
                        let currentLevel = '未知';
                        const h1 = tempDiv.querySelector('h1');
                        if (h1) {
                            const h1Text = h1.textContent.trim();
                            // 例如: "你好，一剑万生 (YY_WD) 2级用户" 或 "你好， (yy2025) 0级用户"
                            const welcomeMatch = h1Text.match(/你好，\s*([^(\s]*)\s*\(?([^)]*)\)?\s*(\d+)级用户/i);
                            if (welcomeMatch) {
                                // 优先使用括号内的用户名，如果没有则使用前面的
                                globalUsername = welcomeMatch[2] || welcomeMatch[1] || username;
                                currentLevel = welcomeMatch[3];
                                console.log(`从<h1>解析: 用户名='${globalUsername}', 当前等级='${currentLevel}'`);
                            }
                        }

                        // 检查用户等级，决定使用哪种数据获取方式
                        const userLevel = parseInt(currentLevel);
                        if (userLevel === 0 || userLevel === 1) {
                            console.log(`检测到${userLevel}级用户，使用summary.json获取数据`);
                            this.fetchLowLevelUserData(username, userLevel).then(resolve).catch(reject);
                        } else if (userLevel >= 2) {
                            console.log(`检测到${userLevel}级用户，使用connect.linux.do页面数据`);
                            this.processHighLevelUserData(tempDiv, globalUsername, currentLevel);
                            resolve();
                        } else {
                            reject(new Error('无法确定用户等级'));
                        }
                    } else {
                        reject(new Error(`请求失败，状态码: ${response.status}`));
                    }
                },
                onerror: (error) => {
                    console.error('GM_xmlhttpRequest 错误:', error);
                    reject(new Error('网络请求错误'));
                },
                ontimeout: () => {
                    console.error('GM_xmlhttpRequest 超时');
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 处理0级和1级用户数据
    async fetchLowLevelUserData(username, currentLevel) {
        const summaryResponse = await fetch(`${BASE_URL}/u/${username}/summary.json`);
        if (summaryResponse.ok) {
            const data = await summaryResponse.json();
            const userSummary = data.user_summary;
            this.renderTrustLevelNew(username, currentLevel, userSummary);
        } else {
            throw new Error('无法获取用户summary数据');
        }
    }

    // 处理2级及以上用户数据
    processHighLevelUserData(tempDiv, globalUsername, currentLevel) {
        let targetInfoDiv = null;
        const potentialDivs = tempDiv.querySelectorAll('div.bg-white.p-6.rounded-lg');

        for (let i = 0; i < potentialDivs.length; i++) {
            const div = potentialDivs[i];
            const h2 = div.querySelector('h2');
            if (h2 && h2.textContent.includes('信任级别')) {
                targetInfoDiv = div;
                break;
            }
        }

        if (!targetInfoDiv) {
            throw new Error('未找到信任级别数据块');
        }

        // 解析标题获取目标等级
        const h2 = targetInfoDiv.querySelector('h2');
        const titleMatch = h2.textContent.match(/信任级别\s*(\d+)\s*的要求/);
        const targetLevel = titleMatch ? titleMatch[1] : '未知';

        // 解析表格数据
        const tableRows = targetInfoDiv.querySelectorAll('table tbody tr');
        const requirements = [];

        tableRows.forEach((row, index) => {
            if (index === 0) return; // 跳过表头

            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const name = cells[0].textContent.trim();
                const current = cells[1].textContent.trim();
                const required = cells[2].textContent.trim();
                const isMet = cells[1].classList.contains('text-green-500');

                requirements.push({ name, current, required, isMet });
            }
        });

        // 渲染高级等级信息
        this.renderAdvancedTrustLevel(globalUsername, targetLevel, requirements);
    }

    // 新的渲染方法（基于1.js的逻辑，用于0级和1级用户）
    renderTrustLevelNew(username, currentLevel, userSummary) {
        const targetLevel = currentLevel + 1;
        const requirements = CONFIG.levelRequirements[currentLevel];

        if (!requirements) {
            this.trustLevelContainer.innerHTML = '<div class="trust-level-loading">无配置数据</div>';
            return;
        }

        const trustLevelDetails = {
            items: [],
            achievedCount: 0,
            totalCount: 0
        };

        // 检查各项要求
        Object.entries(requirements).forEach(([key, requiredValue]) => {
            let currentValue = 0;
            let label = '';
            let isMet = false;

            switch (key) {
                case 'topics_entered':
                    currentValue = userSummary.topics_entered || 0;
                    label = '浏览的话题';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'posts_read_count':
                    currentValue = userSummary.posts_read_count || 0;
                    label = '已读帖子';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'time_read':
                    currentValue = Math.floor((userSummary.time_read || 0) / 60);
                    label = '阅读时长(分)';
                    isMet = (userSummary.time_read || 0) >= requiredValue;
                    requiredValue = Math.floor(requiredValue / 60);
                    break;
                case 'days_visited':
                    currentValue = userSummary.days_visited || 0;
                    label = '访问天数';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'likes_given':
                    currentValue = userSummary.likes_given || 0;
                    label = '给出的赞';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'likes_received':
                    currentValue = userSummary.likes_received || 0;
                    label = '收到的赞';
                    isMet = currentValue >= requiredValue;
                    break;
                case 'post_count':
                    currentValue = userSummary.post_count || 0;
                    label = '帖子数量';
                    isMet = currentValue >= requiredValue;
                    break;
            }

            if (label) {
                trustLevelDetails.items.push({
                    name: label,
                    current: currentValue,
                    required: requiredValue,
                    isMet: isMet
                });

                if (isMet) {
                    trustLevelDetails.achievedCount++;
                }
                trustLevelDetails.totalCount++;
            }
        });

        const achievedCount = trustLevelDetails.achievedCount;
        const totalCount = trustLevelDetails.totalCount;
        const allMet = achievedCount === totalCount;

        const levelNames = {
            0: 'Lv0 → Lv1',
            1: 'Lv1 → Lv2'
        };

        // 获取昨日数据用于对比
        const yesterdaySnapshot = this.getYesterdaySnapshot(username);

        // 判断是否已满足所有要求，决定标题显示
        const headerTitle = allMet
            ? `Lv${targetLevel} ✓`
            : (levelNames[currentLevel] || `Lv${currentLevel} → Lv${targetLevel}`);

        let html = `
            <div class="trust-level-header">
                <span>📊 ${headerTitle} (${username})</span>
                <button class="trust-level-refresh" data-action="refresh">🔄 刷新</button>
            </div>
        `;

        trustLevelDetails.items.forEach(req => {
            const progress = Math.min((req.current / req.required) * 100, 100);
            const isCompleted = req.isMet;
            const fillClass = isCompleted ? 'completed' : '';

            // 计算与昨日的变化
            const diff = this.calculateDataChange(req.current, yesterdaySnapshot, req.name);
            const changeIndicator = this.generateChangeIndicator(diff);

            // 检查是否是负面指标（需要红色显示当前值）
            const isNegativeIndicator = req.name.includes('被禁言') || req.name.includes('被封禁') || req.name.includes('被举报的帖子') || req.name.includes('发起举报的用户');
            const currentValueHtml = isNegativeIndicator ? `<span style="color: #ff6b6b;">${req.current}</span>` : req.current;

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${req.name}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${currentValueHtml}/${req.required}${changeIndicator}</span>
                    </div>
                </div>
            `;
        });

        if (allMet) {
            html += `
                <div style="background: rgba(255, 255, 255, 0.25); padding: 6px 8px; border-radius: 6px; margin: 6px 0 0 0;">
                    <div style="color: #fff; font-size: 11px; font-weight: 600; text-align: center;">
                        ✅ 已满足 Lv${targetLevel} 要求
                    </div>
                </div>
            `;
        } else {
            const unmetCount = totalCount - achievedCount;
            html += `
                <div style="background: rgba(255, 255, 255, 0.15); padding: 6px 8px; border-radius: 6px; margin: 6px 0 0 0;">
                    <div style="color: rgba(255, 255, 255, 0.9); font-size: 11px; font-weight: 500; text-align: center;">
                        还需完成 ${unmetCount} 项升级到 Lv${targetLevel}
                    </div>
                </div>
            `;
        }

        this.trustLevelContainer.innerHTML = html;

        // 保存缓存数据
        this.saveTrustLevelCache(username, {
            type: 'low_level',
            username,
            currentLevel,
            targetLevel,
            items: trustLevelDetails.items,
            achievedCount,
            totalCount,
            allMet
        });

        setTimeout(() => {
            const refreshBtn = this.trustLevelContainer.querySelector('.trust-level-refresh');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadUserTrustLevel(true));
            }
        }, 100);
    }

    // 从 connect.linux.do 加载等级信息（适用于TL2+）
    async loadTrustLevelFromConnect(username) {
        try {
            const response = await fetch('https://connect.linux.do/');
            if (!response.ok) {
                throw new Error('无法访问 connect.linux.do');
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 查找包含"信任级别"的区块
            const trustLevelSection = Array.from(doc.querySelectorAll('div.bg-white.p-6.rounded-lg')).find(div => {
                const h2 = div.querySelector('h2');
                return h2 && h2.textContent.includes('信任级别');
            });

            if (!trustLevelSection) {
                throw new Error('未找到信任级别数据');
            }

            // 解析标题获取目标等级
            const h2 = trustLevelSection.querySelector('h2');
            const titleMatch = h2.textContent.match(/信任级别\s*(\d+)\s*的要求/);
            const targetLevel = titleMatch ? titleMatch[1] : '未知';

            // 解析表格数据
            const tableRows = trustLevelSection.querySelectorAll('table tbody tr');
            const requirements = [];

            tableRows.forEach((row, index) => {
                if (index === 0) return; // 跳过表头

                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const name = cells[0].textContent.trim();
                    const current = cells[1].textContent.trim();
                    const required = cells[2].textContent.trim();
                    const isMet = cells[1].classList.contains('text-green-500');

                    requirements.push({ name, current, required, isMet });
                }
            });

            // 渲染高级等级信息
            this.renderAdvancedTrustLevel(username, targetLevel, requirements);

        } catch (error) {
            console.error('从 connect.linux.do 加载失败:', error);
            throw error;
        }
    }

    // 渲染信任等级信息（支持 TL0->TL1 和 TL1->TL2 - 基于 summary.json）
    renderTrustLevel(data, username) {
        const summary = data.user_summary;
        if (!summary) {
            this.trustLevelContainer.innerHTML = '<div class="trust-level-loading">无数据</div>';
            return;
        }

        // 获取当前信任等级
        // 优先从 user_summary 中获取，如果没有则从外层获取
        const currentLevel = summary.trust_level !== undefined ? summary.trust_level :
                           (data.user && data.user.trust_level !== undefined ? data.user.trust_level : 1);
        const targetLevel = currentLevel + 1;

        // 根据当前等级获取对应的升级要求
        const levelConfig = CONFIG.levelRequirements[currentLevel];

        if (!levelConfig) {
            // 如果没有配置（比如已经是最高等级），使用原来的逻辑
            this.renderDefaultTrustLevel(summary, username);
            return;
        }

        const requirements = [];

        // 根据配置动态构建要求列表
        Object.entries(levelConfig).forEach(([key, requiredValue]) => {
            let currentValue = 0;
            let label = '';

            switch (key) {
                case 'topics_entered':
                    currentValue = summary.topics_entered || 0;
                    label = '浏览的话题';
                    break;
                case 'posts_read_count':
                    currentValue = summary.posts_read_count || 0;
                    label = '已读帖子';
                    break;
                case 'time_read':
                    currentValue = Math.floor((summary.time_read || 0) / 60);
                    label = '阅读时长(分)';
                    requiredValue = Math.floor(requiredValue / 60);
                    break;
                case 'days_visited':
                    currentValue = summary.days_visited || 0;
                    label = '访问天数';
                    break;
                case 'likes_given':
                    currentValue = summary.likes_given || 0;
                    label = '给出的赞';
                    break;
                case 'likes_received':
                    currentValue = summary.likes_received || 0;
                    label = '收到的赞';
                    break;
                case 'post_count':
                    currentValue = summary.post_count || 0;
                    label = '帖子数量';
                    break;
            }

            if (label) {
                requirements.push({
                    name: label,
                    current: currentValue,
                    required: requiredValue
                });
            }
        });

        // 计算达标数量
        const achievedCount = requirements.filter(req => req.current >= req.required).length;
        const totalCount = requirements.length;
        const allMet = achievedCount === totalCount;

        const levelNames = {
            0: 'Lv0 → Lv1',
            1: 'Lv1 → Lv2',
            2: 'Lv2 → Lv3',
            3: 'Lv3 → Lv4'
        };

        // 获取昨日数据用于对比
        const yesterdaySnapshot = this.getYesterdaySnapshot(username);

        let html = `
            <div class="trust-level-header">
                <span>📊 ${levelNames[currentLevel] || `Lv${currentLevel} → Lv${targetLevel}`} (${username})</span>
                <button class="trust-level-refresh" data-action="refresh">🔄 刷新</button>
            </div>
        `;

        requirements.forEach(req => {
            const progress = Math.min((req.current / req.required) * 100, 100);
            const isCompleted = req.current >= req.required;
            const fillClass = isCompleted ? 'completed' : '';

            // 计算与昨日的变化
            const diff = this.calculateDataChange(req.current, yesterdaySnapshot, req.name);
            const changeIndicator = this.generateChangeIndicator(diff);

            // 检查是否是负面指标（需要红色显示当前值）
            const isNegativeIndicator = req.name.includes('被禁言') || req.name.includes('被封禁') || req.name.includes('被举报的帖子') || req.name.includes('发起举报的用户');
            const currentValueHtml = isNegativeIndicator ? `<span style="color: #ff6b6b;">${req.current}</span>` : req.current;

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${req.name}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${currentValueHtml}/${req.required}${changeIndicator}</span>
                    </div>
                </div>
            `;
        });

        // 在数据下方添加总结信息
        if (allMet) {
            html += `
                <div style="background: rgba(255, 255, 255, 0.25); padding: 6px 8px; border-radius: 6px; margin: 6px 0 0 0;">
                    <div style="color: #fff; font-size: 11px; font-weight: 600; text-align: center;">
                        ✅ 已满足 Lv${targetLevel} 要求
                    </div>
                </div>
            `;
        } else {
            const unmetCount = totalCount - achievedCount;
            html += `
                <div style="background: rgba(255, 255, 255, 0.15); padding: 6px 8px; border-radius: 6px; margin: 6px 0 0 0;">
                    <div style="color: rgba(255, 255, 255, 0.9); font-size: 11px; font-weight: 500; text-align: center;">
                        还需完成 ${unmetCount} 项升级到 Lv${targetLevel}
                    </div>
                </div>
            `;
        }

        this.trustLevelContainer.innerHTML = html;

        // 保存缓存数据（idcflare.com）
        const cacheItems = requirements.map(req => ({
            name: req.name,
            current: req.current,
            required: req.required,
            isMet: req.current >= req.required
        }));
        this.saveTrustLevelCache(username, {
            type: 'low_level',
            username,
            currentLevel,
            targetLevel,
            items: cacheItems,
            achievedCount,
            totalCount,
            allMet
        });

        // 添加刷新按钮事件监听
        setTimeout(() => {
            const refreshBtn = this.trustLevelContainer.querySelector('.trust-level-refresh');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadUserTrustLevel(true));
            }
        }, 100);
    }

    // 默认渲染方法（用于没有配置的等级）
    renderDefaultTrustLevel(summary, username) {
        const requirements = [
            { name: '访问天数', current: summary.days_visited, required: 15 },
            { name: '给出的赞', current: summary.likes_given, required: 1 },
            { name: '收到的赞', current: summary.likes_received, required: 1 },
            { name: '帖子数量', current: summary.post_count, required: 3 },
            { name: '进入主题', current: summary.topics_entered, required: 20 },
            { name: '阅读帖子', current: summary.posts_read_count, required: 100 },
            { name: '阅读时长(分)', current: Math.floor(summary.time_read / 60), required: 60 }
        ];

        // 计算达标数量
        const achievedCount = requirements.filter(req => req.current >= req.required).length;
        const totalCount = requirements.length;
        const allMet = achievedCount === totalCount;

        let html = `
            <div class="trust-level-header">
                <span>📊 等级 (L2+) (${username || ''})</span>
                <button class="trust-level-refresh" data-action="refresh">🔄 刷新</button>
            </div>
        `;

        // 添加总结信息
        if (allMet) {
            html += `
                <div style="background: rgba(16, 185, 129, 0.2); padding: 6px 8px; border-radius: 6px; margin: 6px 0;">
                    <div style="color: #10b981; font-size: 11px; font-weight: 600; text-align: center;">
                        🎉 所有要求已达标！
                    </div>
                </div>
            `;
        } else {
            const unmetCount = totalCount - achievedCount;
            html += `
                <div style="background: rgba(251, 146, 60, 0.2); padding: 6px 8px; border-radius: 6px; margin: 6px 0;">
                    <div style="color: #ea580c; font-size: 11px; font-weight: 600; text-align: center;">
                        还需完成 ${unmetCount} 项要求
                    </div>
                </div>
            `;
        }

        requirements.forEach(req => {
            const progress = Math.min((req.current / req.required) * 100, 100);
            const isCompleted = req.current >= req.required;
            const fillClass = isCompleted ? 'completed' : '';

            // 检查是否是负面指标（需要红色显示当前值）
            const isNegativeIndicator = req.name.includes('被禁言') || req.name.includes('被封禁') || req.name.includes('被举报的帖子') || req.name.includes('发起举报的用户');
            const currentValueHtml = isNegativeIndicator ? `<span style="color: #ff6b6b;">${req.current}</span>` : req.current;

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${req.name}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${currentValueHtml}/${req.required}</span>
                    </div>
                </div>
            `;
        });

        this.trustLevelContainer.innerHTML = html;

        setTimeout(() => {
            const refreshBtn = this.trustLevelContainer.querySelector('.trust-level-refresh');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadUserTrustLevel(true));
            }
        }, 100);
    }

    // 渲染高级信任等级信息（从 connect.linux.do 获取的TL2+数据）
    renderAdvancedTrustLevel(username, targetLevel, requirements) {
        const achievedCount = requirements.filter(r => r.isMet).length;
        const totalCount = requirements.length;

        // 计算当前等级
        const currentLevel = parseInt(targetLevel) - 1;

        // 等级名称映射（简化显示）
        const levelNames = {
            2: 'Lv1 → Lv2',
            3: 'Lv2 → Lv3',
            4: 'Lv3 → Lv4'
        };

        // 获取昨日数据用于对比
        const yesterdaySnapshot = this.getYesterdaySnapshot(username);

        // 判断是否已满足所有要求，决定标题显示
        const allRequirementsMet = achievedCount === totalCount;
        const headerTitle = allRequirementsMet
            ? `Lv${targetLevel} ✓`
            : (levelNames[targetLevel] || `Lv${currentLevel} → Lv${targetLevel}`);

        let html = `
            <div class="trust-level-header">
                <span>📊 ${headerTitle} (${username})</span>
                <button class="trust-level-refresh" data-action="refresh">🔄 刷新</button>
            </div>
        `;

        requirements.forEach(req => {
            // 尝试从文本中提取数字
            const currentMatch = req.current.match(/(\d+)/);
            const requiredMatch = req.required.match(/(\d+)/);

            const currentNum = currentMatch ? parseInt(currentMatch[1]) : 0;
            const requiredNum = requiredMatch ? parseInt(requiredMatch[1]) : 1;

            const progress = Math.min((currentNum / requiredNum) * 100, 100);
            const isCompleted = req.isMet;
            const fillClass = isCompleted ? 'completed' : '';

            // 简化标签名称
            let simpleName = req.name
                .replace('已读帖子（所有时间）', '已读帖子')
                .replace('浏览的话题（所有时间）', '浏览话题')
                .replace('访问次数（过去', '访问次数(')
                .replace('个月）', '月)')
                .replace('回复次数（最近', '回复(近')
                .replace('天内）', '天)');

            // 计算与昨日的变化（使用简化后的名称匹配）
            const diff = this.calculateDataChange(currentNum, yesterdaySnapshot, simpleName);
            const changeIndicator = this.generateChangeIndicator(diff);

            // 检查是否是负面指标（需要红色显示当前值）
            const isNegativeIndicator = req.name.includes('被禁言') || req.name.includes('被封禁') || req.name.includes('被举报的帖子') || req.name.includes('发起举报的用户');
            const currentValueHtml = isNegativeIndicator ? `<span style="color: #ff6b6b;">${req.current}</span>` : req.current;

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${simpleName}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${currentValueHtml}/${req.required}${changeIndicator}</span>
                    </div>
                </div>
            `;
        });

        // 在数据下方添加总结信息
        if (achievedCount === totalCount) {
            html += `
                <div style="background: rgba(255, 255, 255, 0.25); padding: 6px 8px; border-radius: 6px; margin: 6px 0 0 0;">
                    <div style="color: #fff; font-size: 11px; font-weight: 600; text-align: center;">
                        ✅ 已满足 Lv${targetLevel} 要求
                    </div>
                </div>
            `;
        } else {
            const unmetCount = totalCount - achievedCount;
            html += `
                <div style="background: rgba(255, 255, 255, 0.15); padding: 6px 8px; border-radius: 6px; margin: 6px 0 0 0;">
                    <div style="color: rgba(255, 255, 255, 0.9); font-size: 11px; font-weight: 500; text-align: center;">
                        还需完成 ${unmetCount} 项升级到 Lv${targetLevel}
                    </div>
                </div>
            `;
        }

        this.trustLevelContainer.innerHTML = html;

        // 保存缓存数据
        this.saveTrustLevelCache(username, {
            type: 'high_level',
            username,
            targetLevel,
            currentLevel,
            requirements,
            achievedCount,
            totalCount
        });

        // 添加刷新按钮事件监听
        setTimeout(() => {
            const refreshBtn = this.trustLevelContainer.querySelector('.trust-level-refresh');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => this.loadUserTrustLevel(true));
            }
        }, 100);
    }

    // 加载用户阅读历史
    async loadUserReadHistory() {
        const username = await this.getCurrentUsername();
        if (!username) {
            console.log('未获取到用户名，无法加载阅读历史');
            this.readTopics = [];
            return;
        }

        // 从 localStorage 加载该用户的阅读历史
        const storageKey = `readTopics_${username}`;
        this.readTopics = Storage.get(storageKey, []);
        console.log(`已加载用户 ${username} 的阅读历史，共 ${this.readTopics.length} 篇帖子`);

        // 同步总阅读数：使用阅读历史长度作为真实的总阅读数
        if (this.readTopics.length > this.totalReadCount) {
            console.log(`[数据同步] 总阅读数从 ${this.totalReadCount} 更新为 ${this.readTopics.length}`);
            this.totalReadCount = this.readTopics.length;
            Storage.set('totalReadCount', this.totalReadCount);
            // 更新显示
            this.updateReadStatsDisplay();
        }
    }

    // 保存用户阅读历史
    async saveUserReadHistory(topicId) {
        const username = await this.getCurrentUsername();
        if (!username) {
            console.log('未获取到用户名，无法保存阅读历史');
            return;
        }

        // 添加到已读列表（避免重复）
        if (!this.readTopics.includes(topicId)) {
            this.readTopics.push(topicId);

            // 限制列表大小（最多保存1000篇）
            if (this.readTopics.length > 1000) {
                this.readTopics = this.readTopics.slice(-1000);
            }

            // 保存到 localStorage
            const storageKey = `readTopics_${username}`;
            Storage.set(storageKey, this.readTopics);
            console.log(`已保存帖子 ${topicId} 到用户 ${username} 的阅读历史`);
        }
    }

    // 检查帖子是否已读
    isTopicRead(topicId) {
        return this.readTopics.includes(topicId);
    }

    // 加载今日阅读统计
    loadTodayReadCount() {
        const now = new Date();
        // 使用 YYYY-MM-DD 格式，更可靠的日期比较
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const savedData = Storage.get('todayReadStats', null);

        console.log(`[今日阅读] 当前日期: ${today}, 保存的数据:`, savedData);

        // 检查保存的数据是否有效且是今天的
        if (savedData && savedData.date) {
            // 兼容旧格式（toDateString）和新格式（YYYY-MM-DD）
            const savedDate = savedData.date;
            const isToday = savedDate === today || savedDate === now.toDateString();

            if (isToday) {
                console.log(`[今日阅读] 日期匹配，返回已保存的计数: ${savedData.count}`);
                return savedData.count;
            }
        }

        // 如果是新的一天，重置计数
        console.log(`[今日阅读] 新的一天或无数据，重置计数为0`);
        Storage.set('todayReadStats', { date: today, count: 0 });
        return 0;
    }

    // 重置今日阅读计数
    resetTodayReadCount() {
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        this.todayReadCount = 0;
        Storage.set('todayReadStats', { date: today, count: 0 });
        this.updateReadStatsDisplay();
        console.log('[今日阅读] 已重置今日阅读计数');
        this.showNotification('今日阅读计数已重置');
    }

    // 增加今日阅读计数和总阅读计数
    incrementTodayReadCount() {
        const now = new Date();
        // 使用 YYYY-MM-DD 格式，与 loadTodayReadCount 保持一致
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        // 检查是否跨天了（用户可能一直在阅读没有刷新页面）
        const savedData = Storage.get('todayReadStats', null);
        if (savedData && savedData.date) {
            // 兼容旧格式和新格式
            const savedDate = savedData.date;
            const isToday = savedDate === today || savedDate === now.toDateString();

            if (!isToday) {
                // 跨天了，重置今日计数
                console.log(`[今日阅读] 检测到跨天！旧日期: ${savedDate}, 新日期: ${today}，重置今日计数`);
                this.todayReadCount = 0;
            }
        }

        this.todayReadCount++;
        this.totalReadCount++;
        Storage.set('todayReadStats', { date: today, count: this.todayReadCount });
        Storage.set('totalReadCount', this.totalReadCount);
        console.log(`今日已阅读 ${this.todayReadCount} 篇帖子，总阅读 ${this.totalReadCount} 篇`);

        // 更新阅读统计显示
        this.updateReadStatsDisplay();
    }

    // 更新阅读统计显示
    updateReadStatsDisplay() {
        if (!this.readStatsContainer) return;

        const todayCount = this.todayReadCount || 0;
        let totalCount = this.totalReadCount || 0;

        // 修复数据不一致：总阅读数至少等于今日阅读数
        if (totalCount < todayCount) {
            totalCount = todayCount;
            this.totalReadCount = totalCount;
            Storage.set('totalReadCount', totalCount);
            console.log(`[数据修复] 总阅读数已修正为 ${totalCount}`);
        }

        this.readStatsContainer.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 10px; color: rgba(255,255,255,0.7);">📅 ${this.t('todayRead')}</div>
                <div style="font-size: 16px; font-weight: bold; color: #7dffb3;">${todayCount}</div>
            </div>
            <div style="width: 1px; height: 24px; background: rgba(255,255,255,0.2);"></div>
            <div style="text-align: center;">
                <div style="font-size: 10px; color: rgba(255,255,255,0.7);">📚 ${this.t('totalRead')}</div>
                <div style="font-size: 16px; font-weight: bold; color: #ffd700;">${totalCount}</div>
            </div>
        `;
    }

    // 加载历史最大已读页码（跨天保存）
    loadHistoricalMaxPage() {
        const today = new Date().toDateString();
        const savedData = Storage.get('historicalMaxPageData', null);

        if (savedData) {
            // 如果是同一天，直接返回保存的页码
            if (savedData.date === today) {
                console.log(`[页码续读] 今日已读最大页码: ${savedData.maxPage}`);
                return savedData.maxPage;
            }
            // 如果是新的一天，保留历史页码作为起始点，但重置日期
            console.log(`[页码续读] 新的一天，继承昨日最大页码: ${savedData.maxPage}`);
            return savedData.maxPage;
        }

        return 0;
    }

    // 保存历史最大已读页码
    saveHistoricalMaxPage(page) {
        const today = new Date().toDateString();
        const currentMax = this.historicalMaxPage || 0;

        // 只有当新页码大于当前最大页码时才更新
        if (page > currentMax) {
            this.historicalMaxPage = page;
            Storage.set('historicalMaxPageData', { date: today, maxPage: page });
            console.log(`[页码续读] 更新历史最大页码: ${page}`);
        }
    }

    // 获取下次获取帖子的起始页码
    getStartPage() {
        // 优先使用当前会话的最后获取页码（会话内连续获取）
        if (this.lastFetchedPage > 0) {
            console.log(`[页码续读] 使用会话内上次页码: ${this.lastFetchedPage + 1}`);
            return this.lastFetchedPage + 1;
        }

        // 其次使用历史最大页码（跨天续读）
        if (this.historicalMaxPage > 0) {
            console.log(`[页码续读] 使用历史最大页码: ${this.historicalMaxPage + 1}`);
            return this.historicalMaxPage + 1;
        }

        // 默认从第1页开始
        return 1;
    }

    // 重置页码（当切换阅读模式时调用）
    resetPageProgress() {
        this.lastFetchedPage = 0;
        this.setSessionStorage('lastFetchedPage', 0);
        console.log('[页码续读] 已重置会话页码');
    }

    // 清空所有页码历史（用户手动点击按钮时调用）
    handleClearPageHistory() {
        // 重置会话内页码
        this.lastFetchedPage = 0;
        this.setSessionStorage('lastFetchedPage', 0);

        // 清空历史最大页码
        this.historicalMaxPage = 0;
        Storage.set('historicalMaxPageData', null);

        // 清空话题列表，强制重新获取
        this.topicList = [];
        this.setSessionStorage('topicList', []);

        console.log('[页码续读] 已清空所有页码历史记录');
        this.showNotification(this.t('pageHistoryCleared'));
    }

    // 启动账号切换监控
    startUserSwitchMonitoring() {
        // 初始化当前用户
        this.getCurrentUsername().then(username => {
            this.lastDetectedUser = username;
        });

        // 每5秒检查一次是否切换账号
        setInterval(async () => {
            const currentDetectedUser = await this.getCurrentUsername();

            if (currentDetectedUser && this.lastDetectedUser &&
                currentDetectedUser !== this.lastDetectedUser) {
                console.log(`检测到账号切换: ${this.lastDetectedUser} -> ${currentDetectedUser}`);
                this.lastDetectedUser = currentDetectedUser;
                this.currentUsername = currentDetectedUser;

                // 延迟一点时间再刷新，确保页面稳定
                setTimeout(() => {
                    console.log('账号切换后重新加载等级信息');
                    this.loadUserTrustLevel(true);
                }, 1000);
            } else if (currentDetectedUser) {
                this.lastDetectedUser = currentDetectedUser;
            }
        }, 5000);
    }

    toggleCleanMode() {
        const sidebarToggle = document.querySelector('button.btn-sidebar-toggle');
        if (sidebarToggle && this.cleanModeEnabled) {
            if (sidebarToggle.getAttribute('aria-expanded') === 'true') {
                console.log('清爽模式启用，收起边栏');
                sidebarToggle.click();
            }
        }
        this.applyCleanModeStyles();
    }

    applyCleanModeStyles() {
        let styleElement = document.getElementById('clean-mode-styles');
        if (styleElement) {
            styleElement.remove();
        }

        if (this.cleanModeEnabled) {
            styleElement = document.createElement('style');
            styleElement.id = 'clean-mode-styles';
            styleElement.textContent = `
                p:contains("希望你喜欢这里。有问题，请提问，或搜索现有帖子。") {
                    display: none !important;
                }
                div#global-notice-alert-global-notice.alert.alert-info.alert-global-notice {
                    display: none !important;
                }
                a[href="https://linux.do/t/topic/482293"] {
                    display: none !important;
                }
                div.link-bottom-line a.badge-category__wrapper {
                    display: none !important;
                }
                td.posters.topic-list-data {
                    display: none !important;
                }
                a.discourse-tag.box[href^="/tag/"] {
                    display: none !important;
                }
            `;
            document.head.appendChild(styleElement);
        }
    }

    toggleGrayscaleMode() {
        this.applyGrayscaleModeStyles();
    }

    applyGrayscaleModeStyles() {
        let styleElement = document.getElementById('grayscale-mode-styles');
        if (styleElement) {
            styleElement.remove();
        }

        if (this.grayscaleModeEnabled) {
            // 检测设备类型
            const isAndroid = /Android/i.test(navigator.userAgent);
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isMobile = isAndroid || isIOS;
            const isLowEnd = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;

            styleElement = document.createElement('style');
            styleElement.id = 'grayscale-mode-styles';
            styleElement.textContent = `
                /*
                 * 黑白灰模式 - 智能高对比度版
                 * 作者: idear
                 * 协议: CC BY-NC-SA 4.0
                 */

                /* ==================== 浅色背景优化 ==================== */
                @media (prefers-color-scheme: light) {
                    /* 只对主要内容容器应用滤镜，不影响 fixed 定位元素 */
                    #main-outlet, .d-header, .menu-panel, main {
                        filter: grayscale(100%) contrast(108%) brightness(97%) !important;
                        -webkit-filter: grayscale(100%) contrast(108%) brightness(97%) !important;
                    }

                    #main-outlet *, .d-header *, .menu-panel *, main * {
                        text-shadow: 0 0 0.3px rgba(0, 0, 0, 0.4) !important;
                    }
                }

                /* ==================== 深色背景优化 ==================== */
                @media (prefers-color-scheme: dark) {
                    /* 只对主要内容容器应用滤镜，不影响 fixed 定位元素 */
                    #main-outlet, .d-header, .menu-panel, main {
                        filter: grayscale(100%) contrast(110%) brightness(103%) !important;
                        -webkit-filter: grayscale(100%) contrast(110%) brightness(103%) !important;
                    }

                    #main-outlet *, .d-header *, .menu-panel *, main * {
                        text-shadow: 0 0 0.3px rgba(255, 255, 255, 0.5) !important;
                    }
                }

                /* ==================== 兜底方案（无主题偏好） ==================== */
                @media (prefers-color-scheme: no-preference) {
                    #main-outlet, .d-header, .menu-panel, main {
                        filter: grayscale(100%) contrast(109%) brightness(99%) !important;
                        -webkit-filter: grayscale(100%) contrast(109%) brightness(99%) !important;
                    }
                }

                /* ==================== 图片对比度增强 ==================== */
                img, svg, canvas, video {
                    filter: grayscale(100%) contrast(110%) !important;
                    -webkit-filter: grayscale(100%) contrast(110%) !important;
                }

                ${isMobile ? `
                /* ==================== 移动端优化 ==================== */
                html {
                    -webkit-font-smoothing: antialiased !important;
                    -moz-osx-font-smoothing: grayscale !important;
                    text-rendering: optimizeLegibility !important;
                }

                * {
                    -webkit-overflow-scrolling: touch !important;
                }
                ` : ''}

                ${isIOS ? `
                /* ==================== iOS Safari 特殊优化 ==================== */
                body {
                    -webkit-transform: translateZ(0) !important;
                }
                ` : ''}

                ${isLowEnd ? `
                /* ==================== 低端设备优化 ==================== */
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                ` : ''}
            `;
            document.head.appendChild(styleElement);

            // GPU 资源释放
            setTimeout(() => {
                if (document.documentElement) {
                    const currentWillChange = document.documentElement.style.willChange;
                    if (currentWillChange === 'filter') {
                        document.documentElement.style.willChange = 'auto';
                    }
                }
            }, 1000);

            // 性能日志
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            const theme = isDark ? '深色' : (isLight ? '浅色' : '未知');
            console.log('🎨 黑白灰模式已启用');
            console.log(`📱 设备类型: ${isMobile ? (isIOS ? 'iOS' : 'Android') : '桌面'}`);
            console.log(`🔧 优化模式: ${isLowEnd ? '低端设备' : '标准'}`);
            console.log(`🌓 检测主题: ${theme}模式`);
            console.log(`✨ 浅色背景: 对比108% + 亮度97%`);
            console.log(`✨ 深色背景: 对比110% + 亮度103%`);
            console.log(`🖼️  图片对比度: 110%`);
        } else {
            console.log('🎨 黑白灰模式已关闭');
        }
    }

    initOnlyOwnerView() {
        this.createToggleButton();
        this.observePageChanges();
        this.toggleVisibility();
    }

    toggleVisibility() {
        const displayMode = localStorage.getItem("on_off") || "当前查看全部";
        const userId = document.getElementById("post_1")?.getAttribute('data-user-id');
        if (userId) {
            document.querySelectorAll('article').forEach(article => {
                article.style.display = (displayMode === "当前只看楼主" && article.dataset.userId !== userId) ? 'none' : '';
            });
        }
    }

    createToggleButton() {
        if (document.getElementById("toggleVisibilityBtn")) {
            return;
        }

        const btn = document.createElement("button");
        btn.id = "toggleVisibilityBtn";
        btn.textContent = localStorage.getItem("on_off") || "当前查看全部";
        btn.onclick = () => {
            const newText = btn.textContent === '当前查看全部' ? '当前只看楼主' : '当前查看全部';
            document.getElementsByClassName("start-date")[0]?.click();
            btn.textContent = newText;
            localStorage.setItem("on_off", newText);
            this.toggleVisibility();
        };

        btn.style.backgroundColor = "#333";
        btn.style.color = "#FFF";
        btn.style.border = "none";
        btn.style.padding = "8px 16px";
        btn.style.marginLeft = "10px";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";

        const saveButton = document.querySelector('.save-to-local-btn');
        if (saveButton) {
            saveButton.parentElement.appendChild(btn);
        } else {
            const firstPostContent = document.querySelector('.boxed.onscreen-post[data-post-id] .cooked');
            if (firstPostContent) {
                firstPostContent.appendChild(btn);
            }
        }
    }

    observePageChanges() {
        const observer = new MutationObserver(() => {
            if (document.querySelector(".timeline-footer-controls") && !document.getElementById("toggleVisibilityBtn")) {
                this.createToggleButton();
            }
            this.toggleVisibility();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    initFloorNumberDisplay() {
        this.addFloorNumbers();
        this.initMutationObserver();
        this.setupRandomJumpButton();
        this.monitorURLChangeAndUpdateButton();
    }

    addFloorNumbers() {
        document.querySelectorAll('.boxed.onscreen-post').forEach((post) => {
            if (!post.querySelector('.floor-number')) {
                const floorNumber = document.createElement('div');
                floorNumber.className = 'floor-number';
                floorNumber.textContent = '楼层: ' + post.id.split("_")[1];
                floorNumber.style.cssText = 'color: grey; margin-left: 10px;';
                post.querySelector('.topic-meta-data').appendChild(floorNumber);
            }
        });
        this.setupSaveButton();
    }

    initMutationObserver() {
        const observer = new MutationObserver(() => {
            this.addFloorNumbers();
            this.setupSaveButton();
            this.toggleCleanMode();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    randomJump() {
        fetch(window.location.href + '.json')
            .then(response => response.json())
            .then(data => {
                if (data && data.posts_count) {
                    const postId = 1 + Math.floor(Math.random() * data.posts_count);
                    const currentUrl = new URL(window.location.href);
                    const list1 = currentUrl.pathname.split("/");
                    if (list1[list1.length - 2] === "topic") {
                        list1.push(postId);
                    } else if (list1[list1.length - 3] === "topic") {
                        list1[list1.length - 1] = postId;
                    }
                    const newUrl = list1.join("/");
                    window.location.href = newUrl;
                    alert('恭喜楼层【' + postId + '】的用户被抽中！');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    setupRandomJumpButton() {
        // 随机按钮已集成到主面板中，不需要单独创建
    }

    setupSaveButton() {
        const firstPost = document.querySelector('.boxed.onscreen-post[data-post-id]');
        if (firstPost && firstPost.id.includes('post_1')) {
            if (!firstPost.querySelector('.save-to-local-btn')) {
                // 创建按钮容器
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'save-buttons-container';
                Object.assign(buttonContainer.style, {
                    display: 'flex',
                    gap: '10px',
                    marginTop: '10px',
                    flexWrap: 'wrap'
                });

                // 保存为 HTML 按钮
                const saveButton = document.createElement('button');
                saveButton.className = 'save-to-local-btn';
                saveButton.textContent = '💾 保存到本地';
                Object.assign(saveButton.style, {
                    padding: '10px 20px',
                    fontSize: '15px',
                    fontWeight: '600',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                    transition: 'all 0.3s'
                });
                saveButton.addEventListener('mouseover', () => {
                    saveButton.style.transform = 'translateY(-2px)';
                    saveButton.style.boxShadow = '0 6px 20px rgba(255, 152, 0, 0.4)';
                });
                saveButton.addEventListener('mouseout', () => {
                    saveButton.style.transform = 'translateY(0)';
                    saveButton.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
                });
                saveButton.addEventListener('click', () => this.savePostToLocal(firstPost));

                // 保存为图片按钮
                const saveImageButton = document.createElement('button');
                saveImageButton.className = 'save-to-image-btn';
                saveImageButton.textContent = '🖼️ 保存为图片';
                Object.assign(saveImageButton.style, {
                    padding: '10px 20px',
                    fontSize: '15px',
                    fontWeight: '600',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s'
                });
                saveImageButton.addEventListener('mouseover', () => {
                    saveImageButton.style.transform = 'translateY(-2px)';
                    saveImageButton.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                });
                saveImageButton.addEventListener('mouseout', () => {
                    saveImageButton.style.transform = 'translateY(0)';
                    saveImageButton.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
                });
                saveImageButton.addEventListener('click', () => this.savePostAsImage(firstPost));

                buttonContainer.appendChild(saveButton);
                buttonContainer.appendChild(saveImageButton);

                const postContent = firstPost.querySelector('.cooked');
                if (postContent) {
                    postContent.appendChild(buttonContainer);
                }
            }
        }
    }

    async savePostToLocal(postElement) {
        try {
            const topicTitle = document.querySelector('.fancy-title')?.textContent.trim() || 'Untitled_Topic';
            const postContent = postElement.querySelector('.cooked');
            if (!postContent) {
                alert('无法获取帖子内容！');
                return;
            }

            const contentClone = postContent.cloneNode(true);
            contentClone.querySelector('.save-to-local-btn')?.remove();

            const images = contentClone.querySelectorAll('img');
            for (const img of images) {
                try {
                    const response = await fetch(img.src);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    await new Promise((resolve) => {
                        reader.onload = resolve;
                        reader.readAsDataURL(blob);
                    });
                    img.src = reader.result;
                } catch (error) {
                    console.error('图片加载失败:', img.src, error);
                    img.alt = '[图片加载失败]';
                }
            }

            const htmlContent = `
                <!DOCTYPE html>
                <html lang="zh-CN">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${topicTitle}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .post-content { max-width: 800px; margin: 0 auto; }
                        img { max-width: 100%; height: auto; }
                    </style>
                </head>
                <body>
                    <div class="post-content">
                        <h1>${topicTitle}</h1>
                        ${contentClone.innerHTML}
                    </div>
                </body>
                </html>
            `;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const fileName = topicTitle
                .replace(/[\\/:*?"<>|]/g, '_')
                .replace(/\s+/g, '_')
                + '.html';
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);

            alert('帖子内容已保存到本地！');
        } catch (error) {
            console.error('保存帖子失败:', error);
            alert('保存失败，请查看控制台错误信息。');
        }
    }

    // 获取 html2canvas 库（通过 @require 预加载）
    async loadHtml2Canvas() {
        // html2canvas 已通过 @require 在脚本头部预加载
        // 检查是否已加载成功
        if (typeof html2canvas !== 'undefined') {
            console.log('[html2canvas] 库已通过 @require 预加载');
            return html2canvas;
        }

        // 检查 window 上是否有
        if (window.html2canvas) {
            console.log('[html2canvas] 从 window 获取');
            return window.html2canvas;
        }

        // 如果都没有，抛出错误并提示用户
        throw new Error('html2canvas 库未加载，请确保油猴脚本已正确安装并刷新页面');
    }

    // 保存帖子为图片
    async savePostAsImage(postElement) {
        const saveImageBtn = postElement.querySelector('.save-to-image-btn');
        const originalText = saveImageBtn?.textContent;

        try {
            // 更新按钮状态
            if (saveImageBtn) {
                saveImageBtn.textContent = '⏳ 加载中...';
                saveImageBtn.disabled = true;
            }

            // 加载 html2canvas
            const html2canvas = await this.loadHtml2Canvas();

            if (saveImageBtn) {
                saveImageBtn.textContent = '⏳ 生成图片中...';
            }

            const topicTitle = document.querySelector('.fancy-title')?.textContent.trim() || 'Untitled_Topic';
            const postContent = postElement.querySelector('.cooked');

            if (!postContent) {
                alert('无法获取帖子内容！');
                return;
            }

            // 创建临时容器用于渲染
            const tempContainer = document.createElement('div');
            tempContainer.style.cssText = `
                position: fixed;
                left: -9999px;
                top: 0;
                width: 800px;
                background: #ffffff;
                padding: 30px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            `;

            // 添加标题
            const titleElement = document.createElement('h1');
            titleElement.textContent = topicTitle;
            titleElement.style.cssText = `
                margin: 0 0 20px 0;
                padding-bottom: 15px;
                border-bottom: 2px solid #e0e0e0;
                font-size: 24px;
                color: #333;
                word-wrap: break-word;
            `;
            tempContainer.appendChild(titleElement);

            // 克隆帖子内容
            const contentClone = postContent.cloneNode(true);

            // 移除按钮容器
            contentClone.querySelector('.save-buttons-container')?.remove();
            contentClone.querySelector('.save-to-local-btn')?.remove();
            contentClone.querySelector('.save-to-image-btn')?.remove();

            // 设置内容样式
            contentClone.style.cssText = `
                font-size: 16px;
                line-height: 1.8;
                color: #333;
            `;

            // 处理图片样式
            const images = contentClone.querySelectorAll('img');
            images.forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.crossOrigin = 'anonymous';
            });

            tempContainer.appendChild(contentClone);

            // 添加水印/来源
            const footer = document.createElement('div');
            footer.style.cssText = `
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #999;
                text-align: right;
            `;
            footer.textContent = `来源: ${window.location.href}`;
            tempContainer.appendChild(footer);

            document.body.appendChild(tempContainer);

            // 等待图片加载完成
            const imgElements = tempContainer.querySelectorAll('img');
            await Promise.all(Array.from(imgElements).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                    // 设置超时
                    setTimeout(resolve, 3000);
                });
            }));

            // 使用 html2canvas 生成图片
            const canvas = await html2canvas(tempContainer, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                windowWidth: 800
            });

            // 移除临时容器
            document.body.removeChild(tempContainer);

            // 转换为图片并下载
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const fileName = topicTitle
                    .replace(/[\\/:*?"<>|]/g, '_')
                    .replace(/\s+/g, '_')
                    + '.png';
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);

                alert('帖子已保存为图片！');
            }, 'image/png');

        } catch (error) {
            console.error('保存图片失败:', error);
            alert('保存图片失败: ' + error.message);
        } finally {
            // 恢复按钮状态
            if (saveImageBtn) {
                saveImageBtn.textContent = originalText || '🖼️ 保存为图片';
                saveImageBtn.disabled = false;
            }
        }
    }

    monitorURLChangeAndUpdateButton() {
        let lastURL = location.href;

        // 初始检查一次
        this.updateButtonVisibility();

        setInterval(() => {
            const currentURL = location.href;
            if (currentURL !== lastURL) {
                lastURL = currentURL;
                this.isTopicPage = location.pathname.includes('/t/topic/');
                this.updateButtonVisibility();
                this.toggleCleanMode();
                if (this.autoLikeEnabled && currentURL.includes('/t/topic/')) {
                    this.autoLikeTopic();
                }
            }
        }, 1000);
    }

    updateButtonVisibility() {
        const isTopicPage = location.pathname.includes('/t/topic/');

        // 随机楼层按钮和批量展示按钮：只在文章页显示
        if (this.randomBtn) {
            this.randomBtn.style.display = isTopicPage ? 'flex' : 'none';
        }
        if (this.revealUsersBtn) {
            this.revealUsersBtn.style.display = isTopicPage ? 'flex' : 'none';
        }

        // 折叠模式下的文章页功能子区域：只在文章页显示
        if (this.toolSubSection) {
            this.toolSubSection.style.display = isTopicPage ? 'block' : 'none';
        }

        console.log(`页面类型: ${isTopicPage ? '文章页' : '非文章页'}，文章页功能${isTopicPage ? '显示' : '隐藏'}`);
    }

    async handleRevealUsersClick() {
        if (this.userInfoHelper.revealInProgress) return;

        // 更新按钮状态
        this.revealUsersBtn.disabled = true;
        this.revealUsersBtn.innerHTML = `<span class="btn-icon">⏳</span><span class="btn-text">${this.t('loading')}</span>`;

        try {
            await this.userInfoHelper.revealAllVisibleReplies();
            this.revealUsersBtn.innerHTML = `<span class="btn-icon">✅</span><span class="btn-text">${this.t('loadingComplete')}</span>`;

            // 2秒后恢复按钮
            setTimeout(() => {
                this.revealUsersBtn.disabled = false;
                this.revealUsersBtn.innerHTML = `<span class="btn-icon">📊</span><span class="btn-text">${this.t('batchShowInfo')}</span>`;
            }, 2000);
        } catch (error) {
            console.error('展示用户信息失败:', error);
            this.revealUsersBtn.disabled = false;
            this.revealUsersBtn.innerHTML = `<span class="btn-icon">❌</span><span class="btn-text">${this.t('loadingFailed')}</span>`;

            setTimeout(() => {
                this.revealUsersBtn.innerHTML = `<span class="btn-icon">📊</span><span class="btn-text">${this.t('batchShowInfo')}</span>`;
            }, 2000);
        }
    }

    handleButtonClick() {
        if (this.isScrolling || this.autoRunning) {
            // 停止自动阅读
            this.stopScrolling();
            this.stopNavigationGuard();
            this.autoRunning = false;
            this.setSessionStorage('autoRunning', false);
            this.button.innerHTML = `<span class="btn-icon">▶</span><span class="btn-text">${this.t('startReading')}</span>`;
            this.button.classList.remove('running');

            // 清理所有定时器
            if (this.navigationTimeout) {
                clearTimeout(this.navigationTimeout);
                this.navigationTimeout = null;
            }

            // 停止阅读时，折叠自动阅读区
            if (this.autoSectionContent) {
                const autoSection = this.container.querySelector('.section-collapsible');
                if (autoSection && !autoSection.classList.contains('collapsed')) {
                    autoSection.classList.add('collapsed');
                    this.autoSectionContent.classList.add('collapsed');
                }
            }

            // 停止阅读时，展开账号信息区
            if (this.accountSection && this.accountSectionContent) {
                if (this.accountSection.classList.contains('collapsed')) {
                    this.accountSection.classList.remove('collapsed');
                    this.accountSectionContent.classList.remove('collapsed');
                }
            }
        } else {
            // 开启自动阅读前，检查点赞上限
            if (this.stopOnLikeLimitEnabled) {
                // 检查多种点赞上限状态
                const likeStatus = this.likeCounter?.getStatus?.();
                const isLikeCounterCooldown = likeStatus && likeStatus.isInCooldown;
                const isOldCooldown = this.likeResumeTime && Date.now() < this.likeResumeTime;
                const hasNoRemainingLikes = likeStatus && likeStatus.remaining === 0;

                if (isLikeCounterCooldown || isOldCooldown || hasNoRemainingLikes) {
                    console.log(`[点赞上限] 点赞已达上限，无法开始阅读 (cooldown: ${isLikeCounterCooldown}, oldCooldown: ${isOldCooldown}, noRemaining: ${hasNoRemainingLikes})`);
                    this.showNotification(this.t('stoppedByLikeLimit'));
                    return; // 阻止开始阅读
                }
            }

            // 开启自动阅读
            this.autoRunning = true;
            this.setSessionStorage('autoRunning', true);
            this.button.innerHTML = `<span class="btn-icon">⏸</span><span class="btn-text">${this.t('stopReading')}</span>`;
            this.button.classList.add('running');

            // 启动导航守护
            this.startNavigationGuard();

            // 开始阅读时，折叠账号信息区
            if (this.accountSection && this.accountSectionContent) {
                if (!this.accountSection.classList.contains('collapsed')) {
                    this.accountSection.classList.add('collapsed');
                    this.accountSectionContent.classList.add('collapsed');
                }
            }

            // 开始阅读时，展开自动阅读区
            if (this.autoSectionContent) {
                const autoSection = this.container.querySelector('.section-collapsible');
                if (autoSection && autoSection.classList.contains('collapsed')) {
                    autoSection.classList.remove('collapsed');
                    this.autoSectionContent.classList.remove('collapsed');
                }
            }

            if (!this.firstUseChecked) {
                this.handleFirstUse();
            } else if (this.isTopicPage) {
                this.startScrolling();
                if (this.autoLikeEnabled) {
                    this.autoLikeTopic();
                }
            } else {
                this.getLatestTopics().then(() => this.navigateNextTopic());
            }
        }
    }

    // 获取帖子/回复的点赞数
    getPostLikeCount(postElement) {
        // 尝试多种选择器获取点赞数
        // 1. 尝试从 reactions 按钮获取
        const reactionButton = postElement.querySelector('.discourse-reactions-reaction-button');
        if (reactionButton) {
            // 尝试从 aria-label 获取
            const ariaLabel = reactionButton.getAttribute('aria-label');
            if (ariaLabel) {
                const match = ariaLabel.match(/(\d+)/);
                if (match) {
                    return parseInt(match[1]);
                }
            }

            // 尝试从按钮内的计数器获取
            const countSpan = reactionButton.querySelector('.discourse-reactions-counter, .reaction-count, .like-count, span[class*="count"]');
            if (countSpan) {
                const count = parseInt(countSpan.textContent.trim());
                if (!isNaN(count)) {
                    return count;
                }
            }

            // 尝试从按钮文本获取
            const buttonText = reactionButton.textContent.trim();
            const textMatch = buttonText.match(/(\d+)/);
            if (textMatch) {
                return parseInt(textMatch[1]);
            }
        }

        // 2. 尝试从 actions 区域获取
        const actionsContainer = postElement.querySelector('.post-actions, .actions');
        if (actionsContainer) {
            const likeAction = actionsContainer.querySelector('.like-count, [class*="like"]');
            if (likeAction) {
                const count = parseInt(likeAction.textContent.trim());
                if (!isNaN(count)) {
                    return count;
                }
            }
        }

        // 3. 尝试从双击栏获取
        const doubleButton = postElement.querySelector('.double-button');
        if (doubleButton) {
            const countEl = doubleButton.querySelector('.d-icon + span, .like-count');
            if (countEl) {
                const count = parseInt(countEl.textContent.trim());
                if (!isNaN(count)) {
                    return count;
                }
            }
        }

        // 默认返回0
        return 0;
    }

    // 检查是否应该点赞该帖子（基于过滤模式）
    shouldLikePost(postElement) {
        // 如果过滤模式关闭，直接返回 true
        if (this.likeFilterMode === 'off') {
            return { shouldLike: true, reason: 'filter_off' };
        }

        const likeCount = this.getPostLikeCount(postElement);
        console.log(`[点赞过滤] 帖子当前赞数: ${likeCount}, 过滤模式: ${this.likeFilterMode}, 阈值: ${this.likeMinThreshold}`);

        if (this.likeFilterMode === 'threshold') {
            // 阈值模式：只有赞数 >= 阈值才点赞
            if (likeCount >= this.likeMinThreshold) {
                return { shouldLike: true, reason: 'threshold_passed', likeCount };
            } else {
                return { shouldLike: false, reason: 'below_threshold', likeCount };
            }
        } else if (this.likeFilterMode === 'probability') {
            // 概率模式：赞数越多，点赞概率越高
            // 0-1 赞：不点赞
            // 2+ 赞：概率递增
            if (likeCount <= 1) {
                return { shouldLike: false, reason: 'too_few_likes', likeCount };
            }

            // 计算概率：基于赞数的对数增长
            // 2赞 ≈ 20%, 5赞 ≈ 50%, 10赞 ≈ 70%, 20赞 ≈ 85%, 50赞 ≈ 95%
            const probability = Math.min(0.95, 0.2 + Math.log10(likeCount) * 0.35);
            const random = Math.random();

            console.log(`[点赞过滤] 概率计算: ${(probability * 100).toFixed(1)}%, 随机值: ${(random * 100).toFixed(1)}%`);

            if (random < probability) {
                return { shouldLike: true, reason: 'probability_passed', likeCount, probability };
            } else {
                return { shouldLike: false, reason: 'probability_failed', likeCount, probability };
            }
        }

        return { shouldLike: true, reason: 'unknown_mode' };
    }

    // 检查当前页面的板块是否允许点赞
    isLikeAllowedInCurrentCategory() {
        // idcflare.com 不受板块限制，直接允许
        if (CURRENT_DOMAIN === 'idcflare.com') {
            return { allowed: true, reason: 'idcflare_no_restriction' };
        }

        const config = CONFIG.likeAllowedCategories;
        if (!config || !config.allowed || config.allowed.length === 0) {
            // 如果没有配置限制，则默认允许
            return { allowed: true, reason: 'no_config' };
        }

        // 尝试从页面获取板块信息
        // Discourse 论坛的板块显示顺序通常是：子版块在前，父版块在后
        // 我们需要识别出最具体的子版块（第一个出现的）

        let subcategory = null;  // 子版块（如果有）
        let parentCategory = null;  // 父版块

        // 从 topic-category 区域获取板块信息（这里通常按 子版块 > 父版块 的顺序排列）
        const topicCategory = document.querySelector('.topic-category');
        if (topicCategory) {
            const badges = topicCategory.querySelectorAll('.badge-category__name, .category-name');
            const names = [];
            badges.forEach(badge => {
                const name = badge.textContent?.trim();
                if (name) names.push(name);
            });
            // 第一个是子版块，第二个是父版块（如果有的话）
            if (names.length >= 2) {
                subcategory = names[0];
                parentCategory = names[1];
            } else if (names.length === 1) {
                // 只有一个板块，可能是顶级板块
                parentCategory = names[0];
            }
        }

        // 如果没有从 topic-category 获取到，尝试其他方式
        if (!parentCategory) {
            const headerCategory = document.querySelector('.extra-info-wrapper .badge-category__name');
            if (headerCategory) {
                parentCategory = headerCategory.textContent?.trim();
            }
        }

        // 收集所有检测到的板块用于日志
        const detectedCategories = [];
        if (subcategory) detectedCategories.push(subcategory);
        if (parentCategory) detectedCategories.push(parentCategory);

        if (detectedCategories.length === 0) {
            console.log('[板块检查] 无法获取当前板块信息，默认不允许点赞');
            return { allowed: false, reason: 'category_not_found', categories: [] };
        }

        console.log('[板块检查] 检测到板块:', detectedCategories.join(' > '),
                    subcategory ? `(子版块: ${subcategory}, 父版块: ${parentCategory})` : `(顶级板块: ${parentCategory})`);

        // 检查逻辑：
        // 1. 如果有子版块，子版块必须在允许列表中，或者不在排除列表且父版块在允许列表中
        // 2. 如果只有父版块，父版块必须在允许列表中

        if (subcategory) {
            // 有子版块的情况

            // 首先检查子版块是否在排除列表中
            if (config.excluded && config.excluded.includes(subcategory)) {
                console.log(`[板块检查] 子版块 "${subcategory}" 在排除列表中，不允许点赞`);
                return { allowed: false, reason: 'subcategory_excluded', category: subcategory, categories: detectedCategories };
            }

            // 检查子版块是否直接在允许列表中
            if (config.allowed.includes(subcategory)) {
                console.log(`[板块检查] 子版块 "${subcategory}" 在允许列表中，允许点赞`);
                return { allowed: true, reason: 'subcategory_allowed', category: subcategory, categories: detectedCategories };
            }

            // 子版块不在允许列表中，检查父版块是否在允许列表中
            if (parentCategory && config.allowed.includes(parentCategory)) {
                console.log(`[板块检查] 子版块 "${subcategory}" 不在允许列表，父版块 "${parentCategory}" 在允许列表中，允许点赞`);
                return { allowed: true, reason: 'parent_allowed', category: parentCategory, subcategory: subcategory, categories: detectedCategories };
            }

            // 子版块和父版块都不在允许列表中
            console.log(`[板块检查] 子版块 "${subcategory}" 和父版块 "${parentCategory}" 都不在允许列表中，不允许点赞`);
            return { allowed: false, reason: 'not_in_allowed_list', categories: detectedCategories };

        } else {
            // 只有父版块的情况（顶级板块）

            // 检查是否在排除列表中
            if (config.excluded && config.excluded.includes(parentCategory)) {
                console.log(`[板块检查] 板块 "${parentCategory}" 在排除列表中，不允许点赞`);
                return { allowed: false, reason: 'excluded', category: parentCategory, categories: detectedCategories };
            }

            // 检查是否在允许列表中
            if (config.allowed.includes(parentCategory)) {
                console.log(`[板块检查] 板块 "${parentCategory}" 在允许列表中，允许点赞`);
                return { allowed: true, reason: 'allowed', category: parentCategory, categories: detectedCategories };
            }

            // 不在允许列表中
            console.log(`[板块检查] 板块 "${parentCategory}" 不在允许列表中，不允许点赞`);
            return { allowed: false, reason: 'not_in_allowed_list', categories: detectedCategories };
        }
    }

    async autoLikeTopic() {
        if (!this.autoLikeEnabled) return;

        // 检查是否在冷却期
        if (this.likeResumeTime && Date.now() < this.likeResumeTime) {
            console.log("[自动点赞] 点赞功能冷却中，跳过");
            return;
        }

        // 检查当前板块是否允许点赞
        const categoryCheck = this.isLikeAllowedInCurrentCategory();
        if (!categoryCheck.allowed) {
            console.log(`[自动点赞] 当前板块不允许点赞: ${categoryCheck.reason}`);
            return;
        }

        const match = window.location.pathname.match(/\/t\/topic\/(\d+)/);
        if (!match) {
            console.log("[自动点赞] 无法获取当前主题ID");
            return;
        }
        const topicId = match[1];

        if (this.likedTopics.includes(topicId)) {
            console.log(`[自动点赞] 主题 ${topicId} 已经点赞过，跳过`);
            return;
        }

        console.log("[自动点赞] 正在检查是否需要点赞主题...");
        await Utils.sleep(2000);

        const likeButton = document.querySelector('div.discourse-reactions-reaction-button button.btn-toggle-reaction-like');
        if (likeButton && !likeButton.classList.contains('has-like') && !likeButton.classList.contains('liked')) {
            // 检查点赞过滤条件
            const firstPost = document.querySelector('.topic-post');
            if (firstPost) {
                const filterResult = this.shouldLikePost(firstPost);
                if (!filterResult.shouldLike) {
                    console.log(`[自动点赞] 跳过主题点赞: ${filterResult.reason}, 当前赞数: ${filterResult.likeCount}${filterResult.probability !== undefined ? `, 概率: ${(filterResult.probability * 100).toFixed(0)}%` : ''}`);
                    // 记录为已处理，避免重复检查
                    this.likedTopics.push(topicId);
                    Storage.set('likedTopics', this.likedTopics);
                    return;
                }
                console.log(`[自动点赞] 通过过滤检查: ${filterResult.reason}, 当前赞数: ${filterResult.likeCount}${filterResult.probability !== undefined ? `, 概率: ${(filterResult.probability * 100).toFixed(0)}%` : ''}`);
            }

            likeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await Utils.sleep(1000);
            console.log("[自动点赞] 找到主题点赞按钮，执行点击");
            likeButton.click();

            // 点击后等待一下，检查是否触发冷却
            await Utils.sleep(1000);

            // 如果触发了冷却，直接返回
            if (this.likeResumeTime && Date.now() < this.likeResumeTime) {
                console.log("[自动点赞] 检测到点赞冷却，停止点赞");
                return;
            }

            this.likedTopics.push(topicId);
            Storage.set('likedTopics', this.likedTopics);
            console.log(`[自动点赞] 已记录点赞主题 ${topicId}`);
        } else {
            console.log("[自动点赞] 未找到可点赞的按钮或已点赞");
            if (likeButton && (likeButton.classList.contains('has-like') || likeButton.classList.contains('liked'))) {
                if (!this.likedTopics.includes(topicId)) {
                    this.likedTopics.push(topicId);
                    Storage.set('likedTopics', this.likedTopics);
                    console.log(`[自动点赞] 主题 ${topicId} 已点赞，记录到列表`);
                }
            }
        }
    }

    async quickLikeReplies() {
        // 检查是否在冷却期
        if (this.likeResumeTime && Date.now() < this.likeResumeTime) {
            console.log("[快速点赞] 点赞功能冷却中，跳过");
            return;
        }

        // 检查当前板块是否允许点赞
        const categoryCheck = this.isLikeAllowedInCurrentCategory();
        if (!categoryCheck.allowed) {
            console.log(`[快速点赞] 当前板块不允许点赞: ${categoryCheck.reason}`);
            return;
        }

        // 获取当前帖子ID
        const match = window.location.pathname.match(/\/t\/topic\/(\d+)/);
        if (!match) {
            console.log("[快速点赞] 无法获取当前主题ID");
            return;
        }
        const topicId = match[1];

        // 获取本帖已点赞的楼层列表
        const likedFloorsInThisTopic = this.quickLikedFloors[topicId] || [];

        // 等待页面加载完成
        await Utils.sleep(2000);

        // 获取所有楼层
        const allPosts = Array.from(document.querySelectorAll('.topic-post'));

        // 筛选出未点赞的楼层
        const availablePosts = allPosts.filter(post => {
            const postNumber = post.getAttribute('data-post-number');
            const floorNumber = postNumber ? parseInt(postNumber) : 0;
            if (likedFloorsInThisTopic.includes(floorNumber)) {
                return false;
            }
            // 检查点赞过滤条件
            const filterResult = this.shouldLikePost(post);
            if (!filterResult.shouldLike) {
                console.log(`[快速点赞] 跳过楼层 ${floorNumber}: ${filterResult.reason}, 赞数: ${filterResult.likeCount}${filterResult.probability !== undefined ? `, 概率: ${(filterResult.probability * 100).toFixed(0)}%` : ''}`);
                return false;
            }
            return true;
        });

        // 随机打乱楼层顺序
        const shuffledPosts = availablePosts.sort(() => Math.random() - 0.5);

        const maxLikes = 5;
        let likedCount = 0;

        // 随机选择最多5个楼层进行点赞
        for (let i = 0; i < Math.min(shuffledPosts.length, maxLikes); i++) {
            const post = shuffledPosts[i];

            // 获取楼层号
            const postNumber = post.getAttribute('data-post-number');
            const floorNumber = postNumber ? parseInt(postNumber) : (i + 1);

            const likeButton = post.querySelector('.discourse-reactions-reaction-button button.btn-toggle-reaction-like');

            if (likeButton) {
                // 执行点赞
                likeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await Utils.sleep(500);
                likeButton.click();
                likedCount++;

                // 记录已点赞的楼层
                likedFloorsInThisTopic.push(floorNumber);

                await Utils.sleep(500);

                // 每次点击后检查是否触发了冷却
                if (this.likeResumeTime && Date.now() < this.likeResumeTime) {
                    break; // 立即跳出循环，不再继续点赞
                }
            }
        }

        // 保存点赞记录
        this.quickLikedFloors[topicId] = likedFloorsInThisTopic;
        Storage.set('quickLikedFloors', this.quickLikedFloors);
    }

    async handleFirstUse() {
        if (!this.autoRunning) return;

        // 只在 linux.do 域名下执行新手教程
        if (CURRENT_DOMAIN !== 'linux.do') {
            console.log('非 linux.do 域名，跳过新手教程');
            Storage.set('firstUseChecked', true);
            this.firstUseChecked = true;
            await this.getLatestTopics();
            await this.navigateNextTopic();
            return;
        }

        if (!this.selectedPost) {
            const randomIndex = Math.floor(Math.random() * CONFIG.mustRead.posts.length);
            this.selectedPost = CONFIG.mustRead.posts[randomIndex];
            Storage.set('selectedPost', this.selectedPost);
            console.log(`随机选择文章: ${this.selectedPost.url}`);
            window.location.href = this.selectedPost.url;
            return;
        }

        const currentUrl = window.location.href;
        if (currentUrl.includes(this.selectedPost.url)) {
            console.log(`当前在选中的文章页面，已点赞数: ${this.likesCount}`);
            while (this.likesCount < CONFIG.mustRead.likesNeeded && this.autoRunning) {
                // 检查是否在冷却期，如果是则跳过新手教程的点赞要求
                if (this.likeResumeTime && Date.now() < this.likeResumeTime) {
                    console.log('[新手教程] 点赞功能冷却中，跳过点赞要求，直接开始正常浏览');
                    Storage.set('firstUseChecked', true);
                    this.firstUseChecked = true;
                    await this.getLatestTopics();
                    await this.navigateNextTopic();
                    return;
                }

                await this.likeRandomComment();
                if (this.likesCount >= CONFIG.mustRead.likesNeeded) {
                    console.log('完成所需点赞数量，开始正常浏览');
                    Storage.set('firstUseChecked', true);
                    this.firstUseChecked = true;
                    await this.getLatestTopics();
                    await this.navigateNextTopic();
                    break;
                }
                await Utils.sleep(1000);
            }
        } else {
            window.location.href = this.selectedPost.url;
        }
    }

    async likeRandomComment() {
        if (!this.autoRunning) return false;

        // 检查是否在冷却期
        if (this.likeResumeTime && Date.now() < this.likeResumeTime) {
            console.log("点赞功能冷却中，跳过点赞");
            return false;
        }

        const likeButtons = Array.from(document.querySelectorAll('.like-button, .like-count, [data-like-button], .discourse-reactions-reaction-button'))
            .filter(button =>
                button &&
                button.offsetParent !== null &&
                !button.classList.contains('has-like') &&
                !button.classList.contains('liked')
            );

        if (likeButtons.length > 0) {
            const randomButton = likeButtons[Math.floor(Math.random() * likeButtons.length)];
            randomButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await Utils.sleep(1000);

            if (!this.autoRunning) return false;
            console.log('找到可点赞的评论，准备点赞');
            randomButton.click();
            this.likesCount++;
            Storage.set('likesCount', this.likesCount);
            await Utils.sleep(1000);
            return true;
        }

        window.scrollBy({
            top: 500,
            behavior: 'smooth'
        });
        await Utils.sleep(1000);
        console.log('当前位置没有找到可点赞的评论，继续往下找');
        return false;
    }

    async getLatestTopics() {
        let topicList = [];
        let retryCount = 0;
        let totalSkipped = 0; // 跳过的已读帖子总数
        let emptyPageCount = 0; // 连续空页计数

        // 使用用户设置的帖子数量限制
        // 如果开启了阅读限制，则使用阅读限制的数量（减去已读数量）
        let topicLimit = this.topicLimitCount || 100;
        if (this.stopAfterReadEnabled) {
            const remainingToRead = this.stopAfterReadCount - this.currentSessionReadCount;
            if (remainingToRead > 0) {
                topicLimit = remainingToRead;
                console.log(`[阅读限制] 开启阅读限制，本次只获取 ${topicLimit} 篇帖子（限制${this.stopAfterReadCount}篇，已读${this.currentSessionReadCount}篇）`);
            } else {
                console.log(`[阅读限制] 已达到阅读限制，不再获取新帖子`);
                topicLimit = 0;
            }
        }
        // 最大翻页数限制（防止无限循环，根据目标数量动态计算）
        // 假设每页约30篇帖子，为了获取N篇未读，最多翻 N/5 页（考虑大量已读的情况）
        const maxPagesPerFetch = Math.max(50, Math.ceil(topicLimit / 5));

        // 智能起始页码：优先使用会话内页码，其次使用历史页码
        let startPage = this.getStartPage();
        let page = startPage;
        const maxPage = startPage + maxPagesPerFetch - 1; // 计算本次最大页码

        // 根据设置选择获取最新帖子还是未读帖子
        const endpoint = this.readUnreadEnabled ? 'unread' : 'latest';
        const topicType = this.readUnreadEnabled ? this.t('unreadTopics') : this.t('latestTopics');
        console.log(`[页码续读] 从第${startPage}页开始获取${this.readUnreadEnabled ? '未读' : '最新'}帖子（限制：${topicLimit}篇，最大翻到第${maxPage}页）...`);

        // 显示获取状态区域
        this.updateTopicStatus({
            fetching: true,
            type: topicType,
            current: 0,
            target: topicLimit,
            skipped: 0,
            startPage: startPage
        });

        while (topicList.length < topicLimit && retryCount < CONFIG.article.retryLimit && page <= maxPage) {
            try {
                const response = await fetch(`${BASE_URL}/${endpoint}.json?no_definitions=true&page=${page}`);
                const data = await response.json();

                if (data?.topic_list?.topics && data.topic_list.topics.length > 0) {
                    emptyPageCount = 0; // 重置空页计数
                    let filteredTopics = data.topic_list.topics.filter(topic =>
                        topic.posts_count < CONFIG.article.commentLimit
                    );

                    // 如果开启了跳过已读帖子，过滤掉已读的
                    if (this.skipReadEnabled) {
                        const beforeCount = filteredTopics.length;
                        filteredTopics = filteredTopics.filter(topic =>
                            !this.isTopicRead(topic.id.toString())
                        );
                        const skippedCount = beforeCount - filteredTopics.length;
                        if (skippedCount > 0) {
                            totalSkipped += skippedCount;
                            console.log(`第${page}页：跳过了 ${skippedCount} 篇已读帖子，获取 ${filteredTopics.length} 篇未读`);
                        }
                    }

                    topicList.push(...filteredTopics);
                    page++;

                    // 更新获取状态
                    this.updateTopicStatus({
                        fetching: true,
                        type: topicType,
                        current: topicList.length,
                        target: topicLimit,
                        skipped: totalSkipped,
                        page: page - 1,
                        maxPages: maxPage,
                        startPage: startPage
                    });

                    // 如果是未读帖子模式且API返回空数据，说明没有更多未读了
                    if (this.readUnreadEnabled && data.topic_list.topics.length === 0) {
                        console.log('未读帖子模式：API返回空数据，没有更多未读帖子');
                        break;
                    }
                } else {
                    // API返回空数据
                    emptyPageCount++;
                    console.log(`第${page}页：API返回空数据（连续${emptyPageCount}页为空）`);

                    // 如果连续3页为空，可能已经到达末尾，从第1页重新开始
                    if (emptyPageCount >= 3) {
                        if (startPage > 1 && topicList.length < topicLimit) {
                            console.log(`[页码续读] 连续${emptyPageCount}页为空，从第1页重新扫描...`);
                            // 重置起始页，从头开始
                            page = 1;
                            startPage = 1;
                            emptyPageCount = 0;
                            // 重置会话页码
                            this.lastFetchedPage = 0;
                            this.setSessionStorage('lastFetchedPage', 0);
                            continue;
                        }
                        break;
                    }
                    page++;
                }
            } catch (error) {
                console.error('获取文章列表失败:', error);
                retryCount++;
                await Utils.sleep(1000);
            }
        }

        // 保存本次获取到的最大页码
        const finalPage = page - 1;
        this.lastFetchedPage = finalPage;
        this.setSessionStorage('lastFetchedPage', finalPage);
        this.saveHistoricalMaxPage(finalPage);

        // 检查是否因为达到最大页数而停止
        const reachedMaxPages = page > maxPage && topicList.length < topicLimit;
        if (reachedMaxPages) {
            console.log(`[页码续读] 已达到本次最大页数 ${maxPage} 页，获取到 ${topicList.length}/${topicLimit} 篇帖子`);
        }

        if (topicList.length > topicLimit) {
            topicList = topicList.slice(0, topicLimit);
        }

        // 如果开启了随机顺序，打乱帖子列表
        if (this.randomOrderEnabled && topicList.length > 1) {
            topicList = this.shuffleArray(topicList);
            console.log('已随机打乱帖子顺序');
        }

        this.topicList = topicList;
        this.setSessionStorage('topicList', topicList);
        console.log(`[页码续读] 已获取 ${topicList.length} 篇${this.readUnreadEnabled ? '未读' : '最新'}文章${this.randomOrderEnabled ? '（随机顺序）' : ''}（第${startPage}-${finalPage}页）`);

        // 更新最终状态
        this.updateTopicStatus({
            fetching: false,
            type: topicType,
            current: topicList.length,
            target: topicLimit,
            skipped: totalSkipped,
            ready: true,
            reachedMaxPages: reachedMaxPages,
            totalPages: finalPage - startPage + 1,
            startPage: startPage,
            endPage: finalPage
        });

        // 如果获取到的帖子为空
        if (topicList.length === 0) {
            if (this.readUnreadEnabled) {
                // 未读模式下没有未读帖子
                this.showNotification(this.t('noUnreadPosts'));
                this.readUnreadEnabled = false;
                Storage.set('readUnreadEnabled', false);
                // 重置页码并重新获取最新帖子
                this.resetPageProgress();
                await this.getLatestTopics();
            } else if (this.skipReadEnabled && startPage > 1) {
                // 从高页码开始但没找到未读帖子，从第1页重新开始
                console.log('[页码续读] 高页码无未读帖子，从第1页重新开始');
                this.resetPageProgress();
                this.historicalMaxPage = 0;
                Storage.set('historicalMaxPageData', null);
                await this.getLatestTopics();
            } else if (this.skipReadEnabled) {
                // 最新帖子模式+跳过已读，但所有帖子都已读过
                this.showNotification('所有帖子都已读过，停止阅读');
                this.stopNavigation();
            }
        }
    }

    // 更新帖子获取状态显示
    updateTopicStatus(status) {
        if (!this.topicStatusContainer) return;

        this.topicStatusContainer.style.display = 'block';

        const progressPercent = status.target > 0 ? Math.min(100, Math.round((status.current / status.target) * 100)) : 0;

        let html = '';

        if (status.fetching) {
            // 获取中状态 - 显示起始页和当前页
            const startPageInfo = status.startPage > 1 ? `从第${status.startPage}页` : '';
            const pageInfo = status.page ? `（${startPageInfo ? startPageInfo + '起，' : ''}当前第${status.page}页）` : '';
            html = `
                <div style="font-size: 11px; color: white; margin-bottom: 6px;">
                    ${this.t('fetchingTopics')} <span style="color: #ffd700;">${status.type}</span> ${pageInfo}
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #48bb78 0%, #68d391 100%); transition: width 0.3s;"></div>
                    </div>
                    <span style="font-size: 10px; color: rgba(255,255,255,0.8); min-width: 35px;">${progressPercent}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.7);">
                    <span>${this.t('totalFetched')}: <span style="color: #7dffb3;">${status.current}</span>/${status.target}</span>
                    ${status.skipped > 0 ? `<span>${this.t('skippedRead')}: <span style="color: #ffa500;">${status.skipped}</span></span>` : ''}
                </div>
            `;
        } else if (status.ready) {
            // 获取完成状态 - 显示页码范围
            const pagesInfo = status.startPage && status.endPage
                ? `（第${status.startPage}-${status.endPage}页，共${status.totalPages}页）`
                : (status.totalPages ? `（共${status.totalPages}页）` : '');
            const reachedMaxInfo = status.reachedMaxPages ? `<div style="font-size: 9px; color: #ffa500; margin-top: 2px;">⚠️ 已达最大翻页数，未能获取足够帖子</div>` : '';
            html = `
                <div style="font-size: 11px; color: #7dffb3; margin-bottom: 4px;">
                    ✅ ${this.t('topicsReady')} ${pagesInfo}
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.8);">
                    <span>${status.type}: <span style="color: #ffd700; font-weight: bold;">${status.current}</span> 篇</span>
                    ${status.skipped > 0 ? `<span>${this.t('skippedRead')}: <span style="color: #ffa500;">${status.skipped}</span></span>` : ''}
                </div>
                ${reachedMaxInfo}
            `;

            // 3秒后隐藏状态区域（如果不在阅读中）
            setTimeout(() => {
                if (!this.isScrolling && this.topicStatusContainer) {
                    this.topicStatusContainer.style.display = 'none';
                }
            }, 3000);
        }

        this.topicStatusContainer.innerHTML = html;
    }

    // 更新当前阅读状态（在导航到下一篇时调用）
    updateReadingStatus() {
        if (!this.topicStatusContainer || !this.autoRunning) return;

        const remaining = this.topicList.length;
        const topicType = this.readUnreadEnabled ? this.t('unreadTopics') : this.t('latestTopics');
        const skipped = this.skippedReadCount || 0;
        const todayRead = this.todayReadCount || 0;

        this.topicStatusContainer.style.display = 'block';
        this.topicStatusContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: rgba(255,255,255,0.9); margin-bottom: 4px;">
                <span>${this.t('currentReading')}: <span style="color: #ffd700;">${topicType}</span></span>
                <span>${this.t('remainingTopics')}: <span style="color: #7dffb3; font-weight: bold;">${remaining}</span></span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: rgba(255,255,255,0.7);">
                <span>📅 ${this.t('todayRead')}: <span style="color: #87ceeb; font-weight: bold;">${todayRead}</span></span>
                ${skipped > 0 ? `<span>⏭️ ${this.t('skippedRead')}: <span style="color: #ffa500;">${skipped}</span></span>` : ''}
            </div>
        `;
    }

    // Fisher-Yates 洗牌算法
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    async getNextTopic() {
        if (this.topicList.length === 0) {
            await this.getLatestTopics();
        }

        // 如果开启了跳过已读帖子，循环查找第一个未读的帖子
        while (this.topicList.length > 0) {
            const topic = this.topicList.shift();

            // 检查是否已读（需要再次检查，因为 topicList 可能是从 sessionStorage 恢复的）
            if (this.skipReadEnabled && this.isTopicRead(topic.id.toString())) {
                console.log(`跳过已读帖子: ${topic.title} (ID: ${topic.id})`);
                // 增加跳过计数
                this.skippedReadCount++;
                this.setSessionStorage('skippedReadCount', this.skippedReadCount);
                this.setSessionStorage('topicList', this.topicList);
                // 更新状态显示
                this.updateReadingStatus();
                continue; // 继续找下一个
            }

            this.setSessionStorage('topicList', this.topicList);
            return topic;
        }

        return null;
    }

    async startScrolling() {
        if (this.isScrolling) return;

        this.isScrolling = true;
        this.button.innerHTML = `<span class="btn-icon">⏸</span><span class="btn-text">${this.t('stopReading')}</span>`;
        this.button.classList.add('running');
        this.lastActionTime = Date.now();

        // 在开始滚动前，先执行点赞操作
        if (this.isTopicPage) {
            if (this.autoLikeEnabled) {
                await this.autoLikeTopic();
            } else if (this.quickLikeEnabled) {
                await this.quickLikeReplies();
            }
        }

        // 记录页面开始滚动的时间,用于强制跳转
        this.scrollStartTime = Date.now();
        // 设置最大滚动时间(30秒),超过后强制跳转,避免卡在一个页面
        const maxScrollTime = 30000; // 30秒

        while (this.isScrolling) {
            const speed = Utils.random(CONFIG.scroll.minSpeed, CONFIG.scroll.maxSpeed);
            const distance = Utils.random(CONFIG.scroll.minDistance, CONFIG.scroll.maxDistance);
            const scrollStep = distance * 2.5;

            window.scrollBy({
                top: scrollStep,
                behavior: 'smooth'
            });

            // 检查是否到达底部
            if (Utils.isNearBottom()) {
                await Utils.sleep(800);

                if (Utils.isNearBottom() && Utils.isPageLoaded()) {
                    console.log("已到达页面底部，准备导航到下一篇文章...");
                    await Utils.sleep(1000);
                    await this.navigateNextTopic();
                    break;
                }
            }

            // 强制跳转检查:如果在当前页面滚动超过最大时间,强制跳转到下一篇
            const scrolledTime = Date.now() - this.scrollStartTime;
            if (scrolledTime > maxScrollTime) {
                console.log(`已在当前页面滚动${Math.floor(scrolledTime/1000)}秒，强制跳转到下一篇文章...`);
                await this.navigateNextTopic();
                break;
            }

            await Utils.sleep(speed);
            this.accumulateTime();

            if (Math.random() < CONFIG.scroll.fastScrollChance) {
                const fastScroll = Utils.random(CONFIG.scroll.fastScrollMin, CONFIG.scroll.fastScrollMax);
                window.scrollBy({
                    top: fastScroll,
                    behavior: 'smooth'
                });
                await Utils.sleep(200);
            }
        }
    }

    async waitForPageLoad() {
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            if (Utils.isPageLoaded()) {
                return true;
            }
            await Utils.sleep(300);
            attempts++;
        }

        return false;
    }

    stopScrolling() {
        this.isScrolling = false;
        clearInterval(this.scrollInterval);
        clearTimeout(this.pauseTimeout);
        this.button.innerHTML = `<span class="btn-icon">▶</span><span class="btn-text">${this.t('startReading')}</span>`;
        this.button.classList.remove('running');
    }

    accumulateTime() {
        const now = Date.now();
        this.accumulatedTime += now - this.lastActionTime;
        this.setSessionStorage('accumulatedTime', this.accumulatedTime);
        this.lastActionTime = now;

        if (this.accumulatedTime >= CONFIG.time.browseTime) {
            this.accumulatedTime = 0;
            this.setSessionStorage('accumulatedTime', 0);
            this.pauseForRest();
        }
    }

    async pauseForRest() {
        this.stopScrolling();
        const restMinutes = Math.floor(CONFIG.time.restTime / 60000);
        console.log(`休息${restMinutes}分钟...`);

        // 显示休息开始通知
        this.showNotification(`⏸️ ${this.t('restStart')} ${restMinutes} ${this.t('minutes')}`);

        await Utils.sleep(CONFIG.time.restTime);

        console.log("休息结束，继续浏览...");

        // 显示休息结束通知
        this.showNotification(`✅ ${this.t('restEnd')}`);

        this.startScrolling();
    }

    async navigateNextTopic() {
        // 检查阅读数量限制
        if (this.stopAfterReadEnabled && this.currentSessionReadCount >= this.stopAfterReadCount) {
            console.log(`已达到阅读数量限制 (${this.currentSessionReadCount}/${this.stopAfterReadCount})，自动停止`);
            this.showNotification(this.t('stoppedByReadLimit'));
            this.stopAutoReading();
            return;
        }

        // 检查点赞上限是否需要停止阅读
        if (this.stopOnLikeLimitEnabled) {
            // 检查多种点赞上限状态
            const likeStatus = this.likeCounter?.getStatus?.();
            const isLikeCounterCooldown = likeStatus && likeStatus.isInCooldown;
            const isOldCooldown = this.likeResumeTime && Date.now() < this.likeResumeTime;
            const hasNoRemainingLikes = likeStatus && likeStatus.remaining === 0;

            if (isLikeCounterCooldown || isOldCooldown || hasNoRemainingLikes) {
                console.log(`[点赞上限] 点赞已达上限，自动停止阅读 (cooldown: ${isLikeCounterCooldown}, oldCooldown: ${isOldCooldown}, noRemaining: ${hasNoRemainingLikes})`);
                this.showNotification(this.t('stoppedByLikeLimit'));
                this.stopAutoReading();
                return;
            }
        }

        const nextTopic = await this.getNextTopic();
        if (nextTopic) {
            console.log("导航到新文章:", nextTopic.title);

            // 增加今日阅读计数
            this.incrementTodayReadCount();

            // 增加当前会话阅读计数
            this.currentSessionReadCount++;
            this.setSessionStorage('currentSessionReadCount', this.currentSessionReadCount);
            console.log(`当前会话已阅读: ${this.currentSessionReadCount}/${this.stopAfterReadCount}`);

            // 更新阅读状态显示
            this.updateReadingStatus();

            // 保存当前帖子为已读
            const currentMatch = window.location.pathname.match(/\/t\/topic\/(\d+)/);
            if (currentMatch) {
                const currentTopicId = currentMatch[1];
                await this.saveUserReadHistory(currentTopicId);
            }

            const url = nextTopic.last_read_post_number
                ? `${BASE_URL}/t/topic/${nextTopic.id}/${nextTopic.last_read_post_number}`
                : `${BASE_URL}/t/topic/${nextTopic.id}`;

            console.log("正在跳转到:", url);

            // 设置跳转超时保护 - 如果10秒内没有跳转成功，强制重新跳转
            this.navigationTimeout = setTimeout(() => {
                console.warn("⚠️ 跳转超时，尝试重新跳转...");
                if (window.location.href !== url) {
                    window.location.href = url;
                }
            }, 10000);

            // 直接跳转
            window.location.href = url;
        } else {
            console.log("没有更多文章，返回首页");
            window.location.href = `${BASE_URL}/latest`;
        }
    }

    // 停止自动阅读的统一方法
    stopAutoReading() {
        this.stopScrolling();
        this.stopNavigationGuard();
        this.autoRunning = false;
        this.setSessionStorage('autoRunning', false);
        this.button.innerHTML = `<span class="btn-icon">▶</span><span class="btn-text">${this.t('startReading')}</span>`;
        this.button.classList.remove('running');

        // 清理所有定时器
        if (this.navigationTimeout) {
            clearTimeout(this.navigationTimeout);
            this.navigationTimeout = null;
        }

        // 停止阅读时，折叠自动阅读区
        if (this.autoSectionContent) {
            const autoSection = this.container.querySelector('.section-collapsible');
            if (autoSection && !autoSection.classList.contains('collapsed')) {
                autoSection.classList.add('collapsed');
                this.autoSectionContent.classList.add('collapsed');
            }
        }

        // 停止阅读时，展开账号信息区
        if (this.accountSection && this.accountSectionContent) {
            if (this.accountSection.classList.contains('collapsed')) {
                this.accountSection.classList.remove('collapsed');
                this.accountSectionContent.classList.remove('collapsed');
            }
        }

        console.log('自动阅读已停止');
    }

    resetFirstUse() {
        Storage.set('firstUseChecked', false);
        Storage.set('likesCount', 0);
        Storage.set('selectedPost', null);
        this.firstUseChecked = false;
        this.likesCount = 0;
        this.selectedPost = null;
        console.log('已重置首次使用状态');
    }

    // ========== 积分转账功能 ==========

    // 显示转账模态框
    showTransferModal() {
        // 移除已存在的模态框
        this.closeTransferModal();

        const overlay = document.createElement('div');
        overlay.className = 'ld-modal-overlay';
        overlay.id = 'ld-transfer-overlay';

        const modal = document.createElement('div');
        modal.className = 'ld-modal';
        modal.innerHTML = `
            <div class="ld-modal-header">
                <span class="ld-modal-title">${this.t('creditTransferTitle')}</span>
                <button class="ld-modal-close" id="ld-modal-close">&times;</button>
            </div>
            <div class="ld-modal-body">
                <div class="ld-input-group">
                    <label class="ld-input-label">${this.t('creditTransferTo')}</label>
                    <input type="text" class="ld-input" id="ld-transfer-recipient" placeholder="@username">
                </div>
                <div class="ld-input-group">
                    <label class="ld-input-label">${this.t('creditSelectAmount')}</label>
                    <div class="ld-amount-grid">
                        <button class="ld-amount-btn" data-amount="10">10</button>
                        <button class="ld-amount-btn" data-amount="20">20</button>
                        <button class="ld-amount-btn" data-amount="50">50</button>
                        <button class="ld-amount-btn" data-amount="100">100</button>
                        <button class="ld-amount-btn" data-amount="200">200</button>
                        <button class="ld-amount-btn" data-amount="500">500</button>
                    </div>
                </div>
                <div class="ld-input-group">
                    <label class="ld-input-label">${this.t('creditCustomAmount')}</label>
                    <input type="number" class="ld-input" id="ld-transfer-amount" placeholder="0" min="1">
                </div>
                <div class="ld-input-group">
                    <label class="ld-input-label">${this.t('creditRemark')}</label>
                    <input type="text" class="ld-input" id="ld-transfer-remark" placeholder="${this.t('creditRemarkPlaceholder')}">
                </div>
            </div>
            <div class="ld-actions">
                <button class="ld-btn ld-btn-cancel" id="ld-cancel-btn">${this.t('creditCancel')}</button>
                <button class="ld-btn ld-btn-confirm" id="ld-next-btn">${this.t('creditNextStep')}</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 绑定事件
        document.getElementById('ld-modal-close').onclick = () => this.closeTransferModal();
        document.getElementById('ld-cancel-btn').onclick = () => this.closeTransferModal();
        document.getElementById('ld-next-btn').onclick = () => this.showPasswordModal();

        // 金额按钮点击
        modal.querySelectorAll('.ld-amount-btn').forEach(btn => {
            btn.onclick = (e) => {
                modal.querySelectorAll('.ld-amount-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById('ld-transfer-amount').value = e.target.dataset.amount;
            };
        });

        // 自定义金额输入时取消预设按钮选中
        document.getElementById('ld-transfer-amount').oninput = () => {
            modal.querySelectorAll('.ld-amount-btn').forEach(b => b.classList.remove('active'));
        };

        // 点击遮罩关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) this.closeTransferModal();
        };

        // ESC关闭
        this.transferModalEscHandler = (e) => {
            if (e.key === 'Escape') this.closeTransferModal();
        };
        document.addEventListener('keydown', this.transferModalEscHandler);
    }

    // 关闭转账模态框
    closeTransferModal() {
        const overlay = document.getElementById('ld-transfer-overlay');
        if (overlay) overlay.remove();

        const passwordOverlay = document.getElementById('ld-password-overlay');
        if (passwordOverlay) passwordOverlay.remove();

        if (this.transferModalEscHandler) {
            document.removeEventListener('keydown', this.transferModalEscHandler);
            this.transferModalEscHandler = null;
        }
    }

    // 显示密码输入模态框
    showPasswordModal() {
        const recipient = document.getElementById('ld-transfer-recipient')?.value?.trim();
        const amount = document.getElementById('ld-transfer-amount')?.value;
        const remark = document.getElementById('ld-transfer-remark')?.value?.trim() || '';

        if (!recipient) {
            this.showNotification(this.t('creditTransferTo') + '!', 'error');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            this.showNotification(this.t('creditInvalidAmount'), 'error');
            return;
        }

        // 保存转账信息
        this.transferData = {
            recipient: recipient.replace(/^@/, ''),
            amount: parseFloat(amount),
            remark: remark
        };

        // 隐藏第一个模态框
        const firstModal = document.querySelector('#ld-transfer-overlay .ld-modal');
        if (firstModal) firstModal.style.display = 'none';

        // 创建密码输入模态框
        const passwordModal = document.createElement('div');
        passwordModal.className = 'ld-modal';
        passwordModal.id = 'ld-password-modal';
        passwordModal.innerHTML = `
            <div class="ld-modal-header">
                <span class="ld-modal-title">${this.t('creditTransferTitle')}</span>
                <button class="ld-modal-close" id="ld-password-close">&times;</button>
            </div>
            <div class="ld-modal-body">
                <div class="ld-confirm-info">
                    <div class="ld-confirm-row">
                        <span class="ld-confirm-label">${this.t('creditRecipient')}:</span>
                        <span class="ld-confirm-value">@${this.transferData.recipient}</span>
                    </div>
                    <div class="ld-confirm-row">
                        <span class="ld-confirm-label">${this.t('creditAmount')}:</span>
                        <span class="ld-confirm-value" style="color: #ffd700; font-weight: bold;">${this.transferData.amount}</span>
                    </div>
                    ${this.transferData.remark ? `
                    <div class="ld-confirm-row">
                        <span class="ld-confirm-label">${this.t('creditRemark')}:</span>
                        <span class="ld-confirm-value">${this.transferData.remark}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="ld-input-group">
                    <label class="ld-input-label">${this.t('creditPayPassword')}</label>
                    <input type="password" class="ld-input" id="ld-pay-password" placeholder="${this.t('creditPayPasswordPlaceholder')}">
                </div>
            </div>
            <div class="ld-actions">
                <button class="ld-btn ld-btn-cancel" id="ld-back-btn">${this.t('creditBack')}</button>
                <button class="ld-btn ld-btn-confirm" id="ld-confirm-pay-btn">${this.t('creditConfirmPay')}</button>
            </div>
        `;

        document.getElementById('ld-transfer-overlay').appendChild(passwordModal);

        // 绑定事件
        document.getElementById('ld-password-close').onclick = () => this.closeTransferModal();
        document.getElementById('ld-back-btn').onclick = () => {
            passwordModal.remove();
            if (firstModal) firstModal.style.display = '';
        };
        document.getElementById('ld-confirm-pay-btn').onclick = () => this.performTransfer();

        // 回车确认
        document.getElementById('ld-pay-password').onkeydown = (e) => {
            if (e.key === 'Enter') this.performTransfer();
        };

        // 聚焦密码输入框
        setTimeout(() => document.getElementById('ld-pay-password')?.focus(), 100);
    }

    // 执行转账
    performTransfer() {
        const password = document.getElementById('ld-pay-password')?.value;

        if (!password) {
            this.showNotification(this.t('creditEnterPassword'), 'error');
            return;
        }

        const confirmBtn = document.getElementById('ld-confirm-pay-btn');
        if (confirmBtn) {
            confirmBtn.textContent = this.t('creditProcessing');
            confirmBtn.disabled = true;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://credit.linux.do/api/v1/payment/transfer',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Referer': 'https://credit.linux.do/transfer'
            },
            withCredentials: true,
            data: JSON.stringify({
                recipient_identifier: this.transferData.recipient,
                amount: this.transferData.amount,
                remark: this.transferData.remark,
                payment_password: password
            }),
            onload: (response) => {
                try {
                    const result = JSON.parse(response.responseText);
                    if (response.status === 200 && result.code === 0) {
                        this.showNotification(this.t('creditTransferSuccess'), 'success');
                        this.closeTransferModal();
                        // 刷新积分信息
                        setTimeout(() => this.loadCreditInfo(true), 1000);
                    } else {
                        const errorMsg = result.message || result.msg || this.t('creditTransferFailed');
                        this.showNotification(`${this.t('creditTransferFailed')}: ${errorMsg}`, 'error');
                        if (confirmBtn) {
                            confirmBtn.textContent = this.t('creditConfirmPay');
                            confirmBtn.disabled = false;
                        }
                    }
                } catch (e) {
                    console.error('Transfer parse error:', e);
                    this.showNotification(this.t('creditTransferFailed'), 'error');
                    if (confirmBtn) {
                        confirmBtn.textContent = this.t('creditConfirmPay');
                        confirmBtn.disabled = false;
                    }
                }
            },
            onerror: (error) => {
                console.error('Transfer error:', error);
                this.showNotification(this.t('creditNetworkError'), 'error');
                if (confirmBtn) {
                    confirmBtn.textContent = this.t('creditConfirmPay');
                    confirmBtn.disabled = false;
                }
            }
        });
    }

    // 加载 Credit 积分信息
    async loadCreditInfo(isManualRefresh = false) {
        if (!this.creditContainer) return;

        const now = Date.now();
        const MIN_INTERVAL = 30 * 60 * 1000; // 30 分钟最小间隔

        // 检查是否在 Leaderboard 429 冷却期
        const leaderboard429Until = Storage.get('leaderboard429Until', 0);
        if (leaderboard429Until > now) {
            const remainingMinutes = Math.ceil((leaderboard429Until - now) / 60000);
            console.log(`[Credit] Leaderboard 429 冷却中，还需等待 ${remainingMinutes} 分钟`);
            // 如果有缓存数据，显示缓存；否则显示等待提示
            const cachedData = Storage.get('creditCachedData', null);
            if (cachedData) {
                this.renderCreditInfo(cachedData.userData, cachedData.dailyStats, cachedData.leaderboardData);
                // 更新底部提示为冷却状态
                const footer = this.creditContainer.querySelector('.credit-footer');
                if (footer) {
                    footer.innerHTML = `
                        <a href="https://credit.linux.do/home" target="_blank" class="credit-link">${this.t('creditViewDetails')}</a>
                        <span class="credit-update-time" style="color: #ff9999;">🔥 冷却中 ${remainingMinutes}分钟</span>
                    `;
                }
            } else {
                this.renderCreditError(`请求过于频繁，请等待 ${remainingMinutes} 分钟后再试`);
            }
            return;
        }

        // 检查是否在最小间隔内（非手动刷新时检查）
        const lastCreditFetch = Storage.get('lastCreditFetch', 0);
        if (!isManualRefresh && lastCreditFetch > 0 && (now - lastCreditFetch) < MIN_INTERVAL) {
            // 使用缓存数据
            const cachedData = Storage.get('creditCachedData', null);
            if (cachedData) {
                console.log('[Credit] 使用缓存数据（未到刷新间隔）');
                this.renderCreditInfo(cachedData.userData, cachedData.dailyStats, cachedData.leaderboardData);
                return;
            }
        }

        // 手动刷新时不再检查间隔限制
        // 由于现在使用 DOM 方式获取用户名，不再依赖 session/current API，不会导致 429 错误
        // 因此手动刷新可以随时执行

        // 显示加载状态
        if (isManualRefresh) {
            const refreshBtn = this.creditContainer.querySelector('.credit-refresh-btn');
            if (refreshBtn) {
                refreshBtn.textContent = this.t('refreshing');
                refreshBtn.disabled = true;
            }
        } else {
            this.creditContainer.innerHTML = `<div class="trust-level-loading">${this.t('loadingCredits')}</div>`;
        }

        try {
            // 使用 GM_xmlhttpRequest 获取用户信息
            const userData = await this.fetchCreditUserInfo();

            if (!userData) {
                this.renderCreditError('请先登录 credit.linux.do', true);
                return;
            }

            // 获取每日统计
            const dailyStats = await this.fetchCreditDailyStats();

            // 获取排行榜数据（明日积分）
            const leaderboardData = await this.fetchLeaderboardData();

            // 缓存数据
            Storage.set('creditCachedData', { userData, dailyStats, leaderboardData });
            Storage.set('lastCreditFetch', now);

            // 渲染数据
            this.renderCreditInfo(userData, dailyStats, leaderboardData);

        } catch (error) {
            console.error('加载 Credit 信息失败:', error);
            this.renderCreditError('加载失败，请稍后重试');
        }
    }

    // 获取 Credit 用户信息
    fetchCreditUserInfo() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://credit.linux.do/api/v1/oauth/user-info',
                anonymous: false,
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'Referer': 'https://credit.linux.do/home',
                    'Origin': 'https://credit.linux.do'
                },
                onload: (response) => {
                    console.log('[Credit] API 响应状态:', response.status);
                    if (response.status === 200) {
                        try {
                            const json = JSON.parse(response.responseText);
                            if (json && json.data) {
                                resolve(json.data);
                                return;
                            }
                        } catch (e) {
                            console.error('Credit API 解析错误:', e);
                        }
                    } else if (response.status === 401 || response.status === 403) {
                        console.log('[Credit] 未登录或无权限');
                        resolve(null);
                        return;
                    }
                    resolve(null);
                },
                onerror: (error) => {
                    console.error('Credit API 请求错误:', error);
                    // 不reject，而是resolve(null)让上层处理
                    resolve(null);
                },
                ontimeout: () => {
                    console.error('Credit API 请求超时');
                    resolve(null);
                }
            });
        });
    }

    // 获取 Credit 每日统计
    fetchCreditDailyStats() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://credit.linux.do/api/v1/dashboard/stats/daily?days=7',
                anonymous: false,
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'Referer': 'https://credit.linux.do/home',
                    'Origin': 'https://credit.linux.do'
                },
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const json = JSON.parse(response.responseText);
                            if (json && json.data && Array.isArray(json.data)) {
                                resolve(json.data);
                                return;
                            }
                        } catch (e) {
                            console.error('Credit 每日统计解析错误:', e);
                        }
                    }
                    resolve([]);
                },
                onerror: () => resolve([]),
                ontimeout: () => resolve([])
            });
        });
    }

    // 获取排行榜数据（当前点数、排名、昨日点数）
    fetchLeaderboardData() {
        return new Promise((resolve) => {
            // 检查是否在 429 冷却期
            const now = Date.now();
            const leaderboard429Until = Storage.get('leaderboard429Until', 0);
            if (leaderboard429Until > now) {
                const remainMinutes = Math.ceil((leaderboard429Until - now) / 60000);
                console.log(`[Leaderboard] 429 冷却期中，剩余 ${remainMinutes} 分钟`);
                // 返回缓存的数据
                const cachedLeaderboard = Storage.get('cachedLeaderboardData', null);
                resolve(cachedLeaderboard);
                return;
            }

            let got429 = false;

            // 并行获取日榜排名和总榜积分
            Promise.all([
                // 日榜：获取今日排名和今日积分
                fetch('https://linux.do/leaderboard/1?period=daily', {
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                }).then(r => {
                    if (r.status === 429) {
                        got429 = true;
                        return null;
                    }
                    return r.ok ? r.json() : null;
                }).catch(() => null),

                // 总榜：获取总积分（当前点数）
                fetch('https://linux.do/leaderboard/1?period=all', {
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                }).then(r => {
                    if (r.status === 429) {
                        got429 = true;
                        return null;
                    }
                    return r.ok ? r.json() : null;
                }).catch(() => null)
            ])
            .then(([dailyData, allTimeData]) => {
                // 如果检测到 429，设置 30 分钟冷却期
                if (got429) {
                    const cooldownUntil = Date.now() + 30 * 60 * 1000;
                    Storage.set('leaderboard429Until', cooldownUntil);
                    console.warn('[Leaderboard] 检测到 429 错误，已设置 30 分钟冷却期');
                }
                let dailyScore = 0;  // 今日积分（昨日点数）
                let totalCredits = 0;
                let totalRank = 0;   // 总榜排名

                // 从日榜获取今日积分
                if (dailyData && dailyData.personal && dailyData.personal.user) {
                    dailyScore = dailyData.personal.user.total_score || 0;
                }

                // 从总榜获取总积分（当前点数）和总榜排名
                if (allTimeData && allTimeData.personal && allTimeData.personal.user) {
                    totalCredits = allTimeData.personal.user.total_score || 0;
                    totalRank = allTimeData.personal.position || allTimeData.personal.user.position || 0;
                }

                if (totalRank || totalCredits) {
                    const result = {
                        totalCredits: totalCredits,  // 总榜积分（当前点数）
                        rank: totalRank,             // 总榜排名（与当前点数匹配）
                        dailyScore: dailyScore       // 日榜今日积分（昨日点数）
                    };
                    // 缓存成功获取的数据
                    Storage.set('cachedLeaderboardData', result);
                    resolve(result);
                } else {
                    // 如果获取失败，返回缓存数据
                    const cachedLeaderboard = Storage.get('cachedLeaderboardData', null);
                    resolve(cachedLeaderboard);
                }
            })
            .catch(error => {
                console.error('获取排行榜数据失败:', error);
                resolve(null);
            });
        });
    }

    // 渲染 Credit 信息
    renderCreditInfo(userData, dailyStats, leaderboardData = null) {
        const credits = userData.available_balance || '0';
        const communityBalance = userData.community_balance || '0';
        const dailyLimit = userData.remain_quota || '0';
        const incomeTotal = userData.total_receive || '0';
        const expenseTotal = userData.total_payment || '0';
        const username = userData.nickname || userData.username || 'User';

        // 处理每日统计
        let incomeList = [];
        let expenseList = [];
        if (dailyStats && dailyStats.length > 0) {
            dailyStats.forEach(item => {
                const date = item.date.substring(5).replace('-', '/');
                const income = parseFloat(item.income) || 0;
                const expense = parseFloat(item.expense) || 0;
                // income 不为0时都显示在收入列表，正数绿色带+，负数红色
                if (income !== 0) {
                    incomeList.push({
                        date,
                        amount: income > 0 ? '+' + income.toFixed(2) : income.toFixed(2),
                        isNegative: income < 0
                    });
                }
                if (expense > 0) expenseList.push({ date, amount: '-' + expense.toFixed(2) });
            });
            incomeList.reverse();
            expenseList.reverse();
        }

        const updateTime = new Date().toLocaleTimeString(this.language === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' });

        let html = `
            <div class="trust-level-header">
                <span>💰 ${this.escapeHtml(username)} ${this.t('userCredits')}</span>
                <button class="trust-level-refresh credit-refresh-btn" data-action="refresh-credit">${this.t('refresh')}</button>
            </div>
            <div class="credit-main-stat">
                <span class="credit-stat-label">${this.t('creditAvailable')}</span>
                <span class="credit-stat-value">${this.escapeHtml(credits)}</span>
            </div>
        `;

        // 明日积分（最醒目）、当前点数、昨日点数
        if (leaderboardData) {
            // 明日积分 = 总榜积分 - 社区积分
            const tomorrowCredits = (leaderboardData.totalCredits - communityBalance).toFixed(0);
            html += `
            <div class="credit-main-stat" style="background: linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.2) 100%); border: 1px solid rgba(255,215,0,0.4);">
                <span class="credit-stat-label">${this.t('creditTomorrow')}</span>
                <span class="credit-stat-value" style="font-size: 28px; color: #ffd700; text-shadow: 0 2px 8px rgba(255,215,0,0.5);">${this.escapeHtml(tomorrowCredits)}</span>
            </div>
            <div class="trust-level-item">
                <span class="trust-level-name">${this.t('creditCurrentPoints')}</span>
                <span class="trust-level-value" style="color: #ffd700; font-weight: bold;">${this.escapeHtml(leaderboardData.totalCredits)} <span style="color: #87ceeb; font-weight: normal;">${this.t('creditRankLabel')}#${this.escapeHtml(leaderboardData.rank)}</span></span>
            </div>
            <div class="trust-level-item">
                <span class="trust-level-name">${this.t('creditYesterdayPoints')}</span>
                <span class="trust-level-value" style="color: #7dffb3; font-weight: bold;">${this.escapeHtml(communityBalance)}</span>
            </div>
            `;
        }

        html += `
            <div class="trust-level-item">
                <span class="trust-level-name">${this.t('creditDailyLimit')}</span>
                <span class="trust-level-value" style="color: #fff;">${this.escapeHtml(dailyLimit)}</span>
            </div>
            <div class="trust-level-item">
                <span class="trust-level-name">${this.t('creditTotalIncome')}</span>
                <span class="trust-level-value" style="color: #7dffb3;">+${this.escapeHtml(incomeTotal)}</span>
            </div>
            <div class="trust-level-item">
                <span class="trust-level-name">${this.t('creditTotalExpense')}</span>
                <span class="trust-level-value" style="color: #ff9999;">-${this.escapeHtml(expenseTotal)}</span>
            </div>
        `;

        // 近7天收入（包含正负变动）
        if (incomeList.length > 0) {
            html += `<div class="credit-section-title">${this.t('creditRecentIncome')}</div>`;
            incomeList.slice(0, 5).forEach(item => {
                const color = item.isNegative ? '#ff9999' : '#7dffb3';
                const note = item.isNegative ? ' (社区点数倒退扣除)' : '';
                html += `
                    <div class="trust-level-item">
                        <span class="trust-level-name">${this.escapeHtml(item.date)}${note}</span>
                        <span class="trust-level-value" style="color: ${color};">${this.escapeHtml(item.amount)}</span>
                    </div>
                `;
            });
        }

        // 近7天支出
        if (expenseList.length > 0) {
            html += `<div class="credit-section-title">${this.t('creditRecentExpense')}</div>`;
            expenseList.slice(0, 3).forEach(item => {
                html += `
                    <div class="trust-level-item">
                        <span class="trust-level-name">${this.escapeHtml(item.date)}</span>
                        <span class="trust-level-value" style="color: #ff9999;">${this.escapeHtml(item.amount)}</span>
                    </div>
                `;
            });
        }

        html += `
            <div class="credit-footer">
                <a href="https://credit.linux.do/home" target="_blank" class="credit-link">${this.t('creditViewDetails')}</a>
                <span class="credit-update-time">${this.t('update')}: ${this.escapeHtml(updateTime)}</span>
            </div>
        `;

        this.creditContainer.innerHTML = html;

        // 添加刷新按钮事件
        setTimeout(() => {
            const refreshBtn = this.creditContainer.querySelector('.credit-refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadCreditInfo(true);
                });
            }
        }, 100);
    }

    // 渲染 Credit 错误
    renderCreditError(message, showLogin = false) {
        let html = `
            <div class="trust-level-header">
                <span>💰 ${this.t('sectionCredit')}</span>
                <button class="trust-level-refresh credit-refresh-btn" data-action="refresh-credit">${this.t('refresh')}</button>
            </div>
            <div class="trust-level-loading">${this.escapeHtml(message)}</div>
        `;

        if (showLogin) {
            html += `
                <div class="credit-footer">
                    <a href="https://credit.linux.do" target="_blank" class="credit-login-btn">${this.t('creditGoLogin')}</a>
                </div>
            `;
        }

        this.creditContainer.innerHTML = html;

        // 添加刷新按钮事件
        setTimeout(() => {
            const refreshBtn = this.creditContainer.querySelector('.credit-refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadCreditInfo(true);
                });
            }
        }, 100);
    }

    // ========== CDK 分数功能 ==========

    // 加载 CDK 分数信息
    async loadCdkInfo(isManualRefresh = false) {
        if (!this.cdkContainer) return;

        // 显示加载状态
        if (isManualRefresh) {
            const refreshBtn = this.cdkContainer.querySelector('.cdk-refresh-btn');
            if (refreshBtn) {
                refreshBtn.textContent = this.t('refreshing');
                refreshBtn.disabled = true;
            }
        } else {
            this.cdkContainer.innerHTML = `<div class="trust-level-loading">${this.t('loadingCdk')}</div>`;
        }

        try {
            const cdkData = await this.fetchCdkUserInfo();
            if (!cdkData) {
                this.renderCdkError(this.t('cdkNotAuth'), true);
                return;
            }

            this.renderCdkInfo(cdkData);

        } catch (error) {
            console.error('加载 CDK 信息失败:', error);
            this.renderCdkError(this.t('loadFailed'));
        }
    }

    // ========== CDK Bridge 机制 ==========
    // 初始化 CDK Bridge（创建隐藏 iframe 和消息监听）
    ensureCdkBridge() {
        if (this.cdkBridgeInit) return;
        this.cdkBridgeInit = true;
        this.cdkWaiters = [];

        // 监听来自 iframe 的消息
        window.addEventListener('message', (event) => {
            if (event.origin !== 'https://cdk.linux.do') return;
            const payload = event.data?.payload || event.data;
            if (!payload?.data) return;

            console.log('[CDK] 收到 Bridge 数据:', payload.data);

            // 缓存数据
            GM_setValue('lda_cdk_cache', { data: payload.data, ts: Date.now() });

            // 通知所有等待者
            const waiters = [...this.cdkWaiters];
            this.cdkWaiters = [];
            waiters.forEach(fn => fn(payload.data));
        });

        // 创建隐藏 iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'lda-cdk-bridge';
        iframe.src = 'https://cdk.linux.do/dashboard';
        iframe.style.cssText = 'width:0;height:0;opacity:0;position:absolute;border:0;pointer-events:none;';
        document.body.appendChild(iframe);
        this.cdkBridgeFrame = iframe;
    }

    // 通过 Bridge 获取 CDK 数据
    fetchCdkViaBridge() {
        return new Promise((resolve, reject) => {
            this.ensureCdkBridge();

            const timer = setTimeout(() => {
                this.cdkWaiters = this.cdkWaiters.filter(fn => fn !== done);
                reject(new Error('CDK bridge timeout'));
            }, 8000);

            const done = (data) => {
                clearTimeout(timer);
                resolve(data);
            };

            this.cdkWaiters.push(done);

            // 请求 iframe 刷新数据
            try {
                this.cdkBridgeFrame?.contentWindow?.postMessage({ type: 'lda-cdk-request' }, 'https://cdk.linux.do');
            } catch (_) { }
        });
    }

    // 检查 GM 缓存是否新鲜（5分钟内有效）
    isCdkCacheFresh() {
        const cache = GM_getValue('lda_cdk_cache', null);
        if (!cache || !cache.data || !cache.ts) return false;
        return (Date.now() - cache.ts) < 5 * 60 * 1000;
    }

    // 获取 CDK 用户信息（先尝试直接请求，失败则使用 Bridge）
    // 返回格式: { user: {...}, received: {...} } 或旧格式 {...用户数据}
    async fetchCdkUserInfo() {
        // 1. 先检查 GM 缓存
        const cache = GM_getValue('lda_cdk_cache', null);
        if (cache && cache.data && cache.ts && (Date.now() - cache.ts) < 5 * 60 * 1000) {
            console.log('[CDK] 使用 GM 缓存数据');
            // 兼容新旧格式：新格式有 user 字段，旧格式直接是用户数据
            return cache.data;
        }

        // 2. 尝试直接请求（可能被 Cloudflare 拦截）
        try {
            const directResult = await this.fetchCdkDirect();
            if (directResult) {
                console.log('[CDK] 直接请求成功');
                // 直接请求只能获取用户信息，包装成新格式
                const cacheData = { user: directResult, received: null };
                GM_setValue('lda_cdk_cache', { data: cacheData, ts: Date.now() });
                return cacheData;
            }
        } catch (e) {
            console.log('[CDK] 直接请求失败，尝试 Bridge 方式:', e.message);
        }

        // 3. 使用 iframe Bridge 方式（可同时获取用户信息和领取记录）
        try {
            const bridgeResult = await this.fetchCdkViaBridge();
            if (bridgeResult) {
                console.log('[CDK] Bridge 请求成功');
                return bridgeResult;
            }
        } catch (e) {
            console.log('[CDK] Bridge 请求失败:', e.message);
        }

        // 4. 最后检查是否有旧缓存可用
        if (cache && cache.data) {
            console.log('[CDK] 使用旧缓存数据');
            return cache.data;
        }

        return null;
    }

    // 直接请求 CDK API
    fetchCdkDirect() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://cdk.linux.do/api/v1/oauth/user-info',
                anonymous: false,
                timeout: 10000,
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                onload: (response) => {
                    // 检查是否是 Cloudflare 拦截页面
                    if (response.responseText && response.responseText.includes('Just a moment')) {
                        reject(new Error('Cloudflare challenge'));
                        return;
                    }

                    if (response.status === 401 || response.status === 403) {
                        resolve(null);
                        return;
                    }

                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const json = JSON.parse(response.responseText);
                            if (json && json.data) {
                                resolve(json.data);
                                return;
                            }
                            if (json && (json.username || json.score !== undefined)) {
                                resolve(json);
                                return;
                            }
                        } catch (e) {
                            reject(new Error('JSON parse error'));
                            return;
                        }
                    }

                    resolve(null);
                },
                onerror: (error) => {
                    reject(error);
                },
                ontimeout: () => {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 获取 CDK 领取记录
    fetchCdkReceived() {
        return new Promise((resolve, reject) => {
            // 先尝试通过 Bridge 方式获取（如果已初始化）
            // 因为 CDK 领取记录 API 也可能被 Cloudflare 拦截
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://cdk.linux.do/api/v1/projects/received?current=1&size=20&search=',
                anonymous: false,
                withCredentials: true,
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Referer': 'https://cdk.linux.do/received'
                },
                onload: (response) => {
                    console.log('[CDK] 领取记录响应状态:', response.status);

                    // 检查是否是 Cloudflare 拦截页面
                    if (response.responseText && response.responseText.includes('Just a moment')) {
                        console.log('[CDK] 领取记录被 Cloudflare 拦截');
                        resolve({ total: 0, results: [], cloudflareBlocked: true });
                        return;
                    }

                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const json = JSON.parse(response.responseText);
                            console.log('[CDK] 领取记录解析成功:', json);
                            if (json && json.data) {
                                resolve({
                                    total: json.data.total || 0,
                                    results: json.data.results || []
                                });
                                return;
                            }
                            // 如果 data 为空但有 error_msg
                            if (json && json.error_msg === '') {
                                resolve({ total: 0, results: [] });
                                return;
                            }
                        } catch (e) {
                            console.error('[CDK] 解析领取记录失败:', e, response.responseText?.substring(0, 200));
                        }
                    } else {
                        console.error('[CDK] 领取记录请求失败，状态码:', response.status);
                    }

                    resolve({ total: 0, results: [] });
                },
                onerror: (error) => {
                    console.error('[CDK] 获取领取记录失败:', error);
                    resolve({ total: 0, results: [] });
                },
                ontimeout: () => {
                    console.error('[CDK] 获取领取记录超时');
                    resolve({ total: 0, results: [] });
                }
            });
        });
    }

    // 渲染 CDK 信息
    renderCdkInfo(cdkData) {
        // 兼容新旧数据格式
        // 新格式: { user: {...}, received: {...} }
        // 旧格式: { score, username, ... }
        const userData = cdkData.user || cdkData;
        const receivedData = cdkData.received || null;

        const score = userData.score || 0;
        const trustLevel = userData.trust_level ?? userData.trustLevel ?? '-';
        const username = userData.username || '-';
        const nickname = userData.nickname || userData.name || username;

        const updateTime = new Date().toLocaleTimeString(this.language === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' });

        let html = `
            <div class="trust-level-header">
                <span>🎮 ${this.t('cdkScore')}</span>
                <button class="trust-level-refresh cdk-refresh-btn" data-action="refresh-cdk">${this.t('refresh')}</button>
            </div>
            <div class="credit-main-stat" style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.15);">
                <span class="credit-stat-label" style="color: rgba(255,255,255,0.7);">${this.t('cdkScore')}</span>
                <span class="credit-stat-value" style="font-size: 36px; color: #22d3ee; text-shadow: 0 0 10px rgba(34, 211, 238, 0.5); font-weight: bold;">${this.escapeHtml(score)}</span>
            </div>
            <div class="trust-level-item">
                <span class="trust-level-name">${this.t('cdkTrustLevel')}</span>
                <span class="trust-level-value" style="color: #22d3ee; font-weight: bold;">Lv${this.escapeHtml(trustLevel)}</span>
            </div>
            <div class="trust-level-item">
                <span class="trust-level-name">${this.t('cdkUsername')}</span>
                <span class="trust-level-value" style="color: #fff;">${this.escapeHtml(username)}</span>
            </div>
            <div class="trust-level-item">
                <span class="trust-level-name">${this.t('cdkNickname')}</span>
                <span class="trust-level-value" style="color: #fff;">${this.escapeHtml(nickname)}</span>
            </div>
            <div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 8px; padding: 6px 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                💡 ${this.t('cdkScoreDesc')}
            </div>

            <!-- 我的领取区域（最近20条） -->
            <div class="cdk-received-section" style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
                <div class="trust-level-header" style="margin-bottom: 8px;">
                    <span>📦 ${this.t('cdkMyReceived')} <span style="font-size: 10px; color: rgba(255,255,255,0.5);">(${this.t('cdkRecentLimit')})</span></span>
                    <button class="trust-level-refresh cdk-received-refresh-btn" style="font-size: 10px; padding: 2px 6px;">${this.t('refresh')}</button>
                </div>
                <div id="cdk-received-list" style="font-size: 11px; color: rgba(255,255,255,0.7);">
                    ${this.t('cdkLoadingReceived')}
                </div>
            </div>

            <div class="credit-footer">
                <a href="https://cdk.linux.do/dashboard" target="_blank" class="credit-link">${this.t('detailInfo')}</a>
                <span class="credit-update-time">${this.t('update')}: ${this.escapeHtml(updateTime)}</span>
            </div>
        `;

        this.cdkContainer.innerHTML = html;

        // 添加刷新按钮事件
        setTimeout(() => {
            const refreshBtn = this.cdkContainer.querySelector('.cdk-refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadCdkInfo(true);
                });
            }

            // 添加领取记录刷新按钮事件
            const receivedRefreshBtn = this.cdkContainer.querySelector('.cdk-received-refresh-btn');
            if (receivedRefreshBtn) {
                receivedRefreshBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadCdkReceived();
                });
            }
        }, 100);

        // 如果已有缓存的领取记录，直接渲染；否则显示加载中并异步加载
        if (receivedData) {
            console.log('[CDK] 使用缓存的领取记录');
            this.renderCdkReceived(receivedData);
        } else {
            console.log('[CDK] 领取记录未缓存，尝试加载');
            this.loadCdkReceived();
        }
    }

    // 加载并渲染 CDK 领取记录
    async loadCdkReceived() {
        const listContainer = document.getElementById('cdk-received-list');
        if (!listContainer) return;

        listContainer.innerHTML = `<div style="text-align: center; padding: 10px; color: rgba(255,255,255,0.5);">${this.t('cdkLoadingReceived')}</div>`;

        try {
            // 1. 先检查 GM 缓存中是否有领取记录
            const cache = GM_getValue('lda_cdk_cache', null);
            if (cache && cache.data && cache.data.received && cache.ts && (Date.now() - cache.ts) < 5 * 60 * 1000) {
                console.log('[CDK] 使用缓存的领取记录');
                this.renderCdkReceived(cache.data.received);
                return;
            }

            // 2. 尝试通过 Bridge 刷新数据
            try {
                const bridgeResult = await this.fetchCdkViaBridge();
                if (bridgeResult && bridgeResult.received) {
                    console.log('[CDK] 通过 Bridge 获取到领取记录');
                    this.renderCdkReceived(bridgeResult.received);
                    return;
                }
            } catch (e) {
                console.log('[CDK] Bridge 获取领取记录失败:', e.message);
            }

            // 3. 最后尝试直接请求（可能被 Cloudflare 拦截）
            const data = await this.fetchCdkReceived();
            if (data.cloudflareBlocked) {
                // 被 Cloudflare 拦截，显示提示
                listContainer.innerHTML = `<div style="text-align: center; padding: 10px; color: rgba(255,255,255,0.5);">
                    ${this.t('cdkReceivedEmpty')}<br>
                    <span style="font-size: 9px; color: rgba(255,255,255,0.4);">💡 请先访问 cdk.linux.do 刷新数据</span>
                </div>`;
                return;
            }
            this.renderCdkReceived(data);
        } catch (e) {
            console.error('[CDK] 加载领取记录失败:', e);
            listContainer.innerHTML = `<div style="text-align: center; padding: 10px; color: rgba(255,255,255,0.5);">${this.t('cdkReceivedEmpty')}</div>`;
        }
    }

    // 渲染 CDK 领取记录
    renderCdkReceived(data) {
        const listContainer = document.getElementById('cdk-received-list');
        if (!listContainer) return;

        const { total, results } = data;

        if (!results || results.length === 0) {
            listContainer.innerHTML = `<div style="text-align: center; padding: 10px; color: rgba(255,255,255,0.5);">${this.t('cdkReceivedEmpty')}</div>`;
            return;
        }

        // 只显示最近20条
        const displayResults = results.slice(0, 20);
        const displayCount = Math.min(total, 20);
        const totalText = this.t('cdkTotal').replace('{count}', displayCount);

        let html = `
            <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">${totalText}</div>
            <div class="cdk-received-items" style="max-height: 200px; overflow-y: auto;">
        `;

        displayResults.forEach((item, index) => {
            const projectName = this.escapeHtml(item.project_name || '-');
            const creator = this.escapeHtml(item.project_creator_nickname || item.project_creator || '-');
            const content = this.escapeHtml(item.content || '-');
            const receivedAt = item.received_at ? new Date(item.received_at).toLocaleString(this.language === 'zh' ? 'zh-CN' : 'en-US', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }) : '-';

            html += `
                <div class="cdk-received-item" style="background: rgba(255,255,255,0.05); border-radius: 6px; padding: 8px; margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.08);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-weight: 600; color: #22d3ee; font-size: 11px;">${projectName}</span>
                        <span style="font-size: 9px; color: rgba(255,255,255,0.4);">${receivedAt}</span>
                    </div>
                    <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 4px;">
                        ${this.t('cdkCreator')}: ${creator}
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px;">
                        <code style="flex: 1; font-size: 11px; color: #fbbf24; word-break: break-all; font-family: monospace;">${content}</code>
                        <button class="cdk-copy-btn" data-content="${content}" style="
                            background: rgba(34, 211, 238, 0.2);
                            border: 1px solid rgba(34, 211, 238, 0.3);
                            color: #22d3ee;
                            padding: 2px 8px;
                            border-radius: 4px;
                            font-size: 10px;
                            cursor: pointer;
                            white-space: nowrap;
                            transition: all 0.2s;
                        ">${this.t('cdkCopy')}</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        listContainer.innerHTML = html;

        // 添加复制按钮事件
        const copyBtns = listContainer.querySelectorAll('.cdk-copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const content = btn.getAttribute('data-content');
                try {
                    await navigator.clipboard.writeText(content);
                    const originalText = btn.textContent;
                    btn.textContent = this.t('cdkCopied');
                    btn.style.background = 'rgba(34, 197, 94, 0.3)';
                    btn.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                    btn.style.color = '#22c55e';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = 'rgba(34, 211, 238, 0.2)';
                        btn.style.borderColor = 'rgba(34, 211, 238, 0.3)';
                        btn.style.color = '#22d3ee';
                    }, 1500);
                } catch (err) {
                    console.error('[CDK] 复制失败:', err);
                }
            });
        });
    }

    // 渲染 CDK 错误
    renderCdkError(message, showLogin = false) {
        let html = `
            <div class="trust-level-header">
                <span>🎮 ${this.t('cdkScore')}</span>
                <button class="trust-level-refresh cdk-refresh-btn" data-action="refresh-cdk">${this.t('refresh')}</button>
            </div>
            <div class="trust-level-loading">${this.escapeHtml(message)}</div>
        `;

        if (showLogin) {
            html += `
                <div style="text-align: center; margin-top: 10px;">
                    <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 8px;">${this.t('cdkAuthTip')}</div>
                    <a href="https://cdk.linux.do" target="_blank" class="credit-login-btn" style="background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);">${this.t('cdkGoAuth')}</a>
                </div>
            `;
        }

        this.cdkContainer.innerHTML = html;

        // 添加刷新按钮事件
        setTimeout(() => {
            const refreshBtn = this.cdkContainer.querySelector('.cdk-refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadCdkInfo(true);
                });
            }
        }, 100);
    }

    // HTML 转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }
}

// 初始化
(function() {
    // 在 cdk.linux.do 上不初始化控制面板，只执行 bridge 逻辑
    if (window.location.hostname === 'cdk.linux.do') {
        console.log('[CDK] 在 CDK 页面上跳过面板初始化');
        return;
    }
    window.browseController = new BrowseController();
})();
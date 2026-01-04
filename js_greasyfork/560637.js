// ==UserScript==
// @name        linux.do 小助手（水果二创版）
// @description 自动浏览、点赞、只看楼主、楼层号、保存帖子到本地、清爽模式、黑白灰模式、用户信息展示（批量展示）、查看用户话题。支持拖动和最小化控制面板（50×50圆形图标，统一边距，左右展开方向优化）。支持 linux.do 和 idcflare.com
// @namespace    https://example.com/userscripts
// @match       https://linux.do/*
// @match       https://idcflare.com/*
// @grant       GM_xmlhttpRequest
// @connect     connect.linux.do
// @connect     linux.do
// @connect     *
// @version     1.6.0
// @author      quantumcat & nulluser & enhanced & idear
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/560637/linuxdo%20%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B0%B4%E6%9E%9C%E4%BA%8C%E5%88%9B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560637/linuxdo%20%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B0%B4%E6%9E%9C%E4%BA%8C%E5%88%9B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// 获取当前站点域名
const CURRENT_DOMAIN = window.location.hostname;
const BASE_URL = `https://${CURRENT_DOMAIN}`;

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

        // 使用 sessionStorage 存储窗口独立的状态
        this.accumulatedTime = this.getSessionStorage('accumulatedTime', 0);
        this.lastActionTime = Date.now();
        this.isTopicPage = window.location.href.includes("/t/topic/");
        this.autoRunning = this.getSessionStorage('autoRunning', false);
        this.topicList = this.getSessionStorage('topicList', []);

        // 使用 localStorage 存储全局共享的状态
        this.firstUseChecked = Storage.get('firstUseChecked', false);
        this.likesCount = Storage.get('likesCount', 0);
        this.selectedPost = Storage.get('selectedPost', null);
        this.autoLikeEnabled = Storage.get('autoLikeEnabled', false);
        this.quickLikeEnabled = Storage.get('quickLikeEnabled', false);
        this.cleanModeEnabled = Storage.get('cleanModeEnabled', false);
        this.grayscaleModeEnabled = Storage.get('grayscaleModeEnabled', false);
        this.readUnreadEnabled = Storage.get('readUnreadEnabled', false);
        this.likedTopics = Storage.get('likedTopics', []);
        this.quickLikedFloors = Storage.get('quickLikedFloors', {}); // 记录快速点赞过的楼层 {topicId: [floor1, floor2...]}
        this.panelMinimized = Storage.get('panelMinimized', false);
        this.panelPosition = Storage.get('panelPosition', { x: null, y: null });
        this.likeResumeTime = Storage.get('likeResumeTime', null);
        this.panelTheme = Storage.get('panelTheme', { color1: '#667eea', color2: '#764ba2' }); // 主题颜色
        this.currentUsername = null; // 当前用户名
        this.lastDetectedUser = null; // 上次检测到的用户名（用于账号切换检测）
        this.readTopics = []; // 当前用户的已阅读帖子列表，初始化后会加载
        this.justDragged = false; // 标记是否刚拖动完，防止拖动后误触发点击事件

        // 检查是否到达恢复点赞的时间
        this.checkLikeResumeTime();
        // 监听点赞限制弹窗
        this.observeLikeLimit();

        this.setupButton();
        this.loadUserTrustLevel(); // 加载用户信任等级
        this.loadUserReadHistory(); // 加载当前用户的阅读历史
        this.startUserSwitchMonitoring(); // 启动账号切换监控
        this.initFloorNumberDisplay();
        this.setupWindowResizeHandler(); // 设置窗口大小调整处理
        this.applyCleanModeStyles();
        this.applyGrayscaleModeStyles();
        this.initOnlyOwnerView();

        if (!this.firstUseChecked) {
            this.handleFirstUse();
        } else if (this.autoRunning) {
            if (this.isTopicPage) {
                this.startScrolling();
                if (this.autoLikeEnabled) {
                    this.autoLikeTopic();
                }
            } else {
                this.getLatestTopics().then(() => this.navigateNextTopic());
            }
        }

        // 启动导航守护程序 - 防止卡住
        this.startNavigationGuard();

        // 初始化用户信息助手 - 默认启用，让每个窗口独立工作
        this.userInfoHelper = new UserInfoHelper();

        // 启动等级监控（60秒刷新一次）- 默认启用
        this.startTrustLevelMonitor();

        // 监听URL变化，更新文章页功能显示状态
        this.startUrlChangeMonitor();
    }

    // 启动等级监控（60秒刷新一次）
    startTrustLevelMonitor() {
        // 如果已经有定时器在运行，先清除
        if (this.trustLevelMonitorInterval) {
            clearInterval(this.trustLevelMonitorInterval);
        }

        this.trustLevelMonitorInterval = setInterval(() => {
            console.log('自动刷新等级信息...');
            this.loadUserTrustLevel(false);
        }, 60000); // 60秒

        console.log('等级监控已启动（60秒刷新一次）');
    }

    // 停止等级监控
    stopTrustLevelMonitor() {
        if (this.trustLevelMonitorInterval) {
            clearInterval(this.trustLevelMonitorInterval);
            this.trustLevelMonitorInterval = null;
            console.log('等级监控已停止');
        }
    }

    // 启动URL变化监控
    startUrlChangeMonitor() {
        let lastUrl = window.location.href;
        
        setInterval(() => {
            const currentUrl = window.location.href;
            
            if (currentUrl !== lastUrl) {
                console.log('检测到URL变化:', lastUrl, '->', currentUrl);
                lastUrl = currentUrl;
                
                // 更新isTopicPage状态
                const newIsTopicPage = currentUrl.includes('/t/topic/');
                
                if (newIsTopicPage !== this.isTopicPage) {
                    this.isTopicPage = newIsTopicPage;
                    console.log('页面类型变化:', this.isTopicPage ? '文章页' : '非文章页');
                    
                    // 更新文章页功能按钮的显示状态
                    this.updateArticlePageButtons();
                }
            }
        }, 1000); // 每秒检查一次
    }

    // 更新文章页功能按钮显示状态
    updateArticlePageButtons() {
        if (this.randomBtn) {
            this.randomBtn.style.display = this.isTopicPage ? 'flex' : 'none';
        }
        if (this.revealUsersBtn) {
            this.revealUsersBtn.style.display = this.isTopicPage ? 'flex' : 'none';
        }
        console.log('文章页按钮状态已更新:', this.isTopicPage ? '显示' : '隐藏');
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
            }

            .trust-level-name {
                flex: 1;
                margin-right: 8px;
                white-space: nowrap;
            }

            .trust-level-progress {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .trust-level-bar {
                width: 60px;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
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
                min-width: 50px;
                text-align: right;
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
        minimizedIcon.textContent = "助手";
        minimizedIcon.title = "点击展开控制面板";

        // 创建面板头部
        const header = document.createElement("div");
        header.className = "panel-header";
        header.innerHTML = `
            <span class="panel-title">📚 Linux.do 助手</span>
            <div class="panel-controls">
                <button class="panel-control-btn minimize-btn" title="最小化">─</button>
            </div>
        `;

        // 创建面板内容区
        const content = document.createElement("div");
        content.className = "panel-content";
        if (this.panelMinimized) {
            content.classList.add('hidden');
        }

        // 主按钮
        this.button = document.createElement("button");
        this.button.className = "main-action-btn" + (this.autoRunning ? " running" : "");
        this.button.innerHTML = this.autoRunning
            ? '<span class="btn-icon">⏸</span><span class="btn-text">停止阅读</span>'
            : '<span class="btn-icon">▶</span><span class="btn-text">开始阅读</span>';
        this.button.addEventListener("click", () => this.handleButtonClick());

        // 随机楼层按钮
        this.randomBtn = document.createElement("button");
        this.randomBtn.className = "random-floor-btn";
        this.randomBtn.innerHTML = '<span class="btn-icon">🎲</span><span class="btn-text">随机楼层</span>';
        this.randomBtn.addEventListener("click", () => this.randomJump());
        this.randomBtn.style.display = this.isTopicPage ? 'flex' : 'none';
        this.randomBtn.title = '随机跳转到某个楼层（抽奖用）';

        // 批量展示用户信息按钮
        this.revealUsersBtn = document.createElement("button");
        this.revealUsersBtn.className = "reveal-users-btn";
        this.revealUsersBtn.innerHTML = '<span class="btn-icon">📊</span><span class="btn-text">批量展示信息</span>';
        this.revealUsersBtn.addEventListener("click", () => this.handleRevealUsersClick());
        this.revealUsersBtn.style.display = this.isTopicPage ? 'flex' : 'none';
        this.revealUsersBtn.title = '批量展示当前页面所有已加载回复的用户信息';

        // 自动点赞开关
        const autoLikeRow = this.createToggleRow(
            "👍 自动点赞主题",
            this.autoLikeEnabled,
            (checked) => {
                // 检查是否在冷却期
                if (checked && this.likeResumeTime && Date.now() < this.likeResumeTime) {
                    const now = Date.now();
                    const remainingHours = Math.ceil((this.likeResumeTime - now) / (1000 * 60 * 60));
                    const resumeDate = new Date(this.likeResumeTime);
                    this.showNotification(`点赞功能冷却中，将在 ${resumeDate.toLocaleTimeString()} 恢复`);
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
            "⚡ 快速点赞回复",
            this.quickLikeEnabled,
            (checked) => {
                // 检查是否在冷却期
                if (checked && this.likeResumeTime && Date.now() < this.likeResumeTime) {
                    const resumeDate = new Date(this.likeResumeTime);
                    this.showNotification(`点赞功能冷却中，将在 ${resumeDate.toLocaleTimeString()} 恢复`);

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

        // 清爽模式开关
        const cleanModeRow = this.createToggleRow(
            "✨ 清爽模式",
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
            "🎨 黑白灰模式",
            this.grayscaleModeEnabled,
            (checked) => {
                this.grayscaleModeEnabled = checked;
                Storage.set('grayscaleModeEnabled', this.grayscaleModeEnabled);
                console.log(`黑白灰模式: ${this.grayscaleModeEnabled ? '开启' : '关闭'}`);
                this.toggleGrayscaleMode();
            }
        );

        // 主题颜色选择器
        const themeColorRow = this.createThemeColorPicker();

        // 读取未读帖子开关
        const readUnreadRow = this.createToggleRow(
            "📬 读取未读帖子",
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

        // 清除点赞冷却按钮
        this.clearCooldownBtn = document.createElement("button");
        this.clearCooldownBtn.className = "reveal-users-btn";
        this.clearCooldownBtn.innerHTML = '<span class="btn-icon">🔥</span><span class="btn-text">清除点赞冷却</span>';
        this.clearCooldownBtn.addEventListener("click", () => this.handleClearCooldown());
        this.clearCooldownBtn.title = '清除点赞冷却时间，立即恢复点赞功能';
        this.clearCooldownBtn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

        // 信任等级显示容器
        this.trustLevelContainer = document.createElement("div");
        this.trustLevelContainer.className = "trust-level-row";
        this.trustLevelContainer.innerHTML = '<div class="trust-level-loading">加载等级信息...</div>';

        // 组装面板 - 按功能分类
        // 📖 自动阅读区（包含阅读按钮和相关设置）
        const autoSection = document.createElement("div");
        autoSection.className = "section-collapsible";
        autoSection.innerHTML = '<div class="section-title"><span class="collapse-icon">▼</span> 📖 自动阅读</div>';
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
        this.autoSectionContent.appendChild(autoLikeRow);
        this.autoSectionContent.appendChild(quickLikeRow);
        this.autoSectionContent.appendChild(this.clearCooldownBtn);
        this.autoSectionContent.appendChild(readUnreadRow);
        content.appendChild(this.autoSectionContent);

        // 自动阅读区折叠点击事件
        autoSection.addEventListener('click', () => {
            autoSection.classList.toggle('collapsed');
            this.autoSectionContent.classList.toggle('collapsed');
        });

        // ⚙️ 模式设置区（清爽模式、黑白灰模式，默认折叠）
        const settingsSection = document.createElement("div");
        settingsSection.className = "section-collapsible collapsed";
        settingsSection.innerHTML = '<div class="section-title"><span class="collapse-icon">▼</span> ⚙️ 模式设置</div>';
        content.appendChild(settingsSection);

        // 设置内容区（默认折叠）
        this.settingsSectionContent = document.createElement("div");
        this.settingsSectionContent.className = "section-collapsible-content collapsed";
        this.settingsSectionContent.appendChild(cleanModeRow);
        this.settingsSectionContent.appendChild(grayscaleModeRow);
        content.appendChild(this.settingsSectionContent);

        // 设置区折叠点击事件
        settingsSection.addEventListener('click', () => {
            settingsSection.classList.toggle('collapsed');
            this.settingsSectionContent.classList.toggle('collapsed');
        });

        // 🎨 主题颜色区（独立可折叠，默认折叠）
        const themeSection = document.createElement("div");
        themeSection.className = "section-collapsible collapsed";
        themeSection.innerHTML = '<div class="section-title"><span class="collapse-icon">▼</span> 🎨 主题颜色</div>';
        content.appendChild(themeSection);

        // 主题颜色内容区（默认折叠）
        this.themeSectionContent = document.createElement("div");
        this.themeSectionContent.className = "section-collapsible-content collapsed";
        this.themeSectionContent.appendChild(themeColorRow);
        content.appendChild(this.themeSectionContent);

        // 主题颜色区折叠点击事件
        themeSection.addEventListener('click', () => {
            themeSection.classList.toggle('collapsed');
            this.themeSectionContent.classList.toggle('collapsed');
        });

        // 📖 文章页功能区（只在文章页显示，默认折叠）
        this.toolSectionContainer = document.createElement("div");
        this.toolSectionContainer.className = "tool-section-container";

        const toolSection = document.createElement("div");
        toolSection.className = "section-collapsible collapsed";
        toolSection.innerHTML = '<div class="section-title"><span class="collapse-icon">▼</span> 📖 文章页功能</div>';
        this.toolSectionContainer.appendChild(toolSection);

        // 文章页功能内容区（默认折叠）
        this.toolSectionContent = document.createElement("div");
        this.toolSectionContent.className = "section-collapsible-content collapsed";
        this.toolSectionContent.appendChild(this.randomBtn);
        this.toolSectionContent.appendChild(this.revealUsersBtn);
        this.toolSectionContainer.appendChild(this.toolSectionContent);

        // 文章页功能区折叠点击事件
        toolSection.addEventListener('click', () => {
            toolSection.classList.toggle('collapsed');
            this.toolSectionContent.classList.toggle('collapsed');
        });

        content.appendChild(this.toolSectionContainer);

        // 📊 账号信息区（可折叠，默认折叠）
        const accountSection = document.createElement("div");
        accountSection.className = "section-collapsible collapsed";
        accountSection.innerHTML = '<div class="section-title"><span class="collapse-icon">▼</span> 📊 账号信息</div>';
        content.appendChild(accountSection);

        // 账号信息内容区（默认折叠）
        this.accountSectionContent = document.createElement("div");
        this.accountSectionContent.className = "section-collapsible-content collapsed";
        this.accountSectionContent.appendChild(this.trustLevelContainer);
        content.appendChild(this.accountSectionContent);

        // 账号信息区折叠点击事件
        accountSection.addEventListener('click', () => {
            accountSection.classList.toggle('collapsed');
            this.accountSectionContent.classList.toggle('collapsed');
        });

        this.container.appendChild(minimizedIcon);
        this.container.appendChild(header);
        this.container.appendChild(content);
        document.body.appendChild(this.container);

        // 应用保存的主题颜色
        this.applyTheme();

        // 添加拖动功能（只在展开状态可拖动）
        this.makeDraggable(header);

        // 添加最小化功能
        header.querySelector('.minimize-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMinimize();
        });

        // 点击最小化图标展开
        minimizedIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            // 检查是否刚拖动完，避免误触发展开
            if (this.panelMinimized && !this.justDragged) {
                this.toggleMinimize();
            }
        });

        // 点击最小化的面板也可以展开
        this.container.addEventListener('click', (e) => {
            // 检查是否刚拖动完，避免误触发展开
            if (this.panelMinimized && e.target === this.container && !this.justDragged) {
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

    createThemeColorPicker() {
        const container = document.createElement("div");
        container.style.cssText = `
            background: rgba(255, 255, 255, 0.15);
            padding: 8px;
            border-radius: 8px;
        `;

        // 预设主题
        const presets = [
            { name: "紫色梦幻", color1: "#667eea", color2: "#764ba2" },
            { name: "海洋蓝", color1: "#2193b0", color2: "#6dd5ed" },
            { name: "甜蜜粉", color1: "#f093fb", color2: "#f5576c" },
            { name: "清新绿", color1: "#11998e", color2: "#38ef7d" },
            { name: "活力橙", color1: "#ff6a00", color2: "#ee0979" },
            { name: "深邃蓝", color1: "#4568dc", color2: "#b06ab3" }
        ];

        const presetsContainer = document.createElement("div");
        presetsContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr;
            gap: 6px;
            margin-bottom: 10px;
        `;

        presets.forEach(preset => {
            const btn = document.createElement("button");
            btn.textContent = preset.name;
            btn.style.cssText = `
                background: linear-gradient(135deg, ${preset.color1} 0%, ${preset.color2} 100%);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 6px 4px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 10px;
                font-weight: 600;
                transition: all 0.2s;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            `;

            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            });

            btn.addEventListener('click', () => {
                this.panelTheme = { color1: preset.color1, color2: preset.color2 };
                Storage.set('panelTheme', this.panelTheme);
                this.applyTheme();
                this.updateCustomInputs(preset.color1, preset.color2);
                console.log(`主题已切换为: ${preset.name}`);
            });

            presetsContainer.appendChild(btn);
        });

        container.appendChild(presetsContainer);

        // 自定义颜色输入
        const customLabel = document.createElement("div");
        customLabel.textContent = "自定义颜色";
        customLabel.style.cssText = `
            color: rgba(255, 255, 255, 0.9);
            font-size: 11px;
            margin-bottom: 6px;
            margin-top: 4px;
        `;
        container.appendChild(customLabel);

        const inputContainer = document.createElement("div");
        inputContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 6px;
        `;

        const input1 = document.createElement("input");
        input1.type = "text";
        input1.placeholder = "起始颜色 #667eea";
        input1.value = this.panelTheme.color1;
        input1.style.cssText = `
            width: 100%;
            padding: 6px 8px;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            box-sizing: border-box;
        `;

        const input2 = document.createElement("input");
        input2.type = "text";
        input2.placeholder = "结束颜色 #764ba2";
        input2.value = this.panelTheme.color2;
        input2.style.cssText = input1.style.cssText;

        const applyBtn = document.createElement("button");
        applyBtn.textContent = "应用自定义主题";
        applyBtn.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.9);
            color: #667eea;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            transition: all 0.2s;
        `;

        applyBtn.addEventListener('mouseenter', () => {
            applyBtn.style.background = 'white';
            applyBtn.style.transform = 'translateY(-1px)';
            applyBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        });

        applyBtn.addEventListener('mouseleave', () => {
            applyBtn.style.background = 'rgba(255, 255, 255, 0.9)';
            applyBtn.style.transform = 'translateY(0)';
            applyBtn.style.boxShadow = 'none';
        });

        applyBtn.addEventListener('click', () => {
            const color1 = input1.value.trim();
            const color2 = input2.value.trim();
            
            // 简单的颜色格式验证
            if (this.isValidColor(color1) && this.isValidColor(color2)) {
                this.panelTheme = { color1, color2 };
                Storage.set('panelTheme', this.panelTheme);
                this.applyTheme();
                console.log(`自定义主题已应用: ${color1} -> ${color2}`);
            } else {
                alert('请输入有效的颜色代码（如 #667eea）');
            }
        });

        inputContainer.appendChild(input1);
        inputContainer.appendChild(input2);
        inputContainer.appendChild(applyBtn);
        container.appendChild(inputContainer);

        // 保存输入框引用以便更新
        this.themeInput1 = input1;
        this.themeInput2 = input2;

        return container;
    }

    updateCustomInputs(color1, color2) {
        if (this.themeInput1) this.themeInput1.value = color1;
        if (this.themeInput2) this.themeInput2.value = color2;
    }

    isValidColor(color) {
        // 验证颜色格式（支持 #xxx 和 #xxxxxx）
        return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
    }

    applyTheme() {
        if (this.container) {
            const gradient = `linear-gradient(135deg, ${this.panelTheme.color1} 0%, ${this.panelTheme.color2} 100%)`;
            this.container.style.background = gradient;
        }
    }

    // 应用面板位置（移除吸附效果，支持任意位置）
    applyPanelPosition(x, y, snap = false) {
        let finalX = x;
        let finalY = y;

        // 移除吸附逻辑，允许自由放置
        // 只需确保不超出屏幕边界即可
        const maxX = window.innerWidth - (this.panelMinimized ? 50 : (this.container.offsetWidth || 280));
        const maxY = window.innerHeight - (this.panelMinimized ? 50 : (this.container.offsetHeight || 100));
        
        finalX = Math.max(0, Math.min(finalX, maxX));
        finalY = Math.max(0, Math.min(finalY, maxY));

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

                // 移除吸附逻辑，直接保存当前位置
                if (hasMoved) {
                    // 直接保存当前位置，不吸附
                    const finalPos = this.applyPanelPosition(currentX, currentY, false);
                    this.panelPosition = finalPos;
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
        let startX; // 记录鼠标按下时的位置
        let startY;
        let rafId = null;
        const DRAG_THRESHOLD = 5; // 拖动阈值：移动超过5像素才算拖动

        this.container.addEventListener('mousedown', (e) => {
            // 只在最小化状态下才能拖动整个容器
            if (!this.panelMinimized) return;

            isDragging = true;
            hasMoved = false;
            this.container.style.transition = 'none';

            const rect = this.container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            startX = e.clientX; // 记录起始位置
            startY = e.clientY;

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

            // 计算移动距离
            const deltaX = Math.abs(e.clientX - startX);
            const deltaY = Math.abs(e.clientY - startY);
            
            // 只有移动超过阈值才算真正的拖动
            if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                hasMoved = true;
            }

            e.preventDefault();
            e.stopPropagation();

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
                    // 真正拖动过，保存位置
                    const finalPos = this.applyPanelPosition(currentX, currentY, false);
                    this.panelPosition = finalPos;
                    Storage.set('panelPosition', this.panelPosition);

                    // 拖动后阻止点击事件，不展开面板
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // 添加一个标志，短时间内阻止点击事件
                    this.justDragged = true;
                    setTimeout(() => {
                        this.justDragged = false;
                    }, 100);
                } else {
                    // 没有移动或移动距离小于阈值，是点击行为
                    // 不阻止事件，让点击事件触发展开
                }
            }
            document.removeEventListener('mousemove', onMouseMove, true);
            document.removeEventListener('mouseup', onMouseUp, true);
        };
    }

    toggleMinimize() {
        const wasMinimized = this.panelMinimized;
        this.panelMinimized = !this.panelMinimized;
        Storage.set('panelMinimized', this.panelMinimized);

        const content = this.container.querySelector('.panel-content');
        const currentLeft = parseInt(this.container.style.left) || 0;
        const currentTop = parseInt(this.container.style.top) || 0;

        if (this.panelMinimized) {
            // 缩小：从 280px -> 50px
            content.classList.add('hidden');
            this.container.classList.add('minimized');

            // 保持左上角位置不变（移除吸附逻辑）
            setTimeout(() => {
                const finalPos = this.applyPanelPosition(currentLeft, currentTop, false);
                this.panelPosition = finalPos;
                Storage.set('panelPosition', this.panelPosition);
            }, 100);
        } else {
            // 展开：从 50px -> 280px
            content.classList.remove('hidden');
            this.container.classList.remove('minimized');

            // 保持左上角位置不变（移除吸附逻辑）
            setTimeout(() => {
                // 强制浏览器重排
                void this.container.offsetWidth;

                const finalPos = this.applyPanelPosition(currentLeft, currentTop, false);
                this.panelPosition = finalPos;
                Storage.set('panelPosition', this.panelPosition);
            }, 350);
        }
    }

    setupWindowResizeHandler() {
        // 监听窗口大小变化，确保面板始终在可见区域内
        let resizeTimer;

        const adjustPosition = () => {
            if (this.currentTranslateX !== null && this.currentTranslateY !== null) {
                // 移除吸附逻辑，保持原位置（只确保不超出屏幕边界）
                const finalPos = this.applyPanelPosition(this.currentTranslateX, this.currentTranslateY, false);

                // 保存新位置
                this.panelPosition = finalPos;
                Storage.set('panelPosition', this.panelPosition);
            }
        };

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(adjustPosition, 100);
        });

        // 初始调整一次
        setTimeout(adjustPosition, 500);
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

    updateClearCooldownButton() {
        if (!this.clearCooldownBtn) return;

        if (this.likeResumeTime && Date.now() < this.likeResumeTime) {
            const remainingHours = Math.ceil((this.likeResumeTime - Date.now()) / (1000 * 60 * 60));
            this.clearCooldownBtn.innerHTML = `<span class="btn-icon">🔥</span><span class="btn-text">清除冷却 (${remainingHours}h)</span>`;
            this.clearCooldownBtn.style.display = 'flex';
        } else {
            this.clearCooldownBtn.style.display = 'none';
        }
    }

    handleClearCooldown() {
        if (!this.likeResumeTime) {
            this.showNotification('当前没有点赞冷却');
            return;
        }

        // 清除冷却时间
        this.likeResumeTime = null;
        Storage.set('likeResumeTime', null);

        // 更新按钮显示
        this.updateClearCooldownButton();

        // 显示成功提示
        this.showNotification('✅ 点赞冷却已清除，可以正常点赞了！');
        console.log('[清除冷却] 点赞冷却时间已清除');
    }

    observeLikeLimit() {
        // 监听 DOM 变化，检测点赞限制弹窗
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        // 检测弹窗内容
                        const text = node.textContent || '';

                        // 只处理点赞限制弹窗，排除回复限制弹窗
                        // 点赞限制关键词：点赞上限、点赞、分享很多爱
                        // 回复限制关键词：回复数量、创建更多新回复
                        const isLikeLimit = (
                            (text.includes('点赞上限') ||
                             text.includes('分享很多爱') ||
                             text.includes('点赞') && text.includes('小时后再次点赞')) &&
                            !text.includes('回复') &&
                            !text.includes('创建更多新回复')
                        );

                        if (isLikeLimit) {
                            this.handleLikeLimit(text);
                            // 自动关闭弹窗
                            setTimeout(() => {
                                const confirmBtn = document.querySelector('.modal-footer .btn-primary, .dialog-footer .btn-primary, button.btn-primary');
                                if (confirmBtn && confirmBtn.textContent.includes('确定')) {
                                    confirmBtn.click();
                                }
                            }, 1000);
                            break;
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
            ? `${Math.floor(waitMinutes / 60)} 小时 ${waitMinutes % 60 > 0 ? (waitMinutes % 60) + ' 分钟' : ''}`.trim()
            : `${waitMinutes} 分钟`;

        console.log(`已达到点赞上限，自动关闭点赞功能，将在 ${resumeDate.toLocaleString()} (${displayTime}后) 恢复`);

        // 显示提示 - 使用提取到的实际时间
        this.showNotification(`点赞已达上限，将在 ${displayTime}后自动恢复`);
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

    // 获取当前用户名
    async getCurrentUsername() {
        if (this.currentUsername) return this.currentUsername;

        try {
            // 方法1：从用户菜单获取
            const userMenuBtn = document.querySelector('.header-dropdown-toggle.current-user');
            if (userMenuBtn) {
                const img = userMenuBtn.querySelector('img[alt]');
                if (img && img.alt) {
                    this.currentUsername = img.alt;
                    return this.currentUsername;
                }
            }

            // 方法2：从 API 获取
            const response = await fetch(`${BASE_URL}/session/current.json`);
            if (response.ok) {
                const data = await response.json();
                if (data.current_user && data.current_user.username) {
                    this.currentUsername = data.current_user.username;
                    return this.currentUsername;
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

        // 如果不是手动刷新，显示加载状态
        if (isManualRefresh) {
            const refreshBtn = this.trustLevelContainer.querySelector('.trust-level-refresh');
            if (refreshBtn) {
                refreshBtn.textContent = '刷新中...';
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

        let html = `
            <div class="trust-level-header">
                <span>📊 ${levelNames[currentLevel] || `Lv${currentLevel} → Lv${targetLevel}`} (${username})</span>
                <button class="trust-level-refresh" data-action="refresh">🔄 刷新</button>
            </div>
        `;

        trustLevelDetails.items.forEach(req => {
            const progress = Math.min((req.current / req.required) * 100, 100);
            const isCompleted = req.isMet;
            const fillClass = isCompleted ? 'completed' : '';

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${req.name}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${req.current}/${req.required}</span>
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

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${req.name}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${req.current}/${req.required}</span>
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

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${req.name}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${req.current}/${req.required}</span>
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

        let html = `
            <div class="trust-level-header">
                <span>📊 ${levelNames[targetLevel] || `Lv${currentLevel} → Lv${targetLevel}`} (${username})</span>
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
                .replace('获赞：点赞用户数量', '点赞用户')
                .replace('被禁言（过去 6 个月）', '被禁言')
                .replace('被封禁（过去 6 个月）', '被封禁')
                .replace('访问次数（过去', '访问次数(')
                .replace('个月）', '月)')
                .replace('回复次数（最近', '回复(近')
                .replace('天内）', '天)');

            html += `
                <div class="trust-level-item">
                    <span class="trust-level-name">${simpleName}</span>
                    <div class="trust-level-progress">
                        <div class="trust-level-bar">
                            <div class="trust-level-bar-fill ${fillClass}" style="width: ${progress}%"></div>
                        </div>
                        <span class="trust-level-value">${req.current}/${req.required}</span>
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
        if (sidebarToggle) {
            if (this.cleanModeEnabled) {
                // 开启清爽模式：收起边栏
                if (sidebarToggle.getAttribute('aria-expanded') === 'true') {
                    console.log('清爽模式启用，收起边栏');
                    sidebarToggle.click();
                }
            } else {
                // 关闭清爽模式：展开边栏
                if (sidebarToggle.getAttribute('aria-expanded') === 'false') {
                    console.log('清爽模式关闭，展开边栏');
                    sidebarToggle.click();
                }
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
                    marginTop: '10px',
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
                const postContent = firstPost.querySelector('.cooked');
                if (postContent) {
                    postContent.appendChild(saveButton);
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

        // 整个工具功能区：只在文章页显示
        if (this.toolSectionContainer) {
            this.toolSectionContainer.style.display = isTopicPage ? 'block' : 'none';
        }

        // 文章页功能区上方的分隔线：只在文章页显示
        if (this.divider2) {
            this.divider2.style.display = isTopicPage ? 'block' : 'none';
        }

        // 文章页功能区下方的分隔线：只在文章页显示
        if (this.divider3) {
            this.divider3.style.display = isTopicPage ? 'block' : 'none';
        }

        console.log(`页面类型: ${isTopicPage ? '文章页' : '非文章页'}，文章页功能区${isTopicPage ? '显示' : '隐藏'}`);
    }

    async handleRevealUsersClick() {
        if (this.userInfoHelper.revealInProgress) return;

        // 更新按钮状态
        this.revealUsersBtn.disabled = true;
        this.revealUsersBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">加载中...</span>';

        try {
            await this.userInfoHelper.revealAllVisibleReplies();
            this.revealUsersBtn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">加载完成</span>';

            // 2秒后恢复按钮
            setTimeout(() => {
                this.revealUsersBtn.disabled = false;
                this.revealUsersBtn.innerHTML = '<span class="btn-icon">📊</span><span class="btn-text">批量展示信息</span>';
            }, 2000);
        } catch (error) {
            console.error('展示用户信息失败:', error);
            this.revealUsersBtn.disabled = false;
            this.revealUsersBtn.innerHTML = '<span class="btn-icon">❌</span><span class="btn-text">加载失败</span>';

            setTimeout(() => {
                this.revealUsersBtn.innerHTML = '<span class="btn-icon">📊</span><span class="btn-text">批量展示信息</span>';
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
            this.button.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">开始阅读</span>';
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
        } else {
            // 开启自动阅读
            this.autoRunning = true;
            this.setSessionStorage('autoRunning', true);
            this.button.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">停止阅读</span>';
            this.button.classList.add('running');

            // 启动导航守护
            this.startNavigationGuard();

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

    async autoLikeTopic() {
        if (!this.autoLikeEnabled) return;

        // 检查是否在冷却期
        if (this.likeResumeTime && Date.now() < this.likeResumeTime) {
            console.log("[自动点赞] 点赞功能冷却中，跳过");
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
            return !likedFloorsInThisTopic.includes(floorNumber);
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
        let page = 1;
        let topicList = [];
        let retryCount = 0;

        // 根据设置选择获取最新帖子还是未读帖子
        const endpoint = this.readUnreadEnabled ? 'unread' : 'latest';
        console.log(`正在获取${this.readUnreadEnabled ? '未读' : '最新'}帖子列表...`);

        while (topicList.length < CONFIG.article.topicListLimit && retryCount < CONFIG.article.retryLimit) {
            try {
                const response = await fetch(`${BASE_URL}/${endpoint}.json?no_definitions=true&page=${page}`);
                const data = await response.json();

                if (data?.topic_list?.topics) {
                    const filteredTopics = data.topic_list.topics.filter(topic =>
                        topic.posts_count < CONFIG.article.commentLimit
                    );
                    topicList.push(...filteredTopics);
                    page++;

                    // 如果是未读帖子且没有更多了，直接退出
                    if (this.readUnreadEnabled && filteredTopics.length === 0) {
                        break;
                    }
                } else {
                    break;
                }
            } catch (error) {
                console.error('获取文章列表失败:', error);
                retryCount++;
                await Utils.sleep(1000);
            }
        }

        if (topicList.length > CONFIG.article.topicListLimit) {
            topicList = topicList.slice(0, CONFIG.article.topicListLimit);
        }

        this.topicList = topicList;
        this.setSessionStorage('topicList', topicList);
        console.log(`已获取 ${topicList.length} 篇${this.readUnreadEnabled ? '未读' : '最新'}文章`);

        // 如果未读帖子为空，提示用户
        if (this.readUnreadEnabled && topicList.length === 0) {
            this.showNotification('📭 没有未读帖子，将切换到最新帖子');
            this.readUnreadEnabled = false;
            Storage.set('readUnreadEnabled', false);
            // 重新获取最新帖子
            await this.getLatestTopics();
        }
    }

    async getNextTopic() {
        if (this.topicList.length === 0) {
            await this.getLatestTopics();
        }

        if (this.topicList.length > 0) {
            const topic = this.topicList.shift();
            this.setSessionStorage('topicList', this.topicList);
            return topic;
        }

        return null;
    }

    async startScrolling() {
        if (this.isScrolling) return;

        this.isScrolling = true;
        this.button.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">停止阅读</span>';
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
        this.button.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">开始阅读</span>';
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
        this.showNotification(`⏸️ 开始休息 ${restMinutes} 分钟`);

        await Utils.sleep(CONFIG.time.restTime);

        console.log("休息结束，继续浏览...");

        // 显示休息结束通知
        this.showNotification(`✅ 休息结束，继续浏览`);

        this.startScrolling();
    }

    async navigateNextTopic() {
        const nextTopic = await this.getNextTopic();
        if (nextTopic) {
            console.log("导航到新文章:", nextTopic.title);

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

    resetFirstUse() {
        Storage.set('firstUseChecked', false);
        Storage.set('likesCount', 0);
        Storage.set('selectedPost', null);
        this.firstUseChecked = false;
        this.likesCount = 0;
        this.selectedPost = null;
        console.log('已重置首次使用状态');
    }
}

// 初始化
(function() {
    window.browseController = new BrowseController();
})();
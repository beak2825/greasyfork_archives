// ==UserScript==
// @name         linux.do player helper
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  观影助手
// @match        *://linux.do/*
// @match        *://idcflare.com/*
// @grant        GM_addStyle
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.js
// @require      https://cdn.tailwindcss.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562368/linuxdo%20player%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562368/linuxdo%20player%20helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================================
    // 1. 配置中心 (CONFIG)
    // =================================================================================

    // 插件显示模式，是否嵌合为页面图标
    let showLogoInner = true;
    // 能够设置嵌合为页面图标的网站host（Discourse论坛）
    const canEmbedHosts = ['linux.do', 'idcflare.com'];

    const CONFIG = {
        STORAGE_KEYS: {
            THEME: 'elegant-theme',
            TAB_POSITION: 'elegant-tab-position',
            TAB_ORDER: 'elegant-tab-order',
            DOUBAN_API: 'douban-api',
            DOUBAN_PROXY: 'douban-api-proxy',
            DOUBAN_PROXY_MODE: 'douban-proxy-mode', // 'cdn' 或 'proxy'
            DOUBAN_IMAGE_URL: 'douban-image-url',
            DOUBAN_IMAGE_MODE: 'douban-image-mode', // 'cdn' 或 'proxy'
            DAILY_API: 'daily-api',
            DAILY_DATA_CACHE: 'elegant-daily-data-cache',
            DAILY_DATA_TIMESTAMP: 'elegant-daily-data-timestamp',
            REDIRECT_URL: 'redirect-url',
            BANGUMI_CUSTOM_URL: 'bangumi_id_custom_jump_url',
            SHOW_LOGO_INNER: 'show-logo-inner', // 是否显示为页面嵌合图标
            // 豆瓣查找本地缓存存储键
            DOUBAN_CACHE_MOVIE: 'elegant-douban-cache-movie',
            DOUBAN_CACHE_TV: 'elegant-douban-cache-tv',
            DOUBAN_CACHE_ANIME: 'elegant-douban-cache-anime',
            DOUBAN_CACHE_VARIETY: 'elegant-douban-cache-variety',
            DOUBAN_CACHE_TIMESTAMP: 'elegant-douban-cache-timestamp',
            DOUBAN_DAILY_LINK: 'douban-daily-link', // 豆瓣卡片与每日放送联动
            DAILY_LINK_POSITION: 'daily-link-position', // 联动卡片位置：head/tail
        },
        SELECTORS: {
            MAIN_MODAL: '#elegant-main-modal',
            SETTINGS_MODAL: '#elegant-settings-modal',
            OVERLAY: '#elegant-modal-overlay',
            MAIN_BUTTON: '#elegant-main-button',
            TABS_CONTAINER: '.tabs-container',
            TABS_HEADER: '.tabs-header',
            TAB_CONTENT: '.tab-content',
            CONTEXT_MENU: '#elegant-context-menu',
            // 豆瓣查找相关选择器
            DOUBAN_TABS: '.douban-tabs',
            DOUBAN_CATEGORY: '.douban-category',
            DOUBAN_FILTER: '.douban-filter',
            DOUBAN_CONTENT: '#douban-content-container',
            DOUBAN_LOADING: '.douban-loading',
        },
        CLASSES: {
            HIDDEN: 'hidden',
            ACTIVE: 'active',
            FADE_IN: 'animate-fade-in',
            FADE_OUT: 'animate-fade-out',
            LOADING: 'loading'
        },
        ANIMATION_DURATION: 300, // ms
        WEEK_DAYS: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        DEFAULT_DAILY_API: 'https://api.bgm.tv/calendar', // 默认每日放送API
        DEFAULT_DOUBAN_API: 'https://m.douban.com/rexxar/api/v2', // 默认豆瓣API
        REDIRECT_DELAY: 1500, // 跳转延迟时间（毫秒）
        DOUBAN_PAGE_SIZE: 20, // 豆瓣每页数据量
    };

    // 豆瓣API端点配置
    const DOUBAN_ENDPOINTS = {
        movie_recommend: '/movie/recommend',
        movie_recent_hot: '/subject/recent_hot/movie',
        tv_recommend: '/tv/recommend',
        tv_recent_hot: '/subject/recent_hot/tv',
    };

    // 各tab的分类配置
    const DOUBAN_TAB_CATEGORIES = {
        movie: {
            all: '全部',
            hot: '热门电影',
            latest: '最新电影',
            high_score: '豆瓣高分',
            hidden_gem: '冷门佳片'
        },
        tv: {
            all: '全部',
            hot: '最近热门'
        },
        anime: {
            series: '番剧',
            movie: '剧场版'
        },
        variety: {
            all: '全部',
            hot: '最近热门'
        }
    };

    // 各tab分类对应的筛选选项
    const DOUBAN_CATEGORY_FILTERS = {
        // 电影-全部：类型、地区、年代、排序
        movie_all: { type: 'dropdown', fields: ['type', 'region', 'year', 'sort'] },
        // 电影-热门/最新/高分/冷门：全部、华语、欧美、韩国、日本
        movie_hot: { type: 'capsule', options: { all: '全部', chinese: '华语', western: '欧美', korea: '韩国', japan: '日本' } },
        movie_latest: { type: 'capsule', options: { all: '全部', chinese: '华语', western: '欧美', korea: '韩国', japan: '日本' } },
        movie_high_score: { type: 'capsule', options: { all: '全部', chinese: '华语', western: '欧美', korea: '韩国', japan: '日本' } },
        movie_hidden_gem: { type: 'capsule', options: { all: '全部', chinese: '华语', western: '欧美', korea: '韩国', japan: '日本' } },
        // 剧集-全部：类型、地区、年代、平台、排序
        tv_all: { type: 'dropdown', fields: ['type', 'region', 'year', 'platform', 'sort'] },
        // 剧集-最近热门：全部、国产、欧美、日本、韩国、动漫、纪录片
        tv_hot: { type: 'capsule', options: { tv: '全部', tv_domestic: '国产', tv_american: '欧美', tv_japanese: '日本', tv_korean: '韩国', tv_animation: '动漫', tv_documentary: '纪录片' } },
        // 动漫-番剧：类型、地区、年代、平台、排序
        anime_series: { type: 'dropdown', fields: ['anime_type', 'region', 'year', 'platform', 'sort'] },
        // 动漫-剧场版：类型、地区、年代、排序（无平台）
        anime_movie: { type: 'dropdown', fields: ['anime_type', 'region', 'year', 'sort'] },
        // 综艺-全部：类型、地区、年代、平台、排序
        variety_all: { type: 'dropdown', fields: ['variety_type', 'region', 'year', 'platform', 'sort'] },
        // 综艺-最近热门：全部、国内、国外
        variety_hot: { type: 'capsule', options: { show: '全部', show_domestic: '国内', show_foreign: '国外' } }
    };

    // 豆瓣筛选选项配置
    const DOUBAN_FILTER_OPTIONS = {
        // 电影类型
        type: { all: '全部', 喜剧: '喜剧', 爱情: '爱情', 动作: '动作', 科幻: '科幻', 动画: '动画', 悬疑: '悬疑', 惊悚: '惊悚', 冒险: '冒险', 音乐: '音乐', 历史: '历史', 奇幻: '奇幻', 恐怖: '恐怖', 战争: '战争', 传记: '传记', 歌舞: '歌舞', 武侠: '武侠', 灾难: '灾难', 西部: '西部', 纪录片: '纪录片', 短片: '短片' },
        // 剧集类型
        tv_type: { all: '全部', 喜剧: '喜剧', 爱情: '爱情', 悬疑: '悬疑', 动画: '动画', 武侠: '武侠', 古装: '古装', 家庭: '家庭', 科幻: '科幻', 恐怖: '恐怖', 历史: '历史', 战争: '战争', 动作: '动作', 冒险: '冒险', 传记: '传记', 剧情: '剧情', 奇幻: '奇幻', 惊悚: '惊悚', 灾难: '灾难', 歌舞: '歌舞', 音乐: '音乐' },
        // 动漫类型
        anime_type: { all: '全部', 励志: '励志', 恋爱: '恋爱', 治愈: '治愈', 运动: '运动', 青春: '青春', 校园: '校园', 黑色幽默: '黑色幽默', 历史: '历史', 歌舞: '歌舞', 恶搞: '恶搞', 后宫: '后宫', 悬疑: '悬疑', 魔幻: '魔幻', 科幻: '科幻' },
        // 综艺类型
        variety_type: { all: '全部', 真人秀: '真人秀', 脱口秀: '脱口秀', 音乐: '音乐', 歌舞: '歌舞' },
        // 地区
        region: { all: '全部', 华语: '华语', 欧美: '欧美', 韩国: '韩国', 日本: '日本', 中国大陆: '中国大陆', 美国: '美国', 中国香港: '中国香港', 中国台湾: '中国台湾', 英国: '英国', 法国: '法国', 德国: '德国', 意大利: '意大利', 西班牙: '西班牙', 印度: '印度', 泰国: '泰国', 俄罗斯: '俄罗斯', 加拿大: '加拿大', 澳大利亚: '澳大利亚', 爱尔兰: '爱尔兰', 瑞典: '瑞典', 巴西: '巴西', 丹麦: '丹麦' },
        // 年代（动态生成）
        get year() {
            const currentYear = new Date().getFullYear();
            const years = [['all', '全部']];
            for (let y = currentYear; y >= 2019; y--) years.push([String(y), String(y)]);
            return years.concat([['2020年代', '2020年代'], ['2010年代', '2010年代'], ['2000年代', '2000年代'], ['90年代', '90年代'], ['80年代', '80年代'], ['70年代', '70年代'], ['60年代', '60年代'], ['更早', '更早']]);
        },
        // 平台
        platform: { all: '全部', 腾讯视频: '腾讯视频', 爱奇艺: '爱奇艺', 优酷: '优酷', 湖南卫视: '湖南卫视', Netflix: 'Netflix', HBO: 'HBO', BBC: 'BBC', NHK: 'NHK', CBS: 'CBS', NBC: 'NBC', tvN: 'tvN' },
        // 排序
        sort: { recommend: '综合排序', U: '近期热度', R: '首映时间', S: '高分优先' }
    };

    // =================================================================================
    // 2. 数据驱动视图 (TABS_CONFIG)
    // =================================================================================

    const TABS_CONFIG = {
        'tab1': {
            label: '每日放送',
            renderContent: renderDailyContent
        },
        'tab2': {
            label: '豆瓣查找',
            renderContent: renderDoubanContent
        },
        'tab3': {
            label: '管理跳转',
            renderContent: renderTagsManageContent
        },
        'tab4': {
            label: '管理收藏',
            renderContent: renderFavoritesContent
        }
    };

    const DEFAULT_TABS_ORDER = [
        { id: 'tab1', label: '每日放送' },
        { id: 'tab2', label: '豆瓣查找' },
        { id: 'tab3', label: '管理跳转' },
        { id: 'tab4', label: '管理收藏' }
    ];

    // 用于存储预加载数据Promise的全局变量
    let dailyDataPromise = null;
    // 用于记录原始每日放送API值
    let originalDailyApiValue = '';
    // 用于记录当前激活的标签页ID
    let currentActiveTabId = null;
    // 用于存储当前右键点击的卡片ID和类型
    let currentRightClickedCardId = null;
    let currentRightClickedCardType = null; // 'bangumi' 或 'douban'
    // 豆瓣查找相关状态
    let doubanCurrentTab = 'anime'; // 当前豆瓣查找的tab
    let doubanCurrentCategory = 'series'; // 当前分类
    let doubanCurrentPage = 1; // 当前页
    let doubanIsLoading = false; // 是否正在加载
    let doubanHasMore = true; // 是否有更多数据
    // 数据加载状态缓存
    let dailyDataLoaded = false;
    let doubanDataLoaded = false;
    // 豆瓣内部tab数据缓存 { movie: {html, hasMore, page, config, loaded}, tv: {...}, ... }
    // config字段记录该缓存对应的筛选配置，只有配置匹配时才使用缓存
    let doubanTabCache = {};

    // =================================================================================
    // 3. 豆瓣查找功能实现
    // =================================================================================

    function renderDoubanContent() {
        const categories = DOUBAN_TAB_CATEGORIES[doubanCurrentTab];
        const defaultCategories = { movie: 'latest', tv: 'hot', anime: 'series', variety: 'hot' };
        doubanCurrentCategory = getSetting(`douban-${doubanCurrentTab}-category`, defaultCategories[doubanCurrentTab]);

        return `
            <div id="douban-content-container" class="douban-container">
                <div class="douban-tabs">
                    <button class="douban-tab ${doubanCurrentTab === 'anime' ? 'active' : ''}" data-tab="anime">动漫</button>
                    <button class="douban-tab ${doubanCurrentTab === 'tv' ? 'active' : ''}" data-tab="tv">剧集</button>
                    <button class="douban-tab ${doubanCurrentTab === 'variety' ? 'active' : ''}" data-tab="variety">综艺</button>
                    <button class="douban-tab ${doubanCurrentTab === 'movie' ? 'active' : ''}" data-tab="movie">电影</button>
                </div>

                <div class="douban-filters">
                    <div class="filter-row">
                        <div class="filter-label">分类：</div>
                        <div class="filter-options douban-category" id="douban-category-options"></div>
                    </div>

                    <div class="filter-row">
                        <div class="filter-label">筛选：</div>
                        <div class="filter-options douban-filter" id="douban-filter-options"></div>
                    </div>
                </div>

                <div class="douban-results-wrapper">
                    <div class="douban-results ${doubanCurrentTab === 'movie' ? 'active' : ''}" id="douban-results-movie"></div>
                    <div class="douban-results ${doubanCurrentTab === 'tv' ? 'active' : ''}" id="douban-results-tv"></div>
                    <div class="douban-results ${doubanCurrentTab === 'anime' ? 'active' : ''}" id="douban-results-anime"></div>
                    <div class="douban-results ${doubanCurrentTab === 'variety' ? 'active' : ''}" id="douban-results-variety"></div>
                </div>
            </div>
        `;
    }

    // 获取当前tab的筛选存储键

    function updateDoubanCategoryOptions() {
        const $categoryOptions = $('#douban-category-options');
        const categories = DOUBAN_TAB_CATEGORIES[doubanCurrentTab];
        // 使用默认分类，不保存到 localStorage
        const defaultCategories = { movie: 'latest', tv: 'hot', anime: 'series', variety: 'hot' };
        const category = defaultCategories[doubanCurrentTab];
        doubanCurrentCategory = category;

        $categoryOptions.html(
            Object.entries(categories).map(([key, label]) =>
                `<button class="filter-option ${category === key ? 'active' : ''}" data-value="${key}">${label}</button>`
            ).join('')
        );
    }

    function updateDoubanFilterOptions() {
        const $filterOptions = $('#douban-filter-options');
        const filterKey = `${doubanCurrentTab}_${doubanCurrentCategory}`;
        const filterConfig = DOUBAN_CATEGORY_FILTERS[filterKey];

        if (!filterConfig) {
            $filterOptions.empty();
            return;
        }

        $filterOptions.empty();

        if (filterConfig.type === 'capsule') {
            // 胶囊按钮模式
            // 根据不同的tab和分类设置默认筛选
            const defaultFilters = {
                movie_hot: 'all',
                movie_latest: 'all',
                movie_high_score: 'all',
                movie_hidden_gem: 'all',
                tv_hot: 'tv_domestic',  // 剧集-最近热门默认为国产
                variety_hot: 'show_domestic'  // 综艺-最近热门默认为国内
            };
            // 获取当前filterKey对应的选项keys
            const optionKeys = Object.keys(filterConfig.options);
            const defaultFilter = defaultFilters[filterKey] || optionKeys[0];
            // 使用默认筛选，不读取 localStorage
            const savedFilter = defaultFilter;
            $filterOptions.html(
                Object.entries(filterConfig.options).map(([key, label]) =>
                    `<button class="filter-option ${savedFilter === key ? 'active' : ''}" data-value="${key}">${label}</button>`
                ).join('')
            );
        } else if (filterConfig.type === 'dropdown') {
            // 下拉菜单模式
            const fieldNames = { type: '类型', tv_type: '类型', anime_type: '类型', variety_type: '类型', region: '地区', year: '年代', platform: '平台', sort: '排序' };
            // 为不同tab和字段设置默认值
            const defaultFieldValues = {
                anime_type: 'all',
                // 动漫默认：地区中国大陆，排序近期热度
                anime_region: '中国大陆',
                anime_sort: 'U'
            };
            filterConfig.fields.forEach(field => {
                const options = DOUBAN_FILTER_OPTIONS[field] || DOUBAN_FILTER_OPTIONS.type;
                const isArray = Array.isArray(options);
                // 使用tab+字段特定的默认值，不读取 localStorage
                const tabFieldKey = `${doubanCurrentTab}_${field}`;
                const fieldDefault = defaultFieldValues[tabFieldKey] || defaultFieldValues[field] || (field === 'sort' ? 'recommend' : 'all');
                const savedValue = fieldDefault;
                // 当值为"全部"或"综合排序"时显示筛选名称，否则显示选中的值
                const optionLabel = isArray ? (options.find(o => o[0] === savedValue)?.[1] || '全部') : (options[savedValue] || '全部');
                const displayText = (savedValue === 'all' || savedValue === 'recommend') ? fieldNames[field] : optionLabel;

                const optionsHtml = isArray
                    ? options.map(([key, value]) => `<button class="ph-dd-item ${savedValue === key ? 'active' : ''}" data-value="${key}">${value}</button>`).join('')
                    : Object.entries(options).map(([key, value]) => `<button class="ph-dd-item ${savedValue === key ? 'active' : ''}" data-value="${key}">${value}</button>`).join('');

                $filterOptions.append(`
                    <div class="ph-dd-wrap" data-type="${field}">
                        <button class="ph-dd-toggle">
                            <span class="ph-dd-text">${displayText}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="ph-dd-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div class="ph-dd-menu">
                            <div class="ph-dd-grid">${optionsHtml}</div>
                        </div>
                    </div>
                `);
            });
        }
    }

    function buildDoubanApiUrl(tabType = null, preloading = false) {
        const doubanApi = CONFIG.DEFAULT_DOUBAN_API;
        const doubanProxy = getSetting(CONFIG.STORAGE_KEYS.DOUBAN_PROXY, '');
        const proxyMode = getSetting(CONFIG.STORAGE_KEYS.DOUBAN_PROXY_MODE, 'cdn');
        const currentTab = tabType || doubanCurrentTab;
        const category = tabType ? Object.keys(DOUBAN_TAB_CATEGORIES[tabType])[0] : doubanCurrentCategory;

        // 获取当前筛选值
        const filterValues = preloading ? {} : getCurrentFilterValues(currentTab, category);
        // 根据tab和category确定默认筛选值
        const defaultFilters = { tv_hot: 'tv_domestic', variety_hot: 'show_domestic' };
        const filterDefault = defaultFilters[`${currentTab}_${category}`] || 'all';
        const filter = filterValues.filter || filterDefault;

        // 根据模式构建baseUrl
        let baseUrl;
        if (!doubanProxy) {
            baseUrl = doubanApi;
        } else if (proxyMode === 'cdn') {
            // CDN模式：替换豆瓣host
            try {
                const apiUrl = new URL(doubanApi);
                const cdnUrl = new URL(doubanProxy);
                baseUrl = `${cdnUrl.protocol}//${cdnUrl.host}${apiUrl.pathname}`;
            } catch {
                baseUrl = doubanApi;
            }
        } else {
            // 代理模式：直接拼接
            baseUrl = doubanProxy.replace(/\/+$/, '') + '/' + doubanApi;
        }

        const page = tabType ? 1 : doubanCurrentPage;
        const start = (page - 1) * CONFIG.DOUBAN_PAGE_SIZE;
        const count = CONFIG.DOUBAN_PAGE_SIZE;

        // 根据tab和分类确定API端点和参数
        const filterKey = `${currentTab}_${category}`;
        const filterConfig = DOUBAN_CATEGORY_FILTERS[filterKey];

        // 电影分类处理
        if (currentTab === 'movie') {
            if (category === 'all') {
                // 电影-全部：使用recommend API
                return buildRecommendUrl(baseUrl, DOUBAN_ENDPOINTS.movie_recommend, start, count, 'movie', filterValues);
            } else {
                // 电影-热门/最新/高分/冷门：使用recent_hot API
                const categoryMap = { hot: '热门', latest: '最新', high_score: '豆瓣高分', hidden_gem: '冷门佳片' };
                const typeMap = { all: '全部', chinese: '华语', western: '欧美', korea: '韩国', japan: '日本' };
                return `${baseUrl}${DOUBAN_ENDPOINTS.movie_recent_hot}?start=${start}&limit=${count}&category=${encodeURIComponent(categoryMap[category])}&type=${encodeURIComponent(typeMap[filter] || '全部')}`;
            }
        }

        // 剧集分类处理
        if (currentTab === 'tv') {
            if (category === 'all') {
                return buildRecommendUrl(baseUrl, DOUBAN_ENDPOINTS.tv_recommend, start, count, 'tv', filterValues);
            } else {
                // 剧集-最近热门
                return `${baseUrl}${DOUBAN_ENDPOINTS.tv_recent_hot}?start=${start}&limit=${count}&category=tv&type=${filter}`;
            }
        }

        // 动漫分类处理
        if (currentTab === 'anime') {
            if (category === 'series') {
                // 番剧：使用tv/recommend，固定selected_categories包含动画+电视剧
                return buildAnimeSeriesUrl(baseUrl, start, count, filterValues);
            } else {
                // 剧场版：使用movie/recommend，固定selected_categories包含动画
                return buildAnimeMovieUrl(baseUrl, start, count, filterValues);
            }
        }

        // 综艺分类处理
        if (currentTab === 'variety') {
            if (category === 'all') {
                return buildVarietyUrl(baseUrl, start, count, filterValues);
            } else {
                // 综艺-最近热门
                return `${baseUrl}${DOUBAN_ENDPOINTS.tv_recent_hot}?start=${start}&limit=${count}&category=show&type=${filter}`;
            }
        }

        return `${baseUrl}${DOUBAN_ENDPOINTS.movie_recommend}?start=${start}&count=${count}`;
    }

    function buildDoubanApiUrlForPreload(tabType, config) {
        const doubanApi = CONFIG.DEFAULT_DOUBAN_API;
        const doubanProxy = getSetting(CONFIG.STORAGE_KEYS.DOUBAN_PROXY, '');
        const proxyMode = getSetting(CONFIG.STORAGE_KEYS.DOUBAN_PROXY_MODE, 'cdn');

        // 根据模式构建baseUrl
        let baseUrl;
        if (!doubanProxy) {
            baseUrl = doubanApi;
        } else if (proxyMode === 'cdn') {
            try {
                const apiUrl = new URL(doubanApi);
                const cdnUrl = new URL(doubanProxy);
                baseUrl = `${cdnUrl.protocol}//${cdnUrl.host}${apiUrl.pathname}`;
            } catch {
                baseUrl = doubanApi;
            }
        } else {
            baseUrl = doubanProxy.replace(/\/+$/, '') + '/' + doubanApi;
        }

        const start = 0;
        const count = config.pageSize;

        // 根据tab和配置构建URL
        if (tabType === 'movie') {
            // 最新电影、全部
            const categoryMap = { latest: '最新' };
            const typeMap = { all: '全部' };
            return `${baseUrl}${DOUBAN_ENDPOINTS.movie_recent_hot}?start=${start}&limit=${count}&category=${encodeURIComponent(categoryMap[config.category])}&type=${encodeURIComponent(typeMap[config.filter])}`;
        }

        if (tabType === 'tv') {
            // 最近热门、国产
            const typeMap = { tv_domestic: 'tv_domestic' };
            return `${baseUrl}${DOUBAN_ENDPOINTS.tv_recent_hot}?start=${start}&limit=${count}&category=tv&type=${typeMap[config.filter]}`;
        }

        if (tabType === 'anime') {
            // 番剧、中国大陆、近期热度
            const selectedCategories = { '类型': '动画', '形式': '电视剧', '地区': '中国大陆' };
            const tags = ['动画', '中国大陆'];
            return `${baseUrl}${DOUBAN_ENDPOINTS.tv_recommend}?refresh=0&start=${start}&count=${count}&selected_categories=${encodeURIComponent(JSON.stringify(selectedCategories))}&uncollect=false&score_range=0,10&tags=${encodeURIComponent(tags.join(','))}&sort=${config.sort}`;
        }

        if (tabType === 'variety') {
            // 最近热门、国内
            const typeMap = { show_domestic: 'show_domestic' };
            return `${baseUrl}${DOUBAN_ENDPOINTS.tv_recent_hot}?start=${start}&limit=${count}&category=show&type=${typeMap[config.filter]}`;
        }

        return `${baseUrl}${DOUBAN_ENDPOINTS.movie_recommend}?start=${start}&count=${count}`;
    }

    function buildRecommendUrl(baseUrl, endpoint, start, count, mediaType, filterValues = {}) {
        // 从filterValues获取筛选值，默认为all
        const type = filterValues.type || filterValues[mediaType === 'movie' ? 'type' : 'tv_type'] || 'all';
        const region = filterValues.region || 'all';
        const year = filterValues.year || 'all';
        const platform = filterValues.platform || 'all';
        const sort = filterValues.sort || 'recommend';

        // 电影和剧集默认 {"类型":""}，而不是空对象
        const selectedCategories = { '类型': '' };
        const tags = [];

        // 类型
        if (type !== 'all') {
            selectedCategories['类型'] = type;
            tags.push(type);
        }
        // 剧集需要形式（仅当有类型筛选时才添加）
        if (mediaType === 'tv' && type !== 'all') {
            selectedCategories['形式'] = '电视剧';
        }
        // 地区
        if (region !== 'all') {
            selectedCategories['地区'] = region;
            tags.push(region);
        }
        // 年代
        if (year !== 'all') tags.push(year);
        // 平台（仅剧集）
        if (mediaType === 'tv' && platform !== 'all') tags.push(platform);

        let url = `${baseUrl}${endpoint}?refresh=0&start=${start}&count=${count}&selected_categories=${encodeURIComponent(JSON.stringify(selectedCategories))}&uncollect=false&score_range=0,10&tags=${encodeURIComponent(tags.join(','))}`;
        if (sort !== 'recommend') url += `&sort=${sort}`;
        return url;
    }

    function buildAnimeSeriesUrl(baseUrl, start, count, filterValues = {}) {
        const type = filterValues.anime_type || 'all';
        const region = filterValues.region || 'all';
        const year = filterValues.year || 'all';
        const platform = filterValues.platform || 'all';
        const sort = filterValues.sort || 'recommend';

        const selectedCategories = { '类型': '动画', '形式': '电视剧' };
        const tags = ['动画'];

        // 类型（动漫子类型如国漫等）
        if (type !== 'all') tags.push(type);
        // 地区
        if (region !== 'all') { selectedCategories['地区'] = region; tags.push(region); }
        // 年代
        if (year !== 'all') tags.push(year);
        // 平台
        if (platform !== 'all') tags.push(platform);

        let url = `${baseUrl}${DOUBAN_ENDPOINTS.tv_recommend}?refresh=0&start=${start}&count=${count}&selected_categories=${encodeURIComponent(JSON.stringify(selectedCategories))}&uncollect=false&score_range=0,10&tags=${encodeURIComponent(tags.join(','))}`;
        if (sort !== 'recommend') url += `&sort=${sort}`;
        return url;
    }

    function buildAnimeMovieUrl(baseUrl, start, count, filterValues = {}) {
        const type = filterValues.anime_type || 'all';
        const region = filterValues.region || 'all';
        const year = filterValues.year || 'all';
        const sort = filterValues.sort || 'recommend';

        const selectedCategories = { '类型': '动画' };
        const tags = ['动画'];

        // 类型（动漫子类型）
        if (type !== 'all') tags.push(type);
        // 地区
        if (region !== 'all') { selectedCategories['地区'] = region; tags.push(region); }
        // 年代
        if (year !== 'all') tags.push(year);

        let url = `${baseUrl}${DOUBAN_ENDPOINTS.movie_recommend}?refresh=0&start=${start}&count=${count}&selected_categories=${encodeURIComponent(JSON.stringify(selectedCategories))}&uncollect=false&score_range=0,10&tags=${encodeURIComponent(tags.join(','))}`;
        if (sort !== 'recommend') url += `&sort=${sort}`;
        return url;
    }

    function buildVarietyUrl(baseUrl, start, count, filterValues = {}) {
        const type = filterValues.variety_type || 'all';
        const region = filterValues.region || 'all';
        const year = filterValues.year || 'all';
        const platform = filterValues.platform || 'all';
        const sort = filterValues.sort || 'recommend';

        // 综艺的selected_categories：类型为空或具体类型，形式固定为综艺
        const selectedCategories = { '类型': type !== 'all' ? type : '', '形式': '综艺' };
        const tags = ['综艺'];

        // 类型（综艺不在tags里重复加"综艺"，只加具体类型如真人秀）
        if (type !== 'all') tags.push(type);
        // 地区
        if (region !== 'all') { selectedCategories['地区'] = region; tags.push(region); }
        // 年代
        if (year !== 'all') tags.push(year);
        // 平台
        if (platform !== 'all') tags.push(platform);

        let url = `${baseUrl}${DOUBAN_ENDPOINTS.tv_recommend}?refresh=0&start=${start}&count=${count}&selected_categories=${encodeURIComponent(JSON.stringify(selectedCategories))}&uncollect=false&score_range=0,10&tags=${encodeURIComponent(tags.join(','))}`;
        if (sort !== 'recommend') url += `&sort=${sort}`;
        return url;
    }

    async function loadDoubanData(reset = false) {
        if (doubanIsLoading) return;

        doubanIsLoading = true;
        const $results = $(`#douban-results-${doubanCurrentTab}`);

        if (reset) {
            doubanCurrentPage = 1;
            doubanHasMore = true;
            $results.html(`
                <div class="douban-loading">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">正在加载数据...</p>
                </div>
            `);
        } else {
            // 翻页时显示底部加载动画
            $results.find('.douban-load-more').remove();
            $results.append(`
                <div class="douban-load-more">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">加载更多...</p>
                </div>
            `);
        }

        try {
            const url = buildDoubanApiUrl();
            const response = await $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json'
            });

            // 移除加载动画
            $results.find('.douban-loading, .douban-load-more').remove();

            if (reset) {
                // reset时清空内容并移除错误消息
                $results.empty();
            } else {
                // 非reset时只移除错误消息（保留已有数据和容器）
                $results.find('.error-message').remove();
            }

            // 处理返回数据（recommend API返回items，recent_hot API返回subjects）
            // 只保留type是movie或tv的item
            const rawItems = response.items || response.subjects || [];
            const items = rawItems.filter(item => item.type === 'movie' || item.type === 'tv');

            if (items.length > 0) {
                // 获取或创建grid容器（用于加载更多时之前请求失败的情况）
                let $grid = $results.find('.douban-grid');
                if ($grid.length === 0) {
                    $results.append('<div class="douban-grid"></div>');
                    $grid = $results.find('.douban-grid').last();
                }
                // 追加卡片到grid容器
                items.forEach(item => {
                    $grid.append(renderDoubanItem(item));
                });

                doubanHasMore = true;
            } else {
                doubanHasMore = false;
                if (reset) {
                    $results.html('<div class="no-content">没有找到相关内容</div>');
                }
            }

            // 保存当前tab的状态（记录筛选配置）
            const filterValues = getCurrentFilterValues(doubanCurrentTab, doubanCurrentCategory);
            doubanTabCache[doubanCurrentTab] = {
                hasMore: doubanHasMore,
                page: doubanCurrentPage,
                loaded: true,
                isPreloaded: false,  // 不是预加载的数据
                config: {
                    category: doubanCurrentCategory,
                    ...filterValues
                }
            };
        } catch (error) {
            console.error('获取豆瓣数据失败:', error);
            $results.find('.douban-loading, .douban-load-more').remove();

            if (reset) {
                $results.html('<div class="error-message">加载数据失败，请检查网络连接或API设置</div>');
            }
            // 添加"加载更多"按钮，阻止自动滚动加载
            $results.append('<button class="douban-load-more-btn">加载更多</button>');
        } finally {
            doubanIsLoading = false;
            doubanDataLoaded = true;
        }
    }

    /**
     * 预加载所有豆瓣tab数据（带每日缓存检查）
     * 注意：此函数只用于预加载图片，不影响实际的数据请求
     */
    async function preloadAllDoubanData() {
        const tabs = ['movie', 'tv', 'anime', 'variety'];
        const defaultConfigs = {
            movie: { category: 'latest', filter: 'all', pageSize: 18 },
            tv: { category: 'hot', filter: 'tv_domestic', pageSize: 18 },
            anime: { category: 'series', region: '中国大陆', sort: 'U', pageSize: 25 },
            variety: { category: 'hot', filter: 'show_domestic', pageSize: 25 }
        };

        // 豆瓣缓存键映射
        const cacheKeys = {
            movie: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_MOVIE,
            tv: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_TV,
            anime: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_ANIME,
            variety: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_VARIETY
        };

        // 检查缓存是否有效（是否是今天）
        const cachedTimestamp = getSetting(CONFIG.STORAGE_KEYS.DOUBAN_CACHE_TIMESTAMP, null);
        const cacheValid = cachedTimestamp && isSameDay(new Date(parseInt(cachedTimestamp)), new Date());

        for (const tab of tabs) {
            // 如果缓存有效，尝试从本地读取并预加载图片
            if (cacheValid) {
                const cachedData = getJsonSetting(cacheKeys[tab], null);
                if (cachedData && cachedData.html) {
                    // 从缓存的HTML中提取图片URL并预加载
                    const imgMatches = cachedData.html.match(/src="([^"]+)"/g) || [];
                    imgMatches.forEach(match => {
                        const imageUrl = match.match(/src="([^"]+)"/)?.[1];
                        if (imageUrl) fetch(imageUrl, { referrerPolicy: 'no-referrer' }).catch(() => {});
                    });
                    continue;
                }
            }

            // 缓存无效或不存在，发起新请求并预加载图片
            try {
                const config = defaultConfigs[tab];
                const url = buildDoubanApiUrlForPreload(tab, config);
                const response = await $.ajax({ url, method: 'GET', dataType: 'json' });
                // 只保留type是movie或tv的item
                const items = (response.items || response.subjects || []).filter(item => item.type === 'movie' || item.type === 'tv');
                const html = items.length > 0
                    ? `<div class="douban-grid">${items.map(item => renderDoubanItem(item)).join('')}</div>`
                    : '<div class="no-content">没有找到相关内容</div>';

                // 保存到本地缓存（标记为预加载，实际使用时会重新请求）
                const cacheData = {
                    hasMore: items.length >= config.pageSize,
                    page: 1,
                    isPreloaded: true,  // 标记为预加载数据
                    html,
                    config: config
                };

                localStorage.setItem(cacheKeys[tab], JSON.stringify(cacheData));

                // 预加载图片
                items.forEach(item => {
                    const imageUrl = getDoubanProxiedImageUrl(item.pic?.large || item.pic?.normal || '');
                    if (imageUrl) fetch(imageUrl, { referrerPolicy: 'no-referrer' }).catch(() => {});
                });
            } catch (e) {
                console.error(`预加载豆瓣${tab}数据失败:`, e);
            }
        }

        // 更新缓存时间戳
        localStorage.setItem(CONFIG.STORAGE_KEYS.DOUBAN_CACHE_TIMESTAMP, new Date().getTime());
    }

    /**
     * 获取当前筛选选项的值
     * @param {string} tab - 当前tab
     * @param {string} category - 当前分类
     * @returns {Object} - 当前筛选选项的值
     */
    function getCurrentFilterValues(tab, category) {
        const filterKey = `${tab}_${category}`;
        const filterConfig = DOUBAN_CATEGORY_FILTERS[filterKey];

        if (!filterConfig) {
            return {};
        }

        if (filterConfig.type === 'capsule') {
            const activeOption = $('.douban-filter .filter-option.active').data('value');
            return { filter: activeOption };
        } else if (filterConfig.type === 'dropdown') {
            const values = {};
            filterConfig.fields.forEach(field => {
                const activeItem = $(`.ph-dd-wrap[data-type="${field}"] .ph-dd-item.active`);
                values[field] = activeItem.data('value') || 'all';
            });
            return values;
        }

        return {};
    }

    /**
     * 检查当前筛选是否是默认配置
     * 只有默认配置才使用预加载的缓存
     */
    function isDefaultFilter(tab, category, filterValues) {
        const defaultConfigs = {
            movie: { category: 'latest', filter: 'all' },
            tv: { category: 'hot', filter: 'tv_domestic' },
            anime: { category: 'series', region: '中国大陆', sort: 'U' },
            variety: { category: 'hot', filter: 'show_domestic' }
        };

        const defaultConfig = defaultConfigs[tab];
        if (!defaultConfig) return false;

        // 检查category是否匹配
        if (category !== defaultConfig.category) return false;

        // 如果filterValues为空，视为默认配置（初始化时DOM未渲染）
        if (!filterValues || Object.keys(filterValues).length === 0) return true;

        // 检查筛选值
        if (tab === 'anime' && category === 'series') {
            // 动漫-番剧：检查region和sort（all视为默认）
            if (filterValues.region && filterValues.region !== 'all' && filterValues.region !== '中国大陆') return false;
            if (filterValues.sort && filterValues.sort !== 'all' && filterValues.sort !== 'U') return false;
        } else {
            // 其他情况检查filter
            if (filterValues.filter !== defaultConfig.filter) return false;
        }

        return true;
    }

    function renderDoubanItem(item) {
        // 兼容不同API返回的数据结构
        // recommend API: pic.large/pic.normal, rating.value
        // recent_hot API: cover.url 或 cover_url, rating.value 或 rate
        let imageUrl = item.pic?.large || item.pic?.normal || item.cover?.url || item.cover_url || '';
        imageUrl = getDoubanProxiedImageUrl(imageUrl);

        const rating = item.rating?.value || item.rate;
        const ratingHtml = rating ? `<div class="douban-rating">${rating}</div>` : '';
        const title = item.title || item.name || '';
        const doubanUrl = `https://movie.douban.com/subject/${item.id}/`;

        return `
            <div class="douban-card" data-id="${item.id}" data-title="${title}" data-douban-url="${doubanUrl}">
                <div class="douban-image-container">
                    <a href="${doubanUrl}" target="_blank" class="douban-link-btn" title="跳转到豆瓣详情页">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                    </a>
                    <img src="${imageUrl}" alt="${title}" class="douban-image" referrerpolicy="no-referrer" loading="lazy" decoding="async" data-nimg="fill">
                    ${ratingHtml}
                </div>
                <div class="douban-title" title="${title}">${title}</div>
                <div class="douban-year">${item.year || ''}</div>
            </div>
        `;
    }

    // =================================================================================
    // 4. 每日放送功能实现 (已优化)
    // =================================================================================

    function renderDailyContent() {
        return `
            <div id="daily-content-container" class="daily-container">
                ${renderLoadingSpinner()}
            </div>
        `;
    }

    function renderLoadingSpinner() {
        return `
            <div class="daily-loading">
                <div class="loading-spinner"></div>
                <p class="loading-text">正在加载每日放送数据...</p>
            </div>
        `;
    }

    /**
     * 检查两个日期是否是同一天
     * @param {Date} d1 - 日期对象1
     * @param {Date} d2 - 日期对象2
     * @returns {boolean}
     */
    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    /**
     * 此函数现在只负责发起网络请求并缓存结果
     */
    function fetchAndCacheDailyData() {
        return new Promise((resolve, reject) => {
            const dailyApi = CONFIG.DEFAULT_DAILY_API;

            $.ajax({
                url: dailyApi,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    // 请求成功后，将数据和当前时间戳存入localStorage
                    localStorage.setItem(CONFIG.STORAGE_KEYS.DAILY_DATA_CACHE, JSON.stringify(data));
                    localStorage.setItem(CONFIG.STORAGE_KEYS.DAILY_DATA_TIMESTAMP, new Date().getTime());
                    resolve(data);
                },
                error: function (xhr, status, error) {
                    console.error('Ajax请求失败:', status, error);
                    reject(new Error(`请求失败: ${status}`));
                }
            });
        });
    }

    /**
     * 获取每日放送数据的主函数，包含缓存逻辑
     * @returns {Promise} - 返回一个解析后为API数据的Promise
     */
    function getDailyData() {
        const cachedData = getJsonSetting(CONFIG.STORAGE_KEYS.DAILY_DATA_CACHE, null);
        const cachedTimestamp = getSetting(CONFIG.STORAGE_KEYS.DAILY_DATA_TIMESTAMP, null);

        // 检查是否存在缓存，并且缓存时间戳是今天
        if (cachedData && cachedTimestamp && isSameDay(new Date(parseInt(cachedTimestamp)), new Date())) {
            // 如果缓存有效，直接返回一个已解析的Promise，值为缓存数据
            return Promise.resolve(cachedData);
        } else {
            // 否则，发起新的网络请求
            return fetchAndCacheDailyData();
        }
    }

    /**
     * 处理和渲染函数，现在接收一个Promise作为参数
     * @param {Promise} dataPromise - 包含每日放送数据的Promise
     */
    async function processAndRenderDailyData(dataPromise) {
        const $container = $('#daily-content-container');

        // 如果容器不存在或已被移除，则中止
        if ($container.length === 0) return;

        // 立即显示加载动画
        $container.html(renderLoadingSpinner());

        let data;
        try {
            // 等待传入的Promise完成
            data = await dataPromise;
        } catch (error) {
            console.error('获取每日放送数据失败:', error);
            $container.html('<div class="error-message">加载数据失败，请检查网络连接或API设置</div>');
            showNotification('获取每日放送数据失败，请检查API设置', 'error');
            return;
        }

        // 调整today的计算方式，使其对应新的星期顺序（星期一为0，星期日为6）
        const today = (new Date().getDay() + 6) % 7;
        const weekTabsHtml = CONFIG.WEEK_DAYS.map((day, index) => {
            const isActive = index === today ? 'active' : '';
            return `<button class="week-tab ${isActive}" data-weekday="${index}">${day}</button>`;
        }).join('');

        const weekContentHtml = CONFIG.WEEK_DAYS.map((_, index) => {
            const isActive = index === today ? 'active' : '';
            return `<div class="week-content ${isActive}" id="weekday-${index}"></div>`;
        }).join('');

        const dailyHtml = `
            <div class="daily-tabs-container">
                <div class="week-tabs">${weekTabsHtml}</div>
                <div class="week-contents">${weekContentHtml}</div>
            </div>
        `;

        $container.html(dailyHtml);

        if (Array.isArray(data)) {
            data.forEach((weekdayData, index) => {
                if (weekdayData && weekdayData.items) {
                    // 直接使用index作为索引
                    renderWeekdayContent(index, weekdayData.items);
                }
            });
        } else if (typeof data === 'object') {
            Object.keys(data).forEach(key => {
                const weekdayIndex = parseInt(key);
                if (!isNaN(weekdayIndex) && weekdayIndex >= 0 && weekdayIndex < 7) {
                    // 直接使用weekdayIndex作为索引
                    renderWeekdayContent(weekdayIndex, data[key]);
                }
            });
        }

        $('.week-tab').on('click', function () {
            const weekday = $(this).data('weekday');
            $(this).addClass('active').siblings().removeClass('active');
            $(`#weekday-${weekday}`).addClass('active').siblings().removeClass('active');
        });

        dailyDataLoaded = true;
    }

    /**
     * 获取Bangumi的自定义跳转URL
     * @param {string} bangumiId - Bangumi的ID
     * @returns {string|null} - 自定义URL或null
     */
    function getBangumiCustomUrl(bangumiId) {
        const customUrls = getJsonSetting(CONFIG.STORAGE_KEYS.BANGUMI_CUSTOM_URL, {});
        const item = customUrls[bangumiId];
        // 兼容旧格式（直接存URL字符串）和新格式（对象）
        if (typeof item === 'string') return item;
        return item?.url || null;
    }

    /**
     * 保存Bangumi的自定义跳转URL
     * @param {string} bangumiId - Bangumi的ID
     * @param {string} url - 自定义URL
     * @param {string} name - 名称（可选）
     */
    function saveBangumiCustomUrl(bangumiId, url, name = '') {
        const customUrls = getJsonSetting(CONFIG.STORAGE_KEYS.BANGUMI_CUSTOM_URL, {});
        if (url) {
            const existing = customUrls[bangumiId];
            customUrls[bangumiId] = {
                url,
                name: name || (typeof existing === 'object' ? existing.name : '') || bangumiId,
                time: Date.now()
            };
        } else {
            delete customUrls[bangumiId];
        }
        localStorage.setItem(CONFIG.STORAGE_KEYS.BANGUMI_CUSTOM_URL, JSON.stringify(customUrls));
    }

    /**
     * 获取豆瓣的自定义跳转URL
     */
    function getDoubanCustomUrl(doubanId) {
        const customUrls = getJsonSetting('douban_id_custom_jump_url', {});
        const key = `douban_${doubanId}`;
        const item = customUrls[key];
        if (typeof item === 'string') return item;
        return item?.url || null;
    }

    /**
     * 保存豆瓣的自定义跳转URL
     */
    function saveDoubanCustomUrl(doubanId, url, name = '') {
        const customUrls = getJsonSetting('douban_id_custom_jump_url', {});
        const key = `douban_${doubanId}`;
        if (url) {
            const existing = customUrls[key];
            customUrls[key] = {
                url,
                name: name || (typeof existing === 'object' ? existing.name : '') || doubanId,
                time: Date.now()
            };
        } else {
            delete customUrls[key];
        }
        localStorage.setItem('douban_id_custom_jump_url', JSON.stringify(customUrls));
    }

    /**
     * 获取豆瓣卡片的每日放送联动设置
     * @param {string} doubanId - 豆瓣ID
     * @returns {object|null} - 联动数据 {weekdays, title, imageUrl} 或 null
     */
    function getDoubanDailyLink(doubanId) {
        const links = getJsonSetting(CONFIG.STORAGE_KEYS.DOUBAN_DAILY_LINK, {});
        const key = `douban_${doubanId}`;
        const data = links[key];
        if (!data) return null;
        // 兼容旧格式（单个weekday）
        if (typeof data.weekday === 'number') {
            return { ...data, weekdays: [data.weekday] };
        }
        return data;
    }

    /**
     * 保存豆瓣卡片的每日放送联动设置
     * @param {string} doubanId - 豆瓣ID
     * @param {Array} weekdays - 星期数组(0-6)，空数组表示不联动
     * @param {string} title - 标题
     * @param {string} imageUrl - 图片URL
     */
    function saveDoubanDailyLink(doubanId, weekdays, title = '', imageUrl = '') {
        const links = getJsonSetting(CONFIG.STORAGE_KEYS.DOUBAN_DAILY_LINK, {});
        const key = `douban_${doubanId}`;
        if (!weekdays || weekdays.length === 0) {
            delete links[key];
        } else {
            links[key] = { weekdays, title, imageUrl };
        }
        localStorage.setItem(CONFIG.STORAGE_KEYS.DOUBAN_DAILY_LINK, JSON.stringify(links));
    }

    /**
     * 获取指定星期的所有联动豆瓣卡片
     * @param {number} weekday - 星期几(0-6)
     * @returns {Array} - 联动卡片数组
     */
    function getLinkedDoubanCards(weekday) {
        const links = getJsonSetting(CONFIG.STORAGE_KEYS.DOUBAN_DAILY_LINK, {});
        return Object.entries(links)
            .filter(([_, data]) => {
                // 兼容旧格式
                if (typeof data.weekday === 'number') return data.weekday === weekday;
                return data.weekdays && data.weekdays.includes(weekday);
            })
            .map(([key, data]) => ({ id: key.replace(/^douban_/, ''), ...data }));
    }

    /**
     * 确保URL有协议头
     */
    function ensureProtocol(url) {
        if (!url) return url;
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
    }

    /**
     * 渲染管理跳转内容
     */
    function renderTagsManageContent() {
        return `
            <div class="tags-manage-container">
                <div class="tags-filter-bar">
                    <div class="custom-select-wrapper ph-select" id="tags-type-filter-wrapper">
                        <div class="custom-select-trigger" tabindex="0"><span class="custom-select-value">全部</span><svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div>
                        <div class="custom-select-options">
                            <div class="custom-select-option selected hover:!text-white" data-value="all"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>全部</span></div>
                            <div class="custom-select-option hover:!text-white" data-value="bangumi"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>每日放送</span></div>
                            <div class="custom-select-option hover:!text-white" data-value="douban"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>豆瓣查找</span></div>
                        </div>
                        <input type="hidden" id="tags-type-filter" value="all">
                    </div>
                    <input type="text" id="tags-search-input" class="tags-search" placeholder="搜索名称或URL..." style="border: 1px solid #d1d5db !important; border-color: #d1d5db !important; background: white !important; color: #374151 !important;">
                    <div class="custom-select-wrapper ph-select" id="tags-sort-filter-wrapper">
                        <div class="custom-select-trigger" tabindex="0"><span class="custom-select-value">最新优先</span><svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div>
                        <div class="custom-select-options">
                            <div class="custom-select-option selected hover:!text-white" data-value="desc"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>最新优先</span></div>
                            <div class="custom-select-option hover:!text-white" data-value="asc"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>最早优先</span></div>
                        </div>
                        <input type="hidden" id="tags-sort-filter" value="desc">
                    </div>
                </div>
                <div id="tags-list" class="ph-tags-list"></div>
            </div>
        `;
    }

    /**
     * 获取所有自定义URL数据
     */
    function getAllCustomUrls() {
        const bangumiUrls = getJsonSetting(CONFIG.STORAGE_KEYS.BANGUMI_CUSTOM_URL, {});
        const doubanUrls = getJsonSetting('douban_id_custom_jump_url', {});
        const result = [];

        // 处理bangumi数据
        Object.entries(bangumiUrls).forEach(([id, item]) => {
            const url = typeof item === 'string' ? item : item?.url;
            if (url) {
                result.push({
                    type: 'bangumi',
                    id,
                    url,
                    name: (typeof item === 'object' ? item.name : '') || id,
                    time: (typeof item === 'object' ? item.time : 0) || 0
                });
            }
        });

        // 处理douban数据
        Object.entries(doubanUrls).forEach(([key, item]) => {
            const url = typeof item === 'string' ? item : item?.url;
            if (url) {
                const id = key.replace(/^douban_/, '');
                result.push({
                    type: 'douban',
                    id,
                    url,
                    name: (typeof item === 'object' ? item.name : '') || id,
                    time: (typeof item === 'object' ? item.time : 0) || 0
                });
            }
        });

        return result;
    }

    /**
     * 渲染标签列表
     */
    function renderTagsList() {
        const typeFilter = $('#tags-type-filter').val();
        const searchText = $('#tags-search-input').val().toLowerCase();
        const sortOrder = $('#tags-sort-filter').val();

        let items = getAllCustomUrls();

        // 筛选类型
        if (typeFilter !== 'all') {
            items = items.filter(item => item.type === typeFilter);
        }

        // 搜索筛选
        if (searchText) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(searchText) ||
                item.url.toLowerCase().includes(searchText)
            );
        }

        // 排序
        items.sort((a, b) => sortOrder === 'desc' ? b.time - a.time : a.time - b.time);

        const $list = $('#tags-list');
        if (items.length === 0) {
            $list.html('<div class="no-content">暂无自定义URL数据</div>');
            return;
        }

        const html = items.map(item => {
            const timeStr = item.time ? new Date(item.time).toLocaleString() : '未知';
            return `
                <div class="tag-item" data-type="${item.type}" data-id="${item.id}">
                    <span class="tag-label tag-${item.type}">${item.type === 'bangumi' ? '每日放送' : '豆瓣查找'}</span>
                    <span class="tag-name" title="${item.name}">${item.name}</span>
                    <span class="tag-url" title="${item.url}">${item.url}</span>
                    <span class="tag-time">${timeStr}</span>
                    <button class="tag-btn tag-edit" title="编辑">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="tag-btn tag-delete" title="删除">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            `;
        }).join('');

        $list.html(html);
    }

    /**
     * 渲染管理收藏内容
     */
    function renderFavoritesContent() {
        return `
            <div class="favorites-container">
                <div class="favorites-filter-bar">
                    <div class="custom-select-wrapper ph-select" id="favorites-sort-filter-wrapper">
                        <div class="custom-select-trigger" tabindex="0"><span class="custom-select-value">最新优先</span><svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div>
                        <div class="custom-select-options">
                            <div class="custom-select-option selected hover:!text-white" data-value="desc"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>最新优先</span></div>
                            <div class="custom-select-option hover:!text-white" data-value="asc"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>最早优先</span></div>
                        </div>
                        <input type="hidden" id="favorites-sort-filter" value="desc">
                    </div>
                    <input type="text" id="favorites-search-input" class="favorites-search" placeholder="搜索名称或URL...">
                    <div><button id="favorites-add-btn" class="favorites-add-btn">+ 新增</button></div>
                </div>
                <div id="favorites-list" class="favorites-list"></div>
            </div>
        `;
    }

    /**
     * 获取所有收藏数据
     */
    function getAllFavorites() {
        return getJsonSetting('user_favorites', []);
    }

    /**
     * 保存收藏数据
     */
    function saveFavorites(favorites) {
        localStorage.setItem('user_favorites', JSON.stringify(favorites));
    }

    /**
     * 渲染收藏列表
     */
    function renderFavoritesList() {
        const searchText = $('#favorites-search-input').val()?.toLowerCase() || '';
        const sortOrder = $('#favorites-sort-filter').val() || 'desc';

        let items = getAllFavorites();

        // 搜索筛选
        if (searchText) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(searchText) ||
                item.url.toLowerCase().includes(searchText)
            );
        }

        // 排序
        items.sort((a, b) => sortOrder === 'desc' ? b.time - a.time : a.time - b.time);

        const $list = $('#favorites-list');
        if (items.length === 0) {
            $list.html('<div class="no-content">暂无收藏数据</div>');
            return;
        }

        const html = items.map(item => {
            const timeStr = item.time ? new Date(item.time).toLocaleString() : '未知';
            return `
                <div class="favorite-item" data-id="${item.id}">
                    <span class="favorite-name" title="${item.name}">${item.name}</span>
                    <span class="favorite-url" title="${item.url}">${item.url}</span>
                    <span class="favorite-time">${timeStr}</span>
                    <button class="favorite-btn favorite-jump" title="跳转">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </button>
                    <button class="favorite-btn favorite-edit" title="编辑">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="favorite-btn favorite-delete" title="删除">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            `;
        }).join('');

        $list.html(html);
    }

    function renderWeekdayContent(weekdayIndex, items) {
        const $container = $(`#weekday-${weekdayIndex}`);

        if (!items || items.length === 0) {
            $container.html('<div class="no-content">该日没有放送内容</div>');
        } else {
            const itemsHtml = items.map(item => {
                let imageUrl, name, rating, bangumiId;

                // 处理不同数据结构
                if (item.images && item.images.large) {
                    // BGM.tv API结构
                    imageUrl = item.images.large;
                    name = item.name_cn || item.name;
                    rating = item.rating ? item.rating.score : null;
                    bangumiId = item.id ? `bgm_${item.id}` : null;
                } else if (item.image) {
                    // 其他API结构
                    imageUrl = item.image;
                    name = item.title || item.name;
                    rating = item.score || item.rating;
                    bangumiId = item.id ? `other_${item.id}` : `name_${name}`;
                }

                const ratingHtml = rating ? `<div class="anime-rating">${rating}</div>` : '';

                // 添加data-id属性存储唯一ID，方便后续自定义跳转
                return `
                    <div class="anime-card" data-id="${bangumiId}" data-name="${name}" data-source="bangumi">
                        <div class="anime-image-container">
                            <img src="${imageUrl}" alt="${name}" class="anime-image">
                            ${ratingHtml}
                        </div>
                        <div class="anime-title" title="${name}">${name}</div>
                    </div>
                `;
            }).join('');

            $container.html(`<div class="anime-grid">${itemsHtml}</div>`);
        }

        // 追加联动的豆瓣卡片
        appendLinkedDoubanCards(weekdayIndex);
    }

    /**
     * 追加联动的豆瓣卡片到指定星期
     */
    function appendLinkedDoubanCards(weekdayIndex) {
        const $container = $(`#weekday-${weekdayIndex}`);
        let $grid = $container.find('.anime-grid');

        // 移除已存在的联动卡片
        $grid.find('.anime-card[data-source="douban"]').remove();

        const linkedCards = getLinkedDoubanCards(weekdayIndex);
        if (linkedCards.length === 0) return;

        // 如果没有grid容器，创建一个
        if ($grid.length === 0) {
            $container.html('<div class="anime-grid"></div>');
            $grid = $container.find('.anime-grid');
        }

        // 渲染联动卡片
        const linkedHtml = linkedCards.map(card => `
            <div class="anime-card douban-linked-card" data-id="${card.id}" data-title="${card.title}" data-source="douban" data-douban-url="https://movie.douban.com/subject/${card.id}/">
                <div class="anime-image-container">
                    <a href="https://movie.douban.com/subject/${card.id}/" target="_blank" class="douban-link-btn" title="跳转到豆瓣详情页">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                    </a>
                    <img src="${card.imageUrl}" alt="${card.title}" class="anime-image" referrerpolicy="no-referrer">
                </div>
                <div class="anime-title" title="${card.title}">${card.title}</div>
            </div>
        `).join('');

        // 根据设置决定追加到首部还是尾部（默认首部）
        const position = localStorage.getItem(CONFIG.STORAGE_KEYS.DAILY_LINK_POSITION);
        if (position === 'tail') {
            $grid.append(linkedHtml);
        } else {
            $grid.prepend(linkedHtml);
        }
    }

    /**
     * 刷新所有星期的联动豆瓣卡片
     */
    function refreshLinkedDoubanCards() {
        for (let i = 0; i < 7; i++) {
            const $container = $(`#weekday-${i}`);
            if ($container.length > 0) {
                appendLinkedDoubanCards(i);
            }
        }
    }

    // =================================================================================
    // 5. 状态与工具函数 (State & Utils)
    // =================================================================================

    const getSetting = (key, defaultValue) => localStorage.getItem(key) || defaultValue;
    const getJsonSetting = (key, defaultValue) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    };

    /**
     * 获取豆瓣处理后的图片URL
     * @param {string} originalUrl - 原始图片URL
     * @returns {string} - 处理后的图片URL
     */
    function getDoubanProxiedImageUrl(originalUrl) {
        const imageUrl = getSetting(CONFIG.STORAGE_KEYS.DOUBAN_IMAGE_URL, '');
        const mode = getSetting(CONFIG.STORAGE_KEYS.DOUBAN_IMAGE_MODE, 'cdn');
        if (!originalUrl || originalUrl.startsWith('data:')) return originalUrl;

        // 替换为小尺寸图片
        originalUrl = originalUrl.replace('m_ratio_poster', 's_ratio_poster');

        if (!imageUrl) return originalUrl;

        if (mode === 'cdn') {
            // CDN模式：替换原图片的host
            try {
                const url = new URL(originalUrl);
                const cdnUrl = new URL(imageUrl);
                // 使用CDN的协议和host，保留原图片的pathname、search和hash
                return `${cdnUrl.protocol}//${cdnUrl.host}${url.pathname}${url.search}${url.hash}`;
            } catch {
                return originalUrl;
            }
        } else {
            // 代理模式：尾部直接拼接原图片URL
            return imageUrl.replace(/\/+$/, '') + '/' + originalUrl;
        }
    }

    /**
     * 批量加载豆瓣图片（img已设置referrerpolicy="no-referrer"）
     */
    function getTabOrder() {
        const savedOrder = getJsonSetting(CONFIG.STORAGE_KEYS.TAB_ORDER, DEFAULT_TABS_ORDER);
        const savedIds = new Set(savedOrder.map(tab => tab.id));
        const defaultTabsToAdd = DEFAULT_TABS_ORDER.filter(tab => !savedIds.has(tab.id));
        return [...savedOrder, ...defaultTabsToAdd];
    }

    function initCustomSelect(wrapperId, inputId, storageKey, defaultValue) {
        const mode = getSetting(storageKey, defaultValue);
        $(`#${inputId}`).val(mode);
        const $wrapper = $(`#${wrapperId}`);
        const $options = $wrapper.find('.custom-select-option');
        const $valueDisplay = $wrapper.find('.custom-select-value');
        $options.removeClass('selected').filter(`[data-value="${mode}"]`).addClass('selected');
        $valueDisplay.text($options.filter('.selected').find('span').text());
        $wrapper.removeClass('open');
        $wrapper.find('.custom-select-trigger').off('click').on('click', function (e) { e.stopPropagation(); $('.custom-select-wrapper').not($wrapper).removeClass('open'); $wrapper.toggleClass('open'); });
        $options.off('click').on('click', function (e) { e.stopPropagation(); const val = $(this).data('value'); $options.removeClass('selected'); $(this).addClass('selected'); $valueDisplay.text($(this).find('span').text()); $(`#${inputId}`).val(val); $wrapper.removeClass('open'); });
    }

    function showNotification(message, icon = 'success') {
        Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        }).fire({ icon, title: message });
    }

    // =================================================================================
    // 6. UI渲染与更新 (UI Rendering & Updates)
    // =================================================================================

    function renderTabs(tabOrder, preserveActiveTab = true, preserveContent = false) {
        const $mainModal = $(CONFIG.SELECTORS.MAIN_MODAL);
        const $tabsHeader = $mainModal.find(CONFIG.SELECTORS.TABS_HEADER);
        const $tabContent = $mainModal.find(CONFIG.SELECTORS.TAB_CONTENT);

        // 记录当前激活的标签页
        const activeTabId = preserveActiveTab ? currentActiveTabId : null;

        // 如果需要保留内容，则只重新排序tabs header
        if (preserveContent) {
            const tabButtonsHtml = tabOrder.map(tab => `
                <button class="tab-button" data-tab="${tab.id}">${TABS_CONFIG[tab.id]?.label || tab.label}</button>
            `).join('');

            $tabsHeader.html(tabButtonsHtml);

            // 恢复或设置激活的标签页
            let $activeTabButton;
            if (activeTabId && $tabsHeader.find(`[data-tab="${activeTabId}"]`).length > 0) {
                $activeTabButton = $tabsHeader.find(`[data-tab="${activeTabId}"]`);
            } else {
                $activeTabButton = $tabsHeader.children().first();
            }

            $activeTabButton.addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);
            $(`#${$activeTabButton.data('tab')}`).addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);

            // 更新当前激活的标签页ID
            currentActiveTabId = $activeTabButton.data('tab');
            return;
        }

        const tabButtonsHtml = tabOrder.map(tab => `
            <button class="tab-button" data-tab="${tab.id}">${TABS_CONFIG[tab.id]?.label || tab.label}</button>
        `).join('');

        const tabPanesHtml = tabOrder.map(tab => `
            <div class="tab-pane" id="${tab.id}">
                ${TABS_CONFIG[tab.id]?.renderContent() || '<div>内容未定义</div>'}
            </div>
        `).join('');

        $tabsHeader.html(tabButtonsHtml);
        $tabContent.html(tabPanesHtml);

        // 恢复或设置激活的标签页
        let $activeTabButton;
        if (activeTabId && $tabsHeader.find(`[data-tab="${activeTabId}"]`).length > 0) {
            $activeTabButton = $tabsHeader.find(`[data-tab="${activeTabId}"]`);
        } else {
            $activeTabButton = $tabsHeader.children().first();
        }

        $activeTabButton.addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);
        $(`#${$activeTabButton.data('tab')}`).addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);

        // 更新当前激活的标签页ID
        currentActiveTabId = $activeTabButton.data('tab');

        // 如果当前激活的标签页是tab1（每日放送），且未加载过数据
        if (currentActiveTabId === 'tab1' && !dailyDataLoaded) {
            processAndRenderDailyData(dailyDataPromise);
        } else if (currentActiveTabId === 'tab2' && !doubanDataLoaded) {
            // 如果当前激活的标签页是tab2（豆瓣查找），且未加载过数据
            setTimeout(() => {
                updateDoubanCategoryOptions();
                updateDoubanFilterOptions();
                // 检查是否是默认筛选条件，只有默认筛选才使用预加载缓存
                const cache = doubanTabCache[doubanCurrentTab];
                const filterValues = getCurrentFilterValues(doubanCurrentTab, doubanCurrentCategory);

                if (cache?.isPreloaded && isDefaultFilter(doubanCurrentTab, doubanCurrentCategory, filterValues)) {
                    $(`#douban-results-${doubanCurrentTab}`).html(cache.html);
                    doubanHasMore = cache.hasMore;
                    doubanCurrentPage = cache.page;
                    doubanDataLoaded = true;
                } else {
                    loadDoubanData(true);
                }
            }, 150);
        }
    }

    function applyTabPosition(position) {
        $(CONFIG.SELECTORS.TABS_CONTAINER)
            .removeClass('tabs-top tabs-left tabs-right')
            .addClass(`tabs-${position}`);
    }

    // 创建嵌合到页面头部的图标
    function createEmbeddedButton() {
        // 查找 header 标签
        const $header = $('header');
        if ($header.length === 0) return false;

        // 查找 header 里的 .header-buttons
        const $headerButtons = $header.find('.header-buttons');
        if ($headerButtons.length === 0) return false;

        // 避免重复创建
        if ($('#custom-player-helper').length > 0) return true;

        const embeddedButton = $(
            '<span id="custom-player-helper" class="btn no-text icon btn-flat" title="观影助手">' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 d-icon" fill="currentColor" viewBox="0 0 16 16">' +
            '<path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z"/>' +
            '</svg>' +
            '</span>'
        );

        // 添加到 header 的 .header-buttons 里面
        $headerButtons.prepend(embeddedButton);
        return true;
    }

    // 等待目标元素出现后创建按钮
    function waitForElementAndCreateButton() {
        // 如果已经存在，直接创建
        if (createEmbeddedButton()) return;

        // 使用 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver((mutations, obs) => {
            if (createEmbeddedButton()) {
                obs.disconnect(); // 创建成功后停止监听
            }
        });

        // 开始监听 document.body 的子元素变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 10秒后自动停止监听（避免无限等待）
        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }

    // 移除嵌合到页面头部的图标
    function removeEmbeddedButton() {
        $('#custom-player-helper').remove();
    }

    // 切换显示模式
    function toggleDisplayMode(showInner) {
        showLogoInner = showInner;
        if (showInner) {
            // 隐藏悬浮按钮，显示嵌合图标
            $(CONFIG.SELECTORS.MAIN_BUTTON).hide();
            removeEmbeddedButton();
            waitForElementAndCreateButton();
        } else {
            // 显示悬浮按钮，移除嵌合图标
            $(CONFIG.SELECTORS.MAIN_BUTTON).show();
            removeEmbeddedButton();
        }
    }

    function createMainButton() {
        const mainButton = $(`
            <button id="${CONFIG.SELECTORS.MAIN_BUTTON.substring(1)}" class="main-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 d-icon" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z"/>
                </svg>
            </button>
        `);
        $('body').append(mainButton);

        // 检查是否在可嵌合的网站
        if (canEmbedHosts.includes(window.location.hostname)) {
            // 从 localStorage 读取设置，默认为 true（嵌合图标模式）
            const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.SHOW_LOGO_INNER);
            const savedMode = saved === null ? true : saved === 'true';
            toggleDisplayMode(savedMode);
        }
    }

    function createMainModal() {
        const tabPosition = getSetting(CONFIG.STORAGE_KEYS.TAB_POSITION, 'top');
        const mainModal = $(`
            <div id="${CONFIG.SELECTORS.MAIN_MODAL.substring(1)}" class="${CONFIG.CLASSES.HIDDEN} fixed inset-0 z-[10000] overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div class="relative transform overflow-hidden rounded-2xl bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 text-left shadow-xl transition-all sm:my-8 w-[80vw] h-[80vh] flex flex-col">
                        <div class="flex-shrink-0 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-4 rounded-t-2xl">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">助手</h3>
                            <div class="flex space-x-2">
                                <button id="elegant-theme-toggle" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                </button>
                                <button id="elegant-settings-button" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                                <button id="elegant-close-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                        <div class="flex-grow overflow-hidden">
                            <div class="tabs-container tabs-${tabPosition} h-full">
                                <div class="tabs-header"></div>
                                <div class="tab-content-wrapper">
                                    <div class="tab-content"></div>
                                    <button id="back-to-top" class="back-to-top hidden">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $('body').append(mainModal);
        renderTabs(getTabOrder());
    }

    function createSettingsModal() {
        const settingsModal = $(`
            <div id="${CONFIG.SELECTORS.SETTINGS_MODAL.substring(1)}" class="${CONFIG.CLASSES.HIDDEN} fixed inset-0 z-[10000] overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div class="relative transform overflow-hidden rounded-2xl bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 text-left shadow-xl transition-all sm:my-8 w-[80vw] h-[80vh] flex flex-col">
                        <div class="flex-shrink-0 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-4 rounded-t-2xl">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">设置</h3>
                            <button id="elegant-close-settings" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div class="flex-grow overflow-hidden flex">
                            <div class="settings-tabs-nav w-32 bg-white dark:bg-gray-900 p-2 border-r border-gray-200 dark:border-gray-700">
                                <div class="tabs-nav-container h-full flex items-center"><div class="tabs-nav-list w-full">
                                    <button class="settings-tab-button active" data-settings-tab="api">API相关</button>
                                    <button class="settings-tab-button" data-settings-tab="tabs">Tab相关</button>
                                </div></div>
                            </div>
                            <div class="settings-tab-content flex-1 overflow-hidden">
                                <div class="settings-content-container h-full flex items-center justify-center">
                                    <div class="settings-tab-pane active" id="api-settings">
                                        <div class="settings-form-centered">
                                            <div class="form-row"><label class="form-label"><div class="custom-select-wrapper" id="douban-proxy-mode-wrapper"><div class="custom-select-trigger" tabindex="0"><span class="custom-select-value">豆瓣接口CDN</span></div><div class="custom-select-options"><div class="custom-select-option selected hover:!text-white" data-value="cdn"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>豆瓣接口CDN</span></div><div class="custom-select-option hover:!text-white" data-value="proxy"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>豆瓣API代理</span></div></div><input type="hidden" id="douban-proxy-mode" value="cdn"></div></label><input type="text" class="form-input text-input" data-key="${CONFIG.STORAGE_KEYS.DOUBAN_PROXY}" placeholder="CDN替换host，代理直接拼接" style="padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background-color: #f9fafb; color: #111827; outline: none;"></div>
                                            <div class="form-row"><label class="form-label"><div class="custom-select-wrapper" id="douban-image-mode-wrapper"><div class="custom-select-trigger" tabindex="0"><span class="custom-select-value">豆瓣图片CDN</span></div><div class="custom-select-options"><div class="custom-select-option selected hover:!text-white" data-value="cdn"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>豆瓣图片CDN</span></div><div class="custom-select-option hover:!text-white" data-value="proxy"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>豆瓣图片代理</span></div></div><input type="hidden" id="douban-image-mode" value="cdn"></div></label><input type="text" class="form-input text-input" data-key="${CONFIG.STORAGE_KEYS.DOUBAN_IMAGE_URL}" placeholder="CDN替换host，代理直接拼接" style="padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background-color: #f9fafb; color: #111827; outline: none;"></div>
                                            <div class="form-row"><label class="form-label">点击跳转URL</label><input type="text" class="form-input text-input" data-key="${CONFIG.STORAGE_KEYS.REDIRECT_URL}" placeholder="卡片跳转的全局URL" style="padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background-color: #f9fafb; color: #111827; outline: none;"></div>
                                            <div class="form-row" style="justify-content: center;"><div class="logo-mode-switch"><span class="logo-mode-text-left">每日放送的追加卡片在首部</span><label class="logo-mode-toggle"><input type="checkbox" id="daily-link-position-toggle" data-key="${CONFIG.STORAGE_KEYS.DAILY_LINK_POSITION}"><span class="logo-mode-slider"></span></label><span class="logo-mode-text-right">每日放送的追加卡片在尾部</span></div></div>
                                            <div class="form-row logo-mode-row ${canEmbedHosts.includes(window.location.hostname) ? '' : 'hidden'}" style="justify-content: center;"><div class="logo-mode-switch"><span class="logo-mode-text-left">显示为页面右上角嵌合图标</span><label class="logo-mode-toggle"><input type="checkbox" id="logo-mode-toggle" data-key="${CONFIG.STORAGE_KEYS.SHOW_LOGO_INNER}"><span class="logo-mode-slider"></span></label><span class="logo-mode-text-right">显示为页面右上角悬浮按钮</span></div></div>
                                        </div>
                                    </div>
                                    <div class="settings-tab-pane" id="tabs-settings">
                                        <div class="settings-form-centered">
                                            <div class="form-row"><label class="form-label">Tab位置</label><div class="custom-select-wrapper ph-select ph-select-fixed" id="tab-position-wrapper"><div class="custom-select-trigger" tabindex="0"><span class="custom-select-value">上方</span><svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div><div class="custom-select-options"><div class="custom-select-option selected hover:!text-white" data-value="top"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>上方</span></div><div class="custom-select-option hover:!text-white" data-value="left"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>左侧</span></div><div class="custom-select-option hover:!text-white" data-value="right"><svg class="option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg><span>右侧</span></div></div><input type="hidden" id="elegant-tab-position" value="top"></div></div>
                                            <div class="form-row"><label class="form-label">Tab顺序</label><div class="tab-order-container"><div id="tab-sort-list" class="tab-sort-list"></div><p class="tab-order-hint">拖拽项目可以调整Tab顺序</p></div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-shrink-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-center items-center px-4">
                            <div class="flex space-x-4">
                                <button id="elegant-cancel-settings" class="cancel-btn">取消</button>
                                <button id="elegant-save-settings" class="save-btn">保存设置</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $('body').append(settingsModal);
    }

    function createContextMenu() {
        const weekCheckboxes = CONFIG.WEEK_DAYS.map((day, i) => `
            <label class="daily-link-item" data-weekday="${i}">
                <span class="daily-link-check"></span>
                <span class="daily-link-text">${day}</span>
            </label>
        `).join('');
        const contextMenu = $(`
            <div id="${CONFIG.SELECTORS.CONTEXT_MENU.substring(1)}" class="${CONFIG.CLASSES.HIDDEN} context-menu">
                <div class="context-menu-header">
                    <h3>自定义跳转URL</h3>
                    <button id="context-menu-close" class="context-menu-close">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="context-menu-content">
                    <div class="form-row">
                        <label class="form-label">剧集名称</label>
                        <input type="text" id="context-menu-anime-name" class="form-input text-input" readonly>
                    </div>
                    <div class="form-row">
                        <label class="form-label">跳转URL</label>
                        <input type="text" id="context-menu-custom-url" class="form-input text-input" placeholder="为空即使用全局的URL">
                    </div>
                    <div class="form-row douban-only-row" style="display:none;">
                        <label class="form-label">每日放送</label>
                        <div id="context-menu-daily-link" class="daily-link-list">
                            ${weekCheckboxes}
                        </div>
                    </div>
                </div>
                <div class="context-menu-footer">
                    <button id="context-menu-save" class="save-btn">保存</button>
                    <button id="context-menu-reset" class="cancel-btn">重置</button>
                </div>
            </div>
        `);
        $('body').append(contextMenu);
    }

    function initializeSettingsValues() {
        // API inputs
        $('#api-settings .text-input').each(function () {
            const key = $(this).data('key');
            const value = getSetting(key, '');
            $(this).val(value);

            // 记录每日放送API的原始值
            if (key === CONFIG.STORAGE_KEYS.DAILY_API) {
                originalDailyApiValue = value;
            }
        });

        // 设置输入框的暗夜模式内联样式
        const isDark = $('html').hasClass('dark');
        const inputStyle = isDark
            ? 'padding: 10px 14px; border: 1px solid #4b5563; border-radius: 8px; font-size: 14px; color: #e5e7eb !important; outline: none;'
            : 'padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #374151 !important; outline: none;';
        $('#api-settings .text-input').attr('style', inputStyle);
        $('#tags-search-input, #favorites-search-input').attr('style', inputStyle);

        // Tab Position - 自定义下拉框
        const tabPosition = getSetting(CONFIG.STORAGE_KEYS.TAB_POSITION, 'top');
        $('#elegant-tab-position').val(tabPosition);
        initCustomSelect('tab-position-wrapper', 'elegant-tab-position', CONFIG.STORAGE_KEYS.TAB_POSITION, 'top');

        // 豆瓣接口模式 - 自定义下拉框
        initCustomSelect('douban-proxy-mode-wrapper', 'douban-proxy-mode', CONFIG.STORAGE_KEYS.DOUBAN_PROXY_MODE, 'cdn');

        // 豆瓣图片模式 - 自定义下拉框
        initCustomSelect('douban-image-mode-wrapper', 'douban-image-mode', CONFIG.STORAGE_KEYS.DOUBAN_IMAGE_MODE, 'cdn');

        // Logo 显示模式 - 开关（unchecked=嵌合图标，checked=悬浮按钮）
        const savedLogo = localStorage.getItem(CONFIG.STORAGE_KEYS.SHOW_LOGO_INNER);
        const logoMode = savedLogo === null ? true : savedLogo === 'true';
        $('#logo-mode-toggle').prop('checked', !logoMode);

        // 联动卡片位置 - 开关（unchecked=首部，checked=尾部）
        const savedPosition = localStorage.getItem(CONFIG.STORAGE_KEYS.DAILY_LINK_POSITION);
        $('#daily-link-position-toggle').prop('checked', savedPosition === 'tail');

        // Tab Order List
        const tabOrder = getTabOrder();
        const $tabListContainer = $('#tab-sort-list').empty();
        tabOrder.forEach(tab => {
            $tabListContainer.append(`
                <div class="tab-sort-item" data-id="${tab.id}">
                    <div class="tab-drag-handle">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" /></svg>
                    </div>
                    <div class="tab-label">${TABS_CONFIG[tab.id]?.label || tab.label}</div>
                </div>
            `);
        });

        if (window.Sortable) {
            new Sortable($tabListContainer[0], {
                animation: 150,
                ghostClass: 'tab-sort-ghost',
                handle: '.tab-drag-handle',
            });
        }
    }

    // =================================================================================
    // 7. 事件处理 (Event Handlers)
    // =================================================================================

    function bindEvents() {
        const $body = $('body');
        $body.on('click', CONFIG.SELECTORS.MAIN_BUTTON, () => openModal(CONFIG.SELECTORS.MAIN_MODAL));
        // 嵌合图标按钮的点击事件
        $body.on('click', '#custom-player-helper', () => openModal(CONFIG.SELECTORS.MAIN_MODAL));
        $body.on('click', CONFIG.SELECTORS.OVERLAY, closeAllModals);
        $(document).on('keydown', e => { if (e.key === 'Escape') closeAllModals(); });

        const $mainModal = $(CONFIG.SELECTORS.MAIN_MODAL);
        $mainModal.on('click', '#elegant-close-modal', closeAllModals);
        $mainModal.on('click', '#elegant-settings-button', () => switchModals(CONFIG.SELECTORS.MAIN_MODAL, CONFIG.SELECTORS.SETTINGS_MODAL));
        $mainModal.on('click', '#elegant-theme-toggle', toggleTheme);

        $mainModal.on('click', '.tab-button', function () {
            const $this = $(this);
            const tabId = $this.data('tab');
            currentActiveTabId = tabId; // 更新当前激活的标签页ID

            $this.addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);
            $(`#${tabId}`).addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);

            // 仅在未加载过数据时才请求
            if (tabId === 'tab1' && !dailyDataLoaded) {
                processAndRenderDailyData(dailyDataPromise);
            } else if (tabId === 'tab2' && !doubanDataLoaded) {
                setTimeout(() => {
                    updateDoubanCategoryOptions();
                    updateDoubanFilterOptions();
                    // 从localStorage读取预加载缓存
                    const cacheKeys = {
                        movie: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_MOVIE,
                        tv: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_TV,
                        anime: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_ANIME,
                        variety: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_VARIETY
                    };
                    const cachedData = getJsonSetting(cacheKeys[doubanCurrentTab], null);
                    const filterValues = getCurrentFilterValues(doubanCurrentTab, doubanCurrentCategory);

                    if (cachedData?.html && isDefaultFilter(doubanCurrentTab, doubanCurrentCategory, filterValues)) {
                        $(`#douban-results-${doubanCurrentTab}`).html(cachedData.html);
                        doubanHasMore = cachedData.hasMore;
                        doubanCurrentPage = cachedData.page || 1;
                        doubanDataLoaded = true;
                    } else {
                        loadDoubanData(true);
                    }
                }, 100);
            } else if (tabId === 'tab3') {
                renderTagsList();
            } else if (tabId === 'tab4') {
                renderFavoritesList();
            }
        });

        // 管理跳转事件 - 自定义下拉框
        $mainModal.on('click', '#tags-type-filter-wrapper .custom-select-trigger, #tags-sort-filter-wrapper .custom-select-trigger', function(e) {
            e.stopPropagation();
            const $wrapper = $(this).closest('.custom-select-wrapper');
            $('.custom-select-wrapper').not($wrapper).removeClass('open');
            $wrapper.toggleClass('open');
        });
        $mainModal.on('click', '#tags-type-filter-wrapper .custom-select-option, #tags-sort-filter-wrapper .custom-select-option', function(e) {
            e.stopPropagation();
            const $wrapper = $(this).closest('.custom-select-wrapper');
            const val = $(this).data('value');
            $wrapper.find('.custom-select-option').removeClass('selected');
            $(this).addClass('selected');
            $wrapper.find('.custom-select-value').text($(this).find('span').text());
            $wrapper.find('input[type="hidden"]').val(val);
            $wrapper.removeClass('open');
            renderTagsList();
        });
        $mainModal.on('input', '#tags-search-input', renderTagsList);

        $mainModal.on('click', '.tag-delete', function () {
            const $item = $(this).closest('.tag-item');
            const type = $item.data('type');
            const id = $item.data('id');

            if (type === 'douban') {
                saveDoubanCustomUrl(id, '');
            } else {
                saveBangumiCustomUrl(id, '');
            }
            showNotification('已删除');
            renderTagsList();
        });

        $mainModal.on('click', '.tag-edit', function () {
            const $item = $(this).closest('.tag-item');
            const type = $item.data('type');
            const id = $item.data('id');
            const name = $item.find('.tag-name').text();
            const url = $item.find('.tag-url').text();

            Swal.fire({
                title: '编辑自定义URL',
                html: `
                    <div style="margin-bottom:12px;color:#666;font-size:14px;">名称：${name}</div>
                    <input id="swal-url" class="swal2-input" placeholder="请输入URL" value="${url}">
                `,
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                preConfirm: () => {
                    const value = $('#swal-url').val().trim();
                    if (!value) { Swal.showValidationMessage('请输入URL'); return false; }
                    return value;
                }
            }).then(result => {
                if (result.isConfirmed) {
                    if (type === 'douban') {
                        saveDoubanCustomUrl(id, result.value, name);
                    } else {
                        saveBangumiCustomUrl(id, result.value, name);
                    }
                    showNotification('已保存');
                    renderTagsList();
                }
            });
        });

        // 管理收藏事件 - 自定义下拉框
        $mainModal.on('click', '#favorites-sort-filter-wrapper .custom-select-trigger', function(e) {
            e.stopPropagation();
            const $wrapper = $(this).closest('.custom-select-wrapper');
            $('.custom-select-wrapper').not($wrapper).removeClass('open');
            $wrapper.toggleClass('open');
        });
        $mainModal.on('click', '#favorites-sort-filter-wrapper .custom-select-option', function(e) {
            e.stopPropagation();
            const $wrapper = $(this).closest('.custom-select-wrapper');
            const val = $(this).data('value');
            $wrapper.find('.custom-select-option').removeClass('selected');
            $(this).addClass('selected');
            $wrapper.find('.custom-select-value').text($(this).find('span').text());
            $wrapper.find('input[type="hidden"]').val(val);
            $wrapper.removeClass('open');
            renderFavoritesList();
        });
        $mainModal.on('input', '#favorites-search-input', renderFavoritesList);

        $mainModal.on('click', '#favorites-add-btn', function () {
            Swal.fire({
                title: '新增收藏',
                html: `
                    <input id="swal-fav-name" class="swal2-input" placeholder="名称">
                    <input id="swal-fav-url" class="swal2-input" placeholder="URL">
                `,
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                preConfirm: () => {
                    const name = $('#swal-fav-name').val().trim();
                    const url = $('#swal-fav-url').val().trim();
                    if (!name || !url) { Swal.showValidationMessage('请填写名称和URL'); return false; }
                    return { name, url };
                }
            }).then(result => {
                if (result.isConfirmed) {
                    const favorites = getAllFavorites();
                    favorites.push({ id: Date.now().toString(), name: result.value.name, url: result.value.url, time: Date.now() });
                    saveFavorites(favorites);
                    showNotification('已添加');
                    renderFavoritesList();
                }
            });
        });

        $mainModal.on('click', '.favorite-jump', function () {
            const id = $(this).closest('.favorite-item').data('id');
            const item = getAllFavorites().find(f => f.id == id);
            if (item) window.open(ensureProtocol(item.url), '_blank');
        });

        $mainModal.on('click', '.favorite-edit', function () {
            const id = $(this).closest('.favorite-item').data('id');
            const favorites = getAllFavorites();
            const item = favorites.find(f => f.id == id);
            if (!item) return;

            Swal.fire({
                title: '编辑收藏',
                html: `
                    <input id="swal-fav-name" class="swal2-input" placeholder="名称" value="${item.name}">
                    <input id="swal-fav-url" class="swal2-input" placeholder="URL" value="${item.url}">
                `,
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                preConfirm: () => {
                    const name = $('#swal-fav-name').val().trim();
                    const url = $('#swal-fav-url').val().trim();
                    if (!name || !url) { Swal.showValidationMessage('请填写名称和URL'); return false; }
                    return { name, url };
                }
            }).then(result => {
                if (result.isConfirmed) {
                    item.name = result.value.name;
                    item.url = result.value.url;
                    item.time = Date.now();
                    saveFavorites(favorites);
                    showNotification('已保存');
                    renderFavoritesList();
                }
            });
        });

        $mainModal.on('click', '.favorite-delete', function () {
            const id = $(this).closest('.favorite-item').data('id');
            let favorites = getAllFavorites();
            favorites = favorites.filter(f => f.id != id);
            saveFavorites(favorites);
            showNotification('已删除');
            renderFavoritesList();
        });

        // 豆瓣查找相关事件
        $mainModal.on('click', '.douban-tab', function () {
            const $this = $(this);
            const tab = $this.data('tab');
            if (tab === doubanCurrentTab) return;

            doubanCurrentTab = tab;
            $this.addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);

            // CSS切换显示/隐藏
            $('.douban-results').removeClass('active');
            $(`#douban-results-${tab}`).addClass('active');

            // 更新分类和筛选选项（会重置为默认状态）
            updateDoubanCategoryOptions();
            updateDoubanFilterOptions();

            // 从localStorage读取预加载的默认数据
            const cacheKeys = {
                movie: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_MOVIE,
                tv: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_TV,
                anime: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_ANIME,
                variety: CONFIG.STORAGE_KEYS.DOUBAN_CACHE_VARIETY
            };
            const cachedData = getJsonSetting(cacheKeys[tab], null);
            const $results = $(`#douban-results-${tab}`);

            if (cachedData?.html) {
                $results.html(cachedData.html);
                doubanHasMore = cachedData.hasMore;
                doubanCurrentPage = cachedData.page || 1;
            } else {
                loadDoubanData(true);
            }
        });

        $mainModal.on('click', '.douban-category .filter-option', function () {
            const $this = $(this);
            const value = $this.data('value');

            $this.addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);
            doubanCurrentCategory = value;

            // 更新筛选选项
            updateDoubanFilterOptions();

            // 重新加载数据
            loadDoubanData(true);
        });

        $mainModal.on('click', '.douban-filter .filter-option', function () {
            const $this = $(this);
            const value = $this.data('value');

            $this.addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);

            // 重新加载数据
            loadDoubanData(true);
        });

        // 下拉菜单事件
        $mainModal.on('click', '.ph-dd-toggle', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const $this = $(this);
            const $menu = $this.next('.ph-dd-menu');

            // 关闭其他下拉菜单
            $('.ph-dd-menu').not($menu).removeClass('show');

            // 切换当前下拉菜单
            $menu.toggleClass('show');
        });

        $mainModal.on('click', '.ph-dd-item', function (e) {
            e.preventDefault();

            const $this = $(this);
            const $toggle = $this.closest('.ph-dd-wrap').find('.ph-dd-toggle');
            const type = $toggle.closest('.ph-dd-wrap').data('type');
            const value = $this.data('value');

            // 更新按钮文本（全部/综合排序时显示筛选名称）
            const fieldNames = { type: '类型', tv_type: '类型', anime_type: '类型', variety_type: '类型', region: '地区', year: '年代', platform: '平台', sort: '排序' };
            const displayText = (value === 'all' || value === 'recommend') ? fieldNames[type] : $this.text();
            $toggle.find('.ph-dd-text').text(displayText);

            // 更新选中状态
            $this.addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);

            // 重新加载数据
            loadDoubanData(true);
        });

        // 点击其他地方关闭下拉菜单
        $(document).on('click', function () {
            $('.ph-dd-menu').removeClass('show');
            $('.custom-select-wrapper').removeClass('open');
        });

        // 豆瓣查找滚动加载（绑定到.tab-content）
        const $tabContent = $mainModal.find('.tab-content');
        const $backToTop = $mainModal.find('#back-to-top');

        $tabContent.on('scroll', function () {
            // 显示/隐藏返回顶部按钮
            $backToTop.toggleClass('hidden', this.scrollTop < 300);

            // 豆瓣查找滚动加载（如果存在加载更多按钮则不自动触发）
            if (currentActiveTabId !== 'tab2' || doubanIsLoading || !doubanHasMore) return;
            if ($('.douban-load-more-btn').length > 0) return;
            if (this.scrollTop + this.clientHeight >= this.scrollHeight - 150) {
                doubanCurrentPage++;
                loadDoubanData(false);
            }
        });

        // 加载更多按钮点击事件
        $mainModal.on('click', '.douban-load-more-btn', function () {
            // 检查是否已经有数据（有.douban-grid容器）
            const $results = $(this).closest('.douban-results');
            const hasExistingData = $results.find('.douban-grid').length > 0;

            $(this).remove();

            // 如果已有数据，则翻页加载更多；如果没有数据（重试失败请求），不增加页码
            if (hasExistingData) {
                doubanCurrentPage++;
            }

            loadDoubanData(false);
        });

        // 返回顶部按钮点击事件
        $backToTop.on('click', function () {
            $tabContent.animate({ scrollTop: 0 }, 300);
        });

        const $settingsModal = $(CONFIG.SELECTORS.SETTINGS_MODAL);
        $settingsModal.on('click', '#elegant-close-settings, #elegant-cancel-settings', () => switchModals(CONFIG.SELECTORS.SETTINGS_MODAL, CONFIG.SELECTORS.MAIN_MODAL));
        $settingsModal.on('click', '#elegant-save-settings', handleSaveSettings);
        $settingsModal.on('click', '.settings-tab-button', function () {
            const $this = $(this);
            const tabId = $this.data('settingsTab');
            $this.addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);
            $(`#${tabId}-settings`).addClass(CONFIG.CLASSES.ACTIVE).siblings().removeClass(CONFIG.CLASSES.ACTIVE);
        });

        // 右键菜单事件（每日放送和豆瓣查找卡片共用）
        $body.on('contextmenu', '.anime-card, .douban-card', function (e) {
            e.preventDefault(); // 阻止默认右键菜单

            const $card = $(this);
            const isDouban = $card.hasClass('douban-card');
            const isLinkedDouban = $card.data('source') === 'douban'; // 在每日放送中显示的联动豆瓣卡片
            const animeName = isDouban || isLinkedDouban ? $card.data('title') : $card.data('name');
            const cardId = $card.data('id');
            const imageUrl = $card.find('img').attr('src') || '';

            // 设置当前右键点击的卡片ID和类型
            currentRightClickedCardId = cardId;
            currentRightClickedCardType = (isDouban || isLinkedDouban) ? 'douban' : 'bangumi';

            // 获取已保存的自定义URL（根据类型使用不同存储），没有则显示全局URL
            let customUrl = (isDouban || isLinkedDouban) ? getDoubanCustomUrl(cardId) : getBangumiCustomUrl(cardId);
            if (!customUrl) {
                customUrl = getSetting(CONFIG.STORAGE_KEYS.REDIRECT_URL, '');
            }

            // 填充右键菜单数据
            $('#context-menu-anime-name').val(animeName);
            $('#context-menu-custom-url').val(customUrl || '');

            // 豆瓣卡片显示联动设置行
            const $dailyLinkRow = $('.douban-only-row');
            if (isDouban || isLinkedDouban) {
                $dailyLinkRow.show();
                const linkData = getDoubanDailyLink(cardId);
                const selectedWeekdays = linkData ? linkData.weekdays : [];
                // 更新多选状态
                $('#context-menu-daily-link .daily-link-item').each(function() {
                    const weekday = parseInt($(this).data('weekday'));
                    $(this).toggleClass('checked', selectedWeekdays.includes(weekday));
                });
                // 存储图片URL供保存时使用
                $('#context-menu-daily-link').data('imageUrl', imageUrl);
            } else {
                $dailyLinkRow.hide();
            }

            // 显示右键菜单
            const $contextMenu = $(CONFIG.SELECTORS.CONTEXT_MENU);
            $contextMenu.removeClass(CONFIG.CLASSES.HIDDEN);

            // 定位右键菜单
            const menuWidth = $contextMenu.outerWidth();
            const menuHeight = $contextMenu.outerHeight();
            let left = e.clientX;
            let top = e.clientY;

            // 确保菜单不超出视窗
            if (left + menuWidth > window.innerWidth) {
                left = window.innerWidth - menuWidth;
            }
            if (top + menuHeight > window.innerHeight) {
                top = window.innerHeight - menuHeight;
            }

            $contextMenu.css({
                left: `${left}px`,
                top: `${top}px`
            });
        });

        // 点击其他地方关闭右键菜单
        $(document).on('click', function (e) {
            if (!$(e.target).closest(CONFIG.SELECTORS.CONTEXT_MENU).length &&
                !$(e.target).hasClass('anime-card') &&
                !$(e.target).hasClass('douban-card')) {
                $(CONFIG.SELECTORS.CONTEXT_MENU).addClass(CONFIG.CLASSES.HIDDEN);
            }
        });

        // 右键菜单内部按钮事件
        $(CONFIG.SELECTORS.CONTEXT_MENU).on('click', '#context-menu-close', function () {
            $(CONFIG.SELECTORS.CONTEXT_MENU).addClass(CONFIG.CLASSES.HIDDEN);
        });

        // 多选项点击切换
        $(CONFIG.SELECTORS.CONTEXT_MENU).on('click', '.daily-link-item', function () {
            $(this).toggleClass('checked');
        });

        $(CONFIG.SELECTORS.CONTEXT_MENU).on('click', '#context-menu-save', function () {
            if (!currentRightClickedCardId) return;

            const customUrl = $('#context-menu-custom-url').val().trim();
            const name = $('#context-menu-anime-name').val().trim();
            if (currentRightClickedCardType === 'douban') {
                saveDoubanCustomUrl(currentRightClickedCardId, customUrl, name);
                // 保存联动设置（多选）
                const weekdays = [];
                $('#context-menu-daily-link .daily-link-item.checked').each(function() {
                    weekdays.push(parseInt($(this).data('weekday')));
                });
                const imageUrl = $('#context-menu-daily-link').data('imageUrl') || '';
                saveDoubanDailyLink(currentRightClickedCardId, weekdays, name, imageUrl);
                // 刷新每日放送显示
                if (dailyDataLoaded) {
                    refreshLinkedDoubanCards();
                }
            } else {
                saveBangumiCustomUrl(currentRightClickedCardId, customUrl, name);
            }
            showNotification('设置已保存');
            $(CONFIG.SELECTORS.CONTEXT_MENU).addClass(CONFIG.CLASSES.HIDDEN);
        });

        $(CONFIG.SELECTORS.CONTEXT_MENU).on('click', '#context-menu-reset', function () {
            if (!currentRightClickedCardId) return;

            $('#context-menu-custom-url').val('');
            if (currentRightClickedCardType === 'douban') {
                saveDoubanCustomUrl(currentRightClickedCardId, '');
                // 重置联动设置
                $('#context-menu-daily-link .daily-link-item').removeClass('checked');
                saveDoubanDailyLink(currentRightClickedCardId, []);
                if (dailyDataLoaded) {
                    refreshLinkedDoubanCards();
                }
            } else {
                saveBangumiCustomUrl(currentRightClickedCardId, '');
            }
            showNotification('设置已重置');
            $(CONFIG.SELECTORS.CONTEXT_MENU).addClass(CONFIG.CLASSES.HIDDEN);
        });

        // 每日放送卡片点击事件（使用事件委托）
        $body.on('click', '.anime-card', function (e) {
            // 如果是右键点击，不处理左键事件
            if (e.button === 2) return;

            // 如果点击的是链接按钮，不处理卡片点击事件
            if ($(e.target).closest('.douban-link-btn').length > 0) {
                return;
            }

            const $card = $(this);
            const cardId = $card.data('id');
            const isLinkedDouban = $card.data('source') === 'douban';
            const animeName = isLinkedDouban ? $card.data('title') : $card.data('name');

            // 根据卡片来源获取自定义URL
            let redirectUrl = isLinkedDouban ? getDoubanCustomUrl(cardId) : getBangumiCustomUrl(cardId);

            // 如果没有自定义URL，使用全局设置的跳转URL
            if (!redirectUrl) {
                redirectUrl = getSetting(CONFIG.STORAGE_KEYS.REDIRECT_URL, '');
            }

            // 确保URL有协议头
            redirectUrl = ensureProtocol(redirectUrl);

            if (redirectUrl) {
                // 复制剧集名称到剪贴板
                navigator.clipboard.writeText(animeName).then(() => {
                    // 显示提示，设置z-index确保在顶层显示
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: CONFIG.REDIRECT_DELAY,
                        timerProgressBar: true,
                    }).fire({
                        icon: 'success',
                        title: '已复制剧集名称，即将跳转...'
                    });

                    // 设置延时执行跳转
                    setTimeout(() => {
                        window.open(redirectUrl, '_blank');
                    }, CONFIG.REDIRECT_DELAY);

                }).catch(err => {
                    console.error('复制失败:', err);
                    // 即使复制失败，也显示提示并跳转
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: CONFIG.REDIRECT_DELAY,
                        timerProgressBar: true,
                    }).fire({
                        icon: 'warning',
                        title: '复制剧集名称失败，但仍将跳转...'
                    });

                    setTimeout(() => {
                        window.open(redirectUrl, '_blank');
                    }, CONFIG.REDIRECT_DELAY);
                });
            }
        });

        // 豆瓣卡片点击事件
        $body.on('click', '.douban-card', function (e) {
            // 如果是右键点击，不处理左键事件
            if (e.button === 2) return;

            // 如果点击的是链接按钮，不处理卡片点击事件（链接按钮会自动跳转）
            if ($(e.target).closest('.douban-link-btn').length > 0) {
                return;
            }

            const $card = $(this);
            const cardId = $card.data('id');
            const title = $card.data('title');

            // 优先使用自定义URL，否则使用全局设置的跳转URL
            let redirectUrl = getDoubanCustomUrl(cardId);
            if (!redirectUrl) {
                redirectUrl = getSetting(CONFIG.STORAGE_KEYS.REDIRECT_URL, '');
            }

            // 确保URL有协议头
            redirectUrl = ensureProtocol(redirectUrl);

            if (redirectUrl) {
                // 复制标题到剪贴板
                navigator.clipboard.writeText(title).then(() => {
                    // 显示提示，设置延时执行跳转
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: CONFIG.REDIRECT_DELAY,
                        timerProgressBar: true,
                    }).fire({
                        icon: 'success',
                        title: '已复制标题，即将跳转...'
                    });

                    // 设置延时执行跳转
                    setTimeout(() => {
                        window.open(redirectUrl, '_blank');
                    }, CONFIG.REDIRECT_DELAY);

                }).catch(err => {
                    console.error('复制失败:', err);
                    // 即使复制失败，也显示提示并跳转
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: CONFIG.REDIRECT_DELAY,
                        timerProgressBar: true,
                    }).fire({
                        icon: 'warning',
                        title: '复制标题失败，但仍将跳转...'
                    });

                    setTimeout(() => {
                        window.open(redirectUrl, '_blank');
                    }, CONFIG.REDIRECT_DELAY);
                });
            }
        });
    }

    function handleSaveSettings() {
        // 检查每日放送API是否发生变化
        const newDailyApiValue = $('#daily-api-input').val();
        const dailyApiChanged = newDailyApiValue !== originalDailyApiValue;

        // 保存所有API设置
        $('#api-settings .text-input').each(function () {
            localStorage.setItem($(this).data('key'), $(this).val());
        });

        // 如果每日放送API发生变化，则清除缓存并重新预加载数据
        if (dailyApiChanged) {
            // 清除旧的缓存数据
            localStorage.removeItem(CONFIG.STORAGE_KEYS.DAILY_DATA_CACHE);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.DAILY_DATA_TIMESTAMP);

            // 更新全局Promise，重新开始预加载
            dailyDataPromise = getDailyData();

            // 捕获可能的错误
            dailyDataPromise.catch(error => {
                console.error("Refetching daily data after API change failed:", error);
            });
        }

        // 保存Tab位置
        const newTabPosition = $('#elegant-tab-position').val();
        localStorage.setItem(CONFIG.STORAGE_KEYS.TAB_POSITION, newTabPosition);

        // 保存豆瓣接口模式和图片模式
        localStorage.setItem(CONFIG.STORAGE_KEYS.DOUBAN_PROXY_MODE, $('#douban-proxy-mode').val());
        localStorage.setItem(CONFIG.STORAGE_KEYS.DOUBAN_IMAGE_MODE, $('#douban-image-mode').val());

        // 保存Logo显示模式（unchecked=嵌合图标true，checked=悬浮按钮false）
        const newLogoMode = !$('#logo-mode-toggle').prop('checked');
        localStorage.setItem(CONFIG.STORAGE_KEYS.SHOW_LOGO_INNER, newLogoMode);
        // 如果在可嵌合的网站且模式发生变化，则切换显示模式
        if (canEmbedHosts.includes(window.location.hostname) && newLogoMode !== showLogoInner) {
            toggleDisplayMode(newLogoMode);
        }

        // 保存联动卡片位置（unchecked=首部head，checked=尾部tail）
        const oldLinkPosition = localStorage.getItem(CONFIG.STORAGE_KEYS.DAILY_LINK_POSITION) || 'head';
        const newLinkPosition = $('#daily-link-position-toggle').prop('checked') ? 'tail' : 'head';
        localStorage.setItem(CONFIG.STORAGE_KEYS.DAILY_LINK_POSITION, newLinkPosition);
        // 如果位置变化且每日放送已加载，刷新联动卡片
        if (oldLinkPosition !== newLinkPosition && dailyDataLoaded) {
            refreshLinkedDoubanCards();
        }

        // 在保存新顺序前先获取旧顺序
        const oldTabOrder = getTabOrder();

        // 保存Tab顺序
        const newTabOrder = [];
        $('#tab-sort-list .tab-sort-item').each(function () {
            newTabOrder.push({ id: $(this).data('id'), label: $(this).find('.tab-label').text() });
        });
        localStorage.setItem(CONFIG.STORAGE_KEYS.TAB_ORDER, JSON.stringify(newTabOrder));

        // 应用Tab位置
        applyTabPosition(newTabPosition);

        // 比较新旧顺序
        const tabOrderChanged = JSON.stringify(oldTabOrder) !== JSON.stringify(newTabOrder);

        // 如果Tab顺序或位置发生变化，则重新渲染标签页（保留内容，避免重新请求）
        if (tabOrderChanged || newTabPosition !== getSetting(CONFIG.STORAGE_KEYS.TAB_POSITION, 'top')) {
            renderTabs(newTabOrder, true, true);
        }

        // 如果当前激活的标签页是"每日放送"且API发生了变化，则重新渲染每日放送内容
        if (dailyApiChanged && currentActiveTabId === 'tab1') {
            processAndRenderDailyData(dailyDataPromise);
        }

        showNotification('设置已保存并生效');
        switchModals(CONFIG.SELECTORS.SETTINGS_MODAL, CONFIG.SELECTORS.MAIN_MODAL);
    }

    // =================================================================================
    // 8. 核心交互逻辑 (Core Interaction Logic)
    // =================================================================================

    function openModal(modalSelector) {
        $(CONFIG.SELECTORS.OVERLAY).show();
        const $modal = $(modalSelector);

        if (modalSelector === CONFIG.SELECTORS.SETTINGS_MODAL) {
            initializeSettingsValues();
        }

        // 更新输入框的主题样式
        updateInputThemeStyles($('html').hasClass('dark'));

        $modal.removeClass(CONFIG.CLASSES.HIDDEN).addClass(CONFIG.CLASSES.FADE_IN)
            .one('animationend', () => $modal.removeClass(CONFIG.CLASSES.FADE_IN));
    }

    function closeModal(modalSelector, onClosed) {
        const $modal = $(modalSelector);
        $modal.addClass(CONFIG.CLASSES.FADE_OUT)
            .one('animationend', () => {
                $modal.addClass(CONFIG.CLASSES.HIDDEN).removeClass(CONFIG.CLASSES.FADE_OUT);
                if (onClosed) onClosed();
            });
    }

    function closeAllModals() {
        let activeModals = [CONFIG.SELECTORS.MAIN_MODAL, CONFIG.SELECTORS.SETTINGS_MODAL]
            .filter(sel => !$(sel).hasClass(CONFIG.CLASSES.HIDDEN));

        if (activeModals.length === 0) return;

        activeModals.forEach(sel => closeModal(sel));
        $(CONFIG.SELECTORS.OVERLAY).fadeOut(CONFIG.ANIMATION_DURATION);
    }

    function switchModals(fromSelector, toSelector) {
        closeModal(fromSelector, () => openModal(toSelector));
    }

    function toggleTheme() {
        const $html = $('html');
        $html.toggleClass('dark');
        const isDark = $html.hasClass('dark');
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');

        // 更新输入框的内联样式（使用切换后的状态）
        updateInputThemeStyles(isDark);
    }

    function updateInputThemeStyles(isDark) {
        const inputStyle = isDark
            ? 'padding: 10px 14px; border: 1px solid #4b5563; border-radius: 8px; font-size: 14px; color: #e5e7eb !important; outline: none;'
            : 'padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #374151 !important; outline: none;';
        $('#api-settings .text-input').attr('style', inputStyle);
        $('#tags-search-input, #favorites-search-input').attr('style', inputStyle);
    }

    function initTheme() {
        if (getSetting(CONFIG.STORAGE_KEYS.THEME) === 'dark') {
            $('html').addClass('dark');
        }
    }

    // =================================================================================
    // 9. 样式注入与初始化 (Style Injection & Initialization)
    // =================================================================================
    function injectStyles() {
        const styles = `
            /* Core Animations */
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); } }
            .animate-fade-in { animation: fadeIn ${CONFIG.ANIMATION_DURATION}ms ease-out; }
            .animate-fade-out { animation: fadeOut ${CONFIG.ANIMATION_DURATION}ms ease-in; }
            /* Main Components */
            .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; display: none; }
            .main-button { position: fixed; top: 100px; right: 30px; z-index: 10000; width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(34, 197, 94, 0.10)); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s ease; border: none; }
            .main-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); }
            /* Custom Scrollbar */
            #elegant-main-modal ::-webkit-scrollbar, #elegant-settings-modal ::-webkit-scrollbar { width: 8px; height: 8px; }
            #elegant-main-modal ::-webkit-scrollbar-track, #elegant-settings-modal ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
            .dark #elegant-main-modal ::-webkit-scrollbar-track, .dark #elegant-settings-modal ::-webkit-scrollbar-track { background: #2d3748; }
            #elegant-main-modal ::-webkit-scrollbar-thumb, #elegant-settings-modal ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
            #elegant-main-modal ::-webkit-scrollbar-thumb:hover, #elegant-settings-modal ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
            .dark #elegant-main-modal ::-webkit-scrollbar-thumb, .dark #elegant-settings-modal ::-webkit-scrollbar-thumb { background: #4a5568; }
            .dark #elegant-main-modal ::-webkit-scrollbar-thumb:hover, .dark #elegant-settings-modal ::-webkit-scrollbar-thumb:hover { background: #718096; }
            /* Tabs Layout */
            .tabs-container { display: flex; height: 100%; }
            .tabs-top { flex-direction: column; }
            .tabs-left { flex-direction: row; }
            .tabs-right { flex-direction: row-reverse; }
            .tabs-header { display: flex; background: #f3f4f6; border-radius: 12px; padding: 8px; }
            .dark .tabs-header { background: #1f2937; }
            .tabs-top .tabs-header { flex-direction: row; margin: 16px; }
            .tabs-left .tabs-header { flex-direction: column; margin: 16px 0 16px 16px; min-width: 160px; }
            .tabs-right .tabs-header { flex-direction: column; margin: 16px; margin-bottom: 16px; min-width: 160px; }
            .tab-button { padding: 12px 20px; border: none; background: transparent; cursor: pointer; border-radius: 8px; font-weight: 500; transition: all 0.3s ease; color: #4b5563; flex: 1; display: flex; align-items: center; justify-content: center; }
            .dark .tab-button { color: #9ca3af; }
            .tab-button.active { background: white; color: #3b82f6; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
            .dark .tab-button.active { background: #374151; color: #60a5fa; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); }
            .tab-content-wrapper { flex: 1; position: relative; overflow: hidden; }
            .tab-content { height: 100%; padding: 0 16px 16px; overflow-y: auto; }
            .back-to-top { position: absolute; right: 15px; bottom: 24px; width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #65a0ff 0%, #ffffff 100%); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease; z-index: 10; }
            .back-to-top:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); }
            .back-to-top.hidden { display: none; }
            .tab-pane { display: none; }
            .tab-pane.active { display: block; animation: fadeIn 0.3s ease; }
            /* Content Cards */
            .content-card { background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
            .dark .content-card { background: #1f2937; }
            .content-title { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #111827; }
            .dark .content-title { color: #f9fafb; }
            .content-text { color: #4b5563; line-height: 1.6; }
            .dark .content-text { color: #d1d5db; }
            .daily-container { min-height: 400px; }
            /* Daily Loading Spinner */
            .daily-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; }
            .loading-spinner { width: 50px; height: 50px; border: 5px solid #f3f4f6; border-top: 5px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
            .dark .loading-spinner { border-color: #374151; border-top-color: #60a5fa; }
            .loading-text { color: #6b7280; font-size: 14px; }
            .dark .loading-text { color: #9ca3af; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            /* Daily Tabs - 优化星期tab切换抖动问题 */
            .daily-tabs-container { display: flex; flex-direction: column; height: 100%; }
            .week-tabs { display: flex; justify-content: center; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
            .dark .week-tabs { border-color: #4b5563; }
            .week-tab {
                padding: 10px 16px;
                margin: 0 4px;
                border: none;
                background: transparent;
                cursor: pointer;
                border-radius: 8px 8px 0 0;
                font-weight: 500;
                color: #6b7280;
                /* 优化：添加固定边框，避免切换时布局变化 */
                border-bottom: 2px solid transparent;
                /* 优化：只对颜色和背景应用过渡效果，避免边框变化导致的抖动 */
                transition: color 0.3s ease, background-color 0.3s ease;
            }
            .dark .week-tab { color: #9ca3af; }
            .week-tab:hover { color: #3b82f6; background: #f3f4f6; }
            .dark .week-tab:hover { color: #60a5fa; background: #374151; }
            .week-tab.active {
                color: #3b82f6;
                border-bottom-color: #3b82f6;
            }
            .dark .week-tab.active {
                color: #60a5fa;
                border-bottom-color: #60a5fa;
            }
            .week-contents { flex: 1; overflow: hidden; padding-top: 16px; }
            .week-content { display: none; animation: fadeIn 0.3s ease; }
            .week-content.active { display: block; }
            .no-content { text-align: center; color: #6b7280; padding: 40px 0; }
            .dark .no-content { color: #9ca3af; }
            .error-message { text-align: center; color: #ef4444; padding: 40px 0; }
            .douban-load-more-btn {
                display: block; width: 100%; padding: 12px; margin-top: 16px;
                background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px;
                color: #374151; font-size: 14px; cursor: pointer; transition: all 0.2s;
            }
            .douban-load-more-btn:hover { background: #e5e7eb; }
            .dark .douban-load-more-btn { background: #374151; border-color: #4b5563; color: #e5e7eb; }
            .dark .douban-load-more-btn:hover { background: #4b5563; }
            /* 管理跳转样式 */
            .tags-manage-container { padding: 16px 0; }
            .tags-filter-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
            .tags-select, .tags-search {
                padding: 8px 12px; border-radius: 8px; border: 1px solid #d1d5db; border-color: #d1d5db !important;
                background: white !important; color: #374151 !important; font-size: 14px; outline: none;
            }
            .dark .tags-select { background: #374151 !important; border-color: #4b5563 !important; color: #e5e7eb !important; }
            .dark .tags-search { background: #374151 !important; border-color: #4b5563 !important; color: #e5e7eb !important; }
            .tags-search { flex: 1; min-width: 150px; align-self: center; }
            #elegant-main-modal .tags-search:focus { border-color: #d1d5db; outline: none; }
            #elegant-main-modal.dark .tags-search:focus { border-color: #4b5563; outline: none; }
            .ph-tags-list { display: flex; flex-direction: column; gap: 8px; }
            .tag-item {
                display: flex; align-items: center; gap: 12px; padding: 12px 16px;
                background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;
            }
            .dark .tag-item { background: #1f2937; border-color: #374151; }
            .tag-label {
                padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;
                flex-shrink: 0;
            }
            .tag-bangumi { background: #f59e0b; color: white; }
            .dark .tag-bangumi { background: #d97706; color: white; }
            .tag-douban { background: #3b82f6; color: white; }
            .dark .tag-douban { background: #2563eb; color: white; }
            .tag-name { flex: 0 0 220px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #374151; }
            .dark .tag-name { color: #e5e7eb; }
            .tag-url { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #6b7280; font-size: 13px; }
            .dark .tag-url { color: #9ca3af; }
            .tag-time { flex: 0 0 140px; color: #9ca3af; font-size: 12px; text-align: right; }
            .dark .tag-time { color: #6b7280; }
            .tag-btn {
                padding: 6px; border: none; background: transparent; cursor: pointer;
                color: #6b7280; border-radius: 4px; transition: all 0.2s;
            }
            .tag-btn:hover { background: #e5e7eb; color: #374151; }
            .dark .tag-btn:hover { background: #374151; color: #e5e7eb; }
            .tag-delete:hover { color: #ef4444; }
            .dark .tag-delete:hover { color: #f87171; }
            /* 管理收藏样式 */
            .favorites-container { padding: 16px 0; }
            .favorites-filter-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
            .favorites-filter-bar .favorites-search:focus { border-color: #d1d5db !important; outline: none; }
            .dark .favorites-filter-bar .favorites-search:focus { border-color: #4b5563 !important; outline: none; }
            .favorites-select, .favorites-search {
                padding: 8px 16px; border-radius: 8px; border: 1px solid #d1d5db; border-color: #d1d5db !important;
                background: white !important; color: #374151 !important; font-size: 14px; outline: none;
            }
            .dark .favorites-select, .dark .favorites-search { background: #374151 !important; border-color: #4b5563 !important; color: #e5e7eb !important; }
            .dark .favorites-search { border-color: #4b5563 !important; }
            .favorites-search { flex: 1; min-width: 150px; align-self: center; }
            .favorites-add-btn {
                padding: 10px 16px; border-radius: 8px; border: none; background: #3b82f6;
                color: white; font-size: 14px; cursor: pointer; transition: background 0.2s;
            }
            .favorites-add-btn:hover { background: #2563eb; }
            .favorites-list { display: flex; flex-direction: column; gap: 8px; }
            .favorite-item {
                display: flex; align-items: center; gap: 12px; padding: 12px 16px;
                background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;
            }
            .dark .favorite-item { background: #1f2937; border-color: #374151; }
            .favorite-name { flex: 0 0 150px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #374151; }
            .dark .favorite-name { color: #e5e7eb; }
            .favorite-url { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #6b7280; font-size: 13px; }
            .dark .favorite-url { color: #9ca3af; }
            .favorite-time { flex: 0 0 140px; color: #9ca3af; font-size: 12px; text-align: right; }
            .dark .favorite-time { color: #6b7280; }
            .favorite-btn {
                padding: 6px; border: none; background: transparent; cursor: pointer;
                color: #6b7280; border-radius: 4px; transition: all 0.2s;
            }
            .favorite-btn:hover { background: #e5e7eb; color: #374151; }
            .dark .favorite-btn:hover { background: #374151; color: #e5e7eb; }
            .favorite-jump:hover { color: #3b82f6; }
            .dark .favorite-jump:hover { color: #60a5fa; }
            .favorite-delete:hover { color: #ef4444; }
            .dark .favorite-delete:hover { color: #f87171; }
            /* Anime Grid */
            .anime-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
            .anime-card {
                background: #f9fafb;
                border-radius: 8px;
                overflow: hidden;
                transition: transform 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                cursor: pointer;
            }
            .dark .anime-card {
                background: #1f2937;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .anime-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
            }
            .dark .anime-card:hover {
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
            }
            .anime-image-container { position: relative; }
            .anime-image { width: 100%; height: 240px; object-fit: cover; }
            .anime-rating { position: absolute; top: 8px; right: 8px; background: rgba(0, 0, 0, 0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
            .anime-title {
                padding: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #111827;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: default;
            }
            .dark .anime-title { color: #f9fafb; }
            .anime-card:hover .anime-title { color: #3b82f6; }
            /* 联动豆瓣卡片样式 */
            .douban-linked-card { position: relative; }
            .douban-linked-card .douban-link-btn {
                position: absolute;
                top: 4px;
                right: 4px;
                width: 28px;
                height: 28px;
                background: rgba(59, 130, 246, 0.9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 10;
                text-decoration: none;
            }
            .douban-linked-card:hover .douban-link-btn { opacity: 1; }
            .douban-linked-card .douban-link-btn:hover { background: rgba(37, 99, 235, 1); }
            /* Settings Modal Styles */
            .settings-tabs-nav { flex-shrink: 0; }
            .tabs-nav-container { width: 100%; }
            .tabs-nav-list { display: flex; flex-direction: column; align-items: center; gap: 12px; }
            .settings-tab-button { width: 80%; padding: 12px 0; border: none; background: transparent; cursor: pointer; border-radius: 6px; font-weight: 500; transition: all 0.3s ease; color: #4b5563; text-align: center; }
            .settings-tab-button.active { background: #f3f4f6; color: #3b82f6; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
            .dark .settings-tab-button { color: #9ca3af; }
            .dark .settings-tab-button.active { background: #374151; color: #60a5fa; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); }
            .settings-tab-button:hover:not(.active) { background: #f3f4f6; }
            .dark .settings-tab-button:hover:not(.active) { background: #374151; }
            .settings-tab-content { flex: 1; }
            .settings-content-container { padding: 0 20px; width: 100%; }
            .settings-tab-pane { display: none; width: 100%; animation: fadeIn 0.3s ease; }
            .settings-tab-pane.active { display: block; }
            .settings-form-centered { width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 20px; margin: 0 auto; }
            .form-row { display: grid; grid-template-columns: 1fr 2fr; align-items: center; }
            .form-label { font-weight: 500 !important; text-align: right; padding-right: 16px; color: #374151; display: flex; justify-content: flex-end; align-items: center; }
            .dark .form-label { color: #e5e7eb; }
            .form-input { padding: 10px 14px; border: 1px solid #d1d5db; border-color: #d1d5db !important; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; width: 180px; max-width: 250px; background-color: #f9fafb !important; color: #111827 !important; outline: none; }
            .dark .form-input { background-color: #1f2937 !important; border-color: #374151; color: #f9fafb !important; }
            .text-input:focus { outline: none; width: 300px; }
            .dark .text-input:focus { outline: none; }
            .select-input { width: 150px; border: 1px solid #d1d5db; border-color: #d1d5db !important; }
            .dark .select-input { border-color: #4b5563 !important; }
            .select-input:focus { outline: none; }
            /* Custom Select - Glassmorphism Style */
            .custom-select-wrapper { position: relative; display: inline-block; }
            .custom-select-wrapper.ph-select .custom-select-trigger { padding: 8px 12px; border-radius: 8px; border: 1px solid #d1d5db; background: white !important; color: #374151 !important; font-size: 14px; font-weight: normal; }
            .dark .custom-select-wrapper.ph-select .custom-select-trigger { background: #374151 !important; border-color: #4b5563; color: #e5e7eb !important; }
            .custom-select-trigger { display: inline-flex; align-items: center; padding: 0; background: transparent; border: none; cursor: pointer; transition: all 0.2s ease; font-weight: 500; color: #374151; font-size: 15px; }
            .dark .custom-select-trigger { color: #e5e7eb; }
            .custom-select-trigger:hover { color: #3b82f6; }
            .dark .custom-select-trigger:hover { color: #60a5fa; }
            .custom-select-wrapper.open .custom-select-trigger { color: #3b82f6; }
            .dark .custom-select-wrapper.open .custom-select-trigger { color: #60a5fa; }
            .custom-select-arrow { display: none; }
            .custom-select-options { position: absolute; top: calc(100% + 6px); left: 0; min-width: max-content; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border: 1px solid rgba(59,130,246,0.15); border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1), 0 2px 10px rgba(59,130,246,0.08); opacity: 0; visibility: hidden; transform: translateY(-8px) scale(0.96); transform-origin: top left; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); z-index: 9999; overflow: hidden; padding: 4px; display: flex; flex-direction: column; gap: 5px; }
            .custom-select-wrapper.ph-select { min-width: max-content; }
            .custom-select-wrapper.ph-select .custom-select-trigger { width: 100%; justify-content: space-between; outline: none; border: 1px solid #d1d5db; border-color: #d1d5db !important; }
            .dark .custom-select-wrapper.ph-select .custom-select-trigger { border-color: #4b5563 !important; }
            .dark .tags-search { background: #374151 !important; border-color: #4b5563 !important; color: #e5e7eb !important; }
            .custom-select-wrapper.ph-select .custom-select-trigger:focus { border-color: #3b82f6; box-shadow: none; }
            .dark .custom-select-wrapper.ph-select .custom-select-trigger:focus { border-color: #3b82f6; box-shadow: none; }
            .custom-select-wrapper.ph-select-fixed { min-width: 150px; }
            .custom-select-wrapper.ph-select-fixed .custom-select-trigger:focus { border-color: #3b82f6; box-shadow: none; }
            .dark .custom-select-wrapper.ph-select-fixed .custom-select-trigger:focus { border-color: #3b82f6; box-shadow: none; }
            .custom-select-wrapper.ph-select-fixed .custom-select-options { min-width: 100%; }
            .custom-select-wrapper.ph-select-fixed .custom-select-option { justify-content: center; }
            .dark .custom-select-options { background: rgba(31,41,55,0.95); border-color: rgba(96,165,250,0.2); box-shadow: 0 10px 40px rgba(0,0,0,0.3), 0 2px 10px rgba(96,165,250,0.1); }
            .custom-select-wrapper.open .custom-select-options { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
            .custom-select-option { display: flex; align-items: center; gap: 8px; padding: 10px 12px; cursor: pointer; transition: all 0.2s ease; border-radius: 8px; color: #374151; font-size: 13px; }
            .dark .custom-select-option { color: #e5e7eb; }
            .custom-select-option:hover { background: linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(147,197,253,0.9) 100%); color: white !important; }
            .dark .custom-select-option:hover { background: linear-gradient(135deg, rgba(96,165,250,0.8) 0%, rgba(59,130,246,0.9) 100%); color: white !important; }
            .custom-select-option.selected { background: linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(147,197,253,0.18) 100%); color: #2563eb; font-weight: 500; }
            .custom-select-option.selected:hover { color: white !important; }
            .dark .custom-select-option.selected { background: linear-gradient(135deg, rgba(96,165,250,0.2) 0%, rgba(59,130,246,0.25) 100%); color: #93c5fd; }
            .option-check { width: 14px; height: 14px; opacity: 0; transform: scale(0.5); transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); color: #3b82f6; flex-shrink: 0; }
            .dark .option-check { color: #60a5fa; }
            .custom-select-option.selected .option-check { opacity: 1; transform: scale(1); }
            .api-info { margin-top: -10px; margin-bottom: 10px; text-align: right; }
            .save-btn, .cancel-btn { color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
            .save-btn { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
            .save-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
            .cancel-btn { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); }
            .cancel-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(107, 114, 128, 0.3); }
            /* Tab Order Sorting Styles */
            .tab-order-container { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; }
            .tab-sort-list { background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; min-height: 120px; max-height: 200px; overflow-y: auto; width: 100%; }
            .dark .tab-sort-list { background: #1f2937; border-color: #374151; }
            .tab-sort-item { display: flex; align-items: center; background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; margin-bottom: 6px; cursor: move; transition: all 0.2s ease; }
            .dark .tab-sort-item { background: #374151; border-color: #4b5563; }
            .tab-sort-item:last-child { margin-bottom: 0; }
            .tab-sort-item:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .dark .tab-sort-item:hover { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); }
            .tab-sort-ghost { opacity: 0.4; }
            .tab-drag-handle { margin-right: 8px; color: #9ca3af; cursor: move; }
            .dark .tab-drag-handle { color: #6b7280; }
            .tab-label { flex: 1; color: #111827; }
            .dark .tab-label { color: #f9fafb; }
            .tab-order-hint { font-size: 12px; color: #6b7280; margin-top: 4px; text-align: center; }
            .dark .tab-order-hint { color: #9ca3af; }
            /* Context Menu Styles */
            .context-menu {
                position: fixed;
                z-index: 10001;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                width: 500px;
                padding: 0;
                border: 1px solid #e5e7eb;
            }
            .dark .context-menu {
                background: #1f2937;
                border-color: #374151;
            }
            .context-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #e5e7eb;
            }
            .dark .context-menu-header {
                border-color: #374151;
            }
            .context-menu-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #111827;
            }
            .dark .context-menu-header h3 {
                color: #f9fafb;
            }
            .context-menu-close {
                background: none;
                border: none;
                padding: 6px;
                border-radius: 4px;
                cursor: pointer;
                color: #6b7280;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .dark .context-menu-close {
                color: #9ca3af;
            }
            .context-menu-close:hover {
                background: #f3f4f6;
            }
            .dark .context-menu-close:hover {
                background: #374151;
            }
            .context-menu-content {
                padding: 20px;
            }
            .context-menu-content .form-row {
                margin-bottom: 16px;
            }
            .context-menu-content .form-row:last-child {
                margin-bottom: 0;
            }
            .context-menu-content .text-input:focus {
                border-color: #d1d5db;
                outline: none;
            }
            .dark .context-menu-content .text-input:focus {
                border-color: #4b5563;
                outline: none;
            }
            /* 每日放送多选列表样式 */
            .daily-link-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-height: 150px;
                overflow-y: auto;
            }
            .daily-link-list::-webkit-scrollbar { width: 8px; height: 8px; }
            .daily-link-list::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
            .dark .daily-link-list::-webkit-scrollbar-track { background: #2d3748; }
            .daily-link-list::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
            .daily-link-list::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
            .dark .daily-link-list::-webkit-scrollbar-thumb { background: #4a5568; }
            .dark .daily-link-list::-webkit-scrollbar-thumb:hover { background: #718096; }
            .daily-link-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px 10px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s;
                user-select: none;
            }
            .daily-link-item:hover {
                background: #f3f4f6;
            }
            .dark .daily-link-item:hover {
                background: #374151;
            }
            .daily-link-check {
                width: 16px;
                height: 16px;
                border: 2px solid #d1d5db;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                transition: all 0.2s;
            }
            .dark .daily-link-check {
                border-color: #4b5563;
            }
            .daily-link-item.checked .daily-link-check {
                background: #3b82f6;
                border-color: #3b82f6;
            }
            .daily-link-item.checked .daily-link-check::after {
                content: '';
                width: 8px;
                height: 5px;
                border-left: 2px solid white;
                border-bottom: 2px solid white;
                transform: rotate(-45deg) translateY(-1px);
            }
            .daily-link-text {
                font-size: 13px;
                color: #374151;
            }
            .dark .daily-link-text {
                color: #e5e7eb;
            }
            .context-menu-footer {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                padding: 16px 20px;
                border-top: 1px solid #e5e7eb;
            }
            .dark .context-menu-footer {
                border-color: #374151;
            }
            /* Swal z-index */
            .swal2-container { z-index: 10000 !important; }
            /* 豆瓣查找样式 */
            .douban-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                padding: 16px;
            }
            .douban-tabs {
                display: flex;
                justify-content: center;
                margin-bottom: 16px;
                border-bottom: 1px solid #e5e7eb;
            }
            .dark .douban-tabs {
                border-color: #4b5563;
            }
            .douban-tab {
                padding: 10px 16px;
                margin: 0 4px;
                border: none;
                background: transparent;
                cursor: pointer;
                border-radius: 8px 8px 0 0;
                font-weight: 500;
                color: #6b7280;
                border-bottom: 2px solid transparent;
                transition: color 0.3s ease, background-color 0.3s ease;
            }
            .dark .douban-tab {
                color: #9ca3af;
            }
            .douban-tab:hover {
                color: #3b82f6;
                background: #f3f4f6;
            }
            .dark .douban-tab:hover {
                color: #60a5fa;
                background: #374151;
            }
            .douban-tab.active {
                color: #3b82f6;
                border-bottom-color: #3b82f6;
            }
            .dark .douban-tab.active {
                color: #60a5fa;
                border-bottom-color: #60a5fa;
            }
            .douban-filters {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 16px;
            }
            .filter-row {
                display: flex;
                align-items: center;
            }
            .filter-label {
                font-weight: 500;
                margin-right: 12px;
                color: #374151;
                min-width: 50px;
            }
            .dark .filter-label {
                color: #e5e7eb;
            }
            .filter-options {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                flex: 1;
            }
            /* 圆角胶囊按钮组样式 */
            .filter-option {
                padding: 8px 16px;
                border-radius: 9999px; /* 完全圆角，形成胶囊形状 */
                background-color: #f3f4f6;
                color: #4b5563;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid transparent;
                outline: none;
                white-space: nowrap;
            }
            .dark .filter-option {
                background-color: #374151;
                color: #d1d5db;
            }
            .filter-option:hover:not(.active) {
                background-color: #e5e7eb;
                color: #3b82f6;
            }
            .dark .filter-option:hover:not(.active) {
                background-color: #4b5563;
                color: #60a5fa;
            }
            .filter-option.active {
                background-color: #3b82f6;
                color: white;
                border-color: #3b82f6;
            }
            .dark .filter-option.active {
                background-color: #60a5fa;
                border-color: #60a5fa;
            }
            /* 下拉菜单样式优化 */
            .ph-dd-wrap {
                position: relative;
                margin-right: 8px;
            }
            .ph-dd-toggle {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                border-radius: 9999px; /* 胶囊形状 */
                background-color: #f3f4f6;
                color: #4b5563;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid transparent;
                outline: none;
                white-space: nowrap;
            }
            .dark .ph-dd-toggle {
                background-color: #374151;
                color: #d1d5db;
            }
            .ph-dd-toggle:hover {
                background-color: #e5e7eb;
                color: #3b82f6;
            }
            .dark .ph-dd-toggle:hover {
                background-color: #4b5563;
                color: #60a5fa;
            }
            .ph-dd-text {
                margin-right: 8px;
            }
            .ph-dd-icon {
                width: 16px;
                height: 16px;
                transition: transform 0.2s ease;
            }
            .ph-dd-wrap.show .ph-dd-icon {
                transform: rotate(180deg);
            }
            .ph-dd-menu {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                z-index: 10;
                display: none;
                min-width: 400px;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                padding: 8px;
                border: 1px solid #e5e7eb;
            }
            .dark .ph-dd-menu {
                background-color: #1f2937;
                border-color: #374151;
            }
            .ph-dd-menu.show {
                display: block;
                animation: dropdownFade 0.2s ease;
            }
            @keyframes dropdownFade {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            /* 下拉项网格布局 */
            .ph-dd-grid {
                display: grid;
                grid-template-columns: repeat(5, auto);
                gap: 8px;
            }
            .ph-dd-item {
                padding: 10px 12px;
                border-radius: 8px;
                background-color: #f9fafb;
                color: #4b5563;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid transparent;
                text-align: center;
                outline: none;
                white-space: nowrap;
            }
            .dark .ph-dd-item {
                background-color: #374151;
                color: #d1d5db;
            }
            .ph-dd-item:hover {
                background-color: #e5e7eb;
                color: #3b82f6;
            }
            .dark .ph-dd-item:hover {
                background-color: #4b5563;
                color: #60a5fa;
            }
            .ph-dd-item.active {
                background-color: #dbeafe;
                color: #3b82f6;
                border-color: #93c5fd;
            }
            .dark .ph-dd-item.active {
                background-color: #1e3a8a;
                color: #93c5fd;
                border-color: #3b82f6;
            }
            .douban-results {
                flex: 1;
                overflow-y: auto;
                margin-bottom: 16px;
            }
            .douban-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 16px;
            }
            .douban-card {
                background: #f9fafb;
                border-radius: 12px;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                cursor: pointer;
            }
            .dark .douban-card {
                background: #1f2937;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .douban-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
            }
            .dark .douban-card:hover {
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
            }
            .douban-image-container {
                position: relative;
            }
            .douban-image {
                width: 100%;
                height: 225px;
                object-fit: cover;
            }
            .douban-rating {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
            }
            .douban-link-btn {
                position: absolute;
                top: 8px;
                left: 8px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease, background 0.3s ease, transform 0.3s ease;
                text-decoration: none;
                backdrop-filter: blur(4px);
                z-index: 10;
            }
            .douban-link-btn:hover {
                background: rgba(0, 0, 0, 0.85);
                transform: scale(1.1);
            }
            .douban-image-container:hover .douban-link-btn {
                opacity: 1;
            }
            .douban-link-btn svg {
                width: 18px;
                height: 18px;
                stroke-width: 2;
            }
            .dark .douban-link-btn {
                background: rgba(255, 255, 255, 0.15);
                color: white;
            }
            .dark .douban-link-btn:hover {
                background: rgba(255, 255, 255, 0.25);
            }
            .douban-title {
                padding: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #111827;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: default;
            }
            .dark .douban-title {
                color: #f9fafb;
            }
            .douban-card:hover .douban-title { color: #3b82f6; }
            .douban-year {
                padding: 0 8px 8px;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
            }
            .dark .douban-year {
                color: #9ca3af;
            }
            .douban-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 300px;
            }
            .douban-load-more {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .douban-load-more .loading-spinner {
                width: 30px;
                height: 30px;
            }
            .douban-load-more .loading-text {
                font-size: 12px;
            }
            .douban-results-wrapper {
                flex: 1;
                overflow: hidden;
                position: relative;
            }
            .douban-results {
                display: none;
                height: 100%;
                overflow-y: auto;
            }
            .douban-results.active {
                display: block;
            }
            /* Logo Mode Toggle Switch */
            .logo-mode-row.hidden { display: none !important; }
            .logo-mode-switch { display: flex; align-items: center; gap: 16px; width: 100%; }
            .logo-mode-text-left, .logo-mode-text-right { color: #374151; flex-shrink: 0; }
            .dark .logo-mode-text-left, .dark .logo-mode-text-right { color: #e5e7eb; }
            .logo-mode-toggle {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 26px;
                flex-shrink: 0;
            }
            .logo-mode-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .logo-mode-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .3s;
                border-radius: 26px;
            }
            .logo-mode-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .logo-mode-toggle input:checked + .logo-mode-slider {
                background-color: #3b82f6;
            }
            .logo-mode-toggle input:checked + .logo-mode-slider:before {
                transform: translateX(24px);
            }
            .logo-mode-toggle input:focus + .logo-mode-slider {
                box-shadow: 0 0 1px #3b82f6;
            }
            .dark .logo-mode-slider {
                background-color: #6b7280;
            }
            .dark .logo-mode-toggle input:checked + .logo-mode-slider {
                background-color: #3b82f6;
            }
        `;
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(styles);
        } else {
            const styleNode = document.createElement('style');
            styleNode.appendChild(document.createTextNode(styles));
            document.head.appendChild(styleNode);
        }
    }

    function main() {
        tailwind.config = {
            darkMode: 'class',
            theme: { extend: { colors: { primary: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e' } } } }
        };

        // 预加载每日放送数据和图片
        dailyDataPromise = getDailyData();
        dailyDataPromise.then(data => {
            // 预加载每日放送图片
            if (Array.isArray(data)) {
                data.forEach(day => {
                    (day.items || []).forEach(item => {
                        const img = new Image();
                        img.src = item.images?.large || item.image || '';
                    });
                });
            }
        }).catch(e => console.error("Pre-loading daily data failed:", e));

        // 预加载所有豆瓣数据
        preloadAllDoubanData();

        $(document).ready(function () {
            injectStyles();
            initTheme();
            $('body').append('<div id="elegant-modal-overlay" class="modal-overlay"></div>');
            createMainButton();
            createMainModal();
            createSettingsModal();
            createContextMenu();
            bindEvents();
        });
    }

    main();

})();
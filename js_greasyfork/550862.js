// ==UserScript==
// @name         NodeSeek & DeepFlood 双边会晤
// @namespace    http://www.nodeseek.com/
// @version      1.0.4
// @description  在NodeSeek和DeepFlood之间阅读对方站点的帖子
// @author       dabao
// @match        *://www.nodeseek.com/*
// @match        *://www.deepflood.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.nodeseek.com
// @connect      www.deepflood.com
// @run-at       document-end
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/550862/NodeSeek%20%20DeepFlood%20%E5%8F%8C%E8%BE%B9%E4%BC%9A%E6%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/550862/NodeSeek%20%20DeepFlood%20%E5%8F%8C%E8%BE%B9%E4%BC%9A%E6%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置模块 ==========
    const Config = {
        // 调试配置
        DEBUG: false, // 设置为 true 启用调试日志
        // 站点配置
        SITES: {
            NODESEEK: { name: 'NodeSeek', url: 'https://www.nodeseek.com', hostname: 'www.nodeseek.com' },
            DEEPFLOOD: { name: 'DeepFlood', url: 'https://www.deepflood.com', hostname: 'www.deepflood.com' }
        },

        // 路径匹配规则
        ALLOWED_PATHS: [
            /^\/$/,
            /^\?sortBy=/,
            /^\/page-\d+/,
            /^\/post-\d+/,
            /^\/categories\//,
            /^\/award/
        ],

        // DOM 选择器
        SELECTORS: {
            // 目标站点需要移除的元素
            REMOVE_ELEMENTS: 'body > header, body > footer, #nsk-left-panel-container, #nsk-right-panel-container',
            // iframe 内容选择器
            POST_LIST: 'ul.post-list',
            PAGER_TOP: 'div.nsk-pager.pager-top',
            PAGER_BOTTOM: 'div.nsk-pager.pager-bottom',
            SORTER: 'div.sorter',
            SORTER_LINKS: 'a[data-sort]',
            LINKS: 'a[href]'
        },

        // 时间配置
        TIMING: {
            INITIAL_LOAD_DELAY: 1000,           // 初始加载延迟
            NOTIFICATION_INIT_DELAY: 2000,       // 通知初始化延迟
            NOTIFICATION_INTERVAL: 5000,         // 通知轮询间隔
            BLOB_REVOKE_DELAY: 1000,            // Blob URL 释放延迟
            SCROLL_THROTTLE: 200,               // 滚动节流
            SCROLL_DEBOUNCE: 300                // 滚动防抖
        },

        // 滚动配置
        SCROLL: {
            THRESHOLD: 690,                     // 触发加载的距离阈值
            INITIAL_PAGE: 2                     // 初始分页页码
        },

        // 样式配置
        STYLES: {
            MODAL_WIDTH: '400px',
            MODAL_TOP: '40px',
            MODAL_OPACITY: 0.6,
            MODAL_OPACITY_HOVER: 1,
            HEADER_HEIGHT: '49px',
            COLLAPSED_HEIGHT: 'auto'  // 折叠后的高度（只显示标题栏）
        },

        // 折叠配置
        COLLAPSE: {
            STORAGE_KEY: 'dual_site_modal_collapsed',  // localStorage 键名
            DEFAULT_STATE: false  // 默认是否折叠
        }
    };

    // ========== 日志系统 ==========
    const Logger = {
        log(...args) {
            if (Config.DEBUG) {
                console.log('[双边会晤]', ...args);
            }
        },
        warn(...args) {
            if (Config.DEBUG) {
                console.warn('[双边会晤]', ...args);
            }
        },
        error(...args) {
            console.error('[双边会晤]', ...args); // 错误始终输出
        },
        info(...args) {
            if (Config.DEBUG) {
                console.info('[双边会晤]', ...args);
            }
        }
    };

    // ========== 工具模块 ==========
    const Utils = {
        // 节流函数
        throttle(fn, delay) {
            let last = 0;
            return (...args) => {
                const now = Date.now();
                if (now - last >= delay) {
                    last = now;
                    fn(...args);
                }
            };
        },

        // 防抖函数
        debounce(fn, delay) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => fn(...args), delay);
            };
        },

        // 封装 GM_xmlhttpRequest 为 Promise
        request(options) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: options.url,
                    onload: (response) => resolve(response),
                    onerror: (error) => reject(error)
                });
            });
        },

        // 解析 HTML 字符串
        parseHTML(htmlString) {
            const parser = new DOMParser();
            return parser.parseFromString(htmlString, "text/html");
        },

        // 在文档中注入 base 标签
        injectBase(doc, baseUrl) {
            const base = doc.createElement("base");
            base.href = baseUrl;
            const head = doc.querySelector("head") || doc.documentElement;
            head.insertBefore(base, head.firstChild);
        },

        // 设置所有链接在新标签页打开
        setLinksTarget(doc) {
            try {
                doc.querySelectorAll(Config.SELECTORS.LINKS).forEach(a => a.target = '_blank');
            } catch (e) {
                Logger.error('无法修改 iframe 内部链接:', e);
            }
        },

        // 移除指定元素
        removeElements(doc, selector) {
            try {
                doc.querySelectorAll(selector).forEach(el => el.remove());
            } catch (e) {
                Logger.error('移除元素失败:', e);
            }
        }
    };

    // BroadcastManager 类用于多标签页同步
    class BroadcastManager {
        static instances = new Map();

        constructor(channelName = "nsx_channel") {
            if (BroadcastManager.instances.has(channelName)) {
                return BroadcastManager.instances.get(channelName);
            }

            this.channelName = channelName;
            this.myId = `${Date.now()}-${Math.random()}`;
            this.receivers = [];
            this.ch = new BroadcastChannel(channelName);
            this.KEY = `only_last_tab_${channelName}`;
            this.active = false;

            this._init();
            BroadcastManager.instances.set(channelName, this);
        }

        // 初始化（私有方法）
        _init() {
            // 广播接收
            this.ch.onmessage = e => this._notify(e.data);

            // 主控权管理
            localStorage.setItem(this.KEY, this.myId);
            this._updateActive();

            // 事件监听
            addEventListener("storage", e => this._handleStorage(e));
            addEventListener("beforeunload", () => this._handleUnload());
        }

        // 处理存储事件（私有方法）
        _handleStorage(e) {
            if (e.key === this.KEY) {
                if (!e.newValue) {
                    localStorage.setItem(this.KEY, this.myId);
                }
                this._updateActive();
            }
        }

        // 处理卸载事件（私有方法）
        _handleUnload() {
            if (this.active) {
                localStorage.removeItem(this.KEY);
            }
        }

        // 更新主控状态（私有方法）
        _updateActive() {
            this.active = localStorage.getItem(this.KEY) === this.myId;
            Logger.log(`标签页 ${this.myId} 主控状态:`, this.active);
        }

        // 通知所有接收器（私有方法）
        _notify(data) {
            this.receivers.forEach(fn => {
                try {
                    fn(data);
                } catch (err) {
                    Logger.error('接收器执行错误:', err);
                }
            });
        }

        // 注册接收器（公开方法）
        registerReceiver(fn) {
            if (typeof fn === 'function') {
                this.receivers.push(fn);
                Logger.log('注册接收器，当前接收器数量:', this.receivers.length);
            } else {
                Logger.warn('注册接收器失败：参数不是函数');
            }
        }

        // 广播消息（公开方法）
        broadcast(data) {
            const message = { sender: this.myId, data };
            this.ch.postMessage(message);
            this._notify(message);
        }

        // 启动定时任务（公开方法）
        startTask(taskFn, interval) {
            Logger.log(`启动定时任务，间隔: ${interval}ms`);
            setInterval(async () => {
                if (!this.active) return;

                try {
                    const result = await taskFn();
                    this.broadcast(result);
                } catch (err) {
                    Logger.error('定时任务执行错误:', err);
                }
            }, interval);
        }
    }

    // ========== UI 管理器 ==========
    class UIManager {
        constructor(targetSite) {
            this.targetSite = targetSite;
            this.elements = null;
            this.isCollapsed = this._loadCollapseState(); // 加载折叠状态
            this._createModal(); // 自动初始化
            Logger.log('UI 管理器初始化完成，折叠状态:', this.isCollapsed);
        }

        // 加载折叠状态（私有方法）
        _loadCollapseState() {
            const stored = localStorage.getItem(Config.COLLAPSE.STORAGE_KEY);
            return stored !== null ? stored === 'true' : Config.COLLAPSE.DEFAULT_STATE;
        }

        // 保存折叠状态（私有方法）
        _saveCollapseState() {
            localStorage.setItem(Config.COLLAPSE.STORAGE_KEY, this.isCollapsed.toString());
            Logger.log('保存折叠状态:', this.isCollapsed);
        }

        // 创建浮动面板（私有方法）
        _createModal() {
            const modal = document.createElement('div');
            modal.id = 'dual-site-modal';
            modal.innerHTML = `
                <div id="dual-site-header">
                    <div id="dual-site-header-left">
                        <button id="dual-site-toggle" class="btn-toggle" title="折叠/展开">
                            <span class="toggle-icon">${this.isCollapsed ? '▼' : '▲'}</span>
                        </button>
                        <h3 id="dual-site-title">
                            <a href="${this.targetSite.url}" target="_blank">${this.targetSite.name}</a>
                            <div id="dual-site-notifications">
                                <span title="未读通知">
                                    <a href="${this.targetSite.url}/notification" target="_blank"><span class="notify-badge zero" id="notify-all">0</span></a>
                                </span>
                            </div>
                        </h3>
                    </div>
                    <button id="dual-site-refresh" class="btn">刷新</button>
                </div>
                <iframe id="dual-site-iframe" style="display:none"></iframe>
                <div id="dual-site-loading">加载中...</div>
            `;
            document.body.appendChild(modal);

            this.elements = {
                modal,
                iframe: modal.querySelector('#dual-site-iframe'),
                loading: modal.querySelector('#dual-site-loading'),
                refreshBtn: modal.querySelector('#dual-site-refresh'),
                toggleBtn: modal.querySelector('#dual-site-toggle'),
                toggleIcon: modal.querySelector('.toggle-icon')
            };

            // 绑定折叠按钮事件
            this.elements.toggleBtn.addEventListener('click', () => this.toggleCollapse());

            // 应用初始折叠状态
            this._applyCollapseState();

            return this.elements;
        }

        // 显示加载状态
        showLoading() {
            if (!this.elements) return;
            this.elements.loading.style.display = 'block';
            this.elements.iframe.style.display = 'none';
            this.elements.refreshBtn.disabled = true;
            this.elements.refreshBtn.textContent = '加载中...';
        }

        // 隐藏加载状态
        hideLoading() {
            if (!this.elements) return;
            this.elements.loading.style.display = 'none';
            this.elements.iframe.style.display = 'block';
            this.elements.refreshBtn.disabled = false;
            this.elements.refreshBtn.textContent = '刷新';
        }

        // 显示错误状态
        showError(message = '加载失败') {
            if (!this.elements) return;
            this.elements.loading.innerHTML = `<span style="color: #dc3545;">${message}</span>`;
            this.elements.refreshBtn.disabled = false;
            this.elements.refreshBtn.textContent = '重试';
        }

        // 应用折叠状态（私有方法）
        _applyCollapseState() {
            if (this.isCollapsed) {
                this.elements.modal.classList.add('collapsed');
                this.elements.toggleIcon.textContent = '▼';  // 折叠状态：向下箭头（点击展开）
            } else {
                this.elements.modal.classList.remove('collapsed');
                this.elements.toggleIcon.textContent = '▲';  // 展开状态：向上箭头（点击折叠）
            }
        }

        // 切换折叠状态
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            this._applyCollapseState();
            this._saveCollapseState();
            Logger.log('切换折叠状态:', this.isCollapsed);
        }

        // 更新通知徽章
        updateNotificationBadge(count) {
            const badge = this.elements.modal.querySelector('#notify-all');
            if (badge) {
                badge.textContent = count;
                badge.classList.toggle('zero', count === 0);
            }
        }
    }

    // ========== 内容加载器 ==========
    class ContentLoader {
        constructor(targetSite, uiManager) {
            this.targetSite = targetSite;
            this.uiManager = uiManager;
        }

        // 加载页面内容
        async loadPage(sortBy = '') {
            this.uiManager.showLoading();

            const url = `${this.targetSite.url}${sortBy?.trim() ? `?sortBy=${sortBy}` : ''}`;

            try {
                const response = await Utils.request({ method: 'GET', url });
                const doc = Utils.parseHTML(response.responseText);

                // 处理文档
                this.processDocument(doc);

                // 创建 Blob URL 并加载到 iframe
                const htmlStr = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
                const blob = new Blob([htmlStr], { type: "text/html" });
                const blobUrl = URL.createObjectURL(blob);

                const iframe = this.uiManager.elements.iframe;
                iframe.src = blobUrl;

                iframe.onload = () => {
                    this.uiManager.hideLoading();
                    this.setupIframeContent(iframe.contentDocument);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), Config.TIMING.BLOB_REVOKE_DELAY);
                };
            } catch (error) {
                Logger.error('加载页面失败:', error);
                this.uiManager.showError();
            }
        }

        // 处理文档内容
        processDocument(doc) {
            // 注入 base 标签
            Utils.injectBase(doc, `${this.targetSite.url}/`);

            // 移除不需要的元素
            Utils.removeElements(doc, Config.SELECTORS.REMOVE_ELEMENTS);
        }

        // 设置 iframe 内容
        setupIframeContent(doc) {
            // 设置链接在新标签页打开
            Utils.setLinksTarget(doc);

            // 附加排序处理器
            this.attachSorterHandlers(doc);

            // 设置无限滚动
            this.setupInfiniteScroll(doc);
        }

        // 附加排序处理器
        attachSorterHandlers(doc) {
            const sorter = doc.querySelector(Config.SELECTORS.SORTER);
            if (!sorter) return;

            sorter.querySelectorAll(Config.SELECTORS.SORTER_LINKS).forEach(a => {
                a.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const sortBy = a.dataset.sort;
                    this.loadPage(sortBy);
                }, true);
            });
        }

        // 设置无限滚动
        setupInfiniteScroll(doc) {
            const postList = doc.querySelector(Config.SELECTORS.POST_LIST);
            const topPager = doc.querySelector(Config.SELECTORS.PAGER_TOP);
            const bottomPager = doc.querySelector(Config.SELECTORS.PAGER_BOTTOM);

            if (!postList) {
                Logger.warn('未找到帖子列表，无法启用无限滚动');
                return;
            }

            // 创建分页管理器
            const paginationManager = new PaginationManager(
                this.targetSite,
                postList,
                { top: topPager, bottom: bottomPager },
                doc
            );

            // 初始化分页
            paginationManager.init();
        }
    }

    // ========== 分页管理器 ==========
    class PaginationManager {
        constructor(targetSite, postList, pagers, doc) {
            this.targetSite = targetSite;
            this.postList = postList;
            this.topPager = pagers.top;
            this.bottomPager = pagers.bottom;
            this.doc = doc;
            this.page = Config.SCROLL.INITIAL_PAGE;
            this.isLoading = false;
            Logger.log('分页管理器初始化完成');
        }

        // 初始化滚动监听
        init() {
            const throttledCheck = Utils.throttle(
                () => this._checkShouldLoad(),
                Config.TIMING.SCROLL_THROTTLE
            );
            const debouncedCheck = Utils.debounce(
                () => this._checkShouldLoad(),
                Config.TIMING.SCROLL_DEBOUNCE
            );

            this.doc.addEventListener('scroll', () => {
                throttledCheck();
                debouncedCheck();
            });

            Logger.log('分页滚动监听已启动');
        }

        // 检查是否应该加载更多（私有方法）
        _checkShouldLoad() {
            const { scrollTop, clientHeight, scrollHeight } = this.doc.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - Config.SCROLL.THRESHOLD) {
                this._loadMore();
            }
        }

        // 加载更多内容（私有方法）
        async _loadMore() {
            if (this.isLoading) return;

            this.isLoading = true;
            Logger.log(`开始加载第 ${this.page} 页`);

            try {
                const res = await Utils.request({
                    method: 'GET',
                    url: `${this.targetSite.url}/page-${this.page}`
                });

                const newDoc = Utils.parseHTML(res.responseText);
                Utils.setLinksTarget(newDoc);

                const newList = newDoc.querySelector(Config.SELECTORS.POST_LIST);
                const newTopPager = newDoc.querySelector(Config.SELECTORS.PAGER_TOP);
                const newBottomPager = newDoc.querySelector(Config.SELECTORS.PAGER_BOTTOM);

                if (newList && newList.children.length > 0) {
                    // 追加新内容
                    Array.from(newList.children).forEach(li => this.postList.appendChild(li));

                    // 更新分页器
                    if (newTopPager && this.topPager) {
                        this.topPager.innerHTML = newTopPager.innerHTML;
                    }
                    if (newBottomPager && this.bottomPager) {
                        this.bottomPager.innerHTML = newBottomPager.innerHTML;
                    }

                    this.page++;
                    Logger.log(`第 ${this.page - 1} 页加载成功，新增 ${newList.children.length} 项`);
                } else {
                    Logger.log('没有更多内容了');
                }
            } catch (error) {
                Logger.error('分页加载失败:', error);
            } finally {
                this.isLoading = false;
            }
        }
    }

    // ========== 通知同步器 ==========
    class NotificationSync {
        constructor(baseUrl, uiManager) {
            this.baseUrl = baseUrl;
            this.uiManager = uiManager;
            this.broadcastManager = null;
        }

        // 初始化通知同步
        init() {
            this.broadcastManager = new BroadcastManager("ns_df_notification");

            // 注册数据接收器
            this.broadcastManager.registerReceiver(({ data }) => {
                if (data.type === 'unreadCount' && data.counts) {
                    Logger.log('接收到通知数据:', data.counts);
                    this.uiManager.updateNotificationBadge(data.counts.all || 0);
                }
            });

            // 启动定时任务
            this.broadcastManager.startTask(async () => {
                return await this.fetchNotifications();
            }, Config.TIMING.NOTIFICATION_INTERVAL);
        }

        // 获取通知数据
        async fetchNotifications() {
            try {
                const response = await Utils.request({
                    method: 'GET',
                    url: `${this.baseUrl}/api/notification/unread-count`
                });

                if (response.status !== 200) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = JSON.parse(response.responseText);
                if (data.success && data.unreadCount) {
                    Logger.log('获取到新通知数据:', data.unreadCount);
                    return {
                        type: 'unreadCount',
                        counts: data.unreadCount,
                        timestamp: Date.now()
                    };
                } else {
                    throw new Error('Invalid response');
                }
            } catch (err) {
                Logger.error('获取通知失败:', err);
                throw err;
            }
        }
    }

    // ========== 样式生成器 ==========
    const generateStyles = () => {
        const { MODAL_WIDTH, MODAL_TOP, MODAL_OPACITY, MODAL_OPACITY_HOVER, HEADER_HEIGHT, COLLAPSED_HEIGHT } = Config.STYLES;
        return `
            #dual-site-modal {
                position: fixed;
                top: ${MODAL_TOP};
                right: 0;
                bottom: 0;
                width: ${MODAL_WIDTH};
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 8px 0 0 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                opacity: ${MODAL_OPACITY};
                transition: opacity 0.3s ease, height 0.3s ease, bottom 0.3s ease;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
            }
            #dual-site-modal:hover { opacity: ${MODAL_OPACITY_HOVER}; }
            #dual-site-modal.collapsed {
                height: ${COLLAPSED_HEIGHT};
                bottom: auto;
            }
            #dual-site-modal.collapsed #dual-site-iframe { display: none !important; }
            #dual-site-modal.collapsed #dual-site-loading { display: none !important; }
            #dual-site-header { padding: 8px 16px; background: #f8f9fa; border-bottom: 1px solid #eee; border-radius: 8px 0 0 0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
            #dual-site-header-left { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
            #dual-site-title { font-weight: 600; font-size: 14px; color: #333; margin: 0; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
            #dual-site-notifications { display: flex; gap: 10px; font-size: 12px; }
            #dual-site-notifications > span { display: flex; align-items: center; gap: 4px; color: #666; }
            #dual-site-notifications .notify-badge { background: #ff4444; color: #fff; padding: 1px 6px; border-radius: 10px; font-weight: 600; min-width: 18px; text-align: center; }
            #dual-site-notifications .notify-badge.zero { background: #ccc; }
            .btn-toggle { background: none; border: none; cursor: pointer; padding: 4px 8px; font-size: 14px; color: #666; transition: color 0.2s; }
            .btn-toggle:hover { color: #333; background: #e9ecef; border-radius: 4px; }
            .toggle-icon { display: inline-block; line-height: 1; }
            #dual-site-refresh:disabled { background: #6c757d; cursor: not-allowed; }
            #dual-site-iframe { width: 100%; height: calc(100% - ${HEADER_HEIGHT}); border: none; overflow: hidden; flex: 1; }
            #dual-site-loading { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #666; font-size: 14px; }
            #fast-nav-button-group { right: calc(50% - 540px) !important; }
        `;
    };

    // ========== 主应用 ==========
    class Application {
        constructor() {
            this.targetSite = null;
            this.uiManager = null;
            this.contentLoader = null;
            this.notificationSync = null;
        }

        // 检查路径是否匹配
        checkPathMatch() {
            const path = window.location.pathname + window.location.search;
            return Config.ALLOWED_PATHS.some(re => re.test(path));
        }

        // 确定目标站点
        determineTargetSite() {
            const currentHost = window.location.hostname;
            return currentHost === Config.SITES.NODESEEK.hostname
                ? Config.SITES.DEEPFLOOD
                : Config.SITES.NODESEEK;
        }

        // 注入样式
        injectStyles() {
            GM_addStyle(generateStyles());
        }

        // 初始化组件
        initializeComponents() {
            // 创建 UI 管理器（自动创建模态框）
            this.uiManager = new UIManager(this.targetSite);

            // 创建内容加载器
            this.contentLoader = new ContentLoader(this.targetSite, this.uiManager);

            // 绑定刷新按钮事件
            this.uiManager.elements.refreshBtn.addEventListener('click', () => this.contentLoader.loadPage());

            // 延迟初始加载
            setTimeout(() => this.contentLoader.loadPage(), Config.TIMING.INITIAL_LOAD_DELAY);

            // 创建通知同步器并延迟初始化
            this.notificationSync = new NotificationSync(this.targetSite.url, this.uiManager);
            setTimeout(() => this.notificationSync.init(), Config.TIMING.NOTIFICATION_INIT_DELAY);
        }

        // 启动应用
        init() {
            // 检查路径是否匹配
            if (!this.checkPathMatch()) {
                Logger.info('当前路径不匹配，脚本不执行');
                return;
            }

            // 确定目标站点
            this.targetSite = this.determineTargetSite();
            Logger.info(`当前站点: ${window.location.hostname}, 目标站点: ${this.targetSite.name}`);

            // 注入样式
            this.injectStyles();

            // 初始化组件
            this.initializeComponents();
        }
    }

    // ========== 启动应用 ==========
    const app = new Application();
    app.init();
})();
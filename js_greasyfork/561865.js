// ==UserScript==
// @name         Steam鉴赏家后台创建评测功能增强
// @namespace    https://steamcommunity.com/
// @version      1.0
// @description  便捷选择最近游玩过的游戏发组评，便捷选择最近发过的评测作为完整评测URL，支持后台预加载
// @author       sjx01
// @match        https://store.steampowered.com/curator/*/admin*
// @connect      store.steampowered.com
// @connect      steamcommunity.com
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561865/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%88%9B%E5%BB%BA%E8%AF%84%E6%B5%8B%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561865/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%88%9B%E5%BB%BA%E8%AF%84%E6%B5%8B%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置常量 ---
    const CACHE_KEYS = {
        recentGames: 'SCRH_RecentGames_v1',
        userReviews: 'SCRH_UserReviews_v1',
        prefMode: 'SCRH_ViewMode' // “横版封面(商店视图)”或“竖版封面(库视图)”
    };
    const CACHE_DURATION = 1000 * 60 * 10; // 默认缓存保留10分钟，可自行定义

    // --- 样式注入 ---
    GM_addStyle(`
        /* 容器基础样式 */
        #scrh_container {
            margin-top: 5px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            border: 1px solid #3c3d3e;
            opacity: 0;
            transition: opacity 0.3s ease-in;
        }
        #scrh_container.visible { opacity: 1; }

        /* 顶部控制栏 */
        .scrh-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
            color: #8f98a0;
        }
        .scrh-select {
            background: #101214;
            color: #dcdedf;
            border: 1px solid #4c4d4e;
            padding: 2px 5px;
            border-radius: 2px;
            font-size: 11px;
            outline: none;
        }

        /* 游戏网格 */
        .scrh-grid {
            display: grid;
            gap: 8px;
            overflow-y: auto; /* 垂直滚动 */
            padding-right: 5px; /* 防止滚动条遮挡 */
            min-height: 50px;
        }

        /* 滚动条样式美化 */
        .scrh-grid::-webkit-scrollbar { width: 6px; }
        .scrh-grid::-webkit-scrollbar-track { background: #1b2838; }
        .scrh-grid::-webkit-scrollbar-thumb { background: #4c6b88; border-radius: 3px; }

        /* 模式样式 */
        /* 横屏模式：每行约3-4个，高度适配2行 */
        .scrh-grid.mode-landscape {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            max-height: 240px; /* 约2行的高度 */
        }
        /* 竖屏模式：每行更多，高度适配1行 */
        .scrh-grid.mode-portrait {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            max-height: 190px;; /* 约1行的高度 */
        }

        /* 卡片样式 */
        .scrh-card {
            position: relative;
            cursor: pointer;
            background: #1b2838;
            border: 1px solid transparent;
            transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
            overflow: hidden;
            /* 骨架屏背景色 */
            background: linear-gradient(90deg, #1b2838 25%, #233142 50%, #1b2838 75%);
            background-size: 200% 100%;
            animation: scrh-skeleton 1.5s infinite;
        }
        @keyframes scrh-skeleton {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        .scrh-card:hover {
            border-color: #66c0f4;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            z-index: 10;
        }

        /* 图片渐进式加载优化 */
        .scrh-card img {
            width: 100%;
            display: block;
            object-fit: cover;
            opacity: 0; /* 默认隐藏 */
            transition: opacity 0.4s ease-out;
            min-height: 40px; /* 防止高度坍塌 */
        }
        .scrh-card img.loaded {
            opacity: 1;
        }

        .scrh-card .game-name {
            padding: 4px;
            font-size: 11px;
            color: #dcdedf;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            background: #171a21;
            # position: absolute; #启用后布局会更紧凑，游戏标题会覆盖图片底部区域，需要同步更改.scrh-grid.mode-landscape和.scrh-grid.mode-portrait 的 max-height
            bottom: 0;
            width: 100%;
        }

        /* --- 评测下拉框样式 (仿原生样式) --- */
        #scrh_review_popup {
            position: absolute;
            z-index: 999;
            background: #3d4450;
            border: 1px solid #4c4d4e;
            box-shadow: 0 4px 16px rgba(0,0,0,0.9);
            width: 400px;
            max-height: 320px;
            overflow-y: auto;
            display: none;
            color: #dcdedf;
            font-size: 12px;
            border-radius: 3px;
        }
        /* 下拉框标题 */
        .scrh-popup-header {
            padding: 8px 10px;
            background: #2a3038;
            border-bottom: 1px solid #4c4d4e;
            font-weight: bold;
            color: #66c0f4;
            position: sticky;
            top: 0;
            z-index: 2;
        }

        .scrh-popup-item {
            display: flex;
            align-items: center;
            padding: 6px 10px;
            cursor: pointer;
            border-bottom: 1px solid rgba(0,0,0,0.2);
            transition: background 0.1s;
            position: relative;
        }
        .scrh-popup-item:hover {
            background: #545e6d;
        }
        /* 评测选项 Hover 提示 */
        .scrh-popup-item:hover::after {
            content: attr(data-hint);
            position: absolute;
            right: 10px;
            font-size: 10px;
            color: #a3cfec;
            font-style: italic;
        }

        .scrh-popup-item img {
            width: 50px;
            height: auto;
            margin-right: 10px;
            border-radius: 2px;
            box-shadow: 0 0 4px rgba(0,0,0,0.5);
        }
        .scrh-popup-item .title {
            font-weight: bold;
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .scrh-loading-text {
            padding: 15px;
            text-align: center;
            color: #8f98a0;
        }
    `);

    // --- 核心工具 ---

    const Store = {
        get: (key) => {
            try {
                const item = JSON.parse(sessionStorage.getItem(key));
                if (!item) return null;
                if (Date.now() > item.expiry) {
                    sessionStorage.removeItem(key);
                    return null;
                }
                return item.data;
            } catch (e) { return null; }
        },
        set: (key, data) => {
            try {
                sessionStorage.setItem(key, JSON.stringify({
                    data: data,
                    expiry: Date.now() + CACHE_DURATION
                }));
            } catch (e) { console.warn('SessionStorage quota exceeded'); }
        }
    };

    function getSteamID() {
        // 尝试从页面顶部的个人资料链接获取steamid
        const profileLink = document.querySelector('.user_avatar a') || document.querySelector('a[href*="/profiles/"]');
        if (profileLink) {
            const match = profileLink.href.match(/\/profiles\/(\d+)/);
            if (match) return match[1];
        }
        return null;
    }

    // 获取当前鉴赏家 URL 的唯一标识，用于 AJAX 请求
    function getCuratorPath() {
        const match = window.location.pathname.match(/\/curator\/([^\/]+)\//);
        return match ? match[1] : null;
    }

    // 触发 Input 事件以适配 Steam 页面逻辑
    function triggerInputEvent(element, value) {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        // 视觉反馈
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = '#3c5a70';
        setTimeout(() => element.style.backgroundColor = originalBg, 300);
    }

    // 并发限制和队列的请求函数
    function req(url, method = 'GET') {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) resolve(res.responseText);
                    else reject(res.statusText);
                },
                onerror: reject
            });
        });
    }

    // --- 模块 1: 最近游玩游戏 ---

    const RecentGames = {
        data: [],
        currentMode: 'landscape', // 缓存当前模式状态

        init: async function() {
            this.currentMode = sessionStorage.getItem(CACHE_KEYS.prefMode) || 'landscape';

            // 检查缓存
            const cached = Store.get(CACHE_KEYS.recentGames);
            if (cached) {
                this.data = cached;
                this.render();
                return;
            }

            const steamId = getSteamID();
            if (!steamId) return;

            try {
                const html = await req(`https://steamcommunity.com/profiles/${steamId}/games?tab=recent`);
                this.parse(html);
                Store.set(CACHE_KEYS.recentGames, this.data);
                this.render();
            } catch (e) {
                console.error("Fetch recent games failed:", e);
            }
        },

        parse: function(htmlString) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const games = [];
            const gameNodes = doc.querySelectorAll('div[role="button"]'); // 通用容器

            // 提取游戏信息和数据
            gameNodes.forEach(node => {
                const link = node.querySelector('a[href*="/app/"]');
                if (!link) return;
                const appIdMatch = link.href.match(/\/app\/(\d+)/);
                if (!appIdMatch) return;

                const picImg = node.querySelector('picture img');
                const picSource = node.querySelector('picture source'); // 竖版图片

                if (picImg) {
                    games.push({
                        appId: appIdMatch[1],
                        name: picImg.getAttribute('alt') || "Unknown",
                        // 优化：只存URL字符串，渲染时再决定加载哪个
                        imgL: picImg.getAttribute('src'),
                        imgP: picSource ? picSource.getAttribute('srcset').split(',')[0].trim().split(' ')[0] : picImg.getAttribute('src')
                    });
                }
            });

            // 去重
            const seen = new Set();
            this.data = games.filter(g => {
                if(seen.has(g.appId)) return false;
                seen.add(g.appId);
                return true;
            });
        },

        fillForm: function(game) {
            const nameInput = document.getElementById('app_suggest');
            const idInput = document.getElementById('app_suggest_id');
            if (nameInput && idInput) {
                idInput.value = game.appId;
                triggerInputEvent(nameInput, game.name);
            }
        },

        render: function() {
            const targetContainer = document.querySelector('.recent_games');
            if (!targetContainer || document.getElementById('scrh_container')) return;

            targetContainer.innerHTML = ''; // 清除 loading

            // 容器
            const container = document.createElement('div');
            container.id = 'scrh_container';

            // 头部
            const header = document.createElement('div');
            header.className = 'scrh-header';
            header.innerHTML = `<span>最近游玩 (${this.data.length})</span>`;

            // 模式选择
            const select = document.createElement('select');
            select.className = 'scrh-select';
            select.innerHTML = `
                <option value="landscape" ${this.currentMode === 'landscape' ? 'selected' : ''}>横版封面(商店视图)</option>
                <option value="portrait" ${this.currentMode === 'portrait' ? 'selected' : ''}>竖版封面(库视图)</option>
            `;
            // 事件委托处理切换
            select.addEventListener('change', (e) => this.switchMode(e.target.value));

            header.appendChild(select);
            container.appendChild(header);

            // 游戏列表网格
            const grid = document.createElement('div');
            grid.id = 'scrh_grid';
            grid.className = `scrh-grid mode-${this.currentMode}`;

            if (this.data.length === 0) {
                grid.innerHTML = '<div style="padding:10px; color:#888;">未获取到最近游戏数据。</div>';
                container.classList.add('visible');
            } else {
                const fragment = document.createDocumentFragment();
                let loadedImagesCount = 0;
                const totalImages = this.data.length;

                this.data.forEach(game => {
                    const card = document.createElement('div');
                    card.className = 'scrh-card';
                    card.title = `点击选择: ${game.name}`;
                    card.onclick = () => this.fillForm(game);

                    const img = document.createElement('img');
                    // 只设置当前模式的 src，另一种存入 dataset
                    const targetSrc = this.currentMode === 'landscape' ? game.imgL : game.imgP;
                    img.src = targetSrc;
                    img.dataset.landscape = game.imgL;
                    img.dataset.portrait = game.imgP;

                    // 单图加载完成回调
                    img.onload = () => {
                        img.classList.add('loaded'); // 触发 Fade-in
                        card.style.animation = 'none'; // 停止骨架屏动画
                        loadedImagesCount++;

                        // 当主图片加载达到一定比例(例如80%)或全部完成，开始后台加载其他图片
                        if (loadedImagesCount === totalImages) {
                             // 1. 预加载另一种模式的图
                             setTimeout(() => this.preloadAlternateImages(), 1000);
                             // 2. 开始获取评测数据
                             setTimeout(() => ReviewLinkHelper.startBackgroundFetch(), 500);
                        }
                    };
                    // 容错
                    img.onerror = img.onload;

                    card.appendChild(img);

                    // 名字遮罩
                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'game-name';
                    nameDiv.textContent = game.name;
                    card.appendChild(nameDiv);

                    fragment.appendChild(card);
                });
                grid.appendChild(fragment);
            }

            container.appendChild(grid);
            targetContainer.appendChild(container);

            // 强制重绘后显示容器
            requestAnimationFrame(() => container.classList.add('visible'));
        },

        switchMode: function(mode) {
            this.currentMode = mode;
            sessionStorage.setItem(CACHE_KEYS.prefMode, mode);

            const grid = document.getElementById('scrh_grid');
            if(!grid) return;

            grid.className = `scrh-grid mode-${mode}`;

            const cards = grid.querySelectorAll('.scrh-card img');
            cards.forEach(img => {
                const targetSrc = mode === 'landscape' ? img.dataset.landscape : img.dataset.portrait;
                // 如果已经预载过直接切换，如果没有则发起请求
                if (img.src !== targetSrc) {
                    img.src = targetSrc;
                }
            });
        },

        // 后台预载另一种模式的图片
        preloadAlternateImages: function() {
            const alternateMode = this.currentMode === 'landscape' ? 'portrait' : 'landscape';
            // 使用 Image 对象在内存中预加载
            this.data.forEach(game => {
                const src = alternateMode === 'landscape' ? game.imgL : game.imgP;
                const preloadImg = new Image();
                preloadImg.src = src;
            });
        }
    };

    // --- 模块 2: 最近发布评测 ---

    const ReviewLinkHelper = {
        cachedData: null,
        popup: null,
        isFetching: false,

        init: function() {
            // 全局点击监听
            document.body.addEventListener('click', (e) => {
                if (e.target.name === 'link_url') {
                    this.showPopup(e.target);
                } else if (this.popup && !this.popup.contains(e.target) && e.target.id !== 'scrh_review_popup') {
                    this.popup.style.display = 'none';
                }
            });
        },

        // 外部调用的后台启动入口
        startBackgroundFetch: async function() {
            if (this.cachedData || this.isFetching) return;

            const sData = Store.get(CACHE_KEYS.userReviews);
            if (sData) {
                this.cachedData = sData;
                return;
            }

            // 闲时执行
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => this.fetchData());
            } else {
                setTimeout(() => this.fetchData(), 2000);
            }
        },

        fetchData: async function() {
            if (this.isFetching) return this.fetchPromise; // 防止重复请求
            this.isFetching = true;

            const steamId = getSteamID();
            if (!steamId) { this.isFetching = false; return []; }

            this.fetchPromise = (async () => {
                try {
                    // 1. 获取评测页面
                    const html = await req(`https://steamcommunity.com/profiles/${steamId}/recommended/`);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    const rawItems = [];
                    const reviewDivs = doc.querySelectorAll('.review_box_content');

                    reviewDivs.forEach(div => {
                        const link = div.querySelector('.leftcol a');
                        const img = div.querySelector('.leftcol img');
                        const titleLink = div.querySelector('.vote_header .title a');

                        if (link && titleLink) {
                            const appIdMatch = link.href.match(/\/app\/(\d+)/);
                            if (appIdMatch) {
                                rawItems.push({
                                    appId: appIdMatch[1],
                                    reviewUrl: titleLink.href, // 评测链接
                                    imgUrl: img ? img.src : '',
                                    name: '' // 游戏名
                                });
                            }
                        }
                    });

                    // 2. 获取游戏名 (并发请求限制前 20 个)
                    const itemsToFetch = rawItems.slice(0, 20);
                    const curatorPath = getCuratorPath();

                    if (curatorPath && itemsToFetch.length > 0) {
                        const promises = itemsToFetch.map(item => {
                            const url = `https://store.steampowered.com/curator/${curatorPath}/ajaxappsearchsuggest/?term=${item.appId}&cc=CN&language=schinese`;
                            return req(url).then(res => {
                                try {
                                    const json = JSON.parse(res);
                                    if (json && json.length > 0) item.name = json[0].name;
                                    else item.name = `AppID ${item.appId}`;
                                } catch (e) { item.name = `Game ${item.appId}`; }
                            }).catch(() => { item.name = `Game ${item.appId}`; });
                        });
                        await Promise.all(promises);
                    }

                    this.cachedData = itemsToFetch;
                    Store.set(CACHE_KEYS.userReviews, itemsToFetch);
                    return itemsToFetch;

                } catch (e) {
                    console.error("Review fetch error", e);
                    return [];
                } finally {
                    this.isFetching = false;
                }
            })();

            return this.fetchPromise;
        },

        showPopup: async function(inputElem) {
            if (!this.popup) {
                this.popup = document.createElement('div');
                this.popup.id = 'scrh_review_popup';
                document.body.appendChild(this.popup);
            }

            // 定位
            const rect = inputElem.getBoundingClientRect();
            this.popup.style.top = `${window.scrollY + rect.bottom + 5}px`;
            this.popup.style.left = `${window.scrollX + rect.left}px`;
            this.popup.style.width = `${Math.max(rect.width, 350)}px`;
            this.popup.style.display = 'block';

            // 检查是否加载好数据
            let data = this.cachedData;

            if (!data) {
                this.popup.innerHTML = '<div class="scrh-loading-text">正在加载您最近的评测列表...</div>';
                // 如果后台还没加载完或没开始，则直接强制开始
                data = await (this.fetchPromise || this.fetchData());
            }

            if (!data || data.length === 0) {
                this.popup.innerHTML = '<div class="scrh-loading-text">未找到您最近的公开评测。</div>';
                return;
            }

            // 渲染列表
            this.popup.innerHTML = `
                <div class="scrh-popup-header">选择一个您最近发布的评测</div>
                <div id="scrh_popup_list"></div>
            `;
            const listContainer = this.popup.querySelector('#scrh_popup_list');

            data.forEach(item => {
                const row = document.createElement('div');
                row.className = 'scrh-popup-item';
                row.dataset.hint = `选择 ${item.name} 的评测`;
                row.title = item.name;
                row.innerHTML = `
                    <img src="${item.imgUrl}">
                    <span class="title">${item.name}</span>
                `;
                row.addEventListener('click', () => {
                    triggerInputEvent(inputElem, item.reviewUrl);
                    this.popup.style.display = 'none';
                });
                listContainer.appendChild(row);
            });
        }
    };

    // --- 主入口与监听 ---

    // 使用 MutationObserver 处理 SPA 页面跳转和动态加载
    const observer = new MutationObserver((mutations) => {
        if (window.location.href.includes('/review_create')) {
            const container = document.querySelector('.recent_games');
            // 只在容器存在且脚本还没注入时执行
            if (container && !document.getElementById('scrh_container')) {
                RecentGames.init();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始化评测链接辅助功能
    ReviewLinkHelper.init();

    // 针对非SPA直接刷新的情况
    if (window.location.href.includes('/review_create')) {
        // 轮询检查直到容器出现
        const checkInterval = setInterval(() => {
            const container = document.querySelector('.recent_games');
            if (container) {
                if (!document.getElementById('scrh_container')) {
                    RecentGames.init();
                }
                clearInterval(checkInterval);
            }
        }, 200);
        // 5秒后停止轮询防止死循环
        setTimeout(() => clearInterval(checkInterval), 5000);
    }

})();

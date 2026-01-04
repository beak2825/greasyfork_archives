// ==UserScript==
// @name         Steam鉴赏家后台评测栏功能优化
// @namespace    https://steamcommunity.com/
// @version      1.2
// @description  在Steam鉴赏家后台的流量统计数据页面给评测添加删除功能按钮和评测类型显示，在评测编辑页面添加删除和跳转商店页功能按钮
// @author       sjx01
// @match        https://store.steampowered.com/curator/*/admin/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548372/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E5%90%8E%E5%8F%B0%E8%AF%84%E6%B5%8B%E6%A0%8F%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/548372/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E5%90%8E%E5%8F%B0%E8%AF%84%E6%B5%8B%E6%A0%8F%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 配置与图标
    // ==========================================
    const CONFIG = {
        maxConcurrency: 3,
        cacheExpiry: 24 * 60 * 60 * 1000,
        colors: {
            rec: '#66C0F4',
            notRec: '#c93939',
            info: '#FFFFFF',
            hover: '#2a475e'
        }
    };

    const ICONS = {
        delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
        edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        store: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
        spinner: `<svg class="ct-spinner" viewBox="0 0 50 50" style="width:14px;height:14px;"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>`
    };

    // ==========================================
    // 2. 样式注入
    // ==========================================
    GM_addStyle(`
        .ct_toolbar { display: flex; align-items: center; gap: 8px; justify-content: flex-end; opacity: 0.8; transition: opacity 0.2s; }
        .stats_review_list:hover .ct_toolbar { opacity: 1; }

        .ct_btn {
            display: flex; align-items: center; justify-content: center;
            width: 28px; height: 28px;
            border-radius: 4px; border: 1px solid transparent;
            background: rgba(255,255,255,0.05); color: #c6d4df;
            cursor: pointer; transition: all 0.2s;
        }
        .ct_btn:hover { background: ${CONFIG.colors.hover}; color: #fff; border-color: rgba(255,255,255,0.2); }
        .ct_btn.delete:hover { background: rgba(201, 57, 57, 0.2); color: #ff4d4d; border-color: #c93939; }
        .ct_btn.rect_btn { width: auto; padding: 0 10px; }

        .ct_tag {
            font-size: 10px; padding: 2px 6px; border-radius: 2px;
            font-weight: bold; margin-left: 8px; display: inline-block;
            text-transform: uppercase; letter-spacing: 0.5px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .ct-spinner { animation: rotate 2s linear infinite; }
        .ct-spinner .path { stroke: #66c0f4; stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
        @keyframes rotate { 100% { transform: rotate(360deg); } }
        @keyframes dash { 0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; } 100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; } }

        .ct-toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
        .ct-toast {
            background: #3d4450; color: #fff; padding: 10px 16px; border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4); font-size: 13px;
            display: flex; align-items: center; animation: slideIn 0.3s ease-out;
            border-left: 4px solid #66c0f4;
        }
        .ct-toast.success { border-left-color: #66c0f4; }
        .ct-toast.error { border-left-color: #c93939; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        [data-ct-tip] { position: relative; }
        [data-ct-tip]:hover::after {
            content: attr(data-ct-tip); position: absolute; bottom: 100%; left: 50%;
            transform: translateX(-50%) translateY(-5px); background: #171a21;
            color: #fff; padding: 4px 8px; font-size: 11px; border-radius: 3px;
            white-space: nowrap; pointer-events: none; z-index: 100;
            box-shadow: 0 2px 5px rgba(0,0,0,0.5); opacity: 0; animation: fadeIn 0.2s forwards;
        }
        @keyframes fadeIn { to { opacity: 1; } }
    `);

    // ==========================================
    // 3. 工具类 (请求、缓存、通知)
    // ==========================================

    const CacheManager = {
        get: (key) => {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (!item) return null;
                if (Date.now() > item.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
                return item.value;
            } catch (e) { return null; }
        },
        set: (key, value) => {
            try {
                const item = { value: value, expiry: Date.now() + CONFIG.cacheExpiry };
                localStorage.setItem(key, JSON.stringify(item));
            } catch (e) { console.warn('Storage full'); }
        }
    };

    class RequestQueue {
        constructor(concurrency) {
            this.concurrency = concurrency;
            this.running = 0;
            this.queue = [];
        }
        add(fn) {
            return new Promise((resolve, reject) => {
                this.queue.push({ fn, resolve, reject });
                this.next();
            });
        }
        next() {
            if (this.running >= this.concurrency || this.queue.length === 0) return;
            this.running++;
            const { fn, resolve, reject } = this.queue.shift();
            fn().then(resolve).catch(reject).finally(() => {
                this.running--;
                this.next();
            });
        }
    }
    const fetchQueue = new RequestQueue(CONFIG.maxConcurrency);

    function showToast(msg, type = 'success') {
        let container = document.querySelector('.ct-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'ct-toast-container';
            document.body.appendChild(container);
        }
        const el = document.createElement('div');
        el.className = `ct-toast ${type}`;
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(100%)';
            el.style.transition = 'all 0.3s ease-in';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ==========================================
    // 4. 数据获取逻辑
    // ==========================================

    async function fetchReviewInfo(curatorId, appId) {
        const cacheKey = `ct_rev_${curatorId}_${appId}`;
        const cached = CacheManager.get(cacheKey);
        if (cached !== null) return cached;

        return fetchQueue.add(async () => {
            try {
                const res = await fetch(`https://store.steampowered.com/curator/${curatorId}/admin/review_create/${appId}`);
                const text = await res.text();
                const stateMatch = text.match(/"recommendation_state" value="(\d)" checked/);
                const type = stateMatch ? parseInt(stateMatch[1]) : -1;
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const blurb = doc.querySelector('textarea[name="blurb"]')?.value || '';
                const result = { type, blurb };
                CacheManager.set(cacheKey, result);
                return result;
            } catch (err) {
                console.error('Fetch error:', err);
                return { type: -1, blurb: '' };
            }
        });
    }

    // ==========================================
    // 5. 页面增强逻辑
    // ==========================================

    // 处理：流量统计页面
    function enhanceStatsPage() {
        const rows = document.querySelectorAll('#RecentReferralsRows tr.stats_review_list, #TopReferralsRows tr.stats_review_list');
        
        rows.forEach(row => {
            // 汉化提示 (即使已处理过，如果提示文案没变，也需要改，防止Steam重置)
            const storeLink = row.querySelector('.review_title a.ttip');
            if (storeLink && storeLink.dataset.tooltipText === 'View this review in the store') {
                storeLink.setAttribute('data-tooltip-text', '在商店中查看该评测');
            }
            const editLinkRaw = row.querySelector('a.edit_review_option.ttip');
            if (editLinkRaw && editLinkRaw.dataset.tooltipText === 'Edit this review') {
                 editLinkRaw.setAttribute('data-tooltip-text', '编辑此评测');
            }

            // 防止重复处理 DOM
            if (row.dataset.ctProcessed) return;
            row.dataset.ctProcessed = 'true';

            const lastTd = row.querySelector('td:last-child');
            const editLink = lastTd?.querySelector('a.edit_review_option');
            if (!editLink) return;

            const match = editLink.href.match(/\/curator\/([^\/]+)\/admin\/review_create\/(\d+)/);
            if (!match) return;
            const [_, curator, appId] = match;

            // 构建工具栏
            const toolbar = document.createElement('div');
            toolbar.className = 'ct_toolbar';

            const editBtn = document.createElement('div');
            editBtn.className = 'ct_btn';
            editBtn.innerHTML = ICONS.edit;
            editBtn.setAttribute('data-ct-tip', '编辑评测');
            editBtn.onclick = () => window.open(editLink.href, '_blank');
            
            const delBtn = document.createElement('div');
            delBtn.className = 'ct_btn delete';
            delBtn.innerHTML = ICONS.delete;
            delBtn.setAttribute('data-ct-tip', '删除评测');
            delBtn.onclick = () => handleDelete(curator, appId, row);

            toolbar.append(editBtn, delBtn);
            lastTd.innerHTML = '';
            lastTd.appendChild(toolbar);

            // 评测类型标签
            const titleTd = row.querySelector('.review_title');
            if (titleTd) {
                const loadingSpan = document.createElement('span');
                loadingSpan.innerHTML = ICONS.spinner;
                loadingSpan.style.marginLeft = '8px';
                loadingSpan.style.opacity = '0.5';
                loadingSpan.style.display = 'inline-block';
                loadingSpan.style.verticalAlign = 'middle';
                titleTd.appendChild(loadingSpan);

                fetchReviewInfo(curator, appId).then(info => {
                    loadingSpan.remove();
                    let label = '';
                    let bgColor = '#555';
                    if (info.type === 0) { label = '推荐'; bgColor = CONFIG.colors.rec; }
                    else if (info.type === 1) { label = '不推荐'; bgColor = CONFIG.colors.notRec; }
                    else if (info.type === 2) { label = '情报'; bgColor = '#a0a0a0'; }
                    
                    if (label) {
                        const tag = document.createElement('span');
                        tag.className = 'ct_tag';
                        tag.textContent = label;
                        tag.style.backgroundColor = bgColor;
                        tag.style.color = '#fff';
                        titleTd.appendChild(tag);
                    }
                });
            }
        });
    }

    // 增强评测创建/编辑页面
    function enhanceReviewCreatePage() {
        // 等待页面关键元素加载
        const btnArea = document.querySelector('div.titleframe');
        // 如果没有 titleframe 或者已经处理过，就不再处理
        // Steam切换页面时，btnArea可能会被销毁并重建，所以要检测是否还包含控件
        if (!btnArea || btnArea.querySelector('.ct-custom-control')) return;

        const match = location.pathname.match(/\/curator\/([^\/]+)\/admin\/review_create\/?(\d+)?/);
        if (!match) return;
        const [_, curator, appId] = match;

        const wrapper = document.createElement('div');
        wrapper.className = 'ct-custom-control';
        wrapper.style.display = 'flex';
        wrapper.style.gap = '10px';
        wrapper.style.marginTop = '10px';

        if (appId) {
            // 固定 AppID 模式
            addEditorButtons(wrapper, curator, appId);
        } else {
            // 搜索/选择游戏模式
            const appSuggest = document.querySelector('#app_suggest_id');
            const statusDiv = document.createElement('div');
            statusDiv.style.color = '#8f98a0';
            statusDiv.style.fontSize = '12px';
            statusDiv.style.alignSelf = 'center';
            wrapper.appendChild(statusDiv);
            
            // 动态监测 AppID 输入变化
            const checkInterval = setInterval(() => {
                // 如果页面已经不存在这个元素了(跳转到其他页面)，清除定时器
                if (!document.body.contains(appSuggest)) {
                    clearInterval(checkInterval);
                    return;
                }

                const currentId = appSuggest?.value;
                if (currentId && wrapper.dataset.lastId !== currentId) {
                    wrapper.dataset.lastId = currentId;
                    statusDiv.innerHTML = `正在读取 AppID: ${currentId} ${ICONS.spinner}`;
                    wrapper.querySelectorAll('.ct_btn').forEach(b => b.remove());
                    
                    fetchReviewInfo(curator, currentId).then(info => {
                        statusDiv.textContent = info.blurb ? '✅ 已读取现有评测' : '📝 新评测';
                        const textArea = document.querySelector('textarea[name="blurb"]');
                        if(textArea && info.blurb) textArea.value = info.blurb;
                        addEditorButtons(wrapper, curator, currentId, true);
                    });
                } else if (!currentId) {
                    wrapper.dataset.lastId = '';
                    statusDiv.textContent = '请先选择游戏...';
                    wrapper.querySelectorAll('.ct_btn').forEach(b => b.remove());
                }
            }, 500);
        }
        
        btnArea.appendChild(wrapper);
    }

    function addEditorButtons(container, curator, appId, dynamicMode = false) {
        const storeBtn = document.createElement('a');
        storeBtn.className = 'ct_btn rect_btn';
        storeBtn.innerHTML = `${ICONS.store} <span style="margin-left:5px">商店页面</span>`;
        storeBtn.href = `https://store.steampowered.com/app/${appId}`;
        storeBtn.target = '_blank';
        
        const delBtn = document.createElement('div');
        delBtn.className = 'ct_btn delete rect_btn';
        delBtn.innerHTML = `${ICONS.delete} <span style="margin-left:5px">删除评测</span>`;
        delBtn.onclick = () => handleDelete(curator, appId, null, dynamicMode);

        container.appendChild(storeBtn);
        container.appendChild(delBtn);
    }

    // 删除逻辑
    function handleDelete(curator, appId, rowEl = null, redirect = false) {
        if (!confirm('⚠️ 确定要永久删除这条评测吗？')) return;

        const formData = new FormData();
        formData.append('appid', appId);
        formData.append('sessionid', window.g_sessionID);

        fetch(`https://store.steampowered.com/curator/${curator}/admin/ajaxdeletereview/`, {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (res.ok) {
                showToast('✅ 删除成功');
                localStorage.removeItem(`ct_rev_${curator}_${appId}`);
                
                if (rowEl) {
                    rowEl.style.transition = 'all 0.5s';
                    rowEl.style.opacity = '0';
                    setTimeout(() => rowEl.remove(), 500);
                }
                
                if (redirect) {
                   const textArea = document.querySelector('textarea[name="blurb"]');
                   if(textArea) textArea.value = '';
                   showToast('评测内容已清除');
                } else if (window.location.pathname.includes('review_create') && window.location.pathname.includes(appId)) {
                   setTimeout(() => window.location.href = `/curator/${curator}/admin/reviews_manage`, 1000);
                }
            } else {
                showToast('❌ 删除失败', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showToast('❌ 请求出错', 'error');
        });
    }

    // ==========================================
    // 6. 全局观察者 (解决SPA/动态加载)
    // ==========================================
    
    // 路由分发器：决定当前应该执行哪个逻辑
    const routeHandler = debounce(() => {
        const path = window.location.pathname;
        
        // 场景 1: 流量统计页面
        if (path.includes('admin/stats')) {
            // 检查表格是否存在
            if (document.querySelector('#RecentReferralsRows')) {
                enhanceStatsPage();
            }
        }
        
        // 场景 2: 评测编辑页面
        else if (path.includes('admin/review_create')) {
            enhanceReviewCreatePage();
        }
    }, 200);

    // 启动全局观察者
    const observer = new MutationObserver((mutations) => {
        // 每次 DOM 变化时，尝试执行路由分发
        // 由于加了 debounce，所以即便 mutations 频繁触发，也只会在停止变化后 200ms 执行一次
        routeHandler();
    });

    // 监听整个 body，确保能捕捉到 Steam 内容区的 AJAX 替换
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });

    // 首次运行
    routeHandler();

})();

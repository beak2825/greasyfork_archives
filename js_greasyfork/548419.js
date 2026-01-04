// ==UserScript==
// @name         m3u8Player
// @namespace    https://github.com/lol3721987/m3u8Player
// @version      1.2.5
// @license      MIT
// @description  支持多源浏览、分类筛选和搜索的M3U8视频播放器，基于HLS.js
// @author       zjb & Gemini
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @connect      cj.lziapi.com
// @connect      json.heimuer.xyz
// @connect      cj.rycjapi.com
// @connect      bfzyapi.com
// @connect      tyyszy.com
// @connect      ffzy5.tv
// @connect      360zy.com
// @connect      www.iqiyizyapi.com
// @connect      wolongzyw.com
// @connect      jszyapi.com
// @connect      dbzy.tv
// @connect      mozhuazy.com
// @connect      www.mdzyapi.com
// @connect      api.zuidapi.com
// @connect      m3u8.apiyhzy.com
// @connect      api.apibdzy.com
// @connect      api.wujinapi.me
// @connect      ikunzyapi.com
// @connect      dadiapi.com
// @connect      slapibf.com
// @connect      aosikazy.com
// @connect      apiyutu.com
// @connect      thzy1.me
// @connect      apilsbzy1.com
// @connect      cj.yayazy.net
// @connect      hhzyapi.com
// @connect      www.jkunzyapi.com
// @connect      naixxzy.com
// @connect      155api.com
// @connect      apilj.com
// @connect      caiji.semaozy.net
// @connect      siwazyw.tv
// @connect      api.bwzyz.com
// @connect      api.souavzy.vip
// @connect      www.xxibaozyw.com
// @connect      hsckzy.vip
// @connect      xingba111.com
// @connect      iqiyizyapi.com
// @connect      apidanaizi.com
// @connect      xzybb1.com
// @connect      api.ddapi.cc
// @connect      api.sexnguon.com
// @connect      www.jingpinx.com
// @connect      shayuapi.com
// @connect      www.hongniuzy2.com
// @connect      www.huyaapi.com
// @connect      caiji.maotaizy.cc
// @connect      api.zuiseapi.com
// @connect      wukongzyz.com
// @connect      jyzyapi.com
// @connect      api.xiaojizy.live
// @connect      api.ukuapi.com
// @connect      suoniapi.com
// @connect      91md.me
// @connect      collect.wolongzyw.com
// @connect      sdzyapi.com
// @connect      www.bt4.cc
// @connect      api.guangsuapi.com
// @connect      www.hongniuzy2.com
// @connect      www.36717.info
// @connect      api.ffzyapi.com
// @connect      www.caoliuzyw.com
// @connect      cj.maczy.me
// @connect      360zyzz.com
// @connect      www.sufeizy.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/548419/m3u8Player.user.js
// @updateURL https://update.greasyfork.org/scripts/548419/m3u8Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 配置模块 =====
    const ConfigModule = {
        API_ENDPOINT: '/api.php/provide/vod',
        API_SITES_CONFIG: [
            ['卧龙资源', 'https://collect.wolongzy.cc', true, '/api.php/provide/vod/'],
            ['淘片资源', 'https://www.taopianzy.com', true, '/cjapi/mc/vod/json.html'],
            ['LZI资源', 'https://cj.lziapi.com', true],
            ['黑木耳', 'https://json.heimuer.xyz', true],
            ['如意资源', 'https://cj.rycjapi.com', true],
            ['暴风资源', 'https://bfzyapi.com', true],
            ['天涯资源', 'https://tyyszy.com', true],
            ['非凡影视', 'http://ffzy5.tv', true],
            ['360资源', 'https://360zy.com', true],
            ['iqiyi资源', 'https://www.iqiyizyapi.com', true],
            ['极速资源', 'https://jszyapi.com', true],
            ['豆瓣资源', 'https://dbzy.tv', true],
            ['魔爪资源', 'https://mozhuazy.com', true],
            ['魔都资源', 'https://www.mdzyapi.com', true],
            ['最大资源', 'https://api.zuidapi.com', true],
            ['樱花资源', 'https://m3u8.apiyhzy.com', true],
            ['百度云资源', 'https://api.apibdzy.com', true],
            ['无尽资源', 'https://api.wujinapi.me', true],
            ['iKun资源', 'https://ikunzyapi.com', true],
            ['CK资源', 'https://www.ckzy1.com', false],
            ['大地', 'https://dadiapi.com', true, '/api.php'],
            ['森林', 'https://slapibf.com', true, '/api.php/provide/vod/'],
            ['奥斯卡', 'https://aosikazy.com', true, '/api.php/provide/vod/'],
            ['爱困', 'https://ikunzyapi.com', true, '/api.php/provide/vod'],
            ['玉兔', 'https://apiyutu.com', true, '/api.php/provide/vod/at/xml'],
            ['桃花', 'https://thzy1.me', true, '/api.php/provide/vod/'],
            ['lsp', 'https://apilsbzy1.com', true, '/api.php/provide/vod/at/xml'],
            ['丫丫', 'https://cj.yayazy.net', true, '/api.php/provide/vod/from/yym3u8/at/xml'],
            ['豪华', 'https://hhzyapi.com', true, '/api.php/provide/vod'],
            ['jkun', 'https://www.jkunzyapi.com', true, '/api.php/provide/vod/'],
            ['奶香香', 'https://naixxzy.com', true, '/api.php/provide/vod/at/xml/'],
            ['155', 'https://155api.com', true, '/api.php/provide/vod/at/xml/'],
            ['辣椒', 'https://apilj.com', true, '/api.php/provide/vod/at/xml/'],
            ['色猫', 'https://caiji.semaozy.net', true, '/inc/api.php'],
            ['丝袜', 'https://siwazyw.tv', true, '/api.php/provide/vod/at/xml/'],
            ['百万', 'https://api.bwzyz.com', true, '/api.php/provide/vod/at/json/'],
            ['搜av', 'https://api.souavzy.vip', true, '/api.php/provide/vod/'],
            ['x细胞', 'https://www.xxibaozyw.com', true, '/api.php/provide/vod/'],
            ['黄色仓库', 'https://hsckzy.vip', true, '/api.php/provide/vod/at/json/'],
            ['性吧', 'https://xingba111.com', true, '/api.php/provide/vod/at/xml'],
            ['大奶子', 'https://apidanaizi.com', true, '/api.php/provide/vod/at/xml/'],
            ['杏资源', 'https://xzybb1.com', true, '/api.php/provide/vod/at/xml'],
            ['滴滴', 'https://api.ddapi.cc', true, '/api.php/provide/vod/'],
            ['色南国', 'https://api.sexnguon.com', true, '/api.php/provide/vod/'],
            ['精品', 'http://www.jingpinx.com', true, '/api.php/provide/vod/'],
            ['鲨鱼', 'https://shayuapi.com', true, '/api.php/provide/vod/'],
            ['红牛', 'https://www.hongniuzy2.com', true, '/api.php/provide/vod/'],
            ['虎牙', 'https://www.huyaapi.com', true, '/api.php/provide/vod/at/json/'],
            ['茅台', 'https://caiji.maotaizy.cc', true, '/api.php/provide/vod/'],
            ['醉色', 'https://api.zuiseapi.com', true, '/api.php/provide/vod/'],
            ['悟空', 'https://wukongzyz.com', true, '/api.php/provide/vod/'],
            ['金鹰', 'https://jyzyapi.com', true, '/provide/vod/'],
            ['小鸡', 'https://api.xiaojizy.live', true, '/provide/vod'],
            ['uku', 'https://api.ukuapi.com', true, '/api.php/provide/vod/'],
            ['索尼', 'https://suoniapi.com', true, '/api.php/provide/vod/'],
            ['91制片厂', 'https://91md.me', true, '/api.php/provide/vod/'],
            ['卧龙', 'https://collect.wolongzyw.com', true, '/api.php/provide/vod/'],
            ['闪电', 'https://sdzyapi.com', true, '/api.php/provide/vod/'],
            ['bt4', 'http://www.bt4.cc', true, '/api.php/provide/vod/'],
            ['光速', 'https://api.guangsuapi.com', true, '/api.php/provide/vod/'],
            ['36717', 'http://www.36717.info', true, '/api.php/provide/vod/'],
            ['飞飞', 'http://api.ffzyapi.com', true, '/api.php/provide/vod/'],
            ['草榴', 'https://www.caoliuzyw.com', true, '/api.php/provide/vod/'],
            ['mac', 'https://cj.maczy.me', true, '/api.php/provide/vod/'],
            ['360', 'https://360zyzz.com', true, '/api.php/provide/vod/'],
            ['苏菲', 'https://www.sufeizy.com', true, '/api.php/provide/vod/'],
        ],
        get API_SITES() {
            return this.API_SITES_CONFIG.reduce((acc, [name, host, enabled, customEndpoint]) => {
                const endpoint = customEndpoint || this.API_ENDPOINT;
                let key;
                try {
                    const urlObj = new URL(host);
                    const hostnameParts = urlObj.hostname.split('.');
                    key = hostnameParts.length >= 2 ? hostnameParts[hostnameParts.length - 2] : hostnameParts[0];
                } catch (e) {
                    key = `site${Object.keys(acc).length}`;
                }
                let uniqueKey = key;
                let counter = 0;
                while (acc[uniqueKey]) {
                    uniqueKey = `${key}${counter++}`;
                }
                acc[uniqueKey] = { api: `${host}${endpoint}`, name, enabled };
                return acc;
            }, {});
        },
        CONFIG: {
            PAGE_SIZE: 12,
            SEARCH_TIMEOUT: 8000,
            MAX_HISTORY_ITEMS: 50,
            STORAGE_KEYS: {
                LAST_SEARCH: 'iePlayer_lastSearch',
                SELECTED_SOURCES: 'iePlayer_selectedSources',
                IS_AGGREGATED: 'iePlayer_isAggregated',
                PLAY_HISTORY: 'iePlayer_playHistory'
            }
        },
        HLS_JS_CDNS: [
            'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js',
            'https://cdn.bootcdn.net/ajax/libs/hls.js/1.4.12/hls.min.js'
        ],
        getEnabledSources() {
            return Object.entries(this.API_SITES).filter(([, source]) => source.enabled);
        },
        getSource(sourceKey) {
            return this.API_SITES[sourceKey] || null;
        },
    };

    // ===== 存储模块 =====
    const StorageModule = {
        get(key, def) { return GM_getValue(key, def); },
        set(key, val) { GM_setValue(key, val); },
        getLastSearch() { return this.get(ConfigModule.CONFIG.STORAGE_KEYS.LAST_SEARCH, ''); },
        setLastSearch(keyword) { this.set(ConfigModule.CONFIG.STORAGE_KEYS.LAST_SEARCH, keyword); },
        getSelectedSources() { return this.get(ConfigModule.CONFIG.STORAGE_KEYS.SELECTED_SOURCES, ['lziapi']); },
        setSelectedSources(sources) { this.set(ConfigModule.CONFIG.STORAGE_KEYS.SELECTED_SOURCES, sources); },
        getIsAggregated() { return this.get(ConfigModule.CONFIG.STORAGE_KEYS.IS_AGGREGATED, false); },
        setIsAggregated(isAggregated) { this.set(ConfigModule.CONFIG.STORAGE_KEYS.IS_AGGREGATED, isAggregated); },
        getPlayHistory() { return this.get(ConfigModule.CONFIG.STORAGE_KEYS.PLAY_HISTORY, []); },
        setPlayHistory(history) { this.set(ConfigModule.CONFIG.STORAGE_KEYS.PLAY_HISTORY, history); },
        addPlayHistory(videoData) {
            let history = this.getPlayHistory();
            const { url, title, source, episode } = videoData;
            const existingIndex = history.findIndex(item => item.url === url);
            if (existingIndex > -1) {
                history.splice(existingIndex, 1);
            }
            history.unshift({ id: `hist_${Date.now()}`, url, title, source, episode, time: Date.now() });
            if (history.length > ConfigModule.CONFIG.MAX_HISTORY_ITEMS) {
                history.pop();
            }
            this.setPlayHistory(history);
        },
        removePlayHistory(id) {
            let history = this.getPlayHistory();
            this.setPlayHistory(history.filter(item => item.id !== id));
        },
        clearPlayHistory() { this.setPlayHistory([]); },
    };

    // ===== 状态管理模块 =====
    const StateModule = {
        state: {
            searchPanel: null,
            currentPlayer: null,
            currentPage: 1,
            totalPages: 1,
            homepageCurrentPage: 1,
            homepageTotalPages: 1,
            homepageCategories: {},
            homepageSelectedCategory: null,
            selectedSources: ['lziapi'],
            isAggregatedSearch: false,
            isSearching: false,
            searchController: null,
            playHistory: []
        },
        get(key) { return this.state[key]; },
        set(key, val) { this.state[key] = val; },
        init() {
            this.set('isAggregatedSearch', StorageModule.getIsAggregated());
            this.set('selectedSources', StorageModule.getSelectedSources());
            this.set('playHistory', StorageModule.getPlayHistory());
        }
    };

    // ===== API模块 =====
    const APIModule = {
        _request(url, params) {
            return new Promise((resolve, reject) => {
                const fullUrl = `${url}?${params.toString()}`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: fullUrl,
                    timeout: ConfigModule.CONFIG.SEARCH_TIMEOUT,
                    onload: (res) => {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            reject(new Error('JSON parsing failed'));
                        }
                    },
                    onerror: () => reject(new Error('Request failed')),
                    ontimeout: () => reject(new Error('Request timed out')),
                });
            });
        },
        async fetchCategories(sourceKey) {
            const source = ConfigModule.getSource(sourceKey);
            if (!source) return [];
            try {
                const data = await this._request(source.api, new URLSearchParams());
                return data.class || [];
            } catch (error) {
                console.error(`Failed to fetch categories from ${source.name}:`, error);
                return [];
            }
        },
        async fetchSourceHomepage(sourceKey, page, categoryId) {
            const source = ConfigModule.getSource(sourceKey);
            if (!source) return null;
            const params = new URLSearchParams({ pg: page, limit: ConfigModule.CONFIG.PAGE_SIZE });
            if (categoryId) {
                params.set('t', categoryId);
            }
            try {
                const data = await this._request(source.api, params);
                if (data.list) {
                    data.list.forEach(item => {
                        item.source_name = source.name;
                        item.source_key = sourceKey;
                    });
                }
                return data;
            } catch (error) {
                return null;
            }
        },
        search(sourceKey, keyword, page, abortSignal) {
            return new Promise((resolve, reject) => {
                const source = ConfigModule.getSource(sourceKey);
                if (!source) return reject(new Error('Invalid source'));
                const params = new URLSearchParams({ ac: 'list', wd: keyword, pg: page });
                const req = GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${source.api}?${params.toString()}`,
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data.list) data.list.forEach(item => {
                                item.source_name = source.name;
                                item.source_key = sourceKey;
                            });
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject,
                });
                if (abortSignal) abortSignal.onabort = () => req.abort();
            });
        },
        getVideoDetail(videoId, sourceKey) {
            return this._request(ConfigModule.getSource(sourceKey).api, new URLSearchParams({ ac: 'detail', ids: videoId }));
        },
    };

    // ===== 工具函数模块 =====
    const UtilsModule = {
        copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
        }
    };

    // ===== UI模块 =====
    const UIModule = {
        _extractAndFormatImageUrl(picString, sourceKey) {
            if (!picString) return '';
            const firstPart = picString.split('$$$')[0];
            const urlMatch = firstPart.match(/https?:\/\/[^\s"]+\.(?:jpg|jpeg|png|gif|webp)|^\/[^\s"]+\.(?:jpg|jpeg|png|gif|webp)/i);
            let picUrl = urlMatch ? urlMatch[0] : '';
            if (!picUrl) return '';
            if (picUrl.startsWith('http')) return picUrl;
            try {
                const source = ConfigModule.getSource(sourceKey);
                const origin = new URL(source.api).origin;
                return `${origin}${picUrl.startsWith('/') ? picUrl : '/' + picUrl}`;
            } catch (e) {
                return '';
            }
        },
        createSearchPanel() {
            const panel = document.createElement('div');
            panel.className = 'iePlayer-search-panel';
            panel.innerHTML = `
                <div class="iePlayer-panel-header"><h3 class="iePlayer-panel-title">🎬 M3U8播放器</h3><button class="iePlayer-close-btn">×</button></div>
                <div class="iePlayer-tabs">
                    <button class="iePlayer-tab-btn active" data-tab="search">视频搜索</button>
                    <button class="iePlayer-tab-btn" data-tab="homepage">资源首页</button>
                    <button class="iePlayer-tab-btn" data-tab="direct-play">链接播放</button>
                    <button class="iePlayer-tab-btn" data-tab="history">播放历史</button>
                </div>
                <div class="iePlayer-panel-body">
                    <div class="iePlayer-tab-content active" id="iePlayer-tab-search">
                        <div class="iePlayer-section"><div class="iePlayer-source-header">📺 选择视频源</div><div class="iePlayer-source-options" id="iePlayer-source-options"></div></div>
                        <div class="iePlayer-section"><div class="iePlayer-search-form"><div class="iePlayer-form-header">🔍 视频搜索</div><input type="text" class="iePlayer-search-input" placeholder="输入视频名称..."><button class="iePlayer-search-btn">搜索</button></div></div>
                        <div class="iePlayer-loading" style="display:none;">搜索中...</div>
                        <div class="iePlayer-results"></div>
                        <div class="iePlayer-pagination" style="display:none;"><button id="iePlayer-prev-page" class="iePlayer-page-btn">上一页</button><span class="iePlayer-page-info"></span><button id="iePlayer-next-page" class="iePlayer-page-btn">下一页</button></div>
                    </div>
                    <div class="iePlayer-tab-content" id="iePlayer-tab-homepage">
                        <div class="iePlayer-homepage-categories"></div>
                        <div class="iePlayer-homepage-loading" style="display:none;">加载中...</div>
                        <div class="iePlayer-homepage-tip"></div>
                        <div class="iePlayer-homepage-results"></div>
                        <div class="iePlayer-homepage-pagination" style="display:none;"><button id="iePlayer-prev-homepage" class="iePlayer-page-btn">上一页</button><span class="iePlayer-homepage-page-info"></span><button id="iePlayer-next-homepage" class="iePlayer-page-btn">下一页</button></div>
                    </div>
                    <div class="iePlayer-tab-content" id="iePlayer-tab-direct-play"><div class="iePlayer-m3u8-form"><div class="iePlayer-m3u8-header">🔗 直接播放</div><input type="text" class="iePlayer-m3u8-input" placeholder="输入M3U8链接..."><button class="iePlayer-m3u8-btn">播放</button></div></div>
                    <div class="iePlayer-tab-content" id="iePlayer-tab-history"><div class="iePlayer-history-header"><div class="iePlayer-history-title">📚 播放历史</div><button class="iePlayer-clear-history-btn">清空</button></div><div class="iePlayer-history-list"></div><div class="iePlayer-history-empty" style="display:none;">暂无历史</div></div>
                </div>`;
            document.body.appendChild(panel);
            return panel;
        },
        initializeSourceSelector() {
            const container = document.getElementById('iePlayer-source-options'); if (!container) return; container.innerHTML = '';
            [{key: 'aggregated', name: '聚合搜索'}, ...ConfigModule.getEnabledSources().map(([key, val])=>({key, ...val}))].forEach(source => {
                const isAgg = source.key === 'aggregated'; const isChecked = isAgg ? StateModule.get('isAggregatedSearch') : StateModule.get('selectedSources').includes(source.key);
                const opt = document.createElement('div'); opt.className = 'iePlayer-source-option';
                opt.innerHTML = `<label><input type="radio" name="iePlayer-searchType" value="${source.key}" ${isChecked ? 'checked' : ''}><span>${source.name}</span></label>`;
                container.appendChild(opt);
            });
        },
        displayCategories(categories) {
            const container = document.querySelector('.iePlayer-homepage-categories'); if (!container) return; container.innerHTML = '';
            [{type_id: null, type_name: '最新'}, ...categories].forEach(cat => {
                const btn = document.createElement('button'); btn.className = 'iePlayer-category-btn';
                btn.textContent = cat.type_name; btn.dataset.id = cat.type_id;
                if (String(StateModule.get('homepageSelectedCategory')) === String(cat.type_id)) btn.classList.add('active');
                container.appendChild(btn);
            });
        },
        renderVideoList(container, videoList) {
            container.innerHTML = ''; const fragment = document.createDocumentFragment();
            videoList.forEach(video => {
                const item = document.createElement('div'); item.className = 'iePlayer-result-item';
                const imageUrl = this._extractAndFormatImageUrl(video.vod_pic, video.source_key);
                item.innerHTML = `
                    <div class="iePlayer-video-thumb">
                        <img src="${imageUrl}" alt="" loading="lazy" onerror="this.style.display='none'; this.parentElement.classList.add('no-image');">
                    </div>
                    <div class="iePlayer-video-details">
                        <div class="iePlayer-video-header"><div class="iePlayer-video-title">${video.vod_name}</div><div class="iePlayer-source-badge">${video.source_name}</div></div>
                        <div class="iePlayer-video-info">${video.type_name || '未知'} | ${video.vod_year || '未知'} | ${video.vod_remarks || '无'}</div>
                        <div class="iePlayer-play-sources" data-video-id="${video.vod_id}" data-source-key="${video.source_key}">
                            <button class="iePlayer-load-sources-btn">加载播放线路</button>
                        </div>
                        <div class="iePlayer-episode-list"></div>
                    </div>`;
                fragment.appendChild(item);
            });
            container.appendChild(fragment);
        },
        updatePagination(type) {
            const isHomepage = type === 'homepage';
            const pageInfo = document.querySelector(isHomepage ? '.iePlayer-homepage-page-info' : '.iePlayer-page-info');
            const prevBtn = document.getElementById(isHomepage ? 'iePlayer-prev-homepage' : 'iePlayer-prev-page');
            const nextBtn = document.getElementById(isHomepage ? 'iePlayer-next-homepage' : 'iePlayer-next-page');
            const currentPage = StateModule.get(isHomepage ? 'homepageCurrentPage' : 'currentPage');
            const totalPages = StateModule.get(isHomepage ? 'homepageTotalPages' : 'totalPages');
            if (pageInfo) pageInfo.textContent = `第 ${currentPage} / ${totalPages} 页`;
            if (prevBtn) prevBtn.disabled = currentPage <= 1;
            if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
        },
        toggleSearchPanel() {
            let searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) {
                searchPanel = this.createSearchPanel();
                StateModule.set('searchPanel', searchPanel);
                EventModule.initSearchPanel();
            }
            const isVisible = searchPanel.classList.toggle('show');
            if (isVisible) {
                searchPanel.querySelector('.iePlayer-search-input').value = StorageModule.getLastSearch();
            }
        },
        displayPlayHistory() {
            const list = document.querySelector('.iePlayer-history-list');
            const empty = document.querySelector('.iePlayer-history-empty');
            const history = StorageModule.getPlayHistory();
            if (history.length === 0) { list.innerHTML = ''; empty.style.display = 'block'; return; }
            empty.style.display = 'none';
            list.innerHTML = history.map(item => `
                <div class="iePlayer-history-item">
                    <div class="iePlayer-history-info">
                        <div class="iePlayer-history-title">${item.title}</div>
                        <div class="iePlayer-history-meta"><span class="iePlayer-history-source">${item.source}</span><span class="iePlayer-history-episode">${item.episode}</span></div>
                    </div>
                    <div class="iePlayer-history-actions">
                        <button class="iePlayer-history-play-btn" data-url="${item.url}" data-title="${item.title}" data-source="${item.source}" data-episode="${item.episode}">播放</button>
                        <button class="iePlayer-history-delete-btn" data-id="${item.id}">删除</button>
                    </div>
                </div>`).join('');
        },
    };

    // ===== 事件管理模块 =====
    const EventModule = {
        initSearchPanel() {
            const panel = StateModule.get('searchPanel');
            if (!panel) return;
            UIModule.initializeSourceSelector();
            panel.addEventListener('click', this.handlePanelClick.bind(this));
            panel.querySelector('.iePlayer-search-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') this.performSearch(); });
            this.makeDraggable(panel);
        },
        async handlePanelClick(e) {
            const target = e.target;
            const panel = StateModule.get('searchPanel');
            if (target.matches('.iePlayer-tab-btn')) {
                panel.querySelector('.iePlayer-tab-btn.active').classList.remove('active');
                target.classList.add('active');
                panel.querySelector('.iePlayer-tab-content.active').classList.remove('active');
                panel.querySelector(`#iePlayer-tab-${target.dataset.tab}`).classList.add('active');
                if (target.dataset.tab === 'homepage') await this.loadHomepage();
                if (target.dataset.tab === 'history') UIModule.displayPlayHistory();
            } else if (target.matches('input[name="iePlayer-searchType"]')) {
                const isAgg = target.value === 'aggregated';
                StateModule.set('isAggregatedSearch', isAgg);
                StateModule.set('selectedSources', isAgg ? [] : [target.value]);
                StorageModule.setIsAggregated(isAgg);
                StorageModule.setSelectedSources(isAgg ? [] : [target.value]);
                if (panel.querySelector('.iePlayer-tab-btn[data-tab="homepage"].active')) await this.loadHomepage();
            } else if (target.matches('.iePlayer-search-btn')) await this.performSearch();
            else if (target.id === 'iePlayer-prev-page') this.loadSearchPage(StateModule.get('currentPage') - 1);
            else if (target.id === 'iePlayer-next-page') this.loadSearchPage(StateModule.get('currentPage') + 1);
            else if (target.id === 'iePlayer-prev-homepage') await this.loadHomepage(StateModule.get('homepageCurrentPage') - 1);
            else if (target.id === 'iePlayer-next-homepage') await this.loadHomepage(StateModule.get('homepageCurrentPage') + 1);
            else if (target.matches('.iePlayer-category-btn')) {
                const catId = target.dataset.id === 'null' ? null : target.dataset.id;
                StateModule.set('homepageSelectedCategory', catId);
                await this.loadHomepage();
            } else if (target.matches('.iePlayer-load-sources-btn')) {
                target.textContent = '加载中...';
                const sourcesDiv = target.parentElement;
                const { videoId, sourceKey } = sourcesDiv.dataset;
                try {
                    const data = await APIModule.getVideoDetail(videoId, sourceKey);
                    const playUrl = data.list[0].vod_play_url;
                    sourcesDiv.innerHTML = playUrl.split('$$$').map((source, index) => {
                        const name = source.split('$')[0];
                        return `<button class="iePlayer-play-btn" data-source-index="${index}">${/^[a-zA-Z0-9]+$/.test(name) && name.length < 10 ? name : `线路${index + 1}`}</button>`;
                    }).join('');
                } catch { sourcesDiv.innerHTML = '加载失败'; }
            } else if (target.matches('.iePlayer-play-btn')) {
                const detailsDiv = target.closest('.iePlayer-video-details');
                const episodeList = detailsDiv.querySelector('.iePlayer-episode-list');
                const { videoId, sourceKey } = detailsDiv.querySelector('.iePlayer-play-sources').dataset;
                const sourceIndex = target.dataset.sourceIndex;
                if(episodeList.dataset.currentIndex === sourceIndex && episodeList.style.display === 'grid') { episodeList.style.display = 'none'; return; }
                episodeList.innerHTML = '加载中...'; episodeList.style.display = 'grid'; episodeList.dataset.currentIndex = sourceIndex;
                const data = await APIModule.getVideoDetail(videoId, sourceKey);
                const playListString = data.list[0].vod_play_url.split('$$$')[sourceIndex];
                const episodes = playListString.split(/[#\n\r]+/).filter(ep => ep.trim());
                episodeList.innerHTML = episodes.map(ep => {
                    const [name, url] = ep.includes('$') ? ep.split('$', 2) : [ep.split('/').pop().slice(0, 15), ep];
                    return `<button class="iePlayer-episode-btn" data-url="${url.trim()}" data-title="${data.list[0].vod_name} | ${name}">${name}</button>`;
                }).join('');
            } else if (target.matches('.iePlayer-episode-btn')) {
                const { url, title } = target.dataset;
                const sourceName = target.closest('.iePlayer-result-item').querySelector('.iePlayer-source-badge').textContent;
                PlayerModule.openVideoPlayer(url, title, sourceName, target.textContent);
            } else if (target.matches('.iePlayer-close-btn')) panel.classList.remove('show');
            else if (target.matches('.iePlayer-m3u8-btn')) PlayerModule.openVideoPlayer(panel.querySelector('.iePlayer-m3u8-input').value.trim(), '直接播放');
            else if (target.matches('.iePlayer-clear-history-btn')) { StorageModule.clearPlayHistory(); UIModule.displayPlayHistory(); }
            else if (target.matches('.iePlayer-history-play-btn')) { const { url, title, source, episode } = target.dataset; PlayerModule.openVideoPlayer(url, title, source, episode); }
            else if (target.matches('.iePlayer-history-delete-btn')) { StorageModule.removePlayHistory(target.dataset.id); UIModule.displayPlayHistory(); }
        },
        async loadHomepage(page = 1) {
            const panel = StateModule.get('searchPanel');
            const tipDiv = panel.querySelector('.iePlayer-homepage-tip');
            const resultsDiv = panel.querySelector('.iePlayer-homepage-results');
            const loadingDiv = panel.querySelector('.iePlayer-homepage-loading');
            const paginationDiv = panel.querySelector('.iePlayer-homepage-pagination');
            const categoriesDiv = panel.querySelector('.iePlayer-homepage-categories');
            resultsDiv.innerHTML = ''; paginationDiv.style.display = 'none'; tipDiv.innerHTML = '';
            if (StateModule.get('isAggregatedSearch')) { tipDiv.textContent = '请选择一个单一视频源以浏览。'; categoriesDiv.innerHTML=''; return; }
            const sourceKey = StateModule.get('selectedSources')[0];
            if (!sourceKey) { tipDiv.textContent = '请先选择一个视频源。'; categoriesDiv.innerHTML=''; return; }
            loadingDiv.style.display = 'block';
            if (!StateModule.get('homepageCategories')[sourceKey] || page === 1) {
                const categories = await APIModule.fetchCategories(sourceKey);
                StateModule.get('homepageCategories')[sourceKey] = categories;
                if(StateModule.get('selectedSources')[0] === sourceKey) {
                    UIModule.displayCategories(categories);
                }
            } else {
                UIModule.displayCategories(StateModule.get('homepageCategories')[sourceKey]);
            }
            const selectedCatId = StateModule.get('homepageSelectedCategory');
            const data = await APIModule.fetchSourceHomepage(sourceKey, page, selectedCatId);
            loadingDiv.style.display = 'none';
            if (data && data.list && data.list.length > 0) {
                UIModule.renderVideoList(resultsDiv, data.list);
                StateModule.set('homepageCurrentPage', data.page);
                StateModule.set('homepageTotalPages', data.pagecount);
                paginationDiv.style.display = 'flex';
                UIModule.updatePagination('homepage');
            } else {
                resultsDiv.innerHTML = '<div class="iePlayer-no-results">未能加载到内容。</div>';
            }
        },
        async performSearch() {
            const keyword = document.querySelector('.iePlayer-search-input').value.trim();
            if (StateModule.get('isSearching')) { StateModule.get('searchController')?.abort(); return; }
            if (!keyword) return;
            const controller = new AbortController();
            StateModule.set('searchController', controller);
            StateModule.set('isSearching', true);
            document.querySelector('.iePlayer-loading').style.display = 'block';
            document.querySelector('.iePlayer-results').innerHTML = '';
            try {
                const results = await APIModule.search(StateModule.get('selectedSources')[0], keyword, 1, controller.signal);
                if (controller.signal.aborted) return;
                const resultsDiv = document.querySelector('.iePlayer-results');
                UIModule.renderVideoList(resultsDiv, results.list);
            } catch (error) {
                 if (!controller.signal.aborted) document.querySelector('.iePlayer-results').innerHTML = '<div class="iePlayer-no-results">搜索失败或无结果。</div>';
            } finally {
                StateModule.set('isSearching', false);
                document.querySelector('.iePlayer-loading').style.display = 'none';
            }
        },
        makeDraggable(element) {
            let isDragging = false, initialX, initialY, xOffset = 0, yOffset = 0;
            const header = element.querySelector('.iePlayer-panel-header');
            const dragStart = (e) => { initialX = e.clientX - xOffset; initialY = e.clientY - yOffset; if (header.contains(e.target)) isDragging = true; };
            const drag = (e) => { if (isDragging) { e.preventDefault(); xOffset = e.clientX - initialX; yOffset = e.clientY - initialY; element.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`; } };
            document.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', () => isDragging = false);
        },
    };

    // ===== 播放器模块 =====
    const PlayerModule = {
        openVideoPlayer(url, title, source = '', episode = '') {
            if (!url) { alert('播放地址无效'); return; }
            StorageModule.addPlayHistory({ title, url, source, episode });
            const container = document.createElement('div');
            container.className = 'iePlayer-player-container';
            container.innerHTML = `<div class="iePlayer-player-wrapper"><div class="iePlayer-player-header"><div class="iePlayer-player-title">${title}</div><button class="iePlayer-player-close">×</button></div><video style="width:100%;height:100%;background:#000;" controls autoplay playsinline></video><div class="iePlayer-loading-player">加载中...</div></div>`;
            document.body.appendChild(container);
            container.classList.add('show');
            const closeHandler = () => this.closeVideoPlayer(container);
            container.querySelector('.iePlayer-player-close').addEventListener('click', closeHandler);
            const keyHandler = (e) => { if (e.key === 'Escape') closeHandler(); };
            document.addEventListener('keydown', keyHandler);
            container.keyHandler = keyHandler;
            this.initVideoPlayer(container, url);
        },
        initVideoPlayer(container, url) {
            const video = container.querySelector('video');
            const loading = container.querySelector('.iePlayer-loading-player');
            const loadHls = () => {
                if (typeof Hls !== 'undefined') { this.setupVideoPlayer(Hls, container, url, video, loading); return; }
                const script = document.createElement('script');
                script.src = ConfigModule.HLS_JS_CDNS[0];
                script.onload = () => this.setupVideoPlayer(Hls, container, url, video, loading);
                script.onerror = () => { loading.textContent = '播放器库加载失败'; };
                document.head.appendChild(script);
            };
            if (url.toLowerCase().includes('m3u8')) loadHls();
            else { video.src = url; loading.style.display = 'none'; video.play().catch(()=>{}); }
        },
        setupVideoPlayer(Hls, container, url, video, loading) {
            loading.style.display = 'none';
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(()=>{}));
                container.hlsInstance = hls;
            } else {
                loading.style.display = 'block';
                loading.textContent = '浏览器不支持HLS';
            }
        },
        closeVideoPlayer(container) {
            container.hlsInstance?.destroy();
            document.removeEventListener('keydown', container.keyHandler);
            container.remove();
        }
    };

    // ===== 初始化样式 =====
    function initStyles() {
        GM_addStyle(`
            :root { --panel-width: 420px; --primary-color: #667eea; --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .iePlayer-search-panel { position: fixed; top: 20px; right: 20px; width: var(--panel-width); max-height: 90vh; background: #f8f9fa; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); z-index: 999999; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; display: none; flex-direction: column; }
            .iePlayer-search-panel.show { display: flex; }
            .iePlayer-panel-header { background: var(--primary-gradient); color: white; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; cursor: move; border-radius: 12px 12px 0 0;}
            .iePlayer-panel-title { font-size: 16px; font-weight: 600; margin: 0; }
            .iePlayer-close-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; }
            .iePlayer-close-btn:hover { opacity: 1; }
            .iePlayer-tabs { display: flex; background-color: #f1f3f5; padding: 3px 15px 0; flex-shrink: 0; }
            .iePlayer-tab-btn { padding: 10px 15px; cursor: pointer; border: none; background: transparent; font-size: 14px; font-weight: 500; color: #868e96; position: relative; }
            .iePlayer-tab-btn.active { color: var(--primary-color); }
            .iePlayer-tab-btn.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background-color: var(--primary-color); border-radius: 3px 3px 0 0; }
            .iePlayer-panel-body { padding: 15px; overflow-y: auto; flex-grow: 1; }
            .iePlayer-tab-content { display: none; } .iePlayer-tab-content.active { display: block; }
            .iePlayer-section, .iePlayer-m3u8-form { margin-bottom: 15px; padding: 15px; background: #fff; border-radius: 8px; border: 1px solid #e9ecef; }
            .iePlayer-source-header, .iePlayer-form-header, .iePlayer-m3u8-header, .iePlayer-history-title { font-weight: 600; color: #343a40; font-size: 14px; margin-bottom: 12px; }
            .iePlayer-source-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .iePlayer-source-option label { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s ease; border: 1px solid #dee2e6; }
            .iePlayer-source-option input[type="radio"] { accent-color: var(--primary-color); }
            .iePlayer-source-option label:has(input:checked) { background: #e8eaf6; color: var(--primary-color); border-color: var(--primary-color); }
            .iePlayer-source-option label:has(input:checked) > span { font-weight: 600; }
            .iePlayer-search-input, .iePlayer-m3u8-input { width: 100%; padding: 12px; border: 1px solid #ced4da; border-radius: 6px; margin-bottom: 12px; box-sizing: border-box; }
            .iePlayer-search-btn, .iePlayer-m3u8-btn, .iePlayer-page-btn, .iePlayer-clear-history-btn { padding: 10px; color: white; border: none; border-radius: 6px; cursor: pointer; background: var(--primary-gradient); font-size: 14px; }
            .iePlayer-page-btn { background: white; color: var(--primary-color); border: 1px solid var(--primary-color); padding: 8px 12px; font-size: 13px; }
            .iePlayer-page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .iePlayer-loading, .iePlayer-homepage-loading, .iePlayer-no-results, .iePlayer-homepage-tip { text-align: center; padding: 40px 20px; color: #6c757d; }
            .iePlayer-results, .iePlayer-homepage-results { display: flex; flex-direction: column; gap: 12px; }
            .iePlayer-result-item { display: flex; gap: 12px; background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 12px; transition: box-shadow 0.2s; }
            .iePlayer-result-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
            .iePlayer-video-thumb { flex-shrink: 0; width: 80px; height: 110px; border-radius: 4px; background-color: #f1f3f5; }
            .iePlayer-video-thumb.no-image::before { content: '🖼️'; display: grid; place-items: center; width: 100%; height: 100%; font-size: 30px; color: #adb5bd; }
            .iePlayer-video-thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
            .iePlayer-video-details { flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }
            .iePlayer-video-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .iePlayer-video-title { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .iePlayer-source-badge { font-size: 11px; background: #e9ecef; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; margin-left: 8px; }
            .iePlayer-video-info { font-size: 12px; color: #6c757d; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .iePlayer-play-sources { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 8px; }
            .iePlayer-play-btn, .iePlayer-load-sources-btn, .iePlayer-episode-btn { font-size: 12px; padding: 4px 8px; border: 1px solid #dee2e6; background: #f8f9fa; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
            .iePlayer-play-btn:hover, .iePlayer-load-sources-btn:hover, .iePlayer-episode-btn:hover { background-color: #e9ecef; }
            .iePlayer-episode-list { display: none; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 6px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e9ecef;}
            .iePlayer-episode-btn { width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .iePlayer-pagination, .iePlayer-homepage-pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
            .iePlayer-homepage-categories { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e9ecef; }
            .iePlayer-category-btn { padding: 6px 12px; font-size: 13px; border: 1px solid #dee2e6; background: #fff; border-radius: 16px; cursor: pointer; }
            .iePlayer-category-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
            .iePlayer-history-header { display: flex; justify-content: space-between; align-items: center; }
            .iePlayer-clear-history-btn { background: #f8f9fa; color: #dc3545; border: 1px solid #dc3545; }
            .iePlayer-history-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
            .iePlayer-history-title { font-weight: 500; }
            .iePlayer-history-meta { font-size: 12px; color: #6c757d; }
            .iePlayer-history-play-btn { font-size: 13px; padding: 6px 10px; background: var(--primary-color); color: white; border: none; border-radius: 4px; }
            .iePlayer-float-btn { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: var(--primary-gradient); border-radius: 50%; border: none; color: white; font-size: 24px; cursor: pointer; z-index: 999998; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
            .iePlayer-player-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000000; display: none; align-items: center; justify-content: center; }
            .iePlayer-player-container.show { display: flex; }
            .iePlayer-player-wrapper { width: 90%; max-width: 1200px; height: 70%; position: relative; }
            .iePlayer-player-header { position: absolute; top: 0; left: 0; right: 0; padding: 15px; color: white; }
            .iePlayer-loading-player { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: white; }
        `);
    }

    // ===== 主初始化函数 =====
    function init() {
        if (window.self !== window.top) return;
        StateModule.init();
        initStyles();
        const floatBtn = document.createElement('button');
        floatBtn.className = 'iePlayer-float-btn';
        floatBtn.textContent = '🎬';
        floatBtn.onclick = () => UIModule.toggleSearchPanel();
        document.body.appendChild(floatBtn);
        GM_registerMenuCommand('🎬 打开视频搜索', () => UIModule.toggleSearchPanel());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// ==UserScript==
// @name         流媒体搜索助手
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  快速在多个流媒体平台搜索影视作品，支持 TMDB 智能匹配
// @author       You
// @match        https://frogweb.daqingwa.org/*
// @match        https://frogweb.daqingwa.org/#/task/index
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @connect      api.themoviedb.org
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552633/%E6%B5%81%E5%AA%92%E4%BD%93%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552633/%E6%B5%81%E5%AA%92%E4%BD%93%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TMDB API 配置
    const TMDB_API_KEY = '188f9a60f2669cc5f19a2cc585ba732a'; // 请替换为你的 API Key
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    // 流媒体平台配置
    const STREAMING_PLATFORMS = {
        amazon: {
            name: 'Amazon Prime Video',
            baseUrl: 'https://www.amazon.com/s/ref=nb_sb_noss',
            customParams: {
                'url': 'search-alias=instant-video',
                'field-keywords': ''
            },
            icon: '📺',
            useOriginalTitle: true
        },
        disney: {
            name: 'Disney+',
            baseUrl: 'https://www.google.com/search',
            searchParam: 'q',
            icon: '🏰',
            useOriginalTitle: true,
            googleSearch: true
        },
        netflix: {
            name: 'Netflix (uNoGS)',
            baseUrl: 'https://unogs.com/search/',
            icon: '🎬',
            useOriginalTitle: true,
            pathSearch: true  // 使用路径搜索而非查询参数
        },
        aptv: {
            name: 'Apple TV+',
            baseUrl: 'https://tv.apple.com/us/search',
            searchParam: 'term',
            icon: '🍎',
            useOriginalTitle: true
        },
        cr: {
            name: 'Crunchyroll',
            baseUrl: 'https://www.crunchyroll.com/search',
            searchParam: 'q',
            icon: '🍥',
            useOriginalTitle: true
        },
        baha: {
            name: '巴哈姆特',
            baseUrl: 'https://ani.gamer.com.tw',
            icon: '🎮',
            customUrl: true,
            useTraditionalChinese: true
        }
    };

    // 简繁转换
    function toTraditionalChinese(text) {
        const s2tMap = {
            '进击': '進擊', '巨人': '巨人', '鬼灭': '鬼滅', '之刃': '之刃',
            '间谍': '間諜', '家家': '家家', '咒术': '咒術', '回战': '迴戰',
            '电锯': '電鋸', '人': '人', '链锯': '鏈鋸', '东京': '東京',
            '食尸鬼': '喰種', '海贼王': '海賊王', '火影忍者': '火影忍者',
            '死神': '死神', '银魂': '銀魂', '龙珠': '龍珠', '钢之炼金术师': '鋼之鍊金術師',
            '刀剑神域': '刀劍神域', '约会大作战': '約會大作戰',
            '魔法禁书目录': '魔法禁書目錄', '某科学的超电磁炮': '某科學的超電磁砲',
            '我的英雄学院': '我的英雄學院'
        };
        let result = text;
        for (const [simp, trad] of Object.entries(s2tMap)) {
            result = result.replace(new RegExp(simp, 'g'), trad);
        }
        return result;
    }

    // 搜索 TMDB
    function searchTMDB(query) {
        return new Promise((resolve, reject) => {
            if (!TMDB_API_KEY || TMDB_API_KEY === '你的TMDB_API_KEY') {
                resolve(null);
                return;
            }

            // 先用中文搜索获取ID，然后用英文获取详情
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=zh-CN&include_adult=false`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.results && data.results.length > 0) {
                            const result = data.results[0];
                            const mediaType = result.media_type;
                            const id = result.id;

                            // 获取英文详情
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
                                onload: function(detailResponse) {
                                    try {
                                        const detailData = JSON.parse(detailResponse.responseText);
                                        resolve({
                                            title: result.title || result.name,
                                            originalTitle: detailData.original_title || detailData.original_name,
                                            englishTitle: detailData.title || detailData.name,
                                            year: result.release_date?.substring(0, 4) || result.first_air_date?.substring(0, 4),
                                            type: mediaType
                                        });
                                    } catch (e) {
                                        // 如果获取详情失败，使用原始结果
                                        resolve({
                                            title: result.title || result.name,
                                            originalTitle: result.original_title || result.original_name,
                                            year: result.release_date?.substring(0, 4) || result.first_air_date?.substring(0, 4),
                                            type: mediaType
                                        });
                                    }
                                },
                                onerror: function() {
                                    // 如果获取详情失败，使用原始结果
                                    resolve({
                                        title: result.title || result.name,
                                        originalTitle: result.original_title || result.original_name,
                                        year: result.release_date?.substring(0, 4) || result.first_air_date?.substring(0, 4),
                                        type: mediaType
                                    });
                                }
                            });
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

    // 生成搜索链接
    function generateSearchLink(platform, query, tmdbInfo) {
        const config = STREAMING_PLATFORMS[platform];
        if (!config) return null;

        let searchQuery = query;

        if (config.useOriginalTitle) {
            // 强制使用英文：优先使用英文标题
            if (tmdbInfo) {
                // 优先级：英文标题 > 原始标题(如果是拉丁字符) > 用户输入
                if (tmdbInfo.englishTitle) {
                    searchQuery = tmdbInfo.englishTitle;
                } else if (tmdbInfo.originalTitle && /[a-zA-Z]/.test(tmdbInfo.originalTitle)) {
                    searchQuery = tmdbInfo.originalTitle;
                } else {
                    searchQuery = query;
                }
            } else {
                searchQuery = query;
            }
        } else if (config.useTraditionalChinese) {
            searchQuery = (tmdbInfo && tmdbInfo.title) ? toTraditionalChinese(tmdbInfo.title) : toTraditionalChinese(query);
        } else {
            searchQuery = (tmdbInfo && tmdbInfo.title) ? tmdbInfo.title : query;
        }

        let url = config.baseUrl;
        
        // 构建 URL
        if (config.customUrl) {
            // 巴哈姆特等自定义URL平台
            url = config.baseUrl;
        } else if (config.customParams) {
            // Amazon 特殊参数格式
            const urlObj = new URL(config.baseUrl);
            for (const [key, value] of Object.entries(config.customParams)) {
                if (key === 'field-keywords') {
                    urlObj.searchParams.set(key, searchQuery);
                } else {
                    urlObj.searchParams.set(key, value);
                }
            }
            url = urlObj.toString();
        } else if (config.googleSearch) {
            // Disney 使用 Google 搜索
            const googleQuery = `${searchQuery} disney`;
            url = `${config.baseUrl}?${config.searchParam}=${encodeURIComponent(googleQuery)}`;
        } else if (config.pathSearch) {
            // uNoGS 使用路径搜索（直接拼接在路径中，保留空格和特殊字符）
            url = `${config.baseUrl}${searchQuery}`;
        } else {
            // 标准搜索格式
            url = `${config.baseUrl}?${config.searchParam}=${encodeURIComponent(searchQuery)}`;
        }

        return {
            platform: platform,
            name: config.name,
            url: url,
            icon: config.icon,
            searchQuery: searchQuery,
            needCopy: config.customUrl && config.useTraditionalChinese
        };
    }

    // 创建悬浮窗口
    function createFloatingWindow() {
        const container = document.createElement('div');
        container.id = 'streaming-search-widget';
        container.innerHTML = `
            <div class="ss-header">
                <span class="ss-title">🎬 流媒体搜索</span>
                <div class="ss-controls">
                    <button class="ss-minimize" title="最小化">−</button>
                    <button class="ss-close" title="关闭">×</button>
                </div>
            </div>
            <div class="ss-content">
                <div class="ss-search-box">
                    <input type="text" class="ss-input" placeholder="输入影视名称..." />
                    <button class="ss-search-btn">🔍</button>
                </div>
                <div class="ss-loading" style="display: none;">⏳ 搜索中...</div>
                <div class="ss-results"></div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #streaming-search-widget {
                position: fixed;
                top: 100px;
                right: 20px;
                width: 320px;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
                isolation: isolate;
                transition: left 0.2s ease-out, top 0.2s ease-out;
            }
            
            #streaming-search-widget.dragging {
                transition: none;
            }
            
            #streaming-search-widget.minimized .ss-content {
                display: none;
            }
            
            .ss-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 10px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
            }
            
            .ss-title {
                font-size: 14px;
                font-weight: 600;
            }
            
            .ss-controls {
                display: flex;
                gap: 5px;
            }
            
            .ss-minimize, .ss-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                line-height: 1;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .ss-minimize:hover, .ss-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .ss-content {
                padding: 12px;
            }
            
            .ss-search-box {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }
            
            .ss-input {
                flex: 1;
                padding: 8px 10px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 13px;
                outline: none;
            }
            
            .ss-input:focus {
                border-color: #667eea;
            }
            
            .ss-search-btn {
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                font-size: 16px;
            }
            
            .ss-search-btn:hover {
                opacity: 0.9;
            }
            
            .ss-loading {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 13px;
            }
            
            .ss-results {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .ss-tmdb-info {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 10px;
                font-size: 12px;
            }
            
            .ss-tmdb-title {
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .ss-tmdb-detail {
                opacity: 0.9;
                margin: 2px 0;
            }
            
            .ss-platform-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: #f5f7fa;
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
                transition: all 0.2s;
            }
            
            .ss-platform-item:hover {
                background: #e8eaf0;
                transform: translateX(3px);
            }
            
            .ss-platform-icon {
                font-size: 24px;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                border-radius: 50%;
                flex-shrink: 0;
            }
            
            .ss-platform-info {
                flex: 1;
                min-width: 0;
            }
            
            .ss-platform-name {
                font-weight: 600;
                font-size: 13px;
                margin-bottom: 2px;
            }
            
            .ss-platform-query {
                font-size: 11px;
                color: #666;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .ss-copy-hint {
                color: #F47521;
                font-size: 10px;
                margin-top: 2px;
            }
            
            .ss-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 12px 18px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 2147483646;
                font-size: 13px;
                font-weight: 600;
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .ss-results::-webkit-scrollbar {
                width: 6px;
            }
            
            .ss-results::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            
            .ss-results::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 3px;
            }
            
            .ss-results::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(container);

        return container;
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'ss-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 执行搜索
    async function performSearch(widget, query) {
        const loadingEl = widget.querySelector('.ss-loading');
        const resultsEl = widget.querySelector('.ss-results');

        loadingEl.style.display = 'block';
        resultsEl.innerHTML = '';

        try {
            const tmdbInfo = await searchTMDB(query);
            const results = Object.keys(STREAMING_PLATFORMS).map(platform =>
                generateSearchLink(platform, query, tmdbInfo)
            ).filter(r => r !== null);

            loadingEl.style.display = 'none';

            let html = '';

            // TMDB 信息卡片
            if (tmdbInfo) {
                html += `
                    <div class="ss-tmdb-info">
                        <div class="ss-tmdb-title">📽️ ${tmdbInfo.title}</div>
                        ${tmdbInfo.englishTitle && tmdbInfo.englishTitle !== tmdbInfo.title ?
                          `<div class="ss-tmdb-detail">英文名: ${tmdbInfo.englishTitle}</div>` : ''}
                        ${tmdbInfo.originalTitle && tmdbInfo.originalTitle !== tmdbInfo.title && tmdbInfo.originalTitle !== tmdbInfo.englishTitle ?
                          `<div class="ss-tmdb-detail">原名: ${tmdbInfo.originalTitle}</div>` : ''}
                        ${tmdbInfo.year ? `<div class="ss-tmdb-detail">年份: ${tmdbInfo.year}</div>` : ''}
                        <div class="ss-tmdb-detail">类型: ${tmdbInfo.type === 'movie' ? '电影' : '电视剧'}</div>
                    </div>
                `;
            }

            // 平台链接
            results.forEach((result, index) => {
                html += `
                    <a href="${result.url}" 
                       class="ss-platform-item" 
                       target="_blank"
                       data-index="${index}"
                       data-query="${result.searchQuery}"
                       data-need-copy="${result.needCopy || false}">
                        <div class="ss-platform-icon">${result.icon}</div>
                        <div class="ss-platform-info">
                            <div class="ss-platform-name">${result.name}</div>
                            <div class="ss-platform-query">${result.searchQuery}</div>
                            ${result.needCopy ? '<div class="ss-copy-hint">⚠️ 点击复制剧名</div>' : ''}
                        </div>
                    </a>
                `;
            });

            resultsEl.innerHTML = html;

            // 添加点击事件
            resultsEl.querySelectorAll('.ss-platform-item').forEach(item => {
                if (item.dataset.needCopy === 'true') {
                    item.addEventListener('click', (e) => {
                        const query = item.dataset.query;
                        GM_setClipboard(query, 'text');
                        showNotification(`✓ 已复制: ${query}`);
                    });
                }
            });

        } catch (error) {
            loadingEl.style.display = 'none';
            resultsEl.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">搜索失败，请重试</div>';
            console.error('搜索错误:', error);
        }
    }

    // 使窗口可拖动（带边框吸附）
    function makeDraggable(widget) {
        const header = widget.querySelector('.ss-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        
        // 吸附距离（像素）
        const snapDistance = 20;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.ss-controls')) return;
            
            isDragging = true;
            initialX = e.clientX - widget.offsetLeft;
            initialY = e.clientY - widget.offsetTop;
            
            // 拖动时提升 z-index，确保在最上层，并禁用过渡动画
            widget.classList.add('dragging');
            widget.style.zIndex = '2147483647';
            widget.style.cursor = 'grabbing';
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            widget.style.left = currentX + 'px';
            widget.style.top = currentY + 'px';
            widget.style.right = 'auto';
            widget.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                
                // 移除 dragging 类，启用过渡动画以便吸附效果更平滑
                widget.classList.remove('dragging');
                widget.style.cursor = '';
                header.style.cursor = 'move';
                
                // 边框吸附
                const rect = widget.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                
                let finalX = rect.left;
                let finalY = rect.top;
                
                // 左边吸附
                if (rect.left < snapDistance) {
                    finalX = 0;
                }
                // 右边吸附
                else if (windowWidth - rect.right < snapDistance) {
                    finalX = windowWidth - rect.width;
                }
                
                // 上边吸附
                if (rect.top < snapDistance) {
                    finalY = 0;
                }
                // 下边吸附
                else if (windowHeight - rect.bottom < snapDistance) {
                    finalY = windowHeight - rect.height;
                }
                
                // 应用吸附位置
                widget.style.left = finalX + 'px';
                widget.style.top = finalY + 'px';
                widget.style.right = 'auto';
                widget.style.bottom = 'auto';
                
                // 不再保存位置，每次刷新都恢复默认位置
                // 如果需要保存位置，取消下面的注释
                /*
                if (widget.style.left) {
                    GM_setValue('widget_position', {
                        left: widget.style.left,
                        top: widget.style.top
                    });
                }
                */
            }
        });
        
        // 添加鼠标悬停效果
        header.addEventListener('mouseenter', () => {
            if (!isDragging) {
                header.style.cursor = 'move';
            }
        });
    }

    // 初始化
    function init() {
        const widget = createFloatingWindow();

        // 不恢复保存的位置，始终使用默认位置（右上角）
        // 如果需要恢复上次位置，取消下面的注释
        /*
        const savedPosition = GM_getValue('widget_position');
        if (savedPosition) {
            widget.style.left = savedPosition.left;
            widget.style.top = savedPosition.top;
            widget.style.right = 'auto';
        }
        */

        // 点击窗口时置顶
        widget.addEventListener('mousedown', () => {
            widget.style.zIndex = '2147483647';
        });

        // 使窗口可拖动
        makeDraggable(widget);

        // 搜索功能
        const input = widget.querySelector('.ss-input');
        const searchBtn = widget.querySelector('.ss-search-btn');

        searchBtn.addEventListener('click', () => {
            const query = input.value.trim();
            if (query) {
                performSearch(widget, query);
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    performSearch(widget, query);
                }
            }
        });

        // 最小化按钮
        widget.querySelector('.ss-minimize').addEventListener('click', () => {
            widget.classList.toggle('minimized');
        });

        // 关闭按钮
        widget.querySelector('.ss-close').addEventListener('click', () => {
            widget.style.display = 'none';
        });

        // 快捷键：Ctrl+Shift+F 显示/隐藏
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                widget.style.display = widget.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

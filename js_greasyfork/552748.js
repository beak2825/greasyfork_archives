// ==UserScript==
// @name         流媒体搜索助手 + TMDB 自动填充
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  流媒体搜索 + TMDB 自动填充表单功能，支持多平台搜索、季度选择、智能标题匹配、任务类型自动选择（修复搜索显示）
// @author       You
// @match        https://frogweb.daqingwa.org/*
// @match        https://frogweb.daqingwa.org/#/task/index
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @connect      api.themoviedb.org
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552748/%E6%B5%81%E5%AA%92%E4%BD%93%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%20%2B%20TMDB%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/552748/%E6%B5%81%E5%AA%92%E4%BD%93%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%20%2B%20TMDB%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TMDB API 配置
    let TMDB_API_KEY = GM_getValue('TMDB_API_KEY', '188f9a60f2669cc5f19a2cc585ba732a');
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    
    // 全局变量
    let currentChineseTitle = '';
    let currentSeasons = [];
    let currentTmdbId = null;
    let currentMediaType = null;
    let currentTmdbInfo = null;

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

    // ========== 辅助函数 ==========
    
    // 判断文本是否主要为英文
    function isEnglishText(text) {
        if (!text) return false;
        const englishChars = text.match(/[a-zA-Z]/g);
        const totalChars = text.replace(/\s/g, '').length;
        if (totalChars === 0) return false;
        const englishRatio = englishChars ? englishChars.length / totalChars : 0;
        return englishRatio > 0.5;
    }
    
    // 获取页面中的发布标题（用于自动填充）
    function getPageTitle() {
        if (currentChineseTitle) {
            return currentChineseTitle;
        }
        
        const selectors = [
            'input[placeholder*="填入一个确保自动化工具可以识别的标题"]',
            '.el-input__inner'
        ];

        for (const selector of selectors) {
            if (selector.includes('placeholder')) {
                const element = document.querySelector(selector);
                if (element && element.value.trim()) {
                    return element.value.trim();
                }
            } else {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const value = element.value.trim();
                    const placeholder = element.placeholder || '';
                    if (value &&
                        !value.match(/^\d+$/) &&
                        !placeholder.includes('TMDB') &&
                        !placeholder.includes('年份') &&
                        value.length > 2 &&
                        value.length < 100) {
                        return value;
                    }
                }
            }
        }
        return '';
    }
    
    // 填充 TMDB 链接到表单
    function fillTMDBLink(tmdbId, mediaType, seasonNumber = null) {
        const tmdbInput = document.querySelector('input[placeholder*="TMDB 全链接"]') ||
                         document.querySelector('input[placeholder*="TMDB"]') ||
                         document.querySelector('input[name*="tmdb"]') ||
                         document.querySelector('input[id*="tmdb"]');

        if (tmdbInput) {
            let tmdbLink;
            if (seasonNumber) {
                tmdbLink = `https://www.themoviedb.org/tv/${tmdbId}/season/${seasonNumber}`;
            } else if (mediaType === 'tv') {
                tmdbLink = `https://www.themoviedb.org/tv/${tmdbId}`;
            } else {
                tmdbLink = `https://www.themoviedb.org/movie/${tmdbId}`;
            }
            
            tmdbInput.value = tmdbLink;
            tmdbInput.dispatchEvent(new Event('input', { bubbles: true }));
            tmdbInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('TMDB链接已填充:', tmdbLink);
            return true;
        }
        console.warn('未找到TMDB输入框');
        return false;
    }
    
    // 填充年份到表单
    function fillYear(year) {
        // 优先匹配 type="number" 的年份输入框
        const yearInput = document.querySelector('input[type="number"][placeholder*="影片发行年份"]') ||
                         document.querySelector('input[type="number"][placeholder*="年份"]') ||
                         document.querySelector('input[placeholder*="影片发行年份"]') ||
                         document.querySelector('input[placeholder*="发布年份"]') ||
                         document.querySelector('input[placeholder*="年份"]') ||
                         document.querySelector('input[name*="year"]') ||
                         document.querySelector('input[id*="year"]');
        if (yearInput && year) {
            yearInput.value = year;
            yearInput.dispatchEvent(new Event('input', { bubbles: true }));
            yearInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('年份已填充:', year, '(输入框类型:', yearInput.type, ')');
            return true;
        }
        console.warn('未找到年份输入框');
        return false;
    }
    
    // 填充季度编号到表单
    function fillSeasonNumber(seasonNumber) {
        const seasonInput = document.querySelector('input[placeholder*="发布季度"]') ||
                           document.querySelector('input[placeholder*="季度"]') ||
                           document.querySelector('input[name*="season"]') ||
                           document.querySelector('input[id*="season"]');
        if (seasonInput) {
            seasonInput.value = seasonNumber;
            seasonInput.dispatchEvent(new Event('input', { bubbles: true }));
            seasonInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('季度编号已填充:', seasonNumber);
            return true;
        }
        console.warn('未找到季度输入框');
        return false;
    }
    
    // 填充集数到表单
    function fillEpisodeCount(episodeCount) {
        // 优先匹配"总集数"字段，这是一个 number 类型的输入框
        const episodeInput = document.querySelector('input[type="number"][placeholder*="总集数"]') ||
                            document.querySelector('input[placeholder*="总集数"]') ||
                            document.querySelector('input[type="number"][placeholder*="集数"]') ||
                            document.querySelector('input[placeholder*="集数"]') ||
                            document.querySelector('input[placeholder*="episode"]') ||
                            document.querySelector('input[name*="episode"]') ||
                            document.querySelector('input[id*="episode"]');
        if (episodeInput && episodeCount) {
            episodeInput.value = episodeCount;
            episodeInput.dispatchEvent(new Event('input', { bubbles: true }));
            episodeInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('总集数已填充:', episodeCount, '(输入框类型:', episodeInput.type, 'placeholder:', episodeInput.placeholder, ')');
            return true;
        }
        console.warn('未找到总集数输入框');
        return false;
    }

    // 选择电影/剧集类型
    function selectMediaType(isTV) {
        console.log('选择媒体类型:', isTV ? '剧集' : '电影');
        
        // 方法1：查找单选按钮（radio buttons）
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        let typeSelected = false;
        
        radioButtons.forEach(radio => {
            const labelText = radio.parentElement ? radio.parentElement.textContent : '';
            const value = radio.value;
            
            // 匹配剧集 - 精确匹配 value="TV"
            if (isTV && (value === 'TV' || value === 'tv' || labelText.includes('剧集'))) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                radio.dispatchEvent(new Event('click', { bubbles: true }));
                console.log('已选择剧集类型（单选按钮）- value:', value);
                typeSelected = true;
            }
            // 匹配电影 - 精确匹配 value="MOVIE"
            else if (!isTV && (value === 'MOVIE' || value === 'movie' || labelText.includes('电影'))) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                radio.dispatchEvent(new Event('click', { bubbles: true }));
                console.log('已选择电影类型（单选按钮）- value:', value);
                typeSelected = true;
            }
        });
        
        if (typeSelected) {
            // 等待DOM更新
            return new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // 方法2：查找选择框（select dropdown）
        const selectElement = document.querySelector('select') ||
                             document.querySelector('select[name*="type"]') ||
                             document.querySelector('select[name*="类型"]');

        if (selectElement) {
            const options = selectElement.querySelectorAll('option');
            options.forEach(option => {
                const text = option.textContent;
                const value = option.value;

                if (isTV && (value === 'TV' || text.includes('剧集') || value.includes('tv') || value.includes('series'))) {
                    selectElement.value = option.value;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('已选择剧集类型（下拉框）');
                    typeSelected = true;
                } else if (!isTV && (value === 'MOVIE' || text.includes('电影') || value.includes('movie'))) {
                    selectElement.value = option.value;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('已选择电影类型（下拉框）');
                    typeSelected = true;
                }
            });
        }
        
        if (!typeSelected) {
            console.warn('未找到任务类型选择控件');
        }
        
        return Promise.resolve();
    }

    // 调试工具：显示页面所有输入框信息
    function debugFormInputs() {
        console.log('=== 页面表单输入框信息 ===');
        
        // 检查所有输入框
        const allInputs = document.querySelectorAll('input');
        console.log(`找到 ${allInputs.length} 个输入框:`);
        allInputs.forEach((input, index) => {
            console.log(`输入框 ${index + 1}:`, {
                类型: input.type,
                placeholder: input.placeholder,
                name: input.name,
                id: input.id,
                value: input.value,
                class: input.className
            });
        });
        
        // 检查所有单选按钮
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        console.log(`\n找到 ${radioButtons.length} 个单选按钮:`);
        radioButtons.forEach((radio, index) => {
            const label = radio.parentElement ? radio.parentElement.textContent.trim() : '';
            console.log(`单选按钮 ${index + 1}:`, {
                value: radio.value,
                checked: radio.checked,
                label: label,
                name: radio.name
            });
        });
        
        // 检查所有选择框
        const selects = document.querySelectorAll('select');
        console.log(`\n找到 ${selects.length} 个选择框:`);
        selects.forEach((select, index) => {
            console.log(`选择框 ${index + 1}:`, {
                name: select.name,
                id: select.id,
                value: select.value,
                options: Array.from(select.options).map(opt => ({
                    value: opt.value,
                    text: opt.textContent
                }))
            });
        });
        
        // 高亮显示关键字段
        console.log('\n=== 关键字段识别 ===');
        
        // TMDB链接
        const tmdbInput = document.querySelector('input[placeholder*="TMDB"]');
        console.log('TMDB链接字段:', tmdbInput ? {
            placeholder: tmdbInput.placeholder,
            id: tmdbInput.id,
            type: tmdbInput.type
        } : '❌ 未找到');
        
        // 年份
        const yearInput = document.querySelector('input[placeholder*="年份"]');
        console.log('年份字段:', yearInput ? {
            placeholder: yearInput.placeholder,
            id: yearInput.id,
            type: yearInput.type
        } : '❌ 未找到');
        
        // 任务类型
        const movieRadio = document.querySelector('input[type="radio"][value="MOVIE"]');
        const tvRadio = document.querySelector('input[type="radio"][value="TV"]');
        console.log('电影单选按钮:', movieRadio ? {
            value: movieRadio.value,
            checked: movieRadio.checked,
            name: movieRadio.name
        } : '❌ 未找到');
        console.log('剧集单选按钮:', tvRadio ? {
            value: tvRadio.value,
            checked: tvRadio.checked,
            name: tvRadio.name
        } : '❌ 未找到');
        
        // 总集数字段
        const episodeInput = document.querySelector('input[placeholder*="总集数"]');
        console.log('总集数字段:', episodeInput ? {
            placeholder: episodeInput.placeholder,
            id: episodeInput.id,
            type: episodeInput.type,
            value: episodeInput.value
        } : '❌ 未找到');
        
        showNotification('📋 表单调试信息已输出到控制台 (F12)');
    }

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
                                            id: id,
                                            title: result.title || result.name,
                                            originalTitle: detailData.original_title || detailData.original_name,
                                            englishTitle: detailData.title || detailData.name,
                                            year: result.release_date?.substring(0, 4) || result.first_air_date?.substring(0, 4),
                                            type: mediaType
                                        });
                                    } catch (e) {
                                        // 如果获取详情失败，使用原始结果
                                        resolve({
                                            id: id,
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
                                        id: id,
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
        
        // 获取页面标题用于占位符
        const pageTitle = getPageTitle();
        const placeholder = pageTitle ?
            `自动检测: ${pageTitle.substring(0, 20)}...` :
            '输入影视名称...';
        
        container.innerHTML = `
            <div class="ss-header">
                <span class="ss-title">🎬 流媒体搜索 + 自动填充</span>
                <div class="ss-controls">
                    <button class="ss-debug" title="调试表单字段">🐛</button>
                    <button class="ss-config" title="配置API Key">⚙️</button>
                    <button class="ss-autofill" title="自动填充表单" style="display:none;">📝</button>
                    <button class="ss-minimize" title="最小化">−</button>
                    <button class="ss-close" title="关闭">×</button>
                </div>
            </div>
            <div class="ss-content">
                <div class="ss-search-box">
                    <input type="text" class="ss-input" placeholder="${placeholder}" />
                    <button class="ss-search-btn">🔍</button>
                </div>
                <div class="ss-season-section" style="display: none;">
                    <div class="ss-season-header">选择季度：</div>
                    <div class="ss-season-list"></div>
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
            
            .ss-config, .ss-debug, .ss-autofill, .ss-minimize, .ss-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                line-height: 1;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .ss-config:hover, .ss-debug:hover, .ss-autofill:hover, .ss-minimize:hover, .ss-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .ss-season-section {
                margin-bottom: 12px;
                padding: 10px;
                background: #f0f9ff;
                border-radius: 6px;
                border: 1px solid #bfdbfe;
            }
            
            .ss-season-header {
                font-weight: 600;
                margin-bottom: 8px;
                color: #1e40af;
                font-size: 12px;
            }
            
            .ss-season-list {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            
            .ss-season-item {
                padding: 4px 10px;
                background: white;
                border: 1px solid #93c5fd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s ease;
                color: #1e40af;
            }
            
            .ss-season-item:hover {
                background: #dbeafe;
                border-color: #3b82f6;
            }
            
            .ss-season-item.selected {
                background: #3b82f6;
                color: white;
                border-color: #2563eb;
                font-weight: 600;
            }
            
            .ss-season-section {
                margin-bottom: 12px;
                padding: 10px;
                background: #f0f9ff;
                border-radius: 6px;
                border: 1px solid #bfdbfe;
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
    // 执行搜索并获取详细信息
    async function performSearch(widget, query) {
        const loadingEl = widget.querySelector('.ss-loading');
        const resultsEl = widget.querySelector('.ss-results');
        const seasonSection = widget.querySelector('.ss-season-section');

        loadingEl.style.display = 'block';
        resultsEl.innerHTML = '';
        seasonSection.style.display = 'none';

        try {
            // 先搜索基本信息
            const tmdbInfo = await searchTMDB(query);
            
            if (tmdbInfo && tmdbInfo.id) {
                // 获取详细信息
                await getDetailedInfo(tmdbInfo.id, tmdbInfo.type);
            }
            
            // 生成流媒体平台链接
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
    
    // 获取详细信息（包括季度）
    async function getDetailedInfo(tmdbId, mediaType) {
        return new Promise((resolve) => {
            const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
            const url = `${TMDB_BASE_URL}/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=zh-CN`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        currentTmdbInfo = data;
                        currentTmdbId = tmdbId;
                        currentMediaType = mediaType;
                        
                        // 保存中文标题
                        currentChineseTitle = mediaType === 'movie' ? data.title : data.name;
                        
                        // 显示详细信息卡片
                        displayDetailedInfo(data, mediaType);
                        
                        // 如果是剧集，显示季度选择
                        if (mediaType === 'tv' && data.seasons) {
                            currentSeasons = data.seasons;
                            displaySeasons(data.seasons);
                        }
                        
                        resolve(data);
                    } catch (e) {
                        console.error('解析详细信息失败:', e);
                        resolve(null);
                    }
                },
                onerror: function() {
                    console.error('获取详细信息失败');
                    resolve(null);
                }
            });
        });
    }
    
    // 显示详细信息卡片
    function displayDetailedInfo(data, mediaType) {
        // 不再显示信息卡片，直接执行自动填充
        /* 原有的信息卡片显示代码已移除
        const infoSection = document.querySelector('.ss-tmdb-info-section');
        const infoTitle = document.querySelector('.ss-info-title');
        const infoDetails = document.querySelector('.ss-info-details');
        
        if (!infoSection || !infoTitle || !infoDetails) return;
        
        const title = mediaType === 'movie' ? data.title : data.name;
        const year = mediaType === 'movie' ? 
            (data.release_date ? data.release_date.split('-')[0] : '未知') :
            (data.first_air_date ? data.first_air_date.split('-')[0] : '未知');
        
        infoTitle.textContent = `${title} (${year})`;
        infoDetails.innerHTML = `
            <div>TMDB ID: ${data.id}</div>
            <div>类型: ${mediaType === 'movie' ? '电影' : '剧集'}</div>
            ${mediaType === 'tv' && data.number_of_seasons ? 
                `<div>季数: ${data.number_of_seasons}</div>` : ''}
        `;
        
        infoSection.style.display = 'block';
        */
        
        // 如果是电影，直接自动填充表单
        if (mediaType === 'movie') {
            setTimeout(() => {
                autoFillFormForMovie(data);
            }, 100);
        }
    }
    
    // 为电影自动填充表单
    function autoFillFormForMovie(data) {
        if (!currentTmdbId) {
            console.warn('缺少 TMDB ID，无法自动填充');
            return;
        }
        
        console.log('开始自动填充电影信息:', data);
        
        // 先选择电影类型
        selectMediaType(false).then(() => {
            let filled = false;
            
            // 填充TMDB链接
            const linkFilled = fillTMDBLink(currentTmdbId, 'movie');
            console.log('TMDB链接填充结果:', linkFilled);
            filled = linkFilled || filled;
            
            // 填充年份
            const year = data.release_date ? data.release_date.split('-')[0] : null;
            if (year) {
                const yearFilled = fillYear(year);
                console.log('年份填充结果:', yearFilled);
                filled = yearFilled || filled;
            }
            
            console.log('总填充结果:', filled);
            
            if (filled) {
                showNotification('✓ 已自动填充电影信息');
            } else {
                showNotification('⚠️ 未找到表单字段');
            }
        });
    }
    
    // 显示季度选择
    function displaySeasons(seasons) {
        const seasonSection = document.querySelector('.ss-season-section');
        const seasonList = document.querySelector('.ss-season-list');
        
        if (!seasonSection || !seasonList) return;
        
        seasonList.innerHTML = '';
        
        // 过滤正常季度
        const regularSeasons = seasons.filter(s => s.season_number > 0);
        
        if (regularSeasons.length === 0) {
            seasonSection.style.display = 'none';
            return;
        }
        
        seasonSection.style.display = 'block';
        
        regularSeasons.forEach((season, index) => {
            const seasonItem = document.createElement('div');
            seasonItem.className = 'ss-season-item';
            seasonItem.textContent = `S${season.season_number} (${season.episode_count || 0}集)`;
            seasonItem.dataset.seasonNumber = season.season_number;
            seasonItem.dataset.airDate = season.air_date || '';
            
            // 默认选中第一季并自动填充表单
            if (index === 0) {
                seasonItem.classList.add('selected');
                // 延迟一下确保DOM已更新
                setTimeout(() => {
                    autoFillFormForSeason(season);
                }, 100);
            }
            
            seasonItem.onclick = () => {
                // 清除所有选中
                seasonList.querySelectorAll('.ss-season-item').forEach(el => {
                    el.classList.remove('selected');
                });
                seasonItem.classList.add('selected');
                
                // 自动填充表单
                autoFillFormForSeason(season);
            };
            
            seasonList.appendChild(seasonItem);
        });
    }
    
    // 为特定季度自动填充表单
    function autoFillFormForSeason(season) {
        if (!currentTmdbId || !currentMediaType) {
            console.warn('缺少 TMDB 信息，无法自动填充');
            return;
        }
        
        console.log('开始自动填充季度信息:', season);
        
        // 先选择剧集类型
        selectMediaType(true).then(() => {
            let filled = false;
            const seasonNumber = season.season_number;
            const episodeCount = season.episode_count || 0;
            
            // 填充TMDB季度链接
            const linkFilled = fillTMDBLink(currentTmdbId, currentMediaType, seasonNumber);
            console.log('TMDB链接填充结果:', linkFilled);
            filled = linkFilled || filled;
            
            // 填充季度编号
            const seasonFilled = fillSeasonNumber(seasonNumber);
            console.log('季度编号填充结果:', seasonFilled);
            filled = seasonFilled || filled;
            
            // 填充集数
            const episodeFilled = fillEpisodeCount(episodeCount);
            console.log('集数填充结果:', episodeFilled);
            filled = episodeFilled || filled;
            
            // 填充季度年份
            const airDate = season.air_date;
            if (airDate) {
                const yearFilled = fillYear(airDate.split('-')[0]);
                console.log('年份填充结果:', yearFilled);
                filled = yearFilled || filled;
            }
            
            console.log('总填充结果:', filled);
            
            if (filled) {
                showNotification(`✓ 已自动填充 第${seasonNumber}季 (${episodeCount}集)`);
            } else {
                showNotification(`⚠️ 未找到表单字段`);
            }
        });
    }
    
    // 自动填充表单（手动触发）
    function autoFillForm() {
        if (!currentTmdbInfo || !currentTmdbId) {
            showNotification('⚠️ 请先搜索影视作品');
            return;
        }
        
        let filled = false;
        
        // 填充TMDB链接
        const selectedSeason = document.querySelector('.ss-season-item.selected');
        if (selectedSeason && currentMediaType === 'tv') {
            const seasonNumber = selectedSeason.dataset.seasonNumber;
            filled = fillTMDBLink(currentTmdbId, currentMediaType, seasonNumber) || filled;
            filled = fillSeasonNumber(seasonNumber) || filled;
            
            // 填充季度年份
            const airDate = selectedSeason.dataset.airDate;
            if (airDate) {
                filled = fillYear(airDate.split('-')[0]) || filled;
            }
        } else {
            filled = fillTMDBLink(currentTmdbId, currentMediaType) || filled;
            
            // 填充年份
            const year = currentMediaType === 'movie' ?
                (currentTmdbInfo.release_date ? currentTmdbInfo.release_date.split('-')[0] : null) :
                (currentTmdbInfo.first_air_date ? currentTmdbInfo.first_air_date.split('-')[0] : null);
            if (year) {
                filled = fillYear(year) || filled;
            }
        }
        
        if (filled) {
            showNotification('✓ 表单填充完成');
        } else {
            showNotification('⚠️ 未找到可填充的表单字段');
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
            let query = input.value.trim();
            // 如果为空，自动获取页面标题
            if (!query) {
                query = getPageTitle();
                if (query) {
                    input.value = query;
                }
            }
            if (query) {
                performSearch(widget, query);
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                let query = input.value.trim();
                if (!query) {
                    query = getPageTitle();
                    if (query) {
                        input.value = query;
                    }
                }
                if (query) {
                    performSearch(widget, query);
                }
            }
        });
        
        // 配置按钮
        widget.querySelector('.ss-config').addEventListener('click', (e) => {
            e.stopPropagation();
            showConfigDialog();
        });
        
        // 调试按钮
        widget.querySelector('.ss-debug').addEventListener('click', (e) => {
            e.stopPropagation();
            debugFormInputs();
        });
        
        // 移除了自动填充按钮事件监听器（信息卡片已移除）

        // 最小化按钮
        widget.querySelector('.ss-minimize').addEventListener('click', (e) => {
            e.stopPropagation();
            widget.classList.toggle('minimized');
        });

        // 关闭按钮
        widget.querySelector('.ss-close').addEventListener('click', (e) => {
            e.stopPropagation();
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
    
    // 显示配置对话框
    function showConfigDialog() {
        const currentApiKey = TMDB_API_KEY;
        const newApiKey = prompt('请输入您的TMDB API Key:\n\n您可以在 https://www.themoviedb.org/settings/api 获取API Key', currentApiKey);

        if (newApiKey !== null && newApiKey.trim() !== '') {
            TMDB_API_KEY = newApiKey.trim();
            GM_setValue('TMDB_API_KEY', TMDB_API_KEY);
            showNotification('✓ API Key已保存');
        }
    }
    
    // 注册菜单命令
    GM_registerMenuCommand('配置 TMDB API Key', showConfigDialog);

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

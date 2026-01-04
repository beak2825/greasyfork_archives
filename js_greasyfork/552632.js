// ==UserScript==
// @name         FROG Web TMDB 自动填充助手
// @namespace    http://tampermonkey.net/
// @version      1.8.2
// @description  为FROG Web添加TMDB链接自动搜索和表单填充功能，支持英文标题Google搜索、Crunchyroll搜索和中文标题青蛙PT搜索，专门优化日本动漫英文标题获取，智能识别中英文标题，支持剧集季度选择和自动填充，可拖动窗口并记忆位置
// @author       You
// @match        https://frogweb.daqingwa.org/*
// @match        https://frogweb.daqingwa.org/#/task/index
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      api.themoviedb.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552632/FROG%20Web%20TMDB%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552632/FROG%20Web%20TMDB%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量：保存当前中文标题
    let currentChineseTitle = '';
    // 全局变量：保存当前剧集的季度数据
    let currentSeasons = [];
    // 全局变量：保存当前TMDB ID和媒体类型
    let currentTmdbId = null;
    let currentMediaType = null;
    // 拖动相关变量
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    // 获取保存的API Key
    function getTMDBApiKey() {
        return GM_getValue('TMDB_API_KEY', '');
    }

    // 保存API Key
    function saveTMDBApiKey(apiKey) {
        GM_setValue('TMDB_API_KEY', apiKey);
    }

    // 获取保存的窗口位置
    function getSavedPosition() {
        const savedPos = GM_getValue('PANEL_POSITION', null);
        if (savedPos) {
            return JSON.parse(savedPos);
        }
        // 默认位置：右下角
        return { bottom: 20, right: 20 };
    }

    // 保存窗口位置
    function savePosition(top, left) {
        GM_setValue('PANEL_POSITION', JSON.stringify({ top, left }));
    }

    // 重置窗口位置到默认
    function resetPosition() {
        GM_setValue('PANEL_POSITION', null);
        const panel = document.getElementById('tmdb-helper-panel');
        if (panel) {
            panel.style.top = '';
            panel.style.left = '';
            panel.classList.add('default-position');
        }
    }

    // 调试功能：显示页面上所有输入框信息
    function debugInputs() {
        const inputs = document.querySelectorAll('input');
        console.log('=== 页面上所有输入框信息 ===');
        inputs.forEach((input, index) => {
            console.log(`输入框 ${index + 1}:`, {
                标签: input.tagName,
                类型: input.type,
                值: input.value,
                placeholder: input.placeholder,
                name: input.name,
                id: input.id,
                类名: input.className,
                选择器: getUniqueSelector(input)
            });
        });

        // 也显示在页面上
        const debugInfo = Array.from(inputs).map((input, index) => {
            return `输入框${index + 1}: 值="${input.value}" placeholder="${input.placeholder}" id="${input.id}" class="${input.className}"`;
        }).join('\n');

        alert('调试信息已输出到控制台，共找到' + inputs.length + '个输入框\n\n' + debugInfo);
    }

    // 获取元素的唯一选择器
    function getUniqueSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ').join('.')}`;

        let selector = element.tagName.toLowerCase();
        if (element.placeholder) selector += `[placeholder="${element.placeholder}"]`;
        if (element.name) selector += `[name="${element.name}"]`;

        return selector;
    }

    // 获取页面中的发布标题
    function getPageTitle() {
        // 根据调试信息，使用精确的选择器
        const selectors = [
            // 优先使用placeholder匹配（最准确）
            'input[placeholder*="填入一个确保自动化工具可以识别的标题"]',
            // 备用方案：匹配Element UI的输入框类名，并排除特定字段
            '.el-input__inner'
        ];

        for (const selector of selectors) {
            if (selector.includes('placeholder')) {
                // 直接匹配placeholder的情况
                const element = document.querySelector(selector);
                if (element && element.value.trim()) {
                    return element.value.trim();
                }
            } else {
                // 匹配类名的情况，需要进一步筛选
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const value = element.value.trim();
                    const placeholder = element.placeholder || '';

                    // 排除年份、TMDB链接等字段
                    if (value &&
                        !value.match(/^\d+$/) && // 不是纯数字
                        !placeholder.includes('TMDB') && // 不是TMDB字段
                        !placeholder.includes('年份') && // 不是年份字段
                        value.length > 2 &&
                        value.length < 100) {
                        return value;
                    }
                }
            }
        }

        return '';
    }

    // 创建悬浮框
    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.id = 'tmdb-helper-panel';

        // 获取页面标题并设置到搜索框
        const pageTitle = getPageTitle();
        const placeholder = pageTitle ?
            `点击搜索自动使用: ${pageTitle.substring(0, 30)}${pageTitle.length > 30 ? '...' : ''}` :
            '输入电影名称或点击搜索自动抓取标题...';

        panel.innerHTML = `
            <div class="panel-header">
                <h3>TMDB 助手</h3>
                <button id="config-btn">配置</button>
                <button id="reset-position-btn" title="重置位置">⟲</button>
                <button class="minimize-btn">－</button>
            </div>
            <div class="panel-content">
                <div class="search-section">
                    <div class="search-row">
                        <select id="language-select">
                            <option value="zh-CN">zh-CN</option>
                            <option value="ja-JP">ja-JP</option>
                            <option value="en-US">en-US</option>
                        </select>
                        <input type="text" id="movie-search" placeholder="${placeholder}" value="">
                        <button id="search-btn">搜索</button>
                        <button id="debug-btn" style="display: none;">调试</button>
                    </div>
                </div>
                <div class="google-search-section" style="display: none;">
                    <div class="google-row">
                        <input type="text" id="google-search-input" placeholder="英文标题将在此显示..." readonly>
                    </div>
                    <div class="buttons-row">
                        <button id="google-search-btn">Google搜索</button>
                        <button id="crunchyroll-search-btn">CR搜索</button>
                        <button id="qingwa-search-btn">青蛙</button>
                    </div>
                </div>
                <div class="season-section" style="display: none;">
                    <div class="season-header">选择季度：</div>
                    <div id="season-list" class="season-list"></div>
                </div>
                <div class="results-section">
                    <div id="search-results"></div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #tmdb-helper-panel {
                position: fixed;
                width: 500px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                cursor: move;
                user-select: none;
            }

            #tmdb-helper-panel.default-position {
                bottom: 20px;
                right: 20px;
            }

            #tmdb-helper-panel.dragging {
                opacity: 0.8;
                cursor: grabbing;
            }

            .panel-header {
                background: #667eea;
                color: white;
                padding: 8px 12px;
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: grab;
            }

            .panel-header:active {
                cursor: grabbing;
            }

            .panel-header h3 {
                margin: 0;
                font-size: 14px;
                flex: 1;
                pointer-events: none;
            }

            #config-btn {
                padding: 4px 8px;
                background: #ed8936;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-right: 8px;
            }

            #config-btn:hover {
                background: #dd7724;
            }

            #reset-position-btn {
                padding: 4px 8px;
                background: #48bb78;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-right: 8px;
                font-weight: bold;
            }

            #reset-position-btn:hover {
                background: #38a169;
            }

            .minimize-btn {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .minimize-btn:hover {
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
            }

            .panel-content {
                padding: 12px;
                cursor: auto;
            }

            .search-section {
                margin-bottom: 12px;
            }

            .google-search-section {
                margin-bottom: 12px;
                padding: 8px;
                background: #f8f9fa;
                border-radius: 4px;
                border: 1px solid #e9ecef;
            }

            .search-row, .google-row {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .buttons-row {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-top: 8px;
            }

            #language-select {
                width: 80px;
                padding: 6px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                font-size: 12px;
            }

            #movie-search {
                flex: 1;
                padding: 6px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
            }

            #google-search-input {
                flex: 1;
                padding: 6px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
                background: #f8f9fa;
                color: #495057;
                width: 100%;
            }

            #search-btn {
                padding: 6px 12px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }

            #search-btn:hover {
                background: #5a67d8;
            }

            #google-search-btn {
                padding: 8px 16px;
                background: #4285f4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                white-space: nowrap;
                flex: 1;
            }

            #google-search-btn:hover {
                background: #3367d6;
            }

            #crunchyroll-search-btn {
                padding: 8px 16px;
                background: #ff6c2d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                white-space: nowrap;
                flex: 1;
            }

            #crunchyroll-search-btn:hover {
                background: #e55a1a;
            }

            #qingwa-search-btn {
                padding: 8px 16px;
                background: #22c55e;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                white-space: nowrap;
                flex: 1;
            }

            #qingwa-search-btn:hover {
                background: #16a34a;
            }

            .season-section {
                margin-bottom: 12px;
                padding: 8px;
                background: #f0f9ff;
                border-radius: 4px;
                border: 1px solid #bfdbfe;
            }

            .season-header {
                font-weight: bold;
                margin-bottom: 8px;
                color: #1e40af;
                font-size: 13px;
            }

            .season-list {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            .season-item {
                padding: 6px 12px;
                background: white;
                border: 1px solid #93c5fd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
                color: #1e40af;
            }

            .season-item:hover {
                background: #dbeafe;
                border-color: #3b82f6;
            }

            .season-item.selected {
                background: #3b82f6;
                color: white;
                border-color: #2563eb;
                font-weight: bold;
            }

            #debug-btn {
                padding: 6px 12px;
                background: #f56565;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }

            #debug-btn:hover {
                background: #e53e3e;
            }

            .results-section {
                max-height: 150px;
                overflow-y: auto;
            }

            .movie-result {
                border: 1px solid #eee;
                padding: 6px;
                margin-bottom: 6px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .movie-result:hover {
                background: #f5f5f5;
            }

            .movie-result.selected {
                border: 2px solid #ffd700;
                background: #fffbf0;
                box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
            }

            .movie-title {
                font-weight: bold;
                margin-bottom: 2px;
            }

            .movie-info {
                font-size: 12px;
                color: #666;
            }

            .hidden {
                display: none;
            }

            .minimized .panel-content {
                display: none;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(panel);

        // 恢复保存的位置
        const savedPos = getSavedPosition();
        if (savedPos.top !== undefined && savedPos.left !== undefined) {
            // 有保存的位置，使用绝对定位
            panel.style.top = savedPos.top + 'px';
            panel.style.left = savedPos.left + 'px';
        } else {
            // 没有保存的位置，使用默认位置类
            panel.classList.add('default-position');
        }

        // 添加事件监听器
        setupEventListeners();
        
        // 设置拖动功能
        setupDragging();
    }

    // 设置事件监听器
    function setupEventListeners() {
        const panel = document.getElementById('tmdb-helper-panel');

        // 最小化按钮
        panel.querySelector('.minimize-btn').onclick = () => {
            panel.classList.toggle('minimized');
        };

        // 配置按钮
        document.getElementById('config-btn').onclick = showConfigDialog;

        // 重置位置按钮
        document.getElementById('reset-position-btn').onclick = (e) => {
            e.stopPropagation(); // 防止触发拖动
            if (confirm('确定要重置窗口位置到默认位置吗？')) {
                resetPosition();
            }
        };

        // 搜索按钮
        document.getElementById('search-btn').onclick = searchMovies;

        // Google搜索按钮
        document.getElementById('google-search-btn').onclick = performGoogleSearch;

        // Crunchyroll搜索按钮
        document.getElementById('crunchyroll-search-btn').onclick = performCrunchyrollSearch;

        // 青蛙搜索按钮
        document.getElementById('qingwa-search-btn').onclick = performQingwaSearch;

        // 调试输入框按钮（隐藏状态）
        document.getElementById('debug-btn').onclick = debugInputs;

        // 回车搜索
        document.getElementById('movie-search').onkeypress = (e) => {
            if (e.key === 'Enter') {
                searchMovies();
            }
        };

        // 双击调试按钮显示（开发用）
        document.getElementById('search-btn').ondblclick = () => {
            const debugBtn = document.getElementById('debug-btn');
            debugBtn.style.display = debugBtn.style.display === 'none' ? 'block' : 'none';
        };
    }

    // 设置拖动功能
    function setupDragging() {
        const panel = document.getElementById('tmdb-helper-panel');
        const header = panel.querySelector('.panel-header');

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            // 如果点击的是按钮，不触发拖动
            if (e.target.tagName === 'BUTTON') {
                return;
            }

            isDragging = true;
            panel.classList.add('dragging');
            panel.classList.remove('default-position'); // 移除默认位置类

            // 获取当前面板位置
            const rect = panel.getBoundingClientRect();
            
            // 计算鼠标相对于面板的偏移
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();

            // 计算新位置
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // 限制在窗口范围内
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));

            // 设置位置（使用绝对定位）
            panel.style.left = currentX + 'px';
            panel.style.top = currentY + 'px';
        }

        function dragEnd(e) {
            if (!isDragging) return;

            isDragging = false;
            panel.classList.remove('dragging');

            // 保存位置
            const rect = panel.getBoundingClientRect();
            savePosition(rect.top, rect.left);
        }
    }

    // 显示配置对话框
    function showConfigDialog() {
        const currentApiKey = getTMDBApiKey();
        const newApiKey = prompt('请输入您的TMDB API Key:\n\n您可以在 https://www.themoviedb.org/settings/api 获取API Key', currentApiKey);

        if (newApiKey !== null) {
            if (newApiKey.trim() === '') {
                if (confirm('确定要删除API Key配置吗？')) {
                    saveTMDBApiKey('');
                    alert('API Key已清除');
                }
            } else {
                saveTMDBApiKey(newApiKey.trim());
                alert('API Key已保存');
            }
        }
    }

    // 执行Google搜索
    function performGoogleSearch() {
        const searchInput = document.getElementById('google-search-input');
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('没有可搜索的英文标题');
            return;
        }
        
        // 构建Google搜索URL
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        // 在新标签页中打开Google搜索
        window.open(googleUrl, '_blank');
        
        console.log('已打开Google搜索:', query);
    }

    // 执行Crunchyroll搜索
    function performCrunchyrollSearch() {
        const searchInput = document.getElementById('google-search-input');
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('没有可搜索的英文标题');
            return;
        }
        
        // 构建Crunchyroll搜索URL
        const crunchyrollUrl = `https://www.crunchyroll.com/search?q=${encodeURIComponent(query)}`;
        
        // 在新标签页中打开Crunchyroll搜索
        window.open(crunchyrollUrl, '_blank');
        
        console.log('已打开Crunchyroll搜索:', query);
    }

    // 执行青蛙PT搜索
    function performQingwaSearch() {
        // 获取中文标题 - 优先从页面标题获取，其次从主搜索框获取
        let chineseTitle = getPageTitle(); // 首先尝试从页面获取中文标题
        
        if (!chineseTitle) {
            // 如果页面没有标题，尝试从主搜索框获取
            const mainSearchInput = document.getElementById('movie-search');
            chineseTitle = mainSearchInput ? mainSearchInput.value.trim() : '';
        }
        
        if (!chineseTitle) {
            alert('没有可搜索的中文标题');
            return;
        }
        
        // 构建青蛙PT搜索URL
        const qingwaUrl = `https://www.qingwapt.com/torrents.php?search=${encodeURIComponent(chineseTitle)}`;
        
        // 在新标签页中打开青蛙PT搜索
        window.open(qingwaUrl, '_blank');
        
        console.log('已打开青蛙PT搜索（中文标题）:', chineseTitle);
    }

    // 获取页面中文标题的函数
    function getPageTitle() {
        // 优先返回全局保存的中文标题
        if (currentChineseTitle) {
            return currentChineseTitle;
        }
        
        // 如果没有保存的标题，尝试从主搜索框获取
        const mainSearchInput = document.getElementById('movie-search');
        if (mainSearchInput && mainSearchInput.value.trim()) {
            return mainSearchInput.value.trim();
        }
        
        // 最后尝试从页面标题获取（如果有的话）
        const pageTitle = document.title;
        if (pageTitle && pageTitle !== 'FROG Web') {
            return pageTitle;
        }
        
        return '';
    }

    // 判断文本是否主要为英文
    function isEnglishText(text) {
        if (!text) return false;
        
        // 计算英文字符的比例
        const englishChars = text.match(/[a-zA-Z]/g);
        const totalChars = text.replace(/\s/g, '').length; // 去除空格后的总字符数
        
        if (totalChars === 0) return false;
        
        const englishRatio = englishChars ? englishChars.length / totalChars : 0;
        
        // 如果英文字符占比超过50%，认为是英文文本
        return englishRatio > 0.5;
    }

    // 搜索电影
    function searchMovies() {
        let query = document.getElementById('movie-search').value.trim();

        // 如果搜索框为空，自动抓取页面标题
        if (!query) {
            const pageTitle = getPageTitle();
            if (pageTitle) {
                query = pageTitle;
                document.getElementById('movie-search').value = query;
                console.log('自动抓取标题:', query);
            } else {
                alert('请输入搜索内容或确保页面中有标题信息');
                return;
            }
        }

        const apiKey = getTMDBApiKey();
        if (!apiKey) {
            alert('请先配置TMDB API Key，点击"配置"按钮进行设置');
            return;
        }

        const language = document.getElementById('language-select').value;
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=${language}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    displaySearchResults(data.results);
                } catch (e) {
                    console.error('解析搜索结果失败:', e);
                    alert('搜索失败，请检查网络连接');
                }
            },
            onerror: function() {
                alert('搜索失败，请检查网络连接');
            }
        });
    }

    // 显示搜索结果
    function displaySearchResults(results) {
        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = '';

        if (!results || results.length === 0) {
            resultsDiv.innerHTML = '<p>没有找到相关电影</p>';
            return;
        }

        let selectedItem = null;

        results.slice(0, 5).forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'movie-result';

            // 判断是电影还是剧集
            const isTV = item.media_type === 'tv' || item.name;
            const title = isTV ? item.name : item.title;
            const originalTitle = isTV ? item.original_name : item.original_title;
            const date = isTV ? item.first_air_date : item.release_date;
            const type = isTV ? '剧集' : '电影';

            // 构建显示内容，包含英文标题信息
            let displayTitle = title;
            if (originalTitle && originalTitle !== title) {
                displayTitle = `${title} (${originalTitle})`;
            }

            itemDiv.innerHTML = `
                <div class="movie-title">${displayTitle}</div>
                <div class="movie-info">
                    类型: ${type} | 年份: ${date ? date.split('-')[0] : '未知'} |
                    TMDB ID: ${item.id}
                </div>
            `;

            // 默认选中第一个结果
            if (index === 0) {
                itemDiv.classList.add('selected');
                selectedItem = item;
                // 自动填充第一个结果
                const mediaType = isTV ? 'tv' : 'movie';
                fillTMDBLink(item.id, mediaType);
                getMovieDetails(item.id, item);
            }

            itemDiv.onclick = () => {
                // 清除所有选中状态
                document.querySelectorAll('.movie-result').forEach(el => {
                    el.classList.remove('selected');
                });

                // 选中当前项
                itemDiv.classList.add('selected');
                selectedItem = item;

                // 填充数据
                const mediaType = isTV ? 'tv' : 'movie';
                fillTMDBLink(item.id, mediaType);
                getMovieDetails(item.id, item);
            };

            resultsDiv.appendChild(itemDiv);
        });
    }

    // 填充TMDB链接
    function fillTMDBLink(tmdbId, mediaType) {
        // 根据调试信息，使用精确的选择器
        const tmdbInput = document.querySelector('input[placeholder*="TMDB 全链接"]') ||
                         document.querySelector('input[placeholder*="TMDB"]') ||
                         document.querySelector('input[placeholder*="tmdb"]') ||
                         document.querySelector('#tmdb-id') ||
                         document.querySelector('[data-testid="tmdb-input"]');

        if (tmdbInput) {
            // 根据媒体类型生成对应的TMDB链接
            let tmdbLink;
            if (mediaType === 'tv') {
                tmdbLink = `https://www.themoviedb.org/tv/${tmdbId}`;
            } else {
                tmdbLink = `https://www.themoviedb.org/movie/${tmdbId}`;
            }

            tmdbInput.value = tmdbLink;
            tmdbInput.dispatchEvent(new Event('input', { bubbles: true }));
            tmdbInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('TMDB链接已填充:', tmdbLink);
        } else {
            console.warn('未找到TMDB输入框');
            alert('未找到TMDB输入框，请确保页面已加载完成');
        }
    }

    // 获取电影/剧集详情
    function getMovieDetails(tmdbId, searchResultItem = null) {
        // 保存当前的TMDB ID和媒体类型
        const isTV = searchResultItem && (searchResultItem.media_type === 'tv' || searchResultItem.name);
        currentTmdbId = tmdbId;
        currentMediaType = isTV ? 'tv' : 'movie';
        
        // 如果只有基本搜索结果数据，需要获取详细信息
        if (searchResultItem) {
            const apiKey = getTMDBApiKey();
            if (!apiKey) {
                // 没有API Key时，直接使用搜索结果数据
                fillMovieDetails(searchResultItem);
                return;
            }

            const language = document.getElementById('language-select').value;

            // 判断是电影还是剧集
            const endpoint = isTV ? 'tv' : 'movie';
            const url = `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${apiKey}&language=${language}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // 添加media_type以便后续处理
                        data.media_type = isTV ? 'tv' : 'movie';
                        
                        // 如果是剧集，保存季度信息
                        if (isTV && data.seasons) {
                            currentSeasons = data.seasons;
                            displaySeasons(data.seasons);
                        } else {
                            // 如果是电影，隐藏季度选择区域
                            hideSeasons();
                        }
                        
                        // 检查是否需要获取英文标题（对于日本动漫）
                        if (needsEnglishTitle(data)) {
                            getEnglishTitle(tmdbId, data, endpoint, apiKey);
                        } else {
                            fillMovieDetails(data);
                        }
                    } catch (e) {
                        console.error('获取详情失败:', e);
                        // 如果获取详情失败，使用搜索结果数据
                        fillMovieDetails(searchResultItem);
                        hideSeasons();
                    }
                },
                onerror: function() {
                    console.error('网络错误，使用搜索结果数据');
                    fillMovieDetails(searchResultItem);
                    hideSeasons();
                }
            });
        }
    }

    // 检查是否需要获取英文标题
    function needsEnglishTitle(data) {
        const isTV = data.media_type === 'tv';
        const originalTitle = isTV ? data.original_name : data.original_title;
        const originCountry = isTV ? data.origin_country : data.production_countries;
        
        // 检查是否是日本作品
        let isJapanese = false;
        if (isTV && originCountry && originCountry.includes('JP')) {
            isJapanese = true;
        } else if (!isTV && originCountry && originCountry.some(country => country.iso_3166_1 === 'JP')) {
            isJapanese = true;
        }
        
        // 如果是日本作品且原始标题包含日文字符，则需要获取英文标题
        if (isJapanese && originalTitle && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(originalTitle)) {
            return true;
        }
        
        return false;
    }

    // 显示季度选择器
    function displaySeasons(seasons) {
        const seasonSection = document.querySelector('.season-section');
        const seasonList = document.getElementById('season-list');
        
        if (!seasonSection || !seasonList) {
            console.warn('季度选择区域未找到');
            return;
        }
        
        // 清空季度列表
        seasonList.innerHTML = '';
        
        // 过滤掉特殊季度（如Season 0通常是特典）
        const regularSeasons = seasons.filter(season => season.season_number > 0);
        
        if (regularSeasons.length === 0) {
            seasonSection.style.display = 'none';
            return;
        }
        
        // 显示季度区域
        seasonSection.style.display = 'block';
        
        // 创建季度选项
        regularSeasons.forEach((season, index) => {
            const seasonItem = document.createElement('div');
            seasonItem.className = 'season-item';
            seasonItem.textContent = `第${season.season_number}季 (${season.episode_count || 0}集)`;
            seasonItem.dataset.seasonNumber = season.season_number;
            seasonItem.dataset.seasonId = season.id;
            seasonItem.dataset.episodeCount = season.episode_count || 0;
            seasonItem.dataset.airDate = season.air_date || '';
            
            // 默认选中第一季
            if (index === 0) {
                seasonItem.classList.add('selected');
                fillSeasonInfo(season);
            }
            
            // 点击选择季度
            seasonItem.onclick = () => {
                // 清除所有选中状态
                document.querySelectorAll('.season-item').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // 选中当前季度
                seasonItem.classList.add('selected');
                
                // 填充季度信息
                fillSeasonInfo(season);
            };
            
            seasonList.appendChild(seasonItem);
        });
        
        console.log(`已显示${regularSeasons.length}个季度`);
    }

    // 隐藏季度选择器
    function hideSeasons() {
        const seasonSection = document.querySelector('.season-section');
        if (seasonSection) {
            seasonSection.style.display = 'none';
        }
        currentSeasons = [];
    }

    // 填充季度信息到表单
    function fillSeasonInfo(season) {
        console.log('选择季度:', season);
        
        // 更新TMDB链接为季度链接
        if (currentTmdbId && currentMediaType === 'tv') {
            const tmdbInput = document.querySelector('input[placeholder*="TMDB 全链接"]') ||
                             document.querySelector('input[placeholder*="TMDB"]') ||
                             document.querySelector('input[placeholder*="tmdb"]') ||
                             document.querySelector('#tmdb-id') ||
                             document.querySelector('[data-testid="tmdb-input"]');

            if (tmdbInput) {
                const seasonLink = `https://www.themoviedb.org/tv/${currentTmdbId}/season/${season.season_number}`;
                tmdbInput.value = seasonLink;
                tmdbInput.dispatchEvent(new Event('input', { bubbles: true }));
                tmdbInput.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('TMDB季度链接已填充:', seasonLink);
            }
        }
        
        // 填充季度编号
        const seasonInput = document.querySelector('input[placeholder*="发布季度"]') ||
                           document.querySelector('input[placeholder*="季度"]') ||
                           document.querySelector('input[placeholder*="season"]') ||
                           document.querySelector('input[name*="season"]') ||
                           document.querySelector('input[id*="season"]');
        
        if (seasonInput) {
            seasonInput.value = season.season_number;
            seasonInput.dispatchEvent(new Event('input', { bubbles: true }));
            seasonInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('季度编号已填充:', season.season_number);
        } else {
            console.warn('未找到季度输入框');
        }
        
        // 填充季度年份
        if (season.air_date) {
            const yearInput = document.querySelector('input[placeholder*="影片发行年份"]') ||
                             document.querySelector('input[placeholder*="发布年份"]') ||
                             document.querySelector('input[placeholder*="年份"]') ||
                             document.querySelector('input[placeholder*="year"]');
            if (yearInput) {
                yearInput.value = season.air_date.split('-')[0];
                yearInput.dispatchEvent(new Event('input', { bubbles: true }));
                yearInput.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('季度年份已填充:', season.air_date.split('-')[0]);
            }
        }
    }

    // 获取英文标题
    function getEnglishTitle(tmdbId, data, endpoint, apiKey) {
        // 请求英文版本的详情
        const englishUrl = `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${apiKey}&language=en-US`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: englishUrl,
            onload: function(response) {
                try {
                    const englishData = JSON.parse(response.responseText);
                    const isTV = data.media_type === 'tv';
                    const englishTitle = isTV ? englishData.name : englishData.title;
                    
                    // 将英文标题添加到原始数据中
                    if (englishTitle) {
                        data.english_title = englishTitle;
                        console.log('获取到英文标题:', englishTitle);
                    }
                    
                    fillMovieDetails(data);
                } catch (e) {
                    console.error('获取英文标题失败:', e);
                    // 即使获取英文标题失败，也继续使用原始数据
                    fillMovieDetails(data);
                }
            },
            onerror: function() {
                console.error('获取英文标题网络错误');
                fillMovieDetails(data);
            }
        });
    }

    // 填充电影/剧集详情
    function fillMovieDetails(item) {
        // 判断是电影还是剧集
        const isTV = item.media_type === 'tv' || item.name;
        const title = isTV ? item.name : item.title;
        const originalTitle = isTV ? item.original_name : item.original_title;
        const englishTitle = item.english_title; // 新增的英文标题字段
        const date = isTV ? item.first_air_date : item.release_date;
        const type = isTV ? '剧集' : '电影';

        // 保存中文标题到全局变量（用于青蛙搜索）
        // 优先保存中文标题，如果没有则保存其他可用标题
        if (title && !isEnglishText(title)) {
            // 如果title看起来像中文，保存为中文标题
            currentChineseTitle = title;
        } else if (originalTitle && !isEnglishText(originalTitle)) {
            // 如果原始标题看起来像中文，保存为中文标题
            currentChineseTitle = originalTitle;
        } else {
            // 如果都是英文，保持原有的中文标题（如果有的话）
            // 或者从搜索框获取用户输入的中文标题
            const mainSearchInput = document.getElementById('movie-search');
            if (mainSearchInput && mainSearchInput.value.trim() && !isEnglishText(mainSearchInput.value.trim())) {
                currentChineseTitle = mainSearchInput.value.trim();
            }
        }
        
        console.log('保存的中文标题:', currentChineseTitle);

        // 显示英文标题用于Google搜索
        const googleSearchSection = document.querySelector('.google-search-section');
        const googleSearchInput = document.getElementById('google-search-input');
        
        // 优先级：英文标题 > 原始标题（如果与当前标题不同） > 当前标题
        let searchTitle = '';
        if (englishTitle) {
            // 如果有专门获取的英文标题，优先使用
            searchTitle = englishTitle;
            console.log('使用英文标题:', englishTitle);
        } else if (originalTitle && originalTitle !== title) {
            // 如果有原始标题且与当前标题不同，使用原始标题
            searchTitle = originalTitle;
            console.log('使用原始标题:', originalTitle);
        } else if (title) {
            // 否则使用当前标题
            searchTitle = title;
            console.log('使用当前标题:', title);
        }
        
        if (searchTitle) {
            googleSearchInput.value = searchTitle;
            googleSearchSection.style.display = 'block';
        } else {
            // 如果没有标题信息，隐藏Google搜索区域
            googleSearchSection.style.display = 'none';
        }

        // 首先选择正确的电影/剧集类型
        selectMediaType(isTV);

        // 填充发布年份
        const yearInput = document.querySelector('input[placeholder*="影片发行年份"]') ||
                         document.querySelector('input[placeholder*="发布年份"]') ||
                         document.querySelector('input[placeholder*="年份"]') ||
                         document.querySelector('input[placeholder*="year"]');
        if (yearInput && date) {
            yearInput.value = date.split('-')[0];
            yearInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        console.log(`${type}详情已填充:`, title);
        if (englishTitle) {
            console.log(`英文标题:`, englishTitle);
        }
    }

    // 选择电影/剧集类型
    function selectMediaType(isTV) {
        // 方法1：查找单选按钮
        const movieRadio = document.querySelector('input[type="radio"][value*="电影"]') ||
                          document.querySelector('input[type="radio"][value*="movie"]') ||
                          document.querySelector('input[type="radio"][value="movie"]');

        const tvRadio = document.querySelector('input[type="radio"][value*="剧集"]') ||
                       document.querySelector('input[type="radio"][value*="tv"]') ||
                       document.querySelector('input[type="radio"][value*="series"]') ||
                       document.querySelector('input[type="radio"][value="tv"]');

        if (isTV && tvRadio) {
            tvRadio.checked = true;
            tvRadio.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('已选择剧集类型');
        } else if (!isTV && movieRadio) {
            movieRadio.checked = true;
            movieRadio.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('已选择电影类型');
        }

        // 方法2：查找选择框
        const selectElement = document.querySelector('select') ||
                             document.querySelector('select[name*="type"]') ||
                             document.querySelector('select[name*="类型"]');

        if (selectElement) {
            const options = selectElement.querySelectorAll('option');
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                const value = option.value.toLowerCase();

                if (isTV && (text.includes('剧集') || text.includes('tv') || text.includes('series'))) {
                    selectElement.value = option.value;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('已选择剧集类型（下拉框）');
                } else if (!isTV && (text.includes('电影') || text.includes('movie'))) {
                    selectElement.value = option.value;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('已选择电影类型（下拉框）');
                }
            });
        }

        // 方法3：查找可能的按钮或其他元素
        const mediaTypeElements = document.querySelectorAll('[data-testid*="type"], [class*="type"], [id*="type"]');
        mediaTypeElements.forEach(element => {
            const text = element.textContent;
            if (isTV && text.includes('剧集')) {
                element.click();
                console.log('已点击剧集按钮');
            } else if (!isTV && text.includes('电影')) {
                element.click();
                console.log('已点击电影按钮');
            }
        });
    }

    // 注册右键菜单命令
    GM_registerMenuCommand('配置 TMDB API Key', showConfigDialog);

    // 等待页面加载完成
    function waitForPageLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    // 初始化
    function init() {
        // 等待一段时间确保页面完全加载
        setTimeout(() => {
            createFloatingPanel();
            console.log('TMDB助手已加载 - 右下角位置');
        }, 1000);
    }

    // 启动脚本
    waitForPageLoad();
})();
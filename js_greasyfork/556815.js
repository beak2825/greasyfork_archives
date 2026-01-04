// ==UserScript==
// @name         豆瓣观影/豆列 - 年代筛选 (Douban Year Filter)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在豆瓣“我看过的”、“豆列”及“我的影视”页面添加年代筛选功能。支持自动后台补全缺失年份的电影信息，可记忆选择。
// @author       Gemini & zyt
// @license      MIT
// @icon         https://img9.doubanio.com/favicon.ico
// @match        https://movie.douban.com/people/*/collect*
// @match        https://movie.douban.com/people/*/wish*
// @match        https://movie.douban.com/people/*/do*
// @match        https://movie.douban.com/mine*
// @match        https://www.douban.com/doulist/*
// @grant        GM_xmlhttpRequest
// @connect      movie.douban.com
// @downloadURL https://update.greasyfork.org/scripts/556815/%E8%B1%86%E7%93%A3%E8%A7%82%E5%BD%B1%E8%B1%86%E5%88%97%20-%20%E5%B9%B4%E4%BB%A3%E7%AD%9B%E9%80%89%20%28Douban%20Year%20Filter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556815/%E8%B1%86%E7%93%A3%E8%A7%82%E5%BD%B1%E8%B1%86%E5%88%97%20-%20%E5%B9%B4%E4%BB%A3%E7%AD%9B%E9%80%89%20%28Douban%20Year%20Filter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 缓存前缀
    const CACHE_PREFIX = 'douban_year_cache_';
    const STORAGE_KEY = 'douban_decade_filter_memory';

    // 延迟执行以确保页面加载
    setTimeout(initScript, 500);

    function initScript() {
        // --- 1. 配置与页面检测 ---
        const CONFIG = {
            profile: {
                check: () => location.hostname === 'movie.douban.com',
                item: '.item',
                dateSource: '.intro',
                titleLink: '.title a',
            },
            doulist: {
                check: () => location.hostname === 'www.douban.com' && location.pathname.includes('doulist'),
                item: '.doulist-item',
                dateSource: '.abstract',
                titleLink: '.title a',
            }
        };

        const currentMode = CONFIG.doulist.check() ? 'doulist' : 'profile';
        const cfg = CONFIG[currentMode];

        // --- 2. 智能 UI 插入 ---
        let targetEl = null;
        let insertPosition = 'append';

        // 插入位置策略：按优先级尝试
        const strategies = [
            { sel: '.filter', type: 'append' },      // 列表页筛选栏
            { sel: 'h1', type: 'append' },           // 页面大标题
            { sel: '#db-usr-profile', type: 'append' }, // 个人主页信息栏
            { sel: '.article', type: 'prepend' }     // 页面主体（保底）
        ];
        // 豆列特殊处理
        if (currentMode === 'doulist') strategies.unshift({ sel: '#content h1', type: 'append' });

        for (let s of strategies) {
            const el = document.querySelector(s.sel);
            if (el) {
                targetEl = el;
                insertPosition = s.type;
                break;
            }
        }

        if (!targetEl) return; // 无法插入 UI，静默退出

        // --- 3. 创建下拉框 ---
        const select = document.createElement('select');
        select.style.cssText = `
            display: inline-block !important;
            margin-left: 15px !important;
            padding: 2px 5px !important;
            background-color: #fff !important;
            color: #333 !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            font-size: 13px !important;
            height: 24px !important;
            appearance: menulist !important;
            vertical-align: middle !important;
            z-index: 999 !important;
            cursor: pointer !important;
        `;

        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.text = '全部年代';
        select.appendChild(defaultOption);

        // 读取记忆
        let savedDecade = 'all';
        try { savedDecade = localStorage.getItem(STORAGE_KEY) || 'all'; } catch (e) {}

        // 生成年份选项 (1910s - 2020s)
        for (let y = 2020; y >= 1910; y -= 10) {
            const option = document.createElement('option');
            option.value = y;
            option.text = `${y}s`;
            if (y == savedDecade) option.selected = true;
            select.appendChild(option);
        }

        if (insertPosition === 'prepend') targetEl.prepend(select);
        else targetEl.appendChild(select);

        // --- 4. 辅助函数 ---
        function getSubjectId(url) {
            return url?.match(/subject\/(\d+)/)?.[1];
        }

        // --- 5. 核心筛选逻辑 ---
        function filterMovies(selectedDecade) {
            const items = document.querySelectorAll(cfg.item);

            items.forEach(item => {
                // "全部年代"模式：直接显示
                if (selectedDecade === 'all') {
                    item.style.display = '';
                    return;
                }

                let year = null;
                const titleLink = item.querySelector(cfg.titleLink);

                // A. 尝试从当前页面 DOM 获取 (简介 / 标题文本 / Title属性)
                const infoEl = item.querySelector(cfg.dateSource);
                if (infoEl && infoEl.innerText.match(/(19|20)\d{2}/)) {
                    year = parseInt(infoEl.innerText.match(/(19|20)\d{2}/)[0]);
                }

                if (!year && titleLink) {
                     const match = titleLink.innerText.match(/[\(\（]((19|20)\d{2})[\)\）]/) ||
                                   titleLink.getAttribute('title')?.match(/(19|20)\d{2}/);
                     if (match) year = parseInt(match[1] || match[0]);
                }

                // B. 尝试从 LocalStorage 缓存获取
                const subjectId = getSubjectId(titleLink?.href);
                if (!year && subjectId) {
                    const cached = localStorage.getItem(CACHE_PREFIX + subjectId);
                    if (cached) year = parseInt(cached);
                }

                // C. 判断与显示
                if (year) {
                    const start = parseInt(selectedDecade);
                    // 核心筛选判定
                    if (year < start || year > start + 9) {
                        item.style.display = 'none';
                    } else {
                        item.style.display = '';
                        item.style.animation = ''; // 清除淡入动画
                    }
                } else {
                    // D. 确实找不到 -> 隐藏并后台抓取
                    item.style.display = 'none'; // 先隐藏，防止错误显示
                    if (titleLink) {
                        fetchYearBackground(item, titleLink.href, (fetchedYear) => {
                            const start = parseInt(selectedDecade);
                            if (fetchedYear >= start && fetchedYear <= start + 9) {
                                item.style.display = '';
                                item.style.animation = 'fadeIn 0.5s'; // 只有新抓取的才有淡入效果
                            }
                        });
                    }
                }
            });
        }

        // --- 6. 后台抓取逻辑 (增强版解析) ---
        function fetchYearBackground(item, url, callback) {
            // 防止重复请求同一个DOM元素
            if (item.dataset.fetching === 'true') return;
            item.dataset.fetching = 'true';

            const subjectId = getSubjectId(url);

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    let year = null;

                    // 策略1: 详情页 h1 里的 class="year" (最准确)
                    const yearSpan = doc.querySelector('h1 .year');
                    if (yearSpan && yearSpan.innerText.match(/\d{4}/)) {
                        year = yearSpan.innerText.match(/\d{4}/)[0];
                    }

                    // 策略2: 上映日期元数据 (structured data)
                    if (!year) {
                        const dateSpan = doc.querySelector('[property="v:initialReleaseDate"]');
                        if (dateSpan && dateSpan.innerText.match(/\d{4}/)) {
                            year = dateSpan.innerText.match(/\d{4}/)[0];
                        }
                    }

                    // 策略3: 网页标题 (Title Fallback)
                    if (!year) {
                        const match = doc.title.match(/[\(\（]((19|20)\d{2})[\)\）]/);
                        if (match) year = match[1];
                    }

                    if (year) {
                        if (subjectId) localStorage.setItem(CACHE_PREFIX + subjectId, year);
                        callback(parseInt(year));
                    } else {
                        // 彻底找不到，存入0防止反复请求
                        if (subjectId) localStorage.setItem(CACHE_PREFIX + subjectId, '0');
                    }
                    item.dataset.fetching = 'false';
                },
                onerror: function() {
                    item.dataset.fetching = 'false';
                }
            });
        }

        // 注入淡入动画样式
        const style = document.createElement('style');
        style.innerHTML = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
        document.head.appendChild(style);

        // 事件监听
        select.addEventListener('change', function() {
            localStorage.setItem(STORAGE_KEY, this.value);
            filterMovies(this.value);
        });

        // 初始化运行
        if (savedDecade !== 'all') {
            // 稍微延迟以等待 DOM 稳定
            setTimeout(() => filterMovies(savedDecade), 100);
        }
    }
})();
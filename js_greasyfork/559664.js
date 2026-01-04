// ==UserScript==
// @name         发种统计
// @namespace    Torrent Upload Count
// @version      1.1.2
// @description  在 NexusPHP 用户详情页统计今日、本周、本月及累计发种数量.
// @author       guyuanwind
// @match        *://*/userdetails.php?id=*
// @icon         https://obsidian-gy.oss-cn-beijing.aliyuncs.com/img/懒大王.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559664/%E5%8F%91%E7%A7%8D%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/559664/%E5%8F%91%E7%A7%8D%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const CONFIG = {
        uploadContainerIds: ['ka', 'ka1', 'torrents-list'],
        torrentTableSelector: 'table[border="1"]',
        rowSelector: 'tbody > tr',
        dateColIndex: 2,
        paginationSelector: '.nexus-pagination a, p[align="center"] a, font.gray',
    };

    // --- 全局状态管理 ---
    const GlobalStats = {
        counts: { today: 0, week: 0, month: 0 },
        total: "...",
        statusText: "准备就绪",
        isCalculating: false,
        hasCalculated: false
    };

    // --- 日志工具 ---
    const Logger = {
        info: (msg) => console.log(`%c[NexusStats] 🟢 ${msg}`, 'color: #10b981; font-weight: bold;'),
        warn: (msg) => console.log(`%c[NexusStats] 🟡 ${msg}`, 'color: #f59e0b; font-weight: bold;'),
        error: (msg) => console.log(`%c[NexusStats] 🔴 ${msg}`, 'color: #ef4444; font-weight: bold;'),
        debug: (msg) => console.log(`%c[NexusStats] 🔧 ${msg}`, 'color: #6b7280;')
    };

    // --- 样式注入 ---
    GM_addStyle(`
        :root {
            --stat-theme-color: #0369a1;
            --stat-bg-start: #f0f9ff;
            --stat-bg-end: #e0f2fe;
            --stat-border: #bae6fd;
            --stat-label: #64748b;
        }
        #upload-stats-bar {
            padding: 10px;
            margin: 10px 0;
            background: linear-gradient(90deg, var(--stat-bg-start) 0%, var(--stat-bg-end) 100%);
            border: 1px solid var(--stat-border);
            border-radius: 6px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .stat-label {
            font-size: 12px;
            color: var(--stat-label);
            margin-bottom: 4px;
            opacity: 0.85;
        }
        .stat-value {
            font-weight: bold;
            font-size: 18px;
            color: var(--stat-theme-color);
        }
        .stat-status-text {
            font-size: 11px;
            color: var(--stat-theme-color);
            opacity: 0.7;
            margin-top: 2px;
            font-weight: normal;
        }
        .stat-loading {
            opacity: 0.6;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
    `);

    // --- 颜色适配逻辑 ---
    function adjustOpacity(colorStr, opacity) {
        if (!colorStr) return `rgba(128,128,128,${opacity})`;
        const matches = colorStr.match(/\d+/g);
        if (matches && matches.length >= 3) {
            return `rgba(${matches[0]}, ${matches[1]}, ${matches[2]}, ${opacity})`;
        }
        if (colorStr.startsWith('#')) {
            let r=0, g=0, b=0;
            if (colorStr.length === 4) {
                r = parseInt(colorStr[1]+colorStr[1], 16);
                g = parseInt(colorStr[2]+colorStr[2], 16);
                b = parseInt(colorStr[3]+colorStr[3], 16);
            } else if (colorStr.length === 7) {
                r = parseInt(colorStr.substring(1,3), 16);
                g = parseInt(colorStr.substring(3,5), 16);
                b = parseInt(colorStr.substring(5,7), 16);
            }
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return colorStr;
    }

    function applyDynamicTheme() {
        const bodyEl = document.body;
        const headerEl = document.querySelector('td.colhead, th, .thead, .column_head');
        const linkEl = document.querySelector('a');

        if (!bodyEl) return;
        const bodyStyle = window.getComputedStyle(bodyEl);

        let themeColor = '#0369a1';
        if (headerEl) {
            const bg = window.getComputedStyle(headerEl).backgroundColor;
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== 'rgb(255, 255, 255)') {
                themeColor = bg;
            } else if (linkEl) {
                themeColor = window.getComputedStyle(linkEl).color;
            }
        } else if (linkEl) {
            themeColor = window.getComputedStyle(linkEl).color;
        }

        let isDarkMode = false;
        const bodyBg = bodyStyle.backgroundColor;
        if (bodyBg.startsWith('rgb')) {
             const rgb = bodyBg.match(/\d+/g);
             if (rgb && (parseInt(rgb[0])*0.299 + parseInt(rgb[1])*0.587 + parseInt(rgb[2])*0.114) < 128) {
                 isDarkMode = true;
             }
        }

        let bgStart, bgEnd, borderCol, labelCol;
        if (isDarkMode) {
            bgStart = adjustOpacity(themeColor, 0.15);
            bgEnd = adjustOpacity(themeColor, 0.25);
            borderCol = adjustOpacity(themeColor, 0.4);
            labelCol = bodyStyle.color;
        } else {
            bgStart = adjustOpacity(themeColor, 0.04);
            bgEnd = adjustOpacity(themeColor, 0.12);
            borderCol = adjustOpacity(themeColor, 0.25);
            labelCol = bodyStyle.color;
        }

        const root = document.documentElement;
        root.style.setProperty('--stat-theme-color', themeColor);
        root.style.setProperty('--stat-bg-start', bgStart);
        root.style.setProperty('--stat-bg-end', bgEnd);
        root.style.setProperty('--stat-border', borderCol);
        root.style.setProperty('--stat-label', labelCol);
    }

    // --- 日期处理 ---
    function parseDate(cellElement) {
        if (!cellElement) return null;
        let htmlContent = cellElement.innerHTML;
        let dateStr = htmlContent.replace(/<br\s*\/?>/gi, ' ').replace(/&nbsp;/g, ' ').trim();
        const match = dateStr.match(/(\d{4}-\d{2}-\d{2})/);
        if (match) {
             let timePart = '';
             if (dateStr.includes(':')) {
                 const parts = dateStr.split(' ');
                 if (parts.length > 1) timePart = ' ' + parts.pop();
             }
             const date = new Date(match[1] + timePart);
             if (!isNaN(date.getTime())) return date;
        }
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) return date;
        return null;
    }

    // --- 时间边界 (改回本月) ---
    function getTimeBoundaries() {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 本周
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(now.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0);

        // 本月 (回归标准)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return { startOfToday, startOfWeek, startOfMonth };
    }

    // --- UI 渲染 ---
    function renderStatsBar(container) {
        if (!container) return;

        let bar = document.getElementById('upload-stats-bar');

        if (!bar) {
            Logger.debug("创建统计栏 UI");
            applyDynamicTheme();
            bar = document.createElement('div');
            bar.id = 'upload-stats-bar';
            // 标签改回 "本月发种"
            bar.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">今日发种</span>
                    <span id="stat-today" class="stat-value stat-loading">...</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">本周发种</span>
                    <span id="stat-week" class="stat-value stat-loading">...</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">本月发种</span>
                    <span id="stat-month" class="stat-value stat-loading">...</span>
                    <span id="stat-status" class="stat-status-text"></span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">累计发种</span>
                    <span id="stat-total" class="stat-value">...</span>
                </div>
            `;
            container.insertBefore(bar, container.firstChild);
        }

        const todayEl = document.getElementById('stat-today');
        const weekEl = document.getElementById('stat-week');
        const monthEl = document.getElementById('stat-month');
        const totalEl = document.getElementById('stat-total');
        const statusEl = document.getElementById('stat-status');
        const loaders = document.querySelectorAll('.stat-loading');

        if (GlobalStats.counts.today !== "..." || GlobalStats.hasCalculated) {
            todayEl.innerText = GlobalStats.counts.today;
            weekEl.innerText = GlobalStats.counts.week;
            monthEl.innerText = GlobalStats.counts.month;
            totalEl.innerText = GlobalStats.total;

            if (!GlobalStats.isCalculating) {
                loaders.forEach(el => el.classList.remove('stat-loading'));
            }
        }

        if (GlobalStats.isCalculating) {
            statusEl.innerText = GlobalStats.statusText;
        } else {
            statusEl.innerText = "";
        }
    }

    // --- URL 获取逻辑 ---
    function getUrlTemplate(container) {
        const urlParams = new URLSearchParams(window.location.search);
        const currentId = urlParams.get('id');

        if (currentId) {
            const apiUrl = `getusertorrentlistajax.php?userid=${currentId}&type=uploaded&status=-1&page={page}`;
            Logger.debug(`构造 API URL 模板: ${apiUrl}`);
            return apiUrl;
        }

        const links = container.querySelectorAll(CONFIG.paginationSelector);
        for (let link of links) {
            const href = link.getAttribute('href');
            if (href && href.includes('page=') && href.includes('ajax')) {
                 const extracted = href.replace(/page=\d+/, 'page={page}');
                 Logger.debug(`提取分页 URL 模板: ${extracted}`);
                 return extracted;
            }
        }

        Logger.warn("未找到有效的分页 API 模板");
        return null;
    }

    // --- 核心统计逻辑 ---
    async function runCalculation(container) {
        if (GlobalStats.isCalculating || GlobalStats.hasCalculated) {
            return;
        }

        GlobalStats.isCalculating = true;
        Logger.info("=== 开始发种统计流程 (本月版) ===");

        const headerText = container.innerText;
        const totalMatch = headerText.match(/(\d+)\s*(?:条|條|个)/);
        if (totalMatch) {
            GlobalStats.total = parseInt(totalMatch[1]);
        } else {
            GlobalStats.total = "未知";
        }
        renderStatsBar(container);

        const { startOfToday, startOfWeek, startOfMonth } = getTimeBoundaries();
        Logger.debug(`统计截止日期 (本月1号): ${startOfMonth.toLocaleDateString()}`);

        let counts = { today: 0, week: 0, month: 0 };
        let currentPage = 0;
        let keepFetching = true;
        let hasFoundAnyDate = false;
        let urlTemplate = getUrlTemplate(container);

        if (!urlTemplate && GlobalStats.total > 50) {
            Logger.warn("无法翻页，仅统计第一页");
        }

        while (keepFetching) {
            let pageRows = [];
            GlobalStats.statusText = `正在分析第 ${currentPage + 1} 页...`;
            renderStatsBar(container);

            if (currentPage === 0) {
                let rows = container.querySelectorAll(`${CONFIG.torrentTableSelector} ${CONFIG.rowSelector}`);
                pageRows = Array.from(rows).slice(1);
            } else {
                if (!urlTemplate) {
                    keepFetching = false;
                    break;
                }

                const nextUrl = urlTemplate.replace('{page}', currentPage);
                try {
                    const html = await fetchPage(nextUrl);
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    let fetchedContainer = null;
                    for (const id of CONFIG.uploadContainerIds) {
                        const el = doc.getElementById(id);
                        if (el && el.querySelector(CONFIG.torrentTableSelector)) {
                            fetchedContainer = el;
                            break;
                        }
                    }
                    if(!fetchedContainer) fetchedContainer = doc;
                    const fetchedRows = fetchedContainer.querySelectorAll(`${CONFIG.torrentTableSelector} ${CONFIG.rowSelector}`);
                    pageRows = Array.from(fetchedRows).slice(1);
                } catch (e) {
                    Logger.error(`翻页失败: ${e}`);
                    break;
                }
            }

            if (pageRows.length === 0) {
                keepFetching = false;
                break;
            }

            let foundOldDate = false;

            for (let tr of pageRows) {
                const tds = tr.querySelectorAll('td');
                if (tds.length <= CONFIG.dateColIndex) continue;

                const dateCell = tds[CONFIG.dateColIndex];
                const date = parseDate(dateCell);

                if (!date) continue;
                hasFoundAnyDate = true;

                if (date >= startOfToday) counts.today++;
                if (date >= startOfWeek) counts.week++;

                // *** 统计本月 ***
                if (date >= startOfMonth) {
                    counts.month++;
                } else {
                    Logger.info(`发现早于本月的数据 (${date.toLocaleDateString()})，停止翻页`);
                    foundOldDate = true;
                    keepFetching = false;
                }
            }

            GlobalStats.counts = { ...counts };
            if (hasFoundAnyDate) renderStatsBar(container);

            if (!foundOldDate) {
                currentPage++;
                if (currentPage > 50) {
                    keepFetching = false;
                }
            }
        }

        GlobalStats.isCalculating = false;
        GlobalStats.hasCalculated = true;

        if (!hasFoundAnyDate) {
             GlobalStats.counts = { today: "未知", week: "未知", month: "未知" };
        }

        Logger.info(`结果: 今日 ${GlobalStats.counts.today}, 本周 ${GlobalStats.counts.week}, 本月 ${GlobalStats.counts.month}`);
        renderStatsBar(container);
    }

    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) { resolve(response.responseText); },
                onerror: function(error) { reject(error); }
            });
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (const id of CONFIG.uploadContainerIds) {
             const el = document.getElementById(id);
             if (el && el.querySelector(CONFIG.torrentTableSelector)) {
                 if (!document.getElementById('upload-stats-bar')) {
                     renderStatsBar(el);
                 }
                 if (!GlobalStats.hasCalculated && !GlobalStats.isCalculating) {
                     runCalculation(el);
                 }
             }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
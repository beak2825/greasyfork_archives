// ==UserScript==
// @name         Steam鉴赏家后台已接受游戏页面功能增强
// @namespace    https://steamcommunity.com/
// @version      1.1
// @description  在Steam鉴赏家后台的已接受游戏页面增加排序、筛选和搜索功能
// @author       sjx01
// @include      *://store.steampowered.com/curator/*/admin/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550962/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%B7%B2%E6%8E%A5%E5%8F%97%E6%B8%B8%E6%88%8F%E9%A1%B5%E9%9D%A2%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550962/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E5%90%8E%E5%8F%B0%E5%B7%B2%E6%8E%A5%E5%8F%97%E6%B8%B8%E6%88%8F%E9%A1%B5%E9%9D%A2%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. 配置与常量 ===
    const STORAGE_KEY = 'steam_curator_v1_1_config';
    const SELECTORS = {
        contentWrapper: '#curator_admin_content',
        gameContainer: '#apps_all',
        gameItem: '.app_ctn.app_block',
        injectPoint: '.pending_games'
    };

    const STYLES = `
        .sce-panel {
            background: #101822;
            padding: 12px 16px;
            margin-bottom: 20px;
            border: 1px solid #2a475e;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 13px;
            color: #c7d5e0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .sce-row {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
        }
        .sce-group {
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(0,0,0,0.2);
            padding: 4px 8px;
            border-radius: 4px;
        }
        .sce-label {
            color: #67c1f5;
            font-weight: bold;
            font-size: 12px;
            white-space: nowrap;
        }
        .sce-control {
            background: #2a3f5a;
            color: #ffffff;
            border: 1px solid #425c75;
            padding: 4px 24px 4px 8px; /* 给箭头的预留空间 */
            border-radius: 2px;
            outline: none;
            font-size: 12px;
            height: 28px;
            transition: all 0.2s;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2367c1f5%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 8px top 50%;
            background-size: 10px auto;
        }
        .sce-control:focus { border-color: #67c1f5; background-color: #395270; }
        .sce-control:hover { border-color: #557390; }

        input.sce-control {
            background-image: none;
            padding-right: 8px;
            min-width: 240px;
        }

        .sce-btn {
            padding: 0 16px;
            border-radius: 2px;
            border: none;
            cursor: pointer;
            color: white;
            font-size: 12px;
            height: 28px;
            line-height: 28px;
            font-weight: 500;
        }
        .sce-btn-reset { background: #3d4450; transition: background 0.2s; }
        .sce-btn-reset:hover { background: #d9534f; } /* Reset 变红警示 */

        .sce-stats { margin-left: auto; color: #8f98a0; font-size: 12px; }
        .sce-stats b { color: #fff; }
        mark.sce-hl { background: rgba(255, 235, 59, 0.15); color: #ffeb3b; padding: 0 2px; }
    `;

    // === 2. 状态管理 ===
    const defaultState = {
        search: '',
        sortField: 'reviewDate',
        sortOrder: 'desc',
        filterAcceptor: 'all',
        filterYear: 'all',
        filterMonth: 'all',
        filterStatus: 'all'
    };

    let state = { ...defaultState };
    let gameData = [];
    let metaData = { acceptors: new Set(), years: new Set() };
    const zhCollator = new Intl.Collator('zh-CN');

    // === 3. 主程序入口 ===
    function main() {
        injectStyle();
        checkAndInit();
        // SPA 监听器
        const observer = new MutationObserver(debounce(() => checkAndInit(), 200));
        const targetNode = document.querySelector(SELECTORS.contentWrapper) || document.body;
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    function checkAndInit() {
        if (!window.location.href.includes('/admin/accepted')) return;
        const container = document.querySelector(SELECTORS.gameContainer);
        if (!container || document.getElementById('sce-panel')) return;

        loadConfig();
        parseData();
        renderUI();
        applyLogic();
    }

    // === 4. 数据解析 ===
    function parseData() {
        const els = document.querySelectorAll(SELECTORS.gameItem);
        gameData = [];
        metaData.acceptors.clear();
        metaData.years.clear();

        els.forEach((el, index) => {
            const name = el.querySelector('.app_name')?.textContent.trim() || '';
            const nameCtn = el.querySelector('.app_name_ctn')?.textContent || '';

            // 解析评测日期
            let reviewDate = null;
            const reviewMatch = nameCtn.match(/已于\s*(.+?)\s*评测/);
            if (reviewMatch) reviewDate = parseSmartDate(reviewMatch[1]);

            // 是否已评测
            const isReviewed = !!reviewDate;

            // 解析接受人
            const acceptors = [];
            const acceptDates = [];
            el.querySelectorAll('.accepted_list > div').forEach(row => {
                const pName = row.querySelector('.action_head')?.textContent.trim();
                const pDateStr = row.querySelector('.action_date')?.textContent.trim();
                if (pName) { acceptors.push(pName); metaData.acceptors.add(pName); }
                if (pDateStr) {
                    const d = parseSmartDate(pDateStr);
                    if (d) acceptDates.push(d);
                }
            });

            // 时间相关元数据
            acceptDates.sort((a,b) => a - b);
            const firstAcceptDate = acceptDates[0] || null;
            const lastAcceptDate = acceptDates[acceptDates.length - 1] || null;

            // 年份/月份提取 (优先取评测日期，其次取接受日期)
            const dateForMeta = reviewDate || lastAcceptDate;
            const year = dateForMeta ? dateForMeta.getFullYear() : 0;
            const month = dateForMeta ? dateForMeta.getMonth() + 1 : 0;

            if (year > 0) metaData.years.add(year);

            gameData.push({
                el, id: el.id, name,
                searchText: (name + ' ' + acceptors.join(' ')).toLowerCase(),
                reviewDate, isReviewed,
                firstAcceptDate, lastAcceptDate,
                acceptors, year, month,
                originalIndex: index
            });
        });
    }

    function parseSmartDate(str) {
        if (!str) return null;
        const now = new Date();
        const fullMatch = str.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
        if (fullMatch) return new Date(fullMatch[1], fullMatch[2] - 1, fullMatch[3]);
        const shortMatch = str.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
        if (shortMatch) return new Date(now.getFullYear(), shortMatch[1] - 1, shortMatch[2]);
        return null;
    }

    // === 5. UI 渲染 ===
    function renderUI() {
        const panel = document.createElement('div');
        panel.id = 'sce-panel';
        panel.className = 'sce-panel';

        const acceptorOpts = Array.from(metaData.acceptors).sort(zhCollator.compare)
            .map(a => `<option value="${a}">${a}</option>`).join('');

        const yearOpts = Array.from(metaData.years).sort((a,b) => b-a)
            .map(y => `<option value="${y}">${y} 年</option>`).join('');

        // 月份选项 (1-12)
        const monthOpts = Array.from({length: 12}, (_, i) => i + 1)
            .map(m => `<option value="${m}">${m} 月</option>`).join('');

        panel.innerHTML = `
            <div class="sce-row">
                <div class="sce-group">
                    <span class="sce-label">排序</span>
                    <select id="sce-sort" class="sce-control">
                        <option value="reviewDate">评测日期 (智能)</option>
                        <option value="firstAcceptDate">最初接受日期</option>
                        <option value="lastAcceptDate">最终接受日期</option>
                        <option value="name">游戏名称</option>
                    </select>
                    <select id="sce-order" class="sce-control" style="width:80px">
                        <option value="desc">降序</option>
                        <option value="asc">升序</option>
                    </select>
                </div>

                <div class="sce-group">
                    <span class="sce-label">筛选</span>

                    <select id="sce-filter-status" class="sce-control" style="width: 100px;">
                        <option value="all">所有状态</option>
                        <option value="reviewed">已评测</option>
                        <option value="unreviewed">未评测</option>
                    </select>

                    <select id="sce-filter-acceptor" class="sce-control" style="max-width: 140px;">
                        <option value="all">所有接受人</option>
                        ${acceptorOpts}
                    </select>

                    <select id="sce-filter-year" class="sce-control" style="width: 90px;">
                        <option value="all">所有年份</option>
                        ${yearOpts}
                    </select>
                     <select id="sce-filter-month" class="sce-control" style="width: 80px;">
                        <option value="all">所有月份</option>
                        ${monthOpts}
                    </select>
                </div>

                <div style="flex-grow: 1;"></div>
                <button id="sce-reset" class="sce-btn sce-btn-reset">重置所有</button>
            </div>

            <div class="sce-row">
                <div style="flex-grow: 1; position:relative;">
                    <input type="text" id="sce-search" class="sce-control" placeholder="搜索游戏名、接受人..." value="${state.search}" style="width: 100%; box-sizing: border-box;">
                </div>
                <div class="sce-stats" id="sce-stats"></div>
            </div>
        `;

        const target = document.querySelector(SELECTORS.injectPoint);
        const ref = target.querySelector('.app_filter') || target.querySelector(SELECTORS.gameContainer);
        target.insertBefore(panel, ref);

        // 隐藏原生筛选器
        const nativeFilter = document.querySelector('.app_filter');
        if (nativeFilter) nativeFilter.style.display = 'none';

        bindEvents();
        updateUIState();
    }

    function bindEvents() {
        const ids = ['sort', 'order', 'filter-status', 'filter-acceptor', 'filter-year', 'filter-month', 'search', 'reset'];
        const els = {};
        ids.forEach(id => els[id] = document.getElementById(`sce-${id}`));

        const handleChange = () => {
            state.sortField = els['sort'].value;
            state.sortOrder = els['order'].value;
            state.filterStatus = els['filter-status'].value;
            state.filterAcceptor = els['filter-acceptor'].value;
            state.filterYear = els['filter-year'].value === 'all' ? 'all' : parseInt(els['filter-year'].value);
            state.filterMonth = els['filter-month'].value === 'all' ? 'all' : parseInt(els['filter-month'].value);
            saveConfig();
            applyLogic();
        };

        els['sort'].addEventListener('change', (e) => {
            if (e.target.value === 'name') els['order'].value = 'asc';
            else els['order'].value = 'desc';
            handleChange();
        });

        ['order', 'filter-status', 'filter-acceptor', 'filter-year', 'filter-month'].forEach(id => {
            els[id].addEventListener('change', handleChange);
        });

        els['search'].addEventListener('input', debounce((e) => {
            state.search = e.target.value.toLowerCase();
            saveConfig();
            applyLogic();
        }, 300));

        els['reset'].addEventListener('click', () => {
            state = { ...defaultState };
            updateUIState();
            saveConfig();
            applyLogic();
        });
    }

    function updateUIState() {
        const el = (id) => document.getElementById(`sce-${id}`);
        if (!el('sort')) return;

        el('sort').value = state.sortField;
        el('order').value = state.sortOrder;
        el('filter-status').value = state.filterStatus;
        el('filter-acceptor').value = state.filterAcceptor;
        el('filter-year').value = state.filterYear;
        el('filter-month').value = state.filterMonth;
        el('search').value = state.search;
    }

    // === 6. 核心逻辑（筛选与排序） ===
    function applyLogic() {
        const { search, sortField, sortOrder, filterAcceptor, filterYear, filterMonth, filterStatus } = state;

        // --- 筛选阶段 ---
        const filtered = gameData.filter(g => {
            // 文本搜索
            if (search && !g.searchText.includes(search)) return false;
            // 状态筛选
            if (filterStatus === 'reviewed' && !g.isReviewed) return false;
            if (filterStatus === 'unreviewed' && g.isReviewed) return false;
            // 接受人
            if (filterAcceptor !== 'all' && !g.acceptors.includes(filterAcceptor)) return false;
            // 年份
            if (filterYear !== 'all' && g.year !== filterYear) return false;
            // 月份)
            if (filterMonth !== 'all' && g.month !== filterMonth) return false;

            return true;
        });

        // --- 排序阶段 ---
        filtered.sort((a, b) => {
            // 特殊逻辑：当按评测日期排序时，强制让未评测的排在最后
            if (sortField === 'reviewDate') {
                if (a.isReviewed && !b.isReviewed) return -1; // A有日期，B无 -> A前
                if (!a.isReviewed && b.isReviewed) return 1;  // A无日期，B有 -> B前
                if (!a.isReviewed && !b.isReviewed) return a.originalIndex - b.originalIndex; // 都无日期 -> 保持原序
                // 如果都有日期，往下走进行正常比较
            }

            let res = 0;
            const vA = a[sortField];
            const vB = b[sortField];

            if (sortField === 'name') {
                res = zhCollator.compare(vA, vB);
            } else {
                // 普通日期比较
                if (!vA && !vB) res = a.originalIndex - b.originalIndex;
                else if (!vA) res = 1;
                else if (!vB) res = -1;
                else res = vA - vB;
            }
            return sortOrder === 'desc' ? -res : res;
        });

        // --- 渲染 DOM ---
        const container = document.querySelector(SELECTORS.gameContainer);
        const fragment = document.createDocumentFragment();

        filtered.forEach(g => {
            g.el.style.display = '';
            highlight(g.el, search);
            fragment.appendChild(g.el);
        });

        document.getElementById('sce-stats').innerHTML = `显示 <b>${filtered.length}</b> / ${gameData.length} 个`;
        container.innerHTML = '';
        container.appendChild(fragment);
    }

    // === 7. 工具函数 ===
    function highlight(root, term) {
        root.querySelectorAll('mark.sce-hl').forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
        if (!term) return;
        const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        let n;
        while(n = walk.nextNode()) {
            if (n.nodeValue.toLowerCase().includes(term) && n.parentNode.tagName !== 'MARK' && n.parentNode.tagName !== 'SCRIPT') nodes.push(n);
        }
        nodes.forEach(node => {
            const span = document.createElement('span');
            const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            span.innerHTML = node.nodeValue.replace(regex, '<mark class="sce-hl">$1</mark>');
            node.replaceWith(...span.childNodes);
        });
    }

    function injectStyle() {
        if (document.getElementById('sce-style')) return;
        const style = document.createElement('style');
        style.id = 'sce-style';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    function debounce(fn, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function saveConfig() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    function loadConfig() {
        try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (saved) state = { ...defaultState, ...saved }; } catch(e) {}
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
    else main();

})();

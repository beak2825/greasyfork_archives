// ==UserScript==
// @name         吾爱美化脚本 (Modern 52Pojie)
// @namespace    http://tampermonkey.net/
// @version      1.29
// @description  移除旧版Discuz布局，使用现代化卡片式UI重构吾爱破解论坛首页及搜索页，支持自定义板块顺序和布局
// @author       yagizaMJ
// @license      yagizaMJ
// @match        https://www.52pojie.cn/
// @match        https://www.52pojie.cn/forum.php
// @match        https://www.52pojie.cn/forum.php?*
// @match        https://www.52pojie.cn/forum-*.html
// @match        https://www.52pojie.cn/thread-*.html
// @match        https://www.52pojie.cn/search.php?*
// @icon         https://www.52pojie.cn/favicon.svg
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/564205/%E5%90%BE%E7%88%B1%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC%20%28Modern%2052Pojie%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564205/%E5%90%BE%E7%88%B1%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC%20%28Modern%2052Pojie%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // 0. 开关控制 (Menu Toggle)
    // =================================================================

    const isModernEnabled = GM_getValue('modern_layout_enabled', true);
    GM_registerMenuCommand(
        isModernEnabled ? "🀄 切换到：旧版布局 (Legacy)" : "🀄 切换到：新版布局 (Modern)",
        () => {
            GM_setValue('modern_layout_enabled', !isModernEnabled);
            location.reload();
        }
    );
    if (!isModernEnabled) return;

    // =================================================================
    // 1. 初始化与路由判断
    // =================================================================

    const path = location.pathname;
    const search = location.search;

    const isHomePage = (path === '/' || path === '/forum.php') && !search;
    const isSearchPage = path.includes('search.php');
    const isForumPage = path.includes('forum-') || (path.includes('forum.php') && search.includes('mod=forumdisplay'));
    const isThreadPage = path.includes('thread-') || search.includes('mod=viewthread');

    if (!isHomePage && !isSearchPage && !isForumPage && !isThreadPage) return;

    // =================================================================
    // 2. 默认配置管理
    // =================================================================

    const DEFAULT_LAYOUT = [
        { id: 'search', title: '搜索栏', visible: true, type: 'full' },
        { id: 'stats', title: '统计信息', visible: true, type: 'full' },
        { id: 'fresh', title: '新鲜出炉', visible: true, type: 'half' },
        { id: 'hot', title: '人气热门', visible: true, type: 'half' },
        { id: 'tech', title: '技术分享', visible: true, type: 'half' },
        { id: 'digest', title: '精华采撷', visible: true, type: 'half' },
        { id: 'board', title: '板块分区', visible: true, type: 'full' }
    ];

    function loadLayoutConfig() {
        const stored = localStorage.getItem('m52_layout_config');
        if (!stored) return DEFAULT_LAYOUT;
        try {
            let saved = JSON.parse(stored);
            DEFAULT_LAYOUT.forEach(defItem => {
                if (!saved.find(s => s.id === defItem.id)) saved.push(defItem);
            });
            return saved.filter(s => DEFAULT_LAYOUT.find(d => d.id === s.id));
        } catch (e) { return DEFAULT_LAYOUT; }
    }

    function saveLayoutConfig(config) {
        localStorage.setItem('m52_layout_config', JSON.stringify(config));
    }

    function loadCategoryOrder() {
        const stored = localStorage.getItem('m52_category_order');
        return stored ? JSON.parse(stored) : [];
    }
    function saveCategoryOrder(order) {
        localStorage.setItem('m52_category_order', JSON.stringify(order));
    }

    function saveUserInfo(user) {
        if(user && user.name) {
            localStorage.setItem('m52_user_info', JSON.stringify(user));
        }
    }
    function loadUserInfo() {
        const stored = localStorage.getItem('m52_user_info');
        return stored ? JSON.parse(stored) : { name: '', link: '', avatar: '' };
    }

    let currentLayout = loadLayoutConfig();
    let currentCategoryOrder = loadCategoryOrder();
    let isEditMode = false;
    let sortableInstances = [];

    // =================================================================
    // 3. 全局 CSS
    // =================================================================

    const css = `
        :root {
            --primary-color: #d32f2f;
            --hot-color: #ff9800;
            --tech-color: #1976d2;
            --digest-color: #388e3c;
            --bg-color: #f5f7fa;
            --card-bg: #ffffff;
            --text-main: #2c3e50;
            --text-sub: #7f8c8d;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --radius: 12px;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: var(--text-main);
            line-height: 1.6;
        }
        body > div:not(#modern-app):not(#m-settings-modal):not(#append_parent):not(#ajaxwaitid), body > table, body > ul {
            display: none !important;
        }

        a { text-decoration: none; color: inherit; transition: 0.2s; }
        a:hover { color: var(--primary-color); }

        #modern-app {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        #modern-app.loaded { opacity: 1; }

        /* Navbar */
        .m-navbar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 0 2rem;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .m-logo { font-size: 1.4rem; font-weight: bold; color: var(--primary-color); display: flex; align-items: center; gap: 10px; }
        .m-logo img { height: 28px; }
        .m-user-panel { display: flex; align-items: center; gap: 15px; }
        .m-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid #eee; }
        .m-btn { font-size: 0.8rem; padding: 6px 12px; background: #f0f0f0; border-radius: 4px; color: #555; cursor: pointer; border:none; transition:0.2s; }
        .m-btn:hover { background: #e0e0e0; }
        .m-btn-primary { background: var(--primary-color); color: #fff; }
        .m-btn.active { background: var(--primary-color); color: white; }

        .m-container {
            max-width: 1200px;
            margin: 1.5rem auto;
            width: 95%;
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            align-content: flex-start;
            padding-bottom: 2rem;
        }

        .m-footer { text-align: center; padding: 2rem; color: var(--text-sub); font-size: 0.8rem; width: 100%; margin-top: auto;}

        /* Home Sections */
        .m-section { display: flex; flex-direction: column; position: relative; transition: width 0.3s; }
        .m-section-full { width: 100%; }
        .m-section-half { width: calc(50% - 0.75rem); }
        @media (max-width: 768px) { .m-section-half { width: 100%; } }

        .m-edit-mode .m-section { border: 2px dashed #ccc; border-radius: var(--radius); padding: 10px; background: rgba(255,255,255,0.8); cursor: move; }
        .m-edit-mode .m-section:hover { border-color: var(--primary-color); }
        .m-edit-mode .m-section::after { content: "按住拖拽排序"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #999; opacity: 0; pointer-events: none;}
        .m-edit-mode .m-section:hover::after { opacity: 0.5; }

        /* Search Bar */
        .m-search-card { background: transparent; padding: 2.5rem 0; display: flex; justify-content: center; width: 100%; }
        .m-search-box { display: flex; width: 100%; max-width: 600px; box-shadow: var(--shadow); border-radius: 30px; background: #fff;}
        .m-search-input { flex: 1; padding: 12px 20px; border: 2px solid white; border-right: none; border-radius: 30px 0 0 30px; font-size: 1rem; outline: none; background: transparent;}
        .m-search-input:focus { border-color: white; }
        .m-search-btn { padding: 0 25px; background: var(--primary-color); color: white; border: none; border-radius: 0 30px 30px 0; cursor: pointer; font-weight: bold; font-size: 1rem; }

        .m-section-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.8rem; border-left: 4px solid var(--primary-color); padding-left: 10px; }
        .m-stats-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.8rem; }
        .m-stat-card { background: var(--card-bg); padding: 1rem; border-radius: var(--radius); box-shadow: var(--shadow); text-align: center; }
        .m-stat-num { font-size: 1.3rem; font-weight: bold; color: var(--primary-color); }
        .m-stat-label { font-size: 0.8rem; color: var(--text-sub); }

        .m-top-grid { display: flex; flex-direction: column; gap: 0.5rem; background: var(--card-bg); padding: 0.8rem; border-radius: var(--radius); box-shadow: var(--shadow); height: 100%; }
        .m-thread-row { display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; border-bottom: 1px dashed #eee; }
        .m-thread-row:last-child { border-bottom: none; }
        .m-thread-title { font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; margin-right: 10px; }
        .m-thread-tag { font-size: 0.75rem; color: #999; background:#f5f5f5; padding: 2px 6px; border-radius: 4px; white-space: nowrap;}

        .m-board-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 0.8rem; }
        .m-board-card { background: var(--card-bg); padding: 1rem; border-radius: var(--radius); box-shadow: var(--shadow); transition: transform 0.2s; display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .m-board-card:hover { transform: translateY(-2px); }
        .m-board-icon img { width: 36px; height: 36px; }
        .m-board-info h3 { margin: 0 0 2px 0; font-size: 0.95rem; }
        .m-board-info p { margin: 0; font-size: 0.75rem; color: var(--text-sub); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .m-edit-mode .m-board-card { border: 1px dashed #999; transform: none !important; cursor: move; box-shadow: none; }
        .m-edit-mode .m-board-card * { pointer-events: none; }

        /* Unified List Item Styles */
        .m-header-info { width: 100%; background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
        .m-header-title h1 { margin: 0; font-size: 1.5rem; color: var(--text-main); }
        .m-header-stats { color: var(--text-sub); font-size: 0.9rem; margin-top: 5px; }

        .m-list-card { background: var(--card-bg); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; width: 100%; }
        .m-list-item { padding: 1.2rem 1.5rem; border-bottom: 1px solid #f0f0f0; display: flex; align-items: flex-start; transition: 0.2s; gap: 15px;}
        .m-list-item:hover { background: #f9f9f9; }
        .m-list-item:last-child { border-bottom: none; }

        .m-item-main { flex: 1; min-width: 0; }
        .m-item-title { font-size: 1.05rem; font-weight: 500; color: #333; display: block; margin-bottom: 6px; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
        .m-item-title em, .m-item-title font { color: var(--primary-color) !important; font-style: normal; font-weight: bold; }

        .m-item-desc { font-size: 0.9rem; color: #666; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; }

        .m-item-meta { font-size: 0.8rem; color: #999; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .m-item-meta a { color: #888; }
        .m-tag { padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; background: #eee; color: #666; }
        .m-tag.highlight { background: #ffebee; color: var(--primary-color); }

        .m-item-stats { text-align: right; min-width: 100px; color: #999; font-size: 0.8rem; display: flex; flex-direction: column; align-items: flex-end; justify-content: center;}
        .m-stat-highlight { color: var(--primary-color); font-weight: bold; font-size: 1rem;}

        .m-sticky-header { padding: 10px 1.5rem; background: #fffbe6; color: #8a6d3b; font-weight: bold; font-size: 0.9rem; border-bottom: 1px solid #f0f0f0; }

        /* Search Result */
        .m-result-count { width: 100%; color: var(--text-sub); margin-bottom: 10px; font-size: 0.9rem; text-align:center;}
        .m-result-list { width: 100%; display: flex; flex-direction: column; gap: 15px; }
        .m-result-card { background: var(--card-bg); padding: 1.2rem 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow); display: flex; align-items: flex-start; gap: 15px; transition: transform 0.2s; }
        .m-result-card:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }

        /* Pagination */
        .pg { display: flex; gap: 6px; justify-content: center; margin-top: 2rem; width: 100%; user-select: none; }
        .pg a, .pg strong, .pg label { height: 36px; padding: 0 14px; background: white; border-radius: 6px; box-shadow: var(--shadow); color: #333; font-size: 0.9rem; display: flex; justify-content: center; align-items: center; text-decoration: none; cursor: pointer; box-sizing: border-box; }
        .pg strong { background: var(--primary-color); color: white; cursor: default; }
        .pg a:hover { background: #f5f5f5; color: var(--primary-color); }
        .pg input { border: none; border-bottom: 2px solid #eee; background: transparent; width: 30px; text-align: center; outline: none; height: 24px; font-family: inherit; font-size: 0.9rem; color: var(--primary-color); font-weight: bold; margin: 0 4px; }
        .pg label { cursor: text; }
        .pg a.prev, .pg a.nxt { font-size: 0 !important; width: 36px; padding: 0 !important; background-image: none !important; }
        .pg a.prev::after { content: "<"; font-size: 1.2rem; font-weight:bold; color:#666; }
        .pg a.nxt::after { content: ">"; font-size: 1.2rem; font-weight:bold; color:#666; }
        .pg a.prev:hover::after, .pg a.nxt:hover::after { color: var(--primary-color); }

        /* Thread View CSS */
        .m-thread-header-card { background: var(--card-bg); padding: 2rem; border-radius: var(--radius); box-shadow: var(--shadow); margin-bottom: 1.5rem; text-align: center; width: 100%; box-sizing: border-box; }
        .m-thread-title-large { font-size: 1.8rem; font-weight: bold; margin-bottom: 0.5rem; color: #333; display: block; width: 100%; text-align: center; }
        .m-thread-meta-bar { display: flex; justify-content: center; gap: 20px; color: var(--text-sub); font-size: 0.9rem; align-items: center; }
        .m-thread-meta-bar span { display: flex; align-items: center; gap: 5px; }

        .m-post-list { display: flex; flex-direction: column; gap: 20px; width: 100%; }
        .m-post-card { background: var(--card-bg); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; display: flex; flex-direction: column; }

        .m-post-header { padding: 15px 20px; border-bottom: 1px solid #f5f5f5; display: flex; justify-content: space-between; align-items: center; background: #fafafa; }
        .m-post-user-info { display: flex; align-items: center; gap: 12px; }
        .m-post-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .m-post-username { font-weight: bold; font-size: 1rem; color: #333; text-decoration: none; }
        .m-post-level { font-size: 0.75rem; background: #e0e0e0; color: #666; padding: 1px 6px; border-radius: 4px; }
        .m-post-floor { font-family: 'Arial', sans-serif; font-size: 1.2rem; color: #e0e0e0; font-weight: bold; }

        .m-post-body { padding: 30px; font-size: 16px; line-height: 1.8; color: #333; word-wrap: break-word; }
        .m-post-body img { max-width: 100%; height: auto; border-radius: 4px; margin: 10px 0; cursor: pointer; }
        .m-post-body .quote { margin: 15px 0; padding: 15px; background: #f8f9fa; border-left: 5px solid #ddd; border-radius: 4px; overflow: hidden; }
        .m-post-body .quote blockquote { margin: 0; padding: 0; border: none; background: transparent; color: #666; }
        .m-post-body .blockcode { background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; margin: 10px 0; font-family: monospace; }
        .m-post-body .blockcode ol { padding-left: 40px; margin: 0; }
        .m-post-body .blockcode li { border-left: 1px solid #ddd; padding-left: 5px; list-style-type: decimal; }

        .m-post-rate { margin: 20px 30px; background: #fffdf0; border: 1px solid #f9f2ba; padding: 10px; border-radius: 4px; font-size: 0.85rem; }
        .m-post-rate table { width: 100%; border-collapse: collapse; }
        .m-post-rate th, .m-post-rate td { text-align: left; padding: 5px; color: #666; }
        .m-post-rate .xi1 { color: #f26c4f; }

        .m-post-comment { margin: 20px 30px; background: #f0f9eb; border: 1px solid #d0e9c6; padding: 10px; border-radius: 4px; font-size: 0.85rem; }
        .m-post-comment .pstl { border-bottom: 1px dashed #d0e9c6; padding: 5px 0; display:flex; justify-content:space-between; }

        .m-post-footer { padding: 10px 20px; border-top: 1px solid #f9f9f9; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #999; }

        /* Fast Reply Custom */
        .m-fast-reply { background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius); box-shadow: var(--shadow); margin-top: 2rem; display: flex; flex-direction: column; gap: 15px; width: 100%; box-sizing: border-box; }
        .m-fast-reply h3 { margin: 0; font-size: 1.1rem; }
        .m-reply-area { width: 100%; }
        .m-reply-textarea { width: 100%; height: 150px; padding: 15px; border: 2px solid #eee; border-radius: 12px; font-size: 1rem; box-sizing: border-box; resize: vertical; outline: none; transition: 0.3s; font-family: inherit; background: #fafafa; }
        .m-reply-textarea:focus { border-color: var(--primary-color); background: #fff; box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1); }
        .m-reply-action { width: 100%; text-align: right; }
        #m_reply_btn { padding: 10px 35px; font-size: 1rem; border-radius: 30px; box-shadow: 0 5px 15px rgba(211, 47, 47, 0.3); transition: 0.3s; }
        #m_reply_btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(211, 47, 47, 0.4); }
        #m_reply_btn:active { transform: translateY(0); }
        #m_reply_btn:disabled { background: #ccc; cursor: not-allowed; box-shadow: none; transform: none; }

        /* Modal */
        .m-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
        .m-modal { background: white; padding: 1.5rem; border-radius: 12px; width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: m-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes m-pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .m-sort-list { list-style: none; padding: 0; margin: 1rem 0; }
        .m-sort-item { display: flex; align-items: center; padding: 0.8rem; background: #f8f9fa; border: 1px solid #eee; margin-bottom: 0.5rem; border-radius: 6px; cursor: move; user-select: none; }
        .m-sort-handle { margin-right: 10px; cursor: grab; color: #bbb; font-size: 1.2rem; }
        .m-sort-label { flex: 1; font-size: 0.95rem; }
        .m-modal-actions { display: flex; justify-content: flex-end; }
        .m-switch { position: relative; display: inline-block; width: 34px; height: 20px; }
        .m-switch input { opacity: 0; width: 0; height: 0; }
        .m-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; }
        .m-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .m-slider { background-color: var(--primary-color); }
        input:checked + .m-slider:before { transform: translateX(14px); }
    `;
    GM_addStyle(css);

    // =================================================================
    // 4. 数据提取 (Data Extraction)
    // =================================================================

    function extractUser() {
        let userEl = document.querySelector('#um .vwmy a');
        let avatarEl = document.querySelector('#um .avt img');

        if (!userEl) userEl = document.querySelector('#toptb strong a');

        const currentUser = {
            name: userEl ? userEl.innerText : '',
            link: userEl ? userEl.href : '',
            avatar: avatarEl ? avatarEl.src : ''
        };

        if (isHomePage && currentUser.name && currentUser.avatar) {
            saveUserInfo(currentUser);
            return currentUser;
        } else {
            const cachedUser = loadUserInfo();
            if (cachedUser.name && (currentUser.name === cachedUser.name || !currentUser.name)) {
                if(!currentUser.name) currentUser.name = cachedUser.name;
                if(!currentUser.link) currentUser.link = cachedUser.link;
                currentUser.avatar = cachedUser.avatar;
            }
            return currentUser;
        }
    }

    function extractHomeData() {
        const data = { user: extractUser(), stats: {}, freshThreads: [], hotThreads: [], techThreads: [], digestThreads: [], categories: [] };
        try {
            const chartEl = document.querySelector('#chart .chart');
            if (chartEl) {
                const text = chartEl.innerText;
                data.stats.today = (text.match(/今日:\s*(\d+)/) || [])[1] || '-';
                data.stats.yesterday = (text.match(/昨日:\s*(\d+)/) || [])[1] || '-';
                data.stats.posts = (text.match(/帖子:\s*(\d+)/) || [])[1] || '-';
                data.stats.members = (text.match(/会员:\s*(\d+)/) || [])[1] || '-';
            }
            const topListRow = document.querySelector('.toplist_7ree .fl_row');
            if (topListRow) {
                const extractColumn = (index) => {
                    const col = topListRow.children[index];
                    if (!col) return [];
                    return Array.from(col.querySelectorAll('.threadline_7ree a')).map(el => ({ title: el.innerText.trim(), href: el.href, color: el.style.color || '#333' }));
                };
                data.freshThreads = extractColumn(0); data.techThreads = extractColumn(1); data.hotThreads = extractColumn(2); data.digestThreads = extractColumn(3);
            }
            const categoryTables = document.querySelectorAll('.fl_tb');
            categoryTables.forEach(table => {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const grids = row.querySelectorAll('.fl_g');
                    if (grids.length > 0) {
                        grids.forEach(g => {
                            const linkEl = g.querySelector('dt a'); const iconImg = g.querySelector('.fl_icn_g img'); const todayEm = g.querySelector('dt em');
                            if(linkEl) { const title = linkEl.innerText.trim(); if (title === '『2014CrackMe大赛』') return; data.categories.push({ title: title, href: linkEl.href, icon: iconImg ? iconImg.src : '', desc: '点击查看详情', today: todayEm ? todayEm.innerText : '' }); }
                        });
                        return;
                    }
                    const linkEl = row.querySelector('h2 a');
                    if (linkEl) { const title = linkEl.innerText.trim(); if (title === '『2014CrackMe大赛』') return; const iconImg = row.querySelector('.fl_icn img'); const descP = row.querySelector('p.xg2'); const numEm = row.querySelector('h2 em'); data.categories.push({ title: title, href: linkEl.href, icon: iconImg ? iconImg.src : '', desc: descP ? descP.innerText.trim() : '', today: numEm ? numEm.innerText : '' }); }
                });
            });
        } catch (e) { console.error('Home data error', e); }
        if (currentCategoryOrder.length > 0) { data.categories.sort((a, b) => { const indexA = currentCategoryOrder.indexOf(a.title); const indexB = currentCategoryOrder.indexOf(b.title); return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB); }); }
        return data;
    }

    function extractSearchData() {
        const data = { user: extractUser(), countText: '', results: [], pagination: '', keyword: '' };
        try {
            const inputEl = document.querySelector('input[name="srchtxt"]') || document.getElementById('scform_srchtxt');
            if (inputEl) { data.keyword = inputEl.value; } else { const p = new URLSearchParams(location.search); data.keyword = p.get('kw') || p.get('srchtxt') || ''; }
            const sttl = document.querySelector('.sttl em'); if (sttl) data.countText = sttl.innerText;
            const list = document.querySelectorAll('#threadlist ul li.pbw');
            list.forEach(li => {
                const titleLink = li.querySelector('h3.xs3 a'); const statsP = li.querySelector('p.xg1'); const descP = li.querySelectorAll('p')[1]; const footerP = li.lastElementChild;
                let replies = '0', views = '0'; if(statsP) { const match = statsP.innerText.match(/(\d+) 个回复 - (\d+) 次查看/); if(match) { replies = match[1]; views = match[2]; } }
                if (titleLink) { data.results.push({ titleHtml: titleLink.innerHTML, href: titleLink.href, replies: replies, views: views, desc: descP ? descP.innerText : '', footerHtml: footerP ? footerP.innerHTML : '' }); }
            });
            const pg = document.querySelector('.pg'); if (pg) data.pagination = pg.innerHTML;
        } catch (e) { console.error('Search data error', e); }
        return data;
    }

    function extractForumData() {
        const data = { user: extractUser(), title: document.querySelector('h1.xs2 a')?.innerText || '板块', stats: '', stickThreads: [], normalThreads: [], pagination: '', fid: '' };
        try {
            const statsEl = document.querySelector('h1.xs2 span.xs1'); if(statsEl) data.stats = statsEl.innerText;
            const fidInput = document.querySelector('input[name="srhfid"]'); if(fidInput) data.fid = fidInput.value;
            const rows = document.querySelectorAll('#threadlisttableid tbody');
            rows.forEach(tbody => {
                const isStick = tbody.id.startsWith('stickthread_'); const isNormal = tbody.id.startsWith('normalthread_'); if(!isStick && !isNormal) return;
                const th = tbody.querySelector('th'); const titleLink = th.querySelector('a.xst'); const typeLink = th.querySelector('em a'); const authorLink = tbody.querySelector('td.by cite a'); const dateSpan = tbody.querySelector('td.by em span') || tbody.querySelector('td.by em'); const statsLink = tbody.querySelector('td.num a'); const viewsEm = tbody.querySelector('td.num em');
                const item = { title: titleLink ? titleLink.innerText : '', href: titleLink ? titleLink.href : '#', color: titleLink ? titleLink.style.color : '', type: typeLink ? typeLink.innerText : '', author: authorLink ? authorLink.innerText : '', date: dateSpan ? dateSpan.innerText : '', replies: statsLink ? statsLink.innerText : '0', views: viewsEm ? viewsEm.innerText : '0' };
                if(isStick) data.stickThreads.push(item); else data.normalThreads.push(item);
            });
            const pg = document.querySelector('.pg'); if (pg) data.pagination = pg.innerHTML;

            // Sub Forums extraction
            const subForumContainer = document.querySelector('div[id^="subforum_"] table.fl_tb') || document.querySelector('.fl_tb');
            if (subForumContainer) {
                 data.subForums = [];
                 const rows = subForumContainer.querySelectorAll('tr');
                 rows.forEach(row => {
                     if (row.classList.contains('fl_row') && row.children.length < 2) return;
                     const titleLink = row.querySelector('h2 a');
                     if (!titleLink) return;
                     const iconImg = row.querySelector('.fl_icn img');
                     const descP = row.querySelector('p.xg2');
                     const todayEm = row.querySelector('h2 em');
                     data.subForums.push({
                         title: titleLink.innerText.trim(),
                         href: titleLink.href,
                         icon: iconImg ? iconImg.src : 'https://static.52pojie.cn/static/image/common/forum_new.gif',
                         desc: descP ? descP.innerText.trim() : '',
                         today: todayEm ? todayEm.innerText : ''
                     });
                 });
            }

        } catch(e) { console.error('Forum data error', e); }
        return data;
    }

    function extractThreadData() {
        const data = { user: extractUser(), title: '', tag: '', stats: {}, posts: [], pagination: '', fastPost: null };
        try {
            data.title = document.querySelector('#thread_subject')?.innerText || '帖子详情';
            const tagEl = document.querySelector('.ts a'); if(tagEl) data.tag = tagEl.innerText;

            const statsEl = document.querySelector('.hm.ptn');
            if (statsEl) {
                const parts = statsEl.innerText.match(/\d+/g);
                if(parts && parts.length >= 2) { data.stats.views = parts[0]; data.stats.replies = parts[1]; }
            }
            const pg = document.querySelector('.pg'); if (pg) data.pagination = pg.innerHTML;

            const postDivs = document.querySelectorAll('#postlist > div[id^="post_"]');
            postDivs.forEach(div => {
                const pid = div.id.replace('post_', '');
                const userLink = div.querySelector('.authi .xw1');
                const avatarImg = div.querySelector('.avtm img');
                const groupLink = div.querySelector('.side-group a');

                let dateStr = '';
                const dateEm = div.querySelector('.authi em');
                if(dateEm) {
                   dateStr = dateEm.innerText.replace(/^(发表于|Published on)\s?/i, '').trim();
                }

                const floorLink = div.querySelector('.pi strong a');

                let contentHtml = '';
                const contentCell = div.querySelector('.t_f');
                if(contentCell) {
                    const images = contentCell.querySelectorAll('img[file], img[zoomfile]');
                    images.forEach(img => {
                         const realSrc = img.getAttribute('zoomfile') || img.getAttribute('file');
                         if(realSrc) img.src = realSrc;
                    });
                    contentHtml = contentCell.innerHTML;
                }

                const rateEl = div.querySelector('.rate');
                if (rateEl) {
                    contentHtml += '<div class="m-post-rate">' + rateEl.innerHTML + '</div>';
                }

                const commentEl = div.querySelector('.cm');
                if (commentEl && commentEl.innerHTML.trim() !== '') {
                     contentHtml += '<div class="m-post-comment">' + commentEl.innerHTML + '</div>';
                }

                data.posts.push({
                    id: pid,
                    username: userLink ? userLink.innerText : '匿名',
                    userLink: userLink ? userLink.href : '#',
                    avatar: avatarImg ? avatarImg.src : '',
                    group: groupLink ? groupLink.innerText : '',
                    date: dateStr,
                    floor: floorLink ? floorLink.innerText.trim() : '#',
                    content: contentHtml
                });
            });

            // Extract Fast Post hidden data
            const fastPostForm = document.querySelector('#fastpostform');
            if (fastPostForm) {
                data.fastPost = {
                    action: fastPostForm.action,
                    fields: {}
                };
                Array.from(fastPostForm.querySelectorAll('input[type="hidden"]')).forEach(input => {
                    data.fastPost.fields[input.name] = input.value;
                });
            }

        } catch (e) { console.error('Thread data error', e); }
        return data;
    }

    // =================================================================
    // 5. 渲染页面
    // =================================================================

    function createBaseApp(user) {
        let app = document.getElementById('modern-app');
        if (app) app.innerHTML = '';
        else {
            app = document.createElement('div');
            app.id = 'modern-app';
            document.documentElement.appendChild(app);
        }

        const header = document.createElement('header');
        header.className = 'm-navbar';
        header.innerHTML = `
            <div class="m-logo" style="cursor:pointer;">
                <img src="https://static.52pojie.cn/static/image/common/logo.png" alt="Logo">
            </div>
            <div class="m-user-panel">
                ${isHomePage ? `<button id="btn-edit-mode" class="m-btn">✏️ 编辑布局</button>
                <button id="btn-settings" class="m-btn">⚙️ 设置</button>` : ''}
                ${user.name ? `
                    <a href="${user.link}" style="display:flex;align-items:center;gap:10px;">
                        <img class="m-avatar" src="${user.avatar || 'https://avatar.52pojie.cn/images/noavatar_small.gif'}">
                    </a>
                ` : '<a href="member.php?mod=logging&action=login" class="m-btn m-btn-primary">登录</a>'}
            </div>
        `;
        app.appendChild(header);
        return app;
    }

    function createFooter(app) {
        const footer = document.createElement('div');
        footer.className = 'm-footer';
        footer.innerHTML = 'Designed by UserScript | <a href="https://www.52pojie.cn">吾爱破解</a>';
        app.appendChild(footer);
        setTimeout(() => app.classList.add('loaded'), 10);
    }

    function renderHomeApp(data) {
        const app = createBaseApp(data.user);
        const container = document.createElement('main'); container.className = 'm-container';
        const Renderers = {
            search: () => `<div class="m-search-card"><form class="m-search-box" action="search.php" target="_blank"><input type="hidden" name="mod" value="forum"><input type="hidden" name="searchsubmit" value="yes"><input class="m-search-input" type="text" name="srchtxt" placeholder="搜索帖子..." autocomplete="off"><button class="m-search-btn" type="submit">搜索</button></form></div>`,
            stats: () => `<div class="m-stats-bar"><div class="m-stat-card"><div class="m-stat-num">${data.stats.today}</div><div class="m-stat-label">今日发帖</div></div><div class="m-stat-card"><div class="m-stat-num">${data.stats.yesterday}</div><div class="m-stat-label">昨日发帖</div></div><div class="m-stat-card"><div class="m-stat-num">${data.stats.posts}</div><div class="m-stat-label">总帖子数</div></div><div class="m-stat-card"><div class="m-stat-num">${data.stats.members}</div><div class="m-stat-label">注册会员</div></div></div>`,
            fresh: () => renderThreadList('新鲜出炉', data.freshThreads, '', 'New'),
            hot: () => renderThreadList('人气热门', data.hotThreads, 'border-left-color:var(--hot-color)', 'Hot', 'color:var(--hot-color)'),
            tech: () => renderThreadList('技术分享', data.techThreads, 'border-left-color:var(--tech-color)', 'Tech', 'background:var(--tech-color);color:white;'),
            digest: () => renderThreadList('精华采撷', data.digestThreads, 'border-left-color:var(--digest-color)', 'Good', 'background:var(--digest-color);color:white;'),
            board: () => `<div class="m-section-title">板块分区</div><div class="m-board-grid">${data.categories.map(c => `<div class="m-board-card" data-title="${c.title}"><div class="m-board-icon"><img src="${c.icon || 'https://static.52pojie.cn/static/image/common/forum_new.gif'}"></div><div class="m-board-info"><h3>${c.title} <span style="color:var(--primary-color);font-size:0.8em;margin-left:5px;">${c.today}</span></h3><p>${c.desc}</p></div></div>`).join('')}</div>`
        };
        currentLayout.forEach(cfg => { if (!cfg.visible) return; const r = Renderers[cfg.id]; if (r) { const s = document.createElement('div'); s.className = `m-section m-section-${cfg.type}`; s.dataset.id = cfg.id; s.innerHTML = r(); container.appendChild(s); } });
        app.appendChild(container); createFooter(app);
        document.getElementById('btn-settings').addEventListener('click', () => showSettingsModal(data));
        document.getElementById('btn-edit-mode').addEventListener('click', () => toggleEditMode());
        if(isEditMode) enableSortable();
    }

    function renderThreadList(title, threads, titleStyle, tagText, tagStyle = '') {
        return `<div class="m-section-title" style="${titleStyle}">${title}</div><div class="m-top-grid">${threads.slice(0, 10).map(t => `<div class="m-thread-row"><a href="${t.href}" target="_blank" class="m-thread-title" style="color:${t.color}">${t.title}</a><span class="m-thread-tag" style="${tagStyle}">${tagText}</span></div>`).join('')}</div>`;
    }

    function renderSearchApp(data) {
        const app = createBaseApp(data.user); const container = document.createElement('main'); container.className = 'm-container';
        const searchSection = document.createElement('div'); searchSection.className = 'm-search-card';
        searchSection.innerHTML = `<form class="m-search-box" action="search.php" target="_blank"><input type="hidden" name="mod" value="forum"><input type="hidden" name="searchsubmit" value="yes"><input class="m-search-input" type="text" name="srchtxt" value="${data.keyword.replace(/"/g, '"')}" placeholder="搜索帖子..." autocomplete="off"><button class="m-search-btn" type="submit">搜索</button></form>`;
        container.appendChild(searchSection);
        if (data.countText) { const countDiv = document.createElement('div'); countDiv.className = 'm-result-count'; countDiv.innerHTML = data.countText; container.appendChild(countDiv); }
        const listDiv = document.createElement('div'); listDiv.className = 'm-result-list';
        if (data.results.length > 0) { data.results.forEach(res => { const card = document.createElement('div'); card.className = 'm-result-card'; card.innerHTML = `<div class="m-item-main"><a href="${res.href}" target="_blank" class="m-item-title">${res.titleHtml}</a><div class="m-item-desc">${res.desc}</div><div class="m-item-meta">${res.footerHtml}</div></div><div class="m-item-stats"><div class="m-stat-highlight">${res.replies}</div><div>${res.views}</div></div>`; listDiv.appendChild(card); }); } else { listDiv.innerHTML = '<div style="text-align:center;padding:50px;color:#999;">未找到相关结果</div>'; }
        container.appendChild(listDiv);
        if (data.pagination) { const pageDiv = document.createElement('div'); pageDiv.className = 'pg'; pageDiv.innerHTML = data.pagination; container.appendChild(pageDiv); }
        app.appendChild(container); createFooter(app);
    }

    function renderForumApp(data) {
        const app = createBaseApp(data.user); const container = document.createElement('main'); container.className = 'm-container';
        const searchSection = document.createElement('div'); searchSection.className = 'm-search-card';
        searchSection.innerHTML = `<form class="m-search-box" action="search.php" target="_blank"><input type="hidden" name="mod" value="forum"><input type="hidden" name="searchsubmit" value="yes">${data.fid ? `<input type="hidden" name="srhfid" value="${data.fid}">` : ''}<input class="m-search-input" type="text" name="srchtxt" placeholder="搜索本版..." autocomplete="off"><button class="m-search-btn" type="submit">搜索</button></form>`;
        container.appendChild(searchSection);
        const infoSection = document.createElement('div'); infoSection.className = 'm-header-info';
        infoSection.innerHTML = `<div class="m-header-title"><h1>${data.title}</h1><div class="m-header-stats">${data.stats}</div></div>`; container.appendChild(infoSection);

        // Sub Forums
        if (data.subForums && data.subForums.length > 0) {
            const subBoardSection = document.createElement('div');
            subBoardSection.innerHTML = `<div class="m-section-title">子版块</div><div class="m-board-grid"></div>`;
            const subGrid = subBoardSection.querySelector('.m-board-grid');
            data.subForums.forEach(sub => {
                const card = document.createElement('div');
                card.className = 'm-board-card';
                card.onclick = () => window.location.href = sub.href;
                card.innerHTML = `<div class="m-board-icon"><img src="${sub.icon}"></div><div class="m-board-info"><h3>${sub.title} <span style="color:var(--primary-color);font-size:0.8em;margin-left:5px;">${sub.today}</span></h3><p>${sub.desc}</p></div>`;
                subGrid.appendChild(card);
            });
            container.appendChild(subBoardSection);
        }

        if (data.stickThreads.length > 0) { const stickList = document.createElement('div'); stickList.className = 'm-list-card'; stickList.innerHTML = `<div class="m-sticky-header">📌 置顶主题</div>`; data.stickThreads.forEach(t => { const item = document.createElement('div'); item.className = 'm-list-item'; item.innerHTML = `<div class="m-item-main"><a href="${t.href}" class="m-item-title" style="color:${t.color||'#333'}">${t.title}</a><div class="m-item-meta"><span class="m-tag highlight">置顶</span><span>${t.author}</span><span>${t.date}</span></div></div><div class="m-item-stats"><div class="m-stat-highlight">${t.replies}</div><div>${t.views}</div></div>`; stickList.appendChild(item); }); container.appendChild(stickList); }
        const normalList = document.createElement('div'); normalList.className = 'm-list-card'; normalList.style.marginTop = '1rem';
        data.normalThreads.forEach(t => { const item = document.createElement('div'); item.className = 'm-list-item'; item.innerHTML = `<div class="m-item-main"><a href="${t.href}" class="m-item-title" style="color:${t.color||'#333'}">${t.title}</a><div class="m-item-meta">${t.type ? `<span class="m-tag">${t.type}</span>` : ''}<span>${t.author}</span><span>${t.date}</span></div></div><div class="m-item-stats"><div class="m-stat-highlight">${t.replies}</div><div>${t.views}</div></div>`; normalList.appendChild(item); }); container.appendChild(normalList);
        if (data.pagination) { const pageDiv = document.createElement('div'); pageDiv.className = 'pg'; pageDiv.innerHTML = data.pagination; container.appendChild(pageDiv); }
        app.appendChild(container); createFooter(app);
    }

    function renderThreadApp(data) {
        const app = createBaseApp(data.user);
        const container = document.createElement('main');
        container.className = 'm-container';

        const threadHeader = document.createElement('div');
        threadHeader.className = 'm-thread-header-card';
        threadHeader.innerHTML = `
            <h1 class="m-thread-title-large">${data.tag ? `<span class="m-tag highlight" style="vertical-align:middle;margin-right:10px;">${data.tag}</span>` : ''}${data.title}</h1>
            <div class="m-thread-meta-bar">
                <span>👁️ ${data.stats.views || '-'}</span>
                <span>💬 ${data.stats.replies || '-'}</span>
            </div>
        `;
        container.appendChild(threadHeader);

        const listDiv = document.createElement('div');
        listDiv.className = 'm-post-list';

        data.posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'm-post-card';
            card.id = `post_${post.id}`;
            card.innerHTML = `
                <div class="m-post-header">
                    <div class="m-post-user-info">
                        <img class="m-post-avatar" src="${post.avatar}">
                        <a href="${post.userLink}" target="_blank" class="m-post-username">${post.username}</a>
                        <span class="m-post-level">${post.group}</span>
                    </div>
                    <div class="m-post-floor">${post.floor}</div>
                </div>
                <div class="m-post-body">${post.content}</div>
                <div class="m-post-footer">
                    <span>${post.date}</span>
                    <div class="m-post-actions">
                        <!-- Actions -->
                    </div>
                </div>
            `;
            listDiv.appendChild(card);
        });
        container.appendChild(listDiv);

        if (data.pagination) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'pg';
            pageDiv.innerHTML = data.pagination;
            container.appendChild(pageDiv);
        }

        if (data.fastPost) {
            const fastReply = document.createElement('div');
            fastReply.className = 'm-fast-reply';
            fastReply.innerHTML = `
                <h3>快速回复</h3>
                <div class="m-reply-area">
                    <textarea id="m_reply_content" class="m-reply-textarea" placeholder="在此输入回复内容..."></textarea>
                </div>
                <div class="m-reply-action">
                    <button id="m_reply_btn" class="m-search-btn">发表回复</button>
                </div>
            `;
            container.appendChild(fastReply);

            // Bind Event
            setTimeout(() => {
                document.getElementById('m_reply_btn').addEventListener('click', async () => {
                    const content = document.getElementById('m_reply_content').value;
                    if(!content.trim()) { alert('请输入内容'); return; }

                    // Create and submit form
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = data.fastPost.action;
                    form.acceptCharset = 'gbk';
                    form.style.display = 'none';

                    for(let key in data.fastPost.fields) {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = data.fastPost.fields[key];
                        form.appendChild(input);
                    }

                    const messageInput = document.createElement('input');
                    messageInput.type = 'hidden';
                    messageInput.name = 'message';
                    messageInput.value = content;
                    form.appendChild(messageInput);

                    document.body.appendChild(form);

                    const btn = document.getElementById('m_reply_btn');
                    btn.innerText = '提交中...';
                    btn.disabled = true;

                    form.submit(); // Submit
                });
            }, 0);
        }

        app.appendChild(container);
        createFooter(app);
    }

    function toggleEditMode() { isEditMode = !isEditMode; const btn = document.getElementById('btn-edit-mode'); if (isEditMode) { document.body.classList.add('m-edit-mode'); btn.classList.add('active'); btn.innerText = '💾 保存布局'; enableSortable(); } else { document.body.classList.remove('m-edit-mode'); btn.classList.remove('active'); btn.innerText = '✏️ 编辑布局'; disableSortable(); } }
    if (isHomePage) GM_registerMenuCommand("开启/关闭 布局编辑模式", toggleEditMode);
    function enableSortable() { if (sortableInstances.length > 0) return; const container = document.querySelector('.m-container'); const boardGrid = document.querySelector('.m-board-grid'); if (container) { sortableInstances.push(new Sortable(container, { animation: 150, ghostClass: 'sortable-ghost', handle: '.m-section', onEnd: function (evt) { const newOrderIds = Array.from(container.children).map(el => el.dataset.id).filter(id=>id); const newLayout = []; newOrderIds.forEach(id => { const item = currentLayout.find(x => x.id === id); if (item) newLayout.push(item); }); currentLayout.forEach(item => { if (!newOrderIds.includes(item.id)) newLayout.push(item); }); currentLayout = newLayout; saveLayoutConfig(currentLayout); } })); } if (boardGrid) { sortableInstances.push(new Sortable(boardGrid, { animation: 150, ghostClass: 'sortable-ghost', onEnd: function (evt) { const titles = Array.from(boardGrid.children).map(el => el.dataset.title); saveCategoryOrder(titles); } })); } }
    function disableSortable() { sortableInstances.forEach(s => s.destroy()); sortableInstances = []; }
    function showSettingsModal(appData) { const exist = document.getElementById('m-settings-modal'); if (exist) exist.remove(); const overlay = document.createElement('div'); overlay.id = 'm-settings-modal'; overlay.className = 'm-modal-overlay'; const modal = document.createElement('div'); modal.className = 'm-modal'; modal.innerHTML = `<h3>全局设置</h3><p style="font-size:0.8rem;color:#666;">大板块开关（拖拽请使用"编辑布局"模式）</p><ul class="m-sort-list" id="m-settings-list"></ul><div class="m-modal-actions"><button class="m-btn" id="btn-cancel">关闭</button></div>`; const list = modal.querySelector('#m-settings-list'); currentLayout.forEach((item) => { const li = document.createElement('li'); li.className = 'm-sort-item'; li.style.cursor = 'default'; li.innerHTML = `<span class="m-sort-label">${item.title}</span><label class="m-switch"><input type="checkbox" data-id="${item.id}" ${item.visible ? 'checked' : ''}><span class="m-slider"></span></label>`; li.querySelector('input').addEventListener('change', (e) => { item.visible = e.target.checked; saveLayoutConfig(currentLayout); renderHomeApp(appData); }); list.appendChild(li); }); modal.querySelector('#btn-cancel').addEventListener('click', () => overlay.remove()); overlay.appendChild(modal); document.body.appendChild(overlay); }

    function main() {
        console.log('Modern 52Pojie: Start on', path);
        if (isHomePage) {
            const data = extractHomeData();
            renderHomeApp(data);
        } else if (isSearchPage) {
            const data = extractSearchData();
            renderSearchApp(data);
        } else if (isForumPage) {
            const data = extractForumData();
            renderForumApp(data);
        } else if (isThreadPage) {
            const data = extractThreadData();
            renderThreadApp(data);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
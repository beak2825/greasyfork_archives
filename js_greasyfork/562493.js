// ==UserScript==
// @name         Linux.do Hand‑Drawn Theme (优化版 V1.7 – 表格列对齐)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  将 Linux.do 论坛美化为手绘/涂鸦风格，保留表格原生列对齐，兼容 SPA 与移动端
// @author       YOU
// @match        https://linux.do/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562493/Linuxdo%20Hand%E2%80%91Drawn%20Theme%20%28%E4%BC%98%E5%8C%96%E7%89%88%20V17%20%E2%80%93%20%E8%A1%A8%E6%A0%BC%E5%88%97%E5%AF%B9%E9%BD%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562493/Linuxdo%20Hand%E2%80%91Drawn%20Theme%20%28%E4%BC%98%E5%8C%96%E7%89%88%20V17%20%E2%80%93%20%E8%A1%A8%E6%A0%BC%E5%88%97%E5%AF%B9%E9%BD%90%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* --------------------------------------------------------------
       1️⃣ 预加载字体（不阻塞首屏渲染）
       -------------------------------------------------------------- */
    const preload = (href) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    };
    preload('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
    preload('https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-web/style.css');

    window.addEventListener('load', () => {
        const en = document.createElement('link');
        en.rel = 'stylesheet';
        en.href = 'https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap';
        document.head.appendChild(en);

        const cn = document.createElement('link');
        cn.rel = 'stylesheet';
        cn.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-web/style.css';
        document.head.appendChild(cn);
    });

    /* --------------------------------------------------------------
       2️⃣ 核心 CSS（模块化）
       -------------------------------------------------------------- */
    const rootVars = `
        :root {
            --hd-bg: #fdfbf7;
            --hd-text: #2d2d2d;
            --hd-muted: #e5e0d8;
            --hd-accent: #ff4d4d;
            --hd-secondary: #2d5da1;
            --hd-highlight: #fff9c4;
            --hd-border: #2d2d2d;
            --hd-shadow: 4px 4px 0 0 var(--hd-border);
            --hd-shadow-hover: 2px 2px 0 0 var(--hd-border);
            --wobbly-big: 255px 15px 225px 15px / 15px 225px 15px 255px;
            --wobbly-sm: 20px 5px 20px 5px / 5px 20px 5px 20px;
            --hd-font-head: 'Kalam', 'LXGW WenKai Screen', 'Kaiti SC', 'KaiTi', cursive, sans-serif;
            --hd-font-body: 'Patrick Hand', 'LXGW WenKai Screen', 'Kaiti SC', 'KaiTi', cursive, sans-serif;
        }
        @media (max-width: 640px) {
            :root {
                --wobbly-big: 120px 10px 100px 10px / 10px 100px 10px 120px;
                --wobbly-sm: 10px 3px 10px 3px / 3px 10px 3px 10px;
            }
        }
    `;

    const globalBase = `
        body {
            font-family: var(--hd-font-body) !important;
            background: var(--hd-bg) !important;
            background-image: radial-gradient(var(--hd-muted) 1px, transparent 1px) !important;
            background-size: 24px 24px !important;
            color: var(--hd-text) !important;
            -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, h4, h5, .d-header, .category-name, .topic-title {
            font-family: var(--hd-font-head) !important;
        }
        a {
            color: var(--hd-secondary);
            text-decoration-style: dashed;
        }
        a:hover {
            color: var(--hd-accent);
        }
    `;

    const headerStyle = `
        .d-header {
            background: #fff !important;
            box-shadow: 0 4px 0 0 rgba(45,45,45,0.1) !important;
            border-bottom: 3px solid var(--hd-border) !important;
            height: 70px !important;
        }
        .d-header .contents { border: none !important; }
        .d-header .search-input {
            position: relative !important;
            display: flex !important;
            align-items: center !important;
            border: 2px solid var(--hd-border) !important;
            border-radius: var(--wobbly-big) !important;
            background: #fff !important;
            box-shadow: inset 2px 2px 0 rgba(0,0,0,.05);
            height: 40px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }
        .d-header .search-input:focus-within {
            border-color: var(--hd-secondary) !important;
            box-shadow: 4px 4px 0 0 rgba(45,93,161,.1) !important;
            transform: rotate(-0.5deg);
        }
        .d-header #search-term {
            flex: 1;
            padding: 0 45px 0 40px;
            background: transparent !important;
            border: none !important;
            font-family: var(--hd-font-body) !important;
            font-size: 1.1rem !important;
            color: var(--hd-text) !important;
        }
        .d-header .search-icon {
            position: absolute; left: 12px; top: 50%;
            transform: translateY(-50%);
            opacity: .6; pointer-events: none;
        }
        .d-header .show-advanced-search {
            position: absolute; right: 8px; top: 50%;
            transform: translateY(-50%);
            background: transparent !important; border: none !important;
        }
        .d-header-icons .icon img.avatar {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40% !important;
            border: 2px solid var(--hd-border);
        }
    `;

    const sidebarStyle = `
        .sidebar-wrapper {
            background: transparent !important;
            border-right: 2px dashed var(--hd-muted);
        }
        .sidebar-section-link-wrapper .sidebar-section-link {
            font-family: var(--hd-font-body) !important;
            font-size: 1.05rem !important;
            padding: 8px 12px !important;
            margin-bottom: 4px;
            border: 2px solid transparent !important;
            border-radius: var(--wobbly-sm) !important;
            transition: all .2s !important;
            color: var(--hd-text) !important;
        }
        .sidebar-section-link-wrapper .sidebar-section-link:hover {
            background: #fff !important;
            border-color: var(--hd-border) !important;
            box-shadow: var(--hd-shadow-hover) !important;
            transform: rotate(-1deg);
            z-index: 5;
        }
        .sidebar-section-link-wrapper .sidebar-section-link.active {
            background: var(--hd-highlight) !important;
            border-color: var(--hd-border) !important;
            box-shadow: var(--hd-shadow) !important;
            transform: translate(-2px,-2px) rotate(1deg);
            font-weight: bold !important;
            color: var(--hd-text) !important;
        }
        .sidebar-footer-wrapper .btn {
            background: var(--hd-accent) !important;
            color: #fff !important;
            font-family: var(--hd-font-head) !important;
            font-size: 1.1rem !important;
            border: 3px solid var(--hd-border) !important;
            border-radius: var(--wobbly-big) !important;
            box-shadow: var(--hd-shadow) !important;
            transition: all .1s;
            width: 100% !important;
            justify-content: center;
        }
        .sidebar-footer-wrapper .btn:hover {
            background: var(--hd-secondary) !important;
            transform: translate(-1px,-1px);
        }
        .sidebar-footer-wrapper .btn:active {
            transform: translate(2px,2px);
            box-shadow: none !important;
        }
        .sidebar-footer-wrapper .sidebar-footer-secondary-buttons .btn {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            color: var(--hd-text) !important;
        }
        .sidebar-footer-wrapper .sidebar-footer-secondary-buttons .btn:hover {
            background: var(--hd-muted) !important;
            border-radius: 50% !important;
        }
    `;

    /* ==============================
       Topic List（保留 table 布局，自动列对齐）
       ============================== */
    const topicListStyle = `
        /* 表格整体 */
        .topic-list {
            width: 100% !important;
            border-collapse: separate !important;
            border-spacing: 0 8px !important;      /* 行间距 */
            padding: 0 12px !important;
            table-layout: auto !important;         /* ★ 自适应列宽 ★ */
        }

        /* 表头 */
        .topic-list thead th {
            font-family: var(--hd-font-head) !important;
            font-size: 0.9rem !important;
            color: var(--hd-text) !important;
            background: transparent !important;
            border: none !important;
            padding: 8px 12px !important;
            text-align: left !important;
            white-space: nowrap !important;
        }
        /* 数字列（回复、浏览、活动）右对齐 */
        .topic-list thead th.num,
        .topic-list thead th.posts,
        .topic-list thead th.views,
        .topic-list thead th.activity {
            text-align: right !important;
        }

        /* 每一行（卡片化） */
        .topic-list tbody tr.topic-list-item {
            background: #fff !important;
            box-shadow: 2px 2px 0 rgba(0,0,0,.07), 0 1px 3px rgba(0,0,0,.04) !important;
            transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease !important;
        }
        .topic-list tbody tr.topic-list-item:hover {
            transform: translate(-2px,-2px) rotate(0.15deg);
            box-shadow: var(--hd-shadow);
        }

        /* 单元格通用 */
        .topic-list tbody tr.topic-list-item td {
            background: #fff !important;
            border-top: 2px solid var(--hd-border) !important;
            border-bottom: 2px solid var(--hd-border) !important;
            padding: 10px 12px !important;
            vertical-align: middle !important;
        }
        /* 首列圆角 */
        .topic-list tbody tr.topic-list-item td:first-child {
            border-left: 2px solid var(--hd-border) !important;
            border-radius: 12px 0 0 12px !important;
        }
        /* 末列圆角 */
        .topic-list tbody tr.topic-list-item td:last-child {
            border-right: 2px solid var(--hd-border) !important;
            border-radius: 0 12px 12px 0 !important;
        }

        /* 主链接列（标题） */
        .topic-list tbody tr.topic-list-item td.main-link {
            width: auto !important;                /* 自适应 */
            max-width: 0 !important;               /* 配合 text-overflow */
        }
        .topic-list tbody tr.topic-list-item td.main-link .title {
            font-family: var(--hd-font-head) !important;
            font-size: 1.05rem !important;
            color: var(--hd-text) !important;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* 数字列（回复、浏览、活动） */
        .topic-list tbody tr.topic-list-item td.num,
        .topic-list tbody tr.topic-list-item td.posts,
        .topic-list tbody tr.topic-list-item td.views,
        .topic-list tbody tr.topic-list-item td.activity {
            text-align: right !important;
            white-space: nowrap !important;
            font-family: var(--hd-font-body) !important;
            font-size: 0.9rem !important;
            color: var(--hd-text) !important;
            width: 1% !important;                  /* 收缩到内容宽度 */
        }

        /* 头像 */
        .topic-list tbody tr.topic-list-item td .topic-poster img,
        .topic-list tbody tr.topic-list-item .avatar {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40% !important;
            border: 2px solid var(--hd-border) !important;
        }

        /* 置顶 / 精华 */
        .topic-list tbody tr.topic-list-item.pinned td,
        .topic-list tbody tr.topic-list-item.featured td {
            background: var(--hd-highlight) !important;
        }

        /* 移动端 */
        @media (max-width: 640px) {
            .topic-list {
                border-spacing: 0 6px !important;
                padding: 0 6px !important;
            }
            .topic-list tbody tr.topic-list-item td {
                padding: 8px 6px !important;
            }
            .topic-list tbody tr.topic-list-item td.main-link .title {
                font-size: 0.95rem !important;
            }
            .topic-list tbody tr.topic-list-item td.num,
            .topic-list tbody tr.topic-list-item td.posts,
            .topic-list tbody tr.topic-list-item td.views,
            .topic-list tbody tr.topic-list-item td.activity {
                font-size: 0.8rem !important;
            }
        }
    `;

    const timelineStyle = `
        .timeline-container .timeline-handle {
            background: var(--hd-accent) !important;
            border: 2px solid var(--hd-border) !important;
            border-radius: 50% !important;
            width: 14px !important;
            height: 14px !important;
            box-shadow: 2px 2px 0 var(--hd-border) !important;
            right: -7px !important;
        }
        .timeline-footer-controls .btn {
            background: #fff !important;
            border: 2px solid var(--hd-border) !important;
            border-radius: 8px !important;
            box-shadow: 3px 3px 0 rgba(0,0,0,.1) !important;
            margin: 0 4px !important;
            transition: all .2s;
        }
        .timeline-footer-controls .btn:hover {
            transform: translateY(-2px);
            background: var(--hd-highlight) !important;
        }
        #topic-footer-buttons {
            border-top: 2px dashed var(--hd-muted) !important;
            padding-top: 25px !important;
        }
        .topic-footer-main-buttons .btn {
            background: #fff !important;
            border: 2px solid var(--hd-border) !important;
            border-radius: var(--wobbly-sm) !important;
            box-shadow: 3px 3px 0 rgba(0,0,0,.1) !important;
            color: var(--hd-text) !important;
            font-family: var(--hd-font-body) !important;
            font-weight: bold;
            transition: all .1s ease-in-out;
            margin-right: 10px !important;
            padding: 8px 15px !important;
        }
        .topic-footer-main-buttons .btn:hover {
            transform: translate(-2px,-2px) rotate(-1deg);
            box-shadow: var(--hd-shadow) !important;
        }
        .topic-footer-main-buttons .btn.create {
            background: var(--hd-secondary) !important;
            color: #fff !important;
            border-width: 3px !important;
            font-family: var(--hd-font-head) !important;
            letter-spacing: 1px;
        }
        .topic-footer-main-buttons .btn.create:hover {
            background: var(--hd-accent) !important;
            transform: translate(-2px,-2px) rotate(1deg) !important;
        }
        .topic-notifications-button .select-kit-header {
            background: var(--hd-bg) !important;
            border: 2px solid var(--hd-border) !important;
            border-radius: var(--wobbly-sm) !important;
            box-shadow: 3px 3px 0 rgba(0,0,0,.1) !important;
            font-family: var(--hd-font-body) !important;
        }
        .topic-notifications-button .select-kit-header:hover {
            background: var(--hd-highlight) !important;
            box-shadow: var(--hd-shadow) !important;
            transform: rotate(-1deg);
        }
    `;

    const composerStyle = `
        #reply-control {
            background: var(--hd-bg) !important;
            background-image: radial-gradient(var(--hd-muted) 1px, transparent 1px) !important;
            background-size: 24px 24px !important;
            border-top: 4px solid var(--hd-border) !important;
            box-shadow: 0 -4px 10px rgba(0,0,0,.1) !important;
        }
        #reply-control .alert-info {
            background: var(--hd-highlight) !important;
            border: 2px solid var(--hd-border) !important;
            border-radius: 2px 255px 5px 25px / 255px 5px 225px 5px !important;
            box-shadow: var(--hd-shadow) !important;
            transform: rotate(-1deg);
            color: var(--hd-text) !important;
        }
        #reply-control input,
        .category-combobox .select-kit-header {
            border: 2px solid var(--hd-border) !important;
            border-radius: var(--wobbly-sm) !important;
            background: #fff !important;
        }
        .d-editor-textarea-wrapper {
            background: #fff !important;
            border: 3px dashed var(--hd-border) !important;
            border-radius: 5px !important;
        }
        .d-editor-input { font-family: var(--hd-font-body) !important; }
        .d-editor-preview-wrapper {
            border: 2px solid var(--hd-border) !important;
            border-radius: var(--wobbly-sm) !important;
            background: #fff !important;
            box-shadow: var(--hd-shadow);
        }
        #reply-control .save-or-cancel .btn-primary {
            background: var(--hd-secondary) !important;
            border: 3px solid var(--hd-border) !important;
            border-radius: var(--wobbly-big) !important;
            box-shadow: var(--hd-shadow) !important;
        }
        #reply-control .save-or-cancel .btn-primary:hover {
            background: var(--hd-accent) !important;
            transform: translate(-1px,-1px) rotate(1deg);
        }
        #reply-control .save-or-cancel .cancel {
            text-decoration: underline dashed var(--hd-accent) !important;
            color: var(--hd-text) !important;
        }
    `;

    const scrollbarStyle = `
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track {
            background: var(--hd-bg);
            border-left: 1px solid var(--hd-border);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--hd-muted);
            border: 2px solid var(--hd-border);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover { background: var(--hd-accent); }
        * {
            scrollbar-width: thin;
            scrollbar-color: var(--hd-muted) var(--hd-bg);
        }
    `;

    const fullCSS = [
        rootVars,
        globalBase,
        headerStyle,
        sidebarStyle,
        topicListStyle,
        timelineStyle,
        composerStyle,
        scrollbarStyle
    ].join('\n');

    /* --------------------------------------------------------------
       3️⃣ 注入 CSS
       -------------------------------------------------------------- */
    const STYLE_ID = 'handdrawn-theme-style';
    const injectStyle = (css) => {
        let el = document.getElementById(STYLE_ID);
        if (!el) {
            el = document.createElement('style');
            el.id = STYLE_ID;
            document.head.appendChild(el);
        }
        el.textContent = css;
    };

    const headObserver = new MutationObserver((_, obs) => {
        if (document.head) {
            injectStyle(fullCSS);
            obs.disconnect();
        }
    });
    headObserver.observe(document.documentElement, { childList: true, subtree: true });

    /* --------------------------------------------------------------
       4️⃣ SPA 兼容
       -------------------------------------------------------------- */
    const pageObserver = new MutationObserver(() => {
        const roots = ['.d-header', '.sidebar-wrapper', '#reply-control', '.topic-list'];
        if (roots.some(sel => document.querySelector(sel))) {
            injectStyle(fullCSS);
        }
    });
    pageObserver.observe(document.body, { childList: true, subtree: true });

    console.log('%c🖌️ Hand‑Drawn Theme 已启动（v1.7 — 表格列对齐版）', 'color:#ff4d4d;font-weight:bold;');

})();

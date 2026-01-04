// ==UserScript==
// @name         Chiphell Dark Mode (CSS Variables Edition)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Deep dark mode using CSS variables
// @author       AGz
// @match        https://www.chiphell.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560768/Chiphell%20Dark%20Mode%20%28CSS%20Variables%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560768/Chiphell%20Dark%20Mode%20%28CSS%20Variables%20Edition%29.meta.js
// ==/UserScript==

        // 3. 绑定切换事件与状态保存
        const root = document.documentElement;
        const storageKey = 'chh_dark_mode_pref';
        // 创建按钮元素
        const toggleBtn = document.createElement('a');

        // 更新状态的函数
        function updateTheme(isDark) {
            if (isDark) {
                root.classList.add('dark');
                toggleBtn.textContent = '浅色模式'; // 切换后显示为“浅色模式”，意为点击切换回浅色
                toggleBtn.style.color = '#ff6b6b'; // 可选：给按钮加个高亮色
            } else {
                root.classList.remove('dark');
                toggleBtn.textContent = '深色模式';
                toggleBtn.style.color = '';
            }
            localStorage.setItem(storageKey, isDark ? '1' : '0');
        }

        // 初始化：检查本地存储
        const savedState = localStorage.chh_dark_mode_pref
        if (savedState === '1') {
            updateTheme(true);
        }

    // 2. 插入按钮逻辑
    function insertToggleButton() {

        // 找到目标容器：id="flk" 下的第一个 <p> 标签
        const footerContainer = document.querySelector('#flk p');

        if (!footerContainer) return;

        toggleBtn.href = 'javascript:;';
        toggleBtn.id = 'chh-dark-toggle';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.textContent = '深色模式'; // 默认文字

        // 创建分隔符
        const pipe = document.createElement('span');
        pipe.className = 'pipe';
        pipe.textContent = '|';

        // 插入到 <p> 的最前面 (即 Archiver 之前)
        if (footerContainer.firstChild) {
            footerContainer.insertBefore(pipe, footerContainer.firstChild);
            footerContainer.insertBefore(toggleBtn, pipe);
        } else {
            footerContainer.appendChild(toggleBtn);
            footerContainer.appendChild(pipe);
        }

        // 点击事件
        toggleBtn.addEventListener('click', function() {
            const isCurrentlyDark = root.classList.contains('dark');
            updateTheme(!isCurrentlyDark);
        });
    }

(function() {
    'use strict';

    GM_addStyle(`
/* ==========================================================================
   Chiphell Dark Mode Theme Overrides
   基于 style_22_common.css 适配
   ========================================================================== */

/* 1. 核心变量定义 (CSS Variables)
   使用变量以便于维护和统一调整色调 */
.dark {
    /* 背景色 */
    --c-bg-base: #121212;       /* 页面的基础背景 (原 #F8F8F8) */
    --c-bg-card: #1e1e1e;       /* 卡片/内容块背景 (原 #FFF) */
    --c-bg-hover: #2a2a2a;      /* 悬停状态背景 */
    --c-bg-input: #252525;      /* 输入框背景 */
    --c-bg-header: #1a1a1a;     /* 顶部条背景 */
    --c-bg-quote: #242424;      /* 引用块背景 */

    /* 文本颜色 */
    --c-text-primary: #e0e0e0;  /* 主要文字 (原 #444) */
    --c-text-secondary: #a0a0a0;/* 次要文字 (原 #666/#999) */
    --c-text-link: #8ab4f8;     /* 链接颜色 (原 #333) */
    --c-text-link-hover: #fff;  /* 链接悬停 */

    /* 边框与分割线 */
    --c-border-light: #333333;  /* 浅边框 (原 #EEE) */
    --c-border-medium: #444444; /* 中等边框 (原 #DDD/CCC) */

    /* 品牌色调整 (保持色相，调整明度以适应暗色背景) */
    --c-accent-red-bg: #8a1b1b; /* 红色背景块 (原 #A90000) */
    --c-accent-red-text: #ff6b6b; /* 红色文字 (原 #A90000，调亮以增加对比度) */
    --c-accent-blue: #4fc3f7;   /* 蓝色文字 (原 #00BDF0) */
    --c-accent-orange: #ffb74d; /* 橙色文字 (原 #FF9C00) */
}
*:not(pre,img) {
    -webkit-text-stroke: 0.1px;
}
img, video {
    border-radius: 0.35em !important;
}

/* 2. 全局基础重置 */
.dark body {
    background: var(--c-bg-base);
    color: var(--c-text-primary);
}

.dark input,
.dark button,
.dark select,
.dark textarea {
    background-color: var(--c-bg-input);
    color: var(--c-text-primary);
    border-color: var(--c-border-medium);
}

.dark a {
    color: var(--c-text-primary)!important; /* 默认链接颜色调整为稍亮 */
}

.dark a:hover {
    color: var(--c-text-link-hover);
}

.dark .xi2, .dark .xi2 a, .dark .xi3 a {
    color: var(--c-accent-red-text) !important;
}

.dark .xg1, .dark .xg1 a {
    color: var(--c-text-secondary) !important;
}

/* 3. 布局与容器 (Containers) */
.dark .bm,
.dark .bn,
.dark #wp,
.dark .mn,
.dark .box,
.dark .tb .a a,
.dark .tb .current a,
.dark #uhd,
.dark .pt,
.dark .px,
.dark .ps,
.dark select,
.dark .pbl,
.dark .rfm .p_tip,
.dark .pm .c,
.dark .pm_tac,
.dark .frame,
.dark .frame-tab,
.dark .p_pop,
.dark .p_pof,
.dark .sllt {
    background-color: var(--c-bg-card) !important;
    border-color: var(--c-border-medium);
    color: var(--c-text-primary);
}

/* 4. 头部与导航 (Header & Nav) */
.dark #toptb {
    background: var(--c-bg-header);
    border-bottom-color: var(--c-border-medium);
}

.dark #hd, .dark #hd .wp {
    background: var(--c-bg-base);
}


.dark #nv li.a {
    background-color: rgba(0,0,0,0.2);
}

.dark #scbar {
    background: var(--c-bg-header);
    border-color: var(--c-border-light);
    border-bottom-color: var(--c-border-medium);
}

.dark #scbar_type {
    background: var(--c-bg-input);
    border-color: var(--c-border-medium);
}

.dark #scbar_txt {
    background: var(--c-bg-input);
    border-color: var(--c-border-medium);
    color: var(--c-text-primary);
}

/* 5. 列表与表格 (Lists & Tables) */
.dark .tl th, .dark .tl td {
    border-bottom-color: var(--c-border-light);
}

.dark .dt th {
    background: var(--c-bg-hover);
    color: var(--c-text-primary);
}

.dark .dt td, .dark .dt th {
    border-bottom-color: var(--c-border-light);
}

.dark .pbl li {
    border-right-color: var(--c-border-light);
}

.dark .pbl a:hover {
    background-color: var(--c-bg-hover);
}

/* 6. 特殊模块修正 */

/* 分页 (Pagination) */
.dark .pg a, .dark .pg strong, .dark .pgb a, .dark .pg label {
    background-color: var(--c-bg-card);
    border-color: var(--c-border-medium);
    color: var(--c-text-primary);
}
.dark .pg strong {
    background-color: var(--c-accent-red-bg);
    color: #fff;
    border-color: var(--c-accent-red-bg);
}

/* 引用与代码块 */
.dark .pmd .quote {
    background-color: var(--c-bg-quote);
    color: var(--c-text-secondary);
}
.dark .pmd .blockcode {
    background-color: #000;
    color: #0f0;
}

/* 边框修正 */
.dark .bbda, .dark .btda, .dark .bbs, .dark .bts {
    border-color: var(--c-border-light) !important;
}

/* 提示框 */
.dark .tip {
    background: var(--c-bg-hover);
    border-color: var(--c-border-medium);
    color: var(--c-text-primary);
}

/* 首页特定块 (Chiphell Home) */
.dark .chiphell_index_hot,
.dark .chiphell_index_news .acon,
.dark .chip_index_zuixin .tmpad,
.dark .chip_index_pingce .tmpad {
    background-color: var(--c-bg-card);
    border-color: var(--c-border-medium);
}

.dark .chiphell_index_news li a,
.dark .chiphell_index_hot li a {
    color: var(--c-text-primary);
}

.dark .chiphell_index_news li a:hover,
.dark .chiphell_index_hot li a:hover {
    color: var(--c-accent-red-text);
}

/* 7. 细节微调 (Utility Classes) */
.dark .fc-p, .dark .a { color: var(--c-accent-red-text); }
.dark .fc-s { color: var(--c-text-secondary); }
.dark .fc-n { color: #7DA0CC; } /* 保持淡蓝 */
.dark .fc-l { color: var(--c-accent-orange); }

.dark .alt, .dark .alt th, .dark .alt td {
    background-color: var(--c-bg-hover);
}

.dark .fl .bm_h {
    background-color: var(--c-accent-red-bg);
    border-color: var(--c-accent-red-bg);
}

/* 下拉菜单修正 */
.dark #qmenu_menu {
    background: var(--c-bg-card);
    border-color: var(--c-border-medium);
}

.dark #qmenu_menu ul.nav a {
    background-color: var(--c-bg-hover);
    color: var(--c-text-primary);
}

.dark #qmenu_menu ul.nav a:hover {
    background-color: var(--c-bg-input);
    color: var(--c-accent-red-text);
}

/* 搜索框区域 */
.dark .scbar_hot strong, .dark .scbar_hot a {
    color: var(--c-text-link);
}

/* ==========================================================================
   Chiphell Forum Display Dark Mode Overrides
   基于 style_22_forum_forumdisplay.css 适配
   ========================================================================== */

/* 1. 快速发帖区域 (#vfastpost) */
.dark #vfastpost {
    background: var(--c-bg-card); /* 原 #E5EDF2 */
    border: 1px solid var(--c-border-light);
}

.dark #vfastpost #vf_m input {
    background-color: var(--c-bg-input);
    border-color: var(--c-border-medium);
    color: var(--c-text-primary);
}

.dark #vfastpost #vf_b button {
    background: var(--c-bg-header); /* 原 #E4ECF1 */
    border-color: var(--c-border-medium);
    color: var(--c-text-secondary) !important;
    text-shadow: none; /* 去除白色文字阴影 */
}

.dark #vfastpost #vf_b button:hover {
    background: var(--c-bg-hover);
    color: var(--c-text-primary) !important;
}

/* 2. 主题列表表格 (.tl) - 核心区域 */
.dark .tl th,
.dark .tl td {
    border-bottom-color: var(--c-border-light);
}

/* 列表行悬停效果 */
.dark .tl tr:hover th,
.dark .tl tr:hover td {
    background-color: var(--c-bg-hover); /* 原 #F2F2F2 */
}

/* 预览/置顶分隔区域 */
.dark .tl .threadpre td,
.dark .tl .threadpre:hover td {
    background-color: var(--c-bg-header); /* 原 #FCFCFC */
}
.dark .tl .threadpre .threadpretd {
    border-color: var(--c-border-light);
}

/* 表头栏 */
.dark .tl .th,
.dark .tl .ts th,
.dark .tl .ts td {
    background: var(--c-bg-header); /* 原 #F2F2F2 */
    border-bottom-color: var(--c-border-medium);
}

/* 列表中的链接颜色微调 */
.dark .tl .new em a,
.dark .tl .new em {
    color: var(--c-accent-blue); /* 原 #007CD5 */
}
.dark .tl th em,
.dark .tl th em a {
    color: var(--c-accent-blue);
}
.dark .tl cite,
.dark .tl .num em,
.dark .tl td em,
.dark .tl td em a {
    color: var(--c-text-secondary);
}

/* 3. 侧边导航栏 (.bdl) */
.dark .bdl {
    background-color: var(--c-bg-card); /* 原 #F5F9FB */
    border-color: var(--c-border-medium);
}

.dark .bdl dt {
    background: var(--c-bg-header);
    border-color: var(--c-border-light);
    color: var(--c-text-primary);
}

.dark .bdl dd.bdl_a a {
    background-color: var(--c-bg-hover); /* 原 #F5F9FB */
    color: var(--c-accent-red-text); /* 原 #a90000 */
}

.dark .bdl dl.a {
    background-color: var(--c-bg-card);
}

/* 4. 筛选分类标签 (.ttp) */
.dark .ttp a,
.dark .ttp strong {
    background: var(--c-bg-card);
    border-color: var(--c-border-medium);
    color: var(--c-text-secondary);
}

.dark .ttp a:hover {
    border-color: var(--c-accent-red-text);
    color: var(--c-accent-red-text);
}

.dark .ttp .a a {
    background: var(--c-bg-hover); /* 原 #e6e6e6 */
    border-color: var(--c-accent-red-bg);
    color: var(--c-accent-red-text);
}

.dark .ttp .pipe {
    background: var(--c-border-medium);
}

/* 5. 提示框与特殊区域 */
/* 新帖提示条 */
.dark .tl #forumnewshow,
.dark #hiddenthread {
    background: #3e2723; /* 深褐色代替原来的 #FFFAF3 */
    border-color: #5d4037;
}

.dark .tl #forumnewshow a,
.dark #hiddenthread a {
    color: #ffcc80; /* 淡金色文字 */
    border-color: #5d4037;
}

/* 代码块与引用 */
.dark .blockcode {
    background: #000; /* 原 #F7F7F7 */
    color: #a5d6a7; /* 代码着色改为淡绿 */
    border: 1px solid var(--c-border-light);
}
.dark .blockcode code {
    color: inherit;
}

/* 引用背景图反色处理逻辑：
   原图是浅灰色背景上的灰色引号。
   暗色模式下，背景变深，引用块改为深色背景，
   使用 brightness/contrast 滤镜让 SVG 引号可见 */
.dark .quote {
    background-color: var(--c-bg-quote);
    color: var(--c-text-secondary);
    /* 尝试反转背景图颜色使其在深色背景可见 */
    filter: invert(0.1);
}

/* 6. 版块规则/信息区域 (#fh) */
.dark #fh.m {
    background-color: var(--c-bg-card); /* 原 #F2F2F2 */
    border-bottom: 1px solid var(--c-border-light);
}

.dark .fl_row td {
    border-top-color: var(--c-border-light);
}

/* 7. 直播/动态回复 (#livereply...) */
.dark #livereplycontentout {
    background: var(--c-bg-card);
    border-color: var(--c-border-medium);
}

.dark #livefastcomment {
    background-color: var(--c-bg-card);
    border-color: var(--c-border-medium);
}

.dark #livereplymessage {
    background: transparent;
    color: var(--c-text-primary);
}

.dark #livereplycontent dl {
    border-top-color: var(--c-border-light);
}

.dark #liverefresh {
    background-color: #4a3b00; /* 深黄色背景 */
    border-color: #665c00;
    color: #ffd54f;
}

.dark #livethread {
    background: var(--c-bg-hover);
    border-top-color: var(--c-accent-blue);
}

/* 8. 杂项调整 */
/* 标签云 */
.dark #taglistarea .marked {
    color: var(--c-accent-red-text) !important;
}

/* 下拉菜单 */
.dark #newspecial_menu {
    background: var(--c-bg-card);
    border: 1px solid var(--c-border-medium);
}
.dark #newspecial_menu a:hover {
    color: var(--c-accent-red-text);
}

/* 图片查看器背景 */
.dark .zoominner {
    background: var(--c-bg-card);
}

/* 修复白色背景的占位图 */
.dark #threadbeginid .beginidimg {
    background: transparent;
}

/* 版块图标区域 */
.dark .fl_icn img {
    opacity: 0.8; /* 稍微降低图标亮度 */
}

/* 附件预览框 */
.dark .attach_preview {
    border-color: var(--c-border-medium);
    background-color: var(--c-bg-card);
}

/* 版主推荐/分类文字颜色修正 */
.dark .xi2 {
    color: var(--c-accent-red-text);
}

/* ==========================================================================
   Waterfall Layout Fixes (瀑布流布局补全)
   针对 .waterfall li, .c, .auth 等元素的修补
   ========================================================================== */

/* 1. 列表项边框 */
.dark .waterfall li {
    /* 原样式 border-top:1px solid #EAEAEA; */
    border-top-color: var(--c-border-light);
}

/* 2. 内容卡片与标题背景 */
.dark .waterfall .c,
.dark .waterfall h3 {
    /* 原样式 background-color:#F8F8F8; border:solid #EAEAEA; */
    background-color: var(--c-bg-card) !important;
    border-color: var(--c-border-light);
    color: var(--c-text-primary);
}

/* 标题链接颜色 */
.dark .waterfall h3 a {
    color: var(--c-text-primary);
}
.dark .waterfall h3 a:hover {
    color: var(--c-accent-red-text);
}

/* 3. 底部作者/信息栏 */
.dark .waterfall .auth {
    /* 原样式 background:#F8F8F8; border-color:transparent #EAEAEA #B9B9B9; */
    background-color: var(--c-bg-card) !important;
    border-right-color: var(--c-border-light) !important;
    border-bottom-color: var(--c-border-light) !important;
    color: var(--c-text-secondary);
}

.dark .waterfall .auth a {
    color: var(--c-text-secondary);
}
.dark .waterfall .auth a:hover {
    color: var(--c-accent-red-text);
}

/* 4. 图片占位符 (无图模式) */
.dark .waterfall .c .nopic {
    /* 原样式 background:#FFF; */
    background-color: var(--c-bg-input) !important;
    color: var(--c-text-secondary); /* 图标颜色 */
}

/* 5. 悬停效果增强 (可选) */
.dark .waterfall .c:hover {
    box-shadow: 0 4px 10px rgba(0,0,0,0.5); /* 增加暗色阴影 */
}

/* ==========================================================================
   Fix: TTP Number Badge Conflict
   修复分类筛选器数字角标与 .xg1 颜色冲突的问题
   ========================================================================== */

/* 1. 普通状态下的数字角标 */
.dark .ttp .num {
    /* 强制背景色为深灰色 (原 #999) */
    background-color: var(--c-border-medium) !important;

    /* 强制文字颜色为白色，覆盖 .xg1 的设置 */
    color: #fff !important;

    /* 确保圆角和边距样式 */
    border-radius: 4px;
}

/* 2. 选中状态下的数字角标 (.a 是 active 状态) */
.dark .ttp .a .num {
    /* 选中时使用红色或高亮背景 (原 #91BDD3) */
    background-color: var(--c-accent-red-bg) !important;
    color: #fff !important;
}

/* 3. 鼠标悬停时的微调 (可选) */
.dark .ttp a:hover .num {
    background-color: var(--c-accent-red-text) !important;
    color: #000 !important;
}

/* ==========================================================================
   Chiphell View Thread Dark Mode Overrides
   基于 style_22_forum_viewthread.css 适配
   ========================================================================== */

/* 1. 帖子楼层核心布局 (.pl, .pls, .plc) */
/* 左侧用户信息栏 */
.dark .pls {
    background-color: #252525; /* 比内容区稍亮，区分层级 (原 #e6e6e6) */
    border-right-color: var(--c-border-light); /* 原 #eeeeee */
    color: var(--c-text-secondary);
}

/* 右侧内容主区域 */
.dark .plc {
    background-color: var(--c-bg-card); /* 纯深色背景 */
    padding: 0 20px; /* 保持内边距 */
}

/* 楼层底部分隔线与背景 */
.dark .ad .pls,
.dark .ad .plc {
    background-color: var(--c-bg-base); /* 楼层间的间隔色 (原 #eeeeee) */
}

.dark .pl .pnv .pls,
.dark .pl .pnv .plc {
    background-color: var(--c-bg-header); /* 楼主/层主标识区 */
    border-color: var(--c-accent-red-bg);
}

/* 头像区域 */
.dark .pls .avatar img {
    background-color: var(--c-bg-card); /* 原 #FFF */
}

/* 用户信息文字 */
.dark .pls p em,
.dark .pls dt em {
    color: var(--c-accent-red-text);
}

.dark .pls .o {
    border-top-color: var(--c-border-light);
}

/* 2. 帖子内容元素 */
/* 标题与字体 */
.dark .pcb h1,
.dark .pcb h2 {
    color: var(--c-text-primary);
}

.dark .t_f,
.dark .t_f td {
    color: var(--c-text-primary);
}

.dark .t_f a {
    color: var(--c-text-link);
}

/* 签名档 (.sign) */
.dark .sign {
    border-top-color: var(--c-border-light); /* 原 #CCC */
    color: var(--c-text-secondary);
}

/* 底部操作栏 (.po, .pob) */
.dark .po {
    border-top-color: var(--c-border-light); /* 原 #DDD */
}
.dark .pob em a {
    color: var(--c-text-secondary);
}

/* 3. 引用与代码块 (覆盖 viewthread 特有的定义) */
.dark .pl .quote {
    background-color: var(--c-bg-quote); /* 原 #F9F9F9 */
    /* 这里的背景图是SVG气泡，反转颜色以适应暗色 */
    filter: invert(0.05);
    border: none;
}
.dark .pl .quote blockquote {
    color: var(--c-text-secondary);
}

.dark .pl .blockcode {
    background-color: #0d0d0d; /* 更深黑的背景 (原 #F7F7F7) */
    background-image: linear-gradient(90deg, #1a1a1a, #1a1a1a); /* 行号列背景 */
    border-color: var(--c-border-light);
    color: #a9b7c6; /* 代码文字颜色 */
}
.dark .pl .blockcode em {
    color: var(--c-accent-red-text) !important; /* "复制代码" 按钮 */
}
.dark .pl .blockcode ol li:hover {
    background-color: var(--c-bg-hover);
    color: var(--c-text-primary);
}

/* 4. 评分与点评 (.rate, .cm) */
/* 评分高亮区域 (通常是黄色背景) */
.dark .rate dt strong,
.dark .psth,
.dark .cm .psth {
    background-color: #3e2723; /* 深褐色代替亮黄 #FFF4DD */
    color: #ffcc80; /* 淡金色文字代替红色 */
}

.dark .rate dt strong a,
.dark .rate dt strong a em {
    color: #ffcc80;
}

.dark .rate .ratt,
.dark .ratl th,
.dark .ratl td,
.dark .ratc {
    border-bottom-color: var(--c-border-light);
}

/* 5. 底部按钮栏 (#p_btn) */
.dark #p_btn a {
    background-color: var(--c-bg-input); /* 原 #E6EDF2 */
    color: var(--c-text-primary);
}
.dark #p_btn a:hover {
    background-color: var(--c-bg-hover);
}
.dark #p_btn span {
    color: var(--c-text-secondary);
}

/* 6. 特殊提示框与隐藏内容 */
.dark #hiddenpoststip,
.dark .attach_nopermission,
.dark .locked {
    background-color: var(--c-bg-quote);
    border-color: var(--c-border-medium);
    color: var(--c-text-secondary);
}

.dark #hiddenpoststip a,
.dark .locked strong,
.dark .locked a {
    color: var(--c-accent-orange);
}

/* 顶部弹出提示 (如“您有新消息”) */
.dark .container {
    background-color: #3e2723; /* 原 #FEFEE9 */
    border-color: #5d4037;
    color: #ffcc80;
}
.dark .tig_bottom1 {
    color: #3e2723; /* 三角箭头颜色匹配 */
}

/* 7. 附件列表 (.tattl) */
.dark .tattl {
    background-color: transparent;
}
.dark .tattl dt strong {
    color: var(--c-accent-red-text);
}
.dark .tattl dd {
    color: var(--c-text-secondary);
}
.dark .attprice {
    border-color: var(--c-border-light);
}

/* 8. 快速发帖 (#vfastpost - 本文件中也有定义) */
.dark #vfastpost {
    background-color: var(--c-bg-card);
}
.dark #vfastpost #vf_m input {
    background-color: var(--c-bg-input);
    border-color: var(--c-border-medium);
}

/* 9. 图片列表导航 (#imagelist_nav) */
.dark #imagelist_nav {
    background-color: var(--c-bg-header); /* 原 #DDD */
}
.dark #imagelist_nav .imagelist_album a.left,
.dark #imagelist_nav .imagelist_album a.right {
    background-color: #000;
}

/* 10. 用户筛选列表 (.usl - 查看参与者等) */
.dark .usl a {
    border-color: transparent;
    color: var(--c-text-primary);
}
.dark .usl a:hover {
    background-color: var(--c-bg-hover);
    border-color: var(--c-border-light);
}
.dark .usl .avt {
    background-color: var(--c-bg-card);
    border-color: var(--c-border-light);
}

/* 11. 投票 (.pcht) */
.dark .pcht table tr.ptl td {
    border-bottom-color: var(--c-border-light);
}
.dark .pcht .imgf2 {
    background-color: var(--c-bg-input); /* 进度条槽背景 */
}

/* 12. 收藏/分享列表 (.clct_list) */
.dark .clct_list .xld .m {
    /* 保持原有渐变但降低亮度 */
    filter: brightness(0.7);
}
.dark .clct_flw strong {
    background-color: var(--c-bg-card);
    color: var(--c-text-primary);
}

/* 修复红色标签 */
.dark .ctag0 {
    background-color: #4a1c1c;
    color: #ffadad;
}
.dark .ctag1 {
    background-color: #4a3b00;
    color: #ffe082;
}
.dark .ctag2 {
    background-color: var(--c-bg-hover);
    color: var(--c-text-secondary);
}

/* ==========================================================================
   Block Header Fixes (.bm_h)
   修复通用模块标题栏的背景色和边框
   ========================================================================== */

/* 4. 标题栏内的链接颜色 (防止看不清) */
.dark .bm_h a {
    color: var(--c-text-primary);
}
.dark .bm_h a:hover {
    color: var(--c-accent-red-text);
}

/* 5. 标题栏右侧的操作图标/文字 (.o) */
.dark .bm_h .o {
    color: var(--c-text-secondary);
}

/* ==========================================================================
   Jump Menu Fixes (.jump_bdl)
   修复跳转菜单列表的背景和边框
   ========================================================================== */

/* 1. 列表项容器 */
.dark .jump_bdl li {
    /* 原样式: background:#FFF; border:1px solid #eeeeee; */
    background-color: var(--c-bg-card);
    border-color: var(--c-border-light);
}

/* 2. 链接文字颜色 */
.dark .jump_bdl a {
    /* 原样式: color:#444; */
    color: var(--c-text-primary);
}

/* 3. 选中项样式 (.a a) */
.dark .jump_bdl .a a,
.dark .jump_bdl .a a:hover {
    /* 原样式: background-color:#e6e6e6; */
    background-color: var(--c-bg-hover);
    color: var(--c-accent-red-text);
}

/* ==========================================================================
   Scroll Top Bar Fixes (#scrolltop)
   修复右下角悬浮工具条（返回顶部、快速回复等）
   ========================================================================== */

/* 1. 工具条容器背景 */
.dark #scrolltop {
    /* 原样式: background:#f4f4f4; border:1px #cdcdcd solid; */
    background-color: var(--c-bg-card) !important;
    border-color: var(--c-border-medium);
}

/* 2. 内部按钮样式 */
.dark #scrolltop a {
    /* 原样式: color:#BBB; border-top:1px #cdcdcd solid; */
    color: var(--c-text-secondary); /* 图标默认变暗 */
    border-top-color: var(--c-border-light); /* 分割线变暗 */
}

/* 3. 鼠标悬停交互 */
.dark #scrolltop a:hover {
    /* 原样式: color:#72A3D3; */
    color: var(--c-accent-blue); /* 悬停高亮色 */
    background-color: var(--c-bg-hover); /* 增加深色背景悬停反馈 */
}

.dark .pi strong a {border:1px solid var(--c-border-medium)}
.dark .nfl .f_c {background:var(--c-bg-card);border:3px solid var(--c-bg-hover)}
.dark .m_c {background:var(--c-bg-card)}
.dark .p_pop a:hover {background:var(--c-bg-hover)}
.dark .swiper-slide{background:var(--c-bg-card)}
.dark .lookmore a{background:var(--c-bg-card);border:1px solid var(--c-border-light)}
.dark .lookmore a:hover{background:var(--c-accent-red-bg)}
.dark li .avimain .asort,.dark li .avimain2 .asort{background:var(--c-border-medium)}
.dark li .avimain .asort:hover,.dark li .avimain2 .asort:hover{background:var(--c-accent-red-bg)}
    `);

    // 执行插入
    insertToggleButton();
})();
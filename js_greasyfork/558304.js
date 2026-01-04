// ==UserScript==
// @name         HDSky 论坛现代化布局
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  将HDSky论坛的表格布局转换为现代化的列表布局
// @author       江畔
// @match        *://hdsky.me/forums.php*
// @grant        GM_addStyle
// @run-at       document-end
// @charset      UTF-8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558304/HDSky%20%E8%AE%BA%E5%9D%9B%E7%8E%B0%E4%BB%A3%E5%8C%96%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/558304/HDSky%20%E8%AE%BA%E5%9D%9B%E7%8E%B0%E4%BB%A3%E5%8C%96%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        .post-list {
            list-style: none;
            padding: 0;
            margin: 0;
            background: #eff6ff;
        }

        .post-list-item {
            display: flex;
            align-items: flex-start;
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
            transition: background-color 0.2s;
        }

        .post-list-item:hover {
            background-color: #dbeafe;
        }

        .post-status-icon {
            width: 48px;
            height: 48px;
            margin-right: 12px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .post-status-icon img {
            display: block;
        }

        .post-list-content {
            flex: 1;
            min-width: 0;
        }

        .post-title {
            margin: 0 0 8px 0;
            font-size: 16px;
            line-height: 1.5;
            text-align: left;
        }

        .post-title a {
            color: #1f2937;
            text-decoration: none;
            font-weight: 500;
        }

        .post-title a:hover {
            color: #3b82f6;
        }

        .post-info {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 13px;
            color: #6b7280;
        }

        .info-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .info-item a {
            color: #6b7280;
            text-decoration: none;
        }

        .info-item a:hover {
            color: #3b82f6;
        }

        .post-category {
            background: #e5e7eb;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
        }

        .post-publish-date {
            color: #9ca3af;
            font-size: 12px;
        }

        .post-icon {
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: middle;
        }

        .sticky-tag {
            display: inline-block;
            background: #fbbf24;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            margin-right: 4px;
            vertical-align: middle;
        }

        .locked-tag {
            display: inline-block;
            background: #6b7280;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            margin-right: 4px;
            vertical-align: middle;
        }

        .modern-forum-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            display: block !important;
        }

        /* 确保父容器td#outer占满table.mainouter的宽度 */
        #outer {
            width: 100% !important;
            max-width: 100% !important;
        }

        .forum-header {
            background: #eff6ff;
            padding: 16px;
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 0;
        }

        .forum-header h1 {
            margin: 0;
            font-size: 24px;
            color: #1f2937;
        }

        .forum-moderators {
            background: #dbeafe;
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }

        /* 整体页面紧凑化 */
        body {
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }

        /* 限制所有表格最大宽度为60% */
        table.head {
            width: 60% !important;
            max-width: 60% !important;
            margin: 0 auto !important;
        }

        table.mainouter {
            width: 60% !important;
            max-width: 60% !important;
            padding: 5px !important;
            margin: 0 auto !important;
        }

        table.main {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
        }

        /* 限制页面中所有其他表格 */
        table {
            max-width: 60% !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        /* 嵌套在mainouter内的表格保持100% */
        table.mainouter table,
        table.mainouter table.main {
            max-width: 100% !important;
        }

        #nav_block {
            padding: 5px !important;
        }

        #info_block {
            font-size: 12px !important;
            padding: 8px !important;
            max-width: 100% !important;
        }

        #info_block .medium {
            font-size: 12px !important;
        }

        #info_block table {
            width: 100% !important;
            max-width: 100% !important;
        }

        /* 导航菜单紧凑化 */
        #mainmenu {
            font-size: 13px !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        #mainmenu li {
            padding: 4px 6px !important;
            margin: 0 !important;
        }

        #mainmenu a {
            padding: 4px 6px !important;
            display: inline-block;
        }

        /* 版主信息紧凑化 */
        table.main td.embedded {
            padding: 8px !important;
            font-size: 13px !important;
        }

        /* 标题区域紧凑化 */
        h1 {
            margin: 10px 0 !important;
            font-size: 20px !important;
        }

        /* 分页紧凑化 */
        form[onsubmit*="viewforum"] {
            margin: 10px 0 !important;
            padding: 8px !important;
        }

        form[onsubmit*="viewforum"] p {
            margin: 5px 0 !important;
            font-size: 13px !important;
        }

        /* 搜索表单紧凑化 */
        form[method="get"][action="forums.php"] {
            margin: 8px 0 !important;
        }

        form[method="get"][action="forums.php"] input {
            padding: 4px 8px !important;
            font-size: 13px !important;
        }

        /* 底部信息紧凑化 */
        #footer {
            font-size: 11px !important;
            padding: 10px !important;
            margin-top: 10px !important;
        }

        /* 响应式设计 - 平板 */
        @media screen and (max-width: 1024px) {
            table.head,
            table.mainouter {
                width: 80% !important;
                max-width: 80% !important;
            }

            table {
                max-width: 80% !important;
            }

            .modern-forum-container {
                width: 100% !important;
            }

            .post-list-item {
                padding: 12px;
            }

            .post-title {
                font-size: 15px;
            }

            .post-info {
                font-size: 12px;
                gap: 8px;
            }

            .post-status-icon {
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }
        }

        /* 移动端汉堡菜单按钮 */
        .mobile-menu-toggle {
            display: none;
            position: fixed;
            top: 20px;
            right: 15px;
            z-index: 1001;
            background: white;
            color: #1e3a8a;
            border: none;
            border-radius: 8px;
            padding: 0;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.3s;
            width: 48px;
            height: 48px;
            align-items: center;
            justify-content: center;
        }

        .mobile-menu-toggle:active {
            background: #f1f5f9;
            transform: scale(0.95);
        }

        .mobile-menu-toggle.active {
            background: white;
            color: #dc2626;
        }

        /* 移动端导航遮罩层 */
        .mobile-menu-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }

        .mobile-menu-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        /* 移动端导航菜单 */
        .mobile-nav-menu {
            display: block;
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            max-width: 85vw;
            height: 100vh;
            background: white;
            z-index: 1000;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            transition: right 0.3s ease;
        }

        .mobile-nav-menu.active {
            right: 0;
        }

        @media screen and (min-width: 769px) {
            .mobile-nav-menu,
            .mobile-menu-overlay,
            .mobile-menu-toggle {
                display: none !important;
            }
        }

        .mobile-nav-header {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
        }

        .mobile-nav-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .mobile-nav-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .mobile-nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .mobile-nav-list li {
            border-bottom: 1px solid #e5e7eb;
        }

        .mobile-nav-list a {
            display: block;
            padding: 16px 20px;
            color: #1f2937;
            text-decoration: none;
            font-size: 15px;
            transition: background 0.2s;
        }

        .mobile-nav-list a:hover,
        .mobile-nav-list li.selected a {
            background: #eff6ff;
            color: #3b82f6;
        }

        .mobile-nav-list .pmenu > a {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .mobile-nav-list .submenu {
            display: none;
            background: #f9fafb;
            padding-left: 0;
        }

        .mobile-nav-list .submenu.active {
            display: block;
        }

        .mobile-nav-list .submenu li {
            border-bottom: 1px solid #e5e7eb;
        }

        .mobile-nav-list .submenu a {
            padding-left: 40px;
            font-size: 14px;
            color: #6b7280;
        }

        .mobile-nav-list .submenu a:hover {
            background: #e5e7eb;
            color: #3b82f6;
        }

        .mobile-nav-arrow {
            transition: transform 0.3s;
        }

        .mobile-nav-arrow.rotated {
            transform: rotate(180deg);
        }

        /* 响应式设计 - 移动端 */
        @media screen and (max-width: 768px) {
            /* 页面占满宽度，移除所有padding和margin */
            * {
                box-sizing: border-box !important;
            }

            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100vw !important;
                max-width: 100vw !important;
                overflow-x: hidden !important;
            }

            /* 移除所有表格的居中对齐和宽度限制 */
            table {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            table[align="center"] {
                margin-left: 0 !important;
                margin-right: 0 !important;
            }

            td, tr {
                padding: 0 !important;
            }

            /* 头部区域 - 完全占满 */
            table.head {
                width: 100% !important;
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                padding: 15px !important;
            }

            table.head td {
                padding: 10px !important;
                text-align: center !important;
            }

            table.head td[align="right"] {
                display: none !important;
            }

            .logo_img {
                text-align: center !important;
                width: 100% !important;
            }

            .logo_img img {
                max-width: 200px !important;
                height: auto !important;
            }

            /* 主容器 - 完全占满 */
            table.mainouter {
                width: 100% !important;
                padding: 0 !important;
                background: #f8fafc;
            }

            table.mainouter td {
                padding: 0 !important;
            }

            table.main {
                width: 100% !important;
                padding: 0 !important;
            }

            table.main td.embedded {
                padding: 0 !important;
            }

            /* 用户信息区域 - 现代化卡片 */
            #info_block {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white;
                border-bottom: 1px solid #e5e7eb;
            }

            #info_block td {
                padding: 15px !important;
            }

            #info_block table {
                width: 100% !important;
                padding: 0 !important;
            }

            #info_block .medium {
                font-size: 15px !important;
                line-height: 1.8;
            }

            #info_block a {
                font-size: 15px !important;
                color: #3b82f6 !important;
            }

            #info_block img.inbox {
                vertical-align: middle !important;
            }

            /* 导航块 - 完全隐藏（使用移动菜单代替） */
            #nav_block {
                display: none !important;
            }

            /* 内容区域 - 完全占满 */
            #outer {
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
            }

            .modern-forum-container {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* 显示移动端菜单按钮 */
            .mobile-menu-toggle {
                display: flex !important;
            }

            /* 帖子列表现代化设计 - 统一风格 */
            .post-list {
                background: white;
                border-radius: 0;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none;
            }

            .post-list-item {
                padding: 20px 16px;
                margin: 0;
                border-bottom: 1px solid #e5e7eb;
                flex-direction: row;
                align-items: flex-start;
                background: white;
                transition: background-color 0.2s;
            }

            .post-list-item:active {
                background: #f8fafc;
            }

            .post-list-item:last-child {
                border-bottom: none;
            }

            .post-status-icon {
                width: 40px;
                height: 40px;
                margin-right: 14px;
                flex-shrink: 0;
            }

            .post-status-icon img {
                width: 24px;
                height: 24px;
            }

            .post-list-content {
                flex: 1;
                min-width: 0;
            }

            .post-title {
                font-size: 17px !important;
                margin-bottom: 12px;
                line-height: 1.5;
                font-weight: 500;
            }

            .post-title a {
                color: #1e293b !important;
                font-weight: 500;
                font-size: 17px !important;
                text-decoration: none;
            }

            .post-info {
                font-size: 14px !important;
                gap: 10px;
                flex-wrap: wrap;
                flex-direction: row;
            }

            .info-item {
                margin-bottom: 0;
                color: #64748b;
                font-size: 14px !important;
            }

            .info-item a {
                color: #64748b;
                font-size: 14px !important;
                text-decoration: none;
            }

            .sticky-tag {
                font-size: 11px !important;
                padding: 3px 8px;
                margin-right: 6px;
                background: #f59e0b !important;
            }

            .locked-tag {
                font-size: 11px !important;
                padding: 3px 8px;
                margin-right: 6px;
                background: #64748b !important;
            }


            /* 隐藏不必要的元素 */
            .goto-up, .goto-dn {
                display: none !important;
            }

            /* 分页优化 - 现代化设计 */
            form[onsubmit*="viewforum"] {
                padding: 20px 16px !important;
                background: white;
                border-radius: 0 !important;
                margin: 0 !important;
                border-top: 1px solid #e5e7eb;
                width: 100% !important;
            }

            form[onsubmit*="viewforum"] p {
                font-size: 15px !important;
                text-align: center;
                margin: 0 !important;
                line-height: 2;
            }

            form[onsubmit*="viewforum"] a {
                font-size: 15px !important;
                color: #3b82f6 !important;
                text-decoration: none;
                padding: 6px 10px;
            }

            form[onsubmit*="viewforum"] font {
                font-size: 15px !important;
            }

            form[onsubmit*="viewforum"] input[type="number"] {
                font-size: 15px !important;
                padding: 8px !important;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                margin: 0 8px;
            }

            form[onsubmit*="viewforum"] input[type="submit"] {
                font-size: 15px !important;
                padding: 8px 16px !important;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                margin: 0 8px;
            }
        }

        /* 超小屏幕（360px-480px）- 进一步优化 */
        @media screen and (max-width: 480px) {
            .post-list-item {
                padding: 16px 12px !important;
            }

            .post-title {
                font-size: 16px !important;
            }

            .post-title a {
                font-size: 16px !important;
            }

            .post-info {
                font-size: 13px !important;
                gap: 8px;
            }

            .info-item {
                font-size: 13px !important;
            }

            .info-item a {
                font-size: 13px !important;
            }

            .post-status-icon {
                width: 36px !important;
                height: 36px !important;
                margin-right: 10px !important;
            }

            #info_block .medium {
                font-size: 14px !important;
            }

            #info_block a {
                font-size: 14px !important;
            }

            form[onsubmit*="viewforum"] p {
                font-size: 14px !important;
            }

            form[onsubmit*="viewforum"] a {
                font-size: 14px !important;
            }
        }

        /* 触摸优化 */
        @media (hover: none) and (pointer: coarse) {
            .post-list-item {
                padding: 12px;
            }

            .post-title a, .info-item a {
                min-height: 44px;
                display: inline-flex;
                align-items: center;
            }

            #mainmenu a {
                min-height: 44px;
                display: flex;
                align-items: center;
            }
        }
    `);

    // 等待页面加载完成
    function init() {
        // 清理导航菜单，只保留首页、控制面板、论坛、体育沙龙
        cleanNavigationMenu();

        // 删除标题表格
        removeTitleTable();

        // 清理个人信息，只保留用户名、魔力值、收件箱
        cleanUserInfo();

        // 查找论坛帖子表格
        const forumTable = document.querySelector('table[border="1"][cellspacing="0"][cellpadding="5"]');
        if (!forumTable) {
            console.log('未找到论坛帖子表格');
            return;
        }

        // 提取帖子数据
        const posts = extractPosts(forumTable);
        if (posts.length === 0) {
            console.log('未找到帖子数据');
            return;
        }

        // 创建新的列表布局
        const newLayout = createModernLayout(posts);

        // 替换原有表格
        forumTable.parentNode.replaceChild(newLayout, forumTable);

        console.log(`已转换 ${posts.length} 个帖子为现代化布局`);

        // 清理outer td，只保留回帖表格和翻页表单
        cleanOuterTd();

        // 初始化移动端菜单
        initMobileMenu();
    }

    // 清理导航菜单，只保留首页、控制面板、论坛、体育沙龙
    function cleanNavigationMenu() {
        const mainMenu = document.getElementById('mainmenu');
        if (!mainMenu) {
            return;
        }

        // 需要保留的菜单项链接
        const keepLinks = [
            'index.php',                    // 首页
            'usercp.php',                   // 控制面板
            'forums.php',                   // 论坛（导航栏）
            'forums.php?action=viewforum&forumid=29'  // 体育沙龙
        ];

        // 获取所有菜单项
        const menuItems = Array.from(mainMenu.querySelectorAll('li'));

        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) {
                item.remove();
                return;
            }

            const href = link.getAttribute('href') || '';
            let shouldKeep = false;

            // 检查是否应该保留
            for (const keepLink of keepLinks) {
                if (href.includes(keepLink)) {
                    shouldKeep = true;
                    break;
                }
            }

            // 如果不应该保留，删除该项
            if (!shouldKeep) {
                item.remove();
            }
        });

        console.log('已清理导航菜单，只保留首页、控制面板、论坛、体育沙龙');
    }

    // 删除标题表格
    function removeTitleTable() {
        // 查找所有table.main元素
        const mainTables = document.querySelectorAll('table.main');

        for (let table of mainTables) {
            // 检查是否包含h1和faqlink，且不包含版主信息
            const h1 = table.querySelector('h1');
            const faqlink = table.querySelector('a.faqlink');
            const hasModerator = table.querySelector('img.forum_mod') || table.querySelector('img.f_new');

            if (h1 && faqlink && !hasModerator) {
                // 检查是否只包含标题内容
                const td = table.querySelector('td.embedded');
                if (td && td.querySelector('h1')) {
                    table.remove();
                    console.log('已删除标题表格');
                    break;
                }
            }
        }
    }

    // 清理个人信息，只保留用户名、魔力值、收件箱
    function cleanUserInfo() {
        const infoBlock = document.getElementById('info_block');
        if (!infoBlock) {
            return;
        }

        const leftCell = infoBlock.querySelector('td.bottom[align="left"]');
        const rightCell = infoBlock.querySelector('td.bottom[align="right"]');

        if (!leftCell) {
            return;
        }

        // 提取需要保留的元素
        const userNameLink = leftCell.querySelector('a[href*="userdetails"]');
        const bonusLink = leftCell.querySelector('a[href*="mybonus"]');
        const inboxLink = rightCell?.querySelector('a[href*="messages"]');

        // 获取魔力值文本（在"魔力值："和链接之间）
        let bonusText = '';
        const leftText = leftCell.textContent || '';
        const bonusMatch = leftText.match(/魔力值[：:].*?\[.*?\][：:]\s*([\d,]+\.?\d*)/);
        if (bonusMatch) {
            bonusText = bonusMatch[1];
        }

        // 获取收件箱信息
        let inboxText = '';
        if (rightCell) {
            // 获取收件箱文本（图标后面的文本）
            const rightText = rightCell.textContent || '';
            // 匹配格式：数字 (数字 新) 或 数字 (0 新)
            const inboxMatch = rightText.match(/(\d+)\s*\((\d+)\s*新\)/);
            if (inboxMatch) {
                inboxText = `${inboxMatch[1]} (${inboxMatch[2]} 新)`;
            } else {
                // 如果没有匹配到，尝试查找数字
                const simpleMatch = rightText.match(/(\d+)/);
                if (simpleMatch) {
                    inboxText = `${simpleMatch[1]} (0 新)`;
                }
            }
        }

        // 修改表格结构：让左侧单元格占据全部宽度
        const row = leftCell.closest('tr');
        if (row && rightCell) {
            // 设置左侧单元格占据两列
            leftCell.setAttribute('colspan', '2');
            // 删除右侧单元格
            rightCell.remove();
        }

        // 清空左侧单元格并重建内容，将所有信息都放到左侧
        leftCell.innerHTML = '';
        const leftSpan = document.createElement('span');
        leftSpan.className = 'medium';

        // 添加用户名
        if (userNameLink) {
            const welcomeText = document.createTextNode('欢迎回来, ');
            leftSpan.appendChild(welcomeText);
            const clonedUserNameLink = userNameLink.cloneNode(true);
            leftSpan.appendChild(clonedUserNameLink);
        }

        // 添加魔力值
        if (bonusText && bonusLink) {
            const bonusTextNode = document.createTextNode(' ');
            leftSpan.appendChild(bonusTextNode);
            const bonusFont = document.createElement('font');
            bonusFont.className = 'color_bonus';
            bonusFont.textContent = '魔力值：';
            leftSpan.appendChild(bonusFont);
            const bonusLinkEl = document.createElement('a');
            bonusLinkEl.href = bonusLink.href;
            bonusLinkEl.textContent = bonusText;
            leftSpan.appendChild(bonusLinkEl);
        }

        // 添加收件箱到左侧
        if (inboxLink && inboxText) {
            const inboxTextNode = document.createTextNode(' ');
            leftSpan.appendChild(inboxTextNode);
            // 克隆收件箱链接（包含图标）
            const clonedInboxLink = inboxLink.cloneNode(true);
            leftSpan.appendChild(clonedInboxLink);
            // 在链接后添加文本
            const inboxTextNode2 = document.createTextNode(' ' + inboxText);
            leftSpan.appendChild(inboxTextNode2);
        }

        leftCell.appendChild(leftSpan);

        console.log('已清理个人信息，只保留用户名、魔力值、收件箱');
    }

    // 清理outer td，只保留回帖表格和翻页表单
    function cleanOuterTd() {
        const outerTd = document.getElementById('outer');
        if (!outerTd) {
            return;
        }

        // 查找需要保留的元素
        const modernContainer = outerTd.querySelector('.modern-forum-container');
        const paginationForm = outerTd.querySelector('form[onsubmit*="viewforum"]');

        // 保存需要保留的元素
        const elementsToKeep = [];
        if (modernContainer) {
            elementsToKeep.push(modernContainer);
        }
        if (paginationForm) {
            elementsToKeep.push(paginationForm);
        }

        // 删除所有子节点
        while (outerTd.firstChild) {
            outerTd.removeChild(outerTd.firstChild);
        }

        // 重新添加需要保留的元素
        elementsToKeep.forEach(element => {
            outerTd.appendChild(element);
        });

        // 删除页面中的滚动按钮（如果存在）
        const scrollButtons = document.querySelectorAll('.goto-up, .goto-dn');
        scrollButtons.forEach(btn => {
            const parent = btn.parentNode;
            if (parent && parent.style && parent.style.position === 'fixed') {
                parent.remove();
            }
        });

        console.log('已清理outer td，只保留回帖表格和翻页表单');
    }

    // 初始化移动端导航菜单
    function initMobileMenu() {
        // 检查是否是移动端
        if (window.innerWidth > 768) {
            return;
        }

        const navBlock = document.getElementById('nav_block');
        if (!navBlock) {
            return;
        }

        const mainMenu = document.getElementById('mainmenu');
        if (!mainMenu) {
            return;
        }

        // 创建移动端菜单按钮
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.setAttribute('aria-label', '打开菜单');
        document.body.appendChild(menuToggle);

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);

        // 创建移动端菜单容器
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-nav-menu';

        // 创建菜单头部
        const menuHeader = document.createElement('div');
        menuHeader.className = 'mobile-nav-header';
        menuHeader.innerHTML = `
            <span>菜单</span>
            <button class="mobile-nav-close" aria-label="关闭菜单">×</button>
        `;
        mobileMenu.appendChild(menuHeader);

        // 复制导航菜单内容
        const menuList = document.createElement('ul');
        menuList.className = 'mobile-nav-list';

        // 克隆并转换菜单项
        const menuItems = mainMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            const clonedItem = item.cloneNode(true);
            const link = clonedItem.querySelector('a');

            if (clonedItem.classList.contains('pmenu')) {
                // 处理有子菜单的项
                const submenu = clonedItem.querySelector('.submenu');
                if (submenu && link) {
                    const arrow = document.createElement('span');
                    arrow.className = 'mobile-nav-arrow';
                    arrow.innerHTML = '▼';
                    link.appendChild(arrow);

                    submenu.className = 'submenu';
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        submenu.classList.toggle('active');
                        arrow.classList.toggle('rotated');
                    });
                }
            }

            menuList.appendChild(clonedItem);
        });

        mobileMenu.appendChild(menuList);
        document.body.appendChild(mobileMenu);

        // 菜单切换功能
        function openMenu() {
            menuToggle.classList.add('active');
            menuToggle.innerHTML = '✕';
            overlay.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            menuToggle.innerHTML = '☰';
            overlay.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        // 绑定事件
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        const closeBtn = menuHeader.querySelector('.mobile-nav-close');
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        // 点击菜单项后关闭菜单（除了有子菜单的项）
        menuList.querySelectorAll('li:not(.pmenu) a').forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(closeMenu, 300);
            });
        });

        // 窗口大小改变时检查
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    closeMenu();
                }
            }, 250);
        });
    }

    // 提取帖子数据
    function extractPosts(table) {
        const posts = [];
        const rows = table.querySelectorAll('tr');

        rows.forEach((row, index) => {
            // 跳过表头
            if (index === 0) return;
            if (row.querySelector('.colhead')) return;

            // 只选择直接子 td，避免选到嵌套表格中的 td
            const cells = row.querySelectorAll(':scope > td');
            if (cells.length < 4) return;

            try {
                // 第一列：标题和状态
                const titleCell = cells[0];
                const titleLink = titleCell.querySelector('a[href*="viewtopic"]');
                if (!titleLink) return;

                const stickyIcon = titleCell.querySelector('img.sticky');
                const lockedIcon = titleCell.querySelector('img.locked');
                const statusIcon = titleCell.querySelector('img.unlocked, img.unlockednew, img.locked');

                // 第二列：作者信息
                const authorCell = cells[1];
                const authorLink = authorCell.querySelector('a[href*="userdetails"]');
                const dateSpan = authorCell.querySelector('font.small, font[class*="small"], .small');

                // 第三列：回复/查看数
                const statsCell = cells[2];
                const statsText = statsCell.textContent.trim();
                const statsParts = statsText.split('/');
                const replies = statsParts[0]?.trim() || '0';
                const views = statsParts[1]?.trim() || '0';

                // 第四列：最后回复
                const lastReplyCell = cells[3];
                // 获取第一个文本节点（时间）
                let lastReplyTime = '';
                for (let node of lastReplyCell.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent.trim();
                        if (text && text.length > 0) {
                            lastReplyTime = text;
                            break;
                        }
                    }
                }
                const lastReplyUser = lastReplyCell.querySelector('a[href*="userdetails"]');

                const post = {
                    title: titleLink.textContent.trim(),
                    titleHref: titleLink.href,
                    titleColor: titleLink.querySelector('font')?.getAttribute('color') || '',
                    author: authorLink ? authorLink.textContent.trim() : '未知',
                    authorHref: authorLink ? authorLink.href : '#',
                    authorId: authorLink ? authorLink.href.match(/id=(\d+)/)?.[1] : '0',
                    date: dateSpan ? dateSpan.textContent.trim() : '',
                    replies: replies,
                    views: views,
                    lastReplyTime: lastReplyTime,
                    lastReplyUser: lastReplyUser ? lastReplyUser.textContent.trim() : '',
                    lastReplyUserHref: lastReplyUser ? lastReplyUser.href : '#',
                    isSticky: !!stickyIcon,
                    isLocked: !!lockedIcon,
                    isUnread: statusIcon?.classList.contains('unlockednew')
                };

                posts.push(post);
            } catch (e) {
                console.error('解析帖子数据失败:', e, row);
            }
        });

        return posts;
    }

    // 创建现代化布局
    function createModernLayout(posts) {
        const container = document.createElement('div');
        container.className = 'modern-forum-container';

        const ul = document.createElement('ul');
        ul.className = 'post-list';

        posts.forEach(post => {
            const li = createPostItem(post);
            ul.appendChild(li);
        });

        container.appendChild(ul);
        return container;
    }

    // 创建单个帖子项
    function createPostItem(post) {
        const li = document.createElement('li');
        li.className = 'post-list-item';

        // 创建状态图标（使用原始的帖子状态图标）
        const statusIcon = document.createElement('div');
        statusIcon.className = 'post-status-icon';
        const statusImg = document.createElement('img');
        statusImg.src = 'pic/trans.gif';

        // 根据帖子状态设置图标类名
        if (post.isLocked) {
            statusImg.className = 'locked';
            statusImg.alt = 'locked';
            statusImg.title = '锁定';
        } else if (post.isUnread) {
            statusImg.className = 'unlockednew';
            statusImg.alt = 'unread';
            statusImg.title = '未读';
        } else {
            statusImg.className = 'unlocked';
            statusImg.alt = 'read';
            statusImg.title = '已读';
        }

        statusIcon.appendChild(statusImg);

        // 创建内容区域
        const contentDiv = document.createElement('div');
        contentDiv.className = 'post-list-content';

        // 创建标题
        const titleDiv = document.createElement('div');
        titleDiv.className = 'post-title';
        titleDiv.setAttribute('role', 'heading');
        titleDiv.setAttribute('aria-level', '3');

        // 添加置顶/锁定标签
        if (post.isSticky) {
            const stickyTag = document.createElement('span');
            stickyTag.className = 'sticky-tag';
            stickyTag.textContent = '置顶';
            titleDiv.appendChild(stickyTag);
        }
        if (post.isLocked) {
            const lockedTag = document.createElement('span');
            lockedTag.className = 'locked-tag';
            lockedTag.textContent = '锁定';
            titleDiv.appendChild(lockedTag);
        }

        const titleLink = document.createElement('a');
        titleLink.href = post.titleHref;
        titleLink.textContent = post.title;
        if (post.titleColor) {
            titleLink.style.color = post.titleColor;
        }
        titleDiv.appendChild(titleLink);

        // 创建信息栏
        const infoDiv = document.createElement('div');
        infoDiv.className = 'post-info';

        // 作者信息
        const authorSpan = document.createElement('span');
        authorSpan.className = 'info-item info-author';
        authorSpan.innerHTML = `👤 <a href="${post.authorHref}">${post.author}</a>`;
        infoDiv.appendChild(authorSpan);

        // 查看数
        const viewsSpan = document.createElement('span');
        viewsSpan.className = 'info-item info-views';
        viewsSpan.innerHTML = `👁️ <span title="${post.views} views">${post.views}</span>`;
        infoDiv.appendChild(viewsSpan);

        // 回复数
        const repliesSpan = document.createElement('span');
        repliesSpan.className = 'info-item info-comments-count';
        repliesSpan.innerHTML = `💬 <span title="${post.replies} comments">${post.replies}</span>`;
        infoDiv.appendChild(repliesSpan);

        // 最后回复者
        if (post.lastReplyUser) {
            const lastCommenterSpan = document.createElement('span');
            lastCommenterSpan.className = 'info-item info-last-commenter';
            lastCommenterSpan.innerHTML = `⚡ <a href="${post.lastReplyUserHref}">${post.lastReplyUser}</a>`;
            infoDiv.appendChild(lastCommenterSpan);
        }

        // 最后回复时间
        if (post.lastReplyTime) {
            const timeSpan = document.createElement('span');
            timeSpan.className = 'info-item info-last-comment-time';
            timeSpan.innerHTML = `🕒 最后回复: ${post.lastReplyTime}`;
            infoDiv.appendChild(timeSpan);
        }

        // 发布日期
        if (post.date) {
            const dateSpan = document.createElement('span');
            dateSpan.className = 'info-item post-publish-date';
            dateSpan.innerHTML = `📅 发布: ${post.date}`;
            infoDiv.appendChild(dateSpan);
        }

        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(infoDiv);

        li.appendChild(statusIcon);
        li.appendChild(contentDiv);

        return li;
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


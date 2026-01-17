// ==UserScript==
// @name         过早客夜间模式
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  为过早客网站添加夜间模式功能
// @author       You
// @match        https://www.guozaoke.com/*
// @match        https://guozaoke.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562831/%E8%BF%87%E6%97%A9%E5%AE%A2%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/562831/%E8%BF%87%E6%97%A9%E5%AE%A2%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否启用夜间模式
    const isDarkMode = GM_getValue('darkMode', false);

    // 夜间模式样式（完整版）
    const darkModeCSS = `
        /* ========== 全局基础样式 - 最高优先级 ========== */
        html {
            background-color: #1a1a1a !important;
            background: #1a1a1a !important;
        }

        body,
        body[style],
        html body {
            background-color: #1a1a1a !important;
            background: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* 覆盖所有可能的背景色内联样式 */
        body[style*="background"],
        html[style*="background"] {
            background-color: #1a1a1a !important;
            background: #1a1a1a !important;
        }

        /* ========== 导航栏 - 强化处理 ========== */
        .top-navbar,
        .top-navbar[style],
        nav.top-navbar,
        nav.navbar.top-navbar,
        .navbar.top-navbar {
            background-color: #2d2d2d !important;
            background: #2d2d2d !important;
            border-color: #404040 !important;
        }

        .top-navbar .nav li a {
        text-shadow: 0 1px 0 #000 !important;
        }

        .navbar-default,
        .navbar-default[style],
        nav.navbar-default,
        .navbar.navbar-default {
            background-color: #2d2d2d !important;
            background: #2d2d2d !important;
            border-color: #404040 !important;
        }

        .navbar-default .navbar-brand,
        .navbar-default .navbar-nav > li > a,
        .navbar-default .navbar-nav > li > a:visited {
            color: #e0e0e0 !important;
        }

        .navbar-default .navbar-nav > li > a:hover,
        .navbar-default .navbar-nav > li > a:focus {
            color: #ffffff !important;
            background-color: #3d3d3d !important;
        }

        .divider-vertical {
            border-left-color: #404040 !important;
        }

        /* ========== 容器和卡片 ========== */
        .container-box {
            background-color: #2d2d2d !important;
            border-color: #404040 !important;
            color: #e0e0e0 !important;
        }

        .container {
            background-color: transparent !important;
        }

        .mt10, .mt15 {
            background-color: transparent !important;
        }

        .container .topic-detail .ui-header {
            background-image: -webkit-gradient(linear, left top, left bottom, from(#000), to(#2d2d2d));
            border-bottom: 1px solid #111;
        }

        .container .topic-detail .ui-footer {
            background-image: -webkit-gradient(linear, left top, left bottom, from(#000), to(#2d2d2d));
            border-top: 1px solid #111;
        }

        .container .sidebar-left .container-box .ui-header {
            background-image: -webkit-gradient(linear, left top, left bottom, from(#000), to(#2d2d2d));
            border-top: 1px solid #111;
        }


        /* ========== 话题列表 ========== */
        .topics {
            background-color: transparent !important;
        }

        .topic-item {
            background-color: #2d2d2d !important;
            border-bottom-color: #404040 !important;
        }

        .topic-item:hover {
            background-color: #353535 !important;
        }

        .topic-item .title {
            text-shadow: 0 1px 0 #000 !important;
        }

        .topic-item .title a,
        .topic-item .title a:visited {
            color: #e0e0e0 !important;
        }

        .topic-item .title a:hover {
            color: #ffffff !important;
        }

        .topic-item .meta,
        .topic-item .meta a,
        .topic-item .meta a:visited {
            color: #b0b0b0 !important;
        }

        .topic-item .meta a:hover {
            color: #ffffff !important;
        }

        .topic-item .count a,
        .topic-item .count a:visited {
            color: #b0b0b0 !important;
            background-color: #3d3d3d !important;
            border-color: #505050 !important;
        }

        .topic-item .count a:hover {
            background-color: #4d4d4d !important;
            color: #ffffff !important;
        }

        .topic-item .node a {
            color: #6ab7ff !important;
        }

        .topic-item .username a {
            color: #6ab7ff !important;
        }

        .topic-item .last-reply-username a {
            color: #6ab7ff !important;
        }

        /* ========== 链接 ========== */
        a, a:visited {
            color: #6ab7ff !important;
        }

        a:hover, a:focus {
            color: #8cc8ff !important;
        }

        /* ========== 导航标签 ========== */
        .nav-pills > li > a,
        .nav-pills > li > a:visited {
            color: #e0e0e0 !important;
            background-color: transparent !important;
        }

        .nav-pills > li.active > a,
        .nav-pills > li.active > a:hover,
        .nav-pills > li.active > a:focus {
            background-color: #4a90e2 !important;
            color: #ffffff !important;
        }

        .nav-pills > li > a:hover {
            background-color: #3d3d3d !important;
            color: #ffffff !important;
        }

        /* ========== 按钮 ========== */
        .btn-primary,
        .btn-primary:visited {
            background-color: #4a90e2 !important;
            border-color: #357abd !important;
            color: #ffffff !important;
        }

        .btn-primary:hover,
        .btn-primary:focus {
            background-color: #357abd !important;
            border-color: #2a5f8f !important;
            color: #ffffff !important;
        }

        .btn-default,
        .btn-default:visited {
            background-color: #3d3d3d !important;
            border-color: #505050 !important;
            color: #e0e0e0 !important;
        }

        .btn-default:hover,
        .btn-default:focus {
            background-color: #4d4d4d !important;
            border-color: #606060 !important;
            color: #ffffff !important;
        }

        /* ========== 下拉菜单 ========== */
        .dropdown-menu {
            background-color: #2d2d2d !important;
            border-color: #404040 !important;
        }

        .dropdown-menu > li > a,
        .dropdown-menu > li > a:visited {
            color: #e0e0e0 !important;
        }

        .dropdown-menu > li > a:hover,
        .dropdown-menu > li > a:focus {
            background-color: #3d3d3d !important;
            color: #ffffff !important;
        }

        .dropdown-toggle {
            color: #ffffff !important;
        }

        /* ========== 表单控件 ========== */
        .form-control {
            background-color: #3d3d3d !important;
            border-color: #505050 !important;
            color: #e0e0e0 !important;
        }

        .form-control:focus {
            background-color: #3d3d3d !important;
            border-color: #4a90e2 !important;
            color: #ffffff !important;
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(74, 144, 226, 0.3) !important;
        }

        .form-control::placeholder {
            color: #888888 !important;
        }

        input[type="text"],
        input[type="search"],
        textarea {
            background-color: #3d3d3d !important;
            border-color: #505050 !important;
            color: #e0e0e0 !important;
        }

        input[type="text"]:focus,
        input[type="search"]:focus,
        textarea:focus {
            background-color: #3d3d3d !important;
            border-color: #4a90e2 !important;
            color: #ffffff !important;
        }

        /* ========== 侧边栏 ========== */
        .sidebar-right {
            background-color: transparent !important;
        }

        .sidebar-right .container-box {
            background-color: #2d2d2d !important;
        }

        .usercard {
            background-color: #2d2d2d !important;
        }

        .usercard .ui-header {
            background-color: #2d2d2d !important;
        }

        .usercard .ui-content {
            background-color: #2d2d2d !important;
        }

        .usercard .username {
            color: #e0e0e0 !important;
        }

        .usercard .website a {
            color: #6ab7ff !important;
        }

        .usercard .status a,
        .usercard .status a:visited {
            color: #6ab7ff !important;
        }

        .usercard .status strong {
            color: #e0e0e0 !important;
        }

        /* ========== 热门话题 ========== */
        .hot-topics {
            background-color: #2d2d2d !important;
        }

        .hot-topics .cell {
            border-bottom-color: #404040 !important;
            background-color: transparent !important;
        }

        .hot-topics .hot_topic_title a,
        .hot-topics .hot_topic_title a:visited {
            color: #e0e0e0 !important;
        }

        .hot-topics .hot_topic_title a:hover {
            color: #ffffff !important;
        }

        /* ========== 节点导航 ========== */
        .nodes-cloud {
            background-color: #2d2d2d !important;
        }

        .nodes-cloud .title {
            color: #e0e0e0 !important;
        }

        .nodes-cloud label {
            color: #b0b0b0 !important;
        }

        .nodes-cloud .nodes a,
        .nodes-cloud .nodes a:visited {
            color: #6ab7ff !important;
        }

        .nodes-cloud .nodes a:hover {
            color: #8cc8ff !important;
        }

        .nodes-cloud ul {
        text-shadow: 0 1px 0 #000 !important;
        }

        /* ========== 热门链接 ========== */
        .hotlink {
            background-color: transparent !important;
            text-shadow: 0 1px 0 #000 !important;
        }

        .hotlink a,
        .hotlink a:visited {
            color: #6ab7ff !important;
        }

        .hotlink a:hover {
            color: #8cc8ff !important;
        }

        /* ========== 分页 ========== */
        .pagination > li > a,
        .pagination > li > span,
        .pagination > li > a:visited {
            background-color: #3d3d3d !important;
            border-color: #505050 !important;
            color: #e0e0e0 !important;
            background-image: -webkit-linear-gradient(#000, #2d2d2d) !important;
            text-shadow: 0 1px 0 #000 !important;
        }

        .pagination > li > a:hover,
        .pagination > li > span:hover {
            background-color: #4d4d4d !important;
            border-color: #606060 !important;
            color: #ffffff !important;
        }

        .pagination > .active > a,
        .pagination > .active > span,
        .pagination > .active > a:hover,
        .pagination > .active > span:hover {
            background-color: #4a90e2 !important;
            border-color: #357abd !important;
            color: #ffffff !important;
        }

        .pagination > .disabled > a,
        .pagination > .disabled > span {
            background-color: #2d2d2d !important;
            border-color: #404040 !important;
            color: #707070 !important;
            cursor: not-allowed !important;
        }

        .pagination-wap {
            background-color: transparent !important;
        }

        .pagination-wap .btn-default {
            background-color: #3d3d3d !important;
            border-color: #505050 !important;
            color: #e0e0e0 !important;
        }

        .pagination-wap div {
            color: #e0e0e0 !important;
        }

        /* ========== 页脚 ========== */
        .footer {
            background-color: #1a1a1a !important;
            color: #b0b0b0 !important;
        }

        .footer .container {
            background-color: transparent !important;
        }

        .footer .footer-bg {
            background-color: transparent !important;
        }

        .footer .links,
        .footer .links span {
            color: #b0b0b0 !important;
        }

        .footer a,
        .footer a:visited {
            color: #6ab7ff !important;
        }

        .footer a:hover {
            color: #8cc8ff !important;
        }

        .fade-color {
            color: #b0b0b0 !important;
        }

        /* ========== 运行状态 ========== */
        .community-status {
            background-color: #2d2d2d !important;
        }

        .community-status dt {
            color: #b0b0b0 !important;
        }

        .community-status dd {
            color: #e0e0e0 !important;
        }

        /* ========== 热门节点 ========== */
        .hot-nodes {
            background-color: #2d2d2d !important;
        }

        .hot-nodes .ui-content a,
        .hot-nodes .ui-content a:visited {
            color: #6ab7ff !important;
        }

        .hot-nodes .ui-content a:hover {
            color: #8cc8ff !important;
        }

        /* ========== 标题 ========== */
        h1, h2, h3, h4, h5, h6 {
            color: #e0e0e0 !important;
        }

        /* ========== 通知指示器 ========== */
        .notification-indicator {
            color: #e0e0e0 !important;
        }

        .notification-indicator:hover {
            color: #ffffff !important;
        }

        .mail-status {
            background-color: transparent !important;
        }

        /* ========== 头像和图片 ========== */
        .avatar {
            border-color: #404040 !important;
            background-color: #2d2d2d !important;
        }

        img {
            opacity: 0.9;
        }

        img:hover {
            opacity: 1;
        }

        /* ========== 广告区域 ========== */
        .sidebox.ad {
            background-color: #2d2d2d !important;
        }

        .sidebox.ad .ui-content {
            background-color: #2d2d2d !important;
        }

        /* ========== 行和列 ========== */
        .row {
            background-color: transparent !important;
        }

        .col-md-9,
        .col-md-3,
        .col-sm-9,
        .col-sm-3 {
            background-color: transparent !important;
        }

        /* ========== 表格 ========== */
        table {
            background-color: transparent !important;
        }

        table td {
            background-color: transparent !important;
            color: #e0e0e0 !important;
        }

        /* ========== 清除浮动 ========== */
        .clearfix {
            background-color: transparent !important;
        }

        /* ========== 工具提示 ========== */
        .tooltipped {
            color: #e0e0e0 !important;
        }

        /* ========== 特殊类 ========== */
        .tr {
            background-color: transparent !important;
        }

        .fl, .fr {
            background-color: transparent !important;
        }

        .hidden-xs,
        .hidden-sm,
        .visible-xs-block {
            background-color: transparent !important;
        }

        /* ========== 图标 ========== */
        .icon-pushpin {
            color: #4a90e2 !important;
        }

        .octicon {
            color: #e0e0e0 !important;
        }

        /* ========== Bootstrap 特定类 ========== */
        .navbar-form {
            background-color: transparent !important;
        }

        .navbar-left,
        .navbar-right {
            background-color: transparent !important;
        }

        .caret {
            border-top-color: #e0e0e0 !important;
        }

        /* ========== 确保所有文本可见 ========== */
        span, div, p, li, td, th {
            color: inherit !important;
        }

        /* ========== 滚动条样式 ========== */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        ::-webkit-scrollbar-track {
            background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
            background: #404040;
            border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #505050;
        }
    `;

    // 强制设置导航栏样式
    function forceNavbarStyle() {
        const navbars = document.querySelectorAll('.top-navbar, .navbar-default, nav.top-navbar, nav.navbar-default');
        navbars.forEach(function(navbar) {
            if (navbar) {
                navbar.style.setProperty('background-color', '#2d2d2d', 'important');
                navbar.style.setProperty('background', '#2d2d2d', 'important');
            }
        });
    }

    // 创建切换按钮
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'dark-mode-toggle-btn';
        button.innerHTML = isDarkMode ? '🌙 夜间' : '☀️ 日间';
        button.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 10000;
            padding: 8px 16px;
            background-color: ${isDarkMode ? '#4a90e2' : '#f0f0f0'};
            color: ${isDarkMode ? '#ffffff' : '#333333'};
            border: 1px solid ${isDarkMode ? '#357abd' : '#ddd'};
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
            this.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });

        button.addEventListener('click', function() {
            const newMode = !GM_getValue('darkMode', false);
            GM_setValue('darkMode', newMode);

            const styleElement = document.getElementById('dark-mode-style');

            if (newMode) {
                if (!styleElement) {
                    const style = document.createElement('style');
                    style.id = 'dark-mode-style';
                    style.textContent = darkModeCSS;
                    document.head.appendChild(style);
                }
                // 强制设置 body 背景色
                document.body.style.setProperty('background-color', '#1a1a1a', 'important');
                document.body.style.setProperty('background', '#1a1a1a', 'important');
                document.documentElement.style.setProperty('background-color', '#1a1a1a', 'important');
                document.documentElement.style.setProperty('background', '#1a1a1a', 'important');
                // 强制设置导航栏样式
                forceNavbarStyle();

                button.innerHTML = '🌙 夜间';
                button.style.backgroundColor = '#4a90e2';
                button.style.color = '#ffffff';
                button.style.borderColor = '#357abd';
            } else {
                if (styleElement) {
                    styleElement.remove();
                }
                // 移除强制设置的样式
                document.body.style.removeProperty('background-color');
                document.body.style.removeProperty('background');
                document.documentElement.style.removeProperty('background-color');
                document.documentElement.style.removeProperty('background');
                // 移除导航栏强制样式
                const navbars = document.querySelectorAll('.top-navbar, .navbar-default');
                navbars.forEach(function(navbar) {
                    navbar.style.removeProperty('background-color');
                    navbar.style.removeProperty('background');
                });

                button.innerHTML = '☀️ 日间';
                button.style.backgroundColor = '#f0f0f0';
                button.style.color = '#333333';
                button.style.borderColor = '#ddd';
            }
        });

        return button;
    }

    // 初始化
    function init() {
        // 如果启用夜间模式，添加样式
        if (isDarkMode) {
            const styleId = 'dark-mode-style';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = darkModeCSS;
                document.head.appendChild(style);
            }
            // 强制设置 body 和 html 背景色
            document.body.style.setProperty('background-color', '#1a1a1a', 'important');
            document.body.style.setProperty('background', '#1a1a1a', 'important');
            document.documentElement.style.setProperty('background-color', '#1a1a1a', 'important');
            document.documentElement.style.setProperty('background', '#1a1a1a', 'important');
            // 强制设置导航栏样式
            forceNavbarStyle();
        }

        // 添加切换按钮（如果不存在）
        if (!document.getElementById('dark-mode-toggle-btn')) {
            const toggleButton = createToggleButton();
            document.body.appendChild(toggleButton);
        }
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听动态内容加载和样式变化
    const observer = new MutationObserver(function(mutations) {
        if (isDarkMode) {
            // 确保样式存在
            if (!document.getElementById('dark-mode-style')) {
                const style = document.createElement('style');
                style.id = 'dark-mode-style';
                style.textContent = darkModeCSS;
                document.head.appendChild(style);
            }
            // 持续强制设置 body 背景色（防止被覆盖）
            if (document.body) {
                document.body.style.setProperty('background-color', '#1a1a1a', 'important');
                document.body.style.setProperty('background', '#1a1a1a', 'important');
            }
            if (document.documentElement) {
                document.documentElement.style.setProperty('background-color', '#1a1a1a', 'important');
                document.documentElement.style.setProperty('background', '#1a1a1a', 'important');
            }
            // 持续强制设置导航栏样式
            forceNavbarStyle();
        }
    });

    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
})();
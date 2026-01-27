// ==UserScript==
// @name              护眼模式助手 - 简化版（新增墨黑模式）- 传统设置版
// @namespace         https://github.com/syhyz1990/darkmode
// @version           5.2.1
// @description       全网通用护眼模式，简化版（新增墨黑模式）- 传统设置面板，集成bilivod夜间模式优化
// @author            YouXiaoHou & 适配优化
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-darkmode.html
// @supportURL        https://github.com/syhyz1990/darkmode
// @match             *://*/*
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNOTMuNSA5NC1WjEwLjYgMCAyMC4zLTMuMyAyOC4yLTktOC4zIDIyLjUtMzAuMiAzOC2LTU2IDM4LjYtMzIuNyAwLTU5LjMtMjUuOC01OS4zLTU3LjdTMzIuOSA4LjcgNjUuNyA4LjdoMi4yQzU0LjYgMTcgNDUuNyAzMS41IDQ1LjcgNDhjMCAyNS43IDI1LjcgNDYuNiA1Mi4xIDQ2LjZ6IiBmaWxsPSIjZmZiNTc4Ii8+PHBhdGggZD0iTTEyMS42IDgxLjhjLS44IDAtMS42LjItMi4zLjctNy41IDUuMy0xNi41IDguMS0yNS44IDguMS0yNC4yIDAtNDMuOS0xOS4lLTQzLUtI9mmgxMy43YzEuNiAwIDIuOSAxLjMgMi45IDIuOXMtMS4zIDIuOS0yLjkgMi45em0xMy4yLTMxLjFoLTE0LjRjLTEuNiAwLTIuOS0xLjMtMi45LTIuOSAwLTEgLjQtMS45IDEuMi0yLjRsNi4yLTQuMWgtNC43YzEuNiAwIDIuOSAxLjMgMi45IDIuOXMtMS4yIDIuOS0yLjggMi45eiIgZmlsbD0iIzQ0NCIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/564075/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%20-%20%E7%AE%80%E5%8C%96%E7%89%88%EF%BC%88%E6%96%B0%E5%A2%9E%E5%A2%A8%E9%BB%91%E6%A8%A1%E5%BC%8F%EF%BC%89-%20%E4%BC%A0%E7%BB%9F%E8%AE%BE%E7%BD%AE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/564075/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%20-%20%E7%AE%80%E5%8C%96%E7%89%88%EF%BC%88%E6%96%B0%E5%A2%9E%E5%A2%A8%E9%BB%91%E6%A8%A1%E5%BC%8F%EF%BC%89-%20%E4%BC%A0%E7%BB%9F%E8%AE%BE%E7%BD%AE%E7%89%88.meta.js
// ==/UserScript==

;(function () {
    'use strict';

    // 存储所有菜单命令ID
    let menuCommands = [];

    let EyeProtect = {
        // 当前模式存储
        currentMode: null,

        // 默认配置
        defaults: {
            globalEnable: false,       // 全局开关
            enableList: [],           // 启用列表（白名单）
            autoExclude: true,        // 智能排除
            forcedEnableList: [],     // 强制启用列表
            originThemeColor: '#ffffff', // 原始主题色
            runDuringDay: true,       // 白天保持开启
            darkAuto: false,          // 跟随浏览器暗色模式
            customDayNight: '6:00|18:00', // 自定义昼夜时间
            autoSwitch: '',           // 自动切换模式
            customDark1: '60|50',     // 亮度模式设置
            customDark2: '60|40|50|50', // 暖色模式设置
            customDark3: '90',        // 反色模式设置
            dark3Exclude: 'img, .img, video, [style*="background"][style*="url"], svg, .video-player, .player, [class*="player"], [class*="Player"], [id*="player"], [id*="Player"], .plyr, .jw-player, .video-js', // 排除元素
            inkModeConfig: '#343c3e|#ffffff|#4a5457|#5d696c|#009688|#26a69a',
            siteSpecificModes: '{}'   // 网站专用模式
        },

        // 初始化
        init() {
            this.initConfig();
            this.saveOriginThemeColor();
            
            // 获取当前模式，修复可能的模式错误
            this.fixModeIssue();
            
            this.initMenu();
            this.applyMode();
            
            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
                this.applyMode();
                this.refreshMenu();
            });
            
            // 监听页面动态加载
            this.observeDOMChanges();
        },

        // 修复模式问题：确保模式正确
        fixModeIssue() {
            let storedMode = this.getConfig('currentMode');
            const validModes = ['light', 'dark', 'ink'];
            
            // 如果存储的模式不是有效模式，重置为light
            if (!validModes.includes(storedMode)) {
                this.setConfig('currentMode', 'light');
                this.currentMode = 'light';
            } else {
                this.currentMode = storedMode;
            }
        },

        // 初始化配置
        initConfig() {
            for (let key in this.defaults) {
                let value = GM_getValue(key);
                if (value === undefined) {
                    GM_setValue(key, this.defaults[key]);
                }
            }
            
            // 初始化当前模式
            if (GM_getValue('currentMode') === undefined) {
                GM_setValue('currentMode', 'light');
                this.currentMode = 'light';
            }
        },

        // 获取配置值
        getConfig(key) {
            return GM_getValue(key);
        },

        // 设置配置值
        setConfig(key, value) {
            GM_setValue(key, value);
        },

        // 保存原始主题色
        saveOriginThemeColor() {
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta && meta.content) {
                this.setConfig('originThemeColor', meta.content);
            }
        },

        // 监听DOM变化（用于动态加载的页面）
        observeDOMChanges() {
            const observer = new MutationObserver((mutations) => {
                // 检查是否需要重新应用模式
                let style = document.querySelector('style[id^="eye-protect-"]');
                if (!style && this.shouldApplyMode()) {
                    setTimeout(() => this.applyMode(), 100);
                }
                
                // 对特定网站特别处理
                if (window.location.hostname.includes('123pan.com') ||
                    window.location.hostname.includes('github.com') ||
                    window.location.hostname.includes('hemudu.cc') ||
                    window.location.hostname.includes('bilivod.com') ||
                    window.location.hostname.includes('zzoc.cc') ||
                    window.location.hostname.includes('lanzou')) {
                    setTimeout(() => this.applyMode(), 300);
                }
            });
            
            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        },

        // 判断是否为白天
        isDaytime() {
            let time = this.getConfig('customDayNight').split('|');
            let now = new Date();
            let currentTime = now.getHours() * 60 + now.getMinutes();
            let dayStart = this.timeToMinutes(time[0]);
            let dayEnd = this.timeToMinutes(time[1]);
            
            if (dayStart < dayEnd) {
                return currentTime >= dayStart && currentTime < dayEnd;
            } else {
                return currentTime >= dayStart || currentTime < dayEnd;
            }
        },

        timeToMinutes(timeStr) {
            let parts = timeStr.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
        },

        // 获取当前应该应用的模式
        getCurrentMode() {
            // 首先检查网站专用模式（最高优先级）
            let siteSpecificMode = this.getSiteSpecificMode();
            if (siteSpecificMode && siteSpecificMode !== 'default') {
                return siteSpecificMode;
            }
            
            // 确保只有有效模式
            let mode = this.currentMode || this.getConfig('currentMode');
            const validModes = ['light', 'dark', 'ink'];
            
            if (!validModes.includes(mode)) {
                mode = 'light';
                this.setConfig('currentMode', 'light');
            }
            
            // 如果启用了自动切换
            if (this.getConfig('autoSwitch')) {
                let modes = this.getConfig('autoSwitch').split('|');
                if (modes.length === 2) {
                    if (this.isDaytime()) {
                        mode = modes[0] === '1' ? 'dark' : modes[0] === '2' ? 'ink' : 'light';
                    } else {
                        mode = modes[1] === '1' ? 'dark' : modes[1] === '2' ? 'ink' : 'light';
                    }
                }
            }
            
            // 如果跟随浏览器暗色模式
            if (this.getConfig('darkAuto')) {
                let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark && mode === 'light') {
                    mode = 'dark';
                }
            }
            
            return mode;
        },

        // 彻底清理所有样式和修改
        cleanupAllStyles() {
            // 1. 移除所有样式标签
            let styles = document.querySelectorAll('style[id^="eye-protect-"]');
            styles.forEach(style => style.remove());
            
            // 2. 恢复原始主题色
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = this.getConfig('originThemeColor');
            }
            
            // 3. 移除动态添加的内联样式
            let elements = document.querySelectorAll('[data-eye-protect]');
            elements.forEach(element => {
                element.removeAttribute('data-eye-protect');
                element.removeAttribute('style');
            });
        },

        // 应用样式（带模式标识）
        applyStyle(css, modeId) {
            // 移除所有之前可能存在的样式
            this.cleanupAllStyles();
            
            let style = document.createElement('style');
            style.id = 'eye-protect-' + modeId;
            style.setAttribute('data-eye-protect-mode', modeId);
            style.innerHTML = css;
            document.head.appendChild(style);
            
            // 标记body，方便调试
            document.body.setAttribute('data-eye-protect', 'enabled');
            document.body.setAttribute('data-eye-mode', modeId);
        },

        // 获取网站专用模式
        getSiteSpecificMode() {
            try {
                let host = location.host;
                let siteModesStr = this.getConfig('siteSpecificModes') || '{}';
                let siteModes = {};
                
                siteModes = JSON.parse(siteModesStr);
                return siteModes[host] || null;
            } catch (e) {
                return null;
            }
        },

        // 设置网站专用模式
        setSiteSpecificMode(mode) {
            try {
                let host = location.host;
                let siteModesStr = this.getConfig('siteSpecificModes') || '{}';
                let siteModes = {};
                
                siteModes = JSON.parse(siteModesStr);
                
                if (mode === 'default' || mode === null) {
                    delete siteModes[host];
                } else {
                    siteModes[host] = mode;
                }
                
                this.setConfig('siteSpecificModes', JSON.stringify(siteModes));
            } catch (e) {
                console.error('设置网站专用模式出错:', e);
            }
        },

        // 应用夜间模式
        applyDarkMode() {
            // 彻底清理所有样式
            this.cleanupAllStyles();
            
            // 根据域名使用不同的处理逻辑
            let hostname = window.location.hostname;
            
            // 检查网站专用模式
            let siteSpecificMode = this.getSiteSpecificMode();
            
            if (siteSpecificMode === 'light') {
                // 如果网站专用模式是白天模式，清理样式
                this.cleanupAllStyles();
                return;
            } else if (hostname.includes('123pan.com')) {
                this.apply123PanInvertMode();
            } else if (hostname.includes('bilivod.com')) {
                // bilivod.com使用从第一个脚本移植的专门优化的夜间模式
                this.applyBilivodDarkMode();
            } else if (hostname.includes('lanzou')) {
                this.applyLanzouDarkMode();
            } else {
                // 其他网站使用经典夜间模式
                this.applyClassicDarkMode();
            }
            
            // 设置主题色为深色
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = '#131313';
            } else {
                let metaEle = document.createElement('meta');
                metaEle.name = 'theme-color';
                metaEle.content = '#131313';
                document.head.appendChild(metaEle);
            }
        },

        // 经典夜间模式（恢复以前的样式）
        applyClassicDarkMode() {
            let style_30 = this.getConfig('customDark3') || '90';
            let dark3Exclude = this.getConfig('dark3Exclude');
            
            let style_31 = `
                html {
                    filter: invert(${style_30}%) !important;
                    text-shadow: 0 0 0 !important;
                }
                ${dark3Exclude} {
                    filter: invert(1) !important;
                }
                img[alt="[公式]"] {
                    filter: none !important;
                }
                
                /* 确保设置面板不受影响 */
                .eye-protect-settings-panel,
                .eye-protect-settings-panel * {
                    filter: none !important;
                    background: none !important;
                    color: inherit !important;
                }
                
                /* 滚动条样式 */
                ::-webkit-scrollbar {
                    height: 12px !important;
                    width: 12px !important;
                }
                ::-webkit-scrollbar-thumb {
                    border-radius: 0;
                    border-color: transparent;
                    border-style: dashed;
                    background-color: #3f4752 !important;
                    background-clip: padding-box;
                    transition: background-color .32s ease-in-out;
                }
                ::-webkit-scrollbar-corner {
                    background: #202020 !important;
                }
                ::-webkit-scrollbar-track {
                    background-color: #22272e !important;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #3f4752 !important;
                }
            `;
            
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                style_31 = `
                    html {
                        filter: invert(${style_30}%) !important;
                        background-image: url();
                        text-shadow: 0 0 0 !important;
                    }
                    ${dark3Exclude} {
                        filter: invert(1) !important;
                    }
                    img[alt="[公式]"] {
                        filter: none !important;
                    }
                    
                    /* 确保设置面板不受影响 */
                    .eye-protect-settings-panel,
                    .eye-protect-settings-panel * {
                        filter: none !important;
                        background: none !important;
                        color: inherit !important;
                    }
                `;
            }
            
            this.applyStyle(style_31, 'dark-mode-classic');
        },

        // bilivod.com专用夜间模式（从第一个脚本移植的优化版本）
        applyBilivodDarkMode() {
            let style_30 = this.getConfig('customDark3') || '90';
            let isType32Page = window.location.pathname.includes('/type/32');
            
            let css = `
                /* bilivod.com专用夜间模式 - 使用${style_30}%反色 */
                
                /* 1. 对整个HTML应用反色 */
                html {
                    filter: invert(${style_30}%) hue-rotate(180deg) !important;
                    background-color: #1a1a1a !important;
                    text-shadow: 0 0 0 !important;
                }
                
                /* 2. 排除不需要反色的元素 */
                img, 
                svg, 
                video, 
                canvas,
                iframe, 
                embed, 
                object,
                [class*="icon"],
                [class*="Icon"],
                .icon, 
                .svg-icon, 
                .avatar, 
                .logo, 
                .thumbnail,
                .emoji,
                .emoticon,
                [src*=".svg"],
                [src*=".png"],
                [src*=".jpg"],
                [src*=".jpeg"],
                [src*=".gif"],
                [src*=".webp"],
                .video-player,
                .player,
                [class*="player"],
                [class*="Player"],
                [id*="player"],
                [id*="Player"],
                .plyr,
                .jw-player,
                .video-js {
                    filter: invert(1) hue-rotate(180deg) !important;
                }
                
                /* 3. 特殊处理 - 确保背景色正确 */
                body {
                    background-color: #1a1a1a !important;
                }
                
                /* 4. bilivod.com特定优化 */
                
                /* 4.1 覆盖所有白色背景 */
                body, 
                div, 
                section, 
                main, 
                article, 
                nav, 
                header, 
                footer, 
                aside,
                .container, 
                .wrapper, 
                .content, 
                .main-content,
                .panel, 
                .card, 
                .box, 
                .block,
                .list, 
                .item, 
                .entry,
                .video-list,
                .video-item,
                .vod-item,
                .movie-item,
                .film-item {
                    background-color: #1a1a1a !important;
                    color: #d0d0d0 !important;
                    border-color: #333 !important;
                }
                
                /* 4.2 强力覆盖所有内联白色背景 */
                [style*="background-color: white"],
                [style*="background: white"],
                [style*="background:#fff"],
                [style*="background-color:#fff"],
                [style*="background-color: #fff"],
                [style*="background-color: #ffffff"],
                [style*="background: #ffffff"],
                [style*="background-color: #f0f0f0"],
                [style*="background-color: #f5f5f5"],
                [style*="background-color: #f8f8f8"],
                [style*="background-color: #fafafa"],
                [style*="background-color: #fcfcfc"] {
                    background-color: #1a1a1a !important;
                }
                
                [style*="color: black"],
                [style*="color:#000"],
                [style*="color: #000"],
                [style*="color: #333"],
                [style*="color: #555"],
                [style*="color: #666"] {
                    color: #d0d0d0 !important;
                }
                
                /* 4.3 导航栏和头部 */
                .header, .navbar, .nav, .top-bar,
                .menu, .toolbar, .bar,
                [class*="header"], [class*="Header"],
                [class*="nav"], [class*="Nav"],
                [class*="menu"], [class*="Menu"] {
                    background-color: #222 !important;
                }
                
                /* 4.4 侧边栏 */
                .sidebar, .side-panel, .side-nav {
                    background-color: #222 !important;
                }
                
                /* 4.5 按钮和表单 */
                button, .btn, .button,
                input, textarea, select,
                .form-control, .input, .search-input {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                
                /* 4.6 链接和蓝色区域 */
                a, a:link, a:visited {
                    color: #ff7700 !important; /* 蓝色反色为橙色 */
                }
                a:hover {
                    color: #ff9933 !important;
                }
                
                [style*="background-color: blue"],
                [style*="background:#00f"],
                [style*="background-color:#00f"],
                [style*="background-color: #00f"],
                [style*="background-color: #0000ff"],
                [style*="background-color: #007bff"],
                .btn-primary, .primary, .blue {
                    background-color: #ff7700 !important;
                }
                
                /* 4.7 视频卡片和缩略图 */
                .video-card, .vod-card, .movie-card,
                .film-card, .thumb, .thumbnail,
                .poster, .cover {
                    background-color: #222 !important;
                    border-color: #333 !important;
                }
                
                .video-title, .vod-title, .movie-title,
                .film-title, .title, .name {
                    color: #ffffff !important;
                }
                
                .video-info, .vod-info, .movie-info,
                .film-info, .info, .meta {
                    color: #a0a0a0 !important;
                }
                
                /* 4.8 分页 */
                .pagination, .page-nav, .page-numbers {
                    background-color: #1a1a1a !important;
                }
                
                .page-item, .page-link {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                
                .active .page-link {
                    background-color: #ff7700 !important;
                    color: #ffffff !important;
                }
                
                /* 4.9 搜索框 */
                .search-box, .search-bar, .search-input {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                
                /* 4.10 分类和标签 */
                .category, .tag, .label,
                .badge, .chip, .mark {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                
                /* 4.11 滚动条 */
                ::-webkit-scrollbar {
                    background-color: #1a1a1a !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #444 !important;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #555 !important;
                }
                ::-webkit-scrollbar-track {
                    background-color: #222 !important;
                }
                
                /* 4.12 确保Firefox兼容性 */
                @-moz-document url-prefix() {
                    html {
                        filter: invert(${style_30}%) hue-rotate(180deg) !important;
                        background-image: url() !important;
                        background-color: #1a1a1a !important;
                    }
                }
                
                /* 4.13 确保设置面板不受影响 */
                .eye-protect-settings-panel,
                .eye-protect-settings-panel * {
                    filter: none !important;
                    background: none !important;
                    color: inherit !important;
                }
            `;
            
            // 专门为/type/32页面添加额外优化
            if (isType32Page) {
                css += `
                    /* === 专门针对 /type/32 页面的优化 === */
                    
                    /* 1. 分类页面标题区域优化 */
                    .type-header, .category-header, .page-header,
                    .title-area, .header-area {
                        background-color: #222 !important;
                        border-bottom: 2px solid #333 !important;
                    }
                    
                    /* 2. 分类页面内容区域 */
                    .type-content, .category-content, .page-content,
                    .main-area, .content-area {
                        background-color: #1a1a1a !important;
                    }
                    
                    /* 3. 分类页面侧边栏 */
                    .type-sidebar, .category-sidebar, .side-content,
                    .filter-area, .filter-sidebar {
                        background-color: #222 !important;
                        border-right: 1px solid #333 !important;
                    }
                    
                    /* 4. 分类页面筛选器 */
                    .filter, .filter-item, .filter-group,
                    .sort, .sort-item, .sort-group {
                        background-color: #2a2a2a !important;
                        color: #e0e0e0 !important;
                        border-color: #444 !important;
                    }
                    
                    /* 5. 分类页面视频列表 */
                    .type-video-list, .category-video-list,
                    .video-grid, .video-container {
                        background-color: #1a1a1a !important;
                    }
                    
                    /* 6. 分类页面视频项优化 */
                    .type-video-item, .category-video-item,
                    .vod-grid-item, .movie-grid-item {
                        background-color: #222 !important;
                        border: 1px solid #333 !important;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
                    }
                    
                    /* 7. 分类页面分页优化 */
                    .type-pagination, .category-pagination,
                    .pagination-container, .pagination-wrapper {
                        background-color: #1a1a1a !important;
                        border-top: 1px solid #333 !important;
                    }
                    
                    /* 8. 分类页面底部 */
                    .type-footer, .category-footer, .page-footer {
                        background-color: #222 !important;
                        border-top: 2px solid #333 !important;
                    }
                    
                    /* 9. 处理分类页面的特殊背景 */
                    [class*="type-32"], [class*="category-32"],
                    [id*="type32"], [id*="category32"] {
                        background-color: #1a1a1a !important;
                        color: #d0d0d0 !important;
                    }
                    
                    /* 10. 分类页面广告区域处理 */
                    .ad, .advertisement, .adsense,
                    [class*="ad-"], [id*="ad-"],
                    [class*="ads-"], [id*="ads-"] {
                        filter: brightness(0.8) !important;
                        background-color: #2a2a2a !important;
                    }
                    
                    /* 11. 分类页面工具提示 */
                    .tooltip, .tip, .hint {
                        background-color: #2a2a2a !important;
                        color: #e0e0e0 !important;
                        border: 1px solid #444 !important;
                    }
                    
                    /* 12. 分类页面模态框 */
                    .modal, .popup, .dialog,
                    .overlay, .lightbox {
                        background-color: rgba(0, 0, 0, 0.8) !important;
                    }
                    
                    /* 13. 分类页面加载动画 */
                    .loading, .spinner, .loader {
                        background-color: transparent !important;
                    }
                    
                    /* 14. 分类页面空状态 */
                    .empty, .no-results, .no-data {
                        background-color: #1a1a1a !important;
                        color: #888 !important;
                    }
                    
                    /* 15. 分类页面悬停效果优化 */
                    .video-item:hover, .vod-item:hover,
                    .movie-item:hover, .film-item:hover {
                        background-color: #2a2a2a !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4) !important;
                    }
                    
                    /* 16. 分类页面选中状态 */
                    .selected, .active-item, .current {
                        background-color: #333 !important;
                        border-color: #ff7700 !important;
                    }
                    
                    /* 17. 分类页面按钮组 */
                    .button-group, .btn-group, .action-group {
                        background-color: #222 !important;
                        border: 1px solid #333 !important;
                    }
                    
                    /* 18. 分类页面表单组 */
                    .form-group, .input-group, .field-group {
                        background-color: #222 !important;
                    }
                    
                    /* 19. 分类页面标签组 */
                    .tag-group, .label-group, .badge-group {
                        background-color: #222 !important;
                    }
                    
                    /* 20. 分类页面网格系统 */
                    .grid, .row, .column {
                        background-color: #1a1a1a !important;
                    }
                    
                    .grid-item, .col, .cell {
                        background-color: #222 !important;
                        border-color: #333 !important;
                    }
                    
                    /* 21. 分类页面响应式优化 */
                    @media (max-width: 768px) {
                        .type-header, .category-header {
                            background-color: #222 !important;
                        }
                        
                        .type-sidebar, .category-sidebar {
                            background-color: #222 !important;
                        }
                        
                        .video-item, .vod-item {
                            background-color: #222 !important;
                        }
                    }
                `;
            }
            
            this.applyStyle(css, 'dark-mode-bilivod');
        },

        // 123云盘优化的反色模式
        apply123PanInvertMode() {
            let style_30 = this.getConfig('customDark3') || '90';
            
            let css = `
                /* 123云盘优化反色模式 */
                html {
                    filter: invert(${style_30}%) hue-rotate(180deg) !important;
                    background-color: #1a1a1a !important;
                    text-shadow: 0 0 0 !important;
                }
                img, svg, video, canvas, iframe {
                    filter: invert(1) hue-rotate(180deg) !important;
                }
                body {
                    background-color: #1a1a1a !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .btn-primary, .primary, .blue,
                [style*="background-color: #007bff"],
                [style*="background-color: #0066cc"] {
                    background-color: #ff7700 !important;
                    border-color: #ff7700 !important;
                    color: white !important;
                }
                .header, .navbar, .sidebar, .side-nav {
                    background-color: #222 !important;
                    border-color: #333 !important;
                }
                .file-list, .folder-list, .grid-view, .list-view {
                    background-color: #1a1a1a !important;
                    border-color: #333 !important;
                }
                .file-item, .folder-item, .grid-item {
                    background-color: #222 !important;
                    color: #e0e0e0 !important;
                    border-color: #333 !important;
                    margin: 2px 0 !important;
                }
                .file-item:hover, .folder-item:hover {
                    background-color: #2a2a2a !important;
                }
                input, textarea, select, .form-control, .search-input {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                a, a:link, a:visited {
                    color: #ff7700 !important;
                }
                a:hover {
                    color: #ff9933 !important;
                }
                ::-webkit-scrollbar {
                    background-color: #222 !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #444 !important;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #ff7700 !important;
                }
                @-moz-document url-prefix() {
                    html {
                        filter: invert(${style_30}%) hue-rotate(180deg) !important;
                        background-image: url() !important;
                        background-color: #1a1a1a !important;
                    }
                }
                
                /* 确保设置面板不受影响 */
                .eye-protect-settings-panel,
                .eye-protect-settings-panel * {
                    filter: none !important;
                    background: none !important;
                    color: inherit !important;
                }
            `;
            
            this.applyStyle(css, 'dark-mode-123pan');
        },

        // 蓝奏云优化的反色模式
        applyLanzouDarkMode() {
            let style_30 = this.getConfig('customDark3') || '90';
            
            let css = `
                /* 蓝奏云夜间模式优化版 */
                html {
                    filter: invert(${style_30}%) hue-rotate(180deg) !important;
                    background-color: #1a1a1a !important;
                    text-shadow: 0 0 0 !important;
                }
                
                img, svg, video, canvas, iframe,
                .icon, .logo, .qrcode, .code-img,
                .verify-img, .captcha-img, .ad-container {
                    filter: invert(1) hue-rotate(180deg) !important;
                }
                
                body, html {
                    background-color: #1a1a1a !important;
                    color: #e0e0e0 !important;
                }
                
                div, section, main, article, nav, header, footer, aside,
                .container, .wrapper, .content, .main, .panel, .box {
                    background-color: #1a1a1a !important;
                    color: #e0e0e0 !important;
                }
                
                .file-list, .folder-list, .data-list,
                .table, .list-container, .list-box {
                    background-color: #222 !important;
                    border: 1px solid #333 !important;
                    border-radius: 6px !important;
                    padding: 10px !important;
                }
                
                .file-item, .folder-item, .list-item,
                tr, .data-item, .list-row {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #333 !important;
                    padding: 10px 15px !important;
                }
                
                button, .btn, input[type="button"],
                input[type="submit"], .download-btn,
                .submit-btn, .confirm-btn {
                    background-color: #0066cc !important;
                    color: white !important;
                    border: 1px solid #0066cc !important;
                    border-radius: 4px !important;
                    padding: 8px 16px !important;
                    cursor: pointer !important;
                }
                
                button:hover, .btn:hover, .download-btn:hover {
                    background-color: #0080ff !important;
                    border-color: #0080ff !important;
                }
                
                input, textarea, select, .form-control,
                .search-input, .text-input {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border: 1px solid #444 !important;
                    border-radius: 4px !important;
                    padding: 8px 12px !important;
                }
                
                a, a:link, a:visited {
                    color: #66aaff !important;
                }
                
                a:hover, a:active {
                    color: #88ccff !important;
                }
                
                ::-webkit-scrollbar {
                    width: 12px !important;
                    height: 12px !important;
                    background-color: #222 !important;
                }
                
                ::-webkit-scrollbar-thumb {
                    background-color: #444 !important;
                    border-radius: 6px !important;
                }
                
                @-moz-document url-prefix() {
                    html {
                        filter: invert(${style_30}%) hue-rotate(180deg) !important;
                        background-image: url() !important;
                        background-color: #1a1a1a !important;
                    }
                }
                
                /* 确保设置面板不受影响 */
                .eye-protect-settings-panel,
                .eye-protect-settings-panel * {
                    filter: none !important;
                    background: none !important;
                    color: inherit !important;
                }
            `;
            
            this.applyStyle(css, 'dark-mode-lanzou');
        },

        // 应用墨黑模式
        applyInkMode() {
            // 彻底清理所有样式
            this.cleanupAllStyles();
            
            // 获取墨黑模式配置
            let config = this.getConfig('inkModeConfig').split('|');
            let backgroundColor = config[0] || '#343c3e';
            let textColor = config[1] || '#ffffff';
            let secondaryBg = config[2] || '#4a5457';
            let borderColor = config[3] || '#5d696c';
            let primaryColor = config[4] || '#009688';
            let hoverColor = config[5] || '#26a69a';
            
            let css = this.generateInkModeCSS(backgroundColor, textColor, secondaryBg, borderColor, primaryColor, hoverColor);
            
            this.applyStyle(css, 'ink-mode');
            
            // 设置主题色
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = backgroundColor;
            } else {
                let metaEle = document.createElement('meta');
                metaEle.name = 'theme-color';
                metaEle.content = backgroundColor;
                document.head.appendChild(metaEle);
            }
        },

        // 生成墨黑模式CSS
        generateInkModeCSS(bgColor, textColor, secondaryBg, borderColor, primaryColor, hoverColor) {
            return `
                /* 墨黑模式 */
                html, body {
                    background-color: ${bgColor} !important;
                    color: ${textColor} !important;
                }
                div, section, main, article, nav, header, footer, aside,
                .container, .wrapper, .content, .card, .box {
                    background-color: ${bgColor} !important;
                    color: ${textColor} !important;
                    border-color: ${borderColor} !important;
                }
                p, span, h1, h2, h3, h4, h5, h6 {
                    color: ${textColor} !important;
                }
                a, a:link, a:visited {
                    color: ${primaryColor} !important;
                }
                a:hover, a:active {
                    color: ${hoverColor} !important;
                }
                button, .btn, input[type="button"], input[type="submit"] {
                    background-color: ${secondaryBg} !important;
                    color: ${textColor} !important;
                    border-color: ${borderColor} !important;
                }
                button:hover, .btn:hover {
                    background-color: ${primaryColor} !important;
                    border-color: ${primaryColor} !important;
                }
                input, textarea, select {
                    background-color: ${secondaryBg} !important;
                    color: ${textColor} !important;
                    border-color: ${borderColor} !important;
                }
                input:focus, textarea:focus {
                    border-color: ${primaryColor} !important;
                }
                table, tr, th, td {
                    background-color: ${bgColor} !important;
                    color: ${textColor} !important;
                    border-color: ${borderColor} !important;
                }
                th {
                    background-color: ${secondaryBg} !important;
                }
                tr:nth-child(even) {
                    background-color: ${secondaryBg} !important;
                }
                ::-webkit-scrollbar {
                    width: 12px !important;
                    height: 12px !important;
                    background-color: ${secondaryBg} !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: ${borderColor} !important;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: ${primaryColor} !important;
                }
                
                /* 确保设置面板不受影响 */
                .eye-protect-settings-panel,
                .eye-protect-settings-panel * {
                    filter: none !important;
                    background: none !important;
                    color: inherit !important;
                }
            `;
        },

        // 是否应该排除当前网站
        shouldExcludeSite() {
            let hostname = window.location.hostname;
            
            // 对于特定网站，我们使用专门的处理逻辑
            if (hostname.includes('123pan.com') || 
                hostname.includes('github.com') ||
                hostname.includes('hemudu.cc') ||
                hostname.includes('bilivod.com') ||
                hostname.includes('zzoc.cc') ||
                hostname.includes('lanzou')) {
                return false;
            }
            
            let forcedList = this.getConfig('forcedEnableList');
            if (forcedList.includes(location.host)) {
                return false;
            }
            
            // 通用排除逻辑
            let html = document.documentElement;
            let body = document.body;
            
            if (document.querySelector('head>meta[name="color-scheme"],head>link[href^="resource:"]')) {
                return true;
            }
            
            if (html.className.includes('dark') || body.className.includes('dark')) {
                return true;
            }
            
            if (html.getAttribute('data-theme') && html.getAttribute('data-theme').includes('dark')) {
                return true;
            }
            
            if (html.getAttribute('data-color-mode') && html.getAttribute('data-color-mode').includes('dark')) {
                return true;
            }
            
            return false;
        },

        // 是否应该应用模式
        shouldApplyMode() {
            let globalEnable = this.getConfig('globalEnable');
            let enableList = this.getConfig('enableList');
            let host = location.host;
            
            // 如果当前模式被激活，即使全局未开启，也应该应用
            let currentMode = this.getCurrentMode();
            if ((currentMode === 'dark' || currentMode === 'ink') && enableList.includes(host)) {
                return true;
            }
            
            return globalEnable || enableList.includes(host);
        },

        // 应用模式
        applyMode() {
            if (!this.shouldApplyMode()) {
                this.cleanupAllStyles();
                return;
            }
            
            // 智能排除逻辑
            if (this.getConfig('autoExclude') && this.shouldExcludeSite()) {
                this.cleanupAllStyles();
                return;
            }
            
            // 检查网站专用模式
            let siteSpecificMode = this.getSiteSpecificMode();
            
            if (siteSpecificMode && siteSpecificMode !== 'default') {
                // 应用网站专用模式
                switch(siteSpecificMode) {
                    case 'light':
                        this.cleanupAllStyles();
                        break;
                    case 'dark':
                        this.applyDarkMode();
                        break;
                    case 'ink':
                        this.applyInkMode();
                        break;
                }
            } else {
                // 使用全局模式
                let mode = this.getCurrentMode();
                switch(mode) {
                    case 'dark':
                        this.applyDarkMode();
                        break;
                    case 'ink':
                        this.applyInkMode();
                        break;
                    case 'light':
                    default:
                        this.cleanupAllStyles();
                        break;
                }
            }
        },

        // 切换模式
        switchMode() {
            // 检查是否有网站专用模式
            let siteSpecificMode = this.getSiteSpecificMode();
            if (siteSpecificMode && siteSpecificMode !== 'default') {
                // 如果有网站专用模式，显示提示
                this.showNotification('当前网站使用专用模式，请在设置面板中修改');
                setTimeout(() => this.showSettings(), 100);
                return;
            }
            
            let currentMode = this.currentMode || this.getConfig('currentMode') || 'light';
            let nextMode = currentMode === 'light' ? 'dark' : 
                          currentMode === 'dark' ? 'ink' : 'light';
            
            // 更新当前模式
            this.currentMode = nextMode;
            this.setConfig('currentMode', nextMode);
            
            // 显示通知
            this.showNotification(`正在切换到 ${this.getModeName(nextMode)}`);
            
            // 立即应用新模式
            setTimeout(() => {
                this.applyMode();
                this.refreshMenu();
                this.showNotification(`已切换到 ${this.getModeName(nextMode)}`);
            }, 100);
        },

        // 获取模式名称
        getModeName(mode) {
            switch(mode) {
                case 'light':
                    return '白天模式';
                case 'dark':
                    return '夜间模式';
                case 'ink':
                    return '墨黑模式';
                default:
                    return '白天模式';
            }
        },

        // 获取网站模式名称
        getSiteModeName(mode) {
            switch(mode) {
                case 'light': return '白天模式';
                case 'dark': return '夜间模式';
                case 'ink': return '墨黑模式';
                default: return '默认';
            }
        },

        // 切换全局开关
        toggleGlobal() {
            let current = this.getConfig('globalEnable');
            this.setConfig('globalEnable', !current);
            this.applyMode();
            this.refreshMenu();
            this.showNotification(!current ? '已开启全局模式' : '已关闭全局模式');
        },

        // 切换当前网站开关（白名单管理）
        toggleCurrentSite() {
            let enableList = this.getConfig('enableList');
            let host = location.host;
            
            if (enableList.includes(host)) {
                // 从白名单中移除，立即禁用
                enableList = enableList.filter(domain => domain !== host);
                this.cleanupAllStyles();
                this.setConfig('enableList', enableList);
                this.showNotification('已在当前网站禁用护眼模式');
            } else {
                // 添加到白名单，立即启用
                enableList.push(host);
                this.setConfig('enableList', enableList);
                this.applyMode();
                this.showNotification('已在当前网站启用护眼模式');
            }
            
            // 刷新菜单显示
            this.refreshMenu();
        },

        // 切换强制启用
        toggleForceEnable() {
            let forcedList = this.getConfig('forcedEnableList');
            let host = location.host;
            
            if (forcedList.includes(host)) {
                forcedList = forcedList.filter(domain => domain !== host);
                this.showNotification('已取消强制启用当前网站');
            } else {
                forcedList.push(host);
                this.showNotification('已强制启用当前网站');
            }
            
            this.setConfig('forcedEnableList', forcedList);
            this.applyMode();
            this.refreshMenu();
        },

        // 显示通知
        showNotification(message) {
            // 先移除可能存在的旧通知
            let oldNotifications = document.querySelectorAll('.eye-protect-notification');
            oldNotifications.forEach(notification => {
                notification.remove();
            });
            
            let notification = document.createElement('div');
            notification.className = 'eye-protect-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 999999;
                font-size: 14px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                opacity: 1;
                transition: opacity 0.5s;
                max-width: 300px;
                word-wrap: break-word;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 500);
            }, 2000);
        },

        // 显示设置面板
        showSettings() {
            // 移除现有的设置面板
            let existingPanel = document.querySelector('.eye-protect-settings-panel');
            if (existingPanel) {
                existingPanel.remove();
                return;
            }
            
            // 获取当前配置
            let currentMode = this.getCurrentMode();
            let globalEnable = this.getConfig('globalEnable');
            let enableList = this.getConfig('enableList');
            let autoExclude = this.getConfig('autoExclude');
            let forcedList = this.getConfig('forcedEnableList');
            let runDuringDay = this.getConfig('runDuringDay');
            let darkAuto = this.getConfig('darkAuto');
            let inkConfig = this.getConfig('inkModeConfig');
            let autoSwitch = this.getConfig('autoSwitch');
            let customDayNight = this.getConfig('customDayNight');
            let customDark3 = this.getConfig('customDark3');
            let host = location.host;
            let siteEnabled = enableList.includes(host);
            let isForced = forcedList.includes(host);
            
            // 获取当前网站的专用模式
            let siteSpecificMode = this.getSiteSpecificMode();
            
            // 创建设置面板
            let panel = document.createElement('div');
            panel.className = 'eye-protect-settings-panel';
            
            // 使用亮色主题样式，不受当前模式影响
            panel.style.cssText = `
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 500px !important;
                max-width: 90% !important;
                max-height: 80vh !important;
                background: #ffffff !important;
                color: #333333 !important;
                border-radius: 10px !important;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2) !important;
                z-index: 1000000 !important;
                overflow: hidden !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                border: 1px solid #e0e0e0 !important;
            `;
            
            // 面板内容 - 使用亮色主题
            panel.innerHTML = `
                <div class="settings-header" style="
                    background: #f5f5f5 !important;
                    color: #333333 !important;
                    padding: 15px !important;
                    border-radius: 10px 10px 0 0 !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    border-bottom: 1px solid #e0e0e0 !important;
                ">
                    <div class="settings-title" style="
                        font-size: 18px !important;
                        font-weight: bold !important;
                        color: #333333 !important;
                    ">🛡️ 护眼模式设置 v5.2.1</div>
                    <button class="close-btn" id="closeBtn" style="
                        background: transparent !important;
                        border: none !important;
                        color: #666666 !important;
                        font-size: 24px !important;
                        cursor: pointer !important;
                        padding: 0 !important;
                        width: 30px !important;
                        height: 30px !important;
                        line-height: 30px !important;
                        text-align: center !important;
                        border-radius: 4px !important;
                    ">×</button>
                </div>
                
                <div class="settings-content" style="
                    padding: 20px !important;
                    max-height: calc(80vh - 70px) !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    background: #ffffff !important;
                    color: #333333 !important;
                ">
                    <div class="settings-section" style="
                        background: #f9f9f9 !important;
                        border-radius: 8px !important;
                        padding: 15px !important;
                        margin-bottom: 15px !important;
                        border: 1px solid #e0e0e0 !important;
                    ">
                        <h3 style="
                            margin: 0 0 15px 0 !important;
                            color: #333333 !important;
                            font-size: 16px !important;
                        ">📱 当前状态</h3>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            margin-bottom: 12px !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">当前模式：</span>
                            <span class="setting-value" style="
                                font-size: 14px !important;
                                color: #333333 !important;
                            ">
                                ${currentMode === 'light' ? '☀️ 白天模式' : currentMode === 'dark' ? '🌙 夜间模式' : '🖋️ 墨黑模式'}
                            </span>
                        </div>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            margin-bottom: 12px !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">当前网站：</span>
                            <span class="setting-value" style="
                                font-size: 14px !important;
                                color: #333333 !important;
                            ">${host}</span>
                        </div>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            margin-bottom: 12px !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">白名单状态：</span>
                            <span class="setting-value" style="
                                font-size: 14px !important;
                                color: #333333 !important;
                            ">${siteEnabled ? '✅ 已启用' : '❌ 未启用'}</span>
                        </div>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            margin-bottom: 12px !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">强制启用：</span>
                            <span class="setting-value" style="
                                font-size: 14px !important;
                                color: #333333 !important;
                            ">${isForced ? '⚡ 已强制' : '🚫 未强制'}</span>
                        </div>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">网站专用模式：</span>
                            <span class="setting-value" style="
                                font-size: 14px !important;
                                color: #333333 !important;
                            ">${siteSpecificMode ? this.getSiteModeName(siteSpecificMode) : '默认'}</span>
                        </div>
                    </div>
                    
                    <!-- 网站专用模式设置 -->
                    <div class="settings-section" style="
                        background: #f9f9f9 !important;
                        border-radius: 8px !important;
                        padding: 15px !important;
                        margin-bottom: 15px !important;
                        border: 1px solid #e0e0e0 !important;
                    ">
                        <h3 style="
                            margin: 0 0 15px 0 !important;
                            color: #333333 !important;
                            font-size: 16px !important;
                        ">🌐 网站专用模式设置</h3>
                        <div class="help-text" style="
                            font-size: 12px !important;
                            color: #666666 !important;
                            margin-bottom: 10px !important;
                        ">为当前网站设置专用模式，此设置仅在白名单或全局开启时生效</div>
                        <div class="site-mode-select" style="
                            margin-top: 10px !important;
                            padding: 10px !important;
                            background: #ffffff !important;
                            border-radius: 6px !important;
                            border: 1px solid #e0e0e0 !important;
                        ">
                            <label for="siteSpecificMode" style="
                                display: block !important;
                                margin-bottom: 5px !important;
                                font-weight: bold !important;
                                color: #333333 !important;
                            ">${host} 的专用模式：</label>
                            <select id="siteSpecificMode" style="
                                width: 100% !important;
                                padding: 8px 12px !important;
                                border: 1px solid #e0e0e0 !important;
                                border-radius: 6px !important;
                                background: #ffffff !important;
                                color: #333333 !important;
                                font-size: 14px !important;
                            ">
                                <option value="default" ${!siteSpecificMode ? 'selected' : ''}>默认（跟随全局设置）</option>
                                <option value="light" ${siteSpecificMode === 'light' ? 'selected' : ''}>☀️ 白天模式</option>
                                <option value="dark" ${siteSpecificMode === 'dark' ? 'selected' : ''}>🌙 夜间模式</option>
                                <option value="ink" ${siteSpecificMode === 'ink' ? 'selected' : ''}>🖋️ 墨黑模式</option>
                            </select>
                            <div class="current-site-mode" style="
                                font-size: 13px !important;
                                color: #333333 !important;
                                margin-top: 5px !important;
                            ">
                                当前设置：${siteSpecificMode ? this.getSiteModeName(siteSpecificMode) : '默认'}
                            </div>
                            <div class="help-text" style="
                                font-size: 12px !important;
                                color: #666666 !important;
                                margin-top: 5px !important;
                                line-height: 1.4 !important;
                            ">
                                <strong>注意：</strong>bilivod.com已内置专门优化的夜间模式，无需单独设置
                            </div>
                        </div>
                        <div class="action-buttons" style="
                            display: flex !important;
                            gap: 10px !important;
                            margin-top: 15px !important;
                        ">
                            <button class="btn btn-secondary" id="applySiteMode" style="
                                padding: 10px 20px !important;
                                border: none !important;
                                border-radius: 6px !important;
                                cursor: pointer !important;
                                font-size: 14px !important;
                                font-weight: 500 !important;
                                background: #f0f0f0 !important;
                                color: #333333 !important;
                                border: 1px solid #e0e0e0 !important;
                                flex: 1 !important;
                            ">💾 应用网站专用模式</button>
                            <button class="btn btn-secondary" id="resetSiteMode" style="
                                padding: 10px 20px !important;
                                border: none !important;
                                border-radius: 6px !important;
                                cursor: pointer !important;
                                font-size: 14px !important;
                                font-weight: 500 !important;
                                background: #f0f0f0 !important;
                                color: #333333 !important;
                                border: 1px solid #e0e0e0 !important;
                                flex: 1 !important;
                            ">🔄 重置为默认</button>
                        </div>
                    </div>
                    
                    <div class="settings-section" style="
                        background: #f9f9f9 !important;
                        border-radius: 8px !important;
                        padding: 15px !important;
                        margin-bottom: 15px !important;
                        border: 1px solid #e0e0e0 !important;
                    ">
                        <h3 style="
                            margin: 0 0 15px 0 !important;
                            color: #333333 !important;
                            font-size: 16px !important;
                        ">⚙️ 全局设置</h3>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            margin-bottom: 12px !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">全局开关：</span>
                            <label class="toggle-switch" style="
                                position: relative !important;
                                display: inline-block !important;
                                width: 50px !important;
                                height: 24px !important;
                            ">
                                <input type="checkbox" id="globalEnable" ${globalEnable ? 'checked' : ''} style="
                                    opacity: 0 !important;
                                    width: 0 !important;
                                    height: 0 !important;
                                ">
                                <span class="toggle-slider" style="
                                    position: absolute !important;
                                    cursor: pointer !important;
                                    top: 0 !important;
                                    left: 0 !important;
                                    right: 0 !important;
                                    bottom: 0 !important;
                                    background-color: #e0e0e0 !important;
                                    border-radius: 24px !important;
                                "></span>
                            </label>
                        </div>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            margin-bottom: 12px !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">智能排除：</span>
                            <label class="toggle-switch" style="
                                position: relative !important;
                                display: inline-block !important;
                                width: 50px !important;
                                height: 24px !important;
                            ">
                                <input type="checkbox" id="autoExclude" ${autoExclude ? 'checked' : ''} style="
                                    opacity: 0 !important;
                                    width: 0 !important;
                                    height: 0 !important;
                                ">
                                <span class="toggle-slider" style="
                                    position: absolute !important;
                                    cursor: pointer !important;
                                    top: 0 !important;
                                    left: 0 !important;
                                    right: 0 !important;
                                    bottom: 0 !important;
                                    background-color: #e0e0e0 !important;
                                    border-radius: 24px !important;
                                "></span>
                            </label>
                        </div>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            margin-bottom: 12px !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">白天开启：</span>
                            <label class="toggle-switch" style="
                                position: relative !important;
                                display: inline-block !important;
                                width: 50px !important;
                                height: 24px !important;
                            ">
                                <input type="checkbox" id="runDuringDay" ${runDuringDay ? 'checked' : ''} style="
                                    opacity: 0 !important;
                                    width: 0 !important;
                                    height: 0 !important;
                                ">
                                <span class="toggle-slider" style="
                                    position: absolute !important;
                                    cursor: pointer !important;
                                    top: 0 !important;
                                    left: 0 !important;
                                    right: 0 !important;
                                    bottom: 0 !important;
                                    background-color: #e0e0e0 !important;
                                    border-radius: 24px !important;
                                "></span>
                            </label>
                        </div>
                        <div class="setting-item" style="
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            padding: 8px 0 !important;
                        ">
                            <span class="setting-label" style="
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">跟随系统：</span>
                            <label class="toggle-switch" style="
                                position: relative !important;
                                display: inline-block !important;
                                width: 50px !important;
                                height: 24px !important;
                            ">
                                <input type="checkbox" id="darkAuto" ${darkAuto ? 'checked' : ''} style="
                                    opacity: 0 !important;
                                    width: 0 !important;
                                    height: 0 !important;
                                ">
                                <span class="toggle-slider" style="
                                    position: absolute !important;
                                    cursor: pointer !important;
                                    top: 0 !important;
                                    left: 0 !important;
                                    right: 0 !important;
                                    bottom: 0 !important;
                                    background-color: #e0e0e0 !important;
                                    border-radius: 24px !important;
                                "></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="settings-section" style="
                        background: #f9f9f9 !important;
                        border-radius: 8px !important;
                        padding: 15px !important;
                        margin-bottom: 15px !important;
                        border: 1px solid #e0e0e0 !important;
                    ">
                        <h3 style="
                            margin: 0 0 15px 0 !important;
                            color: #333333 !important;
                            font-size: 16px !important;
                        ">🎨 模式设置</h3>
                        <div class="input-group" style="
                            margin-top: 10px !important;
                        ">
                            <label style="
                                display: block !important;
                                margin-bottom: 5px !important;
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">昼夜时间：</label>
                            <input type="text" id="customDayNight" value="${customDayNight}" placeholder="6:00|18:00" style="
                                width: 100% !important;
                                padding: 8px 12px !important;
                                border: 1px solid #e0e0e0 !important;
                                border-radius: 6px !important;
                                background: #ffffff !important;
                                color: #333333 !important;
                                font-size: 14px !important;
                            ">
                            <div class="help-text" style="
                                font-size: 12px !important;
                                color: #666666 !important;
                                margin-top: 5px !important;
                            ">格式：白天开始时间|白天结束时间，如6:00|18:00</div>
                        </div>
                        <div class="input-group" style="
                            margin-top: 10px !important;
                        ">
                            <label style="
                                display: block !important;
                                margin-bottom: 5px !important;
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">自动切换模式：</label>
                            <input type="text" id="autoSwitch" value="${autoSwitch}" placeholder="1|2" style="
                                width: 100% !important;
                                padding: 8px 12px !important;
                                border: 1px solid #e0e0e0 !important;
                                border-radius: 6px !important;
                                background: #ffffff !important;
                                color: #333333 !important;
                                font-size: 14px !important;
                            ">
                            <div class="help-text" style="
                                font-size: 12px !important;
                                color: #666666 !important;
                                margin-top: 5px !important;
                            ">格式：白天模式|夜间模式，0=白天 1=夜间 2=墨黑</div>
                        </div>
                        <div class="input-group" style="
                            margin-top: 10px !important;
                        ">
                            <label style="
                                display: block !important;
                                margin-bottom: 5px !important;
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">反色强度：</label>
                            <input type="text" id="customDark3" value="${customDark3}" placeholder="90" style="
                                width: 100% !important;
                                padding: 8px 12px !important;
                                border: 1px solid #e0e0e0 !important;
                                border-radius: 6px !important;
                                background: #ffffff !important;
                                color: #333333 !important;
                                font-size: 14px !important;
                            ">
                            <div class="help-text" style="
                                font-size: 12px !important;
                                color: #666666 !important;
                                margin-top: 5px !important;
                            ">夜间模式反色强度，默认90（0-100）</div>
                        </div>
                        <div class="input-group" style="
                            margin-top: 10px !important;
                        ">
                            <label style="
                                display: block !important;
                                margin-bottom: 5px !important;
                                font-size: 14px !important;
                                color: #555555 !important;
                            ">墨黑模式配色：</label>
                            <input type="text" id="inkModeConfig" value="${inkConfig}" placeholder="背景|文字|次要背景|边框|主色调|悬停色" style="
                                width: 100% !important;
                                padding: 8px 12px !important;
                                border: 1px solid #e0e0e0 !important;
                                border-radius: 6px !important;
                                background: #ffffff !important;
                                color: #333333 !important;
                                font-size: 14px !important;
                            ">
                            <div class="help-text" style="
                                font-size: 12px !important;
                                color: #666666 !important;
                                margin-top: 5px !important;
                            ">格式：背景色|文字色|次要背景色|边框色|主色调|悬停色</div>
                        </div>
                    </div>
                    
                    <div class="action-buttons" style="
                        display: flex !important;
                        gap: 10px !important;
                        margin-top: 20px !important;
                    ">
                        <button class="btn btn-primary" id="toggleMode" style="
                            padding: 10px 20px !important;
                            border: none !important;
                            border-radius: 6px !important;
                            cursor: pointer !important;
                            font-size: 14px !important;
                            font-weight: 500 !important;
                            background: #007bff !important;
                            color: white !important;
                            flex: 1 !important;
                        ">
                            ${currentMode === 'light' ? '🌙 切换夜间模式' : currentMode === 'dark' ? '🖋️ 切换墨黑模式' : '☀️ 切换白天模式'}
                        </button>
                        <button class="btn btn-secondary" id="toggleSite" style="
                            padding: 10px 20px !important;
                            border: none !important;
                            border-radius: 6px !important;
                            cursor: pointer !important;
                            font-size: 14px !important;
                            font-weight: 500 !important;
                            background: #f0f0f0 !important;
                            color: #333333 !important;
                            border: 1px solid #e0e0e0 !important;
                            flex: 1 !important;
                        ">
                            ${siteEnabled ? '❌ 禁用本站' : '✅ 启用本站'}
                        </button>
                    </div>
                    
                    <div class="action-buttons" style="
                        display: flex !important;
                        gap: 10px !important;
                        margin-top: 10px !important;
                    ">
                        <button class="btn btn-secondary" id="saveSettings" style="
                            padding: 10px 20px !important;
                            border: none !important;
                            border-radius: 6px !important;
                            cursor: pointer !important;
                            font-size: 14px !important;
                            font-weight: 500 !important;
                            background: #f0f0f0 !important;
                            color: #333333 !important;
                            border: 1px solid #e0e0e0 !important;
                            flex: 1 !important;
                        ">💾 保存设置</button>
                        <button class="btn btn-secondary" id="resetSettings" style="
                            padding: 10px 20px !important;
                            border: none !important;
                            border-radius: 6px !important;
                            cursor: pointer !important;
                            font-size: 14px !important;
                            font-weight: 500 !important;
                            background: #f0f0f0 !important;
                            color: #333333 !important;
                            border: 1px solid #e0e0e0 !important;
                            flex: 1 !important;
                        ">🔄 恢复默认</button>
                    </div>
                </div>
            `;
            
            // 添加到页面
            document.body.appendChild(panel);
            
            // 添加设置面板专用CSS，确保其不受任何模式影响
            let panelStyle = document.createElement('style');
            panelStyle.textContent = `
                /* 设置面板专用样式 - 强制亮色主题，不受任何模式影响 */
                .eye-protect-settings-panel {
                    filter: none !important;
                    background: #ffffff !important;
                    color: #333333 !important;
                    border-color: #e0e0e0 !important;
                }
                
                .eye-protect-settings-panel * {
                    filter: none !important;
                    background: inherit !important;
                    color: inherit !important;
                }
                
                /* 切换开关样式 */
                .toggle-switch input:checked + .toggle-slider::before {
                    transform: translateX(26px) !important;
                }
                .toggle-switch input:checked + .toggle-slider {
                    background-color: #007bff !important;
                }
                .toggle-switch .toggle-slider::before {
                    content: "" !important;
                    position: absolute !important;
                    height: 16px !important;
                    width: 16px !important;
                    left: 4px !important;
                    bottom: 4px !important;
                    background-color: white !important;
                    border-radius: 50% !important;
                    transition: .4s !important;
                }
            `;
            document.head.appendChild(panelStyle);
            
            // 事件绑定
            setTimeout(() => {
                // 关闭按钮事件
                panel.querySelector('#closeBtn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    panel.remove();
                });
                
                // 网站专用模式相关事件
                panel.querySelector('#applySiteMode').addEventListener('click', () => {
                    let select = panel.querySelector('#siteSpecificMode');
                    let mode = select.value;
                    if (mode === 'default') {
                        this.setSiteSpecificMode(null);
                        this.showNotification('已重置当前网站的专用模式为默认');
                    } else {
                        this.setSiteSpecificMode(mode);
                        this.showNotification(`已为当前网站设置专用模式：${this.getSiteModeName(mode)}`);
                    }
                    this.applyMode();
                    this.refreshMenu();
                    panel.remove();
                });
                
                panel.querySelector('#resetSiteMode').addEventListener('click', () => {
                    this.setSiteSpecificMode(null);
                    this.showNotification('已重置当前网站的专用模式为默认');
                    this.applyMode();
                    this.refreshMenu();
                    panel.remove();
                });
                
                // 功能按钮事件
                panel.querySelector('#toggleMode').addEventListener('click', () => {
                    this.switchMode();
                    panel.remove();
                });
                
                panel.querySelector('#toggleSite').addEventListener('click', () => {
                    this.toggleCurrentSite();
                    panel.remove();
                });
                
                panel.querySelector('#saveSettings').addEventListener('click', () => {
                    // 保存所有设置
                    this.setConfig('globalEnable', panel.querySelector('#globalEnable').checked);
                    this.setConfig('autoExclude', panel.querySelector('#autoExclude').checked);
                    this.setConfig('runDuringDay', panel.querySelector('#runDuringDay').checked);
                    this.setConfig('darkAuto', panel.querySelector('#darkAuto').checked);
                    
                    let dayNight = panel.querySelector('#customDayNight').value;
                    if (dayNight) this.setConfig('customDayNight', dayNight);
                    
                    let autoSwitchVal = panel.querySelector('#autoSwitch').value;
                    this.setConfig('autoSwitch', autoSwitchVal);
                    
                    let dark3Val = panel.querySelector('#customDark3').value;
                    if (dark3Val) this.setConfig('customDark3', dark3Val);
                    
                    let inkConfigVal = panel.querySelector('#inkModeConfig').value;
                    if (inkConfigVal) {
                        this.setConfig('inkModeConfig', inkConfigVal);
                        if (this.getCurrentMode() === 'ink') this.applyInkMode();
                    }
                    
                    this.applyMode();
                    this.refreshMenu();
                    this.showNotification('✅ 设置已保存');
                    panel.remove();
                });
                
                panel.querySelector('#resetSettings').addEventListener('click', () => {
                    if (confirm('确定要恢复所有默认设置吗？')) {
                        for (let key in this.defaults) {
                            this.setConfig(key, this.defaults[key]);
                        }
                        this.setConfig('currentMode', 'light');
                        this.currentMode = 'light';
                        this.applyMode();
                        this.refreshMenu();
                        this.showNotification('✅ 已恢复默认设置');
                        panel.remove();
                    }
                });
                
                // ESC键关闭
                const handleEscKey = (e) => {
                    if (e.key === 'Escape' && panel && panel.parentNode) {
                        panel.remove();
                        document.removeEventListener('keydown', handleEscKey);
                    }
                };
                
                document.addEventListener('keydown', handleEscKey);
            }, 0);
        },

        // 清除所有菜单
        clearMenu() {
            menuCommands.forEach(cmd => {
                try {
                    GM_unregisterMenuCommand(cmd);
                } catch (e) {
                    // 忽略错误
                }
            });
            menuCommands = [];
        },

        // 刷新菜单
        refreshMenu() {
            this.clearMenu();
            this.initMenu();
        },

        // 初始化菜单
        initMenu() {
            let currentMode = this.getCurrentMode();
            let globalEnable = this.getConfig('globalEnable');
            let enableList = this.getConfig('enableList');
            let host = location.host;
            let siteEnabled = enableList.includes(host);
            let siteSpecificMode = this.getSiteSpecificMode();
            
            let modeIcon = currentMode === 'light' ? '☀️' : currentMode === 'dark' ? '🌙' : '🖋️';
            let siteModeText = siteSpecificMode ? ` [${this.getSiteModeName(siteSpecificMode)}]` : '';
            
            menuCommands.push(GM_registerMenuCommand(`${modeIcon} ${this.getModeName(currentMode)}${siteModeText}`, () => {
                this.switchMode();
            }));
            
            menuCommands.push(GM_registerMenuCommand(globalEnable ? '🌍 全局: 开启 (点击关闭)' : '🌍 全局: 关闭 (点击开启)', () => {
                this.toggleGlobal();
            }));
            
            menuCommands.push(GM_registerMenuCommand(siteEnabled ? '✅ 本站: 启用 (点击禁用)' : '❌ 本站: 禁用 (点击启用)', () => {
                this.toggleCurrentSite();
            }));
            
            menuCommands.push(GM_registerMenuCommand('⚙️ 设置面板', () => {
                this.showSettings();
            }));
        }
    };

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            EyeProtect.init();
        });
    } else {
        EyeProtect.init();
    }
})();
// ==UserScript==
// @name              护眼模式助手 - 简化版
// @namespace         https://github.com/syhyz1990/darkmode
// @version           4.2.6
// @description       全网通用护眼模式，简化版（仅白天/夜间模式）
// @author            YouXiaoHou
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-darkmode.html
// @supportURL        https://github.com/syhyz1990/darkmode
// @match             *://*/*
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNOTMuNSA5NC1WjEwLjYgMCAyMC4zLTMuMyAyOC4yLTktOC4zIDIyLjUtMzAuMiAzOC42LTU2IDM4LjYtMzIuNyAwLTU5LjMtMjUuOC01OS4zLTU3LjdTMzIuOSA4LjcgNjUuNyA4LjdoMi4yQzU0LjYgMTcgNDUuNyAzMS41IDQ1LjcgNDhjMCAyNS43IDI1LjcgNDYuNiA1Mi4xIDQ2LjZ6IiBmaWxsPSIjZmZiNTc4Ii8+PHBhdGggZD0iTTEyMS42IDgxLjhjLS44IDAtMS42LjItMi4zLjctNy41IDUuMy0xNi41IDguMS0yNS44IDguMS0yNC4yIDAtNDMuOS0xOS4xLTQzLUtI9mmgxMy43YzEuNiAwIDIuOSAxLjMgMi45IDIuOXMtMS4zIDIuOS0yLjkgMi45em0xMy4yLTMxLjFoLTE0LjRjLTEuNiAwLTIuOS0xLjMtMi45LTIuOSAwLTEgLjQtMS45IDEuMi0yLjRsNi4yLTQuMWgtNC43YzEuNiAwIDIuOSAxLjMgMi45IDIuOXMtMS4yIDIuOS0yLjggMi45eiIgZmlsbD0iIzQ0NCIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/563894/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%20-%20%E7%AE%80%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/563894/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%20-%20%E7%AE%80%E5%8C%96%E7%89%88.meta.js
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
            dark3Exclude: 'img, .img, video, [style*="background"][style*="url"], svg, .video-player, .player, [class*="player"], [class*="Player"], [id*="player"], [id*="Player"], .plyr, .jw-player, .video-js' // 排除元素
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

        // 修复模式问题：确保只有白天和夜间模式
        fixModeIssue() {
            let storedMode = this.getConfig('currentMode');
            const validModes = ['light', 'dark'];
            
            // 如果存储的模式不是白天或夜间模式，重置为light
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
                    window.location.hostname.includes('bilivod.com')) {
                    setTimeout(() => this.applyMode(), 300);
                }
            });
            
            observer.observe(document.body, {
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
            // 确保只有白天和夜间模式
            let mode = this.currentMode || this.getConfig('currentMode');
            const validModes = ['light', 'dark'];
            
            if (!validModes.includes(mode)) {
                mode = 'light';
                this.setConfig('currentMode', 'light');
            }
            
            // 如果启用了自动切换
            if (this.getConfig('autoSwitch')) {
                let modes = this.getConfig('autoSwitch').split('|');
                if (modes.length === 2) {
                    if (this.isDaytime()) {
                        mode = modes[0] === '1' ? 'dark' : 'light';
                    } else {
                        mode = modes[1] === '1' ? 'dark' : 'light';
                    }
                }
            }
            
            // 如果跟随浏览器暗色模式
            if (this.getConfig('darkAuto')) {
                let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    mode = 'dark';
                } else if (mode === 'dark') {
                    mode = 'light';
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

        // 应用夜间模式
        applyDarkMode() {
            // 彻底清理所有样式
            this.cleanupAllStyles();
            
            // 修复：移除白天限制，让夜间模式任何时候都能生效
            // if (this.isDaytime() && !this.getConfig('runDuringDay')) {
            //     return;
            // } else {
                // 根据域名使用不同的处理逻辑
                let hostname = window.location.hostname;
                
                if (hostname.includes('123pan.com')) {
                    // 123云盘使用优化的反色模式
                    this.apply123PanInvertMode();
                } else if (hostname.includes('bilivod.com')) {
                    // bilivod.com使用专门适配的反色模式
                    this.applyBilivodDarkMode();
                } else {
                    // 其他网站使用原始夜间模式
                    this.applyOriginalDarkMode();
                }
            // }
            
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

        // 原始夜间模式
        applyOriginalDarkMode() {
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
                `;
            }
            
            this.applyStyle(style_31, 'dark-mode-original');
        },

        // 123云盘优化的反色模式
        apply123PanInvertMode() {
            let style_30 = this.getConfig('customDark3') || '90';
            
            let css = `
                /* 123云盘优化反色模式 - 使用${style_30}%反色 */
                
                /* 1. 对整个HTML应用反色，使用配置的值 */
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
                
                /* 4. 按钮和表单优化 */
                button, 
                .btn, 
                .button,
                input, 
                textarea, 
                select,
                .form-control, 
                .input, 
                .search-input {
                    background-color: #2a2a2a !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                
                /* 5. 蓝色区域优化 */
                [style*="background-color: blue"],
                [style*="background:#00f"],
                [style*="background-color:#00f"],
                [style*="background-color: #00f"],
                [style*="background-color: #0000ff"],
                [style*="background-color: #007bff"],
                .btn-primary, 
                .primary, 
                .blue {
                    background-color: #ff7700 !important; /* 蓝色反色为橙色 */
                }
                
                /* 6. 链接颜色优化 */
                a, a:link, a:visited {
                    color: #ff7700 !important; /* 蓝色反色为橙色 */
                }
                a:hover {
                    color: #ff9933 !important;
                }
                
                /* 7. 确保文字可读性 */
                body, 
                div, 
                span, 
                p, 
                h1, h2, h3, h4, h5, h6,
                .title, .heading, .subtitle {
                    color: #d0d0d0 !important;
                }
                
                /* 8. 滚动条样式优化 */
                ::-webkit-scrollbar {
                    background-color: #222 !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #444 !important;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #555 !important;
                }
                ::-webkit-scrollbar-track {
                    background-color: #1a1a1a !important;
                }
                
                /* 9. 卡片和面板优化 */
                .card, .panel, .box,
                .modal, .dialog, .popup {
                    background-color: #222 !important;
                    border-color: #333 !important;
                }
                
                /* 10. 表格优化 */
                table, tr, td, th {
                    background-color: #1a1a1a !important;
                    color: #d0d0d0 !important;
                    border-color: #333 !important;
                }
                
                /* 11. 解决反色后的亮度过高问题 */
                * {
                    text-shadow: 0 0 0 !important;
                }
                
                /* 12. 处理半透明元素 */
                [style*="opacity"],
                [style*="rgba("],
                [style*="hsla("] {
                    opacity: 1 !important;
                }
                
                /* 13. 确保Firefox兼容性 */
                @-moz-document url-prefix() {
                    html {
                        filter: invert(${style_30}%) hue-rotate(180deg) !important;
                        background-image: url() !important;
                        background-color: #1a1a1a !important;
                    }
                }
                
                /* 14. 123云盘特殊优化 - 文件列表区域 */
                .file-list, .folder-list, .list-view,
                .grid-view, .item-list, .content-list,
                .table, .data-table, .file-table {
                    background-color: #1a1a1a !important;
                }
                
                .file-item, .folder-item, .list-item,
                .grid-item, .item, .entry {
                    background-color: #222 !important;
                    border-color: #333 !important;
                }
                
                /* 15. 导航栏优化 */
                .header, .navbar, .nav, .top-bar,
                .menu, .toolbar, .bar {
                    background-color: #222 !important;
                }
                
                /* 16. 侧边栏优化 */
                .sidebar, .side-panel, .side-nav {
                    background-color: #222 !important;
                }
                
                /* 17. 上传区域优化 */
                .upload-area, .upload-box,
                .dropzone, .drag-area {
                    background-color: #222 !important;
                    border-color: #333 !important;
                }
            `;
            
            this.applyStyle(css, 'dark-mode-123pan');
        },

        // bilivod.com专用夜间模式
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
                
                /* 4.13 最后的安全网 - 覆盖所有元素 */
                body *:not(img):not(svg):not(video):not(canvas):not(iframe):not(embed):not(object):not(.avatar):not(.logo):not(.icon):not(.thumbnail):not(.poster):not(.cover) {
                    background-color: #1a1a1a !important;
                    color: #d0d0d0 !important;
                    border-color: #333 !important;
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
                    
                    /* 22. 分类页面自定义滚动条优化 */
                    .custom-scroll, .scroll-area {
                        scrollbar-color: #444 #1a1a1a !important;
                    }
                    
                    /* 23. 分类页面过渡动画优化 */
                    .transition, .animate, .fade {
                        background-color: #1a1a1a !important;
                    }
                    
                    /* 24. 分类页面状态指示器 */
                    .status, .indicator, .marker {
                        background-color: #2a2a2a !important;
                    }
                    
                    .status-success, .indicator-success {
                        background-color: #2e7d32 !important;
                    }
                    
                    .status-warning, .indicator-warning {
                        background-color: #ff9800 !important;
                    }
                    
                    .status-error, .indicator-error {
                        background-color: #f44336 !important;
                    }
                    
                    /* 25. 最后确保/type/32页面所有元素的颜色协调 */
                    .type-32 *:not(img):not(svg):not(video):not(canvas):not(iframe):not(embed):not(object):not(.avatar):not(.logo):not(.icon) {
                        background-color: #1a1a1a !important;
                        color: #d0d0d0 !important;
                        border-color: #333 !important;
                    }
                `;
            }
            
            this.applyStyle(css, 'dark-mode-bilivod');
        },

        // 是否应该排除当前网站
        shouldExcludeSite() {
            let hostname = window.location.hostname;
            
            // 对于特定网站，我们使用专门的处理逻辑
            if (hostname.includes('123pan.com') || 
                hostname.includes('github.com') ||
                hostname.includes('hemudu.cc') ||
                hostname.includes('bilivod.com')) {
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
            
            // 修复：如果夜间模式被激活，即使全局未开启，也应该应用
            let currentMode = this.getCurrentMode();
            if (currentMode === 'dark' && enableList.includes(host)) {
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
            
            let mode = this.getCurrentMode();
            
            // 只处理白天和夜间模式
            switch(mode) {
                case 'dark':
                    this.applyDarkMode();
                    break;
                case 'light':
                default:
                    this.cleanupAllStyles();
                    break;
            }
        },

        // 切换模式
        switchMode() {
            let currentMode = this.currentMode || this.getConfig('currentMode') || 'light';
            let nextMode;
            
            // 只在白天和夜间模式间切换
            switch(currentMode) {
                case 'light':
                    nextMode = 'dark';
                    break;
                case 'dark':
                    nextMode = 'light';
                    break;
                default:
                    // 如果当前模式不是白天或夜间，重置为白天
                    nextMode = 'light';
            }
            
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
                default:
                    return '白天模式';
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

        // 切换当前网站开关（白名单管理）- 立即生效版本
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

        // 简单设置面板
        showSettings() {
            let currentMode = this.getCurrentMode();
            let globalEnable = this.getConfig('globalEnable');
            let enableList = this.getConfig('enableList');
            let autoExclude = this.getConfig('autoExclude');
            let forcedList = this.getConfig('forcedEnableList');
            let runDuringDay = this.getConfig('runDuringDay');
            let darkAuto = this.getConfig('darkAuto');
            let host = location.host;
            let isType32Page = window.location.pathname.includes('/type/32');
            
            let settings = `
                全局设置：
                - 当前模式：${this.getModeName(currentMode)}
                - 全局开关：${globalEnable ? '开启' : '关闭'}
                - 智能排除：${autoExclude ? '开启' : '关闭'}
                - 白天开启：${runDuringDay ? '开启' : '关闭'}
                - 跟随系统：${darkAuto ? '开启' : '关闭'}
                
                网站设置：
                - 当前网站：${host}
                - 当前页面：${window.location.pathname}
                ${isType32Page ? '- 特殊页面：已检测到/type/32页面，已启用专门优化' : ''}
                - 白名单状态：${enableList.includes(host) ? '已启用' : '未启用'}
                - 强制启用：${forcedList.includes(host) ? '是' : '否'}
                
                特别说明：
                - 版本：4.2.6 简化版（仅白天/夜间模式）
                - 模式切换：白天模式 ↔ 夜间模式
                - 修复：夜间模式现在可以在任何时候生效
            `;
            
            let result = prompt('护眼模式设置\n\n' + settings + '\n\n输入命令:\n1=切换全局开关\n2=切换智能排除\n3=切换当前网站白名单\n4=切换强制启用\n5=切换白天开启\n6=切换跟随系统\n7=自定义昼夜时间\n8=自动切换模式\n9=清除当前网站白名单状态', '');
            
            if (result === null) return;
            
            switch(result) {
                case '1':
                    this.toggleGlobal();
                    break;
                case '2':
                    this.setConfig('autoExclude', !autoExclude);
                    this.applyMode();
                    this.refreshMenu();
                    this.showNotification(`智能排除 ${!autoExclude ? '开启' : '关闭'}`);
                    break;
                case '3':
                    this.toggleCurrentSite();
                    break;
                case '4':
                    this.toggleForceEnable();
                    this.refreshMenu();
                    break;
                case '5':
                    let newRunDuringDay = !runDuringDay;
                    this.setConfig('runDuringDay', newRunDuringDay);
                    this.applyMode();
                    this.refreshMenu();
                    this.showNotification(`白天开启 ${newRunDuringDay ? '开启' : '关闭'}`);
                    break;
                case '6':
                    let newDarkAuto = !darkAuto;
                    this.setConfig('darkAuto', newDarkAuto);
                    this.applyMode();
                    this.refreshMenu();
                    this.showNotification(`跟随系统 ${newDarkAuto ? '开启' : '关闭'}`);
                    break;
                case '7':
                    let currentTime = this.getConfig('customDayNight');
                    let newTime = prompt('自定义昼夜时间（格式：6:00|18:00）', currentTime);
                    if (newTime) {
                        this.setConfig('customDayNight', newTime);
                        this.showNotification('昼夜时间已更新');
                    }
                    break;
                case '8':
                    let currentAutoSwitch = this.getConfig('autoSwitch');
                    let newAutoSwitch = prompt('自动切换模式（格式：白天|晚上，如：0|1）\n0=不使用夜间模式，1=使用夜间模式\n留空关闭该功能', currentAutoSwitch);
                    this.setConfig('autoSwitch', newAutoSwitch || '');
                    this.applyMode();
                    this.refreshMenu();
                    this.showNotification(newAutoSwitch ? '自动切换已设置' : '自动切换已关闭');
                    break;
                case '9':
                    if (confirm('确定要清除当前网站的白名单状态吗？\n这将从白名单中添加或移除当前网站，使其恢复到默认状态。')) {
                        this.toggleCurrentSite();
                    }
                    break;
            }
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
            let isType32Page = window.location.pathname.includes('/type/32');
            
            // 1. 模式切换 - 显示当前模式，不显示"切换到"字样
            let modeIcon = '';
            switch(currentMode) {
                case 'light': modeIcon = '☀️'; break;
                case 'dark': modeIcon = '🌙'; break;
                default: modeIcon = '🔄';
            }
            
            // 直接显示模式名称
            menuCommands.push(GM_registerMenuCommand(`${modeIcon} ${this.getModeName(currentMode)}${isType32Page ? ' (已优化)' : ''}`, () => {
                this.switchMode();
            }));
            
            // 2. 全局开关
            menuCommands.push(GM_registerMenuCommand(globalEnable ? '🌍 全局: 开启 (点击关闭)' : '🌍 全局: 关闭 (点击开启)', () => {
                this.toggleGlobal();
            }));
            
            // 3. 当前网站开关（白名单管理）- 立即生效
            menuCommands.push(GM_registerMenuCommand(siteEnabled ? '✅ 本站: 启用 (点击禁用)' : '❌ 本站: 禁用 (点击启用)', () => {
                this.toggleCurrentSite();
            }));
            
            // 4. 设置
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
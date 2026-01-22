// ==UserScript==
// @name              护眼模式助手（豆沙绿增强版）
// @namespace         https://github.com/syhyz1990/darkmode
// @version           3.6.9
// @description       全网通用护眼模式，支持白天模式、夜间模式、豆沙绿模式，白名单实时生效
// @author            YouXiaoHou & DeepSeek
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-darkmode.html
// @supportURL        https://github.com/syhyz1990/darkmode
// @match             *://*/*
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNOTMuNSA5NC1YjEwLjYgMCAyMC4zLTMuMyAyOC4yLTktOC4zIDIyLjUtMzAuMiAzOC42LTU2IDM4LjYtMzIuNyAwLTU5LjMtMjUuOC01OS4zLTU3LjdTMzIuOSA4LjcgNjUuNyA4LjdoMi4yQzU0LjYgMTcgNDUuNyAzMS41IDQ1LjcgNDhjMCAyNS43IDI1LjcgNDYuNiA1Mi4xIDQ2LjZ6IiBmaWxsPSIjZmZiNTc4Ii8+PHBhdGggZD0iTTEyMS42IDgxLjhjLS44IDAtMS42LjItMi4zLjctNy41IDUuMy0xNi41IDguMS0yNS44IDguMS0yNC4yIDAtNDMuOS0xOS4xLTQzLUtI9mmgxMy43YzEuNiAwIDIuOSAxLjMgMi45IDIuOXMtMS4zIDIuOS0yLjkgMi45em0xMy4yLTMxLjFoLTE0LjRjLTEuNiAwLTIuOS0xLjMtMi45LTIuOSAwLTEgLjUtMS45IDEuMy0yLjRsNi4yLTQuMWgtNC43YzEuNiAwIDIuOSAxLjMgMi45IDIuOXMtMS4yIDIuOS0yLjggMi45eiIgZmlsbD0iIzQ0NCIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/563334/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E8%B1%86%E6%B2%99%E7%BB%BF%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563334/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E8%B1%86%E6%B2%99%E7%BB%BF%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

;(function () {
    'use strict';

    // 存储所有菜单命令ID
    let menuCommands = [];

    let EyeProtect = {
        // 当前模式存储
        currentMode: null,
        
        // 观察者实例
        observer: null,

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
            dark3Exclude: 'img, .img, video, [style*="background"][style*="url"], svg, .video-player, .player, [class*="player"], [class*="Player"], [id*="player"], [id*="Player"], .plyr, .jw-player, .video-js' // 排除元素（增加视频播放器相关）
        },

        // 初始化
        init() {
            this.initConfig();
            this.saveOriginThemeColor();
            
            // 获取当前模式
            this.currentMode = this.getConfig('currentMode') || 'light';
            
            this.initMenu();
            this.applyMode();
            
            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
                this.applyMode();
                this.refreshMenu();
            });
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
            let mode = this.currentMode || this.getConfig('currentMode') || 'light';
            
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
                if (prefersDark && mode !== 'green') {
                    mode = 'dark';
                } else if (!prefersDark && mode === 'dark') {
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
            
            // 4. 对于bilivod.com，清除所有可能的内联样式修改
            if (window.location.hostname.includes('bilivod.com')) {
                this.cleanupBilivodStyles();
            }
            
            // 5. 停止观察者
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        },

        // 专门清理bilivod.com的样式
        cleanupBilivodStyles() {
            // 移除所有可能由脚本添加的内联样式
            let allElements = document.querySelectorAll('*');
            for (let element of allElements) {
                // 如果元素有内联样式且可能由我们添加
                if (element.hasAttribute('style')) {
                    let style = element.getAttribute('style');
                    
                    // 检查是否包含我们可能设置的颜色值
                    if (style.includes('#1e1e1e') || 
                        style.includes('#121212') || 
                        style.includes('#252525') ||
                        style.includes('#e0e0e0') ||
                        style.includes('#C7EDCC') ||
                        style.includes('#c7edcc') ||
                        style.includes('#64b5f6')) {
                        
                        // 移除整个style属性，让CSS重新接管
                        element.removeAttribute('style');
                    }
                }
            }
        },

        // 检查是否启用夜间模式（系统级别）
        isNightMode() {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        },

        // 应用豆沙绿模式（增强版）
        applyEnhancedGreenMode() {
            // 彻底清理所有样式
            this.cleanupAllStyles();
            
            // 获取当前域名
            let hostname = window.location.hostname;
            
            // 如果是bilivod.com，使用专门的豆沙绿模式
            if (hostname.includes('bilivod.com')) {
                this.applyBilivodGreenMode();
            } else {
                // 其他网站使用增强的豆沙绿模式
                this.applyGeneralEnhancedGreenMode();
            }
        },

        // 通用增强豆沙绿模式（集成豆沙绿护眼模式Plus的功能）
        applyGeneralEnhancedGreenMode() {
            let greenColor = '#C7EDCC';
            let linkColor = '#40933C';
            
            // 基础样式
            let css = `
                /* 增强版豆沙绿模式 */
                
                html, body {
                    background-color: ${greenColor} !important;
                }
                
                /* 通用元素 */
                div, p, span, article, section, main, aside, nav, footer, header,
                li, ul, ol, table, tr, td, th,
                .container, .wrapper, .content, .main, .box, .panel, .card,
                .item, .list, .grid, .row, .col,
                .breadcrumb, .pagination, .navigation, .menu,
                .title, .heading, .subtitle,
                .alert, .modal, .dialog {
                    background-color: ${greenColor} !important;
                    color: #333 !important;
                }
                
                /* 链接 */
                a, a:link, a:visited {
                    color: ${linkColor} !important;
                    text-decoration: none !important;
                }
                a:hover {
                    color: #2d682a !important;
                    text-decoration: underline !important;
                }
                
                /* 按钮和表单 */
                button, input, textarea, select {
                    background-color: white !important;
                    color: #333 !important;
                    border: 1px solid #ddd !important;
                }
                
                /* 视频和图片排除 */
                video, .video-player, .player, [class*="player"],
                [id*="player"], .plyr, .jw-player, .video-js,
                .player-container, .video-container,
                img, iframe, canvas, svg {
                    background-color: transparent !important;
                }
                
                /* 滚动条 */
                ::-webkit-scrollbar {
                    background-color: #e0f2e1 !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #8bc34a !important;
                }
                
                /* 特殊排除：播放器区域 */
                [class*="player"] > *, .video > * {
                    background-color: initial !important;
                }
            `;
            
            this.applyStyle(css, 'enhanced-green-mode');
            
            // 设置主题色
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = greenColor;
            } else {
                let metaEle = document.createElement('meta');
                metaEle.name = 'theme-color';
                metaEle.content = greenColor;
                document.head.appendChild(metaEle);
            }
            
            // 启动DOM变化监听，动态应用豆沙绿
            this.startGreenModeObserver();
        },

        // 启动豆沙绿模式的DOM变化监听
        startGreenModeObserver() {
            // 首次应用
            this.applyGreenBackground();
            
            // 设置观察者，监听DOM变化
            this.observer = new MutationObserver((mutations) => {
                this.applyGreenBackground();
                setTimeout(() => {
                    this.applyGreenBackground2();
                }, 50);
            });
            
            // 开始观察
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // 初始延迟执行
            setTimeout(() => {
                this.applyGreenBackground2();
            }, 100);
        },

        // 应用豆沙绿背景色（动态计算）
        applyGreenBackground() {
            let elementList = document.querySelectorAll('*');
            for (let i = 0; i < elementList.length; i++) {   
                // 排除播放器区域
                if (!(elementList[i].matches('[class*="player"] > *') || 
                    elementList[i].matches('.video > *'))) {
                    
                    let srcBgColor = window.getComputedStyle(elementList[i]).backgroundColor;
                    let splitArray = srcBgColor.match(/[\d\.]+/g);
                    if (splitArray) {
                        let r = parseInt(splitArray[0], 10),
                            g = parseInt(splitArray[1], 10),
                            b = parseInt(splitArray[2], 10);
                        
                        // 如果是浅色背景（RGB值都大于150），改为豆沙绿
                        if (r > 150 && g > 150 && b > 150) {
                            elementList[i].style.backgroundColor = '#C7EDCC';
                            elementList[i].setAttribute('data-eye-protect', 'green');
                        }
                    }
                }
            }
            
            // 更改链接颜色
            let links = document.querySelectorAll("a[href^='http']:not(.button)");
            for (let i = 0; i < links.length; i++) {
                links[i].style.color = "#40933C";
                links[i].style.textDecoration = "none";
            }
        },

        // 应用豆沙绿背景色2（针对特定元素）
        applyGreenBackground2() {
            let elements = document.querySelectorAll(
                "DIV#gb-main," +
                "DIV.url.clearfix," +
                "DIV.nav-bar-v2-fixed > * > *:not(div.nav-bar-bottom)," +
                "DIV.se-page-hd-content"
            );
            
            elements.forEach(element => {
                element.style.backgroundColor = "#C7EDCC";
                element.setAttribute('data-eye-protect', 'green');
            });
        },

        // 为bilivod.com专门定制的豆沙绿模式
        applyBilivodGreenMode() {
            let greenColor = '#C7EDCC';
            let linkColor = '#40933C';
            
            let css = `
                /* bilivod.com 豆沙绿模式 */
                
                html, body {
                    background-color: ${greenColor} !important;
                }
                
                /* 通用元素 */
                div, p, span, article, section, main, aside, nav, footer, header,
                li, ul, ol, table, tr, td, th,
                .container, .wrapper, .content, .main, .box, .panel, .card,
                .item, .list, .grid, .row, .col, .block,
                .breadcrumb, .pagination, .navigation, .menu,
                .title, .heading, .subtitle, .caption,
                .alert, .modal, .dialog, .popup,
                .search-box, .search-input, .search-form,
                .tag, .label, .category, .chip, .badge,
                .comment, .review, .feedback, .reply,
                .progress, .progress-bar, .list-group, .list-group-item {
                    background-color: ${greenColor} !important;
                    color: #333 !important;
                    border-color: #b0d9b5 !important;
                }
                
                /* 文本强调 */
                h1, h2, h3, h4, h5, h6, strong, b, em, i {
                    color: #222 !important;
                }
                
                /* 链接 */
                a, a:link, a:visited {
                    color: ${linkColor} !important;
                    text-decoration: none !important;
                }
                a:hover {
                    color: #2d682a !important;
                    text-decoration: underline !important;
                }
                
                /* 按钮和表单 */
                button, input, textarea, select,
                .button, .btn, .form-control, .input-group {
                    background-color: white !important;
                    color: #333 !important;
                    border: 1px solid #b0d9b5 !important;
                }
                
                /* 视频播放器区域 - 完全排除 */
                video, .video-player, .player, [class*="player"],
                [id*="player"], .plyr, .jw-player, .video-js,
                .player-container, .video-container,
                iframe, embed, object {
                    background-color: transparent !important;
                    filter: none !important;
                }
                
                /* 图片 - 保持原样 */
                img, svg, canvas, picture, figure {
                    filter: none !important;
                }
                
                /* 滚动条 */
                ::-webkit-scrollbar {
                    background-color: #e0f2e1 !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #8bc34a !important;
                }
                
                /* 强制覆盖白色背景 */
                [style*="background-color: white"],
                [style*="background: white"],
                [style*="background:#fff"],
                [style*="background-color:#fff"],
                [style*="background-color: #fff"] {
                    background-color: ${greenColor} !important;
                }
                
                /* 特殊处理：表格行 */
                tr:nth-child(even) {
                    background-color: #d4f0d8 !important;
                }
            `;
            
            this.applyStyle(css, 'green-mode-bilivod');
            
            // 设置主题色
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = '#C7EDCC';
            } else {
                let metaEle = document.createElement('meta');
                metaEle.name = 'theme-color';
                metaEle.content = '#C7EDCC';
                document.head.appendChild(metaEle);
            }
        },

        // 应用夜间模式
        applyDarkMode() {
            // 彻底清理所有样式
            this.cleanupAllStyles();
            
            if (this.isDaytime() && !this.getConfig('runDuringDay')) {
                // 白天且没有开启白天保持，不应用夜间模式
                return;
            } else {
                // 获取当前域名
                let hostname = window.location.hostname;
                
                // 如果是bilivod.com，使用特殊处理
                if (hostname.includes('bilivod.com')) {
                    this.applyBilivodDarkMode();
                } else {
                    // 其他网站使用原来的夜间模式
                    let style_30 = this.getConfig('customDark3');
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
                    
                    // Firefox特殊处理
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
                    
                    this.applyStyle(style_31, 'dark-mode');
                }
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

        // 为bilivod.com专门定制的夜间模式（修复图片偏灰问题）
        applyBilivodDarkMode() {
            // 创建一个更简洁但全面的CSS
            let css = `
                /* bilivod.com 夜间模式 - 修复图片偏灰问题 */
                
                /* 基础设置 */
                html, body {
                    background-color: #121212 !important;
                    color: #e0e0e0 !important;
                }
                
                /* 通用元素覆盖 */
                div, p, span, article, section, main, aside, nav, footer, header,
                li, ul, ol, table, tr, td, th, form, label, fieldset, legend,
                .container, .wrapper, .content, .main, .box, .panel, .card,
                .item, .list, .grid, .row, .col, .block,
                .breadcrumb, .pagination, .navigation, .menu,
                .title, .heading, .subtitle, .caption,
                .alert, .modal, .dialog, .popup,
                .search-box, .search-input, .search-form,
                .tag, .label, .category, .chip, .badge,
                .comment, .review, .feedback, .reply,
                .progress, .progress-bar, .list-group, .list-group-item {
                    background-color: #1e1e1e !important;
                    color: #e0e0e0 !important;
                    border-color: #333 !important;
                }
                
                /* 文本强调 */
                h1, h2, h3, h4, h5, h6, strong, b, em, i,
                .title, .name, .text, .label, .info, .meta {
                    color: #ffffff !important;
                }
                
                /* 链接 */
                a, a:link, a:visited {
                    color: #64b5f6 !important;
                }
                a:hover {
                    color: #90caf9 !important;
                }
                
                /* 按钮和表单 */
                button, input, textarea, select,
                .button, .btn, .form-control, .input-group {
                    background-color: #2d2d2d !important;
                    color: #e0e0e0 !important;
                    border-color: #444 !important;
                }
                
                /* 视频播放器区域 - 完全排除 */
                video, .video-player, .player, [class*="player"],
                [id*="player"], .plyr, .jw-player, .video-js,
                .player-container, .video-container,
                iframe, embed, object {
                    background-color: transparent !important;
                    filter: none !important;
                }
                
                /* 图片 - 移除滤镜，恢复正常显示 */
                img, svg, canvas, picture, figure {
                    filter: none !important;
                    /* 如果觉得图片太亮，可以轻微降低亮度，但不使用偏灰效果 */
                    /* filter: brightness(0.98) !important; */
                }
                
                /* 滚动条 */
                ::-webkit-scrollbar {
                    background-color: #1e1e1e !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #444 !important;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #555 !important;
                }
                
                /* 强制覆盖常见浅色背景 */
                [style*="background-color: white"],
                [style*="background: white"],
                [style*="background:#fff"],
                [style*="background-color:#fff"],
                [style*="background-color: #fff"],
                [style*="background-color: #ffffff"],
                [style*="background: #ffffff"],
                [style*="background-color: #f"],
                [style*="background: #f"] {
                    background-color: #1e1e1e !important;
                }
                
                /* 强制覆盖常见深色文字 */
                [style*="color: black"],
                [style*="color:#000"],
                [style*="color: #000"],
                [style*="color: #333"],
                [style*="color:#333"] {
                    color: #e0e0e0 !important;
                }
                
                /* 特殊处理：表格行 */
                tr:nth-child(even) {
                    background-color: #252525 !important;
                }
                
                /* 特殊处理：改善图片在深色背景下的显示 */
                .poster-img, .cover-img, .thumbnail, .avatar,
                [class*="img"], [class*="image"], [class*="photo"],
                [class*="pic"], [class*="thumb"] {
                    /* 为常见图片类添加轻微阴影，提高在深色背景下的可视性 */
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                }
                
                /* 修复图标和SVG的显示 */
                svg, .icon, [class*="icon-"], [class*="ico-"] {
                    filter: none !important;
                    /* 如果SVG图标太暗，可以适当调亮 */
                    /* filter: brightness(1.1) !important; */
                }
            `;
            
            this.applyStyle(css, 'dark-mode-bilivod');
            
            // 设置主题色
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = '#121212';
            } else {
                let metaEle = document.createElement('meta');
                metaEle.name = 'theme-color';
                metaEle.content = '#121212';
                document.head.appendChild(metaEle);
            }
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
        },

        // 移除样式（改为使用cleanupAllStyles）
        removeStyle() {
            this.cleanupAllStyles();
        },

        // 是否应该排除当前网站
        shouldExcludeSite() {
            let hostname = window.location.hostname;
            
            // 对于bilivod.com，我们使用专门的处理逻辑
            if (hostname.includes('bilivod.com')) {
                return false;
            }
            
            let forcedList = this.getConfig('forcedEnableList');
            if (forcedList.includes(location.host)) {
                return false;
            }
            
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
            
            // 检查是否在夜间模式下且当前模式是豆沙绿
            let currentMode = this.getCurrentMode();
            if (currentMode === 'green' && this.isNightMode()) {
                // 夜间模式下自动切换到夜间模式
                return (globalEnable || enableList.includes(host)) && currentMode !== 'light';
            }
            
            return globalEnable || enableList.includes(host);
        },

        // 应用模式
        applyMode() {
            if (!this.shouldApplyMode()) {
                this.cleanupAllStyles();
                return;
            }
            
            // 对于bilivod.com，不使用智能排除
            if (!window.location.hostname.includes('bilivod.com') && this.getConfig('autoExclude') && this.shouldExcludeSite()) {
                this.cleanupAllStyles();
                return;
            }
            
            let mode = this.getCurrentMode();
            
            // 检查是否在夜间模式下且选择了豆沙绿模式
            if (mode === 'green' && this.isNightMode()) {
                // 夜间模式下自动切换到夜间模式
                mode = 'dark';
                this.currentMode = 'dark';
                this.setConfig('currentMode', 'dark');
                this.showNotification('夜间模式下已自动切换到夜间模式');
            }
            
            switch(mode) {
                case 'dark':
                    this.applyDarkMode();
                    break;
                case 'green':
                    this.applyEnhancedGreenMode();
                    break;
                case 'light':
                    this.cleanupAllStyles();
                    break;
                default:
                    this.cleanupAllStyles();
            }
        },

        // 切换模式（不再需要刷新页面）
        switchMode() {
            let currentMode = this.currentMode || this.getConfig('currentMode') || 'light';
            let nextMode;
            
            // 只在三种模式间循环: light -> dark -> green -> light
            switch(currentMode) {
                case 'light':
                    nextMode = 'dark';
                    break;
                case 'dark':
                    nextMode = 'green';
                    break;
                case 'green':
                    nextMode = 'light';
                    break;
                default:
                    nextMode = 'light';
            }
            
            // 检查是否在夜间模式下且选择了豆沙绿模式
            if (nextMode === 'green' && this.isNightMode()) {
                // 跳过豆沙绿模式，直接到白天模式
                nextMode = 'light';
                this.showNotification('夜间模式下已跳过豆沙绿模式');
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
                case 'green':
                    return '豆沙绿模式';
                default:
                    return '白天模式';
            }
        },

        // 切换全局开关
        toggleGlobal() {
            let current = this.getConfig('globalEnable');
            this.setConfig('globalEnable', !current);
            this.applyMode(); // 重新应用模式
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
                this.cleanupAllStyles(); // 立即清理样式
                this.setConfig('enableList', enableList);
                this.showNotification('已在当前网站禁用护眼模式');
            } else {
                // 添加到白名单，立即启用
                enableList.push(host);
                this.setConfig('enableList', enableList);
                this.applyMode(); // 立即应用模式
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
            let isNightMode = this.isNightMode();
            
            let settings = `
                全局设置：
                - 当前模式：${this.getModeName(currentMode)}
                - 全局开关：${globalEnable ? '开启' : '关闭'}
                - 智能排除：${autoExclude ? '开启' : '关闭'}
                - 白天开启：${runDuringDay ? '开启' : '关闭'}
                - 跟随系统：${darkAuto ? '开启' : '关闭'}
                - 系统夜间模式：${isNightMode ? '开启' : '关闭'}
                
                网站设置：
                - 当前网站：${host}
                - 白名单状态：${enableList.includes(host) ? '已启用' : '未启用'}
                - 强制启用：${forcedList.includes(host) ? '是' : '否'}
                
                特别说明：
                - 豆沙绿模式已增强，夜间模式下自动切换到夜间模式
                - 模式切换更加流畅，无需刷新页面
                - 对于bilivod.com使用专门优化的样式
                - 豆沙绿模式使用#C7EDCC颜色
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
            
            // 1. 模式切换
            menuCommands.push(GM_registerMenuCommand(`🔄 ${this.getModeName(currentMode)}`, () => {
                this.switchMode();
            }));
            
            // 2. 全局开关
            menuCommands.push(GM_registerMenuCommand(globalEnable ? '🌍 全局: 开启' : '🌍 全局: 关闭', () => {
                this.toggleGlobal();
            }));
            
            // 3. 当前网站开关（白名单管理）- 立即生效
            menuCommands.push(GM_registerMenuCommand(siteEnabled ? '✅ 本站: 启用 (点击禁用)' : '❌ 本站: 禁用 (点击启用)', () => {
                this.toggleCurrentSite();
            }));
            
            // 4. 设置
            menuCommands.push(GM_registerMenuCommand('⚙️ 设置', () => {
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
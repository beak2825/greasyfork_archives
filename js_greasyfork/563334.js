// ==UserScript==
// @name              护眼模式助手
// @namespace         https://github.com/syhyz1990/darkmode
// @version           3.6.3
// @description       全网通用护眼模式，支持白天模式、夜间模式、豆沙绿模式，白名单实时生效
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
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNOTMuNSA5NC1YjEwLjYgMCAyMC4zLTMuMyAyOC4yLTktOC4zIDIyLjUtMzAuMiAzOC42LTU2IDM4LjYtMzIuNyAwLTU5LjMtMjUuOC01OS4zLTU3LjdTMzIuOSA4LjcgNjUuNyA4LjdoMi4yQzU0LjYgMTcgNDUuNyAzMS41IDQ1LjcgNDhjMCAyNS43IDI1LjcgNDYuNiA1Mi4xIDQ2LjZ6IiBmaWxsPSIjZmZiNTc4Ii8+PHBhdGggZD0iTTEyMS42IDgxLjhjLS44IDAtMS42LjItMi4zLjctNy41IDUuMy0xNi41IDguMS0yNS44IDguMS0yNC4yIDAtNDMuOS0xOS4xLTQzLktI9mmgxMy43YzEuNiAwIDIuOSAxLjMgMi45IDIuOXMtMS4zIDIuOS0yLjkgMi45em0xMy4yLTMxLjFoLTE0LjRjLTEuNiAwLTIuOS0xLjMtMi45LTIuOSAwLTEgLjUtMS45IDEuMy0yLjRsNi4yLTQuMWgtNC43Yy0xLjYgMC0yLktI9mmgxNC40YzEuNiAwIDIuOSAxLjMgMi45IDIuOSAwIDEtLjUgMS45LTEuMyAyLjRMLTExNy42IDhoMi40YzEuNiAwIDIuOSAxLjMgMi45IDIuOXMtMS4yIDIuOS0yLjggMi45eiIgZmlsbD0iIzQ0NCIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/563334/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563334/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B.meta.js
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
            dark3Exclude: 'img, .img, video, [style*="background"][style*="url"], svg' // 排除元素
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

        // 应用夜间模式（使用Dark Mode的滤镜方案）
        applyDarkMode() {
            // 先移除所有样式
            this.removeStyle();
            
            // 获取模式设置
            let style_30 = this.getConfig('customDark3');
            let dark3Exclude = this.getConfig('dark3Exclude');
            
            let style_31 = '';
            
            if (this.isDaytime() && !this.getConfig('runDuringDay')) {
                // 白天且没有开启白天保持，不应用夜间模式
                return;
            } else {
                // 夜间模式 - 使用反色模式
                style_31 = `
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
            }
            
            this.applyStyle(style_31);
            
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

        // 应用豆沙绿模式（使用固定颜色#C7EDCC）
        applyGreenMode() {
            // 移除所有之前可能存在的样式
            this.removeStyle();
            
            // 固定的豆沙绿颜色 #C7EDCC
            let greenColor = '#C7EDCC';
            let linkColor = '#40933C';
            let linkHover = '#2d682a';
            let scrollbarBg = '#e0f2e1';
            let scrollbarThumb = '#8bc34a';
            
            // 创建CSS
            let css = `
                html, body {
                    background-color: ${greenColor} !important;
                }
                
                /* 遍历页面元素，将浅色背景改为豆沙绿 */
                * {
                    background-color: ${greenColor} !important;
                }
                
                /* 排除不需要修改的元素 */
                img, video, iframe, canvas, 
                :not(object):not(body) > embed,
                object,
                svg image,
                [class*="player"], 
                [class*="Player"], 
                [class*="video"], 
                [class*="Video"],
                [class*="media"],
                [id*="player"],
                [id*="Player"],
                [style*="background:url"],
                [style*="background-image:url"],
                .no-green-mode,
                .video-container,
                .player-container {
                    background-color: initial !important;
                    background-image: initial !important;
                }
                
                /* 针对视频播放器的特殊处理 */
                .video-js,
                .vjs-poster,
                #player-container,
                .player-wrapper,
                .vjs-tech,
                video,
                .plyr,
                .jw-player {
                    background-color: transparent !important;
                }
                
                /* 链接颜色 */
                a, a:link, a:visited {
                    color: ${linkColor} !important;
                    text-decoration: none !important;
                }
                a:hover {
                    color: ${linkHover} !important;
                    text-decoration: underline !important;
                }
                
                /* 输入框保持白色 */
                input, textarea, select, button {
                    background-color: white !important;
                    color: #333 !important;
                }
                
                /* 滚动条样式 */
                ::-webkit-scrollbar {
                    background-color: ${scrollbarBg} !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: ${scrollbarThumb} !important;
                }
                
                /* 特殊网站的特殊处理 */
                #header, .header, .top-bar, .nav-bar {
                    background-color: ${greenColor} !important;
                }
            `;
            
            this.applyStyle(css);
            
            // 设置主题色为豆沙绿
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = greenColor;
            } else {
                let metaEle = document.createElement('meta');
                metaEle.name = 'theme-color';
                metaEle.content = greenColor;
                document.head.appendChild(metaEle);
            }
            
            // 延迟执行背景色遍历，确保DOM完全加载
            setTimeout(() => {
                this.enhanceGreenMode(greenColor);
            }, 500);
        },

        // 增强豆沙绿模式（参考原脚本逻辑）
        enhanceGreenMode(greenColor) {
            if (!document.body) return;
            
            // 遍历所有元素，只修改浅色背景为豆沙绿（RGB值大于150）
            let elements = document.querySelectorAll('*');
            for (let element of elements) {
                // 检查是否需要排除
                if (this.shouldExcludeFromGreen(element)) continue;
                
                let bgColor = window.getComputedStyle(element).backgroundColor;
                let rgb = bgColor.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    let r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);
                    // 只修改浅色背景（RGB值大于150）为豆沙绿
                    if (r > 150 && g > 150 && b > 150) {
                        element.style.backgroundColor = greenColor;
                    }
                    // 如果是透明背景，检查父元素背景色
                    else if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                        let parentBg = this.getParentBackground(element);
                        if (parentBg && parentBg.r > 150 && parentBg.g > 150 && parentBg.b > 150) {
                            element.style.backgroundColor = greenColor;
                        }
                    }
                }
            }
            
            // 额外处理一些特定元素
            let specialElements = document.querySelectorAll('DIV#gb-main, DIV.url.clearfix, DIV.nav-bar-v2-fixed > * > *:not(div.nav-bar-bottom), DIV.se-page-hd-content');
            specialElements.forEach(element => {
                element.style.backgroundColor = greenColor;
            });
        },

        // 检查元素是否需要从豆沙绿模式中排除
        shouldExcludeFromGreen(element) {
            // 排除视频、图片、播放器等元素
            return element.matches('img, video, iframe, canvas, svg, [class*="player"] > *, .video > *, [class*="Player"], [class*="video"], [class*="Video"], [class*="media"], [id*="player"], [id*="Player"], .no-green-mode');
        },

        // 获取父元素的背景色
        getParentBackground(element) {
            let parent = element.parentElement;
            while (parent) {
                let bgColor = window.getComputedStyle(parent).backgroundColor;
                let rgb = bgColor.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    return {
                        r: parseInt(rgb[0]),
                        g: parseInt(rgb[1]),
                        b: parseInt(rgb[2])
                    };
                }
                parent = parent.parentElement;
            }
            return null;
        },

        // 应用样式
        applyStyle(css) {
            // 移除旧样式
            let oldStyle = document.getElementById('eye-protect-style');
            if (oldStyle) {
                oldStyle.remove();
            }
            
            let style = document.createElement('style');
            style.id = 'eye-protect-style';
            style.innerHTML = css;
            document.head.appendChild(style);
        },

        // 移除样式
        removeStyle() {
            let style = document.getElementById('eye-protect-style');
            if (style) {
                style.remove();
            }
            
            let svg = document.getElementById('green-mode-svg');
            if (svg) {
                svg.remove();
            }
            
            // 恢复原始主题色
            let meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.content = this.getConfig('originThemeColor');
            }
        },

        // 是否应该排除当前网站
        shouldExcludeSite() {
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
            
            return globalEnable || enableList.includes(host);
        },

        // 应用模式
        applyMode() {
            if (!this.shouldApplyMode()) {
                this.removeStyle();
                return;
            }
            
            if (this.getConfig('autoExclude') && this.shouldExcludeSite()) {
                this.removeStyle();
                return;
            }
            
            let mode = this.getCurrentMode();
            
            switch(mode) {
                case 'dark':
                    this.applyDarkMode();
                    break;
                case 'green':
                    this.applyGreenMode();
                    break;
                case 'light':
                    this.removeStyle();
                    break;
                default:
                    this.removeStyle();
            }
        },

        // 切换模式（白天模式时刷新页面）
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
            
            // 更新当前模式
            this.currentMode = nextMode;
            this.setConfig('currentMode', nextMode);
            
            // 显示通知
            this.showNotification(`正在切换到 ${this.getModeName(nextMode)}`);
            
            // 应用新模式
            setTimeout(() => {
                this.applyMode();
                // 刷新菜单
                this.refreshMenu();
                
                // 如果是切换到白天模式，需要刷新页面以完全清除样式
                if (nextMode === 'light') {
                    this.showNotification('切换到白天模式，页面即将刷新...');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    this.showNotification(`已切换到 ${this.getModeName(nextMode)}`);
                }
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
                this.removeStyle(); // 立即移除样式
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
            
            let settings = `
                全局设置：
                - 当前模式：${this.getModeName(currentMode)}
                - 全局开关：${globalEnable ? '开启' : '关闭'}
                - 智能排除：${autoExclude ? '开启' : '关闭'}
                - 白天开启：${runDuringDay ? '开启' : '关闭'}
                - 跟随系统：${darkAuto ? '开启' : '关闭'}
                
                网站设置：
                - 当前网站：${host}
                - 白名单状态：${enableList.includes(host) ? '已启用' : '未启用'}
                - 强制启用：${forcedList.includes(host) ? '是' : '否'}
                
                说明：
                - 全局开启：所有网站都应用当前模式
                - 全局关闭：只对白名单中的网站应用模式
                - 白名单独立：不受全局开关影响，立即生效
                - 豆沙绿模式：使用#C7EDCC颜色，更柔和护眼
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
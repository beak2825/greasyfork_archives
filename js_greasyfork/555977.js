// ==UserScript==
// @name         视频网站增强工具
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  增强YouTube和B站体验：YouTube视频列表6列布局、视频新标签页打开、可选的剧场模式和宽屏模式
// @author       dantaKing+Jahn
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555977/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555977/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置管理
    const CONFIG_KEY = 'video_enhancer_config';
    const defaultConfig = {
        enableTheaterMode: true,
        enableBiliWideScreen: true
    };

    // 获取配置
    function getConfig() {
        try {
            const saved = GM_getValue(CONFIG_KEY);
            return saved ? JSON.parse(saved) : defaultConfig;
        } catch {
            return defaultConfig;
        }
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
    }

    let config = getConfig();
    let theaterModeProcessed = false;
    let biliWideScreenProcessed = false;

    // 检测当前网站
    const isYouTube = location.hostname.includes('youtube.com');
    const isBilibili = location.hostname.includes('bilibili.com');

    // ============= YouTube 6列布局功能 =============
    function setupYouTube6Columns() {
        if (!isYouTube) return;

        // 创建样式元素
        const style = document.createElement('style');

        // 自定义CSS
        style.textContent = `
            /* 增加视频列表至6列 */
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: 6 !important;
            }

            /* 调整视频项目宽度以适应6列 */
            ytd-rich-grid-row {
                display: grid !important;
                grid-template-columns: repeat(6, 1fr) !important;
                column-gap: 16px !important;
            }

            /* 保持视频预览位置正确 */
            .ytp-preview-container,
            .ytp-tooltip-bg,
            .ytp-tooltip-text.ytp-tooltip-text-no-title {
                transform-origin: left top;
                transition: none !important;
            }

            /* 确保视频缩略图大小合适 */
            ytd-rich-grid-media {
                width: 100% !important;
            }

            /* 调整视频信息区域宽度 */
            ytd-rich-grid-media #meta {
                width: 100% !important;
            }

            /* 防止视频标题过长时出现省略 */
            ytd-rich-grid-media #video-title {
                max-height: 4.8rem !important;
                -webkit-line-clamp: 3 !important;
            }
        `;

        // 将样式添加到文档头部
        document.head.appendChild(style);
    }

    // 创建调整网格布局的函数
    function adjustGridLayout() {
        if (!isYouTube) return;

        // 强制刷新网格布局
        const richGridRenderer = document.querySelector('ytd-rich-grid-renderer');
        if (richGridRenderer) {
            // 确保布局属性设置正确
            richGridRenderer.style.setProperty('--ytd-rich-grid-items-per-row', '6', 'important');

            // 查找所有行并强制为6列布局
            const gridRows = document.querySelectorAll('ytd-rich-grid-row');
            if (gridRows.length > 0) {
                gridRows.forEach(row => {
                    if (row.style.display !== 'grid') {
                        row.style.cssText = 'display: grid !important; grid-template-columns: repeat(6, 1fr) !important; column-gap: 16px !important;';
                    }
                });
            }
        }
    }

    // ============= 通用工具函数 =============
    // 防抖函数，避免短时间内多次触发
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 功能1：处理视频链接，使其在新标签页打开
    function processVideoLinks() {
        if (isYouTube) {
            processYouTubeLinks();
        }

        if (isBilibili) {
            processBilibiliLinks();
        }
    }

    // 处理YouTube视频链接
    function processYouTubeLinks() {
        // 获取所有可能的YouTube视频链接
        const videoLinks = document.querySelectorAll('a[href^="/watch"]:not([processed-by-script])');

        videoLinks.forEach(link => {
            // 如果链接还没有设置target属性
            if (link.getAttribute('target') !== '_blank') {
                link.setAttribute('target', '_blank');
                // 标记这个链接已被处理，避免重复处理
                link.setAttribute('processed-by-script', 'true');

                // 防止YouTube自己的事件处理覆盖我们的设置
                link.addEventListener('click', function(e) {
                    // 允许中键点击和Ctrl+点击的默认行为
                    if (!e.ctrlKey && e.button !== 1) {
                        e.stopPropagation();
                    }
                }, true);
            }
        });
    }

    // 处理哔哩哔哩视频链接
    function processBilibiliLinks() {
        // 获取所有可能的哔哩哔哩视频链接
        // 包括普通视频和番剧链接
        const videoLinks = document.querySelectorAll('a[href*="/video/"], a[href*="/bangumi/play/"]:not([processed-by-script])');

        videoLinks.forEach(link => {
            // 如果链接还没有设置target属性
            if (link.getAttribute('target') !== '_blank') {
                link.setAttribute('target', '_blank');
                // 标记这个链接已被处理，避免重复处理
                link.setAttribute('processed-by-script', 'true');

                // B站某些链接可能有自己的点击事件
                link.addEventListener('click', function(e) {
                    // 允许中键点击和Ctrl+点击的默认行为
                    if (!e.ctrlKey && e.button !== 1) {
                        e.stopPropagation();
                    }
                }, true);
            }
        });
    }

    // 功能2：自动启用YouTube剧场模式（仅限YouTube）
    function enableTheaterMode() {
        // 检查开关状态
        if (!config.enableTheaterMode) return;

        // 仅在YouTube视频页面执行，且尚未处理过
        if (isYouTube && window.location.pathname.includes('/watch') && !theaterModeProcessed) {
            // 重置计时器，确保只在稳定状态下执行
            resetTheaterModeTimer();
        }
    }

    // 实际执行YouTube剧场模式切换的函数
    function doEnableTheaterMode() {
        // 再次检查是否在YouTube视频页面
        if (!isYouTube || !window.location.pathname.includes('/watch')) {
            return;
        }

        // 查找剧场模式按钮
        let theaterButton = document.querySelector('.ytp-size-button');
        if (!theaterButton) {
            return;
        }

        // 更可靠地检查当前是否已经是剧场模式
        const playerElement = document.querySelector('ytd-watch-flexy');
        if (playerElement) {
            const isTheaterMode = playerElement.hasAttribute('theater');

            if (!isTheaterMode) {
                // 点击剧场模式按钮
                theaterButton.click();

                // 标记已处理，避免重复切换
                theaterModeProcessed = true;
            } else {
                // 已经是剧场模式，标记为已处理
                theaterModeProcessed = true;
            }
        }
    }

    // 使用延迟来重置YouTube剧场模式状态
    let theaterModeTimer = null;
    function resetTheaterModeTimer() {
        if (theaterModeTimer) {
            clearTimeout(theaterModeTimer);
        }
        theaterModeTimer = setTimeout(doEnableTheaterMode, 1500);
    }

    // 功能3：自动启用哔哩哔哩宽屏模式（仅限B站）
    function enableBiliWideScreen() {
        // 检查开关状态
        if (!config.enableBiliWideScreen) return;

        // 仅在B站视频页面执行，且尚未处理过
        if (isBilibili && !biliWideScreenProcessed && (
            window.location.pathname.includes('/video/') ||
            window.location.pathname.includes('/bangumi/play/')
        )) {
            // 重置计时器，确保只在稳定状态下执行
            resetBiliWideScreenTimer();
        }
    }

    // 实际执行B站宽屏模式切换的函数
    function doEnableBiliWideScreen() {
        // 再次检查是否在B站视频页面
        if (!isBilibili || !(
            window.location.pathname.includes('/video/') ||
            window.location.pathname.includes('/bangumi/play/')
        )) {
            return;
        }

        // 尝试多种可能的宽屏按钮选择器
        let wideScreenButtons = [
            // 普通视频页面的宽屏按钮
            document.querySelector('.bpx-player-ctrl-wide'),
            // 旧版视频页的宽屏按钮
            document.querySelector('.bilibili-player-video-btn-widescreen'),
            // 番剧页面的宽屏按钮
            document.querySelector('.squirtle-video-wide')
        ].filter(Boolean); // 过滤掉null或undefined

        if (wideScreenButtons.length === 0) {
            // 如果没找到按钮，可能是页面还没加载完，再次尝试
            setTimeout(enableBiliWideScreen, 1000);
            return;
        }

        // 获取第一个可用的宽屏按钮
        let wideScreenButton = wideScreenButtons[0];

        // 检查当前是否已经是宽屏模式
        const playerContainer = document.querySelector('.bpx-player-container') ||
                               document.querySelector('.bilibili-player-video-container');

        if (playerContainer) {
            // B站通常通过添加类名来表示宽屏模式
            const isWideScreen = playerContainer.classList.contains('bpx-state-widescreen') ||
                                playerContainer.classList.contains('bilibili-player-video-widescreen');

            if (!isWideScreen) {
                // 点击宽屏按钮
                wideScreenButton.click();

                // 标记已处理，避免重复切换
                biliWideScreenProcessed = true;
            } else {
                // 已经是宽屏模式，标记为已处理
                biliWideScreenProcessed = true;
            }
        }
    }

    // 使用延迟来重置B站宽屏模式状态
    let biliWideScreenTimer = null;
    function resetBiliWideScreenTimer() {
        if (biliWideScreenTimer) {
            clearTimeout(biliWideScreenTimer);
        }
        biliWideScreenTimer = setTimeout(doEnableBiliWideScreen, 1500);
    }

    // 注册油猴菜单命令
    function registerMenuCommands() {
        // YouTube剧场模式开关
        GM_registerMenuCommand(
            `${config.enableTheaterMode ? '✓' : '✗'} YouTube自动剧场模式`,
            () => {
                config.enableTheaterMode = !config.enableTheaterMode;
                saveConfig(config);
                theaterModeProcessed = false;
                alert(`YouTube自动剧场模式已${config.enableTheaterMode ? '开启' : '关闭'}\n刷新页面后生效`);
                location.reload();
            }
        );

        // Bilibili宽屏模式开关
        GM_registerMenuCommand(
            `${config.enableBiliWideScreen ? '✓' : '✗'} Bilibili自动宽屏模式`,
            () => {
                config.enableBiliWideScreen = !config.enableBiliWideScreen;
                saveConfig(config);
                biliWideScreenProcessed = false;
                alert(`Bilibili自动宽屏模式已${config.enableBiliWideScreen ? '开启' : '关闭'}\n刷新页面后生效`);
                location.reload();
            }
        );
    }

    // 应用设置
    function applySettings() {
        processVideoLinks();

        if (isYouTube) {
            enableTheaterMode();
            adjustGridLayout();
        }

        if (isBilibili) {
            enableBiliWideScreen();
        }
    }

    // 处理URL变化
    function handleUrlChange() {
        // 重置模式处理标志
        theaterModeProcessed = false;
        biliWideScreenProcessed = false;

        // 延迟应用设置
        setTimeout(applySettings, 500);
    }

    // 初始化
    function initialize() {
        // 注册油猴菜单
        registerMenuCommands();

        if (isYouTube) {
            setupYouTube6Columns();
        }

        applySettings();

        // 创建MutationObserver监听DOM变化，使用防抖减少触发频率
        const debouncedProcessLinks = debounce(processVideoLinks, 300);
        const debouncedAdjustGrid = debounce(adjustGridLayout, 300);

        const observer = new MutationObserver(() => {
            debouncedProcessLinks();

            if (isYouTube) {
                if (window.location.pathname.includes('/watch') && !theaterModeProcessed) {
                    enableTheaterMode();
                }
                debouncedAdjustGrid();
            }

            if (isBilibili && (
                window.location.pathname.includes('/video/') ||
                window.location.pathname.includes('/bangumi/play/')
            ) && !biliWideScreenProcessed) {
                enableBiliWideScreen();
            }
        });

        // 配置并启动观察器
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 监听窗口大小变化
        window.addEventListener('resize', function() {
            if (isYouTube) {
                setTimeout(adjustGridLayout, 200);
            }
        });

        if (isYouTube) {
            window.addEventListener('yt-navigate-finish', function() {
                setTimeout(adjustGridLayout, 500);
                theaterModeProcessed = false;
                setTimeout(enableTheaterMode, 500);
            });
        }

        // 定期检查链接
        setInterval(processVideoLinks, 2000);

        // 监听URL变化
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                handleUrlChange();
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // 启动脚本
    initialize();
})();
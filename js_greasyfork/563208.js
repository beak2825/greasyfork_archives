// ==UserScript==
// @name         YouTube 整合助手 (V17.0 代理适配版)
// @name:en      YouTube All-in-One (V18.0 Logic Fixed)
// @namespace    http://tampermonkey.net/
// @version      18.0
// @description  深度修复：1. 影院模式开关失效问题；2. 菜单项重复问题；3. 侧栏博主精准定位；4. 网速单位精准换算。
// @description:en Fix theater mode toggle, menu duplicates, sidebar blogger sync, and precise speed conversion.
// @author       BlingCc & Gemini
// @match        *://www.youtube.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563208/YouTube%20%E6%95%B4%E5%90%88%E5%8A%A9%E6%89%8B%20%28V170%20%E4%BB%A3%E7%90%86%E9%80%82%E9%85%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563208/YouTube%20%E6%95%B4%E5%90%88%E5%8A%A9%E6%89%8B%20%28V170%20%E4%BB%A3%E7%90%86%E9%80%82%E9%85%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[YT助手] V18.0 启动：影院模式逻辑已重构');

    // ==========================================
    // 配置与菜单管理
    // ==========================================
    const CONFIG = {
        get hideSidebar() { return GM_getValue('cfg_hideSidebar', true); },
        set hideSidebar(val) { GM_setValue('cfg_hideSidebar', val); },

        get autoTheater() { return GM_getValue('cfg_autoTheater', true); },
        set autoTheater(val) { GM_setValue('cfg_autoTheater', val); },

        get expandSubs() { return GM_getValue('cfg_expandSubs', true); },
        set expandSubs(val) { GM_setValue('cfg_expandSubs', val); },

        get showSpeed() { return GM_getValue('cfg_showSpeed', true); },
        set showSpeed(val) { GM_setValue('cfg_showSpeed', val); }
    };

    let menuIds = [];
    function updateMenu() {
        // 清除旧菜单项，防止重复
        menuIds.forEach(id => GM_unregisterMenuCommand(id));
        menuIds = [];

        menuIds.push(GM_registerMenuCommand(`${CONFIG.hideSidebar ? '✅' : '❌'} 隐藏右侧推荐栏`, () => {
            CONFIG.hideSidebar = !CONFIG.hideSidebar;
            applySidebarState();
            updateMenu();
        }));

        menuIds.push(GM_registerMenuCommand(`${CONFIG.autoTheater ? '✅' : '❌'} 自动进入影院模式`, () => {
            CONFIG.autoTheater = !CONFIG.autoTheater;
            // 立即触发一次模式同步
            trySyncTheaterMode(true);
            updateMenu();
        }));

        menuIds.push(GM_registerMenuCommand(`${CONFIG.showSpeed ? '✅' : '❌'} 显示网速转换 (Mbps/MBs)`, () => {
            CONFIG.showSpeed = !CONFIG.showSpeed;
            const display = document.getElementById('yt-speed-mbps');
            if (display) display.style.display = CONFIG.showSpeed ? 'inline' : 'none';
            updateMenu();
        }));
    }

    // ==========================================
    // 模块 1: 界面调整与影院模式同步
    // ==========================================
    const STYLE_ID = 'yt-clean-sidebar-style';
    const SIDEBAR_CSS = `ytd-watch-flexy #secondary { display: none !important; } ytd-watch-flexy[flexy] #primary.ytd-watch-flexy { max-width: 100% !important; min-width: 100% !important; margin-right: 0 !important; }`;

    function applySidebarState() {
        let styleEl = document.getElementById(STYLE_ID);
        if (CONFIG.hideSidebar) {
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = STYLE_ID;
                styleEl.textContent = SIDEBAR_CSS;
                (document.head || document.documentElement).appendChild(styleEl);
            }
        } else {
            if (styleEl) { styleEl.remove(); window.dispatchEvent(new Event('resize')); }
        }
    }

    // 核心修复：强制同步影院模式状态
    function trySyncTheaterMode(force = false) {
        if (!window.location.pathname.includes('/watch')) return;
        
        const app = document.querySelector('ytd-watch-flexy');
        if (!app) return;

        const isTheaterActive = app.hasAttribute('theater');
        const btn = document.querySelector('.ytp-size-button');
        if (!btn) return;

        // 如果配置为“开启”，但当前是“普通”，则点击进入
        if (CONFIG.autoTheater && !isTheaterActive) {
            btn.click();
            console.log('[YT助手] 强制进入影院模式');
        } 
        // 如果配置为“关闭”，但当前是“影院”，则点击退出
        else if (!CONFIG.autoTheater && isTheaterActive) {
            btn.click();
            console.log('[YT助手] 强制退出影院模式');
        }
    }

    // ==========================================
    // 模块 2: 网速转换 (Mbps 与 MB/s 双显)
    // ==========================================
    function checkAndHookStatsPanel() {
        const panel = document.querySelector('.html5-video-info-panel');
        if (!panel) return;

        const spans = panel.getElementsByTagName('span');
        let speedSpan = null;
        for (let span of spans) {
            if (span.textContent && (span.textContent.includes('Kbps') || span.textContent.includes('Mbps'))) {
                speedSpan = span; break;
            }
        }

        if (speedSpan) {
            let display = document.getElementById('yt-speed-mbps');
            const updateSpeed = () => {
                const text = speedSpan.textContent;
                const numMatch = text.match(/[\d\.]+/);
                if (!numMatch) return;
                const num = parseFloat(numMatch[0]);

                let mbps_val, mbs_val;
                if (text.includes('Kbps')) {
                    mbps_val = (num / 1000).toFixed(2);
                    mbs_val = (num / 8 / 1024).toFixed(2);
                } else {
                    mbps_val = num.toFixed(2);
                    mbs_val = (num / 8).toFixed(2);
                }

                if (!display || !document.contains(display)) {
                    display = document.createElement('span');
                    display.id = 'yt-speed-mbps';
                    display.style.cssText = 'margin-left:8px; color:#00e5ff; font-weight:bold; font-family: monospace;';
                    if (speedSpan.parentNode) speedSpan.parentNode.appendChild(display);
                }
                display.textContent = `(${mbps_val} Mbps | ${mbs_val} MB/s)`;
                display.style.display = CONFIG.showSpeed ? 'inline' : 'none';
            };

            updateSpeed();
            if (panel.getAttribute('data-speed-hooked') !== 'true') {
                const observer = new MutationObserver(updateSpeed);
                observer.observe(speedSpan, { characterData: true, childList: true, subtree: true });
                panel.setAttribute('data-speed-hooked', 'true');
            }
        }
    }

    // ==========================================
    // 模块 3: 下载指令 (Desktop 路径)
    // ==========================================
    function createFloatingButton() {
        if (document.getElementById('yt-helper-float-container')) return;

        const container = document.createElement('div');
        container.id = 'yt-helper-float-container';
        container.style.cssText = `position: fixed; top: 20%; right: 0; z-index: 99999; display: flex; flex-direction: column; align-items: flex-end; pointer-events: none;`;

        const mainBtn = document.createElement('div');
        mainBtn.style.cssText = `width: 44px; height: 44px; background: #cc0000; border-radius: 22px 0 0 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; pointer-events: auto; box-shadow: -2px 2px 8px rgba(0,0,0,0.4);`;
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.style.cssText = 'width:24px; height:24px; fill:white;';
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 16l-5-5h3V4h4v7h3l-5 5zm0 2v2h-8v-2h8z");
        svg.appendChild(path);
        mainBtn.appendChild(svg);

        const menu = document.createElement('div');
        menu.style.cssText = `background: rgba(28,28,28,0.95); border: 1px solid #444; border-radius: 8px 0 0 8px; padding: 12px; display: none; flex-direction: column; gap: 10px; pointer-events: auto; backdrop-filter: blur(8px); min-width: 220px; margin-top: 5px;`;

        const addItem = (title, fn) => {
            const div = document.createElement('div');
            div.style.cssText = `color:white; cursor:pointer; padding:8px; border-radius:5px; font-size:14px; transition: 0.2s;`;
            div.onmouseover = () => { div.style.background = '#333'; };
            div.onmouseout = () => { div.style.background = 'transparent'; };
            div.textContent = title;
            div.onclick = (e) => { e.stopPropagation(); fn(div); };
            menu.appendChild(div);
        };

        addItem('在线解析 (Cobalt)', () => { window.open(`https://cobalt.tools/?u=${encodeURIComponent(window.location.href)}`); });
        addItem('复制桌面下载命令 (yt-dlp)', (el) => {
            const cmd = `cd "$([Environment]::GetFolderPath('Desktop'))"; yt-dlp -f "bestvideo[height<=2160]+bestaudio/best[height<=2160]" --merge-output-format mp4 --retries infinite -N 16 -o "%(title)s.%(ext)s" "${window.location.href.split('&')[0]}"`;
            GM_setClipboard(cmd);
            el.textContent = '已复制命令！';
            setTimeout(() => { el.textContent = '复制桌面下载命令 (yt-dlp)'; }, 2000);
        });

        mainBtn.onclick = (e) => { e.stopPropagation(); menu.style.display = menu.style.display === 'none' ? 'flex' : 'none'; };
        document.addEventListener('click', () => { menu.style.display = 'none'; });

        container.append(mainBtn, menu);
        document.body.appendChild(container);
    }

    // ==========================================
    // 模块 4: 侧边栏同步与展开
    // ==========================================
    function expandSubscriptions() {
        if (!CONFIG.expandSubs) return;
        const sections = document.querySelectorAll('ytd-guide-section-renderer');
        sections.forEach((section) => {
            if (section.querySelector('a[href="/feed/subscriptions"]')) {
                const collapsible = section.querySelector('ytd-guide-collapsible-entry-renderer');
                if (collapsible && !collapsible.hasAttribute('expanded')) {
                    const expandBtn = collapsible.querySelector('#expander-item') || collapsible.querySelector('ytd-guide-entry-renderer');
                    if (expandBtn) {
                        const container = document.querySelector('#guide-inner-content');
                        const currentScroll = container ? container.scrollTop : 0;
                        expandBtn.click();
                        if (container) setTimeout(() => { container.scrollTop = currentScroll; }, 50);
                    }
                }
            }
        });
    }

    function syncSidebarWithChannel() {
        const path = window.location.pathname;
        const handleMatch = path.match(/^\/(@[\w\.-]+)/);
        if (!handleMatch) return;
        
        const handle = handleMatch[0];
        if (document.body.dataset.lastSyncedPath === path) return;

        const sidebarLinks = document.querySelectorAll('#guide-content a#endpoint');
        for (let link of sidebarLinks) {
            const href = link.getAttribute('href');
            if (href && (href === handle || href.startsWith(handle + '/'))) {
                const scrollContainer = document.querySelector('#guide-inner-content');
                if (scrollContainer) {
                    link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    link.style.transition = 'outline 0.3s';
                    link.style.outline = '2px solid #00e5ff';
                    setTimeout(() => { link.style.outline = 'none'; }, 2000);
                    document.body.dataset.lastSyncedPath = path;
                    break;
                }
            }
        }
    }

    // ==========================================
    // 主循环执行逻辑
    // ==========================================
    function setupMainLoop() {
        updateMenu(); 
        applySidebarState();

        setInterval(() => {
            const isWatch = window.location.pathname.includes('/watch');
            
            if (isWatch) {
                createFloatingButton();
                // 持续监控影院模式同步
                trySyncTheaterMode();
            } else {
                const c = document.getElementById('yt-helper-float-container');
                if (c) c.remove();
                syncSidebarWithChannel();
            }

            expandSubscriptions();
            checkAndHookStatsPanel();
        }, 1500);

        window.addEventListener('yt-navigate-finish', () => {
            const path = window.location.pathname;
            // 自动重定向至博主视频页
            if (!path.endsWith('/videos') && /^(\/@[\w\.-]+|\/channel\/[\w-]+)\/?$/.test(path)) {
                window.location.replace(path.replace(/\/$/, '') + '/videos' + window.location.search);
            }
            applySidebarState();
            // 切换页面时强制同步一次影院模式
            if (path.includes('/watch')) trySyncTheaterMode(true);
            document.body.removeAttribute('data-last-synced-path');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMainLoop);
    } else {
        setupMainLoop();
    }

})();
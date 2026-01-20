// ==UserScript==
// @name         YouTube 整合助手 (V22.5 校验修复版)
// @name:en      YouTube All-in-One (V22.5 Validation Fix)
// @namespace    http://tampermonkey.net/
// @version      22.5
// @description  1.网速显示改为 MB/s 或 GB/s；2.修复侧边栏自动定位；3.防断流下载。
// @description:en Speed display to MB/s or GB/s. Fix sidebar auto-positioning. Prevent download interruption.
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
// @downloadURL https://update.greasyfork.org/scripts/563208/YouTube%20%E6%95%B4%E5%90%88%E5%8A%A9%E6%89%8B%20%28V225%20%E6%A0%A1%E9%AA%8C%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563208/YouTube%20%E6%95%B4%E5%90%88%E5%8A%A9%E6%89%8B%20%28V225%20%E6%A0%A1%E9%AA%8C%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('YT助手 V22.5: 启动 (已修复元数据缺失)...');

    // ==========================================
    // 1. 配置管理
    // ==========================================
    const CONFIG = {
        get blockAds() { return GM_getValue('cfg_blockAds', true); },
        set blockAds(val) { GM_setValue('cfg_blockAds', val); },
        get blockShorts() { return GM_getValue('cfg_blockShorts', true); },
        set blockShorts(val) { GM_setValue('cfg_blockShorts', val); },
        get hideSidebar() { return GM_getValue('cfg_hideSidebar', true); },
        set hideSidebar(val) { GM_setValue('cfg_hideSidebar', val); },
        get autoTheater() { return GM_getValue('cfg_autoTheater', false); },
        set autoTheater(val) { GM_setValue('cfg_autoTheater', val); },
        get expandSubs() { return GM_getValue('cfg_expandSubs', true); },
        set expandSubs(val) { GM_setValue('cfg_expandSubs', val); },
        get showSpeed() { return GM_getValue('cfg_showSpeed', true); },
        set showSpeed(val) { GM_setValue('cfg_showSpeed', val); },
        get proxyAddr() { return GM_getValue('cfg_proxyAddr', 'http://127.0.0.1:30000'); },
        set proxyAddr(val) { GM_setValue('cfg_proxyAddr', val); }
    };

    // ==========================================
    // 2. 样式注入 (Safe DOM)
    // ==========================================
    function injectStyles() {
        const styleId = 'yt-helper-v22-css';
        if (document.getElementById(styleId)) return;

        let css = '';
        if (CONFIG.hideSidebar) {
            css += `ytd-watch-flexy #secondary { display: none !important; } ytd-watch-flexy[flexy] #primary.ytd-watch-flexy { max-width: 100% !important; min-width: 100% !important; margin-right: 0 !important; }`;
        }
        if (CONFIG.blockShorts) {
            css += `ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer, ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]), ytd-guide-entry-renderer:has(a[href="/shorts"]), ytd-mini-guide-entry-renderer[aria-label="Shorts"] { display: none !important; }`;
        }
        if (CONFIG.blockAds) {
            css += `ytd-ad-slot-renderer, #masthead-ad, #player-ads, .ytd-action-companion-ad-renderer, ytd-mealbar-promo-renderer, ytd-promoted-sparkles-web-renderer, ytd-banner-promo-renderer, #premium-container { display: none !important; }`;
        }
        // 高亮定位样式的补充
        css += `.yt-helper-highlight { border: 2px solid #ff0000 !important; background-color: rgba(255,0,0,0.1) !important; border-radius: 10px; box-sizing: border-box; }`;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // ==========================================
    // 3. UI 构建 (纯 DOM API)
    // ==========================================
    function createSVGIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.style.cssText = "width:28px; height:28px; fill:white;";
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z");
        svg.appendChild(path);
        return svg;
    }

    function createMenuItem(title, desc, color) {
        const item = document.createElement('div');
        item.style.cssText = `color: white; cursor: pointer; padding: 10px; border-radius: 6px; border-left: 4px solid ${color}; background: #252525; margin-bottom: 8px; font-family: sans-serif;`;

        const tDiv = document.createElement('div');
        tDiv.style.fontWeight = 'bold';
        tDiv.style.fontSize = '14px';
        tDiv.textContent = title;

        const dDiv = document.createElement('div');
        dDiv.style.fontSize = '11px';
        dDiv.style.color = '#aaa';
        dDiv.style.marginTop = '3px';
        dDiv.textContent = desc;

        item.appendChild(tDiv);
        item.appendChild(dDiv);

        item.onclick = (e) => {
            e.stopPropagation();
            const url = window.location.href.split('&')[0];
            const stableArgs = `--retries infinite --fragment-retries infinite --skip-unavailable-fragments --socket-timeout 60`;
            const cmd = `$env:HTTP_PROXY="${CONFIG.proxyAddr}"; $env:HTTPS_PROXY="${CONFIG.proxyAddr}"; cd "$([Environment]::GetFolderPath('Desktop'))"; yt-dlp ${stableArgs} --extractor-args "youtube:player-client=android,web" --no-check-certificates -f "bestvideo[height<=2160]+bestaudio/best" --merge-output-format mp4 -N 16 -o "%(title)s.%(ext)s" "${url}"`;
            GM_setClipboard(cmd);
            alert(`已复制 [${title}] 命令！\nPowerShell 粘贴即可运行。`);
        };

        item.onmouseenter = () => item.style.background = '#333';
        item.onmouseleave = () => item.style.background = '#252525';

        return item;
    }

    function renderUI() {
        if (document.getElementById('yt-helper-v22-root')) return;

        const root = document.createElement('div');
        root.id = 'yt-helper-v22-root';
        root.style.cssText = 'position: fixed; top: 20%; right: 0; z-index: 2147483647; display: flex; flex-direction: column; align-items: flex-end; font-family: Roboto, Arial, sans-serif;';

        const btn = document.createElement('div');
        btn.style.cssText = 'width: 48px; height: 48px; background: #cc0000; border-radius: 24px 0 0 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: -2px 2px 10px rgba(0,0,0,0.5); pointer-events: auto;';
        btn.appendChild(createSVGIcon());

        const menu = document.createElement('div');
        menu.style.cssText = 'display: none; background: #1a1a1a; border: 1px solid #333; border-radius: 8px 0 0 8px; padding: 12px; min-width: 250px; margin-top: 10px; box-shadow: -5px 5px 20px rgba(0,0,0,0.8); pointer-events: auto;';

        menu.appendChild(createMenuItem('复制防中断下载命令', '无限重试 + 跳过坏块 + 防断流', '#34a853'));

        btn.onclick = (e) => {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        };

        const closeHandler = () => { menu.style.display = 'none'; };
        document.addEventListener('click', closeHandler);

        root.appendChild(btn);
        root.appendChild(menu);
        (document.body || document.documentElement).appendChild(root);
    }

    // ==========================================
    // 4. 侧边栏逻辑 (展开与定位)
    // ==========================================
    function syncSidebar() {
        if (!CONFIG.expandSubs) return;
        const guide = document.querySelector('ytd-guide-renderer');
        if (guide) {
            const sections = guide.querySelectorAll('ytd-guide-section-renderer');
            for (let sec of sections) {
                if (sec.querySelector('a[href="/feed/subscriptions"]') || sec.querySelector('ytd-guide-entry-renderer a[href*="/channel/"]')) {
                    const expander = sec.querySelector('#expander-item');
                    const collapsible = sec.querySelector('ytd-guide-collapsible-entry-renderer');
                    if (collapsible && !collapsible.hasAttribute('expanded') && expander) {
                        expander.click();
                        setTimeout(locateCurrentChannel, 500);
                        return;
                    }
                }
            }
        }
        locateCurrentChannel();
    }

    function locateCurrentChannel() {
        const path = window.location.pathname;
        let handle = null;
        if (path.startsWith('/@')) handle = path.split('/')[1];
        else if (path.startsWith('/channel/')) handle = path.split('/')[2];
        else if (path.includes('/watch')) {
            const ownerLink = document.querySelector('ytd-video-owner-renderer a.ytd-video-owner-renderer');
            if (ownerLink) {
                const href = ownerLink.getAttribute('href');
                if (href) handle = href.split('/').pop();
            }
        }

        if (!handle) return;
        const items = document.querySelectorAll('ytd-guide-entry-renderer a');
        for (let a of items) {
            const href = a.getAttribute('href');
            if (href && (href.includes(handle) || href === `/${handle}`)) {
                const row = a.closest('ytd-guide-entry-renderer');
                if (row) {
                    if (row.classList.contains('yt-helper-highlight')) return;
                    document.querySelectorAll('.yt-helper-highlight').forEach(el => el.classList.remove('yt-helper-highlight'));
                    row.classList.add('yt-helper-highlight');
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    break;
                }
            }
        }
    }

    // ==========================================
    // 5. 自动化逻辑
    // ==========================================
    function formatSpeed(kbps) {
        // 1 Mbps = 1000 Kbps
        const mbs = kbps / 8000; // 转换为 MB/s

        if (mbs >= 1024) {
            return (mbs / 1024).toFixed(2) + ' GB/s';
        } else if (mbs >= 1) {
            return mbs.toFixed(2) + ' MB/s';
        } else {
            // 如果小于1MB/s，显示 KB/s 比较友好，或者直接显示 0.xx MB/s
            return (mbs * 1024).toFixed(0) + ' KB/s';
        }
    }

    function handleAutomation() {
        // 广告
        if (CONFIG.blockAds) {
            const ad = document.querySelector('.ad-showing, .ad-interrupting');
            if (ad) {
                const v = document.querySelector('video');
                if (v) { v.muted = true; v.playbackRate = 16; }
                const skip = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
                if (skip) skip.click();
            }
        }
        // 影院模式
        if (CONFIG.autoTheater && window.location.pathname === '/watch') {
            const flexy = document.querySelector('ytd-watch-flexy');
            const size = document.querySelector('.ytp-size-button');
            if (flexy && size && !flexy.hasAttribute('theater')) size.click();
        }
        // 网速显示 (修正为 MB/s 或 GB/s)
        if (CONFIG.showSpeed) {
            const panel = document.querySelector('.html5-video-info-panel');
            if (panel && panel.style.display !== 'none') {
                const spans = panel.getElementsByTagName('span');
                let targetSpan = null;
                for(let s of spans) {
                    if(s.textContent.includes('Kbps') || s.textContent.includes('Mbps')) {
                        targetSpan = s; break;
                    }
                }
                if (targetSpan) {
                    let display = document.getElementById('yt-speed-v22');
                    if (!display) {
                        display = document.createElement('span');
                        display.id = 'yt-speed-v22';
                        display.style.cssText = 'margin-left:10px; color:#ff0000; font-weight:bold; font-family: monospace; font-size: 1.1em;';
                        targetSpan.parentNode.appendChild(display);
                    }

                    let kbpsVal = 0;
                    const txt = targetSpan.textContent;
                    const num = parseFloat(txt.match(/[\d\.]+/));

                    if (txt.includes('Mbps')) {
                        kbpsVal = num * 1000;
                    } else if (txt.includes('Kbps')) {
                        kbpsVal = num;
                    }

                    display.textContent = `⚡ ${formatSpeed(kbpsVal)}`;
                }
            }
        }

        if (Math.random() < 0.2) syncSidebar();
    }

    // ==========================================
    // 6. 主循环
    // ==========================================
    function init() {
        const updateMenu = () => location.reload();

        GM_registerMenuCommand(`🌐 设置代理 (当前: ${CONFIG.proxyAddr})`, () => {
             const v = prompt("输入代理:", CONFIG.proxyAddr);
             if(v) { CONFIG.proxyAddr = v; updateMenu(); }
        });
        GM_registerMenuCommand(`${CONFIG.blockAds?'✅':'❌'} 屏蔽广告 & Premium`, () => { CONFIG.blockAds =!CONFIG.blockAds; updateMenu(); });
        GM_registerMenuCommand(`${CONFIG.blockShorts?'✅':'❌'} 屏蔽 Shorts`, () => { CONFIG.blockShorts =!CONFIG.blockShorts; updateMenu(); });
        GM_registerMenuCommand(`${CONFIG.hideSidebar?'✅':'❌'} 隐藏右侧栏`, () => { CONFIG.hideSidebar =!CONFIG.hideSidebar; updateMenu(); });
        GM_registerMenuCommand(`${CONFIG.autoTheater?'✅':'❌'} 自动影院模式`, () => { CONFIG.autoTheater =!CONFIG.autoTheater; updateMenu(); });
        GM_registerMenuCommand(`${CONFIG.expandSubs?'✅':'❌'} 自动展开 & 定位`, () => { CONFIG.expandSubs =!CONFIG.expandSubs; updateMenu(); });
        GM_registerMenuCommand(`${CONFIG.showSpeed?'✅':'❌'} 显示网速 (MB/s)`, () => { CONFIG.showSpeed =!CONFIG.showSpeed; updateMenu(); });

        setInterval(() => {
            const isWatch = window.location.pathname.includes('/watch') || window.location.search.includes('v=');
            injectStyles();
            if (isWatch) {
                renderUI();
                handleAutomation();
            } else {
                const r = document.getElementById('yt-helper-v22-root');
                if (r) r.remove();
                if (CONFIG.expandSubs) syncSidebar();
            }
        }, 1000);

        window.addEventListener('yt-navigate-finish', () => {
            document.querySelectorAll('.yt-helper-highlight').forEach(el => el.classList.remove('yt-helper-highlight'));
            if (/^(\/@[\w\.-]+)\/?$/.test(window.location.pathname)) {
                 window.location.replace(window.location.pathname + '/videos');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
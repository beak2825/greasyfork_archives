// ==UserScript==
// @name         全能流媒体 ID & 链接提取工具 (Ultimate v5.0)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  大幅增强站点识别率，支持主流中外流媒体平台，新增TVB Anywhere识别。
// @author       Gemini
// @match        *://*.netflix.com/*
// @match        *://*.disneyplus.com/*
// @match        *://*.hamivideo.hinet.net/*
// @match        *://*.video.friday.tw/*
// @match        *://*.v.qq.com/*
// @match        *://*.v.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.nowplayer.now.com/*
// @match        *://*.iq.com/*
// @match        *://*.myvideo.net.tw/*
// @match        *://*.mewatch.sg/*
// @match        *://*.viu.com/*
// @match        *://*.linetv.tw/*
// @match        *://*.mytvsuper.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.bilibili.tv/*
// @match        *://*.wetv.vip/*
// @match        *://*.miguvideo.com/*
// @match        *://*.catchplay.com/*
// @match        *://*.tvbanywhere.com/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563546/%E5%85%A8%E8%83%BD%E6%B5%81%E5%AA%92%E4%BD%93%20ID%20%20%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20%28Ultimate%20v50%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563546/%E5%85%A8%E8%83%BD%E6%B5%81%E5%AA%92%E4%BD%93%20ID%20%20%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20%28Ultimate%20v50%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentContent = '';
    let lastPath = '';

    // --- 1. UI 组件 ---
    const btn = document.createElement('div');
    const initUI = () => {
        const top = GM_getValue('btn_top', '150px');
        const left = GM_getValue('btn_left', (window.innerWidth - 160) + 'px');
        Object.assign(btn.style, {
            position: 'fixed', top, left, zIndex: '2147483647',
            padding: '12px', backgroundColor: 'rgba(20, 20, 20, 0.95)',
            color: '#fff', cursor: 'grab', borderRadius: '14px',
            border: '1px solid #444', textAlign: 'center', minWidth: '130px',
            backdropFilter: 'blur(15px)', transition: 'opacity 0.3s',
            display: 'none', opacity: '0', userSelect: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)', fontSize: '12px'
        });
        document.body.appendChild(btn);
    };

    // --- 2. 核心提取逻辑 (增强版) ---
    const getID = () => {
        const url = new URL(window.location.href);
        const p = url.pathname;
        const host = url.hostname;
        const sp = url.searchParams;

        // --- 国际站 & 特殊规则 ---
        if (host.includes('catchplay.com')) {
            const m = p.match(/\/video\/([a-f0-9-]+)/);
            if (!m) return null;
            const el = document.querySelector('.sc-3a20c785-2, .iJaIlm');
            if (el) {
                const s = parseSeason(el.innerText);
                const offset = s >= 11 ? ((s - 1) % 10) : (s - 1);
                return offset > 0 ? `${m[1]}_${offset + 1}` : m[1];
            }
            return m[1];
        }
        if (host.includes('netflix.com')) return sp.get('jbv') || p.match(/\/title\/(\d+)/)?.[1];
        if (host.includes('disneyplus.com')) return p.match(/(?:video|series)\/([^\/]+)/)?.[1] || p.match(/entity-[a-f0-9-]+/)?.[0];
        if (host.includes('bilibili.com')) return p.match(/\/(ep\d+|ss\d+)/)?.[1] ? p.match(/\/(ep\d+|ss\d+)/)[1] + '_tv' : null;
        if (host.includes('bilibili.tv')) return p.match(/\/play\/\d+\/(\d+)/)?.[1] ? 'ep' + p.match(/\/play\/\d+\/(\d+)/)[1] : null;

        // --- 国内站 (多路径兼容) ---
        if (host.includes('v.qq.com')) return p.match(/\/cover\/([^\/.]+)/)?.[1] || sp.get('id');
        if (host.includes('iqiyi.com')) return p.match(/\/(v_[^\.]+)\.html/)?.[1] || sp.get('album_id');
        if (host.includes('v.youku.com')) return p.match(/\/id_([^\.]+)\.html/)?.[1];
        if (host.includes('mgtv.com')) return p.match(/\/[bc]\/(\d+)/)?.[1];
        if (host.includes('wetv.vip')) return p.match(/\/play\/([a-z0-9]+)/i)?.[1];
        if (host.includes('iq.com')) return p.match(/-([a-z0-9]+)$/i)?.[1] || sp.get('shameid');
        
        // --- 港台/东南亚站 ---
        if (host.includes('linetv.tw')) return p.match(/\/drama\/(\d+)/)?.[1];
        if (host.includes('mytvsuper.com')) return p.match(/_(\d+)\//)?.[1] || sp.get('programme_id');
        if (host.includes('tvbanywhere.com')) return p.match(/\/programme\/[^/]+_(\d+)\//)?.[1];
        if (host.includes('mewatch.sg')) return p.match(/-(\d+)$/)?.[1];
        if (host.includes('now.com')) return sp.get('id') ? `${url.origin}${p}?id=${sp.get('id')}&type=${sp.get('type')}` : null;
        
        // --- 完整链接返回类 ---
        const fullLinkSites = ['viu.com', 'myvideo.net.tw', 'hamivideo.hinet.net', 'video.friday.tw', 'miguvideo.com'];
        if (fullLinkSites.some(s => host.includes(s)) && p.length > 5) return window.location.href;

        return null;
    };

    function parseSeason(t) {
        const m = t.match(/S(\d+)/i); if (m) return parseInt(m[1]);
        const r = { I: 1, V: 5, X: 10, L: 50 };
        const rm = t.match(/\b([IVX]+)\b$/i);
        if (rm) return [...rm[1]].reduce((acc, c, i, a) => r[a[i+1]] > r[c] ? acc - r[c] : acc + r[c], 0);
        return 1;
    }

    // --- 3. 交互与记忆 ---
    let isDrag = false, sx, sy, ix, iy;
    btn.onpointerdown = (e) => {
        isDrag = true; sx = e.clientX; sy = e.clientY;
        ix = btn.offsetLeft; iy = btn.offsetTop;
        btn.style.cursor = 'grabbing';
        window.onpointermove = (ev) => {
            if (!isDrag) return;
            const nx = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, ix + (ev.clientX - sx)));
            const ny = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, iy + (ev.clientY - sy)));
            btn.style.left = nx + 'px'; btn.style.top = ny + 'px';
        };
        window.onpointerup = (ev) => {
            isDrag = false; btn.style.cursor = 'grab';
            GM_setValue('btn_top', btn.style.top); GM_setValue('btn_left', btn.style.left);
            if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) copyAction();
            window.onpointermove = null; window.onpointerup = null;
        };
    };

    const copyAction = () => {
        if (!currentContent) return;
        GM_setClipboard(currentContent);
        const old = btn.innerHTML;
        btn.innerHTML = '<div style="color:#00ff88; padding:4px;">✨ 已复制 ✨</div>';
        setTimeout(() => btn.innerHTML = old, 1000);
    };

    const refresh = () => {
        const id = getID();
        if (id && id !== currentContent) {
            currentContent = id;
            let show = id.startsWith('http') ? '链接' : id;
            if (show.length > 14) show = show.substring(0, 11) + '...';
            btn.innerHTML = `<div style="color:#888;font-size:10px;margin-bottom:4px;">点击复制</div><code style="color:#ffd700;background:#000;padding:2px 6px;border-radius:4px;">${show}</code>`;
            btn.style.display = 'block';
            setTimeout(() => btn.style.opacity = '1', 50);
        } else if (!id) {
            btn.style.opacity = '0';
            setTimeout(() => { if (!getID()) btn.style.display = 'none'; }, 300);
            currentContent = '';
        }
    };

    // --- 4. 监听与初始化 ---
    initUI();
    setInterval(() => {
        if (lastPath !== location.href) {
            lastPath = location.href;
            refresh();
        }
    }, 1000);
    
    // 专门针对 Catchplay 这种动态切换 Tab 的处理
    const obs = new MutationObserver(refresh);
    obs.observe(document.body, { childList: true, subtree: true });
    
    setTimeout(refresh, 2000);
})();

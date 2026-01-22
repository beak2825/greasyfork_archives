// ==UserScript==
// @name         全能流媒体 ID & 链接提取工具 (Ultimate v3.0)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  支持 Netflix, Disney+, 腾讯, 优酷, 爱奇艺, 芒果, NowPlayer, mewatch, LINE TV, myTV SUPER 提取ID；Viu, MyVideo, Hami, friDay 复制全链接。支持位置记忆。
// @author       Gemini
// @match        https://www.netflix.com/*
// @match        https://www.disneyplus.com/*
// @match        https://hamivideo.hinet.net/*
// @match        https://video.friday.tw/*
// @match        https://v.qq.com/*
// @match        https://v.youku.com/*
// @match        https://www.iqiyi.com/*
// @match        https://www.mgtv.com/*
// @match        https://nowplayer.now.com/*
// @match        https://www.iq.com/*
// @match        https://www.myvideo.net.tw/*
// @match        https://www.mewatch.sg/*
// @match        https://www.viu.com/*
// @match        https://www.linetv.tw/*
// @match        https://www.mytvsuper.com/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563546/%E5%85%A8%E8%83%BD%E6%B5%81%E5%AA%92%E4%BD%93%20ID%20%20%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20%28Ultimate%20v30%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563546/%E5%85%A8%E8%83%BD%E6%B5%81%E5%AA%92%E4%BD%93%20ID%20%20%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20%28Ultimate%20v30%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;
    let currentContent = '';

    // 1. 创建悬浮窗并加载保存的位置 (位置记忆核心)
    const btn = document.createElement('div');
    btn.id = 'media-id-fetcher';
    btn.innerHTML = '正在扫描...';

    const savedTop = GM_getValue('btn_top', '150px');
    const savedLeft = GM_getValue('btn_left', null);

    Object.assign(btn.style, {
        position: 'fixed',
        top: savedTop,
        left: savedLeft,
        right: savedLeft ? 'auto' : '20px',
        zIndex: '999999',
        padding: '12px',
        backgroundColor: 'rgba(34, 34, 34, 0.9)',
        color: '#fff',
        cursor: 'move',
        borderRadius: '12px',
        fontWeight: 'bold',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        fontSize: '13px',
        border: '1px solid #444',
        userSelect: 'none',
        textAlign: 'center',
        minWidth: '145px',
        backdropFilter: 'blur(4px)',
        transition: 'background-color 0.2s, border 0.2s'
    });
    document.body.appendChild(btn);

    // 2. 鼠标拖拽逻辑
    let isDragging = false;
    let offsetX, offsetY;

    btn.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - btn.getBoundingClientRect().left;
        offsetY = e.clientY - btn.getBoundingClientRect().top;
        btn.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        x = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, y));
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            btn.style.transition = 'background-color 0.2s, border 0.2s';
            // 保存位置到 Tampermonkey 存储
            GM_setValue('btn_top', btn.style.top);
            GM_setValue('btn_left', btn.style.left);
        }
    });

    // 3. 核心提取逻辑
    function getIdentifier() {
        const url = new URL(window.location.href);
        const path = url.pathname;
        const search = url.searchParams;

        // Netflix
        if (url.hostname.includes('netflix.com')) return search.get('jbv');

        // Disney+
        if (url.hostname.includes('disneyplus.com')) {
            const match = path.match(/entity-[a-f0-9-]+/);
            return match ? match[0] : null;
        }

        // 腾讯视频
        if (url.hostname.includes('v.qq.com')) {
            const match = path.match(/\/cover\/([^\/]+)/);
            return match ? match[1] : null;
        }

        // 优酷
        if (url.hostname.includes('v.youku.com')) {
            const match = path.match(/\/id_([^\.]+)\.html/);
            return match ? match[1] : null;
        }

        // 爱奇艺 (内)
        if (url.hostname.includes('iqiyi.com')) {
            const match = path.match(/\/(v_[^\.]+)\.html/);
            return match ? match[1] : null;
        }

        // 爱奇艺国际版 (iq.com)
        if (url.hostname.includes('iq.com')) {
            const match = path.match(/-([a-z0-9]+)$/i);
            return match ? match[1] : null;
        }

        // 芒果 TV
        if (url.hostname.includes('mgtv.com')) {
            const match = path.match(/\/b\/(\d+)/);
            return match ? match[1] : null;
        }

        // LINE TV
        if (url.hostname.includes('linetv.tw')) {
            const match = path.match(/\/drama\/(\d+)/);
            return match ? match[1] : null;
        }

        // myTV SUPER (新增) - 提取下划线后的数字
        if (url.hostname.includes('mytvsuper.com')) {
            const match = path.match(/_(\d+)\//);
            return match ? match[1] : null;
        }

        // Now Player
        if (url.hostname.includes('now.com')) {
            const id = search.get('id');
            const type = search.get('type');
            if (id && type) return `${url.origin}${url.pathname}?id=${id}&type=${type}`;
        }

        // mewatch
        if (url.hostname.includes('mewatch.sg')) {
            const match = path.match(/-(\d+)$/);
            return match ? match[1] : null;
        }

        // --- 复制完整链接模式 ---
        if (url.hostname.includes('viu.com') && path.includes('/vod/')) return window.location.href;
        if (url.hostname.includes('myvideo.net.tw') && path.includes('details')) return window.location.href;
        if (url.hostname.includes('hamivideo.hinet.net') && path.includes('product')) return window.location.href;
        if (url.hostname.includes('friday.tw') && path.includes('detail')) return window.location.href;

        return null;
    }

    // 4. UI 界面更新
    function refreshUI() {
        const content = getIdentifier();
        if (content) {
            currentContent = content;
            const isUrl = content.startsWith('http');
            const displayText = isUrl ? '复制完整链接' : '点击复制 ID';
            let displayCode = isUrl ? (content.split('?')[0].split('/').filter(Boolean).pop()) : content;
            if (displayCode && displayCode.length > 15) displayCode = displayCode.substring(0, 12) + '...';

            btn.innerHTML = `<div style="margin-bottom:4px; font-size:11px; color:#aaa;">${displayText}</div><code style="color:#ffd700; background:#000; padding:2px 4px; border-radius:4px; font-size:10px; display:block;">${displayCode || 'LINK'}</code>`;
            btn.style.borderLeft = '4px solid #E50914';
        } else {
            currentContent = '';
            btn.innerHTML = '<span style="color:#666;">未检测到目标</span>';
            btn.style.borderLeft = '4px solid #444';
        }
    }

    // 5. 点击复制
    btn.addEventListener('click', () => {
        if (currentContent && !isDragging) {
            GM_setClipboard(currentContent);
            const oldHTML = btn.innerHTML;
            btn.innerHTML = '<div style="color:#28a745; margin-top:5px;">✅ 已存入剪贴板</div>';
            setTimeout(() => { btn.innerHTML = oldHTML; }, 1200);
        }
    });

    // 6. 持续监听页面变化 (针对单页应用切换)
    setInterval(() => {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            refreshUI();
        }
    }, 500);

    refreshUI();
})();
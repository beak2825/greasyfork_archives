// ==UserScript==
// @name         全能流媒体 ID & 链接提取工具 (Ultimate v3.7)
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  支持全平台 ID 提取，识别成功后自动显示悬浮窗，支持位置记忆。
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
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.tv/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563546/%E5%85%A8%E8%83%BD%E6%B5%81%E5%AA%92%E4%BD%93%20ID%20%20%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20%28Ultimate%20v37%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563546/%E5%85%A8%E8%83%BD%E6%B5%81%E5%AA%92%E4%BD%93%20ID%20%20%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20%28Ultimate%20v37%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;
    let currentContent = '';

    // 1. 创建悬浮窗（默认不显示）
    const btn = document.createElement('div');
    btn.id = 'media-id-fetcher';
    
    const savedTop = GM_getValue('btn_top', '150px');
    const savedLeft = GM_getValue('btn_left', null);

    Object.assign(btn.style, {
        position: 'fixed',
        top: savedTop,
        left: savedLeft,
        right: savedLeft ? 'auto' : '20px',
        zIndex: '2147483647',
        padding: '12px',
        backgroundColor: 'rgba(34, 34, 34, 0.95)',
        color: '#fff',
        cursor: 'grab',
        borderRadius: '12px',
        fontWeight: 'bold',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        fontSize: '13px',
        border: '1px solid #555',
        userSelect: 'none',
        textAlign: 'center',
        minWidth: '145px',
        backdropFilter: 'blur(8px)',
        touchAction: 'none',
        display: 'none' // 默认隐藏
    });
    document.body.appendChild(btn);

    // 2. 增强型拖拽逻辑
    let isDragging = false;
    let startX, startY, initialX, initialY;

    const startDrag = (e) => {
        isDragging = true;
        btn.style.cursor = 'grabbing';
        btn.style.transition = 'none';
        startX = e.clientX;
        startY = e.clientY;
        const rect = btn.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        window.addEventListener('pointermove', doDrag, true);
        window.addEventListener('pointerup', stopDrag, true);
    };

    const doDrag = (e) => {
        if (!isDragging) return;
        e.stopImmediatePropagation();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newX = initialX + dx;
        let newY = initialY + dy;
        newX = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, newY));
        btn.style.left = newX + 'px';
        btn.style.top = newY + 'px';
        btn.style.right = 'auto';
    };

    const stopDrag = (e) => {
        if (!isDragging) return;
        const moveDist = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
        isDragging = false;
        btn.style.cursor = 'grab';
        GM_setValue('btn_top', btn.style.top);
        GM_setValue('btn_left', btn.style.left);
        window.removeEventListener('pointermove', doDrag, true);
        window.removeEventListener('pointerup', stopDrag, true);
        if (moveDist < 6) handleCopy();
    };

    btn.addEventListener('pointerdown', startDrag);

    // 3. 提取逻辑
    function getIdentifier() {
        const url = new URL(window.location.href);
        const path = url.pathname, search = url.searchParams;

        if (url.hostname.includes('bilibili.tv')) return path.match(/\/play\/\d+\/(\d+)/) ? 'ep' + path.match(/\/play\/\d+\/(\d+)/)[1] : null;
        if (url.hostname.includes('bilibili.com')) return path.match(/\/(ep\d+)/)?.[1] ? path.match(/\/(ep\d+)/)[1] + '_tv' : null;
        if (url.hostname.includes('mgtv.com')) return path.match(/\/b\/(\d+)/)?.[1];
        if (url.hostname.includes('iqiyi.com')) return path.match(/\/(v_[^\.]+)\.html/)?.[1];
        if (url.hostname.includes('iq.com')) return path.match(/-([a-z0-9]+)$/i)?.[1];
        if (url.hostname.includes('v.qq.com')) return path.match(/\/cover\/([^\/]+)/)?.[1];
        if (url.hostname.includes('v.youku.com')) return path.match(/\/id_([^\.]+)\.html/)?.[1];
        if (url.hostname.includes('netflix.com')) return search.get('jbv');
        if (url.hostname.includes('disneyplus.com')) return path.match(/entity-[a-f0-9-]+/)?.[0];
        if (url.hostname.includes('linetv.tw')) return path.match(/\/drama\/(\d+)/)?.[1];
        if (url.hostname.includes('mytvsuper.com')) return path.match(/_(\d+)\//)?.[1];
        if (url.hostname.includes('now.com')) {
            const id = search.get('id'), t = search.get('type');
            return (id && t) ? `${url.origin}${url.pathname}?id=${id}&type=${t}` : null;
        }
        if (url.hostname.includes('mewatch.sg')) return path.match(/-(\d+)$/)?.[1];

        const fullLinkSites = ['viu.com', 'myvideo.net.tw', 'hamivideo.hinet.net', 'video.friday.tw'];
        const fullLinkPaths = ['/vod/', 'details', 'product', 'detail'];
        if (fullLinkSites.some(s => url.hostname.includes(s)) && fullLinkPaths.some(p => path.includes(p))) return window.location.href;

        return null;
    }

    // 4. UI 刷新（控制显示与隐藏）
    function refreshUI() {
        const content = getIdentifier();
        if (content) {
            currentContent = content;
            const isUrl = content.startsWith('http');
            let displayCode = isUrl ? (content.split('?')[0].split('/').filter(Boolean).pop()) : content;
            if (displayCode && displayCode.length > 15) displayCode = displayCode.substring(0, 12) + '...';

            btn.innerHTML = `<div style="margin-bottom:4px; font-size:11px; color:#aaa;">${isUrl ? '复制链接' : '复制 ID'}</div><code style="color:#ffd700; background:#000; padding:2px 4px; border-radius:4px; font-size:10px; display:block;">${displayCode || 'LINK'}</code>`;
            btn.style.borderLeft = '4px solid #E50914';
            btn.style.display = 'block'; // 识别成功，显示
        } else {
            currentContent = '';
            btn.style.display = 'none'; // 识别失败，隐藏
        }
    }

    // 5. 执行复制
    function handleCopy() {
        if (currentContent) {
            GM_setClipboard(currentContent);
            const oldHTML = btn.innerHTML;
            btn.innerHTML = '<div style="color:#28a745; margin-top:5px;">✅ 已复制</div>';
            setTimeout(() => { btn.innerHTML = oldHTML; }, 1200);
        }
    }

    // 监听 URL 变化
    setInterval(() => {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            refreshUI();
        }
    }, 800);

    // 初始执行
    refreshUI();
})();

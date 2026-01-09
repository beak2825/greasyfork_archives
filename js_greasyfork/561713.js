// ==UserScript==
// @name         XZD专用ZLX解析脚本
// @namespace    https://zlx.one/
// @version      5.6
// @description  更新描述
// @match        *://*.zlx.one/*
// @match        *://*.zl-x.xyz/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561713/XZD%E4%B8%93%E7%94%A8ZLX%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/561713/XZD%E4%B8%93%E7%94%A8ZLX%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let played = false;

    /* ========== m3u8 修复 ========== */
    function fixM3U8(url) {
        if (!url) return null;
        if (url.includes('playm3u8?m3u8=')) url = decodeURIComponent(url.split('playm3u8?m3u8=')[1]);
        if (!url.includes('.m3u8')) return null;
        if (url.includes('/try/')) url = url.replace('/try/', '/movie/auto/');
        return url.replace(/\.m3u8.*/, '.m3u8');
    }

    /* ========== iframe 播放器 ========== */
    function openPlayer(m3u8Url) {
        if (played) return;
        played = true;
        const wrap = document.createElement('div');
        wrap.style.cssText = `position:fixed; inset:0; background:#000; z-index:999999;`;
        const close = document.createElement('div');
        close.textContent = '✕';
        close.style.cssText = `position:absolute; top:12px; right:18px; font-size:30px; color:#b2e2e; cursor:pointer; z-index:1000000;`;
        close.onclick = () => wrap.remove();
        const iframe = document.createElement('iframe');
        iframe.src = 'https://tools.liumingye.cn/m3u8/#' + m3u8Url;
        iframe.style.cssText = 'width:100%;height:100%;border:none;';
        iframe.allowFullscreen = true;
        wrap.append(close, iframe);
        document.body.appendChild(wrap);
    }

    /* ========== 网络嗅探 ========== */
    const xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        const fixed = fixM3U8(url);
        if (fixed) setTimeout(() => openPlayer(fixed), 200);
        return xhrOpen.apply(this, arguments);
    };
    const rawFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input?.url;
        const fixed = fixM3U8(url);
        if (fixed) setTimeout(() => openPlayer(fixed), 200);
        return rawFetch.apply(this, arguments);
    };

    /* ========== 可拖动按钮函数 ========== */
    function makeDraggable(btn) {
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        btn.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - btn.getBoundingClientRect().left;
            offsetY = e.clientY - btn.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        };
        document.onmousemove = (e) => {
            if (!isDragging) return;
            btn.style.left = e.clientX - offsetX + 'px';
            btn.style.top = e.clientY - offsetY + 'px';
        };
        document.onmouseup = () => {
            isDragging = false;
            document.body.style.userSelect = '';
        };
    }

    /* ========== 添加按钮 ========== */
    function addButtons() {
        if (document.querySelector('#global-crack-btn')) return;

        // 金币跳转按钮
        const crackBtn = document.createElement('button');
        crackBtn.id = 'global-crack-btn';
        crackBtn.textContent = 'PC专用-金币视频跳转-XZD破解';
        crackBtn.style.cssText = `
            position:fixed;
            bottom:100px;
            left:20px;
            z-index:9999999;
            background:rgba(255,77,79,0.85);
            color:#fff;
            font-size:13px;
            padding:8px 12px;
            border:none;
            border-radius:24px;
            cursor:pointer;
            box-shadow:0 4px 12px rgba(0,0,0,0.2);
            transition:all 0.2s ease;
        `;
        crackBtn.onmouseover = () => crackBtn.style.background = 'rgba(255,77,79,1)';
        crackBtn.onmouseout = () => crackBtn.style.background = 'rgba(255,77,79,0.85)';
        crackBtn.onclick = () => {
            if (location.href.includes('/play/')) {
                location.href = location.href.replace('/play/', '/player/');
            } else {
                alert('当前页面不是金币页，无法跳转！');
            }
        };
        makeDraggable(crackBtn);

        // HVP按钮
        const hvpBtn = document.createElement('button');
        hvpBtn.textContent = '海阔专用HVP完整视频(建议关闭悬浮嗅探)';
        hvpBtn.style.cssText = `
            position:fixed;
            bottom:50px;
            left:20px;
            z-index:9999999;
            background:rgba(22,119,255,0.85);
            color:#fff;
            font-size:13px;
            padding:8px 12px;
            border:none;
            border-radius:24px;
            cursor:pointer;
            box-shadow:0 4px 12px rgba(0,0,0,0.2);
            transition:all 0.2s ease;
        `;
        hvpBtn.onmouseover = () => hvpBtn.style.background = 'rgba(22,119,255,1)';
        hvpBtn.onmouseout = () => hvpBtn.style.background = 'rgba(22,119,255,0.85)';
        hvpBtn.onclick = () => {
            const span = document.querySelector('span.mac_history_set');
            if (!span) { alert('页面未找到隐藏的 mac_history_set 元素'); return; }
            const picUrl = span.dataset.pic;
            if (!picUrl) { alert('data-pic 不存在，无法提取视频ID'); return; }
            const match = picUrl.match(/\/([0-9a-f]{24,32})\//);
            if (!match) { alert('无法从 data-pic 提取视频ID'); return; }
            const videoId = match[1];
            const m3u8Url = `https://video.zl-x.xyz/movie/auto/${videoId}.m3u8`;
            if (typeof fy_bridge_app?.playVideo === 'function') {
                fy_bridge_app.playVideo(m3u8Url);
            } else { alert('fy_bridge_app.playVideo 不存在'); }
        };
        makeDraggable(hvpBtn);

        document.documentElement.append(crackBtn, hvpBtn);
    }

    addButtons();

})();

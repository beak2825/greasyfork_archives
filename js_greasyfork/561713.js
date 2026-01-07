// ==UserScript==
// @name         XZD专用ZLX解析脚本
// @namespace    https://zlx.one/
// @version      4.3
// @description  增加HVP直调播放器
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
    let lastM3U8 = null; // ⭐ 保存修复后的m3u8

    /* ========== m3u8 修复 ========== */
    function fixM3U8(url) {
        if (!url) return null;

        if (url.includes('playm3u8?m3u8=')) {
            url = decodeURIComponent(url.split('playm3u8?m3u8=')[1]);
        }

        if (!url.includes('.m3u8')) return null;

        if (url.includes('/try/')) {
            url = url.replace('/try/', '/movie/auto/');
        }

        return url.replace(/\.m3u8.*/, '.m3u8');
    }

    /* ========== 播放器（iframe备用） ========== */
    function openPlayer(m3u8Url) {
        if (played) return;
        played = true;

        const wrap = document.createElement('div');
        wrap.style.cssText = `
            position:fixed;
            inset:0;
            background:#000;
            z-index:999999;
        `;

        const close = document.createElement('div');
        close.textContent = '✕';
        close.style.cssText = `
            position:absolute;
            top:12px;
            right:18px;
            font-size:30px;
            color:#b2e2e;
            cursor:pointer;
            z-index:1000000;
        `;
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
        if (fixed) {
            lastM3U8 = fixed; // ⭐ 保存
            setTimeout(() => openPlayer(fixed), 200);
        }
        return xhrOpen.apply(this, arguments);
    };

    const rawFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input?.url;
        const fixed = fixM3U8(url);
        if (fixed) {
            lastM3U8 = fixed; // ⭐ 保存
            setTimeout(() => openPlayer(fixed), 200);
        }
        return rawFetch.apply(this, arguments);
    };

    /* ========== 左上角按钮区 ========== */
    function addButtons() {
        if (document.querySelector('#global-crack-btn')) return;

        // 金币跳转按钮
        const crackBtn = document.createElement('button');
        crackBtn.id = 'global-crack-btn';
        crackBtn.textContent = '金币视频跳转-XZD破解';
        crackBtn.style.cssText = `
            position:fixed;
            top:10px;
            left:10px;
            z-index:9999999;
            background:#ff4d4f;
            color:#fff;
            font-size:14px;
            padding:6px 10px;
            border:none;
            border-radius:4px;
            cursor:pointer;
        `;
        crackBtn.onclick = () => {
            if (location.href.includes('/play/')) {
                location.href = location.href.replace('/play/', '/player/');
            } else {
                alert('当前页面不是金币页，无法跳转！');
            }
        };

        // ⭐ HVP按钮
        const hvpBtn = document.createElement('button');
        hvpBtn.textContent = 'HVP';
        hvpBtn.style.cssText = `
            position:fixed;
            top:50px;
            left:10px;
            z-index:9999999;
            background:#1677ff;
            color:#fff;
            font-size:14px;
            padding:6px 14px;
            border:none;
            border-radius:4px;
            cursor:pointer;
        `;
        hvpBtn.onclick = () => {
            if (!lastM3U8) {
                alert('尚未捕获到 m3u8 链接');
                return;
            }
            if (typeof fy_bridge_app?.playVideo === 'function') {
                fy_bridge_app.playVideo(lastM3U8);
            } else {
                alert('fy_bridge_app.playVideo 不存在');
            }
        };

        document.documentElement.append(crackBtn, hvpBtn);
    }

    addButtons();

})();

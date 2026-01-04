// ==UserScript==
// @name         🎃 YouTube 下载按钮（直链 y2mate / yt-dlp 友好）
// @namespace    https://github.com/ddgksf2013
// @version      2025.12.4
// @description  在 YouTube 视频页面添加下载按钮（支持 y2mate、prounlimited、ddownload 等多个后端，可自行修改）
// @author       现代重构版
// @match        *://*.youtube.com/watch*
// @match        *://*.youtube.com/shorts/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557971/%F0%9F%8E%83%20YouTube%20%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%EF%BC%88%E7%9B%B4%E9%93%BE%20y2mate%20%20yt-dlp%20%E5%8F%8B%E5%A5%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557971/%F0%9F%8E%83%20YouTube%20%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%EF%BC%88%E7%9B%B4%E9%93%BE%20y2mate%20%20yt-dlp%20%E5%8F%8B%E5%A5%BD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======== 可自行修改的下载站点（任选其一或增加更多）========
    const DOWNLOAD_SITES = [
        // { name: "y2mate", url: id => `https://y2mate.com.cn/zh/youtube/${id}` },
        // { name: "y2mate（新版）", url: id => `https://yt5s.io/youtube/${id}` },
        { name: "prounlimited", url: id => `https://prounlimited.me/zh/youtube-downloader/${id}` },       // 目前最快最稳
        { name: "ddownload",   url: id => `https://ddownload.me/video/${id}` },
        { name: "cobalt",      url: id => `https://cobalt.tools/?v=${id}` }, // 需要自行部署或用公开实例
    ];
    // ===================================================

    const BUTTON_TEXT = "⚡ 下载 MP4/MP3";

    function getVideoId() {
        const url = new URL(location.href);
        return url.searchParams.get('v') || location.pathname.split('/').pop();
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = BUTTON_TEXT;
        btn.style.cssText = `
            background: #ff0000 !important;
            color: #fff !important;
            border: none !important;
            padding: 8px 16px !important;
            margin: 0 8px 8px 0 !important;
            border-radius: 18px !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            cursor: pointer !important;
            box-shadow: 0 1px 6px rgba(0,0,0,0.25) !important;
            transition: all 0.2s !important;
        `;
        btn.onmouseover = () => btn.style.opacity = '0.85';
        btn.onmouseout  = () => btn.style.opacity = '1';

        // 点击后弹出小菜单，支持多个站点
        btn.onclick = () => {
            const vid = getVideoId();
            if (!vid) return;

            if (DOWNLOAD_SITES.length === 1) {
                open(DOWNLOAD_SITES[0].url(vid), '_blank');
                return;
            }

            // 多站点时弹出简易菜单
            alert(`请选择下载站点（视频 ID: ${vid}）:\n\n` +
                DOWNLOAD_SITES.map((s, i) => `${i+1}. ${s.name}\n→ ${s.url(vid)}`).join('\n') +
                '\n\n手动复制链接后打开即可');
        };

        return btn;
    }

    function insertButton() {
        const vid = getVideoId();
        if (!vid) return;

        // 方式1：放在视频标题下方（最显眼）
        const titleContainer = document.querySelector('ytd-watch-metadata #title') ||
                              document.querySelector('h1.ytd-watch-metadata');
        if (titleContainer && !document.getElementById('my-ytdownload-btn')) {
            const container = document.createElement('div');
            container.id = 'my-ytdownload-container';
            container.style.marginTop = '8px';
            container.appendChild(createButton());
            titleContainer.parentNode.appendChild(container);
            return;
        }

        // 方式2：放在订阅按钮旁边（新版 YouTube 常用位置）
        const subscribeButton = document.querySelector('ytd-subscribe-button-renderer');
        if (subscribeButton && !document.getElementById('my-ytdownload-btn')) {
            const btn = createButton();
            btn.id = 'my-ytdownload-btn';
            subscribeButton.parentNode.insertBefore(btn, subscribeButton.nextSibling);
        }
    }

    // 监听 YouTube SPA 路由变化（新版 YouTube 是单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(insertButton, 1500);
        }
    }).observe(document, { subtree: true, childList: true });

    // 初始加载
    setTimeout(insertButton, 2000);
    insertButton();
})();
// ==UserScript==
// @name         TikTok Video Downloader
// @namespace    http://tampermonkey.net/
// @version      2.5.5
// @description  Download TikTok videos without watermark - adds download button next to Share
// @author       01 dev
// @license      MIT
// @match        *://*.tiktok.com/*
// @icon         https://www.tiktok.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setClipboard
// @connect      v0-tik-tok-downloader-design.vercel.app
// @connect      tiktokcdn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560130/TikTok%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560130/TikTok%20Video%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // API Endpoint
    const API_URL = 'https://v0-tik-tok-downloader-design.vercel.app/api/download?url=';
    const DISCORD_URL = 'https://discord.gg/YTeRSG8kER';

    // Inject Styles
    GM_addStyle(`

        :root {
            --ttd-primary: #fe2c55;
            --ttd-primary-hover: #ef2950;
            --ttd-cyan: #25f4ee;
            --ttd-glass-bg: rgba(22, 24, 35, 0.75);
            --ttd-glass-border: rgba(255, 255, 255, 0.08);
            --ttd-text-primary: #ffffff;
            --ttd-text-secondary: rgba(255, 255, 255, 0.9);
            --ttd-shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.25);
            --ttd-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);
            --ttd-font: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            --ttd-radius: 12px;
        }

        /* Wrapper */
        .ttd-download-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;
            margin-left: 0;
            position: relative;
            z-index: 999;
            font-family: var(--ttd-font);
        }

        .ttd-horizontal .ttd-download-wrapper {
            margin-top: 0;
            margin-left: 8px;
        }

        /* Main Button */
        .ttd-download-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            color: white;
            position: relative;
            overflow: hidden;
        }

        .ttd-download-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--ttd-primary), var(--ttd-cyan));
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 0;
        }

        .ttd-download-btn:hover {
            transform: translateY(-2px) scale(1.05);
            border-color: transparent;
            box-shadow: 0 0 20px rgba(254, 44, 85, 0.4);
        }

        .ttd-download-btn:hover::before {
            opacity: 1;
        }

        .ttd-download-btn svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
            z-index: 1;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .ttd-download-btn:hover svg {
            transform: rotate(-10deg) scale(1.1);
        }

        .ttd-download-btn.loading svg {
            animation: ttd-spin 0.8s linear infinite;
        }

        /* Hover Menu */
        .ttd-menu {
            position: absolute;
            bottom: calc(100% + 16px);
            left: 50%;
            transform: translateX(-50%) translateY(10px) scale(0.95);
            background: var(--ttd-glass-bg);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            border-radius: var(--ttd-radius);
            box-shadow: var(--ttd-shadow-lg);
            padding: 8px;
            width: 180px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: none;
            border: 1px solid var(--ttd-glass-border);
            display: flex;
            flex-direction: column;
            gap: 4px;
            transform-origin: bottom center;
        }

        .ttd-menu::before {
            content: '';
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            height: 20px;
        }

        .ttd-download-wrapper:hover .ttd-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0) scale(1);
            pointer-events: auto;
        }

        @keyframes ttd-slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .ttd-menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            color: var(--ttd-text-secondary);
            border-radius: 8px;
            transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            text-decoration: none;
            position: relative;
            overflow: hidden;
            animation: ttd-slideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }

        .ttd-menu-item:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--ttd-text-primary);
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .ttd-menu-item:active {
            transform: scale(0.98) translateX(4px);
        }

        .ttd-menu-item svg {
            width: 18px;
            height: 18px;
            stroke: currentColor;
            stroke-width: 2;
            fill: none;
            opacity: 0.9;
        }
        
        .ttd-menu-item.discord {
            color: #5865F2;
            background: rgba(88, 101, 242, 0.08);
            margin-top: 6px;
        }
        
        .ttd-menu-item.discord:hover {
            background: #5865F2;
            color: white;
            box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);
        }

        .ttd-divider {
            height: 1px;
            background: rgba(255,255,255,0.08);
            margin: 6px 8px;
        }

        @keyframes ttd-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Diamond Loader (Transparent) */
        .ttd-loader {
            position: relative;
            width: 24px;
            height: 24px;
            transform: rotate(45deg);
            z-index: 5;
            /* Create frame shape */
            clip-path: polygon(
                0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                3px 3px, 3px calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 3px, 3px 3px
            );
            background: rgba(255, 255, 255, 0.1); /* Subtle track */
        }
        
        .ttd-loader:before {
            content: '';
            position: absolute;
            inset: -10px;
            background: var(--ttd-primary);
            animation: ttd-diamondLoader 1.5s linear infinite;
            box-shadow: 0 0 10px 2px var(--ttd-primary);
            width: 50px; 
            height: 50px;
        }
        
        @keyframes ttd-diamondLoader {
            0% { transform: translate(-20px, -20px) rotate(0deg); }
            100% { transform: translate(10px, 10px) rotate(0deg); }
        }
        
        .ttd-pulse {
            animation: ttd-pulse 2s infinite;
        }
        
        @keyframes ttd-pulse {
             0% { box-shadow: 0 0 0 0 rgba(254, 44, 85, 0.4); }
             70% { box-shadow: 0 0 0 15px rgba(254, 44, 85, 0); }
             100% { box-shadow: 0 0 0 0 rgba(254, 44, 85, 0); }
        }

        /* Toast */
        .ttd-toast {
            position: fixed;
            top: 32px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: rgba(22, 24, 35, 0.85);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            font-family: var(--ttd-font);
            z-index: 10000;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.08);
            opacity: 0;
            pointer-events: none;
        }

        .ttd-toast.visible {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .ttd-toast svg { width: 20px; height: 20px; }
        .ttd-toast.success svg { fill: #00e676; }
        .ttd-toast.error svg { fill: #ff1744; }
        .ttd-toast.info svg { fill: #2979ff; }

    `);

    // Intro Animation Styles
    GM_addStyle(`
        .ttd-intro-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 100001; /* Above toast */
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ttd-intro-overlay.visible {
            opacity: 1;
            visibility: visible;
        }
        .ttd-intro-content {
            background: rgba(22, 24, 35, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 48px;
            border-radius: 32px;
            text-align: center;
            transform: scale(0.9) translateY(20px);
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 400px;
            width: 90%;
            box-shadow: 
                0 20px 60px -10px rgba(0,0,0,0.8),
                0 0 0 1px rgba(255,255,255,0.05),
                0 0 40px rgba(254, 44, 85, 0.15); /* Subtle glow */
            position: relative;
            overflow: hidden;
        }
        
        /* Decorative background elements */
        .ttd-intro-content::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }
        
        .ttd-intro-content > * {
            position: relative;
            z-index: 1;
        }

        .ttd-intro-content::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 4px;
            background: linear-gradient(90deg, var(--ttd-primary), var(--ttd-cyan));
            box-shadow: 0 0 20px rgba(254, 44, 85, 0.5);
        }
        .ttd-intro-overlay.visible .ttd-intro-content {
            transform: scale(1) translateY(0);
        }
        .ttd-intro-title {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
            color: #fff;
            letter-spacing: -0.5px;
            background: linear-gradient(to right bottom, #ffffff 40%, #a8a8a8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .ttd-intro-subtitle {
            color: rgba(255, 255, 255, 0.65);
            margin-bottom: 32px;
            font-size: 16px;
            line-height: 1.5;
            font-weight: 500;
        }
        
        .ttd-intro-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .ttd-intro-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            padding: 16px;
            border-radius: 16px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            cursor: pointer;
            border: none;
            font-family: var(--ttd-font);
            font-size: 16px;
            outline: none;
        }
        
        .ttd-btn-primary {
            background: #5865F2;
            color: white;
            box-shadow: 0 4px 0 rgba(45, 53, 137, 0.5), 0 8px 24px rgba(88, 101, 242, 0.3);
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
        }
        .ttd-btn-primary::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .ttd-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 0 rgba(45, 53, 137, 0.5), 0 12px 32px rgba(88, 101, 242, 0.5);
        }
        .ttd-btn-primary:hover::after {
            opacity: 1;
        }
        .ttd-btn-primary:active {
            transform: translateY(2px);
            box-shadow: 0 2px 0 rgba(45, 53, 137, 0.5), 0 4px 12px rgba(88, 101, 242, 0.3);
        }

        .ttd-btn-secondary {
            background: transparent;
            color: rgba(255,255,255,0.5);
            border: 1px solid transparent;
            padding: 12px;
            font-size: 14px;
        }
        .ttd-btn-secondary:hover {
            color: white;
            background: rgba(255,255,255,0.05);
        }
        
        .ttd-intro-btn svg { width: 24px; height: 24px; }
    `);

    // Icons
    // Icons (Feather Style)
    const ICONS = {
        download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
        copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
        discord: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
        loading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    };

    // --- Helpers ---
    function getPageType() {
        const path = window.location.pathname;
        if (path === '/' || path.startsWith('/foryou')) return 'FORYOU';
        if (path.startsWith('/video/') || (path.includes('/video/') && path.startsWith('/@'))) return 'VIDEO';
        if (path.startsWith('/explore')) return 'EXPLORE';
        if (path.startsWith('/@')) return 'USER';
        return 'UNKNOWN';
    }

    function showToast(msg, type = 'info') {
        const t = document.createElement('div');
        t.className = `ttd-toast ${type}`;
        t.innerHTML = `${type === 'error' ? ICONS.error : (type === 'success' ? ICONS.check : ICONS.loading)}<span>${msg}</span>`;
        document.body.appendChild(t);

        // Trigger reflow
        t.offsetHeight;

        setTimeout(() => t.classList.add('visible'), 10);
        setTimeout(() => {
            t.classList.remove('visible');
            setTimeout(() => t.remove(), 400);
        }, 3000);
    }

    // --- Detection ---
    function findContainer(el) {
        return el.closest('[data-e2e="recommend-list-item-container"]') ||
            el.closest('[data-e2e="feed-video"]') ||
            el.closest('div[class*="DivItemContainer"]') ||
            el.closest('div[class*="DivContentContainer"]') ||
            el.closest('div[role="article"]');
    }

    function findVideoId(el) {
        if (getPageType() === 'VIDEO') {
            const match = window.location.pathname.match(/video\/(\d+)/);
            if (match) return match[1];
        }

        // Search inside self first
        let link = el.tagName === 'A' ? el : el.querySelector('a[href*="/video/"]');
        if (link) {
            const match = link.href.match(/video\/(\d+)/);
            if (match) return match[1];
        }

        // Search in common container (handling siblings)
        const container = findContainer(el);
        if (container) {
            // 1. Check for link in container
            link = container.querySelector('a[href*="/video/"]');
            if (link) {
                const match = link.href.match(/video\/(\d+)/);
                if (match) return match[1];
            }
            // 2. Check for xgwrapper in container
            const xg = container.querySelector('[id*="xgwrapper"]');
            if (xg) {
                const parts = xg.id.split('-');
                const vid = parts[parts.length - 1];
                if (/^\d+$/.test(vid)) return vid;
            }
        }

        // Last resort: parent traversal for xgwrapper
        let parent = el.closest('[id*="xgwrapper"]');
        if (parent) {
            const parts = parent.id.split('-');
            const vid = parts[parts.length - 1];
            if (/^\d+$/.test(vid)) return vid;
        }

        return null;
    }

    function findAuthor(el) {
        if (getPageType() === 'VIDEO') {
            const match = window.location.pathname.match(/@([\w\.]+)/);
            if (match) return match[1];
        }

        // Search container first (most reliable for feed)
        const container = findContainer(el);
        if (container) {
            // Data attribute
            const authorEl = container.querySelector('[data-e2e="video-author-uniqueid"]');
            if (authorEl) return authorEl.textContent.trim();

            // Link scan
            const link = container.querySelector('a[href^="/@"]');
            if (link) {
                const match = link.href.match(/@([\w\.]+)/);
                if (match) return match[1];
            }
        }

        // Fallback: search parents
        const link = el.closest('a[href^="/@"]');
        if (link) {
            const match = link.href.match(/@([\w\.]+)/);
            if (match) return match[1];
        }

        return null;
    }

    function constructUrl(el) {
        const vid = findVideoId(el);
        const author = findAuthor(el);

        if (vid && author) {
            return `https://www.tiktok.com/@${author}/video/${vid}`;
        }

        // Fallback: try finding any clean video link in container
        const container = findContainer(el);
        if (container) {
            const link = container.querySelector('a[href*="/video/"]');
            if (link) return link.href;
        }

        if (window.location.href.includes('/video/')) return window.location.href;
        return null;
    }

    // --- Core Logic ---
    async function processDownload(type, el, btn) {
        if (type === 'discord') {
            window.open(DISCORD_URL, '_blank');
            return;
        }

        const url = constructUrl(el);
        const author = findAuthor(el) || 'Unknown';
        const vid = findVideoId(el) || Date.now();

        if (!url) {
            showToast('Could not find video URL', 'error');
            return;
        }

        if (type === 'copy') {
            GM_setClipboard(url);
            showToast('Link copied to clipboard!', 'success');
            return;
        }

        btn.classList.add('loading');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span class="ttd-loader"></span>';

        try {
            const res = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: API_URL + encodeURIComponent(url),
                    onload: (r) => {
                        if (r.status === 200) resolve(JSON.parse(r.responseText));
                        else reject(new Error('API Error'));
                    },
                    onerror: reject
                });
            });

            if (res && res.data) {
                let targetUrl;
                let ext = 'mp4';
                let suffix = '';

                targetUrl = res.data.play || res.data.download_url;


                if (targetUrl) {
                    const safeAuthor = author.replace(/[<>:"/\\|?*]/g, '_');
                    const filename = `01 dev/TikTok - @${safeAuthor} - ${vid}${suffix}.${ext}`;

                    // Use GM_download if available
                    if (typeof GM_download !== 'undefined') {
                        showToast(`Downloading ${type}...`, 'info');
                        GM_download({
                            url: targetUrl,
                            name: filename,
                            onload: () => showToast('Download finished!', 'success'),
                            onerror: (e) => {
                                console.error(e);
                                window.open(targetUrl, '_blank'); // Fallback
                                showToast('Download started in tab', 'success');
                            }
                        });
                    } else {
                        window.open(targetUrl, '_blank');
                        showToast('Opened in new tab', 'success');
                    }
                } else {
                    showToast('Media not found', 'error');
                }
            } else {
                showToast('Failed to fetch info', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Error downloading', 'error');
        } finally {
            btn.classList.remove('loading');
            btn.innerHTML = ICONS.download;
        }
    }

    // --- UI Creation ---
    function createButton(container) {
        const wrapper = document.createElement('div');
        wrapper.className = 'ttd-download-wrapper';
        if (container.classList.contains('ttd-horizontal-ctx')) {
            wrapper.classList.add('ttd-horizontal');
        }

        const btn = document.createElement('button');
        btn.className = 'ttd-download-btn ttd-pulse';
        btn.innerHTML = ICONS.download;
        btn.title = 'Download Video';

        const menu = document.createElement('div');
        menu.className = 'ttd-menu';

        const opts = [
            { id: 'video', icon: ICONS.video, text: 'Video' },
            { id: 'divider' },
            { id: 'copy', icon: ICONS.copy, text: 'Copy Link' },
            { id: 'discord', icon: ICONS.discord, text: 'Join Discord', className: 'discord' }
        ];

        opts.forEach((opt, index) => {
            if (opt.id === 'divider') {
                const div = document.createElement('div');
                div.className = 'ttd-divider';
                menu.appendChild(div);
                return;
            }
            const item = document.createElement('div');
            item.className = 'ttd-menu-item' + (opt.className ? ' ' + opt.className : '');
            item.innerHTML = `${opt.icon}<span>${opt.text}</span>`;
            item.style.animationDelay = `${index * 0.05}s`;
            item.onclick = (e) => {
                e.stopPropagation();
                processDownload(opt.id, container, btn);
            };
            menu.appendChild(item);
        });

        btn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            processDownload('video', container, btn);
        };

        wrapper.appendChild(btn);
        wrapper.appendChild(menu);

        wrapper.addEventListener('mouseenter', () => btn.classList.remove('ttd-pulse'));

        return wrapper;
    }

    function addButtons() {
        const selectors = [
            '[data-e2e="share-icon"]',
            '[data-e2e="video-share-btn"]',
            '.share-action',
            'button[aria-label="Share"]'
        ];

        document.querySelectorAll(selectors.join(',')).forEach(shareEl => {
            const actionBar = shareEl.closest('[class*="DivActionItemContainer"]') ||
                shareEl.closest('.DivActionItemContainer') ||
                shareEl.parentElement;

            if (!actionBar) return;
            // Avoid adding if we simply haven't loaded specific classes yet but it might confuse layout
            if (actionBar.querySelector('.ttd-download-wrapper')) return;

            // Check layout direction
            const style = window.getComputedStyle(actionBar);
            if (style.flexDirection === 'row') {
                actionBar.classList.add('ttd-horizontal-ctx');
            }

            const btn = createButton(actionBar);

            const shareWrapper = shareEl.closest('button') || shareEl;
            if (shareWrapper && shareWrapper.parentElement === actionBar) {
                actionBar.insertBefore(btn, shareWrapper.nextSibling);
            } else {
                actionBar.appendChild(btn);
            }
        });
    }

    // --- Init ---
    const obs = new MutationObserver((mutations) => {
        let added = false;
        for (const m of mutations) if (m.addedNodes.length) added = true;
        if (added) addButtons();
    });

    obs.observe(document.body, { childList: true, subtree: true });
    setInterval(addButtons, 1500);
    addButtons();

    // --- Intro ---
    function showIntro() {
        if (sessionStorage.getItem('ttd-intro-shown')) return;
        sessionStorage.setItem('ttd-intro-shown', 'true');

        const overlay = document.createElement('div');
        overlay.className = 'ttd-intro-overlay';
        overlay.innerHTML = `
            <div class="ttd-intro-content">
                <div class="ttd-intro-title">TikTok Downloader v2.5.5</div>
                <div class="ttd-intro-subtitle">Download videos without watermarks using our advanced tools.</div>
                <div class="ttd-intro-actions">
                    <a href="${DISCORD_URL}" target="_blank" class="ttd-intro-btn ttd-btn-primary">
                        ${ICONS.discord} Join Discord
                    </a>
                    <button class="ttd-intro-btn ttd-btn-secondary">No thanks</button>
                </div>
            </div>
        `;

        const close = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 500);
        };

        const joinBtn = overlay.querySelector('.ttd-btn-primary');
        const continueBtn = overlay.querySelector('.ttd-btn-secondary');

        joinBtn.onclick = () => {
            setTimeout(close, 1000);
        };
        continueBtn.onclick = close;

        document.body.appendChild(overlay);
        // Force reflow
        overlay.offsetHeight;
        setTimeout(() => overlay.classList.add('visible'), 100);
    }

    // Show intro after a slight delay to ensure page load
    setTimeout(showIntro, 500);

    // Shortcuts (Alt+D)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.code === 'KeyD') {
            e.preventDefault();
            // Find most visible video
            const buttons = Array.from(document.querySelectorAll('.ttd-download-btn'));
            const visible = buttons.find(b => {
                const rect = b.getBoundingClientRect();
                return rect.top > 0 && rect.top < window.innerHeight;
            });
            if (visible) visible.click();
        }
    });

    console.log('🎵 TikTok Downloader v2.5.5 Loaded');
})();

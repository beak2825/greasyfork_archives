// ==UserScript==
// @name         艾薇社区破解
// @namespace    aiwei_artplayer
// @version      5.0
// @description  基于v4.3内核。修复视频高度不匹配/黑屏问题（使用CSS强制16:9比例+object-fit:contain）。兼容Stay/iOS。
// @author       karteous
// @match        https://bav53.cc/*
// @match        https://avjb.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558985/%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/558985/%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BA%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🎨 CSS 样式：使用最稳健的 Padding-Hack 方案锁定高度
    GM_addStyle(`
        /* 1. 容器：强制 16:9 比例，不依赖父级高度 */
        .player-holder {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: 0 !important;
            padding-bottom: 56.25% !important; /* 核心：9 / 16 = 0.5625 */
            background: #000 !important;
            overflow: hidden !important;
            z-index: 1 !important;
            
            /* 清除干扰 */
            transform: none !important;
            margin: 0 !important;
            border: none !important;
        }
        
        /* 2. Artplayer：绝对定位填满容器 */
        .artplayer-app {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 10 !important;
        }

        /* 3. 视频标签：强制包含模式，防止画面被裁剪或拉伸偏移 */
        video.art-video {
            object-fit: contain !important;
            width: 100% !important;
            height: 100% !important;
        }
        
        /* 隐藏干扰元素 */
        .video-overlay, .premium-overlay, .vip-layer, pjsdiv {
            display: none !important;
        }
    `);

    // 📦 动态加载外部库
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 🛠️ 获取视频链接
    function getVideoUrl(container) {
        const existingVideo = container.querySelector('video');
        if (existingVideo && existingVideo.src && (existingVideo.src.includes('.m3u8') || existingVideo.src.includes('.mp4'))) {
            return existingVideo.src;
        }
        const imgSelectors = ['img', '.video-player img', 'img[src*="screenshot"]', 'img[src*="videos"]'];
        let imgUrl = null;
        const innerImg = container.querySelector('img');
        if (innerImg) { imgUrl = innerImg.src; } 
        else {
            for (let selector of imgSelectors) {
                const img = document.querySelector(selector);
                if (img && img.src && (img.src.includes('videos') || img.src.includes('screenshot'))) {
                    imgUrl = img.src; break;
                }
            }
        }
        if (!imgUrl) return null;
        const tmp = imgUrl.split('/');
        let folderId, videoId;
        if (imgUrl.includes('videos_screenshots')) {
            const idx = tmp.indexOf('videos_screenshots');
            if (idx !== -1 && tmp.length > idx + 2) { folderId = tmp[idx + 1]; videoId = tmp[idx + 2]; }
        } else if (imgUrl.includes('/videos/')) {
            const idx = tmp.indexOf('videos');
            if (idx !== -1 && tmp.length > idx + 2) { folderId = tmp[idx + 1]; videoId = tmp[idx + 2]; }
        }
        if (!folderId || !videoId) return null;

        let baseURL = 'https://99newline.jb-aiwei.cc';
        const videoIdNum = parseInt(videoId);
        if (videoIdNum >= 92803) baseURL = 'https://88newline.jb-aiwei.cc';
        return `${baseURL}/videos/${folderId}/${videoId}/index.m3u8`;
    }

    // ⚠️ 降级模式
    function fallbackToNativePlayer(streamUrl, container) {
        console.log('[破解器] 启动降级模式');
        container.innerHTML = '';
        const video = document.createElement('video');
        video.src = streamUrl;
        video.controls = true;
        // 确保降级模式下也是包含显示
        video.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; background:#000;';
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        container.appendChild(video);
    }

    // ▶️ 初始化 Artplayer
    function initArtplayer(streamUrl, container) {
        container.removeAttribute('style');
        container.innerHTML = '';
        
        const artDiv = document.createElement('div');
        artDiv.className = 'artplayer-app';
        container.appendChild(artDiv);

        const art = new window.Artplayer({
            container: artDiv,
            url: streamUrl,
            type: 'm3u8',
            volume: 1.0,
            isLive: false,
            muted: false,
            autoplay: false,
            
            // 🚫 禁止 Artplayer 自己计算尺寸，完全交由 CSS 控制
            autoSize: false, 
            autoMini: true,
            
            pip: true,
            setting: true,
            loop: true,
            flip: true,
            playbackRate: true,
            aspectRatio: true,
            fullscreen: true,
            fullscreenWeb: true,
            miniProgressBar: true,
            mutex: true,
            playsInline: true,
            theme: '#ff0055',
            lang: 'zh-cn',
            
            moreVideoAttr: {
                'playsinline': 'true',
                'webkit-playsinline': 'true',
                'x5-video-player-type': 'h5',
                // 给内部 video 加上 class 方便 CSS 控制 object-fit
                'class': 'art-video' 
            },
            
            customType: {
                m3u8: function (video, url) {
                    if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                    } else if (window.Hls && window.Hls.isSupported()) {
                        const hls = new window.Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                    } else {
                        art.notice.show = '不支持播放';
                    }
                },
            },
        });

        art.on('error', () => {
            fallbackToNativePlayer(streamUrl, container);
        });
        
        // 确保 UI 就位后再次调整尺寸（双重保险）
        art.on('ready', () => {
            art.resize();
        });
    }

    // 🚀 主流程
    async function main() {
        const container = document.querySelector('.player-holder');
        if (!container) return;

        const streamUrl = getVideoUrl(container);
        if (!streamUrl) return;

        // 占位
        container.removeAttribute('style');
        container.innerHTML = '<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;color:#fff;">⌛️ 加载中...</div>';

        const isIOS = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;

        try {
            if (!window.Artplayer) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/artplayer/5.0.9/artplayer.js');
            if (!isIOS && !window.Hls) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.12/hls.min.js');
            
            initArtplayer(streamUrl, container);
        } catch (e) {
            console.error(e);
            fallbackToNativePlayer(streamUrl, container);
        }
    }

    setTimeout(main, 800);

})();
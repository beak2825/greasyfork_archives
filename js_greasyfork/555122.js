// ==UserScript==
// @name          宗师完全体·全站终极解锁脚本
// @namespace     http://tampermonkey.net/
// @version       v3.3
// @description   PC端Artplayer + 手机端原生Video。返回按钮纯白透明去底。
// @author        karteous (Modified by Gemini)
// @match         https://d1ibyof3mbdf0n.cloudfront.net/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/artplayer/5.1.0/artplayer.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.2/hls.min.js
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         unsafeWindow
// @run-at        document-start
// @icon          https://d1ibyof3mbdf0n.cloudfront.net/logo.png
// @downloadURL https://update.greasyfork.org/scripts/555122/%E5%AE%97%E5%B8%88%E5%AE%8C%E5%85%A8%E4%BD%93%C2%B7%E5%85%A8%E7%AB%99%E7%BB%88%E6%9E%81%E8%A7%A3%E9%94%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555122/%E5%AE%97%E5%B8%88%E5%AE%8C%E5%85%A8%E4%BD%93%C2%B7%E5%85%A8%E7%AB%99%E7%BB%88%E6%9E%81%E8%A7%A3%E9%94%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const LOG_PREFIX = "【宗师完全体·v3.3】";
    console.log(`${LOG_PREFIX} 启动...`);

    const TOKEN_LOCAL_STORAGE_KEY = 'token';
    const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
    
    const CUSTOM_PLAYER_ID = 'gemini-embedded-player-container'; 
    const BACK_BUTTON_ID = 'gemini-float-back-btn'; 
    
    let isPlayerActive = false;
    let currentSourceUrl = null;
    let artInstance = null; 

    // ==========================================
    // 1. 兼容性存储
    // ==========================================
    const HASH_CACHE_KEY = 'vue_hashes_cache_v56';
    const LOCAL_STORAGE_FALLBACK_KEY = 'gemini_vue_hashes_fallback';
    const FALLBACK_PLAYER_SELECTOR = 'div.player'; 

    function safeSetValue(key, value) {
        try {
            if (typeof GM_setValue === 'function') { GM_setValue(key, value); } 
            else { localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(value)); }
        } catch (e) { /* silent fail */ }
    }

    function safeGetValue(key, defaultValue) {
        try {
            if (typeof GM_getValue === 'function') { return GM_getValue(key, defaultValue); } 
            else { 
                const stored = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
                return stored ? JSON.parse(stored) : defaultValue;
            }
        } catch (e) { return defaultValue; }
    }

    let vueHashes = safeGetValue(HASH_CACHE_KEY, {
        player: FALLBACK_PLAYER_SELECTOR,
        videoImg: 'li.video_img[data-v-]'
    });

    // ==========================================
    // 2. 样式注入 (核心修改区域)
    // ==========================================
    GM_addStyle(`
        /* 隐藏原生播放器 */
        div.player > video, 
        li.video_img > video, 
        .xgplayer-controls, .xgplayer-start, .xgplayer-enter {
            visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; display: none !important;
        }
        
        /* 隐藏顶部导航 */
        .head, .van-nav-bar.van-safe-area-top.back-nav.top-back {
            display: none !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
        }
        
        /* 播放器容器 */
        #${CUSTOM_PLAYER_ID} {
            position: relative !important; 
            width: 100% !important;
            aspect-ratio: 16 / 9; 
            background: #000;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            z-index: 999;
        }

        /* 手机端原生 Video 样式 */
        #${CUSTOM_PLAYER_ID} video.native-mobile-video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }

        /* PC端 Artplayer 容器 */
        .artplayer-app {
            width: 100%; height: 100%; display: block;
        }
        
        /* ================================== */
        /* ⭐ v3.3 返回按钮样式修改 (纯白无底) */
        /* ================================== */
        #${BACK_BUTTON_ID} {
            position: absolute;
            top: 10px; 
            left: 10px;
            width: 44px; /* 保持大点击区域 */
            height: 44px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            z-index: 10000 !important; 
            
            /* 去掉背景 */
            background: transparent !important; 
            border: none !important;
            outline: none !important;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent; /* 去除手机点击高亮 */
        }
        
        /* 图标样式：加重阴影，确保在任何背景下可见 */
        #${BACK_BUTTON_ID} svg {
            width: 28px; 
            height: 28px; 
            /* 投影：水平偏移0，垂直偏移1px，模糊3px，黑色0.8透明度 */
            filter: drop-shadow(0 1px 3px rgba(0,0,0,0.9));
            transition: transform 0.2s ease;
        }
        
        /* 点击时的微动效 */
        #${BACK_BUTTON_ID}:active svg {
            transform: scale(0.9);
            opacity: 0.8;
        }

        /* 去广 */
        .vue-nice-modal-root, div.preview-ui, div.skip-preview-btn,
        div.mine-ad, div.openvip, div.van-popup, div.van-overlay,
        div.function-grid, div.layout-notice-swiper, div.promotion-expire
        { display: none !important; }
        
        .video-info.mt-335 { margin-top: 0 !important; }
    `);

    // ==========================================
    // 3. m3u8 拦截
    // ==========================================
    function cleanUrl(url) {
        if (!url) return url;
        return url.replace(/_(\d+|[0-9]+p[0-9]*)\.m3u8/g, '.m3u8');
    }

    function broadcastUrl(cleanUrl) {
        if (unsafeWindow.__GEMINI_CLEAN_URL__ !== cleanUrl) {
            console.log(`%c${LOG_PREFIX} 捕获: ${cleanUrl}`, 'color:#0f0;');
            unsafeWindow.__GEMINI_CLEAN_URL__ = cleanUrl;
        }
    }

    const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && url.includes('.m3u8')) broadcastUrl(cleanUrl(url));
        return originalXhrOpen.apply(this, arguments);
    };

    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(...args) {
        const url = (typeof args[0] === 'string') ? args[0] : (args[0] && args[0].url);
        if (url && url.includes('.m3u8')) broadcastUrl(cleanUrl(url));
        return originalFetch.apply(this, args);
    };

    // ==========================================
    // 4. 播放器逻辑
    // ==========================================
    function updateHash(el, type) {
        const hash = Array.from(el.attributes).find(a => a.name.startsWith('data-v-'));
        if (hash) {
            const newVal = type === 'player' ? `div.player[${hash.name}]` : `li.video_img[${hash.name}]`;
            if (vueHashes[type] !== newVal) {
                vueHashes[type] = newVal;
                safeSetValue(HASH_CACHE_KEY, vueHashes);
            }
        }
    }
    
    function cleanupPlayer() {
        if (artInstance && artInstance.destroy) artInstance.destroy(false);
        artInstance = null;

        const playerDiv = document.getElementById(CUSTOM_PLAYER_ID);
        if (playerDiv) {
            playerDiv.remove(); 
            isPlayerActive = false;
            const container = document.querySelector(vueHashes.player) || document.querySelector(FALLBACK_PLAYER_SELECTOR);
            if (container) container.style.setProperty('display', '', 'important');
        }
        currentSourceUrl = null;
        unsafeWindow.__GEMINI_CLEAN_URL__ = null;
        communityUrl = null;
    }

    function buildFinalUrl(rawUrl) {
        if (!rawUrl) return null;
        let finalUrl = rawUrl;
        if (!finalUrl.startsWith('http')) {
             finalUrl = `https://d1ibyof3mbdf0n.cloudfront.net${finalUrl.startsWith('/') ? '' : '/api/app/media/h5/m3u8/'}${finalUrl}`;
        }
        if (!finalUrl.includes('token=') && token) {
            finalUrl += (finalUrl.includes('?') ? '&' : '?') + `token=${token}`;
        }
        return finalUrl;
    }

    function mountHlsPlayer(container, rawUrl, isLive) {
        if (!rawUrl) return;
        const finalUrl = buildFinalUrl(rawUrl);
        if (!finalUrl) return;
        if (currentSourceUrl === finalUrl && isPlayerActive) return;

        let playerDiv = document.getElementById(CUSTOM_PLAYER_ID);
        if (!playerDiv) {
            playerDiv = document.createElement('div');
            playerDiv.id = CUSTOM_PLAYER_ID;
        }

        let anchorFound = false;
        const videoInfoDiv = document.querySelector('.video-info');
        if (videoInfoDiv) {
            if (videoInfoDiv.classList.contains('mt-335')) {
                videoInfoDiv.classList.remove('mt-335');
                videoInfoDiv.classList.add('mt-0');
            }
            videoInfoDiv.style.marginTop = '0px';
            if (videoInfoDiv.parentNode) {
                videoInfoDiv.parentNode.insertBefore(playerDiv, videoInfoDiv);
                anchorFound = true;
                if (container) container.style.display = 'none';
            }
        }
        if (!anchorFound && container) {
             container.innerHTML = ''; 
             container.appendChild(playerDiv);
             container.style.setProperty('display', 'block', 'important');
        } else if (!anchorFound) {
            document.body.prepend(playerDiv);
        }

        isPlayerActive = true; 
        currentSourceUrl = finalUrl;

        if (artInstance) artInstance.destroy(false);
        playerDiv.innerHTML = '';

        // --- 返回按钮 (SVG 白色填充) ---
        const backButton = document.createElement('button');
        backButton.id = BACK_BUTTON_ID;
        // 注意这里的 fill="#ffffff"
        backButton.innerHTML = `<svg viewBox="0 0 1024 1024" fill="#ffffff"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9 0.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"/></svg>`;
        backButton.onclick = (e) => { e.preventDefault(); e.stopPropagation(); cleanupPlayer(); window.history.back(); };
        playerDiv.appendChild(backButton);

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            // 📱 手机端：原生 Video
            console.log(`${LOG_PREFIX} Mobile模式：原生Video`);
            const nativeVideo = document.createElement('video');
            nativeVideo.className = 'native-mobile-video';
            nativeVideo.src = finalUrl;
            nativeVideo.controls = true; 
            nativeVideo.autoplay = true;
            nativeVideo.muted = false;
            // iOS 关键属性
            nativeVideo.setAttribute('playsinline', '');
            nativeVideo.setAttribute('webkit-playsinline', '');
            nativeVideo.setAttribute('x5-playsinline', '');
            
            playerDiv.appendChild(nativeVideo);

        } else {
            // 💻 PC端：Artplayer
            console.log(`${LOG_PREFIX} PC模式：Artplayer`);
            const artDiv = document.createElement('div');
            artDiv.className = 'artplayer-app';
            playerDiv.appendChild(artDiv);

            artInstance = new Artplayer({
                container: artDiv,
                url: finalUrl,
                type: 'm3u8',
                autoplay: true,
                isLive: isLive,
                volume: 0.7,
                muted: false, 
                pip: true,
                fullscreen: true,
                fullscreenWeb: true,
                setting: true,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                autoSize: true, 
                theme: '#23ade5',
                customType: {
                    m3u8: function (video, url, art) {
                        if (Hls.isSupported()) {
                            if (art.hls) art.hls.destroy();
                            const hls = new Hls();
                            hls.loadSource(url);
                            hls.attachMedia(video);
                            art.hls = hls;
                            art.on('destroy', () => hls.destroy());
                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = url;
                        } else {
                            art.notice.show = '不支持 m3u8';
                        }
                    },
                },
            });
            window.art = artInstance;
        }
    }

    let communityUrl = null;
    document.addEventListener('gemini-data-captured', e => communityUrl = e.detail.data.url);

    let lastUrl = window.location.href;
    const urlChangeObserver = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
            console.log(`${LOG_PREFIX} 路由切换，重置。`);
            cleanupPlayer(); 
            lastUrl = window.location.href;
        }
    });
    urlChangeObserver.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        const container = document.querySelector(vueHashes.player) || document.querySelector(FALLBACK_PLAYER_SELECTOR);
        const videoImgContainer = document.querySelector(vueHashes.videoImg);
        
        const params = new URLSearchParams(window.location.search);
        const stream = params.get('stream');
        if (stream) {
            if (container) updateHash(container, 'player');
            mountHlsPlayer(container, cleanUrl(stream), true);
            return;
        }

        if (unsafeWindow.__GEMINI_CLEAN_URL__) {
             if (container) updateHash(container, 'player');
             mountHlsPlayer(container, unsafeWindow.__GEMINI_CLEAN_URL__, false);
             return;
        }

        if (communityUrl && videoImgContainer) {
            updateHash(videoImgContainer, 'videoImg');
            mountHlsPlayer(videoImgContainer, communityUrl, false);
            return;
        }
    }, 200);

})();
// ==UserScript==
// @name         Weibo Media Lightbox (Ultimate Fix v2.3)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  微博全能看图模式：深度挖掘混合媒体、多视频、Live Photo。支持微博搜索页(s.weibo.com)适配。
// @author       You
// @license      MIT
// @match        *://weibo.com/*
// @match        *://s.weibo.com/*
// @match        *://d.weibo.com/*
// @include      *
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561666/Weibo%20Media%20Lightbox%20%28Ultimate%20Fix%20v23%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561666/Weibo%20Media%20Lightbox%20%28Ultimate%20Fix%20v23%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --------------------------------------------------------
    // 1. CSS 样式 (保持暗黑风格)
    // --------------------------------------------------------
    const style = `
        #ws-lightbox-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.98); z-index: 2147483647;
            display: flex; justify-content: center; align-items: center;
            user-select: none; opacity: 0; transition: opacity 0.2s ease;
            pointer-events: none;
        }
        #ws-lightbox-overlay.ws-active { opacity: 1; pointer-events: auto; }
        .ws-media-content {
            max-width: 100vw; max-height: 100vh; width: auto; height: auto;
            object-fit: contain; transition: transform 0.2s ease;
        }
        .ws-hidden { display: none !important; }
        .ws-nav-btn {
            position: absolute; top: 50%; transform: translateY(-50%);
            background: rgba(40, 40, 40, 0.5); color: white; border: none;
            width: 50px; height: 50px; border-radius: 50%; font-size: 24px;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s; z-index: 10000001;
        }
        .ws-nav-btn:hover { background: rgba(80, 80, 80, 0.8); }
        #ws-prev { left: 20px; }
        #ws-next { right: 20px; }
        #ws-top-bar {
            position: absolute; top: 0; left: 0; width: 100%; height: 60px;
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 20px; z-index: 10000002;
            background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
        }
        #ws-close {
            color: white; font-size: 24px; cursor: pointer; width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center; border-radius: 50%;
        }
        #ws-close:hover { background: rgba(255,255,255,0.2); }
        #ws-counter { color: #ddd; font-family: sans-serif; font-size: 16px; font-weight: bold; }
        #ws-loading {
            position: absolute; color: white; font-size: 14px; display: none;
            z-index: 10000000; pointer-events: none;
        }
        /* 鼠标样式适配：包含搜索页的类名 */
        .woo-picture-slot img, 
        .media-piclist img, 
        .vjs-poster img, 
        li[action-type="fl_pics"] img,
        img[src*="sinaimg.cn"] { cursor: zoom-in; }
        
        /* 搜索页特殊处理：让遮罩层也显示放大镜 */
        .picture-cover, .hoverMask { cursor: zoom-in; }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(style);
    } else {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = style;
        document.head.appendChild(styleEl);
    }

    // --------------------------------------------------------
    // 2. 状态管理
    // --------------------------------------------------------
    let currentMediaList = [];
    let currentIndex = 0;
    let ui = {};
    let savedScrollTop = 0;

    // --------------------------------------------------------
    // 3. UI 初始化
    // --------------------------------------------------------
    function initUI() {
        if (document.getElementById('ws-lightbox-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'ws-lightbox-overlay';
        overlay.innerHTML = `
            <div id="ws-top-bar">
                <div id="ws-close" title="Close (ESC)">✕</div>
                <div id="ws-counter"></div>
                <div style="width:40px"></div>
            </div>
            <div id="ws-loading">Loading...</div>
            <button id="ws-prev" class="ws-nav-btn">‹</button>
            <button id="ws-next" class="ws-nav-btn">›</button>
            <img id="ws-img-view" class="ws-media-content ws-hidden" src="">
            <video id="ws-video-view" class="ws-media-content ws-hidden" autoplay loop playsinline controls referrerpolicy="no-referrer"></video>
        `;
        document.body.appendChild(overlay);

        ui = {
            overlay: overlay,
            img: document.getElementById('ws-img-view'),
            video: document.getElementById('ws-video-view'),
            counter: document.getElementById('ws-counter'),
            prev: document.getElementById('ws-prev'),
            next: document.getElementById('ws-next'),
            close: document.getElementById('ws-close'),
            loading: document.getElementById('ws-loading')
        };

        ui.close.addEventListener('click', closeLightbox);
        ui.overlay.addEventListener('click', (e) => {
            if (e.target === ui.overlay || e.target === document.getElementById('ws-top-bar')) closeLightbox();
        });
        ui.prev.addEventListener('click', (e) => { e.stopPropagation(); changeSlide(-1); });
        ui.next.addEventListener('click', (e) => { e.stopPropagation(); changeSlide(1); });

        document.addEventListener('keydown', (e) => {
            if (!ui.overlay.classList.contains('ws-active')) return;
            if (['ArrowLeft', 'ArrowRight', ' ', 'Enter', 'Escape'].includes(e.key)) {
                e.preventDefault(); e.stopPropagation();
            }
            switch(e.key) {
                case 'Escape': closeLightbox(); break;
                case 'ArrowLeft': changeSlide(-1); break;
                case 'ArrowRight': changeSlide(1); break;
            }
        }, true);
    }

    // --------------------------------------------------------
    // 4. 深度解析工具
    // --------------------------------------------------------

    function getHighResUrl(url) {
        if (!url) return '';
        // 兼容所有缩略图规则
        return url.replace(/\/(orj480|orj360|mw690|thumb150|small|bmiddle|mw1024|wap180|thumbnail|crop\.[^/]+)\//, '/mw2000/');
    }

    // 解析 action-data 字符串 (搜索页核心)
    function parseActionData(element) {
        if (!element) return {};
        const actionDataStr = element.getAttribute('action-data');
        if (!actionDataStr) return {};
        
        const res = {};
        actionDataStr.split('&').forEach(pair => {
            const [key, val] = pair.split('=');
            if (key) res[key] = decodeURIComponent(val || '');
        });
        return res;
    }

    // --------------------------------------------------------
    // 5. 核心：媒体提取器 (适配搜索页结构)
    // --------------------------------------------------------
    function extractMediaInfo(img) {
        let videoSrc = null;
        const highResSrc = getHighResUrl(img.src);

        // 查找相关容器
        const itemInlineBlock = img.closest('.woo-box-item-inlineBlock') || img.parentElement; // 首页
        const searchItemLi = img.closest('li[action-type="fl_pics"]'); // 搜索页

        const videoJsContainer = img.closest('.video-js');
        const feedVideoContainer = img.closest('[class*="_feedVideo_"]');

        // >>> 策略 1: 查找显式的 <video> 标签
        if (videoJsContainer || feedVideoContainer) {
            const container = videoJsContainer || feedVideoContainer;
            const videoEl = container.querySelector('video');
            if (videoEl && videoEl.src && !videoEl.src.startsWith('blob:')) {
                videoSrc = videoEl.src;
            }
        }

        // >>> 策略 2: 搜索页 action-data (搜索页核心逻辑)
        if (!videoSrc && searchItemLi) {
            // 搜索页的数据在 li 标签的 action-data 里
            // 格式如: uid=...&pic_id=...&gif_url=...
            const data = parseActionData(searchItemLi);
            if (data.video_src) videoSrc = data.video_src;
            else if (data.gif_url) videoSrc = data.gif_url; 
            else if (data.mp4_url) videoSrc = data.mp4_url;
            
            // 搜索页有时还有 data-gifviedo (拼写错误兼容)
            if (!videoSrc) {
                const gifVideo = img.getAttribute('data-gifviedo');
                if (gifVideo) videoSrc = gifVideo;
            }
        }

        // >>> 策略 3: 首页 action-data
        if (!videoSrc) {
            const dataContainer = img.closest('[action-data]');
            if (dataContainer && !searchItemLi) {
                const data = parseActionData(dataContainer);
                if (data.video_src) videoSrc = data.video_src;
                else if (data.gif_url) videoSrc = data.gif_url;
            }
        }

        // >>> 策略 4: HTML5 video-sources
        if (!videoSrc) {
            videoSrc = img.getAttribute('video-sources') || img.getAttribute('data-mp4');
        }

        // >>> 策略 5: Live Photo 推导 (首页 + 搜索页通用)
        // 搜索页如果不给 gif_url，我们可以尝试构造 .mov 地址
        if (!videoSrc) {
            let isLive = false;
            
            // 首页 Live 标
            if (itemInlineBlock) {
                const liveTag = Array.from(itemInlineBlock.querySelectorAll('*')).find(el => 
                    el.innerText === 'Live' || el.className.includes('_live_') || el.className.includes('tag_live')
                );
                if (liveTag) isLive = true;
            }
            
            // 如果没找到标，但我们想强行测试(搜索页可能没标)，也可以放宽条件
            // 但为了防止普通图报错，我们依赖 .mov 加载失败后的降级机制
            
            // 尝试构造 Live 地址 (对搜索页也有效)
            try {
                const urlObj = new URL(highResSrc);
                const pathParts = urlObj.pathname.split('/');
                const filename = pathParts[pathParts.length - 1].split('.')[0];
                const liveUrl = `https://us.sinaimg.cn/${filename}.mov`;
                
                // 如果确认为 Live，或者是在搜索页且看起来像 Live (这里可以增加逻辑，目前保持保守)
                if (isLive) {
                    videoSrc = liveUrl;
                }
                // 搜索页兜底：如果 action-data 里的 pic_ids 有多个，且没有 gif_url，可能也是 Live
                // 但由于 us.sinaimg.cn 被墙概率大，且没有 Live 标，这里暂不强制搜索页所有图都去试 .mov
                // 除非用户有明确需求
            } catch(e) {}
        }

        // 协议修复
        if (videoSrc && videoSrc.startsWith('//')) videoSrc = 'https:' + videoSrc;

        return {
            src: highResSrc,
            videoSrc: videoSrc
        };
    }

    // --------------------------------------------------------
    // 6. 显示与播放逻辑
    // --------------------------------------------------------
    function showMedia(index) {
        if (index < 0) index = currentMediaList.length - 1;
        if (index >= currentMediaList.length) index = 0;
        currentIndex = index;

        const item = currentMediaList[currentIndex];
        ui.counter.textContent = `${currentIndex + 1} / ${currentMediaList.length}`;

        ui.loading.style.display = 'none';
        ui.img.classList.add('ws-hidden');
        ui.video.classList.add('ws-hidden');
        ui.video.pause();
        ui.video.removeAttribute('src');

        if (item.videoSrc) {
            ui.loading.style.display = 'block';
            ui.video.classList.remove('ws-hidden');
            
            ui.video.poster = item.src;
            ui.video.src = item.videoSrc;

            ui.video.onerror = () => {
                console.warn('[WeiboLightbox] Video failed, fallback to image:', item.videoSrc);
                ui.loading.style.display = 'none';
                ui.video.classList.add('ws-hidden');
                ui.img.classList.remove('ws-hidden');
                ui.img.src = item.src;
            };

            ui.video.oncanplay = () => { ui.loading.style.display = 'none'; };
            
            const playPromise = ui.video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => ui.loading.style.display = 'none');
            }
        } else {
            ui.img.classList.remove('ws-hidden');
            ui.img.src = item.src;
        }

        if (currentMediaList.length <= 1) {
            ui.prev.style.display = 'none';
            ui.next.style.display = 'none';
        } else {
            ui.prev.style.display = 'flex';
            ui.next.style.display = 'flex';
        }
    }

    function changeSlide(dir) { showMedia(currentIndex + dir); }

    function openLightbox(index, list) {
        savedScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        currentMediaList = list;
        ui.overlay.classList.add('ws-active');
        document.body.style.overflow = 'hidden';
        showMedia(index);
    }

    function closeLightbox() {
        ui.overlay.classList.remove('ws-active');
        document.body.style.overflow = '';
        ui.video.pause();
        ui.img.src = '';
        setTimeout(() => window.scrollTo(0, savedScrollTop), 0);
    }

    // --------------------------------------------------------
    // 7. 点击监听 (适配搜索页结构)
    // --------------------------------------------------------
    document.addEventListener('click', function(e) {
        let target = e.target;

        // >>> 搜索页特殊处理：点击了 picture-cover 或 hoverMask
        // 结构: li > img + i.picture-cover + i.hoverMask
        if (target.tagName === 'I' && (target.classList.contains('picture-cover') || target.classList.contains('hoverMask'))) {
            // 尝试找同级的 img
            const siblingImg = target.parentElement.querySelector('img');
            if (siblingImg) target = siblingImg;
        }

        // 常规蒙版处理
        if (target.tagName !== 'IMG') {
            let img = target.querySelector('img');
            if (!img) {
                const wrapper = target.closest('.woo-picture-main') || target.closest('.vjs-poster') || target.closest('.video-js');
                if (wrapper) img = wrapper.querySelector('img');
            }
            if (img) target = img;
        }

        if (target.tagName !== 'IMG') return;
        if (!target.src.includes('sinaimg.cn') || target.width < 50) return;

        // 确定容器 (新增搜索页容器选择器)
        const feedContainer = target.closest('.wbpro-feed-content') || 
                              target.closest('[class*="feed-content"]') ||
                              target.closest('.vue-recycle-scroller__item-view') || 
                              target.closest('[node-type="fl_pic_list"]') || // 搜索页
                              target.closest('.media-piclist') || // 搜索页
                              target.closest('.card-wrap');

        if (feedContainer) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // 收集图片
            const allImgs = Array.from(feedContainer.querySelectorAll('img[src*="sinaimg.cn"]'));
            
            // 筛选
            const galleryImgs = allImgs.filter(img => {
                if (img.clientWidth < 50) return false;
                
                return img.closest('.woo-picture-slot') || 
                       img.closest('.woo-picture-img') ||  
                       img.closest('.vjs-poster') ||       
                       img.closest('[class*="_feedVideo_"]') || 
                       img.closest('li[action-type="fl_pics"]'); // 搜索页 li
            });

            // 兜底
            const finalImgs = galleryImgs.length > 0 ? galleryImgs : allImgs.filter(i => i.clientWidth > 100);

            // 提取数据
            const mediaList = finalImgs.map(img => extractMediaInfo(img));

            // 定位
            let clickIndex = finalImgs.indexOf(target);
            if (clickIndex === -1) {
                clickIndex = finalImgs.findIndex(i => i.src === target.src);
            }

            if (mediaList.length > 0) {
                initUI();
                openLightbox(clickIndex === -1 ? 0 : clickIndex, mediaList);
            }
        }
    }, true);

})();
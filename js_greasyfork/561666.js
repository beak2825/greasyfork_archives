// ==UserScript==
// @name         Weibo/Sina Image Lightbox (Live Photo Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  支持微博主页/搜索页/Live图，自动解析.mov实况图地址，类似X.com的全屏幻灯片模式
// @author       You
// @match        *://weibo.com/*
// @match        *://s.weibo.com/*
// @match        *://d.weibo.com/*
// @include      *
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561666/WeiboSina%20Image%20Lightbox%20%28Live%20Photo%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561666/WeiboSina%20Image%20Lightbox%20%28Live%20Photo%20Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入CSS样式
    const style = `
        #ws-lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
            backdrop-filter: blur(5px);
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }
        #ws-lightbox-overlay.ws-active {
            opacity: 1;
            pointer-events: auto;
        }
        .ws-media-content {
            max-width: 95vw;
            max-height: 95vh;
            object-fit: contain;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            transition: transform 0.2s ease;
            transform: scale(0.95);
        }
        #ws-lightbox-overlay.ws-active .ws-media-content {
            transform: scale(1);
        }
        .ws-hidden-media {
            display: none !important;
        }
        .ws-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            font-size: 30px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            outline: none;
            z-index: 1000001;
        }
        .ws-nav-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        #ws-prev { left: 20px; }
        #ws-next { right: 20px; }
        #ws-close {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.15);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            z-index: 1000002;
        }
        #ws-close:hover { background: rgba(255, 255, 255, 0.4); }
        #ws-counter {
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            color: #ddd;
            font-family: sans-serif;
            background: rgba(0,0,0,0.6);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000001;
        }
        #ws-loading {
            position: absolute;
            color: white;
            font-size: 14px;
            display: none;
        }
        /* 鼠标样式 */
        .woo-picture-slot img, 
        .media-piclist li, .media-piclist i,
        [node-type="fl_pic_list"] li, [node-type="fl_pic_list"] i {
             cursor: zoom-in !important;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(style);
    } else {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = style;
        document.head.appendChild(styleEl);
    }

    // 全局变量
    let currentImages = [];
    let currentIndex = 0;
    let overlay, imgElement, videoElement, counter, prevBtn, nextBtn, loadingText;
    let savedScrollTop = 0;

    function initUI() {
        if (document.getElementById('ws-lightbox-overlay')) return;

        overlay = document.createElement('div');
        overlay.id = 'ws-lightbox-overlay';

        overlay.innerHTML = `
            <div id="ws-close" title="Close (ESC)">✕</div>
            <div id="ws-counter"></div>
            <div id="ws-loading">Loading...</div>
            <button id="ws-prev" class="ws-nav-btn" title="Previous (←)">‹</button>
            <button id="ws-next" class="ws-nav-btn" title="Next (→)">›</button>
            <img id="ws-lightbox-img" class="ws-media-content" src="" alt="">
            <video id="ws-lightbox-video" class="ws-media-content ws-hidden-media" autoplay loop playsinline controls></video>
        `;

        document.body.appendChild(overlay);

        imgElement = document.getElementById('ws-lightbox-img');
        videoElement = document.getElementById('ws-lightbox-video');
        counter = document.getElementById('ws-counter');
        prevBtn = document.getElementById('ws-prev');
        nextBtn = document.getElementById('ws-next');
        loadingText = document.getElementById('ws-loading');
        const closeBtn = document.getElementById('ws-close');

        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('ws-active')) return;
            e.stopPropagation();
            switch(e.key) {
                case 'Escape': closeLightbox(); break;
                case 'ArrowLeft': showPrev(); break;
                case 'ArrowRight': showNext(); break;
                case ' ':
                case 'Enter': e.preventDefault(); break;
            }
        }, true);
    }

    function getHighResUrl(url) {
        if (!url) return '';
        return url.replace(/\/(orj360|mw690|thumb150|small|bmiddle|mw1024|wap180|thumbnail)\//, '/mw2000/');
    }

    function parseActionData(str) {
        if (!str) return {};
        const res = {};
        str.split('&').forEach(pair => {
            const [key, val] = pair.split('=');
            if (key) res[key] = decodeURIComponent(val || '');
        });
        return res;
    }

    function showImage(index) {
        if (index < 0) index = currentImages.length - 1;
        if (index >= currentImages.length) index = 0;

        currentIndex = index;
        const item = currentImages[currentIndex];

        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

        // 按钮显示
        if (currentImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }

        loadingText.style.display = 'block';

        if (item.videoSrc) {
            // --- 视频模式 ---
            imgElement.classList.add('ws-hidden-media');
            videoElement.classList.remove('ws-hidden-media');
            
            // 避免重复加载
            if (videoElement.src !== item.videoSrc) {
                videoElement.src = item.videoSrc;
                videoElement.poster = item.highResSrc;
            }
            videoElement.oncanplay = () => { loadingText.style.display = 'none'; };
            videoElement.play().catch(e => console.log('Autoplay prevented', e));

        } else {
            // --- 图片模式 ---
            videoElement.classList.add('ws-hidden-media');
            videoElement.pause();
            videoElement.src = '';
            imgElement.classList.remove('ws-hidden-media');

            imgElement.style.opacity = '0.5';
            const tempImg = new Image();
            tempImg.onload = () => {
                imgElement.src = item.highResSrc;
                imgElement.style.opacity = '1';
                loadingText.style.display = 'none';
            };
            tempImg.src = item.highResSrc;
        }
    }

    function showPrev() { showImage(currentIndex - 1); }
    function showNext() { showImage(currentIndex + 1); }

    function openLightbox(index, mediaList) {
        savedScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        currentImages = mediaList;
        currentIndex = index;
        overlay.classList.add('ws-active');
        document.body.style.overflow = 'hidden';
        showImage(index);
    }

    function closeLightbox() {
        overlay.classList.remove('ws-active');
        document.body.style.overflow = '';
        videoElement.pause();
        videoElement.src = '';
        imgElement.src = '';
        setTimeout(() => {
            window.scrollTo(0, savedScrollTop);
        }, 0);
    }

    // --- 主逻辑 ---
    document.addEventListener('click', function(e) {
        let target = e.target;

        // 蒙版穿透处理
        if (target.tagName === 'I' && (
            target.classList.contains('picture-cover') || 
            target.classList.contains('hoverMask') || 
            target.classList.contains('woo-picture-hoverMask')
        )) {
            const siblingImg = target.parentElement.querySelector('img');
            if (siblingImg) target = siblingImg;
        }

        if (target.tagName !== 'IMG') return;

        const src = target.src;
        if (!src || !src.includes('sinaimg.cn') || target.width < 50) return;

        // 确定容器
        const feedContent = target.closest('.wbpro-feed-content') || 
                            target.closest('[class*="feed-content"]') ||
                            target.closest('.vue-recycle-scroller__item-view') ||
                            target.closest('[node-type="fl_pic_list"]') || 
                            target.closest('.media-piclist') ||
                            target.closest('.card-wrap');

        if (feedContent) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // 收集图片
            const allImgElements = Array.from(feedContent.querySelectorAll('img[src*="sinaimg.cn"]'));

            let galleryElements = allImgElements.filter(img => {
                if (img.clientWidth < 80 && img.clientHeight < 80) return false;
                if (img.closest('.woo-picture-slot') || img.classList.contains('woo-picture-img')) return true;
                if (img.closest('li[action-type="fl_pics"]')) return true;
                if (img.nextElementSibling && img.nextElementSibling.classList.contains('picture-cover')) return true;
                if (feedContent.getAttribute('node-type') === 'fl_pic_list' || feedContent.classList.contains('media-piclist')) return true;
                return false;
            });

            if (galleryElements.length === 0) {
                 galleryElements = allImgElements.filter(img => img.clientWidth > 50);
            }

            // 构建数据，核心更新在这里
            const mediaList = galleryElements.map(img => {
                const highResSrc = getHighResUrl(img.src);
                let videoSrc = null;

                // --- 1. 检查搜索页 data-gifviedo / action-data ---
                const dataGifVideo = img.getAttribute('data-gifviedo');
                if (dataGifVideo && dataGifVideo.length > 5) videoSrc = dataGifVideo;

                if (!videoSrc) {
                    const parentLi = img.closest('li');
                    if (parentLi) {
                        const actionData = parseActionData(parentLi.getAttribute('action-data'));
                        if (actionData.gif_url) videoSrc = actionData.gif_url;
                        else if (actionData.video_src) videoSrc = actionData.video_src;
                    }
                }

                // --- 2. 检查主页 video-sources (旧版或部分动态) ---
                if (!videoSrc) {
                    videoSrc = img.getAttribute('video-sources') || img.getAttribute('data-mp4');
                }

                // --- 3. 核心：检查是否为 Live 图 (针对你提供的 HTML) ---
                // 查找 img 所在的 item 容器，再找是否有 Live 标签
                if (!videoSrc) {
                    const itemContainer = img.closest('.woo-box-item-inlineBlock');
                    if (itemContainer) {
                        // 你的 HTML 中 Live 标签类名是 _tag_a2k8z_59 _live_a2k8z_73
                        // 但哈希值可能变，所以用部分匹配
                        const hasLiveTag = itemContainer.querySelector('[class*="_live_"]');
                        if (hasLiveTag) {
                            // 提取文件名
                            const urlObj = new URL(highResSrc);
                            // 路径通常是 /mw2000/文件名.jpg
                            const filename = urlObj.pathname.split('/').pop().split('.')[0];
                            
                            // 构造 .mov 地址 (这是微博 Live 图最常用的原始文件库)
                            videoSrc = `https://us.sinaimg.cn/${filename}.mov`;
                        }
                    }
                }

                // 协议修复
                if (videoSrc && videoSrc.startsWith('//')) {
                    videoSrc = 'https:' + videoSrc;
                }

                return { highResSrc, videoSrc };
            });

            const clickIndex = galleryElements.indexOf(target);
            initUI();
            openLightbox(clickIndex === -1 ? 0 : clickIndex, mediaList);
        }
    }, true);

})();
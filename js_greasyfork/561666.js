// ==UserScript==
// @name         Weibo Media Lightbox (Ultimate Fix v2.2)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  微博全能看图模式：深度挖掘混合媒体、多视频、Live Photo。支持数据解密获取视频地址。
// @author       You
// @license      MIT
// @match        *://weibo.com/*
// @match        *://s.weibo.com/*
// @match        *://d.weibo.com/*
// @include      *
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561666/Weibo%20Media%20Lightbox%20%28Ultimate%20Fix%20v22%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561666/Weibo%20Media%20Lightbox%20%28Ultimate%20Fix%20v22%29.meta.js
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
        /* 鼠标样式 */
        .woo-picture-slot img, .media-piclist img, .vjs-poster img, img[src*="sinaimg.cn"] { cursor: zoom-in; }
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
    // 4. 深度解析工具 (Deep Mining)
    // --------------------------------------------------------

    function getHighResUrl(url) {
        if (!url) return '';
        // 替换所有常见的缩略图规则为高清规则 (mw2000)
        return url.replace(/\/(orj480|orj360|mw690|thumb150|small|bmiddle|mw1024|wap180|thumbnail|crop\.[^/]+)\//, '/mw2000/');
    }

    // 解析 action-data 字符串，提取 video_src, gif_url 等
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
    // 5. 核心：超级媒体提取器
    // --------------------------------------------------------
    function extractMediaInfo(img) {
        let videoSrc = null;
        let isLivePhoto = false;
        const highResSrc = getHighResUrl(img.src);

        // 查找相关容器
        const itemInlineBlock = img.closest('.woo-box-item-inlineBlock') || img.closest('li') || img.parentElement;
        const videoJsContainer = img.closest('.video-js');
        const feedVideoContainer = img.closest('[class*="_feedVideo_"]'); // 微博新版视频容器

        // >>> 策略 1: 查找显式的 <video> 标签 (针对已加载的视频)
        if (videoJsContainer || feedVideoContainer) {
            const container = videoJsContainer || feedVideoContainer;
            const videoEl = container.querySelector('video');
            if (videoEl && videoEl.src && !videoEl.src.startsWith('blob:')) {
                videoSrc = videoEl.src;
            }
        }

        // >>> 策略 2: 挖掘 action-data (针对混合宫格、搜索结果视频)
        if (!videoSrc) {
            // 尝试从当前 item 向上找 action-data
            // 很多时候 video_src 藏在 li 标签或 div._item_... 上
            const dataContainer = img.closest('[action-data]');
            if (dataContainer) {
                const data = parseActionData(dataContainer);
                if (data.video_src) videoSrc = data.video_src;
                else if (data.gif_url) videoSrc = data.gif_url; // 动图也是视频
                else if (data.mp4_url) videoSrc = data.mp4_url;
            }
        }

        // >>> 策略 3: 挖掘 video-sources 属性 (旧版兼容)
        if (!videoSrc) {
            videoSrc = img.getAttribute('video-sources') || img.getAttribute('data-mp4');
        }

        // >>> 策略 4: 检测 Live Photo 标记 (并推导地址)
        // 你的截图显示 Live 标记在 woo-box-item-inlineBlock 内部
        if (!videoSrc) {
            if (itemInlineBlock) {
                // 查找包含 "Live" 文本的元素 或 特定的 Live 图标类名
                const liveTag = Array.from(itemInlineBlock.querySelectorAll('*')).find(el => 
                    el.innerText === 'Live' || 
                    el.className.includes('_live_') || 
                    el.className.includes('tag_live')
                );

                if (liveTag) {
                    isLivePhoto = true;
                    // Live Photo 命名规则推导
                    try {
                        const urlObj = new URL(highResSrc);
                        const pathParts = urlObj.pathname.split('/');
                        const filename = pathParts[pathParts.length - 1].split('.')[0];
                        // 构造 Live 视频地址 (海外源，需翻墙，但配合 onerror 降级完美)
                        videoSrc = `https://us.sinaimg.cn/${filename}.mov`;
                    } catch(e) {}
                }
            }
        }

        // >>> 协议修复
        if (videoSrc && videoSrc.startsWith('//')) videoSrc = 'https:' + videoSrc;

        return {
            src: highResSrc,
            videoSrc: videoSrc,
            isLive: isLivePhoto
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

        // 重置状态
        ui.loading.style.display = 'none';
        ui.img.classList.add('ws-hidden');
        ui.video.classList.add('ws-hidden');
        ui.video.pause();
        ui.video.removeAttribute('src'); // 彻底清除旧源

        if (item.videoSrc) {
            // === 视频/Live 模式 ===
            ui.loading.style.display = 'block';
            ui.video.classList.remove('ws-hidden');
            
            ui.video.poster = item.src; // 使用高清图做封面，体验无缝
            ui.video.src = item.videoSrc;

            // 错误处理 (关键)：如果视频加载失败 (比如Live图被墙)，瞬间切回图片
            ui.video.onerror = () => {
                console.warn('[WeiboLightbox] Video load error, fallback to image:', item.videoSrc);
                ui.loading.style.display = 'none';
                ui.video.classList.add('ws-hidden');
                ui.img.classList.remove('ws-hidden');
                ui.img.src = item.src;
            };

            ui.video.oncanplay = () => { ui.loading.style.display = 'none'; };
            
            const playPromise = ui.video.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    // 自动播放失败通常是因为浏览器策略，保持 Loading 消失，显示控件让用户点
                    ui.loading.style.display = 'none';
                });
            }
        } else {
            // === 纯图模式 ===
            ui.img.classList.remove('ws-hidden');
            ui.img.src = item.src;
        }

        // 导航按钮状态
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
        ui.video.removeAttribute('src');
        ui.img.src = '';
        setTimeout(() => window.scrollTo(0, savedScrollTop), 0);
    }

    // --------------------------------------------------------
    // 7. 点击监听 (入口)
    // --------------------------------------------------------
    document.addEventListener('click', function(e) {
        let target = e.target;

        // 处理点击了播放按钮、遮罩层等情况，寻找最近的图片
        if (target.tagName !== 'IMG') {
            // 尝试向下找
            let img = target.querySelector('img');
            // 尝试向上找容器再找图片 (比如点击了播放图标 <i>)
            if (!img) {
                const wrapper = target.closest('.woo-picture-main') || target.closest('.vjs-poster') || target.closest('.video-js');
                if (wrapper) img = wrapper.querySelector('img');
            }
            if (img) target = img;
        }

        if (target.tagName !== 'IMG') return;
        if (!target.src.includes('sinaimg.cn') || target.width < 50) return;

        // 确定 Feed 容器
        const feedContainer = target.closest('.wbpro-feed-content') || 
                              target.closest('[class*="feed-content"]') ||
                              target.closest('.vue-recycle-scroller__item-view') || 
                              target.closest('[node-type="fl_pic_list"]') ||
                              target.closest('.card-wrap');

        if (feedContainer) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // 1. 收集容器内所有有效的“媒体封面图”
            const allImgs = Array.from(feedContainer.querySelectorAll('img[src*="sinaimg.cn"]'));
            
            // 2. 筛选
            const galleryImgs = allImgs.filter(img => {
                if (img.clientWidth < 50) return false; // 忽略头像
                // 必须在特定的内容结构中
                return img.closest('.woo-picture-slot') || // 普通/Live宫格
                       img.closest('.woo-picture-img') ||  // 单图
                       img.closest('.vjs-poster') ||       // 视频封面
                       img.closest('[class*="_feedVideo_"]') || // 视频容器
                       img.closest('li[action-type="fl_pics"]'); // 搜索页
            });

            // 如果没找到（比如结构变了），兜底使用所有大图
            const finalImgs = galleryImgs.length > 0 ? galleryImgs : allImgs.filter(i => i.clientWidth > 100);

            // 3. 提取每一项的媒体信息 (Video/Live/Image)
            const mediaList = finalImgs.map(img => extractMediaInfo(img));

            // 4. 定位当前点击的图片
            let clickIndex = finalImgs.indexOf(target);
            if (clickIndex === -1) {
                // 如果 DOM 引用对不上，尝试匹配 src
                clickIndex = finalImgs.findIndex(i => i.src === target.src);
            }

            if (mediaList.length > 0) {
                initUI();
                openLightbox(clickIndex === -1 ? 0 : clickIndex, mediaList);
            }
        }
    }, true);

})();
// ==UserScript==
// @name         YouTube 综合悬浮播放器
// @namespace    https://lele1894.tk/
// @version      1.3
// @description  在YouTube视频和Shorts缩略图上添加悬浮播放按钮，支持在YouTube不跳转新页面播放视频
// @author       lele1894
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://lele1894.tk/
// @supportURL   https://lele1894.tk/
// @downloadURL https://update.greasyfork.org/scripts/557546/YouTube%20%E7%BB%BC%E5%90%88%E6%82%AC%E6%B5%AE%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557546/YouTube%20%E7%BB%BC%E5%90%88%E6%82%AC%E6%B5%AE%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 可配置的基础URL变量
    const baseUrl = 'https://lele1894.tk/1.html';

    // 创建悬浮播放器样式
    const style = document.createElement('style');
    style.textContent = `
        .float-player-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            background: rgba(0, 0, 0, 0.9);
            padding: 10px;
            border-radius: 8px;
            display: none;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }

        .player-container {
            position: relative;
            width: 100%;
            height: 100%;
        }

        .player-container iframe {
            width: 100%;
            height: 100%;
            display: block;
            border: none;
        }

        .custom-play-btn {
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: auto;
        }

        /* 悬浮显示按钮 */
        .thumbnail-container:hover .custom-play-btn,
        #thumbnail-container:hover .custom-play-btn,
        .shorts-container:hover .custom-play-btn {
            opacity: 1;
        }

        .thumbnail-btn {
            position: absolute;
            top: 8px;
            left: 40px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: auto;
        }

        .new-window-btn {
            position: absolute;
            top: 8px;
            left: 72px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: auto;
        }

        /* 悬浮显示按钮 */
        .thumbnail-container:hover .thumbnail-btn,
        #thumbnail-container:hover .thumbnail-btn,
        .shorts-container:hover .new-window-btn {
            opacity: 1;
        }

        .thumbnail-container:hover .new-window-btn,
        #thumbnail-container:hover .new-window-btn {
            opacity: 1;
        }

        /* 订阅页面特殊布局修复 */
        ytd-browse[page-subtype="subscriptions"] .custom-play-btn,
        ytd-browse[page-subtype="subscriptions"] .thumbnail-btn,
        ytd-browse[page-subtype="subscriptions"] .new-window-btn {
            position: absolute;
            top: 4px;
            z-index: 101;
        }

        ytd-browse[page-subtype="subscriptions"] .thumbnail-btn {
            left: 32px;
        }

        ytd-browse[page-subtype="subscriptions"] .new-window-btn {
            left: 64px;
        }

        /* 防止按钮影响布局 */
        .custom-play-btn, .thumbnail-btn, .new-window-btn {
            box-sizing: border-box;
            transform: none;
            margin: 0;
            padding: 0;
        }

        /* 确保缩略图容器相对定位 */
        .thumbnail-container, .shorts-container {
            position: relative !important;
        }

        /* 针对不同页面的特殊处理 */
        ytd-rich-item-renderer .thumbnail-container,
        ytd-video-renderer .thumbnail-container,
        ytd-compact-video-renderer .thumbnail-container {
            position: relative !important;
            overflow: visible !important;
        }

        .thumbnail-preview {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            display: none;
            width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
        }

        .preview-header {
            color: white;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            text-align: center;
        }

        .preview-title {
            font-size: 16px;
            margin-bottom: 8px;
        }

        .preview-desc {
            font-size: 13px;
            color: #aaa;
            line-height: 1.4;
        }

        .thumbnail-list {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: nowrap;
            padding: 0 20px;
        }

        .thumbnail-item {
            position: relative;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            overflow: hidden;
            flex: 1;
            max-width: 400px;
            transition: transform 0.2s;
        }

        .thumbnail-item:hover {
            transform: scale(1.02);
        }

        .thumbnail-item img {
            width: 100%;
            height: auto;
            display: none;
        }

        .resolution {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 13px;
        }

        .close-preview {
            position: absolute;
            top: 15px;
            right: 15px;
            color: white;
            cursor: pointer;
            font-size: 24px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            transition: background 0.2s;
        }

        .close-preview:hover {
            background: rgba(255,255,255,0.2);
        }

        .player-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            display: none;
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮播放器容器
    const playerContainer = document.createElement('div');
    playerContainer.className = 'float-player-container';
    document.body.appendChild(playerContainer);

    const overlay = document.createElement('div');
    overlay.className = 'player-overlay';
    document.body.appendChild(overlay);

    // 添加封面图预览容器
    const previewContainer = document.createElement('div');
    previewContainer.className = 'thumbnail-preview';
    document.body.appendChild(previewContainer);

    // 添加窗口大小变化监听器
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // 防抖处理，避免频繁调整大小
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (playerContainer.style.display === 'block') {
                adjustPlayerSize();
            }
        }, 100);
    });

    // 调整播放器大小的函数
    function adjustPlayerSize() {
        const isShorts = playerContainer.dataset.isShorts === 'true';
        
        if (isShorts) {
            // Shorts视频保持9:16比例
            const windowHeight = window.innerHeight * 0.8;
            playerContainer.style.height = `${windowHeight}px`;
            const width = windowHeight * 9/16;
            playerContainer.style.width = `${width}px`;
        } else {
            // 普通视频保持16:9比例
            const windowWidth = window.innerWidth * 0.8;
            const maxWidth = Math.min(windowWidth, window.innerWidth - 40);
            playerContainer.style.width = `${maxWidth}px`;
            const height = maxWidth * 9/16;
            playerContainer.style.height = `${height}px`;
        }
    }

    // 获取视频封面图URL列表
    const getThumbnailUrls = (videoId) => {
        return [
            {
                url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                resolution: 'HD (1280x720)'
            },
            {
                url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                resolution: 'SD (640x480)'
            },
            {
                url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                resolution: 'HQ (480x360)'
            },
            {
                url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                resolution: 'MQ (320x180)'
            }
        ];
    };

    // 下载图片函数
    const downloadImage = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('下载失败:', error);
        }
    };

    // 监听页面变化,为视频加播放按钮
    const observer = new MutationObserver((mutations) => {
        // 检测当前页面类型
        const isSubscriptionPage = window.location.href.includes('/feed/subscriptions');
        const isHomePage = window.location.pathname === '/' || window.location.href.includes('youtube.com/');

        // 如果是订阅页面，使用更谨慎的方式
        if (isSubscriptionPage) {
            console.log('检测到订阅页面，使用特殊处理模式...');
        } else {
            console.log('DOM变化检测到，开始查找视频元素...');
        }

        // 处理普通YouTube视频
        processRegularVideos(isSubscriptionPage);
        
        // 处理YouTube Shorts
        processShortsVideos();
    });

    // 处理普通YouTube视频
    function processRegularVideos(isSubscriptionPage) {
        // 扩展选择器以支持新版YouTube的各种视频元素
        let videoSelectors;

        if (isSubscriptionPage) {
            // 订阅页面的特殊选择器，更加精确
            videoSelectors = [
                'ytd-rich-item-renderer a#video-title-link',
                'ytd-rich-item-renderer h3 a[href*="/watch"]',
                'ytd-rich-item-renderer .ytd-rich-grid-media a[href*="/watch"]',
                '#video-title-link'
            ];
        } else {
            // 其他页面的全面选择器
            videoSelectors = [
                '#video-title',
                'ytd-rich-item-renderer a#video-title-link',
                'ytd-video-renderer a#video-title-link',
                'ytd-grid-video-renderer a#video-title-link',
                'ytd-compact-video-renderer a#video-title-link',
                'ytd-rich-item-renderer h3 a[href*="/watch"]',
                'ytd-video-renderer h3 a[href*="/watch"]',
                'ytd-rich-item-renderer .ytd-rich-grid-media a[href*="/watch"]',
                'a[href*="/watch?v="]:not([data-processed])',
                '#video-title-link',
                '.ytd-rich-grid-media #video-title',
                '.ytd-rich-grid-media #video-title-link'
            ];
        }

        let videos = [];
        videoSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!videos.includes(el) && el.href && el.href.includes('/watch')) {
                    videos.push(el);
                }
            });
        });

        videos.forEach((video, index) => {
            if (!video.dataset.hasCustomButton) {
                video.dataset.hasCustomButton = 'true';

                // 扩展缩略图容器查找逻辑以支持新版YouTube
                let thumbnailContainer = findThumbnailContainer(video, isSubscriptionPage);

                // 检查缩略图容器是否具有aria-hidden属性，如果有则需要找到合适的父容器
                let buttonContainer = thumbnailContainer;
                if (thumbnailContainer && thumbnailContainer.getAttribute('aria-hidden') === 'true') {
                    // 如果缩略图容器有aria-hidden=true，则查找合适的父容器
                    let parent = thumbnailContainer.parentElement;
                    while (parent && parent !== document.body) {
                        if (parent.getAttribute('aria-hidden') !== 'true') {
                            buttonContainer = parent;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }

                if (buttonContainer) {
                    // 确保按钮容器有正确的样式
                    if (!buttonContainer.classList.contains('thumbnail-container')) {
                        buttonContainer.classList.add('thumbnail-container');
                    }

                    // 设置 ID 以兼容原有CSS
                    if (!buttonContainer.id) {
                        buttonContainer.id = 'thumbnail-container';
                    }

                    buttonContainer.style.position = 'relative';
                    buttonContainer.style.overflow = 'visible';

                    // 检查是否已经有按钮了
                    if (buttonContainer.querySelector('.custom-play-btn, .thumbnail-btn, .new-window-btn')) {
                        return;
                    }

                    // 添加播放按钮
                    addPlayButton(buttonContainer, video, isSubscriptionPage);
                    
                    // 添加封面图按钮
                    addThumbnailButton(buttonContainer, video, isSubscriptionPage);
                    
                    // 添加新窗口按钮
                    addNewWindowButton(buttonContainer, video, isSubscriptionPage);
                }
            }
        });
    }

    // 处理YouTube Shorts
    function processShortsVideos() {
        // 查找所有Shorts缩略图元素
        const shortsThumbnails = document.querySelectorAll(`
            a[href^="/shorts/"]:not([data-popup-added])
        `);

        shortsThumbnails.forEach(thumbnail => {
            // 确保缩略图包含图片元素，避免选择到标题链接
            const hasImage = thumbnail.querySelector('img');
            // 同时检查是否在特定的视频容器内
            const isInVideoContainer = thumbnail.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-reel-video-renderer');
            
            // 如果有图片或者在视频容器内，则添加按钮
            if (!thumbnail.querySelector('.custom-play-btn') && (hasImage || isInVideoContainer)) {
                thumbnail.setAttribute('data-popup-added', 'true');

                // 添加容器用于正确定位按钮
                const container = document.createElement('div');
                container.className = 'shorts-container';
                container.style.position = 'relative';

                // 将缩略图包裹在容器中
                thumbnail.parentNode.insertBefore(container, thumbnail);
                container.appendChild(thumbnail);

                // 添加播放按钮
                addShortsPlayButton(container, thumbnail);
                
                // 添加新窗口按钮
                addShortsNewWindowButton(container, thumbnail);
            }
        });
    }

    // 查找缩略图容器
    function findThumbnailContainer(video, isSubscriptionPage) {
        let thumbnailContainer = null;

        if (isSubscriptionPage) {
            // 订阅页面的特殊处理
            const richItem = video.closest('ytd-rich-item-renderer');
            if (richItem) {
                // 直接查找 ytd-thumbnail 元素
                thumbnailContainer = richItem.querySelector('ytd-thumbnail');

                // 如果没找到，尝试查找 a 标签包含的缩略图
                if (!thumbnailContainer) {
                    const thumbnailLink = richItem.querySelector('a[href*="/watch"] img');
                    if (thumbnailLink) {
                        thumbnailContainer = thumbnailLink.closest('a');
                    }
                }
            }
        } else {
            // 其他页面的原有处理逻辑
            // 方法 1: 传统方式 - 查找父级容器
            const videoRenderer = video.closest('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer');
            if (videoRenderer) {
                const thumbnailSelectors = [
                    '#thumbnail',
                    'ytd-thumbnail',
                    '.ytd-thumbnail',
                    'ytd-thumbnail a',
                    '.ytd-thumbnail a',
                    '[id="thumbnail"]',
                    'a[href*="/watch"] img'
                ];

                for (const selector of thumbnailSelectors) {
                    thumbnailContainer = videoRenderer.querySelector(selector);
                    if (thumbnailContainer) {
                        if (thumbnailContainer.tagName === 'IMG') {
                            thumbnailContainer = thumbnailContainer.closest('a') || thumbnailContainer.parentElement;
                        }
                        break;
                    }
                }
            }

            // 方法 2: 直接查找父级元素
            if (!thumbnailContainer) {
                let parent = video.parentElement;
                let attempts = 0;
                while (parent && !thumbnailContainer && attempts < 10) {
                    const selectors = ['#thumbnail', 'ytd-thumbnail', '.ytd-thumbnail', 'a[href*="/watch"] img'];
                    for (const selector of selectors) {
                        const found = parent.querySelector(selector);
                        if (found) {
                            thumbnailContainer = found.tagName === 'IMG' ? found.closest('a') || found.parentElement : found;
                            break;
                        }
                    }
                    if (!thumbnailContainer) {
                        parent = parent.parentElement;
                        attempts++;
                        if (parent && (parent === document.body || parent.tagName === 'HTML')) break;
                    }
                }
            }

            // 方法 3: 通过兄弟元素查找
            if (!thumbnailContainer) {
                const container = video.closest('div, ytd-rich-item-renderer, ytd-video-renderer');
                if (container) {
                    const selectors = ['#thumbnail', 'ytd-thumbnail', '.ytd-thumbnail', 'img[src*="ytimg.com"]'];
                    for (const selector of selectors) {
                        const found = container.querySelector(selector);
                        if (found) {
                            thumbnailContainer = found.tagName === 'IMG' ? found.closest('a') || found.parentElement : found;
                            break;
                        }
                    }
                }
            }

            // 方法 4: 如果还是找不到，尝试查找任何包含缩略图的元素
            if (!thumbnailContainer) {
                const richItem = video.closest('ytd-rich-item-renderer');
                if (richItem) {
                    const imgs = richItem.querySelectorAll('img');
                    for (const img of imgs) {
                        if (img.src && (img.src.includes('ytimg.com') || img.src.includes('youtube.com'))) {
                            thumbnailContainer = img.closest('a') || img.parentElement;
                            break;
                        }
                    }
                }
            }
        }

        return thumbnailContainer;
    }

    // 添加播放按钮（普通视频）
    function addPlayButton(container, video, isSubscriptionPage) {
        const playButton = document.createElement('button');
        playButton.className = 'custom-play-btn';
        playButton.textContent = '弹';

        // 防止布局破坏的样式设置
        playButton.style.cssText = `
            position: absolute !important;
            top: ${isSubscriptionPage ? '4px' : '8px'} !important;
            left: 8px !important;
            background: rgba(0, 0, 0, 0.7) !important;
            color: white !important;
            border: none !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 101 !important;
            opacity: 0 !important;
            transition: opacity 0.2s !important;
            pointer-events: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            transform: none !important;
        `;

        // 添加悬浮显示事件
        container.addEventListener('mouseenter', () => {
            playButton.style.opacity = '1';
        });
        container.addEventListener('mouseleave', () => {
            playButton.style.opacity = '0';
        });
        
        playButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            let videoId = extractVideoId(video);

            // 在当前页面打开播放器页面并传递视频ID参数
            if (videoId) {
                // 标记为普通视频（非Shorts）
                playerContainer.dataset.isShorts = 'false';
                
                // 构造播放器URL并传递视频ID参数
                const playerUrl = baseUrl + '?v=' + videoId;

                // 清空播放器容器
                playerContainer.innerHTML = '';

                // 创建iframe元素
                const iframe = document.createElement('iframe');
                iframe.src = playerUrl;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
                iframe.allowFullscreen = true;
                iframe.loading = 'eager';

                // 添加加载事件
                iframe.onload = function() {
                    console.log('播放器页面加载成功，URL: ' + playerUrl);
                };

                iframe.onerror = function() {
                    console.error('播放器页面加载失败，URL: ' + playerUrl);
                    // 显示错误信息
                    playerContainer.innerHTML = `
                        <div style="color: red; text-align: center; padding: 20px;">
                            <p>无法加载播放器页面</p>
                            <p>URL: ${playerUrl}</p>
                            <p>请检查网络连接或稍后重试</p>
                        </div>
                    `;
                };

                // 添加iframe到播放器容器
                playerContainer.appendChild(iframe);

                // 修改为窗口宽度的80%
                const windowWidth = window.innerWidth;
                const initialWidth = Math.min(Math.max(windowWidth * 0.85, 400), windowWidth - 40);
                playerContainer.style.width = `${initialWidth}px`;

                // 设置高度保持16:9比例
                const height = (initialWidth - 20) * 9/16;
                playerContainer.style.height = `${height}px`;

                // 显示播放器容器和遮罩
                playerContainer.style.display = 'block';
                overlay.style.display = 'block';
            }
        };
        container.appendChild(playButton);
    }

    // 添加封面图按钮（普通视频）
    function addThumbnailButton(container, video, isSubscriptionPage) {
        const thumbnailButton = document.createElement('button');
        thumbnailButton.className = 'thumbnail-btn';
        thumbnailButton.textContent = '图';

        // 防止布局破坏的样式设置
        thumbnailButton.style.cssText = `
            position: absolute !important;
            top: ${isSubscriptionPage ? '4px' : '8px'} !important;
            left: ${isSubscriptionPage ? '32px' : '40px'} !important;
            background: rgba(0, 0, 0, 0.7) !important;
            color: white !important;
            border: none !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 101 !important;
            opacity: 0 !important;
            transition: opacity 0.2s !important;
            pointer-events: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            transform: none !important;
        `;

        // 添加悬浮显示事件
        container.addEventListener('mouseenter', () => {
            thumbnailButton.style.opacity = '1';
        });
        container.addEventListener('mouseleave', () => {
            thumbnailButton.style.opacity = '0';
        });
        
        thumbnailButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            let videoId = extractVideoId(video);

            if (videoId) {
                const thumbnails = getThumbnailUrls(videoId);

                previewContainer.innerHTML = `
                    <div class="close-preview">×</div>
                    <div class="preview-header">
                        <div class="preview-title">视频封面下载</div>
                        <div class="preview-desc">
                            • 点击图片即可下载对应分辨率的封面,部分分辨率可能不可用(图片不显示),建议优先下载较高分辨率的封面.点击窗口外任意地方关闭展示窗口. •
                        </div>
                    </div>
                    <div class="thumbnail-list">
                        ${thumbnails.map(thumb => `
                            <div class="thumbnail-item">
                                <img src="${thumb.url}" alt="${thumb.resolution}"
                                    onerror="this.parentElement.style.display='none'"
                                    onload="this.style.display='block'">
                                <div class="resolution">${thumb.resolution}</div>
                            </div>
                        `).join('')}
                    </div>
                `;

                // 添加点击事件
                previewContainer.querySelectorAll('.thumbnail-item').forEach((item, index) => {
                    const thumb = thumbnails[index];
                    item.onclick = () => {
                        item.style.opacity = '0.6';
                        downloadImage(thumb.url, `youtube-thumb-${videoId}-${thumb.resolution}.jpg`)
                            .then(() => {
                                item.style.opacity = '1';
                            })
                            .catch(() => {
                                item.style.opacity = '1';
                            });
                    };

                    // 添加鼠标悬浮提示
                    item.title = `点击下载 ${thumb.resolution} 分辨率封面`;
                });

                previewContainer.querySelector('.close-preview').onclick = () => {
                    previewContainer.style.display = 'none';
                };

                previewContainer.style.display = 'block';
            }
        };
        container.appendChild(thumbnailButton);
    }

    // 添加新窗口按钮（普通视频）
    function addNewWindowButton(container, video, isSubscriptionPage) {
        const newWindowButton = document.createElement('button');
        newWindowButton.className = 'new-window-btn';
        newWindowButton.textContent = '新';

        // 防止布局破坏的样式设置
        newWindowButton.style.cssText = `
            position: absolute !important;
            top: ${isSubscriptionPage ? '4px' : '8px'} !important;
            left: ${isSubscriptionPage ? '64px' : '72px'} !important;
            background: rgba(0, 0, 0, 0.7) !important;
            color: white !important;
            border: none !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 101 !important;
            opacity: 0 !important;
            transition: opacity 0.2s !important;
            pointer-events: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            transform: none !important;
        `;

        // 添加悬浮显示事件
        container.addEventListener('mouseenter', () => {
            newWindowButton.style.opacity = '1';
        });
        container.addEventListener('mouseleave', () => {
            newWindowButton.style.opacity = '0';
        });

        newWindowButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 直接打开原始YouTube视频链接
            const url = video.href;
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        };

        container.appendChild(newWindowButton);
    }

    // 添加播放按钮（Shorts）
    function addShortsPlayButton(container, thumbnail) {
        const playButton = document.createElement('button');
        playButton.className = 'custom-play-btn';
        playButton.textContent = '弹';
        
        playButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 从链接提取Shorts ID
            const url = thumbnail.href;
            let videoId = null;
            
            if (url) {
                const match = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
                if (match) {
                    videoId = match[1];
                }
            }

            // 在悬浮窗口中播放Shorts
            if (videoId) {
                // 标记为Shorts视频
                playerContainer.dataset.isShorts = 'true';
                
                // 清空播放器容器
                playerContainer.innerHTML = '';

                // 构造播放器URL并传递视频ID参数
                const playerUrl = baseUrl + '?v=' + videoId;

                // 创建iframe元素
                const iframe = document.createElement('iframe');
                iframe.src = playerUrl;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
                iframe.allowFullscreen = true;
                iframe.loading = 'eager';

                // 添加加载事件
                iframe.onload = function() {
                    console.log('播放器页面加载成功，URL: ' + playerUrl);
                };

                iframe.onerror = function() {
                    console.error('播放器页面加载失败，URL: ' + playerUrl);
                    // 显示错误信息
                    playerContainer.innerHTML = `
                        <div style="color: red; text-align: center; padding: 20px;">
                            <p>无法加载播放器页面</p>
                            <p>URL: ${playerUrl}</p>
                            <p>请检查网络连接或稍后重试</p>
                        </div>
                    `;
                };

                // 添加iframe到播放器容器
                playerContainer.appendChild(iframe);

                // 设置播放器尺寸 (保持9:16的Shorts比例)
                const windowHeight = window.innerHeight;
                playerContainer.style.height = `${windowHeight}px`;
                
                // 根据Shorts的9:16比例设置宽度
                const width = windowHeight * 9/16;
                playerContainer.style.width = `${width}px`;

                // 显示播放器容器和遮罩
                playerContainer.style.display = 'block';
                overlay.style.display = 'block';
            }
        };
        container.appendChild(playButton);
    }

    // 添加新窗口按钮（Shorts）
    function addShortsNewWindowButton(container, thumbnail) {
        const newWindowButton = document.createElement('button');
        newWindowButton.className = 'new-window-btn';
        newWindowButton.textContent = '新';
        
        newWindowButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 直接打开原始YouTube Shorts链接
            const url = thumbnail.href;
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        };
        container.appendChild(newWindowButton);
    }

    // 提取视频ID的通用函数
    function extractVideoId(videoElement) {
        let videoId = null;
        const url = videoElement.href;
        
        if (url) {
            // 从URL参数中提取
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v');
            
            // 如果没有找到，尝试从URL路径中提取
            if (!videoId) {
                const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
                if (match) videoId = match[1];
            }
            
            // 从数据属性提取
            if (!videoId) {
                const videoContainer = videoElement.closest('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer');
                if (videoContainer) {
                    // 查找各种可能的数据属性
                    const dataAttrs = ['data-video-id', 'data-context-item-id'];
                    for (const attr of dataAttrs) {
                        videoId = videoContainer.getAttribute(attr);
                        if (videoId) break;
                    }

                    // 从缩略图 src 属性提取
                    if (!videoId) {
                        const img = videoContainer.querySelector('img');
                        if (img && img.src) {
                            const match = img.src.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
                            if (match) videoId = match[1];
                        }
                    }
                }
            }
        }
        
        return videoId;
    }

    // 设置观察器配置，增加属性监听
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'id', 'style']
    });

    // 初始化扫描
    function performInitialScan() {
        // 立即执行一次处理
        const isSubscriptionPage = window.location.href.includes('/feed/subscriptions');
        processRegularVideos(isSubscriptionPage);
        processShortsVideos();
    }

    // 立即执行初始扫描
    performInitialScan();

    // 等待页面加载完成后再次扫描
    setTimeout(() => {
        performInitialScan();
    }, 2000);

    // 更长时间的延时扫描，以防页面加载较慢
    setTimeout(() => {
        performInitialScan();
    }, 5000);

    // 保留点击外部关闭功能
    document.addEventListener('click', (e) => {
        // 关闭播放器
        if (playerContainer.style.display === 'block') {
            const isClickOutside = !playerContainer.contains(e.target) &&
                                 !e.target.classList.contains('custom-play-btn');

            if (isClickOutside) {
                playerContainer.style.display = 'none';
                playerContainer.innerHTML = '';
                overlay.style.display = 'none';
            }
        }

        // 关闭预览
        if (previewContainer.style.display === 'block') {
            const isClickOutside = !previewContainer.contains(e.target) &&
                                 !e.target.classList.contains('thumbnail-btn');

            if (isClickOutside) {
                previewContainer.style.display = 'none';
            }
        }
    });

    // 防止点击播放器内部时触发外部点击事件
    playerContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 添加遮罩点击事件
    overlay.addEventListener('click', () => {
        playerContainer.style.display = 'none';
        playerContainer.innerHTML = '';
        overlay.style.display = 'none';
    });
})();
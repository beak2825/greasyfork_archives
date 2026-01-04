// ==UserScript== 
// @name          Civitai 媒体操作增强 (完整收藏功能 & 全屏图片 - 手机图标常驻，修复点击无反应) 
// @namespace     http://tampermonkey.net/
// @version       2.4.1 // 修复退出全屏需要点击两次的问题
// @description   桌面端鼠标悬停；手机端轻触滑动图片，显示操作图标并保持，直到图片卡片移出屏幕。全屏模式下支持双指缩放和平移，并新增右下角退出按钮。
// @author        Your Name
// @match         https://civitai.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/558965/Civitai%20%E5%AA%92%E4%BD%93%E6%93%8D%E4%BD%9C%E5%A2%9E%E5%BC%BA%20%28%E5%AE%8C%E6%95%B4%E6%94%B6%E8%97%8F%E5%8A%9F%E8%83%BD%20%20%E5%85%A8%E5%B1%8F%E5%9B%BE%E7%89%87%20-%20%E6%89%8B%E6%9C%BA%E5%9B%BE%E6%A0%87%E5%B8%B8%E9%A9%BB%EF%BC%8C%E4%BF%AE%E5%A4%8D%E7%82%B9%E5%87%BB%E6%97%A0%E5%8F%8D%E5%BA%94%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558965/Civitai%20%E5%AA%92%E4%BD%93%E6%93%8D%E4%BD%9C%E5%A2%9E%E5%BC%BA%20%28%E5%AE%8C%E6%95%B4%E6%94%B6%E8%97%8F%E5%8A%9F%E8%83%BD%20%20%E5%85%A8%E5%B1%8F%E5%9B%BE%E7%89%87%20-%20%E6%89%8B%E6%9C%BA%E5%9B%BE%E6%A0%87%E5%B8%B8%E9%A9%BB%EF%BC%8C%E4%BF%AE%E5%A4%8D%E7%82%B9%E5%87%BB%E6%97%A0%E5%8F%8D%E5%BA%94%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Civitai API 端点 (使用 var 避免部分浏览器环境下的 SyntaxError)
    var API_COLLECTION_GET_ALL_USER = 'https://civitai.com/api/trpc/collection.getAllUser?input={"json":{"permissions":["ADD","ADD_REVIEW","MANAGE"],"type":"Image","authed":true}}';
    var API_COLLECTION_SAVE_ITEM = 'https://civitai.com/api/trpc/collection.saveItem';
    var API_TOGGLE_HIDDEN = 'https://civitai.com/api/trpc/hiddenPreferences.toggleHidden';

    // 存储用户收藏夹列表
    var userCollections = [];
    var processedElements = new WeakSet();
    
    // --- 设备识别函数 ---
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 0);
    
    // --- 移动端唤出图标状态 ---
    var touchStartX = 0;
    var touchStartY = 0;
    var TOUCH_MOVE_THRESHOLD = 10; 
    
    // 使用 Map 存储每个卡片的状态，确保状态与元素关联
    var cardStates = new WeakMap();
    // --- Intersection Observer (用于判断元素是否离开视口) ---
    var observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            var cardElement = entry.target;
            
            if (!entry.isIntersecting && cardStates.get(cardElement)) {
                if (entry.boundingClientRect.top > window.innerHeight || entry.boundingClientRect.bottom < 0) {
                     var mediaElement = cardElement.querySelector('img, video');
                     toggleActionIcons(mediaElement, false);
                     cardStates.set(cardElement, false); 
                }
            }
        });
    }, {
        root: null, 
        rootMargin: '0px',
        threshold: 0 
    });
    
    // --- 辅助函数 ---
    function showNotification(message, duration = 1000) {
        var notification = document.getElementById('civitai-custom-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'civitai-custom-notification';
            Object.assign(notification.style, {
                position: 'fixed', top: '20px', right: '20px', backgroundColor: 'rgba(50, 150, 50, 0.9)', color: 'white',
                padding: '10px 15px', borderRadius: '5px', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease-in-out',
                fontSize: '1em', pointerEvents: 'none'
            });
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.style.opacity = '1';
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) { notification.parentNode.removeChild(notification); }
            }, 300);
        }, duration);
    }
    
    function createIcon(iconHTML, title, onClickHandler, mediaLinkHref) {
        var icon = document.createElement('div');
        icon.className = 'civitai-action-icon';
        icon.title = title;
        icon.innerHTML = iconHTML;
        icon.style.cursor = 'pointer';
        icon.style.marginLeft = '5px';
        icon.style.marginRight = '5px';
        icon.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        icon.style.padding = '5px';
        icon.style.borderRadius = '3px';
        icon.style.color = 'white';
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        if (mediaLinkHref) { icon.dataset.mediaLinkHref = mediaLinkHref;
        }
        
        var handleEvent = (e) => {
            e.stopPropagation();
            e.preventDefault();
            onClickHandler(e);
        };

        if (isMobile) {
            icon.addEventListener('touchend', handleEvent, { passive: false });
        } else {
            icon.addEventListener('click', handleEvent);
        }
        
        return icon;
    }
    
    function getMediaInfoFromHref(href) {
        var mediaId = null;
        var mediaType = null;
        var imageMatch = href.match(/\/images\/(\d+)/);
        if (imageMatch && imageMatch[1]) { mediaId = parseInt(imageMatch[1]); mediaType = 'Image';
        }
        else {
            var modelMatch = href.match(/\/models\/(\d+)/);
            if (modelMatch && modelMatch[1]) { mediaId = parseInt(modelMatch[1]); mediaType = 'Model';
            }
        }
        return { mediaId, mediaType };
    }

    // --- 核心功能函数 (收藏和屏蔽) ---
    async function fetchUserCollections() {
        if (userCollections.length > 0) return userCollections;
         return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: API_COLLECTION_GET_ALL_USER,
                onload: function(response) {
                    try {
                        var data = JSON.parse(response.responseText);
                        if (data && data.result && data.result.data && data.result.data.json) {
                            userCollections = data.result.data.json;
                            resolve(userCollections);
                        } else { console.error('获取收藏夹列表失败'); reject(new Error('数据结构不符合预期')); }
                    } catch (e) { console.error('解析收藏夹列表响应失败:', e); reject(new Error('解析响应失败')); }
                },
                onerror: function(error) { console.error('获取收藏夹列表失败', error); reject(new Error('网络错误或API错误')); }
            });
        }).catch(error => { console.error('收藏夹获取失败:', error); return []; });
    }

    async function handleAddToCollection(event) {
        var icon = event.currentTarget;
        var mediaLinkHref = icon.dataset.mediaLinkHref;
        if (!mediaLinkHref) { console.error('未能获取图片/视频链接，无法收藏。'); return; }
        var dropdown = icon.querySelector('.civitai-collection-dropdown');
        if (dropdown) { dropdown.remove(); return; }
        var { mediaId, mediaType } = getMediaInfoFromHref(mediaLinkHref);
        if (!mediaId || !mediaType) { console.error('未能获取图片/视频的ID或类型，无法执行收藏操作。'); return; }
        var collections = await fetchUserCollections();
        if (collections.length === 0) { showNotification('未找到可用的收藏夹。', 2000); return; }
        dropdown = document.createElement('div');
        dropdown.className = 'civitai-collection-dropdown';
        Object.assign(dropdown.style, { position: 'absolute', backgroundColor: '#333', border: '1px solid #555', borderRadius: '3px', padding: '5px', zIndex: '1000', minWidth: '120px', top: 'auto', bottom: '100%', marginBottom: '5px', left: '0' });
        collections.forEach(collection => {
            var item = document.createElement('div');
            item.textContent = collection.name;
            Object.assign(item.style, { padding: '5px', cursor: 'pointer', color: 'white' });
            item.addEventListener('mouseover', () => item.style.backgroundColor = '#555');
            item.addEventListener('mouseout', () => item.style.backgroundColor = 'transparent');
            
            var handleDropdownClick = (e) => {
                e.stopPropagation(); e.preventDefault();
                addToCollection(mediaId, mediaType, collection.id);
                dropdown.remove();
            };
          
            if (isMobile) {
                 item.addEventListener('touchend', handleDropdownClick, { passive: false });
            } else {
                 item.addEventListener('click', handleDropdownClick);
            }

            dropdown.appendChild(item);
        });
        icon.style.position = 'relative';
        icon.appendChild(dropdown);
        
        var clickOutsideHandler = (e) => {
            if (!dropdown.contains(e.target) && !icon.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener(isMobile ? 'touchend' : 'click', clickOutsideHandler);
            }
        };
        document.addEventListener(isMobile ? 'touchend' : 'click', clickOutsideHandler, { passive: false });
    }
    
    async function addToCollection(mediaId, mediaType, collectionId) {
         var requestBody = {
            json: {
                imageId: mediaId, type: mediaType,
                collections: [{ collectionId: collectionId, read: "Private" }],
                removeFromCollectionIds: [], authed: true
            }
        };
        if (mediaType === 'Model') {
            requestBody.json.modelId = requestBody.json.imageId;
            delete requestBody.json.imageId;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST', url: API_COLLECTION_SAVE_ITEM,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(requestBody),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        showNotification('已添加到收藏夹！'); 
                        resolve(response);
                    } else {
                        try {
                            var errorData = JSON.parse(response.responseText);
                            console.error(`收藏失败: ${response.status} - ${errorData.message || '未知错误'}`);
                            showNotification(`收藏失败: ${errorData.message || '未知错误'}`, 3000); 
                            reject(new Error(`收藏失败: ${response.status}`));
                        } catch (e) {
                            console.error(`收藏失败: ${response.status} - 无法解析错误信息。`);
                            showNotification('收藏失败: 无法解析错误信息', 3000); 
                            reject(new Error(`无法解析错误信息: ${response.status}`));
                        }
                    }
                },
                onerror: function(error) {
                    console.error('收藏过程中发生网络错误或程序错误。', error);
                    showNotification('收藏失败: 网络错误', 3000);
                    reject(new Error('网络错误或请求失败'));
                }
            });
        });
    }

    async function handleBlockMedia(event) {
        var icon = event.currentTarget;
        var mediaLinkHref = icon.dataset.mediaLinkHref;
        if (!mediaLinkHref) { console.error('未能获取图片/视频链接，无法屏蔽。'); return; }
        var { mediaId, mediaType } = getMediaInfoFromHref(mediaLinkHref);
        if (!mediaId || mediaType !== 'Image') { console.error('未能获取有效的图片ID或不是图片类型，无法屏蔽。'); return; }
        
        var cardContainer = icon.closest('.relative.flex.overflow-hidden.rounded-md.border-gray-3, .mantine-Paper-root, .mantine-Card-root, .relative.overflow-hidden.rounded-md');
        if (!cardContainer) { console.error('未能找到图片卡片容器，无法触发屏蔽图片菜单。'); return; }
        var threeDotsButton = cardContainer.querySelector('button.mantine-ActionIcon-root[aria-haspopup="menu"]');
        if (!threeDotsButton) { showNotification('未能找到 Civitai 菜单按钮，请尝试更新脚本。', 3000); return; }
        
        threeDotsButton.click();
        var menuDropdownSelector = '.mantine-Menu-dropdown[role="menu"]';
        var menuDropdown = null;
        var attempts = 0;
        while (!menuDropdown && attempts < 15) { await new Promise(resolve => setTimeout(resolve, 100)); menuDropdown = document.querySelector(menuDropdownSelector); attempts++;
        }
        if (!menuDropdown) { showNotification('Civitai 菜单未能及时出现，请重试。', 3000); threeDotsButton.click(); return;
        }

        var hideImageItem = Array.from(menuDropdown.querySelectorAll('button.mantine-Menu-item'))
                                         .find(item => {
                                             var label = item.querySelector('.mantine-Menu-itemLabel');
                                             return label && label.textContent.trim().replace(/\s+/g, ' ') === 'Hide this image';
                                         });
        if (!hideImageItem) { showNotification('未能找到“Hide this image”选项，请尝试更新脚本。', 3000); threeDotsButton.click(); return; }

        hideImageItem.click();
        showNotification('图片已成功屏蔽！', 1500);
    }

    async function handleBlockPublisher(event) {
        var icon = event.currentTarget;
        var cardContainer = icon.closest('.relative.flex.overflow-hidden.rounded-md.border-gray-3, .mantine-Paper-root, .mantine-Card-root, .relative.overflow-hidden.rounded-md');
        if (!cardContainer) { console.error('未能找到图片卡片容器，无法触发屏蔽发布者菜单。'); return; }
        var threeDotsButton = cardContainer.querySelector('button.mantine-ActionIcon-root[aria-haspopup="menu"]');
        if (!threeDotsButton) { console.error('未能找到 Civitai 原生菜单按钮，无法屏蔽发布者。'); return; }
        
        threeDotsButton.click();
        var menuDropdownSelector = '.mantine-Menu-dropdown[role="menu"]';
        var menuDropdown = null;
        var attempts = 0;
        while (!menuDropdown && attempts < 10) { await new Promise(resolve => setTimeout(resolve, 100)); menuDropdown = document.querySelector(menuDropdownSelector); attempts++;
        }
        if (!menuDropdown) { console.error('Civitai 菜单未能及时出现，请重试。'); return;
        }

        var hideUserItem = Array.from(menuDropdown.querySelectorAll('button.mantine-Menu-item'))
                                     .find(item => {
                                         var label = item.querySelector('.mantine-Menu-itemLabel');
                                         return label && label.textContent.trim().replace(/\s+/g, ' ') === 'Hide content from this user';
                                     });
        if (!hideUserItem) { console.error('未能找到 Civitai 菜单中的“Hide content from this user”选项。 Civitai页面结构可能已更改。'); threeDotsButton.click(); return; }
        hideUserItem.click();
        console.log('已模拟点击 Civitai 原生“Hide content from this user”按钮。');
    }

    var IMAGE_TYPE_FALLBACK = [
        { from: ".jpg", to: ".png" },
        { from: ".png", to: ".jpeg" },
        { from: ".jpeg", to: ".gif" }
    ];
    function tryToGetOriginalUrl(mediaSrc, tagName) {
        var initialUrl = mediaSrc.replace("width=","original=true,width0=");
        if (tagName === 'VIDEO') {
            return new Promise(resolve => {
                var videoUrl = initialUrl.replace("anim=false","anim=true").replace(".jpeg",".webm");
                var tempVideo = document.createElement('video');
                tempVideo.src = videoUrl;
                
                var originalError = () => {
                    var fallbackUrl = videoUrl.replace("original=true,","").replace("skip=,","skip0=");
                    console.warn(`[Civitai Script] 视频加载失败 (${videoUrl}), 尝试回退到: ${fallbackUrl}`);
                    tempVideo.removeEventListener('error', originalError);
                  
                    tempVideo.src = fallbackUrl;
                    
                    var fallbackError = () => {
                        console.error('[Civitai Script] 视频回退加载失败。');
                        tempVideo.removeEventListener('error', fallbackError);
                        resolve(mediaSrc);
                        tempVideo.remove();
                    };
                    tempVideo.addEventListener('error', fallbackError, { once: true });
                    tempVideo.addEventListener('loadeddata', () => {
                        resolve(fallbackUrl);
                        tempVideo.remove();
                    }, { once: true });
                    tempVideo.load();
                };
                
                tempVideo.addEventListener('error', originalError, { once: true });
                tempVideo.addEventListener('loadeddata', () => {
                    resolve(videoUrl);
                    tempVideo.remove();
                }, { once: true });
                tempVideo.load();
            });

        } else if (tagName === 'IMG') {
            return new Promise(resolve => {
                var currentUrl = initialUrl;
                var attemptIndex = 0;
                var tempImg = new Image();
                
                var handleError = () => {
                    if (attemptIndex < IMAGE_TYPE_FALLBACK.length) {
                        var fallback = IMAGE_TYPE_FALLBACK[attemptIndex];
                        currentUrl = currentUrl.replace(fallback.from, fallback.to);
   
                        attemptIndex++;
                        console.warn(`[Civitai Script] 图片加载失败 (${IMAGE_TYPE_FALLBACK[attemptIndex-1].from}), 尝试回退到: ${fallback.to}`);
                        tempImg.src = currentUrl;
                    } else {
                        console.error('[Civitai Script] 图片所有类型回退加载失败。');
                        tempImg.removeEventListener('error', handleError);
                        resolve(mediaSrc);
                    }
                };

                tempImg.onload = () => {
                    tempImg.removeEventListener('error', handleError);
                    resolve(currentUrl);
                    tempImg = null;
                };

                tempImg.onerror = handleError;
                tempImg.src = currentUrl;
            });
        }
        
        return Promise.resolve(initialUrl);
    }


    // --- 全屏功能逻辑 (修复 Permissions check failed) ---
    
    async function handleFullscreenImage(event) {
        var icon = event.currentTarget;
        var cardContainer = icon.closest('.relative.flex.overflow-hidden.rounded-md.border-gray-3, .mantine-Paper-root, .mantine-Card-root, .relative.overflow-hidden.rounded-md');
        var mediaElement = cardContainer ? cardContainer.querySelector('img, video') : null;
        if (!mediaElement) {
            console.error('未能找到图片或视频元素，无法全屏。');
            return;
        }

        var tagName = mediaElement.tagName.toLowerCase();
        var mediaSrc = mediaElement.currentSrc || mediaElement.src;
        
        // --- 缩放和平移状态 ---
        var currentScale = 1.0;
        var scaleStep = 0.25; 
        var minScale = 0.25;
        var maxScale = 5.0;

        var currentX = 0;
        var currentY = 0;
        var startX = 0;
        var startY = 0;
        var isDragging = false;
        // 移动端缩放/平移状态
        var initialDistance = 0;
        var initialScale = 1.0;
        var touchStartPanX = 0;
        var touchStartPanY = 0;
        
        var useTouchEvents = isMobile;
        
        // 1. 创建全屏容器
        var fullscreenContainer = document.createElement('div');
        fullscreenContainer.id = 'civitai-full-screen-wrapper';
        Object.assign(fullscreenContainer.style, {
            position: 'fixed', top: '0', left: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: '99999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        });
        document.body.appendChild(fullscreenContainer); 

        // --- 新增: 创建退出按钮 ---
        var exitButton = document.createElement('div');
        exitButton.innerHTML = '&#10005; 退出全屏';
        Object.assign(exitButton.style, {
            position: 'absolute',
            bottom: '20px', 
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            zIndex: '999999',
            cursor: 'pointer',
            fontSize: '1em',
            userSelect: 'none',
            opacity: '0.8',
            transition: 'opacity 0.2s ease-in-out'
        });
        exitButton.addEventListener('mouseenter', () => exitButton.style.opacity = '1');
        exitButton.addEventListener('mouseleave', () => exitButton.style.opacity = '0.8');

        fullscreenContainer.appendChild(exitButton);
        // -----------------------------


        // 2. 创建用于显示媒体的元素
        var fullMedia = document.createElement(tagName);
        Object.assign(fullMedia.style, {
            maxWidth: '100%', 
            maxHeight: '100%',
            width: 'auto', 
            height: 'auto',
            objectFit: 'contain', 
            transition: 'transform 0.1s ease-out', 
            cursor: 'grab', 
            transform: `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`,
            touchAction: 'none',
            opacity: '0.3', // 初始半透明，等待原图加载
        });
        fullscreenContainer.appendChild(fullMedia);
        
        // --- 核心更新函数 ---
        function updateTransform() {
            currentScale = Math.min(maxScale, Math.max(minScale, currentScale));
            if (currentScale <= 1.0) { 
                 currentX = 0;
                 currentY = 0;
                 currentScale = 1.0; 
            }

            fullMedia.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
        }
        
        // --- 移动端辅助函数 ---
        function getDistance(touches) {
            return Math.sqrt(Math.pow(touches[0].clientX - touches[1].clientX, 2) +
                             Math.pow(touches[0].clientY - touches[1].clientY, 2));
        }

        function getCenter(touches) {
            return {
                x: (touches[0].clientX + touches[1].clientX) / 2,
                y: (touches[0].clientY + touches[1].clientY) / 2
            };
        }


        // 3. 缩放功能实现 (滚轮/双指缩放)
        
        // 滚轮缩放 (PC端)
        function handleWheel(e) {
            e.preventDefault();
            var delta = Math.sign(e.deltaY);
            
            if (delta < 0) {
                currentScale = Math.min(maxScale, currentScale + scaleStep); 
            } else {
                currentScale = Math.max(minScale, currentScale - scaleStep); 
            }
            
            updateTransform();
            fullMedia.style.cursor = currentScale > 1.0 ? 'grab' : 'zoom-out'; 
        }

        // 4. 拖动功能实现 (鼠标/单指/双指平移)
        function getCoords(e) {
            return e.touches ?
            { 
                clientX: e.touches.length === 2 ?
                getCenter(e.touches).x : e.touches[0].clientX,
                clientY: e.touches.length === 2 ?
                getCenter(e.touches).y : e.touches[0].clientY
            } : e;
        }
        
        function handleStart(e) {
            e.preventDefault();
            if (useTouchEvents && e.touches.length === 2) { 
                initialDistance = getDistance(e.touches);
                initialScale = currentScale; 
                var center = getCenter(e.touches);
                touchStartPanX = center.x;
                touchStartPanY = center.y;
                isDragging = false;
            } else if ((!useTouchEvents || e.touches.length === 1) && currentScale > 1.0) { 
                isDragging = true; 
                fullMedia.style.cursor = 'grabbing';
                var coords = getCoords(e);
                startX = coords.clientX;
                startY = coords.clientY;
            } else if (useTouchEvents && e.touches.length === 1) { 
            }
        }
        
        function handleMove(e) {
            e.preventDefault(); 
            if (useTouchEvents && e.touches.length === 2) {
                var newDistance = getDistance(e.touches);
                currentScale = initialScale * (newDistance / initialDistance); 
                
                var center = getCenter(e.touches);
                var dx = center.x - touchStartPanX;
                var dy = center.y - touchStartPanY; 
                
                currentX += dx / currentScale; 
                currentY += dy / currentScale;

                touchStartPanX = center.x;
                touchStartPanY = center.y;

                updateTransform();
            } else if (isDragging && (!useTouchEvents || e.touches.length === 1)) { 
                var coords = getCoords(e);
                var dx = coords.clientX - startX; 
                var dy = coords.clientY - startY;
                
                currentX += dx / currentScale; 
                currentY += dy / currentScale;
                
                startX = coords.clientX;
                startY = coords.clientY;

                updateTransform();
            }
        }

        function handleEnd() {
            isDragging = false;
            initialDistance = 0; 
            initialScale = currentScale;

            if (currentScale > 1.0) {
                fullMedia.style.cursor = 'grab';
            } else {
                fullMedia.style.cursor = 'zoom-out';
                currentScale = 1.0; 
                currentX = 0;
                currentY = 0;
                updateTransform();
            }
        }
        
        // 5. 挂载事件监听器
        function addListeners() {
            if (!useTouchEvents) {
                fullscreenContainer.addEventListener('wheel', handleWheel, { passive: false });
                fullMedia.addEventListener('mousedown', handleStart);
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', handleEnd);
            } else {
                fullMedia.addEventListener('touchstart', handleStart, { passive: false });
                document.addEventListener('touchmove', handleMove, { passive: false });
                document.addEventListener('touchend', handleEnd);
                
                // 移动端双击放大/缩小
                fullMedia.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    if (currentScale < 1.0 + scaleStep / 2) { 
                        currentScale = 1.0 + scaleStep; 
                    } else {
                        currentScale = Math.max(1.0, currentScale - scaleStep); 
                    }
                    currentX = 0;
                    currentY = 0;
                    updateTransform();
                });
            }
        }


        // 6. 请求真正的全屏模式
        function cleanup() {
            exitButton.removeEventListener('click', closeFullscreen); 

            if (fullscreenContainer.parentNode) {
                if (tagName === 'video') fullMedia.pause(); 
                fullscreenContainer.parentNode.removeChild(fullscreenContainer); 
            }
            // 移除全屏事件监听器
            document.removeEventListener('fullscreenchange', handleExit);
            fullscreenContainer.removeEventListener('click', closeFullscreen);
            
            // 移除所有缩放/平移事件
            fullscreenContainer.removeEventListener('wheel', handleWheel); 
            fullMedia.removeEventListener('mousedown', handleStart);
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            fullMedia.removeEventListener('touchstart', handleStart);
            document.removeEventListener('touchmove', handleMove);
            fullMedia.removeEventListener('touchend', handleEnd);
            fullMedia.removeEventListener('dblclick', handleWheel); 
            console.log("Cleanup: 全屏容器和所有事件已移除。");
        }

        // --- 核心修复函数：确保一次点击退出 ---
        function closeFullscreen() {
            if (document.fullscreenElement === fullscreenContainer) { 
                // 1. 如果当前处于原生全屏，则尝试退出原生全屏。
                document.exitFullscreen();
                // 退出原生全屏后，浏览器会异步触发 'fullscreenchange' 事件，
                // 进而调用 handleExit -> cleanup() 来移除 DOM 容器。
            } else {
                // 2. 如果当前已经不是原生全屏 (例如，异步事件已经执行了一半，或用户点击了两次)，
                //    则直接清理 DOM 容器，确保第二次点击能立即关闭。
                cleanup();
            }
        }
        
        var handleExit = () => {
             // 只有当 fullscreenElement 不是我们的容器时，才执行清理
             if (document.fullscreenElement !== fullscreenContainer) { 
                 cleanup();
            }
        };
        // 绑定全屏退出事件：用于系统按键 (Esc) 或浏览器操作退出
        document.addEventListener('fullscreenchange', handleExit, { once: true });
        
        // 绑定全屏容器点击事件：点击黑色背景退出
        fullscreenContainer.addEventListener('click', (e) => { 
            if (e.target === fullscreenContainer) {
                closeFullscreen();
            }
        });

        // 绑定退出按钮点击事件：点击按钮退出
        exitButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeFullscreen();
        });
        
        
        // --- 修复 Permissions check failed 核心逻辑：立即请求全屏 ---
        if (fullscreenContainer.requestFullscreen) { 
            fullscreenContainer.requestFullscreen() // 立即请求全屏
            .then(async () => {
                // 全屏成功后，再执行耗时的原图加载
                var originalUrl = await tryToGetOriginalUrl(mediaSrc, mediaElement.tagName);
                
                if (tagName === 'img') {
                    fullMedia.src = originalUrl;
                } else if (tagName === 'video') {
                    fullMedia.src = originalUrl;
                    fullMedia.controls = true;
                    fullMedia.autoplay = true;
                    fullMedia.loop = true;
                    fullMedia.muted = true;
                }
                
                // 加载完成后再添加缩放事件，并显示图片
                var mediaLoadHandler = () => {
                    fullMedia.style.opacity = '1';
                    addListeners();
                    fullMedia.removeEventListener('load', mediaLoadHandler);
                    fullMedia.removeEventListener('loadeddata', mediaLoadHandler);
                };
                
                if (tagName === 'img') {
                    fullMedia.addEventListener('load', mediaLoadHandler);
                } else if (tagName === 'video') {
                    fullMedia.addEventListener('loadeddata', mediaLoadHandler);
                }
                
                // 如果是图片，并且图片已经加载（缓存），则手动触发加载处理
                if (tagName === 'img' && fullMedia.complete) {
                    mediaLoadHandler();
                }

                console.log(`全屏成功。开始加载媒体。最终加载 URL: ${originalUrl}`);
            })
            .catch(err => {
                console.error("请求全屏失败：", err);
                showNotification("请求全屏权限失败，请确保由用户手势触发。", 3000);
                cleanup(); 
            });
        } else {
            console.error("您的浏览器不支持 Fullscreen API。");
            showNotification("浏览器不支持真正的全屏模式。", 3000); 
            cleanup();
            return;
        }
    }


    // --- 页面元素处理和观察器 (与 2.4.0 保持一致) ---
    
    function toggleActionIcons(mediaElement, show) {
        var cardLikeElement = mediaElement.closest('.relative.flex.overflow-hidden.rounded-md.border-gray-3, .mantine-Paper-root, .mantine-Card-root, .relative.overflow-hidden.rounded-md');
        var targetElement = cardLikeElement || mediaElement;
        
        if (!targetElement) return; 

        var actionContainer = targetElement.querySelector('.civitai-action-container');
        if (!actionContainer) { 
            if (show) {
                actionContainer = document.createElement('div');
                actionContainer.className = 'civitai-action-container'; 
                Object.assign(actionContainer.style, {
                    position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', justifyContent: 'center', zIndex: '999', pointerEvents: 'none'
                });
                var mediaLinkHref = mediaElement.src; 
                var parentLink = mediaElement.closest('a[href*="/images/"], a[href*="/models/"]');
                if (parentLink && parentLink.href) {
                    mediaLinkHref = parentLink.href; 
                }

                var favoriteIcon = createIcon('&#9733;', '添加到收藏夹', handleAddToCollection, mediaLinkHref); 
                var blockMediaIcon = createIcon('&#128581;', '屏蔽图片/视频', handleBlockMedia, mediaLinkHref);
                var blockPublisherIcon = createIcon('&#128100;', '屏蔽发布者', handleBlockPublisher, mediaLinkHref);
                var fullscreenIcon = createIcon('&#128269;', '全屏查看图片 (原图)', handleFullscreenImage, mediaLinkHref); 

                actionContainer.appendChild(favoriteIcon);
                actionContainer.appendChild(blockMediaIcon);
                actionContainer.appendChild(blockPublisherIcon);
                actionContainer.appendChild(fullscreenIcon);

                targetElement.style.position = 'relative';
                targetElement.appendChild(actionContainer);
            } else {
                return;
            }
        }
        
        if (show) {
            actionContainer.style.opacity = '1';
            actionContainer.style.pointerEvents = 'auto'; 
            actionContainer.style.display = 'flex';
        } else {
            var dropdown = actionContainer.querySelector('.civitai-collection-dropdown');
            if (!dropdown) { 
                actionContainer.style.opacity = '0'; 
                actionContainer.style.pointerEvents = 'none';
                setTimeout(() => { if (actionContainer.style.opacity === '0') actionContainer.style.display = 'none'; }, 300); 
            }
        }
    }


    // --- 移动端轻触滑动唤出图标逻辑 (与 2.4.0 保持一致) ---
    
    function handleTouchStart(e) {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX; 
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        var cardLikeElement = e.currentTarget;
        var mediaElement = cardLikeElement.querySelector('img, video'); 
        
        if (cardStates.get(cardLikeElement)) return;
        if (e.touches.length !== 1) return; 

        var currentX = e.touches[0].clientX;
        var currentY = e.touches[0].clientY;
        
        var dx = Math.abs(currentX - touchStartX);
        var dy = Math.abs(currentY - touchStartY); 

        if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) {
            toggleActionIcons(mediaElement, true);
            cardStates.set(cardLikeElement, true); 
            
            e.preventDefault(); 
            e.stopPropagation();
        }
    }
    
    function handleTouchEnd(e) {
        var cardLikeElement = e.currentTarget;
        var actionContainer = cardLikeElement.querySelector('.civitai-action-container'); 
        
        if (cardStates.get(cardLikeElement)) {
            var clickedOnIcon = e.target.closest('.civitai-action-icon') ||
            e.target.closest('.civitai-collection-dropdown'); 

            if (clickedOnIcon) {
                e.preventDefault(); 
                e.stopPropagation();
                return;
            } 
            
            if (actionContainer && actionContainer.style.opacity === '1') {
                e.preventDefault(); 
                e.stopPropagation();
            }
        }
    }
    
    // 适配器
    function processMediaElement(mediaElement) {
        var cardLikeElement = mediaElement.closest('.relative.flex.overflow-hidden.rounded-md.border-gray-3, .mantine-Paper-root, .mantine-Card-root, .relative.overflow-hidden.rounded-md');
        var elementToAttachListeners = cardLikeElement || mediaElement; 

        if (elementToAttachListeners && !processedElements.has(elementToAttachListeners)) {
            processedElements.add(elementToAttachListeners);
            cardStates.set(elementToAttachListeners, false); 

            if (isMobile) {
                elementToAttachListeners.addEventListener('touchstart', handleTouchStart, { passive: true });
                elementToAttachListeners.addEventListener('touchmove', handleTouchMove, { passive: false }); 
                elementToAttachListeners.addEventListener('touchend', handleTouchEnd, { passive: false });
                observer.observe(elementToAttachListeners); 
            } else {
                elementToAttachListeners.addEventListener('mouseenter', () => toggleActionIcons(mediaElement, true));
                elementToAttachListeners.addEventListener('mouseleave', () => toggleActionIcons(mediaElement, false)); 
            }
        }
    }

    setInterval(() => {
        var selectors = '.relative.flex.overflow-hidden.rounded-md.border-gray-3, .mantine-Paper-root, .mantine-Card-root, .relative.overflow-hidden.rounded-md';
        
        document.querySelectorAll(selectors).forEach((cardElement) => {
             var mediaElement = cardElement.querySelector('img, video');
             if (mediaElement) {
                processMediaElement(mediaElement); 
             }
        });
    }, 500);
    // --- 样式 (与 2.4.0 保持一致) ---
    var style = document.createElement('style'); 
    style.textContent =
        /* 保持原有图标和下拉菜单样式 */
        `
        .civitai-action-container {
            display: none;
            transition: opacity 0.2s ease-in-out; 
            opacity: 0;
            pointer-events: none;
        }
        
        /* 桌面端：只在悬停时显示 */
        .relative.flex.overflow-hidden.rounded-md.border-gray-3:hover > .civitai-action-container,
        .mantine-Paper-root:hover > .civitai-action-container,
        .mantine-Card-root:hover > .civitai-action-container {
            opacity: 1;
            pointer-events: auto; 
            display: flex;
        }
        
        /* 移动端和下拉菜单打开时，强制显示 */
        .civitai-action-container[style*="opacity: 1"] {
            opacity: 1 !important;
            pointer-events: auto !important; 
            display: flex !important;
        }
        .civitai-action-container:has(.civitai-collection-dropdown) {
            opacity: 1 !important;
            pointer-events: auto !important; 
            display: flex !important;
        }
        .civitai-action-icon {
            font-size: 1.2em;
            text-shadow: 0px 0px 3px black; 
        }
        .civitai-collection-dropdown {
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            max-height: 200px; 
            overflow-y: auto;
            background-color: #333;
            color: white;
            padding: 5px;
            border-radius: 3px; 
        }
        .civitai-collection-dropdown div:hover {
            background-color: #555; 
        }

        /* Fullscreen API 激活时的样式，确保全屏容器覆盖整个屏幕 */
        #civitai-full-screen-wrapper:-webkit-full-screen {
            width: 100%;
            height: 100%; 
        }
        #civitai-full-screen-wrapper:-moz-full-screen {
            width: 100%;
            height: 100%; 
        }
        #civitai-full-screen-wrapper:-ms-fullscreen {
            width: 100%;
            height: 100%; 
        }
        #civitai-full-screen-wrapper:fullscreen {
            width: 100%;
            height: 100%; 
        }

        /* 全屏退出按钮样式 */
        #civitai-full-screen-wrapper div:last-child {
            /* 确保退出按钮不受 transform 影响，保持在右下角 */
            position: absolute !important;
        }
        `;
    document.head.appendChild(style);

    fetchUserCollections();

})();
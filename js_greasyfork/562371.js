// ==UserScript==
// @name         抖音巨量百应商品下载脚本
// @namespace    http://haah.net/
// @version      0.1
// @description  下载抖音巨量百应选品广场商品的轮播图、视频和带货内容视频
// @author       辉哥
// @match        https://buyin.jinritemai.com/dashboard/merch-picking-library/merch-promoting*commodity_id*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/562371/%E6%8A%96%E9%9F%B3%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E5%95%86%E5%93%81%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/562371/%E6%8A%96%E9%9F%B3%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E5%95%86%E5%93%81%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮容器
    const createDownloadButton = (text, onClick) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '8px 16px';
        button.style.margin = '8px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        return button;
    };

    // 下载文件（使用GM_xmlhttpRequest绕过CORS限制）
    const downloadFile = (url, filename) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            headers: {
                'Referer': window.location.href,
                'User-Agent': navigator.userAgent
            },
            onload: (response) => {
                if (response.status === 200) {
                    const blob = response.response;
                    const objectUrl = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = objectUrl;
                    a.download = filename;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    URL.revokeObjectURL(objectUrl);
                }
            }
        });
    };



    // 获取轮播图（支持图片和视频混合）
    const getCarouselItems = () => {
        const carousel = document.querySelector('.slick-track');
        if (!carousel) return [];
        
        const items = [];
        const slideElements = carousel.querySelectorAll('.slick-slide');
        
        slideElements.forEach((slide, index) => {
            // 查找图片元素
            const imgElement = slide.querySelector('img');
            if (imgElement && imgElement.src) {
                // 处理图片URL，去除签名参数
                const cleanUrl = imgElement.src.split('?')[0];
                
                // 识别图片格式
                let ext = 'jpg';
                if (cleanUrl.includes('jpeg_m_')) {
                    ext = 'jpg';
                } else if (cleanUrl.includes('png_m_')) {
                    ext = 'png';
                } else if (cleanUrl.includes('gif_m_')) {
                    ext = 'gif';
                } else {
                    // 尝试从URL中提取扩展名
                    const urlParts = cleanUrl.split('.');
                    if (urlParts.length > 1) {
                        const lastPart = urlParts.pop();
                        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(lastPart.toLowerCase())) {
                            ext = lastPart.toLowerCase();
                        }
                    }
                }
                
                items.push({ 
                    type: 'image', 
                    url: cleanUrl, 
                    filename: `轮播项_${index + 1}.${ext}` 
                });
            }
            
            // 查找视频元素
            const videoElement = slide.querySelector('video');
            if (videoElement && videoElement.src) {
                items.push({ 
                    type: 'video', 
                    url: videoElement.src, 
                    filename: `轮播视频_${index + 1}.mp4` 
                });
            }
        });
        return items;
    };

    // 获取商品视频
    const getProductVideos = () => {
        const videos = [];
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach((video, index) => {
            if (video.src) {
                videos.push({ url: video.src, filename: `商品视频_${index + 1}.mp4` });
            }
        });
        return videos;
    };

    // 获取带货内容视频
    const getPromotionVideos = (limit = 0) => {
        const videos = [];
        const videoElements = document.querySelectorAll('video[mediatype="video"]');
        
        // 限制下载数量
        const maxVideos = limit > 0 ? limit : videoElements.length;
        
        videoElements.forEach((video, index) => {
            if (index < maxVideos && video.src) {
                // 处理视频URL，去除签名参数
                const cleanUrl = video.src.split('?')[0];
                videos.push({ url: cleanUrl, filename: `带货视频_${index + 1}.mp4` });
            }
        });
        return videos;
    };

    // 下载所有轮播项（图片和视频）
    const downloadAllCarouselItems = () => {
        const items = getCarouselItems();
        items.forEach(item => downloadFile(item.url, item.filename));
        alert(`已开始下载 ${items.length} 个轮播项`);
    };

    // 下载所有商品视频
    const downloadAllProductVideos = () => {
        const videos = getProductVideos();
        videos.forEach(video => downloadFile(video.url, video.filename));
        alert(`已开始下载 ${videos.length} 个商品视频`);
    };

    // 下载所有带货视频
    const downloadAllPromotionVideos = () => {
        const videos = getPromotionVideos();
        videos.forEach(video => downloadFile(video.url, video.filename));
        alert(`已开始下载 ${videos.length} 个带货视频`);
    };

    // 保存设置到本地存储
    const saveSettings = (key, value) => {
        localStorage.setItem('douyin_downloader_' + key, JSON.stringify(value));
    };

    // 从本地存储加载设置
    const loadSettings = (key, defaultValue) => {
        const value = localStorage.getItem('douyin_downloader_' + key);
        return value ? JSON.parse(value) : defaultValue;
    };

    // 下载前N个带货视频
    const downloadTopPromotionVideos = (limit) => {
        const videos = getPromotionVideos(limit);
        videos.forEach(video => downloadFile(video.url, video.filename));
        alert(`已开始下载前 ${videos.length} 个带货视频`);
    };

    // 初始化脚本
    const init = () => {
        // 等待页面加载完成
        setTimeout(() => {
            // 加载保存的位置
            const savedPosition = loadSettings('button_container_position', { top: '50%', right: '0px' });
            
            // 创建侧边图标容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'fixed';
            buttonContainer.style.top = savedPosition.top;
            buttonContainer.style.right = savedPosition.right;
            buttonContainer.style.transform = savedPosition.top === '50%' ? 'translateY(-50%)' : 'none';
            buttonContainer.style.zIndex = '9999';
            buttonContainer.style.backgroundColor = '#007bff';
            buttonContainer.style.borderRadius = '8px 0 0 8px';
            buttonContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            buttonContainer.style.cursor = 'move';
            buttonContainer.style.transition = 'all 0.3s ease';
            
            // 添加图标
            const icon = document.createElement('div');
            icon.innerHTML = '&#128221;'; // 下载图标
            icon.style.fontSize = '24px';
            icon.style.color = 'white';
            icon.style.padding = '10px';
            buttonContainer.appendChild(icon);
            
            // 创建按钮面板
            const buttonPanel = document.createElement('div');
            buttonPanel.style.display = 'none';
            buttonPanel.style.backgroundColor = 'white';
            buttonPanel.style.padding = '10px';
            buttonPanel.style.borderRadius = '8px 0 0 8px';
            buttonPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            buttonPanel.style.minWidth = '200px';
            buttonContainer.appendChild(buttonPanel);
            
            // 鼠标悬停事件
            buttonContainer.addEventListener('mouseenter', () => {
                buttonPanel.style.display = 'block';
            });
            
            // 鼠标离开事件
            buttonContainer.addEventListener('mouseleave', () => {
                buttonPanel.style.display = 'none';
            });
            
            // 添加拖拽功能
            let isDragging = false;
            let offsetX, offsetY;
            
            buttonContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = buttonContainer.getBoundingClientRect();
                offsetX = e.clientX - rect.right;
                offsetY = e.clientY - rect.top;
                buttonContainer.style.cursor = 'grabbing';
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const newRight = Math.max(0, window.innerWidth - e.clientX - offsetX);
                const newTop = Math.max(0, e.clientY - offsetY);
                
                buttonContainer.style.right = newRight + 'px';
                buttonContainer.style.top = newTop + 'px';
                buttonContainer.style.transform = 'none';
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    buttonContainer.style.cursor = 'move';
                    
                    // 保存位置
                    const position = {
                        top: buttonContainer.style.top,
                        right: buttonContainer.style.right
                    };
                    saveSettings('button_container_position', position);
                }
            });
            
            // 加载保存的设置
            const savedLimit = loadSettings('promotion_video_limit', 3);
            
            // 添加按钮到面板
            buttonPanel.appendChild(createDownloadButton('下载轮播项', downloadAllCarouselItems));
            buttonPanel.appendChild(createDownloadButton('下载商品视频', downloadAllProductVideos));
            buttonPanel.appendChild(createDownloadButton('下载带货视频', downloadAllPromotionVideos));
            
            // 添加自定义下载按钮
            const customButton = createDownloadButton(`下载前${savedLimit}个带货视频`, () => {
                downloadTopPromotionVideos(savedLimit);
            });
            buttonPanel.appendChild(customButton);
            
            // 添加修改按钮
            const modifyButton = createDownloadButton('修改下载数量', () => {
                const input = prompt('请输入要下载的带货视频数量：', savedLimit.toString());
                if (input !== null) {
                    const limit = parseInt(input);
                    if (!isNaN(limit) && limit > 0) {
                        saveSettings('promotion_video_limit', limit);
                        alert(`已设置为下载前${limit}个带货视频`);
                        // 刷新页面使设置生效
                        window.location.reload();
                    } else {
                        alert('请输入有效的数字');
                    }
                }
            });
            buttonPanel.appendChild(modifyButton);
            
            // 添加到页面
            document.body.appendChild(buttonContainer);
        }, 3000);
    };

    // 启动脚本
    init();
})();
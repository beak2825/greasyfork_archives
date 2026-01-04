// ==UserScript==
// @name         自动点击Telegram图片
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  使用img.media-photo选择器扫描图片，排除reply-media容器，保存已点击图片链接到localStorage，可拖动控制面板，点击图片后自动点击下载按钮并发送ESC键，点击操作间隔1秒
// @author       your_name
// @match        https://web.telegram.org/*
// @grant        none
// @license       mit
// @downloadURL https://update.greasyfork.org/scripts/560754/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBTelegram%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/560754/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BBTelegram%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取已点击图片链接的存储键名
    const CLICKED_IMAGES_KEY = 'clicked_telegram_images';

    // 添加页面会话标识符，防止刷新后重复处理
    const SESSION_KEY = 'telegram_session_id';
    let currentSessionId = Date.now().toString();

    // 检查是否为新会话（页面刷新）
    function isNewSession() {
        const storedSession = sessionStorage.getItem(SESSION_KEY);
        if (!storedSession || storedSession !== currentSessionId) {
            sessionStorage.setItem(SESSION_KEY, currentSessionId);
            return true;
        }
        return false;
    }

    // 调试模式
    const DEBUG_MODE = true;

    // 调试日志函数
    function debugLog(message, data = null) {
        if (DEBUG_MODE) {
        }
    }

    // 全局锁，防止并发执行
    let isProcessing = false;

    // 获取已点击的图片链接数组
    function getClickedImages() {
        try {
            const stored = localStorage.getItem(CLICKED_IMAGES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    // 保存已点击的图片（基于指纹系统）
    function saveClickedImage(imgElement) {
        const fingerprint = getImageFingerprint(imgElement);
        const uniqueId = fingerprint.getUniqueId();

        if (!uniqueId || uniqueId === '_') {
            return;
        }

        const clickedImages = getClickedImages();

        // 检查是否已存在
        if (clickedImages.includes(uniqueId)) {
            return;
        }

        // 添加到数组
        clickedImages.push(uniqueId);

        try {
            // 限制存储数量，防止localStorage过大（最多保存10张）
            const maxImages = 10;
            if (clickedImages.length > maxImages) {
                clickedImages.splice(0, clickedImages.length - maxImages);
            }

            localStorage.setItem(CLICKED_IMAGES_KEY, JSON.stringify(clickedImages));
        } catch (e) {
        }
    }

    // 获取图片的综合指纹（URL + 尺寸 + 时间戳 + 稳定性增强）
    function getImageFingerprint(mediaElement) {
        // 1. 获取规范化URL（增强稳定性）
        const mediaUrl = getImageUrl(mediaElement);

        // 2. 获取媒体尺寸信息（多重验证）
        const parentContainer = mediaElement.closest('.media-container');
        let width = null, height = null;

        if (parentContainer) {
            const style = parentContainer.getAttribute('style');
            if (style) {
                // 从style属性中提取width和height
                const widthMatch = style.match(/width:\s*(\d+)px/);
                const heightMatch = style.match(/height:\s*(\d+)px/);

                if (widthMatch) width = parseInt(widthMatch[1]);
                if (heightMatch) height = parseInt(heightMatch[1]);
            }
        }

        // 备选方案：直接获取媒体实际尺寸
        if (!width || !height) {
            if (mediaElement.tagName.toLowerCase() === 'video') {
                width = mediaElement.videoWidth || mediaElement.width;
                height = mediaElement.videoHeight || mediaElement.height;
            } else {
                width = mediaElement.naturalWidth || mediaElement.width;
                height = mediaElement.naturalHeight || mediaElement.height;
            }
        }

        // 3. 获取消息容器信息（增加识别维度）
        let messageId = null;
        let senderInfo = null;
        const bubbleContent = mediaElement.closest('.bubble-content');
        if (bubbleContent) {
            // 获取消息ID或唯一标识
            const bubble = bubbleContent.closest('.bubble');
            if (bubble) {
                messageId = bubble.getAttribute('data-mid') || bubble.id || null;
            }

            // 获取发送者信息
            const senderElement = bubbleContent.querySelector('.sender, .name, .user-title');
            if (senderElement) {
                senderInfo = senderElement.textContent?.trim() || null;
            }
        }

        // 4. 获取时间戳信息（容错处理）
        let timestamp = null;
        let timeText = null;
        if (bubbleContent) {
            // 从time元素的title属性中提取时间戳
            const timeElement = bubbleContent.querySelector('.time-inner, .time, .timestamp');
            if (timeElement) {
                const timeTitle = timeElement.getAttribute('title') || timeElement.textContent || timeElement.getAttribute('datetime');
                if (timeTitle) {
                    timeText = timeTitle;
                    // 解析多种时间格式
                    try {
                        const date = new Date(timeTitle);
                        if (!isNaN(date.getTime())) {
                            timestamp = date.getTime(); // 获取毫秒时间戳
                        }
                    } catch (e) {
                    }
                }
            }
        }

        // 5. 获取媒体在消息中的位置信息
        let positionInMessage = null;
        if (bubbleContent) {
            const elementType = mediaElement.tagName.toLowerCase();
            const allMedia = bubbleContent.querySelectorAll(`${elementType}.media-photo, ${elementType}.media-video`);
            for (let i = 0; i < allMedia.length; i++) {
                if (allMedia[i] === mediaElement) {
                    positionInMessage = i;
                    break;
                }
            }
        }

        // 6. 构建增强的综合指纹
        const fingerprint = {
            url: mediaUrl,
            mediaType: mediaElement.tagName.toLowerCase(), // 添加媒体类型
            width: width,
            height: height,
            timestamp: timestamp,
            timeText: timeText,
            messageId: messageId,
            senderInfo: senderInfo,
            positionInMessage: positionInMessage,
            // 生成增强的唯一标识符
            getUniqueId: function() {
                let id = '';

                // 优先级1：消息ID + 位置（最稳定）
                if (this.messageId && this.positionInMessage !== null) {
                    id = `msg_${this.messageId}_pos_${this.positionInMessage}`;
                }
                // 优先级2：URL + 尺寸（较稳定）
                else if (this.url && this.width && this.height) {
                    id = `url_${this.url}_${this.width}x${this.height}`;
                }
                // 优先级3：发送者 + 时间 + 尺寸
                else if (this.senderInfo && this.timeText && this.width && this.height) {
                    id = `sender_${this.senderInfo}_time_${this.timeText}_${this.width}x${this.height}`;
                }
                // 优先级4：时间 + 尺寸（基础识别）
                else if (this.timeText && this.width && this.height) {
                    id = `time_${this.timeText}_${this.width}x${this.height}`;
                }
                // 优先级5：仅尺寸（最后手段）
                else if (this.width && this.height) {
                    id = `dim_${this.width}x${this.height}`;
                }
                // 无法生成有效指纹
                else {
                    id = null;
                }

                // 清理ID中的特殊字符，确保一致性
                return id ? id.replace(/[^a-zA-Z0-9_-x]/g, '_') : null;
            }
        };

        return fingerprint;
    }

    // 检查图片是否已点击过（基于增强指纹的多层校验）
    function isImageClicked(imgElement) {
        const fingerprint = getImageFingerprint(imgElement);
        const uniqueId = fingerprint.getUniqueId();

        if (!uniqueId) {
            return true;
        }

        const clickedImages = getClickedImages();

        // 第0层：精确消息ID匹配（最可靠，针对页面刷新场景）
        if (fingerprint.messageId && fingerprint.positionInMessage !== null) {
            const messagePattern = `msg_${fingerprint.messageId}_pos_${fingerprint.positionInMessage}`;
            for (let clickedId of clickedImages) {
                if (clickedId.startsWith(messagePattern)) {
                    return true;
                }
            }
        }

        // 第1层：完整指纹匹配
        if (clickedImages.includes(uniqueId)) {
            return true;
        }

        // 第2层：URL基础匹配（如果URL有效）
        if (fingerprint.url) {
            const baseUrl = fingerprint.url.split('?')[0].split('#')[0];
            for (let clickedId of clickedImages) {
                // 提取已记录ID中的URL部分进行比较
                const clickedUrl = clickedId.split('_')[0];
                if (clickedUrl === baseUrl) {
                    return true;
                }
            }
        }

        // 第3层：发送者 + 时间 + 尺寸匹配（应对URL变化）
        if (fingerprint.senderInfo && fingerprint.timeText && fingerprint.width && fingerprint.height) {
            const senderTimePattern = `sender_${fingerprint.senderInfo}_time_${fingerprint.timeText}`;
            const dimensionPattern = `${fingerprint.width}x${fingerprint.height}`;
            for (let clickedId of clickedImages) {
                if (clickedId.includes(senderTimePattern) && clickedId.includes(dimensionPattern)) {
                    return true;
                }
            }
        }

        // 第4层：时间 + 尺寸匹配（应对URL和发送者变化）
        if (fingerprint.timeText && fingerprint.width && fingerprint.height) {
            const timeDimensionPattern = `time_${fingerprint.timeText}_${fingerprint.width}x${fingerprint.height}`;
            for (let clickedId of clickedImages) {
                if (clickedId === timeDimensionPattern) {
                    return true;
                }
            }
        }

        // 第5层：仅尺寸匹配（最后手段，可能误报但减少重复）
        if (fingerprint.width && fingerprint.height) {
            const dimensionId = `dim_${fingerprint.width}x${fingerprint.height}`;
            for (let clickedId of clickedImages) {
                if (clickedId === dimensionId) {
                    return true;
                }
            }
        }

        return false;
    }

    // 获取图片的完整URL并进行规范化
    function getImageUrl(mediaElement) {
        // 尝试多种方式获取媒体URL（支持图片和视频）
        let url = mediaElement.src ||
                 mediaElement.getAttribute('data-src') ||
                 mediaElement.getAttribute('srcset')?.split(' ')[0] ||
                 mediaElement.getAttribute('poster') || // 视频封面图
                 mediaElement.querySelector('source')?.getAttribute('src') || // 视频source元素
                 '';

        // 如果URL存在，尝试提取稳定的标识符
        if (url) {
            try {
                // 移除查询参数和哈希，获取基础URL
                const urlObj = new URL(url);

                // 进一步规范化：移除常见的动态参数
                const paramsToRemove = ['_nc_hash', '_nc_ohc', '_nc_ht', '_nc_cat', 'ccb', 'oh', 'oe', 'hash'];
                const searchParams = new URLSearchParams(urlObj.search);

                // 移除指定的动态参数
                paramsToRemove.forEach(param => {
                    if (searchParams.has(param)) {
                        searchParams.delete(param);
                    }
                });

                // 重新构建URL，保留必要的参数
                let cleanSearch = searchParams.toString();
                let cleanUrl = `${urlObj.origin}${urlObj.pathname}`;
                if (cleanSearch) {
                    cleanUrl += `?${cleanSearch}`;
                }

                return cleanUrl;
            } catch (e) {
                // 如果URL解析失败，尝试手动清理
                let cleanUrl = url.split('?')[0]; // 移除查询参数
                cleanUrl = cleanUrl.split('#')[0]; // 移除哈希
                return cleanUrl;
            }
        }
        return '';
    }

    // 扫描并点击图片
    async function scanAndClickImages() {
        // 如果正在处理中，跳过本次扫描
        if (isProcessing) {
            return;
        }

        isProcessing = true;

        try {
            // 首先检测并点击SVG预加载器
            const svgPreloader = document.querySelector('svg.preloader-circular[xmlns="http://www.w3.org/2000/svg"]');
            if (svgPreloader) {
                svgPreloader.click();

                // 等待预加载器处理完成
                await sleep(500);
            }

            // 获取聊天区域的主section元素
            const chatSection = document.querySelector('#column-center > div.chats-container.tabs-container > div > div.bubbles.has-groups.has-sticky-dates > div.scrollable.scrollable-y > div.bubbles-inner.has-rights.is-chat > section');

            if (!chatSection) {
                isProcessing = false;
                return;
            }

            // 查找所有class为media-photo的img元素和media-video的video元素
            const allImages = chatSection.querySelectorAll('img.media-photo');
            const allVideos = chatSection.querySelectorAll('video.media-video');

            // 对于视频容器，优先选择img元素（封面图）而不是video元素
            // 因为在Telegram Web中，点击封面图才能打开媒体查看器
            const validMediaElements = [];
            const processedContainers = new Set(); // 记录已处理的容器

            // 首先处理所有图片
            allImages.forEach((img, index) => {
                // 检查父元素是否包含reply-media media-container no-background类
                const parentDiv = img.closest('div.reply-media.media-container.no-background');
                if (!parentDiv) {
                    // 获取容器标识
                    const container = img.closest('.bubble-content') || img.closest('.media-container') || img;
                    const containerId = container.getAttribute('data-mid') || container.id || `${index}_img`;

                    if (!processedContainers.has(containerId)) {
                        validMediaElements.push(img);
                        processedContainers.add(containerId);
                    }
                }
            });

            // 然后处理视频，但只处理那些没有对应img.cover的图片
            allVideos.forEach((video, index) => {
                // 检查父元素是否包含reply-media media-container no-background类
                const parentDiv = video.closest('div.reply-media.media-container.no-background');
                if (!parentDiv) {
                    // 检查同一个容器中是否有对应的img.media-photo
                    const container = video.closest('.media-container') || video.closest('.bubble-content');
                    const correspondingImg = container ? container.querySelector('img.media-photo') : null;

                    if (!correspondingImg) {
                        // 获取容器标识
                        const containerId = container ? (container.getAttribute('data-mid') || container.id || `${index}_video`) : `${index}_video_standalone`;

                        if (!processedContainers.has(containerId)) {
                            validMediaElements.push(video);
                            processedContainers.add(containerId);
                        }
                    }
                }
            });

            // 从后往前扫描
            let foundNewMedia = false;
            for (let i = validMediaElements.length - 1; i >= 0; i--) {
                const mediaElement = validMediaElements[i];
                const elementType = mediaElement.tagName.toLowerCase();

                // 获取媒体元素指纹信息
                const fingerprint = getImageFingerprint(mediaElement);
                const uniqueId = fingerprint.getUniqueId();

                // 使用增强的指纹校验机制
                if (uniqueId && !isImageClicked(mediaElement)) {
                    foundNewMedia = true;

                    // 在点击前立即保存媒体元素指纹，防止并发重复
                    saveClickedImage(mediaElement);

                    // 控制台输出发现新媒体的信息
                    console.log(`发现新的未点击${elementType}: ${uniqueId}`);

                    // 执行点击序列
                    await performClickSequence(mediaElement, uniqueId);

                    // 只处理第一个找到的媒体元素
                    break;
                } else {
                    if (!uniqueId) {
                    } else {
                    }
                }
            }

            if (!foundNewMedia) {
            }
        } catch (error) {
        } finally {
            isProcessing = false;
        }
    }

    // 异步执行点击序列，每个步骤间隔1秒
    async function performClickSequence(mediaElement, mediaFingerprintId) {
        try {
            const elementType = mediaElement.tagName.toLowerCase();

            // 第1步：点击媒体元素（立即执行）

            // 对于视频元素，优先点击对应的img.cover（如果存在）
            let clickTarget = mediaElement;
            if (elementType === 'video') {
                const container = mediaElement.closest('.media-container') || mediaElement.closest('.bubble-content');
                const coverImg = container ? container.querySelector('img.media-photo') : null;
                if (coverImg) {
                    clickTarget = coverImg;
                }
            }

            // 获取并保存peer ID和图片后缀
            const mediaContainer = mediaElement.closest('.bubble-content');
            if (mediaContainer) {
                const bubblesGroup = mediaContainer.closest('.bubbles-group');
                if (bubblesGroup) {
                    const avatarElement = bubblesGroup.querySelector('.bubbles-group-avatar.user-avatar');
                    if (avatarElement) {
                        const peerId = avatarElement.getAttribute('data-peer-id');
                        if (peerId) {
                            // 提取图片src的后缀
                            let imageSuffix = '';
                            const mediaSrc = mediaElement.getAttribute('src');
                            if (mediaSrc && mediaSrc.startsWith('blob:')) {
                                // 从blob URL中提取最后一部分
                                const urlParts = mediaSrc.split('/');
                                const lastPart = urlParts[urlParts.length - 1];
                                if (lastPart) {
                                    // 提取UUID的最后一段（用-分隔）
                                    const uuidParts = lastPart.split('-');
                                    imageSuffix = uuidParts[uuidParts.length - 1];
                                }
                            }

                            if (imageSuffix) {
                                // 保存为 peerId-imageSuffix 格式
                                const saveData = `${peerId}-${imageSuffix}`;
                                localStorage.setItem('name', saveData);
                            } else {
                                // 如果没有找到后缀，只保存peerId
                                localStorage.setItem('name', peerId);
                            }
                        }
                    }
                }
            }

            // 根据媒体类型设置不同的延迟时间
            const delayTime = elementType === 'video' ? 10000 : 5000;
            await sleep(delayTime);

            clickTarget.click();

            // 等待1秒让媒体查看器加载
            await sleep(1000);

            // 第2步：点击下载按钮
            await clickDownloadButton();

            // 第3步：等待1秒后点击关闭按钮
            await sleep(1000);
            clickCloseButton();
        } catch (error) {
        }
    }

    // 辅助函数：延迟指定毫秒
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 点击下载按钮（独立函数）
    async function clickDownloadButton() {
        return new Promise((resolve) => {
            try {
                // 查找下载选项按钮
                const downloadBtn = document.querySelector('body > div.media-viewer-whole.no-forwards.active > div.media-viewer-topbar.media-viewer-appear > div.media-viewer-buttons > button.btn-icon.tgico-download.tel-download');

                if (downloadBtn) {
                    downloadBtn.click();
                } else {
                }

                // 无论如何都resolve，让流程继续
                resolve();
            } catch (error) {
                resolve(); // 继续流程
            }
        });
    }

    // 点击遮罩层关闭媒体查看器（替代点击关闭按钮）
    function clickCloseButton() {
        try {
            // 查找媒体查看器的遮罩层
            const mediaViewer = document.querySelector('body > div.media-viewer-whole.no-forwards.active');

            if (mediaViewer) {
                mediaViewer.click();
            } else {
                // 备选方案1：查找任何激活的媒体查看器
                const activeViewer = document.querySelector('.media-viewer-whole.active');
                if (activeViewer) {
                    activeViewer.click();
                    return;
                }

                // 备选方案2：查找关闭按钮（作为最后手段）
                const closeBtn = document.querySelector('body > div.media-viewer-whole.no-forwards.active > div.media-viewer-topbar.media-viewer-appear > div.media-viewer-buttons > button:nth-child(6)');
                if (closeBtn) {
                    closeBtn.click();
                    return;
                }
            }
        } catch (error) {
        }
    }

    // 点击下载按钮并点击关闭按钮（保持向后兼容）
    async function clickDownloadButtonAndClose() {
        try {
            // 点击下载按钮
            await clickDownloadButton();

            // 等待1秒后点击关闭按钮
            await sleep(1000);
            clickCloseButton();
        } catch (error) {
        }
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: move;
            user-select: none;
        `;

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === panel || e.target === title) {
                isDragging = true;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, panel);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // 添加事件监听器
        panel.addEventListener('mousedown', dragStart);
        panel.addEventListener('mouseup', dragEnd);
        panel.addEventListener('mousemove', drag);

        // 触摸设备支持
        panel.addEventListener('touchstart', dragStart);
        panel.addEventListener('touchend', dragEnd);
        panel.addEventListener('touchmove', drag);

        // 标题
        const title = document.createElement('div');
        title.textContent = 'Telegram图片自动点击器';
        title.style.cssText = 'font-weight: bold; margin-bottom: 10px; text-align: center; cursor: move;';
        panel.appendChild(title);

        // 状态显示
        const status = document.createElement('div');
        status.id = 'auto-click-status';
        status.textContent = '状态: 已停止';
        status.style.cssText = 'margin-bottom: 10px; text-align: center;';
        panel.appendChild(status);

        // 已点击数量显示
        const count = document.createElement('div');
        count.id = 'clicked-count';
        count.textContent = `已点击: ${getClickedImages().length} 张`;
        count.style.cssText = 'margin-bottom: 5px; text-align: center; font-size: 12px;';

        // 功能说明
        const help = document.createElement('div');
        help.textContent = '扫描media-photo图片，排除reply-media，操作间隔1秒';
        help.style.cssText = 'margin-bottom: 10px; text-align: center; font-size: 11px; color: #ccc;';
        panel.appendChild(count);
        panel.appendChild(help);

        // 开始/停止按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '开始';
        toggleBtn.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 5px;
            background: #0088cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            user-select: none;
        `;
        toggleBtn.addEventListener('mousedown', (e) => e.stopPropagation());
        toggleBtn.addEventListener('touchstart', (e) => e.stopPropagation());

        // 清除记录按钮
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清除记录';
        clearBtn.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 5px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            user-select: none;
        `;
        clearBtn.addEventListener('mousedown', (e) => e.stopPropagation());
        clearBtn.addEventListener('touchstart', (e) => e.stopPropagation());

        // 重置位置按钮
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置位置';
        resetBtn.style.cssText = `
            width: 100%;
            padding: 8px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            user-select: none;
        `;
        resetBtn.addEventListener('mousedown', (e) => e.stopPropagation());
        resetBtn.addEventListener('touchstart', (e) => e.stopPropagation());

        panel.appendChild(toggleBtn);
        panel.appendChild(clearBtn);
        panel.appendChild(resetBtn);

        document.body.appendChild(panel);

        // 按钮事件
        let isRunning = false;

        toggleBtn.onclick = function() {
            if (isRunning) {
                // 停止
                isRunning = false;
                toggleBtn.textContent = '开始';
                status.textContent = '状态: 已停止';
                status.style.color = 'white';
            } else {
                // 开始
                isRunning = true;
                toggleBtn.textContent = '停止';
                status.textContent = '状态: 运行中';
                status.style.color = '#00ff00';

                // 定义循环执行函数
                async function runLoop() {
                    if (!isRunning) return;

                    await scanAndClickImages();

                    if (isRunning) {
                        // 等待更长时间确保序列完成，然后继续下一次扫描
                        setTimeout(runLoop, 3000);
                    }
                }

                // 立即开始第一次执行
                runLoop();
            }
        };

        clearBtn.onclick = function() {
            if (confirm('确定要清除所有已点击的图片记录吗？')) {
                localStorage.removeItem(CLICKED_IMAGES_KEY);
                count.textContent = '已点击: 0 张';
            }
        };

        resetBtn.onclick = function() {
            // 重置面板位置到右上角
            xOffset = 0;
            yOffset = 0;
            currentX = 0;
            currentY = 0;
            panel.style.transform = 'translate3d(0px, 0px, 0px)';
            panel.style.top = '20px';
            panel.style.right = '20px';
            panel.style.left = 'auto';
        };

        return { status, count, toggleBtn, clearBtn, resetBtn };
    }

    // 更新状态显示
    function updateStatus() {
        const countElement = document.getElementById('clicked-count');
        if (countElement) {
            countElement.textContent = `已点击: ${getClickedImages().length} 张`;
        }
    }

    // 页面加载完成后初始化
    function init() {
        // 检查是否为新会话（页面刷新）
        const isFreshSession = isNewSession();

        // 如果是新会话，可以选择清理部分旧记录（可选）
        if (isFreshSession) {
            // 可选：清理过期的记录（比如超过7天的记录）
            const clickedImages = getClickedImages();
            const currentTime = Date.now();
            const sevenDaysAgo = currentTime - (7 * 24 * 60 * 60 * 1000);

            // 过滤掉可能过期的记录（基于时间戳）
            const validImages = clickedImages.filter(id => {
                // 如果ID包含时间戳，检查是否过期
                const timestampMatch = id.match(/_(d{13})$/);
                if (timestampMatch) {
                    const timestamp = parseInt(timestampMatch[1]);
                    return timestamp > sevenDaysAgo;
                }
                return true; // 没有时间戳的记录保留
            });

            if (validImages.length < clickedImages.length) {
                try {
                    localStorage.setItem(CLICKED_IMAGES_KEY, JSON.stringify(validImages));
                } catch (e) {
                }
            }
        }

        // 等待页面完全加载
        setTimeout(() => {
            const panel = createControlPanel();

            // 自动开始自动点击功能
            setTimeout(() => {
                if (panel && panel.toggleBtn) {
                    panel.toggleBtn.click();
                }
            }, 500);
        }, 2000);

        // 定期更新状态显示
        setInterval(updateStatus, 5000);
    }

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
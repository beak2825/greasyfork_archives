// ==UserScript==
// @name         Manhwaclub漫画下载器
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  批量下载manhwaclub网站上的漫画图片
// @author       You
// @match        https://manhwaclub.net/manga/*/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      manhwaclub.net
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/554511/Manhwaclub%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554511/Manhwaclub%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储找到的图片URL
    let imageUrls = [];
    let downloadButton = null;
    let scanButton = null; // 扫描按钮引用
    let isScanning = false; // 扫描状态锁
    let isPanelVisible = false; // 面板是否可见
    let floatBall = null; // 悬浮球
    let buttonContainer = null; // 按钮容器
    let chapterNumber = null; // 章节号（从URL提取）
    let mangaName = null; // 漫画名（从URL提取）
    let autoDownloadButton = null; // 自动下载按钮
    let isAutoDownloading = false; // 自动下载状态
    let autoDownloadInterval = null; // 自动下载定时器

    // 创建悬浮球（可拖拽，自动吸附到右边）
    function createFloatBall() {
        if (document.getElementById('float-ball')) {
            return;
        }

        floatBall = document.createElement('div');
        floatBall.id = 'float-ball';
        floatBall.innerHTML = '📥';

        // 恢复保存的位置
        const savedPosition = GM_getValue('floatBallPosition', null);
        let initialBottom = 30;
        let initialRight = 30;

        if (savedPosition) {
            initialBottom = savedPosition.bottom || 30;
            initialRight = savedPosition.right || 30;
        }

        // 悬浮球尺寸（适合手机端，更小）
        floatBall.style.cssText = `
            position: fixed;
            bottom: ${initialBottom}px;
            right: ${initialRight}px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            cursor: move;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 99998;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            user-select: none;
            touch-action: none;
        `;

        // 拖拽功能
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let ballStartRight = 0;
        let ballStartBottom = 0;
        let hasMoved = false;

        // 鼠标按下
        floatBall.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;

            isDragging = true;
            hasMoved = false;

            floatBall.style.cursor = 'grabbing';

            dragStartX = e.clientX;
            dragStartY = e.clientY;

            const rect = floatBall.getBoundingClientRect();
            ballStartRight = window.innerWidth - rect.right;
            ballStartBottom = window.innerHeight - rect.bottom;

            e.preventDefault();
            e.stopPropagation();
        });

        // 鼠标移动
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // 只有当移动距离超过10像素时才认为是拖拽
            if (moveDistance > 10) {
                if (!hasMoved) {
                    // 首次检测到拖拽，关闭面板并禁用过渡
                    if (isPanelVisible) {
                        togglePanel();
                    }
                    floatBall.style.transition = 'none';
                }
                hasMoved = true;

                e.preventDefault();

                let newRight = ballStartRight - deltaX;
                let newBottom = ballStartBottom - deltaY;

                const maxRight = window.innerWidth - 50;
                const maxBottom = window.innerHeight - 50;

                newRight = Math.max(0, Math.min(newRight, maxRight));
                newBottom = Math.max(0, Math.min(newBottom, maxBottom));

                floatBall.style.right = newRight + 'px';
                floatBall.style.bottom = newBottom + 'px';
            }
        });

        // 鼠标释放
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                floatBall.style.cursor = 'move';

                if (hasMoved) {
                    // 如果移动过，执行拖拽结束逻辑
                    floatBall.style.transition = 'right 0.3s ease, bottom 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease';

                    // 自动吸附到右边
                    const rect = floatBall.getBoundingClientRect();
                    const currentBottom = window.innerHeight - rect.bottom;
                    const maxBottom = window.innerHeight - 50;
                    const finalBottom = Math.max(0, Math.min(currentBottom, maxBottom));

                    floatBall.style.right = '0px';
                    floatBall.style.bottom = finalBottom + 'px';

                    // 保存位置
                    GM_setValue('floatBallPosition', { bottom: finalBottom, right: 0 });
                } else {
                    // 如果没有移动，恢复过渡效果（不触发点击，点击事件会单独处理）
                    floatBall.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                }

                hasMoved = false;
            }
        });

        // 触摸事件
        floatBall.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;

            isDragging = true;
            hasMoved = false;

            const touch = e.touches[0];
            dragStartX = touch.clientX;
            dragStartY = touch.clientY;

            const rect = floatBall.getBoundingClientRect();
            ballStartRight = window.innerWidth - rect.right;
            ballStartBottom = window.innerHeight - rect.bottom;

            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length !== 1) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - dragStartX;
            const deltaY = touch.clientY - dragStartY;
            const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // 只有当移动距离超过10像素时才认为是拖拽
            if (moveDistance > 10) {
                if (!hasMoved) {
                    // 首次检测到拖拽，关闭面板并禁用过渡
                    if (isPanelVisible) {
                        togglePanel();
                    }
                    floatBall.style.transition = 'none';
                }
                hasMoved = true;

                e.preventDefault();

                let newRight = ballStartRight - deltaX;
                let newBottom = ballStartBottom - deltaY;

                const maxRight = window.innerWidth - 45;
                const maxBottom = window.innerHeight - 45;

                newRight = Math.max(0, Math.min(newRight, maxRight));
                newBottom = Math.max(0, Math.min(newBottom, maxBottom));

                floatBall.style.right = newRight + 'px';
                floatBall.style.bottom = newBottom + 'px';
            }
        });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;

                if (hasMoved) {
                    // 如果移动过，执行拖拽结束逻辑
                    floatBall.style.transition = 'right 0.3s ease, bottom 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease';

                    // 自动吸附到右边
                    const rect = floatBall.getBoundingClientRect();
                    const currentBottom = window.innerHeight - rect.bottom;
                    const maxBottom = window.innerHeight - 45;
                    const finalBottom = Math.max(0, Math.min(currentBottom, maxBottom));

                    floatBall.style.right = '0px';
                    floatBall.style.bottom = finalBottom + 'px';

                    GM_setValue('floatBallPosition', { bottom: finalBottom, right: 0 });
                } else {
                    // 如果没有移动，恢复过渡效果并触发点击
                    floatBall.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                    // 延迟触发点击，避免冲突
                    setTimeout(() => {
                        if (!hasMoved) {
                            togglePanel();
                        }
                    }, 0);
                }

                hasMoved = false;
            }
        });

        // 点击展开/收起（只在非拖拽情况下）
        floatBall.addEventListener('click', (e) => {
            // 如果是拖拽，不触发点击事件
            if (hasMoved) {
                hasMoved = false;
                return;
            }
            togglePanel();
            e.stopPropagation();
        });

        // 悬浮效果
        floatBall.addEventListener('mouseenter', () => {
            if (!isDragging) {
                floatBall.style.transform = 'scale(1.1)';
                floatBall.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
            }
        });
        floatBall.addEventListener('mouseleave', () => {
            if (!isDragging) {
                floatBall.style.transform = 'scale(1)';
                floatBall.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }
        });

        document.body.appendChild(floatBall);
    }

    // 计算面板应该显示的位置和方向（避免遮挡悬浮球）
    function calculatePanelPosition() {
        if (!floatBall) return null;

        const rect = floatBall.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const panelWidth = 110;  // 更小宽度，适合手机端
        const panelHeight = 130; // 更小高度，适合手机端
        const gap = 5;  // 减小间距，让窗口更贴近悬浮球
        const margin = 0; // 屏幕边距为0，让窗口紧贴浏览器边框

        // 计算悬浮球的中心位置
        const ballCenterX = rect.left + rect.width / 2;
        const ballCenterY = rect.top + rect.height / 2;

        // 判断悬浮球在屏幕的位置
        const isLeftSide = ballCenterX < screenWidth / 2;
        const isTopHalf = ballCenterY < screenHeight / 2;

        let position = {};
        let arrowDirection = '';

        // 主规则：左侧显示在右下方，右侧显示在左下方，保持一致的紧凑间距
        if (isLeftSide) {
            // 悬浮球在左侧：窗口显示在悬浮球的右下方（紧挨着悬浮球）
            // 窗口的左边应该紧挨着悬浮球的右边，间距与右侧保持一致
            const preferredLeft = rect.right + gap;

            // 检查是否会超出屏幕右侧
            if (preferredLeft + panelWidth > screenWidth - margin) {
                // 如果会超出，尽量保持紧凑：窗口右边靠屏幕边缘，但左边尽量靠近悬浮球
                const maxLeft = screenWidth - panelWidth - margin;
                // 优先保持与悬浮球的间距，但如果超出屏幕则调整
                const finalLeft = Math.max(preferredLeft, maxLeft);
                position.left = finalLeft + 'px';
                position.right = 'auto';
            } else {
                // 正常情况：紧挨着悬浮球右侧（间距为gap，与右侧逻辑完全对称）
                position.left = preferredLeft + 'px';
                position.right = 'auto';
            }

            // 垂直方向：默认显示在下方
            const preferredTop = rect.bottom + gap;

            // 检查是否会超出屏幕底部
            if (preferredTop + panelHeight > screenHeight - margin) {
                // 备用方案：显示在上方
                position.top = 'auto';
                position.bottom = Math.max(margin, screenHeight - rect.top + gap) + 'px';
                arrowDirection = 'bottom-left';
            } else {
                // 正常显示在下方
                position.top = preferredTop + 'px';
                position.bottom = 'auto';
                arrowDirection = 'top-left';
            }
        } else {
            // 悬浮球在右侧：窗口显示在悬浮球的左侧，并紧贴浏览器右边界
            position.left = 'auto';
            position.right = '0px';  // 直接贴右边框

            // 垂直方向：默认显示在下方
            const preferredTop = rect.bottom + gap;

            // 检查是否会超出屏幕底部
            if (preferredTop + panelHeight > screenHeight - margin) {
                // 备用方案：显示在上方
                position.top = 'auto';
                position.bottom = Math.max(margin, screenHeight - rect.top + gap) + 'px';
                arrowDirection = 'bottom-right';
            } else {
                // 正常显示在下方
                position.top = preferredTop + 'px';
                position.bottom = 'auto';
                arrowDirection = 'top-right';
            }
        }

        // 最终边界检查，确保面板完全在屏幕内（但不改变与悬浮球的相对位置）
        if (position.top !== 'auto') {
            let top = parseInt(position.top);
            if (top < margin) {
                top = margin;
            }
            if (top + panelHeight > screenHeight - margin) {
                // 如果下方空间不够，尝试显示在上方
                const bottomSpace = screenHeight - margin;
                if (bottomSpace >= panelHeight) {
                    position.top = 'auto';
                    position.bottom = margin + 'px';
                    // 更新箭头方向
                    if (arrowDirection === 'top-left') arrowDirection = 'bottom-left';
                    if (arrowDirection === 'top-right') arrowDirection = 'bottom-right';
                } else {
                    position.top = margin + 'px';
                }
            } else {
                position.top = top + 'px';
            }
        }

        if (position.bottom !== 'auto') {
            let bottom = parseInt(position.bottom);
            if (bottom < margin) {
                bottom = margin;
                position.bottom = bottom + 'px';
                position.top = 'auto';
            }
            if (bottom + panelHeight > screenHeight - margin) {
                position.bottom = margin + 'px';
                position.top = 'auto';
            }
        }

        // 水平方向边界检查已在上面的主逻辑中处理，这里不需要额外处理
        // 确保最终位置是正确的数值格式
        if (position.left !== 'auto' && typeof position.left === 'number') {
            position.left = position.left + 'px';
        }
        if (position.right !== 'auto' && typeof position.right === 'number') {
            position.right = position.right + 'px';
        }

        return { position, arrowDirection };
    }

    // 更新面板位置函数（已不再需要，因为悬浮球固定在右侧）
    function updatePanelPosition(right, bottom) {
        // 不再使用，保留函数以防调用
    }

    // 应用面板位置和箭头方向
    function applyPanelPosition(position, arrowDirection) {
        if (!buttonContainer) return;

        // 应用位置
        buttonContainer.style.left = position.left || 'auto';
        buttonContainer.style.right = position.right || 'auto';
        buttonContainer.style.top = position.top || 'auto';
        buttonContainer.style.bottom = position.bottom || 'auto';

        // 更新箭头方向
        buttonContainer.setAttribute('data-arrow', arrowDirection);

        // 更新箭头CSS类
        buttonContainer.className = buttonContainer.className.replace(/\barrow-\S+/g, '');
        buttonContainer.classList.add(`arrow-${arrowDirection}`);
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        if (!buttonContainer) {
            createDownloadUI();
        }

        isPanelVisible = !isPanelVisible;
        if (isPanelVisible) {
            // 计算面板位置和箭头方向
            const result = calculatePanelPosition();
            if (result) {
                applyPanelPosition(result.position, result.arrowDirection);
            }

            buttonContainer.style.display = 'block';
            floatBall.innerHTML = '✕';
            floatBall.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

            // 添加点击外部关闭的监听器
            setTimeout(() => {
                document.addEventListener('click', closePanelOnOutsideClick, true);
            }, 0);
        } else {
            buttonContainer.style.display = 'none';
            floatBall.innerHTML = '📥';
            floatBall.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

            // 移除点击外部关闭的监听器
            document.removeEventListener('click', closePanelOnOutsideClick, true);
        }
    }

    // 点击外部关闭面板
    function closePanelOnOutsideClick(event) {
        if (!isPanelVisible || !buttonContainer || !floatBall) {
            return;
        }

        // 检查点击是否在面板或悬浮球内
        const clickedPanel = buttonContainer.contains(event.target);
        const clickedBall = floatBall.contains(event.target);

        // 如果点击在外部，关闭面板
        if (!clickedPanel && !clickedBall) {
            togglePanel();
        }
    }

    // 创建下载按钮界面
    function createDownloadUI() {
        // 检查是否已存在按钮
        if (document.getElementById('batch-download-btn')) {
            buttonContainer = document.getElementById('batch-download-container');
            return;
        }

        // 创建浮动按钮容器
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'batch-download-container';

        // 初始位置会在togglePanel时智能计算
        buttonContainer.style.cssText = `
            position: fixed;
            z-index: 99999;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 6px;
            padding: 5px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            width: 110px;
            display: none;
            animation: slideIn 0.3s ease;
        `;

        // 添加动画和气泡样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            #batch-download-container {
                position: relative;
            }

            #batch-download-container::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border: 10px solid transparent;
                z-index: 1;
            }

            /* 箭头在顶部左侧 */
            #batch-download-container.arrow-top-left::before {
                top: -20px;
                left: 30px;
                border-bottom-color: #4CAF50;
            }

            /* 箭头在底部左侧 */
            #batch-download-container.arrow-bottom-left::before {
                bottom: -20px;
                left: 30px;
                border-top-color: #4CAF50;
            }

            /* 箭头在左侧 */
            #batch-download-container.arrow-left::before {
                left: -20px;
                top: 30px;
                border-right-color: #4CAF50;
            }

            /* 箭头在顶部右侧 */
            #batch-download-container.arrow-top-right::before {
                top: -20px;
                right: 30px;
                border-bottom-color: #4CAF50;
            }

            /* 箭头在底部右侧 */
            #batch-download-container.arrow-bottom-right::before {
                bottom: -20px;
                right: 30px;
                border-top-color: #4CAF50;
            }

            /* 箭头在右侧 */
            #batch-download-container.arrow-right::before {
                right: -20px;
                top: 30px;
                border-left-color: #4CAF50;
            }
        `;
        document.head.appendChild(style);

        // 图片计数显示（移除标题）
        const countDisplay = document.createElement('div');
        countDisplay.id = 'image-count';
        countDisplay.textContent = '已发现: 0';
        countDisplay.style.cssText = `
            margin-bottom: 3px;
            color: #333;
            font-size: 10px;
            text-align: center;
            font-weight: bold;
        `;

        // 扫描按钮
        scanButton = document.createElement('button');
        scanButton.textContent = '🔍 扫描';
        scanButton.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 3px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        scanButton.onclick = scanImages;

        // 下载按钮
        downloadButton = document.createElement('button');
        downloadButton.id = 'batch-download-btn';
        downloadButton.textContent = '⬇️ 下载';
        downloadButton.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 3px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        downloadButton.onclick = batchDownload;
        downloadButton.disabled = true;

        // 清除按钮
        const clearButton = document.createElement('button');
        clearButton.textContent = '🗑️ 清除';
        clearButton.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 3px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        clearButton.onclick = clearImages;

        // 使用说明按钮
        const helpButton = document.createElement('button');
        helpButton.textContent = '❓ 说明';
        helpButton.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-bottom: 3px;
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        helpButton.onclick = function() {
            alert('使用说明：\n\n' +
                  '电脑端适配更好\n\n' +
                  '第一步,先将漫画拉到底部，加载一下全部图片，设定下载的文件夹，比如《xxx第n章》\n\n' +
                  '第二步，关闭每次下载都询问下载文件夹的提示，这样就不会看到恼人的提示\n\n' +
                  '第三步,点击扫描，等待图片的扫描\n\n' +
                  '第四步，点击批量下载\n\n' +
                  '若进行下一次下载，先点击清除，将上次扫描的列表重置，然后再次扫描即可');
        };

        // 自动下载按钮
        autoDownloadButton = document.createElement('button');
        autoDownloadButton.textContent = '🚀 自动下载';
        autoDownloadButton.style.cssText = `
            width: 100%;
            padding: 8px;
            background: #9C27B0;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        autoDownloadButton.onclick = toggleAutoDownload;

        // 不添加title，只添加其他元素
        buttonContainer.appendChild(countDisplay);
        buttonContainer.appendChild(scanButton);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(clearButton);
        buttonContainer.appendChild(autoDownloadButton);
        buttonContainer.appendChild(helpButton);
        document.body.appendChild(buttonContainer);

        // 初始状态：面板隐藏
        isPanelVisible = false;
        buttonContainer.style.display = 'none';
    }

    // 从URL中提取漫画名
    function extractMangaName() {
        try {
            const url = window.location.href;
            // URL格式通常是: https://manhwaclub.net/manga/漫画名/chapter-10/
            const match = url.match(/\/manga\/([^\/]+)\//);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
            return null;
        } catch (e) {
            console.error('提取漫画名失败:', e);
            return null;
        }
    }

    // 从URL中提取章节号
    function extractChapterNumber() {
        try {
            const url = window.location.href;
            // URL格式通常是: https://manhwaclub.net/manga/漫画名/chapter-10/
            const match = url.match(/chapter[_-]?(\d+)/i);
            if (match && match[1]) {
                return match[1];
            }
            // 如果匹配失败，尝试从路径中提取最后一个数字
            const pathParts = url.split('/');
            for (let i = pathParts.length - 1; i >= 0; i--) {
                const match = pathParts[i].match(/(\d+)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
            return null;
        } catch (e) {
            console.error('提取章节号失败:', e);
            return null;
        }
    }

    // 扫描页面上的所有图片
    function scanImages() {
        // 防止重复扫描
        if (isScanning) {
            alert('正在扫描中，请稍候...');
            return;
        }

        isScanning = true;

        // 提取漫画名和章节号
        mangaName = extractMangaName();
        chapterNumber = extractChapterNumber();
        if (mangaName) {
            console.log(`检测到漫画名: ${mangaName}`);
        } else {
            console.log('未能提取漫画名，将不添加前缀');
        }
        if (chapterNumber) {
            console.log(`检测到章节号: 第${chapterNumber}章`);
        } else {
            console.log('未能提取章节号，将不添加前缀');
        }

        // 更新扫描按钮状态
        if (scanButton) {
            scanButton.disabled = true;
            scanButton.textContent = '⏳ 扫描中...';
            scanButton.style.cursor = 'not-allowed';
            scanButton.style.opacity = '0.6';
        }

        imageUrls = [];
        const urlSet = new Set();

        // 只扫描可见的、大尺寸的img标签（严格的筛选）
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 严格检查图片是否可见
            const style = window.getComputedStyle(img);
            const isVisible = style.display !== 'none' &&
                            style.visibility !== 'hidden' &&
                            style.opacity !== '0' &&
                            img.offsetWidth > 0 &&
                            img.offsetHeight > 0;

            if (!isVisible) {
                console.log(`跳过不可见图: ${img.src || 'unknown'}`);
                return;
            }

            // 获取实际图片尺寸（优先使用naturalWidth/Height）
            const width = img.naturalWidth || img.offsetWidth || 0;
            const height = img.naturalHeight || img.offsetHeight || 0;

            // 严格过滤：只保留足够大的图片（漫画图片通常至少400x400或更大）
            // 提高阈值，排除更多缩略图
            if (width < 400 || height < 400) {
                console.log(`跳过小图: ${img.src || 'unknown'} (${width}x${height})`);
                return;
            }

            // 获取图片源
            let src = img.src || img.dataset.src || img.dataset.lazySrc || '';
            if (!src || !src.startsWith('http')) {
                return;
            }

            // 移除URL参数
            src = src.split('?')[0];

            // 严格检查：必须是有效格式（纯数字.jpg 或 数字_result数字.jpg）
            if (!src.match(/\.(jpg|jpeg)(\?|$)/i) || !isPureNumberJpg(src)) {
                console.log(`跳过无效格式JPG: ${src}`);
                return;
            }

            // 避免重复
            if (urlSet.has(src)) {
                console.log(`跳过重复: ${src}`);
                return;
            }

            // 添加到列表
            urlSet.add(src);
            imageUrls.push({
                url: src,
                filename: extractFilename(src)
            });
            console.log(`✓ 找到有效图片: ${extractFilename(src)} (${width}x${height})`);
        });

        // 输出调试信息
        console.log(`扫描完成，共找到 ${imageUrls.length} 张有效图片`);
        imageUrls.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.filename}`);
        });

        // 对图片URL进行排序（按数字顺序）
        imageUrls.sort((a, b) => {
            // 从URL中提取文件名，然后提取数字部分
            const getNumber = (url) => {
                try {
                    const urlObj = new URL(url);
                    const filename = urlObj.pathname.split('/').pop();
                    // 匹配多种格式，提取第一个数字作为排序依据
                    const match1 = filename.match(/^(\d+)\./);  // 纯数字格式
                    const match2 = filename.match(/^(\d+)_result/);  // 数字_result格式
                    const match3 = filename.match(/^(\d+)-/);  // 数字-数字_result格式
                    const match = match1 || match2 || match3;
                    return parseInt(match ? match[1] : '0');
                } catch (e) {
                    return 0;
                }
            };
            return getNumber(a.url) - getNumber(b.url);
        });

        // 更新计数显示
        updateCount();

        // 启用下载按钮
        if (imageUrls.length > 0) {
            downloadButton.disabled = false;
            downloadButton.style.background = '#4CAF50';
        } else {
            downloadButton.disabled = true;
            downloadButton.style.background = '#ccc';
        }

        // 恢复扫描按钮状态
        if (scanButton) {
            scanButton.disabled = false;
            scanButton.textContent = '🔍 扫描图片';
            scanButton.style.cursor = 'pointer';
            scanButton.style.opacity = '1';
        }

        isScanning = false;

        console.log(`扫描完成！发现 ${imageUrls.length} 张有效图片（有效格式，尺寸≥400x400）`);
        alert(`扫描完成！发现 ${imageUrls.length} 张有效图片\n\n提示：已过滤掉缩略图和小尺寸图片`);
    }

    // 检查文件名是否是有效格式
    function isPureNumberJpg(filename) {
        if (!filename) return false;
        // 移除URL参数
        const cleanName = filename.split('?')[0];
        // 提取文件名（去掉路径）
        const nameOnly = cleanName.split('/').pop();

        // 匹配九种格式：
        // 1. 纯数字.jpg/jpeg：如 1.jpg, 23.jpg
        // 2. 数字_result数字.jpg/jpeg：如 01_result01.jpg, 1_result1.jpg
        // 3. 数字_result.jpg/jpeg：如 1_result.jpg, 23_result.jpg
        // 4. 数字-数字_result数字.jpg/jpeg：如 1-2_result2.jpg, 10-20_result20.jpg
        // 5. 数字-e数字.jpg/jpeg：如 1-e2.jpg, 10-e20.jpg
        // 6. 数字-数字.jpg/jpeg：如 1-2.jpg, 10-20.jpg
        // 7. 数字-数字字母组合_result数字.jpg/jpeg：如 1-c6f95_result95.jpg, 1-8f51a_result51.jpg
        // 8. 数字-数字-result数字.jpg/jpeg：如 2-83602-result83602.jpg
        // 9. 数字-数字字母组合.jpg/jpeg：如 1-f55b5.jpg
        const pattern1 = /^(\d+)\.(jpg|jpeg)$/i;  // 纯数字格式
        const pattern2 = /^(\d+)_result(\d+)\.(jpg|jpeg)$/i;  // 数字_result数字格式
        const pattern3 = /^(\d+)_result\.(jpg|jpeg)$/i;  // 数字_result格式
        const pattern4 = /^(\d+)-(\d+)_result(\d+)\.(jpg|jpeg)$/i;  // 数字-数字_result数字格式
        const pattern5 = /^(\d+)-e(\d+)\.(jpg|jpeg)$/i;  // 数字-e数字格式
        const pattern6 = /^(\d+)-(\d+)\.(jpg|jpeg)$/i;  // 数字-数字格式
        const pattern7 = /^(\d+)-([a-f0-9]+)_result(\d+)\.(jpg|jpeg)$/i;  // 数字-数字字母组合_result数字格式
        const pattern8 = /^(\d+)-(\d+)-result(\d+)\.(jpg|jpeg)$/i;  // 数字-数字-result数字格式
        const pattern9 = /^(\d+)-([a-f0-9]+)\.(jpg|jpeg)$/i;  // 数字-数字字母组合格式

        return pattern1.test(nameOnly) || pattern2.test(nameOnly) || pattern3.test(nameOnly) || pattern4.test(nameOnly) || pattern5.test(nameOnly) || pattern6.test(nameOnly) || pattern7.test(nameOnly) || pattern8.test(nameOnly) || pattern9.test(nameOnly);
    }

    // 从URL提取文件名
    function extractFilename(url) {
        try {
            const urlObj = new URL(url);
            let filename = urlObj.pathname.split('/').pop();

            // 如果没有文件名，使用URL的一部分作为文件名
            if (!filename || !filename.includes('.')) {
                const pathParts = urlObj.pathname.split('/');
                filename = pathParts[pathParts.length - 2] || 'image';
                filename += '_' + Date.now();
            }

            // 清理文件名
            filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

            // 确保有扩展名
            if (!filename.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i)) {
                // 从URL判断类型
                if (url.match(/\.jpg|\.jpeg/i)) filename += '.jpg';
                else if (url.match(/\.png/i)) filename += '.png';
                else if (url.match(/\.gif/i)) filename += '.gif';
                else filename += '.jpg'; // 默认jpg
            }

            return filename;
        } catch (e) {
            return `image_${Date.now()}.jpg`;
        }
    }

    // 更新计数显示
    function updateCount() {
        const countDisplay = document.getElementById('image-count');
        if (countDisplay) {
            countDisplay.textContent = `已发现: ${imageUrls.length}`;
        }

        // 更新按钮状态
        if (scanButton) {
            scanButton.textContent = '🔍 扫描';
            scanButton.disabled = false;
            scanButton.style.cursor = 'pointer';
            scanButton.style.opacity = '1';
        }
    }

    // 批量下载（快速版本）
    async function batchDownload() {
        if (imageUrls.length === 0) {
            alert('没有可下载的图片！请先扫描图片。');
            return;
        }

        downloadButton.disabled = true;
        downloadButton.textContent = `下载中... 0/${imageUrls.length}`;
        downloadButton.style.background = '#ff9800';

        let successCount = 0;
        let failCount = 0;

        console.log(`开始快速批量下载 ${imageUrls.length} 张图片`);

        // 快速批量下载：直接创建下载链接（不等待）
        for (let i = 0; i < imageUrls.length; i++) {
            const item = imageUrls[i];
            try {
                // 确保文件名唯一，添加序号前缀（补零到4位）
                const indexStr = String(i + 1).padStart(4, '0');
                let finalFilename;

                // 构建文件名：先添加章节号和漫画名前缀
                let prefix = '';
                if (chapterNumber) {
                    prefix += `[${chapterNumber}]`;
                }
                if (mangaName) {
                    prefix += `[${mangaName}]`;
                }
                if (prefix) {
                    prefix += '_';
                }

                if (item.filename) {
                    // 提取原文件名中的数字部分
                    const numMatch = item.filename.match(/^(\d+)/);
                    if (numMatch) {
                        finalFilename = `${prefix}${indexStr}_${item.filename}`;
                    } else {
                        finalFilename = `${prefix}${indexStr}_${item.filename}`;
                    }
                } else {
                    // 生成新文件名
                    const ext = item.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);
                    const extension = ext ? ext[1].toLowerCase() : 'jpg';
                    finalFilename = `${prefix}${indexStr}_image.${extension}`;
                }

                // 直接下载（最快方式，不等待）
                downloadImageDirect(item.url, finalFilename);
                successCount++;

                // 更新进度
                downloadButton.textContent = `下载中... ${i + 1}/${imageUrls.length}`;

                // 短延迟避免浏览器阻止（100ms）
                if (i < imageUrls.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (error) {
                console.error(`下载失败 [${i + 1}]:`, item.url, error);
                failCount++;
            }
        }

        // 下载完成
        downloadButton.disabled = false;
        downloadButton.textContent = '⬇️ 批量下载';
        downloadButton.style.background = '#4CAF50';

        alert(`开始下载 ${successCount} 张图片！\n\n浏览器将自动下载，请检查下载文件夹。`);
        console.log(`批量下载触发完成！成功: ${successCount}, 失败: ${failCount}`);
    }

    // 直接下载图片（使用GM_xmlhttpRequest获取blob后下载）
    function downloadImageDirect(url, filename) {
        if (url.startsWith('data:image')) {
            // base64图片，异步处理但不等待
            downloadBase64Image(url, filename).catch(err => {
                console.error('下载base64图片失败:', err);
            });
        } else {
            // 普通URL，使用GM_xmlhttpRequest获取后下载（异步，不阻塞）
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer',
                    onload: function(response) {
                        try {
                            let blob;
                            if (response.response instanceof ArrayBuffer) {
                                blob = new Blob([response.response], { type: 'image/jpeg' });
                            } else if (response.response instanceof Blob) {
                                blob = response.response;
                            } else if (response.response) {
                                blob = new Blob([response.response], { type: 'image/jpeg' });
                            } else {
                                throw new Error('无法获取响应数据');
                            }

                            const blobUrl = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = filename;
                            a.style.display = 'none';
                            document.body.appendChild(a);
                            a.click();

                            setTimeout(() => {
                                try {
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(blobUrl);
                                } catch (e) {}
                            }, 100);
                        } catch (error) {
                            console.error('创建下载链接失败:', error);
                            // 备用：直接下载链接
                            tryDirectDownload(url, filename);
                        }
                    },
                    onerror: function(error) {
                        console.error('GM_xmlhttpRequest失败，尝试直接下载:', error);
                        // 备用：直接下载链接
                        tryDirectDownload(url, filename);
                    }
                });
            } else {
                // 没有GM_xmlhttpRequest，直接下载链接
                tryDirectDownload(url, filename);
            }
        }
    }

    // 直接下载链接（备用方法）
    function tryDirectDownload(url, filename) {
        try {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                try {
                    document.body.removeChild(a);
                } catch (e) {}
            }, 100);
        } catch (error) {
            console.error('直接下载链接也失败:', error);
        }
    }

    // 下载普通图片（使用GM_xmlhttpRequest绕过CORS限制）
    function fallbackDownload(url, filename) {
        return new Promise((resolve, reject) => {
            // 优先使用GM_xmlhttpRequest（支持跨域）
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer',  // 使用arraybuffer
                    onload: function(response) {
                        try {
                            let blob;
                            // 处理响应数据
                            if (response.response instanceof ArrayBuffer) {
                                blob = new Blob([response.response], { type: 'image/jpeg' });
                            } else if (response.response instanceof Blob) {
                                blob = response.response;
                            } else if (response.response) {
                                blob = new Blob([response.response], { type: 'image/jpeg' });
                            } else {
                                throw new Error('无法获取响应数据');
                            }

                            const blobUrl = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = filename;
                            a.style.display = 'none';
                            document.body.appendChild(a);
                            a.click();

                             // 延迟移除，确保下载开始
                             setTimeout(() => {
                                 try {
                                     document.body.removeChild(a);
                                     URL.revokeObjectURL(blobUrl);
                                 } catch (e) {
                                     // 忽略错误
                                 }
                                 resolve();
                             }, 150);
                        } catch (error) {
                            console.error('创建下载链接失败，尝试备用方法:', error);
                            // 如果GM_xmlhttpRequest失败，尝试备用方法
                            tryFetchDownload(url, filename).then(resolve).catch(reject);
                        }
                    },
                    onerror: function(error) {
                        console.error('GM_xmlhttpRequest请求失败:', error);
                        // 尝试备用方法
                        tryFetchDownload(url, filename).then(resolve).catch(reject);
                    }
                });
            } else {
                // 备用方法：使用fetch
                tryFetchDownload(url, filename).then(resolve).catch(reject);
            }
        });
    }

    // 备用fetch下载方法（直接下载链接）
    function tryFetchDownload(url, filename) {
        return new Promise((resolve, reject) => {
            try {
                // 直接创建下载链接（最简单的方法）
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();

                 setTimeout(() => {
                     try {
                         document.body.removeChild(a);
                     } catch (e) {
                         // 忽略错误
                     }
                     resolve();
                 }, 100);
            } catch (error) {
                console.error('直接下载失败:', error);
                reject(error);
            }
        });
    }

    // 下载base64图片
    function downloadBase64Image(dataUrl, filename) {
        return new Promise((resolve, reject) => {
            try {
                const base64Data = dataUrl.split(',')[1];
                const mimeType = dataUrl.match(/data:image\/(\w+);/)[1];
                const extension = mimeType === 'png' ? 'png' : 'jpg';

                // 转换为blob后下载
                const byteCharacters = atob(base64Data);
                const byteArrays = [];

                for (let i = 0; i < byteCharacters.length; i += 512) {
                    const slice = byteCharacters.slice(i, i + 512);
                    const byteNumbers = new Array(slice.length);
                    for (let j = 0; j < slice.length; j++) {
                        byteNumbers[j] = slice.charCodeAt(j);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }

                const blob = new Blob(byteArrays, { type: `image/${mimeType}` });
                const blobUrl = URL.createObjectURL(blob);
                const finalFilename = filename.endsWith(`.${extension}`) ? filename : `${filename}.${extension}`;
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = finalFilename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();

                 // 延迟移除，确保下载开始
                 setTimeout(() => {
                     try {
                         document.body.removeChild(a);
                         URL.revokeObjectURL(blobUrl);
                     } catch (e) {
                         // 忽略错误
                     }
                     resolve();
                 }, 50);
            } catch (error) {
                reject(error);
            }
        });
    }

    // 清除图片列表
    function clearImages() {
        imageUrls = [];
        updateCount();
        downloadButton.disabled = true;
        downloadButton.style.background = '#ccc';
        alert('已清除图片列表');
    }

    // 提取章节完整名称（包括chapter-前缀）
    function extractChapterName() {
        try {
            const url = window.location.href;
            const match = url.match(/chapter[_-]?([^\/]+)/i);
            if (match && match[1]) {
                return match[1];
            }
            return null;
        } catch (e) {
            console.error('提取章节名称失败:', e);
            return null;
        }
    }

    // 判断章节是否为raw版本
    function isRawChapter(chapterName) {
        return chapterName && chapterName.includes('raw');
    }

    // 获取下一个章节号
    function getNextChapterNumber(currentChapter) {
        const chapterNum = parseInt(currentChapter);
        if (!isNaN(chapterNum)) {
            return chapterNum + 1;
        }
        return null;
    }

    // 构建下一个章节的URL
    function buildNextChapterUrl(nextChapterNum) {
        try {
            const currentUrl = window.location.href;
            const urlParts = currentUrl.split('/');

            console.log(`构建普通章节URL - 当前URL: ${currentUrl}, 下一章节号: ${nextChapterNum}`);

            // 遍历URL路径，找到章节部分并替换
            for (let i = urlParts.length - 1; i >= 0; i--) {
                if (urlParts[i].match(/^chapter[_-]?(\d+)/i)) {
                    // 匹配到章节部分，提取数字
                    const match = urlParts[i].match(/^chapter[_-]?(\d+)/i);
                    if (match) {
                        console.log(`匹配到章节部分: ${urlParts[i]}, 将替换为: chapter-${nextChapterNum}`);
                        // 替换为新的章节号（不带-raw）
                        urlParts[i] = urlParts[i].replace(/^chapter[_-]?(\d+)/i, `chapter-${nextChapterNum}`);
                        const result = urlParts.join('/');
                        console.log(`构建的普通章节URL: ${result}`);
                        return result;
                    }
                }
            }

            console.log('未找到章节部分');
            return null;
        } catch (e) {
            console.error('构建下一章URL失败:', e);
            return null;
        }
    }

    // 构建raw章节的URL
    function buildRawChapterUrl(nextChapterNum) {
        try {
            const currentUrl = window.location.href;
            const urlParts = currentUrl.split('/');

            console.log(`构建raw章节URL - 当前URL: ${currentUrl}, 下一章节号: ${nextChapterNum}`);

            // 遍历URL路径，找到章节部分并替换
            for (let i = urlParts.length - 1; i >= 0; i--) {
                if (urlParts[i].match(/^chapter[_-]?(\d+)/i)) {
                    // 匹配到章节部分，提取数字
                    const match = urlParts[i].match(/^chapter[_-]?(\d+)/i);
                    if (match) {
                        console.log(`匹配到章节部分: ${urlParts[i]}, 将替换为: chapter-${nextChapterNum}-raw`);
                        // 替换为新的章节号并添加-raw后缀
                        urlParts[i] = urlParts[i].replace(/^chapter[_-]?(\d+)/i, `chapter-${nextChapterNum}-raw`);
                        const result = urlParts.join('/');
                        console.log(`构建的raw章节URL: ${result}`);
                        return result;
                    }
                }
            }

            console.log('未找到章节部分');
            return null;
        } catch (e) {
            console.error('构建raw章节URL失败:', e);
            return null;
        }
    }

    // 检查章节是否存在（尝试访问URL）
    function checkChapterExists(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: function(response) {
                    console.log(`章节检查响应: ${url} - 状态码: ${response.status}`);
                    // 检查响应体是否包含实际的漫画图片
                    // 如果只返回章节列表或错误页面，则认为章节不存在
                    const responseText = response.responseText || '';

                    // 检查是否含有bg-search.jpg，如果含有则直接判定为无效章节
                    if (responseText.includes('bg-search.jpg')) {
                        console.log(`章节内容检查 - URL: ${url}, 包含bg-search.jpg，判定为无效章节`);
                        resolve(false);
                        return;
                    }

                    // 检查是否包含实际的漫画图片URL（.jpg格式）
                    // 使用更精确的图片URL匹配
                    const imageUrlPattern = /https?:\/\/[^"'\s]+\.(jpg|jpeg)(\?|")/gi;
                    const imageMatches = responseText.match(imageUrlPattern);
                    const imageCount = imageMatches ? imageMatches.length : 0;

                    // 只检查图片数量，至少2张有效图片才认为是有效章节
                    const hasValidImages = imageCount >= 2;

                    console.log(`章节内容检查 - URL: ${url}`);
                    console.log(`图片数量: ${imageCount}, 是否有有效图片: ${hasValidImages}`);

                    // 状态码正确且有至少2张有效图片才认为章节存在
                    const exists = response.status >= 200 && response.status < 400 && hasValidImages;
                    console.log(`章节${exists ? '存在' : '不存在'}: ${url}`);
                    resolve(exists);
                },
                onerror: function(error) {
                    console.log(`章节不存在(错误): ${url}`, error);
                    resolve(false);
                },
                ontimeout: function() {
                    console.log(`检查章节超时: ${url}`);
                    resolve(false);
                }
            });
        });
    }

    // 自动下载流程
    async function processAutoDownload() {
        console.log('开始自动下载流程...');

        // 1. 扫描当前章节的图片
        console.log('正在扫描图片...');
        await scanImagesAsync();

        // 2. 下载当前章节的图片
        if (imageUrls.length > 0) {
            console.log(`开始下载 ${imageUrls.length} 张图片...`);
            await batchDownloadAsync();

            // 等待下载完成
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // 3. 寻找下一个章节
        const currentChapterNum = chapterNumber;
        let nextChapterNum = getNextChapterNumber(currentChapterNum);

        console.log(`当前URL: ${window.location.href}`);
        console.log(`当前章节号: ${currentChapterNum}, 下一个章节号: ${nextChapterNum}`);

        // 智能选择下一章节（优先普通版，仅raw则选raw）
        while (nextChapterNum) {
            // 先检查普通版章节
            const normalUrl = buildNextChapterUrl(nextChapterNum);
            const rawUrl = buildRawChapterUrl(nextChapterNum);

            console.log(`构建的URL - 普通版: ${normalUrl}, raw版: ${rawUrl}`);

            if (normalUrl) {
                console.log(`检查章节 ${nextChapterNum}...`);

                // 检查普通版章节是否存在
                console.log(`等待检查普通版章节是否存在: ${normalUrl}`);
                const normalExists = await checkChapterExists(normalUrl);
                console.log(`普通版章节检查结果: ${normalExists}`);

                if (normalExists) {
                    // 找到普通版章节
                    console.log(`找到下一章: ${normalUrl}`);
                    window.location.href = normalUrl;
                    return;
                } else {
                    // 普通版不存在，检查raw版本
                    console.log(`章节 ${nextChapterNum} 普通版不存在，检查raw版本...`);

                    if (rawUrl) {
                        console.log(`等待检查raw版本是否存在: ${rawUrl}`);
                        const rawExists = await checkChapterExists(rawUrl);
                        console.log(`raw版本检查结果: ${rawExists}`);

                        if (rawExists) {
                            // 找到raw版本
                            console.log(`找到raw版本: ${rawUrl}`);
                            window.location.href = rawUrl;
                            return;
                        } else {
                            // 两种版本都不存在，停止自动下载
                            console.log(`章节 ${nextChapterNum} 普通版和raw版本都不存在，停止自动下载`);
                            stopAutoDownload();
                            alert('所有章节已下载完成！');
                            return;
                        }
                    } else {
                        // 无法构建raw URL，停止自动下载
                        console.log(`无法构建章节 ${nextChapterNum} 的URL，停止自动下载`);
                        stopAutoDownload();
                        alert('所有章节已下载完成！');
                        return;
                    }
                }
            } else {
                // 无法构建普通版URL，尝试raw版本
                console.log(`无法构建章节 ${nextChapterNum} 的普通版URL，尝试raw版本...`);

                if (rawUrl) {
                    const rawExists = await checkChapterExists(rawUrl);

                    if (rawExists) {
                        console.log(`找到raw版本: ${rawUrl}`);
                        window.location.href = rawUrl;
                        return;
                    } else {
                        console.log(`章节 ${nextChapterNum} raw版本也不存在，停止自动下载`);
                        stopAutoDownload();
                        alert('所有章节已下载完成！');
                        return;
                    }
                } else {
                    console.log('无法构建下一章的URL，停止自动下载');
                    stopAutoDownload();
                    alert('所有章节已下载完成！');
                    return;
                }
            }
        }

        // 如果找不到下一章，停止自动下载
        console.log('找不到下一章，停止自动下载');
        stopAutoDownload();
        alert('所有章节已下载完成！');
    }

    // 异步版本的扫描函数
    async function scanImagesAsync() {
        return new Promise((resolve) => {
            // 防止重复扫描
            if (isScanning) {
                resolve();
                return;
            }

            isScanning = true;

            // 提取漫画名和章节号
            mangaName = extractMangaName();
            chapterNumber = extractChapterNumber();
            if (mangaName) {
                console.log(`检测到漫画名: ${mangaName}`);
            }
            if (chapterNumber) {
                console.log(`检测到章节号: 第${chapterNumber}章`);
            }

            // 更新扫描按钮状态
            if (scanButton) {
                scanButton.disabled = true;
                scanButton.textContent = '⏳ 扫描中...';
            }

            imageUrls = [];
            const urlSet = new Set();

            // 扫描可见的、大尺寸的img标签
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                const style = window.getComputedStyle(img);
                const isVisible = style.display !== 'none' &&
                                style.visibility !== 'hidden' &&
                                style.opacity !== '0' &&
                                img.offsetWidth > 0 &&
                                img.offsetHeight > 0;

                if (!isVisible) return;

                const width = img.naturalWidth || img.offsetWidth || 0;
                const height = img.naturalHeight || img.offsetHeight || 0;

                if (width < 400 || height < 400) return;

                let src = img.src || img.dataset.src || img.dataset.lazySrc || '';
                if (!src || !src.startsWith('http')) return;

                src = src.split('?')[0];

                if (!src.match(/\.(jpg|jpeg)(\?|$)/i) || !isPureNumberJpg(src)) return;

                if (urlSet.has(src)) return;

                urlSet.add(src);
                imageUrls.push({
                    url: src,
                    filename: extractFilename(src)
                });
            });

            // 排序
            imageUrls.sort((a, b) => {
                const getNumber = (url) => {
                    try {
                        const urlObj = new URL(url);
                        const filename = urlObj.pathname.split('/').pop();
                        const match1 = filename.match(/^(\d+)\./);
                        const match2 = filename.match(/^(\d+)_result/);
                        const match3 = filename.match(/^(\d+)-/);
                        const match = match1 || match2 || match3;
                        return parseInt(match ? match[1] : '0');
                    } catch (e) {
                        return 0;
                    }
                };
                return getNumber(a.url) - getNumber(b.url);
            });

            // 更新计数
            updateCount();

            if (imageUrls.length > 0) {
                downloadButton.disabled = false;
                downloadButton.style.background = '#4CAF50';
            }

            // 恢复扫描按钮状态
            if (scanButton) {
                scanButton.disabled = false;
                scanButton.textContent = '🔍 扫描';
            }

            isScanning = false;
            resolve();
        });
    }

    // 异步版本的批量下载函数
    async function batchDownloadAsync() {
        if (imageUrls.length === 0) {
            return;
        }

        downloadButton.disabled = true;
        downloadButton.textContent = `下载中... 0/${imageUrls.length}`;
        downloadButton.style.background = '#ff9800';

        for (let i = 0; i < imageUrls.length; i++) {
            const item = imageUrls[i];
            try {
                const indexStr = String(i + 1).padStart(4, '0');
                let finalFilename;

                // 构建文件名：先添加章节号和漫画名前缀
                let prefix = '';
                if (chapterNumber) {
                    prefix += `[${chapterNumber}]`;
                }
                if (mangaName) {
                    prefix += `[${mangaName}]`;
                }
                if (prefix) {
                    prefix += '_';
                }

                if (item.filename) {
                    const numMatch = item.filename.match(/^(\d+)/);
                    if (numMatch) {
                        finalFilename = `${prefix}${indexStr}_${item.filename}`;
                    } else {
                        finalFilename = `${prefix}${indexStr}_${item.filename}`;
                    }
                } else {
                    const ext = item.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);
                    const extension = ext ? ext[1].toLowerCase() : 'jpg';
                    finalFilename = `${prefix}${indexStr}_image.${extension}`;
                }

                downloadImageDirect(item.url, finalFilename);

                downloadButton.textContent = `下载中... ${i + 1}/${imageUrls.length}`;

                if (i < imageUrls.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (error) {
                console.error(`下载失败 [${i + 1}]:`, error);
            }
        }

        downloadButton.disabled = false;
        downloadButton.textContent = '⬇️ 下载';
        downloadButton.style.background = '#4CAF50';
    }

    // 切换自动下载状态
    function toggleAutoDownload() {
        if (!isAutoDownloading) {
            // 开始自动下载
            const confirmed = confirm('自动下载过程中，不要切后台，不要点击屏幕，再次点击自动下载可以关闭自动下载');
            if (confirmed) {
                startAutoDownload();
            }
        } else {
            // 停止自动下载
            stopAutoDownload();
        }
    }

    // 开始自动下载
    function startAutoDownload() {
        isAutoDownloading = true;
        // 保存自动下载状态
        GM_setValue('isAutoDownloading', true);
        autoDownloadButton.textContent = '⏸️ 停止自动';
        autoDownloadButton.style.background = '#f44336';

        // 确保面板保持打开状态
        if (!isPanelVisible) {
            togglePanel();
        }

        // 禁用外部点击关闭
        if (closePanelOnOutsideClick) {
            document.removeEventListener('click', closePanelOnOutsideClick, true);
        }

        // 开始自动下载流程
        processAutoDownload();
    }

    // 停止自动下载
    function stopAutoDownload() {
        isAutoDownloading = false;
        // 清除自动下载状态
        GM_setValue('isAutoDownloading', false);
        autoDownloadButton.textContent = '🚀 自动下载';
        autoDownloadButton.style.background = '#9C27B0';

        // 恢复外部点击关闭
        document.addEventListener('click', closePanelOnOutsideClick, true);
    }

    // 页面加载完成后初始化
    function init() {
        // 恢复自动下载状态
        isAutoDownloading = GM_getValue('isAutoDownloading', false);

        // 等待页面加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    createFloatBall(); // 先创建悬浮球
                    createDownloadUI(); // 然后创建面板（但默认隐藏）

                    // 检查是否需要继续自动下载
                    if (isAutoDownloading) {
                        // 更新按钮状态
                        if (autoDownloadButton) {
                            autoDownloadButton.textContent = '⏸️ 停止自动';
                            autoDownloadButton.style.background = '#f44336';
                        }
                        // 确保面板打开
                        if (!isPanelVisible && buttonContainer) {
                            togglePanel();
                        }
                        // 禁用外部点击关闭
                        document.removeEventListener('click', closePanelOnOutsideClick, true);

                        // 继续自动下载流程
                        setTimeout(() => {
                            processAutoDownload();
                        }, 2000);
                    }
                }, 1000);
            });
        } else {
            setTimeout(() => {
                createFloatBall(); // 先创建悬浮球
                createDownloadUI(); // 然后创建面板（但默认隐藏）

                // 检查是否需要继续自动下载
                if (isAutoDownloading) {
                    // 更新按钮状态
                    if (autoDownloadButton) {
                        autoDownloadButton.textContent = '⏸️ 停止自动';
                        autoDownloadButton.style.background = '#f44336';
                    }
                    // 确保面板打开
                    if (!isPanelVisible && buttonContainer) {
                        togglePanel();
                    }
                    // 禁用外部点击关闭
                    document.removeEventListener('click', closePanelOnOutsideClick, true);

                    // 继续自动下载流程
                    setTimeout(() => {
                        processAutoDownload();
                    }, 2000);
                }
            }, 1000);
        }
    }

    // 启动
    init();
})();

